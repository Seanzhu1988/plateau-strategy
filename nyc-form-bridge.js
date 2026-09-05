/* nyc-form-bridge.js: the Brooklyn Bridge, rebuilt to MODEL_STANDARD.md.
 * Style: gothic-revival (STYLES.md, the entry written for these towers).
 *
 * Registers window.NYC_FORMS.bridge and takes over from bridgeScene in
 * nyc-3d.js at draw time. Same contract: opts.view is 'span' or 'tower', the
 * result is { w: 980, h: 340, faces, lines, marks } in the renderer's own
 * units, S = 0.115 units per foot, origin at the Manhattan tower's centre, x
 * toward Brooklyn, y across the deck, z up from mean high water. The page's
 * two cameras are fixed and are not touched.
 *
 * EVERY DIMENSION IS A RESEARCH FACT, IN FEET, or a derivation written here.
 *   main span                 1,595.5 ft   (NPS NHL text)
 *   land spans                930 ft each  (NPS)
 *   tower top above water     276.5 ft     (NPS; Wikipedia says 278.25, Structure
 *                                          magazine 271; the page's own label
 *                                          already says 276.5, so that figure
 *                                          is kept and the disagreement noted)
 *   tower top above roadway   159 ft       (Structure) = 276.5 - 119 + 1.5, consistent
 *   roadway at the towers     119 ft       above high water (NPS)
 *   roadway at midspan        135 ft       (NPS), so the deck cambers 16 ft
 *   navigational clearance    127 ft       (Wikipedia): the floor structure under
 *                                          the roadway is 135 - 127 = 8 ft deep
 *   stiffening truss depth    33 ft        (Wikipedia, the original six) so the
 *                                          truss stands 33 - 8 = 25 ft above
 *                                          the roadway; four are drawn, the
 *                                          two outer and the two beside the
 *                                          promenade (see ASSUMED)
 *   floor beam spacing        7.5 ft       (1906 figures via nycsubway.org)
 *   deck width                85 ft        (NPS)
 *   promenade                 10 to 17 ft wide, 18 ft above the roadways
 *                                          (Wikipedia); drawn 16 ft wide
 *   tower plan, high water    140 x 59 ft  (NPS)
 *   tower plan, roadway       131 x 48 ft  (1906 via nycsubway.org)
 *   tower plan, cornice base  126 x 43 ft  (1906)
 *   tower plan, top           136 x 53 ft  (NPS; Structure gives 106 x 53 and no
 *                                          source explains the 106)
 *   pedestal height           47 ft Manhattan, 20 ft Brooklyn (Structure)
 *   arch opening              33.75 ft wide, 117 ft above the roadway (NPS,
 *                                          Wikipedia), two per tower
 *   arch radius               46 ft from the springing plane (Structure; 1906
 *                                          gives 48.17)
 *   DERIVED springing:        a two-centred arch of half-width a = 16.875 and
 *                             radius R = 46 has its centres d = R - a = 29.125
 *                             outside the centreline, so its rise is
 *                             sqrt(R^2 - d^2) = 35.61 ft and the springing is
 *                             117 - 35.61 = 81.39 ft above the roadway. rise
 *                             over width is 1.055, past 0.866, a LANCET, which
 *                             is what the photographs show. (The old scene's
 *                             0.62 ratio was a guess; this is the published
 *                             radius.) With the 1906 radius the rise is 36.6,
 *                             a foot different.
 *   DERIVED pier widths:      three piers share 131 - 2 x 33.75 = 63.5 ft, so
 *                             21.17 ft each at the roadway (equal split is an
 *                             ASSUMPTION; no source gives the split); the
 *                             openings are centred 27.46 ft off the axis
 *   main cables               4, 15.75 in diameter, 3,578.5 ft long (NPS)
 *   suspenders                208 per cable on the river span, 86 per cable on
 *                             each land span (NPS) = 1,520; 8 to 130 ft long
 *                             (Wikipedia)
 *   DERIVED cable low point:  the shortest suspender is 8 ft, so the cable at
 *                             midspan is 135 + 25 + 8 = 168 ft over the water;
 *                             at the tower it rides the saddle at 276.5 + 3,
 *                             so the main-span sag is 111.5 ft. The longest
 *                             suspender then comes out at 135.5 ft against a
 *                             published 130, five feet apart.
 *   DERIVED side-span sag:    one cable carries one horizontal tension, so a
 *                             parabola's sag scales with span squared:
 *                             111.5 x (955 / 1595.5)^2 = 39.9 ft below the
 *                             chord from saddle to anchorage entry
 *   diagonal stays            400 (Wikipedia; the 1906 count is 100 and the
 *                             two are not reconciled), 138 to 449 ft long
 *                             (Wikipedia). 400 = 4 cables x 2 towers x 2
 *                             directions x 25, so 25 per fan.
 *   DERIVED stay reach:       from the tower top (276.5) to the truss top at
 *                             the tower (119 + 25 = 144) is a 132.5 ft drop,
 *                             so the shortest stay reaches sqrt(138^2 -
 *                             132.5^2) = 38.6 ft along the deck and the
 *                             longest sqrt(449^2 - 132.5^2) = 429 ft. The 25
 *                             stays are spread evenly in length between the
 *                             two published extremes.
 *   anchorages                2, 129 x 119 ft at the base, 117 x 104 at the
 *                             top, limestone, 60,000 tons each (NPS); the
 *                             cable "surfacing approximately 25 ft back from
 *                             the edge" (NPS)
 *   DERIVED anchorage batter: base to top the plan narrows 12 ft in length and
 *                             15 ft in width, so each face slopes continuously
 *                             6 ft per end and 7.5 ft per side over the 89 ft
 *                             of masonry (see ASSUMED for the 89): ONE
 *                             frustum, four sloping faces, no set-backs. The
 *                             stacked blocks an earlier draft drew were an
 *                             assumption and read as the wrong building.
 *   approaches                971 ft Brooklyn, 1,562.5 ft New York (NPS); only
 *                             a 100 ft stub of the New York one fits the box
 *                             (see the box paragraph); the Brooklyn approach
 *                             is not drawn at all, the deck is cut on the back
 *                             face of the Brooklyn anchorage and the cut is
 *                             painted as a section
 *   keystones                 11 tons apiece (NPS): the ring is drawn as real
 *                             wedge stones, radiating from the arc centres
 *   materials                 granite towers with limestone below the roadway,
 *                             "white granite at corner quoins, arch voussoirs,
 *                             and cornices" (Structure), Rosendale cement in
 *                             half-inch flush joints; limestone anchorages
 *                             (NPS); greenheart plank promenade (brooklyn
 *                             bridgeforest.com); the cleaned towers read as
 *                             "pink granite" (Prosoco)
 *
 * ASSUMED, no source reached gives these, each named in the build report:
 *   cornice base height       256.5 ft: the corbel, the cornice and the coping
 *                             stage above it together take the top 20 ft
 *   corbel course             2 ft, 256.5 to 258.5, stepping out half the
 *                             cornice projection (2.5 ft), drawn a shade
 *                             darker than the shaft because it sits under the
 *                             cornice, with a 3 ft band of cast shadow on the
 *                             wall below it: that is what makes a 5 ft
 *                             overhang read as an overhang at 900 px
 *   cornice slab              5.5 ft tall, 258.5 to 264, projecting to the
 *                             136 x 53 top plan
 *   parapet (coping stage)    264 to 276.5 ft, set back 1 ft from the cornice
 *                             edge; the tower really has a FLAT top, the four
 *                             cables cross it on saddles
 *   buttress piers            the three piers stand 2 ft proud of the arch
 *                             faces on the two roadway fronts from the roadway
 *                             up to 9 ft below the cornice base, where a 3 ft
 *                             sloped weathering steps them back to the wall
 *                             plane, so the top 6 ft of shaft is one plane
 *                             under the corbel; the set-off is the profile the
 *                             photographs show under the crown
 *   quoins                    white granite, 4 ft wide at the four corners,
 *                             roadway to cornice base, with a joint line on
 *                             the inner edge
 *   voussoir ring depth       6 ft (intrados R = 46, extrados 52)
 *   the inside of an opening  the reveals and the vault soffit are painted a
 *                             granite two full shade steps below the pier
 *                             face (0.72 x 0.72 of it), because the inside of
 *                             a 117 ft portal under a vault is in shadow; at
 *                             900 px that is what makes both lancets read as
 *                             holes through the tower and not as lines on it
 *   cable saddles             four blocks 8 x 4 x 3 ft on the tower top
 *   cable planes              12 ft and 40 ft off the axis (the inner pair at
 *                             the trusses beside the promenade, the outer pair
 *                             at the outer trusses); the old scene used 20.5
 *                             and 34.5, also unpublished
 *   stays                     leave the tower top at its roadway-side edge and
 *                             land on the top chord of the trusses; in the
 *                             span view every SECOND stay is drawn, 13 per
 *                             fan, at 0.4 opacity, so the fan is a
 *                             translucent web the tower shows through; up
 *                             close all 25 in the cable tone
 *   suspenders                land on the top chord; in the span view every
 *                             fourth on the river span and every third on the
 *                             land spans is drawn, about 31 ft either way, in
 *                             the tower view every one at the published
 *                             spacing, 7.67 ft (1,595.5 / 208) and 10.8 ft
 *                             (930 / 86)
 *   voussoir count            16 wedge stones per ring face, 8 each side of
 *                             the keystone; the real count is not published
 *   line weights              the four cables are 15.75 in; at 0.115 units a
 *                             foot that is 0.15 units, under a pixel, so every
 *                             cable, stay, suspender, chord and rail is drawn
 *                             at the least width that survives the page: span
 *                             view cables 1.2, stays 0.5, suspenders 0.35;
 *                             tower view cables 1.6, stays 0.35 at 0.4 opacity
 *                             (see LOOKING, below), suspenders
 *                             0.45
 *   roadways                  each 32.5 ft, from the 10 ft line to the 42.5 ft
 *                             edge, a continuous asphalt surface with one lane
 *                             line each; the 20 ft between them carries the
 *                             promenade; the 7.5 ft floor beams show on the
 *                             side faces of the 8 ft floor structure only
 *   trusses                   run tower to anchorage and stop at the masonry;
 *                             top chord and bottom chord 1.5 ft deep, verticals
 *                             every 15 ft (two floor-beam bays), one diagonal
 *                             per panel, 25 ft over the roadway on the outer
 *                             pair and the full 33 ft where the outer truss
 *                             shows below the deck edge; in the span view the
 *                             verticals are every 60 ft, a texture
 *   promenade structure       a 2 ft greenheart slab at 16 to 18 ft with a
 *                             darker timber side face, carried on steel posts
 *                             at each truss panel (15 ft up close, 60 ft at
 *                             the span framing) with a stringer along each
 *                             underside edge, a 3.5 ft rail of posts and a
 *                             top rail; at each tower it divides into two
 *                             7 ft walks that pass through the arches either
 *                             side of the centre pier. The posts are the
 *                             support the photographs show under the walk's
 *                             edge; their spacing is this file's
 *   anchorage height          89 ft of limestone under a 3 ft white granite
 *                             coping to 92 ft, the deck floor sitting on that,
 *                             which clears the "more than 80 ft" of masonry
 *                             the anchor chain rises through; course lines
 *                             every 8 ft on all four battered faces
 *   anchorage openings        two per long flank, the big arched vaults the
 *                             street sees: drawn as recessed dark panels,
 *                             30 ft wide, 60 ft to the apex, two-centred with
 *                             a 27 ft rise (rise over width 0.9, a lancet,
 *                             matching the towers), centred 32 ft either side
 *                             of the anchorage's middle. Their size, rise and
 *                             spacing are this file's; only their existence
 *                             and their pointed heads are from photographs
 *   cable entry               four 1.5 x 1.5 ft stubs in the cable tone from
 *                             the roadway down into the anchorage top, 25 ft
 *                             back from the river edge, the published entry
 *   deck at the anchorage     100 ft above the water, a 19 ft fall over the
 *                             930 ft land span; the roadways and the promenade
 *                             run across the whole anchorage top to the back
 *                             face of the masonry; beyond the New York one the
 *                             approach falls at 100 / 1,562.5 per ft on
 *                             limestone ramp walls battered 3.5 ft, which
 *                             spring from the anchorage's own back face and
 *                             share its ground line; the Brooklyn deck ends on
 *                             the back face of its anchorage, painted as a cut
 *   shorelines                300 ft behind each tower
 *   the water                 drawn 600 ft either side of the bridge axis
 *                             between the two shorelines; the shore pads 150
 *                             ft either side of the axis to the anchorage,
 *                             cut back to 80 ft off the axis at the Brooklyn
 *                             anchorage's back face (its shadow is clipped to
 *                             the same pad, since a shadow falls only on
 *                             ground that is drawn).
 *                             Backdrops, not a survey; in the span view they
 *                             are kept inside the frame, in the tower view the
 *                             water runs to the edges on purpose, it is a river
 *   coursing                  joint lines every 8 ft in the tower view on all
 *                             four faces, roadway to cornice base and on the
 *                             battered limestone below, every 24 ft on the end
 *                             faces only in the span view: a texture, not a
 *                             count
 *   cable and stay colour     a warm grey, an observation from photographs; no
 *                             source names the 2010-2014 paint
 *   the section cuts          the tower view stops the deck, the promenade,
 *                             the cables, the stays and the hangers 380 ft
 *                             either side of the tower on one plane each: the
 *                             floor and the promenade (roadway to plank top)
 *                             get a dark section face on that plane, the
 *                             cables fade over their last two pieces and end
 *                             in a short dark tick on the plane, every stay
 *                             that would reach past the plane is cut on it
 *                             (endpoint interpolated) and its last piece
 *                             fades, so nothing lands beyond the cutaway
 *
 * THE BOX. The crossing anchorage to anchorage is 3,584.5 ft plus the 100 ft
 * New York stub, 424 units at S = 0.115. The span camera is fixed at yaw
 * -0.62, pitch 0.32, zoom 2.6, centred on (300, 220) of a 980 x 340 box, and
 * its tilt runs from -0.14 to 0.44. The model is turned +0.04 rad in plan
 * about the origin before the renderer sees it (x' = x cos a - y sin a, y' =
 * x sin a + y cos a), which keeps the origin and the scale untouched and puts
 * the effective yaw at -0.58. Measured off the projected vertices, not
 * guessed, and re-measured after this rebuild: every structural vertex AND
 * every ground vertex lies inside the box at the page's pitch, at the 0.44
 * ceiling and at the -0.14 floor (the numbers are in the build report). A
 * larger turn puts the Brooklyn end over the top at the ceiling, a smaller
 * one puts it off the right edge, a stub beyond the Brooklyn anchorage cannot
 * fit at any turn, which is why there is none, and a 25 ft truss carried over
 * the anchorage tops put the Brooklyn end 3.6 units over the top at the
 * ceiling, which is why the trusses stop at the masonry.
 * The camera turns freely on the page, and on that idle turn the far
 * anchorage leaves the box at some yaws (at -2.2 the Brooklyn tower is cut by
 * the left edge), as the old 2,195 ft deck also did: only a camera refit
 * could hold a 3,700 ft object in a 377 unit wide frame at every angle, and
 * the camera is not this file's.
 *
 * Light: the renderer's own SUN, normalised (-0.55, -0.5, 0.67): faces toward
 * -x, -y or up are lit. Every shaded face is handed a slightly warmer base
 * when its outward normal faces the sun, so each material carries two tones,
 * and the renderer's own shader does lit versus shade on top. Every hand
 * built polygon names its outward direction and is wound to match it, so no
 * face is shaded inside out. Every ground shadow is the mass's footprint
 * pushed along -SUN, 0.821 ft in x and 0.746 ft in y per foot of height in
 * the renderer's frame, turned back by the plan rotation so it lands where
 * the sun says, flat on the water or shore: towers, anchorages, the ramp, and
 * the deck itself, run by run, so the span does not float.
 *
 * Painter's order: the shore pads carry bias -3000, the water -2000, every
 * shadow -1000, so all three are behind everything solid whatever the
 * camera; the gaps are a thousand because a bias only orders faces if it is
 * larger than the spread of centroid depths it has to beat, and the span
 * view's spread is about 400 units. The anchorage coping's top face carries
 * -12 so it can never paint through the roadway that crosses it: its
 * centroid sits at the anchorage's middle and is up to 5 units nearer than
 * the last deck segment's far roadway, 35 ft further along and 26 ft across
 * (a -6 was tried and the pale patch stayed). On the towers the pier faces carry 1.0
 * and everything drawn ON them more: course joints 1.4, quoins 1.5, the
 * cornice's shadow band 1.7; the earlier draft had the joints and quoins
 * UNDER the piers and they never showed. Solid parts otherwise sort by
 * centroid. The two traps met here: a long face mis-sorts against small parts
 * near its ends, so the deck is cut into segments, the cables into short
 * pieces and every stay into three or four; and lines are never occluded, so
 * every cable, suspender, stay, joint and rail is a short FACE with a stroke,
 * which the painter sorts by its midpoint. That is what stops the far cables
 * painting through 276 ft of masonry, which the old tower view could only
 * avoid by not drawing them. A two point face is not counted as ink by the
 * renderer's label placer (it only reads shaded faces and scene.lines), so
 * the cables, stays and suspenders are emitted as a DEGENERATE three point
 * face (a, b, a) that is not flat: zero area, the same stroke, and the label
 * placer now knows the web is there and lifts or haloes a label that would
 * land on it. The leaders and the joints stay two point and invisible to it.
 *
 * Labels in the tower view: the tower fills the box top to bottom, so any
 * text beside a point on it lands on stone or on the far web. Each label
 * therefore keeps its dot on the true point and a leader runs to a second,
 * invisible mark in the empty right third of the page, where the words are
 * set. The tower's leader runs from the cap corner along the tower's end at
 * 276.5 ft. The arch's leader first steps 45 ft toward the eye, clear of the
 * near pier's face, then runs along the deck's side at the apex height, so
 * it crosses the web and never the masonry. At the page's own camera that
 * reads as a dimension line; at a diagnostic yaw it is a line in space,
 * which is what it is, and the form cannot know the yaw (it is not handed
 * the camera), so at other yaws the words rely on the renderer's own lift
 * and halo, which the ink registration above is what arms.
 */
