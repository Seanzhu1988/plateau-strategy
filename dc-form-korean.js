/* dc-form-korean.js: the Korean War Veterans Memorial, West Potomac Park.
 *
 * Built to MODEL_STANDARD.md. What stood here before was the generic "plaza"
 * form: one pale box 70 by 38 metres. This memorial is not a mass at all. It
 * is a walked FIELD with nineteen figures standing in it, a polished black
 * wall down one side that turns those nineteen into thirty-eight, and a
 * triangle running into a circle. A box is the opposite of every one of
 * those.
 *
 * STYLE. Named before the geometry, per STYLES.md's working rule 1. Nothing
 * in the book covered this: it is THE PEOPLED MEMORIAL, the late-20th-century
 * figurative narrative memorial. It is emphatically NOT "The wall in the
 * ground" that the Vietnam Veterans Memorial across the Reflecting Pool is
 * drawn in, and the difference decides the model. There the wall is a CUT and
 * the visitor descends; here the wall STANDS at full height on the grade, has
 * two faces and two elevations, and the ground rises instead of falling. The
 * tells this model is built on: the subject is PEOPLE, not stone, and the
 * published count is exact; the ground is a designed striped field, not a
 * lawn; the black wall reads by REFLECTION and carries ghost figures; the
 * plan is two named plane figures MEETING, a triangle running into a circle;
 * everything is low and there is no silhouette; grade does the work steps do
 * elsewhere; and the low curbs are architecture, not landscaping.
 *
 * ------------------------------------------------------------------------
 * PUBLISHED, quoted, each with the source checked this run.
 *
 * NCPC Executive Director's Recommendation, File 8107, May 2020, fetched and
 * read this run from
 * https://www.ncpc.gov/docs/actions/2020May/8107_Korean_War_Veterans_Memorial_Wall_of_Remembrance_Staff_Report_May2020.pdf
 *   - "The wall consists of 41 panels extending approximately 164 feet in
 *      length."
 *   - "The mural wall is approximately 12 feet high at its west end and
 *      tapers to approximately five feet on the east end as a result of the
 *      topography."   <- the single most load-bearing sentence in this file
 *   - "Nineteen stainless-steel soldiers, standing seven feet tall, are
 *      scattered across the length of the field."
 *   - "Narrow granite bands alternate with lines of low juniper shrubs."
 *   - "The field, defined by two paths, gently rises towards the flagpole at
 *      the memorial's apex. A large granite triangle completes the field at
 *      the base of the flagpole where the memorial theme is inscribed."
 *   - "They emerge from a grove of trees, planted on the western end of the
 *      memorial, toward the American flag, the focal point of the memorial."
 *   - "The plaza has a radius of 64'- 6"."
 *   - "the radius of the plaza will increase by nine feet from 64'-6" to
 *      73'-6"."
 *   - "two rows of linden trees around the Pool of Remembrance, that create a
 *      circle of pleached trees"
 *   - the Wall of Remembrance "will measure approximately five feet and two
 *      inches (5' - 2") in width and three feet and eight and a half inches
 *      (3' 8 1/2") in height", "at least 380 linear feet of wall length",
 *      "The names of the fallen will be located on the sloped wall facing the
 *      Pool of Remembrance"
 *   - "providing a better edge to the circular plaza around the Pool of
 *      Remembrance, currently defined by a post and chain fence"
 *   - "raising the existing berm from the surrounding landscape from four to
 *      ten percent to conceal most of the wall"
 *   - "The images etched into polished granite panels embody over 2,500
 *      faces"; "The reflective quality of the academy black granite
 *      illustrates a total of 38 sculptures, symbolic of the 38th parallel
 *      and the 38 months of the war (1950-1953)."
 *
 * Wikipedia, https://en.wikipedia.org/wiki/Korean_War_Veterans_Memorial,
 * fetched this run:
 *   - "The main memorial is in the form of a triangle intersecting a circle."
 *   - "Walls: 164 feet (50 m) long, 8 inches (200 mm) thick; more than 100
 *      tons of highly polished "Academy Black" granite from California"
 *   - "Each statue is larger than life-size, between 7 feet 3 inches (2.21 m)
 *      and 7 feet 6 inches (2.29 m) tall; each weighs nearly 1,000 pounds"
 *   - "fourteen of the figures are from the U.S. Army, three are from the
 *      Marine Corps, one is a Navy Corpsman, and one is an Air Force Forward
 *      Air Observer"
 *   - "the Pool of Remembrance, a shallow pool 30 feet (9 m) in diameter
 *      lined with black granite"   <- see the CONFLICT note below
 *   - "A further granite wall bears the simple message, inlaid in silver:
 *      "Freedom Is Not Free.""
 *   - "Area: 2.20 acres" (the NRHP listing)
 *
 * NPS, https://www.nps.gov/kowa/learn/historyculture/wall-and-pool-of-remembrance.htm,
 * fetched this run:
 *   - "the point of the triangle enclosing the statues juts into a 128- foot
 *      diameter circular pool"
 *   - "Surrounding the pool are 40 Linden trees which create a barrel effect"
 *   - "Nine benches, located under the trees"
 *   - "Numbers of those killed, wounded, missing in action, and prisoners of
 *      war are etched into the curb at the water's edge"
 *
 * Korean War Veterans Memorial Foundation, https://koreanwarvetsmemorial.org/design/,
 * fetched this run:
 *   - "The statues stand in patches of Juniper bushes and are separated by
 *      polished granite strips, which give a semblance of order and symbolize
 *      the rice paddies of Korea."
 *   - "The troops wear ponchos covering their weapons and equipment."  <- so
 *      no rifle is drawn: the published fact is that the weapons are hidden.
 *   - "The Wall consists of 100 granite panels", each 3'-10" wide (NCPC)
 *   - "The Pool is encircled by the Wall of Remembrance."
 *
 * ------------------------------------------------------------------------
 * MEASURED THIS RUN from OpenStreetMap, node by node through the OSM API,
 * projected into feet about the dc-3d.js coordinate for "korean"
 * (38.88778, -77.04722). Lengths agree with the published ones where both
 * exist, which is what makes the rest of the trace usable.
 *   way 173927229 "The Mural Wall"    https://www.openstreetmap.org/way/173927229
 *       (-58.87,-32.41) to (-223.33,-34.31), 164.47 ft, bearing 179.3 deg.
 *       Published 164 ft. Two independent sources, 0.3 percent apart.
 *   way 903669115 "United Nations Wall"  https://www.openstreetmap.org/way/903669115
 *       (-72.86,18.78) to (-225.03,127.39), 186.95 ft. No published length.
 *   way 173927230 "Korean War Veterans Memorial" (ref:nrhp 01000273)
 *       https://www.openstreetmap.org/way/173927230
 *       36 nodes: the two walls, a 161.7 ft west side running due north, and
 *       a 31-node arc. A least-squares circle through those 31 nodes gives
 *       centre (-15.74,-15.24) and radius 66.92 ft, rms 0.67, max 1.56. The
 *       arc runs 313.8 degrees; the missing 46.2 degrees is the opening on
 *       the west where the field's apex enters, 52 ft of chord.
 *   way 156332689 "The Statues" (leisure=garden, the juniper field)
 *       https://www.openstreetmap.org/way/156332689
 *       NW(-217.38,104.06) E(-63.90,-7.07) E(-63.71,-18.45) SW(-215.28,-20.96)
 *   way 156333783 "Pool of Remembrance"  https://www.openstreetmap.org/way/156333783
 *       33 of its 35 nodes fall on a circle of radius 31.0 to 31.7 ft about
 *       (-16.73,-17.88): a true circle, not a smear. Open on the west over
 *       55 degrees.
 *   way 173927227 (barrier=wall, colour=black, unnamed)
 *       https://www.openstreetmap.org/way/173927227
 *       (-45.10,-32.00) to (-6.50,-30.60), 38.6 ft, running due east from the
 *       pool's south-west rim to a point 16.3 ft from the pool's centre. It
 *       shares both its nodes with the pool polygon. That is the published
 *       "granite wall extending into the pool" carrying FREEDOM IS NOT FREE,
 *       and its length here is measured rather than assumed.
 *
 * TWO CROSS-CHECKS THE MEASUREMENTS PASS, and they are why the trace is
 * trusted for the plan:
 *   - the plaza centre (-15.74,-15.24) and the pool centre (-16.73,-17.88)
 *     are 2.8 ft apart out of a 66.9 ft radius, so the pool is concentric
 *     with the plaza. No source says so; the two independent traces do.
 *   - the north and south paths are not assumed widths. They are the gaps
 *     between measured lines: 13.3 to 14.0 ft between the Mural Wall and the
 *     field's south edge, 14.5 to 15.8 ft between the field's north edge and
 *     the United Nations Wall. NCPC's "The field, defined by two paths" is
 *     therefore drawn at a measured width, not a guessed one.
 *
 * ------------------------------------------------------------------------
 * DERIVED, each derivation shown rather than asserted.
 *
 * THE GRADE, and it is the best thing in this file. NCPC says the Mural Wall
 * is 12 ft at its west end and 5 ft at its east "as a result of the
 * topography". A 41-panel granite wall has a level top; what changes is the
 * ground it stands out of. So the ground RISES 7 ft over the wall's measured
 * 164.47 ft, a grade of 1 in 23.5, or 4.26 percent, and the wall's top sits
 * level at 12 ft above the west end throughout. That single sentence gives
 * the model its hill, its "gently rises towards the flagpole", and its
 * "quiet circular Pool of Remembrance at the top of the hill", with no number
 * invented. z = 0 is the ground at the Mural Wall's west end; the plaza is a
 * level table at z = 7.0, which is exactly the ground at the wall's east end.
 *
 * PANEL WIDTH: 164.47 ft over the published 41 panels is 4.01 ft. Derived.
 *
 * WALL OF REMEMBRANCE RING RADIUS: 69.0 ft, and it is a derivation that
 * checks itself. NCPC says the wall gives "a better edge to the circular
 * plaza ... currently defined by a post and chain fence", and that the paving
 * was then pushed nine feet further out "to provide circulation around the
 * new curvilinear wall". So the ring sits in that nine feet, centreline at
 * 73.5 less half of nine = 69.0. Now the check, which is why this number is
 * trusted and the measured one is not: the memorial outline's own traced arc
 * runs 313.8 degrees, the rest being the field's entrance. A ring of radius
 * 69.0 over 313.8 degrees is 377.9 ft of wall, against a published "at least
 * 380 linear feet" and a published 100 panels at 3'-10" each = 383.3 ft.
 * Turned round: a ring carrying exactly 380 ft over that measured angle has a
 * radius of 69.38, and adding the published four and a half feet of new
 * paving outside it gives 73.88 against a published 73'-6". Two published
 * numbers and one measured angle close on each other within half a foot.
 *
 * THE FIELD'S CLIP: the juniper field stops where its centreline crosses the
 * plaza, at t = 0.839, which puts its 25 ft point at (-88.4, -4.0).
 *
 * ------------------------------------------------------------------------
 * CONFLICTS IN THE PUBLISHED RECORD, named rather than smoothed over.
 *
 * 1. THE PLAZA RADIUS, and this file changed its mind once, in the open.
 *    NCPC gives 64'-6" as built in 1995 and 73'-6" after the 2020 widening.
 *    NPS, writing after 2022, still says "128- foot diameter", which is 64 ft.
 *    The OSM outline, last touched 2024, measures 66.92 ft. The first version
 *    of this model took the MEASURED 66.92 on the principle that a figure off
 *    the ground beats a figure off a proposal. Then the ring arithmetic above
 *    was done and it decided the question the other way: at any radius inside
 *    a 66.92 ft plaza the wall's run is about 344 ft and the published 380
 *    cannot fit, while at 73'-6" it closes to within half a foot on two
 *    independent published numbers. So the trace is read as the PRE-2022
 *    geometry, which is what it measures: 66.92 is the 1995 plaza's 64'-6"
 *    plus about two and a half feet of curb. The model draws the published
 *    73'-6" edge, and it draws the 66.92 ft line too, as the joint between
 *    the old paving and the new, because NCPC publishes that joint as
 *    visible: "the paving will be larger to differentiate the new addition."
 *    What that costs: the two walls' measured ends now sit seven and
 *    twenty-seven feet INSIDE the paving, which NPS's own description
 *    supports, "the point of the triangle enclosing the statues juts into"
 *    the circle; and the traced juniper field is clipped 26 ft short of its
 *    polygon, because juniper does not grow under paving.
 * 2. THE POOL. Wikipedia says "30 feet in diameter"; the trace measures a
 *    clean 62.6 ft diameter over 33 nodes; NPS's "128-foot" describes the
 *    plaza, not the water. The measurement is used, and Wikipedia's figure is
 *    most likely a radius reported as a diameter.
 * 3. STATUE HEIGHT. Wikipedia 7'3" to 7'6"; NCPC "seven feet"; the Foundation
 *    "approximately eight feet". The Wikipedia range is the specific one and
 *    is what is drawn.
 * 4. MURAL IMAGES: "over 2,500 faces" (NCPC, Wikipedia) against "over 2,400
 *    photographs" (Foundation). Not a geometry number; noted only.
 * 5. BENCHES: nine (NPS) against seven (NCPC 2019). Nine are drawn.
 * 6. SITE AREA: 2.20 acres (NRHP) against 7.5 acres of Ash Woods setting
 *    (NCPC). The measured hardscape outline is 0.681 acres. All three
 *    describe different boundaries; none is drawn as an edge.
 *
 * ------------------------------------------------------------------------
 * ASSUMPTIONS. Every one on its own line, none buried in the code.
 *   - FLAGPOLE HEIGHT is published NOWHERE reached this run (NPS, NCPC 2020
 *     and 2019, the Foundation, Wikipedia, Britannica, a web search). NCPC
 *     confirms the pole exists at the apex and dimensions it nowhere. It is
 *     drawn at 60 ft, and that number is an ASSUMPTION. It is not a bare
 *     guess: NCPC's own report says "The Korean War Veterans Memorial site
 *     has a symmetrical relationship to the Vietnam Veterans Memorial site
 *     located on the north side of the Reflecting Pool", and the Vietnam
 *     pole is a published 60 ft (NPS / VVMF, quoted in dc-form-vietnam.js).
 *     That is an analogy from a published relationship, not a measurement of
 *     this pole, and it is the weakest number in this file. It is drawn
 *     rather than omitted because NCPC calls the American flag "the focal
 *     point of the memorial" and the nineteen figures are walking toward it;
 *     a model with nothing at the apex has deleted what the composition
 *     points at. The WWII memorial form in this project made the opposite
 *     call on the same kind of gap and drew no pole; the difference is that
 *     there the flag is incidental and here it is the focus. The model's
 *     published-height claim is the Mural Wall's 12 ft west end and
 *     explicitly EXCLUDES this pole.
 *   - the granite triangle at the flagpole's base is published as existing
 *     ("A large granite triangle completes the field at the base of the
 *     flagpole where the memorial theme is inscribed") and is dimensioned
 *     nowhere: drawn 26 ft on its base and 0.65 ft thick, with real edges,
 *     because at no thickness it read as a patch of paint on the field.
 *   - the GRANITE BANDS have no published count, width, spacing or
 *     ORIENTATION. Seven bands are drawn running along the field's length and
 *     converging with it, on the reading that the statues are "separated by
 *     polished granite strips, which give a semblance of order" and that
 *     order in a marching column runs with the march. The direction is an
 *     assumption and could be transverse. Their width TAPERS, 2.5 ft at the
 *     west to 1.0 ft at the apex, which is not a published taper either: at a
 *     fixed 2.5 ft seven bands filled seventy percent of the 25 ft apex and
 *     read as seven pale roads, the opposite of "narrow granite bands".
 *   - the POSITIONS of the nineteen figures are published nowhere. They are
 *     laid out as a loose column advancing east through the juniper lanes,
 *     never on a granite band, which is the one thing the sources do say.
 *   - no statue base or plinth is described in any source, so they stand
 *     directly on the ground. (Compare the Vietnam figures, which NPS puts on
 *     "a base that is one foot tall". No equivalent statement exists here.)
 *   - the UNITED NATIONS curbstone and the casualty curb are published only
 *     as "two low angled walls" and "the curb at the water's edge": drawn
 *     1.5 ft and 0.95 ft high respectively, with sloped tops.
 *   - the FREEDOM IS NOT FREE wall's height and thickness are not published:
 *     drawn 3.2 ft and 1.6 ft on its measured 38.6 ft run.
 *   - the pool is "shallow" and its depth is not published: the water is set
 *     0.6 ft below the plaza.
 *   - the two pleached linden rows are drawn at 58 and 63.5 ft, just inside
 *     the 1995 plaza edge, because NCPC says "The perimeter of the plaza is
 *     planted with two rows of pleached linden trees" and that the 2022
 *     paving was expanded "outside the two rows of linden trees". The exact
 *     two radii and the canopy, a clear stem to 9.5 ft and a clipped block to
 *     17 ft, are assumptions; the two rows, the count of 40 and the "barrel
 *     effect" are published.
 *   - the western grove is published ("a grove of trees, planted on the
 *     western end") and dimensioned nowhere: seven trees are drawn behind the
 *     field's west end.
 *   - the plaza paving's stone is not published for the original memorial
 *     (only that the 2022 addition matches the Academy Black): drawn a
 *     neutral granite grey.
 *
 *   - the 2022 BERM is published only as a GRADE, "raising the existing berm
 *     from the surrounding landscape from four to ten percent to conceal most
 *     of the wall", with no height and no width. It is drawn the way the
 *     Vietnam back slope was, as a grade and not as a height: eight percent,
 *     the middle of the published range, out 18 ft from the plaza edge and
 *     back down to the lawn. Its 1.4 ft crest is a consequence of the drawn
 *     width, not a claim, and the fall back down is not published at all. It
 *     is drawn because without it the plaza reads as a plate laid on the
 *     grass, which is a defect the render showed plainly.
 *
 * NO ROOF, and this is not an omission. The Korean War Veterans Memorial is
 * an open-air landscape memorial: there is no enclosed structure anywhere on
 * the site, no interior, and nothing to put a lid on. The tallest built thing
 * is a 12 ft wall. MODEL_STANDARD's fourth checklist item asks for a roof or
 * a sentence saying why there is none; this is the sentence.
 *
 * NO WINDOWS either, for the same reason, so the eighth checklist item's
 * "openings that survive map scale" is answered by the two things this
 * memorial has instead: the panel joints in the Mural Wall and the ghost
 * figures reflected in it, both of which were checked at 900 pixels and both
 * of which read.
 *
 * NAMED GAPS, drawn nowhere rather than guessed:
 *   - no spot elevations are published anywhere for the memorial's slope.
 *     The 4.26 percent above is derived from the wall's two published heights
 *     and is the model's only statement about grade.
 *   - the Rose of Sharon bushes, the eight red maples, the stepped weir in
 *     the pool and the lighting rail on the new wall are all published as
 *     existing and dimensioned nowhere: none is drawn.
 *   - the NRHP nomination (ref 01000273) is served as a scanned image and
 *     could not be read this run; it is the most likely source for the
 *     missing plan and grade dimensions.
 *   - 58,000 names and 2,500 etched faces cannot be text at map scale. The
 *     wall carries the published reflective wash, a rhythm of joints, and the
 *     ghost figures that ARE the published idea, and claims nothing more.
 *
 * ------------------------------------------------------------------------
 * SCALE. The same deliberate departure the Vietnam form makes, for the same
 * reason. dc-3d.js floors every place height at MIN_H = 12 m, so p.h arrives
 * here as 12 m against a true tallest published element of 12 ft = 3.66 m,
 * inflated about three and a third times. Using it would make a twelve foot
 * wall read as a forty foot rampart and stretch a 276 ft plan to nine
 * hundred. This form uses true feet, 0.3048 m each, and ignores the floor,
 * because MIN_H exists to rescue memorials too small to see and a memorial
 * 276 ft across needs no rescuing in plan, while its lowness is the design.
 * PLACE HEIGHT: dc-3d.js carries h: 3 for "korean". The tallest published
 * element is the Mural Wall's west end at 12 ft = 3.66 m, so the place height
 * wants to be 4. dc-3d.js is a shared file and is NOT edited here; the
 * correction is reported instead.
 *
 * FRAME. u east, v north, z up, all feet, origin at the dc-3d.js coordinate
 * for "korean", which falls inside the memorial's own footprint, so the plan
 * is drawn at its true offsets rather than recentred.
 *
 * PAINT. Every large flat ground surface carries an explicit LAYER constant
 * plus its own projected depth, so the layers stack (pad, plaza, paths,
 * field, water, shadows) while keeping their internal order, and every
 * upright object sorts above all of them on its real depth. The long runs,
 * the Mural Wall, the curbs, the field strips and the ring wall, are all cut
 * into segments so a single long slab can never sort as one thing, and every
 * segment overruns its neighbour slightly because abutting quads round apart
 * under toFixed and leave a ladder of pale seams. Both of those are the
 * Hirshhorn ring's lesson and the Vietnam bank's lesson arriving again.
 */
