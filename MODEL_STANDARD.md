# The model standard

Sean, 2026-09-03, on the first National Mall models: "the 3D model needs to be
realist, the one you have is unacceptable." On the rebuilt Capitol, Lincoln,
Jefferson and Washington Monument: "now it looked better, I might need this
design style apply to all other design. this is the attitude."

This file is the attitude, written down so it survives the session that
produced it. It applies to every model on the site: the Freedom Trail stops,
the New York landmarks, the Met and MoMA, the Mall, and anything the landmark
routine builds from now on.

## The standard is a method, not a look

Every building goes through four steps, in this order. Skipping one is how
the first Mall models happened: correct in every number and still not the
building.

### 1. Research first, with a source behind every number

Before a line of geometry: column count and order (Doric, Ionic,
Corinthian), entablature, steps, drum and dome diameters, wings and porticos,
materials and their colours, and the distinctive things a visitor actually
sees from the street. The Monument's stone colour change at 150 ft. The
Lincoln's 36 columns. The Capitol's Statue of Freedom.

Every number carries a URL. A number that is not published is left out and
named as a gap in the build report. It is never guessed and never
"approximately right".

### 2. Build only from those facts

- The real number of columns, as columns, each with a capital block.
- Entablatures and cornices as separate thin slabs, not a taller wall.
- Steps as a stack of shrinking slabs with the real count.
- The drum under a dome, with its own colonnade if it has one.
- Wings and porticos where they exist, and nowhere they do not.
- Two tones per material through `ctx.shade`, a warmer tone on the sunlit
  faces; real materials: marble, sandstone, granite, bronze.
- A ground shadow under every main mass. Nothing in this renderer casts
  light, so a building with no shadow floats.
- Heights TRUE. Never exaggerated. The first Mall model multiplied every
  height by six and turned a ten-to-one obelisk into a knitting needle.

### 3. Render and look

`node render_room.js dc:only-<k> -0.55 0.30 > /tmp/x.svg && qlmanage -t -s 800
-o /tmp /tmp/x.svg`, then Read the PNG. From more than one angle, because the
far side is culled and the front bay of a temple only shows from the front.

Arithmetic passes what eyes catch. Face counts, bounding boxes and
finite-geometry checks have all passed models with a floor painted over the
whole room, a glass wall covering a temple, a square dome on a round
building, and an inner block painting through its attic. Looking caught every
one of those.

### 4. Adversarial review, then a fix loop

The builder never certifies its own work. Two independent critics, each
prompted to REFUTE realism:

- an architecture critic, comparing the render against the facts and the real
  building: massing, proportion, column count, distinctive features;
- a rendering reviewer, hunting faces painting through faces, floating parts,
  missing shadow, wrong culling, flat unshaded looks.

A score under 7.5 or any blocking issue goes back to a fix agent with the
issue list; up to two rounds. A model passes when the refuters fail to refute
it, not when the builder is satisfied.

## The mechanics

- One file per building: `dc-form-<k>.js` registers
  `window.DC_FORMS[k] = function (ctx, p, s, VE) { ... }` and is loaded after
  the host renderer. Several can be built at once without touching each
  other.
- Helpers live on `window.DC3D.helpers`: `prism`, `ngon`, `dome`,
  `colonnade`, `pyramid`, `shadow`, `depthOf`, and the palette `C`.
- The painter's trap, met eight times in this project: a large slab's nearest
  corner sits farther than the nearest corner of anything smaller under it,
  so it paints first and the thing beneath shows through. Every slab that sits
  on something gets an explicit depth.
- The workflow that encodes all four steps is `realistic-mall-models`
  (research, build, verify, fix). Reuse it; do not hand-roll a cheaper
  version.

## Cost, honestly

Four buildings took about seven million subagent tokens and hit the account's
spend limit once, part-way through review. Batch the work, four to six
buildings at a time, and never run two of these workflows at once. A run that
dies in the review phase leaves builds on disk and no verdicts, and a result
with zero verdicts reads as "passed" unless you check.

## Rebuilt to this standard

