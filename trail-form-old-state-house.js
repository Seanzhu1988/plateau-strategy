/* ---------------- Stop 7: the Old State House ----------------
   Built 1712 to 1713 on the site of the wooden Town House that burned in
   1711, gutted by fire again in 1747 and rebuilt inside its own walls. The
   oldest surviving public building in Boston. The Declaration was read to
   the town from the east balcony on 18 July 1776, and the crowd went from
   hearing it to pulling the lion and the unicorn off the gable and burning
   them. Rebuilt to MODEL_STANDARD.md, 2026-09-05, by the landmark routine.

   PUBLISHED, from SAH Archipedia's survey, carried over from the scene this
   file replaces because it is the only source reached that measures the
   building: the plan is 36 ft 4 in by 112 ft 7 in, which is why the model
   uses 36.33 by 112.58 and not the round "118 by 36" the popular accounts
   give.

   PUBLISHED, from the Wikipedia article on the Old State House, read this
   run:

     "At 65 feet (20 meters), it was also the tallest building in Boston
      until 1745"
     it "rises 2+1/2 stories above a partially raised basement"
     the original gambrel roof was "replaced by a gable roof" after the 1747
      fire, and the original octagonal tower by "a tiered square tower"
     "Lion and unicorn motifs, representing the British, were installed
      between 1743 and 1751"; the crowd "tore down and burned the lion and
      unicorn atop the building"; replicas came with Clough's 1882 work and a
      "new unicorn and lion's head (the latter with a time capsule)" in 1901
     after 1747 "new laws were announced from a small balcony" below the
      eastern parapet
     Clough "added the Massachusetts coat of arms and a gilded eagle to the
      western elevation", installed "atop the roof by 1884"
     "A clock was added sometime between 1817 and 1825"; the east elevation's
      "sundial was replaced with a clock" in 1830
     "a brick facade"

   PUBLISHED, from M&A Architectural Preservation, read this run: the 2014
   exterior carpentry restored "the balustrade and crown molding at the east
   facade balcony", and the cupola was restored in 2009. So the balcony has a
   BALUSTRADE, which the scene this file replaces drew as a plain white slot.

   HOW THE PUBLISHED 65 FT IS SPENT, and this is the one place the model
   commits. 65 ft is the height of the building, and the cupola is part of
   the building, so the vane finishes at 65 and everything below is fitted
   under it: a raised basement to 4.5, two full storeys to 26, an attic half
   storey to a 33 ft eave, a ridge at 42, the square tower's stages to 56,
   and the lantern, dome and vane to 65. That reading satisfies BOTH
   published storey counts at once, which is why it is taken: SAH's three
   levels of window are all there on the elevation, and so is Wikipedia's two
   and a half above a raised basement. The disagreement is recorded rather
   than resolved.

   ORIENTATION. At the page's own opening yaw of -0.62 the visible faces are
   +y and -x, and every other face is culled. The EAST end is the one that
   carries the balcony, the clock, the scrolled gable and the two beasts, so
   it is put at +y. The gilded eagle belongs on the west elevation and is
   drawn there, correctly culled, which means the page's default view does
   not show it; that is where it is, and moving it to be seen would be a
   different building.

   Named gaps, none of them published in any source reached: no floor to
   floor heights, no roof pitch, no bay count (nine on the long walls is
   derived, and 112.58 over nine is a 12.5 ft Georgian bay, which is the
   check), no tower plan or stage heights, no cupola dimensions, no dimension
   for the lion or the unicorn, no step count at the doors. */
