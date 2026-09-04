/* dc-form-jefferson.js: the Thomas Jefferson Memorial as a massing model.
 *
 * Every number below is a research fact converted to metres, or a stated
 * derivation from one. Facts used: overall height 129 ft (the renderer's
 * p.h, 39 m, is that figure), diameter 165 ft, portico width 102 ft with
 * 8 columns across (7 bays) and 2 bays deep, 26 ring columns, 12 portico
 * columns, 4 columns in each of 4 openings, Ionic columns 43 ft tall and
 * 5 ft 3 in thick, a 19 ft bronze Jefferson on a 6 ft black granite
 * pedestal, white Vermont Danby marble outside (dome included), granite and
 * marble terraces and stairs between solid granite buttresses, pink
 * Tennessee marble floor, Weinman's five-figure group in the north pediment.
 *
 * NOT in the facts, stated here as assumptions rather than hidden: the
 * chamber inside the cella has no published diameter in the research set
 * (86 ft is assumed); the cella and attic outer diameter is taken as 0.58
 * of the colonnade diameter (Pantheon proportion, the reviewers' figure);
 * the interior intercolumniation is taken tighter than the portico's so
 * four columns still stand in each opening without the openings eating the
 * wall; the stair riser and tread (6 in and 14 in) are a standard public
 * stair pitch, not a measured one.
 *
 * Derived, with the rule that produced each: entablature 0.22 of the column
 * (architrave 0.07, frieze 0.08, cornice 0.07, projecting 0.05 of the
 * column), the same section under the portico; a plain attic 0.35 of the
 * column above the roof with a 0.05 cornice; three step rings at the
 * springing, each 0.02 of the dome span tall and stepping in 0.02; a smooth
 * spherical cap with rise 0.30 of its span; a low parapet 0.04 of the column
 * at the roof edge; Attic base 0.5 diameters, Ionic capital 0.65 diameters
 * tall with volutes projecting 0.25 diameters each side; pediment tympanum
 * 0.11 of its width (pitch about 1 in 4.5), the gable running back until it
 * dies into the attic. The stylobate height above the plaza is whatever is
 * left of 129 ft once the order, entablature, attic and dome are stacked,
 * so the total is true (it comes out at about 8.7 m, which is the tall
 * terrace the north stairs climb); three marble steps of 0.02 of the column
 * ring the stylobate over a granite terrace, and the stair is cut from that
 * height in two flights with a 12 ft landing, the full width of the
 * portico, with low granite cheek curbs one riser above the treads.
 *
 * Light: one vector for every face here, the shadows cast from the same
 * vector (the whole-building ground shadow, the drum and dome onto the roof
 * annulus, the roof onto the stylobate, the columns onto the floor), so the
 * lit and shaded sides agree with where the shadows fall.
 *
 * Paint depth: the painter's list is shared with the whole Mall, whose
 * depths are raw metres, so every explicit depth here is finally remapped
 * into a band around the building's own centre depth (podium first, the
 * order at its natural depth, the entablature and dome last), never an
 * absolute constant that would paint over a neighbour.
 *
 * Camera from the north (the Tidal Basin side) is the one the page uses;
 * the painter's-order choices below test ctx.faceVisible so they flip if
 * the camera walks round to the south or the east.
 */
