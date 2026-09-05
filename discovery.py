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
            "planted": len(s.get("planted") or []),
            "planted_recent": (s.get("planted") or [])[-6:],
            "refined": len(s.get("refined") or []),
            "thin_left": s.get("thin_left"),
            "voice": {"queued": len(s.get("voice_queue") or []),
                      "sample": (s.get("voice_queue") or [])[:6],
                      "recorded": len(s.get("voiced") or []),
                      "key_present": bool(os.environ.get("ELEVENLABS_API_KEY", "").strip()),
                      "last": s.get("last_voice", 0)},
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


def record_search_miss(q, city, outcome):
    """A book search that found nothing IS discovery data [SEAN]: the crowd
    telling us, in its own words, what the book is missing. Stored as a lead
    for the owner's queue; the auto-create flow usually fills the gap on the
    spot, and this remembers it either way."""
    q = re.sub(r"<[^>]*>", "", (q or "")).strip()[:80]
    if len(q) < 3:
        return False
    with _LOCK:
        s = _load()
        k = "search#" + _slug(q)
        if k in s["seen"]:
            return True
        s["seen"][k] = int(time.time())
        s["proposals"].append({
            "id": k, "kind": "lead", "src": "book-search", "name": q,
            "city": (city or "other")[:24], "cat": "views",
            "note": "searched in the book · %s" % (outcome or "miss")[:40],
            "url": "https://www.google.com/maps/search/" + urllib.parse.quote(q),
            "found": int(time.time()),
        })
        _save(s)
    return True


def record_refusal(name, city, why):
    """A place the gate turned away, kept so the refusal is visible.

    A gate that silently drops things is indistinguishable from a gate that is
    broken. These sit in their own list, capped, so /discovery can show what is
    being refused and somebody can notice if the rule is too tight."""
    with _LOCK:
        s = _load()
        s.setdefault("refused", [])
        s["refused"].append({"name": (name or "")[:80], "city": (city or "")[:24],
                             "why": (why or "")[:80], "at": int(time.time())})
        s["refused"] = s["refused"][-200:]
        _save(s)
    return True


def record_gallery(museum, city, example="", lat=None, lon=None):
    """A museum somebody reached through the Universal Gallery.

    Every gallery search is a person telling us where they are, or where they
    are about to be. If they look up a painting at the Art Institute, Chicago is
    a city worth having in the book, and the Art Institute is a place worth
    having in it, whether or not anyone has been there yet. The book cannot
    guess that; a search says it out loud. [SEAN "make sure any search will
    create a discovery that we might not have"]

    Deduped forever on the museum, so a hundred searches of the same collection
    make one proposal and not a hundred."""
    museum = re.sub(r"<[^>]*>", "", (museum or "")).strip()[:80]
    if len(museum) < 4:
        return False
    with _LOCK:
        s = _load()
        k = "gallery#" + _slug(museum)
        if k in s["seen"]:
            # THE DEDUPE MUST NOT PRESERVE THE BUG. Museums recorded in the
            # coordinate-less days sit in this queue unplantable forever, and
            # returning early here is what kept them that way even after the
            # caller learned to pass coordinates. If the stored proposal still
            # lacks a coordinate and this search brought one, backfill it, and
            # the next hourly plant lifts it into the book at last.
            if lat is not None and lon is not None:
                for p in s["proposals"]:
                    if p.get("id") == k and p.get("lat") is None:
                        p["lat"], p["lon"] = lat, lon
                        if not p.get("desc"):
                            p["desc"] = ("A museum%s." % ((" in " + city) if city else ""))
                        _save(s)
                        break
            return True
        s["seen"][k] = int(time.time())
        prop = {
            "id": k, "kind": "place", "src": "universal-gallery", "name": museum,
            "city": _slug(city or "other")[:24] or "other", "cat": "culture",
            "note": ("reached through the gallery" +
                     (" while looking up %s" % example[:40] if example else "")),
            "url": "https://www.google.com/maps/search/" + urllib.parse.quote(museum),
            "found": int(time.time()),
        }
        # WITHOUT A COORDINATE A PROPOSAL CAN NEVER BE PLANTED. plant_discoveries
        # filters on "lat is not None", so the first version of this recorded
        # MoMA and the Prado into a queue that could not reach the book, which is
        # a discovery that discovers nothing. Wikidata has a coordinate for
        # essentially every museum on earth; it travels with the search result
        # now and lands here.
        if lat is not None and lon is not None:
            prop["lat"], prop["lon"] = lat, lon
            # Not "Museo del Prado. A museum, found through the Universal
            # Gallery." A book entry should read like a book entry, and how we
            # came to know about a place is our business, not the traveller's.
            prop["desc"] = ("A museum%s. Found because a traveller looked up %s."
                            % ((" in " + city) if city else "", example[:60])
                            if example else "A museum%s." % ((" in " + city) if city else ""))
        s["proposals"].append(prop)
        _save(s)
    return True


