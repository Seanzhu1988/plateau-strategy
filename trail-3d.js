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

  var SCENES = { "bunker-hill": bunkerHill };

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
