/* ---------------- Stop 12: the Paul Revere House ----------------
   19 North Square, built no later than 1680 on the site of Increase
   Mather's house, and the oldest building still standing in downtown
   Boston. Revere owned it from 1770 to 1800 and rode out of it on the night
   of 18 April 1775. Rebuilt to MODEL_STANDARD.md, 2026-09-05, by the
   landmark routine.

   PUBLISHED, from the Wikipedia article on the Paul Revere House, read this
   run, which cites the National Historic Landmark file:

     the main section "measures 30 by 48 feet (9.1 by 14.6 m) across"
     the rear ell "measures about 16 by 16 feet (4.9 by 4.9 m) across"
     "The modern-day house is two stories high"
     "The eastern, street-facing elevation of the main section's facade is
      divided vertically into four bays"
     "The overhanging second story of the main elevation is cantilevered
      above the sidewalk"
     a "steep pitched roof" with "a gable that runs parallel to the street"
     "two chimneys: a replica of a brick chimney at the northern end of the
      gable and a smaller brick chimney"
     "rectangular casement windows grouped in pairs, with rhombus-shaped
      panes"
     "the cladding is made of clapboard"
     the courtyard "paved in brick" with "a 900-pound (410 kg) bronze bell"

   PUBLISHED, from the HABS survey MA-491 (Library of Congress, ma0478),
   read this run and kept because it carries what the article does not: the
   front elevation FACES EAST; the main part is "four bays wide" with "the
   second story featuring a framed overhang"; and "a two story ell extends
   two bays deep" with "a similar overhang".

   WHICH DIMENSION IS THE FRONT, derived from two published facts rather
   than chosen. The gable runs PARALLEL to the street, so the street front is
   the eaves side and takes the longer of the two published dimensions: the
   front is 48 ft along North Square and the house is 30 ft deep. The check
   is the roof. A ridge parallel to a 48 ft front spans the 30 ft depth, 15
   ft of rafter each side, which is a seventeenth century roof; the other
   reading spans 48 ft and would put a roof taller than the house on top of
   it. The check is also the bay module: 48 over the published four bays is
   12 ft, which is what a pair of casements and their frame occupy.

   A PUBLISHED CONTRADICTION, named rather than smoothed. The same article
   gives the main section as 30 by 48 ft, which is 1,430 sq ft, and the lot
   as "about 1,475 square feet". A house cannot cover 97 percent of a lot
   that also holds a brick courtyard. One of the two is wrong and nothing
   here depends on the lot figure, so the footprint is used and the lot is
   not. HABS and the article also disagree on the rooms: HABS says one room
   per floor in the main block, the article says two. Neither is visible from
   the street and neither is drawn.

   ORIENTATION, which on this renderer is not a detail. At the page's own
   opening yaw of -0.62 the visible faces are +y and -x, and every other face
   is culled. The four bay front with the overhang is put at +y, so the
   reader gets the elevation that carries the architecture, and the big
   chimney is put on the -x gable end so that it too is seen. The published
   "northern end of the gable" is therefore drawn at -x; the real compass
   north is not recoverable from a fixed camera and is not claimed.

   THE STYLE BOOK'S ONE WARNING NOT TAKEN. STYLES.md's First Period entry
   says the ell "follows the LOT rather than the house", meets the main block
   off square where the lot is irregular, and "a right angle is the easiest
   way to draw one of them wrong". The ell here IS square, because no source
   reached this run says the Revere ell is skewed and skewing it on the
   book's general rule would be inventing a fact about this house. Recorded
   so the next run can settle it from the HABS plan sheet rather than
   rediscover the question.

   Named gaps, all derived and none published: no storey height (first 9.5
   ft, second to a 19.5 ft eave, from two published storeys); no roof pitch
   (46 degrees, from the published "steep"); no overhang projection (1.25 ft,
   the framed overhang of a seventeenth century Boston house); no chimney
   dimensions; no published door position, so it is put in the second bay
   where the photographs show it; no clapboard exposure, so courses are drawn
   at 2.2 ft, which is several courses read as one shadow line rather than a
   hatch the map scale cannot hold. */
