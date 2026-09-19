# National Mall route and Moongate update

Scoped release: National Mall HTML, shared routing utility, checked walking snapshot and the asset routes/tests needed to serve them. Existing stop IDs, recordings and model code are unchanged. Other uncommitted gallery, directory and generic-tour edits are excluded.

## Behavior

- Adds a collapsible, sourced Moongate beauty detour near the Smithsonian Castle, with directions, access information and a Universal Gallery search tool. It is optional and extra to the main-route totals. No new audio is claimed.
- Replaces the solid straight-line map with 18 pedestrian-routed legs from BRouter's hiking-beta profile, checked September 19, 2026. The White House incoming/outgoing legs are unavailable and not drawn; NPS viewing guidance is linked. No path through restricted grounds is invented.
- Colors each measured leg by distance and emphasizes the selected leg. Provides external walking directions and a driving comparison for legs over three miles.
- A static checked snapshot avoids 20 routing requests from each visitor. Exact coordinate matching prevents a stale path being used after a stop moves. Snapshot fetch times out after eight seconds.
- The 18 mapped legs sum to 11,023 meters. Headline reads 6.8+ mapped miles and estimated walking time with +, explicitly excluding two unavailable legs and the Moongate detour. A failed snapshot shows Unavailable, not the old, shorter total.

## Validation

- test_tour_routing.cjs: 3 passing tests covering thresholds, foot-profile geometry, rejection of failures/stale coordinates/wrong profiles, snapshot leg coverage and summed distance.
- test_tour_directory_routes.py: 3 passing isolated Flask tests including both new assets; no production app or state imported.
- Isolated Chromium: desktop 1280x900 and mobile 390x844, zero page errors, no mobile horizontal overflow, 20 direction links, Moongate expand/collapse, partial totals, and snapshot HTTP 503 fallback. External service calls blocked in browser fixture; walking paths acquired separately from the actual pedestrian provider.
- git diff --check passed.

## Sources and limitations

Smithsonian garden details/access: https://gardens.si.edu/gardens/haupt-garden/
Smithsonian hours: https://gardens.si.edu/plan-your-visit/
White House viewing/access: https://www.nps.gov/whho/planyourvisit/viewing-the-white-house.htm
Walking data: https://brouter.de, hiking-beta profile; OpenStreetMap map data attribution retained on map.

Route geometry does not guarantee current access or wheelchair accessibility. White House security restrictions can change. New detour prose is English in this first update; translated connected scripts, canonical book integration and a recorded guide remain queued. This release does not complete the wider USA/Canada expansion, personal detour planner or city models. Claude's independent review is pending.