# The pilot cities are the ones we already run, so a search that lands in one of
# them is not a NEW city. Matched on the slug of the key and of the label, since
# the gallery says "New York", not "nyc".
_PILOT_CITY_SLUGS = set(CITIES.keys()) | {_slug(c["label"]) for c in CITIES.values()}


def record_gallery_city(city, museum="", example=""):
    """The CITY a gallery search points at, proposed as a new place to discover.

    [SEAN "i want this search of the location of the museum to be discovered as
    new city to be discovered"] Somebody looking up a painting at the Prado is
    telling us Madrid is worth the book, even if the book has never heard of it.
    The museum is recorded as a place next door to this; this records the city
    around it, on its own, so a whole new city can enter through one search.

    Deduped forever on the city, and the pilot cities we already run are skipped
    because they are not new. A lead only: it waits on /discovery for the owner,
    and a city is never planted into the book automatically."""
    name = re.sub(r"<[^>]*>", "", (city or "")).strip()[:60]
    slug = _slug(name)
    if len(slug) < 3 or slug in _PILOT_CITY_SLUGS:
        return False
    with _LOCK:
        s = _load()
        k = "city#" + slug
        if k in s["seen"]:
            return True
        s["seen"][k] = int(time.time())
        museum = re.sub(r"<[^>]*>", "", (museum or "")).strip()[:80]
        note = "a new city, reached through the gallery"
        if example:
            note += " while looking up %s" % example[:40]
        if museum:
            note += " at %s" % museum
        s["proposals"].append({
            "id": k, "kind": "city", "src": "universal-gallery", "name": name,
            "city": slug, "cat": "city", "note": note,
            "url": "https://www.google.com/maps/search/" + urllib.parse.quote(name),
            "found": int(time.time()),
        })
        _save(s)
    return True


def record_artwork(title, museum, city, item_number="", image="", qid="", artist=""):
    """An artwork somebody looked up, kept so the gallery builds its own index.

    The museums are discovered as PLACES; this is the other half. Every search
    that lands on a real object with a real inventory number is a vote that the
    object is worth writing about, and the written guide is the product. So the
    gallery accumulates a queue of things people actually stood in front of,
    ranked by how often they were asked for, instead of us guessing which
    paintings matter.

    Deduped on the museum's own inventory number where there is one, because
    that is the only identifier that is stable across languages and spellings.
    Counts repeats, since the count IS the signal. [SEAN]"""
    title = re.sub(r"<[^>]*>", "", (title or "")).strip()[:120]
    if len(title) < 2:
        return False
    key = "art#" + _slug((item_number or "") + "|" + (museum or "") + "|" + title)
    with _LOCK:
        s = _load()
        arts = s.setdefault("artworks", {})
        row = arts.get(key)
        if row:
            row["asked"] = row.get("asked", 1) + 1
            row["last"] = int(time.time())
            # An early search may have logged the work before we captured the
            # maker; fill it in the first time a later search carries one.
            if artist and not row.get("artist"):
                row["artist"] = re.sub(r"<[^>]*>", "", artist).strip()[:80]
        else:
            arts[key] = {"title": title, "artist": re.sub(r"<[^>]*>", "", (artist or "")).strip()[:80],
                         "museum": (museum or "")[:80],
                         "city": _slug(city or "")[:24], "item_number": (item_number or "")[:40],
                         "image": (image or "")[:300], "qid": (qid or "")[:16],
                         "asked": 1, "written": False,
                         "first": int(time.time()), "last": int(time.time())}
        if len(arts) > 3000:
            # keep the most asked-for, drop the long tail
            keep = sorted(arts.items(), key=lambda kv: -kv[1].get("asked", 1))[:2000]
            s["artworks"] = dict(keep)
        _save(s)
    return True


