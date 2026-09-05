/* ---------------- Stop 8: the Old South Meeting House ----------------
   Robert Twelves, built 1729 by Joshua Blanchard. Georgian, brick, and the
   largest room in colonial Boston: five thousand people packed into it on
   16 December 1773 to hear whether the tea would go back, and walked out of
   it to the harbour. Rebuilt to MODEL_STANDARD.md, 2026-09-05, by the
   landmark routine.

   PUBLISHED, from the Wikipedia article on the Old South Meeting House,
   which cites the National Historic Landmark file and the Boston Landmarks
   Commission, read this run:

     "66-68 feet (20-21 m) wide and 93-95 feet (28-29 m) long"
     the tower rises "about 80 feet (24 m) with three stories"
     "183 feet (56 m) tall" overall
     a "20-foot-tall (6.1 m) gilded weathervane" by Thomas and David Drowne
     first story windows in a "15-over-15 configuration"
     second story windows in a "15-over-20 configuration"
     "Multiple oxeye windows with radiating muntins"
     "Flemish bond" masonry with a "brick water table at lowest portion"
     a roof "combination of hipped and gable" in "slate shingles" with
     "copper gutters"
     the main building "two stories"; the clock mechanism "no later than 1770"

   PUBLISHED, from the Boston Landmarks Commission study report of 2025, as
   already quoted in trail-3d.js and kept because it carries the counts the
   Wikipedia article does not: the brick tower rises eighty feet to the
   steeple, the steeple carries a twenty foot copper clad octagonal spire,
   the front is FIVE bays wide with a gable end and the tower centred on it,
   the long elevations are SEVEN bays, the windows are semicircular arched
   with fanlights at both stories, and the roof is gabled at the west end and
   hipped at the east. The report also quotes an older description of a THREE
   STAGE octagonal spire.

   THE CHECK THAT MADE THIS REBUILD WORTH DOING, and it is arithmetic rather
   than opinion. The scene this file replaces had to DERIVE the footprint,
   because no source that run reached published one, and it said so. The
   Wikipedia article publishes it, and the published footprint and the
   published bay counts agree to a tenth of a foot: 67 ft across five bays is
   13.40 ft per bay, 94 ft along seven bays is 13.43. Two independent
   published facts, one module. The plan here is 67 by 94 and nothing about
   it is proportioned by eye.

   THE VERTICAL SUBTRACTION, carried over and still the honest way to reach
   the middle of the building: 183 overall, less the 80 ft of brick tower,
   less the 20 ft spire, leaves 83 ft of wooden steeple between them. The
   split of that 83 into a bell stage, a pedestal and the three published
   octagons is DERIVED and is the softest thing in this model.

   A CONFLICT, named rather than smoothed. Wikipedia calls the WEATHERVANE
   twenty feet tall; the Landmarks report calls the SPIRE twenty feet. Both
   cannot sit inside a published 183 ft without something else shrinking. The
   spire reading is taken, because it is the one that closes the height
   arithmetic, and the vane is drawn as the gilded finial the same article
   describes rather than as a sixth of the steeple. If the vane really is
   twenty feet, this model is twenty feet short at the top and says so here.

   WHY THE DOOR IS WHERE IT IS. This is a meeting house, not a church. The
   tower doors are on the short end, the principal entrance is on the LONG
   side, and the pulpit faces it across the width. Putting the entrance under
   the tower would turn it into Old North, which is the one thing it is not.

   ORIENTATION, which on this renderer is not a detail. At the page's own
   opening yaw of -0.62 the visible faces are +y and -x, and every other face
   is culled. The tower end is put at +y and the long side with the principal
   door at -x, so the two elevations the reader gets are the two that carry
   the architecture. Old State House recorded this trap in trail-3d.js, and
   Bunker Hill, Old North and the State House each sprang it again.

   Named gaps: no published tower plan (20 ft square, projecting 5 ft, is
   derived from the 13.4 ft bay module); no published eave or storey height
   (first storey 7 to 19, belt at 20.5, second 25 to 38, eave 40, from the
   published two stories and the taller second sash); no published roof
   pitch; no published position for the oxeye windows, drawn on the tower's
   third stage where the Landmarks photographs show them; no published hip
   run at the east end; no published step count at the door. */
