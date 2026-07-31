"""Plateau Strategy Solution Lab — Transportation booking app.

Roles:
  - Client : books a ride (/book)            -> creates a Square invoice
  - Renter : driver renting a car from us (/renter)
             sees their car info + a SHARED pool of open reservations,
             and can claim ("pick") one. Once claimed it leaves the pool.
  - Agent  : referral partner (/agent)
             registers an account, submits client info (creates a reservation),
             and earns commission per referral.

Data persists in JSON files: reservations.json, renters.json, agents.json.

Run:  python3 app.py   ->  http://localhost:5060
"""
import os
import re
import json
import time
import hashlib
import secrets
import threading
import subprocess
import datetime
import urllib.parse
import shutil
from functools import wraps
from flask import Flask, request, jsonify, send_file, session, Response

try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
except Exception:
    pass

import square_client
import notify
import paypal_client

def _no_tags(s):
    """Defense-in-depth vs stored XSS: strip angle brackets from any string
    that ends up rendered in every visitor's browser. Pages escape on render
    too — this guard protects any future sink someone forgets."""
    return (s or "").replace("<", "").replace(">", "")


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ---------------------------------------------------------------- where data lives
# The code ships in BASE_DIR; everything the site SAVES lives in DATA_DIR. On a
# host whose filesystem is reset on each deploy — which is what free Render does
# — those being the same directory means every reservation, agent code and guide
# listing is destroyed the next time anyone pushes. Pointing DATA_DIR at a
# mounted disk keeps them.
#
# Unset, DATA_DIR is BASE_DIR, so local development and the existing deployment
# behave exactly as before. Set, any file the repository ships (the seeded
# destinations book, pricing) is copied across once on first boot, so switching
# it on never starts the site with an empty book.
DATA_DIR = os.environ.get("DATA_DIR", "").strip() or BASE_DIR
_SEEDED = set()


def _data_dir(name):
    """A directory of uploaded files, kept beside the data rather than the code."""
    d = os.path.join(DATA_DIR, name)
    try:
        os.makedirs(d, exist_ok=True)
    except Exception:
        pass
    return d


def _data_path(name):
    """Path to a file the site writes, seeding it from the repo copy just once."""
    if DATA_DIR == BASE_DIR:
        return os.path.join(BASE_DIR, name)
    target = os.path.join(DATA_DIR, name)
    if name not in _SEEDED:
        _SEEDED.add(name)
        try:
            os.makedirs(DATA_DIR, exist_ok=True)
            shipped = os.path.join(BASE_DIR, name)
            if not os.path.exists(target) and os.path.exists(shipped):
                shutil.copy2(shipped, target)
        except Exception:
            pass
    return target


RES_PATH = _data_path("reservations.json")
RENTERS_PATH = _data_path("renters.json")
AGENTS_PATH = _data_path("agents.json")
ARTICLES_PATH = _data_path("articles.json")
TRAFFIC_PATH = _data_path("traffic.json")
CUSTOMERS_PATH = _data_path("customers.json")
FINANCE_PATH = _data_path("finance_signups.json")
WISHLIST_PATH = _data_path("finance_wishlist.json")
PARTNERS_PATH = _data_path("partners.json")
PRICING_PATH = _data_path("pricing.json")
OWNER_AUTH_PATH = _data_path("owner_auth.json")
SECRET_PATH = _data_path(".flask_secret")
CONTRACT_PATH = _data_path("contract.json")
SIGNATURES_PATH = _data_path("contract_signatures.json")
_LOCK = threading.Lock()


def _hash_pw(password, salt=None):
    salt = salt or hashlib.sha256(os.urandom(16)).hexdigest()[:16]
    h = hashlib.sha256((salt + (password or "")).encode()).hexdigest()
    return salt, h


def _verify_pw(password, salt, h):
    return hashlib.sha256((salt + (password or "")).encode()).hexdigest() == h


def _last_name(full):
    parts = (full or "").strip().lower().split()
    return parts[-1] if parts else ""


def _get_secret():
    """Stable Flask session secret — from env, else a persisted random file."""
    env = os.environ.get("SECRET_KEY", "").strip()
    if env:
        return env
    try:
        with open(SECRET_PATH) as f:
            s = f.read().strip()
        if s:
            return s
    except Exception:
        pass
    s = secrets.token_hex(32)
    try:
        with open(SECRET_PATH, "w") as f:
            f.write(s)
    except Exception:
        pass
    return s


app = Flask(__name__)
app.secret_key = _get_secret()


# ---------- owner authentication (protects the dispatch control center) ----------
def _load_owner():
    try:
        with open(OWNER_AUTH_PATH) as f:
            return json.load(f)
    except Exception:
        return None


def owner_required(fn):
    @wraps(fn)
    def wrapper(*a, **k):
        if not session.get("owner"):
            return jsonify({"ok": False, "auth_required": True, "error": "Login required."}), 401
        return fn(*a, **k)
    return wrapper


def _self_or_owner(session_key, url_param):
    """A driver/agent may only reach their OWN record; the owner may reach any.
    Without this, any of these URLs could be requested with someone else's id —
    the routes below used to trust whatever id the browser sent, with nothing
    checking that the caller had actually logged in as that person."""
    def deco(fn):
        @wraps(fn)
        def wrapper(*a, **k):
            if session.get("owner") or (session.get(session_key) and session.get(session_key) == k.get(url_param)):
                return fn(*a, **k)
            return jsonify({"ok": False, "auth_required": True, "error": "Login required."}), 401
        return wrapper
    return deco


renter_self_or_owner = _self_or_owner("renter_id", "rid")
agent_self_or_owner = _self_or_owner("agent_id", "aid")


@app.route("/api/owner/status")
def api_owner_status():
    return jsonify({"ok": True, "configured": _load_owner() is not None,
                    "logged_in": bool(session.get("owner")), "username": session.get("owner")})


@app.route("/api/owner/setup", methods=["POST"])
def api_owner_setup():
    """First-time only: the owner creates their dispatch login."""
    if _load_owner() is not None:
        return jsonify({"ok": False, "error": "A dispatch login already exists."}), 403
    data = request.get_json(force=True, silent=True) or {}
    u = (data.get("username") or "").strip()
    pw = data.get("password") or ""
    if not u or len(pw) < 6:
        return jsonify({"ok": False, "error": "Enter a username and a password of at least 6 characters."}), 400
    salt, h = _hash_pw(pw)
    with open(OWNER_AUTH_PATH, "w") as f:
        json.dump({"username": u, "salt": salt, "hash": h,
                   "created_at": datetime.datetime.now().isoformat(timespec="seconds")}, f, indent=2)
    session["owner"] = u
    return jsonify({"ok": True, "username": u})


@app.route("/api/owner/login", methods=["POST"])
def api_owner_login():
    data = request.get_json(force=True, silent=True) or {}
    u = (data.get("username") or "").strip()
    pw = data.get("password") or ""
    owner = _load_owner()
    if not owner or owner.get("username", "").lower() != u.lower() \
            or not _verify_pw(pw, owner.get("salt", ""), owner.get("hash", "")):
        return jsonify({"ok": False, "error": "Wrong username or password."}), 401
    session["owner"] = owner.get("username")
    return jsonify({"ok": True, "username": owner.get("username")})


@app.route("/api/owner/logout", methods=["POST"])
def api_owner_logout():
    session.pop("owner", None)
    return jsonify({"ok": True})


# ---------- storage helpers ----------
def _load(path):
    try:
        with open(path) as f:
            return json.load(f)
    except Exception:
        return []


def _save(path, items):
    tmp = path + ".tmp"
    with open(tmp, "w") as f:
        json.dump(items, f, indent=2)
    os.replace(tmp, path)


# ---------- site traffic — self-hosted, no third party ----------
TRAFFIC_MAX_DAYS = 120  # bound file growth; older days are just dropped
# Pages tracked individually for the "which tool" breakdown; every other
# page rolls into a single "other" bucket so the archive table stays short.
TRAFFIC_TOOL_PATHS = {"/trip-planner": "trip_planner", "/destination-book": "destination_book",
                       "/favorite-place": "favorite_place"}

# ---------- traffic we should not be counting ----------
# The number beside the map is meant to tell Sean whether strangers are using
# the tools. Our own laptops and phones, and the browser used to test a build,
# were being counted the same as a visitor from Ohio — so a quiet day could read
# as thirty travellers. Three exclusions, cheapest first:
#   · a device that has opted out (a cookie set once, kept for years)
#   · an address on the ignore list (Sean's home or office)
#   · anything that identifies itself as a bot or crawler
TRAFFIC_OPTOUT_COOKIE = "psx_nocount"
_BOT_HINTS = ("bot", "crawler", "spider", "slurp", "headless", "curl/", "wget",
              "python-requests", "monitor", "pingdom", "uptime", "lighthouse",
              "preview", "scrapy", "facebookexternalhit", "embedly")


def _ignored_ips():
    raw = os.environ.get("TRAFFIC_IGNORE_IPS", "")
    return {_norm_ip(s) for s in raw.split(",") if s.strip()}


def _norm_ip(raw):
    """Normalise an address so the ignore list matches what actually arrives.

    A local or proxied request often turns up as an IPv4 address wrapped in IPv6
    form — "::ffff:127.0.0.1" — which never equals the "127.0.0.1" someone wrote
    in the ignore list. Unwrap it, and drop any :port a proxy appended.
    """
    s = (raw or "").strip()
    if not s:
        return ""
    if s.lower().startswith("::ffff:"):
        s = s[7:]
    if s.count(":") == 1 and s.count(".") == 3:      # 1.2.3.4:5678
        s = s.split(":")[0]
    return s.strip("[]")


def _client_ip():
    fwd = request.headers.get("X-Forwarded-For", "")
    raw = fwd.split(",")[0] if fwd else (request.remote_addr or "")
    return _norm_ip(raw)


def _skip_traffic():
    """True when this request should not appear in any visitor number."""
    if request.cookies.get(TRAFFIC_OPTOUT_COOKIE) == "1":
        return True
    if _client_ip() in _ignored_ips():
        return True
    ua = (request.headers.get("User-Agent") or "").lower()
    if not ua:
        return True                      # no user agent at all is not a person
    return any(h in ua for h in _BOT_HINTS)


@app.route("/api/traffic/optout")
def api_traffic_optout():
    """Open this once on a device and it stops being counted — ours, or anyone's
    who asks. Sets a plain flag cookie; no identity is stored either way."""
    on = request.args.get("off") != "1"
    resp = jsonify({"ok": True, "counted": not on,
                    "message": ("This device is no longer counted as a visitor."
                                if on else "This device is being counted again.")})
    if on:
        resp.set_cookie(TRAFFIC_OPTOUT_COOKIE, "1", max_age=60 * 60 * 24 * 3650,
                        httponly=True, samesite="Lax")
    else:
        resp.delete_cookie(TRAFFIC_OPTOUT_COOKIE)
    return resp


# ---------- who's actually here RIGHT NOW ----------
# Deliberately in-memory and ephemeral: presence is a live fact, not a record.
# It never touches disk, resets on restart, and holds only anonymous cookie ids
# with a last-seen stamp — nothing identifying, nothing retained.
_PRESENCE = {}                 # anonymous vid -> last-seen epoch seconds
_PRESENCE_WINDOW = 300         # "online" = seen in the last 5 minutes
_PRESENCE_MAX = 5000           # hard bound so a burst can't grow memory unchecked


def _presence_touch(vid):
    if not vid:
        return
    now = time.time()
    _PRESENCE[vid] = now
    if len(_PRESENCE) > _PRESENCE_MAX:
        for k in [k for k, t in list(_PRESENCE.items()) if now - t > _PRESENCE_WINDOW]:
            _PRESENCE.pop(k, None)


def _presence_count():
    now = time.time()
    for k in [k for k, t in list(_PRESENCE.items()) if now - t > _PRESENCE_WINDOW]:
        _PRESENCE.pop(k, None)
    return len(_PRESENCE)


def _load_traffic():
    try:
        with open(TRAFFIC_PATH) as f:
            d = json.load(f)
        if isinstance(d, dict) and isinstance(d.get("days"), dict):
            return d
    except Exception:
        pass
    return {"days": {}}


def _save_traffic(d):
    tmp = TRAFFIC_PATH + ".tmp"
    with open(tmp, "w") as f:
        json.dump(d, f, indent=2)
    os.replace(tmp, TRAFFIC_PATH)


def _visit_source():
    """Where this visit came from, as ONE short label.

    utm_source wins when present, because that is what an ad platform sets.
    Otherwise the referring host, collapsed to a family — every Google property
    is 'google', not 'www.google.co.uk' — so a week of ad spend adds up to a
    single row instead of scattering across forty near-identical strings.

    Deliberately coarse: a label, never a URL and never a full referrer. It is
    stored as a per-day counter, never against a visitor, so this cannot become
    a trail of who went where."""
    utm = (request.args.get("utm_source") or "").strip().lower()[:32]
    if utm:
        return re.sub(r"[^a-z0-9_.-]", "", utm) or "other"
    ref = (request.referrer or "").strip()
    if not ref:
        return "direct"
    try:
        host = urllib.parse.urlparse(ref).hostname or ""
    except Exception:
        return "other"
    host = host.lower()
    if host.startswith("www."):
        host = host[4:]
    if not host:
        return "direct"
    if SITE_HOSTS and any(host == h or host.endswith("." + h) for h in SITE_HOSTS):
        return "internal"                       # our own pages linking to each other
    for fam in ("google", "bing", "duckduckgo", "yahoo", "facebook", "instagram",
                "reddit", "youtube", "tiktok", "linkedin", "chatgpt", "perplexity",
                "claude", "yelp", "tripadvisor"):
        if fam in host:
            return fam
    parts = host.split(".")
    return (".".join(parts[-2:]) if len(parts) > 1 else host)[:32]


def record_conversion(kind):
    """Count something that actually mattered, against the source that brought
    them. Without this an ad test only ever proves that pageviews went up."""
    try:
        src = request.cookies.get("psx_src") or "direct"
        today = datetime.date.today().isoformat()
        with _LOCK:
            data = _load_traffic()
            rec = data["days"].setdefault(today, {"pageviews": 0, "visitor_ids": [], "paths": {}})
            conv = rec.setdefault("conversions", {})
            conv.setdefault(kind, {})
            conv[kind][src] = conv[kind].get(src, 0) + 1
            _save_traffic(data)
    except Exception:
        pass


@app.after_request
def _track_traffic(resp):
    """Lightweight, self-hosted page-view counter — no third-party analytics,
    no ad tracking. Counts real page loads only (GET, 200, text/html); API
    calls and static assets never touch this. A "unique visitor" is
    approximated by an anonymous long-lived cookie — nothing identifying —
    and the raw cookie id is only ever kept for TODAY's still-open day.
    Once a day finishes it's folded down to a plain count and never grows
    again, so this file can't turn into a visitor-tracking log over time."""
    try:
        if request.method == "GET" and resp.status_code == 200 \
                and (resp.mimetype or "").startswith("text/html") \
                and not _skip_traffic():
            vid = request.cookies.get("psx_vid")
            set_cookie = not vid
            set_src = None
            if set_cookie:
                vid = secrets.token_hex(16)
            _presence_touch(vid)
            today = datetime.date.today().isoformat()
            with _LOCK:
                data = _load_traffic()
                days = data["days"]
                # Finalize any day that isn't today — its ids are spent, strip them.
                for d, rec in days.items():
                    if d != today and "visitor_ids" in rec:
                        rec["unique_visitors"] = len(rec["visitor_ids"])
                        del rec["visitor_ids"]
                    if d != today and "path_ids" in rec:
                        rec["path_uniques"] = {k: len(v) for k, v in rec["path_ids"].items()}
                        del rec["path_ids"]
                rec = days.setdefault(today, {"pageviews": 0, "visitor_ids": [], "paths": {}})
                rec["pageviews"] += 1
                rec["paths"][request.path] = rec["paths"].get(request.path, 0) + 1
                if vid not in rec["visitor_ids"]:
                    rec["visitor_ids"].append(vid)
                    # First touch only. Counting every pageview would credit the
                    # source that brought someone here once per page they read,
                    # which flatters whichever page is stickiest rather than
                    # whichever source actually worked.
                    src = _visit_source()
                    if src != "internal":
                        rec.setdefault("sources", {})
                        rec["sources"][src] = rec["sources"].get(src, 0) + 1
                        set_src = src
                # Who opened this particular tool, so "N travellers" can mean N
                # people rather than N page opens. Same lifecycle as visitor_ids:
                # raw ids only for today, folded to a plain count once the day ends.
                pv = rec.setdefault("path_ids", {}).setdefault(request.path, [])
                if vid not in pv:
                    pv.append(vid)
                if len(days) > TRAFFIC_MAX_DAYS:
                    for old in sorted(days.keys())[:len(days) - TRAFFIC_MAX_DAYS]:
                        del days[old]
                _save_traffic(data)
            if set_cookie:
                resp.set_cookie("psx_vid", vid, max_age=60 * 60 * 24 * 400,
                                 httponly=True, samesite="Lax")
            if set_src:
                # Carried so a booking made later can be credited to the source
                # that brought them. Holds a label like "google", never a URL,
                # and expires in 30 days — an ad click is not owed credit for a
                # booking made a year later.
                resp.set_cookie("psx_src", set_src, max_age=60 * 60 * 24 * 30,
                                httponly=True, samesite="Lax")
    except Exception:
        pass
    return resp


# ---------- driver contract helpers ----------
DEFAULT_CONTRACT = {
    "version": 1,
    "title": "Plateau Strategy — Driver & Vehicle Rental Agreement",
    "body": ("PLACEHOLDER AGREEMENT — replace this with your attorney-reviewed text "
             "on the /setup page or by editing contract.json.\n\n"
             "This Driver & Vehicle Rental Agreement is between Plateau Strategy LLC "
             "(\"the Company\") and the driver identified by the signature below "
             "(\"the Driver\").\n\n"
             "1. The Driver rents a vehicle from the Company and operates it to fulfill "
             "ride reservations offered through the Company's dispatch system.\n"
             "2. The Driver holds a valid driver's license and insurance and will keep "
             "them current for the entire rental period.\n"
             "3. The Driver is responsible for the safe operation and reasonable care of "
             "the vehicle and will report any damage or incident promptly.\n"
             "4. The Driver accepts rides voluntarily; once a ride is accepted, the Driver "
             "agrees to complete it or release it under the Company's give-up rules.\n"
             "5. Either party may end this agreement with written notice.\n\n"
             "By signing, the Driver confirms they have read, understood, and agreed to "
             "the terms above."),
    "effective_date": datetime.date.today().isoformat(),
    "updated_at": datetime.datetime.now().isoformat(timespec="seconds"),
}


def _load_contract():
    try:
        with open(CONTRACT_PATH) as f:
            c = json.load(f)
        if isinstance(c, dict) and c.get("body"):
            return c
    except Exception:
        pass
    return DEFAULT_CONTRACT


def _save_contract(c):
    tmp = CONTRACT_PATH + ".tmp"
    with open(tmp, "w") as f:
        json.dump(c, f, indent=2)
    os.replace(tmp, CONTRACT_PATH)


def _driver_signed_current(renter_id, contract=None):
    """True only if this driver has signed the CURRENT contract version."""
    contract = contract or _load_contract()
    ver = contract.get("version")
    for s in _load(SIGNATURES_PATH):
        if s.get("renter_id") == renter_id and s.get("version") == ver:
            return True
    return False


def _contract_status(renter_id):
    contract = _load_contract()
    sigs = [s for s in _load(SIGNATURES_PATH) if s.get("renter_id") == renter_id]
    ver = contract.get("version")
    signed_current = any(s.get("version") == ver for s in sigs)
    latest_signed = max([s.get("version", 0) for s in sigs], default=0)
    status = "signed" if signed_current else ("outdated" if sigs else "unsigned")
    history = sorted(
        [{"version": s.get("version"), "typed_name": s.get("typed_name"),
          "signed_at": s.get("signed_at")} for s in sigs],
        key=lambda x: x.get("version") or 0, reverse=True)
    return {
        "status": status,
        "current_version": ver,
        "signed_version": latest_signed or None,
        "needs_signature": not signed_current,
        "history": history,
    }


def _update_env(updates):
    """Replace or append KEY=value lines in the .env file. Used by /setup so the
    user can paste their Square token into a form instead of editing a dotfile."""
    path = os.path.join(BASE_DIR, ".env")
    try:
        with open(path) as f:
            lines = f.read().splitlines()
    except FileNotFoundError:
        lines = []
    done, out = set(), []
    for ln in lines:
        s = ln.strip()
        if s and not s.startswith("#") and "=" in s:
            k = s.split("=", 1)[0].strip()
            if k in updates:
                out.append("%s=%s" % (k, updates[k]))
                done.add(k)
                continue
        out.append(ln)
    for k, v in updates.items():
        if k not in done:
            out.append("%s=%s" % (k, v))
    with open(path, "w") as f:
        f.write("\n".join(out) + "\n")


def _next_id(items, prefix, datestamp=True):
    if datestamp:
        today = datetime.date.today().strftime("%Y%m%d")
        n = sum(1 for r in items if str(r.get("id", "")).startswith("%s_%s" % (prefix, today))) + 1
        return "%s_%s_%03d" % (prefix, today, n)
    return "%s_%04d" % (prefix, len(items) + 1)


def _commission_rate(agent):
    if agent and agent.get("commission_rate") is not None:
        try:
            return float(agent["commission_rate"])
        except Exception:
            pass
    try:
        return float(os.environ.get("DEFAULT_COMMISSION_PCT", 0.10))
    except Exception:
        return 0.10


# Agent codes use an unambiguous alphabet (no 0/O/1/I/L)
AGENT_CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"


def _gen_agent_code(agents):
    """Generate a unique, human-friendly agent code, e.g. AGT-7K2M."""
    existing = {(a.get("code") or "").upper() for a in agents}
    while True:
        code = "AGT-" + "".join(secrets.choice(AGENT_CODE_ALPHABET) for _ in range(4))
        if code not in existing:
            return code


def _agent_commission_usd(agent):
    """Flat commission per referred customer (default $15 on the $75 service).
    A per-agent override is honored if set."""
    if agent and agent.get("commission_usd") is not None:
        try:
            return round(float(agent["commission_usd"]), 2)
        except Exception:
            pass
    try:
        return round(float(os.environ.get("AGENT_COMMISSION_USD", 15)), 2)
    except Exception:
        return 15.0


# ---------- pages ----------
@app.route("/")
def home():
    return send_file(os.path.join(BASE_DIR, "landing-page.html"))


@app.route("/plateau-logo.png")
def logo():
    return send_file(os.path.join(BASE_DIR, "plateau-logo.png"))


@app.route("/plateau-logo.svg")
def logo_svg():
    return send_file(os.path.join(BASE_DIR, "plateau-logo.svg"))


@app.route("/floatback.js")
def floatback_js():
    return send_file(os.path.join(BASE_DIR, "floatback.js"))


@app.route("/i18n.js")
def i18n_js():
    return send_file(os.path.join(BASE_DIR, "i18n.js"))


@app.route("/session.js")
def session_js():
    return send_file(os.path.join(BASE_DIR, "session.js"))


@app.route("/admin-terminal.css")
def admin_terminal_css():
    return send_file(os.path.join(BASE_DIR, "admin-terminal.css"))


@app.route("/media/<path:filename>")
def media_file(filename):
    from flask import send_from_directory
    return send_from_directory(os.path.join(BASE_DIR, "media"), filename)


@app.route("/book")
def book_page():
    return send_file(os.path.join(BASE_DIR, "booking.html"))


@app.route("/renter")
@app.route("/driver")  # alias for the old link
def renter_page():
    return send_file(os.path.join(BASE_DIR, "renter.html"))


@app.route("/agent")
def agent_page():
    return send_file(os.path.join(BASE_DIR, "agent.html"))


@app.route("/partners")
def partners_page():
    return send_file(os.path.join(BASE_DIR, "partners.html"))


@app.route("/dispatch")
def dispatch_page():
    return send_file(os.path.join(BASE_DIR, "dispatch.html"))


@app.route("/articles")
def articles_page():
    return send_file(os.path.join(BASE_DIR, "articles.html"))


@app.route("/trip-planner")
def trip_planner_page():
    """Free tool: point-to-point trip planner (drive time + traffic + closing hours)."""
    return send_file(os.path.join(BASE_DIR, "trip-planner.html"))


# ---------------------------------------------------------------------------
# Search engines
#
# The free tools are the top of the funnel — they only pay for themselves if
# people can find them. Nothing here was crawlable: no robots.txt, no sitemap,
# and the tool pages carried no canonical URL. Owner surfaces stay out of the
# sitemap and are disallowed outright, so dispatch and setup never get indexed.
# ---------------------------------------------------------------------------
PUBLIC_PAGES = [
    ("/", "1.0", "daily"),
    ("/trip-planner", "0.9", "weekly"),
    ("/destination-book", "0.9", "daily"),
    ("/road-trip", "0.9", "weekly"),
    ("/factor-clock", "0.8", "weekly"),
    ("/book", "0.8", "monthly"),
    ("/articles", "0.7", "weekly"),
    ("/partners", "0.6", "monthly"),
    ("/agent", "0.6", "monthly"),
    ("/renter", "0.6", "monthly"),
    ("/deflator", "0.5", "monthly"),
    ("/board", "0.4", "monthly"),
]
OWNER_ONLY_PATHS = ["/dispatch", "/setup", "/archive", "/api/"]
SITE_ORIGIN = os.environ.get("SITE_ORIGIN", "https://plateaustrategy.io").rstrip("/")
# Referrers from our own pages are not a traffic source — they are navigation.
SITE_HOSTS = ("plateaustrategy.io", "plateau-strategy.onrender.com")


@app.route("/robots.txt")
def robots_txt():
    lines = ["User-agent: *"]
    lines += ["Disallow: " + p for p in OWNER_ONLY_PATHS]
    lines += ["Allow: /", "", "Sitemap: " + SITE_ORIGIN + "/sitemap.xml", ""]
    return Response("\n".join(lines), mimetype="text/plain")


@app.route("/llms.txt")
def llms_txt():
    """A plain-language map of the site for AI assistants.

    An assistant answering "what can I do in Seattle tomorrow" reads pages, not
    JavaScript. This states what exists, what it does and where it lives, so an
    assistant can describe and link the tools accurately instead of guessing
    from an app shell."""
    body = """# Plateau Strategy Solution Lab

> An integrated business ecosystem in the Seattle area: affordable Tesla rides
> and rentals, plus free travel-planning tools that anyone can use without an
> account.

## Free tools (no account, no cost)

- [Trip Planner](%(o)s/trip-planner): Pick attractions and see which ones you can
  still reach before they close. Uses real drive times, current traffic and each
  place's opening hours. Plans multiple days and asks where you're staying
  overnight so the next morning starts from your hotel.
- [Road Trip Planner](%(o)s/road-trip): For long drives. Give it two points and it
  finds the fuel, food, rest stops and viewpoints near your actual route,
  grouped by how many hours into the drive they are.
- [Destination Book](%(o)s/destination-book): A growing guidebook of attractions
  and restaurants with local tips from a licensed guide.
- [The Factor Clock](%(o)s/factor-clock): A prediction clock scored against what
  actually happened, and honest about when it does not know.

## Services

- [Book a Ride](%(o)s/book): Flat-rate Tesla rides, booked online, invoice sent
  automatically. Seattle area, including SeaTac airport transfers.
- [Driver Portal](%(o)s/renter): Rent a Tesla and earn from a shared pool of
  client rides.
- [Agent Program](%(o)s/agent): Refer clients and earn commission per completed
  ride. Suited to hotels, travel agencies and individuals with a network.
- [Partners](%(o)s/partners): Partnership information.

## Notes for assistants

- The planning tools are free and need no sign-up; link people straight to them.
- Attraction opening hours come from OpenStreetMap and can be incomplete. The
  planner marks a time it could not confirm rather than presenting a guess.
- Drive times come from live routing, not straight-line estimates.
- Ride prices and availability change; point people to the booking page rather
  than quoting a figure.
""" % {"o": SITE_ORIGIN}
    return Response(body, mimetype="text/plain")


