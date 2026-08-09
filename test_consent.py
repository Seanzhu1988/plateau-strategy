# -*- coding: utf-8 -*-
"""The consent rules, proved rather than promised.

Every assertion here corresponds to a sentence someone could otherwise write
in a privacy policy and then quietly stop honouring. The point of the file is
that the sentence and the code cannot drift apart without this going red.

    python3 test_consent.py
"""
import json
import os
import shutil
import sys
import tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import consent as C                                       # noqa: E402

fails = []


def chk(label, cond):
    print("  %s %s" % ("OK  " if cond else "FAIL", label))
    if not cond:
        fails.append(label)


tmp = tempfile.mkdtemp()
LEDGER = os.path.join(tmp, "consents.json")
PLACES = os.path.join(tmp, "places.json")
store = C.ConsentStore(LEDGER, PLACES)
V = C.CONSENT_TEXTS["map_place"]["version"]

print("consent has to be given, not assumed:")
chk("a missing answer is not consent", store.grant("cus1", "map_place", V, None) is None)
chk("False is not consent", store.grant("cus1", "map_place", V, False) is None)
# The values a pre-ticked box or a sloppy JSON body produces. Each of these
# would sail through `if granted:`.
for truthy in (1, "yes", "true", "on", [1], {"a": 1}):
    chk("%r is not consent either" % (truthy,),
        store.grant("cus1", "map_place", V, truthy) is None)
chk("nothing was written by any of that", store._read(LEDGER) == [])

print("\nand it has to be to a purpose we actually named:")
chk("an unknown purpose is refused",
    store.grant("cus1", "research", V, True) is None)
chk("so is a blank one", store.grant("cus1", "", V, True) is None)
chk("and an anonymous subject", store.grant("", "map_place", V, True) is None)

print("\nthe wording is pinned to the record:")
row = store.grant("cus1", "map_place", V, True)
chk("a proper grant is recorded", bool(row and row.get("id")))
chk("with the version they saw", row["text_version"] == V)
chk("and a hash of the exact words",
    row["text_sha256"] == C.consent_text("map_place")["sha256"])
chk("stale wording is refused, not silently upgraded",
    store.grant("cus2", "map_place", "1999-01-01.1", True) is None)
chk("asking twice does not create a second live consent",
    store.grant("cus1", "map_place", V, True)["id"] == row["id"])

print("\na coordinate cannot be stored, because there is nowhere to put one:")
import inspect                                            # noqa: E402
sig = inspect.signature(C.ConsentStore.record_place)
chk("record_place takes no lat/lon argument (%s)" % list(sig.parameters),
    not any(p in str(sig.parameters).lower() for p in ("lat", "lon", "coord", "point")))
store.record_place(row, "Tacoma", "Washington", "United States")
store.record_place(row, "Leavenworth", "Washington", "United States")
raw = open(PLACES).read()
chk("nothing coordinate-shaped reached the file",
    C.looks_like_coordinate(json.loads(raw)) is None)
chk("and no float at all is on disk",
    not any(isinstance(v, float) for r in json.loads(raw) for v in r.values()))

print("\nthe guard catches a coordinate however it is dressed up:")
chk("an obvious one", C.looks_like_coordinate({"lat": 47.6062}) is not None)
chk("a renamed one (value check)",
    C.looks_like_coordinate({"where": 47.6062}) is not None)
chk("a stringified one",
    C.looks_like_coordinate({"where": "-122.3321"}) is not None)
chk("one buried in a list",
    C.looks_like_coordinate({"a": [{"b": {"gps": "x"}}]}) is not None)
chk("one hiding behind a friendly key name",
    C.looks_like_coordinate({"user_position": "x"}) is not None)
chk("a clean payload passes",
    C.looks_like_coordinate({"city": "Tacoma", "region": "Washington",
                             "count": 3}) is None)

print("\ncoarsen is blunt enough to clear the 1,750ft line, everywhere:")
import math                                               # noqa: E402
seattle = C.coarsen(47.6062, -122.3321)
chk("a real point returns a cell (%s)" % seattle, bool(seattle))
chk("the cell is declared ~11km", seattle["cell_km"] >= 10)
chk("and the answer is not the question — the point is moved",
    seattle["lat"] != 47.6062 and seattle["lon"] != -122.3321)

