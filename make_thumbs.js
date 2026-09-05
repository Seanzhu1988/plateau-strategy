/* make_thumbs.js: render each landmark once, as a small file the book can
 * simply show.
 *
 *     node make_thumbs.js
 *
 * The alternative was to load the model code into the Destination Book and
 * draw in the browser. That would mean shipping four scripts to a page of
 * ninety-nine cards so that six of them could show a picture, and every
 * reader would pay for it whether or not they scrolled to Boston. A thumbnail
 * that never changes does not need a renderer at the other end; it needs to
 * have been rendered once.
 *
 * The ground plane is dropped. It exists so a model reads as standing on
 * something at full size, and at ninety pixels it is just a grey lozenge
 * taking up most of the frame. Everything at a depth below -1e8 is a
 * backdrop by this project's convention, so that is the test.
 */
global.window = {};
require("/Users/xiaojunzhu/Claude/worktrees/site/styles-3d.js");
require("/Users/xiaojunzhu/Claude/worktrees/site/met-rooms.js");
require("/Users/xiaojunzhu/Claude/worktrees/site/trail-3d.js");
require("/Users/xiaojunzhu/Claude/worktrees/site/nyc-3d.js");
const fs = require("fs");
const path = require("path");
/* THE REBUILT MODELS. Without these lines every thumbnail is drawn from the
   scene its rebuild replaced, which is what had happened: the book was
   showing the pre-standard box for seven Boston buildings that had already
   been rebuilt, and the trail's own resolver was never asked. A form file
   registers window.TRAIL_FORMS[k] or window.NYC_FORMS[k] and takes over at
   draw time, so they must be loaded here exactly as the page loads them. */
fs.readdirSync(__dirname)
  .filter(f => /^(trail|nyc)-form-[a-z-]+\.js$/.test(f))
  .forEach(f => { try { require(path.join(__dirname, f)); }
                  catch (e) { console.error("form " + f + ": " + e.message); } });

const W = 320, H = 260;
/* WHAT LOOKING CAUGHT, the moment the rebuilt forms were loaded: the Old
   South thumbnail came back as a bare roof and a floating spire tip, and the
   Revere House lost its walls. The cause was this threshold. It was -1e8, on
   the convention that anything below it is a backdrop, but the rebuilt forms
   legitimately give their WATER TABLE and BASE COURSE explicit depths near
   -8.5e8 so those slabs paint under the walls that stand on them. Those are
   the building, not the backdrop. The two real backdrops are the ground plane
   at -1e9 from the ground() helper and the cast shadow just above it, so the
   line belongs between the shadow and the base course. Anything that moves
   those conventions has to move this number with them. */
const BACKDROP = -8.8e8;
/* At 320 by 260, displayed at 104, a polygon covering less than a pixel is
   file size and nothing else. The Brooklyn Bridge arrived at 2,143 polygons
   and 290 KB for a picture the size of a postage stamp. */
const MIN_AREA = 1.6;
function areaOf(pts) {
  let a = 0;
  for (let i = 0, n = pts.length; i < n; i++) {
    const p = pts[i], q = pts[(i + 1) % n];
    a += p[0] * q[1] - q[0] * p[1];
  }
  return Math.abs(a) / 2;
}