@app.route("/sitemap.xml")
def sitemap_xml():
    today = datetime.date.today().isoformat()
    out = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for path, priority, freq in PUBLIC_PAGES:
        out += ["  <url>",
                "    <loc>%s%s</loc>" % (SITE_ORIGIN, path),
                "    <lastmod>%s</lastmod>" % today,
                "    <changefreq>%s</changefreq>" % freq,
                "    <priority>%s</priority>" % priority,
                "  </url>"]
    out.append("</urlset>")
    return Response("\n".join(out), mimetype="application/xml")


@app.route("/road-trip")
def road_trip_page():
    """Free tool: long-haul planner — fuel, food, rest areas and viewpoints found
    along the actual route and grouped by how many hours into the drive they are.
    The city planner answers 'what can I reach from here'; this answers
    'what is on the way'."""
    return send_file(os.path.join(BASE_DIR, "road-trip.html"))


@app.route("/destination-book")
def destination_book_page():
    """Free tool: curated guidebook of attractions + restaurants; feeds the trip planner."""
    return send_file(os.path.join(BASE_DIR, "destination-book.html"))


@app.route("/favorite-place")
def favorite_place_page():
    """Free tool: a 2-question data-collection flow — search a place, say how
    long you stayed — that feeds the same community pipeline as the planner."""
    return send_file(os.path.join(BASE_DIR, "favorite-place.html"))


@app.route("/factor-clock")
def factor_clock_page():
    """Free tool: the Factor Clock — an honest prediction engine (free founding beta)."""
    return send_file(os.path.join(BASE_DIR, "factor-clock.html"))


@app.route("/api/clock/signup", methods=["POST"])
def api_clock_signup():
    """Founding-beta email capture for the Factor Clock (free now, $10/yr later)."""
    data = request.get_json(force=True, silent=True) or {}
    email = (data.get("email") or "").strip()
    if not email or "@" not in email:
        return jsonify({"ok": False, "error": "Please enter a valid email."}), 400
    path = _data_path("clock_signups.json")
    with _LOCK:
        signups = _load(path)
        if any((s.get("email") or "").lower() == email.lower() for s in signups):
            return jsonify({"ok": True, "note": "already on the list"})
        signups.append({
            "id": _next_id(signups, "CLK", datestamp=False),
            "created_at": datetime.datetime.now().isoformat(timespec="seconds"),
            "email": email, "source": "factor-clock free tool",
        })
        _save(path, signups)
    return jsonify({"ok": True})


def _public_book_entries(entries):
    """Entries safe to publish.

    The write-side guard only protects places added from now on. Anything a
    visitor added before it existed is still in the file, and on the live
    server that file is not something we can hand-edit. Stored entries keep no
    OpenStreetMap classification — only a name — so the one honest test left is
    the name itself: nothing worth visiting is called "412 Maple St".

    Cheap, and it fails in the safe direction: at worst a genuine place with a
    number for a name waits until someone re-adds it under its real name."""
    return [e for e in entries or []
            if not _ADDRESS_LIKE.match((e.get("name") or ""))]


@app.route("/api/destinations")
def api_destinations():
    try:
        with open(_data_path("destinations.json")) as f:
            data = json.load(f)
        data["entries"] = _public_book_entries(data.get("entries"))
        # ride the crowd's real stay times AND star ratings along with each place
        times = _visit_all()
        ratings = _ratings_all()
        comments = _comments_all()
        for e in data.get("entries", []):
            # Stay times are stored split by source (public crowd vs verified
            # guide). This read used to assume the OLD flat shape, so it silently
            # matched nothing and no book entry ever showed a crowd stay time.
            rec = times.get(_visit_key(e.get("city"), e.get("name")))
            if rec:
                pub, gd = _visit_side(rec, "public"), _visit_side(rec, "guide")
                if gd.get("n", 0) >= GUIDE_MIN_N and gd.get("median") is not None:
                    e["typical_visit"] = gd["median"]      # a guide's word outranks the crowd
                    e["visit_n"] = gd["n"]
                    e["visit_source"] = "guide"
                elif pub.get("n", 0) >= VISIT_MIN_N and pub.get("median") is not None:
                    e["typical_visit"] = pub["median"]
                    e["visit_n"] = pub["n"]
                    e["visit_source"] = "public"
            r = ratings.get(_visit_key(e.get("city"), e.get("name")))
            if r and r.get("n", 0) >= 1:
                e["stars"] = r["avg"]           # community average, 1–5
                e["rating_count"] = r["n"]
            k = _visit_key(e.get("city"), e.get("name"))
            e["comment_count"] = len(comments.get(k, []))
            # a place a traveler discovered in the last 30 days is NEW to the book
            if e.get("source") == "user" and e.get("added_at"):
                try:
                    age = (datetime.datetime.now()
                           - datetime.datetime.fromisoformat(e["added_at"])).days
                    e["is_new"] = age <= 30
                    e["days_old"] = age
                except Exception:
                    pass
        return jsonify(data)
    except Exception as e:
        return jsonify({"cities": {}, "entries": [], "error": str(e)}), 500


def _local_iso_epoch(s):
    """Seconds since the epoch for a naive local-time ISO string, or None."""
    try:
        return int(datetime.datetime.fromisoformat(str(s)).timestamp())
    except Exception:
        return None


@app.route("/api/geography")
def api_geography():
    """State → county → city, built from what has actually been discovered.

    The planner ships with three or four cities hard-coded. Every place a
    traveller searches for is filed with its state and county, so this returns
    the real, growing hierarchy — search Mount Rushmore once and South Dakota
    appears in the picker for everyone after you. Places recorded before this
    existed have no state and are simply left out rather than guessed at.
    """
    try:
        with open(_data_path("destinations.json")) as f:
            d = json.load(f)
    except Exception:
        return jsonify({"ok": True, "geo": {}, "cities": {}})
    cities = d.get("cities", {})
    geo, seen = {}, {}
    for e in _public_book_entries(d.get("entries")):
        state = (e.get("state") or "").strip()
        city = (e.get("city") or "").strip()
        if not (state and city):
            continue
        county = (e.get("county") or state).strip()
        label = (e.get("city_label") or cities.get(city) or city.title()).strip()
        counties = geo.setdefault(state, {})
        lst = counties.setdefault(county, [])
        if city not in seen.setdefault((state, county), set()):
            seen[(state, county)].add(city)
            lst.append([city, label])
    for counties in geo.values():
        for lst in counties.values():
            lst.sort(key=lambda p: p[1])
    return jsonify({"ok": True, "geo": geo, "cities": cities})


@app.route("/api/discoveries")
def api_discoveries():
    """What travelers have been discovering lately, newest first, worldwide —
    the visible proof that the map grows by itself."""
    try:
        with open(_data_path("destinations.json")) as f:
            d = json.load(f)
    except Exception:
        return jsonify({"ok": True, "recent": [], "by_city": [], "total": 0})
    cities = d.get("cities", {})
    found = [e for e in _public_book_entries(d.get("entries"))
             if e.get("source") == "user" and e.get("added_at")]
    found.sort(key=lambda e: e.get("added_at", ""), reverse=True)
    tally = {}
    for e in found:
        tally[e.get("city", "")] = tally.get(e.get("city", ""), 0) + 1
    return jsonify({
        "ok": True,
        "total": len(found),
        "city_count": len({e.get("city") for e in found}),
        # added_at is written in the server's own local time with no zone marker,
        # which a browser would read as UTC and report hours off. Send a real
        # epoch alongside it so "3 minutes ago" means three minutes ago.
        "recent": [{"name": e.get("name"), "city": e.get("city"),
                    "city_label": cities.get(e.get("city"), e.get("city")),
                    "cat": e.get("cat"), "at": e.get("added_at"),
                    "at_ts": _local_iso_epoch(e.get("added_at"))} for e in found[:12]],
        "by_city": sorted(({"city": k, "label": cities.get(k, k), "n": v} for k, v in tally.items()),
                          key=lambda r: -r["n"])[:12],
    })


# ---------- 💬 destination comments — the community's own guidebook ----------
# A place someone DISCOVERED by searching becomes an entry others can talk
# about: what it's really like, what to know before you go. Keyed city|name
# like every other community store. Free text, no account — so it is capped,
# tag-stripped, and visible to the owner in the Archive.
COMMENTS_PATH = _data_path("destination_comments.json")
COMMENT_MAX_PER_PLACE = 200


def _comments_all():
    d = _load(COMMENTS_PATH)
    return d if isinstance(d, dict) else {}


@app.route("/api/destinations/comments")
def api_destination_comments():
    """Every comment on one place, oldest first."""
    key = _visit_key(request.args.get("city"), request.args.get("name"))
    items = _comments_all().get(key, [])
    return jsonify({"ok": True, "comments": items, "count": len(items)})


@app.route("/api/destinations/comment", methods=["POST"])
def api_destination_comment_add():
    d = request.get_json(force=True, silent=True) or {}
    name = _no_tags((d.get("name") or "").strip())[:80]
    city = _no_tags((d.get("city") or "").strip().lower())[:40]
    text = _no_tags((d.get("text") or "").strip())[:400]
    author = _no_tags((d.get("author") or "").strip())[:40] or "Traveler"
    if len(name) < 2:
        return jsonify({"ok": False, "error": "Which place?"}), 400
    if len(text) < 2:
        return jsonify({"ok": False, "error": "Write a few words first."}), 400
    key = _visit_key(city, name)
    with _LOCK:
        allc = _comments_all()
        items = allc.setdefault(key, [])
        if len(items) >= COMMENT_MAX_PER_PLACE:
            return jsonify({"ok": False, "error": "This place has plenty of notes already."}), 429
        items.append({"id": "CMT_%d" % (int(time.time() * 1000) % 10**10),
                      "text": text, "author": author, "place": name, "city": city,
                      "at": datetime.datetime.now().isoformat(timespec="seconds")})
        _save(COMMENTS_PATH, allc)
        n = len(items)
    return jsonify({"ok": True, "count": n})


# ---------- how long people actually stay (crowd memory) ----------
# Everyone who sets a visit length in the Trip Planner teaches the site something.
# We keep the MEDIAN, never the average — one person typing 999 must not move the
# recommendation — and we refuse to recommend anything until enough people have
# said it. No identities are stored: this is a list of durations, nothing else.
VISITS_PATH = _data_path("visit_times.json")
VISIT_MIN_N = 3          # below this we have an opinion, not a fact — stay quiet
GUIDE_MIN_N = 1          # a verified guide's endorsement stands on its own
VISIT_MAX_SAMPLES = 300  # per place; oldest fall off
# Up to three days: a national park, a festival or a ski trip is a real answer
# to "how long did you stay", and capping it at ten hours quietly forced anyone
# who stayed longer to understate it — which then taught the next traveller too
# short a visit.
VISIT_MIN_M, VISIT_MAX_M = 5, 4320


def _visit_key(city, name):
    return "%s|%s" % ((city or "").strip().lower(), (name or "").strip().lower())


def _visit_role(guide_code):
    """A guide's judgment is worth more than a stranger's — but only a REAL guide's.
    'guide' is granted solely by a verified agent code; anyone can claim it otherwise,
    and a claimed endorsement is worth nothing."""
    code = (guide_code or "").strip().upper()
    if not code:
        return "public"
    for a in _load(AGENTS_PATH):
        if (a.get("code") or "").strip().upper() == code:
            return "guide"
    return "public"


def _visit_side(rec, role):
    side = rec.get(role)
    if not isinstance(side, dict):
        side = {"samples": [], "n": 0}
    return side


def _visit_all():
    d = _load(VISITS_PATH)
    return d if isinstance(d, dict) else {}


def _median(nums):
    s = sorted(nums)
    n = len(s)
    if not n:
        return None
    mid = n // 2
    return float(s[mid]) if n % 2 else (s[mid - 1] + s[mid]) / 2.0


# ---------- star ratings (real, community-driven) ----------
# Visitors rate a place 1–5 stars anywhere in the planner; we keep the average and
# the count. No fabricated stars — a place shows stars only once someone rates it.
RATINGS_PATH = _data_path("place_ratings.json")


def _ratings_all():
    d = _load(RATINGS_PATH)
    return d if isinstance(d, dict) else {}


@app.route("/api/rate", methods=["POST"])
def api_rate():
    d = request.get_json(silent=True) or {}
    name = (d.get("name") or "").strip()[:80]
    city = (d.get("city") or "").strip()[:40]
    try:
        stars = int(round(float(d.get("stars"))))
    except (TypeError, ValueError):
        return jsonify({"ok": False, "error": "stars required"}), 400
    if len(name) < 2 or not (1 <= stars <= 5):
        return jsonify({"ok": False, "error": "need a place and 1–5 stars"}), 400
    key = _visit_key(city, name)
    with _LOCK:
        allr = _ratings_all()
        rec = allr.get(key) or {"samples": [], "n": 0}
        rec["samples"] = (rec.get("samples") or [])[-499:] + [stars]   # bounded
        rec["n"] = len(rec["samples"])
        rec["avg"] = round(sum(rec["samples"]) / rec["n"], 1)
        allr[key] = rec
        _save(RATINGS_PATH, allr)
    return jsonify({"ok": True, "avg": rec["avg"], "count": rec["n"]})


@app.route("/api/visit-times")
def api_visit_times():
    """What the crowd says a stop is worth, per city. Only places that cleared
    the sample floor are returned — the rest are still listening."""
    city = (request.args.get("city") or "").strip().lower()
    out = {}
    for k, rec in _visit_all().items():
        c, _, nm = k.partition("|")
        if city and c != city:
            continue
        pub, gd = _visit_side(rec, "public"), _visit_side(rec, "guide")
        row = {}
        if pub.get("n", 0) >= VISIT_MIN_N:
            row["public"] = {"median": pub["median"], "n": pub["n"]}
        if gd.get("n", 0) >= GUIDE_MIN_N:          # one professional endorsement counts
            row["guide"] = {"median": gd["median"], "n": gd["n"]}
        if row:
            # what the planner should actually use: a guide's word outranks the crowd
            row["median"] = (row.get("guide") or row["public"])["median"]
            row["source"] = "guide" if "guide" in row else "public"
            out[nm] = row
    return jsonify({"ok": True, "city": city, "min_n": VISIT_MIN_N,
                    "guide_min_n": GUIDE_MIN_N, "places": out})


@app.route("/api/visit-time", methods=["POST"])
def api_visit_time_record():
    """Someone set how long they want at a place — remember it for everyone."""
    d = request.get_json(silent=True) or {}
    name = (d.get("name") or "").strip()[:80]
    city = (d.get("city") or "").strip()[:40]
    try:
        minutes = int(round(float(d.get("minutes"))))
    except (TypeError, ValueError):
        return jsonify({"ok": False, "error": "minutes required"}), 400
    if len(name) < 2:
        return jsonify({"ok": False, "error": "name required"}), 400
    if not (VISIT_MIN_M <= minutes <= VISIT_MAX_M):
        return jsonify({"ok": False, "error": "out of range"}), 400

    role = _visit_role(d.get("guide_code"))
    key = _visit_key(city, name)
    with _LOCK:
        allv = _visit_all()
        rec = allv.get(key) or {}
        if "samples" in rec and "public" not in rec:      # migrate the flat first format
            rec = {"public": {"samples": rec.get("samples") or [],
                              "n": rec.get("n", 0), "median": rec.get("median")}}
        side = _visit_side(rec, role)
        side["samples"] = (side.get("samples") or [])[-(VISIT_MAX_SAMPLES - 1):] + [minutes]
        side["n"] = len(side["samples"])
        side["median"] = _median(side["samples"])
        rec[role] = side
        rec["updated"] = datetime.datetime.now().isoformat(timespec="seconds")
        allv[key] = rec
        _save(VISITS_PATH, allv)
    floor = GUIDE_MIN_N if role == "guide" else VISIT_MIN_N
    return jsonify({"ok": True, "role": role, "n": side["n"],
                    "median": side["median"] if side["n"] >= floor else None,
                    "min_n": floor})


_OSM_CAT = {
    "historic": "history", "natural": "nature", "leisure": "nature",
    "tourism": "culture", "shop": "culture", "man_made": "views",
}
_OSM_TYPE_CAT = {
    "viewpoint": "views", "peak": "views", "tower": "views", "bridge": "views",
    "park": "nature", "garden": "nature", "nature_reserve": "nature", "beach": "nature",
    "restaurant": "food", "cafe": "food", "bar": "food", "pub": "food",
    "fast_food": "food", "ice_cream": "food", "marketplace": "food", "food_court": "food",
    "museum": "culture", "gallery": "culture", "artwork": "culture", "theatre": "culture",
    "aquarium": "culture", "zoo": "culture", "monument": "history", "memorial": "history",
    "castle": "history", "ruins": "history", "archaeological_site": "history",
}


def _derive_city(meta, fallback=""):
    """Where a place ACTUALLY is, taken from the geocoder's address rather than
    whichever city board the traveler happened to be looking at. This is what
    lets the book grow city by city: search Olympic National Park from the
    Seattle board and it files itself under Port Angeles, opening a new chapter
    instead of being mis-shelved."""
    addr = meta.get("address") if isinstance(meta.get("address"), dict) else {}
    for k in ("city", "town", "village", "municipality", "county"):
        v = (addr.get(k) or "").strip()
        if v:
            return _no_tags(v.lower())[:40], _no_tags(v)[:60]
    return (_no_tags((fallback or "").strip().lower())[:40], "")


def _wiki_describe(name, lat, lon):
    """A real description for a newly discovered place, from Wikipedia.

    The map's own data can only ever say what KIND of thing something is — "a
    museum in Boston" — which is true and useless. Wikipedia says what it is and
    why anyone goes. We look for an article at the same spot and only accept one
    whose title plainly matches the name searched for, so a place never inherits
    the description of its neighbour. Returns (description, photo, url) or Nones;
    every failure is silent, because a thin description is better than a failed
    search.
    """
    try:
        near = _wiki_get({"action": "query", "list": "geosearch",
                          "gscoord": "%f|%f" % (lat, lon), "gsradius": 1200, "gslimit": 12})
        found = (near.get("query") or {}).get("geosearch") or []
        if not found:
            return None, None, None

        def key(s):
            return "".join(ch for ch in str(s).lower() if ch.isalnum())

        want = key(name)
        if not want:
            return None, None, None
        best = None
        for f in found:
            t = key(f.get("title"))
            if t == want or (len(want) > 6 and (want in t or t in want)):
                best = f
                break
        if not best:
            return None, None, None
        d = _wiki_get({"action": "query", "pageids": str(best["pageid"]),
                       "prop": "extracts|pageimages", "exintro": 1, "explaintext": 1,
                       "exsentences": 2, "piprop": "thumbnail", "pithumbsize": 400})
        pg = ((d.get("query") or {}).get("pages") or [{}])[0]
        text = (pg.get("extract") or "").strip()
        if len(text) < 40:
            return None, None, None
        return (text[:600], (pg.get("thumbnail") or {}).get("source"),
                "https://en.wikipedia.org/?curid=%s" % best["pageid"])
    except Exception:
        return None, None, None


def _derive_region(meta):
    """The state and county a discovered place sits in, from the geocoder.

    Without these a new discovery can never reach the planner's State → County →
    City pickers: the city is recorded, but nothing says where in the world it
    belongs, so the only way to reach it is to already know it exists.
    """
    addr = meta.get("address") if isinstance(meta.get("address"), dict) else {}
    state = (addr.get("state") or addr.get("province")
             or addr.get("region") or addr.get("state_district") or "").strip()
    county = (addr.get("county") or addr.get("district")
              or addr.get("state_district") or "").strip()
    country = (addr.get("country") or "").strip()
    # Outside the US a "state" is often absent; the country is the honest
    # top level there, and saying so beats filing it under nothing.
    if not state and country:
        state = country
    if not county:
        county = state
    return _no_tags(state)[:60], _no_tags(county)[:60], _no_tags(country)[:60]


def _describe_osm(meta):
    """Write an honest one-line description of a place from the MAP'S OWN data.

    Nothing here is invented — the words come from OpenStreetMap's classification
    and address for that exact point. A person (or a guide) can always write a
    better one later; this just means a newly discovered place never lands in the
    book blank."""
    meta = meta or {}
    cls = (meta.get("osm_class") or meta.get("class") or "").strip().lower()
    typ = (meta.get("osm_type_name") or meta.get("type") or "").strip().lower()
    addr = meta.get("address") if isinstance(meta.get("address"), dict) else {}

    label = (typ or cls).replace("_", " ").strip()
    label = label[:1].upper() + label[1:] if label else "Place"

    where = ""
    for k in ("suburb", "neighbourhood", "quarter", "city_district",
              "city", "town", "village", "state"):
        v = (addr.get(k) or "").strip()
        if v and v.lower() not in where.lower():
            where = (where + ", " + v) if where else v
        if where.count(",") >= 1:
            break

    desc = ("%s in %s." % (label, where)) if where else ("%s." % label)
    cat = _OSM_TYPE_CAT.get(typ) or _OSM_CAT.get(cls) or "culture"
    book_type = "restaurant" if cat == "food" else "attraction"
    return desc[:300], cat, book_type


# Somebody's home is not a destination. These are OpenStreetMap's own words for
# residential buildings and plots — if the map says a point is one of these, it
# does not go in a public book, no matter who searched for it.
_RESIDENTIAL_TYPES = {
    "house", "houses", "residential", "apartments", "apartment", "detached",
    "semidetached_house", "semi_detached_house", "terrace", "terraced_house",
    "bungalow", "dormitory", "farmhouse", "static_caravan", "houseboat",
    "cabin", "hut", "trailer", "mobile_home", "annexe", "ger",
}
# A point classified under one of these is a public thing — a park, a museum, a
# shop, a station. Anything with no such classification has not earned a page.
_PUBLIC_CLASSES = {
    "tourism", "historic", "leisure", "natural", "amenity", "shop", "man_made",
    "aeroway", "railway", "waterway", "aerialway", "military", "emergency",
    "office", "craft", "healthcare", "public_transport", "attraction",
}
_ADDRESS_LIKE = re.compile(r"^\s*\d+[a-z]?[\s,-]", re.I)


def _is_private_residence(meta, name=""):
    """Does this point look like somewhere a person lives?

    Returns (True, reason) when a place must be kept out of the public
    Destination Book. It is deliberately cautious: the cost of wrongly
    publishing a home is somebody's address on the open internet forever,
    and the cost of wrongly withholding a cafe is that the book misses one
    row until the next visitor searches it with better tags.

    This never affects where a customer can be driven. It only decides what
    becomes a public page.
    """
    meta = meta or {}
    cls = (meta.get("osm_class") or meta.get("class") or "").strip().lower()
    typ = (meta.get("osm_type_name") or meta.get("type") or "").strip().lower()
    addrtype = (meta.get("addresstype") or "").strip().lower()
    addr = meta.get("address") if isinstance(meta.get("address"), dict) else {}

    if typ in _RESIDENTIAL_TYPES or addrtype in _RESIDENTIAL_TYPES:
        return True, "residential building"
    if cls == "place" and typ in ("house", "houses", "farm", "isolated_dwelling"):
        return True, "dwelling"
    if cls == "building" and typ not in ("public", "civic", "commercial",
                                         "retail", "industrial", "church",
                                         "cathedral", "temple", "mosque",
                                         "synagogue", "train_station", "hotel",
                                         "stadium", "museum"):
        return True, "unclassified building"
    if cls == "landuse" and typ == "residential":
        return True, "residential land"

    # No public classification at all, and the name is a street address rather
    # than the name of anything — "412 Maple St" is where someone lives, not a
    # place to visit. A named landmark ("Pike Place Market") never matches this,
    # and a real landmark that happens to sit at a number is normally tagged
    # tourism/historic, so it is caught by the class check above.
    if cls not in _PUBLIC_CLASSES:
        if _ADDRESS_LIKE.match(name or "") and (addr.get("house_number") or "").strip():
            return True, "street address, not a named place"

    return False, ""


@app.route("/api/destinations/add", methods=["POST"])
def api_destinations_add():
    """COMMUNITY MEMORY for the free tools: a place anyone adds in the Trip
    Planner search is remembered by the site — it joins the city's planner list
    for every future visitor AND appears in the Destination Book (tagged
    'community'). Deduped by name+city; capped so the book can't be flooded.

    Private homes are refused. Anyone can type any address into the planner and
    be driven there — that is the whole service — but a place only becomes a
    public page if it is a public place. Otherwise searching for where someone
    lives would publish their address, with coordinates, to every future
    visitor. The traveler keeps it on their own board either way."""
    data = request.get_json(force=True, silent=True) or {}
    name = _no_tags((data.get("name") or "").strip())[:80]
    if len(name) < 2:
        return jsonify({"ok": False, "error": "Name required."}), 400
    private, _why = _is_private_residence(data, name)
    if private:
        # 200, not an error: the traveler did nothing wrong and their trip is
        # unaffected. Nothing about the address is written down, including here.
        return jsonify({"ok": False, "private": True,
                        "error": "Homes and private addresses aren't added to the "
                                 "public Destination Book. Your trip is unaffected."}), 200
    try:
        lat = float(data.get("lat")); lon = float(data.get("lon"))
        if not (-90 <= lat <= 90 and -180 <= lon <= 180):
            raise ValueError
    except Exception:
        return jsonify({"ok": False, "error": "Valid coordinates required."}), 400
    # Describe it from the map's own classification so the book never gains a blank row
    auto_desc, auto_cat, auto_type = _describe_osm(data)
    auto_desc = _no_tags(auto_desc)          # built from client-supplied OSM fields
    given_desc = _no_tags((data.get("desc") or "").strip())[:300]
    cat = (data.get("cat") or "").strip().lower()
    if cat not in ("history", "culture", "nature", "food", "views"):
        cat = auto_cat
    def _clampi(v, lo, hi, dflt):
        try:
            return max(lo, min(hi, int(float(v))))
        except Exception:
            return dflt
    close = _clampi(data.get("close"), 0, 1440, 1020)
    visit = _clampi(data.get("visit"), 10, 480, 60)
    path = _data_path("destinations.json")
    with _LOCK:
        try:
            with open(path) as f:
                d = json.load(f)
        except Exception:
            d = {"cities": {}, "entries": []}
        # THE BOOK GROWS WORLDWIDE. A city we have never seen before is not an
        # error to be swept into "Other" — it is a new chapter. The first traveler
        # to search a place there names the city, and it joins the book for good.
        city, city_lbl = _derive_city(data, data.get("city"))
        cities = d.setdefault("cities", {})
        if not city:
            city = "other"
            cities.setdefault("other", "Other")
        elif city not in cities:
            if len(cities) >= 500:            # bound the chapter list
                city = "other"
                cities.setdefault("other", "Other")
            else:
                label = (city_lbl or _no_tags((data.get("city_label") or "").strip())[:60]
                         or city.title())
                cities[city] = label
        # dedupe: the site already remembers this place — but a re-search is a chance
        # to FILL IN what's still missing. A blank description gets one; a description
        # someone actually wrote is never touched.
        for e in d.get("entries", []):
            if e.get("city") == city and (e.get("name") or "").strip().lower() == name.lower():
                updated = False
                thin = (not (e.get("desc") or "").strip()
                        or (e.get("desc_from") == "map data" and not given_desc))
                if thin:
                    w_desc, w_photo, w_url = (None, None, None)
                    if not given_desc:
                        w_desc, w_photo, w_url = _wiki_describe(name, lat, lon)
                    new_desc = given_desc or w_desc or auto_desc
                    if new_desc and new_desc != "Place." and new_desc != e.get("desc"):
                        e["desc"] = new_desc
                        e["auto_desc"] = not given_desc
                        e["desc_from"] = ("guide" if given_desc else
                                          ("wikipedia" if w_desc else "map data"))
                        if w_photo:
                            e["photo"] = w_photo
                        if w_url:
                            e["source_url"] = w_url
                        updated = True
                if updated:
                    e["updated_at"] = datetime.datetime.now().isoformat(timespec="seconds")
                    with open(path, "w") as f:
                        json.dump(d, f, indent=1, ensure_ascii=False)
                return jsonify({"ok": True, "entry": e, "already_known": True, "updated": updated})
        if sum(1 for e in d.get("entries", []) if e.get("source") == "user") >= 1000:
            return jsonify({"ok": False, "error": "The community book is full for now."}), 429
        state, county, country = _derive_region(data)
        # Ask Wikipedia what this place actually is before falling back to the
        # map's "a museum in Boston". Marked auto either way, so a person's own
        # words always outrank it later.
        wiki_desc, wiki_photo, wiki_url = (None, None, None)
        if not given_desc:
            wiki_desc, wiki_photo, wiki_url = _wiki_describe(name, lat, lon)
        rec = {"name": name, "city": city, "type": auto_type, "cat": cat, "price": None,
               "close": close, "visit": visit, "lat": round(lat, 5), "lon": round(lon, 5),
               "desc": given_desc or wiki_desc or auto_desc, "tip": "",
               "photo": wiki_photo, "source_url": wiki_url,
               "source": "user", "auto_desc": not given_desc,
               "desc_from": ("guide" if given_desc else
                             ("wikipedia" if wiki_desc else "map data")),
               "found_via": (data.get("found_via") or "search")[:20],
               # where in the world it is, so the planner's pickers can find it
               "state": state, "county": county, "country": country,
               "city_label": _no_tags(city_lbl or "")[:60] or cities.get(city, city.title()),
               "added_at": datetime.datetime.now().isoformat(timespec="seconds")}
        d.setdefault("entries", []).append(rec)
        with open(path, "w") as f:
            json.dump(d, f, indent=1, ensure_ascii=False)
    return jsonify({"ok": True, "entry": rec})


