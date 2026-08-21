"""The site's own scout: new places, found on a routine, approved by a person.

Sean's ask, 2026-08-20: the site should keep discovering new places the way
Xiaohongshu's crowd does, on a schedule, from as much online data as we can
lawfully read. This module is that scout. Every source here was PROBED LIVE
before it was written down (see DISCOVERY_SOURCES.md for the full sweep,
including the sources that need keys and the ones we refuse to scrape).

WHAT IT IS NOT. It never writes into the public Destination Book. Finds land
in a review queue; the owner approves each one, and approval walks through
/api/destinations/add, the same door every community place already enters by,
with its dedupe and its private-residence refusal. A scout proposes; the
guide decides. Leads from feeds (Reddit, Atlas Obscura) carry title + link
only: the link is ours to follow, the prose is theirs.

MECHANICS. Fail-silent per source (a dead feed never breaks the run), a
polite User-Agent with contact, ~0.7s spacing between calls, per-run and
store caps, dedup by slug+rounded-coords (or link), atomic writes. The
routine is a daemon thread; DISCOVERY_EVERY_H sets the cadence, and the
timestamp is stamped BEFORE the work so a slow run can never double-fire
(the trading bot paid for that lesson twice).
"""

import json
import os
import re
import threading
import time
import urllib.parse
import urllib.request

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

UA = {"User-Agent": "PlateauStrategy/1.0 (tour guide site; contact seanzhu1988115@gmail.com)"}
PACE_S = 0.7                      # spacing between outbound calls
RUN_CAP = 60                      # new proposals per run, across all sources
SRC_CAP = 15                      # ...and per source, so no source floods the rest
                                  # (the trading bot's series-cap lesson: a fair
                                  # sample from everyone beats a torrent from one)
LIVE_CAP = 150                    # proposals waiting for the owner, max
SEEN_CAP = 20000                  # dedup memory
EVERY_H = float(os.environ.get("DISCOVERY_EVERY_H", "24"))
ENABLED = os.environ.get("DISCOVERY_ENABLED", "true").strip().lower() != "false"
NEW_DAYS = int(os.environ.get("DISCOVERY_NEW_DAYS", "30"))

# The pilot cities. A bbox for map queries, anchor points for radius queries.
CITIES = {
    "nyc": {
        "label": "New York",
        "bbox": (40.60, -74.05, 40.88, -73.85),
        "anchors": [(40.7648, -73.9808), (40.7266, -73.9950), (40.7794, -73.9632),
                    (40.7061, -74.0086), (40.6892, -73.9902)],
        "wikivoyage": ["Manhattan/Midtown East", "Manhattan/SoHo", "Brooklyn/Downtown"],
        "reddit": ["AskNYC", "nyc"],
    },
    "dc": {
        "label": "Washington DC",
        "bbox": (38.85, -77.12, 38.96, -76.95),
        "anchors": [(38.8895, -77.0093), (38.9072, -77.0369), (38.9097, -77.0654)],
        "wikivoyage": ["Washington,_D.C./National_Mall", "Washington,_D.C./Georgetown"],
        "reddit": ["washingtondc"],
    },
}

_LOCK = threading.Lock()
_RUNNING = [False]


def _store_path():
    d = os.environ.get("DATA_DIR", "").strip() or BASE_DIR
    return os.path.join(d, "discovery_store.json")


def _load():
    try:
        with open(_store_path()) as f:
            s = json.load(f)
    except Exception:
        s = {}
    s.setdefault("seen", {})
    s.setdefault("proposals", [])
    s.setdefault("decided", [])
    s.setdefault("runs", [])
    s.setdefault("last_run", 0)
    return s


def _save(s):
    p = _store_path()
    tmp = p + ".tmp"
    with open(tmp, "w") as f:
        json.dump(s, f, indent=1)
    os.replace(tmp, p)


