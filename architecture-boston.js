/* Boston architecture, physical mesh edition.
 * Source geometry remains in the nine trail-form files. This module repairs
 * renderer-specific shortcuts rather than inventing a second set of plans.
 * Source coordinates: feet, z up. Three coordinates: feet, y up, z = -source y.
 * MODEL_STANDARD.md applies. Sources and outstanding survey gaps are recorded
 * in audits/boston-webgl-sources.md. This is an architectural reconstruction,
 * not a photogrammetric scan or a claim that every ornamental detail is exact.
 */

export const BOSTON_LANDMARKS = {
  'state-house': { title: 'Massachusetts State House', front: 1,
    notes: 'The gilded dome, seven-arch arcade and twelve-column portico. This is the historic Bulfinch frontage, not the later rear extensions.',
    sources: [{ title: 'Massachusetts State House', url: 'https://www.nps.gov/places/massachusetts-state-house.htm' }] },
  'park-street': { title: 'Park Street Church', front: -1,
    notes: 'A 217-foot, 9-inch steeple with a four-column front, brick clock stage and open classical lanterns. The pitched nave roof is photo-scaled, not surveyed.',
    sources: [{ title: 'Park Street Church', url: 'https://www.nps.gov/places/park-street-church.htm' }] },
  'old-south': { title: 'Old South Meeting House', front: 1,
    notes: 'The seven-bay meeting house, louvered bell stage and long green copper taper. Its upper silhouette is reconstructed from the NPS photograph; intermediate heights are scaled.',
    sources: [{ title: 'Old South Meeting House', url: 'https://www.nps.gov/places/old-south-meeting-house.htm' },
      { title: 'NPS steeple photograph', url: 'https://www.nps.gov/npgallery/GetAsset/f4fc3e02-2d62-4d0d-a034-1751bf9a1da2/proxy/hires' }] },
  'old-state-house': { title: 'Old State House', front: 1,
    notes: 'The narrow brick landmark with its balcony, clock and lion-and-unicorn gable. Small carved ornaments remain simplified.',
    sources: [{ title: 'Old State House', url: 'https://www.nps.gov/places/old-state-house.htm' }] },
  'faneuil-hall': { title: 'Faneuil Hall', front: 1,
    notes: 'The seven-by-nine-bay market hall, slate roof and domed cupola with its gilded grasshopper. Unpublished storey heights are derived.',
    sources: [{ title: 'NPS Faneuil Hall virtual tour', url: 'https://home.nps.gov/bost/learn/faneuil-hall-virtual-tour.htm' }] },
  'paul-revere': { title: 'Paul Revere House', front: 1,
    notes: 'Rebuilt from the HABS plan: 30 feet 6 inches across, paired leaded casements, a right-hand door and the skewed rear wing. Elevation heights are scaled, not surveyed.',
    sources: [{ title: 'HABS measured floor plan', url: 'https://www.loc.gov/pictures/item/ma0478.sheet.00002a/' },
      { title: 'HABS front elevation', url: 'https://www.loc.gov/pictures/item/ma0478.sheet.00001a/' }] },
  'old-north': { title: 'Old North Church', front: -1,
    notes: 'Brick nave, deep sash windows and the white 191-foot steeple. The surviving model does not claim the exact placement of all 42 windows.',
    sources: [{ title: 'Old North Church', url: 'https://www.nps.gov/places/old-north-church.htm' }] },
  constitution: { title: 'USS Constitution', front: 1,
    notes: 'The three-masted frigate with bare yards, standing rigging and modern white-trimmed stern. The mainmast is 172 feet above the spar deck; smaller rig and stern carvings are schematic.',
    sources: [{ title: 'USS Constitution Museum facts', url: 'https://ussconstitutionmuseum.org/uss-constitution-facts/' },
      { title: 'Main mast and fighting top', url: 'https://ussconstitutionmuseum.org/2023/05/01/uss-constitutions-main-mast-rig-repairs/' },
      { title: 'Modern stern and upper windows', url: 'https://ussconstitutionmuseum.org/2016/03/03/stern-repairs/' }] },
  'bunker-hill': { title: 'Bunker Hill Monument', front: 1,
    notes: 'The 221-foot, 5-inch Quincy granite obelisk, with its 78 shaft courses and four observation windows. Small lodge and statue details remain simplified.',
    sources: [{ title: 'NPS measured monument dimensions', url: 'https://www.nps.gov/articles/000/bhm-by-the-numbers.htm' }] }
};

const EPS = 1e-6;
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const sub = (a, b) => a.map((v, i) => v - b[i]);
const add = (a, b, scale = 1) => a.map((v, i) => v + b[i] * scale);
const unit = a => { const n = Math.hypot(...a); return n > EPS ? a.map(v => v / n) : [0, 0, 1]; };
const threePoint = p => [p[0], p[2], -p[1]];
const rgb = hex => /^#[0-9a-f]{6}$/i.test(hex || '') ? [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)) : [128, 128, 128];

function surfaceKind(fill) {
  const [r, g, b] = rgb(fill);
  if (b > r + 2 && r < 82 && g < 100) return 'glass';
  if (r > g * 1.3 && g > b * 1.08 && r > 95 && r < 185) return 'brick';
  if (r > 178 && g > 125 && b < 75) return 'gold';
  if (r > 190 && g > 180 && b > 155) return 'trim';
  if (r < 85 && g < 70 && b < 60 && r > b * 1.2) return 'door';
  return 'solid';
}

function polygonNormal(points) {
  const n = [0, 0, 0];
  for (let i = 0; i < points.length; i++) {
    const a = points[i], b = points[(i + 1) % points.length];
    n[0] += (a[1] - b[1]) * (a[2] + b[2]);
    n[1] += (a[2] - b[2]) * (a[0] + b[0]);
    n[2] += (a[0] - b[0]) * (a[1] + b[1]);
  }
  return Math.hypot(...n) > EPS ? unit(n) : null;
}

function cleanPoints(points) {
  const result = [];
  for (const p of points) {
    if (!p || p.length < 3 || !p.every(Number.isFinite)) throw new Error('Invalid Boston model coordinate');
    if (!result.length || Math.hypot(...sub(p, result[result.length - 1])) > EPS) result.push(p.slice());
  }
  if (result.length > 1 && Math.hypot(...sub(result[0], result[result.length - 1])) < EPS) result.pop();
  return result;
}

/* Call this before loading trail-form scripts, because those scripts retain
 * helper references at registration time. Other legacy renderers are untouched:
 * every replacement delegates to the original unless the capture flag is set.
 */
export function installBostonGeometryHelpers(trail) {
  if (!trail?.helpers || trail.helpers.__physicalBoston) return;
  const H = trail.helpers;
  const old = Object.fromEntries(Object.keys(H).map(k => [k, H[k]]));
  H.__physicalBoston = true;
  const item = (ctx, q, fill, edge, depth) => ({ svg: ctx.poly(q, fill, edge, 0.4), depth });

  function ring(ctx, cx, cy, r0, r1, z0, z1, fill, edge, depth, segments = 32, tag = null) {
    const out = [];
    for (let i = 0; i < segments; i++) {
      const a = i * Math.PI * 2 / segments, b = (i + 1) * Math.PI * 2 / segments;
      const q = [[cx + r0 * Math.cos(a), cy + r0 * Math.sin(a), z0],
        [cx + r0 * Math.cos(b), cy + r0 * Math.sin(b), z0],
        [cx + r1 * Math.cos(b), cy + r1 * Math.sin(b), z1],
        [cx + r1 * Math.cos(a), cy + r1 * Math.sin(a), z1]].map(p => ctx.project(...p));
      const part = item(ctx, q, fill, edge, depth);
      if (tag) ctx.tag(part.svg, tag);
      out.push(part);
    }
    return out;
  }
  H.box = function (ctx, x0, x1, y0, y1, z0, z1, fill, edge, roof, depth) {
    if (!ctx.__physicalBoston) return old.box(...arguments);
    if (x0 > x1) [x0, x1] = [x1, x0];
    if (y0 > y1) [y0, y1] = [y1, y0];
    const result = old.box(ctx, x0, x1, y0, y1, z0, z1, fill, edge, roof, depth);
    for (const part of result.parts) ctx.tag(part.svg, { structural: true });
    return result;
  };
  H.slab = function (ctx, cx, cy, w, d, z0, height, fill, edge, depth) {
    if (!ctx.__physicalBoston) return old.slab(...arguments);
    // The SVG helper discarded d and made every slab square. A cornice is
    // genuinely rectangular, with a top and bottom, not a painter's band.
    const out = H.box(ctx, cx - w / 2, cx + w / 2, cy - d / 2, cy + d / 2,
      z0, z0 + height, fill, edge, fill, depth).parts;
    out.push(item(ctx, [[cx - w / 2, cy - d / 2, z0], [cx - w / 2, cy + d / 2, z0],
      [cx + w / 2, cy + d / 2, z0], [cx + w / 2, cy - d / 2, z0]].map(p => ctx.project(...p)), fill, edge, depth));
    return out;
  };
  H.columnAt = function (ctx, cx, cy, r, z0, z1, fill, edge, depth) {
    if (!ctx.__physicalBoston) return old.columnAt(...arguments);
    const profile = [[r * 1.3, z0], [r * 1.3, z0 + r * .22], [r * 1.16, z0 + r * .35],
      [r, z0 + r * .6], [r * .97, z0 + (z1 - z0) * .35], [r * .86, z1 - r * 1.2],
      [r * 1.06, z1 - r], [r * 1.22, z1 - r * .65], [r * 1.3, z1 - r * .35], [r * 1.3, z1]];
    const out = [];
    for (let j = 0; j < profile.length - 1; j++) out.push(...ring(ctx, cx, cy, profile[j][0],
      profile[j + 1][0], profile[j][1], profile[j + 1][1], fill, edge, depth, 24, { column: [cx, cy] }));
    return out;
  };
  H.domeCap = function (ctx, cx, cy, radius, z0, height, fill, edge, depth) {
    if (!ctx.__physicalBoston) return old.domeCap(...arguments);
    const out = [], latitudeCount = 20;
    for (let j = 0; j < latitudeCount; j++) {
      const a = j / latitudeCount * Math.PI / 2, b = (j + 1) / latitudeCount * Math.PI / 2;
      out.push(...ring(ctx, cx, cy, Math.cos(a) * radius, Math.max(.001, Math.cos(b) * radius),
        z0 + Math.sin(a) * height, z0 + Math.sin(b) * height, fill, edge, depth, 64,
        { dome: [cx, cy, z0, radius, height] }));
    }
    return out;
  };
  H.octStage = function (ctx, cx, cy, r0, r1, z0, z1, fill, edge, depth) {
    if (!ctx.__physicalBoston) return old.octStage(...arguments);
    // The Massachusetts drum and lantern are circular. Church steeples
    // retain their documented octagonal faces.
    if (ctx.landmarkKey === 'state-house' && z0 >= 68) {
      if (z0 > 90 && z0 < 100 && surfaceKind(fill) === 'gold') return []; // obsolete painted dome stripe
      return ring(ctx, cx, cy, r0, r1, z0, z1, fill, edge, depth, 48);
    }
    return old.octStage(...arguments);
  };
  H.taperedShaft = function (ctx, cx, cy, w0, w1, z0, height, fill, edge, depth) {
    if (!ctx.__physicalBoston || ctx.landmarkKey !== 'constitution') return old.taperedShaft(...arguments);
    return ring(ctx, cx, cy, w0 / 2, w1 / 2, z0, z0 + height, fill, edge, depth, 24);
  };
}