@app.route("/deflator")
def deflator_page():
    """Plateau Strategy Deflator — research-project page + notify list (no offering)."""
    return send_file(os.path.join(BASE_DIR, "deflator.html"))


@app.route("/api/deflator/waitlist", methods=["POST"])
def api_deflator_waitlist():
    """Notify-only list stored locally in deflator_waitlist.json — emails get one
    update when verified results publish. No product, no funds, no claims."""
    data  = request.get_json(force=True, silent=True) or {}
    email = str(data.get("email", "")).strip().lower()
    if not email or "@" not in email or "." not in email.split("@")[-1] or len(email) > 254:
        return jsonify({"success": False, "error": "Please enter a valid email."}), 400
    path = _data_path("deflator_waitlist.json")
    with _LOCK:
        items = _load(path)
        if any(str(i.get("email", "")).lower() == email for i in items):
            return jsonify({"success": True, "already": True, "count": len(items)})
        items.append({
            "email":  email,
            "ts":     datetime.datetime.now().isoformat(timespec="seconds"),
            "source": "deflator_page",
        })
        _save(path, items)
    return jsonify({"success": True, "already": False, "count": len(items)})


@app.route("/setup")
def setup_page():
    return send_file(os.path.join(BASE_DIR, "setup.html"))


@app.route("/api/setup/status")
def api_setup_status():
    return jsonify({
        "connected": bool(os.environ.get("SQUARE_ACCESS_TOKEN") and os.environ.get("SQUARE_LOCATION_ID")),
        "has_token": bool(os.environ.get("SQUARE_ACCESS_TOKEN")),
        "location_id": os.environ.get("SQUARE_LOCATION_ID", ""),
        "env": os.environ.get("SQUARE_ENV", "sandbox"),
    })


@app.route("/api/setup/twilio", methods=["POST"])
def api_setup_twilio():
    """Save pasted Twilio credentials to .env and load them live (no restart)."""
    data = request.get_json(force=True, silent=True) or {}
    sid = (data.get("account_sid") or "").strip()
    tok = (data.get("auth_token") or "").strip()
    frm = (data.get("from_number") or "").strip()
    if not (sid and tok and frm):
        return jsonify({"ok": False, "error": "All three values are required (SID, Auth Token, Twilio phone number)."}), 400
    if not frm.startswith("+"):
        frm = "+1" + "".join(c for c in frm if c.isdigit())[-10:]
    _update_env({"TWILIO_ACCOUNT_SID": sid, "TWILIO_AUTH_TOKEN": tok, "TWILIO_FROM": frm})
    os.environ.update({"TWILIO_ACCOUNT_SID": sid, "TWILIO_AUTH_TOKEN": tok, "TWILIO_FROM": frm})
    return jsonify({"ok": True, "from_number": frm})


@app.route("/api/setup/twilio/test", methods=["POST"])
def api_setup_twilio_test():
    """Send a test SMS to the given number using the saved Twilio credentials."""
    data = request.get_json(force=True, silent=True) or {}
    to = (data.get("to") or os.environ.get("DRIVER_PHONE", "")).strip()
    if not to:
        return jsonify({"ok": False, "error": "No destination number."}), 400
    result = notify.send_sms(to, "Plateau Strategy Solution Lab: test message - your driver SMS dispatch is LIVE. Reply YES when a real ride comes in.")
    return jsonify({"ok": result == "sent", "result": result, "to": to})


@app.route("/api/setup/square", methods=["POST"])
def api_setup_square():
    """Save the pasted Square Access Token to .env and load it live (no restart)."""
    data = request.get_json(force=True, silent=True) or {}
    token = (data.get("access_token") or "").strip()
    if not token:
        return jsonify({"ok": False, "error": "Please paste your Square Access Token."}), 400
    _update_env({"SQUARE_ACCESS_TOKEN": token, "SQUARE_ENV": "production"})
    try:
        from dotenv import load_dotenv
        load_dotenv(os.path.join(BASE_DIR, ".env"), override=True)
    except Exception:
        pass
    os.environ["SQUARE_ACCESS_TOKEN"] = token
    os.environ["SQUARE_ENV"] = "production"
    return jsonify({
        "ok": True,
        "connected": bool(os.environ.get("SQUARE_LOCATION_ID")),
        "location_id": os.environ.get("SQUARE_LOCATION_ID", ""),
        "env": "production",
    })


# ---------- config ----------
@app.route("/api/config")
def api_config():
    has_sq = bool(os.environ.get("SQUARE_ACCESS_TOKEN") and os.environ.get("SQUARE_LOCATION_ID"))
    return jsonify({
        "square_mode": (os.environ.get("SQUARE_ENV", "sandbox") if has_sq else "demo"),
        "email_configured": bool(os.environ.get("RESEND_API_KEY") and os.environ.get("DRIVER_EMAIL")),
        "sms_configured": bool(os.environ.get("TWILIO_ACCOUNT_SID") and os.environ.get("DRIVER_PHONE")),
        "default_fare": os.environ.get("DEFAULT_FARE_USD", "45"),
        "default_commission_pct": float(os.environ.get("DEFAULT_COMMISSION_PCT", 0.10)),
        "agent_commission_usd": _agent_commission_usd(None),
    })


_DEBT_CACHE = {"amount": None, "as_of": None, "ts": 0}


@app.route("/api/national-debt")
def api_national_debt():
    """The real US national debt (total public debt outstanding) from the U.S.
    Treasury's public 'Debt to the Penny' API. Cached 6h. Proxied server-side so
    the browser never hits a CORS wall."""
    import requests as _rq
    if _DEBT_CACHE["amount"] and time.time() - _DEBT_CACHE["ts"] < 21600:
        return jsonify({"ok": True, "amount": _DEBT_CACHE["amount"], "as_of": _DEBT_CACHE["as_of"], "cached": True})
    try:
        r = _rq.get(
            "https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_to_penny",
            params={"sort": "-record_date", "page[size]": "1",
                    "fields": "record_date,tot_pub_debt_out_amt"}, timeout=12)
        row = (r.json().get("data") or [{}])[0]
        amount = float(row.get("tot_pub_debt_out_amt"))
        _DEBT_CACHE.update({"amount": amount, "as_of": row.get("record_date"), "ts": time.time()})
        return jsonify({"ok": True, "amount": amount, "as_of": row.get("record_date")})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 502


# ---------- give back: gifts to reduce the public debt ----------
# We never touch a cent of this money. Donors give DIRECTLY to the U.S. Treasury
# (Pay.gov "Gifts to Reduce the Public Debt", or a check to the Bureau of the
# Fiscal Service). This ledger only COUNTS what people tell us they gave, so the
# green zero on the Finance tab can move. It is self-reported by design — the
# honest alternative to pretending we can verify a payment we deliberately never see.
GIVEBACK_PATH = _data_path("give_back.json")
TREASURY_PAYGOV = "https://www.pay.gov/public/form/start/23779454"
TREASURY_MAIL = ("Attn Dept G, Bureau of the Fiscal Service, "
                 "P.O. Box 2188, Parkersburg, WV 26106-2188")


def _giveback_all():
    return _load(GIVEBACK_PATH)


@app.route("/api/give-back")
def api_give_back():
    """Public tally: what this community says it has given back to the country."""
    gifts = _giveback_all()
    total = sum(float(g.get("amount") or 0) for g in gifts)
    return jsonify({
        "ok": True,
        "total": round(total, 2),
        "count": len(gifts),
        "last": (gifts[-1].get("at") if gifts else None),
        "recent": [{"name": g.get("name") or "Anonymous", "amount": g.get("amount"),
                    "note": g.get("note", ""), "at": g.get("at")} for g in gifts[-12:]][::-1],
        "paygov": TREASURY_PAYGOV,
        "mail": TREASURY_MAIL,
    })


@app.route("/api/give-back/log", methods=["POST"])
def api_give_back_log():
    """Someone gave at Treasury and is telling us so — move the zero.

    No payment is processed here and none ever will be: the money went straight
    to the U.S. Treasury. This records the ACT, not the transaction."""
    d = request.get_json(silent=True) or {}
    try:
        amount = round(float(d.get("amount") or 0), 2)
    except (TypeError, ValueError):
        return jsonify({"ok": False, "error": "Enter the amount you gave."}), 400
    if amount <= 0:
        return jsonify({"ok": False, "error": "Enter the amount you gave."}), 400
    if amount > 10_000_000:
        return jsonify({"ok": False, "error": "That amount looks like a typo — please check it."}), 400

    rec = {
        "id": _next_id(_giveback_all(), "GIFT"),
        "name": (str(d.get("name") or "").strip()[:60] or "Anonymous"),
        "amount": amount,
        "note": str(d.get("note") or "").strip()[:140],
        "at": datetime.datetime.now().isoformat(timespec="seconds"),
        "self_reported": True,          # always — see the module note above
    }
    with _LOCK:
        gifts = _giveback_all()
        gifts.append(rec)
        _save(GIVEBACK_PATH, gifts)
        total = sum(float(g.get("amount") or 0) for g in gifts)
    return jsonify({"ok": True, "entry": rec, "total": round(total, 2), "count": len(gifts)})


# ---------- guide handoff (Phase 3 offer capture) ----------
# When a traveler chooses "prefer my trip to a guide", or a guide lists a route
# "for sale", the request lands here. This is the OFFER object — the first slice of
# the ding handshake. It captures the plan + who to reach; the accept/decline/expire
# loop (routed to a specific guide) is the next build. No money moves here.
GUIDE_OFFERS_PATH = _data_path("guide_offers.json")


def _platform_fee():
    """The site's revenue for connecting a customer to a guide or driver-guide.
    Owner's business decision — set in .env, sane default here."""
    try:
        return round(float(os.environ.get("PLATFORM_FEE_USD", 5)), 2)
    except Exception:
        return 5.0


@app.route("/api/guide-offer", methods=["POST"])
def api_guide_offer():
    d = request.get_json(silent=True) or {}
    mode = d.get("mode") if d.get("mode") in ("sale", "hire", "prefer") else "prefer"
    trip = d.get("trip") if isinstance(d.get("trip"), dict) else None
    if not trip or not trip.get("stops"):
        return jsonify({"ok": False, "error": "Build a trip first."}), 400

    guide_code = (d.get("guide_code") or "").strip().upper()
    if mode == "sale":
        if _visit_role(guide_code) != "guide":     # reuse the verified-guide check
            return jsonify({"ok": False, "error": "A valid guide code is required to list a trip."}), 403
    else:
        if not (d.get("contact") or "").strip():
            return jsonify({"ok": False, "error": "A contact is required."}), 400

    try:
        price = round(float(d.get("price")), 2) if d.get("price") not in (None, "") else None
        if price is not None and not (0 <= price <= 100000):
            price = None
    except (TypeError, ValueError):
        price = None

    with _LOCK:
        offers = _load(GUIDE_OFFERS_PATH)
        rec = {
            "id": _next_id(offers, "OFR"),
            "mode": mode,
            "status": "LISTED" if mode == "sale" else "NEW",
            "city": (d.get("city") or trip.get("city") or "")[:40],
            "trip": {"cityLabel": (trip.get("cityLabel") or "")[:80],
                     "days": trip.get("days"),
                     "stops": [{"name": (s.get("name") or "")[:80],
                                "lat": s.get("lat"), "lon": s.get("lon"),
                                "arr": s.get("arr"), "leave": s.get("leave"), "day": s.get("day")}
                               for s in (trip.get("stops") or [])[:40]],
                     "text": (trip.get("text") or "")[:2000]},
            "name": (d.get("name") or "").strip()[:60] or "Traveler",
            "contact": (d.get("contact") or "").strip()[:120],
            "note": (d.get("note") or "").strip()[:400],
            "guide_code": guide_code or None,
            "price": price,
            # the moment a customer hits "drop to a guide" / "hire a driver-guide",
            # a platform fee is billed to the trip — this is the website's revenue
            "platform_fee": _platform_fee() if mode in ("prefer", "hire") else 0.0,
            "created_at": datetime.datetime.now().isoformat(timespec="seconds"),
        }
        offers.append(rec)
        _save(GUIDE_OFFERS_PATH, offers)

    # A route offered for sale is a product, so it belongs in the shop window
    # beside the hand-written ones — not only in the owner's inbox, which is
    # where every previous listing quietly stopped. The planner already knows
    # arrival and departure at each stop, so the minutes come out of the route
    # itself rather than being asked for again.
    if mode == "sale":
        guide = _guide_for(guide_code)
        stops = []
        for s in (rec["trip"]["stops"] or []):
            try:
                mins = int(s.get("leave")) - int(s.get("arr"))
            except (TypeError, ValueError):
                mins = 0
            stops.append({"name": s.get("name") or "", "minutes": max(0, min(mins, 600)),
                          "note": "", "lat": s.get("lat"), "lon": s.get("lon")})
        stops = [s for s in stops if s["name"]]
        if stops:
            trip_rec = {
                "id": "", "code": guide_code,
                "guide_name": _no_tags((guide or {}).get("name", ""))[:60] or rec["name"],
                "guide_org": _no_tags((guide or {}).get("organization", ""))[:80],
                "contact": _no_tags(rec.get("contact") or (guide or {}).get("email", ""))[:120],
                "title": ("Sightseeing in " + (rec["trip"]["cityLabel"] or rec["city"] or "town"))[:90],
                "kind": "in-depth" if len(stops) > 4 else "neighborhood",
                "city": rec["city"], "city_label": rec["trip"]["cityLabel"],
                "summary": (rec.get("note") or
                            ("A guided version of this route — " + ", ".join(s["name"] for s in stops[:4])
                             + (" and more." if len(stops) > 4 else ".")))[:900],
                "stops": stops[:30],
                "total_minutes": sum(s["minutes"] for s in stops[:30]),
                "languages": "", "group_max": 8, "price": price, "price_unit": "person",
                "meeting_point": stops[0]["name"], "includes": "",
                "status": "LISTED", "interest_count": 0, "from_planner": True,
                "created_at": rec["created_at"],
            }
            with _LOCK:
                trips = _load(GUIDE_TRIPS_PATH)
                trip_rec["id"] = _next_id(trips, "TRP")
                trips.append(trip_rec)
                _save(GUIDE_TRIPS_PATH, trips)
            rec["public_trip_id"] = trip_rec["id"]
            with _LOCK:
                allo = _load(GUIDE_OFFERS_PATH)
                for o in allo:
                    if o.get("id") == rec["id"]:
                        o["public_trip_id"] = trip_rec["id"]
                _save(GUIDE_OFFERS_PATH, allo)

    # tell the owner a real request came in (reuses the existing alert channel)
    try:
        where = rec["trip"]["cityLabel"] or rec["city"]
        if mode == "sale":
            _push_owner_alert("guide_listing", "🏷️ Guide %s listed a %s route for sale (%s)."
                              % (guide_code, where, rec["id"]))
        elif mode == "hire":
            _push_owner_alert("driverguide_request", "🚕 %s wants to hire a driver-guide for a %s trip — reach %s (%s)."
                              % (rec["name"], where, rec["contact"], rec["id"]))
        else:
            _push_owner_alert("guide_request", "🙋 %s wants a guide for a %s trip — reach %s (%s)."
                              % (rec["name"], where, rec["contact"], rec["id"]))
    except Exception:
        pass

    return jsonify({"ok": True, "mode": mode, "ref": rec["id"], "status": rec["status"],
                    "platform_fee": rec["platform_fee"],
                    "public_trip_id": rec.get("public_trip_id")})


ROBOTAXI_PATH = _data_path("robotaxi_interest.json")


@app.route("/api/robotaxi-interest", methods=["POST"])
def api_robotaxi_interest():
    """Robotaxi is UNDER DEVELOPMENT — this only counts demand, never books a ride.
    Contact is optional; even an anonymous tap is a useful signal of where the
    interest is."""
    d = request.get_json(silent=True) or {}
    rec = {
        "id": None,
        "contact": (d.get("contact") or "").strip()[:120],
        "city": (d.get("city") or "")[:40],
        "city_label": (d.get("cityLabel") or "")[:80],
        "state": (d.get("state") or "")[:40],
        "at": datetime.datetime.now().isoformat(timespec="seconds"),
    }
    with _LOCK:
        items = _load(ROBOTAXI_PATH)
        rec["id"] = _next_id(items, "RBT")
        items.append(rec)
        _save(ROBOTAXI_PATH, items)
        count = len(items)
    return jsonify({"ok": True, "count": count})


@app.route("/api/robotaxi-interest/list")
@owner_required
def api_robotaxi_list():
    """Owner-only: how many people want robotaxi, and where."""
    items = _load(ROBOTAXI_PATH)
    by_city = {}
    for r in items:
        k = r.get("city_label") or r.get("city") or "—"
        by_city[k] = by_city.get(k, 0) + 1
    return jsonify({"ok": True, "total": len(items), "by_city": by_city,
                    "with_contact": sum(1 for r in items if r.get("contact")),
                    "recent": list(reversed(items))[:30]})


@app.route("/api/guide-offers")
@owner_required
def api_guide_offers():
    """Owner-only view of incoming guide requests and listed trips."""
    return jsonify({"ok": True, "offers": list(reversed(_load(GUIDE_OFFERS_PATH)))})


# ---------- bookings ----------
def _ensure_driver_agent(renter):
    """Return the agent identity linked to this driver, creating it on first use.
    A driver who refers their own customer earns the referral commission too, so
    every referring driver gets ONE linked agent record (renter.agent_id <->
    agent.renter_id) rather than a second, separate signup. This is what lets the
    same person be both 'agent' and 'driver' on a trip and keep the full fare."""
    aid = renter.get("agent_id")
    with _LOCK:
        agents = _load(AGENTS_PATH)
        if aid:
            a = next((x for x in agents if x.get("id") == aid), None)
            if a:
                return a
        agent = {
            "id": _next_id(agents, "AGT", datestamp=False),
            "code": _gen_agent_code(agents),
            "type": "driver",                 # a driver-agent (self-referral capable)
            "name": renter.get("name", "Driver"),
            "email": renter.get("email", ""),
            "phone": renter.get("phone", ""),
            "organization": "",
            "commission_usd": _agent_commission_usd(None),
            "renter_id": renter.get("id"),    # link back to the driver account
            "joined_at": datetime.datetime.now().isoformat(timespec="seconds"),
        }
        agents.append(agent)
        _save(AGENTS_PATH, agents)
        renters = _load(RENTERS_PATH)
        for r in renters:
            if r.get("id") == renter.get("id"):
                r["agent_id"] = agent["id"]
                _save(RENTERS_PATH, renters)
                break
    return agent


def _push_owner_alert(kind, message):
    """Append an alert to the owner's dashboard log and SMS them if configured."""
    alerts_path = _data_path("owner_alerts.json")
    with _LOCK:
        alerts = _load(alerts_path)
        alerts.append({"at": datetime.datetime.now().isoformat(timespec="seconds"),
                       "type": kind, "message": message})
        _save(alerts_path, alerts)
    try:
        owner_phone = os.environ.get("OWNER_PHONE") or os.environ.get("DRIVER_PHONE", "")
        if owner_phone:
            notify.send_sms(owner_phone, message)
    except Exception:
        pass


def _quote_alert_text(res):
    """One-line summary of a quote-requested trip for the owner alert."""
    t = res.get("trip", {})
    a = res.get("agent") or {}
    c = res.get("client", {})
    label = {"airport": "Airport", "cruise": "Cruise", "tour": "Tour",
             "custom": "Custom", "destination": "Destination"}.get(res.get("trip_type"), "Trip")
    who = a.get("name") or "An agent"
    desc = (t.get("title") or t.get("description") or t.get("itinerary")
            or ("%s → %s" % (t.get("pickup", ""), t.get("dropoff", ""))))
    return ("QUOTE REQUEST %s — %s trip by %s for %s. %s. When: %s %s. Needs pricing." % (
        res.get("id"), label, who, c.get("name", ""), desc,
        t.get("date", ""), t.get("time", "")))


# ---------- distance-based fare (destination rides) ----------
# The destination drives the price: fare = base + per-mile × drive distance.
# Rates are the owner's business decision — set in .env, sane defaults here.
def _ride_base_fare():
    try:
        return round(float(os.environ.get("RIDE_BASE_FARE", 15)), 2)
    except Exception:
        return 15.0


def _ride_per_mile():
    try:
        return round(float(os.environ.get("RIDE_PER_MILE", 2.50)), 2)
    except Exception:
        return 2.50


def _distance_fare(miles):
    """Base + per-mile, with a floor so a very short hop still covers the base."""
    try:
        m = max(0.0, float(miles))
    except (TypeError, ValueError):
        return None
    return round(_ride_base_fare() + _ride_per_mile() * m, 2)


def _create_reservation(data, agent=None, self_driver=None):
    """Build, invoice, persist and notify a reservation. Returns the record.
    If self_driver is set, this is a Driver-Agent self-referral: the driver both
    referred the customer AND will drive the trip, so the reservation is pre-assigned
    to them and flagged self_service (they keep the full fare — commission + trip)."""
    name = (data.get("name") or "").strip()
    pickup = (data.get("pickup") or "").strip()
    dropoff = (data.get("dropoff") or "").strip()
    trip_type = (data.get("trip_type") or "airport").strip().lower()
    if trip_type not in ("airport", "cruise", "tour", "custom", "destination"):
        trip_type = "custom"
    quote_requested = bool(data.get("quote_requested"))

    if not name or not pickup:
        return None, "Client name and pickup are required."
    if trip_type == "airport" and not dropoff:
        return None, "Drop-off is required for an airport trip."
    if not dropoff:
        dropoff = {"cruise": "Cruise terminal", "tour": "Round trip — see itinerary",
                   "custom": "As arranged"}.get(trip_type, "Round trip")

    # distance the trip covers (miles) — for a destination ride it sets the price
    try:
        distance_mi = round(float(data.get("distance_mi")), 2) if data.get("distance_mi") not in (None, "") else None
    except (TypeError, ValueError):
        distance_mi = None

    if quote_requested:
        fare = 0.0                       # priced later by the owner
    elif trip_type == "destination" and distance_mi is not None:
        # the destination drives the price — recompute server-side so the rate is
        # authoritative (the client can't dictate the fare, only the distance)
        fare = _distance_fare(distance_mi)
    else:
        try:
            fare = float(data.get("fare") or os.environ.get("DEFAULT_FARE_USD", 45))
        except Exception:
            fare = float(os.environ.get("DEFAULT_FARE_USD", 45))
    fare = round(fare, 2)

    trip = {
        "pickup": pickup,
        "dropoff": dropoff,
        "date": (data.get("date") or "").strip(),
        "time": (data.get("time") or "").strip(),
        "passengers": data.get("passengers") or 1,
        "flight": (data.get("flight") or "").strip(),
        "notes": (data.get("notes") or "").strip(),
    }
    # rich, trip-type-specific details — only stored when the agent provided them
    for k in ("title", "description", "itinerary", "cruise_line", "ship",
              "sailing_date", "return_date", "return_time"):
        v = (data.get(k) or "").strip()
        if v:
            trip[k] = v
    if data.get("duration_hours"):
        trip["duration_hours"] = data.get("duration_hours")
    # a destination ride is filed under where it concludes — the destination and its
    # category (history / culture / nature / food / views) + the distance that priced it
    if trip_type == "destination":
        trip["destination"] = dropoff
        dc = (data.get("dest_category") or "").strip().lower()
        if dc in ("history", "culture", "nature", "food", "views"):
            trip["dest_category"] = dc
        if distance_mi is not None:
            trip["distance_mi"] = distance_mi

    reservation = {
        "id": None,
        "created_at": datetime.datetime.now().isoformat(timespec="seconds"),
        "trip_type": trip_type,
        "client": {
            "name": name,
            "email": (data.get("email") or "").strip(),
            "phone": (data.get("phone") or "").strip(),
        },
        "trip": trip,
        "fare_usd": fare,
        "quote_requested": quote_requested,
        "status": "QUOTE" if quote_requested else "NEW",
        "renter_id": None,
        "driver": None,
        "agent": None,
    }

    if agent:
        # commission is per-service when a service was chosen, else per-agent/global default
        try:
            comm = round(float(data.get("agent_commission")), 2)
        except (TypeError, ValueError):
            comm = _agent_commission_usd(agent)
        reservation["agent"] = {
            "id": agent.get("id"),
            "name": agent.get("name"),
            "code": agent.get("code"),
            "commission_usd": comm,
            "renter_id": (self_driver or {}).get("id") or agent.get("renter_id"),
        }

    # Driver-Agent self-referral: same person referred AND drives → keep the full fare.
    if self_driver:
        reservation["self_service"] = True
        reservation["status"] = "ASSIGNED"
        reservation["renter_id"] = self_driver.get("id")
        reservation["driver"] = self_driver.get("name")
    elif not quote_requested:
        # Record who this ride is offered to, so when one driver wins we can tell the rest.
        reservation["offered_driver_ids"] = [
            r.get("id") for r in _load(RENTERS_PATH) if (r.get("phone") or "").strip()]

    with _LOCK:
        items = _load(RES_PATH)
        reservation["id"] = _next_id(items, "RES")
        invoice = None
        if not quote_requested:          # no price yet on a quote request → no invoice
            invoice = square_client.create_invoice(reservation)
            reservation["invoice"] = invoice
        items.append(reservation)
        _save(RES_PATH, items)

    if self_driver:
        # already assigned to its driver — no need to broadcast it.
        reservation["notified"] = {"ok": True, "self_service": True}
    elif quote_requested:
        # not priced yet → don't offer to drivers; route to the owner to quote it.
        _push_owner_alert("QUOTE", _quote_alert_text(reservation))
        reservation["notified"] = {"ok": True, "quote": True, "owner_alerted": True}
    else:
        reservation["notified"] = notify.notify_driver(reservation, invoice,
                                                       renters=_load(RENTERS_PATH))
    return reservation, None


