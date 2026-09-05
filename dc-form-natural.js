/* dc-form-natural.js: the National Museum of Natural History, 1904-1911.
 *
 * The building modelled is the Natural History Building of the United States
 * National Museum on the north side of the Mall, Hornblower & Marshall with
 * Charles F. McKim (the dome) and Daniel H. Burnham (the portico), AS IT
 * STANDS TODAY: the 1911 building plus the symmetrical east and west wings of
 * 1961-65 by Mills, Petticord and Mills. The court infills of 1974-77 and
 * 1995-98 are inside the courtyards and are not drawn.
 *
 * STYLE. NEOCLASSICAL, and that is not my label: it is the word in the
 * Architectural Classification field of the National Register nomination,
 * section 8, read this run. STYLES.md has no Neoclassical entry and its
 * Beaux-Arts entry would actively mislead here, because that entry lists
 * "paired columns" as a tell and NOTHING on this portico is coupled: six
 * columns in the outer row, two in the inner, and the intercolumniation
 * WIDENS at the centre rather than pairing. The tell that matters most is the
 * dome: this is Pantheon, not Capitol. A spherical SEGMENT, 75 ft across the
 * base with 21 ft 8 in of rise, so rise over half-span is 0.578, well under a
 * hemisphere. Langley's first dome was tall and McKim LOWERED it. Drawing a
 * hemisphere, or a raised dome on a colonnaded drum, would be the one mistake
 * that turns this building into a small Capitol.
 *
 * ============ PUBLISHED, every number checked this run ============
 *
 * PRIMARY: Richard Rathbun, "A Descriptive Account of the Building Recently
 * Erected for the Departments of Natural History of the United States National
 * Museum", U.S. National Museum Bulletin 80, GPO 1913, full text at
 * https://archive.org/details/b31346704 (fetched this run through
 * https://dn790002.ca.archive.org/0/items/b31346704/b31346704_djvu.txt).
 * Rathbun was the Assistant Secretary who ran the construction, and he is the
 * source the NRHP nomination itself cites. Quoted verbatim from the fetch:
 *   - "the crest of the dome of the rotunda, 165 feet 2 inches" above grade,
 *     "142 feet 2 inches above the first floor level" (the OCR renders the
 *     fraction as 2 1/2 or 2 3/8; the two readings differ by an eighth of an
 *     inch and nothing here turns on it). 165.19 ft = 50.35 m.
 *   - the dome is "a spherical segment 75 feet in diameter at its base and
 *     21 feet 8 inches high above the upper edge of the drum"
 *   - "a circular drum, 84 feet in diameter"
 *   - the octagon's "four broad faces, which are 82 feet 2 inches wide on the
 *     east, west and north, and 79 feet wide above the portico entablature on
 *     the south"; the diagonal faces "8 feet 3 inches wide in direct elevation
 *     and 11 feet 1 inch wide in normal elevation"
 *   - the portico has "six columns in the outer row and two in the inner",
 *     "height of the columns...45 feet to the under side of the entablature",
 *     and the "entablature is 11 feet high"
 *   - the south approach is "two runs of steps, an upper one of twelve and a
 *     lower one of eight"
 *   - "top of the main cornice in the wings and ranges, 65 feet 5 inches";
 *     top of stonework "81 feet 10 1/2 inches" in the wings and "71 feet 5
 *     inches" in the ranges
 *   - "peak of the roofs in the wings, 96 feet 4 inches, and in the ranges,
 *     85 feet"
 *   - "eleven window openings in each story" in each wing facade, "five
 *     openings" at the wing ends, "nine openings" in each range front
 *   - "length of the south front of the building in the basement is 561 feet,
 *     of the north front, 499 feet 4 inches"
 * Also from Rathbun, quoted in the research pass and used here: sides 313 ft
 * 2 in with central projections making the depth 364 ft 6 in; each wing 221 ft
 * 6 in long from the south pavilion walls, its end projecting 30 ft 11 in
 * beyond the range and 125 ft 2 in wide; the south pavilion 118 ft wide,
 * projecting 16 ft 3 in beyond the general front over 79 ft 5 in of width and
 * 27 ft 5 1/4 in over 80 ft 2 in in the ground story; the north pavilion
 * projecting 23 ft 11 in over 122 ft 9 7/8 in in five bays; courts 128 ft 2 in
 * square; portico floor and top of water table 23 ft above grade, the water
 * table a plain vertical edge 2 ft 3 in thick; first-story plinth course 3 ft
 * 11 in; first and second storeys as one unit 42 ft 6 in from water table to
 * mid cornice; ground-story windows 10 ft by 10 ft 6 in on 8 ft 6 in piers;
 * the giant openings 11 ft 6 in by 31 ft 10 in on 7 ft piers with a zinc panel
 * at mid height; wing pilasters 3 ft 8 in wide projecting 13 in; wing
 * stonework 82 ft 1 1/2 in in three granites, Milford 23 ft 3 in, Bethel 43 ft
 * 5 in, Mount Airy 15 ft 5 1/2 in; portico column base 3 ft 11 in on a 6 ft
 * 4 in plinth, shaft 36 ft 4 7/8 in tapering 4 ft 3 in to 3 ft 7 7/8 in,
 * capital 4 ft 8 1/4 in, parapet 2 ft 5 1/2 in set back 5 ft 1 1/2 in, cornice
 * overhang 4 ft 11 7/8 in, front frieze 73 ft 0 1/2 in; intercolumniation
 * 15 ft 3 in at the centre then 13 ft 10 1/2 in then 13 ft 1 1/4 in; portico
 * projecting 6 ft 7 1/4 in to the centre of the front row and 9 ft 1 7/8 in to
 * the outside of the plinths; recess 39 ft 1 in wide and 13 ft 2 in deep with
 * an entrance 12 ft 9 in by 25 ft 9 in; the clerestory window 20 ft 4 in
 * radius inside a 4 ft archivolt of 27 voussoirs, split by two 3 ft 2 in
 * mullions; the octagon's fret frieze 3 ft 8 1/2 in; the drum's Doric frieze
 * 3 ft 5 7/8 in, cornice 4 ft 4 3/8 in wide, parapet 4 ft 1 7/8 in, three
 * crowning courses aggregating 4 ft 2 7/8 in "each stepped back about its own
 * height", their top 17 ft 0 1/8 in above the pediments' parapet blocks; the
 * pediment parapet blocks 101 ft 9 3/4 in above the first floor (124 ft 9 1/2
 * in above grade) with the ridge behind at 99 ft 1 in; the eye 18 ft 10 in
 * across with a curb 19 in above the slate; slate from Poultney, Vermont,
 * light gray-green; steps 18 in wide and 5 in high, 52 ft 5 1/2 in from the
 * lowest step to the portico floor; upper dies 12 ft 6 in by 11 ft set 45 ft
 * 1 1/4 in apart with tops level with the portico floor, lower dies 11 ft by
 * 20 ft and 6 ft 7 7/8 in high set 123 ft apart; the platform's ends quadrants
 * of a 31 ft 4 in radius, 139 ft 4 in over the seats and 22 ft 1 1/2 in deep;
 * dormer windows 5 ft by 7 ft with heads alternating triangular and segmental,
 * one over each large window, with paneled parapets between; wing skylights
 * 32 ft 2 in by 149 ft 4 in.
 *
 * SECONDARY: National Register of Historic Places Registration Form, DC
 * Historic Preservation Office, 88 pages, text extracted locally this run from
 * https://planning.dc.gov/sites/default/files/dc/sites/op/publication/attachments/National%20Musem%20of%20Natural%20History%20nom.pdf
 * Quoted: Architectural Classification "Neoclassical" (section 8 p.234 of the
 * extract); "a dome clad with green Vermont slate laid in a fish-scale
 * pattern"; the pavilions flanking the entrance block "are eleven bays long";
 * the ranges "are nine bays long"; "with eighteen bays to either side of an
 * elaborate, domed pavilion"; "the nine-bay-wide wings, which overlap the
 * ranges to leave two of the original nine bays visible on the north"; the
 * 1961-65 wings "are the same height as the 1911 building but have twice as
 * many floors due to lower floor-to-floor heights"; "Mechanical penthouses,
 * constructed in 1991, add additional height, but are still lower than the
 * drum of the dome"; the wings have "three, stacked windows set between simple
 * piers", "each is shorter than the one below", with a water table "at the
 * same height as that of the main building, creating a strong horizontal line
 * that continues around all four sides"; the wing tops end "with a simple
 * cornice and parapet" and the attic "is set back from the main facade"; the
 * museum sits on a "roughly 13-acre site" with a "5.5-acre footprint"; the
 * ranges' dormer "pediments alternate between the triangular style and the
 * segmental" with "paneled parapets that are roughly half as tall as the
 * window openings"; the monumental stair's lower run "is flanked by massive
 * pedestals that are used to display a boulder of banded ironstone (on the
 * west) and two pieces of petrified wood (on the east)"; "The lower landing is
 * framed on the east and west by curved granite benches"; the ramps "were
 * completed in 2021".
 *
 * MEASURED BY ME THIS RUN, and declared as measured rather than published:
 * the present-day plan, from OpenStreetMap way 66418787 fetched through
 * https://www.openstreetmap.org/api/0.6/way/66418787/full.json. Bounding box
 * 38.8907587 to 38.8917448 north, -77.0275532 to -77.0243900 east, which at
 * 111132 m per degree of latitude and 86626 m per degree of longitude at this
 * latitude is 899.2 ft east-west by 359.6 ft north-south. Both figures
 * cross-check against numbers published independently: the nomination's 5.5
 * acre footprint, and Rathbun's 364 ft 6 in depth against my 359.6. The node
 * cloud also puts lines at u = +-280 (the 1911 wing ends, published +-280.5),
 * u = +-250 (the range outer walls, published +-249.67), v = -162.6 and +153.6
 * (the 1911 south and north fronts, published +-156.58) and v = -179.6 and
 * +179.0 (the two central projections, published -184.02 and +180.5). The
 * published 1911 plan and the traced modern plan agree to within about 5 ft
 * everywhere, so the trace is trustworthy and the 1911 numbers are used where
 * both exist.
 *
 * ============ THE 287 FOOT TRAP, and I checked it myself ============
 * The nomination contains "the height of the building's dome (287 feet above
 * ground level, approximately 350 feet above the elevation of the Mall)". I
 * pulled the whole sentence rather than the phrase: it reads "slightly greater
 * than the north-south dimension of the Capitol and appropriate to the height
 * of the building's dome ... and the height of the Washington Monument (555
 * feet)". 287 ft is the CAPITOL's dome, in a passage about McMillan Plan
 * spacing, and this project's own dc-form-capitol.js puts the Statue of
 * Freedom at 288 ft above the east plaza. Taking it here would have made this
 * dome 1.74 times too tall. It is not used.
 *
 * ============ THE VERTICAL STACK, and why I trust it ============
 * Every course is independently published and the sum closes:
 *   grade                                            0
 *   portico floor and top of water table            23
 *   first-story plinth course, 3 ft 11 in           26.92
 *   giant openings, 31 ft 10 in                     26.92 to 58.75
 *   top of main cornice, wings and ranges           65.42
 *   top of portico entablature (23 + 45 + 11)       79.00   <- closes exactly
 *   top of stonework, ranges                        71.42
 *   top of stonework, wings (23.25+43.42+15.46)     81.875  <- closes exactly
 *   peak of range roofs                             85.00
 *   peak of wing roofs                              96.33
 *   ridge behind the pediments (99'1" + 23)        122.08
 *   pediment parapet blocks                        124.79
 *   top of the drum's upper course (124.79 + 17)   141.79
 *   dome crown (+21.67)                            163.46
 *   crest, published                               165.19
 * The 23 ft of Milford granite in the basement equals the published 23 ft to
 * the water table, and the three granites sum to the published 81 ft 10 1/2 in
 * of wing stonework, so the material bands and the height stack are the same
 * arithmetic read two ways. That is why this file trusts a 1913 book.
 *
 * ============ NAMED GAPS, guessed nowhere ============
 *  - THE STAIR DOES NOT CLOSE, and I will not pretend it does. Rathbun
 *    publishes twenty risers (twelve above, eight below), a 5 in rise, and a
 *    portico floor 23 ft above grade. Twenty risers of 5 in is 8 ft 4 in. The
 *    three cannot all hold. This model keeps the published COUNTS and the
 *    published 23 ft, because the 23 ft is the datum of the 165 ft crest and
 *    of the granite bands, and spreads it over twenty risers at 1.15 ft each.
 *    The departure is here, not buried: the risers are drawn 2.8 times their
 *    published height. The published treads (18 in) and the published total
 *    run (52 ft 5 1/2 in) DO close on each other, 12+8 treads of 1.5 ft plus
 *    the 22 ft 1 1/2 in platform is 52.13 ft, so the plan of the stair is
 *    published throughout and only its rise is in question.
 *  - THE CREST LEAVES A 1.19 FT RESIDUAL. Drum top 141.79 plus the published
 *    21.67 rise plus the published 19 in curb is 164.0, against a published
 *    crest of 165.19. Two published figures that do not quite close on a
 *    hand-measured 1913 building. The DOME'S OWN shape is kept, because the
 *    shape is the whole point of this entry, and the residual is absorbed in
 *    the curb, which is drawn 2.77 ft instead of 1.58. Nothing else moves.
 *  - NO PUBLISHED HEIGHT for the 1961-65 wings, only "the same height as the
 *    1911 building". Drawn to the 1911 wings' published stonework top,
 *    81.875 ft, with cornice and parapet. Their set-back attic and their 1991
 *    penthouse are published only as "set back" and "lower than the drum";
 *    drawn 8 ft and 6 ft back and stopping at 92 ft, an assumption.
 *  - NO PUBLISHED PLAN for the 1961-65 wings. Length derived two ways that
 *    agree: (899 measured less 561 published) / 2 = 169 ft, and the OSM nodes
 *    put their outer faces at +-449 against 1911 wing ends at +-280.5. Their
 *    depth is MEASURED off the same trace, south face about v = -63 and north
 *    face about v = +122, so 185 ft; the trace is 14 ft asymmetric between
 *    east and west and the mean is used. Nine bays over 185 ft is 20.6 ft a
 *    bay, which matches the range bay pitch, so the measurement and the
 *    published bay count agree. Their south-facade bay count, seven, is
 *    DERIVED: the published eighteen bays a side less the published eleven of
 *    the 1911 wing.
 *  - NO PUBLISHED ROOF PITCH anywhere in either source. Rathbun gives eave
 *    and ridge levels and never an angle, so every pitch here is derived from
 *    two published levels: the wing hip rises 14.46 ft from 81.875 to 96.33,
 *    the range mansard 13.58 ft from 71.42 to 85. The wing hip is drawn
 *    truncated because the published skylights are 32 ft 2 in wide and have to
 *    sit on something; the flat top is 40 ft, an assumption.
 *  - NO PUBLISHED HEIGHT for the court infills (1974-77, four storeys; 1995-98,
 *    seven floors above ground). The east one has more floors than the 1911
 *    building has storeys and may show above the roofline; nothing published
 *    says whether it does, so neither is drawn.
 *  - NO PUBLISHED DIMENSIONS for the 2021 accessible ramps beyond "granite
 *    walls" and a white bronze railing, so they are not drawn at all. Absence
 *    over invention.
 *  - THE OCTAGON'S BASE LEVEL is not published. Rathbun says the pavilion is
 *    square to the height of the flanking wings and octagonal above their
 *    roofs. Drawn from the published wing stonework top, 81.875 ft, which is
 *    the level where the square pavilion's own masonry ends.
 *  - THE OCTAGON'S POSITION in plan is not published. Its south broad face is
 *    put on the pavilion's south wall line, which is where the nomination's
 *    "extended pediment ... rises above the entablature of the portico" puts
 *    it. The octagon is then a 97.73 ft square with 7.79 ft corners cut, which
 *    is a DERIVATION that checks: it makes the chamfer 11.02 ft in normal
 *    elevation against a published 11 ft 1 in.
 *  - NO PUBLISHED LANDFORM. The nomination says the site falls to the north so
 *    that the Constitution Avenue entrance is at ground level while the south
 *    entrance is at the first floor. No figure is given, and the model draws
 *    one flat pad.
 *  - NO SCULPTURE. The four dies of the south approach were designed as
 *    pedestals for groups that were never carved. They are not empty today:
 *    the nomination says the lower pair display a boulder of banded ironstone
 *    and two pieces of petrified wood. Neither specimen is dimensioned, so the
 *    dies are drawn and nothing is drawn on them. No pediment on this building
 *    carries a tympanum figure; the great semicircular window is what is there
 *    instead, and that is the point of the fifth style tell.
 *
 * ============ dc-3d.js NEEDS A HEIGHT CORRECTION ============
 * Line 56 carries { k: "natural", h: 28 }. The published crest is 165 ft 2 in
 * = 50.35 m. 28 m is 44 percent short. It should be h: 50. I have not touched
 * dc-3d.js; the correction is reported instead. The coordinates in that line,
 * 38.89130 / -77.02590, are good: my OSM centroid is 38.891252 / -77.025972,
 * about 6 m away.
 *
 * ============ WHAT LOOKING CAUGHT ============
 * Nine defects, and not one of them was visible in any number. The file was
 * arithmetically correct before the first render and it was not the building.
 *  1. THE WORST ONE. The drum painted straight over the SOUTH PEDIMENT and
 *     its clerestory window, so the front of the building lost the one
 *     feature this entry exists to show. Cause: a face here sorts on its
 *     FARTHEST point, and an 82 ft face's far corner sits behind the near
 *     edge of an 84 ft drum standing 7 ft away, so the narrow object behind
 *     the wide face won. The pediment assembly now carries the ry of its own
 *     centre. A wide face against a narrow object is the case the
 *     farthest-point rule gets wrong, and it is the mirror of the
 *     nearest-point trap this project already knew about.
 *  2. THE COLUMNS VANISHED. Six shafts 4 ft 3 in thick are about four pixels
 *     wide at map scale, and against a wall of their own stone they read as
 *     stripes with a white canopy over them. Nothing was missing and nothing
 *     was wrong. The fix is a fact rather than a trick: a portico 9 ft deep
 *     shades its own back wall, so that wall is washed down and the published
 *     recess behind it is dark, and only then do six columns read as six
 *     columns standing in front of something.
 *  3. The stair platform's ends are quadrants, and a full ring draws a
 *     complete circle: the first render had two 31 ft granite drums flanking
 *     the steps. Drawn as explicit fans now.
 *  4. The pavilion's roof was left as its attic box's own top face, which is
 *     stone in full sunlight, and it became the brightest surface in the
 *     model: a white wedge lying between the octagon and the wing roofs. It
 *     is slate, like every other roof on the building.
 *  5. A NOTCH under the model. The host's single-building pad is STROKED, so
 *     every part of it this file failed to cover drew its own outline across
 *     the lawn; and a pad merely made bigger then ran past the whole-Mall
 *     lawn's north edge, which is only 97 m from this building, and put a
 *     step in the Mall's own boundary. The pad is now computed from the
 *     host's own rule, so it covers exactly and overhangs nothing.
 *  6. The north block's mansard drawn as ONE plane over the whole 499 by
 *     188 ft block read as a field of grass with a shipping container on it.
 *     The ranges are L-shaped and the two courts between them carry the glass
 *     roofs the nomination describes, so it is now the frame it is.
 *  7. The 1961-65 wings' set-back attic and penthouse in sunlit stone read as
 *     a wedding cake. Roof decks are not stone; they have their own tone now.
 *  8. Eaves set 1.5 ft inside the wall left a hairline of sunlit attic stone
 *     round every roof. Flush.
 *  9. The pediment's gable was the same stone as the wall under it, so a
 *     pediment did not read as a pediment. It has its raking cornice.
 * AND ONE THING LOOKING GOT WRONG, recorded because the instinct to "fix" it
 * would have broken the entry: the dome LOOKS like a hemisphere in these
 * renders. It is not. Measured off the render its silhouette is 0.41 of its
 * own width, against 0.42 predicted for the true spherical segment and 0.63
 * for a hemisphere. The apparent height is the axonometric, which compresses
 * horizontal distance into screen-y by sin(pitch) = 0.2955 while keeping
 * vertical at cos(pitch) = 0.9553. The number was right and the eye was
 * wrong, which is the one direction this standard does not usually run.
 *
 * ============ THE ONE THING A VISITOR NAMES ============
 * From the Mall it is the low green dome, and that is what this model leads
 * with. Inside it is the African bush elephant standing under the Guastavino
 * dome in the rotunda, and if a visitor names one thing about this museum it
 * is the elephant. It is an interior fact and an exterior massing model
 * cannot honestly claim it, so it is stated here and not drawn.
 *
 * ============ FRAME AND PAINT ============
 * u east, v north, z up, all in FEET, origin at the centre of the 1911
 * building in plan and at the south grade in height. FT converts to metres so
 * the published crest lands on p.h.
 * Depths are REAL projected depths and every face carries the depth of its
 * FARTHEST point, the convention dc-form-capitol.js settled on, because a
 * face sorted by its nearest corner lets a low slab paint over a tall thing
 * standing beside it. Large horizontal planes (the site pad, the roofs, the
 * step treads) all get depths that put them behind what stands on them.
 * The portico, its steps, the recess and the two elevations that only exist on
 * one side are all culled by face, not by assumption, so nothing is drawn from
 * an angle that cannot see it.
 */
