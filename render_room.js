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
const yaw = parseFloat(process.argv[3] || "-0.62"), pitch = parseFloat(process.argv[4] || "0.70");
const KX = 484/760;
const ROOMS = { 'american-court': {x:170,y:230,w:180,h:120},
                'asian-astor':    {x:120,y:60, w:150,h:110},
                'great-hall':     {x:560,y:230,w:150,h:110},
                'dendur':         {x:300,y:40, w:220,h:95},
                'egyptian':       {x:120,y:40, w:110,h:80},
                'greek-roman':    {x:60, y:150,w:150,h:90},
                'arms-armor':     {x:200,y:150,w:130,h:90} };
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
