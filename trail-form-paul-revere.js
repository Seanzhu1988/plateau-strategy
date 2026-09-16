/* ---------------- Stop 12: the Paul Revere House ----------------
   19 North Square, built about 1680 on the site of Increase Mather's house,
   and the oldest building still standing in downtown Boston. Revere owned it
   from 1770 to 1800 and rode out of it on the night of 18 April 1775.
   Rebuilt to MODEL_STANDARD.md, first on 2026-09-05 and again on 2026-09-15
   from the measured drawings.

   THE MEASURED DRAWINGS ARE THE AUTHORITY, and the first build did not use
   them. HABS MA-491 (Library of Congress, ma0478), surveyed summer 1979:
     sheet 1, EAST ELEVATION, scale 1/4" = 1'0", the street front
     sheet 2, FIRST FLOOR PLAN, scale 1/4" = 1'0"
     sheet 4, WEST and SOUTH ELEVATIONS; materials "roof: cedar shingles,
              walls: wood clapboards, foundation: granite fieldstone"
   and the survey's own summary: the main part "four bays wide", one room on
   each floor, "the second story featured a framed overhang", and "a two
   story ell two bays deep".

   PRINTED ON SHEET 2, so not derived:
     main block 30 ft 6 in across the front by 18 ft 2 in deep
     the front wall, south to north, as a chain of nine runs in inches:
       49 wall, 35 window, 53 wall, 35 window, 52 wall, 35 window,
       32 wall, 32 door, 43 wall = 366 in = 30 ft 6 in
     the rear wall's exposed run, from the south corner: 68 wall, 34 window,
       45 wall = 12 ft 3 in, where the kitchen ell begins
     the ell's west end 15 ft 6 in

   THE FIRST BUILD WAS WRONG ABOUT THE SIZE, and ChatGPT's WebGL rebuild of
   this stop is what caught it (audits/boston-webgl-sources.md). This file
   used Wikipedia's "30 by 48 feet" and reasoned, carefully and wrongly,
   that the street front must be the 48. The plan measures neither: the
   front is 30 ft 6 in and the main block is 18 ft 2 in deep. The house was
   drawn a third too wide and two thirds too deep, with its door in the
   wrong bay, its chimney at the wrong end and a square ell the plan shows
   is skewed. Checked against the sheets before this file changed, rather
   than taken from the WebGL layer on trust.

   SCALED FROM THE SHEETS, declared, at 7.12 px to the foot on the Library's
   1024 px scans. The scale is checked twice against printed numbers rather
   than assumed: sheet 2's 30 ft 6 in front measures 217 px, and sheet 4's
   own graphic bar runs 10 ft in 71.2 px.
   EVERY HEIGHT IS MEASURED FROM THE BOTTOM OF THE CLAPBOARD, which is the
   datum the elevations are drawn to. That sentence is the whole of the
   second review's first finding: the first build read the heights correctly
   and then started the clapboard on top of a 1.2 ft granite course anyway,
   so the first storey came out a sixth short and the two storeys differed by
   a fifth. Sheet 1 draws them EQUAL, 56 px each:
     first storey to the overhang   7 ft 10 in  (east elevation, 56 px)
     second storey, the same again  7 ft 10 in  (56 px)
     eave and garret line          15 ft  9 in  (2 x 7.87, and it measures so)
     ridge                         27 ft 11 in
     main chimney top              39 ft  7 in  (south elevation)
     ell chimney top               39 ft  2 in  (south elevation)
     ell ridge at its west gable   24 ft        (WEST elevation, seen face on)
   A 1 px reading error is 0.14 ft, so these are good to about two inches.
   WHAT CHATGPT'S LAYER HAS WRONG, found the same way: it stops both
   chimneys near 32 and 29 ft. The south elevation puts both tops near 40,
   and a second pass over the sheet confirmed 39.6 and 39.2.

   ORIENTATION. The front faces EAST onto North Square (HABS photo caption
   "the front elevation faces east"). South is on the left as you face the
   door from the street and north, with the chimney, the door and the ell,
   on the right. In this file the front is +y and north is +x. The trail
   renderer draws a mirror image of a right-handed plan and a plan laid in
   with its rear at -y is itself a mirror, so the two cancel and the reader
   sees north on the right, as the street does. Checked by rendering, not
   by the sign arithmetic alone.

   WHAT THE SHEETS SHOW THAT IS DRAWN: three paired leaded casements and the
   door on the ground floor, the door far right; three pairs and one narrow
   single casement upstairs; plain panels beside each casement; TWO framed
   overhangs on the street front, the second storey over the first and the
   garret over the second at the plate, each with a turned drop at its
   corners and the garret with its row of joist ends, which is what sheet 1
   draws and why its pendant detail is captioned TYPICAL; one sash
   window per floor on the south gable plus a small attic pair; one casement
   pair per floor on the exposed rear; the ell's sashes and door on its south
   side and its west gable; two big chimneys.
   WHAT IS NOT DRAWN, deliberately: the north side is a hatched masonry wall
   on the plan and gets no invented windows; the ell's exterior stair, the
   rear utility projection and the courtyard fence are left out; window
   sizes other than the printed 35 in openings are scaled; the ell's own
   overhang is not modelled; and the garret overhang is drawn on the street
   front only, though sheet 4 shows it returning along the south side with a
   pendant at the rear corner, because the plan does not dimension the
   return and a guessed one would change the massing.

   THE SECOND ADVERSARIAL REVIEW, 2026-09-15, read the renders back against
   the three sheets and found four real errors, all fixed above and here:
   the datum error described under SCALED; a kitchen ell whose two roof
   quads were not planar, because a level ridge was forced across a skewed
   plan by running the ell's axis BACKWARDS into the house, which walked the
   pitch from 47 to 55 degrees and let the roof paint over a third of its
   own west gable; the garret overhang missing entirely; and the ell chimney
   standing 2 to 3 ft too far down the ell. It also moved the ell's corners,
   the main stack, the rear window and the roof's overhangs onto measured
   numbers. What it checked and found already right is worth recording too:
   the nine run frontage chain inch for inch, the door's bay, the three
   casement centres, the narrow single upstairs and the side its one panel
   sits on, the rear opening being a casement and not a door, and the
   orientation. The ell ridge was the one point the south elevation could
   not settle, and the WEST elevation settles it face on at 24 ft, which the
   rebuilt roof reaches within two and a half inches. */
