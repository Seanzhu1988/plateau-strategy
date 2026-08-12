# -*- coding: utf-8 -*-
"""Route demand: count the road, never the traveller.

Sean's correction, 2026-08-09: the product is not "here are fifty travellers,
contact them". It is "this route has fifty people planning it", the operator
learns a road is in demand and rings us. Nobody's identity is in the deal.

So the storage is built so the wrong version is not available later: counts,
not events. No row per planning, no timestamp finer than a month, no origin
address, no coordinates accepted at all. The assertions below are what stops
that decaying into a location trail the first time somebody adds a field.

The normalisation is tested hardest, because it is where this silently fails:
if "Leavenworth, WA" and "Leavenworth, Washington" are different buckets, every
route has one planner, nothing clears the reporting floor, and the tally looks
like it is working while being worthless.

    python3 test_route_demand.py
"""
import json
import os
import shutil
import sys
import tempfile

os.environ["DISPATCH_REMINDERS"] = "false"
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import app as A                                           # noqa: E402

A.app.config["TESTING"] = True
tmp = tempfile.mkdtemp()
A.ROUTE_DEMAND_PATH = os.path.join(tmp, "route_demand.json")
A.OWNER_AUTH_PATH = os.path.join(tmp, "owner.json")
A.ROUTE_DEMAND_MIN = 5

fails = []


def chk(label, cond):
    print("  %s %s" % ("OK  " if cond else "FAIL", label))
    if not cond:
        fails.append(label)


def post(c, a, b, **extra):
    body = {"from": a, "to": b}
    body.update(extra)
    return c.post("/api/route-demand", json=body)


print("the same place written five ways is one place:")
SAME = ["Leavenworth, Chelan County, Washington, United States",
        "Leavenworth, WA", "Leavenworth, Washington", "leavenworth, wa.",
        "  LEAVENWORTH ,  Washington  "]
got = {A._route_place(s) for s in SAME}
chk("all collapse to one bucket (%s)" % got, len(got) == 1)
chk("and it is spelled out", got.pop() == "leavenworth, washington")
chk("other states too", A._route_place("Portland, OR") == "portland, oregon")
chk("a county is dropped",
    A._route_place("Bellevue, King County, Washington") == "bellevue, washington")
chk("outside the US it still works",
    A._route_place("Vancouver, British Columbia, Canada") == "vancouver, british columbia")
chk("nothing in, nothing out", A._route_place("") == "")

print("\na planned road is counted:")
c = A.app.test_client()
r = post(c, "Seattle, Washington", "Leavenworth, Chelan County, Washington, United States")
chk("it records (%s)" % r.get_json(), r.get_json().get("counted") is True)
post(c, "Seattle, WA", "Leavenworth, WA")
routes = list(json.load(open(A.ROUTE_DEMAND_PATH))["months"].values())[0]["routes"]
chk("both spellings hit ONE bucket (%d)" % len(routes), len(routes) == 1)

print("\nand what lands on disk is a count, not a diary:")
rec = list(routes.values())[0]
chk("the record is a number (%s)" % sorted(rec), set(rec) <= {"n", "ids"})
raw = open(A.ROUTE_DEMAND_PATH).read()
# Not "no colons", JSON is made of colons, and that first version passed or
# failed on punctuation rather than on what it claimed to check. What must not
# be here is a clock: an hour and a minute against a route is a movement log
# however few of them there are.
import re                                                  # noqa: E402
clocks = re.findall(r"\d{1,2}:\d{2}(?::\d{2})?", raw)
chk("nothing on disk carries a time of day (%s)" % (clocks or "clean"), not clocks)
chk("the only dates are month buckets (%s)"
    % re.findall(r'"\d{4}-\d{2}(?:-\d{2})?"', raw),
    not re.findall(r'"\d{4}-\d{2}-\d{2}"', raw))
chk("no ip address anywhere", "127.0.0.1" not in raw)
import consent as C                                        # noqa: E402
chk("nothing coordinate-shaped on disk",
    C.looks_like_coordinate(json.load(open(A.ROUTE_DEMAND_PATH))) is None)

