/* moma-3d.js — the Museum of Modern Art as a building, not a floor plan.
 *
 * The Met's model is Beaux-Arts: a masonry mass, a cornice that stops it, a
 * grand stair, arches. Reusing any of that here would be wrong, because MoMA
 * is the opposite argument. Goodwin and Stone's 1939 front was the first
 * International Style facade of consequence in New York, and Taniguchi's 2004
 * rebuild and the 2019 expansion kept the reasoning: no ornament, no cornice,
 * no visible frame, glass held in the thinnest mullions the span allows, and
 * a wall that reads as a taut surface rather than as weight.
 *
 * So this draws what that style actually does: horizontal glazing bands with
 * slim dark mullions, pale panel infill, floor plates that cantilever slightly
 * past the frame, and a flat roof with no crown at all. A modernist building
 * with a cornice on it is a costume.
 *
 * The plan is not invented. It is extruded from window.MOMA_GEOMETRY.ROOMS,
 * the same data the 2D floor map draws, so the rooms stand where the map says
 * they stand and the two can never drift apart.
 */
(function () {
  var C = {
    glass:  "#8fa0aa",
    glassD: "#75868f",
    panel:  "#e8e7e3",
    mull:   "#3f4448",
    plate:  "#d8d6d0",
    roof:   "#b9b7b1",
    room:   "#cbc9c2",
    ground: "#e3e5df",
    edge:   "#9a978f",
  };

  function depthOf(q) {
    var d = q[0][2];
    for (var i = 1; i < q.length; i++) if (q[i][2] < d) d = q[i][2];
    return d;
  }

  function quad(ctx, a, b, c, d, fill, edge, sw, depth, extra) {
    var q = [a, b, c, d];
    return { svg: ctx.poly(q, fill, edge || null, sw || 0, extra || ''),
             depth: depth === undefined ? depthOf(q) : depth };
  }

  /* A slab: the floor plate itself, and every gallery standing on it. */
  function plate(ctx, x0, y0, x1, y1, z, t, fill) {
    var P = ctx.project, out = [];
    out.push(quad(ctx, P(x0,y0,z+t), P(x1,y0,z+t), P(x1,y1,z+t), P(x0,y1,z+t),
                  ctx.shade(fill, 0, 0, 1), C.edge, 0.5));
    var sides = [[x0,y0,x1,y0,0,-1],[x1,y0,x1,y1,1,0],
                 [x1,y1,x0,y1,0,1],[x0,y1,x0,y0,-1,0]];
    sides.forEach(function (s) {
      if (!ctx.faceVisible(s[4], s[5])) return;
      out.push(quad(ctx, P(s[0],s[1],z), P(s[2],s[3],z),
                    P(s[2],s[3],z+t), P(s[0],s[1],z+t),
                    ctx.shade(fill, s[4], s[5], 0), C.edge, 0.5));
    });
    return out;
  }

  /* The curtain wall. Horizontal bands of glass separated by slim spandrels,
     which is the whole visual argument of the style: the floors read as
     stacked planes and the structure is never shown. */
  function curtain(ctx, x0, y0, x1, y1, z0, h, bands) {
    var P = ctx.project, out = [];
    var faces = [[x0,y0,x1,y0,0,-1],[x1,y0,x1,y1,1,0],
                 [x1,y1,x0,y1,0,1],[x0,y1,x0,y0,-1,0]];
    faces.forEach(function (f) {
      if (!ctx.faceVisible(f[4], f[5])) return;
      var n = bands || 6;
      for (var i = 0; i < n; i++) {
        var za = z0 + h * i / n, zb = z0 + h * (i + 1) / n;
        var gTop = zb - (zb - za) * 0.26;
        out.push(quad(ctx, P(f[0],f[1],za), P(f[2],f[3],za),
                      P(f[2],f[3],gTop), P(f[0],f[1],gTop),
                      ctx.shade(i % 2 ? C.glass : C.glassD, f[4], f[5], 0),
                      null, 0));
        out.push(quad(ctx, P(f[0],f[1],gTop), P(f[2],f[3],gTop),
                      P(f[2],f[3],zb), P(f[0],f[1],zb),
                      ctx.shade(C.panel, f[4], f[5], 0), null, 0));
      }
      /* Mullions, drawn thin and dark. Without them a glass wall reads as a
         painted box; with them it reads as glazing, and that is the only
         reason they are here. */
      var span = Math.max(Math.abs(f[2]-f[0]), Math.abs(f[3]-f[1]));
      /* Mullion spacing is a drawing decision, not a measurement. At one bay
         every 34 units the glass read as a grid of small cells, which is an
         office block. MoMA's bays are wide and the verticals are sparse. */
      var steps = Math.max(3, Math.round(span / 88));
      for (var k = 0; k <= steps; k++) {
        var t = k / steps;
        var mx = f[0] + (f[2]-f[0]) * t, my = f[1] + (f[3]-f[1]) * t;
        var w = span * 0.006;
        var dx = (f[2]-f[0]) === 0 ? 0 : w, dy = (f[3]-f[1]) === 0 ? 0 : w;
        out.push(quad(ctx, P(mx,my,z0), P(mx+dx,my+dy,z0),
                      P(mx+dx,my+dy,z0+h), P(mx,my,z0+h),
                      C.mull, null, 0, undefined, ' opacity="0.85"'));
      }
    });
    return out;
  }

  function ground(ctx, x0, y0, x1, y1, z) {
    var P = ctx.project;
    return { svg: ctx.poly([P(x0,y0,z),P(x1,y0,z),P(x1,y1,z),P(x0,y1,z)],
                           C.ground, C.edge, 0.5), depth: -1e9 };
  }

  function rooms(open) {
    var G = (typeof window !== "undefined" && window.MOMA_GEOMETRY) || {};
    var R = G.ROOMS || {};
    return Object.keys(R).map(function (k) {
      var r = R[k]; r.key = k; return r;
    }).filter(function (r) { return r && r.w; });
  }

  /* Floors 2, 4 and 5 are the collection floors the map draws. They are
     stacked at their real spacing when closed and lifted apart when opened,
     the same gesture met-3d.js uses, because a visitor reads "which floor"
     far faster from separated plates than from a legend. */
  var FLOORS = [2, 4, 5];
  /* The plan is a WAYFINDING drawing, laid out to be read, not measured, so
     its 690 x 520 says nothing about how tall the building is. Extruding it
     at the spacing the map implies produced a squat slab that looked like a
     car park. The height is set from the real building instead: the galleries
     sit at roughly 18 ft floor to floor, and at this plan's scale, where the
     long side stands for about 400 ft of 53rd Street, that is 70 units a
     storey and an envelope a little under 200. */
  var FLOOR_H = 70;
  var ENVELOPE_H = 196;

  /* THE PLAN IS NOT THE FOOTPRINT, and two attempts at this failed before
     saying so. The wayfinding map is 690 by 520, close to square, because it
     is drawn to be READ; the real block runs about twice as wide along West
     53rd Street as it is deep to 54th. Extruding the map gives a squat glass
     box no matter what height you pick, because the error is in the plan's
     aspect, not its scale.

     So the envelope is built from the building's own massing and the rooms
     are placed INSIDE it, squeezed to fit. The map still decides where a
     gallery sits relative to its neighbours, which is what a visitor needs;
     it no longer decides what the building looks like, which it never knew. */
  var BX0 = 40, BX1 = 730, BY0 = 20, BY1 = 365;
  var GROUND_H = 30, GALLERY_H = 150, WEST_EXTRA = 62;

  function fit(r) {
    var G = (typeof window !== "undefined" && window.MOMA_GEOMETRY) || {};
    var sx = (BX1 - BX0) / 690, sy = (BY1 - BY0) / 520;
    return { x: BX0 + (r.x - 40) * sx, y: BY0 + (r.y - 20) * sy,
             w: r.w * sx, h: r.h * sy, f: r.f, key: r.key };
  }

  function building(openT) {
    return function (ctx) {
      var rs = rooms().map(fit), out = [];
      out.push(ground(ctx, BX0 - 70, BY0 - 70, BX1 + 70, BY1 + 70, 0));
      var lift = 130 * (openT || 0);

      if ((openT || 0) < 0.35) {
        /* The ground floor is set BACK and dark. On 53rd Street the gallery
           mass reads as though it floats over a recessed glazed lobby, and
           without that setback the building sits on the pavement like a
           warehouse. It is the cheapest single line that makes it MoMA. */
        var inset = 26;
        out = out.concat(curtain(ctx, BX0 + inset, BY0 + inset,
                                 BX1 - inset, BY1 - inset, 0, GROUND_H, 1));
        out = out.concat(curtain(ctx, BX0, BY0, BX1, BY1,
                                 GROUND_H, GALLERY_H, 5));
        /* The western third stands taller, which is the 2019 expansion side
           and the only asymmetry in the mass that a passer-by registers. */
        var wx = BX0 + (BX1 - BX0) * 0.34;
        out = out.concat(curtain(ctx, BX0, BY0, wx, BY1,
                                 GROUND_H + GALLERY_H, WEST_EXTRA, 2));
        out = out.concat(plate(ctx, BX0, BY0, wx, BY1,
                               GROUND_H + GALLERY_H + WEST_EXTRA, 5, C.roof));
        out = out.concat(plate(ctx, wx, BY0, BX1, BY1,
                               GROUND_H + GALLERY_H, 5, C.roof));
      } else {
        FLOORS.forEach(function (f, idx) {
          var z = GROUND_H + idx * FLOOR_H + idx * lift;
          out = out.concat(plate(ctx, BX0, BY0, BX1, BY1, z, 5, C.plate));
          rs.filter(function (r) { return r.f === f; }).forEach(function (r) {
            out = out.concat(plate(ctx, r.x, r.y, r.x + r.w, r.y + r.h,
                                   z + 5, 15, C.room));
          });
        });
      }
      return out;
    };
  }

  var api = { building: building, scenes: {
    closed: building(0), open: building(1), ajar: building(0.3) } };
  if (typeof window !== "undefined") window.MOMA3D = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
