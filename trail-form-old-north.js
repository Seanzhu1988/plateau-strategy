/* trail-form-old-north.js — Christ Church in the City of Boston, the Old
 * North Church of 1723, rebuilt to MODEL_STANDARD.md. Registers
 * window.TRAIL_FORMS["old-north"].
 *
 * WHY A REBUILD. MODEL_STANDARD.md names this building by name: "Old North
 * Church is better, recognisable even, and still flat: one brick tone, no
 * cornice, no window frames, no shadow." That is checklist items 2, 5, 6 and
 * 8, and every one of them is cheap once the massing is right. The massing
 * WAS right, so this keeps it: the plan, the two window tiers, the tower,
 * the belfry, the three lanterns, the spire and the vane are the geometry
 * that was already there and already correct.
 *
 * PUBLISHED, quoted from https://en.wikipedia.org/wiki/Old_North_Church :
 *   main building "96.5 by 51.5 feet (29.4 by 15.7 m)"
 *   nave "about 70 by 51 feet (21 by 16 m), and it measures about 42 feet
 *     (13 m) high"
 *   apse "20 by 23.5 feet (6.1 by 7.2 m) across"
 *   the spire rises "191 feet (58 m) above ground"
 *   foundation walls "made of rubblestone, which extend 7.5 to 11 feet
 *     (2.3 to 3.4 m) deep"
 *   tower walls "3.5-foot-thick (1.1 m) brick"
 *   upper walls "brick laid in English common bond, generally measuring 2.5
 *     feet (0.76 m) thick"
 *   roof "gable roof with slate shingles"
 *   "The building has 42 windows with over 2,000 panes", with "two levels of
 *     arched sash windows"
 *   the belfry: "157 or 159 steps" and eight change ringing bells cast in
 *     1744
 *   built 1723, Georgian, "likely influenced by Christopher Wren's London
 *     churches"
 *
 * STYLE: Georgian, and the Wren church, already in STYLES.md at line 182.
 * Its tells govern what is ADDED here and are not restated: brick laid in a
 * bond that shows, a stone water table separating brick from ground, a belt
 * course between the storeys, a wooden cornice under the eaves, and every
 * opening given a surround, because a Georgian window is a hole with a frame
 * round it and a hole without one is a stain.
 *
 * WHAT THE 42 WINDOWS ARE. The count is published; where they sit is not.
 * Drawn: six bays of two tiers on each long nave wall (24), the front door
 * and two tower windows on the front, one pair on each tower flank (4), and
 * two tiers of four on the apse end (8). That is 24 + 4 + 8 = 36 openings
 * modelled against a published 42, and the shortfall is named here rather
 * than made up by adding six windows to a wall that may not have them.
 *
 * NAMED GAPS: no published brick course height (the banding is drawn at 9
 * courses to the foot, the ordinary English figure, and is a texture not a
 * count); no published water table or cornice depth; no published sill
 * heights; no published steeple stage heights, which is why the stages are
 * the ones already derived in trail-3d.js and are unchanged.
 */