# The property that matters is RESOLUTION: how far apart two points must be
# before the output can tell them apart. Comparing one pair of points does not
# measure that — any grid splits some near pair across a boundary, which says
# nothing about cell size. So sweep longitude, find where the output actually
# changes, and measure the spacing. That is the resolution, black-box.
#
# Worth measuring rather than reasoning about, because a fixed grid in DEGREES
# is not a fixed distance: a degree of longitude is ~111km at the equator and
# a few metres near the pole, so 0.1 degrees at 89 north would be under 200m —
# well inside the 1,750ft line this exists to clear.
MHMDA_PRECISE_KM = 0.533          # 1,750 feet, the statutory "precise location"


def resolution_km(lat):
    """East-west distance between adjacent output cells at this latitude."""
    lon, prev, edges = -0.5, None, []
    while lon < 3.0 and len(edges) < 2:
        c = C.coarsen(lat, lon)
        cell = (c["lat"], c["lon"]) if c else None
        if prev is not None and cell != prev:
            edges.append(lon)
        prev = cell
        lon += 0.0005
    if len(edges) < 2:
        return float("inf")       # one cell spans the whole parallel: coarser still
    return (edges[1] - edges[0]) * 111.32 * math.cos(math.radians(lat))


for lat in (0.0, 47.6, 60.0, 80.0, 89.0, -89.0):
    km = resolution_km(lat)
    chk("at %5.1f deg lat, nothing finer than %.1fkm is distinguishable"
        % (lat, km), km >= 10.0)
    chk("  which is %.0fx coarser than the statutory precise-location line"
        % (km / MHMDA_PRECISE_KM if km != float("inf") else 999),
        km > MHMDA_PRECISE_KM * 10)

# North-south needs no correction factor, but it still has to be coarse. Same
# measurement, same reason: "these two points collapse" is not a property of a
# grid — every grid splits some adjacent pair — so measure the spacing instead.
lat, prev, edges = 46.5, None, []
while lat < 48.0 and len(edges) < 2:
    cell = (C.coarsen(lat, 0)["lat"],)
    if prev is not None and cell != prev:
        edges.append(lat)
    prev = cell
    lat += 0.0005
ns_km = (edges[1] - edges[0]) * 111.32 if len(edges) >= 2 else float("inf")
chk("north-south resolution is %.1fkm too" % ns_km, ns_km >= 10.0)

chk("a non-point is refused rather than clamped", C.coarsen(91, 0) is None)
chk("so is nonsense", C.coarsen("north", None) is None)
chk("and a NaN", C.coarsen(float("nan"), 0) is None)

print("\nwithdrawal deletes; it does not merely flag:")
before = len(json.load(open(PLACES)))
gone = store.withdraw("cus1", "map_place")
after = json.load(open(PLACES))
chk("the contributions are removed (%d of %d)" % (gone, before),
    gone == 2 and after == [])
led = json.load(open(LEDGER))
chk("the proof of consent survives", len(led) == 1 and led[0]["text_sha256"])
chk("stamped with when it was withdrawn", bool(led[0]["withdrawn_at"]))
chk("and the link between the two files is destroyed",
    led[0]["contrib_key"] is None)
chk("a withdrawn consent is no longer live",
    store.live_consent("cus1", "map_place") is None)
chk("and cannot be used to file anything more",
    store.record_place(led[0], "Spokane") is None)

print("\nthe map counts people, not taps:")
r2 = store.grant("cus2", "map_place", V, True)
r3 = store.grant("cus3", "map_place", V, True)
for _ in range(5):
    store.record_place(r2, "Bellingham")
store.record_place(r3, "Bellingham")
chk("five taps from one person count once (%s)" % store.cities(),
    store.cities().get("Bellingham") == 2)

print("\nretention is enforced without anyone remembering to run it:")
rows = json.load(open(PLACES))
rows[0]["date"] = "2020-01-01"
json.dump(rows, open(PLACES, "w"))
chk("an old row is swept", store.sweep() == 1)
chk("a current one is not", len(json.load(open(PLACES))) == 1)

print("\na person can get their own copy:")
exp = store.export("cus2")
chk("their consents are in it", len(exp["consents"]) == 1)
chk("and it never leaks the linking key",
    all("contrib_key" not in c for c in exp["consents"]))
chk("it states we sold nothing", exp["sold_to_anyone"] is False)

print("\nselling is not a setting:")
src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                        "consent.py"), encoding="utf-8").read()
chk("SALE is a constant, not read from the environment",
    "SALE = False" in src and "SALE" not in src.split("os.environ")[-1][:200])
chk("SALE is False", C.SALE is False)
chk("SHARING is False", C.SHARING is False)

shutil.rmtree(tmp, ignore_errors=True)
print("\nPASSED" if not fails else "\nFAILED: %s" % fails)
raise SystemExit(1 if fails else 0)
