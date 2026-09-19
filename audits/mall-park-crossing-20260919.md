# Mall park crossing correction

Sean identified that Air and Space to the National Gallery should cross the park. The previous 703 m hiking snapshot used building-center pins, snapped to an approach that circled to the Gallery north side. Landmark coordinates remain intact; this leg now records separate routing endpoints for the Mall-side exit plaza and south entrance approach. BRouter hiking-beta returns 270 m over mapped footways, crossings and steps, not a straight-line guess. At the site estimate of 75 m/min, this is 4 minutes. Outdoor paths only; indoor movement, crossings and queues add time.

Sources checked September 19, 2026:
- https://airandspace.si.edu/newsroom/press-releases/national-air-and-space-museum-opens-five-new-galleries-july-28 confirms the Jefferson Drive entrance and Mall-side exit.
- https://www.nga.gov/educational-resources/request-school-field-trip/prepare-for-field-trip-resources confirms Madison Drive Mall entrance via steps, and wheelchair access at Constitution Avenue/6th Street.
- BRouter query: lonlats=-77.0200,38.88865|-77.0200,38.89105, profile=hiking-beta, alternativeidx=0, format=geojson. Geometry includes gravel footways, marked crossings and steps. These are snapped outdoor approach coordinates, not surveyed door coordinates.

The page states the steps and wheelchair entrance in English, Chinese, Spanish, Korean and Vietnamese. No claim of universally fastest or step-free routing. This corrects one leg; automatic comparison of multiple entrances, step-free routing and the other legs remains outstanding. No stop order, audio, model location or external directions changed.

Validation: four routing tests, five Python story/asset tests, mobile and desktop browser checks, routing-unavailable scenario, and four-language browser checks. Release ledger records deployment verification separately.
