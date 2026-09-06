/* nyc-form-trump.js: Trump Tower, 725 Fifth Avenue, as a massing model.
 * Built to MODEL_STANDARD.md, 2026-09-05 [SEAN: "create realistic trump
 * building at fifth ave"].
 *
 * Registers window.NYC_FORMS.trump and is drawn by nyc-3d.js's own renderer,
 * the same one the Brooklyn Bridge and the Empire State use. Feet throughout,
 * origin at the centre of the tower's plan, z up from the Fifth Avenue
 * sidewalk, +x east toward Fifth Avenue, +y north toward 57th Street.
 *
 * PUBLISHED, quoted from the Wikipedia article on Trump Tower, which cites
 * the AIA Guide, the Landmarks Preservation Commission and contemporary
 * press, read this run:
 *
 *   height          "664 feet (202 m) high"
 *   storeys         "58-story"; the top storey is marked 68 on Trump's
 *                   calculation that "the five-story-tall public atrium
 *                   occupied the height of ten ordinary stories", and "the
 *                   tower did not have any floors numbered 6-13", so the
 *                   numbering runs ten ahead of the count
 *   use             "thirteen office stories spanning floors 14 to 26, then
 *                   another thirty-nine stories containing 263 residential
 *                   condominiums on floors 30 to 68"
 *   the form        "28-sided" with "horizontal setbacks"
 *   the glass       "gold-tinted, reflective glass"
 *   the atrium      a "five-story, 15,000-square-foot (1,400 m2) atrium" with
 *                   a "60-foot-tall (18 m) indoor waterfall" and "240 tons of
 *                   Breccia Pernice, a pink white-veined marble"
 *   the sign        "34-inch-high (86 cm) brass capital letters"
 *   elevators       "34"
 *   architect       "Der Scutt of Swanke Hayden Connell Architects"
 *   built           begun 1979, topped out July 1982, the forty ground-level
 *                   stores opening 30 November 1983; about $300 million
 *
 * MEASURED THIS RUN, not published: the lot outline, from OpenStreetMap way
 * "Trump Tower", addr 721/725 5th Avenue, through Overpass. Twenty four
 * vertices spanning 197.5 by 184.7 ft. That is the LOT with its retail
 * podium, not the tower above it, and it is used for the podium only.
 *
 * DERIVED, in the open, because no source reached publishes a plan:
 *   the 28 sides   the count is published and the DISTRIBUTION is not, so the
 *                  sawtooth is put where Der Scutt put it and where every
 *                  photograph shows it: 8 bays on the Fifth Avenue face and 5
 *                  on the 56th Street face, two sides each, with the north
 *                  and west elevations flat. 16 + 10 + 2 = 28 exactly. The
 *                  serration is the whole reason this building looks the way
 *                  it does: Scutt cut it so that more apartments face the
 *                  park, and a flat glass slab here is a different tower.
 *
 * ASSUMED and drawn, every one named rather than implied: the podium height
 * 82 ft (the atrium is published as five storeys and its waterfall as 60 ft,
 * so the podium cannot be shorter than 60; no source gives its real height);
 * the tower plan 132 by 126 ft; the sawtooth bay depth 9 ft; the two setbacks
 * at 470 and 590 ft and their 11 ft steps ("horizontal setbacks" is published,
 * their number and height is not); the storey band at 11.4 ft, which is 664
 * divided by the published 58; the mullion spacing; the entrance canopy; the
 * sign band; the sidewalk width.
 *
 * NOT DRAWN, and said out loud: the atrium, the waterfall and the pink marble
 * are the building's famous interior and none of it is visible from the
 * street, which is what this model draws. The brass letters are drawn as a
 * band rather than as letterforms, because 34 inches of lettering is under a
 * pixel at this scale.
 *
 * CHECKLIST 4, said out loud: the roof really is flat. This is a 1983 glass
 * tower with a mechanical crown and a parapet, not a spire, and the setbacks
 * are the whole of what happens at the top.
 */
