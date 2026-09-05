/* dc-form-mlk.js: the Martin Luther King, Jr. National Memorial, West Potomac
 * Park, 1964 Independence Ave SW, on the northwest shore of the Tidal Basin.
 * NOT the Yerba Buena Gardens memorial in San Francisco, which also has a
 * waterfall and turns up in the same searches.
 *
 * Built to MODEL_STANDARD.md. What stood here before was the generic "stone"
 * form: one tapered box on the lawn. This memorial is a CUT AND A MOVE. One
 * block is taken out of a larger block and set forward, and the empty slot it
 * left is the visitor's route. Close that slot and the memorial's whole
 * sentence is gone, which is why the reviewing authority intervened twice to
 * protect it (below). A single box says none of that.
 *
 * STYLE. "The split monolith": the symbolic-geology memorial, ROMA Design
 * Group 2000, built 2009-2011. Not a building in any order. No plinth, no
 * columns, no entablature, no cornice, no roof. A piece of staged geology with
 * a colossal figure in relief inside it, plus an inscribed RETAINING wall.
 * STYLES.md does not carry this idiom and this file may not edit STYLES.md, so
 * the entry is OWED; its tells, which this model is built on, are:
 *   - it is a BOULDER, not a building: no horizontal break anywhere, so the
 *     paving and the ground shadow do all the work a step stack does elsewhere;
 *   - the GAP must read as a gap, with daylight and the far plaza through it;
 *   - the figure is a RELIEF still inside its block: uncut stone beside, behind
 *     and above him, and the SILHOUETTE against the sky is the BLOCK'S;
 *   - the surface reads by STRIATION, not by masonry: the 159 assembly seams
 *     are hairlines and drawn at strength they turn a monolith into brickwork;
 *   - the wall is a RETAINING wall and exists only from inside: its top runs
 *     near the grade behind it, its back is a planted bank, and from outside
 *     the site there is no wall to look at at all;
 *   - two stone families, two tones, and that contrast IS the colour scheme:
 *     pale pink-beige Fujian monoliths against dark grey-green honed wall;
 *   - water sits at the GATEWAY, flanking the entry, not in the middle.
 *
 * ============================ RESEARCH ============================
 * Every number below was checked THIS RUN. Sources are named on the line.
 *
 * PUBLISHED, National Capital Planning Commission staff recommendation, File
 * No. 5907, July 2008. The PDF was fetched and its text extracted this run;
 * quotations are verbatim from that text.
 * https://www.ncpc.gov/docs/actions/2008July/Martin_Luther_King_Memorial_rec_Jul2008.pdf
 *   - "The Stone of Hope, which features the relief sculpture of Dr. King,
 *     maintains its approved elevation of 30 feet-9 inches in height"   9.37 m
 *   - "Recommended that the opening of the Mountain of Despair be returned to
 *     its original design concept of 12 feet, to reinforce the fundamental
 *     concept of the Stone of Hope appearing to have been pulled forward from
 *     the Mountain of Despair."
 *   - "The three main elements of the preliminary design include the Mountain
 *     of Despair, the crescent Inscription Wall forming the main plaza area of
 *     the memorial interior, and the Stone of Hope that features the likeness
 *     of Dr. King centered within the plaza."
 *   - "The site for the memorial is a four-acre, triangular-shaped parcel"
 *   - inscription wall lighting "modified ... to a continuous below ground
 *     light trench in the plaza at the base of the wall", "covered by a flush-
 *     mounted louver that is level with the interior memorial plaza pavement"
 *   - "its base composition and placement within the plaza pavement": there is
 *     no plinth and no step here, which is why item 3 of the checklist is
 *     answered by the PLAZA and not by a podium.
 *   - "additional cherry trees, particularly on the embankment of the memorial"
 *   - the Visitor Contact/Bookstore/Restroom Building is "approximately 60 feet
 *     south of the forecourt entrance", on the WEST side of West Basin Drive.
 *     It is a separate structure across a road and is NOT drawn here.
 *
 * PUBLISHED, Wikipedia, Martin Luther King Jr. Memorial, checked this run:
 * https://en.wikipedia.org/wiki/Martin_Luther_King_Jr._Memorial
 *   - 450 ft crescent Inscription Wall; fourteen quotations, 1955 to 1968,
 *     deliberately not chronological and deliberately nothing from "I Have a
 *     Dream"; the pale granite is from Fujian Province, chosen so the carving
 *     reads at night and to contrast with the Mountain of Despair
 *   - the inscription on the Stone reads "Out of the Mountain of Despair, a
 *     Stone of Hope"; the drum-major paraphrase on the other side "was removed
 *     in August 2013", so this model carries ONE inscription, not two.
 * PUBLISHED, National Park Service, checked this run:
 *   - "The Pink Shrimp Granite ... consists of various colors"; the stone shows
 *     "striation grooves" that "can be interpreted as scars, both physical and
 *     psychological"  (nps.gov/places/the-mountain-of-despair.htm)
 *   - "The Stone of Hope, moved forward out of the Mountain of Despair, points
 *     to the Jefferson Memorial." and "The sculpture of Dr. King becomes
 *     visible on the front of the Stone of Hope."
 *     (nps.gov/places/stone-of-hope.htm) That settles the FACING, which decides
 *     which way the relief is drawn: the front is the leading face of the
 *     pulled-forward block, so King looks southeast, out of the crescent's
 *     mouth and over the water, and a visitor entering meets the block's back.
 * PUBLISHED, Thornton Tomasetti (structural engineer), checked this run:
 *   - "Two large stones function as a gateway", "waterfalls flank the gateway
 *     entrance", "crescent-shaped plaza with curving, stone-clad retaining
 *     walls", "The entire memorial rests upon piles driven to bedrock."
 * PUBLISHED, Signs of the Times, "Carving a Dream", checked this run:
 *   - inscription wall granite "honed, Atlantic Green"; 5 ft stone panel
 *     module; lettering sandblasted 1/16 to 1/32 inch deep, sans-serif Roman
 *     capitals cut by Nicholas Benson.
 * PUBLISHED, architectmagazine.com "Civil Lights", RETRIEVAL CAVEAT: that page
 * returns HTTP 403 to a direct fetch, so these two figures were reached through
 * search-extraction of it and NOT read on the page. They are the ONLY source
 * found for either, and they carry the whole wall:
 *   - "To the east side of Dr. King's statue, the angled Inscription Wall runs
 *     235 feet; to the west side, it runs 190 feet."
 *   - "The height of the wall varies from just over 4-feet-tall at some points
 *     along the site to almost 12-feet-tall at other locations."
 * PUBLISHED, Trust for the National Mall, checked this run:
 *   - "The national memorial stands 30-feet high and consists of three granite
 *     pieces."  (nationalmall.org/monuments-memorials/mlk)
 *
 * THE STONE'S HEIGHT IS PUBLISHED FIVE WAYS and the disagreement is recorded
 * rather than smoothed: NCPC 30 ft 9 in; Gilford Corporation (builder) 30 ft
 * 8 in; Thornton Tomasetti 31 ft; Wikipedia and the NPS place page 30 ft; one
 * NPS ARTICLE page 28 ft, which contradicts the NPS place page and every
 * regulatory and construction source. The regulatory and construction figures
 * cluster at 30 ft 8 in to 30 ft 9 in, so 30.75 ft is what this model is built
 * to and the popular "30 feet" is its rounding. The 28 ft figure is not used.
 *
 * ==================== MEASURED THIS RUN, from OSM ====================
 * OpenStreetMap through the Overpass API, queried this run, converted into the
 * frame below (u east, v north, feet, origin at the dc-3d.js place point
 * 38.88611,-77.04417). https://overpass-api.de/api/interpreter
 *   - way 903224410 and way 903224417, both barrier=wall, are the two arms of
 *     the Inscription Wall. Their full traces are 326.5 ft and 284.6 ft; take
 *     off the forecourt return leg at each throat end and the arms proper are
 *     271.9 ft and 225.1 ft, against a published 235 and 190. BOTH ARMS ARE
 *     LONGER BY THE SAME AMOUNT, 36.9 and 35.1 ft, which reads as an
 *     uninscribed length of wall of the same design at the same end rather than
 *     as a tracing error. Neither figure is discarded: the measured trace gives
 *     the SHAPE and the extent, the published lengths give the INSCRIBED run,
 *     and this file marks the inscription over the published 235 and 190 ft
 *     measured from the throat outward, leaving the uninscribed remainder at
 *     the far tip where the wall has already fallen to about 4 ft and could not
 *     carry a quotation anyway. Which end is really uninscribed is not
 *     published; that reasoning is stated, not claimed as fact.
 *   - the THROAT, the gap between the two wall ends where the Mountain of
 *     Despair stands, measures 32.42 ft.
 *   - way 393546181, highway=footway surface=paving_stones, is the entry walk.
 *     Its last segment runs (-148,154) to (-56,67) and passes within a foot of
 *     the throat midpoint (-78.55, 87.45). That MEASURES the memorial's axis:
 *     bearing -43.39 degrees in this frame.
 *   - the two scrub polygons that share the wall traces, way 903224409 east and
 *     way 903224413 west, give the outer edge of the planted band behind each
 *     arm, so the BERM IS MEASURED, not guessed.
 *   - 23 natural=tree nodes fall inside those two planted bands. Their POSITIONS
 *     are used verbatim; only their size is assumed.
 *   - way 398822975, the NPS park polygon, closes at 2.74 acres against a
 *     published four. Reported, not reconciled: OSM most likely traces the inner
 *     memorial rather than the authorised parcel, but no source says so.
 *   - NOTHING in OSM is tagged for the Stone of Hope or the Mountain of Despair.
 *
 * ==================== DERIVED, with the method shown ====================
 * 1. THE STONE'S SET-FORWARD DISTANCE, which is arguably the memorial's key
 *    dimension and is published nowhere. The plaza footway network IS traced,
 *    and the paths run AROUND the Stone. The open paved court they enclose,
 *    (-56,67) (-24,95) (22,49) (10,1) (-12,-7) (-25,-7) (-37,-3) (-81,39), has
 *    a centroid at (-24.8, 39.2). Resolved on the measured axis that is 72.2 ft
 *    forward of the throat and 1.9 ft off the axis. A second, independent
 *    estimate, the centroid of the whole crescent enclosed by the two arms,
 *    lands at 77 ft. Two methods 5 ft apart, and NCPC's own words are "centered
 *    within the plaza", so the Stone is placed ON the axis at 72 ft.
 * 2. THE MOUNTAIN OF DESPAIR'S HEIGHT, the single most damaging gap in the
 *    record: no height for it appears in Wikipedia, four NPS pages, the NCPC
 *    recommendation, the structural engineer, the builder or the stone
 *    fabricators. It is bounded from both sides by published statements rather
 *    than eyeballed. LOWER BOUND: the Stone was cut out of it and set forward,
 *    a relationship NCPC ordered the design to preserve, so the slot is at
 *    least as tall as the 30.75 ft Stone. UPPER BOUND: the Trust for the
 *    National Mall says the memorial "stands 30-feet high and consists of three
 *    granite pieces", so no piece much exceeds that. The two bounds meet, and
 *    the Mountain is drawn at the Stone's own 30.75 ft.
 * 3. THE MOUNTAIN MASSES' WIDTH ACROSS THE PORTAL: the measured throat is
 *    32.42 ft and the published portal is 12 ft, so each mass is (32.42-12)/2 =
 *    10.2 ft across. Narrow, and that is what the two numbers give.
 * 4. THE STONE'S WIDTH: the block is the piece the portal slot is missing, and
 *    NCPC ordered the portal to 12 ft precisely so that reading holds, so the
 *    block is drawn 12 ft wide. Stated as a derivation and not as a fact: if
 *    the real block is wider than its slot, the pulled-forward reading is
 *    weaker on the ground than it is here.
 * 5. THE WALL'S HEIGHT PROFILE is not derived at all any more, it is MEASURED.
 *    The first version of this file inferred it from the width of the planted
 *    band at an assumed 1 in 3 grade, which is a chain of two assumptions
 *    carrying every wall height in the model. USGS 3DEP through the National
 *    Map's point elevation service replaced the chain: a transect at all 32
 *    stations, perpendicular, twelve offsets each, gives the ground on both
 *    sides of the wall directly. See the arm arrays below, and the check they
 *    pass: 4.9 ft to 11.4 ft measured against 4 to 12 ft published.
 * 6. THE FACING, checked rather than claimed. NPS says the Stone points to the
 *    Jefferson Memorial. From the place point the bearing to the Jefferson is
 *    -38.91 degrees; the measured entry axis is -43.39. Four and a half degrees
 *    apart on two independent sources, so the pointing is real and directional
 *    and is NOT drawn as a ruled axis. The Lincoln Memorial's reciprocal
 *    bearing is -34.26, so the "line of leadership" through the site runs near
 *    -36.6 and the memorial's own axis sits about 7 degrees off it.
 * 7. A MASS CHECK on the whole granite derivation, because derivations 2, 3, 4
 *    and the 18 ft depth assumption stand or fall together and there IS a
 *    published quantity to test them against. Gilford, verbatim: "approximately
 *    1,600 metric tons of granite from China, which encompassed 159 pre-carved
 *    blocks". At 2.70 t per cubic metre that is 20,900 cu ft of stone for the
 *    Mountain and the Stone together. This model's three solids come to 17,900
 *    cu ft, 86 percent of it, and the real masses are irregular rather than
 *    rectangular prisms, so being a seventh under is what a boxed model of
 *    quarried stone should be. The check has teeth in the other direction:
 *    masses 20 ft across instead of the derived 10.2 would weigh about 2,200 t,
 *    38 percent OVER the published tonnage. So the narrow masses this model
 *    draws are not merely the only reading the throat and the portal allow,
 *    they are the reading the published weight supports.
 *
 * ==================== NAMED GAPS, guessed nowhere ====================
 *   - MOUNTAIN OF DESPAIR PLAN DEPTH along the walk: not published. Drawn 18 ft,
 *     the SAME assumption that sets the Stone's depth, so the block and the slot
 *     it came from stay internally consistent. One assumption, used twice.
 *   - STONE OF HOPE PLAN DEPTH: not published. See above, 18 ft.
 *   - THE MASSES MAY STAND FORWARD OF THE WALL ENDS and be chunkier than this.
 *     Filling the measured throat exactly is the only reading that invents no
 *     number, and derivation 7's tonnage check supports narrow masses, but a
 *     model built on two numbers cannot show a boulder's real bulk and this one
 *     draws two slabs. If a site plan ever turns up, that is what to fix first.
 *   - RELIEF PROJECTION, how far King stands out of his block: not published.
 *     Drawn 0.9 to 1.0 ft, with the arms at 1.5 and the rolled papers at 1.9.
 *   - THE FIGURE'S HEIGHT INSIDE THE BLOCK: not published. NCPC's block is
 *     30 ft 9 in and Gilford's "30-foot-8-inch statue" is the same carved
 *     monolith measured an inch differently, not a man standing an inch below
 *     the top of his own stone, so how much shorter the figure is than the
 *     block is nowhere stated. Drawn 25.6 ft in a 30.75 ft block.
 *   - THE FIGURE'S OWN PROPORTIONS are a massing, not a portrait. Nothing about
 *     his features, his robe or his hands is published as a dimension and
 *     nothing here claims to be a likeness.
 *   - WALL THICKNESS: not published. Coping drawn 2.5 ft.
 *   - THE BANK BEYOND 76 FT is the model landing on the host's flat lawn. The
 *     transect says the real ground 76 ft behind the wall still stands 1 to 7 ft
 *     above the plaza, because this memorial is cut into a slope that keeps
 *     rising toward Independence Avenue, and the scene has one flat datum. The
 *     last band, 62 ft out to 88, is therefore the only invented part of the
 *     bank and it is named here rather than buried.
 *   - WATERFALL DIMENSIONS: their existence, their count and their position
 *     flanking the gateway are published; nothing else is. Drawn as two 16 by
 *     10 ft panels inside a 1.3 ft granite kerb, all of it assumed.
 *   - ENTRY WALK WIDTH: the walk is traced as a line in OSM with no width.
 *     Drawn 20 ft. The forecourt it runs into is NOT assumed: the two wall
 *     return legs measure it.
 *   - TREE HEIGHT: NCPC gives the planting stock at 4 to 6 inch caliper in
 *     2008 and the trees have grown since. Drawn 20 ft with an 8.5 ft canopy
 *     radius: an assumption. Their POSITIONS are measured.
 *   - THE FOURTEEN QUOTATIONS' POSITIONS along the wall are not published as a
 *     plan, so the inscription cannot be placed quotation by quotation. At map
 *     scale a 1/16 inch sandblasted letter cannot be text in any case, so the
 *     face carries a lighter WASH over the published inscribed run and a joint
 *     every fifth 5 ft panel, and claims nothing more.
 *   - PLAZA DIMENSIONS: never dimensioned. The court here is bounded by the two
 *     measured wall arms and the two measured footway loops, 0.74 acre, which
 *     sits inside the builder's site-wide 80,000 sq ft of pavers but is not a
 *     published plaza figure.
 *   - "159 tons" for the Stone and "120 tons each" for the Mountain appear in a
 *     tourism blog, the 159 is suspiciously identical to the well-sourced BLOCK
 *     count, and neither appears in any engineering or fabricator source. NOT
 *     USED, and named here so a later run does not adopt them as published.
 *   - NO NATIONAL REGISTER NOMINATION exists to consult: a memorial dedicated in
 *     2011 is far short of the fifty-year threshold, so the document type that
 *     gave the Smithsonian Castle its tower heights has no counterpart here.
 *
 * ==================== SCALE ====================
 * dc-3d.js carries mlk at h: 9 and MIN_H is 12, so p.h arrives at 12 m. The
 * published Stone is 9.37 m. Taking the foot from p.h would draw a 30 ft 9 in
 * block at 39 ft 4 in, 28 percent too tall, and scale the 450 ft of wall by the
 * same factor. So this form takes its foot from the true 0.3048 m and ignores
 * p.h, exactly as dc-form-vietnam.js does and for the same reason: MIN_H exists
 * to rescue memorials too small to see, and a memorial 430 ft across does not
 * need rescuing in plan, while its height is the one thing that must not move.
 * The place height h: 9 is also 4 percent under the published 9.37 and should
 * read 9.4 on the heights-TRUE rule. This file does not edit dc-3d.js; the
 * correction is reported instead. It changes nothing while MIN_H floors it.
 *
 * ==================== FRAME AND PAINT ====================
 * u east, v north, z up, all in feet, origin at the dc-3d.js place point. z = 0
 * is the plaza and the surrounding grade both; the bank is BUILT UP behind the
 * wall rather than the plaza being sunk, which is what "retaining wall" and
 * "the embankment of the memorial" describe.
 *
 * The painter's trap is designed in rather than discovered. The plaza is one
 * large flat polygon and carries an explicit depth far below everything on it.
 * The bank is drawn as PER-SEGMENT quads at their own real depths, never as one
 * polygon per arm: one polygon would sort at its farthest corner and the near
 * end of the near arm's bank would paint under the plaza it stands beside.
 * Abutting quads round apart under toFixed and leave a ladder of pale seams,
 * which is the Hirshhorn ring's starburst and the Vietnam bank's stripes, so
 * every segment overruns its neighbour. Everything that exists only on the
 * plaza side of a wall segment, the face, its joints, its inscription wash, its
 * light trench and its cast shadow, is gated on that segment's own inward
 * normal facing the camera, because from behind there is no wall to see, only a
 * planted bank and a stone line. That is the Hirshhorn balcony's lesson and the
 * NMAAHC porch's lesson, arriving again.
 */
