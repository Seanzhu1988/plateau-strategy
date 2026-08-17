# -*- coding: utf-8 -*-
"""Atlas Scout: find organizations worth calling, with a way to call them.

Atlas was a pipeline you had to fill by hand, so it only ever held the
prospects somebody had already thought of. This finds them: it asks
OpenStreetMap for the kinds of organizations that send people to a car
service, hotels with a front desk, travel agencies, event venues, senior
homes, ferry and cruise terminals, and returns the ones that publish a
way to reach them.

Three rules it keeps.

  A PROSPECT WITH NO CONTACT ROUTE IS NOT A PROSPECT. Anything with no
  phone, no email and no website is dropped rather than parked in the
  pipeline for someone to look up later.

  IT SAYS WHERE EACH FACT CAME FROM. Every row is stamped with its OSM
  id and marked contact_confidence "likely", never "verified": community
  map data is real and can be stale, and the person dialing should know
  which of those they are holding.

  IT NEVER ADDS THE SAME PLACE TWICE. Dedupe is by OSM id first, then by
  name and street, so re-running a scout on a wider radius adds only what
  is genuinely new.

Free, no key, no account: Overpass is a public read of OpenStreetMap. It
does load-shed under pressure, so this tries several mirrors before it
reports a failure, and reports one plainly rather than returning nothing
and looking empty.
"""

import json
import math
import re
import urllib.parse
import urllib.request

# Planet-wide mirrors only. This list once held overpass.osm.ch, which is a
# SWISS regional extract: asked about Seattle hotels it answered, valid JSON,
# zero elements, and the scout reported an empty city. A mirror that holds
# part of the world is worse than a mirror that is down, because being down
# is visible. Anything added here must carry the whole planet.
MIRRORS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.private.coffee/api/interpreter",
]

# What we hunt, and why each one is worth a call. The label is what Atlas
# shows; the route is the desk a caller should actually ask for, which is
# the difference between a lead and a phone number.
KINDS = {
    "hotel": {
        "label": "Hotel",
        "route": "front desk or concierge",
        "why": "Guests without a car ask the desk first. A standing rate card at the desk is the oldest referral in the trade.",
        "q": ['["tourism"~"^(hotel|motel|hostel|guest_house)$"]'],
        "weight": 5,
    },
    "travel_agency": {
        "label": "Travel agency",
        "route": "the owner, they are usually small offices",
        "why": "They already book the trip. Ground transport is the piece they most often leave to the traveller.",
        "q": ['["office"="travel_agent"]', '["shop"="travel_agency"]'],
        "weight": 5,
    },
    "tour_operator": {
        "label": "Tour operator",
        "route": "operations, whoever schedules the guides",
        "why": "A licensed guide with a car is the same trade. Overflow days are the opening.",
        "q": ['["tourism"="attraction"]["operator:type"="private"]',
              '["office"="guide"]'],
        "weight": 4,
    },
    "event_venue": {
        "label": "Event venue",
        "route": "events or catering manager",
        "why": "Weddings and conferences move groups on a schedule, which is exactly what a car service sells.",
        "q": ['["amenity"~"^(events_venue|conference_centre)$"]'],
        "weight": 4,
    },
    "senior_living": {
        "label": "Senior living",
        "route": "activities director or transport coordinator",
        "why": "Standing appointments, repeat routes, and residents who have stopped driving.",
        "q": ['["amenity"="social_facility"]["social_facility"~"^(assisted_living|nursing_home|group_home)$"]'],
        "weight": 4,
    },
    "terminal": {
        "label": "Terminal",
        "route": "ground transportation desk",
        "why": "Cruise and ferry terminals hand off hundreds of people at a known hour.",
        "q": ['["amenity"="ferry_terminal"]', '["aeroway"="terminal"]'],
        "weight": 3,
    },
    "car_rental": {
        "label": "Car rental",
        "route": "branch manager",
        "why": "They turn away the customers who do not want to drive, and the sold-out days.",
        "q": ['["amenity"="car_rental"]'],
        "weight": 2,
    },
}


def _first(tags, *keys):
    for k in keys:
        v = (tags.get(k) or "").strip()
        if v:
            return v
    return ""


def _clean_phone(v):
    """One number, in a shape a phone can dial. OSM often lists several."""
    v = re.split(r"[;,]", v)[0].strip()
    return v[:40]


def _address(tags):
    parts = [
        " ".join(x for x in [tags.get("addr:housenumber", ""), tags.get("addr:street", "")] if x).strip(),
        tags.get("addr:city", ""),
        tags.get("addr:state", ""),
    ]
    return ", ".join(p for p in parts if p)[:160]


def _bbox(lat, lon, radius_km):
    """A box, not a circle. Overpass answers a bbox far more cheaply than an
    around-radius scan, and under load cheap is the difference between an
    answer and a gateway timeout. The corners are padded by the radius, so
    the box contains the circle; anything in the corners is a near miss, not
    a wrong result."""
    dlat = radius_km / 111.0
    dlon = radius_km / (111.0 * max(0.2, math.cos(math.radians(lat))))
    return (lat - dlat, lon - dlon, lat + dlat, lon + dlon)


def _query(kind, box):
    """One kind, one query. Splitting by kind keeps each request small and
    keeps one expensive category from sinking the whole scout: a timeout on
    senior homes should not cost you the hotels."""
    s, w, n, e = box
    blocks = "".join('nwr(%.5f,%.5f,%.5f,%.5f)%s["name"];' % (s, w, n, e, sel)
                     for sel in KINDS[kind]["q"])
    return "[out:json][timeout:45];(%s);out center tags 150;" % blocks


