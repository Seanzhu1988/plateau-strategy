/* dc-form-airspace.js: the National Air and Space Museum, the NATIONAL MALL
 * building, Independence Avenue at 6th Street SW. Gyo Obata of Hellmuth,
 * Obata and Kassabaum, 1972 to 1976, opened 1 July 1976.
 *
 * What stood here before was the generic "block" form: one extruded box, one
 * tone, no shadow. MODEL_STANDARD.md names this building by name as the
 * example of the failure. The reason is not spend, it is that the whole
 * building is an ALTERNATION of solid and void along a very long low front,
 * and a box has neither half of it.
 *
 * NOT MODELLED HERE, and each is a different building that pollutes the
 * search results for this one:
 *   - the Steven F. Udvar-Hazy Center at Dulles (also HOK, 2003). The "gray
 *     Kasota limestone" and "760,000 square feet" figures belong to it.
 *   - the 1988 Obata glass pyramid restaurant pavilion at the east end,
 *     demolished 2023 for the Jeff Bezos Learning Center ("50,000-square-
 *     foot, three-story", en.wikipedia.org/wiki/National_Air_and_Space_Museum,
 *     read this run, where it reads as planned rather than finished). The OSM
 *     footprint this model is built on shows a FLAT east end with no
 *     addition, so this is the building without either.
 *
 * ------------------------------------------------------------------
 * STYLE. Late Modern, the Mall's stone-and-glass museum. SAH Archipedia files
 * it under High-Tech and Modernist, Docomomo US under Late Modern and
 * Post-Modern, the federal Section 106 record simply as "a modern
 * architectural style". Obata's own sources are the aircraft hangar and John
 * Russell Pope's National Gallery of Art West Building straight across the
 * Mall, whose projections and recesses these solids and voids were placed to
 * correspond to. STYLES.md carries no entry for it; the tells this file is
 * built on are listed here rather than claimed there:
 *   - the alternation IS the building. Blocks and bays are SEPARATE MASSES
 *     with a real 15 ft recess between them, never one wall with a darker
 *     stripe painted on it.
 *   - the stone is a thin hung SKIN, not masonry. No coursing, no
 *     rustication, no quoins. The tell at map scale is a fine HORIZONTAL
 *     panel grain on an otherwise blank plane, and joints drawn at full
 *     strength turn a stone veil into brickwork (the NMAAHC screen lesson
 *     and the Vietnam panel lesson arriving a third time).
 *   - NO cornice, NO base moulding, NO window surround. Every classical
 *     horizontal break the rest of this book relies on is deliberately
 *     absent, so reaching for a cornice slab leaves the style.
 *   - the SHADOW SLOT does the cornice's job, and it is a VOID rather than a
 *     projection. See the quote under THE ONE HORIZONTAL BREAK below.
 *   - structure is shown only in the VOIDS: exposed tubular steel truss
 *     behind the glass, and nothing whatever on the stone.
 *   - an elevated terrace is the one classical move left.
 *
 * ------------------------------------------------------------------
 * RESEARCH. Every number below carries a source checked THIS RUN.
 *
 * PUBLISHED, Smithsonian Institution Archives, museum history, read through
 * a Wayback snapshot of 25 August 2026 because the live si.edu URL is
 * Cloudflare-blocked, quoted verbatim:
 * https://web.archive.org/web/20260825212401/https://siarchives.si.edu/history/national-air-and-space-museum-and-udvar-hazy-center
 *   "The dimensions of the building are 635 feet in length, 225 feet in
 *    width, and 82 feet, 9 inches in height, with some 161,145 square feet
 *    of exhibition floor space."
 *
 * PUBLISHED, National Capital Planning Commission File 7585, the April 2018
 * NEPA Finding of No Significant Impact, which is the richest single source
 * on this building and the one that settles the counts:
 * https://www.ncpc.gov/files/projects/2018/7585_Building_Exterior,_Vestibules,_and_Site_Improvements_NEPA_Document_-_FONSI_Apr2018.pdf
 *   "The NASM's prominent character defining features consist of four
 *    monumental blocks clad in Tennessee Pink marble (limestone) panels
 *    separated by three recessed glass bays on the north side, and
 *    alternating large and small marble clad blocks on the south side
 *    separated by smaller bays of recessed glass."
 *   "The stone cladding is one of the main character defining features and
 *    comprises 65 percent of the overall building facade, while the glazing
 *    represents 35 percent."
 *   "The NASM's stone cladding consists of Tennessee Pink marble (limestone)
 *    panels measuring 2'6" by 5' in dimension."
 *   Envelope areas: stone cladding facade 160,600 gsf, curtain wall 40,000,
 *   skylight 52,000, roof 70,000, terrace 112,000, site walls 37,850.
 *   "the revitalization of the existing 687,000 gross-square-foot NASM
 *    building".
 *   "The NASM is situated on an elevated paved terrace, with a series of
 *    walled and stepped terraces with planters, stairs and ramps".
 *   "Photovoltaics on the roof were considered but eliminated due to
 *    incompatibility with the roof assembly and structure." So NO panels are
 *    drawn on the roof.
 *   North vestibule 3,480 sq ft, "a tensile roof structure that evokes the
 *    early flying machines".
 *
 * PUBLISHED, SAH Archipedia, the entry by Pamela Scott and Antoinette J. Lee
 * from Buildings of the District of Columbia (Oxford University Press, 1993).
 * The live sah-archipedia.org URL is Cloudflare-blocked and the Wayback
 * mirror refused this run's fetcher, so the two sentences this model leans on
 * were re-confirmed this run through a search index quoting the page:
 * https://sah-archipedia.org/buildings/DC-01-ML02
 *   "the long slit of the balconies and deeply recessed windows cut into each
 *    block create dramatic black shadows, a kind of inverted cornice line."
 *   the glass spine "runs the entire 635-foot length of the building"; the
 *   marble "laid with the grain running horizontally, which results in a
 *   basket-weave effect"; "the high-tech exposed tubular steel truss supports
 *   the gray glass walls and ceiling"; "The entire building is raised on a
 *   long, low, two-level terrace that provides a solid base for it in the
 *   classical manner".
 *
 * PUBLISHED, en.wikipedia.org/wiki/National_Air_and_Space_Museum, read this
 * run: "four simple marble-encased cubes containing the smaller and more
 * theatrical exhibits, connected by three spacious steel-and-glass atria
 * which house the larger exhibits"; "The west glass wall of the building is
 * used for the installation of airplanes, functioning as a giant door."
 *
 * ------------------------------------------------------------------
 * THE LENGTH IS IN CONFLICT, and this is the most important thing in the
 * file. Two independent published sources say 635 ft. The building footprint
 * MEASURED THIS RUN says 684.1 ft.
 *
 *   OSM way 66418797, the outer way of relation 16159112, fetched this run
 *   from api.openstreetmap.org, projected about its own centroid and rotated
 *   to its minimum-area rectangle: axis 0.97 degrees off the lat/lon grid,
 *   684.1 ft by 224.4 ft, polygon area 144,728 sq ft, centroid 38.888061,
 *   -77.019977.
 *   https://www.openstreetmap.org/way/66418797
 *
 *   CONTROL, run the same way this run so this is not a claim about OSM in
 *   general: the National Gallery of Art West Building straight across the
 *   Mall, OSM way 66418944, measures 787.2 ft against its published 785 ft,
 *   an error of 0.28 percent. https://www.openstreetmap.org/way/66418944
 *
 * At that accuracy a 49 ft error is not available to the measurement. The
 * measured WIDTH of 224.4 ft agrees with the published 225 ft to within a
 * foot, so there is no scale error to blame. And 684.1 closes exactly on the
 * measured module: four north blocks averaging 83.7 plus three north bays
 * averaging 116.5 is 683.9. An early published design figure was 785 x 225
 * ft, and 785, 685 and 635 differ only in the middle digit, which is what a
 * transcription error looks like.
 *
 * So the PLAN is built from the measurement, cited, and the published 635 ft
 * is recorded here rather than quietly dropped. The HEIGHT is built from the
 * publication, because nothing measured contradicts it.
 *
 * ------------------------------------------------------------------
 * THE PLAN, every number MEASURED this run off that footprint, in feet, in a
 * frame de-rotated to the building's own axis. u east, v north, origin at the
 * centre of the minimum-area rectangle.
 *
 * NORTH, the Mall front, outer face v = +111.9:
 *   4 blocks   -342.1..-258.1  -142.3..-58.7   57.8..141.4   258.5..342.1
 *              widths 84.0, 83.6, 83.6, 83.6
 *   3 bays     -258.1..-142.3 recessed to v +97.3  (14.6 ft deep, 115.8 wide)
 *               -58.7..  57.8 recessed to v +95.3  (16.6 ft deep, 116.5 wide)
 *               141.4.. 258.5 recessed to v +95.0  (16.9 ft deep, 117.1 wide)
 *
 * SOUTH, Independence Avenue, outer face v = -111.8. The two long fronts are
 * NOT the same and a model that mirrors one onto the other is wrong. Scott
 * and Lee give the reason: on the south "the recessed, glass-enclosed bays of
 * the Mall facade have been replaced by unbroken floating marble cubes
 * cantilevered to be flush with the south facade to avoid excessive retention
 * of heat". So each atrium shows on the south as one SMALLER stone block with
 * a narrow glass slot on each flank:
 *   7 blocks   -341.9..-258.3 (83.6 large)   -237.3..-163.6 (73.7 small)
 *              -141.8.. -58.5 (83.3 large)    -37.6..  36.1 (73.7 small)
 *                57.2.. 141.1 (83.9 large)   162.7.. 235.2 (72.5 small)
 *               257.9.. 342.0 (84.1 large)
 *   6 slots    widths 21.0, 21.9, 20.9, 21.1, 21.6, 22.7, recessed to
 *              v -95.4 to -96.1, that is 15.7 to 16.4 ft deep
 *
 * WEST END, the aircraft door: a 54.6 ft band of the west face, v -27.8 to
 * +26.8, is set back 11.1 ft to u = -330.9. That is the measured seat of the
 * published "west glass wall ... functioning as a giant door". Its own
 * opening is not dimensioned anywhere reached.
 *
 * EAST END: flat, u = +342.0, no projection.
 *
 * ------------------------------------------------------------------
 * DERIVED, shown rather than asserted, each from a published figure and a
 * measured one:
 *
 *   SKYLIGHT DEPTH. Published skylight 52,000 gsf over the three atria; the
 *   measured north bay widths sum to 349.4 ft; 52,000 / 349.4 = 148.8 ft. So
 *   the glazed roof runs 148.8 ft south from each bay's glass wall and stops
 *   about 60 ft short of the south face, which is where the cantilevered
 *   south cubes are. This assumes the skylight covers exactly the three atria
 *   at their north-bay width, which is an assumption about its shape, not
 *   about its area.
 *
 *   TERRACE APRON. Published terrace 112,000 gsf; measured building polygon
 *   144,728 sq ft inside a 684.1 by 224.4 rectangle. A uniform apron of width
 *   w gives (684.1+2w)(224.4+2w) - 144,728 = 112,000, so w = 51.1 ft. Drawn
 *   51 ft, split 28 ft at the upper level and 23 more at the lower, because
 *   the terrace is published as two-level. The SPLIT is an assumption; the
 *   total is arithmetic on a published area.
 *
 *   CONTINUUM's OFFSET. Published only as "aligned with 6th Street SW" and
 *   "slightly off-center with the south entrance". 6th Street SW measured
 *   this run through Overpass at mean longitude -77.019910 against the
 *   building centroid's -77.019977: 5.8 m, that is 19 ft EAST of the
 *   building's plan centre. So the sculpture is placed at u = +19, which is a
 *   measurement rather than a guess, and it is what "slightly off-center"
 *   means in feet.
 *
 *   DELTA SOLAR's PLACE. Published only as "on the west end of the site near
 *   Independence and 7th Street, SW". 7th Street SW measured this run at mean
 *   longitude -77.021914, which is 551 ft west of the building centre and so
 *   209 ft west of the west face. Drawn on the midline of that west lawn, at
 *   u = -446. The cross-axis position is an assumption.
 *
 * ------------------------------------------------------------------
 * THE ONE HORIZONTAL BREAK, and it is a NAMED GAP. The style has no cornice
 * and no string course; what it has instead is the slot, and Scott and Lee
 * describe it in words with no dimension anywhere reached this run:
 *   "The adjoining Hirshhorn Museum offered a detail that Obata adopted: the
 *    long slit of the balconies and deeply recessed windows cut into each
 *    block create dramatic black shadows, a kind of inverted cornice line."
 * No height above the terrace, no depth, no count is published. Drawn as ONE
 * slot per block, 7 ft tall with its sill at 52 ft, recessed 2.5 ft, with a
 * lit sill running out to the wall plane so it reads as a cut and not a
 * painted stripe. Every one of those four numbers is an assumption and this
 * is the line that says so. A block with no slot is a grey box, which is
 * exactly what stood here before, so drawing nothing was not the honest
 * option either.
 *
 * ------------------------------------------------------------------
 * MATERIAL, and it is not what it was. The building was clad in Tennessee
 * Pink marble, the same stone as the National Gallery across the Mall, in
 * panels 1 1/4 in thick. It is now CLAD IN COLONIAL ROSE GRANITE: selected
 * 2017 to 2018 over four alternatives, approved by the Commission of Fine
 * Arts off a life-size mockup in York, Pennsylvania, and the facade stone
 * replacement completed December 2023. The fabricator states "more than
 * 160,000 square feet of 2-inch-thick Rub & Sand Colonial Rose granite
 * panels", which closes on the published 160,600 gsf of stone facade.
 * https://coldspringusa.com/case_study/national-air-space-museum/
 * CONFLICT, named rather than smoothed: Wikipedia's revitalization paragraph
 * says the facade is being replaced "again using Tennessee marble". The
 * fabricator, the NCPC record and the CFA approval all say granite, so this
 * model draws granite. Its published description is "pink tone comparable to
 * TN Pink" with "fine, linear veining pattern not present". No colour value
 * is published for it anywhere reached, so the hex here is a reading of that
 * sentence and is a gap.
 *
 * ------------------------------------------------------------------
 * NAMED GAPS, all of them, on their own lines:
 *   - the SLOT: no dimension, height, depth or count published. See above.
 *   - the GLASS ATRIA's HEIGHT relative to the stone blocks: 82 ft 9 in is
 *     given for the building as a whole and no source separates the two, so
 *     they are drawn to the SAME height and nothing is invented.
 *   - the TERRACE's HEIGHT above grade: not published anywhere reached. Drawn
 *     5 ft to the upper level and 2.5 ft to the lower. Because 82 ft 9 in is
 *     almost certainly measured FROM the terrace, this model puts z = 0 at
 *     the LAWN, the terrace top at +5, and the stone from +5 to +87.75. The
 *     5 ft is therefore an admitted addition BELOW the published height and
 *     is not folded into it.
 *   - no published STEP COUNT at either entrance stair, and no published
 *     width. Drawn 8 risers, and 116 ft wide on the north because that is the
 *     measured width of the middle bay it serves.
 *   - no published STOREY HEIGHTS or floor levels. Two exhibition levels are
 *     published; no level is drawn.
 *   - no published TRUSS span, member size or bay spacing. The mullions and
 *     chords behind the glass are indicative and claim no dimension. The
 *     135 ft trusses reported during construction were the TEMPORARY weather
 *     enclosure over the skylights, not the building's own structure, and are
 *     not borrowed here.
 *   - no published PARAPET height or roof edge detail, and the style forbids
 *     a cornice, so the roof edge is a clean arris. No published roof surface
 *     material either; the roof is drawn a neutral membrane grey so the top
 *     does not read as the same surface as the walls.
 *   - no published dimension for the WEST DOOR opening itself, only the
 *     measured 54.6 by 11.1 ft setback it sits in.
 *   - AD ASTRA's height is published inconsistently: 115 ft by the Richard
 *     Lippold Foundation, the artist's own foundation, and 100 ft in
 *     Wikipedia's body text. 115 is used and the conflict is named. No base
 *     dimension and no distance from the facade is published; it is drawn 46
 *     ft north of the block face, standing on the LOWER terrace, which is
 *     where the federal record puts it after the 2018 works ("north of the
 *     reconfigured entrance stair"). The distance is an assumption.
 *     https://www.lippoldfoundation.org/ad-astra
 *   - no published pool or plinth dimensions for DELTA SOLAR (27 by 40 ft,
 *     stainless, Alejandro Otero, 1977), and none for CONTINUUM's pedestal
 *     (14 ft bronze, Charles O. Perry, 1976).
 *   - no published dimension for the north tensile CANOPY beyond its 3,480
 *     sq ft. Drawn 116 by 30 ft, which is exactly that area; its two heights
 *     are assumptions. Whether the optional south canopy was built was not
 *     established this run, so none is drawn.
 *   - the AIRCRAFT hanging in the atria are the thing a visitor actually
 *     names and they are drawn as indicative silhouettes. No aircraft is
 *     modelled and none is claimed.
 *   - panel COURSE HEIGHT is published as 2 ft 6 in by NCPC and 2 ft by Scott
 *     and Lee, and replacement THICKNESS as 3 in by NCPC and 2 in by the
 *     fabricator. Neither is resolved. The federal figures are the stronger
 *     source and the drawing uses 2 ft 6 in.
 *
 * ------------------------------------------------------------------
 * WHAT LOOKING CAUGHT, and no count or dimension could have. Rendered at
 * yaws -0.55, +0.90, +2.60 and -1.85, all at pitch 0.30, plus two 1800 pixel
 * close crops.
 *
 *   1. The AIRCRAFT were drawn as a fuselage bar crossed by a wing bar, which
 *      is arithmetically a plane and visually a CROSSHAIR. Three of them per
 *      atrium turned the one feature a visitor actually names into a row of
 *      gunsights. They are now twelve-point silhouettes with a swept wing and
 *      a tail, and they read as aeroplanes at 900 pixels.
 *   2. The CANOPY was a pair of pyramid tents. At the renderer's 17 degree
 *      camera elevation a pyramid with a 19 degree slope flattens into a white
 *      lozenge lying on the paving, so the newest thing on the site read as a
 *      dropped sheet of paper. Rebuilt as a hypar, two corners lifted and two
 *      dropped, which is what a tensile roof actually is. The first hypar
 *      warped 14 ft over a 30 ft depth and read as a shark fin; 7 ft reads as
 *      fabric.
 *   3. AD ASTRA was standing at z equal to the UPPER terrace height while its
 *      position, 68 ft out, put it past the terrace edge on the lawn. It
 *      floated five feet in the air and the arithmetic was silent about it,
 *      because nothing in the model knows which surface a thing stands on.
 *      Moved onto the lower terrace at 46 ft, which is also where the federal
 *      record puts it.
 *   4. The TERRACE and its stairs were drawn in the paving tone throughout,
 *      so a two-level terrace with two eight-riser flights rendered as three
 *      concentric outlines and nothing else. Risers now carry their own
 *      darker tone and every step head carries a nosing line. A 5 ft rise
 *      still reads as a low tray, which is honest: 5 ft is what is drawn and
 *      the real height is not published.
 *   5. The 52,000 sq ft of SKYLIGHT was a plain blue rectangle, which is the
 *      roof-side version of a stone wall with no grain. Framed.
 *   6. The stone GRAIN at 17 percent was invisible at map scale and at 30
 *      percent it reads as the basket weave without becoming brickwork. The
 *      NMAAHC lesson cuts both ways: too strong is brick, too faint is a box.
 *   7. The SLOT was one unbroken black bar. Divided by slender stone mullions
 *      and given a lit sill, it reads as a recessed glazed slit, which is what
 *      "the long slit of the balconies and deeply recessed windows" describes.
 *      It was also missing from the WEST end while the east end carried it;
 *      both ends are block ends and both now carry it.
 *   8. The building had no shade lying on the paving it stands on, only a
 *      lawn shadow that the terrace hid. A second shadow, clipped to the upper
 *      deck, is what stops the mass reading as pasted onto the terrace.
 *   9. The host's single-building pad is sized from p.h, so it is 176 m across
 *      and this building is 209 m long. Without its own ground the model sat
 *      on a rectangle of paper narrower than itself, which is the Vietnam
 *      memorial's pad fault exactly.
 *
 * ------------------------------------------------------------------
 * PLACE HEIGHT. dc-3d.js carries h: 24 for key "airspace" against a published
 * 82 ft 9 in = 25.22 m, with OSM relation 16159112 independently tagging
 * height 25.30. It should be 25. dc-3d.js is not edited from here; the
 * correction is reported. The place COORDINATE is also about 30 m north of
 * the measured footprint centroid: dc-3d.js has 38.88833, -77.02000 against
 * the measured 38.888061, -77.019977. Also reported, not edited.
 *
 * SCALE. FT = p.h / 82.75, so the published height lands exactly on p.h and
 * the 5 ft of assumed terrace hangs below it.
 *
 * PAINT. The recesses are the whole building and they are also the whole
 * painter's problem. Every north-bay part (glass, jambs, truss, aircraft,
 * slot) is gated on the NORTH face being toward the camera, and every south
 * part on the SOUTH face, because a recess drawn from the wrong side paints
 * its back wall straight across the silhouette. That is the Hirshhorn
 * balcony's lesson, the NMAAHC porch's lesson and the Vietnam walk's lesson,
 * and it is designed in here rather than discovered. Every recessed band
 * carries an explicit bias off its own parent wall's depth, so it paints just
 * after the wall it is cut into and never over a nearer block.
 */
