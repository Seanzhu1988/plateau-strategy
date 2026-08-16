"""Plateau Strategy Solution Lab, Transportation booking app.

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
import hmac
import base64
import gzip
import secrets
import threading
import subprocess
import datetime
import urllib.parse
import shutil
import html
from functools import wraps
from flask import (Flask, request, jsonify, send_file, session, Response,
                   redirect, make_response, abort)

try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
except Exception:
    pass

import square_client
import notify
import paypal_client
import bot_lab
import consent
import journeys
import footprints

def _no_em_dash(text, title=False):
    """Remove em dashes from user-facing article text.

    The owner's standing rule: the long dash makes any article read as AI
    generated, so no article on this board carries one, whoever wrote it.
    In a title the dash was doing a colon's job; in a body it was doing a
    comma's. Words are never touched, only the punctuation.
    """
    if not text:
        return text
    joiner = ": " if title else ", "
    # the Chinese double dash first, or the single pass eats it in halves.
    # Spaces around it go too: Chinese punctuation carries its own spacing.
    text = text.replace(" \u2014\u2014 ", "\uff0c")
    text = text.replace("\u2014\u2014 ", "\uff0c")
    text = text.replace(" \u2014\u2014", "\uff0c")
    text = text.replace("\u2014\u2014", "\uff0c")
    for dash in ("\u2014", "\u2013", "\u2e3a", "\u2e3b"):
        text = text.replace(" " + dash + " ", joiner)
        text = text.replace(dash + " ", joiner)
        text = text.replace(" " + dash, joiner)
        text = text.replace(dash, joiner)
    return text


def _no_tags(s):
    """Defense-in-depth vs stored XSS: strip angle brackets from any string
    that ends up rendered in every visitor's browser. Pages escape on render
    too, this guard protects any future sink someone forgets."""
    return (s or "").replace("<", "").replace(">", "")


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ---------------------------------------------------------------- where data lives
# The code ships in BASE_DIR; everything the site SAVES lives in DATA_DIR. On a
# host whose filesystem is reset on each deploy, which is what free Render does
#, those being the same directory means every reservation, agent code and guide
# listing is destroyed the next time anyone pushes. Pointing DATA_DIR at a
# mounted disk keeps them.
#
# Unset, DATA_DIR is BASE_DIR, so local development and the existing deployment
# behave exactly as before. Set, any file the repository ships (the seeded
# destinations book, pricing) is copied across once on first boot, so switching
# it on never starts the site with an empty book.
def _pick_data_dir():
    """Where the site's data files live.

    DATA_DIR wins if set. Failing that, a disk mounted at the conventional
    path is used automatically, because a disk that is attached but that
    nothing points at behaves exactly like no disk at all, and that failure
    is silent: the site keeps working and quietly forgets everything on
    every deploy. Detecting the mount removes the one manual step that
    stood between paying for persistence and having it.

    On a laptop /var/data does not exist, so local runs are unaffected.
    """
    d = os.environ.get("DATA_DIR", "").strip()
    if d:
        return d
    for cand in ("/var/data", "/data"):
        if os.path.isdir(cand) and os.access(cand, os.W_OK):
            return cand
    return BASE_DIR


DATA_DIR = _pick_data_dir()
# Everything that writes data must agree on where it lives. app.py resolves
# the disk by auto-detecting the mount; a helper module that only reads the
# DATA_DIR env var would write somewhere else entirely, and its writes would
# land where the app never looks and vanish on the next deploy. The auto
# translator did exactly that: it saved translations to the repo directory
# while the app read them from /var/data, so a posted article never showed a
# translation. Publishing the resolved path into the environment makes every
# module, including translator.py, resolve to this one directory.
os.environ.setdefault("DATA_DIR", DATA_DIR)
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


# ---------------------------------------------------------------------------
# Guessing limit on every sign-in
#
# Nothing on this site limited login attempts. The council put numbers on what
# that costs, and they are small: the driver login is a VIN plus a date of
# birth, and a VIN is not a secret, it is stamped on the dashboard and legally
# readable through the windscreen of a car parked in public. That leaves the
# birthday, about 25,200 valid dates for an adult, roughly 14.6 bits. An agent
# code is four characters from a 31-symbol alphabet, about 19.8 bits. Both are
# minutes of scripted guessing when nothing counts the attempts, and neither is
# fixable by making the secret longer without reissuing every credential.
#
# So the fix is the counter, not the secret. Ten wrong answers from one address
# for one account, then that pair waits fifteen minutes. Scoped to (address,
# account) rather than to either alone: keying on the address only would let
# one attacker lock out a whole office, and keying on the account only would
# let them lock a driver out of their own portal from anywhere.
#
# In memory on purpose. One process, one machine, a restart clears it, which
# is a real limit worth stating rather than hiding, but a restart is not
# something an attacker can trigger.
# ---------------------------------------------------------------------------
# TWO counters, and the second one exists because the first missed the actual
# attack. Keying only on (address, account) counts wrong PASSWORDS for one
# account, but guessing an agent code means trying a different ACCOUNT every
# time, so a code-spraying run never touches the same key twice and sails
# straight through. Found by the test written for this fix, not by reading it.
#
# So: a tight per-account limit for password guessing, and a looser
# per-address limit for spraying across accounts. The address ceiling is high
# enough that a shared office behind one NAT never meets it and low enough
# that enumerating a 923,521-code space takes centuries instead of an hour.
LOGIN_MAX_TRIES = 10            # wrong answers for ONE account, from one address
LOGIN_MAX_PER_IP = 30           # wrong answers across ALL accounts, from one address
LOGIN_WINDOW_S = 900
_LOGIN_TRIES = {}


def _login_keys(who):
    ip = _client_ip()
    return (ip, (who or "").strip().lower()), (ip, "*")


def _recent(key):
    now = time.time()
    tries = [t for t in _LOGIN_TRIES.get(key, []) if now - t < LOGIN_WINDOW_S]
    _LOGIN_TRIES[key] = tries
    return tries


def _login_blocked(who):
    """True if either counter has run out."""
    per_account, per_ip = _login_keys(who)
    return (len(_recent(per_account)) >= LOGIN_MAX_TRIES
            or len(_recent(per_ip)) >= LOGIN_MAX_PER_IP)


def _login_failed(who):
    """Record one wrong answer against both counters. Called only on failure,
    so somebody who signs in correctly every day never approaches either."""
    now = time.time()
    for key in _login_keys(who):
        _recent(key).append(now)
    if len(_LOGIN_TRIES) > 4000:            # bound the table; oldest first
        for k in sorted(_LOGIN_TRIES, key=lambda k: max(_LOGIN_TRIES[k] or [0]))[:1000]:
            _LOGIN_TRIES.pop(k, None)


def _login_ok(who):
    """Clear the account counter on success.

    The per-address counter is deliberately NOT cleared: one correct sign-in
    would otherwise wipe the evidence of thirty wrong ones, and an attacker
    who owns any single valid credential could reset the ceiling at will."""
    per_account, _ = _login_keys(who)
    _LOGIN_TRIES.pop(per_account, None)


def _too_many_tries():
    return jsonify({"ok": False,
                    "error": "Too many attempts. Wait 15 minutes and try again."}), 429


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
    """Stable Flask session secret, from env, else a persisted random file."""
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
    Without this, any of these URLs could be requested with someone else's id, 
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
    return _set_not_counted(jsonify({"ok": True, "username": u}))


@app.route("/api/owner/login", methods=["POST"])
def api_owner_login():
    data = request.get_json(force=True, silent=True) or {}
    u = (data.get("username") or "").strip()
    pw = data.get("password") or ""
    if _login_blocked(u):
        return _too_many_tries()
    owner = _load_owner()
    if not owner or owner.get("username", "").lower() != u.lower() \
            or not _verify_pw(pw, owner.get("salt", ""), owner.get("hash", "")):
        _login_failed(u)
        return jsonify({"ok": False, "error": "Wrong username or password."}), 401
    _login_ok(u)
    session["owner"] = owner.get("username")
    # Whoever signs in here is running the business, not visiting it. Mark the
    # device so it stops inflating the numbers, the session expires, this does
    # not, so the computer stays uncounted after the login is forgotten.
    return _set_not_counted(jsonify({"ok": True, "username": owner.get("username")}))


@app.route("/api/owner/logout", methods=["POST"])
def api_owner_logout():
    session.pop("owner", None)
    return jsonify({"ok": True})


# ---------- "Continue with Google" on the booking form ----------
# Optional, and never a gate. A stranger booking a 5am airport run wants a car,
# not an account, requiring a sign-in before a first booking costs bookings.
# All this does is fill in the name and email so the form is two taps shorter.
#
# The client id is configuration, not a secret: it is public by design and
# appears in the page. It lives in the environment anyway so the repo stays
# clean and the feature simply stays off until it is set.
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "").strip()


@app.route("/api/auth/google/config")
def api_google_config():
    """Whether the button should be drawn at all, and with which client id."""
    return jsonify({"ok": True, "enabled": bool(GOOGLE_CLIENT_ID),
                    "client_id": GOOGLE_CLIENT_ID})


def _google_claims(token):
    """Verify a Google credential server-side. Returns (claims, error).

    The one copy of the security-sensitive routine, shared by every endpoint
    that accepts a Google credential (the same one-copy rule that moved the
    button into google-signin.js). The browser hands us a signed assertion,
    and a browser can say anything, so nothing in the token is believed
    until google-auth has checked signature, audience and expiry against
    Google's own signing keys."""
    if not token:
        return None, "No credential."
    try:
        from google.oauth2 import id_token as g_id_token
        from google.auth.transport import requests as g_requests
        claims = g_id_token.verify_oauth2_token(
            token, g_requests.Request(), GOOGLE_CLIENT_ID)
    except Exception:
        # Bad signature, wrong audience, expired, or Google unreachable. We
        # cannot tell a forgery from an outage here, and must not guess.
        return None, "Could not verify that sign-in."
    if claims.get("iss") not in ("accounts.google.com", "https://accounts.google.com"):
        return None, "Could not verify that sign-in."
    if not claims.get("email_verified"):
        # An unverified address would let someone act under somebody else's
        # email, and that address is where consequences land.
        return None, "That Google account has no verified email."
    return claims, None


@app.route("/api/auth/google", methods=["POST"])
def api_auth_google():
    """Turn a Google credential into a name and an email we can believe.

    Nothing is stored. The reply is used to fill two form fields."""
    if not GOOGLE_CLIENT_ID:
        return jsonify({"ok": False, "error": "Google sign-in isn't configured."}), 503
    token = ((request.get_json(force=True, silent=True) or {}).get("credential") or "").strip()
    if not token:
        return jsonify({"ok": False, "error": "No credential."}), 400
    claims, err = _google_claims(token)
    if not claims:
        return jsonify({"ok": False, "error": err}), 401
    return jsonify({"ok": True,
                    "name": (claims.get("name") or "").strip()[:80],
                    "email": (claims.get("email") or "").strip()[:120]})


@app.route("/api/auth/google/session", methods=["POST"])
def api_auth_google_session():
    """Sign a reader in, for reading that is gated on identity.

    The blueprint attached to an idea opens only for a named person, and
    this is where the name comes from. Unlike /api/auth/google above, this
    one DOES keep something: a session cookie carrying exactly two facts,
    the verified email and the display name, so a reader who opened one
    blueprint is not asked to sign in again for the next. Nothing else is
    stored about them here; the record of WHAT they opened is written when
    they open it, not when they sign in."""
    if not GOOGLE_CLIENT_ID:
        return jsonify({"ok": False, "error": "Google sign-in isn't configured."}), 503
    token = ((request.get_json(force=True, silent=True) or {}).get("credential") or "").strip()
    claims, err = _google_claims(token)
    if not claims:
        return jsonify({"ok": False, "error": err or "No credential."}), 401
    reader = {"email": (claims.get("email") or "").strip()[:120],
              "name": (claims.get("name") or "").strip()[:80]}
    # Deliberately NOT a permanent session. This identity stamps an access
    # log, and a 31-day cookie on a shared or borrowed device would keep
    # writing the wrong name into other people's records. A browser-session
    # cookie plus Google's one-tap makes re-signing cheap and the log honest.
    session["reader"] = reader
    return jsonify({"ok": True, "email": reader["email"], "name": reader["name"]})


@app.route("/api/auth/reader/logout", methods=["POST"])
def api_auth_reader_logout():
    """Drop the reading identity. The door out matters as much as the door
    in: a reader who spots someone else's name on the banner needs a way
    to stop reading under it."""
    session.pop("reader", None)
    return jsonify({"ok": True})


@app.route("/api/auth/reader")
def api_auth_reader():
    """Who is reading, according to the session. Answers about self only."""
    r = session.get("reader") or {}
    return jsonify({"ok": True, "signed_in": bool(r.get("email")),
                    "email": r.get("email") or "", "name": r.get("name") or "",
                    "owner": bool(session.get("owner"))})


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


# ---------- site traffic, self-hosted, no third party ----------
TRAFFIC_MAX_DAYS = 120  # bound file growth; older days are just dropped
# Pages tracked individually for the "which tool" breakdown; every other
# page rolls into a single "other" bucket so the archive table stays short.
TRAFFIC_TOOL_PATHS = {"/trip-planner": "trip_planner", "/destination-book": "destination_book",
                       "/favorite-place": "favorite_place",
                       "/met": "met_map", "/walks": "walks_hub"}

# ---------- traffic we should not be counting ----------
# The number beside the map is meant to tell Sean whether strangers are using
# the tools. Our own laptops and phones, and the browser used to test a build,
# were being counted the same as a visitor from Ohio, so a quiet day could read
# as thirty travellers. Three exclusions, cheapest first:
#   · a device that has opted out (a cookie set once, kept for years)
#   · an address on the ignore list (Sean's home or office)
#   · anything that identifies itself as a bot or crawler
TRAFFIC_OPTOUT_COOKIE = "psx_nocount"
_BOT_HINTS = ("bot", "crawler", "spider", "slurp", "headless", "curl/", "wget",
              "python-requests", "monitor", "pingdom", "uptime", "lighthouse",
              "preview", "scrapy", "facebookexternalhit", "embedly")


IGNORE_NETS_PATH = _data_path("traffic_ignore.json")


def _registered_nets():
    """Networks the owner has registered as "this is me, do not count it".

    A cookie is per browser: clear it, use a different browser, open a private
    window, pick up a different phone, and the site counts you again. This is
    the other half, one entry covers every device on that network at once,
    survives clearing anything, and needs no cookie to work.

    Stored rather than env-only so it can be added from a phone at the kitchen
    table instead of a redeploy. The env var still works and the two are
    merged, so an address set in Render is not lost."""
    try:
        rows = _load(IGNORE_NETS_PATH)
        return {_norm_ip(r.get("ip")): r for r in rows if isinstance(r, dict) and r.get("ip")}
    except Exception:
        return {}


def _ignored_ips():
    raw = os.environ.get("TRAFFIC_IGNORE_IPS", "")
    from_env = {_norm_ip(s) for s in raw.split(",") if s.strip()}
    return from_env | set(_registered_nets())


def _norm_ip(raw):
    """Normalise an address so the ignore list matches what actually arrives.

    A local or proxied request often turns up as an IPv4 address wrapped in IPv6
    form, "::ffff:127.0.0.1", which never equals the "127.0.0.1" someone wrote
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
    if session.get("owner"):
        # Signed in as the owner is not a visit. Mostly redundant, owner login
        # and setup both call _set_not_counted, so the cookie above is usually
        # already there. It earns its place in the narrow case where the cookie
        # is gone but the session is not: psx_not_counted looks exactly like a
        # tracking cookie, and privacy extensions that sweep those often leave
        # a session cookie alone. Without this line the owner would silently
        # start counting again and have no way to notice.
        return True
    if request.path == "/not-a-traveler":
        # The page whose whole purpose is "stop counting me" must not itself
        # count. The cookie is only set on the way OUT, so without this the
        # opt-out always cost one phantom visitor before taking effect.
        return True
    if _client_ip() in _ignored_ips():
        return True
    ua = (request.headers.get("User-Agent") or "").lower()
    if not ua:
        return True                      # no user agent at all is not a person
    return any(h in ua for h in _BOT_HINTS)


def _set_not_counted(resp, on=True):
    """Mark (or unmark) this device as one that never appears in visitor numbers."""
    if on:
        resp.set_cookie(TRAFFIC_OPTOUT_COOKIE, "1", max_age=60 * 60 * 24 * 3650,
                        httponly=True, samesite="Lax")
    else:
        # Same attributes as when it was set, or some browsers keep it.
        resp.set_cookie(TRAFFIC_OPTOUT_COOKIE, "", max_age=0,
                        httponly=True, samesite="Lax")
    return resp


@app.route("/api/traffic/optout")
def api_traffic_optout():
    """Open this once on a device and it stops being counted, ours, or anyone's
    who asks. Sets a plain flag cookie; no identity is stored either way."""
    on = request.args.get("off") != "1"
    return _set_not_counted(
        jsonify({"ok": True, "counted": not on,
                 "message": ("This device is no longer counted as a visitor."
                             if on else "This device is being counted again.")}), on)


@app.route("/api/traffic/me")
def api_traffic_me():
    """Is THIS device being counted? Read-only, and only about the caller.

    /api/traffic/optout could not answer this: a GET of it SETS the opt-out,
    so asking the question changed the answer. Anything wanting to show the
    current state had to either toggle it or guess.

    Public, like /not-a-traveler, and for the same reason, "am I in your
    numbers" is a question anybody may ask about themselves. It reports
    nothing about anyone else: no list of registered networks, no counts, no
    other devices. `network_registered` is a yes/no about the address this
    request already came from, which the caller plainly knows.
    """
    vid = request.cookies.get("psx_vid")
    here = _norm_ip(_client_ip())
    return jsonify({
        "ok": True,
        "device_counted": request.cookies.get(TRAFFIC_OPTOUT_COOKIE) != "1",
        "in_today_count": _vid_counted_today(vid),
        "network": here,
        "network_registered": bool(here) and here in _registered_nets(),
    })


@app.route("/api/traffic/forget-today", methods=["POST"])
def api_traffic_forget_today():
    """Take this device out of TODAY's unique count.

    Opting out stops the counting from here on; it does nothing about a visit
    already recorded this morning. Without this, switching the flag on leaves
    the person looking at a number they know includes them and no way to fix
    it. Only today is correctable, finished days kept a count and threw the
    ids away."""
    ok = _forget_vid_today(request.cookies.get("psx_vid"))
    return jsonify({"ok": True, "removed": ok})


def _vid_counted_today(vid):
    """Has THIS browser been counted in today's visitor number?

    Answers "is the traffic including me" with a fact instead of a guess. Only
    today can be answered: _track_traffic folds every finished day down to a
    plain count and deletes the ids, on purpose, so the file cannot become a
    log of who visited when. The price of that is that a past day can never be
    separated back out, the information needed to do it was thrown away, which
    is the correct trade and worth stating plainly rather than hiding."""
    if not vid:
        return False
    try:
        rec = (_load_traffic().get("days") or {}).get(datetime.date.today().isoformat()) or {}
        return vid in (rec.get("visitor_ids") or [])
    except Exception:
        return False


def _forget_vid_today(vid):
    """Take this browser out of today's unique-visitor count.

    Only the unique count. Pageviews are not attributable: the counter never
    records how many pages a given id opened, so there is no honest way to
    subtract them. Same for the source, language, device and landing tallies, 
    each is a first-touch entry with no id attached to it. Removing the id
    fixes the number that actually gets read ("N visitors today") and leaves
    the rest slightly high, which is better than guessing at a correction."""
    if not vid:
        return False
    with _LOCK:
        data = _load_traffic()
        rec = (data.get("days") or {}).get(datetime.date.today().isoformat())
        if not rec or vid not in (rec.get("visitor_ids") or []):
            return False
        rec["visitor_ids"] = [v for v in rec["visitor_ids"] if v != vid]
        for key in ("path_ids", "tool_ids"):
            for k, ids in list((rec.get(key) or {}).items()):
                if isinstance(ids, list) and vid in ids:
                    rec[key][k] = [v for v in ids if v != vid]
        _save_traffic(data)
    return True


@app.route("/api/traffic/networks", methods=["GET", "POST"])
@owner_required
def api_traffic_networks():
    """Register (or drop) the network this request came from.

    Owner-only, because it decides whose visits disappear from the numbers, 
    a stranger able to call this could quietly delete themselves from the
    figures the business is read by.

    The address is taken from the request, never from the body. Letting the
    caller name an address would let a signed-in session erase traffic from
    somewhere it has never been, and the honest use, "I am sitting on this
    network now, stop counting it", does not need the parameter."""
    here = _norm_ip(_client_ip())
    if request.method == "GET":
        return jsonify({"ok": True, "here": here,
                        "here_registered": here in _registered_nets(),
                        "networks": list(_registered_nets().values()),
                        "from_env": sorted(
                            {_norm_ip(s) for s in
                             (os.environ.get("TRAFFIC_IGNORE_IPS", "") or "").split(",")
                             if s.strip()})})
    d = request.get_json(force=True, silent=True) or {}
    drop = (d.get("ip") or "").strip() if d.get("remove") else ""
    with _LOCK:
        rows = [r for r in (_load(IGNORE_NETS_PATH) or []) if isinstance(r, dict)]
        if drop:
            rows = [r for r in rows if _norm_ip(r.get("ip")) != _norm_ip(drop)]
        elif not any(_norm_ip(r.get("ip")) == here for r in rows):
            if not here:
                return jsonify({"ok": False, "error": "No address on this request."}), 400
            rows.append({"ip": here,
                         "label": _no_tags((d.get("label") or "").strip())[:60] or "this network",
                         "added_at": datetime.datetime.now().isoformat(timespec="seconds")})
        _save(IGNORE_NETS_PATH, rows)
    return jsonify({"ok": True, "here": here, "here_registered": here in _registered_nets(),
                    "networks": list(_registered_nets().values())})


@app.route("/not-a-traveler")
def not_a_traveler_page():
    """The human version of the opt-out, for a phone.

    Our own devices inflate every number the business is judged on, and the
    ones that matter most are the smallest, because a handful of self-visits is
    invisible in a thousand and decisive in twenty. Open this once per device.

    Deliberately a plain page and not part of the app shell: it has to work on
    a phone, in one tap, without logging in anywhere."""
    turn_off = request.args.get("count") == "1"     # ?count=1 puts it back
    now_counted = not (request.cookies.get(TRAFFIC_OPTOUT_COOKIE) == "1")
    if turn_off:
        counted_after = True
    elif request.args.get("set") == "0" or not request.args:
        counted_after = False
    else:
        counted_after = now_counted

    state = ("This device is <strong>not counted</strong> as a traveler."
             if not counted_after else
             "This device <strong>is being counted</strong> as a traveler.")
    other = ('<a class="b" href="/not-a-traveler?count=1">Count this device again</a>'
             if not counted_after else
             '<a class="b" href="/not-a-traveler?set=0">Stop counting this device</a>')

    # "Am I in today's number?" answered as a fact. Opting out stops the count
    # from here on; it does nothing about visits already recorded, and without
    # this the page cannot tell the difference, which is exactly the doubt
    # that makes someone distrust their own numbers.
    vid = request.cookies.get("psx_vid")
    if request.args.get("forget") == "1" and _forget_vid_today(vid):
        today_note = ("<p class='n'>Removed. This device is no longer in today's "
                      "visitor count.</p>")
    elif _vid_counted_today(vid):
        today_note = ("<p class='n'>This device <strong>is in today's visitor "
                      "count</strong>. "
                      "<a class='b' href='/not-a-traveler?forget=1'>Take it out"
                      "</a></p>")
    else:
        today_note = "<p class='n'>This device is not in today's visitor count.</p>"
    # Earlier days genuinely cannot be separated: their ids were discarded when
    # the day closed. Say so rather than let the page imply a clean slate.
    today_note += ("<p class='n' style='opacity:.62'>Only today can be corrected. "
                   "Finished days keep a count and no identifiers, so a past "
                   "visit cannot be told apart from anyone else's.</p>")
    html = """<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Not a traveler, Plateau Strategy</title>
<style>
 body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
   background:#070b16;color:#e7ecf5;font:16px/1.6 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;padding:1.5rem;}
 .c{max-width:30rem;text-align:center;}
 h1{font-size:1.35rem;margin:0 0 .75rem;}
 p{color:#9aa6bb;margin:.6rem 0;}
 strong{color:#e7ecf5;}
 .b{display:inline-block;margin-top:1.4rem;padding:.85rem 1.3rem;border-radius:999px;
   background:#2563eb;color:#fff;text-decoration:none;font-weight:600;min-height:44px;}
 .b:hover{background:#1d4ed8;}
 .s{display:block;margin-top:1.6rem;color:#6f7c92;font-size:.85rem;}
 .n{font-size:.92rem;margin:.5rem 0;}
 .n .b{margin-top:.5rem;padding:.55rem 1rem;font-size:.9rem;}
 a.h{color:#7da2ff;}
</style></head><body><div class="c">
<h1>Visitor counting</h1>
<p>%s</p>
<p>It is a single flag stored on this device. No identity, no address, nothing
recorded about you either way, the only effect is whether page opens from this
device are added to the visitor totals.</p>
%s
%s
<span class="s">Do this once on every device you use to check the site.
<a class="h" href="/">Back to the site</a></span>
</div>
<script>
// Keep the OPT-OUT alive, and only the opt-out.
//
// The flag is a cookie, and privacy tools sweep cookies, psx_nocount looks
// exactly like a tracker, because structurally it is one. When it is swept the
// device silently starts counting again, with no symptom: the numbers just
// drift up and nobody knows why. A copy in localStorage, which those tools
// usually leave alone, restores it on the next visit to this page.
//
// Worth being precise about what this is, because the same mechanism used the
// other way round is a dark pattern: respawning a cleared cookie to keep
// TRACKING someone is wrong. This respawns a cleared cookie to keep NOT
// counting someone. It only ever restores "do not count me", it never
// resurrects consent, and pressing "Count this device again" erases the
// backup as well as the cookie, so the reversal is real and permanent.
(function () {
  try {
    var KEY = 'psx_nocount_pref';
    var counted = %s;                       // what the server just decided
    if (counted) { localStorage.removeItem(KEY); return; }
    localStorage.setItem(KEY, '1');
  } catch (e) { /* storage blocked, the cookie alone still works */ }
})();
</script>
</body></html>""" % (state, other, today_note, "true" if counted_after else "false")
    return _set_not_counted(Response(html, mimetype="text/html"), not counted_after)