(function () {
  var H = window.DC3D.helpers;
  window.DC_FORMS = window.DC_FORMS || {};
  window.DC_FORMS['mlk'] = function (ctx, p, s, VE) {
    var P = ctx.project, items = [];
    var FT = 0.3048 * VE;              /* true feet, see the SCALE note above */
    var m  = FT * s;
    function W(u, v) { return [p.x + u * m, p.y + v * m]; }
    function pt(u, v, z) { return P(p.x + u * m, p.y + v * m, z * FT); }
    function push(q, fill, bias) { items.push({ svg: ctx.poly(q, fill, null, 0), depth: H.depthOf(q) + (bias || 0) }); }

    /* ---------- published and derived geometry, in feet ---------- */
    var HST   = 30.75;   /* Stone of Hope, NCPC 30 ft 9 in */
    var HMTN  = 30.75;   /* Mountain of Despair, DERIVED 2 above */
    var PORTAL = 12;     /* NCPC, the opening returned to 12 ft */
    var THROAT = 32.42;  /* MEASURED between the two wall ends */
    var MW    = (THROAT - PORTAL) / 2;  /* = 10.21, each mass across the portal */
    var DEEP  = 18;      /* ASSUMED depth of both the masses and the Stone */
    var STW   = PORTAL;  /* DERIVED 4: the block is the piece the slot is missing */
    var FWD   = 72;      /* DERIVED 1: set forward from the throat */
    var THK   = 2.5;     /* ASSUMED wall thickness */

    var INSC_E = 235, INSC_W = 190;    /* published inscribed runs */
    var PANEL = 5;       /* published stone panel module */

    /* the memorial's axis, MEASURED off the entry walk's last segment */
    var AXU = 0.72658, AXV = -0.68710;      /* along, pointing southeast */
    var BXU = -AXV,    BXV = AXU;           /* across the portal */
    var TU = -78.55, TV = 87.45;            /* the throat midpoint */

    /* ---------- materials, two tones apiece ---------- */
    /* the pale Fujian monoliths: "Pink Shrimp Granite", "light beige, close to
       skin color". Warm and light, so they stand out of the dark wall. */
    var PINK  = "#d9c5b4", PINKT = "#ead9c8", PINKD = "#9b8574", PINKG = "#d0baa8";
    /* the wall: honed Atlantic Green, dark grey-green, the published contrast */
    var WALL  = "#3c4a44", WALLT = "#586760", WALLW = "#5c6d63", JOINT = "#2c3833";
    var PAVE  = "#c9c7b6", WALKC = "#d3d0be", TRENCH = "#232a2a";
    var BERM  = "#8ea472", BED = "#7c9463";
    var LEAF  = "#6f8a58", LEAFD = "#59734a", TRUNK = "#6b5b48";
    var WATER = "#9db8c2";

    /* ---------- the two arms of the Inscription Wall ----------
       PLAN MEASURED from OSM ways 903224410 and 903224417; station 0 is the
       outer end of the forecourt return leg and station 1 is the throat.
       SECTION MEASURED from USGS 3DEP through the National Map's point
       elevation service, queried this run: a transect was taken at every one of
       these 32 stations, perpendicular to the wall, at twelve offsets from 16 ft
       inside to 76 ft outside. That replaced the whole assumed-bank section the
       first version of this file carried, and the arrays below are what the
       ground actually does:
         h   = the crest of the berm behind the wall, above the plaza datum,
               which is the exposed height of the retaining wall;
         h24 = the ground 24 ft behind the wall, above the same datum;
         h62 = the ground 62 ft behind it.
       All three are in feet above a PLAZA DATUM of 7.4 ft NAVD, which is what
       the inner samples read at every station from the throat outward.
       THE CHECK THAT MATTERS: nothing here was fitted to the published figures,
       and the measured wall runs 4.9 ft at its lowest to 11.4 ft at its
       tallest, against a published "just over 4-feet-tall at some points along
       the site to almost 12-feet-tall at other locations". An independent
       national elevation dataset reproduces the published range on its own.
       One three-point smoothing pass was run along each array, because a 1 m
       DEM transect is noisy and a graded bank is not; ends held. */
    var ARMS = [
      { insc: INSC_E, side: 1,
        pt: [[-99.9,143.4],[-67.6,99.4],[-62.4,101.9],[-54.4,103.8],[-46.4,104.9],
             [-25.3,121.9],[-2.3,135.9],[16.1,145.4],[35.2,152.8],[58.5,160.8],
             [83.4,166.9],[107.5,170.3],[131.7,172.0],[153.7,171.3],[174.3,168.9],[187.1,166.8]],
        h:   [8.3,8.9,9.7,10.2,10.8,11.4,11.4,10.9,10.2,9.3,8.2,7.2,6.8,6.8,6.6,5.9],
        h24: [8.1,8.2,9.2,10.0,10.2,10.3,10.1,9.8,9.0,7.5,6.4,5.6,5.1,5.4,6.0,5.8],
        h62: [7.3,7.1,7.9,8.4,8.1,7.5,6.7,5.7,4.6,3.7,3.2,3.0,2.9,2.9,2.8,2.7] },
      { insc: INSC_W, side: -1,
        pt: [[-140.7,106.0],[-89.5,75.5],[-91.5,72.0],[-94.4,61.4],[-93.6,55.9],
             [-103.0,42.0],[-113.4,21.9],[-119.0,11.3],[-124.2,1.2],[-132.2,-18.9],
             [-139.2,-39.0],[-144.6,-64.1],[-147.1,-82.3],[-149.1,-102.8],[-149.3,-124.1],[-147.9,-136.9]],
        h:   [8.2,8.2,9.6,10.8,11.1,11.1,10.9,10.6,10.2,9.5,7.8,6.0,5.6,5.9,5.7,4.9],
        h24: [7.9,7.5,9.0,10.4,10.6,10.6,10.4,9.9,9.2,7.9,6.3,5.2,4.6,4.3,4.4,4.8],
        h62: [5.9,6.3,7.2,8.2,8.1,7.2,6.1,5.2,4.2,2.9,2.1,1.8,1.7,1.6,1.6,1.6] }
    ];

    /* THE OUTWARD NORMAL, and the first version of this file got it wrong.
       It picked the perpendicular pointing away from the throat, which reads
       plausibly and FAILS: at east station 4 the throat lies almost broadside
       to the wall, the test came out at +6 against a magnitude of 50, and the
       normal flipped, so one segment's bank was drawn spilling into the plaza.
       The elevation transect found it, because that station's inner samples came
       back standing 10 ft above its outer ones. The rule is now structural
       rather than geometric: both ways are traced from the forecourt inward, so
       the plaza lies to the RIGHT of travel along the east arm and to the LEFT
       along the west, every segment, return legs included, checked one by one. */
    function seg(arm, i) {
      var a = arm.pt[i], b = arm.pt[i + 1];
      var du = b[0] - a[0], dv = b[1] - a[1], L = Math.sqrt(du * du + dv * dv) || 1;
      du /= L; dv /= L;
      var nu = arm.side > 0 ? -dv : dv, nv = arm.side > 0 ? du : -du;
      return { a: a, b: b, du: du, dv: dv, nu: nu, nv: nv, L: L,
               h0: arm.h[i], h1: arm.h[i + 1] };
    }

    /* arc length from the throat, for the inscribed run and the panel joints;
       and the MITRED station normal, which is what carries the bank round a
       corner. Offsetting each segment on its own normal leaves a wedge of bare
       lawn on the outside of every convex bend, and at the throat, where the
       wall turns nearly eighty degrees, that wedge cut the return leg's bank
       loose from the arm's and the two read as green boards leaning on nothing.
       A mitre closes it with no extra geometry: the station's offset direction
       is the normalised sum of its two segment normals, lengthened by one over
       the cosine of the half turn so the offset DISTANCE stays true. */
    ARMS.forEach(function (arm) {
      var n = arm.pt.length;
      arm.s = [0];
      for (var i = 1; i < n; i++) {
        var dx = arm.pt[i][0] - arm.pt[i - 1][0], dy = arm.pt[i][1] - arm.pt[i - 1][1];
        arm.s.push(arm.s[i - 1] + Math.sqrt(dx * dx + dy * dy));
      }
      var s1 = arm.s[1];
      arm.sT = arm.s.map(function (v) { return v - s1; });
      arm.N = [];
      for (var k = 0; k < n; k++) {
        var g0 = seg(arm, Math.max(0, k - 1)), g1 = seg(arm, Math.min(k, n - 2));
        var mu = g0.nu + g1.nu, mv = g0.nv + g1.nv;
        var L2 = Math.sqrt(mu * mu + mv * mv);
        if (L2 < 1e-6) { mu = g1.nu; mv = g1.nv; L2 = 1; }
        mu /= L2; mv /= L2;
        var sc = Math.min(2.4, 1 / Math.max(0.42, mu * g1.nu + mv * g1.nv));
        arm.N.push([mu * sc, mv * sc]);
      }
      /* the measured section, as offset and height pairs, for the bank and for
         standing a tree on it. 88 ft is where the model lands on the host's
         flat lawn; the DEM says the real ground at 76 ft is still 1 to 7 ft
         above the plaza, so that last band is the model meeting the scene, not
         the site meeting itself, and it is the only invented part of the bank. */
      arm.prof = function (i, o) {
        var P = [[0, arm.h[i]], [24, arm.h24[i]], [62, arm.h62[i]], [88, 0]];
        if (o <= 0) return P[0][1];
        for (var j = 1; j < P.length; j++) {
          if (o <= P[j][0]) {
            var f = (o - P[j - 1][0]) / (P[j][0] - P[j - 1][0]);
            return P[j - 1][1] + (P[j][1] - P[j - 1][1]) * f;
          }
        }
        return 0;
      };
    });

    /* ---------- the plaza ----------
       NCPC: "the crescent Inscription Wall forming the main plaza area of the
       memorial interior". The paved court is not the whole crescent, and the
       first version of this file drew it as one, which put a quarter-acre of
       pale paving over ground that is lawn. The southeast edge is MEASURED
       instead, off the two paving_stones footways OSM traces inside the
       crescent: way 393546177 runs the outer loop just inside the wall, and way
       393546178 runs the inner loop. The paved court is everything between the
       WALL and that INNER loop, and the second version of this file bounded it
       on the OUTER loop instead, which cut the court off at a path running
       through its middle and left the Stone of Hope standing on grass. The test
       that caught it was one line: is the Stone inside the polygon. It was not.
       The court below closes simple, at 0.74 acre, and contains the Stone, the
       throat, both wall bands and both planted beds while excluding the inner
       island, the ground behind the wall and the lawn falling to the Basin.
       It is the single largest flat surface here and carries an explicit depth
       well under everything that stands on it. */
    var PATH = [[177,151],[150,153],[122,154],
                [110,111],[95,84],[75,69],[55,60],[49,58],[22,49],[25,33],[18,10],[10,1],
                [-12,-7],[-25,-7],[-37,-3],[-44,-23],[-49,-34],[-51,-39],[-59,-53],
                [-78,-72],[-98,-83],[-133,-96],[-131,-119]];
    function inner(arm, i) {
      var sg = seg(arm, Math.min(i, arm.pt.length - 2));
      var q = arm.pt[i];
      return [q[0] - sg.nu * THK / 2, q[1] - sg.nv * THK / 2];
    }
    (function () {
      var ring = [];
      for (var i = 1; i < ARMS[0].pt.length; i++) ring.push(inner(ARMS[0], i));
      PATH.forEach(function (q) { ring.push(q); });
      for (var j = ARMS[1].pt.length - 1; j >= 1; j--) ring.push(inner(ARMS[1], j));
      var poly = ring.map(function (q) { return pt(q[0], q[1], 0); });
      items.push({ svg: ctx.poly(poly, ctx.shade(PAVE, 0, 0, 1), null, 0), depth: -1e9 + 1.4 });
    })();

    /* THE FORECOURT, which is not a strip of walk on the grass. NCPC calls it
       the memorial forecourt and the two wall return legs MEASURE it: they
       funnel from a 55 ft mouth down to the 32 ft throat, and the paving is
       what lies between them. Drawn as a strip it read as a sheet of paper
       laid on the lawn, which is the fault this project has met before. The
       approach beyond the mouth is a walk 20 ft wide, its width assumed, on
       the MEASURED axis. Its tone is a shade cooler than the stone so the
       portal reads as a slot with other ground beyond it rather than as a
       pale panel filling the gap. */
    (function () {
      function inn(arm, i) {
        var sg = seg(arm, 0), q = arm.pt[i];
        return [q[0] - sg.nu * THK / 2, q[1] - sg.nv * THK / 2];
      }
      var court = [inn(ARMS[0], 0), inn(ARMS[0], 1), inn(ARMS[1], 1), inn(ARMS[1], 0)];
      items.push({ svg: ctx.poly(court.map(function (c) { return pt(c[0], c[1], 0.02); }),
                                 ctx.shade(WALKC, 0, 0, 1), null, 0), depth: -1e9 + 1.45 });
      var hw = 10;                                   /* ASSUMED 20 ft wide */
      var mu = (court[0][0] + court[3][0]) / 2, mv = (court[0][1] + court[3][1]) / 2;
      var au = mu - AXU * 34, av = mv - AXV * 34;
      var q2 = [pt(au - BXU * hw, av - BXV * hw, 0.02), pt(au + BXU * hw, av + BXV * hw, 0.02),
                pt(mu + BXU * hw, mv + BXV * hw, 0.02), pt(mu - BXU * hw, mv - BXV * hw, 0.02)];
      items.push({ svg: ctx.poly(q2, ctx.shade(WALKC, 0, 0, 1), null, 0), depth: -1e9 + 1.44 });
    })();

    /* the planting beds inside the plaza, MEASURED: OSM ways 903224414,
       903224415, 903224416 east of the walk and 903224421, 903224422, 903224423
       west of it. They break up 0.8 acre of paving, which is what they do. */
    [[[25,70],[29,86],[34,100],[48,113],[51,119],[52,125],[63,131],[73,138],[82,144],[90,146],
      [98,144],[103,139],[96,123],[89,114],[80,105],[73,99],[65,92],[59,84],[58,78],[59,70],
      [52,68],[43,65],[36,65],[29,67]],
     [[103,139],[107,132],[109,122],[104,110],[97,100],[89,89],[81,83],[74,77],[59,70],[58,78],
      [59,84],[65,92],[73,99],[80,105],[89,114],[96,123]],
     [[52,125],[43,121],[34,118],[27,116],[19,112],[13,104],[11,95],[11,85],[17,78],[25,70],
      [29,86],[34,100],[48,113],[51,119]],
     [[-105,-72],[-104,-51],[-101,-31],[-97,-17],[-89,-6],[-81,-1],[-74,0],[-63,-2],[-58,-10],
      [-57,-15],[-67,-20],[-74,-23],[-78,-32],[-77,-44],[-78,-52],[-78,-62],[-86,-68],[-94,-71]],
     [[-57,-15],[-67,-20],[-74,-23],[-78,-32],[-77,-44],[-78,-52],[-78,-62],[-69,-53],[-63,-43],
      [-59,-33],[-57,-24]],
     [[-101,-31],[-106,-37],[-116,-45],[-119,-50],[-121,-58],[-119,-64],[-115,-68],[-110,-72],
      [-105,-72],[-104,-51]]
    ].forEach(function (bed) {
      var q = bed.map(function (c) { return pt(c[0], c[1], 0.45); });
      items.push({ svg: ctx.poly(q, ctx.shade(BED, 0, 0, 1), null, 0), depth: -1e9 + 1.6 });
    });

    /* ---------- the wall, arm by arm, segment by segment ---------- */
    ARMS.forEach(function (arm) {
      for (var i = 0; i < arm.pt.length - 1; i++) {
        var g = seg(arm, i);
        var faces = ctx.faceVisible(-g.nu, -g.nv);
        /* overrun the far end by two thirds of a foot: abutting quads round
           apart under toFixed and leave a ladder of pale seams down the bank */
        var OV = 1.5, k = OV / g.L;
        var bx = g.b[0] + g.du * OV, by = g.b[1] + g.dv * OV;
        var h0 = g.h0, h1 = g.h1 + (g.h1 - g.h0) * k;

        function A(off, z) { return pt(g.a[0] + g.nu * off, g.a[1] + g.nv * off, z); }
        function B(off, z) { return pt(bx + g.nu * off, by + g.nv * off, z); }

        /* the plaza face */
        if (faces) {
          var fq = [A(-THK / 2, 0), B(-THK / 2, 0), B(-THK / 2, h1), A(-THK / 2, h0)];
          push(fq, ctx.shade(WALL, -g.nu, -g.nv, 0));
          /* the inscription. Fourteen quotations in sandblasted sans-serif
             capitals 1/16 inch deep cannot be text at this scale, so the
             inscribed run carries a lighter wash and nothing more. */
          if (arm.sT[i] >= 0 && arm.sT[i] < arm.insc) {
            var wq = [A(-THK / 2 - 0.05, h0 * 0.26), B(-THK / 2 - 0.05, h1 * 0.26),
                      B(-THK / 2 - 0.05, h1 * 0.80), A(-THK / 2 - 0.05, h0 * 0.80)];
            push(wq, ctx.shade(WALLW, -g.nu, -g.nv, 0.30), 0.5);
          }
          /* a joint every fifth 5 ft panel. One per panel at map scale is the
             NMAAHC brick wall arriving on a different stone. */
          var step = PANEL * 5;
          var j0 = Math.ceil(arm.s[i] / step) * step;
          for (var jt = j0; jt < arm.s[i + 1]; jt += step) {
            var t = (jt - arm.s[i]) / g.L, tw = t + 0.5 / g.L;
            var hj = h0 + (h1 - h0) * t;
            var ja = pt(g.a[0] + g.du * g.L * t - g.nu * THK / 2 - g.nu * 0.06,
                        g.a[1] + g.dv * g.L * t - g.nv * THK / 2 - g.nv * 0.06, 0);
            var jb = pt(g.a[0] + g.du * g.L * tw - g.nu * THK / 2 - g.nu * 0.06,
                        g.a[1] + g.dv * g.L * tw - g.nv * THK / 2 - g.nv * 0.06, 0);
            var jc = pt(g.a[0] + g.du * g.L * tw - g.nu * THK / 2 - g.nu * 0.06,
                        g.a[1] + g.dv * g.L * tw - g.nv * THK / 2 - g.nv * 0.06, hj);
            var jd = pt(g.a[0] + g.du * g.L * t - g.nu * THK / 2 - g.nu * 0.06,
                        g.a[1] + g.dv * g.L * t - g.nv * THK / 2 - g.nv * 0.06, hj);
            push([ja, jb, jc, jd], ctx.shade(JOINT, -g.nu, -g.nv, 0), 0.9);
          }
          /* the published light trench: a continuous covered slot in the plaza
             at the base of the wall, its louvre flush with the paving. It is
             also what gives the wall a clean line on the ground. */
          var tq = [A(-THK / 2, 0.05), B(-THK / 2, 0.05), B(-THK / 2 - 1.1, 0.05), A(-THK / 2 - 1.1, 0.05)];
          push(tq, TRENCH, 0.35);
          /* and the wall's own shade falling into the plaza beside it */
          var sq = [A(-THK / 2 - 1.1, 0.04), B(-THK / 2 - 1.1, 0.04),
                    B(-THK / 2 - 1.1 - h1 * 0.42, 0.04), A(-THK / 2 - 1.1 - h0 * 0.42, 0.04)];
          items.push({ svg: ctx.poly(sq, "#000", null, 0, ' opacity="0.15"'), depth: -1e9 + 2.1 });
        }

        /* the coping. The top of a retaining wall runs near the grade behind
           it, so from outside this line is the ONLY thing there is to see. */
        var cq = [A(-THK / 2, h0), B(-THK / 2, h1), B(THK / 2, h1), A(THK / 2, h0)];
        push(cq, ctx.shade(WALLT, 0, 0, 1), 1.2);

        /* THE BANK THE WALL RETAINS, drawn on the measured section, offset on
           the MITRED station normals so it turns the corners without a gap.
           Three bands, because three is what the transect resolves: the terrace
           immediately behind the wall, the fall to 62 ft, and the model's own
           landing on the host's flat lawn. Bands overrun each other slightly:
           abutting quads round apart under toFixed and leave a ladder of pale
           seams, which is the Hirshhorn ring's starburst and the Vietnam bank's
           stripes, met here a third time. */
        var Na = arm.N[i], Nb = arm.N[i + 1];
        [[THK / 2 - 0.4, 24], [24, 62], [62, 88]].forEach(function (bd) {
          /* EVERY edge is measured the same way, from the wall's centreline
             along the MITRED normal, and each band overruns the next by nearly
             a foot. The first version put a half-wall thickness on the inner
             edge and not the outer, which left a 0.45 ft gap at every band
             boundary, and the render came back with two pale hairlines running
             the whole length of both banks like contour lines on a map. That is
             the Hirshhorn ring's starburst and the Vietnam bank's stripes for a
             third time, and the lesson is the same each time: offsets that must
             meet have to be computed by ONE rule, not two. */
          var o0 = bd[0], o1 = bd[1] + 0.9;
          var za0 = arm.prof(i, o0), za1 = arm.prof(i, o1);
          var zb0 = arm.prof(i + 1, o0), zb1 = arm.prof(i + 1, o1);
          var q = [pt(g.a[0] + Na[0] * o0, g.a[1] + Na[1] * o0, za0),
                   pt(bx + Nb[0] * o0, by + Nb[1] * o0, zb0),
                   pt(bx + Nb[0] * o1, by + Nb[1] * o1, zb1),
                   pt(g.a[0] + Na[0] * o1, g.a[1] + Na[1] * o1, za1)];
          /* ONE fall for the whole bank, so the tone turns with the wall's
             curve and not with the DEM's noise. Shading each band on its own
             measured fall put tonal patches all over the bank, which reads as
             mottling rather than as ground. */
          push(q, ctx.shade(BERM, g.nu * 0.28, g.nv * 0.28, 0.94), -0.6);
        });
      }
    });

    /* ---------- a rotated box on the memorial's own axis ----------
       Used for the two masses of the Mountain of Despair, for the Stone of Hope,
       and for the pieces of the relief. Per-face culled, with a top, so nothing
       paints round the back of anything. */
    function rbox(ou, ov, cA, cB, sA, sB, z0, z1, fill, bias, grain, noTop) {
      var cu = ou + cA * AXU + cB * BXU, cv = ov + cA * AXV + cB * BXV;
      var hA = sA / 2, hB = sB / 2;
      var c = [[cu - hA * AXU - hB * BXU, cv - hA * AXV - hB * BXV],
               [cu + hA * AXU - hB * BXU, cv + hA * AXV - hB * BXV],
               [cu + hA * AXU + hB * BXU, cv + hA * AXV + hB * BXV],
               [cu - hA * AXU + hB * BXU, cv - hA * AXV + hB * BXV]];
      var nm = [[-BXU, -BXV], [AXU, AXV], [BXU, BXV], [-AXU, -AXV]];
      for (var i = 0; i < 4; i++) {
        if (!ctx.faceVisible(nm[i][0], nm[i][1])) continue;
        var j = (i + 1) % 4;
        /* THE STRIATION, and the honest way to draw it. NPS publishes the
           vertical chisel grooves and invites a visitor to read them as scars,
           but a groove a few inches wide on a face two pixels to the foot
           cannot be a groove: the first version drew them a fifth of a pixel
           wide, which is nothing, and drawing them wide enough to see would be
           a claim about their width that no source supports. What a striated
           face actually does at distance is stop being uniform, so the face is
           cut into vertical panels a hair apart in tone. A grain, not grooves,
           and it claims only what it is. */
        var n = grain ? grain : 1;
        for (var k = 0; k < n; k++) {
          var t0 = k / n, t1 = (k + 1) / n + (k === n - 1 ? 0 : 0.02 / n);
          var pA = [c[i][0] + (c[j][0] - c[i][0]) * t0, c[i][1] + (c[j][1] - c[i][1]) * t0];
          var pB = [c[i][0] + (c[j][0] - c[i][0]) * t1, c[i][1] + (c[j][1] - c[i][1]) * t1];
          var q = [pt(pA[0], pA[1], z0), pt(pB[0], pB[1], z0),
                   pt(pB[0], pB[1], z1), pt(pA[0], pA[1], z1)];
          push(q, ctx.shade(k % 2 ? fill : (grain ? PINKG : fill), nm[i][0], nm[i][1], 0), bias || 0);
        }
      }
      /* a relief piece gets NO top. A bright ledge across the top of every
         block is what turned the first figure into a stack of bars. */
      if (noTop) return;
      var tq = c.map(function (q2) { return pt(q2[0], q2[1], z1); });
      push(tq, ctx.shade(fill, 0, 0, 1), (bias || 0) + 0.5);
    }

    /* ---------- the Mountain of Despair: two masses, a 12 ft slot between ----
       The slot is the front door, and it has to read as a slot with the plaza
       showing through it. Nothing is drawn across it and nothing bridges it:
       NCPC ordered a walkway bridge removed for breaking exactly that link. */
    [1, -1].forEach(function (side) {
      rbox(TU, TV, 0, side * (PORTAL / 2 + MW / 2), DEEP, MW, 0, HMTN, PINK, 0, 4);
    });
    /* THE PASSAGE, on the ground between them. In an axonometric view a box's
       DEPTH smears sideways on screen exactly as its width does, so two masses
       18 ft deep close their own 12 ft slot at every yaw except the ones near
       the axis, and the one feature that must read stops reading. This is the
       floor of the passage, in the deep shade of two thirty-foot stones, and it
       holds the slot open on the ground from any angle. It is not a licence to
       widen the portal: the opening stays at the published 12 ft. */
    (function () {
      var hA = DEEP / 2 + 2, hB = PORTAL / 2;
      var c = [[TU - hA * AXU - hB * BXU, TV - hA * AXV - hB * BXV],
               [TU + hA * AXU - hB * BXU, TV + hA * AXV - hB * BXV],
               [TU + hA * AXU + hB * BXU, TV + hA * AXV + hB * BXV],
               [TU - hA * AXU + hB * BXU, TV - hA * AXV + hB * BXV]];
      var q = c.map(function (z) { return pt(z[0], z[1], 0.06); });
      items.push({ svg: ctx.poly(q, "#5c5147", null, 0), depth: -1e9 + 1.9 });
    })();
    items.push(H.shadow(ctx, [W(TU + AXU * 9 + BXU * 6, TV + AXV * 9 + BXV * 6),
                              W(TU + AXU * 9 + BXU * 17, TV + AXV * 9 + BXV * 17),
                              W(TU - AXU * 9 + BXU * 17, TV - AXV * 9 + BXV * 17),
                              W(TU - AXU * 9 + BXU * 6, TV - AXV * 9 + BXV * 6)], HMTN * FT));
    items.push(H.shadow(ctx, [W(TU + AXU * 9 - BXU * 6, TV + AXV * 9 - BXV * 6),
                              W(TU + AXU * 9 - BXU * 17, TV + AXV * 9 - BXV * 17),
                              W(TU - AXU * 9 - BXU * 17, TV - AXV * 9 - BXV * 17),
                              W(TU - AXU * 9 - BXU * 6, TV - AXV * 9 - BXV * 6)], HMTN * FT));

    /* ---------- the Stone of Hope ----------
       The block that came out of that slot, set forward on the same axis. */
    (function () {
      var su = TU + AXU * FWD, sv = TV + AXV * FWD;
      items.push(H.shadow(ctx, [W(su + AXU * 9 + BXU * 6, sv + AXV * 9 + BXV * 6),
                                W(su + AXU * 9 - BXU * 6, sv + AXV * 9 - BXV * 6),
                                W(su - AXU * 9 - BXU * 6, sv - AXV * 9 - BXV * 6),
                                W(su - AXU * 9 + BXU * 6, sv - AXV * 9 + BXV * 6)], HST * FT));
      rbox(su, sv, 0, 0, DEEP, STW, 0, HST, PINK, 0, 5);

      /* THE RELIEF. It is a RELIEF, still inside its block: it never breaks the
         block's outline, uncut stone stands two feet each side of him and two
         and three quarter feet above his head, and the silhouette against the
         sky stays the BLOCK'S. Drawn only when the block's front is toward the
         camera, because from behind there is nothing of him to see, which is
         exactly what a visitor coming through the portal meets.
         THE FIGURE'S HEIGHT IS A GAP, and the two published numbers look like
         a contradiction until they are read carefully: NCPC's block is 30 ft
         9 in and Gilford's "30-foot-8-inch statue" is the same carved monolith
         measured an inch differently, NOT a figure standing an inch below the
         top of its own stone. How much shorter the man is than his block is
         published nowhere, so he is drawn 25.6 ft in a 30.75 ft block, and that
         proportion is an assumption. Everything below is a MASSING. Nothing
         here is a likeness and nothing claims to be. */
      if (ctx.faceVisible(AXU, AXV)) {
        var f = DEEP / 2;
        /* what makes shallow relief read at any distance is not the projection,
           which is inches, but the SHADE the projection throws. Each piece gets
           a dark band on the block's own face below it before the piece itself
           is drawn, and the piece carries no bright top ledge. */
        function relief(pA, cB, sB, zb, zt, proj) {
          rbox(su, sv, f + 0.02, cB, 0.04, sB + 1.0, zb - 0.6, zt, PINKD, 36, 0, true);
          rbox(su, sv, f + proj / 2, cB, proj, sB, zb, zt, PINKT, pA, 0, true);
        }
        /* stacked narrow to wide to a neck and a head, because a figure drawn
           as three equal blocks reads as a robot and the picture said so. The
           tone is the block's OWN stone caught by the light, not a paler
           material: the first pass used a near-white and it read as a plaque
           screwed to the face. */
        relief(40, 0,    5.6,  2.4, 13.0, 0.9);   /* the robe, below the waist */
        relief(41, 0,    6.4, 13.0, 17.0, 0.9);   /* the hips */
        relief(42, 0,    7.0, 17.0, 22.5, 1.0);   /* the chest */
        relief(43, 0,    7.4, 22.5, 24.4, 1.0);   /* the shoulders */
        relief(46, 0.3,  8.0, 17.8, 20.8, 1.5);   /* the folded arms */
        relief(48, -3.5, 1.6, 16.6, 21.0, 1.9);   /* the rolled papers he holds */
        relief(45, 0,    2.2, 24.4, 25.4, 0.9);   /* the neck */
        relief(44, 0,    3.0, 25.4, 28.2, 1.0);   /* the head */
      }
      /* the ONE inscription, on the side of the block: "Out of the Mountain of
         Despair, a Stone of Hope". The drum-major paraphrase that stood on the
         other side was cut away in August 2013, so a model that shows two
         inscriptions is showing a memorial that no longer exists. A quarter-inch
         letter is not text at this scale; this is a wash and says so. It is
         drawn DARKER than the stone rather than lighter, because sandblasted
         capitals cut into a face read as shadow at any distance, and the first
         version made a white bar across the block that read as a label. */
      [1, -1].forEach(function (side) {
        if (!ctx.faceVisible(BXU * side, BXV * side)) return;
        var o = STW / 2 + 0.06, hA = DEEP / 2;
        var cu = su + BXU * side * o, cv = sv + BXV * side * o;
        var q = [pt(cu - AXU * hA * 0.72, cv - AXV * hA * 0.72, 12.4),
                 pt(cu + AXU * hA * 0.72, cv + AXV * hA * 0.72, 12.4),
                 pt(cu + AXU * hA * 0.72, cv + AXV * hA * 0.72, 15.2),
                 pt(cu - AXU * hA * 0.72, cv - AXV * hA * 0.72, 15.2)];
        push(q, ctx.shade("#c9b3a1", BXU * side, BXV * side, 0), 1.4);
      });
    })();

    /* ---------- the waterfalls, flanking the gateway ----------
       Published: two of them, at the entry rather than in the middle, each over
       its own below-grade pump room. Nothing else about them is published, so
       the panel is 16 by 10 ft with a 2.5 ft cascade face and all three numbers
       are assumptions. */
    [1, -1].forEach(function (side) {
      var cA = -24, cB = side * 15.5;
      var ou = TU + AXU * cA + BXU * cB, ov = TV + AXV * cA + BXV * cB;
      var hA = 8, hB = 5;
      var c = [[ou - hA * AXU - hB * BXU, ov - hA * AXV - hB * BXV],
               [ou + hA * AXU - hB * BXU, ov + hA * AXV - hB * BXV],
               [ou + hA * AXU + hB * BXU, ov + hA * AXV + hB * BXV],
               [ou - hA * AXU + hB * BXU, ov - hA * AXV + hB * BXV]];
      var q = c.map(function (z) { return pt(z[0], z[1], 0.3); });
      items.push({ svg: ctx.poly(q, ctx.shade(WATER, 0, 0, 1), null, 0), depth: -1e9 + 1.7 });
      /* a granite kerb round three sides, low, which is what makes a water panel
         read as a basin rather than a puddle. It was a 2.5 ft slab on one side
         and it read as a loose pink box standing in the forecourt. */
      rbox(ou, ov, 0, side * (hB + 0.7), hA * 2 + 2.8, 1.4, 0, 1.3, PINK, 0, 0);
      rbox(ou, ov, hA + 0.7, 0, 1.4, hB * 2, 0, 1.3, PINK, 0, 0);
      rbox(ou, ov, -hA - 0.7, 0, 1.4, hB * 2, 0, 1.3, PINK, 0, 0);
    });

    /* ---------- the trees on the embankment ----------
       NCPC: "additional cherry trees, particularly on the embankment of the
       memorial". POSITIONS are the 23 OSM natural=tree nodes that fall inside
       the two measured planted bands; the size is an assumption. They matter
       because from outside the site there is no memorial to see at all, only a
       planted bank, and without them that bank is a bare green slope. */
    var TREES = [[-78,139],[-54,122],[-38,124],[-49,157],[-22,138],[-6,163],[19,169],
                 [91,176],[66,174],[186,197],[155,182],[174,181],[214,193],
                 [-157,-99],[-160,-116],[-152,-59],[-151,-13],[-132,9],[-141,30],
                 [-127,30],[-113,43],[-122,78],[-107,64]];
    TREES.forEach(function (t) {
      /* the bank's own surface height under the tree, read off the SAME
         measured section the bank is drawn with, so a trunk never floats over
         the slope or buries its base in it */
      var z = 0;
      ARMS.forEach(function (arm) {
        for (var i = 0; i < arm.pt.length - 1; i++) {
          var g = seg(arm, i);
          var pu = t[0] - g.a[0], pv = t[1] - g.a[1];
          var al = pu * g.du + pv * g.dv;
          if (al < 0 || al > g.L) continue;
          var off = pu * g.nu + pv * g.nv;
          if (off < 0) continue;
          var f = al / g.L;
          var zz = arm.prof(i, off) * (1 - f) + arm.prof(i + 1, off) * f;
          if (zz > z) z = zz;
        }
      });
      var cx = p.x + t[0] * m, cy = p.y + t[1] * m;
      items = items.concat(H.prism(ctx, cx, cy, 1.7 * m, 1.7 * m, 1.4 * m, 1.4 * m,
                                   z * FT, 9 * FT, TRUNK, null));
      items = items.concat(H.ngon(ctx, cx, cy, 8.5 * m, (z + 7) * FT, 6 * FT, 8, LEAFD, null));
      items = items.concat(H.ngon(ctx, cx, cy, 6.2 * m, (z + 12.5) * FT, 5.5 * FT, 8, LEAF, null));
    });

    return items;
  };
})();
