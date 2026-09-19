# Quebec City model page

User requested publication of the completed autumn Chateau Frontenac model with a Quebec City title.

New public page: /quebec-city. The architecture index links to it, and it appears in the sitemap. The site hosts the revision 4 GLB and preview, with no Higgsfield account or expiring URL required. The 23 MB model loads on request. Geometry and landscaping are explicitly described as approximate.

Features: desktop/mobile viewer, terrace/courtyard/reset controls, touch and keyboard orbit/zoom, full screen where supported, model download, poster fallback and retry on loading failure. Three.js GLTFLoader and BufferGeometryUtils are vendored from the matching MIT-licensed 0.180.0 release. Model textures are embedded.

Validation before publication: nine isolated Flask tests passed, JavaScript syntax passed, desktop and mobile Chromium loaded the actual GLB and exercised camera/keyboard controls with zero page errors and no horizontal overflow. A failed GLB request preserved the poster and enabled retry. Both screenshots were visually inspected. Existing live app and state were not started locally.

Live deployment verification: pending after push. This release does not claim a complete walking tour, surveyed geometry, official Fairmont affiliation, or independent Claude review.