def _fetch(query, timeout=75):
    """Ask each mirror in turn. Returns (elements, error).

    An EMPTY answer is not trusted from a single mirror. A busy server can
    answer with nothing, a partial mirror can answer with nothing about
    your continent, and both look exactly like a genuinely empty search.
    So zero results move on to the next mirror, and are only believed when
    every mirror agrees. Results, being expensive to fake, are believed at
    once."""
    last = "no mirror answered"
    saw_empty = False
    data = urllib.parse.urlencode({"data": query}).encode()
    for host in MIRRORS:
        try:
            req = urllib.request.Request(host, data=data, headers={
                "User-Agent": "PlateauStrategy-Atlas/1.0 (+https://plateaustrategy.io)",
                "Content-Type": "application/x-www-form-urlencoded",
            })
            with urllib.request.urlopen(req, timeout=timeout) as r:
                raw = r.read().decode("utf-8", "replace")
            if not raw.lstrip().startswith("{"):
                # Overpass answers HTML when it is shedding load; that is a
                # busy server, not an empty city, and must not read as one.
                last = "a map server was busy"
                continue
            body = json.loads(raw)
            elements = body.get("elements") or []
            if elements:
                return elements, None
            if body.get("remark"):
                last = "a map server reported: " + str(body["remark"])[:90]
                continue
            saw_empty = True
            last = "the map servers found nothing there"
        except Exception as e:
            last = str(e)[:120]
    if saw_empty:
        return [], None            # every mirror agrees: genuinely nothing
    return [], last


def scout(lat, lon, radius_km=8, kinds=None, limit=40):
    """Find prospects around a point. Returns (candidates, error).

    Every candidate carries the fields Atlas stores, already shaped, plus
    a score used only for ordering, best contact route first."""
    kinds = [k for k in (kinds or list(KINDS)) if k in KINDS]
    if not kinds:
        return [], "no kinds chosen"
    radius_km = max(0.5, min(float(radius_km or 8), 40))
    box = _bbox(float(lat), float(lon), radius_km)
    elements, errors = [], []
    for k in kinds:
        got, err = _fetch(_query(k, box))
        if err:
            errors.append("%s: %s" % (KINDS[k]["label"].lower(), err))
        elements.extend(got)
    # Partial is fine and is said out loud; total silence is an error.
    if not elements and errors:
        return [], "; ".join(errors[:2])

    out = []
    for e in elements:
        tags = e.get("tags") or {}
        name = (tags.get("name") or "").strip()
        if not name:
            continue
        phone = _clean_phone(_first(tags, "phone", "contact:phone", "telephone"))
        email = _first(tags, "email", "contact:email")
        site = _first(tags, "website", "contact:website", "url")
        if not (phone or email or site):
            continue                      # no way to reach them: not a prospect

        kind = "other"
        if tags.get("tourism") in ("hotel", "motel", "hostel", "guest_house"):
            kind = "hotel"
        elif tags.get("office") == "travel_agent" or tags.get("shop") == "travel_agency":
            kind = "travel_agency"
        elif tags.get("office") == "guide" or tags.get("operator:type") == "private":
            kind = "tour_operator"
        elif tags.get("amenity") in ("events_venue", "conference_centre"):
            kind = "event_venue"
        elif tags.get("amenity") == "social_facility":
            kind = "senior_living"
        elif tags.get("amenity") == "ferry_terminal" or tags.get("aeroway") == "terminal":
            kind = "terminal"
        elif tags.get("amenity") == "car_rental":
            kind = "car_rental"
        if kind not in kinds:
            continue

        meta = KINDS[kind]
        score = meta["weight"]
        if phone:
            score += 4                    # a number is the whole point
        if email:
            score += 3
        if site:
            score += 1
        if tags.get("stars"):
            score += 1
        if tags.get("rooms"):
            score += 1

        centre = e.get("center") or {}
        out.append({
            "name": name[:120],
            "type": kind,
            "phone": phone,
            "email": email[:120],
            "website": site[:200],
            "address": _address(tags),
            # The pipeline's own research fields, filled honestly.
            "sales_route": meta["route"],
            "contact_confidence": "likely" if (phone or email) else "route",
            "research_notes": meta["why"],
            "source": "https://www.openstreetmap.org/%s/%s" % (e.get("type", "node"), e.get("id")),
            "osm_id": "%s/%s" % (e.get("type", "node"), e.get("id")),
            "lat": e.get("lat") or centre.get("lat"),
            "lon": e.get("lon") or centre.get("lon"),
            "_score": score,
        })

    out.sort(key=lambda r: -r["_score"])
    return out[:max(1, min(int(limit or 40), 100))], None


def dedupe(candidates, existing):
    """Only what Atlas does not already hold: OSM id first, then name and
    street, because the same hotel gets mapped twice under two ids."""
    seen_ids = {p.get("osm_id") for p in existing if p.get("osm_id")}
    seen_keys = set()
    for p in existing:
        nm = re.sub(r"[^a-z0-9]", "", (p.get("name") or "").lower())
        st = re.sub(r"[^a-z0-9]", "", (p.get("address") or "").lower()[:18])
        if nm:
            seen_keys.add(nm + "|" + st)
    fresh = []
    for c in candidates:
        if c.get("osm_id") in seen_ids:
            continue
        nm = re.sub(r"[^a-z0-9]", "", c["name"].lower())
        st = re.sub(r"[^a-z0-9]", "", (c.get("address") or "").lower()[:18])
        key = nm + "|" + st
        if key in seen_keys:
            continue
        seen_keys.add(key)
        seen_ids.add(c.get("osm_id"))
        fresh.append(c)
    return fresh
