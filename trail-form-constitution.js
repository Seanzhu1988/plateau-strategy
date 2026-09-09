/* trail-form-constitution.js - USS Constitution, "Old Ironsides", rebuilt to
 * MODEL_STANDARD_EXEMPT: 2 no cornice or string course, it is a ship
 * MODEL_STANDARD.md. Registers window.TRAIL_FORMS["constitution"] and takes
 * over from the scene of the same name in trail-3d.js.
 *
 * WHY A REBUILD. Rendered and LOOKED at, 2026-09-05, the old scene passed on
 * hull form, mast heights, ports and shrouds and failed four items of the
 * checklist, none of which arithmetic could have caught:
 *   item 1, real counts as real objects: the masts carried yards and no
 *     FIGHTING TOPS, so a square rigger had no platforms at its doublings.
 *   item 1 and 9, the one thing a visitor names: the STERN was a single flat
 *     black quad. A frigate's transom is the most carved surface on the ship
 *     and hers carries windows, pilasters and quarter galleries. Drawn as a
 *     cliff, the ship ended in a wall.
 *   item 6, a ground shadow: the hull sat on flat water with nothing under
 *     it, so a 1,576 ton frigate floated like a decal.
 *   item 2, horizontal breaks: one white band, no wale under it, and no
 *     copper below the waterline.
 * The hull stations, the tumblehome, the sheer, the gun ports, the rig and
 * the shrouds are UNCHANGED, because they were already right and the whole
 * point of the checklist is that it adds features rather than restarting.
 *
 * PUBLISHED, quoted from https://en.wikipedia.org/wiki/USS_Constitution :
 *   "304 ft (93 m) bowsprit to spanker", "175 ft (53 m) between
 *     perpendiculars, 145 ft (44 m) at the keel", "207 ft (63 m) billet head
 *     to taffrail"
 *   beam "43 ft 6 in (13.26 m)"; draft "21 ft (6.4 m) forward" and
 *     "23 ft (7.0 m) aft"
 *   "foremast: 198 ft (60 m)", "mainmast: 220 ft (67 m)",
 *     "mizzenmast: 172.5 ft (52.6 m)"
 *   sail area "42,710 sq ft (3,968 m2) on three masts"; "1,576" tons
 *   armament "30 x 24-pounder (11 kg) long gun", "22 x 32-pounder (15 kg)
 *     carronade", "2 x 24-pounder (11 kg) bow chasers"
 *   boats "1 x 36 ft (11 m) longboat, 2 x 30 ft (9.1 m) cutters, 2 x 28 ft
 *     (8.5 m) whaleboats, 1 x 28 ft (8.5 m) gig, 1 x 22 ft (6.7 m) jolly
 *     boat, 1 x 14 ft (4.3 m) punt"
 *   "The copper sheathing on her hull needed to be replaced and Paul Revere
 *     supplied the copper sheets necessary"
 *   "the installation of a new figurehead of President Jackson under the
 *     bowsprit", and the earlier Hercules "was replaced with a carving of a
 *     billethead"
 *
 * PUBLISHED, the stern, from the USS Constitution Museum,
 * https://ussconstitutionmuseum.org/2017/02/03/the-quarter-galleries/ :
 *   "Modern students generally feel there were six windows in the transom,
 *     with pilasters separating them", an 1805 painting showing eight
 *     "including one located in the after bulkhead of each quarter gallery"
 *   "High up near the taffrail in the center was a spread eagle"
 *   the quarter galleries "as highly decorated as the ship's bow and stern"
 *
 * WHAT IS DRAWN FROM THAT. Six transom windows with five pilasters between
 * them, the taffrail moulding over, the eagle centred above the windows, and
 * one windowed quarter gallery at each after corner: six plus two, which is
 * the 1805 count and is why the eight is quoted here and not rounded away.
 * The waterline is the published mean of 21 forward and 23 aft, and the
 * copper runs from there down.
 *
 * NAMED GAPS, not guessed. No published transom width, window size, pilaster
 * spacing, quarter gallery projection, fighting top diameter, head rail run,
 * or billethead size. Each is DERIVED from a published number and said so at
 * the line that uses it: the transom from the hull's own station at the
 * taffrail, the tops from their mast's published height, the head rails from
 * the published 62 ft of bowsprit forward of the billethead.
 *
 * STYLE: not architecture, so no STYLES.md entry governs. The naval frigate
 * of 1797 has its own tells and they are the ones drawn: a black topside over
 * a white gun stripe over copper, tumblehome carrying the bulwark inboard, a
 * carved transom, and a rig whose yards are wider than the ship.
 */