# ---------- who's actually here RIGHT NOW ----------
# Deliberately in-memory and ephemeral: presence is a live fact, not a record.
# It never touches disk, resets on restart, and holds only anonymous cookie ids
# with a last-seen stamp, nothing identifying, nothing retained.
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
    Otherwise the referring host, collapsed to a family, every Google property
    is 'google', not 'www.google.co.uk', so a week of ad spend adds up to a
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
    them. Without this an ad test only ever proves that pageviews went up.

    The same exclusions as a pageview, and for a stronger reason. This did not
    check them, so every guard built for _track_traffic, the opt-out cookie,
    the ignore-list addresses, the bot and headless-browser hints, applied to
    views and not to bookings. A test run on this machine left a day reading
    "0 pageviews, 1 booking", which is not a number anyone should have to
    interpret, and 17 bookings against 59 visitors on an earlier day.

    Conversions are the numbers most likely to be believed and hardest to sanity
    check, because a booking looks like a real thing happening. A device that is
    not a traveller for the purpose of counting visits is not a traveller for the
    purpose of counting bookings either."""
    try:
        if _skip_traffic():
            return
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



def _load_geo_cache():
    """_load() returns [] when a file is missing, and this cache is a dict, 
    so it gets its own reader rather than making the shared helper ambiguous."""
    try:
        with open(_data_path("geo_cache.json")) as f:
            d = json.load(f)
            return d if isinstance(d, dict) else {}
    except Exception:
        return {}


GEO_CACHE_TTL_DAYS = 30
_GEO_MEM = {}


def _geo_key(ip):
    """Coarsen the address before it is ever used as a key.

    An IPv4 address is cut to its /24 and an IPv6 to its /48. That is enough
    to place someone in a city and not enough to identify the household, and
    it means the cache cannot become a log of who visited. The full address
    is never written to disk and never leaves this function.
    """
    ip = (ip or "").strip()
    if not ip:
        return ""
    if ":" in ip:
        return ":".join(ip.split(":")[:3]) + "::/48"
    parts = ip.split(".")
    return ".".join(parts[:3]) + ".0/24" if len(parts) == 4 else ""


def _geo_lookup(ip):
    """Country / region / city for a visitor, or None.

    Deliberately cheap and deliberately quiet:
      · called once per NEW visitor, not once per pageview, so a busy day
        costs a handful of lookups rather than thousands;
      · cached on disk by the coarsened key, for a month;
      · a 2.5s timeout, and any failure returns None rather than raising, 
        analytics must never be able to break a page load;
      · ipwho.is needs no key and no account, so there is nothing for the
        owner to sign up for or pay.
    """
    key = _geo_key(ip)
    if not key:
        return None
    if key in _GEO_MEM:
        return _GEO_MEM[key]
    cache = _load_geo_cache()
    hit = cache.get(key)
    now = datetime.date.today().isoformat()
    if hit and hit.get("seen", "") >= (datetime.date.today()
                                       - datetime.timedelta(days=GEO_CACHE_TTL_DAYS)).isoformat():
        _GEO_MEM[key] = hit.get("place")
        return hit.get("place")
    place = None
    try:
        import requests as _rq
        r = _rq.get("https://ipwho.is/" + ip.split("%")[0],
                         params={"fields": "success,country,region,city,latitude,longitude"},
                         timeout=2.5)
        j = r.json()
        if j.get("success"):
            # Rounded to 2dp, about a kilometre. That is a pin on a city, which
            # is all a map of "where viewers are" needs, and it deliberately
            # throws away the precision that would point at a neighbourhood.
            def _r2(v):
                try:
                    return round(float(v), 2)
                except Exception:
                    return None
            place = {"country": j.get("country") or "",
                     "region": j.get("region") or "",
                     "city": j.get("city") or "",
                     "lat": _r2(j.get("latitude")),
                     "lon": _r2(j.get("longitude"))}
    except Exception:
        place = None
    try:
        with _LOCK:
            cache = _load_geo_cache()
            cache[key] = {"place": place, "seen": now}
            if len(cache) > 5000:
                for k in sorted(cache, key=lambda k: cache[k].get("seen", ""))[:1000]:
                    del cache[k]
            _save(_data_path("geo_cache.json"), cache)
    except Exception:
        pass
    _GEO_MEM[key] = place
    return place



def _visit_language():
    """The language the visitor's browser actually asks for.

    This site is published in five languages, and until now nothing recorded
    which ones people wanted, so there was no way to tell whether the
    translation work was reaching anyone. Only the primary tag is kept
    ("zh", "es"), never the full Accept-Language string, which is specific
    enough to help fingerprint a browser.
    """
    raw = (request.headers.get("Accept-Language") or "").strip()
    if not raw:
        return ""
    first = raw.split(",")[0].split(";")[0].strip().lower()
    return first.split("-")[0][:5] or ""


def _visit_device():
    """Phone, tablet or desktop, three buckets, nothing finer.

    Enough to answer "should I be designing for a phone" and deliberately
    not a device fingerprint. The full user-agent is never stored.
    """
    ua = (request.headers.get("User-Agent") or "").lower()
    if not ua:
        return "unknown"
    if "ipad" in ua or ("android" in ua and "mobile" not in ua) or "tablet" in ua:
        return "tablet"
    if "mobi" in ua or "iphone" in ua or "android" in ua:
        return "phone"
    return "desktop"


# href="/x.css" / src="/x.js", ours only. Anything already carrying a
# query string, and anything absolute, is left alone.
_ASSET_RE = re.compile(rb'\b(href|src)="(/[\w./-]+\.(?:css|js))"')

# What the assets are stamped with. Changes on every deploy, the point of it.
_ASSET_V = (os.environ.get("RENDER_GIT_COMMIT") or "")[:8] or str(int(time.time()))


@app.after_request
def _compress_and_cache(resp):
    """Two things nothing else was doing: squeeze the bytes, and let the
    browser keep them.

    Measured before this existed, a cold load of the home page pulled
    1.8 MB across 17 requests with Content-Encoding empty on every one of
    them. Locally that is 214 ms and looks fine. On a phone on mobile data
    it is closer to ten seconds, and that is the number that matters,
    because the people this site is translated for are reading it on a
    phone.

    gzip, not brotli: brotli needs a package that is not a dependency here,
    and gzip on text is most of the win for none of the risk.

    Caching is the other half. Every asset answered Cache-Control:no-cache,
    which does not mean "do not cache", it means "ask me every single
    time". Seventeen conditional requests per navigation, each one a round
    trip, all to be told nothing changed. Static files now hold for ten
    minutes, which is short enough that a deploy reaches everyone quickly
    and long enough that moving between pages costs nothing. HTML keeps
    revalidating, because a stale page is a stale price."""
    try:
        path = request.path or ""
        is_static = path.endswith((".css", ".js", ".png", ".svg", ".jpg", ".jpeg",
                                   ".webp", ".ico", ".woff", ".woff2", ".mp4"))
        # A route that has already said "no-store" means it: the by-link
        # pages set that so a shared page is not left in a proxy or in the
        # back/forward cache of a borrowed phone. Revalidating is the right
        # default for HTML, but it is weaker than what those pages asked for,
        # so it must not overwrite them.
        already = resp.headers.get("Cache-Control") or ""
        if "no-store" in already:
            pass
        elif is_static:
            resp.headers["Cache-Control"] = "public, max-age=600"
        elif (resp.mimetype or "").startswith("text/html"):
            resp.headers["Cache-Control"] = "no-cache"

        # Stamp the version onto our own stylesheets and scripts.
        #
        # Static files are held for ten minutes, which is the right call for
        # someone on mobile data. The cost is that for ten minutes after a
        # deploy a returning visitor keeps the OLD stylesheet, sees nothing
        # change, and reasonably concludes nothing shipped, which is exactly
        # what happened here, to the owner and then to me: the server was
        # serving the new CSS while the page went on painting with the
        # cached one.
        #
        # A version in the URL fixes both ends. A deploy changes every asset
        # URL, so the new look is immediate; between deploys the URL is
        # stable, so the ten-minute cache keeps doing its job. Nothing is
        # fetched more often than it was.
        #
        # This sits ABOVE the gzip section deliberately: the first attempt
        # put it below the Accept-Encoding guard, where a client that does
        # not ask for gzip would have been served unstamped HTML.
        if (resp.mimetype or "").startswith("text/html") and resp.status_code == 200:
            if resp.direct_passthrough:
                if (resp.content_length or 0) > 4_000_000:
                    return resp
                resp.direct_passthrough = False
            body = resp.get_data()
            stamped = _ASSET_RE.sub(
                lambda m: b'%s="%s?v=%s"' % (m.group(1), m.group(2), _ASSET_V.encode()),
                body)
            # One sign-in for the whole site, delivered the same way the
            # asset versions are: injected here, once, instead of thirty
            # templates each carrying a tag and drifting. The script does
            # nothing on a page without a header; owner consoles keep
            # their own doors and are left alone.
            if (not path.startswith(("/dispatch", "/archive", "/access", "/setup"))
                    and b'src="/site-auth.js' not in stamped
                    and b"</body>" in stamped):
                stamped = stamped.replace(
                    b"</body>",
                    b'<script src="/site-auth.js?v=%s" defer></script></body>'
                    % _ASSET_V.encode(), 1)
            if stamped != body:
                resp.set_data(stamped)

        # Compress text that is worth compressing. Below ~1 KB the header
        # overhead and the CPU are not repaid.
        if (resp.status_code < 200 or resp.status_code >= 300
                or "Content-Encoding" in resp.headers):
            return resp
        ctype = (resp.mimetype or "")
        if not (ctype.startswith("text/") or ctype in
                ("application/json", "application/javascript", "text/javascript",
                 "application/xml", "image/svg+xml")):
            return resp
        if "gzip" not in (request.headers.get("Accept-Encoding") or "").lower():
            return resp
        # send_file streams the file and sets direct_passthrough, and the
        # first version of this bailed out on that flag, skipping every
        # static file, which is to say every file worth compressing. The
        # 354 KB dictionary went out uncompressed while the check reported
        # itself working. Read it in instead; the cap keeps a stray video
        # out of memory.
        if resp.direct_passthrough:
            if (resp.content_length or 0) > 4_000_000:
                return resp
            resp.direct_passthrough = False
        data = resp.get_data()
        if len(data) < 1024:
            return resp
        packed = gzip.compress(data, 6)
        if len(packed) >= len(data):
            return resp
        resp.set_data(packed)
        resp.headers["Content-Encoding"] = "gzip"
        resp.headers["Content-Length"] = str(len(packed))
        resp.headers.add("Vary", "Accept-Encoding")
    except Exception:
        pass          # a failed optimisation must never fail the response
    return resp


@app.after_request
def _track_traffic(resp):
    """Lightweight, self-hosted page-view counter, no third-party analytics,
    no ad tracking. Counts real page loads only (GET, 200, text/html); API
    calls and static assets never touch this. A "unique visitor" is
    approximated by an anonymous long-lived cookie, nothing identifying, 
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
            need_geo = False
            if set_cookie:
                vid = secrets.token_hex(16)
            _presence_touch(vid)
            today = datetime.date.today().isoformat()
            with _LOCK:
                data = _load_traffic()
                days = data["days"]
                # Finalize any day that isn't today, its ids are spent, strip them.
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
                    # Where they are, counted, never stored per person. The
                    # day record keeps "United States|Washington|Seattle": 3,
                    # which can answer "where are my viewers from" and can
                    # never answer "where was this particular visitor".
                    # Language asked for, and what they are reading on. Both
                    # are counted per day, never attached to a person.
                    lang = _visit_language()
                    if lang:
                        rec.setdefault("langs", {})
                        rec["langs"][lang] = rec["langs"].get(lang, 0) + 1
                    dev = _visit_device()
                    rec.setdefault("devices", {})
                    rec["devices"][dev] = rec["devices"].get(dev, 0) + 1
                    # The page they arrived on, which of your tools is actually
                    # pulling people in, as opposed to which they click later.
                    rec.setdefault("landings", {})
                    rec["landings"][request.path] = rec["landings"].get(request.path, 0) + 1
                    # Where they are is looked up AFTER this lock is released
                    #, see below. _geo_lookup takes _LOCK too, and _LOCK is
                    # not reentrant, so doing it here never returns.
                    need_geo = True
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

            # ---- geography, outside the lock -------------------------------
            # This used to sit inside the block above, and _geo_lookup takes
            # the same _LOCK to write its cache. _LOCK is a threading.Lock,
            # which is NOT reentrant, so the second acquire never returned:
            # every visitor whose city was not already in memory hung forever,
            # and with gunicorn on one worker and eight threads, eight of them
            # took the whole site down. It is a deadlock, not a slow path.
            #
            # Out here it is also no longer holding the global write lock
            # across a 2.5s network call to a third party, which would have
            # serialised every other request behind it even when it worked.
            if need_geo:
                place = _geo_lookup(_client_ip())
                if place and (place.get("country") or place.get("city")):
                    label = "|".join([place.get("country", ""),
                                      place.get("region", ""),
                                      place.get("city", "")])
                    with _LOCK:
                        data = _load_traffic()
                        rec = data["days"].setdefault(today, {"pageviews": 0, "visitor_ids": [], "paths": {}})
                        rec.setdefault("places", {})
                        rec["places"][label] = rec["places"].get(label, 0) + 1
                        # One coordinate per place, kept beside the days rather
                        # than inside them, a city does not move, and repeating
                        # it per day would just bloat the file.
                        if place.get("lat") is not None:
                            data.setdefault("place_coords", {})[label] = [place["lat"], place["lon"]]
                        _save_traffic(data)

            if set_cookie:
                resp.set_cookie("psx_vid", vid, max_age=60 * 60 * 24 * 400,
                                 httponly=True, samesite="Lax")
            if set_src:
                # Carried so a booking made later can be credited to the source
                # that brought them. Holds a label like "google", never a URL,
                # and expires in 30 days, an ad click is not owed credit for a
                # booking made a year later.
                resp.set_cookie("psx_src", set_src, max_age=60 * 60 * 24 * 30,
                                httponly=True, samesite="Lax")
    except Exception:
        pass
    return resp