print("\ncoordinates are refused, not quietly dropped:")
for extra, how in [({"lat": 47.6062}, "a plain lat"),
                   ({"coords": [47.6, -122.3]}, "a pair in a list"),
                   ({"where": "47.6062"}, "a string under a bland name"),
                   ({"meta": {"gps": 1}}, "nested")]:
    r = post(c, "Seattle, WA", "Spokane, WA", **extra)
    chk("refused %s (%d)" % (how, r.status_code), r.status_code == 400)
chk("and none of them was recorded",
    "spokane" not in open(A.ROUTE_DEMAND_PATH).read())

print("\nnonsense is refused:")
chk("no origin", post(c, "", "Spokane, WA").status_code == 400)
chk("no destination", post(c, "Seattle, WA", "").status_code == 400)
chk("the same place twice, however spelled",
    post(c, "Seattle, WA", "Seattle, Washington").status_code == 400)

print("\none person replanning eleven times is one planner:")
solo = A.app.test_client()
solo.set_cookie("psx_vid", "same-browser")
for _ in range(11):
    post(solo, "Tacoma, WA", "Yakima, WA")
routes = list(json.load(open(A.ROUTE_DEMAND_PATH))["months"].values())[0]["routes"]
chk("counted once (%d)" % routes["tacoma, washington|yakima, washington"]["n"],
    routes["tacoma, washington|yakima, washington"]["n"] == 1)

print("\nour own planning is not demand:")
mine = A.app.test_client()
mine.set_cookie(A.TRAFFIC_OPTOUT_COOKIE, "1")
r = post(mine, "Olympia, WA", "Astoria, OR")
chk("an opted-out device is not counted (%s)" % r.get_json(),
    r.get_json().get("counted") is False)
chk("and left no bucket", "olympia" not in open(A.ROUTE_DEMAND_PATH).read())

print("\na route with too few planners is nobody's business:")
owner = A.app.test_client()
owner.post("/api/owner/setup", json={"username": "sean", "password": "hunter22"})
r = owner.get("/api/route-demand").get_json()
chk("the list is owner-only",
    A.app.test_client().get("/api/route-demand").status_code == 401)
names = {(x["from"], x["to"]) for x in r["routes"]}
chk("the 2-planner route is withheld (%s)" % (names or "none"),
    ("seattle, washington", "leavenworth, washington") not in names)
chk("and the count of withheld routes is reported honestly (%d)" % r["below_floor"],
    r["below_floor"] >= 1)
chk("the floor is stated", r["min_shown"] == 5)

print("\nonce a road clears the floor it is sellable:")
for i in range(6):
    v = A.app.test_client()
    v.set_cookie("psx_vid", "planner-%d" % i)
    post(v, "Seattle, WA", "Leavenworth, WA")
r = owner.get("/api/route-demand").get_json()
top = r["routes"][0] if r["routes"] else {}
chk("it now appears (%s)" % (top.get("to") or "none"),
    top.get("from") == "seattle, washington" and top.get("to") == "leavenworth, washington")
chk("with the planner count (%s)" % top.get("planners"), top.get("planners", 0) >= 5)
chk("and a month breakdown to show it is not one spike",
    isinstance(top.get("by_month"), dict) and top["by_month"])
chk("still no person in the reply",
    C.looks_like_coordinate(r) is None and "psx_vid" not in json.dumps(r)
    and "planner-1" not in json.dumps(r))

print("\nwhen a month closes, the ids go and the count stays:")
data = json.load(open(A.ROUTE_DEMAND_PATH))
data["months"]["2026-01"] = {"routes": {"a, x|b, y": {"n": 0, "ids": ["v1", "v2", "v3"]}}}
json.dump(data, open(A.ROUTE_DEMAND_PATH, "w"))
A._route_fold(data)
old = data["months"]["2026-01"]["routes"]["a, x|b, y"]
chk("the ids are dropped", "ids" not in old)
chk("the count survives (%s)" % old.get("n"), old.get("n") == 3)

shutil.rmtree(tmp, ignore_errors=True)
print("\nPASSED" if not fails else "\nFAILED: %s" % fails)
raise SystemExit(1 if fails else 0)
