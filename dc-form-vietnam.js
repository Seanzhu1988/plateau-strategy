/* dc-form-vietnam.js: the Vietnam Veterans Memorial.
 *
 * Rebuilt to MODEL_STANDARD.md. What stood here before was the generic "wall"
 * form: a low slab lying on the lawn. The Vietnam Veterans Memorial is not a
 * thing standing on the ground, it is a CUT INTO it, and a slab on the grass
 * is the opposite of the one idea the memorial has. See STYLES.md, "The wall
 * in the ground", added this run.
 *
 * RESEARCH, every number with a source checked this run.
 *
 * PUBLISHED (Wikipedia, https://en.wikipedia.org/wiki/Vietnam_Veterans_Memorial,
 * checked this run, quoted verbatim):
 *   - "Each wall is 246 feet 9 inches (75.21 m) long"
 *   - "10.1 feet (3.1 m) tall at the apex where they meet"
 *   - "8 inches (200 mm) tall at their extremities"
 *   - "meeting at an angle of 125 deg 12 min"
 *   - "Each wall has 72 panels, 70 listing names (numbered 1E through 70E and
 *     70W through 1W), and two very small blank panels at the extremities"
 *   - "The stone for the 144 panels was quarried in Bangalore, India", chosen
 *     "because of its reflective quality"
 *   - "57,939 when it was dedicated in 1982"; "as of May 2018 there were
 *     58,320 names"
 *   - site "two-acre (8,100 m2)"
 *   - "A pathway for visitors extends along the base of the Wall"
 *
 * PUBLISHED (National Park Service and the Vietnam Veterans Memorial Fund,
 * reached this run through nps.gov/vive and vvmf.wordpress.com):
 *   - the Three Servicemen "stand seven feet tall upon a base that is one foot
 *     tall", bronze, Frederick Hart, unveiled 11 November 1984
 *   - "The 12-foot-by-8-foot flag flies from a 60-foot pole"
 *
 * ORIENTATION, DERIVED rather than claimed. The memorial is always described
 * as having one wall pointing at the Washington Monument and the other at the
 * Lincoln Memorial. That is a claim this file can CHECK, because dc-3d.js
 * already carries all three coordinates. From the vertex at 38.89111,
 * -77.04778 the bearing to the Lincoln Memorial is -135.16 degrees in this
 * frame and to the Washington Monument -9.52, an interior angle of 125.63.
 * The published angle is 125 deg 12 min, which is 125.20. Half a degree apart
 * on two independently sourced numbers: the pointing is confirmed, not
 * assumed. The arms are therefore drawn on the DERIVED bisector, -72.34
 * degrees, split by the PUBLISHED angle, giving -134.94 and -9.74.
 *
 * SCALE, and this is the one deliberate departure in the file. Every other
 * dc-form takes its foot from p.h, but p.h here has been through dc-3d.js's
 * MIN_H floor: the true apex is 10.1 ft = 3.08 m, under the 12 m floor, so
 * p.h arrives inflated about four times. Scaling the PLAN by that would put a
 * 1,900 ft wall on the Mall, and scaling the HEIGHT by it would make a ten
 * foot wall read as a forty foot rampart, which is a lie about the one
 * memorial whose lowness IS the design. So this form uses the true 0.3048 m
 * per foot and ignores the floor. MIN_H exists to rescue memorials too small
 * to see; a 493 ft long wall does not need rescuing in plan, only in height,
 * and its height is the thing that must not move. The place height in
 * dc-3d.js is h: 3, which is the published 3.08 m, and needed no correction.
 *
 * NAMED GAPS, guessed nowhere, stated here rather than buried:
 *   - PANEL WIDTH is not published. Derived: 246.75 ft over the published 70
 *     named panels is 3.525 ft, 42.3 inches. The two "very small blank"
 *     panels at each extremity are not dimensioned, so they are taken from
 *     inside that run rather than added to it.
 *   - WALL THICKNESS is not published in any source reached this run. The
 *     coping is drawn 2 ft: an assumption, on its own line.
 *   - the WALKWAY's width is published only as "a pathway". Drawn 10 ft.
 *   - the CUT's back slope, from the walk up to the surrounding lawn on the
 *     open side, is not dimensioned anywhere reached. Drawn 30 ft of run.
 *   - the POSITIONS of the flagpole and the Three Servicemen are published
 *     only as "a distance away from the memorial wall". They are placed off
 *     the west arm's tip, on the grade: an assumption, on its own line.
 *   - no published dimensions for the Vietnam Women's Memorial, so it is not
 *     drawn at all. Absence over invention.
 *   - the names are 58,320 hairlines on a wall 16 pixels tall at map scale
 *     and cannot be drawn as text. The face carries the published reflective
 *     wash and a rhythm of joints instead, and claims nothing more.
 *
 * FRAME. u runs east, v runs north, z up, all in feet, origin at the VERTEX.
 * z = 0 is GRADE, which is also the top of the wall along its whole length,
 * because that is what this memorial is. The walk runs from -0.667 ft at each
 * tip down to -10.1 ft at the apex, and those two numbers are the published
 * wall heights: the wall does not rise, the visitor descends.
 *
 * PAINT. The far side of this wall is EARTH. There is no rear elevation, so
 * nothing behind the wall is drawn, and everything on the cut side (face,
 * joints, walk, back slope) is gated on that arm's front normal facing the
 * camera. Without that gate the walk, which sits ten feet BELOW a lawn plane
 * carrying depth -1e9, paints straight over the grass from the north. That is
 * the Hirshhorn balcony's lesson and the NMAAHC porch's lesson arriving a
 * third time, and it is designed in rather than discovered here.
 */