(function(){
  var H = window.DC3D.helpers;
  window.DC_FORMS = window.DC_FORMS || {};
  window.DC_FORMS['jefferson'] = function(ctx, p, s, VE){
    var FT = 0.3048;
    var P = ctx.project;
    var out = [];
    var X = p.x, Y = p.y;

    /* ---------- materials: two tones each, warm in the sun, cool in shade ---------- */
    var M = {
      marble: { lit: "#f8f3e8", shd: "#c6c3bb", edge: "#b3aea3" },   /* Vermont Danby, white */
      floor:  { lit: "#d9d0c9", shd: "#b3aaa4", edge: "#a0968f" },   /* Tennessee marble floor, a muted warm grey */
      granite:{ lit: "#d2ccc2", shd: "#a39e95", edge: "#8c877e" },   /* light warm grey granite: terrace, stair, cheeks */
      bronze: { lit: "#6f7050", shd: "#3e402f", edge: "#2c2d22" },   /* the statue */
      black:  { lit: "#45454a", shd: "#1f1f22", edge: "#121214" }    /* Minnesota black granite pedestal */
    };

    /* ONE light for everything: from the north-east and above, so the faces the
       north camera sees are the lit ones and the shadows fall south-west. */
    var LL = Math.sqrt(0.45*0.45 + 0.50*0.50 + 0.72*0.72);
    var LX = 0.45/LL, LY = 0.50/LL, LZ = 0.72/LL;
    var SX = -LX/LZ, SY = -LY/LZ;            /* ground offset per metre of height for a cast shadow */
    function rgb(h){ var n = parseInt(h.slice(1), 16); return [n>>16&255, n>>8&255, n&255]; }
    function col(m, nx, ny, nz, ao){
      var l = Math.sqrt(nx*nx + ny*ny + nz*nz) || 1;
      var d = (nx*LX + ny*LY + nz*LZ)/l;
      var t = Math.max(0, Math.min(1, (d + 0.45)/1.45));
      var a = rgb(m.shd), b = rgb(m.lit), k = (ao === undefined ? 1 : ao), o = [];
      for (var i = 0; i < 3; i++) o.push(Math.round((a[i] + (b[i]-a[i])*t) * k));
      return "rgb(" + o.join(",") + ")";
    }
    /* edge: undefined = the material's edge tone; "self" = the fill (no visible seam) */
    function face(q, m, nx, ny, nz, depth, ao, edge){
      var f = col(m, nx, ny, nz, ao);
      return { svg: ctx.poly(q, f, edge === "self" ? f : (edge === undefined ? m.edge : edge), 0.35), depth: depth };
    }
    function line(a, b, tone, depth, w){
      return { svg: ctx.poly([a, b], "none", tone, w || 0.5), depth: depth };
    }

    /* the two silhouette angles of any vertical cylinder, found from the host's
       own culling test, so a smooth cylinder still gets its outline */
    var SIL = (function(){
      var v = [], N = 72, res = [];
      for (var i = 0; i < N; i++) { var a = i/N*Math.PI*2; v.push(ctx.faceVisible(Math.cos(a), Math.sin(a))); }
      for (var k = 0; k < N; k++) {
        if (v[k] === v[(k+1)%N]) continue;
        var lo = k/N*Math.PI*2, hi = (k+1)/N*Math.PI*2;
        for (var it = 0; it < 24; it++) { var mid = (lo+hi)/2; if (ctx.faceVisible(Math.cos(mid), Math.sin(mid)) === v[k]) lo = mid; else hi = mid; }
        res.push((lo+hi)/2);
      }
      return res;
    })();
    function silh(cx, cy, r, z0, h, tone, depth){
      var o = [];
      SIL.forEach(function(a, i){
        var x = cx + r*Math.cos(a), y = cy + r*Math.sin(a);
        o.push(line(P(x, y, z0), P(x, y, z0+h), tone, depth + i*1e-4));
      });
      return o;
    }

    /* ---------- primitives ---------- */
    /* a box rotated by ang about its own centre; wx runs along ang, wy across it */
    function obox(cx, cy, wx, wy, z0, h, ang, m, depth, ao, edge){
      var o = [], bx = wx/2, by = wy/2, ca = Math.cos(ang), sa = Math.sin(ang);
      function rot(x, y){ return [cx + x*ca - y*sa, cy + x*sa + y*ca]; }
      var c = [rot(-bx,-by), rot(bx,-by), rot(bx,by), rot(-bx,by)];
      var nrm = [[0,-1],[1,0],[0,1],[-1,0]].map(function(n){ return [n[0]*ca - n[1]*sa, n[0]*sa + n[1]*ca]; });
      for (var i = 0; i < 4; i++) {
        var nx = nrm[i][0], ny = nrm[i][1];
        if (!ctx.faceVisible(nx, ny)) continue;
        var j = (i+1)%4;
        var q = [P(c[i][0],c[i][1],z0), P(c[j][0],c[j][1],z0), P(c[j][0],c[j][1],z0+h), P(c[i][0],c[i][1],z0+h)];
        o.push(face(q, m, nx, ny, 0, depth === undefined ? H.depthOf(q) : depth + i*0.001, ao, edge));
      }
      var top = c.map(function(v){ return P(v[0], v[1], z0+h); });
      o.push(face(top, m, 0, 0, 1, depth === undefined ? H.depthOf(top) : depth + 0.0005, ao, edge));
      return o;
    }
    function box(cx, cy, wx, wy, z0, h, m, depth, ao, edge){ return obox(cx, cy, wx, wy, z0, h, 0, m, depth, ao, edge); }

    /* a cylinder as an n-gon, faces offset half a step so no vertex sits on the axis;
       edge "self" makes it smooth and the silhouette lines give it an outline */
    function cyl(cx, cy, r, z0, h, n, m, depth, ao, edge, noTop){
      var o = [], pts = [];
      for (var i = 0; i < n; i++) { var a = (i+0.5)/n*Math.PI*2; pts.push([cx+r*Math.cos(a), cy+r*Math.sin(a)]); }
      for (var k = 0; k < n; k++) {
        var a0 = pts[k], a1 = pts[(k+1)%n];
        var mx = (a0[0]+a1[0])/2-cx, my = (a0[1]+a1[1])/2-cy, l = Math.sqrt(mx*mx+my*my)||1;
        var nx = mx/l, ny = my/l;
        if (!ctx.faceVisible(nx, ny)) continue;
        var q = [P(a0[0],a0[1],z0), P(a1[0],a1[1],z0), P(a1[0],a1[1],z0+h), P(a0[0],a0[1],z0+h)];
        o.push(face(q, m, nx, ny, 0, depth === undefined ? H.depthOf(q) : depth + k*0.0001, ao, edge));
      }
      if (!noTop) {
        var top = pts.map(function(v){ return P(v[0], v[1], z0+h); });
        o.push(face(top, m, 0, 0, 1, depth === undefined ? H.depthOf(top) : depth + 0.0005, ao, edge));
      }
      if (edge === "self") o = o.concat(silh(cx, cy, r, z0, h, m.edge, depth === undefined ? P(cx, cy, z0)[2] + r : depth + 0.0008));
      return o;
    }

    /* an annular wall between two angles: outer skin, inner skin, end caps, top.
       dbase, if given, puts it in an explicit band keeping its own near-to-far order */
    function arcWall(cx, cy, rIn, rOut, z0, h, a0, a1, n, m, ao, dbase, edge){
      var o = [];
      function D(q){ var d = H.depthOf(q); return dbase === undefined ? d : dbase + (d + 2000)*1e-5; }
      for (var i = 0; i < n; i++) {
        var t0 = a0 + (a1-a0)*i/n, t1 = a0 + (a1-a0)*(i+1)/n, tm = (t0+t1)/2;
        var nx = Math.cos(tm), ny = Math.sin(tm);
        var o0 = [cx+rOut*Math.cos(t0), cy+rOut*Math.sin(t0)], o1 = [cx+rOut*Math.cos(t1), cy+rOut*Math.sin(t1)];
        var i0 = [cx+rIn*Math.cos(t0),  cy+rIn*Math.sin(t0)],  i1 = [cx+rIn*Math.cos(t1),  cy+rIn*Math.sin(t1)];
        var q;
        if (ctx.faceVisible(nx, ny)) {
          q = [P(o0[0],o0[1],z0), P(o1[0],o1[1],z0), P(o1[0],o1[1],z0+h), P(o0[0],o0[1],z0+h)];
          o.push(face(q, m, nx, ny, 0, D(q), ao, edge));
        }
        if (ctx.faceVisible(-nx, -ny)) {
          q = [P(i1[0],i1[1],z0), P(i0[0],i0[1],z0), P(i0[0],i0[1],z0+h), P(i1[0],i1[1],z0+h)];
          o.push(face(q, m, -nx, -ny, 0, D(q), ao, edge));
        }
        var top = [P(o0[0],o0[1],z0+h), P(o1[0],o1[1],z0+h), P(i1[0],i1[1],z0+h), P(i0[0],i0[1],z0+h)];
        o.push(face(top, m, 0, 0, 1, D(top), ao, edge));
      }
      if (Math.abs((a1 - a0) - Math.PI*2) > 1e-6) {
        [[a0, Math.sin(a0), -Math.cos(a0)], [a1, -Math.sin(a1), Math.cos(a1)]].forEach(function(e){
          var a = e[0], nx = e[1], ny = e[2];
          if (!ctx.faceVisible(nx, ny)) return;
          var A = [cx+rIn*Math.cos(a), cy+rIn*Math.sin(a)], B = [cx+rOut*Math.cos(a), cy+rOut*Math.sin(a)];
          var q = [P(A[0],A[1],z0), P(B[0],B[1],z0), P(B[0],B[1],z0+h), P(A[0],A[1],z0+h)];
          o.push(face(q, m, nx, ny, 0, D(q), ao, edge));
        });
      }
      return o;
    }

    /* a block with a sloping top: four corners counter-clockwise, one floor, four top heights */
    function wedge(c, zBot, zTop, m, depth, ao){
      var o = [];
      for (var i = 0; i < 4; i++) {
        var j = (i+1)%4, dx = c[j][0]-c[i][0], dy = c[j][1]-c[i][1], l = Math.sqrt(dx*dx+dy*dy)||1;
        var nx = dy/l, ny = -dx/l;
        if (!ctx.faceVisible(nx, ny)) continue;
        var q = [P(c[i][0],c[i][1],zBot), P(c[j][0],c[j][1],zBot), P(c[j][0],c[j][1],zTop[j]), P(c[i][0],c[i][1],zTop[i])];
        o.push(face(q, m, nx, ny, 0, depth + i*0.001, ao));
      }
      var ux = c[1][0]-c[0][0], uy = c[1][1]-c[0][1], uz = zTop[1]-zTop[0];
      var vx = c[3][0]-c[0][0], vy = c[3][1]-c[0][1], vz = zTop[3]-zTop[0];
      var nX = uy*vz-uz*vy, nY = uz*vx-ux*vz, nZ = ux*vy-uy*vx;
      if (nZ < 0) { nX = -nX; nY = -nY; nZ = -nZ; }
      var top = c.map(function(v, i){ return P(v[0], v[1], zTop[i]); });
      o.push(face(top, m, nX, nY, nZ, depth + 0.005, ao));
      return o;
    }

    /* put a helper's items into an explicit depth band, preserving their own order */
    function lift(items, base){
      items.forEach(function(it){ it.depth = base + (it.depth + 2000) * 1e-5; });
      return items;
    }

    /* a spherical cap: radius r at the springing, rise h, one smooth surface shaded
       by the true sphere normal, seams in the fill colour, no meridian lines */
    function capProfile(r, h){
      var Rs = (r*r + h*h)/(2*h), f0 = Math.asin((Rs-h)/Rs);
      return function(t){ var f = f0 + (Math.PI/2 - f0)*t; return [Rs*Math.cos(f), Rs*Math.sin(f) - (Rs-h), f]; };
    }
    function cap(cx, cy, r, z0, h, m, segs, rings){
      var o = [], prof = capProfile(r, h);
      for (var i = 0; i < rings; i++) {
        var p0 = prof(i/rings), p1 = prof((i+1)/rings), fm = (p0[2]+p1[2])/2;
        for (var k = 0; k < segs; k++) {
          var a0 = k/segs*Math.PI*2, a1 = (k+1)/segs*Math.PI*2, am = (a0+a1)/2;
          var nx = Math.cos(fm)*Math.cos(am), ny = Math.cos(fm)*Math.sin(am), nz = Math.sin(fm);
          var q = [P(cx+p0[0]*Math.cos(a0), cy+p0[0]*Math.sin(a0), z0+p0[1]),
                   P(cx+p0[0]*Math.cos(a1), cy+p0[0]*Math.sin(a1), z0+p0[1]),
                   P(cx+p1[0]*Math.cos(a1), cy+p1[0]*Math.sin(a1), z0+p1[1]),
                   P(cx+p1[0]*Math.cos(a0), cy+p1[0]*Math.sin(a0), z0+p1[1])];
          o.push(face(q, m, nx, ny, nz, H.depthOf(q), 1, "self"));
        }
      }
      var top = prof(1), tp = [];
      for (var c = 0; c < segs; c++) { var ca = c/segs*Math.PI*2; tp.push(P(cx + Math.max(top[0], r*0.03)*Math.cos(ca), cy + Math.max(top[0], r*0.03)*Math.sin(ca), z0+top[1])); }
      o.push(face(tp, m, 0, 0, 1, H.depthOf(tp), 1, "self"));
      return o;
    }

    /* the convex hull of ground points (monotone chain), for the cast shadows */
    function hull(pts){
      pts = pts.slice().sort(function(a, b){ return a[0]-b[0] || a[1]-b[1]; });
      function cross(o, a, b){ return (a[0]-o[0])*(b[1]-o[1]) - (a[1]-o[1])*(b[0]-o[0]); }
      var lo = [], up = [];
      pts.forEach(function(q){ while (lo.length >= 2 && cross(lo[lo.length-2], lo[lo.length-1], q) <= 0) lo.pop(); lo.push(q); });
      for (var i = pts.length-1; i >= 0; i--) { var q = pts[i]; while (up.length >= 2 && cross(up[up.length-2], up[up.length-1], q) <= 0) up.pop(); up.push(q); }
      lo.pop(); up.pop();
      return lo.concat(up);
    }
    /* a shadow polygon on a horizontal plane, its vertices clamped inside a circle
       about the building's centre so it never runs off the surface it falls on */
    function shadowOn(pts, z, rMax, opacity, depth){
      var q = hull(pts).map(function(v){
        var dx = v[0]-X, dy = v[1]-Y, l = Math.sqrt(dx*dx+dy*dy);
        if (rMax && l > rMax) { dx *= rMax/l; dy *= rMax/l; }
        return P(X+dx, Y+dy, z);
      });
      return { svg: ctx.poly(q, "#000", null, 0, ' opacity="' + opacity + '"'), depth: depth };
    }

    /* ---------- the order: an Ionic column, every part from one axis ---------- */
    var colD = 5.25*FT*s;                     /* 1.60 m */
    var colH = 43*FT;                         /* 13.11 m, the whole order: base and capital come out of it */
    var baseH = 0.50*colD, capH = 0.65*colD;  /* Attic base, Ionic capital (derived, see header) */
    var shaftH = colH - baseH - capH;         /* 11.27 m */
    /* ang = the direction the column faces; the volutes hang on the two sides of that */
    function column(cx, cy, z0, ang){
      var d = colD, o = [], z = z0, k = 0;
      var d0 = P(cx, cy, z0)[2];              /* one depth for the whole stack, from the axis */
      function D(){ return d0 + (k++)*0.002; }
      o = o.concat(obox(cx, cy, 1.4*d, 1.4*d, z, 0.16*d, ang, M.marble, D(), 0.86)); z += 0.16*d;    /* plinth, 1.4 d */
      o = o.concat(cyl(cx, cy, 0.62*d, z, 0.14*d, 10, M.marble, D(), 0.90, "self"));  z += 0.14*d;    /* lower torus */
      o = o.concat(cyl(cx, cy, 0.50*d, z, 0.10*d, 10, M.marble, D(), 0.84, "self"));  z += 0.10*d;    /* scotia */
      o = o.concat(cyl(cx, cy, 0.57*d, z, 0.10*d, 10, M.marble, D(), 0.95, "self"));  z += 0.10*d;    /* upper torus */
      /* the shaft: unfluted, so a smooth cylinder with only its two silhouette lines */
      o = o.concat(cyl(cx, cy, 0.5*d, z, shaftH, 12, M.marble, D(), 1, "self"));      z += shaftH;
      o = o.concat(cyl(cx, cy, 0.56*d, z, 0.15*d, 10, M.marble, D(), 0.92, "self"));                   /* echinus */
      /* the two volute scrolls, projecting 0.25 d each side of the shaft */
      var ca = Math.cos(ang), sa = Math.sin(ang);
      [-1, 1].forEach(function(sd){
        var sx = cx - sd*sa*0.52*d, sy = cy + sd*ca*0.52*d;
        o = o.concat(obox(sx, sy, 0.42*d, 0.46*d, z - 0.10*d, 0.36*d, ang, M.marble, D(), 0.88));
      });
      z += 0.15*d;
      o = o.concat(obox(cx, cy, 0.85*d, 1.5*d, z, 0.38*d, ang, M.marble, D()));       z += 0.38*d;    /* volute block, 1.5 d across */
      o = o.concat(obox(cx, cy, 1.1*d, 1.1*d, z, 0.12*d, ang, M.marble, D()));                       /* abacus */
      return o;
    }

    /* ---------- dimensions ---------- */
    var R    = 165/2*FT*s;                    /* 25.15 m: the 165 ft footprint */
    var rCol = R - colD/2 - 0.35;             /* 24.0 m: column centres, a 0.35 m stylobate margin (derived) */
    var HTOT = p.h*VE;                        /* 39 m = 129 ft, true height */

    /* the entablature: 0.22 of the column, cornice projecting 0.05 (derived) */
    var entA = 0.07*colH, entF = 0.08*colH, entC = 0.07*colH, entH = entA + entF + entC;   /* 0.92 + 1.05 + 0.92 = 2.88 m */
    var cornP = 0.05*colH;                    /* 0.66 m */
    var rE = rCol + colD/2;                   /* 24.8: the architrave face, flush with the shafts */
    var rRoof = rE + cornP;                   /* 25.46: the cornice face, and the roof edge */
    var parH = 0.04*colH, parT = 0.4;         /* the roof parapet: 0.52 m tall, 0.4 m thick */

    /* the cella, the attic and the dome (derived, see header) */
    var rDrum = 0.58*rCol;                    /* 13.92 m: cella and attic outside, the dome's span */
    var rIn   = 86/2*FT;                      /* 13.11 m: the chamber inside (assumed) */
    var atticH = 0.35*colH;                   /* 4.59 m: the plain attic above the roof */
    var acH = 0.05*colH, acP = 0.02*colH;     /* its cornice: 0.66 m tall, projecting 0.26 m */
    var span  = 2*rDrum;                      /* 27.84 m */
    var ringH = 0.02*span, ringIn = 0.02*span;/* 0.56 m tall, 0.56 m in, three rings */
    var rCap  = rDrum - 3*ringIn;             /* 12.25 m: the cap springs from the top ring */
    var capRise = 0.30*(2*rCap);              /* 7.35 m: rise 0.30 of the cap's span (sphere radius 13.9 m) */

    /* the stylobate is what is left of 129 ft (derived), and the stair is cut from it */
    var zStylo = HTOT - (colH + entH + atticH + acH + 3*ringH + capRise);   /* 8.74 m */
    var riser0 = 6/12*FT, tread = 14/12*FT;   /* 6 in, 14 in */
    var nRise = Math.round(zStylo/riser0), riser = zStylo/nRise;     /* 57 risers */
    var landing = 12*FT;                      /* 3.66 m */
    var zColTop = zStylo + colH;              /* 21.85 */
    var zEnt = zColTop + entH;                /* 24.73: the roof level */
    var zAttic = zEnt + atticH;               /* 29.32 */
    var zAtticTop = zAttic + acH;             /* 29.98 */
    var zSpring = zAtticTop + 3*ringH;        /* 31.65: the cap's springing */

    /* the portico */
    var portW = 102*FT*s;                     /* 31.09 m */
    var bay = portW/7;                        /* 4.44 m centre to centre, 8 columns across */
    var halfW = portW/2;
    var yRear = Math.sqrt(rCol*rCol - halfW*halfW);   /* 18.3: rear side columns stand on the ring */
    var yFront = yRear + 2*bay;               /* 27.2: 2 bays deep */
    var pw = portW + colD;                    /* 32.69: the entablature, flush with the outer shafts */
    var yEntF = yFront + colD/2;              /* 28.0: the architrave front face */
    var yCornF = yEntF + cornP;               /* 28.7: the cornice front face */
    var pedSpan = pw + 2*cornP;               /* 34.0 */
    var pedRise = 0.11*pedSpan;               /* 3.74: the tympanum height, pitch about 1 in 4.5 (derived) */
    var yPlinth = yEntF + 0.9;                /* 28.9: the stylobate runs a little past the front row (derived) */
    /* the portico entablature returns to where the ring's cornice passes its outer edge */
    var yEB = Math.sqrt(rE*rE - halfW*halfW) - 0.2;   /* 18.5 */

    /* the stairs: the full portico width, between low cheek curbs */
    var stairW = pw, cw = 1.0;                /* curb thickness derived */
    var n1 = Math.ceil(nRise/2), n2 = nRise - n1;
    var yL = yPlinth + n1*tread;              /* the landing */
    var zLand = zStylo - n1*riser;
    var yF2 = yL + landing;                   /* top of the lower flight */
    var yFoot = yF2 + n2*tread;               /* the plaza */
    var xw = stairW/2 + cw;                   /* the outer face of the curbs and the platform */

    /* the podium: a granite terrace and three marble steps up to the stylobate */
    var stepH = 0.02*colH, stepIn = 0.6, nStep = 3;   /* 0.26 m risers (derived) */
    var rPod = R + nStep*stepIn;              /* 26.95 */
    var zPod = zStylo - nStep*stepH;          /* 7.95 */

    var north = ctx.faceVisible(0, 1), west = ctx.faceVisible(-1, 0);

    /* ---------- the cast shadow on the ground: the silhouette of every mass slid along the light ---------- */
    var sp = [], cp = [];
    function ring(r, h, into, n){ for (var i = 0; i < (n||24); i++) { var a = i/(n||24)*Math.PI*2; into.push([X + r*Math.cos(a) + SX*h, Y + r*Math.sin(a) + SY*h]); } }
    function pt(x, y, h, into){ into.push([X + x + SX*h, Y + y + SY*h]); }
    var prof = capProfile(rCap, capRise);
    ring(rPod, 0, sp); ring(rPod, 0, cp);
    ring(rRoof, zEnt + parH, sp);
    ring(rDrum + acP, zAtticTop, sp);
    [0.35, 0.65, 0.85, 1].forEach(function(t){ var q = prof(t); ring(Math.max(q[0], 0.5), zSpring + q[1], sp, 16); });
    [[-pedSpan/2, yCornF], [pedSpan/2, yCornF]].forEach(function(c){ pt(c[0], c[1], zEnt, sp); pt(c[0], c[1], 0, sp); pt(c[0], c[1], 0, cp); });
    pt(0, yCornF, zEnt + pedRise, sp);
    [[-xw, yFoot], [xw, yFoot]].forEach(function(c){ pt(c[0], c[1], riser, sp); pt(c[0], c[1], 0, sp); pt(c[0], c[1], 0, cp); });
    [[-xw, yPlinth], [xw, yPlinth]].forEach(function(c){ pt(c[0], c[1], zStylo + riser, sp); pt(c[0], c[1], 0, cp); });
    [[-xw, yL], [xw, yL]].forEach(function(c){ pt(c[0], c[1], zLand + riser, sp); });
    out.push({ svg: ctx.poly(hull(sp).map(function(q){ return P(q[0], q[1], 0.3); }), "#000", null, 0, ' opacity="0.17"'), depth: -1e9 + 2 });
    /* a thin contact shadow along every ground-touching base */
    var cs = hull(cp.map(function(q){ return [q[0] + SX*1.0, q[1] + SY*1.0]; }));
    out.push({ svg: ctx.poly(cs.map(function(q){ return P(q[0], q[1], 0.35); }), "#000", null, 0, ' opacity="0.10"'), depth: -1e9 + 2.5 });

    /* ---------- the podium, painted ground-up with explicit depths ---------- */
    var B = -1e8;
    function yCirc(r, x){ return Math.sqrt(Math.max(0, r*r - x*x)); }
    out = out.concat(cyl(X, Y, rPod, 0, zPod, 48, M.granite, B, 0.97, "self"));
    /* two subdued horizontal joints in the terrace wall, the courses of the granite */
    [0.34, 0.67].forEach(function(f, i){
      out = out.concat(cyl(X, Y, rPod + 0.02, zPod*f - 0.03, 0.06, 48, M.granite, B + 1 + i, 0.86, "self", true));
    });
    for (var st = 0; st < nStep; st++) {
      out = out.concat(cyl(X, Y, R + (nStep-1-st)*stepIn, zPod + st*stepH, stepH, 48, M.marble, B + 4 + st, 1, "self"));
    }
    /* the platform under the portico and the stair head: a rectangle clipped to the
       terrace circle, so no face is ever drawn inside the podium or beyond it */
    function platform(rClip, z0, h, m, depth, ao){
      var o = [], arc = [], n = 16;
      for (var i = 0; i <= n; i++) { var x = -xw + 2*xw*i/n; arc.push([X + x, Y + yCirc(rClip, x)]); }
      var foot = arc.concat([[X + xw, Y + yPlinth], [X - xw, Y + yPlinth]]);
      /* side faces */
      [[-1, [X - xw, Y + yCirc(rClip, xw)], [X - xw, Y + yPlinth]], [1, [X + xw, Y + yPlinth], [X + xw, Y + yCirc(rClip, xw)]]].forEach(function(e){
        if (!ctx.faceVisible(e[0], 0)) return;
        var q = [P(e[1][0], e[1][1], z0), P(e[2][0], e[2][1], z0), P(e[2][0], e[2][1], z0+h), P(e[1][0], e[1][1], z0+h)];
        o.push(face(q, m, e[0], 0, 0, depth, ao));
      });
      if (ctx.faceVisible(0, 1)) {
        var q2 = [P(X - xw, Y + yPlinth, z0), P(X + xw, Y + yPlinth, z0), P(X + xw, Y + yPlinth, z0+h), P(X - xw, Y + yPlinth, z0+h)];
        o.push(face(q2, m, 0, 1, 0, depth + 0.002, ao));
      }
      o.push(face(foot.map(function(v){ return P(v[0], v[1], z0+h); }), m, 0, 0, 1, depth + 0.005, ao, "self"));
      return o;
    }
    out = out.concat(platform(rPod, 0, zPod, M.granite, B + 12, 0.97));
    out = out.concat(platform(rPod, zPod, zStylo - zPod, M.marble, B + 13));
    /* the Tennessee marble floor inside the chamber wall */
    var floor = [];
    for (var fi = 0; fi < 24; fi++) { var fa = fi/24*Math.PI*2; floor.push(P(X + rIn*Math.cos(fa), Y + rIn*Math.sin(fa), zStylo + 0.02)); }
    out.push(face(floor, M.floor, 0, 0, 1, B + 16, 1, "self"));
    /* the roof's shadow on the stylobate: the roof outline (ring plus portico) dropped
       along the light to floor level, clipped to the stylobate */
    var rs = [], hRoof = zEnt - zStylo;
    for (var ri = 0; ri < 32; ri++) { var ra = ri/32*Math.PI*2; rs.push([X + rRoof*Math.cos(ra) + SX*hRoof, Y + rRoof*Math.sin(ra) + SY*hRoof]); }
    [[-pedSpan/2, yCornF], [pedSpan/2, yCornF], [-pedSpan/2, yEB], [pedSpan/2, yEB]].forEach(function(c){ rs.push([X + c[0] + SX*hRoof, Y + c[1] + SY*hRoof]); });
    out.push(shadowOn(rs, zStylo + 0.03, R - 0.05, 0.15, B + 17));
    /* every column's own shadow across the floor, clipped to the stylobate */
    var colShadow = [];
    function colShade(cx, cy){
      var len = colH, w = 0.5*colD, dx = SX*len, dy = SY*len, l = Math.sqrt(dx*dx+dy*dy), px = -dy/l*w, py = dx/l*w;
      colShadow.push(shadowOn([[cx+px, cy+py], [cx-px, cy-py], [cx-px+dx, cy-py+dy], [cx+px+dx, cy+py+dy]], zStylo + 0.04, R - 0.05, 0.12, B + 18));
    }

    /* ---------- the stair: two broad flights with a landing, between low curbs ---------- */
    var sh = stairW/2;
    function flight(yTop, zTop, n, k0, m){
      var o = [];
      for (var k = 0; k < n; k++) {
        var y0 = yTop + k*tread, y1 = y0 + tread, zt = zTop - (k+1)*riser, dp = B + 30 + k0 + k;
        if (north) {
          var rq = [P(X-sh, Y+y0, zt), P(X+sh, Y+y0, zt), P(X+sh, Y+y0, zt+riser), P(X-sh, Y+y0, zt+riser)];
          o.push(face(rq, m, 0, 1, 0, dp, 0.90, "self"));
        }
        var tq = [P(X-sh, Y+y0, zt), P(X+sh, Y+y0, zt), P(X+sh, Y+y1, zt), P(X-sh, Y+y1, zt)];
        o.push(face(tq, m, 0, 0, 1, dp + 0.0005, 1, "self"));
      }
      return o;
    }
    out = out.concat(flight(yPlinth, zStylo, n1, 0, M.marble));
    var lq = [P(X-sh, Y+yL, zLand), P(X+sh, Y+yL, zLand), P(X+sh, Y+yF2, zLand), P(X-sh, Y+yF2, zLand)];
    out.push(face(lq, M.granite, 0, 0, 1, B + 30 + n1, 1, "self"));
    out = out.concat(flight(yF2, zLand, n2, n1 + 1, M.granite));
    /* the cheek curbs: low, one riser above the treads, the far one painted before
       the steps and the near one after; their outer faces are the stair's own sides */
    var lip = riser;
    [[yPlinth, yL, zStylo + lip, zLand + lip], [yL, yF2, zLand + lip, zLand + lip], [yF2, yFoot, zLand + lip, lip]].forEach(function(seg, si){
      [-1, 1].forEach(function(sd){
        var near = (sd < 0) === west;
        var xo = sd*xw, xi = sd*(xw - cw);
        var c = sd < 0 ? [[X+xo, Y+seg[0]], [X+xi, Y+seg[0]], [X+xi, Y+seg[1]], [X+xo, Y+seg[1]]]
                       : [[X+xi, Y+seg[0]], [X+xo, Y+seg[0]], [X+xo, Y+seg[1]], [X+xi, Y+seg[1]]];
        out = out.concat(wedge(c, 0, [seg[2], seg[2], seg[3], seg[3]], M.granite, near ? B + 200 + si : B + 20 + si));
      });
    });

    /* ---------- the cella: a solid white cylinder, four portals, 16 columns in them ---------- */
    var openH = 0.8*colH;                     /* 10.5 m */
    var rWallMid = (rIn + rDrum)/2;           /* 13.5 */
    var ibay = 1.8*colD;                      /* 2.88 m: the interior intercolumniation (assumed, see header) */
    var openHalf = Math.asin(1.5*ibay/rWallMid);   /* 3 intercolumniations wide, 4 columns at the bay */
    var seg = Math.PI/2 - 2*openHalf;
    for (var w = 0; w < 4; w++) {
      var a0 = w*Math.PI/2 + openHalf;
      out = out.concat(arcWall(X, Y, rIn, rDrum, zStylo, openH, a0, a0 + seg, 8, M.marble, 0.96, undefined, "self"));
      for (var oc = 0; oc < 4; oc++) {
        var ang = w*Math.PI/2 + (-1.5 + oc)*ibay/rWallMid;
        var icx = X + rWallMid*Math.cos(ang), icy = Y + rWallMid*Math.sin(ang);
        out = out.concat(column(icx, icy, zStylo, ang));
      }
    }
    /* the wall above the portals, up to the entablature, in the roof's shade */
    out = out.concat(arcWall(X, Y, rIn, rDrum, zStylo + openH, zColTop - zStylo - openH, 0, Math.PI*2, 40, M.marble, 0.88, undefined, "self"));

    /* ---------- the statue: 19 ft bronze Jefferson on a 6 ft black granite pedestal ---------- */
    var pedH = 6*FT, statH = 19*FT;
    out = out.concat(box(X, Y, 2.4, 2.4, zStylo, pedH, M.black));
    out = out.concat(box(X, Y, statH/3.5, statH/3.5*0.7, zStylo + pedH, statH*0.86, M.bronze));
    out = out.concat(box(X, Y, statH/3.5*0.45, statH/3.5*0.45, zStylo + pedH + statH*0.86, statH*0.14, M.bronze));

    /* ---------- the 26 ring columns, 360/26 apart, none on the axis ---------- */
    for (var c = 0; c < 26; c++) {
      var ca = Math.PI/2 + (c+0.5)*(Math.PI*2/26);
      var rcx = X + rCol*Math.cos(ca), rcy = Y + rCol*Math.sin(ca);
      out = out.concat(column(rcx, rcy, zStylo, ca));
      colShade(rcx, rcy);
    }

    /* ---------- the 12 portico columns: 8 across the front, 2 on each return ---------- */
    for (var pc = 0; pc < 8; pc++) {
      var pcx = X + (pc-3.5)*bay, pcy = Y + yFront;
      out = out.concat(column(pcx, pcy, zStylo, Math.PI/2));
      colShade(pcx, pcy);
    }
    [-1, 1].forEach(function(sd){
      var fa = sd < 0 ? Math.PI : 0;
      out = out.concat(column(X + sd*halfW, Y + yFront - bay, zStylo, fa)); colShade(X + sd*halfW, Y + yFront - bay);
      out = out.concat(column(X + sd*halfW, Y + yRear, zStylo, fa));        colShade(X + sd*halfW, Y + yRear);
    });
    out = out.concat(colShadow);

    /* ---------- the ring entablature, the roof, the attic, the step rings, the dome ---------- */
    var E = 5e5;
    var JOINT = 0.06;                          /* a dark seam where one member sits on the next */
    out = out.concat(cyl(X, Y, rE, zColTop, entA, 48, M.marble, E, 0.92, "self"));                              /* architrave */
    out = out.concat(cyl(X, Y, rE + 0.02, zColTop + entA - JOINT, JOINT, 48, M.marble, E + 0.5, 0.74, "self", true));
    out = out.concat(cyl(X, Y, rE, zColTop + entA, entF, 48, M.marble, E + 1, 0.96, "self"));                   /* frieze */
    out = out.concat(cyl(X, Y, rRoof, zColTop + entA + entF, entC, 48, M.marble, E + 2, 1, "self"));            /* cornice, projecting */
    out = out.concat(cyl(X, Y, rRoof + 0.02, zColTop + entA + entF, JOINT*1.5, 48, M.marble, E + 2.5, 0.72, "self", true));   /* its soffit shadow */
    /* the roof: the cornice's own top, with the drum and dome's shadow on it and a low parapet */
    var ds = [];
    ring(rDrum + acP, 0, ds, 32);
    ring(rDrum + acP, zAtticTop - zEnt, ds, 32);
    [0.35, 0.65, 0.85, 1].forEach(function(t){ var q = prof(t); ring(Math.max(q[0], 0.5), zSpring + q[1] - zEnt, ds, 16); });
    out.push(shadowOn(ds, zEnt + 0.02, rRoof - parT - 0.05, 0.20, E + 6));
    var parGap = Math.asin(Math.min(1, (pedSpan/2)*(1 - parH/pedRise)/rRoof));   /* the parapet stops under the portico roof */
    out = out.concat(arcWall(X, Y, rRoof - parT, rRoof, zEnt, parH, Math.PI/2 + parGap, Math.PI*2.5 - parGap, 56, M.marble, 1, E + 8, "self"));
    /* the attic: a plain smooth cylinder with a thin projecting cornice */
    out = out.concat(cyl(X, Y, rDrum, zEnt, atticH, 48, M.marble, E + 100, 1, "self"));
    out = out.concat(cyl(X, Y, rDrum + acP, zAttic, acH, 48, M.marble, E + 101, 1, "self"));
    out = out.concat(cyl(X, Y, rDrum + acP + 0.02, zAttic, JOINT, 48, M.marble, E + 101.5, 0.74, "self", true));
    /* three step rings, each 0.02 of the span tall and stepping in 0.02 */
    for (var rg = 0; rg < 3; rg++) {
      out = out.concat(cyl(X, Y, rDrum - rg*ringIn, zAtticTop + rg*ringH, ringH, 48, M.marble, E + 110 + rg, 1, "self"));
    }
    /* the dome: one smooth saucer, no meridians */
    out = out.concat(lift(cap(X, Y, rCap, zSpring, capRise, M.marble, 48, 12), E + 200));

    /* ---------- the portico entablature, the gable running back into the attic, the pediment ---------- */
    var PE = north ? E + 300 : E - 10;     /* nearest thing from the north; behind the drum from the south */
    out = out.concat(box(X, Y + (yEB + yEntF)/2, pw, yEntF - yEB, zColTop, entA, M.marble, PE, 0.92, "self"));
    out = out.concat(box(X, Y + (yEB + yEntF)/2, pw, yEntF - yEB, zColTop + entA, entF, M.marble, PE + 1, 0.96, "self"));
    out = out.concat(box(X, Y + (yEB + yCornF)/2, pedSpan, yCornF - yEB, zColTop + entA + entF, entC, M.marble, PE + 2, 1, "self"));
    /* joint lines on the portico's faces, matching the ring's */
    out = out.concat(box(X, Y + (yEB + yEntF)/2, pw + 0.04, yEntF - yEB + 0.04, zColTop + entA - JOINT, JOINT, M.marble, PE + 0.5, 0.74, "self"));
    out = out.concat(box(X, Y + (yEB + yCornF)/2, pedSpan + 0.04, yCornF - yEB + 0.04, zColTop + entA + entF, JOINT*1.5, M.marble, PE + 1.5, 0.72, "self"));
    (function(){
      var hw = pedSpan/2, zB = zEnt;
      function zRoof(x){ return zB + pedRise*(1 - Math.abs(x)/hw); }
      function yBack(x){ return yCirc(rDrum, x); }        /* where the gable meets the attic; 0 beyond it */
      var L = Math.sqrt(pedRise*pedRise + hw*hw), nxr = pedRise/L, nzr = hw/L;
      /* each slope: front edge along the raking cornice, back edge along the attic wall */
      [-1, 1].forEach(function(sd){
        var q = [], n = 24;
        for (var i = 0; i <= n; i++) { var x = sd*hw*i/n; q.push(P(X + x, Y + yCornF, zRoof(x))); }
        for (var j = n; j >= 0; j--) { var x2 = sd*hw*j/n; q.push(P(X + x2, Y + yBack(x2), zRoof(x2))); }
        var isNear = (sd < 0) === west;
        out.push(face(q, M.marble, sd*nxr, 0, nzr, PE + (isNear ? 5 : 4), 0.97));
      });
      /* the slivers beyond the attic end on the cross axis: their small back faces */
      if (ctx.faceVisible(0, -1)) {
        [-1, 1].forEach(function(sd){
          var x0 = sd*rDrum, x1 = sd*hw;
          out.push(face([P(X + x0, Y, zB), P(X + x1, Y, zB), P(X + x0, Y, zRoof(x0))], M.marble, 0, -1, 0, PE + 4.5));
        });
      }
      if (north) {
        /* the raking cornice: the front face of the gable, then the tympanum recessed behind it */
        var fw = P(X - hw, Y + yCornF, zB), fe = P(X + hw, Y + yCornF, zB), apexF = P(X, Y + yCornF, zB + pedRise);
        out.push(face([fw, fe, apexF], M.marble, 0, 1, 0, PE + 6));
        var b = 0.7, yT = yCornF - 0.45;
        var tw = hw - b*1.6, tz0 = zB + 0.12, tz1 = zB + pedRise - b*1.2;
        out.push(face([P(X - tw, Y + yT, tz0), P(X + tw, Y + yT, tz0), P(X, Y + yT, tz1)], M.marble, 0, 1, 0, PE + 7, 0.90, "self"));
        /* Weinman's group: five figures in low relief, seated toward the corners, the
           tallest at the centre, the whole 0.8 of the tympanum height */
        var tH = tz1 - tz0, gH = 0.8*tH;
        var fig = [[-7.6, 0.50], [-3.8, 0.74], [0, 1.0], [3.8, 0.74], [7.6, 0.50]];
        fig.forEach(function(f, i){
          var fx = f[0], fh = gH*f[1], bodyH = fh*0.62, headH = fh*0.16, bw = fh*0.9, dep = 0.45;
          var lower = box(X + fx, Y + yT - dep/2, bw, dep, tz0, bodyH*0.55, M.marble, PE + 8 + i*0.02, 0.86, "self");
          var upper = box(X + fx, Y + yT - dep/2 - 0.05, bw*0.62, dep*0.9, tz0 + bodyH*0.55, bodyH*0.45, M.marble, PE + 8.005 + i*0.02, 0.9, "self");
          var head  = cyl(X + fx, Y + yT - dep/2 - 0.05, headH*0.55, tz0 + bodyH, headH, 8, M.marble, PE + 8.01 + i*0.02, 0.9, "self");
          out = out.concat(lower, upper, head);
        });
      }
    })();

    /* ---------- the depth remap (see header) ----------
       B-band items (podium, platform, floor, stairs, curbs) land 50 m behind
       the building's centre depth, well before any column; E-band items
       (entablature, attic, dome, portico gable) land 40 m ahead of it, after
       every column. Within each band the original order is kept at a
       hundredth of its spacing, so a bias of 100 is one metre. Shadows on
       the ground (-1e9 + n) stay on the ground. */
    var ryC = P(X, Y, 0)[2];
    out.forEach(function(it){
      if (it.depth < -1e9 + 100) return;
      if (it.depth < B + 1e6) it.depth = ryC - 50 + (it.depth - B) * 0.01;
      else if (it.depth > E - 1e3) it.depth = ryC + 40 + (it.depth - E) * 0.01;
    });
    return out;
  };
})();