(function () {
  var H = window.DC3D.helpers;
  window.DC_FORMS = window.DC_FORMS || {};
  window.DC_FORMS['natural'] = function (ctx, p, s, VE) {
    var P = ctx.project, items = [];

    var CREST = 165.19;                 /* published, feet above grade */
    var FT = (p.h * VE) / CREST;        /* metres per foot */
    var m  = FT * s;
    function pt(u, v, z) { return P(p.x + u * m, p.y + v * m, z * FT); }
    function W(u, v) { return [p.x + u * m, p.y + v * m]; }
    function far(q) { return H.depthOf(q); }

    /* the camera, recovered from the projection, so a tilted face (a roof
       slope, a dome gore, a pediment rake) is culled by its full 3D normal
       and not by its plan normal alone. Same method as dc-form-capitol.js. */
    var o0 = P(p.x, p.y, 0), ox = P(p.x + 1, p.y, 0), oy = P(p.x, p.y + 1, 0), oz = P(p.x, p.y, 1);
    var sYaw = ox[2] - o0[2], cYaw = oy[2] - o0[2];
    var dzY = oz[1] - o0[1];
    var dhY = Math.abs(cYaw) > Math.abs(sYaw) ? (oy[1] - o0[1]) / cYaw : (ox[1] - o0[1]) / sYaw;
    var tanP = dzY === 0 ? 0.3 : dhY / (-dzY);
    var cP = 1 / Math.sqrt(1 + tanP * tanP), sP = tanP * cP;
    function vis3(nx, ny, nz) { return (nx * sYaw + ny * cYaw) * cP + nz * sP > 0.001; }

    /* light from the north-east and high: the renderer's own vector. A face
       turned toward it takes the warmer hex, a face turned away the cooler
       one, and ctx.shade then darkens by the true normal. Two tones per
       material, which is checklist item 5. */
    var LD = [0.55, 0.35, 0.72];
    var SDX = -LD[0] / LD[2], SDY = -LD[1] / LD[2];
    function tone(M, nx, ny, nz) {
      var d = nx * LD[0] + ny * LD[1] + nz * LD[2];
      return ctx.shade(d > 0.05 ? M.lit : M.shade, nx, ny, nz);
    }
    /* the three granites, banded up the elevation exactly as Rathbun bands
       them: pink-warm Milford in the basement and water table, white Bethel
       through the two principal storeys and the main cornice, nearly white
       Mount Airy in the attic. */
    var MILF  = { lit: "#e9dfd3", shade: "#d5cabd", edge: "#b2a798" };
    var BETH  = { lit: "#f5f2ea", shade: "#e2ded2", edge: "#b0a99a" };
    var AIRY  = { lit: "#f9f7f1", shade: "#e8e5db", edge: "#b3ada0" };
    var COLM  = { lit: "#fbf9f4", shade: "#ebe9e2", edge: "#aca69a" };
    var SLATE = { lit: "#96a48d", shade: "#7b8a75", edge: "#5f6c5b" }; /* Poultney green */
    var COPP  = { lit: "#84997f", shade: "#6d8169", edge: "#54634f" }; /* the ranges' flat copper deck */
    var ZINC  = { lit: "#c6c3b6", shade: "#b2afa2", edge: "#8f8c80" };
    var GLZ   = { lit: "#aab1a8", shade: "#969e94", edge: "#7a8178" }; /* the skylights and the two court roofs */
    var DECK  = { lit: "#a7a89e", shade: "#94958c", edge: "#787a72" }; /* flat roof decks, which are not stone */
    var LAWN  = { lit: "#c9d3bd", shade: "#b9c4ae", edge: "#a7b29c" };
    var GLASS = "#3f4750";                                              /* window reveals: dark enough to survive 900 px */
    var LATT  = "#6d7a72";                                              /* the clerestory's copper lattice */

    /* ---------- primitives ---------- */
    /* a box. o: {wxT,wyT} taper, skip faces, noTop, bias in centimetres,
       depth to override the farthest-point sort. faces 0 S, 1 E, 2 N, 3 W. */
    function box(cx, cy, wx, wy, z0, h, M, o) {
      o = o || {};
      var bx = wx / 2, by = wy / 2;
      var tx = (o.wxT === undefined ? wx : o.wxT) / 2;
      var ty = (o.wyT === undefined ? wy : o.wyT) / 2;
      var lo = [[cx-bx,cy-by],[cx+bx,cy-by],[cx+bx,cy+by],[cx-bx,cy+by]];
      var hi = [[cx-tx,cy-ty],[cx+tx,cy-ty],[cx+tx,cy+ty],[cx-tx,cy+ty]];
      var nrm = [[0,-1],[1,0],[0,1],[-1,0]];
      var bias = (o.bias || 0) * 0.01, skip = o.skip || [];
      var L = Math.sqrt((bx - tx) * (bx - tx) + h * h) || 1;
      var nz = (bx - tx) / L;
      for (var i = 0; i < 4; i++) {
        if (skip.indexOf(i) >= 0) continue;
        var nx = nrm[i][0], ny = nrm[i][1];
        if (nz > 0.02 ? !vis3(nx, ny, nz) : !ctx.faceVisible(nx, ny)) continue;
        var j = (i + 1) % 4;
        var q = [pt(lo[i][0],lo[i][1],z0), pt(lo[j][0],lo[j][1],z0),
                 pt(hi[j][0],hi[j][1],z0+h), pt(hi[i][0],hi[i][1],z0+h)];
        items.push({ svg: ctx.poly(q, tone(M, nx, ny, nz), M.edge, 0.35),
                     depth: (o.depth === undefined ? far(q) : o.depth) + bias + i * 0.0001 });
      }
      if (!o.noTop) {
        var top = [pt(cx-tx,cy-ty,z0+h), pt(cx+tx,cy-ty,z0+h),
                   pt(cx+tx,cy+ty,z0+h), pt(cx-tx,cy+ty,z0+h)];
        items.push({ svg: ctx.poly(top, tone(M, 0, 0, 1), M.edge, 0.35),
                     depth: (o.depth === undefined ? far(top) : o.depth) + bias + 0.0006 });
      }
    }

    /* an n-sided ring, r0 at the foot and r1 at the top, tilted faces culled
       by their 3D normal so a dome's far gores stay visible from above */
    function ring(cx, cy, r0, r1, z0, h, n, M, o) {
      o = o || {};
      var bias = (o.bias || 0) * 0.01, rot = o.rot || 0;
      var lo = [], hi = [];
      for (var i = 0; i < n; i++) {
        var a = rot + (i / n) * Math.PI * 2;
        lo.push([cx + r0 * Math.cos(a), cy + r0 * Math.sin(a)]);
        hi.push([cx + r1 * Math.cos(a), cy + r1 * Math.sin(a)]);
      }
      var L = Math.sqrt((r0 - r1) * (r0 - r1) + h * h) || 1;
      var nzz = (r0 - r1) / L, nh = h / L;
      for (var k = 0; k < n; k++) {
        var a0 = lo[k], a1 = lo[(k + 1) % n], b0 = hi[k], b1 = hi[(k + 1) % n];
        var mx = (a0[0] + a1[0]) / 2 - cx, my = (a0[1] + a1[1]) / 2 - cy;
        var l = Math.sqrt(mx * mx + my * my) || 1;
        var nx = mx / l * nh, ny = my / l * nh;
        if (!vis3(nx, ny, nzz)) continue;
        /* the gores overlap their neighbour by a fraction of a segment.
           Abutting quads round apart under toFixed and leave a starburst of
           pale seams, which is the Hirshhorn ring's lesson and the Vietnam
           bank's after it. */
        var a1o = lo[(k + 1) % n], b1o = hi[(k + 1) % n];
        var q = [pt(a0[0],a0[1],z0), pt(a1o[0],a1o[1],z0), pt(b1o[0],b1o[1],z0+h), pt(b0[0],b0[1],z0+h)];
        items.push({ svg: ctx.poly(q, tone(M, nx, ny, nzz), tone(M, nx, ny, nzz), 0.6),
                     depth: (o.depth === undefined ? far(q) : o.depth) + bias + k * 0.00001 });
      }
      if (!o.noTop && r1 > 0.05) {
        var top = hi.map(function (h2) { return pt(h2[0], h2[1], z0 + h); });
        items.push({ svg: ctx.poly(top, tone(M, 0, 0, 1), M.edge, 0.3),
                     depth: (o.depth === undefined ? far(top) : o.depth) + bias + 0.0006 });
      }
    }

    /* a Corinthian column: an octagonal shaft that tapers from its published
       lower diameter to its published necking, and a square capital block.
       Checklist item 1 is columns drawn AS columns, with a capital. */
    function column(cx, cy, z0, h, dLo, dHi, M, dep) {
      ring(cx, cy, dLo / 2, dHi / 2, z0, h * 0.895, 8, M,
           { rot: Math.PI / 8, noTop: true, depth: dep });
      box(cx, cy, dHi * 1.28, dHi * 1.28, z0 + h * 0.895, h * 0.105, M,
          { wxT: dHi * 1.5, wyT: dHi * 1.5, depth: dep });
    }

    /* flat detail on one vertical face: window reveals, rustication joints,
       zinc panels. Painted at the wall's own depth plus a bias, so a nearer
       mass that abuts the wall still covers them. */
    function rects(x0, y0, x1, y1, nx, ny, count, rows, w, fill, op, bias, arch) {
      var dep = far([pt(x0,y0,0), pt(x1,y1,0)]) + 0.002 + (bias || 0);
      var tx = -ny, ty = nx, ox = nx * 0.45, oy = ny * 0.45;
      for (var i = 0; i < count; i++) {
        var t = (i + 0.5) / count;
        var cx = x0 + (x1 - x0) * t + ox, cy = y0 + (y1 - y0) * t + oy;
        for (var r = 0; r < rows.length; r++) {
          var z0 = rows[r][0], z1 = rows[r][1], hw = w / 2, q;
          if (arch) {
            /* a segmental head, so the ground storey reads as arcaded and not
               as a row of holes. Five points across the crown. */
            var rise = Math.min(2.2, (z1 - z0) * 0.22);
            q = [pt(cx - tx*hw, cy - ty*hw, z0), pt(cx + tx*hw, cy + ty*hw, z0),
                 pt(cx + tx*hw, cy + ty*hw, z1 - rise),
                 pt(cx + tx*hw*0.55, cy + ty*hw*0.55, z1),
                 pt(cx - tx*hw*0.55, cy - ty*hw*0.55, z1),
                 pt(cx - tx*hw, cy - ty*hw, z1 - rise)];
          } else {
            q = [pt(cx - tx*hw, cy - ty*hw, z0), pt(cx + tx*hw, cy + ty*hw, z0),
                 pt(cx + tx*hw, cy + ty*hw, z1), pt(cx - tx*hw, cy - ty*hw, z1)];
          }
          items.push({ svg: ctx.poly(q, ctx.shade(fill, nx, ny, 0), null, 0,
                                     op ? ' opacity="' + op + '"' : ''),
                       depth: dep + r * 0.0001 });
          if (arch) { /* the projecting picked keystone Rathbun describes */
            var kq = [pt(cx - tx*1.1, cy - ty*1.1, z1 - rise*0.4), pt(cx + tx*1.1, cy + ty*1.1, z1 - rise*0.4),
                      pt(cx + tx*1.1, cy + ty*1.1, z1 + 1.4), pt(cx - tx*1.1, cy - ty*1.1, z1 + 1.4)];
            items.push({ svg: ctx.poly(kq, tone(MILF, nx, ny, 0), null, 0), depth: dep + 0.0004 });
          }
        }
      }
    }
    /* pilaster strips: the wing piers carry them, 3 ft 8 in wide projecting
       13 in, which is what breaks a 221 ft wall into eleven bays */
    function pilasters(x0, y0, x1, y1, nx, ny, z0, h, count, w, M) {
      var dep = far([pt(x0,y0,0), pt(x1,y1,0)]) + 0.0026;
      var tx = -ny, ty = nx, PR = 1.083;             /* published 13 in */
      var len = Math.sqrt((x1-x0)*(x1-x0) + (y1-y0)*(y1-y0));
      var inset = (w / 2 + 0.6) / len;
      for (var i = 0; i < count; i++) {
        var t = count === 1 ? 0.5 : inset + (1 - 2 * inset) * i / (count - 1);
        var cx = x0 + (x1 - x0) * t, cy = y0 + (y1 - y0) * t, hw = w / 2;
        var fx = cx + nx * PR, fy = cy + ny * PR;
        var q = [pt(fx - tx*hw, fy - ty*hw, z0), pt(fx + tx*hw, fy + ty*hw, z0),
                 pt(fx + tx*hw, fy + ty*hw, z0+h), pt(fx - tx*hw, fy - ty*hw, z0+h)];
        items.push({ svg: ctx.poly(q, tone(M, nx, ny, 0), M.edge, 0.3), depth: dep + 0.0001 });
        var sgn = ctx.faceVisible(tx, ty) ? 1 : (ctx.faceVisible(-tx, -ty) ? -1 : 0);
        if (sgn) {
          var ex = cx + tx * hw * sgn, ey = cy + ty * hw * sgn;
          var qs = [pt(ex, ey, z0), pt(ex + nx*PR, ey + ny*PR, z0),
                    pt(ex + nx*PR, ey + ny*PR, z0+h), pt(ex, ey, z0+h)];
          items.push({ svg: ctx.poly(qs, tone(M, tx*sgn, ty*sgn, 0), M.edge, 0.3), depth: dep });
        }
      }
    }

    /* cast shadow: the convex hull of a footprint and its copy slid to where
       the mass's top lands. Nothing here casts light, so without this the
       whole 899 ft front floats. */
    function hull(A) {
      var q = A.slice().sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
      if (q.length < 3) return q;
      function cr(o, a, b) { return (a[0]-o[0])*(b[1]-o[1]) - (a[1]-o[1])*(b[0]-o[0]); }
      var lo = [], up = [];
      q.forEach(function (r) { while (lo.length >= 2 && cr(lo[lo.length-2], lo[lo.length-1], r) <= 0) lo.pop(); lo.push(r); });
      for (var i = q.length - 1; i >= 0; i--) { var r = q[i]; while (up.length >= 2 && cr(up[up.length-2], up[up.length-1], r) <= 0) up.pop(); up.push(r); }
      lo.pop(); up.pop();
      return lo.concat(up);
    }
    function rect(cx, cy, wx, wy) {
      return [[cx-wx/2,cy-wy/2],[cx+wx/2,cy-wy/2],[cx+wx/2,cy+wy/2],[cx-wx/2,cy+wy/2]];
    }
    function castShadow(fp, hgt, op) {
      var dx = SDX * hgt, dy = SDY * hgt;
      var all = fp.concat(fp.map(function (q) { return [q[0] + dx, q[1] + dy]; }));
      var hp = hull(all).map(function (q) { return pt(q[0], q[1], 0.35); });
      items.push({ svg: ctx.poly(hp, "#141410", null, 0, ' opacity="' + (op || 0.17) + '"'),
                   depth: -1e9 + 2 });
    }

    /* an arc, and the two things this building needs it for: the quadrant
       ends of the stair platform and the curved granite benches on them.
       Drawn as an explicit fan, NOT as a full ring: the first render drew
       these as complete 31 ft drums flanking the stair, which is what a ring
       does when you only want a quarter of one. */
    function arcPts(cu, cv, R, a0, a1, n) {
      var o = [];
      for (var i = 0; i <= n; i++) {
        var a = a0 + (a1 - a0) * i / n;
        o.push([cu + R * Math.cos(a), cv + R * Math.sin(a)]);
      }
      return o;
    }
    function quadSlab(cu, cv, R, a0, a1, z0, h, M, bias) {
      var n = 10, ap = arcPts(cu, cv, R, a0, a1, n);
      for (var i = 0; i < n; i++) {
        var p0 = ap[i], p1 = ap[i + 1];
        var mx = (p0[0] + p1[0]) / 2 - cu, my = (p0[1] + p1[1]) / 2 - cv;
        var l = Math.sqrt(mx * mx + my * my) || 1, nx = mx / l, ny = my / l;
        if (!ctx.faceVisible(nx, ny)) continue;
        var q = [pt(p0[0],p0[1],z0), pt(p1[0],p1[1],z0), pt(p1[0],p1[1],z0+h), pt(p0[0],p0[1],z0+h)];
        items.push({ svg: ctx.poly(q, tone(M, nx, ny, 0), M.edge, 0.3), depth: far(q) + bias });
      }
      var top = [pt(cu, cv, z0 + h)].concat(ap.map(function (q) { return pt(q[0], q[1], z0 + h); }));
      items.push({ svg: ctx.poly(top, tone(M, 0, 0, 1), M.edge, 0.3), depth: far(top) + bias + 0.01 });
    }
    function arcBand(cu, cv, rIn, rOut, a0, a1, z0, h, M, bias) {
      var n = 10, ai = arcPts(cu, cv, rIn, a0, a1, n), ao = arcPts(cu, cv, rOut, a0, a1, n);
      for (var i = 0; i < n; i++) {
        var p0 = ao[i], p1 = ao[i + 1];
        var mx = (p0[0] + p1[0]) / 2 - cu, my = (p0[1] + p1[1]) / 2 - cv;
        var l = Math.sqrt(mx * mx + my * my) || 1, nx = mx / l, ny = my / l;
        if (ctx.faceVisible(nx, ny)) {
          var q = [pt(p0[0],p0[1],z0), pt(p1[0],p1[1],z0), pt(p1[0],p1[1],z0+h), pt(p0[0],p0[1],z0+h)];
          items.push({ svg: ctx.poly(q, tone(M, nx, ny, 0), M.edge, 0.3), depth: far(q) + bias });
        }
      }
      var tp = ai.map(function (q) { return pt(q[0], q[1], z0 + h); })
                 .concat(ao.slice().reverse().map(function (q) { return pt(q[0], q[1], z0 + h); }));
      items.push({ svg: ctx.poly(tp, tone(M, 0, 0, 1), M.edge, 0.3), depth: far(tp) + bias + 0.01 });
    }

    /* ================= the plan, in feet ================= */
    var SFRONT  = 561;                  /* published south front */
    var PAV_W   = 118;                  /* published south pavilion width */
    var WING_E  = SFRONT / 2;           /* 280.5, the 1911 wing ends */
    var PAV_E   = PAV_W / 2;            /* 59 */
    var SIDE_D  = 313.17;               /* published side length */
    var VS      = -SIDE_D / 2;          /* -156.58, the general south front */
    var VN      =  SIDE_D / 2;          /*  156.58, the north front */
    var WING_D  = 125.17;               /* published wing depth */
    var VW      = VS + WING_D;          /* -31.41, the wings' north wall */
    var NORTH_E = 499.33 / 2;           /* 249.67, published north front / 2 */
    var NPAV_E  = 122.82 / 2;           /* 61.41, published north pavilion / 2 */
    var VNP     = VN + 23.92;           /* 180.5, its published projection */
    var PROJ_U  = VS - 16.25;           /* -172.83, pavilion face above grade */
    var PROJ_G  = VS - 27.44;           /* -184.02, its ground-story face */
    var PROJ_UW = 79.42 / 2, PROJ_GW = 80.17 / 2;
    /* the 1961-65 wings: length derived, depth measured, both stated above */
    var NW_IN = 280.5, NW_CN = 298, NW_OUT = 449;
    var NW_S  = -63, NW_N = 122;        /* measured off the OSM trace */
    var CN_S  = -51, CN_N = 110;        /* the recessed connection, measured */

    /* ================= the heights, in feet ================= */
    var Z_WT   = 23;        var Z_WTB = 20.75;   /* water table, 2 ft 3 in edge */
    var Z_PL   = 26.92;     /* first-story plinth course top */
    var Z_G1   = 58.75;     /* the giant openings' heads */
    var Z_CN0  = 62.2, Z_CN = 65.42;             /* the main cornice slab */
    var Z_RST  = 71.42;     /* top of stonework, ranges */
    var Z_WST  = 81.875;    /* top of stonework, wings */
    var Z_RRF  = 85;        /* peak of the range roofs */
    var Z_WRF  = 96.33;     /* peak of the wing roofs */
    var Z_PENT = 79;        /* top of the portico entablature */
    var Z_OCT  = Z_WST;     /* the octagon's base, derived, see the header */
    var Z_OE0  = 106, Z_OE1 = 110.2;             /* its entablature, the fret band */
    var Z_PED  = 124.79;    /* the pediments' parapet blocks */
    var Z_RID  = 122.08;    /* the ridge behind them */
    var Z_DRM  = 141.79;    /* top of the drum's upper crowning course */
    var Z_DOM  = 163.46;    /* the dome's crown */

    /* ================= the site ================= */
    /* the museum brings its own ground. The only- scene sizes its pad from
       p.h, and an 899 ft building on a 2.2-height pad runs off the paper,
       which this project has seen before. The tone is the host's own lawn so
       the two grounds meet without a seam. */
    (function () {
      /* ONE pad, sized to exactly the host's own single-building pad and
         nothing more. The first render showed a NOTCH under the model: the
         host's pad is stroked with C.edge, so any part of it my pad failed to
         cover drew its own outline across the lawn. A pad merely BIGGER is
         not the answer either, because the whole-Mall scene draws one lawn
         that ends 97 m north of this building and a generous pad ran past it
         and put a step in the Mall's own edge. So the extent is computed:
         max(h, 40) * 2.2 metres, which is the host's rule, converted back
         into this file's feet. */
      var R = Math.max(p.h / (VE || 1), 40) * 2.2 / FT;
      var q = [pt(-R,-R,0), pt(R,-R,0), pt(R,R,0), pt(-R,R,0)];
      items.push({ svg: ctx.poly(q, H.C.lawn || "#cfd8c4", null, 0), depth: -1e9 + 0.2 });
    })();

    /* the shadows, before anything stands up */
    castShadow(rect(0, (VS + VW) / 2, SFRONT, WING_D), Z_WRF, 0.17);
    castShadow(rect(0, (VW + VN) / 2, NORTH_E * 2, VN - VW), Z_RRF, 0.15);
    castShadow(rect(0, (VS + VNP) / 2, PAV_W, VNP - VS), CREST * 0.55, 0.13);
    [-1, 1].forEach(function (sgn) {
      castShadow(rect(sgn * (NW_IN + NW_OUT) / 2, (NW_S + NW_N) / 2,
                      NW_OUT - NW_IN, NW_N - NW_S), Z_WST, 0.16);
    });

    /* ================= the elevation, shared by every 1911 mass =========
       Three granites in three bands, a water table between the first two, a
       cornice slab, an attic. Any mass that is part of the 1911 building is
       drawn by this routine so the bands line up across all 561 ft, which is
       the published "strong horizontal line that continues around all four
       sides". */
    function block1911(cx, cy, wx, wy, opt) {
      opt = opt || {};
      var top = opt.attic === false ? Z_CN : (opt.rangeAttic ? Z_RST : Z_WST);
      box(cx, cy, wx, wy, 0, Z_WTB, MILF, { noTop: true });                    /* rusticated basement */
      box(cx, cy, wx + 1.6, wy + 1.6, Z_WTB, Z_WT - Z_WTB, MILF, { noTop: true, bias: 2 }); /* the water table itself */
      box(cx, cy, wx, wy, Z_WT, Z_CN0 - Z_WT, BETH, { noTop: true });          /* the two principal storeys */
      box(cx, cy, wx + 2.2, wy + 2.2, Z_CN0, Z_CN - Z_CN0, BETH, { noTop: true, bias: 3 }); /* the main cornice slab */
      if (top > Z_CN) box(cx, cy, wx - 0.4, wy - 0.4, Z_CN, top - Z_CN, AIRY, { noTop: !!opt.noAtticTop });

      /* the openings, bay by bay, on whichever faces the camera can see */
      var lo = [[cx-wx/2,cy-wy/2],[cx+wx/2,cy-wy/2],[cx+wx/2,cy+wy/2],[cx-wx/2,cy+wy/2]];
      var nrm = [[0,-1],[1,0],[0,1],[-1,0]];
      var bays = opt.bays || [0,0,0,0];
      for (var i = 0; i < 4; i++) {
        var n = bays[i];
        if (!n || !ctx.faceVisible(nrm[i][0], nrm[i][1])) continue;
        var j = (i + 1) % 4, a = lo[i], b = lo[j], nx = nrm[i][0], ny = nrm[i][1];
        /* the rusticated basement: horizontal joints, then the segmental
           arched openings, 10 ft by 10 ft 6 in as published */
        var len = Math.sqrt((b[0]-a[0])*(b[0]-a[0]) + (b[1]-a[1])*(b[1]-a[1]));
        [[5.6,6.2],[10.4,11.0],[15.2,15.8]].forEach(function (r, ri) {
          rects(a[0],a[1],b[0],b[1], nx,ny, 1, [r], len - 1.2, "#5d564a", 0.20, 0.0004 + ri*0.00002);
        });
        rects(a[0],a[1],b[0],b[1], nx,ny, n, [[7.0,17.5]], 10, GLASS, null, 0.0008, true);
        /* the giant two-storey opening, one per bay, 11 ft 6 in wide */
        rects(a[0],a[1],b[0],b[1], nx,ny, n, [[Z_PL, Z_G1]], 11.5, GLASS, null, 0.001);
        /* the zinc panel at mid height, the only thing that betrays the floor */
        rects(a[0],a[1],b[0],b[1], nx,ny, n, [[41.5, 44.4]], 11.5, "#c6c3b6", null, 0.0016);
        if (opt.pil) pilasters(a[0],a[1],b[0],b[1], nx,ny, Z_PL, Z_G1 - Z_PL, n + 1, 3.67, BETH);
        /* the attic: the wings take two double-hung windows a bay, the ranges
           take a paneled parapet and their dormers are drawn separately */
        if (top > Z_CN && !opt.rangeAttic) {
          rects(a[0],a[1],b[0],b[1], nx,ny, n, [[69.5, 78.0]], 4.2, GLASS, null, 0.0012);
          rects(a[0],a[1],b[0],b[1], nx,ny, n, [[69.5, 78.0]], 0.9, "#e2ded2", null, 0.0018);
        }
        if (opt.rangeAttic) {
          rects(a[0],a[1],b[0],b[1], nx,ny, n, [[Z_CN + 1.2, Z_RST - 1.2]], 12.5, "#d8d4c8", 0.55, 0.0012);
        }
      }
    }

    /* ================= the north block: the two ranges, the spine between
       the courts, and the north pavilion. This is the LOWEST of the three
       ranked masses, which is Rathbun's own point: the ranges are
       subordinated to the wings as the wings are to the main pavilion. */
    block1911(0, (VW + VN) / 2, NORTH_E * 2, VN - VW,
              { bays: [0, 9, 0, 9], rangeAttic: true, noAtticTop: true });
    /* its north face is 9 + 5 + 9 bays, and the centre block projects */
    (function () {
      if (ctx.faceVisible(0, 1)) {
        [[-NORTH_E, -NPAV_E], [NPAV_E, NORTH_E]].forEach(function (r) {
          rects(r[0], VN, r[1], VN, 0, 1, 9, [[7.0,17.5]], 10, GLASS, null, 0.0008, true);
          rects(r[0], VN, r[1], VN, 0, 1, 9, [[Z_PL, Z_G1]], 11.5, GLASS, null, 0.001);
          rects(r[0], VN, r[1], VN, 0, 1, 9, [[41.5, 44.4]], 11.5, "#c6c3b6", null, 0.0016);
          rects(r[0], VN, r[1], VN, 0, 1, 9, [[Z_CN + 1.2, Z_RST - 1.2]], 12.5, "#d8d4c8", 0.55, 0.0012);
        });
      }
    })();
    /* the mansard over the ranges: slate, sloping back to a flat copper deck.
       The first render drew it as ONE plane over the whole 499 by 188 block
       and it read as a field of grass with a shipping container on it. The
       ranges are L-shaped and the two courts between them carry the glass
       roofs the nomination describes, so the mansard is drawn as the FRAME it
       is: the north leg, the two side legs, the spine between the courts, and
       glass over the courts themselves. */
    var CRT_I = 61.41, CRT_O = 189.6, CRT_N = 96.76;   /* the courts, 128 ft 2 in square */
    (function () {
      function band(cx, cy, wx, wy) {
        box(cx, cy, wx, wy, Z_RST, Z_RRF - Z_RST, SLATE,
            { wxT: Math.max(8, wx - 18), wyT: Math.max(8, wy - 18), noTop: true });
        box(cx, cy, Math.max(8, wx - 18), Math.max(8, wy - 18), Z_RRF, 0.9, COPP, { bias: 2 });
      }
      band(0, (CRT_N + VN) / 2, NORTH_E * 2 - 1.5, VN - CRT_N + 5);        /* the north leg */
      band(NORTH_E - 30, (VW + VN) / 2, 60, VN - VW - 1.5);                /* the east leg */
      band(-NORTH_E + 30, (VW + VN) / 2, 60, VN - VW - 1.5);               /* the west leg */
      band(0, (VW + VN) / 2, CRT_I * 2, VN - VW - 1.5);                    /* the spine */
      /* the two courts, glazed. Height not published, so drawn at the main
         cornice: a named gap, and far better than a slate field. */
      [-1, 1].forEach(function (sg) {
        var q = [pt(sg * CRT_I, VW, Z_CN), pt(sg * CRT_O, VW, Z_CN),
                 pt(sg * CRT_O, CRT_N, Z_CN), pt(sg * CRT_I, CRT_N, Z_CN)];
        items.push({ svg: ctx.poly(q, tone(GLZ, 0, 0, 1), GLZ.edge, 0.3), depth: far(q) + 0.02 });
      });
      /* the dormers, one over each large window, heads alternating triangular
         and segmental, with a paneled parapet between them */
      function dormerRow(x0, y0, x1, y1, nx, ny, n) {
        if (!ctx.faceVisible(nx, ny)) return;
        var dep = far([pt(x0,y0,0), pt(x1,y1,0)]) + 0.02;
        var tx = -ny, ty = nx;
        for (var i = 0; i < n; i++) {
          var t = (i + 0.5) / n;
          var cx = x0 + (x1 - x0) * t + nx * 0.6, cyy = y0 + (y1 - y0) * t + ny * 0.6;
          var hw = 3.4;
          var q = [pt(cx - tx*hw, cyy - ty*hw, Z_RST), pt(cx + tx*hw, cyy + ty*hw, Z_RST),
                   pt(cx + tx*hw, cyy + ty*hw, Z_RST + 7.6), pt(cx - tx*hw, cyy - ty*hw, Z_RST + 7.6)];
          items.push({ svg: ctx.poly(q, tone(AIRY, nx, ny, 0), AIRY.edge, 0.3), depth: dep });
          items.push({ svg: ctx.poly([pt(cx - tx*2.5, cyy - ty*2.5, Z_RST + 0.8),
                                      pt(cx + tx*2.5, cyy + ty*2.5, Z_RST + 0.8),
                                      pt(cx + tx*2.5, cyy + ty*2.5, Z_RST + 6.6),
                                      pt(cx - tx*2.5, cyy - ty*2.5, Z_RST + 6.6)],
                                     ctx.shade(GLASS, nx, ny, 0), null, 0), depth: dep + 0.002 });
          /* the head: triangular on the even bays, segmental on the odd ones */
          var hd;
          if (i % 2 === 0) {
            hd = [pt(cx - tx*hw, cyy - ty*hw, Z_RST + 7.6), pt(cx + tx*hw, cyy + ty*hw, Z_RST + 7.6),
                  pt(cx, cyy, Z_RST + 10.6)];
          } else {
            hd = [pt(cx - tx*hw, cyy - ty*hw, Z_RST + 7.6), pt(cx + tx*hw, cyy + ty*hw, Z_RST + 7.6),
                  pt(cx + tx*hw*0.62, cyy + ty*hw*0.62, Z_RST + 9.9),
                  pt(cx - tx*hw*0.62, cyy - ty*hw*0.62, Z_RST + 9.9)];
          }
          items.push({ svg: ctx.poly(hd, tone(AIRY, nx, ny, 0.3), AIRY.edge, 0.3), depth: dep + 0.003 });
        }
      }
      dormerRow(-NORTH_E, VN, -NPAV_E, VN, 0, 1, 9);
      dormerRow(NPAV_E, VN, NORTH_E, VN, 0, 1, 9);
      dormerRow(NORTH_E, VW, NORTH_E, VN, 1, 0, 9);
      dormerRow(-NORTH_E, VW, -NORTH_E, VN, -1, 0, 9);
    })();
    /* the north pavilion, projecting on Constitution Avenue: no portico, no
       dome, five bays, and its three entrances at the ground floor because
       the site falls away to the north */
    block1911(0, (VN + VNP) / 2, NPAV_E * 2, VNP - VN, { bays: [0, 1, 5, 1] });
    if (ctx.faceVisible(0, 1)) {
      rects(-NPAV_E, VNP, NPAV_E, VNP, 0, 1, 3, [[0, 15.4]], 8.5, "#2f353c", null, 0.004);
    }

    /* ================= the 1961-65 wings ================= */
    [-1, 1].forEach(function (sg) {
      var cu = sg * (NW_CN + NW_OUT) / 2, wu = NW_OUT - NW_CN;
      var cv = (NW_S + NW_N) / 2, wv = NW_N - NW_S;
      /* the same three-granite banding and the same water table height, which
         the nomination says explicitly continues around all four sides */
      box(cu, cv, wu, wv, 0, Z_WTB, MILF, { noTop: true });
      box(cu, cv, wu + 1.6, wv + 1.6, Z_WTB, Z_WT - Z_WTB, MILF, { noTop: true, bias: 2 });
      box(cu, cv, wu, wv, Z_WT, Z_CN0 - Z_WT, BETH, { noTop: true });
      box(cu, cv, wu + 2.0, wv + 2.0, Z_CN0, Z_CN - Z_CN0, BETH, { noTop: true, bias: 3 });
      box(cu, cv, wu, wv, Z_CN, Z_RST - Z_CN, AIRY, { noTop: true });        /* the parapet */
      box(cu, cv, wu - 3, wv - 3, Z_RST, 0.6, DECK, { bias: 1 });            /* the roof behind it */
      box(cu, cv, wu - 26, wv - 26, Z_RST, Z_WST - Z_RST, AIRY, { noTop: true }); /* the set-back attic */
      box(cu, cv, wu - 29, wv - 29, Z_WST, 0.6, DECK, { bias: 2 });
      box(cu, cv, wu - 62, wv - 62, Z_WST, 9.4, DECK, { bias: 3 });          /* the 1991 penthouse */
      /* three stacked windows above the water table, each shorter than the
         one below, over a trabeated ground storey: nine bays on the end
         elevation, seven on the south, both published or derived above */
      var lo = [[cu-wu/2,cv-wv/2],[cu+wu/2,cv-wv/2],[cu+wu/2,cv+wv/2],[cu-wu/2,cv+wv/2]];
      var nrm = [[0,-1],[1,0],[0,1],[-1,0]];
      var bays = sg > 0 ? [7, 9, 7, 0] : [7, 0, 7, 9];
      for (var i = 0; i < 4; i++) {
        var n = bays[i];
        if (!n || !ctx.faceVisible(nrm[i][0], nrm[i][1])) continue;
        var j = (i + 1) % 4, a = lo[i], b = lo[j], nx = nrm[i][0], ny = nrm[i][1];
        /* a trabeated ground storey, then the published THREE stacked windows
           above the water table, each shorter than the one below, with the
           zinc panels the nomination puts under the middle and top ones */
        rects(a[0],a[1],b[0],b[1], nx,ny, n, [[8.0, 19.0]], 11, GLASS, null, 0.0008);
        rects(a[0],a[1],b[0],b[1], nx,ny, n, [[26.5, 38.5]], 11, GLASS, null, 0.001);
        rects(a[0],a[1],b[0],b[1], nx,ny, n, [[42.0, 52.5]], 11, GLASS, null, 0.0011);
        rects(a[0],a[1],b[0],b[1], nx,ny, n, [[55.5, 61.5]], 11, GLASS, null, 0.0012);
        rects(a[0],a[1],b[0],b[1], nx,ny, n, [[39.6, 41.4]], 11, "#c6c3b6", null, 0.0016);
        rects(a[0],a[1],b[0],b[1], nx,ny, n, [[53.4, 55.0]], 11, "#c6c3b6", null, 0.0017);
      }
      /* the set-back attic's tripartite windows, one to a bay */
      var alo = [[cu-(wu-26)/2,cv-(wv-26)/2],[cu+(wu-26)/2,cv-(wv-26)/2],
                 [cu+(wu-26)/2,cv+(wv-26)/2],[cu-(wu-26)/2,cv+(wv-26)/2]];
      for (var ai2 = 0; ai2 < 4; ai2++) {
        var na = bays[ai2];
        if (!na || !ctx.faceVisible(nrm[ai2][0], nrm[ai2][1])) continue;
        var ja = (ai2 + 1) % 4;
        rects(alo[ai2][0], alo[ai2][1], alo[ja][0], alo[ja][1], nrm[ai2][0], nrm[ai2][1],
              na, [[73.5, 79.5]], 9, GLASS, null, 0.002);
      }
      /* the recessed connection to the 1911 building: set back on both faces
         and stopping below the cornice, which is what makes the join read */
      var ku = sg * (NW_IN + NW_CN) / 2, kw = NW_CN - NW_IN;
      box(ku, (CN_S + CN_N) / 2, kw, CN_N - CN_S, 0, Z_WTB, MILF, { noTop: true });
      box(ku, (CN_S + CN_N) / 2, kw, CN_N - CN_S, Z_WTB, Z_CN0 - Z_WTB, BETH, { noTop: true });
      box(ku, (CN_S + CN_N) / 2, kw + 1.4, CN_N - CN_S + 1.4, Z_CN0, Z_CN - Z_CN0, BETH, { bias: 2 });
    });

    /* ================= the 1911 wings, the middle of the three masses ==== */
    [-1, 1].forEach(function (sg) {
      var cu = sg * (PAV_E + WING_E) / 2, wu = WING_E - PAV_E;
      block1911(cu, (VS + VW) / 2, wu, WING_D,
                { bays: [11, sg > 0 ? 5 : 0, 0, sg > 0 ? 0 : 5], pil: true, noAtticTop: true });
      /* the hipped slate roof, its pitch derived from the two published
         levels, truncated because the published 32 ft 2 in skylights have to
         sit on something */
      /* the eaves sit flush with the wall, not 1.5 ft inside it: the inset
         left a hairline of sunlit attic stone showing round the whole roof */
      box(cu, (VS + VW) / 2, wu, WING_D, Z_WST, Z_WRF - Z_WST, SLATE,
          { wxT: wu - 42, wyT: 40 });
      /* the skylight itself, 32 ft 2 in by 149 ft 4 in, published. It was
         drawn in bright zinc first and read as a hole punched in the roof. */
      box(cu, (VS + VW) / 2, 149.33, 32.17, Z_WRF, 1.8, GLZ, { bias: 3 });
    });

    /* ================= the south pavilion ================= */
    block1911(0, (VS + VW) / 2, PAV_W, WING_D, { bays: [0, 0, 0, 0], noAtticTop: true });
    /* the pavilion's roof around the octagon. It was left as the attic box's
       own top face, which is stone in full sunlight, and it read as a bright
       white wedge lying between the octagon and the wing roofs: the brightest
       thing in the model, and not a surface the building has. It is slate,
       like every other roof here. */
    box(0, (VS + VW) / 2, PAV_W, WING_D, Z_WST, 1.2, SLATE, { bias: 2 });
    /* the two strips of the pavilion's south face that the projecting block
       does not cover, one bay each side. Blank pale wall in the first render. */
    if (ctx.faceVisible(0, -1)) {
      [[-PAV_E, -PROJ_UW], [PROJ_UW, PAV_E]].forEach(function (r) {
        rects(r[0], VS, r[1], VS, 0, -1, 1, [[7.0, 17.5]], 10, GLASS, null, 0.0008, true);
        rects(r[0], VS, r[1], VS, 0, -1, 1, [[Z_PL, Z_G1]], 11.5, GLASS, null, 0.001);
        rects(r[0], VS, r[1], VS, 0, -1, 1, [[41.5, 44.4]], 11.5, "#c6c3b6", null, 0.0016);
        rects(r[0], VS, r[1], VS, 0, -1, 1, [[69.5, 78.0]], 4.2, GLASS, null, 0.0012);
      });
    }

    /* the projecting face, 16 ft 3 in beyond the general front above grade
       and 27 ft 5 1/4 in in the ground story, which is what the portico
       stands on */
    box(0, (PROJ_G + VS) / 2, PROJ_GW * 2, VS - PROJ_G, 0, Z_WT, MILF, { bias: 4 });
    box(0, (PROJ_U + VS) / 2, PROJ_UW * 2, VS - PROJ_U, Z_WT, Z_PENT - Z_WT, BETH,
        { noTop: true, bias: 4 });
    box(0, (PROJ_U + VS) / 2, PROJ_UW * 2 + 2.2, VS - PROJ_U + 2.2, Z_CN0, Z_CN - Z_CN0, BETH,
        { noTop: true, bias: 5 });

    /* ================= the portico ================= */
    var COL_H = 45, COL_DL = 4.25, COL_DH = 3.66, ENT_H = 11;
    var CU = [-34.604, -21.5, -7.625, 7.625, 21.5, 34.604];   /* published spacings */
    var VCOL = PROJ_U - 6.6;                                   /* published projection */
    var VINR = VCOL + 8.35;                                    /* the inner pair */
    (function () {
      if (!ctx.faceVisible(0, -1)) return;                     /* it exists on the south only */
      /* THE SHADE OF THE PORTICO ITSELF, and the first render is why it is
         here. Six columns 4 ft 3 in thick are four pixels wide at map scale,
         and against a wall of their own tone they vanish: the render showed a
         striped panel and a white canopy where a portico should be. A portico
         9 ft deep shades its own back wall, so the wall behind the columns is
         washed down and the recess behind them is dark, and only then do the
         columns read as columns standing in front of something. */
      rects(-PROJ_UW, PROJ_U, PROJ_UW, PROJ_U, 0, -1, 1, [[Z_WT, Z_PENT]], 73.04, "#4c4a44", 0.34, 0.09);
      /* the recess behind the columns, 39 ft 1 in by 13 ft 2 in, and the main
         entrance inside it, 12 ft 9 in by 25 ft 9 in */
      rects(-PROJ_UW, PROJ_U, PROJ_UW, PROJ_U, 0, -1, 1, [[Z_WT, Z_WT + 30]], 39.08, "#2e343a", null, 0.11);
      rects(-PROJ_UW, PROJ_U, PROJ_UW, PROJ_U, 0, -1, 1, [[Z_WT, Z_WT + 25.75]], 12.75, "#1d2229", null, 0.13);
      /* four pilasters on the front wall, completing the fiction of two rows
         of six. NOT paired: that is the Beaux-Arts tell this building refuses. */
      [-34.604, -21.5, 21.5, 34.604].forEach(function (u) {
        var q = [pt(u - 1.96, PROJ_U - 1.08, Z_WT), pt(u + 1.96, PROJ_U - 1.08, Z_WT),
                 pt(u + 1.96, PROJ_U - 1.08, Z_WT + COL_H), pt(u - 1.96, PROJ_U - 1.08, Z_WT + COL_H)];
        items.push({ svg: ctx.poly(q, tone(COLM, 0, -1, 0), COLM.edge, 0.3), depth: far(q) + 0.15 });
      });
      /* the two columns of the inner row, standing just within the recess */
      [-7.625, 7.625].forEach(function (u) {
        column(u, VINR, Z_WT, COL_H, COL_DL, COL_DH, COLM, far([pt(u, VINR, 0)]) + 0.2);
      });
      /* the six of the outer row, on their published 6 ft 4 in plinths. Each
         column carries its OWN depth; one shared depth for all six put the
         near ones behind the far ones. */
      CU.forEach(function (u) {
        var d = far([pt(u, VCOL, 0)]) + 0.3;
        box(u, VCOL, 6.33, 6.33, Z_WT, 3.92, COLM, { depth: d });
        column(u, VCOL, Z_WT + 3.92, COL_H - 3.92, COL_DL, COL_DH, COLM, d);
      });
      /* the entablature, 11 ft, and the parapet set back 5 ft 1 1/2 in */
      var dE = far([pt(0, VCOL, 0)]) + 0.5;
      box(0, (VCOL - 4.99 + PROJ_U) / 2, 73.04, PROJ_U - VCOL + 4.99, Z_WT + COL_H, ENT_H, COLM,
          { depth: dE });
      box(0, (VCOL - 4.99 + PROJ_U) / 2 + 2.56, 73.04 - 4, PROJ_U - VCOL - 0.11, Z_PENT, 2.46, COLM,
          { depth: dE + 0.1 });
    })();

    /* ================= the south approach =================
       Every dimension here is published and, better, they close on each
       other: twelve treads of 18 in, a platform 22 ft 1 1/2 in deep, and
       eight more treads is 52.13 ft against a published total run of 52 ft
       5 1/2 in. The platform's straight middle is 76 ft 8 in and each end is
       a quadrant of 31 ft 4 in radius, which sums to the published 139 ft
       4 in over the benches EXACTLY. Only the rise is in question, and that
       gap is named in the header. */
    (function () {
      if (!ctx.faceVisible(0, -1)) return;
      var TR = 1.5, RIS = Z_WT / 20;
      var UW = 45.125, LW = 123, RQ = 31.33, HALFW = 38.33;
      var vTop = PROJ_G, vPlat = vTop - 18, vLow = vPlat - 22.13;
      var zPlat = Z_WT - 12 * RIS;
      /* the upper run of twelve, as nested shrinking slabs */
      for (var k = 0; k < 12; k++) {
        box(0, vTop - (k + 1) * TR / 2, UW, (k + 1) * TR, 0, Z_WT - RIS * (k + 1), MILF,
            { bias: 6 + k * 0.15 });
      }
      /* the platform: a straight middle with a quadrant at each end. The
         first render drew the ends as complete 31 ft drums, which is what a
         full ring gives you when you wanted a quarter of one. */
      box(0, vPlat - 11.07, HALFW * 2, 22.13, 0, zPlat, MILF, { bias: 9 });
      [[1, -Math.PI / 2, 0], [-1, -Math.PI / 2, -Math.PI]].forEach(function (e) {
        var cu = e[0] * HALFW;
        quadSlab(cu, vPlat, RQ, e[1], e[2], 0, zPlat, MILF, 0.10);
        /* the curved granite bench, raised above the platform by two steps */
        arcBand(cu, vPlat, RQ - 4.2, RQ, e[1], e[2], zPlat, 2.6, MILF, 0.14);
      });
      /* the lower run of eight, about two and a half times wider */
      for (var k2 = 0; k2 < 8; k2++) {
        box(0, vLow - (k2 + 1) * TR / 2, LW, (k2 + 1) * TR, 0, zPlat - RIS * (k2 + 1), MILF,
            { bias: 16 + k2 * 0.15 });
      }
      /* the four dies. The upper pair's tops are level with the portico
         floor; the lower pair carry the boulder of banded ironstone and the
         two pieces of petrified wood, neither of which is dimensioned, so
         nothing is drawn standing on them. */
      [-1, 1].forEach(function (sg) {
        box(sg * (UW / 2 + 5.5), vTop - 6.25, 11, 12.5, 0, Z_WT, MILF, { bias: 7 });
        box(sg * (UW / 2 + 5.5), vTop - 6.25, 12.4, 13.9, Z_WT, 1.2, MILF, { bias: 8 });
        box(sg * (LW / 2 + 10), vLow - 5.5, 20, 11, 0, 6.66, MILF, { bias: 22 });
        box(sg * (LW / 2 + 10), vLow - 5.5, 21.5, 12.5, 6.66, 1.1, MILF, { bias: 23 });
      });
    })();

    /* ================= the octagon ================= */
    /* a SQUARE WITH ITS CORNERS CUT, not a regular octagon: 97.73 ft square
       with 7.79 ft corners, which makes the broad faces the published 82 ft
       2 in and the chamfers 11.02 ft in normal elevation against a published
       11 ft 1 in. */
    var OCV = VS + 97.73 / 2, OCH = 97.73 / 2, OCC = 7.79, OBW = 82.17 / 2;
    var OCT = [];
    (function () {
      var c = [[ OCH, -OCH], [ OCH,  OCH], [-OCH,  OCH], [-OCH, -OCH]];
      var d = [[-1, 0], [0, -1], [1, 0], [0, 1]];
      for (var i = 0; i < 4; i++) {
        var j = (i + 1) % 4;
        OCT.push([c[i][0] + d[i][0] * OCC, c[i][1] + d[i][1] * OCC]);
        OCT.push([c[j][0] - d[i][0] * OCC, c[j][1] - d[i][1] * OCC]);
      }
    })();
    (function () {
      var pl = OCT.map(function (q) { return [q[0], q[1] + OCV]; });
      for (var i = 0; i < 8; i++) {
        var a = pl[i], b = pl[(i + 1) % 8];
        var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - OCV;
        var l = Math.sqrt(mx * mx + my * my) || 1, nx = mx / l, ny = my / l;
        if (!ctx.faceVisible(nx, ny)) continue;
        var q = [pt(a[0],a[1],Z_OCT), pt(b[0],b[1],Z_OCT), pt(b[0],b[1],Z_OE0), pt(a[0],a[1],Z_OE0)];
        items.push({ svg: ctx.poly(q, tone(BETH, nx, ny, 0), BETH.edge, 0.35), depth: far(q) + 0.4 });
        /* the entablature, and on the four diagonal walls between the
           pediments its frieze carries the incised Greek fret, which is the
           only ornament on those walls */
        var e = [pt(a[0],a[1],Z_OE0), pt(b[0],b[1],Z_OE0), pt(b[0],b[1],Z_OE1), pt(a[0],a[1],Z_OE1)];
        items.push({ svg: ctx.poly(e, tone(AIRY, nx, ny, 0), AIRY.edge, 0.35), depth: far(e) + 0.5 });
        if (i % 2 === 1) {
          var f0 = Z_OE0 + 0.4, f1 = f0 + 3.71;                 /* 3 ft 8 1/2 in */
          var fr = [pt(a[0],a[1],f0), pt(b[0],b[1],f0), pt(b[0],b[1],f1), pt(a[0],a[1],f1)];
          items.push({ svg: ctx.poly(fr, ctx.shade("#d0cabb", nx, ny, 0), null, 0), depth: far(fr) + 0.55 });
        }
      }
    })();
    /* the four pediments, and the great semicircular window in each. There is
       no tympanum sculpture anywhere on this building; a Diocletian window is
       what is there instead. */
    (function () {
      var faces = [[0, -1, OCV - OCH], [1, 0, OCH], [0, 1, OCV + OCH], [-1, 0, -OCH]];
      faces.forEach(function (f) {
        var nx = f[0], ny = f[1];
        if (!ctx.faceVisible(nx, ny)) return;
        var tx = -ny, ty = nx;                       /* along the face */
        function fp(t, z) {                          /* t along the face, z up */
          var bu = nx ? f[2] : t, bv = nx ? OCV + t : f[2];
          return pt(bu + nx * 0.5, bv + ny * 0.5, z);
        }
        /* THE PEDIMENT SORTS ON ITS CENTRE, NOT ITS FAR CORNER, and the
           render is why. far() takes a face's farthest point, and an 82 ft
           face's far corner sits further back than the near edge of the 84 ft
           drum standing 7 ft behind it, so the drum painted straight over the
           south pediment and its clerestory window: the front of the building
           lost the one feature this entry exists to show. A narrow object
           behind a wide face is exactly the case the farthest-point rule gets
           wrong, so this assembly carries the ry of its own centre. */
        var dep = fp(0, 0)[2] + 1.2;
        /* the raking gable, from the entablature to the parapet block */
        items.push({ svg: ctx.poly([fp(-OBW, Z_OE1), fp(OBW, Z_OE1), fp(0, Z_PED)],
                                   tone(BETH, nx, ny, 0.15), BETH.edge, 0.35), depth: dep });
        /* the raking cornice. Without it the gable was the same stone as the
           wall under it and the pediment did not read as a pediment at all. */
        [[-1, 0], [0, 1]].forEach(function (r) {
          var u0 = r[0] * OBW, u1 = r[1] * OBW;
          var z0 = r[0] ? Z_OE1 : Z_PED, z1 = r[1] ? Z_PED : Z_OE1;
          items.push({ svg: ctx.poly([fp(u0, z0), fp(u1, z1), fp(u1, z1 - 1.9), fp(u0, z0 - 1.9)],
                                     tone(AIRY, nx, ny, 0.25), null, 0), depth: dep + 0.03 });
        });
        /* the extended pediment's tympanum wall below the entablature line,
           so the arch has somewhere to spring from */
        items.push({ svg: ctx.poly([fp(-OBW, Z_OE0), fp(OBW, Z_OE0), fp(OBW, Z_OE1), fp(-OBW, Z_OE1)],
                                   tone(BETH, nx, ny, 0), null, 0), depth: dep + 0.02 });
        /* the window: 20 ft 4 in radius inside a 4 ft archivolt, springing
           below the entablature, split by two 3 ft 2 in granite mullions into
           three sections of triangular copper lattice */
        var R = 20.33, AR = 24.33, SP = 98, N = 22;
        function arc(r, z0) {
          var o = [];
          for (var i = 0; i <= N; i++) {
            var a = Math.PI * i / N;
            o.push(fp(-r * Math.cos(a), z0 + r * Math.sin(a)));
          }
          return o;
        }
        var av = arc(AR, SP).concat([fp(R, SP)], arc(R, SP).slice().reverse(), [fp(-AR, SP)]);
        items.push({ svg: ctx.poly(arc(AR, SP), tone(AIRY, nx, ny, 0), AIRY.edge, 0.3), depth: dep + 0.05 });
        items.push({ svg: ctx.poly(arc(R, SP), ctx.shade(LATT, nx, ny, 0), null, 0), depth: dep + 0.07 });
        [-3.17, 3.17].forEach(function (u) {
          var hh = Math.sqrt(Math.max(0, R * R - (Math.abs(u) + 1.58) * (Math.abs(u) + 1.58)));
          items.push({ svg: ctx.poly([fp(u - 1.58, SP), fp(u + 1.58, SP), fp(u + 1.58, SP + hh), fp(u - 1.58, SP + hh)],
                                     tone(AIRY, nx, ny, 0), null, 0), depth: dep + 0.09 });
        });
        /* the parapet block at the apex, published at 124 ft 9 1/2 in */
        items.push({ svg: ctx.poly([fp(-5.5, Z_PED - 3.4), fp(5.5, Z_PED - 3.4), fp(5.5, Z_PED), fp(-5.5, Z_PED)],
                                   tone(AIRY, nx, ny, 0.2), AIRY.edge, 0.3), depth: dep + 0.12 });
      });
      /* the slated roofs behind the pediments, ridge at the published 99 ft
         1 in above the first floor */
      box(0, OCV, OCH * 2 - 3, OCH * 2 - 3, Z_OE1, Z_RID - Z_OE1, SLATE,
          { wxT: 30, wyT: 30, noTop: true, bias: 45 });
    })();

    /* ================= the drum ================= */
    /* 84 ft in diameter and faced in 2 ft courses of Bethel granite, carrying
       a DORIC frieze under a denticulated cornice and a capped parapet: a
       different order from the octagon's fret below it. */
    var DR = 42, DN = 32;
    ring(0, OCV, DR, DR, Z_OE1, 127.4 - Z_OE1, DN, BETH, { bias: 60, noTop: true });
    ring(0, OCV, DR, DR, 127.4, 3.49, DN, AIRY, { bias: 62, noTop: true });        /* the Doric frieze */
    /* the denticulated cornice, given its published 4 ft 4 3/8 in of PROJECTION
       rather than a token 1 ft: at close range the drum read as a smooth pipe
       with a hairline round it */
    ring(0, OCV, DR + 4.36, DR + 4.36, 130.9, 2.6, DN, AIRY, { bias: 64, noTop: true });
    ring(0, OCV, DR + 4.36, DR, 130.2, 0.7, DN, AIRY, { bias: 63, noTop: true });
    ring(0, OCV, DR, DR, 133.4, 4.15, DN, AIRY, { bias: 66, noTop: true });        /* the capped parapet */
    /* the three crowning courses, each stepped back about its own height,
       which is exactly what takes an 84 ft drum down to a 75 ft dome base */
    for (var ci = 0; ci < 3; ci++) {
      var r0 = DR - ci * 1.5, r1 = DR - (ci + 1) * 1.5;
      ring(0, OCV, r0, r0, 137.55 + ci * 1.413, 1.413, DN, AIRY, { bias: 68 + ci, noTop: true });
      ring(0, OCV, r0, r1, 137.55 + (ci + 1) * 1.413 - 0.05, 0.05, DN, AIRY, { bias: 68.5 + ci, noTop: true });
    }
    /* the triglyph rhythm on the Doric frieze, so the drum is not a blank tyre */
    (function () {
      for (var k = 0; k < 32; k++) {
        var a = (k / 32) * Math.PI * 2;
        var nx = Math.cos(a), ny = Math.sin(a);
        if (!ctx.faceVisible(nx, ny)) continue;
        var u0 = (DR + 0.4) * Math.cos(a - 0.026), v0 = (DR + 0.4) * Math.sin(a - 0.026);
        var u1 = (DR + 0.4) * Math.cos(a + 0.026), v1 = (DR + 0.4) * Math.sin(a + 0.026);
        var q = [pt(u0, OCV + v0, 127.6), pt(u1, OCV + v1, 127.6),
                 pt(u1, OCV + v1, 130.7), pt(u0, OCV + v0, 130.7)];
        items.push({ svg: ctx.poly(q, ctx.shade("#b6b0a1", nx, ny, 0), null, 0), depth: far(q) + 0.63 });
      }
    })();

    /* ================= the dome ================= */
    /* THE POINT OF THE BUILDING. A spherical SEGMENT: 75 ft across the base,
       21 ft 8 in of rise, so rise over half-span is 0.578 and the profile is
       flatter than a hemisphere by a long way. Green Vermont slate. */
    (function () {
      var RB = 37.5, RISE = Z_DOM - Z_DRM;
      var SR = (RB * RB + RISE * RISE) / (2 * RISE);      /* generating radius, derived */
      var zc = Z_DOM - SR;
      var EYE = 9.415;                                     /* published 18 ft 10 in */
      var zEye = zc + Math.sqrt(Math.max(0, SR * SR - EYE * EYE));
      var STEP = 9;
      for (var i = 0; i < STEP; i++) {
        var z0 = Z_DRM + (zEye - Z_DRM) * i / STEP;
        var z1 = Z_DRM + (zEye - Z_DRM) * (i + 1) / STEP;
        var r0 = Math.sqrt(Math.max(0, SR * SR - (z0 - zc) * (z0 - zc)));
        var r1 = Math.sqrt(Math.max(0, SR * SR - (z1 - zc) * (z1 - zc)));
        ring(0, OCV, r0, r1, z0, z1 - z0, 32, SLATE, { bias: 80 + i, noTop: true });
      }
      /* the eye, and the curb around it. The two published figures leave a
         1.19 ft residual (see the header); it is absorbed here so the crest
         is the published 165 ft 2 in. */
      ring(0, OCV, EYE, EYE, zEye, CREST - zEye, 24, AIRY, { bias: 90, noTop: true });
      var eq = [];
      for (var k = 0; k < 20; k++) {
        var a = (k / 20) * Math.PI * 2;
        eq.push(pt(EYE * 0.92 * Math.cos(a), OCV + EYE * 0.92 * Math.sin(a), CREST - 0.2));
      }
      items.push({ svg: ctx.poly(eq, "#2c3138", null, 0), depth: far(eq) + 0.95 });
    })();

    return items;
  };
})();
