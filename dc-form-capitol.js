/* dc-form-capitol.js: the United States Capitol as a massing model.
 *
 * Every dimension is a research fact in feet (AOC / GovInfo, or the reviewers'
 * measured figures), or a stated derivation from one; FT converts to metres
 * and heights are TRUE (VE = 1). The crest of the Statue of Freedom lands at
 * 288 ft above the east plaza, and the plaza itself sits 20 ft (the Olmsted
 * terrace's wall height) above the Mall lawn.
 *
 * The vertical stack above the plaza, in feet, and where each number came from:
 *   75     main cornice, one line across centre, connectors and wings
 *                                  reviewers: 75-90 ft; 75 is the value that
 *                                  closes on the AOC 210 ft balcony (below)
 *   25     Bulfinch base, square   reviewers: about 150 ft across, 25 ft tall
 *   27     peristyle columns       Walter 1855 design
 *   5.4    peristyle entablature   one fifth of the column, the classical rule
 *   18.1   attic drum + balustrade RESIDUAL: 210 minus everything else
 *   59.5   dome shell, truncated   an ellipse of 96 ft span (reviewers) whose
 *                                  rise, 62 ft, is 0.646 x span (reviewers 0.6-0.65)
 *   = 210  the tholos balcony      AOC: 210 ft above the East Front Plaza
 *   40     tholos as built         Walter's 52 ft less the 12 ft lost when
 *                                  300 ft became 288 ft (AOC)
 *   38     pedestal + statue       AOC (18.5 pedestal + 19.5 figure)
 *   = 288
 *
 * Plan: the old sandstone block (351 ft 7.5 in x 282 ft 10.5 in) with the
 * 32.5 ft marble East Front extension; a 34.6 ft west portico that makes the
 * building 350 ft deep (reviewers); the two marble wings (142 ft 8 in x 238 ft
 * 10 in exclusive of porticoes) 44 ft off the old block, their east faces
 * flush with the old block's; the 44 ft connector blocks 100 ft deep
 * (reviewers) with east faces 50 ft behind the wings' (reviewers); the
 * overall 751 ft 4 in fixes each wing's end projection at 13.2 ft.
 *
 * Orders: the peristyle's 27 ft is the only published column height. The
 * portico columns fill the space between the 20 ft basement (the terrace's
 * own wall height, reused as the basement story) and the 75 ft cornice, with
 * the entablature one fifth of the column: 45.8 ft columns, a derivation.
 * East centre portico 8 x 3 = 24 columns projecting 40 ft up 30 steps; wing
 * east porticoes 22 columns (10 + 10 + a returning pair); west portico 8
 * across; peristyle 36 on a 124 ft ring, 12 ft clear of a 100 ft drum wall;
 * tholos 12 on a 25 ft ring (reviewers).
 *
 * Steps: 2 ft rise on a 4 ft tread on the west (so they read as steps at map
 * scale); the east flights are 30 steps over the 20 ft basement (reviewers'
 * count, 8 in risers on 12 in treads). No flight's real dimensions are
 * published.
 *
 * Paint depth: the item list is shared with the rest of the Mall, so every
 * depth is a REAL projected depth (metres). Faces carry the depth of their
 * FARTHEST point, always; the 'nearest corner' mode of the previous version
 * let a low parapet paint over a tall column standing beside it. The dome is
 * drawn as gores sorted by centroid, the tholos and statue with explicit
 * depths just nearer than the dome's front, and shadows just after the
 * plane they fall on.
 */
