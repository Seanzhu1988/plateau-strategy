/* dc-form-dcwar.js: the District of Columbia War Memorial, West Potomac Park.
 *
 * Frederick H. Brooke with Horace W. Peaslee and Nathan C. Wyeth, dedicated
 * 11 November 1931. The city's own memorial to its 499 dead of the First
 * World War, and the ONLY memorial on the Mall to a single city. NOT the
 * National World War I Memorial at Pershing Park, which is a different
 * memorial a mile east; NOT the National World War II Memorial, which is its
 * enormous neighbour 250 m north east and the reason this one is missed.
 *
 * ---------------------------------------------------------------------------
 * THE STYLE, named before any geometry was chosen, per MODEL_STANDARD.md
 * ---------------------------------------------------------------------------
 * The Greek Doric monopteros: a circular peristyle temple, open on every side,
 * no cella, no wall, a ring of columns carrying an entablature and a shallow
 * dome. STYLES.md carries Beaux-Arts and Neoclassical but not this, and this
 * run may not edit that shared file, so the tells built to are restated here
 * and the entry is owed:
 *   1. NO WALLS AT ALL. The thing a visitor sees is a ring of columns with
 *      daylight and the far columns visible straight through it. Drawing a
 *      drum behind the columns would turn a monopteros into a rotunda and
 *      lose the whole idea.
 *   2. DORIC, WHICH MEANS NO BASE. A Doric column stands straight on the
 *      stylobate. It gets a plain square abacus at the top and nothing at the
 *      bottom, and it is FLUTED, which at this scale reads as a shaft one
 *      tone darker down its shaded flank.
 *   3. THE ENTABLATURE IS TWO BANDS, not one: a plain architrave and a
 *      cornice that oversails it. Doric would carry a triglyph frieze
 *      between; no source reached this run says whether this one does, so it
 *      is drawn as a plain band and named as a gap.
 *   4. A SHALLOW SAUCER DOME, not a hemisphere. 47 ft overall over 22 ft
 *      columns and a 4 ft base leaves about 21 ft for entablature and dome
 *      together, so the dome is low and wide, and a hemisphere on a 44 ft
 *      circle would be 22 ft on its own and burst the published total.
 *   5. IT SITS ON A STEPPED STYLOBATE. Three steps is the classical count.
 *
 * ---------------------------------------------------------------------------
 * PUBLISHED, every figure read this run
 * ---------------------------------------------------------------------------
 *   "47-foot (14 m) tall circular, domed, peristyle Doric temple"
 *   platform "43 feet 5 inches (13.23 m)" in diameter
 *   "4-foot (1.2 m) high" marble base
 *   twelve "22-foot (6.7 m) tall" "fluted Doric marble columns"
 *     - en.wikipedia.org/wiki/District_of_Columbia_War_Memorial
 *   overall diameter 44 ft; each column "3 feet 10 inches in diameter"
 *     - nps.gov/articles/building-the-district-of-columbia-war-memorial.htm
 *   Vermont marble from the Danby quarry (same two sources)
 *   Designed to be USED: "intended for use as a bandstand", which is why the
 *   platform is a floor and not a plinth, and why there is no statue on it.
 *   499 names of the District's dead are cut into the base; a list of 26,000
 *   who served is sealed in the cornerstone.
 *
 * DERIVED, not published, and derived in the open:
 *   Column ring radius. The platform is 43'-5" across and the temple 44 ft,
 *   so the columns stand essentially at the platform edge and their shafts
 *   overhang it slightly, which is what makes the 44 ft the larger number.
 *   Ring radius is taken as (43.417 - 3.833) / 2 + 3.833 / 2 = 19.79 ft, i.e.
 *   column CENTRES on a 19.79 ft radius so their outer faces reach 21.7 ft,
 *   giving the published 43.4 ft platform and a 44 ft temple to the column
 *   face. The arithmetic is shown because the two published diameters differ
 *   by 7 inches and something had to reconcile them.
 *   Vertical budget, from the published 47 ft total: base 4, column 22,
 *   architrave 2, cornice 1.5, dome 17.5. Only the first two are published.
 *
 * NAMED GAPS, not guessed:
 *   no published step count or riser (three steps, 8 in risers, classical);
 *   no published entablature depth (split 2 + 1.5 from the 47 ft remainder);
 *   no published dome rise or profile (given the remainder, drawn as a
 *   saucer); no published statement that the frieze carries triglyphs, so
 *   none is drawn; no published inscription band height on the base.
 *
 * SCALE. p.h arrives as max(14, MIN_H=12) = 14 m, which IS the published
 * 47 ft, so no correction was needed and the true 0.3048 m per foot is used
 * throughout. The dc-3d.js place height h: 14 is correct as it stands.
 */
