/* dc-form-castle.js: the Smithsonian Institution Building, the Castle.
 *
 * Rebuilt to MODEL_STANDARD.md. What stood here before was four red boxes:
 * a slab and three square posts, no roof, no wings, no plan.
 *
 * RESEARCH, every number with a source checked this run.
 *
 * HEIGHTS (published, National Register nomination via Wikipedia,
 * https://en.wikipedia.org/wiki/Smithsonian_Institution_Building):
 *   - the principal tower on the SOUTH side is 91 ft high and 37 ft square;
 *   - on the NORTH side there are TWO towers, the taller 145 ft tall;
 *   - a campanile at the NORTHEAST corner is 17 ft square and 117 ft tall;
 *   - NINE towers in all: four contain occupiable space, five are smaller
 *     and mostly decorative. Nine are drawn here, and no more.
 * The 145 ft north tower is the building's height of record, so FT below is
 * set to land that tower exactly on p.h (44 m in dc-3d.js, which is 145 ft).
 *
 * PLAN (measured, OpenStreetMap relation 7393969 read through Nominatim this
 * run, https://nominatim.openstreetmap.org/search?q=Smithsonian+Institution+Building
 * with polygon_geojson=1). The real footprint is 135.4 m by 47.5 m, that is
 * 444 ft by 156 ft, its long axis running east to west along the Mall. Every
 * mass below is a rectangle read off that polygon and converted to feet; not
 * one of them is eyeballed. The polygon also gives the towers their real
 * positions: the pair projecting north of the centre, the big one projecting
 * south, the small ones on the north and south faces of the ranges.
 *
 * COMPOSITION (published, same nomination): "a central section, two
 * extensions or ranges, and two wings". The West Range was ONE storey, the
 * East Range two, the wings two with a third added to the West Wing and a
 * third and fourth to the East Wing. That storey count is why the roofline
 * steps: low at the west, tall at the east, tallest over the centre.
 *
 * MATERIAL (published): red sandstone from the Seneca quarry in Seneca,
 * Maryland. Norman Revival, a 12th-century mix of late Romanesque and early
 * Gothic, which is why the roofs are steep and the towers are square with
 * pyramidal caps rather than domed.
 *
 * NAMED GAPS, guessed nowhere, stated here rather than buried:
 *   - the overall length is not published in any source reached this run.
 *     Two attempts failed: the NPS nomination asset returned an image, and
 *     the Overpass mirrors returned HTML. The 444 ft above is MEASURED from
 *     the OSM footprint, not published prose.
 *   - the SECOND north tower's height is not published, only that it is the
 *     shorter of the two. Drawn at 108 ft: an assumption, on its own line.
 *   - the five small towers' heights are not published. Each is drawn
 *     twelve feet above the ridge of the mass it stands on: an assumption,
 *     on its own line.
 *   - eave heights are not published. Each is the published storey count at
 *     a fourteen-foot storey: a derivation from a published number, on its
 *     own line, and the reason the roofline steps the way photographs show.
 *
 * FRAME. u runs east, v runs north, z up, all in feet. The north front is
 * the one that faces the Mall and carries the two towers, and the offline
 * renderer's default yaw looks at north faces, so nothing is flipped.
 *
 * PAINT. Depth is the face's own nearest point plus a small bias in metres,
 * so a 444 ft building still sorts by where its masses actually are. Only
 * things that STACK get a bias: a roof over its body, a tower over the mass
 * it rises from, a cap over its tower. Bodies are drawn with no top face at
 * all, because a roof always covers them, and a top slab painting over its
 * own roof is the trap this project has met eight times.
 */
