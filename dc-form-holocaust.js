/* dc-form-holocaust.js: the United States Holocaust Memorial Museum.
 *
 * James Ingo Freed of Pei Cobb Freed and Partners with Finegold Alexander and
 * Associates, 100 Raoul Wallenberg Place SW, dedicated 22 April 1993. NOT the
 * Miami Beach memorial, NOT Boston's, NOT Berlin's. One building with TWO
 * masses that both have to be drawn: a five-storey limestone and brick block
 * facing 14th Street, and the quasi-freestanding hexagonal Hall of Remembrance
 * over Eisenhower Plaza at the 15th Street end.
 *
 * ---------------------------------------------------------------------------
 * THE STYLE, named before any geometry was chosen, per MODEL_STANDARD.md
 * ---------------------------------------------------------------------------
 * "The limestone mask, and the brick behind it." A 1993 allusive Modernism:
 * an official limestone face turned to the ceremonial city, an industrial
 * brick and steel body behind it quoting the fabric of the camps.
 *
 * STYLES.md DOES NOT CARRY THIS STYLE, and this run is forbidden to edit that
 * shared file, so the tells this model was actually built to are restated here
 * and the missing entry is reported as an owed item:
 *   1. TWO ELEVATIONS, DELIBERATELY DIFFERENT, ON ONE BUILDING. Limestone
 *      east, south and west; red brick north. Four matching sides is the
 *      fastest way to fail this style, and it is the fault this file exists
 *      to avoid.
 *   2. THE FORMAL FACE IS A SCREEN, NOT A WALL. The 14th Street portico bows
 *      out and opens to the sky. It is drawn standing 20 ft clear of the real
 *      east wall, with the building rising into daylight above it.
 *   3. SQUARED ARCHES. Flat-headed rectangles. A round arch here would be
 *      Beaux-Arts and the century would be wrong.
 *   4. BLIND WINDOWS. On the limestone every opening is drawn as a SOLID
 *      rectangle one tone off the wall, never a dark hole; the brick face gets
 *      real recessed openings. That difference is published, not stylistic.
 *   5. OPEN CORNERS. The hexagon's walls are separate tablets with slots where
 *      the corners would be, never a closed drum.
 *   6. THE ROOFLINE CARRIES THE MEANING. Pyramid caps on brick towers, a
 *      procession of sentry boxes against the sky.
 *   7. NO ORNAMENT, NO ORDER, NO MOULDING. Plain thin horizontal bands only.
 *
 * ---------------------------------------------------------------------------
 * PUBLISHED, every line fetched and read this run
 * ---------------------------------------------------------------------------
 * Fox News fact box, https://www.foxnews.com/story/raw-data-facts-about-u-s-holocaust-memorial-museum
 *   verbatim: "The Museum is 161 feet wide, 312 feet long, 91 feet tall, and
 *   265,000 square feet in size." Also "the Permanent Exhibition occupies
 *   36,000 square feet on three floors" and "approximately $168 million".
 *
 * USHMM, https://www.ushmm.org/information/about-the-museum/architecture-and-art/exterior
 *   "On three sides - east, south, and west - it is enveloped in limestone"
 *   "A large portal fronts the 14th Street entrance to the east, bowing
 *    gracefully outward to assume a formal presence"
 *   "On the building's north side, pyramid-shaped roofs top four red-brick
 *    towers."
 *   "the semidetached, six-sided Hall of Remembrance"
 *   "The curved portico of the 14th Street entrance - with its squared arches,
 *    window grating, and cubed lights - is a mere facade, a fake screen that
 *    actually opens to the sky"
 *   "Along the north brick walls, a different perspective reveals a roofline
 *    profile of camp guard towers, a procession of sentry boxes."
 *   "Above the western entrance, a limestone mantle holds a solitary window
 *    containing 16 solid 'panes,' framed by clear glass, reversing the normal
 *    order"
 *   "Its six commanding walls, joined by open corners, appear as freestanding
 *    tablets." / "What look like windows are, instead, blocked-over blind
 *    recesses."
 *   "engages the neoclassical Bureau of Engraving and Printing to the south
 *    and the Victorian red-brick Sydney R. Yates Building to the north."
 *   photo caption: "The Museum's 15th Street entrance, on the west side. To
 *    the right is the Hall of Remembrance."
 *
 * USHMM, .../hall-of-remembrance
 *   "Diffused sunlight illuminates the Hall as it passes through the
 *    translucent glass of a center skylight."
 *   "Narrow openings on the side walls let in additional light and provide
 *    partial views of the Washington Monument and the Jefferson Memorial."
 *
 * USHMM, .../hall-of-witness
 *   "a skewed and twisted skylight lets sheets of unfiltered but fragmented
 *    light pass through a tensioned ribbing of heavy steel trusses. The glass
 *    roof shears the building on a diagonal line. The skylight drops beneath
 *    the flanking brick walls to the third-floor level"
 *
 * Pei Cobb Freed, https://www.pcf-p.com/projects/united-states-holocaust-memorial-museum/
 *   "Site 1.7 acres, a block-through site between 14th Street and 15th Street"
 *   "258,000 ft2 / 24,000 m2 gross area"
 *   "the hexagonal Hall of Remembrance, a quasi-freestanding memorial chamber"
 *   "the main facade on 15th Street is a screen"
 *
 * OSM way 66418706, fetched this run through Overpass,
 *   https://overpass-api.de/api/interpreter?data=[out:json];way(66418706);out%20geom;
 *   tag building:levels = 5, source dcgis. This is the SECOND, independent
 *   source for five storeys, and the only one this run could read directly
 *   (SAH Archipedia, which states "the five-story limestone and brick
 *   rectangle that faces 14th Street", returns HTTP 403 to a fetch, so it is
 *   cited nowhere in this file as a measurement).
 *
 * ---------------------------------------------------------------------------
 * MEASURED THIS RUN off that OSM trace, and it CHECKS the published numbers
 * ---------------------------------------------------------------------------
 * All 26 nodes converted to feet in dc-3d.js's own frame (111132.0 m/deg lat,
 * 86646.9 m/deg lon at the Mall origin), relative to the dc-3d.js place point.
 *   footprint area          46,818 sq ft = 1.075 acres (site is 1.7 published)
 *   bounding box            333.9 ft east-west by 184.7 ft north-south
 *   south wall              v = -81.0, running u = -191.6 to +77.6
 *   north wall              v = +80.2, running u = -151.7 to +76.1
 *   WALL SPACING            161.4 ft  vs a PUBLISHED 161 ft. Six inches apart
 *                           on two independent sources. This is the strongest
 *                           check in the file and it is what licenses using
 *                           the trace for everything the sources do not give.
 *   main east wall          u = +76.8
 *   hexagon west face       u = -236.0
 *   EAST WALL TO HEXAGON    312.8 ft  vs a PUBLISHED 312 ft length. So the
 *                           published 312 runs from the main east facade to
 *                           the far side of the Hall of Remembrance and does
 *                           NOT include the 20 ft portico bow. That reading is
 *                           DERIVED here, not published, but it closes to
 *                           within ten inches, which is why the bow is drawn
 *                           as a screen standing outside the 312.
 *   14th Street bow         projects 19.8 ft east of the main wall over 81.5 ft
 *                           of frontage, traced as six chamfer segments
 *   two east pylons         project 7.7 ft, symmetric at v = +48 and v = -48
 *   south projecting bay    73.1 ft wide, 22.6 ft deep, u = -50.6 to -123.7
 *   HEXAGON, least-squares fit to the four traced vertices: centre
 *                           u = -193.5, v = -25.0, circumradius 49.05 ft,
 *                           residual 0.07 - a regular hexagon to within two
 *                           inches. 98.1 ft across corners, 85.0 across flats,
 *                           vertices at 30/90/150/210/270 and 330 degrees, so
 *                           faces look out at 0/60/120/180/240/300.
 *
 * ORIENTATION, DERIVED AND THEN CHECKED, the way the Vietnam arms were.
 * USHMM publishes that narrow openings in the Hall's side walls "provide
 * partial views of the Washington Monument and the Jefferson Memorial". That
 * is a claim this file can TEST, because dc-3d.js carries all three
 * coordinates. From the fitted hexagon centre the bearing to the Washington
 * Monument is 119.2 degrees and to the Jefferson Memorial 242.4 degrees. Two
 * of the six hexagon faces look out at exactly 120 and 240. Off by 0.8 and 2.4
 * degrees, from a fit and a coordinate list that know nothing about each
 * other. The two slots are therefore drawn in THOSE two walls, and nowhere
 * else, because the geometry earned it.
 *
 * ---------------------------------------------------------------------------
 * HEIGHT, and the honest state of it
 * ---------------------------------------------------------------------------
 * 91 ft is the ONLY published overall height found, and it rests on ONE
 * source, the Fox News fact box. No architectural publication reached this run
 * gives a height; a second search found none. It is not contradicted either,
 * and it survives two checks: the same sentence's 161 ft width matches the
 * measured 161.4, and its 312 ft length closes on the measured 312.8. So it is
 * used, and it is flagged: PUBLISHED BUT SINGLE-SOURCED.
 *
 * dc-3d.js line 73 carries h: 24 for this place against 91 ft = 27.74 m. The
 * place height is 3.74 m SHORT. This file may not edit that shared file, so it
 * is reported instead, and the model is scaled FT = p.h / 91 so that correcting
 * the place height to 28 corrects the model automatically. Until then every
 * dimension here renders at 86.5 per cent of true, in plan and in height
 * together, so no proportion is harmed - only the size against the lawn.
 *
 * THE VERTICAL SPLIT IS DERIVED, and this is the derivation, stated once:
 * the only two published vertical facts are 91 ft and five storeys, so
 * 91/5 = 18.2 ft is the storey. The four brick towers stand ABOVE the main
 * roof and no height is published for them, so 91 ft is read here as the
 * overall height TO THE TOWER TIPS - which is what "91 feet tall" normally
 * means and what keeps the model from exceeding its own source. The parapet is
 * then set at four fifths of it, 72.8 ft, leaving the towers exactly one
 * storey of the published five. Every level between - water table, string
 * course, cornice, window bands - is a division of those two numbers or a
 * named assumption below. NOTHING here is eyeballed from a photograph.
 *
 * ---------------------------------------------------------------------------
 * NAMED GAPS. Not buried, not guessed, listed
 * ---------------------------------------------------------------------------
 *   - NO published height, plan size or spacing for the four brick towers, the
 *     one exterior feature the building is known for. Drawn 26 ft wide, 6 ft
 *     projection, evenly spaced along the measured 227.8 ft north wall, head
 *     and pyramid filling the derived storey above the parapet. Assumptions.
 *   - NO published dimension of ANY kind for the Hall of Remembrance: no side,
 *     no height, no wall thickness, no plinth. The plan is the fitted trace;
 *     the top is drawn level with the main parapet so the model claims no
 *     relationship between the two masses that no source gives. Its tablets
 *     are 3.5 ft thick with 4 ft open corners: assumptions.
 *   - NO published step count or plinth height at either entrance. Low flights
 *     are drawn at both, and a two-slab plinth under the Hall.
 *   - NO published bay or opening count on the 14th Street portico. Its six
 *     openings are laid on the SIX CHAMFER SEGMENTS OF THE OSM TRACE, which is
 *     a mapper's simplification of a curve and may have nothing to do with the
 *     real bays. A rhythm derived from a trace, not a count from a source.
 *   - NO published portico height. Drawn 45 ft, so the building rises into
 *     daylight above it, which IS published.
 *   - NO published parapet, cornice, string course or floor-to-floor heights.
 *     See the derivation above. The string course is a drawing device and
 *     carries no claim about a real level.
 *   - NO published window count anywhere on the building. The facades carry a
 *     RHYTHM on the derived 18.2 ft storey at a 15 ft bay, and claim nothing
 *     more. Same treatment as the Vietnam wall's panel joints.
 *   - NO published dimension for the Hall of Witness skylight, its span, its
 *     truss count, or where its diagonal crosses the roof. Drawn as a sunken
 *     glazed shear on the diagonal, which is the published fact, at a derived
 *     width and position.
 *   - FOUR different published gross areas with no reconciliation: 250,000
 *     (Finegold Alexander), 258,000 (Pei Cobb Freed), 265,000 (Fox News),
 *     285,000 (EBSCO). The spread is quoted rather than one of them picked.
 *   - NO published limestone type or quarry, NO brick specification. Indiana
 *     limestone appears only in general promotional writing, never in a source
 *     specific to this contract, so it is NOT claimed.
 *   - NO National Register nomination and no HABS record: the building is from
 *     1993 and too recent, so this project's usual richest dimensional source
 *     simply does not exist here.
 *   - The Hall's three EASTERN walls are engaged with the museum block and are
 *     never seen from outside. They are not drawn. Six walls are published;
 *     three are visible; drawing the other three put a tall rectangle straight
 *     onto the museum's roof, which is the NMAAHC ledge fault, so they went.
 *
 * ---------------------------------------------------------------------------
 * FRAME AND PAINT
 * ---------------------------------------------------------------------------
 * u east, v north, z up, all in FEET, origin at the dc-3d.js place point, so
 * every plan number below is the measured OSM value with nothing added. The
 * place point sits 59.3 ft east and 8.1 ft north of the true footprint
 * centroid, which is why a form centred on it would hang off the east end;
 * using the measured coordinates directly puts the mass where the building is
 * and carries that offset honestly. The host's own lawn pad is 578 ft across
 * and contains it, so this form brings no pad of its own.
 *
 * The painter's trap is designed for, not discovered. Three assemblies are
 * gated on a face being toward the camera, which is the Hirshhorn balcony's
 * and the NMAAHC porch's lesson arriving again: the 14th Street screen on the
 * east face, the 15th Street entrance on the west, and the towers' shafts on
 * the north. Every band overruns its neighbour along the wall so abutting
 * quads cannot round apart into a ladder of seams under toFixed. The roof deck
 * and every slab that sits on something carries an explicit bias.
 */
