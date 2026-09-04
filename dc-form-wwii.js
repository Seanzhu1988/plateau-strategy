/* dc-form-wwii.js: the National World War II Memorial.
 *
 * Rebuilt to MODEL_STANDARD.md. What stood here before was the generic
 * "plaza" form: one pale box, 70 m across, two metres tall. The WWII
 * Memorial is a SUNKEN oval plaza ringed by fifty-six standing pillars with
 * two arches over it, and a single slab says nothing true about any of that.
 *
 * RESEARCH, every number with a source checked this run.
 *
 * PUBLISHED (Wikipedia, https://en.wikipedia.org/wiki/National_World_War_II_Memorial):
 *   - site "7.4 acres", "Two-thirds of the site is landscaping and water"
 *   - plaza "337 ft 10 in long and 240 ft 2 in wide"
 *   - plaza "sunk 6 feet below grade"
 *   - pool "246 feet 9 inches by 147 feet 8 inches"
 *   - "56 granite pillars, 17 feet tall", "arranged in a semicircle"
 *   - two "43-foot" triumphal arches, Atlantic and Pacific
 *   - Freedom Wall, "4,048 gold stars, each representing 100 Americans"
 *
 * PUBLISHED (Friends of the National WWII Memorial, wwiimemorialfriends.org/design,
 * checked this run):
 *   - pillars "17' above grade", "4'4" wide", "3' deep", "open in the centre
 *     for greater transparency", 112 bronze wreaths, "connected by a bronze
 *     sculpted rope"
 *   - pavilions "43-foot", "23' square", four bronze columns each, four
 *     bronze eagles and one suspended victory laurel per pavilion
 *   - Freedom Wall "84'-8" wide", "9' high from plaza floor", "41'-9" radius"
 *   - plaza "337'-10" long", "240'-2" wide", "6' below grade"
 *   - ceremonial entrance "148'-3" wide", 24 bas-relief panels, 12 north and
 *     12 south, steps and ramps from 17th Street
 *   - overall footprint "384'" pavilion to pavilion by "279'"
 *   - stone: Kershaw granite (South Carolina) in the pillars and pavilions;
 *     Green County granite paving with Rio Verde and Moss Green accents;
 *     Academy Black and Mount Airy granite in the rebuilt pool
 *   - semicircular fountains at the pavilion bases, waterfalls flanking the
 *     Freedom Wall
 *
 * ORIENTATION, and it is derived rather than guessed. The pavilions mark the
 * midpoints of the NORTH and SOUTH sides, so the 384 ft pavilion-to-pavilion
 * dimension is the north-south one, and the plaza's 337'-10" is north-south
 * too. That settles the pool: 246'-9" cannot lie east-west inside a 240'-2"
 * plaza, so the pool's long axis is north-south as well, and it insets 45.5 ft
 * at each end and 46.2 ft at each side, which is symmetric to within a foot.
 * The Freedom Wall is west, toward the Reflecting Pool; the ceremonial
 * entrance is east, toward 17th Street and the Monument.
 *
 * The 279 ft overall width checks the same way. Half of it is 139.5 ft; the
 * Freedom Wall's arc has a 41'-9" radius and reaches the western extremity,
 * so its arc centre sits at u = -97.75 and the wall bulges west to -139.5.
 * Nothing here is placed by eye.
 *
 * NAMED GAPS, guessed nowhere, stated here rather than buried:
 *   - "17 feet tall" and "17' above grade" are the same pillar described two
 *     ways, and with a plaza 6 ft down they cannot both hold. TALL is the
 *     unambiguous word, so the pillars run 17 ft from the PLAZA FLOOR and
 *     show 11 ft above the lawn. If a section drawing ever says otherwise
 *     this is the line to change.
 *   - the pillars' SPACING is published only as "ample space between each".
 *     They are spread evenly along each of the four runs of fourteen, between
 *     the entrance opening and the pavilion, both of which ARE published.
 *   - the size of the OPENING in a pillar is not published. Drawn as a 4'-6"
 *     to 13' slot two thirds of the pillar's width: an assumption, on its
 *     own line.
 *   - the BERM between the plaza rim and the lawn is not dimensioned. Drawn
 *     14 ft wide, chosen because 2 x (120.1 + 14) is 268 ft against a
 *     published overall width of 279, the remaining 11 being the wall bulge.
 *   - no published height for the two 17th Street FLAGPOLES, so none is drawn.
 *   - no published pavilion cornice or column dimensions beyond "23' square"
 *     and "four bronze columns"; the columns are 2 ft square, an assumption.
 *   - no published depth for the pool basin. Water is drawn 1 ft down.
 *
 * FRAME. u runs east, v runs north, z up, all in feet, origin at the centre
 * of the plaza. z = 0 is the surrounding GRADE, so the plaza floor is at -6.
 * The memorial is aligned to the Mall's axis, which is this frame's u.
 *
 * PAINT. There is no single big plane in this model, deliberately. The plaza
 * paving is an ELLIPTICAL ANNULUS around the pool, emitted one quad per
 * segment, because a solid plaza polygon would have painted the pool shut,
 * which is the trap this project has now met eight times. Everything at
 * ground level carries an explicit depth so the pillars and arches standing
 * in it always paint after it.
 */
