/* dc-form-hirshhorn.js: the Hirshhorn Museum and Sculpture Garden.
 *
 * Rebuilt to MODEL_STANDARD.md. What stood here before was the generic
 * "drum" form: a squat 12-sided plug with a 16-sided lid on top, solid all
 * the way through. The Hirshhorn is a HOLLOW ring lifted off the ground on
 * four piers, and a solid cylinder is a lie about the one building on the
 * Mall whose whole idea is the hole in the middle.
 *
 * RESEARCH, every number with a source checked this run.
 *
 * DIMENSIONS (published, Wikipedia's technical section,
 * https://en.wikipedia.org/wiki/Hirshhorn_Museum_and_Sculpture_Garden):
 *   - "Building is 231 feet (70 m) in diameter"   -> outer radius 115.5 ft
 *   - "Building is 82 feet (25 m) high, elevated 14 feet (4.3 m) on four
 *     massive, sculptural piers"                  -> drum spans z 14 to 96
 *   - "interior court, 115 feet (35 m)"           -> inner radius 57.5 ft
 *   - "fountain, 60 feet (18 m)"                  -> fountain radius 30 ft
 *   - "2.7 acres (1.1 ha) around and under the museum building" -> the plaza
 *   - "Building and walls surfaced with precast concrete aggregate of
 *     'Swenson' pink granite" -> the warm pink-grey of every photograph
 *   - "Second- and third-floor galleries have 15-foot-high walls, with
 *     exposed 3-foot-deep coffered ceilings" -> 18 ft of gallery per level
 *
 * THE FACADE (published, aviewoncities.com/washington/hirshhorn-museum
 * checked this run): "A windowless outer wall, save for a third-floor
 * balcony facing the Mall, is balanced out by an interior circle flush with
 * natural lighting"; the courtyard facade is "defined by large rectangular
 * windows". So: blank stone outside, glass inside, one recess on the north.
 * Architect Gordon Bunshaft of SOM; opened 1974.
 *
 * NAMED GAPS, guessed nowhere, stated here rather than buried:
 *   - the PIERS' plan positions and sizes are not published in any source
 *     reached this run, only that there are four and that they are massive
 *     and sculptural. Four are drawn, 34 ft square, on the ring's mid-radius
 *     at the four diagonals: that is an assumption, on its own line, chosen
 *     because photographs from the Mall show two piers framing the opening
 *     symmetrically rather than one dead centre.
 *   - the FLOOR HEIGHTS inside the drum are not published as levels. The two
 *     reveal lines are 82 ft divided in three, a derivation from the
 *     published three-storey drum, not a measurement.
 *   - the BALCONY's width is not published. Drawn as a 46-degree arc
 *     centred on north: an assumption, on its own line.
 *   - whether the inner court is CONCENTRIC with the outer drum is not
 *     published in any source reached this run. Drawn concentric.
 *   - the ground-level lobby volume under the drum is not documented in the
 *     sources reached, so nothing is invented there; the plaza runs under
 *     the building, which is the view every photograph shows.
 *
 * FRAME. u runs east, v runs north, z up, all in feet. North is the Mall
 * side and carries the balcony, and the offline renderer's default yaw looks
 * at north faces, so nothing is flipped.
 *
 * PAINT. The trap here is not a slab, it is a RING. The courtyard's far
 * inner wall must paint before the top ring, which must paint before the
 * near outer wall. All three sort correctly on their own nearest point, so
 * every piece is emitted as its own quad rather than as one big polygon:
 * a single ring-top polygon would have covered the courtyard entirely.
 */
