/* look_trail.js: render every Freedom Trail model exactly the way the trail
 * page draws it (the projector, the fit and the light are copied from
 * trail-3d.js mount), from two sides, into pages that can be LOOKED at.
 *
 *     node look_trail.js
 *
 * The model standard's third step is render and look. The trail had no
 * harness for it, so its models were judged from the page one at a time.
 */
global.window = {};
global.requestAnimationFrame = function () { return 0; };
const BASE = "/Users/xiaojunzhu/Claude/worktrees/site/";
const OUT = process.argv[2] || BASE;
const fs = require("fs");
require(BASE + "trail-3d.js");
fs.readdirSync(BASE).filter(f => /^trail-form-.*\.js$/.test(f)).sort()
  .forEach(f => require(BASE + f));
const T = window.TRAIL3D;
const keys = Array.from(new Set(Object.keys(T.scenes)
  .concat(Object.keys(window.TRAIL_FORMS || {}))));
const LIGHT = [0.60, 0.30, 0.68];

function render(key, yaw, pitch) {
  const W = 820, H = 560;
  const mk = (SC, OX, OY) => (x, y, z) => {
    const c = Math.cos(yaw), s = Math.sin(yaw);
    const rx = x * c - y * s, ry = x * s + y * c;
    return [OX + rx * SC, OY + (ry * Math.sin(pitch) - (z || 0) * Math.cos(pitch)) * SC, ry];
  };
  const faceVisible = (nx, ny) => (nx * Math.sin(yaw) + ny * Math.cos(yaw)) > 0.001;
  const shade = (hex, nx, ny, nz) => {
    const d = nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2];
    const f = 0.55 + 0.45 * Math.max(0, d);
    const n = parseInt(hex.slice(1), 16);
    return "rgb(" + Math.min(255, Math.round(((n >> 16) & 255) * f)) + "," +
      Math.min(255, Math.round(((n >> 8) & 255) * f)) + "," +
      Math.min(255, Math.round((n & 255) * f)) + ")";
  };
  let BB = null;
  const measure = pts => { pts.forEach(p => {
    if (!BB) BB = [p[0], p[1], p[0], p[1]];
    BB[0] = Math.min(BB[0], p[0]); BB[1] = Math.min(BB[1], p[1]);
    BB[2] = Math.max(BB[2], p[0]); BB[3] = Math.max(BB[3], p[1]); }); return ""; };
  T.scene(key)({ project: mk(1, 0, 0), poly: measure, shade, faceVisible });
  const bw = BB[2] - BB[0], bh = BB[3] - BB[1];
  const SC = Math.min((W - 50) / bw, (H - 50) / bh);
  const OX = (W - bw * SC) / 2 - BB[0] * SC, OY = (H - bh * SC) / 2 - BB[1] * SC;
  const poly = (pts, f, st, sw, ex) => '<polygon points="' +
    pts.map(p => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ") + '" fill="' + f + '"' +
    (st ? ' stroke="' + st + '" stroke-width="' + (sw || 1) + '"' : "") +
    ' stroke-linejoin="round"' + (ex || "") + "/>";
  const items = T.scene(key)({ project: mk(SC, OX, OY), poly, shade, faceVisible });
  items.sort((a, b) => a.depth - b.depth);
  return { svg: `<svg viewBox="0 0 ${W} ${H}" width="410" style="display:block;background:#eef0ea;border-radius:8px">`
                + items.map(i => i.svg).join("") + "</svg>", n: items.length };
}

const VIEWS = [[-0.62, 0.30], [2.5, 0.30]];
const half = Math.ceil(keys.length / 2);
[keys.slice(0, half), keys.slice(half)].forEach((group, gi) => {
  const rows = group.map(k => {
    const cells = VIEWS.map(([y, p]) => {
      try { const r = render(k, y, p);
        return `<figure>${r.svg}<figcaption><b>${k}</b> · yaw ${y} · ${r.n} items</figcaption></figure>`;
      } catch (e) { return `<figure><b>${k}</b>: ${e.message}</figure>`; }
    });
    return `<div class="r">${cells.join("")}</div>`;
  });
  fs.writeFileSync(OUT + `look_trail_${gi + 1}.html`,
    `<!doctype html><meta charset="utf-8"><style>body{font:12px system-ui;margin:10px;background:#fff}`
    + `.r{display:flex;gap:10px;margin-bottom:6px}figure{margin:0}</style>` + rows.join(""));
});
console.log("keys (" + keys.length + "):", keys.join(", "));