# ---------- driver contract helpers ----------
DEFAULT_CONTRACT = {
    "version": 1,
    "title": "Plateau Strategy, Driver & Vehicle Rental Agreement",
    "body": ("PLACEHOLDER AGREEMENT, replace this with your attorney-reviewed text "
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


# The home-screen and tab icons.
#
# These exist because the icon iOS was being handed, plateau-logo.png, was a
# 1024x1024 transparent PNG with the mark rendered as a speck in the middle:
# 5,116 ink pixels out of a million. iOS composites a transparent touch icon
# onto black, so the result on the home screen was a black square with a dot,
# which is exactly what the owner photographed and sent.
#
# Two rules learned from that: a touch icon must be OPAQUE, and it must be
# checked by looking at it rather than by trusting the conversion.
_ICONS = {
    # The share-card thumbnail. A separate, smaller file because WeChat's
    # crawler skips og:image files much over 300KB, which is why the owner
    # kept seeing a blank card after everything else was fixed.
    "share-card.jpg": "image/jpeg",
    "apple-touch-icon.png": "image/png",   # 180, iOS home screen
    "icon-192.png": "image/png",
    "icon-512.png": "image/png",
    "icon-32.png": "image/png",            # browser tab
}


@app.route("/share-card.jpg")
@app.route("/apple-touch-icon.png")
@app.route("/apple-touch-icon-precomposed.png")
@app.route("/icon-192.png")
@app.route("/icon-512.png")
@app.route("/icon-32.png")
def _icon_file():
    name = request.path.lstrip("/")
    if name == "apple-touch-icon-precomposed.png":
        name = "apple-touch-icon.png"      # older iOS asks for this one
    if name not in _ICONS:
        abort(404)
    return send_file(os.path.join(BASE_DIR, name), mimetype=_ICONS[name])


@app.route("/site.webmanifest")
def site_manifest():
    """So "Open as Web App" has a name and an icon of its own.

    Without it iOS falls back to the page <title>, which is
    "Plateau Strategy Solution Lab, Integrated Business Ecosystem" and gets
    truncated to nonsense under an icon.
    """
    return jsonify({
        "name": "Plateau Strategy Solution Lab",
        "short_name": "Plateau",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#0b1a2e",
        "theme_color": "#1f3a5f",
        "icons": [
            {"src": "/icon-192.png", "sizes": "192x192", "type": "image/png"},
            {"src": "/icon-512.png", "sizes": "512x512", "type": "image/png"},
            {"src": "/apple-touch-icon.png", "sizes": "180x180", "type": "image/png"},
        ],
    })


@app.route("/met")
def met_page():
    """Inside the Met, on footprints: our own schematic indoor map."""
    return send_file(os.path.join(BASE_DIR, "met.html"))


@app.route("/walks")
def walks_page():
    """The Walks: every map on the site, drawn on foot, in one index."""
    return send_file(os.path.join(BASE_DIR, "walks.html"))


# The cities of the corridor store, grouped by key prefix. A new city is a
# new row here plus its corridors in footprints.py, nothing else.
_WALK_CITIES = [
    ("new-york", "New York, inside the Met", ("met-",), "/met"),
    ("washington-dc", "Washington DC", ("union-station", "smithsonian-"), "/walk"),
    ("seattle", "Seattle", ("seatac-", "westlake-", "pike-place-", "monorail-"), "/walk"),
]


@app.route("/api/walks-map")
def api_walks_map():
    """The index behind The Walks: every corridor, by city, honest state.

    Public, and deliberately the same honesty rule as the Met sheet: a
    corridor is either measured, with its minutes and the date somebody
    walked it, or it is waiting, and the page says which."""
    cors = FOOTPRINTS.corridors()
    cities = []
    for key, name, prefixes, link in _WALK_CITIES:
        rows = []
        for c in cors:
            ck = c.get("key") or ""
            if not any(ck.startswith(p) for p in prefixes):
                continue
            w = c.get("walked") or None
            rows.append({"key": ck, "label": c.get("label") or ck,
                         "walked": bool(w),
                         "minutes": (w or {}).get("minutes"),
                         "date": (w or {}).get("date")})
        rows.sort(key=lambda r: (not r["walked"], r["label"]))
        cities.append({"key": key, "name": name, "link": link,
                       "corridors": rows,
                       "walked": sum(1 for r in rows if r["walked"]),
                       "total": len(rows)})
    return jsonify({"ok": True, "cities": cities})


# ---------- saved walks: your plans, under your sign-in ----------
WALKS_PATH = _data_path("saved_walks.json")
_WALK_ROOM_RE = re.compile(r"^[a-z0-9-]{2,40}$")


@app.route("/api/walks", methods=["GET", "POST"])
def api_walks():
    """A reader's saved walks. Their own and only their own, both ways:
    the list never shows anyone else's, and a walk saves under exactly
    the identity the session carries. This is the first thing the
    site-wide sign-in gives a visitor beyond the blueprint."""
    reader = session.get("reader") or {}
    email = (reader.get("email") or "").strip().lower()
    if not email:
        return _bp_nostore(jsonify({"ok": False, "need": "signin",
                                    "error": "Sign in to keep walks."}), 401)
    if request.method == "GET":
        rows = _load(WALKS_PATH)
        rows = rows if isinstance(rows, list) else []
        mine = [{k: w.get(k) for k in ("id", "kind", "walk", "title",
                                       "minutes", "saved_at")}
                for w in rows if w.get("email") == email]
        return _bp_nostore(jsonify({"ok": True, "walks": mine[::-1]}))
    data = request.get_json(force=True, silent=True) or {}
    if data.get("kind") != "met":
        return _bp_nostore(jsonify({"ok": False,
                                    "error": "Only Met walks can be saved yet."}), 400)
    rooms = [s.strip() for s in (data.get("walk") or "").split(",") if s.strip()]
    if not rooms or len(rooms) > 12 or not all(_WALK_ROOM_RE.match(s) for s in rooms):
        return _bp_nostore(jsonify({"ok": False,
                                    "error": "That walk could not be read."}), 400)
    title = _no_em_dash(_no_tags((data.get("title") or "").strip()), title=True)[:80]
    minutes = data.get("minutes")
    minutes = int(minutes) if isinstance(minutes, (int, float)) and 0 < minutes < 2000 else None
    with _LOCK:
        rows = _load(WALKS_PATH)
        rows = rows if isinstance(rows, list) else []
        mine = [w for w in rows if w.get("email") == email]
        for w in mine:
            if w.get("kind") == "met" and w.get("walk") == ",".join(rooms):
                return _bp_nostore(jsonify({"ok": True, "duplicate": True,
                                            "id": w.get("id")}))
        if len(mine) >= 50:
            return _bp_nostore(jsonify({"ok": False,
                                        "error": "Fifty walks is the shelf. "
                                        "Delete one to save another."}), 400)
        # NOT _next_id: that counts rows, and walks, unlike articles, get
        # deleted, so a length-based id would reuse a dead walk's id and a
        # later Remove would take two walks with one click. Max-plus-one
        # survives any history of deletions.
        top = 0
        for r0 in rows:
            m0 = re.match(r"WALK_(\d+)$", r0.get("id") or "")
            if m0:
                top = max(top, int(m0.group(1)))
        w = {"id": "WALK_%04d" % (top + 1),
             "email": email,
             "name": (reader.get("name") or "").strip()[:80],
             "kind": "met",
             "walk": ",".join(rooms),
             "title": title,
             "minutes": minutes,
             "saved_at": datetime.datetime.now().isoformat(timespec="seconds")}
        rows.append(w)
        # No blanket trim: a global cap would silently drop the OLDEST rows,
        # which belong to somebody else. The fifty-per-email shelf above is
        # the real bound.
        _save(WALKS_PATH, rows)
    return _bp_nostore(jsonify({"ok": True, "id": w["id"]}))


@app.route("/api/walks/<wid>/delete", methods=["POST"])
def api_walks_delete(wid):
    """Drop one of your own walks. Somebody else's id does nothing."""
    reader = session.get("reader") or {}
    email = (reader.get("email") or "").strip().lower()
    if not email:
        return _bp_nostore(jsonify({"ok": False, "need": "signin"}), 401)
    with _LOCK:
        rows = _load(WALKS_PATH)
        rows = rows if isinstance(rows, list) else []
        keep = [w for w in rows
                if not (w.get("id") == wid and w.get("email") == email)]
        if len(keep) != len(rows):
            _save(WALKS_PATH, keep)
            return _bp_nostore(jsonify({"ok": True}))
    return _bp_nostore(jsonify({"ok": False, "error": "Not one of your walks."}), 404)


@app.route("/met-map.js")
def met_map_js():
    return send_file(os.path.join(BASE_DIR, "met-map.js"))


@app.route("/met-cards.js")
def met_cards_js():
    return send_file(os.path.join(BASE_DIR, "met-cards.js"))


@app.route("/plateau-logo.png")
def logo():
    return send_file(os.path.join(BASE_DIR, "plateau-logo.png"))


@app.route("/favicon.ico")
def favicon():
    """Browsers ask for this whether or not the page links to it, and a 404
    is what leaves a tab blank. Answered with the SVG mark, which every
    browser that asks for a favicon can render."""
    return send_file(os.path.join(BASE_DIR, "plateau-logo.svg"),
                     mimetype="image/svg+xml")


@app.route("/plateau-logo.svg")
def logo_svg():
    return send_file(os.path.join(BASE_DIR, "plateau-logo.svg"))


@app.route("/floatback.js")
def floatback_js():
    return send_file(os.path.join(BASE_DIR, "floatback.js"))


@app.route("/frame-preview.js")
def frame_preview_js():
    """The section-framing preview. Inert unless the URL carries ?frame=,
    so it is invisible to visitors while a choice is being made."""
    return send_file(os.path.join(BASE_DIR, "frame-preview.js"))


@app.route("/basemap.js")
def basemap_js():
    return send_file(os.path.join(BASE_DIR, "basemap.js"))


@app.route("/i18n.js")
def i18n_js():
    return send_file(os.path.join(BASE_DIR, "i18n.js"))


@app.route("/i18n.<lang>.js")
def i18n_pack(lang):
    """One language, fetched only by someone reading it.

    The dictionary used to live inside i18n.js, 1123 entries times four
    languages, 265 KB on every page of the site. An English reader, which is
    most of them, downloaded Chinese, Spanish, Korean and Vietnamese and used
    none of it. The engine is 11 KB now and asks for the single pack it
    needs; English asks for nothing, because English is the text already on
    the page."""
    if lang not in ("zh", "es", "ko", "vi"):
        return ("", 404)
    path = os.path.join(BASE_DIR, "i18n.%s.js" % lang)
    if not os.path.exists(path):
        return ("", 404)
    return send_file(path, mimetype="text/javascript")


@app.route("/vendor/leaflet/<path:filename>")
def leaflet_vendor(filename):
    """Leaflet, served from here rather than unpkg.

    The map pages loaded it from a CDN, which means the map is only as
    available as somebody else's edge network. unpkg is routinely blocked or
    throttled in mainland China, and this site is translated into Chinese
    precisely to reach travelers from there, so the map was most likely dead
    for the readers the translation was written for. It is 160 KB. We serve
    it."""
    from flask import send_from_directory
    return send_from_directory(os.path.join(BASE_DIR, "vendor", "leaflet"), filename)


@app.route("/google-signin.js")
def google_signin_js():
    """The "Continue with Google" button, shared by every form that offers it.

    One copy rather than one per page: it is security-sensitive, the rule that
    the credential is never decoded in the browser has to hold everywhere, and
    three copies is three places to get that wrong."""
    return send_file(os.path.join(BASE_DIR, "google-signin.js"),
                     mimetype="text/javascript")


@app.route("/site-auth.js")
def site_auth_js():
    """The site-wide sign-in chip, one copy, injected into every page by
    the response rewriter rather than carried by thirty templates."""
    return send_file(os.path.join(BASE_DIR, "site-auth.js"),
                     mimetype="text/javascript")


FOOTPRINTS = footprints.Store(_data_path("footprints.json"))


def _fp_walked(key):
    """The bridge from journeys to footprints: has this corridor a fresh trace?"""
    return FOOTPRINTS.walked(key)


@app.route("/api/journeys")
def api_journeys():
    """What we can walk somebody through, and what is held back.

    The held list is returned rather than hidden: a journey withheld for want
    of checking is work to be done, and a list that only shows the good ones
    makes that work invisible."""
    return jsonify({"ok": True, **journeys.listing(walked=_fp_walked)})


@app.route("/api/journeys/<jid>")
def api_journey(jid):
    j, why = journeys.serve(jid, walked=_fp_walked)
    if not j:
        # 409, not 404: it exists, it is simply not fit to hand anybody. A 404
        # would send the next person to build it again.
        return jsonify({"ok": False, "error": "This journey is not verified "
                                              "yet.", "reasons": why}), 409
    return jsonify({"ok": True, "journey": j})


# ---------------------------------------------------------------------------
# Footprints, recorded walks of our own corridors
#
# The one place on this site that accepts coordinates, and the fence around
# it: the submitter is owner-authenticated, the corridors are a closed list
# written in footprints.py, and what is stored is a public walkway with no
# person attached, no identity, no clock, a date and a duration only.
#
# consent.py's refusal of coordinates guards VISITOR data. This is the
# business surveying its own ground; conflating the two would mean either
# weakening the visitors' guard or never being able to map our own front door.
# ---------------------------------------------------------------------------
def surveyor_required(fn):
    """The owner, or an account the owner issued, the surveyor programme.

    One person cannot walk every corridor in a growing list, so recording
    extends to the accounts minted at /api/access/users: named, issued by
    Sean, revocable, and re-checked against storage on every request, so
    cutting somebody off cuts them off mid-session. What does NOT change is
    who can be on the other end: never a visitor. The authorization is the
    provenance, a trace exists because somebody Sean trusts walked it, and
    that is why the walk record itself still needs no name in it."""
    @wraps(fn)
    def wrapper(*a, **k):
        if not session.get("owner") and not _access_user():
            return jsonify({"ok": False, "auth_required": True,
                            "error": "Login required."}), 401
        return fn(*a, **k)
    return wrapper


@app.route("/api/footprints")
@surveyor_required
def api_footprints():
    """Every corridor, walked or waiting, for the people doing the walking.
    Not public: the waiting list is a map of our unfinished edges."""
    return jsonify({"ok": True, "corridors": FOOTPRINTS.corridors()})


@app.route("/api/footprints/<key>", methods=["POST"])
@surveyor_required
def api_footprint_add(key):
    d = request.get_json(force=True, silent=True)
    if not isinstance(d, dict):
        # A top-level JSON array is truthy, so `or {}` kept it and d.get()
        # blew up with a 500. A refusal, like every other bad input here.
        d = {}
    walk, why = FOOTPRINTS.add_walk(key, d.get("points") or [],
                                    minutes=d.get("minutes"),
                                    worst_accuracy_m=d.get("worst_accuracy_m"))
    if not walk:
        return jsonify({"ok": False, "error": why}), 400
    return jsonify({"ok": True,
                    "walk": {k: v for k, v in walk.items() if k != "points"},
                    "walked": FOOTPRINTS.walked(key)})


@app.route("/api/footprints/walked")
def api_footprints_walked():
    """The corridors that HAVE a recorded walk — public, unlike the work list.

    The distinction: an unwalked corridor's existence maps our unfinished
    edges and stays surveyor-only. A walked one is the product, and the guide
    on a stranger's phone needs this list to know which recorded lines exist
    near them. Keys, labels and dates only; the lines themselves come one at
    a time from /path."""
    out = []
    for c in FOOTPRINTS.corridors():
        if c.get("walked"):
            p = FOOTPRINTS.path(c["key"])
            out.append({"key": c["key"], "label": c["label"],
                        "date": c["walked"]["date"],
                        # the measured time is the footprint's whole promise;
                        # the Met page swaps its tilde estimate for this
                        "minutes": c["walked"].get("minutes"),
                        "length_m": p["length_m"] if p else None})
    return jsonify({"ok": True, "corridors": out})


@app.route("/api/footprints/<key>/notes", methods=["POST"])
@surveyor_required
def api_footprint_notes(key):
    """Set the described waypoints for a corridor: the indoor announcements the
    guide speaks as you pass them. Owner/surveyor only, like recording a walk.

    Each note is {at_frac: 0..1 along the corridor, text, side}. Coordinates are
    refused by the same guard as everywhere else: a note is a description of a
    place on a known line, never a new fix on the ground."""
    d = request.get_json(force=True, silent=True) or {}
    # at_frac is a legitimate 0..1 fraction along the line, and the coordinate
    # guard flags every fractional float, so scan with at_frac removed. A real
    # lat/lon still trips it: the key "lat" or a value like 47.6062 survives the
    # strip. A note describes a point on a known line, never a new fix.
    scrub = {"notes": [{k: v for k, v in n.items() if k != "at_frac"}
                       for n in (d.get("notes") or []) if isinstance(n, dict)]}
    hit = consent.looks_like_coordinate(scrub)
    if hit:
        return jsonify({"ok": False,
                        "error": "Notes describe points on a recorded line, "
                                 "not coordinates (%s)." % hit}), 400
    notes = FOOTPRINTS.set_notes(key, d.get("notes") or [])
    if notes is None:
        return jsonify({"ok": False, "error": "No such corridor."}), 400
    return jsonify({"ok": True, "notes": notes})


@app.route("/api/footprints/<key>/path")
def api_footprint_path(key):
    """The recorded line of a walked corridor, public, because it is the
    product: the next traveller gets a path known to work. 404 for unknown
    and unwalked alike; an unwalked corridor's existence is nobody's business."""
    p = FOOTPRINTS.path(key)
    if not p:
        return Response("Not Found", status=404, mimetype="text/plain")
    return jsonify({"ok": True, **p})


@app.route("/guide-concept")
def guide_concept_page():
    """The full guiding-service vision as a blueprint, for the Reinvestment USA
    board: the free world map that becomes a private guide, indoor and out, that
    protects the moment a traveller came for. noindex, travels by being sent."""
    r = send_file(os.path.join(BASE_DIR, "guide-concept.html"))
    r.headers["X-Robots-Tag"] = "noindex, nofollow"
    return r


@app.route("/footprints-concept")
def footprints_concept_page():
    """The blueprint draft of the footprints idea, for the Reinvestment USA
    board. The shareable, limited-information half: what it does and why it
    matters, with the mechanics named but not described. noindex and out of
    the sitemap, it travels by being sent, not by being found."""
    r = send_file(os.path.join(BASE_DIR, "footprints-concept.html"))
    r.headers["X-Robots-Tag"] = "noindex, nofollow"
    return r


@app.route("/footprints-demo")
def footprints_demo_page():
    """The concept, moving. The blueprint page describes the direction gate;
    this one runs it, the guide's own trailAhead() deciding live which
    footprints to draw as a dial (or the phone's real compass) turns. Same
    noindex posture as the blueprint: it travels by being sent."""
    r = send_file(os.path.join(BASE_DIR, "footprints-demo.html"))
    r.headers["X-Robots-Tag"] = "noindex, nofollow"
    return r


@app.route("/footprint")
def footprint_page():
    """The recorder. Content is harmless without an owner session, the POST
    it feeds is what is guarded, but noindex anyway; it is a work tool."""
    r = send_file(os.path.join(BASE_DIR, "footprint.html"))
    r.headers["X-Robots-Tag"] = "noindex, nofollow"
    return r


@app.route("/walk")
def walk_page():
    """The live walking guide, prototype, deliberately unlisted.

    noindex and out of the sitemap while it is a prototype: a half-built guide
    found by a stranger through search is a bad first impression of a good
    idea."""
    r = send_file(os.path.join(BASE_DIR, "walk.html"))
    r.headers["X-Robots-Tag"] = "noindex, nofollow"
    return r


@app.route("/walk-guide.js")
def walk_guide_js():
    return send_file(os.path.join(BASE_DIR, "walk-guide.js"),
                     mimetype="text/javascript")


@app.route("/manifest.webmanifest")
def walk_manifest():
    """The install manifest: what makes /walk an app on a home screen."""
    return send_file(os.path.join(BASE_DIR, "manifest.webmanifest"),
                     mimetype="application/manifest+json")


@app.route("/sw.js")
def walk_sw():
    return send_file(os.path.join(BASE_DIR, "sw.js"),
                     mimetype="text/javascript")


@app.route("/psx-net.js")
def psx_net_js():
    """One network helper, shared by every page.

    Lives in its own file rather than inside i18n.js because i18n.js is
    generated by build_i18n.py and would lose anything hand-edited into it."""
    return send_file(os.path.join(BASE_DIR, "psx-net.js"))


@app.route("/session.js")
def session_js():
    return send_file(os.path.join(BASE_DIR, "session.js"))


@app.route("/admin-terminal.css")
def admin_terminal_css():
    return send_file(os.path.join(BASE_DIR, "admin-terminal.css"))


@app.route("/modern.css")
def modern_css():
    """The current surface: white ground, big type, colour only in solid things.

    Loaded after paper.css and overriding it, in its own file on purpose, the
    look is one <link> to remove. Two earlier attempts at this were wrong in
    opposite directions and both had to be unpicked out of a shared stylesheet.
    """
    return send_file(os.path.join(BASE_DIR, "modern.css"), mimetype="text/css")


@app.route("/paper.css")
def paper_css():
    """The paper theme, shared by every page.

    It was written inline on the landing page. Carrying it to the rest of the
    site by copy-and-paste would guarantee eight versions that drift, so it
    lives in one file that every page links."""
    return send_file(os.path.join(BASE_DIR, "paper.css"))


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


# ---------------------------------------------------------------------------
# Privacy policy
#
# The site ran without one. That is not a small gap: the archive page tells the
# owner to market "per your privacy policy", Washington's My Health My Data Act
# wants a distinctly-linked notice, and every processor agreement assumes one
# exists. Publishing an accurate description of what already happens lowers
# risk on the day it goes up.
#
# It will not serve without PRIVACY_CONTACT. A policy that grants people the
# right to ask for their data, and gives them no working address to ask at, is
# worse than none, it documents an obligation and then fails it. The domain
# has no MX records today, so hello@plateaustrategy.io bounces, and the owner's
# personal address is not going up without his say-so. One environment variable
# publishes it.
# ---------------------------------------------------------------------------
PRIVACY_CONTACT = os.environ.get("PRIVACY_CONTACT", "").strip()


@app.route("/privacy")
def privacy_page():
    if not PRIVACY_CONTACT:
        return Response(
            "The privacy policy is not published yet.\n"
            "Set PRIVACY_CONTACT to a working address to publish it.\n",
            status=404, mimetype="text/plain")
    return send_file(os.path.join(BASE_DIR, "privacy.html"))


@app.route("/api/privacy/contact")
def api_privacy_contact():
    """The address on the policy. Configuration, so it cannot go stale in HTML."""
    return jsonify({"ok": bool(PRIVACY_CONTACT), "contact": PRIVACY_CONTACT})


# ---------------------------------------------------------------------------
# "Add this place to the map", consented, coarse, and switched off
#
# Every route here answers 404 unless LOCATION_CONSENT_ENABLED is set. Same
# discipline as the bot lab: the code can be reviewed, tested and deployed
# while the feature does not exist to a visitor, and turning it on is a
# deliberate act by one person on one instance.
#
# The subject of a consent is a RANDOM TOKEN IN THE SESSION, never the customer
# id. Two reasons, and the second is the important one:
#
#   1. A client-supplied id is a client-supplied id. If withdrawal or the data
#      export keyed on whatever the browser claimed to be, anyone could erase
#      or read anyone else's.
#   2. Tying contributions to an account would create exactly the record this
#      whole design exists to avoid: named person, plus places. Unlinked, the
#      contributions file is a list of city names that identifies nobody.
#
# The honest cost: clear your cookies and this browser can no longer withdraw
# what it added. Since what it added is "somebody once said Tacoma", that is
# the right side of the trade, and it is written on the page rather than
# hidden. See consent.py and PRIVACY.md.
# ---------------------------------------------------------------------------
CONSENT = consent.ConsentStore(_data_path("consents.json"),
                               _data_path("place_contributions.json"))


def consent_enabled():
    return os.environ.get("LOCATION_CONSENT_ENABLED", "").strip().lower() \
        in ("1", "true", "yes", "on")


def consent_on(fn):
    @wraps(fn)
    def wrapper(*a, **k):
        if not consent_enabled():
            return Response("Not Found", status=404, mimetype="text/plain")
        return fn(*a, **k)
    return wrapper


def _consent_subject(create=False):
    """This browser's opaque handle, minted on first consent and never reused."""
    who = session.get("consent_subject")
    if not who and create:
        who = "sub_" + secrets.token_urlsafe(12)
        session["consent_subject"] = who
    return who


@app.route("/api/consent/text")
@consent_on
def api_consent_text():
    """The exact wording to show, and the version to send back with the answer.

    The page must render THIS text. If it renders its own words and posts this
    version, the ledger records agreement to something the person never read.
    """
    t = consent.consent_text(request.args.get("purpose") or "")
    if not t:
        return jsonify({"ok": False, "error": "Unknown purpose."}), 400
    return jsonify({"ok": True, **t})


@app.route("/api/consent/grant", methods=["POST"])
@consent_on
def api_consent_grant():
    d = request.get_json(force=True, silent=True) or {}
    # `granted` must arrive as a real JSON true. consent.grant enforces it too;
    # this is the same rule stated where the request is parsed, because a
    # missing key reading as consent is the classic way these go wrong.
    row = CONSENT.grant(_consent_subject(create=True),
                        (d.get("purpose") or "").strip(),
                        (d.get("version") or "").strip(),
                        d.get("granted"))
    if not row:
        session.pop("consent_subject", None)      # nothing was recorded
        return jsonify({"ok": False, "error": "That consent was not recorded."}), 400
    return jsonify({"ok": True, "purpose": row["purpose"],
                    "version": row["text_version"]})


@app.route("/api/consent/withdraw", methods=["POST"])
@consent_on
def api_consent_withdraw():
    d = request.get_json(force=True, silent=True) or {}
    who = _consent_subject()
    if not who:
        return jsonify({"ok": True, "deleted": 0})     # nothing here to take back
    deleted = CONSENT.withdraw(who, (d.get("purpose") or "").strip())
    return jsonify({"ok": True, "deleted": deleted})


@app.route("/api/consent/place", methods=["POST"])
@consent_on
def api_consent_place():
    """File one city, against a live consent, with no coordinate anywhere.

    The coordinate check runs on the WHOLE body before anything is read out of
    it. A caller sending a lat/lon alongside the city is refused rather than
    quietly ignored: silently dropping it would leave the caller believing we
    accept coordinates, and the next version of that caller would send more.
    """
    d = request.get_json(force=True, silent=True) or {}
    hit = consent.looks_like_coordinate(d)
    if hit:
        return jsonify({"ok": False,
                        "error": "This endpoint does not accept location "
                                 "coordinates (%s). Send the city name." % hit}), 400
    who = _consent_subject()
    row = CONSENT.live_consent(who, "map_place") if who else None
    if not row:
        return jsonify({"ok": False, "error": "No consent on record."}), 403
    CONSENT.sweep()                    # retention runs on use, not on a promise
    saved = CONSENT.record_place(row, d.get("city"), d.get("region"),
                                 d.get("country"))
    if not saved:
        return jsonify({"ok": False, "error": "Need a city name."}), 400
    return jsonify({"ok": True, "city": saved["city"]})


@app.route("/api/consent/me")
@consent_on
def api_consent_me():
    """Everything this browser has consented to and contributed."""
    who = _consent_subject()
    if not who:
        return jsonify({"ok": True, "consents": [], "places": []})
    return jsonify({"ok": True, **CONSENT.export(who)})


@app.route("/api/consent/cities")
@consent_on
@owner_required
def api_consent_cities():
    """The output: city -> how many distinct people added it. Owner only.

    Owner-only while the counts are small. A city with one contributor is one
    person's whereabouts however it is labelled, and a public page showing that
    would undo the rest of this.
    """
    return jsonify({"ok": True, "cities": CONSENT.cities()})


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
# The free tools are the top of the funnel, they only pay for themselves if
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
    ("/walk", "0.8", "weekly"),
    ("/footprints-demo", "0.7", "monthly"),
    ("/footprints-concept", "0.6", "monthly"),
    ("/book", "0.8", "monthly"),
    ("/articles", "0.7", "weekly"),
    ("/partners", "0.6", "monthly"),
    ("/agent", "0.6", "monthly"),
    ("/renter", "0.6", "monthly"),
    ("/deflator", "0.5", "monthly"),
    ("/board", "0.4", "monthly"),
]
OWNER_ONLY_PATHS = ["/dispatch", "/setup", "/archive", "/api/", "/deflator"]
SITE_ORIGIN = os.environ.get("SITE_ORIGIN", "https://plateaustrategy.io").rstrip("/")
# Referrers from our own pages are not a traffic source, they are navigation.
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
- [The Walking Guide](%(o)s/walk): A spoken guide that names what is around you
  as you walk a recorded corridor, and refuses to guess when GPS is poor.
- [The Footprints Demo](%(o)s/footprints-demo): The direction gate — footprints
  that vanish when you face the wrong way, shown working with a real compass.

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
    # Every live idea, so a search engine can find one without knowing the
    # board exists. These are the only pages here whose addresses nobody could
    # guess, and the whole point of them is that strangers arrive.
    for a in _load(ARTICLES_PATH):
        if a.get("hidden") or not a.get("id"):
            continue
        out += ["  <url>",
                "    <loc>%s/idea/%s</loc>" % (SITE_ORIGIN, html.escape(a["id"])),
                "    <lastmod>%s</lastmod>" % ((a.get("created_at") or today)[:10]),
                "    <changefreq>weekly</changefreq>",
                "    <priority>0.6</priority>",
                "  </url>"]
    out.append("</urlset>")
    return Response("\n".join(out), mimetype="application/xml")


# ---------------------------------------------------------------------------
# Pages shared by link only
#
# Some work is ready to show a few people and not ready to be on the site.
# The robotic-trading write-up is the first: it describes an idea, it is not
# an offer, and while it still says "research" it must not turn up in a
# search result or be found by someone clicking around.
#
# So it lives behind a capability URL, the key IS the link. Whoever holds it
# gets in; nobody else can guess it. Deliberately NOT listed in robots.txt:
# that file is public, so a Disallow line would advertise the path to exactly
# the people it is hidden from. It carries X-Robots-Tag: noindex instead, and
# so does the refusal, so a crawler that somehow reaches either drops it.
#
# Be clear about what this is: share-link privacy, the same model as an
# unlisted document. It is not authentication. Anyone Sean sends the link to
# can forward it to anyone else, and there is no way to tell that apart from
# the friend opening it twice. It is the right strength for a concept and the
# wrong strength for anything that needs to stay secret.
#
# The key comes from the environment when set (so the link is stable and can
# be chosen), otherwise it is generated once and kept on disk, so a restart
# never breaks a link that has already been sent to somebody.
# ---------------------------------------------------------------------------
SHARE_KEYS_PATH = _data_path("share_keys.json")
SHARE_COOKIE_DAYS = 90


def _share_key(name):
    env = (os.environ.get("%s_SHARE_KEY" % name.upper().replace("-", "_")) or "").strip()
    if env:
        return env
    with _LOCK:
        keys = _load(SHARE_KEYS_PATH)
        if not isinstance(keys, dict):
            keys = {}
        if not keys.get(name):
            keys[name] = secrets.token_urlsafe(12)
            _save(SHARE_KEYS_PATH, keys)
        return keys[name]


def _share_state(name):
    """'arriving' on a good ?k=, 'holding' on a good cookie, None otherwise.

    compare_digest rather than == so a wrong key cannot be narrowed down by
    timing the reply. Overkill for a concept page, free to write correctly."""
    want = _share_key(name)
    given = (request.args.get("k") or "").strip()
    if given and secrets.compare_digest(given, want):
        return "arriving"
    held = request.cookies.get("psx_share_" + name) or ""
    if held and secrets.compare_digest(held, want):
        return "holding"
    return None


SHARE_MISS_HTML = """<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Shared by link, Plateau Strategy Solution Lab</title>
<link rel="icon" type="image/png" sizes="32x32" href="/icon-32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<meta name="apple-mobile-web-app-title" content="Plateau">
<meta name="theme-color" content="#1f3a5f">
<link rel="stylesheet" href="/paper.css"><link rel="stylesheet" href="/modern.css">
</head><body data-arm="company"><div class="wrap" style="max-width:34rem;margin:5rem auto;padding:0 1.2rem">
<h1 class="page-title">This page is shared by link</h1>
<p class="page-sub">It opens only from the full link it was sent with. If you
were given one, open that link again rather than this address &mdash; the part
after <code>?</code> is what lets you in.</p>
<p><a href="/">Back to Plateau Strategy Solution Lab</a></p>
</div></body></html>"""


def _shared_page(name, filename, password=False):
    """Serve a by-link page, or refuse.

    With password=True the reader needs BOTH halves: the link, and an account
    the owner issued. Either one alone gets them nothing. That is a real
    difference rather than a doubled-up formality, a link can be forwarded to
    someone you did not choose, and a password can be typed at an address a
    stranger never found. Requiring both means a forwarded link is inert in
    the hands of anyone you have not also given a password to, and it means
    you can cut one person off (revoke their account) without invalidating the
    link for everybody else."""
    state = _share_state(name)
    if state is None:
        r = make_response(SHARE_MISS_HTML, 404)
        r.headers["X-Robots-Tag"] = "noindex, nofollow"
        return r
    if state == "arriving":
        # Move the key out of the address bar and into a cookie, so a
        # screenshot or a shoulder-glance does not hand the link on. The
        # link itself still carries it, that is what makes it shareable.
        r = redirect(request.path)
        r.set_cookie("psx_share_" + name, _share_key(name),
                     max_age=SHARE_COOKIE_DAYS * 24 * 3600,
                     httponly=True, samesite="Lax", secure=request.is_secure)
        return r
    if password and not _access_user():
        # The key was good, so this reader was sent the link, they just have
        # not signed in. Show the sign-in rather than the 404: pretending the
        # page is missing would be a lie to somebody who is meant to be here.
        r = make_response(send_file(os.path.join(BASE_DIR, "access-gate.html")), 401)
        r.headers["X-Robots-Tag"] = "noindex, nofollow"
        r.headers["Cache-Control"] = "private, no-store"
        return r
    r = make_response(send_file(os.path.join(BASE_DIR, filename)))
    r.headers["X-Robots-Tag"] = "noindex, nofollow"
    r.headers["Cache-Control"] = "private, no-store"
    return r


# ---------------------------------------------------------------------------
# Issued accounts, shared by every private surface
#
# The accounts live in bot_lab.BotLab because that is where they were first
# written, but they are not the lab's property, /robot uses them too, and
# sign-in deliberately does NOT sit behind BOT_LAB_ENABLED. Otherwise turning
# the lab off would lock people out of an unrelated page.
#
# The owner mints these at /api/lab/users. There is still exactly one door.
# ---------------------------------------------------------------------------
def _access_user():
    """The signed-in account, re-checked against storage on every request.

    This used to return session.get("access_user") and nothing else, which
    meant revoking somebody only stopped them logging in AGAIN, anyone
    already signed in kept reading indefinitely. That is the opposite of what
    revocation is for, and it was the only remedy available, since this system
    deliberately has no password reset.

    role_of already fails closed for revoked and unknown accounts, so one
    lookup closes it. The session is cleared as well as refused, so the next
    request does not repeat the work."""
    who = session.get("access_user")
    if who and LAB.role_of(who) is None:
        session.pop("access_user", None)
        return None
    return who


@app.route("/api/access/login", methods=["POST"])
def api_access_login():
    d = request.get_json(force=True, silent=True) or {}
    username = (d.get("username") or "").strip().lower()
    if _login_blocked(username):
        return _too_many_tries()
    if LAB.check_login(username, d.get("password") or ""):
        _login_ok(username)
        session["access_user"] = username
        LAB.touch(username)
        return jsonify({"ok": True, "username": username})
    _login_failed(username)
    return jsonify({"ok": False, "error": "Those details were not accepted."}), 401


@app.route("/api/access/logout", methods=["POST"])
def api_access_logout():
    session.pop("access_user", None)
    session.pop("lab_user", None)
    return jsonify({"ok": True})


@app.route("/record")
def record_signin_page():
    """The surveyor's door: sign in with an issued account, land on the recorder.

    The access gate used to appear only on password-protected share links, so
    a surveyor holding credentials but no share link had no page to sign in
    on — the recorder told them to sign in "on the shared pages" they had
    never been sent. This is that missing door: the owner or an already
    signed-in account goes straight to the recorder; everyone else gets the
    gate, and the gate's reload lands back here, which sends them on."""
    if session.get("owner") or _access_user():
        return redirect("/footprint")
    r = make_response(send_file(os.path.join(BASE_DIR, "access-gate.html")))
    r.headers["X-Robots-Tag"] = "noindex, nofollow"
    r.headers["Cache-Control"] = "private, no-store"
    return r


@app.route("/robot")
def robot_concept_page():
    """The robotic-trading concept, for people Sean sends the link to.

    Link AND password now: it describes an unfinished trading idea, and a
    forwarded link should not be enough to read it.

    Still reading matter only. It takes no money, no bank connection and no
    account of the reader's, and there is no form on it that could start any
    of those, the sign-in is a separate page."""
    return _shared_page("robot", "robot-concept.html", password=True)


@app.route("/api/share-links")
@owner_required
def api_share_links():
    """The owner's copy of the links to send. Owner-only for the obvious
    reason: this endpoint hands out the keys."""
    return jsonify({"links": [
        {"name": "robot", "title": "Robotic trading, the concept",
         "url": "%s/robot?k=%s" % (SITE_ORIGIN, _share_key("robot"))},
    ]})


# ---------------------------------------------------------------------------
# The bot lab
#
# Everything below answers 404 unless BOT_LAB_ENABLED is set. That is the
# point: the legal question of whether software may trade in somebody else's
# account is with an attorney and is not answered, so this code can sit in the
# repository and be deployed without any of it existing to a visitor. Turning
# it on is a deliberate act on one instance, not a consequence of a merge.
#
# 404 rather than 401 or 403, "you may not" tells a stranger there is
# something here. See bot_lab.py for the rest of the reasoning, including why
# there is no signup, no password reset and no account recovery.
# ---------------------------------------------------------------------------
LAB = bot_lab.BotLab(_data_path("bot_users.json"),
                     _data_path("bot_ledger.json"),
                     _data_path("bot_locks.json"))


def _lab_404():
    return Response("Not Found", status=404, mimetype="text/plain")


def lab_enabled(fn):
    @wraps(fn)
    def wrapper(*a, **k):
        if not bot_lab.enabled():
            return _lab_404()
        return fn(*a, **k)
    return wrapper


def lab_user_required(fn):
    """A signed-in account, plus the lab being switched on.

    Sign-in itself lives at /api/access/login and is shared with /robot, one
    credential, one door. The lab adds its own switch on top; it does not have
    its own login. The owner is NOT automatically signed in: the owner's
    console is a different surface, and conflating them is how an admin
    session ends up doing a user's actions by accident."""
    @wraps(fn)
    def wrapper(*a, **k):
        if not bot_lab.enabled():
            return _lab_404()
        if not _access_user():
            return jsonify({"ok": False, "auth_required": True,
                            "error": "Sign in to continue."}), 401
        return fn(*a, **k)
    return wrapper


@app.route("/lab")
@lab_enabled
def lab_page():
    r = make_response(send_file(os.path.join(BASE_DIR, "bot-lab.html")))
    r.headers["X-Robots-Tag"] = "noindex, nofollow"
    r.headers["Cache-Control"] = "private, no-store"
    return r


# The lab has no login of its own. It used to, which meant two sign-in routes
# against one account file and two session keys that could disagree, sign in
# for /robot and the lab would still consider you a stranger. Both surfaces
# now use /api/access/login, defined above with the shared-account block.


@app.route("/api/lab/board")
@lab_user_required
def api_lab_board():
    """What a signed-in user sees: the locks and the record. Nothing about the
    owner, nothing about any other user."""
    return jsonify(dict(LAB.board(), ok=True, username=session.get("lab_user")))


def lab_bot_required(fn):
    """Only a bot account may write to the ledger.

    This used to be @lab_user_required, which meant every account that could
    read the pages could also file trades, so a friend given a password to
    read the concept could have posted fabricated winners until a strategy
    cleared the unlock bar. The two-key rule still needed the owner's flip, so
    nothing could open by itself, but the record would have been lying by the
    time the owner looked at it, and the record is the whole basis for the
    decision.

    403, not 404: this caller is signed in and known. Hiding the endpoint from
    them would only make a misconfigured bot harder to diagnose."""
    @wraps(fn)
    def wrapper(*a, **k):
        if not bot_lab.enabled():
            return _lab_404()
        who = _access_user()
        if not who:
            return jsonify({"ok": False, "auth_required": True,
                            "error": "Sign in to continue."}), 401
        if not LAB.may_write(who):
            return jsonify({"ok": False,
                            "error": "This account may read the record but not "
                                     "write to it. Posting fills needs a bot "
                                     "account."}), 403
        return fn(*a, **k)
    return wrapper


@app.route("/api/lab/fills", methods=["POST"])
@lab_bot_required
def api_lab_fill():
    """The plug point for the bot. Records one completed PAPER trade.

    There is no live counterpart, on purpose. When there is an answer from the
    attorney and a bot to connect, the live path gets written then, with the
    three switches in bot_lab.live_execution_allowed() lined up, and not a
    moment earlier."""
    d = request.get_json(force=True, silent=True) or {}
    row, err = LAB.record_fill(d.get("strategy"), d.get("pnl_usd"),
                               note=d.get("note"))
    if err:
        return jsonify({"ok": False, "error": err}), 400
    return jsonify({"ok": True, "fill": row})


# ---- owner side: the accounts, which are NOT the lab's property ----
#
# Deliberately not behind @lab_enabled. These accounts open /robot as well, so
# gating them on the lab switch meant that with the lab off the owner could
# not issue a credential for an unrelated page, the exact hole this pair of
# routes exists to close. @owner_required is the real protection here and it
# does not depend on any switch.
@app.route("/api/access/users", methods=["GET", "POST"])
@owner_required
def api_access_users():
    """Mint an account, or list them. The only door: there is no signup route
    anywhere in this file, and no reset."""
    if request.method == "GET":
        return jsonify({"ok": True, "users": LAB.public_users()})
    d = request.get_json(force=True, silent=True) or {}
    # role defaults to reader inside mint_user. Handing out write access has
    # to be asked for explicitly, it is not something to get by omission.
    password, err = LAB.mint_user(d.get("username"), d.get("note"), d.get("role"))
    if err:
        return jsonify({"ok": False, "error": err}), 400
    return jsonify({"ok": True, "username": (d.get("username") or "").strip().lower(),
                    "role": (d.get("role") or "reader").strip().lower(),
                    "password": password,
                    "notice": "Shown once. It is stored only as a hash, nobody, "
                              "including you, can read it back. Lost means reissue."})


@app.route("/api/access/users/<username>/revoke", methods=["POST"])
@owner_required
def api_access_revoke(username):
    d = request.get_json(force=True, silent=True) or {}
    ok = LAB.revoke(username, d.get("revoked", True))
    return (jsonify({"ok": True}) if ok
            else (jsonify({"ok": False, "error": "No such user."}), 404))


@app.route("/api/lab/locks/<kind>/<key>", methods=["POST"])
@lab_enabled
@owner_required
def api_lab_lock(kind, key):
    """The owner's half of the unlock. The record's half is checked inside
    set_lock, so this route cannot open something the results have not
    earned, and cannot open Kalshi at all."""
    if kind not in ("venue", "strategy"):
        return jsonify({"ok": False, "error": "Unknown kind."}), 400
    d = request.get_json(force=True, silent=True) or {}
    ok, err = LAB.set_lock(kind, key, bool(d.get("locked", True)))
    if not ok:
        return jsonify({"ok": False, "error": err}), 400
    return jsonify({"ok": True, "board": LAB.board()})


@app.route("/road-trip")
def road_trip_page():
    """Free tool: long-haul planner, fuel, food, rest areas and viewpoints found
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
    """Free tool: a 2-question data-collection flow, search a place, say how
    long you stayed, that feeds the same community pipeline as the planner."""
    return send_file(os.path.join(BASE_DIR, "favorite-place.html"))


@app.route("/factor-clock")
def factor_clock_page():
    """Free tool: the Factor Clock, an honest prediction engine (free founding beta)."""
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


# ======================================================================
#  THE LINE BETWEEN THE TWO BOOKS
#
#  Two bodies of place data exist and they must never mix:
#
#    PUBLIC  destinations.json, a book anyone can read. Only public places.
#    PRIVATE reservations.json, where customers are actually driven. Any
#            address at all, including someone's home, because that is the
#            service. Reachable only by the owner, or the driver assigned
#            to that ride.
#
#  A customer's right to be driven to a private address, and a stranger's
#  right not to have their home published, are both absolute. They do not
#  trade against each other, they live in different files.
#
#  Everything below exists so that separation survives the next feature.
#  It is enforced three ways, deliberately overlapping:
#
#    1. CLASSIFY ONCE, AT THE DOOR.  /api/destinations/add decides public or
#       private while it still has the geocoder's tags, and stamps the verdict
#       on the record. Reads never re-derive it, by then the tags are gone
#       and only the name is left, which is a weaker signal.
#    2. ONE DOOR OUT.  public_book() is the only way a route may read the
#       book. It drops anything not stamped public, and falls back to the
#       name test for records written before stamping existed.
#    3. A TEST THAT FAILS THE NEXT MISTAKE.  test_private_places.py asserts
#       no route opens the file directly. /api/geography was written after
#       the filter and read straight past it; that is the failure mode this
#       catches, without anyone having to remember.
# ======================================================================

VISIBILITY_PUBLIC = "public"


def _book_raw():
    """The whole file, withheld records included. Writers only.

    Routes must call public_book() instead, this is the raw store and has no
    idea what may be shown to anyone."""
    try:
        with open(_data_path("destinations.json")) as f:
            d = json.load(f)
        return d if isinstance(d, dict) else {"cities": {}, "entries": []}
    except Exception:
        return {"cities": {}, "entries": []}


def _may_publish(entry):
    """One record's verdict, trusting the stamp made when the tags were known.

    A record stamped at write time is believed. A record written before
    stamping existed gets the only test its stored fields still support: is
    the name a street address? Nothing worth visiting is called "412 Maple
    St", and this fails in the safe direction, at worst a genuine place with
    a number for a name waits until someone adds it under its real name."""
    vis = (entry.get("visibility") or "").strip().lower()
    if vis:
        return vis == VISIBILITY_PUBLIC
    return not _ADDRESS_LIKE.match(entry.get("name") or "")


# ---------- the free guide earns: demand counted, doors routed ----------
#
# Sean's order of operations, from ATTRACTION_COMMISSIONS.md: the guide
# stays free, the demand gets COUNTED, and the counted demand is what the
# affiliate applications and trade desks get shown. So every outbound door
# goes through /go, which counts and then forwards, and the audio guides
# report a play the same way. Counts are anonymous totals per attraction
# per day, in the same self-hosted spirit as the traffic panel: no reader
# profiles, no third-party pixels, nothing about WHO, only HOW MANY.
GUIDE_DEMAND_PATH = _data_path("guide_demand.json")
EXPEDIA_AFFILIATE_ID = os.environ.get("EXPEDIA_AFFILIATE_ID", "").strip()


def _demand_bump(kind, key, city=""):
    try:
        with _LOCK:
            d = _load(GUIDE_DEMAND_PATH)
            if not isinstance(d, dict):
                d = {}
            day = datetime.date.today().isoformat()
            k = "%s|%s" % (kind, key)
            row = d.setdefault(k, {"kind": kind, "key": key, "city": city,
                                   "total": 0, "days": {}})
            row["total"] = int(row.get("total") or 0) + 1
            days = row.setdefault("days", {})
            days[day] = int(days.get(day) or 0) + 1
            if len(days) > 120:
                for old in sorted(days)[:-120]:
                    days.pop(old, None)
            _save(GUIDE_DEMAND_PATH, d)
    except Exception:
        pass                    # a lost count must never cost a reader a page


def _dest_by_slug(slug):
    for e in public_book().get("entries") or []:
        if e.get("slug") == slug:
            return e
    return None


@app.route("/go/stay")
def go_stay():
    """Hotels as a resource: a stay search near the attraction in hand.

    The redirect target is built HERE, from our own template, never from
    anything in the query, so this can never be an open redirect. The
    affiliate id joins the URL the day Expedia approves the account; until
    then the door works, and the demand it proves is the application."""
    from urllib.parse import quote_plus
    near = _no_tags((request.args.get("near") or "").strip())[:80]
    city = _no_tags((request.args.get("city") or "").strip())[:20]
    _demand_bump("stay", near or city or "anywhere", city)
    url = "https://www.expedia.com/Hotel-Search?destination=" + quote_plus(near or city or "")
    if EXPEDIA_AFFILIATE_ID:
        url += "&affcid=" + quote_plus(EXPEDIA_AFFILIATE_ID)
    return redirect(url, code=302)


@app.route("/go/tickets/<slug>")
def go_tickets(slug):
    """The admission door: counts, then forwards to the venue's own ticket
    page. When an affiliate programme approves, the registry's tickets_url
    becomes the deep link and this route needs no change at all."""
    e = _dest_by_slug(slug)
    url = (e or {}).get("tickets_url") or ""
    if not e or not url.startswith("https://"):
        return Response("No ticket door for that one.", status=404, mimetype="text/plain")
    _demand_bump("tickets", slug, e.get("city") or "")
    return redirect(url, code=302)


@app.route("/api/guide-demand/beacon", methods=["POST"])
def api_guide_demand_beacon():
    """A play or a plan, counted. Anonymous by construction."""
    data = request.get_json(force=True, silent=True) or {}
    kind = data.get("kind")
    key = _no_tags((data.get("key") or "").strip())[:80]
    if kind not in ("audio", "plan") or not key:
        return jsonify({"ok": False}), 400
    _demand_bump(kind, key, _no_tags((data.get("city") or "").strip())[:20])
    return jsonify({"ok": True})


@app.route("/api/guide-demand")
@owner_required
def api_guide_demand():
    """The owner's demand board: what the free guide is proving, ranked.
    This is the page to screenshot into an affiliate application."""
    d = _load(GUIDE_DEMAND_PATH)
    d = d if isinstance(d, dict) else {}
    rows = sorted(d.values(), key=lambda r: -int(r.get("total") or 0))
    return jsonify({"ok": True, "rows": rows[:200]})


def public_book():
    """The book as the world may see it. The only read path for routes."""
    d = _book_raw()
    d["entries"] = [e for e in d.get("entries") or [] if _may_publish(e)]
    return d


def _public_book_entries(entries):
    """Filter a list of entries already in hand. Prefer public_book()."""
    return [e for e in entries or [] if _may_publish(e)]


@app.route("/api/destinations")
def api_destinations():
    try:
        data = public_book()
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
                e["stars"] = r["avg"]           # community average, 1, 5
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


@app.route("/contrast-audit")
@owner_required
def contrast_audit_page():
    """Owner-only: loads every page and measures whether its text can be read.

    A stylesheet can set the site's ink to near-black while a page keeps its own
    dark panels, and nothing errors, the words are simply invisible. Only a
    rendered measurement catches that, so this renders them.
    """
    return send_file(os.path.join(BASE_DIR, "contrast-audit.html"))


@app.route("/api/geography")
def api_geography():
    """State → county → city, built from what has actually been discovered.

    The planner ships with three or four cities hard-coded. Every place a
    traveller searches for is filed with its state and county, so this returns
    the real, growing hierarchy, search Mount Rushmore once and South Dakota
    appears in the picker for everyone after you. Places recorded before this
    existed have no state and are simply left out rather than guessed at.
    """
    d = public_book()
    cities = d.get("cities", {})
    geo, seen = {}, {}
    for e in d.get("entries", []):
        state = _canon_region(e.get("state"))
        city = (e.get("city") or "").strip()
        if not (state and city):
            continue
        county = _canon_region(e.get("county")) or state
        # A district that is its own county would read "District of Columbia ›
        # District of Columbia". Name the city there instead, it is the same
        # ground, and saying it twice helps nobody.
        if county.lower() == state.lower():
            county = (e.get("city_label") or city).title()
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
    """What travelers have been discovering lately, newest first, worldwide, 
    the visible proof that the map grows by itself."""
    d = public_book()
    cities = d.get("cities", {})
    found = [e for e in d.get("entries", [])
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


# ---------- 💬 destination comments, the community's own guidebook ----------
# A place someone DISCOVERED by searching becomes an entry others can talk
# about: what it's really like, what to know before you go. Keyed city|name
# like every other community store. Free text, no account, so it is capped,
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
# We keep the MEDIAN, never the average, one person typing 999 must not move the
# recommendation, and we refuse to recommend anything until enough people have
# said it. No identities are stored: this is a list of durations, nothing else.
VISITS_PATH = _data_path("visit_times.json")
VISIT_MIN_N = 3          # below this we have an opinion, not a fact, stay quiet
GUIDE_MIN_N = 1          # a verified guide's endorsement stands on its own
VISIT_MAX_SAMPLES = 300  # per place; oldest fall off
# Up to three days: a national park, a festival or a ski trip is a real answer
# to "how long did you stay", and capping it at ten hours quietly forced anyone
# who stayed longer to understate it, which then taught the next traveller too
# short a visit.
VISIT_MIN_M, VISIT_MAX_M = 5, 4320


def _visit_key(city, name):
    return "%s|%s" % ((city or "").strip().lower(), (name or "").strip().lower())


def _visit_role(guide_code):
    """A guide's judgment is worth more than a stranger's, but only a REAL guide's.
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
# Visitors rate a place 1, 5 stars anywhere in the planner; we keep the average and
# the count. No fabricated stars, a place shows stars only once someone rates it.
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
        return jsonify({"ok": False, "error": "need a place and 1, 5 stars"}), 400
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
    the sample floor are returned, the rest are still listening."""
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
    """Someone set how long they want at a place, remember it for everyone."""
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

    The map's own data can only ever say what KIND of thing something is, "a
    museum in Boston", which is true and useless. Wikipedia says what it is and
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


# One place, one name. Geocoders and people spell the district several ways,
# and each spelling would otherwise open its own entry in the pickers, the
# duplicate everyone notices, sitting next to the actual state of Washington.
_REGION_ALIASES = {
    "washington dc": "District of Columbia",
    "washington d.c.": "District of Columbia",
    "washington, d.c.": "District of Columbia",
    "washington, dc": "District of Columbia",
    "d.c.": "District of Columbia",
    "dc": "District of Columbia",
    "district of columbia": "District of Columbia",
}


def _canon_region(name):
    n = " ".join(str(name or "").strip().split())
    return _REGION_ALIASES.get(n.lower(), n)


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
    state, county = _canon_region(state), _canon_region(county)
    # Outside the US a "state" is often absent; the country is the honest
    # top level there, and saying so beats filing it under nothing.
    if not state and country:
        state = country
    if not county:
        county = state
    return _no_tags(state)[:60], _no_tags(county)[:60], _no_tags(country)[:60]


def _describe_osm(meta):
    """Write an honest one-line description of a place from the MAP'S OWN data.

    Nothing here is invented, the words come from OpenStreetMap's classification
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
# residential buildings and plots, if the map says a point is one of these, it
# does not go in a public book, no matter who searched for it.
_RESIDENTIAL_TYPES = {
    "house", "houses", "residential", "apartments", "apartment", "detached",
    "semidetached_house", "semi_detached_house", "terrace", "terraced_house",
    "bungalow", "dormitory", "farmhouse", "static_caravan", "houseboat",
    "cabin", "hut", "trailer", "mobile_home", "annexe", "ger",
}
# A point classified under one of these is a public thing, a park, a museum, a
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
    # than the name of anything, "412 Maple St" is where someone lives, not a
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
    Planner search is remembered by the site, it joins the city's planner list
    for every future visitor AND appears in the Destination Book (tagged
    'community'). Deduped by name+city; capped so the book can't be flooded.

    Private homes are refused. Anyone can type any address into the planner and
    be driven there, that is the whole service, but a place only becomes a
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
        # RAW, not public_book(): this rewrites the whole file, and filtering
        # here would quietly delete every withheld record on the next save.
        d = _book_raw()
        # THE BOOK GROWS WORLDWIDE. A city we have never seen before is not an
        # error to be swept into "Other", it is a new chapter. The first traveler
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
        # dedupe: the site already remembers this place, but a re-search is a chance
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
               # Stamped here, while the geocoder's tags are still in hand. By
               # read time all that survives is a name, which is a weaker test.
               "visibility": VISIBILITY_PUBLIC,
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
    """Plateau Strategy Deflator, research-project page + notify list (no offering)."""
    return send_file(os.path.join(BASE_DIR, "deflator.html"))


@app.route("/api/deflator/waitlist", methods=["POST"])
def api_deflator_waitlist():
    """Notify-only list stored locally in deflator_waitlist.json, emails get one
    update when verified results publish. No product, no funds, no claims.

    CLOSED while the Deflator is private: the page is owner-only, so this endpoint
    must not keep accepting signups from anyone who kept the URL. Existing stored
    emails are untouched. Re-open together with the page."""
    if not session.get("owner"):
        return Response("Not Found", status=404, mimetype="text/plain")
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


# ---------------------------------------------------------------------------
# 🔒 CLOSED 2026-08-08 [nine-lens council, three lenses independently, both
# skeptics confirming high severity each time].
#
# These five routes had NO authentication of any kind. Verified by execution,
# not by reading: a client with no cookies and no session POSTed to
# /api/setup/square and got 200, after which the running process held the
# caller's token. What a stranger on the internet could do:
#
#   * /api/setup/twilio     , repoint SMS at their own Twilio account.
#     notify._twilio_cfg() reads os.environ on every call and the service runs
#     --workers 1, so one POST poisons the whole process. Every ride-offer text
#     after that, pickup address, dropoff, date, time, flight number, fare, 
#     lands in a stranger's logs, and driver dispatch stops arriving here.
#   * /api/setup/twilio/test, send SMS to a number THEY choose, on our live
#     credentials, unauthenticated and unthrottled. Textbook toll fraud billed
#     to us, and a fast route to Twilio suspending the account, which takes
#     driver dispatch down with it.
#   * /api/setup/square     , overwrite the payment token. Not a redirect of
#     money: SQUARE_LOCATION_ID is read-only everywhere, so a foreign token
#     paired with our location id is simply rejected and square_client._bill
#     swallows the error. The real outcome is a SILENT BILLING OUTAGE, 
#     bookings keep succeeding, invoices quietly stop going out.
#   * /api/setup/status     , reports which integrations are configured.
#
# owner_required already existed and already guards ~48 lower-value routes;
# these four had simply fallen out of the pattern, and nothing global catches
# it, app.py has no before_request at all. OWNER_ONLY_PATHS looks like a
# control but only feeds robots.txt, where it advertises /setup rather than
# protecting it.
# ---------------------------------------------------------------------------
@app.route("/setup")
@owner_required
def setup_page():
    return send_file(os.path.join(BASE_DIR, "setup.html"))


@app.route("/api/setup/status")
@owner_required
def api_setup_status():
    return jsonify({
        "connected": bool(os.environ.get("SQUARE_ACCESS_TOKEN") and os.environ.get("SQUARE_LOCATION_ID")),
        "has_token": bool(os.environ.get("SQUARE_ACCESS_TOKEN")),
        "location_id": os.environ.get("SQUARE_LOCATION_ID", ""),
        "env": os.environ.get("SQUARE_ENV", "sandbox"),
    })


@app.route("/api/setup/twilio", methods=["POST"])
@owner_required
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
@owner_required
def api_setup_twilio_test():
    """Send a test SMS to OUR OWN number using the saved Twilio credentials.

    The destination is no longer taken from the request. It used to be, which
    made this an unauthenticated endpoint that sent a message to any number a
    caller named, on our live account, someone else's phone, billed to us, as
    fast as the server would loop. Owner-only closes the door; ignoring the
    caller's number means that even a stolen owner session cannot turn this
    into a way to text strangers. A test message only has to reach the person
    running the test, and they are the one number we already know."""
    to = (os.environ.get("OWNER_PHONE") or os.environ.get("DRIVER_PHONE") or "").strip()
    if not to:
        return jsonify({"ok": False,
                        "error": "Set OWNER_PHONE or DRIVER_PHONE first, the test "
                                 "sends only to your own number."}), 400
    result = notify.send_sms(to, "Plateau Strategy Solution Lab: test message - your driver SMS dispatch is LIVE. Reply YES when a real ride comes in.")
    return jsonify({"ok": result == "sent", "result": result, "to": to})


@app.route("/api/setup/square", methods=["POST"])
@owner_required
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


_DEBT_CACHE = {"amount": None, "as_of": None, "per_sec": None, "ts": 0}
DEBT_WINDOW_ROWS = 40          # ~two months of business days


def _debt_per_sec(rows):
    """How fast the debt has actually been growing, in dollars per second.

    The clock on the Finance tab ticks between fetches, and it used to tick at
    a rate somebody typed in, the comment beside it said ~$90k/sec while the
    code did ~$62.5k/sec, so the two had already drifted apart from each other,
    never mind from the debt. Measuring it from the same rows that supply the
    figure means the ticker cannot disagree with its own source.

    Returns None if the window cannot support a rate. Negative is returned as
    zero, not as invented growth: the debt genuinely falls sometimes (tax
    season), and a clock that has stopped is honest where one that climbs
    anyway is not."""
    if len(rows) < 2:
        return None
    try:
        new, old = rows[0], rows[-1]
        d1 = datetime.date.fromisoformat(new["record_date"])
        d0 = datetime.date.fromisoformat(old["record_date"])
        days = (d1 - d0).days
        if days <= 0:
            return None
        delta = float(new["tot_pub_debt_out_amt"]) - float(old["tot_pub_debt_out_amt"])
        return max(0.0, delta / (days * 86400.0))
    except Exception:
        return None


@app.route("/api/national-debt")
def api_national_debt():
    """The real US national debt (total public debt outstanding) from the U.S.
    Treasury's public 'Debt to the Penny' API. Cached 6h. Proxied server-side so
    the browser never hits a CORS wall.

    Returns the growth rate alongside the figure. 'Debt to the Penny' is a
    DAILY close published a business day behind, so a browser that seeds a
    live-looking ticker with it is starting from a stale number, on a Monday
    it is showing Friday's. With as_of and per_sec the page can carry the
    figure forward by the time that has actually elapsed instead."""
    import requests as _rq
    if _DEBT_CACHE["amount"] and time.time() - _DEBT_CACHE["ts"] < 21600:
        return jsonify({"ok": True, "amount": _DEBT_CACHE["amount"],
                        "as_of": _DEBT_CACHE["as_of"],
                        "per_sec": _DEBT_CACHE["per_sec"], "cached": True})
    try:
        r = _rq.get(
            "https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_to_penny",
            params={"sort": "-record_date", "page[size]": str(DEBT_WINDOW_ROWS),
                    "fields": "record_date,tot_pub_debt_out_amt"}, timeout=12)
        rows = r.json().get("data") or []
        if not rows:
            return jsonify({"ok": False, "error": "no rows"}), 502
        amount = float(rows[0]["tot_pub_debt_out_amt"])
        as_of = rows[0].get("record_date")
        per_sec = _debt_per_sec(rows)
        _DEBT_CACHE.update({"amount": amount, "as_of": as_of,
                            "per_sec": per_sec, "ts": time.time()})
        return jsonify({"ok": True, "amount": amount, "as_of": as_of,
                        "per_sec": per_sec})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 502


# ---------- give back: gifts to reduce the public debt ----------
# We never touch a cent of this money. Donors give DIRECTLY to the U.S. Treasury
# (Pay.gov "Gifts to Reduce the Public Debt", or a check to the Bureau of the
# Fiscal Service). This ledger only COUNTS what people tell us they gave, so the
# green zero on the Finance tab can move. It is self-reported by design, the
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
    """Someone gave at Treasury and is telling us so, move the zero.

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
        return jsonify({"ok": False, "error": "That amount looks like a typo, please check it."}), 400

    rec = {
        "id": _next_id(_giveback_all(), "GIFT"),
        "name": (str(d.get("name") or "").strip()[:60] or "Anonymous"),
        "amount": amount,
        "note": str(d.get("note") or "").strip()[:140],
        "at": datetime.datetime.now().isoformat(timespec="seconds"),
        "self_reported": True,          # always, see the module note above
    }
    with _LOCK:
        gifts = _giveback_all()
        gifts.append(rec)
        _save(GIVEBACK_PATH, gifts)
        total = sum(float(g.get("amount") or 0) for g in gifts)
    return jsonify({"ok": True, "entry": rec, "total": round(total, 2), "count": len(gifts)})


# ---------- guide handoff (Phase 3 offer capture) ----------
# When a traveler chooses "prefer my trip to a guide", or a guide lists a route
# "for sale", the request lands here. This is the OFFER object, the first slice of
# the ding handshake. It captures the plan + who to reach; the accept/decline/expire
# loop (routed to a specific guide) is the next build. No money moves here.
GUIDE_OFFERS_PATH = _data_path("guide_offers.json")


def _platform_fee():
    """The site's revenue for connecting a customer to a guide or driver-guide.
    Owner's business decision, set in .env, sane default here."""
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
            # a platform fee is billed to the trip, this is the website's revenue
            "platform_fee": _platform_fee() if mode in ("prefer", "hire") else 0.0,
            "created_at": datetime.datetime.now().isoformat(timespec="seconds"),
        }
        offers.append(rec)
        _save(GUIDE_OFFERS_PATH, offers)

    # A route offered for sale is a product, so it belongs in the shop window
    # beside the hand-written ones, not only in the owner's inbox, which is
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
                            ("A guided version of this route, " + ", ".join(s["name"] for s in stops[:4])
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
            _push_owner_alert("driverguide_request", "🚕 %s wants to hire a driver-guide for a %s trip, reach %s (%s)."
                              % (rec["name"], where, rec["contact"], rec["id"]))
        else:
            _push_owner_alert("guide_request", "🙋 %s wants a guide for a %s trip, reach %s (%s)."
                              % (rec["name"], where, rec["contact"], rec["id"]))
    except Exception:
        pass

    return jsonify({"ok": True, "mode": mode, "ref": rec["id"], "status": rec["status"],
                    "platform_fee": rec["platform_fee"],
                    "public_trip_id": rec.get("public_trip_id")})


ROBOTAXI_PATH = _data_path("robotaxi_interest.json")


@app.route("/api/robotaxi-interest", methods=["POST"])
def api_robotaxi_interest():
    """Robotaxi is UNDER DEVELOPMENT, this only counts demand, never books a ride.
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
        k = r.get("city_label") or r.get("city") or ", "
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
    return ("QUOTE REQUEST %s, %s trip by %s for %s. %s. When: %s %s. Needs pricing." % (
        res.get("id"), label, who, c.get("name", ""), desc,
        t.get("date", ""), t.get("time", "")))


# ---------- distance-based fare (destination rides) ----------
# The destination drives the price: fare = base + per-mile × drive distance.
# Rates are the owner's business decision, set in .env, sane defaults here.
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


# The flat airport fare, and the radius it holds inside. Stated on the site
# as "$75 flat to Sea-Tac" with no distance attached, which is a promise the
# fare cannot keep from ninety miles out, so the boundary is written down
# here, in the one place that prices anything, rather than implied.
AIRPORT_FLAT_USD = 75.0
AIRPORT_FLAT_RADIUS_MI = 30.0


def _airport_or_distance_fare(miles, to_airport):
    """What a ride costs, and why.

    Returns (fare, basis) so a caller can say which rule applied rather than
    just showing a number, a rider who is told 75 dollars flat and then
    charged 112 has been surprised, and this whole business is built on the
    quote being the fare."""
    try:
        m = max(0.0, float(miles))
    except (TypeError, ValueError):
        return (None, None)
    if to_airport and m <= AIRPORT_FLAT_RADIUS_MI:
        return (AIRPORT_FLAT_USD, "airport_flat")
    return (_distance_fare(m), "distance")


@app.route("/api/quote")
def api_quote():
    """Price a trip before anyone commits to it.

    The booking page used to ask for pickup and drop-off and say nothing
    about cost until a human answered. Same constants as a real booking,
    deliberately: a calculator that computes its own answer is a second
    price, and two prices is exactly what "the quote is the fare" promises
    not to do."""
    try:
        miles = float(request.args.get("miles", ""))
    except (TypeError, ValueError):
        return jsonify({"ok": False, "error": "miles required"}), 400
    if miles < 0 or miles > 3000:
        return jsonify({"ok": False, "error": "miles out of range"}), 400
    to_airport = (request.args.get("airport") or "").lower() in ("1", "true", "yes")
    fare, basis = _airport_or_distance_fare(miles, to_airport)
    if fare is None:
        return jsonify({"ok": False, "error": "could not price that"}), 400
    return jsonify({
        "ok": True, "fare": fare, "basis": basis,
        "miles": round(miles, 1),
        "flat_radius_mi": AIRPORT_FLAT_RADIUS_MI,
        "flat_usd": AIRPORT_FLAT_USD,
        "base_fare": _ride_base_fare(), "per_mile": _ride_per_mile(),
    })


def _create_reservation(data, agent=None, self_driver=None):
    """Build, invoice, persist and notify a reservation. Returns the record.
    If self_driver is set, this is a Driver-Agent self-referral: the driver both
    referred the customer AND will drive the trip, so the reservation is pre-assigned
    to them and flagged self_service (they keep the full fare, commission + trip)."""
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
        dropoff = {"cruise": "Cruise terminal", "tour": "Round trip, see itinerary",
                   "custom": "As arranged"}.get(trip_type, "Round trip")

    # distance the trip covers (miles), for a destination ride it sets the price
    try:
        distance_mi = round(float(data.get("distance_mi")), 2) if data.get("distance_mi") not in (None, "") else None
    except (TypeError, ValueError):
        distance_mi = None

    if quote_requested:
        fare = 0.0                       # priced later by the owner
    elif trip_type == "destination" and distance_mi is not None:
        # the destination drives the price, recompute server-side so the rate is
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
    # rich, trip-type-specific details, only stored when the agent provided them
    for k in ("title", "description", "itinerary", "cruise_line", "ship",
              "sailing_date", "return_date", "return_time"):
        v = (data.get(k) or "").strip()
        if v:
            trip[k] = v
    if data.get("duration_hours"):
        trip["duration_hours"] = data.get("duration_hours")
    # a destination ride is filed under where it concludes, the destination and its
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
        # already assigned to its driver, no need to broadcast it.
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
    """Agent 'Book a Trip' API, the in-portal form posts here. Handles any
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
    the fare, not the customer's phone, email or full name. Contact details
    are released by /claim, to the one driver who actually took the ride."""
    out = dict(r)
    name = ((r.get("client") or {}).get("name") or "").strip()
    out["client"] = {"name": (name.split(" ")[0] if name else "Client")}
    # The agent block used to pass through whole, and it carries `code`, the
    # agent's entire sign-in credential. Agent login needs only that code and a
    # last name, and this board printed both, to anyone, with no session. The
    # chain the council reproduced: read the board, log in as the agent, change
    # their payout email, request a payout. The owner then clicks Pay on a
    # request that looks legitimate and the money goes to whoever read the
    # board. Nothing anywhere signals that the address changed.
    #
    # Not popped: renter.html renders "Referred by {agent.name}" on open-board
    # cards, so removing the block breaks the page. Keep the name, drop
    # everything that opens a door.
    if isinstance(r.get("agent"), dict):
        out["agent"] = {"name": (r["agent"].get("name") or "").strip()}
    out["contact_hidden"] = True
    return out


@app.route("/api/reservations")
def api_reservations():
    """Reservations, scoped to who is asking.

    Owner  -> everything, in full.
    Driver -> their own rides in full (they have to contact the customer),
              plus the open board with contact details withheld.
    Anyone else -> the open board only, contact details withheld.

    This endpoint used to return every reservation, customer names, phones
    and addresses, to anyone who requested it. The first fix redacted the
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
    # driver portal's URL but is now ignored for access, a driver who is not
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
    the reservation in full, so anyone who guessed a driver id (they run
    RTR_0001, RTR_0002, ...) could claim someone else's ride and read the
    customer's name, email, phone and address out of the response."""
    data = request.get_json(force=True, silent=True) or {}
    renter_id = (session.get("renter_id") or "").strip()
    if not renter_id:
        return jsonify({"ok": False, "auth_required": True,
                        "error": "Please sign in before accepting rides."}), 401
    renter = next((x for x in _load(RENTERS_PATH) if x.get("id") == renter_id), None)
    if not renter:
        return jsonify({"ok": False, "error": "Unknown renter, please register first."}), 400
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
    # First claim won, tell the other offered drivers the ride is taken.
    notify.sms_ride_taken(claimed, renter, _load(RENTERS_PATH))
    return jsonify({"ok": True, "reservation": claimed})


@app.route("/api/renters/<rid>/refer", methods=["POST"])
@renter_self_or_owner
def api_renter_refer(rid):
    """Driver-Agent self-referral. A driver met a customer who needs a ride, refers
    them here, and drives the trip themselves, so they earn BOTH the referral
    commission and the trip, i.e. the full fare. The reservation is created,
    invoiced to the customer, and pre-assigned to this driver."""
    data = request.get_json(force=True, silent=True) or {}
    renter = next((x for x in _load(RENTERS_PATH) if x.get("id") == rid), None)
    if not renter:
        return jsonify({"ok": False, "error": "Unknown driver, please sign in again."}), 400
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
@owner_required
def api_accept(rid):
    """Legacy manual-assign endpoint (kept for compatibility).

    Owner-gated: it returned the full reservation, with the customer's name,
    phone and address, to anyone who POSTed a guessable id, and let them
    reassign the ride. Assignment is a dispatch action."""
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


def _twilio_signature_ok():
    """Is this really Twilio, or somebody typing curl?

    The handler below identifies the driver purely by the "From" field, and
    the first YES claims the ride. Without this check anyone could POST that
    form with a driver's number and take rides in their name, the phone
    number is not a secret, drivers hand it out, and it is printed in the
    panel. Twilio signs every request; verifying the signature is the only
    thing that makes "From" mean anything.

    HMAC-SHA1 over the full URL with the POST fields appended in sorted order,
    which is Twilio's scheme, not a choice made here.

    Fails CLOSED when no auth token is configured. If Twilio is not set up
    then nothing legitimate is calling this, and answering an unsigned request
    would be answering the only kind that can arrive."""
    token = (os.environ.get("TWILIO_AUTH_TOKEN") or "").strip()
    if not token:
        return False
    sig = request.headers.get("X-Twilio-Signature") or ""
    if not sig:
        return False
    # Behind Render's proxy request.url says http; Twilio signed the https URL.
    url = request.url.replace("http://", "https://", 1)
    payload = url + "".join(k + request.form[k] for k in sorted(request.form))
    want = base64.b64encode(
        hmac.new(token.encode(), payload.encode("utf-8"), hashlib.sha1).digest()).decode()
    return hmac.compare_digest(want, sig)


@app.route("/sms/reply", methods=["POST"])
def sms_reply():
    """Twilio webhook: a driver replies YES to claim a ride by text.
    First YES wins (same atomic claim as the panel). Point Twilio's
    'A message comes in' webhook at https://<public-url>/sms/reply."""
    from flask import Response as _Resp
    if not _twilio_signature_ok():
        return Response("", status=403, mimetype="text/plain")
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

    # This driver replied fastest and won, tell the other offered drivers it's taken.
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
                            "error": "Pickup is less than 12 hours away, this ride can no longer be given up online. Call dispatch immediately so we can cover it."}), 403
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
    return jsonify({"ok": False, "error": "Reservation not found, check the confirmation number."}), 404


