/* Inside MoMA, on footprints.
 *
 * The whole drawing lives here as data: three collection floors of named
 * rooms in true relative position, and the corridors between them. It is OUR
 * schematic, not the museum's copyrighted map. The Sculpture Garden side
 * (54th Street) is at the top of the sheet, 53rd Street at the bottom, and
 * the Geffen Wing, the 2019 westward expansion, on the left, which is how
 * the building actually sits: the chronology starts at the garden end and
 * reaches the Geffen rooms mid-story.
 *
 * Floors 5, 4 and 2 are the collection's chronological spine, 1880 to 1950
 * to 1980 to today, confirmed on moma.org's own floor pages before this was
 * drawn. Floors 1, 3 and 6 are lobby, special exhibitions and ticketed
 * shows, which change too often to draw honestly, so they are words on the
 * page instead of boxes on a sheet.
 *
 * Corridor minutes carry the footprint rule from the Met: every time is a
 * tilde estimate until a person walks it once with the recorder, and the
 * measured minutes replace the estimate via /api/footprints/walked.
 */
(function () {
  'use strict';

  /* ---- the rooms. GALLERY CARDS (names, minutes, notes) are filled by
     moma-cards.js, fact-checked separately; this file owns geometry and
     behaviour so a fact fix never touches the drawing. */
  var ROOMS = {
    /* floor 5 · 1880-1950 · galleries 500-523 */
    'six-sculptures': { f: 5, x: 560, y:  40, w: 150, h:  90, sub: 'START HERE' },
    'van-gogh':       { f: 5, x: 560, y: 170, w: 150, h: 110 },
    'demoiselles':    { f: 5, x: 560, y: 320, w: 150, h:  95 },
    'matisse':        { f: 5, x: 330, y: 170, w: 180, h:  95 },
    'monet':          { f: 5, x:  60, y: 170, w: 210, h: 110 },
    'surreal':        { f: 5, x: 330, y: 320, w: 180, h:  95 },
    'american':       { f: 5, x:  60, y: 330, w: 210, h: 100 },
    'stair-5':        { f: 5, x: 470, y: 460, w:  45, h:  60, sub: 'TO FLOOR 4' },
    /* floor 4 · 1950-1980 · galleries 400-421 */
    'stair-4a':       { f: 4, x: 470, y:  60, w:  45, h:  60, sub: 'TO FLOOR 5' },
    'pollock':        { f: 4, x: 560, y: 170, w: 150, h: 110 },
    'sixties':        { f: 4, x: 330, y: 170, w: 180, h: 110 },
    'seventies':      { f: 4, x:  60, y: 170, w: 210, h: 110 },
    'stair-4b':       { f: 4, x: 470, y: 460, w:  45, h:  60, sub: 'TO FLOOR 2' },
    /* floor 2 · 1980-today · galleries 201-216 */
    'stair-2':        { f: 2, x: 470, y:  60, w:  45, h:  60, sub: 'TO FLOOR 4' },
    'contemporary':   { f: 2, x: 330, y: 170, w: 260, h: 120 },
    'atrium':         { f: 2, x:  60, y: 170, w: 210, h: 120 }
  };

  /* corridors: [roomA, roomB, estimated walking minutes]. Filed with the
     footprints store as moma-<a>--<b>. */
  var EDGES = [
    ['six-sculptures', 'van-gogh', 1],
    ['van-gogh', 'demoiselles', 1],
    ['demoiselles', 'matisse', 2],
    ['matisse', 'monet', 2],
    ['matisse', 'surreal', 1],
    ['monet', 'american', 2],
    ['american', 'surreal', 2],
    ['surreal', 'demoiselles', 1],
    ['demoiselles', 'stair-5', 2],
    ['american', 'stair-5', 3],
    ['stair-5', 'stair-4a', 2],
    ['stair-4a', 'pollock', 1],
    ['pollock', 'sixties', 2],
    ['sixties', 'seventies', 2],
    ['sixties', 'stair-4b', 2],
    ['stair-4b', 'stair-2', 2],
    ['stair-2', 'contemporary', 1],
    ['contemporary', 'atrium', 1]
  ];

  window.MOMA_GEOMETRY = { ROOMS: ROOMS, EDGES: EDGES };

  var CARDS = window.MOMA_CARDS || {};
  var walkedMinutes = {};

  function isStair(k) { return k.indexOf('stair') === 0; }
  function corridorKey(a, b) {
    return 'moma-' + [a, b].sort().join('--');
  }

  /* ---- graph ---- */
  var ADJ = {};
  EDGES.forEach(function (e) {
    (ADJ[e[0]] = ADJ[e[0]] || []).push({ to: e[1], min: e[2] });
    (ADJ[e[1]] = ADJ[e[1]] || []).push({ to: e[0], min: e[2] });
  });

  function shortestPath(a, b) {
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
  var picked = [];
  var lastTotalMin = 0;
  var floor = 5;         /* the story starts where the chronology does */

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
     way you are walking. Same mark as the Met's sheet; one footprint
     language across the site. */
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

  var stepCounter = 0;

  function footprintsAlong(a, b) {
    var pa = center(a), pb = center(b);
    var dx = pb[0] - pa[0], dy = pb[1] - pa[1];
    var len = Math.sqrt(dx * dx + dy * dy);
    var ux = dx / len, uy = dy / len;
    var px = -uy, py = ux;
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

  var routeGaps = [];

  function fullRoute() {
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
    var svg = ['<svg viewBox="0 0 760 560" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Schematic floor ' + f + ' of MoMA">'];
    svg.push('<path class="park" d="M20,10 L740,10"></path>');
    svg.push('<text class="avenue" x="30" y="26">THE SCULPTURE GARDEN · 54TH STREET</text>');
    svg.push('<text class="avenue" x="30" y="550">53RD STREET</text>');
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

  function draw() {
    var seq = fullRoute();
    stepCounter = 0;
    var host = document.getElementById('svgHost');
    host.innerHTML = floorSVG(floor, seq);
    document.getElementById('sheetNo').textContent = 'MOMA-0' + floor + ' · Floor ' + floor;
    [5, 4, 2].forEach(function (f) {
      document.getElementById('tabF' + f).setAttribute('aria-current', floor === f ? 'true' : 'false');
    });
    drawPlan(seq);
  }

  function drawPlan(seq) {
    var host = document.getElementById('planLegs');
    var total = document.getElementById('planTotal');
    if (!picked.length) {
      host.innerHTML = '<p class="plan-empty">Tap rooms on the sheet, in the order ' +
        'you want to see them. The stairs are added by themselves when your ' +
        'route changes floors.</p>';
      total.textContent = 'Nothing picked yet';
      lastTotalMin = 0;
      return;
    }
    var mins = 0, walkMins = 0, anyEstimate = false, html = [];
    var n = 0, counted = {};
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
          '<div class="leg-name">' + (card.name || k) +
          /* Jason's five minute room narration. Hidden until the mp3 really
             exists; moma.html verifies each one and unhides it, so this same
             markup is correct before and after the recordings land. */
          ' <button class="mg-play" data-room="' + k + '" hidden>Play</button></div>' +
          (card.one_line ? '<p class="leg-hl">' + card.one_line + '</p>' : '') +
          (card.highlights ? '<p class="leg-hl">' + card.highlights.map(function (h) {
              return '<b>' + h.work + '.</b> ' + h.note;
            }).join(' ') + '</p>' : '') +
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

  /* ---- interaction ---- */
  document.getElementById('svgHost').addEventListener('click', function (e) {
    var g = e.target.closest('[data-room]');
    if (!g) return;
    var k = g.getAttribute('data-room');
    if (isStair(k)) return;
    var i = picked.indexOf(k);
    if (i >= 0) picked.splice(i, 1); else picked.push(k);
    draw();
    syncUrl();
  });

  [5, 4, 2].forEach(function (f) {
    document.getElementById('tabF' + f).addEventListener('click', function () {
      floor = f; draw();
    });
  });

  document.getElementById('btnClear').addEventListener('click', function () {
    picked = []; draw(); syncUrl();
  });

  document.getElementById('btnShare').addEventListener('click', async function () {
    var url = location.origin + '/moma' + (picked.length ? '?walk=' + picked.join(',') : '');
    var btn = this;
    if (navigator.share) {
      try { await navigator.share({ title: 'A walk inside MoMA', url: url }); return; }
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
          body: JSON.stringify({ kind: 'moma', walk: picked.join(','), minutes: lastTotalMin })
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
      return ROOMS[k] && !isStair(k);
    });
  } catch (e) {}

  fetch('/api/footprints/walked').then(function (r) { return r.json(); })
    .then(function (j) {
      (j.corridors || []).forEach(function (c) {
        if (c.key && c.key.indexOf('moma-') === 0 && c.minutes) {
          walkedMinutes[c.key] = Math.round(c.minutes);
        }
      });
      draw();
    })
    .catch(function () { draw(); });
  draw();
})();