function build(scene, yaw, pitch) {
  const mk = (SC, OX, OY) => (x, y, z) => {
    const c = Math.cos(yaw), s = Math.sin(yaw);
    const rx = x * c - y * s, ry = x * s + y * c;
    return [OX + rx * SC, OY + (ry * Math.sin(pitch) - (z || 0) * Math.cos(pitch)) * SC, ry];
  };
  const fv = (nx, ny) => (nx * Math.sin(yaw) + ny * Math.cos(yaw)) > 0.001;
  const L = [0.60, 0.30, 0.68];
  const sh = (h, nx, ny, nz) => {
    const d = nx * L[0] + ny * L[1] + nz * L[2], f = 0.55 + 0.45 * Math.max(0, d);
    const n = parseInt(h.slice(1), 16);
    return `rgb(${Math.min(255, Math.round((n >> 16 & 255) * f))},`
         + `${Math.min(255, Math.round((n >> 8 & 255) * f))},`
         + `${Math.min(255, Math.round((n & 255) * f))})`;
  };
  /* Two passes. The first measures, but only the parts that are not backdrop,
     so the crop is tight on the building rather than on its lawn. */
  let B = null;
  const probe = scene({ project: mk(1, 0, 0), shade: sh, faceVisible: fv,
                        poly: () => "" });
  const keep = probe.filter(i => i.depth > BACKDROP);
  const seen = new Set(keep.map(i => i.svg));
  let idx = 0;
  scene({ project: mk(1, 0, 0), shade: sh, faceVisible: fv,
          poly: (pts) => {
            if (probe[idx] && probe[idx].depth > BACKDROP) {
              pts.forEach(p => {
                if (!B) B = [p[0], p[1], p[0], p[1]];
                B[0] = Math.min(B[0], p[0]); B[1] = Math.min(B[1], p[1]);
                B[2] = Math.max(B[2], p[0]); B[3] = Math.max(B[3], p[1]);
              });
            }
            idx++;
            return "";
          } });
  if (!B) return null;
  const bw = Math.max(B[2] - B[0], 1e-6), bh = Math.max(B[3] - B[1], 1e-6);
  const SC = Math.min((W - 16) / bw, (H - 16) / bh);
  const OX = (W - bw * SC) / 2 - B[0] * SC, OY = (H - bh * SC) / 2 - B[1] * SC;
  const items = scene({
    project: mk(SC, OX, OY), shade: sh, faceVisible: fv,
    poly: (pts, f, st, sw, ex) =>
      (areaOf(pts) < MIN_AREA && !st) ? ''
      : `<polygon points="${pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ')}" `
      + `fill="${f}"` + (st ? ` stroke="${st}" stroke-width="${sw || 1}"` : '')
      + ' stroke-linejoin="round"' + (ex || '') + '/>'
  }).filter(i => i.depth > BACKDROP && i.svg);
  items.sort((a, b) => a.depth - b.depth);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" `
       + `width="${W}" height="${H}" role="img">`
       + items.map(i => i.svg).join("") + "</svg>";
}

/* The New York models are drawn by nyc-3d.js's own renderer, not by the
   ctx.poly contract the trail and the Met share, so they need their own small
   builder. Faces carry their points and a colour and are sorted by centroid
   depth; flat faces are the water, the ground and the shadows, which are the
   backdrop this file drops at thumbnail size for the same reason it drops the
   trail's lawn. Labels are not drawn at all: a 104 pixel picture has no room
   for a leader and a caption. */
function buildNYC(scene, cam0) {
  const N = window.NYC3D, P = N.helpers.project;
  const solid = scene.faces.filter(f => !f.flat);
  if (!solid.length) return null;
  const cam = Object.assign({}, cam0, { zoom: 1, ox: 0, oy: 0 });
  let B = null;
  solid.forEach(f => f.pts.forEach(p => {
    const q = P(p, cam);
    if (!B) B = [q.x, q.y, q.x, q.y];
    B[0] = Math.min(B[0], q.x); B[1] = Math.min(B[1], q.y);
    B[2] = Math.max(B[2], q.x); B[3] = Math.max(B[3], q.y);
  }));
  const bw = Math.max(B[2] - B[0], 1e-6), bh = Math.max(B[3] - B[1], 1e-6);
  const SC = Math.min((W - 16) / bw, (H - 16) / bh);
  /* project() gives y = oy - (vertical term) * zoom, so at zoom 1 with oy 0
     the measured value v IS that whole negated term and the final y is simply
     oy + v * zoom. The offset therefore comes off the bbox MINIMUM, exactly
     as the x offset does. Taking it off the maximum instead, which is what
     this line did at first, pushed the entire bridge above the frame and left
     a picture of one grey block: the arithmetic was self consistent and the
     picture was empty, which is the whole reason this file is looked at. */
  const cam2 = Object.assign({}, cam0, {
    zoom: SC, ox: (W - bw * SC) / 2 - B[0] * SC, oy: (H - bh * SC) / 2 - B[1] * SC
  });
  const drawn = solid.map(f => {
    let d = 0;
    f.pts.forEach(p => { d += P(p, cam2).d; });
    return { f: f, d: d / f.pts.length + (f.bias || 0) };
  }).sort((a, b) => a.d - b.d);
  const parts = drawn.map(({ f }) => {
    const xy = f.pts.map(p => { const q = P(p, cam2); return [q.x, q.y]; });
    /* The cables, suspenders and stays are drawn as degenerate two and three
       point faces carrying a stroke, so an area test alone lets every one of
       them through: the tower view arrived at 310 KB because 1,900 sub-pixel
       wires survived. A stroked face is judged on its LENGTH instead. */
    if (f.stroke) {
      let lo = [1e9, 1e9], hi = [-1e9, -1e9];
      xy.forEach(q => { lo[0] = Math.min(lo[0], q[0]); lo[1] = Math.min(lo[1], q[1]);
                        hi[0] = Math.max(hi[0], q[0]); hi[1] = Math.max(hi[1], q[1]); });
      if (Math.hypot(hi[0] - lo[0], hi[1] - lo[1]) < 5) return "";
    } else if (areaOf(xy) < MIN_AREA) return "";
    const pts = xy.map(q => q[0].toFixed(1) + "," + q[1].toFixed(1));
    const fill = N.helpers.shade(f.colour, N.helpers.normal(f.pts[0], f.pts[1], f.pts[2]));
    return `<polygon points="${pts.join(" ")}" fill="${fill}"`
         + (f.stroke ? ` stroke="${f.stroke}" stroke-width="${f.width || 0.6}"` : "")
         + (f.opacity ? ` opacity="${f.opacity}"` : "") + ' stroke-linejoin="round"/>';
  }).filter(Boolean);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" `
       + `width="${W}" height="${H}" role="img">` + parts.join("") + "</svg>";
}

