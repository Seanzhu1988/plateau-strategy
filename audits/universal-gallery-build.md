# Universal Gallery rebuild

## Intended visitor journey

1. Open the Universal Gallery and search an artifact name, artist, or museum label number.
2. Source-backed catalogue matches acquire persistent artifact records. Repeated searches resolve to those same records even when a title or museum spelling changes.
3. A saved original story is attached to its artifact in results and clearly marked as provided by Plateau Strategy. Editorial stories and AI-assisted stories disclose their provenance.
4. A separate **Written by us artifact archives** entrance opens the searchable story collection. The search landing page does not render the archive underneath the search box.
5. Tap the photo control. One short permission prompt explains identification through Anthropic and public sharing only after selecting the matching artifact. “Yes, continue” opens the native photo picker; selecting a valid photo automatically starts identification and searches the best useful clue in the same gallery search. Saved artifacts appear first, then the connected museum/Wikidata sources are checked automatically. Up to four ranked identity/accession/label queries run without asking the traveler, with at most two simultaneous catalogue searches and one read-only recovery request for a failed or incomplete empty search. No questionnaire or consent checklist is shown.
6. Open the matching result to read its saved story or request a new one in the selected language. Selecting that result confirms the artifact without a separate confirmation question. Missing configuration and failed writing keep a durable queue, never a false completed-story badge.
7. Only after object confirmation does the browser submit the permitted photo for attachment. Metadata-free visitor photographs are framed and credited separately from official museum imagery. Declining the initial permission prompt sends nothing; the visitor can use text search instead.
8. If the collection searches find nothing, useful clues and a short description of visible features are automatically saved to a private, deduplicated research inbox and shown as a new, unverified discovery. Unverified clues do not become canonical public artifacts or fabricated historical stories. Research verification remains an editorial task; there is no claim that every unknown object is identified reliably.

## Persistence and identity

The archive uses a SQLite database under the configured persistent DATA_DIR. Institution and accession/source identifiers distinguish objects; titles are search aliases, not the sole identity. Existing curated stories and legacy runtime readings are retained. Readable saved stories do not depend on a working generation API key.

Discovery records and search demand are not represented as completed writing. The public story archive contains readable stories, with actual language and source provenance. Identification alone never retains a photo. Explicitly permitted photographs are retained only after confirmation, under a versioned publication consent covering both the photograph and pictured artwork. The single permission prompt instructs visitors to exclude people and private details.

## Release acceptance

- Empty landing page offers search, camera, and the archive entrance without an expanded list of works.
- A completed story reappears on repeat search without a second generation call.
- Museum aliases for the same accession resolve together; different museums with the same accession remain separate.
- A fresh process can retrieve saved artifacts and stories from the same DATA_DIR.
- Concurrent requests for one artifact and language do not pay for duplicate generation.
- Failed generation never produces a Written by us marker or an empty archive item.
- Existing curated stories and playable audio remain accessible.
- A camera candidate must become a catalogue match and receive visitor confirmation before being treated as confirmed.
- Photo-derived search automatically checks saved artifacts; a visitor can expand to museum collections or correct the query without losing the photo and consent choices.
- Confirmation immediately opens or requests the selected-language story. A failed photo upload can be retried independently.
- The photo attachment route requires the exact confirmed artifact's short-lived signed token and separate publication consent. Metadata is stripped before clean JPEG storage. Repeat uploads deduplicate without overwriting museum imagery.
- Unmatched research is bounded, throttled, private and absent from public archive/search.
- The photo response can describe visible form, surface or material without inventing an identity, historical attribution or personal details. Description-only drafts are deduplicated by their actual description, not by a generic unidentified-object title. The original photo stays private until a source-backed artifact is selected.
- Invalid and oversized images, missing provider configuration, ambiguous photos, and provider failures have actionable responses.
- A stale search response cannot replace the current query's results.
- Mobile search, reading, archive, and camera states fit a roughly 390-pixel viewport with readable text and reachable controls.

## Validation record

Local release verification, 12 September 2026:

