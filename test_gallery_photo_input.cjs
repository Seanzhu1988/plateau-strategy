const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(__dirname + '/gallery-photo-input.js', 'utf8');
class TestFile extends Blob {
  constructor(parts, name, options) { super(parts, options); this.name = name; }
}
function jpeg(width = 4032, height = 3024, exifOrientation = 1) {
  const bytes = Buffer.alloc(51);
  bytes.set([255,216,255,225,0,34]); bytes.write('Exif\0\0', 6, 'binary');
  bytes.write('II', 12); bytes.writeUInt16LE(42,14); bytes.writeUInt32LE(8,16);
  bytes.writeUInt16LE(1,20); bytes.writeUInt16LE(274,22); bytes.writeUInt16LE(3,24);
  bytes.writeUInt32LE(1,26); bytes.writeUInt16LE(exifOrientation,30);
  bytes.set([255,192,0,11,8],38); bytes.writeUInt16BE(height,43); bytes.writeUInt16BE(width,45);
  bytes.set([1,1,17,0],47);
  return bytes;
}
function png(width = 6000, height = 8000) {
  const bytes = Buffer.alloc(33);
  bytes.set([137,80,78,71,13,10,26,10]); bytes.writeUInt32BE(13,8); bytes.write('IHDR',12);
  bytes.writeUInt32BE(width,16); bytes.writeUInt32BE(height,20);
  return bytes;
}
function webp(kind) {
  const bytes = Buffer.alloc(30);
  bytes.write('RIFF',0); bytes.writeUInt32LE(22,4); bytes.write('WEBP',8);
  bytes.write(kind,12); bytes.writeUInt32LE(10,16);
  if (kind === 'VP8X') { bytes.writeUIntLE(4031,24,3); bytes.writeUIntLE(3023,27,3); }
  if (kind === 'VP8 ') { bytes.set([157,1,42],23); bytes.writeUInt16LE(4032,26); bytes.writeUInt16LE(3024,28); }
  if (kind === 'VP8L') { bytes[20] = 47; bytes.writeUInt32LE(4031 | (3023 << 14),21); }
  return bytes;
}
function heic(width = 4032, height = 3024) {
  const bytes = Buffer.alloc(24); bytes.writeUInt32BE(24,0); bytes.write('ftyp',4);
  bytes.write('heic',8); bytes.write('mif1',16); bytes.write('heic',20);
  function box(name, payload) { const header = Buffer.alloc(8); header.writeUInt32BE(8 + payload.length,0); header.write(name,4); return Buffer.concat([header,payload]); }
  const dimensions = Buffer.alloc(12); dimensions.writeUInt32BE(width,4); dimensions.writeUInt32BE(height,8);
  return Buffer.concat([bytes, box('meta',Buffer.concat([Buffer.alloc(4),box('iprp',box('ipco',box('ispe',dimensions)))]))]);
}
const tick = () => new Promise(resolve => setImmediate(resolve));
function setup(options = {}) {
  const state = {bitmaps: [], draws: [], fills: [], encodes: [], urls: [], revoked: [], images: [], timers: [], canvases: []};
  const ctx = {
    Blob, File: options.noFile ? undefined : TestFile, Uint8Array, DataView, AbortController,
    setTimeout(callback, delay) { state.timers.push({callback, delay}); return setTimeout(callback, delay); },
    clearTimeout,
    URL: {createObjectURL() { const value = 'blob:local-' + state.urls.length; state.urls.push(value); return value; }, revokeObjectURL(value) { state.revoked.push(value); }},
    Image: class {
      constructor() { state.images.push(this); this.naturalWidth = options.imageWidth || 3024; this.naturalHeight = options.imageHeight || 4032; }
      set src(value) { this._src = value; if (!options.imageNeverFinishes) queueMicrotask(() => { if (options.imageFails) this.onerror?.(); else this.onload?.(); }); }
      removeAttribute(name) { assert.equal(name, 'src'); this._src = ''; this.released = true; }
    },
    document: {createElement(name) {
      assert.equal(name, 'canvas');
      const context = {fillRect(...args) { state.fills.push(args); }, drawImage(...args) { state.draws.push(args); }};
      const canvas = {width: 0, height: 0, getContext(kind, config) { state.contextConfig = config; return options.noContext ? null : context; },
        toBlob(callback, type, quality) {
          state.encodes.push({width: this.width, height: this.height, type, quality});
          if (options.encodeNeverFinishes) return;
          const size = options.largeUntilQuality && quality > options.largeUntilQuality ? 6 * 1024 * 1024 : 40;
          callback(options.nullBlob ? null : new Blob([new Uint8Array(size)], {type: options.outputType || type}));
        }};
      state.canvases.push(canvas); return canvas;
    }}
  };
  if (!options.noBitmap) ctx.createImageBitmap = async (file, settings) => {
    state.bitmapOptions = settings; state.bitmapInput = file;
    if (options.bitmapFails) throw new Error('native decoder unavailable');
    if (options.bitmapPromise) return options.bitmapPromise;
    const bitmap = {width: options.bitmapWidth || 1440, height: options.bitmapHeight || 1920, closed: false, close() { this.closed = true; }};
    state.bitmaps.push(bitmap); return bitmap;
  };
  vm.createContext(ctx); vm.runInContext(source, ctx);
  return {prepare: ctx.PSXGalleryPhoto.prepare, state, ctx};
}
function file(bytes = jpeg(), type = 'image/jpeg') { return new TestFile([bytes], 'private-location-original.jpg', {type}); }
function reason(code) { return error => { assert.equal(error.code, code); assert.equal(error.reason, code); return true; }; }

