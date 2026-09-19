# Yale pedestrian routing release audit

Date: 2026-09-19

## Released behavior

- The Yale tour uses nine pedestrian route legs for its ten stops.
- The route covers 2,095 meters, shown as 1.3 mapped miles and 28 minutes of walking at 75 meters per minute.
- Every stop shows one compact line with miles from the prior stop, walking time, and planned time inside.
- Every current Yale leg is under one mile, so every segment is green. The shared legend also explains the blue, orange, and red distance bands.
- Selecting a stop emphasizes the route segment that arrives at that stop.
- If the route snapshot is unavailable, the player keeps the stop markers and reports distance and walking time as unavailable. It does not draw straight substitute lines.

## Routing source and limits

- The stored snapshot was generated with BRouter's `hiking-beta` pedestrian profile on 2026-09-19.
- The browser reads the stored snapshot, so visitors do not trigger a routing request.
- The path follows the mapped pedestrian network through the Old Campus and between the tour's museum and library stops.
- The map was visually checked against OpenStreetMap. Exact building entrances, accessibility, campus access rules, construction, and temporary closures were not independently verified. Visitors should follow current signs and local access rules.

## Preserved tour content

- The ten-stop order is unchanged.
- Stop stories, Yiki notes, photographs, audio behavior, and both Yale museum Universal Gallery tools are unchanged.
- The recorded-audio dry audit reports eleven current Yale entries, with no recording needed.

## Verification

- Forty-three JavaScript checks passed across routing, public directory, preview, and photo/audio integrity suites.
- Thirteen Python route, photo, audio, and sitemap checks passed.
- Mobile browser checks passed in English, Chinese, Spanish, Korean, and Vietnamese.
- Browser checks confirmed nine route segments, 1.3 miles, the selected-segment highlight, a museum tool, no horizontal overflow, no writes, and no page errors.
- The full-route mobile map was visually inspected.
- Independent Claude review is pending when Claude is available.
