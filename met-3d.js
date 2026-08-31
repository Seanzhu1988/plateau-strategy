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

  /* One sun, front-right: the Fifth Avenue face is limestone in daylight,
     which is the whole point of standing before it. Tops stay brightest. */
  var LIGHT = [0.60, 0.30, 0.68];
  /* Closed, the model presents its Fifth Avenue front (the facade's outward
     normal faces the camera at yaw -2.05); open, it sits at the reading
     angle the floor plan was composed for. FRONT_TURN is the difference,
     blended by openT, so entering the museum literally turns the building
     from its face to its plan. */
  var FRONT_TURN = 1.71;
  var FRONT_DIP = -0.19;         /* closed, the camera drops toward street level */
  var yaw = -0.62, pitch = 0.70, exploded = true;
  var vYaw = yaw, vPitch = pitch;
  var openT = 0, anim = null;
  /* The third layer: one room, held close. focusKey is which gallery the
     camera has dived into, focusT its animation, exactly as openT is the
     building's. Nothing about the drawing changes when it is off. */
  var focusKey = null, focusT = 0, animF = null;

  function rooms() { var G = window.MET_GEOMETRY; return (G && G.ROOMS) || null; }
  function edges() { var G = window.MET_GEOMETRY; return (G && G.EDGES) || []; }

  /* ---- projection, with the frame fitted to what was drawn ---- */
  var CX = SHELL_W / 2, CY = 560 / 2, OX = 470, OY = 430, SC = 0.80;
  var BB = null;

  function projRaw(x, y, z) {
    var dx = (x - CX), dy = (y - CY);
    var c = Math.cos(vYaw), s = Math.sin(vYaw);
    var rx = dx * c - dy * s;
    var ry = dx * s + dy * c;
    return [OX + rx * SC,
            OY + (ry * Math.sin(vPitch) - (z || 0) * Math.cos(vPitch)) * SC, ry];
  }

  function project(x, y, z) {
    var p = projRaw(x, y, z);
    var sx = p[0], sy = p[1];
    if (BB) {
      if (sx < BB[0]) BB[0] = sx;
      if (sy < BB[1]) BB[1] = sy;
      if (sx > BB[2]) BB[2] = sx;
      if (sy > BB[3]) BB[3] = sy;
    }
    return p;
  }

  function faceVisible(nx, ny) {
    return (nx * Math.sin(vYaw) + ny * Math.cos(vYaw)) > 0.001;
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

  /* ---- the Fifth Avenue front, taken seriously ----
   *
   * Measured, not invented: the front line is the chord of the shell's
   * south-east run, whose jogs stay within 2.7 units of it, and the
   * pavilion is anchored where the Great Hall's centre projects onto that
   * line, because the door and the hall are the same fact. What stands on
   * it is what stands on the building: the grand staircase, the pavilion
   * higher than the wings, four pairs of columns, three arches, and the
   * four blocks above the pairs that were never carved.
   */
  var FR = {
    A: [414.8, 202.9],           /* the run's north end */
    u: [-0.462, 0.887],          /* along the front, toward the south end */
    /* Outward was measured by point-in-polygon against the real shell, not
       by which side the schematic Great Hall sits on: the schematic room
       overhangs the true wall slightly (the sheet says not to scale), and
       trusting it flipped this normal once. */
    n: [0.887, 0.462],           /* outward, toward the avenue */
    L: 197.2,
    tC: 77.6                     /* where the Great Hall projects: the door */
  };
  function fp(t, d) {
    return [FR.A[0] + FR.u[0] * t + FR.n[0] * d,
            FR.A[1] + FR.u[1] * t + FR.n[1] * d];
  }
  /* a quad standing on the front plane: t-range along, d out, z-range up */
  function frontQuad(t1, t2, d, z1, z2, fill, edge, sw) {
    if (!faceVisible(FR.n[0], FR.n[1])) return null;
    var a = fp(t1, d), b = fp(t2, d);
    var pa = project(a[0], a[1], z2), pb = project(b[0], b[1], z2),
        pc = project(b[0], b[1], z1), pd = project(a[0], a[1], z1);
    return { svg: poly([pa, pb, pc, pd], fill, edge, sw || 0.6),
             depth: Math.max(pa[2], pb[2]) };
  }
  function facade(fade) {
    var out = [];
    /* The facade is the outermost thing on the street side, so the whole of
       it paints after the roof: push order is paint order. */
    function push(part) {
      if (!part) return;
      out.push({ svg: '<g opacity="' + fade.toFixed(2) + '">' + part + "</g>",
                 depth: 1e8 + 10 + out.length, floor: 3 });
    }
    var PAV_H = 113, PAV_D = 10, PAV_HW = 37, PLAT_Z = 18;
    var shadeN = function (c) { return shade(c, FR.n[0], FR.n[1], 0); };
    var shadeU = function (c, sgn) { return shade(c, FR.u[0] * sgn, FR.u[1] * sgn, 0); };

    /* the pavilion: a taller block standing proud of the wall */
    var pavParts = [], pavDepth = -1e9;
    [[-1, 0], [1, 0]].forEach(function (side) {
      var sgn = side[0];
      if (!faceVisible(FR.u[0] * sgn, FR.u[1] * sgn)) return;
      var t = FR.tC + PAV_HW * sgn;
      var a = fp(t, 0), b = fp(t, PAV_D);
      var pa = project(a[0], a[1], PAV_H), pb = project(b[0], b[1], PAV_H),
          pc = project(b[0], b[1], 0), pd = project(a[0], a[1], 0);
      pavDepth = Math.max(pavDepth, pa[2], pb[2]);
      pavParts.push(poly([pa, pb, pc, pd], shadeU(C.shellWall, sgn), C.shellEdge, 0.7));
    });
    var fq = frontQuad(FR.tC - PAV_HW, FR.tC + PAV_HW, PAV_D, 0, PAV_H,
                       shadeN(C.shellWall), C.shellEdge, 0.8);
    if (fq) { pavParts.push(fq.svg); pavDepth = Math.max(pavDepth, fq.depth); }
    /* its flat cap */
    var capPts = [fp(FR.tC - PAV_HW, 0), fp(FR.tC + PAV_HW, 0),
                  fp(FR.tC + PAV_HW, PAV_D), fp(FR.tC - PAV_HW, PAV_D)]
      .map(function (q) { return project(q[0], q[1], PAV_H); });
    pavParts.push(poly(capPts, shade(C.roof, 0, 0, 1), C.shellEdge, 1));
    capPts.forEach(function (q) { pavDepth = Math.max(pavDepth, q[2]); });
    push(pavParts.join(""));

    /* the grand staircase, descending to the avenue and widening as it goes */
    for (var st = 0; st < 5; st++) {
      var hw = 30 + st * 3.5;
      var d1 = PAV_D + st * 4.4, d2 = PAV_D + (st + 1) * 4.4;
      var zt = PLAT_Z - (PLAT_Z / 5) * st;
      var q1 = fp(FR.tC - hw, d1), q2 = fp(FR.tC + hw, d1),
          q3 = fp(FR.tC + hw, d2), q4 = fp(FR.tC - hw, d2);
      var t1 = project(q1[0], q1[1], zt), t2 = project(q2[0], q2[1], zt),
          t3 = project(q3[0], q3[1], zt), t4 = project(q4[0], q4[1], zt);
      var stepParts = [poly([t1, t2, t3, t4], shade(C.f2Top, 0, 0, 1), C.shellEdge, 0.5)];
      var riser = frontQuad(FR.tC - hw, FR.tC + hw, d2, zt - PLAT_Z / 5, zt,
                            shadeN(C.f1Top), C.shellEdge, 0.4);
      var sd = Math.max(t3[2], t4[2]);
      if (riser) { stepParts.push(riser.svg); sd = Math.max(sd, riser.depth); }
      push(stepParts.join(""));        /* each step nearer the street */
    }

    /* the three arches, glass in shadow behind the colonnade */
    [-18.5, 0, 18.5].forEach(function (ac) {
      var t = FR.tC + ac, r = 8.2, spring = 58, base = PLAT_Z;
      var pts = [];
      pts.push(project.apply(null, fp(t - r, PAV_D + 0.15).concat([base])));
      pts.push(project.apply(null, fp(t - r, PAV_D + 0.15).concat([spring])));
      for (var ai = 1; ai < 8; ai++) {
        var th = Math.PI - (Math.PI * ai) / 8;
        var q = fp(t + Math.cos(th) * r, PAV_D + 0.15);
        pts.push(project(q[0], q[1], spring + Math.sin(th) * r));
      }
      pts.push(project.apply(null, fp(t + r, PAV_D + 0.15).concat([spring])));
      pts.push(project.apply(null, fp(t + r, PAV_D + 0.15).concat([base])));
      if (faceVisible(FR.n[0], FR.n[1])) {
        push(poly(pts, C.glass, C.glassEdge, 0.9, ' opacity="0.85"'));
      }
    });

    /* four pairs of columns, platform to entablature */
    var pairs = [-27.75, -9.25, 9.25, 27.75];
    pairs.forEach(function (pc) {
      [-3.2, 3.2].forEach(function (off) {
        var t = FR.tC + pc + off;
        var col = frontQuad(t - 1.1, t + 1.1, PAV_D + 0.3, PLAT_Z, 92,
                            shadeN(C.f2Top), C.shellEdge, 0.45);
        if (col) push(col.svg);
        var cap = frontQuad(t - 1.8, t + 1.8, PAV_D + 0.35, 88, 92,
                            shadeN(C.f1Top), C.shellEdge, 0.4);
        if (cap) push(cap.svg);
      });
    });
    /* the entablature they carry */
    var ent = frontQuad(FR.tC - PAV_HW + 1.5, FR.tC + PAV_HW - 1.5, PAV_D + 0.4,
                        92, 100, shadeN(C.f2Top), C.shellEdge, 0.6);
    if (ent) push(ent.svg);

    /* the four blocks that were never carved, one above each pair */
    pairs.forEach(function (pc) {
      var bParts = [], bd = -1e9;
      var bq = frontQuad(FR.tC + pc - 4.5, FR.tC + pc + 4.5, 8, PAV_H, PAV_H + 8,
                         shadeN(C.shellWall), C.shellEdge, 0.6);
      if (bq) { bParts.push(bq.svg); bd = Math.max(bd, bq.depth); }
      var bt = [fp(FR.tC + pc - 4.5, 2), fp(FR.tC + pc + 4.5, 2),
                fp(FR.tC + pc + 4.5, 8), fp(FR.tC + pc - 4.5, 8)]
        .map(function (q) { return project(q[0], q[1], PAV_H + 8); });
      bParts.push(poly(bt, shade(C.roof, 0, 0, 1), C.shellEdge, 0.6));
      bt.forEach(function (q) { bd = Math.max(bd, q[2]); });
      push(bParts.join(""));
    });

    /* the wings' cornice, drawn on the true wall either side of the pavilion */
    [[2, FR.tC - PAV_HW - 2], [FR.tC + PAV_HW + 2, FR.L - 2]].forEach(function (w) {
      if (w[1] - w[0] < 8 || !faceVisible(FR.n[0], FR.n[1])) return;
      var a = fp(w[0], 0.6), b = fp(w[1], 0.6);
      var pa = project(a[0], a[1], 62), pb = project(b[0], b[1], 62);
      var line = '<line x1="' + pa[0].toFixed(1) + '" y1="' + pa[1].toFixed(1) +
                 '" x2="' + pb[0].toFixed(1) + '" y2="' + pb[1].toFixed(1) +
                 '" stroke="' + C.shellEdge + '" stroke-width="1"/>';
      var pil = [];
      for (var pt = w[0] + 8; pt < w[1] - 6; pt += 14) {
        var g1 = fp(pt, 0.6);
        var v1 = project(g1[0], g1[1], 14), v2 = project(g1[0], g1[1], 56);
        pil.push('<line x1="' + v1[0].toFixed(1) + '" y1="' + v1[1].toFixed(1) +
                 '" x2="' + v2[0].toFixed(1) + '" y2="' + v2[1].toFixed(1) +
                 '" stroke="' + C.shellEdge + '" stroke-width="0.8" opacity="0.7"/>');
      }
      push(line + pil.join(""));
    });
    return out;
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
    vYaw = yaw + FRONT_TURN * (1 - openT);
    vPitch = Math.max(0.4, pitch + FRONT_DIP * (1 - openT));
    var gap = GAP * openT;
    function zOf(r) { return r.f === 2 ? (exploded ? WALL + gap : WALL) : 0; }
    var shellH = EXT_H + (WALL - EXT_H) * openT;

    var items = [];
    var svg = ['<svg viewBox="0 0 940 660" data-met3d="1" xmlns="http://www.w3.org/2000/svg" role="img" ' +
      'aria-label="The Metropolitan Museum of Art as a turnable model: the real building ' +
      'outline, and inside it both gallery floors, their corridors drawn as footprints.">'];

    /* the shadow the building throws, then the ground it stands on */
    svg.push('<g transform="translate(-15,11)">' +
             shellRing(0, C.ink, "0.07", "none", 0) + "</g>");
    svg.push(shellRing(0, C.ground, null, C.shellEdge, 1));

    /* the outer wall, and closed, its roof */
    items.push({ svg: shellSolid(0, shellH), depth: -1e8, floor: 1 });
    if (openT < 0.99) {
      items.push({ svg: '<g opacity="' + (1 - openT).toFixed(2) + '">' + roof(shellH) + "</g>",
                   depth: 1e8, floor: 3 });
      facade(1 - openT).forEach(function (it) { items.push(it); });
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
      b.floor = 1; b.room = k;
      if (openT < 0.98) b.svg = '<g opacity="' + openT.toFixed(2) + '">' + b.svg + "</g>";
      /* A room that has an interior drawn for it opens as you dive in: the
         solid gallery block fades back to a footprint so what is inside can
         be seen. Without this the box simply hides its own contents. It never
         goes fully invisible, because the block is also the click target and
         the thing that says where the room ends. */
      var hasIn = window.MET_ROOMS && window.MET_ROOMS[k];
      if (hasIn && focusKey === k && focusT > 0.02) {
        /* Nearly out, not merely dimmed. At 14 percent the gallery block was
           still a solid box drawn around the interior, and its NEAR walls sat
           between the viewer and the temple: a veil over the one thing the
           dive exists to show. It cannot go fully invisible because this
           element carries the click target, so it stays as the faintest
           footprint and the interior does the drawing. */
        b.svg = '<g opacity="' + (1 - 0.97 * focusT).toFixed(2) + '">' + b.svg + "</g>";
      }
      items.push(b);
      if (b.labelSvg) {
        var lb1 = openT < 0.98 ? '<g opacity="' + openT.toFixed(2) + '">' + b.labelSvg + "</g>" : b.labelSvg;
        items.push({ svg: lb1, depth: 2e7, floor: 1, room: k, lbl: true });
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
      items.push({ svg: '<g transform="translate(-9,7)" opacity="' + (0.06 * openT).toFixed(3) +
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
        b.floor = 2; b.room = k;
        if (openT < 0.98) b.svg = '<g opacity="' + openT.toFixed(2) + '">' + b.svg + "</g>";
        items.push(b);
        if (b.labelSvg) {
          var lb2 = openT < 0.98 ? '<g opacity="' + openT.toFixed(2) + '">' + b.labelSvg + "</g>" : b.labelSvg;
          items.push({ svg: lb2, depth: 2e7, floor: 2, room: k, lbl: true });
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

    /* THE INSIDE OF ONE ROOM, when that room has one drawn.
       The floor plan knows a gallery is a box, which is honest for a room of
       vitrines and a lie for Gallery 131, which was built around a single
       object with a pool for the Nile and a raked wall for the cliffs. A room
       registers its interior in met-rooms.js; a room without one keeps the
       plain box and loses nothing. The host lends its own projection and
       shading so the interior sits in the same space and light as the
       building around it. */
    if (focusKey && openT > 0.02 && focusT > 0.02 && R[focusKey] &&
        window.MET_ROOMS && window.MET_ROOMS[focusKey]) {
      var ir = R[focusKey];
      try {
        var inside = window.MET_ROOMS[focusKey]({
          project: project, poly: poly, shade: shade, faceVisible: faceVisible,
          room: { x: ir.x * KX, y: ir.y, w: ir.w * KX, h: ir.h, f: ir.f },
          zBase: (ir.f === 2 ? (exploded ? WALL + gap : WALL) : 0),
          wall: WALL,          /* one storey, so nothing is drawn through a ceiling */
          key: focusKey,
          C: C
        }) || [];
        /* The interior is a CLICK TARGET, carrying its own room key.
           [SEAN "click it to take off so the map wont be locked somehow it
           lock the map".] Without this the model was only shapes lying over
           the room: whether a tap escaped depended on whether it happened to
           miss them and reach the box underneath, which is a coin toss and
           feels like a lock. Now a tap on the temple is a tap on the room,
           and a tap on the room you are already in is the way out. */
        inside.forEach(function (it) {
          items.push({ svg: '<g opacity="' + focusT.toFixed(2) + '" data-room="' +
                            esc(focusKey) + '">' + it.svg + "</g>",
                       depth: it.depth, floor: ir.f, room: focusKey });
        });
      } catch (e) {
        /* An interior is decoration. If one throws, the room falls back to
           the plain box rather than taking the whole sheet down with it. */
        if (window.console) console.warn("room interior failed:", focusKey, e);
      }
    }

    /* The room overview: the focused gallery's highlight works stand on its
       roof as numbered stops, in walking order. Their positions along the
       room are spacing, not surveying; the caption below says so, because
       this sheet never pretends to know more than it does.

       NOT when the room has an interior drawn. [SEAN: "its still blocking
       view more like those 123 and words maybe take them off".] These numbers
       and their labels earned their place when a focused room was an empty
       box and they were the only thing in it. Over a model of the actual
       gallery they are furniture standing in front of the exhibit: four
       circles and four lines of text floating across the temple you dived in
       to see. The highlights are not lost, they are in the room bar and the
       guide beside the drawing, which is where a list belongs. */
    if (focusKey && openT > 0.02 && focusT > 0.02 && R[focusKey] &&
        !(window.MET_ROOMS && window.MET_ROOMS[focusKey])) {
      var fr = R[focusKey];
      var fCards = window.MET_CARDS || {};
      var hl = ((fCards[focusKey] || {}).highlights || []).slice(0, 4);
      if (hl.length) {
        var fzTop = (fr.f === 2 ? (exploded ? WALL + gap : WALL) : 0) + WALL + 0.5;
        var fx1 = fr.x * KX, fx2 = (fr.x + fr.w) * KX, fy1 = fr.y, fy2 = fr.y + fr.h;
        var horiz = (fx2 - fx1) >= (fy2 - fy1);
        var sp = [], spDepth = -1e9;
        for (var si = 0; si < hl.length; si++) {
          var ft = (si + 1) / (hl.length + 1);
          var sxp = horiz ? fx1 + (fx2 - fx1) * ft : (fx1 + fx2) / 2;
          var syp = horiz ? (fy1 + fy2) / 2 : fy1 + (fy2 - fy1) * ft;
          var pp = project(sxp, syp, fzTop);
          spDepth = Math.max(spDepth, pp[2]);
          sp.push('<circle cx="' + pp[0].toFixed(1) + '" cy="' + pp[1].toFixed(1) +
                  '" r="9" fill="' + C.navy + '" stroke="#faf8f4" stroke-width="1.6"/>');
          sp.push('<text class="m3-stopnum" x="' + pp[0].toFixed(1) + '" y="' +
                  (pp[1] + 3.5).toFixed(1) + '" text-anchor="middle">' + (si + 1) + "</text>");
          var wk = hl[si].work || "";
          if (wk.length > 26) wk = wk.slice(0, 25) + "…";
          sp.push('<text class="m3-stoplbl" x="' + (pp[0] + 15).toFixed(1) + '" y="' +
                  (pp[1] + 4).toFixed(1) + '" text-anchor="start">' + esc(wk) + "</text>");
        }
        items.push({ svg: '<g opacity="' + focusT.toFixed(2) + '">' + sp.join("") + "</g>",
                     depth: 2.6e7, floor: fr.f, room: focusKey });
      }
    }

    items.sort(function (a, b) {
      var fa = a.floor || 1, fb = b.floor || 1;
      if (fa !== fb) return fa - fb;
      return a.depth - b.depth;
    });
    /* When one room is held close, everything that is not it steps back:
       the same building, remembered rather than shouted. */
    var dim = (focusKey && focusT > 0.02) ? (1 - 0.8 * focusT) : 1;
    items.forEach(function (it) {
      if (dim < 1 && it.lbl) {
        /* EVERY room's name steps aside when one room is held close, not just
           the focused one. The focused room's name always faded, but the
           neighbours' names only dimmed to a fifth, and at this zoom a fifth
           is still legible text lying across the model. Inside one gallery
           you do not need the next gallery's name; the caption below and the
           room bar carry where you are. */
        var lo = (1 - focusT) * (it.room === focusKey ? 1 : dim);
        svg.push('<g opacity="' + lo.toFixed(2) + '">' + it.svg + "</g>");
      } else if (dim < 1 && it.room !== focusKey) {
        svg.push('<g opacity="' + dim.toFixed(2) + '">' + it.svg + "</g>");
      } else {
        svg.push(it.svg);
      }
    });

    /* the closed caption is appended in screen space after the fit, so it
       holds still while the building turns beneath it */
    var closedCaption = openT < 0.5;
    if (closedCaption) BB[3] += 44;   /* leave it room under the model */
    if (openT > 0.5) {
      var l1 = project(CX, 620, 0)[1], l2 = project(CX, 620, WALL + gap)[1];
      var lx = BB[0] - 96;
      var flo = focusT > 0.02 ? ' opacity="' + (1 - focusT).toFixed(2) + '"' : "";
      svg.push('<text class="m3-floorlbl"' + flo + ' x="' + lx.toFixed(0) + '" y="' + l1.toFixed(0) +
               '">FLOOR 1</text>');
      if (exploded) svg.push('<text class="m3-floorlbl"' + flo + ' x="' + lx.toFixed(0) + '" y="' +
               l2.toFixed(0) + '">FLOOR 2</text>');
      BB[0] = lx - 8;
    }

    var w = Math.max(1, BB[2] - BB[0]), h = Math.max(1, BB[3] - BB[1]);
    var VW = 940, VH = 660, PAD = 26;
    var k = Math.min((VW - PAD * 2) / w, (VH - PAD * 2) / h);
    var tx = (VW - w * k) / 2 - BB[0] * k, ty = (VH - h * k) / 2 - BB[1] * k;

    /* Closed, the camera stands on Fifth Avenue: the fit is blended toward
       the front itself, and the eleven acres behind recede out of frame the
       way a building does when you are standing before its door. Opening
       hands the frame back to the whole plan. */
    if (openT < 0.999) {
      var fb = [1e9, 1e9, -1e9, -1e9];
      [[-8, -6], [FR.L + 8, -6], [-8, 46], [FR.L + 8, 46]].forEach(function (td) {
        [0, 132].forEach(function (zz) {
          var q3 = fp(td[0], td[1]);
          var p3 = projRaw(q3[0], q3[1], zz);
          if (p3[0] < fb[0]) fb[0] = p3[0];
          if (p3[1] < fb[1]) fb[1] = p3[1];
          if (p3[0] > fb[2]) fb[2] = p3[0];
          if (p3[1] > fb[3]) fb[3] = p3[1];
        });
      });
      fb[0] -= 12; fb[1] -= 10; fb[2] += 12; fb[3] += 40;   /* caption ground */
      var wf = fb[2] - fb[0], hf = fb[3] - fb[1];
      var kf = Math.min((VW - PAD * 2) / wf, (VH - PAD * 2) / hf);
      var txf = (VW - wf * kf) / 2 - fb[0] * kf, tyf = (VH - hf * kf) / 2 - fb[1] * kf;
      var fBlend = 1 - openT;
      k = k + (kf - k) * fBlend;
      tx = tx + (txf - tx) * fBlend;
      ty = ty + (tyf - ty) * fBlend;
    }

    /* The dive: the frame the camera fits is blended from the whole
       building's bounding box toward the focused room's, so the zoom is the
       same autofit the drawing has always used, aimed at less of it. */
    if (focusKey && focusT > 0.001 && R[focusKey]) {
      var zr = R[focusKey];
      var zb = zr.f === 2 ? (exploded ? WALL + GAP * openT : WALL) : 0;
      var rb = [1e9, 1e9, -1e9, -1e9];
      [[zr.x * KX, zr.y], [(zr.x + zr.w) * KX, zr.y],
       [(zr.x + zr.w) * KX, zr.y + zr.h], [zr.x * KX, zr.y + zr.h]].forEach(function (c2) {
        [zb, zb + WALL].forEach(function (zz) {
          var p2 = projRaw(c2[0], c2[1], zz);
          if (p2[0] < rb[0]) rb[0] = p2[0];
          if (p2[1] < rb[1]) rb[1] = p2[1];
          if (p2[0] > rb[2]) rb[2] = p2[0];
          if (p2[1] > rb[3]) rb[3] = p2[1];
        });
      });
      rb[0] -= 52; rb[1] -= 56; rb[2] += 185; rb[3] += 64;  /* labels hang right of the discs */
      var w2 = rb[2] - rb[0], h2 = rb[3] - rb[1];
      var k2 = Math.min((VW - PAD * 2) / w2, (VH - PAD * 2) / h2);
      k2 = Math.min(k2, k * 3.4);                            /* a dive, not a microscope */
      var tx2 = (VW - w2 * k2) / 2 - rb[0] * k2, ty2 = (VH - h2 * k2) / 2 - rb[1] * k2;
      k = k + (k2 - k) * focusT;
      tx = tx + (tx2 - tx) * focusT;
      ty = ty + (ty2 - ty) * focusT;
    }

    var body = svg.slice(1).join("");
    var out = svg[0] + '<g transform="translate(' + tx.toFixed(1) + "," + ty.toFixed(1) +
           ") scale(" + k.toFixed(4) + ')">' + body + "</g>";
    if (closedCaption) {
      var capO2 = (1 - openT * 2).toFixed(2);
      out += '<text class="m3-title" x="470" y="620" text-anchor="middle" opacity="' + capO2 +
             '">The Metropolitan Museum of Art</text>' +
             '<text class="m3-sub2" x="470" y="641" text-anchor="middle" opacity="' + capO2 +
             '">Eleven and a half acres. Tap the building to go inside.</text>';
    }
    /* the focused room's caption lives in screen space, steady under the dive */
    if (focusKey && focusT > 0.5) {
      var capC = (window.MET_CARDS || {})[focusKey] || {};
      var capN = capC.name || focusKey.replace(/-/g, " ");
      if (capC.minutes) capN += " · " + capC.minutes + " min";
      var capO = ((focusT - 0.5) * 2).toFixed(2);
      out += '<text class="m3-title" x="470" y="620" text-anchor="middle" opacity="' + capO +
             '">' + esc(capN) + "</text>" +
             '<text class="m3-sub2" x="470" y="641" text-anchor="middle" opacity="' + capO +
             '">stops in walking order · positions approximate</text>';
    }
    return out + "</svg>";
  }

  /* ---- public ---- */
  function render(host, opts) { host.innerHTML = build(opts); }

  /* Announce the layer from the ANIMATION, not from the tap that started it.
     [SEAN "once hit view on 3D could come out, maybe need a go back key".]
     The way out was wired to the click handler, so it appeared only if you
     entered by tapping the building. Any other path in, and the page had the
     interior open with the exit still hidden: no way back, which is exactly
     what being stuck is. A door should not depend on which way you came in. */
  function announceLayer(host) {
    try {
      host.dispatchEvent(new CustomEvent("met3d:layer",
        { detail: { layer: openT > 0.5 ? "interior" : "exterior" }, bubbles: true }));
    } catch (e) {}
  }

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
      else {
        anim = null; openT = target; render(host, opts);
        announceLayer(host);
        if (done) done();
      }
    }
    anim = requestAnimationFrame(frame);
  }

  function animateFocus(target, host, opts, done) {
    if (animF) { cancelAnimationFrame(animF); animF = null; }
    var from = focusT, t0 = null, dur = 560;
    function frame(ts) {
      if (t0 === null) t0 = ts;
      var k = Math.min(1, (ts - t0) / dur);
      var e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      focusT = from + (target - from) * e;
      render(host, opts);
      if (k < 1) animF = requestAnimationFrame(frame);
      else { animF = null; focusT = target; render(host, opts); if (done) done(); }
    }
    animF = requestAnimationFrame(frame);
  }

  /* Which rooms the camera will not dive into: the stairs are plumbing. */
  function focusable(k) {
    return k && k !== "grand-stair" && k !== "grand-stair-2";
  }

  function attach(host, opts) {
    render(host, opts);
    if (host.__met3dBound) return;
    host.__met3dBound = true;
    var startX = null, startY = null, y0 = yaw, p0 = pitch, moved = false;

    /* Open, a tap is navigation: a room pulls the camera down into its
       overview, a second tap (or empty ground) lets the building back in.
       The walk itself is edited from the room bar or the flat sheets, so
       looking closer never accidentally rewrites the plan. */
    function roomTap(k, e) {
      e.stopPropagation();
      if (focusable(k) && k !== focusKey) {
        focusKey = k;
        animateFocus(1, host, opts);
        host.dispatchEvent(new CustomEvent("met3d:room",
          { detail: { room: k, focused: true }, bubbles: true }));
      } else if (focusKey) {
        var was = focusKey;
        animateFocus(0, host, opts, function () { focusKey = null; render(host, opts); });
        host.dispatchEvent(new CustomEvent("met3d:room",
          { detail: { room: was, focused: false }, bubbles: true }));
      }
    }

    host.addEventListener("click", function (e) {
      /* The host also carries the flat floor sheets; this layer only owns
         clicks that land on its own drawing, or the flat sheets' room
         picking would be swallowed by a model that is not on screen. */
      if (!(e.target && e.target.closest && e.target.closest('svg[data-met3d]'))) return;
      if (moved) { e.stopPropagation(); moved = false; return; }
      if (openT < 0.5) {
        e.stopPropagation();
        animateTo(1, host, opts);
        host.dispatchEvent(new CustomEvent("met3d:layer",
          { detail: { layer: "interior" }, bubbles: true }));
        return;
      }
      var g = e.target && e.target.closest ? e.target.closest("[data-room]") : null;
      roomTap(g ? g.getAttribute("data-room") : null, e);
    }, true);
    /* Escape is the guaranteed way out. A drawing can always end up with
       something unexpected on top; a key cannot be covered. */
    host.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !focusKey && openT > 0.5) {
        /* one level at a time: a room first, then the building */
        e.preventDefault();
        animateTo(0, host, opts);
        return;
      }
      if (e.key === "Escape" && focusKey) {
        var wasK = focusKey;
        e.preventDefault();
        animateFocus(0, host, opts, function () { focusKey = null; render(host, opts); });
        host.dispatchEvent(new CustomEvent("met3d:room",
          { detail: { room: wasK, focused: false }, bubbles: true }));
        return;
      }
      if (e.key !== "Enter" && e.key !== " ") return;
      if (!(e.target && e.target.closest && e.target.closest('svg[data-met3d]'))) return;
      var g = e.target.closest("[data-room]");
      if (!g) return;
      e.preventDefault();
      if (openT < 0.5) {
        animateTo(1, host, opts);
        host.dispatchEvent(new CustomEvent("met3d:layer",
          { detail: { layer: "interior" }, bubbles: true }));
        return;
      }
      roomTap(g.getAttribute("data-room"), e);
    });
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
    closeToExterior: function (host, opts, done) {
      if (animF) { cancelAnimationFrame(animF); animF = null; }
      focusKey = null; focusT = 0;                 /* leaving the building leaves the room */
      animateTo(0, host, opts, done);
    },
    isOpen: function () { return openT > 0.5; },
    focusRoom: function (host, opts, key, done) {
      if (!focusable(key) || !rooms() || !rooms()[key]) { if (done) done(); return; }
      focusKey = key;
      animateFocus(1, host, opts, done);
    },
    clearFocus: function (host, opts, done) {
      if (!focusKey) { if (done) done(); return; }
      animateFocus(0, host, opts, function () { focusKey = null; render(host, opts); if (done) done(); });
    },
    focusedRoom: function () { return focusKey; },
    setExploded: function (v) { exploded = !!v; },
    isExploded: function () { return exploded; },
    reset: function () { yaw = -0.62; pitch = 0.70; }
  };
})();
