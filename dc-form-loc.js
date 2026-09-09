/* dc-form-loc.js: the Library of Congress, Thomas Jefferson Building, across
 * First Street from the Capitol, opened 1 November 1897.
 *
 * [SEAN 2026-09-08: "eisenhower executive office building and Library of
 * Congress added to the National Mall tour."]
 *
 * John L. Smithmeyer and Paul J. Pelz designed it; in 1888 Congress fired
 * them and gave the job to Brigadier General Thomas Lincoln Casey of the
 * Army Engineers and his civil engineer Bernard R. Green, with Casey's son
 * Edward Pearce Casey on the interiors. Italian Renaissance then, Beaux-Arts
 * now: a hollow rectangle of New Hampshire granite around a rotunda, with a
 * projecting entrance pavilion on the west facing the Capitol, corner
 * pavilions, and a low copper dome on an octagonal drum carrying the gilded
 * Flame of Knowledge. Four storeys above grade. The west front has the split
 * stair with the Court of Neptune fountain at its foot.
 *
 * ================= PUBLISHED, with the source for each =================
 * aoc.gov, Thomas Jefferson Building page: opened November 1, 1897; four
 *   storeys above grade with a low dome over the central reading room; a
 *   hollow rectangle with a rotunda, bookstacks and four courtyards in the
 *   core; 400,000 cubic feet of granite; 15 varieties of marble; monumental
 *   split stair with the Court of Neptune fountain; three pairs of bronze
 *   doors; paired Corinthian columns at the central portico; 33 ethnological
 *   heads on the keystones of the first-storey windows; the Flame of
 *   Knowledge gold leafed at the pinnacle.
 * homepages.bluffton.edu/~SULLIVANM/washdc/libcongress/jefferson2.html:
 *   the dome raised to 195 ft and gilded with 23 carat gold leaf by Casey
 *   and Green.                                                <- TOP_FT
 * loc.gov/loc/lcib/9709/torch.html: the Torch of Learning is 12 ft high
 *   overall, the torch itself 4 ft; the 1931 restoration replaced the
 *   leaking gilded copper dome with an ungilded one; the flame was
 *   re-gilded in the 1990s.
 * washingtonian.com 2015-03-01: Main Reading Room dome 160 ft above the
 *   floor, 226 desks. en.wikipedia.org/wiki/Thomas_Jefferson_Building: eight
 *   marble columns each topped with a statue, 16 bronze statues on the
 *   balustrades; coordinates 38.8887, -77.0046; started 1890.
 * ibiblio.org/expo/expo/about.html and ebsco.com research starter: New
 *   Hampshire granite; $6.3M against a $6.5M appropriation, on time.
 * DC GIS footprint carried by OSM relation wikidata Q2615945 (dcgis:gis
 *   HSE_0367): the plan below, in feet from the bounding-box centre; box
 *   439 ft east-west by 474 ft north-south, area 13,400 m2. The commonly
 *   printed "470 ft by 340 ft" (theenchantedmanor.com, a weak source) is
 *   the west front and the main block without the east projections.
 *
 * ================= DERIVED, and named as such =================
 * No cornice height is published. The block is drawn 94 ft to the top of
 * its balustrade, from the four published storeys and the published 195 ft
 * to the flame: ground storey 24 ft (the rusticated arcade with the 33
 * heads), piano nobile 26, second floor 20, attic 10, entablature 8,
 * balustrade 6.
 * The octagonal drum of the reading room rises to 134 ft, the dome springs
 * from there to 178, the lantern to 186, the torch to 195: the drum height
 * and dome rise are proportioned by eye to the published total. The dome
 * radius, 76 ft apothem, is read from the octagon's diagonal walls in the
 * GIS plan (centre x -3.5, y +11.5 in the plan frame). Bay spacing is 15 ft;
 * the portico's column count is not in a fetched source and is drawn as
 * four pairs, which is a judgment. Roofs behind the balustrade are drawn as
 * low hips; the pavilions carry taller ones. Dome colour: weathered copper,
 * since the 1931 dome was left ungilded; only the flame is gold.
 *
 * ================= THE CHECKLIST, answered =================
 * 1 counts: one arched window per bay on the ground storey with a keystone
 *   block over each, tall windows above, paired columns at the portico,
 *   eight great arched windows in the drum.
 * 2 breaks: plinth, ground-storey string course, piano nobile course,
 *   entablature, balustrade; drum cornice.
 * 3 base: a plinth under every range, and the split stair as a stack of
 *   twelve slabs with the fountain basin at its foot.
 * 4 roof: low hips behind the balustrade, taller hips on the pavilions, the
 *   drum, the dome as a stack of frusta, the lantern, the torch.
 * 5 tones: ctx.shade on every face; granite, copper, gold, glass, water.
 * 6 shadow: one ground shadow from the whole footprint.
 * 7 height TRUE: 195 ft, 59.4 m in dc-3d.js.
 * 8 openings: glass three tones darker than the granite.
 * 9 the thing a visitor names: the gilded torch on the dome, and the
 *   Neptune stair in front.
 *
 * Frame: the Mall's, x east, +y NORTH, metres. The west front faces the
 * Capitol. Painter's rule as in dc-form-eeob.js: masses at natural depth,
 * attachments only on outer faces at NEAR ladders, strips culled with the
 * wall they belong to. */
