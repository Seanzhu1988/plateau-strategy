/* dc-form-indian.js: the National Museum of the American Indian, on the Mall.
 *
 * Built to MODEL_STANDARD.md. What stood here before was the generic "block"
 * form: an 80 by 40 metre box with four flat sides. The one fact everybody
 * publishes about this building is that it has no straight edge anywhere on
 * it, so a box is not a rough version of this museum, it is the opposite of
 * it. STYLES.md has no entry for the idiom; the style is named at the bottom
 * of this header and its tells are listed there, because a model may not be
 * drawn in a style nobody has written down.
 *
 * WHICH BUILDING. The curvilinear Kasota limestone building by Douglas
 * Cardinal (Blackfoot), opened 21 September 2004, east of the Air and Space
 * Museum, facing the Capitol. NOT the George Gustav Heye Center, which
 * carries the same museum name and is Cass Gilbert's 1907 Beaux-Arts Custom
 * House in Lower Manhattan. Any source quoting marble columns, a 1907 date,
 * 450,000 sq ft or a $7 million cost is describing the other building.
 *
 * ============================ RESEARCH ============================
 * Every number below carries the URL it was read from this run. Numbers that
 * are not published are in the NAMED GAPS list and are never quietly filled.
 *
 * PUBLISHED (Smithsonian Architecture Fact Sheet, 2014, quoted verbatim,
 * https://americanindian.si.edu/sites/1/files/pdf/press_releases/NMAI-Architecture-Release-2014.pdf):
 *   - "five-story, 250,000-square foot, curvilinear building"
 *   - "the 120-foot high Potomac space devoted to contemporary Native
 *     performances"  <- THE ONLY PUBLISHED VERTICAL DIMENSION IN THE BUILDING
 *   - "4.25-acre site"
 *   - "an exterior cladding of Kasota dolomitic limestone from Minnesota,
 *     giving the building the appearance of a stratified stone mass that has
 *     been carved by wind and water"
 *   - "Forty large rocks and boulders, known as grandfather rocks"
 *   - "$199 million" construction
 * PUBLISHED (Smithsonian Mall Fact Sheet SI-59-2007,
 * https://americanindian.si.edu/sites/1/files/pdf/press_releases/nmai_mall_fact_sheet.pdf):
 *   - "textured golden-colored limestone"; the building "curvilinear and domed"
 *   - "a 120-seat circular theater located on the fourth floor" (the Lelawi)
 * PUBLISHED (Severud Associates, structural engineers,
 * https://www.severud.com/icons/the-national-mall/):
 *   - "Interconnected steel trusses, anchored to the core walls, enable the
 *     east end of the building to cantilever dramatically"
 *   - "The cantilever is capped by a steel dome with an oculus open to the
 *     heavens"
 * PUBLISHED (NBC News, https://www.nbcnews.com/id/wbna5983403):
 *   - "Its impressive overhang at the front entrance is aimed directly at the
 *     U.S. Capitol."
 *   - "eight prisms reflect the light"; "Acrylic prisms facing true south"
 * PUBLISHED (Vetter Stone, the fabricator, through stoneworld.com article
 * 83351; the page returns 403 to a direct fetch and was read through the
 * search index, so these three are flagged rather than trusted absolutely):
 *   - "there was not a straight edge on the building, and the stone split to
 *     over 50 different curves, both concave and convex"
 *   - "the rusticated fractured stone in the lower tiers to the smoother more
 *     regular stone at the top of the building, like a boulder in a rushing
 *     river"; base blocks "roughback with an unworked, unfinished face"
 *   - "over 2,400 cubic feet of cut stone", "over 25,000 cubic feet of
 *     split-faced stone"
 * PUBLISHED (Smithsonian Gardens, gardens.si.edu/gardens/native-landscape-nmai,
 * also Cloudflare-gated and read through the search index this run):
 *   - upland hardwood forest 24,000 sq ft NORTH; wetlands 6,000 sq ft EAST;
 *     cropland 5,200 sq ft SOUTHEAST; meadow 5,500 sq ft SOUTHWEST, "on both
 *     sides of the south entrance", with two American elms
 * PUBLISHED (Mineralogical Society of DC, Tim Rose, "Collecting the Cardinal
 * Stones", https://www.mineralogicalsocietyofdc.org/sites/default/files/2019-02/
 * Collecting%20the%20Cardinal%20Stones%20for%20NMAI%20Cardinal%20Stones%20-%20Tim%20Rose.pdf):
 *   - four boulders of roughly 6,000 pounds, on "radials going directly
 *     North, South, East, and West from the center of the NMAI rotunda"
 * PUBLISHED (The Globe and Mail, "Douglas Cardinal's dream",
 * https://www.theglobeandmail.com/arts/douglas-cardinals-dream/article20435849/,
 * fetched this run):
 *   - the rotunda rises "five levels - equal to a height of 12 commercial
 *     storeys", with "an oculus at its apex"
 *   - "curves as convincing in cadence as a rocky bluff, the windows cut like
 *     caves in the stone"
 *   - AND THE ONE THAT CHANGED THIS MODEL: the stone cantilever was
 *     "imagined by Cardinal to extend about twice as far as what has actually
 *     been constructed. What might have been a heroic gesture has been
 *     replaced by something that looks squat and compressed."  So the AS
 *     BUILT overhang is modest. A heroic cantilever here would be a drawing
 *     of the project Cardinal wanted, not of the building that stands.
 *
 * DISAGREEING FIGURES, recorded rather than reconciled. Floor area is
 * published three ways: 250,000 sq ft (Smithsonian, twice), "260,000 SF"
 * (SmithGroup, smithgroup.com/projects/national-museum-of-the-american-indian)
 * and "441,000-square-foot" (si.edu newsdesk factsheet, read through the
 * search index this run, its page Cloudflare-gated). Site area is published
 * as 4.25 acres (Smithsonian) and 4.5 acres (NBC News, Globe and Mail).
 * Nothing in this model depends on either, so neither is resolved here; the
 * Smithsonian's own numbers are the ones quoted above.
 *
 * ======================== PLAN, DERIVED ===========================
 * No architect publishes this building's length or width, so the plan is
 * TRACED, the method the castle and nmaahc models used. OSM way 66418605,
 * fetched through Overpass this run, source=dcgis, dcgis:captureyear 20050405,
 * building:levels=5, height=42: https://www.openstreetmap.org/way/66418605
 * 119 vertices, carried into this file verbatim in the PLAN array below, in
 * feet, in the frame described under FRAME. Everything else about the plan
 * was computed from those vertices this run:
 *   - overall extents 376.1 ft east-west by 232.8 ft north-south
 *   - footprint area by shoelace 58,423 sq ft = 1.34 acres, about 32 percent
 *     of the published 4.25 acre site
 *   - minimum-area bounding box 401.1 by 217.5 ft, its long axis 18.8 degrees
 *     north of east
 *   - THE EAST PROW: a least-squares circle through vertices 22 to 36 lands
 *     at u 153.8, v 0.0 with radius 46.9 ft, RMS residual 5.0 ft. Two things
 *     fall out of that and both are used below. First, the prow really is an
 *     arc, so the rotunda's outer wall is about 94 ft across. Second, its
 *     centre sits on the anchor's own latitude, 153.8 ft east of the
 *     dc-3d.js place coordinate, which gives this model a MEASURED rotunda
 *     centre and therefore a real origin for the four Cardinal stones.
 *   - THE WEST END: circle through vertices 78 to 96, radius 122.0 ft, RMS
 *     6.2 ft. A far gentler sweep than the prow, which is what photographs
 *     show.
 *   - THE NORTH FACADE, the Mall side: a circle through vertices 0 to 20 has
 *     radius 727 ft, RMS 3.0 ft, and the traced edge wanders between v 62.6
 *     and 69.9, a 7.3 ft bow over a 380 ft run. Not straight, and the fact
 *     that it is not straight is the building.
 *   - THE SOUTH EAST EDGE fits no single circle (RMS 20 ft over vertices 40
 *     to 70), so it is a compound curve and is drawn from the trace alone.
 *   - THE ENTRANCE BEARING: from the derived rotunda centre to the Capitol's
 *     own dc-3d.js coordinate is 14.81 degrees north of east, over 2,026 ft.
 *     The published claim that the overhang aims at the Capitol is therefore
 *     CHECKED here rather than assumed, the way the Vietnam memorial's arms
 *     were. The entrance recess is centred on that derived bearing.
 *
 * ==================== HEIGHT, AND WHAT IS OWED ====================
 * THE OVERALL EXTERIOR HEIGHT IS NOT PUBLISHED. Not in either Smithsonian
 * fact sheet, not on americanindian.si.edu, not on djcarchitect.com, not on
 * SmithGroup's or Severud's project pages, not in Wikipedia, and Wikidata
 * Q1075141 carries no height property. It is a gap, and it is the gap the
 * standard cares most about.
 * What bounds it: the Potomac is published at 120 ft floor to dome, INSIDE,
 * so the exterior top of the dome is necessarily above 120 ft = 36.6 m.
 * What measures it: the OSM/dcgis tag height=42. OSM heights default to
 * METRES, and rather than assume that, the unit was checked this run against
 * a control on the same import: the Jamie L. Whitten Building, source=dcgis,
 * building:levels=5, carries height=18.14, which is impossible in feet for a
 * five storey building and correct at 18.14 m. So 42 is metres, 137.8 ft, a
 * lidar-derived roof figure that MAY INCLUDE ROOFTOP PLANT.
 * SkyscraperPage lists "Roof: 120 ft" and marks it Unconfirmed; 120 ft is
 * exactly the published INTERIOR atrium figure, so that entry is almost
 * certainly the interior number copied onto the roof line and it is not used.
 * THIS MODEL takes 137.8 ft as the top of the DOME, the building's highest
 * point, and scales so that lands on p.h. The alternative reading, that 42 m
 * is a roof including plant and the dome is a few feet lower, is not
 * resolved and is left in the gaps.
 * PLACE HEIGHT CORRECTION OWED, and not made here because this run may touch
 * no shared file: dc-3d.js carries { k: "indian", ... h: 30, form: "block" }.
 * 30 m is 98.4 ft, BELOW the published 120 ft interior atrium, so it is wrong
 * in the one direction the standard forbids. It should read h: 42 on the
 * measured figure, and can be no less than 37 on the published floor alone.
 * form: "block" is also wrong for a building whose defining fact is that it
 * has no straight edge; with this file registered the form field is unused
 * for "indian", but it should not say "block".
 *
 * ========================= NAMED GAPS =============================
 * Guessed nowhere. Every item below is either drawn from an assumption that
 * is stated on its own line in the code, or not drawn at all.
 *   - OVERALL EXTERIOR HEIGHT: see above. Measured, not published.
 *   - PARAPET HEIGHT of the stone mass: not published. Drawn 96 ft, which is
 *     the five published storeys at 19.2 ft each and is forced to sit below
 *     the published 120 ft atrium crown, since the rotunda breaks above the
 *     roof. An assumption inside two published bounds.
 *   - STRATA: the fabricator publishes a rough-to-smooth GRADING and "over 50
 *     different curves" but no course height and no band count. Six bands
 *     plus a cap are drawn, their step in and out an assumption.
 *   - POTOMAC ROTUNDA DIAMETER is not published. A "120 feet in diameter"
 *     claim circulates on low quality sites; it is refused twice over, for
 *     having no primary source and for disagreeing with the measured plan.
 *     The rotunda is drawn on the DERIVED 46.9 ft outer arc.
 *   - DOME span, rise, oculus diameter and exterior material are not
 *     published; only that it is "a steel dome with an oculus". Drawn on a
 *     40 ft radius from the derived prow arc less an assumed wall, rising to
 *     the measured top. The 40 ft dome cited by I+S Design belongs to the
 *     Lelawi Theater's projection dome on the fourth floor, a different
 *     object, and is not borrowed for the Potomac.
 *   - CANTILEVER PROJECTION is described and never dimensioned. Drawn as a
 *     12 ft recess under bands that oversail it, deliberately modest on the
 *     Globe and Mail's "squat and compressed".
 *   - ENTRANCE ARC: not published. Taken as the traced segments 23 to 30,
 *     an 87 ft chord across the prow, selected by their own outward normals
 *     lying within 42 degrees of the derived Capitol bearing.
 *   - GLAZING: no published area, bay count or mullion spacing anywhere.
 *     Only the published east entrance and the published eight south prisms
 *     are drawn. No window grid is invented, so most of this envelope is
 *     blank stone, which is also what photographs show.
 *   - PRISM GEOMETRY: eight, facing true south, is the whole publication.
 *     Their size and position on the wall are assumed.
 *   - ROOF: no published treatment, pitch, parapet height, plant or skylight
 *     other than the domed one. Drawn flat behind a parapet, with nothing on
 *     it, and that is a gap rather than a claim.
 *   - SITE SHAPE: the 4.25 acres is published and the trapezoid is not
 *     dimensioned. Drawn as a 500 by 370 ft rectangle, which is 185,000 sq
 *     ft, the published 4.25 acres to within 0.1 percent.
 *   - HABITAT SHAPES AND POSITIONS: the four areas and their compass sides
 *     are published, the outlines are not. Drawn as rectangles of the
 *     published areas on the published sides.
 *   - GRANDFATHER ROCKS: forty is published, sizes and positions are not.
 *     Forty are drawn, scattered by a fixed pseudo-random sequence and
 *     rejected if they fall inside the traced footprint.
 *   - CARDINAL STONES: the radial rule and the 6,000 lb weight are published,
 *     the distances are not. Drawn on the derived rotunda centre's true N, S,
 *     E and W radials at the site edge. The reported "7th Street" location
 *     for the western stone is inconsistent with this site and is not used.
 *   - TREES: "more than 27,000 trees, shrubs, and herbaceous plants
 *     representing 145 species" is published and undrawable. The forest
 *     canopy here is a drawing device with no count claimed. The two American
 *     elms in the meadow ARE published as two, and two are drawn.
 *   - WATER: a waterfall, a "manufactured stream" and pools are described and
 *     none is dimensioned. A strip of open water is drawn inside the
 *     published wetland rectangle and claims nothing more.
 *   - BELOW GRADE LEVELS: "five-story" is above ground; nothing found below.
 *   - NOT READ: "Conservation of the Exterior of the National Museum of the
 *     American Indian Building", Smithsonian Contributions to Museum
 *     Conservation no. 6 (2017), doi 10.5479/si.19492367.6, is almost
 *     certainly the best source on this stone that exists. Every route to it
 *     returned 403 this run. A run with access should read it first.
 *
 * ===================== THE STYLE, NAMED ===========================
 * "The wind-carved cliff": organic curvilinear, Douglas Cardinal's
 * expressionist idiom, descended from Frank Lloyd Wright and European
 * Expressionism by way of Steiner. STYLES.md has no entry for it and this run
 * is forbidden to edit that file, so the tells the model is built on are
 * listed here and the entry is OWED:
 *   - THERE IS NO STRAIGHT LINE AND NO CORNER. Every plan edge is an arc and
 *     the radius changes continuously. A visible flat facet in silhouette is
 *     a failure. This is why the model draws all 119 traced vertices rather
 *     than a tidied polygon.
 *   - THE MASS IS ERODED, NOT ASSEMBLED. Rough random blocks low, smooth
 *     regular courses high: the exact inverse of classical rustication, where
 *     rough stone is a decorous base under a refined order. Here it is
 *     weathering, not decorum.
 *   - STRATA ARE THE ONLY HORIZONTALS. No cornice, no string course, no
 *     water table. The wall's breaks are bedding planes that step out and in
 *     as they rise, like a bluff.
 *   - THE MASS LEANS AND OVERHANGS at the entrance. Masonry gets narrower as
 *     it rises; this gets wider and hangs over you.
 *   - ONE STONE, ONE COLOUR, ALL OVER. No contrasting trim, no second stone
 *     at the plinth. Only finish varies, so texture and shading carry the
 *     whole reading.
 *   - THE ORIENTATION IS COSMOLOGICAL, NOT AXIAL. East to the sunrise, prisms
 *     to true south, the dome open to the sky, four stones on true radials.
 *   - THE GROUND IS PART OF THE BUILDING. Two thirds of the site is not wall.
 *   - WRONG IF it is symmetrical, or has a facade with bays, or a front door
 *     on a centre line with anything ranked either side of it.
 *
 * ============================ FRAME ===============================
 * u runs east, v runs north, z up, all in FEET, origin at the dc-3d.js place
 * coordinate 38.88830, -77.01660. The derived rotunda centre is at u 153.8,
 * v 0.0 in this frame. FT converts feet to the host's units so that the
 * measured 137.8 ft top lands exactly on p.h.
 *
 * ============================ PAINT ===============================
 * Three traps are designed for rather than discovered.
 *   1. THE ROOF is one 58,000 sq ft plane and cannot sort on its own corners
 *      against the things standing on it. Explicit depth, far below the mass.
 *   2. THE FAR SIDE'S LEDGES. Every horizontal strip between two bands is
 *      culled by the same test as the wall segment it belongs to, because a
 *      ledge on the far side is hidden by the building's own mass and drawn
 *      unculled it paints across the roof. That is the NMAAHC lesson.
 *   3. THE ENTRANCE RECESS is a hole, and a hole is only a hole from the side
 *      you can see into. The whole cave assembly, glass, soffit and jambs, is
 *      gated on the derived entrance bearing facing the camera, which is the
 *      Hirshhorn balcony's lesson. When it is gated off the same segments are
 *      drawn as ordinary stone, so no hole is ever left in the wall.
 * Seams: abutting quads round apart under toFixed(1), which is how the
 * Hirshhorn roof got its starburst and the Vietnam bank its ladder of
 * stripes. Every band and strip is stroked in its own fill colour, and the
 * horizontal strips also overrun their neighbour slightly.
 */
