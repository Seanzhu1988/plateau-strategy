/* dc-form-lincoln.js: the Lincoln Memorial as a massing model.
 *
 * Every dimension below is a research fact in feet (Wikipedia / NPS), or a
 * stated derivation from one; the few assumed numbers say so on their own
 * line. FT converts feet to metres so the 99 ft foundation-to-roofline height
 * lands exactly on p.h (VE = 1).
 *
 * FRAME. The model is built in a local frame: u runs toward the FRONT (the
 * grand stair), v along the long axis (north), z up. FRONT maps u onto the
 * world x axis. The real memorial's entrance faces EAST, toward the
 * Reflecting Pool (FRONT = +1). The offline renderer looks at the Mall from
 * the north-west, where an east front is the back of the building and its
 * stair is a smear behind it, so FRONT = -1 turns the stair toward that
 * camera. A presentation choice, stated here; one constant undoes it.
 *
 * The stack, ground up, each layer with its own explicit paint depth so the
 * painter's sort cannot let a low slab cover what stands on it (a bias of
 * 100 is one metre, taken relative to the building's own centre):
 *    500  granite terrace, the building centred on it; the block's shadow on top
 *    600  the stair base projecting from the terrace front, plaza on top
 *    700+ lower flight, 29 granite steps, lawn up to the plaza
 *   1000+ upper flight, 58 granite steps, plaza up to the stylobate
 *   1100  podium under the colonnade, marble stylobate course on top
 *   1500  chamber interior: floor, back wall, side walls
 *   1600  interior Ionic columns, pedestal, statue
 *   2000  peristyle columns, in-antis columns, cella walls (natural depth + layer)
 *   2500  cheek walls, buttresses, tripod urns (they stand in front of the front row)
 *   3000  architrave, 3020 frieze with its 36 wreaths, 3100 cornice
 *   4000  attic, 4100 its cornice, 4200 parapet (the roofline, 99 ft)
 *
 * STEPS. 87 real steps climb 39 ft at 0.448 ft each, under a pixel at the
 * page's zoom, so each flight is drawn with as many steps as fit at three
 * pixels a riser and never more than the real count: zoomed in, the true 58
 * and 29 appear; zoomed out, 14 and 7 stand for them.
 */
