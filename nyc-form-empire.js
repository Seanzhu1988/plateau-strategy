/* nyc-form-empire.js: the Empire State Building, drawn to the model standard.
 *
 * Style: ART DECO (STYLES.md). Unbroken vertical limestone piers with the
 * window strips recessed between them as darker glass and dull-aluminium
 * spandrels, a mass that steps back as it rises, a crown that is ornament
 * rather than roof, silver metal against blonde stone. No horizontal banding
 * on the stone tower; the only rings are on the mast, which really is ringed
 * by tubular metal bands (LPC LP-2000 p.17).
 *
 * Coordinates are FEET, origin at the centre of the base, z up from the
 * sidewalk, x along 33rd/34th Streets (the 424 ft direction), y along Fifth
 * Avenue (the 187 ft direction). Fifth Avenue is the -x end, so the entrance
 * front is the sunlit short face the page's fixed camera looks at. The model
 * scale, the opening mechanism and the scene box are the ones nyc-3d.js
 * already had and are not changed: S = 0.30 times the opening shrink, the two
 * cuts at 1,050 and 1,224 ft, 150 ft of lift per tier times openT, a floor
 * under any piece in the air, the two decks fading in, box 720 x 620.
 *
 * FACTS (every number below is quoted in the research brief with its URL):
 *   lot / base footprint      424 ft east-west by 187 ft north-south (Wikipedia)
 *   lot area                  79,288 sq ft (esbnyc facts & figures)
 *   setback above 5th floor   60 ft deep (Wikipedia; applied east-west, see DERIVED)
 *   storefront glass wall     projects 3 ft beyond the base (LPC LP-2000 p.15)
 *   86th floor observatory    1,050 ft (esbnyc)
 *   102nd floor               1,224 ft (Skyscraper Center)
 *   roof                      1,250 ft (NPS NHL nomination; CTBUH 381 m)
 *   tip                       1,454 ft (esbnyc; CTBUH 443.2 m); pinnacle 203 ft (Wikipedia)
 *   broadcast tower           200 ft, completed 1953 on top of the mooring mast
 *                             (LPC LP-2000 p.17; Wikipedia); the pinnacle is "much of
 *                             which is covered by broadcast antennas, and surmounted
 *                             with a lightning rod" (Wikipedia)
 *   102nd floor windows       24 windows, 8 ft tall (esbnyc press release); DRAWN as 24
 *                             lights between 24 mullions on a 24-sided room
 *   storeys                   102; 5 in the base; setbacks at 5, 21, 25, 30, 72, 81, 85 (LPC)
 *   bay counts                long (33rd/34th St) fronts 15 bays to the 21st, 11 to the 30th,
 *                             9 above in three sections of three; short (Fifth Ave and rear)
 *                             fronts 9 bays to the 25th, 7 to the 72nd, 6 to the 81st, 5 to
 *                             the mast (LPC LP-2000 p.16)
 *   base bays                 Fifth Ave: 3 monumental bays either side of the entrance bay,
 *                             a half-bay strip between them and the entrance, a half-bay at
 *                             each corner; 33rd/34th: 6, 7, 6 bays separated by 2 entrance
 *                             bays; entrance: central doors flanked by revolving doors, a
 *                             three-storey three-bay window screen, two giant piers topped by
 *                             stone eagles (LPC LP-2000 p.15)
 *   base composition          ground-floor black granite and glass storefronts with an
 *                             aluminium band cornice; giant order of stone piers with
 *                             three-storey window strips on floors 2-4; 5th-floor attic of
 *                             small paired windows and stone panels under a stone sill (LPC)
 *   mast                      four progressively smaller rectangular metal-banded levels, a
 *                             cylindrical shaft with glass on four sides and a set of three
 *                             overlapping wings at each of its four corners rising to half
 *                             its height, then an enclosed cylindrical observation level of
 *                             the same circumference, a smaller cylinder with an open
 *                             platform, a truncated cone pierced by eight round openings,
 *                             a mooring pole, all ringed by tubular metal bands (LPC p.17)
 *   plates                    the three central strips on each long front end at the 85th
 *                             floor in larger metal plates (LPC p.17)
 *   86th floor fence          the open deck is enclosed by a tall curved-top wire safety
 *                             fence added in 1947 (Wikipedia); its height is not published
 *   materials                 Indiana limestone, "blonde" (Wikipedia); nickel-chrome-steel
 *                             window surrounds and mullions; dull aluminium spandrels (LPC);
 *                             mast aluminium, chrome-nickel steel and glass, panels coated
 *                             silver in 2019-20 (Wikipedia); black granite storefronts with
 *                             aluminium bands; stainless-steel street canopies (LPC)
 *
 * DERIVED (each from the facts above; the arithmetic is the whole claim):
 *   storey height             1,050 / 85 = 12.353 ft, so the 85th floor's roof, which is
 *                             the 86th-floor terrace, lands exactly on the published 1,050
 *                             ft and the cut in the opening animation falls on it. Floor n's
 *                             ceiling is n x 12.353: 5th 61.8, 21st 259.4, 25th 308.8, 30th
 *                             370.6, 72nd 889.4, 81st 1,000.6, 85th 1,050.0, 86th 1,062.4
 *   plan above the 5th, E-W   424 - 2 x 60 = 304 ft = 15 bays, so a long-front bay is 20.27 ft
 *   long fronts               11 bays = 222.9 ft (21st-30th), 9 bays = 182.4 ft (30th up)
 *   plan at the 30th, N-S     zoning: one quarter of the lot = 19,822 sq ft at the 30th;
 *                             19,822 / 182.4 = 108.7 ft deep = 7 bays, so a short-front bay
 *                             is 15.52 ft; 9 bays = 139.7 ft (6th-25th), 6 bays = 93.1 ft
 *                             (72nd-81st), 5 bays = 77.6 ft (81st-85th)
 *   why not 60 ft on N-S      a literal 60 ft setback on the 33rd and 34th Street sides gives
 *                             187 - 120 = 67 ft of depth, which contradicts the 28 ft
 *                             window-to-corridor office depth on both sides and the
 *                             quarter-lot zoning area; both of those are published, so the
 *                             N-S depth is taken from them and the conflict is named as a gap
 *   crown height              1,250 - 1,050 = 200 ft from the terrace to the roof (Wikipedia's
 *                             158 ft steel shaft and 200 ft planned crown disagree; the
 *                             drawn crown runs 1,062.4 to 1,250 = 187.6 ft above the 86th
 *                             storey)
 *   antenna                   1,250 to the published 1,454 ft tip (203 ft pinnacle rounds to
 *                             1,453; the 1953 tower is 200 ft, the lightning rod the rest)
 *   shadow                    every point at height z casts to (x + 0.821 z, y + 0.746 z),
 *                             the horizontal of -H.SUN divided by its vertical, clipped to
 *                             the ground plate. The sun is a WORLD vector (nyc-3d.js shades
 *                             every face by its world normal), so the shadow is a world
 *                             object too: it falls toward +x, +y whatever the camera does,
 *                             which is to the right at the page's yaw, toward the eye at
 *                             yaw 0.9, and behind the building at yaw -2.2, where the
 *                             building's own bulk hides most of it. That is what a fixed
 *                             sun does and it is the only shadow consistent with the shading
 *
 * ASSUMED (no source gives these; each is marked where used and listed in
 * the report's known gaps):
 *   base height               5 uniform storeys = 61.8 ft (the real base storeys are not published)
 *   storefront storey         12.35 ft, one storey; black granite bottom band 2.5 ft,
 *                             aluminium band cornice 1.5 ft
 *   window strip width        half the bay on the tower, half on the base's giant order
 *   centre-section recess     6 ft on the long fronts above the 30th (LPC says only
 *                             "shallow"; 4 ft was under two pixels and read as a seam) and
 *                             the centre steps with the wings at 72 and 81 (a centre held
 *                             at one depth would have to be 31 ft narrower than the wings);
 *                             the two return faces and the recessed wall are drawn a tone
 *                             darker so the three-part composition survives at 900 px
 *   parapets                  4 ft tall, 1 ft proud, 2 ft thick at every setback roof;
 *                             base sill 2.5 ft tall, 1.5 ft proud
 *   86th storey plan          the 85th roof inset 12 ft all round: 158.4 x 53.6 ft
 *   86th floor fence          10 ft tall wire mesh on the parapet line, drawn translucent
 *   mast tiers                100 x 44 to 1,090; 82 x 40 to 1,112; 66 x 37 to 1,130;
 *                             52 x 35 to 1,144; each with a 1.5 ft metal band at its top
 *   cylinder                  33 ft across (a ~30 ft figure appears only in secondary pages),
 *                             1,144 to 1,224, with tubular bands at 1,164, 1,184 and 1,204
 *                             (20 ft spacing; the LPC says "ringed", not how often); wings
 *                             40 ft = half the shaft, three per corner, each a blade whose
 *                             outer edge flares in a concave curve; the 102nd room 1,224 to
 *                             1,234 (8 ft windows plus slab) with 24 mullions 1.2 ft wide;
 *                             smaller cylinder 22 ft across to 1,243; cone 22 to 13 ft
 *                             across to 1,250
 *   antenna                   an 8-sided steel tower 12 ft across at 1,250 tapering to 4 ft
 *                             at 1,380, a step ring 10 ft across at 1,320 where the mast
 *                             changes section, then a 2 ft rod (the lightning rod) to the
 *                             tip; no source reached gives any of these widths
 *   Fifth Avenue portal       one recessed opening 36 ft wide from the sidewalk to the sill,
 *                             its back wall 3 ft behind the wall plane, a 2 ft bright metal
 *                             surround, two giant piers 9.5 ft wide standing 6 ft proud
 *                             and rising to 72 ft, eagles as 8 ft blocks on them; the other
 *                             Fifth bays share (187 - 59) / 8 = 16 ft
 *   street entrance bays      1.5 bays = 28.9 ft wide (long-front base bay 424 / 22 = 19.27 ft),
 *                             1.5 ft proud, a stainless canopy 3 ft deep at 11 ft
 *   rear (west) front         11 bays of 17 ft on the base, no entrance
 *   attic windows             0.4 of a bay wide, 5 ft tall, one pair per bay
 *   eight cone openings       not drawn: a 2 ft hole is a fifth of a pixel at this scale
 *   EMPIRE STATE letters      not drawn: sub-pixel at this scale
 *
 * Tones: limestone base #e6dfcd, warmer on the sunward faces, lighter on
 * tops; window strips #7a838a (glass plus dull aluminium, matte); black
 * granite #3b3a3a; mast aluminium #c6cbcf with brighter #dadee1 bands; mast
 * glass #6d7780, kept well under the aluminium so the four glass sides of
 * the shaft and the 102nd room read as glass. The renderer's own shader then
 * does lit against shade from H.SUN, so every material carries two tones
 * before it carries a third.
 *
 * Painter's order: ground bias -1e6, shadows -1e6 + 1, the pavement tiles
 * under the footprint +2, walls are drawn ONE BAY AT A TIME so no face is
 * longer than a bay and its centroid cannot lie, parapets and sills bias +6
 * so they paint over the tall wall standing on them, the terrace floor is
 * the 85th roof's own tiles repainted in the promenade tone at bias +1, the
 * 102nd deck 0.3 and its rail 0.4 exactly as the scene had them.
 *
 * THE PAVEMENT, which is why the base no longer reads as a hollow tray from
 * the street: the page's pitch floor puts the eye a little under the ground
 * plane, and from there every box in this renderer shows its far walls' feet
 * below its near walls, because nothing is drawn underneath. One face under
 * the footprint cannot be sorted (painted early it loses to the far walls,
 * painted late it covers the roof at the tilt ceiling). Forty-foot TILES can:
 * each tile's centroid is next to the wall it borders, so a tile paints after
 * the far wall beside it and before the near wall beside it at every pitch,
 * and from above it is under the roof and never seen.
 */
