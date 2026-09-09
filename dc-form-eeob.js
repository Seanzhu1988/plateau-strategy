/* dc-form-eeob.js: the Eisenhower Executive Office Building, the State, War
 * and Navy Building of 1871 to 1888, next door to the White House.
 *
 * [SEAN 2026-09-08: "eisenhower executive office building and Library of
 * Congress added to the National Mall tour."]
 *
 * Alfred B. Mullett, Supervising Architect of the Treasury, in the French
 * Second Empire style: a rectangle of grey granite around two courtyards with
 * a wing across the middle, four tiers of paired columns between the windows,
 * slate mansard roofs, and taller centre pavilions on every front. Built by
 * four supervising architects in turn, Mullett 1869-74, William Potter 1875,
 * Orville Babcock 1875-77 and Thomas Lincoln Casey 1877-88, the last of whom
 * was finishing the Washington Monument at the same time and went on to the
 * Library of Congress. It was the largest office building in Washington when
 * it opened. Truman called it the greatest monstrosity in America in 1958; it
 * became a National Historic Landmark in 1971 and was renamed for Eisenhower
 * on 9 November 1999.
 *
 * ================= PUBLISHED, with the source for each =================
 * The fast-facts page of the George W. Bush White House archive
 * (georgewbush-whitehouse.archives.gov/history/eeobtour/facts.html):
 *   East and west facades      523 ft 2.75 in
 *   North and south facades    285 ft 10.75 in
 *   Centre pavilions, E and W  134 ft 7 in above the pavement   <- TOP_FT
 *   Courtyards                 103 ft 5.56 in by 139 ft 1.88 in, two of them
 *   Levels                     7: basement, ground, 1 to 5
 *   Exterior columns           900
 *   Exterior windows           1,572
 *   Rooms                      553
 *   Walls                      3 ft 10 in thick; 2 ft 10 in between piers
 *   Chimneys                   30, exterior, cast iron
 *   Granite                    Fox Islands (Maine) and Richmond (Virginia)
 *   Cost                       $10,038,482.42
 * The building-stats page of the same archive: 662,598 gross sq ft; 65
 * staircases, 1,784 steps, 4,004 bronze balusters; corridors 9,160 ft 1 in.
 * GSA (gsa.gov, historic buildings): "on each elevation a central section
 * eight stories high, flanked by six story wings"; 16 ft ceilings; window
 * frames, exterior roof sculpture, cornices and roof trim are cast iron;
 * "tiers of porticoes, paired Doric and Ionic colonnades"; slate mansards.
 * DC GIS footprint carried by OSM relation wikidata Q1312965 (dcgis:gis
 * HSE_0301): the plan below, in feet from the bounding-box centre. Its
 * overall box is 288 x 512 ft against the published 286 x 523, so the plan
 * is scaled to the published numbers, x by 0.993 and y by 1.022.
 *
 * ================= DISAGREEMENTS, both recorded =================
 * Fireplaces: 74 on the fast-facts page, 151 originally (83 remaining) on
 * the building-stats page. Floor area: 662,598 GSF (archive) against 692,000
 * sq ft (GSA). Granite: Wikipedia says Vinalhaven, Maine; the DC preservation
 * office says purple-grey Virginia granite; the fast-facts page names BOTH
 * quarries, which settles it. Neither disagreement touches the geometry.
 *
 * ================= DERIVED, and named as such =================
 * The wing roofline is not published anywhere found. It is drawn at 101 ft,
 * six eighths of the published 134 ft 7 in, because GSA publishes the wings
 * as six storeys and the pavilions as eight. Floor lines are derived from the
 * published 16 ft ceilings. Pavilion widths and projections are read off the
 * GIS plan (east centre pavilion 61 ft wide, 21 ft proud; corner pavilions
 * 42 ft long, 21 ft proud, set 30 ft in from the ends; north centre 66 ft
 * wide, 10 ft proud; south centre 64 ft wide, 24 ft proud). The GIS shows the
 * west centre section flush with recessed areaways beside it; photographs of
 * the 17th Street front show a projecting centre pavilion with its portico,
 * so the west centre is drawn mirroring the east and this is a judgment.
 * Column spacing: 900 columns over four tiers on the main fronts works out
 * to a pier about every 14 ft with the columns in PAIRS, which is what the
 * building does; the model draws 912. Column diameter is not published and
 * is drawn at 2 ft. Corner pavilion roofs are drawn 7 ft taller than the
 * wings, because in every photograph they are, and the pavilion roof stages
 * (mansard, attic, cap) are proportioned by eye to the published 134 ft 7 in.
 *
 * ================= THE CHECKLIST, answered =================
 * 1 counts as objects: 912 columns in 456 PAIRS, one window per bay per
 *   tier, 30 chimneys, one dormer per bay in every mansard. A pair is drawn
 *   as two 2.8 ft shafts with a dark groove between them on a block standing
 *   2 ft proud of the wall, because at 900 px a 523 ft front gives a real
 *   2 ft column three pixels, and the first draft's critic found a flat wall.
 *   NAMED GAP: at whole-building scale the pairs read as a bright pier
 *   rhythm with relief; the two shafts and the groove resolve only when the
 *   viewer zooms in (about 4x). A 5.6 ft pair on a 523 ft front is under
 *   seven pixels wide at 1000 px, and no palette changes that.
 * 2 breaks: water table, four string courses at the floor lines, main
 *   cornice, pavilion cornices, mansard curbs.
 * 3 base: a granite plinth on every range, rustication drawn as courses on
 *   the ground storey, and eight steps descending from a podium at the east
 *   and west entrance porches, which are two tiers of columns.
 * 4 roof: slate mansards with dormers on every range, a taller three-stage
 *   roof on each centre pavilion, taller caps on the corner pavilions, cast
 *   iron cresting, 30 chimneys. Nothing here is a flat lid.
 * 5 tones: ctx.shade on every face; granite, slate, iron and glass.
 * 6 shadow: one ground shadow from the whole footprint.
 * 7 height TRUE: 134 ft 7 in at the pavilions, 41.0 m in dc-3d.js.
 * 8 openings: glass three tones darker than the granite.
 * 9 the thing a visitor names: the tiers of paired columns and the mansards,
 *   which is the whole Second Empire look.
 *
 * Frame: the Mall's, x east, +y NORTH, metres, origin at the Washington
 * Monument. The building runs long north-south along 17th Street; its
 * east front faces the White House. Painter's rule: big masses at natural
 * depth; attachments on the OUTER faces only, at NEAR ladders, and never on
 * the court faces, where a far range's windows would paint over the near
 * range's wall. */
