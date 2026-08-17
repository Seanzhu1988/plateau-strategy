# -*- coding: utf-8 -*-
"""A journey understands which legs it can track, and which carry you.

Walking is the only trackable mode: footprints live on the ground under your
feet. A ferry, a train, a bus, a car carry you, and there is nothing to walk or
announce, so the guide must not try to track you and must not demand a footprint
of open water. This proves modes are labelled, only a walked corridor is
trackable, a carried leg says the guide waits, and a ferry leg is verified by a
person's checked word, never by a footprint.

    python3 test_journey_modes.py
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import journeys as J                                           # noqa: E402

fails = []


def chk(label, cond):
    print("  %s %s" % ("OK  " if cond else "FAIL", label))
    if not cond:
        fails.append(label)


print("only a walked corridor is trackable:")
chk("a walk with a corridor is trackable",
    J.is_trackable({"mode": "walk", "corridor": "x"}) is True)
chk("a walk without a corridor is not (nothing to follow)",
    J.is_trackable({"mode": "walk"}) is False)
chk("a ferry is never trackable, even if a corridor is mistakenly attached",
    J.is_trackable({"mode": "ferry", "corridor": "water"}) is False)
chk("a train ride is not trackable",
    J.is_trackable({"mode": "ride", "corridor": "rail"}) is False)

print("a served journey labels every leg:")
walked = lambda k: {"date": "2026-08-16"} if k == "seatac-terminal-to-link" else None
got, why = J.serve("seatac-lynnwood", walked=walked)
chk("it serves once the walk is footprinted", got is not None and not why)
chk("every leg carries a mode and a trackable flag",
    all("mode" in s and "trackable" in s for s in got["steps"]))
chk("the walk leg is trackable, the ride legs are not",
    got["steps"][0]["trackable"] is True
    and all(s["trackable"] is False for s in got["steps"][1:]))
chk("a carried leg tells the traveller the guide waits",
    any("passenger" in (s.get("guide_note") or "") for s in got["steps"]
        if s["mode"] == "ride"))

print("a ferry leg needs a checked word, never a footprint:")
chk("an unverified ferry leg holds the whole journey",
    bool(J.problems({"steps": [{"mode": "ferry", "do": "Board", "verified": None}]})))
chk("a human-checked ferry leg passes with no footprint at all",
    not J.problems({"steps": [{"mode": "ferry", "do": "Board",
                               "verified": "2026-08-16"}]}))

print()
if fails:
    print("FAILED: %d" % len(fails))
    sys.exit(1)
print("all good")
