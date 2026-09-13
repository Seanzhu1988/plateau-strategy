# Gallery and tour-photo release

Approved by Sean: “credit is hitting bottom push it when done.”

Base: main 830e4dd57dfed1de3046d9b5258da74271b8ef86. The release includes visitor-photo privacy, read-only Gallery result browsing with explicit story writing, canonical artifact/language safeguards, and exact-stop photo slideshows. Private directory and architecture redesigns are excluded. No database migration, provider configuration, new dependencies, audio assets, narrative changes or paid generation calls.

Pre-deploy: independent Gallery/privacy review passed; 140 isolated Python tests and 125 Node tests passed against this scoped release, with provider traffic disabled. Seven byte-for-byte audio-block baselines pass; trails.json and media/audio are unchanged from main. Browser review at 390px confirms 16 Boston photo groups with intact existing guide controls. Earlier private fixture review proved browsing a different interesting item made zero write requests, and only an explicit story request selected that item's identity.

Photo research: 148 stops, 165 references, 12 routes. New approved-source overlays cover 141 stops; seven references remain private pending permission. Both public endpoints filter them. Original visitor photographs remain unavailable publicly. Existing seed photographs are not newly rights-cleared by this release.

Deployment: fast-forward push to main triggers the existing Render auto-deployment. Verify Render reports the release commit live, production HTML carries that asset version, Gallery assets match, photo endpoints return filtered data, and all three tour templates respond. No paid photo recognition or story-generation smoke calls.

Rollback triggers: persistent new 5xx responses, wrong artifact-story association, visitor-photo exposure, or broken guide/photo rendering. Prefer a focused revert of the failing Gallery/photo changes while keeping the visitor-photo privacy commit d7ca87d. Do not roll back to a version that exposes visitor images, delete archive data, or change audio recordings. No schema rollback is needed. Live status must be reported separately; passing local checks does not mean deployed.