(function () {
  var H = window.DC3D.helpers;
  window.DC_FORMS = window.DC_FORMS || {};
  window.DC_FORMS['indian'] = function (ctx, p, s, VE) {
    var P = ctx.project, items = [];

    /* the traced plan, OSM way 66418605, feet, u east and v north from the
       dc-3d.js place coordinate. 119 vertices, clockwise. */
    var PLAN = [
      -103.5,65.5, -94.1,67.2, -83.4,65.6, -77.5,62.6, -67.6,66.4, -56.0,67.0,
      -48.3,64.8, -36.8,67.7, -25.2,67.5, -15.3,65.0, -5.3,68.3, 7.2,67.7,
      17.8,64.4, 33.3,67.6, 46.7,69.9, 64.1,69.4, 78.1,68.6, 117.9,66.2,
      124.2,65.8, 130.5,64.9, 136.5,64.1, 147.2,59.0, 157.4,53.3, 159.1,52.4,
      169.7,43.9, 180.4,30.0, 182.7,26.1, 190.8,12.7, 196.4,-0.8, 199.1,-13.6,
      199.2,-21.6, 198.4,-25.6, 196.7,-27.9, 195.8,-29.1, 191.7,-31.7,
      176.4,-37.2, 158.1,-41.8, 150.2,-44.2, 147.7,-47.5, 140.3,-51.2,
      132.2,-52.7, 123.7,-52.6, 112.3,-52.3, 98.9,-55.6, 91.9,-62.2,
      83.3,-70.0, 73.9,-75.3, 68.3,-77.2, 60.7,-78.4, 50.4,-79.0, 38.7,-78.9,
      29.6,-81.1, 23.3,-84.4, 20.8,-87.7, 15.3,-92.2, 9.8,-96.7, 2.8,-99.8,
      -6.3,-101.1, -13.5,-102.3, -17.7,-104.0, -21.9,-105.7, -31.9,-110.3,
      -38.3,-114.0, -41.9,-116.1, -48.4,-119.4, -54.4,-120.6, -59.3,-120.9,
      -66.3,-121.4, -75.8,-124.0, -84.1,-129.0, -90.5,-133.4, -97.7,-136.5,
      -106.8,-138.9, -122.8,-142.2, -138.4,-147.5, -146.8,-150.5, -153.8,-153.9,
      -159.6,-157.6, -164.5,-158.5, -170.0,-157.6, -174.2,-154.5, -176.7,-149.5,
      -176.9,-142.7, -176.1,-134.4, -174.1,-125.0, -173.3,-112.6, -174.0,-104.1,
      -175.8,-94.5, -176.9,-85.1, -176.4,-75.9, -173.6,-67.5, -173.8,-58.6,
      -176.0,-52.7, -176.6,-43.5, -176.0,-36.2, -174.5,-30.7, -175.2,-21.2,
      -174.3,-13.1, -176.3,-3.9, -176.0,5.9, -174.5,12.9, -176.0,21.4,
      -175.6,32.3, -173.3,40.4, -169.4,47.7, -168.1,50.3, -166.2,54.4,
      -164.5,56.6, -162.0,59.0, -162.0,65.7, -161.5,67.6, -161.0,69.7,
      -157.7,72.8, -153.2,74.3, -144.3,72.6, -136.8,71.3, -129.5,70.0,
      -124.1,65.8, -114.6,65.0
    ];
    var NV = PLAN.length / 2;

    /* ---------- scale ---------- */
    var TOP = 137.8;                 /* 42 m measured, the dome's apex */
    var FT  = (p.h * VE) / TOP;      /* host units per foot */
    var m   = FT * s;
    function pt(u, v, z) { return P(p.x + u * m, p.y + v * m, z * FT); }
    function W(u, v) { return [p.x + u * m, p.y + v * m]; }

    /* ---------- published and derived geometry, in feet ---------- */
    var PARA   = 96;                 /* parapet, assumption inside two bounds */
    var ROT_U  = 153.8, ROT_V = 0.0; /* DERIVED: circle fit to the east prow */
    var ROT_R  = 46.9;               /* DERIVED: that fit's radius */
    var DOME_R = 40;                 /* ROT_R less an assumed 7 ft of wall */
    var DRUM0  = 93, DRUM1 = 108;    /* assumption: the drum under the dome */
    var OCU_R  = 6.5;                /* the published oculus, size assumed */
    var ENT    = 14.81 * Math.PI / 180;  /* DERIVED bearing to the Capitol */
    var ENT_HALF = 42 * Math.PI / 180;   /* assumption: the entrance arc */
    var RECESS = -13;                /* assumption: the modest as-built cave */
    var CAVE_Z = 47;                 /* assumption: the glazed cave's head */

    /* ---------- materials. One stone, graded rough to smooth, which is
           published; ctx.shade gives each of them its two faces. ---------- */
    var ROUGH  = "#bda072";   /* the rusticated fractured lower tiers */
    var MID    = "#c9ad7d";
    var SMOOTH = "#d5bc8e";   /* the smoother regular stone at the top */
    var CAP    = "#dcc79c";   /* the crowning course */
    var LEDGE  = "#e0cda6";   /* a bedding plane catching the sky */
    var SOFF   = "#8a7351";   /* the underside where a bed oversails */
    var SHELL  = "#6b5a3f";   /* the far side, seen only as closed mass */
    /* No roof material is published. It is drawn as a neutral membrane and
       deliberately NOT as stone: at the wall's own tone the largest surface in
       the model read as one more course of the cliff lying flat. */
    var ROOFC  = "#9a9384";
    var DOMEC  = "#c8c0ad";   /* the steel dome: exterior finish not published */
    var GLASS  = "#2f3b45";   /* "the windows cut like caves in the stone" */
    var MULL   = "#4d5c66";
    var PRISM  = "#7d94a0";
    var FOREST = "#7d9463";
    var CANOPY = "#5f7c4c";
    var TRUNK  = "#6a5844";
    var MARSH  = "#94a67f";
    var WATER  = "#9db6bf";
    var CROP   = "#bcb47f";
    var MEADOW = "#adba86";
    var ROCK   = "#8f8b81";
    var GRANIT = "#7c7870";

    /* ---------- small helpers ---------- */
    function push(q, fill, nx, ny, nz, bias, depth) {
      var f = ctx.shade(fill, nx, ny, nz || 0);
      items.push({ svg: ctx.poly(q, f, f, 0.6),
                   depth: depth === undefined ? H.depthOf(q) + (bias || 0) : depth });
    }
    function V(i) { i = ((i % NV) + NV) % NV; return [PLAN[i * 2], PLAN[i * 2 + 1]]; }

    /* Outward offset of the traced polygon. The trace is CLOCKWISE, verified
       by shoelace this run (signed area negative), so the outward normal of
       an edge (dx,dy) is (-dy,dx). Offsets here are all NEGATIVE, i.e. inset,
       because the trace is the building's widest extent and every band lives
       inside it. Mitres are clamped so a tight vertex cannot throw a spike. */
    var OFFC = {};
    function poly(d) {
      var key = d.toFixed(2);
      if (OFFC[key]) return OFFC[key];
      var out = [];
      for (var i = 0; i < NV; i++) {
        var a = V(i - 1), b = V(i), c = V(i + 1);
        var e1u = b[0] - a[0], e1v = b[1] - a[1], L1 = Math.hypot(e1u, e1v) || 1;
        var e2u = c[0] - b[0], e2v = c[1] - b[1], L2 = Math.hypot(e2u, e2v) || 1;
        var n1u = -e1v / L1, n1v = e1u / L1;
        var n2u = -e2v / L2, n2v = e2u / L2;
        var su = n1u + n2u, sv = n1v + n2v, L = Math.hypot(su, sv);
        if (L < 1e-6) { su = n2u; sv = n2v; L = 1; }
        su /= L; sv /= L;
        var k = 1 / Math.max(su * n2u + sv * n2v, 0.34);
        if (k > 3) k = 3;
        out.push([b[0] + su * d * k, b[1] + sv * d * k]);
      }
      OFFC[key] = out;
      return out;
    }
    /* the outward normal of segment i, on the traced polygon */
    function segN(i) {
      var a = V(i), b = V(i + 1);
      var du = b[0] - a[0], dv = b[1] - a[1], L = Math.hypot(du, dv) || 1;
      return [-dv / L, du / L];
    }
    function segMid(i) {
      var a = V(i), b = V(i + 1);
      return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    }
    /* the entrance segments: their own outward normal within the assumed arc
       of the DERIVED Capitol bearing, and on the prow rather than anywhere
       else the wall happens to face east. Segments 23 to 30, an 87 ft chord. */
    function isEnt(i) {
      var n = segN(i), md = segMid(i);
      var da = Math.atan2(n[1], n[0]) - ENT;
      while (da > Math.PI) da -= Math.PI * 2;
      while (da < -Math.PI) da += Math.PI * 2;
      return Math.abs(da) <= ENT_HALF &&
             Math.hypot(md[0] - ROT_U, md[1] - ROT_V) < 62;
    }
    var entShows = ctx.faceVisible(Math.cos(ENT), Math.sin(ENT));

    /* ---------- 1. the ground, all of it under the fit's floor ----------
       The published 4.25 acres as a 500 by 370 ft rectangle, then the four
       published habitats on their published sides. Everything here sorts
       below -1e9+1.5 so a 4 acre site cannot shrink the museum to a speck,
       which is the fit mistake the Hirshhorn plaza made once already. */
    function pad(u0, v0, u1, v1, z, fill, depth) {
      var q = [pt(u0, v0, z), pt(u1, v0, z), pt(u1, v1, z), pt(u0, v1, z)];
      var f = ctx.shade(fill, 0, 0, 1);
      items.push({ svg: ctx.poly(q, f, f, 0.6), depth: depth });
    }
    pad(-239, -227, 261, 143, 0.02, LAWNC, -1e9 + 1.00);   /* 500 x 370 = 4.25 acres */
    pad(-190, 76, 210, 136, 0.06, FOREST, -1e9 + 1.10);    /* 24,000 sq ft, north */
    pad(208, -75, 248, 75, 0.06, MARSH, -1e9 + 1.12);      /* 6,000 sq ft, east */
    pad(218, -55, 238, 55, 0.08, WATER, -1e9 + 1.14);      /* the stream, size a gap */
    pad(95, -140, 175, -75, 0.06, CROP, -1e9 + 1.16);      /* 5,200 sq ft, southeast */
    pad(-120, -200, -20, -172, 0.06, MEADOW, -1e9 + 1.18); /* 5,500 sq ft of meadow, */
    pad(-238, -160, -186, -108, 0.06, MEADOW, -1e9 + 1.19);/* in two, "on both sides" */

    /* ---------- 2. the stone mass ----------
       Six bands and a cap. The offsets step in and out as they rise, which is
       what a bluff does and what "stratified stone mass carved by wind and
       water" describes; the step sizes are the assumption named in the gaps.
       Every band is inside the trace, so the trace stays the widest extent. */
    var BAND = [
      /* z0    z1    inset   fill  */
      [  0.0,  15.0, -1.0, ROUGH ],
      [ 15.0,  31.0, -4.5, ROUGH ],
      [ 31.0,  47.0, -2.0, MID   ],
      [ 47.0,  63.0, -5.0, MID   ],
      [ 63.0,  79.0, -1.5, SMOOTH],
      [ 79.0,  93.0, -4.0, SMOOTH],
      [ 93.0,  PARA, -0.5, CAP   ]
    ];

    /* one band's wall, per segment, culled per segment, stroked in its own
       colour so 119 abutting quads cannot round apart into hairlines */
    function bandWall(bi) {
      var b = BAND[bi], A = poly(b[2]), R = poly(RECESS);
      for (var i = 0; i < NV; i++) {
        var n = segN(i);
        if (!ctx.faceVisible(n[0], n[1])) continue;
        var cave = entShows && bi <= 2 && isEnt(i);
        var Q = cave ? R : A;
        var a = Q[i], c = Q[(i + 1) % NV];
        var z0 = b[0], z1 = b[1];
        if (cave) z1 = Math.min(z1, CAVE_Z);
        push([pt(a[0], a[1], z0), pt(c[0], c[1], z0),
              pt(c[0], c[1], z1), pt(a[0], a[1], z1)],
             cave ? GLASS : b[3], n[0], n[1], 0, cave ? 0.4 : 0);
      }
    }

    /* the horizontal strip between two bands. Where the upper band is more
       inset it is a LEDGE and faces the sky; where it oversails it is a
       SOFFIT and faces the ground, and without it a slot of background shows
       through under every projecting bed. Culled with its own wall segment,
       because a ledge on the far side is behind the building's own mass and
       drawn unculled it paints straight across the roof. */
    function strip(dLo, dHi, z, upFill, downFill) {
      var A = poly(dLo), B = poly(dHi);
      var ledge = dHi < dLo;                    /* upper more inset: faces up */
      for (var i = 0; i < NV; i++) {
        var n = segN(i);
        if (!ctx.faceVisible(n[0], n[1])) continue;
        var i1 = (i + 1) % NV, i2 = (i + 2) % NV;
        /* overrun the neighbour by a fraction of a segment: abutting quads
           round apart under toFixed and leave a ladder of pale seams */
        var oA = [A[i1][0] + (A[i2][0] - A[i1][0]) * 0.06,
                  A[i1][1] + (A[i2][1] - A[i1][1]) * 0.06];
        var oB = [B[i1][0] + (B[i2][0] - B[i1][0]) * 0.06,
                  B[i1][1] + (B[i2][1] - B[i1][1]) * 0.06];
        var q = [pt(A[i][0], A[i][1], z), pt(oA[0], oA[1], z),
                 pt(oB[0], oB[1], z), pt(B[i][0], B[i][1], z)];
        push(q, ledge ? upFill : downFill, 0, 0, ledge ? 1 : -1,
             ledge ? 0.9 : 0.5);
      }
    }

    for (var bi = 0; bi < BAND.length; bi++) {
      bandWall(bi);
      if (bi + 1 < BAND.length) {
        strip(BAND[bi][2], BAND[bi + 1][2], BAND[bi][1], LEDGE, SOFF);
      }
    }

    /* ---------- 3. the entrance: a cave under a modest overhang ----------
       Gated whole on the derived bearing facing the camera. Bands 0 to 2 have
       already been drawn recessed above; what is left is the soffit that
       roofs the cave and the two jambs that stop daylight showing straight
       through the wall at the ends of the opening, which is exactly the hole
       the Hirshhorn balcony left the first time. */
    if (entShows) {
      var Rp = poly(RECESS), Ap = poly(BAND[3][2]);
      var lo = -1, hi = -1;
      for (var ei = 0; ei < NV; ei++) {
        if (!isEnt(ei)) continue;
        if (lo < 0) lo = ei;
        hi = ei;
      }
      if (lo >= 0) {
        for (var ej = lo; ej <= hi; ej++) {
          var j1 = (ej + 1) % NV, j2 = (ej + 2) % NV;
          var rA = Rp[ej], rB = Rp[j1], sA = Ap[ej], sB = Ap[j1];
          var rBo = [rB[0] + (Rp[j2][0] - rB[0]) * 0.06, rB[1] + (Rp[j2][1] - rB[1]) * 0.06];
          var sBo = [sB[0] + (Ap[j2][0] - sB[0]) * 0.06, sB[1] + (Ap[j2][1] - sB[1]) * 0.06];
          push([pt(rA[0], rA[1], CAVE_Z), pt(rBo[0], rBo[1], CAVE_Z),
                pt(sBo[0], sBo[1], CAVE_Z), pt(sA[0], sA[1], CAVE_Z)],
               SOFF, 0, 0, -1, 0.7);
        }
        /* the jambs. A jamb is a plane and which face you see depends on
           which end of the opening you stand at, so both signs are tried,
           the lesson the Hirshhorn's far jamb taught. */
        [[lo, 1], [hi + 1, -1]].forEach(function (e) {
          var idx = ((e[0] % NV) + NV) % NV;
          var a = V(idx);
          var du = a[0] - ROT_U, dv = a[1] - ROT_V, L = Math.hypot(du, dv) || 1;
          var nu = -dv / L * e[1], nv2 = du / L * e[1];
          if (!ctx.faceVisible(nu, nv2)) { nu = -nu; nv2 = -nv2; }
          if (!ctx.faceVisible(nu, nv2)) return;
          var rp = Rp[idx], ap = poly(BAND[0][2])[idx];
          push([pt(rp[0], rp[1], 0), pt(ap[0], ap[1], 0),
                pt(ap[0], ap[1], CAVE_Z), pt(rp[0], rp[1], CAVE_Z)],
               SOFF, nu, nv2, 0, 0.6);
        });
      }
    }

    /* ---------- 4. the eight prisms, published as eight and facing true
           south. Size and position on the wall are assumed; the COUNT and the
           orientation are the published facts, so eight objects are drawn on
           the south-facing segments beside the rotunda. ---------- */
    (function () {
      var cand = [];
      for (var i = 0; i < NV; i++) {
        var n = segN(i), md = segMid(i);
        if (n[1] > -0.72) continue;              /* within 44 deg of due south */
        if (md[0] < 95 || md[0] > 185) continue; /* beside the Potomac */
        cand.push(i);
      }
      if (!cand.length) return;
      var A = poly(BAND[4][2]);
      for (var k = 0; k < 8; k++) {
        var i2 = cand[Math.round(k * (cand.length - 1) / 7)];
        var n2 = segN(i2);
        if (!ctx.faceVisible(n2[0], n2[1])) continue;
        var a = A[i2], b = A[(i2 + 1) % NV];
        var mu = a[0] + (b[0] - a[0]) * 0.5, mv = a[1] + (b[1] - a[1]) * 0.5;
        var tu = (b[0] - a[0]), tv = (b[1] - a[1]);
        var tl = Math.hypot(tu, tv) || 1; tu /= tl; tv /= tl;
        var hw = 2.2;
        push([pt(mu - tu * hw + n2[0] * 0.5, mv - tv * hw + n2[1] * 0.5, 66),
              pt(mu + tu * hw + n2[0] * 0.5, mv + tv * hw + n2[1] * 0.5, 66),
              pt(mu + tu * hw + n2[0] * 0.5, mv + tv * hw + n2[1] * 0.5, 74),
              pt(mu - tu * hw + n2[0] * 0.5, mv - tv * hw + n2[1] * 0.5, 74)],
             PRISM, n2[0], n2[1], 0, 1.6);
      }
    })();

    /* ---------- 5. the roof, behind its parapet ----------
       One 58,000 sq ft plane. It cannot sort against the things standing on
       it, so its depth is explicit and far below the mass. No published roof
       treatment was found, so it carries nothing, and that is a gap rather
       than a claim. */
    (function () {
      var A = poly(-3.5);
      var q = A.map(function (c) { return pt(c[0], c[1], PARA - 1.5); });
      var f = ctx.shade(ROOFC, 0, 0, 1);
      items.push({ svg: ctx.poly(q, f, f, 0.6), depth: H.depthOf(q) - 5000 });
      /* the parapet's own top: a thin lit strip, its own slab, the last
         horizontal break the building has */
      strip(BAND[6][2], -3.5, PARA, CAP, SOFF);
    })();

    /* ---------- 6. the dome on its drum, with the published oculus ----------
       "The cantilever is capped by a steel dome with an oculus open to the
       heavens." Span, rise, oculus and exterior material are all gaps; what
       is drawn is a 40 ft radius from the DERIVED prow arc, rising to the
       measured top. */
    (function () {
      var N = 40;
      function ring(r0, r1, z0, z1, fill, bias) {
        for (var i = 0; i < N; i++) {
          var a0 = (i / N) * Math.PI * 2, a1 = ((i + 1.06) / N) * Math.PI * 2;
          var am = (a0 + a1) / 2;
          var nx = Math.cos(am), ny = Math.sin(am);
          if (!ctx.faceVisible(nx, ny)) continue;
          push([pt(ROT_U + r0 * Math.cos(a0), ROT_V + r0 * Math.sin(a0), z0),
                pt(ROT_U + r0 * Math.cos(a1), ROT_V + r0 * Math.sin(a1), z0),
                pt(ROT_U + r1 * Math.cos(a1), ROT_V + r1 * Math.sin(a1), z1),
                pt(ROT_U + r1 * Math.cos(a0), ROT_V + r1 * Math.sin(a0), z1)],
               fill, nx, ny, (z1 - z0) > 0 ? 0.25 : 0, bias || 0);
        }
      }
      function annulus(rOut, rIn, z, fill, bias) {
        for (var i = 0; i < N; i++) {
          var a0 = (i / N) * Math.PI * 2, a1 = ((i + 1.06) / N) * Math.PI * 2;
          var q = [pt(ROT_U + rOut * Math.cos(a0), ROT_V + rOut * Math.sin(a0), z),
                   pt(ROT_U + rOut * Math.cos(a1), ROT_V + rOut * Math.sin(a1), z),
                   pt(ROT_U + rIn * Math.cos(a1), ROT_V + rIn * Math.sin(a1), z),
                   pt(ROT_U + rIn * Math.cos(a0), ROT_V + rIn * Math.sin(a0), z)];
          push(q, fill, 0, 0, 1, bias || 0);
        }
      }
      /* the drum, standing on the roof */
      ring(DOME_R + 2, DOME_R + 2, DRUM0, DRUM1, CAP, 0);
      annulus(DOME_R + 2.6, DOME_R + 2, DRUM1, LEDGE, 0.4);   /* its cornice band */
      /* the dome: an ellipsoidal cap, seven courses, each its own ring so the
         far side sorts before the near side and the oculus stays a hole */
      var STEPS = 7, RISE = TOP - DRUM1;
      var prevR = DOME_R, prevZ = DRUM1;
      for (var i = 0; i < STEPS; i++) {
        var f1 = (i + 1) / STEPS;
        var r1 = Math.max(OCU_R, DOME_R * Math.sqrt(Math.max(0, 1 - f1 * f1)));
        var z1 = DRUM1 + RISE * f1;
        ring(prevR, r1, prevZ, z1, DOMEC, 0.2 * i);
        prevR = r1; prevZ = z1;
      }
      /* the oculus: a rim, then the hole, sunk below it so it reads as open */
      annulus(prevR + 1.2, OCU_R, prevZ, DOMEC, 2.0);
      var hole = [];
      for (var j = 0; j < N; j++) {
        var aj = (j / N) * Math.PI * 2;
        hole.push(pt(ROT_U + OCU_R * Math.cos(aj), ROT_V + OCU_R * Math.sin(aj), prevZ - 4));
      }
      items.push({ svg: ctx.poly(hole, "#2b3138", "#2b3138", 0.6),
                   depth: H.depthOf(hole) + 2.4 });
    })();

    /* ---------- 7. the ground shadow. Nothing here casts light, so a
           137 ft mass with no shadow floats. ---------- */
    (function () {
      var A = poly(-1.0), fp = [];
      for (var i = 0; i < NV; i += 2) fp.push(W(A[i][0], A[i][1]));
      items.push(H.shadow(ctx, fp, PARA * FT));
    })();

    /* ---------- 8. forty grandfather rocks, four cardinal stones, trees ----
       The forty is published and the positions are not, so they are scattered
       by a fixed sequence and rejected where they fall inside the traced
       footprint. The four cardinal stones ARE placed by a published rule:
       true N, S, E and W radials from the centre of the rotunda, which this
       file has DERIVED at u 153.8, v 0.0 rather than assumed. */
    function inPlan(u, v) {
      var c = false;
      for (var i = 0, j = NV - 1; i < NV; j = i++) {
        var a = V(i), b = V(j);
        if ((a[1] > v) !== (b[1] > v) &&
            u < (b[0] - a[0]) * (v - a[1]) / (b[1] - a[1]) + a[0]) c = !c;
      }
      return c;
    }
    function boulder(u, v, r, hgt, fill) {
      var K = 7, top = [];
      for (var i = 0; i < K; i++) {
        var a0 = (i / K) * Math.PI * 2, a1 = ((i + 1) / K) * Math.PI * 2;
        var r0 = r * (0.78 + 0.22 * ((i * 7) % 5) / 4);
        var r1 = r * (0.78 + 0.22 * (((i + 1) * 7) % 5) / 4);
        var nx = Math.cos((a0 + a1) / 2), ny = Math.sin((a0 + a1) / 2);
        top.push([u + r0 * 0.66 * Math.cos(a0), v + r0 * 0.66 * Math.sin(a0)]);
        if (!ctx.faceVisible(nx, ny)) continue;
        push([pt(u + r0 * Math.cos(a0), v + r0 * Math.sin(a0), 0),
              pt(u + r1 * Math.cos(a1), v + r1 * Math.sin(a1), 0),
              pt(u + r1 * 0.66 * Math.cos(a1), v + r1 * 0.66 * Math.sin(a1), hgt),
              pt(u + r0 * 0.66 * Math.cos(a0), v + r0 * 0.66 * Math.sin(a0), hgt)],
             fill, nx, ny, 0.2, 0.3);
      }
      var tq = top.map(function (c) { return pt(c[0], c[1], hgt); });
      push(tq, fill, 0, 0, 1, 0.5);
    }
    (function () {
      var seed = 20040921;   /* the opening date, so the scatter is fixed */
      function rnd() { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }
      var placed = 0, tries = 0;
      while (placed < 40 && tries < 4000) {
        tries++;
        var u = -232 + rnd() * 486, v = -220 + rnd() * 356;
        if (inPlan(u, v)) continue;
        if (Math.abs(u - 11) < 205 && Math.abs(v + 42) < 128 && inPlan(u, v)) continue;
        var d = 1e9;
        for (var i = 0; i < NV; i++) {
          var a = V(i);
          d = Math.min(d, Math.hypot(a[0] - u, a[1] - v));
        }
        if (d < 14) continue;          /* not jammed against the wall */
        boulder(u, v, 2.6 + rnd() * 2.4, 1.8 + rnd() * 1.8, ROCK);
        placed++;
      }
    })();
    /* the four cardinal stones, on the derived rotunda centre's true radials.
       About 6,000 lb of granite is roughly a 3.3 ft cube, so they are drawn
       at that size; the DISTANCES out along each radial are not published. */
    [[ROT_U, ROT_V + 105], [ROT_U, ROT_V - 120],
     [ROT_U + 78, ROT_V], [-212, ROT_V]].forEach(function (c) {
      boulder(c[0], c[1], 3.4, 3.0, GRANIT);
    });
    /* the published upland hardwood forest on the north side. The plant count
       is published at more than 27,000 and is undrawable, so the canopy here
       is a drawing device and claims no count. The two American elms in the
       meadow ARE published as two. */
    function tree(u, v, hgt, r, fill) {
      var K = 8, ring = [];
      for (var i = 0; i < K; i++) {
        var a = (i / K) * Math.PI * 2;
        ring.push([u + r * Math.cos(a), v + r * Math.sin(a)]);
      }
      push([pt(u - 0.8, v, 0), pt(u + 0.8, v, 0),
            pt(u + 0.8, v, hgt * 0.55), pt(u - 0.8, v, hgt * 0.55)],
           "#6a5844", 0, -1, 0, 0.2);
      for (var k = 0; k < 3; k++) {
        var rr = r * (1 - k * 0.3), zz = hgt * (0.55 + 0.15 * k);
        var q = ring.map(function (c) {
          return pt(u + (c[0] - u) * (rr / r), v + (c[1] - v) * (rr / r), zz);
        });
        push(q, fill, 0, 0, 1, 0.4 + k * 0.2);
      }
    }
    (function () {
      var seed = 145;   /* the published species count, used only as a seed */
      function rnd() { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }
      for (var i = 0; i < 16; i++) {
        var u = -180 + rnd() * 380, v = 82 + rnd() * 48;
        tree(u, v, 34 + rnd() * 14, 12 + rnd() * 6, CANOPY);
      }
      tree(-70, -186, 46, 18, CANOPY);     /* the two published American elms, */
      tree(-212, -134, 46, 18, CANOPY);    /* one in each half of the meadow */
    })();

    return items;
  };
})();
