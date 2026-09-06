/* dc-form-indian.js: the National Museum of the American Indian, on the Mall.
 *
 * Built to MODEL_STANDARD.md. What stood here before was the generic "block"
 * form: an 80 by 40 metre box with four flat sides. The one fact everybody
 * publishes about this building is that it has no straight edge anywhere on
 * it, so a box is not a rough version of this museum, it is the opposite of
 * it. STYLES.md has no entry for the idiom; the style is named at the bottom
 * of this header and its tells are listed there, because a model may not be
 * drawn in a style nobody has written down.
 *
 * WHICH BUILDING. The curvilinear Kasota limestone building by Douglas
 * Cardinal (Blackfoot), opened 21 September 2004, east of the Air and Space
 * Museum, facing the Capitol. NOT the George Gustav Heye Center, which
 * carries the same museum name and is Cass Gilbert's 1907 Beaux-Arts Custom
 * House in Lower Manhattan. Any source quoting marble columns, a 1907 date,
 * 450,000 sq ft or a $7 million cost is describing the other building.
 *
 * ============================ RESEARCH ============================
 * Every number below carries the URL it was read from. Numbers that are not
 * published are in the NAMED GAPS list and are never quietly filled.
 *
 * ---- THE FOUR NUMBERS THAT REBUILT THIS MODEL THIS RUN -----------
 * PUBLISHED (Smithsonian Office of Public Affairs, "Mall Museum Design Facts",
 * March 2000, https://web.archive.org/web/20020414164851/http://www.nmai.si.edu/
 * pressroom/releases/mall_museum_design_facts_release.htm) and INDEPENDENTLY
 * REPEATED seven months later in a separate release (October 2000,
 * https://web.archive.org/web/20010312011645/http://www.nmai.si.edu/pressroom/
 * releases/mall_museum_facts.html):
 *   1. "The building is 99 feet high, and the top of the dome is
 *      approximately 120 feet high."   <- PARA = 99, TOP = 120 in this file.
 *      The dome therefore stands 21 ft over the parapet, DERIVED as 120 - 99,
 *      not assumed. The previous version of this file called overall height a
 *      gap and scaled to the OSM lidar tag height=42 m = 137.8 ft. That is
 *      17.8 ft above the owner's own published dome top and above the 40 m /
 *      130 ft cap the Smithsonian's own conservation volume says the building
 *      stays within, so the lidar figure is now read as roof plant and is
 *      recorded in the gaps rather than drawn.
 *   2. "The cantilever on the east end of the building projects approximately
 *      50 feet at its greatest point. The cantilever is supported by steel
 *      framing."   <- CANT = 50 in this file. The previous version drew this
 *      as a 12 ft RECESS: the sign was inverted and the size was out by four
 *      times, on the one feature every visitor names.
 *   3. "The centerpoint of the Potomac and the front doors of the building
 *      align perfectly with the U.S. Capitol."  The 14.81 degree bearing this
 *      file derives from the traced plan is therefore a CHECK on a published
 *      claim, not an assumption.
 *   4. "The building covers more than a quarter of the site" (about 46,000 sq
 *      ft of 4.25 acres) against a traced footprint of 58,423 sq ft, 31.5
 *      percent. The 12,000 sq ft difference and the 50 ft cantilever are the
 *      same fact seen twice: THE TRACE IS THE OVERHANG ENVELOPE, NOT THE WALL
 *      LINE. That reading is what lets this file draw a real 50 ft oversail
 *      without pushing anything outside the measured outline, and it is why
 *      the wall face is now set 4.0 ft inside the trace with the balconies,
 *      the coping and the roughback base reaching back out to it.
 *
 * ---- THE STONE, from the Smithsonian's own peer-reviewed volume ----
 * PUBLISHED ("Conservation of the Exterior of the National Museum of the
 * American Indian Building", Smithsonian Contributions to Museum Conservation
 * 6, 2017, read this run at https://smithsonian.figshare.com/articles/
 * Conservation_of_the_Exterior_of_the_National_Museum_of_the_American_Indian_
 * Building/9761738 - the previous run recorded this as unreachable):
 *   - "Sawed to four course heights (15, 20, 30, and 40 cm) and a range of
 *     widths, blocks were arranged irregularly on the facade to create the
 *     appearance of natural stone formations."  0.49, 0.66, 0.98 and 1.31 ft.
 *     THE REAL MODULE IS UNDER SIXTEEN INCHES. The previous version drew six
 *     16 ft strata stepping in and out by up to 5 ft, which is a hundred times
 *     too coarse and read as a parking structure. The coursing here is now a
 *     continuous field at the published four heights.
 *   - "In all other locations, capstones project 3.8 to 5 cm over the NMAI
 *     facade."  0.125 to 0.164 ft. THAT IS THE ONLY PROJECTION ON THE WALL.
 *     Every step in this model's coursing is now 0.15 ft, inside that range.
 *   - THREE finishes, and the old rough-low-to-smooth-high reading was half
 *     wrong: SPLITFACE curved blocks over the majority of the facade;
 *     ROUGHBACK at the base only, face bedded, so "their surfaces ... are
 *     mostly planar, in contrast to the curved splitface blocks. Thus,
 *     roughback areas are characterized by ledges and faceting on the
 *     otherwise curved surfaces of the building"; and TAPESTRY, sawn then
 *     sandblasted, "used for sills, copings, and window surrounds" ONLY.
 *     Tapestry is trim, not a smooth upper zone.
 *   - TWO Kasota varieties, not one: Northern Buff splitface and tapestry over
 *     GOLDEN BUFF roughback at the base, the latter quarry weathered "in rusty
 *     hues ranging from yellow to red to dark brown, and ... highly textured by
 *     trace fossils". The style tell "one stone, one colour, all over" that
 *     this header carried is REFUTED by the primary source and is corrected
 *     below. Golden Sand limestone from Mexico is used where the building
 *     meets water and American Mist granite paves the wall's foot.
 *   - "The NMAI building is distinguished by many gently curved 'balconies',
 *     which protrude from the building but are not accessible ... Most
 *     balconies are protected from rainwater by overhangs with the same
 *     curvature." Seven are enumerated as unprotected: "Two of these balconies
 *     are on the south facade ...; two are on the west facade ..., and three
 *     are on the north facade." Seven are drawn.
 *   - "the architect designed a LOWER STEPPED dome for the Potomac with an
 *     opening at its center", "precast glass-fiber-reinforced concrete dome
 *     crowning the nearly 40-m-diameter Potomac space". Stepped, not smooth,
 *     and deliberately lower than the National Gallery's across the Mall.
 *   - "an innovative adjustable radius formwork ... forming concave or convex
 *     walls with radii as tight as about 3 m." A published BOUND on the plan:
 *     nothing is straight and nothing is tighter than about 10 ft.
 *   - "Since it had been decided that the main entrance would face east, it
 *     would therefore face the U.S. Capitol." East first, Capitol second.
 *
 * ---- THE REST, carried forward and re-checked ----
 * PUBLISHED (Smithsonian Architecture Fact Sheet, 2014,
 * https://americanindian.si.edu/sites/1/files/pdf/press_releases/NMAI-Architecture-Release-2014.pdf):
 *   - "five-story, 250,000-square foot, curvilinear building"
 *   - "the 120-foot high Potomac space devoted to contemporary Native
 *     performances"
 *   - "4.25-acre site"; "an exterior cladding of Kasota dolomitic limestone
 *     from Minnesota, giving the building the appearance of a stratified stone
 *     mass that has been carved by wind and water"
 *   - "Forty large rocks and boulders, known as grandfather rocks"
 * PUBLISHED (Smithsonian media fact sheet,
 * https://www.si.edu/newsdesk/factsheets/national-museum-american-indian-national-mall):
 *   - "an entrance facing east toward the morning sun, a window with EIGHT
 *     PRISMS and a 120-foot-high space called the Potomac Atrium". ONE window
 *     containing eight prisms. Smithsonian magazine puts it exactly: "eight
 *     large prisms inside a tall rectangular window in the atrium", "the
 *     south-facing window of the Potomac Atrium"
 *     (https://www.smithsonianmag.com/smithsonian-institution/summer-solstice-shines-light-at-the-american-indian-museum-128849606/).
 *     The previous version drew eight separate panels spread over 90 ft of
 *     south wall, which is a different building at map scale.
 * PUBLISHED (Severud Associates, https://www.severud.com/icons/the-national-mall/):
 *   - "Interconnected steel trusses ... enable the east end of the building to
 *     cantilever dramatically"; "The cantilever is capped by a steel dome with
 *     an oculus open to the heavens"
 * PUBLISHED (Smithsonian Gardens, gardens.si.edu/gardens/native-landscape-nmai):
 *   - upland hardwood forest 24,000 sq ft NORTH; wetlands 6,000 sq ft EAST;
 *     cropland 5,200 sq ft SOUTHEAST; meadow 5,500 sq ft SOUTHWEST, "on both
 *     sides of the south entrance", with two American elms
 *   - "Forty additional boulders from Canada, called Grandfather Rocks, are
 *     scattered throughout the landscape", ADDITIONAL to the four cardinal
 *     markers, which "lie along the east-west and north-south axes of the
 *     building": Hawaii west, Canada north, Maryland east, Chile south
 * PUBLISHED (the museum's own events page,
 * https://americanindian.si.edu/support/specialevents/washington):
 *   - "the Senator Daniel K. Inouye Memorial Terrace is an outdoor space" with
 *     views of the Capitol and the Washington Monument; the conservation
 *     volume places it on the NORTH facade at the fifth floor with a parapet
 *     whose capstones slope 6 degrees toward the wall. THE ROOF IS NOT ONE
 *     UNBROKEN PLANE and the previous version's single flat lid was a positive
 *     claim that a published feature contradicts.
 *   - "Guests' entry experience begins with a cascading water feature and
 *     Native plant life leading to the Welcome Plaza." Johnpaul Jones, quoted
 *     in the conservation volume, gives the route: the water appears to flow
 *     "out of the rock layers of the stone building" at the NORTHWEST corner,
 *     "cascading to a lower pool, and then flowing along the north side of
 *     NMAI to the east end of the building where it magically flows into the
 *     east site wetland area". The previous version put an isolated strip of
 *     water at the east and nothing at the northwest.
 * PUBLISHED (SAH Archipedia, https://sah-archipedia.org/buildings/DC-02-999-0013):
 *   - "The shape of the museum was also significantly determined by the
 *     4.25-acre TRAPEZOIDAL site." The site is drawn as a trapezoid; the
 *     previous version's rectangle was contradicted, not merely unpublished.
 * PUBLISHED (Butzer Architects, design architect,
 * http://butzerarchitects.com/national-native-american-veterans-memorial, and
 * NCPC, https://www.ncpc.gov/news/item/160/):
 *   - the National Native American Veterans Memorial, opened 11 Nov 2020, is
 *     "Set at the boundary between the NMAI Upland Hardwood Forest and Lowland
 *     Freshwater Wetland"; NCPC publishes "a 50-foot plaza with an elevated
 *     stainless-steel circle supported by a carved stone drum". It is the most
 *     conspicuous thing added to this site since opening and was absent.
 * PUBLISHED (The Globe and Mail, "Douglas Cardinal's dream",
 * https://www.theglobeandmail.com/arts/douglas-cardinals-dream/article20435849/):
 *   - "the windows cut like caves in the stone"; the east glazing is "badly
 *     detailed with vertical mullions that Cardinal had avoided", so the
 *     mullions are conspicuous and are the ONLY published glazing detail
 *   - the as-built cantilever is about half what Cardinal wanted, "squat and
 *     compressed". That refuses a HEROIC cantilever. It does not refuse the
 *     published 50 ft, which is the design that was actually let to contract.
 *
 * CORRECTION TO THIS FILE'S OWN PREVIOUS HEADER: the "boulder in a rushing
 * river" sentence was attributed here to the Vetter Stone / stoneworld.com
 * article. That article was read in full this run and does not contain it; it
 * traces to a secondary architecture site. The grading it describes is also
 * not what the primary source describes, so the citation is withdrawn and the
 * elevation is now built on the conservation volume's roughback / splitface /
 * tapestry account instead. Vetter Stone IS the source for "over 2,400 cubic
 * feet of cut stone, and over 25,000 cubic feet of split-faced stone" and for
 * base blocks "as long as 1,500 mm and as high as 1,000 mm"
 * (https://www.stoneworld.com/articles/83351-natural-stone-reflects-indian-culture).
 *
 * DISAGREEING FIGURES, recorded rather than reconciled. Floor area is
 * published four ways: 250,000 sq ft (Smithsonian 2007 and 2014), 260,000
 * (Smithsonian 2000 and 2002, and SmithGroup), 441,000 (si.edu newsdesk).
 * Floor count is published as five stories everywhere except the Smithsonian's
 * own conservation volume, which says "six plus two mezzanines". THE POTOMAC'S
 * DIAMETER IS PUBLISHED FOUR INCOMPATIBLE WAYS: 122 ft (Smithsonian, March
 * 2000), 99 ft (Smithsonian, October 2000), 120 ft (the museum's 2004
 * architecture page), and "nearly 40 m" = 131 ft (the conservation volume).
 * This model draws the rotunda on the MEASURED plan, whose east prow arc is
 * about 94 ft across, because a 131 ft dome cannot stand on a 95 ft wide prow
 * and the picture would show it. The 99 ft published figure agrees with the
 * measurement to 5 percent. Recorded, not resolved.
 *
 * ======================== PLAN, DERIVED ===========================
 * No architect publishes this building's length or width, so the plan is
 * TRACED. OSM way 66418605, source=dcgis, dcgis:captureyear 20050405,
 * building:levels=5, height=42: https://www.openstreetmap.org/way/66418605
 * 119 vertices, carried into the PLAN array below verbatim, in feet, in the
 * frame described under FRAME. Everything else was computed from them:
 *   - overall extents 376.1 ft east-west by 232.8 ft north-south
 *   - footprint area by shoelace 58,423 sq ft = 1.34 acres
 *   - THE EAST PROW: a least-squares circle through vertices 22 to 36 lands at
 *     u 153.8, v 0.0 with radius 46.9 ft, RMS residual 5.0 ft. That gives this
 *     model a MEASURED rotunda centre and therefore a real origin for the four
 *     cardinal stones and the dome.
 *   - THE WEST END: circle through vertices 78 to 96, radius 122.0 ft, RMS 6.2.
 *   - THE NORTH FACADE: circle through vertices 0 to 20, radius 727 ft, RMS 3.0.
 *   - THE ENTRANCE BEARING: from the derived rotunda centre to the Capitol's
 *     own dc-3d.js coordinate is 14.81 degrees north of east.
 * THE TRACE IS REBUILT AS AN ANALYTIC CURVE, and that replaces the smoothing
 * filter the previous version used. A 2005 digitizer's polyline is a chain of
 * chords: its RMS residual against its own fitted circles is 3.0 to 6.2 ft
 * while its median segment is 8.3 ft, so the vertex noise is the same size as
 * the segments. Two passes of a 1-4-6-4-1 binomial filter were tried first and
 * DID NOT DO THE JOB: measured this run, the filtered curve still carried a
 * 41.9 degree turn at (-158, 70), a visible CORNER at the northwest, and an
 * eleven-segment dead-straight run along the north facade. A moving average
 * cannot remove a corner it is not wide enough to see, and widening it shrinks
 * the building. PLAN is now a TRUNCATED FOURIER DESCRIPTOR: 512 samples by arc
 * length, transformed, rebuilt from harmonics -14 to +14 at 132 even points of
 * about 8.0 ft. Such a curve has no corner and no straight segment ANYWHERE by
 * construction rather than by filtering, and its curvature is bounded.
 * MEASURED, perpendicular distance from each output point to the ORIGINAL
 * traced polyline, which is the number that matters because a point sliding
 * ALONG the wall changes no shape: median 0.97 ft, 90th percentile 2.44 ft,
 * maximum 3.67 ft; enclosed area 58,367 sq ft against 58,429, a tenth of one
 * percent. Every one of those is inside the trace's own 3.0 to 6.2 ft RMS
 * residual against its own fitted circles, so this is not a different
 * building, it is the same measurement read at its real precision. Sharpest
 * turn falls 41.9 to 26.3 degrees and moves to the southwest where the trace
 * really does turn; longest straight run falls from 11 segments to 8; smallest
 * radius of curvature 12.9 ft against the published "radii as tight as about
 * 3 m". Harmonic counts 8, 10, 12, 16 and 20 were all measured; 14 is the
 * lowest that holds the 46.9 ft prow arc inside the trace's own residual.
 * THE WEST END, and this one is an assumption with a bound rather than a
 * measurement. The trace records that wall as straight to within 3.6 ft over
 * 190 ft, which contradicts the one fact every source publishes. Least-squares
 * circles through it are useless as evidence: fitted over raw vertices 78-96,
 * 80-102, 82-100 and 84-102 this run they return radii of 121.8, 176.1, 99.4
 * and 215.9 ft with centres on BOTH SIDES of the wall, so the trace cannot say
 * whether that end bows in or out, let alone by how much. The model bows it
 * OUT - the sign the published curvilinear massing demands - by WBULGE = 6.0
 * ft on a raised sine taper, because 6.23 ft is the RMS residual of that run's
 * own best circle and therefore the largest displacement the measurement
 * cannot refute. Implied radius about 750 ft.
 *
 * ========================= NAMED GAPS =============================
 * Guessed nowhere. Every item below is either drawn from an assumption stated
 * on its own line in the code, or not drawn at all.
 *   - ROOF FORM, and this gap statement has been re-read rather than repeated.
 *     No source gives a pitch, a terracing dimension, plant or a skylight but
 *     the dome - not either Smithsonian fact sheet, the two 2000 releases, the
 *     museum's 2004 architecture page, Severud, SmithGroup, Douglas Cardinal
 *     Architect, SAH Archipedia, Hoffmann Architects or the conservation
 *     volume. But the previous version drew a single flat 50,000 sq ft lid and
 *     called that flatness "a gap rather than a claim", and that was not true:
 *     the SAME header cites a published feature the flat lid contradicts. The
 *     Senator Daniel K. Inouye Memorial Terrace is published as an OUTDOOR
 *     SPACE on the north facade at the FIFTH FLOOR, behind a parapet whose
 *     capstones slope 6 degrees toward the wall. An outdoor space at the fifth
 *     floor behind a parapet IS a setback: the fifth storey stands back from
 *     the wall below it and the roof of the fourth is walked on. Drawing that
 *     as a lone rectangular notch bitten out of one flat plane asserted that
 *     the rest of the roof is NOT like that, which is a positive claim about
 *     an unpublished thing, and it produced four defects at once: a
 *     featureless plane, a see-through hole at the notch's mouth, a grey shelf
 *     where the notch's floor out-sorted the wall in front of it, and a
 *     hard-cornered slab on a building with no right angle in it.
 *     SO, SEPARATED BY WARRANT: published, a fifth-floor outdoor terrace on
 *     the north facade behind a 6-degree-sloped coping. DERIVED, its level at
 *     PARA - STOREY = 79.2 ft, one of the five published storeys down from the
 *     published 99. ASSUMED, that the same setback runs round the rest of the
 *     plan and releases to nothing over the rotunda whose full-height drum the
 *     published dome caps. The roofline therefore SWEEPS, 99 ft at the east
 *     prow falling to 82.7 along the west and north. The sweep is the
 *     assumption; the step is not.
 *   - WHETHER THE FOOTPRINT NARROWS AS IT RISES. It now does, by SETB = 26 ft
 *     at the top storey, and that number is unpublished and named as such
 *     below. What is NOT an assumption is the direction: a published
 *     fifth-floor terrace behind a parapet cannot exist without the storey
 *     above it standing back. The published cantilever runs the other way and
 *     is drawn the other way, at the base, where it is published to be.
 *   - CANTILEVER GEOMETRY beyond the 50 ft projection: the soffit height, the
 *     width of the span and where along the prow the greatest point falls are
 *     all unpublished. The soffit is drawn at 39.6 ft, DERIVED as two of the
 *     five published storeys at 99/5 = 19.8 ft each. The recess is now ONE
 *     quadratic Bezier across the opening rather than a per-segment pushback:
 *     the old construction slid each segment back by its own taper weight
 *     along the Capitol bearing, and MEASURED THIS RUN that produced turn
 *     angles of -42.3, +50.7, +49.9 and -107.1 degrees between adjacent
 *     segments, which is a folded storefront and not a cave. A quadratic is
 *     smooth everywhere between its ends, so no resolution or taper choice can
 *     crease it, and the only tangent break left is at the two jambs where a
 *     cave is supposed to have one. Its deepest point is CANT back from the
 *     arc's own apex, which is what "at its greatest point" says: measured
 *     from the outermost stone, not from the chord across the opening. The
 *     50 ft is published DESIGN INTENT from two pre-construction releases; no
 *     post-2004 source restates it as built.
 *   - DOME rise profile, step count, oculus diameter and finish. Only "lower
 *     stepped dome ... with an opening at its center" and "precast
 *     glass-fiber-reinforced concrete" are published. The rise IS derived,
 *     120 - 99 = 21 ft. THE SPRINGING RADIUS IS NOW MEASURED rather than
 *     chosen: it is the distance from the DERIVED rotunda centre to the
 *     NEAREST point of the deck the dome stands on, less a 3 ft margin. The
 *     previous version set it to 43 ft against a prow wall standing about 41
 *     ft from that centre, so the dome oversailed its own support and hung out
 *     over the lawn. All four published diameters are larger than what the
 *     measured prow can carry; that conflict is recorded above and the model
 *     draws the support. The six steps and the 9 ft oculus are assumptions.
 *   - COURSE ARRANGEMENT. The four course heights and "arranged irregularly"
 *     are published; which block sits where is not. The field here accumulates
 *     the four published heights by a fixed sequence, which reaches about
 *     ninety courses over 99 ft. Drawing all ninety on 132 segments is twelve
 *     thousand faces, so every seventh course boundary is scored at its true
 *     accumulated height and the rest are carried by tone.
 *   - ROUGHBACK BASE HEIGHT: not published as a dimension. Bounded only by
 *     "at ground level", the tour-de-force block being in the third course,
 *     and blocks projecting a few inches "about 2 meters (6 or 7 feet) above
 *     ground level". Drawn 6.5 ft, an assumption inside those bounds. Its
 *     extent around the plan is also a gap; the volume says roughback is
 *     "mainly on the south and west facades" and never says it stops.
 *   - BALCONY POSITIONS. Seven unprotected balconies are published and counted
 *     by facade, two south, two west, three north. Their positions along each
 *     facade, their projections and their levels are not published. Seven are
 *     drawn on the published facades at assumed stations.
 *   - INOUYE TERRACE size: published as a fifth-floor outdoor space on the
 *     north facade and never dimensioned. Its LEVEL is derived, not assumed.
 *     It is drawn as the PAVED stretch of the continuous setback terrace, over
 *     an assumed run of eleven segments of the north wall; the terrace it sits
 *     in is the assumption described under ROOF FORM, its paving is not a
 *     published finish, and its position is.
 *   - PRISM WINDOW SIZE. "A tall rectangular window" is the whole publication;
 *     no height, width or sill level anywhere, including Charles Ross's own
 *     pages. Its POSITION is published, the south wall of the Potomac Atrium.
 *     One window is drawn there at an assumed size with eight prisms in it.
 *   - GLAZING elsewhere: no published area, bay count or mullion spacing. Only
 *     the published east entrance, with its published vertical mullions, and
 *     the published prism window are drawn. No window grid is invented, so
 *     most of this envelope is blank stone, which is what photographs show.
 *     THE MULLION COUNT IS NOT A CLAIM. At one per two segments and 0.56 ft
 *     wide they drew fourteen identical square teeth across the opening and
 *     read as a zipper; they are now thinner and one per three segments, which
 *     is a drawing decision about legibility and not a statement about the
 *     building. That they are vertical, and conspicuous, is the published
 *     part.
 *   - SITE OUTLINE: published as a 4.25-acre TRAPEZOID and never dimensioned.
 *     Drawn as a trapezoid 470 ft across the north, 530 across the south and
 *     370 deep, which is 185,000 sq ft, the published acreage to 0.1 percent.
 *   - HABITAT OUTLINES: the four areas and their compass sides are published,
 *     the shapes are not. Drawn as ellipses of the published areas.
 *   - WATER: the ROUTE is published in the designer's own words and is drawn.
 *     No width, depth, drop or pool size is published anywhere.
 *   - GRANDFATHER ROCKS: forty is published, sizes and positions are not.
 *     Granicor states sixty boulders of Peribonka granite were supplied
 *     against the Smithsonian's forty placed; the other twenty are
 *     unaccounted for and forty are drawn.
 *   - CARDINAL STONES: the radial rule and the 6,000 lb weight are published,
 *     the distances out are not. Drawn at equal radius on the derived rotunda
 *     centre's true N, S, E and W radials. The previous version drew them at
 *     four different distances, the west one 4.7 times the east, and its
 *     header said they were at the site edge; none of that was true.
 *   - VETERANS MEMORIAL: the 50 ft plaza and the forest/wetland boundary
 *     position are published. The steel ring's own diameter is not: the
 *     museum's memorial page gives no dimensions and the widely repeated
 *     12 ft figure has no first-party source. The plaza is drawn published,
 *     the ring at a stated assumption.
 *   - OVERALL HEIGHT, the remaining conflict: 99 ft and 120 ft are published
 *     twice by the owner and are what this model uses; the OSM/dcgis lidar tag
 *     height=42 m = 137.8 ft is 17.8 ft above the published dome top and above
 *     the 40 m cap the conservation volume says the building stays within.
 *     Rooftop plant is the likely explanation and nothing published says so.
 *   - BELOW GRADE LEVELS: "five-story" is above ground; nothing found below.
 *
 * ============ EVERY ASSUMPTION, WITH ITS CONSTANT ================
 * The previous header described geometry the code did not draw: it called the
 * cantilever "a 12 ft recess" where the constant was -13 and the drawn recess
 * varied between 8.5 and 12 ft, and it said the four cardinal stones stood at
 * the site edge on true radials when they stood at 105, 120, 78 and 366 ft,
 * none at the edge. A header that describes different geometry from the code
 * is worse than no header, so every assumed number now appears here BY ITS
 * CONSTANT NAME and can be read against the source in one grep.
 *   WALLD  -5.5 ft   the wall face inside the traced envelope
 *   FACED  -0.5 ft   what reaches back out to it: coping, balconies, base
 *   BASE_Z  6.5 ft   the roughback base's height
 *   DECK_Z  PARA-3.5 the roof deck, i.e. a 3.5 ft parapet upstand
 *   CAVE_Z  2*STOREY DERIVED, not assumed: two of the five published storeys
 *   ENT_HALF 40 deg  the entrance arc's half angle about the derived bearing
 *   DOME_R  40 ft    the prow arc less an assumed 7 ft of wall; the dome
 *                    springs at DOME_R + 3.0
 *   DOME_STEPS 6     the published dome is "stepped"; the count is assumed
 *   OCU_R   9 ft     the oculus is published as an opening, never dimensioned
 *   tn      11 segs  the Inouye Terrace's run along the north wall, and its
 *                    34 ft depth back into the mass
 *   balcony stations: seven, on the published facades, at assumed positions;
 *                    parapet 3.4 ft, overhang 13.0 ft above the balcony floor
 *   prism window     5 segments wide, z 34 to 76; position published, size not
 *   memorial ring    6.0 ft radius on a 2.2 ft drum; the 50 ft plaza is published
 *   boulders         2.6 to 5.0 ft across, 1.8 to 3.6 ft tall, scattered by a
 *                    fixed sequence seeded on the opening date
 *   cardinal stones  3.4 ft across, each walked out along its own true radial
 *                    to the first point clear of the plan by 20 ft: ONE rule
 *                    applied four times rather than four picked distances
 *   trees            16 in the published forest, plus the two published elms
 *
 * PLACE HEIGHT CORRECTION OWED, and not made here because this run may touch
 * no shared file: dc-3d.js carries { k: "indian", ... h: 30, form: "block" }.
 * 30 m is 98.4 ft to the DOME APEX, against a published 120 ft, so in the Mall
 * scene this museum stands 18 percent short beside its neighbours. It should
 * read h: 36.6. The previous version of this header asked for h: 42, which
 * would have replaced one error with a larger one in the other direction.
 * form: "block" is also wrong for a building whose defining fact is that it
 * has no straight edge; with this file registered the field is unused for
 * "indian", but it should not say "block".
 *
 * ===================== THE STYLE, NAMED ===========================
 * "The wind-carved cliff": organic curvilinear, Douglas Cardinal's
 * expressionist idiom. STYLES.md has no entry for it and this run may not edit
 * that file, so the tells are listed here and the entry is OWED:
 *   - THERE IS NO STRAIGHT LINE AND NO CORNER ABOVE THE BASE. Every plan edge
 *     is an arc, the radius changes continuously, and the published formwork
 *     bound is "radii as tight as about 3 m". A visible flat facet in
 *     silhouette is a failure - EXCEPT at the base, where it is correct: the
 *     roughback blocks are face bedded, so "roughback areas are characterized
 *     by ledges and faceting on the otherwise curved surfaces". The rule
 *     inverts in the bottom two metres and nowhere else.
 *   - THE MASS IS ERODED, NOT ASSEMBLED, but the grading is NOT rough-low to
 *     smooth-high. It is rough at the base, splitface everywhere above, and
 *     smooth only at sills, copings and window surrounds.
 *   - THE COURSING IS FINE AND IRREGULAR. Four sawn heights under sixteen
 *     inches, laid to look like natural bedding, joints deliberately staggered
 *     rather than continuous ground to roof. No cornice, no string course, no
 *     water table, and the only projection on the whole wall is a capstone
 *     oversailing an inch and a half.
 *   - THE MASS OVERHANGS at the entrance. Masonry gets narrower as it rises;
 *     this hangs fifty feet out over your head.
 *   - THE WALL IS INTERRUPTED BY CURVED BALCONIES with matching curved
 *     overhangs above them. That is where the eroded-ledge reading lives.
 *   - TWO KASOTA VARIETIES, and three more stones at the ground: Golden Buff
 *     roughback at the base, Northern Buff above, Golden Sand limestone where
 *     the wall meets water, American Mist granite paving at its foot.
 *   - THE ORIENTATION IS COSMOLOGICAL, NOT AXIAL. East to the sunrise first
 *     and the Capitol second, prisms to true south, the dome open to the sky,
 *     four stones on true radials.
 *   - THE GROUND IS PART OF THE BUILDING. Three quarters of the site is not
 *     wall, by the Smithsonian's own arithmetic.
 *   - WRONG IF it is symmetrical, or has a facade with bays, or a front door
 *     on a centre line with anything ranked either side of it.
 *
 * ============================ FRAME ===============================
 * u runs east, v runs north, z up, all in FEET, origin at the dc-3d.js place
 * coordinate 38.88830, -77.01660. The derived rotunda centre is at u 153.8,
 * v 0.0. FT converts feet to host units so the published 120 ft dome top lands
 * exactly on p.h.
 *
 * ============================ PAINT ===============================
 * Four traps, three of them found by looking at the render rather than by
 * arithmetic.
 *   1. THE ROOF is one 50,000 sq ft plane. depthOf returns a quad's FARTHEST
 *      corner, so a slab that size sorts behind everything and the previous
 *      version made that worse with a constant -5000 bias: nineteen tree
 *      canopies, a trunk and a dozen boulders standing on the lawn BEHIND the
 *      museum painted straight through a plane 94 ft in the air. The cure is
 *      the opposite of a backwards bias. The roof sorts on its NEAREST corner,
 *      so it beats the ground behind it, and the two things that genuinely
 *      stand on it, the terrace and the dome, are pushed forward explicitly.
 *   2. THE BUILDING MUST NOT BE HOLLOW. Far-side walls are culled, so with
 *      only a deck the eye met sky across the top of the mass and the museum
 *      read as a quarry. The parapet's INNER face is drawn on the far side,
 *      culled by the inverted normal, so the eye meets stone.
 *   3. THE FAR SIDE'S LEDGES. A single traced edge's normal is noise at this
 *      resolution, so the per-segment cull chattered and let isolated far-side
 *      panels through over the roof. Visibility is now taken from a SMOOTHED
 *      normal over five vertices and then run-length filtered: no visible run
 *      shorter than four segments survives and no hidden run shorter than four
 *      is believed.
 *   4. THE ENTRANCE CAVE is a hole, and a hole is only a hole from the side
 *      you can see into. The whole assembly, glass, mullions, soffit and
 *      jambs, is gated on the derived entrance bearing facing the camera. When
 *      it is gated off the same segments are drawn as ordinary stone, so no
 *      hole is ever left in the wall.
 *   5. ONCE THE DECK HAS AN EXPLICIT DEPTH, EVERYTHING TOUCHING IT NEEDS ONE
 *      TOO, AND THE SIGN IS NOT OBVIOUS. The parapet's capstone must beat the
 *      deck or the deck paints over it and a rim drawn on every segment shows
 *      on none. The terrace's back wall must LOSE to the deck, or all
 *      nineteen feet of it paints across the roof and reads as a shed
 *      standing on it. Both were drawn correctly and both looked wrong, in
 *      opposite directions, for the same reason.
 *   6. AND EVERY ONE OF THEM STILL NEEDS ITS CULL. An explicit depth in front
 *      of the deck defeats the painter's sort, so an ungated far-side face
 *      wins every argument: the terrace's north parapet, drawn unculled,
 *      appeared from the south as a tan box on the roof.
 * Seams: abutting quads round apart under toFixed(1). Every band and strip is
 * stroked in its own fill colour, and horizontal strips overrun their
 * neighbour slightly. A MITRED offset polygon folds where the offset exceeds
 * the local radius: poly() is clean at 0.5 and 5.5 ft and self-intersects in
 * three places at 14.5, which drew a serrated tear along the roof's south-east
 * edge, so every offset deeper than the wall face slides each point down its
 * own smoothed normal instead.
 */
