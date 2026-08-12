# -*- coding: utf-8 -*-
"""Footprints: a recorded walk verifies a journey, and nothing else gets in.

Two failure modes are being priced here, and they pull in opposite directions.
Accept junk and a traveller gets guided along a GPS teleport; the whole point
of a footprint, a line known to work, dies. Accept too freely WHO can file
walks and where, and a coordinate store quietly becomes a movement diary,
undoing every refusal the rest of the site is built on. So half these checks
are about geometry and half are about the fence.

    python3 test_footprints.py
"""
import datetime
import json
import os
import re
import shutil
import sys
import tempfile

os.environ["DISPATCH_REMINDERS"] = "false"
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import footprints as F                                     # noqa: E402
import journeys as J                                       # noqa: E402
import app as A                                            # noqa: E402

A.app.config["TESTING"] = True
tmp = tempfile.mkdtemp()
store = F.Store(os.path.join(tmp, "footprints.json"))
A.FOOTPRINTS = store
A.OWNER_AUTH_PATH = os.path.join(tmp, "owner.json")

fails = []


def chk(label, cond):
    print("  %s %s" % ("OK  " if cond else "FAIL", label))
    if not cond:
        fails.append(label)


def corridor_pts(n=40, step_m=10.0, lat0=47.44300, lon0=-122.30120):
    """A synthetic walk due north, n fixes, step_m metres apart."""
    return [[lat0 + (i * step_m) / 111320.0, lon0] for i in range(n)]


print("corridors are a closed list:")
chk("the SeaTac corridor is opened in code",
    any(c["key"] == "seatac-terminal-to-link" for c in store.corridors()))
walk, why = store.add_walk("my-walk-home", corridor_pts())
chk("an unopened corridor is refused (%s)" % why[:40], walk is None)
chk("and the refusal says corridors are deliberate", "deliberately" in why)

print("\njunk walks are refused with a reason a walker can act on:")
CASES = [
    (corridor_pts(n=5), {}, "too few fixes", "fixes"),
    (corridor_pts()[:20] + [[47.60000, -122.30120]] + corridor_pts()[20:],
     {}, "a GPS teleport", "teleport"),
    (corridor_pts(n=400), {}, "longer than any corridor", "longer"),
    (corridor_pts(n=12, step_m=1.5), {}, "barely moves", "barely"),
    (corridor_pts(n=20) + corridor_pts(n=20)[::-1], {}, "a loop", "same place"),
    (corridor_pts(), {"worst_accuracy_m": 60}, "rough accuracy", "rough"),
    # NaN fails every comparison, so `wa > MAX` waved it through and int()
    # crashed; Infinity tripped the gate and the refusal string crashed
    # formatting it. Both were live 500s until the review panel reproduced
    # them. They must be refusals, like everything else on this list.
    (corridor_pts(), {"worst_accuracy_m": float("nan")}, "a NaN accuracy", "rough"),
    (corridor_pts(), {"worst_accuracy_m": float("inf")}, "an infinite accuracy", "rough"),
    (corridor_pts(), {"worst_accuracy_m": "very"}, "a word for accuracy", "number"),
    (corridor_pts(), {"minutes": "nine"}, "a written-out minutes", "number"),
    (corridor_pts(), {"minutes": float("inf")}, "infinite minutes", "number"),
    ([[91.0, 0.0]] * 15, {}, "off the planet", "Earth"),
    ([["a", "b"]] * 15, {}, "non-numeric points", "pairs"),
    ([{"weird": 1}] * 15, {}, "dicts with no lat/lon", "pairs"),
]
for pts, extra, label, needle in CASES:
    w, why = store.add_walk("seatac-terminal-to-link", pts, **extra)
    chk("%s is refused (%s…)" % (label, (why or "")[:38]),
        w is None and needle.lower() in (why or "").lower())
chk("none of that left a walk behind",
    store.walked("seatac-terminal-to-link") is None)

print("\na real walk is accepted:")
walk, why = store.add_walk("seatac-terminal-to-link", corridor_pts(),
                           minutes=9, worst_accuracy_m=18)
chk("accepted (%s)" % (why or "ok"), walk is not None)
chk("its length is measured, not claimed (%sm)" % walk["length_m"],
    385 <= walk["length_m"] <= 395)
w = store.walked("seatac-terminal-to-link")
chk("the corridor is now walked (%s)" % (w and w["date"]),
    bool(w) and w["walks"] == 1)

