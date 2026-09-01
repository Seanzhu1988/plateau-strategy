/* landmark-3d.js — build a landmark from its facts, not from hand-written code.
 *
 * A model written by hand is one model per landmark. A model composed from a
 * spec is one model per SHAPE, and the shapes repeat across the country: an
 * obelisk is an obelisk in Washington and in Charlestown, and only its
 * numbers differ. That difference is what decides whether this reaches two
 * thousand landmarks or stalls at twenty.
 *
 * The spec comes from landmark_pipeline.compose_spec, which refuses to emit
 * one unless every dimension is corroborated. So this file never guesses. If
 * it is drawing, the numbers behind it are settled and each carries a source.
 *
 * Scenes are pure functions of a context, the same contract met-rooms.js and
 * trail-3d.js keep, so render_room.js can draw these headless and a person
 * can LOOK at the result. That matters more here than anywhere else on the
 * site: a wrong proportion is invisible to every arithmetic check and obvious
 * to one glance.
 */
(function () {
  var S = (typeof window !== "undefined" && window.STYLES3D) || {};
  var PAL = S.PALETTE || {};

  function depthOf(q) {
    var d = q[0][2];
    for (var i = 1; i < q.length; i++) if (q[i][2] < d) d = q[i][2];
    return d;
  }

  /* A four-sided prism that may taper. Every mass here is one of these, which
     is the point: the vocabulary is small and the numbers do the work. */
  function prism(ctx, cx, cy, wBase, wTop, z0, h, fill, edge, depth) {
    var P = ctx.project, out = [], b = wBase / 2, t = wTop / 2;
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

  /* Towers are not square. The Brooklyn Bridge's are about 50 ft along the
     deck and 140 ft across it, and forcing one number for both is what made
     the first attempt read as two thin slabs instead of two masonry piers. */
  function prismXY(ctx, cx, cy, wx, wy, wxTop, wyTop, z0, h, fill, edge) {
    var P = ctx.project, out = [];
    var bx = wx/2, by = wy/2, tx2 = wxTop/2, ty2 = wyTop/2;
    var lo = [[cx-bx,cy-by],[cx+bx,cy-by],[cx+bx,cy+by],[cx-bx,cy+by]];
    var hi = [[cx-tx2,cy-ty2],[cx+tx2,cy-ty2],[cx+tx2,cy+ty2],[cx-tx2,cy+ty2]];
    var norm = [[0,-1],[1,0],[0,1],[-1,0]];
    for (var i = 0; i < 4; i++) {
      if (!ctx.faceVisible(norm[i][0], norm[i][1])) continue;
      var j = (i + 1) % 4;
      var q = [P(lo[i][0],lo[i][1],z0), P(lo[j][0],lo[j][1],z0),
               P(hi[j][0],hi[j][1],z0+h), P(hi[i][0],hi[i][1],z0+h)];
      out.push({ svg: ctx.poly(q, ctx.shade(fill, norm[i][0], norm[i][1], 0), edge, 0.6),
                 depth: depthOf(q) });
    }
    return out;
  }

  function cap(ctx, cx, cy, w, z0, h, fill, edge) {
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

  /* The ground gets an explicit depth for the reason this project has now
     learned six times: a painter's depth is a face's NEAREST point, so a
     plane spanning the scene sorts in front of everything standing on it. */
  function ground(ctx, cx, cy, w, d, z, fill, edge) {
    var P = ctx.project;
    var q = [P(cx-w/2, cy-d/2, z), P(cx+w/2, cy-d/2, z),
             P(cx+w/2, cy+d/2, z), P(cx-w/2, cy+d/2, z)];
    return { svg: ctx.poly(q, fill, edge, 0.5), depth: -1e9 };
  }

  var FORMS = {
    /* An obelisk: a tapering shaft on a plinth, finished with a pyramidion.
       The taper is not decoration. A shaft that rises dead straight reads as
       a chimney; the published base and top widths are what make it read as
       carved stone, and they are the two numbers the fact table supplies. */
    shaft: function (ctx, d, C) {
      var h = d.height, wb = d.base_width, wt = d.top_width || wb * 0.7;
      var plinthH = Math.max(h * 0.035, 4), plinthW = wb * 1.8;
      var capH = wt * 1.6, shaftH = h - plinthH - capH;
      var out = [ground(ctx, 0, 0, plinthW * 3.2, plinthW * 3.2, 0, C.ground, C.edge)];
      out = out.concat(prism(ctx, 0, 0, plinthW, plinthW, 0, plinthH, C.base, C.edge));
      var wAtCap = wb + (wt - wb) * (shaftH / Math.max(h - plinthH, 1e-6));
      out = out.concat(prism(ctx, 0, 0, wb, wAtCap, plinthH, shaftH, C.stone, C.edge));
      out = out.concat(cap(ctx, 0, 0, wAtCap, plinthH + shaftH, capH, C.stone, C.edge));
      return out;
    },

    /* A block: a mass that may batter inward, with a cornice to stop it. */
    block: function (ctx, d, C) {
      var h = d.height, w = d.base_width, wt = d.top_width || w;
      var out = [ground(ctx, 0, 0, w * 3, w * 3, 0, C.ground, C.edge)];
      out = out.concat(prism(ctx, 0, 0, w, wt, 0, h * 0.96, C.stone, C.edge));
      out = out.concat(prism(ctx, 0, 0, wt * 1.06, wt * 1.06, h * 0.96, h * 0.04,
                             C.base, C.edge));
      return out;
    },

    /* A suspension bridge, and specifically the KIND of one the style says.
       The first version of this drew two plain piers and a cable and Sean
       said, correctly, that it is not what the Brooklyn Bridge looks like.
       He was right, and the reason is worth keeping: the fact table settles
       the DIMENSIONS, and the styles book settles the CHARACTER, and a model
       built from dimensions alone is a generic object at the right size.

       What makes that bridge itself is two things, both of them style rather
       than measurement: the pair of pointed arches cut through each tower,
       and the fan of straight diagonal stays running down from the tower
       tops, which is the web you actually see from the promenade. Neither is
       a claim about the world, so neither needs a source; both come from
       STYLES3D, which is what the styles book was built for. */
    bridge: function (ctx, d, C, style) {
      var P = ctx.project, span = d.span, th = d.height || span * 0.17;
      var deckH = d.deck_height || th * 0.46;
      var twX = span * 0.031, twY = span * 0.088, dep = twY;
      var gothic = /gothic/i.test(style || "");
      /* The apron is deliberately tight. At 1.5x the span it dominated the
         bounding box, so fitting the drawing fitted mostly empty ground and
         the bridge itself shrank to a line across the middle of the stage. */
      var out = [ground(ctx, 0, 0, span * 1.10, span * 0.26, 0, C.ground, C.edge)];
      var towers = [-span / 2, span / 2];

      towers.forEach(function (tx) {
        out = out.concat(prismXY(ctx, tx, 0, twX, twY, twX * 0.86, twY * 0.9,
                                 0, th, C.stone, C.edge));
        if (!gothic || !S.pointedArch) return;
        /* The openings pierce the tower ALONG the deck, because that is where
           the roadway goes. Drawn on the face the viewer can actually see:
           faceVisible says the -x face is the lit one at this yaw, and the
           first attempt put them on a side face that was pointing away. */
        var faceX = tx - twX / 2 - span * 0.0015;
        var aw = twY * 0.30, zs = deckH + th * 0.05, rise = aw * 1.35;
        [-1, 1].forEach(function (sgn) {
          var cy = sgn * twY * 0.21;
          var curve = S.pointedArch(aw, rise, 12);
          var pts = [P(faceX, cy - aw / 2, zs)];
          for (var k = 0; k < curve.length; k++) {
            pts.push(P(faceX, cy + curve[k][0], zs + curve[k][1]));
          }
          pts.push(P(faceX, cy + aw / 2, zs));
          pts.push(P(faceX, cy + aw / 2, deckH));
          pts.push(P(faceX, cy - aw / 2, deckH));
          out.push({ svg: ctx.poly(pts, C.opening, C.edge, 0.5),
                     depth: depthOf(pts) + 2 });
        });
      });

      var dq = [P(-span/2, -dep/2, deckH), P(span/2, -dep/2, deckH),
                P(span/2, dep/2, deckH), P(-span/2, dep/2, deckH)];
      out.push({ svg: ctx.poly(dq, ctx.shade(C.deck, 0, 0, 1), C.edge, 0.6),
                 depth: depthOf(dq) });

      var sag = th - deckH - th * 0.06;
      var cableZ = function (x) {
        var u = 2 * x / span;
        return th - sag * (1 - u * u);
      };
      var N = 30;
      for (var i = 0; i < N; i++) {
        var xa = -span/2 + span * i / N, xb = -span/2 + span * (i + 1) / N;
        var q = [P(xa, 0, cableZ(xa)), P(xb, 0, cableZ(xb)),
                 P(xb, 0, cableZ(xb) - th * 0.012), P(xa, 0, cableZ(xa) - th * 0.012)];
        out.push({ svg: ctx.poly(q, C.cable, C.cable, 0.5), depth: depthOf(q) + 3 });
      }
      /* Vertical suspenders, and then the diagonal stays: from each tower top
         down to the deck, fanning outward. On the real bridge the stays and
         the suspenders cross, and that crossing IS the look of it. */
      for (var k2 = 1; k2 < 22; k2++) {
        var xs = -span/2 + span * k2 / 22;
        var qs = [P(xs, 0, cableZ(xs)), P(xs + span * 0.002, 0, cableZ(xs)),
                  P(xs + span * 0.002, 0, deckH), P(xs, 0, deckH)];
        out.push({ svg: ctx.poly(qs, C.cable, null, 0, ' opacity="0.75"'),
                   depth: depthOf(qs) + 3 });
      }
      towers.forEach(function (tx) {
        var dir = tx < 0 ? 1 : -1;
        for (var n = 1; n <= 7; n++) {
          var reach = span * 0.40 * n / 7;
          var xe = tx + dir * reach;
          var qd = [P(tx, 0, th * 0.96), P(tx + dir * span * 0.004, 0, th * 0.96),
                    P(xe + dir * span * 0.004, 0, deckH), P(xe, 0, deckH)];
          out.push({ svg: ctx.poly(qd, C.cable, null, 0, ' opacity="0.68"'),
                     depth: depthOf(qd) + 3 });
        }
      });
      return out;
    },
  };

  function colours(style) {
    var p = PAL[style] || {};
    return {
      stone: p.stone || "#cfc7b6",
      base: p.base || p.stone || "#bdb5a4",
      ground: p.ground || "#dfe2d8",
      deck: p.deck || "#b9b2a3",
      cable: p.cable || "#7d7668",
      edge: p.edge || "#8d8677",
      opening: p.opening || "#6d675c",
    };
  }

  function fromSpec(spec) {
    if (!spec || !spec.ok || !FORMS[spec.form]) return null;
    var C = colours(spec.style);
    return function (ctx) { return FORMS[spec.form](ctx, spec.dims, C, spec.style); };
  }

  var api = { fromSpec: fromSpec, forms: Object.keys(FORMS) };
  if (typeof window !== "undefined") window.LANDMARK3D = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();

/* ---------------------------------------------------------------------
 * Putting a composed model on a page.
 *
 * nyc-3d.js has a mount already, but its scenes hand back world geometry
 * and let a camera project it, while these hand back drawn faces. Rather
 * than bend a working page's renderer to a second contract, this carries
 * its own: the same projection render_room.js uses headless, so what a
 * visitor sees is what was checked offline.
 *
 * Drag to turn, and it turns slowly by itself until someone takes hold,
 * which is how a still picture admits it is a solid. It never starts that
 * for a reader who asked their device to stop animating.
 */
(function () {
  if (typeof window === "undefined") return;
  var L3 = window.LANDMARK3D;
  if (!L3) return;

  function ctxFor(yaw, pitch, SC, OX, OY, collect) {
    var LIGHT = [0.60, 0.30, 0.68];
    return {
      project: function (x, y, z) {
        var c = Math.cos(yaw), s = Math.sin(yaw);
        var rx = x * c - y * s, ry = x * s + y * c;
        return [OX + rx * SC,
                OY + (ry * Math.sin(pitch) - (z || 0) * Math.cos(pitch)) * SC,
                ry];
      },
      faceVisible: function (nx, ny) {
        return (nx * Math.sin(yaw) + ny * Math.cos(yaw)) > 0.001;
      },
      shade: function (hex, nx, ny, nz) {
        var d = nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2];
        var f = 0.55 + 0.45 * Math.max(0, d);
        var n = parseInt(hex.slice(1), 16);
        return "rgb(" + Math.min(255, Math.round((n >> 16 & 255) * f)) + ","
                      + Math.min(255, Math.round((n >> 8 & 255) * f)) + ","
                      + Math.min(255, Math.round((n & 255) * f)) + ")";
      },
      poly: collect,
    };
  }

  function mount(host, spec, opts) {
    var scene = L3.fromSpec(spec);
    if (!host || !scene) return null;
    opts = opts || {};
    var yaw = opts.yaw === undefined ? -0.62 : opts.yaw;
    var pitch = opts.pitch === undefined ? 0.30 : opts.pitch;
    var idle = true, dragging = false, lastX = 0;

    function draw() {
      var W = Math.max(240, host.clientWidth || 640);
      var B = null;
      var measure = ctxFor(yaw, pitch, 1, 0, 0, function (pts) {
        for (var i = 0; i < pts.length; i++) {
          var p = pts[i];
          if (!B) B = [p[0], p[1], p[0], p[1]];
          if (p[0] < B[0]) B[0] = p[0];
          if (p[1] < B[1]) B[1] = p[1];
          if (p[0] > B[2]) B[2] = p[0];
          if (p[1] > B[3]) B[3] = p[1];
        }
        return "";
      });
      scene(measure);
      if (!B) return;
      var bw = Math.max(B[2] - B[0], 1e-6), bh = Math.max(B[3] - B[1], 1e-6);
      /* The stage takes its height from the model rather than the other way
         round. A fixed box left a wide, flat bridge floating in a column of
         empty space, and an obelisk cramped, because fitting by the smaller
         scale wastes whatever dimension is not binding. Bounded so a very
         long span cannot squash to a line, nor a tower run off the screen. */
      var H = Math.round(Math.min(opts.maxHeight || 460,
                Math.max(opts.minHeight || 200, (W - 40) * bh / bw + 40)));
      var SC = Math.min((W - 40) / bw, (H - 40) / bh);
      var OX = (W - bw * SC) / 2 - B[0] * SC, OY = (H - bh * SC) / 2 - B[1] * SC;
      var out = [];
      var paint = ctxFor(yaw, pitch, SC, OX, OY, function (pts, fill, st, sw, ex) {
        var d = pts.map(function (p) {
          return p[0].toFixed(1) + "," + p[1].toFixed(1);
        }).join(" ");
        return '<polygon points="' + d + '" fill="' + fill + '"'
             + (st ? ' stroke="' + st + '" stroke-width="' + (sw || 1) + '"' : '')
             + ' stroke-linejoin="round"' + (ex || '') + '/>';
      });
      var items = scene(paint);
      items.sort(function (a, b) { return a.depth - b.depth; });
      for (var i = 0; i < items.length; i++) out.push(items[i].svg);
      host.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" '
        + 'height="' + H + '" role="img" aria-label="'
        + String(spec.name || spec.slug).replace(/"/g, '') + ', a model you can turn">'
        + out.join('') + '</svg>';
    }

    draw();
    function turn(dx) { yaw += dx; draw(); }

    if (window.ResizeObserver) {
      var seen = 0;
      new ResizeObserver(function () {
        var now = Math.round(host.clientWidth);
        if (now && now !== seen) { seen = now; draw(); }
      }).observe(host);
    }
    host.addEventListener("pointerdown", function (e) {
      dragging = true; idle = false; lastX = e.clientX;
      if (host.setPointerCapture) host.setPointerCapture(e.pointerId);
    });
    host.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      turn((e.clientX - lastX) * 0.006); lastX = e.clientX;
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (ev) {
      host.addEventListener(ev, function () { dragging = false; });
    });
    var still = window.matchMedia
      && window.matchMedia("(prefers-reduced-motion: reduce)");
    (function spin() {
      if (idle && !(still && still.matches)) turn(0.0016);
      requestAnimationFrame(spin);
    })();
    return { turn: turn, redraw: draw };
  }

  L3.mount = mount;
})();
