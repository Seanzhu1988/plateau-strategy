/**
 * One World Trade Center and Reflecting Absence. Private architectural study.
 * Genuine, inspectable Three.js geometry, feet, Y up. No external assets.
 * Primary source ledger and deliberately unmeasured details:
 * audits/wtc-model-sources.md. This is NOT an as-built survey or a name finder.
 * MODEL_STANDARD_EXEMPT: 4 The memorial is a cut into the ground, with no roof.
 * The tower really has a flat, diamond-plan parapet and cable-stayed mast.
 */
export function buildWorldTradeCenter(THREE, kit = {}) {
  const group = new THREE.Group();
  group.name = 'One World Trade Center and 9/11 Memorial';
  const tower = new THREE.Group();
  tower.name = 'One World Trade Center, eight planar triangular facets';
  tower.position.set(-145, 0, -300);
  group.add(tower);

  const D = Object.freeze({ base: 200, podium: 186, roof: 1368, tip: 1776,
    roofSide: 150, glassWidth: 5, glassHeight: 40 / 3,
    poolOuter: 192, waterTable: 8, waterTop: 2, firstDrop: 30, secondDrop: 20 });
  const pools = [{ x: -105, z: -20, name: 'North Pool' },
    { x: 85, z: 240, name: 'South Pool' }];
  const rough = new THREE.MeshStandardMaterial({ color: 0xa6a8a4, roughness: 0.88 });
  const granite = new THREE.MeshStandardMaterial({ color: 0x333936, roughness: 0.76 });
  const bronze = new THREE.MeshStandardMaterial({ color: 0x514839, metalness: 0.74, roughness: 0.43 });
  const metal = new THREE.MeshStandardMaterial({ color: 0x8c999d, metalness: 0.85, roughness: 0.28 });
  const darkMetal = new THREE.MeshStandardMaterial({ color: 0x33464b, metalness: 0.65, roughness: 0.38 });
  const podiumBack = new THREE.MeshStandardMaterial({ color: 0x738c97, metalness: 0.45, roughness: 0.38 });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, vertexColors: true,
    metalness: 0.36, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.10 });
  const lobbyGlass = new THREE.MeshPhysicalMaterial({ color: 0x66818a,
    metalness: 0.26, roughness: 0.12, clearcoat: 1, side: THREE.DoubleSide });
  const water = new THREE.MeshPhysicalMaterial({ color: 0x172d2b,
    metalness: 0, roughness: 0.30, clearcoat: 0.12, ior: 1.333,
    specularIntensity: 0.6, envMapIntensity: 0.65 });

  const v3 = p => new THREE.Vector3(...p);
  const boxGeo = new THREE.BoxGeometry(1, 1, 1);
  const dummy = new THREE.Object3D();
  const buckets = new Map();
  const rodBuckets = new Map();
  function instanceBox(parent, material, position, scale, ry = 0, rx = 0) {
    let byParent = buckets.get(parent);
    if (!byParent) { byParent = new Map(); buckets.set(parent, byParent); }
    let row = byParent.get(material);
    if (!row) { row = []; byParent.set(material, row); }
    row.push({ position, scale, ry, rx });
  }
  function box(parent, material, x, y, z, w, h, d, ry = 0, rx = 0) {
    instanceBox(parent, material, [x, y, z], [w, h, d], ry, rx);
  }
  function rod(parent, a, b, r, material, segments = 8) {
    const av = v3(a), bv = v3(b), delta = bv.clone().sub(av);
    let byMaterial = rodBuckets.get(parent);
    if (!byMaterial) { byMaterial = new Map(); rodBuckets.set(parent, byMaterial); }
    let bySegments = byMaterial.get(material);
    if (!bySegments) { bySegments = new Map(); byMaterial.set(material, bySegments); }
    let members = bySegments.get(segments);
    if (!members) { members = []; bySegments.set(segments, members); }
    const length = delta.length();
    members.push({ position: av.add(bv).multiplyScalar(0.5), radius: r, length,
      quaternion: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize()) });
  }
  function ring(parent, radius, tube, y, material) {
    const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 5, 64), material);
    mesh.rotation.x = Math.PI / 2; mesh.position.y = y;
    mesh.castShadow = true; parent.add(mesh); return mesh;
  }
  function meshData(parent, vertices, material, colors, name, uv) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    if (colors) geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    if (uv) geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.computeVertexNormals(); geo.computeBoundingSphere();
    const mesh = new THREE.Mesh(geo, material);
    mesh.name = name; mesh.castShadow = true; mesh.receiveShadow = true;
    parent.add(mesh); return mesh;
  }
  function quad(out, a, b, c, d) { out.push(...a, ...b, ...c, ...a, ...c, ...d); }
  function noise(x, y = 0, z = 0) {
    const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
    return n - Math.floor(n);
  }
  function dataTexture(width, height, pixel, repeat = [1, 1]) {
    const data = new Uint8Array(width * height * 4);
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const p = pixel(x, y), i = (y * width + x) * 4;
      data[i] = p[0]; data[i + 1] = p[1]; data[i + 2] = p[2]; data[i + 3] = p[3] ?? 255;
    }
    const t = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat);
    t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter;
    t.generateMipmaps = true; t.needsUpdate = true;
    return t;
  }

  // PWP's published 12 x 60 inch paving modules, with fine stone grain.
  const paverMap = dataTexture(256, 256, (x, y) => {
    const joint = x % 128 < 3 || y % 26 < 3;
    const grain = noise(x, y) * 11;
    const panel = (Math.floor(x / 128) + Math.floor(y / 26)) % 3;
    const n = joint ? 100 : 183 + grain + panel * 4;
    return [n, n + 1, n - 3];
  });
  paverMap.colorSpace = THREE.SRGBColorSpace;
  paverMap.anisotropy = 8;
  const paving = new THREE.MeshStandardMaterial({ color: 0xc6c9c0, map: paverMap,
    bumpMap: paverMap, bumpScale: 0.025, roughness: 0.93 });
  const stoneGrain = dataTexture(128, 128, (x, y) => {
    const n = 95 + noise(x, y) * 34; return [n, n, n];
  }, [8, 8]);
  granite.bumpMap = stoneGrain; granite.bumpScale = 0.05;
  const rippleMap = dataTexture(128, 128, (x, y) => {
    const n = 118 + Math.sin(x * 0.38 + Math.sin(y * 0.17) * 7) * 16
      + Math.sin(y * .47 + Math.sin(x * .09) * 4) * 17 + noise(x, y) * 24;
    return [n, n, n];
  }, [14, 14]);
  water.bumpMap = rippleMap; water.bumpScale = 0.32;

  // A perforated solid, not a flat plane painted beneath the waterfalls.
  const plazaShape = new THREE.Shape();
  plazaShape.moveTo(-355, -510); plazaShape.lineTo(355, -510);
  plazaShape.lineTo(355, 510); plazaShape.lineTo(-355, 510); plazaShape.closePath();
  for (const p of pools) {
    const h = 99.8, hole = new THREE.Path();
    hole.moveTo(p.x - h, -p.z - h); hole.lineTo(p.x - h, -p.z + h);
    hole.lineTo(p.x + h, -p.z + h); hole.lineTo(p.x + h, -p.z - h); hole.closePath();
    plazaShape.holes.push(hole);
  }
  const plazaGeo = new THREE.ExtrudeGeometry(plazaShape, { depth: 65, bevelEnabled: false, steps: 1 });
  plazaGeo.translate(0, 0, -65); plazaGeo.rotateX(-Math.PI / 2);
  const puv = plazaGeo.getAttribute('uv');
  for (let i = 0; i < puv.count; i++) puv.setXY(i, puv.getX(i) / 10, puv.getY(i) / 10);
  const plaza = new THREE.Mesh(plazaGeo, [paving, rough]);
  plaza.name = 'Paved plaza with two actual recessed openings';
  plaza.receiveShadow = true; group.add(plaza);

  // Four recessed 60 ft entry portals. Fine subdivision is interpretive, not an as-built schedule.
  box(tower, granite, 0, 1, 0, 204, 2, 204);
  box(tower, podiumBack, 0, 94, 0, 198, 184, 198);
  for (let side = 0; side < 4; side++) {
    const wall = new THREE.Group(); wall.rotation.y = side * Math.PI / 2;
    wall.name = `Podium facade ${side + 1}`; tower.add(wall);
    box(wall, granite, 0, 1.9, 102, 200, 1.6, 6);
    box(wall, lobbyGlass, 0, 30, 100.01, 44, 58, 0.28);
    box(wall, metal, -24, 30, 101.3, 3.2, 60, 2.5);
    box(wall, metal, 24, 30, 101.3, 3.2, 60, 2.5);
    box(wall, metal, 0, 59, 101.3, 51, 2, 2.5);
    box(wall, lobbyGlass, 0, 18, 107, 47, 0.9, 12);
    for (let x = -20; x <= 20; x += 5) box(wall, metal, x, 29, 100.3, 0.2, 57, 0.3);
    for (let y = 8; y < 59; y += 8) box(wall, metal, 0, y, 100.3, 43, 0.16, 0.3);
    for (let x = -15; x <= 15; x += 10) {
      box(wall, darkMetal, x, 5, 101.1, 8.2, 10, 0.25);
      box(wall, metal, x, 5, 101.3, 0.16, 10, 0.24);
    }
    // Alternating fins turn light into a fine crystalline fabric on the fortified base.
    for (let y = 8; y < 184; y += 13) for (let x = -97.5; x <= 98; x += 2.5) {
      if (Math.abs(x) < 27 && y < 65) continue;
      box(wall, metal, x, y, 100.6, 0.23, 12.7, 2.0, Math.sin(y * 0.07) * 0.35);
    }
    for (let y = 3; y <= 184; y += 6.5) {
      if (y < 62) {
        box(wall, metal, -63, y, 100.4, 74, 0.48, 0.3);
        box(wall, metal, 63, y, 100.4, 74, 0.48, 0.3);
      } else box(wall, metal, 0, y, 100.4, 200, 0.48, 0.3);
    }
    box(wall, metal, 0, 185.5, 100, 200, 1, 1.4);
  }

  // The silhouette is a convex hull of square base + diamond roof, NOT a twisting prism.
  const base = [[-100, D.podium, -100], [100, D.podium, -100],
    [100, D.podium, 100], [-100, D.podium, 100]];
  const q = D.roofSide / Math.sqrt(2);
  const roof = [[0, D.roof, -q], [q, D.roof, 0], [0, D.roof, q], [-q, D.roof, 0]];
  const facadeVertices = [], facadeColors = [], mullionVertices = [];
  let glassPanels = 0;
  const palette = [0x7299aa, 0x648897, 0x84a9b9, 0x7598a5,
    0x789ba9, 0x668a9c, 0x88abb8, 0x7196a6].map(c => new THREE.Color(c));

  function clip(poly, axis, limit, greater) {
    const out = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length];
      const ina = greater ? a[axis] >= limit : a[axis] <= limit;
      const inb = greater ? b[axis] >= limit : b[axis] <= limit;
      if (ina) out.push(a);
      if (ina !== inb) { const t = (limit - a[axis]) / (b[axis] - a[axis]);
        out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
    }
    return out;
  }
  function facade(a0, b0, c0, index) {
    // For an upright triangle the horizontal base is AB. For an inverted triangle
    // the horizontal top is AB. Coordinates remain planar under vertical cuts.
    const A = v3(a0), B = v3(b0), C = v3(c0), U = B.clone().sub(A).normalize();
    const width = A.distanceTo(B), apexU = C.clone().sub(A).dot(U), apexY = C.y - A.y;
    const V = C.clone().sub(A).addScaledVector(U, -apexU).divideScalar(apexY);
    const normal = U.clone().cross(V).normalize();
    const mid = A.clone().add(B).add(C).multiplyScalar(1 / 3);
    if (normal.x * mid.x + normal.z * mid.z < 0) normal.negate();
    const tri = [[0, A.y], [width, A.y], [apexU, C.y]];
    const point = p => A.clone().addScaledVector(U, p[0]).addScaledVector(V, p[1] - A.y);
    for (let y = D.podium; y < D.roof - 0.01; y += D.glassHeight) {
      for (let u = 0; u < width - 0.01; u += D.glassWidth) {
        let poly = tri;
        for (const [axis, bound, greater] of [[0, u, true], [0, u + D.glassWidth, false],
          [1, y, true], [1, Math.min(y + D.glassHeight, D.roof), false]]) poly = clip(poly, axis, bound, greater);
        if (poly.length < 3) continue;
        const points = poly.map(point);
        const area = points[1].clone().sub(points[0]).cross(points[2].clone().sub(points[0])).length();
        if (area < 0.001) continue;
        const shade = palette[index].clone().multiplyScalar(0.95 + noise(u, y, index) * 0.10);
        const inward = points[1].clone().sub(points[0]).cross(points[2].clone().sub(points[0])).dot(normal) < 0;
        if (inward) points.reverse();
        for (let j = 1; j < points.length - 1; j++) {
          for (const p of [points[0], points[j], points[j + 1]]) {
            facadeVertices.push(...p.toArray()); facadeColors.push(shade.r, shade.g, shade.b);
          }
        }
        // Slender true geometry rather than raster-painted windows or screen-space outlines.
        for (let j = 0; j < points.length; j++) {
          const p0 = points[j], p1 = points[(j + 1) % points.length];
          if (p0.distanceToSquared(p1) < 0.01) continue;
          const direction = p1.clone().sub(p0).normalize();
          const edgeWidth = normal.clone().cross(direction).multiplyScalar(0.075);
          const offset = normal.clone().multiplyScalar(0.045);
          quad(mullionVertices, p0.clone().add(edgeWidth).add(offset).toArray(),
            p1.clone().add(edgeWidth).add(offset).toArray(), p1.clone().sub(edgeWidth).add(offset).toArray(),
            p0.clone().sub(edgeWidth).add(offset).toArray());
        }
        glassPanels++;
      }
    }
    for (const [a, b] of [[A, B], [B, C], [C, A]]) rod(tower, a.toArray(), b.toArray(), 0.32, metal);
  }
  for (let i = 0; i < 4; i++) {
    facade(base[i], base[(i + 1) % 4], roof[i], i * 2);
    facade(roof[i], roof[(i + 1) % 4], base[(i + 1) % 4], i * 2 + 1);
  }
  meshData(tower, facadeVertices, glass, facadeColors, 'Individually subdivided curtain-wall glass');
  const mullionMaterial = metal.clone(); mullionMaterial.side = THREE.DoubleSide;
  meshData(tower, mullionVertices, mullionMaterial, null, 'Curtain-wall mullion mesh');

  // Roof parapet follows the real rotated square. Ring/platform dimensions are visual-study details.
  box(tower, darkMetal, 0, D.roof - 4, 0, 146, 1.5, 146, Math.PI / 4);
  const roofLip = [];
  for (let i = 0; i < 4; i++) {
    const a = roof[i], b = roof[(i + 1) % 4];
    rod(tower, a, b, 0.45, metal);
    quad(roofLip, a, b, [b[0], b[1] - 7, b[2]], [a[0], a[1] - 7, a[2]]);
  }
  meshData(tower, roofLip, lobbyGlass, null, 'Glass parapet crown');
  for (const [y, r] of [[1369, 62], [1385, 62], [1401, 57]]) {
    ring(tower, r, 1.2, y, metal); ring(tower, r - 4, 0.6, y, darkMetal);
    for (let i = 0; i < 24; i++) {
      const a = i * Math.PI / 12;
      rod(tower, [r * Math.cos(a), y, r * Math.sin(a)],
        [(r - 4) * Math.cos(a), y, (r - 4) * Math.sin(a)], 0.32, metal, 5);
    }
  }
  for (let i = 0; i < 16; i++) {
    const a = i * Math.PI / 8;
    rod(tower, [62 * Math.cos(a), 1369, 62 * Math.sin(a)],
      [57 * Math.cos(a), 1401, 57 * Math.sin(a)], 0.55, metal);
  }
  const spireSegments = [[1364, 1450, 7.4, 7.2], [1450, 1540, 7.2, 6.3],
    [1540, 1625, 6.3, 4.7], [1625, 1694, 4.7, 2.9], [1694, 1748, 2.9, 1.45], [1748, 1776, 1.45, 0.12]];
  for (const [y0, y1, r0, r1] of spireSegments) {
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(r1, r0, y1 - y0, 12), metal);
    shaft.position.y = (y0 + y1) / 2; shaft.castShadow = true; tower.add(shaft);
    for (let y = y0 + 9; y < y1; y += 12) ring(tower, r0 + 0.55, 0.28, y, darkMetal);
  }
  for (let i = 0; i < 4; i++) {
    const a = Math.PI / 4 + i * Math.PI / 2;
    rod(tower, [61 * Math.cos(a), 1386, 61 * Math.sin(a)], [0, 1562, 0], 0.42, metal, 5);
  }

  const cascadeMap = dataTexture(256, 128, (x, y) => {
    const streak = Math.pow(noise(x, 0), 2) * 0.8 + noise(Math.floor(x / 3), 0) * 0.2;
    const wave = Math.sin(y * 0.19 + x * 0.82) * 0.14;
    const mist = Math.pow(noise(Math.floor(x / 2), Math.floor(y / 4)), 3) * 70;
    const n = Math.min(255, 57 + (streak + wave) * 155 + noise(x, y) * 34 + mist);
    return [n * 0.86, n, n * 1.04];
  }, [10, 2]);
  cascadeMap.colorSpace = THREE.SRGBColorSpace;
  const cascade = new THREE.MeshStandardMaterial({ color: 0x9eb6b4, map: cascadeMap,
    roughness: 0.50, metalness: 0, side: THREE.DoubleSide, bumpMap: cascadeMap, bumpScale: 0.18 });
  const foamMaterial = new THREE.MeshStandardMaterial({ color: 0xb5c4be, roughness: 0.84 });

  for (const p of pools) {
    const pool = new THREE.Group(); pool.position.set(p.x, 0, p.z); pool.name = p.name;
    group.add(pool);
    const inner = (D.poolOuter - 2 * D.waterTable) / 2;
    const pit = 22; // Unmeasured visual-study width, deliberately NOT shown as a sourced dimension.
    const lower = D.waterTop - D.firstDrop, deepest = lower - D.secondDrop;
    // Four independent slabs leave the central shaft genuinely empty.
    for (let i = 0; i < 4; i++) {
      const edge = new THREE.Group(); edge.rotation.y = i * Math.PI / 2; pool.add(edge);
      box(edge, granite, 0, 0.5, 92, 192, 3, 8);
      box(edge, water, 0, D.waterTop, 92, 176, 0.12, 8);
      box(edge, granite, 0, (D.waterTop + lower) / 2, 89.15, 176, 30, 2);
      const shelfWidth = i % 2 === 0 ? inner * 2 : pit * 2;
      box(edge, granite, 0, lower - 0.8, (inner + pit) / 2, shelfWidth, 1.4, inner - pit);
      // This ring never overlaps the opening, even at a shallow camera angle.
      box(edge, water, 0, lower + 0.05, (inner + pit) / 2, shelfWidth, 0.10, inner - pit);
      box(edge, granite, 0, (lower + deepest) / 2, pit + 0.65, pit * 2, 20, 1.3);
      // Bronze reading surfaces, not fictitious victim-name textures.
      for (let n = 0; n < 19; n++) {
        box(edge, bronze, -96 + (n + 0.5) * (192 / 19), 3.03, 97.2,
          192 / 19 - 0.045, 0.24, 4.25, 0, -0.14);
      }
      box(edge, darkMetal, 0, 1.15, 98.8, 194, 2.3, 0.6);
      const falls = [], uv = [];
      quad(falls, [-inner, D.waterTop, inner - 0.10], [inner, D.waterTop, inner - 0.10],
        [inner, lower + 0.1, inner - 0.10], [-inner, lower + 0.1, inner - 0.10]);
      uv.push(0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1);
      const fall = meshData(edge, falls, cascade, null, 'Thirty-foot waterfall curtain', uv);
      fall.castShadow = false;
      const second = [];
      quad(second, [-pit, lower, pit - 0.12], [pit, lower, pit - 0.12],
        [pit, deepest, pit - 0.12], [-pit, deepest, pit - 0.12]);
      const drop = meshData(edge, second, cascade, null, 'Twenty-foot central drop', uv);
      drop.castShadow = false;
      // A low, irregular foam edge gives the first impact real scale.
      for (let n = 0; n < 88; n++) {
        const x = -87 + n * 2;
        box(edge, foamMaterial, x, lower + 0.14, inner - 1.1 - noise(n, i) * 0.75,
          1.8, 0.12, 0.7 + noise(n, i + 1) * 1.6);
      }
    }
    // The visible dark floor is at the foot of the second drop, never on top of it.
    const abyss = new THREE.MeshStandardMaterial({ color: 0x080f10, roughness: 1 });
    box(pool, abyss, 0, deepest - 0.2, 0, pit * 2, 0.25, pit * 2);
    pool.userData = { firstDropFeet: 30, secondDropFeet: 20,
      inscriptions: 'Omitted. No invented names.', centralWidth: 'Visual-study approximation' };
  }

  // Grove: actual branch silhouettes and clustered leaf geometry, not sphere-on-stick icons.
  // Locations and present-day tree sizes are interpretive; this is not an inventory of the 400 trees.
  const bark = new THREE.MeshStandardMaterial({ color: 0x534c3c, roughness: 1 });
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x34612d, vertexColors: true,
    roughness: 0.92, side: THREE.DoubleSide });
  const leafGeo = new THREE.IcosahedronGeometry(1, 1);
  const leafPos = leafGeo.getAttribute('position'), leafColors = [];
  for (let i = 0; i < leafPos.count; i++) {
    const c = new THREE.Color().setHSL(0.245 + noise(i) * 0.035, 0.26, 0.22 + noise(i, 1) * 0.095);
    leafColors.push(c.r, c.g, c.b);
  }
  leafGeo.setAttribute('color', new THREE.Float32BufferAttribute(leafColors, 3));
  const treePositions = [];
  for (let row = 0; row < 25; row++) for (let col = 0; col < 18; col++) {
    const x = -309 + col * 36, z = -198 + row * 27;
    if (z > 468 || Math.abs(x) > 318) continue;
    if (pools.some(p => Math.abs(x - p.x) < 122 && Math.abs(z - p.z) < 122)) continue;
    // Fulton Street connects the tower forecourt; leave a clear east-west corridor.
    if (z < -145 || (x > -40 && x < 68 && z > 82 && z < 126)) continue;
    treePositions.push([x, z]);
  }
  const foliage = new THREE.InstancedMesh(leafGeo, leafMat, treePositions.length * 12);
  foliage.name = 'Interpretive swamp-white-oak grove, instanced leaf clusters';
  foliage.castShadow = true; foliage.receiveShadow = true; group.add(foliage);
  let crownIndex = 0;
  for (let i = 0; i < treePositions.length; i++) {
    const [x, z] = treePositions[i], h = 31 + noise(i, 1) * 13;
    box(group, granite, x, 0.10, z, 7.2, 0.18, 7.2);
    rod(group, [x, 0.2, z], [x + 0.45, h * 0.66, z], 0.62, bark, 6);
    for (let b = 0; b < 3; b++) {
      const a = b * Math.PI * 2 / 3 + noise(i) * 4;
      rod(group, [x, h * 0.43, z], [x + Math.cos(a) * 4.5, h * 0.86, z + Math.sin(a) * 4.5], 0.28, bark, 5);
    }
    for (let c = 0; c < 12; c++) {
      const a = c * Math.PI / 3 + noise(i, c), radius = c < 6 ? 6.2 : 3.5;
      dummy.position.set(x + Math.cos(a) * radius, h - 7 + noise(i, c + 1) * 8, z + Math.sin(a) * radius);
      dummy.rotation.set(noise(i, c), a, 0.15);
      dummy.scale.set(3.3 + noise(i, c) * 1.9, 3.0 + noise(i, c + 3) * 1.8, 3.4 + noise(i, c + 2) * 1.8);
      dummy.updateMatrix(); foliage.setMatrixAt(crownIndex++, dummy.matrix);
    }
  }
  foliage.instanceMatrix.needsUpdate = true;

  // Flush plaza furnishing and simple benches, all kept subordinate to the actual landmarks.
  const bench = new THREE.MeshStandardMaterial({ color: 0x807c70, roughness: 0.82 });
  for (let i = 0; i < 10; i++) {
    const x = -270 + i * 54, z = 444;
    box(group, bench, x, 1.6, z, 14, 0.8, 2.8);
    box(group, darkMetal, x - 5, 0.6, z, 0.7, 1.2, 2.2);
    box(group, darkMetal, x + 5, 0.6, z, 0.7, 1.2, 2.2);
  }

  // Batch repeated elements. These transforms deliberately remain local to their own wall/pool.
  let instanceCount = 0;
  for (const [parent, byMaterial] of buckets) for (const [material, items] of byMaterial) {
    const mesh = new THREE.InstancedMesh(boxGeo, material, items.length);
    mesh.name = 'Batched architectural members'; mesh.castShadow = true; mesh.receiveShadow = true;
    // These sub-foot fins cannot resolve their own shadow texels in a whole-tower view.
    // The solid podium supplies the real building shadow without speckled self-shadow aliasing.
    if (parent.name.startsWith('Podium facade') && material === metal) {
      mesh.castShadow = false; mesh.receiveShadow = false;
    }
    if (material === podiumBack) mesh.receiveShadow = false;
    items.forEach((item, i) => {
      dummy.position.set(...item.position); dummy.rotation.set(item.rx, item.ry, 0);
      dummy.scale.set(...item.scale); dummy.updateMatrix(); mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true; mesh.computeBoundingSphere(); parent.add(mesh);
    instanceCount += items.length;
  }
  for (const [parent, byMaterial] of rodBuckets) for (const [material, bySegments] of byMaterial) {
    for (const [segments, items] of bySegments) {
      const geo = new THREE.CylinderGeometry(1, 1, 1, segments);
      const mesh = new THREE.InstancedMesh(geo, material, items.length);
      mesh.name = 'Batched cylindrical members'; mesh.castShadow = true; mesh.receiveShadow = true;
      items.forEach((item, i) => {
        dummy.position.copy(item.position); dummy.quaternion.copy(item.quaternion);
        dummy.scale.set(item.radius, item.length, item.radius); dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true; mesh.computeBoundingSphere(); parent.add(mesh);
      instanceCount += items.length;
    }
  }
  group.userData = { units: 'feet', landmarkStandard: 'Private preview, independent review pending',
    surveyAccuracy: false, sourcedDimensions: D, towerFacets: 8,
    displayGroundBelowFeet: -66, sourceLedger: 'audits/wtc-model-sources.md' };
  return {
    group,
    title: 'One World Trade Center and the 9/11 Memorial',
    notes: [
      'A real 3D architectural study. The tower reaches 1,776 feet, with eight planar glass facets and a 45-degree rotated roof.',
      'The memorial has two recessed pools, each with a 30-foot waterfall and a further 20-foot central drop. No invented names are used.',
      'Landscape placement, fine facade divisions and unsourced small details are interpretive. Surrounding buildings and name inscriptions are not reproduced. This is not an as-built survey.'
    ],
    views: [
      { id: 'skyline', label: 'Whole tower', position: [2110, 1175, 2520], target: [-110, 790, -240] },
      { id: 'facade', label: 'Glass and spire', position: [340, 1320, 470], target: [-145, 1230, -300] },
      { id: 'memorial', label: 'Memorial pools', position: [395, 320, 625], target: [-5, -4, 115] },
      { id: 'waterfall', label: 'Waterfall detail', position: [-11, 55, 116], target: [-105, -16, -20] },
      { id: 'plaza', label: 'Above the plaza', position: [10, 1010, 390], target: [-15, -4, 75] }
    ],
    sources: [
      { label: 'SOM, One World Trade Center', url: 'https://www.som.com/projects/one-world-trade-center/' },
      { label: 'WSP, One World Trade Center', url: 'https://www.wsp.com/en-us/projects/one-world-trade-center' },
      { label: '9/11 Memorial, design and water depths', url: 'https://www.911memorial.org/visit/memorial/about-memorial' },
      { label: 'Handel Architects, Reflecting Absence', url: 'https://handelarchitects.com/project/national-september-11-memorial' },
      { label: 'PWP, landscape and paving', url: 'https://www.pwpla.com/national-911-memorial/landscape-design' }
    ],
    stats: { towerFacets: 8, glassPanels, instances: instanceCount, treeRepresentations: treePositions.length,
      towerHeightFeet: D.tip, parapetHeightFeet: D.roof, poolCount: pools.length },
    animate(seconds) { cascadeMap.offset.y = -(seconds * 0.11) % 1; }
  };
}