- The initial release passed 45 isolated Python tests on Python 3.12 / Flask 3.1.3 / Pillow 12.3.0. The final photo-archive follow-up passes 102: it adds actual retained-photo persistence, public retrieval, rights/confirmation gates, disk-failure and uncertain-commit handling, concurrent upload deduplication/caps, selected-language queueing, private research bounds/throttling, visual-description-only discoveries and safe old-schema migration.
- The existing generation contract smoke test also passes, with collection calls stubbed and background workers disabled.
- Twenty-eight JavaScript behavior regressions pass: the single permission prompt and native-picker gesture, automatic recognition, archive-first results followed by all connected collection sources and bounded alternate queries, corrected photo queries, stale-response protection, opening-to-reading/writing, permitted photo upload/retry, honest missing-engine state, automatic private discovery descriptions, language changes and single-flight requests.
- Both gallery JavaScript files pass syntax validation. The release diff passes whitespace validation.
- In-app browser checks at 390 x 844: clean search entrance, existing Cypresses story and its English recording, new fixture discovery and saved story, separate archive retrieval, Chinese interface with explicit English fallback, camera entrance and unchecked consent, and no horizontal overflow in the reviewed states.
- A camera catalogue candidate remained absent from the test archive through reload and an actual language-switcher interaction. It entered the archive only after the confirmation button was pressed (database count changed from zero to one).
- The final mobile refinement replaces the consent form with one yes-or-cancel prompt before the native photo picker; selection automatically starts identification and search. No visible checkboxes or museum fields remain. Opening the matching result performs the save/read action without another confirmation question. Visitor photo storage is covered by actual multipart image tests; no live visitor image was published for testing.
- An independent backend and frontend review found issues with stale source overwrites, query-based identity collisions, language event handling, photo-mode persistence, missing permalink capabilities and duplicate photo requests. Fixes are covered by regression tests.
- Added `.github/workflows/gallery-tests.yml` to repeat these checks on Python 3.11, matching the production runtime family. Remote CI is not claimed until a run is observed.

New-story and vision provider responses in local acceptance tests are fixtures, not live paid-model validation. Native phone camera hardware and a real paid photo-identification request have not been exercised.

### Recovery and autonomous discovery follow-up

- 146 isolated Python tests and 41 JavaScript behavior tests pass, plus the eight existing generation smoke checks. New coverage includes incomplete-source cache bypass, missing/broken MoMA indexes, image-free Wikidata objects, ranked photo hypotheses, bounded search concurrency, overlapping research saves, source snapshots, scout concurrency/caps/restarts, midnight rollover and retryable queue backpressure.
- Both official highlight feeds were checked with live, read-only requests. An isolated scout pass gathered four genuine museum records in about five seconds, including The Bedroom and Starry Night and the Astronauts, with the Art Institute's historical descriptions. A repeated pass did no additional work. This wrote only to a throwaway local database and made no AI request.
- Temporary source outages are now reported as partial searches, not authoritative misses. Partial results are not cached; complete empty searches expire after one minute. Wikidata objects with a collection/accession no longer require a reference image. Met search uses the documented replacement `/v1.1/search`, with bounded results.
- New writing must have an explicit completed provider response. Truncated, refused, malformed and missing-completion responses remain retryable, without a public story badge. Historical evidence is private input; public stories expose source credit, not copied source excerpts.

## ADR: website-owned autonomous museum discovery

**Status:** Accepted for this release. **Scope:** continuous operation through bounded scheduled passes, not an unlimited crawler or a claim of universal popularity measurement.

