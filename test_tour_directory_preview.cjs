// Private directory regression tests. No browser, network, audio, or data writes.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const read = name => fs.readFileSync(path.join(__dirname, name), 'utf8');
const moduleFrom = name => import('data:text/javascript;base64,' + Buffer.from(read(name)).toString('base64'));
const dataReady = moduleFrom('tour-directory-preview-data.js');
const brandingReady = moduleFrom('ivy-branding.js');
const payload = JSON.parse(read('trails.json'));
const script = read('tour-directory-preview.js');
const css = read('tour-directory-preview.css');

test('catalog excludes the Ivy collection and retains 12 routes in 11 cities', async () => {
  const d = await dataReady, tours = d.buildDirectoryData(payload);
  assert.equal(tours.length, 12);
  assert.equal(d.citiesFor(tours).length, 11);
  assert.equal(tours.some(t => t.id === 'ivy-league'), false);
  assert.equal(tours.flatMap(t => t.stops).length, 148);
  assert.equal(d.citiesFor(tours)[0], 'dc');
});

test('every stop keeps its original order, number, name, and exact narrative', async () => {
  const d = await dataReady;
  const before = JSON.stringify(payload), tours = d.buildDirectoryData(payload);
  for (const tour of tours) {
    const source = payload.trails.find(t => t.id === tour.id);
    assert.deepEqual(tour.stops.map(s => [s.n, s.name, s.description]),
      source.stops.map(s => [Number(s.n), d.cleanCopy(s.name), d.cleanCopy(s.desc)]));
  }
  assert.equal(JSON.stringify(payload), before, 'adapter must not mutate the source catalog');
});

test('Princeton search distinguishes Prospect House stop 8 from Art Museum stop 9', async () => {
  const d = await dataReady, tours = d.buildDirectoryData(payload);
  const prospect = d.searchTours(tours, 'Prospect House');
  assert.equal(prospect.length, 1);
  assert.equal(prospect[0].tour.id, 'ivy-princeton');
  assert.deepEqual(prospect[0].matchedStops, [8]);
  const museum = d.searchTours(tours, 'Princeton Art Museum');
  assert.equal(museum.length, 1);
  assert.equal(museum[0].tour.id, 'ivy-princeton');
  assert.deepEqual(museum[0].matchedStops, [9]);
});

test('search supports city, school, combined terms and case/diacritic folding', async () => {
  const d = await dataReady, tours = d.buildDirectoryData(payload);
  assert.deepEqual(d.searchTours(tours, 'Boston').map(r => r.tour.id), ['freedom-trail']);
  assert.deepEqual(d.searchTours(tours, 'PRÍNCETON').map(r => r.tour.id), ['ivy-princeton']);
  assert.deepEqual(d.searchTours(tours, 'Boston Old North').map(r => r.matchedStops), [[13]]);
  assert.deepEqual(d.searchTours(tours, 'Princeton', 'boston'), []);
  assert.deepEqual(d.searchTours(tours, 'not-a-real-destination-xyz'), []);
  assert.equal(d.searchTours(tours, '').length, 12);
  assert.equal(d.searchTours(tours, '', 'philadelphia').length, 2);
});

test('coverage remains honest: 30 models, and no fabricated Ivy or Philadelphia images', async () => {
  const d = await dataReady, tours = d.buildDirectoryData(payload);
  const ivy = tours.filter(t => t.school).flatMap(t => t.stops);
  assert.equal(ivy.length, 84);
  assert.ok(ivy.every(s => s.photo === null && s.model === null));
  assert.ok(tours.find(t => t.id === 'philadelphia').stops.every(s => !s.photo && !s.model));
  assert.equal(tours.flatMap(t => t.stops).filter(s => s.model).length, 30);
  assert.equal(tours.find(t => t.id === 'national-mall').stops.filter(s => s.model).length, 21);
  assert.equal(tours.find(t => t.id === 'mount-rushmore').stops.filter(s => s.photo).length, 1);
});

test('Boston model links preserve exact stop context and both State Houses', async () => {
  const d = await dataReady;
  const boston = d.buildDirectoryData(payload).find(t => t.id === 'freedom-trail');
  assert.deepEqual(boston.stops.filter(s => s.model).map(s => s.n), [2, 3, 8, 9, 11, 12, 13, 15, 16]);
  assert.equal(boston.stops.find(s => s.n === 2).model.key, 'state-house');
  assert.equal(boston.stops.find(s => s.n === 9).model.key, 'old-state-house');
  for (const s of boston.stops.filter(s => s.model)) {
    const url = new URL(s.model.href, 'https://example.test');
    assert.equal(url.pathname, '/architecture');
    assert.equal(url.searchParams.get('source'), 'freedom-trail');
    assert.equal(url.searchParams.get('stop'), String(s.n));
    assert.equal(url.searchParams.get('model'), s.model.key);
  }
});

