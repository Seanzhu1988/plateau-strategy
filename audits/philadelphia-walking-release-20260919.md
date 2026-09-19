# Philadelphia pedestrian routing release audit

Date: 2026-09-19

## Released behavior

- The Philadelphia tour now uses 18 pedestrian route legs for its 19 stops.
- The route covers 8,528 meters, shown as 5.3 mapped miles and 1 hour 54 minutes of walking at 75 meters per minute.
- Each stop shows a compact line with miles from the prior stop, walking time, and planned time inside.
- Each route segment uses the shared distance colors. Every current Philadelphia leg is under one mile, so each segment is green. The map legend also explains the blue, orange, and red distance bands for future routes.
- Selecting a stop emphasizes the route segment that arrives at that stop.
- If the checked route data is unavailable, the page keeps the stop markers and reports distance and walking time as unavailable. It does not draw straight lines between stops.

## Routing source and limits

- The stored route snapshot was generated with BRouter's `hiking-beta` pedestrian profile on 2026-09-19.
- The browser reads the stored snapshot, so visitors do not trigger a routing request.
- The path follows the mapped public pedestrian network between the tour's existing stop coordinates.
- Exact entrances, accessibility, construction, special events, and temporary closures were not independently verified. Visitors should follow current signs and local access rules.

## Preserved tour content

- The 19-stop order is unchanged.
- Stop stories, Yiki notes, photos, audio behavior, and Universal Gallery tools are unchanged.
- The recorded-audio dry audit reports 20 current Philadelphia entries, with no recording needed.

## Verification

- 41 JavaScript checks passed across routing, public directory, preview, and photo/audio integrity suites.
- 13 Python route, photo, audio, and sitemap checks passed.
- Mobile browser checks passed in English, Chinese, Spanish, Korean, and Vietnamese.
- Browser checks confirmed 18 route segments, 5.3 miles, the selected-segment highlight, no horizontal overflow, no writes, and no page errors.
- Independent Claude review is pending when Claude is available.
