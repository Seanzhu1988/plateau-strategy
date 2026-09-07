/* dc-form-american.js: the National Museum of American History, 1955-1964.
 *
 * McKim, Mead and White, successor firm Steinman, Cain and White; Walker O.
 * Cain the architect. North side of the Mall between Constitution Avenue and
 * Madison Drive. The Mall (south) facade is the one this model is built from,
 * because it is the one a visitor stands in front of and the only one for
 * which a count could be measured.
 *
 * STYLE. It is not a style with a name in STYLES.md and it should not be
 * given one: SAH ARCHIPEDIA calls it "a modern rendition of a peripteral
 * temple on the model of the Lincoln Memorial". That is the whole design
 * idea, and it is why the model is what it is. A peripteral temple is a
 * cella wrapped in a colonnade. Here the colonnade is made of WALL: SAH's
 * words are "regularly spaced, rectangular slabs of wall set vertically that
 * rise from the podium to the cornice line are treated as a modern
 * equivalent of columns", "held away from the inner wall by vertical windows
 * of solar gray glass, creating the alternation of light and shade
 * associated with columnar architecture". So the slabs are drawn as real
 * separate slabs standing proud of a recessed inner wall, and the glass
 * shows only in the gaps between them. Drawing one marble box with dark
 * lines painted on it would be the exact failure Sean named.
 *
 * ============ PUBLISHED, and where each number comes from ============
 *
 * PLAN. 151.2 m by 68.9 m = 496 ft by 226 ft, an almost pure rectangle,
 * measured from OpenStreetMap way 445808462 through Overpass by an earlier
 * run of this routine and recorded in MODEL_STANDARD.md. The photograph
 * below independently confirms the 496 ft: the facade spans 2592 px at
 * 5.2258 px per foot.
 *
 * HEIGHT. 20.5 m = 67.3 ft, the OSM height tag on that same way. NAMED GAP,
 * and it is named because it matters: no architect's height was found in any
 * source reached by six runs. The dc-3d.js place height of 21 m is that tag.
 *
 * MATERIAL. "walls are precast concrete panels faced in pink Tennessee
 * marble sandblasted to a uniform surface", 16 3/8 inch precast sandwich
 * panels (Smithsonian Institution Archives).
 *
 * MASSING. "a broad platform base"; "modernist shadow cornices"; the
 * "compact rectangular mass culminates in a recessed attic story"; "the
 * building's broad terrace seen from the Mall serves as the roof of a
 * full-story level set against the embankment fronting on Constitution
 * Avenue" (SAH ARCHIPEDIA DC-01-ML14).
 *
 * GLASS. PPG "Greylite", "still extant throughout the building" and
 * "originally developed specifically for the museum"; the terrace
 * "encircles the building" (NCPC file 7156, October 2010, west facade
 * modification recommendation, read in full through pdftext.js by an earlier
 * run of this routine).
 *
 * ============ THE COUNT, which blocked this building five times ============
 *
 * Checklist item 1 wants the real count drawn as real objects, and no source
 * on the open web prints the number of slabs. Five runs refused to build
 * rather than guess it. The sixth measured it off a photograph and this is
 * that measurement, repeated here so the model can be checked against it.
 *
 * PHOTOGRAPH: "National Museum of American History - 2026 (55256384290).jpg",
 * Wikimedia Commons, Category:Architecture of the National Museum of American
 * History, 8375 x 4711, near-frontal Mall facade in low sun. Loaded at
 * width=3840 through commons.wikimedia.org/wiki/Special:FilePath/.
 *
 * FRAME, which reproduced on three separate runs: the facade spans x=672 to
 * x=3264, so 2592 px against the published 496 ft = 5.2258 px per foot; the
 * two deep end recesses sit at x=784-805 and x=3102-3123, 22 px each and
 * symmetric about x=1953.5, which is how the shot is known to be square
 * enough to count from.
 *
 * MEASUREMENT: column-mean luminance over the clean scanline band y=755 to
 * 800, thresholded at 0.65 of the row mean, gives SEVEN dark vertical runs
 * and nothing else, at
 *     784-805, 1133-1146, 1487-1492, 1849-1850, 2393-2398, 2748-2761,
 *     3102-3123
 * The EIGHTH, near x=2057, is the symmetric partner of 1849 and is hidden by
 * a tree and the plaza sculpture. It is INFERRED from the symmetry and is
 * labelled as inferred here and nowhere else.
 *
 * SYMMETRIZED about x=1953.5, the eight slots sit at
 *     +/- 19.9, 86.7, 154.5 and 221.8 FEET
 * from the centre of the 496 ft front. Successive differences are 66.8, 67.8
 * and 67.3 ft: a uniform module of 67.3 ft with the innermost pair
 * straddling the centre 39.8 ft apart. Those eight numbers are what this
 * file draws, to the foot, in SLOT_S below.
 *
 * WHY FIVE RUNS MISSED IT. They were hunting a short period because they
 * expected columns. They FOUND 67.3 ft and rejected it as "far too wide for
 * the modern equivalent of columns". The rejection was the error: a slab of
 * wall is not a column, and SAH says slab. Looking at a 2x crop settled in
 * one glance what five luminance profiles could not: a small number of very
 * wide blank marble planes separated by narrow dark vertical slots.
 *
 * TEXTURE, NOT A COUNT. A 50 px period runs across the marble, 9.6 ft at
 * this scale, and it is plainly a fine grid of panel joints in the magnified
 * crop, matching the published 16 3/8 in precast panels. It is drawn as
 * course lines and it claims no count.
 *
 * ============ NAMED GAPS, declared rather than guessed ============
 *
 * - The height, above. OSM tag, not an architect's figure.
 * - SLOT WIDTH and the depth the slabs stand proud. Not published. The end
 *   recesses read 21 px = 4.0 ft in the photograph and the centre ones read
 *   1 to 5 px, which is a recess seen obliquely at the ends and edge-on at
 *   the middle, so 4.0 ft is an upper bound on width seen square. Drawn 4 ft
 *   wide and 2 ft proud, which is the shallowest relief that still reads as
 *   an alternation of light and shade rather than as a painted line.
 * - The ATTIC SETBACK. The recess is confirmed visually (the band y=660 to
 *   735 stands back from the wall below with its own shadow line along the
 *   top of the main facade) but no dimension is published. Drawn at 9 ft.
 * - The STEP COUNT up to the terrace. Not published, so no count is claimed:
 *   the approach is drawn as a broad podium with a low landing, which is
 *   what checklist item 3 allows when a count is not known.
 * - The NORTH and END elevations. Only the south face was measured. The
 *   north is drawn with the same eight slots by the building's own symmetry
 *   and is inferred. The two ends carry the SAME measured 67.3 ft module and
 *   the same centre straddle, truncated by the real 226 ft depth, which puts
 *   four slots on each end at +/- 19.9 and +/- 86.7 ft. That is arithmetic
 *   on measured numbers, not a chosen count, and it is flagged as derived.
 * - The Constitution Avenue side is a full storey lower than the Mall
 *   terrace. This renderer has one flat ground plane, so that drop cannot be
 *   drawn and is not faked.
 */
