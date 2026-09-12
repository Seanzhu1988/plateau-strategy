# One World Trade Center and the 9/11 Memorial, private 3D study

This is an inspectable Three.js scene, not a generated picture. It is an architectural visualization, not a survey, a fabrication model or an official memorial-name locator. The live website is untouched. Independent architecture and rendering reviews passed the private reconstruction preview; see the [final delivery audit](architecture-preview-2026-09-12.md).

## Research before geometry

Read `CLAUDE.md`, the first 175 lines of `MODEL_STANDARD.md`, `PALETTE.md` and `DESIGN_DECISIONS.md`. Ran `python3 model_audit.py --owed` before building. The legacy shipped models report no checkable failures, but this is not evidence that a new model passes architecture or rendering review.

| Feature | Source and implementation |
| --- | --- |
| Tower height | [SOM](https://www.som.com/projects/one-world-trade-center/) gives 1,776 feet. The mast tip is y = 1,776, without vertical exaggeration. |
| Base and roof | [SOM's design interview](https://www.som.com/news/rebuilding-the-site-of-the-twin-towers/) gives the 200-foot-square base. [WSP](https://www.wsp.com/en-us/projects/one-world-trade-center) and [the structural project account](https://www.structuremag.org/article/one-world-trade-center/) give the 1,368-foot roof. |
| Faceted form | [SOM](https://www.som.com/projects/one-world-trade-center/) describes eight elongated triangular faces, an octagonal middle and a 150-foot-square parapet rotated 45 degrees. Geometry uses eight actual planes between a square base and diamond roof, not a continuously twisting extrusion. |
| Podium | SOM's architect-provided description published by [ArchDaily](https://www.archdaily.com/795277/one-world-trade-center-som) gives the 186-foot podium, approximately 13-by-2-foot fins, and triple-laminated glass with stainless slats. The project descriptions differ between a 200-foot structural footprint and an approximately 204-foot external podium envelope. This study uses 200 feet for the main body, with a 204-foot ground plinth. Fin spacing, angles and small thicknesses remain a visual interpretation. |
| Entries and glass | [SOM](https://www.som.com/projects/one-world-trade-center/) describes four 60-foot-tall entries, a 50-foot lobby, 71 office floors and 5-foot by 13-foot-4-inch glass units. Entries are on all four sides. Glass is subdivided geometrically at the published module scale, with edge panels clipped against the triangular surfaces. An exact floor-by-floor mechanical/office schedule is not available and is not claimed. |
| Roof and spire | SOM identifies communication rings and a cable-stayed spire. WSP establishes the roof-to-tip interval at 408 feet; SOM describes 441 feet for the full mast assembly, which starts below the parapet. Visible rings, guy wires and a tapering mast are present. Ring diameters, mast sections, cable attachment elevations and equipment layout are unsurveyed visual details. The study does not claim these as exact numbers. |
| Memorial depths | [The 9/11 Memorial](https://www.911memorial.org/visit/memorial/about-memorial) specifies two nearly acre-sized pools, a 30-foot drop and another 20-foot drop into a smaller central void. Both drops exist as geometry, and the plaza has holes rather than an opaque ground sheet over the pools. |
| Memorial rim | [Handel Architects](https://handelarchitects.com/project/national-september-11-memorial) gives an 8-foot-wide, 2-foot-high water table. The outer pool study measures 192 feet with a 176-foot inner opening. The published [architect-supplied project description](https://www.archdaily.com/272400/national-september-11-memorial-handel-architects-with-peter-walker) gives 192 feet, while other accounts give 176 feet. The study treats the 16-foot difference as the two 8-foot water-table margins, an explicit interpretation rather than a verified construction dimension. The central void's width is a visual approximation, not a sourced dimension. |
| Bronze parapet panels | [The memorial's own panel explanation](https://www.911memorial.org/blog/memorial-announces-final-names-arrangement-memorial-guide) gives 76 panels per pool. There are 19 geometric panels on each side. Names are intentionally omitted rather than invented or rearranged. Parapet width, tilt and thickness are visual details. |
| Landscape | [PWP](https://www.pwpla.com/national-911-memorial/landscape-design) describes a grove with aligned corridors and publishes 12-by-60-inch pavers. A procedural paving texture uses that module, and instanced trees represent part of the grove. The approximately 400 trees on the real site are not claimed as individually reproduced. |
| Relative placement | [The Port Authority campus map](https://wtcprod.panynj.gov/content/dam/wtc/site-resources/documents/campus-updates/WorldTradeCenter_Campus_Map.pdf) and the [official memorial aerial](https://www.911memorial.org/visit/memorial/about-memorial) establish the tower north of the two offset pools. Positions and the rectangular study boundary are diagrammatic, not a georeferenced site plan. Surrounding buildings, the museum pavilion, the Oculus, the Survivor Tree and the Memorial Glade are omitted rather than fabricated. |

## Render implementation

- Reflective physical glass material, warm/cool facade differences and slight individual pane variation.
- Geometrically clipped window panels, real thin mullion meshes and diagonal facet seams.
- Instanced podium fins, slats, portal frames, pool parapets and paving-level details.
- Metallic roof rings, tapered mast sections, ring collars and guy wires.
- A solid, perforated plaza slab that extends below the deepest basin, with no ground plane filling the holes.
- Black granite walls, water surfaces, procedural falling-water streaks and impact foam, with true central shafts.
- Procedural stone grain, water bump and paving textures. No third-party photography is republished and no external image generation or API spend is required.
- Branches and clustered leaf geometry instead of spherical tree icons. Fine trees and site furniture are landscape context, not measured architectural claims.
- Explicit tower, facade, memorial, waterfall and overhead cameras. Real Y-axis heights are unchanged across all views.

## Integration contract

`buildWorldTradeCenter(THREE, kit)` returns `group`, `title`, `notes`, `views`, `sources`, `stats`, and `animate(seconds)`. It does not create a renderer, DOM nodes, network connections or animation loops. The caller owns lighting, environment, camera, controls, disposal and reduced-motion behavior. It can omit the animation callback for a still view. A generic viewer ground must be below y = -66 or disabled for this scene.

## Outstanding accuracy limits

The real inscriptions are the most serious intentional omission. This preview cannot be used to find a loved one's name and must not imply that it reproduces the engraved text. Fine facade and crown dimensions, current landscape inventory, detailed utility/mechanical floors, and a surveyed campus plan remain absent. Primary dimensions and distinctive large forms are sourced, but this does not make every modeled detail a published measurement.

Independent architecture verdict: 7.7/10. Independent rendering verdict: 7.6/10.
Both apply to the r3 private architectural reconstruction, not photorealism.

## Builder verification, 2026-09-12

- ES-module syntax check passes.
- Actual Three.js construction passes in Node with no nonfinite geometry or transform values.
- Bounds are `[-355, -65, -510]` to `[355, 1776, 510]` feet. Tower height is not multiplied for display.
- 13,292 clipped glass panels, 6,782 repeated architectural members, 287 interpretive tree representations and 132 mesh objects. Approximately 526,204 triangles are rendered including instances; the grove uses one instanced foliage draw.
- Vertical raycasts through both central voids first hit the floor at approximately y = -48.075, not an opaque plaza or water plane. A ray through the surrounding lower water shelf hits approximately y = -27.9.
- The first whole-tower and memorial renders were inspected by the builder. The whole-tower camera was widened because the tip was cropped. Foliage was darkened and varied, small fin self-shadow aliasing was removed, and waterfall/paving contrast was increased. Root subsequently refined water roughness, reflection and ripple breakup, removed residual podium fin shadow acne and fitted the upper-spire view. Fresh independent r3 architecture and rendering reviews passed; builder checks alone were not treated as approval.
