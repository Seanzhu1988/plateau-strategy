/* dc-form-gallery.js: the National Gallery of Art, WEST Building.
 *
 * John Russell Pope, accepted 17 March 1941, 700 Constitution Avenue NW.
 * What stood here before was the generic "block" form: one extruded slab,
 * 80 by 40 units, no cornice, no portico, no dome, no shadow. The West
 * Building is 780 feet of pink marble with two Ionic porticoes and a saucer
 * dome, so a box is not a simplification of it, it is a different building.
 *
 * STYLE: Neoclassical, in its late American stripped form. STYLES.md does not
 * carry this style, and this file is forbidden to edit STYLES.md, so the tells
 * this model is built on are named here and the entry is OWED:
 *   - NO ARCHES anywhere, on any elevation. An arch here is Beaux-Arts, a
 *     different decade.
 *   - The gallery walls are BLANK. A museum lit through its roof has no
 *     windows to give its flanks, and the source below says so in as many
 *     words. Any window cut into the long marble runs is a fabrication.
 *   - No rustication, no paired columns, no applied sculpture, no cartouches.
 *     Pope stripped the vocabulary down to surface, proportion and shadow.
 *   - Two orders, ranked: austere Doric for the pilasters everywhere, the
 *     richer Ionic reserved for the porticoes and the rotunda. Corinthian is
 *     wrong on this building.
 *   - A SAUCER dome on a low drum, set well back. A tall lanterned dome is
 *     the Capitol; a high hemisphere on a colonnaded drum is Pope's own
 *     Jefferson Memorial. Neither is this.
 *   - Stone graded in TONE rather than texture: seven shades of one marble,
 *     darkest at the base, near white at the cornice, palest of all on the
 *     dome. That gradient is half the building's argument and it is the one
 *     thing this model would be wrong without.
 *
 * ===================== PUBLISHED, quoted, with sources =====================
 *
 * NGA's own Brief Guide (Project Gutenberg 66746, fetched this run):
 *   "The building is one of the largest marble structures in the world,
 *    measuring 780 feet in length and containing more than 500,000 square
 *    feet of interior floor space."
 *   "The exterior is of rose-white Tennessee marble."
 *   https://www.gutenberg.org/files/66746/66746-h/66746-h.htm
 *
 * SAH Archipedia DC-01-ML16, https://sah-archipedia.org/buildings/DC-01-ML16 :
 *   "The 782-foot longitudinal spine passes through the entire building,
 *    intersecting three great cross-axial masses before it emerges from both
 *    ends."                                    <- the whole plan, in one line
 *   "Six distinct rectilinear volumes, unbroken by windows"
 *   "a complex shallow layering of pilasters, moldings, architraves, and panels"
 *   "From the Mall one ascends a tall, broad staircase to the main entrance
 *    portico. Twelve Ionic columns are distributed in two rows, with the inner
 *    ones framing three doors."
 *   the Constitution Avenue portico is "similar but set high above the street
 *    with entries cut into its solid base"
 *   "sixteen monolithic 36-foot-tall green Italian marble columns" in the
 *    rotunda, carrying "the limestone entablature and parapet"
 *   "With the exception of the Ionic order repeated in the rotunda, the more
 *    austere Doric is employed for pilasters throughout"
 *   "Andrew Mellon chose the pink Tennessee marble, seven shades of which are
 *    used on the exterior. The graduated hue from pink at the base to
 *    near-white at the cornice is a subtle factor in keeping the huge masses
 *    from being too ponderous."   ...   "the lightest color was reserved for
 *    the dome"   ...   "The outer columns of the porticoes are a darker hue
 *    while those at the center are lighter."
 *   Pope "specified that skylights should cover virtually the entire
 *    three-acre roof", with "shorter parallel setback roofs".
 *
 * NCPC File 8325, West Building Exterior Repairs, November 2021:
 *   "membrane roof replacement between skylights ... masonry parapet
 *    restoration"; the building "is bounded by Constitution Avenue to the
 *    north, Seventh Street, NW, to the west, Madison Drive to the south, and
 *    Fourth Street, NW, to the east".
 *   https://www.ncpc.gov/docs/actions/2021November/8325_West_Building_Exterior_Repairs_Staff_Report_Nov2021.pdf
 *
 * Wikidata Q129673434: John Russell Pope, neoclassical, Tennessee marble,
 *   1941, 38.891389 / -77.02, which is the coordinate dc-3d.js already
 *   carries, so the place entry IS the West Building and not the East.
 *   https://www.wikidata.org/wiki/Q129673434
 *
 * =================== MEASURED THIS RUN, and labelled so ====================
 *
 * PLAN, from OSM way 66418944 through Overpass (62 vertices, projected to feet
 * about its own centroid 38.891340 / -77.019944, which is 8 metres from the
 * dc-3d.js place coordinate). https://www.openstreetmap.org/way/66418944
 *
 * The raw polygon runs 0.888 degrees north of east, weighted over 2,347 ft of
 * edge. De-rotated by that angle the trace snaps to axis-aligned rectangles
 * with sub-foot residuals, which is the check that the decomposition below is
 * the building and not my reading of it:
 *
 *   de-rotated bounding box   787.5 ft east-west by 309.6 ft north-south
 *   published length          780 ft            (0.96 percent apart, agreed)
 *   SPINE      full length, v from -86.0 to +87.4      = 173.4 ft deep
 *   WINGS      four, u 181.0 to 326.5 each side, out to v +/-153.4
 *   S PORTICO  u -55.4 to +58.1 = 113.5 ft wide, front face v -129.5
 *   N PORTICO  u -59.2 to +59.0 = 118.2 ft wide, front face v +129.9
 *   the spine emerges 67 ft beyond the wings at each end
 *
 * That is SAH's sentence, measured: a spine running the whole length, three
 * cross-axial masses on it (west wings, the portico block, east wings), and
 * the spine emerging at both ends. Six volumes.
 *
 * The model is drawn axis-aligned; the 0.888 degree skew is removed and named
 * rather than carried, because at map scale it is 12 ft of lean on a building
 * whose own trace disagrees with itself by more than that. East and west
 * faces measured up to 2.6 ft apart on a symmetrical building, which is
 * digitising noise, so the model uses the mean and says so.
 *
 * COUNTS AND ELEVATION, from two Wikimedia Commons photographs, which is what
 * STYLES.md's Massachusetts State House entry does when the text gives extents
 * and no counts. Both were measured programmatically (brightness profile
 * across the shafts, sky/silhouette trace), not eyeballed:
 *   A  National-Gallery-of-Art-West-Building-John-Russell-Pope-National-Mall-
 *      Washington-DC-04-2014.jpg  (frontal, Mall side)
 *   B  National_Gallery_of_Art_-_West_Building.JPG  (Mall side, dome visible)
 *   C  National_Gallery_of_Art_4.jpg  (Constitution Avenue, oblique)
 *
 * What the photographs settle, and TWO OF THEM CORRECT THE BRIEF:
 *   1. THERE IS A PEDIMENT, on BOTH porticoes, plain and unsculptured. The
 *      research reached no text describing one and said not to assume one.
 *      A and C show one plainly. A pediment that is there is drawn.
 *   2. THE DOME IS NOT "barely visible". B shows its crown standing clear
 *      above the pediment apex from the Mall, and C shows drum and dome in
 *      full from Constitution Avenue. It is LOW, not hidden.
 *   3. The front row of the Mall portico is EIGHT columns (shaft centres
 *      recovered at 100, 228, 366, 499, 628, 763, 871 px with a mean spacing
 *      of 128 px, the eighth outside the crop). Eight in front and four
 *      behind is also what the published sentence forces: four inner columns
 *      are what frame three doors.
 *   4. The flanking walls carry no windows in any view, in agreement with
 *      "unbroken by windows".
 *   5. The flank's parapet top sits level with the tops of the portico
 *      columns' capitals. That is a clean measurable relation and it is what
 *      the vertical stack below is hung on.
 *
 * ============================ NAMED GAPS ============================
 * Nothing below is guessed silently. Each of these is an assumption or a
 * photographic proportion, and is labelled again at its constant.
 *
 *  - NO PUBLISHED OVERALL HEIGHT. Nothing in NGA's own guide, Wikipedia,
 *    Wikidata, SAH Archipedia, the NCPC file or the DC Historic Sites record
 *    gives one, and nga.gov returns 403 to every fetch tried this run. Two
 *    unpublished figures exist and disagree by 1.6 times: dc-3d.js carries
 *    h: 26 (85.3 ft) with unknown provenance, and the OSM polygon carries a
 *    crowd-entered height=41.3 (135.5 ft). NEITHER IS ADOPTED AS THE SCALE.
 *    This form is built at TRUE FEET and its height falls out of the stack.
 *    See the SCALE note below.
 *  - No published dome diameter, drum diameter or dome rise.
 *  - No published rotunda diameter. The 36 ft is the ROTUNDA columns, inside,
 *    and must never be transplanted onto the exterior order.
 *  - No published portico column height, diameter or spacing.
 *  - No published step count on either portico, and no published stair width
 *    or projection.
 *  - No published split of the twelve portico columns between the two rows.
 *    Eight and four is DERIVED from "the inner ones framing three doors" and
 *    CONFIRMED by counting photograph A.
 *  - No published cornice, parapet, water table or storey heights.
 *  - No published count of exterior pilasters or bays.
 *  - No published dimensions for the perimeter light moat, the garden courts,
 *    the sculpture halls, or the roof plant. None is drawn.
 *  - Photographs show small framed grille openings low in the flank wall near
 *    the ends. They are dimensioned nowhere and are NOT drawn; absence over
 *    invention.
 *  - The real ground falls from Madison Drive to Constitution Avenue, which
 *    is why the north portico rides a solid base. The renderer's lawn is
 *    flat, so both fronts stand on the same grade here and the north base is
 *    drawn at the same 20 ft as the south stair climbs.
 *
 * ====================== SCALE, and the height question =====================
 *
 * FT = 0.3048 * VE. TRUE FEET, no scaling to p.h, for the reason the Vietnam
 * form gives in reverse: there, p.h had been inflated by the MIN_H floor and
 * could not be trusted; here p.h is not floored (26 > 12) but it is not
 * PUBLISHED either, so scaling the building to it would dress an unsourced
 * number as a measurement. Every horizontal distance in dc-3d.js is true
 * metres, so a true-feet building sits correctly among its neighbours.
 *
 * The vertical stack is then hung on the ONE published vertical dimension the
 * building has, and the chain is shown so it can be refuted:
 *
 *   the rotunda is entered from the portico, so the rotunda floor IS the
 *   portico floor and IS the main floor.
 *     36.0   rotunda columns                    PUBLISHED (SAH)
 *   +  7.2   their entablature, one fifth of the column, the classical rule
 *            already used in dc-form-capitol.js
 *   +  4.0   the parapet SAH says they carry     assumption
 *   = 47.2   springing of the inner dome above the main floor
 *   + ~35    a Pantheon-proportioned rise over a rotunda near 70 ft across
 *   = ~82    the oculus above the main floor
 *
 *   and independently, from photograph B measured on the portico's own plane
 *   and scaled by the OSM-measured 113.5 ft portico width, the crown of the
 *   OUTER dome stands about 8 to 9 ft above the pediment apex.
 *
 *   Those two close on each other. The stack used is, in feet above the Mall
 *   grade, and EVERY LINE OF IT IS AN ASSUMPTION OR A PHOTOGRAPHIC RATIO:
 *
 *      2.5  podium                          20.0  main floor / portico floor
 *      6.5  water table                      68.0  portico capitals   <- = parapet
 *     50.0  top of the blank gallery wall    79.5  portico entablature
 *     54.5  architrave                       95.0  pediment apex
 *     59.5  frieze                           72.0  attic block under the drum
 *     63.0  cornice, and the roof deck       89.0  drum
 *     68.0  parapet                         104.0  crown of the dome
 *
 *   so the model's own maximum is 104 ft = 31.7 m, against a place height of
 *   26 m. That is NOT reported as a correction, because there is no published
 *   number to correct it against and a derived number does not get to
 *   overwrite a table entry. It is reported as what it is: a disagreement
 *   between two unpublished figures, waiting on the drawings.
 *
 *   The one thing the stack does settle is which unpublished figure is
 *   IMPOSSIBLE. At the OSM tag's 135.5 ft, a classical elevation whose main
 *   floor carries a 36 ft order would leave roughly 60 ft of dome above the
 *   cornice, which is a landmark dome and not the low cap every photograph
 *   shows. 41.3 m is refuted; 26 m is merely unsourced.
 *
 * ============================== PAINT ==============================
 *
 * depthOf returns the MINIMUM projected depth, that is the FARTHEST point of
 * a face, and the host sorts ascending, so faces paint far to near. The trap:
 * a single 787 ft wall quad takes its depth from whichever END is farther, so
 * it sorts as though the whole wall lived at that end and everything along
 * its length paints on top of it in the wrong order. So EVERY long surface
 * here (walls, cornices, parapets, roof deck) is cut into bays and sorts
 * locally. That is the Hirshhorn ring's lesson and the NMAAHC ledge's lesson
 * arriving together, designed in rather than discovered.
 *
 * =================== WHAT LOOKING CAUGHT, AND COUNTING DID NOT ============
 *
 * Eleven renders, five yaws (-0.55, +0.90, -1.35, -2.20, +2.35) and three
 * pitches. Every one of these passed the arithmetic. None of them survived a
 * picture, worst first:
 *
 *  1. THE PORTICO'S BACK WALL HAD ITS NORMAL INVERTED. A wall behind a
 *     colonnade faces OUT of the portico, toward whoever is standing in it,
 *     so its normal is +sgn; written -sgn it was culled from the front and
 *     drawn only from the back. The twelve columns therefore stood against an
 *     open void with the roof showing between them, and the three PUBLISHED
 *     doors could never be seen from any angle. The count was right and the
 *     wall was inside out, which no count can tell you.
 *  2. SEEN FROM BEHIND, a portico's front is culled and it has no colonnade,
 *     so the far pediment HUNG IN THE AIR over the lawn on one thin leg. It
 *     is a solid mass from that side and is now gated to be one. Third time
 *     this project has met that lesson, after the Hirshhorn balcony and the
 *     NMAAHC porch.
 *  3. THE PEDIMENT'S OWN ROOF PLANE PAINTED OVER ITS TYMPANUM. depthOf takes
 *     a face's FARTHEST point, and a 113 ft triangle and a raking quad of a
 *     different extent cannot be sorted against each other that way: the
 *     roof's far ridge corner put it last and a pale slab covered the
 *     pediment's face. Both are now cut into strips. The same fault, in the
 *     same run, hid the portico's whole entablature under the gable, so the
 *     columns ran straight into the roof with no order between them.
 *  4. THE PILASTERS WERE INVISIBLE. Drawn in the wall's own tone on the
 *     wall's own plane, a 0.9 ft projection is nothing at map scale, so the
 *     header claimed "pilasters throughout" over a blank wall. That is
 *     realism checklist item 1, and item 1 names it as the commonest failure
 *     there is. They now project 1.5 ft and take the next shade UP the
 *     published gradient, which is also what a projecting member does in real
 *     light.
 *  5. THE BUILDING HAD NO SHADOW, twice over. H.shadow lays the footprint
 *     down by 0.587 of the height it is given while this renderer's own light
 *     stands at 48 degrees, which wants 0.906, so a 68 ft wall got a 34 ft
 *     fringe that vanished under the podium; and the helper's forward ring
 *     plus reversed offset ring is a bowtie on a rectangle this size, which
 *     SVG's nonzero fill turned into triangular fins pointing off the
 *     corners. Both are corrected in this file rather than in the shared one.
 *  6. THE DOME CAME BACK AS A WIREFRAME. A per-ring depth bias made each
 *     higher ring paint after the one below it, so the far side of the crown
 *     painted over the near side and the saucer read as a lattice of arcs and
 *     spokes. The bias is gone, the rings overlap, and the per-facet tone is
 *     damped, which is the Hirshhorn tyre avoided rather than repeated.
 *  7. THE THREE DOORS behind the colonnade were pushed INTO the building by
 *     an inverted sign and surfaced as a dark rectangle floating on the
 *     portico's flank.
 *  8. THE STAIRCASE WAS A RAMP. Twenty courses over 20 ft is a one foot
 *     riser, and at a 0.30 pitch you look down on the treads, so every course
 *     rendered the same tone and a stack of slabs read as a sloping deck. Ten
 *     courses of two feet, alternating in tone, is the only device that
 *     survives map scale, and it is named here rather than passed off.
 *  9. THE SHADED ELEVATIONS WERE MUD. The renderer floors a shaded face at
 *     0.62 of its hex, so pink Tennessee marble at a plausible hex came back
 *     brown-grey and the published seven-shade gradient disappeared. The
 *     whole palette is lifted, with the gradient carried in hue and in the
 *     value that survives the floor.
 * 10. and one of mine, recorded because it nearly became a fix: a dark
 *     rectangle apparently detached from the building read as a stray shadow
 *     for two renders. Sampling the pixels showed three lawn tones, not two:
 *     it was this form's OWN GROUND PAD ending against the page. The pad is
 *     now sized to the frame and bounded so it cannot reach past the Mall's
 *     lawn in the shared scene and quietly shrink every other building on the
 *     axis.
 *
 * FRAME. u east, v north, z up, all in feet, origin at the plan centre.
 */