(function () {
  if (typeof window === "undefined" || !window.DC3D) return;
  var H = window.DC3D.helpers;
  window.DC_FORMS = window.DC_FORMS || {};
  window.DC_FORMS['american'] = function (ctx, p, s, VE) {
    var P = ctx.project, items = [];

    var TOP_FT = 67.3;                   /* 20.5 m, the OSM tag; a named gap */
    var FT = (p.h * VE) / TOP_FT;        /* metres per foot */
    var m  = FT * s;
    function W(u, v) { return [p.x + u * m, p.y + v * m]; }
    function pt(u, v, z) { return P(p.x + u * m, p.y + v * m, z * FT); }
    function far(q) { return H.depthOf(q); }

    /* Light from the north-east and high, the renderer's own vector, so a
       face turned toward it takes the warmer tone and a face turned away the
       cooler one. Two tones per material is checklist item 5. */
    var LD = [0.60, 0.30, 0.68];
    function tone(M, nx, ny, nz) {
      var d = nx * LD[0] + ny * LD[1] + nz * LD[2];
      return ctx.shade(d > 0.05 ? M.lit : M.shade, nx, ny, nz);
    }
    /* Pink Tennessee marble, sandblasted: warm, pale, and NOT the cool grey
       of the Mall's limestone neighbours. The terrace is the darker granite
       of the platform base; GREY is PPG Greylite, the solar gray glass. */
    var MARB = { lit: "#f2e6e0", shade: "#dccdc7", edge: "#b8a49e" };
    var ATTC = { lit: "#ece0da", shade: "#d6c7c1", edge: "#b09c96" };
    var TERR = { lit: "#ded7cd", shade: "#c8c0b5", edge: "#a49c91" };
    var GREY = { lit: "#6e7476", shade: "#565c5f", edge: "#3e4346" };

    /* Every face of the building is an axis-aligned quad, so one helper
       draws them all and every one gets an explicit depth. The painter's
       trap this project has met eight times is a large slab painting over
       what stands on it; here the slabs stand PROUD of the wall behind, so
       the proud face must sort nearer than the recess it shadows. */
    function faceY(u0, u1, v, z0, z1, ny, M, dbump) {
      if (!ctx.faceVisible(0, ny)) return;
      var q = [pt(u0, v, z0), pt(u1, v, z0), pt(u1, v, z1), pt(u0, v, z1)];
      items.push({ svg: ctx.poly(q, tone(M, 0, ny, 0), M.edge, 0.4),
                   depth: far(q) + (dbump || 0) });
    }
    function faceX(u, v0, v1, z0, z1, nx, M, dbump) {
      if (!ctx.faceVisible(nx, 0)) return;
      var q = [pt(u, v0, z0), pt(u, v1, z0), pt(u, v1, z1), pt(u, v0, z1)];
      items.push({ svg: ctx.poly(q, tone(M, nx, 0, 0), M.edge, 0.4),
                   depth: far(q) + (dbump || 0) });
    }
    function deck(u0, v0, u1, v1, z, M, dbump) {
      var q = [pt(u0, v0, z), pt(u1, v0, z), pt(u1, v1, z), pt(u0, v1, z)];
      items.push({ svg: ctx.poly(q, tone(M, 0, 0, 1), M.edge, 0.4),
                   depth: far(q) + (dbump || 0) });
    }

    /* ---- the published plan, in feet, centred on the place ---- */
    var HW = 248, HD = 113;              /* 496 by 226 ft */
    var PROUD = 2;                       /* slab relief, a named gap */
    var SLOT = 4;                        /* slot width, a named gap */
    var TERR_OUT = 30;                   /* terrace beyond the wall, all round */
    var Z_TERR = 6;                      /* terrace deck above Mall grade */
    var Z_CORN = 54;                     /* underside of the shadow cornice */
    var CORN_T = 2.6, CORN_P = 3;        /* cornice thickness and projection */
    var ATT_BACK = 9;                    /* attic setback, a named gap */

    /* THE MEASURED COUNT. Eight slots on the Mall front at the offsets
       measured off the photograph. The fourth pair, +19.9, is the inferred
       partner of the -19.9 that the tree hides. */
    var SLOT_S = [-221.8, -154.5, -86.7, -19.9, 19.9, 86.7, 154.5, 221.8];
    /* The ends carry the same module and the same centre straddle, truncated
       by the real 226 ft depth: derived, not chosen. */
    var SLOT_E = [-86.7, -19.9, 19.9, 86.7];

    /* Turn a list of slot centres into the marble planes BETWEEN them, which
       is what actually gets drawn: nine on the long faces, five on the ends. */
    function planes(slots, half) {
      var out = [], a = -half;
      for (var i = 0; i < slots.length; i++) {
        var b = slots[i] - SLOT / 2;
        if (b > a + 0.5) out.push([a, b]);
        a = slots[i] + SLOT / 2;
      }
      if (half > a + 0.5) out.push([a, half]);
      return out;
    }
    var PL_S = planes(SLOT_S, HW), PL_E = planes(SLOT_E, HD);

    /* THE PAINTER'S TRAP, met a ninth time and caught by looking. A large
       top face is sorted by its FARTHEST corner, so the attic's roof and the
       cornice paint before the slab returns on the far side of the building
       and those returns show as stripes ACROSS the roof. The fix is the one
       this project keeps re-learning: give every big horizontal plane an
       explicit depth. NEAR is the nearest plan corner, FARC the farthest, so
       the glass core sits behind everything and the cornice, attic and cap
       sit in front of everything. */
    var CORN4 = [P(p.x - HW * m, p.y - HD * m, 0), P(p.x + HW * m, p.y - HD * m, 0),
                 P(p.x + HW * m, p.y + HD * m, 0), P(p.x - HW * m, p.y + HD * m, 0)];
    var NEAR = CORN4[0][2], FARC = CORN4[0][2];
    for (var ci = 1; ci < 4; ci++) {
      if (CORN4[ci][2] > NEAR) NEAR = CORN4[ci][2];
      if (CORN4[ci][2] < FARC) FARC = CORN4[ci][2];
    }

    /* ---- ground shadow, so the mass does not float (item 6) ---- */
    items.push(H.shadow(ctx, [W(-HW - TERR_OUT, -HD - TERR_OUT),
                              W( HW + TERR_OUT, -HD - TERR_OUT),
                              W( HW + TERR_OUT,  HD + TERR_OUT),
                              W(-HW - TERR_OUT,  HD + TERR_OUT)], p.h * VE));

    /* ---- the broad platform base (item 3). Two courses: the terrace itself
       and a lower apron, so the base has a horizontal break of its own
       rather than being one extruded lip. No step COUNT is claimed. ---- */
    items = items.concat(H.prism(ctx, p.x, p.y,
      (2 * HW + 2 * TERR_OUT + 24) * m, (2 * HD + 2 * TERR_OUT + 24) * m,
      (2 * HW + 2 * TERR_OUT + 24) * m, (2 * HD + 2 * TERR_OUT + 24) * m,
      0, 2.4 * FT, TERR.shade, TERR.edge, -1e8));
    items = items.concat(H.prism(ctx, p.x, p.y,
      (2 * HW + 2 * TERR_OUT) * m, (2 * HD + 2 * TERR_OUT) * m,
      (2 * HW + 2 * TERR_OUT) * m, (2 * HD + 2 * TERR_OUT) * m,
      2.4 * FT, (Z_TERR - 2.4) * FT, TERR.lit, TERR.edge, -1e8 + 10));

    /* ---- the inner wall, set back behind the slabs, in Greylite glass.
       This is the "inner wall" the slabs are "held away from", and because
       the slabs cover all but four feet in sixty-seven of it, what shows of
       it is exactly the eight vertical windows. ---- */
    var IW = HW - PROUD, ID = HD - PROUD;
    items = items.concat(H.prism(ctx, p.x, p.y,
      2 * IW * m, 2 * ID * m, 2 * IW * m, 2 * ID * m,
      Z_TERR * FT, (Z_CORN - Z_TERR) * FT, GREY.shade, GREY.edge, FARC - 5));

    /* ---- the slabs: real objects at the measured count (item 1) ----
       Each is a plane of marble from the podium to the cornice line, two
       feet proud of the glass, with its own two RETURN faces into the
       recess. Those returns are the alternation of light and shade SAH
       describes, and they are the reason a slot reads as a recess from an
       oblique angle rather than as a stripe. */
    function slabRow(list, v, ny) {              /* the two long faces */
      list.forEach(function (r) {
        faceY(r[0], r[1], v, Z_TERR, Z_CORN, ny, MARB, 1.2);
        /* the returns, one at each edge of the slab, facing along x */
        faceX(r[0], v, v - ny * PROUD, Z_TERR, Z_CORN, -1, MARB, 1.0);
        faceX(r[1], v, v - ny * PROUD, Z_TERR, Z_CORN,  1, MARB, 1.0);
        /* the slab's own top, a marble sill under the cornice */
        deck(r[0], v - ny * PROUD, r[1], v, Z_CORN, MARB, 1.4);
      });
    }
    function slabCol(list, u, nx) {              /* the two ends */
      list.forEach(function (r) {
        faceX(u, r[0], r[1], Z_TERR, Z_CORN, nx, MARB, 1.2);
        faceY(u, u - nx * PROUD, r[0], Z_TERR, Z_CORN, -1, MARB, 1.0);
        faceY(u, u - nx * PROUD, r[1], Z_TERR, Z_CORN,  1, MARB, 1.0);
        deck(u - nx * PROUD, r[0], u, r[1], Z_CORN, MARB, 1.4);
      });
    }
    slabRow(PL_S, -HD, -1);                      /* the Mall front, measured */
    slabRow(PL_S,  HD,  1);                      /* Constitution, inferred */
    slabCol(PL_E, -HW, -1);
    slabCol(PL_E,  HW,  1);

    /* ---- the panel joints: 9.6 ft courses across the marble, TEXTURE and
       nothing else. Drawn only on the faces the camera can see, and only as
       hairlines, so they read as an ashlar grid at full size and vanish
       politely at map scale rather than turning the wall into a barcode. */
    function joint(q, dbump) {
      /* through ctx.poly, never as a raw string: the renderer's first pass
         measures the drawing by walking the point list a poly is given, and
         a hand-built SVG string is not a point list. That cost one render. */
      items.push({ svg: ctx.poly(q, MARB.edge, null, 0, ' opacity="0.30"'),
                   depth: far(q) + (dbump || 0) });
    }
    var JT = 0.4;                        /* the joint's drawn thickness, ft */
    function courses(list, v, ny) {
      if (!ctx.faceVisible(0, ny)) return;
      for (var z = Z_TERR + 9.6; z < Z_CORN - 1; z += 9.6) {
        for (var i = 0; i < list.length; i++) {
          joint([pt(list[i][0], v, z), pt(list[i][1], v, z),
                 pt(list[i][1], v, z + JT), pt(list[i][0], v, z + JT)], 1.3);
        }
      }
    }
    function coursesE(list, u, nx) {
      if (!ctx.faceVisible(nx, 0)) return;
      for (var z = Z_TERR + 9.6; z < Z_CORN - 1; z += 9.6) {
        for (var i = 0; i < list.length; i++) {
          joint([pt(u, list[i][0], z), pt(u, list[i][1], z),
                 pt(u, list[i][1], z + JT), pt(u, list[i][0], z + JT)], 1.3);
        }
      }
    }
    courses(PL_S, -HD, -1);
    courses(PL_S,  HD,  1);
    coursesE(PL_E, -HW, -1);
    coursesE(PL_E,  HW,  1);

    /* ---- the modernist shadow cornice (item 2): a thin slab projecting
       past the slab plane, whose whole job is to lay a band of shadow along
       the top of the facade. Published in those words by SAH. ---- */
    items = items.concat(H.prism(ctx, p.x, p.y,
      2 * (HW + CORN_P) * m, 2 * (HD + CORN_P) * m,
      2 * (HW + CORN_P) * m, 2 * (HD + CORN_P) * m,
      Z_CORN * FT, CORN_T * FT, MARB.lit, MARB.edge, NEAR + 1));

    /* ---- the recessed attic storey (item 4). The mass does not end in a
       flat lid: SAH's "compact rectangular mass culminates in a recessed
       attic story", and the photograph shows it standing back with its own
       shadow line. Its own thin cap gives the top a break too. ---- */
    var AW = HW - ATT_BACK, AD = HD - ATT_BACK;
    items = items.concat(H.prism(ctx, p.x, p.y,
      2 * AW * m, 2 * AD * m, 2 * AW * m, 2 * AD * m,
      (Z_CORN + CORN_T) * FT, (TOP_FT - 1.2 - Z_CORN - CORN_T) * FT,
      ATTC.lit, ATTC.edge, NEAR + 2));
    items = items.concat(H.prism(ctx, p.x, p.y,
      2 * (AW + 1.4) * m, 2 * (AD + 1.4) * m, 2 * (AW + 1.4) * m, 2 * (AD + 1.4) * m,
      (TOP_FT - 1.2) * FT, 1.2 * FT, ATTC.shade, ATTC.edge, NEAR + 3));

    return items;
  };
})();
