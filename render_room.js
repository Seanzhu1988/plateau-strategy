/* render_room.js — look at a gallery interior without a browser.
 *
 *     node render_room.js dendur > /tmp/x.svg
 *     qlmanage -t -s 900 -o /tmp /tmp/x.svg      # macOS: SVG to PNG
 *
 * Written because a browser pane sat at zero width for a whole session and
 * every model in met-rooms.js shipped verified by arithmetic alone. That is
 * not enough: a floor plane painted over an entire room, a glass wall covered
 * a temple, four numbered stops floated across an exhibit, a moon gate was
 * buried by its own wall, and every one of those passed a face count, a
 * bounding box and a finite-geometry check without complaint.
 *
 * The projection, shading and face culling are copied from met-3d.js, so what
 * this draws is what the page draws. Depth ordering is the host's too: sort
 * ascending, paint in order.
 *
 * THE RULE THIS TOOL KEEPS TEACHING: a large flat surface cannot be sorted by
 * its own corners. A painter's depth is a face's NEAREST point, and a floor,
 * a wall or a glass sheet spanning the room has a nearer corner than anything
 * standing on it, so it paints last and hides its own contents. Every large
 * plane in met-rooms.js is given an explicit depth for that reason.
 */
global.window = {};
require("/Users/xiaojunzhu/Claude/worktrees/site/styles-3d.js");
require("/Users/xiaojunzhu/Claude/worktrees/site/met-rooms.js");
const key = process.argv[2];
/* A trail stop renders the same way a gallery does, because trail-3d.js
   scenes take the same pure context. "trail:bunker-hill" picks one. */
/* "spec:/path/to/spec.json" draws a landmark composed from its facts rather
   than from hand-written code, so the composer's output can be LOOKED at.
   A wrong proportion passes every arithmetic check and fails one glance. */
/* "moma:closed" / "moma:open" draws the MoMA building from the same floor
   data the 2D map uses. Same pure-context contract as every other scene. */
