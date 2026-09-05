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

## The realism checklist, pass or fail

Sean, 2026-09-04, on the models the routine had not yet reached: "I love the
way of the built we have now for example capitol hill, however we need others
to be more realist too, some of them are still unacceptable."

He is right, and the reason is worth stating plainly, because it changes how
the rest of the queue gets built. The four heroes cost about 1.7 million
subagent tokens each, and what made them good was NOT the spend. It was that
they ended up with a list of real features. The Air and Space Museum, rendered
this day, is a plain grey box with no shadow. Old North Church is better,
recognisable even, and still flat: one brick tone, no cornice, no window
frames, no shadow. Neither is short of tokens. Both are short of a LIST.

So here is the list. Every model answers all nine before it is committed, and
a No is a defect to fix, not a note to file. This is cheap to satisfy once the
research is done, which is the whole point.

1. **Real counts drawn as real objects.** Columns as columns, each with a
   capital block. Windows as openings. Bays as bays. A column count in the
   header over a blank wall in the render is a FAIL, and it is the single
   most common one.
2. **Horizontal breaks.** Cornice, string course, water table, parapet, each
   as its own thin slab. One extruded wall running ground to roof is the
   shape of a box, whatever is written above it.
3. **A base.** Steps as a stack of shrinking slabs at the real count, or a
   plinth, or a podium. Nothing in this project sits straight on the lawn.
4. **A roof that is not just the top face.** Pitch, hip, dome on a drum,
   lantern, cupola, balustrade, chimneys. If the roof is a flat lid, say in
   the header that the building really has a flat roof, or fix it.
5. **Two tones per material, minimum,** through `ctx.shade`, warmer on the
   sunlit faces. Flat single-tone fill is what makes a correct model read as
   a cardboard mock-up.
6. **A ground shadow under every main mass.** Nothing here casts light, so a
   building without one floats.
7. **Heights TRUE,** and if the `dc-3d.js` place height disagrees with the
   published number, the place height is corrected. Four models have needed
   this already.
8. **Openings that survive map scale.** A window one tone off its wall
   disappears at 900 pixels. Give reveals real contrast or admit they are
   not drawn.
9. **The one thing a visitor names.** The Statue of Freedom. The grasshopper
   vane. The gold dome. The 36 columns. If a building is famous for a feature
   and the feature is not in the model, the model is not that building, and
   no amount of correct massing rescues it.

