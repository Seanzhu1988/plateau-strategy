/* dc-form-nmaahc.js: the National Museum of African American History and
 * Culture, Adjaye Associates / Freelon Group / Davis Brody Bond, opened
 * 24 September 2016.
 *
 * Rebuilt to MODEL_STANDARD.md. What stood here before was the generic
 * "corona" form: a stack of three boxes. This building is an INVERTED step
 * pyramid, and a box stack drawn the ordinary way flares the wrong way or
 * not at all, which loses the one thing every visitor sees from the Mall.
 *
 * RESEARCH, every number with a source checked this run.
 *
 * PUBLISHED (Wikipedia, National Museum of African American History and
 * Culture, https://en.wikipedia.org/wiki/National_Museum_of_African_American_History_and_Culture):
 *   - "The 350,000-square-foot (33,000 m2), 10-story building (five above
 *     and five below ground)"
 *   - "limited to the 5-acre (20,000 m2) site"
 *   - "the building itself will be only 70 ft (21 m) deep" below grade
 *   - "The 200 ft (61 m) long-span porch that covers the main entrance"
 *   - "the structure's 3,600 bronze-colored panels for the building's corona"
 *
 * PUBLISHED (Metal Architecture, "Architectural Crown Jewel",
 * https://www.metalarchitecture.com/articles/architectural-crown-jewel/):
 *   - "the angle used for the corona is 17 degrees, the same as the slope on
 *     the top of the Washington Monument"
 *   - "three-tiered, inverted step pyramid shape" that "reaches 85 feet high"
 *   - "4-foot by 5-foot aluminum panels", 3,600 of them, cast aluminium with
 *     a Fluropon coating in African Sunset / Sunrise / Rose and black
 *   - the panels "vary in porosity from 65 percent to 95 percent solid", so
 *     the corona is a SCREEN standing off a glass wall, not a stone facade
 *
 * PLAN, measured this run from OpenStreetMap through the Overpass API:
 *   - way 398810868, building=civic, name="National Museum of African
 *     American History and Culture": 13 vertices, bounding box 200 ft east
 *     to west by 201 ft north to south. Effectively a square with the north
 *     east corner cut back. Drawn as 200 by 200 at the corona's TOP, which
 *     is what an aerial trace of an outward-flaring building records.
 *   - way 898560007, building=roof, height=7 (metres), lying 25 ft SOUTH of
 *     the main polygon, 192 ft east to west by 41 ft deep. That is the
 *     porch, and it puts the main entrance on the SOUTH face, toward
 *     Madison Drive and the Washington Monument. Its published length of
 *     200 ft is used in preference to the 192 ft trace.
 *
 * NAMED GAPS. Guessed nowhere, stated here rather than buried:
 *   - the HEIGHT AT WHICH THE CORONA STARTS is not published in any source
 *     reached this run. Drawn at 15 ft, an assumption, chosen because every
 *     photograph shows a recessed glazed ground storey below the lowest
 *     tier and 15 ft is one museum storey.
 *   - the THREE TIER HEIGHTS are not published individually. The 70 ft from
 *     the assumed corona base to the published 85 ft top is divided in
 *     three: a derivation, not a measurement.
 *   - the STEP BACK between one tier's top and the next tier's base is not
 *     published. Drawn at 3 ft, an assumption; it is what makes the three
 *     tiers read as three rather than as one continuous slope.
 *   - the GLASS WALL's set-back behind the corona is not published. Drawn
 *     at 8 ft, an assumption, and it is the reason the soffit reads.
 *   - the PORCH's projection from the facade is not published. Drawn out to
 *     the outer edge of OSM way 898560007, 63 ft, and at that way's tagged
 *     height of 7 m. Both are an OSM contributor's trace, not the
 *     architect's dimension, and are marked as such.
 *   - the WATER FEATURE and the landscaped berms on the south lawn have no
 *     published dimensions reached this run, so nothing is invented there.
 *
 * FRAME. u runs east, v runs north, z up, all in feet, centred on the OSM
 * polygon's centroid. The porch is on the SOUTH, so this building is looked
 * at from a southern yaw; the offline renderer's default yaw shows the
 * north and east faces, which is the Constitution Avenue side.
 *
 * PAINT. An inverted pyramid inverts the painter's usual trap. A tier's
 * near face leans TOWARD the camera as it rises, so its nearest point is
 * its TOP edge, exactly where the roof slab's nearest edge also is. The
 * roof is given an explicit depth just under that so the near wall always
 * wins the tie. The soffit under the corona overhang, and the dark ground
 * beneath it, are each their own plane with their own depth, because the
 * lesson from the Hirshhorn is that a lift only reads when the underside is
 * drawn as a lit surface rather than left to merge with the shadow.
 */
