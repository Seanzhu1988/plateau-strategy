# Boston physical architecture preview

Date: 2026-09-12

Scope: the nine building and ship models on the Freedom Trail. This is a new,
isolated Three.js preview, not an automatic replacement of the live tour and
not a photographic scan. The original trail-form files have not been edited.

## What changed in the renderer

- Geometry is now three-dimensional mesh geometry in feet. Source coordinates
  use z up; the viewer uses y up. A one-time source-plan reflection preserves
  the documented left/right arrangement from the visitor's front view.
- All faces are captured, not only faces visible at one SVG camera angle.
- Declared facade normals are retained separately from raw material color.
  Some legacy gable helpers enumerated both end faces in the same direction;
  without their normal hint one facade's glass moved in front of its sash
  bars. Front and rear dormer normals are now explicit.
- Only polygons actually returned by the source scene are admitted. Measuring
  polygons and the discarded Faneuil dome call are not accidentally rendered.
- Concave contours and holes use Three.js `ShapeUtils.triangulateShape`, not
  a triangle fan. Validated finite attributes are grouped by material.
- Glazed apertures are cut into containing wall and surround polygons and
  recessed by 0.30 ft with physical reveal faces. That shallow setback is a
  rendering approximation, not a claimed measurement. Fine sash bars are
  clipped to the actual opening contour.
- Physical light, rough materials and real shadow maps replace baked face
  brightness and ground-shadow polygons. Material UV coordinates are in feet.
- The legacy rectangular-slab helper discarded its depth argument and made
  every long cornice and foundation square. The new capture helper fixes the
  footprint and supplies top/bottom faces. Legacy SVG contexts still delegate
  to their original helper, so unrelated live rendering is unaffected.
- Circular domes use 64 segments and 20 latitude bands, with curved normals.
  Circular columns use a radius profile with separate base and capital bands.
  Church octagons retain their actual eight-sided plan.
- Finials, weather vanes and rigging have thickness. The State House dome gets
  a physically connected supporting drum; it no longer floats from the rear.

Three.js implementation references:

