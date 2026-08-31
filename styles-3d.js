/* styles-3d.js  ·  the styles book, the half a model can execute
   =============================================================
   A model of a real building is only as good as the vocabulary it is drawn
   with. Draw the Brooklyn Bridge's openings as triangles and you have not
   drawn the Brooklyn Bridge, you have drawn a trestle: the towers are Gothic
   Revival, and a Gothic arch is not a triangle, it is two circular arcs.

   So the rules live here, once, where every model can reach them, instead of
   being re-guessed per building. STYLES.md is the same book written for a
   person; this is the part the browser runs. Everything here is plain
   geometry returning plain points, no library, no dependency, and no opinion
   about how it gets shaded.

   Loaded BEFORE any model script. window.STYLES3D.
*/
(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     THE POINTED ARCH, which is the whole reason this file exists.

     A Gothic arch is TWO-CENTRED. Each side is a circular arc struck from a
     centre that sits on the springing line on the OPPOSITE side of the
     centreline, so the two arcs lean into each other and meet at a point.
     The single fact that makes it look right is that the curve is steepest
     at the springing and flattest near the apex, the exact opposite of the
     straight line most people reach for.

     Given half-width a and rise h (springing to apex), the centre offset is
     forced, there is nothing to taste:

         R = a + d,  and the apex must lie on the arc, so
         d² + h² = (a + d)²      →      d = (h² - a²) / 2a

     That formula is worth reading twice, because it contains the whole
     family of arches and tells you which one you are drawing:

         h = a           d = 0        the two centres merge: a SEMICIRCLE.
                                      This is the Roman and Romanesque arch,
                                      and it falls out of the Gothic formula
                                      as the case where the point disappears.
         h < a                        SEGMENTAL, flatter than a half circle.
         a < h < a√3                  DROP arch: pointed, but blunt.
         h = a√3 ≈ 1.732a             EQUILATERAL: the textbook Gothic arch,
                                      centres exactly at the far springings.
         h > a√3                      LANCET: the sharp one. Cathedral windows,
                                      and the Brooklyn Bridge.

     Expressed against the full WIDTH instead of the half, the number to
     carry in your head is rise ÷ width: 0.5 is round, 0.866 is equilateral,
     anything above that is a lancet.
     --------------------------------------------------------------------- */

  function archFamily(width, rise) {
    var a = width / 2, r = rise / a;
    if (r < 0.98) return "segmental";
    if (r < 1.02) return "semicircular";
    if (r < 1.70) return "drop";
    if (r < 1.77) return "equilateral";
    return "lancet";
  }

  /* Points along a two-centred arch, left springing to apex to right
     springing. Returned in the arch's own 2D frame: u across the opening
     (0 at the centreline, ±width/2 at the jambs), v up from the springing
     line. The caller places that frame in the world, so the same function
     serves a bridge portal, a window, and a cloister. */
  function pointedArch(width, rise, steps) {
    var a = width / 2;
    var n = Math.max(6, steps || 18);
    if (rise <= 0) return [[-a, 0], [a, 0]];

    var d = (rise * rise - a * a) / (2 * a);   /* centre offset, may be < 0 */
    var R = a + d;
    var pts = [];

    /* Left half: struck from the RIGHT centre at u = +d. It runs from the
       left springing (-a, 0) up to the apex (0, rise). Sweeping by angle
       rather than by u keeps the points even along the curve, which is what
       stops a coarse arc from showing its corners. */
    var a0 = Math.atan2(0, -a - d);            /* angle to the left springing */
    var a1 = Math.atan2(rise, -d);             /* angle to the apex           */
    for (var i = 0; i <= n; i++) {
      var t = a0 + (a1 - a0) * (i / n);
      pts.push([d + R * Math.cos(t), R * Math.sin(t)]);
    }
    /* Right half is the mirror, apex already present so start past it. */
    for (var j = n - 1; j >= 0; j--) pts.push([-pts[j][0], pts[j][1]]);
    return pts;
  }

  /* The full opening: vertical jambs up to the springing, then the arch.
     Real portals are mostly straight wall; the curve is the last third. */
  function archedOpening(width, totalHeight, springRatio, steps) {
    var a = width / 2;
    var spring = totalHeight * (springRatio == null ? 0.62 : springRatio);
    var pts = [[-a, 0], [-a, spring]];
    pointedArch(width, totalHeight - spring, steps).forEach(function (p) {
      pts.push([p[0], spring + p[1]]);
    });
    pts.push([a, 0]);
    return pts;
  }

  /* Voussoirs: the wedge stones radiating from the arch centres. Drawing
     them is the difference between a cut hole and cut stone. Returns joint
     lines, each from the intrados out to the extrados along a true radius,
     which is why they fan instead of staying parallel. */
  function voussoirs(width, rise, depth, count) {
    var a = width / 2;
    var d = (rise * rise - a * a) / (2 * a);
    var R = a + d, out = R + (depth || width * 0.16);
    var n = count || 9, lines = [];
    [1, -1].forEach(function (side) {
      var cu = side * d;                        /* centre for THIS half */
      var a0 = Math.atan2(0, (-side) * a - cu);   /* to the near springing */
      var a1 = Math.atan2(rise, -cu);           /* to the apex           */
      for (var i = 0; i <= n; i++) {
        var t = a0 + (a1 - a0) * (i / n);
        lines.push([[cu + R * Math.cos(t), R * Math.sin(t)],
                    [cu + out * Math.cos(t), out * Math.sin(t)]]);
      }
    });
    return lines;
  }

  /* ---------------------------------------------------------------------
     ANCIENT EGYPTIAN, and its tell is as decisive as the pointed arch.

     BATTER. An Egyptian wall is not vertical. It leans inward as it rises,
     and that single fact is what makes a drawing read as Egyptian rather
     than as a shed. Draw a pylon with plumb walls and you have drawn a
     billboard. The batter is usually given as a run-to-rise ratio; a pylon
     leans harder than a temple wall, which is why the gate reads heavier
     than the building behind it even when it is smaller.

     CAVETTO CORNICE. The top is not a flat cap. It flares outward in a
     hollow quarter-round, and underneath it runs a TORUS, a projecting
     roll moulding, usually carved as a bound reed bundle. Cavetto plus
     torus is the signature; either one alone looks wrong.

     Together they give the profile every Egyptian building shares: leaning
     in all the way up, then throwing outward at the very top.
     --------------------------------------------------------------------- */

  /* Horizontal inset of a battered wall at height v, given its full height
     and the lean at the top. Returns how far the face has drawn in. */
  function batter(v, height, lean) {
    if (height <= 0) return 0;
    return (lean == null ? 0.08 : lean) * height * (v / height);
  }

  /* The cavetto profile: a hollow quarter-round flaring OUT as it rises.
     Returns [outward, up] pairs from the bottom of the flare to the top,
     scaled to the given projection and rise. The curve is a quarter circle,
     which is what makes it read as hollow rather than as a chamfer. */
  function cavetto(project, rise, steps) {
    var n = Math.max(4, steps || 8), pts = [];
    for (var i = 0; i <= n; i++) {
      var t = (i / n) * (Math.PI / 2);
      pts.push([project * (1 - Math.cos(t)), rise * Math.sin(t)]);
    }
    return pts;
  }

  /* ---------------------------------------------------------------------
     ART DECO MASSING, the other style on the map.

     A 1930s New York tower is shaped by the 1916 zoning resolution: above a
     fixed height the building must step back to let light reach the street,
     which is why the skyline of that decade is ziggurats rather than boxes.
     The vertical piers are the second tell. Deco articulates a facade in
     unbroken vertical strips of pier and recessed spandrel, so the eye is
     pulled up the whole height; a Deco tower drawn with horizontal banding
     reads as 1960s office and the century is wrong.
     --------------------------------------------------------------------- */

  function setbackProfile(stages) {
    /* stages: [[heightFt, halfWidthFt, halfDepthFt], ...] bottom to top. */
    return (stages || []).map(function (s) {
      return { h: s[0], w: s[1], d: s[2] == null ? s[1] : s[2] };
    });
  }

  /* Even vertical pier centres across a face, the Deco rhythm. */
  function pierRhythm(halfWidth, count) {
    var n = Math.max(2, count || 8), out = [];
    for (var i = 0; i < n; i++) out.push(-halfWidth + (2 * halfWidth) * (i + 0.5) / n);
    return out;
  }

  /* ---------------------------------------------------------------------
     MATERIALS. Stone is never one flat colour, and the cheapest possible
     realism is a top face lighter than a side face, because that is what
     daylight does. These are base colours; the model's own shader darkens
     them by face normal.
     --------------------------------------------------------------------- */
  var PALETTE = {
    granite:          { base: "#8d8b86", edge: "#6d6a65" },
    limestone:        { base: "#c9c0ad", edge: "#a79c86" },
    indianaLimestone: { base: "#d8d2c2", edge: "#b3aa96" },
    steelCable:       { base: "#6f7378", edge: "#4b4e52" },
    aluminium:        { base: "#b9bec4", edge: "#8d9298" },
    roadway:          { base: "#5a5a5c", edge: "#3f3f41" },
    nubianSandstone:  { base: "#c2a882", edge: "#9a8464" },
    poolWater:        { base: "#aebfc7", edge: "#8fa3ad" },
    timberDeck:       { base: "#8a6f52", edge: "#66513b" }
  };
  /* ---------------------------------------------------------------------
     THE BOOK ITSELF, the machine-readable index. A model declares the style
     it is drawn in, and this is what that declaration means.
     --------------------------------------------------------------------- */
  var BOOK = {
    "gothic-revival": {
      name: "Gothic Revival",
      period: "1740s to 1900s; the Brooklyn Bridge towers, 1869 to 1883",
      arch: "two-centred pointed",
      tells: ["pointed openings struck as arcs, never straight lines",
              "load carried on piers, so a wall reads as pier, opening, pier",
              "vertical emphasis, the opening taller than it is wide",
              "visible stone coursing and radiating voussoirs"],
      materials: ["granite", "limestone"],
      wrongIf: "the opening is a triangle, a rectangle, or a half circle"
    },
    "art-deco": {
      name: "Art Deco",
      period: "1920s to 1930s; the Empire State Building, 1930 to 1931",
      massing: "setback ziggurat, from the 1916 zoning resolution",
      tells: ["unbroken vertical piers with recessed spandrels between",
              "the mass steps back as it rises, several times",
              "a crown treated as ornament, not as a roof",
              "metal used as trim against pale stone"],
      materials: ["indianaLimestone", "aluminium"],
      wrongIf: "the facade bands horizontally, or the tower is one plain box"
    },
    "egyptian": {
      name: "Ancient Egyptian",
      period: "here: the Temple of Dendur, begun about 23 BC under Augustus",
      tells: ["walls BATTER, leaning inward as they rise, never plumb",
              "a cavetto cornice flares outward at the top, over a torus roll",
              "a pylon gate is two battered masses flanking the opening",
              "columns carry plant capitals and are joined by screen walls",
              "wall surfaces are carved in low relief, not left blank"],
      materials: ["sandstone"],
      wrongIf: "the walls are vertical, or the top is a flat cap"
    },
    "beaux-arts": {
      name: "Beaux-Arts",
      period: "1880s to 1920s; the Met's Fifth Avenue front, 1902",
      arch: "semicircular, on paired columns",
      tells: ["symmetry about a central axis, strictly",
              "a heavy rusticated base under a lighter upper order",
              "paired columns, deep cornice, sculpture held in the wall",
              "round arches, a Gothic point here is a century out"],
      materials: ["limestone", "indianaLimestone"],
      wrongIf: "it is asymmetric, or the arches are pointed"
    }
  };

  window.STYLES3D = {
    archFamily: archFamily,
    pointedArch: pointedArch,
    archedOpening: archedOpening,
    voussoirs: voussoirs,
    batter: batter,
    cavetto: cavetto,
    setbackProfile: setbackProfile,
    pierRhythm: pierRhythm,
    PALETTE: PALETTE,
    BOOK: BOOK
  };
})();
