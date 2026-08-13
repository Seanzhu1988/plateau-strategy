/* Inside the Met, on footprints.
 *
 * The whole drawing lives here as data: two floors of named rooms in true
 * relative position, and the corridors between them. It is OUR schematic,
 * not the museum's copyrighted map. Fifth Avenue is on the right of the
 * sheet, Central Park on the left, which is how the building actually sits.
 *
 * The route is footprint thinking applied indoors. GPS dies inside stone
 * wings (the recorder's own rule refuses fixes worse than 35 metres, and
 * most of the Met is worse), so an indoor corridor is verified the honest
 * way instead: a person walks it once with the recorder, and the measured
 * minutes replace the tilde estimate on this page automatically via
 * /api/footprints/walked. Until then every walking time says what it is:
 * an estimate.
 */
(function () {
  'use strict';

  /* ---- the rooms. GALLERY CARDS (names, minutes, notes) are filled by
     met-cards.js, generated and fact-checked separately; this file owns
     geometry and behaviour so a content fix never touches the drawing. */
  var ROOMS = {
    /* floor 1 */
    'great-hall':    { f: 1, x: 560, y: 230, w: 150, h: 110, sub: 'ENTER HERE' },
    'egyptian':      { f: 1, x: 560, y:  70, w: 150, h: 130 },
    'dendur':        { f: 1, x: 300, y:  40, w: 220, h:  95 },
    'american-court':{ f: 1, x:  60, y:  40, w: 200, h:  95 },
    'arms-armor':    { f: 1, x: 330, y: 185, w: 180, h:  85 },
    'medieval':      { f: 1, x: 330, y: 305, w: 180, h:  80 },
    'lehman':        { f: 1, x:  60, y: 280, w: 180, h: 105 },
    'greek-roman':   { f: 1, x: 560, y: 375, w: 150, h: 145 },
    'modern':        { f: 1, x:  60, y: 415, w: 200, h: 105 },
    'grand-stair':   { f: 1, x: 500, y: 250, w:  45, h:  70, sub: 'TO FLOOR 2' },
    /* floor 2 */
    'grand-stair-2': { f: 2, x: 500, y: 250, w:  45, h:  70, sub: 'TO FLOOR 1' },
    'euro-paintings':{ f: 2, x: 290, y: 140, w: 195, h: 140 },
    'nineteenth-century': { f: 2, x: 60, y: 300, w: 210, h: 120 },
    'asian-astor':   { f: 2, x: 290, y:  40, w: 195, h:  80 },
    'islamic':       { f: 2, x: 560, y: 375, w: 150, h: 120 }
  };

  /* corridors: [roomA, roomB, estimated walking minutes]. The key we file a
     corridor under with the footprints store is met-<a>--<b>. */
  var EDGES = [
    ['great-hall', 'egyptian', 2],
    ['egyptian', 'dendur', 3],
    ['dendur', 'american-court', 2],
    ['great-hall', 'arms-armor', 2],
    ['arms-armor', 'medieval', 1],
    ['medieval', 'lehman', 2],
    ['great-hall', 'greek-roman', 2],
    ['greek-roman', 'modern', 3],
    ['medieval', 'modern', 3],
    ['great-hall', 'grand-stair', 1],
    ['grand-stair', 'grand-stair-2', 2],
    ['grand-stair-2', 'euro-paintings', 2],
    ['euro-paintings', 'nineteenth-century', 2],
    ['euro-paintings', 'asian-astor', 2],
    ['asian-astor', 'islamic', 3],
    ['islamic', 'grand-stair-2', 2]
  ];

  var CARDS = window.MET_CARDS || {};
  var walkedMinutes = {};   /* corridor key -> measured minutes, when surveyed */

  function corridorKey(a, b) {
    return 'met-' + [a, b].sort().join('--');
  }

  /* ---- graph ---- */
  var ADJ = {};
  EDGES.forEach(function (e) {
    (ADJ[e[0]] = ADJ[e[0]] || []).push({ to: e[1], min: e[2] });
    (ADJ[e[1]] = ADJ[e[1]] || []).push({ to: e[0], min: e[2] });
  });

  function shortestPath(a, b) {
    /* Dijkstra over a 16-node graph. Returns the room sequence. */
    var dist = {}, prev = {}, todo = Object.keys(ROOMS);
    todo.forEach(function (k) { dist[k] = Infinity; });
    dist[a] = 0;
    while (todo.length) {
      todo.sort(function (x, y) { return dist[x] - dist[y]; });
      var u = todo.shift();
      if (u === b || dist[u] === Infinity) break;
      (ADJ[u] || []).forEach(function (e) {
        if (todo.indexOf(e.to) < 0) return;
        var d = dist[u] + legMinutes(u, e.to);
        if (d < dist[e.to]) { dist[e.to] = d; prev[e.to] = u; }
      });
    }
    var path = [b];
    while (path[0] !== a) {
      if (prev[path[0]] === undefined) return null;
      path.unshift(prev[path[0]]);
    }
    return path;
  }

  function edgeEst(a, b) {
    for (var i = 0; i < EDGES.length; i++) {
      var e = EDGES[i];
      if ((e[0] === a && e[1] === b) || (e[0] === b && e[1] === a)) return e[2];
    }
    return 3;
  }
  function legMinutes(a, b) {
    var m = walkedMinutes[corridorKey(a, b)];
    return (typeof m === 'number' && m > 0) ? m : edgeEst(a, b);
  }
  function legIsMeasured(a, b) {
    return typeof walkedMinutes[corridorKey(a, b)] === 'number';
  }

  /* ---- state ---- */
  var picked = [];        /* room keys in visit order, no stair nodes */
  var floor = 1;

  /* ---- drawing ---- */
  function center(k) {
    var r = ROOMS[k];
    return [r.x + r.w / 2, r.y + r.h / 2];
  }

  function roomRect(k) {
    var r = ROOMS[k];
    var card = CARDS[k] || {};
    var picks = picked.indexOf(k);
    var g = ['<g data-room="' + k + '">',
      '<rect class="room' + (picks >= 0 ? ' picked' : '') + '" x="' + r.x + '" y="' + r.y +
        '" width="' + r.w + '" height="' + r.h + '" rx="7"></rect>',
      '<text class="rlabel" x="' + (r.x + 10) + '" y="' + (r.y + 22) + '">' +
        (card.name || k) + '</text>'];
    var subline = r.sub || (card.minutes ? '~' + card.minutes + ' MIN INSIDE' : '');
    if (subline) {
      g.push('<text class="rsub" x="' + (r.x + 10) + '" y="' + (r.y + 38) + '">' + subline + '</text>');
    }
    if (picks >= 0) {
      var cx = r.x + r.w - 16, cy = r.y + 16;
      g.push('<circle class="order-dot" cx="' + cx + '" cy="' + cy + '" r="11"></circle>');
      g.push('<text class="order" x="' + cx + '" y="' + (cy + 4) + '" text-anchor="middle">' + (picks + 1) + '</text>');
    }
    g.push('</g>');
    return g.join('');
  }

  function footprintsAlong(a, b) {
    /* Pairs of small ellipses stamped along the corridor, alternating left
       and right of the line: the identity of the whole product, drawn. */
    var pa = center(a), pb = center(b);
    var dx = pb[0] - pa[0], dy = pb[1] - pa[1];
    var len = Math.sqrt(dx * dx + dy * dy);
    var ux = dx / len, uy = dy / len;        /* along */
    var px = -uy, py = ux;                   /* across */
    var out = [];
    var step = 26;
    for (var d = 30; d < len - 30; d += step) {
      var side = (Math.floor(d / step) % 2 === 0) ? 4.5 : -4.5;
      var x = pa[0] + ux * d + px * side;
      var y = pa[1] + uy * d + py * side;
      var ang = Math.atan2(dy, dx) * 180 / Math.PI + 90;
      out.push('<ellipse class="trail" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) +
               '" rx="2.6" ry="4.6" transform="rotate(' + ang.toFixed(0) + ' ' +
               x.toFixed(1) + ' ' + y.toFixed(1) + ')"></ellipse>');
    }
    return out.join('');
  }

  function fullRoute() {
    /* the picked rooms joined by shortest paths, stairs inserted free */
    if (picked.length < 1) return [];
    var seq = [picked[0]];
    for (var i = 1; i < picked.length; i++) {
      var part = shortestPath(seq[seq.length - 1], picked[i]);
      if (!part) continue;
      seq = seq.concat(part.slice(1));
    }
    return seq;
  }

  function draw() {
    var seq = fullRoute();
    var svg = ['<svg viewBox="0 0 760 560" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Schematic floor ' + floor + ' of the Met">'];
    svg.push('<path class="park" d="M20,10 L20,550"></path>');
    svg.push('<text class="avenue" x="742" y="290" transform="rotate(90 742 290)">FIFTH AVENUE</text>');
    svg.push('<text class="avenue" x="30" y="24">CENTRAL PARK</text>');
    /* corridors on this floor, faint */
    EDGES.forEach(function (e) {
      if (ROOMS[e[0]].f !== floor || ROOMS[e[1]].f !== floor) return;
      var a = center(e[0]), b = center(e[1]);
      svg.push('<line class="corridor" x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '"></line>');
    });
    /* the walked trail */
    for (var i = 1; i < seq.length; i++) {
      if (ROOMS[seq[i - 1]].f !== floor || ROOMS[seq[i]].f !== floor) continue;
      svg.push(footprintsAlong(seq[i - 1], seq[i]));
    }
    /* rooms on top */
    Object.keys(ROOMS).forEach(function (k) {
      if (ROOMS[k].f === floor) svg.push(roomRect(k));
    });
    svg.push('</svg>');
    document.getElementById('svgHost').innerHTML = svg.join('');
    document.getElementById('sheetNo').textContent = 'MET-0' + floor + ' · Floor ' + floor;
    document.getElementById('tabF1').setAttribute('aria-current', floor === 1 ? 'true' : 'false');
    document.getElementById('tabF2').setAttribute('aria-current', floor === 2 ? 'true' : 'false');
    drawPlan(seq);
  }

  function drawPlan(seq) {
    var host = document.getElementById('planLegs');
    var total = document.getElementById('planTotal');
    if (!picked.length) {
      host.innerHTML = '<p class="plan-empty">Tap rooms on the sheet, in the order ' +
        'you want to see them. The Grand Staircase is added by itself when your ' +
        'route changes floors.</p>';
      total.textContent = 'Nothing picked yet';
      return;
    }
    var mins = 0, walkMins = 0, anyEstimate = false, html = [];
    var n = 0;
    for (var i = 0; i < seq.length; i++) {
      var k = seq[i];
      var card = CARDS[k] || {};
      if (i > 0) {
        var wm = legMinutes(seq[i - 1], seq[i]);
        var measured = legIsMeasured(seq[i - 1], seq[i]);
        if (!measured) anyEstimate = true;
        walkMins += wm;
        html.push('<div class="leg-walk">👣 ' + (measured ? wm + ' min, walked by a surveyor'
                  : '~' + wm + ' min, estimate') + '</div>');
      }
      var isStop = picked.indexOf(k) >= 0;
      if (isStop) {
        n += 1;
        var dwell = card.minutes || 10;
        mins += dwell;
        html.push('<div class="leg"><span class="leg-n">' + n + '</span><div>' +
          '<div class="leg-name">' + (card.name || k) + '</div>' +
          (card.one_line ? '<p class="leg-hl">' + card.one_line + '</p>' : '') +
          (card.highlights ? '<p class="leg-hl">' + card.highlights.map(function (h) {
              return '<b>' + h.work + '.</b> ' + h.note;
            }).join(' ') + '</p>' : '') +
          '</div><span class="leg-min">~' + dwell + ' min</span></div>');
      } else {
        html.push('<div class="leg-walk">through ' + ((CARDS[k] || {}).name || k) + '</div>');
      }
    }
    host.innerHTML = html.join('');
    var t = mins + walkMins;
    var hrs = Math.floor(t / 60), rem = t % 60;
    total.textContent = n + ' stop' + (n === 1 ? '' : 's') + ' · ' +
      (hrs ? hrs + ' h ' : '') + rem + ' min total · ' + walkMins + ' of it walking' +
      (anyEstimate ? ' · times with ~ are estimates' : ' · all corridors walked');
  }

  /* ---- interaction ---- */
  document.getElementById('svgHost').addEventListener('click', function (e) {
    var g = e.target.closest('[data-room]');
    if (!g) return;
    var k = g.getAttribute('data-room');
    if (k === 'grand-stair' || k === 'grand-stair-2') return;   /* inserted automatically */
    var i = picked.indexOf(k);
    if (i >= 0) picked.splice(i, 1); else picked.push(k);
    draw();
    syncUrl();
  });
  document.getElementById('tabF1').addEventListener('click', function () { floor = 1; draw(); });
  document.getElementById('tabF2').addEventListener('click', function () { floor = 2; draw(); });
  document.getElementById('btnClear').addEventListener('click', function () {
    picked = []; draw(); syncUrl();
  });
  document.getElementById('btnShare').addEventListener('click', async function () {
    var url = location.origin + '/met' + (picked.length ? '?walk=' + picked.join(',') : '');
    var btn = this;
    if (navigator.share) {
      try { await navigator.share({ title: 'A walk inside the Met', url: url }); return; }
      catch (err) { if (err && err.name === 'AbortError') return; }
    }
    try { await navigator.clipboard.writeText(url); btn.textContent = 'Link copied'; }
    catch (err) { window.prompt('Copy this link:', url); return; }
    setTimeout(function () { btn.textContent = 'Share this walk'; }, 2500);
  });

  function syncUrl() {
    try {
      var u = new URL(location.href);
      if (picked.length) u.searchParams.set('walk', picked.join(','));
      else u.searchParams.delete('walk');
      history.replaceState(null, '', u);
    } catch (e) {}
  }

  /* ---- boot ---- */
  try {
    var m = /[?&]walk=([^&]+)/.exec(location.search);
    if (m) picked = decodeURIComponent(m[1]).split(',').filter(function (k) {
      return ROOMS[k] && k.indexOf('grand-stair') < 0;
    });
  } catch (e) {}

  /* measured corridor minutes, if any of ours have been walked */
  fetch('/api/footprints/walked').then(function (r) { return r.json(); })
    .then(function (j) {
      (j.corridors || []).forEach(function (c) {
        if (c.key && c.key.indexOf('met-') === 0 && c.minutes) {
          walkedMinutes[c.key] = Math.round(c.minutes);
        }
      });
      draw();
    })
    .catch(function () { draw(); });
  draw();
})();