(function () {
  var H = window.DC3D.helpers;
  window.DC_FORMS = window.DC_FORMS || {};
  window.DC_FORMS['nmaahc'] = function (ctx, p, s, VE) {
    var P = ctx.project, items = [];
    var FT = (p.h * VE) / 85;          /* the published 85 ft lands on p.h */
    var m  = FT * s;
    function pt(u, v, z) { return P(p.x + u * m, p.y + v * m, z * FT); }

    /* ---------- published and derived geometry, in feet ---------- */
    var ZTOP = 85;                     /* published: reaches 85 feet high */
    var ZC   = 15;                     /* assumed corona base, see gaps */
    var TH   = (ZTOP - ZC) / 3;        /* derived tier height, 23.33 ft */
    var LEAN = Math.tan(17 * Math.PI / 180);  /* published 17 degrees */
    var L    = TH * LEAN;              /* 7.13 ft of flare per tier */
    var STEP = 3;                      /* assumed step back between tiers */
    var HXT  = 100, HYT = 100;         /* OSM: 200 by 201 ft at the top */
    /* work back down: top = base + 3L - 2*STEP */
    var HX0 = HXT - 3 * L + 2 * STEP, HY0 = HYT - 3 * L + 2 * STEP;
    var GIN = 8;                       /* assumed glass set-back */
    var PW  = 200, PD = 63, PZ = 23;   /* porch: published length, OSM depth and height */

    /* ---------- materials ----------
       Two tones per material, and here they must be explicit rather than
       left to ctx.shade alone: a face leaning out at 17 degrees carries a
       downward normal component that flattens every face into the same
       narrow band, which is the "tonally invisible" fault the Hirshhorn
       critics found. The lit tone goes on faces the light actually reaches. */
    var BRZ_LIT = "#cd9550";   /* cast aluminium, African Sunset, in sun */
    var BRZ_SHD = "#7f5b33";   /* the same panel, turned away */
    var REVEAL  = "#5d4227";   /* the shadow gap between tiers */
    var SEAM_L  = "#b3813f";   /* a panel joint on a sunlit face */
    var SEAM_S  = "#71512c";   /* the same joint, turned away */
    var SOFFIT  = "#a07d51";   /* the corona's underside, bounce lit */
    var GLASS   = "#46545c";   /* the curtain wall behind the screen */
    var UNDER   = "#6d6760";   /* deep shade on the ground under the overhang */
    var PAVE    = "#d9d2c6";
    var PORCH   = "#b9b2a6";
    var PORCHU  = "#7b7568";   /* the porch soffit, which is what you see */

    var LX = 0.55, LY = 0.35;  /* the renderer's own light, for tone choice */
    function tone(nu, nv) { return (nu * LX + nv * LY) > 0.05 ? BRZ_LIT : BRZ_SHD; }

    function push(q, fill, nu, nv, nz, bias) {
      var f = ctx.shade(fill, nu, nv, nz || 0);
      items.push({ svg: ctx.poly(q, f, f, 0.7),
                   depth: H.depthOf(q) + (bias || 0) });
    }
    var NRM = [[0,-1],[1,0],[0,1],[-1,0]];
    function slab(hx, hy, z, fill, depth) {
      var q = [pt(-hx,-hy,z), pt(hx,-hy,z), pt(hx,hy,z), pt(-hx,hy,z)];
      var f = ctx.shade(fill, 0, 0, 1);
      items.push({ svg: ctx.poly(q, f, f, 0.7),
                   depth: depth === undefined ? H.depthOf(q) : depth });
    }
    /* a flat frame lying in the z plane: four quads, never one polygon with
       a hole, so whatever stands inside it keeps its own depth */
    /* Every ledge here sits UNDER something wider: the corona flares, so the
       roof overhangs each reveal and each reveal overhangs the soffit. A
       ledge on the far side is therefore hidden in life, and drawn it was
       not hidden here: its inner edge is nearer than the roof's far edge, so
       it sorted later and painted two rectangles straight onto the roof.
       Culled by the same test the walls use, which is what "hidden under the
       overhang" means in this projection. */
    function frame(hxO, hyO, hxI, hyI, z, fill, depth) {
      var o = [[-hxO,-hyO],[hxO,-hyO],[hxO,hyO],[-hxO,hyO]];
      var n = [[-hxI,-hyI],[hxI,-hyI],[hxI,hyI],[-hxI,hyI]];
      var f = ctx.shade(fill, 0, 0, 1);
      for (var i = 0; i < 4; i++) {
        if (!ctx.faceVisible(NRM[i][0], NRM[i][1])) continue;
        var j = (i + 1) % 4;
        var q = [pt(o[i][0],o[i][1],z), pt(o[j][0],o[j][1],z),
                 pt(n[j][0],n[j][1],z), pt(n[i][0],n[i][1],z)];
        items.push({ svg: ctx.poly(q, f, f, 0.7),
                     depth: depth === undefined ? H.depthOf(q) : depth });
      }
    }
    /* the four sides of a box whose plan grows from (hx0,hy0) at z0 to
       (hx1,hy1) at z1. The corona's tiers are exactly this with hx1 > hx0. */
    function sides(hx0, hy0, hx1, hy1, z0, z1, fill, bias, grid) {
      var lo = [[-hx0,-hy0],[hx0,-hy0],[hx0,hy0],[-hx0,hy0]];
      var hi = [[-hx1,-hy1],[hx1,-hy1],[hx1,hy1],[-hx1,hy1]];
      for (var i = 0; i < 4; i++) {
        var nu = NRM[i][0], nv = NRM[i][1];
        if (!ctx.faceVisible(nu, nv)) continue;
        var j = (i + 1) % 4;
        /* the true normal of an outward-leaning face tilts downward */
        var nz = (hx1 > hx0 || hy1 > hy0) ? -Math.sin(17 * Math.PI / 180) : 0;
        var q = [pt(lo[i][0],lo[i][1],z0), pt(lo[j][0],lo[j][1],z0),
                 pt(hi[j][0],hi[j][1],z1), pt(hi[i][0],hi[i][1],z1)];
        push(q, fill || tone(nu, nv), nu, nv, nz, bias);
        if (!grid) continue;
        /* The corona is a perforated screen of 4 by 5 ft panels, not a wall.
           Drawn panel by panel it would band the facade the way three
           reveals banded the Hirshhorn; drawn not at all it reads as sheet
           metal. So: one faint seam every fifth panel, 20 ft apart. */
        var span = Math.abs(lo[j][0] - lo[i][0]) + Math.abs(lo[j][1] - lo[i][1]);
        var nseam = Math.floor(span / 25);
        var seamCol = (tone(nu, nv) === BRZ_LIT) ? SEAM_L : SEAM_S;
        for (var k = 1; k < nseam; k++) {
          var t0 = k / nseam, w = 0.30 / span;
          var a0 = t0 - w, a1 = t0 + w;
          function mix(A, B, t) { return [A[0]+(B[0]-A[0])*t, A[1]+(B[1]-A[1])*t]; }
          var b0 = mix(lo[i], lo[j], a0), b1 = mix(lo[i], lo[j], a1);
          var u0 = mix(hi[i], hi[j], a0), u1 = mix(hi[i], hi[j], a1);
          push([pt(b0[0],b0[1],z0), pt(b1[0],b1[1],z0),
                pt(u1[0],u1[1],z1), pt(u0[0],u0[1],z1)],
               seamCol, nu, nv, nz, (bias || 0) + 0.05);
        }
      }
    }

    /* ---------- 1. the apron, the shadow, and the ground under the corona ---------- */
    /* kept small: a 5 acre pad fitted the camera to the lawn and left the
       building a speck, the mistake the whole-Mall fit made once already */
    slab(150, 150, 0.15, PAVE, -1e9 + 1.0);
    items.push(H.shadow(ctx, [[p.x - HXT*m, p.y - HYT*m], [p.x + HXT*m, p.y - HYT*m],
                              [p.x + HXT*m, p.y + HYT*m], [p.x - HXT*m, p.y + HYT*m]],
                        ZTOP * FT));
    /* the band of deep shade the overhang throws on its own ground: without
       it the 15 ft of glass under a flaring bronze crown reads as a plinth */
    slab(HX0 + 2, HY0 + 2, 0.30, UNDER, -1e9 + 2.2);

    /* ---------- 2. the glazed ground storey, set back under the corona ---------- */
    sides(HX0 - GIN, HY0 - GIN, HX0 - GIN, HY0 - GIN, 0, ZC, GLASS, 0);

    /* ---------- 3. the corona's soffit: its own lit plane, not a shadow ---------- */
    frame(HX0, HY0, HX0 - GIN, HY0 - GIN, ZC, SOFFIT, undefined);

    /* ---------- 4. the three tiers of the corona ---------- */
    for (var t = 0; t < 3; t++) {
      var b = t * (L - STEP);
      var zb = ZC + t * TH;
      sides(HX0 + b, HY0 + b, HX0 + b + L, HY0 + b + L, zb, zb + TH, null, 0, true);
      /* the reveal at the top of the first two tiers: a real shadow gap,
         and the thing that makes three tiers read as three */
      if (t < 2) {
        frame(HX0 + b + L, HY0 + b + L, HX0 + b + L - STEP, HY0 + b + L - STEP,
              zb + TH, REVEAL, undefined);
      }
    }

    /* ---------- 5. the roof ----------
       An inverted pyramid's near face leans toward the camera, so its top
       edge and the roof's near edge share a depth. The roof is nudged under
       that tie so the wall always paints last and never gets capped. */
    var roofQ = [pt(-HXT,-HYT,ZTOP), pt(HXT,-HYT,ZTOP), pt(HXT,HYT,ZTOP), pt(-HXT,HYT,ZTOP)];
    slab(HXT, HYT, ZTOP, "#7c7468", H.depthOf(roofQ) - 0.6);

    /* ---------- 6. the porch on the south front ----------
       A porch is only visible from the side it faces. Drawn unconditionally
       it sat on the FAR side of the corona at northern yaws, and the part of
       it that lies under the roof overhang painted a pale grey sliver
       straight across the roof, with its outer plate marooned beside the
       building. Nothing of the porch is emitted unless the south face is
       toward the camera, which is the same rule the Hirshhorn's balcony
       needed and for the same reason. */
    if (!ctx.faceVisible(0, -1)) return items;
    /* LOOKING caught this: begun at the corona's outer edge the canopy
       started 23 ft in front of the ground storey it shelters and read as a
       jetty floating in the air. It runs from the glass facade out to the
       outer edge of OSM way 898560007. */
    var pv0 = -(HY0 - GIN), pv1 = -HYT - PD;
    /* its underside is what a visitor sees, so it is drawn as its own plane */
    var soff = [pt(-PW/2, pv0, PZ), pt(PW/2, pv0, PZ), pt(PW/2, pv1, PZ), pt(-PW/2, pv1, PZ)];
    var fs = ctx.shade(PORCHU, 0, 0, -1);
    items.push({ svg: ctx.poly(soff, fs, fs, 0.7), depth: H.depthOf(soff) - 0.4 });
    /* the slab itself, 3 ft thick, its four visible edges, and its columns.
       sides() centres on the origin, and the porch does not, so the porch
       box is written out here rather than borrowed. */
    (function () {
      var cy = (pv0 + pv1) / 2, hy = PD / 2, hx = PW / 2;
      var lo = [[-hx,cy-hy],[hx,cy-hy],[hx,cy+hy],[-hx,cy+hy]];
      for (var i = 0; i < 4; i++) {
        if (!ctx.faceVisible(NRM[i][0], NRM[i][1])) continue;
        var j = (i + 1) % 4;
        push([pt(lo[i][0],lo[i][1],PZ), pt(lo[j][0],lo[j][1],PZ),
              pt(lo[j][0],lo[j][1],PZ+3), pt(lo[i][0],lo[i][1],PZ+3)],
             PORCH, NRM[i][0], NRM[i][1], 0, 0.1);
      }
      var q = [pt(-hx,cy-hy,PZ+3), pt(hx,cy-hy,PZ+3), pt(hx,cy+hy,PZ+3), pt(-hx,cy+hy,PZ+3)];
      var f = ctx.shade(PORCH, 0, 0, 1);
      items.push({ svg: ctx.poly(q, f, f, 0.7), depth: H.depthOf(q) + 0.15 });
      /* the columns that hold the outer edge up. Their count is not
         published; five are drawn across 200 ft, an assumption stated here. */
      for (var c = 0; c < 5; c++) {
        var cu = -hx + 14 + c * (PW - 28) / 4;
        for (var i2 = 0; i2 < 4; i2++) {
          if (!ctx.faceVisible(NRM[i2][0], NRM[i2][1])) continue;
          var j2 = (i2 + 1) % 4;
          var cl = [[cu-3,pv1+4-3],[cu+3,pv1+4-3],[cu+3,pv1+4+3],[cu-3,pv1+4+3]];
          push([pt(cl[i2][0],cl[i2][1],0), pt(cl[j2][0],cl[j2][1],0),
                pt(cl[j2][0],cl[j2][1],PZ), pt(cl[i2][0],cl[i2][1],PZ)],
               PORCH, NRM[i2][0], NRM[i2][1], 0, 0.2);
        }
      }
    })();

    return items;
  };
})();
