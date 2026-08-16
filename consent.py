# -*- coding: utf-8 -*-
"""Consent, made structural.

The idea this exists for: when someone is standing somewhere worth visiting,
let them add that place to the map. The instinct behind it was right, ask
first, and take no for an answer. This file is what turns that instinct into
something that cannot quietly stop being true.

A promise written in a privacy policy is a sentence. A promise a function
refuses to break is a guarantee. Everything below is the second kind.

WHAT IS DELIBERATELY NOT HERE
-----------------------------
There is no field for a coordinate. Not a rounded one, not an encrypted one.
`record_place` takes a city name and nothing else, and `looks_like_coordinate`
rejects a payload that smells of one. That shape is the whole design, and the
reason is Washington's My Health My Data Act: the duties attach to what a
business COLLECTS, and its definition of protected health data reaches PRECISE
location, roughly a 1,750-foot radius, when it could indicate someone sought
health care. A latitude sitting in a JSON file on our disk is collection. A
city name is not, and a city name is all a map of cities ever needed.

So the browser resolves the city (it already talks to the geocoder for every
search on this site) and sends us the answer, not the question. The precise
point never crosses our doorstep, which is a stronger statement than any
retention policy: we cannot leak, subpoena-produce, or accidentally publish a
coordinate we were never given.

`coarsen` exists anyway, for the one future case where a coordinate genuinely
has to be handled server-side. It is the only sanctioned road from a point to
something storable, and it is deliberately blunt.

TWO STORES, ON PURPOSE
----------------------
The consent ledger says who agreed to what, and must survive, a consent you
cannot produce the wording of is not a defence. The contributions say which
cities were added, and must NOT identify anyone. They are linked only by a
random key held in the ledger, so:

  * the contributions file on its own is a list of city names,
  * withdrawing deletes the contributions and destroys the key,
  * the ledger keeps proof that consent was given and then withdrawn.

Withdrawal that only sets a flag is not withdrawal. `withdraw` deletes.

WHAT WE WILL NOT DO
-------------------
SALE and SHARING are False and are not configuration. Selling health-adjacent
location data requires a signed authorization under MHMDA and is not a
business we are in. They are constants so that turning them on is a code
change somebody has to justify in a diff, not a checkbox someone can tick at
2am.

STATUS: inert until a lawyer says otherwise. app.py gates every route on
LOCATION_CONSENT_ENABLED, which defaults to off. This module being importable
is not the feature being live. See PRIVACY.md for the open questions.
"""
import datetime
import hashlib
import json
import math
import os
import re
import secrets
import threading

# ---------------------------------------------------------------- the promises
# Not settings. Changing one of these is a code change with an author.
SALE = False              # we do not sell personal information, full stop
SHARING = False           # nor share it with anyone for their own purposes
RETENTION_DAYS = 400      # a contribution row past this is deleted, consent or not

# A closed set. An unrecognised purpose is refused rather than assumed, because
# "we collected it under some other purpose" is exactly the drift consent is
# supposed to prevent.
PURPOSES = {
    "map_place": "Add the city you are in to the public map of places to visit.",
    "record_walk": "Record the exact path you walk as a footprint others can follow.",
}

# The exact words shown when consent was taken, kept verbatim and hashed. If
# this text ever changes, the version MUST change with it: a ledger row saying
# "they agreed to v1" is worthless if v1 could mean two different things.
CONSENT_TEXTS = {
    "map_place": {
        "version": "2026-08-09.1",
        "text": (
            "Add this place to the map?\n"
            "We save the name of the city you are in, not your exact location, "
            "not your address, and not your name.\n"
            "Saying no changes nothing about your booking or your account, and "
            "you can undo this later."
        ),
    },
    # Recording a walk stores the EXACT line of a corridor, which is far more
    # than the city-level map_place ever keeps, so it gets its own consent, taken
    # in the moment from the signed-in surveyor who walks it. The record still
    # carries no name; this consent is the record that the person walking it
    # agreed, in these words, to have that line collected and published.
    "record_walk": {
        "version": "2026-08-16.1",
        "text": (
            "Record this walk?\n"
            "This saves the exact path you walk along this corridor, its length, "
            "and roughly how long it takes, then publishes that line so other "
            "travellers can follow it.\n"
            "It keeps no name, no clock time, and no device. You are recording on "
            "your own authority as a signed-in surveyor, and a recorded line can "
            "be taken down on request."
        ),
    },
}