(function () {
  var H = window.NYC3D.helpers, ST = window.STYLES3D, C = H.C;
  window.NYC_FORMS = window.NYC_FORMS || {};

  /* ---- the facts ---- */
  var F = {
    span: 1595.5, side: 930, towerH: 276.5, deckTower: 119, deckMid: 135,
    clearMid: 127, trussD: 33, beam: 7.5, deckW: 85, promW: 16, promUp: 18,
    archW: 33.75, archH: 117, archR: 46,
    planWater: [140, 59], planRoad: [131, 48], planCornice: [126, 43], planTop: [136, 53],
    pedNY: 47, pedBK: 20,
    cableDia: 15.75 / 12, suspRiver: 208, suspLand: 86,
    staysPerFan: 25, stayMin: 138, stayMax: 449,
    anchBase: [129, 119], anchTop: [117, 104], anchSetback: 25,
    appNY: 1562.5, appBK: 971
  };
  /* ---- the assumptions, all named in the header ---- */
  var A = {
    corniceBase: 256.5, corbel: 2, corniceTop: 264, parapetIn: 1, pierProud: 2, ring: 6,
    setoff: [9, 6], shadowBand: 3,
    quoin: 4, saddle: [8, 4, 3], cableY: [12, 40], roadInner: 10, promSlab: 2, rail: 3.5,
    halfWalk: 7, anchMasonry: 89, anchCoping: 3, deckAnch: 100,
    anchArch: { w: 30, top: 60, rise: 27, off: 32 },
    rampBatter: 3.5,
    stubNY: 100, shore: 300, waterHalf: 600, padHalf: 150, padBackBK: 80, courseNear: 8, courseFar: 24,
    chord: 1.5, panel: 15, turn: 0.04, cut: 380
  };
  var FLOOR = F.deckMid - F.clearMid;          /* 8 ft of structure under the roadway */
  var TRUSS_UP = F.trussD - FLOOR;             /* 25 ft of truss above the roadway */
  var PIER = (F.planRoad[0] - 2 * F.archW) / 3; /* 21.17 ft */
  var OPEN_C = F.archW / 2 + PIER / 2;          /* 27.46 ft, centre of each opening */
  var OPEN_IN = PIER / 2;                       /* 10.58, the inner jamb */
  var OPEN_OUT = OPEN_IN + F.archW;             /* 44.33, the outer jamb */
  var ARCH_A = F.archW / 2;
  var ARCH_D = F.archR - ARCH_A;                /* 29.125, centre offset */
  var ARCH_RISE = Math.sqrt(F.archR * F.archR - ARCH_D * ARCH_D);   /* 35.61 */
  var SPRING = F.deckTower + F.archH - ARCH_RISE;                     /* 200.39 */
  var CABLE_TOP = F.towerH + A.saddle[2];       /* 279.5, over the saddle */
  var CABLE_LOW = F.deckMid + TRUSS_UP + 8;     /* 168, the 8 ft suspender */
  var SAG = CABLE_TOP - CABLE_LOW;              /* 111.5 */
  var ANCH_X = F.side + F.anchSetback;          /* 955 from the tower to the cable's dive */
  var SIDE_SAG = SAG * Math.pow(ANCH_X / F.span, 2);   /* 39.9 */
  var STAY_DROP = F.towerH - (F.deckTower + TRUSS_UP); /* 132.5 */
  var ANCH_H = A.anchMasonry + A.anchCoping;    /* 92, the coping top the deck floor sits on */

  /* ---- materials: base and a warmer sunward base ---- */
  var GRANITE = { base: '#b1a698', warm: '#c2b5a6' };      /* the cleaned pinkish grey */
  var GRANITE_W = { base: '#d9d2c6', warm: '#e6dfd3' };    /* white granite: quoins, ring, cornice */
  var GRANITE_DK = { base: '#8f8577', warm: '#978d7f' };   /* the corbel course, under the cornice */
  var GRANITE_IN = { base: '#5c564e', warm: '#5c564e' };   /* granite inside an opening: two shade steps down */
  var LIMESTONE = { base: '#c9c0ad', warm: '#d4cbb8' };    /* ST.PALETTE.limestone */
  var LIME_ROCK = { base: '#b4aa98', warm: '#bfb5a3' };    /* the rock-faced pedestal */
  var STEEL = { base: '#6f7378', warm: '#7c8085' };        /* ST.PALETTE.steelCable */
  var TIMBER = { base: '#8a6f52', warm: '#98795b' };       /* ST.PALETTE.timberDeck, greenheart */
  var TIMBER_DK = { base: '#66513b', warm: '#6e5740' };    /* its side face, ST.PALETTE.timberDeck.edge */
  var ROAD = { base: '#5d5d5f', warm: '#646466' };         /* ST.PALETTE.roadway */
  var RAILM = { base: '#4b4e52', warm: '#575a5e' };        /* truss chords, ST.PALETTE.steelCable.edge */
  var SECTION_M = { base: '#8e8676', warm: '#8e8676' };    /* a cut face */
  var CABLE = '#776f64', SUSP = '#a49e92', STAY = '#9d978b', RAIL = '#4b4e52';
  var JOINT = '#7d7468', SHADOW = '#1c2733', LAND = '#d3cdbd';
  var VOID_L = '#66605a';                                  /* limestone two shade steps down: the anchorage vaults */
  var SECTION = '#6f6857', LANE = '#c9c3b5', LEADER = C.label;

  var SUN = H.SUN;
  /* the backdrops' biases, see the painter's paragraph in the header */
  var BIAS_GROUND = -3000, BIAS_WATER = -2000, BIAS_SHADOW = -1000, BIAS_UNDER_DECK = -12;
  var B_PIER = 1.0, B_COURSE = 1.4, B_QUOIN = 1.5, B_BAND = 1.7;

  window.NYC_FORMS.bridge = function (opts) {
    var o = opts || {};
    var near = o.view === 'tower';
    var S = 0.115;
    var CA = Math.cos(A.turn), SA = Math.sin(A.turn);
    /* feet to model units, through the plan turn */
    function P(x, y, z) { return [(x * CA - y * SA) * S, (x * SA + y * CA) * S, z * S]; }
    var f = [], lines = [], marks = [];

    /* a shaded face from feet; the warmer base goes to faces facing the sun.
       `out` is the face's outward direction in feet: if the winding disagrees
       with it the points are reversed, so a hand built polygon is never shaded
       inside out. */
    function fc(pts, m, extra, out) {
      var p3 = pts.map(function (p) { return P(p[0], p[1], p[2]); });
      var n = H.normal(p3[0], p3[1], p3[2]);
      if (out && (n[0] * out[0] + n[1] * out[1] + n[2] * out[2]) < 0) {
        p3.reverse(); n = [-n[0], -n[1], -n[2]];
      }
      var lit = n[0] * SUN[0] + n[1] * SUN[1] + n[2] * SUN[2] > 0;
      f.push(H.face(p3, lit ? m.warm : m.base, extra || {}));
    }
    function flat(pts, colour, extra) {
      var e = extra || {}; e.flat = true;
      f.push(H.face(pts.map(function (p) { return P(p[0], p[1], p[2]); }), colour, e));
    }
    /* an occludable line: a stroke, sorted by its midpoint. With ink=true it
       is a degenerate three point face the label placer can see (header). */
    function seg(a, b, colour, width, opacity, bias, ink) {
      var pa = P(a[0], a[1], a[2]), pb = P(b[0], b[1], b[2]);
      f.push(H.face(ink ? [pa, pb, pa] : [pa, pb], colour,
        { flat: !ink, stroke: colour, width: width, opacity: opacity, bias: bias || 0 }));
    }
    /* a box with every outward normal correct, no underside; mats may name a
       material per face: { top, ny, px, py, nx } */
    function bx(x0, x1, y0, y1, z0, z1, m, extra, noTop, mats) {
      var mm = mats || {};
      var Aa = [x0, y0, z0], B = [x1, y0, z0], Cc = [x1, y1, z0], D = [x0, y1, z0];
      var E = [x0, y0, z1], Fq = [x1, y0, z1], G = [x1, y1, z1], Hh = [x0, y1, z1];
      if (!noTop) fc([E, Fq, G, Hh], mm.top || m, extra, [0, 0, 1]);
      fc([Aa, B, Fq, E], mm.ny || m, extra, [0, -1, 0]);
      fc([B, Cc, G, Fq], mm.px || m, extra, [1, 0, 0]);
      fc([Cc, D, Hh, G], mm.py || m, extra, [0, 1, 0]);
      fc([D, Aa, E, Hh], mm.nx || m, extra, [-1, 0, 0]);
    }
    /* a battered block: rectangle a at za to rectangle b at zb */
    function frustum(za, zb, ax0, ax1, ay0, ay1, bx0, bx1, by0, by1, m, extra, withTop, mats) {
      var mm = mats || {};
      var Aa = [ax0, ay0, za], B = [ax1, ay0, za], Cc = [ax1, ay1, za], D = [ax0, ay1, za];
      var E = [bx0, by0, zb], Fq = [bx1, by0, zb], G = [bx1, by1, zb], Hh = [bx0, by1, zb];
      if (withTop) fc([E, Fq, G, Hh], mm.top || m, extra, [0, 0, 1]);
      fc([Aa, B, Fq, E], mm.ny || m, extra, [0, -1, 0]);
      fc([B, Cc, G, Fq], mm.px || m, extra, [1, 0, 0]);
      fc([Cc, D, Hh, G], mm.py || m, extra, [0, 1, 0]);
      fc([D, Aa, E, Hh], mm.nx || m, extra, [-1, 0, 0]);
    }
    function hull(pts) {
      pts = pts.slice().sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
      function cross(o2, a, b) { return (a[0] - o2[0]) * (b[1] - o2[1]) - (a[1] - o2[1]) * (b[0] - o2[0]); }
      var lo = [], up = [];
      pts.forEach(function (p) {
        while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop();
        lo.push(p);
      });
      pts.slice().reverse().forEach(function (p) {
        while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop();
        up.push(p);
      });
      lo.pop(); up.pop();
      return lo.concat(up);
    }
    /* the ground shadow of a mass: its footprint and its top plan pushed
       along -SUN, hulled, flat on the plane, over the water and under the
       mass. The push is the sun's horizontal in the renderer's frame, turned
       back into model feet by the plan rotation. */
    var sxr = -SUN[0] / SUN[2], syr = -SUN[1] / SUN[2];   /* 0.821, 0.746 per ft up, renderer frame */
    var SX = sxr * CA + syr * SA, SY = -sxr * SA + syr * CA;
    function shadow(foot, top, h, opacity, clip) {
      var pts = foot.slice();
      top.forEach(function (p) { pts.push([p[0] + SX * h, p[1] + SY * h]); });
      var hp = hull(pts).map(function (p) {
        /* a shadow falls only on ground that is drawn: clipped to the pad */
        var x = clip && clip.xmax != null ? Math.min(p[0], clip.xmax) : p[0];
        var y = clip && clip.ymax != null ? Math.min(p[1], clip.ymax) : p[1];
        return [x, y, 0];
      });
      flat(hp, SHADOW, { opacity: opacity || 0.16, bias: BIAS_SHADOW });
    }

    /* ==================== THE DECK LINE ==================== */
    var BK = F.span;                                   /* the Brooklyn tower's x */
    var ANCH_NY = -F.side, ANCH_BK = BK + F.side;      /* anchorage river faces, at the ground */
    var ANCH_L = F.anchBase[0], ANCH_LT = F.anchTop[0];
    var NY_BACK = ANCH_NY - ANCH_L, BK_BACK = ANCH_BK + ANCH_L;   /* back faces at the ground */
    var ANCH_IN = (ANCH_L - ANCH_LT) / 2;              /* 6 ft, the batter per end over 89 ft */
    var BK_END = ANCH_BK + ANCH_L / 2 + ANCH_LT / 2 + 1; /* the Brooklyn coping's back top edge */
    var X_NY = NY_BACK - A.stubNY;                     /* the New York stub's end */
    function deckZ(x) {
      if (x >= 0 && x <= BK) {                         /* the river span, cambered */
        var u = (x - BK / 2) / (BK / 2);
        return F.deckTower + (F.deckMid - F.deckTower) * (1 - u * u);
      }
      if (x < 0) {
        if (x >= ANCH_NY) return F.deckTower + (A.deckAnch - F.deckTower) * (-x / F.side);
        if (x >= NY_BACK) return A.deckAnch;
        return A.deckAnch - (NY_BACK - x) * (A.deckAnch / F.appNY);
      }
      if (x <= ANCH_BK) return F.deckTower + (A.deckAnch - F.deckTower) * ((x - BK) / F.side);
      if (x <= BK_BACK) return A.deckAnch;
      return A.deckAnch - (x - BK_BACK) * (A.deckAnch / F.appBK);
    }
    /* the main cable, one parabola per span, the same tension throughout;
       on the land spans it comes down to the roadway over the anchorage,
       where the stubs carry it into the masonry */
    function cableZ(x) {
      if (x >= 0 && x <= BK) { var t = x / BK; return CABLE_TOP - 4 * SAG * t * (1 - t); }
      var tx = x < 0 ? 0 : BK, dir = x < 0 ? -1 : 1;
      var s = dir * (x - tx) / ANCH_X;                 /* 0 at the saddle, 1 at the dive */
      return CABLE_TOP + (A.deckAnch - CABLE_TOP) * s - 4 * SIDE_SAG * s * (1 - s);
    }

    /* ==================== GROUND, WATER, SHORES ==================== */
    var HW = F.deckW / 2, HWA = F.anchBase[1] / 2 + 2.5;
    if (near) {
      /* the water, a backdrop: wide enough that the far deck, the cable ends
         and both cut faces are seen against it at every tilt; it runs to the
         edges of the frame on purpose, it is a river */
      flat([[-700, -560, 0], [1100, -560, 0], [1100, -60, 0], [700, 300, 0], [-700, 300, 0]], C.water,
           { bias: BIAS_WATER });
    } else {
      var WH = A.waterHalf, PH = A.padHalf;
      /* the New York shore: the pad to the anchorage's back, the ramp width under the stub */
      flat([[X_NY, -HW - A.rampBatter - 1, 0], [NY_BACK, -HW - A.rampBatter - 1, 0], [NY_BACK, -PH, 0], [-A.shore, -PH, 0],
            [-A.shore, PH, 0], [NY_BACK, PH, 0], [NY_BACK, HW + A.rampBatter + 1, 0], [X_NY, HW + A.rampBatter + 1, 0]],
           LAND, { bias: BIAS_GROUND });
      /* the Brooklyn shore: the pad to the anchorage's back; its far corner is
         cut on a diagonal to 80 ft off the axis at the back face, measured:
         at the page's camera that corner is the one point of ground that
         would leave the right edge of the box */
      flat([[BK + A.shore, -PH, 0], [BK_BACK, -PH, 0], [BK_BACK, A.padBackBK, 0],
            [ANCH_BK, PH, 0], [BK + A.shore, PH, 0]],
           LAND, { bias: BIAS_GROUND });
      flat([[-A.shore, -WH, 0], [BK + A.shore, -WH, 0], [BK + A.shore, WH, 0], [-A.shore, WH, 0]],
           C.water, { bias: BIAS_WATER });
    }

    /* ==================== ONE TOWER ==================== */
    function tower(tx, ped) {
      var HX0 = F.planWater[1] / 2, HY0 = F.planWater[0] / 2;     /* 29.5, 70 */
      var HX1 = F.planRoad[1] / 2, HY1 = F.planRoad[0] / 2;       /* 24, 65.5 */
      var HX2 = F.planCornice[1] / 2, HY2 = F.planCornice[0] / 2; /* 21.5, 63 */
      var HX3 = F.planTop[1] / 2, HY3 = F.planTop[0] / 2;         /* 26.5, 68 */
      function prof(z) {
        if (z <= ped) return [HX0, HY0];
        if (z <= F.deckTower) { var t = (z - ped) / (F.deckTower - ped); return [HX0 + (HX1 - HX0) * t, HY0 + (HY1 - HY0) * t]; }
        if (z <= A.corniceBase) { var u = (z - F.deckTower) / (A.corniceBase - F.deckTower); return [HX1 + (HX2 - HX1) * u, HY1 + (HY2 - HY1) * u]; }
        return [HX2, HY2];
      }
      var CB = A.corniceBase, RD = F.deckTower, PR = A.pierProud;
      var Z9 = CB - A.setoff[0], Z6 = CB - A.setoff[1];     /* the weathering: proud below 247.5, flush above 250.5 */
      function px(z) { return prof(z)[0]; }
      function proud(z) { return z <= Z9 ? PR : (z >= Z6 ? 0 : PR * (Z6 - z) / (Z6 - Z9)); }

      /* the shadow first: base plan and top plan at 276.5 */
      shadow([[tx - HX0, -HY0], [tx + HX0, -HY0], [tx + HX0, HY0], [tx - HX0, HY0]],
             [[tx - HX3, -HY3], [tx + HX3, -HY3], [tx + HX3, HY3], [tx - HX3, HY3]], F.towerH);

      /* the rock-faced pedestal, straight out of the river */
      bx(tx - HX0, tx + HX0, -HY0, HY0, 0, ped, LIME_ROCK, {}, true);
      /* limestone below the roadway, battering in to the roadway plan; its
         top is the tunnel floor under the roadway, pushed back so the roadway
         paints over it */
      frustum(ped, RD, tx - HX0, tx + HX0, -HY0, HY0, tx - HX1, tx + HX1, -HY1, HY1,
              LIMESTONE, { bias: -0.5 }, false);
      fc([[tx - HX1, -HY1, RD], [tx + HX1, -HY1, RD], [tx + HX1, HY1, RD], [tx - HX1, HY1, RD]],
         LIMESTONE, { bias: -2 }, [0, 0, 1]);

      /* THREE PIERS, roadway to cornice base, granite, each its own prism 2
         ft proud on the roadway fronts up to the weathering set-off 9 ft under
         the corbel, then flush. pier, opening, pier, opening, pier. The faces
         that look INTO an opening are the reveals and are painted the dark
         granite, which is what makes the lancets read as holes. */
      var p1 = prof(RD), p2 = prof(CB);
      function yAt(ya, yb, z) { return ya + (yb - ya) * (z - RD) / (CB - RD); }
      function pier(y0a, y1a, y0b, y1b, mats) {
        var mm = mats || {};
        /* the two roadway fronts: proud, the weathering slope, flush */
        [-1, 1].forEach(function (fx) {
          [[RD, Z9], [Z9, Z6], [Z6, CB]].forEach(function (zz) {
            var za = zz[0], zb = zz[1];
            var xa = tx + fx * (px(za) + proud(za)), xb = tx + fx * (px(zb) + proud(zb));
            fc([[xa, yAt(y0a, y0b, za), za], [xa, yAt(y1a, y1b, za), za],
                [xb, yAt(y1a, y1b, zb), zb], [xb, yAt(y0a, y0b, zb), zb]],
               GRANITE, { bias: B_PIER }, [fx, 0, 0]);
          });
        });
        /* the two side faces, with the set-off notch at the top of each edge */
        [[y0a, y0b, -1, mm.ny], [y1a, y1b, 1, mm.py]].forEach(function (s) {
          var ya = s[0], yb = s[1], sy = s[2], m = s[3] || GRANITE;
          var poly = [
            [tx - px(RD) - PR, ya, RD], [tx + px(RD) + PR, ya, RD],
            [tx + px(Z9) + PR, yAt(ya, yb, Z9), Z9], [tx + px(Z6), yAt(ya, yb, Z6), Z6],
            [tx + px(CB), yb, CB], [tx - px(CB), yb, CB],
            [tx - px(Z6), yAt(ya, yb, Z6), Z6], [tx - px(Z9) - PR, yAt(ya, yb, Z9), Z9]
          ];
          fc(poly, m, { bias: B_PIER }, [0, sy, 0]);
        });
      }
      pier(-OPEN_IN, OPEN_IN, -OPEN_IN, OPEN_IN, { ny: GRANITE_IN, py: GRANITE_IN });
      pier(OPEN_OUT, p1[1], OPEN_OUT, p2[1], { ny: GRANITE_IN });
      pier(-p1[1], -OPEN_OUT, -p2[1], -OPEN_OUT, { py: GRANITE_IN });

      /* THE TWO OPENINGS, each a two-centred lancet: the springing is 81.39
         ft over the roadway, the rise 35.61, both from the published 46 ft
         radius. On each roadway front: the voussoir ring as wedge stones in
         white granite fanning from the arc centres, the spandrel above it
         in granite, and inside, the vaulted soffit from front to back. */
      var arc = ST.pointedArch(F.archW, ARCH_RISE, near ? 22 : 12);
      var Rext = F.archR + A.ring;
      [-1, 1].forEach(function (side) {
        var yc = side * OPEN_C;
        [-1, 1].forEach(function (fx) {
          function xAt(z) { return tx + fx * px(z); }     /* the recessed bay plane */
          /* the ring: joints from ST.voussoirs, wedge between consecutive joints */
          var J = ST.voussoirs(F.archW, ARCH_RISE, A.ring, 8), nj = J.length / 2;
          for (var h2 = 0; h2 < 2; h2++) {
            for (var i = 0; i < nj - 1; i++) {
              var a = J[h2 * nj + i], b = J[h2 * nj + i + 1];
              var q = [[a[0][0], a[0][1]], [a[1][0], a[1][1]], [b[1][0], b[1][1]], [b[0][0], b[0][1]]];
              fc(q.map(function (uv) { var z = SPRING + uv[1]; return [xAt(z), yc + uv[0], z]; }),
                 GRANITE_W, { bias: 0.4, stroke: JOINT, width: 0.5 }, [fx, 0, 0]);
            }
          }
          /* the spandrel: from the extrados up to the cornice base, jamb to jamb */
          var sp = [[xAt(CB), yc - ARCH_A, CB]];
          var tj = Math.acos(-F.archR / Rext), ta = Math.atan2(Math.sqrt(Rext * Rext - ARCH_D * ARCH_D), -ARCH_D);
          var NS = 10;
          for (var k = 0; k <= NS; k++) {          /* left half of the extrados, jamb to apex */
            var t = tj + (ta - tj) * k / NS;
            var u = ARCH_D + Rext * Math.cos(t), v = Rext * Math.sin(t);
            sp.push([xAt(SPRING + v), yc + u, SPRING + v]);
          }
          for (var k2 = NS - 1; k2 >= 0; k2--) {   /* right half, mirrored */
            var t2 = tj + (ta - tj) * k2 / NS;
            var u2 = -(ARCH_D + Rext * Math.cos(t2)), v2 = Rext * Math.sin(t2);
            sp.push([xAt(SPRING + v2), yc + u2, SPRING + v2]);
          }
          sp.push([xAt(CB), yc + ARCH_A, CB]);
          fc(sp, GRANITE, {}, [fx, 0, 0]);
          /* the jamb line where wall meets opening, below the springing */
          [-1, 1].forEach(function (hh) {
            seg([xAt(RD), yc + hh * ARCH_A, RD], [xAt(SPRING), yc + hh * ARCH_A, SPRING], JOINT, 0.7, 0.6, 0.5);
          });
        });
        /* the soffit: the vault from front to back along the intrados, in shadow */
        for (var s2 = 0; s2 < arc.length - 1; s2++) {
          var a1 = arc[s2], b1 = arc[s2 + 1];
          var za = SPRING + a1[1], zb = SPRING + b1[1];
          fc([[tx - px(za), yc + a1[0], za], [tx + px(za), yc + a1[0], za],
              [tx + px(zb), yc + b1[0], zb], [tx - px(zb), yc + b1[0], zb]], GRANITE_IN, {},
             [0, -(a1[0] + b1[0]) / 2 || 0.01, -1]);
        }
      });

      /* white granite quoins at the four corners, 4 ft wide with a joint line
         on the inner edge, on the proud plane up to the set-off and on the
         flush plane above it, drawn OVER the pier faces (bias) */
      [-1, 1].forEach(function (sx) {
        [-1, 1].forEach(function (sy) {
          var w = A.quoin;
          [[RD, Z9], [Z6, CB]].forEach(function (zz) {
            var za = zz[0], zb = zz[1];
            var xa = tx + sx * (px(za) + proud(za)), xb = tx + sx * (px(zb) + proud(zb));
            var ya = sy * prof(za)[1], yb = sy * prof(zb)[1];
            /* on the roadway front */
            fc([[xa, ya, za], [xa, ya - sy * w, za], [xb, yb - sy * w, zb], [xb, yb, zb]],
               GRANITE_W, { bias: B_QUOIN, stroke: JOINT, width: 0.6 }, [sx, 0, 0]);
            /* on the end face */
            fc([[xa, ya, za], [xa - sx * w, ya, za], [xb - sx * w, yb, zb], [xb, yb, zb]],
               GRANITE_W, { bias: B_QUOIN, stroke: JOINT, width: 0.6 }, [0, sy, 0]);
          });
        });
      });

      /* the crown: a corbel course stepping out half the projection, a shade
         darker because it sits under the cornice, then the white granite
         cornice slab projecting to the top plan, with its underside, because
         from the street a cornice is its soffit, and a joint line round the
         slab so the overhang reads as a shadow line. Below the corbel a 3 ft
         band of the cornice's cast shadow on all four faces. */
      var HXc = (HX2 + HX3) / 2, HYc = (HY2 + HY3) / 2;
      var CT = CB + A.corbel;
      bx(tx - HXc, tx + HXc, -HYc, HYc, CB, CT, GRANITE_DK, { bias: 0.25 }, true);
      fc([[tx - HXc, -HYc, CB], [tx - HXc, HYc, CB], [tx + HXc, HYc, CB], [tx + HXc, -HYc, CB]],
         GRANITE_DK, { bias: 0.15 }, [0, 0, -1]);
      bx(tx - HX3, tx + HX3, -HY3, HY3, CT, A.corniceTop, GRANITE_W, { bias: 0.3, stroke: JOINT, width: 0.6 });
      fc([[tx - HX3, -HY3, CT], [tx - HX3, HY3, CT], [tx + HX3, HY3, CT], [tx + HX3, -HY3, CT]],
         GRANITE_DK, { bias: 0.2, stroke: JOINT, width: 0.6 }, [0, 0, -1]);
      var ZB = CB - A.shadowBand, bw = A.shadowBand;
      [-1, 1].forEach(function (s) {
        var hx = px(CB) + 0.15, hy = prof(CB)[1] + 0.15;
        flat([[tx + s * hx, -hy, ZB], [tx + s * hx, hy, ZB], [tx + s * hx, hy, ZB + bw], [tx + s * hx, -hy, ZB + bw]],
             SHADOW, { opacity: 0.22, bias: B_BAND });
        flat([[tx - hx, s * hy, ZB], [tx + hx, s * hy, ZB], [tx + hx, s * hy, ZB + bw], [tx - hx, s * hy, ZB + bw]],
             SHADOW, { opacity: 0.22, bias: B_BAND });
      });
      /* the coping stage above it, then the flat top the cables cross */
      var pi = A.parapetIn;
      bx(tx - HX3 + pi, tx + HX3 - pi, -HY3 + pi, HY3 - pi, A.corniceTop, F.towerH, GRANITE, {});
      /* the four saddles */
      [-1, 1].forEach(function (sy) {
        A.cableY.forEach(function (cy) {
          bx(tx - A.saddle[0] / 2, tx + A.saddle[0] / 2, sy * cy - A.saddle[1] / 2, sy * cy + A.saddle[1] / 2,
             F.towerH, F.towerH + A.saddle[2], STEEL, { bias: 0.4 });
        });
      });

      /* coursing: joint lines on the ends and on the piers, a texture, drawn
         OVER the pier faces above the roadway (bias) and on the limestone
         below it */
      var step = near ? A.courseNear : A.courseFar;
      var cwid = near ? 0.7 : 0.5, cop = near ? 0.55 : 0.4;
      for (var z = ped + step; z < CB; z += step) {
        if (z > Z9 && z < Z6) continue;          /* not across the weathering slope */
        var pr = prof(z), hx = pr[0] + (z > RD ? proud(z) : 0), hy = pr[1];
        var cb = z > RD ? B_COURSE : 0.6;
        seg([tx - hx, -hy, z], [tx + hx, -hy, z], JOINT, cwid, cop, cb);
        seg([tx - hx, hy, z], [tx + hx, hy, z], JOINT, cwid, cop, cb);
        if (!near) continue;                 /* on the fronts only up close */
        var bands = z > RD ? [[-hy, -OPEN_OUT], [-OPEN_IN, OPEN_IN], [OPEN_OUT, hy]] : [[-hy, hy]];
        bands.forEach(function (bnd) {
          seg([tx - hx, bnd[0], z], [tx - hx, bnd[1], z], JOINT, cwid, cop, cb);
          seg([tx + hx, bnd[0], z], [tx + hx, bnd[1], z], JOINT, cwid, cop, cb);
        });
      }
    }

    /* ==================== ONE ANCHORAGE ==================== */
    function anchorage(front, dir) {
      /* dir: -1 the Manhattan one (extends toward -x), +1 the Brooklyn one.
         ONE battered limestone mass from the published 129 x 119 ft base to
         the published 117 x 104 ft top, a white granite coping, course lines
         every 8 ft on the four sloping faces, two big pointed vaults on each
         long flank as recessed dark panels, and the four cable stubs where
         the cables enter 25 ft back from the river edge. */
      var L0 = F.anchBase[0], W0 = F.anchBase[1] / 2, L1 = F.anchTop[0], W1 = F.anchTop[1] / 2;
      var H0 = A.anchMasonry;
      var cx = front + dir * L0 / 2;
      function hl(z) { return L0 / 2 + (L1 / 2 - L0 / 2) * z / H0; }
      function hw(z) { return W0 + (W1 - W0) * z / H0; }
      shadow([[cx - L0 / 2, -W0], [cx + L0 / 2, -W0], [cx + L0 / 2, W0], [cx - L0 / 2, W0]],
             [[cx - L1 / 2, -W1], [cx + L1 / 2, -W1], [cx + L1 / 2, W1], [cx - L1 / 2, W1]], ANCH_H, 0.16,
             dir > 0 ? { xmax: BK_BACK, ymax: A.padBackBK } : null);
      frustum(0, H0, cx - L0 / 2, cx + L0 / 2, -W0, W0, cx - L1 / 2, cx + L1 / 2, -W1, W1,
              LIMESTONE, {}, false);
      /* the course lines, following the batter */
      for (var z = A.courseNear; z < H0; z += A.courseNear) {
        var l = hl(z), w = hw(z);
        seg([cx - l, -w, z], [cx + l, -w, z], JOINT, 0.5, 0.4, 0.3);
        seg([cx - l, w, z], [cx + l, w, z], JOINT, 0.5, 0.4, 0.3);
        seg([cx - l, -w, z], [cx - l, w, z], JOINT, 0.5, 0.4, 0.3);
        seg([cx + l, -w, z], [cx + l, w, z], JOINT, 0.5, 0.4, 0.3);
      }
      /* the vaults: two pointed openings per long flank, recessed dark panels
         sitting a third of a foot proud of the sloping face */
      var AA = A.anchArch, spring = AA.top - AA.rise;
      var arc = ST.pointedArch(AA.w, AA.rise, 10);
      [-1, 1].forEach(function (sy) {
        [-1, 1].forEach(function (ax) {
          var xc = cx + ax * AA.off;
          var poly = [[xc - AA.w / 2, 0], [xc - AA.w / 2, spring]];
          arc.forEach(function (p) { poly.push([xc + p[0], spring + p[1]]); });
          poly.push([xc + AA.w / 2, 0]);
          /* bias 3: the far panel's centroid is 32 ft farther than the 129 ft
             face's own, 2 units of depth, and the face painted over it */
          flat(poly.map(function (p) { return [p[0], sy * (hw(p[1]) + 0.35), p[1]]; }),
               VOID_L, { bias: 3 });
        });
      });
      /* the coping, white granite, projecting a foot; its top face is pushed
         behind the deck that crosses it */
      bx(cx - L1 / 2 - 1, cx + L1 / 2 + 1, -W1 - 1, W1 + 1, H0, ANCH_H, GRANITE_W,
         { bias: 0.35, stroke: JOINT, width: 0.5 }, true);
      fc([[cx - L1 / 2 - 1, -W1 - 1, ANCH_H], [cx + L1 / 2 + 1, -W1 - 1, ANCH_H],
          [cx + L1 / 2 + 1, W1 + 1, ANCH_H], [cx - L1 / 2 - 1, W1 + 1, ANCH_H]],
         GRANITE_W, { bias: BIAS_UNDER_DECK, stroke: JOINT, width: 0.5 }, [0, 0, 1]);
      /* the four cable stubs, 25 ft back from the edge, roadway down into the top */
      var mx = front + dir * F.anchSetback;
      [-1, 1].forEach(function (sy) {
        A.cableY.forEach(function (cy) {
          bx(mx - 0.75, mx + 0.75, sy * cy - 0.75, sy * cy + 0.75, ANCH_H, A.deckAnch + 1,
             { base: CABLE, warm: CABLE }, { bias: 1.5, stroke: CABLE, width: 0.6 });
        });
      });
      if (dir > 0) return;
      /* the New York approach: a 100 ft stub of the 1,562.5 ft viaduct on
         limestone ramp walls under the falling roadway. The walls spring from
         the anchorage's own battered back face and stand on its ground line,
         so the two are one mass; the stub's end is a cut and painted as one. */
      var x0 = X_NY, x1 = NY_BACK, rb = A.rampBatter;
      var z0 = deckZ(x0) - FLOOR, z1 = deckZ(x1) - FLOOR;
      var xt = x1 + ANCH_IN * z1 / H0;                  /* where the back face is at the deck floor */
      fc([[x0, -HW - rb, 0], [x1, -HW - rb, 0], [xt, -HW, z1], [x0, -HW, z0]], LIMESTONE, {}, [0, -1, 0]);
      fc([[x0, HW + rb, 0], [x1, HW + rb, 0], [xt, HW, z1], [x0, HW, z0]], LIMESTONE, {}, [0, 1, 0]);
      fc([[x0, -HW - rb, 0], [x0, HW + rb, 0], [x0, HW, z0], [x0, -HW, z0]], SECTION_M, { bias: 0.2 }, [-1, 0, 0]);
      shadow([[x0, -HW - rb], [x1, -HW - rb], [x1, HW + rb], [x0, HW + rb]],
             [[x0, -HW], [x1, -HW], [x1, HW], [x0, HW]], (z0 + z1) / 2, 0.14);
      for (var zc = A.courseNear; zc < z1; zc += A.courseNear) {
        var xz = zc > z0 ? x0 + (x1 - x0) * (zc - z0) / (z1 - z0) : x0;
        var xe = x1 + ANCH_IN * zc / H0, yw = HW + rb * (1 - zc / z1);
        seg([xz, -yw, zc], [xe, -yw, zc], JOINT, 0.5, 0.4, 0.3);
        seg([xz, yw, zc], [xe, yw, zc], JOINT, 0.5, 0.4, 0.3);
      }
    }

    /* ==================== THE DECK ==================== */
    /* cut into segments; every tower face and anchorage face is a cut, so no
       segment straddles a wall and paints across it */
    var X0, X1, segLen, panel, postEvery;
    if (near) { X0 = -A.cut; X1 = A.cut; segLen = 30; panel = A.panel; postEvery = A.panel; }
    else { X0 = X_NY; X1 = BK_END; segLen = 100; panel = 60; postEvery = 60; }
    var cuts = [X0, X1];
    var towers = near ? [[0, F.pedNY]] : [[0, F.pedNY], [BK, F.pedBK]];
    towers.forEach(function (t) {
      var hx = F.planRoad[1] / 2 + A.pierProud;
      cuts.push(t[0] - hx, t[0] + hx);
    });
    if (!near) cuts.push(ANCH_NY, NY_BACK, ANCH_BK);
    for (var xc = Math.ceil(X0 / segLen) * segLen; xc < X1; xc += segLen) cuts.push(xc);
    cuts = cuts.filter(function (x) { return x >= X0 && x <= X1; })
      .sort(function (a, b) { return a - b; })
      .filter(function (x, i, arr) { return i === 0 || x - arr[i - 1] > 0.5; });
    function inTower(xa, xb) {
      var mid = (xa + xb) / 2, hx = F.planRoad[1] / 2 + A.pierProud;
      return towers.some(function (t) { return Math.abs(mid - t[0]) < hx; });
    }
    var RI = A.roadInner, PW = F.promW / 2;
    var CH = A.chord;
    /* a truss chord: up close a shaded 1.5 ft box, at the span framing a
       line of the same tone at the least width that survives the page */
    function chord(xa, xb, y, za, zb, w) {
      if (near) {
        var Aa = [xa, y - 0.5, za - CH], B = [xb, y - 0.5, zb - CH], Cc = [xb, y + 0.5, zb - CH], D = [xa, y + 0.5, za - CH];
        var E = [xa, y - 0.5, za], Fq = [xb, y - 0.5, zb], G = [xb, y + 0.5, zb], Hh = [xa, y + 0.5, za];
        fc([E, Fq, G, Hh], RAILM, { bias: 0.3 }, [0, 0, 1]);
        fc([Aa, B, Fq, E], RAILM, { bias: 0.3 }, [0, -1, 0]);
        fc([Cc, D, Hh, G], RAILM, { bias: 0.3 }, [0, 1, 0]);
        fc([B, Cc, G, Fq], RAILM, { bias: 0.3 }, [1, 0, 0]);
        fc([D, Aa, E, Hh], RAILM, { bias: 0.3 }, [-1, 0, 0]);
      } else {
        seg([xa, y, za - CH / 2], [xb, y, zb - CH / 2], RAIL, w, 0.95, 0.25);
      }
    }
    function railing(xa, xb, y, za, zb) {
      seg([xa, y, za + A.rail], [xb, y, zb + A.rail], RAIL, near ? 0.7 : 0.6, 0.9, 0.5);
      var n = Math.max(1, Math.round((xb - xa) / postEvery));
      for (var q = 0; q <= n; q++) {
        if (q === n && xb < X1 - 0.5) continue;      /* the next segment draws the shared post */
        var xp = xa + (xb - xa) * q / n, zp = za + (zb - za) * q / n;
        seg([xp, y, zp], [xp, y, zp + A.rail], RAIL, near ? 0.6 : 0.5, 0.85, 0.5);
      }
    }
    /* the promenade's support: posts from the roadway to the plank's
       underside at each panel and a stringer along each underside edge */
    function support(xa, xb, y, za, zb) {
      var up = F.promUp - A.promSlab;
      seg([xa, y, za + up], [xb, y, zb + up], RAIL, near ? 0.8 : 0.6, 0.9, 0.45);
      var n = Math.max(1, Math.round((xb - xa) / postEvery));
      for (var q = 0; q <= n; q++) {
        if (q === n && xb < X1 - 0.5) continue;
        var xp = xa + (xb - xa) * q / n, zp = za + (zb - za) * q / n;
        seg([xp, y, zp], [xp, y, zp + up], RAIL, near ? 0.8 : 0.55, 0.9, 0.45);
      }
    }
    var shadowRun = [];
    function flushShadow() {
      if (!shadowRun.length) return;
      var lo = [], hi = [];
      shadowRun.forEach(function (r) {
        lo.push([r[0] + SX * r[2], -HW + SY * r[2], 0], [r[1] + SX * r[2], -HW + SY * r[2], 0]);
        hi.push([r[0] + SX * r[2], HW + SY * r[2], 0], [r[1] + SX * r[2], HW + SY * r[2], 0]);
      });
      flat(lo.concat(hi.reverse()), SHADOW, { opacity: 0.16, bias: BIAS_SHADOW });
      shadowRun = [];
    }
    for (var si = 0; si < cuts.length - 1; si++) {
      var xa = cuts[si], xb = cuts[si + 1];
      var za = deckZ(xa), zb = deckZ(xb);
      var inside = inTower(xa, xb);
      var overAnch = !near && ((xb <= ANCH_NY + 0.5 && xa >= NY_BACK - 0.5) || (xa >= ANCH_BK - 0.5 && xb <= BK_END + 0.5));
      var onStub = !near && xb <= NY_BACK + 0.5;
      var first = si === 0, last = si === cuts.length - 2;
      /* the shadow of the deck on the water or the shore: collected per run
         of segments and drawn as ONE polygon below, because forty abutting
         translucent quads round apart under toFixed and leave a ladder of
         pale seams down the whole band. Over the masonry the deck shades the
         anchorage top, which is not drawn. */
      if (!inside && !overAnch && !onStub) shadowRun.push([xa, xb, (za + zb) / 2 - FLOOR / 2]);
      else flushShadow();
      /* the floor structure, 8 ft deep, steel; both ends of the deck are
         cuts, at the tower view's two planes and at the span view's stub end
         and Brooklyn back face, and are painted as cuts */
      fc([[xa, -HW, za - FLOOR], [xb, -HW, zb - FLOOR], [xb, -HW, zb], [xa, -HW, za]], STEEL, {}, [0, -1, 0]);
      fc([[xb, HW, zb - FLOOR], [xa, HW, za - FLOOR], [xa, HW, za], [xb, HW, zb]], STEEL, {}, [0, 1, 0]);
      if (first) fc([[xa, -HW, za - FLOOR], [xa, HW, za - FLOOR], [xa, HW, za], [xa, -HW, za]], SECTION_M, { bias: 0.2 }, [-1, 0, 0]);
      if (last) fc([[xb, HW, zb - FLOOR], [xb, -HW, zb - FLOOR], [xb, -HW, zb], [xb, HW, zb]], SECTION_M, { bias: 0.2 }, [1, 0, 0]);
      /* the floor beams, every 7.5 ft, on the side faces only, up close */
      if (near && !inside) {
        var nb = Math.round((xb - xa) / F.beam);
        for (var bi = 1; bi < nb; bi++) {
          var xbm = xa + (xb - xa) * bi / nb, zbm = za + (zb - za) * bi / nb;
          seg([xbm, -HW, zbm - FLOOR + 0.5], [xbm, -HW, zbm - 0.5], RAIL, 0.45, 0.55, 0.12);
          seg([xbm, HW, zbm - FLOOR + 0.5], [xbm, HW, zbm - 0.5], RAIL, 0.45, 0.55, 0.12);
        }
      }
      /* the two roadways, a continuous asphalt surface each, one lane line,
         and the framing strip between them */
      fc([[xa, -HW, za], [xb, -HW, zb], [xb, -RI, zb], [xa, -RI, za]], ROAD, {}, [0, 0, 1]);
      fc([[xa, RI, za], [xb, RI, zb], [xb, HW, zb], [xa, HW, za]], ROAD, {}, [0, 0, 1]);
      if (near) {
        var yl = (RI + HW) / 2;
        seg([xa, -yl, za + 0.2], [xb, -yl, zb + 0.2], LANE, 0.45, 0.6, 0.15);
        seg([xa, yl, za + 0.2], [xb, yl, zb + 0.2], LANE, 0.45, 0.6, 0.15);
      }
      fc([[xa, -RI, za], [xb, -RI, zb], [xb, RI, zb], [xa, RI, za]], STEEL, {}, [0, 0, 1]);
      /* the promenade, 18 ft up: greenheart planks on a 2 ft slab with a
         darker side face, posts and a stringer under each edge, a rail of
         posts and a top rail each side; through a tower it splits round the
         centre pier. At a cut plane the whole thing, roadway to plank top,
         gets one dark section face. */
      var walks = inside ? [[OPEN_IN + 1.5, OPEN_IN + 1.5 + A.halfWalk], [-OPEN_IN - 1.5 - A.halfWalk, -OPEN_IN - 1.5]]
                         : [[-PW, PW]];
      walks.forEach(function (wk) {
        var y0 = wk[0], y1 = wk[1], pu = F.promUp, ps = A.promSlab;
        fc([[xa, y0, za + pu], [xb, y0, zb + pu], [xb, y1, zb + pu], [xa, y1, za + pu]], TIMBER, { bias: 0.3 }, [0, 0, 1]);
        fc([[xa, y0, za + pu - ps], [xb, y0, zb + pu - ps], [xb, y0, zb + pu], [xa, y0, za + pu]], TIMBER_DK, { bias: 0.3 }, [0, -1, 0]);
        fc([[xb, y1, zb + pu - ps], [xa, y1, za + pu - ps], [xa, y1, za + pu], [xb, y1, zb + pu]], TIMBER_DK, { bias: 0.3 }, [0, 1, 0]);
        if (first) fc([[xa, y0, za], [xa, y1, za], [xa, y1, za + pu], [xa, y0, za + pu]], SECTION_M, { bias: 0.36 }, [-1, 0, 0]);
        if (last) fc([[xb, y1, zb], [xb, y0, zb], [xb, y0, zb + pu], [xb, y1, zb + pu]], SECTION_M, { bias: 0.36 }, [1, 0, 0]);
        support(xa, xb, y0, za, zb);
        support(xa, xb, y1, za, zb);
        railing(xa, xb, y0, za + pu, zb + pu);
        railing(xa, xb, y1, za + pu, zb + pu);
      });
      /* the stiffening trusses: four of them, top chord and bottom chord,
         verticals every 15 ft and one diagonal per panel; the outer pair
         show the full 33 ft on the deck edge, the inner pair the 25 ft
         above the roadway either side of the promenade. Over the anchorage
         tops and on the approach stub there is no truss, only the roadway
         railings: the trusses end where the land span meets the masonry
         (ASSUMED, and it is also what keeps the Brooklyn end inside the
         box at the tilt ceiling, see the box paragraph). */
      if (onStub || overAnch) {
        railing(xa, xb, -HW, za, zb);
        railing(xa, xb, HW, za, zb);
        continue;
      }
      var planes = inside ? [[-HW, true], [HW, true], [-OPEN_IN - 1, false], [OPEN_IN + 1, false]]
                          : [[-HW, true], [HW, true], [-RI, false], [RI, false]];
      planes.forEach(function (pl) {
        var y = pl[0], outer = pl[1];
        var zlo = outer ? -FLOOR : 0;
        chord(xa, xb, y, za + TRUSS_UP, zb + TRUSS_UP, outer ? 1.0 : 0.8);
        chord(xa, xb, y, za + zlo + CH, zb + zlo + CH, outer ? 0.8 : 0.6);
        var n = Math.max(1, Math.round((xb - xa) / panel));
        for (var q = 0; q <= n; q++) {
          if (q === n && xb < X1 - 0.5) continue;
          var xp = xa + (xb - xa) * q / n, zp = za + (zb - za) * q / n;
          seg([xp, y, zp + zlo], [xp, y, zp + TRUSS_UP], RAIL, near ? 0.7 : 0.6, near ? 0.9 : 0.75, 0.2);
          if (q < n) {
            var xq = xa + (xb - xa) * (q + 1) / n, zq = za + (zb - za) * (q + 1) / n;
            seg([xp, y, zp + zlo], [xq, y, zq + TRUSS_UP], RAIL, near ? 0.55 : 0.5, near ? 0.75 : 0.6, 0.2);
          }
        }
      });
    }

    flushShadow();

    /* ==================== THE TOWERS AND ANCHORAGES ==================== */
    towers.forEach(function (t) { tower(t[0], t[1]); });
    if (!near) { anchorage(ANCH_NY, -1); anchorage(ANCH_BK, 1); }

    /* ==================== THE CABLES ==================== */
    /* Line weights from the header: thin enough that the tower face shows
       between the stays, and never under a pixel. Up close the stays are in
       the cable tone on both sides, because they are 25 real members each
       side and the fan is the thing a visitor photographs; at the span
       framing every second one, translucent, so the fan is a web and not a
       wedge. Every cable, stay and suspender is registered as ink (header). */
    var cw = near ? 1.6 : 1.2;
    var suspW = near ? 0.45 : 0.35, suspO = near ? 0.8 : 0.85;
    var stayW = near ? 0.35 : 0.5, stayO = near ? 0.4 : 0.4, stayEvery = 2;
    var stayC = STAY, stayPieces = near ? 4 : 3;
    var spans = near ? [[X0, 0], [0, X1]]
                     : [[-ANCH_X, 0], [0, BK], [BK, BK + ANCH_X]];
    [-1, 1].forEach(function (sy) {
      A.cableY.forEach(function (cy) {
        var y = sy * cy;
        spans.forEach(function (sp) {
          var n = near ? 16 : (sp[1] - sp[0] > 1000 ? 30 : 16);
          for (var i = 0; i < n; i++) {
            var xa = sp[0] + (sp[1] - sp[0]) * i / n, xb = sp[0] + (sp[1] - sp[0]) * (i + 1) / n;
            /* in the tower view the run fades over its last two pieces at a cut */
            var op = 1;
            if (near) {
              var atStart = sp[0] === X0, atEnd = sp[1] === X1;
              if (atStart && i === 0) op = 0.3; else if (atStart && i === 1) op = 0.6;
              if (atEnd && i === n - 1) op = 0.3; else if (atEnd && i === n - 2) op = 0.6;
            }
            seg([xa, y, cableZ(xa)], [xb, y, cableZ(xb)], CABLE, cw, op, 0.1, true);
          }
        });
        if (near) {
          /* the break symbol: a short dark tick on the cut plane */
          [X0, X1].forEach(function (xcut) {
            var zc = cableZ(xcut);
            seg([xcut, y, zc - 4], [xcut, y, zc + 1], SECTION, 2.2, 1, 0.12);
          });
        }
        /* suspenders: river span 208 per cable, land spans 86, to the top chord */
        function drops(x0, x1, count, every) {
          var pitch = (x1 - x0) / count;
          for (var k = 1; k < count; k += every) {
            var x = x0 + pitch * k;
            if (x < X0 || x > X1) continue;
            if (inTower(x - 0.1, x + 0.1)) continue;
            seg([x, y, cableZ(x)], [x, y, deckZ(x) + TRUSS_UP], SUSP, suspW, suspO, 0.05, true);
          }
        }
        var ev = near ? 1 : 4;
        drops(0, BK, F.suspRiver, ev);
        drops(-F.side, 0, F.suspLand, near ? 1 : 3);
        if (!near) drops(BK, BK + F.side, F.suspLand, 3);
        /* THE STAYS: 25 per fan, from the tower top's roadway-side edge to the
           top chord, their lengths spread between the published 138 and 449
           ft; in pieces so each sorts against the masonry near it; cut on
           the section plane up close, the cut piece fading */
        towers.forEach(function (t) {
          [-1, 1].forEach(function (dir) {
            var x0 = t[0] + dir * (F.planTop[1] / 2 - A.parapetIn);
            for (var k = 0; k < F.staysPerFan; k += stayEvery) {
              var L = F.stayMin + (F.stayMax - F.stayMin) * k / (F.staysPerFan - 1);
              var reach = Math.sqrt(L * L - STAY_DROP * STAY_DROP);
              var x1 = x0 + dir * reach, z1 = deckZ(x1) + TRUSS_UP, clipped = false;
              if (near) {
                var xcut2 = dir < 0 ? X0 : X1;
                if ((dir < 0 && x1 < xcut2) || (dir > 0 && x1 > xcut2)) {
                  var tt = (xcut2 - x0) / (x1 - x0);
                  z1 = F.towerH + (z1 - F.towerH) * tt; x1 = xcut2; clipped = true;
                }
              } else if (x1 < X0 || x1 > X1) continue;
              for (var j = 0; j < stayPieces; j++) {
                var ta = j / stayPieces, tb = (j + 1) / stayPieces;
                var op2 = (clipped && j === stayPieces - 1) ? stayO * 0.4 : stayO;
                seg([x0 + (x1 - x0) * ta, y, F.towerH + (z1 - F.towerH) * ta],
                    [x0 + (x1 - x0) * tb, y, F.towerH + (z1 - F.towerH) * tb], stayC, stayW, op2, 0.05, true);
              }
            }
          });
        });
      });
    });

    /* ==================== THE MARKS, as the page had them ==================== */
    if (o.marks !== false && near) {
      /* Two facts, the same two the page always carried. The dot stays on
         the true point; the words go where there is paper, see the header. */
      var HY3 = F.planTop[0] / 2, HX3 = F.planTop[1] / 2;
      var capC = [-HX3, HY3, F.towerH], capL = [-HX3, 250, F.towerH];
      var crown = [-(F.planRoad[1] / 2 + A.pierProud), OPEN_C, F.deckTower + F.archH];
      var crownK = [crown[0] - 45, crown[1], crown[2]];       /* the dog-leg, toward the eye */
      var crownL = [crownK[0], 200, crown[2]];
      seg(capC, capL, LEADER, 0.8, 0.75, 2);
      seg(crown, crownK, LEADER, 0.8, 0.75, 2);
      seg(crownK, crownL, LEADER, 0.8, 0.75, 2);
      marks.push({ at: P(capC[0], capC[1], capC[2]) });
      marks.push({ at: P(capL[0], capL[1], capL[2]), r: 0.01, text: 'Manhattan tower',
                   sub: '276.5 ft above the water' });
      marks.push({ at: P(crown[0], crown[1], crown[2]), fill: C.hi });
      marks.push({ at: P(crownL[0], crownL[1], crownL[2]), r: 0.01, fill: C.hi,
                   text: 'the pointed arch',
                   sub: '33.75 ft wide, 117 ft tall, two-centred' });
    } else if (o.marks !== false) {
      marks.push({ at: P(0, 0, F.towerH + 40), text: 'Manhattan tower',
                   sub: '276.5 ft above the water' });
      marks.push({ at: P(BK, 0, F.towerH + 40), text: 'Brooklyn tower' });
      marks.push({ at: P(BK / 2, 0, F.deckMid + 60), text: 'the promenade',
                   sub: '18 ft above the traffic, walkers only' });
    }
    return { w: 980, h: 340, faces: f, lines: lines, marks: marks };
  };
})();
