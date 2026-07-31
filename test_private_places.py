"""Homes stay out of the public book; the customer can still be driven anywhere.

Payloads below are shaped the way Nominatim actually answers, because the guard
reads the geocoder's own classification rather than guessing from the text.
"""
import os, sys, json, tempfile, shutil

os.environ["DISPATCH_REMINDERS"] = "false"
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import app as A

fails = []
def chk(label, cond):
    print(f"  {'OK  ' if cond else 'FAIL'} {label}")
    if not cond: fails.append(label)


# ---------------------------------------------------------------- the guard
print("kept OUT of the public book:")
HOMES = [
    ("a single-family house",
     {"class": "building", "type": "house", "address": {"house_number": "412", "road": "Maple St"}},
     "412 Maple St"),
    ("a bare street address",
     {"class": "place", "type": "house", "address": {"house_number": "412", "road": "Maple St"}},
     "412 Maple St"),
    ("an apartment block",
     {"class": "building", "type": "apartments", "address": {"house_number": "9", "road": "Pine"}},
     "The Larkspur"),
    ("a detached home",  {"class": "building", "type": "detached", "address": {}}, "Somebody's house"),
    ("a houseboat",      {"class": "building", "type": "houseboat", "address": {}}, "Dock 3 Slip B"),
    ("residential land", {"class": "landuse", "type": "residential", "address": {}}, "Broadmoor"),
    ("Nominatim addresstype=house",
     {"class": "", "type": "", "addresstype": "house", "address": {"house_number": "88"}}, "88 Elm"),
    ("an unclassified address with a house number",
     {"class": "", "type": "", "address": {"house_number": "412", "road": "Maple St"}}, "412 Maple St"),
]
for label, meta, nm in HOMES:
    private, why = A._is_private_residence(meta, nm)
    chk(f"{label} -> refused ({why or 'not refused'})", private)

print("\nstill allowed in — these are public places:")
PLACES = [
    ("a museum",        {"class": "tourism", "type": "museum", "address": {"house_number": "1300"}}, "Seattle Art Museum"),
    ("a viewpoint",     {"class": "tourism", "type": "viewpoint", "address": {}}, "Kerry Park"),
    ("a restaurant",    {"class": "amenity", "type": "restaurant", "address": {"house_number": "86"}}, "Canlis"),
    ("a park",          {"class": "leisure", "type": "park", "address": {}}, "Discovery Park"),
    ("a monument",      {"class": "historic", "type": "monument", "address": {}}, "Pioneer Square Pergola"),
    ("a mountain",      {"class": "natural", "type": "peak", "address": {}}, "Mount Rainier"),
    ("a station",       {"class": "railway", "type": "station", "address": {}}, "King Street Station"),
    ("a shop",          {"class": "shop", "type": "bakery", "address": {"house_number": "1124"}}, "Tall Grass Bakery"),
    ("a named landmark at a street number",
     {"class": "tourism", "type": "attraction", "address": {"house_number": "10"}}, "10 Downing Street"),
    ("a market with no house number",
     {"class": "amenity", "type": "marketplace", "address": {}}, "Pike Place Market"),
    ("a church building", {"class": "building", "type": "church", "address": {}}, "St James Cathedral"),
    ("a hotel building",  {"class": "building", "type": "hotel", "address": {}}, "The Edgewater"),
]
for label, meta, nm in PLACES:
    private, why = A._is_private_residence(meta, nm)
    chk(f"{label} -> allowed" + (f" (WRONGLY refused: {why})" if private else ""), not private)


# ------------------------------------------------- end to end through the app
print("\nthrough the real endpoint:")
tmp = tempfile.mkdtemp()
A.DATA_DIR = tmp
A._data_path = lambda n: os.path.join(tmp, n)
book = os.path.join(tmp, "destinations.json")
A.app.config["TESTING"] = True
c = A.app.test_client()

def book_now():
    try:
        return json.load(open(book))
    except Exception:
        return {"cities": {}, "entries": []}

r = c.post("/api/destinations/add", json={
    "name": "412 Maple St", "lat": 47.61, "lon": -122.33, "city": "seattle",
    "osm_class": "building", "type": "house",
    "address": {"house_number": "412", "road": "Maple St"}})