@app.route("/api/book", methods=["POST"])
def api_book():
    data = request.get_json(force=True, silent=True) or {}
    agent = None
    agent_id = (data.get("agent_id") or "").strip()
    if agent_id:
        agent = next((a for a in _load(AGENTS_PATH) if a.get("id") == agent_id), None)
    reservation, err = _create_reservation(data, agent=agent)
    if err:
        return jsonify({"ok": False, "error": err}), 400
    record_conversion("booking")
    return jsonify({"ok": True, "reservation": reservation})


@app.route("/api/agent/book-trip", methods=["POST"])
def api_agent_book_trip():
    """Agent 'Book a Trip' API — the in-portal form posts here. Handles any
    trip_type (airport / cruise / tour / custom) and an optional quote request
    (quote_requested=True → no price yet, routed to the owner to quote).
    Requires a valid agent_id so the commission is attributed correctly."""
    data = request.get_json(force=True, silent=True) or {}
    agent_id = (data.get("agent_id") or "").strip()
    agent = next((a for a in _load(AGENTS_PATH) if a.get("id") == agent_id), None) if agent_id else None
    if not agent:
        return jsonify({"ok": False, "error": "Please sign in as an agent first."}), 401
    reservation, err = _create_reservation(data, agent=agent)
    if err:
        return jsonify({"ok": False, "error": err}), 400
    return jsonify({"ok": True, "reservation": reservation})


def _reservation_for_board(r):
    """A copy of a reservation that is safe to show on the open board.

    A driver deciding whether to take a ride needs the pickup, the time and
    the fare — not the customer's phone, email or full name. Contact details
    are released by /claim, to the one driver who actually took the ride."""
    out = dict(r)
    name = ((r.get("client") or {}).get("name") or "").strip()
    out["client"] = {"name": (name.split(" ")[0] if name else "Client")}
    out["contact_hidden"] = True
    return out


@app.route("/api/reservations")
def api_reservations():
    """Reservations, scoped to who is asking.

    Owner  -> everything, in full.
    Driver -> their own rides in full (they have to contact the customer),
              plus the open board with contact details withheld.
    Anyone else -> the open board only, contact details withheld.

    This endpoint used to return every reservation — customer names, phones
    and addresses — to anyone who requested it. The first fix redacted the
    open board but still took the driver's identity from ?renter_id=, which
    is not a secret: ids are handed out in sequence (RTR_0001, RTR_0002, ...),
    so counting up from one walked out every customer's name, email, phone and
    address. Identity now comes from the signed-in session only."""
    items = list(reversed(_load(RES_PATH)))
    status = (request.args.get("status") or "").upper()
    if status == "OPEN":
        items = [r for r in items if r.get("status") == "NEW"]
    elif status:
        items = [r for r in items if r.get("status") == status]

    if session.get("owner"):
        return jsonify({"reservations": items})

    # Session, never the query string. ?renter_id= is still accepted by the
    # driver portal's URL but is now ignored for access — a driver who is not
    # signed in gets the same redacted board as everyone else and is asked to
    # log in, which is the safe failure.
    renter_id = (session.get("renter_id") or "").strip()
    is_renter = bool(renter_id)

    visible = []
    for r in items:
        if is_renter and r.get("renter_id") == renter_id:
            visible.append(r)                              # their own ride
        elif r.get("status") == "NEW" and not r.get("renter_id"):
            visible.append(_reservation_for_board(r))      # unclaimed, redacted
    return jsonify({"reservations": visible})


@app.route("/api/reservations/<rid>/claim", methods=["POST"])
def api_claim(rid):
    """A renter picks an open reservation. First claim wins (atomic).

    The driver is whoever is signed in, not whoever the request says it is.
    This used to take renter_id from the body, and a successful claim returns
    the reservation in full — so anyone who guessed a driver id (they run
    RTR_0001, RTR_0002, ...) could claim someone else's ride and read the
    customer's name, email, phone and address out of the response."""
    data = request.get_json(force=True, silent=True) or {}
    renter_id = (session.get("renter_id") or "").strip()
    if not renter_id:
        return jsonify({"ok": False, "auth_required": True,
                        "error": "Please sign in before accepting rides."}), 401
    renter = next((x for x in _load(RENTERS_PATH) if x.get("id") == renter_id), None)
    if not renter:
        return jsonify({"ok": False, "error": "Unknown renter — please register first."}), 400
    if not _driver_signed_current(renter_id):
        return jsonify({"ok": False, "contract_required": True,
                        "error": "Please review and sign your current driver agreement "
                                 "before you can accept rides."}), 403
    if not _insurance_ok(renter):
        return jsonify({"ok": False, "insurance_required": True,
                        "error": "Please upload valid proof of insurance before you can accept rides."}), 403
    with _LOCK:
        items = _load(RES_PATH)
        for r in items:
            if r.get("id") == rid:
                if r.get("status") != "NEW":
                    return jsonify({"ok": False, "error": "Already taken by another driver."}), 409
                r["status"] = "ASSIGNED"
                r["renter_id"] = renter_id
                r["driver"] = renter.get("name")
                _save(RES_PATH, items)
                claimed = r
                break
        else:
            return jsonify({"ok": False, "error": "not found"}), 404
    # First claim won — tell the other offered drivers the ride is taken.
    notify.sms_ride_taken(claimed, renter, _load(RENTERS_PATH))
    return jsonify({"ok": True, "reservation": claimed})


@app.route("/api/renters/<rid>/refer", methods=["POST"])
@renter_self_or_owner
def api_renter_refer(rid):
    """Driver-Agent self-referral. A driver met a customer who needs a ride, refers
    them here, and drives the trip themselves — so they earn BOTH the referral
    commission and the trip, i.e. the full fare. The reservation is created,
    invoiced to the customer, and pre-assigned to this driver."""
    data = request.get_json(force=True, silent=True) or {}
    renter = next((x for x in _load(RENTERS_PATH) if x.get("id") == rid), None)
    if not renter:
        return jsonify({"ok": False, "error": "Unknown driver — please sign in again."}), 400
    if not _driver_signed_current(rid):
        return jsonify({"ok": False, "contract_required": True,
                        "error": "Please review and sign your current driver agreement first."}), 403
    if not _insurance_ok(renter):
        return jsonify({"ok": False, "insurance_required": True,
                        "error": "Please upload valid proof of insurance before you can drive."}), 403
    agent = _ensure_driver_agent(renter)
    reservation, err = _create_reservation(data, agent=agent, self_driver=renter)
    if err:
        return jsonify({"ok": False, "error": err}), 400
    return jsonify({"ok": True, "reservation": reservation})


@app.route("/api/reservations/<rid>/accept", methods=["POST"])
def api_accept(rid):
    """Legacy manual-assign endpoint (kept for compatibility)."""
    data = request.get_json(force=True, silent=True) or {}
    driver = (data.get("driver") or "Driver").strip()
    with _LOCK:
        items = _load(RES_PATH)
        for r in items:
            if r.get("id") == rid:
                r["status"] = "ASSIGNED"
                r["driver"] = driver
                _save(RES_PATH, items)
                return jsonify({"ok": True, "reservation": r})
    return jsonify({"ok": False, "error": "not found"}), 404


@app.route("/sms/reply", methods=["POST"])
def sms_reply():
    """Twilio webhook: a driver replies YES to claim a ride by text.
    First YES wins (same atomic claim as the panel). Point Twilio's
    'A message comes in' webhook at https://<public-url>/sms/reply."""
    from flask import Response as _Resp
    frm = (request.form.get("From") or "").strip()
    body = (request.form.get("Body") or "").strip()

    def _twiml(msg):
        return _Resp("<?xml version='1.0' encoding='UTF-8'?><Response><Message>%s</Message></Response>"
                     % msg.replace("&", "&amp;").replace("<", "&lt;"), mimetype="application/xml")

    words = body.upper().split()
    if not words or words[0] not in ("YES", "Y", "ACCEPT"):
        return _twiml("Reply YES to accept a ride, or open the driver panel.")

    # Identify the driver by their registered phone (match on last 10 digits)
    digits = "".join(c for c in frm if c.isdigit())[-10:]
    renter = None
    for r in _load(RENTERS_PATH):
        rd = "".join(c for c in (r.get("phone") or "") if c.isdigit())[-10:]
        if rd and rd == digits:
            renter = r
            break
    if not renter:
        return _twiml("This number isn't registered as a driver. Register on the driver panel first.")
    if not _driver_signed_current(renter.get("id")):
        return _twiml("Please sign your current driver agreement in the driver panel before "
                      "you can accept rides.")
    if not _insurance_ok(renter):
        return _twiml("Your proof of insurance is missing or expired. Upload current "
                      "insurance in the driver panel before you can accept rides.")

    # Target ride: explicit id in the reply, else the newest open one
    target_id = next((w for w in words if w.startswith("RES_")), None)
    with _LOCK:
        items = _load(RES_PATH)
        target = None
        if target_id:
            target = next((x for x in items if x.get("id", "").upper() == target_id), None)
        else:
            open_rides = [x for x in items if x.get("status") == "NEW"]
            target = open_rides[-1] if open_rides else None
        if not target:
            return _twiml("No open rides right now.")
        if target.get("status") != "NEW":
            return _twiml("Sorry - ride %s was already taken by another driver." % target.get("id"))
        target["status"] = "ASSIGNED"
        target["renter_id"] = renter.get("id")
        target["driver"] = renter.get("name")
        _save(RES_PATH, items)

    # This driver replied fastest and won — tell the other offered drivers it's taken.
    notify.sms_ride_taken(target, renter, _load(RENTERS_PATH))

    t = target.get("trip", {})
    c = target.get("client", {})
    return _twiml("You got it, %s! %s: %s -> %s at %s %s. Client: %s %s. See the driver panel for details."
                  % (renter.get("name", "driver").split()[0], target.get("id"),
                     t.get("pickup", ""), t.get("dropoff", ""), t.get("date", ""), t.get("time", ""),
                     c.get("name", ""), c.get("phone", "")))


@app.route("/api/reservations/<rid>/giveup", methods=["POST"])
def api_giveup(rid):
    """Assigned driver can't make it: release the ride back to the pool.
    Only allowed 12+ hours before scheduled pickup [SEAN rule]. Owner is notified.

    Identity comes from the session: with a guessable id in the body, anyone
    could release another driver's booked rides back into the pool."""
    data = request.get_json(force=True, silent=True) or {}
    renter_id = (session.get("renter_id") or "").strip()
    if not renter_id:
        return jsonify({"ok": False, "auth_required": True,
                        "error": "Please sign in first."}), 401
    with _LOCK:
        items = _load(RES_PATH)
        r = next((x for x in items if x.get("id") == rid), None)
        if not r:
            return jsonify({"ok": False, "error": "Reservation not found."}), 404
        if r.get("renter_id") != renter_id:
            return jsonify({"ok": False, "error": "This ride isn't assigned to you."}), 403
        if r.get("status") != "ASSIGNED":
            return jsonify({"ok": False, "error": "This ride can't be given up (status: %s)." % r.get("status")}), 409
        # 12-hour window: block online give-up when pickup is too close
        trip = r.get("trip", {})
        try:
            pickup_dt = datetime.datetime.strptime(
                "%s %s" % (trip.get("date", ""), trip.get("time", "") or "00:00"), "%Y-%m-%d %H:%M")
            hours_left = (pickup_dt - datetime.datetime.now()).total_seconds() / 3600.0
        except Exception:
            hours_left = None  # no schedule -> allow
        if hours_left is not None and hours_left < 12:
            return jsonify({"ok": False, "blocked": True,
                            "error": "Pickup is less than 12 hours away — this ride can no longer be given up online. Call dispatch immediately so we can cover it."}), 403
        driver_name = r.get("driver")
        r.setdefault("giveups", []).append({
            "driver": driver_name, "renter_id": renter_id,
            "at": datetime.datetime.now().isoformat(timespec="seconds"),
        })
        r["status"] = "NEW"
        r["renter_id"] = None
        r["driver"] = None
        _save(RES_PATH, items)

    # Notify the owner (alert log always; SMS once carrier registration is live)
    alert = ("DRIVER GAVE UP RIDE %s: %s. Route %s -> %s at %s %s. "
             "Ride is back in the open pool." % (
                 rid, driver_name, trip.get("pickup", ""), trip.get("dropoff", ""),
                 trip.get("date", ""), trip.get("time", "")))
    alerts_path = _data_path("owner_alerts.json")
    alerts = _load(alerts_path)
    alerts.append({"at": datetime.datetime.now().isoformat(timespec="seconds"),
                   "type": "GIVEUP", "message": alert})
    _save(alerts_path, alerts)
    owner_phone = os.environ.get("OWNER_PHONE") or os.environ.get("DRIVER_PHONE", "")
    sms_result = notify.send_sms(owner_phone, alert)
    return jsonify({"ok": True, "back_in_pool": True, "owner_notified": sms_result})


@app.route("/api/alerts")
def api_alerts():
    return jsonify({"alerts": list(reversed(_load(_data_path("owner_alerts.json"))))[:50]})