print("\nwhat is on disk is a survey, not a diary:")
raw = open(store.file).read()
chk("no clock anywhere, a date and a duration only",
    not re.findall(r"\d{1,2}:\d{2}", raw))
chk("no identity of any kind",
    not any(k in raw for k in ("vid", "user", "owner", "ip", "session")))
chk("points rounded to ~1m, nothing finer on disk",
    not re.findall(r"\d\.\d{6,}", raw))
chk("the file is gitignored, it is the one coordinate store and the repo "
    "is public",
    os.system("cd %s && git check-ignore -q footprints.json"
              % os.path.dirname(os.path.abspath(__file__))) == 0)

print("\nfootprints age out, because buildings change their doors:")
data = json.load(open(store.file))
old = (datetime.date.today() - datetime.timedelta(days=F.MAX_AGE_DAYS + 1)).isoformat()
data["corridors"]["seatac-terminal-to-link"]["walks"][0]["date"] = old
json.dump(data, open(store.file, "w"))
chk("a stale trace stops verifying", store.walked("seatac-terminal-to-link") is None)
chk("and stops being served as a path",
    store.path("seatac-terminal-to-link") is None)
store.add_walk("seatac-terminal-to-link", corridor_pts(), minutes=9,
               worst_accuracy_m=18)          # fresh again for what follows

print("\nthe walk IS the verification, the journey unlocks by itself:")
held, why = J.serve("seatac-lynnwood")
chk("without the store the journey is held, failing closed (%s)" % why[:1],
    held is None and "footprint" in why[0])
got, why = J.serve("seatac-lynnwood", walked=store.walked)
chk("with a fresh walk it serves", got is not None and not why)
chk("and the step says HOW it was verified (%s)"
    % got["steps"][0].get("verified_by"),
    "walked on" in (got["steps"][0].get("verified_by") or ""))
chk("the registry itself was not mutated",
    "verified_by" not in J.JOURNEYS["seatac-lynnwood"]["steps"][0])

print("\nover HTTP, the fence:")
c = A.app.test_client()
r = c.post("/api/footprints/seatac-terminal-to-link",
           json={"points": corridor_pts(), "minutes": 9})
chk("a stranger cannot file a walk (%d)" % r.status_code, r.status_code == 401)
chk("nor read the corridor work-list (%d)" % c.get("/api/footprints").status_code,
    c.get("/api/footprints").status_code == 401)
owner = A.app.test_client()
owner.post("/api/owner/setup", json={"username": "sean", "password": "hunter22"})
r = owner.post("/api/footprints/seatac-terminal-to-link",
               json={"points": corridor_pts(), "minutes": 9,
                     "worst_accuracy_m": 20})
chk("the owner can (%d)" % r.status_code, r.status_code == 200)
d = r.get_json()
chk("the reply confirms the corridor is walked", bool(d.get("walked")))
chk("and does not echo the points back", "points" not in d.get("walk", {}))
r = owner.post("/api/footprints/nope", json={"points": corridor_pts()})
chk("an unopened corridor is refused over HTTP too (%d)" % r.status_code,
    r.status_code == 400)

print("\nthe surveyor programme, issued accounts can walk corridors too:")
import bot_lab                                             # noqa: E402
A.LAB = bot_lab.BotLab(os.path.join(tmp, "u.json"),
                       os.path.join(tmp, "l.json"),
                       os.path.join(tmp, "k.json"))
PW = owner.post("/api/access/users", json={"username": "scout"}).get_json()["password"]
scout = A.app.test_client()
r = scout.post("/api/access/login", json={"username": "scout", "password": PW})
chk("the issued account signs in (%d)" % r.status_code, r.status_code == 200)
r = scout.post("/api/footprints/westlake-to-pike-place",
               json={"points": corridor_pts(), "minutes": 7,
                     "worst_accuracy_m": 12})
chk("and can record a walk (%d)" % r.status_code, r.status_code == 200)
chk("of a Seattle survey corridor, which the code list now opens",
    r.get_json().get("walked") is not None)
raw = open(store.file).read()
chk("the trace still carries NO name, authorization is the provenance, "
    "the record stays clean", "scout" not in raw)
owner.post("/api/access/users/scout/revoke", json={"revoked": True})
r = scout.post("/api/footprints/westlake-to-pike-place",
               json={"points": corridor_pts(), "minutes": 7})
chk("a revoked surveyor is cut off mid-session (%d)" % r.status_code,
    r.status_code == 401)
