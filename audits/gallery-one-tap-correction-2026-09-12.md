# Universal Gallery one-tap correction

Sean clarified that the original automatic discovery/story flow was correct.
An unrelated result is its own worthwhile discovery, not a photo confirmation.
The previous release's second writing action was an incorrect product change.

Restored contract: tapping an item opens its saved story or saves that exact
catalogue identity and automatically requests its own selected-language story.
No extra writing tap or questionnaire. Merely rendering search results does not
generate stories. Existing stories are reused. Closed, replaced, or mismatched
responses cannot relabel another item, reopen a closed panel, or initiate stale
follow-on work. Visitor photographs remain private. Provider and budget limits
are unchanged; if writing is unavailable, the discovery is saved and queued.

Backend acceptance verifies two different items receive distinct archive IDs,
complete their stories in reverse order, remain independently searchable, and
reuse both stories on repeat requests with only two mocked provider calls total.
Neither creates a photo confirmation. The phone-sized browser fixture verifies
zero writes on results display, then exactly save+generate after one tap on the
unrelated item's name, with its own title, story and permanent link. Width390px,
no horizontal overflow or extra write button. All review uses fictional items,
temporary data and mocked/disabled providers, with no paid test generation.

Final release checks: 141 isolated Python tests and 131 Node tests pass, including
75 Gallery UI regressions. Existing guide/audio tests remain green. Whitespace
checks pass. Live deployment must still be checked separately from this audit.

Release is Gallery-only. Audio, tours, photo manifests and model assets are
unchanged by this correction. The tour/model publication is a separate release.
Fast-forward main deployment, then verify exact live JS and HTML asset version.
Rollback only a faulty correction, never remove visitor-photo privacy or change
archive data. No database migration or provider configuration change is needed.
