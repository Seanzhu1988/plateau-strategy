# Universal Gallery camera intake repair

Date: 2026-09-12

## Scope and findings

- Camera entry incorrectly selected the photo-library input. Camera and library now have separate, direct native-picker targets after the same single consent prompt.
- Ordinary high-resolution phone images were rejected before resizing. A local, bounded preparer now converts supported images to a metadata-free JPEG with a 1920px long edge before upload.
- Empty MIME metadata is no longer a blanket rejection; actual file signatures and dimensions must pass before decoding. SVG, HTML and unsupported images fail closed.
- A stalled identification request could leave controls locked forever. The browser now bounds request and body reads to 90 seconds, with explicit manual retry and no automatic paid retry. Preparation has its own 15-second deadline and cancellation.
- Provider billing, authentication, model availability, rate limiting and timeouts are distinguished from an unrecognized or damaged photograph. Private provider error text is never returned or logged.

## Limits and privacy

The client accepts at most 24MB, 64MP and a 16000px source edge. HEIF headers must be safely inspectable and the browser must support native decoding. JPEG export is below6MB. The server retains its existing6MB upload,20MP decode, decode-concurrency and paid-request reservation limits. Successful preparation does not publish a photo. Publication still requires opening a confirmed artifact under the existing explicit consent.

## Verification

- 181 isolated Python regressions for archive, journeys, identification, photo publication, research, recovery, background work, scout, credentials and Pulse.
- 85 Node regressions:54 gallery controller,18 photo preparation,13 Pulse controller.
- Separate generation smoke tests use mocked providers only.
- Independent review of image parsing, cancellation, memory limits and server error classification.
- Real Chromium decoding with synthetic JPEG fixtures, both ImageBitmap and native Image paths:24MP,48MP,7.44MB, missing MIME, EXIF orientations6 and8. All produced correctly oriented1920px-or-smaller JPEGs under6MB; a private test metadata marker was removed. Disguised SVG was rejected.
- Local390px gallery view and consent dialog inspected; no horizontal overflow, camera and library targets at least44px tall.
- No physical iPhone camera or actual iPhone HEIC file was available for acceptance. Native camera invocation is covered by controller tests; HEIC support remains dependent on the visitor's browser.

## Remaining operational blocker

A text-only diagnostic returned an Anthropic insufficient-credit error before the owner's budget concern. No paid provider tests were attempted after that concern, and no API credits were purchased. This release repairs camera intake and error reporting; it does not claim successful live AI recognition or story generation, and does not introduce a new provider or free OCR service.

## Release and rollback checks

- No database migration, new paid dependency, credentials or funding changes.
- Verify deployed helper and controller content exactly match the release, public gallery and archive respond, and owner endpoints remain401 when signed out.
- Roll back this camera-only change if the gallery cannot load, consent is skipped, unprepared files upload, or saved stories become inaccessible. Rollback should use an explicit reviewed revert; do not reset unrelated work or mutate the archive.
- Publishing does not resolve the credit blocker. Free on-device label OCR and source-based summaries are a proposed lower-cost follow-up, not part of this repair.
