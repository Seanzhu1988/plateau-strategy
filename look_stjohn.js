/* look_stjohn.js: render the cathedral from several angles and write one page
 * I can actually look at.
 *
 *     node look_stjohn.js
 *
 * The model standard's third step is "render and LOOK", and it exists because
 * every geometry bug this project has shipped was invisible in the code and
 * obvious in the picture: the Brooklyn Bridge's triangular arches survived two
 * weeks of reading the source. A model is not checked by re-reading the
 * numbers that built it.
 *
 * Six angles, not one. A cathedral is long, and a single three-quarter view
 * hides exactly the thing this building is about: the east end is Romanesque
 * and the west end is Gothic, so the model has to be looked at from both ends
 * or the split it exists to show is off-camera. The plan view is there because
 * a chevet is a plan shape before it is anything else.
 *
 * Output: look_stjohn.html beside this file, six panels with their angles
 * written under them. The HTML is a build artefact and is not committed; this
 * script is, because the next model will want it. It earned its keep twice on
 * this one: run against the Empire State BEFORE the cathedral existed it
 * proved the harness itself worked, so the first blank cathedral could not be
 * blamed on the instrument; and its first real run showed a rose window that
 * was a fan in its top half and a blank disc in its bottom, which no amount of
 * re-reading the source would have found.
 */
global.window = {};
const BASE = "/Users/xiaojunzhu/Claude/worktrees/site/";
require(BASE + "styles-3d.js");
require(BASE + "nyc-3d.js");
require(BASE + "nyc-form-stjohn.js");
const fs = require("fs");

const W = 620, H = 560, MIN_AREA = 0.05;

function areaOf(p) {
  let a = 0;
  for (let i = 0; i < p.length; i++) {
    const q = p[(i + 1) % p.length];
    a += p[i][0] * q[1] - q[0] * p[i][1];
  }
  return Math.abs(a) / 2;
}

/* Lifted from make_thumbs.js buildNYC, with two deliberate differences: the
   flat faces (ground, shadow) are KEPT, because at full size they are what
   makes the thing stand on something rather than float, and the labels are
   kept out because a leader line crossing the drawing is not the drawing. */
function build(scene, cam0) {
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
  const SC = Math.min((W - 24) / bw, (H - 24) / bh);
  const cam2 = Object.assign({}, cam0, {
    zoom: SC, ox: (W - bw * SC) / 2 - B[0] * SC, oy: (H - bh * SC) / 2 - B[1] * SC
  });
  const drawn = scene.faces.map(f => {
    let d = 0;
    f.pts.forEach(p => { d += P(p, cam2).d; });
    return { f: f, d: d / f.pts.length + (f.bias || 0) };
  }).sort((a, b) => a.d - b.d);
  const parts = drawn.map(({ f }) => {
    const xy = f.pts.map(p => { const q = P(p, cam2); return [q.x, q.y]; });
    if (f.stroke) {
      let lo = [1e9, 1e9], hi = [-1e9, -1e9];
      xy.forEach(q => { lo[0] = Math.min(lo[0], q[0]); lo[1] = Math.min(lo[1], q[1]);
                        hi[0] = Math.max(hi[0], q[0]); hi[1] = Math.max(hi[1], q[1]); });
      if (Math.hypot(hi[0] - lo[0], hi[1] - lo[1]) < 2) return "";
    } else if (areaOf(xy) < MIN_AREA) return "";
    const pts = xy.map(q => q[0].toFixed(1) + "," + q[1].toFixed(1));
    const fill = f.flat ? f.colour
      : N.helpers.shade(f.colour, N.helpers.normal(f.pts[0], f.pts[1], f.pts[2]));
    return `<polygon points="${pts.join(" ")}" fill="${fill}"`
         + (f.stroke ? ` stroke="${f.stroke}" stroke-width="${f.width || 0.6}"` : "")
         + (f.opacity ? ` opacity="${f.opacity}"` : "") + ' stroke-linejoin="round"/>';
  }).filter(Boolean);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" `
       + `width="${W}" height="${H}">`
       + `<rect width="${W}" height="${H}" fill="#ffffff"/>`
       + parts.join("") + "</svg>";
}

/* yaw, pitch, and what the angle is FOR. Each one is chosen to put a specific
   claim of the model on camera, so a panel that looks wrong names the part.
 *
 * THE ANGLES WERE WRONG THE FIRST TIME and the labels lied about what was on
 * screen, which is worse than a bad angle: a panel captioned "west front"
 * showing the south flank hides the very thing it claims to prove. So the
 * convention is derived rather than guessed. nyc-3d.js projects with
 *
 *     y1 = x*sin(yaw) + y*cos(yaw),   and larger y1 is NEARER the eye.
 *
 * The west front is the most negative x and the south flank the most negative
 * y, so bringing the west front forward needs sin(yaw) < 0, and bringing the
 * south flank forward needs cos(yaw) < 0. That fixes every view below:
 *   west only        sin<0, cos=0    yaw = -pi/2
 *   south only       sin=0, cos<0    yaw = pi
 *   west AND south   both negative   yaw between -pi and -pi/2
 *   east only        sin>0           yaw = +pi/2
 *   east AND south   sin>0, cos<0    yaw between pi/2 and pi
 */
const VIEWS = [
  ["West front, straight on",  -1.57, 0.16, "the Gothic end: rose, portals, the two unfinished towers"],
  ["West front, three-quarter", -2.36, 0.22, "the towers against the nave flank"],
  ["From the south",            Math.PI, 0.20, "the whole 601 ft length, both styles in one picture"],
  ["From the south-east",       2.36,  0.24, "the Romanesque end: apse, chevet chapels, the dome"],
  ["East end, straight on",     1.57,  0.18, "the chevet as a half-round of chapels"],
  ["From above",                2.60,  0.95, "the plan: cross, chevet, crossing square"]
];

const panels = VIEWS.map(([name, yaw, pitch, why]) => {
  const cam = window.NYC3D.helpers.makeCam(yaw, pitch, 1, W / 2, H / 2);
  const svg = build(window.NYC_FORMS.stjohn({}), cam);
  return `<figure><div class="p">${svg || "<b>EMPTY SCENE</b>"}</div>`
       + `<figcaption><b>${name}</b><br><span>yaw ${yaw.toFixed(2)} · pitch ${pitch.toFixed(2)}</span>`
       + `<br><i>${why}</i></figcaption></figure>`;
});

fs.writeFileSync(BASE + "look_stjohn.html",
  `<!doctype html><meta charset="utf-8"><title>St John the Divine, six angles</title>`
  + `<style>body{font:14px system-ui;background:#f4f4f2;margin:20px}`
  + `.g{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;max-width:1320px}`
  + `figure{margin:0;background:#fff;border:1px solid #ddd;border-radius:8px;padding:10px}`
  + `.p{background:#fff}figcaption{margin-top:8px;line-height:1.45}`
  + `figcaption span{color:#666}figcaption i{color:#036;font-style:normal}</style>`
  + `<h1>Cathedral of St John the Divine</h1>`
  + `<div class="g">${panels.join("")}</div>`);

console.log("wrote look_stjohn.html");
