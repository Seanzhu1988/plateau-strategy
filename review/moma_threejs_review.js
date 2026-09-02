/* moma_threejs_review.js — a REVIEW scene, deliberately not shipped.
 *
 * Built 2026-08-31 in the Three.js viewer to get MoMA's massing right before
 * committing it to the site's own renderer. It is kept because two earlier
 * attempts at this building failed and the reasons are embedded in these
 * numbers: the recessed ground floor, the 76/44 split between the lower east
 * wing and the taller west block, and a footprint about twice as wide along
 * 53rd Street as it is deep. That last one is the correction that mattered,
 * because the wayfinding plan is nearly square and extruding it gives a squat
 * glass box at any height.
 *
 * WHY IT IS NOT ON THE SITE. The pages draw SVG with no library, which is why
 * the museum maps stay fast on a phone and survive a half-loaded page.
 * Three.js is a real dependency and a real download, and Sean's standing rule
 * is that the site be practical above all. So this is a design instrument:
 * get the proportions here, translate them to the SVG renderer that ships.
 * Shipping Three.js to visitors is a decision for Sean, not a side effect of
 * a tool being available.
 *
 * ONE HONEST LIMIT ON THIS FILE. Every other model built today was rendered
 * to a PNG and looked at before it was shown to anyone. This viewer draws to
 * the reader's screen and returns nothing, so this scene has never been seen
 * by the person who wrote it.
 *
 * Paste into the Three.js viewer. Globals: THREE, OrbitControls, canvas,
 * width, height.
 */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(36, width / height, 0.5, 5000);
camera.position.set(190, 88, 172);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.target.set(0, 22, 0);
controls.maxPolarAngle = Math.PI * 0.495;
controls.minDistance = 90;
controls.maxDistance = 520;

scene.add(new THREE.HemisphereLight(0xdfe8f2, 0x9c9890, 0.80));
const sun = new THREE.DirectionalLight(0xfff4e6, 1.25);
sun.position.set(140, 200, 110);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
const R = 220;
sun.shadow.camera.left = -R; sun.shadow.camera.right = R;
sun.shadow.camera.top = R; sun.shadow.camera.bottom = -R;
sun.shadow.camera.far = 700;
sun.shadow.bias = -0.0006;
scene.add(sun);

const glass = new THREE.MeshPhysicalMaterial({
  color: 0x93a9b6, metalness: 0.15, roughness: 0.06,
  transmission: 0.55, thickness: 0.8, transparent: true,
  opacity: 0.88, clearcoat: 1, clearcoatRoughness: 0.05 });
const darkGlass = new THREE.MeshPhysicalMaterial({
  color: 0x39454c, metalness: 0.25, roughness: 0.10,
  transmission: 0.35, thickness: 0.8, transparent: true, opacity: 0.92 });
const panel = new THREE.MeshStandardMaterial({ color: 0xeeece6, roughness: 0.72 });
const mull  = new THREE.MeshStandardMaterial({ color: 0x363b3f, roughness: 0.45, metalness: 0.35 });
const core  = new THREE.MeshStandardMaterial({ color: 0xdad7d0, roughness: 0.85 });
const road  = new THREE.MeshStandardMaterial({ color: 0xd9dad4, roughness: 0.96 });

function box(w, h, d, x, y, z, mat, shadow) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  if (shadow !== false) { m.castShadow = true; m.receiveShadow = true; }
  scene.add(m);
  return m;
}

const ground = new THREE.Mesh(new THREE.PlaneGeometry(1600, 1600), road);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

function glazedBlock(w, d, h, cx, cz, y0, floors, g) {
  box(w - 1.4, h, d - 1.4, cx, y0 + h / 2, cz, core);
  const fh = h / floors;
  for (let i = 0; i < floors; i++) {
    const base = y0 + i * fh;
    const sh = fh * 0.30, gh = fh * 0.64;
    box(w + 0.5, sh, d + 0.5, cx, base + sh / 2, cz, panel);
    const gy = base + sh + gh / 2;
    box(w + 0.7, gh, 0.7, cx, gy, cz - d / 2, g);
    box(w + 0.7, gh, 0.7, cx, gy, cz + d / 2, g);
    box(0.7, gh, d + 0.7, cx - w / 2, gy, cz, g);
    box(0.7, gh, d + 0.7, cx + w / 2, gy, cz, g);
  }
  const bays = Math.max(3, Math.round(w / 11));
  for (let k = 0; k <= bays; k++) {
    const mx = cx - w / 2 + (w * k) / bays;
    box(0.55, h, 1.1, mx, y0 + h / 2, cz - d / 2, mull, false);
    box(0.55, h, 1.1, mx, y0 + h / 2, cz + d / 2, mull, false);
  }
  const dbays = Math.max(2, Math.round(d / 11));
  for (let k = 0; k <= dbays; k++) {
    const mz = cz - d / 2 + (d * k) / dbays;
    box(1.1, h, 0.55, cx - w / 2, y0 + h / 2, mz, mull, false);
    box(1.1, h, 0.55, cx + w / 2, y0 + h / 2, mz, mull, false);
  }
}

const DEPTH = 58, GH = 9.5;
box(114, GH, DEPTH - 6, 0, GH / 2, 0, darkGlass);
glazedBlock(76, DEPTH, 34, 21, 0, GH, 6, glass);
glazedBlock(44, DEPTH, 52, -38, 0, GH, 9, glass);
box(78, 1.2, DEPTH + 1.5, 21, GH + 34.6, 0, core);
box(46, 1.2, DEPTH + 1.5, -38, GH + 52.6, 0, core);
box(26, 0.9, 9, 4, GH - 0.6, DEPTH / 2 - 1, panel);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
