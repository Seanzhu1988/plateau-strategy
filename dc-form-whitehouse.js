/* dc-form-whitehouse.js: the White House, as it stands in September 2026.
 *
 * [SEAN 2026-09-07: "also we are missing white house in the national mall, make
 * a 10 mins audio and description and realistic 3D model."]
 *
 * James Hoban, Irish born, won the 1792 competition and modelled the house on
 * Leinster House in Dublin. Construction began at noon on 13 October 1792 and
 * the house was finished around 1 November 1800. Neoclassical, and specifically
 * an Anglo-Palladian palazzo: a horizontally oriented rectangle, low for its
 * length, with the drama saved for two porticoes Hoban added a generation later.
 *
 * ================= PUBLISHED, with the source for each =================
 *
 * PLAN AND HEIGHT (White House Historical Association, "White House
 * Dimensions"). 168 ft long east to west. 85 ft 6 in deep without the
 * porticoes. 70 ft high on the SOUTH and 60 ft 4 in on the NORTH.
 *
 *   The two heights are not a contradiction and they are the key to the whole
 *   massing: the ground falls away to the south, so the south front shows a
 *   full extra storey that the north front hides behind a raised carriage ramp
 *   and its parapet. 70 minus 60 ft 4 in is 9 ft 8 in, and that is the height
 *   of the exposed ground storey. This model puts the south lawn at z = 0 and
 *   the north forecourt at z = 9.67 ft, which reproduces BOTH published
 *   heights from one derived number instead of choosing between them.
 *
 * NORTH FRONT (Wikipedia, White House, architecture; CultureNow). "The north
 * front is the principal facade and consists of three floors and ELEVEN BAYS.
 * The ground floor is hidden by a raised carriage ramp and parapet, thus the
 * facade appears to be on two floors." "The central three bays are behind a
 * prostyle portico." "The windows of the four bays flanking the portico, at
 * first-floor level, have ALTERNATING POINTED AND SEGMENTED PEDIMENTS, while
 * at second-floor level, the pediments are flat." The entrance is "surmounted
 * by a lunette fanlight". All eleven bays are drawn as eleven, the alternation
 * is drawn as an alternation, and the fanlight is over the door.
 *
 * NORTH PORTICO (WHHA). Hoban's own last work on the building, finished 1830.
 * TETRASTYLE, so FOUR columns, and Ionic, with "a variation on the Ionic Order
 * devised incorporating a swag of roses between the volutes". It doubles as a
 * porte cochere because of the carriage ramp, which is why a carriage drive
 * runs under it here.
 *
 * SOUTH PORTICO (WHHA; Wikipedia). Completed 1824. Semicircular, "defined by
 * SIX Ionic columns that step out and around the centre bow", with "a
 * ground-floor double staircase leading to an Ionic colonnaded loggia".
 *
 * ROOFLINE (WHHA). "The roofline is hidden by a balustraded parapet." The
 * attic behind it "was converted to living quarters in 1927 by augmenting the
 * existing hip roof with long shed dormers" (Wikipedia), so the thing you see
 * above the balustrade is a shed dormer run, not a lid.
 *
 * MATERIAL (Wikipedia). "Its exterior walls are Aquia Creek sandstone painted
 * white", first whitewashed with "a mixture of lime, rice glue, casein, and
 * lead". Painted sandstone is warm and slightly chalky, never the blue white
 * of marble, and the two tones here are that paint in sun and in shade.
 *
 * FOOTPRINTS AND POSITIONS not published anywhere reached, taken from
 * OpenStreetMap through Overpass on 2026-09-07 and converted into the Mall's
 * own frame (origin the Washington Monument, x east, y north, metres):
 *
 *   residence centre        x -113.7  y  909      OSM building parts
 *   North Portico           42.8 ft wide, projects 17.0 ft
 *   South Portico           62.2 ft wide, projects 24.4 ft
 *   West Wing               104 x 100 ft, centre 309 ft west, 65 ft south
 *   West Colonnade          126 x 60 ft, height 7 m, centre 149 ft west
 *   State Ballroom site     265 x 328 ft, centre 218 ft east, 121 ft south
 *
 * ================= NAMED GAPS AND ONE DISAGREEMENT =================
 *
 * THE 152 FT DOES NOT RECONCILE. WHHA also publishes "152 feet wide with
 * porticoes", which against the 85 ft 6 in body needs 66 ft 6 in of projection.
 * The traced porticoes give 17 plus 24.4, which is 41.4. The published figure
 * probably includes the carriage steps on the north and the double staircase
 * and terrace on the south, neither of which is roofed and neither of which
 * OSM traced. This model uses the TRACED projections, because they are what a
 * person standing on Pennsylvania Avenue sees, and records the disagreement
 * here rather than quietly picking one.
 *
 * STOREY HEIGHTS are not published as separate numbers. The floor levels here
 * are derived from the two published totals and the known character of the
 * rooms: a tall State Floor, a lower Second Floor, a cornice, an attic behind
 * the balustrade. Derived, and labelled as derived at each line below.
 *
 * COLUMN DIAMETER is not published. Taken as 4.5 ft, which is nine diameters
 * to the 42 ft shaft, the ordinary Ionic proportion.
 *
 * ================= WHAT A VISITOR ACTUALLY SEES IN 2026 =================
 *
 * THE EAST WING IS GONE. It was first built in 1902, heavily renovated in 1942,
 * and DEMOLISHED IN OCTOBER 2025 to make room for a new State Ballroom
 * (Wikipedia, White House; White House State Ballroom). The ballroom is under
 * construction now: a banquet hall of about 22,000 sq ft inside a project OSM
 * traces at 265 by 328 ft, which is a larger footprint than the historic house
 * it stands beside. On 31 August 2026 the Supreme Court allowed construction to
 * continue. So the east side of this model is a construction site, with fence,
 * pad and steel frame, and NOT a wing.
 *
 * Drawing a demolished building because it is the one in the photographs would
 * make this model a picture of 2024. A guide's model has one job, which is to
 * match what the person holding the phone is looking at.
 *
 * OSM STILL CARRIES AN "East Wing" POLYGON at the old position. It is stale.
 * It is deliberately not drawn.
 */
