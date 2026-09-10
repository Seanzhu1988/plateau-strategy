/* nyc-form-stjohn.js: the Cathedral Church of Saint John the Divine.
 *
 * ============================ WHY THIS MODEL IS DIFFERENT ==================
 *
 * Every other landmark on this site is one building in one style. This one is
 * TWO, and the seam runs straight through the middle of it. That is not a
 * curiosity for a caption; it is the geometry, and a model that misses it has
 * drawn a generic cathedral and put the wrong name on it.
 *
 *   THE EAST END is Heins & LaFarge, who won the competition and broke ground
 *   in 1892: Byzantine and Romanesque Revival. ROUND arches. Rise equals
 *   half-width, which by the formula in STYLES.md is the case d = 0, where
 *   the two centres of a two-centred arch merge and the point disappears.
 *
 *   THE NAVE AND WEST FRONT are Ralph Adams Cram, from 1911: French Gothic
 *   with English Gothic accents. POINTED arches, struck from centres outside
 *   the opening.
 *
 * Both are drawn through ST.pointedArch. They are the same equation at two
 * settings, which is the point STYLES.md makes and the reason this building
 * is worth drawing: the two halves of that argument are standing next to each
 * other in one wall, and you can walk from one to the other.
 *
 * ============================ AND IT IS UNFINISHED ========================
 *
 * "St John the Unfinished", about two-thirds built. The honest thing to draw
 * is the building that is there, not the one on Cram's elevation:
 *
 *   - The crossing carries a TILE DOME that was meant to be temporary. Rafael
 *     Guastavino Jr. built it in fifteen weeks in 1909, without centering or
 *     scaffolding, to roof the crossing until the great steeple could be
 *     raised. The steeple was never raised. The stopgap is still there, and
 *     it is now the most loved thing on the building.
 *   - The WEST TOWERS STOP. St Peter, on the north, stops at 177 ft, level
 *     with the nave roof. St Paul, on the south, reached about 227 ft in the
 *     stonecutting campaign of 1982 to 1992 and stopped there. Both were
 *     designed to go to 266 ft.
 *   - The SOUTH TRANSEPT was never built.
 *
 * A model that quietly finished the building would be prettier and would be a
 * lie. The unbuilt parts are drawn as what they are: stone that stops.
 *
 * ============================ FACTS =======================================
 * Every number below is published, with the source it came from. Numbers that
 * are NOT published are listed under UNSOURCED and are drawn to look right
 * rather than measured; none of them changes the silhouette.
 *
 * [L] NYC Landmarks Preservation Commission, Designation Report LP-2585,
 *     21 February 2017. THE authority for this building as it actually
 *     stands. http://s-media.nyc.gov/agencies/lpc/lp/2585.pdf
 * [H] Edward Hagaman Hall, "A Guide to the Cathedral Church of St John the
 *     Divine", 5th ed., The Laymen's Club, 1924. The cathedral's own guide,
 *     with a full dimensions table. Its numbers are the PROJECTED design of
 *     1924, not the built building - see THE TWO-ERA TRAP below.
 *     https://www.gutenberg.org/files/68112/68112-h/68112-h.htm
 * [Z] Zawisny, Fivet & Ochsendorf, "Guastavino design of the 1909 thin brick
 *     dome", Construction History 32(2), 2017, 39-65. Peer reviewed; the
 *     source of the 93 ft shell diameter.
 *     https://infoscience.epfl.ch/record/232928
 * [S] The cathedral itself. https://www.stjohndivine.org/visit/explore-the-cathedral
 *
 * ============================ THE TWO-ERA TRAP ============================
 * TWO complete and authoritative dimension sets exist for this cathedral and
 * they are NOT the same building. Hall's 1924 guide gives the design as
 * projected; the LPC's 2017 report gives what was built. They disagree on
 * almost everything: nave 225 against 248 ft, choir 170 against 145, the
 * nave vault 130 against 124, the west front 220 against 207. ONLY the
 * 601 ft total is stable across the century.
 *
 * This model is the building that STANDS, so every as-built number below is
 * the LPC's. Hall is used only where the LPC is silent, which is for things
 * that were never built and therefore have no as-built figure at all.
 *
 *   total exterior length      601 ft (183 m)                            [L]
 *   interior floor area        121,000 sq ft (11,200 m2)                 [L]
 *   seating                    8,600                                     [L]
 *   narthex                    50 ft long by 207 ft wide                 [L]
 *   nave                       248 ft by 146 ft (the width is WITH aisles)[L]
 *   nave vault, interior       124 ft (38 m)                             [L]
 *   nave roof ridge, exterior  177 ft                                    [L]
 *                              Hall's 1924 projection says 175 and a metric
 *                              round-trip renders it 174; the LPC's as-built
 *                              177 is the one drawn.
 *   crossing                   100 by 100 ft (30 by 30 m)                [L]
 *   choir                      145 ft by 56 ft                           [L]
 *   apse, Chapel of St Saviour 58 ft, ambulatory 14 ft wide              [L]
 *   transept span AS DESIGNED  330 ft (100 m) - never completed          [L]
 *   west front                 207 ft wide, FIVE bays and FIVE portals;
 *                              Cram's third redesign of 1929 took the front
 *                              from three portals to five                [L]
 *   nave bays                  FOUR double bays a side, each split into
 *                              sub-bays by narrower flying buttresses;
 *                              seven chapels a side, one per sub-bay      [L]
 *   central aisle              50 ft wide, the width of West 112th Street
 *                              between the building lines                 [L]
 *   nave section               FIVE aisles wide (Cram, after Bourges)     [L]
 *   north tower, St Peter      177 ft (54 m), level with the nave roof   [L]
 *   south tower, St Paul       about 227 ft (69 m) after the 1982-1992
 *                              stonecutting campaign                     [L]
 *   towers AS DESIGNED         266 ft (81 m)                             [L]
 *   crossing dome              93 ft spherical shell [Z]; terracotta tile in
 *                              three layers, laid without centering, built
 *                              in 15 weeks in 1909                        [L]
 *   dome, ON THE OUTSIDE       the dome and its pendentives are COVERED
 *                              WITH CEMENT STUCCO. The tile everyone knows
 *                              is the INSIDE of this shell; from the street
 *                              it is rendered, not terracotta.            [L]
 *   dome apex                  162 ft (49 m)                             [Z]
 *   the eight granite columns  54 ft tall, 6 ft diameter; lower drum 38 ft
 *                              and 90 short tons, upper 17 ft and 40 short
 *                              tons; quarried at Vinalhaven, Maine        [L]
 *   great west rose            40 ft (12 m) across, 10,000 pieces of glass,
 *                              Charles Connick; largest rose in the US    [L]
 *   Chapels of the Tongues     SEVEN, radiating off the ambulatory, north to
 *                              south: Ansgar (Scandinavian), Boniface
 *                              (German), Columba (British Isles), Saviour
 *                              (Eastern Orthodox), Martin (French), Ambrose
 *                              (Italian), James (Spanish and Latin American)
 *                                                                        [L]
 *   ground broken              27 December 1892                          [L]
 *   crossing opened            1909; choir consecrated 19 April 1911     [L]
 *   opened to full length      30 November 1941                          [L]
 *   fire                       18 December 2001; rededicated 30 Nov 2008 [L]
 *   completion                 about two-thirds; unbuilt are the towers above
 *                              the west front, the SOUTH TRANSEPT, and the
 *                              steeple over the crossing                 [L]
 *   materials                  structural core Maine granite; outer walls
 *                              CREAM-COLOURED granite from Lake Mohegan,
 *                              Peekskill; nave roof STANDING-SEAM COPPER;
 *                              apse roof standing-seam hipped with a bronze
 *                              Angel Gabriel on it                        [L]
 *   the unfinished state       south transept COMPLETELY UNBUILT and its
 *                              crossing wall is temporary POURED CONCRETE;
 *                              north transept about ONE THIRD built, its
 *                              openings sealed with wood since the 2001
 *                              fire; three of the four crossing piers are
 *                              rough and unfaced                          [L]
 *   address and orientation    1047 Amsterdam Avenue, between W 110th and
 *                              W 113th; the building runs WEST-EAST and is
 *                              NOT aligned to the street grid            [L]
 *
 * ============================ DERIVED =====================================
 * The arithmetic is the whole claim, so it is shown rather than asserted.
 *
 *   THE PLAN CLOSES ON ITS OWN PUBLISHED TOTAL. West to east the published
 *   compartments are narthex 50 + nave 248 + crossing 100 + choir 145 +
 *   apse 58 = 601 ft, which is exactly the published overall length. Five
 *   numbers taken from a table of contents add up to a sixth from the
 *   infobox, so the plan below is not fitted to look right; it is the
 *   published plan, laid end to end.
 *
 *   x runs WEST to EAST with 0 at the centre of the crossing, so:
 *     narthex   -348 .. -298      nave      -298 .. -50
 *     crossing    -50 ..  +50     choir      +50 .. +195
 *     apse       +195 .. +253     and -348 to +253 is 601 ft.
 *
 *   AMBULATORY RADIUS. The choir is 56 ft wide, so 28 ft from the axis, and
 *   the ambulatory is 14 ft wide, so the outer wall of the east end stands
 *   28 + 14 = 42 ft from the axis. The seven chapels radiate beyond that.
 *
 *   THE DOME SITS INSIDE THE CROSSING. 93 ft of dome in a 100 ft square
 *   leaves 3.5 ft of ledge a side, which is what a dome on pendentives does.
 *   Those two numbers were published separately and agree.
 *
 *   THE NORTH TOWER IS THE NAVE ROOF. St Peter's 177 ft and the nave ridge's
 *   174 ft are within 3 ft, which is why the source says the tower reaches
 *   the roof of the nave. The model puts them at their own published heights
 *   and lets them land where they land.
 *
 *   ROOF DEPTH. Ridge 174 minus vault 124 = 50 ft of structure between the
 *   inside of the vault and the outside of the ridge. That is the depth the
 *   nave roof is drawn with.
 *
 *   THE WEST FRONT IS WIDER THAN THE NAVE. 207 ft against 146 ft, so the
 *   towers stand 30.5 ft proud on each side. That overhang is the west front
 *   and it is why the towers read as towers rather than as wall.
 *
 *   A DISCREPANCY, NOT SMOOTHED. The granite columns are published as 54 ft
 *   tall, and their two drums as 38 ft and 17 ft, which sum to 55. One foot
 *   is unexplained by the sources; the model uses the 54 ft total and this
 *   note exists so the reader knows the arithmetic was checked and did not
 *   quite close.
 *
 *   DOME HEIGHT, TWO FIGURES. 162 ft at the apex is the figure carried here.
 *   165 ft "above the crossing floor" also circulates. They may be the same
 *   dome measured from two different floors; no source seen settles it, so
 *   the smaller and better-attributed one is drawn.
 *
 * ============================ UNSOURCED ===================================
 * Drawn to look right, NOT measured. Every one is detail inside a silhouette
 * that is entirely published:
 *   - aisle roof height, and the height of the choir and apse roofs
 *   - the number of nave bays, clerestory windows and arcade openings
 *   - buttress depth and step count
 *   - the depth the chapels project from the ambulatory
 *   - all colours; the stone is published as granite and limestone but no
 *     source seen gives a tone, and the roof covering is not sourced at all
 * Nothing here is traced from a copyrighted drawing.
 *
 * Coordinates are FEET. Origin at the centre of the crossing, z up from the
 * cathedral floor, +x EAST toward the apse, so the west front is at -x and
 * +y is north.
 */