def artwork_queue(limit=40):
    """What people keep looking up and nobody has written yet, most asked first.
    This is the writing queue for the Universal Gallery."""
    s = _load()
    rows = [dict(v, key=k) for k, v in (s.get("artworks") or {}).items() if not v.get("written")]
    rows.sort(key=lambda r: (-r.get("asked", 1), r.get("title", "")))
    return rows[:limit]


def gallery_guides(min_asked=2, limit=300):
    """The artworks that have earned a permanent guide page, most asked first.

    Every search is a person telling us what they want to read about. When the
    same object is asked for more than once it stops being noise and becomes
    demand, so it gets its own crawlable page that answers exactly the search
    that keeps arriving. Demand written by the visitors themselves, not guessed
    by us. The slug is the object's own key, stable across languages because it
    is built from the museum's inventory number."""
    s = _load()
    rows = []
    for k, v in (s.get("artworks") or {}).items():
        if v.get("asked", 1) < min_asked or len((v.get("title") or "").strip()) < 2:
            continue
        if not (v.get("museum") or "").strip():
            continue                       # the reading needs the holding museum
        rows.append(dict(v, slug=k[4:] if k.startswith("art#") else k))
    rows.sort(key=lambda r: (-r.get("asked", 1), r.get("title", "")))
    return rows[:limit]


def gallery_guide(slug):
    """One artwork by its guide slug, or None."""
    s = _load()
    v = (s.get("artworks") or {}).get("art#" + (slug or ""))
    if not v:
        return None
    return dict(v, slug=slug)


def record_gallery_miss(q):
    """An artwork search nobody could answer. Same principle as a book miss:
    the words a person typed are the clearest statement of what is missing."""
    q = re.sub(r"<[^>]*>", "", (q or "")).strip()[:80]
    if len(q) < 3:
        return False
    with _LOCK:
        s = _load()
        k = "artmiss#" + _slug(q)
        if k in s["seen"]:
            return True
        s["seen"][k] = int(time.time())
        s["proposals"].append({
            "id": k, "kind": "lead", "src": "gallery-search", "name": q,
            "city": "other", "cat": "culture",
            "note": "searched in the gallery, nothing found",
            "url": "https://www.google.com/search?q=" + urllib.parse.quote(q + " museum"),
            "found": int(time.time()),
        })
        _save(s)
    return True


# ---------------- the hourly refine: new destinations get their voice ----
# [SEAN "the hourly refine would do such a refining of adding the guiding
# voices into the destination"] Every hour, book entries without a recording
# queue up; with an ElevenLabs key in the environment each pass records a
# couple of them in Jason's voice and the Listen button appears on its own.
# Without the key the queue still builds, visible on /discovery, so the
# moment a key exists the site starts speaking by itself.
VOICE_PER_PASS = int(os.environ.get("DISCOVERY_VOICE_PER_PASS", "2"))
VOICE_MAX_CHARS = 700

_book_list = None      # callback: () -> [{name, city, slug, desc, tip}]
_book_set_audio = None  # callback: (city, name, url) -> bool
_book_plant = None     # callback: (payload) -> add-route result
_book_thin = None      # callback: () -> entries that could still be improved
_book_enrich = None    # callback: (city, name, desc, dining) -> bool


def set_book_bridge(list_unvoiced, set_audio, plant=None, thin=None, enrich=None):
    global _book_list, _book_set_audio, _book_plant, _book_thin, _book_enrich
    _book_list, _book_set_audio = list_unvoiced, set_audio
    _book_plant, _book_thin, _book_enrich = plant, thin, enrich