chk("and the tourist corridors are in the work list",
    {"westlake-to-pike-place", "pike-place-to-waterfront",
     "monorail-to-space-needle"} <= {c["key"] for c in store.corridors()})

print("\nthe walked list is public; the waiting list is not:")
r = c.get("/api/footprints/walked")
chk("anyone can ask what has been walked (%d)" % r.status_code,
    r.status_code == 200)
keys = {x["key"] for x in r.get_json()["corridors"]}
chk("it names the walked corridors (%s)" % sorted(keys),
    {"seatac-terminal-to-link", "westlake-to-pike-place"} <= keys)
chk("and NOT the unwalked ones — those map our unfinished edges",
    "pike-place-to-waterfront" not in keys
    and "monorail-to-space-needle" not in keys)
chk("rows carry no points — the line comes from /path, one at a time",
    all("points" not in x for x in r.get_json()["corridors"]))

print("\nthe path is public only once it exists:")
chk("an unknown corridor's path is 404",
    c.get("/api/footprints/nope/path").status_code == 404)
r = c.get("/api/footprints/seatac-terminal-to-link/path")
chk("a walked one serves to anyone (%d)" % r.status_code, r.status_code == 200)
p = r.get_json()
chk("with the line, its length and the date",
    p.get("points") and p.get("length_m") and p.get("date"))
r = c.get("/api/journeys/seatac-lynnwood")
chk("and the journey now serves over HTTP (%d)" % r.status_code,
    r.status_code == 200)
chk("naming the footprint as its verification",
    "walked on" in json.dumps(r.get_json()))

print("\nthe {lat, lon} shape walk-guide.js documents is accepted, not crashed on:")
w, why = store.add_walk("seatac-terminal-to-link",
                        [{"lat": p[0], "lon": p[1]} for p in corridor_pts()],
                        minutes=9)
chk("accepted (%s)" % (why or "ok"), w is not None)

print("\na JSON body that is not an object is a refusal, not a 500:")
r = owner.post("/api/footprints/seatac-terminal-to-link",
               data="[1,2,3]", content_type="application/json")
chk("a top-level array gets 400 (%d)" % r.status_code, r.status_code == 400)

print("\nthe closed list lives in the CODE, not in the data file:")
# The review panel's exploit: plant a corridor key straight into the store
# file, as a restored backup or any future write path could. Before the fix,
# add_walk accepted walks for it, corridors() listed it, and its line served
# PUBLICLY through /api/footprints/<key>/path, "closed list" was really
# "code list union whatever the disk remembers".
data = json.load(open(store.file))
data["corridors"]["sean-house-to-office"] = {
    "label": "planted", "walks": [{"date": datetime.date.today().isoformat(),
                                   "minutes": 5, "length_m": 300,
                                   "worst_accuracy_m": 5,
                                   "points": corridor_pts(n=12)}]}
json.dump(data, open(store.file, "w"))
w, why = store.add_walk("sean-house-to-office", corridor_pts())
chk("a planted corridor cannot take new walks (%s…)" % (why or "")[:24],
    w is None)
chk("it is not in the work list",
    all(c["key"] != "sean-house-to-office" for c in store.corridors()))
chk("it verifies nothing", store.walked("sean-house-to-office") is None)
chk("and its line is not served", store.path("sean-house-to-office") is None)
chk("nor over the public path route (%d)"
    % c.get("/api/footprints/sean-house-to-office/path").status_code,
    c.get("/api/footprints/sean-house-to-office/path").status_code == 404)

print("\nand the write-time shadow of the store is ignored too:")
chk("footprints.json.tmp is gitignored, a crash mid-write must not leave "
    "coordinates one `git add -A` from a public repo",
    os.system("cd %s && git check-ignore -q footprints.json.tmp"
              % os.path.dirname(os.path.abspath(__file__))) == 0)

print("\nthe file cannot quietly become an archive:")
for i in range(F.MAX_WALKS_KEPT + 6):
    store.add_walk("seatac-terminal-to-link", corridor_pts(), minutes=9)
n = len(json.load(open(store.file))["corridors"]["seatac-terminal-to-link"]["walks"])
chk("at most %d walks are kept (%d)" % (F.MAX_WALKS_KEPT, n),
    n <= F.MAX_WALKS_KEPT)

shutil.rmtree(tmp, ignore_errors=True)
print("\nPASSED" if not fails else "\nFAILED: %s" % fails)
raise SystemExit(1 if fails else 0)