(function () {
  var H = window.DC3D && window.DC3D.helpers;
  if (!H) return;
  window.DC_FORMS = window.DC_FORMS || {};

  window.DC_FORMS['loc'] = function (ctx, p, s, VE) {
    var items = [];
    var TOP_FT = 195;                   /* published: the flame */
    var FT = (p.h * VE) / TOP_FT;
    var m  = FT * s;

    function X(u) { return p.x + u * m; }
    function Y(v) { return p.y + v * m; }
    function Z(z) { return z * FT; }
    function W(w) { return w * m; }

    /* ---------- palette: New Hampshire granite, copper, gold ---------- */
    var GRAN    = "#d3cfc6";
    var RUST    = "#c3bfb5";   /* the rusticated ground storey */
    var TRIM    = "#b9b5ab";
    var COLUMN  = "#e4e1d9";
    var CAP     = "#d6d2c9";
    var BALUS   = "#cbc7bd";
    var ROOF    = "#8d8f88";   /* low roofs behind the balustrade */
    var COPPER  = "#7f9285";   /* the dome, weathered copper */
    var COPPER_D= "#6c7d71";
    var GOLD    = "#d9b84a";
    var GLASS   = "#3f4753";
    var KEY     = "#7d786e";   /* the keystone heads, a dark block over each arch */
    var VOID    = "#3a3f47";   /* the loggia behind the paired columns */
    var WATER   = "#8fa6b0";
    var BRONZE  = "#6b5a3e";
    var STONE_E = "#a09c93";
    var PAVE    = "#ddd9d0";
    var LAWN    = "#c7d2bb";

    /* ---------- levels, feet, DERIVED except the flame ---------- */
    var GRD = 0, GS = 24, PN = 50, SF = 70, AT = 80, ENT = 88, BAL = 94;
    /* four storeys above grade (aoc.gov): the arcaded ground storey, the
       piano nobile, the second floor and an ATTIC band of small windows under
       the entablature. The first draft stopped at three and its critic
       counted. */
    var ROOFH = 102;           /* low hips behind the balustrade */
    var PAVR = 110;            /* corner pavilion hips */
    var WPAV = 100, WPAVR = 120;/* the west pavilion: taller wall and roof */
    var DRUM = 134, DRUMC = 138, DOME = 178, LANT = 186, TORCH = TOP_FT;

    /* ---------- plan, feet from the bbox centre, from the GIS ---------- */
    var WX = -181, EX = 134, NY = 226, SY = -226;   /* the main wall planes */
    var CP_W = 71.5, CP_X = -215, CP_COL = -219;     /* west centre pavilion */
    var CR = 11;                                     /* corner pavilions proud */
    var CRW = 59;                                    /* corner pavilion width */
    var CT_X0 = -135, CT_X1 = -34;                   /* west courts */
    var CT_S0 = -168, CT_S1 = -17, CT_N0 = 40, CT_N1 = 133;
    var RC = [-3.5, 11.5], RA = 76;                  /* rotunda centre, apothem */
    var RR = RA / Math.cos(Math.PI / 8);             /* circumradius */
    var E1X = 167, E1W = 75;                         /* east projection, 150 wide */
    var E2X = 219, E2W = 35.5;                       /* deeper east projection */

    var NEAR = 5e5;
    function atDepth(list, d) {
      return list.map(function (it, ix) { return { svg: it.svg, depth: d + ix * 0.01 }; });
    }
    function box(u0, u1, v0, v1, z0, z1, fill, depth, tu, tv) {
      var wu = u1 - u0, wv = v1 - v0;
      return H.prism(ctx, X((u0 + u1) / 2), Y((v0 + v1) / 2), W(wu), W(wv),
                     W(tu === undefined ? wu : tu), W(tv === undefined ? wv : tv),
                     Z(z0), Z(z1 - z0), fill, STONE_E, depth);
    }

    /* ---------- ground: the block, First Street to the west ---------- */
    items.push({ svg: ctx.poly([ctx.project(X(-330), Y(-300), 0), ctx.project(X(300), Y(-300), 0),
                                ctx.project(X(300), Y(300), 0), ctx.project(X(-330), Y(300), 0)],
                               LAWN, STONE_E, 0.4), depth: -1e9 + 1 });
    items.push({ svg: ctx.poly([ctx.project(X(-330), Y(-300), 0.1), ctx.project(X(-235), Y(-300), 0.1),
                                ctx.project(X(-235), Y(300), 0.1), ctx.project(X(-330), Y(300), 0.1)],
                               PAVE, null, 0), depth: -1e9 + 2 });
    /* the forecourt paving between the street and the stair */
    items.push({ svg: ctx.poly([ctx.project(X(-235), Y(-110), 0.1), ctx.project(X(CP_COL), Y(-110), 0.1),
                                ctx.project(X(CP_COL), Y(110), 0.1), ctx.project(X(-235), Y(110), 0.1)],
                               PAVE, null, 0), depth: -1e9 + 3 });

    /* ---------- shadow ---------- */
    items.push({ svg: H.shadow(ctx, [[X(CP_X), Y(SY - CR)], [X(EX + CR), Y(SY - CR)], [X(EX + CR), Y(-E1W)],
                                     [X(E2X), Y(-E2W)], [X(E2X), Y(E2W)], [X(EX + CR), Y(E1W)],
                                     [X(EX + CR), Y(NY + CR)], [X(CP_X), Y(NY + CR)]], Z(BAL)).svg,
                 depth: -1e9 + 4 });

    /* ---------- masses ---------- */
    var RANGES = [
      [WX, CT_X0, SY, NY],                 /* west range, full length */
      [EX - 46, EX, SY, NY],               /* east range */
      [CT_X0, EX - 46, SY, CT_S0],         /* south range between */
      [CT_X0, EX - 46, CT_N1, NY],         /* north range between */
      [CT_X0, CT_X1 + 8, CT_S1, CT_N0],    /* the Great Hall spine to the rotunda */
      [CT_X1, EX - 46, CT_S1, CT_N0],      /* the corridor on to the east range */
    ];
    var PAVS = [
      [CP_X, WX, -CP_W, CP_W, WPAV, WPAVR, "west"],        /* west centre pavilion */
      [WX - CR, WX - CR + CRW, NY - CRW + CR, NY + CR, BAL, PAVR, "nw"],
      [WX - CR, WX - CR + CRW, SY - CR, SY - CR + CRW, BAL, PAVR, "sw"],
      [EX + CR - CRW, EX + CR, NY - CRW + CR, NY + CR, BAL, PAVR, "ne"],
      [EX + CR - CRW, EX + CR, SY - CR, SY - CR + CRW, BAL, PAVR, "se"],
      [EX, E1X, -E1W, E1W, BAL, ROOFH, "e1"],              /* east projection */
      [E1X, E2X, -E2W, E2W, BAL, ROOFH, "e2"],             /* deeper east projection */
    ];
    function mass(u0, u1, v0, v1, top) {
      items = items.concat(box(u0 - 1.5, u1 + 1.5, v0 - 1.5, v1 + 1.5, GRD, 2.5, RUST));
      items = items.concat(box(u0 - 0.6, u1 + 0.6, v0 - 0.6, v1 + 0.6, 2.5, GS, RUST));
      items = items.concat(box(u0, u1, v0, v1, GS, top, GRAN));
    }
    RANGES.forEach(function (r) { mass(r[0], r[1], r[2], r[3], AT); });
    PAVS.forEach(function (q) { mass(q[0], q[1], q[2], q[3], q[4] === BAL ? AT : q[4] - 12); });
    /* the bookstack wings north and south of the rotunda, which are what
       divide the core into the four courtyards aoc.gov describes */
    mass(RC[0] - 22, RC[0] + 22, CT_N0, CT_N1, AT - 6);
    mass(RC[0] - 22, RC[0] + 22, CT_S0, CT_S1, AT - 6);

    /* ---------- horizontal breaks and the balustrade, outer faces ----------
       Each strip carries its outward normal and is culled with its wall. */
    var OUTER = [
      [WX - 1, WX, SY, NY, -1, 0], [EX, EX + 1, SY, NY, 1, 0],
      [WX, EX, SY - 1, SY, 0, -1], [WX, EX, NY, NY + 1, 0, 1],
    ];
    PAVS.forEach(function (q) {
      var k = q[6];
      if (k === "west")           OUTER.push([q[0] - 1, q[0], q[2], q[3], -1, 0], [q[0], q[1], q[2] - 1, q[2], 0, -1], [q[0], q[1], q[3], q[3] + 1, 0, 1]);
      else if (k === "nw")        OUTER.push([q[0] - 1, q[0], q[2], q[3], -1, 0], [q[0], q[1], q[3], q[3] + 1, 0, 1]);
      else if (k === "sw")        OUTER.push([q[0] - 1, q[0], q[2], q[3], -1, 0], [q[0], q[1], q[2] - 1, q[2], 0, -1]);
      else if (k === "ne")        OUTER.push([q[1], q[1] + 1, q[2], q[3], 1, 0], [q[0], q[1], q[3], q[3] + 1, 0, 1]);
      else if (k === "se")        OUTER.push([q[1], q[1] + 1, q[2], q[3], 1, 0], [q[0], q[1], q[2] - 1, q[2], 0, -1]);
      else                        OUTER.push([q[1], q[1] + 1, q[2], q[3], 1, 0], [q[0], q[1], q[2] - 1, q[2], 0, -1], [q[0], q[1], q[3], q[3] + 1, 0, 1]);
    });
    OUTER.forEach(function (f) {
      if (!ctx.faceVisible(f[4], f[5])) return;
      var west = f[0] <= CP_X + 1 && f[1] <= CP_X + 1;
      items = items.concat(box(f[0], f[1], f[2], f[3], GS - 1.5, GS, TRIM, NEAR + 8));
      items = items.concat(box(f[0], f[1], f[2], f[3], PN - 1.2, PN, TRIM, NEAR + 9));
      items = items.concat(box(f[0], f[1], f[2], f[3], SF - 1.2, SF, TRIM, NEAR + 9));
      var top = west ? WPAV : AT;
      /* the entablature, 2.5 ft proud, and the balustrade above it */
      var e = [f[0] - (f[4] < 0 ? 2.5 : 0), f[1] + (f[4] > 0 ? 2.5 : 0),
               f[2] - (f[5] < 0 ? 2.5 : 0), f[3] + (f[5] > 0 ? 2.5 : 0)];
      items = items.concat(box(e[0], e[1], e[2], e[3], top, top + 8, TRIM, NEAR + 10));
      /* balustrade: a rail with posts, read at map scale as a pale band with gaps */
      var along = f[4] ? (f[3] - f[2]) : (f[1] - f[0]);
      var n = Math.max(2, Math.round(along / 8));
      for (var i = 0; i <= n; i++) {
        var a = (f[4] ? f[2] : f[0]) + (along * i) / n;
        var u = f[4] ? f[0] + (f[4] > 0 ? 1.5 : -0.5) : a, v = f[5] ? f[2] + (f[5] > 0 ? 1.5 : -0.5) : a;
        items = items.concat(box(u - 0.9, u + 0.9, v - 0.9, v + 0.9, top + 8, top + 13, BALUS, NEAR + 11));
      }
      items = items.concat(box(e[0], e[1], e[2], e[3], top + 13, top + 14, BALUS, NEAR + 12));
    });

    /* ---------- windows: arched arcade with keystones, tall piano nobile,
       square second floor; one bay per 15 ft on every outer face ---------- */
    var BAY = 15, nWin = 0, nKey = 0;
    function facade(nx, ny, a0, a1, c, depBase, tall) {
      if (!ctx.faceVisible(nx, ny)) return;
      var along = a1 - a0, n = Math.max(1, Math.round(along / BAY)), bay = along / n;
      for (var i = 0; i < n; i++) {
        var mid = a0 + (i + 0.5) * bay;
        var wu = nx ? c + nx * 0.5 : mid, wv = ny ? c + ny * 0.5 : mid;
        var du = nx ? 0.6 : 6.5, dv = ny ? 0.6 : 6.5;
        /* ground arcade: an opening with a rounded head (tapered top) and a
           keystone block, which is where the 33 carved heads sit */
        items = items.concat(box(wu - du / 2, wu + du / 2, wv - dv / 2, wv + dv / 2, GRD + 5, GS - 8, GLASS, depBase + 40));
        /* a round head in two tapers: to 75 percent, then to a quarter, which
           reads as a curve where one taper read as a gable */
        items = items.concat(box(wu - du / 2, wu + du / 2, wv - dv / 2, wv + dv / 2, GS - 8, GS - 6, GLASS, depBase + 41,
                                 nx ? 0.6 : 4.9, ny ? 0.6 : 4.9));
        items = items.concat(box(wu - (nx ? 0.3 : 2.45), wu + (nx ? 0.3 : 2.45), wv - (ny ? 0.3 : 2.45), wv + (ny ? 0.3 : 2.45), GS - 6, GS - 4.5, GLASS, depBase + 41,
                                 nx ? 0.6 : 1.6, ny ? 0.6 : 1.6));
        /* the keystone, where the carved head sits: a dark block 2 ft proud,
           so it survives map scale instead of blending into the wall */
        items = items.concat(box(wu - (nx ? 1.0 : 1.4), wu + (nx ? 1.0 : 1.4), wv - (ny ? 1.0 : 1.4), wv + (ny ? 1.0 : 1.4),
                                 GS - 5.2, GS - 1.8, KEY, depBase + 42));
        nKey++;
        /* piano nobile: a tall arched window, 8 ft wide, 18 ft high */
        var tu = nx ? 0.6 : 8, tv = ny ? 0.6 : 8;
        items = items.concat(box(wu - tu / 2, wu + tu / 2, wv - tv / 2, wv + tv / 2, GS + 3, PN - 7, GLASS, depBase + 43));
        items = items.concat(box(wu - tu / 2, wu + tu / 2, wv - tv / 2, wv + tv / 2, PN - 7, PN - 5, GLASS, depBase + 44,
                                 nx ? 0.6 : 6, ny ? 0.6 : 6));
        items = items.concat(box(wu - (nx ? 0.3 : 3), wu + (nx ? 0.3 : 3), wv - (ny ? 0.3 : 3), wv + (ny ? 0.3 : 3), PN - 5, PN - 3.5, GLASS, depBase + 44,
                                 nx ? 0.6 : 2, ny ? 0.6 : 2));
        /* second floor: a square window */
        var su = nx ? 0.6 : 6, sv = ny ? 0.6 : 6;
        items = items.concat(box(wu - su / 2, wu + su / 2, wv - sv / 2, wv + sv / 2, PN + 3, SF - 4, GLASS, depBase + 45));
        /* the attic: a small square window per bay, the fourth storey */
        items = items.concat(box(wu - (nx ? 0.3 : 2.2), wu + (nx ? 0.3 : 2.2), wv - (ny ? 0.3 : 2.2), wv + (ny ? 0.3 : 2.2), SF + 2.5, (tall ? WPAV : AT) - 2.5, GLASS, depBase + 46));
        nWin += 4;
        /* the pilaster between bays on the upper floors */
        if (i < n - 1) {
          var pa = a0 + (i + 1) * bay;
          var pu = nx ? c + nx * 0.8 : pa, pv = ny ? c + ny * 0.8 : pa;
          items = items.concat(box(pu - 1.2, pu + 1.2, pv - 1.2, pv + 1.2, GS, (tall ? WPAV : AT) - 1, COLUMN, depBase + 30));
        }
      }
    }
    /* west front between the pavilions */
    facade(-1, 0, SY - CR + CRW, -CP_W, WX, NEAR);
    facade(-1, 0, CP_W, NY - CRW + CR, WX, NEAR);
    facade(-1, 0, NY - CRW + CR, NY + CR, WX - CR, NEAR + 100);   /* nw pavilion west face */
    facade(-1, 0, SY - CR, SY - CR + CRW, WX - CR, NEAR + 100);   /* sw */
    facade(0, 1, WX - CR + CRW, EX + CR - CRW, NY, NEAR);         /* north wall */
    facade(0, 1, WX - CR, WX - CR + CRW, NY + CR, NEAR + 100);
    facade(0, 1, EX + CR - CRW, EX + CR, NY + CR, NEAR + 100);
    facade(0, -1, WX - CR + CRW, EX + CR - CRW, SY, NEAR);        /* south wall */
    facade(0, -1, WX - CR, WX - CR + CRW, SY - CR, NEAR + 100);
    facade(0, -1, EX + CR - CRW, EX + CR, SY - CR, NEAR + 100);
    facade(1, 0, SY - CR + CRW, -E1W, EX, NEAR);                  /* east wall */
    facade(1, 0, E1W, NY - CRW + CR, EX, NEAR);
    facade(1, 0, NY - CRW + CR, NY + CR, EX + CR, NEAR + 100);
    facade(1, 0, SY - CR, SY - CR + CRW, EX + CR, NEAR + 100);
    facade(1, 0, -E1W, -E2W, E1X, NEAR + 100);                    /* east projection faces */
    facade(1, 0, E2W, E1W, E1X, NEAR + 100);
    facade(1, 0, -E2W, E2W, E2X, NEAR + 120);
    facade(0, 1, E1X, E2X, E2W, NEAR + 110);
    facade(0, -1, E1X, E2X, -E2W, NEAR + 110);
    facade(0, 1, EX, E1X, E1W, NEAR + 100);
    facade(0, -1, EX, E1X, -E1W, NEAR + 100);

    /* ---------- the west pavilion: three arches, paired Corinthian columns,
       the split stair and the Neptune fountain ---------- */
    if (ctx.faceVisible(-1, 0)) {
      /* three arched openings at ground level, the carriage entrance */
      for (var ai = -1; ai <= 1; ai++) {
        var av = ai * 24;
        items = items.concat(box(CP_X - 0.5, CP_X + 0.5, av - 8, av + 8, GRD + 2, GS - 6, GLASS, NEAR + 140));
        items = items.concat(box(CP_X - 0.5, CP_X + 0.5, av - 8, av + 8, GS - 6, GS - 3, GLASS, NEAR + 141, 0.5, 3));
      }
      /* the loggia above: three great arches between four PAIRS of columns */
      for (var bi = -1; bi <= 1; bi++) {
        var bv = bi * 24;
        items = items.concat(box(CP_X - 0.6, CP_X + 0.6, bv - 9, bv + 9, GS + 4, WPAV - 22, GLASS, NEAR + 142));
        items = items.concat(box(CP_X - 0.6, CP_X + 0.6, bv - 9, bv + 9, WPAV - 22, WPAV - 17, GLASS, NEAR + 143, 0.6, 3));
      }
      /* the loggia is a VOID behind the columns: a dark plane on the
         pavilion face so the columns stand in front of something */
      items = items.concat(box(CP_X - 0.8, CP_X, -CP_W + 6, CP_W - 6, GS + 2, WPAV - 14, VOID, NEAR + 145));
      for (var ci = 0; ci < 4; ci++) {
        var cv = -36 + ci * 24;
        for (var k = -1; k <= 1; k += 2) {
          var u = CP_COL + 1.5, v = cv + k * 3.0;
          items = items.concat(box(u - 2.4, u + 2.4, v - 2.4, v + 2.4, GS, GS + 2, CAP, NEAR + 150));
          items = items.concat(atDepth(H.ngon(ctx, X(u), Y(v), W(2.2), Z(GS + 2), Z(WPAV - 14 - GS - 2), 8, COLUMN, STONE_E, { noTop: true }), NEAR + 151));
          items = items.concat(box(u - 2.8, u + 2.8, v - 2.8, v + 2.8, WPAV - 14, WPAV - 11, CAP, NEAR + 152));
        }
      }
      /* the entablature they carry, and the attic above with its own cornice */
      items = items.concat(box(CP_COL - 1, CP_X, -CP_W, CP_W, WPAV - 11, WPAV - 6, TRIM, NEAR + 156));
      items = items.concat(box(CP_X - 3, CP_X, -CP_W, CP_W, WPAV - 6, WPAV, GRAN, NEAR + 157));
      /* square attic windows over each bay */
      for (var wi = -3; wi <= 3; wi++) {
        items = items.concat(box(CP_X - 0.5, CP_X + 0.5, wi * 18 - 3, wi * 18 + 3, WPAV - 5, WPAV - 1, GLASS, NEAR + 158));
      }
    }
    /* the split stair: twelve slabs climbing to the piano nobile terrace,
       parting round the fountain basin at the foot */
    for (var st = 0; st < 12; st++) {
      var z0 = st * 1.2, d = 40 - st * 3;
      items = items.concat(box(CP_COL - d, CP_COL - d + 3.2, -CP_W + st * 1.5, -22 + st * 0.4, z0, z0 + 1.2, RUST));
      items = items.concat(box(CP_COL - d, CP_COL - d + 3.2, 22 - st * 0.4, CP_W - st * 1.5, z0, z0 + 1.2, RUST));
    }
    items = items.concat(box(CP_COL - 6, CP_COL, -CP_W + 18, CP_W - 18, 12, 15, RUST));   /* the landing */
    /* the Court of Neptune: a basin of dark water and three bronze figures */
    items = items.concat(atDepth(H.ngon(ctx, X(CP_COL - 24), Y(0), W(16), Z(0.2), Z(2.2), 12, RUST, STONE_E), -1e9 + 6));
    items = items.concat(atDepth(H.ngon(ctx, X(CP_COL - 24), Y(0), W(14.5), Z(2.2), Z(0.6), 12, WATER, null), -1e9 + 7));
    items = items.concat(box(CP_COL - 16, CP_COL - 12, -3, 3, 2.8, 12, BRONZE));
    items = items.concat(box(CP_COL - 20, CP_COL - 17, -18, -14, 2.8, 8, BRONZE));
    items = items.concat(box(CP_COL - 20, CP_COL - 17, 14, 18, 2.8, 8, BRONZE));

    /* ---------- roofs: low hips behind the balustrade, taller on pavilions ---------- */
    RANGES.forEach(function (r) {
      var wu = r[1] - r[0], wv = r[3] - r[2];
      /* the hip covers the mass to within 2 ft of the balustrade: a wider
         inset left the wall's own flat top showing as a plateau round it */
      items = items.concat(box(r[0] + 1, r[1] - 1, r[2] + 1, r[3] - 1, AT + 8, ROOFH, ROOF, undefined,
                               Math.max(6, wu - 22), Math.max(6, wv - 22)));
    });
    PAVS.forEach(function (q) {
      var wu = q[1] - q[0], wv = q[3] - q[2];
      var base = q[6] === "west" ? WPAV : AT + 8;
      items = items.concat(box(q[0] + 1, q[1] - 1, q[2] + 1, q[3] - 1, base, q[5], ROOF, undefined,
                               Math.max(6, wu - 20), Math.max(6, wv - 20)));
    });

    /* ---------- the rotunda: octagonal drum, dome, lantern, torch ---------- */
    var rx = X(RC[0]), ry = Y(RC[1]);
    /* the drum, with a great arched window in every face: dark panels a
       little proud of an eight-sided prism */
    items = items.concat(H.ngon(ctx, rx, ry, W(RR), Z(AT), Z(DRUM - AT), 8, GRAN, STONE_E, { noTop: true }));
    for (var di = 0; di < 8; di++) {
      var ang = (di + 0.5) / 8 * Math.PI * 2;
      var nx = Math.cos(ang), ny = Math.sin(ang);
      if (!ctx.faceVisible(nx, ny)) continue;
      var cx = RC[0] + (RA + 0.8) * nx, cy = RC[1] + (RA + 0.8) * ny;
      /* a tall arched panel across the face: a quad plus a narrower head,
         a hair proud of the drum, at its own natural depth so it paints after
         the face behind it and never over anything in front of the drum.
         The first draft's four corners were (low, high, high, low): a line,
         not a window, and the critic found a blank drum. */
      var hw = 22, lo = DRUM - 40, hi = DRUM - 12, tp = DRUM - 7;
      function pt(t, z) { return ctx.project(X(cx + t * (-ny)), Y(cy + t * nx), Z(z)); }
      var q1 = [pt(-hw, lo), pt(hw, lo), pt(hw, hi), pt(-hw, hi)];
      var q2 = [pt(-hw, hi), pt(hw, hi), pt(hw * 0.35, tp), pt(-hw * 0.35, tp)];
      items.push({ svg: ctx.poly(q1, ctx.shade(GLASS, nx, ny, 0), STONE_E, 0.4), depth: H.depthOf(q1) + 0.5 });
      items.push({ svg: ctx.poly(q2, ctx.shade(GLASS, nx, ny, 0), STONE_E, 0.4), depth: H.depthOf(q2) + 0.5 });
      /* the pier between windows, standing proud, so the drum reads as
         arches on piers and not as a dark band */
      var pa = (di + 1) / 8 * Math.PI * 2;
      var px = RC[0] + (RR + 1.2) * Math.cos(pa), py = RC[1] + (RR + 1.2) * Math.sin(pa);
      items = items.concat(box(px - 2.5, px + 2.5, py - 2.5, py + 2.5, AT, DRUM - 4, COLUMN));
    }
    items = items.concat(H.ngon(ctx, rx, ry, W(RR + 3), Z(DRUM), Z(DRUMC - DRUM), 8, TRIM, STONE_E));
    /* a low parapet ring, then the dome */
    items = items.concat(H.ngon(ctx, rx, ry, W(RR - 1), Z(DRUMC), Z(3), 16, COPPER_D, STONE_E, { noTop: true }));
    items = items.concat(H.dome(ctx, rx, ry, W(RR - 2), Z(DRUMC + 3), Z(DOME - DRUMC - 3), COPPER, STONE_E));
    /* the lantern: a small drum with a cap */
    items = items.concat(H.ngon(ctx, rx, ry, W(9), Z(DOME - 2), Z(LANT - DOME + 2), 8, GRAN, STONE_E));
    items = items.concat(H.ngon(ctx, rx, ry, W(10.5), Z(LANT), Z(1.5), 8, TRIM, STONE_E));
    items = items.concat(H.ngon(ctx, rx, ry, W(8), Z(LANT + 1.5), Z(2.5), 8, COPPER, STONE_E, { r1: W(3) }));
    /* the Torch of Learning: 12 ft overall, the torch 4 ft, gilded */
    items = items.concat(H.ngon(ctx, rx, ry, W(2.4), Z(LANT + 4), Z(TORCH - 4 - (LANT + 4)), 8, GOLD, null, { r1: W(1.6) }));
    items = items.concat(H.ngon(ctx, rx, ry, W(3.2), Z(TORCH - 4), Z(4), 8, GOLD, null, { r1: W(0.8) }));

    ctx.note = ctx.note || {};
    ctx.note.loc = { windows: nWin, keystones: nKey };
    return items;
  };
})();
