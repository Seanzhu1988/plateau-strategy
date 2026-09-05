/* dc-form-botanic.js: the United States Botanic Garden Conservatory, 1933.
 *
 * Built to MODEL_STANDARD.md. What stood here before was the generic "block"
 * form: one extruded box 20 m tall. This building is a GLASS DOME behind a
 * STONE SCREEN, and a box hides both of the only two things it is.
 *
 * WHAT IS MODELLED: the 1933 Conservatory at 100 Maryland Avenue SW, which is
 * the long rusticated limestone front facing NORTH toward the Capitol with the
 * aluminium-and-glass greenhouse and its Palm House dome behind it. NOT the
 * demolished 1850/1867 Victorian conservatory across the street, not Bartholdi
 * Park, not the 2006 National Garden, not the Anacostia production house.
 *
 * STYLE: the glasshouse behind an orangery front. STYLES.md does not carry
 * this idiom; its tells were supplied with this run's research brief and are
 * what the geometry below is built on. The two halves speak different
 * languages and neither borrows the other's: the stone is rusticated ashlar,
 * round-arched, flat-roofed and balustraded; the glass is frame-and-glazing
 * with no wall at all, ridge-and-furrow roofs glazed on both slopes, a tall
 * central house rising clear of low ranges, and a meridian-ribbed dome on a
 * drum. A round arch here is h = a, so d = 0 in the book's arch formula.
 *
 *
 * ============================ PUBLISHED NUMBERS ============================
 *
 * 83 ft (25.30 m), THE HEIGHT OF THE STRUCTURE, and the figure this model
 *   scales to: "The aluminum structure, measuring 83 feet high, was the
 *   largest of its kind at the time it was built"
 *   https://mgnv.org/regional-gardens/regional-gardens-usbg/
 * 80 ft ABOVE THE GROUND, the only figure any source qualifies with a datum:
 *   "the great Palm House, which rises 80 feet above the ground and is covered
 *   by a dome 67 feet in diameter"
 *   http://web.archive.org/web/20210427032318/https://capitol.gov/html/VGN_2010061438193.html
 * 67 ft DOME DIAMETER, same source. The single most useful number in the build.
 * 93 ft, published today by both custodians but always inside a description of
 *   the ROOM, not the structure: "a dome that rises to 93 feet and a raised
 *   mezzanine level" https://www.usbg.gov/gardens-plants/conservatory ;
 *   "The 93-feet-tall Tropics house"
 *   https://www.aoc.gov/explore-capitol-campus/buildings-grounds/us-botanic-garden/conservatory
 * 11 arched openings: "eleven lofty arched openings" (aoc.gov, above).
 * 4 carved mascaron keystones on ALTERNATING keystones, Pan, Pomona, Triton
 *   and Flora, by Leon Hermant, and explicitly the only sculptural decoration
 *   on the whole building (capitol.gov archive, above).
 * FLAT ROOF WITH A BALUSTRADE, and PRONOUNCED RUSTICATION on the limestone
 *   (capitol.gov archive, above).
 * 200 ft interior lobby behind the front (capitol.gov archive, above).
 * 28,944 sq ft under glass (aoc.gov, above); "almost 30,000 sq ft of growing
 *   space", the largest aluminium building in the United States when built,
 *   Bennett Parsons & Frost architects, Lord & Burnham greenhouse fabricators,
 *   $633,585 (capitol.gov archive, above).
 * 10 garden rooms under glass, 2 courtyard gardens, 2 exhibit galleries East
 *   and West (usbg.gov, above).
 * "Aside from a modest addition at the rear of the building, the historic
 *   Conservatory exterior remains unchanged from its 1933 appearance"
 *   https://www.aoc.gov/what-we-do/projects/conservatory-facade-and-roof-restoration
 *   which is the licence for building a 1933-accurate model of what stands.
 *
 * THE HEIGHT CONFLICT, taken rather than hidden. 83 ft is the only figure any
 * source calls the height of the STRUCTURE and 80 ft the only one qualified
 * "above the ground"; they agree to within 3 ft. 93 ft is read here as the
 * INTERIOR floor-to-apex rise of the Tropics room, which the same page
 * corroborates by putting the canopy "24 feet below" the mezzanine. So the
 * exterior apex is drawn at 83 ft and 93 ft is NOT drawn as an exterior
 * height, because no source reached says it is one. Heights TRUE.
 *
 *
 * ================= PLAN, MEASURED THIS RUN FROM OSM NODES =================
 *
 * The research brief carried OSM bounding boxes. This run fetched the actual
 * node coordinates of all four ways from api.openstreetmap.org and projected
 * them into feet about the dc-3d.js place point (38.888, -77.013), using
 * dc-3d.js's own projection constants. That turned three of the brief's named
 * gaps into measurements, and it changed the shape of the building.
 *
 *   way 905917535 (the polygon carrying the 100 Maryland Avenue SW address)
 *   way 66418744  (the whole conservatory envelope)
 *   way 66418867  (the west courtyard, a real hole)
 *   way 66418920  (the east courtyard, a real hole)
 *
 * THE FRONT BLOCK IS NOT A SLAB. The brief's "288.2 ft by 79.2 ft" is a
 * bounding box. The nodes say it is a shallow arcaded screen only 23.4 ft deep
 * running 195.9 ft between two deep END PAVILIONS each about 46 ft wide and
 * 78 ft deep:
 *   central arcade range   u -70.3 .. 125.6,  v  86.0 .. 109.4
 *   west pavilion          u -116.0 .. -70.3, v  31.0 .. 109.4
 *   east pavilion          u  125.6 .. 172.2, v  31.0 .. 109.4
 * overall front width 288.2 ft, which matches the brief exactly.
 *
 * AND THAT SETTLES THE BRIEF'S BAY-SPACING GAP. Two readings were offered and
 * they disagreed: 288.2 / 11 = 26.2 ft across the whole front, or 200 / 11 =
 * 18.2 ft across the published lobby. The measured central range is 195.9 ft
 * against a published 200 ft lobby, so the lobby IS the central range and the
 * eleven arches are its bays: 195.9 / 11 = 17.81 ft. The check that this is
 * the right reading is that the MIDDLE of eleven such bays lands at u = 27.6,
 * and the building's axis of symmetry, derived three independent ways, is
 * u = 27.3 (front range centre 27.65, front block bounding centre 28.1,
 * mid-point between the two courtyards 26.05). A count and a dimension that
 * agree are worth more than either alone.
 *
 * THE TWO END PAVILIONS ARE THE PUBLISHED EAST AND WEST EXHIBIT GALLERIES.
 * That is an inference from the plan plus the published room list, not a
 * published statement, and it is why their north faces are drawn as blank
 * rusticated stone: the published arch count is eleven, all eleven fall in the
 * measured central range, and nothing reached says what is in the pavilion
 * fronts. If they carry doors, this model is missing them. Absence over
 * invention.
 *
 * THE GLASSHOUSE, from way 66418744:
 *   main body      u -104.5 .. 157.7,  v -76.0 .. 86.0   (262.2 by 162.0)
 *   south range    u  -64.8 .. 118.1,  v -110.0 .. -76.0 (182.9 by 34.0)
 * The 182.9 ft width of the south range reproduces the brief's figure to the
 * tenth of a foot, which is the check that the projection is right.
 *
 * THE COURTYARDS, from ways 66418867 and 66418920, are each an L: a court
 * about 58 by 68 ft with a 30 by 16 ft arm at its north end. This model draws
 * each as its full measured bounding rectangle, which absorbs the arm:
 *   west court  u -75.0 .. -16.1,  v -46.4 .. 38.4   (58.9 by 84.8)
 *   east court  u  68.2 .. 126.3,  v -46.4 .. 38.4   (58.1 by 84.8)
 * Those are the brief's own published courtyard sizes, and the simplification
 * is named here rather than left for a reader to find.
 *
 * AND THAT LOCATES THE PALM HOUSE, which is the whole point of the courtyards.
 * The bay between them is 84.3 ft wide, centred on u = 26.05, and the
 * published 67 ft dome sits in it with 8.6 ft to spare each side. The dome
 * centre is drawn at (u 26.05, v -4.0), the centre of that bay in both
 * directions. DERIVED, from measurement, not published.
 *
 * ALSO SETTLED: the brief flagged a plan contradiction, Wikipedia placing a
 * courtyard "on the south side of the building" against OSM showing two
 * symmetric courts in the northern half. The measured nodes are unambiguous:
 * two courts, mirror images, symmetric about u = 26, both spanning v -46 to
 * +38, i.e. the middle-north of the glasshouse. The model follows the
 * measurement and says so.
 *
 * POSITION. The dc-3d.js place point sits 28 ft west of the building's own
 * plan centre. The model is drawn at the TRUE measured offsets from that
 * point rather than recentred, so the building stands where it stands. At Mall
 * scale 28 ft is nothing; the point of dc-3d.js is that positions are real.
 *
 *
 * ============================== NAMED GAPS ==============================
 *
 * Guessed nowhere. Every one of these is an assumption drawn on purpose and
 * listed here so it can be corrected, not smoothed into the geometry.
 *
 *  - NO PUBLISHED HEIGHT FOR THE LIMESTONE FRONT. The only word any source
 *    gives is "lofty". Drawn 30 ft to the top of the balustrade: wall 2.5 to
 *    24, cornice 24 to 26.5, balustrade 26.5 to 30. Proportioned from the
 *    MEASURED 17.81 ft bay, which is the only real constraint available.
 *  - NO PUBLISHED ARCH GEOMETRY: no width, no springing, no rise, no profile.
 *    Drawn SEMICIRCULAR, opening 10.6 ft wide springing at 13 ft to an apex at
 *    18.3 ft. Semicircular because the idiom is neoclassical revival, where a
 *    point would be a century out of place; that is a style inference and not
 *    a published number, and it is the one place this file reasons from the
 *    styles book rather than from a source.
 *  - NO PUBLISHED BASE. No step count, no plinth, nothing about whether the
 *    Maryland Avenue entrance is raised at all. Drawn as a 2.5 ft water table
 *    with a three-step centre flight, and a 1.8 ft masonry dwarf wall under
 *    the glass, which is how greenhouses of this type are built. Assumption.
 *  - NO PUBLISHED DOME PROFILE. Drawn HEMISPHERICAL, because that is the only
 *    profile the two published numbers determine without a third: 67 ft
 *    diameter and an 83 ft apex force the springing to 83 - 33.5 = 49.5 ft. If
 *    the real dome is ogival the springing is higher and the drum shorter.
 *  - NO PUBLISHED CROWN. Drawn as a glazed crown lantern with a cap. The apex
 *    stays at the published 83 ft either way.
 *  - NO PUBLISHED EAVE OR RIDGE HEIGHT for the low glass ranges and no
 *    published roof pitch. Drawn: outer and south ranges eaves 17 ridge 21,
 *    the two cross ranges eaves 19 ridge 23, the Palm House eaves 34. The
 *    whole stepped silhouette between the 83 ft dome and the ground is
 *    undimensioned in every source reached.
 *  - NO PUBLISHED GLAZING BAR SPACING OR PANE COUNT, in 1933, in the 1997 to
 *    2001 reglazing, or in the 2019 roof restoration. Since the bar grid IS
 *    the elevation in this idiom, this is a real hole. Ribs are drawn every
 *    6 ft and furrows every 12 ft as a legible RHYTHM, not as a claim.
 *  - NO PUBLISHED LIMESTONE TYPE OR QUARRY. Indiana and Bedford were both
 *    searched for by name and neither appears anywhere reached. Drawn as
 *    generic pale limestone.
 *  - WHICH FOUR BAYS carry the mascarons is not published, only that there are
 *    four heads on alternating keystones. Drawn on bays 2, 4, 8 and 10, which
 *    is the only arrangement that is both alternating and symmetric about the
 *    centre bay of eleven.
 *  - NO PUBLISHED DIMENSIONS for the East and West galleries, or for any
 *    garden room other than the Tropics.
 *  - NO HABS DOCUMENTATION. loc.gov refused this run as it refused the last.
 *    Measured drawings would settle the front height, the arch geometry and
 *    the step count in one fetch, and that is the highest-value thing a later
 *    run could get.
 *  - THE MEZZANINE, published as looking down on the canopy 24 ft below, is
 *    interior and is not drawn.
 *
 *
 * ================================ SCALE ================================
 *
 * FT = (p.h * VE) / 83, so the published 83 ft apex lands exactly on the place
 * height. dc-3d.js line 72 currently carries h: 20 for this key, which is too
 * low against EVERY published figure (80 ft = 24.4 m, 83 ft = 25.3 m, 93 ft =
 * 28.4 m). The correction is reported, not made here: dc-3d.js is shared and
 * this run does not edit it. Until it is corrected the model renders at the
 * right proportions and the wrong absolute height.
 *
 *
 * ================================ PAINT ================================
 *
 * depth is the projected ry, sorted ascending, so a larger depth paints later
 * and nearer. H.depthOf returns the FARTHEST corner of a face, which is the
 * safe default. The explicit depths here, and why each exists:
 *  - the two courtyard floors sit 900 back, so no range can be painted over by
 *    the hole it stands beside;
 *  - the Palm House block's walls sit 20 back, so the low ranges and their
 *    roofs, which really do stand in front of it, paint over its lower half
 *    while its upper half rises clear;
 *  - the front block's flat roof deck carries its own far-corner depth so the
 *    balustrade standing on its near edge paints after it;
 *  - decoration on the stone front (rustication, voussoirs, voids, keystones,
 *    mascarons) carries a rising bias stack so each layer covers the one
 *    under it rather than sorting against it by a hair;
 *  - ridge-and-furrow slopes overrun their neighbours by a tenth of a foot,
 *    because abutting quads round apart under toFixed(1) and leave a ladder of
 *    pale seams, which is the Hirshhorn ring's starburst and the Vietnam
 *    bank's stripes arriving a third time.
 */