def _narration(e):
    bits = [e.get("name", "").strip().rstrip(".") + "."]
    for f in ("desc", "tip"):
        t = (e.get(f) or "").strip()
        if t:
            if not t.endswith((".", "!", "?")):
                t += "."
            bits.append(t)
    return " ".join(bits)[:VOICE_MAX_CHARS]


def voice_refine():
    """One refine pass. Returns an honest summary either way."""
    if not _book_list:
        return {"ok": False, "error": "no book bridge"}
    queue = []
    for e in _book_list():
        text = _narration(e)
        if len(text) >= 60 and e.get("slug"):
            queue.append((e, text))
    key = os.environ.get("ELEVENLABS_API_KEY", "").strip()
    with _LOCK:
        s = _load()
        s["voice_queue"] = [e["name"] for e, _ in queue][:40]
        s["last_voice"] = int(time.time())
        _save(s)
    if not key:
        return {"ok": True, "queued": len(queue), "recorded": 0,
                "note": "no ELEVENLABS_API_KEY; queue waits"}
    made = []
    try:
        from met_voices import record, JASON
    except Exception as ex:
        return {"ok": False, "error": "recorder unavailable: %s" % ex}
    outdir = os.path.join(os.environ.get("DATA_DIR", BASE_DIR), "media", "audio")
    os.makedirs(outdir, exist_ok=True)
    voice = os.environ.get("GUIDE_VOICE_ID", "").strip() or JASON
    for e, text in queue[:VOICE_PER_PASS]:
        path = os.path.join(outdir, "guide-%s.mp3" % e["slug"])
        try:
            # key, not slug: met_voices.record(key, voice, text, path). For weeks this
            # passed the place slug as the ElevenLabs key, every call 401d inside the
            # try, and the queue "held" forever. Found by the 2026-09-04 audio audit.
            record(key, voice, text, path)
        except Exception:
            continue          # quota or transient: the queue holds it
        url = "/media/audio/guide-%s.mp3" % e["slug"]
        if _book_set_audio and _book_set_audio(e.get("city"), e.get("name"), url):
            made.append(e["name"])
        time.sleep(2)
    with _LOCK:
        s = _load()
        s["voiced"] = (s.get("voiced") or []) + made
        s["voiced"] = s["voiced"][-200:]
        _save(s)
    return {"ok": True, "queued": len(queue), "recorded": len(made), "made": made}


# ---------------- the book grows itself ----------------
# [SEAN, 2026-08-21: "we want to grow it ourselves too, not just from the
# traveler... the book of destinations can be grown instead of just waiting
# for the data"] The scout already finds places; this plants them. Only from
# sources that name a real, mapped, public place, and always through the
# site's own add route, so the private-residence refusal, the dedupe and the
# Wikipedia description all still apply. Leads (a Reddit thread, an Atlas
# Obscura article) are never planted: a headline is not a place.
# "universal-gallery" is here because a museum somebody reached by looking up a
# painting is a place they may well walk to, and the book is where places live.
# It was the last missing link: the gallery was recording MoMA and the Prado
# with coordinates into a queue this list would not read from. [SEAN "the
# location of the museum shared with destination book"]
PLANT_SOURCES = ("osm-new", "wikipedia", "wikivoyage", "dc-open-data", "nps",
                 "universal-gallery")
PLANT_PER_RUN = int(os.environ.get("DISCOVERY_PLANT_PER_RUN", "8"))
PLANT_ENABLED = os.environ.get("DISCOVERY_PLANT", "true").strip().lower() != "false"