function capture(key) {
  const form = key === 'paul-revere' ? paulRevereMeasured : globalThis.window?.TRAIL_FORMS?.[key];
  if (!form) throw new Error(`Boston geometry is not loaded: ${key}`);
  const records = [], byId = new Map();
  let shadeHint = null;
  const ctx = {
    __physicalBoston: true, landmarkKey: key,
    project: (x, y, z) => [x, y, z],
    shade(fill, nx, ny, nz) {
      shadeHint = Number.isFinite(nx) && Number.isFinite(ny) ? { fill, normal: [nx, ny, nz || 0] } : null;
      return fill;
    },
    faceVisible: () => true,
    poly(points, fill, edge, width, extra) {
      const id = `@physical:${records.length}@`;
      const rec = { id, points: cleanPoints(points), fill, edge, width, extra: extra || '', tags: {}, holes: [], offset: 0 };
      if (shadeHint && shadeHint.fill === fill) rec.tags.normalHint = shadeHint.normal;
      shadeHint = null;
      records.push(rec); byId.set(id, rec); return id;
    },
    tag(id, data) { Object.assign(byId.get(id)?.tags || {}, data); }
  };
  const pieces = form(ctx);
  if (key === 'old-north') pieces.push(...oldNorthUpper(ctx));
  if (key === 'park-street') pieces.push(...parkStreetStages(ctx));
  if (key === 'old-south') pieces.push(...oldSouthUpper(ctx));
  // Helpers also issue measuring polygons whose results never join the scene.
  // Only final returned identifiers are admitted. Capturing every ctx.poly
  // call would create giant invisible bounding walls and an extra dome.
  const selected = [];
  for (const part of pieces) {
    const matches = String(part.svg || '').match(/@physical:\d+@/g) || [];
    for (const id of matches) {
      const rec = byId.get(id);
      if (!rec || rec.selected) continue;
      rec.selected = true; rec.depth = part.depth; selected.push(rec);
    }
  }
  return selected;
}

function oldSouthUpper(ctx) {
  const H = globalThis.window.TRAIL3D.helpers, out = [], cy = 48.4;
  const white = '#dedbd0', copper = '#729184';
  function collect(parts) { for (const p of Array.isArray(parts) ? parts : [parts]) {
    ctx.tag(p.svg, { reconstructed: true }); out.push(p);
  } }
  function face(points, fill) { collect({ svg: ctx.poly(points.map(p => ctx.project(...p)), fill, null, 0), depth: 0 }); }
  collect(H.slab(ctx, 0, cy, 23, 23, 79, 1, white, null));
  collect(H.box(ctx, -8.6, 8.6, cy - 8.6, cy + 8.6, 80, 104, white, null, white).parts);
  for (const [nx, ny] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
    const map = nx ? (u, z) => ctx.project(nx * 8.6, cy + u, z) : (u, z) => ctx.project(u, cy + ny * 8.6, z);
    collect(H.archOpening(ctx, map, 0, 5.6, 81.5, 96.7, '#3e484d', null, 0));
    for (let z = 82; z < 101.7; z += .5) {
      const half = z < 96.7 ? 5.6 : Math.sqrt(Math.max(0, 5.6 ** 2 - (z - 96.7) ** 2));
      collect(H.panel(ctx, map, -half, half, z, z + .18, '#c6c6b9', null, 0));
    }
    const rail = nx ? (u, z) => ctx.project(nx * 11, cy + u, z) : (u, z) => ctx.project(u, cy + ny * 11, z);
    collect(H.balustrade(ctx, rail, -10.8, 10.8, 80, 84.5, white, null, 0));
    for (const u of [-7.3, 7.3]) collect(H.columnAt(ctx, nx ? nx * 8.9 : u, cy + (ny ? ny * 8.9 : u), .48, 80.5, 103, white, null));
  }
  collect(H.slab(ctx, 0, cy, 21.6, 21.6, 103, 1.1, white, null));
  // Concave, copper-clad transition, directly visible in the NPS photograph.
  const profile = [[12.5, 104.1], [10, 105.3], [8.1, 107], [6.8, 109], [6.3, 111.5]];
  for (let i = 0; i < profile.length - 1; i++) collect(H.octStage(ctx, 0, cy, profile[i][0], profile[i + 1][0],
    profile[i][1], profile[i + 1][1], copper, null));
  collect(H.octStage(ctx, 0, cy, 6.3, 6.3, 111.5, 126, white, null));
  for (let i = 0; i < 8; i++) {
    const a = (i + .5) / 8 * Math.PI * 2, nx = Math.cos(a), ny = Math.sin(a), radius = 6.3 * Math.cos(Math.PI / 8);
    const map = (u, z) => ctx.project(radius * nx - u * ny, cy + radius * ny + u * nx, z);
    collect(H.panel(ctx, map, -1.35, 1.35, 113.2, 123.8, '#3e484d', null, 0));
    const raw = (u, z) => [radius * nx - u * ny, cy + radius * ny + u * nx, z];
    face([raw(-2.2, 125), raw(0, 128.3), raw(2.2, 125)], white);
    for (const u of [-1.7, 1.7]) {
      const base = raw(u, 112), top = raw(u, 125);
      face([base, raw(u + .3, 112), raw(u + .3, 125), top], white);
    }
  }
  // One long copper taper, not the earlier three white lanterns. The 183 ft
  // overall height is retained; component split follows the NPS photograph.
  collect(H.octStage(ctx, 0, cy, 6.1, .65, 126, 175, copper, null));
  for (const [z, radius, win] of [[142, 4.32, .78], [157, 2.65, .55]]) for (let i = 0; i < 8; i++) {
    const a = (i + .5) / 8 * Math.PI * 2, r = radius * Math.cos(Math.PI / 8) + .025;
    const map = (u, zz) => ctx.project(r * Math.cos(a) - u * Math.sin(a), cy + r * Math.sin(a) + u * Math.cos(a), zz);
    collect(H.roundWindow(ctx, map, 0, z, win + .15, '#a2b0a0', null, 0));
    collect(H.roundWindow(ctx, map, 0, z, win, '#354449', null, 0));
    collect(H.panel(ctx, map, -.035, .035, z - win, z + win, '#adb4a3', null, 0));
    collect(H.panel(ctx, map, -win, win, z - .035, z + .035, '#adb4a3', null, 0));
  }
  collect(H.octStage(ctx, 0, cy, .15, .15, 175, 183, '#c9a22c', null));
  face([[-3.9, cy, 179], [3.7, cy, 179.9], [3.6, cy, 181.2], [-3.9, cy, 180]], '#c9a22c');
  return out;
}

