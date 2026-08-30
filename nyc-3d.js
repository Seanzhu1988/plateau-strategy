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
 *   each, total 6,016 ft. Towers 278 ft above mean high water, deck 127 ft.
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
      parts.push('<polygon points="' + d + '" fill="' + fill + '"' +
        (f.stroke ? ' stroke="' + f.stroke + '" stroke-width="' + (f.width || 0.6) + '"' : '') +
        (f.opacity ? ' opacity="' + f.opacity + '"' : '') +
        ' stroke-linejoin="round"/>');
    });
    (scene.lines || []).forEach(function (l) {
      var a = project(l.a, cam), b = project(l.b, cam);
      parts.push('<line x1="' + a.x.toFixed(1) + '" y1="' + a.y.toFixed(1) +
        '" x2="' + b.x.toFixed(1) + '" y2="' + b.y.toFixed(1) +
        '" stroke="' + l.colour + '" stroke-width="' + (l.width || 1) +
        '" opacity="' + (l.opacity == null ? 1 : l.opacity) + '" stroke-linecap="round"/>');
    });
    (scene.marks || []).forEach(function (m) {
      var p = project(m.at, cam);
      parts.push('<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) +
        '" r="' + (m.r || 4) + '" fill="' + (m.fill || C.navy) + '"/>');
      if (m.text) {
        parts.push('<text x="' + (p.x + 9).toFixed(1) + '" y="' + (p.y + 4).toFixed(1) +
          '" font-size="12" font-weight="700" fill="' + C.ink + '">' + m.text + '</text>');
      }
      if (m.sub) {
        parts.push('<text x="' + (p.x + 9).toFixed(1) + '" y="' + (p.y + 18).toFixed(1) +
          '" font-size="10.5" fill="' + C.label + '">' + m.sub + '</text>');
      }
    });
    host.innerHTML = '<svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" ' +
      'style="display:block;background:' + C.ground + ';border-radius:10px">' +
      (extras || '') + parts.join('') + '</svg>';
  }

  /* ==================== BROOKLYN BRIDGE ==================== */
  /* Feet, origin at the Manhattan tower's centre, x runs to Brooklyn. */
  var BB = {
    span: 1595.5, side: 930, towerH: 278, deckH: 127,
    archH: 117, archW: 33.75, deckW: 85, towerW: 140, towerT: 53
  };

  function bridgeScene(opts) {
    var o = opts || {};
    var f = [], lines = [], marks = [];
    var S = 0.115;                              /* feet to model units */
    function P(x, y, z) { return [x * S, y * S, z * S]; }
    var halfW = BB.deckW / 2, dz = BB.deckH;
    var x0 = -300, x1 = BB.span + 300;   /* the main span and a little approach */

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
    [0, BB.span].forEach(function (tx) {
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
      /* the point of each arch, drawn on the face so the Gothic reads */
      [-1, 1].forEach(function (sd) {
        var c = sd * (aw / 2 + pier / 2 + aw / 2);   /* centre of that opening */
        var top = dz + BB.archH, spring = dz + BB.archH * 0.62;
        [-tt, tt].forEach(function (xf) {
          lines.push({ a: P(tx + xf, c - aw / 2, spring), b: P(tx + xf, c, top),
                       colour: C.stoneEdge, width: 1.2 });
          lines.push({ a: P(tx + xf, c + aw / 2, spring), b: P(tx + xf, c, top),
                       colour: C.stoneEdge, width: 1.2 });
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
    [-1, 1].forEach(function (side) {
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

    if (o.marks !== false) {
      marks.push({ at: P(0, 0, BB.towerH + 40), text: 'Manhattan tower',
                   sub: '278 ft above the water' });
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

  function empireScene(opts) {
    var o = opts || {};
    var f = [], lines = [], marks = [];
    var S = 0.30;
    function P(x, y, z) { return [x * S, y * S, z * S]; }
    var FH = ES.roof / 102;                       /* mean storey, 12.25 ft */

    /* the block it stands on */
    f.push(face([P(-420, -420, 0), P(420, -420, 0), P(420, 420, 0), P(-420, 420, 0)],
                C.ground, { flat: true }));

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
      f = f.concat(box(P(-s.w / 2, 0, 0)[0], P(s.w / 2, 0, 0)[0],
                       P(0, -s.d / 2, 0)[1], P(0, s.d / 2, 0)[1],
                       P(0, 0, z)[2], P(0, 0, top)[2], C.stoneTop));
      /* the vertical window bands that make it read as Art Deco limestone */
      var bands = Math.max(3, Math.round(s.w / 26));
      for (var i = 1; i < bands; i++) {
        var xx = -s.w / 2 + (s.w * i / bands);
        lines.push({ a: P(xx, -s.d / 2 - 0.5, z + 6), b: P(xx, -s.d / 2 - 0.5, top - 4),
                     colour: C.glassEdge, width: 1.1, opacity: 0.75 });
      }
      z = top;
    });

    /* the mooring mast and the antenna to the tip */
    f = f.concat(box(P(-30, 0, 0)[0], P(30, 0, 0)[0],
                     P(0, -26, 0)[1], P(0, 26, 0)[1],
                     P(0, 0, ES.roof - 40)[2], P(0, 0, ES.roof)[2], C.stoneTop));
    lines.push({ a: P(0, 0, ES.roof), b: P(0, 0, ES.tip), colour: C.ink, width: 2.4 });

    if (o.marks !== false) {
      marks.push({ at: P(0, 0, ES.tip + 24), text: '1,454 ft to the tip' });
      marks.push({ at: P(78, 0, ES.obs102), fill: C.hi, text: '102nd floor',
                   sub: 'enclosed, 1,224 ft, the small one' });
      marks.push({ at: P(96, 0, ES.obs86), fill: C.navy, text: '86th floor',
                   sub: 'open air, 1,050 ft, the one people mean' });
      marks.push({ at: P(150, 0, ES.baseH), text: 'Fifth Avenue',
                   sub: 'the entrance and the line' });
    }
    return { w: 720, h: 620, faces: f, lines: lines, marks: marks };
  }

  /* ---- mounting: drag to turn, and it turns on its own until you touch ---- */
  function mount(host, build, cam0) {
    var cam = cam0, dragging = false, lastX = 0, idle = true;
    function draw() { render(host, build(), cam); }
    draw();
    function turn(dx) {
      cam = makeCam(cam.yaw + dx, cam.pitch, cam.zoom, cam.ox, cam.oy);
      draw();
    }
    host.addEventListener('pointerdown', function (e) {
      dragging = true; idle = false; lastX = e.clientX;
      host.setPointerCapture && host.setPointerCapture(e.pointerId);
    });
    host.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      turn((e.clientX - lastX) * 0.006); lastX = e.clientX;
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) {
      host.addEventListener(ev, function () { dragging = false; });
    });
    /* a slow idle turn, so a still page shows it is a solid, and it stops
       the moment anyone takes hold of it */
    (function spin() {
      if (idle) turn(0.0016);
      requestAnimationFrame(spin);
    })();
    return { turn: turn };
  }

  window.NYC3D = {
    bridge: function (host) {
      return mount(host, bridgeScene, makeCam(-0.62, 0.32, 2.6, 300, 220));
    },
    empire: function (host) {
      return mount(host, empireScene, makeCam(-0.7, 0.22, 1, 360, 560));
    }
  };
})();