(function () {
  var H = (window.TRAIL3D && window.TRAIL3D.helpers) || {};
  var box = H.box, panel = H.panel, ground = H.ground, depthOf = H.depthOf;
  var archOpening = H.archOpening, roundWindow = H.roundWindow;
  var balustrade = H.balustrade, octStage = H.octStage, octSpire = H.octSpire;
  var domeCap = H.domeCap, gableRoofCut = H.gableRoofCut;

  function oldStateHouse(ctx) {
    /* CHECKLIST 5: two tones per material, and a third for the courses. */
    var BRICK = "#9c4e3c", BRICK_D = "#8b442f", BRICK_E = "#66301f";
    var TRIM = "#f1ece0", TRIM_D = "#ddd6c6", TRIM_E = "#a89e8c";
    var ROOF = "#6a655d", ROOF_D = "#59554e", ROOF_E = "#413d37";
    var GLASS = "#3a4750", GLASS_E = "#26313a", DOOR = "#463629";
    var GOLD = "#c9a22c", GOLD_E = "#8a6f18", WHITE = "#efe9dc";
    var STONE = "#b8b3a6", STONE_E = "#8b8578";
    var PAVE = "#ded8cb", KERB = "#bfb9aa", SHADOW = "#a9a294";
    var out = [], P = ctx.project;

    /* THE PUBLISHED PLAN. East end, the balcony end, at +y. */
    var W = 36.33, LEN = 112.58;
    var x0 = -W / 2, x1 = W / 2, yW = -LEN / 2, yE = LEN / 2;

    /* THE ELEVATION, fitted under the published 65 ft. */
    var BASE = 4.5;                  /* the partially raised basement */
    var Z1 = 15.5, Z2 = 26;          /* the two full storeys */
    var EAVE = 33, RIDGE = 42;       /* the attic half storey, and the gable */
    var T0 = 30, T1 = 47, T2 = 56;   /* the tiered square tower */
    var LAN = 61, DOME = 63.2, VANE = 65;

    /* the pad, kept tight: State Street around the building and no more */
    out.push(ground(ctx, 0, 0, 150, 176, 0, PAVE, KERB));

    /* CHECKLIST 6: a ground shadow, thrown away from LIGHT = [0.6,0.3,0.68] */
    (function () {
      var q = [P(x0 - 13, yW - 6, 0.1), P(x1 - 5, yW - 6, 0.1),
               P(x1 - 5, yE - 6, 0.1), P(x0 - 13, yE - 6, 0.1)];
      out.push({ svg: ctx.poly(q, SHADOW, null, 0), depth: -9e8 });
    })();

    /* CHECKLIST 3: a base. A granite plinth and a water table, so the brick
       does not grow straight out of the pavement. */
    out = out.concat(box(ctx, x0 - 1.2, x1 + 1.2, yW - 1.2, yE + 1.2, 0.2, 1.6,
                         STONE, STONE_E, null, -8.7e8).parts);
    out = out.concat(box(ctx, x0 - 0.5, x1 + 0.5, yW - 0.5, yE + 0.5, 1.6, BASE,
                         BRICK_D, BRICK_E, null, -8.6e8).parts);

    var body = box(ctx, x0, x1, yW, yE, BASE, EAVE, BRICK, BRICK_E, null);
    out = out.concat(body.parts);

    /* the tower's footprint, declared here because the roof is CUT around it
       rather than drawn through it: the tower stands at the west end and a
       single unbroken slope sorts after it and paints over its base. That
       trap is why gableRoofCut exists. */
    var tcy = yW + 12, TW = 17;
    out = out.concat(gableRoofCut(ctx, x0, x1, yW, yE, EAVE, RIDGE, ROOF, ROOF_E, BRICK,
                                  tcy - TW / 2, tcy + TW / 2, TW / 2));

    function mapY(Y) { return function (u, z) { return P(u, Y, z); }; }
    function mapX(X) { return function (u, z) { return P(X, u, z); }; }

    /* CHECKLIST 1 and 8: a sash window drawn as an OPENING, with a reveal
       dark enough to survive 900 pixels, a light frame, a sill and a flat
       brick arch over it. A dark rectangle one tone off the brick is what
       makes a correct elevation vanish at map scale. */
    function sash(map, uc, z0, z1, hw, d) {
      out.push(panel(ctx, map, uc - hw - 0.55, uc + hw + 0.55, z0 - 0.35, z1 + 0.75,
                     TRIM, TRIM_E, d + 0.30));
      out.push(panel(ctx, map, uc - hw, uc + hw, z0, z1, GLASS, GLASS_E, d + 0.40));
      out.push(panel(ctx, map, uc - hw, uc + hw, (z0 + z1) / 2 - 0.14, (z0 + z1) / 2 + 0.14,
                     TRIM, null, d + 0.50));
      out.push(panel(ctx, map, uc - 0.13, uc + 0.13, z0, z1, TRIM, null, d + 0.50));
      out.push(panel(ctx, map, uc - hw - 0.8, uc + hw + 0.8, z1 + 0.75, z1 + 1.5,
                     BRICK_D, BRICK_E, d + 0.35));
      out.push(panel(ctx, map, uc - hw - 0.8, uc + hw + 0.8, z0 - 0.95, z0 - 0.35,
                     STONE, STONE_E, d + 0.35));
    }

    /* CHECKLIST 2: the horizontal breaks. A string course at each floor line
       and a cornice at the eave, each its own thin slab, on every wall that
       faces the reader. Without them a 112 ft brick wall is a box. */
    function courses(map, u0, u1, d) {
      [[Z1 - 1.5, Z1 - 0.6, BRICK_D], [Z2 - 1.5, Z2 - 0.6, BRICK_D]].forEach(function (c) {
        out.push(panel(ctx, map, u0, u1, c[0], c[1], c[2], BRICK_E, d + 0.15));
      });
      out.push(panel(ctx, map, u0 - 0.4, u1 + 0.4, EAVE - 1.5, EAVE + 0.4, TRIM, TRIM_E, d + 0.6));
    }

    /* ---- the two long walls, nine derived bays, three ranks of window ---- */
    [[-1, x0], [1, x1]].forEach(function (side) {
      var d = body.walls[side[0] + ",0"];
      if (d === undefined) return;
      var map = mapX(side[1]);
      courses(map, yW, yE, d);
      for (var b = 0; b < 9; b++) {
        var yc = yW + LEN * (b + 0.5) / 9;
        out.push(panel(ctx, map, yc - 1.8, yc + 1.8, 2.0, BASE - 0.5, GLASS, GLASS_E, d + 0.4));
        sash(map, yc, BASE + 2.2, Z1 - 2.4, 2.2, d);
        sash(map, yc, Z1 + 2.0, Z2 - 2.4, 2.2, d);
        sash(map, yc, Z2 + 1.8, EAVE - 3.4, 1.9, d);
      }
    });

    /* ---- the two ends. Three bays each; the east one carries the town's
       whole face on State Street. ---- */
    [[1, yE], [-1, yW]].forEach(function (end) {
      var d = body.walls["0," + end[0]];
      if (d === undefined) return;
      var Y = end[1], map = mapY(Y), east = end[0] > 0;
      courses(map, x0, x1, d);
      for (var b = 0; b < 3; b++) {
        var xc = x0 + W * (b + 0.5) / 3;
        sash(map, xc, BASE + 2.2, Z1 - 2.4, 2.2, d);
        if (!(east && b === 1)) sash(map, xc, Z1 + 2.0, Z2 - 2.4, 2.2, d);
        sash(map, xc, Z2 + 1.8, EAVE - 3.4, 1.9, d);
      }
      /* the doorway, up three steps */
      out.push(panel(ctx, map, -3.4, 3.4, BASE - 3.4, BASE + 5.6, DOOR, TRIM_E, d + 0.5));
      out.push(panel(ctx, map, -4.1, 4.1, BASE + 5.6, BASE + 6.4, TRIM, TRIM_E, d + 0.55));
      for (var s = 0; s < 3; s++) {
        out = out.concat(box(ctx, -5.2 + s * 0.5, 5.2 - s * 0.5,
                             east ? Y : Y - 3.6 + s * 1.2, east ? Y + 3.6 - s * 1.2 : Y,
                             0.2 + s * 0.5, 0.7 + s * 0.5, STONE, STONE_E, STONE,
                             -8.5e8 + s).parts);
      }

      if (east) {
        /* THE BALCONY. Its floor is a real slab standing on two brackets,
           and it carries the published balustrade. The scene this replaces
           drew it as one white rectangle painted on the brick, which is the
           checklist's own example of a count in a header over a blank wall. */
        out = out.concat(box(ctx, -7.2, 7.2, Y, Y + 3.4, Z1 + 1.2, Z1 + 2.0,
                             TRIM, TRIM_E, TRIM_D, d + 1.0).parts);
        [-5.6, 5.6].forEach(function (bx, i) {
          out = out.concat(box(ctx, bx - 0.6, bx + 0.6, Y, Y + 2.2, Z1 - 1.4, Z1 + 1.2,
                               TRIM_D, TRIM_E, null, d + 0.9 + i * 0.02).parts);
        });
        var bmap = mapY(Y + 3.4);
        out = out.concat(balustrade(ctx, bmap, -7.2, 7.2, Z1 + 2.0, Z1 + 5.2,
                                    TRIM, TRIM_E, d + 1.2));
        /* the doorway the laws were read from, behind the balcony */
        out.push(panel(ctx, map, -2.6, 2.6, Z1 + 2.0, Z1 + 8.4, DOOR, TRIM_E, d + 0.6));
        out.push(archOpening(ctx, map, 0, 2.6, Z1 + 8.4, Z1 + 8.4, TRIM, TRIM_E, d + 0.62));
      }
    });

    /* ================= THE EAST GABLE =================
       The scrolled parapet, the clock, and the two beasts. This is the face
       of the building and everything on it paints after the roof, at a depth
       past every roof strip, because nothing in the scene stands in front of
       a gable end. */
    if (ctx.faceVisible(0, 1)) {
      var GD = 1.6e6, gmap = mapY(yE);
      /* the scroll: a Baroque gable, drawn as its own outline over the plain
         triangle the roof helper leaves, so its shoulders read against the
         sky where they swell past the roof line */
      var scroll = [[x0 - 1.2, EAVE], [x0 - 1.2, EAVE + 2.6], [x0 + 2.6, EAVE + 3.4],
                    [x0 + 3.6, EAVE + 6.2], [x0 + 7.0, RIDGE - 3.2],
                    [0, RIDGE + 1.6],
                    [x1 - 7.0, RIDGE - 3.2], [x1 - 3.6, EAVE + 6.2],
                    [x1 - 2.6, EAVE + 3.4], [x1 + 1.2, EAVE + 2.6], [x1 + 1.2, EAVE]];
      out.push({ svg: ctx.poly(scroll.map(function (p) { return gmap(p[0], p[1]); }),
                               ctx.shade(BRICK, 0, 1, 0.15), BRICK_E, 0.6), depth: GD });
      /* the coping that runs over it, one tone of trim, so the scroll has an
         edge instead of ending in brick */
      out.push({ svg: ctx.poly(scroll.slice(1, 10).map(function (p) { return gmap(p[0], p[1] + 0.9); })
                               .concat(scroll.slice(1, 10).reverse().map(function (p) { return gmap(p[0], p[1]); })),
                               ctx.shade(TRIM, 0, 1, 0.2), TRIM_E, 0.5), depth: GD + 0.1 });

      /* THE CLOCK, published on this elevation from 1830, where the sundial
         had been. Gold ring, pale face, two hands. */
      out.push(roundWindow(ctx, gmap, 0, EAVE + 5.6, 3.5, GOLD, GOLD_E, GD + 0.3));
      out.push(roundWindow(ctx, gmap, 0, EAVE + 5.6, 2.9, WHITE, TRIM_E, GD + 0.4));
      out.push(panel(ctx, gmap, -0.16, 0.16, EAVE + 5.6, EAVE + 8.0, "#2b2b28", null, GD + 0.5));
      out.push(panel(ctx, gmap, -0.16, 1.9, EAVE + 5.45, EAVE + 5.75, "#2b2b28", null, GD + 0.5));

      /* THE LION AND THE UNICORN, the one thing every visitor names. They
         STAND ON the scroll, one each side of its crown, as bodies with
         heads and legs, not as the two flat coloured rectangles the scene
         this replaces pasted on the brick. Lion gilded, unicorn white with a
         gilt horn, which is how the 1901 pair is painted. */
      (function (BD) {
        /* WHAT LOOKING CAUGHT, and it is the checklist's own example. Drawn
           as seven stacked rectangles the pair came back as a gold scrap and
           a white ladder: a white body in white panels against a near white
           sky is a wireframe, not an animal. Each beast is now ONE
           silhouette, which is what reads at 900 pixels, with a stroke heavy
           enough to hold the unicorn off the sky. */
        var BODY = [[2.4, 0], [2.4, 2.4], [2.9, 3.6], [3.3, 4.6], [4.2, 5.6],
                    [3.2, 6.2], [2.0, 5.2], [1.0, 4.4], [-1.4, 4.3], [-2.2, 5.8],
                    [-1.4, 6.0], [-0.9, 4.4], [-2.5, 3.8], [-2.5, 0], [-1.3, 0],
                    [-1.3, 2.3], [1.2, 2.3], [1.2, 0]];
        function beast(cx, colour, edge, horn) {
          var s = cx < 0 ? 1 : -1;        /* they face each other across the crown */
          var zb = RIDGE - 2.4;
          out.push(panel(ctx, gmap, cx - 3.0, cx + 3.0, zb - 1.6, zb, TRIM, TRIM_E, BD));
          out.push({ svg: ctx.poly(BODY.map(function (q) { return gmap(cx + q[0] * s, zb + q[1]); }),
                                   ctx.shade(colour, 0, 1, 0.15), edge, 0.9), depth: BD + 0.2 });
          if (horn) {
            out.push({ svg: ctx.poly([gmap(cx + 3.6 * s, zb + 5.4), gmap(cx + 4.0 * s, zb + 5.9),
                                      gmap(cx + 6.2 * s, zb + 8.0)],
                                     ctx.shade(GOLD, 0, 1, 0.3), GOLD_E, 0.6), depth: BD + 0.3 });
          } else {
            /* the lion's mane, one tone darker so the head is not a blob */
            out.push({ svg: ctx.poly([gmap(cx + 1.4 * s, zb + 4.4), gmap(cx + 3.3 * s, zb + 4.6),
                                      gmap(cx + 3.4 * s, zb + 6.1), gmap(cx + 1.8 * s, zb + 5.6)],
                                     ctx.shade(GOLD_E, 0, 1, 0.1), GOLD_E, 0.5), depth: BD + 0.3 });
          }
        }
        beast(-10.6, GOLD, GOLD_E, false);     /* the lion */
        beast(10.6, "#e4ddcb", "#8b8171", true);   /* the unicorn */
      })(2.4e6);
    }

    /* ================= THE WEST GABLE =================
       Clough's Massachusetts coat of arms and the gilded eagle above it,
       published as being on this elevation. Culled at the page's default
       yaw, which is where they belong. */
    if (ctx.faceVisible(0, -1)) {
      var WD = 1.6e6, wmap = mapY(yW);
      out.push(roundWindow(ctx, wmap, 0, EAVE + 5.0, 3.0, GOLD, GOLD_E, WD + 0.3));
      out.push(panel(ctx, wmap, -2.4, 2.4, EAVE + 2.2, EAVE + 4.4, TRIM, TRIM_E, WD + 0.3));
      out.push(panel(ctx, wmap, -0.7, 0.7, RIDGE + 0.8, RIDGE + 4.0, GOLD, GOLD_E, WD + 0.5));
      out.push(panel(ctx, wmap, -3.4, 3.4, RIDGE + 3.4, RIDGE + 4.6, GOLD, GOLD_E, WD + 0.5));
    }

    /* ================= THE TIERED SQUARE TOWER =================
       Published only as "a tiered square tower" replacing the octagonal one
       after 1747, so the STAGES are drawn and their dimensions are named as
       a gap. Two brick and trim stages, a balustrade, an octagonal lantern
       with round headed openings, a small dome and the vane, finishing at
       the published 65 ft. */
    (function () {
      var TD = 3e6, hw = TW / 2, hw2 = 6.6;
      out = out.concat(box(ctx, -hw, hw, tcy - hw, tcy + hw, T0, T1, BRICK, BRICK_E, null, TD).parts);
      out = out.concat(box(ctx, -hw - 0.8, hw + 0.8, tcy - hw - 0.8, tcy + hw + 0.8,
                           T1 - 1.4, T1 + 0.6, TRIM, TRIM_E, TRIM_D, TD + 1).parts);
      var upper = box(ctx, -hw2, hw2, tcy - hw2, tcy + hw2, T1 + 0.6, T2, TRIM, TRIM_E, null, TD + 2);
      out = out.concat(upper.parts);
      /* the belfry: a round headed louvre on each face that faces us, and
         the clock stage below it on the brick */
      [[0, 1, tcy + hw2], [-1, 0, -hw2], [0, -1, tcy - hw2], [1, 0, hw2]].forEach(function (f, i) {
        if (!ctx.faceVisible(f[0], f[1])) return;
        var m = f[0] === 0 ? mapY(f[2]) : mapX(f[2]);
        var c = f[0] === 0 ? 0 : tcy;
        out.push(archOpening(ctx, m, c, 2.4, T1 + 3.2, T1 + 6.6, "#2e373d", TRIM_E, TD + 3 + i));
        var mb = f[0] === 0 ? mapY(f[1] > 0 ? tcy + hw : tcy - hw) : mapX(f[0] > 0 ? hw : -hw);
        out.push(roundWindow(ctx, mb, c, T1 - 6.5, 3.2, WHITE, TRIM_E, TD + 0.6 + i * 0.01));
        out.push(panel(ctx, mb, c - 0.15, c + 0.15, T1 - 6.5, T1 - 4.4, "#2b2b28", null, TD + 0.7 + i * 0.01));
      });
      out = out.concat(box(ctx, -hw2 - 0.9, hw2 + 0.9, tcy - hw2 - 0.9, tcy + hw2 + 0.9,
                           T2, T2 + 1.4, TRIM_D, TRIM_E, TRIM, TD + 8).parts);
      [[0, 1, tcy + hw2 + 0.9], [-1, 0, -hw2 - 0.9]].forEach(function (f, i) {
        if (!ctx.faceVisible(f[0], f[1])) return;
        var m = f[0] === 0 ? mapY(f[2]) : mapX(f[2]);
        var c = f[0] === 0 ? 0 : tcy;
        out = out.concat(balustrade(ctx, m, c - hw2 - 0.9, c + hw2 + 0.9, T2 + 1.4, T2 + 3.8,
                                    TRIM, TRIM_E, TD + 9 + i));
      });
      out = out.concat(octStage(ctx, 0, tcy, 5.4, 5.0, T2 + 1.4, LAN, TRIM, TRIM_E, TD + 12));
      [[0, -1], [1, 0], [-1, 0], [0, 1]].forEach(function (n, i) {
        if (!ctx.faceVisible(n[0], n[1])) return;
        var m = n[0] === 0 ? mapY(tcy + n[1] * 5.0) : mapX(n[0] * 5.0);
        var c = n[0] === 0 ? 0 : tcy;
        out.push(archOpening(ctx, m, c, 1.7, T2 + 3.4, LAN - 2.2, "#2e373d", TRIM_E, TD + 14 + i));
      });
      out = out.concat(octStage(ctx, 0, tcy, 5.8, 5.8, LAN, LAN + 1.1, TRIM_D, TRIM_E, TD + 18));
      out = out.concat(domeCap(ctx, 0, tcy, 4.4, LAN + 1.1, DOME - LAN - 1.1, TRIM, TRIM_E, TD + 20));
      out = out.concat(octSpire(ctx, 0, tcy, 0.9, DOME, VANE, GOLD, GOLD_E));
      out.push({ svg: ctx.poly([P(-3.4, tcy, VANE - 1.1), P(1.2, tcy, VANE - 1.5),
                                P(1.2, tcy, VANE - 0.2), P(-3.4, tcy, VANE + 0.2)],
                               ctx.shade(GOLD, 0, -1, 0.4), GOLD_E, 0.5), depth: 4e6 });
    })();

    return out;
  }

  window.TRAIL_FORMS = window.TRAIL_FORMS || {};
  window.TRAIL_FORMS["old-state-house"] = oldStateHouse;
})();
