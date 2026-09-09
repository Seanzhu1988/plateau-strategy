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

- **Ask the machine first.** `python3 model_audit.py` lists every model that
  ships, checks it against the five items a machine can read (2, 3, 4, 5, 6)
  and the two it can read weakly (1, 8), reads this file's ledger and OWED
  list, and prints the table worst first. `--owed` shows only what is not
  finished; `--strict` exits 1 if any shipped model fails a checkable item,
  which is the hook for the routine. Items 7 and 9 are NOT checked, because
  no machine here knows the published height or what a visitor names, so a
  clean row means the checkable half passed and nothing more. Only step 4
  closes a model. [SEAN 2026-09-08 "apply to all build"]
- **Declare what does not apply, in the file.** A wall cut into the ground
  has no roof; an obelisk has no cornice; a ship has no string course. Item 4
  already says to write that in the header. The machine-readable form is one
  line in the file's comment header, reason required:
  `MODEL_STANDARD_EXEMPT: 4 the memorial is a cut into the ground, no roof`
  Seven models carry these as of 2026-09-08. An exemption with no reason is
  not an exemption.

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
- PDFs ARE READABLE, and three runs were blocked believing they are not.
  `osascript -l JavaScript pdftext.js FILE.pdf` prints every page. It goes
  through macOS PDFKit over the JXA Objective-C bridge, so nothing is
  installed and nothing is fetched. pdftotext, mutool and gs are all absent
  on this machine and none of them is needed. An empty page means that page
  is a scan with no text layer, which is an answer too: that one needs an
  image route.

## Cost, honestly

Four buildings took about seven million subagent tokens and hit the account's
spend limit once, part-way through review. Batch the work, four to six
buildings at a time, and never run two of these workflows at once. A run that
dies in the review phase leaves builds on disk and no verdicts, and a result
with zero verdicts reads as "passed" unless you check.

## Claimed right now, so two builders do not build the same thing

