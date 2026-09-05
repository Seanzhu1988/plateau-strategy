/* scene-mount.js
 *
 * One live mount for every hand-rolled scene on this site: give it a host
 * element and a scene FUNCTION, and it draws, fits, shades and turns.
 *
 * The scene contract, the same one render_room.js uses on the server, so a
 * model looks identical in a browser and in a PNG:
 *
 *     scene(ctx) -> [ { svg, depth }, ... ]
 *     ctx.project(x, y, z) -> [px, py, ry]
 *     ctx.poly(pts, fill, stroke, strokeWidth, extra) -> svg string
 *     ctx.shade(hex, nx, ny, nz) -> rgb string
 *     ctx.faceVisible(nx, ny) -> bool
 *
 * Items are painted in ascending depth, which is why every scene must hand
 * back an honest depth: a large flat slab's nearest corner sits further away
 * than the nearest corner of the smaller things standing on it, so without an
 * explicit depth the slab paints last and swallows them. That trap has been
 * met eight times in this project.
 *
 * trail-3d.js still carries its own copy of this loop. It is live and working,
 * so it was not refactored in the same pass that introduced this file; the two
 * should converge once this one has run for a while.
 */
(function () {
  "use strict";

  function mountScene(host, scene, opts) {
    if (!host || typeof scene !== "function") return null;
    var o = opts || {};
    var W = o.width || 820, H = o.height || 560;
    var yaw = o.yaw == null ? -0.62 : o.yaw;
    var pitch = o.pitch == null ? 0.30 : o.pitch;
    var bg = o.background || "#eef0ea";
    var LIGHT = [0.60, 0.30, 0.68];
    var idle = o.spin === false ? false : true;
    var raf = null, dead = false;

    function shade(hex, nx, ny, nz) {
      var d = nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2];
      var f = 0.55 + 0.45 * Math.max(0, d);
      var n = parseInt(hex.slice(1), 16);
      return "rgb(" + Math.min(255, Math.round(((n >> 16) & 255) * f)) + "," +
             Math.min(255, Math.round(((n >> 8) & 255) * f)) + "," +
             Math.min(255, Math.round((n & 255) * f)) + ")";
    }
    function faceVisible(nx, ny) {
      return (nx * Math.sin(yaw) + ny * Math.cos(yaw)) > 0.001;
    }
    function projector(SC, OX, OY) {
      return function (x, y, z) {
        var c = Math.cos(yaw), s = Math.sin(yaw);
        var rx = x * c - y * s, ry = x * s + y * c;
        return [OX + rx * SC, OY + (ry * Math.sin(pitch) - (z || 0) * Math.cos(pitch)) * SC, ry];
      };
    }

    function draw() {
      if (dead) return;
      /* Pass one measures the drawing at unit scale so the fit is the model's
         own, not a guess. Nothing is emitted; poly only records corners. */
      var BB = null;
      var measure = function (pts) {
        for (var i = 0; i < pts.length; i++) {
          var p = pts[i];
          if (!BB) BB = [p[0], p[1], p[0], p[1]];
          if (p[0] < BB[0]) BB[0] = p[0];
          if (p[1] < BB[1]) BB[1] = p[1];
          if (p[0] > BB[2]) BB[2] = p[0];
          if (p[1] > BB[3]) BB[3] = p[1];
        }
        return "";
      };
      try {
        scene({ project: projector(1, 0, 0), poly: measure, shade: shade, faceVisible: faceVisible });
      } catch (e) { BB = null; }
      /* Returning here used to leave whatever was drawn last still on screen,
         so a scene that threw showed the PREVIOUS model under the new one's
         name. An empty frame is honest; the wrong building is not. */
      if (!BB || !(BB[2] > BB[0]) || !(BB[3] > BB[1])) { host.innerHTML = ""; return; }

      var pad = o.pad == null ? 50 : o.pad;
      var bw = BB[2] - BB[0], bh = BB[3] - BB[1];
      var SC = Math.min((W - pad) / bw, (H - pad) / bh);
      var OX = (W - bw * SC) / 2 - BB[0] * SC;
      var OY = (H - bh * SC) / 2 - BB[1] * SC;

      var poly = function (pts, f, st, sw, ex) {
        var d = "";
        for (var i = 0; i < pts.length; i++) {
          d += (i ? " " : "") + pts[i][0].toFixed(1) + "," + pts[i][1].toFixed(1);
        }
        return '<polygon points="' + d + '" fill="' + f + '"' +
          (st ? ' stroke="' + st + '" stroke-width="' + (sw || 1) + '"' : "") +
          ' stroke-linejoin="round"' + (ex || "") + "/>";
      };

      var items;
      try {
        items = scene({ project: projector(SC, OX, OY), poly: poly, shade: shade, faceVisible: faceVisible });
      } catch (e) { return; }
      items.sort(function (a, b) { return a.depth - b.depth; });
      var svg = "";
      for (var j = 0; j < items.length; j++) svg += items[j].svg;
      host.innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" width="100%" ' +
        'role="img" style="display:block;background:' + bg + ';border-radius:10px">' +
        svg + "</svg>";
    }

    draw();

    /* Drag to turn. Taking hold stops the idle spin for good, so a reader who
       has posed the model is never fought by the animation. */
    host.addEventListener("pointerdown", function (e) {
      idle = false; host.__lx = e.clientX;
      if (host.setPointerCapture) { try { host.setPointerCapture(e.pointerId); } catch (x) {} }
    });
    host.addEventListener("pointermove", function (e) {
      if (host.__lx == null) return;
      yaw += (e.clientX - host.__lx) * 0.006; host.__lx = e.clientX; draw();
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (ev) {
      host.addEventListener(ev, function () { host.__lx = null; });
    });

    var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    (function spin() {
      if (dead) return;
      if (idle && !still) { yaw += 0.0016; draw(); }
      raf = requestAnimationFrame(spin);
    })();

    return {
      redraw: draw,
      setScene: function (fn) { if (typeof fn === "function") { scene = fn; draw(); } },
      stop: function () { dead = true; if (raf) cancelAnimationFrame(raf); }
    };
  }

  window.mountScene = mountScene;
})();