(function () {
  var H = window.DC3D.helpers;
  window.DC_FORMS = window.DC_FORMS || {};
  window.DC_FORMS['botanic'] = function (ctx, p, s, VE) {
    var P = ctx.project, items = [];

    /* ---------- scale: the published 83 ft apex lands on the place height ---------- */
    var HPUB = 83;
    var FT = (p.h * VE) / HPUB;      /* metres per foot */
    var m  = FT * s;
    function W(u, v) { return [p.x + u * m, p.y + v * m]; }
    function pt(u, v, z) { return P(p.x + u * m, p.y + v * m, z * FT); }
    function far(q) { return H.depthOf(q); }

    /* the camera, recovered from the projection, so a tilted plane (a roof
       slope, a dome gore, a hip) is culled by its full 3D normal and not only
       by its plan normal. Same recovery the Capitol form uses. */
    var o0 = P(p.x, p.y, 0), ox = P(p.x + 1, p.y, 0), oy = P(p.x, p.y + 1, 0), oz = P(p.x, p.y, 1);
    var sYaw = ox[2] - o0[2], cYaw = oy[2] - o0[2];
    var dzY = oz[1] - o0[1];
    var dhY = Math.abs(cYaw) > Math.abs(sYaw) ? (oy[1] - o0[1]) / cYaw : (ox[1] - o0[1]) / sYaw;
    var tanP = dzY === 0 ? 0.3 : dhY / (-dzY);
    var cP = 1 / Math.sqrt(1 + tanP * tanP), sP = tanP * cP;
    function vis3(nx, ny, nz) { return (nx * sYaw + ny * cYaw) * cP + nz * sP > 0.001; }

    /* ---------- materials, two tones each, warmer on the sunlit side ---------- */
    var LD = [0.55, 0.35, 0.72];     /* the renderer's own light vector */
    function tone(mt, nx, ny, nz) {
      var d = nx * LD[0] + ny * LD[1] + nz * LD[2];
      return ctx.shade(d > 0.05 ? mt.lit : mt.shade, nx, ny, nz);
    }
    var LIME  = { lit: "#ece6d8", shade: "#d4cdbc" };  /* rusticated limestone, quarry not published */
    var LIMD  = { lit: "#f4efe3", shade: "#ded7c6" };  /* dressed stone: cornice, voussoirs, balustrade */
    var BASE  = { lit: "#c9c2b2", shade: "#b2ac9c" };  /* the water table, a greyer stone at the foot */
    var DECK  = { lit: "#b8b5ac", shade: "#a4a199" };  /* the published flat roof behind the balustrade */
    var GLASS = { lit: "#d3e2e6", shade: "#a1b1b9" };  /* the glazing, sky tone and shadow tone */
    var GLASD = { lit: "#dcebee", shade: "#aec0c7" };  /* dome and drum glass, more sky on it */
    var FRAME = { lit: "#949ca1", shade: "#787f84" };  /* ALUMINIUM, not the black iron of a Victorian house */
    var PAVE  = { lit: "#cdcabf", shade: "#b7b4a9" };  /* courtyard paving */
    var JOINT = "#968e7c";                             /* rustication and voussoir joints */
    var VOID  = "#3d4246";                             /* the arched openings */
    var MASC  = "#8b8069";                             /* the carved heads */

    /* ---------------------- the plan, in feet, u east v north ---------------------- */
    /* front block, measured */
    var NF = 109.4;                                   /* the north face, on Maryland Avenue */
    var ARC_U0 = -70.3, ARC_U1 = 125.6, ARC_V0 = 86.0;   /* the arcaded central range */
    var WP_U0 = -116.0, WP_U1 = -70.3;                   /* west pavilion */
    var EP_U0 = 125.6,  EP_U1 = 172.2;                   /* east pavilion */
    var PAV_V0 = 31.0;                                   /* both pavilions run this far south */
    /* glasshouse, measured */
    var G_U0 = -104.5, G_U1 = 157.7, G_V0 = -76.0, G_V1 = 86.0;
    var S_U0 = -64.8,  S_U1 = 118.1, S_V0 = -110.0;      /* the south projecting range */
    var CW_U0 = -75.0, CW_U1 = -16.1;                    /* west courtyard */
    var CE_U0 = 68.2,  CE_U1 = 126.3;                    /* east courtyard */
    var C_V0 = -46.4,  C_V1 = 38.4;                      /* both courtyards, in v */
    /* the Palm House block is the bay between the courtyards */
    var PH_U0 = CW_U1, PH_U1 = CE_U0, PH_V0 = C_V0, PH_V1 = C_V1;
    var DOME_U = (PH_U0 + PH_U1) / 2, DOME_V = (PH_V0 + PH_V1) / 2;   /* 26.05, -4.0 */

    /* ---------------------- the heights, in feet ---------------------- */
    var PLINTH = 2.5, WALLTOP = 24, CORN = 26.5, BAL = 30;   /* the stone front */
    var DWARF = 1.8;                                          /* masonry dwarf wall under the glass */
    var LOW_E = 17, LOW_R = 21;                               /* outer and south ranges */
    var MID_E = 19, MID_R = 23;                               /* the two cross ranges */
    var PH_E  = 34, PH_HIP = 37;                              /* Palm House eaves, and the hip top */
    var DR = 33.5;                                            /* PUBLISHED: 67 ft dome, halved */
    var SPRING = HPUB - DR;                                   /* 49.5, forced by a hemisphere */
    var SHELL_TOP = 77.5;                                     /* where the shell gives way to the lantern */
    var RIB = 6, RIBW = 0.55, FURROW = 12;                    /* the drawn glazing rhythm, a named gap */

    /* ======================= primitives ======================= */

    /* a box in feet. faces 0 south, 1 east, 2 north, 3 west.
       o: {skip:[], noTop, depth, bias, wuT, wvT} */
    function box(cu, cv, wu, wv, z0, h, mt, o) {
      o = o || {};
      var bu = wu / 2, bv = wv / 2;
      var tu = (o.wuT === undefined ? wu : o.wuT) / 2, tv = (o.wvT === undefined ? wv : o.wvT) / 2;
      var lo = [[cu-bu,cv-bv],[cu+bu,cv-bv],[cu+bu,cv+bv],[cu-bu,cv+bv]];
      var hi = [[cu-tu,cv-tv],[cu+tu,cv-tv],[cu+tu,cv+tv],[cu-tu,cv+tv]];
      var nm = [[0,-1],[1,0],[0,1],[-1,0]];
      var skip = o.skip || [], bias = o.bias || 0;
      for (var i = 0; i < 4; i++) {
        if (skip.indexOf(i) >= 0) continue;
        if (!ctx.faceVisible(nm[i][0], nm[i][1])) continue;
        var j = (i + 1) % 4;
        var q = [pt(lo[i][0],lo[i][1],z0), pt(lo[j][0],lo[j][1],z0),
                 pt(hi[j][0],hi[j][1],z0+h), pt(hi[i][0],hi[i][1],z0+h)];
        items.push({ svg: ctx.poly(q, tone(mt, nm[i][0], nm[i][1], 0), null, 0),
                     depth: (o.depth === undefined ? far(q) : o.depth) + bias + i * 0.0002 });
      }
      if (!o.noTop) {
        var tq = [pt(cu-tu,cv-tv,z0+h), pt(cu+tu,cv-tv,z0+h), pt(cu+tu,cv+tv,z0+h), pt(cu-tu,cv+tv,z0+h)];
        items.push({ svg: ctx.poly(tq, tone(mt, 0, 0, 1), null, 0),
                     depth: (o.depth === undefined ? far(tq) : o.depth) + bias + 0.001 });
      }
    }

    /* an n-sided ring, r0 at the foot and r1 at the top, culled in 3D so a
       cone's far top stays visible from above and a dome's far side does not */
    function ring(cu, cv, r0, r1, z0, h, n, mt, o) {
      o = o || {};
      var bias = o.bias || 0, rot = o.rot || 0;
      var lo = [], hi = [];
      for (var i = 0; i < n; i++) {
        var a = rot + (i / n) * Math.PI * 2;
        lo.push([cu + r0 * Math.cos(a), cv + r0 * Math.sin(a)]);
        hi.push([cu + r1 * Math.cos(a), cv + r1 * Math.sin(a)]);
      }
      var L = Math.sqrt((r0 - r1) * (r0 - r1) + h * h) || 1;
      var nzz = (r0 - r1) / L, nh = h / L;
      for (var k = 0; k < n; k++) {
        var a0 = lo[k], a1 = lo[(k + 1) % n], b0 = hi[k], b1 = hi[(k + 1) % n];
        var mu = (a0[0] + a1[0]) / 2 - cu, mv = (a0[1] + a1[1]) / 2 - cv;
        var l = Math.sqrt(mu * mu + mv * mv) || 1, nx = mu / l * nh, ny = mv / l * nh;
        if (!vis3(nx, ny, nzz)) continue;
        var q = [pt(a0[0],a0[1],z0), pt(a1[0],a1[1],z0), pt(b1[0],b1[1],z0+h), pt(b0[0],b0[1],z0+h)];
        items.push({ svg: ctx.poly(q, tone(mt, nx, ny, nzz), null, 0),
                     depth: (o.depth === undefined ? far(q) : o.depth) + bias + k * 0.00002 });
      }
      if (!o.noTop && r1 > 0.05) {
        var tq = hi.map(function (c) { return pt(c[0], c[1], z0 + h); });
        items.push({ svg: ctx.poly(tq, tone(mt, 0, 0, 1), null, 0),
                     depth: (o.depth === undefined ? far(tq) : o.depth) + bias + 0.001 });
      }
    }

    /* ONE GLAZED WALL. There is no wall here in the masonry sense: what gets
       drawn is a translucent field with a close even grid of slender ribs over
       it, plus a horizontal rail and the eaves gutter, because the rhythm of
       the bars is the only articulation this half of the building has. */
    function glassWall(u0, v0, u1, v1, nx, ny, z0, z1, o) {
      if (!ctx.faceVisible(nx, ny)) return;
      o = o || {};
      var q = [pt(u0,v0,z0), pt(u1,v1,z0), pt(u1,v1,z1), pt(u0,v0,z1)];
      var dep = (o.depth === undefined ? far(q) : o.depth) + (o.bias || 0);
      items.push({ svg: ctx.poly(q, tone(GLASS, nx, ny, 0), null, 0), depth: dep });
      var du = u1 - u0, dv = v1 - v0;
      var len = Math.sqrt(du * du + dv * dv) || 1;
      var eu = du / len, ev = dv / len;
      var pu = nx * 0.16, pv = ny * 0.16;               /* stand the ribs proud of the glass */
      var n = Math.max(2, Math.round(len / RIB));
      for (var i = 0; i <= n; i++) {
        var t = i / n;
        var cu = u0 + du * t + pu, cv = v0 + dv * t + pv;
        var hw = RIBW / 2;
        var rq = [pt(cu-eu*hw,cv-ev*hw,z0), pt(cu+eu*hw,cv+ev*hw,z0),
                  pt(cu+eu*hw,cv+ev*hw,z1), pt(cu-eu*hw,cv-ev*hw,z1)];
        items.push({ svg: ctx.poly(rq, tone(FRAME, nx, ny, 0), null, 0), depth: dep + 0.06 });
      }
      /* one horizontal rail, and the eaves gutter at the head */
      [[z0 + (z1 - z0) * 0.46, 0.5], [z1 - 0.75, 0.75]].forEach(function (r) {
        var hq = [pt(u0+pu,v0+pv,r[0]), pt(u1+pu,v1+pv,r[0]),
                  pt(u1+pu,v1+pv,r[0]+r[1]), pt(u0+pu,v0+pv,r[0]+r[1])];
        items.push({ svg: ctx.poly(hq, tone(FRAME, nx, ny, 0), null, 0), depth: dep + 0.05 });
      });
    }

    /* A RIDGE-AND-FURROW ROOF, which is the idiom's own roof and the reason a
       glasshouse never has a flat lid. Both slopes of every furrow are drawn
       and glazed; the painter's sort puts the near slope over the far one,
       which is what a real corrugated roof does. Each slope overruns its
       neighbours slightly so the quads cannot round apart into pale seams. */
    function furrows(u0, u1, v0, v1, zE, zR, axis) {
      var rise = zR - zE, ov = 0.12;
      if (axis === 'u') {
        var n = Math.max(1, Math.round((u1 - u0) / FURROW)), w = (u1 - u0) / n;
        var L = Math.sqrt(rise * rise + (w / 2) * (w / 2)) || 1;
        var nxx = rise / L, nzz = (w / 2) / L;
        for (var i = 0; i < n; i++) {
          var a = u0 + i * w, mid = a + w / 2, b = a + w;
          [[a - ov, zE, mid + ov, zR, -nxx], [mid - ov, zR, b + ov, zE, nxx]].forEach(function (sl) {
            var q = [pt(sl[0], v0 - ov, sl[1]), pt(sl[2], v0 - ov, sl[3]),
                     pt(sl[2], v1 + ov, sl[3]), pt(sl[0], v1 + ov, sl[1])];
            items.push({ svg: ctx.poly(q, tone(GLASS, sl[4], 0, nzz), null, 0), depth: far(q) });
          });
        }
      } else {
        var n2 = Math.max(1, Math.round((v1 - v0) / FURROW)), w2 = (v1 - v0) / n2;
        var L2 = Math.sqrt(rise * rise + (w2 / 2) * (w2 / 2)) || 1;
        var nyy = rise / L2, nz2 = (w2 / 2) / L2;
        for (var j = 0; j < n2; j++) {
          var c = v0 + j * w2, mid2 = c + w2 / 2, d = c + w2;
          [[c - ov, zE, mid2 + ov, zR, -nyy], [mid2 - ov, zR, d + ov, zE, nyy]].forEach(function (sl) {
            var q = [pt(u0 - ov, sl[0], sl[1]), pt(u1 + ov, sl[0], sl[1]),
                     pt(u1 + ov, sl[2], sl[3]), pt(u0 - ov, sl[2], sl[3])];
            items.push({ svg: ctx.poly(q, tone(GLASS, 0, sl[4], nz2), null, 0), depth: far(q) });
          });
        }
      }
    }

    /* a balustrade run: bottom rail, a solid band with the openings cut as
       dark slots on the outward face, top rail. The published roof is FLAT and
       carries a BALUSTRADE, so this is the roof's whole articulation. */
    function balustrade(u0, v0, u1, v1, nx, ny, z0) {
      var du = u1 - u0, dv = v1 - v0;
      var len = Math.sqrt(du * du + dv * dv) || 1;
      var cu = (u0 + u1) / 2, cv = (v0 + v1) / 2;
      /* THICKNESS LIES ALONG THE NORMAL, not along the run. The first version
         had these two the other way round, which gave every run a zero-depth
         box: the top face came out as a zero-area quad and the rails read as a
         flat band floating on edge. Nothing in a face count says so. */
      var wu = Math.abs(du) + Math.abs(nx) * 1.6, wv = Math.abs(dv) + Math.abs(ny) * 1.6;
      box(cu, cv, wu, wv, z0, 0.7, LIMD, { bias: 0.4 });
      box(cu, cv, wu * 0.86, wv * 0.86, z0 + 0.7, 2.0, LIMD, { bias: 0.4, noTop: true });
      box(cu, cv, wu, wv, z0 + 2.7, 0.8, LIMD, { bias: 0.6 });
      if (!ctx.faceVisible(nx, ny)) return;
      var eu = du / len, ev = dv / len, pu = nx * 0.5, pv = ny * 0.5;
      var n = Math.max(2, Math.round(len / 2.2));
      for (var i = 0; i < n; i++) {
        var t = (i + 0.5) / n;
        var mu = u0 + du * t + pu, mv = v0 + dv * t + pv, hw = 0.55;
        var q = [pt(mu-eu*hw,mv-ev*hw,z0+0.7), pt(mu+eu*hw,mv+ev*hw,z0+0.7),
                 pt(mu+eu*hw,mv+ev*hw,z0+2.7), pt(mu-eu*hw,mv-ev*hw,z0+2.7)];
        /* EACH SLOT SORTS ON ITS OWN QUAD. A shared depth taken from the run's
           endpoints is the same fault that hid the eleven arches: it is the
           run's FARTHEST end, so every slot nearer than that end sorts behind
           the band it is cut into and a balustrade comes out a plain wall. */
        items.push({ svg: ctx.poly(q, "#7e7768", null, 0, ' opacity="0.85"'), depth: far(q) + 0.75 });
      }
    }

    /* =================== the ground shadow, first =================== */
    /* Nothing here casts light, so a building without one floats. */
    items.push(H.shadow(ctx, [W(G_U0, G_V0), W(G_U1, G_V0), W(G_U1, G_V1), W(G_U0, G_V1)], 22 * FT));
    items.push(H.shadow(ctx, [W(S_U0, S_V0), W(S_U1, S_V0), W(S_U1, G_V0), W(S_U0, G_V0)], 18 * FT));
    items.push(H.shadow(ctx, [W(WP_U0, PAV_V0), W(EP_U1, PAV_V0), W(EP_U1, NF), W(WP_U0, NF)], 30 * FT));

    /* =================== the courtyard floors, far back =================== */
    [[CW_U0, CW_U1], [CE_U0, CE_U1]].forEach(function (c) {
      var q = [pt(c[0], C_V0, 0.4), pt(c[1], C_V0, 0.4), pt(c[1], C_V1, 0.4), pt(c[0], C_V1, 0.4)];
      items.push({ svg: ctx.poly(q, tone(PAVE, 0, 0, 1), null, 0), depth: far(q) - 900 });
    });

    /* =================== the glasshouse ranges =================== */
    /* Each range is a dwarf wall carrying glazed walls under a ridge-and-furrow
       roof. Faces that abut another range are skipped, so what gets drawn is
       the outside of the block and the four walls of each courtyard well. */
    function range(u0, u1, v0, v1, zE, zR, axis, skip, depthBias) {
      var cu = (u0 + u1) / 2, cv = (v0 + v1) / 2, wu = u1 - u0, wv = v1 - v0;
      box(cu, cv, wu, wv, 0, DWARF, LIME, { skip: skip, noTop: true, bias: depthBias || 0 });
      var sides = [[u0, v0, u1, v0, 0, -1], [u1, v0, u1, v1, 1, 0],
                   [u1, v1, u0, v1, 0, 1], [u0, v1, u0, v0, -1, 0]];
      sides.forEach(function (sd, i) {
        if (skip.indexOf(i) >= 0) return;
        glassWall(sd[0], sd[1], sd[2], sd[3], sd[4], sd[5], DWARF, zE,
                  depthBias ? { depth: far([pt(sd[0],sd[1],DWARF), pt(sd[2],sd[3],zE)]) + depthBias } : {});
      });
      furrows(u0, u1, v0, v1, zE, zR, axis);
    }

    range(G_U0, G_U1, C_V1, G_V1, MID_E, MID_R, 'u', [2]);          /* north cross range */
    range(G_U0, CW_U0, G_V0, C_V1, LOW_E, LOW_R, 'v', [2]);         /* west outer range */
    range(CE_U1, G_U1, G_V0, C_V1, LOW_E, LOW_R, 'v', [2]);         /* east outer range */
    range(CW_U0, CE_U1, G_V0, C_V0, MID_E, MID_R, 'u', [1, 3]);     /* south cross range */
    range(S_U0, S_U1, S_V0, G_V0, LOW_E, LOW_R, 'u', [2]);          /* the south projecting range */

    /* =================== the Palm House, the tall central house =================== */
    /* Its walls are pushed 20 back so the low ranges standing in front of it
       paint over their own share of it, and only what really rises clear of
       them is seen. */
    (function () {
      var cu = DOME_U, cv = DOME_V, wu = PH_U1 - PH_U0, wv = PH_V1 - PH_V0;
      box(cu, cv, wu, wv, 0, DWARF, LIME, { noTop: true, depth: -20 + far([pt(PH_U0,PH_V0,0), pt(PH_U1,PH_V1,DWARF)]) });
      var sides = [[PH_U0, PH_V0, PH_U1, PH_V0, 0, -1], [PH_U1, PH_V0, PH_U1, PH_V1, 1, 0],
                   [PH_U1, PH_V1, PH_U0, PH_V1, 0, 1], [PH_U0, PH_V1, PH_U0, PH_V0, -1, 0]];
      sides.forEach(function (sd) {
        var ref = far([pt(sd[0],sd[1],DWARF), pt(sd[2],sd[3],PH_E)]);
        glassWall(sd[0], sd[1], sd[2], sd[3], sd[4], sd[5], DWARF, PH_E, { depth: ref - 20 });
      });

      /* the hip: four glazed slopes from the eaves up to a 69 ft square, which
         is the smallest square the published 67 ft drum will stand on */
      var TOPW = 69, hu = wu / 2, hv = wv / 2, tw = TOPW / 2;
      var runU = hu - tw, runV = hv - tw, rise = PH_HIP - PH_E;
      var Lu = Math.sqrt(rise * rise + runU * runU) || 1, Lv = Math.sqrt(rise * rise + runV * runV) || 1;
      var slopes = [
        { q: [[cu-hu,cv-hv],[cu+hu,cv-hv],[cu+tw,cv-tw],[cu-tw,cv-tw]], n: [0, -rise/Lv, runV/Lv] },
        { q: [[cu+hu,cv-hv],[cu+hu,cv+hv],[cu+tw,cv+tw],[cu+tw,cv-tw]], n: [rise/Lu, 0, runU/Lu] },
        { q: [[cu+hu,cv+hv],[cu-hu,cv+hv],[cu-tw,cv+tw],[cu+tw,cv+tw]], n: [0, rise/Lv, runV/Lv] },
        { q: [[cu-hu,cv+hv],[cu-hu,cv-hv],[cu-tw,cv-tw],[cu-tw,cv+tw]], n: [-rise/Lu, 0, runU/Lu] }
      ];
      slopes.forEach(function (sl) {
        if (!vis3(sl.n[0], sl.n[1], sl.n[2])) return;
        var q = [pt(sl.q[0][0],sl.q[0][1],PH_E), pt(sl.q[1][0],sl.q[1][1],PH_E),
                 pt(sl.q[2][0],sl.q[2][1],PH_HIP), pt(sl.q[3][0],sl.q[3][1],PH_HIP)];
        items.push({ svg: ctx.poly(q, tone(GLASS, sl.n[0], sl.n[1], sl.n[2]), null, 0), depth: far(q) });
      });

      /* THE DRUM: the dome does not sit on a roof, it sits on a glazed drum,
         and without one a dome is a planetarium. 16 sides reads as round. */
      ring(cu, cv, DR, DR, PH_HIP, SPRING - PH_HIP, 16, GLASD, { noTop: true });
      for (var i = 0; i < 16; i++) {
        var a = (i / 16) * Math.PI * 2;
        var ru = cu + DR * 1.012 * Math.cos(a), rv = cv + DR * 1.012 * Math.sin(a);
        var nx = Math.cos(a), ny = Math.sin(a);
        if (!ctx.faceVisible(nx, ny)) continue;
        var tu2 = -ny * 0.7, tv2 = nx * 0.7;
        var q = [pt(ru-tu2,rv-tv2,PH_HIP), pt(ru+tu2,rv+tv2,PH_HIP),
                 pt(ru+tu2,rv+tv2,SPRING), pt(ru-tu2,rv-tv2,SPRING)];
        items.push({ svg: ctx.poly(q, tone(FRAME, nx, ny, 0), null, 0), depth: far(q) + 0.4 });
      }
      /* the drum's own cornice, its horizontal break */
      ring(cu, cv, DR * 1.03, DR * 1.03, SPRING - 0.9, 0.9, 16, FRAME, { noTop: true, bias: 0.5 });

      /* THE DOME. Hemispherical because that is what the two published numbers
         force: 67 ft across and an 83 ft apex put the springing at 49.5. */
      var NR = 8, RUN = SHELL_TOP - SPRING;
      function domeR(t) { var dz = RUN * t; return Math.sqrt(Math.max(0, DR * DR - dz * dz)); }
      for (var j = 0; j < NR; j++) {
        var t0 = j / NR, t1 = (j + 1) / NR;
        ring(cu, cv, domeR(t0), domeR(t1), SPRING + RUN * t0, RUN * (t1 - t0), 16, GLASD,
             { noTop: true, bias: 0.2 });
      }
      /* MERIDIAN RIBS: a dome in this idiom is ribbed from springing to crown,
         and a smooth shell is the tell that it was drawn as a hemisphere
         rather than built as a glasshouse. 16 meridians, 8 segments each. */
      for (var k = 0; k < 16; k++) {
        var ak = (k / 16) * Math.PI * 2, ck = Math.cos(ak), sk = Math.sin(ak);
        if (!ctx.faceVisible(ck, sk)) continue;
        for (var g = 0; g < NR; g++) {
          var s0 = g / NR, s1 = (g + 1) / NR;
          var r0 = domeR(s0) * 1.015, r1 = domeR(s1) * 1.015;
          var z0 = SPRING + RUN * s0, z1 = SPRING + RUN * s1;
          var tu3 = -sk * 0.55, tv3 = ck * 0.55;
          var q = [pt(cu + r0*ck - tu3, cv + r0*sk - tv3, z0), pt(cu + r0*ck + tu3, cv + r0*sk + tv3, z0),
                   pt(cu + r1*ck + tu3, cv + r1*sk + tv3, z1), pt(cu + r1*ck - tu3, cv + r1*sk - tv3, z1)];
          items.push({ svg: ctx.poly(q, tone(FRAME, ck, sk, 0.35), null, 0), depth: far(q) + 0.6 });
        }
      }
      /* the crown: a collar, a glazed lantern, and a cap whose apex is the
         published 83 ft. No source reached describes the crown at all. */
      var rTop = domeR(1);
      ring(cu, cv, rTop, 10, SHELL_TOP, 1.0, 16, GLASD, { noTop: true, bias: 0.9 });
      ring(cu, cv, 10, 10, SHELL_TOP + 1.0, 2.5, 16, GLASD, { noTop: true, bias: 1.0 });
      ring(cu, cv, 10.6, 10.6, SHELL_TOP + 3.3, 0.5, 16, FRAME, { noTop: true, bias: 1.1 });
      ring(cu, cv, 10, 0.5, SHELL_TOP + 3.5, HPUB - (SHELL_TOP + 3.5), 16, FRAME, { bias: 1.2 });
    })();

    /* =================== the limestone front =================== */
    /* One storey, rusticated, eleven round-arched openings in the measured
       195.9 ft central range, a cornice, a FLAT roof and a balustrade. It is a
       screen: deliberately taller than the glass it hides, so from Maryland
       Avenue the stone reads as the whole building and the dome rises behind. */
    var STONES = [
      { u0: WP_U0, u1: WP_U1, v0: PAV_V0, v1: NF },      /* west pavilion, the West Gallery */
      { u0: ARC_U0, u1: ARC_U1, v0: ARC_V0, v1: NF },    /* the arcaded central range */
      { u0: EP_U0, u1: EP_U1, v0: PAV_V0, v1: NF }       /* east pavilion, the East Gallery */
    ];
    STONES.forEach(function (b) {
      var cu = (b.u0 + b.u1) / 2, cv = (b.v0 + b.v1) / 2;
      var wu = b.u1 - b.u0, wv = b.v1 - b.v0;
      /* the water table, a named assumption, in a greyer stone so the
         horizontal break at the foot actually reads */
      box(cu, cv, wu + 3, wv + 3, 0, PLINTH, BASE, { noTop: true });
      /* the wall */
      box(cu, cv, wu, wv, PLINTH, WALLTOP - PLINTH, LIME, { noTop: true });
      /* the cornice, its own thin slab standing proud */
      box(cu, cv, wu + 2.4, wv + 2.4, WALLTOP, CORN - WALLTOP, LIMD, { noTop: true, bias: 0.3 });
      /* the published FLAT roof, given its own far-corner depth so the
         balustrade standing on its near edge paints after it */
      var rq = [pt(b.u0,b.v0,CORN), pt(b.u1,b.v0,CORN), pt(b.u1,b.v1,CORN), pt(b.u0,b.v1,CORN)];
      items.push({ svg: ctx.poly(rq, tone(DECK, 0, 0, 1), null, 0), depth: far(rq) + 0.2 });
    });
    /* THE BALUSTRADE, on the three faces a visitor on Maryland Avenue sees.
       What is published is "flat roof with a balustrade" and nothing about
       WHICH edges carry it. Runs on the two south edges were drawn first and
       the picture refused them: standing at v = 86 and v = 31 they rise out of
       the middle of the glass roof and read as pale slabs floating on the
       glasshouse, which is worse than a gap. So the rear edges are left
       undrawn and named here rather than invented. */
    balustrade(WP_U0, NF, EP_U1, NF, 0, 1, CORN);                    /* the whole 288 ft front */
    balustrade(WP_U0, PAV_V0, WP_U0, NF, -1, 0, CORN);               /* west pavilion, west return */
    balustrade(EP_U1, PAV_V0, EP_U1, NF, 1, 0, CORN);                /* east pavilion, east return */

    /* PRONOUNCED RUSTICATION, published, on EVERY visible stone face and not
       only on the front. Drawn on the north face alone first, and the picture
       from the north east showed the east pavilion's return as a blank slab,
       which is item 2 of the checklist failing on the one face that view has.
       Five courses over the 21.5 ft wall, one tone off. A joint every two feet
       would turn an orangery into brickwork, the lesson the NMAAHC screen
       taught, so the rhythm is four feet. */
    STONES.forEach(function (b) {
      [[b.u0, b.v0, b.u1, b.v0, 0, -1], [b.u1, b.v0, b.u1, b.v1, 1, 0],
       [b.u1, b.v1, b.u0, b.v1, 0, 1], [b.u0, b.v1, b.u0, b.v0, -1, 0]].forEach(function (f) {
        if (!ctx.faceVisible(f[4], f[5])) return;
        var ou = f[4] * 0.14, ov = f[5] * 0.14;
        for (var z = 6; z < WALLTOP - 1; z += 4) {
          var q = [pt(f[0]+ou, f[1]+ov, z), pt(f[2]+ou, f[3]+ov, z),
                   pt(f[2]+ou, f[3]+ov, z + 0.55), pt(f[0]+ou, f[1]+ov, z + 0.55)];
          items.push({ svg: ctx.poly(q, ctx.shade(JOINT, f[4], f[5], 0), null, 0), depth: far(q) + 0.3 });
        }
      });
    });

    /* =================== the north elevation =================== */
    (function () {
      if (!ctx.faceVisible(0, 1)) return;
      var FV = NF + 0.14;                                   /* stand the decoration proud of the wall */
      /* EVERY piece of decoration sorts on ITS OWN position, never on a shared
         depth taken from the whole front. The first version of this file took
         one base depth from the full 288 ft wall, which is the wall's FARTHEST
         corner, so every arch sorted behind the masonry it is cut into and the
         render came back as a blank screen with eleven arches in the header.
         That is the exact failure item 1 of the checklist is written about. */
      function flat(pts2, fill, bias, stroke, sw) {
        var q = pts2.map(function (c) { return pt(c[0], FV, c[1]); });
        items.push({ svg: ctx.poly(q, fill, stroke || null, sw || 0), depth: far(q) + bias });
      }


      /* THE ELEVEN ARCHES, in the measured 195.9 ft central range.
         Bay 17.81 ft, opening 10.6 ft, springing 13 ft, SEMICIRCULAR so the
         rise equals the half width and the offset d is zero. */
      var NB = 11, BAY = (ARC_U1 - ARC_U0) / NB, AW = 10.6, AR = AW / 2, SPR = 13.0;
      var MASCB = [1, 3, 7, 9];        /* alternating, symmetric about the centre bay */
      for (var k = 0; k < NB; k++) {
        var cu = ARC_U0 + BAY * (k + 0.5);
        /* the void: jambs to the springing, then the semicircular head. The
           curve is steepest at the springing and flattest at the apex, which
           is the whole difference between an arch and a line. */
        var voidPts = [[cu - AR, PLINTH], [cu + AR, PLINTH]];
        for (var t = 0; t <= 16; t++) {
          var a = Math.PI * t / 16;
          voidPts.push([cu + AR * Math.cos(a), SPR + AR * Math.sin(a)]);
        }
        flat(voidPts, VOID, 0.9);
        /* a sill, so the opening has a bottom edge and not a fade */
        flat([[cu - AR - 0.5, PLINTH], [cu + AR + 0.5, PLINTH], [cu + AR + 0.5, PLINTH + 0.5], [cu - AR - 0.5, PLINTH + 0.5]], LIMD.lit, 1.0);
        /* THE VOUSSOIRS. Nine wedges, each a true radius from the arc centre,
           so the joints FAN. Parallel joints are the tell of a hole cut in a
           slab rather than an arch built out of stones. The middle wedge is
           the keystone and stands proud. */
        for (var w = 0; w < 9; w++) {
          var a0 = Math.PI * w / 9, a1 = Math.PI * (w + 1) / 9;
          var ro = (w === 4) ? AR + 3.3 : AR + 2.3;
          var q2 = [[cu + AR*Math.cos(a0), SPR + AR*Math.sin(a0)],
                    [cu + ro*Math.cos(a0), SPR + ro*Math.sin(a0)],
                    [cu + ro*Math.cos(a1), SPR + ro*Math.sin(a1)],
                    [cu + AR*Math.cos(a1), SPR + AR*Math.sin(a1)]];
          flat(q2, ctx.shade(LIMD.lit, 0, 1, 0), 0.7, JOINT, 0.7);
        }
        /* THE MASCARONS: Pan, Pomona, Triton and Flora, the only sculptural
           decoration on the entire building, and therefore the whole ornament
           budget. Four heads on alternating keystones. */
        if (MASCB.indexOf(k) >= 0) {
          var mz = SPR + AR + 1.5, mpts = [];
          for (var g = 0; g < 10; g++) {
            var ag = (g / 10) * Math.PI * 2;
            mpts.push([cu + 1.05 * Math.cos(ag), mz + 1.35 * Math.sin(ag)]);
          }
          flat(mpts, MASC, 1.2);
        }
      }

      /* THE ENTRANCE, in the middle bay, and the three steps up to it. No
         source reached publishes a step count or says the entrance is raised
         at all; this is the named base assumption, drawn rather than left as a
         building sitting straight on the lawn. */
      var EU = ARC_U0 + BAY * 5.5;
      flat([[EU - AR, PLINTH], [EU + AR, PLINTH], [EU + AR, SPR], [EU - AR, SPR]], "#2f3336", 1.05);
      for (var st = 0; st < 3; st++) {
        var hgt = PLINTH * (st + 1) / 3, proj = (3 - st) * 1.6, wid = 26 - st * 2;
        box(EU, NF + 1.5 + proj / 2, wid, proj, 0, hgt, LIMD, { bias: 0.2 });
      }
    })();

    return items;
  };
})();
