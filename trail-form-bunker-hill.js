/* trail-form-bunker-hill.js — the Bunker Hill Monument, rebuilt to
 * MODEL_STANDARD.md. Registers window.TRAIL_FORMS["bunker-hill"] and takes
 * over from the four-item shaft in trail-3d.js.
 *
 * WHY A REBUILD. The old scene was a lawn, a plaza, two plinth slabs, a
 * tapered shaft and a pyramidion: 1,587 bytes of SVG for the whole
 * monument, correct in every published number and still a grey spike on a
 * green square. It failed checklist items 1, 2, 6 and 9. Nothing was wrong
 * with it. Everything was missing from it.
 *
 * PUBLISHED, every figure quoted from the Wikipedia article on the
 * monument, which cites the NPS and the Boston Landmarks Commission:
 *   "221 feet (67 m) from its base"
 *   "square footprint measuring about 30 by 30 feet (9.1 by 9.1 m) across"
 *   "tapers to 15 by 15 feet (4.6 by 4.6 m) near the top of the shaft"
 *   "78 courses, each measuring 2+2/3 feet (0.81 m) tall"
 *   wall thickness "ranges from 6 feet (1.8 m) at the bottom to 2 feet
 *     (0.61 m) at the top"
 *   "6,700 short tons ... of granite", Quincy, Massachusetts
 *   the pyramidal top: "12-foot-tall (3.7 m)" of "five courses of granite",
 *     the capstone "3.5 feet (1.1 m) high"
 *   the foundation "12 feet (3.7 m) deep", "50 by 50 feet (15 by 15 m)
 *     across", "six courses"
 *   the Lodge, 1902: "50 by 38 feet (15 by 12 m) across and 19 feet (5.8 m)
 *     tall", "one-story neoclassical building with a rectangular grid of
 *     three by four bays", "gray Deer Isle granite", an "Ionic-style
 *     portico" on the eastern elevation, a "cast iron door with two
 *     rosettes"
 *   the Prescott statue, William Wetmore Story 1880-81: "about 8 feet
 *     (2.4 m)" of bronze on a granite pedestal, "right leg advancing and
 *     his right hand grasping a sword"
 *   https://en.wikipedia.org/wiki/Bunker_Hill_Monument
 *
 * THE ARITHMETIC, done rather than assumed: 78 courses at 2 2/3 ft is
 * 208.0 ft of shaft; 208 + the 12 ft pyramidal top is 220; the published
 * total is 221 "from its base", so one foot of plinth shows above grade and
 * the numbers close. The taper is 30 ft to 15 ft over 208, a lean of 0.036,
 * which is an obelisk and not a spike, and it is the reason the courses are
 * drawn: 78 stone joints climbing a face that narrows is the only thing
 * that gives 221 feet of granite its scale.
 *
 * STYLE: Egyptian Revival, already in STYLES.md at line 123. Its tells are
 * obeyed here and are the reason this model has no cornice and no carving:
 * the form is borrowed for permanence, cut plain in local stone, and the
 * shaft does all the work.
 *
 * NAMED GAPS, not guessed:
 *   - no published column count for the Lodge's Ionic portico. Drawn
 *     DISTYLE, two columns flanking the door, which is the fewest a portico
 *     can have and therefore the smallest claim available. It is a
 *     derivation and is not a fact.
 *   - no published window count or size for the Lodge. The three-by-four
 *     bay grid IS published, so the openings are placed on that grid and
 *     nowhere else.
 *   - no published position for the Prescott statue relative to the shaft,
 *     only that it stands on the same terrace. Placed on the axis of the
 *     Lodge's portico, and said so.
 *   - the Lodge's roof: a one-storey neoclassical granite pavilion of 1902
 *     with a rotunda inside. No roof form is published. Drawn FLAT behind a
 *     parapet, which checklist item 4 requires be stated out loud rather
 *     than left as a lid.
 */
