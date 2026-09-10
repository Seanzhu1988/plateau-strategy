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
 * [V] Vertical Access, building envelope consultants to the cathedral:
 *     "A Guastavino tile dome, 162 feet high at the apex."
 *     https://vertical-access.com/projects/the-cathedral-church-of-st-john-the-divine-interior/
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
 *                              sub-bays by narrower flying buttresses, so
 *                              EIGHT sub-bays a side; seven chapels a side,
 *                              one per sub-bay, "except for the easternmost
 *                              sub-bays, which contain entryways at floor
 *                              level". Seven chapels in eight bays is not a
 *                              contradiction; the eighth is the way in.  [L]
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
 *   dome apex                  162 ft above the floor. Hall's 1924 guide,
 *                              which is the cathedral's own, states it and in
 *                              the same breath explains the rival figure:
 *                              "The present dome is temporary; the PERMANENT
 *                              VAULT will be 200 feet above the floor." The
 *                              200 ft that circulates is the vault that was
 *                              never built, applied to the dome that was.
 *                              Corroborated at 162 by the building's own
 *                              envelope consultants.                   [H][V]
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
 *                              W 113th. The building runs west to east
 *                              RELATIVE TO THE MANHATTAN GRID, and it is the
 *                              grid that sits off true north, so liturgical
 *                              east is not compass east. The west front is on
 *                              Amsterdam; the apse faces Morningside Drive.
 *                              An earlier draft of this file said the
 *                              building was NOT aligned to the grid, which is
 *                              backwards.                                 [L]
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
 *   THE NORTH TOWER IS THE NAVE ROOF, exactly. St Peter and the nave ridge
 *   are BOTH published at 177 ft, which is why the report says the tower
 *   reaches the roof of the nave. They are drawn at that one height.
 *
 *   ROOF DEPTH. Ridge 177 minus vault 124 = 53 ft between the inside of the
 *   vault and the outside of the ridge. Both operands are published, so the
 *   depth is derived and not chosen.
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
 *   - the clerestory and arcade opening sizes (the bay COUNT is sourced)
 *   - buttress depth and step count
 *   - the depth the chapels project from the ambulatory
 *   - the exact tones. The MATERIALS are now sourced and the colours follow
 *     them: cream Lake Mohegan granite, oxidised standing-seam copper, cement
 *     stucco on the dome, poured concrete on the temporary wall. What is
 *     unsourced is the precise hex, not the choice of material. An earlier
 *     draft of this list claimed the roof covering was "not sourced at all",
 *     which stopped being true when the designation report was read.
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
  /* THE VAULT IS A PUBLISHED NUMBER, so the eaves ARE it rather than being
     computed back from the ridge. Written as ridge - 50 it silently became
     127 the moment the ridge was corrected from 174 to 177, while the comment
     beside it still claimed 124 and P.vault sat in the FACTS block driving
     nothing at all. The roof depth now falls out of the two published
     figures instead: 177 - 124 = 53 ft. */
  var Z_NAVE_EAVE = P.vault;

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
    /* WALLS ARE TILED FOR THE SAME REASON ROOFS ARE, and not tiling them
       was the worst defect in the first build. The painter sorts on centroid
       depth, and a nave wall is 248 ft long, so its centroid sits 124 ft from
       its own ends while the windows in it spread across the whole run. The
       openings carry a 6 unit lead; the depth spread of the wall they sit on
       is nearer 56. Measured at the shipped camera, TWENTY of the thirty-six
       near-side openings were painted over by the very wall they pierce,
       including exterior windows hidden by the arcade wall standing inside an
       empty nave. Cutting every wall into runs no longer than TILE_MAX puts
       each fragment's centroid beside its own openings and takes that from
       twenty to nine; the rest is interior geometry, dealt with separately. */
    function wallQ(a, b, z0, z1, mat, fo) {
      var n = outward(a, b);
      var L = Math.sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1]));
      var k = Math.max(1, Math.ceil(L / TILE_MAX));
      for (var i = 0; i < k; i++) {
        var t0 = i / k, t1 = (i + 1) / k;
        var p0 = [a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0];
        var p1 = [a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1];
        emit([[p0[0], p0[1], z0], [p1[0], p1[1], z0],
              [p1[0], p1[1], z1], [p0[0], p0[1], z1]], n, mat, fo);
      }
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
      /* THE FIRST ARC POINT IS THE SPRINGING, AND IT WAS ALREADY PUSHED.
         pointedArch starts at [-a, 0] in its own frame, which lands on
         [-a, spring] in the wall's, exactly where the jamb already ended.
         The duplicate made pts[0], pts[1] and pts[2] collinear, so
         H.normal returned [0,0,0] for EVERY opening on the building: 65
         faces whose winding was never corrected and whose shading was a
         flat constant on the sunlit and shaded flanks alike. Start at 1. */
      var arc = ST.pointedArch(w, rise, 14);
      var pts = [[-a, 0], [-a, spring]];
      for (var ai = 1; ai < arc.length; ai++) pts.push([arc[ai][0], spring + arc[ai][1]]);
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
      /* hand the frame back so tracery can be laid in the SAME plane by the
         same arithmetic, rather than a second copy of it that can drift */
      return place;
    }
    /* the two settings, named, so a call site says which style it is in */
    function roundRise(w) { return w / 2; }          /* Romanesque  */
    function lancetRise(w) { return w * 1.15; }      /* Gothic: 1.15 > 0.866 */

    /* ================= THE DETAIL LAYER ===============================
       A correct massing still reads as a blocky church, because what makes
       a Gothic building look Gothic is not its outline: it is bar tracery,
       flying buttresses, pinnacles and parapets. Every piece below is
       described in LP-2585, so this is detail the record asks for rather
       than decoration invented to fill a wall.
       ================================================================= */

    /* BAR TRACERY: two lancets below a rose. LP-2585, of the nave: "The
       arched chapel and clerestory windows all consist of TWO LANCETS BELOW
       A ROSE." That one sentence covers thirty-two openings, which is the
       most repeated element on the building, and they were all drawn as one
       empty pointed hole. A single hole with a ring round it reads closer to
       Romanesque than to Gothic; the mullion and the rose are the difference.
       Drawn as TRIM laid over the glass with a lead that beats the window's
       own depth spread, the lesson the great rose already taught. */
    function tracery(cx, cz, w, totalH, rise, plane, n, place) {
      var spring = totalH - rise, half = w / 2;
      var sill = 0.16 * (totalH - rise);
      var B = WALL_BIAS + 18;
      /* cz IS ALREADY IN place(). Written as place(u, cz + v) every bar was
         drawn at cz + cz + v, roughly TWICE its own height, so the tracery of
         each window climbed out of its opening and stood on the roof: a row
         of thin stone crooks along both slopes that looked for all the world
         like the model was sprouting weeds. Three rounds of bias-hunting went
         past it, because the shapes were in the sky where no wall could
         plausibly cover them and the arithmetic looked innocent. It was not a
         paint-order bug at all; it was a coordinate added twice. */
      function bar(u0, v0, u1, v1, t) {           /* one stone bar, t wide */
        var du = u1 - u0, dv = v1 - v0, L = Math.sqrt(du * du + dv * dv) || 1;
        var px = -dv / L * t, pv = du / L * t;
        emit([place(u0 + px, v0 + pv), place(u1 + px, v1 + pv),
              place(u1 - px, v1 - pv), place(u0 - px, v0 - pv)],
             n, TRIM, { bias: B });
      }
      /* the central mullion, sill to springing: this is what makes it TWO */
      bar(0, sill, 0, spring, 0.55);
      /* each sub-lancet's own little arch head, struck at the same family */
      [-1, 1].forEach(function (side) {
        var sc = side * w * 0.24, sw = w * 0.36;
        var sub = ST.pointedArch(sw, sw * 1.15, 7);
        for (var i = 0; i < sub.length - 1; i++) {
          bar(sc + sub[i][0], spring * 0.72 + sub[i][1],
              sc + sub[i + 1][0], spring * 0.72 + sub[i + 1][1], 0.4);
        }
      });
      /* the rose in the head, between the sub-arches and the apex */
      var rr = w * 0.17, rz = spring + rise * 0.40, seg = 14;
      for (var k = 0; k < seg; k++) {
        var a0 = (k / seg) * Math.PI * 2, a1 = ((k + 1) / seg) * Math.PI * 2;
        bar(rr * Math.cos(a0), rz + rr * Math.sin(a0),
            rr * Math.cos(a1), rz + rr * Math.sin(a1), 0.34);
      }
    }

    /* A FLYING BUTTRESS. LP-2585: the nave facades are "four double bays,
       divided by ARCHED BUTTRESSES", each further split "by narrower FLYING
       BUTTRESSES". These carry the vault's outward thrust over the aisle and
       down the pier, and they are the single most recognisable thing on the
       outside of a French Gothic nave. Drawn as a real arc from the pier head
       to the clerestory wall, not a straight prop. */
    function flyer(x, yPier, yWall, zPier, zWall, s) {
      var N = 9, t = 2.1;
      for (var i = 0; i < N; i++) {
        var u0 = i / N, u1 = (i + 1) / N;
        function pt(u) {
          var y = yPier + (yWall - yPier) * u;
          /* a quarter arc: rises fast off the pier, flattens into the wall */
          var z = zPier + (zWall - zPier) * Math.sin(u * Math.PI / 2);
          return [y, z];
        }
        var a = pt(u0), b = pt(u1);
        /* the flyer's own thickness, drawn as a ribbon with a top and a side */
        /* BIAS 1, NOT 13. Given the wall's own lead these arcs painted over
           the nave roof standing in front of them, so the FAR side's flyers
           and pinnacles came through the roof as a row of thin stems and the
           model appeared to be sprouting weeds. A flyer stands in open air
           over the aisle; it needs no lead at all, and depth alone sorts it.
           The ribbon is also deepened from 5 to 7 ft so it reads as stone
           rather than as a wire when seen near edge-on.

           AND THE LEAD IS NEGATIVE, which took two passes to get right. At
           bias 1 the far side's arcs still came through the clerestory wall
           that stands in front of them, because the margin is genuinely
           tiny: measured at this camera the wall's centroid sits about 152
           deep and the top of a far flyer about 150.7, so a couple of
           segments won and printed as stems over the roof. A flyer never
           needs to paint over anything, so it is pushed behind instead. The
           NEAR side is unaffected: it stands bodily in front of the same
           wall and wins on depth by fifty units, not by one. */
        emit([[x - t, a[0], a[1]], [x + t, a[0], a[1]],
              [x + t, b[0], b[1]], [x - t, b[0], b[1]]], [0, 0, 1], STONE,
             { bias: -4 });
        emit([[x + t, a[0], a[1]], [x + t, b[0], b[1]],
              [x + t, b[0], b[1] - 7], [x + t, a[0], a[1] - 7]], [1, 0, 0], STONE,
             { bias: -4 });
        emit([[x - t, a[0], a[1]], [x - t, b[0], b[1]],
              [x - t, b[0], b[1] - 7], [x - t, a[0], a[1] - 7]], [-1, 0, 0], STONE,
             { bias: -4 });
      }
    }

    /* A PINNACLE. The weight that stands on a buttress pier to turn the
       thrust down into it. Without them a Gothic buttress reads as a shelf. */
    function pinnacle(x, y, z, w, h) {
      var hw = w / 2, t = z + h * 0.45;
      block(x - hw, x + hw, y - hw, y + hw, z, t, TRIM, { bias: -8 });
      /* THE SPIRELET, four triangles from the top square to one apex. Written
         first with a conditional picking each corner, which produced
         degenerate triangles and rendered as a spray of thin spikes: the
         model grew what looked like weeds along both aisle roofs. Corners are
         now named explicitly and walked in order, which is longer and cannot
         collapse. */
      var c = [[x - hw, y - hw], [x + hw, y - hw], [x + hw, y + hw], [x - hw, y + hw]];
      for (var i = 0; i < 4; i++) {
        var a = c[i], b = c[(i + 1) % 4];
        var nx = (a[0] + b[0]) / 2 - x, ny = (a[1] + b[1]) / 2 - y;
        var ln = Math.sqrt(nx * nx + ny * ny) || 1;
        emit([[a[0], a[1], t], [b[0], b[1], t], [x, y, z + h]],
             [nx / ln * 0.8, ny / ln * 0.8, 0.6], TRIM, { bias: -4 });
      }
    }

    /* A PARAPET, which LP-2585 calls "carved parapets": the low wall that
       hides the gutter and finishes the wall head. It is what stops a roof
       from looking like a lid set on a box. */
    function parapet(x0, x1, y, h, s) {
      block(x0, x1, Math.min(y, y + s * 1.6), Math.max(y, y + s * 1.6), h, h + 4.5, TRIM);
    }

    /* A GABLED DORMER, also LP-2585, on the nave roof. */
    function dormer(x, yEave, zEave, zRidge, s, w) {
      /* A dormer sits ON the slope and is small. Drawn first as a deep block
         standing proud of the eaves it read as a green crate on the roof, and
         two of them flanked the west gable like packing cases. It is now a
         low face in the roof plane with its own little gable, which is what a
         dormer is. */
      var hw = w / 2, yD = yEave - s * 5, zD = zEave + 7;
      block(x - hw, x + hw, Math.min(yEave, yD), Math.max(yEave, yD), zEave - 1, zD, TRIM);
      emit([[x - hw, yD, zD], [x + hw, yD, zD], [x, yD, zD + 4.5]],
           [0, s, 0], TRIM, { bias: WALL_BIAS + 6 });
      opening(x, zEave + 0.5, w * 0.42, 8, lancetRise(w * 0.42),
              { axis: 'x', at: yD }, [0, s, 0]);
    }

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
      var BAY = P.naveL / 8;
      [-1, 1].forEach(function (s) {
        var ya = s * yI, yb = s * yO;
        block(X_NAVE_W, X_CR_W, Math.min(ya, yb), Math.max(ya, yb), 0, Z_AISLE, STONE);
        /* EIGHT sub-bays a side, SOURCED: four double bays each split by
           narrower flying buttresses, seven chapels a side one per sub-bay,
           "except for the easternmost sub-bays, which contain entryways". */
        for (var i = 0; i < 8; i++) {
          var cx = X_NAVE_W + (i + 0.5) * BAY;
          var pl = opening(cx, 16, 13, 32, lancetRise(13), { axis: 'x', at: yb }, [0, s, 0]);
          tracery(cx, 16, 13, 32, lancetRise(13), null, [0, s, 0], pl);
        }
        /* THE BUTTRESS PIERS, now stepped rather than one slab. LP-2585 calls
           the bay divisions "arched buttresses" and the sub-bay ones
           "narrower flying buttresses", so the pier alternates: a deep one on
           each double-bay division, a slimmer one between. Each is set back in
           stages as it rises, which is what a buttress does and what a single
           block cannot show, and each carries a pinnacle to weight it. */
        for (var b = 0; b <= 8; b++) {
          var bx = X_NAVE_W + b * BAY;
          var major = (b % 2 === 0);
          var wHalf = major ? 5 : 3.2, proj = major ? 13 : 8.5;
          var y0 = yb, y1 = yb + s * proj;
          /* three set-offs: each stage shorter and shallower than the one below */
          for (var st2 = 0; st2 < 3; st2++) {
            var f = 1 - st2 * 0.26;
            var yy = yb + s * proj * f;
            block(bx - wHalf * f, bx + wHalf * f,
                  Math.min(yb, yy), Math.max(yb, yy),
                  0, (Z_AISLE + 10) * (0.55 + 0.225 * st2), STONE_D);
          }
          pinnacle(bx, yb + s * proj * 0.5, Z_AISLE + 10, major ? 9 : 6.5, major ? 22 : 14);
          /* THE FLYER, over the aisle roof and into the clerestory wall */
          flyer(bx, yb + s * proj * 0.45, s * yI, Z_AISLE + 12, Z_NAVE_EAVE - 16, s);
        }
        parapet(X_NAVE_W, X_CR_W, yb, Z_AISLE, s);
      });
      /* the clerestory: the tall lit box over the arcade */
      block(X_NAVE_W, X_CR_W, -yI, yI, Z_AISLE, Z_NAVE_EAVE, STONE);
      [-1, 1].forEach(function (s) {
        for (var i = 0; i < 8; i++) {
          var cx = X_NAVE_W + (i + 0.5) * BAY;
          var pl = opening(cx, Z_AISLE + 14, 18, 46, lancetRise(18),
                           { axis: 'x', at: s * yI }, [0, s, 0]);
          tracery(cx, Z_AISLE + 14, 18, 46, lancetRise(18), null, [0, s, 0], pl);
        }
        parapet(X_NAVE_W, X_CR_W, s * yI, Z_NAVE_EAVE, s);
      });
      /* the roof, then the gabled dormers LP-2585 records on it */
      /* ONE ROOF FROM THE WEST FRONT TO THE CROSSING. It ran only from the
         nave's west end, leaving the 50 ft of narthex bare above the vault
         line, and through that gap the nave's own west gable showed as a pale
         arrow floating beside the rose window. The narthex is under the same
         roof as the nave; now it is drawn that way. */
      roofGable(X_W, X_CR_W, yI, Z_NAVE_EAVE, P.ridge, ROOF);
      [-1, 1].forEach(function (s) {
        for (var d = 0; d < 4; d++) {
          dormer(X_NAVE_W + (d + 0.5) * (P.naveL / 4), s * yI, Z_NAVE_EAVE + 6,
                 P.ridge, s, 13);
        }
      });
      /* THE ROOF ENDS WERE OPEN HOLES. roofGable draws two slopes and no
         ends, so the nave roof gaped over the crossing and the west gable
         stood as a lone triangle with 50 ft of air behind it. Both closed. */
      emit([[X_CR_W, -yI, Z_NAVE_EAVE], [X_CR_W, yI, Z_NAVE_EAVE], [X_CR_W, 0, P.ridge]],
           [1, 0, 0], STONE, { bias: WALL_BIAS + 1 });
      /* the west end of that roof is closed by the west front's own gable at
         x = X_W, so no second triangle is drawn here */
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
      /* A trumeau stops at the lintel; it does not split the tympanum above
         it. The centre portal's springing is 62 * (1 - 1.15/(1.15+0.5)) and
         works out at 22.9 ft, so that is where this one ends. It was drawn to
         40 and ran 17 ft up into the arch head. */
      emit([[X_W, -1.6, 0], [X_W, 1.6, 0], [X_W, 1.6, 22.9], [X_W, -1.6, 22.9]],
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
      /* THE FIVE BAYS ARE FORMED BY BUTTRESSES, not merely spaced. LP-2585:
         five bays "formed by arched buttresses", their niches "of which ONLY
         THE NORTHERNMOST TWO presently contain statues", the rest being
         "blocks of stone yet to be carved". That last detail is the whole
         building in miniature, so it is drawn: two niches filled, four empty.
         Without these the west front was one flat slab with holes in it. */
      [-124, -62, 62, 124].forEach(function (by, bi) {
        block(X_W - 6, X_W + 2, by / 2 - 5, by / 2 + 5, 0, Z_NAVE_EAVE - 12, STONE);
        pinnacle(X_W - 2, by / 2, Z_NAVE_EAVE - 12, 9, 22);
        /* the niche, and whether anything stands in it. bi counts from the
           SOUTH, so the northernmost two are the last two. */
        var filled = (bi >= 2);
        emit([[X_W - 6.2, by / 2 - 2.6, 54], [X_W - 6.2, by / 2 + 2.6, 54],
              [X_W - 6.2, by / 2 + 2.6, 68], [X_W - 6.2, by / 2 - 2.6, 68]],
             [-1, 0, 0], DARK, { bias: WALL_BIAS + 6 });
        if (filled) {
          block(X_W - 7.4, X_W - 6.0, by / 2 - 1.5, by / 2 + 1.5, 55, 66, TRIM);
        }
      });
      /* the gable over the central bay, between the towers */
      emit([[X_W, -yN, Z_NAVE_EAVE], [X_W, yN, Z_NAVE_EAVE], [X_W, 0, P.ridge]],
           [-1, 0, 0], STONE, { bias: WALL_BIAS + 1 });
      /* THE FOURTEEN-FOOT CARVED CRUCIFIX on the gable, LP-2585. */
      block(X_W - 2, X_W + 0.5, -1.2, 1.2, P.ridge, P.ridge + 14, TRIM);
      block(X_W - 2, X_W + 0.5, -4.5, 4.5, P.ridge + 8.5, P.ridge + 11, TRIM);
      /* THE LESSER ROSE, below the great one: LP-2585 records a second rose
         under the first, a seven-pointed star "relating to the Apocalypse". */
      (function lesserRose() {
        var cz = 84, R = 9, seg = 28;
        function at(u, v) { return [X_W, u, cz + v]; }
        var ring = [];
        for (var i = 0; i < seg; i++) {
          var a = (i / seg) * Math.PI * 2;
          ring.push(at(R * Math.cos(a), R * Math.sin(a)));
        }
        emit(ring, [-1, 0, 0], GLASS, { bias: WALL_BIAS + 20 });
        for (var k = 0; k < 7; k++) {          /* seven points, not eight */
          var t = (k / 7) * Math.PI * 2 - Math.PI / 2, wdt = 0.8;
          var cc = Math.cos(t), ss = Math.sin(t);
          emit([at(-wdt * ss, wdt * cc), at(R * cc - wdt * ss, R * ss + wdt * cc),
                at(R * cc + wdt * ss, R * ss - wdt * cc), at(wdt * ss, -wdt * cc)],
               [-1, 0, 0], TRIM, { bias: WALL_BIAS + 28 });
        }
      })();
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
       the CHOIR AND AMBULATORY are round-arched, which is Heins & LaFarge's
       own Romanesque. The seven chapels beyond them are not: see the chevet
       below. "Everything east of the crossing is round" was the first
       draft's claim and it is too broad. */
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
      /* ITS ROOF IS HIPPED, not flat, and it carries a bronze Angel Gabriel:
         LP-2585 describes a "standing-seam hipped roof, topped by a bronze
         statue of a trumpeting Angel Gabriel". Drawn flat it read as a lid. */
      var apexZ = Z_AMB + 26 + 20;
      for (var m = 0; m < plan.length - 1; m++) {
        emit([[cx, 0, apexZ], plan[m].concat(Z_AMB + 26), plan[m + 1].concat(Z_AMB + 26)],
             [plan[m][0] - cx, plan[m][1], 0.8], ROOF, { bias: 2 });
      }
      /* Gabriel: a small bronze figure, deliberately slight. It is 20 ft of
         statue on a 600 ft building and drawing it larger would be a lie. */
      var GAB = { top: '#7d8b6f', sun: '#6f7d62', shade: '#616e55' };
      block(cx - 1.6, cx + 1.6, -1.6, 1.6, apexZ, apexZ + 11, GAB);
      block(cx - 4.5, cx + 4.5, -1.1, 1.1, apexZ + 7, apexZ + 8.6, GAB);
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
        /* THE SEVEN ARE NOT SEVEN OF THE SAME THING, and drawing them as
           identical boxes was the flattest part of this model. Hall's 1924
           guide gives each chapel's own length and width, and they differ a
           lot: the two at the ends of the half-round are much the largest,
           the axial one is next, and the four between are the small ones.
             St James      66 x 39      St Ambrose   50 x 27
             St Ambrose... St Martin    50 x 27      St Saviour   56 x 30.5
             St Columba    50 x 27      St Boniface  48.5 x 28
             St Ansgarius  66 x 41
           Those lengths are measured inside the chapel and include the bay
           that sits within the ambulatory ring, so they cannot be used as
           radial projections without pushing the building past its own
           published 601 ft. What IS used is their RATIO: the axial chapel is
           given the whole 16 ft the apse compartment leaves, and the others
           are scaled against it, so the relative sizes are Hall's even though
           the absolute projection is the one the total length allows. */
        var HALL = [[66, 39], [50, 27], [50, 27], [56, 30.5], [50, 27], [48.5, 28], [66, 41]];
        var axialL = HALL[3][0], room = P.apseL - AMB_R;
        var d0 = AMB_R;
        var d1 = AMB_R + room * (HALL[c][0] / axialL);
        var hw = 15 * (HALL[c][1] / HALL[3][1]);
        var ax = cx + d0 * ct, ay = d0 * st, bx = cx + d1 * ct, by = d1 * st;
        var px = -st * hw, py = ct * hw;
        var quad = [[ax + px, ay + py], [bx + px, by + py], [bx - px, by - py], [ax - px, ay - py]];
        for (var q = 0; q < 4; q++) {
          wallQ(quad[q], quad[(q + 1) % 4], 0, Z_CHAPEL, STONE_D, { bias: WALL_BIAS + 1 });
        }
        emit(quad.map(function (p) { return [p[0], p[1], Z_CHAPEL]; }), [0, 0, 1],
             ROOF, { bias: 2 });
        /* THESE WINDOWS ARE POINTED, and getting that wrong was the sharpest
           finding of the review. The east end being Romanesque is true of its
           STRUCTURE, and the chapels are the exception: they were given to
           four different practices, and Vaughan's three, Cram's one and the
           axial St Saviour are all Gothic of one kind or another. LP-2585
           describes the chapel facades as pointed-arch fenestration. So the
           round arch stops at the ambulatory and choir, which are Heins &
           LaFarge's own work, and the chapels ringing them are pointed.
           The face points out along the chapel's own radius, so the opening
           frame is built from that radius. */
        opening(0, 12, 14, 26, lancetRise(14),
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