Each run rebuilds one building and adds it here, so the next run does not
repeat it. A name on this list has a `dc-form-<k>.js` (or the equivalent
scene file) and has been LOOKED at from more than one angle.

- capitol, lincoln, jefferson, monument (2026-09-03, the four heroes)
- castle, the Smithsonian Institution Building (2026-09-04). Plan measured
  from OSM relation 7393969 through Nominatim: 444 ft by 156 ft, five masses
  and nine towers read off the polygon. Four tower heights published in the
  National Register nomination via Wikipedia: south principal 91 ft and 37 ft
  square, taller north tower 145 ft, northeast campanile 117 ft and 17 ft
  square. Named gaps: no published overall length, no published height for
  the second north tower or the five small ones, no published eave heights.
  The adversarial critic round did not fit inside the run's 25 minute
  ceiling and is owed; the two renders are what the build was verified on.
- nmaahc, the National Museum of African American History and Culture
  (2026-09-04). Published: 85 ft high, three-tiered inverted step pyramid,
  corona angled at 17 degrees to match the Washington Monument's capstone,
  3,600 bronze-coloured cast-aluminium panels 4 by 5 ft at 65 to 95 percent
  solid, 200 ft long-span porch over the main entrance, 350,000 sq ft on 5
  acres, five storeys above and five below (Wikipedia; Metal Architecture,
  "Architectural Crown Jewel"). Plan measured this run from OSM way
  398810868 through Overpass: 200 ft by 201 ft, effectively a square with
  the north east corner cut back; OSM way 898560007 puts the porch on the
  SOUTH face, 192 ft by 41 ft, tagged height 7 m.
  Named gaps: no published corona base height (drawn 15 ft), no published
  individual tier heights (85 less 15, divided in three), no published step
  back between tiers (drawn 3 ft), no published glass set-back behind the
  screen (drawn 8 ft), no published porch projection or column count (OSM
  trace, five columns), no dimensions found for the water feature or berms
  so none is drawn. The dc-3d.js place height was 32 m against a published
  85 ft, and was corrected to 26: heights TRUE.
  What LOOKING caught and arithmetic did not: (1) an inverted pyramid
  overhangs everything below it, so every horizontal ledge on the FAR side
  is hidden in life, and drawn it was not hidden here, its inner edge sorts
  nearer than the roof's far edge and it painted two concentric rectangles
  straight onto the roof; ledges are now culled by the same test the walls
  use. (2) the 4 by 5 ft panels drawn as seams every 20 ft in a shadow tone
  turned a perforated bronze screen into a brick wall; one faint joint every
  25 ft, one tone off the face, reads as a screen. (3) the porch begun at
  the corona's outer edge started 23 ft in front of the ground storey it
  shelters and floated like a jetty; it now runs from the glass facade.
  (4) at northern yaws the porch sat on the far side and its inner half,
  lying under the roof overhang, painted a pale sliver across the roof: the
  whole porch is now gated on the south face being toward the camera, which
  is the Hirshhorn balcony's lesson arriving a second time.
  OWED: the two adversarial critics did not fit inside the run's 25 minute
  ceiling. The four renders above are what this build was verified on. First
  thing for the next run, worst first:
    a. the porch is the weakest part of the model. From the south it reads
       as a boardwalk on fence posts rather than a 200 ft canopy: the slab
       is 3 ft thick over an 87 ft span, the five columns are 6 ft square
       assumptions, and nothing published was found for either. Either find
       the architect's section or reduce it to a canopy against the facade.
    b. the roof is the largest surface in the model and carries nothing.
       Photographs show mechanical plant and a distinct parapet; neither is
       published in a source reached this run, so it is flat grey.
    c. the corona is a SCREEN standing off a glass wall, and here it is a
       solid envelope. Nothing of the wall behind shows through, which is
       the one thing the published porosity range describes.