def consent_text(purpose):
    """The wording and version for a purpose, or None if it is not one of ours."""
    t = CONSENT_TEXTS.get(purpose)
    if not t:
        return None
    return {"purpose": purpose, "version": t["version"], "text": t["text"],
            "sha256": hashlib.sha256(t["text"].encode("utf-8")).hexdigest()}


# ------------------------------------------------------------ coordinate guard
# Anything that could be a latitude or longitude. Deliberately over-eager: the
# cost of a false positive is one refused contribution, and the cost of a false
# negative is a coordinate on our disk.
_COORD_KEY = re.compile(
    r"lat|lon|lng|coord|geo|gps|point|precise|position|accuracy|altitude", re.I)
_COORD_VALUE = re.compile(r"^-?\d{1,3}\.\d{3,}$")       # 47.6062, -122.3321


def looks_like_coordinate(payload):
    """Does this submission contain anything shaped like a fix on the ground?

    Runs over keys AND values, at any depth. A caller that renames the field to
    slip a coordinate past the key check still trips the value check, and a
    caller that stringifies it still trips the value check.

    Returns the offending key path, or None when the payload is clean.
    """
    def walk(node, path):
        if isinstance(node, dict):
            for k, v in node.items():
                here = "%s.%s" % (path, k) if path else str(k)
                if _COORD_KEY.search(str(k)):
                    return here
                hit = walk(v, here)
                if hit:
                    return hit
        elif isinstance(node, (list, tuple)):
            for i, v in enumerate(node):
                hit = walk(v, "%s[%d]" % (path, i))
                if hit:
                    return hit
        elif isinstance(node, float):
            # A bare float with fractional precision is a coordinate often
            # enough that it is not worth arguing about; nothing we store is
            # a float in the first place.
            if abs(node) <= 180 and abs(node - int(node)) > 1e-9:
                return path or "(value)"
        elif isinstance(node, str) and _COORD_VALUE.match(node.strip()):
            return path or "(value)"
        return None

    return walk(payload, "")


# A degree of latitude is ~111 km everywhere. A degree of longitude is ~111 km
# at the equator and shrinks to nothing at the poles, so a fixed degree grid is
# not a fixed distance: 0.1 degrees of longitude at 89 north is under 200 m,
# well inside the "precise" threshold this is supposed to clear. The step is
# therefore widened by 1/cos(latitude).
_CELL_KM = 11.0
_KM_PER_DEG = 111.32


def coarsen(lat, lon):
    """A point, blunted until it can no longer say where somebody is.

    The only sanctioned way a coordinate may become something we store. Returns
    the CENTRE of a cell at least ~11 km across, which is two orders of
    magnitude coarser than the 1,750-foot line MHMDA draws around precise
    location, and still fine enough to name a metropolitan area.

    Returns None for anything that is not a real point on Earth, rather than
    clamping, a bad coordinate is a bug upstream, and quietly relocating it to
    the nearest pole would hide that.
    """
    try:
        lat, lon = float(lat), float(lon)
    except (TypeError, ValueError):
        return None
    if not (-90.0 <= lat <= 90.0) or not (-180.0 <= lon <= 180.0):
        return None
    if math.isnan(lat) or math.isnan(lon):
        return None

    step_lat = _CELL_KM / _KM_PER_DEG                      # ~0.0988 degrees
    # cos() of a latitude within a hair of the pole is ~0, so floor it: at that
    # point the whole parallel is shorter than one cell and any longitude will
    # do.
    shrink = max(math.cos(math.radians(lat)), 1e-6)
    step_lon = min(step_lat / shrink, 360.0)

    def centre(v, step):
        return round(math.floor(v / step) * step + step / 2.0, 4)

    out_lat = centre(lat, step_lat)
    out_lon = centre(lon, step_lon) if step_lon < 360.0 else 0.0
    return {"lat": out_lat, "lon": out_lon, "cell_km": round(_CELL_KM, 1)}