And then the step that is not on the list because it is not optional: LOOK at
it, from more than one angle, before it is committed.

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
- vietnam, the Vietnam Veterans Memorial (2026-09-04). Published, quoted in
  the file header: each wall "246 feet 9 inches long", "10.1 feet tall at the
  apex", "8 inches tall at their extremities", "meeting at an angle of 125
  deg 12 min", "72 panels, 70 listing names" per wall, granite "quarried in
  Bangalore, India" for its "reflective quality", a "two-acre" site
  (Wikipedia); the Three Servicemen "stand seven feet tall upon a base that
  is one foot tall" and "The 12-foot-by-8-foot flag flies from a 60-foot
  pole" (NPS / VVMF).
  ORIENTATION DERIVED AND CHECKED, not claimed: dc-3d.js already carries all
  three coordinates, so the "one wall points at the Monument, the other at
  the Lincoln" claim was tested rather than trusted. From the vertex the
  bearings are -135.16 and -9.52 degrees, an interior angle of 125.63,
  against a published 125 deg 12 min = 125.20. Half a degree apart on two
  independent sources. The arms are drawn on the derived bisector, split by
  the published angle.
  SCALE, the one deliberate departure from the other forms: the true apex is
  3.08 m, under dc-3d.js's 12 m MIN_H floor, so p.h arrives inflated about
  four times. Using it would have put a 1,900 ft wall on the Mall and made a
  ten foot wall read as a forty foot rampart. This form uses the true 0.3048
  m per foot and ignores the floor, because MIN_H exists to rescue memorials
  too small to see and a 493 ft long wall needs rescuing in plan not at all,
  while its height is the one thing that must not move. The place height h: 3
  was already the published 3.08 m and needed no correction.
  STYLE ADDED FIRST, per the standard: STYLES.md now carries "The wall in the
  ground", the earthwork idiom, because nothing in the book covered a
  memorial that is a CUT. Its tells are the ones this model is built on: the
  top of the wall IS the grade, the visitor descends rather than the stone
  rising, the far side is earth and has no elevation to draw, polished black
  reads by reflection not by shading, and the sculpture and flagpole stand
  apart and stand up.
  Named gaps: no published panel width (derived, 246.75 over 70 = 3.525 ft);
  no published wall thickness (coping drawn 2 ft); no published pathway width
  (10 ft); no dimensioned back slope (drawn as a 1 in 2.5 GRADE, not a
  width); no published position for the flagpole or the statue, only "a
  distance away"; no dimensions found for the Vietnam Women's Memorial, so it
  is not drawn at all.
  What LOOKING caught and arithmetic did not, four things, none of them
  visible in any count: (1) the back slope was a FIXED 30 ft apron beside a
  wall that runs from 10 ft deep to 8 inches, so it read as a green ramp of
  even width beside a wall that vanishes; a slope has a grade, not a width,
  and at 1 in 2.5 it now shrinks to nothing where the wall does. (2) the 24
  bank and walk segments abutted exactly and rounded apart under toFixed,
  leaving a ladder of pale stripes down the whole bank, which is the
  Hirshhorn ring's starburst arriving again; each segment now overruns its
  neighbour by a third of a segment. (3) THE WORST ONE: with the far arm's
  face correctly culled, its 2 ft coping was a black hairline ending in mid
  lawn and read as a scratch on the drawing rather than as a wall. From the
  uphill side a visitor really does see only a stone line, but they also see
  the shadowed SLOT beyond it where the cut falls away, and that is what
  gives the line weight; a narrow dark band on the far side of the coping now
  carries it, and nothing else is drawn, because nothing else is visible from
  there. (4) the site pad at 230 ft was shorter than the 246.75 ft arms, so
  the coping ran off it and the memorial sat on a pale rectangle of paper;
  the pad is now 300 ft in the host's own lawn tone, so the two grounds meet
  without a seam.
  OWED: the two adversarial critics did not fit inside this run's 25 minute
  ceiling. The four renders (yaw -0.55, -1.90, -2.15, -2.40) are what this
  build was verified on. First thing for the next run, worst first:
    a. the bank is now nearly the lawn's own tone once shaded, so the cut
       reads as walk-then-grass with no bank between. Either deepen EARTH or
       give the bank's top edge a line.
    b. the names are the memorial and nothing here says so. At map scale
       58,320 names cannot be text, but the face currently carries only a
       reflective wash and one joint every fifth panel. A close-up scene, or
       a legible inscription texture, is the honest next step.
    c. the flagpole and the Three Servicemen are placed on an assumption and
       read as unrelated objects on an empty lawn. Their real plaza and the
       grove around them are not dimensioned in any source reached; find the
       site plan or say so on the page.
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
- wwii, the National World War II Memorial (2026-09-04). Every dimension
  published, none guessed: plaza 337'-10" by 240'-2" sunk 6 ft below grade,
  pool 246'-9" by 147'-8", 56 pillars 17 ft tall and 4'-4" by 3' with an open
  centre and two bronze wreaths each on a bronze rope, two 43 ft pavilions
  23 ft square with four bronze columns, four eagles and a suspended laurel,
  Freedom Wall 84'-8" wide and 9 ft high on a 41'-9" radius carrying 4,048
  gold stars, ceremonial entrance 148'-3" wide, overall 384 ft pavilion to
  pavilion by 279 ft, Kershaw granite in the pillars and pavilions, Green
  County paving with Rio Verde and Moss Green accents, Academy Black and
  Mount Airy in the rebuilt pool (Wikipedia, National World War II Memorial;
  Friends of the National WWII Memorial, wwiimemorialfriends.org/design).
  ORIENTATION DERIVED, not guessed: the pavilions mark the midpoints of the
  north and south sides, so 384 ft is the north-south dimension, so the
  plaza's 337'-10" is too, and the pool's 246'-9" cannot lie east-west inside
  a 240'-2" plaza. That fixes every axis, and the resulting insets are 45.5
  and 46.2 ft, symmetric to within a foot. The Freedom Wall's arc centre at
  u = -97.75 falls out of the published 279 ft width the same way. The
  dc-3d.js place height was 5 m against a published 43 ft and was corrected
  to 13: heights TRUE.
  Named gaps: "17 feet tall" and "17' above grade" describe the same pillar
  two ways and cannot both hold over a plaza 6 ft down, so TALL was taken and
  the pillars show 11 ft above the lawn; no published pillar spacing (spread
  evenly between the published entrance opening and the published pavilion);
  no published size for the opening in a pillar; no dimensioned berm (drawn
  14 ft, checked against the 279 ft width); no published flagpole height so
  none is drawn; no published pavilion column size (2 ft square assumed); no
  published pool basin depth.
  What LOOKING caught and arithmetic did not, both of them fatal to the plan
  and invisible in every number: (1) the rim was drawn as a CLOSED ring of
  bank, so the 148'-3" ceremonial entrance's steps lay loose on the lawn like
  a jetty with a retaining wall between them and the plaza they descend into;
  (2) worse, the Freedom Wall's arc, correctly derived to bulge west past the
  plaza ellipse, hooped straight THROUGH its own colonnade and read as a gold
  ribbon floating inside the ring. Both are the same fault: an opening that
  is published as an opening had been drawn as a wall. The rim is now cut at
  both, with the alcove floored on the wall's own radius and a cheek holding
  the lawn back on each flank.
  OWED: the two adversarial critics did not fit inside the run's 25 minute
  ceiling. The two renders (yaw -0.55 and +0.75) are what this build was
  verified on. First thing for the next run, worst first:
    a. the ceremonial steps still read as a narrow ramp rather than a
       148 ft flight. They are five slabs across a 14 ft bank; no source
       reached this run gives a tread count or a ramp position, so either
       find the construction drawings or draw the published 24 bas-relief
       panels along the cheeks, which ARE published and are missing here.
    b. the opening in each pillar, which is the pillar's whole idea, does not
       register at map scale: the legs and the slot are drawn but read as one
       solid stick. Widen the slot or drop the legs' tone.
    c. the pavilions read as gazebos rather than triumphal arches. The four
       eagles and the laurel are blocks. Nothing is published about their
       form beyond the count, so this is a modelling problem, not a research
       one.
    d. the Rainbow Pool is one flat sheet. The published semicircular
       fountains at the pavilion bases and the waterfalls flanking the wall
       are drawn as flat water patches and do not read as either.

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

