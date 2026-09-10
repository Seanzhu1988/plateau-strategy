/* met-rooms.js  ·  what is actually inside one gallery
   ====================================================
   The floor plan knows a gallery is a box. Diving into it gave you the same
   box, closer, with numbered stops floating on top. For most rooms that is
   honest: a room of vitrines has no shape worth drawing.

   Gallery 131 is not most rooms. It was BUILT around one object, and the
   room is half the experience: a reflecting pool standing in for the Nile,
   a raked wall standing in for the cliffs of the west bank, and a stippled
   glass wall to give Nubian light to a temple sixty-five hundred miles from
   where it was quarried. Drawing that box as a box loses the whole point.

   So a room may register an interior here, and only Dendur has one. Others
   come later; a room with no entry keeps the plain box and loses nothing.

   The temple's proportions are its REAL published ones, 41 by 21 by 21 feet
   from the Met's own record for object 547802,
   and the pool is the published 30 feet across. The room envelope around
   them is the schematic's, not a survey, and the caption on the page says
   so. Style vocabulary comes from styles-3d.js: an Egyptian wall BATTERS,
   leaning inward as it rises, and finishes in a cavetto cornice that flares
   back out. Draw those walls plumb and you have drawn a shed.
*/
(function () {
  "use strict";

  /* Schematic units per real foot. The plan squeezes its x axis by KX, and
     the host hands us a room already in that squeezed space, so ONE constant
     serves both axes and the temple stays proportionally itself inside a room
     whose envelope is admittedly schematic. Sized so the temple, the gate and
     a thirty-foot pool all fit the room's long axis with margin. */
  var FT = 1.1;
  var LEAN = 0.075;          /* temple batter, run over rise */
  var LEAN_PYLON = 0.11;     /* a gate leans harder, which is why it reads heavier */

  var SAND = "#c2a882", SAND_D = "#a58c68", SAND_L = "#d3bb96";
  var WATER = "#aebfc7", GLASS = "#d6e0e5", CLIFF = "#ded5c4";

  /* Depth for the painter's sort: the farthest-back point of the face, which
     is what the host uses so a nearer face is drawn over a farther one. */
  function depthOf(pts) {
    var d = -1e9;
    for (var i = 0; i < pts.length; i++) if (pts[i][2] > d) d = pts[i][2];
    return d;
  }

  /* One battered mass: four leaning walls and a top. The top face is inset by
     the batter on every side, which is the whole trick; everything else is a
     box. Returns items, unsorted, each carrying its own depth. */
  function batteredMass(ctx, x1, y1, x2, y2, z0, h, lean, fill, depth) {
    var P = ctx.project, out = [];
    var ix = (x2 - x1) * 0 + lean * h;      /* horizontal draw-in at the top */
    var tx1 = x1 + ix, tx2 = x2 - ix, ty1 = y1 + ix, ty2 = y2 - ix;
    if (tx2 <= tx1) { tx1 = tx2 = (x1 + x2) / 2; }
    if (ty2 <= ty1) { ty1 = ty2 = (y1 + y2) / 2; }

    /* corners, base then top, in the same order so walls pair up */
    var b = [[x1, y1], [x2, y1], [x2, y2], [x1, y2]];
    var t = [[tx1, ty1], [tx2, ty1], [tx2, ty2], [tx1, ty2]];
    var norm = [[0, -1], [1, 0], [0, 1], [-1, 0]];

    for (var i = 0; i < 4; i++) {
      var j = (i + 1) % 4;
      var q = [P(b[i][0], b[i][1], z0), P(b[j][0], b[j][1], z0),
               P(t[j][0], t[j][1], z0 + h), P(t[i][0], t[i][1], z0 + h)];
      if (!ctx.faceVisible(norm[i][0], norm[i][1])) continue;
      out.push({ svg: ctx.poly(q, ctx.shade(fill, norm[i][0], norm[i][1], 0), SAND_D, 0.6),
                 depth: (depth === undefined ? depthOf(q) : depth) });
    }
    var top = [P(t[0][0], t[0][1], z0 + h), P(t[1][0], t[1][1], z0 + h),
               P(t[2][0], t[2][1], z0 + h), P(t[3][0], t[3][1], z0 + h)];
    out.push({ svg: ctx.poly(top, ctx.shade(fill, 0, 0, 1), SAND_D, 0.6),
               depth: (depth === undefined ? depthOf(top) : depth + 0.5) });
    return out;
  }

  /* The cavetto cornice: a band that flares OUTWARD as it rises, sitting on a
     torus roll. Drawn as a few stacked rings so the hollow curve reads at this
     size; a single chamfer would look like a bevel, which is the wrong period. */
  function cornice(ctx, x1, y1, x2, y2, z, rise, out_, fill) {
    var P = ctx.project, items = [], S = window.STYLES3D;
    var prof = (S && S.cavetto) ? S.cavetto(out_, rise, 5)
                                : [[0, 0], [out_, rise]];
    for (var k = 0; k < prof.length - 1; k++) {
      var a = prof[k], c = prof[k + 1];
      var norm = [[0, -1], [1, 0], [0, 1], [-1, 0]];
      var ring = [[x1 - a[0], y1 - a[0], x2 + a[0], y2 + a[0]],
                  [x1 - c[0], y1 - c[0], x2 + c[0], y2 + c[0]]];
      var lo = ring[0], hi = ring[1];
      var bq = [[lo[0], lo[1]], [lo[2], lo[1]], [lo[2], lo[3]], [lo[0], lo[3]]];
      var tq = [[hi[0], hi[1]], [hi[2], hi[1]], [hi[2], hi[3]], [hi[0], hi[3]]];
      for (var i = 0; i < 4; i++) {
        if (!ctx.faceVisible(norm[i][0], norm[i][1])) continue;
        var j = (i + 1) % 4;
        var q = [P(bq[i][0], bq[i][1], z + a[1]), P(bq[j][0], bq[j][1], z + a[1]),
                 P(tq[j][0], tq[j][1], z + c[1]), P(tq[i][0], tq[i][1], z + c[1])];
        items.push({ svg: ctx.poly(q, ctx.shade(fill, norm[i][0], norm[i][1], 0.3), SAND_D, 0.5),
                     depth: depthOf(q) });
      }
    }
    return items;
  }

  /* A flat plane lying on the floor. It takes an explicit depth, because a
     large horizontal quad cannot be sorted by its own corners: the painter's
     depth of a face is its NEAREST point, and a floor stretching the whole
     room has a near corner closer than anything standing on it. Sorted that
     way, the floor paints last and buries the temple. Ground goes to the back
     of the queue by fiat and everything stands on it. */
  function flat(ctx, x1, y1, x2, y2, z, fill, stroke, sw, depth) {
    var P = ctx.project;
    var q = [P(x1, y1, z), P(x2, y1, z), P(x2, y2, z), P(x1, y2, z)];
    return { svg: ctx.poly(q, fill, stroke || null, sw || 0.6),
             depth: (depth === undefined ? depthOf(q) : depth) };
  }

  /* A rounded TORUS roll: the thin proud band that runs up every corner and
     along the top of an Egyptian wall, under the cavetto. Published for this
     building by name: "rounded tori at the corners and tops of its walls".
     Drawn as one shallow band that stands proud of the wall it caps, because
     at this size a real half-round would read as a smudge. */
  function roll(ctx, x1, y1, x2, y2, z, h, out_, fill) {
    var P = ctx.project, items = [];
    var norm = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    var b = [[x1 - out_, y1 - out_], [x2 + out_, y1 - out_],
             [x2 + out_, y2 + out_], [x1 - out_, y2 + out_]];
    for (var i = 0; i < 4; i++) {
      if (!ctx.faceVisible(norm[i][0], norm[i][1])) continue;
      var j = (i + 1) % 4;
      var q = [P(b[i][0], b[i][1], z), P(b[j][0], b[j][1], z),
               P(b[j][0], b[j][1], z + h), P(b[i][0], b[i][1], z + h)];
      items.push({ svg: ctx.poly(q, ctx.shade(fill, norm[i][0], norm[i][1], 0), SAND_D, 0.5),
                   depth: depthOf(q) });
    }
    return items;
  }

  /* One column of the pronaos, as a column: a shaft of real diameter, a
     torus band at its foot, and a COMPOSITE capital that flares out at the
     top. Checklist item 1 asks for the real count drawn as real objects, and
     the published count on this facade is two. */
  function column(ctx, cx, cy, rad, z, h) {
    var P = ctx.project, out = [], N = 10;
    function ring(r, zz) {
      var pts = [];
      for (var a = 0; a < N; a++) {
        var th = (a / N) * Math.PI * 2;
        pts.push(P(cx + Math.cos(th) * r, cy + Math.sin(th) * r, zz));
      }
      return pts;
    }
    var base = z + rad * 0.30, cap = z + h - rad * 1.15;
    var lo = ring(rad, base), hi = ring(rad * 0.94, cap);
    for (var a2 = 0; a2 < N; a2++) {
      var b2 = (a2 + 1) % N;
      var th2 = ((a2 + 0.5) / N) * Math.PI * 2;
      var nx = Math.cos(th2), ny = Math.sin(th2);
      if (!ctx.faceVisible(nx, ny)) continue;
      var q = [lo[a2], lo[b2], hi[b2], hi[a2]];
      out.push({ svg: ctx.poly(q, ctx.shade(SAND_L, nx, ny, 0), SAND_D, 0.4),
                 depth: depthOf(q) });
    }
    /* the foot roll and the composite capital: lotus blossoms, published, so
       the top flares wider than the shaft rather than sitting flush */
    out = out.concat(roll(ctx, cx - rad, cy - rad, cx + rad, cy + rad,
                          z, rad * 0.30, rad * 0.10, SAND));
    out = out.concat(cornice(ctx, cx - rad * 0.94, cy - rad * 0.94,
                             cx + rad * 0.94, cy + rad * 0.94,
                             cap, rad * 1.15, rad * 0.62, SAND_L));
    return out;
  }

  /* ---------------- Gallery 131, the Temple of Dendur ---------------- */
  function dendur(ctx) {
    var r = ctx.room, z = ctx.zBase, out = [];
    var P = ctx.project;

    /* PUBLISHED, and every number below is traceable.
       The Met's own record for its own object, 547802, gallery 131: temple
       proper L 12.50 m (41 ft), W 6.40 m (21 ft), H 6.40 m (21 ft); gate
       H 8.08 m (26.5 ft), W 3.66 m (12 ft), D 3.35 m (11 ft). Aeolian
       sandstone, completed by 10 CE.
       The Wikipedia article on the temple gives 42.7 by 21.5 by SIXTEEN
       feet, and that sixteen is the one real disagreement between the two
       sources. It is reconciled here rather than averaged: the pronaos front
       stands TALLER than the block behind it, so 21 ft is the facade and 16
       ft is the rear roof. That reading is an interpretation, said out loud,
       and it is why the roof STEPS DOWN westward instead of running flat.
       Also published and used: two columns on the pronaos with composite
       lotus capitals; rounded tori at the corners and tops of the walls,
       capped by a cavetto cornice, on both temple and gate; a winged sun
       disk over the gate and over the temple entrance; and a dromos running
       30 ft (9.1 m) from the gate to the temple. Room facts from the same
       article: pool in FRONT, raked wall BEHIND, stippled glass ceiling and
       NORTH wall, temple still facing EAST. */
    var tLen = 41 * FT, tWid = 21 * FT;
    var htFront = 21 * FT, htRear = 16 * FT;
    var proLen = 13 * FT;                     /* the pronaos bay of the 41 */
    var gW = 12 * FT, gD = 11 * FT, gH = 26.5 * FT;
    var dromos = 30 * FT, poolW = 30 * FT;

    var yc = r.y + r.h / 2;
    var tX1 = r.x + 14, tX2 = tX1 + tLen;     /* west end, east facade */
    var pX1 = tX2 - proLen;                   /* where the pronaos begins */
    var tY1 = yc - tWid / 2, tY2 = yc + tWid / 2;
    var plat = 2.4 * FT;

    /* THE GALLERY FLOOR. Explicit depth, at the back of the queue: a plane
       this wide has a nearer corner than anything standing on it, and sorted
       by its own corners it paints last and buries the room. */
    out.push(flat(ctx, r.x - 10, r.y - 10, r.x + r.w + 10, r.y + r.h + 10,
                  z + 0.4, "#efe9dc", "#cdc4b0", 0.5, -1e9));

    /* THE GLASS, the north wall, behind everything but the floor. It is the
       wall you look TOWARD in the real room, not a pane you look through, so
       it is a backdrop with mullions rather than a sheet laid over the
       gallery. The stipple is what diffuses Nubian light onto the stone. */
    var gy = r.y - 6, gtop = z + htFront * 1.9;
    var gq = [P(r.x - 10, gy, z), P(r.x + r.w + 10, gy, z),
              P(r.x + r.w + 10, gy, gtop), P(r.x - 10, gy, gtop)];
    out.push({ svg: ctx.poly(gq, GLASS, "#c3ced4", 0.6, ' opacity="0.55"'),
               depth: -9.96e8 });
    for (var m = 0; m <= 12; m++) {
      var mx = r.x - 10 + (r.w + 20) * (m / 12);
      var mq = [P(mx - 0.5, gy, z), P(mx + 0.5, gy, z),
                P(mx + 0.5, gy, gtop), P(mx - 0.5, gy, gtop)];
      out.push({ svg: ctx.poly(mq, "#b9c6cd", null, 0, ' opacity="0.6"'),
                 depth: -9.955e8 });
    }

    /* THE RAKED WALL behind the temple, standing for the cliffs of the west
       bank. Lit from the room side, which is the only side anyone sees. */
    var cW = 10, cH = htFront * 1.15;
    var cq = [P(tX1 - 12, r.y + 4, z), P(tX1 - 12, r.y + r.h - 4, z),
              P(tX1 - 12 + cW, r.y + r.h - 4, z + cH), P(tX1 - 12 + cW, r.y + 4, z + cH)];
    out.push({ svg: ctx.poly(cq, ctx.shade(CLIFF, 0.9, 0, 0.4), "#c4bba7", 0.5),
               depth: -9.9e8 });
    /* its top edge, so the rake reads as a mass leaning back and not as a
       loose flap of paper standing on the floor */
    var ct = [P(tX1 - 12 + cW, r.y + 4, z + cH), P(tX1 - 12 + cW, r.y + r.h - 4, z + cH),
              P(tX1 - 12 + cW - 3, r.y + r.h - 4, z + cH), P(tX1 - 12 + cW - 3, r.y + 4, z + cH)];
    out.push({ svg: ctx.poly(ct, ctx.shade(CLIFF, 0, 0, 1), "#c4bba7", 0.5),
               depth: -9.89e8 });

    /* THE POOL, thirty feet across and published. It stands for the Nile,
       which ran in front of the temple where the temple stood. */
    var gX1 = tX2 + dromos, gX2 = gX1 + gD;
    var pW1 = gX2 + 6, pW2 = pW1 + poolW;
    out.push(flat(ctx, pW1, r.y + 10, pW2, r.y + r.h - 10, z + 0.7,
                  WATER, "#8fa3ad", 0.7, -9.8e8));

    /* GROUND SHADOWS. The renderer's light runs from the west-north, so the
       shadow of every mass falls that way. Nothing here casts one on its
       own, and without them the stone floats, which is exactly what the last
       render did. */
    function shadow(x1, y1, x2, y2) {
      return flat(ctx, x1 - 4, y1 - 3, x2 - 1, y2 - 1, z + 0.5,
                  "#000000", null, 0, -9.7e8);
    }
    var sh1 = shadow(tX1, tY1, tX2, tY2);
    sh1.svg = sh1.svg.replace('/>', ' opacity="0.10"/>');
    out.push(sh1);
    var sh2 = shadow(gX1, yc - gW / 2, gX2, yc + gW / 2);
    sh2.svg = sh2.svg.replace('/>', ' opacity="0.10"/>');
    out.push(sh2);

    /* THE PLATFORM, with a short flight of real steps down to the pool end.
       Steps as a stack of shrinking slabs, which is the checklist's rule. */
    out.push(flat(ctx, tX1 - 6, tY1 - 7, gX2 + 5, tY2 + 7, z + plat,
                  SAND_L, SAND_D, 0.6, -9.6e8));
    for (var s = 0; s < 3; s++) {
      out.push(flat(ctx, gX2 + 5 + s * 2.4, tY1 + 2, gX2 + 7.4 + s * 2.4, tY2 - 2,
                    z + plat * (1 - (s + 1) / 4), SAND_L, SAND_D, 0.5, -9.5e8 + s));
    }

    /* THE TEMPLE, in two blocks so the roof steps down, each with its own
       torus roll and cavetto. West block first: antechamber and sanctuary. */
    out = out.concat(batteredMass(ctx, tX1, tY1, pX1, tY2, z + plat, htRear, LEAN, SAND));
    var rIn = LEAN * htRear;
    out = out.concat(roll(ctx, tX1 + rIn, tY1 + rIn, pX1, tY2 - rIn,
                          z + plat + htRear - 1.0, 1.0, 0.5, SAND));
    out = out.concat(cornice(ctx, tX1 + rIn, tY1 + rIn, pX1, tY2 - rIn,
                             z + plat + htRear, 2.6, 2.4, SAND_L));

    /* THE PRONAOS. Its two side walls are solid returns; between them stand
       the two columns, the two waist-high screen walls, and the doorway.
       Sizes across the 21 ft front: a 2 ft return each side, a 3.5 ft screen
       wall, a 2.5 ft column, a 5 ft doorway. */
    var pIn = LEAN * htFront;
    var halfW = tWid / 2, colR = 1.25 * FT;
    var doorH = 12 * FT, screenH = 6.2 * FT;
    /* The porch is drawn as a SOLID block first and then opened, rather than
       assembled out of loose fins. Built the other way round it rendered as a
       skeleton with daylight through it, because the two side walls were the
       only thing standing and there was nothing behind them.
       What is open in the real facade, and so is cut back into this face as a
       recess: the two bays above the screen walls, and the doorway. */
    out = out.concat(batteredMass(ctx, pX1, tY1, tX2, tY2, z + plat, htFront, LEAN, SAND));

    var fx = tX2 - LEAN * htFront * 0.06;       /* just inside the east face */
    function recess(y1, y2, zz, hh, fill) {
      var q = [P(fx, y1, zz), P(fx, y2, zz), P(fx, y2, zz + hh), P(fx, y1, zz + hh)];
      if (!ctx.faceVisible(1, 0)) return null;
      return { svg: ctx.poly(q, fill, "#4a3d2c", 0.4), depth: depthOf(q) + 0.4 };
    }
    var lintelZ = z + plat + htFront - 3.0 * FT;
    /* the two open bays, between each column and the side wall, above the
       screen wall and under the architrave */
    [[tY1 + 2 * FT, yc - 5 * FT], [yc + 5 * FT, tY2 - 2 * FT]].forEach(function (yy) {
      var it = recess(yy[0], yy[1], z + plat + screenH, lintelZ - (z + plat + screenH), "#6b5940");
      if (it) out.push(it);
    });
    /* the doorway itself, full height between the columns */
    var dr = recess(yc - 2.5 * FT, yc + 2.5 * FT, z + plat, doorH, "#5c4c37");
    if (dr) out.push(dr);

    /* the two screen walls, standing PROUD of the face so they read as the
       waist-high panels they are and not as paint on a wall */
    [[tY1 + 2 * FT, yc - 5 * FT], [yc + 5 * FT, tY2 - 2 * FT]].forEach(function (yy) {
      out = out.concat(batteredMass(ctx, tX2 - 0.3, yy[0], tX2 + 0.9, yy[1],
                                    z + plat, screenH, 0.02, SAND_L));
    });
    /* the two columns, standing in the facade in front of the open bays */
    [-1, 1].forEach(function (sd) {
      out = out.concat(column(ctx, tX2 + colR * 0.45, yc + sd * 3.75 * FT,
                              colR, z + plat, htFront - 3.0 * FT));
    });
    /* the architrave the columns carry, spanning the whole front */
    out = out.concat(batteredMass(ctx, tX2 - 0.3, tY1 + 0.4, tX2 + colR * 1.05, tY2 - 0.4,
                                  lintelZ, 3.0 * FT, 0.02, SAND));
    /* the WINGED SUN DISK over the entrance, published for this doorway */
    var wq = [P(tX2 + colR * 1.06, yc - 3.2 * FT, z + plat + htFront - 2.4 * FT),
              P(tX2 + colR * 1.06, yc + 3.2 * FT, z + plat + htFront - 2.4 * FT),
              P(tX2 + colR * 1.06, yc + 3.2 * FT, z + plat + htFront - 0.9 * FT),
              P(tX2 + colR * 1.06, yc - 3.2 * FT, z + plat + htFront - 0.9 * FT)];
    if (ctx.faceVisible(1, 0)) out.push({ svg: ctx.poly(wq, "#8a7351", "#6d5a3f", 0.4),
                                          depth: depthOf(wq) + 0.3 });
    var fIn = LEAN * htFront;
    out = out.concat(roll(ctx, pX1, tY1 + fIn, tX2, tY2 - fIn,
                          z + plat + htFront - 1.0, 1.0, 0.5, SAND));
    out = out.concat(cornice(ctx, pX1, tY1 + fIn, tX2, tY2 - fIn,
                             z + plat + htFront, 3.0, 2.8, SAND_L));

    /* THE GATE. One mass 12 ft wide and 11 ft deep, not two towers: the
       published width leaves a doorway with a pier either side and a lintel
       over the top, and the last render's pair of free-standing wedges was
       the reading that made it look like two obelisks in the water. */
    var gY1 = yc - gW / 2, gY2 = yc + gW / 2;
    var gDoorW = 5 * FT, gDoorH = 15 * FT;
    var gLean = LEAN_PYLON;
    [[gY1, yc - gDoorW / 2], [yc + gDoorW / 2, gY2]].forEach(function (yy) {
      out = out.concat(batteredMass(ctx, gX1, yy[0], gX2, yy[1], z + plat, gH, gLean, SAND));
    });
    /* the lintel across the opening, which is what makes it a gate */
    out = out.concat(batteredMass(ctx, gX1 + gLean * gDoorH, yc - gDoorW / 2,
                                  gX2 - gLean * gDoorH, yc + gDoorW / 2,
                                  z + plat + gDoorH, gH - gDoorH, gLean, SAND));
    /* the dark of the passage through it */
    var pq = [P(gX2 - gLean * gH * 0.2, yc - gDoorW / 2, z + plat),
              P(gX2 - gLean * gH * 0.2, yc + gDoorW / 2, z + plat),
              P(gX2 - gLean * gH * 0.2, yc + gDoorW / 2, z + plat + gDoorH),
              P(gX2 - gLean * gH * 0.2, yc - gDoorW / 2, z + plat + gDoorH)];
    if (ctx.faceVisible(1, 0)) out.push({ svg: ctx.poly(pq, "#4f4130", "#3f3426", 0.4),
                                          depth: depthOf(pq) + 0.05 });
    /* its winged sun disk, published in the same sentence as the temple's */
    var gwz = z + plat + gDoorH + 1.4 * FT;
    var gw = [P(gX2 - gLean * gH * 0.2 + 0.15, yc - 3.0 * FT, gwz),
              P(gX2 - gLean * gH * 0.2 + 0.15, yc + 3.0 * FT, gwz),
              P(gX2 - gLean * gH * 0.2 + 0.15, yc + 3.0 * FT, gwz + 1.6 * FT),
              P(gX2 - gLean * gH * 0.2 + 0.15, yc - 3.0 * FT, gwz + 1.6 * FT)];
    if (ctx.faceVisible(1, 0)) out.push({ svg: ctx.poly(gw, "#8a7351", "#6d5a3f", 0.4),
                                          depth: depthOf(gw) + 0.3 });
    var gIn = gLean * gH;
    out = out.concat(roll(ctx, gX1 + gIn, gY1 + gIn, gX2 - gIn, gY2 - gIn,
                          z + plat + gH - 1.0, 1.0, 0.5, SAND));
    out = out.concat(cornice(ctx, gX1 + gIn, gY1 + gIn, gX2 - gIn, gY2 - gIn,
                             z + plat + gH, 3.0, 2.8, SAND_L));

    return out;
  }


  /* ==================================================================
     ONE LANDMARK IN EVERY ROOM
     [SEAN "can you now add 1 landmark to each of every room?"]

     Dendur gets a room because the room IS the exhibit. Everywhere else
     one object is the reason people walk in, so each gallery gets that
     object, standing at its REAL published size.

     Every dimension below came from the Met's own API record for that
     object, not from a photograph and not from memory. Where the museum
     publishes only a height, only the height is claimed and the other two
     are proportion. The Met's record also corrected our own Dendur: it
     gives 41 by 21 by 21 feet, where a secondary source had said 16 high.

     Four shapes cover twelve rooms, because a kouros and a suit of armour
     are the same problem at different sizes, and a Rembrandt and a Van
     Gogh are the same problem at different sizes. What differs is the
     number, and the number is real.

     A room with no signature work listed gets nothing. Absence over
     invention: an empty gallery is honest, a generic box is not.
     ================================================================== */

  var LANDMARKS = {
    /* kind, then feet. canvas is height then width, as the Met lists them. */
    /* egyptian left this table on 2026-09-07: it is gallery 100 now, an
       actual room with the tomb standing in it. A key that stays here is
       overwritten by the fallback loop at the foot of this file, which runs
       AFTER MET_ROOMS is built, so registering the room is not enough. */
    "greek-roman":        { kind: "figure", h: 6.4,  w: 1.7, d: 2.1, fill: "#ded8cc" },
    /* lehman left this table on 2026-09-06: it is gallery 959 now, an actual
       room. A key that stays here is overwritten by the fallback loop at the
       foot of this file, which runs after MET_ROOMS is built. */
    /* grand-stair left this table on 2026-09-06 as well. The plan carries the
       SAME staircase twice, once as a floor 1 node and once as a floor 2 one,
       and grandStair() already draws the whole flight from the Great Hall
       floor to the landing. Drawing it for both nodes is not a duplicate, it
       is the one stair seen from each end; drawing a flat canvas for the
       floor 1 node was the error. */
    /* euro-paintings left this table on 2026-09-06: it is gallery 637 now,
       an actual room, and the fallback loop at the foot of this file
       overwrites MET_ROOMS for every key that stays here. */
  };

  var FRAME = "#4a3f31", STONE_E = "#8b8375";

  function landmark(ctx) {
    var cfg = LANDMARKS[ctx.key];
    if (!cfg) return [];                 /* no signature work: draw nothing */
    var r = ctx.room, z = ctx.zBase, P = ctx.project, out = [];
    var cx = r.x + r.w / 2, cy = r.y + r.h / 2;

    /* Fit. The real proportions are kept and the whole thing is shrunk when
       it will not stand in the room: the Valladolid choir screen is 52 feet
       tall and one storey of this schematic is not. Proportion is the honest
       part; absolute scale inside a schematic room never was. */
    var wide = cfg.w || cfg.d || 4, high = cfg.h;
    var ceil = (ctx.wall || 26) * 0.82;
    var k = FT;
    k = Math.min(k, ceil / high, (r.w * 0.62) / wide, (r.h * 0.62) / (cfg.d || wide));
    var H = high * k, W = wide * k, D = (cfg.d || Math.max(1, wide * 0.12)) * k;

    if (cfg.kind === "mass") {
      out = out.concat(batteredMass(ctx, cx - W / 2, cy - D / 2, cx + W / 2, cy + D / 2,
                                    z + 0.5, H, cfg.lean || 0.08, cfg.fill));
      /* The doorway. A mastaba without one is a block; the door is the whole
         point of a tomb facade, and Perneb's is the thing you walk through. */
      var dw = W * 0.13, dh = H * 0.42, dy = cy - D / 2 - 0.25;
      var dq = [P(cx - dw, dy, z + 0.5), P(cx + dw, dy, z + 0.5),
                P(cx + dw, dy, z + 0.5 + dh), P(cx - dw, dy, z + 0.5 + dh)];
      out.push({ svg: ctx.poly(dq, "#5b4f3d", "#3d3428", 0.5), depth: -9.45e8 });
      out = out.concat(cornice(ctx, cx - W / 2 + cfg.lean * H, cy - D / 2 + cfg.lean * H,
                               cx + W / 2 - cfg.lean * H, cy + D / 2 - cfg.lean * H,
                               z + 0.5 + H, H * 0.09, H * 0.08, "#d8c6a6"));
      return out;
    }

    if (cfg.kind === "figure") {
      /* A STANDING HUMAN, not a block. [SEAN: "the artifact in 3D doesnt look
         alike some object".] He is right: a kouros and a suit of armour drawn
         as tapering boxes read as furniture. A statue is a person, and a
         person is legible from very little as long as the PROPORTIONS are
         human, so this is built on the canonical seven-and-a-half heads:
         head one seventh and a half of the height, shoulders about a quarter
         of it across, hips at just over half, arms hanging to mid-thigh.

         The pose is archaic on purpose. A kouros stands rigid and frontal
         with arms at the sides and the left foot advanced, which is the one
         thing everybody notices about them, so the feet are offset. A suit of
         armour on a stand holds the same attitude, which is why one shape
         serves both. */
      var pl = H * 0.14;                       /* the plinth */
      var fh = H;                              /* the figure itself */
      var head = fh / 7.5;
      var shoulder = fh * 0.26;                /* across */
      var deep = shoulder * 0.55;
      var hip = fh * 0.50, neck = fh * 0.83, crown = fh * 0.97;
      var zf = z + pl;
      var C2 = cfg.fill;

      out.push(flat(ctx, cx - W, cy - D, cx + W, cy + D, zf, "#e4ded1", STONE_E, 0.5, -9.62e8));
      out = out.concat(batteredMass(ctx, cx - W, cy - D, cx + W, cy + D, z, pl, 0.02, "#e0d9cb"));

      /* legs, the left one advanced, which is the archaic stance */
      [[-1, 0.12], [1, -0.10]].forEach(function (lg) {
        var lx = cx + lg[0] * shoulder * 0.24, ly = cy + lg[1] * deep;
        var lw = shoulder * 0.17;
        out = out.concat(batteredMass(ctx, lx - lw, ly - lw, lx + lw, ly + lw,
                                      zf, hip, 0.02, C2));
      });
      /* torso: wider at the shoulder than the waist, which is the whole
         silhouette of a standing body */
      out = out.concat(batteredMass(ctx, cx - shoulder / 2, cy - deep / 2,
                                    cx + shoulder / 2, cy + deep / 2,
                                    zf + hip, neck - hip, -0.06, C2));
      /* arms, hanging at the sides, not out */
      [-1, 1].forEach(function (sd) {
        var ax = cx + sd * (shoulder / 2 + shoulder * 0.06), aw = shoulder * 0.10;
        out = out.concat(batteredMass(ctx, ax - aw, cy - aw, ax + aw, cy + aw,
                                      zf + hip * 0.92, (neck - hip) * 0.92, 0.02, C2));
      });
      /* neck, then head */
      var nw = shoulder * 0.13;
      out = out.concat(batteredMass(ctx, cx - nw, cy - nw, cx + nw, cy + nw,
                                    zf + neck, crown - neck - head * 0.9, 0, C2));
      var hw = head * 0.42;
      out = out.concat(batteredMass(ctx, cx - hw, cy - hw * 0.85, cx + hw, cy + hw * 0.85,
                                    zf + crown - head * 0.9, head * 0.9, -0.05, C2));
      return out;
    }

    /* canvas and screen both stand as a flat plane facing into the room, on
       the far side, which is where a big picture or a screen actually hangs. */
    var y0 = r.y + r.h * 0.22;
    var x1 = cx - W / 2, x2 = cx + W / 2;
    var base = z + (cfg.kind === "canvas" ? (ctx.wall || 26) * 0.10 : 0.4);

    if (cfg.kind === "screen" && cfg.arch) {
      /* A mihrab is a POINTED niche, so the styles book draws it rather than a
         rectangle with a curve guessed on top. */
      var S = window.STYLES3D;
      var pts = (S && S.archedOpening) ? S.archedOpening(W, H, 0.55, 20)
                                       : [[-W / 2, 0], [-W / 2, H], [W / 2, H], [W / 2, 0]];
      /* the surround first, so the niche reads as cut INTO something */
      out = out.concat(batteredMass(ctx, cx - W * 0.62, y0, cx + W * 0.62, y0 + W * 0.10,
                                    base, H * 1.12, 0.01, "#cfc6b4"));
      var poly3 = pts.map(function (pt) { return P(cx + pt[0], y0 - 0.2, base + pt[1]); });
      out.push({ svg: ctx.poly(poly3, ctx.shade(cfg.fill, 0, -1, 0.2), "#5e6d78", 0.7),
                 depth: -9.4e8 });
      return out;
    }

    /* A picture is a flat thing, but drawn as two flat quads it reads as a
       decal printed on the floor plan. It gets a real frame with depth, so it
       stands in the room the way it hangs on a wall, and the canvas sits
       slightly proud of it. The size is the museum's own: at 12.4 by 21.3 feet
       Washington Crossing the Delaware genuinely fills the end of its court,
       and that is the fact worth seeing. */
    var fr = Math.max(0.6, W * 0.045);
    var th = Math.max(0.5, W * 0.022);            /* how far it stands off the wall */
    out = out.concat(batteredMass(ctx, x1 - fr, y0, x2 + fr, y0 + th,
                                  base - fr, H + fr * 2, 0, FRAME));
    var q = [P(x1, y0 - 0.15, base), P(x2, y0 - 0.15, base),
             P(x2, y0 - 0.15, base + H), P(x1, y0 - 0.15, base + H)];
    out.push({ svg: ctx.poly(q, ctx.shade(cfg.fill, 0, -1, 0.25), "#3b332a", 0.5),
               depth: -9.4e8 });
    return out;
  }


  /* ---------------- The Great Hall ----------------
     The room every visitor walks into, and until now an empty box on the plan.
     It is not an object in a room, it is architecture, which is what the
     styles book is for. Beaux-Arts was entered in that book ahead of the Met
     and never used; this is what it was for.

     Richard Morris Hunt, opened December 1902. 166 feet long, 48 wide, two
     storeys. THREE SAUCER DOMES carried on arches, and they are three because
     the Fifth Avenue front outside has three arches: the inside is answering
     the outside. Round arches on PAIRED columns is Hunt's motif, repeated
     three times across the facade and again over your head in here.

     The arches are drawn by the same function that draws the Brooklyn
     Bridge's, at a different setting. A two-centred arch whose rise equals
     its half-width has both centres in one place, so it comes out a true
     semicircle. Gothic and Roman are one equation. A pointed arch in this
     room would be a century out of place, and the book says so. */
  /* ------------- The Great Hall, the Met's main entrance hall -------------
     Richard Morris Hunt, finished by his son Richard Howland Hunt with
     George B. Post as consulting architect; built 1895-1902, opened to the
     public December 1902.

     WHAT IT REPLACED, and it is the clearest case left in this file of the
     thing Sean called unacceptable: ONE flat wall with three arch-shaped
     holes punched in it, four thin sticks for the "paired columns", and the
     three saucer domes drawn as single quads that rendered as SLIVERS lying
     against the wall, reading as three awnings. No second wall, no floor,
     no balcony, no colonnade, no niche, no pendentive. Not a room.

     PUBLISHED COUNTS AND FEATURES, every one of them from the New York City
     Landmarks Preservation Commission designation report LP-0972, "The
     Metropolitan Museum of Art, Main Floor Interior", 1977
     (s-media.nyc.gov/agencies/lpc/lp/0972.pdf), read this run:
       - the hall "rises two stories beneath three saucer domes with
         circular skylights";
       - it "is subdivided into three bays by piers carrying arches which
         support the three saucer domes";
       - those arches "rise above dentiled cornices acting as pier capitals";
       - "the pendentives of each dome are paneled", and "a series of closely
         spaced brackets" encircles the base of each dome;
       - a gallery "in the form of a balcony at the second floor", carried on
         an entablature that "continues around the room at the level of the
         gallery", frieze panelled with acorns and sunflowers, dentiled
         cornice, and above it "a limestone balcony railing with pierced
         stone panels which encircles the room at the second floor";
       - "colonnades at each side of the room at the main floor. Each
         colonnade is composed of FOUR FLUTED COLUMNS with Ionic capitals";
       - "four ornamental niches set in the bases of the piers in the east
         and west walls", each arched, with a pediment above it;
       - "two transverse passageways open up at the north and south ends of
         the Great Hall behind the screens of columns";
       - the material is "warm-toned Indiana limestone";
       - the Grand Staircase stands behind the WESTERN colonnade.
     And from the Metropolitan Museum's own press release, "The Great Hall of
     The Metropolitan Museum of Art", 2010 general information: the ceilings
     "soar seventy-five feet high"; "three immense saucer-shaped domes and
     eight dramatic arches springing from enormous masonry piers"; the mosaic
     floor is "an aggregate of bits of marble framed by strips of yellow
     marble"; and the colonnades are at "the north, west, and south ends".

     TWO SOURCES RECONCILED OUT LOUD rather than averaged, which is the
     Dendur rule. LP-0972 says a colonnade stands at "each side of the room";
     the Met says north, west and south. Both are kept and they agree: the
     east side is the Fifth Avenue vestibule, so THREE colonnades of four
     columns each are drawn, and none on the east.

     THE EIGHT ARCHES ARE AN INTERPRETATION, declared. The Met publishes the
     count, eight, and not their arrangement. Drawn here as one arch on the
     east and one on the west wall of each of the three bays, six, plus one
     transverse arch closing each end, two. That reading is self-consistent
     with LP-0972's piers-carrying-arches and with the passageways behind the
     end screens, and no source reached states it.

     THE PLAN IS A NAMED GAP. No length, width, bay module or dome diameter
     is published in any source this run could reach: not LP-0972, which
     carries no dimension at all, not the Met's press release, not the Met's
     own event pages. Only the HEIGHT is published, seventy-five feet. So the
     plan is DERIVED from that one number and stated here rather than
     guessed quietly: the bays are square, the dome ring is inscribed in the
     bay, the arch under it is a semicircle of the bay's span, and a saucer
     rises 0.16 of its diameter, so 75 = A + W/2 + 0.16W with A the height of
     the pier capital the arch springs from. W = 48 puts that springing at
     43.3 ft, which is two storeys of a monumental hall, and gives three
     square bays of 144 ft with the two published end passageways beyond
     them. Every plan number below is that derivation, not a measurement. */
  function greatHall(ctx) {
    var r = ctx.room, z = ctx.zBase, P = ctx.project, out = [];

    /* DERIVED, see the header: not one of these is published. */
    var W = 48, BAYS = 3, ENDS = 11;            /* bay = hall width */
    var LEN = W * BAYS + ENDS * 2;              /* 166, the end passageways */
    var HT  = 75;                               /* PUBLISHED, the one number */
    var SPRING = HT - W / 2 - 0.16 * W;         /* 43.3, the pier capital */
    var GALL = SPRING * 0.62;                   /* the gallery entablature */

    var k = Math.min((r.w * 0.94) / LEN, (r.h * 0.82) / W, (ctx.wall || 26) * 1.05 / HT);
    var L = LEN * k, WD = W * k, H = HT * k, sp = SPRING * k, gl = GALL * k;
    var cx = r.x + r.w / 2, cy = r.y + r.h / 2;
    var x1 = cx - L / 2, x2 = cx + L / 2, y1 = cy - WD / 2, y2 = cy + WD / 2;
    var bay = W * k, end = ENDS * k;

    /* Two tones per material, checklist item 6. Indiana limestone is warm,
       so the lit tone goes yellower, not whiter. */
    var LIME = "#e0d7c2", LIME_D = "#b5aa91", LIME_L = "#efe8d7",
        SHADE = "#c8bda4", DARK = "#8e846e",
        MOSAIC = "#e9e2d2", YELLOW = "#d8c489", SKY = "#f4f1e6";

    /* THE MOSAIC FLOOR, published as an aggregate of marble bits framed by
       strips of YELLOW marble, so it is drawn as a field and its frame and
       not as one grey plate. Explicit depth, because a floor spanning the
       room has a nearer corner than everything standing on it. */
    out.push(flat(ctx, x1, y1, x2, y2, z + 0.3, MOSAIC, null, 0, -1e9));
    for (var b = 0; b <= BAYS; b++) {
      var sx = x1 + end + bay * b;
      out.push(flat(ctx, sx - 0.9, y1, sx + 0.9, y2, z + 0.32, YELLOW, null, 0, -9.99e8));
    }
    out.push(flat(ctx, x1, y1 + 1.4, x2, y1 + 2.6, z + 0.32, YELLOW, null, 0, -9.99e8));
    out.push(flat(ctx, x1, y2 - 2.6, x2, y2 - 1.4, z + 0.32, YELLOW, null, 0, -9.99e8));

    /* ---- the two long walls, as a CUTAWAY on the wall's INNER normal ----
       Draw the wall whose inside faces the camera; the one you would be
       looking at the back of is between you and the room. */
    var walls = [];
    [[y1, 1], [y2, -1]].forEach(function (wl) {
      if (ctx.faceVisible(0, wl[1])) walls.push(wl);
    });

    function archPts(bx, span, rise, yy, n) {
      var pts = [[bx - span / 2, 0], [bx - span / 2, rise]];
      for (var a = 0; a <= n; a++) {
        var th = Math.PI - (a / n) * Math.PI;
        pts.push([bx + Math.cos(th) * span / 2, rise + Math.sin(th) * span / 2]);
      }
      pts.push([bx + span / 2, 0]);
      return pts.map(function (p) { return P(p[0], yy, z + p[1]); });
    }

    walls.forEach(function (wl) {
      var yy = wl[0], sgn = wl[1], face = ctx.shade(LIME, 0, sgn, 0.22);
      /* the wall itself, at an explicit depth so it cannot bury the room */
      out.push({ svg: ctx.poly([P(x1, yy, z), P(x2, yy, z),
                                P(x2, yy, z + H), P(x1, yy, z + H)],
                               face, LIME_D, 0.5), depth: -9.70e8 });

      for (var i = 0; i < BAYS; i++) {
        var bx = x1 + end + bay * (i + 0.5);
        /* THE ARCH: a semicircle of the bay's span springing from the pier
           capital. The recess is the darker stone behind it, not a hole. */
        out.push({ svg: ctx.poly(archPts(bx, bay * 0.78, sp - bay * 0.39, yy - sgn * 0.25, 20),
                                 SHADE, DARK, 0.5), depth: -9.66e8 });
        out.push({ svg: ctx.poly(archPts(bx, bay * 0.70, sp - bay * 0.35, yy - sgn * 0.45, 20),
                                 "#bdb29a", DARK, 0.4), depth: -9.64e8 });
      }

      /* THE PIERS between the bays, standing proud of the wall, each capped
         by the DENTILED CORNICE that LP-0972 calls the pier capital. */
      for (var pI = 0; pI <= BAYS; pI++) {
        var px = x1 + end + bay * pI, pw = bay * 0.11;
        out.push({ svg: ctx.poly([P(px - pw, yy - sgn * 0.7, z), P(px + pw, yy - sgn * 0.7, z),
                                  P(px + pw, yy - sgn * 0.7, z + sp), P(px - pw, yy - sgn * 0.7, z + sp)],
                                 ctx.shade(LIME_L, 0, sgn, 0.3), LIME_D, 0.5), depth: -9.60e8 });
        /* pier capital: cornice slab and its dentils */
        out.push({ svg: ctx.poly([P(px - pw * 1.25, yy - sgn * 1.0, z + sp),
                                  P(px + pw * 1.25, yy - sgn * 1.0, z + sp),
                                  P(px + pw * 1.25, yy - sgn * 1.0, z + sp + H * 0.022),
                                  P(px - pw * 1.25, yy - sgn * 1.0, z + sp + H * 0.022)],
                                 LIME_L, LIME_D, 0.5), depth: -9.58e8 });
        for (var d = 0; d < 7; d++) {
          var dx = px - pw * 1.1 + (pw * 2.2) * (d / 6);
          out.push({ svg: ctx.poly([P(dx - pw * 0.06, yy - sgn * 1.05, z + sp - H * 0.012),
                                    P(dx + pw * 0.06, yy - sgn * 1.05, z + sp - H * 0.012),
                                    P(dx + pw * 0.06, yy - sgn * 1.05, z + sp),
                                    P(dx - pw * 0.06, yy - sgn * 1.05, z + sp)],
                                   SHADE, null, 0), depth: -9.57e8 });
        }

        /* THE FOUR NICHES, published as set in the BASES of the piers in the
           east and west walls: two piers a wall, so two niches a wall, four.
           Arched, with the pediment LP-0972 describes standing over it. */
        if (pI > 0 && pI < BAYS) {
          var nw = pw * 1.5, nh = gl * 0.52;
          out.push({ svg: ctx.poly(archPts(px, nw * 2, nh - nw, yy - sgn * 0.95, 14),
                                   "#a89c84", DARK, 0.5), depth: -9.55e8 });
          out.push({ svg: ctx.poly([P(px - nw * 1.35, yy - sgn * 1.05, z + nh + nw * 0.10),
                                    P(px + nw * 1.35, yy - sgn * 1.05, z + nh + nw * 0.10),
                                    P(px, yy - sgn * 1.05, z + nh + nw * 0.85)],
                                   LIME_L, LIME_D, 0.5), depth: -9.54e8 });
        }
      }

      /* THE GALLERY ENTABLATURE and the pierced balcony railing above it,
         both published as running right round the room. Architrave, frieze
         with its panels, dentiled cornice, then the railing. */
      var eb = H * 0.030;
      out.push({ svg: ctx.poly([P(x1, yy - sgn * 0.9, z + gl), P(x2, yy - sgn * 0.9, z + gl),
                                P(x2, yy - sgn * 0.9, z + gl + eb * 2.2), P(x1, yy - sgn * 0.9, z + gl + eb * 2.2)],
                               ctx.shade(LIME_L, 0, sgn, 0.3), LIME_D, 0.5), depth: -9.50e8 });
      for (var fp = 0; fp < 22; fp++) {
        var fx = x1 + (L / 22) * (fp + 0.5);
        out.push({ svg: ctx.poly([P(fx - L * 0.012, yy - sgn * 0.95, z + gl + eb * 0.5),
                                  P(fx + L * 0.012, yy - sgn * 0.95, z + gl + eb * 0.5),
                                  P(fx + L * 0.012, yy - sgn * 0.95, z + gl + eb * 1.5),
                                  P(fx - L * 0.012, yy - sgn * 0.95, z + gl + eb * 1.5)],
                                 SHADE, null, 0), depth: -9.49e8 });
      }
      out.push({ svg: ctx.poly([P(x1, yy - sgn * 1.3, z + gl + eb * 2.2), P(x2, yy - sgn * 1.3, z + gl + eb * 2.2),
                                P(x2, yy - sgn * 1.3, z + gl + eb * 2.9), P(x1, yy - sgn * 1.3, z + gl + eb * 2.9)],
                               LIME_L, LIME_D, 0.5), depth: -9.48e8 });
      /* the railing: pierced PANELS, so the gaps are the subject */
      var rz = z + gl + eb * 2.9, rh = H * 0.055;
      out.push({ svg: ctx.poly([P(x1, yy - sgn * 1.2, rz), P(x2, yy - sgn * 1.2, rz),
                                P(x2, yy - sgn * 1.2, rz + rh), P(x1, yy - sgn * 1.2, rz + rh)],
                               LIME, LIME_D, 0.5), depth: -9.46e8 });
      for (var pc = 0; pc < 34; pc++) {
        var qx = x1 + (L / 34) * (pc + 0.5);
        out.push({ svg: ctx.poly([P(qx - L * 0.008, yy - sgn * 1.25, rz + rh * 0.22),
                                  P(qx + L * 0.008, yy - sgn * 1.25, rz + rh * 0.22),
                                  P(qx + L * 0.008, yy - sgn * 1.25, rz + rh * 0.80),
                                  P(qx - L * 0.008, yy - sgn * 1.25, rz + rh * 0.80)],
                                 "#9d927c", null, 0), depth: -9.45e8 });
      }
    });

    /* ---- the three SAUCER DOMES, on paneled pendentives, with the ring of
       closely spaced brackets and the circular skylight, all published ---- */
    for (var i2 = 0; i2 < BAYS; i2++) {
      var bx2 = x1 + end + bay * (i2 + 0.5), dr = Math.min(bay, WD) * 0.38;
      var zring = z + sp + bay * 0.02;            /* the arch crowns */

      /* PANELED PENDENTIVES, drawn IN THE WALL PLANE at the top corners of
         the bay, which is where a pendentive actually is. The first build
         drew them as free diagonals across the room and two of them survived
         culling and met at the bay centre, so every dome hung on a single
         downward CONE and read as a lampshade on a stem. A pendentive is a
         corner, not a strut. */
      walls.forEach(function (wl) {
        var yy = wl[0], sgn = wl[1];
        [-1, 1].forEach(function (c) {
          var ax = bx2 + c * bay * 0.48;
          out.push({ svg: ctx.poly([P(ax, yy - sgn * 0.55, z + sp - bay * 0.30),
                                    P(ax, yy - sgn * 0.55, zring),
                                    P(bx2 + c * dr * 0.72, yy - sgn * 0.55, zring)],
                                   ctx.shade(SHADE, 0, sgn, 0.28), DARK, 0.5),
                     depth: -9.42e8 });
        });
      });

      /* the bracket ring at the dome's base */
      for (var br = 0; br < 34; br++) {
        var th3 = (br / 34) * Math.PI * 2;
        var nx3 = Math.cos(th3), ny3 = Math.sin(th3);
        if (!ctx.faceVisible(nx3, ny3)) continue;
        var t4 = ((br + 1) / 34) * Math.PI * 2;
        out.push({ svg: ctx.poly([P(bx2 + nx3 * dr, cy + ny3 * dr, zring),
                                  P(bx2 + Math.cos(t4) * dr, cy + Math.sin(t4) * dr, zring),
                                  P(bx2 + Math.cos(t4) * dr * 1.05, cy + Math.sin(t4) * dr * 1.05, zring + H * 0.020),
                                  P(bx2 + nx3 * dr * 1.05, cy + ny3 * dr * 1.05, zring + H * 0.020)],
                                 ctx.shade(LIME_L, nx3, ny3, 0), DARK, 0.4),
                   depth: -9.38e8 + br * 0.001 });
      }

      /* THE SAUCER ITSELF, as a stack of FRUSTA so it is a surface and not a
         stack of collars: every ring runs from its own radius to the next
         one's, and only the crown carries a lid. The lid is the published
         CIRCULAR SKYLIGHT, so it is sky, not stone. */
      var rise = dr * 0.32, N2 = 9;
      for (var t2 = 0; t2 < N2; t2++) {
        var f0 = t2 / N2, f1 = (t2 + 1) / N2;
        var r0 = dr * Math.cos(f0 * Math.PI / 2.35), r1 = dr * Math.cos(f1 * Math.PI / 2.35);
        var z0 = zring + H * 0.020 + rise * Math.sin(f0 * Math.PI / 2.35);
        var z1 = zring + H * 0.020 + rise * Math.sin(f1 * Math.PI / 2.35);
        for (var s2 = 0; s2 < 26; s2++) {
          var a0 = (s2 / 26) * Math.PI * 2, a1 = ((s2 + 1.08) / 26) * Math.PI * 2;
          var mx = Math.cos((a0 + a1) / 2), my = Math.sin((a0 + a1) / 2);
          if (!ctx.faceVisible(mx, my)) continue;
          out.push({ svg: ctx.poly([P(bx2 + Math.cos(a0) * r0, cy + Math.sin(a0) * r0, z0),
                                    P(bx2 + Math.cos(a1) * r0, cy + Math.sin(a1) * r0, z0),
                                    P(bx2 + Math.cos(a1) * r1, cy + Math.sin(a1) * r1, z1),
                                    P(bx2 + Math.cos(a0) * r1, cy + Math.sin(a0) * r1, z1)],
                                   ctx.shade(LIME_L, mx, my, 0.35 + f0 * 0.5), null, 0),
                     depth: -9.30e8 + t2 * 10 + s2 * 0.01 });
        }
      }
      var rc = dr * Math.cos(Math.PI / 2.35) , sky = [];
      for (var s3 = 0; s3 < 26; s3++) {
        var a3 = (s3 / 26) * Math.PI * 2;
        sky.push(P(bx2 + Math.cos(a3) * rc, cy + Math.sin(a3) * rc,
                   zring + H * 0.020 + rise));
      }
      out.push({ svg: ctx.poly(sky, SKY, "#cdc6b4", 0.6), depth: -9.20e8 });
    }

    /* ---- THE THREE COLONNADES, north, west and south, FOUR fluted columns
       each with an Ionic capital. The west one is the screen the Grand
       Staircase stands behind, so a lit opening is drawn beyond it. ---- */
    function ionic(px, py, rad, hgt) {
      var N3 = 12, sh = hgt * 0.86;
      for (var a4 = 0; a4 < N3; a4++) {
        var t5 = ((a4 + 0.5) / N3) * Math.PI * 2;
        var nx4 = Math.cos(t5), ny4 = Math.sin(t5);
        if (!ctx.faceVisible(nx4, ny4)) continue;
        var b0 = (a4 / N3) * Math.PI * 2, b1 = ((a4 + 1) / N3) * Math.PI * 2;
        var q = [P(px + Math.cos(b0) * rad, py + Math.sin(b0) * rad, z),
                 P(px + Math.cos(b1) * rad, py + Math.sin(b1) * rad, z),
                 P(px + Math.cos(b1) * rad * 0.93, py + Math.sin(b1) * rad * 0.93, z + sh),
                 P(px + Math.cos(b0) * rad * 0.93, py + Math.sin(b0) * rad * 0.93, z + sh)];
        out.push({ svg: ctx.poly(q, ctx.shade(LIME_L, nx4, ny4, 0), LIME_D, 0.35),
                   depth: depthOf(q) });
      }
      /* the Ionic capital: a low block with a volute standing off each end */
      out = out.concat(mass(ctx, px - rad * 1.5, py - rad * 1.1, px + rad * 1.5, py + rad * 1.1,
                            z + sh, hgt * 0.055, LIME_L, LIME_D));
      [-1, 1].forEach(function (o2) {
        out = out.concat(mass(ctx, px + o2 * rad * 1.28 - rad * 0.34, py - rad * 0.9,
                              px + o2 * rad * 1.28 + rad * 0.34, py + rad * 0.9,
                              z + sh + hgt * 0.020, hgt * 0.055, LIME, LIME_D));
      });
      out = out.concat(mass(ctx, px - rad * 1.6, py - rad * 1.2, px + rad * 1.6, py + rad * 1.2,
                            z + sh + hgt * 0.085, hgt * 0.030, LIME_L, LIME_D));
    }

    var colH = gl * 0.92, colR = bay * 0.035;
    /* north and south: across the hall, in front of the end passageway */
    [[x1 + end, 1], [x2 - end, -1]].forEach(function (sc) {
      var sx2 = sc[0];
      /* the passageway beyond the screen, darker, so the screen has a depth */
      out.push({ svg: ctx.poly([P(sx2 + sc[1] * -end, y1, z), P(sx2, y1, z),
                                P(sx2, y1, z + sp), P(sx2 + sc[1] * -end, y1, z + sp)],
                               "#a2977f", DARK, 0.5), depth: -9.72e8 });
      for (var c2 = 0; c2 < 4; c2++) {
        ionic(sx2, y1 + WD * (0.17 + 0.22 * c2), colR, colH);
      }
    });
    /* west: the Grand Staircase screen */
    for (var c3 = 0; c3 < 4; c3++) {
      ionic(x1 + end + bay * (0.62 + 0.58 * c3), y2 - WD * 0.14, colR, colH);
    }

    return out;
  }

  /* ---------------- The Charles Engelhard Court ----------------
     The American Wing's skylit court, and until now a framed rectangle,
     because its signature work is a painting. That was the wrong reading:
     the thing people remember about this room is not a canvas, it is a
     WALL. A whole marble facade stands inside the museum.

     It is the Branch Bank of the United States, Wall Street, by Martin E.
     Thompson, finished 1824 and moved here when the bank was demolished.
     Two storeys, SEVEN BAYS, with the middle section stepping forward under
     a pediment: English Palladian, which the styles book files under
     Beaux-Arts' ancestors and which means ROUND arches and columns in pairs,
     never a point. The court was glazed over in 1980.

     The glass roof is drawn as its FRAMING BARS, not as a sheet. A sheet the
     size of the room painted over the room, which is the mistake the Dendur
     glass wall made, and bars read as a skylight anyway. */
  /* ------------- The Charles Engelhard Court, Met gallery 700 -------------
     The object everyone photographs here is the FACADE OF THE SECOND BRANCH
     BANK OF THE UNITED STATES, Martin Euclid Thompson, 15 Wall Street, built
     1822 to 1824, demolished 1915, the facade saved by Met president Robert
     W. de Forest and reconstructed in 1924 as the front of the American Wing.
     It is now the south wall of the glassed Engelhard Court.

     PUBLISHED, and it is the one number the whole model is scaled from:
     the front is 75 FEET. Stokes, Iconography of Manhattan Island, plate
     1825-F-25 (Deak 343), whose own engraved caption reads "Branch Bank of
     U. S. erected 1825 - front 75 feet"; the same plate is NYPL Digital
     Collections Hades-118424-54550.
     PUBLISHED counts, from the Met's object page for the facade (object
     852570, object number AW.BankFacade) and from the Met's audio guide 3801,
     Morrison Heckscher, curator of the American Wing: TWO storeys, SEVEN
     bays, a PROJECTING CENTRE SECTION CAPPED BY A PEDIMENT, and on the
     second-floor level FOUR COLUMNS in the Greek Ionic order carrying that
     pediment. Marble. Vertical rectangular windows. Ionic capitals and some
     Greek cornice mouldings over an English Palladian composition.

     SCALED, not published, and declared as scaled. Every other dimension is
     measured off that same Stokes plate, which is a near-orthographic
     elevation, at 35.0 pixels per foot (the 75 ft front spans image x 576 to
     3200 in the 3840 px Commons rendering):
       ground line          image y 2696
       first-floor cornice  image y 1960   ->  21.0 ft, the ground storey
       main cornice         image y 1200   ->  42.7 ft to the eaves
       pediment apex        image y  928   ->  50.5 ft overall
       projecting centre    image x 1344 to 2440  ->  31.3 ft, 3 of the 7 bays
       the four columns at  image x 1496, 1800, 2096, 2376
     NAMED GAPS. No published height, storey height, bay module, column
     diameter or step count exists anywhere this run could reach; the Met's
     own object page carries no Dimensions field at all, which corrects the
     previous run's plan to read one there. Everything above the width is
     therefore scaled off the engraving and must not be quoted as published.
     No published dimension for the COURT itself either, so the court is drawn
     as an envelope around the facade rather than to a size. */
  function americanCourt(ctx) {
    var r = ctx.room, z = ctx.zBase, P = ctx.project, out = [];
    var wall = ctx.wall || 26;

    /* two marble tones plus the shadowed reveal, so the facade is not one
       grey slab; checklist item 5 */
    var MARBLE = "#efece1", MARBLE_D = "#d3cebd", REVEAL = "#b8b2a0",
        SHADOW = "#c9c3b1", GLASS = "#dbe4e6", GLASS_D = "#aab6ba",
        BRONZE = "#6d6350";

    /* 75 ft of front, fitted to the room and to the wall height the scene
       gives us; k is feet-to-scene-units and everything below is in FEET. */
    var FW = 75, FH = 50.5;
    var k = Math.min((r.w * 0.80) / FW, (wall * 0.86) / FH);
    var F = k;                                   /* one foot */
    var W = FW * F;
    var cx = r.x + r.w / 2, y0 = r.y + r.h * 0.34;
    var x1 = cx - W / 2, x2 = cx + W / 2;
    var D = 3.0 * F;                             /* wall thickness, scaled */
    var PROJ = 1.6 * F;                          /* how far the centre steps out */

    var HG = 21.0 * F;      /* ground storey, to the first-floor cornice */
    var HC = 42.7 * F;      /* to the main cornice */
    var HA = 50.5 * F;      /* to the pediment apex */
    var PLINTH = 1.4 * F;

    /* THE COURT, drawn at the SAME foot scale as the facade instead of over
       the whole room box. Drawn to the room, the court swallowed the building
       and the picture read as a model standing on a lake. No published court
       dimension was reachable, so the extent is an envelope around the 75 ft
       front, declared as an envelope and claiming no size. */
    var CW = 96 * F, CD = 74 * F;
    var qx1 = cx - CW / 2, qx2 = cx + CW / 2;
    var qy1 = y0 - 4 * F, qy2 = y0 - 4 * F + CD;

    out.push(flat(ctx, qx1, qy1, qx2, qy2, z + 0.4, "#e9e3d5", "#c9c1ac", 0.5, -1e9));

    /* THE GLASS ROOF. Drawn as a LATTICE, not a filled sheet. Filled, it was
       an opaque pale blue plane the size of the room and the court read as a
       swimming pool; that is the sixth time in this file a large flat surface
       has wrecked what it sits over, and the cure this time is to draw only
       the members and leave the openings empty rather than to give the plane
       a depth. */
    var GZ = z + wall * 0.93;
    var gi;
    for (gi = 0; gi <= 8; gi++) {
      var gx = qx1 + (CW * gi) / 8;
      out.push(flat(ctx, gx - 0.30 * F, qy1, gx + 0.30 * F, qy2, GZ,
                    GLASS_D, null, 0, -9.95e8));
    }
    for (gi = 0; gi <= 5; gi++) {
      var gy = qy1 + (CD * gi) / 5;
      out.push(flat(ctx, qx1, gy - 0.30 * F, qx2, gy + 0.30 * F, GZ + 0.05,
                    GLASS, null, 0, -9.94e8));
    }

    /* GROUND SHADOW. Without it the facade floated; checklist item 6. */
    out.push(flat(ctx, x1 - 1.2 * F, y0 + D, x2 + 1.2 * F, y0 + D + 5.5 * F, z + 0.5,
                  SHADOW, null, 0, -9.90e8));

    /* ---- the body of the facade, in three pieces so the centre PROJECTS ---
       Depths are explicit and ordered back to front: flanking wings, then the
       projecting centre, then the columns, then the pediment. The pediment
       used to sit BEHIND the centre it is supposed to cap and read as a bar
       hanging in daylight; it is seated on the centre now. */
    var pw = 31.3 * F;                     /* the projecting centre, 3 bays */
    var pl = cx - pw / 2, pr = cx + pw / 2;
    var yF = y0;                           /* front face of the wings */
    var yP = y0 - PROJ;                    /* front face of the centre */

    /* plinth under the whole front; checklist item 3, it sat on bare floor */
    out = out.concat(mass(ctx, x1 - 0.8 * F, yP - 0.6 * F, x2 + 0.8 * F, y0 + D,
                          z, PLINTH, MARBLE_D, REVEAL, -9.86e8));

    /* the two flanking wings, two bays each */
    out = out.concat(mass(ctx, x1, yF, pl, y0 + D, z + PLINTH, HC - PLINTH,
                          MARBLE, REVEAL, -9.84e8));
    out = out.concat(mass(ctx, pr, yF, x2, y0 + D, z + PLINTH, HC - PLINTH,
                          MARBLE, REVEAL, -9.84e8));

    /* the projecting centre */
    out = out.concat(mass(ctx, pl, yP, pr, y0 + D, z + PLINTH, HC - PLINTH,
                          MARBLE, REVEAL, -9.80e8));

    /* THE STRING COURSE at the first-floor cornice, 21.0 ft up. The whole
       facade was drawn as one colossal storey and the published fact is two,
       so this is the horizontal break that was missing; checklist item 2. */
    function belt(bx1, by, bx2, zz, dep) {
      return mass(ctx, bx1 - 0.4 * F, by - 0.4 * F, bx2 + 0.4 * F, y0 + D,
                  zz, 0.9 * F, MARBLE_D, REVEAL, dep);
    }
    out = out.concat(belt(x1, yF, pl, z + HG, -9.78e8));
    out = out.concat(belt(pr, yF, x2, z + HG, -9.78e8));
    out = out.concat(belt(pl, yP, pr, z + HG, -9.76e8));

    /* ---- SEVEN BAYS OF WINDOWS, two storeys, vertical rectangles ----
       Bay centres are the seven twelfths of the 75 ft front read off the
       plate. Each opening gets a reveal struck in the darker marble so it
       reads as cut into a wall rather than painted on it. */
    var bay = FW / 7 * F;
    for (var i = 0; i < 7; i++) {
      var bxc = x1 + bay * (i + 0.5);
      var centre = (i >= 2 && i <= 4);
      var fy = centre ? yP : yF;
      var dep = centre ? -9.60e8 : -9.64e8;
      var ww = 3.6 * F;
      /* ground storey: the centre bay is the ARCHED DOORWAY on the plate */
      if (i === 3) {
        out.push(flat(ctx, bxc - ww * 0.62, fy - 0.35, bxc + ww * 0.62, fy - 0.35,
                      z + PLINTH, REVEAL, null, 0, dep));
        out = out.concat(mass(ctx, bxc - ww * 0.62, fy - 0.5, bxc + ww * 0.62, fy - 0.2,
                              z + PLINTH, 12.5 * F, "#5f574a", BRONZE, dep));
        /* the arched head, an n-gon so the arch is an arch */
        var arc = [], ar = ww * 0.62, az = z + PLINTH + 12.5 * F;
        for (var a = 0; a <= 14; a++) {
          var th = Math.PI * (a / 14);
          arc.push(P(bxc - Math.cos(th) * ar, fy - 0.35, az + Math.sin(th) * ar * 0.8));
        }
        out.push({ svg: ctx.poly(arc, "#6a6153", REVEAL, 0.6), depth: dep - 1e6 });
      } else {
        out = out.concat(mass(ctx, bxc - ww / 2, fy - 0.5, bxc + ww / 2, fy - 0.2,
                              z + PLINTH + 4.0 * F, 9.5 * F, "#6f675a", REVEAL, dep));
      }
      /* upper storey: tall vertical windows, each with the little cornice
         cap the plate shows over them */
      var uz = z + HG + 1.4 * F;
      out = out.concat(mass(ctx, bxc - ww / 2, fy - 0.5, bxc + ww / 2, fy - 0.2,
                            uz, 12.0 * F, "#6f675a", REVEAL, dep));
      out = out.concat(mass(ctx, bxc - ww * 0.72, fy - 0.7, bxc + ww * 0.72, fy - 0.15,
                            uz + 12.0 * F, 0.8 * F, MARBLE_D, REVEAL, dep - 2e6));
    }

    /* ---- THE FOUR IONIC COLUMNS, second-floor level only ----
       Published as four, and published as standing at the second-floor level,
       not running the whole height; the last model had eight stubs stuck flat
       to the wall for its full height, reading as pilasters. They stand clear
       of the projecting centre and are drawn after it. Shaft and capital are
       given different tones because they were the same before. */
    var colZ = z + HG + 0.9 * F, colH = HC - HG - 3.4 * F;
    var cxs = [1496, 1800, 2096, 2376];      /* image px on the Stokes plate */
    for (var ci = 0; ci < 4; ci++) {
      var fx = cx + ((cxs[ci] - 1888) / 35.0) * F;   /* 1888 px = the centre line */
      var cr = 1.15 * F;
      out = out.concat(batteredMass(ctx, fx - cr, yP - PROJ * 0.55 - cr,
                                    fx + cr, yP - PROJ * 0.55 + cr,
                                    colZ, colH, 0.010, "#f6f3ea", -9.50e8 + ci));
      /* the Ionic capital, wider and in a different tone */
      out = out.concat(mass(ctx, fx - cr * 1.55, yP - PROJ * 0.55 - cr * 1.35,
                            fx + cr * 1.55, yP - PROJ * 0.55 + cr * 1.35,
                            colZ + colH, 1.3 * F, "#fbf9f2", MARBLE_D, -9.46e8 + ci));
      /* and a base, so the shafts do not grow out of nothing */
      out = out.concat(mass(ctx, fx - cr * 1.35, yP - PROJ * 0.55 - cr * 1.25,
                            fx + cr * 1.35, yP - PROJ * 0.55 + cr * 1.25,
                            colZ - 0.7 * F, 0.7 * F, MARBLE_D, REVEAL, -9.52e8 + ci));
    }

    /* THE ENTABLATURE the columns carry, then THE PEDIMENT SEATED ON IT.
       Both are pushed forward to the column line so the pediment caps the
       projecting centre instead of floating behind it. */
    var eZ = z + HC - 2.1 * F, eY = yP - PROJ * 0.55 - 1.3 * F;
    out = out.concat(mass(ctx, pl - 0.5 * F, eY, pr + 0.5 * F, y0 + D,
                          eZ, 2.1 * F, "#f7f4ec", REVEAL, -9.40e8));
    /* the main cornice, carried right across the wings as well */
    out = out.concat(mass(ctx, x1 - 0.9 * F, yF - 0.9 * F, pl, y0 + D,
                          z + HC - 1.5 * F, 1.5 * F, "#f7f4ec", REVEAL, -9.42e8));
    out = out.concat(mass(ctx, pr, yF - 0.9 * F, x2 + 0.9 * F, y0 + D,
                          z + HC - 1.5 * F, 1.5 * F, "#f7f4ec", REVEAL, -9.42e8));

    var pz = z + HC, ph = HA - HC;
    out.push({ svg: ctx.poly([P(pl - 0.5 * F, eY, pz), P(pr + 0.5 * F, eY, pz),
                              P(cx, eY, pz + ph)],
                             ctx.shade(MARBLE, 0, -1, 0.28), REVEAL, 0.7),
               depth: -9.30e8 });
    /* the raking cornice, a shade darker, so the tympanum is not one flat tone */
    out.push({ svg: ctx.poly([P(pl - 1.1 * F, eY - 0.3, pz), P(pr + 1.1 * F, eY - 0.3, pz),
                              P(pr + 1.1 * F, eY - 0.3, pz + 0.8 * F),
                              P(pl - 1.1 * F, eY - 0.3, pz + 0.8 * F)],
                             MARBLE_D, REVEAL, 0.6), depth: -9.28e8 });

    /* THE STEPS up to the arched door; the facade opened straight off the
       floor before. Four treads, and the count is SCALED off the plate, not
       published. */
    for (var s = 0; s < 4; s++) {
      var sw2 = 11.0 * F - s * 0.5 * F;
      out = out.concat(mass(ctx, cx - sw2, yP - 3.2 * F + s * 0.8 * F, cx + sw2,
                            yP + 0.2, z + s * (PLINTH / 4),
                            PLINTH / 4, MARBLE_D, REVEAL, -9.24e8 + s));
    }

    /* ONE PIECE OF SCULPTURE in the court, because the court is a sculpture
       court and a visitor names the sculpture before the wall behind it.
       Size is not published; it is drawn at a plausible pedestal-and-figure
       scale and claims no identity. */
    var sx = cx - CW * 0.31, sy = qy1 + CD * 0.66;
    out = out.concat(mass(ctx, sx - 1.5 * F, sy - 1.5 * F, sx + 1.5 * F, sy + 1.5 * F,
                          z + 0.5, 3.4 * F, "#ded8ca", REVEAL, -8.0e8));
    out = out.concat(batteredMass(ctx, sx - 0.9 * F, sy - 0.9 * F, sx + 0.9 * F,
                                  sy + 0.9 * F, z + 0.5 + 3.4 * F, 6.2 * F, 0.05,
                                  "#c9b48c", -7.9e8));
    return out;
  }


  /* ---------------- The Astor Chinese Garden Court ----------------
     A Ming scholar's courtyard, modelled on the Garden of the Master of the
     Fishing Nets in Suzhou and built here by craftsmen using Ming methods.
     Roughly 59 by 40 feet, published.

     The thing everyone photographs is the MOON GATE: a perfect circle cut
     through a white wall. That is the landmark, so that is what is drawn,
     along with the roofed walkway on one side. A framed painting was never
     going to say any of this. */
  /* ------------------------------------------------------------------
     GALLERY 217, THE ASTOR CHINESE GARDEN COURT
     Published and traceable: the court is "roughly 59 feet by 40"
     (Christian Science Monitor, 7 July 1981, on the opening), and it was
     built by 27 Chinese engineers and craftsmen in the same report. The
     Met's own object record for it lists the materials this draws in:
     Taihu rocks, a granite terrace, ceramic tile flooring, roof tiles,
     nan wood columns, pine beams, gingko latticework, brass fittings.
     It copies a courtyard in the Garden of the Master of the Fishing Nets,
     Suzhou.
     COUNTED FROM PHOTOGRAPHS, not from memory, because the old version of
     this room was a plank on six dark posts and a grey oval, and every one
     of those four facts is wrong. Two Commons photographs of this court
     were read this run:
       "Astor court colonnade" - the corridor columns are ROUND and BARE
       pale honey nan wood, the beams and brackets above them are near
       BLACK, and a low pierced balustrade runs between the column feet.
       The roof is grey barrel tile finishing in a round eave-drip course,
       and the light above is a DIAGONAL glazed diagrid.
       "Astor court moon gate" - the gate is a true circle cut through a
       thick wall, ringed in grey bluestone with a thin dark timber outer
       edge, standing on a flat raised sill, and what shows through it is
       the DARK of a passage, not glass.
     THE NAMED GAP, left as a gap: no published column count for the
     corridor was found, so the run of columns is drawn continuing past the
     edge of the court rather than closed at a total. It claims a rhythm,
     which the photograph shows, and does not claim a number, which nothing
     read this run publishes. The Winter 1980-81 Metropolitan Museum
     Bulletin, "A Chinese Garden Court", is the named route to it.
     ------------------------------------------------------------------ */
  function astorCourt(ctx) {
    var r = ctx.room, z = ctx.zBase, P = ctx.project, out = [];
    var wall = ctx.wall || 26;
    var FT = 1.1;
    var CW = 59, CD = 40;                       /* published, 1981 */
    var k = Math.min((r.w * 0.86) / CW, (r.h * 0.78) / CD, FT);
    var W = CW * k, D = CD * k;
    var cx = r.x + r.w / 2, cy = r.y + r.h / 2;
    var x1 = cx - W/2, x2 = cx + W/2, y1 = cy - D/2, y2 = cy + D/2;

    /* Two tones per material, which is checklist item 6. Plaster is not one
       white, tile is not one grey, and the timber here is genuinely TWO
       timbers: pale bare column, near-black beam. */
    var PLASTER = "#eceae2", PLASTER_D = "#cdcabf";
    var TILE = "#5f5b57", TILE_D = "#46433f";
    var BEAM = "#3a2c22", BEAM_D = "#291f18";
    var NAN = "#c08e56", NAN_D = "#9a6c3c";     /* bare nan wood, not lacquer */
    var BLUE = "#9aa5a4", BLUE_D = "#77817f";   /* the bluestone gate ring */
    var ROCK = "#cfc9bb", PAVE = "#ded8ca";

    /* the granite terrace the whole court stands on */
    out.push(flat(ctx, x1, y1, x2, y2, z + 0.4, PAVE, "#bdb5a2", 0.5, -1e9));
    /* paving joints: a texture in the plane of the floor, claiming no count */
    for (var pv = 1; pv < 9; pv++) {
      var pvx = x1 + W * (pv / 9);
      out.push({ svg: ctx.poly([P(pvx, y1, z + 0.5), P(pvx, y2, z + 0.5)],
                               "none", "#c7bfad", 0.4), depth: -9.99e8 });
    }

    var H = wall * 0.62;

    /* THE WHITE WALL carrying the moon gate, at an EXPLICIT depth. Left to
       sort on its own corners it painted straight over the gate, and the
       gate is the entire reason this room is worth drawing. That is the
       fourth time in this file a large flat surface has buried what stands
       in front of it; large planes get an explicit depth, always. */
    out = out.concat(mass(ctx, x1, y1, x2, y1 + 2.2, z, H, PLASTER, PLASTER_D, -9.8e8));

    /* THE MOON GATE, a true circle cut through a thick wall, in the left
       half of the wall so the corridor can stand along the right of it.
       Three rings, outermost first: dark timber edge, bluestone surround,
       then the dark of the passage itself. A circle is the one shape here
       that must not be approximated, because the circle IS the subject. */
    var rr = H * 0.33, mcx = cx - W * 0.27, mcz = z + H * 0.44;
    function ring(rad, yy, fill, stroke, dep) {
      var pts = [];
      for (var a = 0; a < 40; a++) {
        var th = (a / 40) * Math.PI * 2;
        pts.push(P(mcx + Math.cos(th) * rad, yy, mcz + Math.sin(th) * rad));
      }
      out.push({ svg: ctx.poly(pts, fill, stroke, 0.6), depth: dep });
    }
    ring(rr * 1.20, y1 - 0.36, BEAM, BEAM_D, -9.62e8);      /* timber edge */
    ring(rr * 1.10, y1 - 0.34, BLUE, BLUE_D, -9.58e8);      /* bluestone */
    ring(rr,        y1 - 0.30, "#5c554d", "#463f39", -9.54e8); /* the passage */
    /* the flat raised sill the circle stands on, which is why a moon gate
       reads as a doorway and not as a porthole */
    out = out.concat(mass(ctx, mcx - rr * 0.92, y1 - 0.5, mcx + rr * 0.92, y1 + 0.1,
                          z, 1.4 * FT, BLUE, BLUE_D, -9.50e8));
    /* the carved plaque above it, which both photographs show */
    out = out.concat(mass(ctx, mcx - rr * 0.42, y1 - 0.45, mcx + rr * 0.42, y1 - 0.1,
                          mcz + rr * 1.34, 2.2 * FT, "#9c7d5c", "#7b6046", -9.52e8));

    /* PIERCED LATTICE WINDOWS in the white wall, right of the gate, the
       gingko latticework the Met's own materials list names. Two of them,
       because two are what the colonnade photograph shows on that wall. */
    [0.10, 0.30].forEach(function (fr) {
      var wx = cx + W * fr, ww = 3.4 * FT, wz = z + H * 0.52;
      out.push({ svg: ctx.poly([P(wx - ww, y1 - 0.2, wz - ww), P(wx + ww, y1 - 0.2, wz - ww),
                                P(wx + ww, y1 - 0.2, wz + ww), P(wx - ww, y1 - 0.2, wz + ww)],
                               "#d8d4c8", "#8f887a", 0.6), depth: -9.7e8 });
      for (var g = 1; g < 4; g++) {
        var gu = -ww + (2 * ww) * (g / 4);
        out.push({ svg: ctx.poly([P(wx + gu, y1 - 0.22, wz - ww), P(wx + gu, y1 - 0.22, wz + ww)],
                                 "none", "#8f887a", 0.5), depth: -9.69e8 });
        out.push({ svg: ctx.poly([P(wx - ww, y1 - 0.22, wz + gu), P(wx + ww, y1 - 0.22, wz + gu)],
                                 "none", "#8f887a", 0.5), depth: -9.69e8 });
      }
    });

    /* THE COVERED WALKWAY. Round bare columns, a near-black beam across
       their heads, a barrel-tile roof, and the low pierced balustrade that
       runs between the column feet. The run is deliberately cut by the edge
       of the court rather than closed: see the named gap above. */
    var wy1 = y1 + 2.4, wy2 = y1 + 2.4 + 9 * FT;     /* corridor depth */
    var colH = H * 0.70, colR = 0.62 * FT;
    var runX1 = cx - W * 0.03, runX2 = x2 + 3;       /* runs off the edge */
    var bay = 7.2 * FT, cols = [];
    for (var bx = runX1; bx <= runX2; bx += bay) cols.push(bx);

    function post(px, py, rad, hgt, fill, dark) {
      var lo = [], hi = [], N = 10;
      for (var a = 0; a < N; a++) {
        var th = (a / N) * Math.PI * 2;
        lo.push([px + Math.cos(th) * rad, py + Math.sin(th) * rad]);
      }
      for (var b = 0; b < N; b++) {
        var b2 = (b + 1) % N;
        var nx = Math.cos(((b + 0.5) / N) * Math.PI * 2), ny = Math.sin(((b + 0.5) / N) * Math.PI * 2);
        if (!ctx.faceVisible(nx, ny)) continue;
        var q = [P(lo[b][0], lo[b][1], z), P(lo[b2][0], lo[b2][1], z),
                 P(lo[b2][0], lo[b2][1], z + hgt), P(lo[b][0], lo[b][1], z + hgt)];
        out.push({ svg: ctx.poly(q, ctx.shade(fill, nx, ny, 0), dark, 0.4), depth: depthOf(q) });
      }
    }

    /* the balustrade first, so a column stands in front of its own rail */
    out = out.concat(mass(ctx, runX1 - bay * 0.5, wy2 - 0.9, runX2, wy2, z,
                          2.6 * FT, "#dcd6c8", "#b4ab98", -8.9e8));
    for (var pb = runX1 - bay * 0.5; pb < runX2; pb += bay * 0.34) {
      out = out.concat(mass(ctx, pb + bay * 0.10, wy2 - 0.95, pb + bay * 0.24, wy2 + 0.05,
                            z + 0.9 * FT, 1.2 * FT, "#8f887a", "#6f6a5f", -8.88e8));
    }

    cols.forEach(function (px) {
      post(px, wy2 - 1.6, colR, colH, NAN, NAN_D);       /* the outer file */
      post(px, wy1 + 0.9, colR, colH, NAN, NAN_D);       /* against the wall */
    });

    /* the near-black beam over the column heads, then the bracket blocks */
    out = out.concat(mass(ctx, runX1 - bay * 0.5, wy2 - 2.4, runX2, wy2 - 1.0,
                          z + colH, 1.5 * FT, BEAM, BEAM_D, -8.7e8));
    cols.forEach(function (px) {
      out = out.concat(mass(ctx, px - 1.4 * FT, wy2 - 2.6, px + 1.4 * FT, wy2 - 0.8,
                            z + colH + 1.5 * FT, 0.9 * FT, BEAM, BEAM_D, -8.68e8));
    });

    /* THE ROOF. Grey barrel tile, pitched back toward the wall, finishing
       in the round eave-drip course that gives a Chinese eave its scallop.
       Drawn as a shallow leaning slab plus the drip circles; the scallop is
       the tell, and without it a tile roof reads as a plank. */
    var rz = z + colH + 2.6 * FT;
    out = out.concat(mass(ctx, runX1 - bay * 0.6, wy2 - 3.4, runX2, wy1 - 0.6, rz,
                          1.5 * FT, TILE, TILE_D, -8.6e8));
    out = out.concat(mass(ctx, runX1 - bay * 0.6, wy1 - 0.6, runX2, wy1 + 1.0,
                          rz + 1.5 * FT, 2.4 * FT, TILE, TILE_D, -8.58e8));
    /* the drip course: a row of round eave tiles along the front edge */
    for (var dx = runX1 - bay * 0.6; dx < runX2; dx += 1.5 * FT) {
      var dpt = [];
      for (var da = 0; da < 10; da++) {
        var dth = (da / 10) * Math.PI * 2;
        dpt.push(P(dx + Math.cos(dth) * 0.62 * FT, wy2 - 3.5,
                   rz + 0.15 * FT + Math.sin(dth) * 0.62 * FT));
      }
      out.push({ svg: ctx.poly(dpt, TILE_D, "#3a3835", 0.35), depth: -8.55e8 });
    }

    /* THE ROCKERY. A standing Taihu stele against the white wall, which is
       what the colonnade photograph shows, and low rocks in the open court.
       Taihu limestone is pierced and irregular; drawn leaning, never as a
       pyramid, because a pyramid is the box this standard was written
       against. */
    var sx = cx - W * 0.40, sy = y1 + 4.5;
    out = out.concat(batteredMass(ctx, sx - 1.5, sy - 1.2, sx + 1.5, sy + 1.2,
                                  z, H * 0.52, -0.10, ROCK, -9.1e8));
    out = out.concat(batteredMass(ctx, sx - 0.9, sy - 0.8, sx + 1.9, sy + 0.9,
                                  z + H * 0.52, H * 0.16, 0.30, ROCK, -9.09e8));
    [[0.14, 0.70, 0.20], [0.26, 0.80, 0.13], [0.40, 0.66, 0.10]].forEach(function (rk, ri) {
      var rx = x1 + W * rk[0], ry = y1 + D * rk[1], rs = H * rk[2];
      out = out.concat(batteredMass(ctx, rx - rs * 0.62, ry - rs * 0.42,
                                    rx + rs * 0.58, ry + rs * 0.46,
                                    z, rs, -0.06, ROCK, -8.4e8 + ri));
    });

    /* THE SKYLIGHT. The court is roofed by a glazed DIAGONAL grid, and it is
       the reason a visitor knows this garden is indoors. Drawn overhead as
       diamonds, at the far end of the sort so nothing below is touched. */
    var gz = z + wall * 0.98, step = 7 * FT;
    /* Sorted at the FAR end, not the near one. Drawn last it painted over
       the whole court, which is the same painter's-depth trap a floor plane
       sets, arriving this time from above. And each diagonal is CLIPPED to
       the court: swept unbounded it drew a grid across the empty page and
       the room stopped reading as a room. */
    function skyLine(ax, ay, bx, by) {
      var t0 = 0, t1 = 1, dx = bx - ax;
      if (dx !== 0) {
        var ta = (x1 - ax) / dx, tb = (x2 - ax) / dx;
        t0 = Math.max(0, Math.min(ta, tb));
        t1 = Math.min(1, Math.max(ta, tb));
      }
      if (t1 <= t0) return;
      out.push({ svg: ctx.poly([P(ax + dx * t0, ay + (by - ay) * t0, gz),
                                P(ax + dx * t1, ay + (by - ay) * t1, gz)],
                               "none", "#b9c6cc", 0.5), depth: -9.995e8 });
    }
    for (var s1 = -D; s1 < W + D; s1 += step) {
      skyLine(x1 + s1, y1, x1 + s1 + D, y2);
      skyLine(x1 + s1, y2, x1 + s1 + D, y1);
    }
    return out;
  }

  /* A plain rectangular mass with its own stroke colour. batteredMass is the
     Egyptian one and hard-codes a sandstone outline, which is wrong on white
     plaster and on grey marble. Faces cull on their own normals; the optional
     depth is there because a wall spanning a whole gallery cannot be sorted on
     its own corners without painting over the room. */
  function mass(ctx, x1, y1, x2, y2, z0, h, fill, stroke, depth) {
    var P = ctx.project, out = [];
    var b = [[x1, y1], [x2, y1], [x2, y2], [x1, y2]];
    var norm = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    for (var i = 0; i < 4; i++) {
      if (!ctx.faceVisible(norm[i][0], norm[i][1])) continue;
      var j = (i + 1) % 4;
      var q = [P(b[i][0], b[i][1], z0), P(b[j][0], b[j][1], z0),
               P(b[j][0], b[j][1], z0 + h), P(b[i][0], b[i][1], z0 + h)];
      out.push({ svg: ctx.poly(q, ctx.shade(fill, norm[i][0], norm[i][1], 0), stroke, 0.5),
                 depth: (depth === undefined ? depthOf(q) : depth + i * 0.1) });
    }
    var top = [P(x1, y1, z0 + h), P(x2, y1, z0 + h), P(x2, y2, z0 + h), P(x1, y2, z0 + h)];
    out.push({ svg: ctx.poly(top, ctx.shade(fill, 0, 0, 1), stroke, 0.5),
               depth: (depth === undefined ? depthOf(top) : depth + 0.6) });
    return out;
  }

  /* A framed canvas hung flat on a wall, in that wall's own coordinates. It is
     drawn as a rectangle of the published SIZE and nothing else. Three of the
     four works these two rooms are built around are still in copyright, and a
     dimension is not. This function is why the rooms can be honest: it draws
     how big something is, never what is on it. */
  function canvasOn(ctx, map, uc, zc, wide, high, depth) {
    var out = [];
    var u0 = uc - wide / 2, u1 = uc + wide / 2, z0 = zc - high / 2, z1 = zc + high / 2;
    var f = Math.max(0.35, wide * 0.035);
    out.push({ svg: ctx.poly([map(u0 - f, z0 - f), map(u1 + f, z0 - f),
                              map(u1 + f, z1 + f), map(u0 - f, z1 + f)],
                             "#3b3a36", "#26251f", 0.4), depth: depth });
    out.push({ svg: ctx.poly([map(u0, z0), map(u1, z0), map(u1, z1), map(u0, z1)],
                             "#d8cfb9", "#a89d84", 0.4), depth: depth + 0.05 });
    return out;
  }

  /* ---------------- Gallery 851, the modern wing ----------------
     The plan's `modern` node stands for the Lila Acheson Wallace Wing, and the
     stop's own card names three works in it. They are in three DIFFERENT
     galleries, 851, 955 and 965, so hanging all three on one wall would be a
     lie told for convenience. This is gallery 851, and it is drawn around the
     one thing that gallery is: Pollock's Autumn Rhythm on the end wall.

     PUBLISHED, from the Met's own collection API, object 488978: the canvas is
     "8 ft. 10 1/4 in. x 17 ft. 4 in." Seventeen feet four. That number is the
     entire reason this room is worth drawing, because no photograph of it ever
     conveys that the painting is nearly three times as wide as a person is
     tall, and a room drawn to scale does.

     It is drawn as a bare stretched rectangle at that size. The painting is in
     copyright; its dimensions are not, and the size is the subject here.

     SCHEMATIC, on the Dendur precedent, and the page says so: the room
     envelope is the floor plan's rectangle, not a survey. Only the ceiling is
     assumed, at 14 ft, which is what fixes feet to plan units and makes the
     envelope come out near 69 by 56 ft. The hanging centre line is 57 in,
     which is the museum standard rather than a measurement of this wall.

     The style is the white cube, and the styles book now carries it. */
  function modern(ctx) {
    var r = ctx.room, z = ctx.zBase, P = ctx.project, out = [];
    var wall = ctx.wall || 26;
    var FT = wall / 14;                       /* 14 ft ceiling fixes the scale */
    var WALL = "#f3f2ee", WALL_D = "#cdcac2", FLOOR = "#cac4b8";
    var COVE = "#fdfcf7", BENCH = "#8d8577", BENCH_D = "#6a6357";

    /* The plan's rectangle is the WING, not one gallery, so it is used the way
       the American Court uses its own: as a stage to stand a room on. Filling
       it edge to edge produced a 69 by 56 ft hall with a 14 ft ceiling, which
       rendered as a shallow tray and was nobody's gallery. This is 34 by 26 ft
       inside, which is a room, and it sits in the middle of the plan slot. */
    var GW = 34 * FT, GD = 26 * FT;
    var cx = r.x + r.w / 2, cy = r.y + r.h / 2;
    var x1 = cx - GW / 2, x2 = cx + GW / 2, y1 = cy - GD / 2, y2 = cy + GD / 2;

    out.push(flat(ctx, r.x, r.y, r.x + r.w, r.y + r.h, z, "#dcd7cc", "#bdb6a8", 0.5, -1e9));
    out.push(flat(ctx, x1, y1, x2, y2, z + 0.1, FLOOR, "#b0a99c", 0.5, -9.99e8));

    /* Three walls, each at an explicit depth. A white cube is mostly wall, and
       a wall spanning the room has a nearer corner than the painting hanging
       in the middle of it. The fourth wall is the one you are looking in
       through, so it is not there at all. */
    var T = Math.max(1.2, GW * 0.022);
    out = out.concat(mass(ctx, x1, y1, x2, y1 + T, z, wall, WALL, WALL_D, -9.8e8));
    /* The side walls run the whole depth of the room, so their near ends are
       far closer to the eye than the back wall is. They must therefore paint
       AFTER the picture hanging on the back wall, or a seventeen foot canvas
       spills out across a wall standing in front of it. */
    out = out.concat(mass(ctx, x1, y1, x1 + T, y2, z, wall, WALL, WALL_D, -9.0e8));
    out = out.concat(mass(ctx, x2 - T, y1, x2, y2, z, wall, WALL, WALL_D, -9.0e8));

    /* the light cove: a white cube is lit from a slot along the top of the
       wall, and it is the only thing in the room that is not a flat plane */
    out = out.concat(mass(ctx, x1, y1, x2, y1 + T * 0.5, z + wall - 1.0, 1.0,
                          COVE, "#e6e3d8", -9.75e8));

    /* AUTUMN RHYTHM, on the end wall, at its published 17 ft 4 in by 8 ft
       10 1/4 in, centred on the 57 inch museum hanging line. On a 34 ft wall
       it takes half the room, which is the fact the model exists to carry. */
    if (ctx.faceVisible(0, 1)) {
      var mapB = function (u, zz) { return P(u, y1 + T, zz); };
      var W_FT = 17 + 4 / 12, H_FT = 8 + 10.25 / 12;
      out = out.concat(canvasOn(ctx, mapB, cx, z + (57 / 12) * FT,
                                W_FT * FT, H_FT * FT, -9.5e8));
    }

    /* A bench, 4 ft long and 17 in high wherever you find one, and a 7 ft
       doorway through to the next gallery. Scale needs something a body
       already knows the size of; two things are better than one. */
    var bcy = y2 - GD * 0.26;
    out = out.concat(mass(ctx, cx - 2 * FT, bcy - 0.75 * FT, cx + 2 * FT, bcy + 0.75 * FT,
                          z + 0.1, (17 / 12) * FT, BENCH, BENCH_D, -8.0e8));
    /* on whichever side wall is actually turned towards us, or it is a scale
       cue the reader never sees */
    var side = ctx.faceVisible(1, 0) ? x1 + T : (ctx.faceVisible(-1, 0) ? x2 - T : null);
    if (side !== null) {
      var mapS = function (u, zz) { return P(side, u, zz); };
      var dc = y1 + GD * 0.60;
      out.push({ svg: ctx.poly([mapS(dc - 2.2 * FT, z), mapS(dc + 2.2 * FT, z),
                                mapS(dc + 2.2 * FT, z + 7 * FT), mapS(dc - 2.2 * FT, z + 7 * FT)],
                               "#b9b4a8", WALL_D, 0.4), depth: -8.9e8 });
    }
    return out;
  }

  /* ---------------- The Grand Staircase ----------------
     The plan calls this one plumbing and the camera used to refuse to enter
     it. It is not plumbing. It is Richard Morris Hunt's ceremonial ascent out
     of the Great Hall, and there is an eighteen foot Tiepolo at the top of it.

     PUBLISHED, from the Met's collection API, object 437788: The Triumph of
     Marius, Giovanni Battista Tiepolo, 1729, "220 x 128 5/8 in." That is 18 ft
     4 in high by 10 ft 8 5/8 in wide, and the model hangs it at exactly that
     proportion in the arch at the head of the stair, where a photograph from
     the Great Hall shows it.

     READ OFF THAT PHOTOGRAPH, which is a source for shape even where it is
     useless for size: ONE straight flight, no half landing, running the full
     width of the bay; SOLID panelled parapets rather than open balustrades,
     with brass handrails on them; paired columns standing outside the well on
     both sides; a single great arch at the head framing the painting.

     NOT CLAIMED: the number of treads. The flight is crowded in every
     photograph of it and the risers compress with perspective, so a count off
     the picture would be a guess wearing a decimal point. The model draws a
     flight that reads correctly and says here that its step count is chosen,
     not counted. The rise is one storey because the stair joins floor 1 to
     floor 2, which the plan already knows. */
  function grandStair(ctx) {
    var r = ctx.room, z = ctx.zBase, P = ctx.project, out = [];
    var wall = ctx.wall || 26;
    var STONE = "#e0d9c9", STONE_D = "#b2a992", TREAD = "#cdc5b3";
    var DARK = "#9a9382", BRASS = "#c8a44a", SKY = "#3d5a78";

    var x1 = r.x, x2 = r.x + r.w, y1 = r.y, y2 = r.y + r.h;
    out.push(flat(ctx, x1, y1, x2, y2, z, "#c9c2b2", "#a49c88", 0.5, -1e9));

    /* the flight: from the Great Hall floor at the near end up to the landing
       at the far end, one storey, one straight run */
    var PAR = r.w * 0.18;                       /* the parapets each side */
    var sx1 = x1 + PAR, sx2 = x2 - PAR;
    var TOP = z + wall * 0.54, N = 24;
    var yFoot = y2 - r.h * 0.10, yHead = y1 + r.h * 0.30;
    var run = (yFoot - yHead) / N, rise = (TOP - z) / N;

    for (var i = 0; i < N; i++) {
      var ya = yFoot - run * i, yb = ya - run, zz = z + rise * i;
      /* the riser, then the tread on top of it. Steps sort on their own
         corners safely: each one is small and none spans the room. */
      out.push({ svg: ctx.poly([P(sx1, yb, zz), P(sx2, yb, zz),
                                P(sx2, yb, zz + rise), P(sx1, yb, zz + rise)],
                               ctx.shade(DARK, 0, -1, 0), STONE_D, 0.35),
                 depth: -8e8 + i * 10 });
      out.push({ svg: ctx.poly([P(sx1, ya, zz + rise), P(sx2, ya, zz + rise),
                                P(sx2, yb, zz + rise), P(sx1, yb, zz + rise)],
                               ctx.shade(TREAD, 0, 0, 1), STONE_D, 0.35),
                 depth: -8e8 + i * 10 + 5 });
    }

    /* the landing at the head of the stair */
    out.push(flat(ctx, sx1, y1, sx2, yHead, TOP, TREAD, STONE_D, 0.5, -8.5e8));

    /* THE PARAPETS: solid, raked, with a brass rail along the top. Drawn as a
       raked quadrilateral on each side rather than a stack of boxes, because
       the top of this wall is a straight line and a staircase whose parapet
       steps is a fire escape. */
    [[-1, x1, sx1], [1, x2, sx2]].forEach(function (side, si) {
      var xo = side[1], xi = side[2];
      var pTop = 3.4;
      var faceZ = function (yy) {
        var t = Math.max(0, Math.min(1, (yFoot - yy) / (yFoot - yHead)));
        return z + (TOP - z) * t + pTop;
      };
      /* the inner face, which is what you see from the well */
      var inner = [P(xi, yFoot, z), P(xi, yHead, TOP),
                   P(xi, yHead, faceZ(yHead)), P(xi, yFoot, faceZ(yFoot))];
      out.push({ svg: ctx.poly(inner, ctx.shade(STONE, -side[0], 0, 0), STONE_D, 0.5),
                 depth: -7.0e8 + si });
      /* the capping, and the brass rail standing on it */
      var cap = [P(xi, yFoot, faceZ(yFoot)), P(xi, yHead, faceZ(yHead)),
                 P(xo, yHead, faceZ(yHead)), P(xo, yFoot, faceZ(yFoot))];
      out.push({ svg: ctx.poly(cap, ctx.shade(STONE, 0, 0, 1), STONE_D, 0.5),
                 depth: -6.8e8 + si });
      var rz = 1.5;
      out.push({ svg: ctx.poly([P(xi + side[0] * -0.6, yFoot, faceZ(yFoot) + rz),
                                P(xi + side[0] * -0.6, yHead, faceZ(yHead) + rz),
                                P(xi + side[0] * -0.6, yHead, faceZ(yHead) + rz + 0.5),
                                P(xi + side[0] * -0.6, yFoot, faceZ(yFoot) + rz + 0.5)],
                               BRASS, "#8a6f18", 0.3), depth: -6.6e8 + si });
      /* the outer wall of the well, full height, holding the columns */
      out = out.concat(mass(ctx, side[0] < 0 ? xo : xi, y1, side[0] < 0 ? xi : xo, y2,
                            z, wall, STONE, STONE_D, -9.2e8 + si));
    });

    /* THE ARCH at the head, and the Tiepolo in it at its published shape:
       220 by 128 5/8 inches, which is 18 ft 4 in by 10 ft 8 5/8 in. */
    var mapH = function (u, zz) { return P(u, yHead, zz); };
    if (ctx.faceVisible(0, 1)) {
      out = out.concat(mass(ctx, sx1, y1, sx2, yHead, z, wall, STONE, STONE_D, -9.0e8));
      var cxm = (sx1 + sx2) / 2, halfA = (sx2 - sx1) * 0.40;
      var springs = wall * 0.30, archTop = springs + halfA * 0.62;
      var pts = [mapH(cxm - halfA, TOP)];
      for (var k = 0; k <= 12; k++) {
        var a = Math.PI - k * Math.PI / 12;
        pts.push(mapH(cxm + halfA * Math.cos(a), TOP + springs + halfA * Math.sin(a) * 0.62));
      }
      pts.push(mapH(cxm + halfA, TOP));
      out.push({ svg: ctx.poly(pts, SKY, STONE_D, 0.5), depth: -8.6e8 });

      /* 220 by 128 5/8 inches is 1.710 tall for every one across. The ratio is
         the published fact and is held exactly; the overall size is set by the
         arch, because the first attempt sized it off the arch's WIDTH and the
         painting came out taller than the opening it hangs in. */
      var hT = archTop * 0.80, wT = hT * (128.625 / 220);
      out = out.concat(canvasOn(ctx, mapH, cxm, TOP + hT * 0.54, wT, hT, -8.4e8));
    }
    return out;
  }

  /* ---------------- Gallery 461, the Damascus Room ----------------
     The plan's `islamic` node used to draw ONE signature object standing in a
     plain box: a screen 22 feet by 16.7, floating. Those numbers were never a
     screen. They are the room itself, and this is the one stop on the Met plan
     where the exhibit IS an interior, so drawing it as an object in a box lost
     the whole point in the way Dendur would if the temple were drawn without
     its pool.

     PUBLISHED, read this run from the Met's own collection API, object 452102,
     which is the source that corrected Dendur once already:
       "Overall measurements are 264 7/16 in. (H) x 200 1/2 in. (W) x
        316 5/8 in. (D); from inside front entrance to back wall is
        316 5/8 in. deep; fountain is 4 15/16 in. high."
       dated 1119 AH/1707 CE, gallery 461,
       Gift of The Hagop Kevorkian Fund, 1970.
     In feet: 22.04 high, 16.71 wide, 26.39 deep, and a fountain five inches
     high. Every one of those is used below at its published value.

     PUBLISHED, the Met's own pages on the room (metmuseum.org, Damascus Room;
     The Damascus Room essay), read this run: it is a winter reception room, a
     qa'a, "divided into two areas: a raised, square seating area (tazar) and a
     small antechamber ('ataba) entered through a doorway from a courtyard";
     the 'ataba carries the fountain; "every surface, walls, ceiling, niches,
     shuttered windows, is covered in carved and painted wood, gilded stucco,
     and tile"; the tazar floor is square marble panels in red and white
     geometric patterns and the step up to it has an opus sectile riser.

     DERIVED, and it is the one measurement that does real work here: the tazar
     is SQUARE and the room is 16.71 wide, so the tazar is 16.71 deep and the
     'ataba is what is left of the 26.39, which is 9.68 feet. The split is not
     a drawing decision, it falls out of two published numbers.

     NAMED GAPS, not guessed: the step riser between 'ataba and tazar is drawn
     at 9 inches and no published figure was found; the fountain basin's
     diameter is not published, only its height; the panel and niche counts on
     each wall are a drawing decision at roughly two-foot panels, because no
     source reached this run counts them.

     THE CUTAWAY: the courtyard doorway is in the near wall, and the near wall
     is not drawn, which is the same rule the Great Hall uses. You are standing
     in the doorway looking in, so the 'ataba and its fountain are in front of
     you and the raised tazar is at the far end. The CEILING is likewise not
     drawn: this view looks down into the room, and a painted ceiling plane at
     22 feet would paint over everything under it. The muqarnas cornice is
     where the walls stop, and the header says so rather than the model
     pretending the room is open to the sky.

     Style: the Ottoman Damascus qa'a, now in the styles book. */
  function damascusRoom(ctx) {
    var r = ctx.room, z = ctx.zBase, P = ctx.project, out = [];
    var wall = ctx.wall || 26;

    var H_FT = 22.037, W_FT = 16.708, D_FT = 26.385, FOUNT_FT = 0.411;
    var k = Math.min((r.w * 0.80) / W_FT, (r.h * 0.80) / D_FT, (wall * 0.95) / H_FT);
    var W = W_FT * k, D = D_FT * k, H = H_FT * k;
    var cx = r.x + r.w / 2, cy = r.y + r.h / 2;
    var x1 = cx - W / 2, x2 = cx + W / 2, y1 = cy - D / 2, y2 = cy + D / 2;
    var yStep = y1 + W;                 /* tazar square at the far end */
    var RISE = 0.75 * k;                /* 9 in, NOT published */

    var WOOD = "#8a5733", WOOD_D = "#63401f", GILT = "#c9a24c", GILT_D = "#9c7a2f",
        CREAM = "#e6d7b8", MARB = "#e9e3d5", MARB_D = "#b3ab95", RED = "#9d423d",
        WATER = "#a9bcc6", CUSH = "#7c4850", SHAD = "#c9c2b2";

    /* feet above the floor, so the registers read as the room's own storeys */
    var F_DADO = 3.6, F_PANEL = 12.8, F_MUQ = 16.2, F_UP = 20.6;

    /* ---- floors. The 'ataba is marble, the tazar is a raised platform ---- */
    out.push(flat(ctx, x1, y1, x2, y2, z + 0.2, "#ded6c4", MARB_D, 0.5, -1e9));
    /* opus sectile: real panels, alternating, not one flat tone */
    var an = 3, ad = (y2 - yStep) / an;
    for (var ai = 0; ai < an; ai++) {
      for (var aj = 0; aj < 3; aj++) {
        var px0 = x1 + (W / 3) * aj + 0.5, px1 = x1 + (W / 3) * (aj + 1) - 0.5;
        var py0 = yStep + ad * ai + 0.5, py1 = yStep + ad * (ai + 1) - 0.5;
        out.push(flat(ctx, px0, py0, px1, py1, z + 0.35,
                      ((ai + aj) % 2) ? "#e9e3d5" : "#cdc4ae", MARB_D, 0.4, -9.9e8 + ai));
      }
    }

    /* the shadow the platform throws onto the 'ataba floor */
    out.push(flat(ctx, x1, yStep, x2, yStep + RISE * 1.6, z + 0.3, SHAD, null, 0, -9.89e8));

    /* ---- the tazar, raised and square, with its red and white marble ---- */
    out = out.concat(mass(ctx, x1, y1, x2, yStep, z, RISE, MARB, MARB_D, -9.5e8));
    for (var ti = 0; ti < 4; ti++) {
      for (var tj = 0; tj < 4; tj++) {
        var qx = x1 + (W / 4) * tj, qy = y1 + (W / 4) * ti;
        out.push(flat(ctx, qx + 0.4, qy + 0.4, qx + W / 4 - 0.4, qy + W / 4 - 0.4,
                      z + RISE + 0.08, ((ti + tj) % 2) ? RED : "#efe9db",
                      MARB_D, 0.4, -9.4e8 + ti * 0.1 + tj * 0.01));
      }
    }

    /* ---- the fountain, five published inches high, in the 'ataba ---- */
    var fr = W * 0.15, fx = cx, fy = (yStep + y2) / 2, fh = FOUNT_FT * k;
    var rim = [], inner = [];
    for (var oi = 0; oi < 8; oi++) {
      var th = (oi / 8) * Math.PI * 2 + Math.PI / 8;
      rim.push([fx + Math.cos(th) * fr, fy + Math.sin(th) * fr]);
      inner.push([fx + Math.cos(th) * fr * 0.72, fy + Math.sin(th) * fr * 0.72]);
    }
    for (var si = 0; si < 8; si++) {
      var sj = (si + 1) % 8;
      var nx = Math.cos(((si + 0.5) / 8) * Math.PI * 2 + Math.PI / 8);
      var ny = Math.sin(((si + 0.5) / 8) * Math.PI * 2 + Math.PI / 8);
      if (!ctx.faceVisible(nx, ny)) continue;
      out.push({ svg: ctx.poly([P(rim[si][0], rim[si][1], z + 0.3),
                                P(rim[sj][0], rim[sj][1], z + 0.3),
                                P(rim[sj][0], rim[sj][1], z + 0.3 + fh),
                                P(rim[si][0], rim[si][1], z + 0.3 + fh)],
                               ctx.shade(MARB, nx, ny, 0), MARB_D, 0.4),
                 depth: -9.3e8 + si });
    }
    out.push({ svg: ctx.poly(rim.map(function (q) { return P(q[0], q[1], z + 0.3 + fh); }),
                             ctx.shade(MARB, 0, 0, 1), MARB_D, 0.4), depth: -9.29e8 });
    out.push({ svg: ctx.poly(inner.map(function (q) { return P(q[0], q[1], z + 0.3 + fh * 0.7); }),
                             WATER, "#8fa4b0", 0.4), depth: -9.28e8 });

    /* ---- the walls, as a cutaway: only a wall whose INSIDE faces you ---- */
    var walls = [
      { n: [1, 0],  u0: y1, u1: y2, tazEnd: y1 + W,
        map: function (u, zz) { return P(x1, u, zz); }, d: -9.80e8 },
      { n: [-1, 0], u0: y1, u1: y2, tazEnd: y1 + W,
        map: function (u, zz) { return P(x2, u, zz); }, d: -9.80e8 },
      { n: [0, 1],  u0: x1, u1: x2, tazEnd: x2,
        map: function (u, zz) { return P(u, y1, zz); }, d: -9.82e8 },
      { n: [0, -1], u0: x1, u1: x2, tazEnd: x2,
        map: function (u, zz) { return P(u, y2, zz); }, d: -9.78e8 }
    ];

    walls.forEach(function (wl) {
      if (!ctx.faceVisible(wl.n[0], wl.n[1])) return;
      var m = wl.map, u0 = wl.u0, u1 = wl.u1, d = wl.d;
      var sh = function (c) { return ctx.shade(c, wl.n[0], wl.n[1], 0.2); };
      function band(f0, f1, fill, stroke, dd) {
        out.push({ svg: ctx.poly([m(u0, z + f0 * k), m(u1, z + f0 * k),
                                  m(u1, z + f1 * k), m(u0, z + f1 * k)],
                                 sh(fill), stroke, 0.4), depth: dd });
      }
      /* the wall itself, then its registers, each one a real horizontal break */
      band(0, H_FT, CREAM, WOOD_D, d);
      band(0, F_DADO, MARB, MARB_D, d + 1);                 /* marble dado */
      band(F_DADO, F_DADO + 0.5, GILT, GILT_D, d + 2);      /* gilt string course */
      band(F_PANEL, F_MUQ, WOOD, WOOD_D, d + 2);            /* muqarnas ground */
      band(F_UP, H_FT, WOOD, WOOD_D, d + 2);                /* the ceiling beam */

      /* 'AJAMI PANELLING: real panels, each with its own gilt frame. The count
         is a drawing decision at about two feet, and the header says so. */
      var span = u1 - u0, ftPerUnit = W_FT / W;
      var np = Math.max(4, Math.round((span * ftPerUnit) / 2.1));
      for (var i = 0; i < np; i++) {
        var pa = u0 + (span / np) * i + span * 0.006;
        var pb = u0 + (span / np) * (i + 1) - span * 0.006;
        out.push({ svg: ctx.poly([m(pa, z + (F_DADO + 0.7) * k), m(pb, z + (F_DADO + 0.7) * k),
                                  m(pb, z + (F_PANEL - 0.3) * k), m(pa, z + (F_PANEL - 0.3) * k)],
                                 sh(GILT), GILT_D, 0.4), depth: d + 3 });
        var ia = pa + span * 0.010, ib = pb - span * 0.010;
        out.push({ svg: ctx.poly([m(ia, z + (F_DADO + 1.0) * k), m(ib, z + (F_DADO + 1.0) * k),
                                  m(ib, z + (F_PANEL - 0.6) * k), m(ia, z + (F_PANEL - 0.6) * k)],
                                 sh(WOOD), WOOD_D, 0.4), depth: d + 4 });
        /* a shuttered window or niche in every other panel, arched, drawn as
           an opening dark enough to survive map scale */
        if (i % 2 === 1) {
          var ca = ia + (ib - ia) * 0.16, cb = ib - (ib - ia) * 0.16;
          var zt = z + (F_PANEL - 1.8) * k, zb = z + (F_DADO + 1.6) * k;
          var arc = [m(ca, zb), m(ca, zt)];
          for (var g = 1; g < 7; g++) {
            var t = g / 7, uu = ca + (cb - ca) * t;
            arc.push(m(uu, zt + Math.sin(t * Math.PI) * (cb - ca) * 0.32));
          }
          arc.push(m(cb, zt), m(cb, zb));
          out.push({ svg: ctx.poly(arc, sh("#3d2a18"), "#241708", 0.4), depth: d + 5 });
        }
      }

      /* MUQARNAS CORNICE, three corbelled steps and a row of pendants. It is
         the thing that makes the top of a qa'a read as a qa'a. */
      for (var s = 0; s < 3; s++) {
        var f0 = F_MUQ + (F_UP - F_MUQ) * (s / 3);
        var f1 = F_MUQ + (F_UP - F_MUQ) * ((s + 1) / 3);
        band(f0, f1, [GILT, CREAM, GILT][s], GILT_D, d + 6 + s);
      }
      var nm = Math.max(6, Math.round((u1 - u0) / (span / 14)) / 1);
      for (var q = 0; q < 14; q++) {
        var qa = u0 + (span / 14) * q, qb = u0 + (span / 14) * (q + 1);
        out.push({ svg: ctx.poly([m(qa, z + F_MUQ * k), m(qb, z + F_MUQ * k),
                                  m((qa + qb) / 2, z + (F_MUQ - 0.9) * k)],
                                 sh(GILT_D), WOOD_D, 0.3), depth: d + 9 });
      }
    });

    /* ---- the seating the tazar exists for: low cushioned benches ---- */
    var bh = 1.4 * k, bw = 2.2 * k;
    out = out.concat(mass(ctx, x1 + 0.4, y1 + 0.4, x2 - 0.4, y1 + bw, z + RISE, bh, CUSH, "#5a323a"));
    out = out.concat(mass(ctx, x1 + 0.4, y1 + bw, x1 + bw, yStep - 0.4, z + RISE, bh, CUSH, "#5a323a"));
    out = out.concat(mass(ctx, x2 - bw, y1 + bw, x2 - 0.4, yStep - 0.4, z + RISE, bh, CUSH, "#5a323a"));
    return out;
  }

  /* ---------------- Gallery 305, the Medieval Sculpture Hall ----------------
     The plan's `medieval` node drew a flat panel 52 by 42 standing in a box.
     Those are the real dimensions of the Valladolid choir screen and drawing
     them as a rectangle threw away the one thing a reja is: a GRID of iron,
     in registers, with a gate in the middle and a crest on top.

     PUBLISHED, checked this run (metmuseum.org object 201926, and the Met's
     own gallery description): "Choir screen from the Cathedral of Valladolid",
     attributed to Rafael Amezua of Elorrio, erected 1763 and painted and
     gilded 1764, iron gilded and painted with a limestone base, 52 FEET HIGH
     and 42 FEET WIDE. It was commissioned by Isidro Cosio y Bustamante, bishop
     of Valladolid, and stood in the nave dividing the choir from the high
     altar. Gallery 305, the Medieval Sculpture Hall, "is dominated by" it and
     the hall itself evokes a church interior.

     SCHEMATIC, and the page says so on the Dendur precedent: the HALL envelope
     is the floor plan's rectangle, not a survey. Only the screen is true, and
     the screen is what fixes feet to plan units here: everything else in the
     drawing is sized off 52 feet.

     NAMED GAPS: no published count of balusters, registers or gate leaves was
     found, so the grid is drawn at a spacing that matches the photographs and
     is a drawing decision; the hall's own height and length are not published
     anywhere reached this run.

     THE CUTAWAY, as everywhere else here: the wall you would be standing in is
     not drawn, and the hall's ceiling is not drawn because this view looks
     down into it. */
  function medievalHall(ctx) {
    var r = ctx.room, z = ctx.zBase, P = ctx.project, out = [];
    var wall = ctx.wall || 26;

    var SCR_H = 52, SCR_W = 42;                 /* published, feet */
    var k = (wall * 0.99) / SCR_H;
    var H = SCR_H * k, SW = SCR_W * k;
    /* THE FIX THE FIRST RENDER FORCED. Sizing the hall off the plan rectangle
       made the screen a fifth of the hall's width: a gate in a wall, not the
       thing the Met says the gallery is dominated by. The plan rectangle is
       the wing, not this room, so the hall is sized off the SCREEN instead.
       It spans 88 percent of the hall's length, which puts the hall near 48
       by 33 feet, and the plan's own proportion is kept. */
    var HALL_L = SCR_W / 0.88;
    var HALL_D = HALL_L * (r.h / r.w);
    var cx = r.x + r.w / 2, cy = r.y + r.h / 2;
    var x1 = cx - HALL_L * k / 2, x2 = cx + HALL_L * k / 2;
    var y1 = cy - HALL_D * k / 2, y2 = cy + HALL_D * k / 2;

    var STONE = "#ded7c6", STONE_D = "#b0a892", FLOOR = "#cfc7b4",
        IRON = "#4a4438", IRON_L = "#6b6252", GOLD = "#c19a3e", GOLD_D = "#94722a",
        LIME = "#d9d1bd", LIME_D = "#aaa189", SHAD = "#bdb5a2";

    out.push(flat(ctx, x1, y1, x2, y2, z + 0.2, FLOOR, STONE_D, 0.5, -1e9));

    /* the hall's own side walls, cut away on the near side like the Great Hall,
       with the tall arcaded openings the flanking galleries stand behind */
    [[y1, 1], [y2, -1]].forEach(function (wl) {
      if (!ctx.faceVisible(0, wl[1])) return;
      var q = [P(x1, wl[0], z), P(x2, wl[0], z), P(x2, wl[0], z + H * 0.86),
               P(x1, wl[0], z + H * 0.86)];
      out.push({ svg: ctx.poly(q, ctx.shade(STONE, 0, wl[1], 0.2), STONE_D, 0.5),
                 depth: -9.80e8 });
      /* a stone string course, so the wall is not one extrusion */
      out.push({ svg: ctx.poly([P(x1, wl[0], z + H * 0.50), P(x2, wl[0], z + H * 0.50),
                                P(x2, wl[0], z + H * 0.54), P(x1, wl[0], z + H * 0.54)],
                               ctx.shade(STONE_D, 0, wl[1], 0.2), STONE_D, 0.4),
                 depth: -9.79e8 });
      /* five round-headed openings, dark enough to survive map scale */
      for (var i = 0; i < 5; i++) {
        var a = x1 + (x2 - x1) * (i + 0.16) / 5, b = x1 + (x2 - x1) * (i + 0.84) / 5;
        var zt = z + H * 0.42, zb = z + 0.4;
        var arc = [P(a, wl[0], zb), P(a, wl[0], zt)];
        for (var g = 1; g < 8; g++) {
          var t = g / 8, uu = a + (b - a) * t;
          arc.push(P(uu, wl[0], zt + Math.sin(t * Math.PI) * (b - a) * 0.5));
        }
        arc.push(P(b, wl[0], zt), P(b, wl[0], zb));
        out.push({ svg: ctx.poly(arc, "#3a352b", "#241f18", 0.5), depth: -9.78e8 });
      }
    });

    /* ---- THE SCREEN, 52 by 42, at the far end of the hall ---- */
    var sx1 = cx - SW / 2, sx2 = cx + SW / 2, sy = y1 + (y2 - y1) * 0.18;
    var BASE = H * 0.10;                      /* the limestone base */
    out.push(flat(ctx, sx1 - 1, sy, sx2 + 1, sy + BASE * 0.9, z + 0.25, SHAD, null, 0, -9.7e8));
    out = out.concat(mass(ctx, sx1, sy, sx2, sy + BASE * 0.55, z, BASE, LIME, LIME_D, -9.6e8));

    var D0 = -9.5e8;
    function panel(a, b, z0, z1, fill, stroke, dd) {
      out.push({ svg: ctx.poly([P(a, sy, z + z0), P(b, sy, z + z0),
                                P(b, sy, z + z1), P(a, sy, z + z1)],
                               fill, stroke, 0.4), depth: dd });
    }
    /* two registers of balusters over the base, a gilt frieze between them and
       another above, then the crest. That is the reja's real anatomy. */
    var zBase = BASE, zR1 = H * 0.52, zF1 = H * 0.58, zR2 = H * 0.84, zF2 = H * 0.89;
    panel(sx1, sx2, zBase, zR1, "#2f2b23", IRON, D0);            /* the dark behind the bars */
    panel(sx1, sx2, zF1, zF1 + H * 0.05, GOLD, GOLD_D, D0 + 3);  /* lower frieze */
    panel(sx1, sx2, zR1, zF1, GOLD_D, GOLD_D, D0 + 2);
    panel(sx1, sx2, zF1 + H * 0.05, zR2, "#2f2b23", IRON, D0 + 1);
    panel(sx1, sx2, zR2, zF2, GOLD, GOLD_D, D0 + 4);             /* upper frieze */

    var nb = 34;                              /* drawing decision, declared */
    for (var i2 = 0; i2 < nb; i2++) {
      var bxc = sx1 + (SW / nb) * (i2 + 0.5), bw = (SW / nb) * 0.34;
      /* skip the middle, that is the gate */
      var mid = Math.abs(i2 - (nb - 1) / 2);
      if (mid < 2.6) continue;
      panel(bxc - bw, bxc + bw, zBase + 0.3, zR1, IRON_L, IRON, D0 + 5);
      panel(bxc - bw * 0.8, bxc + bw * 0.8, zF1 + H * 0.05, zR2, IRON_L, IRON, D0 + 6);
      /* a gilt knop where the bar crosses the frieze */
      panel(bxc - bw * 1.3, bxc + bw * 1.3, zF1, zF1 + H * 0.05, GOLD, GOLD_D, D0 + 7);
    }

    /* the double gate, taller and arched, which is where you actually walk */
    var gw = SW * 0.16;
    panel(cx - gw, cx + gw, zBase, zR2, "#241f19", GOLD_D, D0 + 8);
    for (var gi = 0; gi < 8; gi++) {
      var gx = cx - gw + (2 * gw) * (gi + 0.5) / 8;
      panel(gx - gw * 0.035, gx + gw * 0.035, zBase + 0.3, zR2 - 0.3, GOLD, GOLD_D, D0 + 9);
    }
    panel(cx - gw * 1.08, cx + gw * 1.08, zR2, zR2 + H * 0.04, GOLD, GOLD_D, D0 + 10);

    /* THE CREST. A reja is finished by a gilt crest, and this is the thing you
       see first from the length of the hall. */
    var crest = [P(sx1 + SW * 0.10, sy, z + zF2), P(sx2 - SW * 0.10, sy, z + zF2),
                 P(cx + SW * 0.16, sy, z + H * 0.955), P(cx, sy, z + H),
                 P(cx - SW * 0.16, sy, z + H * 0.955)];
    out.push({ svg: ctx.poly(crest, GOLD, GOLD_D, 0.5), depth: D0 + 11 });
    /* the cross on the summit */
    panel(cx - SW * 0.010, cx + SW * 0.010, H * 0.955, H * 1.035, GOLD, GOLD_D, D0 + 12);
    panel(cx - SW * 0.042, cx + SW * 0.042, H * 0.995, H * 1.012, GOLD, GOLD_D, D0 + 13);

    /* sculpture on plinths down the hall, which is what the gallery is for */
    for (var s2 = 0; s2 < 4; s2++) {
      var px = x1 + (x2 - x1) * (0.30 + 0.16 * s2);
      var py = y2 - (y2 - y1) * 0.26;
      var pw = 2.2 * k, fw = 1.3 * k;      /* a plinth about two feet across */
      out = out.concat(mass(ctx, px - pw, py - pw, px + pw, py + pw, z, 3.2 * k,
                            LIME, LIME_D));
      out = out.concat(mass(ctx, px - fw, py - fw, px + fw, py + fw, z + 3.2 * k,
                            6.0 * k, "#cfc6b0", STONE_D));
    }
    return out;
  }

  /* ------------- Gallery 371, the Equestrian Court (arms and armor) -------------
     The plan's `arms-armor` node drew ONE figure 6.1 feet tall in a box. The
     Equestrian Court is not a figure: it is a hall of ARMED MEN ON ARMED
     HORSES, and a mounted knight is nine feet of steel, not six.

     PUBLISHED, the Met's own collection API, read this run, every object
     checked to be GalleryNumber 371:
       object 22757 / 35772, "Horse Armor Probably Made for Count Antonio IV
         Collalto (1548-1620)", Italian, probably Brescia, ca. 1580-90, shown
         as "Armor for Man and Horse" with a Milanese man's armor ca. 1570:
         "as mounted, H. 75 1/2 in. (191.8 cm); L. 90 in. (228.6 cm);
         W. 30 in. (76.2 cm); Wt. including saddle 93 lb. 1 oz."
       object 23358 / 35739, "Horse Armor Made for Johann Ernst, Duke of
         Saxony-Coburg (1521-1553)", German, Nuremberg, dated 1548, shown as
         "Armor for Man and Horse"; horse armor with saddle approx. 92 lb.,
         man's armor approx. 56 lb.
     Standing armors in the same gallery, with their published heights, which
     is what every plinth here is drawn at:
       22741 Armor Garniture probably of King Henry VIII, dated 1527,
             Greenwich, Overall H. 73 in.
       23936 Field Armor of King Henry VIII, ca. 1544, Milan or Brescia,
             H. 72 1/2 in.; W. 33 in.; D. 14 1/2 in.
       23939 Armor Garniture of George Clifford, Third Earl of Cumberland,
             Greenwich, 1586, H. 69 1/2 in.
       22139 Armor of Sir James Scudamore, Greenwich, ca. 1595-96, H. 70 1/4 in.
       23203 Armor for the Tilt, Augsburg, ca. 1580, H. 68 3/4 in.;
             W. at shoulders 18 in.
       22905 Armor, German possibly Brunswick, ca. 1535, as mounted H. 77 in.
       24696 Armor for Field and Tournament, probably Milan, ca. 1575-80,
             H. 71 1/2 in.

     THE ROUTE, written down because the previous run was blocked on exactly
     this: the API cannot be filtered by gallery, so 450 objects of department
     4 were fetched and filtered on their own GalleryNumber field. That works,
     and it is how any Met room gets its objects from now on.

     COUNT, and it is a NAMED GAP rather than a guess: across those 450
     objects exactly TWO man-and-horse groups carry gallery 371, so two are
     drawn. No source reached this run states how many mounted figures the
     court actually holds, and a third horse would be invented.

     DERIVED and declared: the court's own dimensions are published nowhere
     reached, so the horse fixes the scale the way the reja fixes the Medieval
     Hall. The hall is 6.4 horse-lengths long, 48 feet, and the plan
     rectangle's proportion is kept for its depth. A seated rider is drawn
     with the saddle at 0.73 of the horse's 75.5 in and the man's own
     published standing height folded at 0.72; the crest of a helm therefore
     lands near nine feet, which is the whole point of the room.

     NOT DRAWN, declared, the cutaway rule used in every room here: the near
     wall, and the ceiling, because this view looks down into the court and a
     plane overhead paints over everything under it. The court is skylit and
     the skylight is the thing this view cannot show. */
  function armsArmor(ctx) {
    var r = ctx.room, z = ctx.zBase, P = ctx.project, out = [];
    var wall = ctx.wall || 26;

    var HORSE_L = 90 / 12, HORSE_H = 75.5 / 12, HORSE_W = 30 / 12;  /* published */
    var HALL_L = HORSE_L * 6.4;                       /* derived, 48 ft */
    var k = r.w / HALL_L;                             /* plan units per foot */
    var x1 = r.x, x2 = r.x + r.w, y1 = r.y, y2 = r.y + r.h;
    var cx = (x1 + x2) / 2, cy = (y1 + y2) / 2;
    var H = wall;

    var STONE = "#dcd6c7", STONE_D = "#aca48e", FLOOR = "#c8c1ae",
        STEEL = "#a9adb4", STEEL_D = "#6e737b", DARK = "#4c5057",
        GOLD = "#bd9a44", GOLD_D = "#8d7027", PLINTH = "#b9b2a0",
        PLINTH_D = "#8d876f", SHAD = "#b3ac99", WOOD = "#6a4f33";

    out.push(flat(ctx, x1, y1, x2, y2, z + 0.2, FLOOR, STONE_D, 0.5, -1e9));

    /* --- the court's walls, near side cut away, with a dado, a balcony
       string course and an upper arcade, so no wall is one extrusion --- */
    [[y1, 1], [y2, -1]].forEach(function (wl) {
      if (!ctx.faceVisible(0, wl[1])) return;
      var band = function (za, zb, fill, dd) {
        out.push({ svg: ctx.poly([P(x1, wl[0], z + za), P(x2, wl[0], z + za),
                                  P(x2, wl[0], z + zb), P(x1, wl[0], z + zb)],
                                 ctx.shade(fill, 0, wl[1], 0.2), STONE_D, 0.5),
                   depth: dd });
      };
      band(0, H * 0.92, STONE, -9.80e8);            /* the wall itself */
      band(0, H * 0.13, STONE_D, -9.795e8);         /* the dado */
      band(H * 0.13, H * 0.16, PLINTH, -9.793e8);   /* its cap moulding */
      band(H * 0.50, H * 0.55, STONE_D, -9.790e8);  /* the balcony string course */
      band(H * 0.86, H * 0.92, PLINTH, -9.786e8);   /* the cornice under the skylight */
      /* six round-headed openings at gallery level, dark enough to survive
         map scale, and six balcony openings above the string course */
      for (var i = 0; i < 6; i++) {
        var a = x1 + (x2 - x1) * (i + 0.18) / 6, b = x1 + (x2 - x1) * (i + 0.82) / 6;
        var zb0 = z + H * 0.16, zt0 = z + H * 0.40;
        var arc = [P(a, wl[0], zb0), P(a, wl[0], zt0)];
        for (var g = 1; g < 8; g++) {
          var t = g / 8, uu = a + (b - a) * t;
          arc.push(P(uu, wl[0], zt0 + Math.sin(t * Math.PI) * (b - a) * 0.42));
        }
        arc.push(P(b, wl[0], zt0), P(b, wl[0], zb0));
        out.push({ svg: ctx.poly(arc, "#3b3730", "#241f18", 0.5), depth: -9.784e8 });
        out.push({ svg: ctx.poly([P(a, wl[0], z + H * 0.58), P(b, wl[0], z + H * 0.58),
                                  P(b, wl[0], z + H * 0.80), P(a, wl[0], z + H * 0.80)],
                                 "#443f37", "#241f18", 0.5), depth: -9.782e8 });
      }
    });

    /* ---- a mounted man-and-horse group, built at the published sizes ---- */
    function mounted(px, py, face, steelFill, giltCrest) {
      var g = [], s = face;                 /* s = +1 nose toward +x */
      var L = HORSE_L * k, W = HORSE_W * k, HH = HORSE_H * k;
      /* THE FIX THE FIRST RENDER FORCED. Reading the published 75.5 in as the
         top of the BODY put the saddle inside the horse and the rider on top of
         a slab: four legs and a table. 75.5 in "as mounted" is the crest of the
         shaffron. The back sits at 0.72 of it and the head reaches the whole. */
      var belly = HH * 0.50, bodyT = HH * 0.72;
      g.push(flat(ctx, px - L * 0.55, py - W * 0.85, px + L * 0.55, py + W * 0.85,
                  z + 0.22, SHAD, null, 0, -9.5e8));
      /* four legs, real objects rather than a skirt */
      [[-0.28, -0.40], [-0.28, 0.40], [0.22, -0.40], [0.22, 0.40]].forEach(function (o) {
        var lx = px + o[0] * L, ly = py + o[1] * W;
        g = g.concat(mass(ctx, lx - L * 0.065, ly - W * 0.20, lx + L * 0.065,
                          ly + W * 0.20, z + 0.25, belly, STEEL_D, DARK));
      });
      /* barded body: peytral in front, flanchards on the sides, crupper behind */
      g = g.concat(mass(ctx, px - L * 0.36, py - W / 2, px + L * 0.30, py + W / 2,
                        z + belly, bodyT - belly, steelFill, STEEL_D));
      g = g.concat(mass(ctx, px + s * L * 0.28, py - W * 0.54, px + s * L * 0.38,
                        py + W * 0.54, z + belly * 0.86, (bodyT - belly) * 0.92,
                        steelFill, STEEL_D));               /* the peytral */
      g = g.concat(mass(ctx, px - s * L * 0.44, py - W * 0.52, px - s * L * 0.34,
                        py + W * 0.52, z + belly * 0.95, (bodyT - belly) * 0.8,
                        steelFill, STEEL_D));               /* the crupper */
      /* neck in two rising plates, the crinet, then the shaffron on the head */
      var nx = px + s * L * 0.22;
      [[0.00, 0.62, 0.26, 0.24], [0.07, 0.80, 0.22, 0.20],
       [0.15, 0.96, 0.17, 0.17]].forEach(function (c) {
        var a1 = nx + s * L * c[0], a2 = a1 + s * L * c[2];
        g = g.concat(mass(ctx, Math.min(a1, a2), py - W * c[3], Math.max(a1, a2),
                          py + W * c[3], z + bodyT * c[1], bodyT * 0.55,
                          steelFill, STEEL_D));
      });
      var hx = nx + s * L * 0.24;
      g = g.concat(mass(ctx, Math.min(hx, hx + s * L * 0.20), py - W * 0.15,
                        Math.max(hx, hx + s * L * 0.20), py + W * 0.15,
                        z + HH * 0.72, HH * 0.28, STEEL, STEEL_D));  /* the shaffron, to 75.5 in */
      /* the saddle, published as part of the horse armor's weight */
      var SAD = z + bodyT;                        /* the saddle sits ON the back */
      g = g.concat(mass(ctx, px - L * 0.10, py - W * 0.36, px + L * 0.12,
                        py + W * 0.36, SAD, HH * 0.10, WOOD, "#3d2c1c"));
      /* ---- the rider: legs, cuirass, gorget, helm, crest, lance ---- */
      var MAN = (73 / 12) * k;                     /* Henry VIII garniture, published */
      var seat = MAN * 0.72;                       /* derived, declared */
      var mw = W * 0.62;
      g = g.concat(mass(ctx, px - L * 0.06, py - W * 0.56, px + L * 0.16,
                        py + W * 0.56, SAD + HH * 0.02, MAN * 0.24,
                        STEEL, STEEL_D));          /* thighs over the saddle */
      g = g.concat(mass(ctx, px - mw * 0.5, py - mw * 0.5, px + mw * 0.5,
                        py + mw * 0.5, SAD + MAN * 0.24, seat * 0.46,
                        steelFill, STEEL_D));      /* the cuirass */
      g = g.concat(mass(ctx, px - mw * 0.60, py - mw * 0.58, px + mw * 0.60,
                        py + mw * 0.58, SAD + MAN * 0.24 + seat * 0.46,
                        seat * 0.08, GOLD, GOLD_D));   /* the gorget, gilt */
      var hz = SAD + MAN * 0.24 + seat * 0.54;
      g = g.concat(mass(ctx, px - mw * 0.34, py - mw * 0.36, px + mw * 0.34,
                        py + mw * 0.36, hz, seat * 0.20, STEEL, STEEL_D));  /* helm */
      if (giltCrest) {
        g = g.concat(mass(ctx, px - mw * 0.06, py - mw * 0.30, px + mw * 0.06,
                          py + mw * 0.30, hz + seat * 0.20, seat * 0.12,
                          GOLD, GOLD_D));          /* the crest */
      }
      /* the lance, which is what makes the room read as the Equestrian Court */
      var lx0 = px + s * L * 0.20, lz0 = SAD + MAN * 0.40;
      var lx3 = px + s * L * 0.95, lz3 = lz0 + HH * 0.50;
      var ly0 = py - W * 0.34, t = W * 0.055;
      out.push({ svg: ctx.poly([P(lx0, ly0 - t, lz0), P(lx3, ly0 - t, lz3),
                                P(lx3, ly0 + t, lz3), P(lx0, ly0 + t, lz0)],
                               "#7c6647", "#4a3a26", 0.5), depth: 9.0e8 });
      return g;
    }

    /* two groups, nose to tail down the middle of the court, facing the visitor */
    out = out.concat(mounted(cx - r.w * 0.20, cy + r.h * 0.06, 1, "#9ba0a8", true));
    out = out.concat(mounted(cx + r.w * 0.16, cy - r.h * 0.04, 1, "#b0a99c", false));

    /* ---- standing armors on plinths, each at its own published height ---- */
    var ARMORS = [
      { h: 73,     n: "Henry VIII garniture, 1527" },
      { h: 72.5,   n: "Henry VIII field armor, ca. 1544" },
      { h: 69.5,   n: "Clifford, Earl of Cumberland, 1586" },
      { h: 70.25,  n: "Sir James Scudamore, ca. 1595" },
      { h: 68.75,  n: "Armor for the Tilt, ca. 1580" },
      { h: 71.5,   n: "Field and tournament, ca. 1575-80" }
    ];
    ARMORS.forEach(function (a, i) {
      var side = i < 3 ? -1 : 1, j = i % 3;
      var px = x1 + (x2 - x1) * (0.20 + 0.30 * j);
      var py = cy + side * r.h * 0.36;
      var pw = 1.05 * k, ph = 1.6 * k, fw = 0.62 * k, fh = (a.h / 12) * k;
      out = out.concat(mass(ctx, px - pw, py - pw, px + pw, py + pw, z + 0.24,
                            ph, PLINTH, PLINTH_D));
      out.push(flat(ctx, px - pw * 1.5, py - pw * 1.5, px + pw * 1.5, py + pw * 1.5,
                    z + 0.23, SHAD, null, 0, -9.4e8));
      /* legs, cuirass, gorget, helm: an armor, not a lozenge */
      out = out.concat(mass(ctx, px - fw * 0.62, py - fw * 0.5, px + fw * 0.62,
                            py + fw * 0.5, z + 0.24 + ph, fh * 0.46, STEEL_D, DARK));
      out = out.concat(mass(ctx, px - fw, py - fw * 0.66, px + fw, py + fw * 0.66,
                            z + 0.24 + ph + fh * 0.46, fh * 0.30, STEEL, STEEL_D));
      out = out.concat(mass(ctx, px - fw * 0.72, py - fw * 0.52, px + fw * 0.72,
                            py + fw * 0.52, z + 0.24 + ph + fh * 0.76, fh * 0.06,
                            GOLD, GOLD_D));
      out = out.concat(mass(ctx, px - fw * 0.46, py - fw * 0.42, px + fw * 0.46,
                            py + fw * 0.42, z + 0.24 + ph + fh * 0.82, fh * 0.18,
                            STEEL, STEEL_D));
    });
    return out;
  }


  /* ---------------- Gallery 812, the great Salon room ----------------
     The nineteenth-century stop was an object in a box: one generic canvas
     2.4 by 3.1 feet floating in the plan's rectangle. Gallery 812 is not a
     generic room. It is the Met's Salon wall, and its whole subject is SIZE.

     PUBLISHED, read this run from the Met's own collection API, both objects
     verified to be GalleryNumber 812:
       object 435702, Rosa Bonheur, "The Horse Fair", 1852-55,
         "96 1/4 x 199 1/2 in. (244.5 x 506.7 cm)"  =  8 ft 0 1/4 in high by
         SIXTEEN FEET SEVEN AND A HALF INCHES wide;
       object 438820, Gustave Courbet, "Young Ladies of the Village", 1851-52,
         "76 3/4 x 102 3/4 in. (194.9 x 261 cm)"  =  6 ft 4 3/4 by 8 ft 6 3/4.
     Both are drawn at exactly those numbers. Courbet's "Woman with a Parrot"
     came back on the same sweep at 51 by 77 in. and is NOT in this room: its
     GalleryNumber is 811, the room next door, so it is left out. That is the
     whole value of filtering on the object's own gallery field rather than on
     a search: it tells you what to leave out as well as what to draw.

     DERIVED and declared, on the arms-armor and Medieval Hall precedent: the
     gallery's own dimensions are published nowhere reached, so THE PAINTING
     FIXES THE SCALE and the plan rectangle does not. A canvas 16 ft 7 in wide
     needs a wall it can be seen whole from, and the Met hangs it centred on
     the long wall with a room to back away into. The room is drawn at 2.2
     Horse Fairs long, near 36 1/2 ft, with the plan rectangle's proportion
     kept for the depth, near 27 ft.

     NAMED GAPS, so nothing here reads as measured that is not:
       the 20 ft ceiling is chosen, not published;
       the laylight is a drawing decision, consistent with these galleries
         sitting under the roof of the building, and is not a cited fact;
       the picture rail height and the wall colour are drawing decisions;
       no source reached says which wall either painting hangs on, so the
         Horse Fair takes the long back wall because it is the only wall in
         a room this size that can hold it, and the Courbet takes the side.
     A big Salon canvas is hung with its bottom rail about two feet off the
     floor rather than on the 57 inch centre line the white cube uses, because
     an eight foot painting centred at 57 inches would touch the skirting.
     That is a drawing decision too, and it is why it is written down. */
  function gallery812(ctx) {
    var r = ctx.room, z = ctx.zBase, P = ctx.project, out = [];
    var wall = ctx.wall || 26;
    var F = wall / 20;                      /* 20 ft ceiling fixes the scale */

    var WALL = "#6d5347", WALL_D = "#523d33", RAIL = "#c9b189", RAIL_D = "#a68f6a";
    var FLOOR = "#8a7358", FLOOR_D = "#6d5a44";
    var LIGHT = "#f6f1e2", BENCH = "#4f4438", BENCH_D = "#3a3128";

    var GW = 36.5 * F, GD = 27 * F;
    var cx = r.x + r.w / 2, cy = r.y + r.h / 2;
    var x1 = cx - GW / 2, x2 = cx + GW / 2, y1 = cy - GD / 2, y2 = cy + GD / 2;

    /* the plan slot under it, then the gallery floor standing on that slot.
       Both are flats spanning the scene, so both carry an EXPLICIT depth:
       a plane this wide has a nearer corner than everything it holds. */
    out.push(flat(ctx, r.x, r.y, r.x + r.w, r.y + r.h, z, "#cfc6b4", "#b0a99c", 0.5, -1e9));
    out.push(flat(ctx, x1, y1, x2, y2, z + 0.1, FLOOR, FLOOR_D, 0.5, -9.99e8));

    var T = Math.max(1.2, GW * 0.020);
    /* back wall first, then the two side walls AFTER the pictures, because a
       side wall runs the whole depth of the room and its near end is far
       closer to the eye than the back wall it meets. */
    out = out.concat(mass(ctx, x1, y1, x2, y1 + T, z, wall, WALL, WALL_D, -9.80e8));

    /* THE HORSE FAIR on the back wall, at 199 1/2 by 96 1/4 inches. On a
       36 1/2 ft wall it takes very nearly half the room, which is the fact
       this model exists to carry and which no photograph of it conveys. */
    var HF_W = (199.5 / 12), HF_H = (96.25 / 12);
    if (ctx.faceVisible(0, 1)) {
      var mapB = function (u, zz) { return P(u, y1 + T, zz); };
      out = out.concat(canvasOn(ctx, mapB, cx, z + (2 + HF_H / 2) * F,
                                HF_W * F, HF_H * F, -9.50e8));
    }

    /* the picture rail and the cove above it: the two horizontal lines that
       make a nineteenth century hang read as one, and the only relief on an
       otherwise flat wall. Heights chosen, as declared above. */
    out = out.concat(mass(ctx, x1, y1, x2, y1 + T * 0.55, z + 13 * F, 0.5 * F,
                          RAIL, RAIL_D, -9.74e8));
    out = out.concat(mass(ctx, x1, y1, x2, y1 + T * 0.55, z + wall - 1.6 * F, 1.6 * F,
                          LIGHT, "#ded6c0", -9.72e8));

    /* THE COURBET on whichever side wall is turned towards us, at 102 3/4 by
       76 3/4 inches. If neither side faces the eye it is not drawn, rather
       than drawn somewhere it is not. */
    var sideX = ctx.faceVisible(1, 0) ? x1 + T : (ctx.faceVisible(-1, 0) ? x2 - T : null);
    if (sideX !== null) {
      var mapS = function (u, zz) { return P(sideX, u, zz); };
      var CB_W = (102.75 / 12), CB_H = (76.75 / 12);
      out = out.concat(canvasOn(ctx, mapS, y1 + GD * 0.46, z + (2 + CB_H / 2) * F,
                                CB_W * F, CB_H * F, -9.20e8));
      /* a 7 ft doorway through to gallery 811, where the Parrot actually is */
      var dc = y2 - GD * 0.16;
      out.push({ svg: ctx.poly([mapS(dc - 2.2 * F, z + 0.1), mapS(dc + 2.2 * F, z + 0.1),
                                mapS(dc + 2.2 * F, z + 7 * F), mapS(dc - 2.2 * F, z + 7 * F)],
                               "#3b2d26", WALL_D, 0.4), depth: -9.15e8 });
    }

    out = out.concat(mass(ctx, x1, y1, x1 + T, y2, z, wall, WALL, WALL_D, -9.00e8));
    out = out.concat(mass(ctx, x2 - T, y1, x2, y2, z, wall, WALL, WALL_D, -9.00e8));

    /* THE LAYLIGHT IS NOT DRAWN, and the reason is worth the space because it
       is the painter's-depth trap arriving in a form no depth can fix.
       First pass put a lit panel across the ceiling at the usual "behind
       everything" depth and it painted over the back wall and the Horse Fair,
       which is the Dendur glass wall again, one storey up. Pushing it behind
       the back wall did not fix it either: a ceiling plane seen from above and
       outside PROJECTS DOWN ACROSS THE FLOOR whatever its sort order, so it
       came out as a pale streak lying in the middle of the room. It survived
       a control render with the Courbet switched off, which is how it was
       identified.
       The room is a roofless cutaway. It has no ceiling, so it cannot show a
       thing that is IN the ceiling. The cove band on the wall carries the top
       light instead, and the laylight is a declared gap rather than a smear.
       THE GENERAL RULE for the rooms still to be rebuilt: a horizontal plane
       at ceiling height cannot be drawn in an open-top room at all. Sorting
       is not the lever; not drawing it is. */

    /* A backless gallery bench, 6 ft by 17 in, set back where you would stand
       to take the Horse Fair in whole. Scale needs one thing a body already
       knows the size of, and in this room it is the only such thing. */
    var bcy = y2 - GD * 0.30;
    out = out.concat(mass(ctx, cx - 3 * F, bcy - 0.8 * F, cx + 3 * F, bcy + 0.8 * F,
                          z + 0.1, (17 / 12) * F, BENCH, BENCH_D, -8.0e8));
    return out;
  }


  /* ---------------- Gallery 637, European Paintings ----------------
     The plan's `euro-paintings` node stood for the whole second floor suite
     and was drawn as a single canvas in a box, height 4.7 by width 4.5, with
     no room around it and no work named. This is the FIFTH Met interior turned
     from an object into a room, and it is drawn as ONE gallery, 637, because
     a suite of forty rooms has no single envelope and pretending it does is
     the lie the old entry told.

     PUBLISHED, the Met's own collection API, read this run, both objects
     verified to carry GalleryNumber 637:
       object 679844, Joachim Beuckelaer, "Fish Market", 1568,
         "50 5/8 x 68 7/8 in." = 4 ft 2 5/8 by FIVE FEET EIGHT AND SEVEN
         EIGHTHS;
       object 436622, Frans Hals, "Merrymakers at Shrovetide", ca. 1616-17,
         "51 3/4 x 39 1/4 in."
     Both are drawn at exactly those numbers and at nothing else.

     WHAT THE GALLERY FILTER ALSO DID, which is half its value and is the same
     lesson gallery 812 taught: Vermeer's "Young Woman with a Water Pitcher"
     came back on the very same sweep, at 18 by 16 in., and is LEFT OUT,
     because its GalleryNumber is 614, a different room in the same suite. A
     search tells you what to draw; the gallery field tells you what not to.

     DERIVED and declared: no dimension of gallery 637 itself is published
     anywhere reached this run. The room keeps the floor plan's own proportion,
     195 by 140, and is drawn near 44 by 32 ft, with the Fish Market spanning
     an eighth of the long wall, which is what a 5 ft 9 picture does in a
     gallery of that size.

     NAMED GAPS, every one of them: the ceiling height, the picture rail
     height, the dado height, the wall colour, the bay count, and which wall
     each painting hangs on are drawing decisions, not measurements. The
     hanging centre is 57 in, the museum standard, not a survey of this wall.

     NOT DRAWN, declared, and this is the gallery 812 rule applied before it
     could waste a render: gallery 637 is one of the SKYLIT top-lit rooms, and
     a laylight cannot be drawn in these cutaways at all. A horizontal plane at
     ceiling height projects down across the floor from this eye whatever depth
     it is given. The room is roofless; the lit cove at the top of the wall
     carries the daylight and the laylight is a gap on the page. */
  function gallery637(ctx) {
    var r = ctx.room, z = ctx.zBase, P = ctx.project, out = [];
    var wall = ctx.wall || 26;
    var F = wall / 22;                    /* 22 ft wall height fixes the scale */

    var WALL = "#5c6650", WALL_D = "#454d3c";     /* the green damask hang */
    var DADO = "#4a4136", DADO_D = "#382f27";
    var RAIL = "#c6ad83", RAIL_D = "#a08a66";
    var FLOOR = "#8d7757", FLOOR_D = "#6f5c43";
    var LIGHT = "#f7f2e4", BENCH = "#4e4337", BENCH_D = "#392f27";

    var GW = 44 * F, GD = 32 * F;
    var cx = r.x + r.w / 2, cy = r.y + r.h / 2;
    var x1 = cx - GW / 2, x2 = cx + GW / 2, y1 = cy - GD / 2, y2 = cy + GD / 2;

    /* the plan slot, which doubles as the ground shadow this mass would
       otherwise float over, then the gallery floor standing on it. Both span
       the scene, so both carry an EXPLICIT depth: a plane this wide has a
       nearer corner than everything standing on it. */
    out.push(flat(ctx, r.x, r.y, r.x + r.w, r.y + r.h, z, "#cfc6b4", "#b0a99c", 0.5, -1e9));
    out.push(flat(ctx, x1, y1, x2, y2, z + 0.1, FLOOR, FLOOR_D, 0.5, -9.99e8));

    var T = Math.max(1.2, GW * 0.020);

    /* back wall, then its dado, rail and cove, then the pictures, and the two
       SIDE walls last, because a side wall runs the whole depth and its near
       end sits far closer to the eye than the back wall it meets. */
    out = out.concat(mass(ctx, x1, y1, x2, y1 + T, z, wall, WALL, WALL_D, -9.80e8));

    /* THE FISH MARKET on the back wall at 68 7/8 by 50 5/8 inches, hung on the
       57 inch centre line. */
    if (ctx.faceVisible(0, 1)) {
      var mapB = function (u, zz) { return P(u, y1 + T, zz); };
      var FM_W = (68.875 / 12), FM_H = (50.625 / 12);
      out = out.concat(canvasOn(ctx, mapB, cx - GW * 0.17, z + (57 / 12) * F,
                                FM_W * F, FM_H * F, -9.50e8));
      /* a second, empty frame of the same family further along the wall: the
         gallery hangs more than two pictures and an empty wall would say it
         does not. It is drawn blank and at no published size, and the header
         says so. */
      out = out.concat(canvasOn(ctx, mapB, cx + GW * 0.22, z + (57 / 12) * F,
                                3.2 * F, 4.0 * F, -9.49e8));
    }

    /* the three horizontal breaks that stop a hung wall reading as one
       extrusion: a dado to 3 ft, the picture rail at 14, the lit cove above. */
    /* the dado is 2.4 ft and not 3, and the reason is the render: at 3 ft its
       top ledge cut straight across the bottom of the Fish Market, because a
       50 inch picture on the 57 inch centre line starts at 32 inches. Both
       numbers were choices, and the picture is the one that had to give way. */
    out = out.concat(mass(ctx, x1, y1, x2, y1 + T * 0.62, z + 0.15, 2.4 * F,
                          DADO, DADO_D, -9.76e8));
    out = out.concat(mass(ctx, x1, y1, x2, y1 + T * 0.55, z + 14 * F, 0.5 * F,
                          RAIL, RAIL_D, -9.74e8));
    out = out.concat(mass(ctx, x1, y1, x2, y1 + T * 0.55, z + wall - 1.8 * F, 1.8 * F,
                          LIGHT, "#ded6c0", -9.72e8));

    /* THE HALS on whichever side wall is turned towards the eye, at 39 1/4 by
       51 3/4 inches. If neither faces us it is not drawn, rather than drawn on
       a wall it is not on. */
    var sideX = ctx.faceVisible(1, 0) ? x1 + T : (ctx.faceVisible(-1, 0) ? x2 - T : null);
    if (sideX !== null) {
      var mapS = function (u, zz) { return P(sideX, u, zz); };
      var HL_W = (39.25 / 12), HL_H = (51.75 / 12);
      out = out.concat(canvasOn(ctx, mapS, y1 + GD * 0.40, z + (57 / 12) * F,
                                HL_W * F, HL_H * F, -8.95e8));
      /* the 8 ft enfilade doorway through to the next gallery in the suite,
         which is what a European Paintings room actually is: a link in a
         chain of forty. Dark enough to survive map scale. */
      var dc = y2 - GD * 0.18;
      out.push({ svg: ctx.poly([mapS(dc - 2.4 * F, z + 0.1), mapS(dc + 2.4 * F, z + 0.1),
                                mapS(dc + 2.4 * F, z + 8 * F), mapS(dc - 2.4 * F, z + 8 * F)],
                               "#31281f", WALL_D, 0.4), depth: -8.93e8 });
    }

    out = out.concat(mass(ctx, x1, y1, x1 + T, y2, z, wall, WALL, WALL_D, -9.00e8));
    out = out.concat(mass(ctx, x2 - T, y1, x2, y2, z, wall, WALL, WALL_D, -9.00e8));

    /* a backless bench, 6 ft by 17 in, the one object in the room a body
       already knows the size of, which is what gives the paintings their
       scale. */
    var bcy = y2 - GD * 0.34;
    out = out.concat(mass(ctx, cx - 3 * F, bcy - 0.8 * F, cx + 3 * F, bcy + 0.8 * F,
                          z + 0.1, (17 / 12) * F, BENCH, BENCH_D, -8.0e8));
    return out;
  }


  /* ---------------- Gallery 959, the Robert Lehman Wing ----------------
     The plan's `lehman` node was a canvas in a box, h 5.1 by w 4.1, naming no
     work. This is the SIXTH Met interior turned into a room, and the object
     that fixes its scale is not a painting at all.

     PUBLISHED, the Met's own collection API, read this run, both objects
     verified to carry GalleryNumber 959:
       object 459205, Bernard van Orley, "The Last Supper", ca. 1525-28,
         "131 7/8 x 137 13/16 in." = ELEVEN FEET BY ELEVEN FEET FIVE AND
         THREE QUARTERS;
       object 459227, "Emperor Vespasian Cured by Veronica's Veil", ca. 1510,
         "135 1/2" x 135"" = eleven feet three and a half by eleven feet three.
     Two Netherlandish tapestries, each over eleven feet square. That is the
     fact this room exists to carry: no photograph of the Lehman Wing conveys
     that a single hanging in it is twice the height of a standing person and
     as wide again.

     DERIVED and load bearing, on the Medieval Hall rule that when a room is
     famous for one object the object fixes the scale and the plan rectangle
     does not: the back wall carries an 11.5 ft hanging with clear wall to
     either side, so it is 2.6 hangings, near 30 ft, and the plan's own
     180:105 proportion gives 17.5 ft of depth.

     NAMED GAPS: the gallery's own height, length and depth are published
     nowhere reached this run; the 16 ft wall is what an eleven foot three
     hanging plus a base and a cornice requires, not a measurement. The hanging
     height off the floor, the cornice, the panelled dado and the doorway are
     drawing decisions.

     NOT DRAWN, declared: the ceiling, on the standing rule for these
     cutaways. A horizontal plane at ceiling height projects down across the
     floor from this eye whatever depth it is given.

     The tapestries are drawn as rectangles of the published SIZE and nothing
     else, which is what canvasOn is for. */
  function gallery959(ctx) {
    var r = ctx.room, z = ctx.zBase, P = ctx.project, out = [];
    var wall = ctx.wall || 26;
    var F = wall / 16;                    /* 16 ft wall height fixes the scale */

    var WALL = "#6a5f52", WALL_D = "#514840";
    var PANEL = "#4b3f33", PANEL_D = "#382f26";
    var CORN = "#c3ab86", CORN_D = "#9d8865";
    var FLOOR = "#8b7454", FLOOR_D = "#6c5941";
    var BENCH = "#4c4135", BENCH_D = "#372e26";

    var GW = 30 * F, GD = 17.5 * F;
    var cx = r.x + r.w / 2, cy = r.y + r.h / 2;
    var x1 = cx - GW / 2, x2 = cx + GW / 2, y1 = cy - GD / 2, y2 = cy + GD / 2;

    out.push(flat(ctx, r.x, r.y, r.x + r.w, r.y + r.h, z, "#cfc6b4", "#b0a99c", 0.5, -1e9));
    out.push(flat(ctx, x1, y1, x2, y2, z + 0.1, FLOOR, FLOOR_D, 0.5, -9.99e8));

    var T = Math.max(1.2, GW * 0.022);
    out = out.concat(mass(ctx, x1, y1, x2, y1 + T, z, wall, WALL, WALL_D, -9.80e8));

    /* THE LAST SUPPER on the back wall at 137 13/16 by 131 7/8 inches, hung
       with its lower edge 1 ft 6 in off the floor, which is how a tapestry of
       this size has to hang in a 16 ft room and is a decision, not a source. */
    var LS_W = (137.8125 / 12), LS_H = (131.875 / 12);
    if (ctx.faceVisible(0, 1)) {
      var mapB = function (u, zz) { return P(u, y1 + T, zz); };
      out = out.concat(canvasOn(ctx, mapB, cx, z + (1.5 + LS_H / 2) * F,
                                LS_W * F, LS_H * F, -9.50e8));
    }

    /* a panelled dado to 2.5 ft and a cornice under the wall head: the two
       horizontal breaks that stop the hang reading as one extrusion. The
       dado stops below the tapestry, which starts at 1 ft 6. */
    out = out.concat(mass(ctx, x1, y1, x2, y1 + T * 0.60, z + 0.15, 1.4 * F,
                          PANEL, PANEL_D, -9.76e8));
    out = out.concat(mass(ctx, x1, y1, x2, y1 + T * 0.50, z + wall - 1.1 * F, 1.1 * F,
                          CORN, CORN_D, -9.72e8));

    /* THE VESPASIAN on whichever side wall is turned to the eye, at 135 by
       135 1/2 inches. It paints AFTER the side walls, because a side wall's
       own inner face is drawn from this eye and would cover it. */
    var sideX = ctx.faceVisible(1, 0) ? x1 + T : (ctx.faceVisible(-1, 0) ? x2 - T : null);

    out = out.concat(mass(ctx, x1, y1, x1 + T, y2, z, wall, WALL, WALL_D, -9.00e8));
    out = out.concat(mass(ctx, x2 - T, y1, x2, y2, z, wall, WALL, WALL_D, -9.00e8));

    if (sideX !== null) {
      var mapS = function (u, zz) { return P(sideX, u, zz); };
      var VE_W = (135 / 12), VE_H = (135.5 / 12);
      out = out.concat(canvasOn(ctx, mapS, y1 + GD * 0.47, z + (1.5 + VE_H / 2) * F,
                                VE_W * F, VE_H * F, -8.95e8));
      out.push({ svg: ctx.poly([mapS(y2 - GD * 0.13 - 2.2 * F, z + 0.1),
                                mapS(y2 - GD * 0.13 + 2.2 * F, z + 0.1),
                                mapS(y2 - GD * 0.13 + 2.2 * F, z + 7.5 * F),
                                mapS(y2 - GD * 0.13 - 2.2 * F, z + 7.5 * F)],
                               "#2f2820", WALL_D, 0.4), depth: -8.93e8 });
    }

    /* the one object a body already knows the size of, which is what makes an
       eleven foot hanging read as eleven feet: a 6 ft bench, 17 in high. */
    var bcy = y2 - GD * 0.32;
    out = out.concat(mass(ctx, cx - 3 * F, bcy - 0.8 * F, cx + 3 * F, bcy + 0.8 * F,
                          z + 0.1, (17 / 12) * F, BENCH, BENCH_D, -8.0e8));
    return out;
  }

  /* ---------------- Gallery 100, the Mastaba Tomb of Perneb ----------------
     The plan's `egyptian` node was a battered box in the LANDMARKS fallback
     table, standing in for a tomb a person can walk into. It is a room now.

     PUBLISHED, the Met's collection API, read this run, both objects verified
     on their own GalleryNumber field = 100:
       object 543937, "Mastaba Tomb of Perneb", Dynasty 5, ca. 2381-2323 BCE,
         limestone and paint, from Saqqara, "H. 482.2 cm (15 ft. 9 13/16 in.)";
       object 543903, "Striding Figure", ca. 2575-2465 BCE, "H. 89.5 cm
         (35 1/4 in.)".
     The tomb is drawn at exactly 15.82 ft and the figure at exactly 2.94 ft.

     PUBLISHED in prose, and it is what makes this a building rather than a
     block: the mastaba "is divided into four rooms, including a decorated main
     offering chapel and a secondary offering chamber with a separate
     entrance", the serdab is joined to that chamber "by a slot through which
     the smell of incense and chants could pass", the burial shaft is "located
     to the right side of the main offering chamber", and "visitors can enter
     the tomb and walk through its rooms" (Wikipedia, Tomb of Perneb, read this
     run, citing the Met). Hence TWO doorways on the front, both open, both big
     enough for a person, and no cornice.

     NAMED GAPS, declared rather than guessed. The tomb's WIDTH and DEPTH are
     published nowhere reached: the API gives a height and nothing else, the
     museum's own object page answers a script with a bot check, and the 1916
     handbook was not found. So the footprint is derived from the published
     FORM instead, which is the one thing about a mastaba that is not in doubt:
     it is a bench, much wider than it is tall and longer than it is wide. 32
     by 21 ft against a true 15.82 ft height is the shallowest block that
     satisfies both of those and no source gives it. The fallback table's old
     20 by 12 was drawn first and the render threw it out: at 20 ft the block
     is 1.27 times its own height and stands up as a PYLON, which is the case
     the styles book calls wrong. Also gaps: the gallery's own
     dimensions, the 22 ft ceiling that fixes feet to plan units, the batter at
     0.09, the two doorway sizes and where they sit on the front, the plinth,
     and the bench.

     NOT DRAWN, declared. The two small obelisks that stood at the western
     corners of the courtyard at Saqqara: the same source says they "are no
     longer part of the museum exhibit", and this is the gallery, not Saqqara.
     No cavetto cornice and no torus roll either, because neither was verified
     this run, and absence is honest where invention is not. */
  function gallery100(ctx) {
    var r = ctx.room, z = ctx.zBase, P = ctx.project, out = [];
    var wall = ctx.wall || 26;
    var F = wall / 22;                    /* 22 ft ceiling fixes the scale */

    var GWALL = "#cdc4b2", GWALL_D = "#aca493";
    var GFLOOR = "#b9b1a2", GFLOOR_D = "#9a9384";
    var LIME = "#cbb490", LIME_D = "#a7906c";
    var DARK = "#241d15", PLINTH = "#6f6656", PLINTH_D = "#57503f";
    var STAT = "#8d8271", STAT_D = "#6d6454";
    var BENCH = "#54493c", BENCH_D = "#3d352b";

    /* the gallery keeps the plan node's 150:130 proportion at 52 ft across */
    var GW = 52 * F, GD = 52 * (r.h / r.w) * F;
    var cx = r.x + r.w / 2, cy = r.y + r.h / 2;
    var x1 = cx - GW / 2, x2 = cx + GW / 2, y1 = cy - GD / 2, y2 = cy + GD / 2;

    out.push(flat(ctx, r.x, r.y, r.x + r.w, r.y + r.h, z, "#e0d8c6", "#bdb5a5", 0.5, -1e9));
    out.push(flat(ctx, x1, y1, x2, y2, z + 0.1, GFLOOR, GFLOOR_D, 0.5, -9.99e8));

    var T = Math.max(1.2, GW * 0.022);
    out = out.concat(mass(ctx, x1, y1, x2, y1 + T, z, wall, GWALL, GWALL_D, -9.80e8));
    out = out.concat(mass(ctx, x1, y1, x1 + T, y2, z, wall, GWALL, GWALL_D, -9.00e8));
    out = out.concat(mass(ctx, x2 - T, y1, x2, y2, z, wall, GWALL, GWALL_D, -9.00e8));

    /* THE TOMB. 15.82 ft true, flat topped, battered on all four sides, set
       back in the room with its front turned to the eye so the doorways read.
       LEAN_MASTABA is a drawing decision; see the styles book. */
    var LEAN_M = 0.09;
    var TH = 15.8177 * F;                 /* 482.2 cm, to the published inch */
    var TW = 32 * F, TD = 21 * F;         /* named gap, form only: a bench */
    var tx1 = cx - TW / 2, tx2 = cx + TW / 2;
    var ty2 = cy + GD * 0.06, ty1 = ty2 - TD;

    /* contact shadow, checklist item 6. Nothing here casts light, so a
       fifteen foot block set straight on a floor slab floats without one. */
    out.push(flat(ctx, tx1 - 0.6, ty1 - 0.6, tx2 + 1.1, ty2 + 1.1, z + 0.12,
                  "#9d9689", null, 0, -9.90e8));

    out = out.concat(batteredMass(ctx, tx1, ty1, tx2, ty2, z + 0.15, TH,
                                  LEAN_M, LIME, -8.60e8));

    /* the course lines. Cut limestone laid in courses is what stops a battered
       mass reading as one poured lump, and the block is stone, not concrete.
       Each course inset by the batter it has climbed, so they follow the lean. */
    if (ctx.faceVisible(0, 1)) {
      var courses = 9;
      for (var c = 1; c < courses; c++) {
        var t = TH * c / courses, ins = LEAN_M * t;
        out.push({ svg: ctx.poly([P(tx1 + ins, ty2 - ins, z + 0.15 + t),
                                  P(tx2 - ins, ty2 - ins, z + 0.15 + t),
                                  P(tx2 - ins, ty2 - ins, z + 0.15 + t + 0.06 * F),
                                  P(tx1 + ins, ty2 - ins, z + 0.15 + t + 0.06 * F)],
                                 LIME_D, null, 0), depth: -8.55e8 + c * 0.01 });
      }

      /* THE TWO DOORWAYS. Published that there are two and that a person walks
         through them; their size and spacing are drawing decisions. Each is a
         recessed jamb with a dark opening inside it, drawn on the sloping face
         so the reveal leans with the wall. */
      var door = function (ucen, dw, dh, dep) {
        var q = function (hw, h) {
          var i0 = LEAN_M * 0, i1 = LEAN_M * h;
          return [P(ucen - hw, ty2 - i0, z + 0.15),
                  P(ucen + hw, ty2 - i0, z + 0.15),
                  P(ucen + hw, ty2 - i1, z + 0.15 + h),
                  P(ucen - hw, ty2 - i1, z + 0.15 + h)];
        };
        out.push({ svg: ctx.poly(q(dw / 2 + 0.55 * F, dh + 0.55 * F), LIME_D,
                                 "#8d7855", 0.4), depth: dep });
        out.push({ svg: ctx.poly(q(dw / 2, dh), DARK, "#171209", 0.4), depth: dep + 0.02 });
      };
      /* main offering chapel, then the secondary chamber's separate entrance */
      door(cx - TW * 0.14, 4.2 * F, 8.2 * F, -8.50e8);
      door(cx + TW * 0.25, 3.2 * F, 7.2 * F, -8.50e8);
    }

    /* THE STRIDING FIGURE, object 543903, at its published 35 1/4 in, on a
       plinth whose height is a drawing decision. It is here because a 35 inch
       statue standing beside the front is what tells the eye the wall behind it
       is nearly sixteen feet, which no photograph of this gallery manages. */
    var sx = cx - TW * 0.30, sy = y2 - GD * 0.20;
    var PL = 3.0 * F, PW = 1.5 * F;
    out = out.concat(mass(ctx, sx - PW / 2, sy - PW / 2, sx + PW / 2, sy + PW / 2,
                          z + 0.1, PL, PLINTH, PLINTH_D, -8.00e8));
    var SH = 2.9365 * F, SW = 0.62 * F, SD = 0.72 * F;
    out = out.concat(mass(ctx, sx - SW / 2, sy - SD / 2, sx + SW / 2, sy + SD / 2,
                          z + 0.1 + PL, SH * 0.62, STAT, STAT_D, -7.90e8));
    out = out.concat(mass(ctx, sx - SW * 0.34, sy - SD * 0.30, sx + SW * 0.34,
                          sy + SD * 0.30, z + 0.1 + PL + SH * 0.62, SH * 0.38,
                          STAT, STAT_D, -7.88e8));

    /* a 6 ft bench, 17 in high: the one object a body already knows the size
       of. A drawing decision, as it was in gallery 959. */
    var bcy = y2 - GD * 0.14;
    out = out.concat(mass(ctx, cx + TW * 0.10, bcy - 0.8 * F, cx + TW * 0.10 + 6 * F,
                          bcy + 0.8 * F, z + 0.1, (17 / 12) * F, BENCH, BENCH_D, -7.50e8));
    return out;
  }

  window.MET_ROOMS = { dendur: dendur, 'great-hall': greatHall,
                      'american-court': americanCourt,
                      'asian-astor': astorCourt,
                      islamic: damascusRoom,
                      medieval: medievalHall,
                      'arms-armor': armsArmor,
                      'nineteenth-century': gallery812,
                      'euro-paintings': gallery637,
                      lehman: gallery959,
                      egyptian: gallery100,
                      modern: modern, 'grand-stair-2': grandStair,
                      'grand-stair': grandStair };
  Object.keys(LANDMARKS).forEach(function (k) { window.MET_ROOMS[k] = landmark; });
})();
