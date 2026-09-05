/* Two New York landmarks as solids you can turn, drawn like the Met's model.
 *
 * Same idiom as met-3d.js and for the same reason: no 3D library, because the
 * person opening this is standing on a bridge or in a lobby line on a phone.
 * A dozen lines of arithmetic do the work. Points are rotated, faces are
 * sorted back to front, and every face is shaded by which way it faces one
 * sun in the upper left. That is what makes a drawing read as a model.
 *
 * EVERY DIMENSION HERE IS REAL, checked against the record and written in
 * feet, so the proportions on screen are the proportions in the air:
 *
 *   Brooklyn Bridge, opened 1883. Main span 1,595.5 ft, side spans 930 ft
 *   each, total 6,016 ft. Towers 276.5 ft above mean high water, deck 127 ft.
 *   Two pointed Gothic arches per tower, each 117 ft tall and 33.75 ft wide.
 *   Four main cables, and about 400 diagonal stays, 138 to 449 ft long, which
 *   are the web everyone photographs and the reason the deck is stiff.
 *   The promenade runs BETWEEN the roadways and 18 ft above them; since
 *   September 2021 it is pedestrians only, with bikes moved down to a
 *   protected lane on the Manhattan-bound roadway.
 *
 *   Empire State Building, 1931. Roof 1,250 ft, 1,454 ft to the tip. 102
 *   floors. Five-storey base 424 by 187 ft, then setbacks at the 21st, 25th
 *   and 30th, the shaft, and the upper steps at the 72nd, 81st and 85th.
 *   Observatories on the 86th, about 1,050 ft, and the 102nd, about 1,224 ft.
 *
 * The models are massing, not survey drawings: the shapes and heights are
 * true, the window pattern is indicative. The pages say so.
 */