(function () {
  var H = (window.TRAIL3D && window.TRAIL3D.helpers) || {};
  var box = H.box, panel = H.panel, ground = H.ground, depthOf = H.depthOf;

  function paulRevere(ctx) {
    /* CHECKLIST 5, two tones per material and more where a material has
       them: the clapboard reads by its course shadows, so it carries three. */
    var CLAP = "#7d7361", CLAP_D = "#6e6555", CLAP_E = "#514a3e";
    var TRIM = "#e7e0cf", TRIM_E = "#a89f8b";
    var BRICK = "#8e4636", BRICK_D = "#7d3b2d", BRICK_E = "#5d2b20";
    var ROOF = "#4a453c", ROOF_D = "#3d3931", ROOF_E = "#2c2924";
    var LEAD = "#3a464c", LEAD_E = "#2a3237";
    var DOOR = "#43352b", DOOR_E = "#2c2119";
    var STONE = "#b0aa9c", STONE_E = "#847e71";
    var PAVE = "#cdb9a6", KERB = "#a8917d", SHADOW = "#9d9689", GRASS = "#c2c9b4";
    var out = [], P = ctx.project;

    /* THE PUBLISHED PLAN. Front (east) at +y, 48 ft wide; 30 ft deep. */
    var W = 48, D = 30;
    var x0 = -W / 2, x1 = W / 2, y0 = -D / 2, y1 = D / 2;
    var BAY = W / 4;                       /* published four bays: 12 ft */

    /* THE PUBLISHED ELL, 16 by 16, off the rear and flush with the -x end,
       which is where HABS puts it and also the only place a rear wing shows
       at all from a camera that can only see +y and -x. */
    var ex0 = x0, ex1 = x0 + 16, ey1 = y0, ey0 = y0 - 16;

    /* DERIVED ELEVATION. Two published storeys; the heights are not. */
    var SILL = 1.2;             /* the granite underpinning */
    var OVER = 8.4;             /* the published framed overhang line */
    var PROJ = 1.25;            /* how far the second storey is thrown out */
    var EAVE = 16.8;
    var RIDGE = EAVE + 17.9;    /* 15 ft run at 50 degrees, the book's pitch */
    var ELL_RIDGE = EAVE + 9.5; /* the ell's ridge runs the other way */

    /* THE STYLES BOOK SET THESE, not the eye. STYLES.md's First Period entry
       calls for storeys of six and a half to eight feet, "which is why the
       windows crowd the plate and why the building reads as long rather than
       tall", and a gable "around fifty degrees, not the thirty-something of a
       Georgian roof". The first pass had nine and a half foot storeys and a
       forty six degree roof, which is a Georgian house wearing a jetty. The
       storeys are 7.2 ft here and the casement heads sit under the plate. */

    /* ---- the pad, kept tight. A wide ground plane does not add context,
       it fits the frame to the pavement and shrinks the house to a stamp.
       Bunker Hill and Old South both learned this. ---- */
    out.push(ground(ctx, -4, -8, 104, 100, 0, GRASS, "#a8b09a"));
    /* the published brick courtyard, on the -x side where the real one is,
       and North Square's own paving in front of the east elevation */
    out.push(ground(ctx, x0 - 13, -6, 24, 62, 0.15, PAVE, KERB));
    out.push(ground(ctx, 0, y1 + 11, 68, 20, 0.15, PAVE, KERB));

    /* CHECKLIST 6: a ground shadow, thrown away from LIGHT = [0.6,0.3,0.68],
       so down and to the left in plan. */
    (function () {
      var q = [P(x0 - 12, ey0 - 7, 0.25), P(x1 - 4, ey0 - 7, 0.25),
               P(x1 - 4, y1 - 5, 0.25), P(x0 - 12, y1 - 5, 0.25)];
      out.push({ svg: ctx.poly(q, SHADOW, null, 0), depth: -9e8 });
    })();

    /* ---- CHECKLIST 3: a base. The house does not stand on the pavement,
       it stands on a granite underpinning that steps out from the sill. ---- */
    out = out.concat(box(ctx, x0 - 0.7, x1 + 0.7, y0 - 0.7, y1 + 0.7, 0.2, SILL,
                         STONE, STONE_E, null, -8.6e8).parts);
    out = out.concat(box(ctx, ex0 - 0.7, ex1 + 0.7, ey0 - 0.7, ey1, 0.2, SILL,
                         STONE, STONE_E, null, -8.7e8).parts);

    /* ================= THE MAIN BLOCK =================
       Two masses, not one, because the published overhang is the whole point
       of this elevation: the first storey stands back and the second is
       thrown 1.25 ft past it on the front and on both gable ends. A single
       extruded wall from sill to eave is the box the standard forbids. */
    var lower = box(ctx, x0, x1, y0, y1, SILL, OVER, CLAP, CLAP_E, null);
    out = out.concat(lower.parts);
    var upper = box(ctx, x0 - PROJ, x1 + PROJ, y0, y1 + PROJ, OVER, EAVE,
                    CLAP, CLAP_E, null);
    out = out.concat(upper.parts);

    /* the ell, the same two stages and the same published overhang */
    var eLower = box(ctx, ex0, ex1, ey0, ey1, SILL, OVER, CLAP, CLAP_E, null, -8.4e8);
    out = out.concat(eLower.parts);
    var eUpper = box(ctx, ex0 - PROJ, ex1, ey0 - PROJ, ey1, OVER, EAVE,
                     CLAP, CLAP_E, null, -8.3e8);
    out = out.concat(eUpper.parts);

    /* ---- the wall maps, one per visible face, so everything drawn ON a
       wall is struck in that wall's own (u, z) and sorts at its depth ---- */
    function mapY(Y) { return function (u, z) { return P(u, Y, z); }; }
    function mapX(X) { return function (u, z) { return P(X, u, z); }; }

    /* CHECKLIST 2 and 8: the clapboard. Not a texture, a course shadow every
       2.2 ft, one tone under the wall, which is what a lapped board reads as
       at map scale. A finer pitch hatches into a grey smear. */
    function clapboard(map, u0, u1, z0, z1, d) {
      for (var z = z0 + 2.2; z < z1 - 0.4; z += 2.2) {
        out.push(panel(ctx, map, u0, u1, z - 0.16, z + 0.16, CLAP_D, null, d + 0.05));
      }
    }

    /* CHECKLIST 1 and 9: the windows a visitor names. Casements in PAIRS,
       with rhombus panes: a dark leaded glass, a light frame and mullion, and
       the diagonal lattice drawn as thin quads on the wall's own map. Two
       diagonals each way is what survives 900 pixels; a true lattice does
       not. */
    function diamondPair(map, uc, z0, z1, d) {
      var hw = 2.1, mull = 0.28;
      out.push(panel(ctx, map, uc - hw - 0.45, uc + hw + 0.45, z0 - 0.4, z1 + 0.45,
                     TRIM, TRIM_E, d + 0.30));
      [-1, 1].forEach(function (s) {
        var a = uc + s * (mull + 0.02), b = uc + s * hw;
        var lo = Math.min(a, b), hi = Math.max(a, b);
        out.push(panel(ctx, map, lo, hi, z0, z1, LEAD, LEAD_E, d + 0.40));
        /* the lattice: two diagonals each way across each leaf */
        var w = hi - lo, h = z1 - z0;
        [-1, 1].forEach(function (dir) {
          for (var k = 0; k < 2; k++) {
            var off = (k + 0.5) * w;
            var uA = lo + (dir > 0 ? -off + w * 0 : off);
            /* struck as a thin parallelogram from the sill to the head */
            var uS = lo + (dir > 0 ? (k * w * 0.55) : (w - k * w * 0.55));
            var uT = uS + dir * w * 0.62;
            out.push({ svg: ctx.poly([map(uS, z0), map(uS + 0.11, z0),
                                      map(uT + 0.11, z1), map(uT, z1)],
                                     TRIM, null, 0), depth: d + 0.45 });
            void uA; void off;
          }
        });
      });
      /* the mullion between the two leaves, and the sill under both */
      out.push(panel(ctx, map, uc - mull, uc + mull, z0 - 0.2, z1 + 0.2, TRIM, TRIM_E, d + 0.5));
      out.push(panel(ctx, map, uc - hw - 0.6, uc + hw + 0.6, z0 - 0.75, z0 - 0.35,
                     TRIM, TRIM_E, d + 0.5));
    }

    /* ---- THE FRONT, +y: four published bays, casement pairs above and
       below, the door in the second bay, and the overhang across all of
       it ---- */
    if (ctx.faceVisible(0, 1)) {
      var dLo = lower.walls["0,1"], dUp = upper.walls["0,1"];
      clapboard(mapY(y1), x0, x1, SILL, OVER - 1.4, dLo);
      clapboard(mapY(y1 + PROJ), x0 - PROJ, x1 + PROJ, OVER + 1.2, EAVE, dUp);
      for (var b = 0; b < 4; b++) {
        var xc = x0 + BAY * (b + 0.5);
        if (b === 1) {
          /* the door, and the hood over it. A seventeenth century Boston
             door is a plank door under a small pent, not a Georgian
             surround, and drawing a surround here would age the house by a
             century. */
          out.push(panel(ctx, mapY(y1), xc - 2.0, xc + 2.0, SILL, SILL + 6.6, DOOR, DOOR_E, dLo + 0.4));
          out.push(panel(ctx, mapY(y1), xc - 2.35, xc + 2.35, SILL + 6.6, SILL + 7.3,
                         TRIM, TRIM_E, dLo + 0.5));
          out = out.concat(box(ctx, xc - 2.9, xc + 2.9, y1, y1 + 2.2,
                               SILL + 7.3, SILL + 8.0, ROOF, ROOF_E, ROOF_D, dLo + 0.6).parts);
        } else {
          diamondPair(mapY(y1), xc, SILL + 1.9, SILL + 6.4, dLo);
        }
        diamondPair(mapY(y1 + PROJ), xc, OVER + 2.6, OVER + 7.4, dUp);
      }
      /* CHECKLIST 2: the overhang's own fascia, and the turned drops that
         hang under its corners. This band is the horizontal break that stops
         the front reading as one wall. */
      out.push(panel(ctx, mapY(y1 + PROJ), x0 - PROJ, x1 + PROJ, OVER - 0.1, OVER + 1.1,
                     CLAP_D, CLAP_E, dUp + 0.2));
      [x0 - PROJ + 0.9, x1 + PROJ - 0.9].forEach(function (ux, i) {
        out.push(panel(ctx, mapY(y1 + PROJ), ux - 0.45, ux + 0.45, OVER - 1.5, OVER,
                       CLAP_D, CLAP_E, dUp + 0.25 + i * 0.01));
      });
      /* the eaves cornice */
      out.push(panel(ctx, mapY(y1 + PROJ), x0 - PROJ - 0.5, x1 + PROJ + 0.5,
                     EAVE - 0.8, EAVE + 0.35, TRIM, TRIM_E, dUp + 0.6));
    }

    /* ---- THE -x GABLE END, and the ell's -x flank behind it ---- */
    if (ctx.faceVisible(-1, 0)) {
      var gLo = lower.walls["-1,0"], gUp = upper.walls["-1,0"];
      clapboard(mapX(x0), y0, y1, SILL, OVER - 1.4, gLo);
      clapboard(mapX(x0 - PROJ), y0, y1 + PROJ, OVER + 1.2, EAVE, gUp);
      /* one casement pair per storey: a gable end with a chimney stack in it
         does not carry a rank of windows */
      diamondPair(mapX(x0), 4.5, SILL + 1.9, SILL + 6.4, gLo);
      diamondPair(mapX(x0 - PROJ), 4.5, OVER + 2.6, OVER + 7.4, gUp);
      out.push(panel(ctx, mapX(x0 - PROJ), y0, y1 + PROJ, OVER - 0.1, OVER + 1.1,
                     CLAP_D, CLAP_E, gUp + 0.2));

      var eLoD = eLower.walls["-1,0"], eUpD = eUpper.walls["-1,0"];
      if (eLoD !== undefined) {
        clapboard(mapX(ex0), ey0, ey1, SILL, OVER - 1.4, eLoD);
        diamondPair(mapX(ex0), ey0 + 8, SILL + 1.9, SILL + 6.4, eLoD);
      }
      if (eUpD !== undefined) {
        clapboard(mapX(ex0 - PROJ), ey0 - PROJ, ey1, OVER + 1.2, EAVE, eUpD);
        diamondPair(mapX(ex0 - PROJ), ey0 + 8, OVER + 2.6, OVER + 7.4, eUpD);
        out.push(panel(ctx, mapX(ex0 - PROJ), ey0 - PROJ, ey1, OVER - 0.1, OVER + 1.1,
                       CLAP_D, CLAP_E, eUpD + 0.2));
      }
    }

    /* ================= THE ROOFS =================
       CHECKLIST 4: the published gable runs PARALLEL to the street, so the
       ridge runs along x here and the shared helper, whose ridge runs along
       y, cannot draw it. Written out rather than rotated, because rotating
       the building to suit the helper would have put the front on a face the
       camera culls. */
    function gableX(xa, xb, ya, yb, zE, zR, near, far) {
      var ym = (ya + yb) / 2, o = [];
      [[0, -1, ya, ym], [0, 1, yb, ym]].forEach(function (s) {
        var q = [P(xa, s[2], zE), P(xb, s[2], zE), P(xb, s[3], zR), P(xa, s[3], zR)];
        o.push({ svg: ctx.poly(q, ctx.shade(s[1] > 0 ? near : far, 0, s[1] * 0.5, 0.8),
                               ROOF_E, 0.6), depth: depthOf(q) });
      });
      [[-1, xa], [1, xb]].forEach(function (g) {
        if (!ctx.faceVisible(g[0], 0)) return;
        var t = [P(g[1], ya, zE), P(g[1], yb, zE), P(g[1], ym, zR)];
        o.push({ svg: ctx.poly(t, ctx.shade(CLAP, g[0], 0, 0), CLAP_E, 0.6), depth: depthOf(t) });
      });
      return o;
    }
    out = out.concat(gableX(x0 - PROJ - 0.6, x1 + PROJ + 0.6, y0 - 0.6, y1 + PROJ + 0.6,
                            EAVE, RIDGE, ROOF, ROOF_D));

    /* the ell's roof, ridge the other way, so the two do not read as one
       slab: slopes facing +-x, drawn with the shared helper */
    (function () {
      var exm = (ex0 + ex1) / 2;
      [[-1, ex0 - PROJ - 0.5], [1, ex1 + 0.5]].forEach(function (s) {
        if (!ctx.faceVisible(s[0], 0)) return;
        var q = [P(s[1], ey0 - PROJ - 0.5, EAVE), P(s[1], ey1, EAVE),
                 P(exm, ey1, ELL_RIDGE), P(exm, ey0 - PROJ - 0.5, ELL_RIDGE)];
        out.push({ svg: ctx.poly(q, ctx.shade(ROOF_D, s[0] * 0.5, 0, 0.8), ROOF_E, 0.6),
                   depth: depthOf(q) });
      });
      if (ctx.faceVisible(0, -1)) {
        var t = [P(ex0 - PROJ - 0.5, ey0 - PROJ - 0.5, EAVE), P(ex1 + 0.5, ey0 - PROJ - 0.5, EAVE),
                 P(exm, ey0 - PROJ - 0.5, ELL_RIDGE)];
        out.push({ svg: ctx.poly(t, ctx.shade(CLAP, 0, -1, 0), CLAP_E, 0.6), depth: depthOf(t) });
      }
    })();

    /* ================= THE TWO PUBLISHED CHIMNEYS =================
       The big one rises through the ridge at the drawn north gable end, the
       small one over the ell. Both get a cap course, because a chimney that
       ends in its own brick is a pipe. Their depth is a constant past every
       roof strip: nothing in this scene stands in front of a stack. */
    (function (d) {
      /* WHAT LOOKING CAUGHT: the first pass stood this stack 4.4 ft clear of
         the gable wall, where it read as a free standing brick tower beside
         the house rather than as its chimney. A chimney at the end of a
         gable rises THROUGH the roof, inside the wall line. */
      /* AND WHAT A SECOND LOOK CAUGHT, at the street view: at 4.8 by 7.6 ft
         the stack read as a factory pipe standing against the gable, which
         is the opposite of the tell. STYLES.md is explicit that a First
         Period chimney is "a masonry core, not a flue: it is the widest
         thing on the roof", and the published note that these two are
         "comparatively large because they each serve multiple rooms" says
         the same thing in the source's own words. Widened to 7.2 by 9.0 and
         given a shorter neck above the ridge, so it reads as the core the
         house is built around. The plan size remains ASSUMED: no source
         reached publishes it. */
      var cx = x0 + 3.4;
      out = out.concat(box(ctx, cx - 3.6, cx + 3.6, -4.5, 4.5, EAVE - 3, RIDGE + 4.2,
                           BRICK, BRICK_E, BRICK_D, d).parts);
      out = out.concat(box(ctx, cx - 4.3, cx + 4.3, -5.2, 5.2, RIDGE + 4.2, RIDGE + 5.4,
                           BRICK_D, BRICK_E, BRICK, d + 1).parts);
      /* the ell's stack takes its depth from its own geometry, NOT the
         constant above: the ell stands behind the main block and its chimney
         must be able to go behind the main roof, which a constant past every
         roof strip forbids. */
      var sx = ex0 + 8;
      out = out.concat(box(ctx, sx - 1.5, sx + 1.5, ey0 + 5, ey0 + 8, ELL_RIDGE - 3,
                           ELL_RIDGE + 5.0, BRICK, BRICK_E, BRICK_D).parts);
      out = out.concat(box(ctx, sx - 2.0, sx + 2.0, ey0 + 4.5, ey0 + 8.5, ELL_RIDGE + 5.0,
                           ELL_RIDGE + 5.9, BRICK_D, BRICK_E, BRICK).parts);
    })(3e6);

    return out;
  }

  window.TRAIL_FORMS = window.TRAIL_FORMS || {};
  window.TRAIL_FORMS["paul-revere"] = paulRevere;
})();
