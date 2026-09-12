# Universal Gallery rebuild

## Intended visitor journey

1. Open the Universal Gallery and search an artifact name, artist, or museum label number.
2. Source-backed catalogue matches acquire persistent artifact records. Repeated searches resolve to those same records even when a title or museum spelling changes.
3. A saved original story is attached to its artifact in results and clearly marked as provided by Plateau Strategy. Editorial stories and AI-assisted stories disclose their provenance.
4. A separate **Written by us artifact archives** entrance opens the searchable story collection. The search landing page does not render the archive underneath the search box.
5. When text search fails, take or choose a photo, review it, and request identification. Candidate identities lead to catalogue searches; the visitor confirms the matched object.
6. Confirmed discoveries and demand inform the persistent writing queue. Completed stories become readable and searchable; failures remain retryable.

## Persistence and identity

The archive uses a SQLite database under the configured persistent DATA_DIR. Institution and accession/source identifiers distinguish objects; titles are search aliases, not the sole identity. Existing curated stories and legacy runtime readings are retained. Readable saved stories do not depend on a working generation API key.

Discovery records and search demand are not represented as completed writing. The public archive contains readable stories, with actual language and source provenance. Visitor photos are processed in memory for identification and are not added to the public archive.

## Release acceptance

- Empty landing page offers search, camera, and the archive entrance without an expanded list of works.
- A completed story reappears on repeat search without a second generation call.
- Museum aliases for the same accession resolve together; different museums with the same accession remain separate.
- A fresh process can retrieve saved artifacts and stories from the same DATA_DIR.
- Concurrent requests for one artifact and language do not pay for duplicate generation.
- Failed generation never produces a Written by us marker or an empty archive item.
- Existing curated stories and playable audio remain accessible.
- A camera candidate must become a catalogue match and receive visitor confirmation before being treated as confirmed.
- Invalid and oversized images, missing provider configuration, ambiguous photos, and provider failures have actionable responses.
- A stale search response cannot replace the current query's results.
- Mobile search, reading, archive, and camera states fit a roughly 390-pixel viewport with readable text and reachable controls.

## Validation record

Local release verification, 12 September 2026:

- 45 isolated Python tests pass on Python 3.12 / Flask 3.1.3 / Pillow 12.3.0. They cover canonical identity, all 32 existing curated stories, representative legacy migration, exact language, new-story persistence, fresh-process retrieval, model single-flight and monthly reservations, queue backoff, photo metadata removal, malformed uploads and provider failures.
- The existing generation contract smoke test also passes, with collection calls stubbed and background workers disabled.
- Six JavaScript behavior regressions pass: cleared/reordered responses, photo-mode reload and language switch, ordinary search mode, explicit consent, and duplicate photo submission prevention.
- Both gallery JavaScript files pass syntax validation. The release diff passes whitespace validation.
- In-app browser checks at 390 x 844: clean search entrance, existing Cypresses story and its English recording, new fixture discovery and saved story, separate archive retrieval, Chinese interface with explicit English fallback, camera entrance and unchecked consent, and no horizontal overflow in the reviewed states.
- A camera catalogue candidate remained absent from the test archive through reload and an actual language-switcher interaction. It entered the archive only after the confirmation button was pressed (database count changed from zero to one).
- An independent backend and frontend review found issues with stale source overwrites, query-based identity collisions, language event handling, photo-mode persistence, missing permalink capabilities and duplicate photo requests. Fixes are covered by regression tests.
- Added `.github/workflows/gallery-tests.yml` to repeat these checks on Python 3.11, matching the production runtime family. Remote CI is not claimed until a run is observed.

New-story and vision provider responses in local acceptance tests are fixtures, not live paid-model validation. Native phone camera hardware and a real paid photo-identification request have not been exercised.

## Configuration and operating limits

- Durable data: `DATA_DIR/gallery_archive.sqlite3`. Existing curated sources and `gallery_readings_runtime.json` are imported additively and left intact. No migration deletes the originals.
- Photo throttling: `DATA_DIR/gallery_identify_usage.sqlite3`, containing counters and short-lived salted address hashes, not photographs, raw addresses, extracted labels or candidate lists. Both databases and their sidecars are ignored by Git.
- Story writing requires the website's `ANTHROPIC_API_KEY`. The live pre-release search returned `can_generate: false`. No key from the unrelated trading project has been reused or exposed in source.
- Default model overrides: `GALLERY_MODEL` and `GALLERY_VISION_MODEL`. Both use the existing Sonnet-class configuration by default.
- Writing cap: 1,500 attempted provider calls per calendar month, shared by direct writing and hourly background writing. Photo cap: 500 attempts per month and 12 attempts per address per hour. Attempt counts include uncertain provider failures.
- The existing discovery thread processes at most one due English story per hour, prioritizing confirmed objects and search demand. Missing configuration preserves the queue; failures back off and remain retryable.
- Photo support: JPEG, PNG or WebP, at most 6 MB / 20 megapixels. Metadata is removed and pixels are downscaled in memory. The endpoint accepts only explicit `anthropic-photo-search-v1` consent and calls only the approved Anthropic endpoint.
- Every photo candidate is a hypothesis. Catalogue candidates are signed, expire after 15 minutes, and cannot enter the persistent archive before confirmation. The archive distinguishes AI-assisted writing from site-curated editorial stories.

## Release checklist and recovery

- [x] Additive migration and source preservation tested.
- [x] Independent code review findings addressed.
- [x] Isolated API and mobile UI smoke checks complete.
- [x] Runtime state and keys excluded from the source release.
- [ ] Observe the remote CI run after pushing.
- [ ] Confirm production page/assets, archive totals, saved story retrieval and exact-language behavior after the host finishes deployment.
- [ ] Verify live paid writing and photo matching after a website-owned key is configured privately.

Recovery triggers: application startup failure, persistent unexpected errors from the gallery search/archive/story routes after deployment settles, or failure to retrieve the imported curated stories. A missing-key photo response is a configuration state, not evidence of successful identification.

Recovery procedure: revert only this release's source commit and redeploy; preserve the persistent data disk, both new databases and all original JSON/script sources. Do not delete an archive to roll back a page. Newly saved records remain available for a corrected forward deployment.