if (key.startsWith("moma:")) {
  const fs2 = require("fs");
  const src = fs2.readFileSync("/Users/xiaojunzhu/Claude/worktrees/site/moma-map.js", "utf8");
  const g = src.match(/window\.MOMA_GEOMETRY\s*=\s*\{[\s\S]*?\n\};/);
  if (g) { eval(g[0]); }
  require("/Users/xiaojunzhu/Claude/worktrees/site/moma-3d.js");
  const scene = window.MOMA3D.scenes[key.slice(5)] || window.MOMA3D.scenes.closed;
  const yawM = parseFloat(process.argv[3] || "-0.62");
  const pitchM = parseFloat(process.argv[4] || "0.42");
  const WM = 900, HM = 700;
  const mkM = (SC,OX,OY) => (x,y,z) => {
    const c=Math.cos(yawM), s2=Math.sin(yawM);
    const rx=x*c-y*s2, ry=x*s2+y*c;
    return [OX+rx*SC, OY+(ry*Math.sin(pitchM)-(z||0)*Math.cos(pitchM))*SC, ry];
  };
  const fvM = (nx,ny) => (nx*Math.sin(yawM)+ny*Math.cos(yawM)) > 0.001;
  const LM = [0.60,0.30,0.68];
  const shM = (h,nx,ny,nz) => { const d=nx*LM[0]+ny*LM[1]+nz*LM[2], f=0.58+0.42*Math.max(0,d);
    const n=parseInt(h.slice(1),16);
    return `rgb(${Math.min(255,Math.round((n>>16&255)*f))},${Math.min(255,Math.round((n>>8&255)*f))},${Math.min(255,Math.round((n&255)*f))})`; };
  let BM=null; const bbM = pts => { pts.forEach(p=>{ if(!BM) BM=[p[0],p[1],p[0],p[1]];
    BM[0]=Math.min(BM[0],p[0]);BM[1]=Math.min(BM[1],p[1]);
    BM[2]=Math.max(BM[2],p[0]);BM[3]=Math.max(BM[3],p[1]); }); return ''; };
  scene({project:mkM(1,0,0), poly:bbM, shade:shM, faceVisible:fvM});
  const bwM=BM[2]-BM[0], bhM=BM[3]-BM[1];
  const SCM=Math.min((WM-60)/bwM,(HM-60)/bhM);
  const OXM=(WM-bwM*SCM)/2-BM[0]*SCM, OYM=(HM-bhM*SCM)/2-BM[1]*SCM;
  const polyM = (pts,f,st,sw,ex) =>
    `<polygon points="${pts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ')}" fill="${f}"`
    + (st?` stroke="${st}" stroke-width="${sw||1}"`:'') + ' stroke-linejoin="round"' + (ex||'') + '/>';
  const itM = scene({project:mkM(SCM,OXM,OYM), poly:polyM, shade:shM, faceVisible:fvM});
  itM.sort((a,b)=>a.depth-b.depth);
  console.log(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WM} ${HM}" width="${WM}" height="${HM}">`
    + `<rect width="${WM}" height="${HM}" fill="#f2f3ef"/>` + itM.map(i=>i.svg).join('') + '</svg>');
  process.exit(0);
}
if (key.startsWith("spec:")) {
  require("/Users/xiaojunzhu/Claude/worktrees/site/landmark-3d.js");
  const spec = JSON.parse(require("fs").readFileSync(key.slice(5), "utf8"));
  const scene = window.LANDMARK3D.fromSpec(spec);
  if (!scene) { console.error("spec is not buildable"); process.exit(1); }
  const yawS = parseFloat(process.argv[3] || "-0.62");
  const pitchS = parseFloat(process.argv[4] || "0.30");
  const WS = 900, HS = 700;
  const mkS = (SC,OX,OY) => (x,y,z) => {
    const c=Math.cos(yawS), s2=Math.sin(yawS);
    const rx=x*c-y*s2, ry=x*s2+y*c;
    return [OX+rx*SC, OY+(ry*Math.sin(pitchS)-(z||0)*Math.cos(pitchS))*SC, ry];
  };
  const fvS = (nx,ny) => (nx*Math.sin(yawS)+ny*Math.cos(yawS)) > 0.001;
  const LS = [0.60,0.30,0.68];
  const shS = (h,nx,ny,nz) => { const d=nx*LS[0]+ny*LS[1]+nz*LS[2], f=0.55+0.45*Math.max(0,d);
    const n=parseInt(h.slice(1),16);
    return `rgb(${Math.min(255,Math.round((n>>16&255)*f))},${Math.min(255,Math.round((n>>8&255)*f))},${Math.min(255,Math.round((n&255)*f))})`; };
  let BS=null; const bbS = pts => { pts.forEach(p=>{ if(!BS) BS=[p[0],p[1],p[0],p[1]];
    BS[0]=Math.min(BS[0],p[0]);BS[1]=Math.min(BS[1],p[1]);
    BS[2]=Math.max(BS[2],p[0]);BS[3]=Math.max(BS[3],p[1]); }); return ''; };
  scene({project:mkS(1,0,0), poly:bbS, shade:shS, faceVisible:fvS});
  const bwS=BS[2]-BS[0], bhS=BS[3]-BS[1];
  const SCS=Math.min((WS-60)/bwS,(HS-60)/bhS);
  const OXS=(WS-bwS*SCS)/2-BS[0]*SCS, OYS=(HS-bhS*SCS)/2-BS[1]*SCS;
  const polyS = (pts,f,st,sw,ex) =>
    `<polygon points="${pts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ')}" fill="${f}"`
    + (st?` stroke="${st}" stroke-width="${sw||1}"`:'') + ' stroke-linejoin="round"' + (ex||'') + '/>';
  const itS = scene({project:mkS(SCS,OXS,OYS), poly:polyS, shade:shS, faceVisible:fvS});
  itS.sort((a,b)=>a.depth-b.depth);
  console.log(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WS} ${HS}" width="${WS}" height="${HS}">`
    + `<rect width="${WS}" height="${HS}" fill="#eef0ea"/>` + itS.map(i=>i.svg).join('') + '</svg>');
  process.exit(0);
}
if (key.startsWith("trail:")) {
  require("/Users/xiaojunzhu/Claude/worktrees/site/trail-3d.js");
  const sk = key.slice(6);
  const scene = (window.TRAIL3D || {}).scenes[sk];
  if (!scene) { console.error("no such trail scene: " + sk); process.exit(1); }
  const yaw2 = parseFloat(process.argv[3] || "-0.62"), pitch2 = parseFloat(process.argv[4] || "0.30");
  const W2 = 900, H2 = 700;
  const mk2 = (SC,OX,OY) => (x,y,z) => {
    const c=Math.cos(yaw2), s=Math.sin(yaw2);
    const rx=x*c-y*s, ry=x*s+y*c;
    return [OX+rx*SC, OY+(ry*Math.sin(pitch2)-(z||0)*Math.cos(pitch2))*SC, ry];
  };
  const fv2 = (nx,ny) => (nx*Math.sin(yaw2)+ny*Math.cos(yaw2)) > 0.001;
  const L2 = [0.60,0.30,0.68];
  const sh2 = (h,nx,ny,nz) => { const d=nx*L2[0]+ny*L2[1]+nz*L2[2], f=0.55+0.45*Math.max(0,d);
    const n=parseInt(h.slice(1),16);
    return `rgb(${Math.min(255,Math.round((n>>16&255)*f))},${Math.min(255,Math.round((n>>8&255)*f))},${Math.min(255,Math.round((n&255)*f))})`; };
  let B2=null; const bb2 = pts => { pts.forEach(p=>{ if(!B2) B2=[p[0],p[1],p[0],p[1]];
    B2[0]=Math.min(B2[0],p[0]);B2[1]=Math.min(B2[1],p[1]);
    B2[2]=Math.max(B2[2],p[0]);B2[3]=Math.max(B2[3],p[1]); }); return ''; };
  scene({project:mk2(1,0,0), poly:bb2, shade:sh2, faceVisible:fv2});
  const bw2=B2[2]-B2[0], bh2=B2[3]-B2[1];
  const SC2=Math.min((W2-60)/bw2,(H2-60)/bh2);
  const OX2=(W2-bw2*SC2)/2-B2[0]*SC2, OY2=(H2-bh2*SC2)/2-B2[1]*SC2;
  const poly2 = (pts,f,st,sw,ex) =>
    `<polygon points="${pts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ')}" fill="${f}"`
    + (st?` stroke="${st}" stroke-width="${sw||1}"`:'') + ' stroke-linejoin="round"' + (ex||'') + '/>';
  const it2 = scene({project:mk2(SC2,OX2,OY2), poly:poly2, shade:sh2, faceVisible:fv2});
  it2.sort((a,b)=>a.depth-b.depth);
  console.log(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W2} ${H2}" width="${W2}" height="${H2}">`
    + `<rect width="${W2}" height="${H2}" fill="#eef0ea"/>` + it2.map(i=>i.svg).join('') + '</svg>');
  process.exit(0);
}
const yaw = parseFloat(process.argv[3] || "-0.62"), pitch = parseFloat(process.argv[4] || "0.70");
const KX = 484/760;
const ROOMS = { 'american-court': {x:170,y:230,w:180,h:120},
                'asian-astor':    {x:120,y:60, w:150,h:110},
                'great-hall':     {x:560,y:230,w:150,h:110},
                'dendur':         {x:300,y:40, w:220,h:95},
                'egyptian':       {x:120,y:40, w:110,h:80},
                'greek-roman':    {x:60, y:150,w:150,h:90},
                'arms-armor':     {x:200,y:150,w:130,h:90},
                /* straight off met-map.js, so what this draws is what the
                   floor plan hands the page */
                'modern':         {x:60, y:415,w:200,h:105},
                'grand-stair-2':  {x:510,y:250,w:45, h:70} };