(function () {
  var H = window.NYC3D.helpers, ST = window.STYLES3D, C = H.C;
  window.NYC_FORMS = window.NYC_FORMS || {};

  var ES = {
    roof: 1250, tip: 1454, baseW: 424, baseD: 187, lot: 79288,
    obs86: 1050, obs102: 1224, setback: 60, storefront: 3
  };
  var ES_LIFT = 150;

  /* ---- derived storey and setback heights ---- */
  var FH = ES.obs86 / 85;                       /* 12.353 ft, see header */
  function fl(n) { return n * FH; }
  var Z5 = fl(5), Z21 = fl(21), Z25 = fl(25), Z30 = fl(30);
  var Z72 = fl(72), Z81 = fl(81), Z85 = fl(85), Z86 = fl(86);

  /* ---- derived plans ---- */
  var W6 = ES.baseW - 2 * ES.setback;           /* 304 */
  var BAY_L = W6 / 15;                          /* 20.27, long-front bay */
  var W21 = 11 * BAY_L, W30 = 9 * BAY_L;        /* 222.9, 182.4 */
  var D25 = (ES.lot / 4) / W30;                 /* 108.7, quarter-lot zoning at the 30th */
  var BAY_S = D25 / 7;                          /* 15.52, short-front bay */
  var D6 = 9 * BAY_S, D72 = 6 * BAY_S, D81 = 5 * BAY_S;   /* 139.7, 93.1, 77.6 */
  var RECESS = 6;                               /* ASSUMED, the "shallow" centre recess */

  /* ---- materials: base colour per face family, the shader does the rest ---- */
  var LIME  = { top: '#eee8d9', sun: '#e6dfcd', shade: '#ddd6c4' };   /* Indiana limestone, blonde */
  var LIME_IN = { top: '#e6e0d0', sun: '#ddd5c2', shade: '#d3cbb8' }; /* the same stone in the recessed centre, a tone down */
  var LIME_RET = { top: '#ddd6c4', sun: '#d6cfbd', shade: '#cfc7b4' }; /* the 6 ft return faces of the recess, always in shade */
  var CAP   = { top: '#f2ecdd', sun: '#ede7d7', shade: '#e4ddcc' };   /* the same stone, a sill or parapet catching more light */
  var STRIP = { top: '#8a9299', sun: '#7a838a', shade: '#6f777e' };   /* glass in nickel-chrome steel, dull aluminium spandrels */
  var GRAN  = { top: '#4a4846', sun: '#3b3a3a', shade: '#302f2f' };   /* black granite storefront base */
  var SHOP  = { top: '#5b6064', sun: '#4f5559', shade: '#464b4f' };   /* storefront glass in aluminium */
  var ALU   = { top: '#dadee1', sun: '#c6cbcf', shade: '#b9bec4' };   /* silver-painted aluminium, the mast */
  var BAND  = { top: '#eef0f2', sun: '#e2e5e8', shade: '#d6dadd' };   /* the bright tubular bands and canopies */
  var MGL   = { top: '#7a848c', sun: '#6d7780', shade: '#616a72' };   /* the mast's glass walls, well under the aluminium */
  var DOOR  = { top: '#6b6357', sun: '#5c554a', shade: '#514b41' };   /* metal entrance doors in shadow */
  var EAGLE = { top: '#f2ecdd', sun: '#e6dfcd', shade: '#ddd6c4' };   /* limestone block, a lit cap on top */
  var SHADOW = '#d8d2c4';

  window.NYC_FORMS.empire = function (opts) {
    var o = opts || {};
    var openT = Math.max(0, Math.min(1, o.openT || 0));
    var f = [], lines = [], marks = [];
    /* the uniform shrink that keeps the tip on one line of the box however
       far the building is open: unchanged from the scene this replaces */
    var S = 0.30 * (ES.tip + 2 * ES_LIFT * (1 - openT)) / (ES.tip + 2 * ES_LIFT);
    function V(p) { return [p[0] * S, p[1] * S, p[2] * S]; }
    function P(x, y, z) { return [x * S, y * S, z * S]; }

    var CUT = [ES.obs86, ES.obs102];
    function lift(z) {
      if (!openT) return 0;
      return (z >= ES.obs102 ? 2 : z >= ES.obs86 ? 1 : 0) * ES_LIFT * openT;
    }
    /* a vertical run z0..z1 cut at whichever deck heights fall inside it,
       each piece carried up by its own tier; the mechanism the scene had */
    function pieces(z0, z1) {
      var edges = [z0];
      if (openT) CUT.forEach(function (c) { if (c > z0 && c < z1) edges.push(c); });
      edges.push(z1);
      edges.sort(function (a, b) { return a - b; });
      var out = [];
      for (var i = 0; i < edges.length - 1; i++) {
        out.push({ a: edges[i], b: edges[i + 1], up: lift(edges[i]),
                   first: i === 0, last: i === edges.length - 2,
                   onCut: openT > 0 && CUT.indexOf(edges[i]) >= 0 });
      }
      return out;
    }

    /* ---- one face, in feet, with its outward normal enforced ---- */
    function emit(pts, n, mat, fo) {
      var nn = H.normal(pts[0], pts[1], pts[2]);
      if (nn[0] * n[0] + nn[1] * n[1] + nn[2] * n[2] < 0) pts = pts.slice().reverse();
      var base = typeof mat === 'string' ? mat
        : (n[2] > 0.5 ? mat.top : (n[2] < -0.5 ? mat.shade
          : ((n[0] < -0.3 || n[1] < -0.3) ? mat.sun : mat.shade)));
      var fc = H.face(pts.map(V), base, fo);
      f.push(fc);
      return fc;
    }
    function wallQ(a, b, z0, z1, n, mat, fo) {
      emit([[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]], n, mat, fo);
    }
    /* a box with every normal outward; five faces, no underside, plus a
       floor when it stands in the air; cut and lifted like everything else */
    function boxF(x0, x1, y0, y1, z0, z1, mat, fo) {
      prism([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, z1, null, mat, fo, [[x0, x1, y0, y1]]);
    }
    function outward(a, b) {
      var dx = b[0] - a[0], dy = b[1] - a[1], m = Math.sqrt(dx * dx + dy * dy) || 1;
      return [dy / m, -dx / m, 0];
    }

    /* ---- the bay rhythm of a Deco wall: pier, strip, pier, strip, pier ---- */
    function bayLayout(L, n, swf) {
      if (!n) return [{ w: L, k: 'pier' }];
      var b = L / n, sw = b * (swf || 0.5), pw = b - sw;
      var segs = [{ w: pw / 2, k: 'pier' }];
      for (var i = 0; i < n; i++) {
        segs.push({ w: sw, k: 'strip' });
        segs.push({ w: i < n - 1 ? pw : pw / 2, k: 'pier' });
      }
      return segs;
    }

    /* THE PAINTER'S TRAP, met here on the first render: the storefront's
       430 ft top face has its centroid nearer the eye than the wall segments
       standing at its far corner, so it painted over their feet as a pale
       triangle. Two cures, both applied: every roof is laid as tiles no
       longer than 40 ft, so a tile's centroid is never far from the wall on
       its edge, and every wall carries a small positive bias so it paints
       after the roof it stands on. The bias is kept small (4 units, about
       13 ft) so a far wall still paints before the roof that hides it. */
    var WALL_BIAS = 4, TILE = 40;
    function tileTop(rects, z, mat, fo) {
      rects.forEach(function (r) {
        var nx = Math.ceil((r[1] - r[0]) / TILE), ny = Math.ceil((r[3] - r[2]) / TILE);
        var dx = (r[1] - r[0]) / nx, dy = (r[3] - r[2]) / ny, ov = 0.3;
        for (var i = 0; i < nx; i++) for (var j = 0; j < ny; j++) {
          var xa = r[0] + i * dx - (i ? ov : 0), xb = r[0] + (i + 1) * dx + (i < nx - 1 ? ov : 0);
          var ya = r[2] + j * dy - (j ? ov : 0), yb = r[2] + (j + 1) * dy + (j < ny - 1 ? ov : 0);
          emit([[xa, ya, z], [xb, ya, z], [xb, yb, z], [xa, yb, z]], [0, 0, 1], mat, fo);
        }
      });
    }
    function rectsOf(w, d) { return [[-w / 2, w / 2, -d / 2, d / 2]]; }
    function hRects(w, d) {
      var w3 = w / 3;
      return [[-w / 2, -w / 2 + w3, -d / 2, d / 2], [-w / 2 + w3, w / 2 - w3, -d / 2 + RECESS, d / 2 - RECESS],
              [w / 2 - w3, w / 2, -d / 2, d / 2]];
    }

    /* A prism on a CCW plan. specs[i] describes edge i: { bays, sw, layout,
       mat, capH, plates }. Walls are drawn one bay segment at a time, which is
       what keeps a 304 ft face honest under the painter's sort. capH is the
       plain band at the top where a parapet or sill will sit. A layout
       segment of kind 'void' draws nothing: that is how the Fifth Avenue
       portal is cut through the wall rather than painted onto it. fo.deck,
       if set, repaints the top tiles in that tone (the 86th-floor terrace)
       at bias +1 and the opening animation's opacity. */
    function prism(plan, z0, z1, specs, mat, fo, rects) {
      var np = plan.length;
      var wfo = { bias: WALL_BIAS + ((fo && fo.bias) || 0) };
      if (fo && fo.opacity) wfo.opacity = fo.opacity;
      if (fo && fo.stroke) { wfo.stroke = fo.stroke; wfo.width = fo.width; }
      pieces(z0, z1).forEach(function (pc) {
        var za = pc.a + pc.up, zb = pc.b + pc.up;
        if (pc.last && !(fo && fo.noTop)) {
          if (rects) tileTop(rects, zb, mat, fo);
          else emit(plan.map(function (p) { return [p[0], p[1], zb]; }), [0, 0, 1], mat, fo);
          if (rects && fo && fo.deck) {
            var dfo = { bias: 1 };
            if (openT < 0.98) dfo.opacity = openT.toFixed(2);
            tileTop(rects, zb, fo.deck, dfo);
          }
        }
        if (pc.onCut) emit(plan.map(function (p) { return [p[0], p[1], za]; }), [0, 0, -1], mat, fo);
        for (var i = 0; i < np; i++) {
          var a = plan[i], b = plan[(i + 1) % np], n = outward(a, b);
          var sp = (specs && specs[i]) || {};
          var L = Math.sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1]));
          var ztop = pc.last && sp.capH ? zb - sp.capH : zb;
          var segs = sp.layout || bayLayout(L, sp.bays || 0, sp.sw);
          var t = 0, ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L;
          segs.forEach(function (sg, si) {
            var p0 = [a[0] + ux * t, a[1] + uy * t], p1 = [a[0] + ux * (t + sg.w), a[1] + uy * (t + sg.w)];
            t += sg.w;
            if (sg.k === 'void') return;
            var m = sg.k === 'strip' ? (sp.strip || STRIP) : sg.k === 'dark' ? (sp.dark || STRIP) : (sp.mat || mat);
            wallQ(p0, p1, za, ztop, n, m, wfo);
            /* the large metal plates that end the three central strips of
               each long front at the 85th floor (LPC p.17) */
            if (sp.plates && sg.k === 'strip' && pc.last && sp.plates.indexOf(si) >= 0) {
              wallQ(p0, p1, ztop - 6, ztop, n, ALU, { bias: WALL_BIAS + 0.5 });
            }
          });
        }
      });
    }

    /* A horizontal ledge ring outside a plan: the storefront cornice's top
       between the glass line and the base wall above it. gaps[i] lists
       [t0, t1] runs along edge i to leave out (the portal). */
    function ledge(plan, z, out, mat, gaps) {
      var np = plan.length, up = lift(z);
      for (var i = 0; i < np; i++) {
        var a = plan[i], b = plan[(i + 1) % np], n = outward(a, b);
        var ux = (b[0] - a[0]), uy = (b[1] - a[1]), L = Math.sqrt(ux * ux + uy * uy); ux /= L; uy /= L;
        var runs = [[-out, L + out]];
        if (gaps && gaps[i]) {
          runs = [];
          var t0 = -out;
          gaps[i].forEach(function (g) { runs.push([t0, g[0]]); t0 = g[1]; });
          runs.push([t0, L + out]);
        }
        runs.forEach(function (r) {
          var a2 = [a[0] + ux * r[0], a[1] + uy * r[0]], b2 = [a[0] + ux * r[1], a[1] + uy * r[1]];
          emit([[a2[0], a2[1], z + up], [b2[0], b2[1], z + up], [b2[0] + n[0] * out, b2[1] + n[1] * out, z + up],
                [a2[0] + n[0] * out, a2[1] + n[1] * out, z + up]], [0, 0, 1], mat, { bias: 2 });
        });
      }
    }

    /* A parapet or sill: its own slab standing 1 ft proud of the wall and 2
       ft thick, along every edge of the plan, capH tall, top at z1. */
    function parapet(plan, z1, capH, mat, proud, thick) {
      var np = plan.length, up = lift(z1 - capH);
      proud = proud == null ? 1 : proud; thick = thick == null ? 2 : thick;
      for (var i = 0; i < np; i++) {
        var a = plan[i], b = plan[(i + 1) % np], n = outward(a, b);
        var ux = (b[0] - a[0]), uy = (b[1] - a[1]), L = Math.sqrt(ux * ux + uy * uy); ux /= L; uy /= L;
        /* extend past both ends so the proud faces meet at the corners */
        var a2 = [a[0] - ux * proud, a[1] - uy * proud], b2 = [b[0] + ux * proud, b[1] + uy * proud];
        var oA = [a2[0] + n[0] * proud, a2[1] + n[1] * proud], oB = [b2[0] + n[0] * proud, b2[1] + n[1] * proud];
        var iA = [a[0] - n[0] * thick, a[1] - n[1] * thick], iB = [b[0] - n[0] * thick, b[1] - n[1] * thick];
        var zb = z1 - capH + up, zt = z1 + up;
        wallQ(oA, oB, zb, zt, n, mat, { bias: 6 });
        emit([[oA[0], oA[1], zt], [oB[0], oB[1], zt], [iB[0], iB[1], zt], [iA[0], iA[1], zt]], [0, 0, 1], mat, { bias: 6 });
        wallQ(iA, iB, zb, zt, [-n[0], -n[1], 0], mat, { bias: 6 });
      }
    }

    function rect(w, d) { return [[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [-w / 2, d / 2]]; }
    /* the long fronts above the 30th: three sections of three bays, the
       centre one recessed, the two wings projecting (LPC p.16) */
    function hPlan(w, d) {
      var w3 = w / 3, R = RECESS;
      return [[-w / 2, -d / 2], [-w / 2 + w3, -d / 2], [-w / 2 + w3, -d / 2 + R], [w / 2 - w3, -d / 2 + R],
              [w / 2 - w3, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [w / 2 - w3, d / 2],
              [w / 2 - w3, d / 2 - R], [-w / 2 + w3, d / 2 - R], [-w / 2 + w3, d / 2], [-w / 2, d / 2]];
    }
    function ngon(r, n, cx, cy) {
      var pts = [];
      for (var i = 0; i < n; i++) {
        var t = Math.PI * 2 * i / n + Math.PI / n;
        pts.push([(cx || 0) + r * Math.cos(t), (cy || 0) + r * Math.sin(t)]);
      }
      return pts;
    }
    /* a tapering n-sided drum between two radii: the cone, the antenna */
    function frustum(r0, r1, n, z0, z1, mat, fo, noTop) {
      var lo = ngon(r0, n), hi = ngon(r1, n), up = lift(z0);
      var L = z1 - z0;
      for (var i = 0; i < n; i++) {
        var a = lo[i], b = lo[(i + 1) % n], c = hi[(i + 1) % n], d = hi[i];
        var nn = outward(a, b);
        var m = Math.sqrt(L * L + (r0 - r1) * (r0 - r1)) || 1;
        emit([[a[0], a[1], z0 + up], [b[0], b[1], z0 + up], [c[0], c[1], z1 + up], [d[0], d[1], z1 + up]],
             [nn[0] * L / m, nn[1] * L / m, (r0 - r1) / m], mat, fo || { bias: WALL_BIAS });
      }
      if (!noTop) emit(hi.map(function (p) { return [p[0], p[1], z1 + up]; }), [0, 0, 1], mat, fo);
    }

    /* ==================== the ground and the shadow ==================== */
    var PLATE = 420;
    var BW = ES.baseW / 2, BD = ES.baseD / 2, SF = ES.storefront;
    f.push(H.face([P(-PLATE, -PLATE, 0), P(PLATE, -PLATE, 0), P(PLATE, PLATE, 0), P(-PLATE, PLATE, 0)],
                  C.ground, { flat: true, bias: -1e6 }));
    var kx = -H.SUN[0] / H.SUN[2], ky = -H.SUN[1] / H.SUN[2];
    function hull(pts) {
      pts = pts.slice().sort(function (p, q) { return p[0] - q[0] || p[1] - q[1]; });
      function cross(o, a, b) { return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); }
      var lo = [], hi = [];
      pts.forEach(function (p) {
        while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop();
        lo.push(p);
      });
      for (var i = pts.length - 1; i >= 0; i--) {
        var p = pts[i];
        while (hi.length >= 2 && cross(hi[hi.length - 2], hi[hi.length - 1], p) <= 0) hi.pop();
        hi.push(p);
      }
      lo.pop(); hi.pop();
      return lo.concat(hi);
    }
    function clipRect(poly, lim) {
      var edges = [[1, 0, lim], [-1, 0, lim], [0, 1, lim], [0, -1, lim]];  /* a x + b y <= lim */
      edges.forEach(function (e) {
        var out = [];
        for (var i = 0; i < poly.length; i++) {
          var p = poly[i], q = poly[(i + 1) % poly.length];
          var fp = e[0] * p[0] + e[1] * p[1] - e[2], fq = e[0] * q[0] + e[1] * q[1] - e[2];
          if (fp <= 0) out.push(p);
          if ((fp < 0 && fq > 0) || (fp > 0 && fq < 0)) {
            var t = fp / (fp - fq);
            out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]);
          }
        }
        poly = out;
      });
      return poly;
    }
    /* the shadow of one mass: the sweep of its plan from its foot to its top,
       each pushed along the horizontal of -SUN by its own height, then clipped
       to the plate. A lifted piece throws its shadow from where it hangs. */
    function shadowOf(plan, z0, z1) {
      var pts = [];
      var zA = z0 + lift(z0), zB = z1 + lift(z0);
      plan.forEach(function (p) {
        pts.push([p[0] + kx * zA, p[1] + ky * zA]);
        pts.push([p[0] + kx * zB, p[1] + ky * zB]);
      });
      var poly = clipRect(hull(pts), PLATE);
      if (poly.length >= 3) {
        f.push(H.face(poly.map(function (p) { return P(p[0], p[1], 0); }), SHADOW,
                      { flat: true, bias: -1e6 + 1 }));
      }
    }

    /* ==================== THE BASE: five storeys filling the lot ==================== */
    /* the Fifth Avenue portal: one recessed opening, ASSUMED widths */
    var OPEN = 36, SURR = 2, PIER_W = 9.5, PIER_P = 6, PIER_H = 72, EAGLE_H = 8, RECESS_P = 3;
    var PORTAL = OPEN + 2 * SURR + 2 * PIER_W;            /* 59 */
    var LINTEL = Z5 - 2.5 - 2;                             /* the opening's head, under a 2 ft head band and the 2.5 ft sill */

    /* the pavement under the footprint, in tiles (see header) */
    tileTop(rectsOf(ES.baseW + 2 * SF, ES.baseD + 2 * SF), 0, C.ground, { flat: true, bias: 2 });

    /* the storefronts: a glass wall in aluminium on a black granite base,
       projecting 3 ft, one storey, with the aluminium band cornice on top;
       cut open at the portal */
    var shopPlan = rect(ES.baseW + 2 * SF, ES.baseD + 2 * SF);
    shadowOf(shopPlan, 0, FH);
    /* No full top on the storefront. Seen from the street (the pitch floor
       is below level) a horizontal face at 12 ft projects 14 units tall
       against a 3.7 unit wall and spilled onto the pavement as a dark slab;
       only the real 3 ft ledge between the glass line and the base wall is
       drawn, as a ring, and the tops of the stacked storefront layers, which
       are hidden inside the next layer, are not drawn at all. */
    var NOTOP = { noTop: true };
    var shopSide = (BD + SF) - OPEN / 2;
    var shopFifth = [{ w: shopSide, k: 'pier' }, { w: OPEN, k: 'void' }, { w: shopSide, k: 'pier' }];
    var shopSpecs = [null, null, null, { layout: shopFifth }];
    prism(shopPlan, 0, 2.5, shopSpecs, GRAN, NOTOP);                 /* black granite base band, ASSUMED 2.5 ft */
    prism(shopPlan, 2.5, FH - 1.5, shopSpecs, SHOP, NOTOP);
    prism(shopPlan, FH - 1.5, FH, shopSpecs, BAND, NOTOP);           /* moulded aluminium band cornice, ASSUMED 1.5 ft */
    ledge(rect(ES.baseW, ES.baseD), FH, SF, BAND, { 3: [[BD - OPEN / 2, BD + OPEN / 2]] });

    /* floors 2-4, the giant order: piers between three-storey strips */
    var bf = (ES.baseD - PORTAL) / 8;                     /* 16.0, a Fifth Avenue bay */
    var bb = ES.baseW / 22, ENT = 1.5 * bb;               /* 19.27, 28.9 */
    function threeBays(b, n, swf) {                       /* n bays, from a half pier to a half pier */
      return bayLayout(b * n, n, swf);
    }
    var portalRun = [{ w: PIER_W, k: 'pier' }, { w: SURR, k: 'pier' }, { w: OPEN, k: 'void' },
                     { w: SURR, k: 'pier' }, { w: PIER_W, k: 'pier' }];
    var fifth = [].concat(
      [{ w: bf / 2, k: 'pier' }],                          /* corner half-bay */
      threeBays(bf, 3, 0.5),
      bayLayout(bf / 2, 1, 0.5),                           /* half-bay strip */
      portalRun,
      bayLayout(bf / 2, 1, 0.5),
      threeBays(bf, 3, 0.5),
      [{ w: bf / 2, k: 'pier' }]);
    /* the attic over the same rhythm: stone panels, and the portal still open */
    var fifthAttic = fifth.map(function (sg) { return sg.k === 'void' ? sg : { w: sg.w, k: 'pier' }; });
    var street = [].concat(threeBays(bb, 6, 0.5), [{ w: ENT, k: 'dark' }], threeBays(bb, 7, 0.5),
                           [{ w: ENT, k: 'dark' }], threeBays(bb, 6, 0.5));
    var rear = bayLayout(ES.baseD, 11, 0.5);              /* ASSUMED, no entrance on the rear */
    var basePlan = rect(ES.baseW, ES.baseD);
    /* plan order: edge 0 is -y (33rd St), 1 is +x (rear), 2 is +y (34th St), 3 is -x (Fifth Ave) */
    shadowOf(basePlan, FH, Z5);
    var baseRects = rectsOf(ES.baseW, ES.baseD);
    prism(basePlan, FH, fl(4), [{ layout: street }, { layout: rear }, { layout: street }, { layout: fifth }], LIME, NOTOP);
    /* the attic, floor 5: stone panels with a small paired window per bay */
    prism(basePlan, fl(4), Z5, [{ capH: 2.5 }, { capH: 2.5 }, { capH: 2.5 }, { capH: 2.5, layout: fifthAttic }], LIME, null, baseRects);
    function atticWindows(edgeA, edgeB, layout) {
      var n = outward(edgeA, edgeB);
      var ux = edgeB[0] - edgeA[0], uy = edgeB[1] - edgeA[1], L = Math.sqrt(ux * ux + uy * uy); ux /= L; uy /= L;
      var t = 0;
      layout.forEach(function (sg) {
        if (sg.k === 'strip' || sg.k === 'dark') {
          var ww = sg.k === 'dark' ? sg.w * 0.55 : sg.w * 0.8;   /* ASSUMED 0.4 bay */
          var c = t + sg.w / 2;
          var p0 = [edgeA[0] + ux * (c - ww / 2) + n[0] * 0.05, edgeA[1] + uy * (c - ww / 2) + n[1] * 0.05];
          var p1 = [edgeA[0] + ux * (c + ww / 2) + n[0] * 0.05, edgeA[1] + uy * (c + ww / 2) + n[1] * 0.05];
          wallQ(p0, p1, fl(4) + 3, fl(4) + 8, n, STRIP, { bias: WALL_BIAS + 0.5 });
        }
        t += sg.w;
      });
    }
    atticWindows(basePlan[0], basePlan[1], street);
    atticWindows(basePlan[1], basePlan[2], rear);
    atticWindows(basePlan[2], basePlan[3], street);
    atticWindows(basePlan[3], basePlan[0], fifth);
    /* the horizontal stone sill that tops the attic (LPC p.15) */
    parapet(basePlan, Z5, 2.5, CAP, 1.5, 2);

    /* THE FIFTH AVENUE PORTAL, one object: the opening is a void cut through
       the storefront, the giant order and the attic, floored by a dark wall
       3 ft back, with its own stone reveals, a bright metal surround 2 ft
       wide, a 2 ft head band under the sill, and the two giant piers with
       their eagles standing 6 ft proud either side. */
    var HO = OPEN / 2;
    /* the recessed back wall, doors below and the window screen above, one dark plane */
    wallQ([-BW + RECESS_P, HO], [-BW + RECESS_P, -HO], 0, LINTEL, [-1, 0, 0], DOOR, { bias: WALL_BIAS });
    /* the reveals: through the 3 ft storefront projection below the cornice,
       through the wall plane above it */
    [[HO, [0, -1, 0]], [-HO, [0, 1, 0]]].forEach(function (rv) {
      var y = rv[0], n = rv[1];
      wallQ([-BW - SF, y], [-BW + RECESS_P, y], 0, FH, n, LIME, { bias: WALL_BIAS + 0.2 });
      wallQ([-BW, y], [-BW + RECESS_P, y], FH, LINTEL, n, LIME, { bias: WALL_BIAS + 0.2 });
    });
    /* the head: the wall over the opening, from the lintel up to the sill */
    wallQ([-BW, HO + SURR], [-BW, -HO - SURR], LINTEL, Z5 - 2.5, [-1, 0, 0], LIME, { bias: WALL_BIAS });
    emit([[-BW, HO, LINTEL], [-BW, -HO, LINTEL], [-BW + RECESS_P, -HO, LINTEL], [-BW + RECESS_P, HO, LINTEL]],
         [0, 0, -1], LIME, { bias: WALL_BIAS + 0.2 });
    /* the bright surround: two jambs and a head band, a hand proud of the wall */
    var SX0 = -BW - SF - 0.5, SX1 = -BW - 0.5;
    [[HO, HO + SURR], [-HO - SURR, -HO]].forEach(function (j) {
      wallQ([SX0, j[1]], [SX0, j[0]], 0, FH, [-1, 0, 0], BAND, { bias: WALL_BIAS + 1.2 });
      wallQ([SX1, j[1]], [SX1, j[0]], FH, LINTEL + SURR, [-1, 0, 0], BAND, { bias: WALL_BIAS + 1.2 });
    });
    wallQ([SX1, HO + SURR], [SX1, -HO - SURR], LINTEL, LINTEL + SURR, [-1, 0, 0], BAND, { bias: WALL_BIAS + 1.2 });
    /* the giant piers and their eagles */
    [-1, 1].forEach(function (s) {
      var yc = s * (HO + SURR + PIER_W / 2);
      boxF(-BW - PIER_P, -BW, yc - PIER_W / 2, yc + PIER_W / 2, 0, PIER_H, LIME, { bias: 1 });
      boxF(-BW - PIER_P + 0.75, -BW + 1, yc - 4, yc + 4, PIER_H, PIER_H + EAGLE_H, EAGLE, { bias: 1.5 });   /* a stone eagle, ASSUMED 8 ft */
    });

    /* the 33rd and 34th Street entrance bays: 1.5 ft proud, a three-strip
       screen, a three-window attic, a streamlined stainless canopy */
    var entX = [-BW + 6 * bb + ENT / 2, BW - 6 * bb - ENT / 2];
    [-1, 1].forEach(function (s) {
      entX.forEach(function (xc) {
        var y0 = s < 0 ? -BD - 1.5 : BD, y1 = s < 0 ? -BD : BD + 1.5;
        var n = [0, s, 0];
        var ya = s < 0 ? -BD - 1.5 : BD + 1.5;
        /* the projecting bay in stone with its dark screen, floors 2-5 */
        boxF(xc - ENT / 2, xc + ENT / 2, y0, y1, FH, Z5 - 2.5, LIME, { bias: 0.8 });
        [-1, 0, 1].forEach(function (k) {
          var sw = ENT * 0.22, cx = xc + k * ENT * 0.3;
          wallQ([cx - sw / 2, ya + s * 0.05], [cx + sw / 2, ya + s * 0.05], FH, fl(4), n, STRIP, { bias: WALL_BIAS + 1.5 });
          wallQ([cx - sw / 2, ya + s * 0.05], [cx + sw / 2, ya + s * 0.05], fl(4) + 3, fl(4) + 8, n, STRIP, { bias: WALL_BIAS + 1.5 });
        });
        /* the canopy: 3 ft beyond the storefront glass, ASSUMED at 11 ft */
        var cy0 = s < 0 ? -BD - SF - 3 : BD + SF, cy1 = s < 0 ? -BD - SF : BD + SF + 3;
        boxF(xc - ENT / 2, xc + ENT / 2, cy0, cy1, 11, 12, BAND, { bias: 1.2 });
      });
    });

    /* ==================== THE TOWER ==================== */
    /* every tier: its plan, its bay counts per edge, its parapet */
    function tier(plan, z0, z1, specs, capH, plates, rects, fo) {
      shadowOf(plan, z0, z1);
      var sp = specs.map(function (s) {
        var q = { capH: capH };
        if (typeof s === 'number') q.bays = s;
        else for (var k in s) if (s.hasOwnProperty(k)) q[k] = s[k];
        return q;
      });
      if (plates) plates.forEach(function (pl) { sp[pl.edge].plates = pl.strips; });
      prism(plan, z0, z1, sp, LIME, fo || null, rects);
      parapet(plan, z1, capH, CAP);
    }
    var CAPH = 4;                                            /* ASSUMED parapet height */
    /* 6th to 21st: 15 bays on the long fronts, 9 on the short */
    tier(rect(W6, D6), Z5, Z21, [15, 9, 15, 9], CAPH, null, rectsOf(W6, D6));
    /* 21st to 25th: the long fronts step to 11 bays */
    tier(rect(W21, D6), Z21, Z25, [11, 9, 11, 9], CAPH, null, rectsOf(W21, D6));
    /* 25th to 30th: the short fronts step to 7 */
    tier(rect(W21, D25), Z25, Z30, [11, 7, 11, 7], CAPH, null, rectsOf(W21, D25));
    /* 30th to 72nd: 9 bays in three sections of three, the centre recessed;
       from here the tower rises at a quarter of the lot. The recess's two
       return faces are drawn in the shade tone and the recessed wall a tone
       down, so the three-part front reads at 900 px. */
    var RET = { bays: 0, mat: LIME_RET }, CEN = { bays: 3, mat: LIME_IN };
    function hSpecs(shortBays) {
      return [3, RET, CEN, RET, 3, shortBays, 3, RET, CEN, RET, 3, shortBays];
    }
    tier(hPlan(W30, D25), Z30, Z72, hSpecs(7), CAPH, null, hRects(W30, D25));
    /* 72nd to 81st: the wings step in, the short fronts to 6 bays */
    tier(hPlan(W30, D72), Z72, Z81, hSpecs(6), CAPH, null, hRects(W30, D72));
    /* 81st to 85th: the executive floors, short fronts 5 bays; the three
       central strips of each long front end in metal plates. Its roof is the
       86th-floor terrace: when the building is open the roof tiles are
       repainted in the promenade tone, one continuous floor inside the
       parapet, instead of a second coplanar face fighting the tiles. */
    tier(hPlan(W30, D81), Z81, Z85, hSpecs(5), CAPH,
         [{ edge: 2, strips: [1, 3, 5] }, { edge: 8, strips: [1, 3, 5] }], hRects(W30, D81),
         openT > 0.02 ? { deck: C.walkTop } : null);

    /* the 86th storey: the enclosed observatory at the foot of the mast,
       standing on the 85th roof, which is the open-air terrace at 1,050 ft */
    var W86 = W30 - 24, D86 = D81 - 24;                     /* ASSUMED 12 ft inset: 158.4 x 53.6 */
    var p86 = rect(W86, D86);
    shadowOf(p86, Z85, Z86);
    prism(p86, Z85, Z86, [{ bays: 7, sw: 0.6 }, { bays: 3, sw: 0.6 }, { bays: 7, sw: 0.6 }, { bays: 3, sw: 0.6 }], LIME, null, rectsOf(W86, D86));

    /* ==================== THE MOORING MAST ==================== */
    /* four progressively smaller rectangular metal-banded levels (LPC p.17);
       plans and heights ASSUMED, see header */
    var tiers = [[100, 44, Z86, 1090], [82, 40, 1090, 1112], [66, 37, 1112, 1130], [52, 35, 1130, 1144]];
    tiers.forEach(function (t) {
      var pl = rect(t[0], t[1]);
      shadowOf(pl, t[2], t[3]);
      prism(pl, t[2], t[3] - 1.5, [{ bays: 5, sw: 0.45, strip: MGL }, { bays: 2, sw: 0.45, strip: MGL },
                                   { bays: 5, sw: 0.45, strip: MGL }, { bays: 2, sw: 0.45, strip: MGL }], ALU, null, rectsOf(t[0], t[1]));
      parapet(pl, t[3], 1.5, BAND, 1, 1.5);                 /* the tubular band at each level */
    });
    /* the cylindrical shaft: glass on four sides, aluminium between,
       1,144 to the 102nd floor at 1,224, ringed by tubular bands */
    var RC = 16.5, NC = 16;
    var cyl = ngon(RC, NC);
    shadowOf(cyl, 1144, ES.obs102);
    var cylSpecs = [];
    for (var ci = 0; ci < NC; ci++) {
      /* faces 0-1, 4-5, 8-9, 12-13 sit on the four axes: the glass sides */
      var onAxis = (ci % 4) < 2;
      cylSpecs.push({ mat: onAxis ? MGL : ALU });
    }
    prism(cyl, 1144, ES.obs102, cylSpecs, ALU);
    [1164, 1184, 1204].forEach(function (zr) {             /* ASSUMED 20 ft spacing */
      parapet(cyl, zr, 1.5, BAND, 0.8, 1);
    });
    /* the winged buttresses: three overlapping wings at each of the four
       corners, rising to half the shaft (LPC p.17); each wing is a blade
       from the corner of the top tier up the shaft, its outer edge flaring
       in a concave curve, in the glass tone with a bright edge so it
       separates from the aluminium behind it */
    var TW = 52 / 2, TD = 35 / 2, WING_H = (ES.obs102 - 1144) / 2;
    [[1, 1], [-1, 1], [-1, -1], [1, -1]].forEach(function (cnr) {
      var base = Math.atan2(cnr[1] * TD, cnr[0] * TW);
      [[0, 1], [-0.22, 0.86], [0.22, 0.72]].forEach(function (wg) {
        var th = base + wg[0], hh = WING_H * wg[1];
        var foot = [cnr[0] * TW * 0.98, cnr[1] * TD * 0.98];
        var hug = [RC * Math.cos(th) * 1.02, RC * Math.sin(th) * 1.02];
        var up = lift(1144);
        var n = [Math.cos(th), Math.sin(th), 0];
        /* the outer edge: radius falls off quickly then flattens, a flare */
        function edgePt(t) {
          var k = (1 - t) * (1 - t);
          return [hug[0] + (foot[0] - hug[0]) * k, hug[1] + (foot[1] - hug[1]) * k, 1144 + hh * t + up];
        }
        var poly = [[foot[0], foot[1], 1144 + up], [hug[0], hug[1], 1144 + up], [hug[0], hug[1], 1144 + hh + up],
                    edgePt(0.7), edgePt(0.4), edgePt(0.18)];
        var wfo = { bias: WALL_BIAS + 0.6, stroke: BAND.top, width: 0.8 };
        emit(poly, n, MGL, wfo);
        /* its other side, so the blade reads from either yaw */
        emit(poly, [-n[0], -n[1], 0], MGL, wfo);
      });
    });
    /* the top in three sections (LPC p.17): the enclosed circular 102nd
       floor of the same circumference, 24 eight-foot windows since 2019,
       drawn as 24 lights between 24 mullions; the smaller cylinder with the
       open platform; the truncated cone */
    var N102 = 24;
    var band1 = ngon(RC + 1, N102);
    prism(band1, ES.obs102, ES.obs102 + 1.5, null, BAND);
    var room = ngon(RC, N102);
    prism(room, ES.obs102 + 1.5, 1234, null, MGL);
    (function mullions() {
      var up = lift(ES.obs102), rr = RC + 0.35, half = 0.6 / rr;   /* 1.2 ft mullions, ASSUMED */
      for (var i = 0; i < N102; i++) {
        var a = Math.PI * 2 * i / N102 + Math.PI / N102;
        var p0 = [rr * Math.cos(a - half), rr * Math.sin(a - half)], p1 = [rr * Math.cos(a + half), rr * Math.sin(a + half)];
        wallQ(p0, p1, ES.obs102 + 1.5 + up, 1234 + up, [Math.cos(a), Math.sin(a), 0], ALU, { bias: WALL_BIAS + 0.5 });
      }
    })();
    prism(band1, 1234, 1235.5, null, BAND);
    var small = ngon(11, N102);
    prism(small, 1235.5, 1243, null, ALU);
    prism(ngon(12, N102), 1243, 1244.5, null, BAND);
    frustum(11, 6.5, N102, 1244.5, ES.roof, ALU);
    /* the antenna: the 1953 broadcast tower as a tapering eight-sided steel
       mast (widths ASSUMED, see header), a step ring where its section
       changes, then the 2 ft rod to the published tip. Faces, not a line,
       so it cannot be mistaken for a label's leader. */
    var tipUp = lift(ES.roof);
    frustum(6, 2, 8, ES.roof, 1380, ALU);
    prism(ngon(5, 8), 1318, 1321, null, BAND);
    prism(ngon(1, 8), 1380, ES.tip, null, ALU, { stroke: ALU.shade, width: 0.7 });

    /* ---- the two decks, drawn only once there is room to see them; the
       mechanism and the promenade colour the scene had ---- */
    function ring(plan, zb, hh, colour, edge, opacity) {
      var np = plan.length;
      for (var i = 0; i < np; i++) {
        var a = plan[i], b = plan[(i + 1) % np], n = outward(a, b);
        var t = 2.5;
        var iA = [a[0] - n[0] * t, a[1] - n[1] * t], iB = [b[0] - n[0] * t, b[1] - n[1] * t];
        var fo = { bias: WALL_BIAS + 0.4 };
        if (edge) { fo.stroke = edge; fo.width = 0.5; }
        var op = opacity == null ? 1 : opacity;
        if (openT < 0.98) op *= openT;
        if (op < 0.995) fo.opacity = op.toFixed(2);
        wallQ(a, b, zb, zb + hh, n, colour, fo);
        emit([[a[0], a[1], zb + hh], [b[0], b[1], zb + hh], [iB[0], iB[1], zb + hh], [iA[0], iA[1], zb + hh]], [0, 0, 1], colour, fo);
        wallQ(iA, iB, zb, zb + hh, [-n[0], -n[1], 0], colour, fo);
      }
    }
    function deck(plan, at, hh, floor, wall, edge) {
      var fl = H.face(plan.map(function (p) { return P(p[0], p[1], at); }), floor);
      fl.bias = 0.3;
      if (openT < 0.98) fl.opacity = openT.toFixed(2);
      f.push(fl);
      if (hh > 0) ring(plan, at, hh, wall, edge);
    }
    if (openT > 0.02) {
      /* the open-air terrace is the 85th roof itself, repainted above (see
         the tier call); what stands on it here is the 1947 safety fence, a
         translucent screen with a bright edge on the parapet line */
      ring(hPlan(W30 - 2, D81 - 2), ES.obs86, 10, MGL, C.glassEdge, 0.5);
      /* the 102nd floor, riding up with the shaft it stands on: the floor of
         the room, with a glass rail where the room's wall will come back down */
      deck(ngon(RC, NC), ES.obs102 + lift(ES.obs86), 4, C.walkTop, MGL, C.glassEdge);
    }

    /* THE MARKS. Dots stay on true points; the text beside each is placed
       by the label engine in nyc-3d.js, which is not this file's to edit.
       That engine lifts any label whose columns cross the drawing to the
       nearer edge of the ink and draws a leader, so WHERE a dot sits and in
       what ORDER the marks are handed over decide whether a label lands
       clear, lifts a short way, or is haloed on the drawing. These four
       positions and this order were not guessed: every candidate corner,
       edge and pier was rendered at thirteen views (the page's two cameras,
       yaws 0.9, -2.2, -1.5 and 0.2, the pitch floor and the tilt ceiling,
       open and closed) and scored on text over text, text over structure,
       leaders through structure and leader length; this set is the minimum.
       The tip mark sits 20 ft off the antenna's axis so the rod is not read
       as its leader. The 102nd dot is on the room's own axis, so at every
       yaw its label starts beside the shaft, never across it. The 86th dot
       is the terrace corner nearest the page's eye. The Fifth Avenue dot
       is on the Fifth Avenue storefront 75 ft from the portal's axis, near
       the 34th Street corner: on the portal pier itself the label's leader
       ran through the base at both of the page's cameras and at four other
       views, and from here it clears with a short leader at every view but
       the ones where the Fifth Avenue front is on the far side of the
       building (yaw 0.9), where the engine's own halo fallback applies. */
    var FIFTH_Y = 75;
    if (o.marks !== false) {
      marks.push({ at: P(-20, 0, ES.tip + 24 + tipUp), text: '1,454 ft to the tip' });
      marks.push({ at: P(0, 0, ES.obs102 + lift(ES.obs86)), fill: C.hi,
                   text: '102nd floor',
                   sub: 'enclosed, 1,224 ft, the small one' });
      marks.push({ at: P(-BW - SF, FIFTH_Y, 8), text: 'Fifth Avenue',
                   sub: 'the entrance and the line' });
      marks.push({ at: P(W30 / 2 - 5, D81 / 2 - 3, ES.obs86), fill: C.navy, text: '86th floor',
                   sub: 'open air, 1,050 ft, the one people mean' });
    }
    return { w: 720, h: 620, faces: f, lines: lines, marks: marks };
  };
})();
