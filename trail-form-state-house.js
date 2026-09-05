/* ---------------- Stop 2: the Massachusetts State House ----------------
   Charles Bulfinch, 1795 to 1798. Federal. Rebuilt to MODEL_STANDARD.md,
   2026-09-05, by the landmark routine.

   PUBLISHED, and unusually complete, because the building described itself
   the week it opened. The Columbian Centinel of 10 January 1798, reproduced
   in the National Historic Landmark nomination (NRHP 66000771):

     "an oblong building, 173 feet front, and 61 deep, it consists
      externally of a basement story, 20 feet high, and a principal story 30
      feet. This in the center of the front south is crowned with an Attic 60
      feet wide, 20 feet high, which is covered with a pediment: Immediately
      above this rises a dome 50 feet diameter and 30 feet high, the whole
      terminated with an elegant circular lanthorn, supporting a gilt pine
      cone ... The basement story is finished plain on the wings with square
      windows. The centre (portico of the south front) is 94 feet in length,
      and formed of arches which project 14 feet; they form a covered wall
      below, and support a Colonade of Corinthian columns of the same extent
      above. The outside walls are of large patent bricks, with white marble
      fascias, imposts and key stones."

   CHECKED THIS RUN, and reported as a negative rather than left to look like
   an omission: the Wikipedia article on the Massachusetts State House
   publishes NO dimension at all, no width, depth, storey height, dome
   diameter, column count or total height. What it does carry, and what this
   model leans on for checklist item 9, is that the dome is GILDED and has
   been re-gilded twice in living memory, "in 1969, at a cost of $36,000" and
   again "in July 1997" for "around $300,000". The gold dome is the one thing
   a visitor names, so it is drawn large, first in the eye, and finished with
   the published gilt pine cone.

   COUNTED, because the 1798 writer gave extents and not counts, and a
   photograph is a published document too. From a frontal view on Wikimedia
   Commons: SEVEN arches in the arcade, TWELVE Corinthian columns above them
   COUPLED IN PAIRS at both ends with four singles between, and THREE bays to
   each wing. The counts check the dimensions rather than contradicting them:
   at the scale the 94 ft colonnade sets in that photograph the pediment
   measures 60.4 ft against the published 60, and the twelve columns come out
   at 2.5 ft thick, which is the 30 inch diameter the Commonwealth gives for
   the pine logs the originals were turned from.

   DERIVED, and said out loud rather than buried: the wings are the
   subtraction (173 - 94) / 2 = 39.5 ft each; the pediment's own rise; the
   height of the lanthorn; how far back the dome sits; the three low granite
   steps at the arcade; and the whole treatment of the NORTH back wall, which
   no source reached this run describes, because the Bulfinch back was built
   over by Charles Brigham's yellow brick extension in 1895. The back here
   carries the same courses and the same bay rhythm as the front and claims
   nothing more. The often quoted 155 ft total is measured from the street at
   the bottom of the hill and is not what this model claims.

   WHY THIS FILE EXISTS, which is the whole finding of the rebuild. The scene
   it replaces had every published number right and rendered as a blank brick
   warehouse, because the portico, the arcade, the twelve columns, the wings'
   windows, the attic and the pediment were ALL drawn on the south face, the
   south face sat at -y, and at the page's own opening yaw of -0.62 the -y
   face is culled. faceVisible(0,-1) = -cos(0.62) = -0.81, so every piece of
   architecture in the model was on the side nobody could see, and what the
   reader got was the one wall that had nothing on it. This is the same trap
   Old State House sprang and recorded in trail-3d.js, and Bunker Hill and
   Old North both sprang again the day they were rebuilt. The building is
   turned so the front is at +y and faces the reader on load. */