(function () {
  'use strict';

  var C = {
    ink: '#14110c', navy: '#1f3a5f', ground: '#efece3',
    stoneTop: '#efe7d6', stoneL: '#e0d6c1', stoneR: '#c9bda4', stoneEdge: '#a89f8c',
    deckTop: '#e7dfcf', deckL: '#d8cfba', deckR: '#c2b8a0',
    walkTop: '#dfe6ee', walkEdge: '#9fb0c4',
    cable: '#6b6459', stay: '#b3ab9b',
    water: '#dde5e9', waterLine: '#c3ced6',
    glass: '#d3dde2', glassEdge: '#b9c4ca',
    hi: '#7fa3d1', label: '#6b655b'
  };

  /* ---- the camera: yaw around the vertical, pitch down from level ---- */
  /* How far the eye may drop below level and rise above it. The floor is the
     same for every view, a shallow worm's eye so a reader can stand in the
     street and look UP, and it was measured: at -0.14 nothing on either model
     leaves its box. The ceiling is per view because the two drawings run out
     of room at different angles, and the numbers are in TILT_LIMITS. */
  var PITCH_FLOOR = -0.14;
  function makeCam(yaw, pitch, zoom, ox, oy) {
    return { yaw: yaw, pitch: pitch, zoom: zoom, ox: ox, oy: oy };
  }
  function project(p, cam) {
    var cy = Math.cos(cam.yaw), sy = Math.sin(cam.yaw);
    var x1 = p[0] * cy - p[1] * sy;
    var y1 = p[0] * sy + p[1] * cy;
    var cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
    return {
      x: cam.ox + x1 * cam.zoom,
      y: cam.oy - (p[2] * cp - y1 * sp) * cam.zoom,
      d: y1 * cp + p[2] * sp          /* depth: bigger is nearer the eye */
    };
  }

  /* ---- one sun, upper left and in front ---- */
  var SUN = (function () {
    var v = [-0.55, -0.5, 0.67], m = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    return [v[0] / m, v[1] / m, v[2] / m];
  })();
  function shade(base, n) {
    var m = Math.sqrt(n[0] * n[0] + n[1] * n[1] + n[2] * n[2]) || 1;
    var d = (n[0] * SUN[0] + n[1] * SUN[1] + n[2] * SUN[2]) / m;
    var k = 0.72 + 0.28 * Math.max(0, d);              /* never pitch black */
    var c = base.replace('#', '');
    var r = parseInt(c.slice(0, 2), 16), g = parseInt(c.slice(2, 4), 16), b = parseInt(c.slice(4, 6), 16);
    function q(v) { return Math.max(0, Math.min(255, Math.round(v * k))); }
    return 'rgb(' + q(r) + ',' + q(g) + ',' + q(b) + ')';
  }
  function normal(a, b, c) {
    var u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    var v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    return [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
  }

  /* A face is 3D points plus a colour; the scene sorts them and draws. */
  function face(pts, colour, opts) {
    var o = opts || {};
    var z = 0;
    for (var i = 0; i < pts.length; i++) z += pts[i][0] * 0 + 0;
    return { pts: pts, colour: colour, stroke: o.stroke, width: o.width,
             flat: o.flat, opacity: o.opacity, bias: o.bias || 0 };
  }
  function box(x0, x1, y0, y1, z0, z1, base) {
    /* six faces, each shaded by its own normal */
    var A = [x0, y0, z0], B = [x1, y0, z0], Cc = [x1, y1, z0], D = [x0, y1, z0];
    var E = [x0, y0, z1], F = [x1, y0, z1], G = [x1, y1, z1], H = [x0, y1, z1];
    return [
      face([E, F, G, H], base),                 /* top */
      face([A, B, F, E], base),                 /* front, -y */
      face([B, Cc, G, F], base),                /* right, +x */
      face([D, Cc, G, H], base),                /* back, +y */
      face([A, D, H, E], base)                  /* left, -x */
    ];
  }

  function render(host, scene, cam, extras) {
    var w = scene.w, h = scene.h;
    var parts = [];
    /* An ink skyline, so a label can be put where the drawing is not.
       The box is cut into columns and every piece of STRUCTURE that gets
       drawn records the highest and lowest it reaches in each column. The
       ground and water planes are flat fills and are deliberately left out:
       they are a backdrop a word reads perfectly well against, and counting
       them would leave nowhere at all to put a label. */
    var NB = 240, skyTop = [], skyBot = [];
    function inkAt(x, y) {
      var i = Math.floor(x / w * NB);
      if (i < 0 || i >= NB) return;
      if (skyTop[i] == null || y < skyTop[i]) skyTop[i] = y;
      if (skyBot[i] == null || y > skyBot[i]) skyBot[i] = y;
    }
    function inkEdge(a, b) {
      var n = Math.max(1, Math.ceil(Math.abs(b.x - a.x) / (w / NB)));
      for (var s = 0; s <= n; s++) {
        var t = s / n;
        inkAt(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
      }
    }
    function inkSpan(x1, x2) {
      var i1 = Math.max(0, Math.floor(x1 / w * NB));
      var i2 = Math.min(NB - 1, Math.ceil(x2 / w * NB));
      var top = null, bot = null;
      for (var i = i1; i <= i2; i++) {
        if (skyTop[i] == null) continue;
        if (top == null || skyTop[i] < top) top = skyTop[i];
        if (bot == null || skyBot[i] > bot) bot = skyBot[i];
      }
      return { top: top, bot: bot };
    }
    /* painter's algorithm on the face centroid's depth */
    var faces = scene.faces.slice();
    faces.forEach(function (f) {
      var d = 0;
      f.pts.forEach(function (p) { d += project(p, cam).d; });
      f._d = d / f.pts.length + f.bias;
    });
    faces.sort(function (a, b) { return a._d - b._d; });
    faces.forEach(function (f) {
      var pts = f.pts.map(function (p) { return project(p, cam); });
      var d = pts.map(function (p) { return p.x.toFixed(1) + ',' + p.y.toFixed(1); }).join(' ');
      var fill = f.flat ? f.colour : shade(f.colour, normal(f.pts[0], f.pts[1], f.pts[2]));
      if (!f.flat) for (var q = 0; q < pts.length; q++) inkEdge(pts[q], pts[(q + 1) % pts.length]);
      parts.push('<polygon points="' + d + '" fill="' + fill + '"' +
        (f.stroke ? ' stroke="' + f.stroke + '" stroke-width="' + (f.width || 0.6) + '"' : '') +
        (f.opacity ? ' opacity="' + f.opacity + '"' : '') +
        ' stroke-linejoin="round"/>');
    });
    (scene.lines || []).forEach(function (l) {
      var a = project(l.a, cam), b = project(l.b, cam);
      inkEdge(a, b);
      parts.push('<line x1="' + a.x.toFixed(1) + '" y1="' + a.y.toFixed(1) +
        '" x2="' + b.x.toFixed(1) + '" y2="' + b.y.toFixed(1) +
        '" stroke="' + l.colour + '" stroke-width="' + (l.width || 1) +
        '" opacity="' + (l.opacity == null ? 1 : l.opacity) + '" stroke-linecap="round"/>');
    });
    /* Labels live in viewBox units, and the viewBox is squeezed to whatever
       width the page gives it. On a 375 px phone the bridge box is 321 px
       against a 980 unit viewBox, so a 12 unit label landed at 3.9 CSS
       pixels and the dot at 1.3: both invisible. Size them against the box's
       real pixel width instead, so a label reads the same on any screen. The
       floor of 12 keeps the desktop drawing exactly as it was. */
    var pxw = host.clientWidth || host.getBoundingClientRect().width || w;
    var perPx = w / (pxw || w);                        /* viewBox units per CSS px */
    var fT = Math.max(12, Math.min(12.5 * perPx, 44)); /* the bold name */
    var fS = fT * 0.875;                               /* the note under it */
    var ds = fT / 12;                                  /* dots and offsets follow */
    /* Readable labels are wide labels, so on a phone they ran off the right
       edge and sat on top of each other. Two guards, both measured from the
       text itself: a label that would overrun flips to the left of its dot,
       and a label that would land on one already placed drops a line. On a
       desktop box neither guard fires, so the wide drawing is untouched. */
    var gap = 9 * ds, lh = fT * 1.35, placed = [];
    function runs(s, f) { return (s || '').length * f * 0.55; }
    (scene.marks || []).forEach(function (m) {
      var p = project(m.at, cam);
      parts.push('<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) +
        '" r="' + ((m.r || 4) * ds).toFixed(1) + '" fill="' + (m.fill || C.navy) + '"/>');
      if (!m.text && !m.sub) return;
      var wide = Math.max(runs(m.text, fT), runs(m.sub, fS));
      var flip = p.x + gap + wide > w - 4;
      var ax = flip ? p.x - gap : p.x + gap;
      var x1 = flip ? ax - wide : ax, x2 = x1 + wide;
      /* flipping a long label can push it off the other edge, so nudge the
         whole label back inside. The dot stays on the true point. */
      var shift = x1 < 4 ? 4 - x1 : (x2 > w - 4 ? (w - 4) - x2 : 0);
      ax += shift; x1 += shift; x2 += shift;
      /* the block runs from the title's ascender to the note's descender.
         Guessing this short is how a label ends up half off the bottom edge:
         at 375px the type is three times its desktop size, so the four units
         above and the descender below are twenty units of real estate. */
      var tall = fT + 4 * ds + (m.sub ? lh + 0.3 * fS : 0.3 * fT);
      var ink = inkSpan(x1, x2), base = p.y - fT;
      function fits(y) { return y >= 4 && y + tall <= h - 4; }
      function hits(y) {
        return placed.some(function (r) {
          return x1 < r.x2 && x2 > r.x1 && y < r.y2 && y + tall > r.y1;
        });
      }
      /* Lift it clear of the drawing. At the whole span framing the bridge
         fills the middle of the box, so a label anchored at the deck landed
         inside the cable web: "the promenade" and its note were written
         across the suspenders and the roadway. Measured in viewBox units at
         the columns that label occupies, structure ran from y=63 down to
         y=142 while the label block sat at 115 to 147, so 27 units of it lay
         on the drawing. So the block moves to the nearer edge of the ink,
         above it or below it, and a leader is drawn back to the dot. The DOT
         never moves: it stays on the true point, which is the whole promise
         of the drawing.

         A lift is only taken if the lifted block lands inside the box and on
         no other label. Where it cannot, the label is left exactly where the
         old code put it and gets a halo instead. That order matters: at the
         tower framing and on a phone there is genuinely nowhere to go, and a
         lift taken anyway put a bridge label off the bottom edge. */
      var clear = 5 * ds, lift = 0;
      if (ink.top != null &&
          base < ink.bot + clear && base + tall > ink.top - clear) {
        var up = (ink.top - clear - tall) - base;
        var dn = (ink.bot + clear) - base;
        var cands = (-up <= dn) ? [up, dn] : [dn, up];
        for (var c = 0; c < 2; c++) {
          if (fits(base + cands[c]) && !hits(base + cands[c])) { lift = cands[c]; break; }
        }
      }
      var drop = 0;
      if (!lift) {
        for (var g = 0; g < 4; g++) {
          var top = base + drop;
          if (!fits(top)) { drop -= lh; break; }
          if (!hits(top)) break;
          drop += lh;
        }
        if (drop < 0) drop = 0;
      }
      var y0 = base + lift + drop;
      /* last word: the block stays inside the box whatever came before. If
         that puts it back on the drawing the halo below picks it up, which is
         the right order of preference: inside the box and haloed beats
         outside the box and unread. */
      var pull = y0 < 4 ? 4 - y0 : (y0 + tall > h - 4 ? (h - 4) - (y0 + tall) : 0);
      lift += pull; y0 += pull;
      placed.push({ x1: x1, x2: x2, y1: y0, y2: y0 + tall });
      var anchor = flip ? ' text-anchor="end"' : '';
      var yT = p.y + 4 * ds + lift + drop;
      /* Sometimes there is nowhere to lift it to. At the tower framing the
         masonry fills the whole box, so both labels there sit on stone, and
         the code above correctly declines to move a label it cannot place
         better. Those words get a halo instead: the ground colour stroked
         behind the glyphs, drawn under them by paint-order, which is how a
         map keeps a place name legible over a hillside. Only the labels that
         are still on the drawing get one, so the whole span view's lifted
         labels are drawn exactly as they were. */
      var onInk = ink.top != null &&
        y0 < ink.bot + 1 && y0 + tall > ink.top - 1;
      var halo = onInk ? ' paint-order="stroke" stroke="' + C.ground +
        '" stroke-width="' + (2.6 * ds).toFixed(2) +
        '" stroke-linejoin="round"' : '';
      if (Math.abs(lift) > 2) {
        /* the leader, drawn before the words so the words stay on top */
        var lx = flip ? ax + 0.3 * gap : ax - 0.3 * gap;
        parts.push('<line class="psx-lead" x1="' + p.x.toFixed(1) + '" y1="' + p.y.toFixed(1) +
          '" x2="' + lx.toFixed(1) + '" y2="' + (yT - 0.32 * fT).toFixed(1) +
          '" stroke="' + C.label + '" stroke-width="' + (0.8 * ds).toFixed(2) +
          '" opacity="0.75"/>');
      }
      if (m.text) {
        parts.push('<text x="' + ax.toFixed(1) + '" y="' + yT.toFixed(1) +
          '" font-size="' + fT.toFixed(1) + '" font-weight="700" fill="' + C.ink + '"' +
          halo + anchor + '>' + m.text + '</text>');
      }
      if (m.sub) {
        parts.push('<text x="' + ax.toFixed(1) + '" y="' + (yT + lh).toFixed(1) +
          '" font-size="' + fS.toFixed(1) + '" fill="' + C.label + '"' +
          halo + anchor + '>' + m.sub + '</text>');
      }
    });
    host.innerHTML = '<svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" ' +
      'style="display:block;background:' + C.ground + ';border-radius:10px">' +
      (extras || '') + parts.join('') + '</svg>';
  }

  /* ==================== BROOKLYN BRIDGE ==================== */
  /* Feet, origin at the Manhattan tower's centre, x runs to Brooklyn. */
  var BB = {
    span: 1595.5, side: 930, towerH: 276.5, deckH: 127,
    archH: 117, archW: 33.75, deckW: 85, towerW: 140, towerT: 53
  };

  /* Two views of the same real bridge. The whole span is what a visitor
     recognises, but at that framing a 33.75 ft opening is about ten pixels
     wide, so the Gothic arches, which are the reason the towers look the way
     they do, are a smudge. The tower view keeps every dimension identical and
     only moves the eye in: one tower, a stub of deck, and the cables passing
     over the saddle. At that framing the opening is roughly a third of the
     drawing and the two-centred curve, the spandrel and the fanned voussoir
     joints are all legible, which is what they were built into the file for. */
  function bridgeScene(opts) {
    var o = opts || {};
    var near = o.view === 'tower';
    var f = [], lines = [], marks = [];
    var S = 0.115;                              /* feet to model units */
    function P(x, y, z) { return [x * S, y * S, z * S]; }
    var halfW = BB.deckW / 2, dz = BB.deckH;
    /* the whole span, or a stub either side of the one tower */
    var x0 = near ? -230 : -300, x1 = near ? 230 : BB.span + 300;

    /* the water */
    f.push(face([P(x0 - 260, -520, 0), P(x1 + 260, -520, 0),
                 P(x1 + 260, 520, 0), P(x0 - 260, 520, 0)], C.water, { flat: true }));

    /* the deck: a long slab, sagging slightly toward the towers is not real,
       the roadway is nearly level, so it is drawn level. */
    [[x0, 0], [BB.span, 0]].forEach(function () {});
    f = f.concat(box(P(x0, 0, 0)[0], P(x1, 0, 0)[0],
                     P(0, -halfW, 0)[1], P(0, halfW, 0)[1],
                     P(0, 0, dz - 9)[2], P(0, 0, dz)[2], C.deckTop));

    /* the promenade: between the roadways, 18 ft above them, pedestrians
       only since 2021. This is the line the visitor actually walks. */
    f = f.concat(box(P(x0, 0, 0)[0], P(x1, 0, 0)[0],
                     P(0, -13, 0)[1], P(0, 13, 0)[1],
                     P(0, 0, dz)[2], P(0, 0, dz + 18)[2], C.walkTop));

    /* The two towers, and the arches are the whole point of them. Across
       the deck a tower is THREE masonry piers with TWO openings between
       them, each opening 33.75 ft wide and 117 ft tall, pointed. Drawn as
       two posts with a hole in the middle, as this was at first, it reads
       as scaffolding; drawn as pier, arch, pier, arch, pier, it reads as
       the Brooklyn Bridge. */
    (near ? [0] : [0, BB.span]).forEach(function (tx) {
      var tt = BB.towerT / 2;
      var w = BB.towerW / 2;                 /* 70 ft each side of centre */
      var aw = BB.archW;                     /* 33.75 ft of opening */
      var pier = (BB.towerW - 2 * aw) / 3;   /* three piers share the rest */
      /* piers, from one edge across: solid from the base to the top */
      var edges = [
        [-w, -w + pier],
        [-aw / 2 - pier / 2, aw / 2 + pier / 2],   /* the centre pier */
        [w - pier, w]
      ];
      edges.forEach(function (e) {
        f = f.concat(box(P(tx - tt, 0, 0)[0], P(tx + tt, 0, 0)[0],
                         P(0, e[0], 0)[1], P(0, e[1], 0)[1],
                         0, P(0, 0, BB.towerH)[2], C.stoneTop));
      });
      /* over the two openings: the spandrel, from the arch crown to the top */
      f = f.concat(box(P(tx - tt, 0, 0)[0], P(tx + tt, 0, 0)[0],
                       P(0, -w, 0)[1], P(0, w, 0)[1],
                       P(0, 0, dz + BB.archH)[2], P(0, 0, BB.towerH)[2], C.stoneTop));
      /* and under them: solid masonry down to the water */
      f = f.concat(box(P(tx - tt, 0, 0)[0], P(tx + tt, 0, 0)[0],
                       P(0, -w, 0)[1], P(0, w, 0)[1],
                       0, P(0, 0, dz - 9)[2], C.stoneTop));
      /* THE ARCHES. These were drawn as two straight lines meeting at a
         point, which is a triangle, not a Gothic arch. A Gothic arch is
         TWO-CENTRED: each side is a circular arc struck from a centre on
         the far side of the centreline, so the curve is steep at the
         springing and flat at the apex. The geometry comes from the styles
         book, where the offset is forced by d = (h*h - a*a) / 2a. At this
         opening, 33.75 ft wide with a 44.5 ft rise, that formula returns a
         LANCET, which is what the photographs show.

         Two things are drawn per opening. The SPANDREL is the stone that
         sits above the curve and below the square head of the opening; fill
         it and the hole is pointed, leave it out and the hole is a rectangle
         with a line scratched on it, which is what it was. The VOUSSOIRS are
         the joints between the wedge stones, and because each is a true
         radius from the arc centre they FAN rather than staying parallel.
         That fan is the difference between cut stone and a cut hole. */
      var ST = window.STYLES3D;
      [-1, 1].forEach(function (sd) {
        var c = sd * (aw + pier);                    /* centre of that opening */
        var top = dz + BB.archH;
        var spring = dz + BB.archH * 0.62;
        var rise = top - spring;
        var arc = ST.pointedArch(aw, rise, 22);      /* [u across, v up] */

        [-tt, tt].forEach(function (xf) {
          /* spandrel, left half then right half, each closing against the
             square head so the opening reads as an arch cut in a wall. */
          [-1, 1].forEach(function (half) {
            /* Walk the OUTLINE of the spandrel, in order, or the fill closes
               across the opening and bricks up the arch. Start at the square
               top corner, drop down the jamb to the springing, ride the arc up
               to the apex, and let the close run back along the head. */
            var poly = [P(tx + xf, c + half * aw / 2, top)];
            arc.forEach(function (pt) {
              if (half * pt[0] >= -1e-9) poly.push(P(tx + xf, c + pt[0], spring + pt[1]));
            });
            f.push(face(poly, C.stoneTop, { flat: true }));
          });

          /* the arc itself, as the line where stone meets sky */
          for (var i = 1; i < arc.length; i++) {
            lines.push({ a: P(tx + xf, c + arc[i - 1][0], spring + arc[i - 1][1]),
                         b: P(tx + xf, c + arc[i][0], spring + arc[i][1]),
                         colour: C.stoneEdge, width: 1.1 });
          }
          /* and the jambs below the springing */
          [-1, 1].forEach(function (half) {
            lines.push({ a: P(tx + xf, c + half * aw / 2, dz),
                         b: P(tx + xf, c + half * aw / 2, spring),
                         colour: C.stoneEdge, width: 1.1 });
          });

          /* radiating joints */
          ST.voussoirs(aw, rise, aw * 0.34, 7).forEach(function (v) {
            lines.push({ a: P(tx + xf, c + v[0][0], spring + v[0][1]),
                         b: P(tx + xf, c + v[1][0], spring + v[1][1]),
                         colour: C.stoneEdge, width: 0.7 });
          });
        });
      });
    });

    /* the four main cables: a real catenary between tower tops, dipping to
       the deck at midspan, and rising over the towers to the anchorages. */
    function catenary(xa, za, xb, zb, sagAt, sag, n, y) {
      var pts = [];
      for (var i = 0; i <= n; i++) {
        var t = i / n, x = xa + (xb - xa) * t;
        var base = za + (zb - za) * t;
        var s = Math.sin(Math.PI * t);
        pts.push(P(x, y, base - sag * s * s * 0 - sag * s));
      }
      return pts;
    }
    /* Up close the far half of the span, its four catenaries and its four
       hundred stays are all off the canvas, so drawing them is arithmetic
       nobody sees, sixty times a second on a phone. What a reader DOES see
       from under a tower is the cable crossing the saddle and starting down,
       so that much is drawn, and no more. */
    if (near) {
      /* Only the NEAR half. Lines are drawn after every face and are not
         depth sorted, which costs nothing at the span framing and is glaring
         up close: the run of cable going away from the eye is behind 276 ft
         of masonry and was being painted straight over the front of it. At
         this yaw the negative x half is the half toward the eye, so that is
         the half that is drawn, and the far half is left out because it
         would not be visible anyway. */
      [-1, 1].forEach(function (side) {
        [halfW - 8, halfW - 22].forEach(function (yy) {
          var y = side * yy;
          var steps = 8;
          function at(t) {
            /* the shape the long catenary has in its first hundred feet off
               a tower top, sampled from the same drop it uses */
            return P(x0 * t, y,
                     BB.towerH - (BB.towerH - dz - 12) * (t * t * 0.62 + t * 0.38) * 0.55);
          }
          for (var i = 0; i < steps; i++) {
            lines.push({ a: at(i / steps), b: at((i + 1) / steps),
                         colour: C.cable, width: 2.1 });
          }
        });
      });
    }
    if (!near) [-1, 1].forEach(function (side) {
      [halfW - 8, halfW - 22].forEach(function (yy) {
        var y = side * yy;
        var main = catenary(0, BB.towerH, BB.span, BB.towerH, 0.5, BB.towerH - dz - 12, 30, y);
        for (var i = 0; i < main.length - 1; i++) {
          lines.push({ a: main[i], b: main[i + 1], colour: C.cable, width: 2.1 });
        }
        /* the side spans' cables run down to the anchorages */
        [[0, x0], [BB.span, x1]].forEach(function (seg) {
          var a = P(seg[0], y, BB.towerH), b = P(seg[1], y, dz + 26);
          var steps = 14;
          for (var j = 0; j < steps; j++) {
            var t0 = j / steps, t1 = (j + 1) / steps;
            function pt(t) {
              var x = seg[0] + (seg[1] - seg[0]) * t;
              var z = BB.towerH + (dz + 26 - BB.towerH) * (t * t * 0.55 + t * 0.45);
              return P(x, y, z);
            }
            lines.push({ a: pt(t0), b: pt(t1), colour: C.cable, width: 1.9 });
          }
        });
        /* verticals from cable to deck */
        for (var k = 1; k < 26; k++) {
          var t = k / 26, x = BB.span * t;
          var s = Math.sin(Math.PI * t);
          var ztop = BB.towerH - (BB.towerH - dz - 12) * s;
          lines.push({ a: P(x, y, ztop), b: P(x, y, dz + 8), colour: C.stay,
                       width: 0.8, opacity: 0.85 });
        }
        /* THE WEB: diagonal stays from each tower down to the deck, the
           pattern that makes this bridge unmistakable. */
        [0, BB.span].forEach(function (tx) {
          var dir = tx === 0 ? 1 : -1;
          for (var s2 = 1; s2 <= 11; s2++) {
            var reach = 449 * (s2 / 11);
            lines.push({ a: P(tx, y, BB.towerH - 8), b: P(tx + dir * reach, y, dz + 8),
                         colour: C.stay, width: 0.9, opacity: 0.9 });
          }
        });
      });
    });

    if (o.marks !== false && near) {
      /* TWO marks here, not the span view's three. The whole tower fills the
         box at this framing, so every label lands on the drawing rather than
         beside it, and a third one was simply stacked over the masonry on a
         375 px phone. The promenade already has its label on the other view.
         The height mark also sits 2 ft above the parapet rather than 26: at
         26 the dot was 7 units from the top of the box and the text above the
         baseline was cut off by the edge. */
      marks.push({ at: P(0, 0, BB.towerH + 2), text: 'Manhattan tower',
                   sub: '276.5 ft above the water' });
      marks.push({ at: P(0, BB.archW + (BB.towerW - 2 * BB.archW) / 3,
                         dz + BB.archH * 0.72), fill: C.hi,
                   text: 'the pointed arch',
                   sub: '33.75 ft wide, 117 ft tall, two-centred' });
    } else if (o.marks !== false) {
      marks.push({ at: P(0, 0, BB.towerH + 40), text: 'Manhattan tower',
                   sub: '276.5 ft above the water' });
      marks.push({ at: P(BB.span, 0, BB.towerH + 40), text: 'Brooklyn tower' });
      marks.push({ at: P(BB.span / 2, 0, dz + 60), text: 'the promenade',
                   sub: '18 ft above the traffic, walkers only' });
    }
    return { w: 980, h: 340, faces: f, lines: lines, marks: marks };
  }

  /* ==================== EMPIRE STATE BUILDING ==================== */
  /* Feet. Origin at the centre of the base, z up from the sidewalk. */
  var ES = {
    roof: 1250, tip: 1454, baseW: 424, baseD: 187, baseH: 5 * 12.25,
    obs86: 1050, obs102: 1224
  };

  /* How far apart the pieces draw when the building is fully open, in feet.
     150 ft is a little over twelve storeys of this building, which is enough
     air to see a deck through and not so much that the tower stops reading
     as one object. */
  var ES_LIFT = 150;

  function empireScene(opts) {
    var o = opts || {};
    var openT = Math.max(0, Math.min(1, o.openT || 0));
    var f = [], lines = [], marks = [];
    /* Opening it makes the drawing 300 ft taller, which would push the
       antenna and its label straight out of the box. So the whole model is
       scaled down by exactly the factor that keeps the tip on the same line
       of the box however far it is open, tip / (tip + two lifts). A uniform
       scale falsifies no proportion: everything shrinks together, and closed
       the factor is 1 and the drawing is the one that was here. */
    var S = 0.30 * (ES.tip + 2 * ES_LIFT * (1 - openT)) / (ES.tip + 2 * ES_LIFT);
    function P(x, y, z) { return [x * S, y * S, z * S]; }
    var FH = ES.roof / 102;                       /* mean storey, 12.25 ft */

    /* The two heights it splits at are the two published observatory floors,
       1,050 ft and 1,224 ft, which were already the only two heights this
       model named. Everything below 1,050 stands still, the piece between
       the decks rises one lift, and the mast and antenna rise two, so each
       deck is left standing in clear air on top of the piece it belongs to. */
    var CUT = [ES.obs86, ES.obs102];
    function lift(z) {
      if (!openT) return 0;
      return (z >= ES.obs102 ? 2 : z >= ES.obs86 ? 1 : 0) * ES_LIFT * openT;
    }

    /* the block it stands on */
    f.push(face([P(-420, -420, 0), P(420, -420, 0), P(420, 420, 0), P(-420, 420, 0)],
                C.ground, { flat: true }));

    /* One storey band of the massing. Closed it is a single box and a single
       run of window bands, exactly as before. Open, it is cut at whichever
       of the two deck heights falls inside it, and each piece is carried up
       by its own tier, so a band that spans a cut does not tear. */
    function slab(w, d, z0, z1, bare) {
      var edges = [z0], i, j;
      if (openT) CUT.forEach(function (c) { if (c > z0 && c < z1) edges.push(c); });
      edges.push(z1);
      edges.sort(function (a, b) { return a - b; });
      for (i = 0; i < edges.length - 1; i++) {
        var a = edges[i], b = edges[i + 1], up = lift(a);
        var x0 = P(-w / 2, 0, 0)[0], x1 = P(w / 2, 0, 0)[0];
        var y0 = P(0, -d / 2, 0)[1], y1 = P(0, d / 2, 0)[1];
        var za = P(0, 0, a + up)[2], zb = P(0, 0, b + up)[2];
        f = f.concat(box(x0, x1, y0, y1, za, zb, C.stoneTop));
        /* box() draws no underside, which is invisible on a building
           standing on the ground and a hole in one that has been lifted off
           it. A piece in the air gets its floor. */
        if (up > 0) f.push(face([[x0, y0, za], [x0, y1, za], [x1, y1, za], [x1, y0, za]],
                                C.stoneTop));
        /* the vertical window bands that make it read as Art Deco limestone.
           A band is inset six feet from the bottom of its piece and four from
           the top, so a piece ten feet or shorter has none: that is only ever
           a sliver left by a cut, since the shortest real storey band in the
           massing is the 86th at 12.25 ft, and it keeps its bands exactly as
           it always had. The mast asks for none at all. */
        if (bare || b - a <= 10) continue;
        var bands = Math.max(3, Math.round(w / 26));
        for (j = 1; j < bands; j++) {
          var xx = -w / 2 + (w * j / bands);
          lines.push({ a: P(xx, -d / 2 - 0.5, a + up + 6),
                       b: P(xx, -d / 2 - 0.5, b + up - 4),
                       colour: C.glassEdge, width: 1.1, opacity: 0.75 });
        }
      }
    }

    /* the massing, floor by floor in the real setback order: the five storey
       base, the steps at 21, 25 and 30, the long shaft, then 72, 81, 85. */
    var steps = [
      { to: 5,   w: ES.baseW, d: ES.baseD },
      { to: 21,  w: 304, d: 172 },
      { to: 25,  w: 268, d: 160 },
      { to: 30,  w: 232, d: 148 },
      { to: 72,  w: 196, d: 132 },
      { to: 81,  w: 168, d: 118 },
      { to: 85,  w: 140, d: 104 },
      { to: 86,  w: 128, d: 96 },
      { to: 102, w: 86,  d: 70 }
    ];
    var z = 0;
    steps.forEach(function (s) {
      var top = s.to * FH;
      slab(s.w, s.d, z, top);
      z = top;
    });

    /* the mooring mast and the antenna to the tip. The 102nd floor is inside
       the mast, so the mast is one of the pieces that gets cut. */
    slab(60, 52, ES.roof - 40, ES.roof, true);
    var tipUp = lift(ES.roof);
    lines.push({ a: P(0, 0, ES.roof + tipUp), b: P(0, 0, ES.tip + tipUp),
                 colour: C.ink, width: 2.4 });

    /* ---- the two decks, drawn only once there is room to see them ---- */
    /* Each deck is the tower's own plan at that height, so no dimension is
       invented: the 86th is the 128 by 96 ft band it sits in, the 102nd is
       the 60 by 52 ft mast. What is indicative, exactly like the window
       bands, is the parapet and the glass: the height of a wall is not a
       number this model can cite. The difference between them is the fact
       the page states, and the whole reason a visitor picks one: the 86th is
       open to the air, the 102nd is enclosed. */
    function ring(w, d, zb, hh, colour, edge) {
      var t = Math.max(3, w * 0.028);
      [[-w / 2, -d / 2, w / 2, -d / 2 + t], [-w / 2, d / 2 - t, w / 2, d / 2],
       [-w / 2, -d / 2, -w / 2 + t, d / 2], [w / 2 - t, -d / 2, w / 2, d / 2]
      ].forEach(function (r) {
        var bx = box(P(r[0], 0, 0)[0], P(r[2], 0, 0)[0],
                     P(0, r[1], 0)[1], P(0, r[3], 0)[1],
                     P(0, 0, zb)[2], P(0, 0, zb + hh)[2], colour);
        bx.forEach(function (fc) {
          fc.bias = 0.4;
          if (edge) { fc.stroke = edge; fc.width = 0.5; }
          if (openT < 0.98) fc.opacity = openT.toFixed(2);
          f.push(fc);
        });
      });
    }
    function deck(w, d, at, hh, floor, wall, edge) {
      var fl = face([P(-w / 2, -d / 2, at), P(w / 2, -d / 2, at),
                     P(w / 2, d / 2, at), P(-w / 2, d / 2, at)], floor);
      fl.bias = 0.3;
      if (openT < 0.98) fl.opacity = openT.toFixed(2);
      f.push(fl);
      ring(w, d, at, hh, wall, edge);
    }
    if (openT > 0.02) {
      /* Both floors are drawn in the promenade blue-grey the bridge walkway
         uses, not in limestone, because a floor the colour of the wall reads
         as the top of a box rather than as a floor you could stand on. That
         is the whole thing this view exists to show. */
      /* the open-air terrace, on top of the piece that stands still */
      deck(128, 96, ES.obs86, 11, C.walkTop, C.stoneTop, C.stoneEdge);
      /* the enclosed room, riding up with the piece it stands on */
      deck(60, 52, ES.obs102 + lift(ES.obs86), 13, C.walkTop, C.glass, C.glassEdge);
    }

    if (o.marks !== false) {
      marks.push({ at: P(0, 0, ES.tip + 24 + tipUp), text: '1,454 ft to the tip' });
      marks.push({ at: P(78, 0, ES.obs102 + lift(ES.obs86)), fill: C.hi,
                   text: '102nd floor',
                   sub: 'enclosed, 1,224 ft, the small one' });
      marks.push({ at: P(96, 0, ES.obs86), fill: C.navy, text: '86th floor',
                   sub: 'open air, 1,050 ft, the one people mean' });
      marks.push({ at: P(150, 0, ES.baseH), text: 'Fifth Avenue',
                   sub: 'the entrance and the line' });
    }
    return { w: 720, h: 620, faces: f, lines: lines, marks: marks };
  }

  /* ---- mounting: drag to turn and to tilt, and it turns on its own ---- */
  function mount(host, build, cam0, ceil) {
    var cam = cam0, dragging = false, lastX = 0, lastY = 0, idle = true;
    var pitchCeil = (typeof ceil === 'number') ? ceil : 0.48;
    function draw() { render(host, build(), cam); }
    draw();
    /* Changing view has to REPLACE what this mount draws, not mount a second
       one beside it. Mounting again would leave the first spin loop running,
       so two requestAnimationFrame loops would fight over the same box and a
       reader who tapped back and forth a dozen times would have a dozen. */
    function retarget(nextBuild, nextCam, nextCeil) {
      build = nextBuild; cam = nextCam; idle = true;
      if (typeof nextCeil === 'number') pitchCeil = nextCeil;
      draw();
    }
    function turn(dx) { aim(cam.yaw + dx, cam.pitch); }
    /* Pitch is how far the eye has risen above level. The floor is a little
       under level so a reader can stand in the street and look UP at the
       thing, which is the whole point of a 1,250 ft building, and the ceiling
       stops short of straight down, where a building collapses into its own
       footprint and the model stops being a model. */
    function aim(yaw, pitch) {
      pitch = Math.max(PITCH_FLOOR, Math.min(pitchCeil, pitch));
      cam = makeCam(yaw, pitch, cam.zoom, cam.ox, cam.oy);
      draw();
    }
    /* label size is worked out from the box's pixel width, so a box that
       changes width has to be drawn again. The idle turn would eventually
       do it, but it does not run for a reader who stopped animation, nor
       once someone has taken hold, nor while the tab is in the background. */
    if (window.ResizeObserver) {
      var seen = 0;
      new ResizeObserver(function () {
        var now = Math.round(host.clientWidth);
        if (now && now !== seen) { seen = now; draw(); }
      }).observe(host);
    }
    host.addEventListener('pointerdown', function (e) {
      dragging = true; idle = false; lastX = e.clientX; lastY = e.clientY;
      host.setPointerCapture && host.setPointerCapture(e.pointerId);
    });
    /* Sideways turns, up and down tilts, and both are applied in ONE aim so a
       diagonal drag costs one draw rather than two. On a touch screen the
       stage is set to touch-action: pan-y, which hands every vertical gesture
       to the page, so tilt is a mouse, trackpad and stylus gesture there and
       a finger still scrolls past the model rather than being caught by it. */
    host.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      aim(cam.yaw + (e.clientX - lastX) * 0.006,
          cam.pitch + (e.clientY - lastY) * 0.004);
      lastX = e.clientX; lastY = e.clientY;
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) {
      host.addEventListener(ev, function () { dragging = false; });
    });
    /* a slow idle turn, so a still page shows it is a solid. It stops the
       moment anyone takes hold of it, and it never starts at all for a
       reader who asked their device to stop animating. Read live rather
       than once, so changing the setting takes effect without a reload. */
    var still = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)');
    (function spin() {
      if (idle && !(still && still.matches)) turn(0.0016);
      requestAnimationFrame(spin);
    })();
    return { turn: turn, aim: aim, cam: function () { return cam; },
             retarget: retarget, redraw: draw };
  }

  /* Two framings of the bridge. The span camera is the one that was here and
     is untouched. The tower camera swings round to look nearly along the
     roadway, because an arch cut through a tower can only be read from in
     front of it, and drops the pitch so the 117 ft of height reads as height.
     The zoom is not a guess: the tower is 276.5 ft, the model scale is 0.115
     units per foot, so 276.5 x 0.115 x 9.1 is 289 px of a 340 px box, which
     leaves the arch about 35 px across instead of 10. */
  var BRIDGE_CAMS = {
    span: function () { return makeCam(-0.62, 0.32, 2.6, 300, 220); },
    tower: function () { return makeCam(-1.35, 0.18, 9.1, 470, 318); }
  };
  /* Where each view runs out of room, measured rather than guessed: the
     drawing's own bounding box was read against the 720 x 620 viewBox at
     every twentieth of a radian. The span view is the tight one because a
     1,595 ft deck swings into vertical screen space as the eye rises, and it
     starts leaving the top of the box at 0.50. The tower view is nine times
     zoomed so it goes over almost at once. The Empire State is a tall thin
     thing and holds to 0.75, which is far enough to look down on the
     setbacks and the roof of the tower. */
  /* The tower ceiling was 0.30, measured for the scene that stood here before
     the 2026-09-05 rebuild. The rebuilt tower is taller in the frame (a cut
     stub of deck and cables either side, a real cornice and parapet), and at
     0.30 its top ran 55 units above a 620 unit box. Re-measured the same way,
     a hundredth of a radian at a time against the drawing's own bounding box:
     0.25 is the last angle that holds, so 0.24 is taken. The span and empire
     ceilings were re-measured too and are unchanged; the empire's ground plane
     has always run past the bottom of the box above pitch 0.5, before this
     rebuild and after it, so that number is left exactly as it was. */
  var TILT_CEIL = { span: 0.44, tower: 0.24, empire: 0.75 };

  var EMPIRE_CAM = function () { return makeCam(-0.7, 0.22, 1, 360, 560); };

  /* ONE FILE PER LANDMARK, the dc-form pattern brought to New York the way
     Bunker Hill brought it to the trail. A rebuilt landmark registers
     window.NYC_FORMS[k] from its own nyc-form-<k>.js and takes over from the
     scene above, resolved at DRAW time because the form files load after
     this one. A form takes the same opts the scene took ({view} for the
     bridge, {openT} for the tower) and returns the same shape:
     { w, h, faces, lines, marks }. The mount, the camera, the labels and the
     opening animation are untouched, so the page's buttons keep working. */
  var SCENES = { bridge: bridgeScene, empire: empireScene };
  function sceneFor(k) {
    var EXT = (typeof window !== 'undefined' && window.NYC_FORMS) || {};
    return EXT[k] || SCENES[k];
  }

  window.NYC3D = {
    scenes: SCENES, scene: sceneFor, renderTo: render,
    cams: { span: BRIDGE_CAMS.span, tower: BRIDGE_CAMS.tower, empire: EMPIRE_CAM },
    helpers: { face: face, box: box, project: project, shade: shade, normal: normal,
               makeCam: makeCam, C: C, SUN: SUN, PITCH_FLOOR: PITCH_FLOOR, TILT_CEIL: TILT_CEIL },
    bridge: function (host, opts) {
      function builder(v) { return function () { return sceneFor('bridge')({ view: v }); }; }
      var view = (opts && opts.view) === 'tower' ? 'tower' : 'span';
      var m = mount(host, builder(view), BRIDGE_CAMS[view](), TILT_CEIL[view]);
      m.view = function (v) {
        v = v === 'tower' ? 'tower' : 'span';
        if (v === view) return view;
        view = v;
        m.retarget(builder(view), BRIDGE_CAMS[view](), TILT_CEIL[view]);
        return view;
      };
      return m;
    },
    empire: function (host) {
      /* The builder reads openT live, so the same mount draws the solid and
         the opened building and there is never a second animation loop
         fighting the first over one box. */
      var openT = 0, anim = null;
      var m = mount(host, function () { return sceneFor('empire')({ openT: openT }); },
                    EMPIRE_CAM(), TILT_CEIL.empire);
      var still = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)');
      /* A floor is invisible edge-on. The opening view starts at pitch 0.22,
         barely above level, where a 128 by 96 ft deck projects five units
         tall in a 620 unit box and reads as a seam rather than as a floor
         you could stand on. So the eye rises with the tower, to 0.55, which
         is well inside the measured 0.75 ceiling and steep enough to look
         down onto both decks. It is a floor, never a ceiling: a reader who
         has already tilted higher keeps their own angle. Closing leaves the
         camera exactly where the reader put it, because taking a view away
         from someone who chose it is worse than an odd angle. */
      var OPEN_PITCH = 0.55;
      function pitchFor(want, now) {
        return want ? Math.max(now, OPEN_PITCH) : now;
      }
      /* Same easing and the same 620 ms as the Met's roof lifting away, so
         the two models on this site open with one motion and not two. A
         reader who asked their device to stop animating is given the end
         state at once, and that is read live rather than once, so changing
         the setting takes effect without a reload. */
      m.open = function (want) {
        var target = want ? 1 : 0;
        if (anim) { cancelAnimationFrame(anim); anim = null; }
        if (still && still.matches) {
          openT = target;
          m.aim(m.cam().yaw, pitchFor(want, m.cam().pitch));
          return !!want;
        }
        var from = openT, t0 = null, dur = 620;
        var p0 = m.cam().pitch, p1 = pitchFor(want, p0);
        function frame(ts) {
          if (t0 === null) t0 = ts;
          var k = Math.min(1, (ts - t0) / dur);
          var e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
          openT = from + (target - from) * e;
          /* aim draws, so the eye rising and the tower parting are one frame
             and not two. */
          m.aim(m.cam().yaw, p0 + (p1 - p0) * e);
          if (k < 1) anim = requestAnimationFrame(frame);
          else { anim = null; openT = target; m.aim(m.cam().yaw, p1); }
        }
        anim = requestAnimationFrame(frame);
        return !!want;
      };
      m.isOpen = function () { return openT > 0.5; };
      return m;
    }
  };
})();
