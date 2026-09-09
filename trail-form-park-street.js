/* trail-form-park-street.js - Park Street Church, Boston, Peter Banner,
 * 1809, raised to MODEL_STANDARD.md. Registers
 * window.TRAIL_FORMS["park-street"] and takes over from the SCENES entry of
 * the same name in trail-3d.js.
 *
 * WHY A REBUILD, AND WHAT IT DID NOT TOUCH. This stop was not one of the
 * boxes the standard was written against. Six earlier runs had already given
 * it published massing, the four 35 ft Doric columns as real columns, the
 * pediment, the balustrade, the bell story with its eight Ionic columns and
 * four circular windows, both octagons with their published orders, the
 * spire with Bowen's collar, and a stack that closes on the published 217 ft
 * 9 in exactly. All of that is carried over unchanged, down to the arithmetic
 * comments that explain why the unmeasured band is 22.85 ft and not 27.75.
 *
 * Three checklist items were still open, and only those three are new here.
 *   item 5, two tones per material: the 78 by 103 ft brick body was ONE
 *     brick tone, the same defect MODEL_STANDARD names by name at Old North.
 *     Course lines, a texture in the plane of the wall, claiming no count.
 *   item 8, openings that survive map scale: the body windows were glass on
 *     brick with a hairline between. Each now has the reveal a two foot wall
 *     gives it, struck in a darker brick.
 *   item 3, a base: the mass had its water table, but the Tremont doors
 *     opened straight off the ground. Two granite treads, declared soft.
 *
 * WHAT WAS DELIBERATELY NOT ADDED, and this is the point of reading
 * STYLES.md before drawing. The obvious move on a two storey brick church is
 * a belt course between the ranks of window, and Old North has one. This
 * building must not. STYLES.md, "The Federal spired tower", is explicit: the
 * flanks get "a water table below and a cornice at the eaves and nothing
 * between", and it lists "the flanks are ornamented like the front" under
 * Wrong if. The ornament of this church is spent on the Tremont end, which
 * is where the columns and the pediment already are. So the brick gets
 * texture and depth, and no new mouldings.
 *
 * PUBLISHED NUMBERS, unchanged from the scene this replaces and repeated
 * here so the file stands alone:
 *   Bowen, Picture of Boston, 1833, quoted in the 1903 preservation
 *   pamphlet: tower 72 ft high, 27 by 31 ft in breadth, Doric, four columns
 *   of 35 ft, crowned by a pediment and balustrade; bell story 20 ft square
 *   and 8 ft high, four large circular windows, eight Ionic columns on
 *   pedestals; octagon 25 ft high and 16 ft from side to side, four circular
 *   windows, eight Corinthian columns; second octagon 20 ft high, 12 ft 6 in
 *   from side to side, Composite; spire base 11 ft from side to side and 9 ft
 *   high, eight oval windows; spire 50 ft, 9 ft 6 in at its base diminishing
 *   to 18 in, a collar midway; a ball 6 ft above; the vane, a blazing star,
 *   at 217 ft 9 in from the street.
 *   Sanborn fire insurance atlas of Boston, 1885, sheet 12, lettered on the
 *   plan: 40 ft to the eaves, 2 storeys, and a fire risk note SPIRE 200'
 *   which is recorded as corroboration and never averaged with Bowen.
 *   The deed, quoted in the same pamphlet: the lot, 80 ft on Tremont by 118
 *   ft on Park.
 *   SCALED off that plan at 6.04 px per foot and declared scaled, not
 *   published: about 78 ft across the front, about 103 ft deep, a
 *   semicircular east end of about 39 ft radius. They are trusted because
 *   they fit inside the published lot with a foot to spare.
 *
 * NAMED GAPS, carried forward: no published roof pitch, so the model stops
 * at the published eaves and closes with a lead grey stopping plane; no
 * published window count, size or sill height on the body, so the two ranks
 * follow the bays and are declared soft; no published column diameter, so it
 * is proportioned from the published 35 ft height; no published step count.
 */
