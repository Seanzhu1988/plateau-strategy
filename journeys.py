# -*- coding: utf-8 -*-
"""Getting a stranger home, one instruction at a time.

The question was: I have landed at SeaTac, I need to reach Lynnwood, I do not
know how. That is not a routing problem. Google already answers the routing
problem, and it is the wrong answer for the person standing in baggage claim
at eleven at night, because it hands over a route and then leaves.

What is actually missing is everything BETWEEN the steps:

  * which way out of the terminal, when the signs assume you have been here;
  * where the ticket is bought, and what it costs, before the machine asks;
  * which platform, when "northbound" means nothing to somebody who does not
    yet know which way north is;
  * whether the train now stopping is the right one;
  * how many stops to sit through, and what the one before yours is called,
    which is the only warning that works;
  * what to do when it has gone wrong.

So a journey here is not a polyline. It is an ordered list of things to do,
each with the one sentence that says you are still right, and each with the
sentence for when you are not.

THE RULE THAT MATTERS: nothing unverified is ever served
--------------------------------------------------------
Wrong directions do not produce a bad user experience. They strand a real
person somewhere unfamiliar, possibly at night, possibly without the language.
That is a different category of failure from a broken button, and it is worth
paying for in inconvenience.

So every step carries `verified`, the date a human confirmed it against the
operator's own published information, and `serve()` REFUSES to return a
journey containing an unverified step. There is no flag to override it. A
half-checked journey is not a degraded journey; it is a trap, and the correct
thing to show is nothing at all.

A journey also expires. Transit changes: a line extends, a stop closes, a
fare rises. A step verified three years ago is a guess wearing a date, so
anything past MAX_AGE_DAYS stops being served until somebody looks again.
"""
import copy
import datetime

# Beyond this, a verification is too old to trust. Transit timetables change
# with the seasons and lines change with the decade; six months is a
# compromise between nagging and stranding.
MAX_AGE_DAYS = 180


# Each step:
#   do      , the single instruction, imperative, one action
#   confirm , how you know it worked. The sentence that stops the panic.
#   if_wrong, what to do when it did not
#   verified, ISO date a human checked this against the operator's own words
#   source  , where they checked
JOURNEYS = {
    "seatac-lynnwood": {
        "id": "seatac-lynnwood",
        "from": "SeaTac / Airport",
        "to": "Lynnwood City Center",
        "summary": "One train the whole way. No changes.",
        # Facts checked 2026-08-09 against Sound Transit's own schedule page:
        # the 1 Line runs SeaTac/Airport to Lynnwood City Center with no
        # transfer, about 1 h 11 m, every 15 minutes, adult fare $3.
        "minutes": 71,
        "fare_usd": 3.00,
        "frequency_min": 15,
        "operator": "Sound Transit",
        "line": "1 Line",
        "steps": [
            {
                "do": "Follow the signs inside the terminal for “Link light rail”.",
                "confirm": "The signs keep saying Link. You have not needed to "
                           "leave the building yet.",
                "if_wrong": "Ask anyone in an airport uniform for Link light "
                            "rail, it is the question they answer most.",
                # No operator page describes this walk, so prose cannot verify
                # it. A footprint can: the step unlocks the day one of us walks
                # terminal-to-platform with /footprint recording. The corridor
                # key names which trace counts.
                "corridor": "seatac-terminal-to-link",
                "verified": None,
                "source": "awaiting a walked footprint",
            },
            {
                "do": "Buy a $3 ticket to Lynnwood City Center at the machine, "
                      "or tap an ORCA card.",
                "confirm": "You are holding a ticket, or your card beeped and "
                           "showed a balance.",
                "if_wrong": "The machines take card and cash. If one is out of "
                            "order there is another on the same platform.",
                "verified": "2026-08-09",
                "source": "Sound Transit 1 Line schedule, adult fare $3",
            },
            {
                "do": "Take the 1 Line towards Lynnwood City Center.",
                "confirm": "The front of the train and the platform sign both "
                           "say Lynnwood City Center. That is the last stop, so "
                           "you cannot overshoot.",
                "if_wrong": "A train towards Angle Lake is the wrong way. Get "
                            "off at the next stop, cross to the other platform, "
                            "and wait, the next one is about 15 minutes.",
                "verified": "2026-08-09",
                "source": "Sound Transit, 1 Line runs SeaTac/Airport to "
                          "Lynnwood City Center, no transfer",
            },
            {
                "do": "Stay on for about 1 hour 10 minutes. Lynnwood City "
                      "Center is the end of the line.",
                "confirm": "Everyone gets off. So do you.",
                "if_wrong": "If you fall asleep, the end of the line is where "
                            "you wanted to be anyway.",
                "verified": "2026-08-09",
                "source": "Sound Transit, approx 1 h 11 m SeaTac to Lynnwood",
            },
        ],
    },
}


def _stale(step, today=None):
    """Is this step's verification missing or too old to serve?"""
    v = step.get("verified")
    if not v:
        return True
    try:
        when = datetime.date.fromisoformat(v)
    except Exception:
        return True
    today = today or datetime.date.today()
    return (today - when).days > MAX_AGE_DAYS


def problems(journey, today=None, walked=None):
    """Every reason this journey must not be shown, in order.

    `walked` is how a footprint stands in for prose: a callable that answers
    "has this corridor a fresh recorded walk?" (see footprints.Store.walked).
    A step naming a corridor is satisfied by either a fresh human check OR a
    fresh footprint. With no callable supplied, corridor steps fail closed, 
    absence of the store must read as unverified, never as fine.
    """
    out = []
    for i, s in enumerate(journey.get("steps") or []):
        if s.get("verified") and not _stale(s, today):
            continue
        key = s.get("corridor")
        if key and walked and walked(key):
            continue
        if key:
            out.append("step %d awaits a walked footprint of %s" % (i + 1, key))
        elif not s.get("verified"):
            out.append("step %d has never been verified" % (i + 1))
        else:
            out.append("step %d was verified on %s, too long ago"
                       % (i + 1, s["verified"]))
    if not journey.get("steps"):
        out.append("the journey has no steps")
    return out


def serve(jid, today=None, walked=None):
    """A journey fit to hand somebody, or (None, why-not).

    Refuses rather than degrades. There is deliberately no parameter to force
    it: the caller who would pass one is the bug this is here to prevent.
    """
    j = JOURNEYS.get(jid)
    if not j:
        return None, ["no such journey"]
    bad = problems(j, today, walked)
    if bad:
        return None, bad
    # A copy, annotated, the registry itself must stay clean. Where a step
    # passed on a footprint rather than a written check, say so: the traveller
    # is being handed a walk somebody actually walked, and that provenance is
    # worth a line.
    out = copy.deepcopy(j)
    for s in out["steps"]:
        key = s.get("corridor")
        if key and walked and (not s.get("verified") or _stale(s, today)):
            w = walked(key)
            if isinstance(w, dict) and w.get("date"):
                s["verified_by"] = "walked on %s" % w["date"]
    return out, []


def listing(today=None, walked=None):
    """What can be offered right now, and what is held back and why."""
    ready, held = [], []
    for jid, j in sorted(JOURNEYS.items()):
        bad = problems(j, today, walked)
        row = {"id": jid, "from": j["from"], "to": j["to"],
               "summary": j.get("summary", ""), "minutes": j.get("minutes")}
        if bad:
            held.append(dict(row, reasons=bad))
        else:
            ready.append(row)
    return {"ready": ready, "held": held}