d = r.get_json()
chk(f"home add returns 200, not an error (got {r.status_code})", r.status_code == 200)
chk("flagged as private", d.get("private") is True)
chk("no entry created", not d.get("entry"))
chk("the address was not written to disk anywhere",
    "Maple" not in json.dumps(book_now()))

r = c.post("/api/destinations/add", json={
    "name": "Kerry Park", "lat": 47.62, "lon": -122.36, "city": "seattle",
    "osm_class": "tourism", "type": "viewpoint", "address": {}})
d = r.get_json()
chk("a real attraction still joins the book", bool(d.get("ok")) and bool(d.get("entry")))
chk("and it is on disk", "Kerry Park" in json.dumps(book_now()))


# ----------------------------------- the customer's right to go there anyway
print("\nthe customer can still be driven to that exact address:")
A.RES_PATH     = os.path.join(tmp, "reservations.json")
A.CUSTOMERS_PATH = os.path.join(tmp, "customers.json")
A.AGENTS_PATH  = os.path.join(tmp, "agents.json")
A.RENTERS_PATH = os.path.join(tmp, "renters.json")
for p in (A.RES_PATH, A.CUSTOMERS_PATH, A.AGENTS_PATH, A.RENTERS_PATH):
    json.dump([], open(p, "w"))

r = c.post("/api/book", json={
    "name": "Dana", "email": "dana@example.com", "phone": "206-555-0142",
    "pickup": "412 Maple St, Seattle WA", "dropoff": "SeaTac Airport",
    "date": "2027-03-04", "time": "05:00", "passengers": 1,
})
d = r.get_json() or {}
chk(f"booking to a private home is accepted (got {r.status_code})",
    r.status_code == 200 and d.get("ok") is True)
res = d.get("reservation") or {}
chk("the private address is kept on the reservation",
    "Maple" in json.dumps(res))
chk("but it still did NOT leak into the public book",
    "Maple" not in json.dumps(book_now()))


# ------------------------------------------- anything already in the live file
print("\nhomes added before the guard existed stop being served:")
json.dump({"cities": {"seattle": "Seattle"},
           "entries": [
               {"name": "412 Maple St", "city": "seattle", "lat": 47.61, "lon": -122.33,
                "source": "user", "added_at": "2026-01-01T00:00:00"},
               {"name": "88 Elm Ave", "city": "seattle", "lat": 47.62, "lon": -122.34,
                "source": "user", "added_at": "2026-01-02T00:00:00"},
               {"name": "Kerry Park", "city": "seattle", "lat": 47.62, "lon": -122.36,
                "source": "user", "added_at": "2026-01-03T00:00:00"},
               {"name": "9/11 Memorial & Museum", "city": "nyc", "lat": 40.71, "lon": -74.01},
           ]}, open(book, "w"))

body = c.get("/api/destinations").get_data(as_text=True)
chk("a pre-existing home is no longer served", "Maple" not in body and "Elm" not in body)
chk("real places are still served", "Kerry Park" in body)
chk("a name starting with a number but not an address survives",
    "9/11 Memorial" in body)

body = c.get("/api/discoveries").get_data(as_text=True)
chk("the discovery feed hides them too", "Maple" not in body and "Elm" not in body)
chk("and still shows genuine finds", "Kerry Park" in body)

# The geography picker reads the same file and would otherwise put a home's
# neighbourhood into the State -> County -> City list for everyone.
json.dump({"cities": {"seattle": "Seattle"},
           "entries": [
               {"name": "412 Maple St", "city": "seattle", "city_label": "Seattle",
                "state": "Washington", "county": "King", "lat": 47.61, "lon": -122.33},
               {"name": "Kerry Park", "city": "seattle", "city_label": "Seattle",
                "state": "Washington", "county": "King", "lat": 47.62, "lon": -122.36},
               {"name": "88 Elm Ave", "city": "hometown", "city_label": "Hometown",
                "state": "Nowhere", "county": "Quiet", "lat": 47.0, "lon": -122.0},
           ]}, open(book, "w"))
g = c.get("/api/geography").get_json()
chk("geography still lists a state reached via a real place",
    "Washington" in (g.get("geo") or {}))