function parkStreetStages(ctx) {
  const H = globalThis.window.TRAIL3D.helpers, out = [], white = '#e4e0d6';
  function collect(parts) {
    for (const p of Array.isArray(parts) ? parts : [parts]) { ctx.tag(p.svg, { reconstructed: true }); out.push(p); }
  }
  function face(points, fill) { collect({ svg: ctx.poly(points.map(p => ctx.project(...p)), fill, null, 0), depth: 0 }); }
  function arcade(map, half, low, high) {
    const radius = half, spring = high - half - .4;
    // A genuinely open arch, made from its voussoir strip and jambs. There
    // is no black disc or opaque backing wall between the columns.
    for (let j = 0; j < 14; j++) {
      const a = j / 14 * Math.PI, b = (j + 1) / 14 * Math.PI;
      face([map(Math.cos(a) * radius, spring + Math.sin(a) * radius),
        map(Math.cos(b) * radius, spring + Math.sin(b) * radius),
        map(Math.cos(b) * (radius + .5), spring + Math.sin(b) * (radius + .5)),
        map(Math.cos(a) * (radius + .5), spring + Math.sin(a) * (radius + .5))], white);
    }
    for (const sign of [-1, 1]) face([map(sign * half, low), map(sign * (half + .45), low),
      map(sign * (half + .45), spring), map(sign * half, spring)], white);
  }
  // Published 20-foot-square bell stage, eight columns. Its four arches are
  // reconstructed from the church's contemporary exterior reference.
  const B0 = 94.85, B1 = 102.85;
  for (const [nx, ny] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
    for (const u of [-6.4, 6.4]) collect(H.columnAt(ctx, nx ? nx * 10.9 : u, ny ? ny * 10.9 : u,
      .85, B0, B1, white, null));
    const map = nx ? (u, z) => [nx * 10, u, z] : (u, z) => [u, ny * 10, z];
    arcade(map, 4.6, B0 + .6, B1 - .2);
  }
  collect(H.slab(ctx, 0, 0, 23, 23, B1, 2, white, null));
  function octagon(radius, low, high, capitalRadius) {
    const n = 8;
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2, b = (i + 1) / n * Math.PI * 2, middle = (a + b) / 2;
      collect(H.columnAt(ctx, radius * Math.cos(a), radius * Math.sin(a), capitalRadius, low, high, white, null));
      const along = [-Math.sin(middle), Math.cos(middle)], apothem = radius * Math.cos(Math.PI / 8);
      const map = (u, z) => [Math.cos(middle) * apothem + along[0] * u,
        Math.sin(middle) * apothem + along[1] * u, z];
      arcade(map, radius * Math.sin(Math.PI / 8) - capitalRadius * .7, low + .7, high - .7);
    }
    collect(H.octStage(ctx, 0, 0, radius + .55, radius + .55, high, high + 1.3, white, null));
  }
  octagon(8 / Math.cos(Math.PI / 8), 104.85, 129.85, .56);
  octagon(6.25 / Math.cos(Math.PI / 8), 131.45, 151.45, .45);
  octagon(5.5 / Math.cos(Math.PI / 8), 152.75, 160.45, .4);
  // Four clocks belong to the brick stage, not to the open white lanterns.
  for (const [nx, ny] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
    const map = nx ? (u, z) => ctx.project(nx * 13.53, u, z) : (u, z) => ctx.project(u, ny * 15.53, z);
    collect(H.roundWindow(ctx, map, 0, 83, 4.8, white, null, 0));
    collect(H.roundWindow(ctx, map, 0, 83, 4.1, '#30352e', null, 0));
    collect(H.panel(ctx, map, -.12, .12, 83, 86.1, white, null, 0));
    collect(H.panel(ctx, map, 0, 2.6, 82.9, 83.12, white, null, 0));
  }
  // The main building has a pitched roof in the present-day church image.
  // The 40 ft eaves are measured; 53.5 ft ridge is an explicitly photo-scaled
  // reconstruction, replacing the old deliberately unfinished stopping plane.
  face([[-39.7, -15.5, 40], [-39.7, 48.5, 40], [0, 48.5, 53.5], [0, -15.5, 53.5]], '#77776e');
  face([[39.7, -15.5, 40], [0, -15.5, 53.5], [0, 48.5, 53.5], [39.7, 48.5, 40]], '#77776e');
  face([[-39.7, -15.5, 40], [0, -15.5, 53.5], [39.7, -15.5, 40]], '#924b39');
  for (let i = 0; i < 28; i++) {
    const a = i / 28 * Math.PI, b = (i + 1) / 28 * Math.PI;
    face([[39.7 * Math.cos(a), 48.5 + 39.7 * Math.sin(a), 40],
      [39.7 * Math.cos(b), 48.5 + 39.7 * Math.sin(b), 40], [0, 48.5, 53.5]], '#77776e');
  }
  return out;
}

function oldNorthUpper(ctx) {
  const H = globalThis.window.TRAIL3D.helpers, out = [], cy = -35;
  const white = '#e3e0d7', dark = '#3d494e';
  function collect(parts) {
    for (const p of Array.isArray(parts) ? parts : [parts]) { ctx.tag(p.svg, { reconstructed: true }); out.push(p); }
  }
  function slab(w, z, h) { collect(H.slab(ctx, 0, cy, w, w, z, h, white, null)); }
  function walls(w, low, high) { collect(H.box(ctx, -w / 2, w / 2, cy - w / 2, cy + w / 2, low, high, white, null, white).parts); }
  function faces(w, fn) {
    for (const n of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
      const map = n[0] === 0 ? (u, z) => ctx.project(u, cy + n[1] * w / 2, z) :
        (u, z) => ctx.project(n[0] * w / 2, cy + u, z);
      fn(map);
    }
  }
  function louver(map, center, half, bottom, spring, glazed = false) {
    collect(H.archOpening(ctx, map, center, half + .28, bottom - .24, spring, white, null, 0));
    collect(H.archOpening(ctx, map, center, half, bottom, spring, dark, null, 0));
    if (!glazed) for (let z = bottom + .45; z < spring + half - .25; z += .50) {
      const hw = z <= spring ? half : Math.sqrt(Math.max(0, half * half - (z - spring) ** 2));
      collect(H.panel(ctx, map, center - hw + .05, center + hw - .05, z, z + .10, '#c2c2b8', null, 0));
    }
  }
  slab(28, 68.2, 1.8);
  faces(25.5, map => collect(H.balustrade(ctx, map, -12.6, 12.6, 70, 76, white, null, 0)));
  walls(21.5, 76, 112);
  faces(21.5, map => { louver(map, -4.4, 3.15, 86, 104); louver(map, 4.4, 3.15, 86, 104); });
  slab(23.8, 110.6, 1.4); slab(24.6, 112, .8);
  walls(12.8, 113, 135.5);
  faces(12.8, map => louver(map, 0, 3.2, 118, 129, true));
  slab(15, 134.5, 1.0); slab(15.8, 135.5, .8);
  // Photo-confirmed pinnacles on the lower balustrade and lantern terraces.
  for (const [radius, base, height] of [[11.9, 76, 11], [10.3, 113, 11], [6.1, 136.3, 5.5]]) {
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
      collect(H.octStage(ctx, sx * radius, cy + sy * radius, .72, .72, base, base + 1.4, white, null));
      collect(H.octSpire(ctx, sx * radius, cy + sy * radius, .70, base + 1.4, base + height, white, null));
    }
  }
  collect(H.octSpire(ctx, 0, cy, 5.4, 136.3, 185, white, null));
  collect(H.octStage(ctx, 0, cy, .20, .20, 185, 190.6, '#c9a22c', null));
  collect({ svg: ctx.poly([ctx.project(-2.5, cy, 189), ctx.project(2.5, cy, 189.2),
    ctx.project(2.5, cy, 190.1), ctx.project(-2.5, cy, 191)], '#c9a22c', null, 0), depth: 0 });
  // The photograph shows a single louver above the front granite plaque.
  louver((u, z) => ctx.project(u, -48.25, z), 0, 3.2, 55, 62);
  return out;
}