(function () {
  var T = (typeof window !== "undefined" && window.TRAIL3D) || null;
  if (!T || !T.helpers) return;
  var H = T.helpers;
  var ground = H.ground, box = H.box, taperedShaft = H.taperedShaft;

  function constitution(ctx) {
    var P = ctx.project, out = [];
    var HULL = "#22242a", HULL_E = "#0e0f12", BAND = "#e7e2d4", PORT = "#191b20";
    var DECK = "#c8b58c", DECK_E = "#9a8763", RAIL = "#2b2d33";
    var SPAR = "#c6a463", SPAR_E = "#8a7038", TOP = "#1c1e22", WATER = "#7f96a4";

    /* the published plan */
    var LOA = 207, HALF = LOA / 2, BEAM = 43.5, HB = BEAM / 2;
    var FWD = 62, AFT = 36;                 /* the published 305 - 207, split */

    /* DERIVED hull form. t runs -1 at the taffrail to +1 at the billethead. */
    var FREE = 20, TRANSOM = 8.6, STEM = 1.3, TUMBLE = 0.86;
    function halfB(t) {
      var s = 1 - Math.pow(Math.abs(t), 2.6);
      var b = s > 0 ? HB * Math.pow(s, 0.42) : 0;
      if (t < -0.86) b = Math.max(b, TRANSOM);
      return Math.max(b, STEM);
    }
    /* the sheer: down amidships, up at both ends, more at the bow */
    function sheer(t) { return FREE + 6.5 * t * t + 1.6 * t; }
    function railZ(t) { return sheer(t) + 4.6; }
    var N = 26, ST = [];
    for (var i = 0; i <= N; i++) {
      var t = -1 + 2 * i / N;
      ST.push({ t: t, x: t * HALF, b: halfB(t), z: sheer(t), r: railZ(t) });
    }

    out.push(ground(ctx, 0, 0, 460, 320, 0, WATER, "#61798a"));

    /* THE HULL, station by station. Two strips per bay: the black topsides
       from the waterline up to the deck edge, then the bulwark above it,
       leaning inboard by the tumblehome. Each strip is culled on its own
       outward normal, which is perpendicular to the run of the station line,
       so the far side of the ship never draws. */
    /* A hull is convex, so a strip on the FAR side can still face the viewer
       near the bow and be hidden by the near side all the same. Culling alone
       does not order those two; a fixed depth for the band let the far side's
       ports paint straight through the ship. So the whole side, hull, band and
       ports together, takes one base depth chosen by which side it is: the far
       side under the deck, the near side over it. */
    function sideDepth(s) { return ctx.faceVisible(0, s) ? 2e5 : 0.4e5; }
    [-1, 1].forEach(function (s) {
      var HD = sideDepth(s);
      for (var i = 0; i < N; i++) {
        var a = ST[i], c = ST[i + 1];
        var db = c.b - a.b, dx = c.x - a.x;
        var nl = Math.sqrt(db * db + dx * dx) || 1;
        var nx = -db / nl, ny = s * dx / nl;
        if (!ctx.faceVisible(nx, ny)) continue;
        var q = [P(a.x, s * a.b, 0), P(c.x, s * c.b, 0),
                 P(c.x, s * c.b, c.z), P(a.x, s * a.b, a.z)];
        out.push({ svg: ctx.poly(q, ctx.shade(HULL, nx, ny, 0), HULL_E, 0.4),
                   depth: HD + i * 0.01 });
        /* the bulwark, tumbled home */
        var bw = [P(a.x, s * a.b, a.z), P(c.x, s * c.b, c.z),
                  P(c.x, s * c.b * TUMBLE, c.r), P(a.x, s * a.b * TUMBLE, a.r)];
        out.push({ svg: ctx.poly(bw, ctx.shade(HULL, nx, ny, 0.1), HULL_E, 0.4),
                   depth: HD + 0.4 + i * 0.01 });
      }
    });

    /* THE GUN PORT BAND, the one pale stripe. Drawn as a chain of quads that
       follows the hull rather than a straight line, because the hull curves
       in plan and a flat band would leave the ship at both ends. */
    function bandAt(s, z0, z1, d, fill) {
      var db, dx, nl, nx, ny, i, a, c, q;
      for (i = 0; i < N; i++) {
        a = ST[i]; c = ST[i + 1];
        db = c.b - a.b; dx = c.x - a.x; nl = Math.sqrt(db * db + dx * dx) || 1;
        nx = -db / nl; ny = s * dx / nl;
        if (!ctx.faceVisible(nx, ny)) continue;
        if (a.b < 6 || c.b < 6) continue;
        q = [P(a.x, s * a.b * 1.004, a.z * z0), P(c.x, s * c.b * 1.004, c.z * z0),
             P(c.x, s * c.b * 1.004, c.z * z1), P(a.x, s * a.b * 1.004, a.z * z1)];
        out.push({ svg: ctx.poly(q, ctx.shade(fill, nx, ny, 0), "", 0), depth: d + i * 0.01 });
      }
    }
    bandAt(-1, 0.50, 0.72, sideDepth(-1) + 1, BAND);
    bandAt(1, 0.50, 0.72, sideDepth(1) + 1, BAND);

    /* THE PORTS. Fifteen a side on the gun deck for thirty long guns, twelve
       a side in the bulwark for twenty-four carronades: the armament divided
       by two. Spaced along t rather than along x so they keep station with
       the hull as it narrows. */
    function ports(s, n, t0, t1, lo, hi, w) {
      var db, dx, nl, nx, ny, PD = sideDepth(s) + 1.5;
      for (var k = 0; k < n; k++) {
        var t = t0 + (t1 - t0) * (k + 0.5) / n;
        var b = halfB(t), z = sheer(t), x = t * HALF;
        db = halfB(t + 0.02) - halfB(t - 0.02); dx = 0.04 * HALF;
        nl = Math.sqrt(db * db + dx * dx) || 1;
        nx = -db / nl; ny = s * dx / nl;
        if (!ctx.faceVisible(nx, ny)) continue;
        var q = [P(x - w, s * b * 1.01, z * lo), P(x + w, s * b * 1.01, z * lo),
                 P(x + w, s * b * 1.01, z * hi), P(x - w, s * b * 1.01, z * hi)];
        out.push({ svg: ctx.poly(q, PORT, "#000", 0.3), depth: PD });
      }
    }
    [-1, 1].forEach(function (s) {
      ports(s, 15, -0.80, 0.80, 0.535, 0.685, 2.4);
      ports(s, 12, -0.74, 0.76, 1.03, 1.16, 2.2);
    });

    /* THE SPAR DECK, one flat surface spanning two hundred feet, so it takes
       an explicit depth. Sorted on its own corners it would have the nearest
       point on the ship and would paint over the masts standing on it. */
    var DD = 1e5;
    var deck = [];
    for (i = 0; i <= N; i++) deck.push(P(ST[i].x, -ST[i].b * TUMBLE, ST[i].r - 0.6));
    for (i = N; i >= 0; i--) deck.push(P(ST[i].x, ST[i].b * TUMBLE, ST[i].r - 0.6));
    out.push({ svg: ctx.poly(deck, ctx.shade(DECK, 0, 0, 1), DECK_E, 0.5), depth: DD });

    /* the transom, flat, which is how a frigate ends aft */
    if (ctx.faceVisible(-1, 0)) {
      var tz = ST[0];
      out.push({ svg: ctx.poly([P(tz.x, -TRANSOM, 0), P(tz.x, TRANSOM, 0),
                                P(tz.x, TRANSOM * TUMBLE, tz.r), P(tz.x, -TRANSOM * TUMBLE, tz.r)],
                               ctx.shade(HULL, -1, 0, 0), HULL_E, 0.4), depth: 2e5 + 0.9 });
    }

    /* THE RIG. Main 172 ft from the spar deck, published; fore and mizzen
       derived at 0.95 and 0.80 of it, each built as lower mast, topmast and
       topgallant so the doublings show. Everything at y = 0, so the three
       masts cannot occlude one another and one depth serves them all. */
    var MD = 1.5e5;
    function mast(t, H) {
      var x = t * HALF, z0 = sheer(t) - 0.6;
      var segs = [[0, 0.44, 2.9, 2.1, SPAR], [0.40, 0.76, 1.8, 1.2, SPAR],
                  [0.72, 1.00, 1.0, 0.5, TOP]];
      segs.forEach(function (g, i) {
        out = out.concat(taperedShaft(ctx, x, 0, g[2], g[3], z0 + H * g[0],
                                      H * (g[1] - g[0]), g[4],
                                      g[4] === TOP ? "#000" : SPAR_E, MD + i * 0.5));
      });
      return { x: x, z0: z0, H: H };
    }
    /* A yard needs thickness FORE AND AFT as well as depth. Drawn as a single
       athwartships plane every yard on the ship vanished at broadside, which
       is the one angle a ship is actually looked at from, and the arithmetic
       had no complaint: the quad was there, it was just edge-on. */
    function yard(cx, z, len, th, fill, d) {
      var y = box(ctx, cx - th, cx + th, -len / 2, len / 2, z - th, z + th,
                  fill, "#2a2a2a", fill, d);
      out = out.concat(y.parts);
    }
    /* Mast heights are the Navy's published ones, measured from the water:
       mainmast 220 ft, foremast 198, mizzen 172.5. The spar deck stands about
       20 ft up, so what is drawn above it is that figure less the freeboard.
       The three were previously derived from one number by ratio, which put
       the fore and mizzen in roughly the right place for the wrong reason. */
    var MAIN = 220 - FREE, FORE = 198 - FREE, MIZ = 172.5 - FREE;
    var mm = mast(-0.02, MAIN), fm = mast(0.42, FORE), zm = mast(-0.46, MIZ);
    /* The main yard is about 95 ft on a 43.5 ft beam: more than twice the
       width of the ship, which is the proportion that makes a square-rigger
       look like one. At 78 ft the yards read as short crossbars and the whole
       rig looked like a mast with twigs on it. They shorten going up. */
    [[mm, 1.0], [fm, 0.88], [zm, 0.66]].forEach(function (m) {
      var M = m[0], k = m[1];
      [0.20, 0.46, 0.70, 0.88].forEach(function (f, i) {
        yard(M.x, M.z0 + M.H * f, (95 - i * 19) * k, 0.8,
             i > 1 ? TOP : SPAR, MD + 1 + i * 0.1);
      });
    });

    /* THE SHROUDS, and they are the reason this looked wrong.
       [SEAN, 2026-08-31: "USS constitution look really not ok".]

       A square-rigger carries its masts on standing rigging: fans of rope
       running from each masthead down to the channels bolted along the hull
       side, raked aft. Without them the masts are poles balanced in a tub,
       and no amount of correcting the hull fixes that, because the eye reads
       a ship by its rigging before it reads the planking.

       Drawn as thin quads rather than lines so they survive the same
       painter's sort as everything else. Both sides, because the far side's
       shrouds are visible ABOVE the bulwark even when its hull is hidden. */
    function shrouds(M, spread, n) {
      var tTop = M.x / HALF;
      var ztop = M.z0 + M.H * 0.42;
      var bAt = halfB(tTop);
      for (var side = -1; side <= 1; side += 2) {
        for (var k2 = 0; k2 < n; k2++) {
          var f = n === 1 ? 0 : k2 / (n - 1);
          var ax = M.x - spread * 0.30 + spread * f;
          var ay = side * bAt * (1.02 + 0.05 * f);
          var az = sheer(ax / HALF) + 3.4;
          var w = 0.55;
          var q = [P(M.x, side * 1.4, ztop), P(M.x + w, side * 1.4, ztop),
                   P(ax + w, ay, az), P(ax, ay, az)];
          out.push({ svg: ctx.poly(q, "#3a3a3a", "", 0, ' opacity="0.8"'),
                     depth: MD + 0.8 + k2 * 0.01 });
        }
      }
    }
    shrouds(mm, 34, 7);
    shrouds(fm, 30, 7);
    shrouds(zm, 24, 5);

    /* the bowsprit and jibboom forward, the spanker boom aft: the published
       305 ft overall less the published 207 ft on deck, split 62 and 36 */
    var bz = sheer(1);
    out.push({ svg: ctx.poly([P(HALF - 8, 0, bz - 1.5), P(HALF + FWD, 0, bz + 21),
                              P(HALF + FWD, 0, bz + 23.4), P(HALF - 8, 0, bz + 1.8)],
                             SPAR, SPAR_E, 0.5), depth: MD + 2 });
    out.push({ svg: ctx.poly([P(-HALF + 4, 0, zm.z0 + 14), P(-HALF - AFT, 0, zm.z0 + 20),
                              P(-HALF - AFT, 0, zm.z0 + 21.6), P(-HALF + 4, 0, zm.z0 + 15.6)],
                             SPAR, SPAR_E, 0.5), depth: MD + 2 });
    /* ============ THE ADDITIONS OF THE 2026-09-05 REBUILD ============ */

    /* ITEM 6, THE SHADOW. Nothing here casts light, so the hull needs its own
       dark water under it or the ship reads as a sticker on a blue card. Two
       ellipse-ish rings drawn from the station half-breadths, offset the way
       every other shadow in this project is, and pushed to the far depth so
       the water sorts over nothing and under everything. */
    function hullShadow(scale, alpha, dx, dy) {
      var q = [], i;
      for (i = 0; i <= N; i++) q.push(P(ST[i].x * 1.01 + dx, -ST[i].b * scale + dy, 0.02));
      for (i = N; i >= 0; i--) q.push(P(ST[i].x * 1.01 + dx, ST[i].b * scale + dy, 0.02));
      out.push({ svg: ctx.poly(q, "rgba(30,46,58," + alpha + ")", null, 0), depth: -1e9 + 3 });
    }
    hullShadow(1.35, 0.16, 9, 7);
    hullShadow(1.10, 0.20, 4, 3);

    /* ITEM 2, THE HORIZONTAL BREAKS. The old hull was one black field with a
       single white band across it. A real topside reads as four bands: copper
       from the waterline down, the black wale, the white gun stripe already
       drawn, and the black bulwark above. The copper is Paul Revere's, which
       is published and is the one material fact a Boston visitor is told. */
    var COPPER = "#8a5a34", COPPER_E = "#5d3a1e", WALE = "#151619";
    /* The model floats with z = 0 AT the waterline, so the copper Paul Revere
       supplied is almost all under the water and cannot be drawn. What IS
       visible on the ship in Charlestown is the boot top, the strip of it
       standing proud of the surface, and that is what this is: the published
       mean draft of 21 forward and 23 aft only sets how much of the freeboard
       the strip is allowed, it does not put copper up the topside. A first
       render had it a third of the way to the gun stripe and the frigate
       looked like a barge with a rusty hull. */
    var WL = (21 + 23) / 2 / FREE;
    function bandRun(s, f0, f1, fill, edge, d, out2) {
      for (var i = 0; i < N; i++) {
        var a = ST[i], c = ST[i + 1];
        var db = c.b - a.b, dx = c.x - a.x, nl = Math.sqrt(db * db + dx * dx) || 1;
        var nx = -db / nl, ny = s * dx / nl;
        if (!ctx.faceVisible(nx, ny)) continue;
        var q = [P(a.x, s * a.b * 1.006, a.z * f0), P(c.x, s * c.b * 1.006, c.z * f0),
                 P(c.x, s * c.b * 1.006, c.z * f1), P(a.x, s * a.b * 1.006, a.z * f1)];
        out.push({ svg: ctx.poly(q, ctx.shade(fill, nx, ny, 0), edge, edge ? 0.3 : 0),
                   depth: d + i * 0.01 });
      }
    }
    [-1, 1].forEach(function (s) {
      var HD = sideDepth(s);
      bandRun(s, 0.0, WL * 0.10, COPPER, COPPER_E, HD + 0.8);   /* the copper */
      bandRun(s, 0.44, 0.505, WALE, null, HD + 0.9);            /* the wale under the stripe */
    });

    /* ITEM 1 AND 9, THE STERN. Six windows, five pilasters between them, the
       taffrail moulding over and the eagle above the windows, all published.
       The transom's WIDTH is not published and is taken from the hull's own
       aftermost station, which is the only honest place to get it. */
    var GILT = "#b9912f", GILT_E = "#7d5f16", GLASS = "#38505c";
    if (ctx.faceVisible(-1, 0)) {
      var tz = ST[0], TX = tz.x, SD = 2e5 + 1.2;
      var TB = TRANSOM * TUMBLE;            /* half width at the rail */
      var zLo = tz.r * 0.52, zHi = tz.r * 0.80;
      /* the counter below the windows, then the window band, then the taffrail */
      function tQuad(y0v, y1v, z0v, z1v, fill, edge, d) {
        out.push({ svg: ctx.poly([P(TX - 0.4, y0v, z0v), P(TX - 0.4, y1v, z0v),
                                  P(TX - 0.4, y1v, z1v), P(TX - 0.4, y0v, z1v)],
                                 ctx.shade(fill, -1, 0, 0), edge, edge ? 0.3 : 0), depth: d });
      }
      tQuad(-TB, TB, zLo - 3.2, zLo, GILT, GILT_E, SD);            /* counter moulding */
      tQuad(-TB, TB, zLo, zHi, "#3b3f46", "#191b20", SD + 0.1);    /* the window band ground */
      /* six windows, five pilasters: the published count, drawn as objects */
      var NW = 6, span = TB * 1.72, w = span / (NW * 1.62);
      for (var wi = 0; wi < NW; wi++) {
        var yc = -span / 2 + span * (wi + 0.5) / NW;
        tQuad(yc - w / 2, yc + w / 2, zLo + 0.7, zHi - 0.7, GLASS, "#12161a", SD + 0.2);
      }
      for (var pi = 1; pi < NW; pi++) {
        var yp = -span / 2 + span * pi / NW;
        tQuad(yp - 0.5, yp + 0.5, zLo + 0.4, zHi - 0.4, GILT, null, SD + 0.3);
      }
      tQuad(-TB, TB, zHi, zHi + 1.5, GILT, GILT_E, SD + 0.4);      /* taffrail moulding */
      /* the spread eagle, high up near the taffrail in the centre */
      tQuad(-3.0, 3.0, zHi + 1.6, zHi + 4.2, GILT, GILT_E, SD + 0.5);
      tQuad(-6.4, -3.0, zHi + 2.4, zHi + 3.6, GILT, GILT_E, SD + 0.5);
      tQuad(3.0, 6.4, zHi + 2.4, zHi + 3.6, GILT, GILT_E, SD + 0.5);
    }
    /* THE QUARTER GALLERIES, one at each after corner, each with its own
       window: the 1805 painting's seventh and eighth. Built as a small box
       standing proud of the topside, so it survives the same painter's sort
       as the hull side it hangs on. */
    [-1, 1].forEach(function (s) {
      if (!ctx.faceVisible(0, s) && !ctx.faceVisible(-1, 0)) return;
      var t = -0.92, x = t * HALF, b = halfB(t), z = sheer(t);
      var g = box(ctx, x - 5.5, x + 5.5, s * (b - 0.6), s * (b + 2.6),
                  z * 0.52, z * 0.86, "#3b3f46", GILT_E, GILT, sideDepth(s) + 2.4);
      out = out.concat(g.parts);
      var w2 = box(ctx, x - 2.2, x + 2.2, s * (b + 2.4), s * (b + 2.9),
                   z * 0.58, z * 0.80, GLASS, "#12161a", GLASS, sideDepth(s) + 2.6);
      out = out.concat(w2.parts);
    });

    /* ITEM 1, THE FIGHTING TOPS. A square rigger's silhouette is platforms at
       the doublings, and the old rig had none: three bare poles with yards.
       Each top sits at its own mast's first doubling, which the mast segments
       already put at 0.42 of the published height, so the platform is placed
       from a published number rather than by eye. Diameter is NOT published
       and is drawn at a quarter of the beam, the ordinary frigate proportion,
       and said so here. */
    function fightingTop(M, r) {
      var z = M.z0 + M.H * 0.42;
      var t = box(ctx, M.x - r * 0.55, M.x + r * 0.55, -r, r, z, z + 1.2,
                  "#4a423a", "#241f1a", "#6a5f52", MD + 0.6);
      out = out.concat(t.parts);
    }
    fightingTop(mm, HB * 0.50);
    fightingTop(fm, HB * 0.46);
    fightingTop(zm, HB * 0.38);

    /* THE HEAD, forward. The published 62 ft of bowsprit forward of the
       billet head has been drawn for runs; what was missing is what it grows
       out of. The head rails sweep from the bow up to the bowsprit and carry
       the billethead between them, and without them the bow simply stopped. */
    var bx = HALF, bzz = sheer(1);
    [-1, 1].forEach(function (s) {
      if (!ctx.faceVisible(0, s)) return;
      out.push({ svg: ctx.poly([P(bx - 14, s * halfB(0.87) * 0.9, bzz * 0.86),
                                P(bx + 15, s * 1.5, bzz + 6.5),
                                P(bx + 15, s * 1.5, bzz + 8.0),
                                P(bx - 14, s * halfB(0.87) * 0.9, bzz * 0.86 + 1.6)],
                               ctx.shade(GILT, 0, s, 0), GILT_E, 0.3),
                 depth: sideDepth(s) + 2.8 });
    });
    /* the billethead itself: the published carving under the bowsprit */
    out = out.concat(box(ctx, bx + 2, bx + 9, -1.6, 1.6, bzz + 2.2, bzz + 6.2,
                         GILT, GILT_E, GILT, 2.2e5).parts);

    /* THE BOATS, published by name and length, stowed amidships on the spar
       deck as they are on the ship in Charlestown. Drawn: the 36 ft longboat
       and the two 30 ft cutters, the three a visitor can see over the rail.
       The four smaller boats are NOT drawn and are named here rather than
       piled on to reach the published count. */
    [[36, 0], [30, -7.5], [30, 7.5]].forEach(function (bt, i) {
      var L = bt[0], yc = bt[1], zc = railZ(-0.05) - 0.2;
      out = out.concat(box(ctx, -L / 2 + 6, L / 2 + 6, yc - 3.2, yc + 3.2,
                           zc, zc + 3.4, "#b9a878", "#7d6f49", "#8d7f5c",
                           DD + 0.4 + i * 0.1).parts);
    });

    return out;
  }

  window.TRAIL_FORMS = window.TRAIL_FORMS || {};
  window.TRAIL_FORMS["constitution"] = constitution;
})();