- dcwar, the District of Columbia War Memorial (2026-09-04). Published, every
  figure read this run: "47-foot (14 m) tall circular, domed, peristyle Doric
  temple", platform "43 feet 5 inches (13.23 m)", "4-foot (1.2 m) high"
  marble base, twelve "22-foot (6.7 m) tall" "fluted Doric marble columns"
  (Wikipedia, District of Columbia War Memorial); overall diameter 44 ft and
  each column "3 feet 10 inches in diameter", Vermont marble from the Danby
  quarry (NPS, "Building the District of Columbia War Memorial"). Designed as
  a BANDSTAND, which is why the platform is a floor and not a plinth and why
  nothing stands on it. The place height h: 14 already WAS the published 47 ft
  and needed no correction; true 0.3048 m per foot throughout.
  STYLE NAMED FIRST, per the standard: the Greek Doric monopteros. STYLES.md
  does not carry it and this run may not edit that shared file, so the five
  tells the model is built to are restated in the file header and the STYLES.md
  entry is OWED: no walls at all and the far columns visible through it; Doric
  means no column base; the entablature is two bands, architrave then an
  oversailing cornice; a shallow saucer dome, never a hemisphere; a stepped
  stylobate.
  DERIVED IN THE OPEN, because the two published diameters differ by 7 inches
  and something had to reconcile them: column CENTRES on a 19.79 ft radius, so
  their outer faces reach 21.7 ft, giving the published 43'-5" platform and a
  44 ft temple measured to the column face.
  Named gaps: no published step count or riser (three, 8 in, classical); no
  published entablature depth (2 + 1.5 taken out of the 47 ft remainder); no
  published dome rise or profile; no published statement that the Doric frieze
  carries triglyphs, so none is drawn; no published inscription band height.
  What LOOKING caught and arithmetic did not, three things, none of them
  visible in any count: (1) the dome sprang straight off the cornice at the
  full 22 ft radius and, with six rings in ALTERNATING tones, a correctly
  budgeted 13 ft saucer read as a stepped beehive on twelve stumps; it now
  springs inside a low attic ring, in ONE tone, over ten fine rings. (2) the
  cornice at 1.055 x the architrave did not oversail enough to read as its own
  slab and merged into the dome mass; 1.10 separates them. (3) THE WORST ONE,
  and only the low camera showed it: at a 27 ft outermost tread the stylobate
  stood 5 ft proud of the 43'-5" platform and HID the 4 ft base completely, so
  the 499 names, which are the entire memorial, had nowhere to be; the steps
  now finish just outside the platform and the inscribed base reads.
  OWED: the two adversarial critics did not fit inside this run's 25 minute
  ceiling. The four renders (yaw -0.55 pitch 0.30 before and after the dome
  fix, yaw -2.10 pitch 0.22 before and after the stylobate fix) are what this
  build was verified on. First thing for the next run, worst first:
    a. the ngon-stack dome still shows ten bright annular top faces and reads
       as ribbed rather than smooth. This is the shared dome idiom, so the fix
       belongs in the helper, not here: interpolate the shade across each ring
       or suppress the top face of every ring but the crown.
    b. the columns are eight-sided prisms and the word "fluted" is carried
       only by the per-face shading. At map scale that is honest; in a close-up
       scene it will not be.
    c. no source reached this run says whether the Doric frieze carries
       triglyphs. It is drawn plain. Find an elevation or a HABS sheet
       (loc.gov/pictures/item/dc1019, HABS DC-857, six sheets) and settle it.