(function () {
  var H = window.DC3D.helpers;
  window.DC_FORMS = window.DC_FORMS || {};
  window.DC_FORMS['korean'] = function (ctx, p, s, VE) {
    var P = ctx.project, items = [];
    var FT = 0.3048 * VE;          /* true feet, see the SCALE note above */
    var m  = FT * s;
    function pt(u, v, z) { return P(p.x + u * m, p.y + v * m, z * FT); }

    /* ---------- measured plan, feet ---------- */
    var MW_W = [-223.33, -34.31], MW_E = [-58.87, -32.41];   /* Mural Wall */
    var UN_W = [-225.03, 127.39], UN_E = [-72.86,  18.78];   /* UN Wall */
    var F_NW = [-217.38, 104.06], F_NE = [-63.90,  -7.07];   /* field north edge */
    var F_SW = [-215.28, -20.96], F_SE = [-63.71, -18.45];   /* field south edge */
    var PCU = -15.74, PCV = -15.24, PR = 73.5, PR_TRACE = 66.92;  /* plaza */
    var POU = -16.73, POV = -17.88, POR = 31.30;             /* pool */
    var FF_A = [-45.10, -32.00], FF_B = [-6.50, -30.60];     /* Freedom Is Not Free */
    var A_END = -164.5 * Math.PI / 180;   /* built arc runs CCW from here ... */
    var A_BEG =  149.3 * Math.PI / 180;   /* ... to here; the gap is the field */

    /* ---------- published, feet ---------- */
    var MW_TOP = 12.0, MW_THK = 0.667, MW_PANELS = 41;
    var WOR_W = 5.1667, WOR_H = 3.7083;      /* 5'-2" wide, 3' 8 1/2" high */
    var N_TREE = 40, N_BENCH = 9, N_STAT = 19;

    /* ---------- derived ---------- */
    var GRADE = 7.0 / 164.47;      /* 1 in 23.5, from the wall's own taper */
    var PZ = 7.0;                  /* the plaza, level, at the top of the hill */
    var R_WOR = 69.0;              /* ring centreline, see the header */

    /* ---------- assumptions, each named in the header ---------- */
    var POLE = 60;                 /* flagpole: NOT published anywhere */
    var TRI = 26;                  /* the granite triangle at its base */
    var NBAND = 7, BAND_W = 2.5;   /* granite bands: count, width, direction */
    function bandW(t) { return BAND_W + (t / 0.839) * (1.0 - BAND_W); }
    var UNC_H = 1.5, UNC_W = 2.2;  /* the United Nations curbstone */
    var CURB_H = 0.95, CURB_W = 2.6;  /* the casualty curb at the water */
    var FF_H = 3.2, FF_T = 1.6;    /* the Freedom Is Not Free wall */
    var WATER_DZ = 0.6;            /* the pool is "shallow" and undimensioned */
    var LR1 = 58.0, LR2 = 63.5;    /* the two pleached linden rows */
    var TRUNK = 9.5, CANOPY = 17;    /* pleached: clear stem, clipped canopy */

    /* the ground. Rises 7 ft east over the Mural Wall's run, level above and
       below it, so the plaza is a flat table at the top of the hill. */
    function g(u) {
      var z = (u - MW_W[0]) * GRADE;
      return z < 0 ? 0 : (z > PZ ? PZ : z);
    }

    /* ---------- light and two tones per material ---------- */
    var LD = [0.55, 0.35, 0.72];              /* the renderer's own vector */
    var SDX = -LD[0] / LD[2], SDY = -LD[1] / LD[2];
    function tone(mt, nx, ny, nz) {
      var d = nx * LD[0] + ny * LD[1] + nz * LD[2];
      return ctx.shade(d > 0.05 ? mt.lit : mt.shade, nx, ny, nz);
    }
    var BLACK  = { lit: "#3d444d", shade: "#191d22" };  /* Academy Black, polished */
    var SKYW   = { lit: "#68717c", shade: "#3b434c" };  /* the sky in that polish */
    var NAMED  = { lit: "#7c848d", shade: "#4d545c" };  /* the sloped face that carries the names */
    var RING   = { lit: "#4a515a", shade: "#2c3239" };  /* the ring wall's outer face */
    var NEWPAVE= { lit: "#8f9089", shade: "#75766f" };  /* the 2022 Academy Black paving */
    var PAVE   = { lit: "#c6c5bb", shade: "#a5a49a" };  /* plaza granite */
    var WALK   = { lit: "#cbc9bd", shade: "#aeaca0" };  /* the two paths */
    var BAND   = { lit: "#d7d8d0", shade: "#b3b4ac" };  /* the polished strips */
    var JUN    = { lit: "#5c7d68", shade: "#3d5a49" };  /* Blue Pacific juniper */
    var STEEL  = { lit: "#d8dce1", shade: "#959da7" };  /* stainless steel */
    var LEAF   = { lit: "#8aa469", shade: "#5e7548" };
    var BARK   = { lit: "#8d8071", shade: "#665b4f" };
    var WATER  = { lit: "#6e8b91", shade: "#2f4249" };
    var STONE  = { lit: "#cfcdc3", shade: "#adaba1" };
    var POLEC  = { lit: "#b9b8b2", shade: "#8e8d88" };  /* a 1 ft pole is 2 px: it needs the tone to read */
    var BENCH  = { lit: "#9a9689", shade: "#77746a" };  /* benches, so they read on pale paving */

    /* ---------- paint layers ----------
       Every large flat surface sits on a layer AND keeps its own projected
       depth inside it, so the stack never inverts and the order within a
       layer stays right. Upright things use their real depth and so always
       paint above all of these. */
    var L_PAD = -1e9 + 0.3, L_PLAZA = -9e5, L_WALK = -8.9e5,
        L_FIELD = -8.8e5, L_WATER = -8.6e5, L_SHADOW = -8.5e5;

    function flat(poly, fill, layer, extra, abs) {
      var q = poly.map(function (c) { return pt(c[0], c[1], c[2]); });
      items.push({ svg: ctx.poly(q, fill, null, 0, extra || ''),
                   depth: abs === undefined ? layer + H.depthOf(q) : abs });
    }
    function face(q3, fill, bias, extra) {
      var q = q3.map(function (c) { return pt(c[0], c[1], c[2]); });
      items.push({ svg: ctx.poly(q, fill, null, 0, extra || ''),
                   depth: H.depthOf(q) + (bias || 0) });
      return q;
    }
    /* a ground shadow: the footprint slid along the light and laid on a
       stated base level, because objects here stand on a slope and on a
       plaza and H.shadow can only lay one at z = 0.3 m. */
    function shadow(poly, h, zb) {
      var dx = SDX * h, dy = SDY * h, q = [];
      poly.forEach(function (c) { q.push(pt(c[0], c[1], zb + 0.06)); });
      for (var i = poly.length - 1; i >= 0; i--) {
        q.push(pt(poly[i][0] + dx, poly[i][1] + dy, zb + 0.06));
      }
      items.push({ svg: ctx.poly(q, "#000", null, 0, ' opacity="' + (SHOP || 0.17) + '"'),
                   depth: L_SHADOW + H.depthOf(q) });
    }
    var SHOP = 0;
    /* a box, per-face culled, with a top and an optional taper */
    function box(cu, cv, wu, wv, z0, z1, mt, o) {
      o = o || {};
      var wuT = o.wuT === undefined ? wu : o.wuT, wvT = o.wvT === undefined ? wv : o.wvT;
      var bu = wu / 2, bv = wv / 2, tu = wuT / 2, tv = wvT / 2;
      var lo = [[cu-bu,cv-bv],[cu+bu,cv-bv],[cu+bu,cv+bv],[cu-bu,cv+bv]];
      var hi = [[cu-tu,cv-tv],[cu+tu,cv-tv],[cu+tu,cv+tv],[cu-tu,cv+tv]];
      var nm = [[0,-1],[1,0],[0,1],[-1,0]], bias = o.bias || 0;
      for (var i = 0; i < 4; i++) {
        if (!ctx.faceVisible(nm[i][0], nm[i][1])) continue;
        var j = (i + 1) % 4;
        var q = [pt(lo[i][0],lo[i][1],z0), pt(lo[j][0],lo[j][1],z0),
                 pt(hi[j][0],hi[j][1],z1), pt(hi[i][0],hi[i][1],z1)];
        items.push({ svg: ctx.poly(q, tone(mt, nm[i][0], nm[i][1], 0), null, 0),
                     depth: H.depthOf(q) + bias + i * 0.001 });
      }
      if (!o.noTop) {
        var tq = hi.map(function (c) { return pt(c[0], c[1], z1); });
        items.push({ svg: ctx.poly(tq, tone(mt, 0, 0, 1), null, 0),
                     depth: H.depthOf(tq) + bias + 0.02 });
      }
    }

    /* ================= 1. the site, and its hill ================= */
    (function () {
      /* three strips, so the derived 4.26 percent grade is in the GROUND and
         not only in the wall that revealed it. The tone is the host's own
         lawn, so the memorial's pad and the Mall's lawn meet without a seam.
         Sorted under everything, and below the -1e9+1.5 line the renderer
         uses to keep a pad out of the camera fit. */
      var LW = H.C.lawn || "#cfd8c4";
      var V0 = -155, V1 = 200, W0 = -320, W1 = 120;
      /* an ABSOLUTE depth, not a layer plus its own depth: the renderer keeps
         anything above -1e9+1.5 inside the camera fit, so a pad that carried
         its projected depth would frame the lawn instead of the memorial and
         leave the model a speck in the middle of a field. */
      function pad(q, i) {
        var w = q.map(function (c) { return pt(c[0], c[1], c[2]); });
        items.push({ svg: ctx.poly(w, LW, null, 0), depth: L_PAD + i * 0.02 });
      }
      pad([[W0,V0,0],[MW_W[0],V0,0],[MW_W[0],V1,0],[W0,V1,0]], 0);
      pad([[MW_W[0],V0,0],[MW_E[0],V0,PZ],[MW_E[0],V1,PZ],[MW_W[0],V1,0]], 1);
      pad([[MW_E[0],V0,PZ],[W1,V0,PZ],[W1,V1,PZ],[MW_E[0],V1,PZ]], 2);
    })();

    /* ================= 2. the circle: plaza, pool, ring ================= */
    (function () {
      var N = 72, i, a0, a1, ov = (Math.PI * 2 / N) * 0.35;

      /* the paved disc */
      var ring = [];
      for (i = 0; i < N; i++) {
        a0 = i / N * Math.PI * 2;
        ring.push([PCU + PR * Math.cos(a0), PCV + PR * Math.sin(a0), PZ]);
      }
      flat(ring, tone(PAVE, 0, 0, 1), L_PLAZA);

      /* the 2022 addition, drawn because NCPC publishes it as visible: "The
         new paving and wall will be constructed of the same Academy Black
         granite used in the original memorial. However, the paving will be
         larger to differentiate the new addition." So the nine feet the plaza
         grew reads as its own ring, and the 2024 trace's 66.92 ft arc, which
         is the 1995 edge, is the line between the two. */
      for (i = 0; i < N; i++) {
        a0 = i / N * Math.PI * 2; a1 = (i + 1.06) / N * Math.PI * 2;
        flat([[PCU + PR_TRACE*Math.cos(a0), PCV + PR_TRACE*Math.sin(a0), PZ],
              [PCU + PR_TRACE*Math.cos(a1), PCV + PR_TRACE*Math.sin(a1), PZ],
              [PCU + PR*Math.cos(a1), PCV + PR*Math.sin(a1), PZ],
              [PCU + PR*Math.cos(a0), PCV + PR*Math.sin(a0), PZ]],
             tone(NEWPAVE, 0, 0, 1), L_PLAZA + 200);
      }

      /* the rim where the plaza stands above the rising field: a real face,
         not a drawn line. Only the western arc has any, because east of the
         Mural Wall's end the ground is already at plaza level. */
      for (i = 0; i < N; i++) {
        a0 = i / N * Math.PI * 2; a1 = (i + 1) / N * Math.PI * 2 + ov;
        var u0 = PCU + PR * Math.cos(a0), v0 = PCV + PR * Math.sin(a0);
        var u1 = PCU + PR * Math.cos(a1), v1 = PCV + PR * Math.sin(a1);
        if (g(u0) >= PZ - 0.05 && g(u1) >= PZ - 0.05) continue;
        var nx = Math.cos((a0 + a1) / 2), ny = Math.sin((a0 + a1) / 2);
        if (!ctx.faceVisible(nx, ny)) continue;
        face([[u0,v0,g(u0)],[u1,v1,g(u1)],[u1,v1,PZ],[u0,v0,PZ]],
             tone(STONE, nx, ny, 0), 0.05);
      }

      /* the berm. NCPC publishes it as a GRADE and nothing else: "raising the
         existing berm from the surrounding landscape from four to ten percent
         to conceal most of the wall and maintain reciprocal views". So it is
         drawn the way the Vietnam back slope was, as a grade rather than a
         height: eight percent, the middle of the published range, out from the
         plaza edge and back down to the lawn. Its WIDTH and therefore its
         1.4 ft crest are consequences of that drawn width, not claims.
         It is SITE GROUND, so like the pad it carries an absolute depth and
         stays out of the camera fit: a bank reaching 100 ft past the plaza
         would otherwise frame the lawn and shrink the memorial inside it. It
         matters because without it the plaza reads as a plate laid on the
         grass and the black ring stands fully exposed, where in life the bank
         hides most of it. */
      var BW = 18, BH = BW * 0.08;
      for (i = 0; i < N; i++) {
        a0 = i / N * Math.PI * 2; a1 = (i + 1.06) / N * Math.PI * 2;
        var mm = (a0 + a1) / 2, cm = Math.cos(mm), sm = Math.sin(mm);
        var gap = ((mm - A_BEG + Math.PI * 4) % (Math.PI * 2)) < ((A_END - A_BEG + Math.PI * 4) % (Math.PI * 2));
        if (gap) continue;                    /* the field and its paths enter here */
        flat([[PCU + PR*Math.cos(a0), PCV + PR*Math.sin(a0), PZ],
              [PCU + PR*Math.cos(a1), PCV + PR*Math.sin(a1), PZ],
              [PCU + (PR+BW)*Math.cos(a1), PCV + (PR+BW)*Math.sin(a1), PZ + BH],
              [PCU + (PR+BW)*Math.cos(a0), PCV + (PR+BW)*Math.sin(a0), PZ + BH]],
             ctx.shade(H.C.lawn || "#cfd8c4", -cm * 0.08, -sm * 0.08, 0.997), 0, '', L_PAD + 0.10);
        flat([[PCU + (PR+BW)*Math.cos(a0), PCV + (PR+BW)*Math.sin(a0), PZ + BH],
              [PCU + (PR+BW)*Math.cos(a1), PCV + (PR+BW)*Math.sin(a1), PZ + BH],
              [PCU + (PR+2*BW)*Math.cos(a1), PCV + (PR+2*BW)*Math.sin(a1), PZ],
              [PCU + (PR+2*BW)*Math.cos(a0), PCV + (PR+2*BW)*Math.sin(a0), PZ]],
             ctx.shade(H.C.lawn || "#cfd8c4", cm * 0.08, sm * 0.08, 0.997), 0, '', L_PAD + 0.08);
      }

      /* the Pool of Remembrance: measured circle, black granite lining */
      var wat = [];
      for (i = 0; i < 48; i++) {
        a0 = i / 48 * Math.PI * 2;
        wat.push([POU + POR * Math.cos(a0), POV + POR * Math.sin(a0), PZ - WATER_DZ]);
      }
      flat(wat, tone(WATER, 0, 0, 1), L_WATER);
      /* its inner lining, seen across the water on the far side */
      for (i = 0; i < 48; i++) {
        a0 = i / 48 * Math.PI * 2; a1 = (i + 1) / 48 * Math.PI * 2 + 0.006;
        var lx = Math.cos((a0 + a1) / 2), ly = Math.sin((a0 + a1) / 2);
        if (ctx.faceVisible(lx, ly)) continue;      /* only the far wall shows */
        face([[POU + POR*Math.cos(a0), POV + POR*Math.sin(a0), PZ - WATER_DZ],
              [POU + POR*Math.cos(a1), POV + POR*Math.sin(a1), PZ - WATER_DZ],
              [POU + POR*Math.cos(a1), POV + POR*Math.sin(a1), PZ],
              [POU + POR*Math.cos(a0), POV + POR*Math.sin(a0), PZ]],
             tone(BLACK, -lx, -ly, 0), 0.04);
      }
      /* the casualty curb at the water's edge, angled, low, and architecture */
      for (i = 0; i < 48; i++) {
        a0 = i / 48 * Math.PI * 2; a1 = (i + 1) / 48 * Math.PI * 2 + 0.008;
        var c0 = Math.cos(a0), s0 = Math.sin(a0), c1 = Math.cos(a1), s1 = Math.sin(a1);
        var ri = POR, ro = POR + CURB_W;
        var qt = [[POU + ri*c0, POV + ri*s0, PZ + 0.12],
                  [POU + ri*c1, POV + ri*s1, PZ + 0.12],
                  [POU + ro*c1, POV + ro*s1, PZ + CURB_H],
                  [POU + ro*c0, POV + ro*s0, PZ + CURB_H]];
        var mx = Math.cos((a0 + a1) / 2), my = Math.sin((a0 + a1) / 2);
        face(qt, tone(BLACK, -mx * 0.45, -my * 0.45, 0.89), 0.06);
        if (ctx.faceVisible(mx, my)) {
          face([[POU + ro*c0, POV + ro*s0, PZ],[POU + ro*c1, POV + ro*s1, PZ],
                [POU + ro*c1, POV + ro*s1, PZ + CURB_H],[POU + ro*c0, POV + ro*s0, PZ + CURB_H]],
               tone(BLACK, mx, my, 0), 0.07);
        }
      }

      /* FREEDOM IS NOT FREE: the measured 38.6 ft wall running into the pool */
      (function () {
        var du = FF_B[0] - FF_A[0], dv = FF_B[1] - FF_A[1];
        var L = Math.hypot(du, dv); du /= L; dv /= L;
        var nu = -dv, nv = du, hw = FF_T / 2;
        var A = FF_A, B = FF_B, zb = PZ - WATER_DZ;
        [[nu, nv], [-nu, -nv]].forEach(function (n) {
          if (!ctx.faceVisible(n[0], n[1])) return;
          face([[A[0]+n[0]*hw, A[1]+n[1]*hw, zb],[B[0]+n[0]*hw, B[1]+n[1]*hw, zb],
                [B[0]+n[0]*hw, B[1]+n[1]*hw, zb+FF_H],[A[0]+n[0]*hw, A[1]+n[1]*hw, zb+FF_H]],
               tone(BLACK, n[0], n[1], 0), 0.3);
        });
        face([[A[0]+nu*hw, A[1]+nv*hw, zb+FF_H],[B[0]+nu*hw, B[1]+nv*hw, zb+FF_H],
              [B[0]-nu*hw, B[1]-nv*hw, zb+FF_H],[A[0]-nu*hw, A[1]-nv*hw, zb+FF_H]],
             tone(STONE, 0, 0, 1), 0.4);
        /* the silver inscription, one bright band, the only bright thing on
           any black stone in this model */
        face([[A[0]+nu*hw*1.02 + du*3, A[1]+nv*hw*1.02 + dv*3, zb+FF_H*0.62],
              [A[0]+nu*hw*1.02 + du*(L-3), A[1]+nv*hw*1.02 + dv*(L-3), zb+FF_H*0.62],
              [A[0]+nu*hw*1.02 + du*(L-3), A[1]+nv*hw*1.02 + dv*(L-3), zb+FF_H*0.84],
              [A[0]+nu*hw*1.02 + du*3, A[1]+nv*hw*1.02 + dv*3, zb+FF_H*0.84]],
             "#b6b1a2", 0.45);
      })();

      /* the Wall of Remembrance: a low angled ring, high on the outside and
         sloping down toward the pool, which is the face that carries the
         names. Open across the measured field entrance. */
      var span = (A_BEG - A_END + Math.PI * 2) % (Math.PI * 2);
      var SEG = 64, k;
      for (k = 0; k < SEG; k++) {
        var b0 = A_END + span * (k / SEG), b1 = A_END + span * ((k + 1.03) / SEG);
        var ri2 = R_WOR - WOR_W / 2, ro2 = R_WOR + WOR_W / 2;
        var C0 = Math.cos(b0), S0 = Math.sin(b0), C1 = Math.cos(b1), S1 = Math.sin(b1);
        var mx2 = Math.cos((b0 + b1) / 2), my2 = Math.sin((b0 + b1) / 2);
        /* the sloped, named face, looking in and up at the pool */
        face([[PCU + ri2*C0, PCV + ri2*S0, PZ + 0.5],[PCU + ri2*C1, PCV + ri2*S1, PZ + 0.5],
              [PCU + ro2*C1, PCV + ro2*S1, PZ + WOR_H],[PCU + ro2*C0, PCV + ro2*S0, PZ + WOR_H]],
             tone(NAMED, -mx2 * 0.55, -my2 * 0.55, 0.83), 0.1);
        /* its outer face, the side the berm would bury */
        if (ctx.faceVisible(mx2, my2)) {
          face([[PCU + ro2*C0, PCV + ro2*S0, PZ],[PCU + ro2*C1, PCV + ro2*S1, PZ],
                [PCU + ro2*C1, PCV + ro2*S1, PZ + WOR_H],[PCU + ro2*C0, PCV + ro2*S0, PZ + WOR_H]],
               tone(RING, mx2, my2, 0), 0.12);
        }
        /* one joint every eighth panel: 100 hairlines at map scale is the
           NMAAHC brick wall again */
        if (k % 8 === 0) {
          face([[PCU + ri2*C0, PCV + ri2*S0, PZ + 0.5],
                [PCU + (ri2)*Math.cos(b0+0.006), PCV + ri2*Math.sin(b0+0.006), PZ + 0.5],
                [PCU + ro2*Math.cos(b0+0.006), PCV + ro2*Math.sin(b0+0.006), PZ + WOR_H],
                [PCU + ro2*C0, PCV + ro2*S0, PZ + WOR_H]],
               tone(BLACK, -mx2 * 0.5, -my2 * 0.5, 0.8), 0.14);
        }
      }
    })();

    /* ================= 3. the field of service ================= */
    /* the triangle, clipped where its centreline crosses the measured plaza
       edge, at t = 0.839 on its centreline. The traced garden polygon runs
       about 26 ft past that; juniper does not grow under paving, so it is
       cut. The north edge overshoots the arc by four feet at that clip, which
       is inside the width of the joint and is left rather than bent. */
    var TMAX = 0.839;
    function fS(t) { return [F_SW[0] + t * (F_SE[0] - F_SW[0]), F_SW[1] + t * (F_SE[1] - F_SW[1])]; }
    function fN(t) { return [F_NW[0] + t * (F_NE[0] - F_NW[0]), F_NW[1] + t * (F_NE[1] - F_NW[1])]; }
    function fW(t) { var a = fS(t), b = fN(t); return Math.hypot(b[0]-a[0], b[1]-a[1]); }
    function fP(t, f) { var a = fS(t), b = fN(t);
      return [a[0] + f * (b[0] - a[0]), a[1] + f * (b[1] - a[1])]; }

    (function () {
      var SEG = 16, i, k;
      for (i = 0; i < SEG; i++) {
        var t0 = TMAX * i / SEG, t1 = TMAX * (i + 1.04) / SEG;
        if (t1 > TMAX) t1 = TMAX;
        /* the juniper carpet, raised so it is a shrub bed and not a paint
           colour, with its own north face where the camera can see it */
        var a0 = fS(t0), b0 = fN(t0), a1 = fS(t1), b1 = fN(t1);
        var jz = 1.15;
        flat([[a0[0],a0[1],g(a0[0])+jz],[a1[0],a1[1],g(a1[0])+jz],
              [b1[0],b1[1],g(b1[0])+jz],[b0[0],b0[1],g(b0[0])+jz]],
             tone(JUN, 0, 0, 1), L_FIELD + 60);
        /* the granite bands. Narrow, fixed width, spaced across the field so
           they converge with it. Laid on the ground between the juniper, so
           each is drawn with the juniper's own edge faces beside it. */
        for (k = 0; k < NBAND; k++) {
          var c = (k + 0.5) / NBAND;
          /* the bands TAPER with the field. At a fixed 2.5 ft they filled 70
             percent of the 25 ft apex and read as seven pale roads, which is
             the opposite of "narrow granite bands"; the picture caught it and
             no count would have. */
          var h0 = bandW(t0) / 2 / fW(t0), h1 = bandW(t1) / 2 / fW(t1);
          var p00 = fP(t0, c - h0), p01 = fP(t0, c + h0);
          var p10 = fP(t1, c - h1), p11 = fP(t1, c + h1);
          flat([[p00[0],p00[1],g(p00[0])+0.06],[p10[0],p10[1],g(p10[0])+0.06],
                [p11[0],p11[1],g(p11[0])+0.06],[p01[0],p01[1],g(p01[0])+0.06]],
               tone(BAND, 0, 0, 1), L_FIELD + 400);
          /* the juniper's cut edge on each side of the band, so the bed has a
             thickness and the band sits IN it rather than on top of it */
          [[p00, p10, -1], [p01, p11, 1]].forEach(function (e) {
            var du = e[1][0] - e[0][0], dv = e[1][1] - e[0][1];
            var L = Math.hypot(du, dv) || 1;
            var nx = -dv / L * e[2], ny = du / L * e[2];
            if (!ctx.faceVisible(nx, ny)) return;
            face([[e[0][0],e[0][1],g(e[0][0])],[e[1][0],e[1][1],g(e[1][0])],
                  [e[1][0],e[1][1],g(e[1][0])+jz],[e[0][0],e[0][1],g(e[0][0])+jz]],
                 tone(JUN, nx, ny, 0), -0.02);
          });
        }
      }
      /* the field's own two long edges against the paths */
      [[fS, -1], [fN, 1]].forEach(function (E) {
        for (var i2 = 0; i2 < SEG; i2++) {
          var t0 = TMAX * i2 / SEG, t1 = TMAX * (i2 + 1.04) / SEG;
          if (t1 > TMAX) t1 = TMAX;
          var a = E[0](t0), b = E[0](t1);
          var du = b[0] - a[0], dv = b[1] - a[1], L = Math.hypot(du, dv) || 1;
          var nx = -dv / L * E[1], ny = du / L * E[1];
          if (!ctx.faceVisible(nx, ny)) continue;
          face([[a[0],a[1],g(a[0])],[b[0],b[1],g(b[0])],
                [b[0],b[1],g(b[0])+1.15],[a[0],a[1],g(a[0])+1.15]],
               tone(JUN, nx, ny, 0), -0.02);
        }
      });
    })();

    /* ================= 4. the two paths ================= */
    /* "The field, defined by two paths" (NCPC). Their widths are MEASURED, as
       the gaps between measured lines: 13.3 to 14.0 ft between the Mural Wall
       and the field's south edge, 14.5 to 15.8 ft between the field's north
       edge and the United Nations Wall.
       Each path is walked along ITS OWN WALL, not along the field, because the
       picture caught what no count could: walking the field and the UN Wall at
       the same t opened the north path to 27 ft at its east end, since the two
       measured lines are parallel but their ends are offset about 20 ft ALONG
       themselves, and it left the curbstone's last 20 ft as a black line lying
       loose on the lawn with no path beside it. */
    function bandAlong(A, B, w0, w1, sgn, fill, layer) {
      var du = B[0] - A[0], dv = B[1] - A[1], L = Math.hypot(du, dv);
      du /= L; dv /= L;
      var nu = -dv * sgn, nv = du * sgn, SEG = 18, i;
      for (i = 0; i < SEG; i++) {
        var t0 = i / SEG, t1 = (i + 1.06) / SEG; if (t1 > 1) t1 = 1;
        var a = [A[0] + du * L * t0, A[1] + dv * L * t0];
        var b = [A[0] + du * L * t1, A[1] + dv * L * t1];
        var wa = w0 + (w1 - w0) * t0, wb = w0 + (w1 - w0) * t1;
        flat([[a[0], a[1], g(a[0]) + 0.04],[b[0], b[1], g(b[0]) + 0.04],
              [b[0] + nu * wb, b[1] + nv * wb, g(b[0]) + 0.04],
              [a[0] + nu * wa, a[1] + nv * wa, g(a[0]) + 0.04]], fill, layer);
      }
    }
    (function () {
      var pv = tone(WALK, 0, 0, 1);
      /* south path: off the Mural Wall's north face, toward the field */
      bandAlong([MW_W[0], MW_W[1] + MW_THK], [MW_E[0], MW_E[1] + MW_THK],
                13.3, 14.0, 1, pv, L_WALK);
      /* north path: off the United Nations Wall, toward the field. Its east
         corner lands on the field's own north edge to within a few inches,
         which is the check that the offset construction is the right one. */
      bandAlong(UN_W, UN_E, 14.5, 15.8, -1, pv, L_WALK);
    })();

    /* ================= 5. the Mural Wall ================= */
    /* Its top is LEVEL at 12 ft and the ground climbs to meet it: that is the
       whole of the published taper, and the reason this memorial has a hill. */
    var statues = [];
    (function () {
      var SEG = 22, i;
      var du = MW_E[0] - MW_W[0], dv = MW_E[1] - MW_W[1];
      function wp(t) { return [MW_W[0] + du * t, MW_W[1] + dv * t]; }
      var nN = [0, 1], nS = [0, -1];
      for (i = 0; i < SEG; i++) {
        var t0 = i / SEG, t1 = (i + 1.04) / SEG; if (t1 > 1) t1 = 1;
        var a = wp(t0), b = wp(t1);
        var zA = g(a[0]), zB = g(b[0]);
        /* the north face: polished, etched, and the mirror */
        if (ctx.faceVisible(nN[0], nN[1])) {
          face([[a[0],a[1]+MW_THK,zA],[b[0],b[1]+MW_THK,zB],
                [b[0],b[1]+MW_THK,MW_TOP],[a[0],a[1]+MW_THK,MW_TOP]],
               tone(BLACK, 0, 1, 0), 0);
          /* polished black reads by REFLECTION, not by shading, so the sky
             falls down the face and it is never flat black. Two steps rather
             than one, because a single hard band reads as a painted stripe. */
          face([[a[0],a[1]+MW_THK,MW_TOP - (MW_TOP-zA)*0.46],[b[0],b[1]+MW_THK,MW_TOP - (MW_TOP-zB)*0.46],
                [b[0],b[1]+MW_THK,MW_TOP],[a[0],a[1]+MW_THK,MW_TOP]],
               tone(SKYW, 0, 1, 0.12), 0.05);
          face([[a[0],a[1]+MW_THK,MW_TOP - (MW_TOP-zA)*0.17],[b[0],b[1]+MW_THK,MW_TOP - (MW_TOP-zB)*0.17],
                [b[0],b[1]+MW_THK,MW_TOP],[a[0],a[1]+MW_THK,MW_TOP]],
               tone(SKYW, 0, 1, 0.55), 0.06);
        }
        /* the south face, which since 2022 carries "additional information
           about the Korean War" and is the same polished stone. Drawn with
           its own, weaker sky wash: the picture caught it reading as a
           near-black bar from the south, and a mirror in shade still
           reflects the sky, it does not go matte. */
        if (ctx.faceVisible(nS[0], nS[1])) {
          face([[a[0],a[1],zA],[b[0],b[1],zB],[b[0],b[1],MW_TOP],[a[0],a[1],MW_TOP]],
               tone(BLACK, 0, -1, 0), 0);
          face([[a[0],a[1],MW_TOP - (MW_TOP-zA)*0.40],[b[0],b[1],MW_TOP - (MW_TOP-zB)*0.40],
                [b[0],b[1],MW_TOP],[a[0],a[1],MW_TOP]],
               tone(SKYW, 0, -1, 0.30), 0.05);
          face([[a[0],a[1],MW_TOP - (MW_TOP-zA)*0.14],[b[0],b[1],MW_TOP - (MW_TOP-zB)*0.14],
                [b[0],b[1],MW_TOP],[a[0],a[1],MW_TOP]],
               tone(SKYW, 0, -1, 0.72), 0.06);
        }
        /* the coping: the top of a wall is seen from every angle */
        face([[a[0],a[1],MW_TOP],[b[0],b[1],MW_TOP],
              [b[0],b[1]+MW_THK,MW_TOP],[a[0],a[1]+MW_THK,MW_TOP]],
             tone(STONE, 0, 0, 1), 0.09);
      }
      /* panel joints: 41 panels is 40 hairlines, which at map scale is
         brickwork. One every fifth panel, one tone off. */
      for (i = 5; i < MW_PANELS; i += 5) {
        var t = i / MW_PANELS, c = wp(t), d2 = wp(t + 0.4 / MW_PANELS);
        if (!ctx.faceVisible(0, 1)) break;
        face([[c[0],c[1]+MW_THK,g(c[0])],[d2[0],d2[1]+MW_THK,g(d2[0])],
              [d2[0],d2[1]+MW_THK,MW_TOP],[c[0],c[1]+MW_THK,MW_TOP]],
             tone(BLACK, 0, 1, -0.4), 0.12);
      }
      /* the wall's two ends, 8 inches of stone */
      [[MW_W, -1], [MW_E, 1]].forEach(function (E) {
        if (!ctx.faceVisible(E[1], 0)) return;
        face([[E[0][0],E[0][1],g(E[0][0])],[E[0][0],E[0][1]+MW_THK,g(E[0][0])],
              [E[0][0],E[0][1]+MW_THK,MW_TOP],[E[0][0],E[0][1],MW_TOP]],
             tone(BLACK, E[1], 0, 0), 0.1);
      });
      /* the wall's shadow, thrown south-west onto the south path */
      var sh = [];
      for (i = 0; i <= 8; i++) { var q = wp(i / 8); sh.push([q[0], q[1]]); }
      for (i = 8; i >= 0; i--) {
        var q2 = wp(i / 8), hh = MW_TOP - g(q2[0]);
        sh.push([q2[0] + SDX * hh, q2[1] + SDY * hh]);
      }
      var sq = sh.map(function (c) { return pt(c[0], c[1], g(c[0]) + 0.05); });
      items.push({ svg: ctx.poly(sq, "#000", null, 0, ' opacity="0.15"'),
                   depth: L_SHADOW + H.depthOf(sq) });
    })();

    /* ================= 6. the United Nations curbstone ================= */
    (function () {
      var SEG = 18, i;
      var du = UN_E[0] - UN_W[0], dv = UN_E[1] - UN_W[1];
      var L = Math.hypot(du, dv); du /= L; dv /= L;
      var nu = -dv, nv = du;                      /* toward the path, southwest */
      if (nu > 0) { nu = -nu; nv = -nv; }
      for (i = 0; i < SEG; i++) {
        var t0 = i / SEG * L, t1 = (i + 1.05) / SEG * L; if (t1 > L) t1 = L;
        var A = [UN_W[0] + du * t0, UN_W[1] + dv * t0];
        var B = [UN_W[0] + du * t1, UN_W[1] + dv * t1];
        var zA = g(A[0]), zB = g(B[0]);
        /* the angled top, its low edge toward the walk */
        face([[A[0]+nu*UNC_W, A[1]+nv*UNC_W, zA+UNC_H*0.45],[B[0]+nu*UNC_W, B[1]+nv*UNC_W, zB+UNC_H*0.45],
              [B[0], B[1], zB+UNC_H],[A[0], A[1], zA+UNC_H]],
             tone(BLACK, nu*0.5, nv*0.5, 0.86), 0.06);
        [[nu, nv, UNC_W], [-nu, -nv, 0]].forEach(function (F) {
          if (!ctx.faceVisible(F[0], F[1])) return;
          var h = F[2] === 0 ? UNC_H : UNC_H * 0.45;
          face([[A[0]+nu*F[2], A[1]+nv*F[2], zA],[B[0]+nu*F[2], B[1]+nv*F[2], zB],
                [B[0]+nu*F[2], B[1]+nv*F[2], zB+h],[A[0]+nu*F[2], A[1]+nv*F[2], zA+h]],
               tone(BLACK, F[0], F[1], 0), 0.05);
        });
      }
    })();

    /* ================= 7. the nineteen ================= */
    /* Over life size, no plinth, no rank, scattered. The published count is
       exact and drawing eighteen or twenty is drawing another memorial. The
       ponchos cover the weapons, so no rifle is drawn: that is published, not
       a simplification. */
    (function () {
      var T = [0.13,0.18,0.22,0.27,0.30,0.34,0.38,0.41,0.45,0.48,
               0.52,0.55,0.59,0.62,0.66,0.69,0.73,0.77,0.81];
      var F = [0.29,0.57,0.15,0.71,0.43,0.85,0.29,0.60,0.72,0.16,
               0.44,0.85,0.57,0.30,0.71,0.44,0.60,0.72,0.45];
      var HT = [7.5,7.25,7.375,7.5,7.25,7.375,7.5,7.375,7.25,7.5,
                7.375,7.25,7.5,7.375,7.25,7.5,7.375,7.25,7.5];
      for (var i = 0; i < N_STAT; i++) {
        var q = fP(T[i], F[i]);
        statues.push({ u: q[0], v: q[1], h: HT[i] });
      }
      statues.forEach(function (S) {
        var z = g(S.u), h = S.h;
        shadow([[S.u-1.5,S.v-1.1],[S.u+1.5,S.v-1.1],[S.u+1.5,S.v+1.1],[S.u-1.5,S.v+1.1]], h, z);
        box(S.u, S.v, 1.75, 1.20, z, z + h * 0.45, STEEL, { bias: 0.10 });                 /* legs */
        box(S.u - 0.85, S.v, 1.05, 1.45, z + h * 0.50, z + h * 0.78, STEEL, { bias: 0.13 });/* pack */
        box(S.u, S.v, 2.95, 2.05, z + h * 0.42, z + h * 0.80, STEEL,
            { wuT: 2.05, wvT: 1.45, bias: 0.16 });                                          /* poncho */
        box(S.u, S.v, 0.95, 0.95, z + h * 0.79, z + h * 0.92, STEEL, { bias: 0.20 });       /* head */
        box(S.u, S.v, 1.50, 1.50, z + h * 0.88, z + h * 1.00, STEEL,
            { wuT: 1.05, wvT: 1.05, bias: 0.23 });                                          /* helmet */
      });
    })();

    /* ================= 8. nineteen become thirty-eight ================= */
    /* The published idea of this memorial, and the whole reason its wall is
       polished rather than matte: "The reflective quality of the academy black
       granite illustrates a total of 38 sculptures, symbolic of the 38th
       parallel and the 38 months of the war." A model whose wall carries only
       a wash has left out the one thing the memorial is famous for, so the
       ghosts are drawn as FIGURES, in the same four pieces the steel ones are
       built from, at the figure's own run along the wall, standing on the
       wall's base as a plane mirror puts them, fading with distance and
       clipped to the height of stone actually there. */
    (function () {
      if (!ctx.faceVisible(0, 1)) return;
      var wv = function (u) {
        return MW_W[1] + (MW_E[1] - MW_W[1]) * (u - MW_W[0]) / (MW_E[0] - MW_W[0]);
      };
      statues.forEach(function (S) {
        if (S.u < MW_W[0] + 2 || S.u > MW_E[0] - 2) return;
        var d = S.v - wv(S.u);
        if (d > 60 || d < 0) return;
        var op = 0.46 * (1 - d / 60);
        if (op <= 0.05) return;
        var ex = ' opacity="' + op.toFixed(2) + '"';
        var base = g(S.u), lid = MW_TOP, h = S.h, vw = wv(S.u) + MW_THK * 1.03;
        function part(w0, w1, f0, f1) {
          var z0 = base + h * f0, z1 = base + h * f1;
          if (z0 >= lid) return;
          if (z1 > lid) { var k = (lid - z0) / (z1 - z0); w1 = w0 + (w1 - w0) * k; z1 = lid; }
          face([[S.u - w0, vw, z0],[S.u + w0, vw, z0],
                [S.u + w1, vw, z1],[S.u - w1, vw, z1]], "#9aa4b0", 0.20, ex);
        }
        part(0.90, 0.90, 0.00, 0.45);   /* legs */
        part(1.50, 1.05, 0.42, 0.80);   /* the poncho, hem wide, shoulders narrow */
        part(0.50, 0.50, 0.79, 0.90);   /* head */
        part(0.78, 0.55, 0.88, 1.00);   /* helmet */
      });
    })();

    /* ================= 9. the apex: triangle, flagpole, flag ================= */
    (function () {
      var apx = fP(TMAX, 0.5);                      /* the field's own point */
      /* the large granite triangle that completes the field, its point east.
         Drawn wholly inside the field, so it lies on the field's grade and
         not half under the plaza paving. */
      var wA = fP(TMAX - 0.11, 0.5), wid = TRI / 2;
      var e0 = fP(TMAX - 0.11, 0), e1 = fP(TMAX - 0.11, 1);
      var nrm = [e0[0] - e1[0], e0[1] - e1[1]];
      var nl = Math.hypot(nrm[0], nrm[1]) || 1; nrm[0] /= nl; nrm[1] /= nl;
      var TZ = 0.65;   /* it is a stone, not a paint patch: give it an edge */
      var c1 = [wA[0] + nrm[0]*wid, wA[1] + nrm[1]*wid];
      var c2 = [wA[0] - nrm[0]*wid, wA[1] - nrm[1]*wid];
      var c3 = [apx[0] - 1.5, apx[1]];
      var tz = g(wA[0]);
      flat([[c1[0],c1[1],tz+TZ],[c2[0],c2[1],tz+TZ],[c3[0],c3[1],g(c3[0])+TZ]],
           tone(BAND, 0, 0, 1), L_FIELD + 900);
      [[c1,c3],[c3,c2],[c2,c1]].forEach(function (E) {
        var du2 = E[1][0]-E[0][0], dv2 = E[1][1]-E[0][1], L2 = Math.hypot(du2,dv2)||1;
        var ex2 = -dv2/L2, ey2 = du2/L2;
        if (!ctx.faceVisible(ex2, ey2)) return;
        face([[E[0][0],E[0][1],g(E[0][0])],[E[1][0],E[1][1],g(E[1][0])],
              [E[1][0],E[1][1],g(E[1][0])+TZ],[E[0][0],E[0][1],g(E[0][0])+TZ]],
             tone(BAND, ex2, ey2, 0), 0.05);
      });

      /* the flagpole, at the apex, on the plaza just clear of the field's
         point. HEIGHT IS AN ASSUMPTION, see the header. */
      var pu = apx[0] + 8, pv = apx[1], pz = PZ;
      shadow([[pu-2.2,pv-2.2],[pu+2.2,pv-2.2],[pu+2.2,pv+2.2],[pu-2.2,pv+2.2]], POLE * 0.55, pz);
      box(pu, pv, 7.0, 7.0, pz, pz + 0.9, BAND, { bias: 0.4 });
      box(pu, pv, 1.0, 1.0, pz + 0.9, pz + POLE, POLEC, { wuT: 0.62, wvT: 0.62, bias: 0.6 });
      var fw = 11, fh = 7;
      face([[pu, pv, pz + POLE],[pu + fw, pv, pz + POLE],
            [pu + fw, pv, pz + POLE - fh],[pu, pv, pz + POLE - fh]], "#b23a34", 2.0);
      face([[pu, pv, pz + POLE],[pu + fw * 0.42, pv, pz + POLE],
            [pu + fw * 0.42, pv, pz + POLE - fh * 0.54],[pu, pv, pz + POLE - fh * 0.54]],
           "#2e3f6d", 2.1);
    })();

    /* ================= 10. the pleached grove and its benches ================= */
    (function () {
      function tree(u, v, tr, ch, rad, box_, zb) {
        if (zb === undefined) zb = PZ;
        /* an OCTAGON, not a square, and a short sweep. Forty tree shadows at
           full strength turned the plaza into a checkerboard, and seven
           square ones under the western grove overlapped into a plaid, which
           is what a regular grid of semi-transparent quads always does. A
           rounder blob at low strength overlaps into shade. */
        SHOP = 0.085;
        var oct = [], oi, orr = rad * 0.95;
        for (oi = 0; oi < 8; oi++) {
          var oa = (oi / 8) * Math.PI * 2 + Math.PI / 8;
          oct.push([u + orr * Math.cos(oa), v + orr * Math.sin(oa)]);
        }
        shadow(oct, ch * 0.38, zb);
        SHOP = 0;
        box(u, v, 1.25, 1.25, zb, zb + tr, BARK, { bias: 0.3, noTop: true });
        if (box_) {
          /* pleached: a clipped block on a clear stem, which is what "two
             rows ... that create a circle of pleached trees" and the
             published "barrel effect" actually look like */
          box(u, v, rad * 2, rad * 2, zb + tr, zb + ch, LEAF, { bias: 0.5 });
        } else {
          box(u, v, rad * 1.5, rad * 1.5, zb + tr, zb + tr + (ch - tr) * 0.45, LEAF,
              { wuT: rad * 2, wvT: rad * 2, bias: 0.5, noTop: true });
          box(u, v, rad * 2, rad * 2, zb + tr + (ch - tr) * 0.45, zb + ch, LEAF,
              { wuT: rad * 0.7, wvT: rad * 0.7, bias: 0.55 });
        }
      }
      var per = N_TREE / 2, i, a;
      for (i = 0; i < per; i++) {
        a = A_END + ((A_BEG - A_END + Math.PI * 2) % (Math.PI * 2)) * ((i + 0.5) / per);
        tree(PCU + LR1 * Math.cos(a), PCV + LR1 * Math.sin(a), TRUNK, CANOPY, 4.1, true);
        tree(PCU + LR2 * Math.cos(a), PCV + LR2 * Math.sin(a), TRUNK, CANOPY, 4.1, true);
      }
      /* nine benches under the trees */
      for (i = 0; i < N_BENCH; i++) {
        a = A_END + ((A_BEG - A_END + Math.PI * 2) % (Math.PI * 2)) * ((i + 0.5) / N_BENCH);
        var r = (LR1 + LR2) / 2;
        box(PCU + r * Math.cos(a), PCV + r * Math.sin(a), 5.4, 2.0, PZ, PZ + 1.45, BENCH,
            { bias: 0.25 });
      }
      /* the grove the figures emerge from, on the western end */
      var GR = [[-243, 96], [-247, 62], [-244, 28], [-249, -6], [-243, -40],
                [-262, 78], [-266, 10]];
      GR.forEach(function (q) { tree(q[0], q[1], 9, 29, 9.5, false, g(q[0])); });
    })();

    return items;
  };
})();
