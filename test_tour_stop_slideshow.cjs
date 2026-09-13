// Isolated component tests. No server, browser, network, audio or data writes.
// Private-directory adapter tests remain in the separate preview workspace.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const read = name => fs.readFileSync(path.join(__dirname, name), 'utf8');
const source = read('tour-stop-slideshow.js');
const ready = import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));

function environment() {
  const requests = [], document = {};
  class Element {
    constructor(tag) {
      this.tagName = tag.toUpperCase(); this.ownerDocument = document; this.children = [];
      this.parentNode = null; this.attributes = {}; this.events = {}; this.hidden = false; this.textContent = '';
      this.className = ''; this.classList = {
        add: value => { this.className = [...new Set([...this.className.split(' '), value])].filter(Boolean).join(' '); },
        remove: value => { this.className = this.className.split(' ').filter(x => x !== value).join(' '); }
      };
    }
    append(...children) { for (const child of children) { child.parentNode = this; this.children.push(child); } }
    replaceChildren(...children) { this.children.forEach(c => { c.parentNode = null; }); this.children = []; this.append(...children); }
    remove() { if (this.parentNode) this.parentNode.children = this.parentNode.children.filter(c => c !== this); this.parentNode = null; }
    setAttribute(key, value) { this.attributes[key] = String(value); }
    getAttribute(key) { return this.attributes[key] || null; }
    removeAttribute(key) { delete this.attributes[key]; if (key === 'src') this._src = undefined; }
    set src(value) { this._src = value; requests.push(value); }
    get src() { return this._src; }
    addEventListener(key, handler) { (this.events[key] ||= []).push(handler); }
    removeEventListener(key, handler) { this.events[key] = (this.events[key] || []).filter(fn => fn !== handler); }
    fire(key, values = {}) { const event = { preventDefault() { this.prevented = true; }, ...values }; (this.events[key] || []).forEach(fn => fn(event)); return event; }
    all() { return this.children.flatMap(c => [c, ...c.all()]); }
    querySelector(selector) { return this.all().find(el => selector.startsWith('.') ? el.className.split(' ').includes(selector.slice(1)) : el.tagName === selector.toUpperCase()) || null; }
  }
  document.createElement = tag => new Element(tag);
  const host = document.createElement('div');
  return { host, requests, get: selector => host.querySelector(selector), all: tag => host.all().filter(el => el.tagName === tag.toUpperCase()) };
}
const photos = [1, 2, 3].map(n => ({ src: `/media/photo-${n}.jpg`, alt: `Exact facade ${n}`, caption: `View ${n}`, credit: `Photographer ${n}`, sourceUrl: `https://museum.example/photo/${n}`, license: 'CC BY 4.0' }));

test('mount renders one lazy active image with caption, credit, source and manual controls', async () => {
  const { mountStopSlideshow } = await ready, h = environment();
  const before = JSON.stringify(photos);
  mountStopSlideshow(h.host, photos, { name: 'Nassau Hall' });
  assert.equal(h.all('img').length, 1); assert.deepEqual(h.requests, ['/media/photo-1.jpg']);
  const img = h.get('img'); assert.equal(img.alt, 'Exact facade 1'); assert.equal(img.loading, 'lazy');
  assert.equal(img.referrerPolicy, 'no-referrer'); assert.equal(img.draggable, false);
  assert.equal(h.get('.stop-slideshow-counter').textContent, 'Photo 1 of 3');
  assert.equal(h.get('.stop-slideshow-description').textContent, 'View 1');
  assert.equal(h.get('.stop-slideshow-credit').textContent, 'Photographer 1');
  assert.equal(h.get('a').href, 'https://museum.example/photo/1');
  assert.equal(h.get('.stop-slideshow-controls').hidden, false);
  img.onload(); assert.equal(h.get('.stop-slideshow-status').hidden, true);
  assert.equal(JSON.stringify(photos), before);
});

test('arrows wrap and only load the selected image, without replacing focused controls', async () => {
  const { mountStopSlideshow } = await ready, h = environment(); mountStopSlideshow(h.host, photos, { name: 'Stop' });
  const button = h.get('.stop-slideshow-next'); button.fire('click');
  assert.equal(h.get('img').src, '/media/photo-2.jpg'); assert.equal(h.get('.stop-slideshow-next'), button);
  button.fire('click'); button.fire('click'); assert.equal(h.get('img').src, '/media/photo-1.jpg');
  h.get('.stop-slideshow-prev').fire('click'); assert.equal(h.get('img').src, '/media/photo-3.jpg');
  assert.equal(h.all('img').length, 1);
});