(function () {
  var T = (typeof window !== "undefined" && window.TRAIL3D) || null;
  if (!T || !T.helpers) return;
  var H = T.helpers;
  var ground = H.ground, slab = H.slab, box = H.box, gableRoof = H.gableRoof,
      archOpening = H.archOpening, panel = H.panel, octStage = H.octStage,
      octSpire = H.octSpire;

  function shadow(ctx, cx, cy, w, d, z, dx, dy) {
    var P = ctx.project;
    var q = [P(cx - w / 2 + dx, cy - d / 2 + dy, z), P(cx + w / 2 + dx, cy - d / 2 + dy, z),
             P(cx + w / 2 + dx, cy + d / 2 + dy, z), P(cx - w / 2 + dx, cy + d / 2 + dy, z)];
    return { svg: ctx.poly(q, "rgba(88,84,74,0.22)", null, 0), depth: -1e9 + 2 };
  }

  /* A window as a Georgian window: a light stone surround struck first, the
     dark glass struck inside it. One tone of difference is what item 8 calls
     a disappearing opening; this is four. */
  function sash(ctx, map, uc, halfW, z0, z1, glass, trim, edge, d) {
    var o = [];
    o.push(archOpening(ctx, map, uc, halfW + 0.9, z0 - 0.8, z1, trim, edge, d + 0.30));
    o.push(archOpening(ctx, map, uc, halfW, z0, z1 - 0.55, glass, "#26313a", d + 0.34));
    return o;
  }

  function oldNorth(ctx) {
    var BRICK = "#9a4b3a", BRICK_E = "#6d3327", BRICK_D = "#89412f";
    var TRIM = "#f2ede1", TRIM_E = "#b9b0a0", STONE = "#ded7c6", STONE_E = "#a8a08d";
    var ROOF = "#7b6f63", ROOF_E = "#574e45", GLASS = "#3f4d55", GOLD = "#c9a22c";
    var PAVE = "#ded8cb", GRASS = "#c2c9b4";
    var out = [], P = ctx.project;

    var W = 51.5, LEN = 96.5, TOWER = 26.5;
    var x0 = -W / 2, x1 = W / 2;
    var yFront = -LEN / 2, yTowerBack = yFront + TOWER, yBack = LEN / 2;
    var EAVE = 42, RIDGE = EAVE + 14;

    out.push(ground(ctx, 0, 0, 190, 200, 0, GRASS, "#a8b09a"));
    out.push(ground(ctx, 0, 0, 104, 136, 0.3, PAVE, "#bfb9aa"));
    out.push(shadow(ctx, 0, 4, W + 22, LEN + 16, 0.32, 9, 5));

    /* THE WATER TABLE. The published foundation is rubblestone; where it
       meets the brick a Georgian church puts a stone offset, and without it
       the brick grows out of the lawn. */
    out = out.concat(slab(ctx, 0, 0, W + 2.6, LEN + 2.6, 0.3, 2.6, STONE, STONE_E, -9.9e8));

    /* the nave */
    var body = box(ctx, x0, x1, yTowerBack, yBack, 2.9, EAVE, BRICK, BRICK_E, null, 100);
    out = out.concat(body.parts);

    /* THE BRICK ITSELF, which is the "one brick tone" the standard objected
       to. Nine courses to the foot, drawn as a faint darker band every foot
       on the two visible long walls. It is a texture, not a count, and at
       map scale it is the difference between brick and a red panel. */
    [[-1, x0], [1, x1]].forEach(function (side) {
      if (!ctx.faceVisible(side[0], 0)) return;
      var X = side[1], d = body.walls[side[0] + ",0"];
      if (d === undefined) return;
      for (var z = 4.6; z < EAVE - 1; z += 2.0) {
        out.push({ svg: ctx.poly([P(X, yTowerBack, z), P(X, yBack, z),
                                  P(X, yBack, z + 0.25), P(X, yTowerBack, z + 0.25)],
                                 ctx.shade(BRICK_D, side[0], 0, 0), null, 0), depth: d + 0.05 });
      }
    });

    out = out.concat(gableRoof(ctx, x0, x1, yTowerBack, yBack, EAVE, RIDGE, ROOF, ROOF_E, BRICK));

    /* THE CORNICE, and the belt course between the two window tiers. Two
       horizontal breaks on a wall that had none. */
    out = out.concat(slab(ctx, 0, (yTowerBack + yBack) / 2, W + 2.2, (yBack - yTowerBack) + 2.2,
                          EAVE - 1.9, 1.9, TRIM, TRIM_E, 300));
    out = out.concat(slab(ctx, 0, (yTowerBack + yBack) / 2, W + 1.1, (yBack - yTowerBack) + 1.1,
                          19.4, 1.2, STONE, STONE_E, 250));

    /* two levels of arched sash windows, six bays over the 70 ft nave, each
       now with its surround */
    [[-1, x0], [1, x1]].forEach(function (side) {
      if (!ctx.faceVisible(side[0], 0)) return;
      var X = side[1], d = body.walls[side[0] + ",0"];
      if (d === undefined) return;
      var map = function (u, z) { return ctx.project(X, u, z); };
      for (var b = 0; b < 6; b++) {
        var yc = yTowerBack + 70 * (b + 0.5) / 6;
        out = out.concat(sash(ctx, map, yc, 3.2, 7, 15.4, GLASS, TRIM, TRIM_E, d));
        out = out.concat(sash(ctx, map, yc, 3.2, 23, 31.4, GLASS, TRIM, TRIM_E, d));
      }
    });
    /* the apse end: two tiers of four, the count named as drawn in the
       header and not claimed as published */
    if (ctx.faceVisible(0, 1)) {
      var dB = body.walls["0,1"];
      if (dB !== undefined) {
        var mapB = function (u, z) { return ctx.project(u, yBack, z); };
        for (var q = 0; q < 4; q++) {
          var xc = -W / 2 + W * (q + 0.5) / 4;
          out = out.concat(sash(ctx, mapB, xc, 2.9, 7, 15.4, GLASS, TRIM, TRIM_E, dB));
          out = out.concat(sash(ctx, mapB, xc, 2.9, 23, 31.4, GLASS, TRIM, TRIM_E, dB));
        }
      }
    }

    /* the tower */
    var tx0 = -TOWER / 2, tx1 = TOWER / 2, BRICK_TOP = 70;
    var tower = box(ctx, tx0, tx1, yFront, yTowerBack, 2.9, BRICK_TOP, BRICK, BRICK_E, null, 500);
    out = out.concat(tower.parts);
    /* the tower gets its own brick banding and its own stone bands, or it
       reads as a red column beside a brick church */
    [[0, -1, null], [-1, 0, tx0], [1, 0, tx1]].forEach(function (f) {
      var key = f[0] + "," + f[1], d = tower.walls[key];
      if (d === undefined) return;
      for (var z = 4.6; z < BRICK_TOP - 2; z += 2.0) {
        var quad = f[0] === 0
          ? [P(tx0, yFront, z), P(tx1, yFront, z), P(tx1, yFront, z + 0.25), P(tx0, yFront, z + 0.25)]
          : [P(f[2], yFront, z), P(f[2], yTowerBack, z), P(f[2], yTowerBack, z + 0.25), P(f[2], yFront, z + 0.25)];
        out.push({ svg: ctx.poly(quad, ctx.shade(BRICK_D, f[0], f[1], 0), null, 0), depth: d + 0.05 });
      }
    });
    out = out.concat(slab(ctx, 0, (yFront + yTowerBack) / 2, TOWER + 1.1, TOWER + 1.1,
                          33.0, 1.2, STONE, STONE_E, 560));
    out = out.concat(slab(ctx, 0, (yFront + yTowerBack) / 2, TOWER + 2.0, TOWER + 2.0,
                          BRICK_TOP - 2.0, 2.0, TRIM, TRIM_E, 600));

    /* the front: door and the two windows over it, all centred, because a
       Georgian front that is not symmetrical is not Georgian. The door now
       has a surround and a stone step, which is checklist item 3 at the one
       place a visitor actually stands. */
    if (ctx.faceVisible(0, -1)) {
      var dF = tower.walls["0,-1"];
      var mapF = function (u, z) { return ctx.project(u, yFront, z); };
      out = out.concat(slab(ctx, 0, yFront - 1.6, 16, 5.2, 0.3, 1.4, STONE, STONE_E, -9.88e8));
      out = out.concat(slab(ctx, 0, yFront - 1.4, 13, 4.4, 1.7, 1.2, STONE, STONE_E, -9.86e8));
      out.push(archOpening(ctx, mapF, 0, 5.0, 2.9, 12.4, TRIM, TRIM_E, dF + 0.30));
      out.push(archOpening(ctx, mapF, 0, 4.0, 2.9, 11.4, "#4a3a30", "#2c231d", dF + 0.34));
      out = out.concat(sash(ctx, mapF, 0, 3.4, 20, 27.4, GLASS, TRIM, TRIM_E, dF));
      out = out.concat(sash(ctx, mapF, 0, 2.6, 44, 49.4, GLASS, TRIM, TRIM_E, dF));
    }
    [[-1, tx0], [1, tx1]].forEach(function (side) {
      var d = tower.walls[side[0] + ",0"];
      if (d === undefined) return;
      var X = side[1];
      var map = function (u, z) { return ctx.project(X, u, z); };
      var yc = (yFront + yTowerBack) / 2;
      out = out.concat(sash(ctx, map, yc, 3.4, 20, 27.4, GLASS, TRIM, TRIM_E, d));
      out = out.concat(sash(ctx, map, yc, 2.6, 44, 49.4, GLASS, TRIM, TRIM_E, d));
    });

    /* the wooden steeple, unchanged: belfry, three octagonal lanterns, the
       spire and the vane, ending at the published 191 ft */
    var BELF0 = BRICK_TOP, BELF1 = 96;
    var bw = 22, bx0 = -bw / 2, bx1 = bw / 2;
    var cyT = (yFront + yTowerBack) / 2;
    var by0 = -bw / 2 + cyT, by1 = bw / 2 + cyT;
    var belf = box(ctx, bx0, bx1, by0, by1, BELF0, BELF1, TRIM, TRIM_E, null, 800);
    out = out.concat(belf.parts);
    [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(function (n) {
      var d = belf.walls[n[0] + "," + n[1]];
      if (d === undefined) return;
      var map = n[0] === 0
        ? function (u, z) { return ctx.project(u, n[1] < 0 ? by0 : by1, z); }
        : function (u, z) { return ctx.project(n[0] < 0 ? bx0 : bx1, u, z); };
      var c = n[0] === 0 ? 0 : cyT;
      out.push(archOpening(ctx, map, c, 6.0, BELF0 + 3, BELF0 + 15, TRIM, TRIM_E, d + 0.30));
      out.push(archOpening(ctx, map, c, 5, BELF0 + 4, BELF0 + 14, "#2f3a40", TRIM_E, d + 0.34));
    });
    out = out.concat(slab(ctx, 0, cyT, bw + 2.4, bw + 2.4, BELF1 - 1.8, 1.8, TRIM, TRIM_E, 900));

    var CLK0 = BELF1, CLK1 = 108;
    out = out.concat(box(ctx, -9, 9, by0 + 2, by1 - 2, CLK0, CLK1, TRIM, TRIM_E, null, 950).parts);
    out = out.concat(slab(ctx, 0, cyT, 20.4, 20.4, CLK1 - 1.5, 1.5, TRIM, TRIM_E, 980));

    out = out.concat(octStage(ctx, 0, cyT, 9, 8.2, CLK1, 130, TRIM, TRIM_E));
    out = out.concat(octStage(ctx, 0, cyT, 7.6, 6.8, 130, 148, TRIM, TRIM_E));
    out = out.concat(octStage(ctx, 0, cyT, 6.2, 5.4, 148, 162, TRIM, TRIM_E));
    out = out.concat(octSpire(ctx, 0, cyT, 5.4, 162, 185, TRIM, TRIM_E));
    out = out.concat(octStage(ctx, 0, cyT, 1.1, 1.1, 185, 187, GOLD, "#8a6f18"));
    var vane = [P(-4, cyT, 188), P(4, cyT, 189.6), P(4, cyT, 190.6), P(-4, cyT, 191)];
    out.push({ svg: ctx.poly(vane, GOLD, "#8a6f18", 0.5), depth: 1e8 });
    return out;
  }

  window.TRAIL_FORMS = window.TRAIL_FORMS || {};
  window.TRAIL_FORMS["old-north"] = oldNorth;
})();