(function () {
  var H = window.DC3D.helpers;
  window.DC_FORMS = window.DC_FORMS || {};
  window.DC_FORMS['airspace'] = function (ctx, p, s, VE) {
    var P = ctx.project, items = [];

    /* ---------- published height, and the scale it fixes ---------- */
    var HB = 82.75;                    /* 82 ft 9 in, SI Archives */
    var FT = (p.h * VE) / HB;          /* metres per foot */
    var m  = FT * s;
    function W(u, v) { return [p.x + u * m, p.y + v * m]; }
    function pt(u, v, z) { return P(p.x + u * m, p.y + v * m, z * FT); }

    /* ---------- measured plan, feet, see the header ---------- */
    var NV = 111.9, SV = -111.8, EU = 342.0, WU = -342.0;
    var NBLK = [[-342.1,-258.1], [-142.3,-58.7], [57.8,141.4], [258.5,342.1]];
    var NBAY = [[-258.1,-142.3, 97.3], [-58.7,57.8, 95.3], [141.4,258.5, 95.0]];
    var SBLK = [[-341.9,-258.3], [-237.3,-163.6], [-141.8,-58.5], [-37.6,36.1],
                [57.2,141.1], [162.7,235.2], [257.9,342.0]];
    var SSLOT= [[-258.3,-237.3,-95.7], [-163.6,-141.7,-95.5], [-58.5,-37.6,-95.8],
                [36.1,57.2,-95.6], [141.1,162.7,-95.4], [235.2,257.9,-96.1]];
    var DOOR_V0 = -27.8, DOOR_V1 = 26.8, DOOR_U = -330.9;   /* aircraft-door setback */

    /* ---------- the assumptions, each named in the header ---------- */
    var TU = 5.0, TL = 2.5;            /* upper and lower terrace heights */
    var AP_U = 28, AP_L = 51;          /* terrace aprons, the 51 is DERIVED */
    var ZB = TU, ZT = TU + HB;         /* the stone runs terrace to 87.75 */
    var SLOT_Z = 56, SLOT_H = 6, SLOT_D = 2.5;  /* the inverted cornice */
    var COURSE = 2.5;                  /* published panel course, 2 ft 6 in */
    var SKY_D = 148.8;                 /* DERIVED, 52,000 gsf over 349.4 ft */

    /* ---------- materials, two tones each, warmer on the sunlit face ------- */
    var LD = [0.55, 0.35, 0.72];       /* the renderer's own light vector */
    function tone(mt, nx, ny, nz) {
      var d = nx * LD[0] + ny * LD[1] + nz * LD[2];
      return ctx.shade(d > 0.05 ? mt.lit : mt.shade, nx, ny, nz);
    }
    var GRAN  = { lit: "#e6d3c9", shade: "#d1bcb2" };  /* Colonial Rose granite */
    var GLASS = { lit: "#5d6a73", shade: "#48535b" };  /* tinted curtain wall */
    var SKY   = { lit: "#7f909a", shade: "#6a7a84" };  /* the atrium skylights */
    var ROOFM = { lit: "#b9b7ae", shade: "#a8a69e" };  /* roof membrane, not published */
    var PAVE  = { lit: "#d3d0c4", shade: "#bfbcb1" };  /* terrace paving */
    var RISER = { lit: "#a8a498", shade: "#96928a" };  /* terrace and step risers */
    var GOLD  = { lit: "#dcb75f", shade: "#ab8a3e" };  /* Ad Astra, gold stainless */
    var BRONZ = { lit: "#5f4c2c", shade: "#413521" };  /* Continuum */
    var STEEL = { lit: "#d5d9da", shade: "#a9aeb0" };  /* Delta Solar */
    var FAB   = { lit: "#eeeade", shade: "#d6d1c4" };  /* the tensile canopy */
    var MAST  = { lit: "#6f7477", shade: "#5c6164" };
    var JOINT = "#83706a";             /* one tone off the stone, the grain */
    var DARK  = "#23282c";             /* the slot, and the aircraft */
    var TRUSS = "#39424a";

    /* ---------- primitives ---------- */
    function quad(u0, v0, u1, v1, z0, z1) {
      return [pt(u0,v0,z0), pt(u1,v1,z0), pt(u1,v1,z1), pt(u0,v0,z1)];
    }
    /* a vertical face with an explicit outward normal, culled by it */
    function wall(u0, v0, u1, v1, z0, z1, nx, ny, mt, bias, ex) {
      if (!ctx.faceVisible(nx, ny)) return null;
      var q = quad(u0, v0, u1, v1, z0, z1);
      var d = H.depthOf(q) + (bias || 0);
      items.push({ svg: ctx.poly(q, typeof mt === "string" ? mt : tone(mt, nx, ny, 0), null, 0, ex),
                   depth: d });
      return d;
    }
    /* a horizontal face; depth is explicit whenever it lies on something */
    function flat(poly, z, fill, depth, ex) {
      var q = poly.map(function (c) { return pt(c[0], c[1], z); });
      var d = depth === undefined ? H.depthOf(q) : depth;
      items.push({ svg: ctx.poly(q, fill, null, 0, ex), depth: d });
      return d;
    }
    function rect(u0, v0, u1, v1) { return [[u0,v0],[u1,v0],[u1,v1],[u0,v1]]; }
    /* a shadow that lands on a NAMED surface rather than on the lawn, so the
       building's own shade falls across the terrace it stands on. The offset
       is the renderer's own light vector, in feet because this frame is feet. */
    function castOn(u0, v0, u1, v1, h, z, depth, clip) {
      var dx = -0.55 * h * 0.9, dy = -0.35 * h * 0.9;
      var hull = [[u0+dx,v0+dy],[u1+dx,v0+dy],[u1,v0],[u1,v1],[u0,v1],[u0+dx,v1+dy]];
      if (clip) hull = hull.map(function (c) {
        return [Math.max(clip[0], Math.min(clip[2], c[0])),
                Math.max(clip[1], Math.min(clip[3], c[1]))];
      });
      flat(hull, z, "#000", depth, ' opacity="0.15"');
    }

    /* the stone's horizontal grain. 2 ft 6 in courses over 82.75 ft is 33
       lines, and 33 lines at map scale is the NMAAHC brick wall. One sliver
       every fifth course, a fraction of a tone off, reads as the basket weave
       the horizontally grained panels actually make. */
    function grain(u0, v0, u1, v1, nx, ny, base) {
      if (!ctx.faceVisible(nx, ny)) return;
      var k = 0;
      for (var z = ZB + COURSE * 5; z < ZT - 1; z += COURSE * 5) {
        var q = quad(u0, v0, u1, v1, z, z + 0.55);
        items.push({ svg: ctx.poly(q, JOINT, null, 0, ' opacity="0.30"'),
                     depth: base + 0.30 + (k++) * 0.004 });
      }
    }

    /* THE ONE HORIZONTAL BREAK: a recessed slot with a lit sill and slender
       mullions, so it reads as a cut glazed slit and not as a bar painted on
       the stone. Every dimension here is an assumption; see the header. */
    function slot(a, b, faceV, nx, ny, base, lights) {
      if (!ctx.faceVisible(nx, ny)) return;
      if (b - a < 10) return;
      var back = faceV - ny * SLOT_D;
      var q = quad(a, back, b, back, SLOT_Z, SLOT_Z + SLOT_H);
      items.push({ svg: ctx.poly(q, DARK, null, 0, ' opacity="0.88"'), depth: base + 0.55 });
      var n = lights || Math.max(2, Math.round((b - a) / 26));
      for (var i = 1; i < n; i++) {
        var t = a + (b - a) * i / n;
        var mq = quad(t - 0.9, back, t + 0.9, back, SLOT_Z, SLOT_Z + SLOT_H);
        items.push({ svg: ctx.poly(mq, tone(GRAN, nx, ny, 0), null, 0), depth: base + 0.58 });
      }
      /* the sill, seen because the camera looks down: it is what makes the
         band read as a cut rather than as a stripe */
      var sq = [pt(a, back, SLOT_Z), pt(b, back, SLOT_Z), pt(b, faceV, SLOT_Z), pt(a, faceV, SLOT_Z)];
      items.push({ svg: ctx.poly(sq, tone(GRAN, 0, 0, 1), null, 0), depth: base + 0.62 });
    }

    /* ---------- the site pad ----------
       The host sizes a single building's lawn from p.h, so its pad is 176 m
       across and this building is 209 m long: without its own ground the model
       would sit on a rectangle of paper narrower than itself. The tone is the
       host's own lawn so the two grounds meet without a seam, and it is drawn
       well past the frame so its corner never reads as a sheet of paper. */
    items.push({ svg: ctx.poly(rect(-760, -460, 660, 460).map(function (c) { return pt(c[0], c[1], 0); }),
                               H.C.lawn, null, 0), depth: -1e9 + 0.3 });

    /* the shadow on the LAWN, cast from the terrace edge at the building's
       height so it clears the terrace instead of hiding underneath it */
    items.push(H.shadow(ctx, [W(WU-AP_L, SV-AP_L), W(EU+AP_L, SV-AP_L),
                              W(EU+AP_L, NV+AP_L), W(WU-AP_L, NV+AP_L)], ZT * FT));

    /* ---------- the two-level terrace, the one classical move left -------- */
    var deckU;
    (function () {
      var lo = [WU-AP_L, SV-AP_L, EU+AP_L, NV+AP_L];
      var hi = [WU-AP_U, SV-AP_U, EU+AP_U, NV+AP_U];
      flat(rect(lo[0], lo[1], lo[2], lo[3]), TL, tone(PAVE, 0, 0, 1));
      wall(lo[0], lo[1], lo[2], lo[1], 0, TL, 0, -1, RISER, 0);
      wall(lo[2], lo[3], lo[0], lo[3], 0, TL, 0,  1, RISER, 0);
      wall(lo[0], lo[3], lo[0], lo[1], 0, TL, -1, 0, RISER, 0);
      wall(lo[2], lo[1], lo[2], lo[3], 0, TL,  1, 0, RISER, 0);
      deckU = flat(rect(hi[0], hi[1], hi[2], hi[3]), TU, tone(PAVE, 0, 0, 1));
      /* the building's own shade lying across the paving it stands on,
         clipped to the upper deck so it cannot float off the edge */
      castOn(WU, SV, EU, NV, ZT, TU, deckU + 0.4, hi);
      wall(hi[0], hi[1], hi[2], hi[1], TL, TU, 0, -1, RISER, 0.6);
      wall(hi[2], hi[3], hi[0], hi[3], TL, TU, 0,  1, RISER, 0.6);
      wall(hi[0], hi[3], hi[0], hi[1], TL, TU, -1, 0, RISER, 0.6);
      wall(hi[2], hi[1], hi[2], hi[3], TL, TU,  1, 0, RISER, 0.6);

      /* the entry stairs, a stack of shrinking slabs on the two axes. No step
         count and no width is published; 8 risers, and the north flight is
         drawn the measured width of the bay it serves. A dark nosing at each
         riser head is what makes stacked slabs read as steps at map scale. */
      function stair(cu, cv, wid, north) {
        var n = 8, tread = 1.7, sgn = north ? 1 : -1;
        for (var i = 0; i < n; i++) {
          var z = TU * (n - i) / n, run = cv + sgn * (i + 1) * tread;
          var poly = north ? rect(cu - wid/2, cv, cu + wid/2, run)
                           : rect(cu - wid/2, run, cu + wid/2, cv);
          var d = flat(poly, z, tone(PAVE, 0, 0, 1));
          wall(cu - wid/2, run, cu + wid/2, run, z - TU / n, z, 0, sgn, RISER, 0.5);
          flat(north ? rect(cu - wid/2, run - 0.5, cu + wid/2, run)
                     : rect(cu - wid/2, run, cu + wid/2, run + 0.5),
               z, DARK, d + 0.2, ' opacity="0.30"');
        }
      }
      stair(-0.4, hi[3], 116, true);
      stair(19, hi[1], 90, false);
    })();

    /* ---------- the roof, which is HALF GLASS ----------
       Published: 70,000 gsf of opaque roof and 52,000 gsf of skylight, so 43
       percent of the top surface is glazed. Drawn as strips in u so the plan's
       notches are real notches; each strip overruns its neighbour slightly,
       because abutting quads round apart under toFixed and leave a ladder of
       pale seams, which is the Hirshhorn ring's starburst. */
    function northVAt(u) {
      for (var i = 0; i < NBAY.length; i++) if (u > NBAY[i][0] && u < NBAY[i][1]) return NBAY[i][2];
      return NV;
    }
    function southVAt(u) {
      for (var i = 0; i < SSLOT.length; i++) if (u > SSLOT[i][0] && u < SSLOT[i][1]) return SSLOT[i][2];
      return SV;
    }
    (function () {
      var cuts = [WU, DOOR_U, EU];
      NBLK.concat(NBAY).forEach(function (a) { cuts.push(a[0], a[1]); });
      SBLK.concat(SSLOT).forEach(function (a) { cuts.push(a[0], a[1]); });
      cuts = cuts.filter(function (x) { return x > WU - 0.5 && x < EU + 0.5; })
                 .sort(function (a, b) { return a - b; });
      for (var i = 0; i < cuts.length - 1; i++) {
        var ua = cuts[i], ub = cuts[i + 1];
        if (ub - ua < 0.5) continue;
        var mid = (ua + ub) / 2, nv = northVAt(mid), sv = southVAt(mid);
        var ubo = Math.min(EU, ub + 0.4);
        var bands = (ub <= DOOR_U + 0.01)
          ? [[sv, DOOR_V0], [DOOR_V1, nv]]      /* the door notch is open above */
          : [[sv, nv]];
        bands.forEach(function (bd) {
          var d = flat(rect(ua, bd[0], ubo, bd[1]), ZT, tone(ROOFM, 0, 0, 1));
          for (var k = 0; k < NBAY.length; k++) {
            if (mid > NBAY[k][0] && mid < NBAY[k][1]) {
              var v1 = Math.min(NBAY[k][2], bd[1]), v0 = Math.max(bd[0], NBAY[k][2] - SKY_D);
              if (v1 - v0 > 4) {
                flat(rect(ua, v0, ubo, v1), ZT, tone(SKY, 0, 0, 1), d + 0.25);
                /* the skylight's own framing. Without it a 52,000 sq ft glazed
                   roof reads as a flat blue rectangle, which is the same
                   failure as a stone wall with no grain. No member size is
                   published; the spacing is the bay's, not a claim. */
                for (var g = 1; g < 5; g++) {
                  var vg = v0 + (v1 - v0) * g / 5;
                  flat(rect(ua, vg - 0.8, ubo, vg + 0.8), ZT, tone(ROOFM, 0, 0, 1), d + 0.3);
                }
                flat(rect(ua, v0, ubo, v0 + 1.4), ZT, tone(ROOFM, 0, 0, 1), d + 0.32);
              }
            }
          }
        });
      }
    })();

    /* ---------- the NORTH front: four blocks, three glass bays ------------ */
    NBLK.forEach(function (b) {
      var d = wall(b[0], NV, b[1], NV, ZB, ZT, 0, 1, GRAN, 0);
      if (d !== null) { grain(b[0], NV, b[1], NV, 0, 1, d); slot(b[0]+5, b[1]-5, NV, 0, 1, d); }
    });
    if (ctx.faceVisible(0, 1)) {
      NBAY.forEach(function (a, k) {
        var vf = a[2];
        /* the two stone jambs: the reveal is 15 to 17 ft and it is the reason
           the alternation reads as mass rather than as a change of colour */
        wall(a[0], vf, a[0], NV, ZB, ZT,  1, 0, GRAN, 0.15);
        wall(a[1], NV, a[1], vf, ZB, ZT, -1, 0, GRAN, 0.15);
        var d = wall(a[0], vf, a[1], vf, ZB, ZT, 0, 1, GLASS, 0);
        if (d === null) return;
        /* the exposed tubular steel truss, read through the glass. No span or
           member size is published; these are indicative. */
        var span = a[1] - a[0], nm = 6;
        for (var i = 1; i < nm; i++) {
          var u = a[0] + span * i / nm;
          items.push({ svg: ctx.poly(quad(u, vf, u + 1.4, vf, ZB, ZT), TRUSS, null, 0,
                                     ' opacity="0.55"'), depth: d + 0.10 + i * 0.002 });
        }
        [0.34, 0.68].forEach(function (t, j) {
          var z = ZB + (ZT - ZB) * t;
          items.push({ svg: ctx.poly(quad(a[0]+2, vf, a[1]-2, vf, z, z + 1.6), TRUSS, null, 0,
                                     ' opacity="0.45"'), depth: d + 0.14 + j * 0.002 });
        });
        /* what a visitor actually names: aircraft, missiles and spacecraft
           hanging in the atria, plainly visible from the street. INDICATIVE
           silhouettes; nothing here is a modelled aircraft and none is
           claimed. Drawn as outlines in the glass plane, biased just in
           front of it so they read through the glazing. */
        function poly(cs, fill, op, bias) {
          items.push({ svg: ctx.poly(cs.map(function (c) { return pt(c[0], vf, c[1]); }),
                                     fill, null, 0, ' opacity="' + op + '"'),
                       depth: d + bias });
        }
        function plane(pu, pz, L, Wg, face) {
          var f = face || 1;
          poly([[pu + f*L*0.50, pz], [pu + f*L*0.14, pz + 1.7], [pu - f*L*0.06, pz + Wg*0.5],
                [pu - f*L*0.20, pz + Wg*0.5], [pu - f*L*0.20, pz + 1.7], [pu - f*L*0.46, pz + Wg*0.30],
                [pu - f*L*0.50, pz + Wg*0.30], [pu - f*L*0.50, pz - 1.7], [pu - f*L*0.20, pz - 1.7],
                [pu - f*L*0.20, pz - Wg*0.5], [pu - f*L*0.06, pz - Wg*0.5], [pu + f*L*0.14, pz - 1.7]],
               DARK, 0.82, 0.22);
        }
        function rocket(pu, pz, ht) {
          var r = 1.9;
          poly([[pu, pz + ht], [pu + r, pz + ht - 7], [pu + r, pz + 5], [pu + r*2.6, pz],
                [pu + r*0.8, pz], [pu - r*0.8, pz], [pu - r*2.6, pz], [pu - r, pz + 5],
                [pu - r, pz + ht - 7]], DARK, 0.82, 0.22);
        }
        var cu = (a[0] + a[1]) / 2;
        if (k === 1) {
          rocket(cu - 30, ZB + 12, 52);
          plane(cu + 26, ZB + 50, 48, 30, 1);
          plane(cu + 4, ZB + 22, 36, 22, -1);
        } else {
          plane(cu - span * 0.20, ZB + 50, 54, 34, 1);
          plane(cu + span * 0.22, ZB + 22, 40, 26, -1);
        }
      });
    }

    /* ---------- the SOUTH front, which is NOT the north one ---------------
       Seven blocks, four large and three small, six narrow glass slots. The
       small blocks are the cantilevered cubes that shade each atrium. */
    SBLK.forEach(function (b) {
      var d = wall(b[1], SV, b[0], SV, ZB, ZT, 0, -1, GRAN, 0);
      if (d !== null) { grain(b[1], SV, b[0], SV, 0, -1, d); slot(b[0]+5, b[1]-5, SV, 0, -1, d); }
    });
    if (ctx.faceVisible(0, -1)) {
      SSLOT.forEach(function (a) {
        var vf = a[2];
        wall(a[0], vf, a[0], SV, ZB, ZT,  1, 0, GRAN, 0.15);
        wall(a[1], SV, a[1], vf, ZB, ZT, -1, 0, GRAN, 0.15);
        var d = wall(a[1], vf, a[0], vf, ZB, ZT, 0, -1, GLASS, 0);
        if (d === null) return;
        [0.34, 0.68].forEach(function (t, j) {
          var z = ZB + (ZT - ZB) * t;
          items.push({ svg: ctx.poly(quad(a[0]+1, vf, a[1]-1, vf, z, z + 1.4), TRUSS, null, 0,
                                     ' opacity="0.45"'), depth: d + 0.12 + j * 0.002 });
        });
      });
    }

    /* ---------- the EAST end ---------- */
    (function () {
      var d = wall(EU, SV, EU, NV, ZB, ZT, 1, 0, GRAN, 0);
      if (d === null) return;
      grain(EU, SV, EU, NV, 1, 0, d);
      /* the slot carries round the end, because the end IS a block's end */
      var a = SV + 26, b = NV - 26, back = EU - SLOT_D;
      var q = quad(back, a, back, b, SLOT_Z, SLOT_Z + SLOT_H);
      items.push({ svg: ctx.poly(q, DARK, null, 0, ' opacity="0.88"'), depth: d + 0.55 });
      for (var i = 1; i < 3; i++) {
        var t = a + (b - a) * i / 3;
        items.push({ svg: ctx.poly(quad(back, t - 0.9, back, t + 0.9, SLOT_Z, SLOT_Z + SLOT_H),
                                   tone(GRAN, 1, 0, 0), null, 0), depth: d + 0.58 });
      }
      var sq = [pt(back, a, SLOT_Z), pt(back, b, SLOT_Z), pt(EU, b, SLOT_Z), pt(EU, a, SLOT_Z)];
      items.push({ svg: ctx.poly(sq, tone(GRAN, 0, 0, 1), null, 0), depth: d + 0.62 });
    })();

    /* ---------- the WEST end, and the giant door ---------- */
    (function () {
      var d1 = wall(WU, DOOR_V0, WU, SV, ZB, ZT, -1, 0, GRAN, 0);
      var d2 = wall(WU, NV, WU, DOOR_V1, ZB, ZT, -1, 0, GRAN, 0);
      if (d1 !== null) grain(WU, DOOR_V0, WU, SV, -1, 0, d1);
      if (d2 !== null) grain(WU, NV, WU, DOOR_V1, -1, 0, d2);
      if (!ctx.faceVisible(-1, 0)) return;
      /* the slot carries across the two stone flanks of the west end, the
         same way it carries round the east end, because they are block ends */
      [[SV + 14, DOOR_V0 - 6, d1], [DOOR_V1 + 6, NV - 14, d2]].forEach(function (g) {
        if (g[2] === null || g[1] - g[0] < 10) return;
        var back = WU + SLOT_D;
        var q = quad(back, g[0], back, g[1], SLOT_Z, SLOT_Z + SLOT_H);
        items.push({ svg: ctx.poly(q, DARK, null, 0, ' opacity="0.88"'), depth: g[2] + 0.55 });
        var t = (g[0] + g[1]) / 2;
        items.push({ svg: ctx.poly(quad(back, t - 0.9, back, t + 0.9, SLOT_Z, SLOT_Z + SLOT_H),
                                   tone(GRAN, -1, 0, 0), null, 0), depth: g[2] + 0.58 });
        var sq = [pt(back, g[0], SLOT_Z), pt(back, g[1], SLOT_Z),
                  pt(WU, g[1], SLOT_Z), pt(WU, g[0], SLOT_Z)];
        items.push({ svg: ctx.poly(sq, tone(GRAN, 0, 0, 1), null, 0), depth: g[2] + 0.62 });
      });
      /* the 11.1 ft reveal of the setback */
      wall(WU, DOOR_V0, DOOR_U, DOOR_V0, ZB, ZT, 0,  1, GRAN, 0.15);
      wall(DOOR_U, DOOR_V1, WU, DOOR_V1, ZB, ZT, 0, -1, GRAN, 0.15);
      /* the glass wall that opens as a door for aeroplanes */
      var d = wall(DOOR_U, DOOR_V1, DOOR_U, DOOR_V0, ZB, ZT, -1, 0, GLASS, 0);
      if (d === null) return;
      for (var i = 1; i < 4; i++) {
        var v = DOOR_V0 + (DOOR_V1 - DOOR_V0) * i / 4;
        items.push({ svg: ctx.poly(quad(DOOR_U, v, DOOR_U, v + 1.4, ZB, ZT), TRUSS, null, 0,
                                   ' opacity="0.5"'), depth: d + 0.10 + i * 0.002 });
      }
    })();

    /* ---------- the north entrance canopy, 2018 -------------------------
       3,480 sq ft, "a tensile roof structure that evokes the early flying
       machines", found by NCPC to disrupt "the clean geometric horizontality"
       of the building, which is a fair description of what it looks like.
       Drawn at exactly that area, 116 by 30 ft. A pyramid tent was tried
       first and the picture rejected it: at a 17 degree camera elevation a
       shallow pyramid flattens into a white lozenge lying on the paving. A
       tensile roof is a WARPED surface, so this is a hypar, two corners lifted
       and two dropped, which reads as fabric under tension from every angle.
       The first warp was 14 ft over a 30 ft depth and the picture rejected
       that too: it read as a white fin. Both heights are assumptions. */
    (function () {
      var cu = -0.4, v0 = NV + 2, v1 = NV + 32, wid = 116;
      var HI = TU + 19, LO = TU + 12;
      var c = [[cu - wid/2, v0, HI], [cu + wid/2, v0, LO],
               [cu + wid/2, v1, HI], [cu - wid/2, v1, LO]];
      /* the masts, drawn before the fabric so the fabric sits on them */
      c.forEach(function (k) {
        wall(k[0] - 1.1, k[1], k[0] + 1.1, k[1], TU, k[2], 0,  1, MAST, 0.3);
        wall(k[0] + 1.1, k[1], k[0] - 1.1, k[1], TU, k[2], 0, -1, MAST, 0.3);
      });
      /* the sail, as two triangles about the low diagonal, each shaded by its
         own tilt so the warp reads rather than one flat sheet of white */
      [[0,1,2, 0.55], [0,2,3, 0.85]].forEach(function (t) {
        var q = [pt(c[t[0]][0], c[t[0]][1], c[t[0]][2]),
                 pt(c[t[1]][0], c[t[1]][1], c[t[1]][2]),
                 pt(c[t[2]][0], c[t[2]][1], c[t[2]][2])];
        items.push({ svg: ctx.poly(q, tone(FAB, 0, 0, t[3]), "#b9b4a8", 0.5),
                     depth: H.depthOf(q) + 2.0 + t[3] });
      });
      items.push(H.shadow(ctx, [W(cu-wid/2, v0), W(cu+wid/2, v0),
                                W(cu+wid/2, v1), W(cu-wid/2, v1)], HI * FT));
    })();

    /* ---------- Ad Astra, Richard Lippold, 1976 --------------------------
       115 ft of gold stainless on the north entrance axis, TALLER than the
       building it stands in front of. "a three-planed narrow shaft ending in
       a pointed tip, penetrates a triple star-like cluster near its apex".
       It stands on the LOWER terrace, north of the entrance stair, which is
       where the federal record puts it after the 2018 works; the exact
       distance is an assumption. */
    (function () {
      var cu = -0.4, cv = NV + 46, HT = 115, ZG = TL;
      function taper(w0, w1, z0, z1, mt, bias) {
        var nm = [[0,-1],[1,0],[0,1],[-1,0]];
        var sq0 = [[cu-w0/2,cv-w0/2],[cu+w0/2,cv-w0/2],[cu+w0/2,cv+w0/2],[cu-w0/2,cv+w0/2]];
        var sq1 = [[cu-w1/2,cv-w1/2],[cu+w1/2,cv-w1/2],[cu+w1/2,cv+w1/2],[cu-w1/2,cv+w1/2]];
        for (var i = 0; i < 4; i++) {
          if (!ctx.faceVisible(nm[i][0], nm[i][1])) continue;
          var j = (i + 1) % 4;
          var q = [pt(sq0[i][0],sq0[i][1],z0), pt(sq0[j][0],sq0[j][1],z0),
                   pt(sq1[j][0],sq1[j][1],z1), pt(sq1[i][0],sq1[i][1],z1)];
          items.push({ svg: ctx.poly(q, tone(mt, nm[i][0], nm[i][1], 0.1), null, 0),
                       depth: H.depthOf(q) + (bias || 0) });
        }
      }
      taper(10, 10, ZG, ZG + 2.4, RISER, 0.5);          /* the base */
      taper(7.0, 1.2, ZG + 2.4, ZG + HT, GOLD, 0.8);    /* the shaft, to a point */
      var za = ZG + HT * 0.82;
      [0, 1, 2].forEach(function (i) {
        var an = i * Math.PI * 2 / 3 + 0.4, du = Math.cos(an) * 13, dv = Math.sin(an) * 13;
        var up = [pt(cu, cv, za), pt(cu + du, cv + dv, za + 11),
                  pt(cu + du * 0.30, cv + dv * 0.30, za + 1.4)];
        items.push({ svg: ctx.poly(up, tone(GOLD, 0, 0, 0.9), null, 0), depth: H.depthOf(up) + 3.0 });
        var dn = [pt(cu, cv, za), pt(cu + du, cv + dv, za - 10),
                  pt(cu + du * 0.30, cv + dv * 0.30, za - 1.4)];
        items.push({ svg: ctx.poly(dn, tone(GOLD, 0, 0, 0.35), null, 0), depth: H.depthOf(dn) + 3.0 });
      });
      items.push(H.shadow(ctx, [W(cu-5,cv-5), W(cu+5,cv-5), W(cu+5,cv+5), W(cu-5,cv+5)], HT * FT));
    })();

    /* ---------- Continuum, Charles O. Perry, 1976 ------------------------
       14 ft of bronze at the south entrance, on the MEASURED 6th Street axis,
       19 ft east of the building's plan centre. Drawn as an upright ring on a
       low plinth: the Mobius twist is not modelled and is not claimed. */
    (function () {
      var cu = 19, cv = SV - 40, R = 7, BW = 2.2, ZG = TU;
      var nrm = ctx.faceVisible(0, -1) ? -1 : 1;
      var nm = [[0,-1],[1,0],[0,1],[-1,0]];
      for (var f = 0; f < 4; f++) {
        if (!ctx.faceVisible(nm[f][0], nm[f][1])) continue;
        var c = [[cu-4,cv-4],[cu+4,cv-4],[cu+4,cv+4],[cu-4,cv+4]];
        var g = (f + 1) % 4;
        var pq = [pt(c[f][0],c[f][1],ZG), pt(c[g][0],c[g][1],ZG),
                  pt(c[g][0],c[g][1],ZG+2), pt(c[f][0],c[f][1],ZG+2)];
        items.push({ svg: ctx.poly(pq, tone(RISER, nm[f][0], nm[f][1], 0), null, 0),
                     depth: H.depthOf(pq) + 1.5 });
      }
      for (var i = 0; i < 20; i++) {
        var a0 = i / 20 * Math.PI * 2, a1 = (i + 1.08) / 20 * Math.PI * 2;
        var q = [pt(cu + Math.cos(a0) * R, cv, ZG + 2 + R + Math.sin(a0) * R),
                 pt(cu + Math.cos(a1) * R, cv, ZG + 2 + R + Math.sin(a1) * R),
                 pt(cu + Math.cos(a1) * (R - BW), cv, ZG + 2 + R + Math.sin(a1) * (R - BW)),
                 pt(cu + Math.cos(a0) * (R - BW), cv, ZG + 2 + R + Math.sin(a0) * (R - BW))];
        items.push({ svg: ctx.poly(q, tone(BRONZ, 0, nrm, 0.25), null, 0),
                     depth: H.depthOf(q) + 2.4 });
      }
      items.push(H.shadow(ctx, [W(cu-7,cv-2), W(cu+7,cv-2), W(cu+7,cv+2), W(cu-7,cv+2)], 16 * FT));
    })();

    /* ---------- Delta Solar, Alejandro Otero, 1977 -----------------------
       Stainless steel, 27 ft by 40 ft, on the west lawn toward 7th Street, in
       what was a shallow basin. The 27 by 40 is published; the blade lattice
       is indicative and the basin's size is an assumption. */
    (function () {
      var cu = -446, cv = -55, WD = 40, HTs = 27;
      flat(rect(cu - 36, cv - 27, cu + 36, cv + 27), 0.6, "#9fb2b6", -1e9 + 3);
      flat(rect(cu - 24, cv - 16, cu + 24, cv + 16), 1.4, "#5f6467", -1e9 + 4);
      var nrm = ctx.faceVisible(0, 1) ? 1 : -1;
      for (var i = 0; i < 5; i++) {
        var u = cu - WD / 2 + WD * (i + 0.5) / 5;
        var lean = (i - 2) * 2.6;
        var q = [pt(u - 2.6, cv, 1.4), pt(u + 2.6, cv, 1.4),
                 pt(u + 2.6 + lean, cv, 1.4 + HTs), pt(u - 2.6 + lean, cv, 1.4 + HTs)];
        items.push({ svg: ctx.poly(q, tone(STEEL, 0, nrm, 0.5), null, 0),
                     depth: H.depthOf(q) + 2.0 });
      }
      var zc = 1.4 + HTs * 0.52;
      var cq = [pt(cu - WD/2 - 2, cv, zc), pt(cu + WD/2 + 2, cv, zc),
                pt(cu + WD/2 + 2, cv, zc + 2.4), pt(cu - WD/2 - 2, cv, zc + 2.4)];
      items.push({ svg: ctx.poly(cq, tone(STEEL, 0, nrm, 0.75), null, 0), depth: H.depthOf(cq) + 2.4 });
      items.push(H.shadow(ctx, [W(cu-20,cv-3), W(cu+20,cv-3), W(cu+20,cv+3), W(cu-20,cv+3)], HTs * FT));
    })();

    return items;
  };
})();