(function () {
  var H = window.DC3D.helpers;
  window.DC_FORMS = window.DC_FORMS || {};
  window.DC_FORMS['wwii'] = function (ctx, p, s, VE) {
    var P = ctx.project, items = [];
    var FT = (p.h * VE) / 43;        /* metres per foot: the 43 ft arch lands on p.h */
    var m  = FT * s;
    function pt(u, v, z) { return P(p.x + u * m, p.y + v * m, z * FT); }

    /* ---------- published geometry, in feet ---------- */
    var PA = 120.083, PB = 168.917;      /* plaza 240'2" x 337'10" */
    var QA = 73.833,  QB = 123.375;      /* pool  147'8" x 246'9"  */
    var ZP = -6;                          /* sunk 6 ft below grade */
    var PH = 17;                          /* pillar height from the plaza floor */
    var PW = 4.3333, PD = 3;              /* pillar 4'4" wide, 3' deep */
    var AV = 180.5, AS = 23, AH = 43;     /* pavilions: centre v, 23' square, 43' */
    var WR = 41.75, WCU = -97.75, WH = 9; /* Freedom Wall arc, 9' from plaza floor */
    var EW = 74.125;                      /* half of the 148'3" entrance */
    var BERM = 14;                        /* named gap, see header */
    var N = 72;                           /* ellipse segments */

    /* ---------- materials ---------- */
    var KERSH  = "#cdbdb2";   /* Kershaw granite, South Carolina, pink-grey */
    var KERSHD = "#b0a094";   /* the same stone one tone down, for bases */
    var PAVE   = "#c8c9b8";   /* Green County granite paving, greenish grey */
    var ACCENT = "#b6bda6";   /* Rio Verde and Moss Green accent courses */
    var MTAIRY = "#dcd8cc";   /* Mount Airy, the pale coping of the rebuilt pool */
    var ACADBK = "#565a5e";   /* Academy Black, the pool basin */
    var WATER  = "#9fb9c4";
    var BRONZE = "#8a6f45";
    var GOLD   = "#c9a13f";
    var LAWN   = "#cfd8c4";

    function push(q, fill, nu, nv, nz, bias, seam) {
      var f = ctx.shade(fill, nu, nv, nz || 0);
      items.push({ svg: ctx.poly(q, f, seam || f, 0.6),
                   depth: H.depthOf(q) + (bias || 0) });
    }
    function ell(a, b, t) { return [a * Math.cos(t), b * Math.sin(t)]; }
    /* outward normal of an ellipse at parameter t: grad of (u/a)^2+(v/b)^2 */
    function ellN(a, b, t) {
      var nu = Math.cos(t) / a, nv = Math.sin(t) / b;
      var L = Math.hypot(nu, nv) || 1;
      return [nu / L, nv / L];
    }

    /* A flat elliptical band, one quad per segment. `test` takes the mid
       parameter of a segment so a band can stop where a wall or an entrance
       cuts it, instead of being drawn round and then covered up. */
    function band(aO, bO, aI, bI, z, fill, depth, test) {
      for (var i = 0; i < N; i++) {
        var t0 = (i / N) * Math.PI * 2, t1 = ((i + 1) / N) * Math.PI * 2;
        if (test && !test((t0 + t1) / 2)) continue;
        var o0 = ell(aO, bO, t0), o1 = ell(aO, bO, t1);
        var i0 = ell(aI, bI, t0), i1 = ell(aI, bI, t1);
        var q = [pt(o0[0], o0[1], z), pt(o1[0], o1[1], z),
                 pt(i1[0], i1[1], z), pt(i0[0], i0[1], z)];
        var f = ctx.shade(fill, 0, 0, 1);
        items.push({ svg: ctx.poly(q, f, f, 0.6),
                     depth: depth === undefined ? H.depthOf(q) : depth + i * 1e-4 });
      }
    }
    function disc(a, b, z, fill, depth) {
      var q = [];
      for (var i = 0; i < N; i++) { var e = ell(a, b, (i / N) * Math.PI * 2); q.push(pt(e[0], e[1], z)); }
      var f = ctx.shade(fill, 0, 0, 1);
      items.push({ svg: ctx.poly(q, f, f, 0.6), depth: depth });
    }

    /* A box turned to face a given direction: the pillars stand radially
       around the oval, and an axis-aligned prism would have them all facing
       the same way, which is the one thing a ring of pillars never does. */
    function boxRot(cu, cv, nu, nv, halfT, halfR, z0, z1, fill, bias) {
      var tu = -nv, tv = nu;
      function c(st, sr) {
        return [cu + tu * halfT * st + nu * halfR * sr,
                cv + tv * halfT * st + nv * halfR * sr];
      }
      var lo = [c(-1, -1), c(1, -1), c(1, 1), c(-1, 1)];
      var nr = [[-nu, -nv], [tu, tv], [nu, nv], [-tu, -tv]];
      for (var i = 0; i < 4; i++) {
        if (!ctx.faceVisible(nr[i][0], nr[i][1])) continue;
        var j = (i + 1) % 4;
        push([pt(lo[i][0], lo[i][1], z0), pt(lo[j][0], lo[j][1], z0),
              pt(lo[j][0], lo[j][1], z1), pt(lo[i][0], lo[i][1], z1)],
             fill, nr[i][0], nr[i][1], 0, bias);
      }
      push([pt(lo[0][0], lo[0][1], z1), pt(lo[1][0], lo[1][1], z1),
            pt(lo[2][0], lo[2][1], z1), pt(lo[3][0], lo[3][1], z1)],
           fill, 0, 0, 1, (bias || 0) + 0.02);
    }

    /* ---------- where the pillar runs stop, all of it derived ----------
       The entrance is 148'3" wide, so its half-width of 74.125 ft meets the
       plaza ellipse at t = asin(74.125 / 168.917) = 26.0 degrees, and the
       pillars begin there. The Freedom Wall's arc ends at v = +/- 41.75, so
       t = 180 - 14.3 = 165.7 degrees, and the pillars stop there. The
       pavilion is 23 ft square on an ellipse whose east-west tangent runs
       120.1 ft per radian at the pole, so it takes 11 degrees of gap. */
    var T_ENT  = Math.asin(EW / PB);
    var T_WALL = Math.PI - Math.asin(WR / PB);
    var T_PAV  = (AS / 2 + 3) / PA;      /* half the pavilion gap, in radians */

    /* The rim is CUT in two places, both of them published: the 148'-3"
       ceremonial entrance on the east, and the Freedom Wall's alcove on the
       west. The first render drew the bank straight across both, and what it
       showed was a staircase lying loose on the lawn and a gold wall hooping
       through its own colonnade. Neither fault is visible in any number. */
    function rimOpen(t) {
      var e = ell(PA, PB, t);
      if (e[0] > 0 && Math.abs(e[1]) < EW) return false;
      if (e[0] < 0 && Math.abs(e[1]) < WR + 3) return false;
      return true;
    }

    /* ---------- the ground, from the outside in ---------- */
    /* the berm: lawn falling from grade to the plaza rim */
    band(PA + BERM, PB + BERM, PA, PB, 0, LAWN, -1e9 + 3, rimOpen);
    /* the retaining wall of the pit, seen on the far side, which is what
       looking into a sunken plaza actually shows */
    for (var i = 0; i < N; i++) {
      var t0 = (i / N) * Math.PI * 2, t1 = ((i + 1) / N) * Math.PI * 2;
      var tm = (t0 + t1) / 2;
      if (!rimOpen(tm)) continue;
      var nn = ellN(PA, PB, tm);
      if (!ctx.faceVisible(-nn[0], -nn[1])) continue;
      var w0 = ell(PA, PB, t0), w1 = ell(PA, PB, t1);
      push([pt(w0[0], w0[1], ZP), pt(w1[0], w1[1], ZP),
            pt(w1[0], w1[1], 0), pt(w0[0], w0[1], 0)],
           KERSHD, -nn[0], -nn[1], 0, 0);
    }
    /* the plaza paving: an ANNULUS around the pool, never a solid ellipse */
    band(PA, PB, QA + 8, QB + 8, ZP, PAVE, -1e9 + 4);
    band(QA + 8, QB + 8, QA + 4, QB + 4, ZP, ACCENT, -1e9 + 5);
    band(QA + 4, QB + 4, QA, QB, ZP, MTAIRY, -1e9 + 6);
    /* the Rainbow Pool: Academy Black basin, water one foot down */
    disc(QA, QB, ZP - 1.2, ACADBK, -1e9 + 7);
    disc(QA - 1.5, QB - 1.5, ZP - 1, WATER, -1e9 + 8);
    /* the Freedom Wall's alcove floor: the half-disc west of the plaza's own
       ellipse, on the wall's published 41'-9" radius plus its 3 ft thickness,
       and two flank fillers so the cut in the bank is not a hole */
    var alq = [];
    for (var af = 0; af <= 26; af++) {
      var ag = Math.PI / 2 + Math.PI * (af / 26);
      alq.push(pt(WCU + (WR + 3) * Math.cos(ag), (WR + 3) * Math.sin(ag), ZP));
    }
    var alf = ctx.shade(PAVE, 0, 0, 1);
    items.push({ svg: ctx.poly(alq, alf, alf, 0.6), depth: -1e9 + 4.5 });
    [1, -1].forEach(function (sg) {
      var vv = sg * (WR + 3);
      var uOut = -(PA + BERM) * Math.sqrt(Math.max(0, 1 - (vv / (PB + BERM)) * (vv / (PB + BERM))));
      push([pt(uOut, vv, ZP), pt(WCU, vv, ZP),
            pt(WCU, sg * (WR + 3) - sg * 0.1, ZP), pt(uOut, vv - sg * 0.1, ZP)],
           PAVE, 0, 0, 1, 0);
      /* the cheek of the cut, holding the lawn back on each flank */
      push([pt(uOut, vv, ZP), pt(WCU, vv, ZP), pt(WCU, vv, 0), pt(uOut, vv, 0)],
           KERSHD, 0, sg, 0, 0.01);
    });

    /* ---------- the ceremonial entrance, east, 148'3" wide ---------- */
    for (var st = 0; st < 5; st++) {
      var uu = PA + st * (BERM / 5), hh = ZP + (st + 1) * (6 / 5);
      items = items.concat(H.prism(ctx, p.x + (uu + BERM / 10) * m, p.y,
        (BERM / 5) * m, 2 * EW * m, (BERM / 5) * m, 2 * EW * m,
        ZP * FT, (hh - ZP) * FT, MTAIRY, null));
    }

    /* the cheeks of the entrance cut, so the steps sit IN the bank */
    [1, -1].forEach(function (sg) {
      push([pt(PA - 4, sg * EW, ZP), pt(PA + BERM, sg * EW, ZP),
            pt(PA + BERM, sg * EW, 0), pt(PA - 4, sg * EW, 0)],
           KERSHD, 0, sg, 0, 0.01);
    });

    /* ---------- fifty-six pillars, four runs of fourteen ---------- */
    /* Kershaw granite, 4'4" x 3', 17 ft tall, open in the centre, joined by
       a bronze rope and carrying two bronze wreaths each. */
    var runs = [[T_ENT, Math.PI / 2 - T_PAV], [Math.PI / 2 + T_PAV, T_WALL],
                [-T_WALL, -Math.PI / 2 - T_PAV], [-Math.PI / 2 + T_PAV, -T_ENT]];
    runs.forEach(function (r) {
      var prev = null;
      for (var k = 0; k < 14; k++) {
        var t = r[0] + (r[1] - r[0]) * ((k + 0.5) / 14);
        var e = ell(PA, PB, t), nn = ellN(PA, PB, t);
        var cu = e[0], cv = e[1];
        /* base, two legs around the open centre, and the head that carries
           the wreaths: the opening is the pillar's whole idea */
        boxRot(cu, cv, nn[0], nn[1], PW / 2, PD / 2, ZP, ZP + 4.5, KERSHD, 0);
        var tu = -nn[1], tv = nn[0], off = PW / 2 - PW / 6;
        [-1, 1].forEach(function (sg) {
          boxRot(cu + tu * off * sg, cv + tv * off * sg, nn[0], nn[1],
                 PW / 6, PD / 2, ZP + 4.5, ZP + 13, KERSH, 0.01);
        });
        boxRot(cu, cv, nn[0], nn[1], PW / 2, PD / 2, ZP + 13, ZP + PH, KERSH, 0.02);
        /* two bronze wreaths, wheat and oak, one each side of the head */
        [-1, 1].forEach(function (sg) {
          boxRot(cu + tu * off * sg, cv + tv * off * sg, nn[0], nn[1],
                 PW / 7, PD / 2 + 0.35, ZP + 14, ZP + 16.2, BRONZE, 0.06);
        });
        /* the bronze sculpted rope between neighbours */
        if (prev) {
          var a0 = pt(prev[0], prev[1], ZP + 12.4), a1 = pt(cu, cv, ZP + 12.4);
          var b0 = pt(cu, cv, ZP + 11.9), b1 = pt(prev[0], prev[1], ZP + 11.9);
          push([a0, a1, b0, b1], BRONZE, nn[0], nn[1], 0, 0.04);
        }
        prev = [cu, cv];
      }
    });

    /* ---------- the two pavilions, 23 ft square, 43 ft tall ---------- */
    /* Atlantic north, Pacific south. Four bronze columns carry a granite
       cornice; the eagles and the suspended laurel hang inside it. They are
       ARCHES, so they are drawn open: a solid block here would be the same
       lie the old plaza slab told about the whole memorial. */
    [1, -1].forEach(function (sg) {
      var cv0 = AV * sg, hAS = AS / 2;
      items.push(H.shadow(ctx, [[p.x - hAS * m, p.y + (cv0 - hAS) * m],
                                [p.x + hAS * m, p.y + (cv0 - hAS) * m],
                                [p.x + hAS * m, p.y + (cv0 + hAS) * m],
                                [p.x - hAS * m, p.y + (cv0 + hAS) * m]], AH * FT));
      /* the base the arch stands on */
      items = items.concat(H.prism(ctx, p.x, p.y + cv0 * m,
        (AS + 5) * m, (AS + 5) * m, (AS + 5) * m, (AS + 5) * m,
        ZP * FT, 2.5 * FT, KERSHD, null));
      /* four bronze columns at the corners, an assumption at 2 ft square */
      [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(function (c) {
        items = items.concat(H.prism(ctx, p.x + c[0] * (hAS - 2) * m,
          p.y + (cv0 + c[1] * (hAS - 2)) * m, 2 * m, 2 * m, 2 * m, 2 * m,
          (ZP + 2.5) * FT, 27 * FT, BRONZE, null));
      });
      /* the four bronze eagles, and the victory laurel suspended between them */
      [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(function (c) {
        items = items.concat(H.prism(ctx, p.x + c[0] * (hAS - 3.5) * m,
          p.y + (cv0 + c[1] * (hAS - 3.5)) * m, 3 * m, 3 * m, 1.4 * m, 1.4 * m,
          (ZP + 26) * FT, 4.5 * FT, BRONZE, null));
      });
      items = items.concat(H.prism(ctx, p.x, p.y + cv0 * m,
        7 * m, 7 * m, 7 * m, 7 * m, (ZP + 22) * FT, 1.6 * FT, BRONZE, null));
      /* the granite entablature and the stepped cap: this is what reads as
         an arch from two hundred yards down the Mall */
      items = items.concat(H.prism(ctx, p.x, p.y + cv0 * m,
        (AS + 3) * m, (AS + 3) * m, (AS + 3) * m, (AS + 3) * m,
        (ZP + 30.5) * FT, 7.5 * FT, KERSH, null));
      items = items.concat(H.prism(ctx, p.x, p.y + cv0 * m,
        (AS + 5) * m, (AS + 5) * m, (AS + 1) * m, (AS + 1) * m,
        (ZP + 38) * FT, 2 * FT, MTAIRY, null));
      items = items.concat(H.prism(ctx, p.x, p.y + cv0 * m,
        (AS - 2) * m, (AS - 2) * m, (AS - 2) * m, (AS - 2) * m,
        (ZP + 40) * FT, 3 * FT, KERSH, null));
      /* the semicircular fountain at the pavilion's base, published */
      for (var q2 = 0; q2 < 14; q2++) {
        var g0 = Math.PI * (q2 / 14) + (sg > 0 ? Math.PI : 0);
        var g1 = Math.PI * ((q2 + 1) / 14) + (sg > 0 ? Math.PI : 0);
        var R2 = 20, R1 = 13;
        push([pt(R2 * Math.cos(g0), cv0 - hAS * sg + R2 * Math.sin(g0), ZP - 0.8),
              pt(R2 * Math.cos(g1), cv0 - hAS * sg + R2 * Math.sin(g1), ZP - 0.8),
              pt(R1 * Math.cos(g1), cv0 - hAS * sg + R1 * Math.sin(g1), ZP - 0.8),
              pt(R1 * Math.cos(g0), cv0 - hAS * sg + R1 * Math.sin(g0), ZP - 0.8)],
             WATER, 0, 0, 1, 0.03);
      }
    });

    /* ---------- the Freedom Wall, west ---------- */
    /* 84'-8" wide on a 41'-9" radius, 9 ft above the plaza floor, carrying
       4,048 gold stars. It curves AWAY from the plaza, so its face looks
       east and is only visible from the entrance side; that is the building,
       not a bug, and it is why this model is looked at from two yaws. */
    var WSEG = 26;
    for (var w = 0; w < WSEG; w++) {
      var g0 = Math.PI / 2 + Math.PI * (w / WSEG), g1 = Math.PI / 2 + Math.PI * ((w + 1) / WSEG);
      var x0 = WCU + WR * Math.cos(g0), y0 = WR * Math.sin(g0);
      var x1 = WCU + WR * Math.cos(g1), y1 = WR * Math.sin(g1);
      /* the inner face looks back toward the plaza centre */
      var mg = (g0 + g1) / 2, fu = -Math.cos(mg), fv = -Math.sin(mg);
      if (ctx.faceVisible(fu, fv)) {
        push([pt(x0, y0, ZP), pt(x1, y1, ZP), pt(x1, y1, ZP + WH), pt(x0, y0, ZP + WH)],
             KERSH, fu, fv, 0, 0.02);
        /* the field of gold stars, a band across the wall's face */
        push([pt(x0, y0, ZP + 2.6), pt(x1, y1, ZP + 2.6),
              pt(x1, y1, ZP + 7.2), pt(x0, y0, ZP + 7.2)],
             GOLD, fu, fv, 0, 0.05);
      }
      /* and the back, seen from the Reflecting Pool side */
      if (ctx.faceVisible(-fu, -fv)) {
        var bx0 = WCU + (WR + 3) * Math.cos(g0), by0 = (WR + 3) * Math.sin(g0);
        var bx1 = WCU + (WR + 3) * Math.cos(g1), by1 = (WR + 3) * Math.sin(g1);
        push([pt(bx0, by0, ZP), pt(bx1, by1, ZP), pt(bx1, by1, ZP + WH), pt(bx0, by0, ZP + WH)],
             KERSHD, -fu, -fv, 0, 0.02);
      }
      /* the wall's coping */
      var cx0 = WCU + (WR + 3) * Math.cos(g0), cy0 = (WR + 3) * Math.sin(g0);
      var cx1 = WCU + (WR + 3) * Math.cos(g1), cy1 = (WR + 3) * Math.sin(g1);
      push([pt(x0, y0, ZP + WH), pt(x1, y1, ZP + WH), pt(cx1, cy1, ZP + WH), pt(cx0, cy0, ZP + WH)],
           MTAIRY, 0, 0, 1, 0.06);
    }
    /* the waterfalls flanking the wall, published */
    [1, -1].forEach(function (sg) {
      push([pt(WCU - 4, sg * (WR + 2), ZP - 0.8), pt(WCU + 26, sg * (WR + 2), ZP - 0.8),
            pt(WCU + 26, sg * (WR + 12), ZP - 0.8), pt(WCU - 4, sg * (WR + 12), ZP - 0.8)],
           WATER, 0, 0, 1, 0.03);
    });

    return items;
  };
})();
