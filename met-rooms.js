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

  window.MET_ROOMS = { dendur: dendur, 'great-hall': greatHall,
                      'american-court': americanCourt,
                      'asian-astor': astorCourt,
                      islamic: damascusRoom,
                      medieval: medievalHall,
                      'arms-armor': armsArmor,
                      modern: modern, 'grand-stair-2': grandStair };
  Object.keys(LANDMARKS).forEach(function (k) { window.MET_ROOMS[k] = landmark; });
})();
