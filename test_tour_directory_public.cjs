// Public directory contract, no network, data mutation or audio playback.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const read = name => fs.readFileSync(path.join(__dirname, name), 'utf8');
const moduleFrom = name => import('data:text/javascript;base64,' + Buffer.from(read(name)).toString('base64'));
const ready = moduleFrom('tour-directory-data.js');
const seed = JSON.parse(read('trails.json'));

test('public directory preserves all 12 routes, 148 ordered stops and source narratives', async () => {
  const d = await ready, before = JSON.stringify(seed), tours = d.buildDirectoryData(seed);
  assert.equal(tours.length, 12); assert.equal(d.citiesFor(tours).length, 11);
  assert.equal(tours.flatMap(t => t.stops).length, 148);
  for (const tour of tours) {
    const original = seed.trails.find(t => t.id === tour.id);
    assert.deepEqual(tour.stops.map(s => [s.n, s.name, s.description]), original.stops.map(s => [s.n, d.cleanCopy(s.name), d.cleanCopy(s.desc)]));
  }
  assert.equal(JSON.stringify(seed), before);
});

test('Princeton two neighboring destinations retain distinct search and stop IDs', async () => {
  const d = await ready, tours = d.buildDirectoryData(seed);
  assert.deepEqual(d.searchTours(tours, 'Prospect House').map(r => [r.tour.id, r.matchedStops]), [['ivy-princeton', [8]]]);
  assert.deepEqual(d.searchTours(tours, 'Princeton Art Museum').map(r => [r.tour.id, r.matchedStops]), [['ivy-princeton', [9]]]);
});

test('walking totals follow actual incoming legs, excluding the first stop', async () => {
  const d=await ready, tours=d.buildDirectoryData(seed);
  assert.equal(tours.find(t=>t.id==='freedom-trail').walkMinutes,43);
  for(const tour of tours) {
    const source=seed.trails.find(t=>t.id===tour.id);
    assert.equal(tour.walkMinutes,source.stops.slice(1).reduce((sum,s)=>sum+s.walk_min_from_prev,0));
  }
  assert.equal(d.walkingMinutes({stops:[{walk_min_from_prev:99},{walk_min_from_prev:2}],walk_min_total:77}),2);
  assert.equal(d.walkingMinutes({stops:[{},{}],walk_min_total:14}),14);
});

test('Boston model links keep exact ordered stops; no Ivy or Philadelphia models are invented', async () => {
  const d = await ready, tours = d.buildDirectoryData(seed), boston = tours.find(t => t.id === 'freedom-trail');
  assert.deepEqual(boston.stops.filter(s => s.model).map(s => [s.n,s.model.key]), [[2,'state-house'],[3,'park-street'],[8,'old-south'],[9,'old-state-house'],[11,'faneuil-hall'],[12,'paul-revere'],[13,'old-north'],[15,'constitution'],[16,'bunker-hill']]);
  assert.ok(tours.filter(t => t.school || t.id === 'philadelphia').every(t => t.stops.every(s => !s.model)));
});

test('only exact-ID/name public photos are used and private notes never reach display data', async () => {
  const d = await ready, stop={n:5,name:'The Sundial'};
  const photograph={src:'https://museum.example/sundial.jpg',alt:'Sundial',caption:'Sundial base',credit:'Museum',sourceUrl:'https://museum.example/sundial',license:'CC0',rightsNote:'Private internal review'};
  const manifest={version:1,trails:{'ivy-columbia':{'5':{name:'The Sundial',photos:[photograph]}}}};
  assert.equal(d.photosFor('ivy-columbia',stop,manifest)[0].src,photograph.src);
  assert.equal(d.photosFor('ivy-columbia',stop,manifest)[0].rightsNote,undefined);
  assert.deepEqual(d.photosFor('ivy-columbia',{...stop,name:'Different place'},manifest),[]);
  for (const flag of ['previewOnly','needsRightsReview']) {
    manifest.trails['ivy-columbia']['5'].photos=[{...photograph,[flag]:true}];
    assert.deepEqual(d.photosFor('ivy-columbia',stop,manifest),[]);
  }
  for (const src of ['/api/gallery/photos/p_private','https://example.test/%2561pi%252fgallery%252fphotos/p_private','javascript:alert(1)']) {
    manifest.trails['ivy-columbia']['5'].photos=[{...photograph,src}];
    assert.deepEqual(d.photosFor('ivy-columbia',stop,manifest),[]);
  }
});

test('eight public school identities use source links, with no uncleared brand images', async () => {
  const {IVY_BRANDING}=await moduleFrom('ivy-branding-public.js');
  assert.equal(Object.keys(IVY_BRANDING).length,8);
  for (const b of Object.values(IVY_BRANDING)) {
    assert.ok(b.name && b.mascotName && b.sources.length);
    assert.equal(b.logoUrl,undefined); assert.equal(b.mascotImageUrl,undefined);
    assert.doesNotMatch(b.mascotNote,/photograph|image is used/);
    assert.ok(b.sources.every(s=>!/[\u2013\u2014]/.test(s.label)));
    assert.ok(b.sources.every(s=>s.url.startsWith('https://')));
  }
  assert.match(IVY_BRANDING.dartmouth.mascotName,/no official mascot/);
  assert.match(IVY_BRANDING.cornell.mascotName,/unofficial/);
});

test('public page uses public feeds, no private preview, rights notes, autoplay or paid calls', () => {
  const html=read('tour-directory.html'),script=read('tour-directory.js');
  assert.doesNotMatch(html,/noindex|Tour directory preview|127\.0\.0\.1|localhost|<audio\b|autoplay/);
  assert.match(script,/fetch\("\/api\/trails"/);assert.match(script,/fetch\("\/tour-stop-photos\.json"/);
  assert.match(script,/showRightsNote: false/);assert.match(script,/\.\/ivy-branding-public\.js/);
  assert.doesNotMatch(script,/new Audio\(|\.play\(|\/api\/(?:tts|generate|audio|gallery)|\/audits\//);
  assert.match(html,/href="\/tours\/seattle">Guided Seattle tours/);
  assert.match(script,/seattleAnchors/);assert.match(script,/location\.replace\('\/tours\/seattle'/);
  assert.match(read('landing-page.html'),/href="\/tours">Explore tours by city/);
});