(function () {
  var H = window.DC3D.helpers;
  window.DC_FORMS = window.DC_FORMS || {};
  window.DC_FORMS['holocaust'] = function (ctx, p, s, VE) {
    var P = ctx.project, items = [];

    /* ---------- scale ---------- */
    var HPUB = 91;                        /* published overall height, feet */
    var FT = (p.h * VE) / HPUB;           /* metres per foot */
    var mp = FT * s;                      /* metres per plan foot */
    function pt(u, v, z) { return P(p.x + u * mp, p.y + v * mp, z * FT); }
    function W(u, v) { return [p.x + u * mp, p.y + v * mp]; }
    function far(q) { return H.depthOf(q); }

    /* ---------- materials, two tones each, warmer where the sun falls ------
       The renderer's light is [0.55, 0.35, 0.72], up and to the north-east, so
       the NORTH brick face and the EAST limestone face are the lit ones and
       the south and west sit at the shade floor. That is lucky for this
       building: the two elevations the style is about are the two that get
       different light. */
    var LD = [0.55, 0.35, 0.72];
    /* THREE tones, not two, and the render is why. ctx.shade clamps every
       face whose normal points away from the light to the same 0.62, so a
       south wall and a west wall came back byte-identical and the corner
       between them vanished: from the south-west the block had no corner at
       all. A third, deeper hex for the faces turned furthest away puts it
       back, and it is still shading, not decoration. */
    function tone(m, nx, ny, nz) {
      var d = nx * LD[0] + ny * LD[1] + nz * LD[2];
      var h = d > 0.05 ? m.lit : (d > -0.42 ? m.shade : (m.deep || m.shade));
      return ctx.shade(h, nx, ny, nz);
    }
    var LIME  = { lit: "#ece5d5", shade: "#dcd4c4", deep: "#bfb6a4", edge: "#b1a895" }; /* limestone */
    var LIMEB = { lit: "#ddd4bf", shade: "#c8bfab", deep: "#b6ad99", edge: "#a79e8b" }; /* blind panes */
    var LIMER = { lit: "#b2a893", shade: "#a09681", edge: "#8c8371" };                  /* their reveals */
    var LIMEC = { lit: "#f2ecdf", shade: "#ded7c9", deep: "#ccc4b4", edge: "#b6ad9a" }; /* cornice and copings */
    var BRICK = { lit: "#a2624b", shade: "#8b5340", deep: "#77452f", edge: "#5d3527" }; /* north wall, towers */
    var BRICKD= { lit: "#7c4835", shade: "#693c2c", deep: "#5b3324", edge: "#40261b" }; /* its reveals */
    var GRAN  = { lit: "#b3aea4", shade: "#9e9990", deep: "#8d8880", edge: "#7c7770" }; /* granite base */
    var GLASS = { lit: "#5d6a77", shade: "#48545f", deep: "#3d4750", edge: "#363f47" }; /* real openings */
    var LEAD  = { lit: "#8d9198", shade: "#787c83", deep: "#686c72", edge: "#585c62" }; /* skylight framing */
    var VOID  = { lit: "#544f46", shade: "#48443c", deep: "#3e3b34", edge: "#332f29" }; /* the shadow the
        14th Street screen stands in front of: 20 ft of open air, in shade */

    /* ---------- the vertical stack, feet. See the derivation in the header - */
    var Z_BASE = 4.5;      /* water table top          ASSUMPTION */
    var Z_STR0 = 39.0, Z_STR1 = 40.2;  /* string course ASSUMPTION, a device */
    var Z_WALL = 66.5;     /* wall top / cornice under DERIVED */
    var Z_CORN = 68.5;     /* cornice top = roof deck  DERIVED */
    var Z_PAR  = 72.8;     /* parapet top = 0.8 x 91   DERIVED */
    var Z_TWR  = 79.5;     /* tower head top           ASSUMPTION */
    var STOREY = HPUB / 5; /* 18.2 ft, PUBLISHED 91 over PUBLISHED five */

    /* ---------- the measured plan, in feet, from the OSM trace -------------
       Clockwise. The 14th Street bow and the hexagon are cut out of this
       outline and drawn as their own objects, because one is a screen that
       opens to the sky and the other is a ring of freestanding tablets, and
       neither is a wall of the block. */
    var OUT = [
      [  76.1,  79.6],   /*  0 north-east corner                  */
      [  75.8,  54.8],   /*  1                                    */
      [  83.4,  46.9],   /*  2 north pylon, projecting 7.6 ft     */
      [  76.9,  40.8],   /*  3                                    */
      [  76.5, -40.7],   /*  4 east wall, the bow removed         */
      [  84.4, -48.9],   /*  5 south pylon, projecting 7.9 ft     */
      [  77.7, -55.4],   /*  6                                    */
      [  77.6, -81.4],   /*  7 south-east corner                  */
      [ -50.6, -81.0],   /*  8                                    */
      [ -50.6,-103.7],   /*  9 south bay, 22.6 ft deep            */
      [-123.7,-103.5],   /* 10                                    */
      [-123.6, -80.8],   /* 11                                    */
      [-191.6, -80.7],   /* 12 south-west corner                  */
      [-191.6, -74.0],   /* 13 = the hexagon's 270 deg vertex     */
      [-192.2,  24.1],   /* 14 = the hexagon's  90 deg vertex     */
      [-170.9,  12.5],   /* 15                                    */
      [-151.5,  12.6],   /* 16 the 15th Street forecourt          */
      [-151.7,  80.9]    /* 17 the 15th Street entrance wall      */
    ];
    var E_NORTH = 17;    /* the one BRICK edge: 17 -> 0, the north wall */
    var E_WEST  = 16;    /* the 15th Street entrance wall, own composition */
    /* clockwise, so the outward normal of a -> b is (-dv, du) */
    function edgeN(a, b) {
      var du = b[0] - a[0], dv = b[1] - a[1], L = Math.hypot(du, dv) || 1;
      return [-dv / L, du / L];
    }
    function edgeE(a, b) {
      var du = b[0] - a[0], dv = b[1] - a[1], L = Math.hypot(du, dv) || 1;
      return [du / L, dv / L];
    }

    /* ---------- primitives ------------------------------------------------ */

    /* a wall quad on an outline edge, offset out by o, overrunning its
       neighbours by e so abutting quads cannot round apart into seams */
    function face(a, b, n, o, e, z0, z1, m, bias, stroke) {
      if (!ctx.faceVisible(n[0], n[1])) return;
      var ed = edgeE(a, b);
      var a2 = [a[0] - ed[0] * e + n[0] * o, a[1] - ed[1] * e + n[1] * o];
      var b2 = [b[0] + ed[0] * e + n[0] * o, b[1] + ed[1] * e + n[1] * o];
      var q = [pt(a2[0], a2[1], z0), pt(b2[0], b2[1], z0),
               pt(b2[0], b2[1], z1), pt(a2[0], a2[1], z1)];
      items.push({ svg: ctx.poly(q, tone(m, n[0], n[1], 0), stroke === false ? null : m.edge, 0.4),
                   depth: far(q) + (bias || 0) });
    }
    /* a horizontal strip along an edge, from offset o0 to o1, always drawn:
       it is a top face, and a cornice with no top reads as a scratch */
    function strip(a, b, n, o0, o1, e, z, m, bias) {
      var ed = edgeE(a, b);
      var a0 = [a[0] - ed[0] * e + n[0] * o0, a[1] - ed[1] * e + n[1] * o0];
      var b0 = [b[0] + ed[0] * e + n[0] * o0, b[1] + ed[1] * e + n[1] * o0];
      var b1 = [b[0] + ed[0] * e + n[0] * o1, b[1] + ed[1] * e + n[1] * o1];
      var a1 = [a[0] - ed[0] * e + n[0] * o1, a[1] - ed[1] * e + n[1] * o1];
      var q = [pt(a0[0], a0[1], z), pt(b0[0], b0[1], z),
               pt(b1[0], b1[1], z), pt(a1[0], a1[1], z)];
      items.push({ svg: ctx.poly(q, tone(m, 0, 0, 1), m.edge, 0.4), depth: far(q) + (bias || 0) });
    }
    /* a flat panel lying ON a wall: an opening at map scale. Solid and one
       tone off for the blind limestone, dark and recessed for the brick. */
    function panel(a, b, n, z0, z1, m, bias) {
      if (!ctx.faceVisible(n[0], n[1])) return;
      var o = 0.4;
      var q = [pt(a[0] + n[0] * o, a[1] + n[1] * o, z0), pt(b[0] + n[0] * o, b[1] + n[1] * o, z0),
               pt(b[0] + n[0] * o, b[1] + n[1] * o, z1), pt(a[0] + n[0] * o, a[1] + n[1] * o, z1)];
      items.push({ svg: ctx.poly(q, tone(m, n[0], n[1], 0), null, 0), depth: far(q) + (bias || 0.18) });
    }
    /* an axis-aligned box; faces 0 south, 1 east, 2 north, 3 west */
    function box(cu, cv, wu, wv, z0, z1, m, bias, opt) {
      opt = opt || {};
      var hx = wu / 2, hy = wv / 2;
      var lo = [[cu-hx,cv-hy],[cu+hx,cv-hy],[cu+hx,cv+hy],[cu-hx,cv+hy]];
      var nm = [[0,-1],[1,0],[0,1],[-1,0]];
      for (var i = 0; i < 4; i++) {
        if (opt.skip && opt.skip.indexOf(i) >= 0) continue;
        if (!ctx.faceVisible(nm[i][0], nm[i][1])) continue;
        var j = (i + 1) % 4;
        var q = [pt(lo[i][0],lo[i][1],z0), pt(lo[j][0],lo[j][1],z0),
                 pt(lo[j][0],lo[j][1],z1), pt(lo[i][0],lo[i][1],z1)];
        items.push({ svg: ctx.poly(q, tone(m, nm[i][0], nm[i][1], 0), m.edge, 0.4),
                     depth: far(q) + (bias || 0) + i * 0.0002 });
      }
      if (!opt.noTop) {
        var tq = lo.map(function (c) { return pt(c[0], c[1], z1); });
        items.push({ svg: ctx.poly(tq, tone(m, 0, 0, 1), m.edge, 0.4),
                     depth: far(tq) + (bias || 0) + 0.004 });
      }
    }
    /* a pyramid cap: the roof that carries this building's meaning */
    function pyr(cu, cv, wu, wv, z0, z1, m, bias) {
      var hx = wu / 2, hy = wv / 2;
      var lo = [[cu-hx,cv-hy],[cu+hx,cv-hy],[cu+hx,cv+hy],[cu-hx,cv+hy]];
      var nm = [[0,-1],[1,0],[0,1],[-1,0]];
      var ap = pt(cu, cv, z1);
      for (var i = 0; i < 4; i++) {
        if (!ctx.faceVisible(nm[i][0], nm[i][1])) continue;
        var j = (i + 1) % 4;
        var t = [pt(lo[i][0],lo[i][1],z0), pt(lo[j][0],lo[j][1],z0), ap];
        items.push({ svg: ctx.poly(t, tone(m, nm[i][0] * 0.72, nm[i][1] * 0.72, 0.7), m.edge, 0.4),
                     depth: far(t) + (bias || 0) + i * 0.0002 });
      }
    }
    /* a free-standing slab with real thickness, so its END shows: the tablets
       of the Hall of Remembrance and the piers of the 14th Street screen */
    function slab(a, b, n, thick, z0, z1, m, bias, noTop) {
      var ai = [a[0] - n[0] * thick, a[1] - n[1] * thick];
      var bi = [b[0] - n[0] * thick, b[1] - n[1] * thick];
      var ed = edgeE(a, b);
      var F = [[a, b, n], [bi, ai, [-n[0], -n[1]]],
               [ai, a, [-ed[0], -ed[1]]], [b, bi, ed]];
      for (var i = 0; i < 4; i++) {
        var f = F[i];
        if (!ctx.faceVisible(f[2][0], f[2][1])) continue;
        var q = [pt(f[0][0],f[0][1],z0), pt(f[1][0],f[1][1],z0),
                 pt(f[1][0],f[1][1],z1), pt(f[0][0],f[0][1],z1)];
        items.push({ svg: ctx.poly(q, tone(m, f[2][0], f[2][1], 0), m.edge, 0.4),
                     depth: far(q) + (bias || 0) + i * 0.0002 });
      }
      if (!noTop) {
        var tq = [pt(a[0],a[1],z1), pt(b[0],b[1],z1), pt(bi[0],bi[1],z1), pt(ai[0],ai[1],z1)];
        items.push({ svg: ctx.poly(tq, tone(m, 0, 0, 1), m.edge, 0.4),
                     depth: far(tq) + (bias || 0) + 0.004 });
      }
    }

    /* ===================================================================== */
    /* 1. THE MAIN BLOCK                                                     */
    /* ===================================================================== */

    /* the base course, a stack that stops the block sitting straight on the
       lawn, and the water table above it */
    for (var i = 0; i < OUT.length; i++) {
      var a = OUT[i], b = OUT[(i + 1) % OUT.length], n = edgeN(a, b);
      face(a, b, n, 2.0, 2.0, 0, 2.2, GRAN, 0);
      face(a, b, n, 1.2, 1.2, 2.2, Z_BASE, GRAN, 0.02);
      strip(a, b, n, 2.0, 1.2, 2.0, 2.2, GRAN, 0.03);
      strip(a, b, n, 1.2, 0.0, 1.2, Z_BASE, GRAN, 0.04);
    }

    /* the wall itself: limestone on east, south and west, brick on the north.
       This one loop is the whole style. */
    for (var i2 = 0; i2 < OUT.length; i2++) {
      var a2 = OUT[i2], b2 = OUT[(i2 + 1) % OUT.length], n2 = edgeN(a2, b2);
      var mat = (i2 === E_NORTH) ? BRICK : LIME;
      face(a2, b2, n2, 0, 0.6, Z_BASE, Z_WALL, mat, 0);
    }

    /* the horizontal breaks: string course, cornice, parapet, each its own
       thin slab with a top, never a taller wall */
    for (var i3 = 0; i3 < OUT.length; i3++) {
      var a3 = OUT[i3], b3 = OUT[(i3 + 1) % OUT.length], n3 = edgeN(a3, b3);
      var m3 = (i3 === E_NORTH) ? BRICK : LIMEC;
      face(a3, b3, n3, 0.7, 0.7, Z_STR0, Z_STR1, m3, 0.06);
      strip(a3, b3, n3, 0.7, 0.0, 0.7, Z_STR1, m3, 0.07);
      var mc = (i3 === E_NORTH) ? BRICK : LIMEC;
      face(a3, b3, n3, 1.6, 1.6, Z_WALL, Z_CORN, mc, 0.08);
      strip(a3, b3, n3, 1.6, 0.0, 1.6, Z_CORN, mc, 0.09);
    }

    /* the roof deck, explicit depth because a large flat plane cannot be
       sorted by its own corners */
    (function () {
      var q = OUT.map(function (c) { return pt(c[0], c[1], Z_CORN); });
      items.push({ svg: ctx.poly(q, tone({ lit: "#bcb7ac", shade: "#ada89e" }, 0, 0, 1), "#9d988e", 0.4),
                   depth: far(q) + 0.05 });
    })();

    /* the parapet, outer face, inner face and coping, so the roofline reads
       from every angle instead of leaving a hole on the far side */
    for (var i4 = 0; i4 < OUT.length; i4++) {
      var a4 = OUT[i4], b4 = OUT[(i4 + 1) % OUT.length], n4 = edgeN(a4, b4);
      var m4 = (i4 === E_NORTH) ? BRICK : LIME;
      face(a4, b4, n4, 0, 0.6, Z_CORN, Z_PAR, m4, 0.10);
      face(a4, b4, [-n4[0], -n4[1]], -1.6, 0.6, Z_CORN, Z_PAR, m4, 0.12);
      strip(a4, b4, n4, 0.0, -1.6, 0.6, Z_PAR, LIMEC, 0.14);
    }

    /* ---------- fenestration ----------------------------------------------
       A RHYTHM, not a count: no source publishes a window anywhere on this
       building. The bands sit on the DERIVED 18.2 ft storey, four floors above
       the water table, the top one falling above the cornice and dropped. On
       limestone every opening is drawn SOLID and one tone off the wall,
       because the published openings on this building are blind; on the brick
       they are real recessed lights. */
    var FLOORS = [Z_BASE + 4.5, Z_BASE + 4.5 + STOREY, Z_BASE + 4.5 + 2 * STOREY];
    function fenestrate(a, b, n, isBrick, skipFn) {
      if (!ctx.faceVisible(n[0], n[1])) return;
      var L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (L < 34) return;
      var ed = edgeE(a, b);
      var PITCH = 15, WID = 5.5;
      var nb = Math.floor((L - 10) / PITCH);
      if (nb < 1) return;
      var pad = (L - (nb - 1) * PITCH) / 2;
      for (var k = 0; k < nb; k++) {
        var t = pad + k * PITCH;
        if (skipFn && skipFn(a[0] + ed[0] * t, a[1] + ed[1] * t)) continue;
        var pa = [a[0] + ed[0] * (t - WID / 2), a[1] + ed[1] * (t - WID / 2)];
        var pb = [a[0] + ed[0] * (t + WID / 2), a[1] + ed[1] * (t + WID / 2)];
        for (var r = 0; r < FLOORS.length; r++) {
          /* THE REVEAL FIRST. A blind window drawn one tone off its wall is
             invisible at 900 pixels, which the first render proved on the
             whole east front. Every opening here is RECESSED, so it carries a
             shadow on its jambs and head whether it is glazed or blocked up,
             and that shadow is what makes it read. The pane sits inside it. */
          var ra = [pa[0] - ed[0] * 1.0, pa[1] - ed[1] * 1.0];
          var rb = [pb[0] + ed[0] * 1.0, pb[1] + ed[1] * 1.0];
          panel(ra, rb, n, FLOORS[r] - 1.0, FLOORS[r] + 10.0, isBrick ? BRICKD : LIMER, 0.16);
          panel(pa, pb, n, FLOORS[r], FLOORS[r] + 9, isBrick ? GLASS : LIMEB, 0.20);
        }
      }
    }
    /* the four towers stand in the north wall, so its lights step round them */
    var TWR_U = [-123.2, -66.3, -9.3, 47.6];   /* evenly on the measured 227.8 ft */
    var TWR_W = 26, TWR_D = 6, TWR_V = 80.25;  /* ASSUMPTIONS, header */
    function inTower(u) {
      for (var t = 0; t < TWR_U.length; t++) if (Math.abs(u - TWR_U[t]) < TWR_W / 2 + 4) return true;
      return false;
    }
    var E_BOW = 3;   /* the east wall behind the 14th Street screen: in shadow */
    for (var i5 = 0; i5 < OUT.length; i5++) {
      if (i5 === E_WEST || i5 === E_BOW) continue;   /* own compositions, below */
      var a5 = OUT[i5], b5 = OUT[(i5 + 1) % OUT.length], n5 = edgeN(a5, b5);
      fenestrate(a5, b5, n5, i5 === E_NORTH,
                 i5 === E_NORTH ? function (u) { return inTower(u); } : null);
    }

    /* ===================================================================== */
    /* 2. THE FOUR RED-BRICK TOWERS, and the roofline they make               */
    /*    "On the building's north side, pyramid-shaped roofs top four        */
    /*    red-brick towers." The one thing a visitor names.                   */
    /* ===================================================================== */
    var northSeen = ctx.faceVisible(0, 1);
    TWR_U.forEach(function (cu) {
      /* the shaft, a pilaster standing entirely OUTSIDE the north wall so
         nothing of it is ever inside the block, and gated on the north face
         being toward the camera: from the south it is behind 161 ft of
         building and would paint straight through it */
      if (northSeen) box(cu, TWR_V + TWR_D / 2, TWR_W, TWR_D, 0, Z_PAR, BRICK, 0.16, { skip: [0] });
      /* the head, which is free above the roof and is drawn from everywhere */
      box(cu, TWR_V + TWR_D / 2 - 4, TWR_W, TWR_D + 8, Z_PAR, Z_TWR, BRICK, 0.20, { noTop: true });
      pyr(cu, TWR_V + TWR_D / 2 - 4, TWR_W + 1.5, TWR_D + 9.5, Z_TWR, HPUB, BRICK, 0.24);
    });

    /* ===================================================================== */
    /* 3. THE HALL OF WITNESS SKYLIGHT                                        */
    /*    "The glass roof shears the building on a diagonal line. The skylight */
    /*    drops beneath the flanking brick walls to the third-floor level."    */
    /*    Position and width DERIVED, the diagonal and the drop PUBLISHED.     */
    /* ===================================================================== */
    (function () {
      var A = [-112, 52], B = [22, -52], HW = 17;
      var du = B[0] - A[0], dv = B[1] - A[1], L = Math.hypot(du, dv);
      var eu = du / L, ev = dv / L, nu = -ev, nv = eu;
      var ZG = Z_CORN - STOREY / 2.8;         /* the drop, ASSUMPTION */
      var c = [[A[0] + nu * HW, A[1] + nv * HW], [B[0] + nu * HW, B[1] + nv * HW],
               [B[0] - nu * HW, B[1] - nv * HW], [A[0] - nu * HW, A[1] - nv * HW]];
      /* the well's four inner faces; only those turned to the camera draw */
      var side = [[c[0], c[1], [-nu, -nv]], [c[2], c[3], [nu, nv]],
                  [c[1], c[2], [-eu, -ev]], [c[3], c[0], [eu, ev]]];
      side.forEach(function (f, k) {
        if (!ctx.faceVisible(f[2][0], f[2][1])) return;
        var q = [pt(f[0][0],f[0][1],ZG), pt(f[1][0],f[1][1],ZG),
                 pt(f[1][0],f[1][1],Z_CORN), pt(f[0][0],f[0][1],Z_CORN)];
        items.push({ svg: ctx.poly(q, tone(LEAD, f[2][0], f[2][1], 0), LEAD.edge, 0.4),
                     depth: far(q) + 0.09 + k * 0.0002 });
      });
      var g = c.map(function (q2) { return pt(q2[0], q2[1], ZG); });
      items.push({ svg: ctx.poly(g, tone(GLASS, 0, 0, 1), GLASS.edge, 0.4), depth: far(g) + 0.10 });
      /* THE FLANKING BRICK WALLS, and they are published, not invented:
         "The skylight drops beneath the flanking brick walls to the
         third-floor level." So the glazed shear runs in a trough between two
         brick walls that stand higher than it. The first render came back
         with the roof as the largest surface in the model carrying nothing at
         all, which is the fault the NMAAHC roof was marked down for; this is
         the one thing a source lets me put there. Height is the parapet's,
         which is derived; the walls themselves are quoted. */
      [[c[0], c[1], [-nu, -nv]], [c[2], c[3], [nu, nv]]].forEach(function (f2, k2) {
        var ai = [f2[0][0] - f2[2][0] * 4.5, f2[0][1] - f2[2][1] * 4.5];
        var bi = [f2[1][0] - f2[2][0] * 4.5, f2[1][1] - f2[2][1] * 4.5];
        if (ctx.faceVisible(f2[2][0], f2[2][1])) {
          var q4 = [pt(f2[0][0],f2[0][1],Z_CORN), pt(f2[1][0],f2[1][1],Z_CORN),
                    pt(f2[1][0],f2[1][1],Z_PAR), pt(f2[0][0],f2[0][1],Z_PAR)];
          items.push({ svg: ctx.poly(q4, tone(BRICK, f2[2][0], f2[2][1], 0), BRICK.edge, 0.4),
                       depth: far(q4) + 0.13 + k2 * 0.0002 });
        }
        if (ctx.faceVisible(-f2[2][0], -f2[2][1])) {
          var q5 = [pt(bi[0],bi[1],Z_CORN), pt(ai[0],ai[1],Z_CORN),
                    pt(ai[0],ai[1],Z_PAR), pt(bi[0],bi[1],Z_PAR)];
          items.push({ svg: ctx.poly(q5, tone(BRICK, -f2[2][0], -f2[2][1], 0), BRICK.edge, 0.4),
                       depth: far(q5) + 0.13 + k2 * 0.0002 });
        }
        var q6 = [pt(f2[0][0],f2[0][1],Z_PAR), pt(f2[1][0],f2[1][1],Z_PAR),
                  pt(bi[0],bi[1],Z_PAR), pt(ai[0],ai[1],Z_PAR)];
        /* brick on top, not limestone: a pale coping here read as a strip of
           paper laid on the roof beside the glass */
        items.push({ svg: ctx.poly(q6, tone(BRICK, 0, 0, 1), BRICK.edge, 0.4), depth: far(q6) + 0.14 });
      });
      /* the tensioned ribbing of heavy steel trusses, as a rhythm across the
         glass. Truss count is a named gap; this claims a ribbing, not a count */
      for (var r = 1; r < 9; r++) {
        var t = r / 9;
        var m0 = [A[0] + du * t + nu * HW, A[1] + dv * t + nv * HW];
        var m1 = [A[0] + du * t - nu * HW, A[1] + dv * t - nv * HW];
        var w = 1.1;
        var rq = [pt(m0[0] - eu * w, m0[1] - ev * w, ZG + 0.3), pt(m0[0] + eu * w, m0[1] + ev * w, ZG + 0.3),
                  pt(m1[0] + eu * w, m1[1] + ev * w, ZG + 0.3), pt(m1[0] - eu * w, m1[1] - ev * w, ZG + 0.3)];
        items.push({ svg: ctx.poly(rq, tone(LEAD, 0, 0, 1), null, 0), depth: far(rq) + 0.12 });
      }
    })();

    /* ===================================================================== */
    /* 4. THE 14TH STREET SCREEN                                              */
    /*    "a mere facade, a fake screen that actually opens to the sky".       */
    /*    Piers and squared arches on the six chamfer segments of the trace,   */
    /*    standing 20 ft clear of the real east wall, with the building        */
    /*    rising into daylight above it. Gated on the east face: from the      */
    /*    west it is 300 ft of building away and must not paint through it.    */
    /* ===================================================================== */
    if (ctx.faceVisible(1, 0)) (function () {
      var BOW = [[76.9,40.8],[87.0,30.3],[94.9,13.8],[96.6,-4.4],[93.2,-18.7],[86.0,-31.4],[76.5,-40.7]];
      var ZS = 45, ZL = 34, ZB = 5, TH = 3.2, PW = 5.0;   /* ASSUMPTIONS, header */
      /* THE RECESS THE SCREEN STANDS IN FRONT OF. The first render showed the
         screen and the wall behind it in the same limestone, so a 20 ft void
         read as mush and the "fake screen that opens to the sky" was just a
         row of pale fins on a pale wall. What a visitor on 14th Street sees
         between the piers is not a lit facade, it is shadow. Drawn as a dark
         plane on the real east wall, spanning the bow, and the wall's own
         window rhythm is dropped there because none of it is visible. */
      (function () {
        var n = [1, 0], u0 = 76.6;
        var q7 = [pt(u0, BOW[0][1] + 3, 0), pt(u0, BOW[BOW.length-1][1] - 3, 0),
                  pt(u0, BOW[BOW.length-1][1] - 3, ZS + 1), pt(u0, BOW[0][1] + 3, ZS + 1)];
        items.push({ svg: ctx.poly(q7, tone(VOID, n[0], n[1], 0), null, 0), depth: far(q7) + 0.22 });
      })();
      /* the platform: two shrinking slabs, kept tight to the piers. At three
         slabs projecting nine feet it read as a pale apron, a jetty in front
         of the building rather than a step up to a door. */
      for (var st = 0; st < 2; st++) {
        var gr = 3.4 - st * 1.7;
        var pv = BOW.map(function (c) { return pt(c[0] + gr, c[1] + (c[1] > 0 ? gr : -gr), st * 1.4); });
        var pv2 = [];
        for (var q3 = BOW.length - 1; q3 >= 0; q3--) pv2.push(pt(BOW[q3][0] - 9, BOW[q3][1] + (BOW[q3][1] > 0 ? gr : -gr), st * 1.4));
        var pq = pv.concat(pv2);
        items.push({ svg: ctx.poly(pq, tone(GRAN, 0, 0, 1), GRAN.edge, 0.4), depth: far(pq) + 0.24 + st * 0.01 });
      }
      for (var k2 = 0; k2 < BOW.length; k2++) {
        var v0 = BOW[k2];
        var prev = BOW[Math.max(0, k2 - 1)], next = BOW[Math.min(BOW.length - 1, k2 + 1)];
        var ed = edgeE(prev, next), n = [-ed[1], ed[0]];
        /* the pier, drawn as a slab with real thickness so its side shows */
        var pa = [v0[0] - ed[0] * PW / 2, v0[1] - ed[1] * PW / 2];
        var pb = [v0[0] + ed[0] * PW / 2, v0[1] + ed[1] * PW / 2];
        slab(pa, pb, n, TH, 0, ZS, LIME, 0.30);
        slab(pa, pb, n, TH + 0.8, 0, ZB, GRAN, 0.31, true);
        if (k2 === BOW.length - 1) break;
        /* the squared arch between this pier and the next: a flat head, never
           a curve. The lintel and the transom are the only things drawn across
           the opening; through it you see the real east wall, 20 ft back. */
        var w0 = BOW[k2], w1 = BOW[k2 + 1];
        var eo = edgeE(w0, w1), no = [-eo[1], eo[0]];
        var o0 = [w0[0] + eo[0] * PW / 2, w0[1] + eo[1] * PW / 2];
        var o1 = [w1[0] - eo[0] * PW / 2, w1[1] - eo[1] * PW / 2];
        slab(o0, o1, no, TH, ZL, ZS, LIME, 0.29);
        slab(o0, o1, no, TH, 0, ZB, GRAN, 0.29, true);
        /* window grating: one transom, a rhythm, not a count */
        slab(o0, o1, no, TH * 0.7, 20.5, 21.7, LIME, 0.29, true);
      }
    })();

    /* ===================================================================== */
    /* 5. THE 15TH STREET ENTRANCE and the window that reverses the order     */
    /*    "Above the western entrance, a limestone mantle holds a solitary     */
    /*    window containing 16 solid 'panes,' framed by clear glass."          */
    /*    Sixteen. The one countable published feature on this building, and   */
    /*    it is drawn as sixteen solid blocks in a glass frame.                */
    /*    Its wall is DERIVED: the trace's west-facing wall at u = -151.6 is   */
    /*    the only one with the Hall of Remembrance to its right as you face   */
    /*    the building, which is what the museum's own photo caption says.     */
    /* ===================================================================== */
    if (ctx.faceVisible(-1, 0)) (function () {
      var a = OUT[E_WEST], b = OUT[E_WEST + 1], n = edgeN(a, b);
      var ed = edgeE(a, b), L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      function on(t) { return [a[0] + ed[0] * t, a[1] + ed[1] * t]; }
      var mid = L / 2;
      /* three shrinking slabs up to the door */
      for (var st = 0; st < 3; st++) {
        var d0 = on(mid - 22 - st * 2.5), d1 = on(mid + 22 + st * 2.5);
        slab([d0[0] + n[0] * (9 - st * 3), d0[1] + n[1] * (9 - st * 3)],
             [d1[0] + n[0] * (9 - st * 3), d1[1] + n[1] * (9 - st * 3)],
             n, 9 - st * 3, 0, 1.1 + st * 1.1, GRAN, 0.20 + st * 0.01, true);
      }
      /* the mantle: a projecting limestone frame */
      var m0 = on(mid - 15), m1 = on(mid + 15);
      slab([m0[0] + n[0] * 2.2, m0[1] + n[1] * 2.2], [m1[0] + n[0] * 2.2, m1[1] + n[1] * 2.2],
           n, 2.2, 27, 55, LIMEC, 0.22, true);
      /* the opening in the mantle, glazed clear */
      var g0 = on(mid - 11.5), g1 = on(mid + 11.5);
      panel(g0, g1, n, 31, 51, GLASS, 0.26);
      /* SIXTEEN solid stone panes, four by four, inside that clear glass */
      for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) {
        var pa = on(mid - 10.4 + c * 5.2), pb = on(mid - 10.4 + c * 5.2 + 4.0);
        panel(pa, pb, n, 32.2 + r * 4.7, 32.2 + r * 4.7 + 3.5, LIMEB, 0.30);
      }
      /* the entrance itself, a hole cut straight through, no case, no reveal */
      var e0 = on(mid - 11), e1 = on(mid + 11);
      panel(e0, e1, n, Z_BASE, 24, GLASS, 0.24);
      slab([e0[0] + n[0] * 1.4, e0[1] + n[1] * 1.4], [e1[0] + n[0] * 1.4, e1[1] + n[1] * 1.4],
           n, 1.4, 24, 26.4, LIMEC, 0.25, true);
      /* the rest of this wall keeps the blind rhythm, above the mantle only */
      var q0 = on(6), q1 = on(mid - 20);
      fenestrate(q0, q1, n, false, null);
      var q2 = on(mid + 20), q3 = on(L - 6);
      fenestrate(q2, q3, n, false, null);
    })();

    /* ===================================================================== */
    /* 6. THE HALL OF REMEMBRANCE                                             */
    /*    "Its six commanding walls, joined by open corners, appear as         */
    /*    freestanding tablets." Three of the six are free; the other three    */
    /*    are engaged with the museum and are not drawn (header).             */
    /* ===================================================================== */
    (function () {
      var HC = [-193.5, -25.0], HR = 49.05;            /* fitted to the trace */
      var ZP0 = 3.2, ZP1 = 6.4;                        /* plinth, ASSUMPTION  */
      var ZW = 70, ZC = Z_PAR;                         /* wall top, coping    */
      /* GAP was 4 ft and the picture said no. At map scale a four foot slot in
         a fifty foot wall is one pixel, so the three tablets fused into a
         drum, which is precisely the thing the published "joined by open
         corners ... freestanding tablets" is describing and precisely what
         STYLES.md's arch entry warns about: the tell has to be VISIBLE or it
         is not in the model. Widened to 8 ft, and the end faces of each
         tablet are drawn so the slot has two stone edges. */
      var THK = 3.5, GAP = 8.0;                        /* ASSUMPTIONS         */
      var D2R = Math.PI / 180;
      function vert(deg) { return [HC[0] + HR * Math.cos(deg * D2R), HC[1] + HR * Math.sin(deg * D2R)]; }
      /* the free walls, by outward normal: 120 north-west, 180 west,
         240 south-west. The 120 and 240 faces are the two that look at the
         Washington Monument (bearing 119.2) and the Jefferson Memorial
         (bearing 242.4) - see the orientation check in the header. */
      var FREE = [{ a: 90,  b: 150, n: 120, slot: "monument"  },
                  { a: 150, b: 210, n: 180, slot: null        },
                  { a: 210, b: 270, n: 240, slot: "jefferson" }];

      /* THE GATE, and the picture is what put it here. Everything of this hall
         that stands below the museum's roof line lives 300 ft behind 90 ft of
         building when the camera is east, and the painter's sort cannot know
         that: the dark interior came back as a black rectangle lying on the
         museum's roof at yaw +0.90, and the south-west tablet does the same
         thing at +2.30. So the whole lower assembly - plinth, interior,
         tablets, and the vertical face of the coping - is gated on the WEST
         face being toward the camera. Only the roof, the coping's top and the
         skylight are ungated, because those genuinely stand above the museum's
         roof deck and are seen from every quarter. Third time this project has
         had to learn it: the Hirshhorn balcony, the NMAAHC porch, this. */
      var hallSeen = ctx.faceVisible(-1, 0);

      /* the plinth: two shrinking slabs on the free side, and its top */
      if (hallSeen) FREE.forEach(function (f) {
        var A = vert(f.a), B = vert(f.b);
        var n = [Math.cos(f.n * D2R), Math.sin(f.n * D2R)];
        slab([A[0] + n[0] * 5.5, A[1] + n[1] * 5.5], [B[0] + n[0] * 5.5, B[1] + n[1] * 5.5],
             n, 5.5, 0, ZP0, GRAN, 0.30, true);
        slab([A[0] + n[0] * 2.6, A[1] + n[1] * 2.6], [B[0] + n[0] * 2.6, B[1] + n[1] * 2.6],
             n, 2.6, ZP0, ZP1, GRAN, 0.31, true);
      });
      if (hallSeen) (function () {   /* the plinth top, west half only */
        var q = [pt(vert(270)[0], vert(270)[1], ZP1), pt(vert(210)[0], vert(210)[1], ZP1),
                 pt(vert(150)[0], vert(150)[1], ZP1), pt(vert(90)[0], vert(90)[1], ZP1)];
        items.push({ svg: ctx.poly(q, tone(GRAN, 0, 0, 1), GRAN.edge, 0.4), depth: far(q) + 0.28 });
      })();

      /* THE DARK INSIDE. A slot between two tablets only reads as a slot if
         there is something behind it, and behind it is the inside of the
         hall. Drawn as a dark hexagonal core sitting inside the tablets, all
         six faces, pushed explicitly behind them so the tablets always win
         and only the corner slots show it. Without it the corners showed lawn
         and the eye read a solid drum with cracks in it. */
      if (hallSeen) (function () {
        var CR = HR - THK - 1;
        for (var q8 = 0; q8 < 6; q8++) {
          var k0 = vert(30 + q8 * 60), k1 = vert(30 + (q8 + 1) * 60);
          var k0i = [HC[0] + (k0[0] - HC[0]) * CR / HR, HC[1] + (k0[1] - HC[1]) * CR / HR];
          var k1i = [HC[0] + (k1[0] - HC[0]) * CR / HR, HC[1] + (k1[1] - HC[1]) * CR / HR];
          var kq = [pt(k0i[0],k0i[1],ZP1), pt(k1i[0],k1i[1],ZP1),
                    pt(k1i[0],k1i[1],ZW - 0.5), pt(k0i[0],k0i[1],ZW - 0.5)];
          items.push({ svg: ctx.poly(kq, "#2f3138", null, 0), depth: far(kq) - 4.0 });
        }
      })();

      /* the tablets. Shortened at each end by half the corner gap, so the
         corners are OPEN and each wall stands alone, which is the whole idea */
      if (hallSeen) FREE.forEach(function (f) {
        var A = vert(f.a), B = vert(f.b);
        var ed = edgeE(A, B);
        var a2 = [A[0] + ed[0] * GAP / 2, A[1] + ed[1] * GAP / 2];
        var b2 = [B[0] - ed[0] * GAP / 2, B[1] - ed[1] * GAP / 2];
        var n = [Math.cos(f.n * D2R), Math.sin(f.n * D2R)];
        slab(a2, b2, n, THK, ZP1, ZW, LIME, 0.34, true);
        slab([a2[0] + n[0] * 0.7, a2[1] + n[1] * 0.7], [b2[0] + n[0] * 0.7, b2[1] + n[1] * 0.7],
             n, THK + 1.4, ZW, ZC, LIMEC, 0.37);
        /* the blocked-over blind recesses: SOLID, one tone off, never holes */
        var L = Math.hypot(b2[0] - a2[0], b2[1] - a2[1]);
        for (var k = 0; k < 3; k++) {
          var t = L * (0.2 + 0.3 * k);
          var pa = [a2[0] + ed[0] * (t - 4), a2[1] + ed[1] * (t - 4)];
          var pb = [a2[0] + ed[0] * (t + 4), a2[1] + ed[1] * (t + 4)];
          panel([pa[0] - ed[0] * 1.1, pa[1] - ed[1] * 1.1], [pb[0] + ed[0] * 1.1, pb[1] + ed[1] * 1.1],
                n, 20.9, 53.1, LIMER, 0.38);
          panel(pa, pb, n, 22, 52, LIMEB, 0.40);
        }
        /* the narrow openings that look at the Monument and the Jefferson */
        if (f.slot) {
          var sa = [a2[0] + ed[0] * (L / 2 - 1.6), a2[1] + ed[1] * (L / 2 - 1.6)];
          var sb = [a2[0] + ed[0] * (L / 2 + 1.6), a2[1] + ed[1] * (L / 2 + 1.6)];
          panel(sa, sb, n, 14, 58, GLASS, 0.42);
        }
      });

      /* the roof: the FULL hexagon, so no chord line shows across it. Its east
         half lies over the museum's roof deck, 1.5 ft above it, which is what
         a hall poking through a roof does; natural depth sorts it correctly
         from all four quarters and was checked before it was written. */
      var rp = [];
      for (var d = 0; d < 6; d++) rp.push(vert(30 + d * 60));
      var rq = rp.map(function (c) { return pt(c[0], c[1], ZW); });
      items.push({ svg: ctx.poly(rq, tone({ lit: "#c8c3b8", shade: "#b8b3a9" }, 0, 0, 1), "#a49f95", 0.4),
                   depth: far(rq) + 0.32 });
      /* A COPING ON ALL SIX EDGES. From the east the three free tablets are
         behind the museum and are not drawn, and the render showed what that
         costs: the hall's roof lay on the museum's roof like a hexagonal
         decal with nothing under it. A 2.8 ft upstand all the way round turns
         the decal back into a volume, and it is short enough that it cannot
         become the tall rectangle on the roof that made the three eastern
         walls unusable in the first place. */
      for (var e6 = 0; e6 < 6; e6++) {
        var f0 = vert(30 + e6 * 60), f1 = vert(30 + (e6 + 1) * 60);
        var fe = edgeE(f0, f1);
        /* GAPPED at the corners like the tablets under it. A continuous ring
           of coping closed the open corners again at the top, which undid the
           whole point of widening the slot: the picture read as a drum with a
           hairline on it. */
        var c0 = [f0[0] + fe[0] * GAP / 2, f0[1] + fe[1] * GAP / 2];
        var c1 = [f1[0] - fe[0] * GAP / 2, f1[1] - fe[1] * GAP / 2];
        var cn = edgeN(c1, c0);          /* the hexagon runs anticlockwise here */
        var ci = [[c0[0] - cn[0] * 2.4, c0[1] - cn[1] * 2.4], [c1[0] - cn[0] * 2.4, c1[1] - cn[1] * 2.4]];
        if (hallSeen && ctx.faceVisible(cn[0], cn[1])) {
          var cq = [pt(c0[0],c0[1],ZW), pt(c1[0],c1[1],ZW), pt(c1[0],c1[1],ZC), pt(c0[0],c0[1],ZC)];
          items.push({ svg: ctx.poly(cq, tone(LIMEC, cn[0], cn[1], 0), LIMEC.edge, 0.4), depth: far(cq) + 0.34 });
        }
        var ctp = [pt(c0[0],c0[1],ZC), pt(c1[0],c1[1],ZC), pt(ci[1][0],ci[1][1],ZC), pt(ci[0][0],ci[0][1],ZC)];
        items.push({ svg: ctx.poly(ctp, tone(LIMEC, 0, 0, 1), LIMEC.edge, 0.4), depth: far(ctp) + 0.35 });
      }
      /* the translucent centre skylight, six-sided like the hall */
      var sk = [];
      for (var d2 = 0; d2 < 6; d2++) {
        var vv = vert(30 + d2 * 60);
        sk.push([HC[0] + (vv[0] - HC[0]) * 0.42, HC[1] + (vv[1] - HC[1]) * 0.42]);
      }
      var kq = sk.map(function (c) { return pt(c[0], c[1], ZW + 1.4); });
      items.push({ svg: ctx.poly(kq, tone(GLASS, 0, 0, 1), LEAD.edge, 0.5), depth: far(kq) + 0.44 });
      for (var d3 = 0; d3 < 6; d3++) {
        var s0 = sk[d3], s1 = sk[(d3 + 1) % 6];
        var mx = (s0[0] + s1[0]) / 2 - HC[0], my = (s0[1] + s1[1]) / 2 - HC[1];
        var ml = Math.hypot(mx, my) || 1;
        var kn = [mx / ml, my / ml];
        if (!ctx.faceVisible(kn[0], kn[1])) continue;
        var kk = [pt(s0[0],s0[1],ZW), pt(s1[0],s1[1],ZW), pt(s1[0],s1[1],ZW+1.4), pt(s0[0],s0[1],ZW+1.4)];
        items.push({ svg: ctx.poly(kk, tone(LEAD, kn[0], kn[1], 0), LEAD.edge, 0.4), depth: far(kk) + 0.43 });
      }

      /* the ground shadow of the hall, cast the opposite way to the light */
      var fp = [];
      for (var d4 = 0; d4 < 6; d4++) { var vv2 = vert(30 + d4 * 60); fp.push(W(vv2[0] + 5, vv2[1] + 5)); }
      items.push(H.shadow(ctx, fp, ZW * FT));
    })();

    /* ===================================================================== */
    /* 7. THE GROUND SHADOW of the block. Nothing here casts light, so a      */
    /*    building without one floats.                                        */
    /* ===================================================================== */
    items.push(H.shadow(ctx, OUT.map(function (c) { return W(c[0], c[1]); }), Z_PAR * FT));

    return items;
  };
})();
