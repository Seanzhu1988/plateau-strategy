// Isolated selected-stop photo regression tests. No network, audio, or data writes.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const read = name => fs.readFileSync(path.join(__dirname, name), 'utf8');
const html = read('tour.html');
const source = html.split('// BEGIN EXACT_STOP_PHOTOS')[1].split('// END EXACT_STOP_PHOTOS')[0];

function harness() {
  const wrapper = { hidden: false, replaceChild(next, old) {
    assert.equal(this.image, old);
    old.parentNode = null; next.parentNode = this; this.image = next;
  } };
  const image = () => ({ id: 'twShowImg', onload: null, onerror: null,
    removeAttribute(name) { delete this[name]; } });
  wrapper.image = image(); wrapper.image.parentNode = wrapper;
  const document = {
    getElementById(id) { return id === 'twShow' ? wrapper : id === 'twShowImg' ? wrapper.image : null; },
    createElement(tag) { assert.equal(tag, 'img'); return image(); }
  };
  const context = vm.createContext({ document, URL });
  vm.runInContext(source, context);
  return { context, wrapper, current: () => wrapper.image,
    candidates: (stop, entry) => Array.from(context.stopPhotoCandidates(stop, entry)),
    show: (stop, entry) => context.showStopPhoto(stop, entry) };
}

test('all generic tour classic inline scripts remain valid JavaScript', () => {
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/src=|application\/ld\+json|type="module"/.test(match[1])) continue;
    assert.doesNotThrow(() => new vm.Script(match[2], { filename: 'tour.html' }));
  }
  assert.match(html, /showStopSlideshow\(s, entry\);\s+silence\(\);/);
});

test('matching entry photos take priority, with all exact stop alternatives retained', () => {
  const h = harness();
  assert.deepEqual(h.candidates({ photo: '/stop.jpg', photos: ['/stop-2.jpg'] },
    { photo: { src: '/book.jpg' }, photos: ['/book-2.jpg', { src: '/book.jpg' }] }),
  ['/book.jpg', '/book-2.jpg', '/stop.jpg', '/stop-2.jpg']);
});

test('module-failure fallback refuses unsafe and retired visitor-photo URLs from every source', () => {
  const bad = ['http://example.org/photo.jpg', 'javascript:alert(1)', '//example.org/photo.jpg',
    'https://user:pass@example.org/photo.jpg', '/photo.svg', '/photo%2esvg',
    '/api/gallery/photos/old', 'https://example.org/%2561pi%252fgallery%252fphotos/old',
    '/a/../gallery_photos/old', '/api//gallery/photos/old'];
  for (const src of bad) {
    const h = harness();
    assert.deepEqual(h.candidates({photo_details:[{src}], photo:src, photos:[src]}, {photo:src, photos:[src]}), [], src);
  }
  assert.deepEqual(harness().candidates({photos:['https://museum.example/licensed.jpg', '/public-stop.jpg']}, null),
    ['https://museum.example/licensed.jpg', '/public-stop.jpg']);
});

test('reviewed stop metadata takes priority over older entry and stop photos', () => {
  const h = harness();
  assert.deepEqual(h.candidates({ photo_details: [{ src: '/reviewed.jpg' }], photos: ['/old-stop.jpg'] },
    { photo: '/old-entry.jpg' }), ['/reviewed.jpg']);
});

test('missing or malformed entry photos fall back to stop string and object photos', () => {
  const h = harness();
  assert.deepEqual(h.candidates({ photo: '/stop.jpg' }, null), ['/stop.jpg']);
  assert.deepEqual(h.candidates({ photo: { src: '/stop.jpg' } }, {}), ['/stop.jpg']);
  assert.deepEqual(h.candidates({ photos: ['', { src: '/exact.jpg' }, '/alternate.jpg'] },
    { photo: {}, photos: [null, { src: 42 }] }), ['/exact.jpg', '/alternate.jpg']);
  assert.deepEqual(h.candidates({ photos: ['/stop.jpg'] }, { photo: '   ' }), ['/stop.jpg']);
});

test('a valid photo appears only after loading, with the exact stop name', () => {
  const h = harness();
  h.show({ name: 'Grand View Terrace', photos: [{ src: '/terrace.jpg' }] }, {});
  assert.equal(h.current().src, '/terrace.jpg');
  assert.equal(h.current().alt, 'Grand View Terrace');
  assert.equal(h.current().loading, 'eager');
  assert.equal(h.wrapper.hidden, true);
  h.current().onload();
  assert.equal(h.wrapper.hidden, false);
});

test('broken entry image tries only the exact alternatives and hides after exhaustion', () => {
  const h = harness();
  h.show({ name: 'Stop', photos: ['/stop.jpg'] }, { photo: '/book.jpg' });
  const first = h.current(), staleLoad = first.onload, staleError = first.onerror;
  first.onerror();
  assert.equal(h.current().src, '/stop.jpg');
  staleLoad(); staleError();
  assert.equal(h.current().src, '/stop.jpg');
  assert.equal(h.wrapper.hidden, true);
  h.current().onerror();
  assert.equal(h.wrapper.hidden, true);
  assert.equal(h.current().src, undefined);
  assert.equal(h.current().onerror, null);
});

test('no image clears the previous stop and late old responses cannot restore it', () => {
  const h = harness();
  h.show({ name: 'First', photo: '/first.jpg' }, {});
  const staleLoad = h.current().onload, staleError = h.current().onerror;
  h.current().onload();
  h.show({ name: 'No photo' }, {});
  staleLoad(); staleError();
  assert.equal(h.wrapper.hidden, true);
  assert.equal(h.current().src, undefined);
});

test('switching stops ignores a previous image response without disturbing the new image', () => {
  const h = harness();
  h.show({ name: 'First', photo: '/first.jpg' }, {});
  const staleLoad = h.current().onload, staleError = h.current().onerror;
  h.show({ name: 'Second', photo: '/second.jpg' }, {});
  staleError(); staleLoad();
  assert.equal(h.current().src, '/second.jpg');
  assert.equal(h.wrapper.hidden, true);
  h.current().onload();
  assert.equal(h.wrapper.hidden, false);
});

test('real Grand View Terrace stop photo resolves without a Destination Book photo', () => {
  const routes = JSON.parse(read('trails.json')).trails;
  const terrace = routes.find(t => t.id === 'mount-rushmore').stops.find(s => s.n === 2);
  const h = harness();
  const candidates = h.candidates(terrace, {});
  assert.ok(candidates.length > 0);
  assert.match(candidates[0], /Mount_Rushmore_detail_view/);
  h.show(terrace, {});
  assert.equal(h.current().src, candidates[0]);
});
