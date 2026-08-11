# -*- coding: utf-8 -*-
"""A journey is either checked or it is not shown. There is no third state.

Wrong transit directions do not produce a bad user experience. They strand a
real person somewhere unfamiliar, possibly at night, possibly without the
language. That is a different category of failure from a broken button, and
these assertions are what make the code pay for it in inconvenience rather
than the traveller pay for it in a night at the airport.

    python3 test_journeys.py
"""
import datetime
import os
import sys

os.environ["DISPATCH_REMINDERS"] = "false"
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import journeys as J                                      # noqa: E402
import app as A                                           # noqa: E402

A.app.config["TESTING"] = True
c = A.app.test_client()
fails = []


def chk(label, cond):
    print("  %s %s" % ("OK  " if cond else "FAIL", label))
    if not cond:
        fails.append(label)


GOOD = {"do": "Board", "confirm": "You are on it", "if_wrong": "Get off",
        "verified": datetime.date.today().isoformat(), "source": "operator"}


def journey(*steps):
    return {"id": "t", "from": "A", "to": "B", "steps": list(steps)}


print("an unverified step withholds the whole journey:")
chk("a fully checked journey is fine", not J.problems(journey(GOOD, GOOD)))
never = dict(GOOD, verified=None)
chk("one unchecked step is enough to hold it",
    len(J.problems(journey(GOOD, never))) == 1)
chk("and the reason names the step",
    "step 2" in J.problems(journey(GOOD, never))[0])
chk("a journey with no steps is not a journey",
    J.problems(journey()) != [])
chk("a malformed date counts as unverified",
    J.problems(journey(dict(GOOD, verified="soon"))) != [])

print("\nand a check goes stale, because transit changes:")
old = dict(GOOD, verified=(datetime.date.today()
                           - datetime.timedelta(days=J.MAX_AGE_DAYS + 1)).isoformat())
chk("a check older than %d days stops serving" % J.MAX_AGE_DAYS,
    J.problems(journey(old)) != [])
chk("and says so in words a person can act on",
    "too long ago" in J.problems(journey(old))[0])
justok = dict(GOOD, verified=(datetime.date.today()
                              - datetime.timedelta(days=J.MAX_AGE_DAYS - 1)).isoformat())
chk("one just inside the window still serves", not J.problems(journey(justok)))

print("\nserve() refuses rather than degrades:")
J.JOURNEYS["__test_bad"] = journey(GOOD, never)
J.JOURNEYS["__test_good"] = journey(GOOD, GOOD)
got, why = J.serve("__test_bad")
chk("an unfit journey returns nothing at all (%s)" % (why or "none"), got is None)
chk("with the reasons", bool(why))
got, why = J.serve("__test_good")
chk("a fit one is returned", got is not None and not why)
chk("an unknown id is refused", J.serve("nope")[0] is None)
# The whole point: there is no way to ask for it anyway.
import inspect                                            # noqa: E402
sig = str(inspect.signature(J.serve))
chk("there is no force/override parameter (%s)" % sig,
    not any(w in sig.lower() for w in ("force", "override", "unsafe", "allow")))

print("\nover HTTP:")
r = c.get("/api/journeys/__test_bad")
chk("an unfit journey is 409, not 404 (%d)" % r.status_code, r.status_code == 409)
chk("404 would send the next person to build it again",
    "reasons" in r.get_json())
chk("and none of its instructions are in the reply",
    "Board" not in r.get_data(as_text=True))
r = c.get("/api/journeys/__test_good")
chk("a fit one is served (%d)" % r.status_code, r.status_code == 200)

print("\nthe listing shows the work still to do:")
d = c.get("/api/journeys").get_json()
ids = {x["id"] for x in d["held"]}
chk("held journeys are listed, not hidden", "__test_bad" in ids)
chk("with their reasons",
    any(x.get("reasons") for x in d["held"] if x["id"] == "__test_bad"))
chk("ready ones are separate", "__test_good" in {x["id"] for x in d["ready"]})

print("\na footprint can stand in for prose verification:")
conn = {"do": "Walk to the platform", "confirm": "You are on it",
        "if_wrong": "Ask", "corridor": "c1", "verified": None, "source": ""}
J.JOURNEYS["__test_fp"] = journey(conn, GOOD)
got, why = J.serve("__test_fp")
chk("without a walked footprint the journey is held (%s)" % why,
    got is None and "footprint" in why[0])
chk("and the reason names the corridor", "c1" in why[0])
WALKED = lambda k: {"date": "2026-08-10", "walks": 1} if k == "c1" else None  # noqa: E731
got, why = J.serve("__test_fp", walked=WALKED)
chk("with one it serves", got is not None and not why)
chk("and the step says how it was verified (%s)"
    % got["steps"][0].get("verified_by"),
    got["steps"][0].get("verified_by") == "walked on 2026-08-10")
chk("the registry itself is never mutated",
    "verified_by" not in J.JOURNEYS["__test_fp"]["steps"][0])
chk("a walk of the WRONG corridor verifies nothing",
    J.serve("__test_fp", walked=lambda k: {"date": "2026-08-10"}
            if k == "other" else None)[0] is None)
J.JOURNEYS.pop("__test_fp", None)

print("\nthe real journey, SeaTac to Lynnwood:")
sl = J.JOURNEYS["seatac-lynnwood"]
chk("it is one train, no transfer", "no change" in sl["summary"].lower())
chk("the fare is recorded ($%s)" % sl["fare_usd"], sl["fare_usd"] == 3.00)
chk("and the run time (%s min)", sl["minutes"] == 71)
chk("every step says how to know it worked",
    all(s.get("confirm") for s in sl["steps"]))
chk("and what to do when it did not",
    all(s.get("if_wrong") for s in sl["steps"]))
chk("the wrong-direction step names the wrong destination — the thing that "
    "actually goes wrong",
    any("Angle Lake" in (s.get("if_wrong") or "") for s in sl["steps"]))
held = J.problems(sl)
chk("it is currently HELD, because the walk through the terminal is unchecked "
    "(%s)" % held, held and "step 1" in held[0])

for k in ("__test_bad", "__test_good"):
    J.JOURNEYS.pop(k, None)
print("\nPASSED" if not fails else "\nFAILED: %s" % fails)
raise SystemExit(1 if fails else 0)
