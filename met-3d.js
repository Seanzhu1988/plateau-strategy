/* The Met as a solid you can turn, drawn like an architect's model.
 *
 * Two layers, one drawing. Closed, it is the building: the real footprint
 * from OpenStreetMap relation 3698894 (291 by 337 metres, eleven and a half
 * acres), extruded, with the skylight banks on the roof that anyone who has
 * looked down on the Met from a neighbouring tower would recognise. Tap it
 * and it opens: the roof lifts away, the storeys draw apart, and the
 * galleries stand inside their own outer wall.
 *
 * What makes it read as a model rather than a diagram is light. One sun,
 * upper left: every wall is shaded by which way it faces, the building casts
 * a soft shadow on the ground, and the floating second storey casts its own
 * onto the floor below. None of that needs a 3D engine; it is a dozen lines
 * of arithmetic, which matters because the person opening this is standing
 * in a museum lobby on a phone.
 *
 * The routes are footprints, not dashed lines, because footprints are what
 * this whole project is: a corridor someone has walked with the recorder
 * prints dark, one nobody has walked prints faint, and the walk you have
 * picked prints in the site's own navy.
 *
 * The galleries remain OUR schematic (the Met has no indoor mapping in OSM
 * and its own plan is copyrighted); the outer wall is the building's own.
 * The page says which is which.
 */