test('focused arrow keys navigate; unrelated and modified keys keep their defaults', async () => {
  const { mountStopSlideshow } = await ready, h = environment(); mountStopSlideshow(h.host, photos, {});
  const figure = h.get('figure');
  assert.equal(figure.fire('keydown', { key: 'ArrowRight' }).prevented, true);
  assert.equal(h.get('img').src, '/media/photo-2.jpg');
  figure.fire('keydown', { key: 'ArrowLeft' }); assert.equal(h.get('img').src, '/media/photo-1.jpg');
  assert.equal(figure.fire('keydown', { key: 'ArrowDown' }).prevented, undefined);
  assert.equal(figure.fire('keydown', { key: 'ArrowRight', altKey: true }).prevented, undefined);
  assert.equal(h.get('img').src, '/media/photo-1.jpg');
});

test('horizontal swipe navigates but vertical scroll, small movement and cancelled pointers do not', async () => {
  const { mountStopSlideshow } = await ready, h = environment(); mountStopSlideshow(h.host, photos, {});
  const frame = h.get('.stop-slideshow-frame');
  const down = () => frame.fire('pointerdown', { pointerId: 1, clientX: 140, clientY: 50, button: 0 });
  down(); frame.fire('pointerup', { pointerId: 1, clientX: 60, clientY: 55 });
  assert.equal(h.get('img').src, '/media/photo-2.jpg');
  down(); frame.fire('pointerup', { pointerId: 1, clientX: 100, clientY: 160 });
  down(); frame.fire('pointerup', { pointerId: 1, clientX: 130, clientY: 51 });
  down(); frame.fire('pointercancel'); frame.fire('pointerup', { pointerId: 1, clientX: 20, clientY: 50 });
  assert.equal(h.get('img').src, '/media/photo-2.jpg');
});

test('broken URLs advance through exact candidates, then show an honest empty state without looping', async () => {
  const { mountStopSlideshow } = await ready, h = environment(); mountStopSlideshow(h.host, photos, {});
  const staleLoad = h.get('img').onload, staleError = h.get('img').onerror;
  h.get('img').onerror(); assert.equal(h.get('img').src, '/media/photo-2.jpg');
  staleLoad(); staleError(); assert.equal(h.get('img').src, '/media/photo-2.jpg');
  assert.equal(h.get('.stop-slideshow-counter').textContent, 'Photo 1 of 2');
  h.get('img').onerror(); assert.equal(h.get('img').src, '/media/photo-3.jpg');
  const lastLoad = h.get('img').onload; h.get('img').onerror(); lastLoad();
  assert.equal(h.all('img').length, 0); assert.equal(h.requests.length, 3);
  assert.equal(h.get('.stop-slideshow-status').textContent, 'The photographs could not load.');
  assert.equal(h.get('.stop-slideshow-status').hidden, false); assert.equal(h.get('.stop-slideshow-controls').hidden, true);
});

test('single and absent photos hide navigation and never substitute other images', async () => {
  const { mountStopSlideshow } = await ready, h = environment(); mountStopSlideshow(h.host, [photos[0]], {});
  assert.equal(h.get('.stop-slideshow-controls').hidden, true);
  h.get('figure').fire('keydown', { key: 'ArrowRight' }); assert.equal(h.requests.length, 1);
  mountStopSlideshow(h.host, [], {});
  assert.equal(h.all('img').length, 0);
  assert.equal(h.get('.stop-slideshow-status').textContent, 'A photograph of this stop is not available yet.');
});

test('destroy removes listeners, images and stale callbacks; remount owns only the new slideshow', async () => {
  const { mountStopSlideshow } = await ready, h = environment();
  const controller = mountStopSlideshow(h.host, photos, {}), next = h.get('.stop-slideshow-next');
  const onload = h.get('img').onload, onerror = h.get('img').onerror;
  controller.destroy(); controller.destroy(); next.fire('click'); onload(); onerror();
  assert.equal(h.host.children.length, 0); assert.equal(h.requests.length, 1);
  const second = mountStopSlideshow(h.host, photos, {});
  mountStopSlideshow(h.host, [photos[2]], {}); second.destroy();
  assert.equal(h.all('figure').length, 1); assert.equal(h.get('img').src, '/media/photo-3.jpg');
});

