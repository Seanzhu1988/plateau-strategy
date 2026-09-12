# Architecture rebuild: private preview, 2026-09-12

## Delivery scope

One new interactive One World Trade Center and 9/11 Memorial scene, plus
nine rebuilt Boston Freedom Trail models. These are actual Three.js meshes
with lighting, shadows, recessed windows, physical rooflines and interactive
cameras, not flat generated pictures or photographic scans.

This delivery is a local review build. No production files, tour audio,
database, hosting configuration or live routes were changed. Nothing was
pushed or deployed. Hosting migration remains deferred at the user's request.

The Boston capture layer consumes the existing nine form files, but does not
edit them. Its physical-geometry corrections are isolated in
`architecture-boston.js`. The World Trade Center scene is independent.

Source records:

- [Boston measurements, reference photographs and declared approximations](boston-webgl-sources.md)
- [World Trade Center and memorial source ledger](wtc-model-sources.md)

## Review standard and results

The project MODEL_STANDARD method was followed: primary-reference research,
geometry construction, actual renders from more than one angle, then two
independent critics. Scores below are for a labelled architectural
reconstruction preview, not photorealism certification or a surveyed model.
The architecture critic did not build either scene. The final Boston render
critic built WTC, but did not build Boston; WTC had its own separate render
critic. Root implementation checks are not counted as independent verdicts.

The reviewed screenshot evidence is retained in
`review/architecture-2026-09-12/`: paired Boston front/rear views, the
Constitution stern close-up, and four WTC whole/detail views. Where filenames
have revision suffixes, the latest correction is the version retained here.

| Model | Architecture | Rendering | Status |
| --- | ---: | ---: | --- |
| One World Trade Center and 9/11 Memorial | 7.7 | 7.6 | Private preview pass |
| Massachusetts State House | 7.5 | 8.2 | Private preview pass |
| Park Street Church | 7.5 | 7.7 | Private preview pass |
| Old South Meeting House | 7.7 | 7.9 | Private preview pass |
| Old State House | 7.6 | 7.9 | Private preview pass |
| Faneuil Hall | 7.6 | 8.0 | Private preview pass |
| Paul Revere House | 7.7 | 7.7 | Private preview pass |
| Old North Church | 7.7 | 7.9 | Private preview pass |
| USS Constitution | 7.5 | 7.7 | Private preview pass |
| Bunker Hill Monument | 7.8 | 8.0 | Private preview pass |

The review loop caught and corrected real defects: clipped spires, a
miscentered cupola, unsupported State House dome, incorrect church steeple
stages, missing dormers, inaccurate Paul Revere dimensions, Bunker Hill's
extra plinth, an unsupported ship boom and front windows hidden by panes
recessed in the wrong direction. WTC pool holes were checked as physical
voids; water glare and podium shadow artifacts were reduced after rendering
review. Constitution's stern received a dedicated close-up camera, corrected
modern white-and-black treatment and the documented upper windows. All ten
scenes now have two independent passing verdicts at or above 7.5.

## Verification

- 29 Node tests: all nine Boston builds, WTC geometry and pool raycasts,
  valid coordinates, selected-asset loading and retry isolation, back-forward
  cache resource lifetime, and perspective fitting at four aspect ratios.
- Three Python tests: exact asset allowlist, reconstruction/noindex disclosure,
  and rejection of application, data, API and traversal requests.
- Desktop browser: all ten models opened, front/back camera views exercised,
  WTC detail cameras inspected and Boston selected forms loaded lazily. Reset
  restores the default view and URL; zoom in/out and memorial switching were
  exercised in the final build. The ship's stern close-up renders separately
  from whole-ship fitting.
- Phone-sized DOM check at 390 x 844: document width 390, no horizontal
  overflow, stage width 351, selector height 48, buttons at least 44 x 44.
  Portrait bounds have independent projection tests. The browser screenshot
  capability produced a scaling artifact under viewport override; this is
  not represented as a real-device screenshot or physical-phone GPU test.
- Existing `model_audit.py --owed`: 37 legacy shipped models, zero checkable
  failures. Existing missing-verdict debts remain. This legacy audit does
  not automatically discover or certify the new private preview.

Tests can be repeated from the repository root:

```sh
node --test test_architecture_assets.mjs test_architecture_camera.mjs test_architecture_models.mjs
python -m unittest test_architecture_preview.py
```

Python requires Flask in the selected environment. No production application
is imported by the preview server or these preview tests.

## Preview and operating cost

Run `python review/serve_architecture.py`, then open
`http://127.0.0.1:8777/?model=world-trade-center&view=memorial` on this computer.
The server binds only to loopback and only serves explicitly allowed assets.
It does not expose the production app, secrets or data directories.

The model selector opens the Boston landmarks. Drag to rotate, pinch or use
the zoom buttons, select a close view, or reset. Only the chosen Boston form
loads. Water animation stops for hidden/offscreen views and reduced motion.
Rendering uses on-device graphics; this feature makes no Anthropic calls,
image-generation requests or other paid AI requests.

Three.js 0.180.0 is pinned and vendored locally with its MIT license and
provenance. Model viewing does not depend on a third-party CDN. No external
photographs were incorporated as textures or published.

## Deliberate limits

The WTC campus positions, landscape, many small facade/crown dimensions,
Boston secondary details and procedural surface textures are approximations.
Memorial inscriptions are intentionally absent rather than invented. This is
not a name locator, an official site plan or a complete reconstruction of
neighboring buildings. Thin steeple details, repetitive material grain,
simplified sculpture and landscape remain visible limitations. Real-device
performance and integration with the live tour player remain production
release checks, after the user's review of this private build.
