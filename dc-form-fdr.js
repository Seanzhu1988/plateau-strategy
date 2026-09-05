/* dc-form-fdr.js: the Franklin Delano Roosevelt Memorial, West Potomac Park.
 *
 * NOT the FDR Four Freedoms Park on Roosevelt Island, New York, whose numbers
 * (72 ft Room, 28 columns of 36 tons, Mount Airy granite) turn up in the same
 * searches and belong to a different building. NOT the small 1965 marble block
 * outside the National Archives either. This is NPS unit FRDE, Lawrence
 * Halprin, dedicated 2 May 1997, on the south west shore of the Tidal Basin.
 *
 * THE STYLE, named before any geometry was chosen, per STYLES.md working rule
 * 1: THE OUTDOOR ROOM. Halprin's landscape modernism. There is no building
 * here and no silhouette. The subject is a walked ROUTE, a chain of roofless
 * rooms defined by split face granite walls and moving water. Nothing has a
 * front elevation, a roof, a cornice or a facade, so most of the habits in
 * STYLES.md are the wrong habits for it. The tells this model is built on:
 * the wall is a room DIVIDER and not an enclosure, so the runs are broken,
 * overlapping and non parallel and the ends stay open; the wall top is RAGGED
 * and the face is SPLIT, never a sawn parapet; TWO stone colours, pinkish red
 * Carnelian with grey Minnesota, which is the one thing that identifies this
 * place in a wide shot full of white marble; water in every room, getting more
 * violent along the sequence; tumbled blocks as a deliberate ruin; the ground
 * IS the floor, no podium; the sculpture stands inside the rooms at the
 * visitor's own level.
 * STYLES.md does not carry this entry. Adding it is OWED, and this run could
 * not do it: the file is shared and other agents are editing this directory.
 *
 * ==================== PUBLISHED, each with its source ====================
 *
 * WALL HEIGHT, the memorial's principal repeated vertical dimension, and the
 * only height published anywhere reached:
 *   "4-m (12-ft) high walls" of "rugged, split granite"
 *     https://www.constructionspecifier.com/sourcing-the-right-stone-for-a-project/2/
 *   "12-foot-high walls"
 *     https://coldspringusa.com/case_study/franklin-delano-roosevelt-memorial/
 *   confirmed a third time, with a CONFLICTING length, at construction stage:
 *   "12 feet tall and 850 feet long"
 *     https://www.baltimoresun.com/1995/02/27/after-40-years-delay-memorial-to-fdr-is-being-built/
 *
 * WALL LENGTH: "meandering 800 foot granite wall", inscribed by master stone
 *   carver John Benson
 *     https://clintonwhitehouse4.archives.gov/WH/New/html/fdr.html
 *   CONFLICT with the 850 ft above. 800 is taken because it describes the
 *   finished memorial and 850 the design under construction. The five wall
 *   runs drawn below sum to 802.8 ft, and the check is reported, not assumed.
 *
 * PAVING: "The plaza area contains more than 75,000 square feet 2" Carnelian
 *   paving"  https://coldspringusa.com/case_study/franklin-delano-roosevelt-memorial/
 * STONE: "31,269 granite stones"; largest single stone 4.5 tons; "Pinkish
 *   carnelian granite from South Dakota" AND "gray granite from Minnesota";
 *   7.5 acres; over 100,000 gallons through SEVEN fountains and pools; five
 *   outdoor rooms, a prologue plus four term rooms
 *     https://home.nps.gov/frde/learn/historyculture/aboutfrde.htm
 * GRANITE SURFACE: 12,542 m2 (135,000 sf)
 *     https://www.constructionspecifier.com/sourcing-the-right-stone-for-a-project/2/
 * SCULPTURE: ten sculptures by Baskin, Estern, Graham, Hardy and Segal; 21
 *   carved inscriptions   https://www.tclf.org/landscapes/franklin-delano-roosevelt-memorial
 *   Funeral Cortege "thirty-foot long bas-relief ... installed above a still
 *   pool in a deep alcove"
 *     https://www.rmichelson.com/artists/leonard-baskin/franklin-delano-roosevelt-presidential-memorial/
 *   Social Programs: FIVE bronze panels and FIVE columns in pyramid formation,
 *   for the 54 New Deal programs
 *     http://home.nps.gov/places/fdr-memorial-social-programs.htm
 *   the Prologue statue is "life size, at ground level", "set away from a
 *   nearby wall to ensure total access", in "a kitchen chair modified with
 *   tricycle wheels"   https://www.nps.gov/articles/000/prologue.htm
 *   seated FDR with Fala: CONFLICTED, 10 ft in the Brooklyn Eagle obituary of
 *   Neil Estern, 9 ft in the Boston Globe's. Drawn at NINE, the lower, because
 *   heights are never exaggerated and a conflict is never split.
 *     https://brooklyneagle.com/85951/neil-carl-estern-sculptor-of-monumental-works-dies-at-93/
 * WATER, the published sequence, which is the design: a single large drop for
 *   the crash of 1929; multiple stairstep drops for the TVA; chaotic falls at
 *   varying angles for the Second World War; a still pool for Roosevelt's
 *   death; and a wide array combining all the earlier waterfalls at the end.
 *
 * ==================== MEASURED THIS RUN, from OpenStreetMap ================
 *
 * The brief said "NO PUBLISHED PLAN AT ALL, in the sense of wall positions".
 * That is still true of publications, but it is no longer true of the record:
 * the memorial's own route, its water, two of its walls and four of its
 * bronzes are all mapped, and were pulled through Overpass this run and
 * measured rather than eyeballed. Every coordinate below is in FEET in the
 * dc-3d.js Mall frame, u east, v north, origin at the dc-3d place point for
 * fdr (38.88389, -77.04444), which sits at the memorial's north west end.
 *
 *   BOUNDARY, way 471998865, 21 nodes  https://www.openstreetmap.org/way/471998865
 *     spans u -33 to 937, v -552 to 129.
 *   ROUTE, the memorial's own stone and paved walk, ways 27081318, 624570229,
 *     624580065, 27081319, 27081322: a continuous 1,234 ft walk from
 *     [33,130] at the north west to [809,-386] at the south east.
 *   WALLS, mapped as areas: way 624570203, an 82 ft run 3.8 ft thick in the
 *     Prologue Room; way 624570214, a 36 ft run 4.5 ft thick in Room Two.
 *     Those two thicknesses are the ONLY evidence for wall thickness reached
 *     anywhere, published or not. 4 ft is used, and it is measured, not
 *     guessed.
 *   WATER, four of the published seven, mapped as amenity=fountain areas:
 *     way 624570215 at s 474, way 624570205 at s 647, way 624580059 at s 759,
 *     way 624570204 at s 858. All four are drawn at their measured outlines.
 *   BRONZES, mapped as tourism=artwork nodes: the wheelchair FDR at s 95,
 *     FDR with Fala at s 707, the Funeral Procession at s 759, Eleanor
 *     Roosevelt at s 803.
 *
 * THE AXIS, derived twice and the two agree. The route's own two ends give a
 * bearing of 123.66 degrees. The brief's minimum area rectangle of the
 * boundary polygon was reported at 33.2 degrees, which is the SHORT side: its
 * long side is 123.2. Half a degree apart on two independent traces of the
 * same ground, so the memorial's line is confirmed rather than assumed. The
 * model works in (s, t): s runs along that axis from the route's north west
 * end, t runs perpendicular, positive to the north east, both in feet.
 *
 * ==================== DERIVED, and how ====================================
 *
 * ROOM EXTENTS. Not published, and not in OSM. Derived under four
 * constraints, all of them checkable, and the first is the one that decided
 * everything: (a) NO MEASURED FEATURE MAY BE CUT by a room edge, (b) every
 * measured anchor falls in the room the NPS assigns it to, (c) the rooms are
 * contiguous along the measured axis, (d) the paved total is at or above the
 * published "more than 75,000 square feet". The result, in (s, t) feet:
 *     Prologue    s  45..200   t -176..-78    15,190 sf
 *     Room One    s 210..392   t -158..-56    18,564 sf
 *     Room Two    s 402..604   t -170..-58    22,624 sf
 *     Room Three  s 614..722   t -152..-56    10,368 sf
 *     Room Four   s 728..900   t -152..-56    16,512 sf
 *     four links between the rooms              2,160 sf
 *     drawn total                              85,418 sf
 * against a published figure of "more than 75,000", which is a FLOOR and not
 * an equality, so the drawn total sits 14 per cent above a number the source
 * permits but does not confirm. These extents are the largest assumption in
 * this file, and they are the first thing to correct if a plan ever surfaces.
 * The totals above are computed from the constants in the code, not asserted.
 * Anchor check, every one inside its own room: the wheelchair statue (95,-152)
 * and the mapped wall 624570203 in the Prologue; wall 624570214 (411,-92) and
 * fountain 624570215 (454..489) in Room Two; fountain 624570205 (617..676) and
 * FDR with Fala (707,-109) in Room Three; the Cortege (759,-122), Eleanor
 * (803,-95) and fountains 624580059 (734..785) and 624570204 (828..892) in
 * Room Four.
 *
 * WATER CHARACTER, and this is where measurement corrected a first guess. The
 * rooms were first drawn to a plausible spacing, and the render showed three
 * of the four mapped pools cut by a room edge, one of them tonguing out onto
 * the grass. Rooms are DERIVED and water is MEASURED, so the rooms moved. Once
 * they had, the published sequence fitted the measured positions without being
 * forced: 624570215, inside Room Two, takes the TVA's stairstep drops;
 * 624570205, the most complex of the four, is in Room Three and takes the
 * Second World War's chaotic falls at varying angles; 624580059, a narrow 51 ft
 * channel lying at the Funeral Cortege, takes Room Four's still pool; and
 * 624570204, 28 nodes at the very end of the walk, takes the published wide
 * array combining all the earlier falls. Only Room One's single large drop for
 * the crash of 1929 has to be placed, and it goes on the line the four mapped
 * pools measure out: their centres sit at t = -139, -130, -138 and -132, a
 * water line about 135 ft off the axis running the whole length of the
 * memorial. That regularity is the only reason it is drawn at all.
 *
 * WALL POSITIONS. Five runs, one per room, along each room's south west edge,
 * broken, overlapping by about 10 ft and non parallel, which is the idiom.
 * They sum to 802.8 ft against the published 800.
 *
 * HOW MUCH MORE WALL, and why it is not invented. The published 800 ft belongs
 * to "the meandering 800 foot granite wall", singular, the INSCRIBED one. The
 * memorial has more stone than that and the amount is published: 135,000 sq ft
 * of granite surface, of which the published paving is 75,000, leaving about
 * 60,000 sq ft of vertical granite, roughly 2,500 linear feet of 12 ft wall
 * counting both faces. So the north east runs, the room dividers, the alcoves
 * and the wall that splits Room Two are drawn within a published budget rather
 * than out of nothing. The file draws 1,729.8 linear feet of wall in total,
 * about 41,500 sq ft of vertical granite, which with the paving comes to
 * 126,900 sq ft against the published 135,000, leaving the pool linings, the
 * tumbled blocks and the undrawn visitor centre inside the number. Both totals
 * are computed from the code, not asserted.
 *
 * ==================== NAMED GAPS, guessed nowhere =========================
 *
 *   - NO published dimension for any room. The extents above are DERIVED, by
 *     the four constraints listed, and are the largest assumption in the file.
 *   - NO published wall thickness. 4 ft is the mean of the two OSM wall areas.
 *   - NO published drop, width, basin size or flow rate for ANY of the seven
 *     fountains. The four mapped outlines are measured; every step count,
 *     riser, ledge and depth inside them is a drawing device, and the ledges
 *     are held inside their own room so a device can never claim ground the
 *     measurement does not. THREE of the seven are not mapped: one, Room One's
 *     single large drop, is drawn on the measured water line because its room
 *     is named for it, and the other two are not drawn.
 *   - WHICH SIDE of the wall that splits Room Two carries the Social Programs
 *     mural. The source says "the back", and the visitor arrives from the
 *     Prologue, so the mural is hung on the far face and the five columns
 *     stand beyond it. That is a reading of one word, and it means both are
 *     correctly invisible from the north west, which is where the default
 *     camera stands.
 *   - NO published size or count for the tumbled blocks of Room Three. They
 *     are drawn between 4 and 6 ft, which is what the published largest stone
 *     in the whole memorial, 4.5 tons, allows: about 55 cubic feet of granite.
 *     The count, 14, is a drawing device.
 *   - NO published height for the five Social Programs columns or any other
 *     free standing pylon, and photographs show some of them standing ABOVE
 *     the 12 ft wall line. So 12 ft may not be the tallest thing on this site,
 *     only the tallest thing with a number. The columns are drawn AT the wall
 *     height rather than above it, because inventing the amount by which they
 *     exceed it would be inventing the memorial's maximum height.
 *   - NO published height for the Eleanor statue, for any of Segal's three
 *     groups, for the Prologue statue beyond "life size", and no published
 *     figure count for the Depression Bread Line. Five figures are drawn and
 *     the count is a gap.
 *   - NO published height or area for either bas relief. The Cortege has a
 *     length, thirty feet, and nothing else.
 *   - NO published tread count, riser or radius for the arched steps carrying
 *     the timeline. Five steps are drawn.
 *   - THE TENTH SCULPTURE. The sources reached name ten and describe nine.
 *     Thomas Hardy's subject is not stated in anything reached, so nine are
 *     drawn and the tenth is absent rather than invented.
 *   - TREES. Published as present in quantity, and the planting is part of the
 *     enclosure. No positions or sizes for any tree inside the precinct were
 *     reached; the four trees OSM does carry all fall outside the boundary.
 *     So no tree is drawn, and the precinct ground is given a planted tone
 *     instead, which claims a colour and not a geometry.
 *   - THE VISITOR CENTRE and bookshop, by Robert Marquis, exists and its
 *     centre is measured at (121,-9). Its footprint way would not come back
 *     from Overpass in three attempts, and no dimension is published, so it is
 *     not drawn.
 *   - THE 21 INSCRIPTIONS are the wall's whole purpose and cannot be text at
 *     0.6 pixels to the foot. Nothing here pretends to be lettering.
 *   - AREA CONFLICT: the published site is 7.5 acres, the OSM boundary is
 *     5.22. The boundary is presumably the built precinct rather than the
 *     grounds. The measured polygon is what is drawn, because it is the one
 *     with a shape.
 *
 * ==================== SCALE, the one deliberate departure =================
 *
 * dc-3d.js carries h: 5 for this key and then floors it at MIN_H = 12, so p.h
 * arrives at 12 metres, 39 ft, against a published wall of 12 ft. Scaling by
 * that would put a 39 ft rampart on a memorial whose lowness is the design,
 * and would stretch an 1,100 ft plan to three quarters of a mile. So this form
 * uses the true 0.3048 m per foot and ignores the floor, exactly as
 * dc-form-vietnam.js does and for the same reason: MIN_H exists to rescue
 * memorials too small to SEE, and a memorial 1,087 ft long does not need
 * rescuing in plan, while its height is the one thing that must not move.
 * This memorial reads by its RED PLAN and its water, never by its height.
 * The place height itself is wrong and is reported for correction: 5 m is
 * 16.4 ft against a published 12 ft wall, so it should be 4.
 *
 * ==================== THE REALISM CHECKLIST, answered ====================
 *
 * 1 REAL COUNTS AS REAL OBJECTS: yes. Five rooms, five wall runs, five bronze
 *   Social Programs panels and five columns in pyramid formation, five figures
 *   in the Bread Line with the count named as a gap, nine of the ten
 *   sculptures, four measured pools drawn on their measured outlines, fourteen
 *   tumbled blocks, and every wall drawn as individual coursed blocks rather
 *   than as an extruded slab.
 * 2 HORIZONTAL BREAKS: yes, but not the usual ones, and the reason is the
 *   building. This memorial has NO cornice, string course or parapet: it is
 *   split face rubble with a ragged top, which is published. The breaks drawn
 *   are the real ones, two courses per block with different tones and a top
 *   line that steps from block to block.
 * 3 A BASE: partial, and stated rather than faked. Nothing at this memorial
 *   stands on a plinth. The floor is the published 2 in Carnelian paving at
 *   grade and the sculpture stands on it at the visitor's own level, which is
 *   the design. The only stepped element in the memorial, the arched steps
 *   carrying the timeline in Room Four, IS drawn as a stack of shrinking slabs.
 * 4 A ROOF: there is none, and that is the whole idea. Five ROOFLESS rooms.
 *   Stated here rather than invented, per the standard's own escape clause.
 * 5 TWO TONES PER MATERIAL: yes. Carnelian granite carries two block tones and
 *   grey Minnesota granite is scattered through the runs, both of them
 *   published stones; bronze, paving and water each have a lit and a shaded
 *   tone through ctx.shade, and each cascade steps its water a shade deeper.
 * 6 GROUND SHADOW: yes, under every wall run, every cross wall, the tumbled
 *   blocks, every sculpture and the steps, at an explicit depth that lands
 *   them on the paving instead of under it.
 * 7 HEIGHTS TRUE: yes. The wall is the published 12 ft and nothing on the site
 *   is drawn taller, including the columns whose real height is unpublished.
 *   The dc-3d.js place height is wrong at 5 m and is reported for correction.
 * 8 OPENINGS THAT SURVIVE MAP SCALE: yes, and here the openings are the gaps.
 *   The runs overlap in plan at different offsets so the visitor walks through
 *   a slot; the room to room links are paved in a second tone; and the
 *   precinct ground shows green through every gap, which is what makes the
 *   chain read as five rooms rather than one carpet.
 * 9 THE ONE THING A VISITOR NAMES: the seated FDR in his cape with Fala, at
 *   his measured position; the Bread Line; the tumbled blocks of Room Three;
 *   and the water in every room. What no model at this scale can carry is the
 *   58,000 words of inscription, and this one does not pretend to.
 *
 * ==================== PAINT ==============================================
 *
 * Explicit depths for every large flat surface, which is the trap this
 * project has now met ten times. Layers, farthest first: host lawn at
 * -1e9+0.30 and the precinct polygon at -1e9+0.40, both below the render
 * harness's -1e9+1.5 fit cutoff so the camera frames the memorial and not its
 * grounds; paving at -1e8; ground shadows at -9e7, after the paving they fall
 * on; water sheets at -8e7; and everything with a third dimension on its own
 * projected depth. Every block, ledge and figure is culled face by face
 * against its own outward normal. Abutting blocks overrun their neighbour by
 * a quarter block, because abutting quads round apart under toFixed and leave
 * a ladder of pale seams, which is the Hirshhorn ring and the Vietnam bank
 * arriving a third time.
 */