test('unsafe image/source URLs are rejected and hostile caption/credit values stay plain text', async () => {
  const { mountStopSlideshow } = await ready, h = environment();
  const bad = ['javascript:alert(1)', 'data:image/svg+xml,<svg onload=alert(1)>', '//outside.example/a.jpg', '/bad.svg', 'https://user:pass@host.example/a.jpg'];
  mountStopSlideshow(h.host, [...bad.map(src => ({ src })), { src: '/safe.jpg', caption: '<script>bad()</script>', credit: '<img onerror=bad()>', sourceUrl: 'javascript:bad()' }], {});
  assert.deepEqual(h.requests, ['/safe.jpg']); assert.equal(h.all('a').length, 0);
  assert.equal(h.get('.stop-slideshow-description').textContent, '<script>bad()</script>');
  assert.equal(h.get('.stop-slideshow-credit').textContent, '<img onerror=bad()>');
  assert.equal(h.all('script').length, 0);
});

test('Chinese labels, 44px targets, focus and reduced motion are part of the reusable component', async () => {
  const { mountStopSlideshow } = await ready, h = environment(); mountStopSlideshow(h.host, photos, { name: '国会大厦', language: 'zh-CN' });
  assert.equal(h.get('.stop-slideshow-next').getAttribute('aria-label'), '下一张照片');
  assert.equal(h.get('.stop-slideshow-counter').textContent, '第 1 张，共 3 张');
  assert.equal(h.get('.stop-slideshow-frame').tabIndex, 0);
  const css = read('tour-stop-slideshow.css');
  assert.match(css, /min-height:\s*44px/); assert.match(css, /focus-visible/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/); assert.match(css, /touch-action:\s*pan-y pinch-zoom/);
  assert.doesNotMatch(source, /setInterval|setTimeout|fetch\(|new Audio|\.play\(/);
});

test('live API photo_details preserve reviewed captions and override old entry and seed media', async () => {
  const { stopPhotosFor } = await ready;
  const stop = { n: 6, name: 'Boston Latin School site', photo_details: photos, photos: ['/modern-campus.jpg'] };
  const selected = stopPhotosFor(stop, { photos: ['/old-entry.jpg'] });
  assert.equal(selected.length, 3); assert.equal(selected[0].src, photos[0].src);
  assert.equal(selected[0].caption, photos[0].caption); assert.equal(selected[0].credit, photos[0].credit);
  assert.deepEqual(stopPhotosFor({ name: stop.name, photos: ['/modern-campus.jpg'] }), []);
  assert.deepEqual(stopPhotosFor({ name: 'Faneuil Hall', photos: ['/hall.jpg', '/dock.jpg', '/market.jpg', '/directory-clipping.png'] }).map(p => p.src), ['/hall.jpg', '/dock.jpg', '/market.jpg']);
});

test('live fallback retains entry preference, exact string/object alternatives and Commons attribution', async () => {
  const { stopPhotosFor } = await ready;
  const selected = stopPhotosFor({ name: 'Exact stop', photos: ['/stop.jpg', { src: '/object.jpg', alt: 'South side' }] }, { photo: '/entry.jpg' });
  assert.deepEqual(selected.map(p => p.src), ['/entry.jpg', '/stop.jpg', '/object.jpg']);
  assert.equal(selected[2].alt, 'South side');
  const commons = stopPhotosFor({ name: 'Exact stop', photos: ['https://commons.wikimedia.org/wiki/Special:FilePath/Exact.jpg'] })[0];
  assert.equal(new URL(commons.src).searchParams.get('width'), '960');
  assert.equal(commons.sourceUrl, 'https://commons.wikimedia.org/wiki/File:Exact.jpg');
});

test('license URLs and private rights notes survive shared API metadata normalization', async () => {
  const { stopPhotosFor } = await ready;
  const item = { ...photos[0], licenseUrl: 'https://creativecommons.org/licenses/by/4.0/', rightsNote: 'Private reference only; publication permission not established.', previewOnly: true };
  const stop = { n: 1, name: 'Exact stop', photo_details: [item] };
  const before = JSON.stringify(stop);
  const photo = stopPhotosFor(stop)[0];
  assert.equal(photo.licenseUrl, item.licenseUrl);
  assert.equal(photo.rightsNote, item.rightsNote);
  assert.equal(photo.src, item.src, 'normalization preserves the supplied exact photograph');
  assert.equal(JSON.stringify(stop), before, 'normalization must not change the source records');
});

test('license text links safely while rights notes require explicit private-preview opt-in', async () => {
  const { mountStopSlideshow } = await ready, h = environment();
  const item = { ...photos[0], licenseUrl: 'https://creativecommons.org/licenses/by/4.0/', rightsNote: '<img onerror=bad()> Private reference only.' };
  mountStopSlideshow(h.host, [item], { name: 'Exact stop' });
  const link = h.get('.stop-slideshow-license');
  assert.equal(link.tagName, 'A'); assert.equal(link.href, item.licenseUrl);
  assert.equal(link.textContent, item.license); assert.equal(link.target, '_blank');
  assert.equal(link.rel, 'noopener noreferrer');
  assert.equal(h.get('.stop-slideshow-rights'), null, 'public mounts must not expose private notes by default');
  mountStopSlideshow(h.host, [item], { name: 'Exact stop', showRightsNote: true });
  assert.equal(h.get('.stop-slideshow-rights').textContent, item.rightsNote);
  assert.equal(h.all('img').length, 1, 'rights text must not create HTML elements');
});

test('unsafe license links become plain text and do not remove an otherwise valid photograph', async () => {
  const { mountStopSlideshow, stopPhotosFor } = await ready;
  const bad = ['javascript:alert(1)', 'data:text/html,bad', 'http://licenses.example/terms', '//licenses.example/terms', '/terms', 'https://user:pass@licenses.example/terms', 'https://host.example/%61pi/gallery/photos/id'];
  for (const licenseUrl of bad) {
    const item = { ...photos[0], licenseUrl }, h = environment();
    assert.equal(stopPhotosFor({ name: 'Exact stop', photos: [item] })[0].licenseUrl, '', licenseUrl);
    mountStopSlideshow(h.host, [item], {});
    assert.equal(h.get('img').src, item.src);
    assert.equal(h.get('.stop-slideshow-license').tagName, 'SPAN');
    assert.equal(h.get('.stop-slideshow-license').textContent, item.license);
    assert.equal(h.all('a').length, 1, 'only the safe photo source remains linked');
  }
});

test('HTTP and retired visitor paths are rejected across direct mounts, legacy fallbacks and reviewed metadata', async () => {
  const { mountStopSlideshow, stopPhotosFor } = await ready;
  let deeplyEncoded = '/api/gallery/photos/private.jpg';
  for (let i = 0; i < 10; i++) deeplyEncoded = encodeURIComponent(deeplyEncoded);
  const bad = [
    'http://museum.example/facade.jpg', '/api/gallery/photos/private.jpg',
    'https://site.example/api/gallery/photos/private.jpg', '/gallery_photos/private.jpg',
    '/API/GALLERY/PHOTOS/private.jpg', '/api//gallery///photos/private.jpg',
    '/media/../api/gallery/photos/private.jpg', '/%61pi%2fgallery%2fphotos/private.jpg',
    '/%2561pi%252fgallery%252fphotos/private.jpg', '/api%5cgallery%5cphotos/private.jpg',
    '/%2fapi/gallery/photos/private.jpg', `/media/${deeplyEncoded}`,
    '/image%2esvg', '/image%252esvg?download=1', '/invalid%escape.jpg'
  ];
  for (const src of bad) {
    const h = environment(), item = { src }, stop = { n: 1, name: 'Exact stop', photo: src, photos: [item] };
    mountStopSlideshow(h.host, [item], {});
    assert.deepEqual(h.requests, [], `direct mount rejected ${src}`);
    assert.deepEqual(stopPhotosFor(stop, { photo: src, photos: [item] }), [], `all legacy fields rejected ${src}`);
    assert.deepEqual(stopPhotosFor({ ...stop, photo_details: [item] }), [], `API metadata rejected ${src}`);
  }
});

test('HTTPS and authorized site paths still load, and rejected legacy images do not displace exact alternatives', async () => {
  const { mountStopSlideshow, stopPhotosFor } = await ready;
  const allowed = ['/media/facade.jpg', '/static/photos/Exact%20Hall.jpg', 'https://museum.example/facade.jpg?width=960', 'https://museum.example/api/gallery/photos-not-visitor/facade.jpg'];
  for (const src of allowed) {
    const h = environment(), stop = { n: 1, name: 'Exact stop', photos: [src] };
    assert.equal(stopPhotosFor(stop)[0].src, src);
    mountStopSlideshow(h.host, [{ src }], {});
    assert.deepEqual(h.requests, [src]);
  }
  const stop = { n: 1, name: 'Exact stop', photo_details: [{ src: '/api/gallery/photos/private.jpg' }], photos: [photos[0]] };
  assert.equal(stopPhotosFor(stop, { photo: 'http://old.example/image.jpg' })[0].src, photos[0].src);
});
