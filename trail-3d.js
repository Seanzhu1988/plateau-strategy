/* trail-3d.js  ·  the Freedom Trail, standing up
   ==============================================
   Sixteen stops, every one of them a real building or monument, all of them
   with a five minute narration and none of them with a picture. This is where
   they get one.

   Same discipline as the museum models: real published dimensions or it does
   not get drawn, the style named before the geometry is chosen, and every
   large flat surface given an explicit painter depth, because a plane sorted
   on its own corners paints over whatever stands on it.

   Scenes are PURE. Each takes a context supplying project/poly/shade/
   faceVisible and returns {svg, depth} pieces, exactly like met-rooms.js, so
   render_room.js can draw one headlessly and it can be LOOKED AT before it
   ships. Nothing here has ever been trusted to arithmetic alone again.
*/
(function () {
  "use strict";

  function depthOf(pts) {
    var d = -1e9;
    for (var i = 0; i < pts.length; i++) if (pts[i][2] > d) d = pts[i][2];
    return d;
  }

  /* A square shaft that tapers straight from base to top. NOT a battered
     wall: an Egyptian temple leans about 0.075 and curves the eye inward,
     while an obelisk runs dead straight and is far subtler. Bunker Hill goes
     30 ft square to 15.4 ft square over 221 ft, a lean of 0.033, and getting
     that number from the published dimensions rather than by eye is the
     difference between an obelisk and a spike. */
  function taperedShaft(ctx, cx, cy, wBase, wTop, z0, h, fill, edge, depth) {
    var P = ctx.project, out = [];
    var b = wBase / 2, t = wTop / 2;
    var lo = [[cx-b,cy-b],[cx+b,cy-b],[cx+b,cy+b],[cx-b,cy+b]];
    var hi = [[cx-t,cy-t],[cx+t,cy-t],[cx+t,cy+t],[cx-t,cy+t]];
    var norm = [[0,-1],[1,0],[0,1],[-1,0]];
    for (var i = 0; i < 4; i++) {
      if (!ctx.faceVisible(norm[i][0], norm[i][1])) continue;
      var j = (i + 1) % 4;
      var q = [P(lo[i][0],lo[i][1],z0), P(lo[j][0],lo[j][1],z0),
               P(hi[j][0],hi[j][1],z0+h), P(hi[i][0],hi[i][1],z0+h)];
      out.push({ svg: ctx.poly(q, ctx.shade(fill, norm[i][0], norm[i][1], 0), edge, 0.6),
                 depth: (depth === undefined ? depthOf(q) : depth + i * 0.1) });
    }
    return out;
  }

  /* The pyramidion. An obelisk that ends flat is not an obelisk. */
  function pyramidion(ctx, cx, cy, w, z0, h, fill, edge) {
    var P = ctx.project, out = [], b = w / 2;
    var lo = [[cx-b,cy-b],[cx+b,cy-b],[cx+b,cy+b],[cx-b,cy+b]];
    var norm = [[0,-1],[1,0],[0,1],[-1,0]];
    var apex = P(cx, cy, z0 + h);
    for (var i = 0; i < 4; i++) {
      if (!ctx.faceVisible(norm[i][0], norm[i][1])) continue;
      var j = (i + 1) % 4;
      var tri = [P(lo[i][0],lo[i][1],z0), P(lo[j][0],lo[j][1],z0), apex];
      out.push({ svg: ctx.poly(tri, ctx.shade(fill, norm[i][0], norm[i][1], 0.25), edge, 0.6),
                 depth: depthOf(tri) });
    }
    return out;
  }

  function slab(ctx, cx, cy, w, d, z0, h, fill, edge, depth) {
    return taperedShaft(ctx, cx, cy, w, w, z0, h, fill, edge, depth);
  }

  function ground(ctx, cx, cy, w, d, z, fill, edge) {
    var P = ctx.project;
    var q = [P(cx-w/2, cy-d/2, z), P(cx+w/2, cy-d/2, z),
             P(cx+w/2, cy+d/2, z), P(cx-w/2, cy+d/2, z)];
    return { svg: ctx.poly(q, fill, edge, 0.5), depth: -1e9 };
  }

  /* ---------------- Stop 16: Bunker Hill Monument ----------------
     Solomon Willard, begun 1825, finished 1842, dedicated 17 June 1843.
     221 feet of Quincy granite, 30 feet square at the base tapering to 15.4
     at the top, all published. Quarried in Quincy and hauled by the Granite
     Railway, the first railroad chartered in the United States, in 1826.

     Egyptian Revival, which the styles book now carries: the form borrowed
     from Egypt for its permanence, cut plain in local granite, with no
     carving and no cornice. The shaft does all the work, so any ornament
     added here would be a different building. */
  function bunkerHill(ctx) {
    var GRANITE = "#9c9a95", G_EDGE = "#6f6d69", G_LIGHT = "#b0aea8";
    var PLAZA = "#ddd8cc", GRASS = "#c2c9b4";
    var cx = 0, cy = 0, out = [];

    out.push(ground(ctx, cx, cy, 190, 190, 0, GRASS, "#a8b09a"));
    out.push(ground(ctx, cx, cy, 96, 96, 0.4, PLAZA, "#bfb9aa"));

    /* the stepped granite plinth the shaft stands on */
    out = out.concat(slab(ctx, cx, cy, 52, 52, 0.4, 4, G_LIGHT, G_EDGE, -9.9e8));
    out = out.concat(slab(ctx, cx, cy, 42, 42, 4.4, 5, G_LIGHT, G_EDGE, -9.8e8));

    /* the shaft: the published taper, and the pyramidion that finishes it */
    var Z = 9.4, SHAFT = 221 - 18;
    out = out.concat(taperedShaft(ctx, cx, cy, 30, 15.4, Z, SHAFT, GRANITE, G_EDGE));
    out = out.concat(pyramidion(ctx, cx, cy, 15.4, Z + SHAFT, 18, G_LIGHT, G_EDGE));
    return out;
  }

  /* ---------------- shared parts, for the buildings ----------------
     A rectangular mass, back faces culled. Every face carries an explicit
     depth when one is given, because anything drawn ON a wall (a window, a
     door) has to paint after the wall, and a wall spanning seventy feet has
     a nearer corner than the little arch sitting in the middle of it. */
  function box(ctx, x0, x1, y0, y1, z0, z1, fill, edge, roofFill, depth) {
    var P = ctx.project, out = [];
    var faces = [
      { n: [0, -1], q: [[x0, y0], [x1, y0]] },
      { n: [1, 0],  q: [[x1, y0], [x1, y1]] },
      { n: [0, 1],  q: [[x1, y1], [x0, y1]] },
      { n: [-1, 0], q: [[x0, y1], [x0, y0]] }
    ];
    var walls = {};
    for (var i = 0; i < 4; i++) {
      var f = faces[i];
      if (!ctx.faceVisible(f.n[0], f.n[1])) continue;
      var a = f.q[0], b = f.q[1];
      var quad = [P(a[0], a[1], z0), P(b[0], b[1], z0), P(b[0], b[1], z1), P(a[0], a[1], z1)];
      var d = (depth === undefined) ? depthOf(quad) : depth + i * 0.1;
      out.push({ svg: ctx.poly(quad, ctx.shade(fill, f.n[0], f.n[1], 0), edge, 0.6), depth: d });
      walls[f.n[0] + "," + f.n[1]] = d;
    }
    if (roofFill) {
      var top = [P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)];
      out.push({ svg: ctx.poly(top, ctx.shade(roofFill, 0, 0, 1), edge, 0.6),
                 depth: (depth === undefined) ? depthOf(top) : depth + 0.5 });
    }
    return { parts: out, walls: walls };
  }

  /* A pitched roof over a rectangle, ridge running along y. Both slopes and
     both gable triangles, each culled on its own normal. */
  function gableRoof(ctx, x0, x1, y0, y1, zEave, zRidge, fill, edge, gableFill) {
    var P = ctx.project, out = [], xm = (x0 + x1) / 2;
    out.slopes = {};
    var slopes = [
      { n: [-1, 0], a: [x0, y0], b: [x0, y1] },
      { n: [1, 0],  a: [x1, y1], b: [x1, y0] }
    ];
    slopes.forEach(function (s) {
      var ra = (s.n[0] === -1) ? [[xm, y1], [xm, y0]] : [[xm, y0], [xm, y1]];
      var q = [P(s.a[0], s.a[1], zEave), P(s.b[0], s.b[1], zEave),
               P(ra[0][0], ra[0][1], zRidge), P(ra[1][0], ra[1][1], zRidge)];
      var d = depthOf(q);
      out.push({ svg: ctx.poly(q, ctx.shade(fill, s.n[0] * 0.5, 0, 0.8), edge, 0.6), depth: d });
      out.slopes[s.n[0] + ",0"] = d;
    });
    [[0, -1, y0], [0, 1, y1]].forEach(function (g) {
      if (!ctx.faceVisible(g[0], g[1])) return;
      var t = [P(x0, g[2], zEave), P(x1, g[2], zEave), P(xm, g[2], zRidge)];
      out.push({ svg: ctx.poly(t, ctx.shade(gableFill || fill, g[0], g[1], 0), edge, 0.6), depth: depthOf(t) });
    });
    return out;
  }

  /* A round headed opening: the Georgian tell, and the one shape that must
     never come out pointed. Struck as a true semicircle on the springing
     line, which is why the head is an arc of eleven segments and not two
     straight lines meeting at a peak. */
  function archOpening(ctx, map, uc, halfW, zBase, zSpring, fill, edge, depth) {
    var pts = [map(uc - halfW, zBase), map(uc - halfW, zSpring)], N = 11;
    for (var i = 0; i <= N; i++) {
      var a = Math.PI - i * Math.PI / N;
      pts.push(map(uc + halfW * Math.cos(a), zSpring + halfW * Math.sin(a)));
    }
    pts.push(map(uc + halfW, zBase));
    return { svg: ctx.poly(pts, fill, edge, 0.5), depth: depth };
  }

  /* An eight sided stage, tapering. The steeple's lanterns are octagons, and
     an octagon drawn as a cylinder loses the facets that catch the light. */
  function octStage(ctx, cx, cy, r0, r1, z0, z1, fill, edge, depth) {
    var P = ctx.project, out = [], N = 8;
    for (var i = 0; i < N; i++) {
      var a0 = (i / N) * Math.PI * 2, a1 = ((i + 1) / N) * Math.PI * 2;
      var nx = Math.cos((a0 + a1) / 2), ny = Math.sin((a0 + a1) / 2);
      if (!ctx.faceVisible(nx, ny)) continue;
      var q = [P(cx + r0 * Math.cos(a0), cy + r0 * Math.sin(a0), z0),
               P(cx + r0 * Math.cos(a1), cy + r0 * Math.sin(a1), z0),
               P(cx + r1 * Math.cos(a1), cy + r1 * Math.sin(a1), z1),
               P(cx + r1 * Math.cos(a0), cy + r1 * Math.sin(a0), z1)];
      out.push({ svg: ctx.poly(q, ctx.shade(fill, nx, ny, 0), edge, 0.5),
                 depth: (depth === undefined) ? depthOf(q) : depth + i * 0.01 });
    }
    return out;
  }

  function octSpire(ctx, cx, cy, r, z0, zTop, fill, edge) {
    var P = ctx.project, out = [], N = 8, apex = P(cx, cy, zTop);
    for (var i = 0; i < N; i++) {
      var a0 = (i / N) * Math.PI * 2, a1 = ((i + 1) / N) * Math.PI * 2;
      var nx = Math.cos((a0 + a1) / 2), ny = Math.sin((a0 + a1) / 2);
      if (!ctx.faceVisible(nx, ny)) continue;
      var t = [P(cx + r * Math.cos(a0), cy + r * Math.sin(a0), z0),
               P(cx + r * Math.cos(a1), cy + r * Math.sin(a1), z0), apex];
      out.push({ svg: ctx.poly(t, ctx.shade(fill, nx, ny, 0.3), edge, 0.5), depth: depthOf(t) });
    }
    return out;
  }

  /* ---------------- Stop 12: Old North Church ----------------
     Christ Church in the City of Boston, 1723, steeple 1740. Georgian, read
     off Wren's London churches by a colonial builder: a plain brick box with
     every ambition spent on the steeple.

     PUBLISHED, and load bearing here: the body is 96.5 by 51.5 ft, the nave
     70 by 51 and 42 ft high, the steeple rises 191 ft above ground, the brick
     walls are 2.5 ft thick and the tower's are 3.5. The tower block therefore
     takes 96.5 - 70 = 26.5 ft of the length, which is a subtraction, not a
     guess, and it sets the tower's footprint.

     DERIVED, and said out loud rather than buried: the roof pitch, and where
     the 191 ft divides between brick tower, belfry, three octagonal lanterns
     and spire. No source publishes that split. It is set by proportion from
     the published total and the church's own description of a three tiered
     spire, and it is the only soft number in the model.

     Sources also disagree about the first steeple, which several give as 175
     ft while the church says the 1806 replacement stood fifteen feet shorter
     than the 1740 original. 191 is what stands now, and 191 is what is drawn. */
  function oldNorth(ctx) {
    var BRICK = "#9a4b3a", BRICK_E = "#6d3327", TRIM = "#f2ede1", TRIM_E = "#b9b0a0";
    var ROOF = "#7b6f63", ROOF_E = "#574e45", GLASS = "#3f4d55", GOLD = "#c9a22c";
    var PAVE = "#ded8cb", GRASS = "#c2c9b4";
    var out = [];

    /* plan, straight off the published rectangle */
    var W = 51.5, LEN = 96.5, TOWER = 26.5;
    var x0 = -W / 2, x1 = W / 2;
    var yFront = -LEN / 2, yTowerBack = yFront + TOWER, yBack = LEN / 2;
    var EAVE = 42, RIDGE = EAVE + 14;

    out.push(ground(ctx, 0, 0, 210, 210, 0, GRASS, "#a8b09a"));
    out.push(ground(ctx, 0, 0, 118, 150, 0.4, PAVE, "#bfb9aa"));

    /* the nave: brick box, gable roof */
    var body = box(ctx, x0, x1, yTowerBack, yBack, 0.4, EAVE, BRICK, BRICK_E, null);
    out = out.concat(body.parts);
    out = out.concat(gableRoof(ctx, x0, x1, yTowerBack, yBack, EAVE, RIDGE, ROOF, ROOF_E, BRICK));

    /* two levels of arched sash windows, which is the published description
       of the front and the rhythm the long walls keep. Six bays over the 70
       ft nave, both levels round headed. */
    [[-1, x0], [1, x1]].forEach(function (side) {
      if (!ctx.faceVisible(side[0], 0)) return;
      var X = side[1], d = body.walls[side[0] + ",0"];
      if (d === undefined) return;
      var map = function (u, z) { return ctx.project(X, u, z); };
      for (var b = 0; b < 6; b++) {
        var yc = yTowerBack + 70 * (b + 0.5) / 6;
        out.push(archOpening(ctx, map, yc, 3.2, 7, 15, GLASS, TRIM_E, d + 0.4));
        out.push(archOpening(ctx, map, yc, 3.2, 23, 31, GLASS, TRIM_E, d + 0.4));
      }
    });

    /* the tower, in brick, standing on its own 26.5 ft square footprint */
    var tx0 = -TOWER / 2, tx1 = TOWER / 2;
    var BRICK_TOP = 70;
    var tower = box(ctx, tx0, tx1, yFront, yTowerBack, 0.4, BRICK_TOP, BRICK, BRICK_E, null);
    out = out.concat(tower.parts);

    /* the front: the door, and the arched window over it, both centred,
       because a Georgian front that is not symmetrical is not Georgian */
    if (ctx.faceVisible(0, -1)) {
      var dF = tower.walls["0,-1"];
      var mapF = function (u, z) { return ctx.project(u, yFront, z); };
      out.push(archOpening(ctx, mapF, 0, 4, 0.4, 11, "#4a3a30", BRICK_E, dF + 0.4));
      out.push(archOpening(ctx, mapF, 0, 3.4, 20, 27, GLASS, TRIM_E, dF + 0.4));
      out.push(archOpening(ctx, mapF, 0, 2.6, 44, 49, GLASS, TRIM_E, dF + 0.4));
    }
    /* the same window on whichever tower flank is turned to us */
    [[-1, tx0], [1, tx1]].forEach(function (side) {
      var d = tower.walls[side[0] + ",0"];
      if (d === undefined) return;
      var X = side[1];
      var map = function (u, z) { return ctx.project(X, u, z); };
      var yc = (yFront + yTowerBack) / 2;
      out.push(archOpening(ctx, map, yc, 3.4, 20, 27, GLASS, TRIM_E, d + 0.4));
      out.push(archOpening(ctx, map, yc, 2.6, 44, 49, GLASS, TRIM_E, d + 0.4));
    });

    /* the wooden steeple, in diminishing stages. This is the whole point of
       the building: belfry, then three octagonal lanterns, then the spire. */
    var BELF0 = BRICK_TOP, BELF1 = 96;
    var bw = 22, bx0 = -bw / 2, bx1 = bw / 2;
    var by0 = -bw / 2 + (yFront + yTowerBack) / 2, by1 = bw / 2 + (yFront + yTowerBack) / 2;
    var belf = box(ctx, bx0, bx1, by0, by1, BELF0, BELF1, TRIM, TRIM_E, null);
    out = out.concat(belf.parts);
    /* the open bell chamber: eight bells of 1744, the oldest in North
       America, and the arches they speak through */
    var faces = [[0, -1], [0, 1], [-1, 0], [1, 0]];
    faces.forEach(function (n) {
      var d = belf.walls[n[0] + "," + n[1]];
      if (d === undefined) return;
      var map = n[0] === 0
        ? function (u, z) { return ctx.project(u, n[1] < 0 ? by0 : by1, z); }
        : function (u, z) { return ctx.project(n[0] < 0 ? bx0 : bx1, u, z); };
      var c = n[0] === 0 ? 0 : (by0 + by1) / 2;
      out.push(archOpening(ctx, map, c, 5, BELF0 + 4, BELF0 + 14, "#2f3a40", TRIM_E, d + 0.4));
    });

    /* the clock stage, square and blank, that steps the tower in */
    var CLK0 = BELF1, CLK1 = 108;
    out = out.concat(box(ctx, -9, 9, by0 + 2, by1 - 2, CLK0, CLK1, TRIM, TRIM_E, null).parts);

    /* three lanterns, each smaller than the one below */
    var cy = (by0 + by1) / 2;
    out = out.concat(octStage(ctx, 0, cy, 9, 8.2, CLK1, 130, TRIM, TRIM_E));
    out = out.concat(octStage(ctx, 0, cy, 7.6, 6.8, 130, 148, TRIM, TRIM_E));
    out = out.concat(octStage(ctx, 0, cy, 6.2, 5.4, 148, 162, TRIM, TRIM_E));

    /* the spire, and the gilt vane that has been turning up there since the
       steeple went up in 1740 */
    out = out.concat(octSpire(ctx, 0, cy, 5.4, 162, 185, TRIM, TRIM_E));
    out = out.concat(octStage(ctx, 0, cy, 1.1, 1.1, 185, 187, GOLD, "#8a6f18"));
    var P = ctx.project;
    var vane = [P(-4, cy, 188), P(4, cy, 189.6), P(4, cy, 190.6), P(-4, cy, 191)];
    out.push({ svg: ctx.poly(vane, GOLD, "#8a6f18", 0.5), depth: 1e8 });
    return out;
  }

  /* A flat rectangle lying ON a wall face, in that wall's own (u, z)
     coordinates: a pilaster, a band, a plain sash. It always takes the wall's
     depth plus an offset, because a wall eighty feet long has a nearer corner
     than the strip painted in the middle of it. */
  function panel(ctx, map, u0, u1, z0, z1, fill, edge, depth) {
    return { svg: ctx.poly([map(u0, z0), map(u1, z0), map(u1, z1), map(u0, z1)],
                           fill, edge, 0.4), depth: depth };
  }

  /* A dome, as rings of octagon that follow a circular profile. Drawn as one
     cone it would be a spire, and a Federal cupola that ends in a spire is a
     church. */
  function domeCap(ctx, cx, cy, r, z0, h, fill, edge, depth) {
    var out = [], N = 5, prevR = r, prevZ = z0;
    for (var i = 1; i <= N; i++) {
      var a = (i / N) * Math.PI / 2;
      var rr = r * Math.cos(a), zz = z0 + h * Math.sin(a);
      out = out.concat(octStage(ctx, cx, cy, prevR, Math.max(rr, 0.2), prevZ, zz, fill, edge,
                                depth === undefined ? undefined : depth + i * 0.2));
      prevR = rr; prevZ = zz;
    }
    return out;
  }

  /* ---------------- Stop 4: Faneuil Hall ----------------
     Built 1742 to John Smibert's design, gutted by fire in 1761 and rebuilt
     inside its own brick shell, then doubled by Charles Bulfinch in 1805 to
     1806. Federal, and the styles book carries the tells.

     PUBLISHED, from the Boston Landmarks Commission study report and load
     bearing here: "three-and-a-half stories in height, seven bays in width,
     and nine bays in depth"; the market floor "measures 76 x 100 feet"; the
     Great Hall "approximately 76 feet square with a ceiling height of 28
     feet"; the attic hall "48x76 foot"; "Five copper-clad, barrel-shaped
     dormers pierce both slopes of the slate-tiled roof"; the orders run
     "Tuscan at the base, Doric at the second-story level, and Ionic at the
     third story", "paired at the outer ends"; the ground floor was "an open
     arcaded space" whose "truncated arched openings are currently lit with
     10/10 sash windows"; the upper windows are "elongated compass-headed
     sash, with the exception of the third-story level of the lateral walls";
     everything is "painted an off-white shade which contrasts strikingly
     against the red brick surface", with "granite pilaster bases at market
     level"; and the east front "is surmounted by a domed cupola resting on a
     quoined base", the belfry "a series of arches segregated by fluted Ionic
     pilasters", the gilded grasshopper on top of the gilded dome. The vane is
     52 inches long and 38 pounds, Shem Drowne, 1742.

     The 76 ft inside the walls is the 80 ft outside that every account gives
     for Bulfinch doubling the original 40 ft width, so the footprint drawn is
     80 by 100 and it is a subtraction, not a guess. Seven bays over 80 ft and
     nine over 100 both come out at about 11.2 ft, which is the check.

     DERIVED, and said out loud: floor-to-floor heights and the cupola's own
     height. Nobody publishes either. They are proportioned from the one
     published vertical dimension, the Great Hall's 28 ft ceiling. */
  function faneuilHall(ctx) {
    var BRICK = "#9c4e3c", BRICK_E = "#6d3327", TRIM = "#f1ece0", TRIM_E = "#b3aa99";
    var GRANITE = "#b9b5aa", SLATE = "#69707a", SLATE_E = "#464c55";
    var GLASS = "#42505a", DOOR = "#4a3a30", GOLD = "#c9a22c", GOLD_E = "#8a6f18";
    var PAVE = "#ded8cb";
    var out = [], P = ctx.project;

    /* the published plan: 80 wide (7 bays), 100 deep (9 bays), east front */
    var W = 80, LEN = 100, NX = 7, NY = 9;
    var x0 = -W / 2, x1 = W / 2, yE = -LEN / 2, yW = LEN / 2;

    /* derived storey lines, from the published 28 ft hall ceiling */
    var Z0 = 0.5, Z1 = 15, Z2 = 31, EAVE = 45, RIDGE = 66;

    out.push(ground(ctx, 0, 0, 230, 250, 0, PAVE, "#bfb9aa"));

    var body = box(ctx, x0, x1, yE, yW, Z0, EAVE, BRICK, BRICK_E, null);
    out = out.concat(body.parts);

    var roof = gableRoof(ctx, x0, x1, yE, yW, EAVE, RIDGE, SLATE, SLATE_E, BRICK);
    var slopes = roof.slopes;
    out = out.concat(roof);

    /* Every elevation gets the same treatment, which is the whole point of a
       Federal front: the bays are ruled, not suggested. A face is described
       once here and drawn wherever it is turned towards us. */
    var faces = [
      { n: [-1, 0], k: "-1,0", n0: NY, a: yE, b: yW,
        map: function (u, z) { return P(x0, u, z); } },
      { n: [1, 0], k: "1,0", n0: NY, a: yE, b: yW,
        map: function (u, z) { return P(x1, u, z); } },
      { n: [0, -1], k: "0,-1", n0: NX, a: x0, b: x1, front: true,
        map: function (u, z) { return P(u, yE, z); } },
      { n: [0, 1], k: "0,1", n0: NX, a: x0, b: x1,
        map: function (u, z) { return P(u, yW, z); } }
    ];

    faces.forEach(function (f) {
      var d = body.walls[f.k];
      if (d === undefined) return;
      var lateral = (f.n[0] !== 0);
      var span = f.b - f.a, step = span / f.n0, half = step / 2;

      /* the granite base course the pilasters stand on */
      out.push(panel(ctx, f.map, f.a, f.b, Z0, Z0 + 2.5, GRANITE, TRIM_E, d + 0.2));

      for (var i = 0; i < f.n0; i++) {
        var uc = f.a + step * (i + 0.5);
        var mid = (f.n0 - 1) / 2;

        /* market level: the arcade, glazed in 1806, and the doors of the east
           front. The report gives paneled doors in the central five bays. */
        var isDoor = f.front && Math.abs(i - mid) <= 2;
        out.push(archOpening(ctx, f.map, uc, half * 0.34,
                             isDoor ? Z0 + 2.5 : Z0 + 5.5, Z1 - 3,
                             isDoor ? DOOR : GLASS, TRIM_E, d + 0.5));

        /* second story: elongated compass-headed sash, every bay */
        out.push(archOpening(ctx, f.map, uc, half * 0.30, Z1 + 3, Z2 - 3.5,
                             GLASS, TRIM_E, d + 0.5));

        /* third story: compass-headed on the ends, square-headed on the long
           walls, which is the exception the report calls out by name */
        if (lateral) {
          out.push(panel(ctx, f.map, uc - half * 0.30, uc + half * 0.30,
                         Z2 + 3, EAVE - 4, GLASS, TRIM_E, d + 0.5));
        } else {
          out.push(archOpening(ctx, f.map, uc, half * 0.30, Z2 + 3, EAVE - 5,
                               GLASS, TRIM_E, d + 0.5));
        }
      }

      /* the pilasters: one on every bay division and PAIRED at the outer
         ends, so the corners read heavier than the middle. Tuscan, Doric,
         Ionic bottom to top; at this size the orders show as widths, and the
         hierarchy shows as the bands between them. */
      var pw = step * 0.11;
      var us = [];
      for (var j = 0; j <= f.n0; j++) us.push(f.a + step * j);
      us.push(f.a + pw * 2.4); us.push(f.b - pw * 2.4);
      us.forEach(function (u) {
        var lo = Math.max(u - pw, f.a), hi = Math.min(u + pw, f.b);
        out.push(panel(ctx, f.map, lo, hi, Z0 + 2.5, Z1, TRIM, TRIM_E, d + 0.3));
        out.push(panel(ctx, f.map, lo + pw * 0.12, hi - pw * 0.12, Z1, Z2, TRIM, TRIM_E, d + 0.3));
        out.push(panel(ctx, f.map, lo + pw * 0.24, hi - pw * 0.24, Z2, EAVE, TRIM, TRIM_E, d + 0.3));
      });

      /* the entablature over each order, and the cornice at the eaves */
      out.push(panel(ctx, f.map, f.a, f.b, Z1 - 2.2, Z1, TRIM, TRIM_E, d + 0.35));
      out.push(panel(ctx, f.map, f.a, f.b, Z2 - 2, Z2, TRIM, TRIM_E, d + 0.35));
      out.push(panel(ctx, f.map, f.a, f.b, EAVE - 2.4, EAVE, TRIM, TRIM_E, d + 0.35));
    });

    /* five barrel dormers on each slope, the published count. A dormer sits ON
       the slope, so it takes the slope's own depth plus an offset. */
    [[-1, x0], [1, x1]].forEach(function (s) {
      var sd = slopes[s[0] + ",0"];
      if (sd === undefined) return;
      /* gableRoof draws BOTH slopes and lets the painter sort them, so the
         dormers have to cull themselves. The picture is what caught this: the
         far slope's five were floating in the sky past the roofline, because
         nothing was in front of them to hide them. */
      if (!ctx.faceVisible(s[0], 0)) return;
      var t = 0.42;                       /* how far up the slope they sit */
      var xd = s[1] * (1 - t), zd = EAVE + (RIDGE - EAVE) * t;
      for (var i = 0; i < 5; i++) {
        var yc = yE + LEN * (i + 0.5) / 5;
        var map = (function (X) {
          return function (u, z) { return P(X, u, z); };
        })(xd);
        out.push(archOpening(ctx, map, yc, 3.4, zd, zd + 5.6, TRIM, TRIM_E, sd + 0.6));
        out.push(archOpening(ctx, map, yc, 2.2, zd + 1, zd + 4.8, GLASS, TRIM_E, sd + 0.7));
      }
    });

    /* the cupola, over the east end where Bulfinch moved it, not the middle:
       quoined square base, open arched belfry, gilded dome, grasshopper. */
    var cy = yE + 15, CB0 = 56, CB1 = 78, cw = 17, CUP = 3e7;
    /* CUP: the cupola stands ON the roof, and the roof is a plane spanning the
       whole building, so its nearest corner beats anything sitting in the
       middle of it. Sorted on its own corners the cupola was buried to the
       shoulders and the dome floated free above the slate. Explicit depth. */
    var base = box(ctx, -cw / 2, cw / 2, cy - cw / 2, cy + cw / 2, CB0, CB1, TRIM, TRIM_E, null, CUP);
    out = out.concat(base.parts);

    /* the quoins, which are what makes it a quoined base rather than a box */
    [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(function (n) {
      var d = base.walls[n[0] + "," + n[1]];
      if (d === undefined) return;
      var a = n[0] === 0 ? -cw / 2 : cy - cw / 2, b = n[0] === 0 ? cw / 2 : cy + cw / 2;
      var map = n[0] === 0
        ? function (u, z) { return P(u, n[1] < 0 ? cy - cw / 2 : cy + cw / 2, z); }
        : function (u, z) { return P(n[0] < 0 ? -cw / 2 : cw / 2, u, z); };
      for (var q = 0; q < 5; q++) {
        var z = CB1 - 4 - q * 4;
        if (z < CB0) break;
        var wq = (q % 2) ? 1.6 : 2.6;
        out.push(panel(ctx, map, a, a + wq, z, z + 2.4, GRANITE, TRIM_E, d + 0.03));
        out.push(panel(ctx, map, b - wq, b, z, z + 2.4, GRANITE, TRIM_E, d + 0.03));
      }
    });

    /* the open belfry: an arch on every face, with the piers between them */
    var BF0 = 78, BF1 = 96, bw = 14;
    var belf = box(ctx, -bw / 2, bw / 2, cy - bw / 2, cy + bw / 2, BF0, BF1, TRIM, TRIM_E, null,
                   CUP + 1000);
    out = out.concat(belf.parts);
    [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(function (n) {
      var d = belf.walls[n[0] + "," + n[1]];
      if (d === undefined) return;
      var map = n[0] === 0
        ? function (u, z) { return P(u, n[1] < 0 ? cy - bw / 2 : cy + bw / 2, z); }
        : function (u, z) { return P(n[0] < 0 ? -bw / 2 : bw / 2, u, z); };
      var c = n[0] === 0 ? 0 : cy;
      out.push(archOpening(ctx, map, c, 4.4, BF0 + 3, BF0 + 9.5, "#2f3a40", TRIM_E, d + 0.05));
    });
    out.push({ svg: ctx.poly([P(-bw / 2 - 1.2, cy - bw / 2 - 1.2, BF1),
                              P(bw / 2 + 1.2, cy - bw / 2 - 1.2, BF1),
                              P(bw / 2 + 1.2, cy + bw / 2 + 1.2, BF1),
                              P(-bw / 2 - 1.2, cy + bw / 2 + 1.2, BF1)],
                             ctx.shade(TRIM, 0, 0, 1), TRIM_E, 0.5), depth: CUP + 2000 });

    /* the gilded dome, and the finial the vane turns on */
    out = out.concat(domeCap(ctx, 0, cy, 7.6, BF1, 9, GOLD, GOLD_E, CUP + 3000));
    out = out.concat(octStage(ctx, 0, cy, 0.8, 0.8, BF1 + 9, BF1 + 12.5, GOLD, GOLD_E, CUP + 4000));

    /* Shem Drowne's grasshopper, 1742: 52 inches long, 38 pounds, and the one
       dimension of the cupola that anybody publishes. 52 in is 4.33 ft. */
    var gz = BF1 + 12.5, GL = 4.33;
    var g = [P(-GL / 2, cy, gz + 0.9), P(-GL * 0.15, cy, gz + 1.9),
             P(GL * 0.30, cy, gz + 1.7), P(GL / 2, cy, gz + 0.5),
             P(GL * 0.30, cy, gz + 0.9), P(GL * 0.05, cy, gz),
             P(-GL * 0.20, cy, gz + 0.7), P(-GL * 0.42, cy, gz + 0.2)];
    out.push({ svg: ctx.poly(g, GOLD, GOLD_E, 0.4), depth: CUP + 5000 });
    return out;
  }

  var SCENES = { "bunker-hill": bunkerHill, "old-north": oldNorth,
                 "faneuil-hall": faneuilHall };

  /* The live mount: same hand-rolled projection as the other models, so a
     trail stop weighs a few kilobytes and needs no library. */
  function mount(host, key, opts) {
    var o = opts || {};
    var yaw = o.yaw == null ? -0.62 : o.yaw, pitch = o.pitch == null ? 0.30 : o.pitch;
    var LIGHT = [0.60, 0.30, 0.68];
    var idle = true, raf = null;

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
      idle = false; host.__lx = e.clientX;
      host.setPointerCapture && host.setPointerCapture(e.pointerId);
    });
    host.addEventListener("pointermove", function (e) {
      if (host.__lx == null || idle) return;
      yaw += (e.clientX - host.__lx) * 0.006; host.__lx = e.clientX; draw();
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (ev) {
      host.addEventListener(ev, function () { host.__lx = null; });
    });
    /* the slow idle turn stops the moment anyone takes hold, and never runs
       for a reader who asked their device to stop animating */
    var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    (function spin() {
      if (idle && !still) { yaw += 0.0016; draw(); }
      raf = requestAnimationFrame(spin);
    })();
    return { redraw: draw };
  }

  window.TRAIL3D = { scenes: SCENES, mount: mount };
})();