## Researched this run, NOT built, for the next run to pick up

- american, the National Museum of American History. The research is done and
  is recorded here so the next run does not pay for it twice.
  MEASURED this run from OSM way 445808462 through Overpass: 151.2 m by 68.9 m
  = 496 ft by 226 ft, an almost pure rectangle, tagged height 20.5 m. The
  dc-3d.js place height is 24 and should be CORRECTED to 21, with the honest
  caveat that 20.5 m is an OSM tag, not an architect's figure, and no published
  height was found in any source reached.
  PUBLISHED: about 750,000 sq ft over a basement, three exhibition levels, two
  collection levels and a mechanical penthouse; designed 1955-1964 by McKim,
  Mead and White / Steinman, Cain and White, Walker O. Cain the architect;
  walls are precast concrete panels faced in pink Tennessee marble sandblasted
  to a uniform surface; the building sits on a broad platform base and carries
  "modernist shadow cornices" (Smithsonian Institution Archives; SAH
  ARCHIPEDIA DC-01-ML14).
  THE FACADE, which is the whole model and is published in words: "regularly
  spaced, rectangular slabs of wall set vertically that rise from the podium to
  the cornice line are treated as a modern equivalent of columns", "held away
  from the inner wall by vertical windows of solar gray glass, creating the
  alternation of light and shade associated with columnar architecture"; the
  building was "conceived as a modern rendition of a peripteral temple on the
  model of the Lincoln Memorial"; its "compact rectangular mass culminates in a
  recessed attic story"; "the building's broad terrace seen from the Mall
  serves as the roof of a full-story level set against the embankment fronting
  on Constitution Avenue" (SAH ARCHIPEDIA).
  THE GAP THAT BLOCKED THE BUILD, and it is exactly the one checklist item 1
  cares about: no source reached this run gives the NUMBER of marble piers or
  the bay module. Three sources were tried and none has it. The NCPC west
  facade modification recommendation, file 7156, October 2010, is a scanned
  PDF that WebFetch could not read and is the most likely place for an
  elevation:
  ncpc.gov/docs/actions/2010Oct/National_Museum_American_History_West_Facade_Modification_Recommendation_7156_October2010_.pdf
  Get that PDF read, or find the HABS sheets, before building. Drawing the
  piers on an invented module would put a guessed count in the model's most
  prominent feature, and drawing no piers at all would leave a marble box,
  which is the exact failure Sean called unacceptable.

