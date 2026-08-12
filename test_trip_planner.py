# -*- coding: utf-8 -*-
"""Typing an address must move the map. Every time, not just the first.

Reported three times. It survived two fixes because the bug only shows on
the second entry: flyToPlace sat inside the "this place is new" branch, so
the first address flew and looked fixed, and any address already on the
board did nothing. A test that adds one place proves nothing. This adds the
same place twice.

Nominatim is stubbed rather than called, the geocoder is a third party, it
rate-limits, and it is blocked from this container entirely. Stubbing it is
also the only way to assert on an exact coordinate.
"""
import json, sys
from playwright.sync_api import sync_playwright

B = "http://127.0.0.1:5055"
SEATTLE = (47.6062, -122.3321)
TARGET  = (47.6205, -122.3493)          # Space Needle, ~2 km from downtown

STUB = [{
    "display_name": "Space Needle, Broad Street, Seattle, Washington, 98109, United States",
    "lat": str(TARGET[0]), "lon": str(TARGET[1]),
    "address": {"city": "Seattle", "state": "Washington", "county": "King County"},
}]

def moved(a, b):
    return abs(a["lat"] - b["lat"]) > 1e-4 or abs(a["lng"] - b["lng"]) > 1e-4

fails = []
with sync_playwright() as p:
    br = p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
    pg = br.new_page(viewport={"width": 1400, "height": 950})
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))

    # every outbound geocode answers with the Space Needle
    pg.route("**/nominatim.openstreetmap.org/**",
             lambda route: route.fulfill(status=200, content_type="application/json",
                                         body=json.dumps(STUB)))
    # the drive-time matrix is a third party too; keep it from hanging the test
    pg.route("**/router.project-osrm.org/**",
             lambda route: route.fulfill(status=200, content_type="application/json",
                                         body=json.dumps({"code": "Ok", "durations": [[0]]})))

    pg.goto(B + "/trip-planner", wait_until="domcontentloaded")
    pg.wait_for_timeout(2200)
    pg.evaluate("map.setView([%f, %f], 12)" % SEATTLE)
    pg.wait_for_timeout(300)

    for attempt in (1, 2):
        before = pg.evaluate("({lat: map.getCenter().lat, lng: map.getCenter().lng})")
        pg.fill("#destAdd", "Space Needle")
        pg.evaluate("addDestination()")
        pg.wait_for_timeout(1600)              # flyTo runs 0.7s
        after = pg.evaluate("({lat: map.getCenter().lat, lng: map.getCenter().lng})")
        near = abs(after["lat"] - TARGET[0]) < 0.02 and abs(after["lng"] - TARGET[1]) < 0.02
        ok = moved(before, after) or near
        n_places = pg.evaluate("places.length")
        print(f"  entry {attempt}: centre {before['lat']:.4f},{before['lng']:.4f} -> "
              f"{after['lat']:.4f},{after['lng']:.4f}  at target={near}  places={n_places}  "
              f"{'ok' if ok else 'DID NOT MOVE'}")
        if not ok:
            fails.append(f"entry {attempt} did not move the map")
        # put the map back so the second entry has somewhere to travel from
        pg.evaluate("map.setView([%f, %f], 12)" % SEATTLE)
        pg.wait_for_timeout(300)

    # The start control: one box that does both jobs.
    #
    # This used to assert only that a pin sat beside the destination field,
    # because the pin kept being hidden and offered as a floating map icon
    # instead. It is a stronger check now, because the ask got more specific:
    # the control has to CONTAIN a place to type an address and a one-click
    # current-location button. A visible pin that hides its address entry
    # behind a tap, which is what it did, would have passed the old test.
    box = pg.evaluate("""() => {
        const dest = document.querySelector('#destAdd');
        const sb   = document.querySelector('.startbox');
        if (!dest || !sb) return null;
        const b = dest.getBoundingClientRect(), p = sb.getBoundingClientRect();
        const vis = el => !!(el && el.getClientRects().length &&
                             getComputedStyle(el).visibility !== 'hidden');
        const addr = sb.querySelector('input');
        const here = sb.querySelector('#hereBtn');
        return { sameRow: Math.abs((b.top+b.height/2)-(p.top+p.height/2)) < 26,
                 gap: Math.round(b.left - p.right),
                 typeable: vis(addr), here: vis(here),
                 pin: !!sb.querySelector('.pin-badge') };
    }""")
    print(f"  start control: {box}")
    if not box:
        fails.append("no start control beside the destination box")
    else:
        if not box["sameRow"] or not (0 <= box["gap"] < 90):
            fails.append("start control is not beside the address box")
        if not box["typeable"]:
            fails.append("start control has no visible field to type an address into")
        if not box["here"]:
            fails.append("start control has no one-click current-location button")
        if not box["pin"]:
            fails.append("start control lost its pin")

    errs = [e for e in errs if "L is not defined" not in e]
    if errs:
        fails.append("page errors: " + "; ".join(e[:70] for e in errs[:3]))
    br.close()

print("\n" + "=" * 68)
if fails:
    for f in fails: print("FAIL " + f)
    sys.exit(1)
print("typing an address moves the map, first time and every time after")
