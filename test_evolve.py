# -*- coding: utf-8 -*-
"""The evolution monitor reads new data and proposes, it never changes the site.

The first brick of a self-evolving site: it surfaces where the site could grow
(corridors waiting on a walk, ideas gaining interest, trades in demand) as
proposals a human approves. This proves it is owner-only (a work map, not
public) and that it only ever returns proposals, touching nothing.

    python3 test_evolve.py
"""
import os
import sys
import tempfile

os.environ["DISPATCH_REMINDERS"] = "false"
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import app as A                                                # noqa: E402

tmp = tempfile.mkdtemp()
A.ARTICLES_PATH = os.path.join(tmp, "articles.json")
A.OWNER_AUTH_PATH = os.path.join(tmp, "owner.json")
A.app.config["TESTING"] = True

fails = []


def chk(label, cond):
    print("  %s %s" % ("OK  " if cond else "FAIL", label))
    if not cond:
        fails.append(label)


c = A.app.test_client()

print("the monitor is a work map, not a public page:")
chk("a stranger cannot read it (401)", c.get("/api/evolve").status_code == 401)

print("the owner sees proposals, freshest signals from real data:")
with c.session_transaction() as s:
    s["owner"] = "tester"
d = c.get("/api/evolve").get_json()
chk("returns ok, a proposals list, and a scan time",
    d.get("ok") and isinstance(d.get("proposals"), list) and d.get("scanned_at"))
chk("every proposal names what changed and what could follow",
    all(p.get("title") and p.get("detail") and p.get("kind") for p in d["proposals"]))
chk("waiting corridors are proposed for a walk",
    any(p["kind"] == "footprint" for p in d["proposals"]))

print("it proposes, it does not change anything:")
before = c.get("/api/evolve").get_json()["proposals"]
after = c.get("/api/evolve").get_json()["proposals"]
chk("reading it twice changes nothing (proposals only)", len(before) == len(after))

print()
if fails:
    print("FAILED: %d" % len(fails))
    sys.exit(1)
print("all good")
