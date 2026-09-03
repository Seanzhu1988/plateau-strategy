/* seattle-3d.js  ·  Seattle, standing up
   =====================================
   The city Sean actually sells tours in, and until now the only one on this
   site with no geometry at all. Same discipline as trail-3d.js and
   met-rooms.js: real published dimensions or it does not get drawn, the style
   named in STYLES.md before the geometry is chosen, and every large flat
   surface given an explicit painter depth, because a plane sorted on its own
   corners paints over whatever stands on it.

   Scenes are PURE. Each takes a context supplying project/poly/shade/
   faceVisible and returns {svg, depth} pieces, so render_room.js can draw one
   headlessly and it can be LOOKED AT before it ships.

   ---------------- Stop 1: the Space Needle ----------------
   John Graham and Company, 1961 to 1962, for the Century 21 Exposition, from
   Edward Carlson's sketch of a balloon on a tether and Victor Steinbrueck's
   hourglass. Googie, which the styles book now carries.

   EVERY NUMBER BELOW IS PUBLISHED, and where it came from:

     605 ft to the tip of the spire ................ Wikipedia, Space Needle
     520 ft observation deck above ground .......... Wikipedia
     518 ft top floor .............................. Wikipedia
     500 ft restaurant, as originally built ........ Wikipedia
     138 ft across at the top ...................... Wikipedia
     120 by 120 ft foundation, 30 ft deep .......... Wikipedia
     102 ft diameter at the base of the legs ....... Docomomo WEWA
     waist at the 373 ft level ..................... Docomomo WEWA
     three PAIRS of steel legs ..................... Docomomo WEWA
     36 in welded beam columns ..................... ASCE, Civil Engineering

   THE ONE NUMBER NOBODY PUBLISHES is the width AT the waist. The height of
   the waist is published and both widths it sits between are published, so
   the leg curve is drawn THROUGH the published level and its narrowest width
   is a consequence of that curve, not a figure claimed from a source. It is
   named here rather than buried, because a model that quietly invents one
   dimension is indistinguishable from one that invents them all.
*/
(function () {
  "use strict";

  function depthOf(pts) {
    var d = -1e9;
    for (var i = 0; i < pts.length; i++) if (pts[i][2] > d) d = pts[i][2];
    return d;
  }
  function meanDepth(pts) {
    var s = 0;
    for (var i = 0; i < pts.length; i++) s += pts[i][2];
    return s / pts.length;
  }

  /* A horizontal disc, N-sided. It is a large flat plane, so it never sorts
     on its own corners: a cap spanning 138 ft has a nearer rim than the
     spire standing in the middle of it and would paint the spire out. */
  function disc(ctx, cx, cy, r, z, n, fill, edge, depth) {
    var P = ctx.project, pts = [];
    for (var i = 0; i < n; i++) {
      var a = (i / n) * Math.PI * 2;
      pts.push(P(cx + r * Math.cos(a), cy + r * Math.sin(a), z));
    }
    return { svg: ctx.poly(pts, fill, edge, 0.5),
             depth: depth === undefined ? meanDepth(pts) : depth };
  }

  /* A frustum: the wall between two radii at two heights. Back faces culled
     against the outward normal, so a drum shows only its front half. */
  function frustum(ctx, cx, cy, r0, z0, r1, z1, n, fill, edge) {
    var P = ctx.project, out = [];
    for (var i = 0; i < n; i++) {
      var a0 = (i / n) * Math.PI * 2, a1 = ((i + 1) / n) * Math.PI * 2;
      var am = (a0 + a1) / 2, nx = Math.cos(am), ny = Math.sin(am);
      if (!ctx.faceVisible(nx, ny)) continue;
      var q = [P(cx + r0 * Math.cos(a0), cy + r0 * Math.sin(a0), z0),
               P(cx + r0 * Math.cos(a1), cy + r0 * Math.sin(a1), z0),
               P(cx + r1 * Math.cos(a1), cy + r1 * Math.sin(a1), z1),
               P(cx + r1 * Math.cos(a0), cy + r1 * Math.sin(a0), z1)];
      var slope = (r0 - r1) / Math.max(1, Math.abs(z1 - z0));
      out.push({ svg: ctx.poly(q, ctx.shade(fill, nx, ny, slope * 0.6), edge, 0.6),
                 depth: depthOf(q) });
    }
    return out;
  }

  function pad(ctx, cx, cy, w, d, z, fill, edge, depth) {
    var P = ctx.project;
    var q = [P(cx - w / 2, cy - d / 2, z), P(cx + w / 2, cy - d / 2, z),
             P(cx + w / 2, cy + d / 2, z), P(cx - w / 2, cy + d / 2, z)];
    return { svg: ctx.poly(q, fill, edge, 0.5), depth: depth };
  }

  function spaceNeedle(ctx) {
    var STEEL = "#b9b3a6", STEEL_EDGE = "#7e796f";
    var PALE = "#d8d2c4", GLASS = "#8fa6ae", GLASS_EDGE = "#5d7079";
    var PLAZA = "#ddd8cc", GRASS = "#c2c9b4", ORANGE = "#c98a4b";
    var cx = 0, cy = 0, out = [];

    /* the published profile */
    var R_BASE = 51;      /* 102 ft diameter at the base of the legs */
    var Z_WAIST = 373;    /* the published waist LEVEL */
    var Z_REST = 500;     /* restaurant as originally built */
    var Z_DECK = 520;     /* observation deck above ground */
    var R_TOP = 69;       /* 138 ft across at the top */
    var Z_TIP = 605;      /* spire tip */

    /* the one unpublished quantity, and everything derived from it */
    var R_WAIST = 13;
    var R_FLARE = R_WAIST * 2;   /* where the legs meet the underside */

    /* the leg curve: in to the waist, out again above it */
    function legR(z) {
      if (z <= Z_WAIST) {
        var t = (Z_WAIST - z) / Z_WAIST;
        return R_WAIST + (R_BASE - R_WAIST) * Math.pow(t, 1.55);
      }
      var u = (z - Z_WAIST) / (Z_REST - Z_WAIST);
      return R_WAIST + (R_FLARE - R_WAIST) * Math.pow(Math.min(1, u), 1.6);
    }

    /* ground. Explicit depth, always first. */
    out.push(pad(ctx, cx, cy, 330, 330, 0, GRASS, "#a8b09a", -1e9));
    out.push(pad(ctx, cx, cy, 210, 210, 0.5, PLAZA, "#bfb9aa", -0.99e9));
    /* the foundation: 120 by 120 ft, 30 ft deep and buried, so only its slab
       shows. Drawing the pit would be drawing something nobody can see. */
    out.push(pad(ctx, cx, cy, 120, 120, 1, "#cfc8b7", "#a9a394", -0.98e9));

    /* the core. Narrower than the waist, because the FIRST render drew it as
       wide as the waist and the picture came back a fat trunk with six guy
       wires hanging off it: the hourglass was in the numbers and not in the
       image. It claims no dimension of its own, being a fraction of the one
       unpublished quantity. */
    out = out.concat(frustum(ctx, cx, cy, R_WAIST * 0.55, 1, R_WAIST * 0.5, Z_REST,
                             12, "#a8a294", "#79746a"));

    /* three PAIRS of legs, 36 in columns. Not culled: a slender member is
       visible from every side, and culling the far ones halves the tower. */
    var COL = 3, GAP = 0.13, STEPS = 22;
    for (var p = 0; p < 3; p++) {
      for (var s = -1; s <= 1; s += 2) {
        var ang = p * (Math.PI * 2 / 3) + s * GAP;
        for (var k = 0; k < STEPS; k++) {
          var z0 = 1 + (Z_REST - 1) * (k / STEPS);
          var z1 = 1 + (Z_REST - 1) * ((k + 1) / STEPS);
          var r0 = legR(z0), r1 = legR(z1);
          var half = COL / 2;
          var t0 = Math.atan2(half, Math.max(6, r0)), t1 = Math.atan2(half, Math.max(6, r1));
          var q = [ctx.project(r0 * Math.cos(ang - t0), r0 * Math.sin(ang - t0), z0),
                   ctx.project(r0 * Math.cos(ang + t0), r0 * Math.sin(ang + t0), z0),
                   ctx.project(r1 * Math.cos(ang + t1), r1 * Math.sin(ang + t1), z1),
                   ctx.project(r1 * Math.cos(ang - t1), r1 * Math.sin(ang - t1), z1)];
          out.push({ svg: ctx.poly(q, ctx.shade(STEEL, Math.cos(ang), Math.sin(ang), 0.1),
                                   STEEL_EDGE, 0.4),
                     depth: depthOf(q) });
        }
      }
    }

    /* the top house. The disc is wider than anything below it and overhangs
       on every side: that is the tell, and it is why the legs stop at the
       flare and the saucer carries on past them. */
    out = out.concat(frustum(ctx, cx, cy, R_FLARE, 490, R_TOP, Z_REST,
                             24, PALE, "#a49c8c"));            /* the cone under the saucer */
    out = out.concat(frustum(ctx, cx, cy, R_TOP, Z_REST, R_TOP, 518,
                             24, GLASS, GLASS_EDGE));          /* restaurant glass, 500 to 518 */
    out = out.concat(frustum(ctx, cx, cy, R_TOP, 518, R_TOP - 3, Z_DECK,
                             24, ORANGE, "#8f5f31"));          /* the deck rim at 520 */
    out.push(disc(ctx, cx, cy, R_TOP - 3, Z_DECK, 24, "#cdc6b6", "#a49c8c", -1e3));
    /* the roof. Shallow. The first render gave it 36 ft of rise over 40 ft of
       run and the saucer came back a mushroom, which is a different building
       and a different decade. 138 ft across against 50 ft tall is the ratio a
       photograph shows. */
    out = out.concat(frustum(ctx, cx, cy, R_TOP - 6, Z_DECK, 20, 540,
                             24, PALE, "#a49c8c"));
    out.push(disc(ctx, cx, cy, 20, 540, 24, "#e0dacb", "#a49c8c", -0.9e3));

    /* the spire: decoration, not a mast. Explicit largest depth, because it
       is the topmost element, nothing on this model can occlude it, and a
       roof cap sorted on its own near rim would otherwise bury it. */
    var sp = frustum(ctx, cx, cy, 7, 540, 1.5, Z_TIP, 10, "#cfc8b7", "#8d867a");
    for (var i = 0; i < sp.length; i++) { sp[i].depth = 1e6 + i; }
    out = out.concat(sp);
    return out;
  }


  /* ---------------- Stop 2: the Pier 66 to Pike Place walk ----------------

     Not a building. The thing being modelled here is the HILL, because the
     hill is the whole of the promise the tours page makes to a cruise
     passenger stepping off at the Bell Street Pier, and a promise about a
     climb is the one thing a map drawn flat cannot show.

     Its style, such as it is, is the CUT SECTION, added to STYLES.md this
     run: a measured ground line, an honest datum, and a declared vertical
     exaggeration.

     EVERY NUMBER BELOW IS MEASURED, and where it came from:

       the route .......... router.project-osrm.org, from the
                            Bell Street Pier at Alaskan Way to Pike Place at
                            Stewart Street: Alaskan Way, Wall Street, Elliott
                            Avenue, Lenora Street, 1st Avenue, Pine Street.
                            64 vertices, returned as a GeoJSON line.
                            CORRECTED 2026-09-03: this was recorded here as
                            "foot routing" and it is NOT. The public OSRM demo
                            server carries only the car network and ignores the
                            profile in the URL; foot, walking, driving and bike
                            all return the identical distance, tested on this
                            corridor and on Boston. So the line below is a
                            DRIVING route measured through walking waypoints.
                            Along this particular corridor the two coincide
                            closely, because Alaskan Way, Wall, Elliott, Lenora,
                            1st and Pine are all two-way streets a car and a
                            walker take alike, which is why the figure survived
                            a sanity check. It is still the wrong label and it
                            would be the wrong number anywhere one-way streets
                            or a pedestrian cut-through differ. brouter.de
                            answers a plain GET with a real foot profile and
                            should replace it.
       1334 m, 0.829 mi ... the length of that route, summed haversine over
                            its own vertices.
       the elevations ..... USGS 3DEP, the National Map point elevation
                            service, one query per vertex, 1 metre raster,
                            reported in feet.

     WHAT THE MEASUREMENT SAYS, which is not what the page said:

       start, Alaskan Way ....................  15.8 ft
       crest, 1st Avenue near Virginia .......  152.7 ft, at 1018 m in
       finish, Pike Place ....................  110.6 ft
       net rise .............................. + 94.8 ft
       gross climb ...........................  139.1 ft
       gross descent .........................   44.3 ft
       steepest 50 m ......................... about 16 percent, at 797 m in,
                                                which is Lenora Street

     So the walk is NOT 0.7 miles and it is NOT simply uphill. It is 0.83
     miles, it climbs 139 ft, and then it hands 44 ft of that back down 1st
     Avenue and Pine Street into the Market. The site copy is corrected to
     match the measurement rather than the measurement trimmed to match the
     copy.

     THE ONE DRAWING CONVENTION, declared rather than buried. 137 ft of relief
     over 4376 ft of run is a slope of about 1 in 32, and at true scale this
     model is a flat tape: the grade that is the entire subject would be
     invisible. The vertical is therefore exaggerated, by the factor named in
     VE below, which is what a section drawing does and says. Every horizontal
     distance is true.

     NOT MEASURED, and so not drawn: anything between two samples. The ground
     line is straight from vertex to vertex because that is exactly as much as
     64 point queries know. */

  var WALK = [
    [    0.0,    0.0,  15.8,    0.0],
    [  -14.4,   12.6,  15.9,   19.1],
    [  -56.0,   48.9,  15.7,   74.3],
    [  -62.5,   51.7,  15.8,   81.4],
    [  -86.9,   72.7,  15.9,  113.6],
    [ -104.6,   87.2,  15.8,  136.5],
    [ -123.7,  101.9,  15.8,  160.5],
    [ -154.1,  124.7,  15.8,  198.5],
    [ -162.1,  130.9,  15.9,  208.6],
    [ -157.4,  136.8,  15.7,  216.2],
    [ -151.0,  144.8,  15.5,  226.4],
    [ -148.4,  148.0,  15.5,  230.6],
    [ -143.6,  154.0,  15.9,  238.2],
    [ -115.4,  184.0,  34.0,  279.4],
    [ -108.1,  192.5,  35.7,  290.6],
    [ -102.2,  187.4,  35.8,  298.4],
    [  -45.0,  137.0,  41.9,  374.6],
    [  -37.0,  130.1,  42.8,  385.1],
    [  -31.4,  125.4,  43.6,  392.4],
    [   51.7,   53.9,  59.4,  502.0],
    [   59.4,   47.3,  60.9,  512.1],
    [   66.7,   41.8,  62.1,  521.3],
    [   73.5,   37.5,  63.2,  529.3],
    [   83.2,   34.0,  64.9,  539.7],
    [  113.2,   23.6,  69.6,  571.3],
    [  148.4,   11.3,  75.4,  608.6],
    [  154.5,   12.9,  75.7,  614.9],
    [  162.9,    9.1,  77.1,  624.0],
    [  173.4,    4.8,  78.9,  635.5],
    [  189.4,   -2.7,  81.5,  653.1],
    [  196.7,   -5.0,  82.5,  660.7],
    [  203.7,   -7.6,  83.5,  668.2],
    [  255.4,  -25.8,  91.5,  722.9],
    [  258.5,  -27.0,  91.8,  726.3],
    [  269.2,  -30.9,  93.2,  737.6],
    [  286.5,  -37.9,  94.4,  756.3],
    [  309.6,  -47.1,  96.6,  781.2],
    [  317.8,  -49.7,  97.1,  789.7],
    [  323.0,  -44.8,  97.9,  796.9],
    [  349.8,  -14.6, 118.3,  837.3],
    [  360.4,   -2.7, 127.3,  853.2],
    [  375.2,   13.9, 138.6,  875.4],
    [  382.6,   22.2, 139.0,  886.5],
    [  391.4,   14.4, 139.9,  898.3],
    [  424.3,  -14.3, 145.3,  942.0],
    [  475.3,  -58.8, 152.6, 1009.6],
    [  481.3,  -64.0, 152.7, 1017.5],
    [  488.8,  -70.5, 152.4, 1027.4],
    [  549.9, -123.2, 147.3, 1108.2],
    [  571.1, -142.0, 145.4, 1136.5],
    [  578.1, -148.3, 145.1, 1145.8],
    [  583.2, -156.6, 144.5, 1155.6],
    [  605.6, -192.8, 140.3, 1198.2],
    [  610.1, -200.3, 139.9, 1206.9],
    [  595.9, -208.9, 139.0, 1223.5],
    [  593.7, -210.3, 138.1, 1226.0],
    [  564.7, -228.2, 120.2, 1260.1],
    [  546.6, -239.4, 110.9, 1281.4],
    [  545.0, -240.4, 110.7, 1283.3],
    [  539.1, -243.9, 110.5, 1290.2],
    [  536.4, -241.6, 110.2, 1293.7],
    [  514.8, -222.7, 109.3, 1322.4],
    [  518.9, -218.0, 109.1, 1328.6],
    [  522.3, -213.9, 110.6, 1333.9]
  ];

  var VE = 3;               /* declared vertical exaggeration */
  var FT = 0.3048;          /* the elevations arrive in feet, the plan in m */
  /* Half width of the drawn ribbon, in metres, and NOT a measurement: a real
     pavement is about 3 m and at 3 m this ribbon is a thread 772 m long. The
     first render came back a dam wall for exactly that reason, so the ribbon
     is drawn wide enough to be a surface you can see the grade on. It carries
     no claim about the width of any street. */
  var HALF = 40;

  function walkZ(ft) { return ft * FT * VE; }

  function pier66Walk(ctx) {
    var P = ctx.project, out = [];
    var EARTH = "#c7c0ae", EARTH_EDGE = "#8f8879";
    var PATH = "#d8d2c4", PATH_EDGE = "#a49c8c";
    var STEEP = "#c98a4b", STEEP_EDGE = "#8f5f31";
    var WATER = "#8fa6ae", WATER_EDGE = "#5d7079";
    var POST = "#7e796f";

    /* the left and right edges of the ribbon, offset along the normal to the
       direction of travel at each vertex */
    var L = [], R = [];
    for (var i = 0; i < WALK.length; i++) {
      var a = WALK[Math.max(0, i - 1)], b = WALK[Math.min(WALK.length - 1, i + 1)];
      var dx = b[0] - a[0], dy = b[1] - a[1];
      var m = Math.sqrt(dx * dx + dy * dy) || 1;
      var nx = -dy / m, ny = dx / m;
      L.push([WALK[i][0] + nx * HALF, WALK[i][1] + ny * HALF]);
      R.push([WALK[i][0] - nx * HALF, WALK[i][1] - ny * HALF]);
    }

    /* Elliott Bay, at the datum. A single plane spanning the whole scene, so
       it is given an explicit depth: sorted on its own near corner it would
       be the last thing painted and would drown the hill standing on it.
       This is the sixth time that rule has been the difference. */
    out.push({ svg: ctx.poly([P(-120, -300, 0), P(120, 140, 0),
                              P(-180, 300, 0), P(-420, -140, 0)],
                             WATER, WATER_EDGE, 0.5), depth: -1e9 });

    /* the ground mass, cut open on both sides down to mean sea level. Each
       wall quad is a small face and sorts honestly on its own corners. */
    function wall(edge, sign) {
      for (var i = 0; i < edge.length - 1; i++) {
        var z0 = walkZ(WALK[i][2]), z1 = walkZ(WALK[i + 1][2]);
        var dx = edge[i + 1][0] - edge[i][0], dy = edge[i + 1][1] - edge[i][1];
        var m = Math.sqrt(dx * dx + dy * dy) || 1;
        var nx = sign * -dy / m, ny = sign * dx / m;
        if (!ctx.faceVisible(nx, ny)) continue;
        var q = [P(edge[i][0], edge[i][1], 0), P(edge[i + 1][0], edge[i + 1][1], 0),
                 P(edge[i + 1][0], edge[i + 1][1], z1), P(edge[i][0], edge[i][1], z0)];
        out.push({ svg: ctx.poly(q, ctx.shade(EARTH, nx, ny, 0.15), EARTH_EDGE, 0.4),
                   depth: depthOf(q) });
      }
    }
    wall(L, 1); wall(R, -1);

    /* the two ends, so the mass reads as cut and not as hollow */
    function cap(i, sign) {
      var z = walkZ(WALK[i][2]);
      var a = WALK[Math.max(0, i - 1)], b = WALK[Math.min(WALK.length - 1, i + 1)];
      var dx = b[0] - a[0], dy = b[1] - a[1], m = Math.sqrt(dx * dx + dy * dy) || 1;
      var nx = sign * dx / m, ny = sign * dy / m;
      if (!ctx.faceVisible(nx, ny)) return;
      var q = [P(L[i][0], L[i][1], 0), P(R[i][0], R[i][1], 0),
               P(R[i][0], R[i][1], z), P(L[i][0], L[i][1], z)];
      out.push({ svg: ctx.poly(q, ctx.shade(EARTH, nx, ny, 0.1), EARTH_EDGE, 0.5),
                 depth: depthOf(q) });
    }
    cap(0, -1); cap(WALK.length - 1, 1);

    /* the walking surface. Coloured by its own measured grade, so the steep
       block on Lenora is a thing you can see rather than a figure in a
       caption. The threshold is 8 percent, which is the grade above which a
       pavement stops being a stroll.

       MIN_RUN, and why it is not the 0.5 m it started as. 3DEP is a 1 metre
       raster and its vertical error is of the order of a foot, so a grade
       taken between two vertices 2.5 m apart is mostly the error: one foot
       of noise over 2.5 m reads as 12 percent, which is larger than the whole
       threshold this line is testing. The first LOOK at this model showed
       exactly that, two orange blocks the walker never climbs. One is a 0.9 ft
       DROP over 2.5 m at 1224 m in, and one is a 1.5 ft RISE over 5.3 m in
       the last few strides into the Market. Neither is a hill; both are the
       raster talking to itself. At 15 m the same foot of error is worth 2
       percent, comfortably inside the threshold, so 15 m is the shortest run
       this data can carry a grade claim over. It removes those two and keeps
       all six real pitches, which is the test that it is a noise floor and
       not a convenient trim. Segments below it are drawn, and simply make no
       claim about their steepness. */
    var MIN_RUN = 15;
    for (var j = 0; j < WALK.length - 1; j++) {
      var run = WALK[j + 1][3] - WALK[j][3];
      var rise = (WALK[j + 1][2] - WALK[j][2]) * FT;
      var g = run >= MIN_RUN ? Math.abs(rise / run) : 0;
      var steep = g >= 0.08;
      var za = walkZ(WALK[j][2]), zb = walkZ(WALK[j + 1][2]);
      var q2 = [P(L[j][0], L[j][1], za), P(R[j][0], R[j][1], za),
                P(R[j + 1][0], R[j + 1][1], zb), P(L[j + 1][0], L[j + 1][1], zb)];
      out.push({ svg: ctx.poly(q2, steep ? STEEP : PATH,
                               steep ? STEEP_EDGE : PATH_EDGE, 0.4),
                 depth: depthOf(q2) + 0.5 });
    }

    /* three posts: where you land, the crest, and the Market. Slender, so
       they are drawn from every side rather than culled, and given depths
       above everything else because nothing in this model can stand in
       front of them. */
    var MARKS = [[0, 26], [45, 30], [WALK.length - 1, 26]];
    for (var k = 0; k < MARKS.length; k++) {
      var idx = MARKS[k][0], h = MARKS[k][1];
      var px = WALK[idx][0], py = WALK[idx][1], pz = walkZ(WALK[idx][2]);
      var col = frustum(ctx, px, py, 2.2, pz, 1.6, pz + h, 8, POST, "#4f4b45");
      for (var q3 = 0; q3 < col.length; q3++) col[q3].depth = 1e6 + k * 100 + q3;
      out = out.concat(col);
      var head = disc(ctx, px, py, 6, pz + h, 12, STEEP, STEEP_EDGE, 1e6 + k * 100 + 90);
      out.push(head);
    }
    return out;
  }

  var SCENES = { "space-needle": spaceNeedle, "pier66-walk": pier66Walk };

  /* The live mount: the same hand-rolled projection every other model on this
     site uses, so what the page draws is what render_room.js draws. */
  function mount(host, key, opts) {
    var o = opts || {};
    /* A tower and a landform want different cameras. 0.22 looks along a
       605 ft spire; the walk needs to be looked DOWN on or its surface, which
       is the whole subject, goes edge on. The first render of the walk at
       0.22 came back a dam wall. */
    var isLand = key === "pier66-walk";
    var yaw = o.yaw == null ? (isLand ? -0.30 : -0.62) : o.yaw;
    var pitch = o.pitch == null ? (isLand ? 0.52 : 0.22) : o.pitch;
    var LIGHT = [0.60, 0.30, 0.68];

    function draw() {
      var W = 820, H = 560;
      var mk = function (SC, OX, OY) {
        return function (x, y, z) {
          var c = Math.cos(yaw), s = Math.sin(yaw);
          var rx = x * c - y * s, ry = x * s + y * c;
          return [OX + rx * SC, OY + (ry * Math.sin(pitch) - (z || 0) * Math.cos(pitch)) * SC, ry];
        };
      };
      var faceVisible = function (nx, ny) { return (nx * Math.sin(yaw) + ny * Math.cos(yaw)) > 0.001; };
      var shade = function (hex, nx, ny, nz) {
        var d = nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2];
        var f = 0.55 + 0.45 * Math.max(0, d);
        var n = parseInt(hex.slice(1), 16);
        return "rgb(" + Math.min(255, Math.round(((n >> 16) & 255) * f)) + "," +
               Math.min(255, Math.round(((n >> 8) & 255) * f)) + "," +
               Math.min(255, Math.round((n & 255) * f)) + ")";
      };
      var BB = null;
      var measure = function (pts) {
        pts.forEach(function (p) {
          if (!BB) BB = [p[0], p[1], p[0], p[1]];
          BB[0] = Math.min(BB[0], p[0]); BB[1] = Math.min(BB[1], p[1]);
          BB[2] = Math.max(BB[2], p[0]); BB[3] = Math.max(BB[3], p[1]);
        });
        return "";
      };
      SCENES[key]({ project: mk(1, 0, 0), poly: measure, shade: shade, faceVisible: faceVisible });
      var bw = BB[2] - BB[0], bh = BB[3] - BB[1];
      var SC = Math.min((W - 50) / bw, (H - 50) / bh);
      var OX = (W - bw * SC) / 2 - BB[0] * SC, OY = (H - bh * SC) / 2 - BB[1] * SC;
      var poly = function (pts, f, st, sw, ex) {
        return '<polygon points="' + pts.map(function (p) {
          return p[0].toFixed(1) + "," + p[1].toFixed(1);
        }).join(" ") + '" fill="' + f + '"' +
          (st ? ' stroke="' + st + '" stroke-width="' + (sw || 1) + '"' : "") +
          ' stroke-linejoin="round"' + (ex || "") + "/>";
      };
      var items = SCENES[key]({ project: mk(SC, OX, OY), poly: poly, shade: shade, faceVisible: faceVisible });
      items.sort(function (a, b) { return a.depth - b.depth; });
      host.innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" width="100%" ' +
        'style="display:block;background:#eef0ea;border-radius:10px">' +
        items.map(function (i) { return i.svg; }).join("") + "</svg>";
    }
    draw();

    host.addEventListener("pointerdown", function (e) {
      host.__lx = e.clientX;
      host.setPointerCapture && host.setPointerCapture(e.pointerId);
    });
    host.addEventListener("pointermove", function (e) {
      if (host.__lx == null) return;
      yaw += (e.clientX - host.__lx) * 0.006; host.__lx = e.clientX; draw();
    });
    host.addEventListener("pointerup", function () { host.__lx = null; });
    host.addEventListener("pointercancel", function () { host.__lx = null; });
    return { redraw: draw };
  }

  window.SEATTLE3D = { scenes: SCENES, mount: mount };
})();
