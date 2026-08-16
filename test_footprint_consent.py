# -*- coding: utf-8 -*-
"""Recording a walk needs a login AND consent, taken in the moment.

A footprint is the exact line of a corridor, more than the city-level map ever
keeps, so being a signed-in surveyor is not enough on its own: the walker must
agree to THIS recording in the current words, and the server refuses the walk
without it. This proves the login gate, the consent gate, and that the recorder
is handed the exact consent wording to show.

    python3 test_footprint_consent.py
"""
import os
import sys

os.environ["DISPATCH_REMINDERS"] = "false"
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import app as A                                                # noqa: E402

A.app.config["TESTING"] = True
fails = []


def chk(label, cond):
    print("  %s %s" % ("OK  " if cond else "FAIL", label))
    if not cond:
        fails.append(label)


owner = A.app.test_client()
with owner.session_transaction() as s:
    s["owner"] = "tester"

print("the recorder is handed the consent to show:")
g = owner.get("/api/footprints").get_json()
chk("GET ships a consent with a version and text",
    g.get("ok") and g.get("consent") and g["consent"].get("version") and g["consent"].get("text"))
ver = (g.get("consent") or {}).get("version")
key = (g.get("corridors") or [{}])[0].get("key") or "seatac-terminal-to-link"

print("a visitor cannot record at all:")
stranger = A.app.test_client()
r = stranger.post("/api/footprints/%s" % key, json={"points": []})
chk("no login is refused (401)", r.status_code == 401)

print("a signed-in surveyor still needs consent:")
r = owner.post("/api/footprints/%s" % key, json={"points": []})
j = r.get_json()
chk("no consent is refused (400) and asks for it",
    r.status_code == 400 and j.get("need_consent") and "consent" in (j.get("error") or "").lower())

r = owner.post("/api/footprints/%s" % key,
               json={"points": [], "consent": {"purpose": "record_walk", "version": "not-the-version"}})
chk("a stale or wrong consent version is refused (400)",
    r.status_code == 400 and r.get_json().get("need_consent"))

print("with the right consent, the gate passes (the walk is then judged on its own):")
r = owner.post("/api/footprints/%s" % key,
               json={"points": [], "consent": {"purpose": "record_walk", "version": ver}})
j = r.get_json()
# points are empty so the walk itself is rejected, but NOT for consent: the
# consent gate let it through, so the error is about the walk, not need_consent.
chk("consent accepted, failure is now about the walk not consent",
    r.status_code == 400 and not j.get("need_consent"))

print()
if fails:
    print("FAILED: %d" % len(fails))
    sys.exit(1)
print("all good")