(function () {
  var H = (window.TRAIL3D && window.TRAIL3D.helpers) || {};
  var box = H.box, panel = H.panel, ground = H.ground, archOpening = H.archOpening;
  var balustrade = H.balustrade, columnAt = H.columnAt, octStage = H.octStage;
  var domeCap = H.domeCap, octSpire = H.octSpire, depthOf = H.depthOf;

  function stateHouse(ctx) {
    /* two tones per material, checklist item 5: BRICK against BRICK_D for the
       course banding, TRIM against TRIM_D for the marble, GOLD against
       GOLD_D for the leaf. ctx.shade then works the face normals on top. */
    var BRICK = "#a8523c", BRICK_D = "#9c4b37", BRICK_E = "#7a3527";
    var TRIM = "#f4f0e6", TRIM_D = "#e2dccd", TRIM_E = "#b0a897";
    var GOLD = "#cea52a", GOLD_D = "#a9821c", GOLD_E = "#7d6414";
    var GLASS = "#3a4750", DOOR = "#4a3a30", GRANITE = "#b6b2a7", GRANITE_E = "#8b8779";
    var LAWN = "#c2c9b4", PAVE = "#ded8cb", SHADOW = "#a9ae9c";
    var out = [], P = ctx.project;

    /* the published plan. FRONT AT +y, so the page opens on the portico. */
    var W = 173, D = 61, PORT = 94, PROJ = 14, ATT = 60;
    var x0 = -W / 2, x1 = W / 2, yB = -D / 2, yF = D / 2;
    var px0 = -PORT / 2, px1 = PORT / 2, pyF = yF + PROJ;

    /* the published elevation: 20 ft basement, 30 ft principal story. 20 + 30
       = 50 to the main cornice, which is arithmetic and not a proportion. */
    var BASE = 20, PRIN = 50, CORN = 55;
    var ATT0 = 50, ATT1 = 70, PED = 80;        /* attic 20 ft; pediment derived */
    var DOME0 = 72, DOME_H = 30, DOME_R = 25;  /* dome 50 ft across, 30 ft high */
    var DCY = yF - 27;                          /* how far back the dome sits: derived */

    out.push(ground(ctx, 0, 6, 300, 260, 0, LAWN, "#a8b09a"));
    out.push(ground(ctx, 0, pyF + 24, 150, 44, 0.3, PAVE, "#bfb9aa"));

    /* CHECKLIST 6: a ground shadow. Nothing in this renderer casts light, so
       a building without one floats, and the old scene floated. Cast away
       from LIGHT = [0.60, 0.30, 0.68], so down and to the left in plan. */
    (function () {
      var q = [P(x0 - 9, yB - 5, 0.1), P(x1 - 5, yB - 5, 0.1),
               P(x1 - 5, pyF - 4, 0.1), P(x0 - 9, pyF - 4, 0.1)];
      out.push({ svg: ctx.poly(q, SHADOW, null, 0), depth: -9e8 });
    })();

    /* CHECKLIST 3: a base. A granite water table the brick stands on, so the
       walls do not grow straight out of the lawn. */
    out = out.concat(box(ctx, x0 - 1.2, x1 + 1.2, yB - 1.2, yF + 1.2, 0, 2.4,
                         GRANITE, GRANITE_E, null, -8e8).parts);

    var body = box(ctx, x0, x1, yB, yF, 2.4, PRIN, BRICK, BRICK_E, "#8d8478");
    out = out.concat(body.parts);

    /* CHECKLIST 5: the brick's second tone, as course banding. A texture, not
       a count: nothing published gives a course height, so this claims a
       masonry surface and no more. Struck on every visible brick face. */
    function courses(map, u0, u1, z0, z1, d) {
      for (var z = z0 + 3.2; z < z1 - 1.2; z += 3.2) {
        out.push(panel(ctx, map, u0, u1, z, z + 0.5, BRICK_D, null, d + 0.05));
      }
    }
    /* CHECKLIST 8: an opening has to survive map scale, so every window gets
       a light marble surround struck first and the dark glass struck inside
       it. A window one tone off its wall disappears at 900 pixels; this is
       the difference between a Federal window and a stain. */
    function sash(map, uc, hw, z0, z1, d, fill) {
      out.push(panel(ctx, map, uc - hw - 0.9, uc + hw + 0.9, z0 - 0.9, z1 + 1.4,
                     TRIM, TRIM_E, d + 0.35));
      out.push(panel(ctx, map, uc - hw, uc + hw, z0, z1, fill || GLASS, TRIM_E, d + 0.4));
    }
    function archSash(map, uc, hw, zBase, zSpring, d, fill) {
      out.push(archOpening(ctx, map, uc, hw + 0.9, zBase - 0.6, zSpring, TRIM, TRIM_E, d + 0.35));
      out.push(archOpening(ctx, map, uc, hw, zBase, zSpring, fill || GLASS, TRIM_E, d + 0.4));
    }

    /* THE FRONT. The wings take three bays each, square windows below and
       tall round headed ones above, which is exactly what the 1798 notice
       describes; the centre 94 ft stands behind the colonnade. */
    var dF = body.walls["0,1"];
    if (dF !== undefined) {
      var mapF = function (u, z) { return P(u, yF, z); };
      courses(mapF, x0, x1, 2.4, PRIN, dF);
      [[x0, px0], [px1, x1]].forEach(function (wing) {
        var a = wing[0], b = wing[1], step = (b - a) / 3;
        for (var i = 0; i < 3; i++) {
          var uc = a + step * (i + 0.5);
          sash(mapF, uc, 3.2, 6, 15.5, dF);
          archSash(mapF, uc, 3.6, 25, 35, dF);
        }
      });
      /* the five tall centre windows, at the WALL's depth so the columns in
         front of them paint over them, which is what a colonnade does */
      for (var c = 0; c < 5; c++) {
        var cxw = px0 + PORT * (c + 0.5) / 5;
        sash(mapF, cxw, 3.6, 25, 41, dF);
        archSash(mapF, cxw, 2.6, 43.5, 46.5, dF);
      }
      /* CHECKLIST 2: the horizontal breaks, each its own thin slab. The
         published "white marble fascias" are these: a string course on the
         storey line at the published 20 ft, and the main cornice at the
         published 50, in two courses so it reads as a moulding and not as a
         stripe. Then the balustraded parapet above it. */
      out.push(panel(ctx, mapF, x0, x1, BASE, BASE + 1.5, TRIM, TRIM_E, dF + 0.6));
      out.push(panel(ctx, mapF, x0, x1, BASE + 1.5, BASE + 2.1, TRIM_D, TRIM_E, dF + 0.6));
      out.push(panel(ctx, mapF, x0, x1, PRIN - 2.6, PRIN - 1.4, TRIM_D, TRIM_E, dF + 0.6));
      out.push(panel(ctx, mapF, x0 - 0.8, x1 + 0.8, PRIN - 1.4, PRIN, TRIM, TRIM_E, dF + 0.6));
      [[x0, px0], [px1, x1]].forEach(function (wing) {
        out = out.concat(balustrade(ctx, mapF, wing[0] + 1, wing[1] - 1, PRIN, CORN,
                                    TRIM, TRIM_E, dF + 0.7));
      });
    }

    /* THE BACK, and the two 61 ft ends. Same courses, same cornice, same
       parapet, and a bay rhythm carried round at the front's own module.
       DERIVED: see the header. Drawn because a building with three blank
       elevations is not a building, and claimed as nothing more than that. */
    var dB = body.walls["0,-1"];
    if (dB !== undefined) {
      var mapB = function (u, z) { return P(u, yB, z); };
      courses(mapB, x0, x1, 2.4, PRIN, dB);
      for (var k = 0; k < 13; k++) {
        var ub = x0 + W * (k + 0.5) / 13;
        sash(mapB, ub, 3.0, 6, 15.5, dB);
        archSash(mapB, ub, 3.4, 25, 35, dB);
      }
      out.push(panel(ctx, mapB, x0, x1, BASE, BASE + 1.5, TRIM, TRIM_E, dB + 0.6));
      out.push(panel(ctx, mapB, x0 - 0.8, x1 + 0.8, PRIN - 1.4, PRIN, TRIM, TRIM_E, dB + 0.6));
      out = out.concat(balustrade(ctx, mapB, x0 + 1, x1 - 1, PRIN, CORN, TRIM, TRIM_E, dB + 0.7));
    }
    [[-1, x0], [1, x1]].forEach(function (side) {
      var d = body.walls[side[0] + ",0"];
      if (d === undefined) return;
      var X = side[1];
      var map = function (u, z) { return P(X, u, z); };
      courses(map, yB, yF, 2.4, PRIN, d);
      for (var i = 0; i < 4; i++) {
        var yc = yB + D * (i + 0.5) / 4;
        sash(map, yc, 3.0, 6, 15.5, d);
        archSash(map, yc, 3.4, 25, 35, d);
      }
      out.push(panel(ctx, map, yB, yF, BASE, BASE + 1.5, TRIM, TRIM_E, d + 0.6));
      out.push(panel(ctx, map, yB, yF, PRIN - 2.6, PRIN - 1.4, TRIM_D, TRIM_E, d + 0.6));
      out.push(panel(ctx, map, yB - 0.8, yF + 0.8, PRIN - 1.4, PRIN, TRIM, TRIM_E, d + 0.6));
      out = out.concat(balustrade(ctx, map, yB + 1, yF - 1, PRIN, CORN, TRIM, TRIM_E, d + 0.7));
    });

    /* CHECKLIST 4, said out loud rather than fixed: the main block really
       does end in a FLAT roof behind that balustraded parapet. The roof the
       eye is meant to find on this building is the dome, and the parapet is
       what hides everything else. So the lid stays a lid, and the statement
       is here instead of a pitch that is not there. */

    /* THE PORTICO: 94 ft long, projecting the published 14, at an explicit
       depth because it stands in front of a wall 173 ft wide whose nearest
       corner sorts much nearer than anything in the middle of it. */
    var ARC = 4e5;
    /* three low granite steps to the arcade floor. DERIVED: no source reached
       this run gives a tread count. Checklist 3, at the one place a visitor
       actually walks in. */
    for (var st = 0; st < 3; st++) {
      out = out.concat(box(ctx, px0 - 6 + st * 2, px1 + 6 - st * 2, pyF + 6 - st * 2, pyF,
                           0.3 + st * 0.7, 1.0 + st * 0.7, GRANITE, GRANITE_E, GRANITE,
                           ARC - 100 + st).parts);
    }
    var arc = box(ctx, px0, px1, yF, pyF, 2.4, BASE, BRICK, BRICK_E, TRIM, ARC);
    out = out.concat(arc.parts);
    var mapA = function (u, z) { return P(u, pyF, z); };
    var abay = PORT / 7;
    /* Guarded on the arcade's OWN front normal. archOpening and panel do not
       cull themselves, so drawn unguarded these seven arches paint through
       the back of a 173 ft building and stand in the sky behind it. */
    if (ctx.faceVisible(0, 1)) {
      courses(mapA, px0, px1, 2.4, BASE, ARC);
      for (var i = 0; i < 7; i++) {
        var uc = px0 + abay * (i + 0.5);
        /* the published white marble imposts and key stones: the surround is
           struck first and the void inside it second, so an arch reads as an
           opening in masonry rather than as a dark patch */
        out.push(archOpening(ctx, mapA, uc, abay * 0.34 + 1.1, 2.0, 14, TRIM, TRIM_E, ARC + 0.4));
        out.push(archOpening(ctx, mapA, uc, abay * 0.34, 2.4, 14, i === 3 ? DOOR : "#2c343a",
                             TRIM_E, ARC + 0.5));
        out.push(panel(ctx, mapA, uc - abay / 2 - 1, uc - abay / 2 + 1, 15.6, 17.6,
                       TRIM, TRIM_E, ARC + 0.5));
      }
      out.push(panel(ctx, mapA, px0, px1, BASE - 2.4, BASE - 1.4, TRIM_D, TRIM_E, ARC + 0.6));
      out.push(panel(ctx, mapA, px0 - 0.8, px1 + 0.8, BASE - 1.4, BASE, TRIM, TRIM_E, ARC + 0.6));
    }

    /* TWELVE COLUMNS, coupled in pairs at each end, four singles between.
       CHECKLIST 1: columns drawn as columns, each with its own capital, which
       is what columnAt builds. The pair spacing and the single spacing are
       both measured off the frontal photograph and then scaled by the
       published 94 ft, so the rhythm is the building's own. */
    var COL = 5e5, cyC = (yF + pyF) / 2 + 2.5, R = 1.25;
    var us = [], gap = 11.4, pairGap = 3.8;
    var left = px0 + 2.2;
    us.push(left, left + pairGap, left + pairGap + gap, left + 2 * pairGap + gap);
    var mid0 = us[3] + gap;
    for (var s = 0; s < 4; s++) us.push(mid0 + gap * s);
    var right = px1 - 2.2;
    us.push(right - 2 * pairGap - gap, right - pairGap - gap, right - pairGap, right);
    us.forEach(function (u, i) {
      out = out.concat(columnAt(ctx, u, cyC, R, BASE, PRIN, TRIM, TRIM_E, COL + i * 3));
    });
    /* the entablature the colonnade carries, over the whole published 94 ft,
       in an architrave course and a crowning cornice rather than one slab */
    out = out.concat(box(ctx, px0, px1, cyC - 2.4, cyC + 2.4, PRIN, PRIN + 2.4,
                         TRIM_D, TRIM_E, TRIM_D, 6e5).parts);
    out = out.concat(box(ctx, px0 - 1, px1 + 1, cyC - 3.2, cyC + 3.2, PRIN + 2.4, CORN,
                         TRIM, TRIM_E, TRIM, 6e5 + 50).parts);

    /* THE ATTIC, the published 60 ft wide and 20 high, with the pediment. */
    var ATTD = 7e5;
    var att = box(ctx, -ATT / 2, ATT / 2, yF - 16, yF, ATT0, ATT1, BRICK, BRICK_E, TRIM, ATTD);
    out = out.concat(att.parts);
    var mapT = function (u, z) { return P(u, yF, z); };
    if (ctx.faceVisible(0, 1)) {
      courses(mapT, -ATT / 2, ATT / 2, ATT0, ATT1, ATTD);
      out.push(panel(ctx, mapT, -ATT / 2, ATT / 2, ATT0, ATT0 + 1.8, TRIM, TRIM_E, ATTD + 0.5));
      for (var w = 0; w < 5; w++) {
        var ux = -ATT / 2 + ATT * (w + 0.5) / 5;
        sash(mapT, ux, 3.4, ATT1 - 13, ATT1 - 5, ATTD + 0.2);
      }
    }

    /* THE GOLD DOME, checklist item 9 and the thing every visitor names:
       the published 50 ft across and 30 ft high, springing above the attic.
       Drawn BEFORE the pediment on purpose. The pediment stands in front of
       it and has to paint last, or the gilt bulges through the brick. */
    out = out.concat(octStage(ctx, 0, DCY, DOME_R + 2.6, DOME_R + 2.6, ATT1 - 2, DOME0,
                              TRIM, TRIM_E, 9e5));      /* the drum the dome sits on */
    out = out.concat(octStage(ctx, 0, DCY, DOME_R + 3.4, DOME_R + 3.4, DOME0 - 1.6, DOME0,
                              TRIM_D, TRIM_E, 9.5e5));   /* its cornice */
    out = out.concat(domeCap(ctx, 0, DCY, DOME_R, DOME0, DOME_H, GOLD, GOLD_E, 1e6));
    /* the leaf's second tone: a gilded dome is ribbed, and one flat gold
       reads as a brass bowl */
    out = out.concat(octStage(ctx, 0, DCY, DOME_R * 0.72, DOME_R * 0.70,
                              DOME0 + DOME_H * 0.62, DOME0 + DOME_H * 0.66,
                              GOLD_D, GOLD_E, 1.4e6));

    /* the pediment over the attic and in front of the dome, with its own
       raking cornice; the tympanum is brick, as the walls are */
    var PEDD = 2e6;
    if (ctx.faceVisible(0, 1)) {
      out.push({ svg: ctx.poly([P(-ATT / 2 - 2, yF, ATT1), P(ATT / 2 + 2, yF, ATT1),
                                P(0, yF, PED)],
                               ctx.shade(BRICK, 0, 1, 0.2), TRIM_E, 0.6), depth: PEDD });
      out.push({ svg: ctx.poly([P(-ATT / 2 - 3.4, yF, ATT1 - 0.4), P(ATT / 2 + 3.4, yF, ATT1 - 0.4),
                                P(ATT / 2 + 3.4, yF, ATT1 + 1.9), P(-ATT / 2 - 3.4, yF, ATT1 + 1.9)],
                               ctx.shade(TRIM, 0, 1, 0), TRIM_E, 0.5), depth: PEDD + 0.1 });
      /* the two rakes, as thin marble bands up each slope */
      [[-1, -ATT / 2 - 2], [1, ATT / 2 + 2]].forEach(function (r) {
        out.push({ svg: ctx.poly([P(r[1], yF, ATT1 + 1.0), P(0, yF, PED + 1.4),
                                  P(0, yF, PED - 0.9), P(r[1] - r[0] * 2.4, yF, ATT1 + 1.0)],
                                 ctx.shade(TRIM, 0, 1, 0), TRIM_E, 0.4), depth: PEDD + 0.2 });
      });
    }

    /* the balustraded ring at the top of the dome, the published "elegant
       circular lanthorn", and the published "gilt pine cone" that stands for
       the Commonwealth's timber trade */
    var LZ = DOME0 + DOME_H, LD = 3e6;
    out = out.concat(octStage(ctx, 0, DCY, 8.4, 8.4, LZ - 1.5, LZ + 1.6, TRIM, TRIM_E, LD));
    out = out.concat(octStage(ctx, 0, DCY, 5.4, 5.0, LZ + 1.6, LZ + 13, TRIM, TRIM_E, LD + 10));
    [[0, 1], [1, 0], [-1, 0]].forEach(function (n, i) {
      if (!ctx.faceVisible(n[0], n[1])) return;
      var map = n[0] === 0
        ? function (u, z) { return P(u, DCY + 5.2, z); }
        : function (u, z) { return P(n[0] * 5.2, u, z); };
      var c = n[0] === 0 ? 0 : DCY;
      out.push(archOpening(ctx, map, c, 1.9, LZ + 4, LZ + 8.5, "#2f3a40", TRIM_E, LD + 20 + i));
    });
    out = out.concat(octStage(ctx, 0, DCY, 6.0, 6.0, LZ + 13, LZ + 14.6, TRIM, TRIM_E, LD + 30));
    out = out.concat(domeCap(ctx, 0, DCY, 4.4, LZ + 14.6, 4.2, GOLD, GOLD_E, LD + 40));
    out = out.concat(octSpire(ctx, 0, DCY, 1.5, LZ + 18.8, LZ + 24, GOLD, GOLD_E));
    return out;
  }

  window.TRAIL_FORMS = window.TRAIL_FORMS || {};
  window.TRAIL_FORMS["state-house"] = stateHouse;
})();
