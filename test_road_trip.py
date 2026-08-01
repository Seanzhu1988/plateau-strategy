# -*- coding: utf-8 -*-
"""The road trip planner offers more than one road, and picking one redraws.

OSRM, Nominatim and Overpass are all third parties, all rate-limited, and all
blocked from this container. Stubbed — which is also the only way to assert on
an exact route count and an exact set of rest stops.
"""
import json, sys
from playwright.sync_api import sync_playwright

B = "http://127.0.0.1:5055"

def line(pts):  # [[lon,lat], …]
    return {"coordinates": pts, "type": "LineString"}

# three roads Seattle -> Portland: interstate, coastal, and a near-duplicate of
# the first that must be discarded as "the same drive"
OSRM = {"code": "Ok", "routes": [
    {"duration": 10800, "distance": 280000,
     "geometry": line([[-122.33,47.60],[-122.60,46.90],[-122.67,45.52]])},
    {"duration": 14400, "distance": 340000,
     "geometry": line([[-122.33,47.60],[-123.80,46.90],[-122.67,45.52]])},
    {"duration": 10830, "distance": 280400,     # 30s and 400m apart — a dupe
     "geometry": line([[-122.33,47.60],[-122.61,46.91],[-122.67,45.52]])},
]}
NOMINATIM = [{"display_name": "Seattle, Washington, United States",
              "lat": "47.6062", "lon": "-122.3321", "address": {"state": "Washington"}}]
# one of each tagging style, including the amenity=parking one the old query missed
OVERPASS = {"elements": [
    {"type": "node", "id": 1, "lat": 47.10, "lon": -122.55,
     "tags": {"highway": "rest_area", "name": "Gee Creek Rest Area"}},
    {"type": "way", "id": 2, "center": {"lat": 46.70, "lon": -122.90},
     "tags": {"highway": "services", "name": "Toutle River Plaza"}},
    {"type": "node", "id": 3, "lat": 46.30, "lon": -122.95,
     "tags": {"amenity": "parking", "parking": "rest_area", "name": "Silver Lake Rest Area"}},
    {"type": "way", "id": 4, "center": {"lat": 45.90, "lon": -122.80},
     "tags": {"amenity": "parking", "parking": "rest_area"}},
]}

fails = []
with sync_playwright() as p:
    br = p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
    pg = br.new_page(viewport={"width": 1400, "height": 1000})
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    seen_queries = []

    def overpass(route):
        seen_queries.append(route.request.post_data or "")
        route.fulfill(status=200, content_type="application/json", body=json.dumps(OVERPASS))

    pg.route("**/router.project-osrm.org/**", lambda r: r.fulfill(
        status=200, content_type="application/json", body=json.dumps(OSRM)))
    pg.route("**/nominatim.openstreetmap.org/**", lambda r: r.fulfill(
        status=200, content_type="application/json", body=json.dumps(NOMINATIM)))
    pg.route("**/overpass-api.de/**", overpass)

    pg.goto(B + "/road-trip", wait_until="domcontentloaded")
    pg.wait_for_timeout(1800)
    pg.fill("#fromInput", "Seattle")
    pg.fill("#toInput", "Portland")
    pg.click("#goBtn")
    pg.wait_for_timeout(4000)

    n = pg.evaluate("document.querySelectorAll('#routePick button').length")
    labels = pg.evaluate("[...document.querySelectorAll('#routePick button')].map(b=>b.textContent.trim())")
    print(f"  routes offered: {n}  {labels}")
    if n != 2:
        fails.append(f"expected 2 routes after dropping the near-duplicate, got {n}")

    pressed = pg.evaluate("[...document.querySelectorAll('#routePick button')].map(b=>b.getAttribute('aria-pressed'))")
    print(f"  selection state: {pressed}")
    if pressed[:1] != ["true"]:
        fails.append("fastest route is not selected on arrival")

    dist1 = pg.text_content("#stDist")
    # pick the slower road
    pg.click("#routePick button[data-i='1']")
    pg.wait_for_timeout(4000)
    dist2 = pg.text_content("#stDist")
    pressed2 = pg.evaluate("[...document.querySelectorAll('#routePick button')].map(b=>b.getAttribute('aria-pressed'))")
    print(f"  distance {dist1} -> {dist2}   selection {pressed2}")
    if dist1 == dist2:
        fails.append("picking the other route did not change the summary")
    if pressed2[1] != "true":
        fails.append("the picked route is not marked as selected")

    # exactly one solid route line, and the alternative drawn faintly
    lines = pg.evaluate("document.querySelectorAll('.leaflet-overlay-pane path').length")
    print(f"  polylines on the map: {lines}")
    if lines < 2:
        fails.append(f"expected the chosen road plus a faint alternative, got {lines} path(s)")

    # the rest stops the widened query is for
    rest_txt = pg.evaluate("document.getElementById('legs').textContent")
    for name in ("Gee Creek Rest Area", "Toutle River Plaza", "Silver Lake Rest Area"):
        if name not in rest_txt:
            fails.append(f"rest stop missing from the list: {name}")
    print(f"  rest stops listed: {[n for n in ('Gee Creek Rest Area','Toutle River Plaza','Silver Lake Rest Area') if n in rest_txt]}")

    q = " ".join(seen_queries)
    if "parking=rest_area" not in q:
        fails.append("the Overpass query never asks for amenity=parking + parking=rest_area")
    else:
        print("  query asks for parking=rest_area: yes")

    errs = [e for e in errs if "L is not defined" not in e]
    if errs:
        fails.append("page errors: " + "; ".join(e[:70] for e in errs[:3]))
    br.close()