function paulRevereMeasured(ctx) {
  const H = globalThis.window.TRAIL3D.helpers;
  const out = [], P = ctx.project, wood = '#786b56', trim = '#645742', slate = '#514d44';
  const W = 30.5, D = 18 + 2 / 12, x0 = -W / 2, x1 = W / 2, y0 = -D / 2, y1 = D / 2;
  const OVER = 8.4, EAVE = 16.8, RIDGE = 28.3;
  function face(points, fill, structural = false) {
    const id = ctx.poly(points.map(p => P(...p)), fill, null, 0);
    if (structural) ctx.tag(id, { structural: true });
    out.push({ svg: id, depth: 0 });
  }
  function box(a, b, c, d, z0, z1, fill, roof = fill) {
    out.push(...H.box(ctx, a, b, c, d, z0, z1, fill, null, roof).parts);
  }
  out.push(H.ground(ctx, 0, -7, 66, 70, 0, '#c6cbb9', null));
  out.push(H.ground(ctx, 0, y1 + 6, 48, 10, .15, '#b7b0a3', null));
  out.push(H.ground(ctx, x0 - 8, -8, 14, 43, .16, '#a88670', null));
  box(x0 - .4, x1 + .4, y0 - .4, y1 + .4, .15, 1.2, '#b0a899');
  box(x0, x1, y0, y1, 1.2, OVER, wood, wood);
  box(x0 - .55, x1 + .55, y0, y1 + .82, OVER, EAVE, wood, wood);
  // The rear kitchen is visibly skewed in the HABS measured plan. These
  // corner coordinates are scaled from that sheet, not printed dimensions.
  const ell = [[-1.5, y0], [15.25, y0], [19.5, -25.3], [3.5, -25.3]];
  function prism(plan, za, zb, fill) {
    for (let i = 0; i < plan.length; i++) {
      const a = plan[i], b = plan[(i + 1) % plan.length];
      face([[...a, za], [...b, za], [...b, zb], [...a, zb]], fill, true);
    }
  }
  prism(ell, .15, 1.2, '#b0a899'); prism(ell, 1.2, EAVE, wood);
  const a = [x0 - .95, y0 - .6, EAVE], b = [x1 + .95, y0 - .6, EAVE];
  const c = [x1 + .95, y1 + 1.22, EAVE], d = [x0 - .95, y1 + 1.22, EAVE];
  const r1 = [x0 - .95, 0, RIDGE], r2 = [x1 + .95, 0, RIDGE];
  face([a, b, r2, r1], slate); face([d, r1, r2, c], slate);
  face([a, r1, d], wood); face([b, c, r2], wood);
  const er0 = [6.875, y0, 25], er1 = [11.5, -25.8, 25];
  face([[...ell[0], EAVE], [...ell[3], EAVE], er1, er0], slate);
  face([[...ell[1], EAVE], er0, er1, [...ell[2], EAVE]], slate);
  face([[...ell[3], EAVE], [...ell[2], EAVE], er1], wood);
  // Fine, physically proud clapboard shadows replace 2.2 ft SVG striping.
  function boards(map, left, right, low, high) {
    for (let z = low + .48; z < high; z += .48) face([map(left, z), map(right, z), map(right, z + .035), map(left, z + .035)], '#685c49');
  }
  const front = (u, z) => [u, y1 + .025, z], upper = (u, z) => [u, y1 + .845, z];
  boards(front, x0, x1, 1.2, OVER); boards(upper, x0 - .55, x1 + .55, OVER, EAVE);
  boards((u, z) => [x0 - .575, u, z], y0, y1 + .82, OVER, EAVE);
  boards((u, z) => [x0 - .025, u, z], y0, y1, 1.2, OVER);
  boards((u, z) => [x1 + .575, u, z], y0, y1 + .82, OVER, EAVE);
  boards((u, z) => [x1 + .025, u, z], y0, y1, 1.2, OVER);
  function rectangle(map, l, r, bottom, top, fill) {
    face([map(l, bottom), map(r, bottom), map(r, top), map(l, top)], fill);
  }
  function casement(map, center, bottom, width = 35 / 12, single = false) {
    const top = bottom + 3.9, l = center - width / 2, r = center + width / 2;
    rectangle(map, l - .20, r + .20, bottom - .22, top + .22, trim);
    const leaves = single ? [[l, r]] : [[l, center - .075], [center + .075, r]];
    for (const [lo, hi] of leaves) {
      rectangle(map, lo, hi, bottom, top, '#39494b');
      // Each diamond is clipped into its own casement, not a painted stripe
      // that extends through the timber frame onto the cladding.
      for (const slope of [-2.9, 2.9]) for (let offset = -4.5; offset < 5; offset += .8) {
        const line = [];
        for (let i = 0; i <= 35; i++) {
          const u = lo + (hi - lo) * i / 35, z = bottom + offset + slope * (u - lo);
          if (z >= bottom + .02 && z <= top - .02) line.push(map(u, z));
        }
        if (line.length > 1) {
          const q = line[0], t = line[line.length - 1];
          face([q, [q[0] + .024, q[1], q[2]], [t[0] + .024, t[1], t[2]], t], '#a69d86');
        }
      }
    }
    rectangle(map, l - .3, r + .3, bottom - .28, bottom - .16, trim);
  }
  // HABS sheet 2 writes this nine-part frontage chain, summing 30 ft 6 in.
  const centers = [49 + 35 / 2, 137 + 35 / 2, 224 + 35 / 2].map(inches => x0 + inches / 12);
  centers.forEach(x => { casement(front, x, 3); casement(upper, x, 10.8); });
  const doorX = x0 + (291 + 16) / 12;
  rectangle(front, doorX - 16 / 12, doorX + 16 / 12, 1.2, 7.7, '#443a2b');
  casement(upper, doorX, 10.8, 1.6, true);
  box(doorX - 1.7, doorX + 1.7, y1, y1 + 1.8, .15, .8, '#b0a899');
  box(x0 - .65, x1 + .65, y1 + .73, y1 + .93, OVER - .18, OVER + .30, trim);
  box(x0 - .95, x1 + .95, y1 + 1.05, y1 + 1.28, EAVE - .3, EAVE, trim);
  // HABS sheet 4: the exposed WEST/rear portion carries one paired casement
  // on each floor. The NORTH party-wall is not mirrored from the south.
  const rear = (u, z) => [u, y0 - .025, z];
  casement(rear, -8.4, 3); casement(rear, -8.4, 10.8);
  boards(rear, x0, -1.5, 1.2, EAVE);
  // SOUTH gable: shuttered opening on each floor, small attic casement.
  function sideWindow(x, bottom, width, height, shutters = false) {
    const map = (u, z) => [x, u, z], hw = width / 2;
    rectangle(map, -hw - .16, hw + .16, bottom - .16, bottom + height + .16, trim);
    rectangle(map, -hw, hw, bottom, bottom + height, '#39494b');
    rectangle(map, -.045, .045, bottom, bottom + height, '#aca18a');
    rectangle(map, -hw, hw, bottom + height / 2 - .045, bottom + height / 2 + .045, '#aca18a');
    if (shutters) {
      rectangle(map, -hw * 2.05, -hw - .12, bottom, bottom + height, '#584c39');
      rectangle(map, hw + .12, hw * 2.05, bottom, bottom + height, '#584c39');
    }
  }
  sideWindow(x0 - .03, 3, 2.2, 3.8, true);
  sideWindow(x0 - .58, 10.8, 2.2, 3.8, true);
  sideWindow(x0 - .97, 20.1, 1.8, 2.8);
  const ellRear = (u, z) => [u, -25.325, z];
  function sashRear(center, bottom, w = 2.3, h = 3.8) {
    rectangle(ellRear, center - w / 2 - .17, center + w / 2 + .17, bottom - .17, bottom + h + .17, trim);
    rectangle(ellRear, center - w / 2, center + w / 2, bottom, bottom + h, '#39494b');
    rectangle(ellRear, center - .035, center + .035, bottom, bottom + h, '#b5ac93');
    for (let j = 1; j < 4; j++) rectangle(ellRear, center - w / 2, center + w / 2,
      bottom + h * j / 4 - .035, bottom + h * j / 4 + .035, '#b5ac93');
  }
  sashRear(15.3, 3); sashRear(7, 10.8); sashRear(15.3, 10.8); sashRear(11.5, 19.8, 1.6, 2.2);
  rectangle(ellRear, 5.8, 8.2, 1.2, 7.5, '#443a2b');
  for (let i = 0; i < 3; i++) box(5.4, 8.6, -28 + i * .7, -25.3, .15, .5 + i * .35, '#b0a899');
  boards(ellRear, 3.5, 19.5, 1.2, EAVE);
  const roofZ = y => 16.8 + (1 - Math.abs(y) / (D / 2 + .6)) * (RIDGE - EAVE) + .04;
  face([[-7.1, -5.5, roofZ(-5.5)], [-5.9, -5.5, roofZ(-5.5)],
    [-5.9, -3.9, roofZ(-3.9)], [-7.1, -3.9, roofZ(-3.9)]], '#3e4b4e');
  // Chimney on the right/north end, as the museum-linked HABS facade shows.
  box(9.1, 13.6, -2.9, 2.9, EAVE - 1, 31.4, '#8e4938');
  box(8.8, 13.9, -3.2, 3.2, 31.4, 32.1, '#98543f');
  box(10.2, 12.4, -20.2, -18, 23, 28.2, '#8e4938');
  box(10, 12.6, -20.4, -17.8, 28.2, 28.6, '#98543f');
  // Two corner pendants, confirmed by the HABS front elevation.
  for (const x of [x0 + .2, x1 - .2]) {
    out.push(...H.columnAt(ctx, x, y1 + .82, .19, OVER - 1.15, OVER, trim, null));
  }
  return out;
}

