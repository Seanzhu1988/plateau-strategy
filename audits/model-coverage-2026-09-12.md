# Tour media coverage, 2026-09-12

Scope: the checked-in `trails.json`, Destination Book entries, model modules, and tour-page wiring in this release workspace. This is an asset and integration inventory, not a claim that every remote photograph has passed identity, rights, or availability review. No deployment is performed by this audit.

## Models present and absent

| Tour group | Stops | Stops with models | Stops without models |
| --- | ---: | ---: | ---: |
| Eight Ivy League walking tours | 84 | 0 | 84 |
| Philadelphia | 19 | 0 | 19 |
| Mount Rushmore | 8 | 0 | 8 |
| Boston Freedom Trail | 16 | 9 | 7 |
| National Mall | 21 | 21 | 0 |
| Total | 148 | 30 | 118 |

The 111 unmodeled **generic-tour** stops are Ivy 84, Philadelphia 19, and Rushmore 8. Boston contributes seven additional unmodeled stops. The Ivy League collection is navigation to eight routes, not an additional walking route or set of stops.

Ivy counts: Harvard 10, Yale 10, Princeton 11, Columbia 10, Penn 10, Brown 11, Dartmouth 11, Cornell 11.

### Boston

Models are built and mapped for stops 2 State House, 3 Park Street Church, 8 Old South Meeting House, 9 Old State House, 11 Faneuil Hall, 12 Paul Revere House, 13 Old North Church, 15 USS Constitution, and 16 Bunker Hill Monument. These are stable stop-to-model mappings, not a different walking order.

Seven stops remain photo-based: 1 Boston Common, 4 Granary Burying Ground, 5 King's Chapel, 6 Boston Latin School site, 7 Old Corner Bookstore, 10 Boston Massacre Site, and 14 Copp's Hill Burying Ground. All 16 Boston stop records have photo arrays. The existing photo presentation is retained beside the nine model integrations.

Photo caveats: the Boston Latin School site's first supplied photograph depicts the modern school, not the historic site. The Boston Massacre Site starts with a historical engraving, not a present-day location photograph. Existing arrays alone must not be taken as verified destination-photo coverage. This audit does not replace those assets or silently substitute a generic photograph.

### National Mall

All 21 route stops carry model keys with existing model modules and corresponding `DC3D.scenes['only-' + stop.model]` wiring. There are 23 DC form files, of which 21 are used by this route. Library of Congress (stop 2) and Eisenhower Executive Office Building (stop 13) lack stop-photo arrays, but have models. The other 19 have photo arrays; some first images depict collection objects rather than the destination's exterior. The route's dedicated page is separate from the generic-tour photo fix.

## Missing assets versus missing wiring

- Every Ivy stop has a matching Destination Book entry and stop description, but neither that entry nor the stop contains a photo, and there is no stop model. These are missing media assets, not merely disconnected existing models. The selected-stop fallback does not manufacture Ivy photographs.
- Philadelphia's 19 stops similarly have no existing models or photos in the checked seed data.
- Rushmore has no models. Grand View Terrace (stop 2) does have an exact `stop.photos` image, while the other seven stops do not. The generic page previously read only Destination Book photos, so the existing terrace image was not wired into the selected-stop presentation.
- The generic `tour.html` fix now checks the matching entry's `photo` and `photos` first, then that exact stop's `photo` and `photos`, accepting strings and `{src}` objects. Empty or malformed values do not block a valid fallback. A failed image advances through those exact alternatives; if none loads, the image area stays hidden. Late responses from an old stop cannot restore its photograph.
- There is no city-wide or campus-wide image fallback. Logos and mascot photographs are school identity graphics, not substitutes for destination photographs or 3D models.

## Verification and boundaries

`test_tour_stop_photos.cjs` covers entry preference, object/string stop fallback, empty data, failed alternatives, old-stop response isolation, and the real Grand View Terrace seed record. The only selected-stop change in `tour.html` is photo resolution and rendering. Stop numbers, route order, audio manifests, audio identity matching, guide choice, and playback behavior remain untouched. Boston and the National Mall use dedicated pages, so this generic-page fix does not change their existing media controls.

Remaining work is destination-specific image sourcing and review for generic tours, followed by deliberately selected new models. Missing imagery must remain explicit until the correct destination asset is available. This report does not claim those future assets or models are complete.