def plant_discoveries():
    """Move what we have discovered into the book. Returns an honest tally."""
    if not (_book_plant and PLANT_ENABLED):
        return {"ok": False, "error": "planting off"}
    with _LOCK:
        s = _load()
        # A museum a PERSON searched for outranks a tower the crawler found:
        # gallery proposals were drowning behind dozens of queued osm finds,
        # eight plants an hour, first come first served, so the thing Sean
        # watched for never surfaced. Human signal first, then the crawl.
        queue = sorted([p for p in s["proposals"]
                        if p.get("kind") == "place" and p.get("src") in PLANT_SOURCES
                        and p.get("lat") is not None],
                       key=lambda p: 0 if p.get("src") == "universal-gallery" else 1
                       )[:PLANT_PER_RUN]
    planted, refused, known = [], [], 0
    for p in queue:
        res = _book_plant({
            "name": p.get("name"), "lat": p.get("lat"), "lon": p.get("lon"),
            "city": p.get("city"), "cat": p.get("cat"),
            "found_via": "scout:" + (p.get("src") or ""),
            "osm_class": p.get("osm_class"), "type": p.get("osm_type"),
            "extratags": p.get("extratags"),
            # A proposal that already knows what it is must be able to SAY so.
            # This was dropped here, so a named museum arrived at the gate
            # looking exactly like a nameless point and was refused as junk.
            # The gate was right; the plumbing was not.
            "desc": p.get("desc") or "",
        })
        if res.get("ok") and res.get("already_known"):
            known += 1
        elif res.get("ok"):
            planted.append(p.get("name"))
        else:
            # a refusal is information, not a failure: it is usually the
            # private-residence gate doing its job
            refused.append({"name": p.get("name"),
                            "why": (res.get("error") or "refused")[:60]})
        with _LOCK:
            s = _load()
            s["proposals"] = [q for q in s["proposals"] if q.get("id") != p.get("id")]
            s.setdefault("planted", [])
            if res.get("ok") and not res.get("already_known"):
                s["planted"].append({"name": p.get("name"), "src": p.get("src"),
                                     "at": int(time.time())})
                s["planted"] = s["planted"][-300:]
            s["last_plant"] = int(time.time())
            _save(s)
        time.sleep(0.4)
    return {"ok": True, "planted": len(planted), "already_known": known,
            "refused": refused, "names": planted}


# ---------------- and the book improves what it already has ----------------
# [SEAN: "we also want to work on the data too"] A thin entry is a real cost:
# a row that says "a museum in Boston" teaches a traveller nothing. Each pass
# takes a few of the thinnest and asks Wikipedia what the place actually is,
# and the map what it is like to eat there.
REFINE_PER_PASS = int(os.environ.get("DISCOVERY_REFINE_PER_PASS", "5"))
REFINE_RETRY_DAYS = int(os.environ.get("DISCOVERY_REFINE_RETRY_DAYS", "30"))


def _wiki_desc(name, lat, lon):
    try:
        u = ("https://en.wikipedia.org/w/api.php?action=query&list=geosearch"
             "&gscoord=%f|%f&gsradius=800&gslimit=8&format=json" % (lat, lon))
        found = json.loads(_get(u)).get("query", {}).get("geosearch", [])
    except Exception:
        return None
    # Match on the REAL title, not a stripped key. Two earlier versions of
    # this test were wrong in the same direction, and each would have printed
    # something false on a traveller's card: a substring test matched "2017
    # Times Square car attack" to Times Square, and a prefix test then matched
    # "Times Squared 3015" and "Central Park Hospital". Wikipedia's own
    # qualifiers are always parenthetical, so that is the only extra allowed.
    def norm(x):
        return " ".join(str(x or "").lower().replace("'", "'").split())
    want = norm(name)
    hit = None
    for f in found:
        t = norm(f.get("title"))
        if t == want or t.startswith(want + " ("):
            hit = f
            break
    if not hit:
        return None
    try:
        u2 = ("https://en.wikipedia.org/api/rest_v1/page/summary/%s"
              % urllib.parse.quote((hit.get("title") or "").replace(" ", "_")))
        j = json.loads(_get(u2))
        txt = (j.get("extract") or "").strip()
        return txt[:400] or None
    except Exception:
        return None


def _osm_dining(name, lat, lon):
    """The map's own tags for this spot, if it knows it."""
    try:
        # 90 metres and a generous cap: in a dense block the right building
        # was being truncated away by a limit of twelve.
        q = ('[out:json][timeout:25];(node["name"](around:90,%f,%f);'
             'way["name"](around:90,%f,%f););out tags 60;' % (lat, lon, lat, lon))
        els = json.loads(_get("https://overpass-api.de/api/interpreter",
                              data=urllib.parse.urlencode({"data": q}).encode())
                         ).get("elements", [])
    except Exception:
        return None
    def key(x):
        return "".join(ch for ch in str(x).lower() if ch.isalnum())
    want = key(name)
    for e in els:
        t = e.get("tags", {})
        if key(t.get("name")) == want:
            return t
    return None