(function () {
  var H = (typeof window !== "undefined" && window.TRAIL3D && window.TRAIL3D.helpers) || null;
  if (!H) return;
  var ground = H.ground, slab = H.slab, taperedShaft = H.taperedShaft,
      pyramidion = H.pyramidion, box = H.box, panel = H.panel,
      columnAt = H.columnAt, octStage = H.octStage;

  /* Nothing in this renderer casts light, so a mass without a shadow floats.
     Drawn on the ground plane, offset toward the light, at a depth just
     above the pad so it never paints over the thing casting it. */
  function shadow(ctx, cx, cy, w, d, z, dx, dy) {
    var P = ctx.project;
    var q = [P(cx - w / 2 + dx, cy - d / 2 + dy, z), P(cx + w / 2 + dx, cy - d / 2 + dy, z),
             P(cx + w / 2 + dx, cy + d / 2 + dy, z), P(cx - w / 2 + dx, cy + d / 2 + dy, z)];
    return { svg: ctx.poly(q, "rgba(90,96,86,0.20)", null, 0), depth: -1e9 + 2 };
  }

  function bunkerHill(ctx) {
    var GRANITE = "#9c9a95", G_EDGE = "#6f6d69", G_LIGHT = "#b4b2ac", G_DARK = "#87857f";
    var DEER = "#a7a49c", DEER_E = "#75726b";
    var PLAZA = "#ddd8cc", GRASS = "#c2c9b4", GLASS = "#414c52", BRONZE = "#5d5340";
    var out = [];

    out.push(ground(ctx, 0, 0, 190, 190, 0, GRASS, "#a8b09a"));
    out.push(ground(ctx, 0, 0, 122, 122, 0.3, PLAZA, "#bfb9aa"));

    /* ---- the shaft ---- */
    var cx = 0, cy = 0;
    /* the published 50 by 50 foundation, showing as the terrace it really
       is; the stepped plinth above it is the visible base */
    out.push(shadow(ctx, cx, cy, 62, 62, 0.32, 7, 4));
    out = out.concat(slab(ctx, cx, cy, 50, 50, 0.3, 2.2, G_LIGHT, G_EDGE, -9.90e8));
    out = out.concat(slab(ctx, cx, cy, 42, 42, 2.5, 2.2, G_LIGHT, G_EDGE, -9.88e8));
    out = out.concat(slab(ctx, cx, cy, 35, 35, 4.7, 2.3, G_LIGHT, G_EDGE, -9.86e8));

    var Z = 7.0, COURSE = 8 / 3, NC = 78, SHAFT = COURSE * NC;   /* 208.0 ft */
    var W0 = 30, W1 = 15;
    out = out.concat(taperedShaft(ctx, cx, cy, W0, W1, Z, SHAFT, GRANITE, G_EDGE, 1000));

    /* THE 78 COURSES. Checklist item 2: one extruded wall from the plinth to
       the pyramidion is the shape of a box, whatever the header says. Each
       joint is drawn as a hairline band on the two visible faces, at the
       width the taper has reached, so the stone narrows as it climbs. */
    var P = ctx.project;
    var norms = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    for (var c = 1; c < NC; c++) {
      var zc = Z + c * COURSE;
      var wc = W0 + (W1 - W0) * (c / NC), b = wc / 2;
      var lo = [[cx - b, cy - b], [cx + b, cy - b], [cx + b, cy + b], [cx - b, cy + b]];
      for (var i = 0; i < 4; i++) {
        if (!ctx.faceVisible(norms[i][0], norms[i][1])) continue;
        var j = (i + 1) % 4;
        var band = [P(lo[i][0], lo[i][1], zc), P(lo[j][0], lo[j][1], zc),
                    P(lo[j][0], lo[j][1], zc + 0.34), P(lo[i][0], lo[i][1], zc + 0.34)];
        out.push({ svg: ctx.poly(band, ctx.shade(G_DARK, norms[i][0], norms[i][1], 0), null, 0),
                   depth: 1000 + i * 0.1 + 0.02 });
      }
    }

    /* the doorway at the foot of the shaft: the way in to the 294 steps, and
       the one opening the monument has. Drawn on the south face, which is
       the face that meets the Lodge. */
    var dHW = 2.4, dTop = 8.2;
    [[0, -1, -W0 / 2], [0, 1, W0 / 2]].forEach(function (f) {
      if (!ctx.faceVisible(f[0], f[1])) return;
      var yF = f[2];
      var surr = [P(cx - dHW - 1.0, yF, Z), P(cx + dHW + 1.0, yF, Z),
                  P(cx + dHW + 1.0, yF, Z + dTop + 1.0), P(cx - dHW - 1.0, yF, Z + dTop + 1.0)];
      out.push({ svg: ctx.poly(surr, ctx.shade(G_LIGHT, f[0], f[1], 0), G_EDGE, 0.4),
                 depth: 1000 + (f[1] < 0 ? 0 : 0.2) + 0.05 });
      var op = [P(cx - dHW, yF, Z), P(cx + dHW, yF, Z),
                P(cx + dHW, yF, Z + dTop), P(cx - dHW, yF, Z + dTop)];
      out.push({ svg: ctx.poly(op, "#33383a", "#22262a", 0.4),
                 depth: 1000 + (f[1] < 0 ? 0 : 0.2) + 0.07 });
    });

    /* the pyramidal top: five courses over 12 ft, finished by the 3.5 ft
       capstone. Drawn as the published two pieces, not as one cone. */
    var ZT = Z + SHAFT;
    for (var k = 0; k < 4; k++) {
      var w0 = W1 - (W1 - 11.5) * (k / 4), w1 = W1 - (W1 - 11.5) * ((k + 1) / 4);
      out = out.concat(taperedShaft(ctx, cx, cy, w0, w1, ZT + k * 2.125, 2.125,
                                    G_LIGHT, G_EDGE, 2000 + k * 5));
    }
    out = out.concat(pyramidion(ctx, cx, cy, 11.5, ZT + 8.5, 3.5, G_LIGHT, G_EDGE));

    /* ---- the Lodge, 1902 ---- */
    var lx = 0, ly = 62, LW = 50, LD = 38, LH = 19;
    out.push(shadow(ctx, lx, ly, LW + 10, LD + 8, 0.32, 6, 3.5));
    /* podium, then the granite wall, then a cornice band and a parapet:
       three horizontal breaks, which is what stops a 50 ft box reading as a
       box */
    out = out.concat(slab(ctx, lx, ly, LW + 6, LD + 6, 0.3, 1.6, G_LIGHT, G_EDGE, -9.84e8));
    var lodge = box(ctx, lx - LW / 2, lx + LW / 2, ly - LD / 2, ly + LD / 2,
                    1.9, 1.9 + LH, DEER, DEER_E, null, 3000);
    out = out.concat(lodge.parts);
    out = out.concat(slab(ctx, lx, ly, LW + 1.8, LD + 1.8, 1.9 + LH, 1.5, G_LIGHT, G_EDGE, 3100));
    out = out.concat(slab(ctx, lx, ly, LW + 0.6, LD + 0.6, 3.4 + LH, 2.2, DEER, DEER_E, 3200));
    /* the flat roof, stated: no roof form is published for the Lodge, so it
       is drawn flat behind its parapet rather than given an invented pitch */
    out.push({ svg: ctx.poly([P(lx - LW / 2, ly - LD / 2, 2.0 + LH),
                              P(lx + LW / 2, ly - LD / 2, 2.0 + LH),
                              P(lx + LW / 2, ly + LD / 2, 2.0 + LH),
                              P(lx - LW / 2, ly + LD / 2, 2.0 + LH)],
                             ctx.shade("#8e8b84", 0, 0, 1), DEER_E, 0.4), depth: 3150 });

    /* THE PUBLISHED BAY GRID, drawn as real openings: four bays on each 50 ft
       elevation, three on each 38 ft end. Checklist item 8: the glass is far
       darker than the granite so the openings survive at map scale. */
    function bays(axis, at, n, span, nx, ny, dep) {
      if (!ctx.faceVisible(nx, ny)) return;
      var step = span / n, u0 = -span / 2;
      for (var q = 0; q < n; q++) {
        var uc = u0 + step * (q + 0.5);
        var map = axis === "x"
          ? function (u, z) { return P(u + lx, at, z); }
          : function (u, z) { return P(at, u + ly, z); };
        out.push(panel(ctx, map, uc - 3.1, uc + 3.1, 5.0, 15.6, ctx.shade(G_LIGHT, nx, ny, 0), DEER_E, dep + 0.02));
        out.push(panel(ctx, map, uc - 2.5, uc + 2.5, 5.6, 15.0, GLASS, "#2b3134", dep + 0.04));
      }
    }
    bays("x", ly - LD / 2, 4, LW, 0, -1, 3000);
    bays("x", ly + LD / 2, 4, LW, 0, 1, 3000 + 0.2);
    bays("y", lx - LW / 2, 3, LD, -1, 0, 3000 + 0.3);
    bays("y", lx + LW / 2, 3, LD, 1, 0, 3000 + 0.1);

    /* the Ionic portico on the eastern elevation, and the cast iron door
       behind it. Two columns, DERIVED not published, on the published
       centre of the east front. */
    if (ctx.faceVisible(1, 0)) {
      var px = lx + LW / 2;
      out = out.concat(slab(ctx, px + 3.0, ly, 12.0, 16.0, 0.3, 1.9, G_LIGHT, G_EDGE, 3400));
      [-4.6, 4.6].forEach(function (dy, ci) {
        out = out.concat(columnAt(ctx, px + 3.0, ly + dy, 1.15, 2.2, 16.4, G_LIGHT, G_EDGE, 3450 + ci));
      });
      out = out.concat(slab(ctx, px + 3.0, ly, 13.0, 17.0, 16.4, 1.8, G_LIGHT, G_EDGE, 3500));
      var mapE = function (u, z) { return P(px, u + ly, z); };
      out.push(panel(ctx, mapE, -4.0, 4.0, 1.9, 13.0, "#3a3f42", "#23282b", 3000 + 0.16));
      /* the two rosettes, which is what the published description of the
         door actually names */
      [-1.9, 1.9].forEach(function (dy2) {
        out = out.concat(octStage(ctx, px + 0.15, ly + dy2, 0.62, 0.62, 8.4, 8.7, BRONZE, "#3d3628", 3000 + 0.18));
      });
    }

    /* ---- the Prescott statue ---- */
    var sx = lx + 46, sy = ly;
    out.push(shadow(ctx, sx, sy, 9, 9, 0.32, 3, 1.8));
    out = out.concat(slab(ctx, sx, sy, 7.0, 7.0, 0.3, 1.1, G_LIGHT, G_EDGE, -9.82e8));
    out = out.concat(slab(ctx, sx, sy, 5.2, 5.2, 1.4, 5.4, GRANITE, G_EDGE, 4000));
    out = out.concat(slab(ctx, sx, sy, 6.0, 6.0, 6.8, 0.7, G_LIGHT, G_EDGE, 4050));
    /* the figure: 8 ft of bronze, right leg advancing and the sword arm out,
       read as a standing mass with a stride and an arm rather than modelled
       limb by limb */
    out = out.concat(octStage(ctx, sx, sy, 1.5, 1.15, 7.5, 12.0, BRONZE, "#3d3628", 4100));
    out = out.concat(octStage(ctx, sx + 0.8, sy - 0.5, 0.55, 0.5, 7.5, 10.4, BRONZE, "#3d3628", 4110));
    out = out.concat(octStage(ctx, sx, sy, 1.0, 0.9, 12.0, 13.4, BRONZE, "#3d3628", 4120));
    out = out.concat(octStage(ctx, sx, sy, 1.55, 1.55, 13.4, 13.9, BRONZE, "#3d3628", 4130));
    var swordA = [P(sx + 1.2, sy - 1.0, 10.2), P(sx + 4.4, sy - 2.6, 13.6),
                  P(sx + 4.6, sy - 2.6, 13.9), P(sx + 1.3, sy - 1.0, 10.6)];
    out.push({ svg: ctx.poly(swordA, ctx.shade(BRONZE, 0.6, -0.5, 0.2), "#3d3628", 0.3), depth: 4140 });

    return out;
  }

  window.TRAIL_FORMS = window.TRAIL_FORMS || {};
  window.TRAIL_FORMS["bunker-hill"] = bunkerHill;
})();
