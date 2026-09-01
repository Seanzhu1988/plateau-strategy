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

  var SCENES = { "space-needle": spaceNeedle };

  /* The live mount: the same hand-rolled projection every other model on this
     site uses, so what the page draws is what render_room.js draws. */
  function mount(host, key, opts) {
    var o = opts || {};
    var yaw = o.yaw == null ? -0.62 : o.yaw, pitch = o.pitch == null ? 0.22 : o.pitch;
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