- hirshhorn, the Hirshhorn Museum and Sculpture Garden (2026-09-04). Every
  dimension published in Wikipedia's technical section: 231 ft outer
  diameter, 82 ft high, elevated 14 ft on four piers, 115 ft interior court,
  60 ft fountain, precast Swenson pink granite aggregate. The windowless
  outer wall and the third-floor balcony facing the Mall are published in
  aviewoncities.com's description. Named gaps: no published pier plan or
  size, no published floor levels inside the drum, no published balcony
  width, no published statement that the court is concentric.
  What LOOKING caught and arithmetic did not: the balcony ledge was being
  drawn right around the building; the balcony's jambs were culled with one
  sign for both ends, leaving lawn visible straight through the wall; the
  jambs then sat on the nominal arc rather than on the segment boundary the
  wall actually stops at, leaving a thinner sliver of the same hole; and
  three courses of banding on a published WINDOWLESS wall made an 82 ft
  drum read as a tyre.
  OWED, from the architecture critic, which returned after this run's 25
  minute ceiling and so got no fix round. It scored the model 5 of 10 and
  could not refute the arithmetic; every defect it raised is in the PICTURE.
  Two were corrected on the spot because they were number-honesty faults
  rather than build work: the header claimed 26 ft piers while the code drew
  34 ft, and the plaza was drawn at 1.62 acres under a header citing 2.7.
  The rest stand for the next run, worst first:
    1. the 14 ft lift still does not read. The dark under-drum ring is
       tonally continuous with the shadow outside it, so void and shadow
       merge into one plinth. Draw the ring's SOFFIT at z=14 as its own
       bounce-lit plane and let plaza colour, not a dark ring, fill the
       0 to 14 band.
    2. the piers can never break the silhouette: at RP 86.5 with half-width
       17 their reach is 103.5 ft, inside R 115.5, and their tone is nearly
       the under-drum's. Lighten them and let one read against the void.
    3. per-segment flat shading puts 44 vertical bands on a wall published
       as blank, which is the same tyre the reveals made. Interpolate the
       shade across each facet or compress the shade range.
    4. abutting ring quads round apart under toFixed(1) and leave a
       starburst of pale seams on the roof. Overlap each segment slightly.
    5. at some yaws the recess and its jamb paint outside the silhouette:
       the jamb normal is flipped until faceVisible passes, which can select
       a face that should be occluded. Suppress the whole recess when its
       arc faces away.
    6. the courtyard is glazed as two ribbons, but the source says "large
       rectangular windows". Cut them into per-segment lights, or move it
       into the named gaps.
    7. the coping band is too faint to register at map scale.
  The rendering reviewer reported after that, also 5 of 10, and its worst
  finding was a defect this run's own jamb fix had CREATED: on the far side
  of the drum the recess back wall and jambs, carrying biases larger than a
  ring segment's depth spread, painted straight through the roof and left a
  dark rectangle marooned on the top face at two of six angles. That earned
  the single fix round the standard allows, and it is fixed: the whole
  balcony assembly is now gated on the Mall face being toward the camera and
  every bias is small. Its light leak is fixed too, a hard white arc of
  plaza tone showing through the 14 ft gap at the wall base. Both verified
  at the two angles that showed them.
  STILL OWED, and the two critics agree on the first two:
    a. the piers are tonally invisible: measured 104,95,88 against the
       under-drum's 97,92,86, seven levels out of 255, and their reach of
       103.5 ft is inside R so they can never break the silhouette. Lighten
       them, give them a top face, and the lift will finally read.
    b. the 14 ft lift still does not read as air. Draw the ring's SOFFIT at
       z=14 as its own bounce-lit plane.
    c. the courtyard's inner wall is the BRIGHTEST surface in the model,
       because outward=false hands ctx.shade a normal pointing at the
       camera, so a 96 ft shaft is lit like a sunlit facade. Needs an
       explicit occlusion multiplier deepening toward the base.
    d. per-segment flat shading puts 44 vertical bands on a wall published
       as blank, and stroke=fill leaves a 44-spoke starburst of seams on the
       ring top. Interpolate the shade, drop the stroke, overlap slightly.
    e. the courtyard is glazed as two ribbons where the source says "large
       rectangular windows". Cut into per-segment lights or name it a gap.
    f. the shadow ring is concentric, i.e. sun at the zenith, while the
       walls are directionally lit. Offset it away from the light.
    g. the plaza disc's polygon corner reads as a sheet of paper under the
       model at some yaws; the coping is too faint to register.
