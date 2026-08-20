/* The Fifth Avenue front, drawn.
 *
 * A grey extruded footprint is honest about the building's shape and says
 * nothing about which building it is: from above, the Met could be a
 * warehouse. What people recognise, and what tells them they are in the right
 * place as they come up the steps, is the front: the long flight of stairs,
 * the three great arches, the paired columns between them, and the four
 * unfinished stone blocks over the pairs that were never carved.
 *
 * This is OUR drawing of that front, in the same spirit as the floor plan
 * inside: an elevation, not a photograph, so nothing here is copied from the
 * museum's own images. It is deliberately an architect's line drawing rather
 * than a picture, because the whole sheet is a drawing and a photograph would
 * be the only thing on the page pretending to be real.
 *
 * The four blocks above the paired columns are true and worth the detail:
 * Richard Morris Hunt's design called for sculpture there, the money ran out
 * in 1902, and the rough-hewn stone has stayed uncarved ever since.
 */
(function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[<>&"']/g, function (c) {
      return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* One arched bay: the opening, its archivolt, and the shadow inside it. */
  function bay(x, y, w, h) {
    var r = w / 2, cy = y + h - r;
    var d = 'M' + x + ',' + (y + h) +
            'L' + x + ',' + cy +
            'A' + r + ',' + r + ' 0 0 1 ' + (x + w) + ',' + cy +
            'L' + (x + w) + ',' + (y + h) + 'Z';
    return '<path d="' + d + '" fill="#6f6960"/>' +
           '<path d="' + d + '" fill="none" stroke="#4c4740" stroke-width="2.5"/>' +
           '<path d="M' + (x + 9) + ',' + (y + h) + 'L' + (x + 9) + ',' + cy +
             'A' + (r - 9) + ',' + (r - 9) + ' 0 0 1 ' + (x + w - 9) + ',' + cy +
             'L' + (x + w - 9) + ',' + (y + h) + 'Z" fill="#565049"/>';
  }

  /* A pair of columns on a plinth, with the uncarved block above them. */
  function columnPair(x, yTop, yBase) {
    var h = yBase - yTop, w = 15, gap = 13, out = [];
    [0, w + gap].forEach(function (dx) {
      var cx = x + dx;
      out.push('<rect x="' + cx + '" y="' + (yTop + 12) + '" width="' + w + '" height="' + (h - 22) +
               '" fill="#e6e0d3" stroke="#b9b1a0" stroke-width="1"/>');
      /* fluting, three strokes is enough to read as a column */
      [4, 7.5, 11].forEach(function (fx) {
        out.push('<line x1="' + (cx + fx) + '" y1="' + (yTop + 18) + '" x2="' + (cx + fx) +
                 '" y2="' + (yBase - 12) + '" stroke="#cfc7b6" stroke-width="1"/>');
      });
      out.push('<rect x="' + (cx - 3) + '" y="' + (yTop + 4) + '" width="' + (w + 6) +
               '" height="9" fill="#ded7c8" stroke="#b9b1a0" stroke-width="1"/>');
      out.push('<rect x="' + (cx - 3) + '" y="' + (yBase - 12) + '" width="' + (w + 6) +
               '" height="10" fill="#ded7c8" stroke="#b9b1a0" stroke-width="1"/>');
    });
    return out.join('');
  }

  /* The stone that was never carved. */
  function uncarvedBlock(x, y, w, h) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h +
           '" fill="#d8d0be" stroke="#a89f8c" stroke-width="1.5"/>' +
           '<path d="M' + (x + 4) + ',' + (y + h - 5) + ' l6,-9 l7,7 l5,-11 l8,13 Z" ' +
           'fill="#c9c0ab" opacity=".75"/>';
  }

  function build() {
    var bayXs;
    var W = 940, H = 470;
    var groundY = 402, baseY = 352, capY = 176, atticY = 128, roofY = 104;
    var s = ['<svg viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" role="img" ' +
             'aria-label="An elevation drawing of the Fifth Avenue front of the Metropolitan ' +
             'Museum of Art: the grand staircase, three arched entrances, paired columns, and ' +
             'the four blocks of stone that were never carved.">'];

    /* sky is left blank: this is a sheet, not a scene */
    /* the two flanking wings */
    [[92, 232], [616, 232]].forEach(function (p) {
      s.push('<rect x="' + p[0] + '" y="' + capY + '" width="' + p[1] + '" height="' +
             (baseY - capY) + '" fill="#efe9dc" stroke="#b9b1a0" stroke-width="1.5"/>');
      /* pilasters and windows, enough rhythm to read as the same building */
      for (var i = 0; i < 5; i++) {
        var wx = p[0] + 22 + i * 40;
        s.push('<rect x="' + wx + '" y="' + (capY + 46) + '" width="20" height="74" ' +
               'fill="#6f6960" stroke="#4c4740" stroke-width="1.5"/>');
        s.push('<line x1="' + (wx - 9) + '" y1="' + (capY + 16) + '" x2="' + (wx - 9) +
               '" y2="' + (baseY - 8) + '" stroke="#cfc7b6" stroke-width="2"/>');
      }
      s.push('<rect x="' + p[0] + '" y="' + (capY - 16) + '" width="' + p[1] +
             '" height="18" fill="#ded7c8" stroke="#b9b1a0" stroke-width="1.5"/>');
    });

    /* the centre block */
    s.push('<rect x="316" y="' + roofY + '" width="308" height="' + (baseY - roofY) +
           '" fill="#f3eee2" stroke="#b9b1a0" stroke-width="2"/>');
    /* attic storey above the cornice */
    s.push('<rect x="316" y="' + roofY + '" width="308" height="' + (atticY - roofY) +
           '" fill="#e9e3d5" stroke="#b9b1a0" stroke-width="1.5"/>');

    /* three arched entrances */
    bayXs = [340, 432, 524];
    bayXs.forEach(function (bx) { s.push(bay(bx, 212, 76, 140)); });

    /* paired columns between and outside the arches, on their plinths */
    [318, 410, 502, 594].forEach(function (cx) {
      s.push(columnPair(cx, 176, 352));
    });

    /* the entablature the columns carry */
    s.push('<rect x="304" y="' + (capY - 22) + '" width="332" height="24" fill="#ded7c8" ' +
           'stroke="#b9b1a0" stroke-width="1.5"/>');

    /* the four uncarved blocks, one above each pair */
    [318, 410, 502, 594].forEach(function (cx) {
      s.push(uncarvedBlock(cx - 6, atticY + 2, 55, 44));
    });

    /* the great staircase */
    for (var i = 0; i < 9; i++) {
      var y = baseY + i * 5.6, inset = i * 3;
      s.push('<rect x="' + (250 - inset * 2) + '" y="' + y + '" width="' + (440 + inset * 4) +
             '" height="6.4" fill="' + (i % 2 ? '#e4ddcd' : '#ebe5d7') +
             '" stroke="#c3bbaa" stroke-width="0.8"/>');
    }
    /* the pavement line */
    s.push('<line x1="60" y1="' + groundY + '" x2="880" y2="' + groundY +
           '" stroke="#b9b1a0" stroke-width="2"/>');

    /* two figures, for scale, because eleven acres means nothing without one */
    [[214, groundY], [742, groundY]].forEach(function (p) {
      s.push('<g opacity=".55"><circle cx="' + p[0] + '" cy="' + (p[1] - 26) + '" r="4" fill="#6f6960"/>' +
             '<path d="M' + p[0] + ',' + (p[1] - 22) + ' L' + p[0] + ',' + (p[1] - 9) +
             ' M' + p[0] + ',' + (p[1] - 9) + ' L' + (p[0] - 5) + ',' + p[1] +
             ' M' + p[0] + ',' + (p[1] - 9) + ' L' + (p[0] + 5) + ',' + p[1] +
             '" stroke="#6f6960" stroke-width="2" fill="none" stroke-linecap="round"/></g>');
    });

    s.push('<text class="mf-title" x="470" y="' + (groundY + 34) + '" text-anchor="middle">' +
           'The Metropolitan Museum of Art</text>');
    s.push('<text class="mf-sub" x="470" y="' + (groundY + 56) + '" text-anchor="middle">' +
           'Fifth Avenue at 82nd Street · our elevation, not to scale · tap to go inside</text>');
    s.push('</svg>');
    return s.join('');
  }


  window.MetFacade = { build: build };
})();
