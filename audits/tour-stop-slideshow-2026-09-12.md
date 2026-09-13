# Stop slideshow integration, 2026-09-12

Prepared locally; no live deployment yet. The final research manifest contains 165 photographs across all 148 stops in 12 tours. Public-approved overlays cover 141 stops; seven stops have private-only references excluded from the public manifest/API. Missing or failed images remain explicit empty/error states, even when a 3D model exists.

## Reusable contract

Import `mountStopSlideshow` and optionally `stopPhotosFor` from `/tour-stop-slideshow.js`, with `/tour-stop-slideshow.css` loaded once.

`mountStopSlideshow(host, photos, {name, language, showRightsNote})` accepts `src`, `alt`, `caption`, `credit`, `sourceUrl`, and optional `license`, `licenseUrl` and `rightsNote`. It owns the host's children and returns `{destroy()}`. One active image loads lazily. Navigation is manual through 44px arrows, focused left/right keys or horizontal swipes. There is no automatic advancement, audio operation, API call, upload or publication operation. The mount fetches no manifest.

Failure advances only through the supplied exact-photo candidates, removes exhausted images, and displays an honest failure message if none remains. Old image callbacks and stale page selections cannot replace the current stop. `destroy()` releases listeners and the active image. Repeated mounting on the same host destroys its old slideshow.

`stopPhotosFor(stop, entry)` prefers reviewed API `stop.photo_details` metadata. Older data use the matching Destination Book entry and then the exact stop's string/object photos. Known legacy mixtures, including the modern Boston Latin campus image, Boston Massacre engravings, museum collection objects, a Faneuil directory clipping and an unrelated Bunker Hill Railroad image, are excluded from fallback where identified. This is not a claim that all remaining legacy photos have received a new visual or rights review.

Image URLs require HTTPS or absolute site-relative paths. Remote HTTP, data, JavaScript, credential-bearing and SVG URLs are rejected, as are retired visitor-photo paths, including encoded variants. Source and license links require HTTPS. Captions, credits and rights notes use text nodes, not HTML. Rights notes are hidden by default and enabled only in the private directory preview. A private reference is not a grant of publication rights.

## Page integration

- Private city directory: one cached read of `/tour-stop-photos.json`, alongside its catalog read. Version 1 manifest rows must match trail ID, stop number and destination name. Reviewed rows win, API metadata is next, and catalog photos remain a fallback. Photographs, model links, written stories and school identity are independent.
- Generic `tour.html`: selected-stop slideshow with a URL-filtered exact single-photo renderer retained only as a module-load fallback. Collections and stop changes dispose old mounts.
- `national-mall.html`: selected-stop slideshow remains beside the model and story; returning to the full Mall clears it.
- `freedom-trail.html`: each stop has its own lazy slideshow host, including stops with a model. List/language refresh destroys old controllers and mounts the same numbered stops again. The old image-feed timers and 32px picture controls are retired.

## Verification

The full private preview passes 19 component tests and 41 focused combined tests. This scoped public release excludes three private-directory-only cases and retains all shared-component assertions: 16 component tests and 38 focused combined tests pass across `test_tour_stop_slideshow.cjs`, `test_tour_photo_audio_integrity.cjs` and `test_tour_stop_photos.cjs`, covering metadata, URL safety, failure recovery, lifecycle and audio preservation. JavaScript parse checks and `git diff --check` pass.

The audio integrity tests contain seven SHA-256 baselines captured immediately before these page edits. They verify byte-for-byte preservation of generic semantic/recording selection and playback, Mall guide selection and playback, and Boston recording/player/byline code. Existing audio integration assertions were not weakened; only the obsolete photo-carousel assertions were updated to the shared slideshow contract.

This photo layer does not change audio selection, playback or stop order. The private directory and unshipped model redesigns are outside the scoped photo release. Preparation and testing do not imply live deployment; external image availability can change.