- [Shape triangulation](https://threejs.org/docs/pages/ShapeUtils.html)
- [BufferGeometry](https://threejs.org/docs/pages/BufferGeometry.html)

## Sources, corrections and honest limits

### Massachusetts State House

The source form preserves the 1798 description reproduced in the National
Historic Landmark nomination: 173 ft front, 61 ft depth, 20 ft basement and
30 ft principal storey, 94 ft portico projecting 14 ft, 60 ft attic, 50 ft
diameter by 30 ft high dome. Seven arches and twelve portico columns are
retained. The source audit and figure provenance remain in
`trail-form-state-house.js`.

The round dome replaces the octagonal cap. Fine standing seams and a scaled,
sculpted pine-cone finial replace the generic spike. The rear support from the
main roof to the dome drum is reconstructed, because a physical model cannot
rely on the front pediment hiding an unsupported dome. The later north and
rear extensions are deliberately not represented by this Bulfinch-frontage
study. Column capitals are readable simplified profiles, not detailed carved
Corinthian acanthus.

- [NPS State House](https://www.nps.gov/places/massachusetts-state-house.htm)

### Park Street Church

Retained: 217 ft 9 in overall steeple, four 35 ft entrance columns, 20 ft
square bell stage, eight columns there and eight around each octagonal stage.
The church's own exterior reference shows open arched lanterns and a clock
on the brick stage. These replace opaque white faces with black circular
patches. A pitched nave roof and radial apse roof replace the unfinished flat
stopping plane. The 40 ft eave is from the Sanborn sheet; the 53.5 ft ridge
is photo-scaled and explicitly not a surveyed height.

The old star contour overshot the stated height. The final vane now ends at
217.75 ft. Intermediate stage positions still use the legacy published and
derived arithmetic, so this is not a new measured survey of every stage.

- [Church architecture and history](https://www.parkstreet.org/about-us/freedom-trail/)
- Existing Sanborn and Bowen citations in `trail-form-park-street.js`

### Old South Meeting House

The primary close-up photograph contradicted the legacy text interpretation
of three very tall white octagonal stages followed by only 20 ft of copper.
The new upper silhouette follows the photograph: white arcaded/louvered lower
bell stage, concave green-copper transition, short white lantern with
triangular pediments, one long green copper taper carrying small circular
oculi, and a gilded weather vane. The 183 ft overall height is retained.

The brick tower's depth and upper component heights are photo-scaled
reconstructions. The original 67 by 94 ft body, seven-bay long elevations,
five-bay end and arched sash rows are retained. The new model must not be
described as verifying the old 80 + 83-white + 20-copper interpretation.

- [NPS site](https://www.nps.gov/places/old-south-meeting-house.htm)
- [NPS detailed steeple photograph](https://www.nps.gov/npgallery/GetAsset/f4fc3e02-2d62-4d0d-a034-1751bf9a1da2/proxy/hires)
- [Boston Landmarks Commission report](https://www.boston.gov/sites/default/files/file/2025/06/Old%20South%20Meeting%20House%20Study%20Report%20with%20Addendum_1.pdf)

### Old State House

Retained source plan: 36 ft 4 in by 112 ft 7 in. Front clock, balcony and
scrolled gable remain. The coordinate convention is corrected so the gold
lion is on the visitor's left and the white unicorn is on the right when
facing the east facade. Five small pitched-roof dormers are added on each
slope. Dormer size and spacing are scaled from the photographic appearance,
not published measurements. Lion and unicorn silhouettes have thickness but
remain simplified sculpture. Individual floor heights remain derived.

- [NPS building and exterior photograph](https://www.nps.gov/places/old-state-house.htm)
- [NPS east-facade photograph](https://npgallery.nps.gov/AssetDetail/38960c54-757b-4f1c-9a7e-101856804053)

### Faneuil Hall

Retained: 80 by 102 ft plan, seven bays on the ends and nine on the sides,
three articulated storeys and slate gable roof. Five copper-clad barrel
dormers per slope restore the missing roof rhythm. The cupola cap is now
round and centered on the actual source cupola at y = 26 ft; an initial
preview offset was corrected after visual review.

The NPS gives the grasshopper's length as 4 ft 1 in. The model replaces the
two flat polygons with a gilt body, legs, antennae and spindle. Leg poses and
small surface details are reconstructed, not scanned. Intermediate heights,
cupola footprint and placement remain the source form's declared derivations.
The geometry does not newly certify its historical ordering of pilasters.

- [NPS virtual tour](https://home.nps.gov/bost/learn/faneuil-hall-virtual-tour.htm)

### Paul Revere House

This model is rebuilt from the actual HABS measured drawing, not from the
incorrect 48 by 30 ft main block used by the old source form. Main footprint:
30 ft 6 in across by 18 ft 2 in deep. The first-floor frontage chain written
on the plan is 49, 35, 53, 35, 52, 35, 32, 32, 43 inches, totaling 366 inches.

The front elevation shows three paired casements then the door at the far
right, three paired casements and one narrow single opening upstairs, two
corner pendants, and the main chimney at the right/north roof end. All are
represented. The roof rise of 11.5 ft is scaled from the elevation, not
printed as a dimension. The 16.8 ft eave and other vertical dimensions are
also reconstruction values. HABS identifies cedar shingles, wood clapboards
and granite fieldstone; the viewer's surface finish is an approximation of
those materials, not a captured texture of the actual house.

The rear kitchen is visibly skewed, not a square ell. Its corner coordinates
are scaled from sheet 2: approximately (-1.5, -9.083), (15.25, -9.083),
(19.5, -25.3), (3.5, -25.3), using the centered main block as reference.
The small additional utility projection is omitted and not claimed.

Sheet 4 supplies the rear casement pair on each storey, south-gable shuttered
openings and attic opening, the rear wing's two upper sashes, lower sash,
attic window and door/stair. The north party-wall is not filled with invented
matching windows. A small rear rooflight is included at a scaled position.

- [HABS sheet 1, front elevation](https://www.loc.gov/pictures/item/ma0478.sheet.00001a/)
- [HABS sheet 2, measured plan](https://www.loc.gov/pictures/item/ma0478.sheet.00002a/)
- [HABS sheet 4, side and rear elevations](https://hdl.loc.gov/loc.pnp/hhh.ma0478/sheet.00004a)

### Old North Church

Retained: 51.5 by 96.5 ft body and 191 ft overall height. The NPS exterior
photograph corrected the upper silhouette: balustraded terrace and pinnacles,
broad bell stage with paired louvered arches, smaller glazed lantern, then
the long taper. Stage elevations are scaled reconstructions, not a measured
survey. The unsupported claim of three plain white tapered blocks is gone.

The front granite plaque is explicitly documented as 10 ft 3 in wide by
6 ft 4 in high and one foot thick, installed 42 ft above pavement. Its face
is represented, but the full inscription is not modeled as micro-geometry.
The model does not claim exact placement of all 42 historic windows.

- [NPS source photograph](https://npgallery.nps.gov/AssetDetail/c2cbfa0d-5436-43d1-a484-70cf4c270edf)
- [Church account and plaque dimensions](https://oldnorth.com/blog/set-in-stone-the-making-of-a-memorial/)

### USS Constitution

The Museum gives the mainmast as 172 ft above the spar deck. The old source
mistook 220 ft of mast timber for height above water. The new rig is corrected
to the museum's above-deck datum; fore and mizzen proportions remain derived,
not asserted as independent current measured heights.

Three bare-yard masts, hull sheer and tumblehome, white gun stripe, projecting
quarter galleries, fighting tops and lower shrouds remain. Additional topmast
shrouds, fore stays, backstays and a physically connected spanker boom replace
the skeletal upper rig and detached aft stick. The Museum's main fighting top
is 21 ft wide and 15 ft 4 in fore-and-aft; those dimensions replace the old
beam-derived platform.

The legacy six-transom-window interpretation describes a historical version.
The final reconstruction uses the NHHC/Museum text-supported modern contract:
three central transom windows plus two round portholes, and three six-pane
windows in each projecting quarter gallery. Three smaller windows at spar-deck
level are separately included above the captain's cabin band, as documented
by the NHHC historians' 2016 stern-repair account. The modern NPS reference
corrects the legacy gold treatment: black surrounds, dark gallery roofs and
restrained off-white mouldings and eagle relief replace the unsupported broad
gold bars. The eagle is a schematic spread-wing carving, not an exact sculptural
copy. Aperture sizes and positions are reconstructed, not a modern measured
survey or exact photographic record. Detailed cannons, every rope and every
boat are omitted.

- [Museum facts and mast datum](https://ussconstitutionmuseum.org/uss-constitution-facts/)
- [Museum mainmast and fighting-top dimensions](https://ussconstitutionmuseum.org/2023/05/01/uss-constitutions-main-mast-rig-repairs/)
- [Museum historical stern analysis](https://ussconstitutionmuseum.org/2017/02/03/the-quarter-galleries/)
- [Museum modern quarter-gallery work](https://ussconstitutionmuseum.org/2017/07/07/finishing-touches/)
- [NHHC historians on the three upper stern windows](https://ussconstitutionmuseum.org/2016/03/03/stern-repairs/)
- [NPS modern stern reference](https://www.nps.gov/npgallery/GetAsset/4b761b34-860a-4680-806b-280fc57088cf/proxy/hires)

### Bunker Hill Monument

The NPS published arithmetic is 208 ft 5 in of shaft plus a 13 ft pyramidion,
totaling 221 ft 5 in, with 78 shaft courses and six pyramidion courses.
The old source actually drew a 7 ft aboveground plinth plus 208 ft shaft plus
12 ft cap, totaling 227 ft despite a different header. The new monument
removes those invented exposed foundation steps. The 50 ft square foundation
is underground and is not modeled above the lawn. The first aboveground
course is 30 ft square, tapering to 15 ft at the cap.

Four near-top observation windows are present. Aperture sizes and exact sill
positions are scaled, not published; the 78 shaft joints represent the full
published height including mortar. The plaza elevation is 0.3 ft in the scene,
so the world apex is 221.7167 ft while monument height above its base remains
221.4167 ft. The lodge and small Prescott figure retain simplified geometry;
this preview does not certify their precise placement or sculptural anatomy.

- [NPS Bunker Hill by the numbers](https://www.nps.gov/articles/000/bhm-by-the-numbers.htm)

## Verification and review status

Builder checks are not independent architectural approval. Two adversarial
reviews and visual inspection of both sides are required before describing
any model as passed. The parent task owns that review loop and final ledger.

The geometry suite passed all nine Boston construction cases, unknown-key
rejection and the separate WTC case on 2026-09-12. Every generated attribute
is finite and the models supply usable source records and camera views.
At the latest numeric check, models use 18 to 30 merged meshes. The most
detailed Boston cases contain approximately 87,000 and 72,000 triangles;
small cases are approximately 2,500 to 11,000. These are structural checks,
not a substitute for phone GPU and visual testing.

The initial architecture review rejected most legacy shapes. Corrections
above were made in response, including the State House rear support, HABS
Paul Revere plan, Bunker Hill height, actual Old North and Old South steeple
silhouettes, missing dormers and the incomplete ship rig. Final critic scores
are not self-assigned here. Both independent final reviews now pass all nine
models as private architectural reconstructions. See the parent's
[delivery audit](architecture-preview-2026-09-12.md) for per-model verdicts,
retained front/rear screenshot evidence and explicitly remaining limitations.