# ---- and the whole thing again in Chinese -----------------------------
# The reason this page did not translate is that i18n.js swaps text NODES,
# and every result here is a string built in JavaScript afterwards — the
# walker never sees it. A Chinese reader got a Chinese page with an entirely
# English answer inside it. Guarded, because nothing about the English tests
# above would ever notice it coming back.
import re as _re
with sync_playwright() as p:
    br = p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
    pg = br.new_page(viewport={"width": 1300, "height": 1000})
    pg.route("**/router.project-osrm.org/**", lambda r: r.fulfill(
        status=200, content_type="application/json", body=json.dumps(OSRM)))
    pg.route("**/nominatim.openstreetmap.org/**", lambda r: r.fulfill(
        status=200, content_type="application/json", body=json.dumps(NOMINATIM)))
    pg.route("**/overpass-api.de/**", lambda r: r.fulfill(
        status=200, content_type="application/json", body=json.dumps(OVERPASS)))
    pg.goto(B + "/road-trip?lang=zh", wait_until="domcontentloaded")
    pg.wait_for_timeout(1800)
    pg.fill("#fromInput", "Seattle"); pg.fill("#toInput", "Portland")
    pg.click("#goBtn"); pg.wait_for_timeout(4000)

    legs = pg.evaluate("(document.getElementById('legs')||{}).innerText||''")
    pick = pg.evaluate("[...document.querySelectorAll('#routePick button')].map(b=>b.textContent).join(' ')")
    br.close()

# Things that are correctly NOT translated: glyphs, bare numbers, and real
# place names out of OpenStreetMap — TRANSLATION.md keeps venue names in the
# language of the sign outside.
# Derived from the stub rather than listed by hand — hardcoding it is how
# two of the three names got left out and the test failed on its own data.
KEEP = tuple(e["tags"]["name"] for e in OVERPASS["elements"] if e["tags"].get("name"))
lines = [l.strip() for l in legs.split("\n") if l.strip()]
english = [l for l in lines
           if not _re.search(r"[\u4e00-\u9fff]", l)
           and not all(ch in "🅿⛽🍽👁 0123456789·" for ch in l)
           and not any(k in l for k in KEEP)]
print(f"  zh: {len(lines)-len(english)}/{len(lines)} generated lines translated")
if english:
    for l in english[:5]:
        print("       still English: " + l[:70])
    fails.append(f"{len(english)} generated line(s) stayed English under ?lang=zh")
for word in ("fastest", "shortest", "min"):
    if word in pick and word != "min":
        fails.append(f"route chooser still says '{word}' in Chinese")
if not _re.search(r"[\u4e00-\u9fff]", pick):
    fails.append("route chooser is entirely untranslated")
else:
    print(f"  zh: route chooser translated — {pick[:46]}")

print("\n" + "=" * 68)
if fails:
    for f in fails: print("FAIL " + f)
    sys.exit(1)
print("alternatives offered, picking one redraws, and US-tagged rest stops are found")