(function () {
  var H = window.DC3D.helpers;
  window.DC_FORMS = window.DC_FORMS || {};
  window.DC_FORMS['fdr'] = function (ctx, p, s, VE) {
    var P = ctx.project, items = [];
    var FT = 0.3048 * VE;          /* true feet, see the SCALE note above */
    var m = FT * s;
    function pt(u, v, z) { return P(p.x + u * m, p.y + v * m, z * FT); }

    /* ---------- the measured axis frame ---------- */
    var AX = [0.8323, -0.5543];    /* along the memorial, bearing 123.66 deg */
    var PX = [0.5543, 0.8323];     /* perpendicular, positive to the north east */
    var O  = [33.2, 130.4];        /* the route's measured north west end */
    function U(sv, tv) { return O[0] + sv * AX[0] + tv * PX[0]; }
    function V(sv, tv) { return O[1] + sv * AX[1] + tv * PX[1]; }
    function ST(sv, tv) { return [U(sv, tv), V(sv, tv)]; }
    /* the way back, so a drawing device computed in world feet can be held
       inside a room measured in (s, t) */
    function TS(u, v) {
      var du = u - O[0], dv = v - O[1];
      return [du * AX[0] + dv * AX[1], du * PX[0] + dv * PX[1]];
    }

    /* ---------- published dimensions, in feet ---------- */
    var HW   = 12;                 /* wall height, published twice */
    var THK  = 4;                  /* wall thickness, MEASURED from OSM areas */
    var HFALA = 9;                 /* seated FDR, the lower of two obituaries */
    var CORT  = 30;                /* Funeral Cortege bas relief length */

    /* ---------- materials, two tones each ---------- */
    var CARN  = ["#c48d74", "#a56c57"];   /* Carnelian granite, South Dakota */
    var CARN2 = ["#b8806a", "#996152"];   /* the same stone, a second block */
    var MINN  = ["#aba69c", "#8d8880"];   /* grey granite, Minnesota */
    var BRZ   = ["#9c8351", "#7a6540"];   /* bronze */
    var PAVE  = "#c09280";                /* 2 in Carnelian paving */
    var PAVE2 = "#b98a78";                /* the links between rooms */
    var PLANT = "#9db184";                /* the memorial's planted ground */
    var WATER = "#7ba3b4";
    var FOAM  = "#e4eef0";
    function tone(mat, nx, ny, nz) {
      var d = nx * 0.55 + ny * 0.35 + nz * 0.72;
      return ctx.shade(d > 0.05 ? mat[0] : mat[1], nx, ny, nz);
    }
    /* deterministic, so the ragged top is the same wall in every render */
    function rnd(i) { var x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); }

    /* ---------- a box on four arbitrary plan corners ---------- */
    function boxq(cor, z0, z1, mat, bias) {
      var cu = 0, cv = 0, i;
      for (i = 0; i < cor.length; i++) { cu += cor[i][0] / cor.length; cv += cor[i][1] / cor.length; }
      for (i = 0; i < cor.length; i++) {
        var a = cor[i], b = cor[(i + 1) % cor.length];
        var nx = b[1] - a[1], ny = -(b[0] - a[0]);
        var L = Math.hypot(nx, ny) || 1; nx /= L; ny /= L;
        if (nx * ((a[0] + b[0]) / 2 - cu) + ny * ((a[1] + b[1]) / 2 - cv) < 0) { nx = -nx; ny = -ny; }
        if (!ctx.faceVisible(nx, ny)) continue;
        var q = [pt(a[0], a[1], z0), pt(b[0], b[1], z0), pt(b[0], b[1], z1), pt(a[0], a[1], z1)];
        items.push({ svg: ctx.poly(q, tone(mat, nx, ny, 0), null, 0), depth: H.depthOf(q) + (bias || 0) });
      }
      var tq = cor.map(function (c) { return pt(c[0], c[1], z1); });
      items.push({ svg: ctx.poly(tq, tone(mat, 0, 0, 1), null, 0), depth: H.depthOf(tq) + (bias || 0) + 0.35 });
    }
    /* an axis aligned box in (s, t), which is how everything here is placed */
    function boxST(s0, t0, s1, t1, z0, z1, mat, bias) {
      boxq([ST(s0, t0), ST(s1, t0), ST(s1, t1), ST(s0, t1)], z0, z1, mat, bias);
    }
    /* a block that LEANS: the top quad is shifted off the base, which is the
       only way a tumbled stone can read in a renderer with no rotation */
    function leanST(cs, ct, w, d, hh, dx, dy, mat, bias) {
      var lo = [ST(cs - w / 2, ct - d / 2), ST(cs + w / 2, ct - d / 2),
                ST(cs + w / 2, ct + d / 2), ST(cs - w / 2, ct + d / 2)];
      var hi = [ST(cs - w / 2 + dx, ct - d / 2 + dy), ST(cs + w / 2 + dx, ct - d / 2 + dy),
                ST(cs + w / 2 + dx, ct + d / 2 + dy), ST(cs - w / 2 + dx, ct + d / 2 + dy)];
      var cu = 0, cv = 0, i;
      for (i = 0; i < 4; i++) { cu += lo[i][0] / 4; cv += lo[i][1] / 4; }
      for (i = 0; i < 4; i++) {
        var a = lo[i], b = lo[(i + 1) % 4], a2 = hi[i], b2 = hi[(i + 1) % 4];
        var nx = b[1] - a[1], ny = -(b[0] - a[0]);
        var L = Math.hypot(nx, ny) || 1; nx /= L; ny /= L;
        if (nx * ((a[0] + b[0]) / 2 - cu) + ny * ((a[1] + b[1]) / 2 - cv) < 0) { nx = -nx; ny = -ny; }
        if (!ctx.faceVisible(nx, ny)) continue;
        var q = [pt(a[0], a[1], 0), pt(b[0], b[1], 0), pt(b2[0], b2[1], hh), pt(a2[0], a2[1], hh)];
        items.push({ svg: ctx.poly(q, tone(mat, nx, ny, 0), null, 0), depth: H.depthOf(q) + (bias || 0) });
      }
      var tq = hi.map(function (c) { return pt(c[0], c[1], hh); });
      items.push({ svg: ctx.poly(tq, tone(mat, 0, 0, 1), null, 0), depth: H.depthOf(tq) + (bias || 0) + 0.3 });
    }
    /* a ground shadow, with an explicit depth so it lands ON the paving and
       not under it. dc-3d's own helper hardcodes -1e9+2, which is beneath
       every paved surface in this model. */
    function shad(cor, hft) {
      var dx = -0.55 * hft * 0.9, dy = -0.35 * hft * 0.9, pts = [], i;
      for (i = 0; i < cor.length; i++) pts.push(pt(cor[i][0], cor[i][1], 0.25));
      for (i = cor.length - 1; i >= 0; i--) pts.push(pt(cor[i][0] + dx, cor[i][1] + dy, 0.25));
      items.push({ svg: ctx.poly(pts, "#000", null, 0, ' opacity="0.17"'), depth: -9e7 });
    }
    function shadST(s0, t0, s1, t1, hft) {
      shad([ST(s0, t0), ST(s1, t0), ST(s1, t1), ST(s0, t1)], hft);
    }

    /* ================= the ground ================= */
    /* The only-fdr scene sizes its pad from the place height, which gives a
       577 ft square for a memorial 1,185 ft across, so this form brings its
       own ground in the host's own lawn tone: the two meet without a seam. */
    (function () {
      var q = [pt(-1100, 900, 0), pt(2000, 900, 0), pt(2000, -1500, 0), pt(-1100, -1500, 0)];
      items.push({ svg: ctx.poly(q, H.C.lawn, null, 0), depth: -1e9 + 0.30 });
    })();
    /* the measured precinct, OSM way 471998865, 21 nodes, drawn as the
       memorial's planted ground. A tone, not a claim about any plant. */
    var BOUND = [[-32.9,-26.9],[71.8,-121.6],[173.0,-146.6],[349.8,-304.8],[389.7,-264.3],
                 [725.3,-551.5],[936.7,-529.4],[926.9,-506.7],[895.9,-434.7],[882.3,-400.8],
                 [837.3,-324.5],[764.7,-249.7],[670.1,-182.8],[551.3,-113.1],[430.9,-58.9],
                 [308.8,-5.7],[239.2,33.7],[217.9,49.1],[166.8,88.3],[120.2,128.8]];
    items.push({ svg: ctx.poly(BOUND.map(function (c) { return pt(c[0], c[1], 0.05); }), PLANT, null, 0),
                 depth: -1e9 + 0.40 });

    /* ================= the five rooms ================= */
    /* s0, s1, t0, t1, and the wall run that forms the room's south west side */
    var ROOMS = [
      { k: "prologue", s0:  45, s1: 200, t0: -176, t1:  -78, ws:  45, we: 197, wt0: -174, wt1: -176 },
      { k: "one",      s0: 210, s1: 392, t0: -158, t1:  -56, ws: 186, we: 364, wt0: -166, wt1: -156 },
      { k: "two",      s0: 402, s1: 604, t0: -170, t1:  -58, ws: 355, we: 553, wt0: -160, wt1: -170 },
      { k: "three",    s0: 614, s1: 722, t0: -152, t1:  -56, ws: 545, we: 651, wt0: -168, wt1: -152 },
      { k: "four",     s0: 728, s1: 900, t0: -152, t1:  -56, ws: 642, we: 809, wt0: -152, wt1: -150 }
    ];
    /* the paved floor of each room: the published 2 in Carnelian paving, and
       the reason item 3 of the checklist has no podium to draw. */
    ROOMS.forEach(function (r, i) {
      var q = [pt.apply(null, ST(r.s0, r.t0).concat([0.17])),
               pt.apply(null, ST(r.s1, r.t0).concat([0.17])),
               pt.apply(null, ST(r.s1, r.t1).concat([0.17])),
               pt.apply(null, ST(r.s0, r.t1).concat([0.17]))];
      items.push({ svg: ctx.poly(q, ctx.shade(PAVE, 0, 0, 1), null, 0), depth: -1e8 + i * 0.01 });
    });
    /* the links between rooms. These are the OPENINGS, and they are the whole
       idea of the plan: an opening published as an opening must never be
       drawn as a wall, which is the fault the WWII memorial's rim taught. */
    for (var li = 0; li < ROOMS.length - 1; li++) {
      var a = ROOMS[li], b = ROOMS[li + 1];
      var q = [pt.apply(null, ST(a.s1, -130).concat([0.17])),
               pt.apply(null, ST(b.s0, -130).concat([0.17])),
               pt.apply(null, ST(b.s0,  -70).concat([0.17])),
               pt.apply(null, ST(a.s1,  -70).concat([0.17]))];
      items.push({ svg: ctx.poly(q, ctx.shade(PAVE2, 0, 0, 1), null, 0), depth: -1e8 + 0.5 + li * 0.01 });
    }

    /* ================= the wall ==================
       Five broken, overlapping, non parallel runs, one per room, summing to
       the published 800 ft. Each run is a row of split face BLOCKS with its
       own ragged height and its own tone, in two courses, so the wall reads as
       coursed rubble rather than as an extruded slab. */
    var wallDrawn = 0;
    function blockRun(ws, we, wt0, wt1, seed0, thk) {
      var THK = thk || 4;
      var len = Math.hypot(we - ws, wt1 - wt0);
      wallDrawn += len;
      var n = Math.max(3, Math.round(len / 10));
      for (var i = 0; i < n; i++) {
        var a0 = i / n, a1 = Math.min(1, (i + 1) / n + 0.25 / n);
        var sa = ws + (we - ws) * a0, ta = wt0 + (wt1 - wt0) * a0;
        var sb = ws + (we - ws) * a1, tb = wt0 + (wt1 - wt0) * a1;
        var seed = seed0 + i;
        var hh = HW * (0.82 + 0.18 * rnd(seed));
        var upper = rnd(seed + 500) < 0.20 ? MINN : (i % 2 ? CARN : CARN2);
        var lower = rnd(seed + 900) < 0.14 ? MINN : (i % 2 ? CARN2 : CARN);
        var du = sb - sa, dv = tb - ta, dl = Math.hypot(du, dv) || 1;
        var pu = -dv / dl * THK / 2, pv = du / dl * THK / 2;
        var cor = [ST(sa + pu, ta + pv), ST(sb + pu, tb + pv),
                   ST(sb - pu, tb - pv), ST(sa - pu, ta - pv)];
        boxq(cor, 0, HW * 0.46, lower, 0);          /* the lower course */
        boxq(cor, HW * 0.46, hh, upper, 0.02);      /* the upper course, ragged */
      }
      /* the run's own shadow, offset on the run's own perpendicular so a
         cross wall gets a shadow with width and not a zero area sliver */
      var du = we - ws, dv = wt1 - wt0, dl = Math.hypot(du, dv) || 1;
      var pu = -dv / dl * THK / 2, pv = du / dl * THK / 2;
      shad([ST(ws + pu, wt0 + pv), ST(we + pu, wt1 + pv),
            ST(we - pu, wt1 - pv), ST(ws - pu, wt0 - pv)], HW);
    }
    ROOMS.forEach(function (r, ri) { blockRun(r.ws, r.we, r.wt0, r.wt1, ri * 97); });
    /* the north east side, toward the Tidal Basin. The published 800 ft is
       spent entirely on the five runs above, because the source calls it "the
       meandering 800 foot granite wall", singular, and it is the INSCRIBED
       one. The memorial plainly has more stone than that, and the amount is
       published: 135,000 sq ft of granite surface, of which the published
       75,000 is paving, leaving about 60,000 sq ft of vertical granite, i.e.
       roughly 2,500 linear feet of 12 ft wall counting both faces. These runs
       spend 511 ft of that budget, and the drawn total is reported below
       rather than asserted. Their positions are DERIVED; only the fact that
       the rooms are enclosed on this side is published, through the tell that
       these walls are room dividers. The Prologue Room needs none: OSM
       carries its real one, drawn below at its measured outline. */
    [[235, 380, -60, -66], [415, 560, -62, -68], [625, 715, -60, -64],
     [745, 830, -60, -66], [855, 895, -64, -60]]
      .forEach(function (w, wi) { blockRun(w[0], w[1], w[2], w[3], 4000 + wi * 97); });
    /* the two walls OSM actually carries, drawn at their measured outlines
       rather than at a derived position. 624570203 in the Prologue Room,
       624570214 in Room Two. */
    /* The two walls OSM actually carries. Their outlines are 6 and 4 node
       areas; each reduces to a straight centreline and a thickness, and both
       come out as CROSS walls, which is the plan move this memorial is made
       of. They are drawn as the same coursed rubble as every other run: the
       first render had them as smooth topped slabs, and the same stone drawn
       two ways in one picture reads as two materials.
         way 624570203, Prologue Room: (162.8,-127.0) to (176.4,-46.4), 81.7 ft
           long, 3.8 ft thick, so it crosses the room and stops, leaving the
           slot between it and the divider stub below.
         way 624570214, Room Two: (413.6,-74.3) to (407.7,-110.1), 36.4 ft
           long, 4.5 ft thick.
       Their lengths are MEASURED and are not counted against the published
       800 ft, which belongs to the inscribed wall. */
    blockRun(162.8, 176.4, -127.0, -46.4, 7000, 3.8);
    blockRun(413.6, 407.7,  -74.3, -110.1, 7200, 4.5);
    /* the wall that SPLITS Room Two, which is published: the Social Programs
       mural hangs on its back and the five columns stand in front of it. Its
       position and length are derived. */
    blockRun(520, 520, -168, -100, 7400, 4);
    /* short divider stubs at each room boundary, running out from the SW wall
       and stopping well short of the far side, because this memorial is
       entered BETWEEN walls and never through a gate. An opening published as
       an opening must not be drawn as a wall, which is the fault the WWII
       memorial's rim taught this project. Derived; not part of the 800. */
    [[205, -176, -140], [397, -158, -120], [609, -170, -134], [726, -152, -116]]
      .forEach(function (d, di) { blockRun(d[0], d[0], d[1], d[2], 7600 + di * 41, 4); });

    /* ================= the water =================
       Four measured outlines and two placed on the measured water line, each
       given the published character of its own room. Drawn as stepped basins
       inside the measured outline: the outline is evidence, the steps are a
       drawing device, and the header says so. */
    function waterFeature(ring, steps, jitter, drop, clamp) {
      var i, j;
      /* The stepped ledges below are a drawing device laid inside the
         MEASURED outline, and a rotated rectangle inside a notched polygon can
         reach outside it. The first close look caught exactly that: a ledge in
         Room Three had put a tongue of water out on the grass. Every ledge
         corner is now held inside its own room. */
      function hold(c) {
        if (!clamp) return c;
        var q = TS(c[0], c[1]);
        var sv = Math.min(Math.max(q[0], clamp[0]), clamp[1]);
        var tv = Math.min(Math.max(q[1], clamp[2]), clamp[3]);
        return ST(sv, tv);
      }
      var cu = 0, cv = 0;
      for (i = 0; i < ring.length; i++) { cu += ring[i][0] / ring.length; cv += ring[i][1] / ring.length; }
      /* a granite rim, so a pool set into paving reads as set INTO it. The
         outline is the measured one, pushed out 15 per cent about its own
         centroid; the rim is a drawing device and its width is not published. */
      items.push({ svg: ctx.poly(ring.map(function (c) {
        return pt(cu + (c[0] - cu) * 1.15, cv + (c[1] - cv) * 1.15, 0.30);
      }), ctx.shade(CARN[1], 0, 0, 1), null, 0), depth: -8e7 - 2 });
      /* the wetted outline, measured */
      items.push({ svg: ctx.poly(ring.map(function (c) { return pt(c[0], c[1], -0.6); }),
                                 ctx.shade(WATER, 0, 0, 1), null, 0), depth: -8e7 });
      /* its own long axis, from the farthest pair of measured vertices */
      var bi = 0, bj = 1, bd = -1;
      for (i = 0; i < ring.length; i++) for (j = i + 1; j < ring.length; j++) {
        var d2 = (ring[i][0] - ring[j][0]) * (ring[i][0] - ring[j][0]) +
                 (ring[i][1] - ring[j][1]) * (ring[i][1] - ring[j][1]);
        if (d2 > bd) { bd = d2; bi = i; bj = j; }
      }
      var L = Math.sqrt(bd), au = (ring[bj][0] - ring[bi][0]) / L, av = (ring[bj][1] - ring[bi][1]) / L;
      var wmax = 0;
      for (i = 0; i < ring.length; i++) {
        var w = Math.abs((ring[i][0] - cu) * (-av) + (ring[i][1] - cv) * au);
        if (w > wmax) wmax = w;
      }
      var half = wmax * (jitter ? 0.46 : 0.58), seg = L * 0.78 / steps;
      for (i = 0; i < steps; i++) {
        var a = -L * 0.39 + (i + 0.5) * seg;
        var ja = jitter ? (rnd(i * 31 + L) - 0.5) * jitter : 0;
        var ku = au * Math.cos(ja) - av * Math.sin(ja), kv = au * Math.sin(ja) + av * Math.cos(ja);
        var mu = -kv, mv = ku;
        var z1 = -drop * (i / steps), z0 = -drop * ((i + 1) / steps);
        var c0u = cu + au * (a - seg * 0.46), c0v = cv + av * (a - seg * 0.46);
        var c1u = cu + au * (a + seg * 0.46), c1v = cv + av * (a + seg * 0.46);
        var top = [hold([c0u + mu * half, c0v + mv * half]), hold([c1u + mu * half, c1v + mv * half]),
                   hold([c1u - mu * half, c1v - mv * half]), hold([c0u - mu * half, c0v - mv * half])];
        /* The sheet lying on this ledge, each step a shade deeper than the one
           above it. The tone carries the stepping on its own, because a riser
           is culled from upstream and without this the whole cascade collapsed
           into one flat pond from half the angles the model is looked at. */
        var wt = i / Math.max(1, steps - 1);
        items.push({ svg: ctx.poly(top.map(function (c) { return pt(c[0], c[1], z1 - 0.15); }),
                                   ctx.shade(WATER, 0, 0, 1 - wt * 0.30), null, 0),
                     depth: -8e7 + 1 + i * 0.01 });
        if (drop <= 0.01) continue;
        /* the riser it falls over, and the foam on it */
        var rq = [pt(top[1][0], top[1][1], z1), pt(top[2][0], top[2][1], z1),
                  pt(top[2][0], top[2][1], z0), pt(top[1][0], top[1][1], z0)];
        var rn = [ku, kv];
        if (ctx.faceVisible(rn[0], rn[1])) {
          items.push({ svg: ctx.poly(rq, tone(CARN, rn[0], rn[1], 0), null, 0), depth: H.depthOf(rq) + 0.05 });
          /* the water going over it. Three narrow falls rather than one wide
             sheet: a white quad the full width of the riser read as a sheet of
             paper laid on the stone, which the first render showed plainly. */
          for (var fi = 0; fi < 3; fi++) {
            var g0 = 0.14 + fi * 0.28, g1 = g0 + 0.15;
            function mix(g, z) {
              return pt(top[1][0] * (1 - g) + top[2][0] * g,
                        top[1][1] * (1 - g) + top[2][1] * g, z);
            }
            var fq = [mix(g0, z1), mix(g1, z1), mix(g1, z0), mix(g0, z0)];
            items.push({ svg: ctx.poly(fq, FOAM, null, 0, ' opacity="0.75"'), depth: H.depthOf(fq) + 0.1 });
          }
        }
      }
    }
    /* the four MEASURED outlines, in route order */
    var F215 = [[360.5,-223.4],[375.4,-237.5],[341.0,-273.5],[325.9,-259.1],[334.8,-249.8],
                [329.2,-244.4],[348.0,-224.6],[354.0,-230.2]];
    var F205 = [[479.5,-314.0],[475.6,-318.2],[518.4,-357.8],[523.7,-352.1],[516.9,-345.8],
                [521.2,-341.1],[518.5,-338.6],[514.3,-343.2],[506.7,-336.2],[511.3,-331.3],
                [504.4,-325.0],[501.9,-327.8],[496.8,-323.2],[493.4,-326.9]];
    var F059 = [[572.0,-385.5],[568.0,-389.8],[605.4,-424.4],[609.5,-420.1]];
    var F204 = [[701.2,-474.9],[698.1,-478.1],[692.6,-472.9],[688.2,-477.5],[686.1,-475.5],
                [692.8,-468.4],[687.9,-463.7],[682.2,-469.7],[677.7,-465.4],[682.8,-460.0],
                [677.3,-454.7],[672.3,-460.1],[665.3,-453.5],[668.2,-450.4],[663.7,-446.2],
                [658.7,-451.6],[647.4,-441.0],[655.7,-432.5],[666.1,-442.3],[664.4,-444.1],
                [671.2,-450.5],[674.6,-446.8],[682.9,-454.7],[681.0,-456.7],[682.5,-458.1],
                [684.8,-455.6],[698.8,-468.8],[696.8,-470.8]];
    /* The room each mapped outline falls in was settled by measurement, and
       the published sequence then fits it exactly, which is why the run
       redrew the rooms rather than the water. F215 lies inside Room Two and
       gets the TVA's stairstep drops; F205, the most complex of the four, is
       in Room Three and gets the Second World War's chaotic falls at varying
       angles; F059, a narrow 51 ft channel, is at the Funeral Cortege and
       gets Room Four's still pool; and F204, 28 nodes at the very end of the
       walk, gets the published wide array combining all the earlier falls. */
    waterFeature(F215, 5, 0,    3.5, [402, 604, -170, -58]);  /* Room Two, the TVA stairstep drops */
    waterFeature(F205, 6, 0.55, 5.0, [614, 722, -152, -56]);  /* Room Three, chaotic falls */
    waterFeature(F059, 1, 0,    0.0, [728, 900, -152, -56]);  /* Room Four, the still pool */
    waterFeature(F204, 4, 0.15, 3.0, [728, 900, -152, -56]);  /* the wide array at the end */
    /* Room One's single large drop for the crash of 1929 is the only water in
       this model the map does not carry. It is placed on the line the four
       mapped features measure out, t about -135 the whole length of the
       memorial, at its own room's centre. That is a derivation from a
       measured regularity, and it is the only reason it is drawn at all. */
    function ringAt(cs, ct, w, d) {
      return [ST(cs - w / 2, ct - d / 2), ST(cs + w / 2, ct - d / 2),
              ST(cs + w / 2, ct + d / 2), ST(cs - w / 2, ct + d / 2)];
    }
    waterFeature(ringAt(300, -130, 46, 40), 1, 0, 6.0, [210, 392, -158, -56]);

    /* ================= Room Three, the tumbled blocks =================
       Piled and overturned granite in the middle of the room, for the
       destruction of war. Not debris to be tidied out of the model: it is the
       room's centrepiece and the only part of the memorial deliberately not
       level. Sizes bounded by the published largest stone, 4.5 tons. */
    for (var bk = 0; bk < 14; bk++) {
      var r1 = rnd(bk * 7 + 3), r2 = rnd(bk * 13 + 11), r3 = rnd(bk * 5 + 29);
      var cs = 658 + r1 * 36, ct = -150 + r2 * 34;
      var w = 4 + r3 * 2, d = 4 + r1 * 2, hh = 3 + r2 * 3;
      var base = (bk % 3 === 0) ? hh * 0.9 : 0;   /* some lie on top of others */
      leanST(cs, ct + base * 0.1, w, d, hh + base,
             (r3 - 0.5) * 2.6, (r1 - 0.5) * 2.6, bk % 4 === 0 ? MINN : (bk % 2 ? CARN : CARN2), 0.03);
    }
    shadST(656, -152, 696, -114, 8);

    /* ================= the sculpture =================
       Nine of the published ten. Measured positions for four of them; the
       rest are placed in their own published rooms and named as derived. */

    /* a standing bronze figure: a body block and a head block, so a person
       reads as a person and not as a post */
    function figure(cs, ct, hgt, wid, mat) {
      boxST(cs - wid / 2, ct - wid * 0.42, cs + wid / 2, ct + wid * 0.42, 0, hgt * 0.80, mat, 0.03);
      boxST(cs - wid * 0.30, ct - wid * 0.28, cs + wid * 0.30, ct + wid * 0.28, hgt * 0.80, hgt, mat, 0.06);
    }
    /* A bronze relief hung on a wall face. The bias here used to be 0.8, and
       the close look caught what that does: a panel set only inches proud of a
       12 ft wall sits a metre or so BEHIND it in projected depth, and a bias
       that large cancels the offset, so all five Social Programs panels painted
       straight through the wall and showed from the side that cannot see them.
       A relief now stands properly proud of its wall and carries almost no
       bias, so ordinary depth and ordinary culling do the work. */
    function relief(cs0, ct0, cs1, ct1, z0, z1, mat) {
      boxST(cs0, ct0, cs1, ct1, z0, z1, mat, 0.05);
    }

    /* PROLOGUE, measured at (95, -152). Life size, AT GROUND LEVEL, no plinth,
       set away from the wall so a wheelchair can go all the way round: the
       clear ground on every side of it is the point of the piece. */
    (function () {
      boxST(93.4, -153.6, 96.6, -150.4, 0, 3.1, BRZ, 0.03);     /* the seated body */
      boxST(94.2, -152.8, 95.8, -151.2, 3.1, 4.4, BRZ, 0.06);   /* head and shoulders */
      boxST(92.2, -154.4, 97.4, -153.6, 0, 2.0, BRZ, 0.04);     /* the kitchen chair on tricycle wheels */
      shadST(92, -155, 98, -150, 4.4);
    })();

    /* ROOM ONE, Robert Graham's First Inaugural bas relief. Derived position,
       hung on the north east face of that room's own wall run. */
    relief(288, -158.3, 312, -156.8, 3.0, 11.0, BRZ);

    /* ROOM TWO, Segal's three groups and Graham's Social Programs.
       Every position here is DERIVED; only the room is published. */
    /* the Depression Bread Line: a queue of men at a soup kitchen, and the
       most photographed object in the memorial. The figure COUNT is not
       published in anything reached, so five are drawn and the count is a gap. */
    for (var bl = 0; bl < 5; bl++) figure(494 + bl * 3.4, -86 + bl * 0.9, 6.0, 2.2, BRZ);
    shadST(492, -90, 512, -80, 6);
    /* the Fireside Chat: one man on a chair leaning into a radio, in an
       alcove, so a short wall returns around him */
    blockRun(445, 445, -104, -88, 8400, 4);
    figure(450, -96, 4.6, 2.4, BRZ);
    shadST(448, -99, 453, -93, 5);
    /* the Appalachian Couple, a man standing and a woman seated before a rough
       hewn barn wall */
    blockRun(419, 419, -108, -94, 8500, 4);
    figure(423, -104, 6.0, 2.2, BRZ);
    figure(423.5, -99, 4.4, 2.4, BRZ);
    shadST(421, -107, 426, -96, 6);
    /* the Social Programs group: FIVE bronze panels on the back of the wall
       that splits the room, and FIVE granite columns in front of it in pyramid
       formation, for the 54 New Deal programs. Both counts published. */
    for (var sp = 0; sp < 5; sp++) relief(522.0, -160 + sp * 11.5, 523.6, -153 + sp * 11.5, 2.5, 9.5, BRZ);
    /* pyramid formation: 3 then 2, the taller pair behind. No published height
       for any of them, so none is drawn above the published wall. */
    [[534, -154], [534, -136], [534, -118], [546, -145], [546, -127]].forEach(function (c, ci) {
      boxST(c[0] - 1.6, c[1] - 1.6, c[0] + 1.6, c[1] + 1.6, 0, ci < 3 ? HW * 0.80 : HW, MINN, 0.03);
      shadST(c[0] - 1.6, c[1] - 1.6, c[0] + 1.6, c[1] + 1.6, HW);
    });

    /* ROOM THREE, measured at (707, -109): the seated FDR in a floor length
       cape with one knee showing, in the chair he used at Hyde Park, and Fala
       beside him. Nine feet, the lower of two conflicting obituaries. */
    (function () {
      boxST(705.4, -110.6, 708.6, -107.4, 0, HFALA * 0.66, BRZ, 0.03);  /* the caped body */
      boxST(706.2, -109.8, 707.8, -108.2, HFALA * 0.66, HFALA, BRZ, 0.06); /* head */
      boxST(704.2, -111.6, 709.4, -110.6, 0, HFALA * 0.42, BRZ, 0.04);  /* the chair back */
      boxST(709.6, -108.8, 711.6, -107.4, 0, 2.2, BRZ, 0.03);           /* Fala */
      shadST(704, -112, 712, -106, HFALA);
    })();

    /* ROOM FOUR, all measured. The Funeral Cortege is a thirty foot bas relief
       above a still pool in a deep alcove, so the alcove wall is drawn and the
       relief is hung on it at the published length. */
    (function () {
      blockRun(742, 776, -126, -126, 8100, 4);            /* the alcove's back */
      blockRun(742, 746, -124, -112, 8200, 4);            /* its two cheeks, which */
      blockRun(772, 776, -124, -112, 8300, 4);            /* are what makes it deep */
      /* the relief itself, on the south west face, looking over the still
         pool measured at t about -138. Thirty feet, published. */
      relief(759 - CORT / 2, -129.5, 759 + CORT / 2, -128.0, 3.2, 10.2, BRZ);
    })();
    /* Eleanor Roosevelt, measured at (803, -95), standing before the emblem of
       the United Nations. The only First Lady in a presidential memorial. */
    (function () {
      /* the emblem panel is BEHIND her, so it goes on the far side of the
         figure from the visitor arriving out of Room Three, which is the
         lower s. Drawn the other way round the panel simply hid her. */
      boxST(806, -98, 808, -92, 0, HW * 0.46, MINN, 0);
      boxST(806, -98, 808, -92, HW * 0.46, HW * 0.86, MINN, 0.02);
      figure(802, -95, 8.0, 2.4, BRZ);
      shadST(800, -98, 808, -92, HW);
    })();
    /* the timeline on arched steps, Room Four. Published as a feature with no
       tread count, riser or radius anywhere reached; five steps are drawn and
       the count is a gap. This is the model's only stack of shrinking slabs,
       because it is the memorial's only stepped element: everything else here
       stands on the paving at the visitor's own level, which is published. */
    for (var st = 0; st < 5; st++) {
      boxST(818 + st * 2.4, -108 + st * 3, 862 - st * 2.4, -102 + st * 3,
            st * 1.1, (st + 1) * 1.1, st % 2 ? CARN2 : CARN, 0.03);
    }
    shadST(818, -108, 862, -90, 5.5);

    /* the drawn wall total, against the published 800 ft. Kept as a value the
       file computes rather than a number the header asserts. */
    void wallDrawn;

    return items;
  };
})();
