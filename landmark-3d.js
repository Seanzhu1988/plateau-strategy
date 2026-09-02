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

    /* A suspension bridge, drawn as the thing actually is.
       [SEAN, 2026-08-31: "look in to the real structure of the building in
       real life and slowly landmark builder to shape them into its true
       form... doesnt have to be perfect."]

       Three versions of this got progressively less wrong, and the lesson
       held each time: the fact table settles DIMENSIONS, the styles book
       settles CHARACTER, and TOPOLOGY is a third thing that is neither. How
       many cables a bridge carries, whether its deck runs on past the towers
       to an anchorage, whether it has side spans at all, none of that is a
       measurement or a taste. It is what the structure IS, and getting it
       wrong makes a model that is accurate in every number and still not the
       bridge.

       What the record says about this one: two side spans of 930 ft between
       each tower and its anchorage, 6,016 ft in total including approaches,
       and FOUR main cables, with the suspender ropes hanging from all four.
       Earlier versions drew one cable, no side spans and no anchorages, so
       the deck simply stopped in mid-air at each tower.

       Side spans and anchorages are drawn only when the dimension behind
       them is settled. Unsettled, it falls back to the towers-only bridge,
       which is less true but never invented. */
    bridge: function (ctx, d, C, style) {
      var P = ctx.project, span = d.span, th = d.height || span * 0.17;
      var deckH = d.deck_height || th * 0.46;
      var twX = span * 0.031, twY = span * 0.088, dep = twY;
      var gothic = /gothic/i.test(style || "");
      var side = d.side_span || 0;
      var half = span / 2, anch = half + side;
      var reach = side ? anch + span * 0.10 : half + span * 0.08;
      var out = [ground(ctx, 0, 0, reach * 2.05, span * 0.26, 0, C.ground, C.edge)];

      /* Anchorages: the masonry blocks the cables actually end in. Without
         them the cable runs off the edge of the model and the eye reads the
         whole thing as floating. */
      if (side) {
        [-anch, anch].forEach(function (ax) {
          out = out.concat(prismXY(ctx, ax, 0, twX * 1.5, twY * 0.92,
                                   twX * 1.4, twY * 0.86, 0, deckH * 1.12,
                                   C.base, C.edge));
        });
      }

      [-half, half].forEach(function (tx) {
        out = out.concat(prismXY(ctx, tx, 0, twX, twY, twX * 0.86, twY * 0.9,
                                 0, th, C.stone, C.edge));
        if (!gothic || !S.pointedArch) return;
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

      /* The deck runs the whole way, THROUGH the towers to the anchorages.
         Stopping it at the towers was the single most visible error. */
      var dq = [P(-reach, -dep / 2, deckH), P(reach, -dep / 2, deckH),
                P(reach, dep / 2, deckH), P(-reach, dep / 2, deckH)];
      out.push({ svg: ctx.poly(dq, ctx.shade(C.deck, 0, 0, 1), C.edge, 0.6),
                 depth: depthOf(dq) });

      var sag = th - deckH - th * 0.06;
      function cableZ(x) {
        if (Math.abs(x) <= half) {
          var u = x / half;
          return th - sag * (1 - u * u);
        }
        if (!side) return th;
        /* Beyond a tower the cable falls almost straight to its anchorage. */
        var t = (Math.abs(x) - half) / side;
        return th - (th - deckH * 1.12) * (t * t * 0.35 + t * 0.65);
      }

      /* FOUR cables, not one. Drawn as two planes either side of the deck,
         which is what a viewer can actually distinguish. */
      var planes = [-dep * 0.30, dep * 0.30];
      var N = 34;
      planes.forEach(function (cy) {
        for (var i = 0; i < N; i++) {
          var xa = -reach + (2 * reach) * i / N;
          var xb = -reach + (2 * reach) * (i + 1) / N;
          if (Math.abs(xa) > anch && side) continue;
          var q = [P(xa, cy, cableZ(xa)), P(xb, cy, cableZ(xb)),
                   P(xb, cy, cableZ(xb) - th * 0.012),
                   P(xa, cy, cableZ(xa) - th * 0.012)];
          out.push({ svg: ctx.poly(q, C.cable, C.cable, 0.5), depth: depthOf(q) + 3 });
        }
        for (var k2 = 1; k2 < 24; k2++) {
          var xs = -half + span * k2 / 24;
          var top = cableZ(xs);
          if (top - deckH < th * 0.02) continue;
          var qs = [P(xs, cy, top), P(xs + span * 0.0018, cy, top),
                    P(xs + span * 0.0018, cy, deckH), P(xs, cy, deckH)];
          out.push({ svg: ctx.poly(qs, C.cable, null, 0, ' opacity="0.75"'),
                     depth: depthOf(qs) + 3 });
        }
      });

      /* The diagonal stays. On the real bridge they cross the suspenders,
         and that crossing is the look of it. */
      [-half, half].forEach(function (tx) {
        var dir = tx < 0 ? 1 : -1;
        for (var n = 1; n <= 7; n++) {
          var xe = tx + dir * span * 0.40 * n / 7;
          var qd = [P(tx, 0, th * 0.96), P(tx + dir * span * 0.004, 0, th * 0.96),
                    P(xe + dir * span * 0.004, 0, deckH), P(xe, 0, deckH)];
          out.push({ svg: ctx.poly(qd, C.cable, null, 0, ' opacity="0.66"'),
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