(function () {
  var H = window.DC3D.helpers;
  window.DC_FORMS = window.DC_FORMS || {};
  window.DC_FORMS['indian'] = function (ctx, p, s, VE) {
    var P = ctx.project, items = [];

    /* the traced plan, OSM way 66418605, feet, u east and v north from the
       dc-3d.js place coordinate. 119 vertices, clockwise, verbatim. */
    var RAW = [
      -103.5,65.5, -94.1,67.2, -83.4,65.6, -77.5,62.6, -67.6,66.4, -56.0,67.0,
      -48.3,64.8, -36.8,67.7, -25.2,67.5, -15.3,65.0, -5.3,68.3, 7.2,67.7,
      17.8,64.4, 33.3,67.6, 46.7,69.9, 64.1,69.4, 78.1,68.6, 117.9,66.2,
      124.2,65.8, 130.5,64.9, 136.5,64.1, 147.2,59.0, 157.4,53.3, 159.1,52.4,
      169.7,43.9, 180.4,30.0, 182.7,26.1, 190.8,12.7, 196.4,-0.8, 199.1,-13.6,
      199.2,-21.6, 198.4,-25.6, 196.7,-27.9, 195.8,-29.1, 191.7,-31.7,
      176.4,-37.2, 158.1,-41.8, 150.2,-44.2, 147.7,-47.5, 140.3,-51.2,
      132.2,-52.7, 123.7,-52.6, 112.3,-52.3, 98.9,-55.6, 91.9,-62.2,
      83.3,-70.0, 73.9,-75.3, 68.3,-77.2, 60.7,-78.4, 50.4,-79.0, 38.7,-78.9,
      29.6,-81.1, 23.3,-84.4, 20.8,-87.7, 15.3,-92.2, 9.8,-96.7, 2.8,-99.8,
      -6.3,-101.1, -13.5,-102.3, -17.7,-104.0, -21.9,-105.7, -31.9,-110.3,
      -38.3,-114.0, -41.9,-116.1, -48.4,-119.4, -54.4,-120.6, -59.3,-120.9,
      -66.3,-121.4, -75.8,-124.0, -84.1,-129.0, -90.5,-133.4, -97.7,-136.5,
      -106.8,-138.9, -122.8,-142.2, -138.4,-147.5, -146.8,-150.5, -153.8,-153.9,
      -159.6,-157.6, -164.5,-158.5, -170.0,-157.6, -174.2,-154.5, -176.7,-149.5,
      -176.9,-142.7, -176.1,-134.4, -174.1,-125.0, -173.3,-112.6, -174.0,-104.1,
      -175.8,-94.5, -176.9,-85.1, -176.4,-75.9, -173.6,-67.5, -173.8,-58.6,
      -176.0,-52.7, -176.6,-43.5, -176.0,-36.2, -174.5,-30.7, -175.2,-21.2,
      -174.3,-13.1, -176.3,-3.9, -176.0,5.9, -174.5,12.9, -176.0,21.4,
      -175.6,32.3, -173.3,40.4, -169.4,47.7, -168.1,50.3, -166.2,54.4,
      -164.5,56.6, -162.0,59.0, -162.0,65.7, -161.5,67.6, -161.0,69.7,
      -157.7,72.8, -153.2,74.3, -144.3,72.6, -136.8,71.3, -129.5,70.0,
      -124.1,65.8, -114.6,65.0
    ];

    /* ---------- the plan: an ANALYTIC closed curve fitted to the trace ------
       The previous version used two passes of a 1-4-6-4-1 binomial filter and
       an even resample. MEASURED THIS RUN, that curve still carried a 41.9
       degree turn at (-158, 70) - a visible CORNER at the northwest, on a
       building published to have none - and an eleven-segment dead-straight
       run along the north facade. A moving average cannot remove a corner it
       is not wide enough to see, and widening it shrinks the building.
       So the plan is now a TRUNCATED FOURIER DESCRIPTOR: the traced boundary
       is resampled 512 times by arc length, transformed, and rebuilt from
       harmonics -14 to +14. That curve is analytic, so it has NO corner and NO
       straight segment anywhere by construction rather than by filtering, and
       its curvature is bounded. MEASURED, perpendicular distance from each of
       the 132 output points to the ORIGINAL traced polyline: median 0.97 ft,
       90th percentile 2.44 ft, maximum 3.67 ft; enclosed area 58,367 sq ft
       against the trace's 58,429, a tenth of one percent. Every one of those
       is inside the trace's own 3.0 to 6.2 ft RMS residual against its own
       fitted circles, so this is the same measurement read at its real
       precision. The sharpest turn falls from 41.9 degrees to 26.3 and moves
       to the southwest, where the trace really does turn; the longest straight
       run falls from 11 segments to 8; the smallest radius of curvature is
       12.9 ft against the published formwork minimum of "about 3 m". */
    var KHARM = 14;      /* harmonics kept. 8, 10, 12, 16 and 20 were all
                            measured this run; 14 is the lowest that holds the
                            46.9 ft prow arc while keeping the maximum
                            deviation inside the trace's own RMS residual. */
    var WBULGE = 6.0;    /* THE WEST BOW, an ASSUMPTION carrying its own bound.
                            The trace records the west end as straight to
                            within 3.6 ft over 190 ft, which contradicts the
                            one fact every source publishes. Least-squares
                            circles through that run are useless as evidence:
                            fitted over raw vertices 78-96, 80-102, 82-100 and
                            84-102 this run they return radii of 121.8, 176.1,
                            99.4 and 215.9 ft with centres on BOTH sides of the
                            wall, so the trace cannot say whether it bows in or
                            out, let alone by how much. The model bows it OUT,
                            the sign the published curvilinear massing demands,
                            by 6.0 ft: the RMS residual of that run's own best
                            circle is 6.23 ft, so this is the largest
                            displacement the measurement cannot refute.
                            Implied radius about 750 ft, far outside the
                            published 3 m minimum. */
    var PLAN = (function () {
      var pts = [], i;
      for (i = 0; i < RAW.length / 2; i++) pts.push([RAW[i * 2], RAW[i * 2 + 1]]);
      var n = pts.length, cum = [0], tot = 0;
      for (i = 0; i < n; i++) {
        var a0 = pts[i], b0 = pts[(i + 1) % n];
        tot += Math.hypot(b0[0] - a0[0], b0[1] - a0[1]);
        cum.push(tot);
      }
      function at(t) {
        t = ((t % tot) + tot) % tot;
        var k = 0;
        while (k < n - 1 && cum[k + 1] < t) k++;
        var f = (t - cum[k]) / ((cum[k + 1] - cum[k]) || 1);
        var A0 = pts[k], B0 = pts[(k + 1) % n];
        return [A0[0] + (B0[0] - A0[0]) * f, A0[1] + (B0[1] - A0[1]) * f];
      }
      var M = 512, sam = [];
      for (i = 0; i < M; i++) sam.push(at(tot * i / M));
      var C = [], k2, th, re, im;
      for (k2 = -KHARM; k2 <= KHARM; k2++) {
        re = 0; im = 0;
        for (i = 0; i < M; i++) {
          th = -2 * Math.PI * k2 * i / M;
          re += sam[i][0] * Math.cos(th) - sam[i][1] * Math.sin(th);
          im += sam[i][0] * Math.sin(th) + sam[i][1] * Math.cos(th);
        }
        C.push([re / M, im / M]);
      }
      var N = 132, out = [];
      for (i = 0; i < N; i++) {
        var t = i / N, x = 0, y = 0;
        for (k2 = -KHARM; k2 <= KHARM; k2++) {
          th = 2 * Math.PI * k2 * t;
          var c = C[k2 + KHARM];
          x += c[0] * Math.cos(th) - c[1] * Math.sin(th);
          y += c[0] * Math.sin(th) + c[1] * Math.cos(th);
        }
        out.push([x, y]);
      }
      /* the west bow, over the arc-length span of RAW vertices 80 to 101,
         which is the stretch the trace records as straight. A raised sine
         taper, so the ends are untouched and the curvature never jumps.
         Displacements are computed from the UNBOWED curve and applied
         afterwards, or each point would be pushed along a tangent its
         neighbour had already moved. The trace is CLOCKWISE, verified by
         shoelace, so (-dv, du) points OUT. */
      var j0 = N * cum[80] / tot, j1 = N * cum[101] / tot, dsp = [];
      for (i = 0; i < N; i++) {
        if (i < j0 || i > j1) { dsp.push(null); continue; }
        var w = Math.sin(Math.PI * (i - j0) / (j1 - j0));
        var pa = out[(i - 3 + N) % N], pb = out[(i + 3) % N];
        var du = pb[0] - pa[0], dv = pb[1] - pa[1], L = Math.hypot(du, dv) || 1;
        dsp.push([-dv / L * WBULGE * w, du / L * WBULGE * w]);
      }
      for (i = 0; i < N; i++) if (dsp[i]) { out[i][0] += dsp[i][0]; out[i][1] += dsp[i][1]; }
      return out;
    })();
    var NV = PLAN.length;

    /* ---------- scale ---------- */
    var TOP = 120;                   /* PUBLISHED: "top of the dome ... 120 ft" */
    var PARA = 99;                   /* PUBLISHED: "The building is 99 feet high" */
    var FT  = (p.h * VE) / TOP;      /* host units per foot */
    var m   = FT * s;
    function pt(u, v, z) { return P(p.x + u * m, p.y + v * m, z * FT); }
    function W(u, v) { return [p.x + u * m, p.y + v * m]; }

    /* ---------- published and derived geometry, in feet ---------- */
    var STOREY = PARA / 5;           /* DERIVED: 99 ft over five published storeys */
    var ROT_U  = 153.8, ROT_V = 0.0; /* DERIVED: circle fit to the east prow */
    var ROT_R  = 46.9;               /* DERIVED: that fit's radius */
    var DOME_R = 40;                 /* ROT_R less an assumed 7 ft of wall */
    var DOME_RISE = TOP - PARA;      /* DERIVED: 120 - 99 = 21 ft over the parapet */
    var DOME_STEPS = 6;              /* assumption: the published dome is "stepped" */
    var OCU_R  = 9;                  /* published as an opening, diameter assumed */
    var ENT    = 14.81 * Math.PI / 180;  /* DERIVED bearing to the Capitol */
    var ENT_HALF = 40 * Math.PI / 180;   /* assumption: the entrance arc's half angle */
    var CANT   = 50;                 /* PUBLISHED: "projects approximately 50 feet" */
    var CAVE_Z = 2 * STOREY;         /* DERIVED soffit: two of five published storeys */
    var WALLD  = -5.5;               /* the wall face, set inside the traced envelope
                                        by the cantilever / coverage reading above:
                                        5.5 ft off a 1,050 ft perimeter takes the
                                        58,423 sq ft trace to about 52,700, toward
                                        the published "more than a quarter" of the
                                        4.25 acre site, about 46,000 */
    var FACED  = -0.5;               /* what reaches back out to the trace: coping,
                                        balconies, the roughback base */
    var BASE_Z = 6.5;                /* roughback base, an assumption inside bounds */
    var DECK_Z = PARA - 3.5;         /* assumption: the parapet's own upstand. No roof
                                        treatment is published; a parapet you cannot
                                        see is a claim that there is none. */
    /* ---------- THE FIFTH-STOREY SETBACK ----------
       The previous version drew the top of this building as ONE horizontal
       parapet ring at 99 ft enclosing one 50,000 sq ft plane, and recorded a
       flat unbroken roof in NAMED GAPS. That gap statement was not true of the
       code even then, because the SAME header cites a published feature that
       breaks it: the Senator Daniel K. Inouye Memorial Terrace, "an outdoor
       space" on the NORTH facade at the FIFTH FLOOR, with its own parapet
       whose capstones slope 6 degrees toward the wall. An outdoor space at the
       fifth floor with a parapet IS a setback: the fifth storey stands back
       from the wall below it and the roof of the fourth is walked on.
       So the setback is drawn as a continuous sweep rather than as a lone
       notch, and what is published and what is assumed is stated separately:
         PUBLISHED - a fifth-floor outdoor terrace behind a parapet, on the
           north facade, with inward-sloping capstones.
         DERIVED   - its level, PARA - STOREY = 79.2 ft, one of the five
           published storeys down from the published 99 ft.
         ASSUMED   - that the same setback runs round the rest of the plan
           (SETB, below) and that it releases to nothing over the rotunda,
           whose full-height drum the published dome caps. Nothing publishes
           either. The warrant for the shape is the published massing itself,
           "a stratified stone mass that has been carved by wind and water",
           which is a description of a thing that steps.
       The consequence is that the roofline SWEEPS: 99 ft over the east prow,
       falling to 82.7 ft along the west and north, with the fifth storey
       standing 14 ft inboard above it. That also ends the reason the old
       terrace needed a notch cut out of the deck, and with it the see-through
       hole at the notch's mouth and the grey shelf its floor painted across
       the north wall. */
    var STEP_Z = PARA - STOREY;      /* DERIVED: the published fifth floor, 79.2 */
    var SETB   = 26;                 /* assumption: how far the fifth storey stands
                                        back. Unpublished. 14 ft was tried first and
                                        left the walked roof a thin rim while the
                                        upper deck still covered four fifths of the
                                        plan, so the defect the setback exists to
                                        cure - one enormous featureless plane - was
                                        only narrowed. 26 ft is a little over a
                                        published storey height and gives a terrace
                                        wide enough to be one. */
    var ROT_KEEP = 64;               /* assumption: the rotunda drum runs full height
                                        out to here, measured from the DERIVED
                                        rotunda centre, and the setback ramps in
                                        over the next span. The published dome caps
                                        this space, so it cannot be the low part. */
    var ROT_RAMP = 92;               /* the ramp was 56 ft wide on the first attempt.
                                        Both the inset and the storey height go to
                                        zero together across it, so a wide ramp draws
                                        a razor-thin wall over a long run, and it read
                                        as a torn serpentine edge rather than as a
                                        shoulder. 28 ft makes the change a shoulder
                                        you can see, which is what a swept roofline
                                        on this building looks like. */

    /* ---------- materials ----------
       TWO Kasota varieties plus the ground stones, all published. ctx.shade
       gives each of them its lit and its shaded face. */
    var ROUGHB = "#a98a58";   /* Golden Buff roughback, quarry weathered, the base */
    var ROUGHD = "#96784b";   /* its rustier beds */
    var SPLIT  = "#c9ad7d";   /* Northern Buff splitface, the majority of the facade */
    var SPLIT2 = "#c2a575";   /* its darker courses */
    var TAPES  = "#d8c49a";   /* tapestry: sills, copings and window surrounds only */
    var SCORE  = "#b39b70";   /* a scored course boundary */
    var SOFF   = "#7d6749";   /* the underside where stone oversails */
    var DEEP   = "#5d4c36";   /* the deep shade inside the cantilever */
    var PAVE   = "#6f6f6e";   /* American Mist granite at the wall's foot */
    /* No roof treatment is published. Drawn as a neutral membrane and
       deliberately NOT as stone: at the wall's own tone the largest surface in
       the model read as one more course of the cliff lying flat.
       IT MUST ALSO BE DARKER THAN THE WALL. The previous version lightened
       this to #9c9a8f, which is brighter than the stone beside it, so the one
       surface with nothing on it became the brightest thing in the picture and
       the roof read louder than the building. A roof is seen at a glancing
       angle in daylight and belongs BELOW the wall in value; these two sit
       about 25 percent darker than the splitface. */
    var ROOFC  = "#7b7a71";
    var ROOFC2 = "#6c6b63";
    /* the WALKED roof, one step down, is not the same surface as the membrane
       over the fifth storey and must not be the same colour. Rendered in the
       deck's own tone it read as one continuous grey field with a thin tan
       line wandering through it, which is exactly the tear the setback was
       built to remove. A walked terrace is ballast or paving: warmer, lighter,
       still below the wall in value. */
    var TERRC  = "#9a9384";
    var TERRC2 = "#8a8375";
    var DOMEC  = "#c8c0ad";   /* precast GFRC; exterior finish not published */
    var DOMED  = "#b3ab97";
    var GLASS  = "#2f3b45";   /* "the windows cut like caves in the stone" */
    var MULL   = "#55646e";   /* the published vertical mullions */
    var PRISM  = "#a7bcc4";
    /* The site pad. Declared here because it never was: the site rectangle
       called LAWNC and nothing defined it, so this form threw a ReferenceError
       on every draw and the museum was never drawn at all. The value is the
       shared Mall lawn from dc-3d.js (C.lawn). */
    var LAWNC  = "#cfd8c4";
    var FOREST = "#7d9463";
    var CANOPY = "#5f7c4c";
    var CANOP2 = "#4d6a3d";
    var TRUNK  = "#6a5844";
    var MARSH  = "#94a67f";
    var WATER  = "#9db6bf";
    var CROP   = "#bcb47f";
    var MEADOW = "#adba86";
    var ROCK   = "#8f8b81";
    var GRANIT = "#7c7870";
    var STEEL  = "#b9bdc0";

    /* ---------- small helpers ---------- */
    function push(q, fill, nx, ny, nz, bias, depth) {
      var f = ctx.shade(fill, nx, ny, nz || 0);
      items.push({ svg: ctx.poly(q, f, f, 0.6),
                   depth: depth === undefined ? H.depthOf(q) + (bias || 0) : depth });
    }
    function V(i) { i = ((i % NV) + NV) % NV; return PLAN[i]; }

    /* Inward offset of the smoothed polygon. The trace is CLOCKWISE, verified
       by shoelace, so an edge (dx,dy) has outward normal (-dy,dx). Offsets are
       NEGATIVE, i.e. inset, because the trace is the building's widest extent.
       With an evenly resampled smooth curve the mitre factor now never has to
       be clamped hard: the old clamp of 3 was throwing the spikes that read as
       a staircase of tan slivers down the prow. */
    var OFFC = {};
    function poly(d) {
      var key = d.toFixed(2);
      if (OFFC[key]) return OFFC[key];
      var out = [];
      for (var i = 0; i < NV; i++) {
        var a = V(i - 1), b = V(i), c = V(i + 1);
        var e1u = b[0] - a[0], e1v = b[1] - a[1], L1 = Math.hypot(e1u, e1v) || 1;
        var e2u = c[0] - b[0], e2v = c[1] - b[1], L2 = Math.hypot(e2u, e2v) || 1;
        var n1u = -e1v / L1, n1v = e1u / L1;
        var n2u = -e2v / L2, n2v = e2u / L2;
        var su = n1u + n2u, sv = n1v + n2v, L = Math.hypot(su, sv);
        if (L < 1e-6) { su = n2u; sv = n2v; L = 1; }
        su /= L; sv /= L;
        var k = 1 / Math.max(su * n2u + sv * n2v, 0.72);
        if (k > 1.4) k = 1.4;
        out.push([b[0] + su * d * k, b[1] + sv * d * k]);
      }
      OFFC[key] = out;
      return out;
    }
    /* THE SMOOTHED NORMAL. One traced edge's normal is noise here; the chord
       from V(i-2) to V(i+3) is not. Both the cull and the shading read this,
       which is why neighbouring panels no longer step in tone. */
    var NRM = (function () {
      var out = [];
      for (var i = 0; i < NV; i++) {
        var a = V(i - 2), b = V(i + 3);
        var du = b[0] - a[0], dv = b[1] - a[1], L = Math.hypot(du, dv) || 1;
        out.push([-dv / L, du / L]);
      }
      return out;
    })();
    function segN(i) { return NRM[((i % NV) + NV) % NV]; }
    /* A DEEP offset needs the smoothed normal, not the mitred polygon. Tested
       this run: poly() is clean at -0.5 and -5.5 and SELF-INTERSECTS in three
       places at -14.5 and at -39.5, because the published formwork minimum is
       about 3 m and a mitred offset deeper than the local radius folds. Those
       three folds were the serrated tear along the roof's south-east edge.
       Sliding each point down its own normal cannot fold a neighbourhood
       whose radius exceeds the offset, and it is only ever used inboard where
       nothing is silhouetted. */
    function offN(base, d) {
      var out = [];
      for (var i = 0; i < NV; i++) out.push([base[i][0] + NRM[i][0] * d,
                                             base[i][1] + NRM[i][1] * d]);
      return out;
    }
    /* AND A CURVATURE-CLAMPED ONE. offN cannot fold a neighbourhood whose
       radius exceeds the offset, and folds one whose radius does not. The
       measured minimum radius of this plan is 12.9 ft, so a 26 ft setback
       folds at the southwest turn: it threw a straight-edged grey tab, capped
       with a scrap of coping, straight up out of the roof at the far end - a
       spike, on a building with no corner in it. Where the curve is CONVEX the
       offset is capped at 0.6 of the local radius, measured over a six-segment
       stencil so one traced vertex cannot drive it; where it is concave an
       inward offset diverges and needs no cap. */
    /* the local radius of an ARBITRARY closed polygon, on the same stencil.
       offC must measure the curve it is actually offsetting: measuring the
       plan instead let a 1.5 ft step off an already-inset line fold, because
       the inset line's corners are tighter than the plan's. */
    function locR(base) {
      /* the SMALLEST circumradius over three stencil widths, not one. A wide
         stencil flattens a short tight corner and reports a radius the corner
         does not have, which is how a clamped offset still folded once after
         the first repair. Convexity is judged per stencil, and a concave
         reading contributes nothing, because an inward offset only folds where
         the curve bends toward it. */
      var out = [], n = base.length, i, w;
      for (i = 0; i < n; i++) {
        var best = 1e9;
        for (w = 1; w <= 3; w++) {
          var a = base[(i - w + n) % n], b = base[i], c = base[(i + w) % n];
          var A = Math.hypot(b[0] - a[0], b[1] - a[1]),
              B = Math.hypot(c[0] - b[0], c[1] - b[1]),
              Cc = Math.hypot(c[0] - a[0], c[1] - a[1]);
          var cr = (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]);
          var ar = Math.abs(cr) / 2;
          if (ar > 1e-6 && cr < 0) best = Math.min(best, A * B * Cc / (4 * ar));
        }
        out.push(best);
      }
      return out;
    }
    function offC(base, d) {          /* d negative, inward, fold-free */
      /* AND IT MUST USE THE BASE'S OWN NORMALS. Sliding an already-inset line
         down the PLAN's normals folded a 1.5 ft step twice: wherever the
         setback clamp had put a kink in the inset line, the plan's normal
         there pointed somewhere the inset line was no longer going. Both the
         radius and the direction are read off the curve being offset. */
      var out = [], R = locR(base), n = base.length, i;
      for (i = 0; i < n; i++) {
        var a = base[(i - 2 + n) % n], c = base[(i + 2) % n];
        var du = c[0] - a[0], dv = c[1] - a[1], L = Math.hypot(du, dv) || 1;
        var lim = -d > 0.45 * R[i] ? -0.45 * R[i] : d;
        out.push([base[i][0] + (-dv / L) * lim, base[i][1] + (du / L) * lim]);
      }
      return out;
    }
    function segMid(i) {
      var a = V(i), b = V(i + 1);
      return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    }
    /* visibility, then RUN-LENGTH FILTERED. A single stray true let one
       far-side panel plus its ledge through in isolation, over the roof, with
       no neighbours to hide it. Nothing shorter than four segments is
       believed, in either direction. */
    var VIS = (function () {
      var v = [], i;
      for (i = 0; i < NV; i++) v.push(ctx.faceVisible(NRM[i][0], NRM[i][1]));
      for (var pass = 0; pass < 2; pass++) {
        var w = v.slice();
        for (i = 0; i < NV; i++) {
          var run = 0;
          while (run < 5 && v[(i + run) % NV] === v[i]) run++;
          if (run < 4 && v[(i - 1 + NV) % NV] !== v[i]) {
            for (var j = 0; j < run; j++) w[(i + j) % NV] = !v[i];
          }
        }
        v = w;
      }
      return v;
    })();
    function vis(i) { return VIS[((i % NV) + NV) % NV]; }

    /* ---------- the setback, per segment ----------
       ONE smoothstep on distance from the DERIVED rotunda centre drives three
       things that must agree or the mass tears: how far the fifth storey
       stands back, how high the outer wall runs, and where the walked roof
       is. Computing them from a single ramp is what stops the parapet, the
       coursing and the terrace floor from disagreeing about where the top of
       the wall is. */
    var SETBV = [], TOPV = [], TERRV = [];
    (function () {
      var raw = [], i, k, LR = locR(poly(WALLD));
      for (i = 0; i < NV; i++) {
        var a = V(i), d = Math.hypot(a[0] - ROT_U, a[1] - ROT_V);
        var t = (d - ROT_KEEP) / (ROT_RAMP - ROT_KEEP);
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        t = t * t * (3 - 2 * t);
        raw.push(SETB * t);
        TOPV.push(PARA - t * (PARA - (STEP_Z + 3.5)));  /* the outer parapet's top */
        TERRV.push(PARA - t * (PARA - (STEP_Z + 3.5)) - 3.5); /* what you walk on */
      }
      /* SMOOTH, THEN CLAMP, THREE TIMES, AND THE ORDER IS THE WHOLE FIX. The
         first attempt clamped the setback to the local radius and THEN smoothed
         it, and the smoothing pulled the clamped values back up above the limit
         they had just been given: the fifth storey folded through itself at the
         southwest and northwest turns - measured, three self-intersections in
         the offset polygon - and the fold projected as a grey mushroom growing
         out of the roof. Clamping LAST guarantees no point exceeds half its own
         radius, so it cannot fold; smoothing before each clamp keeps the
         setback a curve rather than a notch. The ring simply narrows where the
         plan turns tightly, which is what a setback on a curved building does. */
      for (var it = 0; it < 4; it++) {
        var sm = [];
        for (i = 0; i < NV; i++) {
          var acc = 0;
          for (k = -2; k <= 2; k++) acc += raw[((i + k) % NV + NV) % NV];
          sm.push(acc / 5);
        }
        for (i = 0; i < NV; i++) raw[i] = Math.min(sm[i], 0.40 * LR[i]);
      }
      for (i = 0; i < NV; i++) SETBV.push(raw[i]);
    })();
    function topZ(i) { return TOPV[((i % NV) + NV) % NV]; }
    function terrZ(i) { return TERRV[((i % NV) + NV) % NV]; }
    /* the fifth storey's own wall line, and the upper deck 1.5 ft inside it so
       that its capstone ring always lies OUTSIDE the deck polygon and can
       never be painted over by it */
    var WALLP = poly(WALLD);
    var LOCA = locR(WALLP);
    var UPP = (function () {
      var out = [];
      for (var i = 0; i < NV; i++)
        out.push([WALLP[i][0] - NRM[i][0] * SETBV[i], WALLP[i][1] - NRM[i][1] * SETBV[i]]);
      return out;
    })();
    /* THE DECK AND ITS STRIPS ARE OFFSET FROM THE WALL LINE, NOT FROM EACH
       OTHER. Chaining offsets compounds their kinks: the setback clamp leaves
       a slight kink in the fifth-storey line, and a further 1.5 ft step off
       THAT still folded, twice. Every inset line here is now one clamped step
       from the smooth wall line A, whose own offsets are measured fold-free,
       with the ceiling raised for each successive ring so they cannot cross. */
    function insetA(extra, ceil) {
      var out = [], i;
      for (i = 0; i < NV; i++) {
        var d = Math.min(SETBV[i] + extra, ceil * LOCA[i]);
        out.push([WALLP[i][0] - NRM[i][0] * d, WALLP[i][1] - NRM[i][1] * d]);
      }
      return out;
    }
    var DECKP = insetA(1.5, 0.46);

    /* THE ROOF DECK'S DEPTH, computed here because half the model needs it.
       depthOf returns a quad's FARTHEST corner, so a large deck sorts behind
       everything and swallows nothing; an earlier version added a constant
       -5000 to that and the deck then sorted behind the SITE, so trees and
       boulders standing on the lawn behind the museum painted through a plane
       94 ft in the air. Sorting on the NEAREST corner puts the deck in front
       of the ground behind the building and behind everything standing on it.
       IT NO LONGER SORTS THE DECK. Measured against the render, one number
       over a slab this size beats walls at other stations as well as its own,
       so the deck is now tessellated into strips that sort locally and ROOF_D
       survives only to anchor the handful of FAR-SIDE inner faces, which have
       to beat the deck from behind it and have no local neighbour to lose to. */
    var ROOF_D = (function () {
      var mx = -Infinity;
      for (var i = 0; i < NV; i++) {
        var q = pt(DECKP[i][0], DECKP[i][1], DECK_Z);
        if (q[2] > mx) mx = q[2];
      }
      return mx - 0.4;
    })();
    /* THE DECK'S ONE DEPTH, AND IT IS MEASURED FROM THE WALLS RATHER THAN
       CHOSEN. Concentric strips at one height never overlap each OTHER in
       projection, so the deck does not need per-strip sorting to argue with
       itself - the two rewrites that tried it were solving the wrong half.
       What it needs is to lose to every wall standing in front of it, and a
       wall sorts on its FARTHEST corner while the deck beside it is only 1.5 ft
       behind and 19.8 ft lower, so a strip four stations round the curve kept
       beating a wall it happened to overlap and bit a row of teeth out of the
       coping. The minimum over every VISIBLE station of the fifth-storey line
       puts the whole deck behind every wall that can be seen, at every station
       at once, and still well in front of the walked roof outside it and the
       ground beyond that, which are both another 26 ft further out again.
       Computed out here because the capstone block needs it too. */
    var DECK_SORT = (function () {
      var mn = Infinity;
      for (var w = 0; w < NV; w++) {
        if (!ctx.faceVisible(NRM[w][0], NRM[w][1])) continue;
        var w1 = (w + 1) % NV;
        mn = Math.min(mn, pt(UPP[w][0], UPP[w][1], DECK_Z)[2],
                          pt(UPP[w1][0], UPP[w1][1], DECK_Z)[2]);
      }
      return (mn === Infinity ? ROOF_D : mn) - 0.6;
    })();
    /* a quad's NEAREST corner. Used where a thing must beat what is behind it
       rather than lose to what is in front, and used nowhere else. */
    function nearD(q) {
      var d = q[0][2];
      for (var i = 1; i < q.length; i++) if (q[i][2] > d) d = q[i][2];
      return d;
    }

    /* the entrance arc, on the DERIVED Capitol bearing and on the prow rather
       than anywhere else the wall happens to face east */
    function entW(i) {                       /* the cantilever's taper, 0 to 1 */
      var n = segN(i), md = segMid(i);
      /* THE RADIUS GATE USED TO BE A CLIFF: anything past 64 ft from the
         DERIVED rotunda centre returned 0 while its neighbour a foot inside
         returned its full angular weight. That step is 50 ft of wall appearing
         between two adjacent segments, and it is what folded the entrance
         glazing into flat facets with two hard creases in it - a storefront
         bay window on a building whose whole published character is that it
         has no straight edge. The gate is now a smoothstep across a 20 ft
         band, so the recess dies away instead of being cut off, and both the
         glazing and the stone above it stay curved. */
      var d = Math.hypot(md[0] - ROT_U, md[1] - ROT_V);
      var g = (76 - d) / 20;
      if (g <= 0) return 0;
      if (g > 1) g = 1;
      g = g * g * (3 - 2 * g);
      var da = Math.atan2(n[1], n[0]) - ENT;
      while (da > Math.PI) da -= Math.PI * 2;
      while (da < -Math.PI) da += Math.PI * 2;
      if (Math.abs(da) >= ENT_HALF) return 0;
      var c = Math.cos(Math.PI / 2 * da / ENT_HALF);
      return c * c * g;                      /* assumption: a raised-cosine taper */
    }
    function isEnt(i) { return entW(i) > 0.001; }
    var entShows = ctx.faceVisible(Math.cos(ENT), Math.sin(ENT));
    /* THE CANTILEVER, drawn as the published 50 ft. The wall under the prow is
       pushed back along the fixed Capitol bearing, not along each segment's
       own normal: 50 ft of inward normal on a 46.9 ft arc collapses through
       the rotunda's centre and self-intersects, while 50 ft along one bearing
       flattens the arc into a real cave and stays single-valued in v. */
    var CAVEP = (function () {
      var A = poly(WALLD), out = [], i;
      for (i = 0; i < NV; i++) out.push([A[i][0], A[i][1]]);
      /* MEASURED THIS RUN on the previous construction, which slid each
         segment back by its own taper weight along the fixed Capitol bearing:
         turn angles along the resulting cave wall of -42.3, +50.7, +49.9 and
         -107.1 degrees between adjacent segments. That is not a cave, it is a
         folded storefront, and it is the two hard creases in the glazing. The
         cause is arithmetic: the taper is a function of each segment's NORMAL
         angle, the normal swings about 11 degrees per segment round a 41 ft
         prow, and the taper is cut dead where the normal leaves the entrance
         arc - so the pushback jumped by as much as 22 ft between neighbours
         7.8 ft apart, and fell 25 ft to zero at the last one.
         The recess is now ONE quadratic Bezier spanning the opening. A
         quadratic is smooth everywhere between its ends by construction, so
         no resolution or taper choice can crease it, and the only tangent
         break left is at the two jambs, where a cave is supposed to have one.
         Its control point is placed so the curve passes through a point CANT
         back from the ARC'S OWN APEX along the derived bearing, which is what
         "projects approximately 50 feet AT ITS GREATEST POINT" says: measured
         from the outermost stone, not from the chord across the opening. */
      var idx = [];
      for (i = 0; i < NV; i++) if (entW(i) > 0.001) idx.push(i);
      if (!idx.length) return out;
      var lo = idx[0], hi = idx[idx.length - 1], n = hi - lo + 1;
      var P0 = A[lo % NV], P1 = A[(hi + 1) % NV];
      var apex = A[Math.round((lo + hi) / 2) % NV];
      var deep = [apex[0] - CANT * Math.cos(ENT), apex[1] - CANT * Math.sin(ENT)];
      var Cp = [2 * deep[0] - (P0[0] + P1[0]) / 2, 2 * deep[1] - (P0[1] + P1[1]) / 2];
      for (var k = 0; k <= n; k++) {
        var t = k / n, u = 1 - t;
        out[(lo + k) % NV] = [u * u * P0[0] + 2 * u * t * Cp[0] + t * t * P1[0],
                              u * u * P0[1] + 2 * u * t * Cp[1] + t * t * P1[1]];
      }
      return out;
    })();

    /* ---------- 1. the ground ----------
       The published 4.25 acres as a TRAPEZOID, which is how SAH Archipedia
       publishes the site, then the four published habitats on their published
       sides as ellipses of the published areas. Everything here sorts below
       -1e9+1.5 so a 4 acre site cannot shrink the museum to a speck. */
    function shape(pts, z, fill, depth) {
      var q = pts.map(function (c) { return pt(c[0], c[1], z); });
      var f = ctx.shade(fill, 0, 0, 1);
      items.push({ svg: ctx.poly(q, f, f, 0.6), depth: depth });
    }
    function ell(cu, cv, a, b, rot, K) {
      var o = [], r = (rot || 0) * Math.PI / 180;
      K = K || 22;
      for (var i = 0; i < K; i++) {
        var t = i / K * Math.PI * 2;
        var x = a * Math.cos(t), y = b * Math.sin(t);
        o.push([cu + x * Math.cos(r) - y * Math.sin(r),
                cv + x * Math.sin(r) + y * Math.cos(r)]);
      }
      return o;
    }
    /* trapezoid: 470 across the north, 530 across the south, 370 deep.
       (470+530)/2 x 370 = 185,000 sq ft = the published 4.25 acres to 0.1%. */
    shape([[-224, 143], [246, 143], [276, -227], [-254, -227]],
          0.02, LAWNC, -1e9 + 1.00);
    shape(ell(10, 106, 110, 69.5, -3), 0.06, FOREST, -1e9 + 1.10);   /* 24,015 sq ft N */
    shape(ell(228, 0, 31.8, 60, 0), 0.06, MARSH, -1e9 + 1.12);       /* 5,993 sq ft E */
    shape(ell(135, -108, 55, 30.1, 12), 0.06, CROP, -1e9 + 1.16);    /* 5,201 sq ft SE */
    shape(ell(-70, -186, 38, 23, 0), 0.06, MEADOW, -1e9 + 1.18);     /* 2,746 sq ft, and */
    shape(ell(-212, -134, 38, 23, 0), 0.06, MEADOW, -1e9 + 1.19);    /* 2,746, "both sides" */
    /* THE WATER, on the published route: out of the rock layers at the
       NORTHWEST corner, into pools, then along the NORTH side to the east
       wetland. No width, drop or pool size is published. */
    shape(ell(-198, 74, 22, 14, 22), 0.08, WATER, -1e9 + 1.20);      /* the cascade pool */
    shape(ell(-172, 86, 15, 9, 30), 0.09, WATER, -1e9 + 1.21);       /* the lower pool */
    (function () {
      var ch = [], i;                                  /* the north watercourse */
      for (i = 0; i <= 24; i++) {
        var u = -170 + i * 16.2;
        ch.push([u, 84 + 7 * Math.sin(i * 0.45)]);
      }
      for (i = 24; i >= 0; i--) {
        var u2 = -170 + i * 16.2;
        ch.push([u2, 78 + 7 * Math.sin(i * 0.45)]);
      }
      shape(ch, 0.08, WATER, -1e9 + 1.22);
    })();
    shape(ell(228, 0, 20, 40, 0), 0.09, WATER, -1e9 + 1.23);         /* the east wetland */

    /* ---------- 2. the stone mass ----------
       A base of Golden Buff roughback, then a continuous field of Northern
       Buff splitface. The published module is four sawn course heights under
       sixteen inches "arranged irregularly", and the only published projection
       anywhere on the wall is a capstone oversailing 3.8 to 5 cm. So every
       step here is 0.15 ft, inside the published range, and the tonal zones
       are drawing device, not architecture. */
    var COURSE = [0.49, 0.66, 0.98, 1.31];   /* PUBLISHED: 15, 20, 30, 40 cm */
    var SCORES = (function () {
      /* accumulate the four published heights irregularly from BASE_Z to the
         parapet; that reaches about ninety courses, which at 132 segments is
         twelve thousand faces, so every seventh boundary is scored */
      var z = BASE_Z, out = [], seed = 20040921, n = 0;
      function rnd() { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }
      while (z < PARA - 2) {
        z += COURSE[Math.floor(rnd() * 4)];
        if ((++n) % 7 === 0) out.push(z);
      }
      return out;
    })();
    /* the tonal zones. Their boundaries are not published and carry no step
       the eye can read; they exist so a 99 ft wall is not one flat fill. */
    var ZONE = [
      [BASE_Z, 22, SPLIT ], [22, 37, SPLIT2], [37, 52, SPLIT ],
      [52, 66, SPLIT2], [66, 79, SPLIT ], [79, 91, SPLIT2],
      [91, PARA - 1.0, SPLIT ]
    ];

    /* THE ROUGHBACK BASE. Face-bedded blocks are planar, so this is the one
       place in the model where a flat facet is correct rather than a failure.
       Drawn on a decimated polygon: the wall above runs through 132 smooth
       points, the base through chords of four, which is what "ledges and
       faceting on the otherwise curved surfaces" describes. */
    var BASEP = (function () {
      var A = poly(FACED), out = [], STEPN = 4;
      for (var i = 0; i < NV; i++) {
        var i0 = Math.floor(i / STEPN) * STEPN, f = (i - i0) / STEPN;
        var a = A[i0 % NV], b = A[(i0 + STEPN) % NV];
        out.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]);
      }
      return out;
    })();

    function wallQuad(Q, i, z0, z1, fill, nx, ny, bias) {
      var a = Q[i], c = Q[(i + 1) % NV];
      push([pt(a[0], a[1], z0), pt(c[0], c[1], z0),
            pt(c[0], c[1], z1), pt(a[0], a[1], z1)], fill, nx, ny, 0, bias);
    }

    /* the granite paving apron at the wall's foot, published as American Mist */
    (function () {
      var A = poly(FACED), B = poly(FACED + 6);
      for (var i = 0; i < NV; i++) {
        if (!vis(i)) continue;
        var i1 = (i + 1) % NV;
        push([pt(A[i][0], A[i][1], 0.12), pt(A[i1][0], A[i1][1], 0.12),
              pt(B[i1][0], B[i1][1], 0.12), pt(B[i][0], B[i][1], 0.12)],
             PAVE, 0, 0, 1, 0.05);
      }
    })();

    /* the base, in two beds so it carries its own two tones and a ledge */
    (function () {
      for (var i = 0; i < NV; i++) {
        if (!vis(i)) continue;
        var n = segN(i);
        var cave = entShows && isEnt(i);
        var Q = cave ? CAVEP : BASEP;
        wallQuad(Q, i, 0, BASE_Z * 0.55, cave ? DEEP : ROUGHD, n[0], n[1], 0.02);
        wallQuad(Q, i, BASE_Z * 0.55, BASE_Z, cave ? DEEP : ROUGHB, n[0], n[1], 0.04);
      }
      /* the ledge where the roughback stands proud of the splitface above:
         3.5 ft on this model's reading, the published "few inches" of block
         projection plus the wall's own setback inside the traced envelope */
      var A = BASEP, B = poly(WALLD);
      for (var i2 = 0; i2 < NV; i2++) {
        if (!vis(i2)) continue;
        if (entShows && isEnt(i2)) continue;
        var j1 = (i2 + 1) % NV, j2 = (i2 + 2) % NV;
        var oA = [A[j1][0] + (A[j2][0] - A[j1][0]) * 0.06,
                  A[j1][1] + (A[j2][1] - A[j1][1]) * 0.06];
        var oB = [B[j1][0] + (B[j2][0] - B[j1][0]) * 0.06,
                  B[j1][1] + (B[j2][1] - B[j1][1]) * 0.06];
        push([pt(A[i2][0], A[i2][1], BASE_Z), pt(oA[0], oA[1], BASE_Z),
              pt(oB[0], oB[1], BASE_Z), pt(B[i2][0], B[i2][1], BASE_Z)],
             TAPES, 0, 0, 1, 0.9);
      }
    })();

    /* the splitface field */
    (function () {
      var A = poly(WALLD);
      for (var zi = 0; zi < ZONE.length; zi++) {
        var Z = ZONE[zi];
        for (var i = 0; i < NV; i++) {
          if (!vis(i)) continue;
          /* the outer wall now stops at its OWN swept top, not at one global
             parapet, so every zone is clipped per segment */
          var zt = topZ(i) - 1.0;
          if (Z[0] >= zt) continue;
          var z1 = Math.min(Z[1], zt);
          var n = segN(i);
          var cave = entShows && isEnt(i) && Z[0] < CAVE_Z;
          if (cave) {
            wallQuad(CAVEP, i, Z[0], Math.min(z1, CAVE_Z), GLASS, n[0], n[1], 0.4);
            if (z1 > CAVE_Z) wallQuad(A, i, CAVE_Z, z1, Z[2], n[0], n[1], 0);
          } else {
            wallQuad(A, i, Z[0], z1, Z[2], n[0], n[1], 0);
          }
        }
      }
      /* the scored course boundaries: the published four heights accumulated,
         every seventh drawn, a 0.22 ft shadow line and no projection */
      for (var k = 0; k < SCORES.length; k++) {
        var z = SCORES[k];
        if (z > PARA - 1.2) continue;
        for (var i3 = 0; i3 < NV; i3++) {
          if (!vis(i3)) continue;
          if (z > topZ(i3) - 1.2) continue;      /* the swept top, per segment */
          if (entShows && isEnt(i3) && z < CAVE_Z) continue;
          var n3 = segN(i3);
          wallQuad(A, i3, z, z + 0.22, SCORE, n3[0], n3[1], 0.25);
        }
      }
    })();

    /* THE CAPSTONE at the roofline. PUBLISHED: "capstones project 3.8 to 5 cm
       over the NMAI facade", 0.125 to 0.164 ft, and they are tapestry finish.
       This is the whole cornice this building has. */
    (function () {
      var A = poly(WALLD), C = poly(WALLD + 0.15);
      /* the capstone's own width. The 3.8 to 5 cm is the PROJECTION beyond the
         facade, which is C; a parapet cap is as wide as the parapet, and that
         thickness is not published. 1.5 ft is the assumption, and the pale
         continuous rim it draws is what reads as a parapet from above. */
      var K = offN(A, -1.5);
      for (var i = 0; i < NV; i++) {
        var n = segN(i), i1 = (i + 1) % NV;
        var z0 = topZ(i), z1 = topZ(i1);
        if (vis(i)) {
          push([pt(C[i][0], C[i][1], z0 - 1.0), pt(C[i1][0], C[i1][1], z1 - 1.0),
                pt(C[i1][0], C[i1][1], z1), pt(C[i][0], C[i][1], z0)],
               TAPES, n[0], n[1], 0, 0.1);
        }
        /* the capstone's TOP face, sloping 6 degrees toward the wall as the
           conservation volume publishes for the terrace parapet: 1.5 ft of cap
           at 6 degrees drops 0.16 ft, so the inner edge sits that much lower.
           NATURAL DEPTH, and this is the correction the last round got exactly
           backwards. It was given ROOF_D + 0.05 to beat a deck that then ran
           all the way out to this same line, which put the far-side cap in
           FRONT of the deck; a face at 0.05 loses to the inner parapet face at
           0.3 and the cap vanished along the whole far side. With the fifth
           storey set back, the deck no longer reaches this line at all, so the
           cap sorts on its own corners: on the near side it beats the wall
           below it, and on the far side the deck correctly covers it. */
        var q = [pt(C[i][0], C[i][1], z0), pt(C[i1][0], C[i1][1], z1),
                 pt(K[i1][0], K[i1][1], z1 - 0.16), pt(K[i][0], K[i][1], z0 - 0.16)];
        /* On the near side this cap sorts on its own corners and beats the wall
           under it. On the FAR side its corners land either side of the deck's
           single measured depth, so half the coping won the argument and half
           lost and the far parapet came out as a dotted line. Far-side caps are
           put firmly behind the deck instead: whatever the deck covers there,
           it covers cleanly. */
        push(q, TAPES, 0, 0, 1, 0,
             vis(i) ? H.depthOf(q) + 0.6 : Math.min(H.depthOf(q) + 0.6, DECK_SORT - 0.5));
      }
    })();

    /* ---------- 3. the entrance: fifty feet of stone over your head ----------
       Gated whole on the derived bearing facing the camera. The wall below is
       already drawn pushed back; what is left is the soffit that roofs the
       cave, the vertical mullions that are the one published glazing detail,
       and the jambs that stop daylight showing straight through the ends of
       the opening. */
    if (entShows) {
      var Aw = poly(WALLD);
      var lo = -1, hi = -1;
      for (var ei = 0; ei < NV; ei++) {
        if (!isEnt(ei)) continue;
        if (lo < 0) lo = ei;
        hi = ei;
      }
      if (lo >= 0) {
        /* the soffit. A large slab standing over smaller things, so it takes
           an explicit depth: the nearest corner of the whole soffit, biased
           forward of the cave wall behind it. */
        for (var ej = lo; ej <= hi; ej++) {
          var j1 = (ej + 1) % NV;
          var rA = CAVEP[ej], rB = CAVEP[j1], sA = Aw[ej], sB = Aw[j1];
          var q = [pt(rA[0], rA[1], CAVE_Z), pt(rB[0], rB[1], CAVE_Z),
                   pt(sB[0], sB[1], CAVE_Z), pt(sA[0], sA[1], CAVE_Z)];
          var dq = q[0][2];
          for (var qi = 1; qi < 4; qi++) if (q[qi][2] > dq) dq = q[qi][2];
          push(q, SOFF, 0, 0, -1, 0, dq + 0.6);
        }
        /* THE PUBLISHED VERTICAL MULLIONS, and they were too fat and too many.
           At every second segment and 0.56 ft wide they drew fourteen identical
           square teeth along the whole opening, which read at a glance as a
           zipper rather than as glazing. No source gives a spacing or a width;
           these are thinner and set every third segment, so they read as the
           lines they are. The count is not published and is not a claim. */
        for (var mj = lo + 1; mj < hi; mj += 3) {
          var mn = segN(mj);
          var mp = [CAVEP[mj % NV][0] - mn[0] * 0.2, CAVEP[mj % NV][1] - mn[1] * 0.2];
          push([pt(mp[0] - mn[1] * 0.16, mp[1] + mn[0] * 0.16, 1.0),
                pt(mp[0] + mn[1] * 0.16, mp[1] - mn[0] * 0.16, 1.0),
                pt(mp[0] + mn[1] * 0.16, mp[1] - mn[0] * 0.16, CAVE_Z - 1.6),
                pt(mp[0] - mn[1] * 0.16, mp[1] + mn[0] * 0.16, CAVE_Z - 1.6)],
               MULL, mn[0], mn[1], 0, 1.2);
        }
        /* the jambs. A jamb is a plane and which face you see depends on which
           end of the opening you stand at, so both signs are tried. */
        [[lo, 1], [hi + 1, -1]].forEach(function (e) {
          var idx = ((e[0] % NV) + NV) % NV;
          var a = V(idx);
          var du = a[0] - ROT_U, dv = a[1] - ROT_V, L = Math.hypot(du, dv) || 1;
          var nu = -dv / L * e[1], nv2 = du / L * e[1];
          if (!ctx.faceVisible(nu, nv2)) { nu = -nu; nv2 = -nv2; }
          if (!ctx.faceVisible(nu, nv2)) return;
          var rp = CAVEP[idx], ap = Aw[idx];
          /* the jamb has zero width where the cantilever's taper has run out,
             and a zero-area quad is a stroked hairline in the wrong colour */
          if (Math.hypot(ap[0] - rp[0], ap[1] - rp[1]) < 0.5) return;
          push([pt(rp[0], rp[1], 0), pt(ap[0], ap[1], 0),
                pt(ap[0], ap[1], CAVE_Z), pt(rp[0], rp[1], CAVE_Z)],
               DEEP, nu, nv2, 0, 0.6);
        });
        /* the threshold: the building does not meet the lawn on a bare line */
        var TH = [];
        for (var tj = lo; tj <= hi + 1; tj++) TH.push(CAVEP[tj % NV]);
        for (var tk = hi + 1; tk >= lo; tk--) {
          var tp = Aw[tk % NV];
          TH.push([tp[0] + 6 * Math.cos(ENT), tp[1] + 6 * Math.sin(ENT)]);
        }
        shape(TH, 0.6, PAVE, H.depthOf(TH.map(function (c) { return pt(c[0], c[1], 0.6); })) + 0.2);
      }
    }

    /* ---------- 4. the balconies ----------
       PUBLISHED, and the largest thing this model was missing: "many gently
       curved balconies, which protrude from the building but are not
       accessible", "Most balconies are protected from rainwater by overhangs
       with the same curvature", seven of them unprotected and counted by
       facade - two south, two west, three north. Positions along each facade
       are NOT published and the stations below are assumptions. Each is a
       curved protrusion out to the traced envelope with a parapet, a soffit
       under its floor, and the matching curved overhang above it. */
    (function () {
      var A = poly(WALLD), B = poly(FACED);
      /* stations found by walking the resampled plan and taking runs whose
         smoothed normal faces the published compass side */
      function runOn(want, nth, len) {
        var found = [], i;
        for (i = 0; i < NV; i++) {
          var n = NRM[i];
          var ok = want === 'n' ? n[1] > 0.55 : want === 's' ? n[1] < -0.55 : n[0] < -0.55;
          if (ok) found.push(i);
        }
        if (found.length < len) return null;
        var start = found[Math.floor((found.length - len) * nth)];
        return start;
      }
      /* The floor levels were 40, 47, 61 and 68 ft. With the fifth storey now
         set back, the outer wall on the north and west tops out at 82.7 ft and
         its capstone starts at 81.7, so a balcony at 68 with a 13 ft overhang
         and a 1.4 ft upstand reached 82.4 and would have grown through the
         parapet. The two highest stations drop to 62; the guard below refuses
         any balcony whose overhang would reach its own segment's swept top,
         so no future change to the sweep can put one through the coping. */
      var STATION = [
        ['n', 0.12, 10, 40.0], ['n', 0.48, 10, 61.0], ['n', 0.86, 10, 40.0],
        ['w', 0.22, 9, 47.0], ['w', 0.72, 9, 62.0],
        ['s', 0.20, 10, 47.0], ['s', 0.70, 10, 62.0]
      ];
      STATION.forEach(function (st) {
        var s0 = runOn(st[0], st[1], st[2]);
        if (s0 === null) return;
        var len = st[2], zf = st[3];
        var zp = zf + 3.4;             /* assumption: the balcony's own parapet */
        var zo = zf + 13.0;            /* assumption: the matching overhang above */
        for (var k = 0; k < len; k++) {
          var i = (s0 + k) % NV, i1 = (i + 1) % NV;
          if (!vis(i)) continue;
          if (zo + 1.4 > topZ(i) - 1.2) continue;   /* never through the coping */
          var n = segN(i);
          /* the balcony's own front face */
          push([pt(B[i][0], B[i][1], zf), pt(B[i1][0], B[i1][1], zf),
                pt(B[i1][0], B[i1][1], zp), pt(B[i][0], B[i][1], zp)],
               SPLIT, n[0], n[1], 0, 1.4);
          /* its capstone, sloping inward as published */
          push([pt(B[i][0], B[i][1], zp), pt(B[i1][0], B[i1][1], zp),
                pt(A[i1][0], A[i1][1], zp + 0.4), pt(A[i][0], A[i][1], zp + 0.4)],
               TAPES, 0, 0, 1, 1.7);
          /* the soffit under its floor */
          push([pt(B[i][0], B[i][1], zf), pt(B[i1][0], B[i1][1], zf),
                pt(A[i1][0], A[i1][1], zf), pt(A[i][0], A[i][1], zf)],
               SOFF, 0, 0, -1, 1.2);
          /* the recess between the balcony's parapet and its overhang. The
             overhang is published "with the same curvature"; a soffit that
             deep puts the wall behind it in shade, and that shadow is what
             makes a balcony read as a protrusion instead of a pale slit. */
          push([pt(A[i][0], A[i][1], zp), pt(A[i1][0], A[i1][1], zp),
                pt(A[i1][0], A[i1][1], zo), pt(A[i][0], A[i][1], zo)],
               SOFF, n[0], n[1], -0.45, 0.9);
          /* the overhang of the same curvature above it */
          push([pt(B[i][0], B[i][1], zo), pt(B[i1][0], B[i1][1], zo),
                pt(A[i1][0], A[i1][1], zo), pt(A[i][0], A[i][1], zo)],
               SOFF, 0, 0, -1, 1.2);
          push([pt(B[i][0], B[i][1], zo), pt(B[i1][0], B[i1][1], zo),
                pt(B[i1][0], B[i1][1], zo + 1.4), pt(B[i][0], B[i][1], zo + 1.4)],
               TAPES, n[0], n[1], 0, 1.5);
        }
      });
    })();

    /* ---------- 5. the prism window ----------
       PUBLISHED as ONE opening: "a window with eight prisms", "eight large
       prisms inside a tall rectangular window", "mounted in the south wall of
       the Potomac Atrium". Size and sill level are gaps; the position is not.
       The eight and the true-south facing are the published facts. */
    (function () {
      var A = poly(WALLD), cand = [];
      for (var i = 0; i < NV; i++) {
        var n = segN(i), md = segMid(i);
        if (n[1] > -0.62) continue;                     /* facing near due south */
        if (Math.hypot(md[0] - ROT_U, md[1] - ROT_V) > 60) continue;  /* the rotunda */
        cand.push(i);
      }
      if (cand.length < 3) return;
      var mid = cand[Math.floor(cand.length / 2)];
      var lo2 = mid - 2, hi2 = mid + 2;                 /* assumption: about 40 ft wide */
      var z0 = 34, z1 = 76;                             /* assumption: a tall opening */
      for (var k = lo2; k <= hi2; k++) {
        var i2 = ((k % NV) + NV) % NV;
        if (!vis(i2)) continue;
        var n2 = segN(i2), a = A[i2], b = A[(i2 + 1) % NV];
        /* the opening, recessed so it reads as cut into the stone */
        push([pt(a[0] - n2[0] * 0.9, a[1] - n2[1] * 0.9, z0),
              pt(b[0] - n2[0] * 0.9, b[1] - n2[1] * 0.9, z0),
              pt(b[0] - n2[0] * 0.9, b[1] - n2[1] * 0.9, z1),
              pt(a[0] - n2[0] * 0.9, a[1] - n2[1] * 0.9, z1)],
             GLASS, n2[0], n2[1], 0, 1.1);
        /* its tapestry surround, the published smooth trim */
        push([pt(a[0], a[1], z1), pt(b[0], b[1], z1),
              pt(b[0], b[1], z1 + 1.1), pt(a[0], a[1], z1 + 1.1)],
             TAPES, n2[0], n2[1], 0, 1.3);
        push([pt(a[0], a[1], z0 - 1.1), pt(b[0], b[1], z0 - 1.1),
              pt(b[0], b[1], z0), pt(a[0], a[1], z0)],
             TAPES, n2[0], n2[1], 0, 1.3);
      }
      /* the eight prisms, inside the one window */
      var ai = ((lo2 % NV) + NV) % NV, bi = ((hi2 + 1) % NV + NV) % NV;
      var pa = A[ai], pb = A[bi];
      var nP = segN(mid);
      for (var q = 0; q < 8; q++) {
        var f0 = (q + 0.30) / 8, f1 = (q + 0.70) / 8;
        var x0 = [pa[0] + (pb[0] - pa[0]) * f0 - nP[0] * 0.4,
                  pa[1] + (pb[1] - pa[1]) * f0 - nP[1] * 0.4];
        var x1 = [pa[0] + (pb[0] - pa[0]) * f1 - nP[0] * 0.4,
                  pa[1] + (pb[1] - pa[1]) * f1 - nP[1] * 0.4];
        push([pt(x0[0], x0[1], z0 + 4), pt(x1[0], x1[1], z0 + 4),
              pt(x1[0], x1[1], z1 - 4), pt(x0[0], x0[1], z1 - 4)],
             PRISM, nP[0], nP[1], 0, 1.6);
      }
    })();

    /* ---------- 6. the roof: a swept setback, not one lid ----------
       WHAT CHANGED AND WHY. The previous version drew one 50,000 sq ft plane
       at a single level with a rectangular bite cut out of its edge for the
       Inouye Terrace, and that one decision produced four separate defects at
       once: a featureless plane that dominated every overhead view, a
       see-through hole where the bite's mouth showed lawn 79 ft below, a grey
       shelf where the terrace floor's global depth beat the north wall in
       front of it, and a hard-cornered slab hanging on a building that has no
       right angle anywhere.
       The setback answers all four with one piece of geometry. The published
       fifth-floor terrace is no longer a lone notch: the fifth storey stands
       back everywhere except over the rotunda, so the walked roof is a
       continuous ring, the parapet sweeps from 99 ft at the prow down to 82.7
       along the west and north, and the Inouye Terrace is simply the named
       PAVED stretch of that ring on the north facade, where a source puts it.
       There is no bite, so there is no mouth to see through and no floating
       slab to sort. Everything here sorts on its own corners; the deck is the
       only thing with an explicit depth and it is computed over the INSET
       line, so it can never win an argument with a wall in front of it. */
    (function () {
      var A = poly(WALLD), B = poly(FACED), i, k;

      /* --- the walked roof, between the outer wall and the fifth storey ---
         A warped quad: its four corners sit at two different swept heights, so
         the ring twists as the roofline falls, which is what makes the sweep
         legible from above. Skipped where the setback has released to nothing
         over the rotunda and the ring has no width. */
      for (i = 0; i < NV; i++) {
        var i1 = (i + 1) % NV;
        if (SETBV[i] < 1.0 && SETBV[i1] < 1.0) continue;
        var qr = [pt(A[i][0], A[i][1], TERRV[i]), pt(A[i1][0], A[i1][1], TERRV[i1]),
                  pt(UPP[i1][0], UPP[i1][1], TERRV[i1]), pt(UPP[i][0], UPP[i][1], TERRV[i])];
        push(qr, TERRC, 0, 0, 1, 0.05);
      }
      /* the shadow the outer parapet throws back across it. Two tones per
         material, and the thing that tells the eye the ring is bounded. */
      var Sh = offN(A, -4.0);
      for (i = 0; i < NV; i++) {
        var s1 = (i + 1) % NV;
        if (SETBV[i] < 4.5 && SETBV[s1] < 4.5) continue;
        push([pt(A[i][0], A[i][1], TERRV[i]), pt(A[s1][0], A[s1][1], TERRV[s1]),
              pt(Sh[s1][0], Sh[s1][1], TERRV[s1]), pt(Sh[i][0], Sh[i][1], TERRV[i])],
             TERRC2, 0, 0, 1, 0.12);
      }

      /* --- THE INOUYE TERRACE, the published stretch of that ring ---
         PUBLISHED: an outdoor space on the NORTH facade at the fifth floor,
         with views of the Capitol and the Washington Monument. Its run along
         the wall is not published and the eleven segments below are an
         assumption; that it exists, and on which facade, are not. It is drawn
         as American Mist paving over the membrane, which is what distinguishes
         a floor people stand on from the roof either side of it. */
      var north = [];
      for (i = 0; i < NV; i++) if (NRM[i][1] > 0.7 && SETBV[i] > 8) north.push(i);
      var t0 = north.length ? north[Math.floor(north.length * 0.34)] : -1, tn = 11;
      if (t0 >= 0) {
        for (k = 0; k < tn; k++) {
          var c0 = (t0 + k) % NV, c1 = (t0 + k + 1) % NV;
          push([pt(A[c0][0], A[c0][1], TERRV[c0]), pt(A[c1][0], A[c1][1], TERRV[c1]),
                pt(UPP[c1][0], UPP[c1][1], TERRV[c1]), pt(UPP[c0][0], UPP[c0][1], TERRV[c0])],
               PAVE, 0, 0, 1, 0.20);
        }
      }

      /* --- the fifth storey's own wall, standing on the ring ---
         On the near side this is what the eye reads as the setback. On the far
         side it is culled and its INNER face is drawn instead, with the normal
         inverted, so the eye meets stone across the top of the mass rather
         than sky: without it a solid boulder of a building reads as a quarry.
         The far face carries the only explicit depth in this block because it
         has to beat the deck it stands behind. */
      /* THE GUARD IS ON THE SETBACK, NOT ON THE HEIGHT, and getting that wrong
         tore the east edge open on the first render of this rewrite. Over the
         rotunda the setback releases to nothing, so UPP lies exactly on the
         wall line and TERRV equals DECK_Z: a height test still finds 3.5 ft of
         "fifth storey" there and draws a second parapet on top of the real
         one. Because the two lines separate as the setback ramps in, that
         duplicate wandered in and out of the roof as a tan serpentine band
         with a torn grey wedge beside it. Where there is no setback there is
         no fifth storey; the outer wall's own parapet is the parapet. */
      function hasStorey(i) {
        return SETBV[i] >= 1.0 || SETBV[(i + 1) % NV] >= 1.0;
      }
      for (i = 0; i < NV; i++) {
        var u1 = (i + 1) % NV, nu = NRM[i];
        if (!hasStorey(i)) {
          /* no setback here: all that is needed is the parapet's INNER face on
             the FAR side, so the eye meets stone across the top of the mass
             instead of sky. Culled by the inverted normal, so it is exactly
             the segments the outer wall does not draw. */
          if (!ctx.faceVisible(nu[0], nu[1])) {
            var qf0 = [pt(A[i][0], A[i][1], DECK_Z), pt(A[u1][0], A[u1][1], DECK_Z),
                       pt(A[u1][0], A[u1][1], TOPV[u1]), pt(A[i][0], A[i][1], TOPV[i])];
            push(qf0, SPLIT, -nu[0], -nu[1], 0, 0, nearD(qf0) + 0.30);
          }
          continue;
        }
        if (ctx.faceVisible(nu[0], nu[1])) {
          var qu = [pt(UPP[i][0], UPP[i][1], TERRV[i]), pt(UPP[u1][0], UPP[u1][1], TERRV[u1]),
                    pt(UPP[u1][0], UPP[u1][1], PARA - 1.0), pt(UPP[i][0], UPP[i][1], PARA - 1.0)];
          push(qu, SPLIT, nu[0], nu[1], 0, 0.35);
          /* its own capstone, the same 1.5 ft tapestry cap as below */
          var qc = [pt(UPP[i][0], UPP[i][1], PARA - 1.0), pt(UPP[u1][0], UPP[u1][1], PARA - 1.0),
                    pt(UPP[u1][0], UPP[u1][1], PARA), pt(UPP[i][0], UPP[i][1], PARA)];
          push(qc, TAPES, nu[0], nu[1], 0, 0.5);
        } else {
          var qf = [pt(UPP[i][0], UPP[i][1], DECK_Z), pt(UPP[u1][0], UPP[u1][1], DECK_Z),
                    pt(UPP[u1][0], UPP[u1][1], PARA), pt(UPP[i][0], UPP[i][1], PARA)];
          push(qf, SPLIT, -nu[0], -nu[1], 0, 0, nearD(qf) + 0.30);
          /* AND THE FAR SIDE'S LOWER PARAPET, seen from the terrace behind it.
             A 3.5 ft upstand does not hide a terrace from a camera this high,
             so on the far side the eye looks over the outer parapet and down
             onto the walked roof. Without this face it met two pale coping
             lines with roof tone on both sides and no wall between them, which
             read as a tear in the roof rather than as a terrace. */
          var qp = [pt(A[i][0], A[i][1], TERRV[i]), pt(A[u1][0], A[u1][1], TERRV[u1]),
                    pt(A[u1][0], A[u1][1], TOPV[u1]), pt(A[i][0], A[i][1], TOPV[i])];
          push(qp, SPLIT, -nu[0], -nu[1], 0, 0, nearD(qp) + 0.10);
        }
      }
      /* the fifth storey's capstone TOP face, sky-facing, on every segment that
         has a fifth storey at all */
      for (i = 0; i < NV; i++) {
        var k1 = (i + 1) % NV;
        if (!hasStorey(i)) continue;
        /* LOCAL DEPTH. On a global ROOF_D + 0.40 this face tied with the
           nearest deck strip and lost to it at some segments and not others,
           which drew a comb of dark teeth along the whole coping. Its own
           nearest corner sits 1.5 ft outboard of the strip's, so a local
           depth beats the strip beside it at EVERY station and ties nowhere. */
        var qk = [pt(UPP[i][0], UPP[i][1], PARA), pt(UPP[k1][0], UPP[k1][1], PARA),
                  pt(DECKP[k1][0], DECKP[k1][1], PARA - 0.16), pt(DECKP[i][0], DECKP[i][1], PARA - 0.16)];
        push(qk, TAPES, 0, 0, 1, 0, H.depthOf(qk) + 1.2);
      }

      /* --- THE UPPER DECK, AND THE TRAP THAT COST THIS ROUND TWO RENDERS ---
         A big slab may not carry ONE depth. The first version of this block
         drew the deck as a single polygon sorted on ROOF_D, the nearest corner
         of the whole ring, and reasoned that because ROOF_D is computed over
         the INSET line every wall in front of it must be nearer. That is true
         only STATION BY STATION. ROOF_D is a single number taken from the
         nearest point of the whole deck, so it also beats the fifth storey's
         wall at every OTHER station: the north wall of the fifth storey
         vanished under the deck and the roof read as a torn edge with the
         walked terrace hanging outside it. Colouring the two surfaces and
         re-rendering is what showed it; the arithmetic had looked right twice.
         The cure is that a surface this size sorts LOCALLY. The deck is drawn
         as concentric strips, each a quad with its own corners, so each strip
         argues only with what is actually beside it. Strips take their NEAREST
         corner, which is what lets a strip cover the walked roof behind it
         while still losing to the wall standing in front of it. The core is
         small, deep inside, and can reach nothing. */
      /* SHALLOW RINGS. offN slides each point down its own normal, which cannot
         fold where the local radius exceeds the offset and DOES fold where it
         does not. Stepping 26 ft further in on a line already 27.5 ft inside
         the trace put the innermost ring past the centre of curvature at the
         west end and threw a straight-edged grey spike out through the roof.
         The rings only carry tone now - the deck sorts on one measured depth -
         so they need no depth at all, and 10 ft is inside every radius here. */
      /* the strips share the deck's own ceiling, so where the plan turns too
         tightly to take a deeper inset they collapse onto the deck line and
         draw nothing rather than folding. Measured fold-free at 0.46. */
      /* the strips share the deck's own measured ceiling, so where the plan
         turns too tightly to take a deeper inset they collapse onto the deck
         line and draw nothing rather than folding. A 3.5 ft parapet throws a
         band of this order across a roof, and it is the only thing that tells
         the eye the deck is bounded rather than open ground. */
      var RING = [DECKP, insetA(10.5, 0.46), insetA(25.5, 0.46)];
      var TONE = [ROOFC2, ROOFC];          /* the parapet's shadow, then membrane */
      for (var rg = 0; rg < 2; rg++) {
        for (i = 0; i < NV; i++) {
          var g1 = (i + 1) % NV;
          var qg = [pt(RING[rg][i][0], RING[rg][i][1], DECK_Z),
                    pt(RING[rg][g1][0], RING[rg][g1][1], DECK_Z),
                    pt(RING[rg + 1][g1][0], RING[rg + 1][g1][1], DECK_Z),
                    pt(RING[rg + 1][i][0], RING[rg + 1][i][1], DECK_Z)];
          /* FARTHEST corner, not nearest, and this is the whole comb of teeth.
             A strip's NEAREST corner can sit further forward than the fifth
             storey wall's own farthest corner wherever the wall runs oblique
             to the eye, so the roof kept winning at every third or fourth
             station and cut the coping into a row of dark square teeth. On the
             farthest corner a strip is behind the wall in front of it at EVERY
             station, and still ahead of the walked roof behind it, because
             that surface lies 26 ft further out again. */
          push(qg, TONE[rg], 0, 0, 1, 0, DECK_SORT + 0.02 * rg);
        }
      }
      var dq = [];
      for (i = 0; i < NV; i++) dq.push(pt(RING[2][i][0], RING[2][i][1], DECK_Z));
      var rf = ctx.shade(ROOFC, 0, 0, 1);
      items.push({ svg: ctx.poly(dq, rf, rf, 0.6), depth: DECK_SORT });
    })();

    /* ---------- 7. the dome ----------
       PUBLISHED: "the architect designed a LOWER STEPPED dome for the Potomac
       with an opening at its center", precast glass-fibre-reinforced concrete,
       and 120 ft to its top against a 99 ft building. So it rises 21 ft over
       the parapet, DERIVED, where the previous version stood it 41.8 ft up on
       an invented 15 ft cylindrical drum that no source describes and that
       read as an observatory. There is no drum here. The steps are real: a
       horizontal tread and a vertical riser per course, which is what makes a
       stepped dome look stepped instead of like a smooth cone.
       Its depth is explicit and forward of the roof, because a cap 21 ft above
       the parapet can never be occluded by anything in this model. */
    (function () {
      var N = 36, k, i;
      function ringQuads(r0, r1, z0, z1, fill, order) {
        for (i = 0; i < N; i++) {
          var a0 = (i / N) * Math.PI * 2, a1 = ((i + 1.04) / N) * Math.PI * 2;
          var am = (a0 + a1) / 2, nx = Math.cos(am), ny = Math.sin(am);
          var q = [pt(ROT_U + r0 * Math.cos(a0), ROT_V + r0 * Math.sin(a0), z0),
                   pt(ROT_U + r0 * Math.cos(a1), ROT_V + r0 * Math.sin(a1), z0),
                   pt(ROT_U + r1 * Math.cos(a1), ROT_V + r1 * Math.sin(a1), z1),
                   pt(ROT_U + r1 * Math.cos(a0), ROT_V + r1 * Math.sin(a0), z1)];
          /* no horizontal-normal cull here: a doubly curved cap's far gores
             can face up and be plainly visible, and culling them on cos/sin
             alone left a bright crescent of the ring below showing through */
          var f = ctx.shade(fill, (z1 - z0) > 0.01 ? nx : 0,
                                  (z1 - z0) > 0.01 ? ny : 0,
                                  (z1 - z0) > 0.01 ? 0.3 : 1);
          items.push({ svg: ctx.poly(q, f, f, 0.6),
                       depth: ROOF_D + 12 + order + H.depthOf(q) * 0.004 });
        }
      }
      /* THE SPRINGING RADIUS IS MEASURED, NOT CHOSEN. The last round set it to
         DOME_R + 3 = 43 ft against a prow whose wall stands about 41 ft from
         the DERIVED rotunda centre, so the dome oversailed its own support and
         hung out over the lawn. It is now the distance from that centre to the
         NEAREST point of the deck it stands on, less a 3 ft margin, so the cap
         cannot leave the roof whatever the plan does. The published diameters
         conflict four ways and every one of them is larger than this; the
         header records that conflict, and the model draws what the measured
         prow can actually carry. */
      var R0 = (function () {
        var mn = 1e9;
        for (var j0 = 0; j0 < NV; j0++)
          mn = Math.min(mn, Math.hypot(DECKP[j0][0] - ROT_U, DECKP[j0][1] - ROT_V));
        return Math.max(OCU_R + 8, mn - 3.0);
      })();
      /* EVEN TREADS, DIMINISHING RISERS. The last round used r = R sqrt(1-k/S)
         at even heights, which is a hemisphere's profile: it crowds the treads
         at the outside and stacks six near-equal discs, and the render read as
         a pile of pancakes. A stepped dome reads as steps when the tread width
         is CONSTANT and the risers shorten toward the crown, tall at the
         springing and almost flat at the oculus, which is also what "a LOWER
         stepped dome" describes. Treads are 1/S of the span each; risers
         follow 1-(1-x)^1.8, so the first is about five times the last. */
      var prevR = R0, prevZ = PARA - 1.0;
      for (k = 1; k <= DOME_STEPS; k++) {
        var x = k / DOME_STEPS;
        var r = R0 + (OCU_R - R0) * x;
        var z = PARA - 1.0 + DOME_RISE * (1 - Math.pow(1 - x, 1.8));
        ringQuads(prevR, prevR, prevZ, z, k % 2 ? DOMEC : DOMED, k * 0.02);        /* riser */
        ringQuads(prevR, r, z, z, k % 2 ? DOMED : DOMEC, k * 0.02 + 0.01);          /* tread */
        prevR = r; prevZ = z;
      }
      /* the published oculus, open to the heavens */
      var hole = [];
      for (var j = 0; j < N; j++) {
        var aj = (j / N) * Math.PI * 2;
        hole.push(pt(ROT_U + OCU_R * 0.98 * Math.cos(aj),
                     ROT_V + OCU_R * 0.98 * Math.sin(aj), prevZ - 2.6));
      }
      items.push({ svg: ctx.poly(hole, "#2b3138", "#2b3138", 0.6),
                   depth: ROOF_D + 11.8 });
    })();

    /* ---------- 8. the ground shadow ----------
       H.shadow builds one ring of footprint-forward plus footprint-reversed:
       on this 132-vertex concave blob the two loops nearly coincide and wind
       opposite, so their areas cancelled and the nonzero fill rule left a
       120-point bowtie enclosing 200 square pixels, self-intersecting twice,
       and invisible from half the compass. A 99 ft mass was standing on
       nothing. The convex hull of the footprint and its slid copy is one
       simple polygon that cannot fold, which is what a shadow device needs. */
    (function () {
      var A = poly(FACED), src = [], i;
      var dx = -0.55 * PARA * 0.9, dy = -0.35 * PARA * 0.9;
      for (i = 0; i < NV; i += 2) {
        src.push([A[i][0], A[i][1]]);
        src.push([A[i][0] + dx, A[i][1] + dy]);
      }
      src.sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
      function cross(o, a, b) {
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
      }
      var lower = [], upper = [];
      for (i = 0; i < src.length; i++) {
        while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], src[i]) <= 0) lower.pop();
        lower.push(src[i]);
      }
      for (i = src.length - 1; i >= 0; i--) {
        while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], src[i]) <= 0) upper.pop();
        upper.push(src[i]);
      }
      lower.pop(); upper.pop();
      var hull = lower.concat(upper).map(function (c) { return pt(c[0], c[1], 0.3); });
      items.push({ svg: ctx.poly(hull, "#000", null, 0, ' opacity="0.16"'),
                   depth: -1e9 + 2 });
    })();

    /* ---------- 9. the veterans memorial ----------
       PUBLISHED position, "Set at the boundary between the NMAI Upland
       Hardwood Forest and Lowland Freshwater Wetland", and a published 50 ft
       plaza. The stainless ring's own diameter has no first-party source and
       the 12 ft figure that circulates does not; the ring below is drawn at a
       stated assumption and the plaza at the published size. */
    (function () {
      var mu = 196, mv = 86;                        /* the forest / wetland seam */
      shape(ell(mu, mv, 25, 25, 0, 26), 0.10, PAVE, -1e9 + 1.30);   /* 50 ft plaza */
      var RR = 6.0;                                 /* assumption: the steel circle */
      var K = 22;
      for (var i = 0; i < K; i++) {
        var a0 = i / K * Math.PI * 2, a1 = (i + 1) / K * Math.PI * 2;
        var nx = Math.cos((a0 + a1) / 2), ny = Math.sin((a0 + a1) / 2);
        if (!ctx.faceVisible(nx, ny)) continue;
        push([pt(mu + 2.2 * Math.cos(a0), mv + 2.2 * Math.sin(a0), 0),
              pt(mu + 2.2 * Math.cos(a1), mv + 2.2 * Math.sin(a1), 0),
              pt(mu + 2.2 * Math.cos(a1), mv + 2.2 * Math.sin(a1), 3.2),
              pt(mu + 2.2 * Math.cos(a0), mv + 2.2 * Math.sin(a0), 3.2)],
             GRANIT, nx, ny, 0, 0.4);               /* the carved stone drum */
      }
      for (var j = 0; j < K; j++) {
        var b0 = j / K * Math.PI * 2, b1 = (j + 1) / K * Math.PI * 2;
        push([pt(mu + RR * Math.cos(b0), mv + RR * Math.sin(b0), 3.2),
              pt(mu + RR * Math.cos(b1), mv + RR * Math.sin(b1), 3.2),
              pt(mu + (RR - 0.7) * Math.cos(b1), mv + (RR - 0.7) * Math.sin(b1), 3.6),
              pt(mu + (RR - 0.7) * Math.cos(b0), mv + (RR - 0.7) * Math.sin(b0), 3.6)],
             STEEL, Math.cos((b0 + b1) / 2), Math.sin((b0 + b1) / 2), 0.4, 0.8);
      }
    })();

    /* ---------- 10. rocks, stones and trees ---------- */
    function inPlan(u, v) {
      var c = false;
      for (var i = 0, j = NV - 1; i < NV; j = i++) {
        var a = V(i), b = V(j);
        if ((a[1] > v) !== (b[1] > v) &&
            u < (b[0] - a[0]) * (v - a[1]) / (b[1] - a[1]) + a[0]) c = !c;
      }
      return c;
    }
    /* a boulder is not a flat-topped cone. The top ring is pulled in hard and
       its vertices are jittered in z, and a contact ellipse stops it floating */
    function boulder(u, v, r, hgt, fill, seedn) {
      var K = 7, top = [];
      for (var i = 0; i < K; i++) {
        var a0 = (i / K) * Math.PI * 2, a1 = ((i + 1) / K) * Math.PI * 2;
        var r0 = r * (0.78 + 0.22 * ((i * 7 + seedn) % 5) / 4);
        var r1 = r * (0.78 + 0.22 * (((i + 1) * 7 + seedn) % 5) / 4);
        var h0 = hgt * (0.74 + 0.26 * ((i * 3 + seedn) % 4) / 3);
        var h1 = hgt * (0.74 + 0.26 * (((i + 1) * 3 + seedn) % 4) / 3);
        var nx = Math.cos((a0 + a1) / 2), ny = Math.sin((a0 + a1) / 2);
        top.push([u + r0 * 0.4 * Math.cos(a0), v + r0 * 0.4 * Math.sin(a0), h0]);
        if (!ctx.faceVisible(nx, ny)) continue;
        push([pt(u + r0 * Math.cos(a0), v + r0 * Math.sin(a0), 0),
              pt(u + r1 * Math.cos(a1), v + r1 * Math.sin(a1), 0),
              pt(u + r1 * 0.4 * Math.cos(a1), v + r1 * 0.4 * Math.sin(a1), h1),
              pt(u + r0 * 0.4 * Math.cos(a0), v + r0 * 0.4 * Math.sin(a0), h0)],
             fill, nx, ny, 0.2, 0.3);
      }
      push(top.map(function (c) { return pt(c[0], c[1], c[2]); }), fill, 0, 0, 1, 0.5);
      var ring = [];
      for (var j2 = 0; j2 < 9; j2++) {
        var aj = j2 / 9 * Math.PI * 2;
        ring.push(pt(u + r * 1.15 * Math.cos(aj), v + r * 1.15 * Math.sin(aj), 0.14));
      }
      items.push({ svg: ctx.poly(ring, "#000", null, 0, ' opacity="0.13"'),
                   depth: H.depthOf(ring) - 0.4 });
    }
    (function () {
      var seed = 20040921;   /* the opening date, so the scatter is fixed */
      function rnd() { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }
      var placed = 0, tries = 0;
      while (placed < 40 && tries < 4000) {
        tries++;
        var u = -240 + rnd() * 500, v = -220 + rnd() * 356;
        if (inPlan(u, v)) continue;
        var d = 1e9;
        for (var i = 0; i < NV; i++) {
          var a = V(i);
          d = Math.min(d, Math.hypot(a[0] - u, a[1] - v));
        }
        if (d < 14) continue;          /* not jammed against the wall */
        boulder(u, v, 2.6 + rnd() * 2.4, 1.8 + rnd() * 1.8, ROCK, placed);
        placed++;
      }
    })();
    /* the four cardinal stones, on the derived rotunda centre's true radials,
       AT EQUAL RADIUS. The published rule is the radial; the distance is not
       published, so drawing four different distances - as the previous version
       did, the west one 4.7 times the east - asserts something no source says
       and reads as scatter rather than as a cross. About 6,000 lb of granite
       is roughly a 3.3 ft cube. North Canada, south Chile, east Maryland,
       west Hawaii. */
    (function () {
      /* one rule, applied four times: walk out along the true radial from the
         DERIVED rotunda centre until the stone is clear of the traced plan by
         a 20 ft standoff, and stop there. Equal radius is impossible on an
         asymmetric plan, and four hand-picked distances would be four
         assumptions instead of one. */
      var DIR = [[0, 1], [0, -1], [1, 0], [-1, 0]];
      DIR.forEach(function (d, k) {
        var r = 20;
        while (r < 460) {
          var u = ROT_U + d[0] * r, v = ROT_V + d[1] * r;
          if (!inPlan(u, v)) {
            var clear = 1e9;
            for (var i = 0; i < NV; i++) {
              var a = V(i);
              clear = Math.min(clear, Math.hypot(a[0] - u, a[1] - v));
            }
            if (clear >= 20) break;
          }
          r += 2;
        }
        boulder(ROT_U + d[0] * r, ROT_V + d[1] * r, 3.4, 3.0, GRANIT, k * 3);
      });
    })();
    /* the published upland hardwood forest on the north side. A canopy with no
       vertical geometry has no silhouette from a low camera and no shaded
       side from any camera, so each canopy is a closed solid here rather than
       three stacked discs on a stick. The plant count is published at more
       than 27,000 and is undrawable, so the canopy claims no count. The two
       American elms in the meadow ARE published as two. */
    function tree(u, v, hgt, r, fill, dark) {
      var K = 8, i, k;
      for (i = 0; i < K; i++) {                       /* the trunk, a prism */
        var t0 = i / K * Math.PI * 2, t1 = (i + 1) / K * Math.PI * 2;
        var nx = Math.cos((t0 + t1) / 2), ny = Math.sin((t0 + t1) / 2);
        if (!ctx.faceVisible(nx, ny)) continue;
        push([pt(u + 1.0 * Math.cos(t0), v + 1.0 * Math.sin(t0), 0),
              pt(u + 1.0 * Math.cos(t1), v + 1.0 * Math.sin(t1), 0),
              pt(u + 1.0 * Math.cos(t1), v + 1.0 * Math.sin(t1), hgt * 0.5),
              pt(u + 1.0 * Math.cos(t0), v + 1.0 * Math.sin(t0), hgt * 0.5)],
             TRUNK, nx, ny, 0, 0.2);
      }
      var LEV = [[0.46, 1.00], [0.72, 0.86], [0.90, 0.52], [1.00, 0.0]];
      for (k = 0; k < LEV.length - 1; k++) {
        var zA = hgt * LEV[k][0], zB = hgt * LEV[k + 1][0];
        var rA = r * LEV[k][1], rB = r * LEV[k + 1][1];
        for (i = 0; i < K; i++) {
          var a0 = i / K * Math.PI * 2, a1 = (i + 1) / K * Math.PI * 2;
          var mx = Math.cos((a0 + a1) / 2), my = Math.sin((a0 + a1) / 2);
          if (!ctx.faceVisible(mx, my)) continue;
          push([pt(u + rA * Math.cos(a0), v + rA * Math.sin(a0), zA),
                pt(u + rA * Math.cos(a1), v + rA * Math.sin(a1), zA),
                pt(u + rB * Math.cos(a1), v + rB * Math.sin(a1), zB),
                pt(u + rB * Math.cos(a0), v + rB * Math.sin(a0), zB)],
               k === 0 ? dark : fill, mx, my, 0.35, 0.3 + k * 0.2);
        }
      }
      var cap = [];
      for (i = 0; i < K; i++) {
        var c0 = i / K * Math.PI * 2;
        cap.push(pt(u + r * 0.52 * Math.cos(c0), v + r * 0.52 * Math.sin(c0), hgt * 0.90));
      }
      push(cap, fill, 0, 0, 1, 0.9);
      var sh = [];
      for (i = 0; i < 9; i++) {
        var s0 = i / 9 * Math.PI * 2;
        sh.push(pt(u + r * 0.8 * Math.cos(s0), v + r * 0.8 * Math.sin(s0), 0.16));
      }
      items.push({ svg: ctx.poly(sh, "#000", null, 0, ' opacity="0.12"'),
                   depth: H.depthOf(sh) - 0.4 });
    }
    (function () {
      var seed = 145;   /* the published species count, used only as a seed */
      function rnd() { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }
      /* THE FOREST ELLIPSE OVERLAPS THE BUILDING, and the last round planted
         into it without checking. Three of eighteen trees stood INSIDE the
         footprint - trunks at (-12.4, 59.3), (76.9, 66.3) and (66.6, 58.0),
         all inside the plan polygon - so a 32 ft canopy grew out of the north
         wall. The boulders had carried this test since they were written; the
         trees never did. Same rule as the boulders now: inside the plan, or
         jammed against it, is rejected and re-drawn, and the trial counter
         means a crowded site drops a tree rather than looping. */
      var grown = 0, ttries = 0;
      while (grown < 16 && ttries < 600) {
        ttries++;
        var a = rnd() * Math.PI * 2, rr = Math.sqrt(rnd());
        var u = 10 + Math.cos(a) * rr * 104, v = 106 + Math.sin(a) * rr * 62;
        if (inPlan(u, v)) continue;
        var cl = 1e9;
        for (var ci = 0; ci < NV; ci++) {
          var cp = V(ci);
          cl = Math.min(cl, Math.hypot(cp[0] - u, cp[1] - v));
        }
        if (cl < 16) continue;        /* a canopy is 11 to 16 ft in radius */
        tree(u, v, 32 + rnd() * 14, 11 + rnd() * 5, CANOPY, CANOP2);
        grown++;
      }
      tree(-70, -186, 44, 17, CANOPY, CANOP2);   /* the two published American elms, */
      tree(-212, -134, 44, 17, CANOPY, CANOP2);  /* one in each half of the meadow */
    })();

    return items;
  };
})();
