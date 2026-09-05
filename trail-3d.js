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

  /* A pitched roof that a tower comes up through, drawn in strips along the
     ridge so the depth sort can put the tower between them.

     WHY THIS EXISTS. gableRoof draws each slope as one plane running the
     whole length of the building, and a painter's depth is a face's NEAREST
     point. The Old State House tower stands at the far end, so the single
     near slope, whose nearest corner is the eave at the reader's end, sorted
     after the tower and painted straight over its base. The tower came back
     from the renderer hanging in the sky behind the roof with nothing under
     it. Cutting the slope into strips gives each strip its own honest depth,
     the far strips paint first, the tower next, the near strips last, and
     the roof reads as carrying it.

     The cut is geometric as well as a sorting trick: where the tower stands
     there is no roof, only the strip left over each side of it, which is why
     the span across the tower stops at cutHW instead of running to the
     ridge. */
  function gableRoofCut(ctx, x0, x1, y0, y1, zEave, zRidge, fill, edge, gableFill, cutY0, cutY1, cutHW) {
    var P = ctx.project, out = [], xm = (x0 + x1) / 2, halfW = (x1 - x0) / 2;
    var zAt = function (xa) { return zRidge - (Math.abs(xa - xm) / halfW) * (zRidge - zEave); };

    /* the spans along the ridge: before the tower, across it, and after */
    var cuts = [[y0, cutY0, false], [cutY0, cutY1, true], [cutY1, y1, false]];
    var spans = [];
    cuts.forEach(function (c) {
      if (c[1] - c[0] <= 0.01) return;
      var n = Math.max(1, Math.round((c[1] - c[0]) / 18));
      for (var i = 0; i < n; i++) {
        spans.push([c[0] + (c[1] - c[0]) * i / n, c[0] + (c[1] - c[0]) * (i + 1) / n, c[2]]);
      }
    });

    [-1, 1].forEach(function (sgn) {
      var xEave = xm + sgn * halfW;
      spans.forEach(function (s) {
        var xIn = s[2] ? xm + sgn * cutHW : xm;
        var q = [P(xEave, s[0], zEave), P(xEave, s[1], zEave),
                 P(xIn, s[1], zAt(xIn)), P(xIn, s[0], zAt(xIn))];
        out.push({ svg: ctx.poly(q, ctx.shade(fill, sgn * 0.5, 0, 0.8), edge, 0.6), depth: depthOf(q) });
      });
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

  /* A CIRCULAR window, struck as a true circle on a wall's own (u, z) map.
     Bowen says "circular windows" on the bell story and on both octagons, and
     a round HEADED opening is a different shape: it has straight jambs and a
     sill. Drawn as a 16-gon, which at these sizes is a circle. */
  function roundWindow(ctx, map, uc, zc, r, fill, edge, depth) {
    var pts = [], N = 16;
    for (var i = 0; i < N; i++) {
      var a = i * Math.PI * 2 / N;
      pts.push(map(uc + r * Math.cos(a), zc + r * Math.sin(a)));
    }
    return { svg: ctx.poly(pts, fill, edge, 0.5), depth: depth };
  }

  /* The detailing that makes an octagonal lantern read as a storey rather
     than as a length of cone: a column on each of its eight corners, and a
     circular window on four of its eight faces. Both counts are published for
     both of Park Street's octagons, and drawing neither is what made them
     read as one taper. Columns are placed on the PLAN, once, and drawn only
     where their own facet faces us. colR 0 draws windows only. */
  function octDetail(ctx, cx, cy, r, z0, z1, colR, winR, fill, edge) {
    var out = [], N = 8, P = ctx.project;
    for (var i = 0; i < N; i++) {
      var a0 = (i / N) * Math.PI * 2, a1 = ((i + 1) / N) * Math.PI * 2;
      var am = (a0 + a1) / 2, nx = Math.cos(am), ny = Math.sin(am);
      if (!ctx.faceVisible(nx, ny)) continue;
      /* the facet's own depth, so its trim sorts with it and not through it */
      var d = depthOf([P(cx + r * Math.cos(a0), cy + r * Math.sin(a0), z0),
                       P(cx + r * Math.cos(a1), cy + r * Math.sin(a1), z1)]);
      if (winR > 0 && i % 2 === 0) {
        /* the window sits at the middle of the facet, on that facet's plane */
        var ux = -Math.sin(am), uy = Math.cos(am);
        var wx = cx + r * Math.cos(am) * 0.995, wy = cy + r * Math.sin(am) * 0.995;
        var zc = z0 + (z1 - z0) * 0.55;
        out.push(roundWindow(ctx, function (u, z) {
          return P(wx + ux * u, wy + uy * u, z);
        }, 0, zc, winR, "#2f3a40", edge, d + 0.4));
      }
      if (colR > 0) {
        /* one column on each end of the facet: eight over the eight corners */
        [a0, a1].forEach(function (a, k) {
          out = out.concat(columnAt(ctx, cx + r * Math.cos(a), cy + r * Math.sin(a),
                                    colR, z0, z1, fill, edge, d + 0.8 + k * 0.05));
        });
      }
    }
    return out;
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

  /* ---------------- Stop 13: Old North Church ----------------
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

  /* ---------------- Stop 11: Faneuil Hall ----------------
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

  /* A column, as an octagonal prism with a base and a capital. Eight facets
     catch the light where a flat rectangle would read as a stripe, and at
     twelve columns across a 94 ft portico the facets are what say "round". */
  function columnAt(ctx, cx, cy, r, z0, z1, fill, edge, depth) {
    var out = octStage(ctx, cx, cy, r * 1.28, r * 1.28, z0, z0 + r * 0.5, fill, edge, depth);
    out = out.concat(octStage(ctx, cx, cy, r, r * 0.86, z0 + r * 0.5, z1 - r * 1.1, fill, edge,
                              depth === undefined ? undefined : depth + 0.2));
    out = out.concat(octStage(ctx, cx, cy, r * 1.30, r * 1.30, z1 - r * 1.1, z1, fill, edge,
                              depth === undefined ? undefined : depth + 0.4));
    return out;
  }

  /* A balustrade, read as a rail on posts rather than modelled baluster by
     baluster. Drawn on a wall's own (u, z) map, at that wall's depth. */
  function balustrade(ctx, map, u0, u1, z0, z1, fill, edge, depth) {
    var out = [], n = Math.max(3, Math.round((u1 - u0) / 3.2)), step = (u1 - u0) / n;
    out.push(panel(ctx, map, u0, u1, z1 - 0.9, z1, fill, edge, depth));
    out.push(panel(ctx, map, u0, u1, z0, z0 + 0.7, fill, edge, depth));
    for (var i = 0; i <= n; i++) {
      var u = u0 + step * i;
      out.push(panel(ctx, map, u - 0.35, u + 0.35, z0 + 0.7, z1 - 0.9, fill, edge, depth + 0.05));
    }
    return out;
  }

  /* ---------------- Stop 2: the Massachusetts State House ----------------
     Charles Bulfinch, 1795 to 1798. Federal, and the styles book already
     carries the tells; this is the second building in that style and does not
     restate them.

     PUBLISHED, and unusually complete, because the building described itself
     the week it opened. The Columbian Centinel of 10 January 1798, reproduced
     in the National Historic Landmark nomination (NRHP 66000771):

       "an oblong building, 173 feet front, and 61 deep, it consists
        externally of a basement story, 20 feet high, and a principal story 30
        feet. This in the center of the front south is crowned with an Attic 60
        feet wide, 20 feet high, which is covered with a pediment: Immediately
        above this rises a dome 50 feet diameter and 30 feet high, the whole
        terminated with an elegant circular lanthorn, supporting a gilt pine
        cone ... The basement story is finished plain on the wings with square
        windows. The centre (portico of the south front) is 94 feet in length,
        and formed of arches which project 14 feet; they form a covered wall
        below, and support a Colonade of Corinthian columns of the same extent
        above. The outside walls are of large patent bricks, with white marble
        fascias, imposts and key stones."

     Every one of those numbers is in the model. The wings are what is left
     over: (173 - 94) / 2 = 39.5 ft each, a subtraction rather than a guess.

     COUNTED, because the 1798 writer gave extents and not counts, and a
     photograph is a published document too. From a frontal view on Wikimedia
     Commons: SEVEN arches in the arcade, TWELVE Corinthian columns above them
     COUPLED IN PAIRS at both ends with four singles between, and THREE bays to
     each wing. The counts check the dimensions rather than contradicting them:
     at the scale the 94 ft colonnade sets in that photograph, the pediment
     measures 60.4 ft against the published 60, and the twelve columns come out
     at 2.5 ft thick, which is the 30 inch diameter the Commonwealth gives for
     the pine logs the originals were turned from.

     DERIVED, and said out loud: the pediment's own rise, the height of the
     lanthorn, and how far back the dome sits. The 1798 account gives none of
     the three. The often quoted 155 ft is measured from the street below the
     hill and is not what this model claims. */
  function stateHouse(ctx) {
    var BRICK = "#a8523c", BRICK_E = "#7a3527", TRIM = "#f4f0e6", TRIM_E = "#b8b0a0";
    var GOLD = "#c9a22c", GOLD_E = "#8a6f18", GLASS = "#3f4d57", DOOR = "#4a3a30";
    var LAWN = "#c2c9b4", PAVE = "#ded8cb";
    var out = [], P = ctx.project;

    /* the published plan */
    var W = 173, D = 61, PORT = 94, PROJ = 14, ATT = 60;
    var x0 = -W / 2, x1 = W / 2, yF = -D / 2, yB = D / 2;
    var px0 = -PORT / 2, px1 = PORT / 2, pyF = yF - PROJ;

    /* the published elevation: 20 ft basement, 30 ft principal story */
    var BASE = 20, PRIN = 50, CORN = 54;
    var ATT0 = 50, ATT1 = 70, PED = 80;        /* attic 20 ft, pediment derived */
    var DOME0 = 72, DOME_H = 30, DOME_R = 25;  /* dome 50 ft across, 30 ft high */

    out.push(ground(ctx, 0, -6, 300, 260, 0, LAWN, "#a8b09a"));
    out.push(ground(ctx, 0, pyF - 26, 150, 46, 0.3, PAVE, "#bfb9aa"));

    var body = box(ctx, x0, x1, yF, yB, 0, PRIN, BRICK, BRICK_E, "#8d8478");

    out = out.concat(body.parts);

    /* THE WINGS: three bays each, square windows below and tall round headed
       ones above, which is exactly what the 1798 notice describes. The centre
       94 ft is skipped because the portico stands in front of it. */
    var dF = body.walls["0,-1"];
    if (dF !== undefined) {
      var mapF = function (u, z) { return P(u, yF, z); };
      [[x0, px0], [px1, x1]].forEach(function (wing) {
        var a = wing[0], b = wing[1], step = (b - a) / 3;
        for (var i = 0; i < 3; i++) {
          var uc = a + step * (i + 0.5);
          out.push(panel(ctx, mapF, uc - 3.2, uc + 3.2, 5, 15, GLASS, TRIM_E, dF + 0.4));
          out.push(archOpening(ctx, mapF, uc, 3.6, 24, 34, GLASS, TRIM_E, dF + 0.4));
        }
        /* the marble string course between the two storeys, and the
           balustrade along the wing's roofline */
        out.push(panel(ctx, mapF, a, b, BASE, BASE + 1.4, TRIM, TRIM_E, dF + 0.3));
        out.push(panel(ctx, mapF, a, b, PRIN - 2, PRIN, TRIM, TRIM_E, dF + 0.3));
        out = out.concat(balustrade(ctx, mapF, a + 1, b - 1, PRIN, CORN, TRIM, TRIM_E, dF + 0.35));
      });
      /* The centre 94 ft is not blank behind the colonnade: the photograph
         shows five tall windows and a fanlight over each, standing between the
         columns. They take the WALL's depth, so the columns paint over them. */
      for (var c = 0; c < 5; c++) {
        var cxw = px0 + PORT * (c + 0.5) / 5;
        out.push(panel(ctx, mapF, cxw - 3.6, cxw + 3.6, 24, 40, GLASS, TRIM_E, dF + 0.4));
        out.push(panel(ctx, mapF, cxw - 4.2, cxw + 4.2, 40, 41.4, TRIM, TRIM_E, dF + 0.45));
        out.push(archOpening(ctx, mapF, cxw, 2.6, 43, 46, GLASS, TRIM_E, dF + 0.4));
      }
    }

    /* the same treatment on whichever flank is turned towards us: the 61 ft
       depth takes two bays of the same rhythm */
    [[-1, x0], [1, x1]].forEach(function (side) {
      var d = body.walls[side[0] + ",0"];
      if (d === undefined) return;
      var X = side[1];
      var map = function (u, z) { return P(X, u, z); };
      for (var i = 0; i < 2; i++) {
        var yc = yF + D * (i + 0.5) / 2;
        out.push(panel(ctx, map, yc - 3.2, yc + 3.2, 5, 15, GLASS, TRIM_E, d + 0.4));
        out.push(archOpening(ctx, map, yc, 3.6, 24, 34, GLASS, TRIM_E, d + 0.4));
      }
      out.push(panel(ctx, map, yF, yB, BASE, BASE + 1.4, TRIM, TRIM_E, d + 0.3));
      out.push(panel(ctx, map, yF, yB, PRIN - 2, PRIN, TRIM, TRIM_E, d + 0.3));
      out = out.concat(balustrade(ctx, map, yF + 1, yB - 1, PRIN, CORN, TRIM, TRIM_E, d + 0.35));
    });

    /* THE PORTICO, 94 ft long and projecting 14: the arcade that forms the
       covered walk, at an explicit depth because it stands in front of a wall
       that is 173 ft wide and therefore has a much nearer corner. */
    var ARC = 4e5;
    var arc = box(ctx, px0, px1, pyF, yF, 0, BASE, BRICK, BRICK_E, TRIM, ARC);
    out = out.concat(arc.parts);
    var mapA = function (u, z) { return P(u, pyF, z); };
    var abay = PORT / 7;
    /* Guarded on the arcade's OWN front wall. archOpening and panel do not
       cull themselves, so drawn unguarded these seven arches painted through
       the back of a 173 ft building and stood in the sky behind it. */
    for (var i = 0; ctx.faceVisible(0, -1) && i < 7; i++) {
      var uc = px0 + abay * (i + 0.5);
      out.push(archOpening(ctx, mapA, uc, abay * 0.34, 1, 14, i === 3 ? DOOR : GLASS,
                           TRIM_E, ARC + 0.5));
      /* the marble paterae over each pier, which the photograph shows and the
         1798 notice calls white marble fascias, imposts and key stones */
      out.push(panel(ctx, mapA, uc - abay / 2 - 1, uc - abay / 2 + 1, 15.6, 17.6,
                     TRIM, TRIM_E, ARC + 0.5));
    }
    if (ctx.faceVisible(0, -1)) {
      out.push(panel(ctx, mapA, px0, px1, BASE - 1.6, BASE, TRIM, TRIM_E, ARC + 0.6));
    }

    /* TWELVE COLUMNS, coupled in pairs at each end. The pair spacing and the
       single spacing are both measured off the photograph, then scaled by the
       published 94 ft, so the rhythm is the building's own. */
    var COL = 5e5, cyC = (pyF + yF) / 2 + 2.5, R = 1.25;
    var us = [], gap = 11.4, pairGap = 3.8;
    var left = px0 + 2.2;
    us.push(left, left + pairGap, left + pairGap + gap, left + 2 * pairGap + gap);
    var mid0 = us[3] + gap;
    for (var s = 0; s < 4; s++) us.push(mid0 + gap * s);
    var right = px1 - 2.2;
    us.push(right - 2 * pairGap - gap, right - pairGap - gap, right - pairGap, right);
    us.forEach(function (u, i) {
      out = out.concat(columnAt(ctx, u, cyC, R, BASE, PRIN, TRIM, TRIM_E, COL + i * 3));
    });
    /* the entablature the colonnade carries, spanning the whole 94 ft */
    out = out.concat(box(ctx, px0, px1, cyC - 2.4, cyC + 2.4, PRIN, CORN, TRIM, TRIM_E,
                         TRIM, 6e5).parts);

    /* THE ATTIC, 60 ft wide and 20 high, with the pediment over it */
    var ATTD = 7e5;
    var att = box(ctx, -ATT / 2, ATT / 2, yF, yF + 16, ATT0, ATT1, BRICK, BRICK_E, TRIM, ATTD);
    out = out.concat(att.parts);
    var mapT = function (u, z) { return P(u, yF, z); };
    if (ctx.faceVisible(0, -1)) {
      for (var w = 0; w < 5; w++) {
        var ux = -ATT / 2 + ATT * (w + 0.5) / 5;
        out.push(panel(ctx, mapT, ux - 3.4, ux + 3.4, ATT1 - 12, ATT1 - 5, GLASS, TRIM_E, ATTD + 0.5));
      }
      out.push(panel(ctx, mapT, -ATT / 2, ATT / 2, ATT0, ATT0 + 1.6, TRIM, TRIM_E, ATTD + 0.5));
    }

    /* THE DOME: 50 ft across and 30 ft high, springing above the attic. It is
       drawn BEFORE the pediment on purpose. The pediment stands in front of
       it and has to paint last, or the gilt bulges through the brick. */
    out = out.concat(domeCap(ctx, 0, yF + 27, DOME_R, DOME0, DOME_H, GOLD, GOLD_E, 1e6));

    /* the pediment, over the attic and in front of the dome */
    var PEDD = 2e6;
    if (ctx.faceVisible(0, -1)) {
    out.push({ svg: ctx.poly([P(-ATT / 2 - 2, yF, ATT1), P(ATT / 2 + 2, yF, ATT1),
                              P(0, yF, PED)],
                             ctx.shade(BRICK, 0, -1, 0.2), TRIM_E, 0.6), depth: PEDD });
    out.push({ svg: ctx.poly([P(-ATT / 2 - 2, yF, ATT1), P(ATT / 2 + 2, yF, ATT1),
                              P(ATT / 2 + 2, yF, ATT1 + 1.8), P(-ATT / 2 - 2, yF, ATT1 + 1.8)],
                             ctx.shade(TRIM, 0, -1, 0), TRIM_E, 0.5), depth: PEDD + 0.1 });
    }

    /* the balustraded ring at the top of the dome, the circular lanthorn, and
       the gilt pine cone that stands for the Commonwealth's timber */
    var LZ = DOME0 + DOME_H, LD = 3e6;
    out = out.concat(octStage(ctx, 0, yF + 27, 8.4, 8.4, LZ - 1.5, LZ + 1.6, TRIM, TRIM_E, LD));
    out = out.concat(octStage(ctx, 0, yF + 27, 5.4, 5.0, LZ + 1.6, LZ + 13, TRIM, TRIM_E, LD + 10));
    [[0, -1], [1, 0], [-1, 0]].forEach(function (n, i) {
      if (!ctx.faceVisible(n[0], n[1])) return;
      var map = n[0] === 0
        ? function (u, z) { return P(u, yF + 27 - 5.2, z); }
        : function (u, z) { return P(n[0] * 5.2, u, z); };
      var c = n[0] === 0 ? 0 : yF + 27;
      out.push(archOpening(ctx, map, c, 1.9, LZ + 4, LZ + 8.5, "#2f3a40", TRIM_E, LD + 20 + i));
    });
    out = out.concat(octStage(ctx, 0, yF + 27, 6.0, 6.0, LZ + 13, LZ + 14.6, TRIM, TRIM_E, LD + 30));
    out = out.concat(domeCap(ctx, 0, yF + 27, 4.4, LZ + 14.6, 4.2, GOLD, GOLD_E, LD + 40));
    out = out.concat(octSpire(ctx, 0, yF + 27, 1.5, LZ + 18.8, LZ + 24, GOLD, GOLD_E));
    return out;
  }


  /* ---------------- Stop 8: the Old State House ----------------
     Built 1712 to 1713 on the site of the wooden Town House that burned in
     1711, gutted by fire again in 1747 and rebuilt inside its own walls. The
     oldest surviving public building in Boston, and the balcony on its east
     end is where the Declaration was read to the town on 18 July 1776.

     PUBLISHED, and load bearing here: the plan is 36 ft 4 in by 112 ft 7 in
     (SAH Archipedia's survey, which is why the model uses 36.33 by 112.58 and
     not the round "118 by 36" the popular accounts give); the building stood
     65 ft tall and was the tallest in Boston until 1745; brick; Georgian; a
     gable roof; the lion and the unicorn on the east gable, installed between
     1743 and 1751; the balcony beneath them; and a tower that began as an
     octagon with a bird vane and is now the tiered square one that stands.

     SOURCES DISAGREE about the storeys: SAH says three above a partial
     basement, Wikipedia says two and a half above a partially raised one.
     Three window levels are what a photograph of Washington Street shows, so
     three is drawn, and the disagreement is recorded rather than hidden.

     DERIVED, and said out loud: floor-to-floor heights, the roof pitch, the
     bay count, and how the 65 ft divides between wall, roof and tower. None
     of that is published. It is proportioned from the two dimensions that
     are, and the eleven foot storey it implies is the check. */
  function oldStateHouse(ctx) {
    var BRICK = "#9c4e3c", BRICK_E = "#6d3327", TRIM = "#f1ece0", TRIM_E = "#b3aa99";
    var ROOF = "#6f6a62", ROOF_E = "#4b473f", GLASS = "#42505a", DOOR = "#4a3a30";
    var GOLD = "#c9a22c", GOLD_E = "#8a6f18", PAVE = "#ded8cb";
    var out = [], P = ctx.project;

    /* the published plan. East end at yE, which is the balcony end. */
    var W = 36.33, LEN = 112.58;
    /* The east end carries the balcony, so it is put at +y: in the view the
       page opens on, that is the face turned to the reader. The first
       render had it at -y, and the entire State Street front, scroll, lion,
       unicorn and balcony, was drawn on the side nobody could see. */
    var x0 = -W / 2, x1 = W / 2, yW = -LEN / 2, yE = LEN / 2;

    /* derived storey lines: a raised basement and three eleven foot floors,
       which is what the published 36.33 by 112.58 plan will carry, and a
       ridge that leaves the tower room to reach the published 65 ft. */
    var BASE = 4, Z1 = 15, Z2 = 26, EAVE = 37, RIDGE = 47;

    /* The pavement is kept close to the building. The stage fits itself to
       whatever the scene draws, so an over-wide ground plane does not add
       context, it shrinks the building to a stamp in the middle of an empty
       square. 150 by 170 leaves State Street around it and no more. */
    out.push(ground(ctx, 0, 0, 150, 170, 0, PAVE, "#bfb9aa"));

    /* the brick block, and the granite plinth of the raised basement */
    var plinth = box(ctx, x0 - 0.6, x1 + 0.6, yW - 0.6, yE + 0.6, 0.3, BASE, "#b9b5aa", "#8d897e", null);
    out = out.concat(plinth.parts);
    var body = box(ctx, x0, x1, yW, yE, BASE, EAVE, BRICK, BRICK_E, null);
    out = out.concat(body.parts);

    /* The tower's footprint, declared here because the roof has to know
       about it: the roof is cut around the tower rather than drawn through
       it. tcy is measured from the west end. */
    var tcy = yW + 11, TW = 17;

    /* the roof. Only the slopes come from the shared helper: the east end
       does not finish in a plain triangle, it finishes in a scrolled gable,
       and that scroll is the building's face on State Street. */
    var roof = gableRoofCut(ctx, x0, x1, yW, yE, EAVE, RIDGE, ROOF, ROOF_E, BRICK,
                            tcy - TW / 2, tcy + TW / 2, TW / 2);
    out = out.concat(roof);

    /* nine bays down the long walls, three levels of sash. Nine over 112.58
       is a 12.5 ft bay, which is the Georgian rhythm and the check on the
       derived count. */
    [[-1, x0], [1, x1]].forEach(function (side) {
      var d = body.walls[side[0] + ",0"];
      if (d === undefined) return;
      var X = side[1];
      var map = function (u, z) { return ctx.project(X, u, z); };
      for (var b = 0; b < 9; b++) {
        var yc = yW + LEN * (b + 0.5) / 9;
        out.push(panel(ctx, map, yc - 2.2, yc + 2.2, BASE + 2.5, Z1 - 2.5, GLASS, TRIM_E, d + 0.4));
        out.push(panel(ctx, map, yc - 2.2, yc + 2.2, Z1 + 2.5, Z2 - 2.5, GLASS, TRIM_E, d + 0.4));
        out.push(panel(ctx, map, yc - 2.0, yc + 2.0, Z2 + 2.5, EAVE - 3.5, GLASS, TRIM_E, d + 0.4));
      }
    });

    /* the two ends, three bays each, and on the east end the balcony, the
       lion and the unicorn */
    [[0, 1, yE], [0, -1, yW]].forEach(function (end) {
      var d = body.walls[end[0] + "," + end[1]];
      if (d === undefined) return;
      var Y = end[2];
      var map = function (u, z) { return ctx.project(u, Y, z); };
      for (var b = 0; b < 3; b++) {
        var xc = x0 + W * (b + 0.5) / 3;
        out.push(panel(ctx, map, xc - 2.2, xc + 2.2, BASE + 2.5, Z1 - 2.5, GLASS, TRIM_E, d + 0.4));
        out.push(panel(ctx, map, xc - 2.2, xc + 2.2, Z1 + 2.5, Z2 - 2.5, GLASS, TRIM_E, d + 0.4));
        out.push(panel(ctx, map, xc - 2.0, xc + 2.0, Z2 + 2.5, EAVE - 3.5, GLASS, TRIM_E, d + 0.4));
      }
      out.push(panel(ctx, map, -3.2, 3.2, BASE - 3.2, BASE + 5.5, DOOR, TRIM_E, d + 0.5));

      if (end[1] > 0) {
        /* the balcony, at the middle window of the second floor */
        out.push(panel(ctx, map, -6.5, 6.5, Z1 + 1.0, Z1 + 4.2, TRIM, TRIM_E, d + 0.6));
        /* The lion and the unicorn. They STAND ON the scrolled gable, one
           each side of its crown, and the first render had them at
           EAVE + 2 to EAVE + 7, which is under the scroll's own outline:
           they came back as two coloured rectangles pasted flat on the
           brick. Their base is now the crown itself, RIDGE + 1.2, so they
           break the skyline the way the real pair does.

           Their depth is a constant well past every wall and roof strip,
           for the same reason the vane's is: nothing else in the scene is
           in front of a figure on the ridge, and leaving them on the wall's
           depth put the near roof slope over them. */
        out.push(panel(ctx, map, -5.6, -2.0, RIDGE + 1.2, RIDGE + 5.6, GOLD, GOLD_E, 2e6));
        out.push(panel(ctx, map, 2.0, 5.6, RIDGE + 1.2, RIDGE + 5.6, TRIM, GOLD_E, 2e6));
      }
    });

    /* THE SCROLLED GABLE. Painted over the plain triangle the roof helper
       leaves, at a nearer depth, so the scroll's shoulders read against the
       sky where they swell past the roof line. The east end is the one that
       faces State Street and the site of the Massacre, so it is the one that
       has to be right. */
    if (ctx.faceVisible(0, 1)) {
      var dG = body.walls["0,1"];
      if (dG !== undefined) {
        var g = [], hw = W / 2 + 0.9;
        g.push(P(-hw, yE, EAVE - 0.5));
        g.push(P(-hw, yE, EAVE + 3.2));
        /* the S curve up the left shoulder, sampled rather than faked with
           two straight lines, because a straight scroll is a pediment */
        for (var i = 0; i <= 8; i++) {
          var t = i / 8;
          var xx = -hw + (hw - 5.5) * t;
          var zz = EAVE + 3.2 + (RIDGE - 1.5 - (EAVE + 3.2)) * (t * t * (3 - 2 * t));
          g.push(P(xx, yE, zz));
        }
        g.push(P(-5.5, yE, RIDGE + 1.2));
        g.push(P(5.5, yE, RIDGE + 1.2));
        for (var j = 8; j >= 0; j--) {
          var t2 = j / 8;
          var xx2 = hw - (hw - 5.5) * t2;
          var zz2 = EAVE + 3.2 + (RIDGE - 1.5 - (EAVE + 3.2)) * (t2 * t2 * (3 - 2 * t2));
          g.push(P(xx2, yE, zz2));
        }
        g.push(P(hw, yE, EAVE + 3.2));
        g.push(P(hw, yE, EAVE - 0.5));
        /* dG + 1.4 was not enough. The east end is the near end in the view
           the page opens on, so the near roof slope's own nearest corner
           sorted after the scroll and painted over its right shoulder: the
           gable came back lopsided, an S curve up one side and a plain step
           down the other. The scroll sits above the eave line, where no wall
           can overlap it, so a constant past the whole building is safe and
           is what the render actually needed. */
        out.push({ svg: ctx.poly(g, ctx.shade(BRICK, 0, 1, 0), BRICK_E, 0.7), depth: 1e6 });
      }
    }

    /* the tower, at the west end, in the tiers that stand there now: a square
       clock stage, a smaller square stage, an octagonal lantern, and the vane
       that finishes the published 65 ft. */
    /* The tower rides the roof at the west end. The first render started it
       six feet under the ridge and it read as a separate shed standing out
       in the street: a tower has to be embedded down to the eave line
       before the eye will accept that the roof is carrying it. */
    var t1 = box(ctx, -TW / 2, TW / 2, tcy - TW / 2, tcy + TW / 2, EAVE, RIDGE + 6, TRIM, TRIM_E, null);
    out = out.concat(t1.parts);
    [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(function (n) {
      var d = t1.walls[n[0] + "," + n[1]];
      if (d === undefined) return;
      var map = n[0] === 0
        ? function (u, z) { return ctx.project(u, n[1] < 0 ? tcy - TW / 2 : tcy + TW / 2, z); }
        : function (u, z) { return ctx.project(n[0] < 0 ? -TW / 2 : TW / 2, u, z); };
      var c = n[0] === 0 ? 0 : tcy;
      out.push(panel(ctx, map, c - 3.2, c + 3.2, RIDGE - 2.4, RIDGE + 4.0, "#e8e2d2", "#8d897e", d + 0.4));
    });
    out = out.concat(box(ctx, -5, 5, tcy - 5, tcy + 5, RIDGE + 6, RIDGE + 11, TRIM, TRIM_E, null).parts);
    out = out.concat(octStage(ctx, 0, tcy, 4.6, 4.0, RIDGE + 11, RIDGE + 15, TRIM, TRIM_E));
    out = out.concat(domeCap(ctx, 0, tcy, 4.0, RIDGE + 15, 3.4, TRIM, TRIM_E));
    /* 47 + 15 + 3.4 = 65.4, and the vane sits on top of that: the published
       65 ft, reached by adding the tiers up rather than by scaling to fit. */
    out = out.concat(octStage(ctx, 0, tcy, 0.5, 0.5, RIDGE + 18.4, RIDGE + 21, GOLD, GOLD_E));
    var vane = [P(-3.4, tcy, RIDGE + 19.6), P(3.0, tcy, RIDGE + 20.6),
                P(3.0, tcy, RIDGE + 21.6), P(-3.4, tcy, RIDGE + 22.0)];
    out.push({ svg: ctx.poly(vane, GOLD, GOLD_E, 0.5), depth: 1e8 });
    return out;
  }

  /* A roof that is gabled at one end and hipped at the other, which is what
     Old South has and what no symmetrical church roof ever is. Ridge along y,
     gable at y0, hip run back from y1. Each slope is one plane, which is safe
     here only because nothing stands on this roof: the tower is off the west
     end, outside the roof's footprint entirely. */
  function gableHipRoof(ctx, x0, x1, y0, y1, zEave, zRidge, fill, edge, gableFill, hipRun) {
    var P = ctx.project, out = [], xm = (x0 + x1) / 2, yh = y1 - hipRun;
    [[-1, x0], [1, x1]].forEach(function (s) {
      var sgn = s[0], X = s[1];
      var q = sgn === -1
        ? [P(X, y0, zEave), P(X, y1, zEave), P(xm, yh, zRidge), P(xm, y0, zRidge)]
        : [P(X, y1, zEave), P(X, y0, zEave), P(xm, y0, zRidge), P(xm, yh, zRidge)];
      out.push({ svg: ctx.poly(q, ctx.shade(fill, sgn * 0.5, 0, 0.8), edge, 0.6), depth: depthOf(q) });
    });
    /* the gable, west */
    if (ctx.faceVisible(0, -1)) {
      var t = [P(x0, y0, zEave), P(x1, y0, zEave), P(xm, y0, zRidge)];
      out.push({ svg: ctx.poly(t, ctx.shade(gableFill || fill, 0, -1, 0), edge, 0.6), depth: depthOf(t) });
    }
    /* the hip, east: a triangle of roof where the gable would have been */
    if (ctx.faceVisible(0, 1)) {
      var h = [P(x0, y1, zEave), P(x1, y1, zEave), P(xm, yh, zRidge)];
      out.push({ svg: ctx.poly(h, ctx.shade(fill, 0, 0.8, 0.5), edge, 0.6), depth: depthOf(h) });
    }
    return out;
  }

  /* ---------------- Stop 8: Old South Meeting House ----------------
     1729, and the largest room in colonial Boston: five thousand people
     packed into it on 16 December 1773 to hear whether the tea would go back,
     and walked out of it to the harbour.

     PUBLISHED, and load bearing here. From the Boston Landmarks Commission
     study report of 2025: the brick portion of the tower rises eighty feet
     from street level to the steeple; the steeple carries a twenty foot
     copper clad octagonal spire under a gilded weathervane; the front is
     five bays wide with a gable end and the tower centred on it, the long
     elevations are seven bays, the windows are semicircular arched with
     fanlights at the first and second stories, the building is two stories,
     and the roof is gabled at the west end and hipped at the east. The
     report also quotes the older description of a three stage octagonal
     spire. The overall 183 ft is the figure the Freedom Trail and the park
     service both use, so the wooden steeple between brick and spire is
     183 - 80 - 20 = 83 ft, a subtraction rather than a guess.

     DERIVED, and said out loud rather than buried: the footprint in feet. No
     source I could reach publishes it. The width is set by putting the
     published five bays across a front whose centre bay is a tower tall
     enough to be the published eighty, and the length by running the
     published seven bays down the side at the same module. Floor heights and
     roof pitch are proportioned the same way.

     WHY THE DOOR IS WHERE IT IS. This is a meeting house, not a church. The
     report is explicit: the tower doors are on the short side, the principal
     south entrance is on the long side, and the pulpit faces it across the
     width. Drawing the entrance under the tower would turn it into Old North,
     which is the one thing it is not. */
  function oldSouth(ctx) {
    var BRICK = "#9d5341", BRICK_E = "#6d3327", TRIM = "#f2ede1", TRIM_E = "#b9b0a0";
    var ROOF = "#7b6f63", ROOF_E = "#574e45", GLASS = "#3f4d55", GOLD = "#c9a22c";
    var COPPER = "#7fa898", COPPER_E = "#4e6d62";
    var PAVE = "#ded8cb", KERB = "#bfb9aa";
    var out = [];

    /* the plan: five bays across, seven down, at one module */
    var BAY = 13.2;
    var W = BAY * 5, LEN = BAY * 7;
    var x0 = -W / 2, x1 = W / 2, y0 = -LEN / 2, y1 = LEN / 2;
    var EAVE = 40, RIDGE = EAVE + 16;

    out.push(ground(ctx, 0, 0, 230, 230, 0, PAVE, KERB));
    out.push(ground(ctx, 0, 0, 128, 156, 0.4, "#d3ccbd", KERB));

    /* the body: brick, two storeys */
    var body = box(ctx, x0, x1, y0, y1, 0.4, EAVE, BRICK, BRICK_E, null);
    out = out.concat(body.parts);
    out = out.concat(gableHipRoof(ctx, x0, x1, y0, y1, EAVE, RIDGE, ROOF, ROOF_E, BRICK, 16));

    /* the long walls: seven bays, the same round arched sash twice over.
       Published as seven, so seven are drawn and not a suggestion of them. */
    var southPorch = null;
    [[-1, x0], [1, x1]].forEach(function (side) {
      var d = body.walls[side[0] + ",0"];
      if (d === undefined) return;
      var X = side[1];
      var map = function (u, z) { return ctx.project(X, u, z); };
      for (var b = 0; b < 7; b++) {
        var yc = y0 + LEN * (b + 0.5) / 7;
        /* the porch stands in the centre bay of the south wall, so that one
           window is behind it and is not drawn. The first render showed the
           porch painted flat across a window it should have been standing in
           front of, which no face count would ever have caught. */
        if (!(side[0] === 1 && b === 3)) {
          out.push(archOpening(ctx, map, yc, 3.4, 8, 15.5, GLASS, TRIM_E, d + 0.4));
        }
        out.push(archOpening(ctx, map, yc, 3.4, 24, 31.5, GLASS, TRIM_E, d + 0.4));
      }
      /* south: the enclosed pedimented porch at street level, centre bay.
         north: a single window at mid floor height, centre bay. Both are in
         the report, and both are what tells the two long walls apart. */
      if (side[0] === 1) {
        southPorch = d;
      } else {
        out.push(archOpening(ctx, map, 0, 2.6, 17.5, 21, GLASS, TRIM_E, d + 0.4));
      }
    });

    /* the enclosed pedimented porch, centre bay of the south wall, and the
       principal entrance of the building. It is a mass that projects, not a
       shape painted on the wall: this is the door the town came in by, and
       the whole difference between a meeting house and a church is that it
       is here on the long side rather than under the tower. */
    if (southPorch !== null) {
      /* THE DEPTH, and it is the reason this porch is drawn with one rather
         than by its own corners: a wall ninety two feet long has a nearer
         corner than the little mass standing halfway along it, so the wall
         sorted last and painted straight over the porch. The render showed a
         grey nub at the kerb and nothing else. It takes the wall's depth and
         a step, exactly as the windows in that wall do. */
      var porch = box(ctx, x1, x1 + 7, -6.5, 6.5, 0.4, 12, TRIM, TRIM_E, ROOF, southPorch + 0.6);
      out = out.concat(porch.parts);
      var pd = porch.walls["1,0"];
      if (pd === undefined) pd = southPorch + 0.9;
      {
        out.push({ svg: ctx.poly([ctx.project(x1 + 7, -6.5, 12), ctx.project(x1 + 7, 6.5, 12),
                                  ctx.project(x1 + 7, 0, 16.5)],
                                 ctx.shade(TRIM, 1, 0, 0), TRIM_E, 0.6), depth: pd + 0.5 });
        out.push(archOpening(ctx, function (u, z) { return ctx.project(x1 + 7, u, z); },
                             0, 3.2, 0.4, 8, "#4a3a30", TRIM_E, pd + 0.6));
      }
    }

    /* the west front: five bays, the middle one taken by the tower, so two
       windows each side at each level and nothing in the centre */
    if (ctx.faceVisible(0, -1)) {
      var dF = body.walls["0,-1"];
      var mapW = function (u, z) { return ctx.project(u, y0, z); };
      [-1, 1].forEach(function (s) {
        [BAY * 1.5, BAY * 2.5].forEach(function (xc) {
          out.push(archOpening(ctx, mapW, s * xc, 3.2, 8, 15.5, GLASS, TRIM_E, dF + 0.4));
          out.push(archOpening(ctx, mapW, s * xc, 3.2, 24, 31.5, GLASS, TRIM_E, dF + 0.4));
        });
      });
    }

    /* the east end, hipped, with the one storey stair tower at its centre */
    if (ctx.faceVisible(0, 1)) {
      var dE = body.walls["0,1"];
      var mapE = function (u, z) { return ctx.project(u, y1, z); };
      out.push(archOpening(ctx, mapE, 0, 3.2, 24, 31.5, GLASS, TRIM_E, dE + 0.4));
    }
    out = out.concat(box(ctx, -7, 7, y1, y1 + 9, 0.4, 14, BRICK, BRICK_E, ROOF).parts);

    /* the tower: brick, eighty feet, centred on the gable end and standing
       one bay wide of the five, projecting west of the wall */
    var TW = 24, tx0 = -TW / 2, tx1 = TW / 2;
    var ty1 = y0 + 3, ty0 = ty1 - 22;
    var BRICK_TOP = 80;
    var tower = box(ctx, tx0, tx1, ty0, ty1, 0.4, BRICK_TOP, BRICK, BRICK_E, null);
    out = out.concat(tower.parts);

    /* the tower doors, on the short side, which is the meeting house tell */
    if (ctx.faceVisible(0, -1)) {
      var dT = tower.walls["0,-1"];
      var mapT = function (u, z) { return ctx.project(u, ty0, z); };
      out.push(archOpening(ctx, mapT, 0, 4.2, 0.4, 11, "#4a3a30", BRICK_E, dT + 0.4));
      out.push(archOpening(ctx, mapT, 0, 3.4, 26, 32, GLASS, TRIM_E, dT + 0.4));
      out.push(archOpening(ctx, mapT, 0, 3.4, 44, 50, GLASS, TRIM_E, dT + 0.4));
    }
    /* the clocks, north and south faces, and Galen Brown's of 1766 is the
       oldest American made tower clock still running where it was hung */
    [[-1, tx0], [1, tx1]].forEach(function (side) {
      var d = tower.walls[side[0] + ",0"];
      if (d === undefined) return;
      var X = side[1], tyc = (ty0 + ty1) / 2;
      var map = function (u, z) { return ctx.project(X, u, z); };
      out.push(archOpening(ctx, map, tyc, 3.4, 26, 32, GLASS, TRIM_E, d + 0.4));
      var pts = [], N = 16;
      for (var i = 0; i < N; i++) {
        var a = i * Math.PI * 2 / N;
        pts.push(map(tyc + 5 * Math.cos(a), 64 + 5 * Math.sin(a)));
      }
      out.push({ svg: ctx.poly(pts, TRIM, "#5f5a50", 0.7), depth: d + 0.5 });
    });

    var cy = (ty0 + ty1) / 2;

    /* the wooden steeple: brick stops at 80 and a painted octagon carries on,
       and the joint is meant to be visible. Belfry, then two more stages,
       which is the three stage octagonal spire the old accounts describe. */
    out = out.concat(box(ctx, -11, 11, cy - 11, cy + 11, BRICK_TOP, 86, TRIM, TRIM_E, null).parts);

    /* the open colonnaded belfry: you can see through it, so it is drawn as
       a floor, eight posts and a cap rather than as a solid drum */
    out = out.concat(octStage(ctx, 0, cy, 10.4, 10.4, 86, 88, TRIM, TRIM_E));
    for (var k = 0; k < 8; k++) {
      var ang = (k / 8) * Math.PI * 2 + Math.PI / 8;
      out = out.concat(columnAt(ctx, 8.6 * Math.cos(ang), cy + 8.6 * Math.sin(ang), 0.9,
                                88, 106, TRIM, TRIM_E));
    }
    /* a cornice ring at every stage break. The first render came back as one
       smooth taper from belfry to vane, which is the obelisk-wearing-a-cross
       the styles book warns about: a steeple is diminishing STAGES and the
       eye needs the step to see them. */
    out = out.concat(octStage(ctx, 0, cy, 9.8, 9.8, 106, 110, TRIM, TRIM_E));
    out = out.concat(octStage(ctx, 0, cy, 8.4, 7.6, 110, 132, TRIM, TRIM_E));
    out = out.concat(octStage(ctx, 0, cy, 8.6, 8.6, 132, 135, TRIM, TRIM_E));
    out = out.concat(octStage(ctx, 0, cy, 6.8, 6.0, 135, 158, TRIM, TRIM_E));
    out = out.concat(octStage(ctx, 0, cy, 7.0, 7.0, 158, 161, TRIM, TRIM_E));
    out = out.concat(octStage(ctx, 0, cy, 5.4, 5.4, 161, 163, TRIM, TRIM_E));

    /* the twenty foot copper spire, and the vane that has been over it since
       the tower went up */
    out = out.concat(octSpire(ctx, 0, cy, 5.4, 163, 183, COPPER, COPPER_E));
    var P = ctx.project;
    out.push({ svg: ctx.poly([P(0, cy, 183), P(0.9, cy, 183), P(0.9, cy, 189), P(0, cy, 189)],
                             GOLD, "#8a6f18", 0.5), depth: 1e8 });
    var vane = [P(-4, cy, 186), P(4, cy, 187.4), P(4, cy, 188.4), P(-4, cy, 189)];
    out.push({ svg: ctx.poly(vane, GOLD, "#8a6f18", 0.5), depth: 1e8 + 1 });
    return out;
  }

  /* ---------------- Stop 16: USS Constitution ----------------
     Launched Boston, 20 October 1797. Charlestown Navy Yard, Pier 1.

     The sailing frigate, which the styles book now carries. Nothing on a ship
     is a rectangle: the deck line dips amidships and lifts at both ends, the
     sides lean back inboard above the widest point, and the bow carries a
     quarter of the ship's length out in front of the hull. Draw any of those
     straight and it is a barge with masts.

     PUBLISHED, from the USS Constitution Museum's facts page:
       207 ft on deck, billethead to taffrail
       305 ft overall, bowsprit to spanker boom
       175 ft at the waterline
       43 ft 6 in beam
       22 ft 6 in draft today (24 ft loaded, 1812)
       172 ft, spar deck to main truck
       thirty 24-pounder long guns on the gun deck
       twenty-four 32-pounder carronades on the spar deck

     COUNTED, by division rather than by eye: fifteen gun ports a side below
     and twelve a side above, because thirty guns and twenty-four carronades
     are shared between two sides and a gun needs a port.

     DERIVED, and said out loud, because that page publishes none of them:
     the height of the spar deck above the water (20 ft amidships), the sheer
     curve, the tumblehome, the transom width, and the fore and mizzen masts
     at 0.95 and 0.80 of the main. The 98 ft by which the published 305 ft
     overall exceeds the published 207 ft on deck IS published, and is split
     here 62 ft forward on the bowsprit and jibboom against 36 ft aft on the
     spanker boom, which is a split and not an invention of length.

     SOURCES DISAGREE about the mainmast. The Navy's fact sheet gives 220 ft
     and the museum gives 172 ft from the spar deck; those cannot both be
     heights above the same water, since the deck is nowhere near 48 ft up.
     The museum's number is the specific one and is what this model uses. */
  function constitution(ctx) {
    var P = ctx.project, out = [];
    var HULL = "#22242a", HULL_E = "#0e0f12", BAND = "#e7e2d4", PORT = "#191b20";
    var DECK = "#c8b58c", DECK_E = "#9a8763", RAIL = "#2b2d33";
    var SPAR = "#c6a463", SPAR_E = "#8a7038", TOP = "#1c1e22", WATER = "#7f96a4";

    /* the published plan */
    var LOA = 207, HALF = LOA / 2, BEAM = 43.5, HB = BEAM / 2;
    var FWD = 62, AFT = 36;                 /* the published 305 - 207, split */

    /* DERIVED hull form. t runs -1 at the taffrail to +1 at the billethead. */
    var FREE = 20, TRANSOM = 8.6, STEM = 1.3, TUMBLE = 0.86;
    function halfB(t) {
      var s = 1 - Math.pow(Math.abs(t), 2.6);
      var b = s > 0 ? HB * Math.pow(s, 0.42) : 0;
      if (t < -0.86) b = Math.max(b, TRANSOM);
      return Math.max(b, STEM);
    }
    /* the sheer: down amidships, up at both ends, more at the bow */
    function sheer(t) { return FREE + 6.5 * t * t + 1.6 * t; }
    function railZ(t) { return sheer(t) + 4.6; }
    var N = 26, ST = [];
    for (var i = 0; i <= N; i++) {
      var t = -1 + 2 * i / N;
      ST.push({ t: t, x: t * HALF, b: halfB(t), z: sheer(t), r: railZ(t) });
    }

    out.push(ground(ctx, 0, 0, 460, 320, 0, WATER, "#61798a"));

    /* THE HULL, station by station. Two strips per bay: the black topsides
       from the waterline up to the deck edge, then the bulwark above it,
       leaning inboard by the tumblehome. Each strip is culled on its own
       outward normal, which is perpendicular to the run of the station line,
       so the far side of the ship never draws. */
    /* A hull is convex, so a strip on the FAR side can still face the viewer
       near the bow and be hidden by the near side all the same. Culling alone
       does not order those two; a fixed depth for the band let the far side's
       ports paint straight through the ship. So the whole side, hull, band and
       ports together, takes one base depth chosen by which side it is: the far
       side under the deck, the near side over it. */
    function sideDepth(s) { return ctx.faceVisible(0, s) ? 2e5 : 0.4e5; }
    [-1, 1].forEach(function (s) {
      var HD = sideDepth(s);
      for (var i = 0; i < N; i++) {
        var a = ST[i], c = ST[i + 1];
        var db = c.b - a.b, dx = c.x - a.x;
        var nl = Math.sqrt(db * db + dx * dx) || 1;
        var nx = -db / nl, ny = s * dx / nl;
        if (!ctx.faceVisible(nx, ny)) continue;
        var q = [P(a.x, s * a.b, 0), P(c.x, s * c.b, 0),
                 P(c.x, s * c.b, c.z), P(a.x, s * a.b, a.z)];
        out.push({ svg: ctx.poly(q, ctx.shade(HULL, nx, ny, 0), HULL_E, 0.4),
                   depth: HD + i * 0.01 });
        /* the bulwark, tumbled home */
        var bw = [P(a.x, s * a.b, a.z), P(c.x, s * c.b, c.z),
                  P(c.x, s * c.b * TUMBLE, c.r), P(a.x, s * a.b * TUMBLE, a.r)];
        out.push({ svg: ctx.poly(bw, ctx.shade(HULL, nx, ny, 0.1), HULL_E, 0.4),
                   depth: HD + 0.4 + i * 0.01 });
      }
    });

    /* THE GUN PORT BAND, the one pale stripe. Drawn as a chain of quads that
       follows the hull rather than a straight line, because the hull curves
       in plan and a flat band would leave the ship at both ends. */
    function bandAt(s, z0, z1, d, fill) {
      var db, dx, nl, nx, ny, i, a, c, q;
      for (i = 0; i < N; i++) {
        a = ST[i]; c = ST[i + 1];
        db = c.b - a.b; dx = c.x - a.x; nl = Math.sqrt(db * db + dx * dx) || 1;
        nx = -db / nl; ny = s * dx / nl;
        if (!ctx.faceVisible(nx, ny)) continue;
        if (a.b < 6 || c.b < 6) continue;
        q = [P(a.x, s * a.b * 1.004, a.z * z0), P(c.x, s * c.b * 1.004, c.z * z0),
             P(c.x, s * c.b * 1.004, c.z * z1), P(a.x, s * a.b * 1.004, a.z * z1)];
        out.push({ svg: ctx.poly(q, ctx.shade(fill, nx, ny, 0), "", 0), depth: d + i * 0.01 });
      }
    }
    bandAt(-1, 0.50, 0.72, sideDepth(-1) + 1, BAND);
    bandAt(1, 0.50, 0.72, sideDepth(1) + 1, BAND);

    /* THE PORTS. Fifteen a side on the gun deck for thirty long guns, twelve
       a side in the bulwark for twenty-four carronades: the armament divided
       by two. Spaced along t rather than along x so they keep station with
       the hull as it narrows. */
    function ports(s, n, t0, t1, lo, hi, w) {
      var db, dx, nl, nx, ny, PD = sideDepth(s) + 1.5;
      for (var k = 0; k < n; k++) {
        var t = t0 + (t1 - t0) * (k + 0.5) / n;
        var b = halfB(t), z = sheer(t), x = t * HALF;
        db = halfB(t + 0.02) - halfB(t - 0.02); dx = 0.04 * HALF;
        nl = Math.sqrt(db * db + dx * dx) || 1;
        nx = -db / nl; ny = s * dx / nl;
        if (!ctx.faceVisible(nx, ny)) continue;
        var q = [P(x - w, s * b * 1.01, z * lo), P(x + w, s * b * 1.01, z * lo),
                 P(x + w, s * b * 1.01, z * hi), P(x - w, s * b * 1.01, z * hi)];
        out.push({ svg: ctx.poly(q, PORT, "#000", 0.3), depth: PD });
      }
    }
    [-1, 1].forEach(function (s) {
      ports(s, 15, -0.80, 0.80, 0.535, 0.685, 2.4);
      ports(s, 12, -0.74, 0.76, 1.03, 1.16, 2.2);
    });

    /* THE SPAR DECK, one flat surface spanning two hundred feet, so it takes
       an explicit depth. Sorted on its own corners it would have the nearest
       point on the ship and would paint over the masts standing on it. */
    var DD = 1e5;
    var deck = [];
    for (i = 0; i <= N; i++) deck.push(P(ST[i].x, -ST[i].b * TUMBLE, ST[i].r - 0.6));
    for (i = N; i >= 0; i--) deck.push(P(ST[i].x, ST[i].b * TUMBLE, ST[i].r - 0.6));
    out.push({ svg: ctx.poly(deck, ctx.shade(DECK, 0, 0, 1), DECK_E, 0.5), depth: DD });

    /* the transom, flat, which is how a frigate ends aft */
    if (ctx.faceVisible(-1, 0)) {
      var tz = ST[0];
      out.push({ svg: ctx.poly([P(tz.x, -TRANSOM, 0), P(tz.x, TRANSOM, 0),
                                P(tz.x, TRANSOM * TUMBLE, tz.r), P(tz.x, -TRANSOM * TUMBLE, tz.r)],
                               ctx.shade(HULL, -1, 0, 0), HULL_E, 0.4), depth: 2e5 + 0.9 });
    }

    /* THE RIG. Main 172 ft from the spar deck, published; fore and mizzen
       derived at 0.95 and 0.80 of it, each built as lower mast, topmast and
       topgallant so the doublings show. Everything at y = 0, so the three
       masts cannot occlude one another and one depth serves them all. */
    var MD = 1.5e5;
    function mast(t, H) {
      var x = t * HALF, z0 = sheer(t) - 0.6;
      var segs = [[0, 0.44, 2.9, 2.1, SPAR], [0.40, 0.76, 1.8, 1.2, SPAR],
                  [0.72, 1.00, 1.0, 0.5, TOP]];
      segs.forEach(function (g, i) {
        out = out.concat(taperedShaft(ctx, x, 0, g[2], g[3], z0 + H * g[0],
                                      H * (g[1] - g[0]), g[4],
                                      g[4] === TOP ? "#000" : SPAR_E, MD + i * 0.5));
      });
      return { x: x, z0: z0, H: H };
    }
    /* A yard needs thickness FORE AND AFT as well as depth. Drawn as a single
       athwartships plane every yard on the ship vanished at broadside, which
       is the one angle a ship is actually looked at from, and the arithmetic
       had no complaint: the quad was there, it was just edge-on. */
    function yard(cx, z, len, th, fill, d) {
      var y = box(ctx, cx - th, cx + th, -len / 2, len / 2, z - th, z + th,
                  fill, "#2a2a2a", fill, d);
      out = out.concat(y.parts);
    }
    /* Mast heights are the Navy's published ones, measured from the water:
       mainmast 220 ft, foremast 198, mizzen 172.5. The spar deck stands about
       20 ft up, so what is drawn above it is that figure less the freeboard.
       The three were previously derived from one number by ratio, which put
       the fore and mizzen in roughly the right place for the wrong reason. */
    var MAIN = 220 - FREE, FORE = 198 - FREE, MIZ = 172.5 - FREE;
    var mm = mast(-0.02, MAIN), fm = mast(0.42, FORE), zm = mast(-0.46, MIZ);
    /* The main yard is about 95 ft on a 43.5 ft beam: more than twice the
       width of the ship, which is the proportion that makes a square-rigger
       look like one. At 78 ft the yards read as short crossbars and the whole
       rig looked like a mast with twigs on it. They shorten going up. */
    [[mm, 1.0], [fm, 0.88], [zm, 0.66]].forEach(function (m) {
      var M = m[0], k = m[1];
      [0.20, 0.46, 0.70, 0.88].forEach(function (f, i) {
        yard(M.x, M.z0 + M.H * f, (95 - i * 19) * k, 0.8,
             i > 1 ? TOP : SPAR, MD + 1 + i * 0.1);
      });
    });

    /* THE SHROUDS, and they are the reason this looked wrong.
       [SEAN, 2026-08-31: "USS constitution look really not ok".]

       A square-rigger carries its masts on standing rigging: fans of rope
       running from each masthead down to the channels bolted along the hull
       side, raked aft. Without them the masts are poles balanced in a tub,
       and no amount of correcting the hull fixes that, because the eye reads
       a ship by its rigging before it reads the planking.

       Drawn as thin quads rather than lines so they survive the same
       painter's sort as everything else. Both sides, because the far side's
       shrouds are visible ABOVE the bulwark even when its hull is hidden. */
    function shrouds(M, spread, n) {
      var tTop = M.x / HALF;
      var ztop = M.z0 + M.H * 0.42;
      var bAt = halfB(tTop);
      for (var side = -1; side <= 1; side += 2) {
        for (var k2 = 0; k2 < n; k2++) {
          var f = n === 1 ? 0 : k2 / (n - 1);
          var ax = M.x - spread * 0.30 + spread * f;
          var ay = side * bAt * (1.02 + 0.05 * f);
          var az = sheer(ax / HALF) + 3.4;
          var w = 0.55;
          var q = [P(M.x, side * 1.4, ztop), P(M.x + w, side * 1.4, ztop),
                   P(ax + w, ay, az), P(ax, ay, az)];
          out.push({ svg: ctx.poly(q, "#3a3a3a", "", 0, ' opacity="0.8"'),
                     depth: MD + 0.8 + k2 * 0.01 });
        }
      }
    }
    shrouds(mm, 34, 7);
    shrouds(fm, 30, 7);
    shrouds(zm, 24, 5);

    /* the bowsprit and jibboom forward, the spanker boom aft: the published
       305 ft overall less the published 207 ft on deck, split 62 and 36 */
    var bz = sheer(1);
    out.push({ svg: ctx.poly([P(HALF - 8, 0, bz - 1.5), P(HALF + FWD, 0, bz + 21),
                              P(HALF + FWD, 0, bz + 23.4), P(HALF - 8, 0, bz + 1.8)],
                             SPAR, SPAR_E, 0.5), depth: MD + 2 });
    out.push({ svg: ctx.poly([P(-HALF + 4, 0, zm.z0 + 14), P(-HALF - AFT, 0, zm.z0 + 20),
                              P(-HALF - AFT, 0, zm.z0 + 21.6), P(-HALF + 4, 0, zm.z0 + 15.6)],
                             SPAR, SPAR_E, 0.5), depth: MD + 2 });
    return out;
  }

  /* ---------------- the Paul Revere House ----------------
     Post-medieval English, c. 1680, and the oldest building in downtown
     Boston. See STYLES.md: jetty, pendants, steep gable, massive stack, low
     storeys, one room to a floor, and an ell that follows the lot instead of
     the house.

     WHERE EVERY NUMBER COMES FROM. HABS MASS,13-BOST,26, five measured
     drawing sheets, loc.gov item ma0478, read on 2026-09-01. The NRHP
     nomination was read on an earlier run and carries NOT ONE dimension in
     feet, which is why this building waited; the measured drawings carry all
     of them.

     PUBLISHED ON THE SHEET, read off sheet 2, the first floor plan:
       main block  30'-6" wide by 18'-2" deep
       the 30'-6" resolves into nine dimensions that sum to it exactly:
         4'-1", 2'-11", 4'-5", 2'-11", 4'-4", 2'-11", 2'-8", 2'-8", 3'-7"
         and the three 2'-11" slots are the casement bays, the 2'-8" the door
       the 18'-2" resolves as 8'-6" + 1'-6" + 8'-2", also exact
       SOUTH ROOM (HALL)    22'-6" x 17'-3"
       NORTH ROOM (KITCHEN) 11'-6" x 15'-3", in the ell
       ell, over its walls, 12'-3" by 16'-4"

     SCALED OFF SHEET 1, the east elevation, which is a measured drawing at
     1/4" = 1'-0" and carries no written vertical dimensions. The front wall
     measures 3238 px against a published 30'-6", giving 106.16 px/ft, and
     the horizontal lines were found by a row-ink profile rather than by eye:
       first storey   6'-8"   (jetty line at 3581 px, sill at 4286)
       second storey  8'-0"   (eave line at 2735 px)
       eave          14'-8"
       ridge      about 26'-6"
       stack top  about 38'-0"
     The ridge and the stack are the two read from the picture rather than
     from the profile, so they are given as about. They carry their own
     check: a 11'-10" rise over a 9'-1" half span is a 52 degree pitch, and
     the nomination calls the roof steeply pitched, which is the corroboration
     that a wrong reading would have failed.

     DECLARED, NOT MEASURED. The ell's heights are nowhere on the sheets read.
     It is given the main block's OWN measured storey heights, because the
     nomination has it two storeys with a similar overhang, and its ridge then
     falls out of the same 52 degree pitch over its own published 12'-3".
     That is a measured number carried across, not a number invented, and it
     is the one thing here a later sheet could correct.

     THE ANGLE. The ell meets the main block off square. No source publishes
     the angle; sheet 2 draws it, and the two walls measure about 14 degrees
     apart on the sheet. It is drawn at 14 and called approximate. The angle
     itself is not a flourish: the nomination singles it out, the ell was set
     to fit an irregular lot, and a right angle here would be the drawing
     telling a lie about how the house grew. */
  function paulRevere(rawCtx) {
    /* THE FRONT HAS TO FACE THE READER. The first render came back as a blank
       brown box: the whole east front, its four bays, its door and both
       pendants were modelled correctly and were pointing AWAY, because this
       renderer views from +y and the facade had been built on the -y face.
       Every face count and every dimension was right and the picture was of
       a shed. Mirroring y once, here, turns the building around and leaves
       the plan arithmetic below reading in the same direction as the HABS
       sheet, which is the only way this stays checkable against it. */
    var ctx = {
      project: function (x, y, z) { return rawCtx.project(x, -y, z); },
      poly: rawCtx.poly, shade: rawCtx.shade,
      faceVisible: function (nx, ny) { return rawCtx.faceVisible(nx, -ny); }
    };
    var CLAP = "#a2977f", CLAP_E = "#57503f";
    var UPPER = "#b0a58c";
    var ROOF = "#585049", ROOF_E = "#38322c";
    var BRICK = "#96513f", BRICK_E = "#673025";
    var GLASS = "#3b4850", LEAD = "#cec8b9", TRIM = "#463f36";
    var PAVE = "#ded8cb", KERB = "#bfb9aa";
    var out = [];

    var W = 30.5, D = 18.167;
    var S1 = 6.667, S2 = 8.0, EAVE = S1 + S2, RIDGE = 26.5, STACK = 38.0;
    var JET = 1.1;
    var x0 = -W / 2, x1 = W / 2;

    /* a prism on any plan polygon, so the ell can stand off square. The
       outward normal of the edge a->b is [dy,-dx], the same convention box()
       uses, which is why a rotated wall shades like a square one. */
    function prism(plan, z0, z1, fill, edge, depth) {
      var P = ctx.project, res = [], walls = [];
      for (var i = 0; i < plan.length; i++) {
        var a = plan[i], b = plan[(i + 1) % plan.length];
        var dx = b[0] - a[0], dy = b[1] - a[1];
        var L = Math.sqrt(dx * dx + dy * dy) || 1;
        var nx = dy / L, ny = -dx / L;
        if (!ctx.faceVisible(nx, ny)) { walls.push(null); continue; }
        var q = [P(a[0], a[1], z0), P(b[0], b[1], z0), P(b[0], b[1], z1), P(a[0], a[1], z1)];
        var d = (depth === undefined) ? depthOf(q) : depth + i * 0.1;
        res.push({ svg: ctx.poly(q, ctx.shade(fill, nx, ny, 0), edge, 0.6), depth: d });
        walls.push(d);
      }
      return { parts: res, walls: walls };
    }

    /* a gable on any plan rectangle. The ridge runs along the A->B edge, so
       ordering the corners chooses which way the roof runs. Each slope and
       each gable end gets its OWN depth from its own corners; nothing here is
       allowed to span the scene as one plane. */
    function gable(A, B, C, E, zEave, zRidge, fill, edge, gFill) {
      var P = ctx.project, res = [];
      var R1 = [(A[0] + E[0]) / 2, (A[1] + E[1]) / 2];
      var R2 = [(B[0] + C[0]) / 2, (B[1] + C[1]) / 2];
      [[A, B, R2, R1], [C, E, R1, R2]].forEach(function (s) {
        var dx = s[1][0] - s[0][0], dy = s[1][1] - s[0][1];
        var L = Math.sqrt(dx * dx + dy * dy) || 1;
        var q = [P(s[0][0], s[0][1], zEave), P(s[1][0], s[1][1], zEave),
                 P(s[2][0], s[2][1], zRidge), P(s[3][0], s[3][1], zRidge)];
        res.push({ svg: ctx.poly(q, ctx.shade(fill, dy / L * 0.6, -dx / L * 0.6, 0.8), edge, 0.6),
                   depth: depthOf(q) });
      });
      [[B, C, R2], [E, A, R1]].forEach(function (g) {
        var dx = g[1][0] - g[0][0], dy = g[1][1] - g[0][1];
        var L = Math.sqrt(dx * dx + dy * dy) || 1;
        var nx = dy / L, ny = -dx / L;
        if (!ctx.faceVisible(nx, ny)) return;
        var t = [P(g[0][0], g[0][1], zEave), P(g[1][0], g[1][1], zEave), P(g[2][0], g[2][1], zRidge)];
        res.push({ svg: ctx.poly(t, ctx.shade(gFill || fill, nx, ny, 0), edge, 0.6), depth: depthOf(t) });
      });
      return res;
    }

    out.push(ground(ctx, 0, 14, 62, 62, 0, PAVE, KERB));

    /* the main block. Lower storey set BACK by the jetty, upper storey out
       to the wall line, which is the whole silhouette of the period. */
    var lo = prism([[x0, JET], [x1, JET], [x1, D], [x0, D]], 0, S1, CLAP, CLAP_E);
    out = out.concat(lo.parts);
    var hi = prism([[x0, 0], [x1, 0], [x1, D], [x0, D]], S1, EAVE, UPPER, CLAP_E);
    out = out.concat(hi.parts);

    /* the pendants, one at each end of the jetty. Small, and the signature. */
    [x0 + 0.55, x1 - 0.55].forEach(function (px) {
      var q = [ctx.project(px - 0.28, 0.05, S1 - 1.25), ctx.project(px + 0.28, 0.05, S1 - 1.25),
               ctx.project(px + 0.28, 0.05, S1), ctx.project(px - 0.28, 0.05, S1)];
      out.push({ svg: ctx.poly(q, TRIM, CLAP_E, 0.4), depth: depthOf(q) + 0.4 });
      var tip = [ctx.project(px - 0.28, 0.05, S1 - 1.25), ctx.project(px + 0.28, 0.05, S1 - 1.25),
                 ctx.project(px, 0.05, S1 - 1.85)];
      out.push({ svg: ctx.poly(tip, TRIM, CLAP_E, 0.4), depth: depthOf(tip) + 0.4 });
    });

    /* the front, bay by bay, at the measured offsets. Cumulative from the
       north corner: pier 4'-1", then the string alternates. */
    var run = [4.083, 2.917, 4.417, 2.917, 4.333, 2.917, 2.667, 2.667, 3.583];
    var edges = [x0], acc = x0;
    run.forEach(function (r) { acc += r; edges.push(acc); });
    var frontLo = lo.walls[0], frontHi = hi.walls[0];

    function casement(xa, xb, za, zb, depth) {
      if (depth === undefined) return;
      var q = [ctx.project(xa, 0.02, za), ctx.project(xb, 0.02, za),
               ctx.project(xb, 0.02, zb), ctx.project(xa, 0.02, zb)];
      out.push({ svg: ctx.poly(q, GLASS, LEAD, 0.5), depth: depth + 0.6 });
      /* the leaded lights: small panes, which is what makes it a casement
         and not a sash */
      var n = 3;
      for (var i = 1; i < n; i++) {
        var xx = xa + (xb - xa) * i / n;
        var m = [ctx.project(xx - 0.03, 0.03, za), ctx.project(xx + 0.03, 0.03, za),
                 ctx.project(xx + 0.03, 0.03, zb), ctx.project(xx - 0.03, 0.03, zb)];
        out.push({ svg: ctx.poly(m, LEAD, null, 0), depth: depth + 0.7 });
      }
      var zm = (za + zb) / 2;
      var h = [ctx.project(xa, 0.03, zm - 0.03), ctx.project(xb, 0.03, zm - 0.03),
               ctx.project(xb, 0.03, zm + 0.03), ctx.project(xa, 0.03, zm + 0.03)];
      out.push({ svg: ctx.poly(h, LEAD, null, 0), depth: depth + 0.7 });
    }

    /* three casement bays and a door below; four casements above. The lower
       windows sit high under the plate because the storey is 6'-8". */
    [[1, 2], [3, 4], [5, 6]].forEach(function (b) {
      casement(edges[b[0]], edges[b[1]], S1 - 4.9, S1 - 1.0, frontLo);
    });
    if (frontLo !== undefined && frontLo !== null) {
      var dq = [ctx.project(edges[7], 0.02, 0.05), ctx.project(edges[8], 0.02, 0.05),
                ctx.project(edges[8], 0.02, 5.6), ctx.project(edges[7], 0.02, 5.6)];
      out.push({ svg: ctx.poly(dq, TRIM, CLAP_E, 0.5), depth: frontLo + 0.6 });
    }
    [[1, 2], [3, 4], [5, 6], [7, 8]].forEach(function (b) {
      casement(edges[b[0]], edges[b[1]], EAVE - 4.6, EAVE - 0.8, frontHi);
    });

    /* the roof, ridge running along the front, and steep */
    out = out.concat(gable([x0 - 0.7, -0.7], [x1 + 0.7, -0.7], [x1 + 0.7, D + 0.7], [x0 - 0.7, D + 0.7],
                           EAVE, RIDGE, ROOF, ROOF_E, UPPER));

    /* the stack. Drawn from the ridge up only: below the ridge it is inside
       the house, and a masonry box started at the ground would have to fight
       the near roof slope for the sort every frame. Above the ridge it is
       given a depth past both slopes, which is where it truly is. */
    var sx = 10.6, sy = D / 2, sw = 3.1, sd = 2.1;
    var stack = prism([[sx - sw, sy - sd], [sx + sw, sy - sd], [sx + sw, sy + sd], [sx - sw, sy + sd]],
                      RIDGE - 1.2, STACK, BRICK, BRICK_E, 900);
    out = out.concat(stack.parts);
    var cap = [ctx.project(sx - sw, sy - sd, STACK), ctx.project(sx + sw, sy - sd, STACK),
               ctx.project(sx + sw, sy + sd, STACK), ctx.project(sx - sw, sy + sd, STACK)];
    out.push({ svg: ctx.poly(cap, ctx.shade(BRICK, 0, 0, 1), BRICK_E, 0.6), depth: 901 });

    /* ---- the ell, off square ----
       14 degrees, measured on the sheet, not published. */
    var t = 14 * Math.PI / 180, ct = Math.cos(t), st = Math.sin(t);
    var EW = 12.25, ED = 16.33;
    var bx = -14.2, by = D - 0.6;
    function pt(u, v) { return [bx + u * ct - v * st, by + u * st + v * ct]; }
    var A = pt(0, 0), B = pt(EW, 0), C = pt(EW, ED), E = pt(0, ED);
    /* its own jetty, the same move as the main block */
    var eJ = 0.9;
    var Aj = pt(eJ, eJ), Bj = pt(EW - eJ, eJ), Cj = pt(EW - eJ, ED), Ej = pt(eJ, ED);
    out = out.concat(prism([Aj, Bj, Cj, Ej], 0, S1, CLAP, CLAP_E).parts);
    out = out.concat(prism([A, B, C, E], S1, EAVE, UPPER, CLAP_E).parts);
    /* ridge along the ell's OWN long axis, so it runs away from the street
       exactly as the plan has it. Corner order chooses the direction. */
    var eRidge = EAVE + (EW / 2) * Math.tan(52 * Math.PI / 180);
    out = out.concat(gable(B, C, E, A, EAVE, eRidge, ROOF, ROOF_E, UPPER));

    return out;
  }



  /* A LONG WALL DRAWN AS SEPARATE BAYS, and the reason is the painter's rule
     this project keeps relearning the hard way. A quad's depth is its NEAREST
     corner, so a single sixty four foot wall carries the depth of whichever
     end is turned to the reader along its whole length, and it paints over
     anything standing beside its far end. Park Street's body runs past the
     foot of a two hundred and eighteen foot steeple, so that failure would
     bury the tower's own door. Bays give each length of wall a depth of its
     own, and they also give the two published storeys of window somewhere to
     sit. Each bay hands back its own wall map and its own depth.
       axis "y": the wall runs along y at x = at, outward normal (nx, 0).
       axis "x": the wall runs along x at y = at, outward normal (0, ny). */
  function wallRun(ctx, axis, at, u0, u1, z0, z1, nx, ny, fill, edge, nBays) {
    var out = [], bays = [];
    if (!ctx.faceVisible(nx, ny)) return { parts: out, bays: bays };
    var P = ctx.project;
    var map = axis === "y"
      ? function (u, z) { return P(at, u, z); }
      : function (u, z) { return P(u, at, z); };
    for (var i = 0; i < nBays; i++) {
      var a = u0 + (u1 - u0) * i / nBays, b = u0 + (u1 - u0) * (i + 1) / nBays;
      var q = [map(a, z0), map(b, z0), map(b, z1), map(a, z1)];
      var d = depthOf(q);
      out.push({ svg: ctx.poly(q, ctx.shade(fill, nx, ny, 0), edge, 0.6), depth: d });
      bays.push({ uc: (a + b) / 2, half: Math.abs(b - a) / 2, depth: d, map: map });
    }
    return { parts: out, bays: bays };
  }

  /* A SEMICIRCULAR END, as facets struck on a true half circle from one
     straight wall round to the other. Each facet is culled and depth sorted
     on its own outward normal, which is what keeps the near side of the curve
     in front of the far side; drawn as one polygon it would read as a flat
     wall cut on a slant. Each facet also hands back a map along its own
     chord, so a window can be set on it the same way as on a straight bay. */
  function apseRun(ctx, cx, cy, r, z0, z1, fill, edge, N) {
    var P = ctx.project, out = [], facets = [];
    for (var i = 0; i < N; i++) {
      var a0 = (i / N) * Math.PI, a1 = ((i + 1) / N) * Math.PI, am = (a0 + a1) / 2;
      var nx = Math.cos(am), ny = Math.sin(am);
      if (!ctx.faceVisible(nx, ny)) continue;
      var q = [P(cx + r * Math.cos(a0), cy + r * Math.sin(a0), z0),
               P(cx + r * Math.cos(a1), cy + r * Math.sin(a1), z0),
               P(cx + r * Math.cos(a1), cy + r * Math.sin(a1), z1),
               P(cx + r * Math.cos(a0), cy + r * Math.sin(a0), z1)];
      var d = depthOf(q);
      out.push({ svg: ctx.poly(q, ctx.shade(fill, nx, ny, 0), edge, 0.6), depth: d });
      facets.push({
        i: i, depth: d, uc: 0, half: r * Math.sin((a1 - a0) / 2),
        map: (function (mx, my, tx, ty) {
          return function (u, z) { return P(mx + tx * u, my + ty * u, z); };
        })(cx + r * Math.cos(am), cy + r * Math.sin(am), -Math.sin(am), Math.cos(am))
      });
    }
    return { parts: out, facets: facets };
  }

  /* ---------------- Stop 3: Park Street Church ----------------
     Peter Banner, 1809. Solomon Willard carved the capitals. The tallest
     building in the United States from 1810 to 1828, and still the thing you
     see first coming up Tremont Street.

     Federal, and the styles book carries the tells; what this building adds
     to the book is the SPIRED TOWER, whose orders climb Doric, Ionic,
     Corinthian, Composite as the stages diminish. See STYLES.md.

     WHAT IS DRAWN, AND WHY ONLY THIS. The steeple. Not the meeting house.
     Four earlier runs of the landmark routine left this building unbuilt for
     one reason: no source publishes the footprint of the brick body. That is
     still true and nothing here invents it. What changed is that every
     dimension of the TOWER AND SPIRE turned out to be published, itemised
     stage by stage, so the part of this building that is actually the
     landmark can be drawn honestly while the part that cannot be measured is
     left off rather than guessed at.

     SOURCE, read 2026-09-02: "The Preservation of Park Street Church,
     Boston," issued by the Committee, 1903, archive.org
     `preservationpar01churgoog`, quoting Bowen's Picture of Boston, 1833:

       "The tower is 72 feet in height, and 27 by 31 in breadth, of the Doric
        order. On each side of the tower is a circular vestibule of two
        stories, containing stairs to the galleries. This and the tower
        ornamented with four columns of 35 feet, and the vestibule, is crowned
        by an elegant pediment and balustrade ... The tower supports a square
        story for a bell, 8 feet high and 20 feet square, with four large
        circular windows, eight columns on pedestals of the Ionic order, with
        corresponding pilasters, crowned by four pediments and cornices. On
        this stands an octagon, 25 feet high and 16 feet from side to side,
        with four circular windows, ornamented with 8 Corinthian columns ...
        This supports another octagon of 20 feet, 12 feet and 6 inches from
        side to side, with the same number of columns and windows of the
        Composite order. On this stands a base for the spire, 11 feet from
        side to side and 9 in height, with 8 oval windows. From this rises an
        octagonal spire of 50 feet with a collar midway 9 feet 6 inches at its
        base, and diminishing gradually to 18 inches at the top, crowned by a
        ball 6 feet above, with a vane representing a blazing star. The height
        of the vane from the street is 217 feet 9 inches."

     Every horizontal and every vertical above is in the model, unrounded.

     THE ONE ARITHMETIC GAP, DECLARED RATHER THAN HIDDEN. The itemised heights
     sum to 190 ft: 72 tower + 8 bell + 25 + 20 + 9 + 50 spire + 6 to the ball.
     The published total to the vane is 217 ft 9 in. The 27 ft 9 in difference
     is the one band Bowen NAMES but does not measure, the pediment and
     balustrade crowning the tower, plus the vane itself. So the band is drawn
     at exactly the residual and its internal split is the only soft thing
     here. The total is published, each stage is published, and the leftover is
     stated instead of being quietly spread across the stages.

     TWO SMALLER CHOICES, also not published. Which of 27 and 31 faces Tremont
     Street: Bowen says "27 by 31" without saying which way round, and 27 is
     put across the front here. And the column diameters, proportioned from
     their published 35 ft height at the classical Doric eighth.

     NOT DRAWN, because unmeasured: the brick body, and the two circular
     vestibules Bowen puts on each side of the tower. The lot is published at
     80 ft on Tremont by 118 ft on Park, from the deed quoted in the same
     pamphlet, but a lot is not a footprint and it is not used here. */
  function parkStreet(ctx) {
    var BRICK = "#9a4b3a", BRICK_E = "#6d3327";
    var TRIM = "#f2ede1", TRIM_E = "#b9b0a0", TRIM_D = "#e2dbcb";
    var GLASS = "#3f4d55", GOLD = "#c9a22c", GOLD_E = "#8a6f18";
    var PAVE = "#ded8cb", GRASS = "#c2c9b4", STONE = "#c9c4b8";
    /* the stopping plane at the eaves is a LEAD grey, deliberately not a warm
       roofing brown: it is where the evidence runs out, and it should not
       compete with the steeple that is the landmark. */
    var DECK = "#8e8a7e";
    var out = [];

    /* PLAN, published: 27 across the Tremont front, 31 into the block. */
    var TW = 27, TD = 31;
    var x0 = -TW / 2, x1 = TW / 2, y0 = -TD / 2, y1 = TD / 2;
    var cy = 0;

    /* ================= THE BRICK BODY =================
       Five earlier runs left this building as a steeple standing on nothing,
       because no source published the meeting house. The Sanborn fire
       insurance atlas of Boston, 1885, sheet 12 (Library of Congress IIIF,
       file 1885-0012R) turned out to letter two of the numbers on the plan
       itself, and to give a plan good enough to measure the rest:

         PUBLISHED, lettered on the sheet beside the building
           40' TO EAVES     the height of the brick body
           2                two storeys, in the plan's own storey notation
           SPIRE 200'       a rounded fire-risk note. NOT a rival to Bowen's
                            217 ft 9 in and not averaged with it; recorded as
                            independent corroboration and nothing is changed.

         PUBLISHED, from the deed quoted in the 1903 pamphlet
           the lot, 80 ft on Tremont by 118 ft on Park.

         SCALED off the plan, and DECLARED SCALED rather than published. The
         sheet letters no dimension on the walls, so the outline was measured
         against the sheet's own scale bar at 6.04 px per foot (a 302 dpi scan
         of a printed 50 ft to the inch, confirmed twice):
           about 78 ft across the front, Park Street wall to Granary wall
           about 103 ft from the west wall to the eastern extremity
           a semicircular east end of radius about 39 ft, springing where the
             straight walls stop, which the drawing's own offsets confirm.

       THE SCALED FIGURES CHECK AGAINST THE PUBLISHED LOT, which is why they
       are trusted enough to draw: 78 by 103 sits inside 80 by 118 with a foot
       to spare across the front and room for an areaway behind. A measurement
       that had to be squeezed into the deed would have been thrown away.

       WHAT IS STILL NOT KNOWN, and is therefore not drawn: the roof. A
       Sanborn is orthographic and publishes no pitch, and no other source
       carries one. The model stops at the published 40 ft eaves line. */
    var P = ctx.project;
    var BODY_W = 78, BODY_LEN = 103, APSE_R = 39, EAVE = 40;
    var bx0 = -BODY_W / 2, bx1 = BODY_W / 2;
    var by0 = y0;                          /* west wall in the tower's plane */
    var byS = by0 + (BODY_LEN - APSE_R);   /* where the round end springs */
    var BZ0 = 1.6, midY = by0 + BODY_LEN / 2;

    /* the corner it stands on, paved to the PUBLISHED LOT. The deed gives the
       lot's size and not where in it the church sits, so the lot is centred
       on the measured footprint and that centring is the one soft thing here.
       Ground planes take an explicit far depth through ground(), which is why
       they never paint over the building. */
    out.push(ground(ctx, 0, midY, 320, 320, 0, GRASS, "#a8b09a"));
    out.push(ground(ctx, 0, midY, 80, 118, 0.4, PAVE, "#bfb9aa"));

    /* the water table, one foot proud of the wall and one foot of stone */
    var PL = 1.0;
    out = out.concat(wallRun(ctx, "x", by0 - PL, bx0 - PL, bx1 + PL, 0.4, BZ0, 0, -1, STONE, "#9d988c", 4).parts);
    out = out.concat(wallRun(ctx, "y", bx0 - PL, by0 - PL, byS, 0.4, BZ0, -1, 0, STONE, "#9d988c", 5).parts);
    out = out.concat(wallRun(ctx, "y", bx1 + PL, by0 - PL, byS, 0.4, BZ0, 1, 0, STONE, "#9d988c", 5).parts);
    out = out.concat(apseRun(ctx, 0, byS, APSE_R + PL, 0.4, BZ0, STONE, "#9d988c", 14).parts);

    /* THE WEST FRONT IS DRAWN IN TWO PANELS with the tower's own 27 ft left
       out from between them. The plan is a single outline and the tower
       stands inside it, so a full width wall here would put a 78 ft sheet of
       brick in the same plane as the tower's door and the sort would decide
       which of them the reader sees. Declining to draw wall where the plan
       has tower is not an invention. */
    var runs = [];
    runs.push(wallRun(ctx, "x", by0, bx0, x0, BZ0, EAVE, 0, -1, BRICK, BRICK_E, 2));
    runs.push(wallRun(ctx, "x", by0, x1, bx1, BZ0, EAVE, 0, -1, BRICK, BRICK_E, 2));
    runs.push(wallRun(ctx, "y", bx0, by0, byS, BZ0, EAVE, -1, 0, BRICK, BRICK_E, 5));
    runs.push(wallRun(ctx, "y", bx1, by0, byS, BZ0, EAVE, 1, 0, BRICK, BRICK_E, 5));
    runs.forEach(function (r) { out = out.concat(r.parts); });
    var round = apseRun(ctx, 0, byS, APSE_R, BZ0, EAVE, BRICK, BRICK_E, 12);
    out = out.concat(round.parts);

    /* TWO STOREYS, which the plan letters as a plain 2, so the body carries
       two ranks of window and not three. They are round headed because that
       is what this building's flanks carry. Their SIZE and their NUMBER are
       published nowhere and are not on the plan: they follow the bays, and
       the bays were chosen for depth sorting. Declared soft, exactly like the
       column diameters in the tower above. */
    function twoRanks(f) {
      var hw = Math.min(3.1, f.half * 0.42);
      if (hw < 1.2) return;
      out.push(archOpening(ctx, f.map, f.uc, hw, 5.5, 14.5, GLASS, TRIM_E, f.depth + 0.4));
      out.push(archOpening(ctx, f.map, f.uc, hw, 21.0, 30.0, GLASS, TRIM_E, f.depth + 0.4));
    }
    runs.forEach(function (r) { r.bays.forEach(twoRanks); });
    round.facets.forEach(function (f) { if (f.i % 2 === 0) twoRanks(f); });

    /* the eaves cornice, at the published 40 ft and standing a foot proud */
    var CZ = EAVE - 1.8;
    out = out.concat(wallRun(ctx, "x", by0 - PL, bx0 - PL, bx1 + PL, CZ, EAVE, 0, -1, TRIM_D, TRIM_E, 4).parts);
    out = out.concat(wallRun(ctx, "y", bx0 - PL, by0 - PL, byS, CZ, EAVE, -1, 0, TRIM_D, TRIM_E, 5).parts);
    out = out.concat(wallRun(ctx, "y", bx1 + PL, by0 - PL, byS, CZ, EAVE, 1, 0, TRIM_D, TRIM_E, 5).parts);
    out = out.concat(apseRun(ctx, 0, byS, APSE_R + PL, CZ, EAVE, TRIM_D, TRIM_E, 14).parts);

    /* THE ROOF IS NOT DRAWN and the deck that closes the walls is a STOPPING
       PLANE, not a claim that this church is flat roofed. It is where the
       evidence stops. The deck is traced AROUND the tower rather than across
       it, so the two never contend for the same pixels at the same depth. */
    var deck = [P(bx0, by0, EAVE), P(x0, by0, EAVE), P(x0, y1, EAVE),
                P(x1, y1, EAVE), P(x1, by0, EAVE), P(bx1, by0, EAVE)];
    for (var dk = 0; dk <= 18; dk++) {
      var ad = (dk / 18) * Math.PI;
      deck.push(P(APSE_R * Math.cos(ad), byS + APSE_R * Math.sin(ad), EAVE));
    }
    /* AND ITS DEPTH IS EXPLICIT, which the render is the reason for. Sorted
       on its own corners the deck took the depth of its NEAREST corner, the
       west end beside the tower, and then painted its far half straight over
       the tower's front, eating the pediment and the tops of the four
       published columns. The arithmetic passed it; one look did not. The deck
       lies behind every wall that is drawn, because an inward facing wall is
       culled and never reaches the sort, so it is given a depth below all of
       them and painted first. */
    out.push({ svg: ctx.poly(deck, ctx.shade(DECK, 0, 0, 1), TRIM_E, 0.6),
               depth: -1e7 });
    /* ================= end of the body ================= */


    /* THE TOWER, 72 ft, Doric, brick */
    var TOP = 72;
    var tower = box(ctx, x0, x1, y0, y1, 1.6, TOP, BRICK, BRICK_E, null);
    out = out.concat(tower.parts);

    /* the Tremont front: the door, and the window over it */
    if (ctx.faceVisible(0, -1)) {
      var dF = tower.walls["0,-1"];
      var mapF = function (u, z) { return ctx.project(u, y0, z); };
      out.push(archOpening(ctx, mapF, 0, 4.2, 1.6, 13, "#4a3a30", TRIM_E, dF + 0.4));
      out.push(archOpening(ctx, mapF, 0, 3.4, 22, 30, GLASS, TRIM_E, dF + 0.4));
      out.push(archOpening(ctx, mapF, 0, 2.8, 48, 54, GLASS, TRIM_E, dF + 0.4));
    }
    /* and the same on whichever flank is turned to us */
    [[-1, x0], [1, x1]].forEach(function (side) {
      var d = tower.walls[side[0] + ",0"];
      if (d === undefined) return;
      var X = side[1];
      var map = function (u, z) { return ctx.project(X, u, z); };
      out.push(archOpening(ctx, map, cy, 3.4, 22, 30, GLASS, TRIM_E, d + 0.4));
      out.push(archOpening(ctx, map, cy, 2.8, 48, 54, GLASS, TRIM_E, d + 0.4));
    });

    /* THE FOUR COLUMNS OF 35 FEET, published, Doric, on the Tremont front.
       Diameter proportioned from the published height, and said so above. */
    var COL_R = 35 / 8 / 2;
    var ENT0 = 1.6 + 35, ENT_H = 3.2;
    if (ctx.faceVisible(0, -1)) {
      var dC = tower.walls["0,-1"];
      [-10.2, -3.4, 3.4, 10.2].forEach(function (cxq, i) {
        out = out.concat(columnAt(ctx, cxq, y0 - COL_R * 0.55, COL_R, 1.6, ENT0,
                                  TRIM, TRIM_E, dC + 1.0 + i * 0.05));
      });
      /* the entablature the four columns carry, and over it the PEDIMENT.
         Bowen's sentence puts the pediment here: the tower "ornamented with
         four columns of 35 feet, and the vestibule, is crowned by an elegant
         pediment and balustrade." So the pediment crowns the order, which is
         where a pediment belongs, rather than floating 40 ft above it. */
      out = out.concat(slab(ctx, 0, y0 - COL_R * 0.55, TW + 1.4, COL_R * 2.2,
                            ENT0, ENT_H, TRIM_D, TRIM_E, dC + 1.6));
      var Pp = ctx.project, yP = y0 - COL_R * 1.1, pz = ENT0 + ENT_H;
      var ped = [Pp(-(TW + 1.4) / 2, yP, pz), Pp((TW + 1.4) / 2, yP, pz),
                 Pp(0, yP, pz + (TW + 1.4) / 2 * 0.30)];
      out.push({ svg: ctx.poly(ped, ctx.shade(TRIM, 0, -1, 0), TRIM_E, 0.6),
                 depth: dC + 1.9 });
    }

    /* THE UNITEMISED BAND, 72 to 94.85, and ITS HEIGHT IS NOT A FREE CHOICE.
       Bowen itemises 72 + 8 + 25 + 20 + 9 + 50 + 6 = 190 ft and publishes the
       vane at 217 ft 9 in, so 27 ft 9 in is unmeasured. But this model also
       has to put a cornice between the stages Bowen describes as standing one
       on another, and those cornices (2.0 + 1.6 + 1.3 = 4.9 ft) are unmeasured
       too. They come OUT of the same 27.75, they are not added on top of it.
       An earlier version of this scene spent the whole 27.75 on the band and
       then added the cornices as well, which pushed the spire 4.9 ft too high
       and left 1.1 ft for a published 6 ft ball, so the ball was drawn upside
       down. The render showed it; the arithmetic had not.
         72 + 22.85 + 8 + 2.0 + 25 + 1.6 + 20 + 1.3 + 9 + 50 + 6 = 217.75.
       That closes on the published total exactly, with every published stage
       unrounded, and the band is the only soft number in the steeple.

       ITS INTERNAL SPLIT is soft too, and the one rule it must obey is that
       nothing floats: the attic is solid brick from the tower cornice to the
       balustrade, so the rail stands on something. */
    var BAND0 = 72, BAND1 = 94.85;
    var CORN_H = 3.4, BAL_H = 4.0;
    out = out.concat(slab(ctx, 0, cy, TW + 2.2, TD + 2.2, BAND0, CORN_H, TRIM_D, TRIM_E));

    var ATT0 = BAND0 + CORN_H, ATT1 = BAND1 - BAL_H;
    var attic = box(ctx, x0, x1, y0, y1, ATT0, ATT1, BRICK, BRICK_E, null);
    out = out.concat(attic.parts);
    /* the clock stage's one opening per visible face, round headed */
    [[0, -1], [1, 0], [-1, 0], [0, 1]].forEach(function (n) {
      var d = attic.walls[n[0] + "," + n[1]];
      if (d === undefined) return;
      var map = n[0] === 0
        ? function (u, z) { return ctx.project(u, n[1] < 0 ? y0 : y1, z); }
        : function (u, z) { return ctx.project(n[0] < 0 ? x0 : x1, u, z); };
      out.push(archOpening(ctx, map, n[0] === 0 ? 0 : cy, 3.0,
                           ATT0 + 2.4, ATT0 + 8.0, GLASS, TRIM_E, d + 0.4));
    });
    out = out.concat(slab(ctx, 0, cy, TW + 2.2, TD + 2.2, ATT1 - 1.0, 1.0, TRIM_D, TRIM_E));

    /* the balustrade, 4 ft, standing on the attic and not in the air */
    var BAL0 = ATT1, BAL1 = BAND1;
    [[0, -1], [1, 0], [-1, 0], [0, 1]].forEach(function (n) {
      var d = attic.walls[n[0] + "," + n[1]];
      if (d === undefined) return;
      var map = n[0] === 0
        ? function (u, z) { return ctx.project(u, n[1] < 0 ? y0 - 1.1 : y1 + 1.1, z); }
        : function (u, z) { return ctx.project(n[0] < 0 ? x0 - 1.1 : x1 + 1.1, u, z); };
      var a = n[0] === 0 ? x0 - 1.1 : y0 - 1.1, b = n[0] === 0 ? x1 + 1.1 : y1 + 1.1;
      out = out.concat(balustrade(ctx, map, a, b, BAL0, BAL1, TRIM, TRIM_E, d + 0.4));
    });

    /* THE BELL STORY: published 20 ft square, 8 ft high, four large circular
       windows, eight Ionic columns on pedestals, four pediments and cornices.

       THE EIGHT COLUMNS ARE PLACED ONCE, ON THE PLAN, not per visible face.
       Placing them inside the face loop put them outside the wall plane on
       the flanks, where they poked out sideways and read as brackets. Eight
       columns on a square is two to a face, set in from the corners, and the
       positions are computed here and then drawn only if their own face is
       turned to us. */
    var B0 = BAND1, B1 = B0 + 8, bw = 20, bh = bw / 2;
    var bell = box(ctx, -bh, bh, cy - bh, cy + bh, B0, B1, TRIM, TRIM_E, null);
    out = out.concat(bell.parts);

    var BELL_COLS = [];
    [[0, -1], [1, 0], [-1, 0], [0, 1]].forEach(function (n) {
      [-6.4, 6.4].forEach(function (u) {
        BELL_COLS.push(n[0] === 0
          ? { x: u, y: cy + n[1] * (bh + 0.9), n: n }
          : { x: n[0] * (bh + 0.9), y: cy + u, n: n });
      });
    });
    BELL_COLS.forEach(function (c, i) {
      var d = bell.walls[c.n[0] + "," + c.n[1]];
      if (d === undefined) return;
      out = out.concat(columnAt(ctx, c.x, c.y, 1.0, B0, B1, TRIM, TRIM_E, d + 0.8 + i * 0.02));
    });
    /* one large CIRCULAR window per face: four in all, as published, and
       circular rather than round headed because Bowen says circular */
    [[0, -1], [1, 0], [-1, 0], [0, 1]].forEach(function (n) {
      var d = bell.walls[n[0] + "," + n[1]];
      if (d === undefined) return;
      var map = n[0] === 0
        ? function (u, z) { return ctx.project(u, cy + n[1] * bh, z); }
        : function (u, z) { return ctx.project(n[0] * bh, u, z); };
      out.push(roundWindow(ctx, map, n[0] === 0 ? 0 : cy, B0 + 4.0, 2.7,
                           "#2f3a40", TRIM_E, d + 0.4));
    });
    out = out.concat(slab(ctx, 0, cy, bw + 2.6, bw + 2.6, B1, 2.0, TRIM_D, TRIM_E));

    /* THE TWO OCTAGONS, both published across the flats, so the circumradius
       is w / 2 / cos(22.5deg) and not the half width.

       EACH GETS ITS PUBLISHED WINDOWS AND COLUMNS. Drawn as bare tapers the
       two stages read as a single cone and the orders Bowen names, Corinthian
       then Composite, are the whole point of the diminishing. Four circular
       windows and eight columns on each, exactly as published. */
    function circumR(flats) { return (flats / 2) / Math.cos(Math.PI / 8); }
    var O1_0 = B1 + 2.0, O1_1 = O1_0 + 25, r1 = circumR(16);
    out = out.concat(octStage(ctx, 0, cy, r1, r1, O1_0, O1_1, TRIM, TRIM_E));
    out = out.concat(octDetail(ctx, 0, cy, r1, O1_0, O1_1, 0.85, 1.9, TRIM, TRIM_E));
    out = out.concat(octStage(ctx, 0, cy, r1 + 1.1, r1 + 1.1, O1_1, O1_1 + 1.6, TRIM_D, TRIM_E));

    var O2_0 = O1_1 + 1.6, O2_1 = O2_0 + 20, r2 = circumR(12.5);
    out = out.concat(octStage(ctx, 0, cy, r2, r2, O2_0, O2_1, TRIM, TRIM_E));
    out = out.concat(octDetail(ctx, 0, cy, r2, O2_0, O2_1, 0.7, 1.5, TRIM, TRIM_E));
    out = out.concat(octStage(ctx, 0, cy, r2 + 0.9, r2 + 0.9, O2_1, O2_1 + 1.3, TRIM_D, TRIM_E));

    /* THE SPIRE BASE: 11 ft from side to side, 9 ft high, eight oval windows */
    var S0 = O2_1 + 1.3, S1 = S0 + 9, rB = circumR(11);
    out = out.concat(octStage(ctx, 0, cy, rB, rB, S0, S1, TRIM, TRIM_E));
    out = out.concat(octDetail(ctx, 0, cy, rB, S0, S1, 0, 1.2, TRIM, TRIM_E));

    /* THE SPIRE: 50 ft, 9 ft 6 in across the base, 18 in across the top,
       with the collar Bowen puts midway. */
    var SP0 = S1, SP1 = SP0 + 50, rS = circumR(9.5), rT = circumR(1.5);
    var MID = SP0 + 25, rM = (rS + rT) / 2;
    out = out.concat(octStage(ctx, 0, cy, rS, rM, SP0, MID, TRIM, TRIM_E));
    out = out.concat(octStage(ctx, 0, cy, rM + 0.8, rM + 0.8, MID, MID + 1.1, TRIM_D, TRIM_E));
    out = out.concat(octStage(ctx, 0, cy, rM, rT, MID + 1.1, SP1, TRIM, TRIM_E));

    /* THE BALL, published at 6 ft above the spire, and the blazing star. The
       stack now leaves exactly those 6 ft, so the ball is drawn the right way
       up and the vane tops out at the published 217 ft 9 in. */
    var TOTAL = 217.75;
    out = out.concat(octStage(ctx, 0, cy, 0.55, 0.55, SP1, SP1 + 1.6, GOLD, GOLD_E));
    out = out.concat(octStage(ctx, 0, cy, 1.7, 1.7, SP1 + 1.6, SP1 + 4.0, GOLD, GOLD_E));
    out = out.concat(octStage(ctx, 0, cy, 0.45, 0.45, SP1 + 4.0, TOTAL - 2.6, GOLD, GOLD_E));
    /* the star is drawn in the vertical plane, so it is built in (x, z) */
    var Pv = ctx.project, star = [];
    for (var t = 0; t < 10; t++) {
      var a2 = -Math.PI / 2 + t * Math.PI / 5, r3 = (t % 2 === 0) ? 2.6 : 1.1;
      star.push(Pv(r3 * Math.cos(a2), cy, TOTAL - 2.6 + r3 * Math.sin(a2) + 2.6));
    }
    out.push({ svg: ctx.poly(star, GOLD, GOLD_E, 0.5), depth: 1e8 });
    return out;
  }


  /* ---------------- The whole walk: sixteen stops, one landform ------------
     THE FREEDOM TRAIL AS A WALK, which is what a visitor actually buys. Nine
     of the stops above are buildings and each one is drawn alone; this is the
     line between them, with the hills in it.

     Style: THE CUT SECTION, the entry the styles book added when the Pier 66
     walk was drawn. Its tells are read back at the bottom of this comment and
     every one of them is obeyed here.

     THE MEASUREMENT, and it is not eyeballed. `freedom_trail_walk.json` in
     this repo carries 127 vertices, measured 2026-09-03: the 16 published stop
     coordinates from trails.json, routed leg by leg on brouter.de with
     profile=hiking-beta (a true foot router; router.project-osrm.org was
     caught being a car), simplified to a 30 m minimum vertex spacing, and then
     given an elevation per vertex from USGS 3DEP at epqs.nationalmap.gov in
     feet. The array below is that file, transcribed. Columns are metres east
     and north of Boston Common, feet above sea level, and metres walked.

       length   5,650.8 m = 3.511 mi
       start    18.0 ft on the Common, high 90.3 ft at 594 m on Beacon Hill,
                end 79.9 ft at the Monument
       climbed  241.3 ft gross, 179.4 ft given back, 61.9 ft net

     THE DISAGREEMENT, printed and not averaged. The Freedom Trail Foundation
     publishes 2.5 miles. This says 3.511. The gap is not a rounding: the
     crow-flies sum through the sixteen stops is already 3,537 m, and one of
     those straight lines runs 566 m over the Charles, which no walker does.
     Swap that single leg for its routed 1,487 m, leave every other leg at its
     impossible straight line, and the floor is still 2.77 mi. So 2.5 is below
     the shortest path that can reach these stops. Both numbers belong on any
     page that shows this model.

     WHAT IS CARRIED AND NOT MEASURED, declared because 3DEP is a BARE EARTH
     raster and hands back the water under a bridge rather than the deck.
     Vertices 90 to 92 came back below sea level and are the Charlestown
     Bridge; vertex 108 came back below sea level and is the USS Constitution's
     berth. Their elevations are carried from the vertices on either side. This
     model draws exactly those runs as DECK on piers rather than as ground, so
     the reader can see which part of the line is not standing on earth.

     THE TELLS, read back:
       datum          mean sea level, which is where the elevations are from
       exaggeration   VE below, declared, and the horizontal is untouched
       interpolation  none; the ground line is straight between samples
       ribbon width   HALF below is a DRAWING DEVICE and not a measurement */

  var FT_WALK = [
    [     0.0,      0.0,   18.0,      0.0],
    [    46.1,     23.6,   21.3,     51.9],
    [    95.7,     53.1,   25.2,    109.6],
    [   138.0,     77.3,   27.8,    158.4],
    [   152.5,    112.4,   33.1,    197.4],
    [   169.7,    169.4,   42.5,    256.9],
    [   192.6,    249.1,   65.3,    339.9],
    [   194.5,    276.7,   79.0,    372.8],
    [   223.2,    290.4,   79.1,    405.4],
    [   240.0,    316.4,   81.0,    446.9],
    [   268.3,    334.0,   81.4,    480.4],
    [   259.6,    382.7,   85.6,    530.0],
    [   248.5,    406.4,   87.0,    560.6],
    [   218.6,    405.9,   90.3,    594.0],
    [   209.4,    434.8,   86.6,    627.0],
    [   201.0,    441.5,   82.3,    640.8],
    [   218.0,    408.4,   90.1,    684.9],
    [   245.8,    405.9,   87.2,    718.1],
    [   259.6,    382.7,   85.6,    751.5],
    [   267.1,    345.2,   82.6,    789.8],
    [   240.0,    316.4,   81.0,    834.6],
    [   257.2,    281.9,   70.4,    876.4],
    [   298.5,    222.3,   56.7,    949.0],
    [   316.6,    199.2,   52.6,    978.4],
    [   343.0,    191.5,   49.8,   1014.0],
    [   386.9,    249.5,   54.9,   1086.7],
    [   351.3,    246.0,   56.6,   1132.9],
    [   344.7,    241.7,   56.6,   1141.3],
    [   366.0,    262.2,   57.8,   1171.5],
    [   408.7,    277.2,   54.9,   1231.3],
    [   446.0,    326.4,   52.9,   1293.0],
    [   469.3,    337.9,   50.1,   1327.1],
    [   490.4,    327.6,   46.7,   1351.4],
    [   522.1,    315.6,   41.8,   1385.3],
    [   554.5,    303.5,   37.4,   1419.9],
    [   624.3,    279.0,   29.7,   1493.9],
    [   603.0,    238.7,   32.1,   1542.9],
    [   623.6,    213.1,   30.2,   1580.1],
    [   623.8,    245.9,   30.8,   1626.9],
    [   648.7,    280.0,   27.8,   1669.2],
    [   670.4,    321.9,   30.2,   1716.5],
    [   676.0,    368.2,   30.0,   1763.2],
    [   679.2,    406.2,   28.5,   1801.3],
    [   716.9,    406.1,   23.3,   1839.1],
    [   724.8,    417.0,   22.7,   1875.5],
    [   704.3,    412.1,   25.3,   1896.7],
    [   714.2,    410.4,   23.6,   1931.9],
    [   722.5,    424.9,   22.5,   1968.3],
    [   729.0,    424.6,   21.8,   1974.8],
    [   749.3,    445.4,   18.7,   2013.4],
    [   750.4,    526.1,    9.0,   2111.6],
    [   786.3,    541.5,    9.5,   2160.6],
    [   782.5,    577.6,    9.0,   2197.0],
    [   804.2,    578.0,    9.2,   2220.9],
    [   779.3,    595.0,    8.3,   2259.6],
    [   793.1,    620.5,    8.2,   2304.4],
    [   824.2,    642.2,    8.1,   2342.6],
    [   851.9,    683.4,    8.9,   2392.2],
    [   877.7,    730.3,   13.4,   2445.7],
    [   898.7,    785.9,   20.2,   2505.7],
    [   925.4,    817.6,   16.4,   2550.5],
    [   944.7,    841.2,   11.8,   2581.1],
    [   960.8,    876.9,   13.2,   2620.2],
    [   978.8,    907.6,   14.7,   2655.9],
    [  1001.9,    933.8,   15.8,   2691.0],
    [  1020.6,    972.0,   21.3,   2733.7],
    [  1033.3,   1008.8,   26.3,   2772.6],
    [  1050.1,   1060.4,   24.2,   2826.9],
    [  1038.1,   1083.4,   23.1,   2860.1],
    [  1061.0,   1114.6,   21.6,   2898.9],
    [  1074.2,   1143.3,   20.8,   2930.5],
    [  1063.8,   1163.5,   20.5,   2963.5],
    [  1016.5,   1208.3,   21.3,   3031.5],
    [   990.1,   1214.7,   21.6,   3067.5],
    [   981.7,   1236.7,   22.2,   3099.7],
    [   955.5,   1249.7,   28.7,   3133.7],
    [   948.3,   1253.9,   28.7,   3142.1],
    [   937.4,   1276.8,   29.7,   3173.9],
    [   963.4,   1339.8,   33.0,   3245.8],
    [   931.8,   1360.0,   40.1,   3283.3],
    [   878.7,   1394.2,   44.3,   3346.5],
    [   854.9,   1410.4,   41.8,   3375.3],
    [   800.6,   1448.6,   24.8,   3441.7],
    [   776.1,   1466.1,   13.3,   3471.8],
    [   741.1,   1438.4,   12.9,   3517.6],
    [   715.3,   1415.3,   13.3,   3552.3],
    [   686.8,   1415.3,   12.9,   3590.5],
    [   663.1,   1391.4,   11.5,   3624.2],
    [   636.5,   1364.9,   13.9,   3661.8],
    [   609.3,   1373.0,   18.2,   3693.5],
    [   531.8,   1522.5,   21.8,   3861.9],
    [   517.2,   1556.9,   22.6,   3899.3],
    [   499.0,   1584.9,   23.3,   3932.7],
    [   421.2,   1734.1,   26.9,   4101.0],
    [   394.3,   1770.9,   26.2,   4146.6],
    [   370.4,   1792.5,   25.0,   4178.9],
    [   375.6,   1819.6,   23.2,   4208.9],
    [   451.9,   1889.3,   18.7,   4312.3],
    [   469.8,   1865.4,   12.0,   4345.0],
    [   489.5,   1853.9,   10.7,   4376.6],
    [   607.8,   1929.7,    8.3,   4517.2],
    [   645.1,   1953.0,    8.7,   4561.1],
    [   678.3,   1973.7,   10.1,   4600.3],
    [   706.5,   1997.4,    9.6,   4637.5],
    [   771.5,   2043.6,    9.5,   4717.3],
    [   795.2,   2020.9,    9.3,   4755.7],
    [   768.3,   1995.9,    8.8,   4800.7],
    [   786.6,   1967.9,    8.5,   4835.7],
    [   783.8,   1947.3,    8.5,   4863.2],
    [   773.9,   1977.7,    8.4,   4906.8],
    [   797.1,   2013.7,    9.5,   4959.7],
    [   782.9,   2038.3,   10.4,   4992.0],
    [   758.9,   2053.5,    9.7,   5025.2],
    [   738.5,   2077.9,   13.0,   5057.0],
    [   726.1,   2098.9,   14.5,   5087.9],
    [   697.4,   2074.2,   13.8,   5125.7],
    [   671.3,   2067.8,   15.7,   5161.7],
    [   646.6,   2087.6,   19.9,   5193.6],
    [   624.6,   2077.1,   19.2,   5225.9],
    [   603.0,   2098.3,   20.3,   5256.1],
    [   586.5,   2142.0,   29.5,   5312.8],
    [   570.0,   2231.7,   51.6,   5404.0],
    [   554.0,   2316.2,   65.0,   5490.0],
    [   501.1,   2346.4,   62.1,   5553.0],
    [   469.6,   2361.5,   77.5,   5587.9],
    [   445.5,   2382.9,   78.5,   5626.7],
    [   434.2,   2382.6,   79.9,   5650.8]
  ];

  /* Declared vertical exaggeration. 82 ft of relief over 5,651 m of walk is a
     slope of 1 in 226, and at true scale this model is a flat tape with no
     grade on it at all. Four is chosen rather than picked, and it was picked
     down from six by LOOKING. Two constraints decide it. The steepest measured
     pitch, 13.4 percent up Breed's Hill, draws at 28 degrees, which is what
     the Pier 66 walk's steepest block draws at and reads as a hill rather than
     a cliff. And the cut mass, which runs from the sea level datum to 90.3 ft,
     stands 110 m tall against a 70 m ribbon, a ratio of 1.6, which is exactly
     the proportion that stopped the Pier 66 walk from coming back a dam wall.
     At six it was 165 m against the same ribbon and the surface went edge on. */
  var VE_WALK = 4;
  var FT_M = 0.3048;

  /* Half width of the drawn ribbon, in metres, and NOT a measurement. A real
     pavement is about 3 m and at 3 m this ribbon is a thread 5.6 km long. It
     is drawn at roughly the same fraction of its scene that the Pier 66 walk
     used, so the surface is wide enough to carry the grade colour. It says
     nothing about the width of any Boston street.

     WHY IT IS 35 AND NOT THE 110 THE FIRST DRAFT USED, and the picture is the
     only thing that could have said so. The Pier 66 walk is 1.3 km long and
     took a 40 m half width, about a tenth of its scene. Scaling that fraction
     to this scene gave 110, and at 110 the render came back as a chain of fat
     overlapping pads: the vertices here are 30 m apart and Boston's corners
     are sharp, so a ribbon wider than its own turning radius folds over itself
     at every bend and the line stops being a line. 35 is under that radius and
     still 25 px wide in a 900 px render. */
  var HALF_WALK = 35;

  /* THE BRIDGE RUN AND THE BERTH SPUR. These are the segment indices whose
     ground the DEM refused, so they are drawn as deck. The extent is inferred
     from which vertices came back under water, not measured off a plan, and
     is declared as such. */
  var DECK_SEGS = { 89: 1, 90: 1, 91: 1, 92: 1, 107: 1, 108: 1 };

  function walkZ(ft) { return ft * FT_M * VE_WALK; }

  function freedomWalk(ctx) {
    var P = ctx.project, out = [];
    var EARTH = "#c7c0ae", EARTH_EDGE = "#8f8879";
    var PATH  = "#d8d2c4", PATH_EDGE  = "#a49c8c";
    var STEEP = "#c98a4b", STEEP_EDGE = "#8f5f31";
    var WATER = "#8fa6ae", WATER_EDGE = "#5d7079";
    var DECK  = "#b3ab9a", DECK_EDGE  = "#7d7768";
    var POST  = "#7e796f";
    var W = FT_WALK, N = W.length;

    /* left and right edges of the ribbon, offset along the normal to the
       direction of travel at each vertex.

       THE HAIRPIN, which the first look found and the arithmetic could not.
       This walk goes UP Park Street to the State House and comes back DOWN the
       same pavement, so at the turn the vertex before and the vertex after are
       nearly the same point, the chord between them is about zero, and a
       normal taken from that chord collapses. The ribbon pinched to nothing
       there and the surface came back as a fan of triangular slivers. Where
       that chord is degenerate the normal is taken from the outgoing segment
       instead, which is the direction the walker is actually facing. */
    var L = [], R = [];
    for (var i = 0; i < N; i++) {
      var a = W[Math.max(0, i - 1)], b = W[Math.min(N - 1, i + 1)];
      var dx = b[0] - a[0], dy = b[1] - a[1];
      var m = Math.sqrt(dx * dx + dy * dy);
      if (m < 12) {
        if (i === N - 1) { dx = W[i][0] - W[i - 1][0]; dy = W[i][1] - W[i - 1][1]; }
        else { dx = W[i + 1][0] - W[i][0]; dy = W[i + 1][1] - W[i][1]; }
        m = Math.sqrt(dx * dx + dy * dy) || 1;
      }
      var nx = -dy / m, ny = dx / m;
      L.push([W[i][0] + nx * HALF_WALK, W[i][1] + ny * HALF_WALK]);
      R.push([W[i][0] - nx * HALF_WALK, W[i][1] - ny * HALF_WALK]);
    }

    /* THE RETRACE, DRAWN ONCE. Between 447 m and 835 m the walk climbs Park
       and Beacon to the State House and comes back down the same pavement:
       vertices 9 and 20 are the SAME POINT to the metre, as are 11 and 18. Two
       ribbons then lie exactly on top of each other, and the first look came
       back with a fan of slivers there, because coplanar faces sort on a tie.
       Drawing it twice would also claim two surfaces where Boston has one. So
       a segment whose midpoint falls within 12 m of an earlier segment's is
       skipped by the ground and the surface. It is still walked, and its
       length is still in the 5,650.8 m: only the paint is dropped. Checked
       before doing it: none of the four measured pitches is inside the
       retrace, so no grade claim is lost. */
    var SKIP = {};
    (function () {
      var mid = [];
      for (var i = 0; i < N - 1; i++)
        mid.push([(W[i][0] + W[i + 1][0]) / 2, (W[i][1] + W[i + 1][1]) / 2]);
      for (var a2 = 1; a2 < mid.length; a2++)
        for (var b2 = 0; b2 < a2; b2++) {
          if (SKIP[b2]) continue;
          var ddx = mid[a2][0] - mid[b2][0], ddy = mid[a2][1] - mid[b2][1];
          if (ddx * ddx + ddy * ddy < 144) { SKIP[a2] = 1; break; }
        }
    })();

    /* The Charles, drawn only where the walk crosses it, and given an explicit
       depth so that a plane spanning the crossing does not sort on its own
       near corner and paint over the bridge standing on it. That rule has now
       been the difference seven times. Its EXTENT is a drawing device: the
       fact of water here is known, because the bare earth raster returned it;
       the position of the banks is not measured by this file. */
    (function () {
      var x0 = W[89][0], y0 = W[89][1], x1 = W[93][0], y1 = W[93][1];
      var dx = x1 - x0, dy = y1 - y0, m = Math.sqrt(dx * dx + dy * dy) || 1;
      var ex = dx / m, ey = dy / m, sx = -ey, sy = ex, SPAN = 150, OVER = 30;
      var q = [P(x0 - ex * OVER + sx * SPAN, y0 - ey * OVER + sy * SPAN, 0),
               P(x1 + ex * OVER + sx * SPAN, y1 + ey * OVER + sy * SPAN, 0),
               P(x1 + ex * OVER - sx * SPAN, y1 + ey * OVER - sy * SPAN, 0),
               P(x0 - ex * OVER - sx * SPAN, y0 - ey * OVER - sy * SPAN, 0)];
      out.push({ svg: ctx.poly(q, WATER, WATER_EDGE, 0.5), depth: -1e9 });
    })();

    /* the ground mass, cut open on both sides down to mean sea level, and
       stopping at the water's edge. Each wall quad is a small face and sorts
       honestly on its own corners. */
    function wall(edge, sign) {
      for (var i = 0; i < N - 1; i++) {
        if (DECK_SEGS[i] || SKIP[i]) continue;
        var z0 = walkZ(W[i][2]), z1 = walkZ(W[i + 1][2]);
        var dx = edge[i + 1][0] - edge[i][0], dy = edge[i + 1][1] - edge[i][1];
        var m = Math.sqrt(dx * dx + dy * dy) || 1;
        var nx = sign * -dy / m, ny = sign * dx / m;
        if (!ctx.faceVisible(nx, ny)) continue;
        var q = [P(edge[i][0], edge[i][1], 0), P(edge[i + 1][0], edge[i + 1][1], 0),
                 P(edge[i + 1][0], edge[i + 1][1], z1), P(edge[i][0], edge[i][1], z0)];
        /* the walk retraces Park Street, so two cut walls can be exactly
           coincident. depthOf alone leaves those tied and the sort is then
           unstable; the index breaks the tie deterministically. */
        out.push({ svg: ctx.poly(q, ctx.shade(EARTH, nx, ny, 0.15), EARTH_EDGE, 0.4),
                   depth: depthOf(q) + i * 1e-3 });
      }
    }
    wall(L, 1); wall(R, -1);

    /* the cut ends, so the mass reads as cut and not as hollow: the two ends
       of the walk, and both banks where the deck leaves the ground */
    function cap(i, sign) {
      var z = walkZ(W[i][2]);
      var a = W[Math.max(0, i - 1)], b = W[Math.min(N - 1, i + 1)];
      var dx = b[0] - a[0], dy = b[1] - a[1], m = Math.sqrt(dx * dx + dy * dy) || 1;
      var nx = sign * dx / m, ny = sign * dy / m;
      if (!ctx.faceVisible(nx, ny)) return;
      var q = [P(L[i][0], L[i][1], 0), P(R[i][0], R[i][1], 0),
               P(R[i][0], R[i][1], z), P(L[i][0], L[i][1], z)];
      out.push({ svg: ctx.poly(q, ctx.shade(EARTH, nx, ny, 0.1), EARTH_EDGE, 0.5),
                 depth: depthOf(q) });
    }
    cap(0, -1); cap(N - 1, 1);
    cap(89, 1); cap(93, -1); cap(107, 1); cap(109, -1);

    /* THE DECK. Where the DEM refused the ground, the walk is carried on a
       slab rather than on earth, with piers to the datum, so that the part of
       the line whose height is carried rather than measured is the part that
       visibly does not stand on anything. */
    /* Deck thickness, in DRAWN metres, and a drawing device like the ribbon
       width. At 4 the first render had the deck lying flat on the water like
       paint; the crossing has to read as carried. */
    var TH = 14;
    for (var b1 in DECK_SEGS) {
      var s = +b1;
      var za = walkZ(W[s][2]) - TH, zb = walkZ(W[s + 1][2]) - TH;
      var qd = [P(L[s][0], L[s][1], za), P(R[s][0], R[s][1], za),
                P(R[s + 1][0], R[s + 1][1], zb), P(L[s + 1][0], L[s + 1][1], zb)];
      out.push({ svg: ctx.poly(qd, ctx.shade(DECK, 0, 0, 1), DECK_EDGE, 0.4),
                 depth: depthOf(qd) + 0.2 });
      var dx2 = W[s + 1][0] - W[s][0], dy2 = W[s + 1][1] - W[s][1];
      var m2 = Math.sqrt(dx2 * dx2 + dy2 * dy2) || 1;
      var nx2 = -dy2 / m2, ny2 = dx2 / m2;
      var side = [[1, 0.4], [-1, 0.15]];
      for (var t = 0; t < 2; t++) {
        var sg = side[t][0];
        if (!ctx.faceVisible(sg * nx2, sg * ny2)) continue;
        var e = sg > 0 ? L : R;
        var qs = [P(e[s][0], e[s][1], za), P(e[s + 1][0], e[s + 1][1], zb),
                  P(e[s + 1][0], e[s + 1][1], zb + TH), P(e[s][0], e[s][1], za + TH)];
        out.push({ svg: ctx.poly(qs, ctx.shade(DECK, sg * nx2, sg * ny2, 0), DECK_EDGE, 0.4),
                   depth: depthOf(qs) + 0.3 });
      }
      var mx = (W[s][0] + W[s + 1][0]) / 2, my = (W[s][1] + W[s + 1][1]) / 2;
      out = out.concat(octStage(ctx, mx, my, 9, 9, 0, (za + zb) / 2, DECK, DECK_EDGE));
    }

    /* the walking surface, coloured by its own measured grade, so the four
       pitches this walk actually has are things you can see rather than
       figures in a caption. Threshold 8 percent.

       MIN_RUN is the noise floor carried over from the Pier 66 walk and it is
       the same instrument: 3DEP's vertical error is of the order of a foot, so
       a grade taken over a few metres is mostly error. At 15 m that foot is
       worth 2 percent, comfortably inside the threshold. Segments shorter than
       it are drawn and simply make no claim about their steepness. */
    var MIN_RUN = 15;
    for (var j = 0; j < N - 1; j++) {
      var run = W[j + 1][3] - W[j][3];
      var rise = (W[j + 1][2] - W[j][2]) * FT_M;
      var g = run >= MIN_RUN ? Math.abs(rise / run) : 0;
      if (SKIP[j]) continue;
      var steep = g >= 0.08, onDeck = !!DECK_SEGS[j];
      var za2 = walkZ(W[j][2]), zb2 = walkZ(W[j + 1][2]);
      var q2 = [P(L[j][0], L[j][1], za2), P(R[j][0], R[j][1], za2),
                P(R[j + 1][0], R[j + 1][1], zb2), P(L[j + 1][0], L[j + 1][1], zb2)];
      out.push({ svg: ctx.poly(q2, steep ? STEEP : (onDeck ? DECK : PATH),
                               steep ? STEEP_EDGE : (onDeck ? DECK_EDGE : PATH_EDGE), 0.4),
                 depth: depthOf(q2) + 0.5 + j * 1e-3 });
    }

    /* Six posts and not sixteen. At 5.6 km a post per stop is a picket fence
       and the line disappears behind it, so the posts mark the shape of the
       walk: where you start, the crest of Beacon Hill, the turn at Faneuil
       Hall, the top of Copp's Hill before it drops, the ship, and the
       Monument. Slender, so they are drawn from every side rather than culled,
       and given depths above everything else because nothing in this model can
       stand in front of them. */
    var MARKS = [[0, 46], [15, 52], [53, 42], [81, 44], [108, 42], [126, 62]];
    for (var k = 0; k < MARKS.length; k++) {
      var idx = MARKS[k][0], h = MARKS[k][1];
      var px = W[idx][0], py = W[idx][1], pz = walkZ(W[idx][2]);
      var col = octStage(ctx, px, py, 4.5, 3.2, pz, pz + h, POST, "#4f4b45");
      for (var q3 = 0; q3 < col.length; q3++) col[q3].depth = 1e6 + k * 100 + q3;
      out = out.concat(col);
      var head = octStage(ctx, px, py, 11, 11, pz + h, pz + h + 6, STEEP, STEEP_EDGE);
      for (var q4 = 0; q4 < head.length; q4++) head[q4].depth = 1e6 + k * 100 + 50 + q4;
      out = out.concat(head);
      var top = [];
      for (var e8 = 0; e8 < 8; e8++) {
        var ang = (e8 / 8) * Math.PI * 2;
        top.push(P(px + 11 * Math.cos(ang), py + 11 * Math.sin(ang), pz + h + 6));
      }
      out.push({ svg: ctx.poly(top, STEEP, STEEP_EDGE, 0.4), depth: 1e6 + k * 100 + 90 });
    }
    return out;
  }

  var SCENES = { "bunker-hill": bunkerHill, "old-north": oldNorth,
                 "faneuil-hall": faneuilHall, "state-house": stateHouse,
                 "old-state-house": oldStateHouse, "old-south": oldSouth,
                 "constitution": constitution, "paul-revere": paulRevere,
                 "park-street": parkStreet, "walk": freedomWalk };

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
      sceneFor(key)({ project: mk(1, 0, 0), poly: measure, shade: shade, faceVisible: faceVisible });
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
      var items = sceneFor(key)({ project: mk(SC, OX, OY), poly: poly, shade: shade, faceVisible: faceVisible });
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

  /* ONE FILE PER BUILDING, the dc-form pattern brought over to the trail.
     A rebuilt stop registers window.TRAIL_FORMS[k] from its own
     trail-form-<k>.js and takes over from the SCENES entry above, so the
     landmark routine can raise a stop to the model standard without editing
     this 2,600 line file. Resolved at DRAW time, never at load time,
     because the form files load after this one. */
  function sceneFor(k) {
    var EXT = (typeof window !== "undefined" && window.TRAIL_FORMS) || {};
    return EXT[k] || SCENES[k];
  }

  window.TRAIL3D = { scenes: SCENES, scene: sceneFor, mount: mount,
    helpers: { depthOf: depthOf, taperedShaft: taperedShaft, pyramidion: pyramidion,
               slab: slab, ground: ground, box: box, gableRoof: gableRoof,
               gableRoofCut: gableRoofCut, gableHipRoof: gableHipRoof,
               archOpening: archOpening, roundWindow: roundWindow, panel: panel,
               octStage: octStage, octSpire: octSpire, octDetail: octDetail,
               domeCap: domeCap, columnAt: columnAt, balustrade: balustrade,
               wallRun: wallRun, apseRun: apseRun } };
})();
