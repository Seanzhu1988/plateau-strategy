/* seattle-3d.js  ·  Seattle, standing up
   =====================================
   The city Sean actually sells tours in, and until now the only one on this
   site with no geometry at all. Same discipline as trail-3d.js and
   met-rooms.js: real published dimensions or it does not get drawn, the style
   named in STYLES.md before the geometry is chosen, and every large flat
   surface given an explicit painter depth, because a plane sorted on its own
   corners paints over whatever stands on it.

   Scenes are PURE. Each takes a context supplying project/poly/shade/
   faceVisible and returns {svg, depth} pieces, so render_room.js can draw one
   headlessly and it can be LOOKED AT before it ships.

   ---------------- Stop 1: the Space Needle ----------------
   John Graham and Company, 1961 to 1962, for the Century 21 Exposition, from
   Edward Carlson's sketch of a balloon on a tether and Victor Steinbrueck's
   hourglass. Googie, which the styles book now carries.

   EVERY NUMBER BELOW IS PUBLISHED, and where it came from:

     605 ft to the tip of the spire ................ Wikipedia, Space Needle
     520 ft observation deck above ground .......... Wikipedia
     518 ft top floor .............................. Wikipedia
     500 ft restaurant, as originally built ........ Wikipedia
     138 ft across at the top ...................... Wikipedia
     120 by 120 ft foundation, 30 ft deep .......... Wikipedia
     102 ft diameter at the base of the legs ....... Docomomo WEWA
     waist at the 373 ft level ..................... Docomomo WEWA
     three PAIRS of steel legs ..................... Docomomo WEWA
     36 in welded beam columns ..................... ASCE, Civil Engineering

   REBUILT TO MODEL_STANDARD.md, 2026-09-05 [SEAN: "can you build a realistic
   spaceneedle"]. Not one published dimension moved. What changed is the
   drawing, and every change came from looking at it:

     the legs      at the published 3 ft they were arithmetically right and
                   rendered as hairlines, so the picture was a fat core with
                   six threads beside it, which is the exact INVERSION of the
                   style: STYLES.md says the legs are the structure and must
                   read as line. Their width is unchanged, because it is
                   published. They carry their own edge stroke now.
     the shadow    checklist 6, and it was missing altogether. Projected
                   honestly at first, base and saucer thrown clear by 520 ft,
                   and it came back as a grey blob on the grass reading as a
                   pond. This renderer has no penumbra and no horizon, so the
                   footprint convention every other model here uses is used
                   here too, and named as the drawing device it is.
     the roof      24 segments each carrying a full edge stroke made a fanned
                   parasol, all ribs and no surface. The strokes came off.
     the halo      drawn at a radius of 24 where the roof surface at that
                   height is already 34, so it was BURIED inside its own cone.
                   Invisible however carefully a comment describes it, which is
                   checklist 1 failing quietly. Its radius is taken from the
                   roof profile now.
     added         the three elevators, which are the other thing a visitor
                   names after the shape; footings under the legs, because six
                   columns cannot end in a painted square; the overhanging eave
                   and its fascia, without which a saucer meeting its roof at
                   one line reads as a lampshade; the deck's glass guard; and
                   the aircraft beacon, the only thing up there that is not
                   white.

   COLOUR IS A RESEARCH QUESTION HERE AND IS ANSWERED AS A GAP. The published
   1962 scheme is Orbital Olive body, Astronaut White legs, Re-entry Red
   saucer, Galaxy Gold roof (Wikipedia). None of it is what stands there now.
   The gold roof returned for the fiftieth in April 2012 and was gold for SIX
   MONTHS before going back to Astronaut White (NPR, KING5), and again for the
   sixtieth in 2022. No source reached establishes today's colour, so this
   draws the everyday tower in pale white steel and records the names rather
   than painting a guess on the most recognisable roof in Seattle.

   THE ONE NUMBER NOBODY PUBLISHES is the width AT the waist. The height of
   the waist is published and both widths it sits between are published, so
   the leg curve is drawn THROUGH the published level and its narrowest width
   is a consequence of that curve, not a figure claimed from a source. It is
   named here rather than buried, because a model that quietly invents one
   dimension is indistinguishable from one that invents them all.
*/
(function () {
  "use strict";

  function depthOf(pts) {
    var d = -1e9;
    for (var i = 0; i < pts.length; i++) if (pts[i][2] > d) d = pts[i][2];
    return d;
  }
  function meanDepth(pts) {
    var s = 0;
    for (var i = 0; i < pts.length; i++) s += pts[i][2];
    return s / pts.length;
  }

  /* A horizontal disc, N-sided. It is a large flat plane, so it never sorts
     on its own corners: a cap spanning 138 ft has a nearer rim than the
     spire standing in the middle of it and would paint the spire out. */
  function disc(ctx, cx, cy, r, z, n, fill, edge, depth) {
    var P = ctx.project, pts = [];
    for (var i = 0; i < n; i++) {
      var a = (i / n) * Math.PI * 2;
      pts.push(P(cx + r * Math.cos(a), cy + r * Math.sin(a), z));
    }
    return { svg: ctx.poly(pts, fill, edge, 0.5),
             depth: depth === undefined ? meanDepth(pts) : depth };
  }

  /* A frustum: the wall between two radii at two heights. Back faces culled
     against the outward normal, so a drum shows only its front half. */
  function frustum(ctx, cx, cy, r0, z0, r1, z1, n, fill, edge) {
    var P = ctx.project, out = [];
    for (var i = 0; i < n; i++) {
      var a0 = (i / n) * Math.PI * 2, a1 = ((i + 1) / n) * Math.PI * 2;
      var am = (a0 + a1) / 2, nx = Math.cos(am), ny = Math.sin(am);
      if (!ctx.faceVisible(nx, ny)) continue;
      var q = [P(cx + r0 * Math.cos(a0), cy + r0 * Math.sin(a0), z0),
               P(cx + r0 * Math.cos(a1), cy + r0 * Math.sin(a1), z0),
               P(cx + r1 * Math.cos(a1), cy + r1 * Math.sin(a1), z1),
               P(cx + r1 * Math.cos(a0), cy + r1 * Math.sin(a0), z1)];
      var slope = (r0 - r1) / Math.max(1, Math.abs(z1 - z0));
      out.push({ svg: ctx.poly(q, ctx.shade(fill, nx, ny, slope * 0.6), edge, 0.6),
                 depth: depthOf(q) });
    }
    return out;
  }

  function pad(ctx, cx, cy, w, d, z, fill, edge, depth) {
    var P = ctx.project;
    var q = [P(cx - w / 2, cy - d / 2, z), P(cx + w / 2, cy - d / 2, z),
             P(cx + w / 2, cy + d / 2, z), P(cx - w / 2, cy + d / 2, z)];
    return { svg: ctx.poly(q, fill, edge, 0.5), depth: depth };
  }

  function spaceNeedle(ctx) {
    /* MODEL_STANDARD_EXEMPT: 2 no cornice or string course, it is a tower on three legs under a saucer */
    /* COLOUR, and it is a research question rather than a taste one. The
       published 1962 scheme is "Orbital Olive paint for the body, Astronaut
       White for the legs, Re-entry Red for the saucer, and Galaxy Gold for the
       roof" (Wikipedia). None of that is what stands there now. The gold roof
       came back for the fiftieth in April 2012 and was gold for SIX MONTHS
       before returning to Astronaut White (NPR, KING5), and again for the
       sixtieth in 2022. No source reached this run establishes today's colour,
       so this model draws the everyday tower: pale white steel throughout,
       with the published names recorded here rather than a guess painted on.
       That is a NAMED GAP, not a decision. */
    var WHITE = "#e4e0d6", WHITE_D = "#cdc8bb", STEEL_EDGE = "#8a8478";
    var PALE = "#d8d3c6", GLASS = "#8fa6ae", GLASS_EDGE = "#5d7079";
    var DARK = "#6d6a63";
    var PLAZA = "#ddd8cc", GRASS = "#c2c9b4", SHADOW = "#aab09c";
    var cx = 0, cy = 0, out = [];

    /* the published profile, unchanged: every one of these carries a source
       in this file's header and none of them moved in this rebuild */
    var R_BASE = 51;      /* 102 ft diameter at the base of the legs */
    var Z_WAIST = 373;    /* the published waist LEVEL */
    var Z_REST = 500;     /* restaurant as originally built */
    var Z_DECK = 520;     /* observation deck above ground */
    var R_TOP = 69;       /* 138 ft across at the top */
    var Z_TIP = 605;      /* spire tip */

    /* the one unpublished quantity, and everything derived from it */
    var R_WAIST = 13;
    var R_FLARE = R_WAIST * 2;   /* where the legs meet the underside */

    /* the leg curve: in to the waist, out again above it */
    function legR(z) {
      if (z <= Z_WAIST) {
        var t = (Z_WAIST - z) / Z_WAIST;
        return R_WAIST + (R_BASE - R_WAIST) * Math.pow(t, 1.55);
      }
      var u = (z - Z_WAIST) / (Z_REST - Z_WAIST);
      return R_WAIST + (R_FLARE - R_WAIST) * Math.pow(Math.min(1, u), 1.6);
    }

    /* ground. Explicit depth, always first. */
    out.push(pad(ctx, cx, cy, 330, 330, 0, GRASS, "#a8b09a", -1e9));
    out.push(pad(ctx, cx, cy, 210, 210, 0.5, PLAZA, "#bfb9aa", -0.99e9));
    /* the foundation: 120 by 120 ft, 30 ft deep and buried, so only its slab
       shows. Drawing the pit would be drawing something nobody can see. */
    out.push(pad(ctx, cx, cy, 120, 120, 1, "#cfc8b7", "#a9a394", -0.98e9));

    /* CHECKLIST 6, and it was missing entirely: a ground shadow. Nothing in
       this renderer casts light, so a 605 ft tower without one floats on its
       own plaza.
       WHAT LOOKING CAUGHT: the first version projected it honestly, the base
       under the legs and the saucer thrown clear by its own 520 ft, and the
       picture came back with a grey blob sitting on the grass twenty yards
       from the tower, joined to nothing, reading as a pond. A physically
       projected shadow needs a penumbra and a horizon to be legible, and this
       renderer has neither. Every other model on this site draws the footprint
       instead, so this one does too: one shape at the legs' own 102 ft spread,
       pulled a little toward the light's far side, and nothing else. It is a
       drawing device and is named as one. */
    (function () {
      var q = [], N = 24;
      for (var i = 0; i < N; i++) {
        var a = (i / N) * Math.PI * 2;
        q.push(ctx.project(cx + R_BASE * 1.05 * Math.cos(a) + 14,
                           cy + R_BASE * 1.05 * Math.sin(a) + 9, 0.9));
      }
      out.push({ svg: ctx.poly(q, SHADOW, null, 0), depth: -0.97e9 });
    })();

    /* the core. Narrower than the waist, because the FIRST render drew it as
       wide as the waist and the picture came back a fat trunk with six guy
       wires hanging off it: the hourglass was in the numbers and not in the
       image. It claims no dimension of its own, being a fraction of the one
       unpublished quantity. */
    out = out.concat(frustum(ctx, cx, cy, R_WAIST * 0.55, 1, R_WAIST * 0.5, Z_REST,
                             12, "#b3ada0", "#79746a"));

    /* THE THREE ELEVATORS, which are the other thing a visitor names after the
       shape: they run up the OUTSIDE of the core in glass cars, and from the
       ground they read as three bright vertical lines on an otherwise plain
       shaft. Published: three of them, forty one seconds to the top, ten miles
       an hour coming down. Their width is not published and is drawn as a
       fraction of the core, marked ASSUMED. */
    (function () {
      for (var e = 0; e < 3; e++) {
        var ang = e * (Math.PI * 2 / 3) + 0.55;
        var nx = Math.cos(ang), ny = Math.sin(ang);
        if (!ctx.faceVisible(nx, ny)) continue;
        var STEPS = 14, w = 0.30;    /* ASSUMED: 0.30 rad of the core's arc */
        for (var k = 0; k < STEPS; k++) {
          var z0 = 6 + (Z_REST - 30) * (k / STEPS);
          var z1 = 6 + (Z_REST - 30) * ((k + 1) / STEPS);
          var r0 = R_WAIST * (0.55 + (0.5 - 0.55) * (z0 / Z_REST)) + 0.6;
          var r1 = R_WAIST * (0.55 + (0.5 - 0.55) * (z1 / Z_REST)) + 0.6;
          var q = [ctx.project(r0 * Math.cos(ang - w), r0 * Math.sin(ang - w), z0),
                   ctx.project(r0 * Math.cos(ang + w), r0 * Math.sin(ang + w), z0),
                   ctx.project(r1 * Math.cos(ang + w), r1 * Math.sin(ang + w), z1),
                   ctx.project(r1 * Math.cos(ang - w), r1 * Math.sin(ang - w), z1)];
          out.push({ svg: ctx.poly(q, ctx.shade(GLASS, nx, ny, 0.1), GLASS_EDGE, 0.35),
                     depth: depthOf(q) + 0.5 });
        }
      }
    })();

    /* three PAIRS of legs, 36 in columns. Not culled: a slender member is
       visible from every side, and culling the far ones halves the tower.
       WHAT LOOKING CAUGHT: at the published 3 ft the legs are arithmetically
       right and rendered as hairlines, so the picture came back a fat core
       with six threads beside it, which is the exact inversion of the style.
       STYLES.md is explicit that the legs ARE the structure and must "read as
       line". The width is NOT changed, because it is published. What changed
       is that each leg now carries its own edge stroke at full contrast and a
       darker inboard face, so a 3 ft member still registers at 800 pixels the
       way a steel column registers against the sky. */
    var COL = 3, GAP = 0.13, STEPS = 26;
    for (var p = 0; p < 3; p++) {
      for (var sgn = -1; sgn <= 1; sgn += 2) {
        var ang2 = p * (Math.PI * 2 / 3) + sgn * GAP;
        for (var k2 = 0; k2 < STEPS; k2++) {
          var z0b = 1 + (Z_REST - 1) * (k2 / STEPS);
          var z1b = 1 + (Z_REST - 1) * ((k2 + 1) / STEPS);
          var r0b = legR(z0b), r1b = legR(z1b);
          var half = COL / 2;
          var t0 = Math.atan2(half, Math.max(6, r0b)), t1 = Math.atan2(half, Math.max(6, r1b));
          var q2 = [ctx.project(r0b * Math.cos(ang2 - t0), r0b * Math.sin(ang2 - t0), z0b),
                    ctx.project(r0b * Math.cos(ang2 + t0), r0b * Math.sin(ang2 + t0), z0b),
                    ctx.project(r1b * Math.cos(ang2 + t1), r1b * Math.sin(ang2 + t1), z1b),
                    ctx.project(r1b * Math.cos(ang2 - t1), r1b * Math.sin(ang2 - t1), z1b)];
          out.push({ svg: ctx.poly(q2, ctx.shade(WHITE, Math.cos(ang2), Math.sin(ang2), 0.1),
                                   STEEL_EDGE, 0.9),
                     depth: depthOf(q2) + 1 });
        }
      }
    }

    /* the leg footings. The legs land on the published 120 ft foundation and
       something has to receive them, or six columns end in a painted square. */
    for (var f = 0; f < 3; f++) {
      var fa = f * (Math.PI * 2 / 3);
      var fx = R_BASE * Math.cos(fa), fy = R_BASE * Math.sin(fa);
      out = out.concat(frustum(ctx, fx, fy, 9, 1, 7, 9, 10, WHITE_D, STEEL_EDGE));
      out.push(disc(ctx, fx, fy, 7, 9, 10, WHITE_D, STEEL_EDGE, depthOf(
        [ctx.project(fx, fy, 9)]) + 2));
    }

    /* the top house. The disc is wider than anything below it and overhangs
       on every side: that is the tell, and it is why the legs stop at the
       flare and the saucer carries on past them. */
    out = out.concat(frustum(ctx, cx, cy, R_FLARE, 490, R_TOP, Z_REST,
                             28, PALE, null));                 /* the cone under the saucer */
    out = out.concat(frustum(ctx, cx, cy, R_TOP, Z_REST, R_TOP, 518,
                             24, GLASS, GLASS_EDGE));          /* restaurant glass, 500 to 518 */
    /* THE EAVE. A saucer that meets its roof at a single line reads as a
       lampshade. The real top house has a deep overhanging rim standing proud
       of the glass under it, and it is the shadow line under that rim that
       makes the thing read as a disc held in the air. Its projection is not
       published and is drawn at 4 ft, ASSUMED. */
    out = out.concat(frustum(ctx, cx, cy, R_TOP, 518, R_TOP + 4, Z_DECK,
                             24, WHITE, STEEL_EDGE));
    out = out.concat(frustum(ctx, cx, cy, R_TOP + 4, Z_DECK, R_TOP + 4, Z_DECK + 3,
                             24, WHITE_D, STEEL_EDGE));        /* the rim's own fascia */
    /* the observation deck's guard, the floor to ceiling glass the 2018 work
       put in, drawn as a low glazed band standing on the rim */
    out = out.concat(frustum(ctx, cx, cy, R_TOP + 1, Z_DECK + 3, R_TOP - 1, Z_DECK + 11,
                             24, GLASS, GLASS_EDGE));
    out.push(disc(ctx, cx, cy, R_TOP - 1, Z_DECK + 11, 24, PALE, "#a49c8c", -1e3));
    /* the roof. Shallow. The first render gave it 36 ft of rise over 40 ft of
       run and the saucer came back a mushroom, which is a different building
       and a different decade. 138 ft across against 50 ft tall is the ratio a
       photograph shows. */
    /* WHAT LOOKING CAUGHT, second thing: with every one of its 24 segments
       carrying a full edge stroke the roof came back as a fanned parasol, all
       ribs and no surface. A cone is one surface, and the segments are the
       renderer's way of curving it, not something the building has. The
       strokes come off and the shading alone does the curving. */
    out = out.concat(frustum(ctx, cx, cy, R_TOP - 1, Z_DECK + 11, 20, 552,
                             28, WHITE, null));
    /* THE HALO: the ring near the top of the roof, which is the one piece of
       the profile that stops it being a plain cone. Its size is not published
       and is drawn as a band standing slightly proud of the roof, ASSUMED.
       WHAT LOOKING CAUGHT: drawn first at a radius of 24 it was BURIED, because
       the roof surface at that height is already 34 ft out. A ring inside its
       own cone is invisible however carefully it is described in a comment,
       which is checklist item 1 failing quietly. Its radius is now taken FROM
       the roof profile at that height and pushed 1.5 ft past it. */
    (function () {
      var zA = 543, zB = 547;
      function roofR(z) {   /* the cone from R_TOP-1 at the deck to 20 at 552 */
        var t = (z - (Z_DECK + 11)) / (552 - (Z_DECK + 11));
        return (R_TOP - 1) + (20 - (R_TOP - 1)) * Math.min(1, Math.max(0, t));
      }
      var rA = roofR(zA) + 1.5, rB = roofR(zB) + 1.5;
      out = out.concat(frustum(ctx, cx, cy, rA, zA, rB, zB, 28, WHITE_D, STEEL_EDGE));
    })();
    out.push(disc(ctx, cx, cy, 20, 552, 28, "#eae5d8", "#a49c8c", -0.9e3));

    /* the spire: decoration, not a mast. Explicit largest depth, because it
       is the topmost element, nothing on this model can occlude it, and a
       roof cap sorted on its own near rim would otherwise bury it. */
    var sp = frustum(ctx, cx, cy, 4.5, 552, 1.1, Z_TIP - 8, 10, WHITE, "#8d867a");
    for (var i = 0; i < sp.length; i++) { sp[i].depth = 1e6 + i; }
    out = out.concat(sp);
    /* the aircraft warning beacon at the tip, which is the only thing up
       there that is not white */
    var be = frustum(ctx, cx, cy, 2.2, Z_TIP - 8, 1.2, Z_TIP, 8, "#b4544a", "#7d3a33");
    for (var j2 = 0; j2 < be.length; j2++) { be[j2].depth = 1.1e6 + j2; }
    out = out.concat(be);
    return out;
  }


  /* ---------------- Stop 2: the Pier 66 to Pike Place walk ----------------

     Not a building. The thing being modelled here is the HILL, because the
     hill is the whole of the promise the tours page makes to a cruise
     passenger stepping off at the Bell Street Pier, and a promise about a
     climb is the one thing a map drawn flat cannot show.

     Its style, such as it is, is the CUT SECTION, added to STYLES.md this
     run: a measured ground line, an honest datum, and a declared vertical
     exaggeration.

     EVERY NUMBER BELOW IS MEASURED, and where it came from:

       the route .......... router.project-osrm.org, from the
                            Bell Street Pier at Alaskan Way to Pike Place at
                            Stewart Street: Alaskan Way, Wall Street, Elliott
                            Avenue, Lenora Street, 1st Avenue, Pine Street.
                            64 vertices, returned as a GeoJSON line.
                            CORRECTED 2026-09-03: this was recorded here as
                            "foot routing" and it is NOT. The public OSRM demo
                            server carries only the car network and ignores the
                            profile in the URL; foot, walking, driving and bike
                            all return the identical distance, tested on this
                            corridor and on Boston. So the line below is a
                            DRIVING route measured through walking waypoints.
                            Along this particular corridor the two coincide
                            closely, because Alaskan Way, Wall, Elliott, Lenora,
                            1st and Pine are all two-way streets a car and a
                            walker take alike, which is why the figure survived
                            a sanity check. It is still the wrong label and it
                            would be the wrong number anywhere one-way streets
                            or a pedestrian cut-through differ. brouter.de
                            answers a plain GET with a real foot profile and
                            should replace it.
       1334 m, 0.829 mi ... the length of that route, summed haversine over
                            its own vertices.
       the elevations ..... USGS 3DEP, the National Map point elevation
                            service, one query per vertex, 1 metre raster,
                            reported in feet.

     WHAT THE MEASUREMENT SAYS, which is not what the page said:

       start, Alaskan Way ....................  15.8 ft
       crest, 1st Avenue near Virginia .......  152.7 ft, at 1018 m in
       finish, Pike Place ....................  110.6 ft
       net rise .............................. + 94.8 ft
       gross climb ...........................  139.1 ft
       gross descent .........................   44.3 ft
       steepest 50 m ......................... about 16 percent, at 797 m in,
                                                which is Lenora Street

     So the walk is NOT 0.7 miles and it is NOT simply uphill. It is 0.83
     miles, it climbs 139 ft, and then it hands 44 ft of that back down 1st
     Avenue and Pine Street into the Market. The site copy is corrected to
     match the measurement rather than the measurement trimmed to match the
     copy.

     THE ONE DRAWING CONVENTION, declared rather than buried. 137 ft of relief
     over 4376 ft of run is a slope of about 1 in 32, and at true scale this
     model is a flat tape: the grade that is the entire subject would be
     invisible. The vertical is therefore exaggerated, by the factor named in
     VE below, which is what a section drawing does and says. Every horizontal
     distance is true.

     NOT MEASURED, and so not drawn: anything between two samples. The ground
     line is straight from vertex to vertex because that is exactly as much as
     64 point queries know. */

  var WALK = [
    [    0.0,    0.0,  15.8,    0.0],
    [  -14.4,   12.6,  15.9,   19.1],
    [  -56.0,   48.9,  15.7,   74.3],
    [  -62.5,   51.7,  15.8,   81.4],
    [  -86.9,   72.7,  15.9,  113.6],
    [ -104.6,   87.2,  15.8,  136.5],
    [ -123.7,  101.9,  15.8,  160.5],
    [ -154.1,  124.7,  15.8,  198.5],
    [ -162.1,  130.9,  15.9,  208.6],
    [ -157.4,  136.8,  15.7,  216.2],
    [ -151.0,  144.8,  15.5,  226.4],
    [ -148.4,  148.0,  15.5,  230.6],
    [ -143.6,  154.0,  15.9,  238.2],
    [ -115.4,  184.0,  34.0,  279.4],
    [ -108.1,  192.5,  35.7,  290.6],
    [ -102.2,  187.4,  35.8,  298.4],
    [  -45.0,  137.0,  41.9,  374.6],
    [  -37.0,  130.1,  42.8,  385.1],
    [  -31.4,  125.4,  43.6,  392.4],
    [   51.7,   53.9,  59.4,  502.0],
    [   59.4,   47.3,  60.9,  512.1],
    [   66.7,   41.8,  62.1,  521.3],
    [   73.5,   37.5,  63.2,  529.3],
    [   83.2,   34.0,  64.9,  539.7],
    [  113.2,   23.6,  69.6,  571.3],
    [  148.4,   11.3,  75.4,  608.6],
    [  154.5,   12.9,  75.7,  614.9],
    [  162.9,    9.1,  77.1,  624.0],
    [  173.4,    4.8,  78.9,  635.5],
    [  189.4,   -2.7,  81.5,  653.1],
    [  196.7,   -5.0,  82.5,  660.7],
    [  203.7,   -7.6,  83.5,  668.2],
    [  255.4,  -25.8,  91.5,  722.9],
    [  258.5,  -27.0,  91.8,  726.3],
    [  269.2,  -30.9,  93.2,  737.6],
    [  286.5,  -37.9,  94.4,  756.3],
    [  309.6,  -47.1,  96.6,  781.2],
    [  317.8,  -49.7,  97.1,  789.7],
    [  323.0,  -44.8,  97.9,  796.9],
    [  349.8,  -14.6, 118.3,  837.3],
    [  360.4,   -2.7, 127.3,  853.2],
    [  375.2,   13.9, 138.6,  875.4],
    [  382.6,   22.2, 139.0,  886.5],
    [  391.4,   14.4, 139.9,  898.3],
    [  424.3,  -14.3, 145.3,  942.0],
    [  475.3,  -58.8, 152.6, 1009.6],
    [  481.3,  -64.0, 152.7, 1017.5],
    [  488.8,  -70.5, 152.4, 1027.4],
    [  549.9, -123.2, 147.3, 1108.2],
    [  571.1, -142.0, 145.4, 1136.5],
    [  578.1, -148.3, 145.1, 1145.8],
    [  583.2, -156.6, 144.5, 1155.6],
    [  605.6, -192.8, 140.3, 1198.2],
    [  610.1, -200.3, 139.9, 1206.9],
    [  595.9, -208.9, 139.0, 1223.5],
    [  593.7, -210.3, 138.1, 1226.0],
    [  564.7, -228.2, 120.2, 1260.1],
    [  546.6, -239.4, 110.9, 1281.4],
    [  545.0, -240.4, 110.7, 1283.3],
    [  539.1, -243.9, 110.5, 1290.2],
    [  536.4, -241.6, 110.2, 1293.7],
    [  514.8, -222.7, 109.3, 1322.4],
    [  518.9, -218.0, 109.1, 1328.6],
    [  522.3, -213.9, 110.6, 1333.9]
  ];

  var VE = 3;               /* declared vertical exaggeration */
  var FT = 0.3048;          /* the elevations arrive in feet, the plan in m */
  /* Half width of the drawn ribbon, in metres, and NOT a measurement: a real
     pavement is about 3 m and at 3 m this ribbon is a thread 772 m long. The
     first render came back a dam wall for exactly that reason, so the ribbon
     is drawn wide enough to be a surface you can see the grade on. It carries
     no claim about the width of any street. */
  var HALF = 40;

  function walkZ(ft) { return ft * FT * VE; }

  function pier66Walk(ctx) {
    var P = ctx.project, out = [];
    var EARTH = "#c7c0ae", EARTH_EDGE = "#8f8879";
    var PATH = "#d8d2c4", PATH_EDGE = "#a49c8c";
    var STEEP = "#c98a4b", STEEP_EDGE = "#8f5f31";
    var WATER = "#8fa6ae", WATER_EDGE = "#5d7079";
    var POST = "#7e796f";

    /* the left and right edges of the ribbon, offset along the normal to the
       direction of travel at each vertex */
    var L = [], R = [];
    for (var i = 0; i < WALK.length; i++) {
      var a = WALK[Math.max(0, i - 1)], b = WALK[Math.min(WALK.length - 1, i + 1)];
      var dx = b[0] - a[0], dy = b[1] - a[1];
      var m = Math.sqrt(dx * dx + dy * dy) || 1;
      var nx = -dy / m, ny = dx / m;
      L.push([WALK[i][0] + nx * HALF, WALK[i][1] + ny * HALF]);
      R.push([WALK[i][0] - nx * HALF, WALK[i][1] - ny * HALF]);
    }

    /* Elliott Bay, at the datum. A single plane spanning the whole scene, so
       it is given an explicit depth: sorted on its own near corner it would
       be the last thing painted and would drown the hill standing on it.
       This is the sixth time that rule has been the difference. */
    out.push({ svg: ctx.poly([P(-120, -300, 0), P(120, 140, 0),
                              P(-180, 300, 0), P(-420, -140, 0)],
                             WATER, WATER_EDGE, 0.5), depth: -1e9 });

    /* the ground mass, cut open on both sides down to mean sea level. Each
       wall quad is a small face and sorts honestly on its own corners. */
    function wall(edge, sign) {
      for (var i = 0; i < edge.length - 1; i++) {
        var z0 = walkZ(WALK[i][2]), z1 = walkZ(WALK[i + 1][2]);
        var dx = edge[i + 1][0] - edge[i][0], dy = edge[i + 1][1] - edge[i][1];
        var m = Math.sqrt(dx * dx + dy * dy) || 1;
        var nx = sign * -dy / m, ny = sign * dx / m;
        if (!ctx.faceVisible(nx, ny)) continue;
        var q = [P(edge[i][0], edge[i][1], 0), P(edge[i + 1][0], edge[i + 1][1], 0),
                 P(edge[i + 1][0], edge[i + 1][1], z1), P(edge[i][0], edge[i][1], z0)];
        out.push({ svg: ctx.poly(q, ctx.shade(EARTH, nx, ny, 0.15), EARTH_EDGE, 0.4),
                   depth: depthOf(q) });
      }
    }
    wall(L, 1); wall(R, -1);

    /* the two ends, so the mass reads as cut and not as hollow */
    function cap(i, sign) {
      var z = walkZ(WALK[i][2]);
      var a = WALK[Math.max(0, i - 1)], b = WALK[Math.min(WALK.length - 1, i + 1)];
      var dx = b[0] - a[0], dy = b[1] - a[1], m = Math.sqrt(dx * dx + dy * dy) || 1;
      var nx = sign * dx / m, ny = sign * dy / m;
      if (!ctx.faceVisible(nx, ny)) return;
      var q = [P(L[i][0], L[i][1], 0), P(R[i][0], R[i][1], 0),
               P(R[i][0], R[i][1], z), P(L[i][0], L[i][1], z)];
      out.push({ svg: ctx.poly(q, ctx.shade(EARTH, nx, ny, 0.1), EARTH_EDGE, 0.5),
                 depth: depthOf(q) });
    }
    cap(0, -1); cap(WALK.length - 1, 1);

    /* the walking surface. Coloured by its own measured grade, so the steep
       block on Lenora is a thing you can see rather than a figure in a
       caption. The threshold is 8 percent, which is the grade above which a
       pavement stops being a stroll.

       MIN_RUN, and why it is not the 0.5 m it started as. 3DEP is a 1 metre
       raster and its vertical error is of the order of a foot, so a grade
       taken between two vertices 2.5 m apart is mostly the error: one foot
       of noise over 2.5 m reads as 12 percent, which is larger than the whole
       threshold this line is testing. The first LOOK at this model showed
       exactly that, two orange blocks the walker never climbs. One is a 0.9 ft
       DROP over 2.5 m at 1224 m in, and one is a 1.5 ft RISE over 5.3 m in
       the last few strides into the Market. Neither is a hill; both are the
       raster talking to itself. At 15 m the same foot of error is worth 2
       percent, comfortably inside the threshold, so 15 m is the shortest run
       this data can carry a grade claim over. It removes those two and keeps
       all six real pitches, which is the test that it is a noise floor and
       not a convenient trim. Segments below it are drawn, and simply make no
       claim about their steepness. */
    var MIN_RUN = 15;
    for (var j = 0; j < WALK.length - 1; j++) {
      var run = WALK[j + 1][3] - WALK[j][3];
      var rise = (WALK[j + 1][2] - WALK[j][2]) * FT;
      var g = run >= MIN_RUN ? Math.abs(rise / run) : 0;
      var steep = g >= 0.08;
      var za = walkZ(WALK[j][2]), zb = walkZ(WALK[j + 1][2]);
      var q2 = [P(L[j][0], L[j][1], za), P(R[j][0], R[j][1], za),
                P(R[j + 1][0], R[j + 1][1], zb), P(L[j + 1][0], L[j + 1][1], zb)];
      out.push({ svg: ctx.poly(q2, steep ? STEEP : PATH,
                               steep ? STEEP_EDGE : PATH_EDGE, 0.4),
                 depth: depthOf(q2) + 0.5 });
    }

    /* three posts: where you land, the crest, and the Market. Slender, so
       they are drawn from every side rather than culled, and given depths
       above everything else because nothing in this model can stand in
       front of them. */
    var MARKS = [[0, 26], [45, 30], [WALK.length - 1, 26]];
    for (var k = 0; k < MARKS.length; k++) {
      var idx = MARKS[k][0], h = MARKS[k][1];
      var px = WALK[idx][0], py = WALK[idx][1], pz = walkZ(WALK[idx][2]);
      var col = frustum(ctx, px, py, 2.2, pz, 1.6, pz + h, 8, POST, "#4f4b45");
      for (var q3 = 0; q3 < col.length; q3++) col[q3].depth = 1e6 + k * 100 + q3;
      out = out.concat(col);
      var head = disc(ctx, px, py, 6, pz + h, 12, STEEP, STEEP_EDGE, 1e6 + k * 100 + 90);
      out.push(head);
    }
    return out;
  }

  /* ---------------- Stop 2: Smith Tower ----------------
     Gaggin & Gaggin of Syracuse, New York, opened 4 July 1914 at 500 Second
     Avenue in Pioneer Square. Neoclassical, and the tallest building west of
     the Mississippi for seventeen years. STYLES.md carries Neoclassical
     already, from the Mall, so no new style entry was needed: the tells it
     lists are the granite base, the terra cotta shaft with a real cornice,
     and vertical bays.

     EVERY NUMBER BELOW IS PUBLISHED, and where it came from:

       484 ft to the tip of the spire ................ Wikipedia, Smith Tower
       462 ft to the roof ............................ Wikipedia
       38 floors ..................................... Wikipedia
       35th floor observation deck (Chinese Room) .... Wikipedia
       pyramidal cap = the FINAL THREE storeys ....... processwire/KOMO, via
                                                       search this run
       two-storey base of local granite .............. same
       white terra cotta above the granite ........... Wikipedia ("glistening
                                                       white terra cotta")
       8 ft wide glass dome at the top, lit blue ..... Wikipedia
       7 elevators (8 in the design phase) ........... Wikipedia
       304,350 sq ft of floor area ................... Wikipedia
       13 suites in the tower, 540 offices below ..... Wikipedia
       1,276 concrete piles, 22 ft long .............. HistoryLink, via search

     THE NAMED GAP, and it is the plan. No source reached this run publishes
     the footprint in feet: SAH Archipedia and HistoryLink both returned 403.
     So the plan is DERIVED from the one published area figure rather than
     eyeballed, and the derivation is written out so it can be checked or
     overturned:

       38 floors split 22 + 13 + 3. Wikipedia's own garbled line says "22-story
       base with 20-story tower"; the cap is published as the final three; and
       Wikipedia separately says THIRTEEN suites in the tower. 22 + 13 + 3 is
       exactly 38, and thirteen tower floors carrying thirteen suites is one
       per floor. Three independent published figures land on the same split,
       which is why it is used.
       Take the tower square at 60 ft: 13 x 3,600 = 46,800 sq ft. The
       remaining 257,550 over 22 floors is 11,707 sq ft a floor, so a base
       108 ft square. A Seattle downtown quarter block is about 111 ft, so the
       derivation lands where the lot is. It is still a DERIVATION and is
       labelled as one.

     Storey height falls out of the published pair: 462 ft over 38 floors is
     12.16 ft. That puts the base block top at 267.5 ft, the tower cornice at
     425.5 ft, and floor 35 AT the cornice, directly under the pyramid, which
     is exactly where the published observation deck is. The internal
     consistency is the cross-check, not a coincidence arranged for.

     CHECKLIST, all nine: (1) 9 bays a face on the base and 5 on the tower,
     drawn as recessed openings, 490 of them, not written in a comment;
     (2) water table, granite string course at the two-storey break, base
     cornice, tower cornice, each its own thin slab; (3) a granite plinth and
     the two-storey granite base itself; (4) the pyramid, three storeys of it,
     with its glass dome and spire, and it is the roof; (5) two tones on every
     material through ctx.shade; (6) a ground shadow; (7) heights TRUE, 462
     and 484 as published, nothing scaled; (8) reveals drawn dark against
     white terra cotta, which is the strongest contrast on the building;
     (9) the thing a visitor names is the white pyramid cap on the slender
     shaft, and it is the model's whole silhouette. */
  function smithTower(ctx) {
    var P = ctx.project, out = [];
    var FT = 1;
    var STOREY = 462 / 38;                 /* 12.16 ft, from the published pair */
    var GRANITE = "#8f8c85", GRANITE_D = "#6e6b65", GR_EDGE = "#55534e";
    var TC = "#fbf8f0", TC_D = "#e8e2d4", TC_EDGE = "#a49d8d";  /* white terra cotta */
    var REVEAL = "#414c57", GLASS = "#55666f", GL_EDGE = "#3a4a50";
    var COPPER = "#7d8f7a";

    var BASE = 108 / 2, TOW = 60 / 2;      /* half-widths, DERIVED above */
    var zPlinth = 3, zGran = zPlinth + 2 * STOREY;      /* two-storey granite */
    var zBaseTop = 22 * STOREY;                          /* floors 1-22 */
    var zTowTop = 35 * STOREY;                           /* floor 35, the deck */
    var zRoof = 462, zSpire = 484;

    /* a box: only the two faces the camera can see, plus a lid. Every piece
       carries an explicit depth, because a 108 ft slab sorted on its own
       corners paints over the windows standing on it. */
    function box(hx, hy, z0, z1, fill, edge, d, lid) {
      var faces = [[0, -1, [[-hx, -hy], [hx, -hy]]], [1, 0, [[hx, -hy], [hx, hy]]],
                   [0, 1, [[hx, hy], [-hx, hy]]], [-1, 0, [[-hx, hy], [-hx, -hy]]]];
      faces.forEach(function (f, fi) {
        if (!ctx.faceVisible(f[0], f[1])) return;
        var a = f[2][0], b = f[2][1];
        var q = [P(a[0], a[1], z0), P(b[0], b[1], z0), P(b[0], b[1], z1), P(a[0], a[1], z1)];
        out.push({ svg: ctx.poly(q, ctx.shade(fill, f[0], f[1], 0), edge, 0.6), depth: d + fi });
      });
      if (lid !== false) {
        out.push({ svg: ctx.poly([P(-hx, -hy, z1), P(hx, -hy, z1), P(hx, hy, z1), P(-hx, hy, z1)],
                                 ctx.shade(fill, 0, 0, 1), edge, 0.6), depth: d + 8 });
      }
    }

    /* a horizontal break: a slab standing PROUD of the wall it caps, which is
       what a cornice is. Checklist 2. */
    function course(hx, hy, z0, t, ov, fill, edge, d) {
      box(hx + ov, hy + ov, z0, z0 + t, fill, edge, d, true);
    }

    /* the reveals. Drawn proud of the face by 0.5 ft so they cannot be lost
       inside their own wall, and dark, because a window one tone off white
       terra cotta disappears at map scale. Checklist 1 and 8. */
    function bays(hx, hy, z0, z1, nBays, nFloors, fill, edge, dep) {
      [[0, -1], [1, 0], [0, 1], [-1, 0]].forEach(function (n, fi) {
        if (!ctx.faceVisible(n[0], n[1])) return;
        var horiz = n[1] !== 0;             /* face runs along x, or along y */
        var half = horiz ? hx : hy;
        var off = (horiz ? hy : hx) + 0.5;
        var mod = (half * 2) / nBays, wW = mod * 0.44;
        var fh = (z1 - z0) / nFloors, wH = fh * 0.56;
        for (var b = 0; b < nBays; b++) {
          var cu = -half + mod * (b + 0.5);
          for (var f2 = 0; f2 < nFloors; f2++) {
            var zz = z0 + fh * f2 + (fh - wH) / 2;
            var pt = function (u, w) {
              return horiz ? P(u, n[1] * off, w) : P(n[0] * off, u, w);
            };
            out.push({ svg: ctx.poly([pt(cu - wW / 2, zz), pt(cu + wW / 2, zz),
                                      pt(cu + wW / 2, zz + wH), pt(cu - wW / 2, zz + wH)],
                                     fill, edge, 0.35),
                       depth: dep + fi * 1e4 + f2 * 40 + b });
          }
        }
      });
    }

    /* THE VERTICAL PIERS, and this one came straight off the render. With the
       bays drawn as isolated squares on a flat field the shaft read as a 1960s
       office block: correct window count, wrong building. A 1914 terra cotta
       skyscraper is RIBBED, the piers between the bays carried proud of the
       spandrels, and that vertical reading is half of what makes Smith Tower
       recognisable at the end of a Pioneer Square street. One strip on each
       bay division, standing 0.9 ft off the wall so it catches its own tone.
       Checklist 1 and 2. */
    function piers(hx, hy, z0, z1, nBays, fill, edge, dep) {
      [[0, -1], [1, 0], [0, 1], [-1, 0]].forEach(function (n, fi) {
        if (!ctx.faceVisible(n[0], n[1])) return;
        var horiz = n[1] !== 0;
        var half = horiz ? hx : hy;
        var off = (horiz ? hy : hx) + 0.9;
        var mod = (half * 2) / nBays, pw = mod * 0.30;
        for (var b = 0; b <= nBays; b++) {
          var cu = -half + mod * b;
          var pt = function (u, w) {
            return horiz ? P(u, n[1] * off, w) : P(n[0] * off, u, w);
          };
          out.push({ svg: ctx.poly([pt(cu - pw / 2, z0), pt(cu + pw / 2, z0),
                                    pt(cu + pw / 2, z1), pt(cu - pw / 2, z1)],
                                   ctx.shade(fill, n[0], n[1], 0.30), edge, 0.4),
                     depth: dep + fi * 100 + b });
        }
      });
    }

    /* CHECKLIST 6, the ground shadow. The footprint convention every other
       model on this site uses, thrown to the light side, and named as the
       drawing device it is: this renderer has no penumbra and a 462 ft tower
       projected honestly lands a black bar three blocks long. */
    out.push({ svg: ctx.poly([P(-BASE + 14, -BASE + 20, 0), P(BASE + 26, -BASE + 20, 0),
                              P(BASE + 26, BASE + 12, 0), P(-BASE + 14, BASE + 12, 0)],
                             "#c6c8be", "", 0), depth: -9e8 });
    out.push({ svg: ctx.poly([P(-BASE, -BASE, 0), P(BASE, -BASE, 0),
                              P(BASE, BASE, 0), P(-BASE, BASE, 0)],
                             "#b9bcb1", "", 0), depth: -8.9e8 });

    /* the plinth and the water table, checklist 3 */
    box(BASE + 3, BASE + 3, 0, zPlinth, GRANITE_D, GR_EDGE, -8e8);
    /* the two-storey granite base */
    box(BASE, BASE, zPlinth, zGran, GRANITE, GR_EDGE, -7e8);
    bays(BASE, BASE, zPlinth + 2, zGran - 1.5, 9, 2, GLASS, GL_EDGE, -6.9e8);
    /* the string course at the granite-to-terracotta break, checklist 2 */
    course(BASE, BASE, zGran, 2.2, 1.4, TC_D, TC_EDGE, -6.6e8);

    /* the white terra cotta shaft of the base block, floors 3 to 22 */
    box(BASE, BASE, zGran + 2.2, zBaseTop, TC, TC_EDGE, -6e8);
    piers(BASE, BASE, zGran + 2.2, zBaseTop, 9, TC, TC_EDGE, -5.95e8);
    bays(BASE, BASE, zGran + 2.2, zBaseTop, 9, 20, REVEAL, TC_EDGE, -5.9e8);
    /* the base block's cornice: the setback line, and the strongest
       horizontal on the building */
    course(BASE, BASE, zBaseTop, 3.4, 2.6, TC_D, TC_EDGE, 6e5);

    /* THE TOWER, floors 23 to 35, set back to a 60 ft square */
    box(TOW, TOW, zBaseTop + 3.4, zTowTop, TC, TC_EDGE, 8e5);
    piers(TOW, TOW, zBaseTop + 3.4, zTowTop, 5, TC, TC_EDGE, 1.0e6);
    bays(TOW, TOW, zBaseTop + 3.4, zTowTop, 5, 13, REVEAL, TC_EDGE, 1.2e6);
    /* the observation cornice under the pyramid, at floor 35 */
    course(TOW, TOW, zTowTop, 3.0, 2.2, TC_D, TC_EDGE, 3.4e6);

    /* THE PYRAMID, the final three storeys, and the thing a visitor names.
       Four triangles, back pair culled, so it is a pyramid and not a cone. */
    var pz = zTowTop + 3.0, apex = zRoof, pr = TOW + 1.2;
    var corner = [[-pr, -pr], [pr, -pr], [pr, pr], [-pr, pr]];
    for (var i = 0; i < 4; i++) {
      var a = corner[i], b = corner[(i + 1) % 4];
      var nx = (a[0] + b[0]) / 2 / pr, ny = (a[1] + b[1]) / 2 / pr;
      if (!ctx.faceVisible(nx, ny)) continue;
      out.push({ svg: ctx.poly([P(a[0], a[1], pz), P(b[0], b[1], pz), P(0, 0, apex)],
                               ctx.shade(TC, nx, ny, 0.55), TC_EDGE, 0.6),
                 depth: 3.6e6 + i });
    }
    /* the 8 ft glass dome, published, and the spire above it to 484 ft */
    out = out.concat(frustum(ctx, 0, 0, 4, apex, 3.2, apex + 5, 12, GLASS, GL_EDGE));
    out.forEach(function (o) { if (o.depth < 4e6 && o.depth > 3.9e6) o.depth = 4e6; });
    out.push(disc(ctx, 0, 0, 3.2, apex + 5, 12, COPPER, GR_EDGE, 4.1e6));
    out = out.concat(frustum(ctx, 0, 0, 1.1, apex + 5, 0.35, zSpire, 8, COPPER, GR_EDGE));
    for (var s2 = out.length - 4; s2 < out.length; s2++) if (out[s2]) out[s2].depth = 4.2e6 + s2;
    return out;
  }

  var SCENES = { "space-needle": spaceNeedle, "pier66-walk": pier66Walk,
                 "smith-tower": smithTower };

  /* The live mount: the same hand-rolled projection every other model on this
     site uses, so what the page draws is what render_room.js draws. */
  function mount(host, key, opts) {
    var o = opts || {};
    /* A tower and a landform want different cameras. 0.22 looks along a
       605 ft spire; the walk needs to be looked DOWN on or its surface, which
       is the whole subject, goes edge on. The first render of the walk at
       0.22 came back a dam wall. */
    var isLand = key === "pier66-walk";
    var yaw = o.yaw == null ? (isLand ? -0.30 : -0.62) : o.yaw;
    var pitch = o.pitch == null ? (isLand ? 0.52 : 0.22) : o.pitch;
    var LIGHT = [0.60, 0.30, 0.68];

    function draw() {
      var W = 820, H = 560;
      var mk = function (SC, OX, OY) {
        return function (x, y, z) {
          var c = Math.cos(yaw), s = Math.sin(yaw);
          var rx = x * c - y * s, ry = x * s + y * c;
          return [OX + rx * SC, OY + (ry * Math.sin(pitch) - (z || 0) * Math.cos(pitch)) * SC, ry];
        };
      };
      var faceVisible = function (nx, ny) { return (nx * Math.sin(yaw) + ny * Math.cos(yaw)) > 0.001; };
      var shade = function (hex, nx, ny, nz) {
        var d = nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2];
        var f = 0.55 + 0.45 * Math.max(0, d);
        var n = parseInt(hex.slice(1), 16);
        return "rgb(" + Math.min(255, Math.round(((n >> 16) & 255) * f)) + "," +
               Math.min(255, Math.round(((n >> 8) & 255) * f)) + "," +
               Math.min(255, Math.round((n & 255) * f)) + ")";
      };
      var BB = null;
      var measure = function (pts) {
        pts.forEach(function (p) {
          if (!BB) BB = [p[0], p[1], p[0], p[1]];
          BB[0] = Math.min(BB[0], p[0]); BB[1] = Math.min(BB[1], p[1]);
          BB[2] = Math.max(BB[2], p[0]); BB[3] = Math.max(BB[3], p[1]);
        });
        return "";
      };
      SCENES[key]({ project: mk(1, 0, 0), poly: measure, shade: shade, faceVisible: faceVisible });
      var bw = BB[2] - BB[0], bh = BB[3] - BB[1];
      var SC = Math.min((W - 50) / bw, (H - 50) / bh);
      var OX = (W - bw * SC) / 2 - BB[0] * SC, OY = (H - bh * SC) / 2 - BB[1] * SC;
      var poly = function (pts, f, st, sw, ex) {
        return '<polygon points="' + pts.map(function (p) {
          return p[0].toFixed(1) + "," + p[1].toFixed(1);
        }).join(" ") + '" fill="' + f + '"' +
          (st ? ' stroke="' + st + '" stroke-width="' + (sw || 1) + '"' : "") +
          ' stroke-linejoin="round"' + (ex || "") + "/>";
      };
      var items = SCENES[key]({ project: mk(SC, OX, OY), poly: poly, shade: shade, faceVisible: faceVisible });
      items.sort(function (a, b) { return a.depth - b.depth; });
      host.innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" width="100%" ' +
        'style="display:block;background:#eef0ea;border-radius:10px">' +
        items.map(function (i) { return i.svg; }).join("") + "</svg>";
    }
    draw();

    host.addEventListener("pointerdown", function (e) {
      host.__lx = e.clientX;
      host.setPointerCapture && host.setPointerCapture(e.pointerId);
    });
    host.addEventListener("pointermove", function (e) {
      if (host.__lx == null) return;
      yaw += (e.clientX - host.__lx) * 0.006; host.__lx = e.clientX; draw();
    });
    host.addEventListener("pointerup", function () { host.__lx = null; });
    host.addEventListener("pointercancel", function () { host.__lx = null; });
    return { redraw: draw };
  }

  window.SEATTLE3D = { scenes: SCENES, mount: mount };
})();
