/* The Met as a solid: a real building, extruded, that you can turn in your hand.
 *
 * WHAT WAS WRONG BEFORE. The old "3D" was the two flat floor sheets under a
 * CSS rotateX. Tilting a drawing is not a third dimension: the galleries had
 * no height, no walls, and no volume, so the view answered nothing the flat
 * sheet had not already answered. This draws actual solids and projects them
 * itself, which is why it can be turned, shaded, and stacked.
 *
 * WHAT IS TRUE HERE, AND WHAT IS A CLAIM.
 *   TRUE: the outer wall. It is the Met's real footprint, 74 points, taken
 *   from OpenStreetMap relation 3698894 (building=museum), 291 by 337 metres,
 *   46,192 square metres, eleven and a half acres. Every proportion of the
 *   shell you see is the building's own.
 *   A CLAIM: the galleries inside. The Met has no indoor mapping in OSM
 *   (checked 2026-08-14: forty-six outlines nearby, not one room) and the
 *   museum's own plan is copyrighted, so the interior is OUR schematic of
 *   which wing sits where, extruded. It is arrangement, not survey, and the
 *   page says so out loud.
 *
 * The honest part: a corridor somebody has actually walked with the recorder
 * is drawn solid, one nobody has walked is dashed. The drawing shows its own
 * evidence and fills in as footprints arrive.
 *
 * No library, because a traveller in a museum lobby should not download a 3D
 * engine to see a shape. The projection is a dozen lines of arithmetic.
 */
