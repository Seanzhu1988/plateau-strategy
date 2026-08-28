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

  /* One source of truth for the building's shape: met-3d.js extrudes these
     same rooms and corridors into a solid, so the flat sheet and the 3D
     view can never quietly disagree about where a gallery sits. */
  window.MET_GEOMETRY = { ROOMS: ROOMS, EDGES: EDGES };

  /* The narrator next door needs two things: the walk the reader picked, and
     a way to light the gallery it is describing. Both go through here so the
     drawing stays the one thing that knows how to draw. */
  var spotlight = null;
  window.MET_ROUTE = function () { return picked.slice(); };
  window.MET_SPOTLIGHT = function (key) { spotlight = key || null; draw(); };

  var CARDS = window.MET_CARDS || {};
  /* Real works from the Met's Open Access program (CC0), baked at build time
     by bake_met_art.py — the API has no CORS so live fetch was never an
     option. A stop with no matched art renders nothing: absence over guess. */
  function artStrip(k) {
    var arts = (window.MET_ART || {})[k] || [];
    if (!arts.length) return '';
    return '<div class="leg-art">' + arts.map(function (a) {
      var cap = a.artist ? a.artist.split(',')[0] : a.title;
      return '<a href="' + a.href + '" target="_blank" rel="noopener">' +
        '<img src="' + a.img + '" alt="' + (a.title || a.work).replace(/"/g, '&quot;') +
        '" loading="lazy">' +
        '<span class="la-t">' + cap + '</span></a>';
    }).join('') + '</div>';
  }
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
  var lastTotalMin = 0;   /* what the plan footer last added up, for saving */
  var floor = 1;
  /* The page always opens FLAT. Remembering 3D across visits was tried
     and it read as a defect: the owner tapped 3D once, came back later,
     and reported the site was crooked. A view you did not just choose
     should never be the view you land in. */
  var mode = 'flat';

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

  /* One footprint: a pad with a TOE ahead of it, so every print points the
     way you are walking. Direction was the owner's ask, and an ellipse alone
     cannot show it: it reads the same forwards and backwards. */
  function onePrint(x, y, ux, uy, stepIdx) {
    var ang = Math.atan2(uy, ux) * 180 / Math.PI + 90;
    var tx = x + ux * 5.6, ty = y + uy * 5.6;
    var delay = (stepIdx * 0.22).toFixed(2);
    return '<g class="print" style="animation-delay:' + delay + 's">' +
      '<ellipse class="trail" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) +
        '" rx="2.5" ry="4.2" transform="rotate(' + ang.toFixed(0) + ' ' +
        x.toFixed(1) + ' ' + y.toFixed(1) + ')"></ellipse>' +
      '<circle class="trail" cx="' + tx.toFixed(1) + '" cy="' + ty.toFixed(1) +
        '" r="1.5"></circle></g>';
  }

  /* The step counter runs across the WHOLE route, not per corridor, so the
     prints appear in true walking order from the first room to the last,
     across floors. That sequence is the direction, made visible. */
  var stepCounter = 0;

  function footprintsAlong(a, b) {
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
      out.push(onePrint(x, y, ux, uy, stepCounter));
      stepCounter += 1;
    }
    return out.join('');
  }

  var routeGaps = [];   /* picks no drawn corridor can reach, latest plan */

  function fullRoute() {
    /* The picked rooms joined by shortest paths, stairs inserted free.
       A pick that no corridor reaches used to be dropped in silence, which
       is a plan quietly losing a destination; now it is recorded and the
       walk list says so out loud. The route itself still leaves it out,
       because footprints only walk corridors that exist. */
    routeGaps = [];
    if (picked.length < 1) return [];
    var seq = [picked[0]];
    for (var i = 1; i < picked.length; i++) {
      var part = shortestPath(seq[seq.length - 1], picked[i]);
      if (!part) { routeGaps.push(picked[i]); continue; }
      seq = seq.concat(part.slice(1));
    }
    return seq;
  }

  function floorSVG(f, seq) {
    var svg = ['<svg viewBox="0 0 760 560" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Schematic floor ' + f + ' of the Met">'];
    svg.push('<path class="park" d="M20,10 L20,550"></path>');
    svg.push('<text class="avenue" x="742" y="290" transform="rotate(90 742 290)">FIFTH AVENUE</text>');
    svg.push('<text class="avenue" x="30" y="24">CENTRAL PARK</text>');
    EDGES.forEach(function (e) {
      if (ROOMS[e[0]].f !== f || ROOMS[e[1]].f !== f) return;
      var a = center(e[0]), b = center(e[1]);
      svg.push('<line class="corridor" x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '"></line>');
    });
    for (var i = 1; i < seq.length; i++) {
      if (ROOMS[seq[i - 1]].f !== f || ROOMS[seq[i]].f !== f) continue;
      svg.push(footprintsAlong(seq[i - 1], seq[i]));
    }
    Object.keys(ROOMS).forEach(function (k) {
      if (ROOMS[k].f === f) svg.push(roomRect(k));
    });
    svg.push('</svg>');
    return svg.join('');
  }

  /* The 3D view: both floors as slabs. spin is the reader's hand, and it
     starts at zero: the building stands straight until the reader turns
     it. The first version opened pre-leaned 24 degrees, and a lean nobody
     asked for just looks broken. */
  var spin = 0;

  function worldTransform() {
    return 'rotateX(56deg) rotateZ(' + spin + 'deg)';
  }

  function draw() {
    var seq = fullRoute();
    stepCounter = 0;
    var host = document.getElementById('svgHost');
    if (mode === '3d') {
      /* The solid, not the sheets under a tilt: met-3d.js extrudes the same
         rooms into volumes inside the museum's real footprint, and projects
         them itself so the building can be turned. */
      var walkedFlags = {};
      Object.keys(walkedMinutes).forEach(function (k) { walkedFlags[k] = true; });
      /* Closed, this is the building's own massing: its real footprint,
         extruded. A photograph was tried here and looked wrong, not because
         the picture was bad but because every other mark on this sheet is a
         drawing, and the photograph was the only thing pretending to be real. */
      _opts3d = { route: seq, walked: walkedFlags, current: spotlight };
      window.Met3D.attach(host, _opts3d);

      var out = document.getElementById('btnOutside');
      if (out) out.hidden = !window.Met3D.isOpen();
      var fk = window.Met3D.focusedRoom && window.Met3D.focusedRoom();
      var fc = fk ? ((window.MET_CARDS || {})[fk] || {}) : null;
      document.getElementById('sheetNo').textContent =
        fk ? 'MET-3D · ' + (fc.name || fk) : 'MET-3D · Both floors';
    } else {
      host.innerHTML = floorSVG(floor, seq);
      document.getElementById('sheetNo').textContent = 'MET-0' + floor + ' · Floor ' + floor;
    }
    document.getElementById('tabF1').setAttribute('aria-current', mode === 'flat' && floor === 1 ? 'true' : 'false');
    document.getElementById('tabF2').setAttribute('aria-current', mode === 'flat' && floor === 2 ? 'true' : 'false');
    document.getElementById('tab3D').setAttribute('aria-current', mode === '3d' ? 'true' : 'false');
    var hint = document.getElementById('legendHint');
    if (hint) hint.textContent = mode === '3d'
      ? 'Drag to turn the building. Floor 2 floats above Floor 1.'
      : 'Fifth Avenue is to the right; Central Park to the left.';
    drawPlan(seq);
  }

  /* Dragging turns the building. A tap still picks a room: the handler
     below only claims the gesture once the finger has clearly moved, so
     the two do not fight. */
  function wireSpin() {
    var stage = document.getElementById('isoStage');
    var world = document.getElementById('isoWorld');
    if (!stage || !world) return;
    var startX = null, startSpin = spin, moved = false;
    stage.addEventListener('pointerdown', function (e) {
      startX = e.clientX; startSpin = spin; moved = false;
    });
    stage.addEventListener('pointermove', function (e) {
      if (startX === null) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 6) moved = true;
      if (!moved) return;
      spin = Math.max(-70, Math.min(25, startSpin + dx * 0.25));
      world.style.transform = worldTransform();
    });
    stage.addEventListener('pointerup', function () { startX = null; });
    stage.addEventListener('pointercancel', function () { startX = null; });
    /* a drag must not also count as a tap on whatever room it ended over */
    stage.addEventListener('click', function (e) {
      if (moved) { e.stopPropagation(); moved = false; }
    }, true);
  }

  function drawPlan(seq) {
    var host = document.getElementById('planLegs');
    var total = document.getElementById('planTotal');
    if (!picked.length) {
      host.innerHTML = '<p class="plan-empty">Tap rooms on the sheet, in the order ' +
        'you want to see them. The Grand Staircase is added by itself when your ' +
        'route changes floors.</p>';
      total.textContent = 'Nothing picked yet';
      lastTotalMin = 0;
      return;
    }
    var mins = 0, walkMins = 0, anyEstimate = false, html = [];
    var n = 0, counted = {};   /* a stop is visited once; walking back
                                  through it later is passage, not a
                                  second visit with a second bill */
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
      var isStop = picked.indexOf(k) >= 0 && !counted[k];
      if (isStop) {
        counted[k] = true;
        n += 1;
        var dwell = card.minutes || 10;
        mins += dwell;
        html.push('<div class="leg"><span class="leg-n">' + n + '</span><div>' +
          '<div class="leg-name">' + (card.name || k) + '</div>' +
          (card.one_line ? '<p class="leg-hl">' + card.one_line + '</p>' : '') +
          (card.highlights ? '<p class="leg-hl">' + card.highlights.map(function (h) {
              return '<b>' + h.work + '.</b> ' + h.note;
            }).join(' ') + '</p>' : '') +
          artStrip(k) +
          '</div><span class="leg-min">~' + dwell + ' min</span></div>');
      } else {
        html.push('<div class="leg-walk">through ' + ((CARDS[k] || {}).name || k) + '</div>');
      }
    }
    routeGaps.forEach(function (gk) {
      var gname = (CARDS[gk] || {}).name || gk.replace(/-/g, ' ');
      html.push('<div class="leg-impossible">⚠ <b>' + gname + '</b><span>' +
        'no drawn corridor reaches it yet · kept in your picks, left out of the plan and the times' +
        '</span></div>');
    });
    host.innerHTML = html.join('');
    var t = mins + walkMins;
    lastTotalMin = t;
    var hrs = Math.floor(t / 60), rem = t % 60;
    total.textContent = n + ' stop' + (n === 1 ? '' : 's') + ' · ' +
      (hrs ? hrs + ' h ' : '') + rem + ' min total · ' + walkMins + ' of it walking' +
      (anyEstimate ? ' · times with ~ are estimates' : ' · all corridors walked') +
      (routeGaps.length ? ' · ' + routeGaps.length + ' pick' +
        (routeGaps.length === 1 ? '' : 's') + ' unreachable' : '');
  }

  var _opts3d = null;   /* what the 3D view was last attached with */

  /* ---- interaction ---- */
  document.getElementById('svgHost').addEventListener('click', function (e) {
    if (mode === '3d') return;   /* in 3D a tap dives into the room instead */
    var g = e.target.closest('[data-room]');
    if (!g) return;
    var k = g.getAttribute('data-room');
    if (k === 'grand-stair' || k === 'grand-stair-2') return;   /* inserted automatically */
    var i = picked.indexOf(k);
    if (i >= 0) picked.splice(i, 1); else picked.push(k);
    draw();
    syncUrl();
  });

  /* ---- the room overview: bar, guide, and sheet number follow the dive ---- */
  var roomBar = document.getElementById('roomBar');
  function roomBarSync(k) {
    var c = (window.MET_CARDS || {})[k] || {};
    document.getElementById('roomBarName').textContent =
      (c.name || k.replace(/-/g, ' ')) + (c.minutes ? ' · ' + c.minutes + ' min' : '');
    document.getElementById('roomBarAdd').textContent =
      picked.indexOf(k) >= 0 ? '✓ In your walk · tap to remove' : '+ Add to my walk';
    document.getElementById('roomBarHear').hidden = !(c.one_line || (c.highlights || []).length);
  }
  function roomBarHide() {
    if (roomBar) roomBar.hidden = true;
    document.getElementById('sheetNo').textContent = 'MET-3D · Both floors';
  }
  document.getElementById('svgHost').addEventListener('met3d:room', function (e) {
    if (!roomBar) return;
    var k = e.detail.room;
    if (e.detail.focused) {
      roomBar.hidden = false;
      roomBar.dataset.room = k;
      roomBarSync(k);
      var c = (window.MET_CARDS || {})[k] || {};
      document.getElementById('sheetNo').textContent = 'MET-3D · ' + (c.name || k);
      if (window.MetGuide && !MetGuide.isPlaying()) MetGuide.preview(k);
    } else {
      roomBarHide();
    }
  });
  if (roomBar) {
    document.getElementById('roomBarBack').addEventListener('click', function () {
      window.Met3D.clearFocus(document.getElementById('svgHost'), _opts3d);
      roomBarHide();
    });
    document.getElementById('roomBarAdd').addEventListener('click', function () {
      var k = roomBar.dataset.room;
      if (!k) return;
      var i = picked.indexOf(k);
      if (i >= 0) picked.splice(i, 1); else picked.push(k);
      draw();
      syncUrl();
      roomBarSync(k);
    });
    document.getElementById('roomBarHear').addEventListener('click', function () {
      if (window.MetGuide && roomBar.dataset.room) MetGuide.playRoom(roomBar.dataset.room);
    });
  }
  document.getElementById('tabF1').addEventListener('click', function () { mode = 'flat'; floor = 1; if (roomBar) roomBar.hidden = true; remember(); draw(); });
  document.getElementById('tabF2').addEventListener('click', function () { mode = 'flat'; floor = 2; if (roomBar) roomBar.hidden = true; remember(); draw(); });
  /* Going in: from the photograph outside to the model inside. */
  function enterBuilding() {
    var host = document.getElementById('svgHost');
    var walkedFlags = {};
    Object.keys(walkedMinutes).forEach(function (k) { walkedFlags[k] = true; });
    host.innerHTML = '';
    window.Met3D.attach(host, { route: fullRoute(), walked: walkedFlags, current: null });
    window.Met3D.openInterior(host, { route: fullRoute(), walked: walkedFlags, current: null });
    var o = document.getElementById('btnOutside');
    if (o) o.hidden = false;
  }

  document.getElementById('tab3D').addEventListener('click', function () { mode = '3d'; remember(); draw(); });
  /* Entering the building is a tap on it; leaving needs a way back. */
  document.getElementById('svgHost').addEventListener('met3d:layer', function () {
    var out = document.getElementById('btnOutside');
    if (out) out.hidden = false;
    /* the doorman: greets on entry, once per visit, and never again */
    if (window.MetGuide && MetGuide.greet) MetGuide.greet();
  });
  var outBtn = document.getElementById('btnOutside');
  if (outBtn) outBtn.addEventListener('click', function () {
    var host = document.getElementById('svgHost');
    if (window.MetGuide) MetGuide.stop();
    if (roomBar) roomBar.hidden = true;
    window.Met3D.closeToExterior(host, { route: fullRoute(), walked: {}, current: null });
    outBtn.hidden = true;
  });
  function remember() { /* deliberately nothing: the page always opens flat */ }
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

  var btnSave = document.getElementById('btnSave');
  function saveFlash(msg) {
    if (!btnSave) return;
    btnSave.textContent = msg;
    setTimeout(function () { btnSave.textContent = 'Save this walk'; }, 2800);
  }
  if (btnSave) btnSave.addEventListener('click', function () {
    if (!picked.length) { saveFlash('Pick rooms first'); return; }
    fetch('/api/auth/reader').then(function (r) { return r.json(); })
      .then(function (who) {
        if (!who || !who.signed_in) { saveFlash('Sign in at the top first'); return; }
        fetch('/api/walks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ kind: 'met', walk: picked.join(','), minutes: lastTotalMin })
        }).then(function (r) { return r.json(); }).then(function (j) {
          if (j.ok) saveFlash(j.duplicate ? 'Already in your walks' : 'Saved, see The Walks');
          else saveFlash((j && j.error) || 'Could not save');
        }).catch(function () { saveFlash('Could not save'); });
      }).catch(function () { saveFlash('Could not save'); });
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