chk("a state known ONLY from a home is not published",
    "Nowhere" not in (g.get("geo") or {}))


# ------------------------------------------------------- the boundary itself
# The point of these two: catch the NEXT feature that reads past the filter,
# the way /api/geography did, without anyone having to remember.
print("\nthe boundary holds structurally, not by habit:")
import re as _re
src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "app.py"),
           encoding="utf-8").read()

opens = [ln.strip() for ln in src.splitlines()
         if "destinations.json" in ln and not ln.lstrip().startswith("#")]
# Exactly two are legitimate: the single reader inside _book_raw(), and the
# path the writer saves to. Anything else is a route reading past the filter.
chk(f"only the one door opens the book (found {len(opens)} references)",
    len(opens) == 2)
chk("the reader lives in _book_raw()",
    any("with open(_data_path(\"destinations.json\"))" in o for o in opens))

# Every route must go through public_book(). _book_raw() returns withheld
# records too, so only the writer may touch it — it has to, or saving would
# drop them. Parsed rather than grepped: splitting the file on "@app.route"
# runs each body into the next one and blames the wrong function.
import ast as _ast
RAW_ALLOWED = {"api_destinations_add"}   # the writer, and nothing else

tree = _ast.parse(src)
offenders = []
for node in _ast.walk(tree):
    if not isinstance(node, (_ast.FunctionDef, _ast.AsyncFunctionDef)):
        continue
    if node.name in RAW_ALLOWED or node.name in ("public_book", "_book_raw"):
        continue
    calls = {c.func.id for c in _ast.walk(node)
             if isinstance(c, _ast.Call) and isinstance(c.func, _ast.Name)}
    if "_book_raw" in calls:
        offenders.append(f"{node.name}() line {node.lineno}")
chk(f"only the writer touches the raw store ({offenders or 'none'})", not offenders)

# And the reverse: the writer must NOT use the filtered view, or every save
# would silently delete the records being withheld.
writer = next(n for n in _ast.walk(tree)
              if isinstance(n, _ast.FunctionDef) and n.name == "api_destinations_add")
wcalls = {c.func.id for c in _ast.walk(writer)
          if isinstance(c, _ast.Call) and isinstance(c.func, _ast.Name)}
chk("the writer reads raw, so saving cannot drop withheld records",
    "_book_raw" in wcalls and "public_book" not in wcalls)

# A record written today must carry its verdict, so reads never have to guess.
stamped = json.load(open(book)) if os.path.exists(book) else {}
print("\nnew records carry their verdict:")
json.dump({"cities": {}, "entries": []}, open(book, "w"))
c.post("/api/destinations/add", json={
    "name": "Gas Works Park", "lat": 47.64, "lon": -122.33, "city": "seattle",
    "osm_class": "leisure", "type": "park", "address": {}})
e = (json.load(open(book)).get("entries") or [{}])[0]
chk("stamped visibility=public at write time", e.get("visibility") == "public")

# and the stamp is what reads trust — a record stamped private stays out even
# if its name looks perfectly innocent.
json.dump({"cities": {"seattle": "Seattle"}, "entries": [
    {"name": "The Quiet House", "city": "seattle", "visibility": "private",
     "lat": 47.6, "lon": -122.3},
    {"name": "Gas Works Park", "city": "seattle", "visibility": "public",
     "lat": 47.64, "lon": -122.33},
]}, open(book, "w"))
body = c.get("/api/destinations").get_data(as_text=True)
chk("a stamped-private record is withheld despite an innocent name",
    "Quiet House" not in body)
chk("a stamped-public record is served", "Gas Works" in body)

# The writer must never lose withheld records when it saves.
c.post("/api/destinations/add", json={
    "name": "Kerry Park", "lat": 47.62, "lon": -122.36, "city": "seattle",
    "osm_class": "tourism", "type": "viewpoint", "address": {}})
names = [x.get("name") for x in json.load(open(book)).get("entries", [])]
chk("saving a new place does not delete withheld ones",
    "The Quiet House" in names and "Kerry Park" in names)

shutil.rmtree(tmp, ignore_errors=True)
print("\nPASSED" if not fails else f"\nFAILED: {fails}")
raise SystemExit(1 if fails else 0)
