#!/usr/bin/env python3
"""The job list: every attraction worth a build, state by state, ticked off one
by one.

[SEAN 2026-09-07: "scan all attraction across united state and canada we want
to create a list of work" ... "i want the list to show the states, then city,
town etc and destinations a job list and we will green check mark it one by
one" ... "i want this data to be in pulse too so i can log in to check".]

WHERE THE LIST COMES FROM. Wikidata, one scan, stored. Every row is a real
item with a QID, a name, a state or province, a town and usually a coordinate,
and it is ranked by sitelink count, which is the least dishonest popularity
signal available for free: how many language editions of Wikipedia bothered to
write about the place. It is not visitor numbers and does not pretend to be.

WHAT COUNTS AS DONE. Two different things, kept apart on purpose:

  have  the site already carries this place, matched against the Destination
        Book at build time. Nobody ticked it; it is a statement of fact.
  done  Sean ticked it. A judgement, and the only thing a tap can change.

Keeping them separate matters because the book will grow underneath this list.
Rebuilding the scan refreshes `have` and must never touch `done`, which is why
the merge below is written the long way round rather than as a dict update.

THE RECORD IS SMALL AND THE WRITES ARE RARE, so the whole file is rewritten
atomically on each tick. At a few thousand rows that is a few hundred
kilobytes and one rename, which costs less than the machinery to avoid it.
"""
import json
import os
import re
import threading
import time

_LOCK = threading.Lock()


def _norm(s):
    """A name reduced to the part that identifies it, for matching only.

    Never used for display. The Met is in the Destination Book three times
    under three different names, so this is deliberately blunt: lowercase,
    strip a leading article, drop anything parenthesised, drop punctuation.
    """
    s = (s or "").lower()
    s = re.sub(r"\(.*?\)", " ", s)
    s = re.sub(r"^(the|a|an)\s+", "", s.strip())
    s = re.sub(r"[^a-z0-9 ]", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def load(path):
    try:
        with open(path, encoding="utf-8") as f:
            d = json.load(f)
        if isinstance(d, dict) and isinstance(d.get("items"), dict):
            return d
    except Exception:
        pass
    return {"built": None, "items": {}}


def _write(path, data):
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    os.replace(tmp, path)


def rebuild(path, scanned, have_names=()):
    """Merge a fresh scan in, keeping every tick that has already been made."""
    have = {_norm(n) for n in have_names if n}
    with _LOCK:
        cur = load(path)
        items = cur.get("items", {})
        for row in scanned:
            qid = row.get("qid")
            if not qid:
                continue
            name = (row.get("name") or "").strip()
            # A row Wikidata could not label arrives as its own QID. It is not
            # a name a person could tick, so it is not on the list.
            if not name or re.match(r"^Q\d+$", name):
                continue
            # EVERY PLACE ON THIS LIST HAS TO BE SOMEWHERE. Walking down the
            # class tree from "tourist attraction" also catches things that are
            # famous but not visitable: the first pass returned Newgrounds, a
            # website, and Deepwater Horizon, a drilling rig at the bottom of
            # the Gulf. Requiring a coordinate removes them without a blocklist
            # anyone has to maintain, and a guide cannot walk to a place that
            # has none anyway.
            if row.get("lat") is None or row.get("lon") is None:
                continue
            # Washington DC is a federal district, not a state, so the state
            # lookup finds nothing and forty places landed in a nameless
            # bucket. Anything without a region is filed under its own town
            # rather than under "Elsewhere".
            region = (row.get("region") or "").strip()
            town = (row.get("town") or "").strip()
            if not region:
                region = town or "Elsewhere"
            was = items.get(qid, {})
            items[qid] = {
                "name": name,
                "region": region,
                "town": town,
                "country": row.get("country") or "",
                "links": row.get("links") or 0,
                "lat": row.get("lat"),
                "lon": row.get("lon"),
                "have": _norm(name) in have,
                # A tick is Sean's and survives every rebuild.
                "done": bool(was.get("done")),
                "done_at": was.get("done_at"),
            }
        data = {"built": int(time.time()), "items": items}
        _write(path, data)
        return data


def tick(path, qid, done=True):
    with _LOCK:
        data = load(path)
        it = data.get("items", {}).get(qid)
        if not it:
            return None
        it["done"] = bool(done)
        it["done_at"] = int(time.time()) if done else None
        _write(path, data)
        return it


def grouped(path, country=None):
    """State, then town, then the places, which is the order the work happens in.

    Regions are ordered by how much is left rather than alphabetically: the
    point of the list is what to do next, and a state with forty untouched
    places is more use at the top than Alabama.
    """
    data = load(path)
    items = data.get("items", {})
    regions = {}
    for qid, it in items.items():
        if country and it.get("country") != country:
            continue
        r = it.get("region") or "Elsewhere"
        t = it.get("town") or ""
        reg = regions.setdefault(r, {"region": r, "country": it.get("country", ""),
                                     "towns": {}, "total": 0, "done": 0, "have": 0})
        town = reg["towns"].setdefault(t, {"town": t, "places": []})
        town["places"].append({"qid": qid, "name": it.get("name", ""),
                               "links": it.get("links", 0),
                               "done": bool(it.get("done")), "have": bool(it.get("have"))})
        reg["total"] += 1
        reg["done"] += 1 if it.get("done") else 0
        reg["have"] += 1 if it.get("have") else 0

    out = []
    for reg in regions.values():
        towns = []
        for town in reg["towns"].values():
            town["places"].sort(key=lambda p: (-p["links"], p["name"]))
            towns.append(town)
        towns.sort(key=lambda t: (-len(t["places"]), t["town"]))
        reg["towns"] = towns
        out.append(reg)
    out.sort(key=lambda r: (-(r["total"] - r["done"]), r["region"]))
    return {"built": data.get("built"), "regions": out,
            "total": sum(r["total"] for r in out),
            "done": sum(r["done"] for r in out),
            "have": sum(r["have"] for r in out)}
