# Gallery browsing and photo identity fix

Historical audit, superseded by Sean's correction: tapping any item must
automatically open/create/save its own story, including an unrelated discovery.
The separate writing button described below was a product mistake and is being
removed. Keep the identity, duplicate-work and visitor-photo privacy protections.

Built and tested locally on 2026-09-12. Sean subsequently authorized pushing completed fixes.

## Cause and behavior

The old “Open artifact” action confirmed an object, queued a story and could generate one immediately. Curiosity was being interpreted as photo identification. A separate read-path identity lookup also accepted secondary URL/Wikidata matches despite conflicting accession numbers.

Viewing now performs no discovery, confirmation or generation request. An existing story is read with GET; a missing story has a separate explicit request button. Photo results and their stories remain labeled as unverified photo matches. No extra dialog or questionnaire was added.

The server rejects old implicit Open calls before mutation, requires `intent: write_story`, and echoes the selected identifier and language. Explicit story requests never increment photo confirmation counts or create an unsolicited additional English queue entry. Client responses cannot retarget a stable artifact or display another artifact/language's story. Both identity read and write paths share accession/institution conflict guards. Closed cards cannot reopen from late responses.

## Verification and limits

- 69 isolated Gallery UI behavior tests pass, including late transport responses delivered after cancellation.
- Combined backend/API/architecture/privacy/photo suites: 149 tests pass. Provider failures in those tests are synthetic; no paid recognition or writing was used.
- Real browser, 390px: fictional private fixture confirmed 0 write requests after opening an unrelated result and after reading a saved story. Explicit story creation issued the expected save/generate pair for the selected object only. No horizontal overflow; controls at least 44px.
- Original visitor photographs remain unpublished. Production records were not inspected, deleted or rewritten. The exact visitor-reported photograph was not available for a recognition-accuracy test.
- This fixes browsing/identity association, not a claim of perfect visual recognition. Existing independent background artifact research remains enabled according to its prior configuration.

Release the application, archive and controller changes together. No database schema change is required. Rollback a bad deployment by reverting its release commit, keeping the independent visitor-photo privacy guard. Private behavior fixture: `/review/gallery-browsing?q=vessel&origin=photo` on the loopback review server only.
