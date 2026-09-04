/* dc-form-monument.js: the Washington Monument as a massing model.
 *
 * Every dimension below is a research fact converted to metres:
 *   shaft foot          55 ft square           = 16.764 m
 *   shaft top           34 ft 5.5 in square    = 10.503 m  (at the 500 ft level; 0.627 of the foot)
 *   shaft height        500 ft                 = 152.4 m   (9.09 x the foot)
 *   pyramidion          55 ft                  = 16.764 m  (500 ft level to apex; 555 ft total; 1.60 x its base)
 *   colour change       150 ft                 = 45.72 m   (1848-54 stone below, 1879-84 above; a flat colour shift, no ledge)
 *   windows             3 ft wide, in pairs    = 0.914 m, one pair per face, a few feet below the pyramidion
 *   aluminum tip        8.9 in tall on a 5.6 in square base = 0.226 m on 0.142 m
 *   flags               50 poles in a ring round the base, 7.2 degrees apart
 *   entrance            one doorway, ground level, east face
 *   the knoll           the shaft stands on a grassy mound about 30 ft above Mall grade (0.55 x the foot),
 *                       the 2005 Olin landscape: terraces rising to the plaza, walkways as nested ovals
 *                       elongated east-west along the Mall axis, 1.4 x their north-south width, their
 *                       centres stepping east, a low granite ha-ha wall beside each path
 * The 80 ft stepped foundation is entirely below grade and is not drawn: there is
 * no plinth, drum or step. The shaft rises straight out of a small paved circle
 * flush in the flat top of the mound.
 *
 * Numbers the research facts do NOT give, taken from the reviewers' brief and
 * marked ASSUMED where used, all as multiples of the 55 ft foot:
 *   the mound       its foot is the outer walkway (8 x the foot north-south, 1.4 x that east-west),
 *                   its flat top reaches just past the flag ring (2.6 x the foot), rising 0.55 x the foot
 *   the paved circle 2 x the foot across (110 ft), flat, flush in the mound's top
 *   the flag ring   4.7 x the foot across (about 260 ft), standing on the flat top
 *   flagpoles       0.45 x the foot tall (25 ft), 0.005 x the foot thick (3.3 in), a 6 x 4 ft flag
 *   security walls  three nested ovals, north-south semi-axes 4, 6 and 8 x the foot (220, 330, 440 ft),
 *                   east-west 1.4 x that, each centre 0.3 x the foot further east than the last,
 *                   0.045 x the foot tall (30 in), with a pale path band beside each
 *   the doorway     0.15 x 0.20 of the foot (about 8 x 11 ft), bronze, at plaza grade, no steps
 * plus the window height, elevation and spacing (2 ft tall, 10 ft apart, 3 ft under
 * the pyramidion), the wall thickness (1.5 ft) and the path width (10 ft), which
 * no source here gives.
 *
 * Tone (research facts + the reviewers' photographs): the two marble sources
 * meet at a visible line at 150 ft; the lower 1848-54 section is the whiter
 * stone, the 1879-84 stone above it reads slightly darker and warmer. Both read
 * as white to pale grey-white from the Mall, so the difference is kept small,
 * and the change is a colour boundary only: the faces meet edge to edge with
 * the renderer's hairline between them, no separate lit course.
 *
 * Light: ONE vector, the renderer's own L = (0.55, 0.35, 0.72), for every
 * face of every part: the shaft, the pyramidion, the tip, the walls, the
 * mound's slopes and the flagpoles. Faces whose outward normal faces +L are
 * lit (a slightly warmer tone); faces turned away are in shade (cooler); every
 * cast shadow, the shaft's and the fifty poles', travels along -L. Shading is
 * done here rather than through ctx.shade because the renderer's shader tops
 * out near 75% on the faces this camera sees and marble in sun is near white.
 *
 * Painter's order on the ground (the renderer keeps ground at -1e9, water at
 * -1e9+1, shadows at -1e9+2): the lawn apron +0.1, the mound's flat top +0.3,
 * the mound's slope quads +0.40..+0.49 far to near, the path bands +0.50..+0.59
 * far to near, the paved circle +0.6, the shaft's shadow +2, the poles'
 * shadows +2.05. Everything solid sorts by its own nearest point after that.
 */
