/* make_thumbs.js — render each landmark once, as a small file the book can
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

const W = 320, H = 260, BACKDROP = -1e8;

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
      `<polygon points="${pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ')}" `
      + `fill="${f}"` + (st ? ` stroke="${st}" stroke-width="${sw || 1}"` : '')
      + ' stroke-linejoin="round"' + (ex || '') + '/>'
  }).filter(i => i.depth > BACKDROP);
  items.sort((a, b) => a.depth - b.depth);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" `
       + `width="${W}" height="${H}" role="img">`
       + items.map(i => i.svg).join("") + "</svg>";
}

const JOBS = [
  ["constitution",    () => window.TRAIL3D.scenes["constitution"],   -0.30, 0.24],
  ["faneuil-hall",    () => window.TRAIL3D.scenes["faneuil-hall"],   -0.62, 0.30],
  ["old-north",       () => window.TRAIL3D.scenes["old-north"],      -0.62, 0.30],
  ["state-house",     () => window.TRAIL3D.scenes["state-house"],    -0.62, 0.30],
  ["old-south",       () => window.TRAIL3D.scenes["old-south"],      -0.62, 0.30],
  ["bunker-hill",     () => window.TRAIL3D.scenes["bunker-hill"],    -0.62, 0.26],
  ["paul-revere",     () => window.TRAIL3D.scenes["paul-revere"],    -0.62, 0.30],
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
console.log(`${made} thumbnails, ${(total / 1024).toFixed(0)} KB total`);
