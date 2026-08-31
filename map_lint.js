/* map_lint.js — check the museum map before it breaks.
 *
 *     node map_lint.js
 *
 * [SEAN 2026-08-31: "we need to redesign the map in even smarter way as it
 * grow, or we need routine to be created to refine the map every couple
 * hour".]
 *
 * He is right that the map is outgrowing its layout, and measurement agrees:
 * fifteen rooms already fill 83 percent of their own bounding box and TWO
 * pairs already overlap. Nobody noticed, because an overlap of ten pixels
 * throws no error and renders as a slightly odd corner.
 *
 * But neither of his two options is the right fix, and it is worth saying why.
 *
 * NOT AUTO-LAYOUT. This map's entire value is that the rooms sit where they
 * really sit. A visitor standing in the Met can trust it because Dendur is
 * north-east of the Great Hall on the sheet exactly as it is in the building.
 * A packing algorithm optimises for space, not for truth, and would trade the
 * one property that makes the map worth having for a tidier picture.
 *
 * NOT A ROUTINE EVERY COUPLE OF HOURS. A layout has no measurable objective
 * that repeated automated passes improve; an agent set loose on it would make
 * arbitrary changes forever. And two routines already exist that have barely
 * run, so a third would compound that rather than fix anything.
 *
 * What the map needs is what it lacked: something that NOTICES. These checks
 * are deterministic, take milliseconds, and fail loudly. The daily polish task
 * runs them; no new routine, no guessing.
 *
 * Exit 1 on any error, so it can gate a build.
 */
const fs = require("fs");
const path = require("path");
const BASE = __dirname;

const SCHEMATIC_W = 760;
/* Stairs are meant to be narrow; they are a connector, not a gallery. */
const NARROW_OK = new Set(["grand-stair", "grand-stair-2"]);

function readRooms() {
  const s = fs.readFileSync(path.join(BASE, "met-map.js"), "utf8");
  const m = s.match(/ROOMS\s*=\s*\{([\s\S]*?)\n  \};/);
  const rooms = {};
  const re = /'([a-z0-9-]+)':\s*\{\s*f:\s*(\d)\s*,\s*x:\s*(-?\d+)\s*,\s*y:\s*(-?\d+)\s*,\s*w:\s*(\d+)\s*,\s*h:\s*(\d+)/g;
  let mm;
  while ((mm = re.exec(m ? m[1] : ""))) {
    rooms[mm[1]] = { f: +mm[2], x: +mm[3], y: +mm[4], w: +mm[5], h: +mm[6] };
  }
  return rooms;
}

function readEdges() {
  const s = fs.readFileSync(path.join(BASE, "met-map.js"), "utf8");
  const m = s.match(/EDGES\s*=\s*\[([\s\S]*?)\n  \];/);
  const out = [];
  const re = /\[\s*'([a-z0-9-]+)'\s*,\s*'([a-z0-9-]+)'/g;
  let mm;
  while ((mm = re.exec(m ? m[1] : ""))) out.push([mm[1], mm[2]]);
  return out;
}

const errors = [], warnings = [];
const rooms = readRooms();
const edges = readEdges();
const keys = Object.keys(rooms);

/* 1. Overlaps. Two rooms on one floor sharing coordinates render as one
      clipping through the other, and nothing complains. */
for (let i = 0; i < keys.length; i++) {
  for (let j = i + 1; j < keys.length; j++) {
    const a = rooms[keys[i]], b = rooms[keys[j]];
    if (a.f !== b.f) continue;
    const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
    const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
    if (ox > 0 && oy > 0) {
      errors.push(`overlap: ${keys[i]} and ${keys[j]} share ${ox}x${oy} on floor ${a.f}`);
    }
  }
}

/* 2. Off the sheet. */
keys.forEach(k => {
  const r = rooms[k];
  if (r.x < 0 || r.x + r.w > SCHEMATIC_W) {
    errors.push(`off sheet: ${k} spans x ${r.x}..${r.x + r.w}, sheet is 0..${SCHEMATIC_W}`);
  }
});

/* 3. Too small to carry its own name. */
keys.forEach(k => {
  const r = rooms[k];
  if (NARROW_OK.has(k)) return;
  if (r.w < 70 || r.h < 55) warnings.push(`cramped: ${k} is ${r.w}x${r.h}, a label will not fit`);
});

/* 4. Every edge names a real room. */
edges.forEach(e => e.forEach(k => {
  if (!rooms[k]) errors.push(`edge names a room that does not exist: ${k}`);
}));

/* 5. Nothing stranded: every room reachable on foot from the entrance. */
const adj = {};
keys.forEach(k => adj[k] = []);
edges.forEach(([a, b]) => { if (adj[a] && adj[b]) { adj[a].push(b); adj[b].push(a); } });
const seen = new Set(["great-hall"]);
const queue = ["great-hall"];
while (queue.length) {
  const k = queue.shift();
  (adj[k] || []).forEach(n => { if (!seen.has(n)) { seen.add(n); queue.push(n); } });
}
keys.filter(k => !seen.has(k)).forEach(k =>
  errors.push(`stranded: ${k} cannot be walked to from the Great Hall`));

/* 6. Interiors and artworks must point at rooms that exist. */
global.window = {};
try {
  require(path.join(BASE, "styles-3d.js"));
  require(path.join(BASE, "met-rooms.js"));
  Object.keys(window.MET_ROOMS || {}).forEach(k => {
    if (!rooms[k]) errors.push(`interior drawn for a room not on the map: ${k}`);
  });
} catch (e) { warnings.push("could not load met-rooms.js: " + e.message); }
try {
  require(path.join(BASE, "met-art.js"));
  Object.keys(window.MET_ART || {}).forEach(k => {
    if (!rooms[k]) warnings.push(`artwork listed for a room not on the map: ${k}`);
  });
} catch (e) { warnings.push("could not load met-art.js: " + e.message); }

/* 7. How full is the sheet. Reported, not failed: crowding is a judgement. */
const xs = keys.map(k => rooms[k].x), xe = keys.map(k => rooms[k].x + rooms[k].w);
const ys = keys.map(k => rooms[k].y), ye = keys.map(k => rooms[k].y + rooms[k].h);
const used = keys.reduce((s, k) => s + rooms[k].w * rooms[k].h, 0);
const box = (Math.max(...xe) - Math.min(...xs)) * (Math.max(...ye) - Math.min(...ys));
const density = 100 * used / box;

console.log(`${keys.length} rooms, ${edges.length} corridors, sheet ${density.toFixed(0)}% full`);
const withInterior = Object.keys(window.MET_ROOMS || {}).length;
console.log(`${withInterior} rooms have an interior drawn`);
warnings.forEach(w => console.log("  warn  " + w));
errors.forEach(e => console.log("  ERROR " + e));
if (density > 88) {
  console.log("\n  The sheet is nearly full. Adding rooms now means moving old ones,");
  console.log("  and old ones sit where they sit because that is where they REALLY are.");
  console.log("  Widen the schematic before packing tighter.");
}
if (!errors.length) console.log("\nMap is sound.");
process.exit(errors.length ? 1 : 0);