(function () {
  var H = (window.TRAIL3D && window.TRAIL3D.helpers) || {};
  var box = H.box, panel = H.panel, ground = H.ground, depthOf = H.depthOf;
  var shadow = H.shadow;

  function paulRevere(ctx) {
    /* two tones per material and more where a material has them: the
       clapboard reads by its course shadows, so it carries three */
    var CLAP = "#7d7361", CLAP_D = "#6e6555", CLAP_E = "#514a3e";
    var TRIM = "#e7e0cf", TRIM_E = "#a89f8b";
    var SHUT = "#8a7f6a";
    var BRICK = "#8e4636", BRICK_D = "#7d3b2d", BRICK_E = "#5d2b20";
    var ROOF = "#4a453c", ROOF_D = "#3d3931", ROOF_E = "#2c2924";
    var LEAD = "#3a464c", LEAD_E = "#2a3237";
    var DOOR = "#43352b", DOOR_E = "#2c2119";
    var STONE = "#b0aa9c", STONE_E = "#847e71";
    var PAVE = "#cdb9a6", KERB = "#a8917d", GRASS = "#c2c9b4";
    var BRICKPAVE = "#b3907c", BRICKKERB = "#916f5d";
    var out = [], P = ctx.project;

    /* ---- THE PLAN, sheet 2. Front (east) at +y, north at +x. ---- */
    var W = 30.5, D = 18 + 2 / 12;
    var x0 = -W / 2, x1 = W / 2, y0 = -D / 2, y1 = D / 2;
    var IN = 1 / 12;
    /* the frontage chain, south to north, as offsets from the south corner */
    var WIN = 35 * IN;
    var winC = [49 + 17.5, 137 + 17.5, 224 + 17.5].map(function (i) { return x0 + i * IN; });
    var doorC = x0 + (291 + 16) * IN, DOORW = 32 * IN;

    /* ---- THE ELEVATIONS, scaled (header). Every height here is measured
       from the BOTTOM OF THE CLAPBOARD, which is the datum the elevations
       are drawn to, so each one is carried up by SILL, the granite course
       standing under it. The first build read them off the drawing and then
       started the clapboard at SILL anyway, which made the first storey a
       sixth short and the two storeys differ by a fifth, where sheet 1 draws
       them equal to the pixel: 56 px each, 7 ft 10 in each. ---- */
    var SILL = 1.2;             /* granite: nothing at the south corner, two
                                   feet at the north as the street falls away */
    var OVER = SILL + 7.87;     /* the second storey's overhang line */
    var EAVE = SILL + 15.74;    /* the garret's line, and the plate: 2 x 7.87 */
    var RIDGE = SILL + 27.95;
    var PROJ = 1.40;            /* the second storey's throw, south elevation */
    var GARR = 1.10;            /* the garret's throw at the eave: the roof
                                   edge sits all but flush with its fascia,
                                   1.26 past the second storey in all */
    var RAKE = 1.41;            /* roof past the gable wall */
    var MAIN_TOP = SILL + 39.6, ELL_TOP = SILL + 39.2;   /* chimney caps */
    /* the roof in plan, and the pitch that falls out of it: 48 degrees
       against the 46 the south elevation's rake measures */
    var rfS = x0 - RAKE, rfN = x1 + RAKE;
    var rfB = y0 - 1.26, rfF = y1 + PROJ + GARR + 0.16, rfM = (rfB + rfF) / 2;
    var SLOPE = (RIDGE - EAVE) / (rfM - rfB);

    /* ---- THE ELL, sheet 2. It leaves the rear wall 12 ft 3 in from the
       south corner and runs to the north corner; its west end is printed at
       15 ft 6 in. Both long sides lean north as they go back, which is the
       skew the style book warned about. Corners scaled off the plan, within
       about a foot of the WebGL layer's independent reading. ---- */
    var EA = [x0 + 12.51, y0], EB = [x1, y0];
    var EC = [18.9, y0 - 15.18], ED = [3.4, y0 - 14.90];

    /* ---- the ground: street in front, the brick courtyard to the south ---- */
    out.push(ground(ctx, 2, -8, 78, 64, 0, GRASS, "#a8b09a"));
    out.push(ground(ctx, x0 - 7, -8, 14, 36, 0.15, BRICKPAVE, BRICKKERB));
    out.push(ground(ctx, 4, y1 + 7.5, 48, 12, 0.15, PAVE, KERB));
    out.push(shadow(ctx, [[x0, y1], [x1, y1], [EB[0], EB[1]], EC, ED, EA, [x0, y0]], RIDGE, 0.25));

    /* ---- small geometry helpers for walls that do not run along an axis ---- */
    function outwardOf(a, b, cx, cy) {
      var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.sqrt(dx * dx + dy * dy) || 1;
      var nx = dy / L, ny = -dx / L;
      var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      if ((mx - cx) * nx + (my - cy) * ny < 0) { nx = -nx; ny = -ny; }
      return [nx, ny];
    }
    /* a map from (u along the wall in feet, z) to the screen, for wall a->b */
    function segMap(a, b) {
      var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.sqrt(dx * dx + dy * dy) || 1;
      var m = function (u, z) { return P(a[0] + dx * u / L, a[1] + dy * u / L, z); };
      m.len = L;
      return m;
    }
    function wallFace(a, b, z0, z1, fill, n) {
      if (!ctx.faceVisible(n[0], n[1])) return null;
      var q = [P(a[0], a[1], z0), P(b[0], b[1], z0), P(b[0], b[1], z1), P(a[0], a[1], z1)];
      var d = depthOf(q);
      out.push({ svg: ctx.poly(q, ctx.shade(fill, n[0], n[1], 0), CLAP_E, 0.6), depth: d });
      return d;
    }
    function mapY(Y) { return function (u, z) { return P(u, Y, z); }; }
    function mapX(X) { return function (u, z) { return P(X, u, z); }; }

    /* the clapboard: a course shadow every 2.2 ft, which is several lapped
       boards read as one line at map scale */
    function clapboard(map, u0, u1, z0, z1, d) {
      for (var z = z0 + 2.2; z < z1 - 0.4; z += 2.2) {
        out.push(panel(ctx, map, u0, u1, z - 0.16, z + 0.16, CLAP_D, null, d + 0.05));
      }
    }
    /* a casement: leaded glass with two diagonals each way, in a light frame.
       `single` draws one leaf; `half` is half the glazed width. */
    function casement(map, uc, z0, z1, d, half, single) {
      var hw = half, mull = 0.14;
      out.push(panel(ctx, map, uc - hw - 0.3, uc + hw + 0.3, z0 - 0.3, z1 + 0.3, TRIM, TRIM_E, d + 0.30));
      var leaves = single ? [[uc - hw, uc + hw]] : [[uc - hw, uc - mull], [uc + mull, uc + hw]];
      leaves.forEach(function (lf) {
        var lo = lf[0], hi = lf[1], w = hi - lo;
        out.push(panel(ctx, map, lo, hi, z0, z1, LEAD, LEAD_E, d + 0.40));
        [-1, 1].forEach(function (dir) {
          for (var k = 0; k < 2; k++) {
            var uS = lo + (dir > 0 ? (k * w * 0.55) : (w - k * w * 0.55));
            var uT = uS + dir * w * 0.62;
            out.push({ svg: ctx.poly([map(uS, z0), map(uS + 0.08, z0),
                                      map(uT + 0.08, z1), map(uT, z1)], TRIM, null, 0),
                       depth: d + 0.45 });
          }
        });
      });
      if (!single) out.push(panel(ctx, map, uc - mull, uc + mull, z0 - 0.2, z1 + 0.2, TRIM, TRIM_E, d + 0.5));
      out.push(panel(ctx, map, uc - hw - 0.45, uc + hw + 0.45, z0 - 0.55, z0 - 0.3, TRIM, TRIM_E, d + 0.5));
    }
    /* the plain panels the east elevation draws beside each casement */
    function sidePanels(map, uc, half, z0, z1, d, which) {
      var pw = 1.1, gap = 0.45;
      (which || [-1, 1]).forEach(function (s) {
        var a = uc + s * (half + gap), b = uc + s * (half + gap + pw);
        out.push(panel(ctx, map, Math.min(a, b), Math.max(a, b), z0, z1, SHUT, TRIM_E, d + 0.25));
      });
    }
    /* a sash: dark glass, a frame and one glazing bar each way */
    function sash(map, uc, z0, z1, half, d) {
      out.push(panel(ctx, map, uc - half - 0.25, uc + half + 0.25, z0 - 0.25, z1 + 0.25, TRIM, TRIM_E, d + 0.30));
      out.push(panel(ctx, map, uc - half, uc + half, z0, z1, LEAD, LEAD_E, d + 0.40));
      out.push(panel(ctx, map, uc - 0.06, uc + 0.06, z0, z1, TRIM, null, d + 0.45));
      out.push(panel(ctx, map, uc - half, uc + half, (z0 + z1) / 2 - 0.06, (z0 + z1) / 2 + 0.06, TRIM, null, d + 0.45));
    }

    /* ---- a base: the granite fieldstone underpinning ("foundation: granite
       fieldstone", sheet 4), a step that stands half a foot out from the
       sill all round the main block, and under the ell's three open walls ---- */
    out = out.concat(box(ctx, x0 - 0.5, x1 + 0.5, y0 - 0.5, y1 + 0.5, 0.2, SILL,
                         STONE, STONE_E, null, -8.6e8).parts);

    /* ================= THE MAIN BLOCK =================
       Two masses, because the framed overhang is the point of the street
       front: the second storey stands 1.25 ft out over the first. The survey
       records the overhang on the front; the gable ends run straight up. */
    var lower = box(ctx, x0, x1, y0, y1, SILL, OVER, CLAP, CLAP_E, null);
    out = out.concat(lower.parts);
    var upper = box(ctx, x0, x1, y0, y1 + PROJ, OVER, EAVE, CLAP, CLAP_E, null);
    out = out.concat(upper.parts);

    /* ---- THE FRONT, east, +y: sheet 1 ---- */
    if (ctx.faceVisible(0, 1)) {
      var dLo = lower.walls["0,1"], dUp = upper.walls["0,1"];
      clapboard(mapY(y1), x0, x1, SILL, OVER - 1.2, dLo);
      clapboard(mapY(y1 + PROJ), x0, x1, OVER + 1.1, EAVE, dUp);
      winC.forEach(function (xc) {
        casement(mapY(y1), xc, SILL + 3.5, SILL + 6.7, dLo, WIN / 2);
        sidePanels(mapY(y1), xc, WIN / 2, SILL + 3.5, SILL + 6.7, dLo);
        casement(mapY(y1 + PROJ), xc, SILL + 11.9, SILL + 14.8, dUp, WIN / 2);
        sidePanels(mapY(y1 + PROJ), xc, WIN / 2, SILL + 11.9, SILL + 14.8, dUp);
      });
      /* the door, far right, a plank door under a small hood. It stands on
         the ground, not on the granite: the street is at its threshold. */
      out.push(panel(ctx, mapY(y1), doorC - DOORW / 2, doorC + DOORW / 2, 0, SILL + 6.5, DOOR, DOOR_E, dLo + 0.4));
      out.push(panel(ctx, mapY(y1), doorC - DOORW / 2 - 0.3, doorC + DOORW / 2 + 0.3, SILL + 6.5, SILL + 6.9, TRIM, TRIM_E, dLo + 0.5));
      /* upstairs over the door: the narrow single casement, one plain panel */
      casement(mapY(y1 + PROJ), doorC + 0.4, SILL + 11.9, SILL + 14.8, dUp, 0.55, true);
      sidePanels(mapY(y1 + PROJ), doorC + 0.4, 0.55, SILL + 11.9, SILL + 14.8, dUp, [1]);
      /* TWO framed overhangs, which is what sheet 1 draws and the pendant
         detail calls TYPICAL: the second storey over the first, and the
         garret over the second at the plate. Each gets a fascia and a turned
         drop at each corner, and the garret its row of joist ends. */
      out.push(panel(ctx, mapY(y1 + PROJ), x0, x1, OVER - 0.1, OVER + 1.0, CLAP_D, CLAP_E, dUp + 0.2));
      [x0 + 0.5, x1 - 0.5].forEach(function (ux, i) {
        out.push(panel(ctx, mapY(y1 + PROJ), ux - 0.42, ux + 0.42, OVER - 2.1, OVER, CLAP_E, CLAP_E, dUp + 0.25 + i * 0.01));
      });
      var mG = mapY(y1 + PROJ + GARR), dG = dUp + 0.55;
      out.push(panel(ctx, mG, x0, x1, EAVE - 0.9, EAVE + 0.1, CLAP_D, CLAP_E, dG));
      for (var jx = x0 + 1.4; jx < x1 - 0.6; jx += 2.6) {
        out.push(panel(ctx, mG, jx - 0.18, jx + 0.18, EAVE - 1.3, EAVE - 0.85, CLAP_E, null, dG + 0.05));
      }
      [x0 + 0.5, x1 - 0.5].forEach(function (ux, i) {
        out.push(panel(ctx, mG, ux - 0.40, ux + 0.40, EAVE - 1.7, EAVE, CLAP_E, CLAP_E, dG + 0.1 + i * 0.01));
      });
    }

    /* ---- THE SOUTH GABLE, -x: sheet 4. One sash to a floor, an attic pair ---- */
    if (ctx.faceVisible(-1, 0)) {
      var gLo = lower.walls["-1,0"], gUp = upper.walls["-1,0"];
      clapboard(mapX(x0), y0, y1, SILL, OVER, gLo);
      clapboard(mapX(x0), y0, y1 + PROJ, OVER, EAVE, gUp);
      sash(mapX(x0), 0.2, SILL + 4.21, SILL + 7.02, 0.95, gLo);
      sash(mapX(x0), 0.4, SILL + 11.80, SILL + 15.31, 0.95, gUp);
    }

    /* ---- THE EXPOSED REAR, west, -y: sheet 2 prints a 34 in opening 69 in
       from the south corner; sheet 4 shows a casement pair on each floor ---- */
    if (ctx.faceVisible(0, -1)) {
      var bLo = lower.walls["0,-1"], bUp = upper.walls["0,-1"];
      var rearC = x0 + (68 + 17) * IN;
      clapboard(mapY(y0), x0, EA[0], SILL, OVER, bLo);
      clapboard(mapY(y0), x0, EA[0], OVER, EAVE, bUp);
      casement(mapY(y0), rearC, SILL + 3.5, SILL + 6.7, bLo, 34 * IN / 2);
      sidePanels(mapY(y0), rearC, 34 * IN / 2, SILL + 3.5, SILL + 6.7, bLo);
      casement(mapY(y0), rearC, SILL + 11.9, SILL + 14.8, bUp, 34 * IN / 2);
      sidePanels(mapY(y0), rearC, 34 * IN / 2, SILL + 11.9, SILL + 14.8, bUp);
    }
    /* THE NORTH SIDE, +x, is a hatched masonry wall on sheet 2: clapboard
       only, no windows, and none invented. */
    if (ctx.faceVisible(1, 0)) {
      clapboard(mapX(x1), y0, y1, SILL, OVER, lower.walls["1,0"]);
      clapboard(mapX(x1), y0, y1 + PROJ, OVER, EAVE, upper.walls["1,0"]);
    }

    /* ================= THE KITCHEN ELL =================
       A skewed quadrilateral off the rear, so its three open walls are drawn
       as free faces with their own outward normals rather than as a box. */
    var ecx = (EA[0] + EB[0] + EC[0] + ED[0]) / 4, ecy = (EA[1] + EB[1] + EC[1] + ED[1]) / 4;
    /* ---- ITS ROOF LINE, worked out before anything is drawn, because the
       west gable's apex has to sit on it. Two PLANES, each rising inward
       from its own eave line at the main roof's pitch; the ridge is where
       they meet. The ell is skewed, so its two eaves are not parallel, and a
       level ridge drawn between them (what the first build did) warps both
       slopes and walks the pitch from 47 to 55 degrees along the roof, and
       is arrived at by running the ell's axis BACKWARDS into the house so
       that a 16 ft ell carries a 26 ft ridge. A real ridge over a skewed
       plan with equal eaves and one pitch tilts instead, and this one does,
       by about a foot end to end. ---- */
    var ELL = (function () {
      var nS = outwardOf(ED, EA, ecx, ecy), nN = outwardOf(EB, EC, ecx, ecy);
      var A = [nS[0] - nN[0], nS[1] - nN[1]];
      var c = (nS[0] * ED[0] + nS[1] * ED[1]) - (nN[0] * EB[0] + nN[1] * EB[1]);
      var AA = A[0] * A[0] + A[1] * A[1];
      var p0 = [A[0] * c / AA, A[1] * c / AA], d = [-A[1], A[0]];
      var at = function (t) { return [p0[0] + d[0] * t, p0[1] + d[1] * t]; };
      var zAt = function (p) {
        return EAVE + SLOPE * -(nS[0] * (p[0] - ED[0]) + nS[1] * (p[1] - ED[1]));
      };
      /* the west end: where the ridge crosses the gable line C to D */
      var ex = ED[0] - EC[0], ey = ED[1] - EC[1];
      var w = at(((EC[0] - p0[0]) * ey - (EC[1] - p0[1]) * ex) / (d[0] * ey - d[1] * ex));
      /* the east end: where it runs into the main roof's rear slope. Both
         sides are linear in t, so two samples place it exactly. */
      var g = function (t) { var q = at(t); return zAt(q) - (EAVE + (q[1] - rfB) * SLOPE); };
      var g0 = g(0), g1 = g(1);
      var e = at(-g0 / (g1 - g0));
      return { w: w, e: e, zw: zAt(w), ze: zAt(e) };
    })();
    /* its stone underpinning */
    [[ED, EA], [EB, EC], [EC, ED]].forEach(function (s) {
      wallFace(s[0], s[1], 0.2, SILL, STONE, outwardOf(s[0], s[1], ecx, ecy));
    });
    /* SOUTH SIDE, D to A: two shuttered sashes upstairs, a sash and the door
       below (sheet 4, positions scaled along the wall) */
    var nS = outwardOf(ED, EA, ecx, ecy), dS = wallFace(ED, EA, SILL, EAVE, CLAP, nS);
    if (dS !== null) {
      var mS = segMap(ED, EA), LS = mS.len;
      clapboard(mS, 0, LS, SILL, EAVE, dS);
      sash(mS, 0.34 * LS, SILL + 11.3, SILL + 15.0, 0.95, dS);
      sidePanels(mS, 0.34 * LS, 0.95, SILL + 11.3, SILL + 15.0, dS);
      sash(mS, 0.85 * LS, SILL + 11.3, SILL + 15.0, 0.95, dS);
      sidePanels(mS, 0.85 * LS, 0.95, SILL + 11.3, SILL + 15.0, dS);
      sash(mS, 0.18 * LS, SILL + 4.0, SILL + 7.4, 0.8, dS);
      out.push(panel(ctx, mS, 0.43 * LS - 1.2, 0.43 * LS + 1.2, 0, SILL + 6.4, DOOR, DOOR_E, dS + 0.4));
    }
    /* NORTH SIDE, B to C: the hatched party wall again, no openings */
    var nN = outwardOf(EB, EC, ecx, ecy), dN = wallFace(EB, EC, SILL, EAVE, CLAP, nN);
    if (dN !== null) { var mN = segMap(EB, EC); clapboard(mN, 0, mN.len, SILL, EAVE, dN); }
    /* WEST GABLE, C to D, with its gable triangle and an attic window */
    var nW = outwardOf(EC, ED, ecx, ecy), dW = wallFace(EC, ED, SILL, EAVE, CLAP, nW);
    if (dW !== null) {
      var mW = segMap(EC, ED), LW = mW.len;
      /* where the ridge crosses this wall, measured along it from C */
      var uW = Math.sqrt(Math.pow(ELL.w[0] - EC[0], 2) + Math.pow(ELL.w[1] - EC[1], 2));
      clapboard(mW, 0, LW, SILL, EAVE, dW);
      sash(mW, 0.5 * LW, SILL + 11.6, SILL + 15.0, 0.9, dW);
      sash(mW, 0.5 * LW, SILL + 4.0, SILL + 7.4, 0.9, dW);
      var tri = [P(EC[0], EC[1], EAVE), P(ED[0], ED[1], EAVE), P(ELL.w[0], ELL.w[1], ELL.zw)];
      var dT = depthOf(tri);
      out.push({ svg: ctx.poly(tri, ctx.shade(CLAP, nW[0], nW[1], 0), CLAP_E, 0.6), depth: dT });
      sash(mW, uW, EAVE + 1.9, ELL.zw - 1.9, 0.6, dT);
    }

    /* ================= THE ROOFS =================
       The main gable runs parallel to the street, so its ridge runs along x.
       Written out, because the shared helper's ridge runs along y. */
    function gableX(xa, xb, ya, yb, zE, zR) {
      var ym = (ya + yb) / 2, o = [];
      [[-1, ya], [1, yb]].forEach(function (s) {
        var q = [P(xa, s[1], zE), P(xb, s[1], zE), P(xb, ym, zR), P(xa, ym, zR)];
        o.push({ svg: ctx.poly(q, ctx.shade(s[0] > 0 ? ROOF : ROOF_D, 0, s[0] * 0.5, 0.8), ROOF_E, 0.6),
                 depth: depthOf(q) });
      });
      [[-1, xa], [1, xb]].forEach(function (g) {
        if (!ctx.faceVisible(g[0], 0)) return;
        var t = [P(g[1], ya, zE), P(g[1], yb, zE), P(g[1], ym, zR)];
        o.push({ svg: ctx.poly(t, ctx.shade(CLAP, g[0], 0, 0), CLAP_E, 0.6), depth: depthOf(t) });
      });
      return o;
    }
    out = out.concat(gableX(rfS, rfN, rfB, rfF, EAVE, RIDGE));
    /* the south gable's attic pair, laid on the gable triangle */
    if (ctx.faceVisible(-1, 0)) {
      var dA = depthOf([P(rfS, rfB, EAVE), P(rfS, rfF, EAVE), P(rfS, rfM, RIDGE)]);
      casement(mapX(rfS - 0.02), 0, SILL + 19.24, SILL + 23.03, dA, 0.75);
    }

    /* The ell's roof: ridge along the ell's own axis at 27.5 ft, just under
       the main ridge, starting where it meets the main roof's rear slope.
       From the street the main roof paints over the valley; from behind the
       ell roof is nearer and paints over the main slope, as it should. */
    (function () {
      var axis = [ELL.w[0] - ELL.e[0], ELL.w[1] - ELL.e[1]];
      [[EA, ED, -1], [EB, EC, 1]].forEach(function (s) {
        var e0 = s[0], e1 = s[1];
        var q = [P(e0[0], e0[1], EAVE), P(e1[0], e1[1], EAVE),
                 P(ELL.w[0], ELL.w[1], ELL.zw), P(ELL.e[0], ELL.e[1], ELL.ze)];
        var nx = -axis[1] * s[2], ny = axis[0] * s[2], L = Math.sqrt(nx * nx + ny * ny) || 1;
        out.push({ svg: ctx.poly(q, ctx.shade(ROOF_D, nx / L * 0.5, ny / L * 0.5, 0.8), ROOF_E, 0.6),
                   depth: depthOf(q) });
      });
    })();

    /* ================= THE TWO CHIMNEYS =================
       Both rise to about 40 ft on the south elevation. The main stack stands
       over the north end of the main block, just behind the ridge; the
       kitchen stack over the ell's north wall, where sheet 2 draws the
       kitchen hearth. Natural depth, so the roof in front of a stack paints
       over its foot and the brick shows only above the roof. */
    out = out.concat(box(ctx, 8.8, 13.2, -2.1, 3.1, EAVE - 3, MAIN_TOP - 0.9, BRICK, BRICK_E, BRICK_D).parts);
    out = out.concat(box(ctx, 8.4, 13.6, -2.5, 3.5, MAIN_TOP - 0.9, MAIN_TOP, BRICK_D, BRICK_E, BRICK).parts);
    out = out.concat(box(ctx, 12.6, 15.4, -18.9, -16.0, EAVE - 3, ELL_TOP - 0.8, BRICK, BRICK_E, BRICK_D).parts);
    out = out.concat(box(ctx, 12.3, 15.7, -19.2, -15.7, ELL_TOP - 0.8, ELL_TOP, BRICK_D, BRICK_E, BRICK).parts);

    return out;
  }

  window.TRAIL_FORMS = window.TRAIL_FORMS || {};
  window.TRAIL_FORMS["paul-revere"] = paulRevere;
})();
