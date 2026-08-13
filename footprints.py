# -*- coding: utf-8 -*-
"""Footprints: a walk somebody actually took, kept as the map.

Sean's brief, 2026-08-10: "we just need foot prints." The SeaTac-to-Lynnwood
journey is held by its own rule because nobody verified the walk from the
terminal to the Link platform, and the honest way to verify a walk is not to
write prose about it, it is to WALK it, phone recording, and keep the trace.
The footprint is the verification. Later it is also the guidance: the next
traveller can be told how far they have strayed from a line that is known to
work, which matters most indoors, where street routing gives up.

WHAT A FOOTPRINT IS, AND IS NOT
-------------------------------
This is the one store on the site that holds GPS traces, metre-level lines.
(The traffic system's geo cache keeps city-level centroids rounded to whole
kilometres; coarse enough to name a city, useless to describe a walk. Saying
"the only coordinates" here would be false, and this file of all files does
not get to overclaim.) So the line gets drawn in ink. A footprint is a survey of a PUBLIC CORRIDOR, terminal door to
platform, garage to lobby, recorded deliberately by our own signed-in people,
walking it in order to map it. It is the business surveying a walkway.

It is not visitor data, and four properties keep it that way:

  * the submitting endpoint is owner-authenticated, no visitor can reach it;
  * the corridors are a CLOSED LIST, written in this file. A walk offered for
    a corridor we did not open is refused, so this cannot become anyone's
    movement diary, there is nowhere to file a movement that is not one of
    our own named walkways;
  * a stored walk carries no identity and no clock. A date and a duration,
    never a timestamp, "the corridor takes about nine minutes" is a map;
    "someone was at the door at 23:41:07" is surveillance, and the field for
    it does not exist;
  * points are rounded to ~1 metre, and each corridor keeps at most
    MAX_WALKS_KEPT traces, so the file cannot quietly become an archive.

consent.py refuses coordinates everywhere a VISITOR is on the other end.
That refusal is about them. This store is about us and our own ground, and
conflating the two would have meant either weakening their guard or never
being able to map our own front door.
"""
import datetime
import json
import math
import os
import threading

MIN_POINTS = 10          # fewer fixes than this is a tap, not a walk
MAX_JUMP_M = 100         # a bigger gap between fixes is a GPS teleport
MAX_LEN_M = 3000         # longer than any corridor; a hike is not a survey
MIN_LEN_M = 25           # shorter than this and nobody went anywhere
MIN_ENDS_M = 30          # a corridor connects two places, not one to itself
MAX_ACCURACY_M = 35      # a worst fix rougher than this cannot map a corridor
MAX_WALKS_KEPT = 20      # per corridor; newest kept, oldest dropped
# A walk older than this stops verifying anything. Matches the journey rule
# (journeys.MAX_AGE_DAYS) on purpose: a footprint IS a verification, and it
# ages like one, buildings change their doors more often than trains change
# their termini.
MAX_AGE_DAYS = 180