# ------------------------------------------------------------------- the store
def _now():
    return datetime.datetime.now().isoformat(timespec="seconds")


def _today():
    return datetime.date.today().isoformat()


class ConsentStore(object):
    """The ledger and the contributions, and the rules that hold between them."""

    def __init__(self, ledger_path, places_path):
        self.ledger_path = ledger_path
        self.places_path = places_path
        self._lock = threading.RLock()

    # ---- disk ------------------------------------------------------------
    def _read(self, path):
        try:
            with open(path) as f:
                d = json.load(f)
            return d if isinstance(d, list) else []
        except Exception:
            return []

    def _write(self, path, rows):
        tmp = path + ".tmp"
        with open(tmp, "w") as f:
            json.dump(rows, f, indent=2)
        os.replace(tmp, path)

    # ---- consent ---------------------------------------------------------
    def grant(self, subject, purpose, version, granted):
        """Record an affirmative, specific consent. Returns the row, or None.

        `granted` must be exactly True. Not 1, not "yes", not a non-empty
        string, the places those values come from are a checkbox that shipped
        pre-ticked, or a JSON body where a missing field read as truthy. Both
        are how consent records end up describing agreements nobody made.

        The version must match the wording currently on offer. A client that
        submits an old version is refused rather than upgraded, because the
        person agreed to words we are no longer showing and we cannot know
        which ones they read.
        """
        if granted is not True:
            return None
        if purpose not in PURPOSES:
            return None
        t = consent_text(purpose)
        if not t or version != t["version"]:
            return None
        subject = (str(subject or "").strip())[:120]
        if not subject:
            return None

        row = {
            "id": "CNS" + secrets.token_urlsafe(9),
            "subject": subject,
            "purpose": purpose,
            "text_version": t["version"],
            "text_sha256": t["sha256"],
            "granted_at": _now(),
            "withdrawn_at": None,
            # The only link between a person and the cities they added. Held
            # here and nowhere else, so destroying it severs the two files.
            "contrib_key": secrets.token_urlsafe(12),
        }
        with self._lock:
            rows = self._read(self.ledger_path)
            # One live consent per subject per purpose. Asking twice and
            # storing both makes withdrawal ambiguous.
            for r in rows:
                if r.get("subject") == subject and r.get("purpose") == purpose \
                        and not r.get("withdrawn_at"):
                    return r
            rows.append(row)
            self._write(self.ledger_path, rows)
        return row

    def live_consent(self, subject, purpose):
        """The current, un-withdrawn consent for this subject, or None."""
        if purpose not in PURPOSES:
            return None
        subject = str(subject or "").strip()
        for r in self._read(self.ledger_path):
            if r.get("subject") == subject and r.get("purpose") == purpose \
                    and not r.get("withdrawn_at"):
                # Wording that has moved on since is not live consent. The
                # person agreed to something we no longer say.
                t = consent_text(purpose)
                if t and r.get("text_version") == t["version"]:
                    return r
        return None

    def withdraw(self, subject, purpose):
        """Take it back: delete what was contributed, keep the proof.

        Returns the number of contributions deleted. The ledger row stays, with
        the withdrawal stamped and the key destroyed, that row is the evidence
        that consent existed and that it was honoured when revoked, and it can
        no longer point at anything.
        """
        if purpose not in PURPOSES:
            return 0
        subject = str(subject or "").strip()
        removed = 0
        with self._lock:
            rows = self._read(self.ledger_path)
            keys = set()
            touched = False
            for r in rows:
                if r.get("subject") == subject and r.get("purpose") == purpose \
                        and not r.get("withdrawn_at"):
                    if r.get("contrib_key"):
                        keys.add(r["contrib_key"])
                    r["withdrawn_at"] = _now()
                    r["contrib_key"] = None
                    touched = True
            if touched:
                self._write(self.ledger_path, rows)
            if keys:
                places = self._read(self.places_path)
                keep = [p for p in places if p.get("contrib_key") not in keys]
                removed = len(places) - len(keep)
                if removed:
                    self._write(self.places_path, keep)
        return removed

    # ---- contributions ---------------------------------------------------
    def record_place(self, consent_row, city, region="", country=""):
        """File one city against a live consent. No coordinate, by construction.

        The signature is the enforcement: there is no argument to pass a point
        to. A future caller who wants to store one has to change this line, and
        that change has to survive a code review and test_consent.py.
        """
        if not consent_row or consent_row.get("withdrawn_at"):
            return None
        key = consent_row.get("contrib_key")
        if not key:
            return None
        city = _clean(city, 80)
        if not city:
            return None
        row = {
            "contrib_key": key,
            "city": city,
            "region": _clean(region, 60),
            "country": _clean(country, 60),
            # A date, not a timestamp. "Which city, that day" is a map. "Which
            # city, at 07:41:12" is a movement log, and the extra precision
            # buys the map nothing.
            "date": _today(),
        }
        with self._lock:
            rows = self._read(self.places_path)
            # The same person adding the same city on the same day is one fact,
            # however many times they tap it.
            for r in rows:
                if r.get("contrib_key") == key and r.get("city") == city \
                        and r.get("date") == row["date"]:
                    return r
            rows.append(row)
            self._write(self.places_path, rows)
        return row

    def cities(self):
        """The output that matters: city -> how many people added it.

        Counts distinct contributors, not taps, so one enthusiastic person
        cannot invent a destination.
        """
        tally = {}
        for r in self._read(self.places_path):
            c = r.get("city") or ""
            if not c:
                continue
            tally.setdefault(c, set()).add(r.get("contrib_key"))
        return {c: len(k) for c, k in sorted(tally.items())}

    def sweep(self, max_age_days=RETENTION_DAYS):
        """Delete contributions older than the retention window.

        Runs whether or not anyone withdrew. Data kept because nobody
        remembered to delete it is the ordinary way a modest collection turns
        into a liability.
        """
        cutoff = (datetime.date.today()
                  - datetime.timedelta(days=int(max_age_days))).isoformat()
        with self._lock:
            rows = self._read(self.places_path)
            keep = [r for r in rows if (r.get("date") or "") >= cutoff]
            gone = len(rows) - len(keep)
            if gone:
                self._write(self.places_path, keep)
        return gone

    # ---- the person's own copy -------------------------------------------
    def export(self, subject):
        """Everything held about one person under this module, for them.

        Access requests are answered from here rather than by hand, because a
        hand-assembled answer is one someone can forget a file from.
        """
        subject = str(subject or "").strip()
        mine = [r for r in self._read(self.ledger_path) if r.get("subject") == subject]
        keys = {r.get("contrib_key") for r in mine if r.get("contrib_key")}
        places = [{"city": p.get("city"), "region": p.get("region"),
                   "country": p.get("country"), "date": p.get("date")}
                  for p in self._read(self.places_path)
                  if p.get("contrib_key") in keys]
        return {
            "consents": [{k: v for k, v in r.items() if k != "contrib_key"} for r in mine],
            "places": places,
            "sold_to_anyone": SALE,
            "shared_with_anyone": SHARING,
        }


def _clean(s, limit):
    """A place name with no tags, no newlines and no room to be a paragraph."""
    s = re.sub(r"<[^>]*>", "", str(s or ""))
    s = " ".join(s.split())
    return s[:limit].strip()