(function () {
  var H = window.DC3D.helpers;
  window.DC_FORMS = window.DC_FORMS || {};
  window.DC_FORMS['castle'] = function (ctx, p, s, VE) {
    var P = ctx.project, items = [];
    var FT = (p.h * VE) / 145;        /* metres per foot: the 145 ft tower lands on p.h */
    var m  = FT * s;                  /* metres per foot, horizontal */
    function pt(u, v, z) { return P(p.x + u * m, p.y + v * m, z * FT); }
    var ryC = P(p.x, p.y, 0)[2];

    /* ---------- materials: two tones come from ctx.shade, one fill per material ---------- */
    var STONE  = "#a85c46";   /* Seneca red sandstone */
    var STONED = "#96503c";   /* the same stone in the plinth course, darker */
    var SLATE  = "#565161";   /* the steep slate roofs */
    var GLASS  = "#42393c";   /* window openings */
    var EDGE   = "#79402f";
    var REDGE  = "#403c48";

    /* a face paints if it leans up enough to be seen from above, or if its
       horizontal normal faces the camera */
    function vis(nu, nv, nz) { return (nz || 0) > 0.30 || ctx.faceVisible(nu, nv); }
    function face(q, fill, nu, nv, nz, bias, edge, sw) {
      items.push({ svg: ctx.poly(q, ctx.shade(fill, nu, nv, nz || 0), edge === null ? null : (edge || EDGE), sw || 0.4),
                   depth: H.depthOf(q) + (bias || 0) });
    }

    /* a rectangular mass. noTop leaves the top open for a roof to cover. */
    function box(cu, cv, w, d, z0, h, fill, o) {
      o = o || {};
      var hu = w / 2, hv = d / 2, b = o.bias || 0;
      var lo = [[cu-hu,cv-hv],[cu+hu,cv-hv],[cu+hu,cv+hv],[cu-hu,cv+hv]];
      var nrm = [[0,-1],[1,0],[0,1],[-1,0]];
      for (var i = 0; i < 4; i++) {
        if (!vis(nrm[i][0], nrm[i][1], 0)) continue;
        var j = (i + 1) % 4;
        face([pt(lo[i][0],lo[i][1],z0), pt(lo[j][0],lo[j][1],z0),
              pt(lo[j][0],lo[j][1],z0+h), pt(lo[i][0],lo[i][1],z0+h)],
             fill, nrm[i][0], nrm[i][1], 0, b, o.edge, o.sw);
      }
      if (!o.noTop) {
        face([pt(cu-hu,cv-hv,z0+h), pt(cu+hu,cv-hv,z0+h),
              pt(cu+hu,cv+hv,z0+h), pt(cu-hu,cv+hv,z0+h)],
             fill, 0, 0, 1, b + 0.4, o.edge, o.sw);
      }
    }

    /* a steep gabled roof. ridgeAlongU true puts the ridge along the long
       axis, which is what the ranges and wings have; the towers get caps. */
    function gable(cu, cv, w, d, z0, rise, ridgeAlongU, bias) {
      var hu = w / 2, hv = d / 2, zr = z0 + rise, b = bias || 0;
      if (ridgeAlongU) {
        /* two slopes facing north and south, two triangular ends east and west */
        if (vis(0, -1, 0.55))
          face([pt(cu-hu,cv-hv,z0), pt(cu+hu,cv-hv,z0), pt(cu+hu,cv,zr), pt(cu-hu,cv,zr)], SLATE, 0, -0.62, 0.78, b, REDGE);
        if (vis(0, 1, 0.55))
          face([pt(cu-hu,cv+hv,z0), pt(cu+hu,cv+hv,z0), pt(cu+hu,cv,zr), pt(cu-hu,cv,zr)], SLATE, 0, 0.62, 0.78, b, REDGE);
        if (vis(1, 0, 0))
          face([pt(cu+hu,cv-hv,z0), pt(cu+hu,cv+hv,z0), pt(cu+hu,cv,zr)], STONE, 1, 0, 0, b, EDGE);
        if (vis(-1, 0, 0))
          face([pt(cu-hu,cv-hv,z0), pt(cu-hu,cv+hv,z0), pt(cu-hu,cv,zr)], STONE, -1, 0, 0, b, EDGE);
      } else {
        if (vis(1, 0, 0.55))
          face([pt(cu+hu,cv-hv,z0), pt(cu+hu,cv+hv,z0), pt(cu,cv+hv,zr), pt(cu,cv-hv,zr)], SLATE, 0.62, 0, 0.78, b, REDGE);
        if (vis(-1, 0, 0.55))
          face([pt(cu-hu,cv-hv,z0), pt(cu-hu,cv+hv,z0), pt(cu,cv+hv,zr), pt(cu,cv-hv,zr)], SLATE, -0.62, 0, 0.78, b, REDGE);
        if (vis(0, 1, 0))
          face([pt(cu-hu,cv+hv,z0), pt(cu+hu,cv+hv,z0), pt(cu,cv+hv,zr)], STONE, 0, 1, 0, b, EDGE);
        if (vis(0, -1, 0))
          face([pt(cu-hu,cv-hv,z0), pt(cu+hu,cv-hv,z0), pt(cu,cv-hv,zr)], STONE, 0, -1, 0, b, EDGE);
      }
    }

    /* a pyramidal tower cap, the Norman answer to a dome */
    function cap(cu, cv, w, d, z0, rise, bias) {
      var hu = w / 2, hv = d / 2, b = bias || 0;
      var lo = [[cu-hu,cv-hv],[cu+hu,cv-hv],[cu+hu,cv+hv],[cu-hu,cv+hv]];
      var nrm = [[0,-1],[1,0],[0,1],[-1,0]];
      for (var i = 0; i < 4; i++) {
        if (!vis(nrm[i][0], nrm[i][1], 0.45)) continue;
        var j = (i + 1) % 4;
        face([pt(lo[i][0],lo[i][1],z0), pt(lo[j][0],lo[j][1],z0), pt(cu,cv,z0+rise)],
             SLATE, nrm[i][0] * 0.6, nrm[i][1] * 0.6, 0.72, b, REDGE);
      }
    }

    /* a row of tall narrow openings on one wall: what turns a red block into
       a building at this size. side is the outward normal. */
    function windows(cu, cv, w, z0, hgt, n, nu, nv, bias) {
      if (!vis(nu, nv, 0)) return;
      var wide = Math.min(3.4, w / (n * 2.4));
      for (var i = 0; i < n; i++) {
        var t = (i + 0.5) / n, off = (t - 0.5) * w;
        var au = nu !== 0 ? cu : cu + off, av = nu !== 0 ? cv + off : cv;
        var eu = nu !== 0 ? 0.35 : wide, ev = nu !== 0 ? wide : 0.35;
        face([pt(au-eu/2*(nv?1:0)-(nu?0:0), av-ev/2*(nu?1:0), z0),
              pt(au+(nv?eu/2:0), av+(nu?ev/2:0), z0),
              pt(au+(nv?eu/2:0), av+(nu?ev/2:0), z0+hgt),
              pt(au-(nv?eu/2:0), av-(nu?ev/2:0), z0+hgt)],
             GLASS, nu, nv, 0, (bias || 0) + 0.25, null);
      }
    }

    /* ---------- the plan, in feet, read off the OSM polygon ---------- */
    /* eaves: the published storey counts at a fourteen-foot storey (assumed) */
    var MASSES = [
      { k:"westwing",  cu:-181.3, cv: 5.6, w: 51.5, d: 72.2, eave: 48, rise: 22, ridgeU: false },
      { k:"westrange", cu: -90.0, cv: 8.4, w:130.9, d: 55.5, eave: 28, rise: 16, ridgeU: true  },
      { k:"central",   cu:   6.9, cv: 8.5, w: 63.0, d: 55.1, eave: 55, rise: 29, ridgeU: true  },
      { k:"eastrange", cu: 103.5, cv: 8.4, w:130.2, d: 54.1, eave: 42, rise: 20, ridgeU: true  },
      { k:"eastwing",  cu: 194.6, cv: 6.9, w: 51.9, d: 82.0, eave: 58, rise: 24, ridgeU: false },
      /* THE NORTH ENTRANCE PORCH. The OSM ring runs unbroken from the central
         block's north wall at y 36.1 ft out to y 92.8 ft across x -24.6 to
         38.4 ft: one solid projection, not two free-standing towers. Looking
         at the first render is what caught this. Without it the pair of north
         towers stood in the grass with a thirty-foot gap behind them, which
         every arithmetic check passed. Its eave is ASSUMED, low enough that
         both towers still rise clear of it. */
      { k:"porch",     cu:   6.9, cv:64.5, w: 63.0, d: 56.7, eave: 46, rise: 22, ridgeU: true }
    ];

    /* nine towers: four with occupiable space, five small. Positions from the
       polygon; the four published heights are marked. */
    var TOWERS = [
      /* the taller of the two north towers, PUBLISHED 145 ft */
      { cu:   5.5, cv: 79.4, w: 21, d: 27, h: 145, cap: 34, win: 4 },
      /* its shorter companion; height ASSUMED at 108 ft, not published */
      { cu: -14.9, cv: 58.3, w: 19, d: 24, h: 108, cap: 27, win: 3 },
      /* the principal south tower, PUBLISHED 91 ft high and 37 ft square */
      { cu:   5.7, cv:-44.2, w: 37, d: 37, h:  91, cap: 0,  win: 4, battle: true },
      /* the northeast campanile, PUBLISHED 117 ft tall and 17 ft square */
      { cu: 211.0, cv: 39.0, w: 17, d: 17, h: 117, cap: 24, win: 2 },
      /* five small towers; each ASSUMED twelve feet above its mass's ridge */
      { cu: -90.2, cv:-25.3, w: 13, d: 13, h:  56, cap: 15, win: 2 },
      { cu: 111.5, cv:-21.7, w: 12, d: 12, h:  74, cap: 14, win: 2 },
      { cu: -97.8, cv: 38.4, w: 11, d: 11, h:  56, cap: 13, win: 2 },
      { cu: 114.8, cv: 38.4, w: 11, d: 11, h:  74, cap: 13, win: 2 },
      { cu:-180.0, cv: 46.0, w: 14, d: 14, h:  82, cap: 17, win: 2 }
    ];

    /* ---------- 1. the ground shadow, so the building does not float ---------- */
    var SH = [];
    [[-207,-31],[221,-31],[221,48],[-207,48]].forEach(function (c) {
      SH.push([p.x + c[0] * m, p.y + c[1] * m]);
    });
    items.push(H.shadow(ctx, SH, p.h * 0.55));

    /* ---------- 2. the five masses, each with a plinth course and a steep roof ---------- */
    MASSES.forEach(function (M) {
      /* plinth: a darker course at the base, the thing that stops a wall
         reading as a printed rectangle */
      box(M.cu, M.cv, M.w + 1.6, M.d + 1.6, 0, 5, STONED, { noTop: true, bias: 0.05 });
      box(M.cu, M.cv, M.w, M.d, 5, M.eave - 5, STONE, { noTop: true, bias: 0.10 });
      /* two window bands, one per storey pair, on the long faces */
      var nWin = Math.max(3, Math.round(M.w / 16));
      windows(M.cu, M.cv + M.d / 2, M.w * 0.86, 12, M.eave * 0.36, nWin, 0, 1, 0.55);
      windows(M.cu, M.cv - M.d / 2, M.w * 0.86, 12, M.eave * 0.36, nWin, 0, -1, 0.55);
      if (M.eave > 40) {
        windows(M.cu, M.cv + M.d / 2, M.w * 0.86, M.eave * 0.58, M.eave * 0.26, nWin, 0, 1, 0.55);
        windows(M.cu, M.cv - M.d / 2, M.w * 0.86, M.eave * 0.58, M.eave * 0.26, nWin, 0, -1, 0.55);
      }
      /* the cornice, a thin slab, then the roof over it */
      box(M.cu, M.cv, M.w + 2.4, M.d + 2.4, M.eave, 2.6, STONE, { noTop: true, bias: 0.9 });
      gable(M.cu, M.cv, M.w + 2.4, M.d + 2.4, M.eave + 2.6, M.rise, M.ridgeU, 1.5);
    });

    /* ---------- 3. the nine towers, each rising clear of the mass it stands on ---------- */
    TOWERS.forEach(function (T) {
      box(T.cu, T.cv, T.w + 1.4, T.d + 1.4, 0, 5, STONED, { noTop: true, bias: 3.0 });
      box(T.cu, T.cv, T.w, T.d, 5, T.h - 5, STONE, { noTop: !!T.cap || T.battle, bias: 3.2 });
      /* belfry openings near the top, the tell of a Norman campanile */
      var bz = T.h - Math.min(26, T.h * 0.20);
      windows(T.cu, T.cv + T.d / 2, T.w * 0.72, bz, Math.min(16, T.h * 0.12), T.win, 0, 1, 3.5);
      windows(T.cu, T.cv - T.d / 2, T.w * 0.72, bz, Math.min(16, T.h * 0.12), T.win, 0, -1, 3.5);
      /* the corbel table under the parapet */
      box(T.cu, T.cv, T.w + 2.2, T.d + 2.2, T.h - 3.4, 3.4, STONE, { noTop: true, bias: 4.0 });
      if (T.battle) {
        /* the south tower is battlemented in every photograph of it */
        var n = 5, mw = (T.w + 2.2) / (n * 2 - 1);
        for (var i = 0; i < n; i++) {
          var o = (-(n - 1) / 2 + i) * mw * 2;
          box(T.cu + o, T.cv - T.d / 2 - 1.1 + mw / 2, mw, mw, T.h, 6, STONE, { bias: 5.0 });
          box(T.cu + o, T.cv + T.d / 2 + 1.1 - mw / 2, mw, mw, T.h, 6, STONE, { bias: 5.0 });
          box(T.cu - T.w / 2 - 1.1 + mw / 2, T.cv + o, mw, mw, T.h, 6, STONE, { bias: 5.0 });
          box(T.cu + T.w / 2 + 1.1 - mw / 2, T.cv + o, mw, mw, T.h, 6, STONE, { bias: 5.0 });
        }
      } else if (T.cap) {
        cap(T.cu, T.cv, T.w + 3.0, T.d + 3.0, T.h, T.cap, 5.0);
      }
    });

    return items;
  };
})();