# The closed list. Opening a corridor is a code change with an author, which
# is the point, see the module docstring.
#
# The Seattle set below is the data-collection programme, 2026-08-10: the
# corridors travellers actually ask about, opened for surveying so that the
# footprint tool collects the tourism map as well as the transit one. A
# recorded walk of each becomes a self-guided route the talking guide can
# narrate. All are A-to-B on purpose, the recorder refuses a loop, because
# start-equals-finish is indistinguishable from a trace that never went
# anywhere. No corridor here carries coordinates until somebody walks it;
# a name is a promise to survey, not a survey.
DEFAULT_CORRIDORS = {
    "seatac-terminal-to-link": {
        "label": "SeaTac Airport, arrivals to the Link light rail platform",
        "journey": "seatac-lynnwood",
    },
    "westlake-to-pike-place": {
        "label": "Westlake Station to the Pike Place Market entrance",
        "journey": None,
    },
    "pike-place-to-waterfront": {
        "label": "Pike Place Market to the waterfront at Pier 62",
        "journey": None,
    },
    "monorail-to-space-needle": {
        "label": "Seattle Center Monorail platform to the Space Needle entrance",
        "journey": None,
    },

    # The Met, indoors. GPS in the stone wings usually fails this store's own
    # accuracy rule, and that is fine: a refused walk is the recorder being
    # honest. Corridors near glass (the Sackler Wing, the Great Hall doors)
    # sometimes survey cleanly; the rest wait for the steps-and-minutes
    # recorder. Until a corridor is walked, the /met page shows its time as
    # an estimate with a tilde, which is the truthful state of knowledge.
    "met-egyptian--great-hall": {
        "label": "The Met, Great Hall to Egyptian Art", "journey": None},
    "met-dendur--egyptian": {
        "label": "The Met, Egyptian Art to the Temple of Dendur", "journey": None},
    "met-american-court--dendur": {
        "label": "The Met, Temple of Dendur to the American Wing court", "journey": None},
    "met-arms-armor--great-hall": {
        "label": "The Met, Great Hall to Arms and Armor", "journey": None},
    "met-arms-armor--medieval": {
        "label": "The Met, Arms and Armor to Medieval Art", "journey": None},
    "met-lehman--medieval": {
        "label": "The Met, Medieval Art to the Lehman Wing", "journey": None},
    "met-great-hall--greek-roman": {
        "label": "The Met, Great Hall to Greek and Roman Art", "journey": None},
    "met-greek-roman--modern": {
        "label": "The Met, Greek and Roman to Modern Art", "journey": None},
    "met-medieval--modern": {
        "label": "The Met, Medieval Art to Modern Art", "journey": None},
    "met-grand-stair--great-hall": {
        "label": "The Met, Great Hall to the Grand Staircase", "journey": None},
    "met-grand-stair--grand-stair-2": {
        "label": "The Met, Grand Staircase, floor 1 to floor 2", "journey": None},
    "met-euro-paintings--grand-stair-2": {
        "label": "The Met, Grand Staircase to European Paintings", "journey": None},
    "met-euro-paintings--nineteenth-century": {
        "label": "The Met, European Paintings to the 19th-century galleries", "journey": None},
    "met-asian-astor--euro-paintings": {
        "label": "The Met, European Paintings to Asian Art and the Astor Court", "journey": None},
    "met-asian-astor--islamic": {
        "label": "The Met, Asian Art to Islamic Art", "journey": None},
    "met-grand-stair-2--islamic": {
        "label": "The Met, Islamic Art to the Grand Staircase", "journey": None},
}


def _haversine_m(a, b):
    lat1, lon1, lat2, lon2 = map(math.radians, (a[0], a[1], b[0], b[1]))
    s = (math.sin((lat2 - lat1) / 2) ** 2
         + math.cos(lat1) * math.cos(lat2) * math.sin((lon2 - lon1) / 2) ** 2)
    return 6371000.0 * 2 * math.atan2(math.sqrt(s), math.sqrt(1 - s))


def _today():
    return datetime.date.today().isoformat()