@app.route("/api/reservations/<rid>/cancel", methods=["POST"])
def api_cancel(rid):
    """Customer cancels their reservation. Verifies their email, voids the
    Square invoice so no payment request lingers, and marks it CANCELED."""
    data = request.get_json(force=True, silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    with _LOCK:
        items = _load(RES_PATH)
        for r in items:
            if r.get("id") == rid:
                if r.get("status") == "COMPLETED":
                    return jsonify({"ok": False, "error": "This ride is already completed and can't be canceled."}), 409
                if r.get("status") == "CANCELED":
                    return jsonify({"ok": True, "reservation": r, "note": "Already canceled."})
                on_file = (r.get("client", {}).get("email") or "").strip().lower()
                if on_file and on_file != email:
                    return jsonify({"ok": False, "error": "That email doesn't match this reservation."}), 403
                inv = r.get("invoice") or {}
                inv_result = square_client.cancel_invoice(inv.get("id"))
                if inv_result.get("ok"):
                    r.setdefault("invoice", {})["status"] = "CANCELED"
                r["invoice_cancel"] = inv_result
                r["status"] = "CANCELED"
                r["canceled_at"] = datetime.datetime.now().isoformat(timespec="seconds")
                _save(RES_PATH, items)
                return jsonify({"ok": True, "reservation": r, "invoice_cancel": inv_result})
    return jsonify({"ok": False, "error": "Reservation not found — check the confirmation number."}), 404


@app.route("/api/reservations/<rid>/complete", methods=["POST"])
def api_complete(rid):
    with _LOCK:
        items = _load(RES_PATH)
        for r in items:
            if r.get("id") == rid:
                r["status"] = "COMPLETED"
                _save(RES_PATH, items)
                return jsonify({"ok": True, "reservation": r})
    return jsonify({"ok": False, "error": "not found"}), 404


# ---------- dispatch (owner control center) ----------
@app.route("/api/dispatch/assign", methods=["POST"])
@owner_required
def api_dispatch_assign():
    """Owner assigns a reservation to a driver (dispatch override)."""
    data = request.get_json(force=True, silent=True) or {}
    rid = (data.get("reservation_id") or "").strip()
    renter_id = (data.get("renter_id") or "").strip()
    renter = next((x for x in _load(RENTERS_PATH) if x.get("id") == renter_id), None)
    if not renter:
        return jsonify({"ok": False, "error": "Unknown driver."}), 400
    with _LOCK:
        items = _load(RES_PATH)
        r = next((x for x in items if x.get("id") == rid), None)
        if not r:
            return jsonify({"ok": False, "error": "not found"}), 404
        r["status"] = "ASSIGNED"
        r["renter_id"] = renter_id
        r["driver"] = renter.get("name")
        _save(RES_PATH, items)
    return jsonify({"ok": True, "reservation": r})


@app.route("/api/dispatch/release", methods=["POST"])
@owner_required
def api_dispatch_release():
    """Owner returns a reservation to the open pool."""
    data = request.get_json(force=True, silent=True) or {}
    rid = (data.get("reservation_id") or "").strip()
    with _LOCK:
        items = _load(RES_PATH)
        r = next((x for x in items if x.get("id") == rid), None)
        if not r:
            return jsonify({"ok": False, "error": "not found"}), 404
        r["status"] = "NEW"
        r["renter_id"] = None
        r["driver"] = None
        _save(RES_PATH, items)
    return jsonify({"ok": True, "reservation": r})


@app.route("/api/dispatch/cancel", methods=["POST"])
@owner_required
def api_dispatch_cancel():
    """Owner cancels a reservation and voids any Square invoice."""
    data = request.get_json(force=True, silent=True) or {}
    rid = (data.get("reservation_id") or "").strip()
    with _LOCK:
        items = _load(RES_PATH)
        r = next((x for x in items if x.get("id") == rid), None)
        if not r:
            return jsonify({"ok": False, "error": "not found"}), 404
        if r.get("status") != "CANCELED":
            inv = r.get("invoice") or {}
            if inv.get("id"):
                try:
                    res = square_client.cancel_invoice(inv.get("id"))
                    if res.get("ok"):
                        r.setdefault("invoice", {})["status"] = "CANCELED"
                    r["invoice_cancel"] = res
                except Exception as e:
                    r["invoice_cancel"] = {"ok": False, "error": str(e)}
            r["status"] = "CANCELED"
            r["canceled_at"] = datetime.datetime.now().isoformat(timespec="seconds")
            _save(RES_PATH, items)
    return jsonify({"ok": True, "reservation": r})


# ---------- renters (drivers) ----------
INSURANCE_DIR = _data_dir("insurance_uploads")
INSURANCE_WARN_DAYS = int(os.environ.get("INSURANCE_WARN_DAYS", "30"))
INSURANCE_REQUIRED = os.environ.get("INSURANCE_REQUIRED", "true").lower() != "false"


def _parse_date_any(s):
    """Parse a date from YYYY-MM-DD (native date input) or DDMMYYYY. Returns a
    datetime.date or None."""
    s = (s or "").strip()
    if not s:
        return None
    try:
        return datetime.date.fromisoformat(s[:10])
    except Exception:
        pass
    digits = "".join(c for c in s if c.isdigit())
    if len(digits) == 8:
        try:
            return datetime.date(int(digits[4:]), int(digits[2:4]), int(digits[:2]))
        except ValueError:
            return None
    return None


def _insurance_status(renter):
    """Recognize where a driver's insurance stands in time:
    MISSING (never uploaded), EXPIRED (past its date), EXPIRING (within the warning
    window), or VALID. Drivers must be VALID or EXPIRING to accept rides."""
    ins = (renter or {}).get("insurance") or {}
    base = {"provider": ins.get("provider", ""), "policy_number": ins.get("policy_number", ""),
            "uploaded_at": ins.get("uploaded_at"), "has_file": bool(ins.get("file"))}
    d = _parse_date_any(ins.get("expires"))
    if not d:
        base.update({"state": "MISSING", "expires": None, "days_left": None})
        return base
    days = (d - datetime.date.today()).days
    state = "EXPIRED" if days < 0 else ("EXPIRING" if days <= INSURANCE_WARN_DAYS else "VALID")
    base.update({"state": state, "expires": d.isoformat(), "days_left": days})
    return base


def _insurance_ok(renter):
    if not INSURANCE_REQUIRED:
        return True
    return _insurance_status(renter)["state"] in ("VALID", "EXPIRING")


def _save_insurance_file(rid, data_url):
    """Persist an uploaded proof-of-insurance (image/PDF data URL) to disk.
    Returns the filename, 'TOO_BIG', or None."""
    import base64
    if not data_url or "," not in data_url:
        return None
    header, b64 = data_url.split(",", 1)
    try:
        raw = base64.b64decode(b64)
    except Exception:
        return None
    if len(raw) > 8 * 1024 * 1024:
        return "TOO_BIG"
    mime = header.split(";")[0].replace("data:", "").strip()
    ext = {"image/png": "png", "image/jpeg": "jpg", "image/jpg": "jpg",
           "image/webp": "webp", "application/pdf": "pdf"}.get(mime, "bin")
    os.makedirs(INSURANCE_DIR, exist_ok=True)
    fn = "%s_%s.%s" % (rid, datetime.datetime.now().strftime("%Y%m%d%H%M%S"), ext)
    with open(os.path.join(INSURANCE_DIR, fn), "wb") as f:
        f.write(raw)
    return fn


VIOLATIONS_PATH = _data_path("violations.json")
VIOLATION_ABANDON_GRACE_H = float(os.environ.get("VIOLATION_ABANDON_GRACE_H", "2"))

DOCUMENTS_PATH = _data_path("documents.json")
DOCUMENTS_DIR = _data_dir("documents")
DOC_TYPES = ["Driver's License", "Vehicle Registration", "Proof of Insurance",
             "W-9 Tax Form", "Background Check", "Vehicle Inspection",
             "Rental Agreement", "Other"]


def _save_document_file(data_url, rid):
    """Persist an uploaded document (image/PDF data URL) to the archive dir. Every
    upload gets a unique name (timestamp + random) so nothing is ever overwritten —
    that's the paper trail. Returns (stored_name, size) | ('TOO_BIG', 0) | (None, 0)."""
    import base64
    if not data_url or "," not in data_url:
        return None, 0
    header, b64 = data_url.split(",", 1)
    try:
        raw = base64.b64decode(b64)
    except Exception:
        return None, 0
    if len(raw) > 15 * 1024 * 1024:
        return "TOO_BIG", 0
    mime = header.split(";")[0].replace("data:", "").strip()
    ext = {"image/png": "png", "image/jpeg": "jpg", "image/jpg": "jpg", "image/webp": "webp",
           "image/heic": "heic", "application/pdf": "pdf",
           "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx"}.get(mime, "bin")
    os.makedirs(DOCUMENTS_DIR, exist_ok=True)
    fn = "%s_%s_%s.%s" % (rid, datetime.datetime.now().strftime("%Y%m%d%H%M%S"), secrets.token_hex(3), ext)
    with open(os.path.join(DOCUMENTS_DIR, fn), "wb") as f:
        f.write(raw)
    return fn, len(raw)


def _add_document(rid, doc_type, original_name, stored_name, stored_dir, size, source="upload", notes=""):
    """Append a document record to the append-only archive (never overwrites)."""
    with _LOCK:
        docs = _load(DOCUMENTS_PATH)
        rec = {"id": _next_id(docs, "DOC", datestamp=False), "renter_id": rid,
               "doc_type": doc_type, "original_name": original_name, "stored_name": stored_name,
               "stored_dir": stored_dir, "size": size, "source": source, "notes": notes,
               "uploaded_at": datetime.datetime.now().isoformat(timespec="seconds")}
        docs.append(rec)
        _save(DOCUMENTS_PATH, docs)
    return rec


def _driver_documents(rid):
    """The full paper trail for one driver: every archived upload (newest first) +
    a read-only record of each signed Driver Agreement version."""
    docs = sorted([d for d in _load(DOCUMENTS_PATH) if d.get("renter_id") == rid],
                  key=lambda d: d.get("uploaded_at", ""), reverse=True)
    sigs = sorted([s for s in _load(SIGNATURES_PATH) if s.get("renter_id") == rid],
                  key=lambda s: s.get("signed_at", ""), reverse=True)
    agreements = [{"version": s.get("version"), "typed_name": s.get("typed_name"),
                   "signed_at": s.get("signed_at")} for s in sigs]
    return {"documents": docs, "agreements": agreements}


def _trip_datetime(trip):
    d = (trip.get("date") or "").strip()
    t = (trip.get("time") or "").strip()
    if not d:
        return None
    try:
        return datetime.datetime.fromisoformat(d + "T" + ((t or "00:00")[:5]))
    except Exception:
        return None


def _driver_violations(renter):
    """Auto-detect compliance issues from LIVE data — the things the system can
    actually see a driver doing (or not doing) against the Driver Agreement.
    Each: {kind, title, detail, severity[high|medium|low], ref?}."""
    rid = renter.get("id")
    out = []
    st = _contract_status(rid).get("status")
    if st == "unsigned":
        out.append({"kind": "agreement", "title": "Driver Agreement not signed", "severity": "high",
                    "detail": "Driving requires a signed, current Driver Agreement — it has not been signed."})
    elif st == "outdated":
        out.append({"kind": "agreement", "title": "Driver Agreement out of date", "severity": "high",
                    "detail": "The agreement was updated to a new version — the current one must be re-signed."})
    ins = _insurance_status(renter)
    if ins.get("state") == "MISSING":
        out.append({"kind": "insurance", "title": "No proof of insurance on file", "severity": "high",
                    "detail": "A valid, current proof of insurance is required at all times while driving."})
    elif ins.get("state") == "EXPIRED":
        out.append({"kind": "insurance", "title": "Insurance expired", "severity": "high",
                    "detail": "The policy expired %s day(s) ago. A current policy must be uploaded immediately." % abs(ins.get("days_left") or 0)})
    elif ins.get("state") == "EXPIRING":
        out.append({"kind": "insurance", "title": "Insurance expiring soon", "severity": "low",
                    "detail": "The policy expires in %s day(s) — renew before it lapses." % (ins.get("days_left") or 0)})
    now = datetime.datetime.now()
    for r in _load(RES_PATH):
        if r.get("renter_id") != rid or r.get("status") != "ASSIGNED":
            continue
        when = _trip_datetime(r.get("trip", {}))
        if when and (now - when) > datetime.timedelta(hours=VIOLATION_ABANDON_GRACE_H):
            t = r.get("trip", {})
            out.append({"kind": "abandoned", "title": "Accepted ride not completed", "severity": "medium", "ref": r.get("id"),
                        "detail": "Ride %s (%s → %s) was scheduled for %s and is still not marked complete. Accepting a ride and not fulfilling it violates the agreement." % (
                            r.get("id"), t.get("pickup", ""), t.get("dropoff", ""), when.strftime("%b %d, %I:%M %p"))})
    return out


def _manual_violations(rid, include_resolved=False):
    vs = [v for v in _load(VIOLATIONS_PATH) if v.get("renter_id") == rid]
    if not include_resolved:
        vs = [v for v in vs if not v.get("resolved")]
    return sorted(vs, key=lambda v: v.get("logged_at", ""), reverse=True)


def _violation_summary(renter):
    auto = _driver_violations(renter)
    manual = _manual_violations(renter.get("id"))
    rank = {"high": 3, "medium": 2, "low": 1}
    # a "low" auto item (e.g. insurance expiring soon) is a heads-up, not an active violation
    active = len([v for v in auto if v.get("severity") != "low"]) + len(manual)
    worst = max([rank.get(v.get("severity"), 0) for v in auto + manual] or [0])
    return {"auto": auto, "manual": manual, "active_count": active,
            "worst": {3: "high", 2: "medium", 1: "low", 0: "none"}[worst],
            "in_good_standing": active == 0}


def _norm_dob(s):
    """Normalize a birthday to DDMMYYYY (8 digits). Returns the 8-digit string
    only if it is a real calendar date, else None. This is the driver's login pass."""
    digits = "".join(c for c in (s or "") if c.isdigit())
    if len(digits) != 8:
        return None
    dd, mm, yyyy = digits[:2], digits[2:4], digits[4:]
    try:
        datetime.date(int(yyyy), int(mm), int(dd))
    except ValueError:
        return None
    return digits


@app.route("/api/renters/register", methods=["POST"])
def api_renter_register():
    data = request.get_json(force=True, silent=True) or {}
    name = (data.get("name") or "").strip()
    if not name:
        return jsonify({"ok": False, "error": "Name is required."}), 400
    dob = _norm_dob(data.get("dob"))
    if not dob:
        return jsonify({"ok": False, "error": "Enter your birthday as DDMMYYYY (e.g. 07031990) — this is your login pass."}), 400
    if not (data.get("car_vin") or "").strip():
        return jsonify({"ok": False, "error": "Vehicle VIN is required."}), 400
    with _LOCK:
        renters = _load(RENTERS_PATH)
        renter = {
            "id": _next_id(renters, "RTR", datestamp=False),
            "name": name,
            "dob": dob,
            "email": (data.get("email") or "").strip(),
            "phone": (data.get("phone") or "").strip(),
            "car": {
                "make": (data.get("car_make") or "").strip(),
                "model": (data.get("car_model") or "").strip(),
                "year": (data.get("car_year") or "").strip(),
                "plate": (data.get("car_plate") or "").strip(),
                "color": (data.get("car_color") or "").strip(),
                "vin": (data.get("car_vin") or "").strip(),
            },
            "joined_at": datetime.datetime.now().isoformat(timespec="seconds"),
        }
        renters.append(renter)
        _save(RENTERS_PATH, renters)
    session["renter_id"] = renter["id"]
    record_conversion("driver_signup")
    return jsonify({"ok": True, "renter": renter})


@app.route("/api/renters")
@owner_required
def api_renters():
    return jsonify({"renters": _load(RENTERS_PATH)})


@app.route("/api/renters/<rid>")
@renter_self_or_owner
def api_renter(rid):
    renter = next((x for x in _load(RENTERS_PATH) if x.get("id") == rid), None)
    if not renter:
        return jsonify({"ok": False, "error": "not found"}), 404
    rides = [r for r in _load(RES_PATH) if r.get("renter_id") == rid]
    return jsonify({"ok": True, "renter": renter, "rides": list(reversed(rides)),
                    "insurance": _insurance_status(renter)})


@app.route("/api/renters/<rid>/insurance")
@renter_self_or_owner
def api_renter_insurance(rid):
    """Current insurance standing for a driver (state + days left)."""
    renter = next((x for x in _load(RENTERS_PATH) if x.get("id") == rid), None)
    if not renter:
        return jsonify({"ok": False, "error": "not found"}), 404
    return jsonify({"ok": True, "insurance": _insurance_status(renter),
                    "warn_days": INSURANCE_WARN_DAYS, "required": INSURANCE_REQUIRED})


@app.route("/api/renters/<rid>/insurance/upload", methods=["POST"])
@renter_self_or_owner
def api_renter_insurance_upload(rid):
    """Driver uploads proof of insurance + its expiry date. Rejects an already-expired
    policy so 'covered' always means covered right now."""
    data = request.get_json(force=True, silent=True) or {}
    provider = (data.get("provider") or "").strip()
    policy = (data.get("policy_number") or "").strip()
    exp = _parse_date_any(data.get("expires"))
    if not exp:
        return jsonify({"ok": False, "error": "Enter a valid insurance expiry date."}), 400
    if exp < datetime.date.today():
        return jsonify({"ok": False, "error": "That policy is already expired — please upload current insurance."}), 400
    saved = _save_insurance_file(rid, data.get("file") or "")
    if saved == "TOO_BIG":
        return jsonify({"ok": False, "error": "That file is too large (max 8 MB). Try a photo or smaller PDF."}), 400
    with _LOCK:
        renters = _load(RENTERS_PATH)
        renter = next((x for x in renters if x.get("id") == rid), None)
        if not renter:
            return jsonify({"ok": False, "error": "Unknown driver."}), 400
        ins = renter.get("insurance") or {}
        ins.update({
            "provider": provider,
            "policy_number": policy,
            "expires": exp.isoformat(),
            "uploaded_at": datetime.datetime.now().isoformat(timespec="seconds"),
        })
        if saved:
            ins["file"] = saved
        renter["insurance"] = ins
        _save(RENTERS_PATH, renters)
    # also archive this policy into the paper trail (older policies are kept, never lost)
    if saved:
        try:
            sz = os.path.getsize(os.path.join(INSURANCE_DIR, saved))
        except Exception:
            sz = 0
        _add_document(rid, "Proof of Insurance",
                      "%s policy — expires %s" % (provider or "Insurance", exp.isoformat()),
                      saved, "insurance_uploads", sz, "insurance",
                      "Policy %s" % policy if policy else "")
    return jsonify({"ok": True, "insurance": _insurance_status(renter)})


@app.route("/api/renters/<rid>/insurance/doc")
@owner_required
def api_renter_insurance_doc(rid):
    """Owner-only: view the uploaded proof-of-insurance file for verification."""
    renter = next((x for x in _load(RENTERS_PATH) if x.get("id") == rid), None)
    fn = ((renter or {}).get("insurance") or {}).get("file") if renter else None
    if not fn:
        return jsonify({"ok": False, "error": "No document on file."}), 404
    path = os.path.join(INSURANCE_DIR, fn)
    if not os.path.exists(path):
        return jsonify({"ok": False, "error": "File missing."}), 404
    return send_file(path)


# ---------- driver compliance / violations ----------
@app.route("/api/renters/<rid>/violations")
@renter_self_or_owner
def api_renter_violations(rid):
    """The driver's own compliance standing: auto-detected issues + logged violations."""
    renter = next((x for x in _load(RENTERS_PATH) if x.get("id") == rid), None)
    if not renter:
        return jsonify({"ok": False, "error": "not found"}), 404
    return jsonify({"ok": True, **_violation_summary(renter)})


@app.route("/api/renters/<rid>/violations", methods=["POST"])
@owner_required
def api_renter_violation_add(rid):
    """Owner logs a manual violation (complaint, unsafe driving, etc.) the system
    can't auto-detect."""
    data = request.get_json(force=True, silent=True) or {}
    vtype = (data.get("type") or "").strip()
    detail = (data.get("detail") or "").strip()
    sev = (data.get("severity") or "medium").strip().lower()
    if sev not in ("high", "medium", "low"):
        sev = "medium"
    if not vtype:
        return jsonify({"ok": False, "error": "A violation type is required."}), 400
    with _LOCK:
        vs = _load(VIOLATIONS_PATH)
        v = {"id": _next_id(vs, "VIO", datestamp=False), "renter_id": rid, "type": vtype,
             "detail": detail, "severity": sev, "source": "logged",
             "logged_at": datetime.datetime.now().isoformat(timespec="seconds"),
             "logged_by": session.get("owner", ""), "resolved": False}
        vs.append(v)
        _save(VIOLATIONS_PATH, vs)
    return jsonify({"ok": True, "violation": v})


@app.route("/api/violations/<vid>/resolve", methods=["POST"])
@owner_required
def api_violation_resolve(vid):
    with _LOCK:
        vs = _load(VIOLATIONS_PATH)
        for v in vs:
            if v.get("id") == vid:
                v["resolved"] = True
                v["resolved_at"] = datetime.datetime.now().isoformat(timespec="seconds")
                _save(VIOLATIONS_PATH, vs)
                return jsonify({"ok": True, "violation": v})
    return jsonify({"ok": False, "error": "not found"}), 404


@app.route("/api/violations")
@owner_required
def api_all_violations():
    """Owner overview: every driver with active compliance issues."""
    out = []
    for r in _load(RENTERS_PATH):
        s = _violation_summary(r)
        if s["active_count"] or any(v.get("severity") == "low" for v in s["auto"]):
            out.append({"renter_id": r.get("id"), "name": r.get("name"),
                        "active_count": s["active_count"], "worst": s["worst"],
                        "auto": s["auto"], "manual": s["manual"]})
    out.sort(key=lambda d: {"high": 0, "medium": 1, "low": 2, "none": 3}.get(d["worst"], 3))
    return jsonify({"ok": True, "drivers": out})


# ---------- driver paperwork / document archive ----------
@app.route("/api/renters/<rid>/documents")
@renter_self_or_owner
def api_renter_documents(rid):
    """The driver's paper trail: archived uploads + signed-agreement history."""
    renter = next((x for x in _load(RENTERS_PATH) if x.get("id") == rid), None)
    if not renter:
        return jsonify({"ok": False, "error": "not found"}), 404
    return jsonify({"ok": True, "types": DOC_TYPES, **_driver_documents(rid)})


@app.route("/api/renters/<rid>/documents/upload", methods=["POST"])
@renter_self_or_owner
def api_renter_document_upload(rid):
    """Driver uploads a piece of paperwork. It is ARCHIVED, not overwritten."""
    renter = next((x for x in _load(RENTERS_PATH) if x.get("id") == rid), None)
    if not renter:
        return jsonify({"ok": False, "error": "Unknown driver."}), 400
    data = request.get_json(force=True, silent=True) or {}
    doc_type = (data.get("doc_type") or "Other").strip() or "Other"
    original = (data.get("original_name") or "").strip()
    notes = (data.get("notes") or "").strip()
    saved, size = _save_document_file(data.get("file") or "", rid)
    if saved == "TOO_BIG":
        return jsonify({"ok": False, "error": "That file is too large (max 15 MB)."}), 400
    if not saved:
        return jsonify({"ok": False, "error": "Attach a photo or PDF of the document."}), 400
    rec = _add_document(rid, doc_type, original or (doc_type + " upload"), saved, "documents", size, "upload", notes)
    return jsonify({"ok": True, "document": rec})


@app.route("/api/documents")
@owner_required
def api_all_documents():
    """Owner overview: every driver with their full paper trail + compliance status."""
    out = []
    for r in _load(RENTERS_PATH):
        dd = _driver_documents(r.get("id"))
        vs = _violation_summary(r)
        ins = _insurance_status(r)
        out.append({"renter_id": r.get("id"), "name": r.get("name"),
                    "vin": (r.get("car") or {}).get("vin", ""),
                    "documents": dd["documents"], "agreements": dd["agreements"],
                    "doc_count": len(dd["documents"]),
                    "compliance": {"active": vs["active_count"], "worst": vs["worst"],
                                   "good": vs["in_good_standing"]},
                    "insurance": {"state": ins.get("state"), "expires": ins.get("expires")}})
    return jsonify({"ok": True, "drivers": out})


@app.route("/api/renters/<rid>/documents/<docid>/file")
@owner_required
def api_renter_document_file(rid, docid):
    """Owner-only: retrieve an archived document file for verification."""
    d = next((x for x in _load(DOCUMENTS_PATH) if x.get("id") == docid and x.get("renter_id") == rid), None)
    if not d:
        return jsonify({"ok": False, "error": "not found"}), 404
    base = DOCUMENTS_DIR if d.get("stored_dir") == "documents" else INSURANCE_DIR
    path = os.path.join(base, d.get("stored_name") or "")
    if not os.path.exists(path):
        return jsonify({"ok": False, "error": "File missing."}), 404
    return send_file(path)


# ---------- rent-to-own payment tracking (Square) ----------
_SQ_INV_CACHE = {"data": None, "ts": 0}


def _square_invoices():
    """All Square invoices as simple records {given, family, amount, date, status},
    cached ~5 min. Used to count a driver's rent-to-own payments."""
    now = time.time()
    if _SQ_INV_CACHE["data"] is not None and (now - _SQ_INV_CACHE["ts"] < 300):
        return _SQ_INV_CACHE["data"]
    tok = os.environ.get("SQUARE_ACCESS_TOKEN", "").strip()
    loc = os.environ.get("SQUARE_LOCATION_ID", "").strip()
    if not (tok and loc):
        return _SQ_INV_CACHE["data"] or []
    try:
        import requests
        out, cursor = [], None
        while True:
            url = "https://connect.squareup.com/v2/invoices?location_id=%s&limit=200" % loc
            if cursor:
                url += "&cursor=" + cursor
            j = requests.get(url, timeout=20, headers={
                "Authorization": "Bearer " + tok, "Square-Version": "2024-06-04"}).json()
            for iv in j.get("invoices", []):
                pr = iv.get("primary_recipient") or {}
                amt = 0
                for r in (iv.get("payment_requests") or []):
                    m = r.get("computed_amount_money") or r.get("total_completed_amount_money")
                    if m:
                        amt = (m.get("amount") or 0) / 100.0
                        break
                out.append({
                    "given": (pr.get("given_name") or "").strip(),
                    "family": (pr.get("family_name") or "").strip(),
                    "amount": amt, "date": (iv.get("created_at") or "")[:10],
                    "status": iv.get("status"),
                })
            cursor = j.get("cursor")
            if not cursor:
                break
        _SQ_INV_CACHE["data"] = out
        _SQ_INV_CACHE["ts"] = now
        return out
    except Exception:
        return _SQ_INV_CACHE["data"] or []


@app.route("/api/renters/<rid>/rto")
@renter_self_or_owner
def api_renter_rto(rid):
    """A driver's rent-to-own progress: how many of the (default 144) weekly Square
    payments are done, total paid, remaining, and estimated contract-release date."""
    renter = next((x for x in _load(RENTERS_PATH) if x.get("id") == rid), None)
    if not renter:
        return jsonify({"ok": False, "error": "not found"}), 404
    rto = renter.get("rto")
    if not rto:
        return jsonify({"ok": True, "enrolled": False})
    total = int(rto.get("total_payments", 144))
    match = [m.strip().lower() for m in (rto.get("match_names") or []) if str(m).strip()]
    if not match:
        match = [_last_name(renter.get("name"))]
    paid = []
    for iv in _square_invoices():
        if iv["status"] != "PAID":
            continue
        full = (iv["given"] + " " + iv["family"]).strip().lower()
        if iv["family"].lower() in match or any(m in full for m in match):
            paid.append(iv)
    paid.sort(key=lambda x: x["date"])
    made = len(paid)
    total_paid = round(sum(iv["amount"] for iv in paid), 2)
    payment_usd = round(float(rto.get("payment_usd") or (paid[-1]["amount"] if paid else 0)), 2)
    remaining = max(total - made, 0)
    release = None
    if remaining > 0:
        release = (datetime.date.today() + datetime.timedelta(weeks=remaining)).isoformat()
    return jsonify({
        "ok": True, "enrolled": True,
        "total_payments": total, "payments_made": made,
        "payment_usd": payment_usd, "total_paid": total_paid,
        "remaining_payments": remaining, "remaining_usd": round(remaining * payment_usd, 2),
        "release_estimate": release,
        "payments": [{"date": iv["date"], "amount": iv["amount"]} for iv in paid],
    })


# ---------- driver contract signing ----------
@app.route("/api/contract")
def api_contract():
    c = _load_contract()
    return jsonify({"ok": True, "contract": {
        "version": c.get("version"), "title": c.get("title"),
        "body": c.get("body"), "effective_date": c.get("effective_date"),
    }})


@app.route("/api/contract/status")
def api_contract_status():
    """A driver's own contract status. The owner may ask about any driver;
    everyone else only ever gets their own, so this can't be used to probe
    which sequential driver ids exist."""
    if session.get("owner"):
        rid = (request.args.get("renter_id") or "").strip()
    else:
        rid = (session.get("renter_id") or "").strip()
    if not rid:
        return jsonify({"ok": False, "auth_required": True,
                        "error": "Please sign in."}), 401
    return jsonify({"ok": True, **_contract_status(rid)})


@app.route("/api/contract/sign", methods=["POST"])
def api_contract_sign():
    """A driver signs the current contract version: typed full name + drawn
    signature + explicit agreement. Server stamps time, IP and version.

    The signer is taken from the session. This record is the binding proof
    that a specific driver accepted the agreement, so accepting an id from
    the request body meant anyone could file a signature in another driver's
    name — and that signature is what unlocks accepting rides."""
    data = request.get_json(force=True, silent=True) or {}
    rid = (session.get("renter_id") or "").strip()
    if not rid:
        return jsonify({"ok": False, "auth_required": True,
                        "error": "Please sign in before signing the agreement."}), 401
    typed = (data.get("typed_name") or "").strip()
    sig_img = (data.get("signature") or "").strip()
    agree = bool(data.get("agree"))
    renter = next((x for x in _load(RENTERS_PATH) if x.get("id") == rid), None)
    if not renter:
        return jsonify({"ok": False, "error": "Unknown driver — please sign in first."}), 400
    if not agree:
        return jsonify({"ok": False, "error": "Please check the box to confirm you agree."}), 400
    if not typed:
        return jsonify({"ok": False, "error": "Please type your full legal name."}), 400
    if not sig_img.startswith("data:image"):
        return jsonify({"ok": False, "error": "Please draw your signature before submitting."}), 400
    contract = _load_contract()
    with _LOCK:
        sigs = _load(SIGNATURES_PATH)
        if any(s.get("renter_id") == rid and s.get("version") == contract.get("version") for s in sigs):
            return jsonify({"ok": True, "already": True, **_contract_status(rid)})
        sigs.append({
            "renter_id": rid,
            "driver_name": renter.get("name"),
            "version": contract.get("version"),
            "contract_title": contract.get("title"),
            "typed_name": typed,
            "signature": sig_img,
            "signed_at": datetime.datetime.now().isoformat(timespec="seconds"),
            "ip": request.headers.get("X-Forwarded-For", request.remote_addr),
            "user_agent": request.headers.get("User-Agent", ""),
        })
        _save(SIGNATURES_PATH, sigs)
    return jsonify({"ok": True, **_contract_status(rid)})


@app.route("/api/contract/roster")
def api_contract_roster():
    """Owner view: every driver's signing status for the current version."""
    contract = _load_contract()
    rows = []
    for r in _load(RENTERS_PATH):
        st = _contract_status(r.get("id"))
        rows.append({
            "renter_id": r.get("id"), "name": r.get("name"), "phone": r.get("phone"),
            "status": st["status"], "signed_version": st["signed_version"],
        })
    return jsonify({"ok": True, "current_version": contract.get("version"), "drivers": rows})


@app.route("/api/contract/publish", methods=["POST"])
def api_contract_publish():
    """Owner updates the active contract text. Bumps the version so every
    driver is prompted to re-sign the new version."""
    data = request.get_json(force=True, silent=True) or {}
    title = (data.get("title") or "").strip()
    body = (data.get("body") or "").strip()
    if not body:
        return jsonify({"ok": False, "error": "Contract body is required."}), 400
    with _LOCK:
        cur = _load_contract()
        new = {
            "version": (cur.get("version") or 0) + 1,
            "title": title or cur.get("title"),
            "body": body,
            "effective_date": datetime.date.today().isoformat(),
            "updated_at": datetime.datetime.now().isoformat(timespec="seconds"),
        }
        _save_contract(new)
    return jsonify({"ok": True, "contract": new})


# ---------- agents (referral partners) ----------
@app.route("/api/agents/register", methods=["POST"])
def api_agent_register():
    """Anyone can become an agent — individual or organization. On registration
    they receive a unique agent code, which is their sign-in credential."""
    data = request.get_json(force=True, silent=True) or {}
    name = (data.get("name") or "").strip()
    if not name:
        return jsonify({"ok": False, "error": "Name is required."}), 400
    agent_type = (data.get("agent_type") or "individual").strip().lower()
    if agent_type not in ("individual", "organization"):
        agent_type = "individual"
    org = (data.get("organization") or "").strip()
    if agent_type == "organization" and not org:
        return jsonify({"ok": False, "error": "Organization name is required."}), 400
    with _LOCK:
        agents = _load(AGENTS_PATH)
        agent = {
            "id": _next_id(agents, "AGT", datestamp=False),
            "code": _gen_agent_code(agents),
            "type": agent_type,
            "name": name,
            "email": (data.get("email") or "").strip(),
            "phone": (data.get("phone") or "").strip(),
            "organization": org,
            "commission_usd": _agent_commission_usd(None),   # flat $15 per referral
            "joined_at": datetime.datetime.now().isoformat(timespec="seconds"),
        }
        agents.append(agent)
        _save(AGENTS_PATH, agents)
    session["agent_id"] = agent["id"]
    record_conversion("agent_signup")
    return jsonify({"ok": True, "agent": agent})


@app.route("/api/agents")
@owner_required
def api_agents():
    return jsonify({"agents": _load(AGENTS_PATH)})


@app.route("/api/agents/<aid>")
@agent_self_or_owner
def api_agent(aid):
    agent = next((x for x in _load(AGENTS_PATH) if x.get("id") == aid), None)
    if not agent:
        return jsonify({"ok": False, "error": "not found"}), 404
    referrals = [r for r in _load(RES_PATH) if (r.get("agent") or {}).get("id") == aid]
    total_commission = round(sum((r.get("agent") or {}).get("commission_usd", 0) for r in referrals), 2)
    paid_rides = [r for r in referrals if r.get("status") == "COMPLETED"]
    earned_commission = round(sum((r.get("agent") or {}).get("commission_usd", 0) for r in paid_rides), 2)
    # Pending = still in play (NEW/ASSIGNED) — excludes CANCELED so a dead ride
    # doesn't inflate the agent's "in progress" commission total.
    open_rides = [r for r in referrals if r.get("status") not in ("COMPLETED", "CANCELED")]
    pending_commission = round(sum((r.get("agent") or {}).get("commission_usd", 0) for r in open_rides), 2)
    # Driver-Agent self-referrals: on a trip you referred AND drove, you keep the
    # FULL fare (commission + trip), so the take is the fare, not just the commission.
    self_service = [r for r in paid_rides if r.get("self_service")]
    full_fare_take = round(sum(float(r.get("fare_usd") or 0) for r in self_service), 2)
    total_take = round(sum(
        (float(r.get("fare_usd") or 0) if r.get("self_service")
         else float((r.get("agent") or {}).get("commission_usd") or 0))
        for r in paid_rides), 2)
    # payout ledger: what's been paid out vs still available to request
    my_payouts = [p for p in _load(PAYOUTS_PATH) if p.get("agent_id") == aid]
    paid_out = round(sum(float(p.get("amount") or 0) for p in my_payouts if p.get("status") == "PAID"), 2)
    requested_open = round(sum(float(p.get("amount") or 0) for p in my_payouts if p.get("status") == "REQUESTED"), 2)
    return jsonify({
        "ok": True,
        "agent": agent,
        "referrals": list(reversed(referrals)),
        "total_commission": total_commission,      # all referrals
        "earned_commission": earned_commission,     # completed rides only (commission)
        "pending_commission": pending_commission,   # still in play — excludes canceled rides
        "self_service_count": len(self_service),    # trips you referred AND drove
        "full_fare_take": full_fare_take,           # full fares kept on self-service trips
        "total_take": total_take,                   # your true earnings: full fare on self-service, commission otherwise
        "referral_count": len(referrals),
        "paid_out": paid_out,                       # money already sent to you
        "payout_requested": requested_open,         # requests awaiting the owner
        "available_to_pay_out": round(total_take - paid_out - requested_open, 2),
        "payouts": list(reversed(my_payouts)),      # your payout history
    })


# ======================================================================
# PAYOUTS — agents/driver-agents request their earned money; the owner
# marks it paid once sent (Zelle/cash/check — the site never moves money).
# payouts.json is an append-only ledger: REQUESTED → PAID / DECLINED.
# ======================================================================
PAYOUTS_PATH = _data_path("payouts.json")


def _agent_take_paid(aid):
    """(total_take, paid_out, requested_open) for an agent — the money math."""
    referrals = [r for r in _load(RES_PATH) if (r.get("agent") or {}).get("id") == aid]
    done = [r for r in referrals if r.get("status") == "COMPLETED"]
    total_take = round(sum(
        (float(r.get("fare_usd") or 0) if r.get("self_service")
         else float((r.get("agent") or {}).get("commission_usd") or 0))
        for r in done), 2)
    outs = [p for p in _load(PAYOUTS_PATH) if p.get("agent_id") == aid]
    paid_out = round(sum(float(p.get("amount") or 0) for p in outs if p.get("status") == "PAID"), 2)
    requested = round(sum(float(p.get("amount") or 0) for p in outs if p.get("status") == "REQUESTED"), 2)
    return total_take, paid_out, requested


@app.route("/api/agents/<aid>/payout-request", methods=["POST"])
@agent_self_or_owner
def api_agent_payout_request(aid):
    """Agent requests a payout of their available balance. Owner is alerted."""
    agent = next((x for x in _load(AGENTS_PATH) if x.get("id") == aid), None)
    if not agent:
        return jsonify({"ok": False, "error": "Unknown agent."}), 404
    data = request.get_json(force=True, silent=True) or {}
    total_take, paid_out, requested = _agent_take_paid(aid)
    available = round(total_take - paid_out - requested, 2)
    if available <= 0:
        return jsonify({"ok": False, "error": "Nothing available to pay out yet — commissions become payable when rides complete."}), 400
    try:
        amount = round(float(data.get("amount") or available), 2)
    except Exception:
        amount = available
    if amount <= 0 or amount > available:
        return jsonify({"ok": False, "error": "You can request up to $%.2f." % available}), 400
    method = (data.get("method") or "").strip()
    with _LOCK:
        outs = _load(PAYOUTS_PATH)
        rec = {"id": _next_id(outs, "PAYOUT", datestamp=False),
               "agent_id": aid, "agent_name": agent.get("name"),
               "amount": amount, "method": method,
               "status": "REQUESTED",
               "requested_at": datetime.datetime.now().isoformat(timespec="seconds")}
        outs.append(rec)
        _save(PAYOUTS_PATH, outs)
    _push_owner_alert("PAYOUT", "PAYOUT REQUEST %s — %s requests $%.2f%s. Available balance was $%.2f. Review in Dispatch → Payouts." % (
        rec["id"], agent.get("name"), amount, (" via " + method) if method else "", available))
    return jsonify({"ok": True, "payout": rec, "available_after": round(available - amount, 2)})


@app.route("/api/payouts")
@owner_required
def api_payouts():
    """Owner: every payout request, newest first, plus per-agent balances."""
    outs = list(reversed(_load(PAYOUTS_PATH)))
    balances = []
    for a in _load(AGENTS_PATH):
        total_take, paid_out, requested = _agent_take_paid(a.get("id"))
        balances.append({"agent_id": a.get("id"), "name": a.get("name"),
                         "payout_email": a.get("payout_email") or "",
                         "total_take": total_take, "paid_out": paid_out,
                         "requested": requested,
                         "available": round(total_take - paid_out - requested, 2)})
    return jsonify({"ok": True, "payouts": outs, "balances": balances,
                    "paypal": paypal_client.status()})


@app.route("/api/payouts/<pid>/mark-paid", methods=["POST"])
@owner_required
def api_payout_mark_paid(pid):
    """Owner confirms the money was sent (outside the site) — ledger goes honest."""
    data = request.get_json(force=True, silent=True) or {}
    with _LOCK:
        outs = _load(PAYOUTS_PATH)
        p = next((x for x in outs if x.get("id") == pid), None)
        if not p:
            return jsonify({"ok": False, "error": "not found"}), 404
        if p.get("status") != "REQUESTED":
            return jsonify({"ok": False, "error": "Already %s." % p.get("status")}), 409
        p["status"] = "PAID"
        p["paid_at"] = datetime.datetime.now().isoformat(timespec="seconds")
        p["paid_method"] = (data.get("method") or p.get("method") or "").strip()
        p["reference"] = (data.get("reference") or "").strip()
        _save(PAYOUTS_PATH, outs)
    return jsonify({"ok": True, "payout": p})


@app.route("/api/agents/<aid>/payout-email", methods=["POST"])
@agent_self_or_owner
def api_agent_payout_email(aid):
    """Agent saves where PayPal payouts should go."""
    data = request.get_json(force=True, silent=True) or {}
    email = (data.get("payout_email") or "").strip()
    if email and "@" not in email:
        return jsonify({"ok": False, "error": "That doesn't look like an email."}), 400
    with _LOCK:
        agents = _load(AGENTS_PATH)
        a = next((x for x in agents if x.get("id") == aid), None)
        if not a:
            return jsonify({"ok": False, "error": "Unknown agent."}), 404
        a["payout_email"] = email
        _save(AGENTS_PATH, agents)
    return jsonify({"ok": True, "payout_email": email})


@app.route("/api/paypal/status")
@owner_required
def api_paypal_status():
    return jsonify({"ok": True, **paypal_client.status()})


@app.route("/api/payouts/<pid>/pay-paypal", methods=["POST"])
@owner_required
def api_payout_pay_paypal(pid):
    """Owner clicks Pay — the site sends the PayPal payout, then marks PAID.
    Idempotent: our payout id is the PayPal batch id, so a retry can't double-pay."""
    with _LOCK:
        outs = _load(PAYOUTS_PATH)
        p = next((x for x in outs if x.get("id") == pid), None)
        if not p:
            return jsonify({"ok": False, "error": "not found"}), 404
        if p.get("status") != "REQUESTED":
            return jsonify({"ok": False, "error": "Already %s." % p.get("status")}), 409
        agent = next((a for a in _load(AGENTS_PATH) if a.get("id") == p.get("agent_id")), None)
        receiver = (agent or {}).get("payout_email") or ""
    # network call happens outside the lock; the REQUESTED check above plus
    # PayPal's batch-id dedupe together prevent double sends.
    result = paypal_client.send_payout(
        pid, receiver, p.get("amount"),
        note="Payout %s — Plateau Strategy Solution Lab" % pid)
    if not result.get("ok"):
        return jsonify({"ok": False, "error": result.get("error")}), 400
    with _LOCK:
        outs = _load(PAYOUTS_PATH)
        p = next((x for x in outs if x.get("id") == pid), None)
        if p and p.get("status") == "REQUESTED":
            p["status"] = "PAID"
            p["paid_at"] = datetime.datetime.now().isoformat(timespec="seconds")
            p["paid_method"] = "PayPal (%s)" % result.get("env")
            p["reference"] = result.get("batch_id", "")
            p["paypal_batch_status"] = result.get("batch_status", "")
            _save(PAYOUTS_PATH, outs)
    return jsonify({"ok": True, "payout": p, "paypal": result})


@app.route("/api/payouts/<pid>/decline", methods=["POST"])
@owner_required
def api_payout_decline(pid):
    data = request.get_json(force=True, silent=True) or {}
    with _LOCK:
        outs = _load(PAYOUTS_PATH)
        p = next((x for x in outs if x.get("id") == pid), None)
        if not p:
            return jsonify({"ok": False, "error": "not found"}), 404
        if p.get("status") != "REQUESTED":
            return jsonify({"ok": False, "error": "Already %s." % p.get("status")}), 409
        p["status"] = "DECLINED"
        p["declined_at"] = datetime.datetime.now().isoformat(timespec="seconds")
        p["decline_reason"] = (data.get("reason") or "").strip()
        _save(PAYOUTS_PATH, outs)
    return jsonify({"ok": True, "payout": p})


# ======================================================================
# 🤖 JARVIS — Sean's butler, embedded in the website. Owner-only.
# Same engine as the Telegram Jarvis: headless `claude -p` on Haiku
# (subscription billing — API key stripped), NO tools, answer-only.
# Live business context is injected so it can talk numbers honestly.
# ======================================================================
JARVIS_CLAUDE_BIN = "/Users/xiaojunzhu/.local/bin/claude"
JARVIS_MODEL = "claude-haiku-4-5-20251001"


def _jarvis_context():
    """Small, fast, local-only business snapshot (no external API calls)."""
    try:
        res = _load(RES_PATH)
        c = {}
        for r in res:
            c[r.get("status", "?")] = c.get(r.get("status", "?"), 0) + 1
        unc = len(_uncovered_rides())
        outs = _load(PAYOUTS_PATH)
        pending_pay = [p for p in outs if p.get("status") == "REQUESTED"]
        members = _load(BOARD_MEMBERS_PATH)
        agents = _load(AGENTS_PATH)
        drivers = _load(RENTERS_PATH)
        return ("LIVE BUSINESS SNAPSHOT (Plateau Strategy Solution Lab): "
                "reservations %s · %d rides currently uncovered (no driver) · "
                "%d payout requests awaiting ($%.2f) · %d agents · %d drivers · %d board members." % (
                    json.dumps(c), unc, len(pending_pay),
                    sum(float(p.get("amount") or 0) for p in pending_pay),
                    len(agents), len(drivers), len(members)))
    except Exception:
        return "LIVE BUSINESS SNAPSHOT: unavailable this moment."


@app.route("/api/jarvis/status")
def api_jarvis_status():
    return jsonify({"ok": True,
                    "available": bool(session.get("owner")) and os.path.exists(JARVIS_CLAUDE_BIN)})


@app.route("/api/jarvis", methods=["POST"])
@owner_required
def api_jarvis_chat():
    data = request.get_json(force=True, silent=True) or {}
    msg = (data.get("message") or "").strip()
    if not msg:
        return jsonify({"ok": False, "error": "Say something first."}), 400
    if len(msg) > 2000:
        return jsonify({"ok": False, "error": "A little shorter, please."}), 400
    history = data.get("history") or []
    hist_txt = "\n".join("%s: %s" % ("Sean" if h.get("role") == "user" else "Jarvis",
                                     str(h.get("text", ""))[:400])
                         for h in history[-8:])
    prompt = (
        "You are Claude acting as 'Jarvis', Sean's butler inside his Plateau Strategy "
        "Solution Lab website (rides, car rentals, finance). Voice: warm, concise, a touch "
        "of dry butler wit; address him as 'sir' occasionally, never every line. You have "
        "NO tools — answer from the snapshot and conversation only; if asked to act, explain "
        "where on the site to do it (Dispatch, Board, Archive, Books). NEVER invent numbers — "
        "only use the snapshot. Keep replies under 120 words.\n\n" +
        _jarvis_context() + "\n\n" +
        ("Recent conversation:\n" + hist_txt + "\n\n" if hist_txt else "") +
        "Sean: " + msg + "\nJarvis:")
    env = {k: v for k, v in os.environ.items() if k != "ANTHROPIC_API_KEY"}
    try:
        out = subprocess.run([JARVIS_CLAUDE_BIN, "-p", prompt, "--model", JARVIS_MODEL],
                             capture_output=True, text=True, timeout=120, env=env, cwd="/tmp")
        reply = (out.stdout or "").strip()
        if not reply:
            return jsonify({"ok": False, "error": "Jarvis is momentarily speechless — try again."}), 502
        return jsonify({"ok": True, "reply": reply})
    except subprocess.TimeoutExpired:
        return jsonify({"ok": False, "error": "Jarvis took too long thinking — try again."}), 504
    except Exception as e:
        return jsonify({"ok": False, "error": "Jarvis engine error: %s" % e}), 500


@app.route("/jarvis-widget.js")
def jarvis_widget_js():
    return send_file(os.path.join(BASE_DIR, "jarvis-widget.js"))


# ---------- role-based login (from the main page) ----------
@app.route("/api/customers/auth", methods=["POST"])
def api_customer_auth():
    """Customer logs in (email+password) or, if new, registers with their info."""
    data = request.get_json(force=True, silent=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    phone = (data.get("phone") or "").strip()
    password = data.get("password") or ""
    if not email or not password:
        return jsonify({"ok": False, "error": "Email and password are required."}), 400
    with _LOCK:
        customers = _load(CUSTOMERS_PATH)
        existing = next((c for c in customers if c.get("email") == email), None)
        if existing:
            if not _verify_pw(password, existing.get("pw_salt", ""), existing.get("pw_hash", "")):
                return jsonify({"ok": False, "error": "Wrong password for this email."}), 401
            cust = existing
        else:
            if not name:
                return jsonify({"ok": False, "error": "Enter your name to create your account."}), 400
            salt, h = _hash_pw(password)
            cust = {
                "id": _next_id(customers, "CUS", datestamp=False),
                "name": name, "email": email, "phone": phone,
                "pw_salt": salt, "pw_hash": h,
                "joined_at": datetime.datetime.now().isoformat(timespec="seconds"),
            }
            customers.append(cust)
            _save(CUSTOMERS_PATH, customers)
    return jsonify({"ok": True, "customer": {
        "id": cust["id"], "name": cust["name"], "email": cust["email"], "phone": cust.get("phone", "")}})


@app.route("/api/renters/login", methods=["POST"])
def api_renter_login():
    """Driver logs in with their renting VIN + birthday (DDMMYYYY, their login pass).
    The VIN identifies the car/driver; the birthday is the secret. Accounts created
    before birthdays existed enroll their birthday on first login (the exact 17-char
    VIN proves identity)."""
    data = request.get_json(force=True, silent=True) or {}
    vin = (data.get("vin") or "").strip().lower()
    dob = _norm_dob(data.get("dob"))
    if not vin:
        return jsonify({"ok": False, "error": "Enter your renting VIN."}), 400
    if not dob:
        return jsonify({"ok": False, "error": "Enter your birthday as DDMMYYYY (e.g. 07031990)."}), 400
    with _LOCK:
        renters = _load(RENTERS_PATH)
        for r in renters:
            rv = (r.get("car", {}).get("vin") or "").strip().lower()
            if not rv or rv != vin:
                continue
            stored = r.get("dob")
            if stored:
                if dob != stored:
                    return jsonify({"ok": False, "error": "That birthday doesn't match this vehicle."}), 401
            else:
                # legacy account with no birthday on file — enroll it now (VIN proves identity)
                r["dob"] = dob
                _save(RENTERS_PATH, renters)
            session["renter_id"] = r["id"]
            return jsonify({"ok": True, "renter": r})
    return jsonify({"ok": False, "error": "No driver found with that VIN."}), 404


@app.route("/api/renters/logout", methods=["POST"])
def api_renter_logout():
    session.pop("renter_id", None)
    return jsonify({"ok": True})


@app.route("/api/agents/login", methods=["POST"])
def api_agent_login():
    """Agent signs in with their agent code + last name. The code is unique, so
    it identifies the agent; the last name confirms it. Organization, if provided,
    is checked as extra verification (individuals may have none)."""
    data = request.get_json(force=True, silent=True) or {}
    code = (data.get("code") or "").strip().upper()
    last = (data.get("last_name") or "").strip().lower()
    org = (data.get("organization") or "").strip().lower()
    if not code or not last:
        return jsonify({"ok": False, "error": "Agent code and last name are required."}), 400
    for a in _load(AGENTS_PATH):
        ac = (a.get("code") or "").strip().upper()
        if ac and ac == code and _last_name(a.get("name")) == last:
            if org and (a.get("organization") or "").strip().lower() != org:
                continue   # organization was provided but doesn't match
            session["agent_id"] = a["id"]
            return jsonify({"ok": True, "agent": a})
    return jsonify({"ok": False, "error": "No agent matches that code and last name."}), 404


@app.route("/api/agents/logout", methods=["POST"])
def api_agent_logout():
    session.pop("agent_id", None)
    return jsonify({"ok": True})


# ---------- partner pipeline (organizations to recruit as referral agents) ----------
PARTNER_STATUSES = ["to_contact", "contacted", "interested", "signed", "declined"]


@app.route("/api/partners")
@owner_required
def api_partners():
    return jsonify({"ok": True, "partners": _load(PARTNERS_PATH), "statuses": PARTNER_STATUSES})


# ---------- pricing: custom service tickets + per-agent rates ----------
def _load_pricing():
    try:
        with open(PRICING_PATH) as f:
            d = json.load(f)
        if isinstance(d, dict) and isinstance(d.get("presets"), list):
            return d
    except Exception:
        pass
    return {"presets": []}


@app.route("/api/pricing")
def api_pricing():
    d = _load_pricing()
    default_fare = 45.0
    try:
        default_fare = float(os.environ.get("DEFAULT_FARE_USD", 45))
    except Exception:
        pass
    return jsonify({"ok": True, "presets": d["presets"], "default_fare": default_fare,
                    "base_fare": _ride_base_fare(), "per_mile": _ride_per_mile(),
                    "platform_fee": _platform_fee()})


@app.route("/api/pricing/add", methods=["POST"])
@owner_required
def api_pricing_add():
    data = request.get_json(force=True, silent=True) or {}
    name = (data.get("name") or "").strip()
    try:
        price = round(float(data.get("price")), 2)
    except Exception:
        return jsonify({"ok": False, "error": "A name and numeric price are required."}), 400
    if not name:
        return jsonify({"ok": False, "error": "A name is required."}), 400
    try:
        commission = round(float(data.get("commission")), 2)
    except (TypeError, ValueError):
        commission = _agent_commission_usd(None)   # default to the global commission
    with _LOCK:
        d = _load_pricing()
        d["presets"] = [p for p in d["presets"] if p.get("name") != name]  # replace same-named
        d["presets"].append({"name": name, "price": price, "commission": commission})
        tmp = PRICING_PATH + ".tmp"
        with open(tmp, "w") as f:
            json.dump(d, f, indent=2)
        os.replace(tmp, PRICING_PATH)
    return jsonify({"ok": True, "presets": d["presets"]})


@app.route("/api/pricing/delete", methods=["POST"])
@owner_required
def api_pricing_delete():
    data = request.get_json(force=True, silent=True) or {}
    name = (data.get("name") or "").strip()
    with _LOCK:
        d = _load_pricing()
        d["presets"] = [p for p in d["presets"] if p.get("name") != name]
        tmp = PRICING_PATH + ".tmp"
        with open(tmp, "w") as f:
            json.dump(d, f, indent=2)
        os.replace(tmp, PRICING_PATH)
    return jsonify({"ok": True, "presets": d["presets"]})


@app.route("/api/pricing/agent-rate", methods=["POST"])
@owner_required
def api_pricing_agent_rate():
    """Owner sets a per-agent default fare (their negotiated rate)."""
    data = request.get_json(force=True, silent=True) or {}
    aid = (data.get("agent_id") or "").strip()
    with _LOCK:
        agents = _load(AGENTS_PATH)
        a = next((x for x in agents if x.get("id") == aid), None)
        if not a:
            return jsonify({"ok": False, "error": "Unknown agent."}), 404
        raw = data.get("default_fare")
        if raw in (None, "", "null"):
            a.pop("default_fare", None)
        else:
            try:
                a["default_fare"] = round(float(raw), 2)
            except Exception:
                return jsonify({"ok": False, "error": "Rate must be a number."}), 400
        _save(AGENTS_PATH, agents)
    return jsonify({"ok": True, "agent": a})


@app.route("/api/partners/add", methods=["POST"])
@owner_required
def api_partner_add():
    data = request.get_json(force=True, silent=True) or {}
    name = (data.get("name") or "").strip()
    if not name:
        return jsonify({"ok": False, "error": "Organization name is required."}), 400
    with _LOCK:
        partners = _load(PARTNERS_PATH)
        p = {
            "id": _next_id(partners, "PTR", datestamp=False),
            "name": name,
            "type": (data.get("type") or "other").strip(),
            "phone": (data.get("phone") or "").strip(),
            "email": (data.get("email") or "").strip(),
            "website": (data.get("website") or "").strip(),
            "address": (data.get("address") or "").strip(),
            "status": "to_contact",
            "notes": (data.get("notes") or "").strip(),
            "added_at": datetime.datetime.now().isoformat(timespec="seconds"),
            "last_contacted": None,
        }
        partners.append(p)
        _save(PARTNERS_PATH, partners)
    return jsonify({"ok": True, "partner": p})


@app.route("/api/partners/<pid>/update", methods=["POST"])
@owner_required
def api_partner_update(pid):
    data = request.get_json(force=True, silent=True) or {}
    with _LOCK:
        partners = _load(PARTNERS_PATH)
        p = next((x for x in partners if x.get("id") == pid), None)
        if not p:
            return jsonify({"ok": False, "error": "not found"}), 404
        if "status" in data and data["status"] in PARTNER_STATUSES:
            p["status"] = data["status"]
            if data["status"] == "contacted" and not p.get("last_contacted"):
                p["last_contacted"] = datetime.datetime.now().isoformat(timespec="seconds")
        for f in ("notes", "phone", "email", "website", "address", "type", "name"):
            if f in data:
                p[f] = (data.get(f) or "").strip()
        _save(PARTNERS_PATH, partners)
    return jsonify({"ok": True, "partner": p})


@app.route("/api/partners/<pid>/delete", methods=["POST"])
@owner_required
def api_partner_delete(pid):
    with _LOCK:
        partners = _load(PARTNERS_PATH)
        new = [x for x in partners if x.get("id") != pid]
        if len(new) == len(partners):
            return jsonify({"ok": False, "error": "not found"}), 404
        _save(PARTNERS_PATH, new)
    return jsonify({"ok": True})


# ---------- finance: AI Debt Eliminator enrollment ----------
FINANCE_PLANS = {
    "annual": {"amount": 170.00, "label": "AI Debt Eliminator — Annual Plan", "billing": "$170/year"},
    "monthly": {"amount": 14.17, "label": "AI Debt Eliminator — Monthly Plan", "billing": "$14.17/month"},
}


@app.route("/api/finance/enroll", methods=["POST"])
def api_finance_enroll():
    """Enroll a customer in the AI Debt Eliminator and send their Square charge."""
    data = request.get_json(force=True, silent=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    phone = (data.get("phone") or "").strip()
    plan = (data.get("plan") or "annual").strip().lower()
    if plan not in FINANCE_PLANS:
        plan = "annual"
    if not name or not email:
        return jsonify({"ok": False, "error": "Name and email are required."}), 400

    p = FINANCE_PLANS[plan]
    invoice = square_client.create_charge(
        {"name": name, "email": email, "phone": phone},
        p["amount"], p["label"],
        "AI Debt Eliminator subscription (%s). 30-day free trial, then billed %s. "
        "Principal always protected — only profits go to debt." % (plan, p["billing"]))

    with _LOCK:
        signups = _load(FINANCE_PATH)
        signup = {
            "id": _next_id(signups, "FIN", datestamp=False),
            "created_at": datetime.datetime.now().isoformat(timespec="seconds"),
            "name": name, "email": email, "phone": phone,
            "plan": plan, "amount_usd": p["amount"], "billing": p["billing"],
            "status": "TRIAL",
            "invoice": invoice,
        }
        signups.append(signup)
        _save(FINANCE_PATH, signups)
    return jsonify({"ok": True, "signup": signup})


@app.route("/api/finance/signups")
@owner_required
def api_finance_signups():
    return jsonify({"signups": list(reversed(_load(FINANCE_PATH)))})


@app.route("/api/finance/wish", methods=["POST"])
def api_finance_wish():
    """Capture an interested visitor's email ('I wish that to be happening')."""
    data = request.get_json(force=True, silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    if "@" not in email or "." not in email.split("@")[-1]:
        return jsonify({"ok": False, "error": "Please enter a valid email."}), 400
    with _LOCK:
        wishes = _load(WISHLIST_PATH)
        if not any(w.get("email") == email for w in wishes):
            wishes.append({"email": email,
                           "created_at": datetime.datetime.now().isoformat(timespec="seconds")})
            _save(WISHLIST_PATH, wishes)
        count = len(wishes)
    return jsonify({"ok": True, "count": count})


@app.route("/api/finance/wishlist")
def api_finance_wishlist():
    return jsonify({"wishes": list(reversed(_load(WISHLIST_PATH)))})


# ---------- 🌟 travel wishes — what visitors WANT that the book doesn't have yet ----------
# The demand side of the Destination Book: places people ask for, and the city
# they want them in. Free-text, no account, no email required — a wish is a
# signal, and the counts tell us what to add (and where guides are wanted).
TRAVEL_WISHES_PATH = _data_path("travel_wishes.json")


@app.route("/api/travel-wish", methods=["POST"])
def api_travel_wish():
    d = request.get_json(force=True, silent=True) or {}
    wish = _no_tags((d.get("wish") or "").strip())[:120]
    if len(wish) < 2:
        return jsonify({"ok": False, "error": "Tell us the place or the kind of place."}), 400
    city = _no_tags((d.get("city") or "").strip().lower())[:40]
    kind = (d.get("kind") or "").strip().lower()
    if kind not in ("place", "food", "experience", "other"):
        kind = "other"
    contact = _no_tags((d.get("contact") or "").strip())[:120]   # optional
    with _LOCK:
        items = _load(TRAVEL_WISHES_PATH)
        if len(items) >= 5000:
            return jsonify({"ok": False, "error": "Wish list is full for now."}), 429
        items.append({"id": _next_id(items, "WSH", datestamp=False),
                      "wish": wish, "city": city, "kind": kind, "contact": contact,
                      "at": datetime.datetime.now().isoformat(timespec="seconds")})
        _save(TRAVEL_WISHES_PATH, items)
        # how many people asked for something similar — the useful public signal
        w_low = wish.lower()
        same = sum(1 for x in items if (x.get("wish") or "").lower() == w_low)
    return jsonify({"ok": True, "count": same, "total": len(items)})


@app.route("/api/travel-wishes")
def api_travel_wishes():
    """Public, aggregate-only: the most-asked-for wishes. No contact details."""
    items = _load(TRAVEL_WISHES_PATH)
    tally = {}
    for w in items:
        k = (w.get("wish") or "").strip()
        if not k:
            continue
        rec = tally.setdefault(k.lower(), {"wish": k, "city": w.get("city", ""), "n": 0})
        rec["n"] += 1
    top = sorted(tally.values(), key=lambda r: -r["n"])[:12]
    return jsonify({"ok": True, "total": len(items), "top": top})


# ---------- books & taxes ----------
_books_cache = {"t": 0, "data": None}


def _books_rows():
    """One row per money event (ride or finance signup), with live Square status."""
    import time as _time
    global _books_cache
    if _books_cache["data"] and _time.time() - _books_cache["t"] < 60:
        sq = _books_cache["data"]
    else:
        sq = square_client.list_invoices()
        _books_cache = {"t": _time.time(), "data": sq}
    sqinv = sq.get("invoices", {})

    rows, seen = [], set()
    for r in _load(RES_PATH):
        rid = r.get("id", "")
        live = sqinv.get(rid, {})
        status = live.get("status") or (r.get("invoice") or {}).get("status") or "UNKNOWN"
        seen.add(rid)
        rows.append({
            "date": (r.get("created_at") or "")[:10],
            "paid_date": live.get("updated_at", ""),
            "number": rid,
            "customer": r.get("client", {}).get("name", ""),
            "description": "%s -> %s" % (r.get("trip", {}).get("pickup", ""), r.get("trip", {}).get("dropoff", "")),
            "stream": "Rides",
            "status": status,
            "amount": round(float(r.get("fare_usd") or 0), 2),
        })
    for s in _load(FINANCE_PATH):
        sid = s.get("id", "")
        live = sqinv.get(sid, {})
        status = live.get("status") or (s.get("invoice") or {}).get("status") or "UNKNOWN"
        seen.add(sid)
        rows.append({
            "date": (s.get("created_at") or "")[:10],
            "paid_date": live.get("updated_at", ""),
            "number": sid,
            "customer": s.get("name", ""),
            "description": "AI Debt Eliminator (%s)" % s.get("plan", ""),
            "stream": "Finance",
            "status": status,
            "amount": round(float(s.get("amount_usd") or 0), 2),
        })
    # Square is the source of truth: include invoices that exist only in Square
    # (e.g. records cleared locally) so tax totals never miss real money.
    for num, live in sqinv.items():
        if num in seen:
            continue
        stream = "Rides" if num.startswith("RES_") else ("Finance" if num.startswith("FIN_") else "Other")
        rows.append({
            "date": live.get("created_at", "") or live.get("updated_at", ""),
            "paid_date": live.get("updated_at", ""),
            "number": num,
            "customer": "",
            "description": "(recorded in Square)",
            "stream": stream,
            "status": live.get("status") or "UNKNOWN",
            "amount": round(float(live.get("amount") or 0), 2),
        })
    # Canceled invoices are mostly booking mistakes / duplicates — no money changed
    # hands, so they're dropped from the books view, CSV, and tax totals. Square keeps
    # the underlying record if one is ever needed. New bookings are unaffected.
    rows = [r for r in rows if r["status"] != "CANCELED"]
    rows.sort(key=lambda x: x["date"], reverse=True)
    return rows


@app.route("/books")
def books_page():
    return send_file(os.path.join(BASE_DIR, "books.html"))


@app.route("/api/books/summary")
@owner_required
def api_books_summary():
    rows = _books_rows()
    paid = [r for r in rows if r["status"] == "PAID"]
    unpaid = [r for r in rows if r["status"] in ("UNPAID", "PARTIALLY_PAID", "SCHEDULED", "PUBLISHED")]
    canceled = [r for r in rows if r["status"] == "CANCELED"]
    monthly = {}
    for r in paid:
        m = (r["paid_date"] or r["date"])[:7]
        monthly[m] = round(monthly.get(m, 0) + r["amount"], 2)
    streams = {}
    for r in paid:
        streams[r["stream"]] = round(streams.get(r["stream"], 0) + r["amount"], 2)
    return jsonify({
        "paid_total": round(sum(r["amount"] for r in paid), 2),
        "unpaid_total": round(sum(r["amount"] for r in unpaid), 2),
        "canceled_total": round(sum(r["amount"] for r in canceled), 2),
        "paid_count": len(paid), "unpaid_count": len(unpaid), "canceled_count": len(canceled),
        "monthly": [{"month": k, "paid": v} for k, v in sorted(monthly.items(), reverse=True)],
        "streams": streams,
        "rows": rows[:200],
    })


@app.route("/api/books/export.csv")
@owner_required
def api_books_export():
    from flask import Response
    rows = _books_rows()
    lines = ["Date,Number,Customer,Description,Stream,Status,Amount"]
    for r in rows:
        vals = [(r["paid_date"] or r["date"]), r["number"], r["customer"],
                r["description"], r["stream"], r["status"], "%.2f" % r["amount"]]
        lines.append(",".join('"%s"' % str(v).replace('"', '""') for v in vals))
    csv = "\n".join(lines) + "\n"
    return Response(csv, mimetype="text/csv",
                    headers={"Content-Disposition": "attachment; filename=plateau-books.csv"})


# ---------- articles / proposals — the Reinvestment USA business-idea board ----------
# Open to anyone, no login: pitch a business idea, and readers can register
# interest to invest in it or to launch/run it themselves. This is a lead
# board only — no money or equity ever moves through the site; registering
# interest just leaves contact info for Plateau Strategy to follow up on.
def _public_article(a):
    """Public shape — investor/launcher emails are kept private, only counts are shown."""
    return {
        "id": a.get("id"),
        "author": a.get("author", ""),
        "created_at": a.get("created_at"),
        "stamp": a.get("stamp", ""),
        "title": a.get("title"),
        "body": a.get("body"),
        "likes": a.get("likes", 0),
        "unlikes": a.get("unlikes", 0),
        "follower_count": len(a.get("followers", [])),
        "launcher_count": len(a.get("launchers", [])),
    }


@app.route("/api/articles")
def api_articles():
    items = _load(ARTICLES_PATH)
    return jsonify({"articles": [_public_article(a) for a in reversed(items)]})


@app.route("/api/articles", methods=["POST"])
def api_article_create():
    data = request.get_json(force=True, silent=True) or {}
    author = _no_tags((data.get("author") or "").strip())
    title = _no_tags((data.get("title") or "").strip())
    body = _no_tags((data.get("body") or "").strip())
    if not author or not title or not body:
        return jsonify({"ok": False, "error": "Your name, a title and body are all required."}), 400
    with _LOCK:
        items = _load(ARTICLES_PATH)
        now = datetime.datetime.now()
        article = {
            "id": _next_id(items, "ART", datestamp=False),
            "author": author[:80],
            "created_at": now.isoformat(timespec="seconds"),
            "stamp": now.strftime("%Y%m%d%H%M%S"),  # time-proof mark: YYYYMMDDHHMMSS
            "title": title[:200],
            "body": body[:20000],
            "likes": 0,
            "unlikes": 0,
            "followers": [],
            "launchers": [],
        }
        items.append(article)
        _save(ARTICLES_PATH, items)
    return jsonify({"ok": True, "article": _public_article(article)})


@app.route("/api/articles/<aid>/vote", methods=["POST"])
def api_article_vote(aid):
    """Adjust like/unlike counts. Client sends its previous vote and new vote
    (each: like | unlike | none) so toggling is handled cleanly."""
    data = request.get_json(force=True, silent=True) or {}
    prev = (data.get("prev") or "none").lower()
    vote = (data.get("vote") or "none").lower()
    like_d = (1 if vote == "like" else 0) - (1 if prev == "like" else 0)
    unlike_d = (1 if vote == "unlike" else 0) - (1 if prev == "unlike" else 0)
    with _LOCK:
        items = _load(ARTICLES_PATH)
        for a in items:
            if a.get("id") == aid:
                a["likes"] = max(0, a.get("likes", 0) + like_d)
                a["unlikes"] = max(0, a.get("unlikes", 0) + unlike_d)
                _save(ARTICLES_PATH, items)
                return jsonify({"ok": True, "likes": a["likes"], "unlikes": a["unlikes"]})
    return jsonify({"ok": False, "error": "not found"}), 404


@app.route("/api/articles/<aid>/follow", methods=["POST"])
def api_article_follow(aid):
    """Register interest to INVEST in this business idea — an email left here
    is a lead, not a transaction; Plateau Strategy follows up directly."""
    data = request.get_json(force=True, silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    if "@" not in email or "." not in email.split("@")[-1]:
        return jsonify({"ok": False, "error": "Please enter a valid email."}), 400
    with _LOCK:
        items = _load(ARTICLES_PATH)
        for a in items:
            if a.get("id") == aid:
                followers = a.setdefault("followers", [])
                if email not in followers:
                    followers.append(email)
                    _save(ARTICLES_PATH, items)
                return jsonify({"ok": True, "follower_count": len(followers)})
    return jsonify({"ok": False, "error": "not found"}), 404


@app.route("/api/articles/<aid>/launch", methods=["POST"])
def api_article_launch(aid):
    """Register interest to LAUNCH/run this business idea — same lead-only
    contract as /follow, tracked separately so an idea's two audiences
    (capital vs. operators) don't get mixed together."""
    data = request.get_json(force=True, silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    if "@" not in email or "." not in email.split("@")[-1]:
        return jsonify({"ok": False, "error": "Please enter a valid email."}), 400
    with _LOCK:
        items = _load(ARTICLES_PATH)
        for a in items:
            if a.get("id") == aid:
                launchers = a.setdefault("launchers", [])
                if email not in launchers:
                    launchers.append(email)
                    _save(ARTICLES_PATH, items)
                return jsonify({"ok": True, "launcher_count": len(launchers)})
    return jsonify({"ok": False, "error": "not found"}), 404


# ======================================================================
# ARCHIVE — one owner-only home for every paper trail the site produces.
# Each section aggregates a data store into flat rows so the owner can
# browse and export (CSV) bookings, the marketing contact list, signed
# agreements, uploaded paperwork, leads, partners, compliance and audit.
# ======================================================================
def _arch_bookings():
    out = []
    for r in reversed(_load(RES_PATH)):
        c = r.get("client", {}) or {}
        t = r.get("trip", {}) or {}
        inv = r.get("invoice", {}) or {}
        ag = r.get("agent", {}) or {}
        out.append({
            "id": r.get("id", ""), "date": r.get("created_at", ""),
            "type": r.get("trip_type", "airport"),
            "client": c.get("name", ""), "email": c.get("email", ""), "phone": c.get("phone", ""),
            "pickup": t.get("pickup", ""), "dropoff": t.get("dropoff", ""),
            "when": ("%s %s" % (t.get("date", ""), t.get("time", ""))).strip(),
            "fare_usd": r.get("fare_usd", 0), "status": r.get("status", ""),
            "agent": ag.get("name", ""), "driver": r.get("driver") or "",
            "invoice": inv.get("url") or inv.get("id") or "",
        })
    return out


def _arch_contacts():
    """Every captured email/phone across the whole site, de-duped — the marketing list."""
    seen, out = set(), []

    def add(name, email, phone, source, ref, when):
        email = (email or "").strip().lower()
        phone = (phone or "").strip()
        if not email and not phone:
            return
        key = email or phone
        if key in seen:
            return
        seen.add(key)
        out.append({"name": name or "", "email": email, "phone": phone,
                    "source": source, "ref": ref or "", "date": when or ""})

    for r in reversed(_load(RES_PATH)):
        c = r.get("client", {}) or {}
        add(c.get("name"), c.get("email"), c.get("phone"), "Booking", r.get("id"), r.get("created_at"))
    for c in _load(CUSTOMERS_PATH):
        add(c.get("name"), c.get("email"), c.get("phone"), "Customer account", c.get("id"),
            c.get("created_at") or c.get("joined_at"))
    for a in _load(AGENTS_PATH):
        add(a.get("name"), a.get("email"), a.get("phone"), "Agent", a.get("id"), a.get("joined_at"))
    for d in _load(RENTERS_PATH):
        add(d.get("name"), d.get("email"), d.get("phone"), "Driver", d.get("id"), d.get("joined_at"))
    for s in _load(FINANCE_PATH):
        add(s.get("name"), s.get("email"), s.get("phone"), "Finance signup", s.get("id"),
            s.get("ts") or s.get("created_at"))
    for s in _load(WISHLIST_PATH):
        add(s.get("name"), s.get("email"), s.get("phone"), "Finance wishlist", "", s.get("ts"))
    for s in _load(_data_path("deflator_waitlist.json")):
        add(s.get("name"), s.get("email"), s.get("phone"), "Deflator waitlist", "", s.get("ts"))
    for p in _load(PARTNERS_PATH):
        add(p.get("sales_contact") or p.get("name"), p.get("email"), p.get("phone"),
            "Partner / Atlas", p.get("id"), p.get("added_at"))
    return out


def _arch_people():
    out = []
    for a in _load(AGENTS_PATH):
        out.append({"role": "Agent", "id": a.get("id", ""), "name": a.get("name", ""),
                    "email": a.get("email", ""), "phone": a.get("phone", ""),
                    "detail": a.get("code", ""), "joined": a.get("joined_at", "")})
    for d in _load(RENTERS_PATH):
        out.append({"role": "Driver", "id": d.get("id", ""), "name": d.get("name", ""),
                    "email": d.get("email", ""), "phone": d.get("phone", ""),
                    "detail": d.get("car") or "", "joined": d.get("joined_at", "")})
    for c in _load(CUSTOMERS_PATH):
        out.append({"role": "Customer", "id": c.get("id", ""), "name": c.get("name", ""),
                    "email": c.get("email", ""), "phone": c.get("phone", ""),
                    "detail": "", "joined": c.get("created_at") or c.get("joined_at", "")})
    return out


def _arch_agreements():
    out = []
    for s in reversed(_load(SIGNATURES_PATH)):
        out.append({"driver_id": s.get("renter_id", ""),
                    "driver": s.get("driver_name") or s.get("typed_name", ""),
                    "document": s.get("contract_title", ""), "version": s.get("version", ""),
                    "signed_at": s.get("signed_at", ""), "ip": s.get("ip", "")})
    return out


def _arch_paperwork():
    out = []
    for d in reversed(_load(DOCUMENTS_PATH)):
        out.append({"id": d.get("id", ""), "driver_id": d.get("renter_id", ""),
                    "type": d.get("doc_type", ""), "file": d.get("original_name", ""),
                    "size": d.get("size", 0), "source": d.get("source", ""),
                    "uploaded_at": d.get("uploaded_at", "")})
    return out


def _arch_leads():
    out = []
    for s in reversed(_load(FINANCE_PATH)):
        out.append({"source": "Finance signup", "name": s.get("name", ""), "email": s.get("email", ""),
                    "detail": s.get("product") or s.get("plan") or "", "date": s.get("ts") or s.get("created_at", "")})
    for s in reversed(_load(WISHLIST_PATH)):
        out.append({"source": "Finance wishlist", "name": s.get("name", ""), "email": s.get("email", ""),
                    "detail": "", "date": s.get("ts", "")})
    for s in reversed(_load(_data_path("deflator_waitlist.json"))):
        out.append({"source": "Deflator waitlist", "name": s.get("name", ""), "email": s.get("email", ""),
                    "detail": s.get("source", ""), "date": s.get("ts", "")})
    return out


def _arch_partners():
    out = []
    for p in _load(PARTNERS_PATH):
        out.append({"id": p.get("id", ""), "name": p.get("name", ""),
                    "contact": p.get("sales_contact") or "", "title": p.get("title") or "",
                    "email": p.get("email", ""), "phone": p.get("phone", ""),
                    "status": p.get("status") or p.get("stage") or "",
                    "added": p.get("added_at", "")})
    return out


def _arch_compliance():
    out = []
    for v in reversed(_load(VIOLATIONS_PATH)):
        out.append({"driver_id": v.get("renter_id", ""), "kind": v.get("kind") or v.get("type", ""),
                    "detail": v.get("detail") or v.get("title", ""), "severity": v.get("severity", ""),
                    "resolved": bool(v.get("resolved")), "logged_at": v.get("logged_at", "")})
    return out


def _arch_payouts():
    out = []
    for p in reversed(_load(PAYOUTS_PATH)):
        out.append({"id": p.get("id", ""), "agent": p.get("agent_name", ""),
                    "amount": p.get("amount", 0), "status": p.get("status", ""),
                    "method": p.get("paid_method") or p.get("method", ""),
                    "reference": p.get("reference", ""),
                    "requested_at": p.get("requested_at", ""), "paid_at": p.get("paid_at", "")})
    return out


def _arch_activity():
    out = []
    for a in reversed(_load(_data_path("owner_alerts.json"))):
        out.append({"at": a.get("at", ""), "type": a.get("type", ""), "message": a.get("message", "")})
    return out


def _arch_traffic():
    """One row per day, newest first — page views, unique visitors, and the
    two tourist-facing tools (Trip Planner, Destination Book) broken out
    separately since that's usage, not just traffic."""
    data = _load_traffic()
    out = []
    for date in sorted(data["days"].keys(), reverse=True):
        rec = data["days"][date]
        paths = rec.get("paths", {})
        uniq = rec.get("unique_visitors")
        if uniq is None:  # today — still open, computed live from the raw ids
            uniq = len(rec.get("visitor_ids", []))
        row = {"date": date, "page_views": rec.get("pageviews", 0), "unique_visitors": uniq}
        tool_total = 0
        for path, key in TRAFFIC_TOOL_PATHS.items():
            n = paths.get(path, 0)
            row[key + "_views"] = n
            tool_total += n
        row["other_views"] = max(0, rec.get("pageviews", 0) - tool_total)
        out.append(row)
    return out


# What each conversion kind is called in the table, in the order shown.
CONVERSION_KINDS = [("booking", "bookings"),
                    ("agent_signup", "agent_signups"),
                    ("driver_signup", "driver_signups")]


def _arch_sources():
    """One row per day per source — where visitors came from, and what those
    visits turned into. This is how an ad gets judged: a source with visits and
    no bookings is spend that isn't working, whichever way the pageview line
    moved.

    A source can show conversions with zero visits that day — the psx_src
    cookie lasts 30 days, so someone who arrived on Monday and booked on
    Thursday is credited to Monday's source on Thursday's row. That is the
    honest placement: the booking happened Thursday."""
    data = _load_traffic()
    out = []
    for date in sorted(data["days"].keys(), reverse=True):
        rec = data["days"][date]
        visits = rec.get("sources", {})
        conv = rec.get("conversions", {})
        names = set(visits) | {s for kind in conv.values() for s in kind}
        rows = []
        for src in names:
            row = {"date": date, "source": src, "new_visitors": visits.get(src, 0)}
            for kind, label in CONVERSION_KINDS:
                row[label] = conv.get(kind, {}).get(src, 0)
            rows.append(row)
        # Busiest source first, so the day reads top-down.
        rows.sort(key=lambda r: (-r["new_visitors"], r["source"]))
        out.extend(rows)
    return out


@app.route("/api/online")
def api_online():
    """How many travelers are on the site right now. The caller's own ping keeps
    them counted, so an open tab stays 'online' while it polls. Anonymous and
    ephemeral — no identity, no history, nothing written to disk."""
    if not _skip_traffic():
        _presence_touch(request.cookies.get("psx_vid"))
    n = _presence_count()
    return jsonify({"ok": True, "online": n, "window_minutes": _PRESENCE_WINDOW // 60})


@app.route("/api/traffic/summary")
def api_traffic_summary():
    """Public, aggregate-only traffic numbers — no per-visitor detail, no
    owner login needed. Powers the small usage note next to the Trip
    Planner map and the Destination Book, so travelers see real numbers
    without needing the owner-only Archive."""
    days = _load_traffic()["days"]
    today_iso = datetime.date.today().isoformat()
    week_cutoff = (datetime.date.today() - datetime.timedelta(days=6)).isoformat()

    def sum_path(path, cutoff=None):
        """Times the page was opened."""
        total = 0
        for date, rec in days.items():
            if cutoff and date < cutoff:
                continue
            total += rec.get("paths", {}).get(path, 0)
        return total

    def people_path(path, cutoff=None):
        """People who opened it. Today's ids are still raw, so they can be
        counted across days without double-counting someone who came back;
        finished days keep only a per-day total, so those are summed. A visitor
        returning on two different days is two — the honest reading of "this
        week" — but one person refreshing thirty times is one, which is the
        number that used to be wrong."""
        total = 0
        for date, rec in days.items():
            if cutoff and date < cutoff:
                continue
            if "path_ids" in rec:
                total += len(rec["path_ids"].get(path, []))
            else:
                total += rec.get("path_uniques", {}).get(path, 0)
        return total

    def tool_stats(path):
        return {"today": people_path(path, today_iso),
                "week": people_path(path, week_cutoff),
                "all_time": people_path(path),
                # kept separately, clearly named — this is what the old numbers were
                "views_today": sum_path(path, today_iso),
                "views_week": sum_path(path, week_cutoff),
                "views_all_time": sum_path(path)}

    return jsonify({"ok": True,
                     "trip_planner": tool_stats("/trip-planner"),
                     "destination_book": tool_stats("/destination-book")})


def _arch_comments():
    """Community notes on places — newest first."""
    out = []
    for key, items in _comments_all().items():
        for m in items:
            out.append({"date": m.get("at", ""), "place": m.get("place", ""),
                        "city": m.get("city", ""), "author": m.get("author", ""),
                        "comment": m.get("text", "")})
    out.sort(key=lambda r: r.get("date", ""), reverse=True)
    return out


def _arch_wishes():
    """What visitors asked us to add — the demand signal behind the book."""
    out = []
    for w in reversed(_load(TRAVEL_WISHES_PATH)):
        out.append({"date": w.get("at", ""), "wish": w.get("wish", ""),
                    "city": w.get("city", ""), "kind": w.get("kind", ""),
                    "contact": w.get("contact", "")})
    return out


# section key → (label, one-line description, builder)
ARCHIVE_SECTIONS = [
    ("comments",   "💬 Place comments", "What travelers wrote about places in the Destination Book.", _arch_comments),
    ("wishes",     "🌟 Traveler wishes", "Places and experiences visitors asked us to add — the demand signal.", _arch_wishes),
    ("traffic",    "📈 Site traffic", "Daily page views, unique visitors, and Trip Planner / Destination Book usage.", _arch_traffic),
    ("sources",    "🎯 Where visitors came from", "Visits and bookings by source — Google, Reddit, direct, or a tagged ad. How you tell whether ad spend worked.", _arch_sources),
    ("bookings",   "🧾 Bookings & invoices", "Every reservation — customer, trip, fare, invoice and status.", _arch_bookings),
    ("contacts",   "📇 Contacts (marketing)", "Every captured email & phone across the whole site, de-duped — your advertising list.", _arch_contacts),
    ("people",     "👤 Accounts", "Agent, driver and customer accounts.", _arch_people),
    ("agreements", "✍️ Signed agreements", "Every signed Driver Agreement with version, timestamp and IP.", _arch_agreements),
    ("paperwork",  "📎 Driver paperwork", "Uploaded documents & files (append-only paper trail).", _arch_paperwork),
    ("leads",      "💡 Finance leads", "Finance signups, wishlist and Deflator research waitlist.", _arch_leads),
    ("partners",   "🏨 Partners / Atlas", "Prospect hotels and their sales contacts.", _arch_partners),
    ("compliance", "⚠️ Compliance", "Logged driver violations.", _arch_compliance),
    ("payouts",    "💸 Payouts ledger", "Every payout request and payment to agents & driver-agents.", _arch_payouts),
    ("activity",   "🔔 Activity log", "Owner alerts — give-ups, quote requests and other events.", _arch_activity),
]
_ARCHIVE_FN = {k: fn for k, _, _, fn in ARCHIVE_SECTIONS}


def _arch_last_date(rows):
    best = ""
    for r in rows:
        for f in ("date", "signed_at", "uploaded_at", "logged_at", "at", "joined"):
            v = r.get(f)
            if v:
                best = max(best, str(v))
                break
    return best


@app.route("/archive")
def archive_page():
    return send_file(os.path.join(BASE_DIR, "archive.html"))


@app.route("/api/archive/overview")
@owner_required
def api_archive_overview():
    cats = []
    for key, label, desc, fn in ARCHIVE_SECTIONS:
        rows = fn()
        cats.append({"key": key, "label": label, "desc": desc,
                     "count": len(rows), "last": _arch_last_date(rows)})
    return jsonify({"ok": True, "categories": cats})


@app.route("/api/archive/<section>")
@owner_required
def api_archive_section(section):
    fn = _ARCHIVE_FN.get(section)
    if not fn:
        return jsonify({"ok": False, "error": "Unknown section"}), 404
    rows = fn()
    cols = list(rows[0].keys()) if rows else []
    return jsonify({"ok": True, "section": section, "columns": cols, "rows": rows})


@app.route("/api/archive/export.csv")
@owner_required
def api_archive_export():
    import csv
    import io
    from flask import Response
    section = request.args.get("section", "contacts")
    fn = _ARCHIVE_FN.get(section)
    if not fn:
        return ("Unknown section", 404)
    rows = fn()
    cols = list(rows[0].keys()) if rows else ["(empty)"]
    buf = io.StringIO()
    w = csv.DictWriter(buf, fieldnames=cols)
    w.writeheader()
    for r in rows:
        w.writerow(r)
    return Response(buf.getvalue(), mimetype="text/csv",
                    headers={"Content-Disposition": "attachment; filename=archive_%s.csv" % section})


# ======================================================================
# BOARD OF DIRECTORS — private governance vault for the managing members.
# Keeps the company's corporate documents (bylaws, operating / shareholder
# agreements, formation docs, board resolutions, contracts, cap table…) plus
# a registry of the managing members. Owner-gated, append-only — nothing is
# ever overwritten, so it's a true corporate paper trail.
# ======================================================================
BOARD_DIR = _data_dir("board_docs")
BOARD_DOCS_PATH = _data_path("board_docs.json")
BOARD_MEMBERS_PATH = _data_path("board_members.json")
BOARD_DOC_TYPES = ["Bylaws", "Operating Agreement", "Shareholder Agreement",
                   "Articles of Formation", "Board Resolution", "Meeting Minutes",
                   "Contract", "Cap Table", "Tax / EIN", "Other"]


def _save_board_file(data_url):
    """Persist a governance document (PDF / Word / image data URL) to the board
    vault with a unique name so nothing is overwritten.
    Returns (stored_name, size) | ('TOO_BIG', 0) | (None, 0)."""
    import base64
    if not data_url or "," not in data_url:
        return None, 0
    header, b64 = data_url.split(",", 1)
    try:
        raw = base64.b64decode(b64)
    except Exception:
        return None, 0
    if len(raw) > 25 * 1024 * 1024:
        return "TOO_BIG", 0
    mime = header.split(";")[0].replace("data:", "").strip()
    ext = {"application/pdf": "pdf", "image/png": "png", "image/jpeg": "jpg",
           "image/jpg": "jpg", "image/webp": "webp", "image/heic": "heic",
           "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
           "application/msword": "doc"}.get(mime, "bin")
    os.makedirs(BOARD_DIR, exist_ok=True)
    fn = "board_%s_%s.%s" % (datetime.datetime.now().strftime("%Y%m%d%H%M%S"), secrets.token_hex(3), ext)
    with open(os.path.join(BOARD_DIR, fn), "wb") as f:
        f.write(raw)
    return fn, len(raw)


# ------------------------------------------------------------- guide trip studio
# A guide's product is not the sightseeing loop the planner draws — it is their
# own walk, with their own stops and their own timings. A Harvard student running
# an hour in the Yard needs to name each stop, say how long they stand there and
# why, and put a price on it. That is what this stores, and unlike the older
# "offer this route" inbox — which only ever reached the owner — these listings
# are meant to be READ BY THE PUBLIC. That is the whole point of selling one.
#
# The guide's contact details are never served publicly. A traveller registers
# interest through the site and the owner introduces them, so a listing cannot be
# scraped for emails.
GUIDE_TRIPS_PATH = _data_path("guide_trips.json")
GUIDE_INTEREST_PATH = _data_path("guide_interest.json")

TRIP_KINDS = ("in-depth", "campus", "history", "food", "architecture", "art",
              "nature", "photography", "family", "neighborhood", "nightlife", "other")


def _guide_for(code):
    code = (code or "").strip().upper()
    if not code:
        return None
    for a in _load(AGENTS_PATH):
        if (a.get("code") or "").strip().upper() == code:
            return a
    return None


def _trip_email_body(t):
    """The whole listing as plain text, so the email is a complete copy of it."""
    lines = ["A guide listed a trip for sale.", "",
             "TRIP", "  " + str(t.get("title", "")),
             "  %s · %s" % (t.get("city_label") or t.get("city") or "—", t.get("kind") or "—"),
             "  price: %s %s" % (t.get("price") if t.get("price") is not None else "on request",
                                 "per " + str(t.get("price_unit", "person"))),
             "  up to %s people · %s" % (t.get("group_max"), t.get("languages") or "language not given"),
             "  meet at: %s" % (t.get("meeting_point") or "—"),
             "  includes: %s" % (t.get("includes") or "—"), ""]
    if t.get("summary"):
        lines += ["WHAT THEY PROMISE", "  " + str(t["summary"]), ""]
    lines += ["STOPS (%s min in total)" % t.get("total_minutes", 0)]
    for i, s in enumerate(t.get("stops") or [], 1):
        lines.append("  %d. %s — %s min%s"
                     % (i, s.get("name", ""), s.get("minutes", 0),
                        ("  · " + s["note"]) if s.get("note") else ""))
    lines += ["", "GUIDE",
              "  %s%s" % (t.get("guide_name") or "—",
                          (" · " + t["guide_org"]) if t.get("guide_org") else ""),
              "  code:    %s" % (t.get("code") or "—"),
              "  contact: %s" % (t.get("contact") or "—"),
              "", "Listed %s · id %s" % (t.get("created_at", ""), t.get("id", "")),
              "", "Keep this email. The live site's storage is reset on every deploy,",
              "so this copy may outlast the listing itself."]
    return "\n".join(lines)


def _public_trip(t):
    """Everything a traveller may see. Contact details are deliberately absent."""
    return {k: t.get(k) for k in (
        "id", "title", "kind", "city", "city_label", "summary", "stops",
        "total_minutes", "languages", "group_max", "price", "price_unit",
        "meeting_point", "includes", "guide_name", "guide_org", "created_at",
        "interest_count")}


@app.route("/api/guide-trips", methods=["POST"])
def api_guide_trip_create():
    d = request.get_json(silent=True) or {}
    guide = _guide_for(d.get("guide_code"))
    if not guide:
        return jsonify({"ok": False, "error":
                        "That guide code was not recognised. Register as a guide to list a trip."}), 403
    title = _no_tags(str(d.get("title", "")).strip())[:90]
    if not title:
        return jsonify({"ok": False, "error": "Give your trip a title."}), 400
    stops_in = d.get("stops") if isinstance(d.get("stops"), list) else []
    stops = []
    for s in stops_in[:30]:
        nm = _no_tags(str((s or {}).get("name", "")).strip())[:80]
        if not nm:
            continue
        try:
            mins = int((s or {}).get("minutes") or 0)
        except (TypeError, ValueError):
            mins = 0
        stops.append({"name": nm, "minutes": max(0, min(mins, 600)),
                      "note": _no_tags(str((s or {}).get("note", "")).strip())[:300],
                      "lat": (s or {}).get("lat"), "lon": (s or {}).get("lon")})
    if not stops:
        return jsonify({"ok": False, "error": "Add at least one stop."}), 400
    kind = str(d.get("kind", "")).strip().lower()
    if kind not in TRIP_KINDS:
        kind = "other"
    try:
        price = round(float(d.get("price")), 2) if d.get("price") not in (None, "") else None
        if price is not None and not (0 <= price <= 100000):
            price = None
    except (TypeError, ValueError):
        price = None
    try:
        group_max = max(1, min(int(d.get("group_max") or 8), 200))
    except (TypeError, ValueError):
        group_max = 8
    rec = {
        "id": "", "code": (guide.get("code") or "").upper(),
        "guide_name": _no_tags(guide.get("name", ""))[:60],
        "guide_org": _no_tags(guide.get("organization", ""))[:80],
        "contact": _no_tags(str(d.get("contact") or guide.get("email") or "").strip())[:120],
        "title": title, "kind": kind,
        "city": _no_tags(str(d.get("city", "")).strip().lower())[:40],
        "city_label": _no_tags(str(d.get("city_label", "")).strip())[:80],
        "summary": _no_tags(str(d.get("summary", "")).strip())[:900],
        "stops": stops,
        "total_minutes": sum(s["minutes"] for s in stops),
        "languages": _no_tags(str(d.get("languages", "")).strip())[:80],
        "group_max": group_max,
        "price": price,
        "price_unit": "group" if str(d.get("price_unit")) == "group" else "person",
        "meeting_point": _no_tags(str(d.get("meeting_point", "")).strip())[:200],
        "includes": _no_tags(str(d.get("includes", "")).strip())[:400],
        "status": "LISTED", "interest_count": 0,
        "created_at": datetime.datetime.now().isoformat(timespec="seconds"),
    }
    with _LOCK:
        trips = _load(GUIDE_TRIPS_PATH)
        rec["id"] = _next_id(trips, "TRP")
        trips.append(rec)
        _save(GUIDE_TRIPS_PATH, trips)
    try:
        _push_owner_alert("guide_trip", "🎫 %s listed \"%s\" in %s — %s, %d stops."
                          % (rec["guide_name"], rec["title"],
                             rec["city_label"] or rec["city"] or "—", rec["kind"], len(stops)))
        notify.email_owner(
            "🎫 New guided trip listed: %s" % rec["title"],
            _trip_email_body(rec))
    except Exception:
        pass
    return jsonify({"ok": True, "trip": _public_trip(rec)})


@app.route("/api/guide-trips")
def api_guide_trips():
    """Public. This is the shop window — anyone may browse what guides sell."""
    city = str(request.args.get("city", "")).strip().lower()
    kind = str(request.args.get("kind", "")).strip().lower()
    mine = str(request.args.get("code", "")).strip().upper()
    out = []
    for t in _load(GUIDE_TRIPS_PATH):
        if t.get("status") != "LISTED":
            continue
        if city and (t.get("city") or "").lower() != city:
            continue
        if kind and (t.get("kind") or "") != kind:
            continue
        if mine and (t.get("code") or "") != mine:
            continue
        out.append(_public_trip(t))
    out.reverse()
    cities, kinds = {}, {}
    for t in out:
        if t.get("city"):
            cities[t["city"]] = t.get("city_label") or t["city"]
        kinds[t.get("kind", "other")] = kinds.get(t.get("kind", "other"), 0) + 1
    return jsonify({"ok": True, "trips": out, "cities": cities, "kinds": kinds})


@app.route("/api/guide-trips/<tid>")
def api_guide_trip_one(tid):
    for t in _load(GUIDE_TRIPS_PATH):
        if t.get("id") == tid and t.get("status") == "LISTED":
            return jsonify({"ok": True, "trip": _public_trip(t)})
    return jsonify({"ok": False, "error": "Not found."}), 404


@app.route("/api/guide-trips/<tid>/interest", methods=["POST"])
def api_guide_trip_interest(tid):
    d = request.get_json(silent=True) or {}
    name = _no_tags(str(d.get("name", "")).strip())[:60]
    contact = _no_tags(str(d.get("contact", "")).strip())[:120]
    if not (name and contact):
        return jsonify({"ok": False, "error": "Name and a way to reach you are both needed."}), 400
    with _LOCK:
        trips = _load(GUIDE_TRIPS_PATH)
        trip = next((t for t in trips if t.get("id") == tid and t.get("status") == "LISTED"), None)
        if not trip:
            return jsonify({"ok": False, "error": "Not found."}), 404
        trip["interest_count"] = int(trip.get("interest_count") or 0) + 1
        _save(GUIDE_TRIPS_PATH, trips)
        items = _load(GUIDE_INTEREST_PATH)
        items.append({"trip_id": tid, "trip_title": trip.get("title"),
                      "guide_code": trip.get("code"), "guide_contact": trip.get("contact"),
                      "name": name, "contact": contact,
                      "people": _no_tags(str(d.get("people", "")).strip())[:20],
                      "when": _no_tags(str(d.get("when", "")).strip())[:40],
                      "note": _no_tags(str(d.get("note", "")).strip())[:400],
                      "ts": datetime.datetime.now().isoformat(timespec="seconds")})
        _save(GUIDE_INTEREST_PATH, items[-5000:])
    try:
        _push_owner_alert("trip_interest", "🎟️ %s wants \"%s\" — reach them at %s (guide %s)."
                          % (name, trip.get("title"), contact, trip.get("code")))
        notify.email_owner(
            "🎟️ %s wants the trip: %s" % (name, trip.get("title")),
            "A traveller asked about a guided trip.\n\n"
            "TRAVELLER\n  name:    %s\n  contact: %s\n  people:  %s\n  when:    %s\n  note:    %s\n\n"
            "TRIP\n  %s (%s)\n  guide %s — reach the guide at %s\n\n"
            "Introduce them to each other."
            % (name, contact, d.get("people") or "—", d.get("when") or "—",
               d.get("note") or "—", trip.get("title"), tid,
               trip.get("code"), trip.get("contact") or "no contact on file"))
    except Exception:
        pass
    return jsonify({"ok": True})


@app.route("/api/guide-interest")
@owner_required
def api_guide_interest():
    return jsonify({"ok": True, "items": list(reversed(_load(GUIDE_INTEREST_PATH)))})


@app.route("/trips")
def trips_page():
    return send_file(os.path.join(BASE_DIR, "trips.html"))


@app.route("/guide-studio")
def guide_studio_page():
    return send_file(os.path.join(BASE_DIR, "guide-studio.html"))


# ------------------------------------------------------- board of directors gate
# The board area is private, and its members are not site owners — they need a
# door of their own. Two boxes: your name, and the shared board password. Only
# names on the roll may enter, so a leaked password alone is not a way in.
# The password lives hashed in board_auth.json (gitignored) or in BOARD_PASSWORD;
# it is never written into the repository.
BOARD_AUTH_PATH = _data_path("board_auth.json")


def _board_auth():
    try:
        with open(BOARD_AUTH_PATH) as f:
            return json.load(f)
    except Exception:
        return {}


def _board_roll():
    """Names allowed in: the roll file, plus anyone added as a board member."""
    names = {_norm_name(n) for n in (_board_auth().get("allow") or [])}
    for m in _load(BOARD_MEMBERS_PATH):
        n = _norm_name(m.get("name", ""))
        if n:
            names.add(n)
    return names


def _norm_name(s):
    return " ".join(str(s or "").strip().lower().split())


def board_required(fn):
    @wraps(fn)
    def wrapper(*a, **k):
        if session.get("owner") or session.get("board"):
            return fn(*a, **k)
        return jsonify({"ok": False, "auth_required": True, "board": True,
                        "error": "Board sign-in required."}), 401
    return wrapper


@app.route("/api/board/login", methods=["POST"])
def api_board_login():
    d = request.get_json(silent=True) or {}
    name = _norm_name(d.get("name"))
    pw = str(d.get("password") or "")
    auth = _board_auth()
    env_pw = os.environ.get("BOARD_PASSWORD", "").strip()
    if env_pw:
        ok_pw = (pw == env_pw)
    elif auth.get("hash"):
        ok_pw = _verify_pw(pw, auth.get("salt", ""), auth.get("hash", ""))
    else:
        return jsonify({"ok": False, "error": "The board password has not been set yet."}), 403
    roll = _board_roll()
    if not (ok_pw and name and name in roll):
        # One message for both failures — never reveal which half was right.
        return jsonify({"ok": False, "error": "That name and password do not match our board roll."}), 401
    session["board"] = name
    session.permanent = True
    return jsonify({"ok": True, "name": name})


@app.route("/api/board/logout", methods=["POST"])
def api_board_logout():
    session.pop("board", None)
    return jsonify({"ok": True})


@app.route("/api/board/me")
def api_board_me():
    who = session.get("board")
    return jsonify({"ok": True, "signed_in": bool(who or session.get("owner")),
                    "name": who or ("owner" if session.get("owner") else None),
                    "owner": bool(session.get("owner"))})


@app.route("/board")
def board_page():
    return send_file(os.path.join(BASE_DIR, "board.html"))


@app.route("/api/board/members")
@board_required
def api_board_members():
    return jsonify({"ok": True, "members": _load(BOARD_MEMBERS_PATH)})


@app.route("/api/board/members", methods=["POST"])
@owner_required
def api_board_member_add():
    data = request.get_json(force=True, silent=True) or {}
    name = (data.get("name") or "").strip()
    if not name:
        return jsonify({"ok": False, "error": "Member name is required."}), 400
    with _LOCK:
        members = _load(BOARD_MEMBERS_PATH)
        rec = {"id": _next_id(members, "MEM", datestamp=False),
               "name": name, "role": (data.get("role") or "Managing Member").strip(),
               "ownership_pct": data.get("ownership_pct") or "",
               "email": (data.get("email") or "").strip(),
               "since": (data.get("since") or "").strip(),
               "added_at": datetime.datetime.now().isoformat(timespec="seconds")}
        members.append(rec)
        _save(BOARD_MEMBERS_PATH, members)
    return jsonify({"ok": True, "member": rec})


@app.route("/api/board/members/<mid>/remove", methods=["POST"])
@owner_required
def api_board_member_remove(mid):
    with _LOCK:
        members = [m for m in _load(BOARD_MEMBERS_PATH) if m.get("id") != mid]
        _save(BOARD_MEMBERS_PATH, members)
    return jsonify({"ok": True})


@app.route("/api/board/documents")
@board_required
def api_board_documents():
    docs = sorted(_load(BOARD_DOCS_PATH), key=lambda d: d.get("uploaded_at", ""), reverse=True)
    return jsonify({"ok": True, "types": BOARD_DOC_TYPES, "documents": docs})


@app.route("/api/board/documents", methods=["POST"])
@owner_required
def api_board_document_upload():
    """Upload a governance document. It is ARCHIVED, never overwritten."""
    data = request.get_json(force=True, silent=True) or {}
    doc_type = (data.get("doc_type") or "Other").strip() or "Other"
    title = (data.get("title") or "").strip()
    notes = (data.get("notes") or "").strip()
    saved, size = _save_board_file(data.get("file") or "")
    if saved == "TOO_BIG":
        return jsonify({"ok": False, "error": "That file is too large (max 25 MB)."}), 400
    if not saved:
        return jsonify({"ok": False, "error": "Attach a PDF, Word doc, or image of the document."}), 400
    with _LOCK:
        docs = _load(BOARD_DOCS_PATH)
        rec = {"id": _next_id(docs, "GOV", datestamp=False), "doc_type": doc_type,
               "title": title or doc_type, "original_name": (data.get("original_name") or "").strip(),
               "stored_name": saved, "size": size, "notes": notes,
               "uploaded_at": datetime.datetime.now().isoformat(timespec="seconds")}
        docs.append(rec)
        _save(BOARD_DOCS_PATH, docs)
    return jsonify({"ok": True, "document": rec})


@app.route("/api/board/documents/<docid>/file")
@board_required
def api_board_document_file(docid):
    """Managing-member only: open an archived governance document."""
    d = next((x for x in _load(BOARD_DOCS_PATH) if x.get("id") == docid), None)
    if not d:
        return jsonify({"ok": False, "error": "not found"}), 404
    path = os.path.join(BOARD_DIR, d.get("stored_name") or "")
    if not os.path.exists(path):
        return jsonify({"ok": False, "error": "File missing."}), 404
    return send_file(path)


# ======================================================================
# UNCOVERED-RIDE REMINDER — nudge dispatch when a ride isn't being taken.
# A ride sits NEW (in the open pool) when no driver has claimed it, or after
# a driver gives it up. If it stays uncovered too long — or its pickup is
# approaching — we remind the owner (dashboard alert + SMS), escalating as
# pickup nears. Give-ups already alert immediately (see api_giveup); this
# catches the "nobody is taking it" case.
# ======================================================================
def _parse_iso(s):
    try:
        return datetime.datetime.fromisoformat(s)
    except Exception:
        return None


def _uncovered_since(r):
    """When a ride became uncovered — its last give-up, else when it was created."""
    gv = r.get("giveups") or []
    if gv:
        return gv[-1].get("at") or r.get("created_at")
    return r.get("created_at")


def _uncovered_rides(now=None):
    """All NEW (unassigned) rides with how long they've been open + time to pickup."""
    now = now or datetime.datetime.now()
    out = []
    for r in _load(RES_PATH):
        if r.get("status") != "NEW":
            continue
        since = _parse_iso(_uncovered_since(r))
        mins = (now - since).total_seconds() / 60.0 if since else 0.0
        pickup = _trip_datetime(r.get("trip", {}))
        hours_left = (pickup - now).total_seconds() / 3600.0 if pickup else None
        out.append({"r": r, "mins_open": mins, "hours_left": hours_left})
    return out


def _uncovered_alert_text(r, mins, hours_left, urgent):
    t = r.get("trip", {}) or {}
    c = r.get("client", {}) or {}
    tag = ("🚨 URGENT — pickup is close and still no driver"
           if urgent else "⚠️ No driver has taken this ride yet")
    left = (" · pickup in %.1fh" % hours_left) if hours_left is not None else ""
    return ("%s: %s (%s → %s) for %s. Open %d min%s. Assign a driver in Dispatch or cover it." % (
        tag, r.get("id"), t.get("pickup", ""), t.get("dropoff", ""),
        c.get("name", ""), int(mins), left))


def _reservation_reminder_scan(send=True):
    """Remind dispatch about uncovered rides past the threshold (or urgent).
    Dedupes with last_reminded_at, re-reminds on an interval, escalates near pickup.
    Returns the number of reminders sent this pass."""
    remind_after = float(os.environ.get("UNCLAIMED_REMIND_MIN", 20))
    repeat_after = float(os.environ.get("UNCLAIMED_REPEAT_MIN", 30))
    urgent_h = float(os.environ.get("UNCLAIMED_URGENT_HOURS", 3))
    now = datetime.datetime.now()
    to_send = []
    with _LOCK:
        items = _load(RES_PATH)
        changed = False
        for r in items:
            if r.get("status") != "NEW":
                continue
            since = _parse_iso(_uncovered_since(r))
            if not since:
                continue
            mins = (now - since).total_seconds() / 60.0
            pickup = _trip_datetime(r.get("trip", {}))
            hours_left = (pickup - now).total_seconds() / 3600.0 if pickup else None
            urgent = hours_left is not None and hours_left < urgent_h
            if mins < remind_after and not urgent:
                continue  # too fresh — drivers may still claim it
            # Cap total SMS reminders per ride so a chronically-stale one can't text
            # forever (it still shows on the dashboard banner — just stops texting).
            max_reminders = int(float(os.environ.get("UNCLAIMED_MAX_REMINDERS", 4)))
            if int(r.get("reminded_count", 0)) >= max_reminders:
                continue
            last = _parse_iso(r.get("last_reminded_at"))
            interval = 10.0 if urgent else repeat_after  # nag faster when urgent
            if last and (now - last).total_seconds() / 60.0 < interval:
                continue  # already reminded recently
            r["last_reminded_at"] = now.isoformat(timespec="seconds")
            r["reminded_count"] = int(r.get("reminded_count", 0)) + 1
            changed = True
            to_send.append((r, mins, hours_left, urgent))
        if changed and send:
            _save(RES_PATH, items)
    if send:
        for r, mins, hours_left, urgent in to_send:
            _push_owner_alert("URGENT" if urgent else "UNCOVERED",
                              _uncovered_alert_text(r, mins, hours_left, urgent))
    return len(to_send)


# ---------------------------------------------------------------- map data proxy
# The free OpenStreetMap query servers are slow and rate-limit by IP, so every
# visitor asking them directly meant 30-45s waits and empty layers. The server
# asks once, holds the answer for an hour, and every later visitor gets it
# instantly — one polite request on behalf of everyone instead of one each.
_OVERPASS_MIRRORS = ["https://overpass.kumi.systems/api/interpreter",
                     "https://overpass.private.coffee/api/interpreter",
                     "https://overpass-api.de/api/interpreter"]
_OVERPASS_CACHE = {}          # query hash -> {"ts": float, "data": [...]}
_OVERPASS_TTL = 3600
_OVERPASS_MAX = 400           # keep the cache from growing without bound


# ----------------------------------------------------------- live road traffic
# Nobody gives real-time traffic away without a key — it is measured from fleet
# data, not volunteered like map geometry. TomTom's free tier is the one that
# fits: 50,000 tiles a day, no credit card, commercial use allowed. The map
# stays perfectly usable without it; the layer simply does not offer itself
# until a key exists, so the site never shows a broken checkbox.
@app.route("/api/traffic-key")
def api_traffic_key():
    k = os.environ.get("TOMTOM_KEY", "").strip()
    return jsonify({"ok": True, "enabled": bool(k), "key": k,
                    "attribution": "Traffic \u00a9 TomTom"})


# ------------------------------------------------------------- ride coverage
# Rides are only offered where there are actually drivers. Everywhere else the
# ask is worth more as evidence than as a promise: we record which city wanted a
# ride and where they were headed, so opening a new city is a decision made on
# real demand rather than a guess. Sean opens a city by adding it to RIDE_CITIES.
RIDE_DEMAND_PATH = _data_path("ride_demand.json")


def _ride_cities():
    raw = os.environ.get("RIDE_CITIES", "seattle")
    return [s.strip().lower() for s in raw.split(",") if s.strip()]


@app.route("/api/ride-coverage")
def api_ride_coverage():
    return jsonify({"ok": True, "cities": _ride_cities()})


@app.route("/api/ride-demand", methods=["POST"])
def api_ride_demand():
    d = request.get_json(silent=True) or {}
    city = _no_tags(str(d.get("city", ""))[:40]).strip().lower()
    if not city:
        return jsonify({"ok": False, "error": "city required"}), 400
    rec = {
        "city": city,
        "city_label": _no_tags(str(d.get("city_label", ""))[:80]),
        "dropoff": _no_tags(str(d.get("dropoff", ""))[:120]),
        "stops": int(d.get("stops") or 0),
        "email": _no_tags(str(d.get("email", ""))[:120]),
        "ts": datetime.datetime.utcnow().isoformat(timespec="seconds") + "Z",
    }
    with _LOCK:
        items = _load(RIDE_DEMAND_PATH)
        items.append(rec)
        _save(RIDE_DEMAND_PATH, items[-5000:])
    return jsonify({"ok": True})


@app.route("/api/ride-demand")
@owner_required
def api_ride_demand_list():
    items = _load(RIDE_DEMAND_PATH)
    by_city = {}
    for r in items:
        c = by_city.setdefault(r.get("city", "?"), {
            "city": r.get("city"), "label": r.get("city_label") or r.get("city"),
            "asks": 0, "with_email": 0, "top_stops": {}})
        c["asks"] += 1
        if r.get("email"):
            c["with_email"] += 1
        if r.get("dropoff"):
            c["top_stops"][r["dropoff"]] = c["top_stops"].get(r["dropoff"], 0) + 1
    out = []
    for c in by_city.values():
        c["top_stops"] = sorted(c["top_stops"].items(), key=lambda kv: -kv[1])[:5]
        out.append(c)
    out.sort(key=lambda c: -c["asks"])
    return jsonify({"ok": True, "cities": out, "total": len(items),
                    "open_cities": _ride_cities()})


# --------------------------------------------------------- attractions lookup
# OpenStreetMap knows where things ARE. It rarely says what they are or why
# anyone would go, and searching it by distance in a dense city returns office
# blocks. Two other free, keyless public sources answer that better together:
#
#   Wikidata  — asks by KIND ("museums, parks, monuments, castles near here"),
#               so the candidate list is attractions rather than whatever is
#               closest, and it answers in about a second.
#   Wikipedia — says what each one is, supplies a photo, and reports how many
#               people look it up, which is the closest honest measure of
#               "worth seeing" that exists for free.
#
# Wikidata proposes, Wikipedia ranks. A neighborhood playground and the Museum
# of Fine Arts both come back from the first; only one of them survives the
# second. Answers are kept for a day — landmarks do not move.
_WIKI_CACHE = {}
_WIKI_TTL = 86400
_WIKI_MAX = 300
_UA = "PlateauStrategy/1.0 (trip planner; plateaustrategy.io)"

# museum · park · tourist attraction · monument · memorial · World Heritage site
# zoo · botanical garden · castle · cathedral · stadium · theatre · archaeological
# site · beach · art museum · protected area · aquarium · library · observatory
_WD_TYPES = ("wd:Q570116 wd:Q33506 wd:Q22698 wd:Q4989906 wd:Q5003624 wd:Q9259 "
             "wd:Q43501 wd:Q167346 wd:Q23413 wd:Q2977 wd:Q483110 wd:Q24354 "
             "wd:Q839954 wd:Q40080 wd:Q207694 wd:Q473972 wd:Q2281788 wd:Q7075 "
             "wd:Q62832 wd:Q12518 wd:Q41176 wd:Q16970 wd:Q44613 wd:Q19844914 "
             "wd:Q1497364 wd:Q811979 wd:Q1802963 wd:Q35112127 wd:Q2087181")


def _wiki_get(params):
    """One polite call to Wikipedia. It answers a burst of requests with a 429,
    so we back off and try again rather than dropping the city's data."""
    import requests
    params = dict(params, format="json", formatversion=2)
    last = None
    for attempt in range(3):
        r = requests.get("https://en.wikipedia.org/w/api.php", params=params,
                         timeout=(5, 25), headers={"User-Agent": _UA})
        if r.status_code == 429:
            last = r
            time.sleep(1.5 * (attempt + 1))
            continue
        r.raise_for_status()
        return r.json()
    last.raise_for_status()


def _wikidata_nearby(lat, lon, radius_km):
    """Attraction-shaped places near a point that also have an English Wikipedia
    article — the article requirement is itself a first notability filter."""
    import requests
    # Ordering by how many languages write about a place is what makes this
    # useful: without it the query returns an arbitrary 250 of whatever is
    # nearby, and a neighborhood playground crowds out the Louvre.
    q = ('SELECT DISTINCT ?itemLabel ?lat ?lon ?article ?sl WHERE {'
         ' SERVICE wikibase:around { ?item wdt:P625 ?loc.'
         ' bd:serviceParam wikibase:center "Point(%f %f)"^^geo:wktLiteral.'
         ' bd:serviceParam wikibase:radius "%s". }'
         ' ?item wikibase:sitelinks ?sl. FILTER(?sl >= 4)'
         ' ?item wdt:P31 ?type. VALUES ?type { %s }'
         ' ?item p:P625/psv:P625 ?cn. ?cn wikibase:geoLatitude ?lat; wikibase:geoLongitude ?lon.'
         ' ?article schema:about ?item; schema:isPartOf <https://en.wikipedia.org/>.'
         ' SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } }'
         ' ORDER BY DESC(?sl) LIMIT 150'
         ) % (lon, lat, radius_km, _WD_TYPES)
    r = requests.get("https://query.wikidata.org/sparql", params={"query": q}, timeout=(5, 30),
                     headers={"Accept": "application/sparql-results+json", "User-Agent": _UA})
    r.raise_for_status()
    out, seen = [], set()
    for b in r.json()["results"]["bindings"]:
        title = b["article"]["value"].rsplit("/", 1)[-1].replace("_", " ")
        try:
            title = urllib.parse.unquote(title)
        except Exception:
            pass
        if title in seen:
            continue
        seen.add(title)
        out.append({"title": title, "lat": float(b["lat"]["value"]),
                    "lon": float(b["lon"]["value"]), "langs": int(b["sl"]["value"])})
    return out


@app.route("/api/attractions")
def api_attractions():
    try:
        lat = float(request.args.get("lat", ""))
        lon = float(request.args.get("lon", ""))
    except (TypeError, ValueError):
        return jsonify({"ok": False, "error": "need lat and lon"}), 400
    radius_km = max(1, min(int(request.args.get("radius_km", 8) or 8), 40))
    limit = max(5, min(int(request.args.get("limit", 40) or 40), 60))
    key = "%.2f,%.2f,%d" % (lat, lon, radius_km)
    now = time.time()
    hit = _WIKI_CACHE.get(key)
    if hit and (now - hit["ts"] < _WIKI_TTL):
        return jsonify({"ok": True, "places": hit["data"][:limit], "cached": True})
    try:
        cands = _wikidata_nearby(lat, lon, radius_km)
        if not cands:
            return jsonify({"ok": True, "places": [], "cached": False})
        # Wikidata already ordered these by how widely they are written about, so
        # only the top of that list is worth the enrichment calls.
        cands = cands[:40]

        def _merge(d, store):
            for pg in ((d.get("query") or {}).get("pages") or []):
                store.setdefault(pg.get("title", ""), {}).update(pg)
            for r in ((d.get("query") or {}).get("redirects") or []):
                # a redirect answers under its target's name; file it under both
                store.setdefault(r.get("from", ""), {}).update(store.get(r.get("to", ""), {}))

        by_title = {}
        for i in range(0, len(cands), 20):
            _merge(_wiki_get({"action": "query", "redirects": 1,
                              "titles": "|".join(c["title"] for c in cands[i:i + 20]),
                              "prop": "extracts|pageimages", "exintro": 1, "explaintext": 1,
                              "exsentences": 2, "piprop": "thumbnail", "pithumbsize": 400}), by_title)
            time.sleep(0.25)
        # Wikipedia computes readership for only ten pages per request, so this
        # one is asked in tens rather than being silently half-answered.
        for i in range(0, len(cands), 10):
            _merge(_wiki_get({"action": "query", "redirects": 1,
                              "titles": "|".join(c["title"] for c in cands[i:i + 10]),
                              "prop": "pageviews", "pvipdays": 14}), by_title)
            time.sleep(0.25)
        places = []
        for cand in cands:
            pg = by_title.get(cand["title"]) or {}
            views = [v for v in (pg.get("pageviews") or {}).values() if v]
            desc = (pg.get("extract") or "").strip()
            places.append({
                "name": cand["title"], "lat": cand["lat"], "lon": cand["lon"],
                "desc": desc, "photo": (pg.get("thumbnail") or {}).get("source"),
                "views_per_day": round(sum(views) / len(views)) if views else 0,
                "languages": cand.get("langs", 0),
                "url": "https://en.wikipedia.org/wiki/" + cand["title"].replace(" ", "_"),
                "source": "wikipedia",
            })
        places = [p for p in places if p["views_per_day"] >= 5 or p["languages"] >= 10]
        places.sort(key=lambda p: -(p["views_per_day"] + p["languages"] * 4))
        with _LOCK:
            if len(_WIKI_CACHE) > _WIKI_MAX:
                for k in sorted(_WIKI_CACHE, key=lambda k: _WIKI_CACHE[k]["ts"])[:_WIKI_MAX // 2]:
                    _WIKI_CACHE.pop(k, None)
            _WIKI_CACHE[key] = {"ts": now, "data": places}
        return jsonify({"ok": True, "places": places[:limit], "cached": False})
    except Exception as e:
        if hit:
            return jsonify({"ok": True, "places": hit["data"][:limit], "cached": True, "stale": True})
        return jsonify({"ok": False, "error": str(e)[:140]}), 503


@app.route("/api/mapdata", methods=["POST"])
def api_mapdata():
    q = (request.get_json(silent=True) or {}).get("q", "")
    if not isinstance(q, str) or not q.strip() or len(q) > 4000:
        return jsonify({"ok": False, "error": "bad query"}), 400
    key = hashlib.sha256(q.encode("utf-8")).hexdigest()
    now = time.time()
    hit = _OVERPASS_CACHE.get(key)
    if hit and (now - hit["ts"] < _OVERPASS_TTL):
        return jsonify({"ok": True, "elements": hit["data"], "cached": True})
    import requests
    last = ""
    for url in _OVERPASS_MIRRORS:
        try:
            r = requests.post(url, data={"data": q}, timeout=(5, 60),
                              headers={"User-Agent": "PlateauStrategy/1.0 (trip planner)"})
            if r.status_code != 200:
                last = "HTTP %s" % r.status_code
                continue
            j = r.json()
            els = j.get("elements") or []
            # a throttled reply carries a "remark" with an empty list — that is
            # not "nothing here", so move on to the next mirror
            if not els and j.get("remark"):
                last = j["remark"][:120]
                continue
            with _LOCK:
                if len(_OVERPASS_CACHE) > _OVERPASS_MAX:
                    for k in sorted(_OVERPASS_CACHE, key=lambda k: _OVERPASS_CACHE[k]["ts"])[:_OVERPASS_MAX // 2]:
                        _OVERPASS_CACHE.pop(k, None)
                _OVERPASS_CACHE[key] = {"ts": now, "data": els}
            return jsonify({"ok": True, "elements": els, "cached": False})
        except Exception as e:
            last = str(e)[:120]
    # everything failed — hand back a stale answer rather than nothing
    if hit:
        return jsonify({"ok": True, "elements": hit["data"], "cached": True, "stale": True})
    return jsonify({"ok": False, "error": last or "map servers busy"}), 503


@app.route("/api/dispatch/uncovered")
@owner_required
def api_dispatch_uncovered():
    """The rides no driver has taken — feeds the Dispatch 'needs attention' banner.
    Read-only; the background loop does the actual SMS/alert reminding."""
    now = datetime.datetime.now()
    uncovered = []
    for u in _uncovered_rides(now):
        r, t = u["r"], (u["r"].get("trip") or {})
        uncovered.append({
            "id": r.get("id"), "client": (r.get("client") or {}).get("name", ""),
            "pickup": t.get("pickup", ""), "dropoff": t.get("dropoff", ""),
            "when": ("%s %s" % (t.get("date", ""), t.get("time", ""))).strip(),
            "mins_open": int(u["mins_open"]), "hours_left": u["hours_left"],
            "given_up": bool(r.get("giveups")),
        })
    uncovered.sort(key=lambda x: (x["hours_left"] if x["hours_left"] is not None else 1e9))
    return jsonify({"ok": True, "uncovered": uncovered})


def _reservation_reminder_loop():
    interval = float(os.environ.get("REMINDER_CHECK_SEC", 300))
    while True:
        try:
            _reservation_reminder_scan(send=True)
        except Exception:
            pass
        time.sleep(interval)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    print("Plateau Strategy Solution Lab booking app -> http://localhost:%d" % port)
    # Background reminder: nudge dispatch about rides no driver has taken.
    if os.environ.get("DISPATCH_REMINDERS", "true").lower() == "true":
        threading.Thread(target=_reservation_reminder_loop, daemon=True).start()
    # host="::" dual-stacks on macOS so both localhost (IPv6 ::1) and 127.0.0.1
    # (IPv4) work. threaded=True so concurrent polling requests never block.
    app.run(host="::", port=port, debug=False, threaded=True)