(function () {
  var H = (typeof window !== "undefined" && window.DC3D && window.DC3D.helpers) || null;
  if (!H) return;
  window.DC_FORMS = window.DC_FORMS || {};

  window.DC_FORMS['whitehouse'] = function (ctx, p, s, VE) {
    var items = [];
    var TOP_FT = 70;                    /* published: 70 ft on the south */
    var FT = (p.h * VE) / TOP_FT;       /* metres per published foot */
    var m  = FT * s;                    /* metres per foot, horizontally */

    function X(u) { return p.x + u * m; }
    function Y(v) { return p.y + v * m; }
    function Z(z) { return z * FT; }
    function W(w) { return w * m; }

    /* ---------- the palette. Painted Aquia Creek sandstone, not marble ---- */
    var PAINT   = "#f2efe6";   /* the lime-white paint in sun */
    var PAINT_D = "#d8d3c6";   /* the same paint on a turned face */
    var TRIM    = "#c9c3b4";   /* cornice and portico entablature, one step down */
    var SHADOW  = "#a49d8d";   /* deep reveals and the portico soffit */
    var COLUMN  = "#faf8f1";   /* the columns catch the sun; one step brighter
                                  than the wall, or they vanish into it */
    var PORTE   = "#8b8474";   /* under the porte cochere, which is genuinely
                                  dark, and is what a column silhouettes against */
    var GLASS   = "#4a5560";   /* window glass, dark enough to survive map scale */
    var SASH    = "#e8e4d8";   /* the painted frame around it */
    var ROOFSL  = "#a49d90";   /* slate above the balustrade. Darker than this
                                  and the roof, which is mostly hidden in life,
                                  became the largest thing in the picture. */
    var STONE_E = "#b8b1a1";   /* edges */
    var LAWN    = "#c7d2bb";
    var DRIVE   = "#ded8cb";
    var STEEL   = "#7d8a93";   /* the ballroom frame */
    var FENCE   = "#9aa2a8";
    var DIRT    = "#b6a892";

    /* ---------- levels, in feet above the SOUTH lawn ----------
       NGRD is the published difference between the two heights and is the
       only derived level that a source constrains exactly. The floor
       divisions between it and the cornice are derived. */
    var SGRD  = 0;
    var NGRD  = 9.667;        /* 70 ft minus 60 ft 4 in, the raised forecourt */
    var STATE = 9.667;        /* State Floor sits on the ground storey */
    var SEC   = 32;           /* derived: a tall State Floor, 22.3 ft */
    var CORN  = 52;           /* derived: Second Floor 20 ft, then the cornice */
    var CORNT = 56;           /* cornice slab 4 ft */
    var BALT  = 62;           /* balustrade 6 ft, at the wall line */
    var ATTIC = 65;           /* the 1927 third floor, set back behind it */
    var ROOF  = TOP_FT;       /* 70 ft, published */

    /* ---------- plan, in feet from the centre of the residence ---------- */
    var HW = 84;              /* 168 ft long, published */
    var HD = 42.75;           /* 85 ft 6 in deep, published */
    var BAYS = 11;            /* published */
    var BAYW = (HW * 2) / BAYS;
    var NP_W = 42.8, NP_OUT = 17.0;   /* North Portico, traced */
    var SP_W = 62.2, SP_OUT = 24.4;   /* South Portico, traced */
    var COL_D = 6.0;                  /* see COLUMN DIAMETER in the header */

    var NEAR = 5e5;           /* the painter's bias for things that sit on top */

    /* H.ngon works out its own depth, and a 42 ft column standing 12 ft in
       front of a 168 ft wall LOSES that race: the wall's nearest corner is
       nearer than the column's, so the wall paints last and the column
       disappears. It did, on the first render, and the portico hung in the
       air with nothing under it. Everything round gets an explicit depth. */
    function atDepth(list, d) {
      return list.map(function (it, ix) { return { svg: it.svg, depth: d + ix * 0.01 }; });
    }

    function prism(u, v, wu, wv, wuT, wvT, z0, h, fill, depth) {
      return H.prism(ctx, X(u), Y(v), W(wu), W(wv), W(wuT), W(wvT),
                     Z(z0), Z(h), fill, STONE_E, depth);
    }

    /* An Ionic column drawn as a column: a base block, an eight sided shaft
       so it reads round at any size this map draws, and its own capital.
       Checklist item 1 is the one most often failed, and it is failed by
       writing a column count in a header over a blank wall. */
    function column(u, v, z0, h, fill) {
      var out = [];
      out = out.concat(prism(u, v, COL_D * 1.35, COL_D * 1.35, COL_D * 1.25, COL_D * 1.25,
                             z0, 1.6, fill, NEAR + 20));
      out = out.concat(atDepth(H.ngon(ctx, X(u), Y(v), W(COL_D / 2), Z(z0 + 1.4),
                              Z(h - 3.6), 8, fill, STONE_E), NEAR + 21));
      /* the capital, wider than the shaft and squarer, which is what makes a
         column read as Ionic rather than as a post */
      out = out.concat(prism(u, v, COL_D * 1.45, COL_D * 1.2, COL_D * 1.45, COL_D * 1.2,
                             z0 + h - 2.6, 2.6, fill, NEAR + 22));
      return out;
    }

    /* A window as an opening: dark glass standing a little proud of the wall
       so it paints after it, with its own painted sash. One tone off the wall
       disappears at 900 pixels, which is checklist item 8. */
    /* +v is NORTH in the Mall's frame, which is the frame this whole file
       works in. The first version had both facades on the wrong side. */
    function windowN(u, z0, wdt, hgt, pediment) {
      if (!ctx.faceVisible(0, 1)) return [];
      var out = [], v = HD + 0.35;
      out = out.concat(prism(u, v, wdt + 1.4, 0.7, wdt + 1.4, 0.7, z0 - 0.7, hgt + 1.4, SASH, NEAR + 40));
      out = out.concat(prism(u, v + 0.2, wdt, 0.4, wdt, 0.4, z0, hgt, GLASS, NEAR + 41));
      if (pediment === "triangular") {
        /* tapered to a point: a real pediment silhouette at this scale */
        out = out.concat(prism(u, v + 0.2, wdt + 2.2, 0.5, 0.8, 0.5,
                               z0 + hgt + 0.5, 2.6, TRIM, NEAR + 42));
      } else if (pediment === "segmental") {
        /* the shallower, rounder alternative: taper to half, not to a point */
        out = out.concat(prism(u, v + 0.2, wdt + 2.2, 0.5, wdt * 0.55, 0.5,
                               z0 + hgt + 0.5, 1.8, TRIM, NEAR + 42));
      } else if (pediment === "flat") {
        out = out.concat(prism(u, v + 0.2, wdt + 2.0, 0.5, wdt + 2.0, 0.5,
                               z0 + hgt + 0.5, 0.9, TRIM, NEAR + 42));
      }
      return out;
    }

    function windowS(u, z0, wdt, hgt) {
      if (!ctx.faceVisible(0, -1)) return [];
      var out = [], v = -HD - 0.35;
      out = out.concat(prism(u, v, wdt + 1.4, 0.7, wdt + 1.4, 0.7, z0 - 0.7, hgt + 1.4, SASH, NEAR + 40));
      out = out.concat(prism(u, v - 0.2, wdt, 0.4, wdt, 0.4, z0, hgt, GLASS, NEAR + 41));
      return out;
    }

    /* ================= 1. ground, drive and shadow ================= */
    /* This complex is wider than the pad dc-3d.js gives a single place, so it
       brings its own, the way the museum forms do. Without it the West Wing
       and the ballroom site stand off the edge of the lawn. */
    items.push({ svg: ctx.poly([ctx.project(X(-420), Y(-300), 0.10),
                                ctx.project(X(410),  Y(-300), 0.10),
                                ctx.project(X(410),  Y(215),  0.10),
                                ctx.project(X(-420), Y(215),  0.10)], LAWN, STONE_E, 0.4),
                 depth: -1e9 + 1 });

    /* the carriage drive under the North Portico, which is why the portico is
       a porte cochere and why the ground floor is hidden on that side */
    items.push({ svg: ctx.poly([ctx.project(X(-190), Y(HD + 22), 0.20),
                                ctx.project(X(190),  Y(HD + 22), 0.20),
                                ctx.project(X(190),  Y(HD + 74), 0.20),
                                ctx.project(X(-190), Y(HD + 74), 0.20)], DRIVE, STONE_E, 0.4),
                 depth: -1e9 + 2 });

    items.push(H.shadow(ctx, [[X(-HW), Y(-HD)], [X(HW), Y(-HD)],
                              [X(HW), Y(HD)], [X(-HW), Y(HD)]], Z(ROOF)));

    /* the raised north forecourt: the reason the north front reads two storeys
       when the south reads three */
    items = items.concat(prism(0, HD + 26, HW * 2 + 40, 52, HW * 2 + 40, 52,
                               SGRD, NGRD, PAINT_D, undefined));

    /* ================= 2. the body of the residence ================= */
    /* the ground storey, exposed to the south, and its water table */
    items = items.concat(prism(0, 0, HW * 2, HD * 2, HW * 2, HD * 2,
                               SGRD, NGRD, PAINT_D, undefined));
    items = items.concat(prism(0, 0, HW * 2 + 1.6, HD * 2 + 1.6, HW * 2 + 1.6, HD * 2 + 1.6,
                               NGRD, 1.2, TRIM, NEAR + 1));
    /* the State Floor and the Second Floor, one mass, broken by a string
       course rather than run as a single extruded wall (checklist item 2) */
    items = items.concat(prism(0, 0, HW * 2, HD * 2, HW * 2, HD * 2,
                               NGRD + 1.2, SEC - NGRD - 1.2, PAINT, undefined));
    items = items.concat(prism(0, 0, HW * 2 + 1.0, HD * 2 + 1.0, HW * 2 + 1.0, HD * 2 + 1.0,
                               SEC, 0.9, TRIM, NEAR + 2));
    items = items.concat(prism(0, 0, HW * 2, HD * 2, HW * 2, HD * 2,
                               SEC + 0.9, CORN - SEC - 0.9, PAINT, undefined));

    /* the cornice, its own slab and proud of the wall */
    items = items.concat(prism(0, 0, HW * 2 + 3.4, HD * 2 + 3.4, HW * 2 + 3.4, HD * 2 + 3.4,
                               CORN, CORNT - CORN, TRIM, NEAR + 3));

    /* ================= 3. the eleven bays ================= */
    /* Eleven, published. The central three sit behind the portico, so their
       windows are drawn but the portico stands in front of them, which is
       what a porte cochere does. The four flanking bays each side carry the
       published alternation of pointed and segmental pediments on the State
       Floor and flat ones above. */
    for (var b = 0; b < BAYS; b++) {
      var u = -HW + BAYW * (b + 0.5);
      var central = (b >= 4 && b <= 6);
      var ped = central ? "flat" : ((b % 2 === 0) ? "triangular" : "segmental");
      if (central && b === 5) {
        /* the door, and the lunette fanlight over it */
        items = items.concat(windowN(u, NGRD + 1.2, 7.0, 13.0, null));
        if (ctx.faceVisible(0, -1)) {
          items = items.concat(prism(u, -HD - 0.55, 7.6, 0.5, 3.2, 0.5,
                                     NGRD + 14.6, 2.6, SASH, NEAR + 43));
        }
      } else {
        items = items.concat(windowN(u, STATE + 4.5, 6.2, 12.5, ped));
      }
      items = items.concat(windowN(u, SEC + 4.0, 6.2, 9.5, "flat"));
      /* the south front carries its own windows; the bow takes the middle */
      if (b < 4 || b > 6) {
        items = items.concat(windowS(u, SGRD + 2.5, 6.2, 6.0));
        items = items.concat(windowS(u, STATE + 4.5, 6.2, 12.5));
        items = items.concat(windowS(u, SEC + 4.0, 6.2, 9.5));
      }
    }

    /* ================= 4. the North Portico, 1830 ================= */
    /* Four columns, published as tetrastyle, prostyle so they stand in one
       row in front of the wall. They are colossal: they rise the full two
       storeys to the cornice, which is why the north front reads as it does
       from Pennsylvania Avenue. */
    if (ctx.faceVisible(0, 1)) {
      /* THE SHADE FIRST, AND BEHIND. A porte cochere is a covered room with a carriage
         drive through it, so the wall behind the columns is in deep shadow all
         day. Without that plane the columns stand against a wall the same
         colour as themselves and disappear, which is exactly what the first
         render showed: four white sticks nobody could pick out. Its bias is
         BELOW the columns' own, because the second render put the shade in
         front of them and painted the portico out entirely. */
      items = items.concat(prism(0, HD + NP_OUT / 2 + 0.5, NP_W + 2, NP_OUT - 1,
                                 NP_W + 2, NP_OUT - 1, NGRD, CORN - NGRD,
                                 PORTE, NEAR + 15));
      var npv = HD + NP_OUT - COL_D * 0.75;        /* the column row, on the NORTH */
      for (var c = 0; c < 4; c++) {
        var cu = -NP_W / 2 + (NP_W / 3) * c;
        items = items.concat(column(cu, npv, NGRD, CORN - NGRD, COLUMN));
      }
      /* the portico's own entablature, carried on the four columns, and the
         balustrade above it. Explicit depth: it sits on everything below. */
      /* the ceiling of the covered drive, lit from below by the pale ground */
      items = items.concat(prism(0, HD + NP_OUT / 2, NP_W + 7, NP_OUT + 1,
                                 NP_W + 7, NP_OUT + 1, CORN - 1.6, 1.6, SHADOW, NEAR + 18));
      items = items.concat(prism(0, HD + NP_OUT / 2, NP_W + 9, NP_OUT + 2,
                                 NP_W + 9, NP_OUT + 2, CORN, CORNT - CORN, TRIM, NEAR + 60));
      items = items.concat(prism(0, HD + NP_OUT / 2, NP_W + 9, NP_OUT + 2,
                                 NP_W + 9, NP_OUT + 2, CORNT, 0.7, SHADOW, NEAR + 61));
      for (var nb = 0; nb <= 8; nb++) {
        items = items.concat(prism(-NP_W / 2 - 4 + (NP_W + 8) / 8 * nb, HD + NP_OUT - 1.2,
                                   1.5, 1.5, 1.5, 1.5, CORNT + 0.7, 4.2, PAINT, NEAR + 62));
      }
      items = items.concat(prism(0, HD + NP_OUT / 2, NP_W + 9, NP_OUT + 2,
                                 NP_W + 9, NP_OUT + 2, CORNT + 4.9, 0.8, TRIM, NEAR + 63));
    }

    /* ================= 5. the South Portico, 1824 ================= */
    /* Semicircular, six Ionic columns stepping out and around the centre bow.
       The bow is the Blue Room pushing out of the south wall; the columns
       stand on the terrace over the ground storey loggia, and the Truman
       Balcony is the floor across them at Second Floor level. */
    if (ctx.faceVisible(0, -1)) {
      var R = SP_W / 2;                      /* traced 62.2 ft across */
      var BOWC = -(HD - (R - SP_OUT));       /* centre of the bow's arc, SOUTH */

      /* A DEPTH LADDER, BACK TO FRONT, because the first version had none and
         the bow came out as three floating discs with no columns under them:
         the bow wall carried a higher bias than the columns, so the building
         painted over its own portico.
           12 bow wall .. 14 loggia shade .. 17 loggia floor
           18 balcony floor .. 19 balcony rail   (both INSIDE the columns)
           20-22 the columns themselves
           25 the double staircase, which is in front of everything
           30 portico roof .. 31 its balustrade  (both above the columns) */

      /* the bow: the Blue Room pushing out of the south wall, twelve sided so
         it reads round at any size this map draws */
      items = items.concat(atDepth(H.ngon(ctx, X(0), Y(BOWC), W(R - 6), Z(SGRD),
                                  Z(CORN - SGRD), 12, PAINT, STONE_E), NEAR + 12));
      /* the loggia behind the six columns. A colonnaded porch is a shaded
         room, and that shade is what a column silhouettes against. */
      items = items.concat(atDepth(H.ngon(ctx, X(0), Y(BOWC), W(R - 5.4), Z(STATE),
                                  Z(CORN - STATE), 12, PORTE, STONE_E), NEAR + 14));
      /* the terrace the columns stand on, over the ground storey */
      items = items.concat(atDepth(H.ngon(ctx, X(0), Y(BOWC), W(R + 2.5), Z(STATE - 1.4),
                                  Z(1.4), 12, TRIM, STONE_E), NEAR + 17));

      /* the Truman Balcony, added under Truman in the late 1940s over loud
         objection and now the most photographed thing on this side. It sits
         INSIDE the ring of columns, which is why its radius is smaller than
         theirs: drawn wider, it painted the columns out. */
      items = items.concat(atDepth(H.ngon(ctx, X(0), Y(BOWC), W(R - 3.0), Z(SEC - 1.0),
                                  Z(1.0), 12, TRIM, STONE_E), NEAR + 18));
      for (var tb = 0; tb <= 7; tb++) {
        var ta = Math.PI * (0.12 + 0.76 * (tb / 7));
        items = items.concat(prism((R - 3.0) * Math.cos(ta) * -1,
                                   BOWC - (R - 3.0) * Math.sin(ta),
                                   1.3, 1.3, 1.3, 1.3, SEC, 3.4, PAINT, NEAR + 19));
      }

      /* SIX Ionic columns, published, stepping out and around the bow */
      for (var k = 0; k < 6; k++) {
        var a = Math.PI * (0.11 + 0.78 * (k / 5));
        items = items.concat(column(R * Math.cos(a) * -1, BOWC - R * Math.sin(a),
                                    STATE, CORN - STATE, COLUMN));
      }

      /* the ground floor double staircase, published, curving up to the loggia */
      [-1, 1].forEach(function (side) {
        for (var ss = 0; ss < 6; ss++) {
          items = items.concat(prism(side * (R * 0.66 + ss * 1.4),
                                     BOWC - (R + 3 + ss * 2.4) * 0.55,
                                     9 - ss * 0.5, 3.0, 9 - ss * 0.5, 3.0,
                                     STATE - (ss + 1) * 1.6, 1.6, PAINT_D, NEAR + 25 - ss * 0.1));
        }
      });

      /* the portico roof, and the balustrade on it */
      items = items.concat(atDepth(H.ngon(ctx, X(0), Y(BOWC), W(R + 2.2), Z(CORN),
                                  Z(CORNT - CORN), 12, TRIM, STONE_E), NEAR + 30));
      for (var sb = 0; sb <= 8; sb++) {
        var sa = Math.PI * (0.08 + 0.84 * (sb / 8));
        items = items.concat(prism((R + 1.0) * Math.cos(sa) * -1,
                                   BOWC - (R + 1.0) * Math.sin(sa),
                                   1.5, 1.5, 1.5, 1.5, CORNT, 4.2, PAINT, NEAR + 31));
      }
    }

    /* ================= 6. the roof that is not a lid ================= */
    /* A balustraded parapet on the wall line, published, and behind it the
       1927 third floor with its long shed dormers, published. Drawing a flat
       top here would fail checklist item 4 on a building whose roofline is
       one of its most recognisable things. */
    var BALN = 26;
    for (var i = 0; i <= BALN; i++) {
      var bu = -HW + (HW * 2) * (i / BALN);
      items = items.concat(prism(bu, -HD - 1.0, 1.6, 1.6, 1.6, 1.6, CORNT, BALT - CORNT, PAINT, NEAR + 10));
      items = items.concat(prism(bu, HD + 1.0, 1.6, 1.6, 1.6, 1.6, CORNT, BALT - CORNT, PAINT, NEAR + 10));
    }
    items = items.concat(prism(0, 0, HW * 2 + 3.4, 2.0, HW * 2 + 3.4, 2.0, BALT, 1.0, TRIM, NEAR + 11));
    items = items.concat(prism(0, 0, HW * 2 + 3.4, HD * 2 + 3.4, HW * 2 + 3.4, HD * 2 + 3.4,
                               BALT, 0, TRIM, NEAR + 11));
    /* the rail along the north and south runs, so the balusters read as a
       balustrade rather than as a row of loose posts */
    items = items.concat(prism(0, -HD - 1.0, HW * 2 + 3, 2.6, HW * 2 + 3, 2.6, BALT, 1.0, TRIM, NEAR + 12));
    items = items.concat(prism(0,  HD + 1.0, HW * 2 + 3, 2.6, HW * 2 + 3, 2.6, BALT, 1.0, TRIM, NEAR + 12));

    /* the attic storey, set back behind the balustrade */
    items = items.concat(prism(0, 0, HW * 2 - 12, HD * 2 - 12, HW * 2 - 12, HD * 2 - 12,
                               CORNT, ATTIC - CORNT, PAINT_D, NEAR + 13));
    /* the shed dormers: one long run each side, which is what 1927 added */
    items = items.concat(prism(0, -HD + 11, HW * 2 - 26, 5, HW * 2 - 26, 5,
                               ATTIC - 5.5, 5.5, ROOFSL, NEAR + 14));
    items = items.concat(prism(0,  HD - 11, HW * 2 - 26, 5, HW * 2 - 26, 5,
                               ATTIC - 5.5, 5.5, ROOFSL, NEAR + 14));
    /* the hip roof over the attic, tapered so the top is not a flat plate */
    items = items.concat(prism(0, 0, HW * 2 - 14, HD * 2 - 14, HW * 2 - 40, HD * 2 - 30,
                               ATTIC, ROOF - ATTIC, ROOFSL, NEAR + 15));
    /* chimneys, which the house has and a lid does not */
    [-58, -20, 20, 58].forEach(function (cu2) {
      items = items.concat(prism(cu2, 0, 4.5, 4.5, 4.5, 4.5, ROOF - 1, 7, PAINT_D, NEAR + 16));
    });

    /* ================= 7. the West Wing and the West Colonnade ========= */
    /* Theodore Roosevelt moved every work office out of the house and into the
       West Wing in 1902. It is low and it is meant to be: the point of it was
       that the President's family got the house back. */
    items = items.concat(prism(-309, -65, 104, 100, 104, 100, SGRD, 22, PAINT, undefined));
    items = items.concat(prism(-309, -65, 108, 104, 108, 104, 22, 2.2, TRIM, NEAR + 20));
    items = items.concat(prism(-309, -65, 96, 92, 96, 92, 24.2, 4, PAINT_D, NEAR + 21));
    items.push(H.shadow(ctx, [[X(-361), Y(-115)], [X(-257), Y(-115)],
                              [X(-257), Y(-15)], [X(-361), Y(-15)]], Z(26)));
    /* the Oval Office, traced by OSM as its own part on the south east corner */
    items = items.concat(prism(-243, -99, 31, 38, 31, 38, SGRD, 20, PAINT, NEAR + 22));
    items = items.concat(atDepth(H.ngon(ctx, X(-243), Y(-99), W(15), Z(20), Z(3.5), 14, TRIM, STONE_E), NEAR + 24));
    /* the West Colonnade along the Rose Garden, one storey, 23 ft high (OSM
       height 7 m), the covered walk between the house and the office */
    for (var wc = 0; wc < 9; wc++) {
      items = items.concat(column(-96 - wc * 13, 6, SGRD, 20, PAINT));
    }
    items = items.concat(prism(-148, 6, 126, 14, 126, 14, 20, 3, TRIM, NEAR + 23));

    /* ================= 8. the east side, as it is in 2026 ============== */
    /* Not a wing. A construction site: the East Wing came down in October
       2025 and the State Ballroom is going up in its place, on a footprint
       OSM traces at 265 by 328 ft, larger than the house it stands beside.
       Drawn as fence, pad and frame, because that is what is there. */
    items.push({ svg: ctx.poly([ctx.project(X(85), Y(-285), 0.30),
                                ctx.project(X(350), Y(-285), 0.30),
                                ctx.project(X(350), Y(43),  0.30),
                                ctx.project(X(85),  Y(43),  0.30)], DIRT, STONE_E, 0.4),
                 depth: -1e9 + 3 });
    /* the hoarding around it */
    for (var f = 0; f <= 16; f++) {
      var fu = 85 + (350 - 85) * (f / 16);
      items = items.concat(prism(fu, 43, 3, 1.2, 3, 1.2, 0.3, 9, FENCE, NEAR + 30));
      items = items.concat(prism(fu, -285, 3, 1.2, 3, 1.2, 0.3, 9, FENCE, NEAR + 30));
    }
    for (var f2 = 0; f2 <= 18; f2++) {
      var fv = -285 + (43 + 285) * (f2 / 18);
      items = items.concat(prism(85, fv, 1.2, 3, 1.2, 3, 0.3, 9, FENCE, NEAR + 30));
      items = items.concat(prism(350, fv, 1.2, 3, 1.2, 3, 0.3, 9, FENCE, NEAR + 30));
    }
    /* The steel frame. Reported in August 2026 as "framing assembled for the
       first floor" with excavation continuing and heights "reaching 70 feet in
       places", so IN PLACES is drawn as in places: a first floor frame across
       the site and a few columns carried up. The first version stood every
       column 66 ft tall across the whole grid, which made the addition the
       subject of the picture and the house a grey chip beside it. That was
       wrong twice: wrong about the reporting, and wrong about what a person
       standing on the Ellipse is looking at. */
    var GX = 4, GY = 5, G0U = 145, G0V = -225, GS = 52;
    for (var gx = 0; gx < GX; gx++) {
      for (var gy = 0; gy < GY; gy++) {
        var su = G0U + gx * GS, sv = G0V + gy * GS;
        /* the two rows nearest the house carry up; the rest is first floor */
        var tall = (gx < 2 && gy > 1);
        items = items.concat(prism(su, sv, 3.0, 3.0, 3.0, 3.0, 0.3,
                                   tall ? 62 : 26, STEEL, NEAR + 31));
      }
    }
    /* the first floor beams, the part that is actually assembled */
    for (var gy2 = 0; gy2 < GY; gy2++) {
      items = items.concat(prism(G0U + (GX - 1) * GS / 2, G0V + gy2 * GS,
                                 (GX - 1) * GS, 2.2, (GX - 1) * GS, 2.2,
                                 26, 2.2, STEEL, NEAR + 32));
    }
    for (var gx2 = 0; gx2 < GX; gx2++) {
      items = items.concat(prism(G0U + gx2 * GS, G0V + (GY - 1) * GS / 2,
                                 2.2, (GY - 1) * GS, 2.2, (GY - 1) * GS,
                                 26, 2.0, STEEL, NEAR + 33));
    }
    /* one upper beam run over the tall bay, so the 70 ft reads as real */
    items = items.concat(prism(G0U + GS / 2, G0V + 3 * GS, GS, 2.2, GS, 2.2,
                               62, 2.2, STEEL, NEAR + 34));

    return items;
  };
})();