class Store(object):
    """The corridors and their walks, plus the rules between them."""

    def __init__(self, path):
        # `file`, not `path`: this class also HAS a method called path(), the
        # corridor's walked line, and an attribute of the same name would
        # shadow it, turning every FOOTPRINTS.path(key) call into
        # "'str' object is not callable". Found because a test tried it.
        self.file = path
        self._lock = threading.RLock()

    # ---- disk ------------------------------------------------------------
    def _read(self):
        try:
            with open(self.file) as f:
                d = json.load(f)
        except Exception:
            d = None
        if not isinstance(d, dict) or not isinstance(d.get("corridors"), dict):
            d = {"corridors": {}}
        for key, meta in DEFAULT_CORRIDORS.items():
            d["corridors"].setdefault(key, {"label": meta["label"], "walks": []})
        return d

    def _write(self, d):
        tmp = self.file + ".tmp"
        with open(tmp, "w") as f:
            json.dump(d, f, indent=1)
        os.replace(tmp, self.file)

    # ---- recording -------------------------------------------------------
    def add_walk(self, key, points, minutes=None, worst_accuracy_m=None):
        """One recorded walk of one corridor. Returns (walk, "") or (None, why).

        Refusals are sentences a person holding the phone can act on, because
        the person holding the phone is standing in the corridor and can walk
        it again, that is cheap now and impossible later.
        """
        with self._lock:
            data = self._read()
            # Membership is checked against the CODE list, not the data file.
            # The review panel proved the difference matters: checking the
            # file meant a corridor removed from DEFAULT_CORRIDORS stayed
            # open forever, because its record survived on disk, "closed
            # list" was really "code list union whatever the disk remembers".
            # Closing a corridor must be exactly as deliberate as opening one:
            # one code change. A removed corridor's stored walks stay on disk,
            # dormant, but nothing accepts, serves or verifies against them.
            if key not in DEFAULT_CORRIDORS:
                return None, ("No such corridor. Corridors are opened in "
                              "footprints.py, deliberately, this cannot "
                              "record a walk we did not name first.")
            try:
                pts = []
                for p in points:
                    if isinstance(p, dict):
                        # walk-guide.js documents {lat, lon} objects as a
                        # valid point shape; honouring that here beats
                        # crashing on it, which is what a KeyError outside
                        # the except tuple used to do.
                        p = (p.get("lat"), p.get("lon"))
                    pts.append((round(float(p[0]), 5), round(float(p[1]), 5)))
            except (TypeError, ValueError, IndexError, KeyError):
                return None, "Points must be [lat, lon] pairs."
            if minutes is not None:
                try:
                    minutes = int(float(minutes))
                except (TypeError, ValueError, OverflowError):
                    return None, "minutes must be a number."
            if len(pts) < MIN_POINTS:
                return None, ("Only %d fixes, a corridor needs at least %d. "
                              "Walk it with the recorder running the whole way."
                              % (len(pts), MIN_POINTS))
            for lat, lon in pts:
                if not (-90.0 <= lat <= 90.0 and -180.0 <= lon <= 180.0):
                    return None, "A point is not a place on Earth."
            length = 0.0
            for i in range(1, len(pts)):
                d = _haversine_m(pts[i - 1], pts[i])
                if d > MAX_JUMP_M:
                    return None, ("A %dm jump between two fixes, that is the "
                                  "GPS teleporting, not you walking. Try "
                                  "again, a little slower through that spot."
                                  % round(d))
                length += d
            if length < MIN_LEN_M:
                return None, "The trace barely moves, %dm in total." % round(length)
            if length > MAX_LEN_M:
                return None, ("%dm is longer than any corridor. Record the "
                              "corridor, not the day." % round(length))
            if _haversine_m(pts[0], pts[-1]) < MIN_ENDS_M:
                return None, ("Start and finish are the same place. A corridor "
                              "connects two, record one direction, door to "
                              "platform.")
            worst = None
            if worst_accuracy_m is not None:
                try:
                    wa = float(worst_accuracy_m)
                except (TypeError, ValueError):
                    return None, "worst_accuracy_m must be a number."
                # "not provably fine" rather than "provably bad": NaN fails
                # every comparison, so `wa > MAX` let a NaN sail past the gate
                # and crash on int() below, and Infinity tripped the gate only
                # to crash formatting the refusal. The review panel reproduced
                # both as HTTP 500s. This shape refuses all of them.
                if not (0 <= wa <= MAX_ACCURACY_M):
                    return None, ("The roughest fix was ±%sm, too rough to "
                                  "map a corridor. Indoors this happens; "
                                  "walking it again often gets a better run."
                                  % (round(wa) if math.isfinite(wa) else wa))
                worst = int(round(wa))
            walk = {
                "date": _today(),                    # a date. Never a clock.
                "minutes": minutes if minutes else None,
                "length_m": int(round(length)),
                "worst_accuracy_m": worst,
                "points": [[a, b] for a, b in pts],
            }
            rec = data["corridors"][key]
            rec["walks"] = (rec.get("walks") or [])[-(MAX_WALKS_KEPT - 1):] + [walk]
            self._write(data)
            return walk, ""

    # ---- reading ---------------------------------------------------------
    def _fresh(self, walks, today=None, max_age_days=MAX_AGE_DAYS):
        today = today or datetime.date.today()
        out = []
        for w in walks or []:
            try:
                when = datetime.date.fromisoformat(w.get("date") or "")
            except ValueError:
                continue
            if (today - when).days <= max_age_days:
                out.append(w)
        return out

    def walked(self, key, today=None, max_age_days=MAX_AGE_DAYS):
        """{"date", "walks"} when this corridor has a fresh trace, else None.

        A stale footprint verifies nothing: a building changes its doors more
        often than a railway changes its terminus.

        Reads enforce the code list too, not just writes. Otherwise a corridor
        removed from DEFAULT_CORRIDORS would keep verifying journeys and keep
        serving its line publicly off its surviving disk record, closed for
        writing, wide open for everything that matters."""
        if key not in DEFAULT_CORRIDORS:
            return None
        rec = self._read()["corridors"].get(key)
        if not rec:
            return None
        fresh = self._fresh(rec.get("walks"), today, max_age_days)
        if not fresh:
            return None
        return {"date": max(w["date"] for w in fresh), "walks": len(fresh)}

    def path(self, key, today=None):
        """The freshest walked line, for guiding the next person. None if unwalked."""
        if key not in DEFAULT_CORRIDORS:        # closed in code = closed here
            return None
        rec = self._read()["corridors"].get(key)
        if not rec:
            return None
        fresh = self._fresh(rec.get("walks"), today)
        if not fresh:
            return None
        best = max(fresh, key=lambda w: w["date"])
        pts = best["points"]
        # Notes are stored as a FRACTION along the corridor (0..1), not an index,
        # so re-walking the corridor with a different number of fixes does not
        # move every description. Convert to the nearest index of the current
        # best walk on the way out, which is what corridorAnnounce consumes.
        notes = []
        for n in (rec.get("notes") or []):
            try:
                frac = min(1.0, max(0.0, float(n.get("at_frac"))))
            except (TypeError, ValueError):
                continue
            at = int(round(frac * (len(pts) - 1)))
            notes.append({"at": at, "at_frac": frac,
                          "text": str(n.get("text") or "")[:200],
                          "side": n.get("side") if n.get("side") in
                          ("left", "right", "ahead") else "ahead"})
        return {"key": key, "label": rec.get("label", key),
                "date": best["date"], "length_m": best["length_m"],
                "minutes": best.get("minutes"), "points": pts, "notes": notes}

    def set_notes(self, key, notes):
        """Owner sets the described waypoints for a corridor. Fractions, so they
        outlive a re-walk. Returns the stored list, or None for an unknown key."""
        if key not in DEFAULT_CORRIDORS:
            return None
        clean = []
        for n in (notes or [])[:50]:
            try:
                frac = min(1.0, max(0.0, float(n.get("at_frac"))))
            except (TypeError, ValueError):
                continue
            text = " ".join(str(n.get("text") or "").split())[:200]
            if not text:
                continue
            side = n.get("side") if n.get("side") in ("left", "right", "ahead") else "ahead"
            clean.append({"at_frac": round(frac, 4), "text": text, "side": side})
        with self._lock:
            data = self._read()
            rec = data["corridors"].setdefault(key, {"label": DEFAULT_CORRIDORS[key]["label"],
                                                      "walks": []})
            rec["notes"] = clean
            self._write(data)
        return clean

    def corridors(self, today=None):
        """Every corridor, walked or waiting, the work list.

        Iterates the CODE list. A key that exists only in the data file is a
        corridor somebody closed; it is dormant, not listed, and its walks sit
        unreferenced on disk until the corridor is reopened or the file is
        cleaned by hand."""
        out = []
        d = self._read()["corridors"]
        for key in sorted(DEFAULT_CORRIDORS):
            rec = d.get(key) or {}
            out.append({"key": key,
                        "label": rec.get("label", DEFAULT_CORRIDORS[key]["label"]),
                        "walks": len(rec.get("walks") or []),
                        "walked": self.walked(key, today)})
        return out