function bunkerMonumentRecords() {
  const out = [], base = .3, shaft = 208 + 5 / 12, cap = 13;
  function face(points, fill, structural = false) {
    out.push({ points, fill, tags: { structural }, holes: [], offset: 0, extra: '', depth: 0 });
  }
  const sidePoint = (side, u, z, offset = 0) => {
    const half = 15 - 7.5 * (z - base) / shaft + offset;
    return side === 0 ? [u, -half, z] : side === 1 ? [half, u, z] :
      side === 2 ? [-u, half, z] : [-half, -u, z];
  };
  for (let side = 0; side < 4; side++) {
    face([sidePoint(side, -15, base), sidePoint(side, 15, base),
      sidePoint(side, 7.5, base + shaft), sidePoint(side, -7.5, base + shaft)], '#a4a099', true);
    for (let course = 1; course < 78; course++) {
      const z = base + shaft * course / 78, width = 15 - 7.5 * course / 78;
      face([sidePoint(side, -width, z, .012), sidePoint(side, width, z, .012),
        sidePoint(side, width, z + .045, .012), sidePoint(side, -width, z + .045, .012)], '#77766e');
    }
    // One observation window per face. Their existence is documented; their
    // 2.4-by-5.8 ft visible aperture and exact sill are scaled approximations.
    face([sidePoint(side, -1.4, 199), sidePoint(side, 1.4, 199), sidePoint(side, 1.4, 205.2),
      sidePoint(side, -1.4, 205.2)], '#c4beb2');
    face([sidePoint(side, -1.2, 199.2, .02), sidePoint(side, 1.2, 199.2, .02),
      sidePoint(side, 1.2, 205, .02), sidePoint(side, -1.2, 205, .02)], '#354149');
    const corners = [[-7.5, -7.5], [7.5, -7.5], [7.5, 7.5], [-7.5, 7.5]];
    const a = corners[side], b = corners[(side + 1) % 4];
    face([[...a, base + shaft], [...b, base + shaft], [0, 0, base + shaft + cap]], '#aaa69e', true);
  }
  face([sidePoint(2, -3.2, base), sidePoint(2, 3.2, base), sidePoint(2, 3.2, 9.5), sidePoint(2, -3.2, 9.5)], '#b8b0a3');
  face([sidePoint(2, -2.4, base + .01, .02), sidePoint(2, 2.4, base + .01, .02),
    sidePoint(2, 2.4, 8.5, .02), sidePoint(2, -2.4, 8.5, .02)], '#38434a');
  return out;
}

function dormerRecords(key) {
  const out = [], faneuil = key === 'faneuil-hall';
  const front = faneuil ? 28 : 13.6, back = faneuil ? 17 : 7.7;
  const bottom = faneuil ? 73.4 : 35.2, spring = faneuil ? 79.1 : 40;
  const half = faneuil ? 2.55 : 2.0;
  const positions = faneuil ? [-36, -18, 0, 18, 36] : [-40, -20, 0, 20, 40];
  function rec(points, fill, normalHint = null) { out.push({ points, fill, tags: normalHint ? { normalHint } : {}, holes: [], extra: '', offset: 0, depth: 0 }); }
  for (const sign of [-1, 1]) for (const y of positions) {
    const point = (u, z, x = front) => [sign * x, y + u, z];
    const head = [];
    if (faneuil) for (let j = 0; j <= 12; j++) {
      const a = Math.PI - j * Math.PI / 12;
      head.push([half * Math.cos(a), spring + half * Math.sin(a)]);
    }
    else head.push([-half, spring], [0, spring + 1.75], [half, spring]);
    const outline = [[-half, bottom], [-half, spring], ...head, [half, bottom]];
    rec(outline.map(([u, z]) => point(u, z)), '#d6d0c4', [sign, 0, 0]);
    // Recessed dark sash and a slim physical surround.
    rec([point(-half + .35, bottom + .5, front + .01), point(half - .35, bottom + .5, front + .01),
      point(half - .35, spring - .35, front + .01), point(-half + .35, spring - .35, front + .01)], '#3b494f');
    const roofFill = faneuil ? '#7b978b' : '#655f56';
    for (let j = 0; j < head.length - 1; j++) {
      const a = head[j], b = head[j + 1];
      rec([point(a[0], a[1]), point(b[0], b[1]), point(b[0], b[1], back), point(a[0], a[1], back)], roofFill);
    }
    for (const side of [-1, 1]) rec([point(side * half, bottom), point(side * half, spring),
      point(side * half, spring, back), point(side * half, bottom + 3.2, back)], '#c6c0b4');
  }
  return out;
}

function describe(rec) {
  const p = rec.points;
  rec.normal = polygonNormal(p);
  // Some legacy gable helpers enumerate BOTH ends in the same direction and
  // rely on ctx.shade's declared facade normal. Preserve that sign so a front
  // window is recessed behind the wall, not projected in front of its muntins.
  if (rec.normal && rec.tags.normalHint && dot(rec.normal, rec.tags.normalHint) < 0) rec.normal = rec.normal.map(v => -v);
  rec.min = [0, 1, 2].map(a => Math.min(...p.map(q => q[a])));
  rec.max = [0, 1, 2].map(a => Math.max(...p.map(q => q[a])));
  rec.kind = surfaceKind(rec.fill);
  if (!rec.normal) return rec;
  rec.u = Math.abs(rec.normal[2]) > .98 ? [1, 0, 0] : unit(cross([0, 0, 1], rec.normal));
  rec.v = unit(cross(rec.normal, rec.u));
  if (rec.v[2] < 0) { rec.u = rec.u.map(x => -x); rec.v = rec.v.map(x => -x); }
  rec.local = p.map(q => [dot(q, rec.u), dot(q, rec.v)]);
  rec.area = Math.abs(rec.local.reduce((sum, a, i) => {
    const b = rec.local[(i + 1) % p.length]; return sum + a[0] * b[1] - b[0] * a[1];
  }, 0) / 2);
  return rec;
}

function inside(point, contour) {
  let yes = false;
  for (let i = 0, j = contour.length - 1; i < contour.length; j = i++) {
    const a = contour[i], b = contour[j];
    if ((a[1] > point[1]) !== (b[1] > point[1]) && point[0] < (b[0] - a[0]) *
      (point[1] - a[1]) / (b[1] - a[1]) + a[0]) yes = !yes;
  }
  return yes;
}

function contains(parent, child, planeTolerance = .55) {
  if (!parent.normal || !child.normal || Math.abs(dot(parent.normal, child.normal)) < .998 ||
      parent.area < child.area * 1.05) return false;
  if (child.points.some(p => Math.abs(dot(sub(p, parent.points[0]), parent.normal)) > planeTolerance)) return false;
  const points = child.points.map(p => [dot(p, parent.u), dot(p, parent.v)]);
  // A tiny contraction prevents shared sill edges from being interpreted as
  // outside and leaves contour topology unchanged.
  const c = points.reduce((s, p) => [s[0] + p[0] / points.length, s[1] + p[1] / points.length], [0, 0]);
  return points.every(p => inside([p[0] * .999 + c[0] * .001, p[1] * .999 + c[1] * .001], parent.local));
}

function buildFacades(records, key) {
  const solid = records.filter(r => r.normal && r.area > EPS);
  const windows = [];
  for (const r of solid) {
    if (Math.abs(r.normal[2]) > .10 || r.tags.structural) continue;
    const parents = solid.filter(p => p !== r && contains(p, r));
    parents.sort((a, b) => b.area - a.area);
    if (parents.length) {
      // Inherit the containing wall's outward normal, independent of which
      // direction a legacy sash contour happened to be enumerated.
      r.outward = parents[0].normal;
      r.offset = Math.min(.18, parents.length * .035);
    }
    const span = Math.max(r.max[0] - r.min[0], r.max[1] - r.min[1]);
    const h = r.max[2] - r.min[2];
    if (!['glass', 'door'].includes(r.kind) || !parents.length || span < .7 || h < 1.3 ||
        span > 16 || h > 30 || r.area > 260) continue;
    // Real hole topology and a shallow reveal replace glass painted on a
    // brick quad. All containing wall/surround faces receive the opening.
    r.offset = -.30;
    for (const p of parents) p.holes.push(r);
    windows.push(r);
  }
  return windows;
}