@app.route("/api/reservations/<rid>/complete", methods=["POST"])
@owner_required
def api_complete(rid):
    # Owner-gated: it returned the full reservation with customer PII and let
    # anyone mark any ride complete by guessing a sequential id. Completion is
    # a dispatch action.
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
    upload gets a unique name (timestamp + random) so nothing is ever overwritten, 
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
    """Auto-detect compliance issues from LIVE data, the things the system can
    actually see a driver doing (or not doing) against the Driver Agreement.
    Each: {kind, title, detail, severity[high|medium|low], ref?}."""
    rid = renter.get("id")
    out = []
    st = _contract_status(rid).get("status")
    if st == "unsigned":
        out.append({"kind": "agreement", "title": "Driver Agreement not signed", "severity": "high",
                    "detail": "Driving requires a signed, current Driver Agreement, it has not been signed."})
    elif st == "outdated":
        out.append({"kind": "agreement", "title": "Driver Agreement out of date", "severity": "high",
                    "detail": "The agreement was updated to a new version, the current one must be re-signed."})
    ins = _insurance_status(renter)
    if ins.get("state") == "MISSING":
        out.append({"kind": "insurance", "title": "No proof of insurance on file", "severity": "high",
                    "detail": "A valid, current proof of insurance is required at all times while driving."})
    elif ins.get("state") == "EXPIRED":
        out.append({"kind": "insurance", "title": "Insurance expired", "severity": "high",
                    "detail": "The policy expired %s day(s) ago. A current policy must be uploaded immediately." % abs(ins.get("days_left") or 0)})
    elif ins.get("state") == "EXPIRING":
        out.append({"kind": "insurance", "title": "Insurance expiring soon", "severity": "low",
                    "detail": "The policy expires in %s day(s), renew before it lapses." % (ins.get("days_left") or 0)})
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
        return jsonify({"ok": False, "error": "Enter your birthday as DDMMYYYY (e.g. 07031990), this is your login pass."}), 400
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
        return jsonify({"ok": False, "error": "That policy is already expired, please upload current insurance."}), 400
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
                      "%s policy, expires %s" % (provider or "Insurance", exp.isoformat()),
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
    name, and that signature is what unlocks accepting rides."""
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
        return jsonify({"ok": False, "error": "Unknown driver, please sign in first."}), 400
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
@owner_required
def api_contract_roster():
    """Owner view: every driver's signing status for the current version.

    Owner-gated because it returns every driver's name and phone. Without the
    gate it read out the whole roster to anyone who asked, which is exactly the
    kind of leak the audit was for."""
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


# ---------- professionals & their opinions ----------
PROS_PATH = _data_path("pros.json")
OPINIONS_PATH = _data_path("opinions.json")
PLATFORM_FEE_PCT = 0.20


def _pro_required(fn):
    @wraps(fn)
    def wrapper(*a, **k):
        if not session.get("pro_id"):
            return jsonify({"ok": False, "auth_required": True,
                            "error": "Sign in with your professional code."}), 401
        return fn(*a, **k)
    return wrapper


def _find_pro(pid):
    for p in _load(PROS_PATH):
        if p.get("id") == pid:
            return p
    return None


def _public_pro(p):
    """What anyone may see about a professional. Never the contact details, 
    those belong to the platform until a sale happens."""
    return {"id": p.get("id"), "name": p.get("name"), "firm": p.get("firm"),
            "trade": p.get("trade"), "trade_label": p.get("trade_label"),
            "license_type": p.get("license_type"), "state": p.get("state"),
            "verified": bool(p.get("verified")), "joined_at": p.get("joined_at")}


@app.route("/api/pros/register", methods=["POST"])
def api_pro_register():
    """Apply for a professional account.

    An account is created immediately but starts UNVERIFIED: it can be signed
    into and opinions can be drafted, but nothing publishes until the licence
    is checked by hand. That order matters, asking someone to wait before they
    can even look loses them, and publishing an unchecked licence is the one
    mistake this platform cannot afford.
    """
    d = request.get_json(force=True, silent=True) or {}
    name = (d.get("name") or "").strip()
    trade = (d.get("trade") or "").strip().lower()
    if not name or not trade:
        return jsonify({"ok": False, "error": "Name and trade are required."}), 400
    store = _load_professions()
    with _LOCK:
        pros = _load(PROS_PATH)
        if not isinstance(pros, list):
            pros = []
        pro = {
            "id": _next_id(pros, "PRO", datestamp=False),
            "code": secrets.token_hex(4).upper(),
            "name": name,
            "firm": (d.get("firm") or "").strip(),
            "email": (d.get("email") or "").strip(),
            "trade": trade,
            "trade_label": (store.get(trade, {}) or {}).get("label") or trade.replace("-", " ").title(),
            "license_type": (d.get("license_type") or "").strip(),
            "license_number": (d.get("license_number") or "").strip(),
            "state": (d.get("state") or "").strip().upper()[:2],
            "hourly_usd": d.get("hourly_usd") or None,
            "verified": False,
            "joined_at": datetime.datetime.now().isoformat(timespec="seconds"),
        }
        pros.append(pro)
        _save(PROS_PATH, pros)
        # the trade now has somebody in it
        try:
            ps = _load_professions()
            rec = ps.setdefault(trade, {"slug": trade, "label": pro["trade_label"],
                                        "demand": 0, "ideas": [], "claimed_by": []})
            rec.setdefault("claimed_by", []).append(pro["id"])
            _save(_data_path("professions.json"), ps)
        except Exception:
            pass
    session["pro_id"] = pro["id"]
    return jsonify({"ok": True, "pro": pro,
                    "note": "Keep your code, it is how you sign in. "
                            "Your licence is checked by hand before anything you write publishes."})


@app.route("/api/pros/login", methods=["POST"])
def api_pro_login():
    code = ((request.get_json(force=True, silent=True) or {}).get("code") or "").strip().upper()
    for p in _load(PROS_PATH):
        if p.get("code") and p["code"].upper() == code:
            session["pro_id"] = p["id"]
            return jsonify({"ok": True, "pro": p})
    return jsonify({"ok": False, "error": "That code was not recognised."}), 404


@app.route("/api/pros/me")
@_pro_required
def api_pro_me():
    pro = _find_pro(session["pro_id"])
    if not pro:
        session.pop("pro_id", None)
        return jsonify({"ok": False, "error": "Account not found."}), 404
    mine = [o for o in _load(OPINIONS_PATH) if o.get("pro_id") == pro["id"]]
    earned = sum(o.get("sales", 0) * o.get("price_usd", 0) * (1 - PLATFORM_FEE_PCT) for o in mine)
    return jsonify({"ok": True, "pro": pro, "opinions": mine,
                    "sales": sum(o.get("sales", 0) for o in mine),
                    "earned_usd": round(earned, 2), "platform_fee_pct": PLATFORM_FEE_PCT})


@app.route("/api/pros/opinion", methods=["POST"])
@_pro_required
def api_pro_opinion():
    """Write an opinion once; it can be bought any number of times.

    This is the whole economic point, the professional's effort is fixed and
    their revenue is not. Price is theirs to set, in whole dollars.
    """
    d = request.get_json(force=True, silent=True) or {}
    title = (d.get("title") or "").strip()
    body = (d.get("body") or "").strip()
    if len(title) < 6 or len(body) < 120:
        return jsonify({"ok": False,
                        "error": "A title and at least a few paragraphs are required, "
                                 "this is sold as a document, not a comment."}), 400
    try:
        price = max(0, round(float(d.get("price_usd") or 0), 2))
    except Exception:
        price = 0
    pro = _find_pro(session["pro_id"])
    with _LOCK:
        ops = _load(OPINIONS_PATH)
        if not isinstance(ops, list):
            ops = []
        op = {
            "id": _next_id(ops, "OPN", datestamp=False),
            "pro_id": pro["id"], "pro_name": pro["name"], "trade": pro.get("trade"),
            "trade_label": pro.get("trade_label"),
            "title": title,
            "preview": body[:300].rstrip() + ("…" if len(body) > 300 else ""),
            "body": body,
            "price_usd": price,
            "tags": [t.strip().lower() for t in (d.get("tags") or []) if str(t).strip()][:8],
            "published": bool(d.get("published")) and bool(pro.get("verified")),
            "sales": 0,
            "created_at": datetime.datetime.now().isoformat(timespec="seconds"),
        }
        ops.append(op)
        _save(OPINIONS_PATH, ops)
    return jsonify({"ok": True, "opinion": op,
                    "published": op["published"],
                    "note": "" if op["published"] else
                            "Saved. It publishes once your licence is verified."})


@app.route("/api/pros")
@owner_required
def api_pros_list():
    """Everyone who has applied, newest first, the queue to check.

    Owner-only, and it carries the licence numbers, which is exactly why
    it is not public: the directory shows a name and a credential, never
    the number itself.
    """
    pros = _load(PROS_PATH)
    return jsonify({"ok": True, "count": len(pros), "pros": list(reversed(pros))})


@app.route("/api/pros/<pid>/verify", methods=["POST"])
@owner_required
def api_pro_verify(pid):
    """Mark a licence as checked, or withdraw that.

    Without this the whole board dead-ends: an account can be registered
    and an opinion can be written, but publishing requires `verified`, and
    nothing anywhere could set it. Every opinion would have sat as a
    private draft forever while the page said the work was for sale.

    Checking stays a human act. This records the outcome; it does not
    pretend to do the checking, because a licence number is verified
    against a state register by a person looking at it.
    """
    on = bool((request.get_json(force=True, silent=True) or {}).get("verified", True))
    with _LOCK:
        pros = _load(PROS_PATH)
        hit = None
        for p in pros:
            if p.get("id") == pid:
                p["verified"] = on
                p["verified_at"] = (datetime.datetime.now().isoformat(timespec="seconds")
                                    if on else None)
                hit = p
                break
        if not hit:
            return jsonify({"ok": False, "error": "No such professional."}), 404
        _save(PROS_PATH, pros)

        # Anything they wrote while unverified was held back. Verifying the
        # licence is what those drafts were waiting for, so release them, 
        # otherwise the professional has to notice and republish, and most
        # will simply assume the site swallowed their work.
        released = 0
        if on:
            ops = _load(OPINIONS_PATH)
            for o in ops:
                if o.get("pro_id") == pid and not o.get("published"):
                    o["published"] = True
                    released += 1
            if released:
                _save(OPINIONS_PATH, ops)

    return jsonify({"ok": True, "pro": _public_pro(hit), "released": released})


@app.route("/api/opinions")
def api_opinions_public():
    """Opinions on offer, preview and price only. The body is what is sold."""
    trade = (request.args.get("trade") or "").strip().lower()
    q = (request.args.get("q") or "").strip().lower()
    pros = {p["id"]: p for p in _load(PROS_PATH)}
    out = []
    for o in _load(OPINIONS_PATH):
        if not o.get("published"):
            continue
        if trade and o.get("trade") != trade:
            continue
        hay = (o.get("title", "") + " " + o.get("preview", "") + " " + " ".join(o.get("tags", []))).lower()
        if q and q not in hay:
            continue
        p = pros.get(o.get("pro_id"), {})
        out.append({"id": o["id"], "title": o["title"], "preview": o["preview"],
                    "price_usd": o["price_usd"], "trade": o.get("trade"),
                    "trade_label": o.get("trade_label"), "sales": o.get("sales", 0),
                    "by": _public_pro(p) if p else {"name": o.get("pro_name")}})
    out.sort(key=lambda o: -o["sales"])
    return jsonify({"ok": True, "count": len(out), "opinions": out})


PURCHASES_PATH = _data_path("purchases.json")


def _find_opinion(oid):
    for o in _load(OPINIONS_PATH):
        if o.get("id") == oid:
            return o
    return None


def _has_paid(oid, buyer_key):
    for b in _load(PURCHASES_PATH):
        if b.get("opinion_id") == oid and b.get("status") == "paid" \
                and b.get("buyer_key") == buyer_key:
            return b
    return None


def _buyer_key():
    """Who the buyer is, without making them hold an account.

    An anonymous long-lived cookie. Somebody who buys an opinion should be able
    to come back and read it tomorrow without a login they never asked for.
    """
    k = session.get("buyer_key")
    if not k:
        k = secrets.token_hex(16)
        session["buyer_key"] = k
    return k


@app.route("/api/opinions/<oid>/buy", methods=["POST"])
def api_opinion_buy(oid):
    """Buy one opinion. Charged through the same Square path as a booking."""
    d = request.get_json(force=True, silent=True) or {}
    name = (d.get("name") or "").strip()
    email = (d.get("email") or "").strip()
    if not name or not email:
        return jsonify({"ok": False, "error": "A name and email are required to send the invoice."}), 400
    op = _find_opinion(oid)
    if not op or not op.get("published"):
        return jsonify({"ok": False, "error": "That opinion is not available."}), 404

    key = _buyer_key()
    already = _has_paid(oid, key)
    if already:
        return jsonify({"ok": True, "already_paid": True, "purchase_id": already["id"]})

    price = float(op.get("price_usd") or 0)
    # The split, recorded at the moment of sale rather than worked out later.
    # Square takes its cut of the whole charge before anyone is paid, so the
    # platform's real margin is its fee MINUS processing, not its fee.
    fee = round(price * PLATFORM_FEE_PCT, 2)
    processing = round(price * 0.029 + 0.30, 2)
    to_pro = round(price - fee, 2)
    net = round(fee - processing, 2)

    invoice = None
    try:
        invoice = square_client.create_charge(
            {"name": name, "email": email, "phone": (d.get("phone") or "").strip()},
            price, "Professional opinion: " + op.get("title", "")[:60],
            "Written by %s, %s. One-time purchase; yours to keep." % (
                op.get("pro_name", ""), op.get("trade_label", "")))
    except Exception as e:
        invoice = {"ok": False, "error": str(e)[:160]}

    # An invoice that failed to raise is not a pending sale. Recording it as one
    # would put money in the ledger that nobody was ever asked for, and leave a
    # row that can never be reconciled because there is nothing at Square to
    # reconcile against.
    # square_client falls back to a MOCK invoice when SQUARE_ACCESS_TOKEN and
    # SQUARE_LOCATION_ID are absent. That is useful for developing against, and
    # dangerous in a ledger: a simulated invoice can never be reconciled, so a
    # "pending" row against it would sit there forever looking like money owed.
    # It is recorded as demo, and excluded from earnings.
    is_demo = isinstance(invoice, dict) and (
        invoice.get("mode") == "mock" or str(invoice.get("status", "")).upper() == "SIMULATED")

    inv_err = None
    if isinstance(invoice, dict) and not is_demo:
        if invoice.get("errors"):
            try:
                inv_err = invoice["errors"][0].get("detail") or str(invoice["errors"][0])
            except Exception:
                inv_err = "Square rejected the invoice."
        elif invoice.get("ok") is False:
            inv_err = invoice.get("error") or "Square rejected the invoice."
    if inv_err:
        return jsonify({"ok": False, "error": inv_err,
                        "hint": "Nothing was recorded, the invoice was never raised."}), 502

    with _LOCK:
        buys = _load(PURCHASES_PATH)
        if not isinstance(buys, list):
            buys = []
        rec = {
            "id": _next_id(buys, "BUY", datestamp=False),
            "opinion_id": oid, "opinion_title": op.get("title"),
            "pro_id": op.get("pro_id"), "buyer_key": key,
            "buyer_name": name[:80], "buyer_email": email[:120],
            "price_usd": price, "platform_fee_usd": fee,
            "processing_usd": processing, "to_professional_usd": to_pro,
            "platform_net_usd": net,
            "status": "demo" if is_demo else "pending",
            "invoice_id": (invoice or {}).get("id") or (invoice or {}).get("invoice_id"),
            "invoice_url": (invoice or {}).get("url") or (invoice or {}).get("public_url"),
            "created_at": datetime.datetime.now().isoformat(timespec="seconds"),
        }
        buys.append(rec)
        _save(PURCHASES_PATH, buys)

    return jsonify({"ok": True, "purchase": rec, "invoice": invoice, "demo": is_demo,
                    "note": ("Square is not connected, so no invoice was really sent and "
                             "nothing will be charged. Recorded as a demo sale and kept out "
                             "of earnings.") if is_demo else
                            ("Pay the invoice and the opinion unlocks for you. Nothing is "
                             "charged here, the invoice comes from Square.")})


@app.route("/api/opinions/<oid>/read")
def api_opinion_read(oid):
    """The body, only for someone who has paid for it.

    This is the single most important gate on the platform. The preview and the
    price are public; the document is the product. If this leaks, there is
    nothing to sell.
    """
    op = _find_opinion(oid)
    if not op or not op.get("published"):
        return jsonify({"ok": False, "error": "Not available."}), 404
    paid = _has_paid(oid, _buyer_key())
    if not paid:
        return jsonify({"ok": False, "locked": True,
                        "preview": op.get("preview", ""),
                        "price_usd": op.get("price_usd", 0),
                        "error": "This opinion has not been purchased on this device."}), 402
    return jsonify({"ok": True, "title": op.get("title"), "body": op.get("body"),
                    "by": op.get("pro_name"), "trade": op.get("trade_label"),
                    "purchased_at": paid.get("paid_at") or paid.get("created_at")})


@app.route("/api/purchases/reconcile", methods=["POST"])
@owner_required
def api_purchases_reconcile():
    """Ask Square which invoices are actually paid, and unlock those.

    Square invoices are paid out of band, a link in an email, minutes or days
    later, so nothing can be unlocked at the moment of purchase. This is the
    same reconcile-against-the-processor pattern the bookings already use:
    the processor is the source of truth, never our own record.
    """
    try:
        sq = square_client.list_invoices() or {}
    except Exception as e:
        return jsonify({"ok": False, "error": "Could not reach Square: " + str(e)[:120]}), 502
    paid_ids = {k for k, v in (sq.items() if isinstance(sq, dict) else [])
                if str((v or {}).get("status", "")).upper() in ("PAID", "COMPLETED")}
    unlocked = []
    with _LOCK:
        buys = _load(PURCHASES_PATH)
        ops = _load(OPINIONS_PATH)
        for b in buys:
            if b.get("status") == "pending" and b.get("invoice_id") in paid_ids:
                b["status"] = "paid"
                b["paid_at"] = datetime.datetime.now().isoformat(timespec="seconds")
                unlocked.append(b["id"])
                for o in ops:
                    if o.get("id") == b.get("opinion_id"):
                        o["sales"] = o.get("sales", 0) + 1
        if unlocked:
            _save(PURCHASES_PATH, buys)
            _save(OPINIONS_PATH, ops)
    return jsonify({"ok": True, "unlocked": len(unlocked), "purchase_ids": unlocked})


@app.route("/api/purchases/ledger")
@owner_required
def api_purchases_ledger():
    """What the platform has actually earned, after the processor."""
    all_buys = _load(PURCHASES_PATH)
    buys = [b for b in all_buys if b.get("status") == "paid"]
    return jsonify({"ok": True, "sales": len(buys),
                    "demo_sales_excluded": len([b for b in all_buys if b.get("status") == "demo"]),
                    "gross_usd": round(sum(b.get("price_usd", 0) for b in buys), 2),
                    "to_professionals_usd": round(sum(b.get("to_professional_usd", 0) for b in buys), 2),
                    "processing_usd": round(sum(b.get("processing_usd", 0) for b in buys), 2),
                    "platform_net_usd": round(sum(b.get("platform_net_usd", 0) for b in buys), 2),
                    "pending": len([b for b in all_buys if b.get("status") == "pending"])})


# ---------- agents (referral partners) ----------
@app.route("/api/agents/register", methods=["POST"])
def api_agent_register():
    """Anyone can become an agent, individual or organization. On registration
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
    # Pending = still in play (NEW/ASSIGNED), excludes CANCELED so a dead ride
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
        "pending_commission": pending_commission,   # still in play, excludes canceled rides
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
# PAYOUTS, agents/driver-agents request their earned money; the owner
# marks it paid once sent (Zelle/cash/check, the site never moves money).
# payouts.json is an append-only ledger: REQUESTED → PAID / DECLINED.
# ======================================================================
PAYOUTS_PATH = _data_path("payouts.json")