(function () {
  var H = window.NYC3D.helpers, ST = window.STYLES3D, C = H.C;
  window.NYC_FORMS = window.NYC_FORMS || {};

  /* ---- the published plan, west to east ---- */
  var P = {
    narthexW: 50, naveL: 248, crossL: 100, choirL: 145, apseL: 58,
    frontW: 207, naveW: 146, crossW: 100, choirW: 56, ambW: 14,
    vault: 124, ridge: 177, domeD: 93, domeApex: 162,
    towerN: 177, towerS: 227, towerDesign: 266, roseD: 40
  };
  /* x edges, from the DERIVED block */
  var X_W = -(P.crossL / 2 + P.naveL + P.narthexW);   /* -348, the west face   */
  var X_NAVE_W = -(P.crossL / 2 + P.naveL);           /* -298, narthex to nave */
  var X_CR_W = -P.crossL / 2;                         /*  -50                  */
  var X_CR_E = P.crossL / 2;                          /*  +50                  */
  var X_CHOIR_E = X_CR_E + P.choirL;                  /* +195                  */
  var X_E = X_CHOIR_E + P.apseL;                      /* +253, the east face   */
  var AMB_R = P.choirW / 2 + P.ambW;                  /* 42                    */

  /* UNSOURCED heights, declared above */
  var Z_AISLE = 62, Z_CHOIR_EAVE = 96, Z_CHOIR_RIDGE = 138, Z_AMB = 54, Z_CHAPEL = 46;
  var Z_NAVE_EAVE = P.ridge - 50;      /* 124, the vault line, from DERIVED */

  /* ---- materials. Tones UNSOURCED; the stone types are not ---- */
  var STONE = { top: '#dcd8cf', sun: '#d2cdc2', shade: '#c4bfb3' };  /* limestone and granite */
  var STONE_D = { top: '#cdc8bd', sun: '#c2bcb0', shade: '#b4aea1' }; /* the older east end, a shade greyer */
  var TRIM = { top: '#e8e4db', sun: '#dfdbd1', shade: '#d3cec3' };   /* sills, copings, the lit edge */
  var GLASS = { top: '#4a5560', sun: '#3f4a55', shade: '#36404a' };  /* leaded glass read from outside */
  var DARK = { top: '#5d564c', sun: '#4f4941', shade: '#443f38' };   /* a portal in shadow */
  /* THE DOME IS NOT ORANGE FROM OUTSIDE. It was drawn terracotta because the
     Guastavino tile is the famous thing about it, and that was wrong: the LPC
     records the dome and its pendentives as COVERED WITH CEMENT STUCCO. The
     tile everybody pictures is the ceiling, seen from the crossing floor. From
     the street it is a rendered shell, so that is what is drawn, and the tile
     is named in the caption instead of painted on the outside. */
  var DOME = { top: '#d6d0c4', sun: '#cbc5b8', shade: '#bdb7a9' };   /* cement stucco [L] */
  var ROOF = { top: '#7d968b', sun: '#719083', shade: '#638275' };   /* standing-seam copper, oxidised [L] */
  var STOP = { top: '#c8c0b2', sun: '#bcb4a6', shade: '#aea697' };   /* stone that stops: raw, unfinished */
  var CONC = { top: '#b9b6b0', sun: '#adaaa4', shade: '#9f9c96' };   /* poured-in-place concrete, the temporary transept walls [L] */
  var JOINT = '#a9a294';

  /* THE FRAMING, measured against the box rather than guessed. The scene is
     720 by 620. At 0.75 the cathedral drew 451 units long and 170 tall and
     sat in the lower right with 300 units of empty sky above it. 0.82 fills
     the box without touching its edges: 601 ft of length becomes 493 units
     against 720 of width, and 227 ft of height becomes 186 against 620. */
  var S = 0.82;

  window.NYC_FORMS.stjohn = function (opts) {
    var o = opts || {};
    var f = [], lines = [], marks = [];
    function V(p) { return [p[0] * S, p[1] * S, p[2] * S]; }
    function Pt(x, y, z) { return [x * S, y * S, z * S]; }

    /* ---- one face, outward normal enforced, shaded by which way it looks -- */
    function emit(pts, n, mat, fo) {
      var nn = H.normal(pts[0], pts[1], pts[2]);
      if (nn[0] * n[0] + nn[1] * n[1] + nn[2] * n[2] < 0) pts = pts.slice().reverse();
      var base = typeof mat === 'string' ? mat
        : (n[2] > 0.5 ? mat.top : (n[2] < -0.5 ? mat.shade
          : ((n[0] < -0.3 || n[1] < -0.3) ? mat.sun : mat.shade)));
      var fc = H.face(pts.map(V), base, fo);
      f.push(fc);
      return fc;
    }
    function outward(a, b) {
      var dx = b[0] - a[0], dy = b[1] - a[1], m = Math.sqrt(dx * dx + dy * dy) || 1;
      return [dy / m, -dx / m, 0];
    }
    function wallQ(a, b, z0, z1, mat, fo) {
      emit([[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]],
           outward(a, b), mat, fo);
    }

    /* THE PAINTER'S TRAP, the same one the Empire State met: a long roof's
       centroid can sit nearer the eye than the wall at its far end, so it
       paints over that wall's head. A 601 ft building is the worst case on
       this site. Same two cures: roofs are laid in tiles no longer than 40 ft
       so a tile's centroid is always near the wall it borders, and walls
       carry a small positive bias so they paint after the roof they stand on. */
    var WALL_BIAS = 4, TILE_MAX = 40;
    function tileTop(x0, x1, y0, y1, z, mat, fo) {
      var nx = Math.max(1, Math.ceil((x1 - x0) / TILE_MAX));
      var ny = Math.max(1, Math.ceil((y1 - y0) / TILE_MAX));
      var dx = (x1 - x0) / nx, dy = (y1 - y0) / ny, ov = 0.3;
      for (var i = 0; i < nx; i++) for (var j = 0; j < ny; j++) {
        var xa = x0 + i * dx - (i ? ov : 0), xb = x0 + (i + 1) * dx + (i < nx - 1 ? ov : 0);
        var ya = y0 + j * dy - (j ? ov : 0), yb = y0 + (j + 1) * dy + (j < ny - 1 ? ov : 0);
        emit([[xa, ya, z], [xb, ya, z], [xb, yb, z], [xa, yb, z]], [0, 0, 1], mat, fo);
      }
    }

    /* A rectangular block: four walls and a top, no underside. */
    function block(x0, x1, y0, y1, z0, z1, mat, fo) {
      var wf = { bias: WALL_BIAS + ((fo && fo.bias) || 0) };
      wallQ([x0, y0], [x1, y0], z0, z1, mat, wf);
      wallQ([x1, y0], [x1, y1], z0, z1, mat, wf);
      wallQ([x1, y1], [x0, y1], z0, z1, mat, wf);
      wallQ([x0, y1], [x0, y0], z0, z1, mat, wf);
      tileTop(x0, x1, y0, y1, z1, mat, fo);
    }

    /* ================= THE ARCH, WHICH IS THE WHOLE ARGUMENT =============
       ONE function draws both styles. `rise` decides which one you get:
       rise = width/2 is the Romanesque round arch (the two centres merge),
       rise well past width*0.866 is the Gothic lancet. Passing the style in
       as a NUMBER rather than a flag is deliberate: it keeps the two halves
       of this building provably the same equation, so the arch code cannot
       be right for one end and wrong for the other.

       The opening is drawn as a dark shape laid ON the wall with a forward
       bias, plus a voussoir ring around its head. Cutting a real hole would
       need a polygon with a hole in it, which this renderer has no way to
       express; laying the opening on the face gives the same reading and
       keeps every face convex. The ring is what makes it read as built
       stone: the joints fan, because each is a true radius from the arc
       centre, and parallel joints are the tell of a hole cut in a slab. */
    function opening(cx, cz, w, totalH, rise, plane, n, mat, ringMat) {
      var a = w / 2, spring = totalH - rise;
      var arc = ST.pointedArch(w, rise, 14);
      var pts = [[-a, 0], [-a, spring]];
      arc.forEach(function (p) { pts.push([p[0], spring + p[1]]); });
      pts.push([a, 0]);
      /* Place the 2D opening frame into the world. Three cases, because the
         chevet needs one the two axis-aligned ones cannot express: a chapel
         wall points outward on its own radius, at no particular axis. The
         'free' plane carries an origin and an in-wall direction, and the
         axis-aligned cases are just the two easy settings of it. */
      function place(u, v) {
        if (plane.axis === 'free') {
          return [plane.o[0] + plane.u[0] * u, plane.o[1] + plane.u[1] * u, cz + v];
        }
        return plane.axis === 'y'
          ? [plane.at, cx + u, cz + v]        /* wall runs along y, faces x */
          : [cx + u, plane.at, cz + v];       /* wall runs along x, faces y */
      }
      emit(pts.map(function (p) { return place(p[0], p[1]); }), n, mat || GLASS,
           { bias: WALL_BIAS + 6 });
      /* the voussoir ring: one wedge face between consecutive joints */
      var J = ST.voussoirs(w, rise, Math.max(1.6, w * 0.16), 7), nj = J.length / 2;
      for (var h = 0; h < 2; h++) {
        for (var i = 0; i < nj - 1; i++) {
          var A = J[h * nj + i], B = J[h * nj + i + 1];
          emit([place(A[0][0], spring + A[0][1]), place(A[1][0], spring + A[1][1]),
                place(B[1][0], spring + B[1][1]), place(B[0][0], spring + B[0][1])],
               n, ringMat || TRIM, { bias: WALL_BIAS + 7, stroke: JOINT, width: 0.4 });
        }
      }
    }
    /* the two settings, named, so a call site says which style it is in */
    function roundRise(w) { return w / 2; }          /* Romanesque  */
    function lancetRise(w) { return w * 1.15; }      /* Gothic: 1.15 > 0.866 */

    /* ===================== 1. THE GROUND ============================== */
    (function ground() {
      var g = 470, gx0 = X_W - 70, gx1 = X_E + 70;
      emit([[gx0, -g, 0], [gx1, -g, 0], [gx1, g, 0], [gx0, g, 0]], [0, 0, 1],
           '#eae7df', { flat: true, bias: -1e9 });
    })();

    /* ===================== 2. THE NAVE, Cram, Gothic ==================
       248 ft long, 146 ft wide with its aisles, vault at 124, ridge at 174.
       Aisles first so the clerestory stands on them. */
    (function nave() {
      var yO = P.naveW / 2, yI = P.crossW / 2;   /* 73 outer, 50 to the arcade */
      [-1, 1].forEach(function (s) {
        var ya = s * yI, yb = s * yO;
        block(X_NAVE_W, X_CR_W, Math.min(ya, yb), Math.max(ya, yb), 0, Z_AISLE, STONE);
        /* EIGHT sub-bays a side, which is SOURCED, not chosen: the LPC
           records four double bays each side, split into sub-bays by
           narrower flying buttresses, with seven chapels a side, one per
           sub-bay. This was drawn with five before the designation report
           was read. */
        for (var i = 0; i < 8; i++) {
          var cx = X_NAVE_W + (i + 0.5) * (P.naveL / 8);
          opening(cx, 16, 13, 30, lancetRise(13), { axis: 'x', at: yb }, [0, s, 0]);
        }
        /* BUTTRESSES. A Gothic wall is piers and glass, and this is where the
           wall went. Stepped, UNSOURCED depth, on the bay divisions. */
        for (var b = 0; b <= 8; b++) {
          var bx = X_NAVE_W + b * (P.naveL / 8);
          block(bx - 4, bx + 4, Math.min(yb, yb + s * 9), Math.max(yb, yb + s * 9),
                0, Z_AISLE + 8, STONE_D);
        }
      });
      /* the clerestory: the tall lit box over the arcade */
      block(X_NAVE_W, X_CR_W, -yI, yI, Z_AISLE, Z_NAVE_EAVE, STONE);
      [-1, 1].forEach(function (s) {
        for (var i = 0; i < 8; i++) {
          var cx = X_NAVE_W + (i + 0.5) * (P.naveL / 8);
          opening(cx, Z_AISLE + 14, 18, 44, lancetRise(18), { axis: 'x', at: s * yI }, [0, s, 0]);
        }
      });
      /* the roof: ridge 174 over eaves 124, the 50 ft from DERIVED */
      roofGable(X_NAVE_W, X_CR_W, yI, Z_NAVE_EAVE, P.ridge, ROOF);
    })();

    /* a pitched roof between two eaves, ridge along x */
    function roofGable(x0, x1, halfY, zEave, zRidge, mat) {
      [-1, 1].forEach(function (s) {
        var n = [0, s * 0.6, 0.8];
        var nx = Math.max(1, Math.ceil((x1 - x0) / TILE_MAX)), dx = (x1 - x0) / nx;
        for (var i = 0; i < nx; i++) {
          var xa = x0 + i * dx, xb = x0 + (i + 1) * dx + (i < nx - 1 ? 0.3 : 0);
          emit([[xa, s * halfY, zEave], [xb, s * halfY, zEave],
                [xb, 0, zRidge], [xa, 0, zRidge]], n, mat, { bias: 2 });
        }
      });
    }

    /* ===================== 3. THE WEST FRONT, Cram, Gothic =============
       207 ft wide against the nave's 146, so each tower stands 30.5 ft proud.
       Three portals, the great rose, and two towers that stop. */
    (function westFront() {
      var yF = P.frontW / 2;                       /* 103.5 */
      var yN = P.naveW / 2;                        /* 73    */
      /* the narthex block behind the front */
      block(X_W, X_NAVE_W, -yN, yN, 0, Z_NAVE_EAVE, STONE);
      /* the two towers, at their OWN published heights */
      var towers = [{ s: 1, z: P.towerN, name: 'St Peter' },
                    { s: -1, z: P.towerS, name: 'St Paul' }];
      towers.forEach(function (t) {
        var ya = t.s * yN, yb = t.s * yF;
        block(X_W, X_NAVE_W, Math.min(ya, yb), Math.max(ya, yb), 0, t.z, STONE);
        /* THE STOP. Neither tower is finished, so neither gets a parapet or
           a spire; each gets a band of raw stone at its head, the colour of
           masonry that was left rather than completed, and a flat top. This
           is the single most important thing on the west front and it is
           drawn by NOT drawing something. */
        block(X_W - 0.4, X_NAVE_W + 0.4, Math.min(ya, yb) - 0.4, Math.max(ya, yb) + 0.4,
              t.z - 10, t.z, STOP);
        /* tall lancet belfry openings on the west face */
        opening((Math.min(ya, yb) + Math.max(ya, yb)) / 2, t.z - 52, 22, 40,
                lancetRise(22), { axis: 'y', at: X_W }, [-1, 0, 0]);
      });
      /* FIVE PORTALS IN FIVE BAYS. Drawn with three at first, which was the
         west front as Cram designed it in 1913 and NOT the one that was
         built: his third redesign of 1929 took the front from three portals
         to five, and five is what stands on Amsterdam Avenue. The centre one
         is the Portal of Paradise, wider than the rest, with the trumeau
         carrying St John down its middle. */
      [[0, 34, 62], [-42, 22, 46], [42, 22, 46],
       [-80, 18, 38], [80, 18, 38]].forEach(function (p) {
        opening(p[0], 0, p[1], p[2], lancetRise(p[1]),
                { axis: 'y', at: X_W }, [-1, 0, 0], DARK, TRIM);
      });
      /* the trumeau: the stone pier splitting the centre portal's doors */
      emit([[X_W, -1.6, 0], [X_W, 1.6, 0], [X_W, 1.6, 40], [X_W, -1.6, 40]],
           [-1, 0, 0], TRIM, { bias: WALL_BIAS + 9 });
      /* THE GREAT ROSE: 40 ft across, 10,000 pieces of glass, Connick.
         Drawn as real tracery - an outer ring, an eye, and spokes between -
         because a dark disc is not a rose window, and this is the one thing
         on this front that everyone photographs. */
      /* THE BIAS HAS TO BEAT THE ROSE'S OWN DEPTH SPREAD. Drawn first with
         the tracery one unit in front of the glass, the window came out as a
         fan in its top half and a blank dark disc in its bottom half. The
         painter sorts on centroid depth PLUS bias, and a 40 ft wheel standing
         upright spreads about 20 units of depth between its top and its
         bottom at the steeper pitches, so a one-unit lead put the lower
         spokes BEHIND their own glass. The lead now exceeds the spread, and
         nothing stands in front of this wall for it to jump over. */
      (function theRose() {
        var cz = 118, R = P.roseD / 2, seg = 40, spokes = 16;
        var B_GLASS = WALL_BIAS + 6, B_SPOKE = WALL_BIAS + 30, B_EYE = WALL_BIAS + 44;
        function at(u, v) { return [X_W, u, cz + v]; }
        /* the glass field */
        var ring = [];
        for (var i = 0; i < seg; i++) {
          var a = (i / seg) * Math.PI * 2;
          ring.push(at(R * Math.cos(a), R * Math.sin(a)));
        }
        emit(ring, [-1, 0, 0], GLASS, { bias: B_GLASS });
        /* the tracery: spokes from the eye out to the ring */
        for (var k = 0; k < spokes; k++) {
          var t = (k / spokes) * Math.PI * 2, wdt = 0.9;
          var c = Math.cos(t), s2 = Math.sin(t);
          emit([at(R * 0.22 * c - wdt * s2, R * 0.22 * s2 + wdt * c),
                at(R * c - wdt * s2, R * s2 + wdt * c),
                at(R * c + wdt * s2, R * s2 - wdt * c),
                at(R * 0.22 * c + wdt * s2, R * 0.22 * s2 - wdt * c)],
               [-1, 0, 0], TRIM, { bias: B_SPOKE });
        }
        /* the eye */
        var eye = [];
        for (var j = 0; j < seg; j++) {
          var b = (j / seg) * Math.PI * 2;
          eye.push(at(R * 0.22 * Math.cos(b), R * 0.22 * Math.sin(b)));
        }
        emit(eye, [-1, 0, 0], TRIM, { bias: B_EYE });
      })();
      /* the gable over the central bay, between the towers */
      emit([[X_W, -yN, Z_NAVE_EAVE], [X_W, yN, Z_NAVE_EAVE], [X_W, 0, P.ridge]],
           [-1, 0, 0], STONE, { bias: WALL_BIAS + 1 });
    })();

    /* ===================== 4. THE CROSSING AND THE DOME ================
       The crossing is 100 ft square. The dome is 93 ft across and its apex is
       162 ft up, and it was meant to come down again. */
    (function crossing() {
      var h = P.crossW / 2;
      block(X_CR_W, X_CR_E, -h, h, 0, Z_NAVE_EAVE, STONE);
      /* the drum: the 3.5 ft of ledge a side that 93 in 100 leaves */
      block(X_CR_W + 2, X_CR_E - 2, -h + 2, h - 2, Z_NAVE_EAVE, Z_NAVE_EAVE + 14, STONE_D);
      /* THE GUASTAVINO DOME. A shallow SAUCER, not a hemisphere: tile works
         in compression across a wide low curve, and drawing it as half a
         ball would be the same order of mistake as a triangular Gothic arch.
         Rise is the published apex minus the springing it sits on. */
      var zSpring = Z_NAVE_EAVE + 14, rise = P.domeApex - zSpring, rad = P.domeD / 2;
      var R = (rad * rad + rise * rise) / (2 * rise);
      var rows = 7, seg = 28;
      for (var i = 0; i < rows; i++) {
        var z0 = rise * (i / rows), z1 = rise * ((i + 1) / rows);
        var r0 = Math.sqrt(Math.max(0, R * R - Math.pow(R - rise + z0, 2)));
        var r1 = Math.sqrt(Math.max(0, R * R - Math.pow(R - rise + z1, 2)));
        for (var j = 0; j < seg; j++) {
          var a0 = (j / seg) * Math.PI * 2, a1 = ((j + 1) / seg) * Math.PI * 2;
          var pa = [r0 * Math.cos(a0), r0 * Math.sin(a0), zSpring + z0];
          var pb = [r0 * Math.cos(a1), r0 * Math.sin(a1), zSpring + z0];
          var pc = [r1 * Math.cos(a1), r1 * Math.sin(a1), zSpring + z1];
          var pd = [r1 * Math.cos(a0), r1 * Math.sin(a0), zSpring + z1];
          var mx = (pa[0] + pc[0]) / 2, my = (pa[1] + pc[1]) / 2;
          var ln = Math.sqrt(mx * mx + my * my) || 1;
          emit([pa, pb, pc, pd], [mx / ln * 0.7, my / ln * 0.7, 0.7], DOME, { bias: 3 });
        }
      }
    })();

    /* ===================== 5. THE TRANSEPTS, one built, one not ========
       Designed to span 330 ft. The north arm was built and the SOUTH ARM
       NEVER WAS. Drawing two matching arms would finish a building that
       nobody has finished. */
    (function transepts() {
      var h = P.crossW / 2;
      /* NEITHER ARM IS FINISHED, and they are unfinished in two DIFFERENT
         ways, which the first draft got wrong by giving the north arm a
         gable and a wheel window it does not have.
           NORTH, the Women's Transept: about ONE THIRD built, to roughly the
         springing of its portal arch, and its openings have been sealed with
         wood since the 2001 fire. So: a low mass, stopping in raw stone, with
         no gable and no rose.
           SOUTH: COMPLETELY UNBUILT. What closes the crossing on that side is
         a temporary wall of poured-in-place concrete with buttresses and
         blocked arched openings. It is not a stump of a transept; it is a
         wall where a transept was meant to start. */
      var Z_NT = Z_NAVE_EAVE / 3;                    /* the one-third [L] */
      block(X_CR_W, X_CR_E, h, h + 58, 0, Z_NT, STONE);
      block(X_CR_W - 0.4, X_CR_E + 0.4, h + 58 - 0.4, h + 58 + 0.4, Z_NT - 7, Z_NT, STOP);
      /* the sealed openings: boarded, not glazed, so they are drawn dark and
         flat rather than as windows */
      [-30, 0, 30].forEach(function (cx) {
        opening(cx, 10, 18, 30, lancetRise(18), { axis: 'x', at: h + 58 }, [0, 1, 0], DARK, STOP);
      });
      /* SOUTH: the temporary concrete wall across the crossing */
      wallQ([X_CR_W, -h], [X_CR_E, -h], 0, Z_NAVE_EAVE - 30, CONC, { bias: WALL_BIAS + 2 });
      for (var bz = 0; bz < 4; bz++) {              /* its buttresses */
        var bx2 = X_CR_W + (bz + 0.5) * (P.crossL / 4);
        block(bx2 - 5, bx2 + 5, -(h + 7), -h, 0, Z_NAVE_EAVE - 44, CONC);
      }
    })();

    /* ===================== 6. THE CHOIR, Heins & LaFarge, Romanesque ===
       145 ft by 56 ft, with the 14 ft ambulatory outside it. From here east
       every arch is ROUND. */
    (function choir() {
      var hc = P.choirW / 2;                       /* 28 */
      /* the ambulatory, low, wrapping the choir */
      [-1, 1].forEach(function (s) {
        var ya = s * hc, yb = s * AMB_R;
        block(X_CR_E, X_CHOIR_E, Math.min(ya, yb), Math.max(ya, yb), 0, Z_AMB, STONE_D);
        for (var i = 0; i < 4; i++) {
          var cx = X_CR_E + (i + 0.5) * (P.choirL / 4);
          opening(cx, 14, 16, 26, roundRise(16), { axis: 'x', at: yb }, [0, s, 0]);
        }
      });
      /* the choir clerestory over it, round-headed */
      block(X_CR_E, X_CHOIR_E, -hc, hc, Z_AMB, Z_CHOIR_EAVE, STONE_D);
      [-1, 1].forEach(function (s) {
        for (var i = 0; i < 4; i++) {
          var cx = X_CR_E + (i + 0.5) * (P.choirL / 4);
          opening(cx, Z_AMB + 12, 20, 34, roundRise(20), { axis: 'x', at: s * hc }, [0, s, 0]);
        }
      });
      roofGable(X_CR_E, X_CHOIR_E, hc, Z_CHOIR_EAVE, Z_CHOIR_RIDGE, ROOF);
    })();

    /* ===================== 7. THE APSE AND THE SEVEN CHAPELS ===========
       The east end is a half-round of radiating chapels: the Chapels of the
       Tongues, seven of them, each built in the style of the people it was
       dedicated to. A chevet is a PLAN before it is anything else, so it is
       drawn as one: a half-polygon at the ambulatory radius, with seven
       chapels standing off it. */
    (function chevet() {
      var seg = 14, cx = X_CHOIR_E;
      /* the apse wall, a half-round at the ambulatory radius */
      var plan = [];
      for (var i = 0; i <= seg; i++) {
        var t = -Math.PI / 2 + Math.PI * (i / seg);
        plan.push([cx + AMB_R * Math.cos(t), AMB_R * Math.sin(t)]);
      }
      for (var k = 0; k < plan.length - 1; k++) {
        wallQ(plan[k], plan[k + 1], 0, Z_AMB + 26, STONE_D, { bias: WALL_BIAS });
      }
      /* its roof, laid as a fan of tiles */
      for (var m = 0; m < plan.length - 1; m++) {
        emit([[cx, 0, Z_AMB + 26], plan[m].concat(Z_AMB + 26), plan[m + 1].concat(Z_AMB + 26)],
             [0, 0, 1], ROOF, { bias: 2 });
      }
      /* THE SEVEN. Spread over the half-round, each a small block with a
         round-arched window, because this end is Romanesque. */
      for (var c = 0; c < 7; c++) {
        var t2 = -Math.PI / 2 + Math.PI * ((c + 0.5) / 7);
        var ct = Math.cos(t2), st = Math.sin(t2);
        /* HOW FAR THE CHAPELS PROJECT IS NOT FREE. It was drawn at 30 ft and
           the model measured 615.4 ft end to end against a published 601:
           the chapels had walked 14 ft out of the building. The published
           apse compartment is 58 ft deep from the choir's east end, and the
           ambulatory's outer wall already stands at 42, so the chapels have
           58 - 42 = 16 ft to live in and no more. That is now DERIVED from
           the total length rather than chosen, and the length closes. */
        var d0 = AMB_R, d1 = AMB_R + (P.apseL - AMB_R), hw = 15;
        var ax = cx + d0 * ct, ay = d0 * st, bx = cx + d1 * ct, by = d1 * st;
        var px = -st * hw, py = ct * hw;
        var quad = [[ax + px, ay + py], [bx + px, by + py], [bx - px, by - py], [ax - px, ay - py]];
        for (var q = 0; q < 4; q++) {
          wallQ(quad[q], quad[(q + 1) % 4], 0, Z_CHAPEL, STONE_D, { bias: WALL_BIAS + 1 });
        }
        emit(quad.map(function (p) { return [p[0], p[1], Z_CHAPEL]; }), [0, 0, 1],
             ROOF, { bias: 2 });
        /* The chapel's own round-headed window, on its outer face. The face
           points out along the chapel's own radius, so the opening frame is
           built from that radius: origin at the middle of the outer wall,
           running across it on the perpendicular. */
        opening(0, 12, 14, 24, roundRise(14),
                { axis: 'free', o: [bx, by], u: [-st, ct] }, [ct, st, 0], GLASS);
      }
    })();

    /* ===================== 8. LABELS =================================== */
    /* LABELS OFF THE BUILDING. The tower captions were first pinned at the
       tower tops and landed ON the towers, which is the text-on-text problem
       this project has already fixed once on the Empire State. Each label now
       stands well outside the mass it names, so its leader line crosses air
       rather than stone. */
    /* FOUR LABELS, ALL ON THE NEAR SIDE. There were five, and the fifth was
       the problem: St Peter stands on the NORTH side, which at this camera is
       the FAR side, so its leader line had to cross the whole roof to reach
       its own tower and it printed across the stone every time. A caption you
       have to read through a building is worse than no caption, and the two
       tower heights are both in the page text below anyway. So the two towers
       share one label, on the south side, where the eye already is. */
    marks.push({ at: Pt(-60, -P.frontW / 2 - 30, P.towerS + 52),
                 text: '601 ft, west to east' });
    marks.push({ at: Pt(0, 0, P.domeApex + 26), fill: C.hi,
                 text: 'Guastavino tile dome, 1909, meant to be temporary' });
    marks.push({ at: Pt(X_W - 22, -P.frontW / 2 - 30, P.towerS + 12), fill: C.navy,
                 text: 'the towers stop: St Paul 227 ft, St Peter 177' });
    marks.push({ at: Pt(X_E + 40, 0, Z_CHAPEL + 26),
                 text: 'the seven Chapels of the Tongues' });

    return { w: 720, h: 620, faces: f, lines: lines, marks: marks };
  };
})();