(function () {
  var H = window.DC3D.helpers;
  window.DC_FORMS = window.DC_FORMS || {};
  window.DC_FORMS['gallery'] = function (ctx, p, s, VE) {
    var P = ctx.project, items = [];
    var FT = 0.3048 * VE;            /* TRUE feet, see the SCALE note */
    var m = FT * s;
    function W(u, v) { return [p.x + u * m, p.y + v * m]; }
    function pt(u, v, z) { return P(p.x + u * m, p.y + v * m, z * FT); }
    function far(q) { return H.depthOf(q); }

    /* the camera, recovered from the projection, so a sloping face (a dome
       ring, a pediment roof plane) can be culled by its full 3D normal and
       not only by its plan normal. Same recovery dc-form-capitol.js uses. */
    var o0 = P(p.x, p.y, 0), ox = P(p.x + 1, p.y, 0),
        oy = P(p.x, p.y + 1, 0), oz = P(p.x, p.y, 1);
    var sYaw = ox[2] - o0[2], cYaw = oy[2] - o0[2];
    var dzY = oz[1] - o0[1];
    var dhY = Math.abs(cYaw) > Math.abs(sYaw) ? (oy[1] - o0[1]) / cYaw
                                              : (ox[1] - o0[1]) / sYaw;
    var tanP = dzY === 0 ? 0.3 : dhY / (-dzY);
    var cP = 1 / Math.sqrt(1 + tanP * tanP), sP = tanP * cP;
    function vis3(nx, ny, nz) { return (nx * sYaw + ny * cYaw) * cP + nz * sP > 0.001; }

    /* ---------------- PLAN, feet, measured from OSM way 66418944 --------- */
    var HU    = 393.5;    /* half length, 787 ft overall */
    var SV    = 86.75;    /* half depth of the spine, 173.5 ft */
    var WU0   = 181.0, WU1 = 326.5;   /* the wings, in u */
    var WV    = 153.5;    /* outer face of the wings */
    var SPHW  = 56.75;    /* south portico half width, 113.5 ft */
    var NPHW  = 59.10;    /* north portico half width, 118.2 ft */
    var PV    = 129.75;   /* portico front plane, both fronts */

    /* ---------------- ELEVATION, feet, see the SCALE note ---------------- */
    var Z_POD = 2.5, Z_WT = 6.5, Z_WALL = 50, Z_ARCH = 54.5, Z_FRZ = 59.5,
        Z_CORN = 63, Z_PAR = 68;
    var Z_MAIN = 20, COL_H = 48, Z_CAP = Z_MAIN + COL_H,   /* = 68 */
        Z_ENT = 79.5, PED_RISE = 15.5;                     /* apex 95 */
    var Z_ATT = 72, Z_DRUM = 89, DR = 43, DOME_RISE = 15;  /* crown 104 */
    var COR_P = 2.5, WT_P = 1.2, ARC_P = 0.6, PIL_P = 1.5, PIL_W = 4.6;
    var BAY = 26;         /* target bay, gap: no published pilaster count */
    var STAIR_HW = 130, STAIR_RUN = 58, STAIR_N = 10;  /* gap: no published stair */

    /* -------- the seven shades, PUBLISHED as seven, base to cornice ------
       lit is the warmer face, shade the cooler one; ctx.shade then darkens
       by the true normal, so every material carries two tones minimum. */
    var M1 = { lit: "#cdb0a0", shade: "#d8bfb0" };   /* podium, darkest pink  */
    var M2 = { lit: "#d9bdac", shade: "#e3cdbe" };   /* water table           */
    var M3 = { lit: "#e4cbbb", shade: "#eedacd" };   /* the great blank wall  */
    var M4 = { lit: "#ecd9cb", shade: "#f5e7dd" };   /* architrave            */
    var M5 = { lit: "#f1e3d8", shade: "#f9efe8" };   /* frieze                */
    var M6 = { lit: "#f7ece5", shade: "#fcf6f1" };   /* cornice               */
    var M7 = { lit: "#fcf5f1", shade: "#fefbf9" };   /* parapet, near white   */
    var MDOME = { lit: "#fcf8f5", shade: "#fefcfa" };/* palest, PUBLISHED     */
    var MCOL_D = { lit: "#dcc0ad", shade: "#e7d2c3" };/* outer columns darker */
    var MCOL_L = { lit: "#f8f0ea", shade: "#fcf6f2" };/* centre ones lighter  */
    var MROOF = { lit: "#cbc5ba", shade: "#d7d1c8" };
    var MGLASS = { lit: "#bcc5c9", shade: "#c9d1d4" };
    var MPROOF = { lit: "#d2cbc0", shade: "#ded8cf" }; /* the pediment roofs  */
    var MSTEP = { lit: "#e0cabb", shade: "#ead9cd" };
    var MSTEP2 = { lit: "#d3bbac", shade: "#ddc9bb" };
    var DOOR = "#4a423a", SOFFIT = "#9b9086";

    var LD = [0.55, 0.35, 0.72];
    function tone(mm, nx, ny, nz) {
      var d = nx * LD[0] + ny * LD[1] + nz * LD[2];
      return ctx.shade(d > 0.05 ? mm.lit : mm.shade, nx, ny, nz);
    }
    /* the published gradient, as one function: a column, a pilaster or any
       band takes the shade its own height earns. */
    function byHeight(z) {
      if (z < Z_POD) return M1;
      if (z < Z_WT) return M2;
      if (z < Z_WALL) return M3;
      if (z < Z_ARCH) return M4;
      if (z < Z_FRZ) return M5;
      if (z < Z_CORN) return M6;
      return M7;
    }

    var NRM = [[0, -1], [1, 0], [0, 1], [-1, 0]];

    /* an axis-aligned box, per-face culled, with an optional top */
    function box(u0, u1, v0, v1, z0, z1, mm, o) {
      o = o || {};
      var lo = [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
      var skip = o.skip || [], bias = o.bias || 0;
      for (var i = 0; i < 4; i++) {
        if (skip.indexOf(i) >= 0) continue;
        if (!ctx.faceVisible(NRM[i][0], NRM[i][1])) continue;
        var j = (i + 1) % 4;
        var q = [pt(lo[i][0], lo[i][1], z0), pt(lo[j][0], lo[j][1], z0),
                 pt(lo[j][0], lo[j][1], z1), pt(lo[i][0], lo[i][1], z1)];
        items.push({ svg: ctx.poly(q, tone(mm, NRM[i][0], NRM[i][1], 0), null, 0),
                     depth: (o.depth === undefined ? far(q) : o.depth) + bias + i * 0.0002 });
      }
      if (!o.noTop) {
        var tq = [pt(u0, v0, z1), pt(u1, v0, z1), pt(u1, v1, z1), pt(u0, v1, z1)];
        items.push({ svg: ctx.poly(tq, tone(mm, 0, 0, 1), null, 0),
                     depth: (o.depth === undefined ? far(tq) : o.depth) + bias + 0.0012 });
      }
    }

    /* one flat quad standing in a wall plane. axis 'u' means the run is along
       u and the outward normal is (0, sgn); axis 'v' means the reverse. */
    function face(axis, fixed, a0, a1, z0, z1, sgn, mm, bias) {
      var nx = axis === 'u' ? 0 : sgn, ny = axis === 'u' ? sgn : 0;
      if (!ctx.faceVisible(nx, ny)) return;
      var q = axis === 'u'
        ? [pt(a0, fixed, z0), pt(a1, fixed, z0), pt(a1, fixed, z1), pt(a0, fixed, z1)]
        : [pt(fixed, a0, z0), pt(fixed, a1, z0), pt(fixed, a1, z1), pt(fixed, a0, z1)];
      items.push({ svg: ctx.poly(q, tone(mm, nx, ny, 0), null, 0),
                   depth: far(q) + (bias || 0) });
    }
    /* a horizontal band's top, e.g. the cornice's weathering */
    function ledge(axis, f0, f1, a0, a1, z, mm, bias) {
      var q = axis === 'u'
        ? [pt(a0, f0, z), pt(a1, f0, z), pt(a1, f1, z), pt(a0, f1, z)]
        : [pt(f0, a0, z), pt(f0, a1, z), pt(f1, a1, z), pt(f1, a0, z)];
      items.push({ svg: ctx.poly(q, tone(mm, 0, 0, 1), null, 0),
                   depth: far(q) + (bias || 0) });
    }

    /* ------------------------------------------------------------------
       ONE RUN OF EXTERIOR WALL, cut into bays so it sorts locally, with the
       horizontal breaks as their own thin slabs and a Doric pilaster on
       every bay division. The pilaster count is a NAMED GAP; the rhythm is
       the published "pilasters throughout" drawn at a 26 ft bay.
       ------------------------------------------------------------------ */
    function wallRun(axis, fixed, a0, a1, sgn) {
      var len = a1 - a0;
      var nb = Math.max(1, Math.round(len / BAY));
      var step = len / nb;
      var fw = fixed + sgn * WT_P;      /* water table plane   */
      var fa = fixed + sgn * ARC_P;     /* architrave plane    */
      var fc = fixed + sgn * COR_P;     /* cornice plane       */
      var fp = fixed - sgn * 0.6;       /* parapet, set back   */
      for (var b = 0; b < nb; b++) {
        var b0 = a0 + b * step, b1 = a0 + (b + 1) * step;
        /* a whisker of overrun, so abutting quads cannot round apart under
           toFixed and leave a ladder of pale seams (the Hirshhorn starburst) */
        var b1o = Math.min(a1, b1 + step * 0.02);
        face(axis, fw, b0, b1o, Z_POD, Z_WT, sgn, M2, 0.10);
        face(axis, fixed, b0, b1o, Z_WT, Z_WALL, sgn, M3, 0);
        face(axis, fa, b0, b1o, Z_WALL, Z_ARCH, sgn, M4, 0.10);
        face(axis, fixed, b0, b1o, Z_ARCH, Z_FRZ, sgn, M5, 0.05);
        /* the shadow the cornice throws down the frieze. Every photograph of
           this building is read by that one dark line; without it a 2.5 ft
           projection is invisible at map scale and the cornice becomes paint
           on a wall, which is realism checklist item 2 failing quietly. */
        if (ctx.faceVisible(axis === 'u' ? 0 : sgn, axis === 'u' ? sgn : 0)) {
          var shq = axis === 'u'
            ? [pt(b0, fixed, Z_FRZ - 1.7), pt(b1o, fixed, Z_FRZ - 1.7),
               pt(b1o, fixed, Z_FRZ), pt(b0, fixed, Z_FRZ)]
            : [pt(fixed, b0, Z_FRZ - 1.7), pt(fixed, b1o, Z_FRZ - 1.7),
               pt(fixed, b1o, Z_FRZ), pt(fixed, b0, Z_FRZ)];
          items.push({ svg: ctx.poly(shq, "#000", null, 0, ' opacity="0.20"'),
                       depth: far(shq) + 0.08 });
        }
        face(axis, fc, b0, b1o, Z_FRZ, Z_CORN, sgn, M6, 0.20);
        ledge(axis, fixed, fc, b0, b1o, Z_CORN, M6, 0.24);
        face(axis, fp, b0, b1o, Z_CORN, Z_PAR, sgn, M7, 0.16);
        ledge(axis, fp, fp - sgn * 1.4, b0, b1o, Z_PAR, M7, 0.30);
      }
      /* the pilasters: one on every bay division, ends included */
      for (var k = 0; k <= nb; k++) {
        var c = a0 + k * step;
        var q0 = Math.max(a0, c - PIL_W / 2), q1 = Math.min(a1, c + PIL_W / 2);
        if (q1 - q0 < 0.5) continue;
        var f0 = Math.min(fixed, fixed + sgn * PIL_P), f1 = Math.max(fixed, fixed + sgn * PIL_P);
        if (axis === 'u') box(q0, q1, f0, f1, Z_WT, Z_WALL, M4, { noTop: true, bias: 0.30 });
        else box(f0, f1, q0, q1, Z_WT, Z_WALL, M4, { noTop: true, bias: 0.30 });
        /* the Doric capital: a plain square block, no more, because that is
           what Doric is and it is what makes a pilaster read as an order */
        if (axis === 'u') box(q0 - 0.5, q1 + 0.5, f0 - (sgn > 0 ? 0 : 0.4), f1 + (sgn > 0 ? 0.4 : 0), Z_WALL - 2.2, Z_WALL, M5, { bias: 0.34 });
        else box(f0 - (sgn > 0 ? 0 : 0.4), f1 + (sgn > 0 ? 0.4 : 0), q0 - 0.5, q1 + 0.5, Z_WALL - 2.2, Z_WALL, M5, { bias: 0.34 });
      }
    }

    /* an eight-sided shaft, so a column is a column and not a stick */
    function shaft(cu, cv, r0, r1, z0, z1, mm, bias) {
      var n = 8, rot = Math.PI / 8;
      var L = Math.sqrt((r0 - r1) * (r0 - r1) + (z1 - z0) * (z1 - z0)) || 1;
      var nz = (r0 - r1) / L, nh = (z1 - z0) / L;
      for (var i = 0; i < n; i++) {
        var a = rot + (i / n) * Math.PI * 2, a2 = rot + ((i + 1) / n) * Math.PI * 2;
        var mx = (Math.cos(a) + Math.cos(a2)) / 2, my = (Math.sin(a) + Math.sin(a2)) / 2;
        var l = Math.sqrt(mx * mx + my * my) || 1;
        var nx = mx / l * nh, ny = my / l * nh;
        if (!vis3(nx, ny, nz)) continue;
        var q = [pt(cu + r0 * Math.cos(a), cv + r0 * Math.sin(a), z0),
                 pt(cu + r0 * Math.cos(a2), cv + r0 * Math.sin(a2), z0),
                 pt(cu + r1 * Math.cos(a2), cv + r1 * Math.sin(a2), z1),
                 pt(cu + r1 * Math.cos(a), cv + r1 * Math.sin(a), z1)];
        items.push({ svg: ctx.poly(q, tone(mm, nx, ny, nz), null, 0),
                     depth: far(q) + (bias || 0) + i * 0.0001 });
      }
    }

    /* an IONIC column: base, tapered fluted-scale shaft, a volute block that
       is wider across the front than it is deep, and a thin abacus. */
    function ionic(cu, cv, z0, h, mm) {
      var r = h / 17;                 /* gap: no published diameter. h/17
                                         half-diameter is a stocky Ionic,
                                         which is what photograph B shows */
      shaft(cu, cv, r * 1.16, r * 1.16, z0, z0 + h * 0.035, mm, 0.02);
      shaft(cu, cv, r, r * 0.87, z0 + h * 0.035, z0 + h * 0.90, mm, 0.02);
      box(cu - r * 1.55, cu + r * 1.55, cv - r * 1.05, cv + r * 1.05,
          z0 + h * 0.90, z0 + h * 0.965, mm, { bias: 0.05 });
      box(cu - r * 1.7, cu + r * 1.7, cv - r * 1.2, cv + r * 1.2,
          z0 + h * 0.965, z0 + h, mm, { bias: 0.07 });
    }

    /* ------------------------------- GROUND ---------------------------- */
    (function () {
      /* the only-gallery scene sizes its lawn from p.h, which gives a pad
         176 m across for a building 240 m long, so this form brings its own
         ground, in the host's own lawn tone so the two meet without a seam.
         Held to 700 by 300 ft: any larger and it reaches past the Mall's own
         lawn in the shared scene and quietly grows that scene's bounding box,
         which would shrink every other building on the axis. */
      var R = 700, RY = 300;
      items.push({ svg: ctx.poly([pt(-R, -RY, 0), pt(R, -RY, 0), pt(R, RY, 0), pt(-R, RY, 0)],
                                 H.C.lawn, null, 0), depth: -1e9 + 0.3 });
    })();

    /* shadows first in the list, sorted under the building by their own
       depth. Cast from the masses that actually stand in the light. */
    /* ------------------------------ SHADOW ------------------------------
       Two things were wrong with H.shadow on a building this size, and the
       picture showed both. First the LENGTH: the helper lays the footprint
       down LIGHT_DIR by 0.587 of the height it is handed, while this
       renderer's own light vector (0.55, 0.35, 0.72) stands at 48 degrees,
       which throws a shadow 0.906 of the height, so a 68 ft wall got a 34 ft
       fringe and the model sat on the grass with nothing under it. Second the
       SHAPE: the helper walks the footprint forward and its offset copy
       backward, which on a 787 by 197 ft rectangle is a bowtie, and SVG's
       nonzero fill turned the overlap transparent and left triangular fins
       pointing off the corners. So the shadow is drawn here instead, as the
       exact union outline of a rectangle and its offset, which is an octagon
       whenever the offset is smaller than the rectangle, and it is. */
    function gshadow(u0, u1, v0, v1, hFt) {
      var L = hFt * 0.906;                  /* the true throw at 48 degrees */
      var n = Math.sqrt(0.55 * 0.55 + 0.35 * 0.35);
      var a = 0.55 / n * L, b = 0.35 / n * L;   /* away from the light */
      var Z = 1.0;
      var q = [pt(u0 - a, v1 - b, Z), pt(u0 - a, v0 - b, Z), pt(u1 - a, v0 - b, Z),
               pt(u1 - a, v0, Z), pt(u1, v0, Z), pt(u1, v1, Z),
               pt(u0, v1, Z), pt(u0, v1 - b, Z)];
      items.push({ svg: ctx.poly(q, "#000", null, 0, ' opacity="0.17"'), depth: -1e9 + 2 });
    }
    var e0 = 12;   /* cast from the podium's edge, which is what meets the lawn */
    gshadow(-HU - e0, HU + e0, -SV - e0, SV + e0, Z_PAR);
    [[-WU1, -WU0], [WU0, WU1]].forEach(function (r) {
      gshadow(r[0] - e0, r[1] + e0, -WV - e0, -SV, Z_PAR);
      gshadow(r[0] - e0, r[1] + e0, SV, WV + e0, Z_PAR);
    });
    gshadow(-STAIR_HW - 11, STAIR_HW + 11, -PV - STAIR_RUN, -PV, Z_MAIN);

    /* ------------------------- PODIUM, the base ------------------------ */
    /* nothing in this project sits straight on the lawn */
    (function () {
      var e = 12;
      box(-HU - e, HU + e, -SV - e, SV + e, 0, Z_POD, M1, { bias: 0.02 });
      [[-WU1, -WU0, -WV, -SV], [WU0, WU1, -WV, -SV],
       [-WU1, -WU0, SV, WV], [WU0, WU1, SV, WV]].forEach(function (r) {
        box(r[0] - e, r[1] + e, r[2] - e, r[3] + e, 0, Z_POD, M1, { bias: 0.02 });
      });
    })();

    /* --------------------------- THE MASSES ---------------------------- */
    /* every exterior wall run, listed once, so no wall is drawn where the
       building has none. axis, plane, from, to, outward sign. */
    var RUNS = [
      /* south front, interrupted by the two south wings and the portico */
      ['u', -SV, -HU, -WU1, -1], ['u', -WV, -WU1, -WU0, -1],
      ['u', -SV, -WU0, -SPHW, -1], ['u', -SV, SPHW, WU0, -1],
      ['u', -WV, WU0, WU1, -1], ['u', -SV, WU1, HU, -1],
      /* north front */
      ['u', SV, -HU, -WU1, 1], ['u', WV, -WU1, -WU0, 1],
      ['u', SV, -WU0, -NPHW, 1], ['u', SV, NPHW, WU0, 1],
      ['u', WV, WU0, WU1, 1], ['u', SV, WU1, HU, 1],
      /* the two ends */
      ['v', HU, -SV, SV, 1], ['v', -HU, -SV, SV, -1],
      /* the wings' outer flanks */
      ['v', WU1, -WV, -SV, 1], ['v', WU1, SV, WV, 1],
      ['v', -WU1, -WV, -SV, -1], ['v', -WU1, SV, WV, -1],
      /* the wings' inner flanks, facing the re-entrant courts */
      ['v', -WU0, -WV, -SV, 1], ['v', -WU0, SV, WV, 1],
      ['v', WU0, -WV, -SV, -1], ['v', WU0, SV, WV, -1]
    ];
    RUNS.forEach(function (r) { wallRun(r[0], r[1], r[2], r[3], r[4]); });

    /* ---------------------------- THE ROOF ------------------------------
       PUBLISHED: skylights over virtually the entire three-acre roof, in
       "shorter parallel setback roofs". So this is not a flat lid: it is a
       deck at cornice level with parallel glazed monitors standing on it. */
    function deck(u0, u1, v0, v1) {
      var nb = Math.max(1, Math.round((u1 - u0) / 60));
      for (var b = 0; b < nb; b++) {
        var a = u0 + (u1 - u0) * b / nb, c = u0 + (u1 - u0) * (b + 1) / nb;
        var q = [pt(a, v0, Z_CORN), pt(c + 0.4, v0, Z_CORN),
                 pt(c + 0.4, v1, Z_CORN), pt(a, v1, Z_CORN)];
        items.push({ svg: ctx.poly(q, tone(MROOF, 0, 0, 1), null, 0), depth: far(q) - 1.0 });
      }
    }
    deck(-HU, HU, -SV, SV);
    deck(-WU1, -WU0, -WV, -SV); deck(WU0, WU1, -WV, -SV);
    deck(-WU1, -WU0, SV, WV); deck(WU0, WU1, SV, WV);

    function monitor(u0, u1, v0, v1) {
      var nb = Math.max(1, Math.round((u1 - u0) / 55));
      for (var b = 0; b < nb; b++) {
        var a = u0 + (u1 - u0) * b / nb, c = u0 + (u1 - u0) * (b + 1) / nb + 0.4;
        box(a, c, v0, v1, Z_CORN, Z_CORN + 3.4, MROOF, { noTop: true, bias: 0.4 });
        var q = [pt(a, v0, Z_CORN + 3.4), pt(c, v0, Z_CORN + 3.4),
                 pt(c, v1, Z_CORN + 3.4), pt(a, v1, Z_CORN + 3.4)];
        items.push({ svg: ctx.poly(q, tone(MGLASS, 0, 0, 1), null, 0), depth: far(q) + 0.6 });
      }
    }
    [[-78, -68], [-62, -52], [52, 62], [68, 78]].forEach(function (b) {
      monitor(-HU + 10, HU - 10, b[0], b[1]);
    });
    [[-42, -32], [-26, -16], [16, 26], [32, 42]].forEach(function (b) {
      monitor(-HU + 10, -58, b[0], b[1]); monitor(58, HU - 10, b[0], b[1]);
    });
    /* the wings' own setback roofs, running the other way */
    [[-WU1, -WU0], [WU0, WU1]].forEach(function (r) {
      [[-WV + 14, -SV - 14], [SV + 14, WV - 14]].forEach(function (b) {
        for (var k = 0; k < 4; k++) {
          var a = r[0] + (r[1] - r[0]) * (0.13 + 0.20 * k), c = a + 14;
          box(a, c, b[0], b[1], Z_CORN, Z_CORN + 3.4, MROOF, { noTop: true, bias: 0.4 });
          var q = [pt(a, b[0], Z_CORN + 3.4), pt(c, b[0], Z_CORN + 3.4),
                   pt(c, b[1], Z_CORN + 3.4), pt(a, b[1], Z_CORN + 3.4)];
          items.push({ svg: ctx.poly(q, tone(MGLASS, 0, 0, 1), null, 0), depth: far(q) + 0.6 });
        }
      });
    });

    /* -------------------- THE DRUM AND THE SAUCER DOME ------------------
       gap: no published diameter, drum height or rise. 86 ft across is the
       rotunda's published 36 ft order at a Pantheon proportion plus its
       walls, and it is what photograph C's drum measures against the
       portico beside it. The rise is 15 ft on an 86 ft span, which is the
       LOW cap every photograph shows and not a hemisphere. */
    box(-47, 47, -47, 47, Z_CORN, Z_ATT - 1.4, M5, { bias: 0.5 });
    box(-49, 49, -49, 49, Z_ATT - 1.4, Z_ATT, M6, { bias: 0.6 });
    (function () {
      var n = 24;
      /* the drum wall */
      for (var i = 0; i < n; i++) {
        var a = (i / n) * Math.PI * 2, a2 = ((i + 1.02) / n) * Math.PI * 2;
        var mx = (Math.cos(a) + Math.cos(a2)) / 2, my = (Math.sin(a) + Math.sin(a2)) / 2;
        var l = Math.sqrt(mx * mx + my * my) || 1, nx = mx / l, ny = my / l;
        if (!ctx.faceVisible(nx, ny)) continue;
        var q = [pt(DR * Math.cos(a), DR * Math.sin(a), Z_ATT),
                 pt(DR * Math.cos(a2), DR * Math.sin(a2), Z_ATT),
                 pt(DR * Math.cos(a2), DR * Math.sin(a2), Z_DRUM),
                 pt(DR * Math.cos(a), DR * Math.sin(a), Z_DRUM)];
        items.push({ svg: ctx.poly(q, tone(M7, nx * 0.5, ny * 0.5, 0.35), null, 0), depth: far(q) + 0.8 });
      }
      /* its cornice ring, the drum's own horizontal break */
      for (var j = 0; j < n; j++) {
        var b = (j / n) * Math.PI * 2, b2 = ((j + 1.02) / n) * Math.PI * 2;
        var q2 = [pt(DR * Math.cos(b), DR * Math.sin(b), Z_DRUM),
                  pt(DR * Math.cos(b2), DR * Math.sin(b2), Z_DRUM),
                  pt((DR - 3) * Math.cos(b2), (DR - 3) * Math.sin(b2), Z_DRUM),
                  pt((DR - 3) * Math.cos(b), (DR - 3) * Math.sin(b), Z_DRUM)];
        items.push({ svg: ctx.poly(q2, tone(M7, 0, 0, 1), null, 0), depth: far(q2) + 1.0 });
      }
      /* the cap: a real spherical segment, in rings, each overrunning its
         neighbour so the seams cannot round apart */
      var Rr = DR - 3, hh = DOME_RISE;
      var S = (Rr * Rr + hh * hh) / (2 * hh);        /* sphere radius */
      var zc = Z_DRUM + hh - S;                      /* its centre */
      var RINGS = 7;
      function rAt(z) { var d = S * S - (z - zc) * (z - zc); return d > 0 ? Math.sqrt(d) : 0; }
      for (var k = 0; k < RINGS; k++) {
        var z0 = Z_DRUM + hh * k / RINGS, z1 = Z_DRUM + hh * (k + 1) / RINGS;
        var r0 = rAt(z0) * 1.004, r1 = rAt(z1);
        var L = Math.sqrt((r0 - r1) * (r0 - r1) + (z1 - z0) * (z1 - z0)) || 1;
        var nzz = (r0 - r1) / L, nh = (z1 - z0) / L;
        for (var i2 = 0; i2 < n; i2++) {
          var c0 = (i2 / n) * Math.PI * 2, c1 = ((i2 + 1.03) / n) * Math.PI * 2;
          var mx2 = (Math.cos(c0) + Math.cos(c1)) / 2, my2 = (Math.sin(c0) + Math.sin(c1)) / 2;
          var l2 = Math.sqrt(mx2 * mx2 + my2 * my2) || 1;
          var nx2 = mx2 / l2 * nh, ny2 = my2 / l2 * nh;
          if (!vis3(nx2, ny2, nzz)) continue;
          var q3 = [pt(r0 * Math.cos(c0), r0 * Math.sin(c0), z0),
                    pt(r0 * Math.cos(c1), r0 * Math.sin(c1), z0),
                    pt(r1 * Math.cos(c1), r1 * Math.sin(c1), z1),
                    pt(r1 * Math.cos(c0), r1 * Math.sin(c0), z1)];
          items.push({ svg: ctx.poly(q3, tone(MDOME, nx2 * 0.45, ny2 * 0.45,
                                             Math.min(1, nzz + 0.5)), null, 0),
                       depth: far(q3) + 1.2 });
        }
      }
      /* the flattened crown photograph C shows at the very top */
      var rc = Math.max(rAt(Z_DRUM + hh - 0.9), 3.0);
      var crown = [];
      for (var t2 = 0; t2 < n; t2++) {
        var a3 = (t2 / n) * Math.PI * 2;
        crown.push(pt(rc * Math.cos(a3), rc * Math.sin(a3), Z_DRUM + hh));
      }
      items.push({ svg: ctx.poly(crown, tone(MDOME, 0, 0, 1), null, 0), depth: far(crown) + 1.5 });
    })();

    /* ---------------------------- A PORTICO ----------------------------
       PUBLISHED: twelve Ionic columns in two rows, the inner ones framing
       three doors. DERIVED: four inner columns are what make three bays, so
       the front row is eight, and photograph A's brightness profile counts
       eight. sgn -1 is the Mall front, sgn +1 is Constitution Avenue. */
    function portico(sgn, hw, hasBase) {
      var fv = sgn * PV;                 /* the front plane   */
      var bv = sgn * SV;                 /* the back wall     */
      var frontRow = fv - sgn * 4.3, innerRow = fv - sgn * 27.0;
      var outer = hw - 6.6;
      var FRONT = ctx.faceVisible(0, sgn);   /* is this front toward us at all */
      var apex = Z_ENT + PED_RISE;
      var ef = fv + sgn * 1.5, pf = ef + sgn * 1.6, pb = bv;

      /* the platform the order stands on, or on the north front the SOLID
         BASE with the entries cut into it, PUBLISHED as exactly that */
      box(-hw, hw, Math.min(fv, bv), Math.max(fv, bv), 0, Z_MAIN, M2, { bias: 0.05 });
      if (hasBase && FRONT) {
        [[0, 13], [-22.5, 9], [22.5, 9]].forEach(function (d) {
          var q = [pt(d[0] - d[1] / 2, fv + sgn * 0.4, 3.5),
                   pt(d[0] + d[1] / 2, fv + sgn * 0.4, 3.5),
                   pt(d[0] + d[1] / 2, fv + sgn * 0.4, Z_MAIN - 2.5),
                   pt(d[0] - d[1] / 2, fv + sgn * 0.4, Z_MAIN - 2.5)];
          items.push({ svg: ctx.poly(q, DOOR, null, 0), depth: far(q) + 0.4 });
        });
      }

      /* the back wall behind the colonnade, IN BAYS. One quad spanning the
         whole 113 ft took its depth from whichever end was farther, so from
         BEHIND the far portico's own columns sorted in front of it and stood
         on the roof. That is the painter's trap this file was warned about,
         met here first. It runs the full way to the entablature top so there
         is no gap under the pediment when seen from the back. */
      (function () {
        var nb = 6;
        for (var i = 0; i < nb; i++) {
          var c0 = -hw + 2 * hw * i / nb, c1 = -hw + 2 * hw * (i + 1) / nb + 0.5;
          face('u', bv, c0, Math.min(hw, c1), Z_MAIN, Z_ENT, sgn, M3, 0.02);
        }
      })();
      if (FRONT) {
        [[0, 13], [-21.5, 8.5], [21.5, 8.5]].forEach(function (d) {
          var q = [pt(d[0] - d[1] / 2, bv + sgn * 0.6, Z_MAIN),
                   pt(d[0] + d[1] / 2, bv + sgn * 0.6, Z_MAIN),
                   pt(d[0] + d[1] / 2, bv + sgn * 0.6, Z_MAIN + 19),
                   pt(d[0] - d[1] / 2, bv + sgn * 0.6, Z_MAIN + 19)];
          items.push({ svg: ctx.poly(q, DOOR, null, 0), depth: far(q) + 0.3 });
        });

        /* the coffered soffit over the colonnade, so the portico reads as a
           space and not as a row of sticks against a wall */
        for (var k = 0; k < 5; k++) {
          var s0 = -hw + 2 * hw * k / 5, s1 = -hw + 2 * hw * (k + 1) / 5 + 0.4;
          var sq = [pt(s0, fv, Z_CAP), pt(Math.min(hw, s1), fv, Z_CAP),
                    pt(Math.min(hw, s1), bv, Z_CAP), pt(s0, bv, Z_CAP)];
          items.push({ svg: ctx.poly(sq, SOFFIT, null, 0), depth: far(sq) + 0.05 });
        }

        /* the twelve columns: eight in front, four behind. PUBLISHED: the
           outer ones darker, the centre ones lighter. */
        var i2;
        for (i2 = 0; i2 < 4; i2++) {
          var iu = [-32.4, -11.1, 11.1, 32.4][i2] * (hw / 56.75);
          ionic(iu, innerRow, Z_MAIN, COL_H, shadeAt(iu, outer));
        }
        for (i2 = 0; i2 < 8; i2++) {
          var fu = -outer + (2 * outer) * i2 / 7;
          ionic(fu, frontRow, Z_MAIN, COL_H, shadeAt(fu, outer));
        }

        /* the entablature, in its three real courses, in bays */
        for (var e = 0; e < 6; e++) {
          var e0 = -hw + 2 * hw * e / 6, e1 = Math.min(hw, -hw + 2 * hw * (e + 1) / 6 + 0.5);
          face('u', ef, e0, e1, Z_CAP, Z_CAP + 4.2, sgn, M4, 1.30);
          face('u', ef, e0, e1, Z_CAP + 4.2, Z_CAP + 8.4, sgn, M5, 1.31);
          face('u', pf, e0, e1, Z_CAP + 8.4, Z_ENT, sgn, M6, 1.32);
          ledge('u', ef, pf, e0, e1, Z_ENT, M6, 1.34);
          /* the shadow the portico cornice throws, which is what makes the
             entablature read as projecting rather than as a painted band */
          var shq = [pt(e0, ef, Z_CAP + 7.0), pt(e1, ef, Z_CAP + 7.0),
                     pt(e1, ef, Z_CAP + 8.4), pt(e0, ef, Z_CAP + 8.4)];
          items.push({ svg: ctx.poly(shq, "#000", null, 0, ' opacity="0.22"'), depth: far(shq) + 1.315 });
        }
      }
      if (FRONT) {
        /* the returns along the portico's flanks */
        [1, -1].forEach(function (sd) {
          var g0 = Math.min(fv, bv), g1 = Math.max(fv, bv);
          face('v', sd * hw, g0, g1, Z_MAIN, Z_WALL, sd, M3, 0.3);
          face('v', sd * hw + sd * 0.6, g0, g1, Z_WALL, Z_ARCH, sd, M4, 0.34);
          face('v', sd * hw, g0, g1, Z_ARCH, Z_FRZ, sd, M5, 0.32);
          face('v', sd * hw + sd * 2.5, g0, g1, Z_FRZ, Z_CORN, sd, M6, 0.40);
          ledge('v', sd * hw, sd * hw + sd * 2.5, g0, g1, Z_CORN, M6, 0.42);
          face('v', sd * hw, g0, g1, Z_CORN, Z_ENT, sd, M5, 0.36);
        });
      } else {
        /* SEEN FROM BEHIND a portico has no colonnade at all, and the front
           face that would have closed it is culled, so what the picture came
           back with was a pediment hanging in the air over the lawn on one
           thin leg. From the far side this is a SOLID MASS, and only the part
           of it that clears the spine's own parapet is ever seen. Same lesson
           as the Hirshhorn balcony and the NMAAHC porch, met a third time. */
        box(-hw, hw, Math.min(fv, bv), Math.max(fv, bv), Z_MAIN, Z_CAP + 8.4, M3, { bias: 0.30 });
        box(-hw - 1.6, hw + 1.6, Math.min(fv, bv) - 1.6, Math.max(fv, bv) + 1.6,
            Z_CAP + 8.4, Z_ENT, M6, { bias: 0.40 });
      }

      /* THE PEDIMENT. Plain, unsculptured. Not in any text reached, and
         plainly there in photographs A and C: a pediment that exists is
         drawn. Rise 15.5 ft on the 113.5 ft span, about 15 degrees. */
      var NP = 8;
      for (var pk = 0; pk < NP; pk++) {
        var u0 = -hw + 2 * hw * pk / NP, u1 = -hw + 2 * hw * (pk + 1) / NP;
        var u1o = Math.min(hw, u1 + 2 * hw / NP * 0.03);
        function zed(u) { return Z_ENT + PED_RISE * (1 - Math.abs(u) / hw); }
        var pl = FRONT ? pf : pb, nn = FRONT ? sgn : -sgn;
        var tq = [pt(u0, pl, Z_ENT), pt(u1o, pl, Z_ENT),
                  pt(u1o, pl, zed(u1o)), pt(u0, pl, zed(u0))];
        items.push({ svg: ctx.poly(tq, tone(M6, 0, nn, 0), null, 0), depth: far(tq) + 1.45 });
        /* the raking cornice, one band the whole way up each slope */
        var rk = [pt(u0, pl + nn * 1.4, zed(u0) - 2.4), pt(u1o, pl + nn * 1.4, zed(u1o) - 2.4),
                  pt(u1o, pl + nn * 1.4, zed(u1o)), pt(u0, pl + nn * 1.4, zed(u0))];
        items.push({ svg: ctx.poly(rk, tone(M7, 0, nn, 0), null, 0), depth: far(rk) + 1.55 });
      }
      var Lr = Math.sqrt(hw * hw + PED_RISE * PED_RISE);
      [1, -1].forEach(function (sd) {
        var nx = sd * PED_RISE / Lr, nz = hw / Lr;
        if (!vis3(nx, 0, nz)) return;
        for (var rk = 0; rk < NP / 2; rk++) {
          var a0 = sd * hw * (1 - rk / (NP / 2)), a1 = sd * hw * (1 - (rk + 1) / (NP / 2));
          var z0 = Z_ENT + PED_RISE * (1 - Math.abs(a0) / hw);
          var z1 = Z_ENT + PED_RISE * (1 - Math.abs(a1) / hw);
          var q = [pt(a0, pf, z0), pt(a0, pb, z0), pt(a1, pb, z1), pt(a1, pf, z1)];
          items.push({ svg: ctx.poly(q, tone(MPROOF, nx, 0, nz), null, 0), depth: far(q) + 1.25 });
        }
      });
    }
    /* PUBLISHED: the outer columns of the porticoes are a darker hue, the
       centre ones lighter. One of the very few published colour facts about
       any building on this Mall, so it is drawn rather than averaged away. */
    function shadeAt(u, outer) {
      var t = Math.min(1, Math.abs(u) / outer);
      return t > 0.62 ? MCOL_D : MCOL_L;
    }
    portico(-1, SPHW, false);
    portico(1, NPHW, true);

    /* ------------------- THE TALL, BROAD MALL STAIRCASE -----------------
       PUBLISHED only as "a tall, broad staircase". No count, no width, no
       projection is published anywhere reached, so this is 16 courses over
       the 20 ft the main floor stands above the lawn, 260 ft wide, which is
       what photograph A measures against the portico beside it. Named.
       Drawn as a stack of shrinking slabs: the longer, lower slabs carry
       farther points and so paint over the shorter ones behind them. */
    (function () {
      for (var k = 0; k < STAIR_N; k++) {
        var run = STAIR_RUN * (k + 1) / STAIR_N;
        var zt = Z_MAIN * (1 - (k + 1) / STAIR_N);
        if (zt <= 0.05) continue;
        var wdn = STAIR_HW + 5 * (k + 1) / STAIR_N;
        box(-wdn, wdn, -PV - run, -PV, 0, zt, (k % 2 ? MSTEP2 : MSTEP), { bias: 0.05 * k });
      }
      /* the terrace parapets that flank the flight */
      [1, -1].forEach(function (sd) {
        box(sd * (STAIR_HW + 4), sd * (STAIR_HW + 11), -PV - STAIR_RUN, -PV - 4, 0, 4.2, M2, { bias: 0.2 });
      });
    })();

    return items;
  };
})();