[SEAN 2026-09-04: "national ameican history museum, african american museum,
also needs realistic redesign, after that do all boston and others".]

A live session is working these through the full four steps, including the
adversarial review the routine's 25 minute ceiling cannot fit. The landmark
routine must SKIP anything listed here and take the next unclaimed item in its
queue instead. Remove a line the moment its work lands or is abandoned.

- eeob and loc, BUILT AND REVIEWED 2026-09-08 (dc-form-eeob.js, dc-form-loc.js):
  the Library of Congress passed two architecture rounds (5.5 then 8.5, no
  blocking) and a rendering review (8.5, no blocking); the EEOB went 4, 6.5,
  5.5 and 5.5 across FOUR architecture rounds, each round's blocker a
  different one (columns sub-pixel; a roof taper inverted by a 6 ft
  projection; bare pavilion return faces; cornice bands painting across the
  slate at a NEAR depth), each fixed and the fix looked at from the angles
  the critic named, but the last fix was NOT put to a fifth refuter: the
  model stands on the builder's eye for that one, and the header says so.
  Honest reading: the refuters never ran out of things to find; the last
  score with everything fixed is unknown, and a later session with budget
  should run one more round before calling it passed. Two lessons
  worth more than the buildings: (1) a polygon whose corners are listed
  (low, high, high, low) is a LINE, and the drum windows of the Library were
  invisible until a critic counted them; (2) an inset on a taper must be
  clamped to the mass it sits on, or a shallow projection turns its roof
  inside out. Claims released.

- indian, rebuild in progress. LAWNC was undeclared so the form threw on every
  draw and the museum was never drawn at all; that is fixed and committed. The
  roof still reads as a flat mesa from above, a landscape tree paints on top of
  it, and the cantilevered entrance overhang aimed at the Capitol is missing.
- nmaahc, rebuild queued. The file's own header is right and its geometry does
  not implement it: 126 drawn items, no screen, no porch, no visible inversion.
  The corona is a SCREEN of 3,600 panels at 65 to 95 percent porosity standing
  off a glass wall at 17 degrees, which is the Washington Monument's capstone
  angle, and the entrance is on the SOUTH face under a 200 ft porch.
- the Met INTERIORS, met-rooms.js, are the landmark routine's lane as of
  2026-09-06: islamic, medieval and arms-armor are done, and greek-roman,
  lehman, grand-stair, euro-paintings and nineteenth-century remain as
  object-in-a-box LANDMARKS entries. A live session taking one of these
  should claim it here first.

- THE MET INTERIOR QUEUE IS DOWN TO FOUR, established 2026-09-09 by the
  landmark routine, which spent its run resolving the queue and researching
  the next room rather than building. Everything else in the routine's queue
  is finished: the Mall's 16, the Freedom Trail's 9, NYC's 3, the Met exterior
  and MoMA all have form files and ledger lines, and greek-roman, lehman,
  grand-stair, euro-paintings and nineteenth-century have since been done, so
  the note above is stale on those five. What is left in met-rooms.js, all of
  it PRE-STANDARD: astorCourt, dendur, greatHall. americanCourt was done
  2026-09-09, so THE MET INTERIOR QUEUE IS DOWN TO THREE. `modern` and
  `grand-stair-2` are not work: grand-stair-2 is the same grandStair function
  that was done 2026-09-06, and modern is the honest skip the routine's own
  queue allows.

- american-court, the Charles Engelhard Court, BUILT AND COMMITTED 2026-09-09
  by the landmark routine. The claim below is released. THE BLOCK IS CLEARED
  AND THE PREVIOUS RUN'S PLAN WAS WRONG: it said to read the Dimensions field
  off the Met object page through the browser pane. The page loads fine
  through the pane, and it HAS NO DIMENSIONS FIELD AT ALL. Its Overview lists
  title, architect, date, geography, culture, medium, credit line, object
  number and department, and stops. No future run should spend itself there.
  WHAT UNBLOCKED IT INSTEAD: Stokes, Iconography of Manhattan Island, plate
  1825-F-25 (Deak 343), whose own engraved caption is the dimension, "Branch
  Bank of U. S. erected 1825 - front 75 feet". Two independent witnesses to
  the same 75 ft, an Alamy listing of the Stokes plate and the NYPL Digital
  Collections scan of it, Hades-118424-54550, which is on Commons and which
  turned out to be a near-ORTHOGRAPHIC ELEVATION of the exact facade. So the
  one published number arrived with a measured drawing attached to it.
  THE METHOD, and it is the park-street method: the 75 ft front spans image
  x 576 to 3200 in the 3840 px Commons rendering, which is 35.0 px per foot,
  and every other dimension is SCALED off that plate at that rate and declared
  scaled, never quoted as published. Ground line y 2696, first-floor cornice
  y 1960 giving a 21.0 ft ground storey, main cornice y 1200 giving 42.7 ft to
  the eaves, pediment apex y 928 giving 50.5 ft overall, projecting centre
  x 1344 to 2440 giving 31.3 ft or 3 of the 7 bays, and the four columns at
  x 1496, 1800, 2096, 2376.
  ONE PUBLISHED COUNT CAME FROM AN UNEXPECTED PLACE, and it is worth the note
  for every future Met room: the AUDIO GUIDE transcript is on the object page
  and it is curatorial prose. Met audio 3801, Morrison Heckscher, says "on the
  second-floor level, four columns in the Greek Ionic order support a simple
  triangular pediment". That settled both the count and the fact that they do
  NOT run the full height. The old model had eight full-height stubs.
  ALL SEVEN FAILING CHECKLIST ITEMS ARE PAID. Item 1, four columns as four
  columns standing clear of the wall with shafts, bases and capitals in three
  tones. Item 2, two storeys with the string course at 21.0 ft that the
  published "two-story" fact demands and the old single colossal storey had
  nowhere to put. Item 3, a plinth and four treads under the arched door.
  Item 5, two marble tones plus a darker reveal struck into every opening.
  Item 6, a ground shadow. Item 9, the court itself: a glass roof and a piece
  of sculpture, so a visitor can tell they are standing in a glassed courtyard.
  The pediment is seated ON the projecting centre and its entablature instead
  of set back behind it, which is what made it float.
  WHAT THE PICTURE SHOWED AND THE NUMBERS DID NOT, twice, on one run. First,
  the glass roof drawn as a FILLED pale plane was opaque and the size of the
  room, so the court read as a swimming pool with a model standing in it; the
  cure was to draw only the lattice members and leave the openings empty,
  rather than to give the plane a depth. That is the sixth time a large flat
  surface has wrecked what it sits over in this file and the FIRST time the
  answer was not a depth argument. Second, the court was drawn to the room box
  while the facade was drawn at true foot scale, and since the room box is
  about five times the facade's width in feet, the building shrank to a chip
  in a field. The court is now an envelope in FEET around the 75 ft front,
  96 by 74, declared an envelope and claiming no size. Neither defect is
  visible in any count and both survived node --check.
  NAMED GAPS, carried in the file's own header: no published height, storey
  height, bay module, column diameter or step count exists anywhere this run
  could reach, and no published dimension for the Engelhard Court itself.

- american-court, the Charles Engelhard Court, CLAIMED 2026-09-09 and NOT
  BUILT. Researched, looked at, diagnosed, and deliberately left alone,
  because the one number the build needs is not published anywhere the run
  could reach and this standard's first rule is real dimensions or do not
  build it.
  WHAT THE RESEARCH SETTLED, and it is enough to build the counts from. The
  object in the court is the facade of the SECOND BRANCH BANK OF THE UNITED
  STATES, Martin Euclid Thompson, Wall Street, built 1822 to 1824, demolished
  1915, the facade saved by Met president Robert de Forest and installed 1924
  as the south entrance of the new American Wing, later absorbed into the
  Engelhard Court. Published and countable: it is a TWO STOREY, SEVEN BAY
  facade with a PROJECTING CENTRE SECTION CAPPED BY A PEDIMENT, in marble,
  with IONIC capitals and Greek cornice mouldings over a mid eighteenth
  century English Palladian composition rather than a Greek Revival one.
  Source: the Met's own object page for the facade, object 852570, and the
  Met's 2009 American Wing press release.
  THE NAMED GAP, and the reason the run stopped. No published height, width
  or bay module was reachable. The Met object page carries a Dimensions field
  and would settle it, but metmuseum.org returned HTTP 429 to this sandbox and
  the collection API returned an empty record for 852570. The next run should
  try the object page THROUGH THE BROWSER PANE, which is the same door that
  unblocked the american museum photograph, and read the Dimensions field
  there. Until that number exists the facade must not be given a size.
  WHAT THE PICTURE SHOWED AND THE NUMBERS DID NOT. The current room renders
  as one grey slab on an empty floor, and seven of the nine checklist items
  fail in a way no count in the file reveals. The header says seven bays and
  the render does show seven, so item 1 half passes and then breaks: the
  columns are stubs stuck to the wall face reading as pilasters, and their
  capitals are the same tone as their shafts. The pediment FLOATS. It is set
  back from the projecting centre it is supposed to cap, so it and the
  entablature slab under it read as two bars hanging behind the columns with
  daylight between them and the thing they rest on. Item 2 fails outright:
  the facade is drawn as ONE colossal storey when the published fact is two
  storeys, so there is no string course and no horizontal break anywhere.
  Item 3 fails, it sits straight on the floor with no plinth or step. Item 5
  fails, the whole facade is a single grey. Item 6 fails, no ground shadow,
  which is why it floats in the picture. And item 9 fails for the ROOM rather
  than the object: the Engelhard Court is a glassed courtyard and the render
  has no court, no glass roof and no sculpture, so the one thing a visitor
  names is absent.
  SO THE NEXT RUN'S ORDER OF WORK IS FIXED: get the Dimensions field through
  the browser pane, then two storeys with a string course between them,
  then the pediment seated on the projecting centre instead of behind it,
  then plinth, two marble tones, and a ground shadow.

- american, BUILT AND COMMITTED 2026-09-07 by the landmark routine as
  dc-form-american.js. The claim is released; the entry below is kept because
  six runs of dead ends are worth more written down than deleted, and because a
  future run with a more frontal photograph should re-check the slot list.
  BLOCKED A FOURTH TIME, 2026-09-06, but the block MOVED, and the next run
  starts a long way past where the last three did.

  THE PHOTOGRAPH ROUTE IS OPEN. The third run recorded it as shut because
  upload.wikimedia.org returns a block page to this sandbox's curl. It is not
  shut; it was the wrong door. Through the BROWSER PANE:
    https://commons.wikimedia.org/wiki/Special:FilePath/<FILE NAME>?width=3840
  loads and renders. Do not guess a /thumb/x/xx/ hash path, that is a 404, and
  do not ask for a non-standard width, that is a 400. Better still, a Wikimedia
  image document is SAME ORIGIN as its own img element, so
    var img=document.images[0]; c.width=3840; c.height=2160;
    ctx.drawImage(img,0,0); ctx.getImageData(x,y,w,h)
  works, and the facade can be MEASURED in pixels rather than eyeballed. Draw
  into a canvas and replaceChildren(canvas) in ONE javascript_exec call to look
  at a magnified crop; two calls loses the image, because clearing the body
  destroys it. The pane is hidden, so scroll and hover time out: screenshot,
  get_page_text and javascript_exec all work, and computer zoom does not crop.

  THE PHOTOGRAPH: "National Museum of American History - 2026
  (55256384290).jpg" from Category:Architecture of the National Museum of
  American History, 8375 x 4711, a near-frontal Mall facade in low sun.
  MEASURED IN IT at width=3840, so the next run does not re-derive the frame:
  sky meets roof at y=658; the RECESSED ATTIC STOREY is the band y=660 to 735,
  visibly set back with its own shadow line, which confirms the SAH prose;
  the main facade is y=740 to 1040; trees intrude below y=1050 and below y=900
  at the left, so the only clean scanline is y=780 to 800. The facade spans
  x=672 to 3264, and against the published 496 ft that is 5.23 px per foot.
  The two DEEP end recesses sit at x=784-806 and x=3102-3124, symmetric about
  x=1954, which is how we know the shot is square enough to count from.

  BLOCKED A FIFTH TIME, 2026-09-07, by the landmark routine, and two more
  routes are now closed for good so a sixth run starts past them.
    g. NCPC file 7156 WAS READ THIS RUN, in full, six pages. The three
       previous runs recorded it as unreadable; it is not, see pdftext.js
       below. It carries NO pier count, NO bay module and NO dimension in
       feet. It is a concept review of ONE window on the WEST facade, and
       the drawings on its pages 4 and 5 are photographs of that west wall,
       not a Mall elevation. This lead is dead, not deferred, and the next
       run must not spend on it.
       WHAT IT DOES ADD, published and usable: the glass is PPG "Greylite",
       "still extant throughout the building" and "originally developed
       specifically for the museum"; the terrace "encircles the building",
       with Level 2 at terrace level and Level 1 below it; the west wing's
       Lower Level is a cafeteria behind "a wide expanse of glass".
    h. the Library of Congress HABS search API, www.loc.gov/search/?fo=json,
       returned nothing parseable to this sandbox's curl. Untested beyond one
       attempt, so it is a maybe, not a closed door.
  MEASURED THIS RUN off the photograph, and reported as a NEGATIVE because
  that is what it is. The frame in the notes above reproduces exactly: the
  facade spans x=672 to 3264 at width=3840, and the two deep end recesses sit
  at x=784-805 and x=3102-3123, 22 px each, symmetric. That is an independent
  confirmation of the 496 ft OSM footprint, since 2592 px at 5.23 px/ft is
  496 ft to the foot.
  THE PIERS THEMSELVES DO NOT RESOLVE. Five scanlines were averaged across
  the clean band (y=750-775, 778-802, 805-835, 840-870, 880-905), detrended
  against a 91 px moving average and autocorrelated. The dominant lag is
  INCONSISTENT between rows, 148, 82, 103, 79 and 78 px, which is what noise
  looks like, not a bay module; and the local minima come in at roughly 21 px
  spacing, which at 5.23 px/ft is 4 ft, the scale of mullions rather than of
  piers.
  WHAT DOES SURVIVE ALL FIVE ROWS is a set of strong verticals at x = 784,
  1141, 1500, 1849, 2215, 2570, 2752 and 3112, a module of about 68 ft with
  one half-step at 2752. Recorded because it is real and repeatable, but it
  is NOT presented as the pier module: 68 ft is far too wide for the "modern
  equivalent of columns" the SAH prose describes, so these are more likely
  the joints between the big wall planes.
  SO THE REFUSAL STANDS, for the fifth time and for the same reason: the
  count belongs to checklist item 1, it is the model's most prominent
  feature, and a guessed module would be exactly the failure Sean named. The
  remaining doors are a HABS measured elevation, or a higher-resolution and
  more frontal photograph, or a run that counts the piers by EYE off a
  magnified crop rather than off a luminance profile. That last one is the
  cheapest and has not been tried.

  UNBLOCKED, 2026-09-07, by the landmark routine, on the sixth attempt and by
  the one door the fifth run named as cheapest and untried: LOOKING at a
  magnified crop instead of at a luminance profile. The count is measured, the
  build is no longer blocked, and the next run should go straight to writing
  dc-form-american.js.

  WHAT THE PICTURE SHOWED AND FIVE RUNS OF ARITHMETIC DID NOT. At 2x the Mall
  facade is NOT a colonnade of narrow piers. It is a small number of very wide
  blank marble planes separated by NARROW dark vertical window slots, with a
  fine ashlar-like grid of panel joints across the marble. That single look
  explains every previous failure: the earlier runs were hunting a short
  period because they expected columns, they FOUND the real period, about 68
  ft, and then REJECTED it in the fifth run's own words as "far too wide for
  the modern equivalent of columns". The rejection was the error, not the
  measurement. SAH says "rectangular slabs of wall set vertically", and a slab
  of wall is not a column. Eight slots in a marble wall is the model.

  MEASURED THIS RUN, and this is the number to build from. Same photograph,
  same frame, which reproduces exactly: facade x=672 to 3264 at width=3840,
  2592 px against the published 496 ft = 5.2258 px per foot. Column-mean
  luminance over the clean band y=755 to 800, thresholded at 0.65 of the row
  mean (row mean 136), gives SEVEN dark vertical runs and nothing else:
    784-805, 1133-1146, 1487-1492, 1849-1850, 2393-2398, 2748-2761, 3102-3123
  The EIGHTH, near x=2057, is the symmetric partner of 1849 and is obscured by
  the tree and the plaza sculpture; it is inferred, and it is labelled as
  inferred wherever it is used.
  SYMMETRIZED about the centre, x=1953.5, which is where the two end recesses
  put it to the pixel, the eight slots sit at offsets of
    plus and minus 19.9, 86.7, 154.5 and 221.8 FEET
  from the centre of the 496 ft front. Successive differences are 66.8, 67.8
  and 67.3 ft: a uniform module of 67.3 ft, with the innermost pair straddling
  the centre 39.8 ft apart. That is a measurement with a repeatable frame, not
  a module chosen to look right.
  A DISAGREEMENT, named rather than smoothed: the fifth run's autocorrelation
  list was 784, 1141, 1500, 1849, 2215, 2570, 2752, 3112. The two lists agree
  on five slots and differ on the two right of centre, 2215 and 2570 against
  2393 and 2748. The symmetric reading is preferred because the two end
  recesses are independently symmetric about 1953.5 to within a pixel and the
  0.65 threshold list satisfies that symmetry while the autocorrelation list
  does not. A future run with a more frontal photograph should re-check it.
  THE 9.6 FT RHYTHM IS TEXTURE, CONFIRMED BY EYE. The 50 px period the fourth
  run found is the precast panel joint, and in the magnified crop it is
  plainly visible as a fine grid of course lines across the marble, matching
  the published 16 3/8 in precast sandwich panels. Draw it as texture, and let
  it claim no count.
  THE RECESSED ATTIC IS CONFIRMED VISUALLY, not just in prose: the band
  y=660 to 735 stands back from the main wall below it with its own shadow
  line along the top of the main facade. The SAH "compact rectangular mass
  culminates in a recessed attic story" is a thing you can see.
  TWO BROWSER-PANE FACTS, recorded so the next run does not lose a call to
  either. First, replaceChildren DESTROYS document.images[0], so EVERY
  measurement call must be preceded by a fresh navigate; a second javascript
  call in a row fails with a drawImage TypeError and the notes above understate
  how easy that is to hit. Second, computer zoom's REGION CROP IS NOT SUPPORTED
  in this pane: it returns the full screenshot and says so. Magnify by drawing
  a crop into a canvas at an explicit scale with imageSmoothingEnabled=false,
  and stack two or three crops as rows in one canvas to see a long facade.
  STILL A NAMED GAP, and it does not block the build: no published height was
  found in any source reached, so the OSM tag of 20.5 m stands with its
  caveat. The dc-3d.js place height was CORRECTED from 24 to 21 this run, which
  is that tag in feet.

  AND THE COUNT STILL DID NOT FALL OUT, which is the honest part. A brightness
  profile across the clean scanline is dominated by a regular period of about
  50 px, which at 5.23 px/ft is 9.6 ft: that is the PRECAST PANEL joint module,
  not the piers, and it matches the published 16 3/8 in precast sandwich panel
  construction. In this photograph the sun is nearly frontal, so the vertical
  window slots between the piers are mid-grey, not dark, and brightness alone
  will not separate a pier from its recess. Counting the 50 px rhythm and
  calling it piers would put a guessed count in the model's most prominent
  feature dressed up as a measurement, which is worse than the gap.

  BLOCKED A FIFTH TIME, 2026-09-06 evening, by the landmark routine, and the
  block moved again. The photograph route WORKS, the method now works, and what
  is missing is one specific number. Read this before touching the count again.

  THE INHERITED FRAME IS WRONG AND WAS THE FOURTH RUN'S REAL ERROR. That run
  recorded "the facade spans x=672 to 3264, and against the published 496 ft
  that is 5.23 px per foot". It does not. Re-measured this run at the same
  width=3840 by scanning luminance rows for the sky/roof boundary: the roofline
  is at y=657, which the fourth run had right, but at y=660 the sky is bright
  (229 to 254) from x=200 out to x=1000 and again from x=3300 to x=3700, and
  the main mass reads dark (76 to 175) only from x=1020 to x=3250. The tall
  block is 2230 px wide in this frame, not 2592, and the 5.23 px/ft figure that
  every later inference rested on is 30 percent out. Anything derived from it
  in the entry above should be re-derived, including the two "deep end
  recesses" at x=784 and x=3102, which cannot both be on a block that starts
  at x=1020.

  THE RAKING-LIGHT SHOT THE PLAN ASKED FOR IS THIS SAME PHOTOGRAPH. Step 1 of
  the fourth run's plan said to go find one. It did not need to: in
  "National Museum of American History - 2026 (55256384290).jpg" the sun is low
  and from the left, and in the band ABOVE THE TREES the window slots are
  genuinely dark. The fourth run's clean scanline, y=780 to 800, is BELOW the
  treeline and is why brightness would not separate a pier from its recess
  there. The clean band is y=700 to 800, above the foliage and below the
  cornice.

  THE MEASUREMENT, which is repeatable in one call. Column-mean luminance over
  x=520..3400, y=700..800, threshold at mean minus 45 percent of the mean-to-
  min range (th=99, mean=135, min=55, max=176), gives six dark runs centred at
  x = 795, 1139, 1490, 2396, 2755, 3113, of widths 22, 12, 6, 6, 14, 22 px.
  The centre-to-centre gaps are 344, 351, 906, 359, 358. So there IS a regular
  module of about 353 px with one span of 906 px, about 2.6 modules, in the
  middle: that wide middle span is the blank marble centre bay, confirmed by
  eye in a 1:1 crop where a broad plain pier stands between two inscribed
  recessed bays carrying the Franklin text. This is a real architectural
  rhythm, not the 50 px precast joint the fourth run correctly refused.

  WHY IT IS STILL NOT A COUNT, stated plainly so a sixth run does not mistake
  progress for an answer. Two things are missing and both are small.
    a. The slot at x=795 lies OUTSIDE the main block, which starts at x=1020,
       so only five of the six runs are on the facade at all. Left of the wide
       centre there are two slots, right of it three. That asymmetry is not
       perspective, which compresses but does not delete; the likeliest cause
       is a tree crown clipping the top band on the left, and it means the
       detector is under-counting on one side.
    b. It is NOT established that the tall block from x=1020 to x=3250 IS the
       published 496 ft frontage rather than the central mass with lower wings
       either side. Until that is settled the 353 px module cannot be turned
       into feet, and 2230/353 = 6.3 bays is arithmetic, not a count.
  Six bays with a double-width centre is the shape the evidence points at. It
  is NOT written into a model on this evidence, because a guessed count in the
  building's most prominent feature is exactly what checklist item 1 forbids,
  and the fourth run was right to refuse for the same reason.

  WHAT THE SIXTH RUN SHOULD DO, and it is now two calls, not a research task:
    1. Settle (b) from the aerial: "Aerial view of National Museum of American
       History.jpg" shows whether the Mall frontage is one flat 496 ft plane or
       a centre block with wings. That single fact converts 353 px to feet.
    2. Settle (a) by running the same dark-run detector on a HIGHER band,
       y=690..730, which is above more of the foliage, and by widening the
       threshold sweep: report the run centres at th = mean minus 30, 40, 50
       and 60 percent and take the count that is stable across all four. A
       count that moves with the threshold is not a count.
  Do not re-derive the frame, the roofline, the clean band or the module. They
  are measured above.

  THE SIXTH RUN RAN THAT PLAN, 2026-09-06 night, by the landmark routine.
  BOTH CALLS WERE MADE. One of the two questions is now SETTLED, the other is
  proven UNANSWERABLE FROM THIS PHOTOGRAPH, and that second result is the
  useful one because it stops a seventh run measuring this image again.

  STEP 2, THE HIGHER BAND, IS A DEAD END. Do not retry it. Column-mean
  luminance over y=690..730 gives mean 146, min 89, and the threshold sweep
  yields six weak runs at minus 30 percent, three at minus 40, and ZERO at
  minus 50 and minus 60, all of them clustered at x=1250 and x=2515 rather
  than spread on a module. The reason is structural, not photographic: that
  band IS the recessed attic storey, and the attic has no piers. The clean
  band y=700..800 remains the only one.

  THE SWEEP ON THE CLEAN BAND REPRODUCES THE FIFTH RUN EXACTLY, which is
  worth knowing since nothing else here survived. At minus 50 percent the six
  runs sit at x = 795, 1139, 1489, 2396, 2755, 3113, matching the fifth run's
  795, 1139, 1490, 2396, 2755, 3113 to within a pixel. Minus 60 gives the same
  six. Minus 40 gives seven, the extra at x=1852. Minus 30 collapses into 15
  noise runs. So the count is stable across three of the four thresholds, not
  four, and the module of about 353 px with one central span of about 906 px
  is real and repeatable.

  STEP 1 IS SETTLED, AND IT WAS SETTLED BY LOOKING, not by the aerial. Three
  1:1 crops of the band y=660..990, taken at x=200..1400, 1400..2600 and
  2600..3800, show one continuous wall of BROAD plain marble piers separated
  by NARROW dark glass slots carrying horizontal glazing bars, with the
  recessed attic above it and a broad blank inscribed centre bay. There are no
  lower flanking wings anywhere in the frame. The Mall frontage is one plane,
  exactly as the SAH prose says.

  AND THAT DEMOLISHES BOTH INHERITED FRAMES. The fifth run's "tall block from
  x=1020 to x=3250" is the RECESSED ATTIC, not the main mass. Two independent
  checks say so. First, luminance sampled every 10 px along y=600 reads 225 to
  251 across the ENTIRE width from x=0 to x=3840, so that row is unbroken sky
  and the roofline lies below it at every column, which cannot be true of a
  centre block with sky beside it at y=660 unless the thing ending at x=1020
  and x=3250 sits ABOVE the main roof. Second, the right-hand 1:1 crop shows
  the attic parapet ending at about x=3365 with sky above and the pier-and-slot
  facade running on underneath it to the edge of the picture.

  SO THIS PHOTOGRAPH CAN NEVER GIVE THE COUNT, and that is the finding. The
  left end of the building is in frame at about x=264. The right end is NOT in
  frame: the facade runs out of the picture. With only one end visible there is
  no span to divide into 496 ft, so no px per foot exists here, and the 353 px
  module cannot be turned into feet however well it is measured. Every attempt
  since the fourth run has been trying to scale an image that does not contain
  the object being scaled. The fourth run's 5.23 px/ft and the fifth run's
  2230 px block were both answers to that impossible question.

  A LOCAL-CONTRAST DETECTOR WAS ALSO TRIED and is recorded as a negative so it
  is not tried again: column mean minus a 240 px moving average, thresholded at
  minus 10, over y=700..790 across the full width, returns 36 runs which merge
  to about 23 centres with gaps of 216, 155, 142, 209, 155, 142 and so on. The
  216 plus 142 pair sums to the 353 module, so the rhythm is there, but the
  detector also fires on panel joints and tree edges and cannot be trusted to
  count on its own.

  WHAT THE SEVENTH RUN SHOULD DO, and it is now ONE requirement, not a method:
  find a Mall-facade photograph with BOTH ENDS of the 496 ft frontage inside
  the frame. Nothing else is missing. The detector is written and proven, the
  clean band is known, the module is measured, the massing is settled. With
  both ends in one frame the px per foot falls out of the two end faces and the
  module becomes feet in a single call. Candidates not yet opened, from
  Category:National Museum of American History on Commons, are the wide
  elevations and any aerial that shows the whole Mall front square on. If no
  such photograph exists, the count still has to come off the NCPC PDF or an
  HABS sheet, and this entry should say so rather than let an eighth run
  re-measure a picture that has now twice been proved too narrow.

  THE BROWSER MECHANICS, confirmed again this run and worth the two lines:
  document.body.replaceChildren(canvas) DESTROYS document.images[0], so the
  NEXT javascript_exec call throws "provided value is not of type
  HTMLImageElement". Re-navigate before every call that touches the image, and
  batch navigate plus exec plus screenshot into ONE browser_batch.

  WHAT THE FIFTH RUN SHOULD DO, in order, and it should be cheap now:
    1. A RAKING-LIGHT photograph, where the recesses are genuinely dark. Not
       yet tried, from the same category: "American History Museum by Matthew
       Bisanz.JPG", "National Museum of American History (53832039979).jpg"
       (5184x3240), "National Museum of American History, Washington, D.C.
       (2013) - 01/03/04/05.JPG". One of these is shot with the sun down the
       facade; the dark runs then count themselves.
    2. Failing that, profile the EDGES, not the brightness: a horizontal
       gradient magnitude summed over the band y=780..1000 peaks at every
       pier arris whatever the lighting, and the pier module is the peak
       spacing that is NOT 50 px.
    3. "Aerial view of National Museum of American History.jpg" gives the roof
       and confirms the attic setback depth, which is currently unmeasured.
  The plan and height are already settled below and do not need redoing.

  THE SEVENTH RUN ANSWERED THE ONE REQUIREMENT, 2026-09-07, by the landmark
  routine. The block that held six runs is GONE. Two things changed, and the
  method one matters more than the answer.

  THE BROWSER PANE WAS NEVER NEEDED. curl CAN fetch a Commons image, and PIL
  and numpy are installed in the sandbox. Six runs measured through
  javascript_exec into a hidden pane, re-navigating before every call because
  replaceChildren destroys document.images[0]. All of that was working around
  a wall that is not there:
    curl -sL "https://commons.wikimedia.org/wiki/Special:FilePath/<FILE>"
  returns 200 and the full-resolution JPEG. Only upload.wikimedia.org is
  blocked, and Special:FilePath is served by commons.wikimedia.org. So the
  image comes to disk, PIL opens it, numpy measures it, and the crop can be
  saved as a PNG and READ AS AN IMAGE, which is the same LOOK the routine
  demands of a render. One rate limit was seen, a 429 on the fourth file
  fetched in a loop; space the fetches.

  THE PHOTOGRAPH WITH BOTH ENDS IN FRAME EXISTS and it is not a facade shot:
  "Aerial view of National Museum of American History.jpg", 6697 x 3984, from
  Category:Architecture of the National Museum of American History. Shot with
  a long lens from the Washington Monument looking NORTH, so the face toward
  the camera is the SOUTH, Mall facade, with the Federal Triangle behind. The
  whole 496 ft frontage, both corners, the recessed attic storey, the roof and
  the terrace are in one frame, and because it is a long lens from far away
  the foreshortening across the facade is mild enough to measure.

  THE COUNT, measured and stable. Column-mean luminance over a 120 px band,
  x = 1700..5750, dark runs at mean minus 40 percent of the mean-to-min range:
    y=2320   11 runs at x = 1744, 1990, 2387, 2778, 3170, 3566, 3963, 4363,
             4750, 5135, 5629
    y=2340   11 runs at the same centres to within 3 px
    y=2300   10 runs, the same list with x=3963 missing
  The first and last of the eleven are the two CORNERS in shadow. The nine
  between them are the recessed window slots. Centre-to-centre gaps: 397, 390,
  393, 395, 397, 400, 386, 384, mean 393 px.

  AND IT CLOSES ON ITSELF, which is why it is a count and not a rhythm. The
  corner-to-corner span is 5629 minus 1744 = 3885 px. Against the published
  496 ft that is 7.83 px per foot, so the 393 px module is 50.2 ft. Ten bays
  into 496 ft is 49.6 ft. The pixel module and the published length agree to
  1.2 percent WITHOUT either being used to derive the other. NINE SLOTS, TEN
  BAYS, TEN PIERS on the Mall facade, each bay about 49.6 ft, the pier about
  three quarters of the bay and the glass slot the remaining quarter.

  WHAT IS STILL A NAMED GAP, and it is small. The two END bays measure 246 px
  and 496 px against the interior 393, because both corners are in shadow and
  the detector is finding a shadowed return wall on the west and losing the
  arris on the east. So the pier WIDTH at the two ends is not measured. The
  interior module is.

  WHAT THE PICTURE SHOWED THAT THE NUMBERS DID NOT, three things, all of them
  building facts the model needs:
    a. The piers are BROAD and the slots are NARROW. In a 1:1 crop the pier is
       about 100 px of a 135 px module. This is not a colonnade of thin fins;
       it is a wall of massive marble slabs with a glass reveal between them,
       which is exactly what "a modern equivalent of columns" meant.
    b. The recessed attic storey is a CONTINUOUS BAND OF SMALL SQUARE WINDOWS
       in a dense rhythm, set back behind its own flat roof deck, and it runs
       the full length. It is not a blank parapet.
    c. There is a low SHADOW COURSE at the top of the piers: each slot carries
       a diagonal shadow where the pier returns into the recess, which is what
       SAH called the "modernist shadow cornices". It reads on the render as a
       dark triangle at the head of every slot.

  THE MALL FACADE HAS NO WIDE CENTRE BAY. The uniform 393 px module runs from
  corner to corner with no 2.6 module span anywhere. The wide inscribed centre
  the fourth and fifth runs found belongs to the OTHER facade: the entrance
  front, seen in "National Museum of American History (53832039979).jpg",
  where four huge inscribed panels carry the Smithson bequest text around the
  door. Those two facades are different compositions and must not be averaged.

  SO THE BUILD IS UNBLOCKED and the next run should build it, not measure it.
  Everything checklist item 1 needs is above: 10 bays, 9 slots, 49.6 ft module,
  496 by 226 ft plan, height 21 m corrected from the dc-3d.js 24, the attic
  window band, the shadow cornice, the terrace podium. Do not re-measure the
  aerial. Do not open the browser pane for it.

- nineteenth-century is DONE, 2026-09-06, by the landmark routine.
- euro-paintings is DONE, 2026-09-06, by the landmark routine, as Gallery 637.
- lehman is DONE, 2026-09-06, by the landmark routine, as Gallery 959.
- grand-stair is DONE, 2026-09-06, by the landmark routine: the floor 1 node
  now draws grandStair(), the same flight the floor 2 node already drew, and
  the key left the LANDMARKS table. It is the one stair seen from each end.
  THE MET INTERIORS ARE NOW FINISHED except greek-roman, which is REFUSED on
  published dimensions and should stay refused until a source is found. Queue
  item 5 is closed. The next run should go to the top of the queue instead:
  american is the only Mall place with no dc-form file and is blocked three
  times over, so unless a run can reach an HABS sheet or LOOK at a photograph,
  the honest next work is a rebuild pass over the older trail-3d.js and
  nyc-3d.js models against the nine-item checklist.

THE FREEDOM TRAIL IS FINISHED, corrected 2026-09-06 by the landmark routine,
because this file said otherwise and a run nearly rebuilt five buildings that
already exist. All nine stops have a committed trail-form-*.js built to this
standard: bunker-hill, constitution, faneuil-hall, old-north, old-south,
old-state-house, paul-revere, state-house, and park-street, which needed no
rebuild. The entries for state-house, bunker-hill, old-south, old-north and
faneuil-hall still sit under "Researched this run, NOT built" further down;
they are BUILT, and the sections are kept only for the research they carry.
Queue item 2 is closed. So is item 3, New York, and the Met exterior half of
item 4. The ONLY open rebuild-queue items are MoMA, blocked on a tool, and
american, blocked on a count.


- constitution is REBUILT, 2026-09-05, by the landmark routine; see below.
  park-street is DONE and needs no rebuild: it is already researched to this
  standard in trail-3d.js, and its flat top is a declared gap, not a defect.

TWO WRITERS COLLIDED ON THIS FILE'S OWN QUEUE, 2026-09-05, and it is recorded
here because the claim list above is what exists to prevent it. A live session
and the three hourly landmark routine rebuilt the Old State House and the Paul
Revere House at the same time, in the same worktree, within four minutes of
each other. The routine wrote last, so the session's two files were silently
replaced on disk: no error, no conflict, nothing in git, because neither file
had ever been committed. Nothing was lost that mattered, and the routine's
versions are the better ones on the evidence: its Old State House is measured
from SAH Archipedia at 36 ft 4 in by 112 ft 7 in against the session's
committee specification of "36 by 110 to 112", and its tower carries the clock
dials the session had put only on the east gable. The session's work was
dropped rather than merged, and the lesson is the cheap one: CLAIM A BUILDING
IN THIS FILE BEFORE THE FIRST LINE OF IT IS WRITTEN, whoever you are. The list
above is not paperwork, it is the lock.


## Rebuilt to this standard

- asian-astor, the Astor Chinese Garden Court, Met gallery 217 (2026-09-09,
  the landmark routine). What it replaced was the clearest example in this
  file of the thing Sean called unacceptable: a flat grey plate with an OVAL
  hole in it, three grey pyramids, and a plank on six dark posts. Every one
  of those four readings is wrong, and the picture said so before any
  research did.
  PUBLISHED and traceable, reached this run: the court is "roughly 59 feet
  by 40" and was built by "27 Chinese engineers and craftsmen trained in
  traditional crafts", both in the Christian Science Monitor of 7 July 1981,
  reporting the opening
  (https://www.csmonitor.com/1981/0707/070701.html). The Met's own record
  for gallery 217 lists the materials: Taihu rocks, granite terrace, ceramic
  tile flooring, roof tiles and door frames, nan wood columns, pine beams,
  gingko latticework, brass fittings. It copies a courtyard in the Garden of
  the Master of the Fishing Nets, Suzhou. The 59 by 40 was already in the
  file and is kept; the FABRIC standing on that plan is what changed.
  COUNTED FROM PHOTOGRAPHS, which is the route this file already names as
  legitimate and which no run had used on this room. Two Wikimedia Commons
  photographs were read as images this run, not described from memory:
  "Astor court colonnade" and "Astor court moon gate".
    The colonnade photograph settles four things. The corridor columns are
    ROUND and BARE pale honey nan wood, not dark lacquered posts. The beams
    and brackets over their heads are near BLACK, so the walkway is TWO
    timbers in strong contrast and drawing it in one brown loses the whole
    reading. A low pierced balustrade runs between the column feet. And the
    light above is a DIAGONAL glazed diagrid, which is the single feature
    that tells a visitor this garden is indoors.
    The moon gate photograph settles three more. The gate is a true circle
    cut through a THICK wall, ringed in grey bluestone with a thin dark
    timber outer edge, standing on a flat raised sill at about knee height.
    What shows through it is the DARK of a passage. The old model drew pale
    blue-grey glass, which turned a doorway into a porthole.
  THE NAMED GAP, left open rather than guessed. No published column count
  for the corridor was found. Item 1 forbids drawing a colonnade on a
  derived count, so the run of columns is drawn CONTINUING PAST the edge of
  the court instead of closing at a total: it claims the rhythm the
  photograph shows and claims no number. The named route to the number is
  the Winter 1980-81 Metropolitan Museum Bulletin, "A Chinese Garden Court:
  The Astor Court at The Metropolitan Museum of Art" by Alfreda Murck and
  Wen Fong. metmuseum.org rate-limited this run with HTTP 429 after two
  fetches, which is the same block the greek-roman entry recorded, so the
  Bulletin was not reached.
  WHAT THE PICTURE SHOWED AND THE NUMBERS DID NOT. The skylight was drawn at
  a NEAR depth and swept unbounded, so it painted a grid over the entire
  court and out across the empty page: the room stopped reading as a room.
  Same painter's-depth trap this file has now recorded seven times, arriving
  from ABOVE for the first time rather than from a floor or a wall. Fixed
  two ways, because it was two faults: sorted at the far end so it draws
  first, and each diagonal clipped to the court's own x range. Nothing in
  the face counts or the bounding box would ever have shown it.
  OWED, and listed so the next run starts past it rather than rediscovering
  it. All four were seen in the render and none is a guess:
    (a) the standing Taihu stele reads as a pale tapered BIN. The negative
        lean flares it as it rises, which is right for a Taihu rock and
        wrong at this width; it wants to be slender and pierced, and a
        pierced hole is the tell of Taihu limestone.
    (b) the three court rocks are still CUBES, untouched from the version
        this replaced, and cubes are the box the standard was written
        against.
    (c) the round eave-drip tiles read as white dots along the INSIDE of the
        eave rather than as a scalloped course along its front edge. The y
        of that row is wrong, not the idea.
    (d) the two gingko lattice windows are drawn and then hidden behind the
        roof, so the wall reads blank. Either raise them or move them left
        of the corridor.

- modern, the Modern and Contemporary galleries. NOT BUILT, and the negative
  is reported so a later run does not spend itself rediscovering it. The
  render is an empty grey box with one BLANK canvas and a bench, which is
  exactly the shape Sean rejected, so the instinct is to fill it. The queue
  says to check met-art.js first, and met-art.js carries NO signature work
  for this key at all: there is no entry for `modern`, where asian-astor and
  islamic both have theirs. A gallery with no listed work and no published
  room dimension gets nothing. Absence over invention: an empty box that
  claims nothing is honest, and a room furnished from imagination is a
  liability on a licensed guide's site. What would unblock it is an entry in
  met-art.js naming a work actually hung there, with the Met's own published
  dimensions for it, which is how egyptian and lehman were unblocked.

- park-street, Park Street Church, Boston (2026-09-08, the landmark routine).
  The last Freedom Trail stop without its own form file, and NOT one of the
  boxes this standard was written against: six earlier runs had already given
  it published massing and a steeple that closes on Bowen's 217 ft 9 in
  exactly. All of that is carried over untouched. Three checklist items were
  open and only those three are new: item 5, the 78 by 103 ft brick body was
  ONE brick tone, so it and the tower now carry course lines, a texture in the
  plane of the wall claiming no count; item 8, the body windows were glass on
  brick with a hairline between, so each now has the reveal a two foot wall
  gives it, struck in a darker brick rather than in stone; item 3, two granite
  treads under the Tremont doors, which had opened straight off the ground.
  WHAT WAS DELIBERATELY NOT ADDED, and it is the reason STYLES.md is read
  before the geometry is chosen. The obvious move on a two storey brick church
  is a belt course between the ranks of window, and the neighbouring Old North
  file has one. STYLES.md, "The Federal spired tower", forbids it here in
  as many words: the flanks get "a water table below and a cornice at the
  eaves and nothing between", and "the flanks are ornamented like the front"
  is listed under Wrong if. So the brick got texture and depth and no new
  mouldings.
  WHAT THE PICTURE SHOWED AND THE NUMBERS DID NOT. Two things, both caught by
  looking. First, the coursing loop ran to `CZ`, the eaves cornice height,
  which `var` hoists but which is assigned twenty lines LATER in the function.
  The comparison was against undefined, every loop was `z < NaN`, and the
  whole texture silently drew nothing while the file passed `node --check` and
  rendered without an error. Second, with that fixed the body was coursed and
  the TOWER was still a plain red block beside it, so from the Park Street
  flank the same brick read as two different materials. Neither is visible in
  any count.
  BUILT FROM, all unchanged from the scene it replaces: Bowen's Picture of
  Boston 1833 via the 1903 preservation pamphlet for every steeple stage;
  Sanborn 1885 sheet 12, lettered on the plan, for 40 ft to the eaves and 2
  storeys; the deed for the 80 by 118 ft lot; and about 78 by 103 ft with a
  39 ft semicircular east end SCALED off that plan at 6.04 px per foot and
  declared scaled.
  NAMED GAPS, carried forward in the file's own header: no published roof
  pitch, so the model still stops at the published eaves under a lead grey
  stopping plane; no published window count, size or sill on the body; no
  published column diameter; no published step count or riser.

- american, the National Museum of American History (2026-09-07, the landmark
  routine). The LAST Mall place without a dc-form file, blocked five times on
  one number and unblocked on the sixth by looking at a magnified crop instead
  of at a luminance profile. All sixteen Mall rebuilds are now done.
  BUILT FROM: 496 by 226 ft (OSM way 445808462, and the photograph confirms the
  496 to the foot); 67.3 ft tall (the OSM 20.5 m tag, a NAMED GAP, no
  architect's height reached by six runs); pink Tennessee marble sandblasted
  over 16 3/8 in precast sandwich panels; a broad platform base; "modernist
  shadow cornices"; a "compact rectangular mass" that "culminates in a recessed
  attic story"; PPG Greylite solar gray glass; and the design idea that decides
  the whole model, SAH's "modern rendition of a peripteral temple on the model
  of the Lincoln Memorial", where the colonnade is made of WALL: "rectangular
  slabs of wall set vertically ... held away from the inner wall by vertical
  windows of solar gray glass".
  THE COUNT, drawn to the foot: eight slots at plus and minus 19.9, 86.7, 154.5
  and 221.8 ft from the centre of the front, a 67.3 ft module with the innermost
  pair straddling the centre. The eighth is the inferred partner of the one a
  tree hides, and it is labelled inferred in the file. So the slabs are nine
  real planes on each long face, five on each end, each a separate object with
  its own two returns into the recess. Not lines painted on a box.
  WHAT THE PICTURE SHOWED AND THE NUMBERS DID NOT, twice.
  First, THE PAINTER'S TRAP A NINTH TIME: the attic roof and the cornice are
  sorted by their FARTHEST corner, so they painted before the far side's slab
  returns and eight bright stripes ran ACROSS the roof. Arithmetic passed it;
  one look caught it. Fixed by computing the nearest and farthest plan corners
  and giving the glass core, the cornice, the attic and its cap explicit
  depths, so the core sits behind everything and the top masses in front.
  Second, A SMALLER ONE WORTH RECORDING because it cost a whole render: the
  panel joints were first drawn as hand-built SVG polyline strings, and the
  renderer's FIRST pass measures the drawing by walking the point list a poly
  is handed. A string is not a point list, and render_room.js died with
  "pts.forEach is not a function" before drawing anything. Every mark goes
  through ctx.poly, including a hairline.
  CHECKLIST, all nine: (1) eight slots and their nine slabs drawn as real
  separate objects at the measured count; the 9.6 ft panel joints are texture
  and claim no count, which is what the magnified crop says they are. (2) the
  shadow cornice, the terrace deck, its lower apron and the attic setback are
  four horizontal breaks, each its own slab. (3) a broad platform base with a
  lower apron; no step COUNT is claimed because none is published. (4) not a
  flat lid: a recessed attic storey with its own thin cap, which is the thing
  SAH says the mass culminates in. (5) two tones per material through a light
  vector, plus the returns, which is where the "alternation of light and shade"
  actually comes from. (6) a ground shadow under the terrace footprint.
  (7) heights TRUE at 67.3 ft on a 496 ft front; the place height in dc-3d.js
  is 21 m, which is that same tag. (8) HONESTLY PARTIAL, and said rather than
  claimed: a 4 ft slot on a 496 ft facade is about two pixels at full-map
  scale. It survives because each slot carries a bright marble return beside a
  dark glass ground, and in the 4x crop it reads exactly as the photograph
  does. Drawing it wider would make it legible by making it false. (9) the one
  thing a visitor names IS the wall-slab colonnade, and it is the model.
  NAMED GAPS, in the file's own header: the height; the slot width and the 2 ft
  the slabs stand proud, bounded by the 4.0 ft the end recesses measure; the
  attic setback; the step count; and the north and end elevations, which carry
  the measured module by the building's symmetry and by arithmetic on the
  measured 226 ft depth, both flagged as derived rather than seen.
  NOT DRAWN, declared: the full storey by which the Constitution Avenue side
  sits below the Mall terrace. This renderer has one flat ground plane, so the
  drop cannot be drawn and is not faked.

- egyptian, Gallery 100, the Mastaba Tomb of Perneb (2026-09-07, the landmark
  routine). The SEVENTH Met interior rebuilt from an object in a box into a
  room, and the LAST one available: with this, all 15 rooms on the plan have an
  interior drawn, and map_lint says so.
  PUBLISHED, the Met's collection API, read this run, both objects verified on
  their own GalleryNumber field = 100: object 543937, "Mastaba Tomb of Perneb",
  Dynasty 5, ca. 2381-2323 BCE, limestone and paint, from Saqqara,
  "H. 482.2 cm (15 ft. 9 13/16 in.)"; object 543903, "Striding Figure",
  ca. 2575-2465 BCE, "H. 89.5 cm (35 1/4 in.)". Drawn at exactly 15.8177 ft and
  exactly 2.9365 ft and nothing else.
  PUBLISHED IN PROSE, and it is what turns a block into a building: the mastaba
  "is divided into four rooms, including a decorated main offering chapel and a
  secondary offering chamber with a separate entrance", the serdab joins that
  chamber "by a slot through which the smell of incense and chants could pass",
  the burial shaft sits "to the right side of the main offering chamber", and
  "visitors can enter the tomb and walk through its rooms" (Wikipedia, Tomb of
  Perneb, read this run, citing the Met). Two doorways, both open, both
  person-sized, is a published COUNT, not a composition choice.
  THE STYLE WAS ADDED TO THE BOOK FIRST, as the routine requires: STYLES.md now
  carries "The Old Kingdom mastaba" beside Egyptian Revival, which was America
  borrowing a shape rather than the shape itself. Its tells are the flat top,
  the four battered walls, a block much wider than tall and longer than wide,
  courses of cut limestone, two doorways, and the false door inside.
  NAMED GAPS, declared and not guessed: the tomb's WIDTH and DEPTH are published
  nowhere reached. The API gives a height and nothing else; the museum's own
  object page answers a script with an HTTP 429 bot check, exactly as SAH
  ARCHIPEDIA and the museum's architecture page do; archive.org has the
  excavation vessels but not Ransom's 1916 handbook. Two attempts, then the
  hunt stopped. Also gaps: the gallery's own dimensions, the 22 ft ceiling that
  fixes feet to plan units, the 0.09 batter, both doorway sizes and their
  spacing, the nine course lines, the plinth and the bench.
  WHAT THE RENDER SHOWED AND THE NUMBERS DID NOT, and this is the run's finding:
  THE STYLE BOOK CAUGHT ITS OWN MODEL. The fallback table's old 20 by 12 ft was
  drawn first, because keeping the existing figure looked like the conservative
  choice. At 20 ft the block is only 1.27 times its own published height and it
  stood up in the render as a PYLON, which is the case the mastaba entry had
  been written to call wrong ten minutes earlier. So the footprint was rederived
  from the published FORM rather than from the old number, at 32 by 21 ft, which
  is the shallowest block that is both wider than tall and longer than wide. The
  general lesson: when a dimension is a named gap, inheriting the previous
  guess is not neutral, and the STYLE is a stronger constraint on it than the
  file's own history.
  Two smaller things the picture showed: the Striding Figure at 35 inches hugged
  the left wall and read as a smudge rather than a ruler, so it moved onto open
  floor; and the doorways at 3.4 ft read as slots on a 32 ft face rather than as
  something a person walks through, which is the one fact gallery 100 is famous
  for, so they widened to 4.2 and 3.2 ft.
  NOT DRAWN, declared: the two small obelisks that stood at the western corners
  of the courtyard at Saqqara, because the same source says they "are no longer
  part of the museum exhibit" and this is the gallery, not Saqqara; and no
  cavetto cornice or torus roll, because neither was verified this run and a
  mastaba's tell is a plain flat top.
  THE FALLBACK TRAP WAS AVOIDED BEFORE IT COST A RENDER, which is now three runs
  in a row it has been paid for once and never again: the "egyptian" key LEFT
  the LANDMARKS table, with a comment where it was.
  CHECKLIST, all nine: (1) two doorways drawn as two doorways with recessed
  jambs, at the published count; the nine course lines are stone texture and
  claim no count. (2) the courses are the horizontal breaks, and a cornice
  would be WRONG here. (3) the tomb stands on the gallery floor slab, which is
  what it does at the Met. (4) the roof is a flat lid and the header says so,
  because a mastaba that comes to a point is a pyramid. (5) two tones per
  material through ctx.shade. (6) a contact shadow was MISSING on the first
  pass and was added. (7) heights true to the published centimetre, both
  objects. (8) openings near-black on limestone, checked at 900 px. (9) the one
  thing a visitor names about gallery 100 is that you can walk into a
  4,400-year-old tomb, and the doorways are open, dark and person-sized.
  LOOKED at four times: the pylon, the corrected bench, the widened doorways,
  and yaw 0.70 pitch 0.44.

- lehman, Gallery 959, the tapestry room (2026-09-06, the landmark routine).
  The SIXTH Met interior rebuilt from an object in a box into a room, built in
  the same run as gallery 637 and cheaper for it, because every trap the first
  one hit was already known.
  PUBLISHED, the Met's collection API, read this run, both objects verified on
  their own GalleryNumber field = 959: object 459205, Bernard van Orley, "The
  Last Supper", ca. 1525-28, "131 7/8 x 137 13/16 in."; object 459227,
  "Emperor Vespasian Cured by Veronica's Veil", ca. 1510, "135 1/2" x 135"".
  Two Netherlandish tapestries, each OVER ELEVEN FEET SQUARE, drawn at exactly
  those numbers. Department 15 is the Robert Lehman Collection.
  DERIVED, on the Medieval Hall rule that the object fixes the scale and the
  plan rectangle does not: the back wall is 2.6 hangings, near 30 ft, and the
  plan's 180:105 proportion gives 17.5 ft of depth.
  NAMED GAPS: the gallery's own height, length and depth are published nowhere
  reached; the 16 ft wall is what an eleven foot three hanging plus a base and
  a cornice requires, not a measurement; hanging height, cornice, panelled
  dado and doorway are drawing decisions.
  WHAT THE RENDER SHOWED AND THE NUMBERS DID NOT: at true size the two
  hangings run from just above the dado to just under the cornice and leave
  almost no bare wall in the room. That is the fact the old canvas in a box
  hid, and it is why an eleven foot number is worth a room. The side hanging
  was recentred from 0.42 to 0.47 of the depth after the first look so it
  clears both ends of its wall.
  THE THREE GALLERY 637 LESSONS WERE APPLIED BEFORE THEY COULD COST A RENDER,
  which is the argument for building two rooms in one run rather than one: the
  key left the LANDMARKS table, the side hanging and the doorway sort after
  the side walls, and no ceiling is drawn.
  LOOKED at twice: default, and yaw 0.70 pitch 0.44.

- euro-paintings, Gallery 637, a Dutch and Flemish room (2026-09-06, the
  landmark routine). The FIFTH Met interior rebuilt from an object in a box
  into a room, and the first where the plan node stood for a whole SUITE: the
  old entry was one canvas, h 4.7 by w 4.5, standing for forty galleries. A
  suite has no envelope, so this is one gallery and says so.
  PUBLISHED, the Met's collection API, read this run, both objects verified on
  their own GalleryNumber field = 637: object 679844, Joachim Beuckelaer,
  "Fish Market", 1568, "50 5/8 x 68 7/8 in."; object 436622, Frans Hals,
  "Merrymakers at Shrovetide", ca. 1616-17, "51 3/4 x 39 1/4 in." Drawn at
  exactly those numbers and nothing else.
  THE FILTER EARNED ITS KEEP AGAIN: Vermeer's "Young Woman with a Water
  Pitcher" came back on the same sweep at 18 by 16 in. and is LEFT OUT,
  because its GalleryNumber is 614. Same lesson as gallery 812, now twice.
  THE DEPARTMENT MAP, so the next run does not lose a fetch budget to it:
  departmentId 11 is European Paintings and 12 is European SCULPTURE and
  decorative arts, not the Lehman Collection, which is 15. A dept-12 sweep run
  by mistake this session did turn up something worth keeping for whoever
  builds a period room: object 196910, Robert Adam's Dining Room from
  Lansdowne House, gallery 515, carries a CONFIRMED room measurement,
  "17 ft. 11 in. x 46 ft. 9 in. x 24 ft. 1 in.", which is rarer than any
  painting dimension and is a complete room handed over for free.
  DERIVED and declared: no dimension of gallery 637 is published anywhere
  reached, so the room keeps the floor plan's 195:140 proportion at near 44 by
  32 ft on a 22 ft wall. NAMED GAPS: ceiling height, rail height, dado height,
  wall colour, bay count, and which wall each picture hangs on.
  WHAT THE RENDER SHOWED AND THE NUMBERS DID NOT, three things, and the first
  is the one that generalises to every remaining Met room:
  (1) THE ROOM DID NOT EXIST ON THE FIRST LOOK. It rendered as the old flat
  canvas, because the fallback loop at the foot of met-rooms.js rewrites
  MET_ROOMS for every key still in the LANDMARKS table and it runs AFTER the
  literal that registers the new room. Registering a room is not enough; the
  key has to LEAVE that table. A comment now sits where the entry was.
  (2) The Hals and the enfilade doorway came back invisible. A side wall's own
  inner face is drawn from this eye and painted over both; they sort after it
  now. Every number was right and the wall was blank.
  (3) The dado at 3 ft cut straight across the bottom of the Fish Market,
  because a 50 inch picture on the 57 inch centre line starts at 32 inches.
  Both heights were drawing decisions and the dado gave way, at 2.4 ft.
  NOT DRAWN, declared: the laylight. Gallery 637 is one of the skylit rooms,
  and the gallery 812 rule was applied before it could cost a render, since a
  horizontal plane at ceiling height projects down across the floor whatever
  depth it is given. The lit cove carries the top light.
  LOOKED at three times: the first render that came back as the old canvas,
  the default after the fix, and yaw 0.72 pitch 0.42.

- nineteenth-century, Gallery 812, the great Salon room (2026-09-06, the
  landmark routine). The FOURTH Met interior rebuilt from an object in a box
  into a room. The route is the arms-armor one and it worked again: fetch
  department highlights and filter on each object's own GalleryNumber field.
  PUBLISHED, the Met's collection API, read this run, both verified
  GalleryNumber 812: object 435702, Rosa Bonheur, "The Horse Fair", 1852-55,
  "96 1/4 x 199 1/2 in." = 8 ft 0 1/4 by SIXTEEN FEET SEVEN AND A HALF; and
  object 438820, Courbet, "Young Ladies of the Village", 1851-52,
  "76 3/4 x 102 3/4 in." Both drawn at exactly those numbers.
  WHAT THE FILTER ALSO DID, which is half its value: Courbet's "Woman with a
  Parrot", 51 by 77 in., came back on the same sweep and is LEFT OUT, because
  its GalleryNumber is 811, the room next door. A search tells you what to
  draw; the gallery field tells you what not to.
  DERIVED and declared: the gallery's own dimensions are published nowhere
  reached, so the painting fixes the scale, near 36 1/2 by 27 ft at 2.2 Horse
  Fairs long. NAMED GAPS: the 20 ft ceiling, the picture rail height, the
  wall colour, which wall each painting hangs on, and the two-foot bottom
  rail are all drawing decisions and say so in the file.
  WHAT THE RENDER SHOWED AND THE NUMBERS DID NOT, and it generalises to every
  room still to be rebuilt: a LAYLIGHT CANNOT BE DRAWN AT ALL in these rooms.
  Sorted the usual way it painted over the back wall and the Horse Fair, the
  Dendur glass wall one storey up. Pushed behind the back wall it STILL came
  out as a pale streak lying across the floor, because a horizontal plane at
  ceiling height, seen from above and outside, projects down into the room
  whatever its depth. Sorting is not the lever. The room is a roofless
  cutaway, so it has no ceiling and cannot show a thing in the ceiling; the
  wall cove carries the top light and the laylight is a declared gap.
  It was identified by a CONTROL RENDER with the side canvas switched off,
  which is the cheap move worth copying: when two candidates could be making
  one smear, delete one and look again.
  LOOKED at three times: before the depth change, after it, and after removal.

  MET INTERIORS REMAINING after this run: greek-roman (REFUSED on published
  dimensions, see below), lehman, grand-stair and euro-paintings. NOTE for
  the next run: the Met API WAF blocked this run after about 350 object
  fetches, two requests in parallel is enough to trigger it, and it stayed
  blocked. Fetch one department per run, serially, and stop while ahead.

- arms-armor, the Equestrian Court, Met gallery 371 (2026-09-06, the landmark
  routine). The THIRD Met interior rebuilt from an object in a box into a room,
  and the one the previous run was blocked on.
  THE ROUTE THAT WORKED, and it unblocks every remaining Met room: the API
  cannot be filtered by gallery, so 450 objects of department 4 were fetched
  and filtered on their own GalleryNumber field. The previous run's dead end
  was a search that returned galleries 373 and 378; this is the way past it.
  PUBLISHED, the Met's collection API, read this run, every object verified to
  be GalleryNumber 371: objects 22757 / 35772, the Collalto horse armor shown
  as "Armor for Man and Horse", "as mounted, H. 75 1/2 in.; L. 90 in.;
  W. 30 in.; Wt. including saddle 93 lb. 1 oz."; objects 23358 / 35739, the
  horse armor of Johann Ernst of Saxony-Coburg, dated 1548, Nuremberg. Six
  standing armors with published heights, each drawn at its own: Henry VIII's
  1527 garniture 73 in, his ca. 1544 field armor 72 1/2 in, Clifford's 1586
  garniture 69 1/2 in, Scudamore ca. 1595 70 1/4 in, an Augsburg tilt armor
  ca. 1580 68 3/4 in, a Milanese field and tournament armor 71 1/2 in.
  DERIVED and declared: the court's own dimensions are published nowhere
  reached, so the horse fixes the scale the way the reja fixes the Medieval
  Hall. The hall is 6.4 horse-lengths, 48 ft, and the plan rectangle keeps its
  proportion. Saddle on the back at 0.72 of 75.5 in, rider folded at 0.72 of a
  published standing height.
  WHAT THE RENDER SHOWED AND THE NUMBERS DID NOT: reading 75.5 in as the top of
  the BODY put the saddle inside the horse and the rider on a slab. Every
  number was right and the first picture was four legs and a TABLE. 75.5 in
  "as mounted" is the crest of the shaffron: the back is at 0.72 of it and the
  head reaches the whole. A second pass shortened the body to two thirds of the
  overall length and built the crinet as three rising plates, which is what
  finally made it a horse.
  NAMED GAPS: no source reached states how many mounted figures the court
  holds, so TWO are drawn because two are what the API evidence supports; a
  third would be invented. The court's height is the file's standard wall
  height and is not a measurement. The arcade and balcony openings are drawn
  at six bays, a drawing decision.
  KNOWN AND NOT FIXED, for the next run: the rider still reads small against
  the horse, the lance collapses to a line at some yaws because it is a flat
  quad, and the whole group is blocky at close range.
  LOOKED at three times: `node render_room.js arms-armor` before and after the
  proportion fix, and `... arms-armor 0.72 0.42`.

- medieval, the Medieval Sculpture Hall, Met gallery 305 (2026-09-06, the
  landmark routine). The SECOND Met interior rebuilt from an object in a box
  into a room.
  PUBLISHED, checked this run (metmuseum.org object 201926 and the Met's own
  gallery description): "Choir screen from the Cathedral of Valladolid",
  attributed to Rafael Amezua of Elorrio, erected 1763 and painted and gilded
  1764, iron gilded and painted with a limestone base, 52 FEET HIGH and 42
  FEET WIDE; commissioned by Isidro Cosio y Bustamante, bishop of Valladolid,
  and standing in the nave dividing the choir from the high altar; gallery 305
  "is dominated by" it and the hall evokes a church interior.
  SCHEMATIC and declared: only the screen is true; the hall is derived from it.
  WHAT THE RENDER SHOWED AND THE NUMBERS DID NOT, and it is the sharpest case
  of this yet: sizing the hall off the floor plan's rectangle made a correct
  42 foot screen span a FIFTH of the room. Every number was right and the
  picture was wrong, because the plan rectangle is the WING and not this room.
  The hall is now sized off the screen at 88 percent of its length, near 48 by
  33 feet with the plan's proportion kept. THE GENERAL RULE, worth carrying to
  every remaining Met interior: when a room is famous for one object, the
  object fixes the scale and the plan rectangle does not.
  NAMED GAPS: no published count of balusters, registers or gate leaves, so
  the grid at 34 bars is a drawing decision; the hall's own height and length
  are published nowhere reached this run; the four sculptures are a plinth
  with a stone standing in for the figure, on the canvasOn honesty, because no
  dimension was taken for any single work.
  LOOKED at three times: `node render_room.js medieval`, once before the fix
  and once after, and `... medieval 0.55 0.55`.

- islamic, the Damascus Room, Met gallery 461 (2026-09-06, the landmark
  routine). The FIRST of the fifteen Met interiors rebuilt from a facade-style
  object-in-a-box into an actual room, which is queue item 5.
  PUBLISHED, the Met's own collection API, object 452102, read this run:
  "Overall measurements are 264 7/16 in. (H) x 200 1/2 in. (W) x 316 5/8 in.
  (D) ... fountain is 4 15/16 in. high", dated 1119 AH/1707 CE, gallery 461.
  In feet 22.037 x 16.708 x 26.385, fountain 0.411. The old LANDMARKS entry
  called this a "screen" 22 by 16.7: those were the ROOM's own numbers all
  along, used to draw a flat panel.
  PUBLISHED, metmuseum.org (Damascus Room; The Damascus Room essay): a qa'a
  divided into a raised square seating area (tazar) and a small antechamber
  ('ataba) entered through a doorway from a courtyard; the 'ataba carries the
  fountain; every surface, walls, ceiling, niches, shuttered windows, is
  carved and painted wood, gilded stucco and tile; the tazar floor is square
  red and white marble panels and the step up has an opus sectile riser.
  DERIVED and load-bearing: the tazar is square and the room is 16.708 wide,
  so the tazar is 16.708 deep and the 'ataba is the remaining 9.68 ft. The
  plan falls out of two published numbers.
  NAMED GAPS: step riser drawn at 9 in, none published; fountain basin
  diameter not published, only its height; panel and niche counts are a
  drawing decision at roughly two-foot panels.
  NOT DRAWN, declared: the near wall with the courtyard door (the Great Hall
  cutaway rule) and the ceiling, because this view looks down into the room
  and a plane at 22 ft paints over everything under it.
  LOOKED at twice, `node render_room.js islamic` and `... islamic 0.75 0.45`.
  What the picture showed that the numbers did not: the two floor levels did
  not read at all until the platform threw a shadow onto the 'ataba floor,
  and the fountain at its true five inches is startlingly small, which is the
  honest surprise of the room and worth keeping.
  Styles book gains the Ottoman Damascus qa'a. render_room.js gains the
  islamic room rect, taken straight off met-map.js.

Each run rebuilds one building and adds it here, so the next run does not
repeat it. A name on this list has a `dc-form-<k>.js` (or the equivalent
scene file) and has been LOOKED at from more than one angle.

- met exterior, the Fifth Avenue facade (2026-09-05, the landmark routine).
  The claim the previous run left open is now closed. That run built the met:
  route so the site's own front door could be LOOKED at for the first time and
  spent its ceiling doing it; this run inherited its picture and its research
  and rebuilt the front from them.
  Published, quoted in the file header so it is not searched a third time:
  Richard Morris Hunt's Beaux-Arts front opened December 1902; it is "a
  colossal Roman arch with a tripartite window flanked by massive pairs of
  freestanding Corinthian columns", "repeated three times across the central
  block"; "Four pyramids of roughly-hewn limestone" are the remnants of
  sculpture groups never carved; "Six portrait medallions of Renaissance
  artists" sit "in the spandrels of the museum's central structure".
  Sources: en.wikipedia.org/wiki/The_Met_Fifth_Avenue and the museum's history
  page. The material CONTRADICTION is carried, not smoothed: Wikipedia says
  limestone, a secondary account says "gleaming Vermont marble", and no
  authoritative statement was reached.
  THE ONE NUMBER THAT WAS WRONG AND EXPLAINS THE WHOLE OLD PICTURE: the
  columns were 2.2 units wide under a 74 unit shaft. That is thirty-four
  diameters. A Corinthian column is nine to ten including its capital, so the
  facade rendered as about ten identical hairline sticks in a row and the
  published phrase "massive pairs" was true only in the comment above them.
  The shaft is now 55 units over a 6 unit diameter, 9.2, with a one diameter
  capital, a pedestal under it and an abacus over it. The order, derived, not
  a look chosen by eye.
  THE SECOND DERIVATION, the width of the central block: three colossal arches
  and four pairs of freestanding columns cannot stand in 74 units, so the old
  pavilion was not Hunt's block, it was a doorcase. The block is the OSM
  south-east run itself, 148 units centred on where the Great Hall projects,
  which is as wide as the run allows symmetrically. Everything else follows
  from those two: arches at 46 unit centres on a 15 unit radius, pairs in the
  four gaps between them.
  NOW DRAWN, and none of it was there before: archivolt rings with keystones,
  a tripartite window in each opening, the six spandrel medallions, a three
  band entablature with a projecting cornice and a lit soffit, an attic, a
  rusticated basement course, and on the wing a water table, a string course,
  a cornice, a parapet and real window openings with reveals instead of
  scratch lines.
  WHAT LOOKING CAUGHT, four things, none visible in any count. (1) The six
  medallions came back INVISIBLE on the first render: placed at the arch
  haunch they landed exactly behind the column pairs, which is the only place
  on this facade they could not be seen. (2) The ground shadow existed all
  along at opacity 0.07 and read as paper, which is why the previous run
  recorded it as missing; it is 0.16 now and eleven and a half acres stop
  floating. (3) The skylight banks were drawn on the roof plane with nothing
  under them and read as three glass planks hung in the sky; each stands on a
  5 unit curb now, and the curb's own shade is what attaches them. (4) The
  roof deck was #efe9db against a near white page, so the largest surface in
  the drawing read as sky; it is the darker roof line tone now.
  Named gaps, all of them: no published facade height, arch span or rise, no
  column height or diameter, no bay widths, no attic or entablature height, no
  step count or staircase width, no medallion, caryatid or pyramid size, and
  no published length for the Fifth Avenue frontage alone. The four caryatids
  representing painting, sculpture, architecture and music are published and
  are NOT drawn, because nothing reached gives their size or position, and an
  invented figure on a facade is worse than an honest absence.
  OWED, worst first, and the two adversarial critics did not fit in the 25
  minute ceiling; the renders at yaw -0.62 pitch 0.34 and yaw -1.15 pitch 0.42
  are what this build was verified on. (a) The staircase has no cheek walls,
  so from an oblique angle it fans out as a stack of loose planks beside the
  building rather than as masonry. (b) The roof is still the largest surface
  in the model and carries nothing but the three banks. (c) The wings away
  from this front run are still the flat slabs the previous run reported; they
  are drawn by shellSolid, not by the facade, and bays there are a separate
  and larger change.

- constitution, USS Constitution (2026-09-05, the landmark routine). Published
  and quoted in the file header: mast heights fore 198, main 220, mizzen 172.5
  ft, beam 43 ft 6 in, draft 21 forward and 23 aft, 207 ft billet head to
  taffrail, 304 ft bowsprit to spanker, armament 30 long guns and 22
  carronades, the boats by name and length, Paul Revere's copper sheathing, the
  billethead, and from the USS Constitution Museum the stern's "six windows in
  the transom, with pilasters separating them" and the "spread eagle" near the
  taffrail. Sources: en.wikipedia.org/wiki/USS_Constitution and
  ussconstitutionmuseum.org/2017/02/03/the-quarter-galleries/.
  WHAT THE PICTURE SHOWED THAT THE NUMBERS DID NOT. The hull, sheer,
  tumblehome, ports, mast heights and shrouds were all already correct and
  the render still read wrong, in four ways no arithmetic could catch. The
  STERN was one flat black quad: a frigate that ended in a cliff. The masts
  had yards and NO FIGHTING TOPS, so a square rigger had no platforms at its
  doublings. There was no shadow, so 1,576 tons floated like a decal on the
  water. And the topside was one black field with a single stripe, no wale
  and no copper. All four are now drawn: a six window transom with five
  pilasters, a taffrail moulding, the eagle, a windowed quarter gallery at
  each after corner, tops on all three masts, two water shadows, a wale under
  the gun stripe, and the copper boot top.
  AND THE PICTURE CAUGHT MY OWN ERROR TWICE. The copper first ran a third of
  the way up the topside, because the published draft was applied as though
  z = 0 were the keel; in this model z = 0 IS the waterline, so almost all of
  Revere's copper is under water and only the boot top can be drawn. The
  frigate looked like a rusty barge and the number behind it was right. The
  earlier slip was cheaper and worse: the file was assembled with the old
  function's `return out;` left in the middle of it, so every addition sat
  after a return, the render came back BYTE IDENTICAL to the old one, and the
  syntax check passed. A model that renders unchanged after a rebuild is not
  a subtle bug, it is the whole run wasted, and the only thing that found it
  was comparing the two file sizes.
  NAMED GAPS: no published transom width, window size, pilaster spacing,
  quarter gallery projection, fighting top diameter, head rail run or
  billethead size. Each is derived from a published number at the line that
  uses it. Four of the eight published boats are not drawn and are named in
  the header rather than invented to reach the count.

- paul-revere, old-state-house and park-street, three Freedom Trail stops
  (2026-09-05, the landmark routine). Published, quoted in each file header.
  PAUL REVERE: main section "30 by 48 feet", rear ell "about 16 by 16 feet",
  "two stories high", the east front "divided vertically into four bays", the
  second storey "cantilevered above the sidewalk", a "steep pitched roof" with
  "a gable that runs parallel to the street", "two chimneys", "casement
  windows grouped in pairs, with rhombus-shaped panes", "clapboard", the
  courtyard "paved in brick" (Wikipedia, citing the NHL file); the front faces
  EAST, the main part is "four bays wide" with "the second story featuring a
  framed overhang", and "a two story ell extends two bays deep" with "a
  similar overhang" (HABS MA-491, Library of Congress ma0478).
  WHICH DIMENSION IS THE FRONT was DERIVED from two published facts rather
  than picked: the gable runs parallel to the street, so the street front is
  the eaves side and takes the longer figure, 48 ft, and the check is the
  roof. A ridge parallel to a 48 ft front spans the 30 ft depth, 15 ft of
  rafter each side, which is a seventeenth century roof; the other reading
  spans 48 ft and puts a roof taller than the house on top of it. Second
  check, the bay module: 48 over the published four bays is 12 ft, which is
  what a pair of casements and their frame occupy.
  A PUBLISHED CONTRADICTION, named not smoothed: the same article gives the
  main section as 1,430 sq ft and the lot as "about 1,475 square feet", so
  the house would cover 97 percent of a lot that also holds a brick
  courtyard. The footprint is used and the lot figure is not. HABS and the
  article also disagree on rooms per floor, one against two; neither is
  visible from the street and neither is drawn.
  OLD STATE HOUSE: plan 36 ft 4 in by 112 ft 7 in (SAH Archipedia, carried
  over from the scene this replaces); "At 65 feet (20 meters), it was also
  the tallest building in Boston until 1745"; it "rises 2+1/2 stories above a
  partially raised basement"; the gambrel roof "replaced by a gable roof" and
  the octagonal tower by "a tiered square tower" after 1747; lion and unicorn
  "installed between 1743 and 1751", torn down and burned in 1776, replicas
  in 1882 and a "new unicorn and lion's head" in 1901; laws "announced from a
  small balcony"; Clough's "gilded eagle to the western elevation"; "A clock
  was added sometime between 1817 and 1825" and the east "sundial was
  replaced with a clock" in 1830 (Wikipedia). The 2014 carpentry restored
  "the balustrade and crown molding at the east facade balcony" (M and A
  Architectural Preservation), which is why the balcony now has a balustrade
  rather than the white slot it was.
  HOW THE PUBLISHED 65 FT IS SPENT is the one place that model commits, and
  it was chosen because it satisfies BOTH published storey counts at once:
  raised basement to 4.5, two full storeys to 26, an attic half storey to a
  33 ft eave, ridge 42, the square tower's stages to 56, lantern, dome and
  vane finishing at 65. SAH's three ranks of window are all on the elevation
  and so is Wikipedia's two and a half above a raised basement.
  PARK STREET was NOT rebuilt. Its research is the best on the trail already,
  Bowen's 1833 stage by stage description, and its model implements it. Two
  checklist defects were fixed in place: it had no ground shadow, so it
  floated, and its grass pad was 320 ft square around a published 80 by 118
  lot, which is the Bunker Hill and Old South lesson a third time. The stage
  fits itself to everything the scene draws, ground included, so the pad was
  setting the frame and shrinking a 217 ft steeple to a stamp; at 150 by 172
  the church nearly doubles on the page. No published dimension was touched.
  WHAT LOOKING CAUGHT, none of it visible in any count. (1) The Revere
  house's big chimney, placed 4.4 ft clear of the gable wall where the plan
  arithmetic said the stack sits, came back as a free standing brick tower
  beside the house; a chimney at the end of a gable rises THROUGH the roof,
  inside the wall line, and it is at x0 + 2.6 now. (2) The ell's chimney was
  given the same constant depth past every roof strip that the main stack
  needs, and painted over the main roof it stands behind; it takes its depth
  from its own geometry now, because a constant that says "in front of
  everything" is only true for the thing that IS in front of everything.
  (3) The Old State House's lion and unicorn, drawn as seven stacked
  rectangles each, came back as a gold scrap and a WHITE LADDER: a white body
  in white panels against a near white sky is a wireframe, not an animal.
  Each beast is one silhouette polygon now, with a stroke heavy enough to
  hold the unicorn off the sky and an ivory rather than a paper white. That
  is checklist item 1 and item 9 failing together, on the one feature every
  visitor to that building names.
  Named gaps, all three files: no storey heights, no roof pitches, no
  overhang projection, no chimney dimensions, no clapboard exposure (courses
  drawn at 2.2 ft, because a true lap hatches into a grey smear at map
  scale), no door positions, no bay count on the Old State House long walls
  (nine is derived and 112.58 over nine is a 12.5 ft Georgian bay, which is
  the check), no tower plan or stage heights, no cupola dimensions, no
  dimension for the lion or the unicorn, no step counts. The Old State
  House's gilded eagle is drawn on the WEST elevation where it is published,
  which the page's default yaw culls; that is where it is, and moving it to
  be seen would be a different building.
  OWED: the two adversarial critics did not fit inside the run's 25 minute
  ceiling. The renders at yaw -0.62 and -1.95 (Revere), -0.62 and -2.10 (Old
  State House) and -0.62 (Park Street) are what these builds were verified
  on. First thing for the next run, worst first: (a) Park Street's shadow
  falls away from the page's default camera, so it reads as a thin band on
  the -x side rather than as a shadow; the same is true of every trail form
  and is a property of LIGHT = [0.60,0.30,0.68] against a camera that sees
  +y and -x, worth solving once for all of them rather than five times.
  (b) the Revere house's two pavement pads overlap at the corner and read as
  two rectangles rather than as a courtyard and a street. (c) the Old State
  House roof is the largest surface in that model and carries nothing; no
  source reached publishes dormers or plant, so it is flat.
- capitol, lincoln, jefferson, monument (2026-09-03, the four heroes)
- trump-tower, 725 Fifth Avenue (2026-09-05), New York's third landmark.
  Published and load bearing: 664 ft, 58 storeys, "28-sided" with "horizontal
  setbacks", gold tinted reflective glass, a five storey 15,000 sq ft atrium
  with a 60 ft waterfall and 240 tons of Breccia Pernice, 34 in brass letters,
  34 lifts, Der Scutt of Swanke Hayden Connell, begun 1979 and opened 1983.
  The lot outline was MEASURED this run from OpenStreetMap way "Trump Tower",
  addr 721/725 5th Avenue, 24 vertices spanning 197.5 by 184.7 ft, and is used
  for the podium only, because it is the lot and not the tower above it.
  THE 28 SIDES ARE A COUNT IN THE GEOMETRY, NOT A CLAIM IN A HEADER. The
  number is published and its distribution is not, so the sawtooth is put
  where Der Scutt put it and where the photographs show it: 8 bays on Fifth
  Avenue and 5 on 56th Street, two sides each, flat north and west. 16 + 10 +
  2 = 28. The scene returns its own side count and the build asserts it.
  Drawn first, it came back 29, because the walk closed on a duplicate vertex
  and a zero length side. That is the cheapest possible demonstration of
  checklist item 1: a count in a comment is not a count in the geometry.
  WHAT LOOKING CAUGHT, and the first one is the whole model: at the site's
  usual yaw the renderer showed the NORTH and WEST elevations, which are the
  two FLAT faces, and the tower came back a plain brown box with its 28 sides
  entirely invisible. The camera was turned past a right angle so the serrated
  Fifth Avenue and 56th Street faces are toward the eye, and the angle was
  derived from faceVisible rather than guessed. Then the sawtooth at a 9 ft
  bay depth read as CORRUGATED, a radiator rather than a faceted slab, so the
  depth gave way, because the published fact is the count and not the depth.
  Then the 56th Street elevation came back nearly black, because this file was
  picking a tone by hand from the same normal the renderer's shader was
  already using: two shadings stacked. The hand tone came off.
  Named gaps: the podium height (82 ft, and no lower than the published 60 ft
  waterfall), the tower plan, the bay depth, the two setback levels and their
  step, the storey band, the canopy and the sign band are all ASSUMED and
  marked. The atrium, the waterfall and the pink marble are the building's
  famous interior and none of it is visible from the street, so none of it is
  drawn. The brass letters are a band, not letterforms: 34 inches is under a
  pixel here.
  Reachable: it is in the Destination Book with a thumbnail, a share link and
  a fifteen minute spoken guide.
- space-needle, Seattle (2026-09-05). The city Sean actually sells tours in,
  and the routine's own queue calls it the one that could sell a tour. The
  research was already done and sourced in seattle-3d.js: 605 ft to the tip,
  deck at 520, top floor 518, restaurant 500, 138 ft across the top, a 120 ft
  square foundation 30 ft deep, 102 ft at the base of the legs, the waist at
  373 ft, three PAIRS of legs in 36 in welded columns. NOT ONE OF THOSE MOVED.
  What was wrong was the picture, and it was wrong in the way this file keeps
  describing: the legs, drawn at their published 3 ft, rendered as hairlines
  beside a core that read as a trunk, which INVERTS the style's own tell that
  the legs are the structure. The fix was contrast, not a changed dimension.
  WHAT ELSE LOOKING CAUGHT: no ground shadow at all; then a physically
  projected one that read as a pond on the lawn, replaced by the footprint
  convention the rest of the site uses; a roof whose 24 segment edges made it
  a fanned parasol; and a halo ring drawn at radius 24 where its own roof is
  already 34 ft out, so it was buried inside the cone and invisible however
  carefully the comment described it. Added: the three elevators, leg
  footings, the overhanging eave and fascia, the deck's glass guard, the
  aircraft beacon.
  COLOUR HANDLED AS A GAP RATHER THAN A GUESS: the 1962 names are published
  (Orbital Olive, Astronaut White, Re-entry Red, Galaxy Gold) and none of them
  is today's tower. Gold came back for six months in 2012 and again in 2022,
  and the roof returns to Astronaut White. No source reached gives today's
  colour, so it is drawn white and the history is in the header.
  Reachable, which is the other half: the tours page already drew it, and it
  is now in the Destination Book's model map with a thumbnail, so searching
  "space needle" shows the building and opens the turnable model.
- old-state-house and paul-revere (2026-09-05, by the landmark routine;
  reviewed, corrected and committed by a live session, which is the pass the
  routine's own 25 minute ceiling can never fit). Both were the boxes the
  standard exists to stop: the Old State House a long red barn with a toy
  cupola, flat blue windows, no cornice, no base and no shadow, carrying NONE
  of the three things a visitor comes for; the Paul Revere House a plain brown
  box with sash windows from the wrong century and no overhang at all, which
  is the one tell its whole style rests on.
  The Old State House now carries what it is famous for: the balcony the
  Declaration was read from on 18 July 1776, the 1831 Simon Willard clock, and
  the gold lion and the silver unicorn standing on the east parapet, with the
  tower in the DIMINISHING stages the style book requires rather than one
  taper. The Revere House carries the jetty, the pendants, leaded casements in
  pairs, clapboard courses and the steep gable of a First Period house.
  WHAT LOOKING CAUGHT in the reviewing pass, after the routine had finished:
  the Revere House's main chimney was 4.8 by 7.6 ft and read at the street
  view as a factory pipe standing against the gable, which is the exact
  opposite of the tell. STYLES.md says a First Period chimney is "a masonry
  core, not a flue: it is the widest thing on the roof", and the published
  note that both stacks are "comparatively large because they each serve
  multiple rooms" says it again in the source's own words. Widened to 7.2 by
  9.0 with a shorter neck, and it reads as the core the house is built around.
  The plan size stays ASSUMED; no source reached publishes it.
  The session's own discarded attempt found two things worth keeping even
  though its files were replaced: a jetty of a foot or so does not read at 800
  pixels until the SHADOW it throws on the wall beneath is drawn, and a roof
  slope that runs the whole length of a building will paint over every dormer
  standing on it unless each dormer is given an explicit depth. Both are the
  painter's trap and the eye test, met again.
  Verified after the corrections at four angles including the street level
  pitch floor, on the page's own renderer: syntax clean, no em dashes,
  /api/forms/trail lists all seven rebuilt stops and the page's loader fetches
  them, and both files are served 200.
- bridge and empire, the two New York landmarks (2026-09-05). [SEAN:
  "realistic the 3D model of empire state building and brooklyn bridge".]
  Both were pre-standard: the bridge was two slabs, a hairline cable and a
  tower with two slots, the tower nine stacked boxes with scratched window
  lines. New York got the dc-form mechanism the trail already had: a landmark
  registers window.NYC_FORMS[k] from its own nyc-form-<k>.js and takes over
  from the scene in nyc-3d.js at DRAW time, so the page's fixed cameras, its
  labels, the span/tower buttons and the tower's opening animation are all
  untouched. render_room.js gained the nyc: route so the offline tool draws
  through the page's own renderer.
  BRIDGE, published and quoted in the file header: main span 1,595.5 ft and
  land spans 930 ft (NPS); roadway 119 ft above high water at the towers and
  135 ft at midspan, so the deck cambers 16 ft; navigational clearance 127 ft;
  stiffening trusses 33 ft deep; deck 85 ft wide; promenade 18 ft above the
  roadways; tower plan 140 x 59 ft at the water, 131 x 48 at the roadway,
  136 x 53 at the top (NPS and the 1906 figures via nycsubway.org); arch
  opening 33.75 ft wide and 117 ft above the roadway, struck on a published
  46 ft radius (Structure); 25 stays per fan spread between the published 138
  and 449 ft. The 276.5 ft tower height is kept because the page's own label
  already says it, and the disagreement with Wikipedia's 278.25 and Structure's
  271 is recorded rather than resolved.
  EMPIRE, published: base 424 x 187 ft; setbacks at 5, 21, 25, 30, 72, 81 and
  85; bay counts off the LPC designation report LP-2000 p.16 (15 bays to the
  21st on the long fronts, 11 to the 30th, 9 above; 9, 7, 6, 5 on the short);
  86th floor 1,050 ft, 102nd 1,224 ft, roof 1,250 ft, tip 1,454 ft; the 1953
  broadcast tower 200 ft; 24 windows on the 102nd. The published "60 ft setback
  on all sides" CONTRADICTS the published 28 ft office depth and the quarter
  lot zoning area if applied north to south, so the north-south plans are
  derived from the latter two and the contradiction is stated in the header
  rather than hidden.
  WHAT LOOKING CAUGHT, none of it visible in any count. (1) The old scene's
  arch openings were centred 57.9 ft off the tower axis, OUTSIDE the 131 ft
  tower plan: the page's own "the pointed arch" dot had been pointing at empty
  stone for as long as the page has existed. They sit at 27.46 ft now. (2) The
  tower view's arches vanished under their own cable web: 25 stays a fan on
  four planes at full weight hatched the openings into a smudge, and a face
  probe proved the openings were genuinely open, so the fix was the veil and
  not the geometry. That defect survived a fix round and was still there at the
  end; it was corrected in this session by thinning the tower view's stays to
  the width and opacity the span view already proved. (3) A deck shadow was
  drawn and invisible because a bias of -990 cannot beat water at -999 when
  centroid depths spread over 400 units. (4) Made visible, it was a ladder of
  pale seams: forty abutting translucent quads rounding apart under toFixed,
  the Vietnam Memorial lesson arriving again. (5) On the tower, the Empire's
  roofs painted over their own walls' feet, the painter's trap, fixed by tiling
  every roof at 40 ft. (6) The ends of the span read as burnt black blocks;
  the cut faces are stone now, because no part of this bridge is black masonry.
  THE TILT CEILING WAS RE-MEASURED, AND THEN THE MEASUREMENT WAS CORRECTED,
  which is the more useful half. The rebuilt tower view is taller in its frame
  than the scene it replaced, and at the old 0.30 ceiling its cornice ran 55
  units above the top of the box, so TILT_CEIL.tower is 0.24, the last angle
  where nothing leaves the top. The first version of this entry also claimed
  every view now fits its box at the floor, the default and the ceiling. That
  was wrong, and it was wrong because the box height was ASSUMED rather than
  read: bridgeScene returns 980 by 340 for BOTH framings, not the 720 by 620
  the tower view was checked against. Read from the scene itself, the tower at
  nine times zoom runs past the BOTTOM of its box at every pitch, and the
  original scene did the same by 89 units at the page's own default, so the
  cropped pedestal is this view's framing and not a fault of the rebuild. What
  was new, and what 0.24 fixes, is the top. Cropping masonry standing in the
  water is a choice; cropping the top of the tower is a mistake.
  The empire's ground plane has always run past the bottom of its box above
  pitch 0.5, before this rebuild and after it, identical to the unit; that
  number is left exactly as it was because it is not this rebuild's to change.
  THE LESSON, and it is the one this file keeps writing down: a frame size is
  a fact to read off the scene, never a number to carry over from the scene
  next to it. Two views of one model here have different frames, and the whole
  check was run against the wrong one without anything failing.
  A CLAIM IN A BUILD REPORT THAT DID NOT SURVIVE CHECKING: the bridge build
  recorded that the far anchorage rises 17 units above the span box at the 0.44
  ceiling and recommended lowering it to 0.40. Re-measured here it is inside by
  1.4 units. A later fix round had cured it and the note was stale. Verify a
  gap before acting on it, including one written by the builder.
  THE VERIFICATION TOOL PRODUCED TWO FALSE BLOCKING FINDINGS, which is worth
  more than either of them. Both critics judged renders taken at yaws the page
  never uses, and reported the Brooklyn back span "ending in mid-air" and the
  model "not fitted to the frame". The page's cameras are FIXED: only yaw turns,
  so at yaw 0.9 the drawing legitimately runs past the frame edge. Rendering the
  ORIGINAL scene at the same angles proved it does exactly the same, by
  arithmetic (y to 409 in a 340 tall box) and in the picture. An off-camera
  render is a culling probe, not a framing judgement, and a critic handed one
  without that context will report the frame edge as a broken model.
  Named gaps, both files: the bridge's cornice and parapet stages, voussoir
  ring depth and count, cable plane offsets, stay attachment points, anchorage
  vault sizes and coursing spacing are ASSUMED and marked; the published 971
  and 1,562.5 ft approach ramps do not fit the page's box and are drawn as
  stubs; only four stiffening trusses are drawn because no post-1954 truss
  dimensions were reached. The Empire's storey heights, every setback plan, the
  mast tier plans, the portal and eagle sizes, the crown ring spacing and the
  antenna widths are ASSUMED and marked; the gold EMPIRE STATE letters, the
  eight cone openings and the individual 102nd floor windows are sub-pixel at
  this scale and are not drawn.
  OWED: the two adversarial critics ran twice on the bridge and once on the
  Empire; the Empire's second round and the page integration died on the
  account's monthly spend limit, so the Empire carries one review round rather
  than the standard's two. Its outstanding notes are in the build report. The
  remaining bridge notes, worst first: the voussoir ring is one pale band at
  900 px rather than 16 readable wedges, so either the joints get a tone step
  or the header should stop claiming a count; the anchorage openings are flat
  dark panels with no ring or reveal where the street sees deep stone vaults;
  and the tower crown's parapet is thicker than the cornice below it, which
  inverts the real profile.
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

- greek-roman, the Leon Levy and Shelby White Court, Met gallery 162
  (2026-09-06, the landmark routine). REFUSED, and the negative is reported
  rather than left for a third run to rediscover.
  PUBLISHED and reached this run (metmuseum.org press, 2006 and 2007): the
  court is "a monumental, skylit peristyle for the display of Hellenistic and
  Roman art with a soaring two-story atrium", inside galleries totalling more
  than 30,000 square feet, opened 20 April 2007 after a fifteen year project.
  THE GAP: not one DIMENSION of the court in feet, and no published column
  count for the peristyle. A square footage for the whole suite of galleries
  is a programme, not a room, and a peristyle drawn with a guessed column
  count fails checklist item 1 by definition. Item 7 says heights are TRUE or
  it is not committed, so it was not committed.
  WHAT WOULD UNBLOCK IT: the Kevin Roche office's own published drawings, or
  an architectural review of the 2007 opening in a journal that prints plan
  dimensions. The Met's collection API, which supplies every other room here,
  describes OBJECTS and will never carry a room.
  The remaining object-in-a-box rooms after this run are greek-roman,
  arms-armor, lehman, grand-stair, euro-paintings and nineteenth-century.
  arms-armor is the strongest next candidate: the Equestrian Court's four
  mounted figures are armours, and armours have published dimensions in the
  API, which is exactly the route that worked twice today.
  ONE STEP TAKEN ON IT ALREADY, so the next run starts past it: the API's
  search CANNOT be filtered by gallery, and a q="armor for man and horse"
  query over department 4 returns armours in galleries 373 and 378, not the
  Equestrian Court's gallery 371. Two objects were read and neither is one of
  the four horsemen: object 23205, an Italian armour ca. 1400-1450, H. 66 1/2
  in., gallery 373; object 35728, a Japanese tatami gusoku, H. 63 in., gallery
  378. Both are real published heights and both are for a different room. The
  route that will work is the Met's own gallery 371 page or the court's label
  text, which name the four armours; then the API gives each one its height,
  and a rider's true height over a horse is the whole scale of that room.
  RESOLVED 2026-09-06, the next run did it: the fix is not the search at all,
  it is fetching objects and filtering on their own GalleryNumber field. See
  arms-armor in the rebuilt list above. The rooms still object-in-a-box are
  greek-roman, lehman, grand-stair, euro-paintings and nineteenth-century.

  ADVANCED 2026-09-07 by the landmark routine, and the advance is exactly the
  one the entry above asked for, so the next run starts past it. The route
  that unblocked arms-armor was run on gallery 162: fetch objects and filter
  on their own GalleryNumber field. It works, and the court's SCALE is now
  published rather than guessed. Twenty six objects were read this run and
  every one carries GalleryNumber 162 on its own record:
    247000, "Marble statue of a youthful Hercules", H. 97 3/16 in. (246.9 cm),
      which is 8.10 ft and is the tallest thing verified in the court;
    247001, "Marble statue of a bearded Hercules", H. without pedestal
      93 3/4 in. (238.20 cm), 7.81 ft;
    247105, "Marble statue of a togatus", H. 72 in. (182.9 cm);
    254925, "Marble statue of Hermes", 71 1/4 x 29 1/2 x 23 1/2 in.;
    246993, "Marble statue of a girl", H. with plinth 175.3 cm;
    247003, "Marble statue of a seated muse", H. as restored 66 in.;
    246994, "Marble statue of a woman", H. 65 in.;
    254697, "Marble statue of Aphrodite", H. with plinth 62 1/2 in.;
    248141, "Marble statue of a draped seated man", H. 51 1/2 in.;
    248132, "Marble statue of an old woman", H. 49 5/8 in.;
    256403, "Marble Statue Group of the Three Graces", 48 7/16 x 39 3/8 in.;
    254819, the sarcophagus with the Triumph of Dionysos and the Seasons,
      ca. 260-270 CE, 34 x 85 x 36 1/4 in., which is the court's signature
      object and is 7 ft 1 in long;
    245585, sarcophagus with garlands and the myth of Theseus and Ariadne,
      31 x 85 3/4 x 28 in.;
    254590, sarcophagus with the myth of Selene and Endymion, H. 28 1/2 in.
  So the vertical scale of the lower storey is settled the way the Medieval
  Hall's was: a colossal Hercules standing 8.10 ft sets the floor to cornice
  minimum, and a two storey atrium above it follows.

  STILL REFUSED, and only one number is missing now: the PERISTYLE COLUMN
  COUNT. The Met's own press text calls the room "a monumental, skylit
  peristyle", so the colonnade is the feature a visitor names, and checklist
  item 9 is not satisfied without it while checklist item 1 forbids drawing it
  on a derived module. Two precedents in this file say the same thing about a
  count in the most prominent feature, this entry's own first refusal and the
  american one, so it was not overturned on a run that had no new evidence
  about columns. Deriving a count from an intercolumniation rule would be a
  guess wearing a measurement's clothes.

  WHAT IS LEFT TO FIND is therefore narrow: the number of columns on one side
  of the gallery 162 peristyle, or a plan that shows them. The Kevin Roche
  office's drawings and a 2007 architectural review remain the named routes.
  A photograph counted the way the american facade was counted would also do
  it, and unlike that facade a colonnade in a skylit court separates cleanly
  from its background, so the photograph route is likely EASIER here than it
  was there.

  THE COLLECTION API RATE LIMITS, which no entry here had recorded and which
  cost this run its build. After roughly two hundred object fetches in a few
  minutes the search endpoint returned HTTP 403 and then an Incapsula block
  page to both urllib and curl, with or without a browser User-Agent. Object
  fetches by id were fine up to that point. Pace the calls, cache what comes
  back to a file the moment it arrives, and do the research for every room a
  run intends to build in ONE paced pass before any building starts.

- moma, the Museum of Modern Art exterior (2026-09-05, the landmark routine).
  CLAIMED at the start of the run, then RELEASED unbuilt, and the claim was
  removed rather than left to block another builder. The reason is the
  standard's first rule and it is worth writing down, because the failure is
  not laziness and the next run should not repeat the four dead ends.
  WHAT THE PICTURE SHOWS, and this is why it was picked: rendered at
  `node render_room.js moma:closed -0.62 0.40`, the current model is a grey
  striped slab. Six identical glazing bands wrap all four faces, the marble
  MoMA is actually faced in is nowhere in the palette, the recessed ground
  floor the file's own comment calls "the cheapest single line that makes it
  MoMA" does not read at this angle, there is no ground shadow, and the mass
  reaches the right edge of the frame. It is an office block on a pale pad.
  The file does not hide this. Its own comments say the height is set because
  extruding the wayfinding plan "produced a squat slab that looked like a car
  park", that mullion spacing "is a drawing decision, not a measurement", and
  that "THE PLAN IS NOT THE FOOTPRINT". So every number in it is invented,
  which is exactly what a rebuild exists to fix.
  WHAT IS PUBLISHED AND WAS REACHED THIS RUN: the 1939 Goodwin and Stone
  building is "a six-story structure ... a white marble box with a glass-walled
  base, two levels of galleries with translucent glazing, and upper-level
  offices with horizontal strip windows"; Taniguchi's 2004 rebuild kept only
  the 53rd Street facades of the 1939 building, Johnson's 1964 East Wing and
  Pelli's Museum Tower, and brought the campus to about 630,000 sq ft; the
  2019 Diller Scofidio + Renfro expansion added about 50,000 sq ft of gallery
  space; the adjoining Museum Tower is 56 storeys (Wikipedia, Museum of Modern
  Art; moma.org).
  THE GAP THAT BLOCKED THE BUILD: not one exterior DIMENSION in feet. No
  facade width, no depth, no height, no bay count. A storey count and a square
  footage are a programme, not a building, and checklist item 7 says heights
  are TRUE or the model is not committed. Building the envelope from the
  wayfinding plan again would reproduce the exact model being replaced.
  FOUR ROUTES TRIED THIS RUN, ALL DEAD, so the next run starts past them:
    a. Wikipedia, Museum of Modern Art. Carries the storey count and the square
       footages and NO dimension of any kind. Checked and reported as a
       negative, the same way the state-house entry does.
    b. the NYC Landmarks Preservation Commission designation report, which is
       where a New York building's facade width and bay count normally live.
       Three searches failed to surface a report for 11 West 53rd Street.
       s-media.nyc.gov/agencies/lpc/lp/2420.pdf appeared in the results and was
       NOT opened for lack of run budget; it is the strongest remaining lead
       and the next run should open it FIRST.
    c. Overpass, the route that measured the Castle, NMAAHC and the National
       Museum of American History footprints. A name query over the block
       bounded by 40.7595,-73.9800 and 40.7640,-73.9740 returns an EMPTY
       element list: MoMA's footprint is not tagged with its name there. A
       plain `building` query over the block would return the whole street and
       needs a way id, not a name, to be useful.
    d. the museum's own architecture page,
       americanhistory-style, at moma.org and americanhistory.si.edu, returns
       HTTP 403 to WebFetch, as SAH ARCHIPEDIA already does. Two of the three
       best architectural sources on this project are now closed to the
       routine, which is worth knowing before planning a run around them.
  WHAT WOULD UNBLOCK IT: the LPC report at (b), or the 1939 press release in
  MoMA's own archive at moma.org/documents, which announced the new building
  and is the kind of primary source that states a plot size in feet.
  TWO MORE ROUTES CLOSED, 2026-09-06, so a third run does not pay for them:
    e. the LPC report at (b) WAS opened this run. s-media.nyc.gov/agencies/lpc/
       lp/2420.pdf downloads fine, 3.1MB, and CANNOT BE READ on this machine:
       WebFetch returns the raw stream, there is no pdftotext, the Read tool
       needs pdftoppm which is not installed, and system python has no Quartz.
       The lead is still good and is now blocked on a TOOL, not a source. A
       run that installs poppler, or a session with a PDF reader, unblocks
       MoMA in one step.
    f. Overpass by bounding box was refused by the sandbox this run (the curl
       was denied), so route (c) could not even be retried.
  THE TOOL BLOCK AT (e) IS LIFTED AND THE LEAD IS DEAD ANYWAY, 2026-09-07.
  s-media.nyc.gov/agencies/lpc/lp/2420.pdf downloads and now READS, in full,
  through pdftext.js. It is not MoMA. LP-2420 is the JAPAN SOCIETY
  HEADQUARTERS, 333 East 47th Street, designated 22 March 2011. It surfaced
  in a search for a MoMA designation report and was never one; two runs have
  now called it "the strongest remaining lead" on the strength of a search
  result nobody had opened. Closed conclusively.
  WHAT IS LEFT FOR MoMA, in order: the 1939 press release in MoMA's own
  archive at moma.org/documents, which is the primary source most likely to
  state a plot size in feet; a real LPC designation report for 11 West 53rd
  Street, if one exists at all, found by LP number rather than by search; and
  Overpass by way id rather than by name, which route (c) showed is the only
  form that can work there. The PDF half of this block no longer exists, so
  any PDF found from here is readable.

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
  RETRIED 2026-09-05 by the landmark routine and still blocked, recorded so a
  third run does not spend its budget the same way: a targeted search for the
  Mall-elevation pier or bay count returns only the SAME prose already quoted
  above, "regularly spaced, rectangular slabs of wall ... treated as a modern
  equivalent of columns", with no number anywhere; and the museum's own
  architecture page, americanhistory.si.edu/explore/stories/museums-
  architecture-classical-modern-details, returns HTTP 403 to WebFetch exactly
  as SAH ARCHIPEDIA does. The count is not on the open web in prose. It has to
  come off a DRAWING, which means the NCPC PDF or the HABS sheets, or off a
  rectified photograph of the Mall facade counted by eye.
  Get that PDF read, or find the HABS sheets, before building. Drawing the
  piers on an invented module would put a guessed count in the model's most
  prominent feature, and drawing no piers at all would leave a marble box,
  which is the exact failure Sean called unacceptable.

- state-house, the Massachusetts State House (2026-09-05). Published, quoted
  in the file header and load bearing: the Columbian Centinel of 10 January
  1798, reproduced in the National Historic Landmark nomination (NRHP
  66000771), gives "173 feet front, and 61 deep", "a basement story, 20 feet
  high, and a principal story 30 feet", an "Attic 60 feet wide, 20 feet
  high, which is covered with a pediment", "a dome 50 feet diameter and 30
  feet high", "an elegant circular lanthorn, supporting a gilt pine cone",
  a portico "94 feet in length, and formed of arches which project 14 feet"
  carrying "a Colonade of Corinthian columns of the same extent above", and
  walls "of large patent bricks, with white marble fascias, imposts and key
  stones". Counts off a frontal photograph on Wikimedia Commons: seven
  arches, twelve columns coupled in pairs at both ends, three bays a wing.
  CHECKED THIS RUN AND REPORTED AS A NEGATIVE: the Wikipedia article on the
  building publishes NO dimension whatever, no width, depth, storey height,
  dome diameter, column count or total height. What it does carry, and what
  the model leans on for checklist item 9, is that the dome is GILDED and was
  re-gilded "in 1969, at a cost of $36,000" and again "in July 1997" for
  "around $300,000".
  THE FINDING, and it is the whole reason this file exists: the scene it
  replaces had every published number RIGHT and rendered as a blank brick
  warehouse. The portico, the arcade, the twelve columns, the wings' windows,
  the attic and the pediment were all drawn on the south face, the south face
  sat at -y, and at the page's own opening yaw of -0.62 that face is culled:
  faceVisible(0,-1) = -cos(0.62) = -0.81. Every piece of architecture in the
  model was on the side nobody could see, and the reader got the one wall
  that had nothing on it. The building is turned so the front is at +y, which
  is what Old State House had already recorded in trail-3d.js after making
  the same mistake, and what Bunker Hill and Old North both sprang again on
  the day they were rebuilt. ARITHMETIC CANNOT CATCH THIS. Every count, every
  dimension and every depth was correct in the version that rendered as a
  warehouse.
  ADDED to reach the nine item list: a granite water table so the brick does
  not grow out of the lawn; a ground shadow; brick course banding as the
  second tone, a texture and not a count, since no source reached gives a
  course height; a marble string course at the published 20 ft storey line
  and a two course main cornice at the published 50; the balustraded parapet
  carried round the whole block instead of the front wings only; a light
  marble SURROUND struck round every opening before the dark glass is struck
  inside it, which is item 8 and is what stops a window being a stain at 900
  pixels; marble imposts and keystones round each of the seven arches; the
  colonnade's entablature split into an architrave course and a crowning
  cornice; a drum and its cornice under the dome; a second gold tone as a rib
  on the dome, because one flat gold reads as a brass bowl; the pediment's
  two raking cornices; and three low granite steps at the arcade.
  CHECKLIST 4, said out loud rather than faked: the main block really does
  end in a FLAT roof behind that balustraded parapet. The roof this building
  is meant to show is the dome; the parapet hides the rest. So the lid stays
  a lid.
  Named gaps: no published pediment rise, lanthorn height, or dome set-back
  (all derived); no published tread count at the arcade (three drawn); and
  the entire NORTH back elevation, which no source reached describes, because
  Bulfinch's back was built over by Charles Brigham's extension in 1895. The
  back carries the front's own courses, cornice, parapet and bay module and
  claims nothing more. The often quoted 155 ft total is measured from the
  street at the foot of the hill and is not what this model claims.
  Verified on two renders, yaw -0.62 (the page's own opening view) and -0.05
  near frontal. OWED: the two adversarial critics did not fit inside this
  run's 25 minute ceiling. First thing for the next run, worst first:
    a. at oblique yaws the pediment's apex disappears behind a 50 ft dome
       set only 27 ft back, so the pediment reads as two dark shoulders. The
       set-back is derived, not published; find a section or a plan.
    b. the main roof lid is a large muddy plane in the middle of the model
       and carries nothing. Photographs show it largely hidden; either raise
       the parapet to the height that hides it or draw what is up there.
    c. the wings' second storey is drawn with round headed windows on the
       strength of the 1798 notice contrasting them with the "square windows"
       of the basement. That is an inference from a contrast, not a
       published statement, and it should be checked against an elevation.

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

- old-south, the Old South Meeting House (2026-09-05). Published, quoted in
  the file header: "66-68 feet (20-21 m) wide and 93-95 feet (28-29 m) long",
  the tower "about 80 feet (24 m) with three stories", "183 feet (56 m) tall"
  overall, a "20-foot-tall (6.1 m) gilded weathervane" by the Drownes, first
  story windows "15-over-15" and second "15-over-20", "Multiple oxeye windows
  with radiating muntins", "Flemish bond" with a "brick water table at lowest
  portion", a roof "combination of hipped and gable" in slate, the clock "no
  later than 1770" (Wikipedia); five bays front, seven bays long side, arched
  windows with fanlights, a twenty foot copper octagonal spire, a three stage
  octagonal steeple, the principal door on the LONG side (Boston Landmarks
  Commission study report, 2025, already quoted in trail-3d.js).
  THE CHECK THAT MADE THE REBUILD WORTH DOING, and it is arithmetic: the old
  scene had to DERIVE the footprint because no source it reached published
  one. Wikipedia publishes it, and the published footprint and the published
  bay counts agree to a tenth of a foot, 67 over five bays = 13.40, 94 over
  seven = 13.43. Two independent published facts, one module, nothing
  proportioned by eye.
  A CONFLICT, named rather than smoothed: Wikipedia calls the WEATHERVANE
  twenty feet tall, the Landmarks report calls the SPIRE twenty feet, and
  both cannot sit inside a published 183 ft. The spire reading is taken
  because it closes the height arithmetic (80 brick + 83 wood + 20 spire),
  the vane is drawn as a finial, and if the vane really is twenty feet this
  model is twenty feet short at the top.
  Named gaps: no published tower plan (20 ft square projecting 5, derived
  from the 13.4 ft module); no published storey or eave heights; no published
  roof pitch or hip run; no published position for the oxeye windows; no
  published split of the 83 ft of wooden steeple into its bell stage,
  pedestal and three octagons, which is the softest thing in the file.
  WHAT LOOKING CAUGHT AND ARITHMETIC DID NOT, three things, and the second is
  the worst fault in this file's history: (1) a 300 ft pavement pad, not the
  building, was setting the frame, because the trail renderer fits to
  everything including the ground; 150 nearly doubled the meeting house on
  the page without touching a published dimension, which is the Bunker Hill
  lesson arriving again. (2) panel() and archOpening() carry NO visibility
  test, so every window, belt course and cornice was struck on the -x and +y
  maps at every yaw: turn the model round and all of that trim went on
  painting, floating in front of the building on the side it does not belong
  to, in white bars and windows hanging past the corners, and the tower
  carried its door on whichever side the reader was not on. box() culls its
  walls; the things drawn ON a wall have to be culled by hand with the same
  test, and both the body and the tower now loop their four faces. Every
  count and every dimension was correct in the version that did this.
  (3) the published clock, which the article dates to no later than 1770, was
  struck at z = 100, inside the pedestal that is drawn after it, so it was
  painted over and never appeared at all; it is now on the tower face under
  the belfry where it belongs.
  Verified on renders at yaw -0.62 (the page's own opening view) and -2.30.
  OWED: the two adversarial critics did not fit inside this run's 25 minute
  ceiling. First thing for the next run, worst first:
    a. at the hipped east end a pale wedge of roof still reads as a void
       rather than as a hip. The strips inside the hip run are shaded down
       but the far slope shows past the ridge there; either cull the far
       slope inside the hip run or close the end properly.
    b. the three octagons carry one round window each on the facet nearest
       the camera, struck on a plane rather than on the facet, so at some
       yaws it will drift off the facet edge. octDetail already does this
       correctly and should be used instead.
    c. the belfry louvres read as a radiator at map scale. Fewer, deeper
       slats, or a darker ground behind them.

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

- faneuil-hall, Faneuil Hall (2026-09-05). Published, quoted in the file
  header: Bulfinch's 1806 building is "80 by 102 feet", "four stories high,
  including the attic", northern and southern elevations "nine bays",
  western and eastern "seven bays", "red" brick in "Flemish bond", a "gable
  roof" oriented "west-east" and "clad in slate shingles", "Tuscan-style
  pilasters" on the first story, "Doric pilasters" on the second, "Ionic
  pilasters, which are entirely of Bulfinch's design" on the third,
  "protruding limestone cornices" and "limestone keystones", first-story
  openings "arched", second and third "round-arched windows with keystones"
  on west and east against "rectangular sash windows, topped by detached
  semicircular lunettes" on north and south, "tympana with an architrave
  containing a lunette" and "porthole-like bullseye windows" on the gable
  ends, a cupola whose "lower part is a square tower with louvers on its
  western elevation and windows on its other elevations" over "a belfry"
  with an 1867 bell, moved "to the eastern end during the 1806 renovation",
  a Great Hall "28 feet high and 76 by 76 feet across", a market "76 by 100
  feet", and Shem Drowne's grasshopper at "25 pounds" (Wikipedia).
  TWO ARITHMETIC CHECKS, done rather than assumed, and they are why nothing
  in the plan is proportioned by eye. Bulfinch extended NORTHWARD, so 80 ft
  is north-south and 102 ft east-west; a northern elevation is then 102 ft
  over nine bays = 11.33 ft, a western 80 ft over seven = 11.43. One module
  reached twice from two independent published facts, the way Old South
  closed. Second: a 76 by 76 hall inside 80 by 102 leaves 2 ft of wall each
  long side, a 76 by 100 market leaves 1 ft at each end. Both are believable
  masonry and neither is possible with the axes swapped, so the rooms
  confirm the orientation the bays gave.
  Named gaps: NO published height for anything, so every z is derived from
  the published four storeys and the published 28 ft hall (market storey 17,
  hall storey 29.3, Bulfinch storey 14.4, attic in the roof); no published
  cupola dimensions or position along the ridge; the square tower IS
  published and is square, the belfry is named separately in the same
  sentence but its plan is not given and is drawn octagonal, which is a
  derivation from Bulfinch's idiom and is said so; no published grasshopper
  length, only its weight; no published window sizes, pilaster widths or
  step counts.
  What LOOKING caught and arithmetic did not, three things, none visible in
  any count: (1) the tympanum's lunette and both bullseyes were struck two
  feet above the eave, so the published ornament clustered along the bottom
  of a sixteen foot triangle and the whole upper gable was bare brick; the
  architrave now springs at a third of the height. (2) the gable had no
  RAKING cornice, so a pediment read as the sawn-off end of a roof, which is
  the one thing a Georgian gable end is not. (3) the cupola, placed 16 ft in
  from the east end, stood dead in front of the tympanum it is supposed to
  stand behind and hid the lunette; moved to 25 ft in, both read. A fourth,
  cheaper: the 150 ft pad was setting the frame and shrinking the building,
  which is the Bunker Hill lesson arriving for the third time in this file.
  OWED: the two adversarial critics did not fit inside this run's 25 minute
  ceiling. The renders at the default yaw are what this build was verified
  on. First thing for the next run, worst first:
    a. the lunette's arch grazes the left rake of the pediment at some yaws.
       Either narrow it or raise the raking cornice's inner edge.
    b. the three paneled doors are dark rectangles inside the arcade rather
       than doors in a doorcase. Published as "paneled" and drawn flat.
    c. the arcade is the whole idea of the ground storey and here it is
       glazed arches in a wall; nothing says market. No source reached this
       run gives the arcade's original open form after 1806, so it is drawn
       as it stands rather than as it was.

## Skipped this run, and why

- american, the National Museum of American History (2026-09-05). NOT built.
  No exterior architectural dimensions could be reached: the Wikipedia
  article carries none, and SAH Archipedia returned HTTP 403. What IS
  published is 750,000 sq ft, five storeys, and a facing of pink Tennessee
  marble sandblasted over 16 3/8 inch precast sandwich panels. That is a
  material and an area, not a building. Per the standard's first rule, real
  published dimensions or do not build it, it is left for a run that can
  reach the National Register nomination or the architect's drawings. The
  OSM-footprint route used for the Castle and NMAAHC would give a plan but
  still no height, and a five storey box of correct plan is exactly the
  model Sean called unacceptable.

## The build queue is dry, and the OWED list is the queue now (2026-09-08)

Every item of the rebuild queue is closed. The Mall has 21 dc-form files and
only `american` has none, blocked on a count no source this file has reached
will give. The Freedom Trail has all nine. New York has three. The Met
exterior is done and `map_lint` reports 15 of 15 rooms with an interior
drawn, so item 5 is closed and so is the older note about `modern` and
`grand-stair-2`. MoMA is blocked on a tool.

So a run that opens this file and finds nothing to BUILD is not a run with
nothing to do, and it should not invent a landmark to stay busy. Twenty-odd
entries above end with the same sentence: the two adversarial critics did not
fit inside the run's 25 minute ceiling, and here is what is owed, worst
first. Step 4 of the standard is not optional, so a model carrying named,
unaddressed defects is not finished. THAT is the queue. Work it worst first,
three models a run, one fix each, and strike the items as they are paid.

- dcwar OWED (a) is PAID, and the fix went where the note said it belonged,
  in the shared helper, so it was never only about this building.
  WHAT LOOKING SHOWED THAT THE NOTE DID NOT. The note called the dome
  "ribbed rather than smooth". The render at yaw -0.55 showed a stepped
  BEEHIVE: ten courses, each with a bright white plate on top of it, and a
  staircase silhouette. The note had it as a shading problem. It was
  geometry. `ngon` was being handed one radius, so every ring was a CYLINDER
  drawn at its own BOTTOM radius and stood proud of the ring above it, and
  `ngon` caps a ring with a full DISC, not an annulus, so each of those
  ledges was also painted at full brightness with nz = 1. No amount of
  shading hides a real step.
  THE FIX, in dc-3d.js and therefore in every dome on the site: `ngon` takes
  an optional `{ r1, noTop, nz }`. Given `r1` a ring is a FRUSTUM, and given
  `noTop` it keeps no lid, so a stack is a smooth surface with one crown.
  The side normal now tilts up by the ring's own slope, which is what makes
  the dome brighten toward the top instead of reading as a stack of collars.
  The shared `dome()` uses it and went from 7 rings to 12, since the cost of
  a finer stack is now only sides. dcwar's own ten-ring loop had already
  computed r1 and thrown it away; it passes it now.
  Verified at yaw -0.55 pitch 0.30 and yaw -2.10 pitch 0.22, and BECAUSE it
  is a shared helper, on both other callers: the Capitol and the Jefferson
  were rendered before committing and both improved, neither regressed.
  A shared edit has to be looked at on every model it touches, not only on
  the one that motivated it.
  STILL OWED on dcwar: (c) no source says whether the Doric frieze carries
  triglyphs, so it is drawn plain. (b) is PAID, 2026-09-09; see below.

- hirshhorn OWED (a) and (b) are PAID as one fix, because they are one
  defect. The two critics agreed the piers were tonally invisible, measured
  at 104,95,88 against an under-drum of 97,92,86. The render showed the
  consequence rather than the cause: a drum sitting FLAT ON THE PLAZA with a
  single dark tab under it. The 14 ft lift was there in the geometry and
  correct in proportion, about 15% of the wall, and it read as a shadow line
  at the wall base. A Hirshhorn on the ground is not the Hirshhorn; the
  building is a hollow drum held in the air on four piers.
  THE FIX, all of it in service of one thing, making the lift read: the
  drum's SOFFIT at z = 14 was never drawn at all, so from any low camera the
  eye went from plaza to sky straight through the building; it is drawn now
  as its own bounce-lit plane, a shaded ceiling and not a void. The piers
  are lightened to #a2958a, granite-clad and catching bounce off 2.7 acres
  of plaza, and given a top face where they meet the soffit. The ground
  under the drum is deepened to #4e4842, so what is dark is the void BEHIND
  the piers rather than the piers themselves.
  Verified at pitch 0.30, the angle the site actually opens at, where two
  lit piers now stand in a dark void under the drum, and at pitch 0.10,
  where the soffit, the piers, the court floor and the fountain all read
  through the gap.
  STILL OWED on hirshhorn, unchanged: (c) the courtyard's inner wall is the
  brightest surface in the model, because outward=false hands ctx.shade a
  normal pointing at the camera and a 96 ft shaft is lit like a sunlit
  facade; (d) per-segment flat shading puts 44 bands on a wall published as
  blank, and stroke=fill leaves a 44-spoke starburst on the ring top, which
  the render shows plainly inside the courtyard; (e) the courtyard glazing
  is two ribbons against a source that says "large rectangular windows";
  (f) the shadow ring is concentric, i.e. sun at the zenith, while the walls
  are directionally lit; (g) the plaza disc's corner reads as a sheet of
  paper under the model at some yaws. The starburst half of (d) is PAID,
  2026-09-09; the 44 bands on the blank wall are not, and stay owed.

- old-south OWED (a) is PAID, and THE NOTE'S OWN DIAGNOSIS WAS WRONG, which
  is the finding worth keeping from this run. It recorded "a pale wedge of
  roof still reads as a void rather than as a hip" and named the cause: "the
  far slope shows past the ridge there". At yaw -2.30 the render shows a
  WHITE TRIANGLE over roughly a third of the roof, and reading the geometry
  says why. The two long slopes taper correctly, from the eave corner at y0
  in to xm at yh, which is the hip rafter. What neither of them covers is
  the region BETWEEN those two rafters, and on a hipped roof that region is
  the end slope, a real surface. It was never drawn. The roof had a hole in
  it and the reader was seeing the background through it. Nothing was
  showing past anything.
  A guessed cause in an OWED note is a hypothesis, not a diagnosis. Read the
  geometry before paying the debt, or you will shade a hole.
  THE FIX: draw the hip end, culled on (0,-1) the way the gable at +y is.
  Drawn first as one clean triangle to the apex, which LOOKING then caught
  leaving a pale sliver along the hip rafter: the long slopes approximate
  that rafter as a chord across each of 8 strips, a triangle runs straight
  to the point, and daylight sits between two different lines. The hip face
  is built from the SAME strip boundaries and the same z, so the edges are
  identical and the seam is shut.
  Verified at yaw -2.30, where the hole was, and at the page's own -0.62,
  where the end is culled and nothing changed.
  OWED AT THE TIME on old-south, both since paid and left in the past tense
  so the audit's parser stops counting them: (b) the three octagons carried
  one round window each struck on a plane rather than on the facet, paid
  2026-09-08; (c) the belfry louvres read as a radiator at map scale, paid
  2026-09-09. Old South has no open debts.

### Paid 2026-09-09 (the landmark routine)

- THE TRAIL SHADOW, park-street OWED (a), and it was the shared fix the note
  asked for: "worth solving once for all of them rather than five times."
  WHAT LOOKING SHOWED THAT THE NOTE DID NOT. The note read "Park Street's
  shadow falls away from the page's default camera, so it reads as a thin
  band on the -x side rather than as a shadow" and blamed the light's
  DIRECTION. The direction was the one thing that was right: LIGHT is
  [0.60,0.30,0.68], the sun stands off +x and +y, and that shadow does go to
  -x,-y. Cropped to the base, the render showed the real fault: the shadow
  was an axis-aligned RECTANGLE, inset four feet inside the +x wall and five
  feet short of the apse tip, under a building whose east end is a
  SEMICIRCLE of radius 39. Half the plan overhung its own shadow and met
  bright pavement with nothing under it. A rectangle cannot be the shadow of
  a building with a round end. That is the old-south lesson a second time: a
  guessed cause in an OWED note is a hypothesis, not a diagnosis.
  READING THE OTHER STOPS THEN FOUND A WORSE FAULT THAN THE ONE FILED.
  Three forms had each hand-copied a private shadow helper and the copies had
  drifted apart, two rgba fills at different opacities and one opaque colour
  with a stroke. Every call in all three passed a POSITIVE dx,dy, which
  throws the shadow TOWARD the light: bunker-hill (7,4), (6,3.5), (3,1.8),
  old-north (9,5), faneuil-hall (7,4). Three stops were shading the ground on
  the sunny side and lighting it on the shaded one. Nobody had filed it,
  because a shadow on the wrong side still looks like a shadow.
  THE FIX, in trail-3d.js and therefore in every stop: one shadow helper,
  ported from dc-3d.js where this idiom was already correct. It takes the
  FOOTPRINT, not a rectangle, and sweeps it along the light, so the outline
  and the outline slid by (dx,dy) walked back make one polygon that always
  touches the base it belongs to. A gap under the building is now impossible
  rather than merely absent. Park Street hands it the real plan, the straight
  bays and the apse as an arc. rectFoot() keeps the rectangle-and-centre call
  the simple stops read well with, and their last argument is now the casting
  mass's HEIGHT, not an offset.
  THE LENGTH IS CAPPED, and that is a drawing decision, declared and not
  buried: 0.9 of Bunker Hill's published 221 ft is a 199 ft finger across a
  30 ft footprint, and the stage fits itself to everything the scene draws,
  shadows included, so it doubles the frame's width and halves the monument.
  That is the pad lesson from Park Street and Old South a fourth time. The
  sweep is held to 1.4 of the footprint's own longest span.
  Verified by LOOKING at every model the shared edit touches, which is the
  dcwar rule: park-street at yaw -0.62 and -2.10, bunker-hill, old-north and
  faneuil-hall at -0.62. All four now throw left, away from the sun, and none
  regressed.
  STILL OWED on the trail: (b) the Revere house's two pavement pads overlap
  at the corner and read as two rectangles rather than as a courtyard and a
  street; (c) the Old State House roof is the largest surface in that model
  and carries nothing, and no source reached publishes dormers or plant.

- THE MET STAIRCASE, met OWED (a), "the staircase has no cheek walls, so from
  an oblique angle it fans out as a stack of loose planks beside the building
  rather than as masonry." The note was right about the picture and the
  render at yaw -1.15 confirms it exactly: six thin boards with daylight
  between their ends, leaning on the front.
  THE CAUSE IS SIMPLER THAN "NO CHEEK WALLS". Reading the loop, each step was
  a tread quad and a front riser and NOTHING ELSE. The flight had no end
  faces at all, so the eye was seeing each tread's edge in turn. Nothing was
  missing but the sides.
  SO THE FIX IS FACES, NOT A CHEEK WALL, and that distinction is the point.
  The Met's real flanking plinths have no published width in any source this
  file has reached, and an invented parapet is worse than an honest absence.
  A face that the drawn solid already implies is not an invention: it is a
  face that was left out. New sideQuad() beside frontQuad(), and each step
  draws its end at its own half-width from the plaza to its own tread. The
  flight SPLAYS, 58 half-width at the top to 76 at the street, and push order
  is paint order here, so the wider lower courses paint over the narrower
  ones above and the stack resolves into one raking cheek that steps out as
  it descends, which is what a splayed flight does.
  THE HOUR THIS COST, and the trap worth writing down: after the edit the
  render looked UNCHANGED and two crops of the stair showed nothing, which
  reads as a fix that did not fire. The polygons were there. met-3d.js wraps
  its output in <g transform="translate(...) scale(3.1203)">, so the raw
  coordinates in the SVG are NOT screen coordinates, and every guess about
  where to crop was wrong by that transform. What settled it in one render
  was drawing the new faces in #ff0000: they appeared instantly, exactly at
  the flight's left end, correctly raked. WHEN A CHANGE SHOULD BE VISIBLE AND
  IS NOT, COLOUR IT AND RENDER ONCE, before doubting the geometry or the
  arithmetic. Verified in stone at yaw -1.15 pitch 0.42.
  STILL OWED on the Met: (b) the roof is still the largest surface in the
  model and carries nothing but the three banks; (c) the wings away from the
  front run are still flat slabs drawn by shellSolid, and bays there are a
  separate and larger change.

- OLD SOUTH OWED (b) is PAID. "The three octagons carry one round window each
  struck on a plane rather than on the facet, so at some yaws it will drift
  off the facet edge, and octDetail already does this correctly." The note
  was exactly right, which is worth recording after two runs in which the
  note's diagnosis was the thing that was wrong.
  The map function read `function (u, z) { return P(u, ty1 - 3.6 + s[2] *
  0.92, z); }`: u went straight onto world x and y was a CONSTANT. An octagon
  has no plane of constant y, so the window was a disc hanging on a flat
  sheet in front of the stage, and it only looked right at the one yaw the
  build was checked at.
  THE FIX is octDetail's method brought here: walk the eight facets on
  octStage's own angles, keep the ones ctx.faceVisible admits, and strike
  each window on THAT facet, placed along the facet normal and running along
  its tangent. A closure per facet, because a var loop would hand every
  window the last facet's numbers.
  ONE THING THE NOTE DID NOT MENTION AND THE GEOMETRY DID: these stages
  TAPER, and the window was placed at the BOTTOM radius s[2] while sitting 45
  percent of the way up. It was pushed proud of the stone it belongs to. The
  radius is now interpolated up the taper. No new published number is
  involved; the window's size and height keep the fractions already there.
  Verified at yaw -0.62, where one window shows per stage, and at -2.30,
  where the tower turns and two show per stage and follow it round. The hip
  end fixed by the previous run is intact at both.
  OLD SOUTH IS CLEAR: (c) is PAID, 2026-09-09; see below.

- THE STARBURST, hirshhorn OWED (d), first half. "Stroke=fill leaves a
  44-spoke starburst on the ring top." The note named the place exactly and
  its mechanism could not be true as written, which is why this one is worth
  recording: every quad of that ring carries the SAME colour, computed once,
  and the stroke is that same colour, so no arithmetic explains a pale line
  between two of them. The seams were there anyway, plainly, fanning across
  the roof from the courtyard.
  COLOURING THE STROKE RED SETTLED IT IN ONE RENDER, the trick the Met stair
  taught this file, used here to DIAGNOSE rather than to confirm: the red
  lines landed exactly on the pale ones. The edges were the cause.
  WHY A STROKE IN THE FILL'S OWN COLOUR DOES NOT CLOSE A SEAM, which is the
  portable part: two abutting polygons each antialias their shared edge
  against what is BEHIND them, and two partial coverages do not sum to one,
  so a hairline of whatever lies underneath survives. Here that was plaza and
  sky, both pale, so the seam read as light on stone. The stroke does not
  help, because the stroke has an antialiased edge of its own.
  THE FIX is overlap, not paint: each ring quad runs a twelfth of a segment
  past its neighbour's start, about a fifth of a degree, three or four pixels
  at this radius and nothing at all in plan. The lap stops at the end of a
  tested arc, because ring() also draws the balcony floor with a test and
  that must not run out over the blank wall by even a foot.
  Verified at yaw -0.55 pitch 0.30, where the roof is now one surface, and at
  yaw 1.90 pitch 0.16 from behind, where the coping, the piers and the shadow
  ring are unchanged and the balcony correctly does not appear.
  STILL OWED on hirshhorn: (c), the courtyard's inner wall; (d)'s other half,
  44 tonal bands on a wall published as blank; (e) the glazing; (f) the
  concentric shadow; (g) the plaza corner.

- THE DORIC SHAFTS, dcwar OWED (b). "The columns are eight-sided prisms and
  fluted is carried only by shading." True, and the render says what that
  costs: of eight facets three showed, two of them at nearly one tone, so
  twelve round columns read as twelve flat posts with a hard seam down each.
  A monopteros is a ring of cylinders seen against daylight. A ring of posts
  is a different building.
  THE FIX is twenty facets, which is the Doric order's own flute count, so
  each facet is one flute and the arrises between them are real edges. TWENTY
  IS THE ORDER'S NUMBER, not this memorial's: no source reached gives its
  flute count, and the file's NAMED GAPS now says so. At 900 pixels a shaft
  is about twelve wide, so one channel is under a pixel; what the facets buy
  is not countable grooves but the thing a visitor names, a round marble
  shaft turning in the light.
  Verified at yaw -0.55 pitch 0.22 and yaw -2.10 pitch 0.30. The shafts now
  carry a gradient from lit face to flank with fine vertical striping, the
  dome and entablature are unchanged, and the far columns still show through.
  STILL OWED on dcwar: (c) only, the triglyph question, which is a source
  question and not a drawing one.

- THE BELFRY, old-south OWED (c). "The louvres read as a radiator at map
  scale; fewer, deeper slats, or a darker ground behind them." The crop
  showed a heat sink: nine stripes of dark and near-white at EQUAL weight,
  running edge to edge across three quarters of the face.
  TWO THINGS WERE WRONG AND ONLY ONE OF THEM WAS THE SLAT COUNT. The ground
  was already dark, #3d4a44, so the note's second option was in the file
  before the run began. What made it a grille was the WEIGHT: 0.7 ft of
  bright blade on a 1.6 ft pitch is nearly half the opening painted white,
  and a louvre blade seen from the street is mostly its own underside, in
  shade, with the sun catching a thin top arris. The blades thin to 0.45 on a
  1.9 pitch and the dark now carries three quarters of the opening, as it
  does on the building.
  THE SECOND THING, which the note did not mention and the picture did: the
  opening ran 13.2 ft across a 17.6 ft face, so no jamb was left to read as
  wall, and a hole with no wall around it is a panel. It is inset now.
  AND THE FIRST FIX FOR THAT WAS WRONG, caught by looking again: a fixed 3.6
  ft inset that leaves a proper jamb on the 20 ft front leaves a 1.4 ft slit
  on the 11 ft flank, and the flank went from grille to a row of dashes. The
  jamb is a FRACTION now, twenty per cent of whichever face it is on, so both
  faces carry the same proportion: 10.6 ft of opening on the front, 5.2 on
  the side.
  Verified at yaw -0.62 pitch 0.28, cropped on the belfry and read whole at
  map scale, and at yaw -2.30 pitch 0.30. Old South now has no open debts.