const JOBS = [
  ["constitution",    () => window.TRAIL3D.scene("constitution"),   -0.30, 0.24],
  ["faneuil-hall",    () => window.TRAIL3D.scene("faneuil-hall"),   -0.62, 0.30],
  ["old-north",       () => window.TRAIL3D.scene("old-north"),      -0.62, 0.30],
  ["state-house",     () => window.TRAIL3D.scene("state-house"),    -0.62, 0.30],
  ["old-south",       () => window.TRAIL3D.scene("old-south"),      -0.62, 0.30],
  ["bunker-hill",     () => window.TRAIL3D.scene("bunker-hill"),    -0.62, 0.26],
  ["paul-revere",     () => window.TRAIL3D.scene("paul-revere"),    -0.62, 0.30],
  ["old-state-house", () => window.TRAIL3D.scene("old-state-house"), -0.62, 0.30],
];

/* The two New York landmarks, through their own renderer. */
const NYC_JOBS = [
  /* THE TOWER, not the span. The whole crossing is 3,830 ft long and 280 ft
     tall, so at a card's 104 pixels it is a horizontal thread with two specks
     on it. One tower with its two pointed arches is what a reader recognises
     at that size, and it is the same model either way. */
  ["brooklyn-bridge", () => window.NYC3D.scene("bridge")({ view: "tower", marks: false }),
   () => window.NYC3D.cams.tower()],
  ["empire-state",    () => window.NYC3D.scene("empire")({ openT: 0 }),
   () => window.NYC3D.cams.empire()],
];

const outDir = path.join(__dirname, "thumbs");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
let made = 0, total = 0;
JOBS.forEach(([name, get, yaw, pitch]) => {
  let scene;
  try { scene = get(); } catch (e) { scene = null; }
  if (!scene) { console.log(`  skip ${name}: no scene`); return; }
  const svg = build(scene, yaw, pitch);
  if (!svg) { console.log(`  skip ${name}: nothing drawn`); return; }
  const f = path.join(outDir, name + ".svg");
  fs.writeFileSync(f, svg);
  made++; total += svg.length;
  console.log(`  ${name.padEnd(16)} ${(svg.length / 1024).toFixed(1)} KB`);
});
NYC_JOBS.forEach(([name, getScene, getCam]) => {
  let svg = null;
  try { svg = buildNYC(getScene(), getCam()); }
  catch (e) { console.log(`  skip ${name}: ${e.message}`); return; }
  if (!svg) { console.log(`  skip ${name}: nothing drawn`); return; }
  fs.writeFileSync(path.join(outDir, name + ".svg"), svg);
  made++; total += svg.length;
  console.log(`  ${name.padEnd(16)} ${(svg.length / 1024).toFixed(1)} KB`);
});
console.log(`${made} thumbnails, ${(total / 1024).toFixed(0)} KB total`);