(function () {
  var H = window.DC3D.helpers;
  window.DC_FORMS = window.DC_FORMS || {};
  window.DC_FORMS['vietnam'] = function (ctx, p, s, VE) {
    var P = ctx.project, items = [];
    var FT = 0.3048 * VE;            /* true feet, see the SCALE note above */
    var m  = FT * s;
    function W(u, v) { return [p.x + u * m, p.y + v * m]; }
    function pt(u, v, z) { return P(p.x + u * m, p.y + v * m, z * FT); }

    /* ---------- published geometry, in feet ---------- */
    var LEN  = 246.75;      /* 246 ft 9 in per wall */
    var HAP  = 10.1;        /* 10.1 ft at the apex */
    var HTIP = 0.6667;      /* 8 in at the extremities */
    var NPAN = 70;          /* 70 panels listing names, per wall */
    var POLE = 60, FLAGW = 12, FLAGH = 8;
    var FIGH = 7, FIGB = 1; /* seven feet on a one foot base */
    /* assumptions, each named in the header */
    var THK  = 2;           /* coping / wall thickness */
    var WALK = 10;          /* pathway width */
    var GRADE = 2.5;        /* the back slope's run per foot of depth, 1 in 2.5.
                               A FIXED width was wrong and the picture said so:
                               the cut is 10 ft deep at the apex and 8 in deep
                               at the tip, so a constant 30 ft apron made a
                               green ramp of even width beside a wall that
                               vanishes. A slope has a GRADE, not a width. */

    /* arms: derived bisector, published included angle */
    var D2R = Math.PI / 180;
    var BIS = -72.34 * D2R, HALF = (125 + 12 / 60) / 2 * D2R;
    var ARMS = [BIS - HALF, BIS + HALF];   /* west toward Lincoln, east toward the Monument */

    /* ---------- materials ---------- */
    var GRAN  = "#1c1f24";  /* Bangalore black granite, polished */
    var GRANL = "#333a42";  /* the same stone where the sky falls on it */
    var COPE  = "#2a2f35";
    var PAVE  = "#bfc0b4";  /* granite pathway */
    var LAWN  = "#98ab7c";
    var EARTH = "#8a9a70";  /* the cut slope, mown but in shade of the bank */
    var BRONZE= "#7a6a4a";
    var POLEC = "#c9c8c2";
    var FLAGC = "#c0392b";

    /* ---------- the site pad ----------
       The only-vietnam scene sizes its lawn from p.h, and p.h is the MIN_H
       floor, so the stock pad is smaller than this model. The memorial's own
       two acres are published, so it brings its own ground, sorted under
       everything and above the base lawn. */
    (function () {
      /* 300 ft, because the arms alone reach 246.75 and the additions sit
         beyond the west tip. At 230 the coping ran off the pad and the model
         sat on a pale rectangle of paper, which is a fault this project has
         seen before. The tone is the host's own lawn, so the two grounds
         meet without a seam rather than framing the memorial. */
      var R = 300;
      items.push({ svg: ctx.poly([pt(-R,-R,0), pt(R,-R,0), pt(R,R,0), pt(-R,R,0)],
                                 H.C.lawn || LAWN, null, 0), depth: -1e9 + 0.3 });
    })();

    /* ---------- one arm ---------- */
    ARMS.forEach(function (a, ai) {
      var du = Math.cos(a), dv = Math.sin(a);
      /* the front normal is the perpendicular that points INTO the V, i.e.
         the one agreeing with the bisector the memorial opens along */
      var nu = -dv, nv = du;
      if (nu * Math.cos(BIS) + nv * Math.sin(BIS) < 0) { nu = -nu; nv = -nv; }
      var faces = ctx.faceVisible(nu, nv);

      function hAt(t) { return HAP + (HTIP - HAP) * t; }        /* t: 0 apex, 1 tip */
      /* a point on the wall's FRONT plane at run t */
      function f(t, z) { return pt(du * LEN * t, dv * LEN * t, z); }
      /* a point offset perpendicular from the front plane by d feet */
      function o(t, d, z) {
        return pt(du * LEN * t + nu * d, dv * LEN * t + nv * d, z);
      }

      /* --- the cut, drawn only from the open side --- */
      if (faces) {
        var SEG = 24;
        for (var i = 0; i < SEG; i++) {
          var t0 = i / SEG, t1 = (i + 1) / SEG;
          var z0 = -hAt(t0), z1 = -hAt(t1);
          /* the walkway at the base of the wall */
          /* the far edge overruns its neighbour by a fraction of a segment.
             Abutting quads round apart under toFixed and leave a ladder of
             pale seams, which is exactly the starburst the Hirshhorn ring
             taught, and it showed here as stripes down the bank. */
          var t1o = Math.min(1, t1 + 0.35 / SEG), z1o = -hAt(t1o);
          var wq = [o(t0, 0, z0), o(t1o, 0, z1o), o(t1o, WALK, z1o), o(t0, WALK, z0)];
          items.push({ svg: ctx.poly(wq, ctx.shade(PAVE, 0, 0, 1), null, 0),
                       depth: H.depthOf(wq) - 2500 });
          /* the bank rising from the walk back to grade, at a constant GRADE
             so it shrinks to nothing where the wall does */
          var r0 = hAt(t0) * GRADE, r1 = hAt(t1o) * GRADE;
          var sq = [o(t0, WALK, z0), o(t1o, WALK, z1o),
                    o(t1o, WALK + r1, 0), o(t0, WALK + r0, 0)];
          items.push({ svg: ctx.poly(sq, ctx.shade(EARTH, nu * 0.3, nv * 0.3, 0.95), null, 0),
                       depth: H.depthOf(sq) - 3000 });
        }
      }

      /* --- the wall face, one quad per arm, then its rhythm --- */
      if (faces) {
        var fq = [f(0, 0), f(1, 0), f(1, -hAt(1)), f(0, -hAt(0))];
        items.push({ svg: ctx.poly(fq, ctx.shade(GRAN, nu, nv, 0), null, 0),
                     depth: H.depthOf(fq) });
        /* polished black granite reads by reflection: the sky falls on the
           upper part of the face, which is why photographs of it are never
           flat black. Two thirds up, one tone lighter, no new geometry. */
        var rq = [f(0, 0), f(1, 0), f(1, -hAt(1) * 0.34), f(0, -hAt(0) * 0.34)];
        items.push({ svg: ctx.poly(rq, ctx.shade(GRANL, nu, nv, 0.35), null, 0),
                     depth: H.depthOf(rq) + 0.4 });
        /* panel joints. 70 hairlines per wall at this scale is the NMAAHC
           brick wall again, so one joint every fifth panel, one tone off. */
        for (var k = 5; k < NPAN; k += 5) {
          var t = k / NPAN, w = 0.35 / LEN;
          var jq = [f(t, 0), f(t + w, 0), f(t + w, -hAt(t + w)), f(t, -hAt(t))];
          items.push({ svg: ctx.poly(jq, ctx.shade(COPE, nu, nv, 0), null, 0),
                       depth: H.depthOf(jq) + 0.8 });
        }
      }

      /* --- the coping. The top of the wall is the GROUND, so it is drawn
             from every angle: from behind, it is all you see. --- */
      var cq = [f(0, 0), f(1, 0), o(1, -THK, 0), o(0, -THK, 0)];
      items.push({ svg: ctx.poly(cq, ctx.shade(COPE, 0, 0, 1), null, 0),
                   depth: H.depthOf(cq) + 1.2 });

      /* --- what an arm looks like from BEHIND. The picture caught this and
             no count could have: with the face culled, a 2 ft coping is a
             black hairline ending in mid lawn, and it reads as a scratch on
             the drawing rather than as a wall. From the uphill side a visitor
             does see a stone line, but they also see the SHADOWED SLOT beyond
             it, because the cut falls away out of sight. That slot is what
             gives the line its weight, so it is drawn: a narrow dark band on
             the far side of the coping, and nothing else, because nothing
             else is visible from there. --- */
      if (!faces) {
        var vq = [f(0, 0), f(1, 0), o(1, 4.5, 0), o(0, 4.5, 0)];
        items.push({ svg: ctx.poly(vq, "#20242a", null, 0, ' opacity="0.85"'),
                     depth: H.depthOf(vq) + 1.0 });
      }
    });

    /* ---------- the shadow of the cut ----------
       A rift has no silhouette to cast, so what grounds it is the wall's own
       shade falling into the walk. One soft strip per arm, inside the cut. */
    ARMS.forEach(function (a) {
      var du = Math.cos(a), dv = Math.sin(a);
      var nu = -dv, nv = du;
      if (nu * Math.cos(BIS) + nv * Math.sin(BIS) < 0) { nu = -nu; nv = -nv; }
      if (!ctx.faceVisible(nu, nv)) return;
      var q = [pt(0, 0, -HAP + 0.05),
               pt(du * LEN, dv * LEN, -HTIP + 0.05),
               pt(du * LEN + nu * 3.5, dv * LEN + nv * 3.5, -HTIP + 0.05),
               pt(nu * 3.5, nv * 3.5, -HAP + 0.05)];
      items.push({ svg: ctx.poly(q, "#000", null, 0, ' opacity="0.20"'),
                   depth: H.depthOf(q) - 2400 });
    });

    /* ---------- the additions, which stand apart and stand UP ----------
       Position is a named gap; the SIZES are published. Off the west arm's
       tip, on the grade, deliberately not continuous with the cut. */
    (function () {
      var aw = ARMS[0], du = Math.cos(aw), dv = Math.sin(aw);
      var nu = -dv, nv = du;
      if (nu * Math.cos(BIS) + nv * Math.sin(BIS) < 0) { nu = -nu; nv = -nv; }
      var bu = du * (LEN + 28) + nu * 44, bv = dv * (LEN + 28) + nv * 44;

      /* a box in local feet, culled per face, with a top */
      function box(cu, cv, wu, wv, z0, z1, fill, bias) {
        var hx = wu / 2, hy = wv / 2;
        var lo = [[cu-hx,cv-hy],[cu+hx,cv-hy],[cu+hx,cv+hy],[cu-hx,cv+hy]];
        var nm = [[0,-1],[1,0],[0,1],[-1,0]];
        for (var i = 0; i < 4; i++) {
          if (!ctx.faceVisible(nm[i][0], nm[i][1])) continue;
          var j = (i + 1) % 4;
          var q = [pt(lo[i][0],lo[i][1],z0), pt(lo[j][0],lo[j][1],z0),
                   pt(lo[j][0],lo[j][1],z1), pt(lo[i][0],lo[i][1],z1)];
          items.push({ svg: ctx.poly(q, ctx.shade(fill, nm[i][0], nm[i][1], 0), null, 0),
                       depth: H.depthOf(q) + (bias || 0) });
        }
        var tq = lo.map(function (c) { return pt(c[0], c[1], z1); });
        items.push({ svg: ctx.poly(tq, ctx.shade(fill, 0, 0, 1), null, 0),
                     depth: H.depthOf(tq) + (bias || 0) + 0.5 });
      }

      /* the flagpole: 60 ft, with the published 12 by 8 ft flag at the top */
      box(bu, bv, 4, 4, 0, 2.5, "#a8a49a", 0);            /* the emblem base */
      box(bu, bv, 1.1, 1.1, 2.5, POLE, POLEC, 0);
      var fq = [pt(bu, bv, POLE), pt(bu + FLAGW, bv, POLE),
                pt(bu + FLAGW, bv, POLE - FLAGH), pt(bu, bv, POLE - FLAGH)];
      items.push({ svg: ctx.poly(fq, FLAGC, null, 0), depth: H.depthOf(fq) + 2 });
      /* a canton, so a 12 by 8 ft rectangle reads as the flag it is and not
         as a red pennant pulling the eye off the memorial */
      var cn = [pt(bu, bv, POLE), pt(bu + FLAGW * 0.42, bv, POLE),
                pt(bu + FLAGW * 0.42, bv, POLE - FLAGH * 0.54), pt(bu, bv, POLE - FLAGH * 0.54)];
      items.push({ svg: ctx.poly(cn, "#2b3a67", null, 0), depth: H.depthOf(cn) + 2.2 });

      /* the Three Servicemen: seven feet on a one foot base */
      var su = bu + du * 34 + nu * 16, sv = bv + dv * 34 + nv * 16;
      box(su, sv, 11, 8, 0, FIGB, "#b9b5a8", 0);
      [[-3.2, -1.2], [0.4, 1.4], [3.4, -0.8]].forEach(function (d) {
        box(su + d[0], sv + d[1], 2.0, 1.3, FIGB, FIGB + FIGH * 0.72, BRONZE, 0.6);
        box(su + d[0], sv + d[1], 1.2, 1.1, FIGB + FIGH * 0.72, FIGB + FIGH, BRONZE, 0.8);
      });
      items.push(H.shadow(ctx, [W(bu-6,bv-6), W(bu+6,bv-6), W(bu+6,bv+6), W(bu-6,bv+6)], 4 * FT));
      items.push(H.shadow(ctx, [W(su-6,sv-5), W(su+6,sv-5), W(su+6,sv+5), W(su-6,sv+5)], 5 * FT));
    })();

    return items;
  };
})();