- bunker-hill, the Bunker Hill Monument (2026-09-04), the first trail stop
  rebuilt, and the run that gave the trail the dc-form mechanism: a stop now
  registers window.TRAIL_FORMS[k] from its own trail-form-<k>.js and takes
  over from the SCENES entry in trail-3d.js, resolved at DRAW time because
  the form files load second. Helpers are exported on TRAIL3D.helpers.
  Published, quoted in the file header, all from the Wikipedia article which
  cites the NPS and the Boston Landmarks Commission: "221 feet (67 m) from
  its base", "about 30 by 30 feet" at the footprint "tapers to 15 by 15 feet
  near the top of the shaft", "78 courses, each measuring 2+2/3 feet", walls
  "6 feet at the bottom to 2 feet at the top", the pyramidal top
  "12-foot-tall" of "five courses" with a capstone "3.5 feet high", a
  foundation "50 by 50 feet" and "12 feet deep" in "six courses"; the 1902
  Lodge "50 by 38 feet across and 19 feet tall", "three by four bays", "gray
  Deer Isle granite", an "Ionic-style portico" east and a "cast iron door
  with two rosettes"; the Prescott statue "about 8 feet" of bronze.
  ARITHMETIC DONE, NOT ASSUMED: 78 x 2+2/3 = 208.0 ft of shaft, + the 12 ft
  top = 220, against a published 221 from the base, so one foot of plinth
  shows and the numbers close.
  Named gaps: no column count for the portico (drawn DISTYLE, the fewest a
  portico can have, and labelled a derivation); no window sizes (openings
  sit on the published bay grid and nowhere else); no roof form for the
  Lodge (drawn flat behind a parapet, and said out loud per item 4); no
  published position for the statue.
  What LOOKING caught: (1) at the site's default yaw the visible faces are
  +y and -x, so the east portico, the Lodge's one distinctive feature, is
  CULLED; verified from a second angle where its two columns, entablature
  and dark door all read. (2) The 260 ft grass pad, not the monument, was
  setting the frame, because the trail renderer fits to everything including
  the ground; shrinking it to 190 nearly doubled the monument on the page
  without touching a published dimension. (3) The 78 course joints are what
  turn a taper into 221 feet of stone; without them the shaft has no scale.

- old-north, Christ Church in the City of Boston (2026-09-04). This file
  named it: "better, recognisable even, and still flat: one brick tone, no
  cornice, no window frames, no shadow." The massing was already right and
  is KEPT unchanged; what was added is checklist items 2, 5, 6 and 8.
  Published, quoted in the header: main building "96.5 by 51.5 feet", nave
  "about 70 by 51 feet ... about 42 feet high", apse "20 by 23.5 feet", the
  spire "191 feet above ground", foundation "rubblestone", tower walls
  "3.5-foot-thick brick", upper walls "English common bond, generally
  measuring 2.5 feet thick", "gable roof with slate shingles", "42 windows
  with over 2,000 panes" in "two levels of arched sash windows", a belfry of
  "157 or 159 steps" with eight bells cast in 1744.
  ADDED: a stone water table where the rubblestone foundation meets the
  brick, a belt course between the two window tiers, a wooden cornice under
  the eaves, a stone band and a cornice on the tower and on the belfry, a
  ground shadow, granite steps at the door, and a light stone SURROUND
  struck round every opening before the dark glass is struck inside it,
  which is item 8 and is the difference between a Georgian window and a
  stain. The brick got its second tone as faint course banding, a texture
  and not a count.
  HONEST SHORTFALL, named rather than invented: 42 windows are published and
  36 openings are modelled (24 on the nave walls, 4 on the tower, 8 on the
  apse end, plus the door). The six unaccounted are not added to a wall that
  may not have them.
  What LOOKING caught: the front door and the whole entrance front are
  CULLED at the default yaw, the same trap Bunker Hill sprang the same run,
  so both models were checked from the opposite side. Two angles is not a
  formality on this renderer; it is the only way to see half the building.
