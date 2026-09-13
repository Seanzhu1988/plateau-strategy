// Audio snapshots captured immediately before the slideshow-only page edits.
// These hashes deliberately lock byte-for-byte code, not guessed equivalence.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');
const read = name => fs.readFileSync(path.join(__dirname, name), 'utf8');
const baselines = [
  ['tour.html', 'function semanticMatch(row, expected) {', '    function minutes(m) {', '865a44e03ba510a2ee6432fbe7269c89f46d87dc5528bd83e99bd6fce5713916'],
  ['tour.html', '    function stopRecording(s, entry) {', '    function wireWalk() {', '9f7e71f0e4fa683b41b13e532269e75160a7a1a2216f40670780fcd832a2da4f'],
  ['tour.html', '        silence();\n        if (fromUser)', '    /* Language changes happen in place.', '042f71964a7451e847e8553cda63bb7b262e7b14a08a8932d5d62573f0a6ef34'],
  ['national-mall.html', '    function playGuide() {', '    function T(en) {', '356a01e3303b1a3980521d00ee98d25ee553376e155ef7dcc73e95c49a3c5d1b'],
  ['national-mall.html', '        var g = document.getElementById("nmGuide"), a = document.getElementById("nmAudio");', '    function hideExtras() {', 'fcc571576eea5b48afb90f8069fc501a9856af4b15693e3a81737536fa1b6f9f'],
  ['freedom-trail.html', '    function recording(n) {', '    fetch("/api/trails", { cache: "no-store" })', '754e8f5d4db5fcfcfc49bee73c91813f4e8045c9250d3fc6a04bc95787471ab8'],
  ['freedom-trail.html', '            var segment = recording(s.n);', '            return ', '4ac2e08820fe4b4696a1ec15fd1e8c06620ffc9d6ae4a0dae5ea68ed1d962aa9']
];
for (const [file, start, end, expected] of baselines) {
  test(`${file}: unchanged audio block ${start.trim()}`, () => {
    const html = read(file), a = html.indexOf(start), b = html.indexOf(end, a);
    assert.ok(a >= 0 && b > a, 'audio boundaries must still exist');
    assert.equal(crypto.createHash('sha256').update(html.slice(a, b)).digest('hex'), expected);
  });
}

test('all three live tour pages load the shared CSS and still parse', () => {
  for (const file of ['tour.html', 'national-mall.html', 'freedom-trail.html']) {
    const html = read(file);
    assert.match(html, /href="\/tour-stop-slideshow\.css"/);
    for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
      if (/src=|application\/ld\+json|type="module"/.test(match[1])) continue;
      assert.doesNotThrow(() => new vm.Script(match[2], { filename: file }));
    }
  }
});

function bridgeHarness(file, start, end, extras = {}) {
  const calls = [], hosts = {};
  function host(id) { return hosts[id] ||= { id, hidden: false, dataset: {}, children: [], replaceChildren(...children) { this.children = children; }, appendChild(child) { this.children.push(child); } }; }
  const module = { stopPhotosFor(stop, entry) { return stop.photo_details || entry?.photos || stop.photos || []; },
    mountStopSlideshow(node, photos, options) { const call = { node, photos, options, destroyed: false }; calls.push(call); return { destroy() { call.destroyed = true; } }; } };
  const document = { getElementById: id => id === 'twShowImg' ? null : host(id),
    createElement: () => ({ removeAttribute() {} }), querySelectorAll: () => [] };
  const context = vm.createContext({ document, activeLang: () => 'en', lang: () => 'en', entryFor: () => null,
    stopPhotoSequence: 0, showStopPhoto: () => { throw new Error('Unexpected fallback'); }, ...extras });
  const html = read(file), a = html.indexOf(start), b = html.indexOf(end, a);
  vm.runInContext(html.slice(a + start.length, b), context);
  return { context, module, document, host, calls, flush: async () => { await Promise.resolve(); await Promise.resolve(); } };
}

