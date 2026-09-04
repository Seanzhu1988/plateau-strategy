/* dc-3d.js — the National Mall as a model you can turn, which is also the map.
 *
 * [SEAN: "lets create a tour just like freedom trail but for washington dc",
 * then "this time i want to create DC tour like a 3D model with a map",
 * "around the national mall".]
 *
 * The Freedom Trail's models stand one stop at a time, because Boston's trail
 * winds through streets and the stops have no useful spatial relationship on
 * screen. The Mall is the opposite: it is a straight two-mile axis with a
 * cross axis, everything is visible from everything else, and the whole point
 * of standing on it is how far apart things are. So here the model and the map
 * are the same drawing.
 *
 * EVERY POSITION IS A REAL COORDINATE, from Wikidata, projected flat with the
 * Mall's own axis running left to right. Nothing is arranged by eye. When the
 * Washington Monument sits a third of the way between the Capitol and the
 * Lincoln Memorial on this drawing, that is because it does.
 *
 * HEIGHTS ARE REAL TOO, and the scale between them is not. At true scale on a
 * two-mile axis the Washington Monument is a hair and everything else is
 * invisible, so vertical is exaggerated, the same way a section drawing does
 * it, and the exaggeration is stated on the page rather than hidden. Every
 * horizontal distance is true.
 */