function meshAccumulator(THREE, kit) {
  const groups = new Map();
  function bucket(fill, sourcePoints, name = 'surfaces') {
    const material = kit.materialFor(fill, sourcePoints);
    const id = `${material.uuid || material.id}:${name}`;
    if (!groups.has(id)) groups.set(id, { material, position: [], normal: [], uv: [], name });
    return groups.get(id);
  }
  function triangle(fill, a, b, c, normal = null, uv = null, name = 'surfaces', sourcePoints = null) {
    const n = normal || unit(cross(sub(b, a), sub(c, a)));
    if (Math.hypot(...cross(sub(b, a), sub(c, a))) < EPS) return;
    const entry = bucket(fill, sourcePoints || [a, b, c], name);
    [a, b, c].forEach((p, i) => {
      entry.position.push(...threePoint(p));
      entry.normal.push(...threePoint(Array.isArray(n[0]) ? n[i] : n));
      entry.uv.push(...(uv?.[i] || [p[0], p[2]]));
    });
  }
  function polygon(rec, points = rec.points, offset = rec.offset || 0, name = 'surfaces') {
    if (!rec.normal || rec.area < EPS) return;
    const outward = rec.outward || rec.normal;
    const contour = points.map(p => new THREE.Vector2(dot(p, rec.u), dot(p, rec.v)));
    const holes = (rec.holes || []).map(h => h.points.map(p => new THREE.Vector2(dot(p, rec.u), dot(p, rec.v))));
    const flatPoints = points.concat(...(rec.holes || []).map(h => h.points.map(p => {
      // Project near-coplanar openings onto the actual wall before cutting.
      return add(p, rec.normal, -dot(sub(p, points[0]), rec.normal));
    })));
    const flatUV = contour.concat(...holes).map(v => [v.x, v.y]);
    const faces = THREE.ShapeUtils.triangulateShape(contour, holes);
    for (const face of faces) {
      let p = face.map(i => add(flatPoints[i], outward, offset));
      let uv = face.map(i => flatUV[i]);
      let normals = outward;
      if (rec.tags.dome) {
        const [cx, cy, z0, radius, height] = rec.tags.dome;
        normals = p.map(v => unit([(v[0] - cx) / (radius * radius), (v[1] - cy) / (radius * radius),
          (v[2] - z0) / (height * height)]));
      } else if (rec.tags.column) {
        const [cx, cy] = rec.tags.column;
        normals = p.map(v => unit([v[0] - cx, v[1] - cy, outward[2]]));
      }
      if (dot(cross(sub(p[1], p[0]), sub(p[2], p[0])), outward) < 0) {
        [p[1], p[2]] = [p[2], p[1]]; [uv[1], uv[2]] = [uv[2], uv[1]];
        if (Array.isArray(normals[0])) [normals[1], normals[2]] = [normals[2], normals[1]];
      }
      triangle(rec.fill, ...p, normals, uv, name, rec.points);
    }
  }
  function quad(fill, a, b, c, d, name = 'surfaces') {
    polygon(describe({ points: [a, b, c, d], fill, holes: [], tags: {}, offset: 0 }), undefined, 0, name);
  }
  function tube(fill, a, b, radius, segments = 8, name = 'detail') {
    const axis = unit(sub(b, a));
    const u = unit(cross(axis, Math.abs(axis[2]) < .9 ? [0, 0, 1] : [0, 1, 0]));
    const v = cross(axis, u);
    for (let i = 0; i < segments; i++) {
      const ang = i * Math.PI * 2 / segments, ang2 = (i + 1) * Math.PI * 2 / segments;
      const n = add(u.map(x => x * Math.cos(ang)), v, Math.sin(ang));
      const n2 = add(u.map(x => x * Math.cos(ang2)), v, Math.sin(ang2));
      quad(fill, add(a, n, radius), add(a, n2, radius), add(b, n2, radius), add(b, n, radius), name);
    }
  }
  function ellipsoid(fill, center, scale, name = 'detail') {
    const segments = 24, rows = 12;
    const point = (a, b) => [center[0] + scale[0] * Math.cos(a) * Math.sin(b),
      center[1] + scale[1] * Math.sin(a) * Math.sin(b), center[2] + scale[2] * Math.cos(b)];
    for (let j = 0; j < rows; j++) for (let i = 0; i < segments; i++) {
      quad(fill, point(i / segments * Math.PI * 2, j / rows * Math.PI),
        point((i + 1) / segments * Math.PI * 2, j / rows * Math.PI),
        point((i + 1) / segments * Math.PI * 2, (j + 1) / rows * Math.PI),
        point(i / segments * Math.PI * 2, (j + 1) / rows * Math.PI), name);
    }
  }
  function finish() {
    const group = new THREE.Group();
    for (const value of groups.values()) {
      if (!value.position.length) continue;
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(value.position, 3));
      geo.setAttribute('normal', new THREE.Float32BufferAttribute(value.normal, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(value.uv, 2));
      geo.computeBoundingBox(); geo.computeBoundingSphere();
      const mesh = new THREE.Mesh(geo, value.material);
      mesh.name = value.name;
      mesh.castShadow = value.name !== 'ground';
      mesh.receiveShadow = true;
      group.add(mesh);
    }
    return group;
  }
  return { polygon, quad, tube, ellipsoid, finish };
}

function addWindowDetail(acc, window, key) {
  const n = window.outward || window.normal;
  const face = window.points, front = face.map(p => add(p, n, .05)), rear = face.map(p => add(p, n, -.30));
  for (let i = 0; i < face.length; i++) {
    const j = (i + 1) % face.length;
    acc.quad('#b8b0a0', front[i], front[j], rear[j], rear[i], 'window-reveals');
  }
  if (window.kind !== 'glass' || key === 'paul-revere' || key === 'constitution' ||
      window.max[2] > (key === 'old-north' ? 65 : 85)) return;
  const u = window.u, vs = window.local.map(p => p[0]);
  const left = Math.min(...vs), right = Math.max(...vs), bottom = window.min[2], top = window.max[2];
  const origin = face[0];
  const at = (x, z) => add(add(origin, u, x - dot(origin, u)), [0, 0, 1], z - origin[2]);
  const bar = (a, b) => acc.tube('#d8d4c8', add(a, n, -.18), add(b, n, -.18), .065, 6, 'window-muntins');
  const uvPoint = p => [dot(p, window.u), dot(p, window.v)];
  const inWindow = p => inside(uvPoint(p), window.local);
  // Sash bars are a fine-scale representation, not a newly asserted pane
  // count. They are clipped to each actual arch instead of crossing brick.
  for (let z = bottom + 1.4; z < top - .5; z += 1.55) {
    const accepted = [];
    for (let i = 0; i <= 30; i++) {
      const p = at(left + .14 + (right - left - .28) * i / 30, z);
      if (inWindow(p)) accepted.push(p);
    }
    if (accepted.length > 1) bar(accepted[0], accepted[accepted.length - 1]);
  }
  for (const fraction of [.333, .667]) {
    const accepted = [];
    for (let i = 0; i <= 40; i++) {
      const p = at(left + (right - left) * fraction, bottom + .12 + (top - bottom - .24) * i / 40);
      if (inWindow(p)) accepted.push(p);
    }
    if (accepted.length > 1) bar(accepted[0], accepted[accepted.length - 1]);
  }
}