def data_refine():
    """One pass of making existing entries better."""
    if not (_book_thin and _book_enrich):
        return {"ok": False, "error": "no book bridge"}
    # Most entries the pass cannot improve, because neither Wikipedia nor the
    # map knows anything more about them. Without a memory of what has been
    # tried, the routine would ask the same fifty questions every hour
    # forever, and be a bad citizen of two free APIs for nothing.
    with _LOCK:
        tried = (_load().get("refine_tried") or {})
    cutoff = time.time() - REFINE_RETRY_DAYS * 86400
    thin = [e for e in _book_thin()
            if e.get("lat") is not None
            and tried.get("%s|%s" % (e.get("city"), e.get("name")), 0) < cutoff]
    done = []
    for e in thin[:REFINE_PER_PASS]:
        tried["%s|%s" % (e.get("city"), e.get("name"))] = int(time.time())
        desc = _wiki_desc(e["name"], e["lat"], e["lon"]) if e.get("thin_desc") else None
        dining = None
        if e.get("no_dining"):
            tags = _osm_dining(e["name"], e["lat"], e["lon"])
            if tags:
                dining = _dining_from_tags(tags)
        if desc or dining:
            if _book_enrich(e["city"], e["name"], desc=desc, dining=dining):
                done.append(e["name"])
    with _LOCK:
        s = _load()
        if len(tried) > 8000:                 # bound the memory
            for k in sorted(tried, key=tried.get)[:len(tried) - 8000]:
                tried.pop(k, None)
        s["refine_tried"] = tried
        s["refined"] = (s.get("refined") or []) + done
        s["refined"] = s["refined"][-300:]
        s["thin_left"] = max(0, len(thin) - len(done))
        s["last_refine"] = int(time.time())
        _save(s)
    return {"ok": True, "improved": len(done), "names": done,
            "still_thin": max(0, len(thin) - len(done))}


_DINING_FLAGS = {"takeaway": "takeaway", "delivery": "delivery",
                 "outdoor_seating": "outdoor seating", "reservation": "reservations",
                 "wheelchair": "step-free", "diet:vegetarian": "vegetarian",
                 "diet:vegan": "vegan", "diet:kosher": "kosher",
                 "diet:halal": "halal", "air_conditioning": "air conditioned"}


def _dining_from_tags(t):
    """Same shape the add route builds, so both paths agree."""
    prof = {}
    cuisine = (t.get("cuisine") or "").strip()[:60]
    if cuisine:
        prof["cuisine"] = cuisine.replace("_", " ").replace(";", ", ")
    menu = (t.get("website:menu") or t.get("menu") or "").strip()
    if menu.startswith("http") and len(menu) < 300:
        prof["menu_url"] = menu
    hours = (t.get("opening_hours") or "").strip()[:120]
    if hours:
        prof["hours_text"] = hours
    flags = [lbl for tag, lbl in _DINING_FLAGS.items()
             if (t.get(tag) or "").strip().lower() in ("yes", "only", "designated", "limited")]
    if flags:
        prof["flags"] = flags[:6]
    return prof or None


def start_thread():
    if not ENABLED:
        return
    def loop():
        time.sleep(120)                       # let the site finish waking up
        while True:
            try:
                s = _load()
                if (time.time() - s.get("last_run", 0)) >= EVERY_H * 3600:
                    run_discovery()
                if (time.time() - s.get("last_voice", 0)) >= 3600:
                    voice_refine()
                if (time.time() - s.get("last_plant", 0)) >= 3600:
                    plant_discoveries()          # the book grows itself
                if (time.time() - s.get("last_refine", 0)) >= 3600:
                    data_refine()                # and improves what it has
            except Exception:
                pass
            time.sleep(600)
    t = threading.Thread(target=loop, daemon=True, name="discovery")
    t.start()