**Decision:** Extend the existing website discovery scheduler with `gallery_scout.run_once()`. SQLite owns the six-hour cross-process gate, source cursors, ranked candidates, retry state and daily reservations. Each pass uses separate source connections, never the visitor search executor. The scout fetches the Art Institute's boosted essentials and the Met's museum-selected highlights, then retrieves exact official object records. These signals are museum editorial selection, not measured worldwide search trends. Sources: [Art Institute API](https://api.artic.edu/docs/) and [Met Collection API](https://metmuseum.github.io/).

**Flow:** museum highlights → exact catalogue facts and licensed historical context → canonical artifact deduplication → low-priority English writing queue → source-grounded AI-assisted story → existing searchable story archive. Actual visitor demand and requested languages retain their priority. Existing stories are never rewritten merely because the scout encounters them.

**Evidence:** The writer receives persisted material, dimensions, period/culture, collection credit and available historical descriptions, with instructions to paraphrase, preserve uncertainty and avoid unsupported history. Evidence attribution is snapshotted with each generated story, so subsequent research cannot falsely claim to have supported an older story. Public credits identify the museum, license and AI adaptation. Art Institute descriptions use CC BY 4.0; catalogue metadata uses CC0. These are source-grounded AI-assisted stories, not falsely claimed human fact-checks.

**Alternatives:** A new task scheduler or external queue would add deployment and credential overhead to this single-worker site. An unbounded internet crawler would increase attribution, reliability and cost risks. Reuse of the durable website scheduler fits the current scale. Revisit separate job infrastructure and additional licensed museum/popularity feeds as traffic and editorial coverage grow.

**Limits:** At most four newly queued artifacts per UTC day by default, twelve object-detail attempts and roughly forty-five seconds of network work per pass. The scout pauses insertion at 200 pending writing jobs; visitors can still submit requests. Missing AI configuration does not block free research. AI writing uses the existing shared monthly attempt cap and hourly writer. Source failures back off, queue-full responses remain retryable, and uncertain queue commits conservatively retain their daily reservation. `GALLERY_SCOUT_ENABLED=false` stops scouting; `GALLERY_SCOUT_DAILY_CAP` is bounded to 0–24. The existing `DISCOVERY_ENABLED=false` disables the parent scheduler.

**Observability and recovery:** The owner-authenticated gallery queue includes automatic-discovery status, last run, sources, due time, candidates and daily usage. No public endpoint starts a scout run. Schema changes are additive. Disable the scout or revert this source release if startup or saved-story retrieval regresses; preserve all persistent archive/photo data. The site still needs its own privately configured Anthropic key before photo recognition or new writing can run live.

## Configuration and operating limits

- Durable data: `DATA_DIR/gallery_archive.sqlite3`. Existing curated sources and `gallery_readings_runtime.json` are imported additively and left intact. No migration deletes the originals.
- Identification throttling: `DATA_DIR/gallery_identify_usage.sqlite3`, containing counters and short-lived salted address hashes, not photographs, raw addresses, extracted labels or candidate lists.
- Permitted photo attachments: clean JPEGs under `DATA_DIR/gallery_photos/`, registered to exact artifacts in `DATA_DIR/gallery_photos.sqlite3`. Anonymous visitor credit, publication consent version, content hash and timestamp are retained; original filenames, metadata and raw upload files are not. Public retrieval serves only registered JPEGs. Default caps: 3 photos per artifact, 128 MB global disk budget, 12 upload attempts per address per hour. All runtime databases, sidecars and photos are excluded from Git.
- Unmatched clues: a private research table in the archive database, maximum 1,000 deduplicated records and 12 attempts per address per hour; textual clue submission is capped at 16 KB even without a Content-Length header. Only the owner-authenticated queue endpoint exposes this inbox. It requires editorial review rather than automatic identity claims.
- Story writing and recognition accept the gallery-only `GALLERY_ANTHROPIC_API_KEY`, falling back to the legacy `ANTHROPIC_API_KEY` only when the gallery override is absent. An explicitly blank override disables gallery AI. The scoped key does not enable unrelated article translation. The owner approved reusing the existing Anthropic key and it was transferred privately to Render, never into source or tool output. Authentication was checked directly with Anthropic before activation.
- Live activation check, September 12: release `0f4d4a66` is deployed and reports a configured gallery engine. A real recognition test with the site's existing permissioned Peace Fountain image returned a provider-unavailable response. A single tiny direct diagnostic confirmed Anthropic HTTP 400 with a billing/credit rejection, although model-list authentication succeeds and the configured model exists. Therefore photo identification and new story generation are **not yet accepted as working**. No photo was published, no successful story was fabricated, and no credits were purchased. Existing stories and free source research remain independent of the blocked provider.
- Default model overrides: `GALLERY_MODEL` and `GALLERY_VISION_MODEL`. Both use the existing Sonnet-class configuration by default.
- Writing cap: 1,500 attempted provider calls per calendar month, shared by direct writing and hourly background writing. Photo cap: 500 attempts per month and 12 attempts per address per hour. Attempt counts include uncertain provider failures.
- The existing discovery thread processes at most one due story per hour. Explicitly confirmed, requested-language stories take priority over background English discoveries. Missing configuration preserves the queue; failures back off and remain retryable.
- Photo support: JPEG, PNG or WebP, at most 6 MB / 20 megapixels. Metadata is removed and pixels are downscaled in memory. Identification accepts only explicit `anthropic-photo-search-v1` consent and calls only the approved Anthropic endpoint. Optional publication separately requires `gallery-photo-publication-v1` and an exact-artifact confirmation token valid for 15 minutes.
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

Recovery procedure: revert only this release's source commit and redeploy; preserve the persistent data disk, all gallery databases, clean visitor photographs and all original JSON/script sources. Do not delete an archive to roll back a page. Newly saved records remain available for a corrected forward deployment.