function signatureDetails(acc, key, records) {
  if (key === 'state-house') {
    // The drum must physically reach the main roof. The original painted
    // view omitted its hidden rear support and left the gold dome floating.
    for (let i = 0; i < 64; i++) {
      const a = i / 64 * Math.PI * 2, b = (i + 1) / 64 * Math.PI * 2;
      acc.quad('#a8523c', [26 * Math.cos(a), 3.5 + 26 * Math.sin(a), 50],
        [26 * Math.cos(b), 3.5 + 26 * Math.sin(b), 50], [26 * Math.cos(b), 3.5 + 26 * Math.sin(b), 69],
        [26 * Math.cos(a), 3.5 + 26 * Math.sin(a), 69], 'dome-support');
    }
    const center = [0, 3.5, 122.8];
    acc.ellipsoid('#c9a02b', center, [1.48, 1.48, 2.9], 'gilt-pinecone');
    // Scales make the pine cone read as the specific finial, not a spike.
    for (let j = 0; j < 7; j++) for (let i = 0; i < 9; i++) {
      const theta = (i + (j % 2) * .5) * Math.PI * 2 / 9;
      const z = -2.3 + j * .69, r = 1.48 * Math.sqrt(Math.max(.05, 1 - z * z / 8.41));
      acc.ellipsoid('#d5af3e', [r * Math.cos(theta), 3.5 + r * Math.sin(theta), 122.8 + z], [.30, .30, .40], 'gilt-pinecone');
    }
    // Fine standing seams on the leaf follow the exact published dome profile.
    for (let i = 0; i < 24; i++) {
      const angle = i * Math.PI * 2 / 24;
      for (let j = 0; j < 22; j++) {
        const a = j / 24 * Math.PI / 2, b = (j + 1) / 24 * Math.PI / 2;
        acc.tube('#b28a27', [25.02 * Math.cos(a) * Math.cos(angle), 3.5 + 25.02 * Math.cos(a) * Math.sin(angle), 72 + 30.02 * Math.sin(a)],
          [25.02 * Math.cos(b) * Math.cos(angle), 3.5 + 25.02 * Math.cos(b) * Math.sin(angle), 72 + 30.02 * Math.sin(b)], .045, 5, 'dome-seams');
      }
    }
  }
  if (key === 'faneuil-hall') {
    const cy = 102 / 2 - 25; // retained cupola position, explicitly derived in source form
    const z = 126.35, gilt = '#cda533';
    // NPS: length four feet, one inch. Body, bent hind legs, antennae and
    // spindle are separate three-dimensional metal parts.
    acc.ellipsoid(gilt, [-.15, cy, z], [1.34, .25, .36], 'grasshopper');
    acc.ellipsoid(gilt, [1.25, cy, z + .2], [.32, .28, .34], 'grasshopper');
    acc.ellipsoid('#bd9328', [-.10, cy + .12, z + .22], [1.22, .12, .16], 'grasshopper');
    for (const side of [-1, 1]) {
      const y = cy + side * .2;
      acc.tube(gilt, [.35, y, z], [-.65, y + side * .20, z + 1], .075, 8, 'grasshopper');
      acc.tube(gilt, [-.65, y + side * .20, z + 1], [-1.55, y + side * .45, z - .5], .042, 6, 'grasshopper');
      acc.tube(gilt, [.8, y, z], [.45, y + side * .5, z - .6], .035, 6, 'grasshopper');
      acc.tube(gilt, [1.4, y, z + .42], [2.53, y + side * .32, z + 1.1], .025, 6, 'grasshopper');
    }
    // Replace discarded legacy dome output with a rounded cap, retained size.
    for (let row = 0; row < 20; row++) for (let i = 0; i < 64; i++) {
      const point = (a, b) => [7 * Math.cos(a) * Math.cos(b), cy + 7 * Math.sin(a) * Math.cos(b), 113.9 + 6 * Math.sin(b)];
      acc.quad('#d8d2c5', point(i / 64 * Math.PI * 2, row / 20 * Math.PI / 2),
        point((i + 1) / 64 * Math.PI * 2, row / 20 * Math.PI / 2),
        point((i + 1) / 64 * Math.PI * 2, (row + 1) / 20 * Math.PI / 2),
        point(i / 64 * Math.PI * 2, (row + 1) / 20 * Math.PI / 2), 'cupola-dome');
    }
  }
  if (key === 'old-north') {
    // Published 10 ft 3 in by 6 ft 4 in by one-foot-thick granite tablet,
    // installed 42 ft above pavement, not another invented tower window.
    acc.quad('#989486', [-5.125, -49.25, 42], [5.125, -49.25, 42], [5.125, -49.25, 48 + 1 / 3],
      [-5.125, -49.25, 48 + 1 / 3], 'revere-plaque');
  }
  if (key === 'constitution') {
    const FREE = 20, HALF = 103.5;
    const deck = t => FREE + 6.5 * t * t + 1.6 * t - .6;
    const mainDeck = deck(-.02), scale = (mainDeck + 172 - 32) / (mainDeck + 200 - 32);
    const zMap = z => z > 32 ? 32 + (z - 32) * scale : z;
    const masts = [[-.02, 200], [.42, 178], [-.46, 152.5]].map(([t, h]) => ({ x: -t * HALF,
      low: deck(t), top: zMap(deck(t) + h), topmast: zMap(deck(t) + h * .72), fighting: zMap(deck(t) + h * .42) }));
    const main = masts[0], fore = masts[1], mizzen = masts[2];
    const rope = (a, b, r = .065) => acc.tube('#30332e', a, b, r, 6, 'standing-rigging');
    for (const mast of masts) {
      for (const y of [-19, 19]) {
        rope([mast.x, 0, mast.top], [mast.x + 19, y, mast.low + 4]);
        rope([mast.x, 0, mast.topmast], [mast.x + 25, y, mast.low + 4], .08);
      }
      // Topmast shrouds continue above the fighting tops, not just lower fans.
      for (const y of [-7, 7]) for (let i = 0; i < 4; i++) {
        rope([mast.x, y > 0 ? .5 : -.5, mast.topmast], [mast.x + i * 1.7, y, mast.fighting + 1], .045);
      }
    }
    rope([main.x, 0, main.top], [fore.x, 0, fore.fighting], .08);
    rope([main.x, 0, main.topmast], [fore.x - 6, 0, fore.low + 4], .10);
    rope([fore.x, 0, fore.top], [-161, 0, 48], .075);
    rope([fore.x, 0, fore.topmast], [-152, 0, 45], .09);
    rope([fore.x, 0, fore.fighting], [-115, 0, 35], .10);
    rope([mizzen.x, 0, mizzen.top], [main.x, 0, main.fighting], .08);
    rope([mizzen.x, 0, mizzen.topmast], [main.x - 4, 0, main.low + 4], .10);
    // The spanker boom starts at the mizzen, replacing a detached aft stick.
    acc.tube('#a18a5c', [mizzen.x, 0, mizzen.low + 12], [137, 0, 38], .48, 12, 'spanker-boom');
    rope([mizzen.x, 0, mizzen.fighting], [137, 0, 38], .075);
    const topZ = main.fighting;
    // Museum rig repair survey: main fighting top 21 ft athwartships by
    // 15 ft 4 in fore-and-aft. These are not scaled from the ship's beam.
    acc.quad('#776b52', [main.x - 23 / 3, -10.5, topZ], [main.x + 23 / 3, -10.5, topZ],
      [main.x + 23 / 3, 10.5, topZ], [main.x - 23 / 3, 10.5, topZ], 'main-fighting-top');
    const white = '#deddd2', glazing = '#425c64';
    function sixPane(map, low, high, bottom, top, outward = [1, 0, 0]) {
      acc.quad(white, map(low - .15, bottom - .15), map(high + .15, bottom - .15),
        map(high + .15, top + .15), map(low - .15, top + .15), 'stern-window-frames');
      const glassMap = (u, z) => add(map(u, z), outward, .025);
      const barMap = (u, z) => add(map(u, z), outward, .08);
      acc.quad(glazing, glassMap(low, bottom), glassMap(high, bottom), glassMap(high, top), glassMap(low, top), 'stern-windows');
      const mid = (low + high) / 2;
      acc.tube(white, barMap(mid, bottom), barMap(mid, top), .06, 6, 'stern-window-frames');
      for (let i = 1; i < 3; i++) acc.tube(white, barMap(low, bottom + (top - bottom) * i / 3),
        barMap(high, bottom + (top - bottom) * i / 3), .06, 6, 'stern-window-frames');
    }
    // Current arrangement documented by NHHC/Museum: three transom windows,
    // two portholes, and three six-pane windows per projecting gallery.
    const sternMap = (u, z) => [104.02, u, z];
    for (const y of [-3.7, 0, 3.7]) sixPane(sternMap, y - 1.15, y + 1.15, 16.2, 22.6);
    // NHHC's 2016 stern-repair record identifies three separate small
    // spar-deck windows above the captain's cabin. Sizes remain scaled.
    for (const y of [-4.7, 0, 4.7]) sixPane(sternMap, y - .75, y + .75, 26.9, 28.2);
    // The modern NPS stern photograph shows restrained white mouldings and
    // carving on black, not the legacy gilded counter and rectangular eagle.
    for (const z of [15.45, 23.85]) acc.tube(white, [104.12, -7.4, z], [104.12, 7.4, z], .13, 8, 'stern-mouldings');
    for (const y of [-7.4, 7.4]) acc.tube(white, [104.12, y, 15.45], [104.12, y, 23.85], .10, 8, 'stern-mouldings');
    // A small raised spread-wing relief is deliberately schematic: no claim
    // is made that these simplified feathers reproduce the actual carving.
    acc.ellipsoid(white, [104.16, 0, 25.16], [.12, .27, .55], 'stern-eagle');
    acc.ellipsoid(white, [104.16, -.10, 25.75], [.13, .20, .20], 'stern-eagle');
    for (const sign of [-1, 1]) {
      acc.tube(white, [104.16, sign * .18, 25.22], [104.16, sign * 1.08, 25.83], .12, 8, 'stern-eagle');
      acc.tube(white, [104.16, sign * 1.08, 25.83], [104.16, sign * 2.35, 25.63], .11, 8, 'stern-eagle');
      for (let i = 0; i < 5; i++) acc.tube(white,
        [104.16, sign * (1.02 + i * .24), 25.81 - i * .04],
        [104.16, sign * (1.12 + i * .27), 25.35 - i * .04], .05, 6, 'stern-eagle');
    }
    for (const y of [-6.3, 6.3]) {
      for (let i = 0; i < 24; i++) {
        const a = i / 24 * Math.PI * 2, b = (i + 1) / 24 * Math.PI * 2;
        acc.quad(white, sternMap(y + .72 * Math.cos(a), 19.4 + .72 * Math.sin(a)),
          sternMap(y + .72 * Math.cos(b), 19.4 + .72 * Math.sin(b)),
          sternMap(y + .55 * Math.cos(b), 19.4 + .55 * Math.sin(b)),
          sternMap(y + .55 * Math.cos(a), 19.4 + .55 * Math.sin(a)), 'stern-window-frames');
      }
      acc.ellipsoid(glazing, [104.04, y, 19.4], [.07, .55, .55], 'stern-windows');
    }
    const galleryT = -.92, galleryB = 21.75 * Math.pow(1 - Math.pow(Math.abs(galleryT), 2.6), .42);
    const galleryX = -galleryT * HALF;
    for (const sign of [-1, 1]) {
      const map = (u, z) => [u, sign * (galleryB + 3.01), z];
      for (const x of [galleryX - 3.4, galleryX, galleryX + 3.4]) sixPane(map, x - 1.1, x + 1.1, 16.6, 21.7, [0, sign, 0]);
    }
  }
}