test('generic page drops stale selections, forwards exact metadata and destroys prior slideshow', async () => {
  const h = bridgeHarness('tour.html', '// BEGIN TOUR_STOP_SLIDESHOW', '// END TOUR_STOP_SLIDESHOW');
  h.context.tourPhotoModule = Promise.resolve(h.module);
  h.context.showStopSlideshow({ name: 'First', photos: ['/first.jpg'] }, null);
  h.context.showStopSlideshow({ name: 'Second', photo_details: [{ src: '/second.jpg' }] }, null);
  await h.flush();
  assert.equal(h.calls.length, 1); assert.equal(h.calls[0].options.name, 'Second');
  assert.equal(h.calls[0].photos[0].src, '/second.jpg');
  h.context.showStopSlideshow({ name: 'Third', photos: ['/third.jpg'] }, null); await h.flush();
  assert.equal(h.calls[0].destroyed, true); assert.equal(h.calls[1].options.name, 'Third');
  h.context.clearTourSlideshow(); assert.equal(h.calls[1].destroyed, true);
});

test('Mall selected-stop photos remain visible with a model, and clear on the full-Mall view', async () => {
  const h = bridgeHarness('national-mall.html', '// BEGIN MALL_STOP_SLIDESHOW', '// END MALL_STOP_SLIDESHOW');
  h.context.mallPhotoModule = Promise.resolve(h.module);
  h.context.paintShow({ name: 'Capitol', model: 'capitol', photo_details: [{ src: '/capitol.jpg' }] }); await h.flush();
  assert.equal(h.calls[0].photos[0].src, '/capitol.jpg'); assert.equal(h.host('nmShow').hidden, false);
  h.context.paintShow({ name: 'Old request', photos: ['/old.jpg'] });
  h.context.paintShow(null); await h.flush();
  assert.equal(h.calls.length, 1); assert.equal(h.calls[0].destroyed, true); assert.equal(h.host('nmShow').hidden, true);
});

test('Boston independently mounts each exact stop and replaces old mounts on language/list refresh', async () => {
  const stops = [{ n: 2, name: 'State House', photo_details: [{ src: '/state.jpg' }] }, { n: 9, name: 'Old State House', photo_details: [{ src: '/old-state.jpg' }] }];
  const h = bridgeHarness('freedom-trail.html', '// BEGIN BOSTON_STOP_SLIDESHOWS', '// END BOSTON_STOP_SLIDESHOWS', { trail: { stops }, audioLang: 'en' });
  const hosts = stops.map(stop => { const host = h.host(`stop-${stop.n}`); host.dataset.stop = String(stop.n); return host; });
  h.document.querySelectorAll = () => hosts; h.context.miniModule = Promise.resolve(h.module);
  h.context.feedMiniShows(); await h.flush();
  assert.deepEqual(h.calls.map(call => call.photos[0].src), ['/state.jpg', '/old-state.jpg']);
  h.context.audioLang = 'zh'; h.context.feedMiniShows(); await h.flush();
  assert.ok(h.calls.slice(0, 2).every(call => call.destroyed));
  assert.ok(h.calls.slice(2).every(call => call.options.language === 'zh'));
});

test('slideshow bridges neither resolve nor start audio', () => {
  for (const [file, start, end] of [['tour.html', '// BEGIN TOUR_STOP_SLIDESHOW', '// END TOUR_STOP_SLIDESHOW'],
    ['national-mall.html', '// BEGIN MALL_STOP_SLIDESHOW', '// END MALL_STOP_SLIDESHOW'],
    ['freedom-trail.html', '// BEGIN BOSTON_STOP_SLIDESHOWS', '// END BOSTON_STOP_SLIDESHOWS']]) {
    const html = read(file), source = html.slice(html.indexOf(start), html.indexOf(end));
    assert.doesNotMatch(source, /\.play\(|\.pause\(|\/media\/audio|stopRecording\(|recording\(|fetch\(/);
  }
});