(function () {
  var H = (window.TRAIL3D && window.TRAIL3D.helpers) || {};
  var box = H.box, panel = H.panel, ground = H.ground, archOpening = H.archOpening;
  var roundWindow = H.roundWindow, balustrade = H.balustrade, columnAt = H.columnAt;
  var octStage = H.octStage, octSpire = H.octSpire, depthOf = H.depthOf;

  function oldSouth(ctx) {
    /* CHECKLIST 5, two tones per material: BRICK against BRICK_D for the
       Flemish bond course banding, TRIM against TRIM_D for the marble and
       wood, COPPER against COPPER_D for the clad spire, SLATE against
       SLATE_D for the roof. ctx.shade works the face normals on top. */
    var BRICK = "#9d5341", BRICK_D = "#8e4a3a", BRICK_E = "#6d3327";
    var TRIM = "#f2ede1", TRIM_D = "#ddd5c4", TRIM_E = "#b0a695";
    var SLATE = "#7b7d80", SLATE_D = "#6a6c6f", SLATE_E = "#4e5053";
    var COPPER = "#7fa898", COPPER_D = "#6b9184", COPPER_E = "#4e6d62";
    var GLASS = "#38454d", DOOR = "#4a3a30", GOLD = "#cea52a", GOLD_E = "#8a6f18";
    var GRANITE = "#b6b2a7", GRANITE_E = "#8b8779";
    var PAVE = "#ded8cb", KERB = "#bfb9aa", SHADOW = "#a9ae9c";
    var out = [], P = ctx.project;

    /* THE PUBLISHED PLAN. 67 wide by 94 long, front (tower end) at +y, the
       long elevation with the principal door at -x. */
    var W = 67, L = 94, BAY = 13.4;
    var x0 = -W / 2, x1 = W / 2, y0 = -L / 2, y1 = L / 2;

    /* THE ELEVATION. Two published stories; the heights are derived. */
    var WT = 3;                 /* the published brick water table */
    var S1a = 7, S1b = 19;      /* first story sash, published 15-over-15 */
    var BELT = 20.5;            /* the string course between the two tiers */
    var S2a = 25, S2b = 38;     /* second story sash, published 15-over-20 */
    var EAVE = 40, RIDGE = 58;

    /* THE PUBLISHED TOWER AND STEEPLE. 80 brick + 83 wood + 20 spire = 183. */
    var TW = 20, tx0 = -TW / 2, tx1 = TW / 2, ty0 = y1 - 6, ty1 = y1 + 5;
    var TB = 80;                        /* brick, published */
    var BELL0 = 80, BELL1 = 96;         /* bell stage, derived */
    var PED0 = 96, PED1 = 104;          /* pedestal and balustrade, derived */
    var O1 = 104, O2 = 126, O3 = 145, OT = 163;   /* the three published octagons */
    var SPIRE = 183;                    /* published: 20 ft of copper */

    /* WHAT LOOKING CAUGHT, first pass: a 300 ft pavement pad, not the
       building, was setting the frame, because the trail renderer fits to
       everything including the ground. That is the Bunker Hill lesson
       arriving again, and shrinking the pad to 150 nearly doubles the
       meeting house on the page without touching a published dimension. */
    out.push(ground(ctx, 0, 0, 150, 150, 0, PAVE, KERB));
    out.push(ground(ctx, x0 - 13, 0, 14, 116, 0.3, "#cfcabc", KERB));

    /* CHECKLIST 6: a ground shadow, cast away from LIGHT = [0.60,0.30,0.68],
       so down and to the left in plan. Nothing here casts light. */
    (function () {
      var q = [P(x0 - 8, y0 - 5, 0.1), P(x1 - 4, y0 - 5, 0.1),
               P(x1 - 4, ty1 - 3, 0.1), P(x0 - 8, ty1 - 3, 0.1)];
      out.push({ svg: ctx.poly(q, SHADOW, null, 0), depth: -9e8 });
    })();

    /* CHECKLIST 3: a base. The published brick water table, drawn proud so
       the wall does not grow straight out of the pavement. */
    out = out.concat(box(ctx, x0 - 1, x1 + 1, y0 - 1, y1 + 1, 0, WT,
                         BRICK_D, BRICK_E, null, -8.6e8).parts);

    /* THE FOUR ELEVATIONS, each drawn ONLY when its own normal faces the
       camera. WHAT LOOKING CAUGHT, second pass, and it is the worst fault in
       this file's history: panel() and archOpening() carry no visibility
       test, so the first version struck every window, belt course and
       cornice on the -x and +y maps whatever the yaw. Turn the model round
       and all of that trim went on painting, floating in front of the
       building on the side it does not belong to, in white bars and windows
       hanging past the corners. box() culls its walls; the things drawn ON a
       wall have to be culled with the same test, by hand. */
    var D = -8e8;
    var body = box(ctx, x0, x1, y0, y1, WT, EAVE, BRICK, BRICK_E, null, D);
    out = out.concat(body.parts);

    /* CHECKLIST 5 again: the brick's second tone as Flemish bond course
       banding. A texture and not a count, because no source reached gives a
       course height, so this claims a masonry surface and nothing more. */
    function courses(map, u0, u1, za, zb, d) {
      for (var z = za + 2.6; z < zb - 1; z += 2.6) {
        out.push(panel(ctx, map, u0, u1, z, z + 0.4, BRICK_D, null, d + 0.005));
      }
    }

    /* CHECKLIST 1 and 8: the published counts drawn as real openings, each
       with a light marble SURROUND struck before the dark glass goes inside
       it. A window one tone off its wall disappears at 900 pixels; a window
       with a surround is still a window. Semicircular arched with fanlights
       at both stories, per the Landmarks report, so every head is an arc. */
    function sash(map, uc, za, zb, hw, d) {
      out.push(archOpening(ctx, map, uc, hw + 0.9, za - 0.9, zb - hw, TRIM, TRIM_E, d + 0.02));
      out.push(archOpening(ctx, map, uc, hw, za, zb - hw, GLASS, TRIM_E, d + 0.04));
      /* the fanlight's own springing line, so the head reads as a fanlight
         and not as a rounded pane */
      out.push(panel(ctx, map, uc - hw, uc + hw, zb - hw - 0.25, zb - hw + 0.25,
                     TRIM_D, null, d + 0.06));
      /* the muntin bar down the middle: at map scale one bar is what says
         "many small panes" without pretending to draw fifteen */
      out.push(panel(ctx, map, uc - 0.28, uc + 0.28, za, zb - hw, TRIM_D, null, d + 0.06));
    }

    var WALLS = [
      { n: [0, -1], u0: x0, u1: x1, bays: 5, door: false,
        map: function (u, z) { return P(u, y0, z); } },
      { n: [1, 0],  u0: y0, u1: y1, bays: 7, door: false,
        map: function (u, z) { return P(x1, u, z); } },
      { n: [0, 1],  u0: x0, u1: x1, bays: 5, door: false,
        map: function (u, z) { return P(u, y1, z); } },
      { n: [-1, 0], u0: y0, u1: y1, bays: 7, door: true,
        map: function (u, z) { return P(x0, u, z); } }
    ];

    WALLS.forEach(function (w, wi) {
      if (!ctx.faceVisible(w.n[0], w.n[1])) return;
      var d = body.walls[w.n[0] + "," + w.n[1]];
      if (d === undefined) return;
      var map = w.map, span = w.u1 - w.u0, mod = span / w.bays;
      courses(map, w.u0, w.u1, WT, EAVE, d);

      for (var i = 0; i < w.bays; i++) {
        var uc = w.u0 + mod * (i + 0.5);
        var centre = (i === (w.bays - 1) / 2);
        /* the FRONT and BACK centre bays are the tower, so no window there */
        if (w.bays === 5 && centre) continue;
        if (w.door && centre) {
          /* THE PRINCIPAL ENTRANCE, on the long side, in the centre bay,
             where the Landmarks report puts it. This is a meeting house. */
          out.push(archOpening(ctx, map, uc, 4.6, 3.4, 12.5, TRIM, TRIM_E, d + 0.12));
          out.push(archOpening(ctx, map, uc, 3.7, 3.9, 12.0, DOOR, TRIM_E, d + 0.14));
          out.push(panel(ctx, map, uc - 3.7, uc + 3.7, 11.4, 12.0, TRIM_D, null, d + 0.16));
          sash(map, uc, S2a, S2b, 3.1, d);
          /* CHECKLIST 3 again: granite steps up to it */
          for (var st = 0; st < 3; st++) {
            out = out.concat(box(ctx, x0 - 1.2 - (3 - st) * 1.5, x0 - 0.6,
                                 uc - 7 + st * 0.9, uc + 7 - st * 0.9,
                                 0, 1.2 + st * 1.1, GRANITE, GRANITE_E, GRANITE,
                                 D + 0.9 + st * 0.05).parts);
          }
          continue;
        }
        sash(map, uc, S1a, S1b, 3.1, d);
        sash(map, uc, S2a, S2b, 3.1, d);
      }

      /* CHECKLIST 2: the horizontal breaks. Water table cap, the belt course
         between the published two window tiers, and a two course main
         cornice. One extruded wall ground to roof is the shape of a box. */
      out.push(panel(ctx, map, w.u0, w.u1, WT - 0.2, WT + 0.5, TRIM_D, null, d + 0.10));
      out.push(panel(ctx, map, w.u0, w.u1, BELT, BELT + 1.1, TRIM, TRIM_E, d + 0.10));
      out.push(panel(ctx, map, w.u0, w.u1, EAVE - 2.4, EAVE - 1.1, TRIM_D, null, d + 0.10));
      out.push(panel(ctx, map, w.u0, w.u1, EAVE - 1.1, EAVE, TRIM, TRIM_E, d + 0.10));
    });

    /* CHECKLIST 4: the published roof. Slate, gabled at the tower end and
       hipped at the far end, and cut into STRIPS along the ridge so the
       tower at +y sorts in front of the near slope instead of under it. That
       is the gableRoofCut lesson from Old State House: a painter's depth is
       a face's nearest point, and one slope running the whole length has its
       nearest corner at the reader's end. */
    (function () {
      var xm = 0, halfW = W / 2, HIP = 16, yh = y0 + HIP;
      var N = 8;
      for (var s = 0; s < 2; s++) {
        var sgn = s ? 1 : -1, xE = sgn * halfW;
        for (var j = 0; j < N; j++) {
          var ya = y0 + (L * j) / N, yc = y0 + (L * (j + 1)) / N;
          /* the hipped end: the ridge stops short, so the strips inside the
             hip run to a ridge line that walks out to the eave */
          var rA = ya < yh ? xm + sgn * halfW * (1 - (ya - y0) / HIP) : xm;
          var rB = yc < yh ? xm + sgn * halfW * (1 - (yc - y0) / HIP) : xm;
          var zA = ya < yh ? EAVE + (RIDGE - EAVE) * ((ya - y0) / HIP) : RIDGE;
          var zB = yc < yh ? EAVE + (RIDGE - EAVE) * ((yc - y0) / HIP) : RIDGE;
          var q = [P(xE, ya, EAVE), P(xE, yc, EAVE), P(rB, yc, zB), P(rA, ya, zA)];
          out.push({ svg: ctx.poly(q, ctx.shade(j % 3 === 0 ? SLATE_D : SLATE, sgn * 0.5, 0, (ya < yh ? 0.35 : 0.8)),
                                   SLATE_E, 0.6), depth: depthOf(q) });
        }
      }
      /* the gable at the tower end, and its two raking cornices */
      if (ctx.faceVisible(0, 1)) {
        var t = [P(x0, y1, EAVE), P(x1, y1, EAVE), P(xm, y1, RIDGE)];
        var dg = depthOf(t);
        out.push({ svg: ctx.poly(t, ctx.shade(BRICK, 0, 1, 0), BRICK_E, 0.6), depth: dg });
        [[x0, -1], [x1, 1]].forEach(function (r) {
          var q2 = [P(r[0], y1, EAVE), P(xm, y1, RIDGE),
                    P(xm - r[1] * 1.6, y1, RIDGE - 1.4), P(r[0], y1, EAVE - 1.4)];
          out.push({ svg: ctx.poly(q2, TRIM, TRIM_E, 0.5), depth: dg + 0.2 });
        });
      }
    })();

    /* THE TOWER: eighty published feet of brick in three published stories,
       centred on the five bay front and projecting five feet. */
    var DT = -7e8;
    out = out.concat(box(ctx, tx0 - 1, tx1 + 1, ty0, ty1 + 1, 0, WT,
                         BRICK_D, BRICK_E, null, DT - 1e6).parts);
    out = out.concat(box(ctx, tx0, tx1, ty0, ty1, WT, TB, BRICK, BRICK_E, null, DT).parts);
    /* THE TOWER'S OWN FOUR FACES, culled the same way the body's are, and
       for the same reason: the first version struck the door, the clock and
       the oxeye on the +y and -x maps at every yaw, so the tower carried a
       door on the wrong side wherever the reader turned it. */
    var TFACES = [
      { n: [0, -1], u0: tx0, u1: tx1, front: true,
        map: function (u, z) { return P(u, ty0, z); } },
      { n: [1, 0],  u0: ty0, u1: ty1, front: false,
        map: function (u, z) { return P(tx1, u, z); } },
      { n: [0, 1],  u0: tx0, u1: tx1, front: true,
        map: function (u, z) { return P(u, ty1, z); } },
      { n: [-1, 0], u0: ty0, u1: ty1, front: false,
        map: function (u, z) { return P(tx0, u, z); } }
    ];
    TFACES.forEach(function (f, fi) {
      if (!ctx.faceVisible(f.n[0], f.n[1])) return;
      var d = DT + 0.1 * fi, map = f.map, uc = (f.u0 + f.u1) / 2;
      courses(map, f.u0, f.u1, WT, TB, d);
      /* the three published stories, read as two string courses */
      [28, 54].forEach(function (z) {
        out.push(panel(ctx, map, f.u0, f.u1, z, z + 1.1, TRIM, TRIM_E, d + 0.01));
      });
      /* the crowning cornice, two courses so it oversails and reads */
      out.push(panel(ctx, map, f.u0 - 0.6, f.u1 + 0.6, TB - 2.6, TB - 1.2, TRIM_D, null, d + 0.02));
      out.push(panel(ctx, map, f.u0 - 0.6, f.u1 + 0.6, TB - 1.2, TB, TRIM, TRIM_E, d + 0.03));
      /* the tower door: only on the end that projects past the gable */
      if (f.n[1] === 1) {
        out.push(archOpening(ctx, map, uc, 5.2, 3.4, 13.5, TRIM, TRIM_E, d + 0.04));
        out.push(archOpening(ctx, map, uc, 4.3, 3.9, 13.0, DOOR, TRIM_E, d + 0.05));
      }
      sash(map, uc, 32, 48, 3.4, d);
      /* THE PUBLISHED CLOCK, dated no later than 1770, on the tower face
         under the belfry. WHAT LOOKING CAUGHT: the first version put it at
         z = 100, which is inside the pedestal that is drawn after it, so
         the clock the article names was painted over and never appeared. */
      out.push(roundWindow(ctx, map, uc, 68, 4.6, TRIM, TRIM_E, d + 0.06));
      out.push(roundWindow(ctx, map, uc, 68, 3.8, "#2f3a40", TRIM_E, d + 0.07));
      out.push(panel(ctx, map, uc - 0.22, uc + 0.22, 68, 70.6, TRIM, null, d + 0.08));
      out.push(panel(ctx, map, uc, uc + 2.4, 67.8, 68.2, TRIM, null, d + 0.08));
      /* THE PUBLISHED OXEYE WINDOWS with their radiating muntins, on the
         stage below. No source reached gives their position, so they sit on
         the tower where the Landmarks photographs show them and nowhere
         else. */
      out.push(roundWindow(ctx, map, uc, 58, 3.6, TRIM, TRIM_E, d + 0.06));
      out.push(roundWindow(ctx, map, uc, 58, 2.8, GLASS, TRIM_E, d + 0.07));
      for (var k = 0; k < 4; k++) {
        var ang = k * Math.PI / 4, cx2 = Math.cos(ang) * 2.8, sy2 = Math.sin(ang) * 2.8;
        var px = -Math.sin(ang) * 0.22, pz = Math.cos(ang) * 0.22;
        out.push({ svg: ctx.poly([map(uc - cx2 + px, 58 - sy2 + pz),
                                  map(uc + cx2 + px, 58 + sy2 + pz),
                                  map(uc + cx2 - px, 58 + sy2 - pz),
                                  map(uc - cx2 - px, 58 - sy2 - pz)],
                                 TRIM_D, null, 0), depth: d + 0.08 });
      }
    });

    /* THE STEEPLE. Eighty three feet of wood between the published brick and
       the published spire: a bell stage with its louvres and the clock the
       article dates to no later than 1770, a balustraded pedestal, and the
       THREE octagons the Landmarks report's older description names. */
    var DS = -6e8;
    out = out.concat(box(ctx, tx0 + 1.2, tx1 - 1.2, ty0 + 1.2, ty1 - 1.2,
                         BELL0, BELL1, TRIM, TRIM_E, null, DS).parts);
    var mapB = function (u, z) { return P(u, ty1 - 1.2, z); };
    var mapBx = function (u, z) { return P(tx0 + 1.2, u, z); };
    [[mapB, tx0 + 1.2, tx1 - 1.2, DS + 0.2], [mapBx, ty0 + 1.2, ty1 - 1.2, DS + 0.3]]
      .forEach(function (m) {
        out.push(panel(ctx, m[0], m[1] + 2.2, m[2] - 2.2, BELL0 + 2, BELL1 - 3.2,
                       "#3d4a44", TRIM_E, m[3] + 0.05));
        for (var z = BELL0 + 3; z < BELL1 - 3.6; z += 1.6) {
          out.push(panel(ctx, m[0], m[1] + 2.2, m[2] - 2.2, z, z + 0.7, TRIM_D, null, m[3] + 0.07));
        }
        out.push(panel(ctx, m[0], m[1] - 0.5, m[2] + 0.5, BELL1 - 1.4, BELL1, TRIM, TRIM_E, m[3] + 0.09));
      });
    /* the clock, on the face the reader has */
    out.push(roundWindow(ctx, mapB, 0, PED0 + 4.2, 3.6, TRIM, TRIM_E, DS + 0.4));
    out.push(roundWindow(ctx, mapB, 0, PED0 + 4.2, 3.0, "#2f3a40", TRIM_E, DS + 0.42));
    out.push(panel(ctx, mapB, -0.2, 0.2, PED0 + 4.2, PED0 + 6.6, TRIM, null, DS + 0.44));
    out.push(panel(ctx, mapB, 0, 2.0, PED0 + 4.0, PED0 + 4.4, TRIM, null, DS + 0.44));

    out = out.concat(box(ctx, tx0 + 2.4, tx1 - 2.4, ty0 + 2.4, ty1 - 2.4,
                         PED0, PED1, TRIM, TRIM_E, null, DS + 1e5).parts);
    out = out.concat(balustrade(ctx, function (u, z) { return P(u, ty1 - 2.4, z); },
                                tx0 + 2.4, tx1 - 2.4, PED1, PED1 + 3.4, TRIM, TRIM_E, DS + 2e5));

    /* the three published octagons, each tapering, each with its own cornice
       so it reads as a STAGE and not as a length of cone */
    var stg = [[O1, O2, 8.0, 6.6], [O2, O3, 6.4, 5.2], [O3, OT, 5.0, 3.9]];
    stg.forEach(function (s, k) {
      var d = DS + 3e5 + k * 1e4;
      out = out.concat(octStage(ctx, 0, ty1 - 3.6, s[2], s[3], s[0], s[1] - 1.6, TRIM, TRIM_E, d));
      out = out.concat(octStage(ctx, 0, ty1 - 3.6, s[3] + 1.1, s[3] + 1.1,
                                s[1] - 1.6, s[1], TRIM_D, TRIM_E, d + 200));
      /* a round window on the facets that face us, which is what the older
         description gives every octagon */
      out.push(roundWindow(ctx, function (u, z) { return P(u, ty1 - 3.6 + s[2] * 0.92, z); },
                           0, s[0] + (s[1] - s[0]) * 0.45, s[2] * 0.30, "#2f3a40", TRIM_E, d + 400));
    });

    /* THE PUBLISHED SPIRE: twenty feet of copper, and the gilded Drowne vane
       on top of it. CHECKLIST 9, the thing a visitor names. */
    out = out.concat(octSpire(ctx, 0, ty1 - 3.6, 3.9, OT, SPIRE - 3, COPPER, COPPER_E));
    out = out.concat(octStage(ctx, 0, ty1 - 3.6, 1.5, 1.5, OT + 9, OT + 10.2,
                              COPPER_D, COPPER_E, DS + 9e5));
    out = out.concat(octStage(ctx, 0, ty1 - 3.6, 1.0, 1.0, SPIRE - 3, SPIRE - 1.4,
                              GOLD, GOLD_E, DS + 9.4e5));
    out.push({ svg: ctx.poly([P(-0.35, ty1 - 3.6, SPIRE - 1.4), P(0.35, ty1 - 3.6, SPIRE - 1.4),
                              P(0.35, ty1 - 3.6, SPIRE), P(-0.35, ty1 - 3.6, SPIRE)],
                             GOLD, GOLD_E, 0.4), depth: DS + 9.5e5 });
    out.push({ svg: ctx.poly([P(-0.3, ty1 - 3.6, SPIRE - 0.2), P(5.4, ty1 - 3.6, SPIRE - 1.4),
                              P(5.4, ty1 - 3.6, SPIRE + 0.4), P(-0.3, ty1 - 3.6, SPIRE + 1.2)],
                             GOLD, GOLD_E, 0.4), depth: DS + 9.6e5 });
    return out;
  }

  window.TRAIL_FORMS = window.TRAIL_FORMS || {};
  window.TRAIL_FORMS["old-south"] = oldSouth;
})();
