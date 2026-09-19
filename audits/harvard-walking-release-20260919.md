# Harvard pedestrian routing release audit

Date: 2026-09-19

## Released behavior

- The Harvard tour uses nine pedestrian route legs for its ten stops.
- The route covers 1,781 meters, shown as 1.1 mapped miles and 24 minutes of walking at 75 meters per minute.
- Every stop shows one compact line with miles from the prior stop, walking time, and planned time inside.
- Every current Harvard leg is under one mile, so every segment is green. The shared legend also explains the blue, orange, and red distance bands.
- Selecting a stop emphasizes the route segment that arrives at that stop.
- The map fits the complete pedestrian geometry, including route points that extend beyond a building's destination marker.
- If the route snapshot is unavailable, the player keeps the stop markers and reports distance and walking time as unavailable. It does not draw straight substitute lines.

## Routing source and limits

- The stored snapshot was generated with BRouter's `hiking-beta` pedestrian profile on 2026-09-19.
- The browser reads the stored snapshot, so visitors do not trigger a routing request.
- The path follows the mapped pedestrian network through and around Harvard Yard between the tour's existing coordinates.
- The map was visually checked against OpenStreetMap. Exact building entrances, accessibility, campus access rules, construction, and temporary closures were not independently verified. Visitors should follow current signs and local access rules.

## Preserved tour content

- The ten-stop order is unchanged.
- Stop stories, Yiki notes, photographs, audio behavior, and the Harvard Art Museums Universal Gallery tool are unchanged.
- The recorded-audio dry audit reports eleven current Harvard entries, with no recording needed.

## Verification

- Forty-two JavaScript checks passed across routing, public directory, preview, and photo/audio integrity suites.
- Thirteen Python route, photo, audio, and sitemap checks passed.
- Mobile browser checks passed in English, Chinese, Spanish, Korean, and Vietnamese.
- Browser checks confirmed nine route segments, 1.1 miles, the selected-segment highlight, the museum tool, no horizontal overflow, no writes, and no page errors.
- The full-route mobile map was visually inspected.
- Independent Claude review is pending when Claude is available.