(function () {
  var H = window.DC3D.helpers;
  window.DC_FORMS = window.DC_FORMS || {};
  window.DC_FORMS['lincoln'] = function (ctx, p, s, VE) {
    var P = ctx.project, items = [];
    var FT = (p.h * VE) / 99;                 /* metres per foot */
    var m = FT * s;                           /* metres per foot, horizontal (spread applied) */
    var FRONT = -1;                           /* +1 = the real east front; -1 = turned to the renderer's camera */
    function W2(u, v) { return [p.x + FRONT * u * m, p.y + v * m]; }
    function pt(u, v, z) { var w = W2(u, v); return P(w[0], w[1], z * FT); }
    var ryC = P(p.x, p.y, 0)[2];
    function dep(q, bias, nat) { return ryC + (bias + (nat ? H.depthOf(q) - ryC : 0)) * 0.01; }
    /* a face is drawn if it leans up enough to be seen from above, or if its
       horizontal normal faces the camera */
    function vis(nu, nv, nz) { return (nz || 0) > 0.3 || ctx.faceVisible(FRONT * nu, nv); }

    /* ---------- light and materials ---------- */
    /* the renderer's light, from the world north-east and high. The lit and
       shaded hexes are blended by how squarely a face meets it, so a column's
       facets grade smoothly round the shaft instead of snapping two-tone */
    var LD = [0.55, 0.35, 0.72];
    function hex2(h) { var n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
    function mixHex(a, b, t) {
      var A = hex2(a), B = hex2(b), o = "#";
      for (var i = 0; i < 3; i++) o += ("0" + Math.round(A[i] + (B[i] - A[i]) * t).toString(16)).slice(-2);
      return o;
    }
    function tone(mat, nu, nv, nz) {
      var nl = Math.sqrt(nu * nu + nv * nv + nz * nz) || 1;
      var nx = FRONT * nu / nl, ny = nv / nl;
      nz = nz / nl;
      var d = nx * LD[0] + ny * LD[1] + nz * LD[2];
      var t = Math.max(0, Math.min(1, (d + 0.35) / 0.9));
      return ctx.shade(mixHex(mat.shade, mat.lit, t), nx, ny, nz);
    }
    var MARBLE  = { lit: "#f7f3ea", shade: "#e2e0d9", edge: "#b5afa3" }; /* Colorado Yule marble, white: columns, entablature, attic, cella */
    var RELIEF  = { lit: "#e3ded2", shade: "#cbc6bc", edge: "#b5afa3" }; /* the frieze wreaths, carved so they sit a shade darker */
    var GRANITE = { lit: "#cdbfb4", shade: "#b1a49b", edge: "#8a7f77" }; /* Milford pink granite: terrace, podium, stair, cheek walls */
    var TREADS  = { lit: "#bfb1a6", shade: "#a69a91", edge: "#8a7f77" }; /* the same granite, worn: treads a step darker than the terrace */
    var LIME    = { lit: "#59554c", shade: "#4d4942", edge: "#3b3832" }; /* Indiana limestone: no sun reaches it under 60 ft of roof */
    var LIMEC   = { lit: "#7c7667", shade: "#66604f", edge: "#3b3832" }; /* the Ionic columns catch a little more light */
    var PINK    = { lit: "#b3928a", shade: "#9d8079", edge: "#7a615a" }; /* Tennessee marble pedestal, pink, in the chamber shadow */
    var STATUE  = { lit: "#d9d5cb", shade: "#c4c2bb", edge: "#8f8b82" }; /* Georgia marble, white, lit only through the bay */
    var FLOORM  = { lit: "#7a6862", shade: "#7a6862", edge: "#5c4e49" }; /* the chamber floor: pink marble under 60 ft of roof reads dark */
    var BRONZE  = { lit: "#7a7856", shade: "#44452f", edge: "#2c2d22" }; /* the tripod urns */

    /* ---------- primitives, all in local feet ---------- */
    /* a box. o: {bias, nat, skip:[face idx], wuT, wvT, noTop, sw}
       faces: 0 the -v side (south), 1 the +u side (front), 2 +v (north), 3 -u (back) */
    function box(cu, cv, wu, wv, z0, h, mat, o) {
      o = o || {};
      var bu = wu / 2, bv = wv / 2;
      var tu = (o.wuT === undefined ? wu : o.wuT) / 2, tv = (o.wvT === undefined ? wv : o.wvT) / 2;
      var lo = [[cu-bu,cv-bv],[cu+bu,cv-bv],[cu+bu,cv+bv],[cu-bu,cv+bv]];
      var hi = [[cu-tu,cv-tv],[cu+tu,cv-tv],[cu+tu,cv+tv],[cu-tu,cv+tv]];
      var nrm = [[0,-1],[1,0],[0,1],[-1,0]];
      var bias = o.bias || 0, nat = !!o.nat, skip = o.skip || [];
      var sw = o.sw === undefined ? 0.4 : o.sw;
      for (var i = 0; i < 4; i++) {
        if (skip.indexOf(i) >= 0) continue;
        if (!vis(nrm[i][0], nrm[i][1], 0)) continue;
        var j = (i + 1) % 4;
        var q = [pt(lo[i][0],lo[i][1],z0), pt(lo[j][0],lo[j][1],z0),
                 pt(hi[j][0],hi[j][1],z0+h), pt(hi[i][0],hi[i][1],z0+h)];
        items.push({ svg: ctx.poly(q, tone(mat, nrm[i][0], nrm[i][1], 0), sw ? mat.edge : null, sw),
                     depth: dep(q, bias + i * 0.01, nat) });
      }
      if (!o.noTop) {
        var top = [pt(cu-tu,cv-tv,z0+h), pt(cu+tu,cv-tv,z0+h), pt(cu+tu,cv+tv,z0+h), pt(cu-tu,cv+tv,z0+h)];
        items.push({ svg: ctx.poly(top, tone(mat, 0, 0, 1), sw ? mat.edge : null, sw), depth: dep(top, bias + 0.05, nat) });
      }
    }
    /* one face, given its four corners and its outward normal */
    function face(q, mat, nu, nv, nz, bias, nat, sw) {
      if (!vis(nu, nv, nz)) return;
      sw = sw === undefined ? 0.4 : sw;
      items.push({ svg: ctx.poly(q, tone(mat, nu, nv, nz), sw ? mat.edge : null, sw), depth: dep(q, bias, nat) });
    }
    /* an n-sided frustum for the round things: r0 at the foot, r1 at the top.
       Ten facets on a column give five visible bands grading round the shaft,
       and the facet joints, stroked dark, read as the fluting */
    function oct(cu, cv, r0, r1, z0, h, mat, o) {
      o = o || {};
      var n = o.n || 10, lo = [], hi = [], bias = o.bias || 0, nat = !!o.nat;
      var sw = o.sw === undefined ? 0.3 : o.sw;
      for (var i = 0; i < n; i++) {
        var a = (i / n) * Math.PI * 2 + Math.PI / n;
        lo.push([cu + r0 * Math.cos(a), cv + r0 * Math.sin(a)]);
        hi.push([cu + r1 * Math.cos(a), cv + r1 * Math.sin(a)]);
      }
      for (var k = 0; k < n; k++) {
        var a0 = lo[k], a1 = lo[(k + 1) % n], b0 = hi[k], b1 = hi[(k + 1) % n];
        var mx = (a0[0] + a1[0]) / 2 - cu, my = (a0[1] + a1[1]) / 2 - cv;
        var l = Math.sqrt(mx * mx + my * my) || 1, nu = mx / l, nv = my / l;
        if (!vis(nu, nv, 0)) continue;
        var q = [pt(a0[0],a0[1],z0), pt(a1[0],a1[1],z0), pt(b1[0],b1[1],z0+h), pt(b0[0],b0[1],z0+h)];
        items.push({ svg: ctx.poly(q, tone(mat, nu, nv, 0), sw ? mat.edge : null, sw), depth: dep(q, bias, nat) });
      }
      var top = hi.map(function (v) { return pt(v[0], v[1], z0 + h); });
      items.push({ svg: ctx.poly(top, tone(mat, 0, 0, 1), sw ? mat.edge : null, sw), depth: dep(top, bias + 0.02, nat) });
    }
    /* a convex profile in the (u, z) plane, listed counter-clockwise, extruded
       from v0 to v1: the cheek walls, whose tops slope with the stair */
    function profile(prof, v0, v1, mat, bias, nat) {
      var n = prof.length;
      [[v0, -1], [v1, 1]].forEach(function (e) {
        if (!vis(0, e[1], 0)) return;
        var q = prof.map(function (a) { return pt(a[0], e[0], a[1]); });
        items.push({ svg: ctx.poly(q, tone(mat, 0, e[1], 0), mat.edge, 0.4), depth: dep(q, bias + 0.01, nat) });
      });
      for (var i = 0; i < n; i++) {
        var a = prof[i], b = prof[(i + 1) % n];
        var du = b[0] - a[0], dz = b[1] - a[1], l = Math.sqrt(du * du + dz * dz) || 1;
        var nu = dz / l, nz = -du / l;
        if (nz < -0.01) continue;             /* an underside */
        if (!vis(nu, 0, nz)) continue;
        var q = [pt(a[0],v0,a[1]), pt(b[0],v0,b[1]), pt(b[0],v1,b[1]), pt(a[0],v1,a[1])];
        items.push({ svg: ctx.poly(q, tone(mat, nu, 0, nz), mat.edge, 0.4), depth: dep(q, bias + 0.02 + i * 0.001, nat) });
      }
    }
    /* a flight of steps descending toward +u from (u0, zTop): n risers, each a
       distinct darker face, n-1 treads between them (the last tread is the
       surface the flight lands on). No per-step stroke: the riser/tread tone
       contrast is what reads as steps */
    function flight(u0, zTop, rise, run, n, halfW, bias, mat) {
      var r = rise / n, t = run / n;
      for (var k = 0; k < n; k++) {
        var u = u0 + k * t, zt = zTop - k * r, zb = zt - r;
        face([pt(u,-halfW,zb), pt(u,halfW,zb), pt(u,halfW,zt), pt(u,-halfW,zt)], mat, 1, 0, 0, bias + k, false, 0);
        if (k < n - 1)
          face([pt(u,-halfW,zb), pt(u+t,-halfW,zb), pt(u+t,halfW,zb), pt(u,halfW,zb)], mat, 0, 0, 1, bias + k + 0.5, false, 0);
      }
    }
    /* the convex hull of ground points (monotone chain), for the cast shadows */
    function hull(pts) {
      pts = pts.slice().sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
      function cross(o, a, b) { return (a[0]-o[0])*(b[1]-o[1]) - (a[1]-o[1])*(b[0]-o[0]); }
      var lo = [], up = [];
      pts.forEach(function (q) { while (lo.length >= 2 && cross(lo[lo.length-2], lo[lo.length-1], q) <= 0) lo.pop(); lo.push(q); });
      for (var i = pts.length - 1; i >= 0; i--) { var q = pts[i]; while (up.length >= 2 && cross(up[up.length-2], up[up.length-1], q) <= 0) up.pop(); up.push(q); }
      lo.pop(); up.pop();
      return lo.concat(up);
    }
    /* Sutherland-Hodgman: a convex polygon clipped to a (u, v) rectangle, so a
       shadow on the terrace top never runs past the terrace edge */
    function clipRect(poly, u0, u1, v0, v1) {
      function clip(pts, inside, inter) {
        var o = [];
        for (var i = 0; i < pts.length; i++) {
          var a = pts[i], b = pts[(i + 1) % pts.length], ia = inside(a), ib = inside(b);
          if (ia) o.push(a);
          if (ia !== ib) o.push(inter(a, b));
        }
        return o;
      }
      function atU(a, b, u) { var t = (u - a[0]) / (b[0] - a[0]); return [u, a[1] + (b[1] - a[1]) * t]; }
      function atV(a, b, v) { var t = (v - a[1]) / (b[1] - a[1]); return [a[0] + (b[0] - a[0]) * t, v]; }
      var r = clip(poly, function (q) { return q[0] >= u0; }, function (a, b) { return atU(a, b, u0); });
      r = clip(r, function (q) { return q[0] <= u1; }, function (a, b) { return atU(a, b, u1); });
      r = clip(r, function (q) { return q[1] >= v0; }, function (a, b) { return atV(a, b, v0); });
      r = clip(r, function (q) { return q[1] <= v1; }, function (a, b) { return atV(a, b, v1); });
      return r;
    }

    /* ---------- the facts, in feet ---------- */
    var L = 189.7, W = 118.5;                 /* block: long axis N-S (v), short axis E-W (u) */
    var hx = W / 2, hy = L / 2;
    var ROOF = 99;                            /* foundation to roofline */
    var CHAMBER_H = 60;                       /* central chamber height: the roof sits at floor + 60 */
    var FLOOR = ROOF - CHAMBER_H;             /* 39 ft: the chamber floor / stylobate level */
    var RISER = FLOOR / 87;                   /* 87 steps climb the 39 ft: 0.448 ft each */
    var PLAZA = 29 * RISER;                   /* 13 ft: plaza top, 29 steps above the pool edge */
    var TREAD = 1.2;                          /* NOT in the facts: assumed tread depth (14 in) */
    var RUN58 = 58 * TREAD, RUN29 = 29 * TREAD;
    var COL_H = 44, R = 7.5 / 2;              /* exterior Doric column: 44 ft on a 7.5 ft base, 5.9 to 1 */
    var CAP_H = COL_H / 12;                   /* one of the 12 drums is the capital */
    var ENT_H = 7, ATTIC_H = 9;               /* NOT in the facts: the 16 ft between column top and roofline, split 7/9 */
    var ARCH = 2.2, FRIEZE = 3.6;             /* the 7 ft entablature split architrave / frieze / cornice (assumed) */
    var CORN = ENT_H - ARCH - FRIEZE;         /* 1.2 ft cornice slab */
    var CORN_P = 2.5;                         /* cornice projection beyond the frieze, assumed (a third of a column diameter) */
    var ACORN = 1.2, ACORN_P = 1.0;           /* the attic's own cornice, assumed */
    var PAR_H = 0.6, PAR_IN = 1.2;            /* the low parapet on the attic roof, assumed */
    var MG = 30;                              /* terrace margin beyond the block, all four sides, assumed */
    var PLZ = 30;                             /* plaza depth between the two flights, assumed */
    /* 36 columns on a rectangle: 12 per long side + 8 per short side, corners shared
       = 12+12+8+8-4 = 36, and the spacing comes out even on both sides */
    var NL = 12, NS = 8;
    var BAY = (L - 2 * R) / (NL - 1);         /* 16.56 ft centre to centre: a clear 9 ft, 1.2 diameters */
    var BAYS = (W - 2 * R) / (NS - 1);        /* 15.86 ft on the short sides */
    var CX = hx - BAY, CY = hy - BAY;         /* cella outer half-sizes: one bay inside the block edge (derived) */
    var SB = BAY;                             /* attic setback: the attic storey stands over the cella line (derived) */
    var CHAMBER_D = 74, CHAMBER_W = 60;
    var TW = (2 * CX - CHAMBER_D) / 2;        /* wall thickness so the chamber is 74 ft deep: 5.7 ft */
    var OPN = 1.5 * BAY;                      /* entrance opening half-width: three bays, framed by the two in-antis columns */
    var CELLA_H = COL_H + ENT_H;              /* cella walls rise to the attic's underside */
    /* the stair's flanks. NOT in the facts: cheek wall thickness (10 ft, the
       reviewer's figure), its 3 ft parapet above the stylobate, the 12 ft
       buttress at its foot, and the 5 ft tripod urn on the buttress */
    var CHEEK = 10, CHEEK_PAR = 3, BUT_H = 12, BUT_D = 14, URN_H = 5;
    var SW = hy - CHEEK;                      /* stair clear half-width: the cheeks stand flush with the block's ends */
    var uT = hx + MG;                         /* terrace front edge */
    var uF = hx + RUN58;                      /* foot of the upper flight */
    var uL = uF + PLZ;                        /* head of the lower flight: the plaza's front edge */
    var uG = uL + RUN29;                      /* foot of the lower flight, at grade */

    /* how many steps to draw: the real count when a riser clears three
       pixels, fewer standing for them when it does not */
    var a0 = P(p.x, p.y, 0), a1 = P(p.x, p.y, FT);
    var pz = Math.sqrt((a1[0]-a0[0])*(a1[0]-a0[0]) + (a1[1]-a0[1])*(a1[1]-a0[1]));   /* px per foot of height */
    function nSteps(rise, real, min) { return Math.max(min, Math.min(real, Math.floor(rise * pz / 3.8))); }
    var nUp = nSteps(FLOOR - PLAZA, 58, 4), nLow = nSteps(PLAZA, 29, 3);

    /* ---------- cast shadows: every mass's footprint slid along the light ---------- */
    /* the same offset per unit height the renderer's own shadow() uses, so the
       lit faces and the shadows agree on where the sun is */
    var SDX = -0.55 * 0.9, SDY = -0.35 * 0.9;
    function sh(u, v, h) { return [u + FRONT * SDX * h, v + SDY * h]; }
    var lawnPts = [];
    function addFoot(u0, u1, v0, v1, h) {
      [[u0,v0],[u1,v0],[u1,v1],[u0,v1]].forEach(function (c) { lawnPts.push(c); lawnPts.push(sh(c[0], c[1], h)); });
    }
    addFoot(-uT, uT, -(hy + MG), hy + MG, PLAZA);
    addFoot(uT, uL, -hy, hy, PLAZA);
    addFoot(-hx, hx, -hy, hy, ROOF);
    addFoot(uL, uG, -hy, hy, 0);
    items.push({ svg: ctx.poly(hull(lawnPts).map(function (a) { return pt(a[0], a[1], 0.3 / FT); }), "#000", null, 0, ' opacity="0.2"'),
                 depth: -1e9 + 2 });
    /* the block's shadow on the terrace top, clipped to the terrace */
    (function () {
      var bp = [];
      [[-hx,-hy],[hx,-hy],[hx,hy],[-hx,hy]].forEach(function (c) { bp.push(c); bp.push(sh(c[0], c[1], ROOF - PLAZA)); });
      var q = clipRect(hull(bp), -uT, uT, -(hy + MG), hy + MG).map(function (a) { return pt(a[0], a[1], PLAZA + 0.1); });
      items.push({ svg: ctx.poly(q, "#000", null, 0, ' opacity="0.2"'), depth: dep(null, 500.5, false) });
    })();

    /* ---------- the granite terrace: a raised slab, retaining walls all round, the block centred on it ---------- */
    box(0, 0, 2 * uT, 2 * (hy + MG), 0, PLAZA, GRANITE, { bias: 500 });
    /* the stair base, projecting from the terrace front at plaza level; its
       front face is the lower flight, its back is against the terrace */
    box((uT + uL) / 2, 0, uL - uT, 2 * hy, 0, PLAZA, GRANITE, { bias: 600, skip: [1, 3] });

    /* ---------- 1. lower flight: 29 granite steps, lawn up to the plaza ---------- */
    /* its sides, and a backing ramp so no hairline shows between the steps */
    face([pt(uL,hy,0), pt(uG,hy,0), pt(uL,hy,PLAZA)], GRANITE, 0, 1, 0, 699);
    face([pt(uG,-hy,0), pt(uL,-hy,0), pt(uL,-hy,PLAZA)], GRANITE, 0, -1, 0, 699);
    face([pt(uL,-hy,PLAZA), pt(uL,hy,PLAZA), pt(uG,hy,0), pt(uG,-hy,0)], TREADS, PLAZA, 0, RUN29, 699.5, false, 0);
    flight(uL, PLAZA, PLAZA, RUN29, nLow, hy, 700, TREADS);

    /* ---------- 2. upper flight: 58 granite steps, plaza up to the stylobate, between the cheek walls ---------- */
    face([pt(hx,-SW,FLOOR), pt(hx,SW,FLOOR), pt(uF,SW,PLAZA), pt(uF,-SW,PLAZA)], TREADS, FLOOR - PLAZA, 0, RUN58, 999.5, false, 0);
    flight(hx, FLOOR, FLOOR - PLAZA, RUN58, nUp, SW, 1000, TREADS);
    /* the block's shadow falls down the upper flight: a point on the block's
       front face at height z above the stylobate, slid along the light, meets
       the stair plane (z = FLOOR - k (u - hx)) after dropping z / (1 - du k),
       so the shadow is the parallelogram between the foot of the front face
       and where the roofline lands, clipped to the flight */
    (function () {
      var k = (FLOOR - PLAZA) / RUN58, du = FRONT * SDX, dv = SDY;
      var hTop = (ROOF - FLOOR) / (1 - du * k);
      var sp = clipRect([[hx, -hy], [hx, hy], [hx + du * hTop, hy + dv * hTop], [hx + du * hTop, -hy + dv * hTop]],
                        hx, uF, -SW, SW);
      var q = sp.map(function (a) { return pt(a[0], a[1], FLOOR - k * (a[0] - hx) + 0.3); });
      items.push({ svg: ctx.poly(q, "#000", null, 0, ' opacity="0.26"'), depth: dep(null, 1000 + nUp + 1, false) });
    })();

    /* ---------- the podium under the colonnade: granite, a marble stylobate course on top ---------- */
    /* its front face is the stair and the cheek walls, so it is not drawn */
    box(0, 0, W, L, PLAZA, FLOOR - PLAZA - 1, GRANITE, { bias: 1100, skip: [1], noTop: true });
    box(0, 0, W, L, FLOOR - 1, 1, MARBLE, { bias: 1101, skip: [1] });

    /* ---------- chamber interior (seen through the open entrance bay) ---------- */
    var IX0 = -CX + TW, IX1 = CX - TW, IY = CY - TW;
    box(0, 0, IX1 - IX0, 2 * IY, FLOOR, 0.3, FLOORM, { bias: 1500, sw: 0 });
    face([pt(IX0, -IY, FLOOR), pt(IX0, IY, FLOOR), pt(IX0, IY, FLOOR + CELLA_H), pt(IX0, -IY, FLOOR + CELLA_H)],
         LIME, 1, 0, 0, 1500.5);
    face([pt(IX0, IY, FLOOR), pt(IX1, IY, FLOOR), pt(IX1, IY, FLOOR + CELLA_H), pt(IX0, IY, FLOOR + CELLA_H)],
         LIME, 0, -1, 0, 1500.6);
    face([pt(IX1, -IY, FLOOR), pt(IX0, -IY, FLOOR), pt(IX0, -IY, FLOOR + CELLA_H), pt(IX1, -IY, FLOOR + CELLA_H)],
         LIME, 0, 1, 0, 1500.6);
    /* eight interior Ionic columns, two rows of four along the chamber's sides, 50 ft, 5.5 ft at the base */
    var IR = 5.5 / 2, ION_H = 50;
    for (var r = 0; r < 4; r++) {
      var iu = IX1 - CHAMBER_D * (r + 0.5) / 4;
      [-1, 1].forEach(function (sg) {
        oct(iu, sg * CHAMBER_W / 2, IR, IR * 0.86, FLOOR, ION_H - 2, LIMEC, { bias: 1600, nat: true, n: 8 });
        box(iu, sg * CHAMBER_W / 2, IR * 2.2, IR * 2.2, FLOOR + ION_H - 2, 2, LIMEC, { bias: 1600, nat: true });
      });
    }
    /* the seated Lincoln: 19 ft of white marble on a 10 ft pink pedestal, 16 wide by 17 deep,
       against the back wall, facing the entrance. Blocked as chair and legs, torso, head. */
    var PX = IX0 + 17 / 2 + 2;
    box(PX, 0, 17, 16, FLOOR, 10, PINK, { bias: 1600, nat: true });
    box(PX + 1, 0, 14, 15, FLOOR + 10, 9, STATUE, { bias: 1601, nat: true });
    box(PX - 3, 0, 8, 10, FLOOR + 19, 7, STATUE, { bias: 1601.5, nat: true });
    box(PX - 3, 0, 3.5, 3.5, FLOOR + 26, 3, STATUE, { bias: 1602, nat: true });

    /* ---------- 3. the peristyle: 36 fluted Doric columns, 44 ft, 7.5 ft at the base ---------- */
    var cols = [], seen = {};
    function addCol(u, v) { var k = u.toFixed(2) + "," + v.toFixed(2); if (seen[k]) return; seen[k] = 1; cols.push([u, v]); }
    for (var a = 0; a < NL; a++) { var vv = -(hy - R) + a * BAY; addCol(-(hx - R), vv); addCol(hx - R, vv); }
    for (var b = 0; b < NS; b++) { var uu = -(hx - R) + b * BAYS; addCol(uu, -(hy - R)); addCol(uu, hy - R); }
    var perim = cols.length;                  /* 36 */
    /* the two in-antis Doric columns at the entrance, framing the centre bay */
    cols.push([CX - TW / 2, -BAY / 2]); cols.push([CX - TW / 2, BAY / 2]);
    /* Greek Doric: the shaft stands straight on the stylobate, no base;
       it tapers to four fifths, and the capital is a flaring echinus under a
       square abacus */
    function doric(u, v) {
      var SH = COL_H - CAP_H;
      oct(u, v, R, R * 0.8, FLOOR, SH, MARBLE, { bias: 2000, nat: true });
      oct(u, v, R * 0.8, R * 1.05, FLOOR + SH, CAP_H * 0.5, MARBLE, { bias: 2000.3, nat: true });        /* echinus */
      box(u, v, 2.3 * R, 2.3 * R, FLOOR + SH + CAP_H * 0.5, CAP_H * 0.5, MARBLE, { bias: 2000.6, nat: true }); /* abacus */
    }
    cols.forEach(function (c) { doric(c[0], c[1]); });

    /* ---------- the cella: walls one bay inside the colonnade, open at the centre of the entrance face ---------- */
    /* each wall skips its INWARD face: those are the chamber's limestone
       interior, painted in the 1500 layer */
    box(-CX + TW / 2, 0, TW, 2 * CY, FLOOR, CELLA_H, MARBLE, { bias: 2000, nat: true, skip: [1] });           /* back wall */
    box(0,  CY - TW / 2, 2 * CX, TW, FLOOR, CELLA_H, MARBLE, { bias: 2000, nat: true, skip: [0] });           /* north wall */
    box(0, -CY + TW / 2, 2 * CX, TW, FLOOR, CELLA_H, MARBLE, { bias: 2000, nat: true, skip: [2] });           /* south wall */
    var segW = CY - OPN;
    box(CX - TW / 2,  OPN + segW / 2, TW, segW, FLOOR, CELLA_H, MARBLE, { bias: 2000, nat: true, skip: [3] }); /* front wall, north of the opening */
    box(CX - TW / 2, -OPN - segW / 2, TW, segW, FLOOR, CELLA_H, MARBLE, { bias: 2000, nat: true, skip: [3] }); /* front wall, south of the opening */

    /* ---------- the stair's flanks: a cheek wall sloping down each side, a buttress at its foot, a tripod urn on each ---------- */
    [-1, 1].forEach(function (sg) {
      var v0 = Math.min(sg * SW, sg * hy), v1 = Math.max(sg * SW, sg * hy);
      profile([[hx, PLAZA], [uF, PLAZA], [uF, PLAZA + BUT_H - 2], [hx, FLOOR + CHEEK_PAR]], v0, v1, GRANITE, 2500, true);
      var bu = uF + BUT_D / 2, bv = sg * (SW + CHEEK / 2);
      box(bu, bv, BUT_D, CHEEK, PLAZA, BUT_H, GRANITE, { bias: 2500, nat: true });
      oct(bu, bv, 0.8, 0.8, PLAZA + BUT_H, URN_H * 0.4, BRONZE, { bias: 2501, nat: true, n: 6 });          /* the tripod's stem */
      oct(bu, bv, 1.4, 2.6, PLAZA + BUT_H + URN_H * 0.4, URN_H * 0.6, BRONZE, { bias: 2501.5, nat: true, n: 8 }); /* the bowl */
    });

    /* ---------- 4. the Doric entablature: architrave, frieze of 36 state names between wreaths, projecting cornice ---------- */
    var zA = FLOOR + COL_H, zF = zA + ARCH;
    box(0, 0, W, L, zA, ARCH, MARBLE, { bias: 3000, noTop: true });
    box(0, 0, W, L, zF, FRIEZE, MARBLE, { bias: 3020, noTop: true });
    /* a wreath over every column: a 2 ft relief square proud of the frieze */
    var WR = 2.0;
    function wreath(u, v, nu, nv) {
      var e = 0.15, cu = u + nu * e, cv = v + nv * e, tu = -nv, tv = nu;
      var q = [pt(cu - tu*WR/2, cv - tv*WR/2, zF + 0.8), pt(cu + tu*WR/2, cv + tv*WR/2, zF + 0.8),
               pt(cu + tu*WR/2, cv + tv*WR/2, zF + 0.8 + WR), pt(cu - tu*WR/2, cv - tv*WR/2, zF + 0.8 + WR)];
      face(q, RELIEF, nu, nv, 0, 3020.5, false, 0.25);
    }
    for (var ci = 0; ci < perim; ci++) {
      var cu = cols[ci][0], cv = cols[ci][1];
      if (Math.abs(Math.abs(cu) - (hx - R)) < 0.01) wreath(cu > 0 ? hx : -hx, cv, cu > 0 ? 1 : -1, 0);
      if (Math.abs(Math.abs(cv) - (hy - R)) < 0.01) wreath(cu, cv > 0 ? hy : -hy, 0, cv > 0 ? 1 : -1);
    }
    box(0, 0, W + 2 * CORN_P, L + 2 * CORN_P, zF + FRIEZE, CORN, MARBLE, { bias: 3100 });

    /* ---------- 5. the attic storey, set back over the cella, its own cornice and a low parapet (frieze of 48 state names) ---------- */
    var AW = W - 2 * SB, AL = L - 2 * SB, AZ = FLOOR + COL_H + ENT_H;
    box(0, 0, AW, AL, AZ, ATTIC_H - ACORN - PAR_H, MARBLE, { bias: 4000, noTop: true });
    box(0, 0, AW + 2 * ACORN_P, AL + 2 * ACORN_P, AZ + ATTIC_H - ACORN - PAR_H, ACORN, MARBLE, { bias: 4100 });
    box(0, 0, AW - 2 * PAR_IN, AL - 2 * PAR_IN, AZ + ATTIC_H - PAR_H, PAR_H, MARBLE, { bias: 4200 });

    return items;
  };
})();