(function () {
  var H = window.NYC3D.helpers, C = H.C;
  window.NYC_FORMS = window.NYC_FORMS || {};

  function trumpScene(opts) {
    var o = opts || {};
    var f = [], lines = [], marks = [];
    var S = 0.66;                                  /* feet to model units */
    function P(x, y, z) { return [x * S, y * S, z * S]; }

    /* CHECKLIST 5, two tones per material. The published glass is gold
       tinted and reflective, which is the one colour fact this building
       carries, so it is the model's whole palette: a warm bronze that goes
       lighter where a face turns to the sun and darker in the returns of the
       sawtooth. The renderer's own shader does the rest. */
    var GLASS = "#9c8143", GLASS_L = "#c4a55c", GLASS_D = "#6f5a2b";
    var MULL = "#54451f", BAND = "#6a5629";
    var STONE = "#cdc7b8", STONE_D = "#b3ac9c";
    var BRASS = "#b08d3a", BRASS_D = "#8a6d24";
    var WALK = "#d9d5cb", ROAD = "#9a978f", SHADOW = "#b9b5aa";

    var HT = 664;                 /* published */
    var PODIUM = 82;              /* ASSUMED, and no lower than the published 60 ft waterfall */
    var STOREY = HT / 58;         /* 11.45 ft, the published height over the published count */
    var TW = 132 / 2, TD = 126 / 2;   /* ASSUMED tower plan */
    /* ASSUMED bay depth. Drawn at 9 ft first and the tower came back
       CORRUGATED, a radiator rather than a faceted glass slab: eight bays
       across 132 ft is a 16.5 ft bay, and 9 ft of depth on a 16.5 ft bay is a
       45 degree fold. The published fact is the COUNT of sides, not their
       depth, so the depth is what gives. At 5 ft the same 28 sides read as
       facets catching the light differently, which is what the building does. */
    var TOOTH = 5;
    var SET1 = 470, SET2 = 590, STEP = 11;   /* ASSUMED setbacks; "horizontal setbacks" is published */

    /* ---- THE PLAN, and its 28 sides. Walking the outline once, so the count
       is a fact about the geometry rather than a claim in a comment: south
       west corner, north up the west face, east along the north face, then
       DOWN the Fifth Avenue face in 8 sawtooth bays, then WEST along 56th
       Street in 5. */
    function plan(inset) {
      var w = TW - inset, d = TD - inset, t = Math.max(0, TOOTH - inset * 0.5);
      var p = [];
      p.push([-w, -d]);                       /* 1: the west face, one side */
      p.push([-w, d]);
      var i, u;
      /* the north face, flat: one side, to the north east corner */
      p.push([w, d]);
      /* FIFTH AVENUE, 8 bays of two sides each: out to the tooth, back in */
      for (i = 0; i < 8; i++) {
        u = d - (2 * d) * ((i + 0.5) / 8);
        p.push([w + t, u]);
        u = d - (2 * d) * ((i + 1) / 8);
        p.push([w, u]);
      }
      /* 56th STREET, 5 bays of two sides each, running back west. The LAST
         bay does not push its closing point: that point is the south west
         corner the walk started from, and pushing it again closes the outline
         on a duplicate vertex and a zero length side. Drawn that way first,
         the plan came back with 29 sides against a published 28, which is the
         cheapest possible way to find out that a count in a header is not the
         same thing as a count in the geometry. */
      for (i = 0; i < 5; i++) {
        u = w - (2 * w) * ((i + 0.5) / 5);
        p.push([u, -d - t]);
        if (i === 4) break;
        u = w - (2 * w) * ((i + 1) / 5);
        p.push([u, -d]);
      }
      return p;
    }
    var SIDES = plan(0).length;   /* 1 west + 1 north + 16 avenue + 10 street = 28 */

    /* ---- the street. Fifth Avenue runs north to south on the east side and
       56th Street runs east to west on the south, which is what puts the
       sawtooth on those two faces and nowhere else. */
    f.push(H.face([P(-260, -300, 0), P(300, -300, 0), P(300, 320, 0), P(-260, 320, 0)],
                  WALK, { flat: true }));
    f.push(H.face([P(150, -300, 0.3), P(300, -300, 0.3), P(300, 320, 0.3), P(150, 320, 0.3)],
                  ROAD, { flat: true }));
    f.push(H.face([P(-260, -300, 0.3), P(300, -300, 0.3), P(300, -190, 0.3), P(-260, -190, 0.3)],
                  ROAD, { flat: true }));

    /* CHECKLIST 6: a ground shadow. Nothing here casts light, so a 664 ft
       tower without one floats on its own sidewalk. Thrown away from the
       renderer's sun, which is up and to the left, so the shadow lies to the
       north east across the avenue. */
    (function () {
      var q = [P(-TW - 6, -TD - 20, 0.6), P(TW + 34, -TD - 8, 0.6),
               P(TW + 46, TD + 26, 0.6), P(-TW + 6, TD + 16, 0.6)];
      f.push(H.face(q, SHADOW, { flat: true, bias: 0.2 }));
    })();

    /* ---- a ring of quads between two plans at two heights, culled on its
       own outward normal. This is the whole tower: the sawtooth is not an
       ornament laid on a box, it is the plan, so every storey is drawn from
       the same 28 sided outline. */
    function ring(pa, za, pb, zb, base, opt) {
      var n = pa.length, i, out = [];
      for (i = 0; i < n; i++) {
        var a0 = pa[i], a1 = pa[(i + 1) % n];
        var b0 = pb[i], b1 = pb[(i + 1) % n];
        /* the outward normal of this side, in plan */
        var ex = a1[0] - a0[0], ey = a1[1] - a0[1];
        var L = Math.hypot(ex, ey) || 1;
        var nx = ey / L, ny = -ex / L;
        var q = [P(a0[0], a0[1], za), P(a1[0], a1[1], za),
                 P(b1[0], b1[1], zb), P(b0[0], b0[1], zb)];
        /* WHAT LOOKING CAUGHT: this used to pick a lighter or darker glass by
           hand from the side's own normal, on top of the renderer's shader
           doing the same job. The two stacked and the 56th Street elevation
           came back nearly black, a dark slab beside a lit one rather than
           one building in two lights. The shader is what shading is for. The
           only tone set here now is the LIGHT one on the sawtooth's outward
           facets, which is what a faceted glass wall does when half its faces
           catch the sky, and it is set once rather than three ways. */
        var col = (opt && opt.tone && Math.abs(nx) > 0.55) ? GLASS_L : base;
        out.push({ q: q, nx: nx, ny: ny, col: col });
      }
      return out;
    }
    function drawRing(r, edge, bias) {
      r.forEach(function (s) {
        f.push(H.face(s.q, s.col, { stroke: edge, width: 0.35, bias: bias || 0 }));
      });
    }
    function lift(p, z) { return p; }

    /* ---- THE PODIUM, on the measured lot rather than the derived tower plan.
       Stone below, because the retail base is stone and bronze at the street
       and the glass starts above it. */
    var LOT = [[-96, -92], [96, -92], [96, 92], [-96, 92]];
    (function () {
      var n = LOT.length, i;
      for (i = 0; i < n; i++) {
        var a = LOT[i], b = LOT[(i + 1) % n];
        var ex = b[0] - a[0], ey = b[1] - a[1], L = Math.hypot(ex, ey) || 1;
        var nx = ey / L, ny = -ex / L;
        f.push(H.face([P(a[0], a[1], 0.6), P(b[0], b[1], 0.6),
                       P(b[0], b[1], PODIUM), P(a[0], a[1], PODIUM)],
                      nx > 0.5 || ny < -0.5 ? STONE : STONE_D,
                      { stroke: "#9a9384", width: 0.4 }));
      }
      /* the podium's own cornice, its own slab, so the glass does not grow
         straight out of the stone */
      f = f.concat(H.box(P(-99, 0, 0)[0], P(99, 0, 0)[0], P(0, -95, 0)[1], P(0, 95, 0)[1],
                         P(0, 0, PODIUM)[2], P(0, 0, PODIUM + 4)[2], STONE));
      /* the glazed shopfronts, a dark band at street level, and the published
         brass sign band above the Fifth Avenue entrance */
      lines.push({ a: P(96, -92, 26), b: P(96, 92, 26), colour: MULL, width: 2.2 });
      f.push(H.face([P(96.5, -26, 30), P(96.5, 26, 30), P(96.5, 26, 38), P(96.5, -26, 38)],
                    BRASS, { stroke: BRASS_D, width: 0.5, bias: 0.6 }));
      /* the entrance canopy */
      f.push(H.face([P(96, -16, 24), P(112, -16, 24), P(112, 16, 24), P(96, 16, 24)],
                    BRASS_D, { bias: 0.7 }));
    })();

    /* ---- THE TOWER. Three stacked shafts, stepping in at the two assumed
       setbacks, each drawn from the same 28 sided plan so the sawtooth runs
       the full height, which is what it does in life. */
    var shafts = [[PODIUM + 4, SET1, 0], [SET1, SET2, STEP], [SET2, HT, STEP * 2]];
    shafts.forEach(function (sh, si) {
      var p = plan(sh[2]);
      drawRing(ring(p, sh[0], p, sh[1], GLASS, { tone: true }), MULL, si * 0.05);
      /* the setback terrace's own floor, and the parapet at the very top */
      if (si < 2) {
        var pn = plan(shafts[si + 1][2]);
        var q = p.map(function (pt) { return P(pt[0], pt[1], sh[1]); });
        f.push(H.face(q, STONE_D, { bias: 0.9 + si * 0.05 }));
      }
    });
    /* the roof, flat, said out loud in the header */
    (function () {
      var p = plan(STEP * 2);
      f.push(H.face(p.map(function (pt) { return P(pt[0], pt[1], HT); }), "#6f6a5e", { bias: 1.2 }));
      /* the parapet, its own thin slab, so the tower does not end on a cut */
      drawRing(ring(p, HT, p, HT + 6, "#7d7768"), "#57523f", 1.3);
    })();

    /* ---- THE STOREYS. 58 of them, published, drawn as the spandrel band at
       every floor line. This is what a glass tower has instead of a cornice
       and it is the only thing that gives 664 ft a scale. */
    (function () {
      var z, i = 0;
      for (z = PODIUM + 4 + STOREY; z < HT - 2; z += STOREY) {
        var inset = z < SET1 ? 0 : (z < SET2 ? STEP : STEP * 2);
        var p = plan(inset);
        var n = p.length, k;
        for (k = 0; k < n; k++) {
          var a = p[k], b = p[(k + 1) % n];
          var ex = b[0] - a[0], ey = b[1] - a[1], L = Math.hypot(ex, ey) || 1;
          var nx = ey / L, ny = -ex / L;
          if (!(nx > 0.15 || ny < -0.15)) continue;   /* only the faces the eye sees */
          f.push(H.face([P(a[0], a[1], z), P(b[0], b[1], z),
                         P(b[0], b[1], z + 2.2), P(a[0], a[1], z + 2.2)],
                        BAND, { bias: 0.6 }));
        }
        i++;
      }
    })();

    marks.push({ at: P(0, 0, HT + 40), text: 'Trump Tower',
                 sub: '664 ft, 58 storeys, 28 sides' });
    marks.push({ at: P(96, 0, 34), fill: C.hi, text: 'Fifth Avenue',
                 sub: 'the atrium and the shops' });

    return { w: 720, h: 620, faces: f, lines: lines, marks: marks, sides: SIDES };
  }

  window.NYC_FORMS.trump = trumpScene;
})();