function keepRecord(rec, key) {
  if (rec.tags.reconstructed) return true;
  if (rec.points.length < 2 || !rec.fill || rec.fill === 'none') return false;
  const minZ = Math.min(...rec.points.map(p => p[2])), maxZ = Math.max(...rec.points.map(p => p[2]));
  // Real-time shadows replace every opaque or translucent painted shadow.
  if (maxZ < .4 && (rec.extra.includes('opacity') || /^rgba/.test(rec.fill) ||
      ['#000', '#a9ae9c', '#a9a294', '#9d9689'].includes(rec.fill))) return false;
  const spanX = Math.max(...rec.points.map(p => p[0])) - Math.min(...rec.points.map(p => p[0]));
  const spanY = Math.max(...rec.points.map(p => p[1])) - Math.min(...rec.points.map(p => p[1]));
  // Coarse SVG brick stripes are replaced by the shared fine masonry map.
  if (surfaceKind(rec.fill) === 'brick' && maxZ - minZ < .65 && Math.max(spanX, spanY) > 10 && !rec.tags.structural) return false;
  if (key === 'state-house' && minZ >= 120.79 && maxZ > 121) return false;
  if (key === 'faneuil-hall' && ((minZ >= 113.89 && maxZ <= 119.91) || rec.depth >= 5900)) return false;
  if (key === 'bunker-hill') {
    if (rec.depth >= 1000 && rec.depth < 3000) return false;
    if (maxZ <= 7.01 && Math.max(...rec.points.map(p => Math.abs(p[0]))) <= 25.01 &&
        Math.max(...rec.points.map(p => Math.abs(p[1]))) <= 25.01 && minZ >= .29) return false;
    if (minZ >= 208 && Math.max(...rec.points.map(p => Math.abs(p[0]))) < 16 &&
        Math.max(...rec.points.map(p => Math.abs(p[1]))) < 16) return false;
  }
  if (key === 'old-north' && minZ >= 69.99) return false;
  if (key === 'old-south' && minZ >= 79.99) return false;
  if (key === 'park-street') {
    if (minZ >= 94.84 && maxZ <= 161.76) return false;
    if (rec.depth === -1e7) return false; // unfinished flat roof stopping plane
    if (rec.fill === '#3f4d55' && minZ >= 75 && maxZ < 92) return false;
  }
  if (key === 'old-north' && minZ > 42 && maxZ < 56 && Math.abs(rec.points[0][1] + 48.25) < .1 &&
      Math.max(...rec.points.map(p => Math.abs(p[0]))) < 5) return false;
  if (key === 'constitution' && rec.points.length === 4 && rec.depth === 150002 &&
      Math.max(...rec.points.map(p => p[0])) < -90) return false;
  if (key === 'constitution' && minZ >= 103.36 && maxZ <= 104.58 &&
      Math.min(...rec.points.map(p => p[0])) > -9 && Math.max(...rec.points.map(p => p[0])) < 5) return false;
  if (key === 'constitution') {
    const minX = Math.min(...rec.points.map(p => p[0])), maxX = Math.max(...rec.points.map(p => p[0]));
    if (rec.fill === '#38505c' && maxX < -88 && minZ > 12 && maxZ < 25) return false;
    // Remove all obsolete gilded transom rectangles, including the broad
    // counter, taffrail and block-like eagle. Modern trim is rebuilt above.
    if (minX < -103.6 && maxX < -103.6 && surfaceKind(rec.fill) === 'gold') return false;
  }
  return true;
}

export function buildBostonLandmark(THREE, key, kit) {
  const metadata = BOSTON_LANDMARKS[key];
  if (!metadata) throw new Error(`Unknown Boston landmark: ${key}`);
  const records = capture(key).filter(r => keepRecord(r, key));
  if (key === 'bunker-hill') records.push(...bunkerMonumentRecords());
  if (key === 'faneuil-hall' || key === 'old-state-house') records.push(...dormerRecords(key));
  if (key === 'constitution') {
    // The museum's 172 ft above spar deck replaces the old 220 ft timber
    // length mistaken for waterline height. Remaining rig ratios are derived.
    const sourceDeck = 20 + 6.5 * .02 * .02 - 1.6 * .02 - .6;
    const scale = (sourceDeck + 172 - 32) / (sourceDeck + 200 - 32);
    for (const r of records) {
      // Present-day quarter galleries have dark roofs and black-painted
      // surrounds. The old gilt roof belongs to no verified modern reference.
      if (Math.max(...r.points.map(p => p[0])) < -88) {
        if (surfaceKind(r.fill) === 'gold') { r.fill = '#29302d'; r.edge = '#202624'; }
        else if (r.fill === '#3b3f46') r.fill = '#202727';
      }
      for (const p of r.points) if (p[2] > 32) p[2] = 32 + (p[2] - 32) * scale;
    }
  }
  if (key === 'park-street') for (const r of records) if (r.depth === 1e8) {
    const highest = Math.max(...r.points.map(p => p[2]));
    r.points.forEach(p => { p[2] -= highest - 217.75; });
  }
  if (key === 'old-south') for (const r of records) {
    if (!r.tags.reconstructed && Math.min(...r.points.map(p => p[1])) >= 40 &&
        Math.max(...r.points.map(p => Math.abs(p[0]))) <= 13 && Math.min(...r.points.map(p => p[2])) >= 3) {
      r.points.forEach(p => { p[1] = 38.4 + (p[1] - 41) * 20 / 11; });
    }
  }
  if (key === 'faneuil-hall') for (const r of records) {
    const low = Math.min(...r.points.map(p => p[2])), high = Math.max(...r.points.map(p => p[2]));
    const span = Math.max(...[0, 1].map(axis => Math.max(...r.points.map(p => p[axis])) - Math.min(...r.points.map(p => p[axis]))));
    // The legacy arcade spring line was 18 ft, so its arch heads ran above
    // the 20 ft storey and were buried behind the belt course. Retain each
    // bay's width, but fit the full arched opening beneath its own floor line.
    if (!r.tags.structural && low > 3 && low < 5 && high > 20 && high < 24 && span < 10) {
      r.points.forEach(p => { p[2] = 4.5 + (p[2] - 4.5) * .84; });
    } else if (!r.tags.structural && low > 18 && high < 23.5 && span < 2 && surfaceKind(r.fill) === 'trim') {
      r.points.forEach(p => { p[2] -= 2.8; });
    }
  }
  // In the old projection x increasing meant screen-right on a +y facade.
  // A physical camera looking toward -y sees the opposite. Reflect the source
  // plan once (and reverse winding) so left/right documentary features stay
  // on the correct side from the visitor's front view.
  for (const r of records) {
    r.points = r.points.map(p => [-p[0], p[1], p[2]]).reverse();
    if (r.tags.column) r.tags.column = [-r.tags.column[0], r.tags.column[1]];
    if (r.tags.dome) r.tags.dome = r.tags.dome.map((v, i) => i === 0 ? -v : v);
    if (r.tags.normalHint) r.tags.normalHint = [-r.tags.normalHint[0], r.tags.normalHint[1], r.tags.normalHint[2]];
  }
  records.forEach(describe);
  const windows = buildFacades(records, key);
  const acc = meshAccumulator(THREE, kit);
  for (const r of records) {
    if (key === 'constitution' && r.fill === '#3a3a3a' && r.points.length === 4) {
      const mid = (a, b) => a.map((v, i) => (v + b[i]) / 2);
      acc.tube('#353630', mid(r.points[0], r.points[1]), mid(r.points[2], r.points[3]), .10, 8, 'standing-rigging');
      continue;
    }
    if (r.normal) {
      acc.polygon(r, r.points, r.offset, r.max[2] < .4 ? 'ground' : 'surfaces');
      // Free-standing thin polygon details get physical edge thickness, so
      // weather vanes and railings no longer disappear exactly edge-on.
      if (!r.tags.structural && r.area < 60 && !r.holes.length && r.kind !== 'glass' &&
          Math.abs(r.normal[2]) < .5 && r.max[2] > 10 && !r.outward) {
        const back = r.points.map(p => add(p, r.normal, -.12));
        for (let i = 0; i < r.points.length; i++) {
          const j = (i + 1) % r.points.length;
          acc.quad(r.fill, r.points[i], r.points[j], back[j], back[i], 'detail-edges');
        }
      }
    } else if (r.points.length === 2 && r.edge) {
      acc.tube(r.edge, r.points[0], r.points[1], Math.min(.08, Math.max(.025, (r.width || .3) * .12)), 6);
    }
  }
  for (const w of windows) addWindowDetail(acc, w, key);
  signatureDetails(acc, key, records);
  const group = acc.finish(); group.name = `boston-${key}`;
  const bounds = new THREE.Box3();
  for (const r of records) if (r.max[2] > .4) for (const p of r.points) bounds.expandByPoint(new THREE.Vector3(...threePoint(p)));
  // Signature meshes include the replaced pine cone and grasshopper.
  for (const mesh of group.children) if (mesh.name !== 'ground') bounds.union(mesh.geometry.boundingBox);
  const size = bounds.getSize(new THREE.Vector3()), center = bounds.getCenter(new THREE.Vector3());
  const distance = Math.max(size.x, size.y, size.z) * 1.7;
  const target = [center.x, Math.min(center.y, size.y * .40), center.z];
  const front = -metadata.front;
  const views = [
    { id: 'street', label: 'Street view', position: [center.x - distance * .75, size.y * .62, center.z + distance * front], target },
    { id: 'opposite', label: 'Other side', position: [center.x + distance * .85, size.y * .6, center.z - distance * front], target },
    { id: 'roof', label: 'Above', position: [center.x - distance * .6, distance * .95, center.z + distance * front * .5], target }
  ];
  if (key === 'constitution') views.push({
    id: 'stern', label: 'Stern details', position: [155, 43, -58], target: [101, 21, 0],
    bounds: new THREE.Box3(new THREE.Vector3(87, 8, -18), new THREE.Vector3(109, 35, 18))
  });
  group.userData = { physicalBoston: true, sourcePolygonCount: records.length, recessedOpenings: windows.length,
    mergedMeshCount: group.children.length, units: 'feet', bounds: { min: bounds.min.toArray(), max: bounds.max.toArray() } };
  return { group, views, title: metadata.title, notes: metadata.notes, sources: metadata.sources, bounds };
}