(function () {
  'use strict';

  /* ---- the real outer wall, normalised, true proportions ---- */
  var SHELL = "310.4,46.7;314.3,39.7;316.2,36.4;320.5,28.6;328.3,32.9;330,33.9;331.6,34.8;337.2,37.8;389.5,66.8;418.9,83;420.6,84;421.5,84.5;467.7,110;469.5,111;483.9,119;431.9,212.3;414.8,202.9;383.3,259.6;368,287.1;372.6,289.7;349.6,330.9;323.7,377.8;319,375.1;303.5,403.1;285.5,435.3;272.6,458.7;289.7,468.2;271.1,501.7;251.7,536.4;238.6,560;222.4,551;183.4,529.5;176.7,525.8;173.1,523.8;169.5,521.8;92.9,479.5;87.8,476.7;84.6,474.9;80.1,472.5;72.2,468;76.8,459.5;78.5,456.6;80.7,452.9;0,408.5;42.7,331.8;67.4,345.4;74.6,349.3;88.3,324.7;101.3,301.4;110.5,284.7;131.4,247;130.7,244.3;125.4,241.4;119,243.1;111,257.6;95.9,249.2;80.8,196.3;89.6,180.4;142.7,165.1;157.8,173.5;149.8,188;151.6,194.2;156.9,197.2;159.6,196.3;188,145.3;189.7,142.3;203.7,117;216,94.8;183.1,76.6;186.1,71.1;218.2,13.5;225.7,0;291.4,36.3;310.4,46.7".split(";").map(function (p) {
    var a = p.split(",");
    return [parseFloat(a[0]), parseFloat(a[1])];
  });

  var SCHEMATIC_W = 760, SHELL_W = 484;
  var KX = SHELL_W / SCHEMATIC_W;

  var WALL = 26;             /* one storey of gallery */
  var GAP = 430;             /* how far floor 2 floats when open */
  var SLAB = 6;              /* the plinth floor 2 stands on */
  var EXT_H = 96;            /* the closed building's massing height */

  /* ---- the palette: paper, limestone, ink, navy ---- */
  var C = {
    ink: "#14110c",
    navy: "#1f3a5f",
    ground: "#efece3",
    shellWall: "#e7dfcf",
    shellEdge: "#a89f8c",
    roof: "#efe9db",
    roofLine: "#e2dac8",
    glass: "#d3dde2",
    glassEdge: "#b9c4ca",
    f1Top: "#ece5d6", f1Edge: "#948b79",
    f2Top: "#f2ecdf", f2Edge: "#9d9483",
    slab: "#e9e2d2",
    routeTop: "#a3bcdf", routeEdge: "#1f3a5f",
    litTop: "#7fa3d1",
    printWalked: "#6b6459",
    printUnwalked: "#c6bfae",
    printRoute: "#1f3a5f",
    stair: "#a9a294"
  };

  var LIGHT = [-0.62, -0.38, 0.68];
  var yaw = -0.62, pitch = 0.70, exploded = true;
  var openT = 0, anim = null;

  function rooms() { var G = window.MET_GEOMETRY; return (G && G.ROOMS) || null; }
  function edges() { var G = window.MET_GEOMETRY; return (G && G.EDGES) || []; }

  /* ---- projection, with the frame fitted to what was drawn ---- */
  var CX = SHELL_W / 2, CY = 560 / 2, OX = 470, OY = 430, SC = 0.80;
  var BB = null;

  function project(x, y, z) {
    var dx = (x - CX), dy = (y - CY);
    var c = Math.cos(yaw), s = Math.sin(yaw);
    var rx = dx * c - dy * s;
    var ry = dx * s + dy * c;
    var sx = OX + rx * SC;
    var sy = OY + (ry * Math.sin(pitch) - (z || 0) * Math.cos(pitch)) * SC;
    if (BB) {
      if (sx < BB[0]) BB[0] = sx;
      if (sy < BB[1]) BB[1] = sy;
      if (sx > BB[2]) BB[2] = sx;
      if (sy > BB[3]) BB[3] = sy;
    }
    return [sx, sy, ry];
  }

  function faceVisible(nx, ny) {
    return (nx * Math.sin(yaw) + ny * Math.cos(yaw)) > 0.001;
  }

  function shade(hex, nx, ny, nz) {
    var d = nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2];
    var f = 0.55 + 0.45 * Math.max(0, d);
    var n = parseInt(hex.slice(1), 16);
    var r = Math.min(255, Math.round(((n >> 16) & 255) * f));
    var g = Math.min(255, Math.round(((n >> 8) & 255) * f));
    var b = Math.min(255, Math.round((n & 255) * f));
    return "rgb(" + r + "," + g + "," + b + ")";
  }

  function poly(points, fill, stroke, sw, extra) {
    return '<polygon points="' + points.map(function (p) {
      return p[0].toFixed(1) + "," + p[1].toFixed(1);
    }).join(" ") + '" fill="' + fill + '"' +
      (stroke ? ' stroke="' + stroke + '" stroke-width="' + (sw || 1) + '"' : "") +
      ' stroke-linejoin="round"' + (extra || "") + "/>";
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[<>&"']/g, function (c) {
      return { "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---- one gallery, as a little building of its own ---- */
  function box(x1, y1, x2, y2, zBase, h, topC, wallC, edgeC, o) {
    o = o || {};
    var zTop = zBase + h, parts = [], depth = -1e9;
    var corners = [[x1, y1], [x2, y1], [x2, y2], [x1, y2]];
    var normals = [[0, -1], [1, 0], [0, 1], [-1, 0]];

    for (var i = 0; i < 4; i++) {
      var a = corners[i], b = corners[(i + 1) % 4], n = normals[i];
      if (!faceVisible(n[0], n[1])) continue;
      var pa = project(a[0], a[1], zTop), pb = project(b[0], b[1], zTop),
          pc = project(b[0], b[1], zBase), pd = project(a[0], a[1], zBase);
      depth = Math.max(depth, (pa[2] + pb[2]) / 2);
      parts.push(poly([pa, pb, pc, pd], shade(wallC, n[0], n[1], 0), edgeC, 0.6));
    }
    var t = corners.map(function (p) { return project(p[0], p[1], zTop); });
    depth = Math.max(depth, t[0][2], t[1][2], t[2][2], t[3][2]);
    parts.push(poly(t, shade(topC, 0, 0, 1), edgeC, 1.1));

    var cx = (t[0][0] + t[2][0]) / 2, cy = (t[0][1] + t[2][1]) / 2;
    /* Labels are returned separately: the floor draws every box first and
       every label after, so a nearer room can hide a farther room but never
       its name. A floating name over an edge, haloed, beats a hidden one. */
    var labels = [];
    if (o.label) {
      labels.push('<text class="m3-lbl" x="' + cx.toFixed(1) + '" y="' + (cy + 3).toFixed(1) +
                  '" text-anchor="middle">' + esc(o.label) + "</text>");
    }
    if (o.sub) {
      labels.push('<text class="m3-sub" x="' + cx.toFixed(1) + '" y="' +
                  (cy + (o.label ? 15 : 4)).toFixed(1) +
                  '" text-anchor="middle">' + esc(o.sub) + "</text>");
    }
    var inner = parts.join("");
    if (o.room) {
      inner = '<g class="m3-room" data-room="' + esc(o.room) + '" tabindex="0" role="button" ' +
              'aria-label="' + esc(o.aria || o.label || o.room) + '">' + inner + "</g>";
    }
    return { svg: inner, labelSvg: labels.join(""), depth: depth };
  }

  /* ---- the real outer wall ---- */
  function shellSolid(zBase, h) {
    var parts = [], zTop = zBase + h;
    for (var i = 0; i < SHELL.length; i++) {
      var a = SHELL[i], b = SHELL[(i + 1) % SHELL.length];
      var ex = b[0] - a[0], ey = b[1] - a[1];
      var len = Math.hypot(ex, ey) || 1;
      var nx = ey / len, ny = -ex / len;
      if (!faceVisible(nx, ny)) continue;
      var pa = project(a[0], a[1], zTop), pb = project(b[0], b[1], zTop),
          pc = project(b[0], b[1], zBase), pd = project(a[0], a[1], zBase);
      parts.push(poly([pa, pb, pc, pd], shade(C.shellWall, nx, ny, 0), C.shellEdge, 0.7));
    }
    return parts.join("");
  }

  function shellRing(z, fill, opacity, stroke, sw) {
    var pts = SHELL.map(function (p) { return project(p[0], p[1], z); });
    return poly(pts, fill, stroke || C.shellEdge, sw == null ? 1.2 : sw,
                opacity != null ? ' opacity="' + opacity + '"' : "");
  }

  /* ---- footprints: the routes of this house, drawn as what they are ---- */
  function centrePlan(r) { return [(r.x + r.w / 2) * KX, r.y + r.h / 2]; }

  function prints(a, b, R, z, kind) {
    var A = centrePlan(R[a]), B = centrePlan(R[b]);
    var dx = B[0] - A[0], dy = B[1] - A[1];
    var len = Math.hypot(dx, dy) || 1;
    var ux = dx / len, uy = dy / len, pxn = -uy, pyn = ux;
    var stepLen = 26, n = Math.max(2, Math.floor(len / stepLen));
    var fill = kind === "route" ? C.printRoute : (kind === "walked" ? C.printWalked : C.printUnwalked);
    var rx = kind === "route" ? 4.2 : 3.4, ry = rx * 0.62;
    var out = [], depth = -1e9;
    /* screen-space heading of the path, so each print points along it */
    var pA = project(A[0], A[1], z), pB = project(B[0], B[1], z);
    var angle = Math.atan2(pB[1] - pA[1], pB[0] - pA[0]) * 180 / Math.PI;
    for (var i = 1; i < n; i++) {
      var t = i / n;
      var side = (i % 2 === 0) ? 4.5 : -4.5;
      var x = A[0] + dx * t + pxn * side, y = A[1] + dy * t + pyn * side;
      var p = project(x, y, z);
      depth = Math.max(depth, p[2]);
      out.push('<ellipse cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) +
               '" rx="' + rx + '" ry="' + ry + '" fill="' + fill + '"' +
               ' opacity="' + (kind === "unwalked" ? 0.85 : 0.95) + '"' +
               ' transform="rotate(' + angle.toFixed(1) + " " + p[0].toFixed(1) + " " +
               p[1].toFixed(1) + ')"/>');
    }
    return { svg: out.join(""), depth: depth };
  }

  /* the one vertical route: the stair between the floors */
  function stairLink(a, b, R, zOf, kind) {
    var A = centrePlan(R[a]), B = centrePlan(R[b]);
    var p = project(A[0], A[1], zOf(R[a]) + WALL + 1);
    var q = project(B[0], B[1], zOf(R[b]) + WALL + 1);
    var col = kind === "route" ? C.navy : C.stair;
    return { svg: '<line x1="' + p[0].toFixed(1) + '" y1="' + p[1].toFixed(1) +
             '" x2="' + q[0].toFixed(1) + '" y2="' + q[1].toFixed(1) +
             '" stroke="' + col + '" stroke-width="' + (kind === "route" ? 3.5 : 2) +
             '" stroke-dasharray="3 7" stroke-linecap="round"/>' +
             '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="3.5" fill="' + col + '"/>' +
             '<circle cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="3.5" fill="' + col + '"/>',
             depth: Math.max(p[2], q[2]) };
  }

  /* ---- the roof, with the skylight banks ---- */
  function roof(shellH) {
    var parts = [shellRing(shellH, C.roof, null, C.shellEdge, 1.4)];
    /* No panel seams: straight lines at a fixed y poked past the ring's
       notches and read as floating scratches. The skylights carry the roof. */
    /* the glass: three skylight banks over the picture galleries */
    [[150, 180, 300, 202], [150, 226, 300, 248], [150, 272, 300, 294]].forEach(function (g) {
      var q = [project(g[0], g[1], shellH), project(g[2], g[1], shellH),
               project(g[2], g[3], shellH), project(g[0], g[3], shellH)];
      parts.push(poly(q, C.glass, C.glassEdge, 1));
      var glA = project(g[0], g[1] + 3, shellH), glB = project(g[2], g[1] + 3, shellH);
      parts.push('<line x1="' + glA[0].toFixed(1) + '" y1="' + glA[1].toFixed(1) +
                 '" x2="' + glB[0].toFixed(1) + '" y2="' + glB[1].toFixed(1) +
                 '" stroke="#ffffff" stroke-width="1.2" opacity=".7"/>');
    });
    return parts.join("");
  }

  /* ---- the whole drawing ---- */
  function labelFor(key, r) {
    if ((r.w * KX) < 45) return null;               /* tiny rooms carry only their sub */
    var cards = window.MET_CARDS || {};
    var c = cards[key];
    var name = (c && (c.short || c.name)) || key.replace(/-/g, " ");
    return name.length > 24 ? name.slice(0, 23) + "…" : name;
  }

  function build(opts) {
    var R = rooms();
    if (!R) return "";
    var o = opts || {}, route = o.route || [], walked = o.walked || {};
    var current = o.current || null;
    var onRoute = {}, pairs = {};
    route.forEach(function (k) { onRoute[k] = true; });
    for (var i = 1; i < route.length; i++) {
      pairs["met-" + [route[i - 1], route[i]].sort().join("--")] = true;
    }

    BB = [1e9, 1e9, -1e9, -1e9];
    var gap = GAP * openT;
    function zOf(r) { return r.f === 2 ? (exploded ? WALL + gap : WALL) : 0; }
    var shellH = EXT_H + (WALL - EXT_H) * openT;

    var items = [];
    var svg = ['<svg viewBox="0 0 940 660" xmlns="http://www.w3.org/2000/svg" role="img" ' +
      'aria-label="The Metropolitan Museum of Art as a turnable model: the real building ' +
      'outline, and inside it both gallery floors, their corridors drawn as footprints.">'];

    /* the shadow the building throws, then the ground it stands on */
    svg.push('<g transform="translate(17,11)">' +
             shellRing(0, C.ink, "0.07", "none", 0) + "</g>");
    svg.push(shellRing(0, C.ground, null, C.shellEdge, 1));

    /* the outer wall, and closed, its roof */
    items.push({ svg: shellSolid(0, shellH), depth: -1e8, floor: 1 });
    if (openT < 0.99) {
      items.push({ svg: '<g opacity="' + (1 - openT).toFixed(2) + '">' + roof(shellH) + "</g>",
                   depth: 1e8, floor: 3 });
    }

    /* floor 1 galleries */
    if (openT > 0.02) Object.keys(R).forEach(function (k) {
      var r = R[k];
      if (r.f !== 1) return;
      var isCur = k === current, isRt = !!onRoute[k];
      var b = box(r.x * KX, r.y, (r.x + r.w) * KX, r.y + r.h, 0, WALL,
                  isCur ? C.litTop : (isRt ? C.routeTop : C.f1Top),
                  isCur ? C.litTop : (isRt ? C.routeTop : C.f1Top),
                  isRt || isCur ? C.routeEdge : C.f1Edge,
                  { label: labelFor(k, r), sub: r.sub, room: k });
      b.floor = 1;
      if (openT < 0.98) b.svg = '<g opacity="' + openT.toFixed(2) + '">' + b.svg + "</g>";
      items.push(b);
      if (b.labelSvg) {
        var lb1 = openT < 0.98 ? '<g opacity="' + openT.toFixed(2) + '">' + b.labelSvg + "</g>" : b.labelSvg;
        items.push({ svg: lb1, depth: 2e7, floor: 1 });
      }
    });

    /* floor 1 footprints */
    if (openT > 0.02) edges().forEach(function (e) {
      var ra = R[e[0]], rb = R[e[1]];
      if (!ra || !rb || ra.f !== 1 || rb.f !== 1) return;
      var key = "met-" + [e[0], e[1]].sort().join("--");
      var kind = pairs[key] ? "route" : (walked[key] ? "walked" : "unwalked");
      var pr = prints(e[0], e[1], R, 1.5, kind);
      pr.floor = 1; pr.depth = 1e7;              /* prints lie ON the ground, over box bases */
      if (openT < 0.98) pr.svg = '<g opacity="' + openT.toFixed(2) + '">' + pr.svg + "</g>";
      items.push(pr);
    });

    /* the slab floor 2 stands on, its shadow first */
    if (exploded && openT > 0.02) {
      items.push({ svg: '<g transform="translate(10,7)" opacity="' + (0.06 * openT).toFixed(3) +
                   '">' + shellRing(WALL, C.ink, null, "none", 0) + "</g>",
                   depth: 1e7 + 1, floor: 1 });
      /* Floor 2's ground is a whisper, not a slab: the full ring filled
         solid was a wall of beige that swallowed the air between the
         storeys. An outline with a light wash says "same building, one
         level up" and lets floor 1 breathe underneath. */
      items.push({ svg: '<g opacity="' + openT.toFixed(2) + '">' +
                   shellRing(WALL + gap, C.slab, "0.16", C.shellEdge, 1.3) + "</g>",
                   depth: -1e8, floor: 2 });
    }

    /* floor 2 galleries and their footprints */
    if (openT > 0.02) {
      Object.keys(R).forEach(function (k) {
        var r = R[k];
        if (r.f !== 2) return;
        var isCur = k === current, isRt = !!onRoute[k];
        var b = box(r.x * KX, r.y, (r.x + r.w) * KX, r.y + r.h, zOf(r), WALL,
                    isCur ? C.litTop : (isRt ? C.routeTop : C.f2Top),
                    isCur ? C.litTop : (isRt ? C.routeTop : C.f2Top),
                    isRt || isCur ? C.routeEdge : C.f2Edge,
                    { label: labelFor(k, r), sub: r.sub, room: k });
        b.floor = 2;
        if (openT < 0.98) b.svg = '<g opacity="' + openT.toFixed(2) + '">' + b.svg + "</g>";
        items.push(b);
        if (b.labelSvg) {
          var lb2 = openT < 0.98 ? '<g opacity="' + openT.toFixed(2) + '">' + b.labelSvg + "</g>" : b.labelSvg;
          items.push({ svg: lb2, depth: 2e7, floor: 2 });
        }
      });
      edges().forEach(function (e) {
        var ra = R[e[0]], rb = R[e[1]];
        if (!ra || !rb || ra.f !== 2 || rb.f !== 2) return;
        var key = "met-" + [e[0], e[1]].sort().join("--");
        var kind = pairs[key] ? "route" : (walked[key] ? "walked" : "unwalked");
        var pr = prints(e[0], e[1], R, zOf(ra) + 1.5, kind);
        pr.floor = 2; pr.depth = 1e7;
        if (openT < 0.98) pr.svg = '<g opacity="' + openT.toFixed(2) + '">' + pr.svg + "</g>";
        items.push(pr);
      });
      /* the stair, over both floors */
      edges().forEach(function (e) {
        var ra = R[e[0]], rb = R[e[1]];
        if (!ra || !rb || ra.f === rb.f) return;
        var key = "met-" + [e[0], e[1]].sort().join("--");
        var st = stairLink(e[0], e[1], R, zOf, pairs[key] ? "route" : "plain");
        st.floor = 3;
        if (openT < 0.98) st.svg = '<g opacity="' + openT.toFixed(2) + '">' + st.svg + "</g>";
        items.push(st);
      });
    }

    items.sort(function (a, b) {
      var fa = a.floor || 1, fb = b.floor || 1;
      if (fa !== fb) return fa - fb;
      return a.depth - b.depth;
    });
    items.forEach(function (it) { svg.push(it.svg); });

    /* captions */
    if (openT < 0.5) {
      var cap = project(CX, 660, 0), capX = cap[0], capY = cap[1] + 26;
      svg.push('<text class="m3-title" x="' + capX.toFixed(0) + '" y="' + capY.toFixed(0) +
               '" text-anchor="middle">The Metropolitan Museum of Art</text>');
      svg.push('<text class="m3-sub2" x="' + capX.toFixed(0) + '" y="' + (capY + 22).toFixed(0) +
               '" text-anchor="middle">Eleven and a half acres. Tap the building to go inside.</text>');
      if (capX - 250 < BB[0]) BB[0] = capX - 250;
      if (capX + 250 > BB[2]) BB[2] = capX + 250;
      if (capY + 34 > BB[3]) BB[3] = capY + 34;
    }
    if (openT > 0.5) {
      var l1 = project(CX, 620, 0)[1], l2 = project(CX, 620, WALL + gap)[1];
      var lx = BB[0] - 96;
      svg.push('<text class="m3-floorlbl" x="' + lx.toFixed(0) + '" y="' + l1.toFixed(0) +
               '">FLOOR 1</text>');
      if (exploded) svg.push('<text class="m3-floorlbl" x="' + lx.toFixed(0) + '" y="' +
               l2.toFixed(0) + '">FLOOR 2</text>');
      BB[0] = lx - 8;
    }

    var w = Math.max(1, BB[2] - BB[0]), h = Math.max(1, BB[3] - BB[1]);
    var VW = 940, VH = 660, PAD = 26;
    var k = Math.min((VW - PAD * 2) / w, (VH - PAD * 2) / h);
    var tx = (VW - w * k) / 2 - BB[0] * k, ty = (VH - h * k) / 2 - BB[1] * k;
    var body = svg.slice(1).join("");
    return svg[0] + '<g transform="translate(' + tx.toFixed(1) + "," + ty.toFixed(1) +
           ") scale(" + k.toFixed(4) + ')">' + body + "</g></svg>";
  }

  /* ---- public ---- */
  function render(host, opts) { host.innerHTML = build(opts); }

  function animateTo(target, host, opts, done) {
    if (anim) { cancelAnimationFrame(anim); anim = null; }
    var from = openT, t0 = null, dur = 620;
    function frame(ts) {
      if (t0 === null) t0 = ts;
      var k = Math.min(1, (ts - t0) / dur);
      var e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      openT = from + (target - from) * e;
      render(host, opts);
      if (k < 1) anim = requestAnimationFrame(frame);
      else { anim = null; openT = target; render(host, opts); if (done) done(); }
    }
    anim = requestAnimationFrame(frame);
  }

  function attach(host, opts) {
    render(host, opts);
    if (host.__met3dBound) return;
    host.__met3dBound = true;
    var startX = null, startY = null, y0 = yaw, p0 = pitch, moved = false;
    host.addEventListener("click", function (e) {
      if (moved) { e.stopPropagation(); moved = false; return; }
      if (openT < 0.5) {
        e.stopPropagation();
        animateTo(1, host, opts);
        host.dispatchEvent(new CustomEvent("met3d:layer",
          { detail: { layer: "interior" }, bubbles: true }));
      }
    }, true);
    host.addEventListener("pointerdown", function (e) {
      startX = e.clientX; startY = e.clientY; y0 = yaw; p0 = pitch; moved = false;
    });
    host.addEventListener("pointermove", function (e) {
      if (startX === null) return;
      var dx = e.clientX - startX, dy = e.clientY - startY;
      if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
      if (!moved) return;
      yaw = y0 + dx * 0.006;
      pitch = Math.max(0.45, Math.min(1.35, p0 + dy * 0.004));
      render(host, opts);
    });
    function end() { startX = null; }
    host.addEventListener("pointerup", end);
    host.addEventListener("pointercancel", end);
    host.addEventListener("pointerleave", end);
  }

  window.Met3D = {
    render: render,
    attach: attach,
    openInterior: function (host, opts, done) { animateTo(1, host, opts, done); },
    closeToExterior: function (host, opts, done) { animateTo(0, host, opts, done); },
    isOpen: function () { return openT > 0.5; },
    setExploded: function (v) { exploded = !!v; },
    isExploded: function () { return exploded; },
    reset: function () { yaw = -0.62; pitch = 0.70; }
  };
})();
