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

   The temple's proportions are its REAL published ones, 43 by 21 by 16 feet,
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

  /* ---------------- Gallery 131, the Temple of Dendur ---------------- */
  function dendur(ctx) {
    var r = ctx.room, z = ctx.zBase, out = [];
    var P = ctx.project;

    /* Laid out along the room's long axis. The temple faces EAST, which it
       still does inside the museum: the orientation was kept when it was
       rebuilt here. So, west to east: the raked cliff wall, the temple on its
       platform, the gate standing in front of it, then the pool. */
    var x0 = r.x + 8, x1e = r.x + r.w - 8;
    var yc = r.y + r.h / 2;

    /* The Met's own record for its own object: temple proper 41 ft long,
       21 wide, 21 high. An earlier pass used 43 by 21 by 16 from a secondary
       source, whose 16 was the height to the roof rather than overall. When
       the museum publishes dimensions for the thing it owns, that is the
       source. */
    var tLen = 41 * FT, tWid = 21 * FT, tHt = 21 * FT;
    var poolW = 30 * FT;

    var tX1 = x0 + 20, tX2 = tX1 + tLen;
    var tY1 = yc - tWid / 2, tY2 = yc + tWid / 2;

    /* the gallery floor, so the interior sits on something */
    out.push(flat(ctx, r.x, r.y, r.x + r.w, r.y + r.h, z + 0.4, "#efe9dc", "#cdc4b0", 0.5, -1e9));

    /* THE POOL. Thirty feet across, published. It is not decoration: it
       stands for the Nile, which ran in front of the temple where it was. */
    var pX1 = x1e - poolW - 6, pX2 = x1e - 6;
    out.push(flat(ctx, pX1, r.y + 12, pX2, r.y + r.h - 12, z + 0.7, WATER, "#8fa3ad", 0.7, -9.9e8));

    /* THE RAKED WALL behind, which stands for the cliffs of the west bank.
       Drawn as a leaning plane, taller at the back, because that is the
       gesture: the room slopes up behind the temple the way the ground did. */
    var cW = 9, cH = tHt * 1.05;
    var cq = [P(x0 - 6, r.y + 6, z), P(x0 - 6, r.y + r.h - 6, z),
              P(x0 - 6 + cW, r.y + r.h - 6, z + cH), P(x0 - 6 + cW, r.y + 6, z + cH)];
    /* The normal faces INTO the room, which is the side anyone can see. Lit
       from behind it came out a near-black wedge, the one thing in the room
       the eye went to, and it is meant to be the quietest surface here. */
    out.push({ svg: ctx.poly(cq, ctx.shade(CLIFF, 0.9, 0, 0.4), "#c4bba7", 0.5),
               depth: -9.8e8 });

    /* THE PLATFORM the temple stands on, with its short flight of steps. */
    var plat = 2.2 * FT;
    out.push(flat(ctx, tX1 - 5, tY1 - 5, tX2 + 5, tY2 + 5, z + plat, SAND_L, SAND_D, 0.6, -9.7e8));
    for (var s = 0; s < 3; s++) {
      var sh = plat * (1 - s / 3);
      out.push(flat(ctx, tX2 + 5 + s * 3, tY1 + 6, tX2 + 8 + s * 3, tY2 - 6, z + sh, SAND_L, SAND_D, 0.5));
    }

    /* THE TEMPLE. Battered walls, then the cavetto that throws back out. */
    out = out.concat(batteredMass(ctx, tX1, tY1, tX2, tY2, z + plat, tHt, LEAN, SAND));
    out = out.concat(cornice(ctx, tX1 + LEAN * tHt, tY1 + LEAN * tHt,
                             tX2 - LEAN * tHt, tY2 - LEAN * tHt,
                             z + plat + tHt, 3.2, 3.0, SAND_L));

    /* The pronaos: two columns joined by screen walls, on the east face.
       Screen walls are the Egyptian answer to a colonnade, waist-high panels
       between the shafts, and they are why the front reads as solid-with-gaps
       rather than as a row of posts. */
    var colR = 1.7 * FT, colH = tHt * 0.82;
    [-1, 1].forEach(function (sd) {
      var cx = tX2 + 2, cy = yc + sd * tWid * 0.26;
      var seg = [];
      for (var a = 0; a < 8; a++) {
        var th = (a / 8) * Math.PI * 2;
        seg.push([cx + Math.cos(th) * colR, cy + Math.sin(th) * colR]);
      }
      var lo = seg.map(function (q) { return P(q[0], q[1], z + plat); });
      var hi = seg.map(function (q) { return P(q[0], q[1], z + plat + colH); });
      for (var a2 = 0; a2 < 8; a2++) {
        var b2 = (a2 + 1) % 8;
        var quad = [lo[a2], lo[b2], hi[b2], hi[a2]];
        var nx = Math.cos((a2 / 8) * Math.PI * 2), ny = Math.sin((a2 / 8) * Math.PI * 2);
        if (!ctx.faceVisible(nx, ny)) continue;
        out.push({ svg: ctx.poly(quad, ctx.shade(SAND_L, nx, ny, 0), SAND_D, 0.4),
                   depth: depthOf(quad) });
      }
      /* the plant capital, a flared block, which is what an Egyptian column
         carries instead of a scroll or an acanthus */
      out = out.concat(cornice(ctx, cx - colR, cy - colR, cx + colR, cy + colR,
                               z + plat + colH, 2.4, 1.6, SAND_L));
    });
    /* the screen wall between and beside the columns */
    out = out.concat(batteredMass(ctx, tX2 + 0.6, tY1 + 2, tX2 + 3.4, tY2 - 2,
                                  z + plat, colH * 0.42, 0.05, SAND_L));

    /* THE GATE, a pylon standing free in front of the temple. Two battered
       masses flanking the opening, leaning harder than the temple, with the
       same cavetto over the top. Its size is set by eye against the temple;
       the temple's numbers are published, the gate's are not, and the caption
       says which is which. */
    var gX1 = tX2 + 16, gX2 = gX1 + 7 * FT, gH = tHt * 1.12;
    var gapH = tWid * 0.30;
    [[yc - tWid * 0.62, yc - gapH / 2], [yc + gapH / 2, yc + tWid * 0.62]].forEach(function (yy) {
      out = out.concat(batteredMass(ctx, gX1, yy[0], gX2, yy[1], z + 0.8, gH, LEAN_PYLON, SAND));
      out = out.concat(cornice(ctx, gX1 + LEAN_PYLON * gH, yy[0] + LEAN_PYLON * gH,
                               gX2 - LEAN_PYLON * gH, yy[1] - LEAN_PYLON * gH,
                               z + 0.8 + gH, 2.8, 2.6, SAND_L));
    });

    /* THE GLASS. The north wall is stippled glass, chosen to diffuse daylight
       the way the Nubian sky did.

       It was drawn LAST, on the reasoning that glass is translucent so it
       could sit in front of anything. That was wrong twice over. A full-height
       wall the width of the room, painted after everything else, simply covers
       the room: at 34 percent it turned the whole gallery into a pale sheet
       with the temple somewhere behind it. And it is the same sorting mistake
       the floor had, in the other direction, because a plane this large cannot
       be ordered by its nearest corner either.

       In the actual Sackler Wing this glass is the far wall you look TOWARD,
       not a pane you look through. So it is a backdrop: behind everything but
       the floor, and faint enough to read as light rather than as a surface. */
    var gq = [P(r.x, r.y, z), P(r.x + r.w, r.y, z),
              P(r.x + r.w, r.y, z + tHt * 1.9), P(r.x, r.y, z + tHt * 1.9)];
    out.push({ svg: ctx.poly(gq, GLASS, "#c3ced4", 0.6, ' opacity="0.55"'),
               depth: -9.95e8 });

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
    "egyptian":           { kind: "mass",   h: 15.8, w: 20, d: 12, lean: 0.09,
                            fill: "#c7b294", note: "Mastaba Tomb of Perneb, height published" },
    "greek-roman":        { kind: "figure", h: 6.4,  w: 1.7, d: 2.1, fill: "#ded8cc" },
    "arms-armor":         { kind: "figure", h: 6.1,  w: 1.9, d: 1.6, fill: "#a9adb4" },
    "medieval":           { kind: "screen", h: 52,   w: 42,  fill: "#8d7f63" },
    "islamic":            { kind: "screen", h: 22,   w: 16.7, arch: true, fill: "#7d8f9c" },
    "lehman":             { kind: "canvas", h: 5.1,  w: 4.1,  fill: "#6f5a44" },
    "grand-stair":        { kind: "canvas", h: 18.3, w: 10.7, fill: "#7a6a56" },
    "euro-paintings":     { kind: "canvas", h: 4.7,  w: 4.5,  fill: "#6b5b47" },
    "nineteenth-century": { kind: "canvas", h: 2.4,  w: 3.1,  fill: "#7d8a5e" }
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
  function greatHall(ctx) {
    var r = ctx.room, z = ctx.zBase, P = ctx.project, out = [];
    var S = window.STYLES3D;
    var LEN = 166, WID = 48;
    var wall = ctx.wall || 26;
    var k = Math.min((r.w * 0.92) / LEN, (r.h * 0.80) / WID);
    var L = LEN * k, W = WID * k;
    var H = wall * 0.92;                       /* two storeys, capped by the plan */
    var cx = r.x + r.w / 2, cy = r.y + r.h / 2;
    var x1 = cx - L / 2, y1 = cy - W / 2, y2 = cy + W / 2;

    var LIME = "#ddd5c2", LIME_D = "#b7ad96", LIME_L = "#eae3d3";

    out.push(flat(ctx, x1, y1, x1 + L, y2, z + 0.4, "#efe9dc", LIME_D, 0.5, -1e9));

    /* The long walls, drawn as a CUTAWAY: only the wall whose inside faces
       the camera. Drawing both put a full-height slab between the viewer and
       the room, which is what a near wall does in a real building and exactly
       what you do not want in a model of one. The test is the wall's INNER
       normal: if you can see the inside, draw it; if you would be looking at
       its back, you are standing outside it and it is in your way. */
    [[y1, 1], [y2, -1]].forEach(function (wl) {
      if (!ctx.faceVisible(0, wl[1])) return;
      var q = [P(x1, wl[0], z), P(x1 + L, wl[0], z),
               P(x1 + L, wl[0], z + H), P(x1, wl[0], z + H)];
      out.push({ svg: ctx.poly(q, ctx.shade(LIME, 0, wl[1], 0.25), LIME_D, 0.5),
                 depth: -9.6e8 });
    });

    /* THREE BAYS. Each gets a round arch and a dome, and the piers between
       them carry paired columns, which is Hunt's motif inside and out. */
    var bay = L / 3;
    for (var i = 0; i < 3; i++) {
      var bx = x1 + bay * (i + 0.5);
      var aw = bay * 0.62, ah = H * 0.66;
      /* rise equals half the width, so the styles book returns a SEMICIRCLE */
      var pts = (S && S.archedOpening)
        ? S.archedOpening(aw, ah, (ah - aw / 2) / ah, 18)
        : [[-aw / 2, 0], [-aw / 2, ah], [aw / 2, ah], [aw / 2, 0]];
      var face = pts.map(function (pt) { return P(bx + pt[0], y1 + 0.3, z + pt[1]); });
      out.push({ svg: ctx.poly(face, "#efe9dc", LIME_D, 0.6), depth: -9.55e8 });

      /* the saucer dome over the bay, drawn as stacked rings so it reads as a
         shallow curve rather than a half ball; the Met's are saucers. */
      var dr = bay * 0.40, dh = H * 0.20;
      for (var t = 0; t < 6; t++) {
        var f0 = t / 6, f1 = (t + 1) / 6;
        var r0 = dr * Math.cos(f0 * Math.PI / 2), r1 = dr * Math.cos(f1 * Math.PI / 2);
        var z0 = z + H - dh + dh * Math.sin(f0 * Math.PI / 2);
        var z1 = z + H - dh + dh * Math.sin(f1 * Math.PI / 2);
        var ring = [P(bx - r0, cy - r0, z0), P(bx + r0, cy - r0, z0),
                    P(bx + r1, cy - r1, z1), P(bx - r1, cy - r1, z1)];
        out.push({ svg: ctx.poly(ring, ctx.shade(LIME_L, 0, -1, 0.5 + f0 * 0.4), LIME_D, 0.4),
                   depth: -9.3e8 + t });
      }

      /* paired columns on the piers between the bays */
      if (i < 2) {
        var px = x1 + bay * (i + 1);
        [-1, 1].forEach(function (o) {
          var colX = px + o * bay * 0.055, cr = bay * 0.028;
          out = out.concat(batteredMass(ctx, colX - cr, y1 + 1, colX + cr, y1 + 1 + cr * 2,
                                        z, H * 0.62, 0.01, LIME_L));
        });
      }
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
  function americanCourt(ctx) {
    var r = ctx.room, z = ctx.zBase, P = ctx.project, out = [];
    var wall = ctx.wall || 26;
    var MARBLE = "#e8e4d8", MARBLE_D = "#b3ad9c", SHADOW = "#d9d4c6";

    var W = r.w * 0.74, H = wall * 0.74;
    var cx = r.x + r.w / 2, y0 = r.y + r.h * 0.30;
    var x1 = cx - W / 2, x2 = cx + W / 2;
    var D = Math.max(2.2, W * 0.030);

    out.push(flat(ctx, r.x, r.y, r.x + r.w, r.y + r.h, z + 0.4, "#efe9dc", "#cdc4b0", 0.5, -1e9));

    /* The wall behind everything, at an explicit depth. Sorted on its own
       corners it painted over the columns standing in front of it, which is
       the third time a large flat surface has done that here. */
    out = out.concat(batteredMass(ctx, x1, y0, x2, y0 + D, z, H, 0, SHADOW, -9.8e8));

    var pw = W * 0.40;
    out = out.concat(batteredMass(ctx, cx - pw/2, y0 - D*1.2, cx + pw/2, y0, z, H, 0, MARBLE, -9.7e8));

    /* SEVEN BAYS, columns paired across the projecting centre. They stand
       clear of the wall now and are drawn after it. */
    var bay = W / 7;
    for (var i = 0; i <= 7; i++) {
      var bx = x1 + bay * i;
      var pair = (i >= 2 && i <= 5);
      var cw = Math.max(1.1, bay * 0.13);
      var yy = pair ? y0 - D*1.2 : y0;
      out = out.concat(batteredMass(ctx, bx - cw, yy - cw*2.2, bx + cw, yy - 0.3,
                                    z, H * 0.72, 0.012, "#f4f1e8", -9.5e8 + i));
      out = out.concat(batteredMass(ctx, bx - cw*1.6, yy - cw*2.6, bx + cw*1.6, yy - 0.1,
                                    z + H*0.72, H*0.05, -0.10, "#faf8f1", -9.4e8 + i));
    }

    /* the pediment over the centre */
    var pz = z + H, ph = H * 0.26;
    var yy2 = y0 - D*1.2;
    out.push({ svg: ctx.poly([P(cx - pw/2 - 3, yy2, pz), P(cx + pw/2 + 3, yy2, pz),
                              P(cx, yy2, pz + ph)],
                             ctx.shade(MARBLE, 0, -1, 0.3), MARBLE_D, 0.7), depth: -9.3e8 });
    /* the entablature it sits on, so the pediment has something to rest upon */
    out = out.concat(batteredMass(ctx, cx - pw/2 - 3, yy2 - 1, cx + pw/2 + 3, y0, z + H*0.77,
                                  H*0.10, 0, "#f7f4ec", -9.35e8));
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
  function astorCourt(ctx) {
    var r = ctx.room, z = ctx.zBase, P = ctx.project, out = [];
    var wall = ctx.wall || 26;
    var FT = 1.1;
    var CW = 59, CD = 40;
    var k = Math.min((r.w * 0.86) / CW, (r.h * 0.78) / CD, FT);
    var W = CW * k, D = CD * k;
    var cx = r.x + r.w / 2, cy = r.y + r.h / 2;
    var x1 = cx - W/2, x2 = cx + W/2, y1 = cy - D/2, y2 = cy + D/2;
    var PLASTER = "#eceae2", TILE = "#6f6255", TIMBER = "#8a5f43", STONE = "#cfc9bb";

    out.push(flat(ctx, x1, y1, x2, y2, z + 0.4, "#e6e0d2", "#c3bba7", 0.5, -1e9));

    var H = wall * 0.62;
    /* The white plastered wall carrying the moon gate, at an EXPLICIT depth.
       Left to sort on its own corners it painted straight over the gate, and
       the gate is the entire reason this room is worth drawing. That is the
       fourth time in this file a large flat surface has buried what stands in
       front of it; large planes get an explicit depth, always. */
    out = out.concat(batteredMass(ctx, x1, y1, x2, y1 + 2.2, z, H, 0, PLASTER, -9.8e8));

    /* THE MOON GATE, a true circle. Drawn as an n-gon opening on the wall
       face; a circle is the one shape here that must not be approximated
       with a rectangle, because the circle IS the subject. */
    var rr = H * 0.34, mcx = cx, mcz = z + H * 0.46;
    var ring = [];
    for (var a = 0; a < 28; a++) {
      var th = (a / 28) * Math.PI * 2;
      ring.push(P(mcx + Math.cos(th) * rr, y1 - 0.3, mcz + Math.sin(th) * rr));
    }
    out.push({ svg: ctx.poly(ring, "#c6d0cc", "#8e9a94", 0.8), depth: -9.5e8 });
    /* the moulded surround, so the circle reads as cut THROUGH a wall */
    var ring2 = [];
    for (var a2 = 0; a2 < 28; a2++) {
      var th2 = (a2 / 28) * Math.PI * 2;
      ring2.push(P(mcx + Math.cos(th2) * rr * 1.13, y1 - 0.15, mcz + Math.sin(th2) * rr * 1.13));
    }
    out.push({ svg: ctx.poly(ring2, "#dcd9cf", "#a9a294", 0.7), depth: -9.6e8 });

    /* the roofed walkway down one side: posts and a tiled sweep */
    var n = 5;
    for (var i = 0; i <= n; i++) {
      var px = x1 + (W * 0.62) * (i / n) + W * 0.19;
      out = out.concat(batteredMass(ctx, px - 1.1, y2 - 4, px + 1.1, y2 - 1.8, z, H * 0.66, 0.01, TIMBER));
    }
    out = out.concat(batteredMass(ctx, x1 + W*0.17, y2 - 5.2, x1 + W*0.83, y2 - 0.6,
                                  z + H * 0.66, H * 0.10, 0.06, TILE));

    /* the rockery, which is the other half of a scholar's garden */
    [[0.16, 0.46, 0.36], [0.26, 0.58, 0.24], [0.10, 0.62, 0.17]].forEach(function (rk, ri) {
      var rx = x1 + W * rk[0], ry = y1 + D * rk[1], rs = H * rk[2];
      out = out.concat(batteredMass(ctx, rx - rs*0.55, ry - rs*0.45, rx + rs*0.55, ry + rs*0.45,
                                    z, rs, 0.22, STONE, -9.2e8 + ri));
    });
    return out;
  }

  window.MET_ROOMS = { dendur: dendur, 'great-hall': greatHall,
                      'american-court': americanCourt,
                      'asian-astor': astorCourt };
  Object.keys(LANDMARKS).forEach(function (k) { window.MET_ROOMS[k] = landmark; });
})();