const rr = ROOMS[key] || {x:100,y:100,w:150,h:100};
const room = {x: rr.x*KX, y: rr.y, w: rr.w*KX, h: rr.h, f:1};
const W = 900, H = 620;
const CX = room.x+room.w/2, CY = room.y+room.h/2;
const mk = (SC,OX,OY) => (x,y,z) => {
  const dx=x-CX, dy=y-CY, c=Math.cos(yaw), s=Math.sin(yaw);
  const rx=dx*c-dy*s, ry=dx*s+dy*c;
  return [OX+rx*SC, OY+(ry*Math.sin(pitch)-(z||0)*Math.cos(pitch))*SC, ry];
};
const faceVisible = (nx,ny) => (nx*Math.sin(yaw)+ny*Math.cos(yaw)) > 0.001;
const L = [0.60,0.30,0.68];
const shade = (h,nx,ny,nz) => {
  const d = nx*L[0]+ny*L[1]+nz*L[2], f = 0.55+0.45*Math.max(0,d);
  const n = parseInt(h.slice(1),16);
  return `rgb(${Math.min(255,Math.round((n>>16&255)*f))},${Math.min(255,Math.round((n>>8&255)*f))},${Math.min(255,Math.round((n&255)*f))})`;
};
let BB = null;
const bb = pts => { pts.forEach(p=>{ if(!BB) BB=[p[0],p[1],p[0],p[1]];
  BB[0]=Math.min(BB[0],p[0]);BB[1]=Math.min(BB[1],p[1]);
  BB[2]=Math.max(BB[2],p[0]);BB[3]=Math.max(BB[3],p[1]); }); return ''; };
const base = {key, room, zBase:0, wall:26, C:{}, faceVisible, shade};
window.MET_ROOMS[key]({...base, project: mk(1,0,0), poly: bb});
const bw = BB[2]-BB[0], bh = BB[3]-BB[1];
const SC = Math.min((W-60)/bw, (H-60)/bh);
const OX = (W-bw*SC)/2 - BB[0]*SC, OY = (H-bh*SC)/2 - BB[1]*SC;
const poly = (pts,f,st,sw,ex) =>
  `<polygon points="${pts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ')}" fill="${f}"`
  + (st?` stroke="${st}" stroke-width="${sw||1}"`:'') + ' stroke-linejoin="round"' + (ex||'') + '/>';
const items = window.MET_ROOMS[key]({...base, project: mk(SC,OX,OY), poly});
items.sort((a,b)=>a.depth-b.depth);
console.log(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`
  + `<rect width="${W}" height="${H}" fill="#efece3"/>` + items.map(i=>i.svg).join('') + '</svg>');
