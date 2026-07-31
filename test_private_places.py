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

shutil.rmtree(tmp, ignore_errors=True)
print("\nPASSED" if not fails else f"\nFAILED: {fails}")
raise SystemExit(1 if fails else 0)
