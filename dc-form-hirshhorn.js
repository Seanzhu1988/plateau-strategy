/* dc-form-hirshhorn.js: the Hirshhorn Museum and Sculpture Garden.
 * MODEL_STANDARD_EXEMPT: 3 no steps or plinth, the drum is lifted 14 ft on four piers over an open plaza
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
 *   - the courtyard WINDOW COUNT, bay width and pier width are not published
 *     in any source reached. aviewoncities gives "large rectangular windows"
 *     and nothing more; sah-archipedia.org/buildings/DC-01-ML03 returned HTTP
 *     403 to two attempts this run and is the named route to a fuller
 *     description. Eleven openings of 24.6 ft between eleven piers of 8.2 ft
 *     are drawn, three of every four of the 44 segments the drawing already
 *     uses: an assumption, on its own line. What the source supports is the
 *     READING, discrete large rectangles separated by concrete, not the
 *     eleven.
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
    /* 2026-09-08. Two critics agreed the piers were tonally invisible: 104,95,88
       against an under-drum of 97,92,86, seven levels out of 255, so a drum on
       legs read as a drum on the ground. They are granite-clad like the drum
       and a photograph shows them catching bounce off a 2.7 acre plaza, so
       they are lit, not black; what is black is the void BEHIND them. */
    var PIER  = "#a2958a";   /* the piers, in the drum's shade but bounce-lit off the plaza */
    var SOFFIT= "#8a8078";   /* the drum's underside: shaded, but a lit ceiling, not a void */
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
    function ring(rOut, rIn, z, fill, depth, test, ox, oy) {
      ox = ox || 0; oy = oy || 0;
      for (var i = 0; i < N; i++) {
        var u0 = a(i), u1 = a(i + 1);
        if (test && !test((u0 + u1) / 2)) continue;
        /* THE STARBURST. Every segment of this ring carries the same colour,
           and the stroke is that colour too, and still the render showed 44
           pale spokes fanning across the roof. Colouring the stroke red
           found them exactly: they are these radial edges. Two abutting
           quads each antialias their shared edge against what is BEHIND
           them, and two partial coverages do not add up to one, so a
           hairline of plaza and sky survives between every pair. A stroke
           in the same colour cannot close it, because the stroke has an
           antialiased edge of its own.
           So the quads OVERLAP instead. Each one runs a twelfth of a
           segment past its neighbour's start, about a fifth of a degree,
           three or four pixels at this radius and nothing at all in plan.
           The lap stops at the end of a tested arc, because the balcony
           floor is drawn with a test and must not run out over the blank
           wall by even a foot. */
        var lap = (a(1) - a(0)) / 12;
        if (!test || test((a(i + 1) + a(i + 2)) / 2)) u1 += lap;
        var q = [pt(ox + rOut * Math.cos(u0), oy + rOut * Math.sin(u0), z),
                 pt(ox + rOut * Math.cos(u1), oy + rOut * Math.sin(u1), z),
                 pt(ox + rIn  * Math.cos(u1), oy + rIn  * Math.sin(u1), z),
                 pt(ox + rIn  * Math.cos(u0), oy + rIn  * Math.sin(u0), z)];
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
        /* THE BANDS, and they are the STARBURST again on a vertical surface.
           The ring above says it: two abutting quads each antialias their
           shared edge against what is BEHIND them, two partial coverages do
           not add up to one, and a stroke in the same colour cannot close a
           hairline because the stroke has an antialiased edge of its own.
           So these quads OVERLAP too, by a twelfth of a segment. The lap
           stops where a tested arc ends, and where the NEXT segment faces
           away, so a lap can never run out past the silhouette. */
        var lap = (a(1) - a(0)) / 12;
        var un = (a(i + 1) + a(i + 2)) / 2;
        if ((!test || test(un)) &&
            ctx.faceVisible(Math.cos(un) * (outward ? 1 : -1),
                            Math.sin(un) * (outward ? 1 : -1))) u1 += lap;
        push([pt(r * Math.cos(u0), r * Math.sin(u0), z0),
              pt(r * Math.cos(u1), r * Math.sin(u1), z0),
              pt(r * Math.cos(u1), r * Math.sin(u1), z1),
              pt(r * Math.cos(u0), r * Math.sin(u0), z1)],
             fill, nx, ny, 0, bias);
      }
    }
    /* a rectangular pier, drawn as a box */
    function box(cu, cv, w, d, z0, h, fill, top) {
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
      /* a pier with no top face ends in a line where it meets the soffit. */
      if (top) push([pt(lo[0][0],lo[0][1],z0+h), pt(lo[1][0],lo[1][1],z0+h),
                     pt(lo[2][0],lo[2][1],z0+h), pt(lo[3][0],lo[3][1],z0+h)],
                    fill, 0, 0, 1, 0);
    }

    /* ---------- 1. the plaza, its shadow, and the fountain ---------- */
    /* the plaza is excluded from the camera fit (depth below -1e9+1.5) so a
       2.7 acre pad cannot shrink the building into a speck, the mistake the
       whole-Mall fit made once already */
    disc(194, 0.15, PAVE, -1e9 + 1.0);   /* 2.7 acres is r = 194 ft; r = 150 was 1.62 acres, a cited number the drawing did not keep */
    /* THE SHADOW, OWED (f). It was one concentric annulus, which is the sun
       standing at the zenith, on a drum lit hard from the upper left: the
       render showed a perfect dark ring under a building whose right flank
       is in shade, and no arithmetic would ever have complained.
       A DRUM IS NOT A BLOCK, which is why this cannot call H.shadow: that
       helper sweeps a filled outline, and filling this outline would pave
       the courtyard, which is open to the sky. So the ANNULUS is swept
       instead, from the base ring to the top ring slid away from the sun.
       The union of the copies is the true shadow of an open cylinder, and
       the hole survives it as a lens rather than a circle, because the
       courtyard floor really is lit only where the sun still reaches
       through the opening from both ends of the sweep.
       The direction is H.LIGHT_DIR, the same vector the shading uses, read
       from dc-3d.js rather than restated here. The reach is ZT * 0.9, the
       same drawing convention shadow() declares for every other building on
       the Mall, so this shadow is as long as its neighbours' for its height.
       Five copies: the sweep is 56 ft and the annulus is 72 ft wide, so
       consecutive copies overlap by more than half and the fill is one flat
       opaque tone, which means an overlap cannot show. */
    var SH_D = ZT * 0.9;
    for (var sI = 0; sI <= 4; sI++) {
      var sT = sI / 4;
      ring(R * 1.12, RI * 0.99, 0.05, "#a49d92", -1e9 + 2.0, null,
           H.LIGHT_DIR.x * SH_D * sT, H.LIGHT_DIR.y * SH_D * sT);
    }
    /* The dark under-drum. LOOKING is what forced this: with the ground
       beneath the building drawn the same tone as the plaza, the 14 ft of
       daylight under the ring vanished and an 82 ft drum on legs read as a
       tyre lying on the grass. What a photograph actually shows through
       that gap is deep shade, so deep shade is what is drawn. */
    ring(R * 1.005, RI, 0.10, "#4e4842", -1e9 + 2.2);
    /* the court's own floor, half in the drum's shade. Left at plaza tone it
       showed through the 14 ft gap as a hard white arc along the wall base. */
    ring(RI, FR, 0.12, "#b3aca1", -1e9 + 2.3);
    disc(FR, 0.55, WATER, -1e9 + 2.4);

    /* ---------- 2. the lift: the soffit, then the four piers ----------
       The drum's UNDERSIDE, at 14 ft, was never drawn at all, so from any low
       camera the eye went straight from plaza to sky through the building and
       the 14 ft of daylight read as a shadow line rather than as air. It is a
       ceiling: shaded, because it never sees the sun, but bounce-lit off the
       plaza and far lighter than the void beyond it. Painted before the piers
       so they stand against it. */
    ring(R, RI, ZP, SOFFIT);
    var RP = (R + RI) / 2;
    [45, 135, 225, 315].forEach(function (deg) {
      var u = deg * Math.PI / 180;
      box(RP * Math.cos(u), RP * Math.sin(u), 34, 34, 0, ZP, PIER, true);
    });

    /* ---------- 3. the courtyard wall and its windows, painted first ----------

       THE WINDOWS, OWED (e). The source published in this file's header says
       the courtyard facade is "defined by large rectangular WINDOWS", plural
       and rectangular. What stood here was two continuous ribbons of glass
       running the whole 361 ft of the inner circumference, and the render
       said what that costs: one smooth dark band with no articulation
       anywhere on it, which is a glazed drum and not a wall with windows in
       it. A ribbon is a positive claim the source does not make.

       So the wall is now SOLID granite everywhere the windows are not, and
       the glass is set 1.2 ft BACK into it, with a radial reveal at each end
       of each opening and a sill under it. That is the Dendur lesson again:
       open a solid, do not assemble a void. Glass proud of its own wall,
       which is what RI - 0.6 drew, is a mirror hung on a facade.

       THE RHYTHM IS AN ASSUMPTION, on its own line, and it is in NAMED GAPS.
       No source reached this run gives a window count, a bay width or a pier
       width for the inner court. Three of every four of the drawing's 44
       segments are glazed, so eleven openings of 24.6 ft sit between eleven
       piers of 8.2 ft on a 361 ft circumference: one bay per 32.8 ft. What
       is claimed is the READING the source gives, large rectangular openings
       separated by concrete. The eleven is not claimed as published, and it
       falls out of the 44 the drawing already uses for roundness. */
    var WD_ = 1.2;                       /* the glass sits this far into the wall */
    var PER = 4;                         /* segments per bay: ASSUMED, see above */
    function segIx(u) { return Math.round((u / (Math.PI * 2)) * N - 0.5); }
    function isWin(u)  { return (((segIx(u) % PER) + PER) % PER) !== 0; }
    function isPier(u) { return !isWin(u); }

    /* the piers, full height, and the spandrels across the openings: between
       them the drum stays solid, so nothing is ever seen through it */
    wall(RI, ZP, ZT, GRAN, false, isPier, 0);
    wall(RI, ZP,       Z1 + 4.5, GRAN, false, isWin, 0);
    wall(RI, Z2 - 4.5, Z2 + 4.5, GRAN, false, isWin, 0);
    wall(RI, ZT - 8.0, ZT,       GRAN, false, isWin, 0);
    /* the glass itself, recessed, so it paints before the wall that frames it */
    wall(RI + WD_, Z1 + 4.5, Z2 - 4.5, GLASS, false, isWin, 0);
    wall(RI + WD_, Z2 + 4.5, ZT - 8.0, GLASS, false, isWin, 0);

    /* one end reveal of an opening. Without these, two cylinders 1.2 ft
       apart leave a radial gap at every jamb and an oblique view looks
       straight through the drum to the sky. dir picks the side that faces
       INTO the opening, which is the only one a viewer in the court sees. */
    /* AND THE JAMBS AND SILLS MUST BE CULLED THE WAY THEIR OWN WALL IS, which
       the render caught and no count would. A jamb's normal is TANGENTIAL, so
       ctx.faceVisible passed it on the NEAR half of the court, where the wall
       it belongs to is culled: two dark slivers stood on the roof, the same
       fault this file records for the balcony recess. Every reveal now also
       asks whether the courtyard wall at its own angle is drawn, using that
       wall's own inward normal. */
    function courtFaces(u) { return ctx.faceVisible(-Math.cos(u), -Math.sin(u)); }
    function jamb(u, dir, z0, z1) {
      var c = Math.cos(u), s2 = Math.sin(u);
      var nx = -s2 * dir, ny = c * dir;
      if (!ctx.faceVisible(nx, ny) || !courtFaces(u)) return;
      push([pt(RI * c, RI * s2, z0), pt((RI + WD_) * c, (RI + WD_) * s2, z0),
            pt((RI + WD_) * c, (RI + WD_) * s2, z1), pt(RI * c, RI * s2, z1)],
           RECES, nx, ny, 0, 0.02);
    }
    for (var w = 0; w < N / PER; w++) {
      var uA = a(w * PER + 1), uB = a(w * PER + PER);
      [[Z1 + 4.5, Z2 - 4.5], [Z2 + 4.5, ZT - 8.0]].forEach(function (zz) {
        jamb(uA,  1, zz[0], zz[1]);
        jamb(uB, -1, zz[0], zz[1]);
        /* the sill: the camera looks DOWN at the far inner wall, so the
           upward face of the reveal shows and the soffit above does not.
           Only the sill is drawn; the soffit is left out rather than drawn
           with an upward normal and lit as though it were one. */
        ring(RI + WD_, RI, zz[0], RECES, undefined,
             function (u) { return u > uA - 1e-9 && u < uB + 1e-9 && courtFaces(u); });
      });
    }

    /* ---------- 4. the ring's top ---------- */
    ring(R, RI, ZT, GRAN);

    /* the coping, the only line on a blank wall. Drawn BEFORE the balcony,
       because the balcony block can return early when its opening faces
       away and the top of the drum must not leave with it.
       There were two more reveals here, at the derived floor levels. The
       render is why they are gone: three courses banded an 82 ft cylinder
       into a stack and the thing read as a tyre, when every photograph of
       this building shows one unbroken blank wall. Windowless is published;
       banded is not. */
    wall(R + 0.35, ZT - 2.2, ZT, GRAND, true, null, 0.30);

    /* ---------- 5. the blank outer wall ---------- */
    var notBalcony = function (u) { return offNorth(u) > HB; };
    var isBalcony  = function (u) { return offNorth(u) <= HB; };
    wall(R, ZP, ZT, GRAN, true, notBalcony, 0);
    /* The recess is a hole in the wall, and a hole is only a hole from the
       side you can see into. Drawn unconditionally it sat on the FAR side of
       the drum at some yaws and its back wall and jambs, carrying biases
       bigger than a ring segment's own depth spread, painted straight
       through the roof: a dark rectangle marooned on the top face. Nothing
       of the balcony is emitted unless the Mall face is toward the camera,
       and every bias here is now smaller than that spread. */
    var balconyShows = ctx.faceVisible(0, 1);
    if (!balconyShows) {
      wall(R, ZP, ZT, GRAN, true, isBalcony, 0);
      return items;
    }
    /* on the Mall side the top level opens: wall up to the third floor, a
       low parapet, and behind it the recess */
    wall(R - 7, Z2, ZT, RECES, true, isBalcony, 0);
    wall(R, ZP, Z2, GRAN, true, isBalcony, 0);
    wall(R, Z2, Z2 + 3.5, GRAN, true, isBalcony, 0.02);
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
           RECES, nu, nv, 0, 0.03);
    });

    return items;
  };
})();