(function () {
  var H = window.DC3D && window.DC3D.helpers;
  if (!H) return;
  window.DC_FORMS = window.DC_FORMS || {};

  window.DC_FORMS['eeob'] = function (ctx, p, s, VE) {
    var items = [];
    var TOP_FT = 134.58;                /* published: 134 ft 7 in, the pavilions */
    var FT = (p.h * VE) / TOP_FT;
    var m  = FT * s;

    function X(u) { return p.x + u * m; }
    function Y(v) { return p.y + v * m; }
    function Z(z) { return z * FT; }
    function W(w) { return w * m; }

    /* ---------- palette: grey granite, slate, cast iron ---------- */
    var GRAN    = "#b1aea6";   /* Fox Islands granite in sun; a step darker than
                                  the first draft so the columns can stand off it */
    var GRAN_D  = "#a3a099";   /* the same on a turned face (via ctx.shade) */
    var RUST    = "#aeaba3";   /* the rusticated ground storey, a step darker */
    var TRIM    = "#a29f97";   /* string courses and cornices */
    var COLUMN  = "#efece4";   /* columns catch the light. The first draft put
                                  them 20 levels above the wall and an architecture
                                  critic could not find them at map scale; 60 now */
    var CAP     = "#e2dfd6";
    var GROOVE  = "#5a5751";   /* the dark slot between the two columns of a pair,
                                  which is what makes a pair read as two */
    var SLATE   = "#5c6066";   /* the mansards. A visitor names the roofs, so
                                  they get real contrast, unlike the White House */
    var SLATE_L = "#54585e";   /* the flat deck behind the curb; lighter than the
                                  slope only by the top-face shade, or the roof
                                  reads as a plate with holes in it */
    var IRON    = "#4a4948";   /* chimneys and cresting */
    var DORMER  = "#b4b1a9";
    var GLASS   = "#3d4550";
    var STONE_E = "#8f8c85";   /* edges */
    var PAVE    = "#d9d5cc";
    var LAWN    = "#c7d2bb";

    /* ---------- levels, feet above the pavement ---------- */
    var GRD  = 0;
    var L1   = 16;        /* the rusticated ground storey, 16 ft ceilings */
    var L2   = 33, L3 = 50, L4 = 67;
    var WALL = 84;        /* top of the fourth column tier */
    var CORN = 88;        /* main cornice slab */
    var WING = 101;       /* DERIVED wing roofline, see header */
    var CRNR = 108;       /* corner pavilion mansard top, derived */
    var WALL5 = 102;      /* centre pavilions carry a FIFTH column tier: GSA's
                             "eight stories" against the wings' six, derived */
    var CORN5 = 106;      /* their cornice */
    var PAV3 = TOP_FT;    /* the crested top of their mansard: PUBLISHED */

    /* ---------- plan, feet from the bbox centre; GIS scaled to published ---- */
    var SX = 285.9 / 288, SY = 523.23 / 512;
    var HX = 122 * SX;               /* main wall plane, east and west */
    /* The north wall is at 247 ft on the GIS and the south at 231: the
       building is 16 ft longer north of its centre than south, which is why
       the north centre pavilion projects 9 ft and the south one 26. One
       symmetric HY put both at 6 ft and inverted their roof tapers into
       bow ties; a rendering reviewer found it by instrumenting H.prism. */
    var HYN = 247 * SY, HYS = -231 * SY;
    /* pavilions are MASSES, not skins: each runs 60 ft back into its range
       (corners 50), so its taller roof rises out of the wing roof as a real
       pavilion and not as a slab standing in front of the wall */
    var PDEEP = 60, CDEEP = 50;
    var CRT_X = 51.7, CRT_Y0 = 33, CRT_Y1 = 33 + 139.16;   /* published courts */
    var PAVX = 143 * SX;             /* pavilions proud of the E/W walls */
    var HY = HYN;                    /* kept for the chimney and porch code that reads one HY */
    var CP_W = 61 * SY / 2;          /* E/W centre pavilion half width */
    var CR_Y0 = 175 * SY, CR_Y1 = 217 * SY;   /* corner pavilions along y */
    var NP_HW = 33 * SX, NP_OUT = 256 * SY;   /* north centre, 10 ft proud */
    var SP_HW = 32 * SX, SP_OUT = 261.6;      /* south centre, published half length */

    var NEAR = 5e5;
    function atDepth(list, d) {
      return list.map(function (it, ix) { return { svg: it.svg, depth: d + ix * 0.01 }; });
    }
    /* a box from its bounds; depth optional */
    function box(u0, u1, v0, v1, z0, z1, fill, depth, tu, tv) {
      var wu = u1 - u0, wv = v1 - v0;
      return H.prism(ctx, X((u0 + u1) / 2), Y((v0 + v1) / 2), W(wu), W(wv),
                     W(tu === undefined ? wu : tu), W(tv === undefined ? wv : tv),
                     Z(z0), Z(z1 - z0), fill, STONE_E, depth);
    }

    /* ---------- ground ---------- */
    items.push({ svg: ctx.poly([ctx.project(X(-230), Y(-330), 0), ctx.project(X(230), Y(-330), 0),
                                ctx.project(X(230), Y(330), 0), ctx.project(X(-230), Y(330), 0)],
                               PAVE, STONE_E, 0.4), depth: -1e9 + 1 });
    /* the White House grounds begin just east; a strip of lawn says so */
    items.push({ svg: ctx.poly([ctx.project(X(165), Y(-330), 0.1), ctx.project(X(230), Y(-330), 0.1),
                                ctx.project(X(230), Y(330), 0.1), ctx.project(X(165), Y(330), 0.1)],
                               LAWN, null, 0), depth: -1e9 + 2 });

    /* ---------- shadow, thrown from the wing roofline ---------- */
    items.push({ svg: H.shadow(ctx, [[X(-PAVX), Y(-SP_OUT)], [X(PAVX), Y(-SP_OUT)],
                                     [X(PAVX), Y(NP_OUT)], [X(-PAVX), Y(NP_OUT)]], Z(CRNR)).svg,
                 depth: -1e9 + 4 });

    /* ---------- the masses: four ranges, the cross wing, six pavilions ---------- */
    /* ranges: walls to WALL, natural depth */
    /* The long ranges run the full length; the short ones and the cross
       wing run only BETWEEN them, so no two roofs overlap. Drawn overlapping,
       the mansard slopes painted through each other as a lattice of lines. */
    var RANGES = [
      [-HX, -CRT_X, HYS, HYN],         /* west range */
      [ CRT_X, HX, HYS, HYN],          /* east range */
      [-CRT_X, CRT_X, HYS, -CRT_Y1],   /* south range, between them */
      [-CRT_X, CRT_X, CRT_Y1, HYN],    /* north range */
      [-CRT_X, CRT_X, -CRT_Y0, CRT_Y0],/* the cross wing */
    ];
    var PAVS = [
      /* [u0,u1,v0,v1, roofTop, kind], each running back into its range */
      [ HX - PDEEP, PAVX, -CP_W, CP_W, PAV3, "centre"],    /* east centre, faces the White House */
      [-PAVX, -HX + PDEEP, -CP_W, CP_W, PAV3, "centre"],   /* west centre, 17th Street */
      [ HX - CDEEP, PAVX,  CR_Y0,  CR_Y1, CRNR, "corner"],
      [ HX - CDEEP, PAVX, -CR_Y1, -CR_Y0, CRNR, "corner"],
      [-PAVX, -HX + CDEEP,  CR_Y0,  CR_Y1, CRNR, "corner"],
      [-PAVX, -HX + CDEEP, -CR_Y1, -CR_Y0, CRNR, "corner"],
      [-NP_HW, NP_HW, HYN - PDEEP, NP_OUT, PAV3, "centre"],   /* north centre, Pennsylvania Ave, 9 ft proud */
      [-SP_HW, SP_HW, -SP_OUT, HYS + PDEEP, PAV3, "centre"],  /* south centre, State Place, 26 ft proud */
    ];

    RANGES.forEach(function (r) {
      /* plinth, a hair proud, then the rusticated ground storey, then the wall */
      items = items.concat(box(r[0] - 1.5, r[1] + 1.5, r[2] - 1.5, r[3] + 1.5, GRD, 3, RUST));
      items = items.concat(box(r[0] - 0.8, r[1] + 0.8, r[2] - 0.8, r[3] + 0.8, 3, L1, RUST));
      /* the wall runs up to the cornice line, not to the last column tier:
         stopped at WALL with the mansard starting at CORN, the four foot gap
         showed the wall's own top face as a light plate all round the
         pavilions and the courts */
      items = items.concat(box(r[0], r[1], r[2], r[3], L1, CORN, GRAN));
    });
    PAVS.forEach(function (q) {
      items = items.concat(box(q[0] - 1.5, q[1] + 1.5, q[2] - 1.5, q[3] + 1.5, GRD, 3, RUST));
      items = items.concat(box(q[0] - 0.8, q[1] + 0.8, q[2] - 0.8, q[3] + 0.8, 3, L1, RUST));
      items = items.concat(box(q[0], q[1], q[2], q[3], L1, q[5] === "centre" ? CORN5 : CORN, GRAN));
    });

    /* ---------- horizontal breaks, on the outer faces ---------- */
    /* Each break is a thin slab a foot proud of the wall it belongs to. On
       the ranges it runs the outer face only: one slab per outer face, so
       nothing crosses a courtyard. */
    var OUTER = [
      /* [u0,u1,v0,v1,nx,ny] strips along each outer face of the four ranges,
         with the face's outward normal. A strip is a box, and a box has a
         back: the north cornice's SOUTH face is visible from the south camera
         and, at a NEAR depth, painted a bright line clean across the roofs.
         The whole strip is dropped when its wall is culled. */
      [-HX - 1, -HX, HYS, HYN, -1, 0],   /* west face */
      [ HX, HX + 1, HYS, HYN,  1, 0],    /* east face */
      [-HX, HX, HYS - 1, HYS, 0, -1],    /* south face */
      [-HX, HX, HYN, HYN + 1,   0,  1],  /* north face */
    ];
    function breaks(strips, tops, depth) {
      strips.forEach(function (f) {
        if (!ctx.faceVisible(f[4], f[5])) return;
        tops.forEach(function (z, i) {
          items = items.concat(box(f[0], f[1], f[2], f[3], z - 1.2, z, TRIM, depth + i));
        });
      });
    }
    breaks(OUTER, [L1, L2, L3, L4], NEAR + 8);
    /* rustication: the ground storey is drawn as courses, not as a darker
       band. Three joint lines per outer face, a hair recessed so they read
       dark against the stone. */
    OUTER.forEach(function (f) {
      if (!ctx.faceVisible(f[4], f[5])) return;
      [3, 5.5, 8, 10.5, 13].forEach(function (z, i) {
        items = items.concat(box(f[0] - (f[4] < 0 ? 0.4 : 0), f[1] + (f[4] > 0 ? 0.4 : 0),
                                 f[2] - (f[5] < 0 ? 0.4 : 0), f[3] + (f[5] > 0 ? 0.4 : 0), z - 0.55, z, GROOVE, NEAR + 6 + i));
      });
    });
    /* the main cornice, heavier and 3 ft proud */
    OUTER.forEach(function (f) {
      if (!ctx.faceVisible(f[4], f[5])) return;
      var u0 = f[0] < 0 && f[1] <= -HX ? -HX - 3 : (f[0] >= HX ? HX : f[0]);
      var u1 = f[0] >= HX ? HX + 3 : (f[1] <= -HX ? -HX : f[1]);
      var v0 = f[2] <= HYS && f[3] <= HYS ? HYS - 3 : (f[2] >= HYN ? HYN : f[2]);
      var v1 = f[2] >= HYN ? HYN + 3 : (f[3] <= HYS ? HYS : f[3]);
      items = items.concat(box(u0, u1, v0, v1, WALL, CORN, TRIM, NEAR + 12));
    });
    /* pavilions carry their own string courses and cornice on their fronts */
    PAVS.forEach(function (q) {
      var fx = q[1] >= PAVX - 1 ? [q[1], q[1] + 1, q[2], q[3], 1, 0] : q[0] <= -PAVX + 1 ? [q[0] - 1, q[0], q[2], q[3], -1, 0]
             : q[3] >= NP_OUT - 1 ? [q[0], q[1], q[3], q[3] + 1, 0, 1] : [q[0], q[1], q[2] - 1, q[2], 0, -1];
      if (!ctx.faceVisible(fx[4], fx[5])) return;
      breaks([fx], [L1, L2, L3, L4], NEAR + 8);
      var c = [fx[0] - (fx[1] === q[0] ? 2 : 0), fx[1] + (fx[0] === q[1] ? 2 : 0),
               fx[2] - (fx[3] === q[2] ? 2 : 0), fx[3] + (fx[2] === q[3] ? 2 : 0)];
      if (q[5] === "centre") {
        breaks([fx], [WALL], NEAR + 8);
        items = items.concat(box(c[0], c[1], c[2], c[3], WALL5, CORN5, TRIM, NEAR + 12));
      } else {
        items = items.concat(box(c[0], c[1], c[2], c[3], WALL, CORN, TRIM, NEAR + 12));
      }
    });

    /* ---------- columns and windows, per bay, four tiers, outer faces only ----------
       A pier every 14 ft, and at every pier a PAIR of columns. */
    var BAY = 14;
    var TIERS = [[L1, L2], [L2, L3], [L3, L4], [L4, WALL]];
    var nCols = 0, nWin = 0;
    /* A PAIR of columns at a pier, drawn to survive map scale. Two 2.6 ft
       shafts with a 1.8 ft gap are three pixels and two pixels on a 523 ft
       front at 900 px, and the first draft's critic found a flat wall with a
       faint pinstripe. So the pair is drawn as what the eye needs: two
       shafts 2.8 ft wide standing 2 ft proud of the wall, a DARK groove
       between them, and a shared capital block. nx,ny is the wall's outward
       normal; a is the position along the wall; c the wall plane. */
    function pair(nx, ny, a, c, z0, z1, dep) {
      var out = [];
      var pu = nx ? c + nx * 1.0 : a, pv = ny ? c + ny * 1.0 : a;   /* centre, 2 ft proud */
      var du = nx ? 2.0 : 7.0, dv = ny ? 2.0 : 7.0;
      out = out.concat(box(pu - du / 2, pu + du / 2, pv - dv / 2, pv + dv / 2, z0 + 0.6, z0 + 2.0, CAP, dep));
      for (var k = -1; k <= 1; k += 2) {
        var su = nx ? pu : a + k * 2.1, sv = ny ? pv : a + k * 2.1;
        var wu = nx ? 2.0 : 2.8, wv = ny ? 2.0 : 2.8;
        out = out.concat(box(su - wu / 2, su + wu / 2, sv - wv / 2, sv + wv / 2, z0 + 2.0, z1 - 3.4, COLUMN, dep + 1));
        nCols++;
      }
      /* the groove: a dark slot a hair in front of the wall between the shafts */
      var gu = nx ? c + nx * 0.6 : a, gv = ny ? c + ny * 0.6 : a;
      out = out.concat(box(gu - (nx ? 0.6 : 0.7), gu + (nx ? 0.6 : 0.7), gv - (ny ? 0.6 : 0.7), gv + (ny ? 0.6 : 0.7), z0 + 2.0, z1 - 3.4, GROOVE, dep + 2));
      /* the shared capital: wider than the pair and 3 ft tall, in the
         brightest tone, so the eye reads a head on every shaft */
      out = out.concat(box(pu - du / 2 - 0.9, pu + du / 2 + 0.9, pv - dv / 2 - 0.9, pv + dv / 2 + 0.9, z1 - 3.4, z1 - 0.6, "#f6f4ee", dep + 3));
      return out;
    }
    /* decorate one outer face: nx,ny is its outward normal; (a0..a1) runs
       along it; c is the wall plane coordinate on the normal axis */
    var TIERS5 = TIERS.concat([[WALL, WALL5]]);
    function facade(nx, ny, a0, a1, c, depBase, tiers, roofZ) {
      if (!ctx.faceVisible(nx, ny)) return;
      tiers = tiers || TIERS; roofZ = roofZ === undefined ? WING : roofZ;
      var along = a1 - a0, n = Math.max(2, Math.round(along / BAY));
      var bay = along / n;
      for (var i = 0; i <= n; i++) {
        var a = a0 + i * bay;
        /* the pier: a pair of columns on each tier */
        tiers.forEach(function (t, ti) {
          items = items.concat(pair(nx, ny, a, c, t[0], t[1], depBase + 20 + ti * 4));
        });
        if (i === n) break;
        /* the window in the bay, on every storey incl. the arched ground one */
        var mid = a + bay / 2;
        var wins = [[GRD + 4, L1 - 3], [L1 + 3, L2 - 3.5], [L2 + 3, L3 - 3.5], [L3 + 3, L4 - 3.5], [L4 + 3, WALL - 4]];
        if (tiers.length > 4) wins.push([WALL + 3, WALL5 - 4]);
        wins.forEach(function (w, wi) {
          var wu = nx ? c + nx * 0.5 : mid, wv = ny ? c + ny * 0.5 : mid;
          var du = nx ? 0.6 : 5.2, dv = ny ? 0.6 : 5.2;
          items = items.concat(box(wu - du / 2, wu + du / 2, wv - dv / 2, wv + dv / 2,
                                   w[0], w[1], GLASS, depBase + 40 + wi));
          nWin++;
        });
        /* a dormer in the mansard over every bay */
        var dz0 = roofZ - 10;
        var du2 = nx ? 3.5 : 4.5, dv2 = ny ? 3.5 : 4.5;
        var wu2 = nx ? c + nx * 0.2 : mid, wv2 = ny ? c + ny * 0.2 : mid;
        items = items.concat(box(wu2 - du2 / 2, wu2 + du2 / 2, wv2 - dv2 / 2, wv2 + dv2 / 2,
                                 dz0, dz0 + 6.5, DORMER, depBase + 60, nx ? 3.5 : 1.2, ny ? 3.5 : 1.2));
        items = items.concat(box(wu2 - 1.6, wu2 + 1.6, wv2 - 1.6, wv2 + 1.6, dz0 + 1, dz0 + 5, GLASS, depBase + 61));
      }
    }
    /* the four long outer faces, between the pavilions */
    facade(-1, 0, -CR_Y0, -CP_W, -HX, NEAR);   /* west, between the pavilions */
    facade(-1, 0,  CP_W, CR_Y0, -HX, NEAR);
    facade(-1, 0, HYS, -CR_Y1, -HX, NEAR);
    facade(-1, 0,  CR_Y1, HYN, -HX, NEAR);
    facade( 1, 0, -CR_Y0, -CP_W,  HX, NEAR);
    facade( 1, 0,  CP_W, CR_Y0,  HX, NEAR);
    facade( 1, 0, HYS, -CR_Y1,  HX, NEAR);
    facade( 1, 0,  CR_Y1, HYN,  HX, NEAR);
    facade( 0, 1, -HX, -NP_HW,  HYN, NEAR);
    facade( 0, 1,  NP_HW, HX,  HYN, NEAR);
    facade( 0, -1, -HX, -SP_HW, HYS, NEAR);
    facade( 0, -1,  SP_HW, HX, HYS, NEAR);
    /* pavilion fronts sit proud of those planes, so they paint later */
    PAVS.forEach(function (q) {
      var ctr = q[5] === "centre", tl = ctr ? TIERS5 : TIERS, rz = ctr ? PAV3 : CRNR;
      if (q[1] >= PAVX - 1)        facade( 1, 0, q[2], q[3], q[1], NEAR + 100, tl, rz);
      else if (q[0] <= -PAVX + 1)  facade(-1, 0, q[2], q[3], q[0], NEAR + 100, tl, rz);
      else if (q[3] >= NP_OUT - 1) facade( 0, 1, q[0], q[1], q[3], NEAR + 100, tl, rz);
      else                         facade( 0, -1, q[0], q[1], q[2], NEAR + 100, tl, rz);
    });

    /* ---------- roofs: slate mansards, dormers already placed ----------
       A mansard is a slab that narrows going up: prism with a smaller top. */
    RANGES.forEach(function (r) {
      var wu = r[1] - r[0], wv = r[3] - r[2];
      items = items.concat(box(r[0], r[1], r[2], r[3], CORN, WING, SLATE, undefined, wu - 14, wv - 14));
      /* a flat deck with an iron cresting rail along the curb */
      items = items.concat(box(r[0] + 7, r[1] - 7, r[2] + 7, r[3] - 7, WING, WING + 0.6, SLATE_L));
      items = items.concat(box(r[0] + 6.5, r[1] - 6.5, r[2] + 6.5, r[3] - 6.5, WING + 0.6, WING + 2.4, IRON, undefined, wu - 14, wv - 14));
    });
    PAVS.forEach(function (q) {
      var wu = q[1] - q[0], wv = q[3] - q[2];
      var cz = CORN;
      /* every inset is clamped to the mass it sits on, so a taper can never
         invert: a negative half width flips the corner order and H.prism
         emits a self-intersecting quad */
      var k = Math.min(wu, wv);
      var i10 = Math.min(10, k * 0.35), i16 = Math.min(16, k * 0.4), i17 = Math.min(17, k * 0.42);
      if (q[5] === "corner") {
        items = items.concat(box(q[0], q[1], q[2], q[3], cz, CRNR, SLATE, undefined, wu - i10, wv - i10));
        items = items.concat(box(q[0] + i10 / 2, q[1] - i10 / 2, q[2] + i10 / 2, q[3] - i10 / 2, CRNR, CRNR + 2.4, IRON, undefined, wu - i10 - 2, wv - i10 - 2));
      } else {
        /* one tall steep mansard from the fifth-tier cornice to the published
           134 ft 7 in, with a flat crested top. It was three stacked boxes and
           read as a stepped tower; the real roof is one slope. */
        items = items.concat(box(q[0], q[1], q[2], q[3], CORN5, PAV3 - 2.5, SLATE, undefined, wu - i16, wv - i16));
        items = items.concat(box(q[0] + i16 / 2, q[1] - i16 / 2, q[2] + i16 / 2, q[3] - i16 / 2, PAV3 - 2.5, PAV3 - 1.9, SLATE_L));
        items = items.concat(box(q[0] + i16 / 2 - 0.5, q[1] - i16 / 2 + 0.5, q[2] + i16 / 2 - 0.5, q[3] - i16 / 2 + 0.5, PAV3 - 1.9, PAV3, IRON, undefined, wu - i17, wv - i17));
      }
    });

    /* ---------- 30 cast iron chimneys, on the roof curbs ---------- */
    var chim = [];
    for (var i = 0; i < 8; i++) { var vy = -HY + 30 + i * ((2 * HY - 60) / 7);
      chim.push([-HX + 12, vy]); chim.push([HX - 12, vy]); }
    for (var j = 0; j < 7; j++) { var ux = -HX + 25 + j * ((2 * HX - 50) / 6);
      chim.push([ux, HY - 12]); chim.push([ux, -HY + 12]); }
    chim.slice(0, 30).forEach(function (c) {
      items = items.concat(box(c[0] - 2, c[0] + 2, c[1] - 2, c[1] + 2, WING - 2, WING + 9, IRON));
    });

    /* ---------- the entrance porches, east and west centre pavilions ----------
       A podium 6 ft high standing 14 ft proud of the pavilion, EIGHT steps
       descending outward in front of it (the first draft had the run climbing
       away from the door and buried under the podium, so no riser ever
       showed), and over it a two tier porch: columns on the podium, an
       entablature, a second tier of columns, an entablature and a rail.
       GSA calls them "tiers of porticoes"; a one storey box read as a bus
       shelter. */
    [[1, PAVX], [-1, -PAVX]].forEach(function (side) {
      var sx = side[0], face = side[1];
      var p0 = face, p1 = face + sx * 14;                      /* podium extent */
      var lo = Math.min(p0, p1), hi = Math.max(p0, p1);
      /* podium and steps at NATURAL depth. At NEAR they painted on top of
         everything, and from the east the WEST podium, 290 ft away behind the
         building, landed on screen at the near pavilion's roofline as a light
         slab. Found by ablation: one side at a time. */
      items = items.concat(box(lo, hi, -26, 26, GRD, 6, RUST));
      for (var st = 0; st < 8; st++) {
        var z0 = 6 - (st + 1) * 0.75, off = 14 + st * 1.6;
        var s0 = face + sx * off, s1 = face + sx * (off + 1.7);
        items = items.concat(box(Math.min(s0, s1), Math.max(s0, s1), -24 + st * 0.5, 24 - st * 0.5, z0, z0 + 0.75, RUST));
      }
      if (!ctx.faceVisible(sx, 0)) return;
      var cx = face + sx * 11;                                  /* the column line */
      [[6, L2], [L2 + 2.5, L3 + 2]].forEach(function (t, ti) {
        for (var k = 0; k < 4; k++) {
          var vv = -19.5 + k * 13;
          items = items.concat(box(cx - 1.6, cx + 1.6, vv - 1.6, vv + 1.6, t[0], t[0] + 1.2, CAP, NEAR + 152 + ti * 4));
          items = items.concat(box(cx - 1.3, cx + 1.3, vv - 1.3, vv + 1.3, t[0] + 1.2, t[1] - 2.6, COLUMN, NEAR + 153 + ti * 4));
          items = items.concat(box(cx - 1.8, cx + 1.8, vv - 1.8, vv + 1.8, t[1] - 2.6, t[1] - 1.0, CAP, NEAR + 154 + ti * 4));
        }
        items = items.concat(box(Math.min(face, cx + sx * 2.5), Math.max(face, cx + sx * 2.5), -25, 25, t[1] - 1.0, t[1] + 1.5, TRIM, NEAR + 160 + ti * 4));
      });
      /* the balustrade on top: a flat rail and posts, nothing tapered */
      var r0 = Math.min(face, cx + sx * 2.5), r1 = Math.max(face, cx + sx * 2.5);
      for (var pk = -24; pk <= 24; pk += 6) {
        items = items.concat(box(cx - 0.8, cx + 0.8, pk - 0.8, pk + 0.8, L3 + 1.5, L3 + 4.5, CAP, NEAR + 169));
      }
      items = items.concat(box(r0, r1, -25, 25, L3 + 4.5, L3 + 5.5, TRIM, NEAR + 170));
    });

    ctx.note = ctx.note || {};
    ctx.note.eeob = { columns: nCols, windows: nWin };
    return items;
  };
})();