def _agent_take_paid(aid):
    """(total_take, paid_out, requested_open) for an agent, the money math."""
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
        return jsonify({"ok": False, "error": "Nothing available to pay out yet, commissions become payable when rides complete."}), 400
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
    _push_owner_alert("PAYOUT", "PAYOUT REQUEST %s, %s requests $%.2f%s. Available balance was $%.2f. Review in Dispatch → Payouts." % (
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
    """Owner confirms the money was sent (outside the site), ledger goes honest."""
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
    """Owner clicks Pay, the site sends the PayPal payout, then marks PAID.
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
        note="Payout %s, Plateau Strategy Solution Lab" % pid)
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
# 🤖 JARVIS, Sean's butler, embedded in the website. Owner-only.
# Same engine as the Telegram Jarvis: headless `claude -p` on Haiku
# (subscription billing, API key stripped), NO tools, answer-only.
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
        "NO tools, answer from the snapshot and conversation only; if asked to act, explain "
        "where on the site to do it (Dispatch, Board, Archive, Books). NEVER invent numbers, "
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
            return jsonify({"ok": False, "error": "Jarvis is momentarily speechless, try again."}), 502
        return jsonify({"ok": True, "reply": reply})
    except subprocess.TimeoutExpired:
        return jsonify({"ok": False, "error": "Jarvis took too long thinking, try again."}), 504
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
    if _login_blocked(vin):
        return _too_many_tries()
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
                    _login_failed(vin)
                    return jsonify({"ok": False, "error": "That birthday doesn't match this vehicle."}), 401
            else:
                # legacy account with no birthday on file, enroll it now (VIN proves identity)
                r["dob"] = dob
                _save(RENTERS_PATH, renters)
            _login_ok(vin)
            session["renter_id"] = r["id"]
            return jsonify({"ok": True, "renter": r})
    # A wrong VIN counts too: without this, guessing the account is unlimited
    # and only guessing the birthday is throttled.
    _login_failed(vin)
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
    if _login_blocked(code):
        return _too_many_tries()
    for a in _load(AGENTS_PATH):
        ac = (a.get("code") or "").strip().upper()
        if ac and ac == code and _last_name(a.get("name")) == last:
            if org and (a.get("organization") or "").strip().lower() != org:
                continue   # organization was provided but doesn't match
            _login_ok(code)
            session["agent_id"] = a["id"]
            return jsonify({"ok": True, "agent": a})
    _login_failed(code)
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
# Priced 2026-08-08 at Sean's instruction: $34 a MONTH.
#
# Worth seeing written down: $34/month is $408 a year, against the $170/year
# this used to carry. That is a 140% increase, not the small move the number
# alone suggests, and it prices the product as a managed service rather than
# as software.
#
# No annual plan until Sean picks its figure. An annual rate is normally a
# discount on twelve months rather than 12 x monthly, so it is a decision, not
# an arithmetic result, inventing one here would be guessing at a price.
#
# This number is NOT published. The endpoint below has answered 404 to
# everyone but the owner since 2026-08-01, and the landing page says the
# product is not for sale. Changing the figure here settles what the price
# will be; it does not make an offer, which is the part that waits for the
# attorney.
FINANCE_PLANS = {
    "monthly": {"amount": 34.00, "label": "AI Debt Eliminator, Monthly Plan", "billing": "$34/month"},
}


@app.route("/api/finance/enroll", methods=["POST"])
def api_finance_enroll():
    """Enroll a customer in the AI Debt Eliminator and send their Square charge.

    🔒 CLOSED 2026-08-01 [40-agent council finding, unanimous]: this was a LIVE,
    UNAUTHENTICATED endpoint firing a real production Square charge whose
    description guarantees "Principal always protected" for a product that does
    not exist yet, FTC/consumer-protection exposure + anyone could trigger
    charges. Owner-only until the product is real and lawyer-reviewed.
    Re-open by deleting the two lines below (and see the landing-page modal)."""
    if not session.get("owner"):
        return Response("Not Found", status=404, mimetype="text/plain")
    data = request.get_json(force=True, silent=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    phone = (data.get("phone") or "").strip()
    # Fall back to whichever plan exists, not to a name typed in here. This
    # said "annual" twice, so removing the annual plan turned an unrecognised
    # plan into a KeyError on the line below rather than a sensible default.
    # Reading the fallback out of FINANCE_PLANS means the two cannot disagree.
    default_plan = next(iter(FINANCE_PLANS))
    plan = (data.get("plan") or default_plan).strip().lower()
    if plan not in FINANCE_PLANS:
        plan = default_plan
    if not name or not email:
        return jsonify({"ok": False, "error": "Name and email are required."}), 400

    p = FINANCE_PLANS[plan]
    invoice = square_client.create_charge(
        {"name": name, "email": email, "phone": phone},
        p["amount"], p["label"],
        # No safety claim in the charge description. "Principal always protected"
        # was here, and a charge description is a written representation to the
        # customer at the moment they are billed, the worst possible place for a
        # promise the product cannot keep. Removed 2026-08-08 with the landing
        # page's price cards; if this endpoint is ever reopened it must not carry
        # a guarantee back in with it.
        "AI Debt Eliminator subscription (%s). 30-day free trial, then billed %s. "
        "Automated trading can lose money." % (plan, p["billing"]))

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
@owner_required
def api_finance_wishlist():
    # Owner-gated: this returns every finance-interest signup with their
    # contact details. It used to hand the whole list to anyone who asked.
    return jsonify({"wishes": list(reversed(_load(WISHLIST_PATH)))})


# ---------- 🌟 travel wishes, what visitors WANT that the book doesn't have yet ----------
# The demand side of the Destination Book: places people ask for, and the city
# they want them in. Free-text, no account, no email required, a wish is a
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
        # how many people asked for something similar, the useful public signal
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
    # Canceled invoices are mostly booking mistakes / duplicates, no money changed
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


# ---------- articles / proposals, the Reinvestment USA business-idea board ----------
# Open to anyone, no login: pitch a business idea, and readers can register
# interest to invest in it or to launch/run it themselves. This is a lead
# board only, no money or equity ever moves through the site; registering
# interest just leaves contact info for Plateau Strategy to follow up on.
# ---------- the idea board is a public write, and it was unguarded ----------
# Anyone can pitch a business idea with no account, that openness is the
# point, and it should stay. But the endpoint accepted five posts in a row
# from one caller in a test, with nothing to slow it and nothing to take a
# post down afterwards. A public write on a real company's domain needs both:
# a stranger with good intentions never notices a limit this loose, and a
# script does immediately.
IDEA_MAX_PER_HOUR = 3
IDEA_MAX_PER_DAY = 8


def _idea_rate_ok(items):
    """True when this caller may post another idea right now.

    Counted per address over the stored ideas themselves rather than in a
    side table, so it survives a restart and cannot drift out of step with
    what was actually published. The address is kept only to make this
    decision, _public_article never returns it."""
    ip = _client_ip()
    if not ip:
        return True, ""
    now = datetime.datetime.now()
    hour = day = 0
    for a in items:
        if a.get("ip") != ip:
            continue
        try:
            t = datetime.datetime.fromisoformat(a.get("created_at") or "")
        except Exception:
            continue
        age = (now - t).total_seconds()
        if age < 3600:
            hour += 1
        if age < 86400:
            day += 1
    if hour >= IDEA_MAX_PER_HOUR:
        return False, ("That is %d ideas in an hour. Give the last one time to be read, "
                       "you can post again shortly." % IDEA_MAX_PER_HOUR)
    if day >= IDEA_MAX_PER_DAY:
        return False, ("That is %d ideas today. The board is for ideas worth reading, "
                       "not volume, try again tomorrow." % IDEA_MAX_PER_DAY)
    return True, ""


def _entitled(a, vid=None):
    """Has this reader paid for this locked piece?

    Owner always; otherwise the reader's anonymous id must be on the unlock
    list. Deliberately server-side: see _public_article."""
    if session.get("owner"):
        return True
    vid = vid or request.cookies.get("psx_vid")
    return bool(vid) and vid in (a.get("unlocked_by") or [])


_ARTICLE_TR_PATH = os.path.join(BASE_DIR, "article_translations.json")
_ARTICLE_TR = {"mtime": 0, "data": {}}


def _content_hash(title, body):
    """The fingerprint a translation is anchored to.

    A translation is only ever shown against the exact text it translates.
    Tonight proved why: the English on the page was one version of an
    article while the Chinese beside it translated another, and the owner
    was reading a mismatch with no way to know. Keying by title allowed
    that, because a title survives an edit. A content hash does not: change
    one character of the piece and the old translation simply stops being
    offered, which is the honest behaviour.
    """
    norm = (title or "").strip() + "\n" + "\n".join(
        p.strip() for p in (body or "").split("\n") if p.strip())
    return hashlib.sha256(norm.encode("utf-8")).hexdigest()[:16]


_ARTICLE_TR_RUNTIME = _data_path("article_translations_runtime.json")
_TR_CACHE = {}


def _read_tr_file(path):
    """One translation store, cached by mtime so reads are free."""
    try:
        m = os.path.getmtime(path)
    except OSError:
        return {}
    slot = _TR_CACHE.get(path)
    if not slot or slot[0] != m:
        try:
            with open(path, encoding="utf-8") as f:
                data = json.load(f)
        except Exception:
            data = {}
        _TR_CACHE[path] = slot = (m, data)
    return slot[1]


def _translations_for(title, body):
    """Every translation anchored to THIS exact text, from both stores.

    Two stores, one rule. The repo file carries hand-checked translations
    and survives deploys. The runtime file is written by the auto
    translator and lives wherever the site's data lives. Both are keyed by
    content hash, and a stored translation whose paragraph count does not
    match the source is refused, so what reaches a reader is aligned with
    the text beside it or it is not shown at all.
    """
    h = _content_hash(title, body)
    src_paras = len([p for p in (body or "").split("\n") if p.strip()])
    out = {}
    for path in (_ARTICLE_TR_PATH, _ARTICLE_TR_RUNTIME):
        data = _read_tr_file(path)
        entry = (data.get("by_hash") or {}).get(h) or {}
        for lang, t in entry.items():
            paras = t.get("paras") or [s for s in (t.get("body") or "").split("\n") if s.strip()]
            if len(paras) != src_paras:
                continue          # not anchored to this text: refuse it
            out[lang] = {"title": t.get("title") or "", "body": "\n\n".join(paras),
                         "paras": paras}
    return out


# ---------- the blueprint: the sealed layer under an idea ----------
#
# An idea on the board has two layers, exactly as the Reinvestment USA
# framework drew them: the article, public, and the BLUEPRINT, the full
# working detail, sealed. The seal is identity: opening a blueprint requires
# a verified Google sign-in, and every opening is recorded, name, email,
# time, for the author to see. That is what "protected" means here and it
# is all it means: a timestamp proving who wrote it first, and a log
# proving who has read it since. It does not stop a determined thief; it
# makes every reader a named reader, which is what an author can actually
# take to a lawyer.
#
# A blueprint is keyed by the CONTENT HASH of the article it belongs to,
# the same anchor discipline as translations: edit the article and the
# blueprint detaches rather than sitting under text it no longer matches.
BLUEPRINTS_PATH = _data_path("blueprints.json")
BLUEPRINT_ACCESS_PATH = _data_path("blueprint_access.json")


def _bp_entry(title, body):
    """The blueprint sealed under this exact text, or None. Returns (bp, hash)."""
    h = _content_hash(title, body)
    store = _read_tr_file(BLUEPRINTS_PATH)
    entry = (store.get("by_hash") or {}).get(h) if isinstance(store, dict) else None
    return entry, h


def _bp_image_from_bytes(raw, mime):
    """A drawing, out of raw bytes, or None. The one validator every path
    goes through, poster uploads and seeded prints alike.

    Raster formats only, verified by magic bytes, never by the label that
    came with them: an SVG is a script container, and no picture may ever
    reach another reader's page as markup. Size capped at 3MB; a blueprint
    drawing is a photo of a sketch, not a film."""
    try:
        if mime not in ("image/png", "image/jpeg", "image/webp"):
            return None
        if not (100 <= len(raw) <= 3_000_000):
            return None
        ok = ((mime == "image/png" and raw[:8] == b"\x89PNG\r\n\x1a\n")
              or (mime == "image/jpeg" and raw[:3] == b"\xff\xd8\xff")
              or (mime == "image/webp" and raw[:4] == b"RIFF" and raw[8:12] == b"WEBP"))
        if not ok:
            return None
        import base64
        return {"mime": mime, "b64": base64.b64encode(raw).decode()}
    except Exception:
        return None


def _bp_image_from_data_url(s):
    """A poster's drawing, out of a data URL, or None."""
    try:
        if not isinstance(s, str) or not s.startswith("data:image/") or len(s) > 4_400_000:
            return None
        head, _, b64 = s.partition(",")
        if ";base64" not in head:
            return None
        mime = head[5:head.index(";")]
        import base64
        raw = base64.b64decode(b64, validate=True)
        return _bp_image_from_bytes(raw, mime)
    except Exception:
        return None


def _bp_attach(title, body, md, source, bp_title="", images=None, svg="",
               price_usd=None):
    """Seal a blueprint under an article. Caller passes the STORED title and
    body (post-scrub, post-truncation), because the hash must match what
    readers are actually looking at.

    A blueprint can be text, pictures, or both; `images` is a list of
    validated rasters ({mime, b64}), `svg` is OUR OWN drawn sheet and is
    only ever set by the seeder, never from a request. A `price_usd` makes
    opening it a sale: sign in AND pay, the framework's own mechanic."""
    md = _no_em_dash((md or "").strip())[:40000]
    images = [i for i in (images or []) if i][:8]
    if not md and not images and not svg:
        return
    entry = {
        "title": _no_em_dash((bp_title or "").strip(), title=True)[:160] or "The blueprint",
        "md": md,
        "source": source,
        "attached_at": datetime.datetime.now().isoformat(timespec="seconds"),
    }
    if images:
        entry["images"] = images
    if svg:
        entry["svg"] = svg
    try:
        if price_usd and 0 < float(price_usd) <= 10000:
            entry["price_usd"] = round(float(price_usd), 2)
    except Exception:
        pass
    with _LOCK:
        store = _load(BLUEPRINTS_PATH)
        if not isinstance(store, dict):
            store = {}
        store.setdefault("by_hash", {})
        store["by_hash"][_content_hash(title, body)] = entry
        _save(BLUEPRINTS_PATH, store)


def _md_blocks(md):
    """A drafted blueprint into typed blocks the page can render safely.

    Deliberately small: headings, paragraphs, bullet lists, quotes, fenced
    code and tables (both shown monospace), rules. Every block is rendered
    in the browser with textContent, never innerHTML, so nothing in a
    blueprint can script the page, and anything this parser does not
    recognise degrades to a visible paragraph rather than vanishing."""
    blocks = []
    buf = []
    mode = [None]           # None | 'ul' | 'q' | 'pre'

    def _plain(s):
        # [^*\n] keeps each match scan from crossing the next star, which is
        # what makes this linear; the lazy .+? form went quadratic on a line
        # full of stars, ~3.5s of CPU on a 40KB hostile blueprint, reachable
        # by any signed reader.
        s = re.sub(r"\*\*([^*\n]+)\*\*", r"\1", s)
        s = re.sub(r"(?<!\w)\*([^*\n]+)\*(?!\w)", r"\1", s)
        return s.replace("`", "").strip()

    def flush():
        if not buf:
            mode[0] = None
            return
        if mode[0] == "pre":
            blocks.append({"t": "pre", "s": "\n".join(buf)})
        elif mode[0] == "ul":
            blocks.append({"t": "ul", "items": [_plain(x) for x in buf]})
        elif mode[0] == "q":
            blocks.append({"t": "q", "s": _plain(" ".join(buf))})
        else:
            s = _plain(" ".join(buf))
            if s:
                blocks.append({"t": "p", "s": s})
        del buf[:]
        mode[0] = None

    fenced = False
    for raw in (md or "").split("\n"):
        line = raw.rstrip()
        if line.strip().startswith("```"):
            if fenced:
                flush()
                fenced = False
            else:
                flush()
                mode[0] = "pre"
                fenced = True
            continue
        if fenced:
            buf.append(raw)
            continue
        s = line.strip()
        if not s:
            flush()
            continue
        if s in ("---", "***") or set(s) == {"-"} and len(s) >= 3:
            flush()
            blocks.append({"t": "hr"})
            continue
        if s.startswith("### "):
            flush()
            blocks.append({"t": "h3", "s": _plain(s[4:])})
            continue
        if s.startswith("## "):
            flush()
            blocks.append({"t": "h2", "s": _plain(s[3:])})
            continue
        if s.startswith("# "):
            flush()
            blocks.append({"t": "h2", "s": _plain(s[2:])})
            continue
        if s.startswith("|"):
            if mode[0] != "pre":
                flush()
                mode[0] = "pre"
            buf.append(line)
            continue
        if s.startswith("> "):
            if mode[0] != "q":
                flush()
                mode[0] = "q"
            buf.append(s[2:])
            continue
        if s.startswith("- ") or s.startswith("· "):
            if mode[0] != "ul":
                flush()
                mode[0] = "ul"
            buf.append(s[2:])
            continue
        if mode[0] == "ul" and raw.startswith("  "):
            buf[-1] = buf[-1] + " " + s     # a wrapped bullet stays one bullet
            continue
        if mode[0] in ("ul", "q", "pre"):
            # 'pre' here can only be a table (fenced code never reaches this
            # branch); without the flush a paragraph on the line after a
            # table was glued into the table's monospace block.
            flush()
        buf.append(s)
    flush()
    return blocks


def _bp_record_access(h, aid, viewer):
    """One line in the book: who opened which blueprint, and when.

    Re-opens within the hour are not re-recorded, the log is evidence of
    WHO has seen a plan, not a click counter, and a reader flipping back
    and forth should not read as ten people."""
    email = (viewer.get("email") or "").strip().lower()
    if not email:
        return
    now = datetime.datetime.now()
    with _LOCK:
        rows = _load(BLUEPRINT_ACCESS_PATH)
        if not isinstance(rows, list):
            rows = []
        for r in reversed(rows[-200:]):
            if r.get("h") == h and r.get("email") == email:
                try:
                    prev = datetime.datetime.fromisoformat(r.get("ts") or "")
                    if (now - prev).total_seconds() < 3600:
                        return
                except Exception:
                    pass
                break
        rows.append({"h": h, "aid": aid, "email": email,
                     "name": (viewer.get("name") or "").strip()[:80],
                     "ts": now.isoformat(timespec="seconds")})
        _save(BLUEPRINT_ACCESS_PATH, rows[-5000:])


def _bp_opened_count(h):
    """How many distinct named readers have opened this blueprint."""
    rows = _load(BLUEPRINT_ACCESS_PATH)
    if not isinstance(rows, list):
        return 0
    return len({r.get("email") for r in rows if r.get("h") == h and r.get("email")})


def _bp_paid(h, email):
    """Has this reader bought this blueprint. Paid means Square said paid,
    through the same reconcile the opinions use; a demo or pending row
    unlocks nothing, exactly as it unlocks no opinion."""
    if not email:
        return None
    for b in _load(PURCHASES_PATH):
        if (b.get("kind") == "blueprint" and b.get("h") == h
                and b.get("buyer_email") == email and b.get("status") == "paid"):
            return b
    return None


def _bp_nostore(resp, code=200):
    """No sealed byte, and not even the fact of being asked to sign in,
    may sit in a shared cache: a cached 200 would replay the plan to the
    next unsigned visitor with no access record at all."""
    resp.headers["Cache-Control"] = "private, no-store"
    resp.headers["Vary"] = "Cookie"
    return resp, code


def _bp_open(aid):
    """The one gate both blueprint doors share, JSON and image alike.

    Two doors with two hand-written gates would drift apart the first time
    one was edited, and the drifted one would be the leak. Returns
    (bp, hash, viewer, None) when the reader may pass, else
    (None, None, None, (payload, code))."""
    a = next((x for x in _load(ARTICLES_PATH)
              if x.get("id") == aid and not x.get("hidden")), None)
    if not a:
        return None, None, None, ({"ok": False, "error": "That idea is not here."}, 404)
    owner = session.get("owner")
    if (a.get("lock") or {}) and not _entitled(a) and not owner:
        # The page treats a locked article as blueprint-less; the doors
        # must agree, or the sealed layer becomes a side door around the
        # article's own paywall.
        return None, None, None, ({"ok": False,
                                   "error": "This idea is locked; its blueprint unlocks with it."}, 403)
    bp, h = _bp_entry(a.get("title"), a.get("body"))
    if not bp:
        return None, None, None, ({"ok": False,
                                   "error": "No blueprint travels with this idea."}, 404)
    reader = session.get("reader") or {}
    if not owner and not reader.get("email"):
        return None, None, None, ({"ok": False, "need": "signin",
                                   "error": "Sign in to open the blueprint."}, 401)
    # A priced blueprint is a sale, the framework's own words: the body
    # unlocks on payment. The owner reads their own board freely; everyone
    # else needs a paid row in the same ledger the opinions settle through.
    price = bp.get("price_usd")
    if price and not owner and not _bp_paid(h, (reader.get("email") or "").strip().lower()):
        return None, None, None, ({"ok": False, "need": "unlock",
                                   "price_usd": price,
                                   "error": "This blueprint is priced at $%g "
                                            "by the author." % price}, 402)
    if reader.get("email"):
        viewer = {"email": reader.get("email"), "name": reader.get("name") or ""}
    else:
        # The owner reading their own board is not evidence of anything;
        # the log stays a record of outside readers.
        viewer = {"email": "", "name": owner, "owner": True}
    return bp, h, viewer, None


@app.route("/api/idea/<aid>/blueprint")
def api_idea_blueprint(aid):
    """The sealed layer, served ONLY to a named reader.

    The blueprint's body is never in the page's HTML and never in the
    public article JSON; this endpoint and its image twin are the only
    doors, and the check is the server's session, not anything the page
    claims. An unsigned request learns that it must sign in and nothing
    else."""
    bp, h, viewer, err = _bp_open(aid)
    if err:
        return _bp_nostore(jsonify(err[0]), err[1])
    if not viewer.get("owner"):
        _bp_record_access(h, aid, viewer)
    return _bp_nostore(jsonify({
        "ok": True,
        "title": bp.get("title") or "The blueprint",
        "attached_at": bp.get("attached_at"),
        "blocks": _md_blocks(bp.get("md") or ""),
        # The drawn sheet ships as markup, so it is served ONLY for the
        # seeded entry, whose SVG comes from this repo. A poster's entry
        # never carries svg out of here even if the store were poisoned.
        "svg": (bp.get("svg") or "") if bp.get("source") == "seed" else "",
        "images": len(bp.get("images") or []),
        "viewer": viewer,
        "opened": _bp_opened_count(h)}))


@app.route("/api/idea/<aid>/blueprint/image")
@app.route("/api/idea/<aid>/blueprint/image/<int:n>")
def api_idea_blueprint_image(aid, n=0):
    """The picture half of the sealed layer, behind the same gate.

    Not recorded separately: the page can only reach this right after the
    JSON door, which already wrote the reader into the book, and two log
    lines for one opening would double-count readers."""
    import base64
    bp, h, viewer, err = _bp_open(aid)
    if err:
        return _bp_nostore(jsonify(err[0]), err[1])
    imgs = bp.get("images") or []
    img = imgs[n] if 0 <= n < len(imgs) else {}
    if not img.get("b64"):
        return _bp_nostore(jsonify({"ok": False, "error": "No drawing on this blueprint."}), 404)
    try:
        raw = base64.b64decode(img["b64"])
    except Exception:
        return _bp_nostore(jsonify({"ok": False, "error": "The drawing could not be read."}), 500)
    mime = img.get("mime") or ""
    if mime not in ("image/png", "image/jpeg", "image/webp"):
        return _bp_nostore(jsonify({"ok": False, "error": "The drawing could not be read."}), 500)
    return _bp_nostore(Response(raw, mimetype=mime))


@app.route("/api/blueprint-access")
def api_blueprint_access():
    """The author's side of the protection: who opened what, newest first.
    Owner only, until posters have accounts of their own."""
    if not session.get("owner"):
        return jsonify({"ok": False, "error": "Owner only."}), 403
    rows = _load(BLUEPRINT_ACCESS_PATH)
    rows = rows if isinstance(rows, list) else []
    titles = {}
    for a in _load(ARTICLES_PATH):
        titles[a.get("id")] = a.get("title")
    out = [{"when": r.get("ts"), "email": r.get("email"), "name": r.get("name"),
            "idea": titles.get(r.get("aid")) or r.get("aid")}
           for r in rows[-200:]]
    return jsonify({"ok": True, "opens": out[::-1], "total": len(rows)})


@app.route("/api/idea/<aid>/blueprint/buy", methods=["POST"])
def api_idea_blueprint_buy(aid):
    """Buy the sealed blueprint. The same Square rails as an opinion: an
    invoice goes to the buyer's email, the reconcile against Square flips
    it to paid, and only paid opens the seal. The buyer is the signed-in
    reader, so the unlock follows them to any device, and the invoice
    goes to an address Google has verified, not one typed into a form."""
    reader = session.get("reader") or {}
    email = (reader.get("email") or "").strip().lower()
    if not email:
        return _bp_nostore(jsonify({"ok": False, "need": "signin",
                                    "error": "Sign in first."}), 401)
    a = next((x for x in _load(ARTICLES_PATH)
              if x.get("id") == aid and not x.get("hidden")), None)
    if not a:
        return _bp_nostore(jsonify({"ok": False, "error": "That idea is not here."}), 404)
    bp, h = _bp_entry(a.get("title"), a.get("body"))
    price = float((bp or {}).get("price_usd") or 0)
    if not bp or not price:
        return _bp_nostore(jsonify({"ok": False,
                                    "error": "This blueprint is not for sale."}), 404)
    if _bp_paid(h, email):
        return _bp_nostore(jsonify({"ok": True, "already_paid": True}))
    processing = round(price * 0.029 + 0.30, 2)
    invoice = None
    try:
        invoice = square_client.create_charge(
            {"name": reader.get("name") or email, "email": email, "phone": ""},
            price, "Blueprint: " + (a.get("title") or "")[:60],
            "The sealed blueprint under this idea. One-time purchase; "
            "it opens under your sign-in once the invoice is paid.")
    except Exception as e:
        invoice = {"ok": False, "error": str(e)[:160]}
    is_demo = isinstance(invoice, dict) and (
        invoice.get("mode") == "mock"
        or str(invoice.get("status", "")).upper() == "SIMULATED")
    inv_err = None
    if isinstance(invoice, dict) and not is_demo:
        if invoice.get("errors"):
            try:
                inv_err = invoice["errors"][0].get("detail") or str(invoice["errors"][0])
            except Exception:
                inv_err = "Square rejected the invoice."
        elif invoice.get("ok") is False:
            inv_err = invoice.get("error") or "Square rejected the invoice."
    if inv_err:
        return _bp_nostore(jsonify({"ok": False, "error": inv_err,
                                    "hint": "Nothing was recorded, the invoice "
                                            "was never raised."}), 502)
    with _LOCK:
        buys = _load(PURCHASES_PATH)
        if not isinstance(buys, list):
            buys = []
        rec = {
            "id": _next_id(buys, "BUY", datestamp=False),
            "kind": "blueprint", "h": h, "aid": aid,
            "opinion_id": None, "opinion_title": "Blueprint: " + (a.get("title") or "")[:80],
            "pro_id": None, "buyer_key": None,
            "buyer_name": (reader.get("name") or "")[:80], "buyer_email": email,
            "price_usd": price, "platform_fee_usd": price,
            "processing_usd": processing, "to_professional_usd": 0.0,
            "platform_net_usd": round(price - processing, 2),
            "status": "demo" if is_demo else "pending",
            "invoice_id": (invoice or {}).get("id") or (invoice or {}).get("invoice_id"),
            "invoice_url": (invoice or {}).get("url") or (invoice or {}).get("public_url"),
            "created_at": datetime.datetime.now().isoformat(timespec="seconds"),
        }
        buys.append(rec)
        _save(PURCHASES_PATH, buys)
    return _bp_nostore(jsonify({
        "ok": True, "demo": is_demo, "invoice_url": rec.get("invoice_url"),
        "note": ("Square is not connected yet, so no invoice was really sent "
                 "and nothing will be charged. Recorded as a demo sale; the "
                 "blueprint stays sealed because no money moved.") if is_demo else
                ("The invoice is on its way to %s from Square. Once it is "
                 "paid, the blueprint opens here under your sign-in." % email)}))


@app.route("/api/idea/<aid>/blueprint/price", methods=["POST"])
@owner_required
def api_idea_blueprint_price(aid):
    """The owner puts a price on a blueprint, or takes it off with 0."""
    a = next((x for x in _load(ARTICLES_PATH)
              if x.get("id") == aid and not x.get("hidden")), None)
    if not a:
        return jsonify({"ok": False, "error": "That idea is not here."}), 404
    h = _content_hash(a.get("title"), a.get("body"))
    data = request.get_json(force=True, silent=True) or {}
    try:
        price = round(float(data.get("price_usd") or 0), 2)
    except Exception:
        return jsonify({"ok": False, "error": "A number, in dollars."}), 400
    if not (0 <= price <= 10000):
        return jsonify({"ok": False, "error": "Between 0 and 10000."}), 400
    with _LOCK:
        store = _load(BLUEPRINTS_PATH)
        entry = (store.get("by_hash") or {}).get(h) if isinstance(store, dict) else None
        if not entry:
            return jsonify({"ok": False, "error": "No blueprint on this idea."}), 404
        if price:
            entry["price_usd"] = price
        else:
            entry.pop("price_usd", None)
        _save(BLUEPRINTS_PATH, store)
    return jsonify({"ok": True, "price_usd": price or None})


def _public_article(a):
    """Public shape, investor/launcher emails are kept private, only counts are shown.

    A LOCKED piece does not ship its body. That is the whole of the lock and
    it is the only place it can live: a paywall implemented in the page is a
    paywall a reader defeats with Ctrl-U, and one implemented by hiding an
    element with CSS is not a paywall at all, the text is already on their
    machine. So the body is replaced by the teaser here, before the JSON is
    written, and the reader's browser never receives what it has not paid for.

    This is written to be general on purpose. The first use is an attorney's
    read on a business idea, but nothing below knows that; anything that
    carries a `lock` behaves this way, which is what "other ideas locked too"
    needs."""
    lock = a.get("lock") or {}
    locked = bool(lock) and not _entitled(a)
    out = {
        "id": a.get("id"),
        "author": a.get("author", ""),
        "created_at": a.get("created_at"),
        "stamp": a.get("stamp", ""),
        "title": a.get("title"),
        "body": (lock.get("teaser") or "") if locked else a.get("body"),
        "likes": a.get("likes", 0),
        "unlikes": a.get("unlikes", 0),
        "locked": locked,
        "price_usd": lock.get("price_usd") if locked else None,
        "locked_by": lock.get("by") if lock else None,
        "follower_count": len(a.get("followers", [])),
        "launcher_count": len(a.get("launchers", [])),
        # The trades this article calls for, what goes at the foot of it.
        "professionals": a.get("professionals"),
        # Whatever languages this piece has been translated into. A locked
        # article ships none of them, for the same reason it ships no body.
        "translations": {} if locked else _translations_for(a.get("title"), a.get("body")),
        # Whether a sealed blueprint travels with this idea. The flag is
        # public; the blueprint is not, it leaves only through its own
        # sign-in-gated endpoint. A locked article shows no flag, exactly
        # as it ships no body: the blueprint unlocks with the article.
        "has_blueprint": (not locked) and bool(_bp_entry(a.get("title"), a.get("body"))[0]),
    }
    return out


def _rerecognize_stale(items):
    """Re-read any article whose trades were recognised by an older engine.

    This is what makes the recognizer automatic rather than a one-shot
    stamp: improve the tables, bump PM_VERSION, and every stored post is
    re-read on its next request. Without it, better recognition would only
    reach articles posted after the improvement, and the owner's own post
    would have kept its wrong trades forever.
    """
    try:
        import professional_match
        want = getattr(professional_match, "PM_VERSION", 1)
        stale = [a for a in items
                 if (a.get("professionals") or {}).get("version") != want]
        if not stale:
            return items
        with _LOCK:
            items = _load(ARTICLES_PATH)
            changed = False
            for a in items:
                pr = a.get("professionals") or {}
                if pr.get("version") == want:
                    continue
                a["professionals"] = professional_match.professionals_for(
                    a.get("title", ""), a.get("body", ""))
                changed = True
            if changed:
                _save(ARTICLES_PATH, items)
    except Exception:
        pass
    return items


@app.route("/api/articles")
def api_articles():
    items = _rerecognize_stale(_load(ARTICLES_PATH))
    # A hidden idea is still in the file, taking one down must not destroy
    # what someone wrote, only stop it being published.
    return jsonify({"articles": [_public_article(a) for a in reversed(items)
                                 if not a.get("hidden")]})


# ---------------------------------------------------------------------------
# One idea, one address, readable by anyone
#
# The board lives inside a tab on the landing page and loads over JavaScript,
# which means an idea had no address of its own, there was nothing to send
# somebody. This is the missing half of "share your idea into your circle".
#
# Rendered on the SERVER, and that is the whole point rather than a style
# preference. When a link is pasted into WhatsApp, iMessage, Messenger, Slack
# or Discord, the preview is fetched by a scraper that does NOT run JavaScript.
# A client-rendered page hands that scraper an empty shell, so the message
# shows a bare grey URL, and a bare grey URL is not shared twice. The Open
# Graph tags below have to exist in the first response or the loop does not
# start.
#
# Deliberately indexable, unlike /robot: the entire purpose is that strangers
# arrive here.
# ---------------------------------------------------------------------------
def _og_description(text, limit=180):
    """A one-line summary for a link preview, cut on a word."""
    s = " ".join((text or "").split())
    if len(s) <= limit:
        return s
    cut = s[:limit].rsplit(" ", 1)[0]
    return (cut or s[:limit]).rstrip(",.;:, -") + "…"


@app.route("/idea/<aid>")
def idea_page(aid):
    a = next((x for x in _load(ARTICLES_PATH)
              if x.get("id") == aid and not x.get("hidden")), None)
    if not a:
        return Response("That idea is not here.", status=404, mimetype="text/plain")

    pub = _public_article(a)
    e = html.escape
    title = pub.get("title") or "A business idea"
    author = pub.get("author") or "Anonymous"
    body = pub.get("body") or ""
    locked = pub.get("locked")

    # The lock is enforced in _public_article, before the JSON or the HTML is
    # built, so a locked idea's body is never in the bytes we send, and Ctrl-U
    # shows the teaser too. Said out loud because a paywall drawn in CSS is not
    # a paywall.
    when = ""
    try:
        when = datetime.datetime.fromisoformat(
            pub["created_at"]).strftime("%d %B %Y")
    except Exception:
        pass

    url = "%s/idea/%s" % (SITE_ORIGIN, e(aid))
    desc = _og_description(body) or ("A business idea posted by %s." % author)
    paras = "".join("<p>%s</p>" % e(p) for p in body.split("\n") if p.strip())

    # What this piece has been translated into. Only languages that actually
    # exist for THIS article are offered, a language button that changes
    # nothing is worse than no button, because the reader concludes the site
    # is broken rather than that the work has not been done yet.
    trs = {} if locked else _translations_for(a.get("title"), a.get("body"))
    LANG_NAMES = {"zh": "\u4e2d\u6587", "es": "Espa\u00f1ol",
                  "ko": "\ud55c\uad6d\uc5b4", "vi": "Ti\u1ebfng Vi\u1ec7t"}
    # Every language is always offered. A missing one is not hidden, it is
    # translated the moment a reader taps it, through the same engine and
    # the same anchored store as the background path. Hiding the button was
    # honest once; with live translation behind it, offering is honest.
    buttons = ['<button class="lang-opt" data-l="en" aria-current="true">English</button>']
    for code in ("zh", "es", "ko", "vi"):
        buttons.append('<button class="lang-opt" data-l="%s"%s>%s</button>'
                       % (code, "" if code in trs else ' data-missing="1"',
                          LANG_NAMES[code]))
    lang_row = ('<div class="lang-row" role="group" aria-label="Language">%s</div>'
                % "".join(buttons)) if not locked else ""
    # Paragraphs are split HERE, not in the browser. The first version passed
    # the body whole and split it in JavaScript with "\\n", which was written
    # into the page as a real line break, leaving an unterminated string. The
    # script died at parse time, so the language button rendered and did
    # nothing. Generated code should never carry an escape it does not have to.
    trs_json = json.dumps(
        {lang: {"title": t.get("title") or "",
                "paras": [s.strip() for s in (t.get("body") or "").split("\n") if s.strip()]}
         for lang, t in trs.items()},
        ensure_ascii=False)

    locked_note = ""
    if locked:
        locked_note = (
            '<p class="idea-locked">This idea is locked. What you can read '
            'above is the opening. The rest is available to unlock%s.</p>'
            % (" for $%g" % pub["price_usd"] if pub.get("price_usd") else ""))

    # ---- the sealed blueprint, if one travels with this idea ----
    # Only the section titles are in this page. The body leaves the server
    # exclusively through /api/idea/<aid>/blueprint, which checks the
    # session, so view-source shows an unsigned reader exactly what they
    # are entitled to and nothing more.
    bp, bph = (None, "") if locked else _bp_entry(a.get("title"), a.get("body"))
    bp_section = ""
    bp_script = ""
    if bp:
        bp_blocks = _md_blocks(bp.get("md") or "")
        heads = [b["s"] for b in bp_blocks if b["t"] == "h2"]
        toc = "".join("<li>%s</li>" % e(x) for x in heads[:10])
        n_pics = len(bp.get("images") or [])
        if bp.get("source") == "seed" and bp.get("svg"):
            n_pics += 1
        inside = []
        if n_pics == 1:
            inside.append("the drawing")
        elif n_pics > 1:
            inside.append("%d drawings" % n_pics)
        if heads:
            inside.append("%d sections" % len(heads))
        inside_txt = " + ".join(inside) or "sealed"
        reader_email = (session.get("reader") or {}).get("email") or ""
        is_owner = bool(session.get("owner"))
        signed = bool(reader_email) or is_owner
        bp_price = bp.get("price_usd") or 0
        bp_paid = bool(is_owner) or bool(
            bp_price and reader_email
            and _bp_paid(bph, reader_email.strip().lower()))
        price_line = (" It is priced at $%g by the author; paying the Square "
                      "invoice opens it under your sign-in." % bp_price) if bp_price else ""
        if is_owner and not reader_email:
            gate_note = "You are signed in as the owner. Owner readings are not recorded."
        elif signed and bp_price and not bp_paid:
            gate_note = ("This blueprint is priced at $%g by the author. "
                         "Unlock it and, once the Square invoice is paid, it "
                         "opens here under your sign-in, on any device." % bp_price)
        elif signed:
            gate_note = "You are signed in. Your reading is recorded for the author."
        elif GOOGLE_CLIENT_ID:
            gate_note = ("Sign in with Google to open it. Your name and the time of "
                         "opening are recorded for the author." + price_line)
        else:
            gate_note = ("Sign-in is not switched on yet, so the blueprint cannot "
                         "be opened here for now. It opens the moment sign-in "
                         "arrives." + price_line)
        bp_section = "".join([
            '<div class="bp" id="bpBox">',
            '<div class="bp-head">',
            '<span>Attachment · <b>THE BLUEPRINT</b></span>',
            '<span>Status · <b id="bpState">SEALED</b></span>',
            ('<span>Price · <b>$%g</b></span>' % bp_price) if bp_price else '',
            '<span>Named readers · <b id="bpOpened">', str(_bp_opened_count(bph)),
            '</b></span>',
            '</div>',
            '<p class="bp-note"><b>', e(bp.get("title") or "The blueprint"), '.</b> ',
            'The full working plan travels with this idea, sealed. Opening it requires ',
            'signing in, and every reader is recorded, name and time, for the author. ',
            'That is the whole of the protection: a dated record of when this was ',
            'posted, and a named record of who has read the plan since. It is not ',
            'a patent filing.</p>',
            '<div class="bp-toc-h">Inside · ', e(inside_txt), '</div>',
            '<ul class="bp-toc">', toc, '</ul>',
            '<div id="bpGate"><p class="bp-gatenote" id="bpGateNote">', e(gate_note),
            '</p><div id="bpBtnMount"></div></div>',
            '<div id="bpBody" hidden></div>',
            '</div>'])
        bp_cfg = json.dumps({"aid": a.get("id") or aid, "cid": GOOGLE_CLIENT_ID,
                             "enabled": bool(GOOGLE_CLIENT_ID), "signed": signed,
                             "price": bp_price, "paid": bp_paid})
        # This block is substituted as a VALUE into the page template, so it
        # is never scanned for percent signs; and it deliberately contains no
        # backslash escapes at all, the class of bug that has killed two
        # generated scripts on this site already.
        bp_script = "".join([
            "<script>",
            "(function () {",
            "  var CFG = ", bp_cfg, ";",
            "  var gate = document.getElementById('bpGate');",
            "  var note = document.getElementById('bpGateNote');",
            "  var mount = document.getElementById('bpBtnMount');",
            "  var body = document.getElementById('bpBody');",
            "  var state = document.getElementById('bpState');",
            "  if (!gate || !body || !mount) return;",
            "  function say(t) { if (note) note.textContent = t; }",
            "  function el(tag, text, cls) {",
            "    var d = document.createElement(tag);",
            "    if (text) d.textContent = text;",
            "    if (cls) d.className = cls;",
            "    return d;",
            "  }",
            "  function renderDoc(j) {",
            "    body.innerHTML = '';",
            "    var who = (j.viewer && j.viewer.owner) ? 'the owner' :",
            "      (((j.viewer && j.viewer.name) ? j.viewer.name + ', ' : '') +",
            "       ((j.viewer && j.viewer.email) || ''));",
            "    var ban = el('div', 'Opened by ' + who + '. ' +",
            "      ((j.viewer && j.viewer.owner) ? 'Owner readings are not recorded.'",
            "        : 'Your reading is recorded for the author.'), 'bp-viewer');",
            "    if (j.viewer && j.viewer.email) {",
            "      var so = el('button', 'Not you? Sign out', 'bp-signout');",
            "      so.addEventListener('click', function () {",
            "        fetch('/api/auth/reader/logout', { method: 'POST' })",
            "          .then(function () { location.reload(); })",
            "          .catch(function () { location.reload(); });",
            "      });",
            "      ban.appendChild(document.createTextNode(' '));",
            "      ban.appendChild(so);",
            "    }",
            "    body.appendChild(ban);",
            "    var nimg = (typeof j.images === 'number') ? j.images : 0;",
            "    for (var k = 0; k < nimg; k++) {",
            "      var im = document.createElement('img');",
            "      im.className = 'bp-img';",
            "      im.alt = 'Blueprint drawing ' + (k + 1);",
            "      im.src = '/api/idea/' + encodeURIComponent(CFG.aid) + '/blueprint/image/' + k;",
            "      body.appendChild(im);",
            "    }",
            "    if (j.svg) {",
            "      var sheet = document.createElement('div');",
            "      sheet.className = 'bp-sheet';",
            "      sheet.innerHTML = j.svg;",
            "      body.appendChild(sheet);",
            "    }",
            "    (j.blocks || []).forEach(function (b) {",
            "      if (b.t === 'h2') body.appendChild(el('h2', b.s));",
            "      else if (b.t === 'h3') body.appendChild(el('h3', b.s));",
            "      else if (b.t === 'pre') body.appendChild(el('pre', b.s));",
            "      else if (b.t === 'hr') body.appendChild(document.createElement('hr'));",
            "      else if (b.t === 'q') {",
            "        var q = document.createElement('blockquote');",
            "        q.appendChild(el('p', b.s)); body.appendChild(q);",
            "      }",
            "      else if (b.t === 'ul') {",
            "        var u = document.createElement('ul');",
            "        (b.items || []).forEach(function (it) { u.appendChild(el('li', it)); });",
            "        body.appendChild(u);",
            "      }",
            "      else if (b.s) body.appendChild(el('p', b.s));",
            "    });",
            "    if (j.viewer && j.viewer.email) {",
            "      for (var i = 0; i < 14; i++) {",
            "        var w = el('div', j.viewer.email + ' · recorded', 'bp-wm');",
            "        w.style.top = String(260 + i * 430) + 'px';",
            "        body.appendChild(w);",
            "      }",
            "    }",
            "    body.hidden = false;",
            "    gate.hidden = true;",
            "    if (state) state.textContent =",
            "      (j.viewer && j.viewer.owner) ? 'OPEN · OWNER' : 'OPEN · RECORDED';",
            "    var op = document.getElementById('bpOpened');",
            "    if (op && typeof j.opened === 'number') op.textContent = String(j.opened);",
            "  }",
            "  function openBP() {",
            "    fetch('/api/idea/' + encodeURIComponent(CFG.aid) + '/blueprint')",
            "      .then(function (r) { return r.json(); })",
            "      .then(function (j) {",
            "        if (j.ok) { renderDoc(j); return; }",
            "        if (j.need === 'signin') {",
            "          CFG.signed = false;",
            "          say('Your sign-in has expired. Sign in again to open it.');",
            "          arm(); return;",
            "        }",
            "        if (j.need === 'unlock') {",
            "          CFG.paid = false;",
            "          say(j.error || 'This blueprint is priced by the author.');",
            "          arm(); return;",
            "        }",
            "        say(j.error || 'The blueprint could not be opened.');",
            "      })",
            "      .catch(function () { say('The blueprint could not be opened. Try again.'); });",
            "  }",
            "  function showOpenButton() {",
            "    mount.innerHTML = '';",
            "    var b = el('button', 'Open the blueprint', 'bp-open');",
            "    b.addEventListener('click', openBP);",
            "    mount.appendChild(b);",
            "  }",
            "  function showUnlockButton() {",
            "    mount.innerHTML = '';",
            "    var b = el('button', 'Unlock for $' + CFG.price, 'bp-open');",
            "    b.addEventListener('click', function () {",
            "      b.disabled = true;",
            "      b.textContent = 'One moment';",
            "      fetch('/api/idea/' + encodeURIComponent(CFG.aid) + '/blueprint/buy',",
            "        { method: 'POST' })",
            "        .then(function (r) { return r.json(); })",
            "        .then(function (j) {",
            "          if (j.already_paid) { CFG.paid = true; openBP(); return; }",
            "          if (j.ok) {",
            "            say(j.note || 'The invoice is on its way.');",
            "            mount.innerHTML = '';",
            "            if (j.invoice_url) {",
            "              var a2 = document.createElement('a');",
            "              a2.href = j.invoice_url;",
            "              a2.textContent = 'Open the invoice';",
            "              a2.target = '_blank';",
            "              a2.rel = 'noopener';",
            "              mount.appendChild(a2);",
            "            }",
            "            return;",
            "          }",
            "          say(j.error || 'The invoice could not be raised.');",
            "          b.disabled = false;",
            "          b.textContent = 'Unlock for $' + CFG.price;",
            "        })",
            "        .catch(function () {",
            "          say('The invoice could not be raised. Try again.');",
            "          b.disabled = false;",
            "          b.textContent = 'Unlock for $' + CFG.price;",
            "        });",
            "    });",
            "    mount.appendChild(b);",
            "  }",
            "  function armGoogle() {",
            "    var s = document.createElement('script');",
            "    s.src = 'https://accounts.google.com/gsi/client';",
            "    s.async = true; s.defer = true;",
            "    s.onload = function () {",
            "      try {",
            "        google.accounts.id.initialize({",
            "          client_id: CFG.cid,",
            "          callback: function (resp) {",
            "            fetch('/api/auth/google/session', {",
            "              method: 'POST',",
            "              headers: { 'Content-Type': 'application/json' },",
            "              body: JSON.stringify({ credential: resp && resp.credential })",
            "            }).then(function (r) { return r.json(); }).then(function (j) {",
            "              if (j.ok) { CFG.signed = true; openBP(); }",
            "              else say(j.error || 'Could not verify that sign-in.');",
            "            }).catch(function () { say('Could not verify that sign-in.'); });",
            "          }",
            "        });",
            "        google.accounts.id.renderButton(mount,",
            "          { theme: 'outline', size: 'large', text: 'continue_with', shape: 'pill' });",
            "      } catch (e) { say('Google sign-in did not load. Reload and try again.'); }",
            "    };",
            "    s.onerror = function () { say('Google sign-in did not load. Reload and try again.'); };",
            "    document.head.appendChild(s);",
            "  }",
            "  function arm() {",
            "    if (CFG.signed && CFG.price && !CFG.paid) { showUnlockButton(); return; }",
            "    if (CFG.signed) { showOpenButton(); return; }",
            "    if (CFG.enabled && CFG.cid) { armGoogle(); return; }",
            "  }",
            "  arm();",
            "})();",
            "</scr", "ipt>"])

    return Response("""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>%(title)s, a business idea on Plateau Strategy</title>
<meta name="description" content="%(desc)s">
<meta property="og:type" content="article">
<meta property="og:title" content="%(title)s">
<meta property="og:description" content="%(desc)s">
<meta property="og:url" content="%(url)s">
<meta property="og:site_name" content="Plateau Strategy Solution Lab">
<meta property="og:image" content="%(origin)s/share-card.jpg">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="%(title)s">
<meta name="twitter:description" content="%(desc)s">
<link rel="canonical" href="%(url)s">
<link rel="icon" type="image/svg+xml" href="/plateau-logo.svg">
<link rel="stylesheet" href="/paper.css">
<script src="/psx-net.js"></script>
<link rel="stylesheet" href="/modern.css">
<style>
  header img { height: 42px; width: 42px; border-radius: 50%%; }
  header .brand { font-size: 1.2rem; font-weight: 800; }
  header .right { margin-left: auto; display: flex; gap: 1.2rem; }
  .wrap { max-width: 44rem; }
  .idea-meta { color: var(--psx-text2, #6b6459); font-size: .93rem;
               margin: .3rem 0 1.6rem; }
  .idea-body p { margin: .9rem 0; font-size: 1.02rem; line-height: 1.65; }
  .idea-locked { border-left: 2px solid var(--psx-accent, #1f3a5f);
                 padding-left: 1rem; color: var(--psx-text2, #6b6459); }
  .idea-actions { display: flex; gap: .7rem; flex-wrap: wrap;
                  margin: 2.2rem 0 1rem; }
  .idea-actions button, .idea-actions a {
      display: inline-flex; align-items: center; justify-content: center;
      min-height: 44px; padding: .6rem 1.1rem; border-radius: 999px;
      border: 1px solid var(--psx-line, #e6e2da); background: none;
      color: inherit; font: inherit; font-weight: 600; cursor: pointer;
      text-decoration: none; }
  /* The language row. It sits IN the page rather than floating, because the
     floating globe on the main site is bottom-right, which is exactly where
     WeChat's own browser puts its toolbar, so on the one page most likely to
     be shared into WeChat, the control was invisible. */
  .lang-row { display: flex; flex-wrap: wrap; gap: .2rem .4rem;
              margin: 0 0 1.4rem; }
  .lang-row button { background: none; border: 0; font: inherit;
                     font-size: .95rem; font-weight: 600; cursor: pointer;
                     color: var(--psx-text2, #6b6459);
                     padding: .55rem .5rem; min-height: 44px;
                     border-bottom: 2px solid transparent; }
  .lang-row button[aria-current="true"] { color: #1f3a5f;
                     border-bottom-color: #1f3a5f; }
  @media (max-width: 640px) {
    .wrap { padding-left: 1.1rem; padding-right: 1.1rem; }
    .page-title { font-size: 1.55rem; line-height: 1.2; }
    .idea-body p { font-size: 1.06rem; }
    header .brand { font-size: 1rem; }
  }
  .idea-foot { color: var(--psx-text2, #6b6459); font-size: .93rem;
               border-top: 1px solid var(--psx-line, #e6e2da);
               margin-top: 2.4rem; padding-top: 1.2rem; }
  /* The blueprint: the sealed layer. Drawn in the site's sheet language,
     a bordered drawing with a title block, nothing filled behind a word. */
  .bp { border: 1px solid var(--psx-line, #e6e2da); border-radius: 10px;
        margin-top: 2.4rem; overflow: hidden; background: #fff; }
  .bp-head { display: flex; flex-wrap: wrap; gap: .3rem 1.4rem;
             padding: .55rem .9rem;
             border-bottom: 1px solid var(--psx-line, #e6e2da);
             font-size: .68rem; font-weight: 700; letter-spacing: .12em;
             text-transform: uppercase; color: var(--psx-text2, #6b6459); }
  .bp-head b { color: #1f3a5f; }
  .bp-note { padding: .9rem .9rem 0; margin: 0;
             color: var(--psx-text2, #6b6459); font-size: .93rem; }
  .bp-toc-h { padding: 1rem .9rem .1rem; font-size: .68rem; font-weight: 700;
              letter-spacing: .12em; text-transform: uppercase;
              color: var(--psx-text2, #6b6459); }
  .bp-toc { margin: .2rem 0 1rem; padding: 0 .9rem 0 2rem;
            color: var(--psx-text2, #6b6459); font-size: .93rem; }
  .bp-toc li { margin: .25rem 0; }
  #bpGate { padding: 0 .9rem 1.1rem; }
  .bp-gatenote { color: var(--psx-text2, #6b6459); font-size: .9rem;
                 border-left: 2px solid #1f3a5f; padding-left: .9rem; }
  .bp-open { font: inherit; font-weight: 700; min-height: 44px;
             padding: .6rem 1.2rem; border-radius: 999px;
             border: 1px solid #1f3a5f; color: #1f3a5f; background: none;
             cursor: pointer; }
  #bpBody { position: relative; padding: .4rem 1.2rem 1.4rem; overflow: hidden; }
  #bpBody h2 { font-size: 1.15rem; margin: 1.6rem 0 .4rem; }
  #bpBody h3 { font-size: 1rem; margin: 1.2rem 0 .3rem; }
  #bpBody p { margin: .7rem 0; line-height: 1.6; font-size: .98rem; }
  #bpBody pre { overflow-x: auto; background: #f6f8fb;
                border: 1px solid var(--psx-line, #e6e2da); border-radius: 8px;
                padding: .7rem .8rem; font-size: .8rem; line-height: 1.5; }
  #bpBody blockquote { border-left: 2px solid #1f3a5f; margin: .8rem 0;
                       padding: .1rem 0 .1rem .9rem;
                       color: var(--psx-text2, #6b6459); }
  #bpBody ul { margin: .6rem 0 .6rem 1.4rem; }
  #bpBody li { margin: .3rem 0; line-height: 1.55; }
  #bpBody hr { border: 0; border-top: 1px solid var(--psx-line, #e6e2da);
               margin: 1.4rem 0; }
  .bp-viewer { border: 1px solid var(--psx-line, #e6e2da);
               border-left: 3px solid #1f3a5f; border-radius: 8px;
               padding: .6rem .8rem; font-size: .85rem;
               color: var(--psx-text2, #6b6459); margin: .9rem 0 0; }
  .bp-signout { background: none; border: 0; padding: 0; margin-left: .3rem;
                font: inherit; font-size: .8rem; color: #1f3a5f;
                text-decoration: underline; cursor: pointer; }
  .bp-sheet { margin: 1.1rem 0 .4rem; border: 1px solid var(--psx-line, #e6e2da);
              border-radius: 8px; overflow: hidden; }
  .bp-sheet svg { display: block; width: 100%%; height: auto; }
  .bp-img { display: block; max-width: 100%%; margin: 1.1rem 0 .4rem;
            border: 1px solid var(--psx-line, #e6e2da); border-radius: 8px; }
  .bp-wm { position: absolute; left: 8%%; transform: rotate(-18deg);
           opacity: .055; font-weight: 800; font-size: 1.5rem;
           white-space: nowrap; pointer-events: none; user-select: none; }
</style>
</head>
<body data-arm="company">
<div style="position:absolute;left:-9999px;top:0;width:300px;height:300px;overflow:hidden" aria-hidden="true"><img src="/share-card.jpg" width="300" height="300" alt=""></div>
<header>
  <img src="/icon-192.png" alt="Plateau Strategy Solution Lab logo">
  <span class="brand">Plateau Strategy Solution Lab</span>
  <div class="right"><a href="/">Home</a></div>
</header>
<div class="wrap">
  %(lang_row)s
  <div class="page-title" id="ideaTitle">%(title)s</div>
  <p class="idea-meta">Posted by %(author)s%(when)s · %(likes)s interested</p>
  <div class="idea-body" id="ideaBody">%(paras)s</div>
  %(locked_note)s
  %(bp_section)s
  <div class="idea-actions">
    <button id="shareBtn">Share this idea</button>
    <a href="/#reinvestment">See every idea</a>
  </div>
  <p class="idea-foot">Anyone can post a business idea on Plateau Strategy:
  free, no account needed. Ideas are read, discussed and, when they are ready,
  worked up into what it would actually take to start them.</p>
</div>
<script>
// Swapping the article between languages. The whole piece is already in the
// page, so switching is instant and works with no network, which matters in
// an in-app browser on a phone.
(function () {
  var TR = %(trs_json)s;
  var EN = { title: document.getElementById("ideaTitle").textContent,
             body: document.getElementById("ideaBody").innerHTML };
  function paras(list) {
    return list.map(function (s) {
      var d = document.createElement("p");
      d.textContent = s;
      return d.outerHTML;
    }).join("");
  }
  function show(l) {
    var t = l === "en" ? EN : TR[l];
    if (!t) return;
    document.getElementById("ideaTitle").textContent = t.title || EN.title;
    document.getElementById("ideaBody").innerHTML =
      l === "en" ? EN.body : paras(t.paras || []);
    document.documentElement.lang = l;
    Array.prototype.forEach.call(document.querySelectorAll(".lang-row button"), function (b) {
      b.setAttribute("aria-current", b.getAttribute("data-l") === l ? "true" : "false");
    });
    try { localStorage.setItem("psx_lang", l); } catch (e) {}
  }
  Array.prototype.forEach.call(document.querySelectorAll(".lang-row button"), function (b) {
    b.addEventListener("click", function () {
      var l = b.getAttribute("data-l");
      if (l === "en" || TR[l]) { show(l); return; }
      /* Not translated yet: fetch it live. The reader sees the button
         working, then the article in their language; on failure they are
         told plainly instead of being left staring at English. */
      var was = b.textContent;
      b.textContent = was + " …";
      b.disabled = true;
      fetch("/api/idea/" + encodeURIComponent(%(aid_js)s) + "/translate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang: l })
      }).then(function (r) { return r.json(); }).then(function (j) {
        b.disabled = false; b.textContent = was;
        if (j.ok && j.translation) {
          var t = j.translation;
          var paras2 = t.paras && t.paras.length ? t.paras
            : (t.body || "").split(String.fromCharCode(10)).filter(function (s) { return s.trim(); });
          TR[l] = { title: t.title || "", paras: paras2 };
          b.removeAttribute("data-missing");
          show(l);
        } else {
          b.textContent = was + " (not available yet)";
          setTimeout(function () { b.textContent = was; }, 3000);
        }
      }).catch(function () {
        b.disabled = false;
        b.textContent = was + " (not available yet)";
        setTimeout(function () { b.textContent = was; }, 3000);
      });
    });
  });
  // Follow the choice already made elsewhere on the site, if this piece has it.
  try {
    var saved = localStorage.getItem("psx_lang");
    if (saved && saved !== "en" && TR[saved]) show(saved);
  } catch (e) {}
})();
</script>
<script>
  /* Native sheet on a phone, clipboard everywhere else. Both end with the
     link somewhere the person can paste it, which is the only job. */
  document.getElementById('shareBtn').addEventListener('click', async function () {
    var btn = this, url = %(url_js)s + '?s=%(share_tag)s', title = %(title_js)s;
    if (navigator.share) {
      try { await navigator.share({ title: title, url: url }); return; }
      catch (e) { if (e && e.name === 'AbortError') return; }
    }
    try {
      await navigator.clipboard.writeText(url);
      btn.textContent = 'Link copied';
    } catch (e) {
      btn.textContent = url;          /* select-and-copy fallback */
    }
    setTimeout(function () { btn.textContent = 'Share this idea'; }, 2500);
  });
</script>
%(bp_script)s
<script src="/i18n.js"></script>
</body>
</html>""" % {
        "title": e(title), "author": e(author), "desc": e(desc),
        "url": url, "origin": SITE_ORIGIN, "paras": paras,
        "locked_note": locked_note,
        "when": (" on " + when) if when else "",
        "likes": pub.get("likes", 0),
        # json.dumps, not quote-wrapping: it escapes the quotes, backslashes and
        # the </script> sequence that would otherwise end the block early.
        "url_js": json.dumps(url), "title_js": json.dumps(title),
        "aid_js": json.dumps(a.get("id") or aid),
        "share_tag": _content_hash(a.get("title"), a.get("body"))[:6],
        "lang_row": lang_row, "trs_json": trs_json,
        "bp_section": bp_section, "bp_script": bp_script,
    }, mimetype="text/html")


@app.route("/api/articles", methods=["POST"])
def api_article_create():
    data = request.get_json(force=True, silent=True) or {}
    author = _no_tags((data.get("author") or "").strip())
    title = _no_em_dash(_no_tags((data.get("title") or "").strip()), title=True)
    body = _no_em_dash(_no_tags((data.get("body") or "").strip()))
    # The optional sealed layer. Kept aside here and attached only after the
    # article exists, keyed to the stored text, because the hash must match
    # what actually went on the board, not what was typed. The picture goes
    # through the raster validator; anything that fails it is dropped and
    # the poster is told below, never silently.
    bp_text = (data.get("blueprint") or "").strip()
    bp_img_raw = data.get("blueprint_image")
    bp_img = _bp_image_from_data_url(bp_img_raw) if bp_img_raw else None
    if bp_img_raw and not bp_img:
        return jsonify({"ok": False, "error":
                        "The drawing could not be used. A PNG, JPEG or WebP "
                        "under 3 MB works."}), 400
    if not author or not title or not body:
        return jsonify({"ok": False, "error": "Your name, a title and body are all required."}), 400
    with _LOCK:
        items = _load(ARTICLES_PATH)
        ok, why = _idea_rate_ok(items)
        if not ok:
            return jsonify({"ok": False, "error": why}), 429
        now = datetime.datetime.now()
        # Posting is idempotent. Two layers, because the exact-hash guard
        # alone was beaten within hours: the owner pasted the same article
        # by hand with different line breaks, the fingerprint differed by a
        # few bytes, and the board carried the same piece twice again.
        #
        # Layer 1, exact content: same fingerprint returns the existing
        # article. Layer 2, same TITLE already visible on the board: also
        # treated as the same piece, existing article returned. On an idea
        # board a reused title IS the same idea; whoever genuinely has a
        # second thing to say can give it its own name, and the note tells
        # them so.
        h_new = _content_hash(title, body)
        t_new = " ".join(title.lower().split())
        for a in items:
            if a.get("hidden"):
                continue
            same_text = _content_hash(a.get("title"), a.get("body")) == h_new
            same_title = " ".join((a.get("title") or "").lower().split()) == t_new
            if same_text or same_title:
                note = ("This exact text is already on the board."
                        if same_text else
                        "An idea with this exact title is already on the board. "
                        "If yours is different, give it its own title.")
                # A blueprint brought along with a duplicate is NOT silently
                # attached to the piece already standing, that piece may be
                # someone else's, and it is not silently dropped either; the
                # poster is told what happened to it.
                if bp_text or bp_img:
                    note += (" The blueprint you attached was not saved; "
                             "post your own version under its own title to seal it.")
                return jsonify({"ok": True, "article": _public_article(a),
                                "duplicate": True, "note": note})

        article = {
            "id": _next_id(items, "ART", datestamp=False),
            "ip": _client_ip(),          # for the rate limit only; never published
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
        # Read the article and work out which trades it calls for. Stored ON the
        # article so the summary at the foot of it is the same list every time it
        # is read, rather than something recomputed and drifting.
        try:
            import professional_match
            article["professionals"] = professional_match.professionals_for(title, body)
        except Exception:
            article["professionals"] = None
        items.append(article)
        _save(ARTICLES_PATH, items)
    # The sealed layer, if the poster brought one, text, a drawing, or
    # both. Outside the article lock, _bp_attach takes the same lock itself
    # and threading.Lock does not re-enter. A failed attach must not
    # un-post the idea.
    if bp_text or bp_img:
        try:
            _bp_attach(article["title"], article["body"], bp_text, "poster",
                       images=[bp_img] if bp_img else None)
        except Exception:
            pass
    # And count the demand, outside the lock the save holds.
    try:
        if article.get("professionals"):
            _record_profession_demand(article["professionals"], title)
        # translation starts now, in the background, anchored to this exact
        # text; it appears when it is done and costs the post nothing
        try:
            import translator
            translator.translate_async(title, body)
        except Exception:
            pass
    except Exception:
        pass
    return jsonify({"ok": True, "article": _public_article(article)})


@app.route("/api/idea/<aid>/translate", methods=["POST"])
def api_idea_translate(aid):
    """Translate one article into one language, the moment a reader needs it.

    The background translator still runs on every post; this is the same
    engine reached on demand, so a piece nobody has yet opened in Korean
    still reads in Korean the first time someone does, instead of showing
    English until a reload. A hit on either store is free; a miss makes one
    model call and caches it for everyone after. A locked piece ships no
    body and so no translation of one.
    """
    data = request.get_json(force=True, silent=True) or {}
    lang = (data.get("lang") or request.args.get("lang") or "").strip().lower()
    if not lang or lang == "en":
        return jsonify({"ok": False, "reason": "unsupported"}), 400
    a = next((x for x in _load(ARTICLES_PATH)
              if x.get("id") == aid and not x.get("hidden")), None)
    if not a:
        return jsonify({"ok": False, "reason": "not_found"}), 404
    if (a.get("lock") or {}) and not _entitled(a):
        return jsonify({"ok": False, "reason": "locked"}), 403
    title, body = a.get("title"), a.get("body")
    try:
        import translator
    except Exception:
        return jsonify({"ok": False, "reason": "no_key"}), 200
    if lang not in getattr(translator, "LANGS", []) and \
       lang not in getattr(translator, "LANG_NAMES", {}):
        return jsonify({"ok": False, "reason": "unsupported"}), 400
    # Already translated, in either store? Hand it back for free.
    have = _translations_for(title, body).get(lang)
    if have:
        return jsonify({"ok": True, "translation": have, "cached": True})
    if not translator.available():
        return jsonify({"ok": False, "reason": "no_key"}), 200
    res = translator.translate_now(title, body, lang)
    if not res:
        return jsonify({"ok": False, "reason": "failed"}), 200
    return jsonify({"ok": True, "translation": {
        "title": res.get("title") or "", "body": res.get("body") or "",
        "paras": res.get("paras") or []}})


# ---------- seeding a few articles the deploy should carry ----------
# The board lives in runtime data that a deploy does not carry. Almost nothing
# belongs in the code, but the IP Launchpad proposal is a special case: it was
# lost when the data disk was being wiped on every deploy, before that bug was
# found, and it was recovered from its own translations. This ships it in the
# code and puts it back on the board on the first boot that has a real disk.
#
# Idempotent two ways so it can never duplicate and can never come back once
# taken down:
#   * a seed already on the board (matched by its fixed stamp) is skipped;
#   * a seed recorded in the marker is skipped even after it leaves the board,
#     so deleting a seeded post with the Dispatch button keeps it gone.
#
# It runs ONLY where DATA_DIR is a real disk (production). Locally and under the
# tests DATA_DIR == BASE_DIR, so this returns at once and never writes a seed
# into a working tree or a test's board.
SEED_ARTICLES_PATH = os.path.join(BASE_DIR, "seed_articles.json")
SEED_MARKER_PATH = _data_path("seeded_articles.json")


def _seed_articles_once():
    # Run on production, whether or not a persistent disk is attached yet.
    # DATA_DIR != BASE_DIR means a real disk (seeds and persists). RENDER_GIT_COMMIT
    # means we are on Render even with no disk, where DATA_DIR falls back to the
    # app's own ephemeral folder: seeding there re-runs every deploy, so the
    # article stays visible while the disk is being sorted. Locally and under the
    # tests neither is true, so this returns at once and never writes into a
    # working tree. (The tests that DO exercise it point the paths at a temp dir.)
    if DATA_DIR == BASE_DIR and not os.environ.get("RENDER_GIT_COMMIT"):
        return
    try:
        seeds = _load(SEED_ARTICLES_PATH)
    except Exception:
        seeds = None
    if not isinstance(seeds, list) or not seeds:
        return
    added = []
    try:
        with _LOCK:
            done = _load(SEED_MARKER_PATH)
            done = set(done) if isinstance(done, list) else set()
            items = _load(ARTICLES_PATH)
            if not isinstance(items, list):
                items = []
            have = {a.get("stamp") for a in items}
            changed = False
            for s in seeds:
                sid = s.get("seed_id") or s.get("stamp")
                stamp = (s.get("stamp") or "").strip()
                if not sid or not stamp:
                    continue
                if sid in done or stamp in have:
                    continue
                title = _no_em_dash(_no_tags((s.get("title") or "").strip()), title=True)
                body = _no_em_dash(_no_tags((s.get("body") or "").strip()))
                author = _no_tags((s.get("author") or "").strip()) or "Anonymous"
                if not title or not body:
                    continue
                try:
                    created = datetime.datetime.strptime(
                        stamp, "%Y%m%d%H%M%S").isoformat(timespec="seconds")
                except Exception:
                    created = datetime.datetime.now().isoformat(timespec="seconds")
                art = {
                    "id": _next_id(items, "ART", datestamp=False),
                    "author": author[:80],
                    "created_at": created,
                    "stamp": stamp,
                    "title": title[:200],
                    "body": body[:20000],
                    "likes": 0, "unlikes": 0, "followers": [], "launchers": [],
                    "seeded": True,
                }
                try:
                    import professional_match
                    art["professionals"] = professional_match.professionals_for(title, body)
                except Exception:
                    art["professionals"] = None
                items.append(art)
                have.add(stamp)
                done.add(sid)
                added.append((title, body))
                changed = True
            if changed:
                _save(ARTICLES_PATH, items)
                _save(SEED_MARKER_PATH, sorted(done))
    except Exception:
        return
    for title, body in added:
        try:
            import translator
            translator.translate_async(title, body)
        except Exception:
            pass


def _seed_book_fields_once():
    """The shipped book's curated senses reach a persistent copy.

    _data_path copies destinations.json to the data disk exactly once, so
    a registry improvement in the repo, a new ferry, an admission price,
    a spoken guide, would never reach a site already running on a disk.
    This overlays the shipped entries' curated fields onto the live copy
    by city and name, and adds shipped entries the copy lacks, while
    never touching anything visitors taught the site."""
    try:
        shipped_path = os.path.join(BASE_DIR, "destinations.json")
        live_path = _data_path("destinations.json")
        if os.path.abspath(shipped_path) == os.path.abspath(live_path):
            return                      # no disk: the repo copy IS the book
        with open(shipped_path) as f:
            shipped = json.load(f)
        with _LOCK:
            try:
                with open(live_path) as f:
                    live = json.load(f)
            except Exception:
                live = {"cities": {}, "entries": []}
            idx = {}
            for e in live.get("entries") or []:
                idx[(e.get("city"), (e.get("name") or "").lower())] = e
            changed = False
            for srce in shipped.get("entries") or []:
                k = (srce.get("city"), (srce.get("name") or "").lower())
                tgt = idx.get(k)
                if tgt is None:
                    live.setdefault("entries", []).append(srce)
                    changed = True
                    continue
                for fld in ("admission_usd", "tickets_url", "slug", "ferry", "audio"):
                    if fld in srce and tgt.get(fld) != srce[fld]:
                        tgt[fld] = srce[fld]
                        changed = True
            for ck, cv in (shipped.get("cities") or {}).items():
                if ck not in (live.get("cities") or {}):
                    live.setdefault("cities", {})[ck] = cv
                    changed = True
            if changed:
                _save(live_path, live)
    except Exception:
        pass


def _seed_blueprint_once():
    """Seal the drafted Reinvestment USA framework under its own article.

    The launchpad's founding article carries the launchpad's own blueprint,
    which makes the board's first idea a working demonstration of the
    product: article public, plan sealed, readers named. The framework part
    of REINVESTMENT_USA.md is the blueprint; the debate appendix after THE
    FULL MACHINE marker is internal counsel and stays out.

    Runs every boot under the same gate as the article seeder, because the
    runtime store is wiped by every deploy until the disk is attached. The
    repo copy is canonical for the seeded entry; a blueprint attached any
    other way is never overwritten."""
    if DATA_DIR == BASE_DIR and not os.environ.get("RENDER_GIT_COMMIT"):
        return
    try:
        with open(os.path.join(BASE_DIR, "REINVESTMENT_USA.md"), encoding="utf-8") as f:
            md = f.read()
        cut = md.find("\n# THE FULL MACHINE")
        if cut > 0:
            md = md[:cut]
        # The picture blueprint. The owner's prints, lifted from his
        # Reinvestment white paper, lead; our drawn RE-02 sheet follows.
        # Both come from this repo, the only source markup or seeded
        # pictures are ever accepted from, and the prints still pass the
        # same byte validator as any poster upload.
        svg = ""
        try:
            with open(os.path.join(BASE_DIR, "reinvestment_blueprint.svg"),
                      encoding="utf-8") as f:
                svg = f.read()
        except Exception:
            svg = ""
        images = []
        try:
            pdir = os.path.join(BASE_DIR, "seed_prints")
            for name in sorted(os.listdir(pdir)):
                mime = {"png": "image/png", "jpg": "image/jpeg",
                        "jpeg": "image/jpeg", "webp": "image/webp"}.get(
                            name.rsplit(".", 1)[-1].lower())
                if not mime:
                    continue
                with open(os.path.join(pdir, name), "rb") as f:
                    img = _bp_image_from_bytes(f.read(), mime)
                if img:
                    images.append(img)
        except Exception:
            images = []
        art = next((a for a in _load(ARTICLES_PATH)
                    if a.get("stamp") == "20260811210000" and not a.get("hidden")), None)
        if not art:
            return
        bp, _h = _bp_entry(art.get("title"), art.get("body"))
        if bp:
            if bp.get("source") != "seed":
                return
            # Unchanged content keeps its original attached_at; the whole
            # pitch of the feature is honest timestamps, and a date that
            # quietly reset on every deploy would be the opposite.
            if ((bp.get("md") or "") == _no_em_dash(md.strip())[:40000]
                    and (bp.get("svg") or "") == svg
                    and [i.get("b64") for i in (bp.get("images") or [])]
                        == [i.get("b64") for i in images]):
                return
        # $14, Sean's price, 2026-08-15. Set at attach time only, so a
        # price the owner changes later on a persistent disk is never
        # overwritten by a boot.
        _bp_attach(art.get("title"), art.get("body"), md, "seed",
                   bp_title="Reinvestment USA, the framework",
                   images=images, svg=svg, price_usd=14)
    except Exception:
        return


@app.route("/api/articles/<aid>/lock", methods=["POST"])
@owner_required
def api_article_lock(aid):
    """Put a price on a piece, or take it off.

    Owner-only, and that is a deliberate limit rather than a placeholder. The
    obvious next step is letting a verified attorney lock their own answer,
    and it is NOT built here because it cannot be built correctly until the
    money question below is settled, who charges whom decides whether the
    attorney is a seller on this platform or a professional whose fee never
    touches it, and those are different systems.

    See ATTORNEY_ACCESS.md. Short version: Washington RPC 5.4(a) bars a lawyer
    from sharing legal fees with a non-lawyer. If Plateau takes a percentage
    of what an attorney is paid for legal advice, the exposure lands on the
    attorney's licence, not just on this company. That is a question for a
    lawyer to answer before a line of payment code is written, which is why
    this endpoint records a price and an unlock and captures no money."""
    d = request.get_json(silent=True) or {}
    if d.get("unlock_forever"):
        with _LOCK:
            items = _load(ARTICLES_PATH)
            for a in items:
                if a.get("id") == aid:
                    a.pop("lock", None)
                    _save(ARTICLES_PATH, items)
                    return jsonify({"ok": True, "locked": False})
        return jsonify({"ok": False, "error": "No idea with that id."}), 404

    try:
        price = round(float(d.get("price_usd")), 2)
    except (TypeError, ValueError):
        return jsonify({"ok": False, "error": "A price in dollars is required."}), 400
    if price <= 0:
        return jsonify({"ok": False, "error": "A locked piece needs a price above zero."}), 400
    teaser = _no_tags((d.get("teaser") or "").strip())[:600]
    by = _no_tags((d.get("by") or "").strip())[:120]
    if not teaser:
        return jsonify({"ok": False, "error":
                        "A teaser is required, a lock with nothing to read is not an offer."}), 400
    with _LOCK:
        items = _load(ARTICLES_PATH)
        for a in items:
            if a.get("id") == aid:
                a["lock"] = {"price_usd": price, "teaser": teaser, "by": by}
                a.setdefault("unlocked_by", [])
                _save(ARTICLES_PATH, items)
                return jsonify({"ok": True, "locked": True, "price_usd": price})
    return jsonify({"ok": False, "error": "No idea with that id."}), 404


@app.route("/api/articles/<aid>/grant", methods=["POST"])
@owner_required
def api_article_grant(aid):
    """Give one reader access to one locked piece.

    Owner-only because nothing here takes payment yet. When a rail is wired in
    it calls this after the money has actually settled, which is the reason
    granting is its own step rather than something the checkout page does:
    a reader must never be able to reach this by asking."""
    vid = ((request.get_json(silent=True) or {}).get("vid") or "").strip()[:64]
    if not vid:
        return jsonify({"ok": False, "error": "A reader id is required."}), 400
    with _LOCK:
        items = _load(ARTICLES_PATH)
        for a in items:
            if a.get("id") == aid:
                lst = a.setdefault("unlocked_by", [])
                if vid not in lst:
                    lst.append(vid)
                    _save(ARTICLES_PATH, items)
                return jsonify({"ok": True, "readers": len(lst)})
    return jsonify({"ok": False, "error": "No idea with that id."}), 404


@app.route("/api/articles/<aid>/hide", methods=["POST"])
@owner_required
def api_article_hide(aid):
    """Take an idea off the public board, or put it back.

    The board publishes instantly and on purpose, so this is the other half of
    that decision: something has to be able to remove what should not be on a
    company's domain. It sets a flag rather than deleting, a takedown should
    not also destroy the record of what was posted."""
    on = bool((request.get_json(silent=True) or {}).get("hidden", True))
    with _LOCK:
        items = _load(ARTICLES_PATH)
        for a in items:
            if a.get("id") == aid:
                a["hidden"] = on
                _save(ARTICLES_PATH, items)
                return jsonify({"ok": True, "hidden": on})
    return jsonify({"ok": False, "error": "No idea with that id."}), 404


@app.route("/api/articles/<aid>/delete", methods=["POST"])
@owner_required
def api_article_delete(aid):
    """Remove an idea outright. Hide and delete are different verbs on
    purpose: hide is a TAKEDOWN, somebody else's post comes off the board
    but the record of what was posted survives, which is the record you want
    if it ever has to be shown to anyone. Delete is for the owner clearing
    their own drafts and tests, where keeping a tombstone serves nobody.
    Sean's first use was his own June test post, #20260630210246."""
    with _LOCK:
        items = _load(ARTICLES_PATH)
        keep = [a for a in items if a.get("id") != aid]
        if len(keep) == len(items):
            return jsonify({"ok": False, "error": "No idea with that id."}), 404
        _save(ARTICLES_PATH, keep)
    # /idea/<aid> now 404s and the sitemap drops it on next read, both come
    # straight from the file, so there is nothing else to clean.
    return jsonify({"ok": True, "deleted": aid})


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
    """Register interest to INVEST in this business idea, an email left here
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
    """Register interest to LAUNCH/run this business idea, same lead-only
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
# ARCHIVE, one owner-only home for every paper trail the site produces.
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
    """Every captured email/phone across the whole site, de-duped, the marketing list."""
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
    """One row per day, newest first, page views, unique visitors, and the
    two tourist-facing tools (Trip Planner, Destination Book) broken out
    separately since that's usage, not just traffic."""
    data = _load_traffic()
    out = []
    for date in sorted(data["days"].keys(), reverse=True):
        rec = data["days"][date]
        paths = rec.get("paths", {})
        uniq = rec.get("unique_visitors")
        if uniq is None:  # today, still open, computed live from the raw ids
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
    """One row per day per source, where visitors came from, and what those
    visits turned into. This is how an ad gets judged: a source with visits and
    no bookings is spend that isn't working, whichever way the pageview line
    moved.

    A source can show conversions with zero visits that day, the psx_src
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
    ephemeral, no identity, no history, nothing written to disk."""
    if not _skip_traffic():
        _presence_touch(request.cookies.get("psx_vid"))
    n = _presence_count()
    return jsonify({"ok": True, "online": n, "window_minutes": _PRESENCE_WINDOW // 60})


def _load_professions():
    try:
        with open(_data_path("professions.json")) as f:
            d = json.load(f)
            return d if isinstance(d, dict) else {}
    except Exception:
        return {}


def _record_profession_demand(result, title):
    """Every recognised trade becomes a standing slot on the platform.

    This is the collection step. An idea is posted, the trades it needs are
    recognised, and each one is written down with a count and the ideas that
    called for it. Nobody curates the list, it is built entirely by what
    people actually ask for, so the platform only ever grows spots there is
    real demand for.

    The consequence worth naming: a trade with 6 ideas waiting and nobody
    signed up is not an empty page, it is a recruiting pitch with evidence.
    """
    try:
        with _LOCK:
            store = _load_professions()
            matched = [p for p in (result.get("matched") or [])
                       if p.get("tier", "likely") == "likely"]
            for pro in matched + (result.get("always") or []):
                slug = pro.get("slug")
                if not slug:
                    continue
                rec = store.setdefault(slug, {
                    "slug": slug, "label": pro.get("label", slug),
                    "why": pro.get("why", ""), "domain": pro.get("domain", ""),
                    "demand": 0, "ideas": [], "claimed_by": [],
                    "first_seen": datetime.date.today().isoformat()})
                rec["demand"] += 1
                rec["last_seen"] = datetime.date.today().isoformat()
                t = (title or "").strip()[:120]
                if t and t not in rec["ideas"]:
                    rec["ideas"].insert(0, t)
                    del rec["ideas"][12:]
            _save(_data_path("professions.json"), store)
    except Exception:
        pass          # collection must never break posting an idea


@app.route("/professionals")
def professionals_page():
    """The trades directory, generated from demand, not curated by hand."""
    return send_file(os.path.join(BASE_DIR, "professionals.html"))


def _a_or_an(word):
    """"a IP attorney" was on screen. Acronyms are read letter by letter, so
    the article follows how the first letter SOUNDS, not how it is spelled:
    an IP attorney, an MBA, an FBI agent, but a CPA, a HIPAA consultant."""
    w = (word or "").strip()
    if not w:
        return "a"
    first = w.split()[0].strip(".,/")
    # Acronyms said as a word, not spelled out: "a HIPAA consultant", not "an".
    SAID_AS_WORD = {"HIPAA", "NASA", "OSHA", "FEMA", "NATO", "NAFTA", "FICO"}
    if first.isupper() and len(first) > 1 and first not in SAID_AS_WORD:
        return "an" if first[0] in "AEFHILMNORSX" else "a"
    return "an" if first[0].lower() in "aeiou" else "a"


@app.route("/trade/<slug>")
def trade_page(slug):
    """Every idea that needs this trade, on one page, each one a link.

    This is the join the owner asked for: a professional should land on
    their trade and see the work waiting for them, with the evidence, not
    a list of trades in one place and a list of ideas in another. It is a
    plain URL on purpose, so it can be sent to a professional directly.

    Ideas are grouped by how sure the engine is. "Plainly about it" is the
    likely tier; "touches it" is the possible tier, shown dimmer, because
    a professional's time is the scarce thing here and the page should
    spend it on the strong matches first.
    """
    slug = (slug or "").strip().lower()
    label, why = slug.replace("-", " ").title(), ""
    store = _load_professions()
    if slug in store:
        label = store[slug].get("label") or label
        why = store[slug].get("why") or ""
    is_always = slug in {s for s, _l, _w in __import__("professional_match").ALWAYS}

    likely, possible = [], []
    for a in _rerecognize_stale(_load(ARTICLES_PATH)):
        if a.get("hidden"):
            continue
        pr = a.get("professionals") or {}
        me = next((x for x in (pr.get("matched") or []) if x.get("slug") == slug), None)
        if me is None and is_always:
            me = next((x for x in (pr.get("always") or []) if x.get("slug") == slug), None)
        if me is None:
            continue
        ev = ", ".join(next((d.get("evidence") or [] for d in (pr.get("domains") or [])
                             if d.get("name") == me.get("domain")), [])[:4])
        row = (a, ev)
        (likely if me.get("tier", "likely") == "likely" or is_always else possible).append(row)

    e = _no_tags

    def rows(pairs):
        out = []
        for a, ev in pairs:
            out.append(
                '''<a class="tr-item" href="/idea/%s">
                     <div class="tr-t">%s</div>
                     <div class="tr-m">by %s%s</div>
                     <p class="tr-x">%s</p>
                   </a>''' % (
                    e(a.get("id")), e(a.get("title") or ""),
                    e(a.get("author") or "someone"),
                    (" &middot; the words that called for you: " + e(ev)) if ev else "",
                    e((_og_description(a.get("body") or "") or "")[:200])))
        return "".join(out)

    n = len(likely) + len(possible)
    sections = ""
    if likely:
        sections += '<div class="tr-group">%s</div>' % rows(likely)
    if possible:
        sections += ('<div class="tr-sub">Touches it, less certain</div>'
                     '<div class="tr-group tr-dim">%s</div>' % rows(possible))
    if not n:
        sections = ('''<p class="tr-empty">Nothing posted needs this yet. When
                    somebody posts an idea that does, it appears here on its
                    own, and this address stays the same. Worth keeping.</p>''')

    if is_always:
        lede = ("Every business posted here needs %s %s. %d idea%s on the board right now."
                % (_a_or_an(label), label, n, "" if n == 1 else "s"))
    elif n:
        lede = ("%d idea%s posted here plainly need%s %s %s."
                % (n, "" if n == 1 else "s", "s" if n == 1 else "",
                   _a_or_an(label), label))
    else:
        lede = "Nothing posted yet that needs %s %s." % (_a_or_an(label), label)

    return Response("""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Ideas that need %(an)s %(label)s, Plateau Strategy</title>
<meta name="description" content="%(lede)s">
<meta property="og:title" content="Ideas that need %(an)s %(label)s">
<meta property="og:description" content="%(lede)s">
<meta property="og:url" content="%(origin)s/trade/%(slug)s">
<meta property="og:site_name" content="Plateau Strategy Solution Lab">
<meta property="og:image" content="%(origin)s/share-card.jpg">
<meta name="twitter:card" content="summary">
<link rel="canonical" href="%(origin)s/trade/%(slug)s">
<link rel="icon" type="image/png" sizes="32x32" href="/icon-32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<meta name="apple-mobile-web-app-title" content="Plateau">
<meta name="theme-color" content="#1f3a5f">
<link rel="stylesheet" href="/paper.css">
<link rel="stylesheet" href="/modern.css">
<style>
  header img { height: 42px; width: 42px; border-radius: 50%%; }
  header .brand { font-size: 1.2rem; font-weight: 800; }
  header .right { margin-left: auto; display: flex; gap: 1.2rem; }
  .wrap { max-width: 44rem; }

  /* the chapter opening every section of the site now gets: a hairline the
     width of the column with a short navy mark at its centre */
  .tr-open { position: relative; height: 1px; background: var(--m-line-firm, #d3d3da);
             margin: 2.2rem 0 2.6rem; }
  .tr-open::after { content: ""; position: absolute; top: -1px; left: 50%%;
                    transform: translateX(-50%%); width: 64px; height: 3px;
                    background: #1f3a5f; }

  .tr-lede { color: var(--psx-text2, #6b6459); margin: .4rem 0 0; max-width: 58ch; }
  .tr-why  { color: var(--psx-text2, #6b6459); margin: .4rem 0 0; font-size: .95rem; }

  .tr-group { margin-top: 1.6rem; }
  .tr-sub { font-size: .72rem; font-weight: 700; letter-spacing: .12em;
            text-transform: uppercase; color: var(--psx-text2, #6b6459);
            margin: 2.2rem 0 .2rem; }
  .tr-dim .tr-t { color: var(--psx-text2, #6b6459); }

  .tr-item { display: block; text-decoration: none; color: inherit;
             padding: 1.2rem 0; border-top: 1px solid var(--psx-line, #e6e2da); }
  .tr-group .tr-item:first-child { border-top: 0; }
  .tr-t { font-weight: 700; font-size: 1.12rem; color: var(--psx-text, #1b1b1f);
          line-height: 1.35; }
  .tr-item:hover .tr-t { color: #1f3a5f; }
  .tr-m { color: var(--psx-text2, #6b6459); font-size: .86rem; margin: .3rem 0 .55rem; }
  .tr-x { margin: 0; color: var(--psx-text2, #6b6459); font-size: .97rem; line-height: 1.6; }
  .tr-empty { color: var(--psx-text2, #6b6459); }

  .tr-cta { border-top: 1px solid var(--psx-line, #e6e2da); margin-top: 2.6rem;
            padding-top: 1.5rem; }
  .tr-cta p { margin: 0 0 .8rem; }
  .tr-cta a { font-weight: 700; }

  @media (max-width: 640px) {
    .wrap { padding-left: 1.1rem; padding-right: 1.1rem; }
    header .brand { font-size: 1rem; }
    .page-title { font-size: 1.5rem; line-height: 1.22; }
  }
</style>
</head>
<body data-arm="company">
<div style="position:absolute;left:-9999px;top:0;width:300px;height:300px;overflow:hidden" aria-hidden="true"><img src="/share-card.jpg" width="300" height="300" alt=""></div>
<header>
  <img src="/icon-192.png" alt="Plateau Strategy Solution Lab">
  <span class="brand">Plateau Strategy Solution Lab</span>
  <div class="right"><a href="/">Home</a></div>
</header>
<div class="wrap">
  <div class="tr-open" role="presentation"></div>
  <div class="page-title">Ideas that need %(an)s %(label)s</div>
  <p class="tr-lede">%(lede)s</p>
  %(why_line)s
  %(sections)s
  <div class="tr-cta">
    <p>If this is your licence, any idea above is work you can answer once and
       sell to everyone who needs the same answer. You set the price and keep
       most of it.</p>
    <p><a href="/#reinvestment">Register as a professional</a> &nbsp;&middot;&nbsp;
       <a href="/professionals">See every trade being a<script src="/i18n.js"></script>
sked for</a></p>
  </div>
</div>
</body>
</html>""" % {"label": e(label), "lede": e(lede), "sections": sections,
              "an": _a_or_an(label), "slug": e(slug), "origin": SITE_ORIGIN,
              "why_line": ('<p class="tr-why">%s</p>' % e(why)) if why else ""},
        mimetype="text/html")


@app.route("/api/professions")
def api_professions():
    """The trades this platform has been asked for, ranked by demand.

    Public: a professional deciding whether to join should be able to see how
    much work is waiting before they hand over their licence number.
    """
    store = _load_professions()
    rows = sorted(store.values(), key=lambda r: (-r.get("demand", 0), r.get("label", "")))
    q = (request.args.get("q") or "").strip().lower()
    if q:
        rows = [r for r in rows
                if q in r.get("label", "").lower() or q in r.get("domain", "").lower()
                or any(q in i.lower() for i in r.get("ideas", []))]
    return jsonify({"ok": True, "count": len(rows), "professions": [
        {"slug": r["slug"], "label": r["label"], "why": r.get("why", ""),
         "domain": r.get("domain", ""), "demand": r.get("demand", 0),
         "ideas_waiting": len(r.get("ideas", [])), "recent_ideas": r.get("ideas", [])[:5],
         "claimed": len(r.get("claimed_by", [])), "first_seen": r.get("first_seen", "")}
        for r in rows]})


@app.route("/api/idea-professionals", methods=["POST"])
def api_idea_professionals():
    """Which professionals an idea likely needs.

    Public and stateless, it reads the text it is given and returns trades.
    Nothing is stored here; the board calls it when an idea is written and
    again when it is displayed, so editing the idea updates the list.
    """
    d = request.get_json(silent=True) or {}
    try:
        import professional_match
        out = professional_match.professionals_for(d.get("title", ""), d.get("body", ""))
        # Only count it when there is a real idea behind it, a keystroke in a
        # draft box should not inflate demand for an interior designer.
        if d.get("record") and len((d.get("title", "") + d.get("body", "")).strip()) > 25:
            _record_profession_demand(out, d.get("title", ""))
        out["ok"] = True
        return jsonify(out)
    except Exception as e:
        # A suggestion feature must never be able to break posting an idea.
        return jsonify({"ok": False, "always": [], "matched": [], "domains": [],
                        "summary": "", "error": str(e)[:120]})


_BOOT_TS = time.time()



@app.route("/api/build")
def api_build():
    """Which version is live, and when this process started.

    Small but load-bearing: without it there is no way to tell whether a
    deploy actually landed, so "I pushed the fix" and "the fix is running"
    stay indistinguishable. Render exposes the deployed commit in the
    environment; boot time proves the process itself restarted.
    """
    return jsonify({
        "ok": True,
        "commit": (os.environ.get("RENDER_GIT_COMMIT") or "")[:8],
        "branch": os.environ.get("RENDER_GIT_BRANCH", ""),
        "booted_at": datetime.datetime.utcfromtimestamp(_BOOT_TS).isoformat() + "Z",
        "uptime_s": int(time.time() - _BOOT_TS),
        "persistent_data": DATA_DIR != BASE_DIR,
        # Distinguishes "no disk attached" from "disk attached, app not
        # pointed at it" without publishing any path.
        "disk_mounted": any(os.path.isdir(p) for p in ("/var/data", "/data")),
    })


@app.route("/api/persistence")
@owner_required
def api_persistence():
    """Is the site actually writing somewhere that survives a deploy?

    Owner-only. Exists because "the setting looks right" and "the data
    survived a deploy" are different claims, and only the second one matters.
    Reports where writes go, whether that is a real mounted disk, and a marker
    it can write and read back so persistence can be proved rather than assumed.
    """
    import shutil
    persistent = DATA_DIR != BASE_DIR
    marker_path = os.path.join(DATA_DIR, "_persistence_marker.txt")
    action = (request.args.get("action") or "").strip()
    wrote = None
    if action == "mark":
        try:
            os.makedirs(DATA_DIR, exist_ok=True)
            wrote = datetime.datetime.now().isoformat(timespec="seconds")
            with open(marker_path, "w") as f:
                f.write(wrote)
        except Exception as e:
            return jsonify({"ok": False, "error": str(e)[:160]}), 500
    marker = None
    try:
        with open(marker_path) as f:
            marker = f.read().strip()
    except Exception:
        marker = None
    try:
        usage = shutil.disk_usage(DATA_DIR)
        free_gb = round(usage.free / 1e9, 2)
        total_gb = round(usage.total / 1e9, 2)
    except Exception:
        free_gb = total_gb = None
    return jsonify({
        "ok": True,
        "data_dir": DATA_DIR,
        "base_dir": BASE_DIR,
        "persistent_disk_configured": persistent,
        "marker_written_now": wrote,
        "marker_on_disk": marker,
        "disk_total_gb": total_gb, "disk_free_gb": free_gb,
        "verdict": ("Writing to a mounted disk, data should survive a deploy."
                    if persistent else
                    "DATA_DIR is unset, so writes go to the disposable filesystem "
                    "and are destroyed on every deploy."),
    })


@app.route("/api/traffic/places")
@owner_required
def api_traffic_places():
    """Where the viewers are, owner only.

    Aggregate rows only: the day records hold "country|region|city": count,
    so this can say 40 people came from Seattle and can never say which 40.
    Anything with fewer than MIN_SHOW visitors in the whole window is folded
    into "elsewhere" rather than named, because a city with one visitor in a
    small dataset is close to naming the visitor.
    """
    # Cities show from the FIRST visitor. Folding under two meant that at
    # this site's real volumes the owner opened "where are my viewers from"
    # and saw nothing. What is stored stays a city and a count, never a
    # person. (Restored after a merge between two working sessions quietly
    # reverted it; the archive panel was already asking for these fields.)
    MIN_SHOW = 1
    days_back = max(1, min(365, int(request.args.get("days", 30))))
    cutoff = (datetime.date.today() - datetime.timedelta(days=days_back - 1)).isoformat()
    days = _load_traffic()["days"]

    countries, regions, cities, total = {}, {}, {}, 0
    city_labels = {}
    for date, rec in days.items():
        if date < cutoff:
            continue
        for label, n in (rec.get("places") or {}).items():
            country, region, city = (label.split("|") + ["", "", ""])[:3]
            total += n
            if country:
                countries[country] = countries.get(country, 0) + n
            if country and region:
                regions[country + " / " + region] = regions.get(country + " / " + region, 0) + n
            if city:
                key = city + (", " + region if region else "") + (", " + country if country else "")
                cities[key] = cities.get(key, 0) + n
                city_labels[label] = city_labels.get(label, 0) + n

    coords = _load_traffic().get("place_coords", {})

    def top(d, keep_small=False):
        rows = sorted(d.items(), key=lambda kv: -kv[1])
        shown = [{"name": k, "count": v} for k, v in rows if keep_small or v >= MIN_SHOW]
        hidden = sum(v for k, v in rows if not keep_small and v < MIN_SHOW)
        if hidden:
            shown.append({"name": "elsewhere", "count": hidden, "folded": True})
        return shown[:25]

    langs, devices, landings, sources = {}, {}, {}, {}
    raw_views = raw_visitors = 0
    for date, rec in days.items():
        if date < cutoff:
            continue
        raw_views += rec.get("pageviews", 0)
        raw_visitors += (len(rec.get("visitor_ids") or [])
                         or rec.get("unique_visitors") or 0)
        for src, dst in (("langs", langs), ("devices", devices),
                         ("landings", landings), ("sources", sources)):
            for k, n in (rec.get(src) or {}).items():
                dst[k] = dst.get(k, 0) + n

    pins = []
    for label, n in sorted(city_labels.items(), key=lambda kv: -kv[1]):
        xy = coords.get(label)
        if not xy or n < MIN_SHOW:
            continue
        country, region, city = (label.split("|") + ["", "", ""])[:3]
        pins.append({"lat": xy[0], "lon": xy[1], "count": n,
                     "label": city + (", " + region if region else ""), "country": country})

    all_days = sorted(days.keys())
    return jsonify({"ok": True, "days": days_back, "total_located": total, "pins": pins,
                    "counting_since": all_days[0] if all_days else None,
                    "resets_on_deploy": DATA_DIR == BASE_DIR,
                    "raw_views": raw_views, "raw_visitors": raw_visitors,
                    "sources": top(sources, keep_small=True),
                    "languages": top(langs, keep_small=True),
                    "devices": top(devices, keep_small=True),
                    "landings": top(landings, keep_small=True),
                    "countries": top(countries, keep_small=True),
                    "regions": top(regions),
                    "cities": top(cities),
                    "note": "Aggregate counts only. Locations are derived from a "
                            "coarsened address (an IPv4 /24), cached for a month, "
                            "and no address is stored."})


# Floor for the public visitor note on the main page. Set from the real
# numbers: the site runs at a median of about 17 visitors a day, so anything
# under a hundred all-time is a number that argues against the site rather
# than for it.
PUBLIC_TRAFFIC_MIN = int(os.environ.get("PUBLIC_TRAFFIC_MIN", "100"))


@app.route("/api/traffic/summary")
def api_traffic_summary():
    """Public, aggregate-only traffic numbers, no per-visitor detail, no
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
        returning on two different days is two, the honest reading of "this
        week", but one person refreshing thirty times is one, which is the
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
                # kept separately, clearly named, this is what the old numbers were
                "views_today": sum_path(path, today_iso),
                "views_week": sum_path(path, week_cutoff),
                "views_all_time": sum_path(path)}

    # ---- site-wide, for the note on the main page --------------------------
    # Only the visitor count goes out. NOT the path breakdown, not the source
    # labels and not the conversions: which pages people open is competitive
    # information, where they came from tells anyone reading whether the ad
    # spend is working, and the conversions are bookings, that is revenue.
    # Those stay owner-only in the Archive. A public number can be the number
    # of people and nothing else.
    def site_people(cutoff=None):
        """Visitor-days: deduplicated within a day, summed across days.

        Someone who comes back on Tuesday and Thursday counts twice. That is
        the same convention the per-tool numbers above already use and say so
       , it is the honest reading of "this week", and the information needed
        to do better was deliberately thrown away when each day closed.
        """
        total = 0
        for date, rec in days.items():
            if cutoff and date < cutoff:
                continue
            # Today's record still holds raw ids; finished days keep a count.
            if "visitor_ids" in rec:
                total += len(rec["visitor_ids"])
            else:
                total += rec.get("unique_visitors") or 0
        return total

    def prefix_views(prefix, cutoff=None):
        """Opens of every path under a prefix: the shared idea pages."""
        total = 0
        for date, rec in days.items():
            if cutoff and date < cutoff:
                continue
            for path, n in (rec.get("paths") or {}).items():
                if path.startswith(prefix):
                    total += n
        return total

    all_time = site_people()
    return jsonify({"ok": True,
                    # what date the count started, and the honest reason the
                    # numbers keep restarting while there is no disk
                    "counting_since": min(days) if days else None,
                    "resets_on_deploy": DATA_DIR == BASE_DIR,
                    "trip_planner": tool_stats("/trip-planner"),
                    "destination_book": tool_stats("/destination-book"),
                    "met": tool_stats("/met"),
                    "idea_pages": {"views_all_time": prefix_views("/idea/"),
                                   "views_week": prefix_views("/idea/", week_cutoff)},
                    "site": {
                        "today": site_people(today_iso),
                        "week": site_people(week_cutoff),
                        "all_time": all_time,
                        "since": min(days) if days else None,
                        # Below this the page says nothing at all. A counter
                        # reading "6 visits" is worse than no counter: it
                        # invites the reader to conclude nobody is here, which
                        # is the opposite of what a usage note is for. Silence
                        # is not a lie; a discouraging true number is still a
                        # bad thing to volunteer.
                        "show": all_time >= PUBLIC_TRAFFIC_MIN,
                    }})


def _arch_comments():
    """Community notes on places, newest first."""
    out = []
    for key, items in _comments_all().items():
        for m in items:
            out.append({"date": m.get("at", ""), "place": m.get("place", ""),
                        "city": m.get("city", ""), "author": m.get("author", ""),
                        "comment": m.get("text", "")})
    out.sort(key=lambda r: r.get("date", ""), reverse=True)
    return out


def _arch_wishes():
    """What visitors asked us to add, the demand signal behind the book."""
    out = []
    for w in reversed(_load(TRAVEL_WISHES_PATH)):
        out.append({"date": w.get("at", ""), "wish": w.get("wish", ""),
                    "city": w.get("city", ""), "kind": w.get("kind", ""),
                    "contact": w.get("contact", "")})
    return out


# section key → (label, one-line description, builder)
ARCHIVE_SECTIONS = [
    ("comments",   "💬 Place comments", "What travelers wrote about places in the Destination Book.", _arch_comments),
    ("wishes",     "🌟 Traveler wishes", "Places and experiences visitors asked us to add, the demand signal.", _arch_wishes),
    ("traffic",    "📈 Site traffic", "Daily page views, unique visitors, and Trip Planner / Destination Book usage.", _arch_traffic),
    ("sources",    "🎯 Where visitors came from", "Visits and bookings by source, Google, Reddit, direct, or a tagged ad. How you tell whether ad spend worked.", _arch_sources),
    ("bookings",   "🧾 Bookings & invoices", "Every reservation, customer, trip, fare, invoice and status.", _arch_bookings),
    ("contacts",   "📇 Contacts (marketing)", "Every captured email & phone across the whole site, de-duped, your advertising list.", _arch_contacts),
    ("people",     "👤 Accounts", "Agent, driver and customer accounts.", _arch_people),
    ("agreements", "✍️ Signed agreements", "Every signed Driver Agreement with version, timestamp and IP.", _arch_agreements),
    ("paperwork",  "📎 Driver paperwork", "Uploaded documents & files (append-only paper trail).", _arch_paperwork),
    ("leads",      "💡 Finance leads", "Finance signups, wishlist and Deflator research waitlist.", _arch_leads),
    ("partners",   "🏨 Partners / Atlas", "Prospect hotels and their sales contacts.", _arch_partners),
    ("compliance", "⚠️ Compliance", "Logged driver violations.", _arch_compliance),
    ("payouts",    "💸 Payouts ledger", "Every payout request and payment to agents & driver-agents.", _arch_payouts),
    ("activity",   "🔔 Activity log", "Owner alerts, give-ups, quote requests and other events.", _arch_activity),
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
# BOARD OF DIRECTORS, private governance vault for the managing members.
# Keeps the company's corporate documents (bylaws, operating / shareholder
# agreements, formation docs, board resolutions, contracts, cap table…) plus
# a registry of the managing members. Owner-gated, append-only, nothing is
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
# A guide's product is not the sightseeing loop the planner draws, it is their
# own walk, with their own stops and their own timings. A Harvard student running
# an hour in the Yard needs to name each stop, say how long they stand there and
# why, and put a price on it. That is what this stores, and unlike the older
# "offer this route" inbox, which only ever reached the owner, these listings
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
             "  %s · %s" % (t.get("city_label") or t.get("city") or ", ", t.get("kind") or ", "),
             "  price: %s %s" % (t.get("price") if t.get("price") is not None else "on request",
                                 "per " + str(t.get("price_unit", "person"))),
             "  up to %s people · %s" % (t.get("group_max"), t.get("languages") or "language not given"),
             "  meet at: %s" % (t.get("meeting_point") or ", "),
             "  includes: %s" % (t.get("includes") or ", "), ""]
    if t.get("summary"):
        lines += ["WHAT THEY PROMISE", "  " + str(t["summary"]), ""]
    lines += ["STOPS (%s min in total)" % t.get("total_minutes", 0)]
    for i, s in enumerate(t.get("stops") or [], 1):
        lines.append("  %d. %s, %s min%s"
                     % (i, s.get("name", ""), s.get("minutes", 0),
                        ("  · " + s["note"]) if s.get("note") else ""))
    lines += ["", "GUIDE",
              "  %s%s" % (t.get("guide_name") or ", ",
                          (" · " + t["guide_org"]) if t.get("guide_org") else ""),
              "  code:    %s" % (t.get("code") or ", "),
              "  contact: %s" % (t.get("contact") or ", "),
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
        _push_owner_alert("guide_trip", "🎫 %s listed \"%s\" in %s, %s, %d stops."
                          % (rec["guide_name"], rec["title"],
                             rec["city_label"] or rec["city"] or ", ", rec["kind"], len(stops)))
        notify.email_owner(
            "🎫 New guided trip listed: %s" % rec["title"],
            _trip_email_body(rec))
    except Exception:
        pass
    return jsonify({"ok": True, "trip": _public_trip(rec)})


@app.route("/api/guide-trips")
def api_guide_trips():
    """Public. This is the shop window, anyone may browse what guides sell."""
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
        _push_owner_alert("trip_interest", "🎟️ %s wants \"%s\", reach them at %s (guide %s)."
                          % (name, trip.get("title"), contact, trip.get("code")))
        notify.email_owner(
            "🎟️ %s wants the trip: %s" % (name, trip.get("title")),
            "A traveller asked about a guided trip.\n\n"
            "TRAVELLER\n  name:    %s\n  contact: %s\n  people:  %s\n  when:    %s\n  note:    %s\n\n"
            "TRIP\n  %s (%s)\n  guide %s, reach the guide at %s\n\n"
            "Introduce them to each other."
            % (name, contact, d.get("people") or ", ", d.get("when") or ", ",
               d.get("note") or ", ", trip.get("title"), tid,
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
# The board area is private, and its members are not site owners, they need a
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
    if _login_blocked(name):
        return _too_many_tries()
    if not (ok_pw and name and name in roll):
        _login_failed(name)
        # One message for both failures, never reveal which half was right.
        return jsonify({"ok": False, "error": "That name and password do not match our board roll."}), 401
    _login_ok(name)
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
# UNCOVERED-RIDE REMINDER, nudge dispatch when a ride isn't being taken.
# A ride sits NEW (in the open pool) when no driver has claimed it, or after
# a driver gives it up. If it stays uncovered too long, or its pickup is
# approaching, we remind the owner (dashboard alert + SMS), escalating as
# pickup nears. Give-ups already alert immediately (see api_giveup); this
# catches the "nobody is taking it" case.
# ======================================================================
def _parse_iso(s):
    try:
        return datetime.datetime.fromisoformat(s)
    except Exception:
        return None


def _uncovered_since(r):
    """When a ride became uncovered, its last give-up, else when it was created."""
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
    tag = ("🚨 URGENT, pickup is close and still no driver"
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
                continue  # too fresh, drivers may still claim it
            # Cap total SMS reminders per ride so a chronically-stale one can't text
            # forever (it still shows on the dashboard banner, just stops texting).
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
# instantly, one polite request on behalf of everyone instead of one each.
_OVERPASS_MIRRORS = ["https://overpass.kumi.systems/api/interpreter",
                     "https://overpass.private.coffee/api/interpreter",
                     "https://overpass-api.de/api/interpreter"]
_OVERPASS_CACHE = {}          # query hash -> {"ts": float, "data": [...]}
_OVERPASS_TTL = 3600
_OVERPASS_MAX = 400           # keep the cache from growing without bound
# Phase-0 hardening (MAP_TOOLING_REDESIGN.md): gunicorn runs 1 worker x 8 threads
# with --timeout 120. Unbounded, 3 mirrors x 65s ≈ 195s per request could pin
# every thread past the kill line and drop booking traffic with it. So: at most
# 4 concurrent upstream fetches, 25s per mirror, 60s total upstream budget.
_OVERPASS_SEM = threading.BoundedSemaphore(4)
_OVERPASS_MIRROR_TIMEOUT = (5, 25)   # (connect, read) seconds per mirror
_OVERPASS_DEADLINE = 60              # total upstream seconds per request


# ----------------------------------------------------------- live road traffic
# Nobody gives real-time traffic away without a key, it is measured from fleet
# data, not volunteered like map geometry. TomTom's free tier is the one that
# fits: 50,000 tiles a day, no credit card, commercial use allowed. The map
# stays perfectly usable without it; the layer simply does not offer itself
# until a key exists, so the site never shows a broken checkbox.
@app.route("/api/traffic-key")
def api_traffic_key():
    k = os.environ.get("TOMTOM_KEY", "").strip()
    return jsonify({"ok": True, "enabled": bool(k), "key": k,
                    "attribution": "Traffic \u00a9 TomTom"})


# ------------------------------------------------------- route demand
# What a bus company would actually buy.
#
# Sean's correction, 2026-08-09: the product is not "here are fifty travellers,
# go and contact them". It is "this route has fifty people planning it". The
# operator learns that a road is in demand and rings US. Nobody's identity is
# in the transaction, and there is nothing to sell that belongs to a person.
#
# So the storage is built to make the wrong version impossible rather than
# merely discouraged: this file holds COUNTS, not events. There is no row per
# planning, no timestamp finer than a month, and no origin address. A route
# somebody planned is not attributable to them even by whoever holds the disk.
#
# The current month keeps a set of browser ids so one person replanning eleven
# times is one planner rather than eleven. When the month rolls the ids are
# dropped and the count is all that survives, the same trade traffic.json
# makes, for the same reason, with the same cost: a closed month cannot be
# recounted, because the information needed to do it is gone on purpose.
ROUTE_DEMAND_PATH = _data_path("route_demand.json")
# A route with one or two planners is somebody's actual trip. Below this it is
# not reported at all, to the owner or to anyone.
ROUTE_DEMAND_MIN = int(os.environ.get("ROUTE_DEMAND_MIN", "5"))


# The geocoder says "Washington", a person types "WA", and until these collapse
# to one string every route is a bucket of one and nothing ever clears the
# reporting floor. Found by testing the normaliser rather than trusting it:
# "Leavenworth, WA" and "Leavenworth, Chelan County, Washington" were landing
# in different buckets, which would have made the whole tally useless while
# looking like it worked.
_US_STATES = {
    "al": "alabama", "ak": "alaska", "az": "arizona", "ar": "arkansas",
    "ca": "california", "co": "colorado", "ct": "connecticut",
    "de": "delaware", "fl": "florida", "ga": "georgia", "hi": "hawaii",
    "id": "idaho", "il": "illinois", "in": "indiana", "ia": "iowa",
    "ks": "kansas", "ky": "kentucky", "la": "louisiana", "me": "maine",
    "md": "maryland", "ma": "massachusetts", "mi": "michigan",
    "mn": "minnesota", "ms": "mississippi", "mo": "missouri",
    "mt": "montana", "ne": "nebraska", "nv": "nevada",
    "nh": "new hampshire", "nj": "new jersey", "nm": "new mexico",
    "ny": "new york", "nc": "north carolina", "nd": "north dakota",
    "oh": "ohio", "ok": "oklahoma", "or": "oregon", "pa": "pennsylvania",
    "ri": "rhode island", "sc": "south carolina", "sd": "south dakota",
    "tn": "tennessee", "tx": "texas", "ut": "utah", "vt": "vermont",
    "va": "virginia", "wa": "washington", "wv": "west virginia",
    "wi": "wisconsin", "wy": "wyoming",
    "dc": "district of columbia", "d.c.": "district of columbia",
    "pr": "puerto rico",
}


def _route_place(s):
    """A place name reduced to something two people typing it would share.

    'Leavenworth, Chelan County, Washington, United States' and 'Leavenworth,
    WA' have to land in the same bucket or every route is a bucket of one and
    the aggregate never clears the floor. Keeps the town and the region, drops
    the county and the country, and spells the state out.
    """
    s = _no_tags(str(s or "")).strip().lower()
    s = " ".join(s.split())
    parts = [p.strip() for p in s.split(",") if p.strip()]
    if not parts:
        return ""
    keep = parts[:1]
    for p in parts[1:]:
        # county and country lines add nothing a person would type
        if p.startswith("united states") or p == "usa" or p == "us" \
                or p.endswith(" county"):
            continue
        keep.append(_US_STATES.get(p.replace(".", "").strip(), p))
        break
    return ", ".join(keep)[:60]


def _route_month():
    return datetime.date.today().strftime("%Y-%m")


def _route_fold(data):
    """Drop the browser ids from every month except the current one."""
    now = _route_month()
    for month, rec in (data.get("months") or {}).items():
        if month == now:
            continue
        for r in (rec.get("routes") or {}).values():
            if "ids" in r:
                r["n"] = max(int(r.get("n") or 0), len(r.pop("ids") or []))
    return data


@app.route("/api/route-demand", methods=["POST"])
def api_route_demand():
    """Record that somebody planned this road. No person is stored."""
    d = request.get_json(force=True, silent=True) or {}
    # Same guard the consent module uses. A planner that starts sending
    # coordinates would turn a demand counter into a location trail, and the
    # refusal has to be loud rather than a silent drop.
    hit = consent.looks_like_coordinate(d)
    if hit:
        return jsonify({"ok": False,
                        "error": "Route demand takes place names, not "
                                 "coordinates (%s)." % hit}), 400
    a, b = _route_place(d.get("from")), _route_place(d.get("to"))
    if not a or not b or a == b:
        return jsonify({"ok": False, "error": "Two different places are needed."}), 400
    if _skip_traffic():
        return jsonify({"ok": True, "counted": False})   # our own planning is not demand

    key = "%s|%s" % (a, b)
    vid = request.cookies.get("psx_vid") or ""
    with _LOCK:
        data = _load(ROUTE_DEMAND_PATH)
        if not isinstance(data, dict):
            data = {}
        data.setdefault("months", {})
        _route_fold(data)
        month = data["months"].setdefault(_route_month(), {"routes": {}})
        rec = month["routes"].setdefault(key, {"n": 0, "ids": []})
        if vid:
            if vid not in rec["ids"]:
                rec["ids"].append(vid)
                rec["n"] = len(rec["ids"])
        else:
            # No id to dedupe on, count it once and move on.
            rec["n"] = int(rec.get("n") or 0) + 1
        _save(ROUTE_DEMAND_PATH, data)
    return jsonify({"ok": True, "counted": True})


@app.route("/api/route-demand")
@owner_required
def api_route_demand_list():
    """Which roads people are planning, ranked. Owner only.

    Owner-only even though it names no one: a public leaderboard of routes is
    a live feed of where travellers are heading, and a route just over the
    floor is a handful of people. This is a sales document, not a page.
    """
    data = _load(ROUTE_DEMAND_PATH)
    if not isinstance(data, dict):
        data = {}
    months = data.get("months") or {}
    window = sorted(months)[-12:]
    tally, per_month = {}, {}
    for m in window:
        for key, rec in (months[m].get("routes") or {}).items():
            n = int(rec.get("n") or len(rec.get("ids") or []))
            tally[key] = tally.get(key, 0) + n
            per_month.setdefault(key, {})[m] = n
    rows = []
    for key, n in tally.items():
        if n < ROUTE_DEMAND_MIN:
            continue                      # too few to be anything but a person
        a, _, b = key.partition("|")
        rows.append({"from": a, "to": b, "planners": n,
                     "by_month": per_month.get(key, {})})
    rows.sort(key=lambda r: -r["planners"])
    return jsonify({"ok": True, "routes": rows, "months": window,
                    "min_shown": ROUTE_DEMAND_MIN,
                    "below_floor": sum(1 for n in tally.values()
                                       if n < ROUTE_DEMAND_MIN)})


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
#   Wikidata , asks by KIND ("museums, parks, monuments, castles near here"),
#               so the candidate list is attractions rather than whatever is
#               closest, and it answers in about a second.
#   Wikipedia, says what each one is, supplies a photo, and reports how many
#               people look it up, which is the closest honest measure of
#               "worth seeing" that exists for free.
#
# Wikidata proposes, Wikipedia ranks. A neighborhood playground and the Museum
# of Fine Arts both come back from the first; only one of them survives the
# second. Answers are kept for a day, landmarks do not move.
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
    article, the article requirement is itself a first notability filter."""
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
    # more than 4 map fetches already in flight → don't queue a 5th worker thread
    # behind slow mirrors; answer from stale cache or say busy honestly
    if not _OVERPASS_SEM.acquire(timeout=10):
        if hit:
            return jsonify({"ok": True, "elements": hit["data"], "cached": True, "stale": True})
        return jsonify({"ok": False, "error": "map servers busy"}), 503
    try:
        import requests
        last = ""
        started = time.time()
        for url in _OVERPASS_MIRRORS:
            if time.time() - started > _OVERPASS_DEADLINE:
                last = last or "deadline exceeded"
                break
            try:
                r = requests.post(url, data={"data": q}, timeout=_OVERPASS_MIRROR_TIMEOUT,
                                  headers={"User-Agent": "PlateauStrategy/1.0 (trip planner)"})
                if r.status_code != 200:
                    last = "HTTP %s" % r.status_code
                    continue
                j = r.json()
                els = j.get("elements") or []
                # a throttled reply carries a "remark" with an empty list, that is
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
    finally:
        _OVERPASS_SEM.release()
    # everything failed, hand back a stale answer rather than nothing
    if hit:
        return jsonify({"ok": True, "elements": hit["data"], "cached": True, "stale": True})
    return jsonify({"ok": False, "error": last or "map servers busy"}), 503


@app.route("/api/dispatch/uncovered")
@owner_required
def api_dispatch_uncovered():
    """The rides no driver has taken, feeds the Dispatch 'needs attention' banner.
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


# Put the shipped-in articles on the board once, at boot, on a real disk only.
# Wrapped so a seeding failure can never stop the app from starting.
try:
    _seed_articles_once()
    _seed_blueprint_once()
    _seed_book_fields_once()
except Exception:
    pass


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    print("Plateau Strategy Solution Lab booking app -> http://localhost:%d" % port)
    # Background reminder: nudge dispatch about rides no driver has taken.
    if os.environ.get("DISPATCH_REMINDERS", "true").lower() == "true":
        threading.Thread(target=_reservation_reminder_loop, daemon=True).start()
    # host="::" dual-stacks on macOS so both localhost (IPv6 ::1) and 127.0.0.1
    # (IPv4) work. threaded=True so concurrent polling requests never block.
    app.run(host="::", port=port, debug=False, threaded=True)