(function () {
  'use strict';

  /* The Met's real outer wall, normalised into the schematic's coordinate
     box but keeping the building's true proportions (484 x 560 for 291 x
     337 metres). Source: OpenStreetMap contributors, relation 3698894. */
  var SHELL = "310.4,46.7;314.3,39.7;316.2,36.4;320.5,28.6;328.3,32.9;330,33.9;331.6,34.8;337.2,37.8;389.5,66.8;418.9,83;420.6,84;421.5,84.5;467.7,110;469.5,111;483.9,119;431.9,212.3;414.8,202.9;383.3,259.6;368,287.1;372.6,289.7;349.6,330.9;323.7,377.8;319,375.1;303.5,403.1;285.5,435.3;272.6,458.7;289.7,468.2;271.1,501.7;251.7,536.4;238.6,560;222.4,551;183.4,529.5;176.7,525.8;173.1,523.8;169.5,521.8;92.9,479.5;87.8,476.7;84.6,474.9;80.1,472.5;72.2,468;76.8,459.5;78.5,456.6;80.7,452.9;0,408.5;42.7,331.8;67.4,345.4;74.6,349.3;88.3,324.7;101.3,301.4;110.5,284.7;131.4,247;130.7,244.3;125.4,241.4;119,243.1;111,257.6;95.9,249.2;80.8,196.3;89.6,180.4;142.7,165.1;157.8,173.5;149.8,188;151.6,194.2;156.9,197.2;159.6,196.3;188,145.3;189.7,142.3;203.7,117;216,94.8;183.1,76.6;186.1,71.1;218.2,13.5;225.7,0;291.4,36.3;310.4,46.7".split(";").map(function (p) {
    var a = p.split(",");
    return [parseFloat(a[0]), parseFloat(a[1])];
  });

  var SCHEMATIC_W = 760, SHELL_W = 484;   /* rooms were drawn in a wider box */
  var KX = SHELL_W / SCHEMATIC_W;

  var WALL = 26;          /* a storey, in the same units as the plan */
  var GAP = 320;          /* how far floor 2 is lifted when exploded */
  var LIGHT = [-0.55, -0.42, 0.72];

  var yaw = -0.62, pitch = 0.95, exploded = true;

  function rooms() {
    var G = window.MET_GEOMETRY;
    return (G && G.ROOMS) || null;
  }
  function edges() {
    var G = window.MET_GEOMETRY;
    return (G && G.EDGES) || [];
  }

  /* ---- projection ---------------------------------------------------- */
  var CX = SHELL_W / 2, CY = 560 / 2, OX = 470, OY = 430, SC = 0.80;

  /* Every projected point widens the frame, so the drawing is fitted to the
     sheet AFTER it is built rather than by guessing constants that only hold
     at one angle. Turning the building used to push it off the edge. */
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
    return [sx, sy, ry];                      /* third value = depth */
  }

  function faceVisible(nx, ny) {
    return (nx * Math.sin(yaw) + ny * Math.cos(yaw)) > 0.001;
  }

  function shade(hex, nx, ny, nz) {
    var d = nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2];
    var f = 0.62 + 0.38 * Math.max(0, d);
    var n = parseInt(hex.slice(1), 16);
    var r = Math.min(255, Math.round(((n >> 16) & 255) * f));
    var g = Math.min(255, Math.round(((n >> 8) & 255) * f));
    var b = Math.min(255, Math.round((n & 255) * f));
    return "rgb(" + r + "," + g + "," + b + ")";
  }

  function poly(points, fill, stroke, sw, extra) {
    return '<polygon points="' + points.map(function (p) {
      return p[0].toFixed(1) + "," + p[1].toFixed(1);
    }).join(" ") + '" fill="' + fill + '" stroke="' + (stroke || "none") +
      '" stroke-width="' + (sw || 0) + '"' + (extra || "") + "/>";
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[<>&"']/g, function (c) {
      return { "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---- one box, as a solid ------------------------------------------- */
  function box(x1, y1, x2, y2, zBase, h, colour, opts) {
    var o = opts || {}, zTop = zBase + h, parts = [], depth = -1e9;
    var corners = [[x1, y1], [x2, y1], [x2, y2], [x1, y2]];
    var normals = [[0, -1], [1, 0], [0, 1], [-1, 0]];

    for (var i = 0; i < 4; i++) {
      var a = corners[i], b = corners[(i + 1) % 4], n = normals[i];
      if (!faceVisible(n[0], n[1])) continue;
      var pa = project(a[0], a[1], zTop), pb = project(b[0], b[1], zTop),
          pc = project(b[0], b[1], zBase), pd = project(a[0], a[1], zBase);
      depth = Math.max(depth, (pa[2] + pb[2]) / 2);
      parts.push(poly([pa, pb, pc, pd], shade(colour, n[0], n[1], 0),
                      o.edge || "rgba(31,58,95,.35)", 0.8));
    }
    var t = corners.map(function (p) { return project(p[0], p[1], zTop); });
    depth = Math.max(depth, Math.max(t[0][2], t[1][2], t[2][2], t[3][2]));
    parts.push(poly(t, shade(colour, 0, 0, 1), o.edge || "rgba(31,58,95,.45)", 1));

    if (o.label) {
      var cx = (t[0][0] + t[2][0]) / 2, cy = (t[0][1] + t[2][1]) / 2;
      parts.push('<text class="m3-lbl" x="' + cx.toFixed(1) + '" y="' + (cy + 3).toFixed(1) +
                 '" text-anchor="middle">' + esc(o.label) + "</text>");
      if (o.sub) {
        parts.push('<text class="m3-sub" x="' + cx.toFixed(1) + '" y="' + (cy + 15).toFixed(1) +
                   '" text-anchor="middle">' + esc(o.sub) + "</text>");
      }
    }
    var inner = parts.join("");
    if (o.room) {
      inner = '<g class="m3-room" data-room="' + esc(o.room) + '" tabindex="0" role="button" ' +
              'aria-label="' + esc(o.label || o.room) + '">' + inner + "</g>";
    }
    return { svg: inner, depth: depth };
  }

  /* ---- the real outer wall ------------------------------------------- */
  function shellSolid(zBase, h) {
    var parts = [], zTop = zBase + h;
    for (var i = 0; i < SHELL.length; i++) {
      var a = SHELL[i], b = SHELL[(i + 1) % SHELL.length];
      var ex = b[0] - a[0], ey = b[1] - a[1];
      var len = Math.hypot(ex, ey) || 1;
      var nx = ey / len, ny = -ex / len;             /* outward normal */
      if (!faceVisible(nx, ny)) continue;
      var pa = project(a[0], a[1], zTop), pb = project(b[0], b[1], zTop),
          pc = project(b[0], b[1], zBase), pd = project(a[0], a[1], zBase);
      parts.push(poly([pa, pb, pc, pd], shade("#d9d2c4", nx, ny, 0),
                      "rgba(31,58,95,.30)", 0.7));
    }
    return parts.join("");
  }

  function shellFloor(z, fill, op) {
    var ring = SHELL.map(function (p) { return project(p[0], p[1], z); });
    return poly(ring, fill, "rgba(31,58,95,.45)", 1.2,
                op ? ' opacity="' + op + '"' : "");
  }

  /* ---- corridors ------------------------------------------------------ */
  function centreOf(r, z) {
    return project((r.x + r.w / 2) * KX, r.y + r.h / 2, z);
  }

  function corridorSvg(a, b, R, zOf, walked, lit) {
    var ra = R[a], rb = R[b];
    if (!ra || !rb) return null;
    var p = centreOf(ra, zOf(ra) + WALL + 1), q = centreOf(rb, zOf(rb) + WALL + 1);
    var stroke = lit ? "#1f3a5f" : (walked ? "#7a7365" : "#a9a294");
    var w = lit ? 4 : (walked ? 2.4 : 1.6);
    return {
      svg: '<line x1="' + p[0].toFixed(1) + '" y1="' + p[1].toFixed(1) +
           '" x2="' + q[0].toFixed(1) + '" y2="' + q[1].toFixed(1) +
           '" stroke="' + stroke + '" stroke-width="' + w + '" stroke-linecap="round"' +
           (walked ? "" : ' stroke-dasharray="6 6"') + "/>",
      depth: Math.max(p[2], q[2])
    };
  }

  /* ---- draw ----------------------------------------------------------- */
  function build(opts) {
    var R = rooms();
    if (!R) return "";
    var o = opts || {}, route = o.route || [], walked = o.walked || {};
    var onRoute = {}, pairs = {};
    route.forEach(function (k) { onRoute[k] = true; });
    for (var i = 1; i < route.length; i++) {
      pairs["met-" + [route[i - 1], route[i]].sort().join("--")] = true;
    }
    function zOf(r) { return r.f === 2 ? (exploded ? WALL + GAP : WALL) : 0; }

    BB = [1e9, 1e9, -1e9, -1e9];
    var items = [];        /* each carries its storey, see the sort below */
    var svg = ['<svg viewBox="0 0 940 660" xmlns="http://www.w3.org/2000/svg" role="img" ' +
      'aria-label="The Metropolitan Museum of Art as a three-dimensional solid: the real ' +
      'building outline with both gallery floors inside, turnable.">'];

    /* ground: the true footprint */
    svg.push(shellFloor(0, "#efece3"));
    svg.push(shellSolid(0, 3));

    /* floor 1 shell wall, low, so the galleries read as being inside it */
    items.push({ svg: shellSolid(0, WALL) + shellFloor(WALL, "rgba(233,229,219,.30)", "0.5"),
                 depth: -1e8, floor: 1 });

    Object.keys(R).forEach(function (k) {
      var r = R[k];
      var b = box(r.x * KX, r.y, (r.x + r.w) * KX, r.y + r.h, zOf(r), WALL,
                  onRoute[k] ? "#a9c4e6" : (r.f === 2 ? "#f2ece0" : "#e6dfd0"),
                  { label: labelFor(k), sub: r.sub, room: k });
      b.floor = r.f;
      items.push(b);
    });

    if (exploded) {
      /* the slab floor 2 stands on, so the upper storey has ground of its own */
      items.push({ svg: shellFloor(WALL + GAP, "#e9e4d9", "0.62") +
                        shellSolid(WALL + GAP, 4), depth: -1e8, floor: 2 });
    }

    edges().forEach(function (e) {
      var key = "met-" + [e[0], e[1]].sort().join("--");
      var c = corridorSvg(e[0], e[1], R, zOf, !!walked[key], !!pairs[key]);
      if (c) {
        var fa = R[e[0]].f, fb = R[e[1]].f;
        c.floor = (fa === fb) ? fa : 3;      /* the stair belongs above both */
        items.push(c);
      }
    });

    /* storey first, depth second: floor 1 is finished before floor 2 begins,
       and the stair that joins them is laid over the top of both. */
    items.sort(function (a, b) {
      var fa = a.floor || 1, fb = b.floor || 1;
      if (fa !== fb) return fa - fb;
      return a.depth - b.depth;
    });
    items.forEach(function (it) { svg.push(it.svg); });

    var lblY1 = project(CX, 620, 0)[1], lblY2 = project(CX, 620, WALL + GAP)[1];
    var labelX = BB[0] - 96;
    svg.push('<text class="m3-floorlbl" x="' + labelX.toFixed(0) + '" y="' +
             lblY1.toFixed(0) + '">FLOOR 1</text>');
    if (exploded) {
      svg.push('<text class="m3-floorlbl" x="' + labelX.toFixed(0) + '" y="' +
               lblY2.toFixed(0) + '">FLOOR 2</text>');
    }
    BB[0] = labelX - 8;               /* the labels are part of the picture */

    /* Fit what was actually drawn to the sheet. Constants tuned at one angle
       break at every other angle, and this view turns. */
    var w = Math.max(1, BB[2] - BB[0]), h = Math.max(1, BB[3] - BB[1]);
    var VW = 940, VH = 660, PAD = 26;
    var k = Math.min((VW - PAD * 2) / w, (VH - PAD * 2) / h);
    var tx = (VW - w * k) / 2 - BB[0] * k, ty = (VH - h * k) / 2 - BB[1] * k;
    var body = svg.slice(1).join("");
    return svg[0] + '<g transform="translate(' + tx.toFixed(1) + "," + ty.toFixed(1) +
           ") scale(" + k.toFixed(4) + ')">' + body + "</g></svg>";
  }

  function labelFor(key) {
    var cards = window.MET_CARDS || {};
    var c = cards[key];
    var name = (c && (c.short || c.name)) || key.replace(/-/g, " ");
    return name.length > 20 ? name.slice(0, 19) + "\u2026" : name;
  }

  /* ---- public --------------------------------------------------------- */
  function render(host, opts) {
    host.innerHTML = build(opts);
  }

  function attach(host, opts) {
    render(host, opts);
    if (host.__met3dBound) return;      /* draw() runs often; bind once */
    host.__met3dBound = true;
    var startX = null, startY = null, y0 = yaw, p0 = pitch, moved = false;
    /* a drag that ends over a gallery must not also count as picking it */
    host.addEventListener("click", function (e) {
      if (moved) { e.stopPropagation(); moved = false; }
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
    setExploded: function (v) { exploded = !!v; },
    isExploded: function () { return exploded; },
    reset: function () { yaw = -0.62; pitch = 0.95; }
  };
})();