(function () {
  var T = (typeof window !== "undefined" && window.TRAIL3D) || null;
  if (!T || !T.helpers) return;
  var H = T.helpers;
  var ground = H.ground, slab = H.slab, box = H.box, archOpening = H.archOpening,
      roundWindow = H.roundWindow, octStage = H.octStage, octDetail = H.octDetail,
      columnAt = H.columnAt, balustrade = H.balustrade,
      wallRun = H.wallRun, apseRun = H.apseRun, shadow = H.shadow;

  function parkStreet(ctx) {
    var BRICK = "#9a4b3a", BRICK_E = "#6d3327", BRICK_D = "#89412f";
    var REVEAL = "#5d2f24", GRANITE = "#cfcabd", GRANITE_E = "#9d988c";
    var TRIM = "#f2ede1", TRIM_E = "#b9b0a0", TRIM_D = "#e2dbcb";
    var GLASS = "#3f4d55", GOLD = "#c9a22c", GOLD_E = "#8a6f18";
    var PAVE = "#ded8cb", GRASS = "#c2c9b4", STONE = "#c9c4b8";
    /* the stopping plane at the eaves is a LEAD grey, deliberately not a warm
       roofing brown: it is where the evidence runs out, and it should not
       compete with the steeple that is the landmark. */
    var DECK = "#8e8a7e";
    var out = [];

    /* PLAN, published: 27 across the Tremont front, 31 into the block. */
    var TW = 27, TD = 31;
    var x0 = -TW / 2, x1 = TW / 2, y0 = -TD / 2, y1 = TD / 2;
    var cy = 0;

    /* ================= THE BRICK BODY =================
       Five earlier runs left this building as a steeple standing on nothing,
       because no source published the meeting house. The Sanborn fire
       insurance atlas of Boston, 1885, sheet 12 (Library of Congress IIIF,
       file 1885-0012R) turned out to letter two of the numbers on the plan
       itself, and to give a plan good enough to measure the rest:

         PUBLISHED, lettered on the sheet beside the building
           40' TO EAVES     the height of the brick body
           2                two storeys, in the plan's own storey notation
           SPIRE 200'       a rounded fire-risk note. NOT a rival to Bowen's
                            217 ft 9 in and not averaged with it; recorded as
                            independent corroboration and nothing is changed.

         PUBLISHED, from the deed quoted in the 1903 pamphlet
           the lot, 80 ft on Tremont by 118 ft on Park.

         SCALED off the plan, and DECLARED SCALED rather than published. The
         sheet letters no dimension on the walls, so the outline was measured
         against the sheet's own scale bar at 6.04 px per foot (a 302 dpi scan
         of a printed 50 ft to the inch, confirmed twice):
           about 78 ft across the front, Park Street wall to Granary wall
           about 103 ft from the west wall to the eastern extremity
           a semicircular east end of radius about 39 ft, springing where the
             straight walls stop, which the drawing's own offsets confirm.

       THE SCALED FIGURES CHECK AGAINST THE PUBLISHED LOT, which is why they
       are trusted enough to draw: 78 by 103 sits inside 80 by 118 with a foot
       to spare across the front and room for an areaway behind. A measurement
       that had to be squeezed into the deed would have been thrown away.

       WHAT IS STILL NOT KNOWN, and is therefore not drawn: the roof. A
       Sanborn is orthographic and publishes no pitch, and no other source
       carries one. The model stops at the published 40 ft eaves line. */
    var P = ctx.project;
    var BODY_W = 78, BODY_LEN = 103, APSE_R = 39, EAVE = 40;
    var bx0 = -BODY_W / 2, bx1 = BODY_W / 2;
    var by0 = y0;                          /* west wall in the tower's plane */
    var byS = by0 + (BODY_LEN - APSE_R);   /* where the round end springs */
    var BZ0 = 1.6, midY = by0 + BODY_LEN / 2;

    /* the corner it stands on, paved to the PUBLISHED LOT. The deed gives the
       lot's size and not where in it the church sits, so the lot is centred
       on the measured footprint and that centring is the one soft thing here.
       Ground planes take an explicit far depth through ground(), which is why
       they never paint over the building. */
    out.push(ground(ctx, 0, midY, 150, 172, 0, GRASS, "#a8b09a"));
    out.push(ground(ctx, 0, midY, 80, 118, 0.4, PAVE, "#bfb9aa"));

    /* CHECKLIST 6, added 2026-09-05 by the landmark routine: a ground
       shadow, thrown away from LIGHT = [0.60,0.30,0.68], so down and to the
       left in plan. Nothing in this renderer casts light, so a building
       without one floats, and this one did.

       The surrounding pad came down from 320 ft square at the same time.
       That is the Bunker Hill and Old South lesson a third time: the stage
       fits itself to everything the scene draws, ground included, so a pad
       four times the building's own lot was setting the frame and shrinking
       a 217 ft steeple to a stamp in the middle of an empty green. The
       PUBLISHED lot, 80 by 118, is untouched; only the grass around it
       moved, and no published dimension is involved in it either way. */
    (function () {
      /* PAID 2026-09-09, and the OWED note's own diagnosis was incomplete.
         It recorded "a thin band on the -x side rather than a shadow" and
         blamed the light's direction. The direction was the one correct
         thing here: the sun is off +x,+y and the shadow does go to -x,-y.
         What the RENDER showed, cropped to the base, was the apse standing
         OFF the mat: the shadow was an axis-aligned rectangle inset four
         feet inside the +x wall and five feet short of the apse tip, so the
         round east end -- half this building's plan -- overhung it and met
         bright pavement with nothing under it. A rectangle cannot be the
         shadow of a building with a semicircular end.
         It now takes the real FOOTPRINT, walls plus the one foot of water
         table, the straight bays and then the apse swept as an arc, and the
         shared helper sweeps that outline along the light by 0.9 of the
         40 ft eaves. Touching the base is a property of the sweep, not of a
         chosen offset, so the gap cannot come back. */
      var WT = 1.0;      /* the water table, one foot proud; PL below is the
                            same foot, declared after this block, so it is
                            written out here rather than read before it is set */
      var foot = [[bx0 - WT, by0 - WT], [bx1 + WT, by0 - WT]];
      for (var a = 0; a <= 18; a++) {
        var t = (a / 18) * Math.PI;                 /* 0 at +x, PI at -x */
        foot.push([(APSE_R + WT) * Math.cos(t), byS + (APSE_R + WT) * Math.sin(t)]);
      }
      out.push(shadow(ctx, foot, EAVE, 0.15));
    })();

    /* the water table, one foot proud of the wall and one foot of stone */
    var PL = 1.0;
    out = out.concat(wallRun(ctx, "x", by0 - PL, bx0 - PL, bx1 + PL, 0.4, BZ0, 0, -1, STONE, "#9d988c", 4).parts);
    out = out.concat(wallRun(ctx, "y", bx0 - PL, by0 - PL, byS, 0.4, BZ0, -1, 0, STONE, "#9d988c", 5).parts);
    out = out.concat(wallRun(ctx, "y", bx1 + PL, by0 - PL, byS, 0.4, BZ0, 1, 0, STONE, "#9d988c", 5).parts);
    out = out.concat(apseRun(ctx, 0, byS, APSE_R + PL, 0.4, BZ0, STONE, "#9d988c", 14).parts);

    /* THE WEST FRONT IS DRAWN IN TWO PANELS with the tower's own 27 ft left
       out from between them. The plan is a single outline and the tower
       stands inside it, so a full width wall here would put a 78 ft sheet of
       brick in the same plane as the tower's door and the sort would decide
       which of them the reader sees. Declining to draw wall where the plan
       has tower is not an invention. */
    var runs = [];
    runs.push(wallRun(ctx, "x", by0, bx0, x0, BZ0, EAVE, 0, -1, BRICK, BRICK_E, 2));
    runs.push(wallRun(ctx, "x", by0, x1, bx1, BZ0, EAVE, 0, -1, BRICK, BRICK_E, 2));
    runs.push(wallRun(ctx, "y", bx0, by0, byS, BZ0, EAVE, -1, 0, BRICK, BRICK_E, 5));
    runs.push(wallRun(ctx, "y", bx1, by0, byS, BZ0, EAVE, 1, 0, BRICK, BRICK_E, 5));
    runs.forEach(function (r) { out = out.concat(r.parts); });
    var round = apseRun(ctx, 0, byS, APSE_R, BZ0, EAVE, BRICK, BRICK_E, 12);
    out = out.concat(round.parts);

    /* THE BRICK ITSELF. MODEL_STANDARD item 5 names the defect this fixes by
       name, on the neighbouring church: "one brick tone". Seventy-eight feet
       of wall in a single fill is a red panel, not brickwork. Drawn as a
       faint darker course line every two feet on every bay this renderer has
       already decided is visible, and on the apse facets too.

       IT IS A TEXTURE AND CLAIMS NO COUNT. Nine courses to the foot is the
       ordinary English figure and no source publishes this building's; the
       lines here are one per two feet, which is a reading of light and not a
       count of bricks. It also adds NO ornament and no projection, which
       matters, because STYLES.md is explicit that this building's flanks
       carry "a water table below and a cornice at the eaves and nothing
       between", and a belt course here would be the style error the entry
       warns about. A course line lies in the plane of the wall. */
    function coursing(f, nx, ny) {
      var u0 = f.uc - f.half, u1 = f.uc + f.half;
      for (var z = BZ0 + 2.4; z < EAVE - 2.6; z += 2.0) {
        out.push({ svg: ctx.poly([f.map(u0, z), f.map(u1, z),
                                  f.map(u1, z + 0.22), f.map(u0, z + 0.22)],
                                 ctx.shade(BRICK_D, nx, ny, 0), null, 0),
                   depth: f.depth + 0.05 });
      }
    }

    /* TWO STOREYS, which the plan letters as a plain 2, so the body carries
       two ranks of window and not three. They are round headed because that
       is what this building's flanks carry. Their SIZE and their NUMBER are
       published nowhere and are not on the plan: they follow the bays, and
       the bays were chosen for depth sorting. Declared soft, exactly like the
       column diameters in the tower above. */
    function twoRanks(f) {
      var hw = Math.min(3.1, f.half * 0.42);
      if (hw < 1.2) return;
      /* A REVEAL, then the glass inside it. MODEL_STANDARD item 8: a window
         one tone off its wall disappears at map scale, and these were glass
         on brick with a hairline between them. The outer shape is the shadow
         of the opening in a two foot thick wall, struck in a darker brick
         rather than in stone, because the flanks of this church are plain
         brick and a bright surround here would ornament them. Two tones of
         difference where there was most of one. */
      [[5.5, 14.5], [21.0, 30.0]].forEach(function (r) {
        out.push(archOpening(ctx, f.map, f.uc, hw + 0.55, r[0] - 0.5, r[1],
                             ctx.shade(REVEAL, 0, 0, 0), BRICK_E, f.depth + 0.36));
        out.push(archOpening(ctx, f.map, f.uc, hw, r[0], r[1] - 0.35,
                             GLASS, TRIM_E, f.depth + 0.40));
      });
    }
    var NRM = [[0, -1], [0, -1], [-1, 0], [1, 0]];
    runs.forEach(function (r, ri) {
      r.bays.forEach(function (f) {
        coursing(f, NRM[ri][0], NRM[ri][1]);
        twoRanks(f);
      });
    });
    round.facets.forEach(function (f) {
      var am = ((f.i + 0.5) / 12) * Math.PI;
      coursing(f, Math.cos(am), Math.sin(am));
      if (f.i % 2 === 0) twoRanks(f);
    });

    /* the eaves cornice, at the published 40 ft and standing a foot proud */
    var CZ = EAVE - 1.8;
    out = out.concat(wallRun(ctx, "x", by0 - PL, bx0 - PL, bx1 + PL, CZ, EAVE, 0, -1, TRIM_D, TRIM_E, 4).parts);
    out = out.concat(wallRun(ctx, "y", bx0 - PL, by0 - PL, byS, CZ, EAVE, -1, 0, TRIM_D, TRIM_E, 5).parts);
    out = out.concat(wallRun(ctx, "y", bx1 + PL, by0 - PL, byS, CZ, EAVE, 1, 0, TRIM_D, TRIM_E, 5).parts);
    out = out.concat(apseRun(ctx, 0, byS, APSE_R + PL, CZ, EAVE, TRIM_D, TRIM_E, 14).parts);

    /* THE ROOF IS NOT DRAWN and the deck that closes the walls is a STOPPING
       PLANE, not a claim that this church is flat roofed. It is where the
       evidence stops. The deck is traced AROUND the tower rather than across
       it, so the two never contend for the same pixels at the same depth. */
    var deck = [P(bx0, by0, EAVE), P(x0, by0, EAVE), P(x0, y1, EAVE),
                P(x1, y1, EAVE), P(x1, by0, EAVE), P(bx1, by0, EAVE)];
    for (var dk = 0; dk <= 18; dk++) {
      var ad = (dk / 18) * Math.PI;
      deck.push(P(APSE_R * Math.cos(ad), byS + APSE_R * Math.sin(ad), EAVE));
    }
    /* AND ITS DEPTH IS EXPLICIT, which the render is the reason for. Sorted
       on its own corners the deck took the depth of its NEAREST corner, the
       west end beside the tower, and then painted its far half straight over
       the tower's front, eating the pediment and the tops of the four
       published columns. The arithmetic passed it; one look did not. The deck
       lies behind every wall that is drawn, because an inward facing wall is
       culled and never reaches the sort, so it is given a depth below all of
       them and painted first. */
    out.push({ svg: ctx.poly(deck, ctx.shade(DECK, 0, 0, 1), TRIM_E, 0.6),
               depth: -1e7 });
    /* ================= end of the body ================= */


    /* THE TOWER, 72 ft, Doric, brick */
    var TOP = 72;
    var tower = box(ctx, x0, x1, y0, y1, 1.6, TOP, BRICK, BRICK_E, null);
    out = out.concat(tower.parts);

    /* AND THE TOWER IS BRICK TOO. The first render of this rebuild coursed
       the body and left the tower a plain red block standing beside it, and
       from the Park Street flank the two materials read as different
       materials. They are the same brick. Same texture, same rule: in the
       plane of the wall, no projection, no count claimed. */
    function brickBox(m, z0, z1) {
      [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(function (n) {
        var d = m.walls[n[0] + "," + n[1]];
        if (d === undefined) return;
        var a = n[0] === 0 ? x0 : y0, b = n[0] === 0 ? x1 : y1;
        var at = n[0] === 0 ? (n[1] < 0 ? y0 : y1) : (n[0] < 0 ? x0 : x1);
        var map = n[0] === 0
          ? function (u, z) { return P(u, at, z); }
          : function (u, z) { return P(at, u, z); };
        for (var z = z0; z < z1; z += 2.0) {
          out.push({ svg: ctx.poly([map(a, z), map(b, z),
                                    map(b, z + 0.22), map(a, z + 0.22)],
                                   ctx.shade(BRICK_D, n[0], n[1], 0), null, 0),
                     depth: d + 0.05 });
        }
      });
    }
    brickBox(tower, 4.0, TOP - 1.0);

    /* the Tremont front: the door, and the window over it */
    if (ctx.faceVisible(0, -1)) {
      var dF = tower.walls["0,-1"];
      var mapF = function (u, z) { return ctx.project(u, y0, z); };
      /* THE STEP THE VISITOR STANDS ON. MODEL_STANDARD item 3, at the one
         place on this building where a person actually meets it: the doors
         open above the Tremont Street pavement and the model had them
         opening off the ground. Two granite treads, and their size is
         DECLARED SOFT: no source publishes a step count or a riser here, so
         nothing is claimed beyond the fact that there is a rise. Given
         depths below the ground planes' own far depth so they sit on the
         pavement rather than through it. */
      out = out.concat(slab(ctx, 0, y0 - 3.2, TW - 4, 6.4, 0.4, 0.7, GRANITE, GRANITE_E, -9.5e8));
      out = out.concat(slab(ctx, 0, y0 - 2.4, TW - 8, 4.8, 1.1, 0.6, GRANITE, GRANITE_E, -9.4e8));
      out.push(archOpening(ctx, mapF, 0, 4.2, 1.6, 13, "#4a3a30", TRIM_E, dF + 0.4));
      out.push(archOpening(ctx, mapF, 0, 3.4, 22, 30, GLASS, TRIM_E, dF + 0.4));
      out.push(archOpening(ctx, mapF, 0, 2.8, 48, 54, GLASS, TRIM_E, dF + 0.4));
    }
    /* and the same on whichever flank is turned to us */
    [[-1, x0], [1, x1]].forEach(function (side) {
      var d = tower.walls[side[0] + ",0"];
      if (d === undefined) return;
      var X = side[1];
      var map = function (u, z) { return ctx.project(X, u, z); };
      out.push(archOpening(ctx, map, cy, 3.4, 22, 30, GLASS, TRIM_E, d + 0.4));
      out.push(archOpening(ctx, map, cy, 2.8, 48, 54, GLASS, TRIM_E, d + 0.4));
    });

    /* THE FOUR COLUMNS OF 35 FEET, published, Doric, on the Tremont front.
       Diameter proportioned from the published height, and said so above. */
    var COL_R = 35 / 8 / 2;
    var ENT0 = 1.6 + 35, ENT_H = 3.2;
    if (ctx.faceVisible(0, -1)) {
      var dC = tower.walls["0,-1"];
      [-10.2, -3.4, 3.4, 10.2].forEach(function (cxq, i) {
        out = out.concat(columnAt(ctx, cxq, y0 - COL_R * 0.55, COL_R, 1.6, ENT0,
                                  TRIM, TRIM_E, dC + 1.0 + i * 0.05));
      });
      /* the entablature the four columns carry, and over it the PEDIMENT.
         Bowen's sentence puts the pediment here: the tower "ornamented with
         four columns of 35 feet, and the vestibule, is crowned by an elegant
         pediment and balustrade." So the pediment crowns the order, which is
         where a pediment belongs, rather than floating 40 ft above it. */
      out = out.concat(slab(ctx, 0, y0 - COL_R * 0.55, TW + 1.4, COL_R * 2.2,
                            ENT0, ENT_H, TRIM_D, TRIM_E, dC + 1.6));
      var Pp = ctx.project, yP = y0 - COL_R * 1.1, pz = ENT0 + ENT_H;
      var ped = [Pp(-(TW + 1.4) / 2, yP, pz), Pp((TW + 1.4) / 2, yP, pz),
                 Pp(0, yP, pz + (TW + 1.4) / 2 * 0.30)];
      out.push({ svg: ctx.poly(ped, ctx.shade(TRIM, 0, -1, 0), TRIM_E, 0.6),
                 depth: dC + 1.9 });
    }

    /* THE UNITEMISED BAND, 72 to 94.85, and ITS HEIGHT IS NOT A FREE CHOICE.
       Bowen itemises 72 + 8 + 25 + 20 + 9 + 50 + 6 = 190 ft and publishes the
       vane at 217 ft 9 in, so 27 ft 9 in is unmeasured. But this model also
       has to put a cornice between the stages Bowen describes as standing one
       on another, and those cornices (2.0 + 1.6 + 1.3 = 4.9 ft) are unmeasured
       too. They come OUT of the same 27.75, they are not added on top of it.
       An earlier version of this scene spent the whole 27.75 on the band and
       then added the cornices as well, which pushed the spire 4.9 ft too high
       and left 1.1 ft for a published 6 ft ball, so the ball was drawn upside
       down. The render showed it; the arithmetic had not.
         72 + 22.85 + 8 + 2.0 + 25 + 1.6 + 20 + 1.3 + 9 + 50 + 6 = 217.75.
       That closes on the published total exactly, with every published stage
       unrounded, and the band is the only soft number in the steeple.

       ITS INTERNAL SPLIT is soft too, and the one rule it must obey is that
       nothing floats: the attic is solid brick from the tower cornice to the
       balustrade, so the rail stands on something. */
    var BAND0 = 72, BAND1 = 94.85;
    var CORN_H = 3.4, BAL_H = 4.0;
    out = out.concat(slab(ctx, 0, cy, TW + 2.2, TD + 2.2, BAND0, CORN_H, TRIM_D, TRIM_E));

    var ATT0 = BAND0 + CORN_H, ATT1 = BAND1 - BAL_H;
    var attic = box(ctx, x0, x1, y0, y1, ATT0, ATT1, BRICK, BRICK_E, null);
    out = out.concat(attic.parts);
    brickBox(attic, ATT0 + 1.4, ATT1 - 1.0);
    /* the clock stage's one opening per visible face, round headed */
    [[0, -1], [1, 0], [-1, 0], [0, 1]].forEach(function (n) {
      var d = attic.walls[n[0] + "," + n[1]];
      if (d === undefined) return;
      var map = n[0] === 0
        ? function (u, z) { return ctx.project(u, n[1] < 0 ? y0 : y1, z); }
        : function (u, z) { return ctx.project(n[0] < 0 ? x0 : x1, u, z); };
      out.push(archOpening(ctx, map, n[0] === 0 ? 0 : cy, 3.0,
                           ATT0 + 2.4, ATT0 + 8.0, GLASS, TRIM_E, d + 0.4));
    });
    out = out.concat(slab(ctx, 0, cy, TW + 2.2, TD + 2.2, ATT1 - 1.0, 1.0, TRIM_D, TRIM_E));

    /* the balustrade, 4 ft, standing on the attic and not in the air */
    var BAL0 = ATT1, BAL1 = BAND1;
    [[0, -1], [1, 0], [-1, 0], [0, 1]].forEach(function (n) {
      var d = attic.walls[n[0] + "," + n[1]];
      if (d === undefined) return;
      var map = n[0] === 0
        ? function (u, z) { return ctx.project(u, n[1] < 0 ? y0 - 1.1 : y1 + 1.1, z); }
        : function (u, z) { return ctx.project(n[0] < 0 ? x0 - 1.1 : x1 + 1.1, u, z); };
      var a = n[0] === 0 ? x0 - 1.1 : y0 - 1.1, b = n[0] === 0 ? x1 + 1.1 : y1 + 1.1;
      out = out.concat(balustrade(ctx, map, a, b, BAL0, BAL1, TRIM, TRIM_E, d + 0.4));
    });

    /* THE BELL STORY: published 20 ft square, 8 ft high, four large circular
       windows, eight Ionic columns on pedestals, four pediments and cornices.

       THE EIGHT COLUMNS ARE PLACED ONCE, ON THE PLAN, not per visible face.
       Placing them inside the face loop put them outside the wall plane on
       the flanks, where they poked out sideways and read as brackets. Eight
       columns on a square is two to a face, set in from the corners, and the
       positions are computed here and then drawn only if their own face is
       turned to us. */
    var B0 = BAND1, B1 = B0 + 8, bw = 20, bh = bw / 2;
    var bell = box(ctx, -bh, bh, cy - bh, cy + bh, B0, B1, TRIM, TRIM_E, null);
    out = out.concat(bell.parts);

    var BELL_COLS = [];
    [[0, -1], [1, 0], [-1, 0], [0, 1]].forEach(function (n) {
      [-6.4, 6.4].forEach(function (u) {
        BELL_COLS.push(n[0] === 0
          ? { x: u, y: cy + n[1] * (bh + 0.9), n: n }
          : { x: n[0] * (bh + 0.9), y: cy + u, n: n });
      });
    });
    BELL_COLS.forEach(function (c, i) {
      var d = bell.walls[c.n[0] + "," + c.n[1]];
      if (d === undefined) return;
      out = out.concat(columnAt(ctx, c.x, c.y, 1.0, B0, B1, TRIM, TRIM_E, d + 0.8 + i * 0.02));
    });
    /* one large CIRCULAR window per face: four in all, as published, and
       circular rather than round headed because Bowen says circular */
    [[0, -1], [1, 0], [-1, 0], [0, 1]].forEach(function (n) {
      var d = bell.walls[n[0] + "," + n[1]];
      if (d === undefined) return;
      var map = n[0] === 0
        ? function (u, z) { return ctx.project(u, cy + n[1] * bh, z); }
        : function (u, z) { return ctx.project(n[0] * bh, u, z); };
      out.push(roundWindow(ctx, map, n[0] === 0 ? 0 : cy, B0 + 4.0, 2.7,
                           "#2f3a40", TRIM_E, d + 0.4));
    });
    out = out.concat(slab(ctx, 0, cy, bw + 2.6, bw + 2.6, B1, 2.0, TRIM_D, TRIM_E));

    /* THE TWO OCTAGONS, both published across the flats, so the circumradius
       is w / 2 / cos(22.5deg) and not the half width.

       EACH GETS ITS PUBLISHED WINDOWS AND COLUMNS. Drawn as bare tapers the
       two stages read as a single cone and the orders Bowen names, Corinthian
       then Composite, are the whole point of the diminishing. Four circular
       windows and eight columns on each, exactly as published. */
    function circumR(flats) { return (flats / 2) / Math.cos(Math.PI / 8); }
    var O1_0 = B1 + 2.0, O1_1 = O1_0 + 25, r1 = circumR(16);
    out = out.concat(octStage(ctx, 0, cy, r1, r1, O1_0, O1_1, TRIM, TRIM_E));
    out = out.concat(octDetail(ctx, 0, cy, r1, O1_0, O1_1, 0.85, 1.9, TRIM, TRIM_E));
    out = out.concat(octStage(ctx, 0, cy, r1 + 1.1, r1 + 1.1, O1_1, O1_1 + 1.6, TRIM_D, TRIM_E));

    var O2_0 = O1_1 + 1.6, O2_1 = O2_0 + 20, r2 = circumR(12.5);
    out = out.concat(octStage(ctx, 0, cy, r2, r2, O2_0, O2_1, TRIM, TRIM_E));
    out = out.concat(octDetail(ctx, 0, cy, r2, O2_0, O2_1, 0.7, 1.5, TRIM, TRIM_E));
    out = out.concat(octStage(ctx, 0, cy, r2 + 0.9, r2 + 0.9, O2_1, O2_1 + 1.3, TRIM_D, TRIM_E));

    /* THE SPIRE BASE: 11 ft from side to side, 9 ft high, eight oval windows */
    var S0 = O2_1 + 1.3, S1 = S0 + 9, rB = circumR(11);
    out = out.concat(octStage(ctx, 0, cy, rB, rB, S0, S1, TRIM, TRIM_E));
    out = out.concat(octDetail(ctx, 0, cy, rB, S0, S1, 0, 1.2, TRIM, TRIM_E));

    /* THE SPIRE: 50 ft, 9 ft 6 in across the base, 18 in across the top,
       with the collar Bowen puts midway. */
    var SP0 = S1, SP1 = SP0 + 50, rS = circumR(9.5), rT = circumR(1.5);
    var MID = SP0 + 25, rM = (rS + rT) / 2;
    out = out.concat(octStage(ctx, 0, cy, rS, rM, SP0, MID, TRIM, TRIM_E));
    out = out.concat(octStage(ctx, 0, cy, rM + 0.8, rM + 0.8, MID, MID + 1.1, TRIM_D, TRIM_E));
    out = out.concat(octStage(ctx, 0, cy, rM, rT, MID + 1.1, SP1, TRIM, TRIM_E));

    /* THE BALL, published at 6 ft above the spire, and the blazing star. The
       stack now leaves exactly those 6 ft, so the ball is drawn the right way
       up and the vane tops out at the published 217 ft 9 in. */
    var TOTAL = 217.75;
    out = out.concat(octStage(ctx, 0, cy, 0.55, 0.55, SP1, SP1 + 1.6, GOLD, GOLD_E));
    out = out.concat(octStage(ctx, 0, cy, 1.7, 1.7, SP1 + 1.6, SP1 + 4.0, GOLD, GOLD_E));
    out = out.concat(octStage(ctx, 0, cy, 0.45, 0.45, SP1 + 4.0, TOTAL - 2.6, GOLD, GOLD_E));
    /* the star is drawn in the vertical plane, so it is built in (x, z) */
    var Pv = ctx.project, star = [];
    for (var t = 0; t < 10; t++) {
      var a2 = -Math.PI / 2 + t * Math.PI / 5, r3 = (t % 2 === 0) ? 2.6 : 1.1;
      star.push(Pv(r3 * Math.cos(a2), cy, TOTAL - 2.6 + r3 * Math.sin(a2) + 2.6));
    }
    out.push({ svg: ctx.poly(star, GOLD, GOLD_E, 0.5), depth: 1e8 });
    return out;
  }

  window.TRAIL_FORMS = window.TRAIL_FORMS || {};
  window.TRAIL_FORMS["park-street"] = parkStreet;
})();