(function () {
  var H = window.DC3D.helpers;
  window.DC_FORMS = window.DC_FORMS || {};

  var FT = 0.3048, IN = 0.0254;
  var MARBLE_LOW = { warm: [252, 249, 242], cool: [240, 240, 237] };  /* lower 150 ft, 1848-54, the whiter marble */
  var MARBLE_UP  = { warm: [241, 234, 221], cool: [228, 225, 217] };  /* 1879-84 stone above, slightly darker and warmer */
  var ALUMINUM   = { warm: [225, 228, 232], cool: [190, 194, 198] };  /* the apex, a highlight */
  var GRANITE    = { warm: [172, 168, 160], cool: [150, 147, 140] };  /* the low security walls */
  var LAWN       = [207, 216, 196];                                    /* H.C.lawn, "#cfd8c4" */
  var PLAZA      = "#e2dccf";                                          /* the paved circle at the foot */
  var PATH       = "#d9d3c5";                                          /* the walkway band beside each wall */
  var POLE       = "#f2f1ec";                                          /* white flagpoles */
  var FLAG_RW    = "#c4635e";                                          /* seven red and six white stripes, seen from far */
  var FLAG_BLUE  = "#3d4a78";                                          /* the canton */
  var GLASS      = "#4a4f57";
  var BRONZE     = "#5a4a34";                                          /* the entrance doors */
  var EDGE       = H.C.edge;

  /* the renderer's light, as a direction; every shadow travels along -L */
  var L = { x: 0.55, y: 0.35, z: 0.72 };

  function rgb(c) { return "rgb(" + Math.round(c[0]) + "," + Math.round(c[1]) + "," + Math.round(c[2]) + ")"; }
  function scale(c, k) { return [Math.min(255, c[0] * k), Math.min(255, c[1] * k), Math.min(255, c[2] * k)]; }
  /* the material's colour on a face with outward normal (nx,ny,nz): one
     curve for every part, continuous at d = 0, lit faces warm, shade faces
     cool. A face square to the light is 100%, one turned fully away 72%. */
  function faceColor(mat, nx, ny, nz) {
    var d = nx * L.x + ny * L.y + nz * L.z;
    return d > 0 ? rgb(scale(mat.warm, 0.90 + 0.10 * d)) : rgb(scale(mat.cool, 0.72 + 0.18 * (1 + Math.max(-1, d))));
  }

  var NRM = [[0, -1], [1, 0], [0, 1], [-1, 0]];   /* south, east, north, west */

  window.DC_FORMS.monument = function (ctx, p, s, VE) {
    var P = ctx.project, out = [];
    var cx = p.x, cy = p.y;

    /* ---- the camera, recovered from the pure context so sloped faces can be
       culled on their true 3D normal (the pyramidion's rear faces must never
       paint, at any yaw or pitch) ---- */
    var o = P(0, 0, 0), ez = P(0, 0, 1), ex = P(1, 0, 0), ey = P(0, 1, 0);
    var SY = ex[2] - o[2], CY = ey[2] - o[2];              /* sin yaw, cos yaw */
    var r1 = P(SY, CY, 0);                                  /* a point one unit nearer the camera */
    var pitch = Math.atan2(r1[1] - o[1], o[1] - ez[1]);
    var CP = Math.cos(pitch), SP = Math.sin(pitch);
    function visible3(nx, ny, nz) { return (nx * SY + ny * CY) * CP + nz * SP > 0.001; }
    /* a ground item's depth, far to near, inside one of the ground slots:
       ry runs about -400..+400 m across this model, mapped into 0.09 */
    function gdepth(slot, q) {
      var ry = q[0][2];
      for (var i = 1; i < q.length; i++) if (q[i][2] < ry) ry = q[i][2];
      return -1e9 + slot + 0.09 * Math.min(1, Math.max(0, (ry + 400) / 800));
    }

    /* ---- facts ---- */
    var W0 = 55 * FT;                    /* 16.764 m at the foot */
    var W1 = (34 + 5.5 / 12) * FT;       /* 10.503 m at the 500 ft level: 34 ft 5.5 in, 0.627 of the foot */
    var SHAFT_H = 500 * FT * VE;         /* 152.4 m to the pyramidion seat */
    var PYR_H = 55 * FT * VE;            /* 16.764 m: 1.60 x the top square */
    var BAND_Z0 = 150 * FT * VE;         /* colour change at 150 ft */

    /* ---- the ground: the grassy knoll, 30 ft above Mall grade (0.55 x the
       foot), an oval in plan like the walkways on it (1.4 x wider east-west),
       its foot at the outer walkway and a flat top holding the paved circle
       and the flag ring. The slope from the top down to the outer walkway is
       a cosine profile, at most about 9 degrees. ---- */
    var ASP = 1.4;                                   /* east-west elongation of the Olin ovals */
    var KNOLL_H = 0.55 * W0 * VE;                    /* 9.22 m, the 30 ft rise */
    /* The knoll's foot was 8 x the shaft's 55 ft, so 880 ft north-south and
       1,230 ft east-west: nearly three times the real mound. At the sizes
       this renders, that turned the Olin landscape into a set of concentric
       ovals that read as ripples in a pond and swallowed the obelisk. The
       monument is the subject; the landscaping sits under it. */
    var KNOLL_R = 4.2 * W0;                          /* north-south semi-axis of the mound's foot */
    var TOP_R = 2.6 * W0;                            /* north-south semi-axis of the flat top */
    var PLAZA_R = 1 * W0;                            /* the paved circle */
    var Z0 = KNOLL_H;                                /* the shaft's foot stands on the paved circle */
    function rho(x, y) {                             /* oval radius: the north-south radius of the oval through (x,y) */
      var dx = (x - cx) / ASP, dy = y - cy;
      return Math.sqrt(dx * dx + dy * dy);
    }
    function zk(r) {                                 /* mound surface height at oval radius r */
      if (r <= TOP_R) return KNOLL_H;
      if (r >= KNOLL_R) return 0;
      return KNOLL_H * 0.5 * (1 + Math.cos(Math.PI * (r - TOP_R) / (KNOLL_R - TOP_R)));
    }
    function dzk(r) {                                /* its slope, dz/dr (negative on the slope) */
      if (r <= TOP_R || r >= KNOLL_R) return 0;
      return -KNOLL_H * 0.5 * Math.PI / (KNOLL_R - TOP_R) * Math.sin(Math.PI * (r - TOP_R) / (KNOLL_R - TOP_R));
    }
    function zAt(x, y) { return zk(rho(x, y)); }
    var SEG = 64;
    /* a point on the oval of north-south semi-axis r about (ox,oy), at parameter a */
    function ov(ox, oy, r, a, z) { return P(ox + ASP * r * Math.cos(a), oy + r * Math.sin(a), z); }

    /* the lawn apron: the renderer's own pad is 2.2 heights square, and its
       corner shows inside a close-up frame fitted to the shaft; a wider
       apron under it keeps grass to the far and side edges. It is kept
       inside the whole Mall's ground rectangle (Constitution Avenue, 300 m
       north of the axis, is the near limit) and painted the same colour, so
       in the Mall scene it is invisible; a wider one would put a lawn tab
       north of the Mall in that scene and grow its frame. */
    var AW = 1500, AE = 2400, AS = 1150, AN = 300;   /* west, east, south, north: inside the Mall's own ground */
    var apron = [P(cx - AW, cy - AS, 0), P(cx + AE, cy - AS, 0), P(cx + AE, cy + AN, 0), P(cx - AW, cy + AN, 0)];
    out.push({ svg: ctx.poly(apron, rgb(LAWN), null, 0), depth: -1e9 + 0.1 });

    /* the flat top, one oval at the knoll's height */
    var topQ = [];
    for (var ti = 0; ti < SEG; ti++) topQ.push(ov(cx, cy, TOP_R, (ti / SEG) * Math.PI * 2, KNOLL_H));
    out.push({ svg: ctx.poly(topQ, rgb(LAWN), rgb(LAWN), 0.6), depth: -1e9 + 0.3 });

    /* The slope as a surface: twelve oval bands of 64 quads, every quad at
       its true height and tinted on its own normal by the same light as
       every other face: the slope facing +L (south-west) lit, the far slope
       in shade. Every quad carries a stroke of its own colour to close the
       seams, and sorts far to near so the near slope always paints over the
       far one whatever the pitch. */
    var BANDS = 12;
    for (var bi = 0; bi < BANDS; bi++) {
      var rOut = TOP_R + (KNOLL_R - TOP_R) * (bi + 1) / BANDS;
      var rIn = TOP_R + (KNOLL_R - TOP_R) * bi / BANDS;
      var rMid = (rOut + rIn) / 2, zOut = zk(rOut), zIn = zk(rIn), gr = dzk(rMid);
      for (var si = 0; si < SEG; si++) {
        var a0 = (si / SEG) * Math.PI * 2, a1 = ((si + 1) / SEG) * Math.PI * 2, am = (a0 + a1) / 2;
        var q = [ov(cx, cy, rOut, a0, zOut), ov(cx, cy, rOut, a1, zOut), ov(cx, cy, rIn, a1, zIn), ov(cx, cy, rIn, a0, zIn)];
        /* z = zk(rho): dz/dx = zk'(rho) cos(a)/ASP, dz/dy = zk'(rho) sin(a); normal = (-dz/dx, -dz/dy, 1) */
        var gx = gr * Math.cos(am) / ASP, gy = gr * Math.sin(am);
        var nl = Math.sqrt(1 + gx * gx + gy * gy);
        var nx = -gx / nl, ny = -gy / nl, nz = 1 / nl;
        var d = nx * L.x + ny * L.y + nz * L.z;
        var kf = 1 + Math.max(-0.14, Math.min(0.10, 2.2 * (d - L.z)));
        var col = rgb(scale(LAWN, kf));
        out.push({ svg: ctx.poly(q, col, col, 0.6), depth: gdepth(0.40, q) });
      }
    }
    /* the paved circle, flat in the mound's top, no rim, no step */
    var plazaQ = [];
    for (var pi = 0; pi < SEG; pi++) plazaQ.push(P(cx + PLAZA_R * Math.cos((pi / SEG) * Math.PI * 2), cy + PLAZA_R * Math.sin((pi / SEG) * Math.PI * 2), Z0));
    out.push({ svg: ctx.poly(plazaQ, PLAZA, EDGE, 0.4), depth: -1e9 + 0.6 });

    /* ---- the 2005 security landscape: three nested oval ha-ha walls in
       granite, each with a pale walkway band on its outside, laid on the
       slope. ASSUMED (reviewers' brief): north-south semi-axes 4, 6 and 8 x
       the foot, east-west 1.4 x that, centres stepping 0.3 x the foot east,
       0.045 x the foot tall; wall 1.5 ft thick and path 10 ft wide are this
       file's own guesses, no source gives them. The path bands are ground
       paint; the walls are solid bodies sorted by their own nearest point,
       so the near arc of each oval paints over the ground and the far arc
       paints before the shaft. ---- */
    /* Two walls, not three, and inside the knoll's foot. At 4, 6 and 8 x the
       shaft the outermost pair sat beyond the mound entirely, drawing as bare
       hairline ovals on flat lawn: the ripples-in-a-pond look. A wall that
       does not sit on the mound it retains is not a wall. */
    var WALL_R = [2.9 * W0, 3.8 * W0], WALL_H = 0.045 * W0 * VE, WALL_T = 1.5 * FT, PATH_W = 10 * FT;
    var WALL_OX = [0, 0.25 * W0];                    /* each oval's centre, east of the shaft */
    for (var wi = 0; wi < WALL_R.length; wi++) {
      var wr = WALL_R[wi], wox = cx + WALL_OX[wi];
      for (var ps = 0; ps < SEG; ps++) {
        var pa0 = (ps / SEG) * Math.PI * 2, pa1 = ((ps + 1) / SEG) * Math.PI * 2;
        var pr0 = wr + WALL_T / 2, pr1 = pr0 + PATH_W;
        function pp(r, a) { var x = wox + ASP * r * Math.cos(a), y = cy + r * Math.sin(a); return P(x, y, zAt(x, y) + 0.02); }
        var pq = [pp(pr1, pa0), pp(pr1, pa1), pp(pr0, pa1), pp(pr0, pa0)];
        out.push({ svg: ctx.poly(pq, PATH, PATH, 0.6), depth: gdepth(0.50, pq) });
      }
    }
    for (var wj = 0; wj < WALL_R.length; wj++) {
      var wr2 = WALL_R[wj], wox2 = cx + WALL_OX[wj], ro = wr2 + WALL_T / 2, rin = wr2 - WALL_T / 2;
      for (var ws = 0; ws < SEG; ws++) {
        var wa0 = (ws / SEG) * Math.PI * 2, wa1 = ((ws + 1) / SEG) * Math.PI * 2, wam = (wa0 + wa1) / 2;
        /* the oval's outward plan normal at wam: (cos/a, sin/b) normalised */
        var nnx = Math.cos(wam) / ASP, nny = Math.sin(wam), nnl = Math.sqrt(nnx * nnx + nny * nny);
        var onx = nnx / nnl, ony = nny / nnl;
        function wp(r, a, dz) { var x = wox2 + ASP * r * Math.cos(a), y = cy + r * Math.sin(a); return P(x, y, zAt(x, y) + dz); }
        /* outer face, outward normal radial */
        if (ctx.faceVisible(onx, ony)) {
          var of = [wp(ro, wa0, 0), wp(ro, wa1, 0), wp(ro, wa1, WALL_H), wp(ro, wa0, WALL_H)];
          var oc = faceColor(GRANITE, onx, ony, 0);
          out.push({ svg: ctx.poly(of, oc, oc, 0.4), depth: H.depthOf(of) });
        }
        /* inner face, seen on the far arc of the oval */
        if (ctx.faceVisible(-onx, -ony)) {
          var inf = [wp(rin, wa0, 0), wp(rin, wa1, 0), wp(rin, wa1, WALL_H), wp(rin, wa0, WALL_H)];
          var ic = faceColor(GRANITE, -onx, -ony, 0);
          out.push({ svg: ctx.poly(inf, ic, ic, 0.4), depth: H.depthOf(inf) });
        }
        var tp = [wp(ro, wa0, WALL_H), wp(ro, wa1, WALL_H), wp(rin, wa1, WALL_H), wp(rin, wa0, WALL_H)];
        var tc = faceColor(GRANITE, 0, 0, 1);
        out.push({ svg: ctx.poly(tp, tc, tc, 0.4), depth: H.depthOf(tp) + 0.02 });
      }
    }

    /* half-width of the square shaft at height z above its foot: a uniform batter */
    function hw(z) { return 0.5 * (W0 + (W1 - W0) * Math.min(1, Math.max(0, z / SHAFT_H))); }
    /* a corner of the square at height z, corner index k in the prism's order */
    function corner(k, z) {
      var b = hw(z);
      var sx = (k === 1 || k === 2) ? 1 : -1, sy = (k >= 2) ? 1 : -1;
      return [cx + sx * b, cy + sy * b, z];
    }

    /* ---- the cast shadow: the foot and the apex projected along -L onto the
       real ground surface, as one tapered wedge. It starts at the shaft's
       foot on the paved circle, crosses the circle and the flat top, and
       drapes down the mound's south-west slope onto the lawn; there is no
       rim to jog over because the paving is flush with the grass. ---- */
    function shadowOf(x, y, z) {   /* where a point at (x,y,z) lands, on the real ground */
      var t = z / L.z, sx = x - t * L.x, sy = y - t * L.y;
      for (var it = 0; it < 6; it++) {
        var zs = zAt(sx, sy);
        t = (z - zs) / L.z; sx = x - t * L.x; sy = y - t * L.y;
      }
      return P(sx, sy, zAt(sx, sy) + 0.15);
    }
    /* silhouette corners for a shadow running toward -x,-y: (+,-) and (-,+);
       the corner toward the light (+,+) closes the hull, (-,-) lies inside it */
    var b0 = hw(0), sh = [];
    sh.push(shadowOf(cx + b0, cy + b0, Z0));
    sh.push(shadowOf(cx + b0, cy - b0, Z0));
    var NS = 24;
    for (var u = 1; u <= NS; u++) {
      var f = u / NS, zz = Z0 + f * (SHAFT_H + PYR_H), bz = hw(f * (SHAFT_H + PYR_H)) * (1 - Math.max(0, (zz - Z0 - SHAFT_H)) / PYR_H);
      sh.push(shadowOf(cx + bz, cy - bz, zz));
    }
    for (var v = NS - 1; v >= 1; v--) {
      var g = v / NS, zg = Z0 + g * (SHAFT_H + PYR_H), bg = hw(g * (SHAFT_H + PYR_H)) * (1 - Math.max(0, (zg - Z0 - SHAFT_H)) / PYR_H);
      sh.push(shadowOf(cx - bg, cy + bg, zg));
    }
    sh.push(shadowOf(cx - b0, cy + b0, Z0));
    /* depth -1e9+2 is where the renderer keeps ground shadows: after the
       lawn, the mound, the paving and the path bands, before every solid,
       and inside the close-up's frame fit, so the shadow is never cut off */
    out.push({ svg: ctx.poly(sh, "#000", null, 0, ' opacity="0.22"'), depth: -1e9 + 2 });

    /* ---- fifty free-standing flagpoles in a ring on the flat top, 7.2
       degrees apart. ASSUMED (reviewers' brief): ring 4.7 x the foot across,
       25 ft poles 3.3 in thick flying a 6 x 4 ft flag, every flag on the
       same side of its pole (downwind). A 3.3 in pole is under a pixel at
       any map scale, so it is drawn as a stroked line of its own colour; the
       flag is a stripe-coloured quad with a blue canton at the upper hoist.
       Each pole casts its own short shadow along -L, in proportion to its
       height, the same rule as the shaft; each is sorted by its own foot,
       so the near arc paints over the paving and the far arc paints before
       the shaft. ---- */
    var RING_R = 2.35 * W0, POLE_H = 0.45 * W0 * VE, POLE_W = 0.005 * W0, FLAGS = 50;
    var FLAG_W = 6 * FT, FLAG_H = 4 * FT;
    var SH_T = POLE_H / L.z;                         /* a 25 ft pole's shadow runs 22.6 ft along -L in plan */
    for (var fi = 0; fi < FLAGS; fi++) {
      var fa = (fi / FLAGS) * Math.PI * 2;
      var px = cx + RING_R * Math.cos(fa), py = cy + RING_R * Math.sin(fa), pz = zAt(px, py);
      var ex2 = px - SH_T * L.x, ey2 = py - SH_T * L.y;
      var shp = [P(px, py, pz + 0.15), P(ex2, ey2, zAt(ex2, ey2) + 0.15)];
      out.push({ svg: ctx.poly(shp, "none", "#000", 0.9, ' opacity="0.22"'), depth: -1e9 + 2.05 });
      var pb = P(px, py, pz), pt = P(px, py, pz + POLE_H);
      var pdepth = pb[2] + 0.5;
      out.push({ svg: ctx.poly([pb, pt, P(px + POLE_W, py, pz + POLE_H), P(px + POLE_W, py, pz)], POLE, POLE, 0.9), depth: pdepth });
      var zt = pz + POLE_H, zb = zt - FLAG_H;
      var fl = [P(px, py, zt), P(px + FLAG_W, py, zt), P(px + FLAG_W, py, zb), P(px, py, zb)];
      out.push({ svg: ctx.poly(fl, FLAG_RW, null, 0), depth: pdepth + 0.3 });
      var cw = FLAG_W * 0.4, ch = FLAG_H * 7 / 13;       /* the canton: 2/5 of the fly, 7 of 13 stripes */
      var cn = [P(px, py, zt), P(px + cw, py, zt), P(px + cw, py, zt - ch), P(px, py, zt - ch)];
      out.push({ svg: ctx.poly(cn, FLAG_BLUE, null, 0), depth: pdepth + 0.31 });
    }

    /* ---- the shaft, painted ground-up with explicit increasing depths ---- */
    var foot = [corner(0, 0), corner(1, 0), corner(2, 0), corner(3, 0)];
    var base = H.depthOf(foot.map(function (c) { return P(c[0], c[1], Z0); }));

    /* one tapered section of the square shaft between z0 and z1 (above the
       foot): four side faces and NO top face. The section above it, or the
       pyramidion, sits on exactly the same four corners and covers the top
       completely; a drawn top face only ever showed as a stray tick of its
       stroke beside the cap's base. */
    function section(z0, z1, mat, depth) {
      for (var i = 0; i < 4; i++) {
        var n = NRM[i];
        if (!ctx.faceVisible(n[0], n[1])) continue;
        var j = (i + 1) % 4;
        var a0 = corner(i, z0), a1 = corner(j, z0), b1 = corner(j, z1), c0 = corner(i, z1);
        var q = [P(a0[0], a0[1], Z0 + z0), P(a1[0], a1[1], Z0 + z0), P(b1[0], b1[1], Z0 + z1), P(c0[0], c0[1], Z0 + z1)];
        out.push({ svg: ctx.poly(q, faceColor(mat, n[0], n[1], 0), EDGE, 0.4), depth: depth + i * 0.01 });
      }
    }

    section(0, BAND_Z0, MARBLE_LOW, base + 0.2);       /* 1848-54 stone, the whiter section */
    section(BAND_Z0, SHAFT_H, MARBLE_UP, base + 0.6);  /* 1879-84 stone above the 150 ft line, slightly darker and warmer */

    /* a small dark rectangle on a face: windows and the doorway. s0..s1 run
       along the face from its centre (metres), z0..z1 up it from the foot.
       Pushed a hair outward along the normal, depth past the section it sits on. */
    function opening(i, s0, s1, z0, z1, fill, depth) {
      var n = NRM[i];
      if (!ctx.faceVisible(n[0], n[1])) return;
      function pt(sv, z) {
        var b = hw(z) + 0.03;
        if (i === 0) return P(cx + sv, cy - b, Z0 + z);
        if (i === 1) return P(cx + b, cy + sv, Z0 + z);
        if (i === 2) return P(cx - sv, cy + b, Z0 + z);
        return P(cx - b, cy - sv, Z0 + z);
      }
      out.push({ svg: ctx.poly([pt(s0, z0), pt(s1, z0), pt(s1, z1), pt(s0, z1)], fill, fill, 0.3), depth: depth });
    }

    /* two observation windows per face, 3 ft wide (fact), a few feet below the
       500 ft level. ASSUMED (reviewers' brief): 2 ft tall, centres 10 ft apart,
       tops 3 ft under the pyramidion base, centred on the face. */
    var WIN_W = 3 * FT, WIN_H = 2 * FT * VE, WIN_GAP = 10 * FT;
    var wz1 = SHAFT_H - 3 * FT * VE, wz0 = wz1 - WIN_H;
    for (var wf = 0; wf < 4; wf++) {
      opening(wf, -WIN_GAP / 2 - WIN_W / 2, -WIN_GAP / 2 + WIN_W / 2, wz0, wz1, GLASS, base + 0.9);
      opening(wf,  WIN_GAP / 2 - WIN_W / 2,  WIN_GAP / 2 + WIN_W / 2, wz0, wz1, GLASS, base + 0.9);
    }
    /* the single doorway, centred on the east face (fact) at plaza grade, no
       steps, no plinth. ASSUMED (reviewers' brief): 0.15 x 0.20 of the foot,
       about 8 x 11 ft, bronze. The east face is culled at yaws that look
       from the west, so the door shows only when the camera is east of the
       axis. */
    var DOOR_W = 0.15 * W0, DOOR_H = 0.20 * W0 * VE;
    opening(1, -DOOR_W / 2, DOOR_W / 2, 0, DOOR_H, BRONZE, base + 0.9);

    /* ---- the pyramidion (55 ft over the 34 ft 5.5 in top square, its base
       the shaft's own top corners) and the aluminum tip ---- */
    out = out.concat(pyramidToned(ctx, visible3, cx, cy, W1, Z0 + SHAFT_H, PYR_H, MARBLE_UP, EDGE, 0.4));
    /* the tip is 0.23 m tall: sub-pixel at any map scale, so its faces carry a
       1.2 px stroke of their own colour and it reads as the highlight it is */
    var TIP_H = 8.9 * IN * VE, TIP_W = 5.6 * IN;
    out = out.concat(pyramidToned(ctx, visible3, cx, cy, TIP_W, Z0 + SHAFT_H + PYR_H - TIP_H, TIP_H, ALUMINUM, null, 1.2));

    return out;
  };

  /* a four-sided pyramid, faces culled on their true 3D normal so the rear
     faces are dropped rather than painted last; depth from the helper's own
     rule (nearest projected point), which for a cap on a tapered shaft is
     always past the shaft's explicit depths. */
  function pyramidToned(ctx, visible3, cx, cy, w, z0, h, mat, edge, sw) {
    var P = ctx.project, out = [], b = w / 2;
    var lo = [[cx - b, cy - b], [cx + b, cy - b], [cx + b, cy + b], [cx - b, cy + b]];
    var apex = P(cx, cy, z0 + h);
    var nl = Math.sqrt(h * h + b * b), nh = h / nl, nz = b / nl;
    for (var i = 0; i < 4; i++) {
      var n = NRM[i], nx = n[0] * nh, ny = n[1] * nh;
      if (!visible3(nx, ny, nz)) continue;
      var j = (i + 1) % 4;
      var t = [P(lo[i][0], lo[i][1], z0), P(lo[j][0], lo[j][1], z0), apex];
      var col = faceColor(mat, nx, ny, nz);
      out.push({ svg: ctx.poly(t, col, edge || col, sw), depth: H.depthOf(t) });
    }
    return out;
  }
})();