test('normalizes a 48 MP phone photo to a bounded metadata-free JPEG File', async () => {
  const {prepare, state} = setup();
  const original = file(png(), 'image/png'); const result = await prepare(original);
  assert.ok(result instanceof TestFile); assert.equal(result.name, 'gallery-photo.jpg');
  assert.equal(result.type, 'image/jpeg'); assert.ok(result.size < 6 * 1024 * 1024);
  assert.notEqual(result, original); assert.equal(state.bitmapOptions.resizeHeight, 1920);
  assert.equal(state.bitmapOptions.imageOrientation, 'from-image');
  assert.equal(state.contextConfig.alpha, false); assert.equal(state.fills.length, 1);
  assert.deepEqual(state.encodes[0], {width: 1440, height: 1920, type: 'image/jpeg', quality: 0.88});
  assert.ok(state.bitmaps.every(bitmap => bitmap.closed));
  assert.equal(state.canvases[0].width, 0); assert.equal(state.canvases[0].height, 0);
  assert.notDeepEqual(Buffer.from(await result.arrayBuffer()), Buffer.from(await original.arrayBuffer()));
});
test('EXIF rotation selects the oriented long edge without stretching portrait images', async () => {
  for (const orientation of [5,6,7,8]) {
    const {prepare, state} = setup(); await prepare(file(jpeg(4032,3024,orientation)));
    assert.equal(state.bitmapOptions.resizeHeight, 1920); assert.equal(state.bitmapOptions.resizeWidth, undefined);
  }
  const {prepare, state} = setup(); await prepare(file(jpeg(4032,3024,1)));
  assert.equal(state.bitmapOptions.resizeWidth, 1920);
});
test('accepts empty MIME only after checking a real photo signature', async () => {
  const {prepare} = setup(); assert.equal((await prepare(file(jpeg(), ''))).type, 'image/jpeg');
  await assert.rejects(prepare(file(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>'), '')), reason('unsupported_format'));
});
test('supports each WebP dimension encoding before native decoding', async () => {
  for (const kind of ['VP8X','VP8 ','VP8L']) {
    const {prepare, state} = setup(); await prepare(file(webp(kind), 'image/webp'));
    assert.equal(state.bitmapOptions.resizeWidth, 1920);
  }
});
test('blocks SVG, HTML, GIF and spoofed image MIME before creating any decoder', async () => {
  const {prepare, state} = setup();
  for (const [bytes, type] of [[jpeg(),'image/svg+xml'], [Buffer.from('<html>photo</html>'),'image/jpeg'], [Buffer.from('GIF89a000000000000000000000'),''], [Buffer.from('not a photograph'),'image/png']]) {
    await assert.rejects(prepare(file(bytes, type)), reason('unsupported_format'));
  }
  assert.equal(state.bitmaps.length, 0); assert.equal(state.images.length, 0);
});
test('rejects over 24 MB before reading the file', async () => {
  const {prepare} = setup();
  await assert.rejects(prepare({size: 24 * 1024 * 1024 + 1, type: 'image/jpeg', arrayBuffer() { throw Error('must not read'); }}), reason('image_too_large'));
});
test('accepts a real phone upload larger than the six MB server limit', async () => {
  const {prepare, state} = setup();
  const original = new TestFile([jpeg(),new Uint8Array(8 * 1024 * 1024)], 'camera.jpg', {type: 'image/jpeg'});
  assert.ok(original.size > 6 * 1024 * 1024);
  const result = await prepare(original); assert.ok(result.size < 6 * 1024 * 1024);
  assert.equal(state.bitmaps.length, 1);
});
test('rejects excessive dimensions before decoding compressed image bombs', async () => {
  const {prepare, state} = setup();
  await assert.rejects(prepare(file(png(10000,10000), 'image/png')), reason('image_too_large'));
  await assert.rejects(prepare(file(jpeg(16001,500))), reason('image_too_large'));
  assert.equal(state.bitmaps.length, 0);
});
test('supports native HEIC decoding but never claims to convert undecodable HEIC', async () => {
  const good = setup({bitmapFails: true});
  assert.equal((await good.prepare(file(heic(), 'image/heic'))).type, 'image/jpeg');
  assert.deepEqual(good.state.revoked, good.state.urls); assert.ok(good.state.images[0].released);
  const bad = setup({bitmapFails: true, imageFails: true});
  await assert.rejects(bad.prepare(file(heic(), 'image/heic')), reason('unsupported_format'));
  assert.deepEqual(bad.state.revoked, bad.state.urls); assert.ok(bad.state.images[0].released);
});
test('HEIC grids and all other image headers require bounded dimensions before decoding', async () => {
  const {prepare, state} = setup();
  await assert.rejects(prepare(file(heic(12000,12000), 'image/heic')), reason('image_too_large'));
  await assert.rejects(prepare(file(heic().subarray(0,24), 'image/heic')), reason('unsupported_format'));
  await assert.rejects(prepare(file(jpeg().subarray(0,38))), reason('invalid_image'));
  assert.equal(state.bitmaps.length, 0); assert.equal(state.images.length, 0);
});
test('native Image fallback draws oriented dimensions and releases its URL', async () => {
  const {prepare, state} = setup({noBitmap: true}); await prepare(file(jpeg(4032,3024,6)));
  assert.equal(state.encodes[0].width, 1440); assert.equal(state.encodes[0].height, 1920);
  assert.deepEqual(state.revoked, state.urls); assert.ok(state.images[0].released);
});
test('also checks actual decoder dimensions if a native decoder disagrees with metadata', async () => {
  const {prepare, state} = setup({bitmapWidth: 12000, bitmapHeight: 12000});
  await assert.rejects(prepare(file(heic(), 'image/heic')), reason('image_too_large'));
  assert.ok(state.bitmaps[0].closed); assert.equal(state.canvases.length, 0);
});
test('abort before reading or while decoding does not publish stale output', async () => {
  const controller = new AbortController(); controller.abort();
  await assert.rejects(setup().prepare(file(), {signal: controller.signal}), reason('cancelled'));
  let resolveBitmap;
  const second = new AbortController(), bitmap = {width: 1920, height: 1440, closed: false, close() { this.closed = true; }};
  const {prepare, state} = setup({bitmapPromise: new Promise(resolve => { resolveBitmap = resolve; })});
  const pending = prepare(file(), {signal: second.signal}); await tick(); second.abort();
  await assert.rejects(pending, reason('cancelled')); resolveBitmap(bitmap); await tick();
  assert.equal(bitmap.closed, true); assert.equal(state.draws.length, 0);
});
test('timeout is bounded and a late bitmap is closed without drawing', async () => {
  let resolveBitmap;
  const bitmap = {close() { this.closed = true; }};
  const {prepare, state} = setup({bitmapPromise: new Promise(resolve => { resolveBitmap = resolve; })});
  const pending = prepare(file()); await tick();
  assert.equal(state.timers[0].delay, 15000); state.timers[0].callback();
  await assert.rejects(pending, reason('preparation_timeout'));
  resolveBitmap(bitmap); await tick(); assert.equal(bitmap.closed, true); assert.equal(state.draws.length, 0);
});
test('cancellation clears a pending native image and revokes the object URL', async () => {
  const controller = new AbortController();
  const {prepare, state} = setup({noBitmap: true, imageNeverFinishes: true});
  const pending = prepare(file(), {signal: controller.signal}); await tick(); controller.abort();
  await assert.rejects(pending, reason('cancelled'));
  assert.ok(state.images[0].released); assert.equal(state.images[0].onload, null);
  assert.deepEqual(state.revoked, state.urls);
});
test('JPEG compression retries are finite and keep the six MB server ceiling', async () => {
  const {prepare, state} = setup({largeUntilQuality: 0.7}); await prepare(file());
  assert.deepEqual(state.encodes.map(entry => entry.quality), [0.88,0.76,0.62]);
  const oversized = setup({largeUntilQuality: 0.1});
  await assert.rejects(oversized.prepare(file()), reason('image_too_large'));
  assert.equal(oversized.state.encodes.length, 3);
});
test('unsupported JPEG export, missing canvas context and empty export fail safely', async () => {
  for (const options of [{outputType: 'image/png'}, {noContext: true}, {nullBlob: true}]) {
    const {prepare, state} = setup(options);
    await assert.rejects(prepare(file()), reason('preparation_unavailable'));
    assert.ok(state.bitmaps[0].closed); assert.equal(state.canvases[0].width, 0);
  }
});
test('the output remains a JPEG Blob in browsers without a File constructor', async () => {
  const result = await setup({noFile: true}).prepare(file());
  assert.ok(result instanceof Blob); assert.equal(result.type, 'image/jpeg');
});