def _get(url, data=None, timeout=25):
    time.sleep(PACE_S)
    req = urllib.request.Request(url, data=data, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def _slug(name):
    return re.sub(r"[^a-z0-9]+", "-", (name or "").lower()).strip("-")[:60]


def _key(name, lat=None, lon=None, link=None):
    if lat is not None and lon is not None:
        return "%s@%.3f,%.3f" % (_slug(name), lat, lon)
    return "%s#%s" % (_slug(name), (link or "")[:120])


def _city_of(lat, lon):
    for ck, c in CITIES.items():
        b = c["bbox"]
        if b[0] <= lat <= b[2] and b[1] <= lon <= b[3]:
            return ck
    return "other"


def _cat_guess(tags):
    t = " ".join("%s=%s" % kv for kv in (tags or {}).items()).lower()
    if any(w in t for w in ("historic", "memorial", "monument")):
        return "history"
    if any(w in t for w in ("museum", "gallery", "artwork", "theatre")):
        return "culture"
    if any(w in t for w in ("park", "garden", "viewpoint", "beach")):
        return "nature"
    if any(w in t for w in ("restaurant", "cafe", "food", "market")):
        return "food"
    return "views"


# ---------------- the sources (each returns a list of candidate dicts) ----

def src_overpass_new():
    """OpenStreetMap: named tourism/historic/leisure POIs ADDED or edited in
    the last NEW_DAYS days. Probed 2026-08-20: 14 named finds in Manhattan in
    one 30-day window, two of them museums. ODbL: we credit OSM on the page."""
    since = time.strftime("%Y-%m-%dT00:00:00Z", time.gmtime(time.time() - NEW_DAYS * 86400))
    out = []
    for ck, c in CITIES.items():
        b = c["bbox"]
        bb = "(%s,%s,%s,%s)" % (b[0], b[1], b[2], b[3])
        q = ('[out:json][timeout:25];('
             'node["tourism"]["name"](newer:"%s")%s;'
             'node["historic"]["name"](newer:"%s")%s;'
             'node["leisure"~"park|garden"]["name"](newer:"%s")%s;'
             ');out tags center 60;' % (since, bb, since, bb, since, bb))
        body = _get("https://overpass-api.de/api/interpreter",
                    data=urllib.parse.urlencode({"data": q}).encode())
        for e in json.loads(body).get("elements", []):
            t = e.get("tags", {})
            name = t.get("name")
            lat, lon = e.get("lat"), e.get("lon")
            if not name or lat is None:
                continue
            kind = t.get("tourism") or t.get("historic") or t.get("leisure") or "place"
            if kind in ("hotel", "hostel", "motel", "guest_house", "apartment",
                        "chalet", "information"):
                continue          # lodging and kiosks are not discoveries
            out.append({"kind": "place", "src": "osm-new", "name": name,
                        "lat": lat, "lon": lon, "city": ck,
                        "cat": _cat_guess(t), "note": "newly mapped on OSM (%s)" % kind,
                        "url": "https://www.openstreetmap.org/node/%s" % e.get("id")})
    return out


def src_wikipedia():
    """Wikipedia geosearch around each city anchor: notable places with
    coordinates. New-to-our-store is the discovery filter. Probed: 20
    articles/anchor, fields title/lat/lon/pageid. Names and facts only."""
    out = []
    for ck, c in CITIES.items():
        for (la, lo) in c["anchors"]:
            u = ("https://en.wikipedia.org/w/api.php?action=query&list=geosearch"
                 "&gscoord=%s|%s&gsradius=2200&gslimit=30&format=json" % (la, lo))
            j = json.loads(_get(u))
            for g in j.get("query", {}).get("geosearch", []):
                out.append({"kind": "place", "src": "wikipedia", "name": g["title"],
                            "lat": g["lat"], "lon": g["lon"], "city": ck, "cat": "culture",
                            "note": "notable enough for its own article",
                            "url": "https://en.wikipedia.org/?curid=%s" % g["pageid"]})
    return out


def src_wikivoyage():
    """Wikivoyage see/do listings: name + coordinates + official link. Their
    PROSE stays theirs (CC BY-SA); we take the pointer, write our own words.
    Probed: 20 listings on one Midtown page, lat/long present."""
    out = []
    for ck, c in CITIES.items():
        for page in c["wikivoyage"]:
            u = ("https://en.wikivoyage.org/w/api.php?action=parse&page=%s"
                 "&prop=wikitext&format=json" % urllib.parse.quote(page))
            w = json.loads(_get(u)).get("parse", {}).get("wikitext", {}).get("*", "")
            for m in re.finditer(r"\{\{\s*(see|do)\b(.*?)\}\}", w, re.S | re.I):
                body = m.group(2)
                def field(k):
                    fm = re.search(r"\|\s*%s\s*=\s*([^|\n}]+)" % k, body)
                    return fm.group(1).strip() if fm else ""
                name = field("name")
                try:
                    lat, lon = float(field("lat")), float(field("long"))
                except Exception:
                    continue
                if not name:
                    continue
                out.append({"kind": "place", "src": "wikivoyage", "name": name,
                            "lat": lat, "lon": lon, "city": ck,
                            "cat": "culture" if m.group(1).lower() == "see" else "views",
                            "note": "a traveller guide lists it", "url": field("url")})
    return out


def src_dc_museums():
    """DC Open Data (ArcGIS): the city's own museums layer, public domain.
    Probed: NAME/ADDRESS/WEB_URL + geometry."""
    u = ("https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/"
         "Cultural_and_Society_WebMercator/MapServer/4/query"
         "?where=1%3D1&outFields=NAME,ADDRESS,WEB_URL&returnGeometry=true"
         "&outSR=4326&f=json&resultRecordCount=200")
    j = json.loads(_get(u))
    out = []
    for f in j.get("features", []):
        a, g = f.get("attributes", {}), f.get("geometry", {})
        if not a.get("NAME") or "y" not in g:
            continue
        out.append({"kind": "place", "src": "dc-open-data", "name": a["NAME"].title(),
                    "lat": g["y"], "lon": g["x"], "city": "dc", "cat": "culture",
                    "note": "on the city's own museum roll", "url": a.get("WEB_URL") or ""})
    return out


def src_nyc_new_facilities():
    """NYC Open Data (Socrata): the city's points-of-interest file, newest
    created first. Probed: created_date exists, so the city itself tells us
    what is new. No coordinates in this dataset, so these are LEADS."""
    u = ("https://data.cityofnewyork.us/resource/t95h-5fsr.json"
         "?$order=created_date%20DESC&$limit=40")
    rows = json.loads(_get(u))
    out = []
    for r in rows:
        name = (r.get("feature_name") or "").strip()
        if len(name) < 3 or name.upper() == name and len(name) > 40:
            continue
        out.append({"kind": "lead", "src": "nyc-open-data", "name": name.title(),
                    "city": "nyc", "cat": "views",
                    "note": "new in the city's own POI file (%s)" % (r.get("created_date") or "")[:10],
                    "url": "https://www.google.com/maps/search/" + urllib.parse.quote(name + " NYC")})
    return out


def src_reddit_leads():
    """City subreddits, searched for discovery language, read as Atom the
    lawful way (descriptive UA). Titles + links only: leads to read, never
    content to copy."""
    out = []
    for ck, c in CITIES.items():
        for sub in c["reddit"]:
            for qq in ("hidden gem", "underrated spot"):
                u = ("https://www.reddit.com/r/%s/search.rss?q=%s&restrict_sr=1"
                     "&sort=new&t=month" % (sub, urllib.parse.quote(qq)))
                try:
                    body = _get(u).decode("utf-8", "ignore")
                except Exception:
                    continue
                for chunk in body.split("<entry>")[1:]:
                    tm = re.search(r"<title>([^<]+)</title>", chunk)
                    lm = re.search(r'<link[^>]*href="([^"]+)"', chunk)
                    if not tm or not lm:
                        continue
                    out.append({"kind": "lead", "src": "reddit",
                                "name": tm.group(1).strip()[:120],
                                "city": ck, "cat": "views",
                                "note": "r/%s is talking about it" % sub,
                                "url": lm.group(1)})
    return out


def src_atlas_leads():
    """Atlas Obscura's new-places feed: the single best 'someone just wrote up
    an unusual place' signal there is. Title + link only; the writing is
    theirs. Probed: 18 items on /feeds/places."""
    body = _get("https://www.atlasobscura.com/feeds/places", timeout=20).decode("utf-8", "ignore")
    out = []
    for m in re.finditer(r"<item>.*?<title>([^<]+)</title>.*?<link>([^<]+)</link>", body, re.S):
        out.append({"kind": "lead", "src": "atlas-obscura", "name": m.group(1).strip()[:120],
                    "city": "other", "cat": "views",
                    "note": "a new Atlas Obscura write-up", "url": m.group(2).strip()})
    return out


# Sources that need a (free) key: they join the run the moment the key exists.
def src_nps():
    key = os.environ.get("NPS_API_KEY", "").strip()
    if not key:
        return []
    out = []
    for code, ck in (("gate", "nyc"), ("nace", "dc")):
        u = ("https://developer.nps.gov/api/v1/places?parkCode=%s&limit=25&api_key=%s"
             % (code, key))
        for p in json.loads(_get(u)).get("data", []):
            try:
                lat, lon = float(p.get("latitude")), float(p.get("longitude"))
            except Exception:
                continue
            out.append({"kind": "place", "src": "nps", "name": p.get("title", "")[:90],
                        "lat": lat, "lon": lon, "city": ck, "cat": "history",
                        "note": "a National Park Service place", "url": p.get("url") or ""})
    return out


SOURCES = [
    ("osm-new", src_overpass_new),
    ("wikipedia", src_wikipedia),
    ("wikivoyage", src_wikivoyage),
    ("dc-open-data", src_dc_museums),
    ("nyc-open-data", src_nyc_new_facilities),
    ("reddit", src_reddit_leads),
    ("atlas-obscura", src_atlas_leads),
    ("nps", src_nps),
]


def run_discovery():
    """One sweep of every source. Returns an honest per-source tally."""
    if _RUNNING[0]:
        return {"ok": False, "error": "already running"}
    _RUNNING[0] = True
    try:
        with _LOCK:
            s = _load()
            s["last_run"] = int(time.time())
            _save(s)
        tally, new_items = {}, []
        # The order rotates by run count: with a shared cap, whoever runs
        # last starves, so nobody runs last twice in a row.
        off = len(_load().get("runs", [])) % len(SOURCES)
        for name, fn in SOURCES[off:] + SOURCES[:off]:
            try:
                found = fn()
            except Exception as e:
                tally[name] = "failed: %s" % type(e).__name__
                continue
            fresh = 0
            with _LOCK:
                s = _load()
                for c in found:
                    k = _key(c.get("name"), c.get("lat"), c.get("lon"), c.get("url"))
                    if not k or k in s["seen"]:
                        continue
                    if fresh >= SRC_CAP or len(new_items) >= RUN_CAP:
                        break
                    s["seen"][k] = int(time.time())
                    c["id"] = k
                    c["found"] = int(time.time())
                    s["proposals"].append(c)
                    new_items.append(k)
                    fresh += 1
                # caps: oldest seen pruned, oldest proposals dropped with a note
                if len(s["seen"]) > SEEN_CAP:
                    for old in sorted(s["seen"], key=s["seen"].get)[:len(s["seen"]) - SEEN_CAP]:
                        del s["seen"][old]
                while len(s["proposals"]) > LIVE_CAP:
                    # Drop the oldest item of the MOST-represented source: a
                    # blind [-cap:] slice once deleted a whole source's finds
                    # while a flood survived. Balance survives; floods don't.
                    counts = {}
                    for pp in s["proposals"]:
                        counts[pp["src"]] = counts.get(pp["src"], 0) + 1
                    fattest = max(counts, key=counts.get)
                    for i2, pp in enumerate(s["proposals"]):
                        if pp["src"] == fattest:
                            del s["proposals"][i2]
                            break
                _save(s)
            tally[name] = "%d found, %d new" % (len(found), fresh)
        with _LOCK:
            s = _load()
            s["runs"] = (s["runs"] + [{"ts": int(time.time()), "tally": tally,
                                       "new": len(new_items)}])[-40:]
            _save(s)
        return {"ok": True, "new": len(new_items), "tally": tally}
    finally:
        _RUNNING[0] = False


def get_state():
    s = _load()
    return {"ok": True, "enabled": ENABLED, "every_h": EVERY_H,
            "last_run": s["last_run"], "running": _RUNNING[0],
            "proposals": s["proposals"], "runs": s["runs"][-10:],
            "keyed_off": [n for n in ("NPS_API_KEY",) if not os.environ.get(n)]}


def decide(pid, action):
    with _LOCK:
        s = _load()
        keep = []
        hit = None
        for p in s["proposals"]:
            if p.get("id") == pid:
                hit = dict(p)
                hit["decision"] = action
                hit["decided"] = int(time.time())
                s["decided"] = (s["decided"] + [hit])[-400:]
            else:
                keep.append(p)
        s["proposals"] = keep
        _save(s)
    return hit


def start_thread():
    if not ENABLED:
        return
    def loop():
        time.sleep(120)                       # let the site finish waking up
        while True:
            try:
                s = _load()
                due = (time.time() - s.get("last_run", 0)) >= EVERY_H * 3600
                if due:
                    run_discovery()
            except Exception:
                pass
            time.sleep(600)
    t = threading.Thread(target=loop, daemon=True, name="discovery")
    t.start()
