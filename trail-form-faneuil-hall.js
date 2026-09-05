/* ---------------- Stop 6: Faneuil Hall ----------------
   John Smibert, 1740-42, for Peter Faneuil; doubled and raised by Charles
   Bulfinch in 1805-06. A market underneath and a meeting room over it, which
   is the whole idea of the building and the reason the ground storey is an
   arcade and the storey above it is one room. Rebuilt to MODEL_STANDARD.md,
   2026-09-05, by the landmark routine.

   PUBLISHED, from the Wikipedia article on Faneuil Hall, read this run and
   quoted rather than paraphrased:

     the 1742 building stood on a "100-by-40-foot (30 by 12 m) site"
     Bulfinch's 1806 building is "80 by 102 feet (24 by 31 m)"
     Bulfinch "doubled the north-south width, extending northward" and added
       "a third floor and attic"; it is now "four stories high, including
       the attic"
     the northern and southern elevations are divided into "nine bays",
       the western and eastern into "seven bays"
     "red" brick "laid in Flemish bond"
     a "gable roof" oriented "west-east" and "clad in slate shingles"
     first story: "Tuscan-style pilasters", openings "arched"
     second story: "Doric pilasters"
     third story: "Ionic pilasters, which are entirely of Bulfinch's design"
     "protruding limestone cornices" and "limestone keystones"
     second and third stories: "round-arched windows with keystones", while
       northern and southern elevations have "rectangular sash windows,
       topped by detached semicircular lunettes"
     western and eastern elevations carry "tympana with an architrave
       containing a lunette" and "porthole-like bullseye windows"
     "The lower part of the cupola is a square tower with louvers on its
       western elevation and windows on its other elevations"; the upper part
       is "a belfry, which contains a bell dating from 1867"; the cupola was
       "moved to the eastern end during the 1806 renovation"
     the Great Hall is "28 feet (8.5 m) high and 76 by 76 feet (23 by 23 m)
       across"; the ground floor market is "76 by 100 feet (23 by 30 m)"
     the grasshopper weathervane, Shem Drowne 1742, weighs "25 pounds (11 kg)"
     https://en.wikipedia.org/wiki/Faneuil_Hall

   THE MODULE CHECK, which is arithmetic and not opinion, and which is the
   reason nothing in this plan is proportioned by eye. The published bay
   counts and the published footprint are two independent facts and they
   agree to a tenth of a foot. Bulfinch extended NORTHWARD, so the 80 ft is
   the north-south dimension and the 102 ft is east-west. A northern
   elevation is therefore 102 ft wide across nine bays: 11.33 ft. A western
   elevation is 80 ft wide across seven bays: 11.43 ft. One module, reached
   twice. Old South closed the same way and it is the strongest evidence a
   plan can carry.

   THE SECOND CHECK, on the rooms: a hall 76 by 76 inside a building 80 by
   102 leaves two feet of wall on each long side, and a market 76 by 100
   inside 80 by 102 leaves one foot at each end. Both are believable
   masonry thicknesses and neither is possible if the axes are swapped. The
   room dimensions confirm the orientation the bay counts gave.

   ORIENTATION, which on this renderer is not a detail. At the page's own
   opening yaw the visible faces are +y and -x, so the EAST gable end, which
   carries the entrance doors, the tympanum and the cupola above it, is put
   at +y, and one long nine-bay elevation is put at -x. Old State House
   recorded this trap in trail-3d.js and Bunker Hill, Old North, the State
   House and Old South each sprang it again; both faces here were checked.

   THE VERTICAL, which is the softest thing in this model and is DERIVED.
   No overall height, eave height or storey height is published in any
   source reached this run. What is published is four storeys including the
   attic, and a Great Hall 28 ft high on the second floor. The second storey
   is therefore given 29.3 ft, the least that can contain a 28 ft room over
   a floor; the market storey below it is 17, the Bulfinch storey above it
   14.4, and the attic lives in the roof. That is a derivation and it is not
   a fact.

   STYLE: Georgian, already in STYLES.md, with a Federal third storey by
   Bulfinch on top of it. Nothing new is added to the book. The tells obeyed
   here are the Georgian ones: the round head that must never come out
   pointed, the openings struck as real openings with a light surround, the
   horizontal breaks that stop brick reading as a slab, and the superposed
   orders getting lighter as they rise, which is exactly what Tuscan then
   Doric then Ionic means.

   NAMED GAPS, not guessed:
     - no published height for anything. Every z in this file is derived, as
       set out above.
     - no published cupola dimensions, position along the ridge, or belfry
       plan. The square tower IS published and is drawn square; the belfry
       is named separately from it in the same sentence and is drawn as an
       octagon, which is a derivation from Bulfinch's idiom and not a
       published fact.
     - no published grasshopper length; 25 pounds is the only figure given.
       Drawn about four feet as a gilded silhouette on its spindle.
     - no published window sizes or sill heights; struck on the published
       bay module and centred in each storey.
     - no published pilaster width or projection.
     - no published step count at the doors.
     - the 1742 building's cupola stood at the WEST end and was moved east
       in 1806. Only the 1806 arrangement is drawn.
*/
(function () {
  var H = (typeof window !== "undefined" && window.TRAIL3D && window.TRAIL3D.helpers) || null;
  if (!H) return;
  var box = H.box, panel = H.panel, ground = H.ground, archOpening = H.archOpening;
  var roundWindow = H.roundWindow, slab = H.slab, gableRoof = H.gableRoof;
  var octStage = H.octStage, domeCap = H.domeCap, depthOf = H.depthOf;

  function shadow(ctx, cx, cy, w, d, z, dx, dy) {
    var P = ctx.project;
    return { svg: ctx.poly([P(cx - w / 2 + dx, cy - d / 2 + dy, z),
                            P(cx + w / 2 + dx, cy - d / 2 + dy, z),
                            P(cx + w / 2 + dx, cy + d / 2 + dy, z),
                            P(cx - w / 2 + dx, cy + d / 2 + dy, z)],
                           "#a9ae9c", "#a9ae9c", 0.3), depth: -9.9e8 };
  }

  function faneuilHall(ctx) {
    /* CHECKLIST 5, two tones per material. BRICK against BRICK_D gives the
       Flemish bond its course banding; LIME against LIME_D the limestone
       cornices and keystones; SLATE against SLATE_D the published slate. */
    var BRICK = "#9c5240", BRICK_D = "#8c4736", BRICK_E = "#6b3226";
    var LIME  = "#efe9db", LIME_D = "#d9d1bf", LIME_E = "#ab a2 91".replace(/ /g, "");
    var SLATE = "#7a7c7f", SLATE_E = "#4d4f52";
    var GLASS = "#37444c", DOOR = "#4a3a30";
    var GRANITE = "#b5b1a6", GRANITE_E = "#8a8678";
    var GOLD = "#cea52a", GOLD_E = "#8a6f18";
    var PAVE = "#ded8cb", KERB = "#bfb9aa";
    var out = [], P = ctx.project;

    /* THE PUBLISHED PLAN. 80 north-south on x, 102 east-west on y, east at
       +y so the entrance front and the cupola face the reader. */
    var W = 80, L = 102;
    var x0 = -W / 2, x1 = W / 2, y0 = -L / 2, y1 = L / 2;
    var BAYL = L / 9, BAYW = W / 7;      /* 11.33 and 11.43, the module */

    /* THE DERIVED ELEVATION. See the header: nothing here is published. */
    var WT = 3;                          /* granite water table */
    var S1a = 4.5, S1b = 18.0, S1T = 20.0;      /* market storey, arcaded */
    var BLT1 = 20.0, BLT1T = 21.4;
    var S2a = 25.0, S2b = 45.5, S2T = 50.7;     /* the Great Hall storey */
    var BLT2 = 50.7, BLT2T = 52.1;
    var S3a = 55.5, S3b = 63.5, S3T = 66.5;     /* Bulfinch's third storey */
    var CORN = 66.5, CORNT = 69.0;              /* the protruding cornice */
    var EAVE = 69.0, RIDGE = 85.0;

    /* the pad. Kept to 150 because the trail renderer fits the frame to
       everything drawn, and a wide apron shrinks the building on the page;
       that is the Bunker Hill lesson and it costs nothing to obey. */
    out.push(ground(ctx, 0, 0, 120, 120, 0, PAVE, KERB));
    out.push(shadow(ctx, 0, 0, W + 14, L + 14, 0.02, 7, 4));
    out = out.concat(slab(ctx, 0, 0, W + 8, L + 8, 0.02, 0.9, "#cfc9bb", KERB, -9.85e8));

    /* the granite water table, then the brick above it: two masses, so the
       building meets the ground on stone and not on brick */
    out = out.concat(slab(ctx, 0, 0, W + 1.6, L + 1.6, 0.9, WT - 0.9, GRANITE, GRANITE_E, -9.8e8));
    var shell = box(ctx, x0, x1, y0, y1, WT, CORN, BRICK, BRICK_E, null, 1000);
    out = out.concat(shell.parts);

    /* the course banding: the second brick tone as a texture, one band every
       six feet, never as a count of bricks. Struck on each visible wall in
       that wall's own (u, z) map. */
    var faces = [
      { n: [-1, 0], map: function (u, z) { return P(x0, u, z); }, u0: y0, u1: y1, bays: 9, dep: 1000 + 0.3, arch: false },
      { n: [1, 0],  map: function (u, z) { return P(x1, u, z); }, u0: y0, u1: y1, bays: 9, dep: 1000 + 0.1, arch: false },
      { n: [0, -1], map: function (u, z) { return P(u, y0, z); }, u0: x0, u1: x1, bays: 7, dep: 1000 + 0.0, arch: true },
      { n: [0, 1],  map: function (u, z) { return P(u, y1, z); }, u0: x0, u1: x1, bays: 7, dep: 1000 + 0.2, arch: true }
    ];

    faces.forEach(function (f) {
      if (!ctx.faceVisible(f.n[0], f.n[1])) return;
      var map = f.map, dep = f.dep, nx = f.n[0], ny = f.n[1];
      var wall = ctx.shade(BRICK, nx, ny, 0);
      var wallD = ctx.shade(BRICK_D, nx, ny, 0);
      var lime = ctx.shade(LIME, nx, ny, 0);
      var limeD = ctx.shade(LIME_D, nx, ny, 0);

      for (var zb = WT + 6; zb < CORN - 2; zb += 6) {
        out.push(panel(ctx, map, f.u0 + 0.2, f.u1 - 0.2, zb, zb + 0.5, wallD, wallD, dep + 0.01));
      }

      /* THE PUBLISHED SUPERPOSED ORDERS. A pilaster on every bay division,
         getting narrower as it rises, each with a limestone capital block:
         Tuscan, then Doric, then Ionic. They are the reason a 102 ft brick
         wall does not read as a slab. */
      var span = f.u1 - f.u0, n = f.bays, step = span / n;
      for (var b = 0; b <= n; b++) {
        var u = f.u0 + step * b;
        [[S1a - 1.5, S1T, 1.5], [BLT1T, S2T, 1.25], [BLT2T, S3T, 1.0]].forEach(function (t, oi) {
          var hw = t[2];
          out.push(panel(ctx, map, u - hw, u + hw, t[0], t[1], wallD, BRICK_E, dep + 0.02));
          out.push(panel(ctx, map, u - hw - 0.35, u + hw + 0.35, t[1] - 1.1, t[1], lime, LIME_E, dep + 0.05));
        });
      }

      /* the two limestone belt courses and the protruding cornice */
      out.push(panel(ctx, map, f.u0, f.u1, BLT1, BLT1T, lime, LIME_E, dep + 0.06));
      out.push(panel(ctx, map, f.u0, f.u1, BLT2, BLT2T, lime, LIME_E, dep + 0.06));
      out.push(panel(ctx, map, f.u0 - 0.6, f.u1 + 0.6, CORN, CORNT, lime, LIME_E, dep + 0.07));
      out.push(panel(ctx, map, f.u0 - 0.3, f.u1 + 0.3, CORN - 0.7, CORN, limeD, LIME_E, dep + 0.065));

      /* THE OPENINGS, on the published module, one per bay. CHECKLIST 8: a
         light surround is struck first and the dark glass inside it after,
         which is the difference between a Georgian window and a stain. */
      for (var q = 0; q < n; q++) {
        var uc = f.u0 + step * (q + 0.5);
        var hw2 = step * 0.30;

        /* FIRST STOREY: published "arched". This is the market arcade and
           it is the one thing the ground floor of this building is. */
        out.push(panel(ctx, map, uc - hw2 - 0.7, uc + hw2 + 0.7, S1a - 0.9, S1b + hw2 + 1.4, lime, LIME_E, dep + 0.10));
        out.push(archOpening(ctx, map, uc, hw2, S1a, S1b, ctx.shade(GLASS, nx, ny, 0), "#252c31", dep + 0.12));
        out.push(panel(ctx, map, uc - 0.55, uc + 0.55, S1b + hw2 - 0.5, S1b + hw2 + 1.5, lime, LIME_E, dep + 0.14));

        if (f.arch) {
          /* WEST AND EAST: published round-arched windows with keystones on
             both upper stories. */
          [[S2a, S2b], [S3a, S3b]].forEach(function (s, si) {
            var h3 = step * 0.22;
            out.push(panel(ctx, map, uc - h3 - 0.6, uc + h3 + 0.6, s[0] - 0.7, s[1] + h3 + 1.1, lime, LIME_E, dep + 0.16 + si * 0.02));
            out.push(archOpening(ctx, map, uc, h3, s[0], s[1], ctx.shade(GLASS, nx, ny, 0), "#252c31", dep + 0.17 + si * 0.02));
            out.push(panel(ctx, map, uc - 0.5, uc + 0.5, s[1] + h3 - 0.4, s[1] + h3 + 1.2, lime, LIME_E, dep + 0.18 + si * 0.02));
          });
        } else {
          /* NORTH AND SOUTH: published rectangular sash "topped by detached
             semicircular lunettes". The lunette is DETACHED, so it is drawn
             clear of the window head with wall showing between them, which
             is the whole point of the word. */
          [[S2a, S2b], [S3a, S3b]].forEach(function (s, si) {
            var h4 = step * 0.21;
            out.push(panel(ctx, map, uc - h4 - 0.6, uc + h4 + 0.6, s[0] - 0.7, s[1] + 0.7, lime, LIME_E, dep + 0.16 + si * 0.02));
            out.push(panel(ctx, map, uc - h4, uc + h4, s[0], s[1], ctx.shade(GLASS, nx, ny, 0), "#252c31", dep + 0.17 + si * 0.02));
            /* the muntin: one bar, so a sash reads as a sash */
            out.push(panel(ctx, map, uc - 0.18, uc + 0.18, s[0], s[1], limeD, LIME_E, dep + 0.175 + si * 0.02));
            var lz = s[1] + 1.6;
            out.push(archOpening(ctx, map, uc, h4 * 0.86, lz, lz, lime, LIME_E, dep + 0.19 + si * 0.02));
            out.push(archOpening(ctx, map, uc, h4 * 0.62, lz + 0.35, lz + 0.35, ctx.shade(GLASS, nx, ny, 0), "#252c31", dep + 0.20 + si * 0.02));
          });
        }
      }

      /* THE ENTRANCE. Published "paneled doors" on the eastern elevation.
         Three of the seven bays, on the centre, given doors instead of
         arcade glass, and granite steps in front of them. */
      if (ny === 1) {
        [-1, 0, 1].forEach(function (k) {
          var ud = k * step;
          out.push(panel(ctx, map, ud - step * 0.24, ud + step * 0.24, S1a - 0.6, S1a + 10.5, ctx.shade(DOOR, nx, ny, 0), "#2c231c", dep + 0.30));
          out.push(panel(ctx, map, ud - 0.16, ud + 0.16, S1a - 0.6, S1a + 10.5, "#3a2e26", "#2c231c", dep + 0.31));
        });
      }
    });

    /* THE PUBLISHED ROOF: gable, west-east, slate. gableRoof puts its gables
       at y0 and y1, which is exactly the published orientation. */
    var roof = gableRoof(ctx, x0 - 0.8, x1 + 0.8, y0 - 0.8, y1 + 0.8, EAVE, RIDGE, SLATE, SLATE_E, BRICK);
    out = out.concat(roof);

    /* THE PUBLISHED TYMPANA on west and east: "an architrave containing a
       lunette", and the "porthole-like bullseye windows". Drawn on the gable
       faces, which is where they are. */
    [[0, -1, y0 - 0.8], [0, 1, y1 + 0.8]].forEach(function (g) {
      if (!ctx.faceVisible(g[0], g[1])) return;
      var yF = g[2], mapG = function (u, z) { return P(u, yF, z); };
      var dg = 4000 + (g[1] > 0 ? 0.4 : 0);
      out.push(panel(ctx, mapG, x0, x1, EAVE, EAVE + 1.5, ctx.shade(LIME, g[0], g[1], 0), LIME_E, dg));
      out.push(archOpening(ctx, mapG, 0, 9.6, EAVE + 5.4, EAVE + 5.4, ctx.shade(LIME, g[0], g[1], 0), LIME_E, dg + 0.1));
      out.push(archOpening(ctx, mapG, 0, 7.8, EAVE + 6.2, EAVE + 6.2, ctx.shade(GLASS, g[0], g[1], 0), "#252c31", dg + 0.2));
      [-21, 21].forEach(function (ux) {
        out.push(roundWindow(ctx, mapG, ux, EAVE + 3.0, 2.3, ctx.shade(LIME, g[0], g[1], 0), LIME_E, dg + 0.1));
        out.push(roundWindow(ctx, mapG, ux, EAVE + 3.0, 1.6, ctx.shade(GLASS, g[0], g[1], 0), "#252c31", dg + 0.2));
      });
      /* WHAT LOOKING CAUGHT: the gable was a bare brick triangle with its
         ornament clustered along the bottom two feet, and it had no raking
         cornice, so a pediment read as a roof end. Both fixed here. */
      [-1, 1].forEach(function (sx) {
        out.push({ svg: ctx.poly([mapG(sx * (W / 2 + 0.8), EAVE + 1.5), mapG(0, RIDGE),
                                  mapG(0, RIDGE - 2.2), mapG(sx * (W / 2 + 0.8), EAVE - 0.7)],
                                 ctx.shade(LIME, g[0], g[1], 0), LIME_E, 0.4), depth: dg + 0.06 });
      });
    });

    /* THE CUPOLA, published as being at the EASTERN end since 1806. Every
       dimension below is derived; see the header. */
    var cy = y1 - 25, TW = 17, tx = -TW / 2, txx = TW / 2;
    var T0 = 72, T1 = 97;
    out = out.concat(slab(ctx, 0, cy, TW + 3.0, TW + 3.0, T0 - 1.2, 1.2, LIME, LIME_E, 5000));
    var tow = box(ctx, tx, txx, cy - TW / 2, cy + TW / 2, T0, T1, LIME, LIME_E, null, 5100);
    out = out.concat(tow.parts);

    /* the published distinction between the faces: LOUVRES on the western
       elevation, WINDOWS on the other three. That is a fact and it is drawn
       as one, which is why the two are different shapes here. */
    [{ n: [-1, 0], m: function (u, z) { return P(tx, u + cy, z); }, d: 5100 + 0.3, w: 1 },
     { n: [1, 0],  m: function (u, z) { return P(txx, u + cy, z); }, d: 5100 + 0.1, w: 1 },
     { n: [0, -1], m: function (u, z) { return P(u, cy - TW / 2, z); }, d: 5100 + 0.0, w: 0 },
     { n: [0, 1],  m: function (u, z) { return P(u, cy + TW / 2, z); }, d: 5100 + 0.2, w: 1 }
    ].forEach(function (f) {
      if (!ctx.faceVisible(f.n[0], f.n[1])) return;
      var m = f.m, dd = f.d;
      out.push(panel(ctx, m, -TW / 2 + 0.6, TW / 2 - 0.6, T1 - 2.0, T1 - 0.8, ctx.shade(LIME_D, f.n[0], f.n[1], 0), LIME_E, dd + 0.02));
      if (f.w) {
        out.push(panel(ctx, m, -3.6, 3.6, T0 + 7.5, T0 + 18.0, ctx.shade(LIME, f.n[0], f.n[1], 0), LIME_E, dd + 0.04));
        out.push(archOpening(ctx, m, 0, 2.7, T0 + 8.4, T0 + 14.4, ctx.shade(GLASS, f.n[0], f.n[1], 0), "#252c31", dd + 0.06));
      } else {
        /* the louvres: the west face, published. Slats, and few enough that
           they read as shutters and not as a radiator, which is the note
           Bunker Hill's belfry left in this file. */
        out.push(panel(ctx, m, -3.9, 3.9, T0 + 7.2, T0 + 18.3, ctx.shade(LIME, f.n[0], f.n[1], 0), LIME_E, dd + 0.04));
        out.push(panel(ctx, m, -3.1, 3.1, T0 + 7.9, T0 + 17.6, "#5d5a50", "#3e3c35", dd + 0.06));
        for (var s = 0; s < 6; s++) {
          var zz = T0 + 8.3 + s * 1.55;
          out.push(panel(ctx, m, -3.1, 3.1, zz, zz + 0.85, ctx.shade(LIME_D, f.n[0], f.n[1], 0), LIME_E, dd + 0.08));
        }
      }
    });

    /* the cornice, then the belfry. The belfry's OCTAGON is derived, not
       published; the header says so. */
    out = out.concat(slab(ctx, 0, cy, TW + 3.4, TW + 3.4, T1, 1.6, LIME, LIME_E, 5300));
    var B0 = 98.6, B1 = 112.5, BR = 6.6;
    out = out.concat(octStage(ctx, 0, cy, BR, BR, B0, B1, LIME, LIME_E, 5400));
    /* the openings of a belfry are the belfry: eight dark bays between eight
       corner posts, so it reads as open and not as a drum */
    for (var i = 0; i < 8; i++) {
      var a0 = (i / 8) * Math.PI * 2, a1 = ((i + 1) / 8) * Math.PI * 2, am = (a0 + a1) / 2;
      var nx2 = Math.cos(am), ny2 = Math.sin(am);
      if (!ctx.faceVisible(nx2, ny2)) continue;
      var ex = 0 + BR * 0.99 * Math.cos(am), ey = cy + BR * 0.99 * Math.sin(am);
      var px = -Math.sin(am), py = Math.cos(am);
      var hwB = BR * 0.30;
      var qd = [P(ex - px * hwB, ey - py * hwB, B0 + 1.6), P(ex + px * hwB, ey + py * hwB, B0 + 1.6),
                P(ex + px * hwB, ey + py * hwB, B1 - 1.8), P(ex - px * hwB, ey - py * hwB, B1 - 1.8)];
      out.push({ svg: ctx.poly(qd, "#2f3a41", "#22282c", 0.4), depth: 5500 + i * 0.02 });
    }
    out = out.concat(slab(ctx, 0, cy, (BR + 1.5) * 2, (BR + 1.5) * 2, B1, 1.4, LIME, LIME_E, 5600));

    /* the dome, and above it the published grasshopper. Drawn as a gilded
       silhouette on its spindle: 25 pounds is the only figure published and
       a weight does not give a length. */
    var D0 = 113.9;
    domeCap(ctx, 0, cy, BR + 0.4, D0, 6.0, LIME_D, LIME_E, 5700);
    out = out.concat(octStage(ctx, 0, cy, BR + 0.4, BR * 0.72, D0, D0 + 2.6, LIME_D, LIME_E, 5700));
    out = out.concat(octStage(ctx, 0, cy, BR * 0.72, BR * 0.34, D0 + 2.6, D0 + 4.6, LIME_D, LIME_E, 5720));
    out = out.concat(octStage(ctx, 0, cy, BR * 0.34, 0.35, D0 + 4.6, D0 + 6.0, LIME_D, LIME_E, 5740));
    out = out.concat(octStage(ctx, 0, cy, 0.3, 0.3, D0 + 6.0, D0 + 11.5, GOLD, GOLD_E, 5800));
    var gz = D0 + 11.5, hopper = [
      P(-2.1, cy, gz), P(1.9, cy, gz + 0.5), P(2.2, cy, gz + 1.5),
      P(0.4, cy, gz + 2.0), P(-1.4, cy, gz + 1.5), P(-2.3, cy, gz + 0.7)];
    out.push({ svg: ctx.poly(hopper, GOLD, GOLD_E, 0.4), depth: 5900 });
    out.push({ svg: ctx.poly([P(0.6, cy, gz + 1.7), P(2.0, cy, gz + 3.4), P(1.4, cy, gz + 3.4), P(0.2, cy, gz + 1.8)],
                             GOLD, GOLD_E, 0.3), depth: 5910 });

    return out;
  }

  window.TRAIL_FORMS = window.TRAIL_FORMS || {};
  window.TRAIL_FORMS["faneuil-hall"] = faneuilHall;
})();