(function () {
  var H = window.DC3D.helpers;
  window.DC_FORMS = window.DC_FORMS || {};
  window.DC_FORMS['capitol'] = function (ctx, p, s, VE) {
    var P = ctx.project, items = [];
    var FT = 0.3048 * VE;
    function pt(x, y, z) { return P(p.x + x * s, p.y + y * s, z); }
    function far(q) { return H.depthOf(q); }
    function foot(cx, cy, wx, wy, z) {
      return [pt(cx-wx/2,cy-wy/2,z), pt(cx+wx/2,cy-wy/2,z), pt(cx+wx/2,cy+wy/2,z), pt(cx-wx/2,cy+wy/2,z)];
    }

    /* the camera, recovered from the projection so a tilted face (a dome gore,
       a pediment roof) can be culled by its full 3D normal, not only its plan
       normal. ry = x sin(yaw) + y cos(yaw); screen y falls with z by cos(pitch). */
    var o0 = P(p.x, p.y, 0), ox = P(p.x + 1, p.y, 0), oy = P(p.x, p.y + 1, 0), oz = P(p.x, p.y, 1);
    var sYaw = ox[2] - o0[2], cYaw = oy[2] - o0[2];
    var dzY = oz[1] - o0[1];
    var dhY = Math.abs(cYaw) > Math.abs(sYaw) ? (oy[1] - o0[1]) / cYaw : (ox[1] - o0[1]) / sYaw;
    var tanP = dzY === 0 ? 0.3 : dhY / (-dzY);
    var cP = 1 / Math.sqrt(1 + tanP * tanP), sP = tanP * cP;
    function vis3(nx, ny, nz) { return (nx * sYaw + ny * cYaw) * cP + nz * sP > 0.001; }
    var cRy = o0[2];

    /* light from the north-east, high (the renderer's own vector). Sunlit
       faces get the warmer hex, shaded faces the cooler; ctx.shade then
       darkens by the true normal. Shadows fall the opposite way. */
    var LD = [0.55, 0.35, 0.72];
    var SDX = -LD[0] / LD[2], SDY = -LD[1] / LD[2];
    function tone(m, nx, ny, nz) {
      var d = nx * LD[0] + ny * LD[1] + nz * LD[2];
      return ctx.shade(d > 0.05 ? m.lit : m.shade, nx, ny, nz);
    }
    var SAND   = { lit: "#f4eddd", shade: "#e4dfd2", edge: "#b3aa98" }; /* Aquia sandstone, painted white, a warmer white */
    var RUSTS  = { lit: "#ece4d2", shade: "#dcd6c8", edge: "#a9a08e" }; /* its rusticated basement story */
    var MARBLE = { lit: "#f9f7f0", shade: "#e9e8e3", edge: "#b5b1a6" }; /* Lee marble, wings and east front */
    var RUSTM  = { lit: "#efede5", shade: "#dfded8", edge: "#aba79c" }; /* the wings' rusticated basement */
    var COLM   = { lit: "#fbf9f3", shade: "#ecebe6", edge: "#aeaaa0" }; /* Cockeysville marble columns */
    var DOME   = { lit: "#faf9f5", shade: "#ebebe8", edge: "#b4b2ab" }; /* cast iron, 'Dome White' */
    var TERR   = { lit: "#e8e4d9", shade: "#d6d3ca", edge: "#a39d90" }; /* Olmsted terrace, marble and granite */
    var LAWN   = { lit: "#c9d3bd", shade: "#b9c4ae", edge: "#a7b29c" }; /* the hill east of the plaza */
    var BRONZE = { lit: "#5f7d5e", shade: "#43583f", edge: "#2d3d2c" }; /* Statue of Freedom, bronze green */
    var IRON   = { lit: "#425443", shade: "#313f32", edge: "#222c22" }; /* pedestal, cast iron painted green */
    var GLASS  = "#4d525a";                                            /* window recesses */
    var ARCH   = "#5e5a50";                                            /* the terrace arcade's openings */

    /* a box; o: {bias (cm), skip:[faces], wxT, wyT, noTop, depth (explicit)}
       faces: 0 south, 1 east, 2 north, 3 west. Depth = farthest point. */
    function box(cx, cy, wx, wy, z0, h, m, o) {
      o = o || {};
      var bx = wx / 2, by = wy / 2;
      var tx = (o.wxT === undefined ? wx : o.wxT) / 2, ty = (o.wyT === undefined ? wy : o.wyT) / 2;
      var lo = [[cx-bx,cy-by],[cx+bx,cy-by],[cx+bx,cy+by],[cx-bx,cy+by]];
      var hi = [[cx-tx,cy-ty],[cx+tx,cy-ty],[cx+tx,cy+ty],[cx-tx,cy+ty]];
      var nrm = [[0,-1],[1,0],[0,1],[-1,0]];
      var bias = (o.bias || 0) * 0.01, skip = o.skip || [];
      for (var i = 0; i < 4; i++) {
        if (skip.indexOf(i) >= 0) continue;
        if (!ctx.faceVisible(nrm[i][0], nrm[i][1])) continue;
        var j = (i + 1) % 4;
        var q = [pt(lo[i][0],lo[i][1],z0), pt(lo[j][0],lo[j][1],z0),
                 pt(hi[j][0],hi[j][1],z0+h), pt(hi[i][0],hi[i][1],z0+h)];
        items.push({ svg: ctx.poly(q, tone(m, nrm[i][0], nrm[i][1], 0), m.edge, 0.4),
                     depth: (o.depth === undefined ? far(q) : o.depth) + bias + i * 0.0001 });
      }
      if (!o.noTop) {
        var top = [pt(cx-tx,cy-ty,z0+h), pt(cx+tx,cy-ty,z0+h), pt(cx+tx,cy+ty,z0+h), pt(cx-tx,cy+ty,z0+h)];
        items.push({ svg: ctx.poly(top, tone(m, 0, 0, 1), m.edge, 0.4),
                     depth: (o.depth === undefined ? far(top) : o.depth) + bias + 0.0005 });
      }
    }

    /* an n-sided ring, r0 at the foot and r1 at the top; tilted faces are
       culled by their 3D normal so a cone's far top stays visible from above */
    function ring(cx, cy, r0, r1, z0, h, n, m, o) {
      o = o || {};
      var bias = (o.bias || 0) * 0.01, rot = o.rot || 0;
      var sw = o.sw === undefined ? 0.35 : o.sw;
      var lo = [], hi = [];
      for (var i = 0; i < n; i++) {
        var a = rot + (i / n) * Math.PI * 2;
        lo.push([cx + r0 * Math.cos(a), cy + r0 * Math.sin(a)]);
        hi.push([cx + r1 * Math.cos(a), cy + r1 * Math.sin(a)]);
      }
      var L = Math.sqrt((r0 - r1) * (r0 - r1) + h * h) || 1;
      var nzz = (r0 - r1) / L, nh = h / L;
      for (var k = 0; k < n; k++) {
        var a0 = lo[k], a1 = lo[(k + 1) % n], b0 = hi[k], b1 = hi[(k + 1) % n];
        var mx = (a0[0] + a1[0]) / 2 - cx, my = (a0[1] + a1[1]) / 2 - cy;
        var l = Math.sqrt(mx * mx + my * my) || 1, nx = mx / l * nh, ny = my / l * nh;
        if (!vis3(nx, ny, nzz)) continue;
        var q = [pt(a0[0],a0[1],z0), pt(a1[0],a1[1],z0), pt(b1[0],b1[1],z0+h), pt(b0[0],b0[1],z0+h)];
        items.push({ svg: ctx.poly(q, tone(m, nx, ny, nzz), o.selfEdge ? tone(m, nx, ny, nzz) : m.edge, sw),
                     depth: (o.depth === undefined ? far(q) : o.depth) + bias + k * 0.00001 });
      }
      if (!o.noTop && r1 > 0.05) {
        var top = hi.map(function (h2) { return pt(h2[0], h2[1], z0 + h); });
        items.push({ svg: ctx.poly(top, tone(m, 0, 0, 1), m.edge, sw),
                     depth: (o.depth === undefined ? far(top) : o.depth) + bias + 0.0005 });
      }
    }

    /* a Corinthian column: octagonal shaft, diameter one tenth of its
       height (the classical rule), a square capital block on top */
    function column(cx, cy, z0, h, m, o) {
      var r = h / 20;
      ring(cx, cy, r, r * 0.88, z0, h * 0.88, 8, m, { rot: Math.PI / 8, noTop: true, depth: o && o.depth, bias: o && o.bias });
      box(cx, cy, r * 2.4, r * 2.4, z0 + h * 0.88, h * 0.12, m, { wxT: r * 3, wyT: r * 3, depth: o && o.depth, bias: o && o.bias });
    }
    function colRow(x0, y0, x1, y1, count, z0, h, m) {
      for (var i = 0; i < count; i++) {
        var t = count === 1 ? 0.5 : i / (count - 1);
        column(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, z0, h, m);
      }
    }

    /* a triangular pediment: gables on the faces along axis ax ('x' means
       the gable faces west and east; 'y' north and south), two roof planes */
    function pediment(cx, cy, wx, wy, z0, h, m, ax) {
      var x0 = cx - wx / 2, x1 = cx + wx / 2, y0 = cy - wy / 2, y1 = cy + wy / 2;
      var ref = far(foot(cx, cy, wx, wy, z0));
      if (ax === 'x') {
        if (ctx.faceVisible(-1, 0)) items.push({ svg: ctx.poly([pt(x0,y0,z0), pt(x0,y1,z0), pt(x0,cy,z0+h)], tone(m,-1,0,0), m.edge, 0.4), depth: ref + 0.002 });
        if (ctx.faceVisible(1, 0))  items.push({ svg: ctx.poly([pt(x1,y0,z0), pt(x1,y1,z0), pt(x1,cy,z0+h)], tone(m,1,0,0), m.edge, 0.4), depth: ref + 0.002 });
        var L = Math.sqrt(wy * wy / 4 + h * h), nz = (wy / 2) / L, ny = h / L;
        if (vis3(0, ny, nz))  items.push({ svg: ctx.poly([pt(x0,y1,z0), pt(x1,y1,z0), pt(x1,cy,z0+h), pt(x0,cy,z0+h)], tone(m,0,ny,nz), m.edge, 0.4), depth: ref + 0.003 });
        if (vis3(0, -ny, nz)) items.push({ svg: ctx.poly([pt(x0,y0,z0), pt(x1,y0,z0), pt(x1,cy,z0+h), pt(x0,cy,z0+h)], tone(m,0,-ny,nz), m.edge, 0.4), depth: ref + 0.003 });
      } else {
        if (ctx.faceVisible(0, -1)) items.push({ svg: ctx.poly([pt(x0,y0,z0), pt(x1,y0,z0), pt(cx,y0,z0+h)], tone(m,0,-1,0), m.edge, 0.4), depth: ref + 0.002 });
        if (ctx.faceVisible(0, 1))  items.push({ svg: ctx.poly([pt(x0,y1,z0), pt(x1,y1,z0), pt(cx,y1,z0+h)], tone(m,0,1,0), m.edge, 0.4), depth: ref + 0.002 });
        var L2 = Math.sqrt(wx * wx / 4 + h * h), nz2 = (wx / 2) / L2, nx2 = h / L2;
        if (vis3(nx2, 0, nz2))  items.push({ svg: ctx.poly([pt(x1,y0,z0), pt(x1,y1,z0), pt(cx,y1,z0+h), pt(cx,y0,z0+h)], tone(m,nx2,0,nz2), m.edge, 0.4), depth: ref + 0.003 });
        if (vis3(-nx2, 0, nz2)) items.push({ svg: ctx.poly([pt(x0,y0,z0), pt(x0,y1,z0), pt(cx,y1,z0+h), pt(cx,y0,z0+h)], tone(m,-nx2,0,nz2), m.edge, 0.4), depth: ref + 0.003 });
      }
    }

    /* a flight of n steps descending from a platform edge, direction d along
       axis ax, as nested slabs: step k's tread sits rise*(k+1)/n below the
       platform and reaches (k+1) treads out. Sorted by their far points the
       longer, lower slabs paint over the taller ones behind them. */
    function flight(edge, d, c, width, zBase, zTop, n, tread, ax, m) {
      var rise = zTop - zBase;
      for (var k = 0; k < n; k++) {
        var len = (k + 1) * tread, mid = edge + d * len / 2, zt = zTop - rise * (k + 1) / n;
        if (zt - zBase <= 0.01) continue;
        if (ax === 'x') box(mid, c, len, width, zBase, zt - zBase, m);
        else            box(c, mid, width, len, zBase, zt - zBase, m);
      }
      return n * tread;
    }

    /* flat decoration on one vertical face: rectangles (windows, arcade
       openings) and pilaster strips, painted at the face's own depth so a
       nearer mass that abuts the wall still covers them */
    function faceRects(x0, y0, x1, y1, nx, ny, rows, count, w, fill, op, bias) {
      var q0 = [pt(x0,y0,0), pt(x1,y1,0)], dep = far(q0) + 0.002 + (bias || 0);
      var tx = -ny, ty2 = nx, ox2 = nx * 0.06, oy2 = ny * 0.06;
      for (var i = 0; i < count; i++) {
        var t = (i + 0.5) / count, cx = x0 + (x1 - x0) * t + ox2, cy = y0 + (y1 - y0) * t + oy2;
        for (var r = 0; r < rows.length; r++) {
          var z0 = rows[r][0], z1 = rows[r][1], hw = w / 2;
          var q = [pt(cx - tx*hw, cy - ty2*hw, z0), pt(cx + tx*hw, cy + ty2*hw, z0), pt(cx + tx*hw, cy + ty2*hw, z1), pt(cx - tx*hw, cy - ty2*hw, z1)];
          items.push({ svg: ctx.poly(q, ctx.shade(fill, nx, ny, 0), null, 0, op ? ' opacity="' + op + '"' : ''), depth: dep + r * 0.0001 });
        }
      }
    }
    function pilasters(x0, y0, x1, y1, nx, ny, z0, h, count, w, m) {
      var q0 = [pt(x0,y0,0), pt(x1,y1,0)], dep = far(q0) + 0.0025;
      var tx = -ny, ty2 = nx, PR = 0.35, len = Math.sqrt((x1-x0)*(x1-x0) + (y1-y0)*(y1-y0));
      var inset = (w / 2 + 0.4) / len;
      for (var i = 0; i < count; i++) {
        var t = count === 1 ? 0.5 : inset + (1 - 2 * inset) * i / (count - 1);
        var cx = x0 + (x1 - x0) * t, cy = y0 + (y1 - y0) * t, hw = w / 2;
        var fx = cx + nx * PR, fy = cy + ny * PR;
        var q = [pt(fx - tx*hw, fy - ty2*hw, z0), pt(fx + tx*hw, fy + ty2*hw, z0), pt(fx + tx*hw, fy + ty2*hw, z0+h), pt(fx - tx*hw, fy - ty2*hw, z0+h)];
        items.push({ svg: ctx.poly(q, tone(m, nx, ny, 0), m.edge, 0.3), depth: dep + 0.0001 });
        /* the one side of the strip the camera can see */
        var sgn = ctx.faceVisible(tx, ty2) ? 1 : (ctx.faceVisible(-tx, -ty2) ? -1 : 0);
        if (sgn) {
          var ex = cx + tx * hw * sgn, ey = cy + ty2 * hw * sgn;
          var qs = [pt(ex, ey, z0), pt(ex + nx*PR, ey + ny*PR, z0), pt(ex + nx*PR, ey + ny*PR, z0+h), pt(ex, ey, z0+h)];
          items.push({ svg: ctx.poly(qs, tone(m, tx*sgn, ty2*sgn, 0), m.edge, 0.3), depth: dep });
        }
      }
    }
    /* the whole elevation of a block: rusticated basement joints, three rows
       of windows, pilasters between bays on the principal stories */
    function facade(cx, cy, wx, wy, m, o) {
      o = o || {};
      var lo = [[cx-wx/2,cy-wy/2],[cx+wx/2,cy-wy/2],[cx+wx/2,cy+wy/2],[cx-wx/2,cy+wy/2]];
      var nrm = [[0,-1],[1,0],[0,1],[-1,0]];
      for (var i = 0; i < 4; i++) {
        if (!ctx.faceVisible(nrm[i][0], nrm[i][1])) continue;
        var j = (i + 1) % 4, a = lo[i], b = lo[j];
        var len = Math.sqrt((b[0]-a[0])*(b[0]-a[0]) + (b[1]-a[1])*(b[1]-a[1]));
        var bays = Math.max(1, Math.round(len / (20 * FT)));
        faceRects(a[0], a[1], b[0], b[1], nrm[i][0], nrm[i][1], o.rows, bays, o.w, GLASS);
        if (o.joints) faceRects(a[0], a[1], b[0], b[1], nrm[i][0], nrm[i][1], o.joints, 1, len - 0.2, "#6a6458", 0.22, 0.0004);
        if (o.pil && (!o.pilFaces || o.pilFaces.indexOf(i) >= 0)) pilasters(a[0], a[1], b[0], b[1], nrm[i][0], nrm[i][1], o.pil[0], o.pil[1], bays + 1, 4 * FT, m);
      }
    }

    /* cast shadows: the convex hull of a footprint and its copy slid along
       the light to where the mass's top would land, painted just after the
       plane it falls on */
    function hull(P2) {
      var pts = P2.slice().sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
      if (pts.length < 3) return pts;
      function cross(o, a, b) { return (a[0]-o[0])*(b[1]-o[1]) - (a[1]-o[1])*(b[0]-o[0]); }
      var lower = [], upper = [];
      pts.forEach(function (q) { while (lower.length >= 2 && cross(lower[lower.length-2], lower[lower.length-1], q) <= 0) lower.pop(); lower.push(q); });
      for (var i = pts.length - 1; i >= 0; i--) { var q = pts[i]; while (upper.length >= 2 && cross(upper[upper.length-2], upper[upper.length-1], q) <= 0) upper.pop(); upper.push(q); }
      lower.pop(); upper.pop();
      return lower.concat(upper);
    }
    function castShadow(fpA, fpB, dx, dy, zPlane, depth, op) {
      var all = fpA.concat(fpB.map(function (q) { return [q[0] + dx, q[1] + dy]; }));
      var hp = hull(all).map(function (q) { return pt(q[0], q[1], zPlane); });
      items.push({ svg: ctx.poly(hp, "#141410", null, 0, ' opacity="' + op + '"'), depth: depth });
    }
    function rect(cx, cy, wx, wy) { return [[cx-wx/2,cy-wy/2],[cx+wx/2,cy-wy/2],[cx+wx/2,cy+wy/2],[cx-wx/2,cy+wy/2]]; }
    function circ(r, n) { var o = []; for (var i = 0; i < n; i++) { var a = i / n * Math.PI * 2; o.push([r * Math.cos(a), r * Math.sin(a)]); } return o; }

    /* ---------------- the plan, in metres, dome centre at the origin ---------------- */
    var T   = 20 * FT;                 /* Olmsted terrace wall height: the plaza above the Mall */
    var HC  = 75 * FT;                 /* the one main cornice (reviewers 75-90; closes on AOC 210) */
    var POD = 20 * FT;                 /* basement story = the terrace's own 20 ft, reused */
    var COL = 27 * FT, ENT = COL / 5;  /* the peristyle order, Walter */
    var COLP = (HC - POD) / 1.2;       /* portico columns fill basement to cornice */
    var ENTP = COLP / 5;               /* their entablature, one fifth */
    var CORN = 3.2 * FT;               /* the cornice slab: the projecting top of the entablature band (not published) */
    var CD = COL / 10, CDP = COLP / 10;
    var CB  = 351.625 * FT;            /* old central building, north to south */
    var CBW = 282.875 * FT;            /* old central building, east to west */
    var EXT = 32.5 * FT;               /* 1958-62 east front extension */
    var WL  = 142.67 * FT;             /* each wing, north to south, exclusive of porticoes */
    var WD  = 238.83 * FT;             /* each wing, east to west, exclusive of porticoes */
    var GAP = 44 * FT;                 /* the connector between wing and old building */
    var LEN = 751.33 * FT;             /* overall length north to south */
    var END = (LEN - CB - 2 * GAP - 2 * WL) / 2;  /* each wing's end projection: 13.2 ft */
    var DEPTH = 350 * FT;              /* overall depth east to west (reviewers) */
    var WPD = DEPTH - CBW - EXT;       /* the west portico's projection: 34.6 ft */
    var KD  = 100 * FT;                /* connector depth east to west (reviewers) */
    var KSET = 50 * FT;                /* the wings' east faces stand this far east of the connectors' (reviewers) */
    var EPD = 40 * FT;                 /* east porticoes project 40 ft (reviewers) */
    var STEPS_E = 30;                  /* the east flights, 30 steps (reviewers) */
    var TRD_E = 1 * FT, TRD_W = 4 * FT, RISE_W = 2 * FT;

    var xW = -CBW / 2, xOld = CBW / 2, xE = xOld + EXT, xWP = xW - WPD;
    var wingY = CB / 2 + GAP + WL / 2, wingCx = xOld - WD / 2, wingXW = xOld - WD;
    var kxE = xOld - KSET, kxW = kxE - KD, kx = (kxE + kxW) / 2, kyA = CB / 2 + GAP / 2;
    var PW  = 0.4 * CB;                /* centre portico width: 40 % of the block (not published) */
    var BAY = PW / 7;                  /* 8 columns across */
    var WPW = WL - 8 * FT;             /* wing portico width: the wing less a margin (not published) */
    var GSW = 100 * FT;                /* the West Front grand stair (reviewers) */

    /* ---- the terrace: plaza on west, north and south walls; open hill to the east ---- */
    var TW = 55 * FT, TN = 33 * FT;    /* terrace reach past the west portico and past each wing end (not published) */
    var eRun = STEPS_E * TRD_E;
    var tx0 = xWP - TW, tx1 = xE + EPD + eRun + 40 * FT, ty = wingY + WL / 2 + END + TN;
    var tcx = (tx0 + tx1) / 2, twx = tx1 - tx0, twy = 2 * ty;
    var RAMP = 150 * FT;               /* the hill falling away east of the plaza (not published) */
    var plazaFp = rect(tcx, 0, twx, twy);
    castShadow(plazaFp, plazaFp, SDX * T, SDY * T, 0.25, -1e9 + 2, 0.22);
    box(tcx, 0, twx, twy, 0, T, TERR);
    var plazaDep = far(foot(tcx, 0, twx, twy, T));
    /* the east hill: a grass wedge from plaza level down to the lawn */
    var wq = [pt(tx1, -ty, T), pt(tx1 + RAMP, -ty, 0), pt(tx1 + RAMP, ty, 0), pt(tx1, ty, T)];
    var wl = Math.sqrt(RAMP * RAMP + T * T);
    items.push({ svg: ctx.poly(wq, tone(LAWN, T / wl, 0, RAMP / wl), LAWN.edge, 0.3), depth: far(wq) - 0.3 });
    if (ctx.faceVisible(0, 1)) { var wn = [pt(tx1, ty, 0), pt(tx1 + RAMP, ty, 0), pt(tx1, ty, T)]; items.push({ svg: ctx.poly(wn, tone(LAWN, 0, 1, 0), LAWN.edge, 0.3), depth: far(wn) }); }
    if (ctx.faceVisible(0, -1)) { var ws = [pt(tx1, -ty, 0), pt(tx1 + RAMP, -ty, 0), pt(tx1, -ty, T)]; items.push({ svg: ctx.poly(ws, tone(LAWN, 0, -1, 0), LAWN.edge, 0.3), depth: far(ws) }); }
    /* the arcaded retaining walls: openings 8 ft wide every 20 ft (not published) */
    var arcRows = [[4 * FT, 15 * FT]];
    if (ctx.faceVisible(-1, 0)) faceRects(tx0, ty, tx0, -ty, -1, 0, arcRows, Math.round(twy / (20 * FT)), 8 * FT, ARCH);
    if (ctx.faceVisible(0, 1))  faceRects(tx1, ty, tx0, ty, 0, 1, arcRows, Math.round(twx / (20 * FT)), 8 * FT, ARCH);
    if (ctx.faceVisible(0, -1)) faceRects(tx0, -ty, tx1, -ty, 0, -1, arcRows, Math.round(twx / (20 * FT)), 8 * FT, ARCH);
    /* the balustrade coping along the three terrace edges, thin */
    box(tx0 + 0.5, 0, 1.0, twy, T, 1.0, TERR);
    box(tcx, ty - 0.5, twx, 1.0, T, 1.0, TERR);
    box(tcx, -ty + 0.5, twx, 1.0, T, 1.0, TERR);
    /* the grand stair: two flights of five with a landing, on the portico axis */
    var gA = flight(tx0, -1, 0, GSW, 0, T, 5, TRD_W, 'x', TERR);
    var LAND = 12 * FT, gTop2 = T - 5 * RISE_W;
    box(tx0 - gA - LAND / 2, 0, LAND, GSW, 0, gTop2, TERR);
    flight(tx0 - gA - LAND, -1, 0, GSW, 0, gTop2, 5, TRD_W, 'x', TERR);

    /* ---- shadows of the masses on the plaza, then the masses ---- */
    var shd = 0;
    function plazaShadow(fp, h) { castShadow(fp, fp, SDX * h, SDY * h, T + 0.03, plazaDep + 0.01 + (shd++) * 0.0001, 0.17); }
    var PEDH = (PW + 2.4) / 9, WPEDH = (WPW + 2.4) / 9;
    plazaShadow(rect(EXT / 2, 0, CBW + EXT, CB), HC);
    plazaShadow(rect(xW - WPD / 2, 0, WPD, PW + 2), HC + PEDH);
    plazaShadow(rect(xE + EPD / 2, 0, EPD, PW + 2), HC + PEDH);
    [1, -1].forEach(function (sg) {
      var cy = sg * wingY;
      plazaShadow(rect(wingCx, cy, WD, WL), HC);
      plazaShadow(rect(wingCx, cy + sg * (WL / 2 + END / 2), 0.6 * WD, END), HC);
      plazaShadow(rect(xOld + EPD / 2, cy, EPD, WPW + 2), HC + WPEDH);
      plazaShadow(rect(kx, sg * kyA, KD, GAP), HC);
    });
    /* the dome's shadow on the plaza: the shell's base ring and its top, each slid by its own height */
    castShadow(circ(48 * FT, 24).map(function (q) { return [q[0] + SDX * (HC + 75.5 * FT), q[1] + SDY * (HC + 75.5 * FT)]; }),
               circ(13.4 * FT, 12), SDX * (HC + 135 * FT), SDY * (HC + 135 * FT), T + 0.03, plazaDep + 0.011 + (shd++) * 0.0001, 0.14);

    /* ---- the old central building: sandstone, with the marble east front ---- */
    var winRows = [[POD + 6 * FT, POD + 24 * FT], [POD + 31 * FT, POD + 44 * FT]];
    var baseRows = [[6 * FT, 14 * FT]];
    var jointRows = [[5 * FT, 5.3 * FT], [10 * FT, 10.3 * FT], [15 * FT, 15.3 * FT]];
    var PILZ = [T + POD, HC - ENTP];   /* pilasters carry the entablature band */
    box(0, 0, CBW, CB, T, POD, RUSTS);
    box(0, 0, CBW, CB, T + POD, HC - CORN - POD, SAND, { bias: 0.1 });
    box(xOld + EXT / 2, 0, EXT, CB, T, POD, RUSTM);
    box(xOld + EXT / 2, 0, EXT, CB, T + POD, HC - CORN - POD, MARBLE, { bias: 0.1 });
    facade(0, 0, CBW, CB, SAND, { rows: [[T + baseRows[0][0], T + baseRows[0][1]], [T + winRows[0][0], T + winRows[0][1]], [T + winRows[1][0], T + winRows[1][1]]], w: 5 * FT,
                                   joints: jointRows.map(function (r) { return [T + r[0], T + r[1]]; }), pil: [T + POD, HC - ENTP - POD], pilFaces: [3] });
    box(EXT / 2, 0, CBW + EXT + 1.6, CB + 1.6, T + HC - CORN, CORN, SAND, { bias: 0.2 });

    /* west portico: eight Corinthian columns on the projecting rusticated
       basement, an entablature at the main cornice, the pediment above it */
    box(xW - WPD / 2, 0, WPD, PW + 2, T, POD, RUSTS);
    colRow(xWP + CDP * 0.9, -PW / 2, xWP + CDP * 0.9, PW / 2, 8, T + POD, COLP, SAND);
    box(xW - WPD / 2, 0, WPD + 1.2, PW + 2.4, T + POD + COLP, ENTP, SAND, { bias: 0.3 });
    pediment(xW - WPD / 2, 0, WPD + 1.2, PW + 2.4, T + HC, PEDH, SAND, 'x');
    /* the flight from the plaza up to the portico floor, centred, meeting the stylobate */
    flight(xWP, -1, 0, PW * 0.7, T, T + POD, Math.round(POD / RISE_W), TRD_W, 'x', RUSTS);

    /* east centre portico: 24 columns, 8 across and 3 deep, projecting 40 ft,
       up the long flight of 30 steps from the plaza */
    box(xE + EPD / 2, 0, EPD, PW + 2, T, POD, RUSTM);
    [0.85, 0.5, 0.15].forEach(function (f) { colRow(xE + EPD * f, -PW / 2, xE + EPD * f, PW / 2, 8, T + POD, COLP, COLM); });
    box(xE + EPD / 2, 0, EPD + 1.2, PW + 2.4, T + POD + COLP, ENTP, MARBLE, { bias: 0.3 });
    pediment(xE + EPD / 2, 0, EPD + 1.2, PW + 2.4, T + HC, PEDH, MARBLE, 'x');
    flight(xE + EPD, 1, 0, PW + 2, T, T + POD, STEPS_E, TRD_E, 'x', RUSTM);

    /* ---- the wings and connectors: Lee marble, one cornice with the centre ---- */
    [1, -1].forEach(function (sg) {
      var cy = sg * wingY;
      /* the wing itself: rusticated basement, two stories of windows, pilasters on west and end faces */
      box(wingCx, cy, WD, WL, T, POD, RUSTM);
      box(wingCx, cy, WD, WL, T + POD, HC - CORN - POD, MARBLE, { bias: 0.1 });
      facade(wingCx, cy, WD, WL, MARBLE, { rows: [[T + baseRows[0][0], T + baseRows[0][1]], [T + winRows[0][0], T + winRows[0][1]], [T + winRows[1][0], T + winRows[1][1]]], w: 5 * FT,
                                            joints: jointRows.map(function (r) { return [T + r[0], T + r[1]]; }), pil: [T + POD, HC - ENTP - POD], pilFaces: [3, sg > 0 ? 2 : 0] });
      box(wingCx, cy, WD + 1.6, WL + 1.6, T + HC - CORN, CORN, MARBLE, { bias: 0.2 });

      /* the end projection: a pilastered pavilion, no colonnade */
      var ey = cy + sg * (WL / 2 + END / 2), ew = 0.6 * WD;
      box(wingCx, ey, ew, END, T, POD, RUSTM, { bias: 0.05 });
      box(wingCx, ey, ew, END, T + POD, HC - CORN - POD, MARBLE, { bias: 0.15 });
      facade(wingCx, ey, ew, END, MARBLE, { rows: [[T + baseRows[0][0], T + baseRows[0][1]], [T + winRows[0][0], T + winRows[0][1]], [T + winRows[1][0], T + winRows[1][1]]], w: 5 * FT,
                                             pil: [T + POD, HC - ENTP - POD], pilFaces: [sg > 0 ? 2 : 0] });
      box(wingCx, ey + sg * 0.6, ew + 1.6, END + 1.2, T + HC - CORN, CORN, MARBLE, { bias: 0.25 });

      /* east portico: 22 columns (10 across, 10 behind, a returning pair at the
         wall), the entablature at the cornice, a pediment, its own 30 steps */
      box(xOld + EPD / 2, cy, EPD, WPW + 2, T, POD, RUSTM);
      colRow(xOld + EPD * 0.85, cy - WPW / 2, xOld + EPD * 0.85, cy + WPW / 2, 10, T + POD, COLP, COLM);
      colRow(xOld + EPD * 0.5, cy - WPW / 2, xOld + EPD * 0.5, cy + WPW / 2, 10, T + POD, COLP, COLM);
      column(xOld + EPD * 0.15, cy - WPW / 2, T + POD, COLP, COLM);
      column(xOld + EPD * 0.15, cy + WPW / 2, T + POD, COLP, COLM);
      box(xOld + EPD / 2, cy, EPD + 1.2, WPW + 2.4, T + POD + COLP, ENTP, MARBLE, { bias: 0.3 });
      pediment(xOld + EPD / 2, cy, EPD + 1.2, WPW + 2.4, T + HC, WPEDH, MARBLE, 'x');
      flight(xOld + EPD, 1, cy, WPW + 2, T, T + POD, STEPS_E, TRD_E, 'x', RUSTM);

      /* the connector: same cornice, its faces set back east and west */
      var ky = sg * kyA;
      box(kx, ky, KD, GAP, T, POD, RUSTM, { bias: 0.05 });
      box(kx, ky, KD, GAP, T + POD, HC - CORN - POD, MARBLE, { bias: 0.15 });
      facade(kx, ky, KD, GAP, MARBLE, { rows: [[T + baseRows[0][0], T + baseRows[0][1]], [T + winRows[0][0], T + winRows[0][1]], [T + winRows[1][0], T + winRows[1][1]]], w: 5 * FT,
                                         pil: [T + POD, HC - ENTP - POD], pilFaces: [3, 1] });
      box(kx, ky, KD + 1.2, GAP + 0.4, T + HC - CORN, CORN, MARBLE, { bias: 0.25 });
    });

    /* ---- the dome, cast iron painted 'Dome White' ---- */
    var RA = 100 * FT / 2;             /* drum wall and attic radius (reviewers) */
    var RP = 124 * FT / 2;             /* peristyle column circle (Walter; reviewers 120-125) */
    var RS = 96 * FT / 2;              /* the shell's span at its spring (reviewers) */
    var RTh = 25 * FT / 2;             /* tholos column ring (reviewers) */
    var RT = RTh + 0.9;                /* the shell closes on the tholos podium */
    var BASEH = 25 * FT, BASEW = 150 * FT;   /* Bulfinch base (reviewers) */
    var BAL = 3.5 * FT;                /* balustrades, 3.5 ft (not published) */
    var ATT = 210 * FT - HC - BASEH - COL - ENT - 59.5 * FT;   /* attic + balustrade: the residual, 18.1 ft */
    var SHELL = 59.5 * FT;             /* the shell's height to the tholos balcony */
    var aMax = Math.acos(RT / RS), DR = SHELL / Math.sin(aMax);   /* the ellipse's full rise: 62 ft */
    var THOL = (288 - 38 - 210) * FT;  /* tholos as built: 40 ft */

    var z = T + HC;
    var roofDep = far(foot(EXT / 2, 0, CBW + EXT + 1.6, CB + 1.6, T + HC));
    /* the dome's shadow on the centre roof: the shell's base ring and its top ring, slid by their heights */
    castShadow(circ(RS, 24).map(function (q) { return [q[0] + SDX * (BASEH + COL + ENT + ATT), q[1] + SDY * (BASEH + COL + ENT + ATT)]; }),
               circ(RT, 12), SDX * (BASEH + COL + ENT + ATT + SHELL), SDY * (BASEH + COL + ENT + ATT + SHELL), z + 0.03, roofDep + 0.01, 0.2);
    /* the square base, pilastered, with a cornice */
    box(0, 0, BASEW, BASEW, z, BASEH - 0.8, DOME);
    facade(0, 0, BASEW, BASEW, DOME, { rows: [], w: 1, pil: [z, BASEH - 1.6] });
    box(0, 0, BASEW + 1.2, BASEW + 1.2, z + BASEH - 0.8, 0.8, DOME, { bias: 0.2 });
    z += BASEH;
    /* the peristyle: 36 freestanding columns 12 ft clear of the windowed drum wall */
    ring(0, 0, RA, RA, z, COL, 36, DOME, { rot: Math.PI / 36 });
    for (var k = 0; k < 36; k++) {
      var a = (k / 36) * Math.PI * 2, wx2 = Math.cos(a), wy2 = Math.sin(a);
      if (ctx.faceVisible(wx2, wy2)) {
        var ww = RA * 0.09, tx3 = -wy2 * ww / 2, ty3 = wx2 * ww / 2, cxw = RA * wx2 * 1.002, cyw = RA * wy2 * 1.002;
        var qw = [pt(cxw - tx3, cyw - ty3, z + COL * 0.2), pt(cxw + tx3, cyw + ty3, z + COL * 0.2), pt(cxw + tx3, cyw + ty3, z + COL * 0.7), pt(cxw - tx3, cyw - ty3, z + COL * 0.7)];
        items.push({ svg: ctx.poly(qw, ctx.shade(GLASS, wx2, wy2, 0), null, 0), depth: far(qw) + 0.02 });
      }
      column(RP * Math.cos(a), RP * Math.sin(a), z, COL, DOME);
    }
    z += COL;
    ring(0, 0, RP + CD * 1.5, RP + CD * 1.5, z, ENT, 36, DOME, { bias: 0.3 });
    z += ENT;
    ring(0, 0, RP + CD * 1.2, RP + CD * 1.2, z, BAL, 36, DOME, { bias: 0.4 });
    /* the attic drum with its 36 windows and pilasters, the springing cornice on top */
    var attW = ATT - BAL - 1.0 * FT;
    ring(0, 0, RA, RA, z, attW, 36, DOME, { rot: Math.PI / 36, bias: 0.5 });
    for (var k3 = 0; k3 < 36; k3++) {
      var a3 = (k3 / 36) * Math.PI * 2, nx3 = Math.cos(a3), ny3 = Math.sin(a3);
      if (!ctx.faceVisible(nx3, ny3)) continue;
      var ww3 = RA * 0.07, tx4 = -ny3 * ww3 / 2, ty4 = nx3 * ww3 / 2, cx4 = RA * nx3 * 1.002, cy4 = RA * ny3 * 1.002;
      var q4 = [pt(cx4 - tx4, cy4 - ty4, z + attW * 0.25), pt(cx4 + tx4, cy4 + ty4, z + attW * 0.25), pt(cx4 + tx4, cy4 + ty4, z + attW * 0.75), pt(cx4 - tx4, cy4 - ty4, z + attW * 0.75)];
      items.push({ svg: ctx.poly(q4, ctx.shade(GLASS, nx3, ny3, 0), null, 0), depth: far(q4) + 0.02 });
      var a5 = a3 + Math.PI / 36, nx5 = Math.cos(a5), ny5 = Math.sin(a5), pw = RA * 0.035, tx5 = -ny5 * pw / 2, ty5 = nx5 * pw / 2, cx5 = RA * nx5 * 1.02, cy5 = RA * ny5 * 1.02;
      var q5 = [pt(cx5 - tx5, cy5 - ty5, z), pt(cx5 + tx5, cy5 + ty5, z), pt(cx5 + tx5, cy5 + ty5, z + attW), pt(cx5 - tx5, cy5 - ty5, z + attW)];
      items.push({ svg: ctx.poly(q5, tone(DOME, nx5, ny5, 0), DOME.edge, 0.3), depth: far(q5) + 0.021 });
    }
    z += attW;
    ring(0, 0, RA + 0.5, RA + 0.5, z, 1.0 * FT, 36, DOME, { bias: 0.6 });
    z += 1.0 * FT;
    /* the ribbed shell: 36 gores of a taller-than-hemispherical ellipse, a rib
       on each meridian, a small window at the foot of each gore, no horizontal
       bands. Gores sort by their centroid depth. */
    (function domeGores() {
      var N = 36, SEGS = 3, SUB = 4, zs = z;
      var ribFill = "#d4d1c8";
      for (var g = 0; g < N; g++) {
        var t0 = (g / N) * Math.PI * 2, t1 = ((g + 1) / N) * Math.PI * 2, tm = (t0 + t1) / 2;
        for (var sgi = 0; sgi < SEGS; sgi++) {
          var a0 = aMax * sgi / SEGS, a1 = aMax * (sgi + 1) / SEGS, am = (a0 + a1) / 2;
          var nx = Math.cos(am) * Math.cos(tm) / RS, ny = Math.cos(am) * Math.sin(tm) / RS, nz = Math.sin(am) / DR;
          var nl = Math.sqrt(nx * nx + ny * ny + nz * nz); nx /= nl; ny /= nl; nz /= nl;
          if (!vis3(nx, ny, nz)) continue;
          var poly = [], sumRy = 0, i, aa;
          for (i = 0; i <= SUB; i++) { aa = a0 + (a1 - a0) * i / SUB; poly.push(pt(RS * Math.cos(aa) * Math.cos(t0), RS * Math.cos(aa) * Math.sin(t0), zs + DR * Math.sin(aa))); }
          for (i = SUB; i >= 0; i--) { aa = a0 + (a1 - a0) * i / SUB; poly.push(pt(RS * Math.cos(aa) * Math.cos(t1), RS * Math.cos(aa) * Math.sin(t1), zs + DR * Math.sin(aa))); }
          for (i = 0; i < poly.length; i++) sumRy += poly[i][2];
          var dep = sumRy / poly.length;
          var fill = tone(DOME, nx, ny, nz);
          items.push({ svg: ctx.poly(poly, fill, fill, 0.3), depth: dep });
          /* the rib on this gore's leading meridian */
          var dt = (t1 - t0) * 0.14, rib = [];
          for (i = 0; i <= SUB; i++) { aa = a0 + (a1 - a0) * i / SUB; rib.push(pt(RS * Math.cos(aa) * Math.cos(t0), RS * Math.cos(aa) * Math.sin(t0), zs + DR * Math.sin(aa))); }
          for (i = SUB; i >= 0; i--) { aa = a0 + (a1 - a0) * i / SUB; rib.push(pt(RS * Math.cos(aa) * Math.cos(t0 + dt), RS * Math.cos(aa) * Math.sin(t0 + dt), zs + DR * Math.sin(aa))); }
          items.push({ svg: ctx.poly(rib, ctx.shade(ribFill, nx, ny, nz), null, 0), depth: dep + 0.003 });
          if (sgi === 0) {
            var wa0 = aMax * 0.05, wa1 = aMax * 0.16, wt0 = tm - (t1 - t0) * 0.14, wt1 = tm + (t1 - t0) * 0.14;
            var wq2 = [pt(RS * Math.cos(wa0) * Math.cos(wt0), RS * Math.cos(wa0) * Math.sin(wt0), zs + DR * Math.sin(wa0)),
                       pt(RS * Math.cos(wa0) * Math.cos(wt1), RS * Math.cos(wa0) * Math.sin(wt1), zs + DR * Math.sin(wa0)),
                       pt(RS * Math.cos(wa1) * Math.cos(wt1), RS * Math.cos(wa1) * Math.sin(wt1), zs + DR * Math.sin(wa1)),
                       pt(RS * Math.cos(wa1) * Math.cos(wt0), RS * Math.cos(wa1) * Math.sin(wt0), zs + DR * Math.sin(wa1))];
            items.push({ svg: ctx.poly(wq2, ctx.shade(GLASS, nx, ny, nz), null, 0), depth: dep + 0.004 });
          }
        }
      }
    })();
    z += SHELL;
    /* everything above the shell paints just nearer than the dome's front */
    var topDep = cRy + RS * 1.15 * s;
    function TD(b) { return { depth: topDep, bias: b }; }
    /* the tholos, 40 ft: balcony podium, 12 columns on a 25 ft ring round a core, entablature, cupola */
    var TP = 6 * FT, TC = 22 * FT, TE = 3 * FT, TK = THOL - TP - TC - TE;
    ring(0, 0, RT, RT, z, TP, 12, DOME, TD(1));
    z += TP;
    ring(0, 0, RTh * 0.56, RTh * 0.56, z, TC, 12, DOME, TD(2));
    for (var k2 = 0; k2 < 12; k2++) {
      var a2 = (k2 / 12) * Math.PI * 2;
      column(RTh * Math.cos(a2), RTh * Math.sin(a2), z, TC, DOME, TD(3 + (Math.sin(a2) * sYaw + Math.cos(a2) * cYaw > 0 ? 1 : 0)));
    }
    z += TC;
    ring(0, 0, RTh + 0.4, RTh + 0.4, z, TE, 12, DOME, TD(6));
    z += TE;
    ring(0, 0, RTh + 0.4, RTh * 0.8, z, TK / 3, 12, DOME, TD(7));
    ring(0, 0, RTh * 0.8, RTh * 0.5, z + TK / 3, TK / 3, 12, DOME, TD(8));
    ring(0, 0, RTh * 0.5, RTh * 0.15, z + 2 * TK / 3, TK / 3, 12, DOME, TD(9));
    z += TK;
    /* the Statue of Freedom: 18.5 ft cast-iron pedestal with the globe, then the 19.5 ft bronze figure */
    ring(0, 0, 5 * FT, 4 * FT, z, 12 * FT, 8, IRON, TD(10));
    ring(0, 0, 2.4 * FT, 3.25 * FT, z + 12 * FT, 3.25 * FT, 8, IRON, TD(11));
    ring(0, 0, 3.25 * FT, 1.6 * FT, z + 15.25 * FT, 3.25 * FT, 8, IRON, TD(12));
    z += 18.5 * FT;
    ring(0, 0, 1.7 * FT, 1.35 * FT, z, 9 * FT, 8, BRONZE, TD(13));            /* the robe */
    ring(0, 0, 1.45 * FT, 1.2 * FT, z + 9 * FT, 6.5 * FT, 8, BRONZE, TD(14));   /* torso and shoulders */
    ring(0, 0, 0.8 * FT, 0.65 * FT, z + 15.5 * FT, 2.2 * FT, 8, BRONZE, TD(15)); /* the head */
    ring(0, 0, 0.55 * FT, 0.2 * FT, z + 17.7 * FT, 1.8 * FT, 8, BRONZE, TD(16)); /* the crested helmet */

    return items;
  };
})();