(function () {
  var H = window.DC3D.helpers;
  var C = H.C;
  window.DC_FORMS = window.DC_FORMS || {};
  window.DC_FORMS['dcwar'] = function (ctx, p, s, VE) {
    var FT = 0.3048;
    var items = [];
    var P = ctx.project;

    /* Vermont marble, warm and very pale. Two tones, per the checklist. */
    var MARB  = "#f2efe6";
    var MARB2 = "#ded9cc";
    var SHAD  = "#aca591";

    var cx = p.x, cy = p.y;

    /* --- the three steps, a stack of shrinking slabs (checklist 3) ------- */
    var STEP_N = 3, RISER = 0.667;           /* 8 in */
    /* LOOKING caught this: at 27 ft the top step stood 5 ft proud of the
       43'-5" platform and, from a low camera, HID the 4 ft base entirely, so
       the 499 names, which are the memorial, had nowhere to be. The steps now
       finish just outside the published platform. */
    var stepR0 = 24 * FT;                    /* outermost tread */
    var z = 0;
    for (var si = 0; si < STEP_N; si++) {
      var rS = (stepR0 - si * 0.9 * FT);
      items = items.concat(H.ngon(ctx, cx, cy, rS, z, RISER * FT, 24,
                                  si % 2 ? MARB : MARB2, C.edge));
      z += RISER * FT;
    }

    /* --- the 4 ft base, which carries the 499 names --------------------- */
    var BASE_H = 4 * FT;
    var PLAT_R = (43 + 5 / 12) / 2 * FT;     /* published 43'-5" platform */
    items = items.concat(H.ngon(ctx, cx, cy, PLAT_R, z, BASE_H, 24, MARB, C.edge));

    /* The inscription band. Not an ornament: the names ARE the memorial, and
       a blank 4 ft drum says nothing. Drawn as a recessed band one tone down,
       per checklist 8, because a one-tone-off reveal vanishes at map scale. */
    var NB = 24;
    for (var bi = 0; bi < NB; bi++) {
      var a0 = (bi / NB) * Math.PI * 2, a1 = ((bi + 1.02) / NB) * Math.PI * 2;
      var mx = Math.cos((a0 + a1) / 2), my = Math.sin((a0 + a1) / 2);
      if (!ctx.faceVisible(mx, my)) continue;
      var rb = PLAT_R * 1.002;
      var q = [P(cx + rb * Math.cos(a0), cy + rb * Math.sin(a0), z + 1.1 * FT),
               P(cx + rb * Math.cos(a1), cy + rb * Math.sin(a1), z + 1.1 * FT),
               P(cx + rb * Math.cos(a1), cy + rb * Math.sin(a1), z + 3.1 * FT),
               P(cx + rb * Math.cos(a0), cy + rb * Math.sin(a0), z + 3.1 * FT)];
      items.push({ svg: ctx.poly(q, ctx.shade(SHAD, mx, my, 0), null, 0),
                   depth: H.depthOf(q) + 0.4 });
    }
    z += BASE_H;
    var PLATFORM_Z = z;

    /* --- the platform floor. It is a BANDSTAND: you stand on it. -------- */
    var floor = [];
    for (var fi = 0; fi < 24; fi++) {
      var fa = (fi / 24) * Math.PI * 2;
      floor.push(P(cx + PLAT_R * 0.99 * Math.cos(fa), cy + PLAT_R * 0.99 * Math.sin(fa), z + 0.02));
    }
    items.push({ svg: ctx.poly(floor, "#e9e5da", C.edge, 0.3), depth: H.depthOf(floor) + 0.3 });

    /* --- twelve fluted Doric columns, drawn as twelve columns ----------- */
    /* Checklist 1. A ring of twelve, each with its own square abacus, and
       NOTHING behind them: the far columns are meant to show through. */
    var COL_H  = 22 * FT;
    var COL_D  = (3 + 10 / 12) * FT;         /* published 3'-10" */
    var RING_R = ((43 + 5 / 12) - COL_D) / 2 * FT + COL_D / 2;
    var COL_N  = 12;
    var cols = [];
    for (var ci = 0; ci < COL_N; ci++) {
      var ca = (ci / COL_N) * Math.PI * 2 + Math.PI / 12;
      var kx = cx + RING_R * Math.cos(ca), ky = cy + RING_R * Math.sin(ca);
      /* Doric: no base moulding. Shaft, then abacus. Eight sides so the
         flutes read as a round shaft rather than a post. */
      var shaft = H.ngon(ctx, kx, ky, COL_D / 2, z, COL_H, 8, MARB, null);
      /* a fluted shaft is darker on its own flank than a smooth one; the
         shade the helper applies is per-face, which is exactly the effect */
      var abac  = H.prism(ctx, kx, ky, COL_D * 1.15, COL_D * 1.15,
                          COL_D * 1.15, COL_D * 1.15, z + COL_H, 0.9 * FT,
                          MARB2, C.edge);
      cols.push({ d: ky, parts: shaft.concat(abac) });
    }
    /* Painter's order among the columns themselves: the ring is one object
       and each column's own depth is correct, so they are simply appended. */
    cols.forEach(function (c) { items = items.concat(c.parts); });
    z += COL_H + 0.9 * FT;

    /* --- entablature: architrave then an oversailing cornice ------------ */
    /* Checklist 2: two separate thin slabs, never one taller band. */
    var ARCH_H = 2 * FT, CORN_H = 1.5 * FT;
    var ENT_R  = RING_R + COL_D * 0.62;
    items = items.concat(H.ngon(ctx, cx, cy, ENT_R, z, ARCH_H, 24, MARB, C.edge));
    z += ARCH_H;
    items = items.concat(H.ngon(ctx, cx, cy, ENT_R * 1.10, z, CORN_H, 24, MARB2, C.edge));
    z += CORN_H;

    /* --- attic band, then the shallow saucer dome ----------------------- */
    /* LOOKING caught this: with the dome springing straight off the cornice
       at the full 22 ft radius, a 12 ft saucer read as a beehive sitting on
       twelve stumps. A monopteros dome springs INSIDE the cornice, and the
       published dome inscription needs a face to sit on, so a low attic ring
       carries the load in and gives the letters somewhere to be. */
    var ATT_H = 1.6 * FT;
    var ATT_R = ENT_R * 0.93;
    items = items.concat(H.ngon(ctx, cx, cy, ATT_R, z, ATT_H, 24, MARB, C.edge));
    z += ATT_H;

    /* The published 47 ft total, less everything already stacked, is what is
       left for the dome. It is a SAUCER: the crown is broad and the rise is
       small, which is the whole difference between this and a rotunda. */
    var DOME_R = ATT_R * 0.97;
    var DOME_H = (47 * FT) - z;
    if (DOME_H < 2 * FT) DOME_H = 2 * FT;
    /* One tone, not alternating. LOOKING caught that too: alternating tones
       on six rings turned a smooth dome into a ziggurat. Ten fine rings with
       one fill and no stroke read as a curve. */
    var DN = 10;
    for (var di = 0; di < DN; di++) {
      var t0 = di / DN, t1 = (di + 1) / DN;
      var r0 = DOME_R * Math.sqrt(Math.max(0, 1 - t0 * t0));
      var r1 = DOME_R * Math.sqrt(Math.max(0, 1 - t1 * t1));
      items = items.concat(H.ngon(ctx, cx, cy, Math.max(r0, DOME_R * 0.08),
                                  z + DOME_H * t0, DOME_H * (t1 - t0) + 0.01,
                                  20, MARB, null));
    }

    /* --- ground shadow (checklist 6) ------------------------------------ */
    var foot = [];
    for (var gi = 0; gi < 24; gi++) {
      var ga = (gi / 24) * Math.PI * 2;
      foot.push([cx + stepR0 * Math.cos(ga), cy + stepR0 * Math.sin(ga)]);
    }
    items.push(H.shadow(ctx, foot, 47 * FT));

    return items;
  };
})();
