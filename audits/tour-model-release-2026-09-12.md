# Tour models and public directory release

Assembled from deployed photo/slideshow baseline `54e0533` in the isolated `codex/tour-model-release` worktree. This document records local release readiness, not a production deployment. Sean authorized publishing the completed tour work; the parent agent owns the final push and live verification.

## Scope

- Reuse the approved One World Trade Center / 9/11 Memorial reconstruction and nine Boston models from `71e68f6`, with their existing independent architecture/rendering signoffs. No geometry was redesigned in this release.
- Connect the ten models and eleven bilingual visitor stories from `8138922` to the existing Freedom Trail, Destination Book and landmark entries. Peace Fountain stays a real photograph and story, not an unapproved sculpture model.
- Promote the reviewed city-first directory to `/tours`, with twelve real walks in eleven cities and 148 stops. Preserve each stop's identity, order and narrative. Walking totals sum the same incoming legs as the tour player, excluding the first stop.
- Read only the public filtered `/api/trails` and `/tour-stop-photos.json`. Reject flagged private images again in the client adapter, omit internal rights notes from display data, and use the deployed shared slideshow. The architecture viewer also uses the filtered exact-stop photo overlay.
- Publish factual names and mascot identities for all eight Ivy schools, with official source links and an independent-guide disclaimer. The eight logo assets and six mascot photographs remain private-preview only, because public-use permission was not established. They are not claimed as publicly released.
- Preserve the original guided Seattle tour page and booking form at `/tours/seattle`. Change only its canonical/Open Graph URL metadata. The directory links prominently to it, sitemap and site-map entries remain available, and old `/tours#ask` or known Seattle model/form anchors forward to the corresponding Seattle section.
- Add an ordinary `/tours` link beside the homepage's Boston tour feature. Do not add paid calls, automatic audio, background jobs or new model promises.

## Merge and preservation

The Freedom Trail conflict was resolved by retaining both the deployed `ft-stop-photos` mounts / `feedMiniShows` disposal path and the approved model buttons / `ft:stops-rendered` event / exact stop anchors. Audio selection and playback blocks were not weakened or rewritten. The deployed `trails.json`, photo manifest, slideshow module/styles, generic tour page, National Mall page and audio/media assets remain unchanged.

Gallery changes are not cherry-picked from the preview. Merge the already-published Gallery correction `d533af1` before releasing this branch, preserving its code exactly. Do not push the original dirty preview checkout.

## Verification

- 96 Node checks passed: geometry/assets/cameras/stories, model-tour integration, the unchanged tour-audio hashes, shared slideshows, private directory regression and seven public directory contract checks.
- 20 Python checks passed: public architecture routes, photo manifest/API and public directory asset allowlist.
- `model_audit.py --owed` ran before model assembly. It reports zero checkable failures and existing legacy ledger debts. Those bookkeeping debts are not silently declared closed; this release reuses the separate two-critic WebGL signoffs in `audits/architecture-preview-2026-09-12.md`.
- Parent's real browser QA at 390px: Boston directory has no horizontal overflow and shows the State House photo with the correct 3D link; public State House model rendered a 351 × 456 canvas with 44px controls. Prospect House search selects Princeton stop 8 and its actual photo, distinct from the Art Museum at stop 9.
- Source/type checks preserve same-origin model links and allowlisted modules; no loopback or private-preview URL is linked from the new public directory.
- No paid providers or production records were used in local tests. Local app tests run with temporary data and blocked backend requests.

## Release checks and rollback

Before pushing, verify the Gallery merge and clean worktree, then rerun the affected directory and API checks. After deployment, verify `/tours`, `/tours/seattle`, one Boston model and the WTC destination, plus existing photo and audio paths. Roll back the scoped tour-release changes if routes fail, exact stop/media identity changes or mobile navigation becomes unusable. Keep the deployed Gallery privacy/correction commits and the earlier photo/slideshow release; do not roll the entire site back to the preview baseline.

Held back: uncleared Ivy brand images, seven existing stop-photo sources requiring permission, new university/Philadelphia/Rushmore models, a replacement Peace Fountain sculpture and any unfinished audio rerecording. No new completion claim is made for those items.