(function () {
  var S = (typeof window !== "undefined" && window.STYLES3D) || {};

  var C = {
    stone:  "#e6e2d8",
    stoneD: "#cfc9bb",
    marble: "#f0ede4",
    lawn:   "#cfd8c4",
    water:  "#a8bcc4",
    path:   "#ded8cb",
    dark:   "#8d8677",
    edge:   "#9a9284",
    wall:   "#4a4a4a",
  };

  /* The Mall's own frame. Origin is the Washington Monument, x runs east
     toward the Capitol, y runs north. Metres. */
  var ORIGIN = { lat: 38.88947, lon: -77.03524 };
  var M_PER_DEG_LAT = 111132.0;
  function xy(lat, lon) {
    var mPerLon = 111320.0 * Math.cos(ORIGIN.lat * Math.PI / 180);
    return { x: (lon - ORIGIN.lon) * mPerLon, y: (lat - ORIGIN.lat) * M_PER_DEG_LAT };
  }

  /* name, coordinate, height in metres, and the shape it reads as.
     Heights: the Monument is 169 m, the Capitol dome 88 m above its base,
     Lincoln and Jefferson are low temples, the memorials are ground works. */
  var PLACES = [
    { k: "capitol",   n: "United States Capitol",     lat: 38.88972, lon: -77.00917, h: 88,  form: "domed" },
    { k: "airspace",  n: "Air and Space Museum",      lat: 38.88833, lon: -77.02000, h: 24,  form: "block" },
    { k: "gallery",   n: "National Gallery of Art",   lat: 38.89139, lon: -77.02000, h: 26,  form: "block" },
    { k: "natural",   n: "Natural History Museum",    lat: 38.89130, lon: -77.02590, h: 28,  form: "domed" },
    { k: "american",  n: "American History Museum",   lat: 38.89111, lon: -77.03000, h: 24,  form: "block" },
    { k: "monument",  n: "Washington Monument",       lat: 38.88947, lon: -77.03524, h: 169, form: "obelisk" },
    { k: "wwii",      n: "World War II Memorial",     lat: 38.88944, lon: -77.04056, h: 13,  form: "plaza" },
    { k: "vietnam",   n: "Vietnam Veterans Memorial", lat: 38.89111, lon: -77.04778, h: 3,   form: "wall" },
    { k: "lincoln",   n: "Lincoln Memorial",          lat: 38.88928, lon: -77.05014, h: 30,  form: "temple" },
    { k: "korean",    n: "Korean War Memorial",       lat: 38.88778, lon: -77.04722, h: 3,   form: "plaza" },
    { k: "mlk",       n: "Martin Luther King Jr. Memorial", lat: 38.88611, lon: -77.04417, h: 9, form: "stone" },
    { k: "fdr",       n: "Franklin D. Roosevelt Memorial",  lat: 38.88389, lon: -77.04444, h: 5, form: "plaza" },
    { k: "jefferson", n: "Jefferson Memorial",        lat: 38.88139, lon: -77.03667, h: 39,  form: "rotunda" },
    /* the expansion: the rest of the Mall's museums and the ground works
       that give the west end its shape */
    { k: "castle",    n: "Smithsonian Castle",         lat: 38.88875, lon: -77.02600, h: 44,  form: "castle" },
    { k: "hirshhorn", n: "Hirshhorn Museum",           lat: 38.88816, lon: -77.02297, h: 25,  form: "drum" },
    { k: "nmaahc",    n: "African American History Museum", lat: 38.89111, lon: -77.03278, h: 26, form: "corona" },
    { k: "indian",    n: "American Indian Museum",     lat: 38.88830, lon: -77.01660, h: 30,  form: "block" },
    { k: "botanic",   n: "Botanic Garden",             lat: 38.88800, lon: -77.01300, h: 20,  form: "block" },
    { k: "holocaust", n: "Holocaust Memorial Museum",  lat: 38.88667, lon: -77.03250, h: 24,  form: "block" },
    { k: "dcwar",     n: "DC War Memorial",            lat: 38.88750, lon: -77.04360, h: 14,  form: "rotunda" },
  ];
  /* The Tidal Basin: an irregular water body, drawn as its rough outline
     rather than a rectangle, because the Jefferson Memorial stands ON its
     edge and a box of water would put the memorial in the middle of it. */
  var TIDAL = [
    [38.88650, -77.03750], [38.88600, -77.04150], [38.88400, -77.04350],
    [38.88150, -77.04250], [38.88000, -77.03950], [38.88050, -77.03550],
    [38.88300, -77.03400], [38.88550, -77.03500],
  ];

  function depthOf(q) {
    var d = q[0][2];
    for (var i = 1; i < q.length; i++) if (q[i][2] < d) d = q[i][2];
    return d;
  }

  function prism(ctx, cx, cy, wx, wy, wxT, wyT, z0, h, fill, edge, depth) {
    var P = ctx.project, out = [];
    var bx = wx / 2, by = wy / 2, tx = wxT / 2, ty = wyT / 2;
    var lo = [[cx-bx,cy-by],[cx+bx,cy-by],[cx+bx,cy+by],[cx-bx,cy+by]];
    var hi = [[cx-tx,cy-ty],[cx+tx,cy-ty],[cx+tx,cy+ty],[cx-tx,cy+ty]];
    var nrm = [[0,-1],[1,0],[0,1],[-1,0]];
    for (var i = 0; i < 4; i++) {
      if (!ctx.faceVisible(nrm[i][0], nrm[i][1])) continue;
      var j = (i + 1) % 4;
      var q = [P(lo[i][0],lo[i][1],z0), P(lo[j][0],lo[j][1],z0),
               P(hi[j][0],hi[j][1],z0+h), P(hi[i][0],hi[i][1],z0+h)];
      out.push({ svg: ctx.poly(q, ctx.shade(fill, nrm[i][0], nrm[i][1], 0), edge, 0.4),
                 depth: depth === undefined ? depthOf(q) : depth + i * 0.01 });
    }
    var top = [P(cx-tx,cy-ty,z0+h), P(cx+tx,cy-ty,z0+h),
               P(cx+tx,cy+ty,z0+h), P(cx-tx,cy+ty,z0+h)];
    /* A slab's top is the case the painter's sort gets wrong: its nearest
       corner sits farther than the nearest corner of anything smaller
       standing under it, so it paints first and the thing beneath shows
       through. An explicit depth puts it where it belongs. */
    out.push({ svg: ctx.poly(top, ctx.shade(fill, 0, 0, 1), edge, 0.4),
               depth: depth === undefined ? depthOf(top) : depth + 0.05 });
    return out;
  }

  function pyramid(ctx, cx, cy, w, z0, h, fill, edge) {
    var P = ctx.project, out = [], b = w / 2;
    var lo = [[cx-b,cy-b],[cx+b,cy-b],[cx+b,cy+b],[cx-b,cy+b]];
    var nrm = [[0,-1],[1,0],[0,1],[-1,0]];
    var apex = P(cx, cy, z0 + h);
    for (var i = 0; i < 4; i++) {
      if (!ctx.faceVisible(nrm[i][0], nrm[i][1])) continue;
      var j = (i + 1) % 4;
      var t = [P(lo[i][0],lo[i][1],z0), P(lo[j][0],lo[j][1],z0), apex];
      out.push({ svg: ctx.poly(t, ctx.shade(fill, nrm[i][0], nrm[i][1], .25), edge, 0.4),
                 depth: depthOf(t) });
    }
    return out;
  }

  /* An N-sided prism, for the round things. A drum with twelve sides reads as
     a cylinder at any size this map draws, and the renderer can sort it. */
  function ngon(ctx, cx, cy, r, z0, h, n, fill, edge) {
    var P = ctx.project, out = [], pts = [];
    for (var i = 0; i < n; i++) {
      var a = (i / n) * Math.PI * 2;
      pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    for (var i2 = 0; i2 < n; i2++) {
      var a0 = pts[i2], a1 = pts[(i2 + 1) % n];
      var mx = (a0[0] + a1[0]) / 2 - cx, my = (a0[1] + a1[1]) / 2 - cy;
      var l = Math.sqrt(mx * mx + my * my) || 1;
      var nx = mx / l, ny = my / l;
      if (!ctx.faceVisible(nx, ny)) continue;
      var q = [P(a0[0],a0[1],z0), P(a1[0],a1[1],z0), P(a1[0],a1[1],z0+h), P(a0[0],a0[1],z0+h)];
      out.push({ svg: ctx.poly(q, ctx.shade(fill, nx, ny, 0), edge, 0.4), depth: depthOf(q) });
    }
    var top = pts.map(function (p) { return P(p[0], p[1], z0 + h); });
    out.push({ svg: ctx.poly(top, ctx.shade(fill, 0, 0, 1), edge, 0.4), depth: depthOf(top) });
    return out;
  }

  /* A colonnade: the thing that makes a neoclassical building read as one.
     Columns along one edge of a rectangle, each a thin prism. */
  function colonnade(ctx, x0, y0, x1, y1, z0, h, count, r, fill, edge) {
    var out = [];
    for (var i = 0; i < count; i++) {
      var t = count === 1 ? 0.5 : i / (count - 1);
      var cx = x0 + (x1 - x0) * t, cy = y0 + (y1 - y0) * t;
      out = out.concat(prism(ctx, cx, cy, r * 2, r * 2, r * 2, r * 2, z0, h, fill, edge));
    }
    return out;
  }

  /* A dome, as a stack of shrinking rings. It was a stack of shrinking
     BOXES first, which read as a stepped pyramid, and on the Jefferson
     rotunda that meant a square dome on a round building. Sixteen sides
     per ring is round at any size this map draws. */
  function dome(ctx, cx, cy, r, z0, h, fill, edge) {
    var out = [], n = 7;
    for (var i = 0; i < n; i++) {
      var t0 = i / n, t1 = (i + 1) / n;
      var r0 = r * Math.cos(t0 * Math.PI / 2);
      out = out.concat(ngon(ctx, cx, cy, Math.max(r0, r * 0.06), z0 + h * t0,
                            h * (t1 - t0), 16, fill, edge));
    }
    return out;
  }

  var FORMS = {
    /* The Capitol: a central block under the dome, and the two long wings
       for the House and the Senate. Drawn as three masses because from the
       Mall that is exactly what it is. */
    domed: function (ctx, p, s, VE) {
      var w = 70 * s, hh = p.h * VE, out = [];
      var wingH = hh * 0.42, coreH = hh * 0.55;
      out = out.concat(prism(ctx, p.x, p.y - w * 1.05, w * 0.9, w * 0.55, w * 0.9, w * 0.55, 0, wingH, C.stone, C.edge));
      out = out.concat(prism(ctx, p.x, p.y + w * 1.05, w * 0.9, w * 0.55, w * 0.9, w * 0.55, 0, wingH, C.stone, C.edge));
      out = out.concat(prism(ctx, p.x, p.y, w * 1.0, w * 1.4, w * 1.0, w * 1.4, 0, coreH, C.marble, C.edge));
      /* The drum is the Capitol's signature, not the dome: a wide, tall,
         colonnaded cylinder, and the dome sits broad and fairly shallow on
         top of it. Narrow and tall read as a beehive. */
      var dr = w * 0.30, drumH = hh * 0.20;
      out = out.concat(ngon(ctx, p.x, p.y, dr, coreH, drumH, 16, C.marble, C.edge));
      for (var ci = 0; ci < 16; ci++) {
        var ca = (ci / 16) * Math.PI * 2;
        out = out.concat(prism(ctx, p.x + dr * 1.08 * Math.cos(ca), p.y + dr * 1.08 * Math.sin(ca),
                               w * 0.022, w * 0.022, w * 0.022, w * 0.022, coreH, drumH, C.marble, C.edge));
      }
      out = out.concat(dome(ctx, p.x, p.y, dr * 0.98, coreH + drumH, hh * 0.20, C.marble, C.edge));
      return out.concat(ngon(ctx, p.x, p.y, w * 0.05, coreH + drumH + hh * 0.20, hh * 0.05, 8, C.marble, C.edge));
    },
    /* The Lincoln Memorial: a podium, a ring of columns, and the attic
       above them. The columns are the building; without them it is a shed. */
    temple: function (ctx, p, s, VE) {
      var w = 58 * s, d = w * 0.62, hh = p.h * VE, out = [];
      var podH = hh * 0.30, colH = hh * 0.52, atticH = hh * 0.18;
      out = out.concat(prism(ctx, p.x, p.y, w * 1.25, d * 1.25, w * 1.25, d * 1.25, 0, podH, C.stoneD, C.edge));
      out = out.concat(prism(ctx, p.x, p.y, w * 0.72, d * 0.72, w * 0.72, d * 0.72, podH, colH, C.stone, C.edge));
      var r = w * 0.028;
      out = out.concat(colonnade(ctx, p.x - w/2, p.y - d/2, p.x + w/2, p.y - d/2, podH, colH, 12, r, C.marble, C.edge));
      out = out.concat(colonnade(ctx, p.x - w/2, p.y + d/2, p.x + w/2, p.y + d/2, podH, colH, 12, r, C.marble, C.edge));
      out = out.concat(colonnade(ctx, p.x - w/2, p.y - d/2, p.x - w/2, p.y + d/2, podH, colH, 8, r, C.marble, C.edge));
      out = out.concat(colonnade(ctx, p.x + w/2, p.y - d/2, p.x + w/2, p.y + d/2, podH, colH, 8, r, C.marble, C.edge));
      /* explicit depth: the attic must paint after everything under it */
      return out.concat(prism(ctx, p.x, p.y, w * 1.06, d * 1.06, w * 1.06, d * 1.06, podH + colH, atticH, C.marble, C.edge, 5e5));
    },
    /* Jefferson: a round rotunda with a shallow dome and a columned portico
       facing the water. The DC War Memorial is the same idea, small. */
    rotunda: function (ctx, p, s, VE) {
      var hh = p.h * VE, r = (p.h > 20 ? 30 : 12) * s, out = [];
      var podH = hh * 0.18, drumH = hh * 0.50;
      out = out.concat(ngon(ctx, p.x, p.y, r * 1.5, 0, podH, 16, C.stoneD, C.edge));
      out = out.concat(ngon(ctx, p.x, p.y, r, podH, drumH, 16, C.marble, C.edge));
      var cr = r * 0.07;
      for (var i = 0; i < 16; i++) {
        var a = (i / 16) * Math.PI * 2;
        out = out.concat(prism(ctx, p.x + r * 1.2 * Math.cos(a), p.y + r * 1.2 * Math.sin(a),
                               cr * 2, cr * 2, cr * 2, cr * 2, podH, drumH, C.marble, C.edge));
      }
      return out.concat(dome(ctx, p.x, p.y, r * 0.95, podH + drumH, hh * 0.32, C.marble, C.edge));
    },
    /* The Smithsonian Castle: red sandstone, a cluster of towers of
       different heights. One tall, several short. */
    castle: function (ctx, p, s, VE) {
      var w = 60 * s, hh = p.h * VE, out = [];
      var RED = "#b06a4e";
      out = out.concat(prism(ctx, p.x, p.y, w, w * 0.32, w, w * 0.32, 0, hh * 0.45, RED, "#7a4a36"));
      out = out.concat(prism(ctx, p.x + w * 0.12, p.y, w * 0.12, w * 0.12, w * 0.12, w * 0.12, 0, hh, RED, "#7a4a36"));
      out = out.concat(prism(ctx, p.x - w * 0.38, p.y, w * 0.10, w * 0.10, w * 0.10, w * 0.10, 0, hh * 0.72, RED, "#7a4a36"));
      return out.concat(prism(ctx, p.x + w * 0.42, p.y, w * 0.10, w * 0.10, w * 0.10, w * 0.10, 0, hh * 0.65, RED, "#7a4a36"));
    },
    /* Hirshhorn: a drum on legs. The most recognisable shape on the Mall
       after the obelisk, and a box would be a lie about it. */
    drum: function (ctx, p, s, VE) {
      var hh = p.h * VE, r = 35 * s, out = [];
      out = out.concat(ngon(ctx, p.x, p.y, r * 0.55, 0, hh * 0.28, 12, C.dark, C.edge));
      return out.concat(ngon(ctx, p.x, p.y, r, hh * 0.28, hh * 0.72, 16, C.stoneD, C.edge));
    },
    /* NMAAHC: the three-tiered bronze corona, wider at the top, on a glass
       base. Flipped taper, and the only thing on the Mall that is. */
    corona: function (ctx, p, s, VE) {
      var hh = p.h * VE, w = 62 * s, out = [];
      var BRZ = "#a8783f";
      out = out.concat(prism(ctx, p.x, p.y, w * 0.9, w * 0.9, w * 0.9, w * 0.9, 0, hh * 0.22, C.water, C.edge));
      for (var i = 0; i < 3; i++) {
        var z0 = hh * (0.22 + 0.26 * i), z1 = hh * (0.22 + 0.26 * (i + 1));
        var wb = w * (0.72 + 0.09 * i), wt = w * (0.86 + 0.09 * i);
        out = out.concat(prism(ctx, p.x, p.y, wb, wb, wt, wt, z0, z1 - z0, BRZ, "#7a5a2e"));
      }
      return out;
    },
    obelisk: function (ctx, p, s, VE) {
      var w = 16 * s;
      var out = prism(ctx, p.x, p.y, w * 2.4, w * 2.4, w * 2.4, w * 2.4, 0, 4 * VE, C.stoneD, C.edge);
      var hh = p.h * VE;
      out = out.concat(prism(ctx, p.x, p.y, w, w, w * 0.62, w * 0.62, 4 * VE, hh * 0.9, C.marble, C.edge));
      return out.concat(pyramid(ctx, p.x, p.y, w * 0.62, 4 * VE + hh * 0.9, hh * 0.1, C.marble, C.edge));
    },
    block: function (ctx, p, s, VE) {
      var w = 80 * s;
      return prism(ctx, p.x, p.y, w, w * 0.5, w, w * 0.5, 0, p.h * VE, C.stone, C.edge);
    },
    plaza: function (ctx, p, s, VE) {
      var w = 70 * s;
      return prism(ctx, p.x, p.y, w, w * 0.55, w, w * 0.55, 0, Math.max(p.h * VE, 2), C.path, C.edge);
    },
    stone: function (ctx, p, s, VE) {
      var w = 26 * s;
      return prism(ctx, p.x, p.y, w, w * 0.6, w * 0.8, w * 0.5, 0, p.h * VE, C.marble, C.edge);
    },
    /* The Vietnam wall is two low arms cut into the ground, and its shape is
       the memorial. Drawn dark and long rather than as another pale box. */
    wall: function (ctx, p, s, VE) {
      var L = 74 * s, out = [];
      [[-1, 1], [1, -1]].forEach(function (d) {
        out = out.concat(prism(ctx, p.x + d[0] * L * 0.5, p.y + d[1] * L * 0.18,
                               L, 4 * s, L, 4 * s, 0, Math.max(p.h * VE, 3), C.wall, C.wall));
      });
      return out;
    },
  };

  /* A ground shadow: a footprint polygon slid along the light direction and
     painted dark just above the lawn. Nothing in this renderer casts light,
     so a building with no shadow floats; this is the cheapest thing that
     stops it. LIGHT_DIR is the same vector the shading uses. */
  var LIGHT_DIR = { x: -0.55, y: -0.35 };
  function shadow(ctx, footprint, h) {
    var P = ctx.project, pts = [];
    var dx = LIGHT_DIR.x * h * 0.9, dy = LIGHT_DIR.y * h * 0.9;
    footprint.forEach(function (q) { pts.push(P(q[0], q[1], 0.3)); });
    for (var i = footprint.length - 1; i >= 0; i--) {
      pts.push(P(footprint[i][0] + dx, footprint[i][1] + dy, 0.3));
    }
    return { svg: ctx.poly(pts, "#000", null, 0, ' opacity="0.16"'), depth: -1e9 + 2 };
  }

  function ground(ctx, x0, y0, x1, y1, z, fill) {
    var P = ctx.project;
    return { svg: ctx.poly([P(x0,y0,z),P(x1,y0,z),P(x1,y1,z),P(x0,y1,z)], fill, C.edge, 0.4),
             depth: -1e9 };
  }

  /* MIN_H is a FLOOR, not a multiplier.
     The first version multiplied every height by six so the low memorials
     would show, and it ruined the proportion that matters most: the
     Washington Monument is 169 m on a 16.8 m base, about ten to one, and
     six times taller made it sixty to one, a knitting needle. An
     exaggeration that makes the famous thing wrong is not worth the
     memorials it rescues. Heights are the published ones; anything under
     twelve metres is drawn at twelve, because a four-metre memorial on a
     two-mile axis is a scratch. One sentence to admit, every real
     proportion intact. */
  var MIN_H = 12;
  function mall(opts) {
    opts = opts || {};
    var VE = opts.ve || 1;
    var s = opts.spread || 1;
    var only = opts.only || null;
    return function (ctx) {
      var pts = PLACES.map(function (p) {
        var c = xy(p.lat, p.lon);
        return { k: p.k, n: p.n, x: c.x, y: c.y, h: p.h, form: p.form };
      });
      var out = [];
      /* A single building gets a pad of ground its own size, not the Mall.
         Fitting the camera to two miles of lawn made every close-up a speck
         in the corner of an empty field. */
      var EXT = (typeof window !== "undefined" && window.DC_FORMS) || {};
      if (only) {
        var one = pts.filter(function (p) { return p.k === only; })[0];
        if (!one) return out;
        var pad = Math.max(one.h, 40) * 2.2;
        out.push(ground(ctx, one.x - pad, one.y - pad, one.x + pad, one.y + pad, 0, C.lawn));
        var f1 = EXT[one.k] || FORMS[one.form] || FORMS.block;
        return out.concat(f1(ctx, { x: one.x, y: one.y, h: Math.max(one.h, MIN_H) * VE, form: one.form }, s, 1));
      }
      var minX = Math.min.apply(null, pts.map(function (p) { return p.x; })) - 400;
      var maxX = Math.max.apply(null, pts.map(function (p) { return p.x; })) + 400;
      /* south to the far shore of the Tidal Basin, so the water sits on
         ground rather than floating past the lawn's edge */
      out.push(ground(ctx, minX, -1150, maxX, 300, 0, C.lawn));
      /* The Reflecting Pool, between the Lincoln Memorial and the WWII
         Memorial, because without it the west end reads as empty grass. */
      var lin = pts.filter(function (p) { return p.k === "lincoln"; })[0];
      var ww = pts.filter(function (p) { return p.k === "wwii"; })[0];
      if (lin && ww) {
        out.push(ground(ctx, lin.x + 90, -30, ww.x - 90, 30, 0.4, C.water));
      }
      /* the Tidal Basin, outlined from its real shoreline */
      var basin = TIDAL.map(function (ll) { var c = xy(ll[0], ll[1]); return ctx.project(c.x, c.y, 0.4); });
      out.push({ svg: ctx.poly(basin, C.water, C.edge, 0.4), depth: -1e9 + 1 });
      pts.forEach(function (p) {
        if (only && only !== p.k) return;
        var f = EXT[p.k] || FORMS[p.form] || FORMS.block;
        var q = { x: p.x, y: p.y, h: Math.max(p.h, MIN_H) * VE, form: p.form };
        out = out.concat(f(ctx, q, s, 1));
      });
      return out;
    };
  }

  var scenes = { mall: mall(), tall: mall({ ve: 1.6 }) };
  /* one scene per place, so any building can be looked at on its own */
  PLACES.forEach(function (p) { scenes["only-" + p.k] = mall({ only: p.k }); });
  var api = { mall: mall, places: PLACES, xy: xy, MIN_H: MIN_H, scenes: scenes,
              helpers: { prism: prism, ngon: ngon, dome: dome, colonnade: colonnade,
                         pyramid: pyramid, shadow: shadow, depthOf: depthOf, C: C } };
  if (typeof window !== "undefined") window.DC3D = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