test('known unrelated photos are excluded and approved alternate destination images are selected', async () => {
  const d = await dataReady;
  for (const name of ['National Gallery of Art', 'Boston Latin School site', 'Boston Massacre Site']) {
    assert.equal(d.photoFor({ name, photos: ['https://commons.wikimedia.org/wiki/Special:FilePath/wrong.jpg'] }), null);
  }
  const stop = payload.trails.find(t => t.id === 'national-mall').stops.find(s => s.name === 'National Museum of Natural History');
  const photo = d.photoFor(stop);
  assert.equal(new URL(photo.src).pathname, new URL(stop.photos[3]).pathname);
  assert.equal(new URL(photo.src).searchParams.get('width'), '960');
  assert.equal(photo.alt, stop.name);
  assert.match(photo.source, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
  assert.equal(d.photoFor({ name: 'No photo' }), null);
  assert.equal(d.photoFor({ name: 'Unsafe', photos: ['javascript:alert(1)'] }), null);
});

test('school keys match all eight source-verified brands, including Penn and Dartmouth', async () => {
  const d = await dataReady, { IVY_BRANDING } = await brandingReady;
  const schools = d.buildDirectoryData(payload).filter(t => t.school).map(t => t.school);
  assert.deepEqual(schools, ['harvard', 'yale', 'princeton', 'columbia', 'penn', 'brown', 'dartmouth', 'cornell']);
  assert.ok(schools.every(s => IVY_BRANDING[s]?.logoUrl));
  assert.match(IVY_BRANDING.dartmouth.mascotName, /no official mascot/);
  assert.match(IVY_BRANDING.cornell.mascotName, /unofficial/);
});

test('route URLs and time labels are safe and do not invent visit durations', async () => {
  const d = await dataReady;
  assert.equal(d.tourURL('freedom-trail'), '/freedom-trail');
  assert.equal(d.tourURL('national-mall'), '/national-mall');
  assert.equal(d.tourURL('ivy-princeton'), '/tour/ivy-princeton');
  assert.equal(d.tourURL('../outside'), '/tours');
  assert.equal(d.minutes(77), '1 hr 17 min');
  assert.equal(d.minutes(0), '0 min');
  assert.equal(d.minutes(null), 'Not listed');
  assert.equal(d.minutes(-1), 'Not listed');
});

test('malformed or duplicate routes cannot create duplicate tour controls', async () => {
  const d = await dataReady;
  const route = { id: 'test-route', name: 'Test', city: 'test', stops: [{ n: 2, name: 'Second' }, { n: 1, name: 'First' }] };
  assert.deepEqual(d.buildDirectoryData(null), []);
  const result = d.buildDirectoryData({ trails: [route, route, { id: 'bad/id', stops: [{}] }, { id: 'empty', stops: [] }] });
  assert.equal(result.length, 1);
  assert.deepEqual(result[0].stops.map(s => s.n), [2, 1], 'source ordering wins over numeric sorting');
});

function mascotHarness(branding) {
  const element = (tag, className, text) => ({ tag, className, text, children: [], style: {},
    append(child) { child.parent = this; this.children.push(child); },
    addEventListener(name, fn) { this[name] = fn; },
    remove() { this.parent.children = this.parent.children.filter(c => c !== this); } });
  const source = script.slice(script.indexOf('function mascot(tour)'), script.indexOf('function chooseCity(city)'));
  const context = vm.createContext({ element, state: { branding }, cleanCopy: value => value });
  vm.runInContext(source, context);
  return school => context.mascot({ school });
}

test('mascot picture is a 48px crop with descriptive alt and a separate visible name', async () => {
  const { IVY_BRANDING } = await brandingReady;
  const row = mascotHarness(IVY_BRANDING)('princeton'), img = row.children[0];
  assert.equal(img.alt, IVY_BRANDING.princeton.mascotImageAlt);
  assert.notEqual(img.alt, IVY_BRANDING.princeton.mascotName);
  assert.equal(img.width, 48); assert.equal(img.height, 48);
  assert.equal(img.loading, 'lazy'); assert.equal(img.referrerPolicy, 'no-referrer');
  assert.equal(row.children[1].text, 'The Tiger');
  const rule = css.match(/\.mascot-image\s*\{([^}]+)\}/)[1];
  assert.match(rule, /width:\s*48px/); assert.match(rule, /height:\s*48px/);
  assert.match(rule, /object-fit:\s*cover/); assert.match(rule, /flex:\s*0 0 48px/);
  img.error();
  assert.equal(row.children.length, 1);
  assert.equal(row.children[0].text, 'The Tiger', 'name survives a failed photo');
});

test('absent mascot photos do not create placeholders and older data retain meaningful alt', async () => {
  const { IVY_BRANDING } = await brandingReady;
  const render = mascotHarness(IVY_BRANDING);
  assert.equal(render('dartmouth').children.length, 1);
  assert.equal(render('harvard').children.length, 1);
  assert.equal(render('missing'), null);
  const row = mascotHarness({ legacy: { mascotName: 'A bear', mascotImageUrl: '/bear.jpg' } })('legacy');
  assert.equal(row.children[0].alt, 'A bear');
});

test('private directory has no audio player, paid call or autoplay behavior', () => {
  const html = read('tour-directory-preview.html');
  assert.match(html, /name="robots" content="noindex,nofollow"/);
  assert.doesNotMatch(html, /<audio\b|autoplay/i);
  assert.doesNotMatch(script, /new Audio\(|\.play\(|\/api\/(?:tts|generate|audio|gallery)/);
  assert.match(script, /fetch\("\/api\/trails"/);
});