(function () {
  var H = window.DC3D.helpers;
  window.DC_FORMS = window.DC_FORMS || {};
  window.DC_FORMS['hirshhorn'] = function (ctx, p, s, VE) {
    var P = ctx.project, items = [];
    var FT = (p.h * VE) / 82;         /* metres per foot: 82 ft lands on p.h */
    var m  = FT * s;
    function pt(u, v, z) { return P(p.x + u * m, p.y + v * m, z * FT); }

    /* ---------- published geometry, in feet ---------- */
    var R    = 115.5;   /* 231 ft diameter */
    var RI   = 57.5;    /* 115 ft interior court */
    var ZP   = 14;      /* elevated 14 ft on the piers */
    var ZT   = ZP + 82; /* 82 ft high */
    var FR   = 30;      /* 60 ft fountain */
    var Z1   = ZP + 82 / 3, Z2 = ZP + 2 * 82 / 3;   /* derived, see header */
    var HB   = 15 * Math.PI / 180;                  /* assumed balcony half-arc */
    var N    = 44;      /* sides: round at every size this map draws */

    /* ---------- materials: two tones come from ctx.shade ---------- */
    var GRAN  = "#c6b0a3";   /* Swenson pink granite aggregate precast */
    var GRAND = "#ab9488";   /* the same mix, one tone down, for the coping */
    var PIER  = "#7d736a";   /* the piers, which stand in the drum's own shade all day */
    var RECES = "#8d7568";   /* the balcony recess, always in its own shade */
    var GLASS = "#4b5a63";   /* the courtyard's large rectangular windows */
    var WATER = "#a8bcc4";
    var PAVE  = "#d9d2c6";

    function push(q, fill, nu, nv, nz, bias, sealed) {
      var f = ctx.shade(fill, nu, nv, nz || 0);
      items.push({ svg: ctx.poly(q, f, sealed === false ? null : f, 0.7),
                   depth: H.depthOf(q) + (bias || 0) });
    }
    function a(i) { return (i / N) * Math.PI * 2; }
    function cyl(u, r, z) { return [r * Math.cos(u), r * Math.sin(u), z]; }
    /* angular distance from north, for the balcony arc */
    function offNorth(u) {
      var d = Math.abs(u - Math.PI / 2);
      return Math.min(d, Math.PI * 2 - d);
    }

    /* a flat ring lying in the z plane, one quad per segment so the hole
       stays a hole. A single polygon here would paint the courtyard shut. */
    function ring(rOut, rIn, z, fill, depth, test) {
      for (var i = 0; i < N; i++) {
        var u0 = a(i), u1 = a(i + 1);
        if (test && !test((u0 + u1) / 2)) continue;
        var q = [pt(rOut * Math.cos(u0), rOut * Math.sin(u0), z),
                 pt(rOut * Math.cos(u1), rOut * Math.sin(u1), z),
                 pt(rIn  * Math.cos(u1), rIn  * Math.sin(u1), z),
                 pt(rIn  * Math.cos(u0), rIn  * Math.sin(u0), z)];
        var f = ctx.shade(fill, 0, 0, 1);
        items.push({ svg: ctx.poly(q, f, f, 0.7),
                     depth: depth === undefined ? H.depthOf(q) : depth });
      }
    }
    function disc(r, z, fill, depth) {
      var q = [];
      for (var i = 0; i < N; i++) q.push(pt(r * Math.cos(a(i)), r * Math.sin(a(i)), z));
      var f = ctx.shade(fill, 0, 0, 1);
      items.push({ svg: ctx.poly(q, f, f, 0.7),
                   depth: depth === undefined ? H.depthOf(q) : depth });
    }
    /* one wall band of a cylinder. outward true faces away from the centre
       (the blank street wall), false faces the courtyard. */
    function wall(r, z0, z1, fill, outward, test, bias) {
      for (var i = 0; i < N; i++) {
        var u0 = a(i), u1 = a(i + 1), um = (u0 + u1) / 2;
        if (test && !test(um)) continue;
        var nx = Math.cos(um) * (outward ? 1 : -1), ny = Math.sin(um) * (outward ? 1 : -1);
        if (!ctx.faceVisible(nx, ny)) continue;
        push([pt(r * Math.cos(u0), r * Math.sin(u0), z0),
              pt(r * Math.cos(u1), r * Math.sin(u1), z0),
              pt(r * Math.cos(u1), r * Math.sin(u1), z1),
              pt(r * Math.cos(u0), r * Math.sin(u0), z1)],
             fill, nx, ny, 0, bias);
      }
    }
    /* a rectangular pier, drawn as a box */
    function box(cu, cv, w, d, z0, h, fill) {
      var hu = w / 2, hv = d / 2;
      var lo = [[cu-hu,cv-hv],[cu+hu,cv-hv],[cu+hu,cv+hv],[cu-hu,cv+hv]];
      var nrm = [[0,-1],[1,0],[0,1],[-1,0]];
      for (var i = 0; i < 4; i++) {
        if (!ctx.faceVisible(nrm[i][0], nrm[i][1])) continue;
        var j = (i + 1) % 4;
        push([pt(lo[i][0],lo[i][1],z0), pt(lo[j][0],lo[j][1],z0),
              pt(lo[j][0],lo[j][1],z0+h), pt(lo[i][0],lo[i][1],z0+h)],
             fill, nrm[i][0], nrm[i][1], 0, 0);
      }
    }

    /* ---------- 1. the plaza, its shadow, and the fountain ---------- */
    /* the plaza is excluded from the camera fit (depth below -1e9+1.5) so a
       2.7 acre pad cannot shrink the building into a speck, the mistake the
       whole-Mall fit made once already */
    disc(194, 0.15, PAVE, -1e9 + 1.0);   /* 2.7 acres is r = 194 ft; r = 150 was 1.62 acres, a cited number the drawing did not keep */
    ring(R * 1.12, RI * 0.99, 0.05, "#a49d92", -1e9 + 2.0);   /* the shadow the drum throws on the plaza, a RING: the courtyard is open to the sky */
    /* The dark under-drum. LOOKING is what forced this: with the ground
       beneath the building drawn the same tone as the plaza, the 14 ft of
       daylight under the ring vanished and an 82 ft drum on legs read as a
       tyre lying on the grass. What a photograph actually shows through
       that gap is deep shade, so deep shade is what is drawn. */
    ring(R * 1.005, RI, 0.10, "#6d6760", -1e9 + 2.2);
    disc(FR, 0.55, WATER, -1e9 + 2.4);

    /* ---------- 2. the four piers ---------- */
    var RP = (R + RI) / 2;
    [45, 135, 225, 315].forEach(function (deg) {
      var u = deg * Math.PI / 180;
      box(RP * Math.cos(u), RP * Math.sin(u), 34, 34, 0, ZP, PIER);
    });

    /* ---------- 3. the courtyard wall, glazed, painted first ---------- */
    wall(RI, ZP, ZT, GRAN, false, null, 0);
    /* the large rectangular windows of the interior circle, on the two
       gallery levels, held just inside the wall so they paint over it */
    wall(RI - 0.6, Z1 + 4.5, Z2 - 4.5, GLASS, false, null, 0.12);
    wall(RI - 0.6, Z2 + 4.5, ZT - 8.0, GLASS, false, null, 0.12);

    /* ---------- 4. the ring's top ---------- */
    ring(R, RI, ZT, GRAN);

    /* ---------- 5. the blank outer wall ---------- */
    var notBalcony = function (u) { return offNorth(u) > HB; };
    var isBalcony  = function (u) { return offNorth(u) <= HB; };
    wall(R, ZP, ZT, GRAN, true, notBalcony, 0);
    /* on the Mall side the top level opens: wall up to the third floor, a
       low parapet, and behind it the recess */
    wall(R - 7, Z2, ZT, RECES, true, isBalcony, 0);
    wall(R, ZP, Z2, GRAN, true, isBalcony, 0);
    wall(R, Z2, Z2 + 3.5, GRAN, true, isBalcony, 0.10);
    ring(R, R - 7, Z2 + 3.5, RECES, undefined, isBalcony);   /* the balcony's own floor, and ONLY across the balcony: drawn right around the building it put a bright ledge on a blank wall */
    /* the two jambs at the ends of the recess. Without them the render
       showed daylight straight through the wall at the balcony's edge: a
       hole in the building that no arithmetic check would have reported. */
    /* The opening's real edges are SEGMENT boundaries, not the nominal
       arc: every wall here is tested at its segment midpoint, so the wall
       stops up to half a segment away from 90 degrees plus or minus HB.
       Jambs placed on the nominal angle left a bright sliver of lawn at the
       far end, thin enough to miss and wrong enough to matter. */
    var balLo = null, balHi = null;
    for (var bi = 0; bi < N; bi++) {
      if (!isBalcony((a(bi) + a(bi + 1)) / 2)) continue;
      if (balLo === null) balLo = a(bi);
      balHi = a(bi + 1);
    }
    [balLo, balHi].forEach(function (u) {
      /* A jamb is a plane, and which of its two faces you see depends on
         where you stand: at the near end of an opening you see the face
         turned away from the opening, at the far end the one turned into
         it. Picking one sign for both ends left the far jamb unpainted and
         the render showed lawn straight through the wall. Both are tried. */
      var nu = -Math.sin(u), nv = Math.cos(u);
      if (!ctx.faceVisible(nu, nv)) { nu = -nu; nv = -nv; }
      if (!ctx.faceVisible(nu, nv)) return;
      push([pt(R * Math.cos(u), R * Math.sin(u), Z2 + 3.5),
            pt((R - 7) * Math.cos(u), (R - 7) * Math.sin(u), Z2 + 3.5),
            pt((R - 7) * Math.cos(u), (R - 7) * Math.sin(u), ZT),
            pt(R * Math.cos(u), R * Math.sin(u), ZT)],
           RECES, nu, nv, 0, 0.14);
    });

    /* ---------- 6. the coping, the only line on a blank wall ---------- */
    /* There were two more reveals here, at the derived floor levels. The
       render is why they are gone: three courses banded an 82 ft cylinder
       into a stack and the thing read as a tyre, when every photograph of
       this building shows one unbroken blank wall. Windowless is published;
       banded is not. */
    wall(R + 0.35, ZT - 2.2, ZT, GRAND, true, null, 0.30);

    return items;
  };
})();
