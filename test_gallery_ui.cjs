/* Behavior regressions for the actual browser controller, with a minimal DOM.
 * Run: node --test test_gallery_ui.cjs. Visual and real-media QA is separate. */
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, 'gallery-ui.js'), 'utf8');

class Element {
  constructor(id = '') { this.id = id; this.listeners = {}; this.dataset = {}; this.value = ''; this.textContent = ''; this.innerHTML = ''; this.hidden = false; this.checked = false; this.disabled = false; this.isConnected = true; this.open = false; this.clicks = 0; this.classList = {toggle() {}, add() {}, remove() {}}; }
  addEventListener(name, handler) { (this.listeners[name] ||= []).push(handler); }
  dispatch(name, additions = {}) { for (const handler of this.listeners[name] || []) handler.call(this, {target: this, currentTarget: this, preventDefault() {}, ...additions}); }
  querySelectorAll() { return []; }
  querySelector() { return null; }
  setAttribute(name, value) { this[name] = value; }
  removeAttribute(name) { delete this[name]; }
  focus() {}
  click() { ++this.clicks; this.dispatch('click'); }
  showModal() { this.open = true; }
  close() { this.open = false; }
  scrollIntoView() { this.scrolled = true; }
  remove() { this.isConnected = false; }
  insertAdjacentHTML(_position, html) { this.innerHTML += html; }
}

function setup(url = '/universal-gallery', options = {}) {
  const elements = new Map();
  function el(id) { if (!elements.has(id)) elements.set(id, new Element(id)); return elements.get(id); }
  const doc = new Element();
  doc.getElementById = el;
  doc.querySelectorAll = () => [];
  doc.documentElement = {lang: 'en'};
  doc.body = {dataset: {galleryPage: 'search'}};
  doc.readyState = 'complete';
  const requests = [], preparations = [], timers = new Map();
  let timerId = 0, selectedLang = 'en';
  const browserWindow = new Element();
  browserWindow.psxLang = () => selectedLang;
  if (options.prepare !== null) browserWindow.PSXGalleryPhoto = {
    prepare(file, preparationOptions) {
      preparations.push({file, options: preparationOptions});
      return options.prepare ? options.prepare(file, preparationOptions) : Promise.resolve(file);
    }
  };
  class MockFormData { constructor() { this.fields = {}; } append(key, value) { this.fields[key] = value; } }
  const ctx = {
    document: doc, window: browserWindow, location: new URL(url, 'http://example.test'),
    URL, URLSearchParams, AbortController, FormData: MockFormData, Set, console,
    setTimeout(callback, delay = 0) { const id = ++timerId; timers.set(id, {callback, delay}); return id; },
    clearTimeout(id) { timers.delete(id); },
    fetch(requestURL, options = {}) { return new Promise((resolve, reject) => { requests.push({url: requestURL, options, resolve, reject}); }); }
  };
  ctx.history = {replaceState(_a, _b, next) { ctx.location = new URL(next, ctx.location.origin); }};
  vm.runInNewContext(source, ctx, {filename: 'gallery-ui.js'});
  function type(value) { el('ugFind').value = value; el('ugFind').dispatch('input'); }
  function runTimers(maxDelay = 1000) {
    const pending = Array.from(timers.entries()).filter(([, timer]) => timer.delay <= maxDelay);
    pending.forEach(([id]) => timers.delete(id));
    pending.forEach(([, timer]) => timer.callback());
  }
  async function respond(index, body, status = 200) { requests[index].resolve({ok: status < 400, status, json: async () => body}); await tick(); }
  function changeLanguage(value) { selectedLang = value; doc.documentElement.lang = value; doc.dispatch('psx:lang', {detail: value}); }
  return {el, ctx, requests, preparations, timers, type, runTimers, respond, changeLanguage};
}
function tick() { return new Promise(resolve => setImmediate(resolve)); }
async function photo(page) {
  const image = new Blob(['image bytes'], {type: 'image/jpeg'});
  page.el('ugPhotoToggle').dispatch('click');
  page.el('ugPhotoYes').dispatch('click');
  page.el('ugCamera').files = [image]; page.el('ugCamera').dispatch('change');
  await tick();
  return image;
}
function cardHost(page) {
  const host = new Element(), children = new Map(), actions = new Map(); host.dataset.row = '0';
  for (const selector of ['.ug-card-status','.ug-photo-attachment','.ug-object-title','.ug-discovery','.ug-mark','.ug-story-note','.ug-actions','.ug-read-box']) children.set(selector, new Element());
  const text = new Element(); children.get('.ug-read-box').querySelector = selector => selector === '.ug-reading-text' ? text : null;
  function action(name) {
    const btn = new Element(); btn.dataset.action = name; btn.closest = () => host; actions.set(name, btn); return btn;
  }
  const confirm = action('confirm');
  function select(selector) {
    const match = selector.match(/^\[data-action="([^"]+)"\]$/);
    if (match) return Array.from(actions.values()).find(btn => btn.isConnected && btn.dataset.action === match[1]) || null;
    const node = children.get(selector); return node && node.isConnected ? node : null;
  }
  host.querySelector = selector => selector.split(', ').map(select).find(Boolean) || null;
  host.querySelectorAll = selector => selector.split(', ').map(select).filter(Boolean);
  children.get('.ug-actions').insertAdjacentHTML = (_position, html) => {
    for (const match of html.matchAll(/data-action="([^"]+)"/g)) action(match[1]);
  };
  function click(btn = confirm) { page.el('ugFound').dispatch('click', {target: {closest: () => btn}}); }
  return {host, children, actions, text, click};
}

test('clearing input prevents a late response from restoring old results', async () => {
  const page = setup(); page.type('old work'); page.runTimers();
  assert.equal(page.requests.length, 1);
  page.type('');
  assert.equal(page.requests[0].options.signal.aborted, true);
  // Simulate a transport that delivers after abort. Sequence ownership still wins.
  await page.respond(0, {ok: true, results: [{artifact_id: 'a_old', title: 'Old work'}]});
  assert.equal(page.el('ugFound').innerHTML, '');
  assert.equal(page.el('ugStatus').textContent, '');
  assert.equal(page.el('ugWelcome').hidden, false);
});

test('a newer query wins even when the older response arrives last', async () => {
  const page = setup(); page.type('first work'); page.runTimers();
  page.type('second work'); page.runTimers();
  await page.respond(1, {ok: true, results: [{artifact_id: 'a_new', title: 'Second work'}]});
  await page.respond(0, {ok: true, results: [{artifact_id: 'a_old', title: 'First work'}]});
  assert.match(page.el('ugFound').innerHTML, /Second work/);
  assert.doesNotMatch(page.el('ugFound').innerHTML, /First work/);
});

test('photo confirmation mode survives reload and the real document language event', async () => {
  const page = setup('/universal-gallery?q=vessel&origin=photo&discover=0');
  assert.match(page.requests[0].url, /discover=0&origin=photo/);
  assert.equal(page.ctx.location.searchParams.get('origin'), 'photo');
  page.changeLanguage('zh');
  assert.equal(page.requests.length, 2);
  assert.match(page.requests[1].url, /lang=zh/);
  assert.match(page.requests[1].url, /discover=0&origin=photo/);
  assert.equal(page.ctx.location.searchParams.get('discover'), '0');
  await page.respond(1, {ok: true, results: [{artifact_id: 'p_candidate', confirmed: false, title: 'Vessel'}]});
  assert.match(page.el('ugFound').innerHTML, /data-action="confirm"/);
  assert.doesNotMatch(page.el('ugFound').innerHTML, /artifacts\/p_candidate/);
});

test('editing a photo-derived query keeps confirmation mode until a deliberate text-only exit', () => {
  const page = setup('/universal-gallery?q=vessel&origin=photo&discover=0');
  page.type('49.30'); page.runTimers();
  assert.equal(page.requests.length, 2);
  assert.match(page.requests[1].url, /discover=0/);
  assert.equal(page.ctx.location.searchParams.get('origin'), 'photo');
  page.el('ugPhotoText').dispatch('click');
  assert.equal(page.requests.length, 3);
  assert.doesNotMatch(page.requests[2].url, /discover=0/);
  assert.equal(page.ctx.location.searchParams.has('origin'), false);
});

test('one Yes automatically identifies and repeated picker or retry taps cannot duplicate a paid call', async () => {
  const page = setup(); await photo(page);
  assert.equal(page.el('ugIdentify').disabled, true);
  assert.equal(page.requests.length, 1);
  assert.equal(page.requests[0].options.body.fields.consent, 'anthropic-photo-search-v1');
  page.el('ugPhotoToggle').dispatch('click'); page.el('ugPhotoYes').dispatch('click');
  assert.equal(page.el('ugIdentify').disabled, true);
  page.el('ugPhotoForm').dispatch('submit');
  assert.equal(page.requests.length, 1);
  assert.equal(page.el('ugCamera').clicks, 1);
  // Removing the photograph cannot falsely cancel a provider job on the server.
  page.el('ugPhotoRemove').dispatch('click');
  assert.equal(page.requests[0].options.signal.aborted, false);
  await page.respond(0, {ok: true, candidates: [{title: 'Late candidate'}]});
  assert.equal(page.el('ugCandidates').innerHTML, '');
  assert.equal(page.el('ugIdentify').disabled, true);
});

test('provider photo consent is required and absent by default', () => {
  const page = setup(); page.el('ugPhotoForm').dispatch('submit');
  assert.equal(page.requests.length, 0);
  const image = new Blob(['image bytes'], {type: 'image/jpeg'});
  page.el('ugUpload').files = [image]; page.el('ugUpload').dispatch('change');
  page.el('ugPhotoForm').dispatch('submit');
  assert.equal(page.requests.length, 0);
  page.el('ugPhotoRemove').dispatch('click');
});

test('camera tap asks one question; declining or Escape opens no picker and sends nothing', () => {
  const page = setup(); page.el('ugPhotoToggle').dispatch('click');
  assert.equal(page.el('ugPhotoConsentDialog').open, true);
  assert.equal(page.el('ugUpload').clicks, 0);
  page.el('ugPhotoNo').dispatch('click');
  assert.equal(page.el('ugPhotoConsentDialog').open, false);
  page.el('ugPhotoYes').dispatch('click');
  assert.equal(page.el('ugUpload').clicks, 0);
  page.el('ugPhotoToggle').dispatch('click'); page.el('ugPhotoConsentDialog').dispatch('cancel');
  assert.equal(page.el('ugPhotoConsentDialog').open, false);
  assert.equal(page.requests.length, 0);
});

test('the photo entry link opens the same consent dialog instead of a form', () => {
  const page = setup('/universal-gallery?photo=1');
  assert.equal(page.el('ugPhotoConsentDialog').open, true);
  assert.equal(page.el('ugUpload').clicks, 0);
  assert.equal(page.requests.length, 0);
});

test('the one-question design declares both processing and publishing and has no questionnaire', () => {
  const html = fs.readFileSync(path.join(__dirname, 'universal-gallery.html'), 'utf8');
  assert.match(html, /id="ugPhotoConsentDialog"/);
  assert.match(html, /send the photo to Anthropic/);
  assert.match(html, /open the matching artifact.*public page/);
  assert.match(html, /share the photo and artwork/);
  assert.match(html, /No people or private details/);
  assert.doesNotMatch(html, /type="checkbox"|<fieldset/);
});

test('canceling either native picker consumes consent so an unrelated file cannot upload later', async () => {
  for (const [entry, picker] of [['ugPhotoToggle', 'ugCamera'], ['ugPhotoLibrary', 'ugUpload']]) {
    const page = setup(); page.el(entry).dispatch('click'); page.el('ugPhotoYes').dispatch('click');
    page.el(picker).dispatch('cancel');
    page.el(picker).files = [new Blob(['photo'], {type: 'image/jpeg'})]; page.el(picker).dispatch('change');
    await tick();
    assert.equal(page.preparations.length, 0);
    assert.equal(page.requests.length, 0);
  }
});

test('Yes immediately opens the intended camera or library without waiting for a timer or promise', () => {
  for (const [entry, picker] of [['ugPhotoToggle', 'ugCamera'], ['ugEmptyPhoto', 'ugCamera'], ['ugPhotoRetake', 'ugCamera'], ['ugPhotoLibrary', 'ugUpload'], ['ugPhotoPick', 'ugUpload']]) {
    const page = setup(); page.el(entry).dispatch('click');
    assert.equal(page.el('ugCamera').clicks + page.el('ugUpload').clicks, 0);
    page.el('ugPhotoYes').dispatch('click');
    assert.equal(page.el(picker).clicks, 1, entry + ' opens its picker inside the Yes handler');
    assert.equal(page.el('ugCamera').clicks + page.el('ugUpload').clicks, 1);
    assert.equal(page.el('ugPhotoConsentDialog').open, false);
    assert.equal(page.preparations.length, 0);
    assert.equal(page.requests.length, 0);
  }
});

test('a selected file cannot cross from an unapproved library picker into the camera flow', async () => {
  const page = setup(); page.el('ugPhotoToggle').dispatch('click'); page.el('ugPhotoYes').dispatch('click');
  page.el('ugUpload').files = [new Blob(['photo'], {type: 'image/jpeg'})]; page.el('ugUpload').dispatch('change');
  await tick();
  assert.equal(page.preparations.length, 0);
  assert.equal(page.requests.length, 0);
});

test('phone input accepts an empty MIME or large original only through successful normalization', async () => {
  for (const type of ['', 'image/heic', 'image/jpeg']) {
    const normalized = new Blob(['sanitized pixels'], {type: 'image/jpeg'});
    const page = setup('/universal-gallery', {prepare: async () => normalized});
    const original = new Blob([new Uint8Array(7 * 1024 * 1024)], {type});
    page.el('ugPhotoLibrary').dispatch('click'); page.el('ugPhotoYes').dispatch('click');
    page.el('ugUpload').files = [original]; page.el('ugUpload').dispatch('change');
    await tick();
    assert.equal(page.preparations.length, 1);
    assert.equal(page.preparations[0].file, original);
    assert.equal(page.requests.length, 1);
    assert.equal(page.requests[0].options.body.fields.photo, normalized);
    assert.notEqual(page.requests[0].options.body.fields.photo, original);
    assert.equal(page.requests[0].options.body.fields.consent, 'anthropic-photo-search-v1');
    page.el('ugPhotoRemove').dispatch('click');
  }
});

test('damaged or unsupported preparation failures never upload raw files and release camera controls', async () => {
  for (const [code, message] of [['invalid_image', /could not be prepared/], ['unsupported_format', /cannot read that photo format/], ['image_too_large', /too large/]]) {
    const page = setup('/universal-gallery', {prepare: async () => { throw Object.assign(new Error(code), {code}); }});
    await photo(page);
    assert.equal(page.requests.length, 0);
    assert.match(page.el('ugPhotoStatus').textContent, message);
    assert.equal(page.el('ugPhotoToggle').disabled, false);
    assert.equal(page.el('ugPhotoLibrary').disabled, false);
    assert.equal(page.el('ugIdentify').disabled, true);
    page.el('ugPhotoForm').dispatch('submit');
    assert.equal(page.requests.length, 0, 'retry cannot bypass failed normalization');
  }
});

test('a missing preparation helper fails closed instead of uploading the original photograph', async () => {
  const page = setup('/universal-gallery', {prepare: null});
  await photo(page);
  assert.equal(page.requests.length, 0);
  assert.match(page.el('ugPhotoStatus').textContent, /could not be prepared/);
  assert.equal(page.el('ugIdentify').disabled, true);
  assert.equal(page.el('ugPhotoToggle').disabled, false);
});

test('preparing a photograph is single flight and removing it suppresses a late normalized result', async () => {
  let finish;
  const page = setup('/universal-gallery', {prepare: () => new Promise(resolve => { finish = resolve; })});
  await photo(page);
  const signal = page.preparations[0].options.signal;
  assert.equal(page.requests.length, 0);
  assert.equal(page.el('ugPhotoToggle').disabled, true);
  assert.equal(page.el('ugPhotoLibrary').disabled, true);
  assert.match(page.el('ugPhotoStatus').textContent, /Preparing your photo/);
  page.el('ugPhotoToggle').dispatch('click'); page.el('ugPhotoYes').dispatch('click');
  page.el('ugCamera').dispatch('change'); page.el('ugPhotoForm').dispatch('submit');
  assert.equal(page.preparations.length, 1);
  assert.equal(page.el('ugCamera').clicks, 1);
  page.el('ugPhotoRemove').dispatch('click');
  assert.equal(signal.aborted, true);
  assert.equal(page.el('ugPhotoToggle').disabled, false);
  finish(new Blob(['sanitized pixels'], {type: 'image/jpeg'})); await tick();
  assert.equal(page.requests.length, 0);
  assert.equal(page.el('ugPreviewImage').src, undefined);
  assert.equal(page.el('ugIdentify').disabled, true);
});

test('an ordinary text search abandons pending preparation and preserves its result after late normalization', async () => {
  let finish;
  const page = setup('/universal-gallery', {prepare: () => new Promise(resolve => { finish = resolve; })});
  await photo(page);
  page.el('ugFind').value = 'Current vase';
  page.el('ugSearchForm').dispatch('submit');
  assert.equal(page.preparations[0].options.signal.aborted, true);
  assert.equal(page.requests.length, 1);
  assert.match(page.requests[0].url, /q=Current%20vase/);
  assert.doesNotMatch(page.requests[0].url, /origin=photo|discover=0/);
  await page.respond(0, {ok: true, results: [{artifact_id: 'a_current', title: 'Current vase'}]});
  const currentResults = page.el('ugFound').innerHTML;
  finish(new Blob(['late sanitized photo'], {type: 'image/jpeg'})); await tick();
  assert.equal(page.requests.length, 1, 'abandoned preparation cannot initiate a paid POST');
  assert.equal(page.el('ugFound').innerHTML, currentResults);
  assert.match(currentResults, /Current vase/);
  assert.equal(page.el('ugPreviewImage').src, undefined);
  assert.equal(page.el('ugPhotoToggle').disabled, false);
});

test('typing or clearing during preparation cancels before the search debounce can become a paid photo flow', async () => {
  for (const query of ['Current vase', '']) {
    let finish;
    const page = setup('/universal-gallery', {prepare: () => new Promise(resolve => { finish = resolve; })});
    await photo(page);
    page.type(query);
    assert.equal(page.preparations[0].options.signal.aborted, true);
    finish(new Blob(['late sanitized photo'], {type: 'image/jpeg'})); await tick();
    assert.equal(page.requests.length, 0, 'typing cancels preparation before any debounce runs');
    page.runTimers();
    assert.equal(page.requests.length, query ? 1 : 0);
    if (query) {
      assert.match(page.requests[0].url, /q=Current%20vase/);
      assert.doesNotMatch(page.requests[0].url, /origin=photo|discover=0/);
      await page.respond(0, {ok: true, results: [{artifact_id: 'a_current', title: 'Current vase'}]});
      assert.match(page.el('ugFound').innerHTML, /Current vase/);
    }
    assert.equal(page.el('ugFind').value, query);
    assert.equal(page.el('ugPreviewImage').src, undefined);
    assert.equal(page.el('ugPhotoToggle').disabled, false);
  }
});

test('a stalled recognition unlocks at its deadline without an automatic paid retry', async () => {
  const page = setup(); await photo(page);
  assert.equal(page.requests.length, 1);
  page.runTimers(89999); await tick();
  assert.equal(page.el('ugPhotoToggle').disabled, true);
  assert.equal(page.requests[0].options.signal.aborted, false);
  page.runTimers(90000); await tick();
  assert.equal(page.requests[0].options.signal.aborted, true);
  assert.equal(page.el('ugPhotoToggle').disabled, false);
  assert.equal(page.el('ugPhotoLibrary').disabled, false);
  assert.equal(page.el('ugIdentify').disabled, false);
  assert.equal(page.el('ugIdentify').hidden, false);
  assert.match(page.el('ugPhotoStatus').textContent, /did not finish in time/);
  assert.equal(page.requests.length, 1);
  page.runTimers(90000); await tick();
  assert.equal(page.requests.length, 1, 'time alone never starts another paid call');
  page.el('ugPhotoForm').dispatch('submit'); page.el('ugPhotoForm').dispatch('submit');
  assert.equal(page.requests.length, 2, 'one deliberate retry is single flight');
  assert.equal(page.preparations.length, 1, 'retry reuses the sanitized photograph');
  await page.respond(1, {ok: false, reason: 'no_match'});
  assert.equal(page.el('ugPhotoToggle').disabled, false);
  page.el('ugPhotoRemove').dispatch('click');
});

test('the identification deadline also covers a stalled JSON response body', async () => {
  const page = setup(); await photo(page);
  page.requests[0].resolve({ok: true, status: 200, json: () => new Promise(() => {})});
  await tick();
  page.runTimers(90000); await tick();
  assert.equal(page.el('ugIdentify').disabled, false);
  assert.match(page.el('ugPhotoStatus').textContent, /did not finish in time/);
  assert.equal(page.requests.length, 1);
  page.el('ugPhotoRemove').dispatch('click');
});

test('a late timed-out recognition cannot replace or unlock a newer camera flow', async () => {
  const page = setup(); await photo(page);
  page.runTimers(90000); await tick();
  await photo(page);
  assert.equal(page.requests.length, 2);
  const currentPreview = page.el('ugPreviewImage').src;
  await page.respond(0, {ok: true, candidates: [{query: 'Stale sculpture'}]});
  assert.equal(page.requests.length, 2);
  assert.equal(page.el('ugPreviewImage').src, currentPreview);
  assert.equal(page.el('ugCandidates').innerHTML, '');
  assert.equal(page.el('ugPhotoToggle').disabled, true);
  await page.respond(1, {ok: true, candidates: [{query: 'Current vase'}]});
  assert.match(page.requests[2].url, /q=Current%20vase/);
  assert.equal(page.el('ugPhotoToggle').disabled, false);
  page.el('ugPhotoRemove').dispatch('click');
});

test('successful recognition clears its deadline and cannot later display a timeout', async () => {
  const page = setup(); await photo(page);
  await page.respond(0, {ok: false, reason: 'no_match'});
  const status = page.el('ugPhotoStatus').textContent;
  assert.match(status, /could not identify a reliable match/);
  page.runTimers(90000); await tick();
  assert.equal(page.el('ugPhotoStatus').textContent, status);
  assert.equal(page.requests[0].options.signal.aborted, false);
  assert.equal(page.requests.length, 1);
  page.el('ugPhotoRemove').dispatch('click');
});

test('provider billing is explained as our paused service, never as an unrecognized photograph', async () => {
  for (const [reason, expected] of [['provider_billing', /paused on our side/], ['no_match', /could not identify a reliable match/], ['provider_auth', /temporarily unavailable/], ['provider_model_unavailable', /temporarily unavailable/], ['provider_rate_limited', /Photo search is busy/]]) {
    const page = setup(); await photo(page);
    await page.respond(0, {ok: false, reason}, reason === 'no_match' ? 200 : 503);
    assert.match(page.el('ugPhotoStatus').textContent, expected);
    if (reason !== 'no_match') assert.doesNotMatch(page.el('ugPhotoStatus').textContent, /could not identify|clearer photograph/);
    assert.equal(page.el('ugIdentify').hidden, false);
    assert.equal(page.requests.length, 1);
    page.el('ugPhotoRemove').dispatch('click');
  }
});

test('identification automatically searches the strongest candidate in the gallery before external catalogues', async () => {
  const page = setup(); await photo(page); page.el('ugPhotoForm').dispatch('submit');
  await page.respond(0, {ok: true, candidates: [{title: 'Vessel', query: 'Vessel', confidence: 'low'}, {title: 'Cypresses', query: '49.30', confidence: 'high'}]});
  assert.equal(page.el('ugFind').value, '49.30');
  assert.match(page.requests[1].url, /q=49.30/);
  assert.match(page.requests[1].url, /discover=0&origin=photo&scope=archive/);
  await page.respond(1, {ok: true, results: [{artifact_id: 'a_existing', title: 'Cypresses', story_available: true, written: true}]});
  assert.equal(page.requests.length, 3, 'known archive matches remain visible while other collections are checked');
  assert.match(page.el('ugFound').innerHTML, /Cypresses/);
  await page.respond(2, {ok: true, results: [{artifact_id: 'a_existing', title: 'Cypresses'}]});
  assert.match(page.el('ugFound').innerHTML, /Provided by us/);
  assert.match(page.el('ugFound').innerHTML, /data-action="confirm"/);
  assert.match(page.el('ugFound').innerHTML, /Open artifact/);
  assert.doesNotMatch(page.el('ugFound').innerHTML, /data-action="read"/);
  assert.equal(page.el('ugFound').scrolled, true);
  assert.match(page.el('ugCandidates').innerHTML, /data-candidate="0"/);
  page.el('ugPhotoRemove').dispatch('click');
});

test('empty archive results expand to catalogues without auto-saving photo guesses', async () => {
  const page = setup('/universal-gallery?q=49.30&origin=photo&discover=0');
  await page.respond(0, {ok: true, results: []});
  assert.equal(page.requests.length, 2);
  assert.match(page.requests[1].url, /discover=0&origin=photo/);
  assert.doesNotMatch(page.requests[1].url, /scope=archive/);
  await page.respond(1, {ok: true, results: [{artifact_id: 'p_candidate', confirmed: false, title: 'Cypresses'}]});
  assert.equal(page.requests.length, 2, 'no discover call occurs before confirmation');
  assert.doesNotMatch(page.el('ugFound').innerHTML, /Provided by us/);
});

test('an archive match automatically checks other museum versions without asking another question', async () => {
  const page = setup('/universal-gallery?q=Sunflowers&origin=photo&discover=0');
  await page.respond(0, {ok: true, results: [{artifact_id: 'a_saved', title: 'Sunflowers in London'}]});
  assert.doesNotMatch(page.el('ugFound').innerHTML, /Search museum collections too/);
  assert.equal(page.requests.length, 2);
  assert.match(page.requests[1].url, /discover=0/);
  assert.doesNotMatch(page.requests[1].url, /scope=archive/);
  await page.respond(1, {ok: true, results: [{artifact_id: 'a_saved', title: 'Sunflowers in London'}, {artifact_id: 'p_other', title: 'Sunflowers in Munich', confirmed: false}]});
  assert.match(page.el('ugFound').innerHTML, /Sunflowers in Munich/);
  assert.match(page.el('ugFound').innerHTML, /data-action="confirm"/);
});

test('manual OCR correction keeps the photograph and its existing permission', async () => {
  const page = setup(); await photo(page); page.el('ugPhotoForm').dispatch('submit');
  await page.respond(0, {ok: true, candidates: [{query: 'Vessel 12'}]});
  const preview = page.el('ugPreviewImage').src;
  page.type('Vessel 123'); page.runTimers();
  assert.equal(page.requests.length, 3);
  assert.match(page.requests[2].url, /q=Vessel%20123/);
  assert.match(page.requests[2].url, /discover=0/);
  assert.equal(page.el('ugPreviewImage').src, preview);
  assert.equal(page.el('ugCamera').clicks, 1);
  page.el('ugSearchForm').dispatch('submit');
  assert.match(page.requests[3].url, /discover=0/);
  page.el('ugPhotoRemove').dispatch('click');
});

test('late identification suggestions cannot replace a newer user query or clear', async () => {
  const page = setup(); await photo(page); page.el('ugPhotoForm').dispatch('submit');
  page.type('Corrected 123'); page.runTimers();
  await page.respond(0, {ok: true, candidates: [{query: 'Stale 999'}]});
  assert.equal(page.el('ugFind').value, 'Corrected 123');
  assert.equal(page.requests.length, 2);
  assert.match(page.el('ugCandidates').innerHTML, /Stale 999/);
  assert.equal(page.el('ugCamera').clicks, 1);
  page.el('ugPhotoForm').dispatch('submit');
  page.type('');
  await page.respond(2, {ok: true, candidates: [{query: 'Another stale 999'}]});
  assert.equal(page.el('ugFind').value, '');
  assert.equal(page.requests.length, 3);
  assert.equal(page.el('ugFound').innerHTML, '');
  page.el('ugPhotoRemove').dispatch('click');
});

test('legible label text is searched when vision has no identity candidate', async () => {
  const page = setup(); await photo(page); page.el('ugPhotoForm').dispatch('submit');
  await page.respond(0, {ok: true, candidates: [], label_text: '  49.30  '});
  assert.equal(page.el('ugFind').value, '49.30');
  assert.match(page.requests[1].url, /q=49.30/);
  assert.match(page.el('ugCandidates').innerHTML, /Text found on the label/);
  page.el('ugPhotoRemove').dispatch('click');
});

test('closing the photo panel or changing language preserves private preview without another question', async () => {
  const page = setup(); await photo(page);
  const preview = page.el('ugPreviewImage').src;
  page.el('ugPhotoClose').dispatch('click');
  assert.equal(page.el('ugPreviewImage').src, preview);
  assert.equal(page.el('ugPhotoConsentDialog').open, false);
  page.changeLanguage('zh');
  assert.equal(page.el('ugPreviewImage').src, preview);
  assert.equal(page.el('ugCamera').clicks, 1);
  page.el('ugPhotoRemove').dispatch('click');
  assert.equal(page.el('ugPreviewImage').src, undefined);
});

test('confirmation opens an existing selected-language story without generating or uploading by default', async () => {
  const page = setup('/universal-gallery?q=Cypresses&origin=photo');
  await page.respond(0, {ok: true, can_generate: true, results: [{artifact_id: 'a_existing', title: 'Cypresses', story_available: true}]});
  const card = cardHost(page); card.click(); card.click();
  assert.equal(page.requests.length, 3, 'double confirmation is single flight');
  await page.respond(2, {ok: true, saved: true, attachment_token: 'token', can_generate: true, artifact: {artifact_id: 'a_existing', title: 'Cypresses', story_available: true}});
  assert.match(page.requests[3].url, /artifacts\/a_existing\/story\?lang=en/);
  await page.respond(3, {ok: true, text: 'An existing story.', lang: 'en', provenance: {kind: 'editorial'}});
  assert.equal(card.text.textContent, 'An existing story.');
  assert.equal(page.requests.length, 4);
  assert.equal(page.requests.some(request => /\/generate|\/photo$/.test(request.url)), false);
});

test('a newly confirmed artifact writes once and is marked only after real story text returns', async () => {
  const page = setup('/universal-gallery?q=Vessel&origin=photo&lang=zh');
  await page.respond(0, {ok: true, can_generate: true, results: [{artifact_id: 'p_new', title: 'Vessel'}]});
  const card = cardHost(page); card.click();
  await page.respond(2, {ok: true, saved: true, can_generate: true, artifact: {artifact_id: 'a_new', title: 'Vessel', story_available: false}, writing_status: 'pending'});
  assert.equal(page.requests[3].url, '/api/gallery/generate');
  assert.equal(JSON.parse(page.requests[3].options.body).lang, 'zh');
  assert.notEqual(card.children.get('.ug-mark').textContent, '由我们提供');
  card.click(); card.click(card.actions.get('generate'));
  assert.equal(page.requests.length, 4, 'repeat clicks cannot duplicate generation');
  await page.respond(3, {ok: true, text: '这件藏品的故事。', lang: 'zh', provenance: {kind: 'ai_assisted'}});
  assert.equal(card.text.textContent, '这件藏品的故事。');
  assert.equal(card.children.get('.ug-mark').textContent, '由我们提供');
});

test('no-engine confirmation keeps an honest pending discovery without a Written by us badge', async () => {
  const page = setup('/universal-gallery?q=Vessel&origin=photo');
  await page.respond(0, {ok: true, can_generate: false, results: [{artifact_id: 'p_new', title: 'Vessel'}]});
  const card = cardHost(page); card.click();
  await page.respond(2, {ok: true, saved: true, can_generate: false, artifact: {artifact_id: 'a_new', title: 'Vessel', story_available: false}, writing_status: 'pending'});
  assert.equal(page.requests.length, 3);
  assert.equal(card.children.get('.ug-card-status').textContent, 'Saved. A story will be added when writing is available.');
  assert.notEqual(card.children.get('.ug-mark').textContent, 'Provided by us');
});

test('publication permission uploads the exact photograph only after confirmed attachment token', async () => {
  const page = setup(); const original = await photo(page); page.el('ugPhotoForm').dispatch('submit');
  await page.respond(0, {ok: true, candidates: [{query: 'Vessel', confidence: 'high'}]});
  await page.respond(1, {ok: true, can_generate: false, results: [{artifact_id: 'a_vessel', title: 'Vessel'}]});
  assert.equal(page.requests.length, 3, 'no photo retained during identification or search');
  const card = cardHost(page); card.click();
  await page.respond(3, {ok: true, saved: true, can_generate: false, attachment_token: 'signed-match', artifact: {artifact_id: 'a_vessel', title: 'Vessel'}, writing_status: 'pending'});
  assert.equal(page.requests[4].url, '/api/gallery/artifacts/a_vessel/photo');
  assert.equal(page.requests[4].options.body.fields.photo, original);
  assert.equal(page.requests[4].options.body.fields.publication_consent, 'gallery-photo-publication-v1');
  assert.equal(page.requests[4].options.body.fields.attachment_token, 'signed-match');
  await page.respond(4, {ok: true, photo: {photo_id: 'photo_1', url: '/api/gallery/photos/photo_1', kind: 'visitor_photo'}});
  assert.equal(card.children.get('.ug-photo-attachment').textContent, '');
  assert.match(card.host.innerHTML, /Visitor photograph/);
  assert.match(card.host.innerHTML, /Separate from the museum/);
  page.el('ugPhotoRemove').dispatch('click');
});

test('removing the photo while opening an artifact is pending prevents publication', async () => {
  const page = setup(); await photo(page); page.el('ugPhotoForm').dispatch('submit');
  await page.respond(0, {ok: true, candidates: [{query: 'Vessel'}]});
  await page.respond(1, {ok: true, can_generate: false, results: [{artifact_id: 'a_vessel', title: 'Vessel'}]});
  const card = cardHost(page); card.click();
  page.el('ugPhotoRemove').dispatch('click');
  await page.respond(3, {ok: true, saved: true, can_generate: false, attachment_token: 'signed-match', artifact: {artifact_id: 'a_vessel', title: 'Vessel'}, writing_status: 'pending'});
  assert.equal(page.requests.length, 4);
  assert.equal(page.requests.some(request => /\/photo$/.test(request.url)), false);
  page.el('ugPhotoRemove').dispatch('click');
});

test('photo attachment failure leaves the story independent and allows a separate retry', async () => {
  const page = setup(); await photo(page); page.el('ugPhotoForm').dispatch('submit');
  await page.respond(0, {ok: true, candidates: [{query: 'Vessel'}]});
  await page.respond(1, {ok: true, can_generate: true, results: [{artifact_id: 'a_vessel', title: 'Vessel', story_available: true}]});
  const card = cardHost(page); card.click();
  await page.respond(3, {ok: true, saved: true, can_generate: true, attachment_token: 'signed-match', artifact: {artifact_id: 'a_vessel', title: 'Vessel', story_available: true}});
  assert.match(page.requests[4].url, /\/photo$/);
  assert.match(page.requests[5].url, /\/story\?lang=en$/);
  await page.respond(4, {ok: false, reason: 'temporary'}, 503);
  await page.respond(5, {ok: true, text: 'Saved story remains readable.', lang: 'en'});
  assert.equal(card.text.textContent, 'Saved story remains readable.');
  assert.match(card.children.get('.ug-photo-attachment').textContent, /photo was not added/);
  card.click(card.actions.get('retry-photo'));
  assert.match(page.requests[6].url, /\/photo$/);
  assert.equal(page.requests[6].options.body.fields.attachment_token, 'signed-match');
  assert.equal(page.requests.filter(request => /\/story\?/.test(request.url)).length, 1);
  await page.respond(6, {ok: true, photos: [{url: '/api/gallery/photos/photo_2'}]});
  page.el('ugPhotoRemove').dispatch('click');
});

test('unmatched photo clues are saved as research without publishing or pretending a story exists', async () => {
  const page = setup(); await photo(page); page.el('ugPhotoForm').dispatch('submit');
  await page.respond(0, {ok: true, label_text: 'Vessel 123', candidates: [{query: 'Vessel 123', title: 'Vessel', confidence: 'low'}]});
  await page.respond(1, {ok: true, results: []});
  await page.respond(2, {ok: true, results: []});
  await page.respond(3, {ok: true, results: []});
  assert.equal(page.el('ugResearch').hidden, false);
  page.el('ugResearchSave').dispatch('click'); page.el('ugResearchSave').dispatch('click');
  assert.equal(page.requests.length, 5);
  assert.equal(page.requests[4].url, '/api/gallery/research');
  const body = JSON.parse(page.requests[4].options.body);
  assert.equal(body.candidate_clues[0].confidence, 'low');
  assert.equal(body.label_text, 'Vessel 123');
  assert.equal(body.photo, undefined);
  await page.respond(4, {ok: true, saved: true, id: 'r_123', status: 'needs_research'});
  assert.match(page.el('ugResearchStatus').textContent, /saved for research/);
  assert.match(page.el('ugResearchStatus').textContent, /photo stays private/);
  assert.match(page.el('ugFound').innerHTML, /Identity not yet verified/);
  page.el('ugPhotoRemove').dispatch('click');
});

test('a useful unidentified-photo description is saved automatically without inventing a title', async () => {
  const page = setup(); await photo(page);
  const description = 'A small bronze vessel with two handles and a raised geometric pattern.';
  await page.respond(0, {ok: false, reason: 'no_match', candidates: [], label_text: '', visual_description: description}, 200);
  assert.equal(page.requests[1].url, '/api/gallery/research');
  const body = JSON.parse(page.requests[1].options.body);
  assert.equal(body.query, '');
  assert.equal(body.visual_description, description);
  assert.equal(page.el('ugFind').value, '');
  await page.respond(1, {ok: true, saved: true, id: 'r_desc', status: 'needs_research'});
  assert.match(page.el('ugFound').innerHTML, /New discovery/);
  assert.match(page.el('ugFound').innerHTML, /Identity not yet verified/);
  assert.match(page.el('ugFound').innerHTML, /small bronze vessel/);
  assert.doesNotMatch(page.el('ugFound').innerHTML, /Provided by us|<img/);
  page.el('ugPhotoRemove').dispatch('click');
});

test('a blank or unusably short description does not create an imaginary discovery', async () => {
  const page = setup(); await photo(page);
  await page.respond(0, {ok: true, candidates: [], label_text: '', visual_description: 'Unknown'});
  assert.equal(page.requests.length, 1);
  assert.equal(page.el('ugIdentify').hidden, false);
  page.el('ugPhotoRemove').dispatch('click');
});

test('automatic discovery research is bounded to four catalogue queries with at most two parallel alternatives', async () => {
  const page = setup(); await photo(page);
  await page.respond(0, {ok: true, candidates: [{query: 'Name one', title: 'Name two', item_number: '123', confidence: 'high'}, {query: 'Name four'}]});
  await page.respond(1, {ok: true, results: []});
  await page.respond(2, {ok: true, results: []});
  assert.equal(page.requests.length, 5, 'only two alternatives begin together, fitting eight backend source slots');
  await page.respond(3, {ok: true, results: []});
  assert.equal(page.requests.length, 6, 'the remaining hypothesis gets a slot as soon as one finishes');
  await page.respond(4, {ok: true, results: []});
  await page.respond(5, {ok: true, results: []});
  assert.equal(page.requests.filter(request => /\/search\?/.test(request.url) && !/scope=archive/.test(request.url)).length, 4);
  assert.equal(page.requests[6].url, '/api/gallery/research');
  page.el('ugPhotoRemove').dispatch('click');
});

test('a strong third hypothesis leads with its explicit accession instead of free prose', async () => {
  const page = setup(); await photo(page);
  await page.respond(0, {ok: true, candidates: [
    {title: 'Weak first', query: 'Weak first', confidence: 'low'},
    {title: 'Possible second', query: 'Possible second', confidence: 'medium'},
    {title: 'Cypresses', query: 'Green trees painted by Van Gogh', item_number: '49.30', confidence: 'high'}
  ]});
  assert.equal(page.el('ugFind').value, '49.30');
  assert.equal(new URL(page.requests[1].url, page.ctx.location).searchParams.get('q'), '49.30');
  await page.respond(1, {ok: true, results: []});
  await page.respond(2, {ok: true, results: [{artifact_id: 'p_correct', title: 'Cypresses', confirmed: false}]});
  assert.equal(page.requests.length, 3, 'a useful result stops automatic alternate queries');
  assert.match(page.el('ugFound').innerHTML, /Cypresses/);
  assert.doesNotMatch(page.el('ugFound').innerHTML, /Provided by us/);
  page.el('ugPhotoRemove').dispatch('click');
});

test('all ranked identity hypotheses and useful OCR precede variants of a weak guess', async () => {
  const page = setup(); await photo(page);
  await page.respond(0, {ok: true, label_text: 'Bronze ceremonial vessel 1889', candidates: [
    {query: 'Weak guess', title: 'Another weak wording', confidence: 'low'},
    {query: 'Possible vessel', title: 'Another possible wording', confidence: 'medium'},
    {query: 'Best guess', title: 'Another best wording', confidence: 'high'}
  ]});
  await page.respond(1, {ok: true, results: []});
  await page.respond(2, {ok: true, results: []});
  assert.equal(page.requests.length, 5, 'two fallback searches are in flight');
  await page.respond(3, {ok: true, results: []});
  const queries = page.requests.filter(request => /\/search\?/.test(request.url) && !/scope=archive/.test(request.url))
    .map(request => new URL(request.url, page.ctx.location).searchParams.get('q'));
  assert.deepEqual(queries, ['Best guess', 'Possible vessel', 'Weak guess', 'Bronze ceremonial vessel 1889']);
  assert.equal(queries.includes('1889'), false, 'the year inside label text is not invented into an accession');
  await page.respond(4, {ok: true, results: []});
  await page.respond(5, {ok: true, results: [{artifact_id: 'p_ocr', title: 'The label match', confirmed: false}]});
  assert.match(page.el('ugFound').innerHTML, /The label match/);
  assert.equal(page.el('ugFind').value, 'Bronze ceremonial vessel 1889');
  page.el('ugPhotoRemove').dispatch('click');
});

test('a bare year in OCR is not treated as a concrete artifact label number', async () => {
  const page = setup(); await photo(page);
  await page.respond(0, {ok: true, label_text: '1889', candidates: []});
  assert.equal(page.requests.length, 1);
  assert.equal(page.el('ugFind').value, '');
  assert.equal(page.el('ugIdentify').hidden, false, 'unusable OCR keeps the existing retry available');
  assert.match(page.el('ugPhotoStatus').textContent, /could not identify a reliable match/);
  page.el('ugPhotoRemove').dispatch('click');
});

test('partial empty collections retry once and keep a private discovery instead of a definitive miss', async () => {
  const page = setup(); await photo(page);
  const description = 'A bronze vessel with a narrow neck and two decorative handles.';
  await page.respond(0, {ok: true, candidates: [{query: 'Bronze vessel'}], visual_description: description});
  await page.respond(1, {ok: true, results: []});
  await page.respond(2, {ok: true, results: [], partial: true, source_failures: 2});
  assert.equal(page.requests[3].url, page.requests[2].url, 'one catalogue retry, not another recognition call');
  await page.respond(3, {ok: true, results: [], partial: true, source_failures: 1});
  assert.equal(page.el('ugEmpty').hidden, true);
  assert.match(page.el('ugStatus').textContent, /Some collections are unavailable/);
  assert.equal(page.requests[4].url, '/api/gallery/research');
  assert.equal(JSON.parse(page.requests[4].options.body).visual_description, description);
  await page.respond(4, {ok: true, saved: true, id: 'r_partial'});
  assert.equal(page.el('ugStatus').textContent, 'Some collections are unavailable. We kept your discovery.');
  assert.match(page.el('ugFound').innerHTML, /Identity not yet verified/);
  assert.match(page.el('ugFound').innerHTML, /narrow neck/);
  assert.equal(page.requests.filter(request => /\/identify$/.test(request.url)).length, 1);
  assert.equal(page.requests.length, 5);
  page.el('ugPhotoRemove').dispatch('click');
});

test('failed catalogue HTTP requests get one safe retry and preserve useful recognition text', async () => {
  const page = setup(); await photo(page);
  const description = 'A carved stone figure holding a small round object in both hands.';
  await page.respond(0, {ok: true, candidates: [{query: 'Stone figure'}], label_text: 'Figure 123', visual_description: description});
  await page.respond(1, {ok: true, results: []});
  await page.respond(2, {ok: false, reason: 'temporary'}, 503);
  assert.equal(new URL(page.requests[3].url, page.ctx.location).searchParams.get('q'), 'Figure 123');
  await page.respond(3, {ok: false, reason: 'temporary'}, 503);
  assert.equal(page.requests[4].url, page.requests[2].url);
  await page.respond(4, {ok: false, reason: 'temporary'}, 503);
  assert.equal(page.requests[5].url, '/api/gallery/research');
  const body = JSON.parse(page.requests[5].options.body);
  assert.equal(body.visual_description, description);
  assert.equal(body.label_text, 'Figure 123');
  assert.equal(body.candidate_clues[0].query, 'Stone figure');
  await page.respond(5, {ok: true, saved: true, id: 'r_http'});
  assert.match(page.el('ugFound').innerHTML, /carved stone figure/);
  assert.equal(page.requests.length, 6);
  page.el('ugPhotoRemove').dispatch('click');
});

test('even storage failure leaves the useful description visible without claiming it was saved', async () => {
  const page = setup(); await photo(page);
  await page.respond(0, {ok: true, candidates: [], visual_description: 'A tall blue glass vase with a flared rim and slender base.'});
  await page.respond(1, {ok: false, reason: 'temporary'}, 503);
  assert.match(page.el('ugFound').innerHTML, /blue glass vase/);
  assert.match(page.el('ugFound').innerHTML, /request could not be saved/);
  assert.doesNotMatch(page.el('ugFound').innerHTML, /Saved for research|Provided by us/);
  assert.equal(page.el('ugResearchSave').disabled, false);
  page.el('ugPhotoRemove').dispatch('click');
});

test('a second photograph saves independently while stale research completion cannot replace its discovery', async () => {
  const page = setup(); await photo(page);
  await page.respond(0, {ok: true, candidates: [], visual_description: 'An old bronze bowl with a deeply patterned surface.'});
  assert.equal(page.requests[1].url, '/api/gallery/research');
  await photo(page);
  await page.respond(2, {ok: true, candidates: [], visual_description: 'A new blue glass vase with a broad and flared rim.'});
  assert.equal(page.requests[3].url, '/api/gallery/research', 'the older save does not block the new photograph');
  assert.match(JSON.parse(page.requests[3].options.body).visual_description, /new blue glass vase/);
  await page.respond(3, {ok: true, saved: true, id: 'r_new'});
  const current = page.el('ugFound').innerHTML;
  assert.match(current, /new blue glass vase/);
  await page.respond(1, {ok: true, saved: true, id: 'r_old'});
  assert.equal(page.el('ugFound').innerHTML, current);
  assert.equal(page.el('ugResearchSave').disabled, true);
  page.el('ugResearchSave').dispatch('click');
  assert.equal(page.requests.length, 4, 'a completed flow cannot duplicate its research save');
  page.el('ugPhotoRemove').dispatch('click');
});

test('rapid replacement photos bound research concurrency and resume only the current waiting flow', async () => {
  const page = setup();
  await photo(page); await page.respond(0, {ok: true, visual_description: 'First vessel with decorative handles and a wide base.'});
  await photo(page); await page.respond(2, {ok: true, visual_description: 'Second vessel with a painted band and a narrow neck.'});
  await photo(page); await page.respond(4, {ok: true, visual_description: 'Third vessel with a round opening and a raised foot.'});
  assert.equal(page.requests.length, 5, 'the third flow waits while two saves are in flight');
  await photo(page); await page.respond(5, {ok: true, visual_description: 'Fourth current vessel with a blue surface and two handles.'});
  assert.equal(page.requests.length, 6);
  await page.respond(1, {ok: true, saved: true, id: 'r_first'});
  assert.equal(page.requests[6].url, '/api/gallery/research');
  assert.match(JSON.parse(page.requests[6].options.body).visual_description, /Fourth current vessel/);
  await page.respond(3, {ok: true, saved: true, id: 'r_second'});
  assert.equal(page.requests.length, 7, 'abandoned queued flows do not start hidden background requests');
  await page.respond(6, {ok: true, saved: true, id: 'r_fourth'});
  assert.match(page.el('ugFound').innerHTML, /Fourth current vessel/);
  assert.doesNotMatch(page.el('ugFound').innerHTML, /Third vessel|Second vessel|First vessel/);
  page.el('ugPhotoRemove').dispatch('click');
});

test('four failed hypotheses share a single retry budget, never four paid recognition retries', async () => {
  const page = setup(); await photo(page);
  await page.respond(0, {ok: true, label_text: 'Museum label words', candidates: [
    {query: 'First hypothesis'}, {query: 'Second hypothesis'}, {query: 'Third hypothesis'}
  ]});
  await page.respond(1, {ok: true, results: []});
  await page.respond(2, {ok: true, results: [], partial: true});
  await page.respond(3, {ok: true, results: [], partial: true});
  await page.respond(4, {ok: true, results: [], partial: true});
  await page.respond(5, {ok: true, results: [], partial: true});
  assert.equal(page.requests[6].url, page.requests[2].url);
  await page.respond(6, {ok: true, results: [], partial: true});
  assert.equal(page.requests[7].url, '/api/gallery/research');
  assert.equal(page.requests.filter(request => /\/search\?/.test(request.url) && !/scope=archive/.test(request.url)).length, 5);
  assert.equal(page.requests.filter(request => /\/identify$/.test(request.url)).length, 1);
  page.el('ugPhotoRemove').dispatch('click');
});

test('a catalogue outage leaves the saved story visible and never replaces it with pending research', async () => {
  const page = setup(); await photo(page);
  await page.respond(0, {ok: true, candidates: [{query: 'Cypresses'}], visual_description: 'A painting of dark green trees under a softly patterned sky.'});
  await page.respond(1, {ok: true, results: [{artifact_id: 'a_saved', title: 'Cypresses', story_available: true, written: true}]});
  await page.respond(2, {ok: false, reason: 'temporary'}, 503);
  assert.match(page.el('ugFound').innerHTML, /Cypresses/);
  assert.match(page.el('ugFound').innerHTML, /Provided by us/);
  assert.match(page.el('ugStatus').textContent, /Some museum collections are unavailable/);
  assert.equal(page.requests.length, 3);
  assert.equal(page.requests.some(request => /\/research$/.test(request.url)), false);
  page.el('ugPhotoRemove').dispatch('click');
});

test('a failed archive lookup still searches the museum collections automatically', async () => {
  const page = setup(); await photo(page);
  await page.respond(0, {ok: true, candidates: [{query: 'Vessel'}]});
  await page.respond(1, {ok: false, reason: 'temporary'}, 503);
  assert.match(page.requests[2].url, /discover=0&origin=photo/);
  assert.doesNotMatch(page.requests[2].url, /scope=archive/);
  await page.respond(2, {ok: true, results: [{artifact_id: 'p_found', title: 'Found vessel', confirmed: false}]});
  assert.match(page.el('ugFound').innerHTML, /Found vessel/);
  assert.equal(page.requests.length, 3);
  page.el('ugPhotoRemove').dispatch('click');
});

test('late museum results never replace an artifact the visitor already opened', async () => {
  const page = setup('/universal-gallery?q=Cypresses&origin=photo');
  await page.respond(0, {ok: true, results: [{artifact_id: 'a_saved', title: 'Cypresses', story_available: true}]});
  const original = page.el('ugFound').innerHTML;
  const card = cardHost(page); card.click();
  await page.respond(1, {ok: true, results: [{artifact_id: 'p_other', title: 'Another work'}]});
  assert.equal(page.el('ugFound').innerHTML, original);
  assert.equal(page.requests.filter(request => /\/discover$/.test(request.url)).length, 1);
});

test('researched readings credit the historical museum source, its license and AI adaptation', async () => {
  const page = setup('/universal-gallery?q=Vessel&origin=photo');
  await page.respond(0, {ok: true, results: [{artifact_id: 'a_saved', title: 'Vessel', story_available: true}]});
  const card = cardHost(page); card.click();
  await page.respond(2, {ok: true, saved: true, artifact: {artifact_id: 'a_saved', title: 'Vessel', story_available: true}});
  await page.respond(3, {ok: true, text: 'The researched story.', lang: 'en', research_source: {
    label: 'Museum & Collection', url: 'https://example.org/museum/vessel',
    license: 'CC BY 4.0', license_url: 'https://creativecommons.org/licenses/by/4.0/', adapted: true
  }});
  const html = card.children.get('.ug-read-box').innerHTML;
  assert.match(html, /Historical source:/);
  assert.match(html, /Museum &amp; Collection/);
  assert.match(html, /href="https:\/\/example.org\/museum\/vessel"/);
  assert.match(html, /href="https:\/\/creativecommons.org\/licenses\/by\/4.0\/"/);
  assert.match(html, /CC BY 4.0.*Adapted with AI\./);
  assert.ok(html.indexOf('ug-research-source') > html.indexOf('ug-reading-text'));
});

test('row source attribution supports Chinese and never renders untrusted links or HTML', async () => {
  const page = setup('/universal-gallery?q=Vessel&origin=photo&lang=zh');
  await page.respond(0, {ok: true, results: [{artifact_id: 'a_saved', title: 'Vessel', story_available: true}]});
  const card = cardHost(page); card.click();
  await page.respond(2, {ok: true, saved: true, artifact: {artifact_id: 'a_saved', title: 'Vessel', story_available: true,
    research_source: {label: '<img src=x onerror=alert(1)>', url: 'javascript:alert(1)', license: '<script>unsafe</script>', license_url: 'data:text/html,unsafe', adapted: true}
  }});
  await page.respond(3, {ok: true, text: '藏品故事。', lang: 'zh'});
  const html = card.children.get('.ug-read-box').innerHTML;
  assert.match(html, /历史资料来源/);
  assert.match(html, /经 AI 辅助改编/);
  assert.match(html, /&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.match(html, /&lt;script&gt;unsafe&lt;\/script&gt;/);
  assert.doesNotMatch(html, /javascript:|data:text|<script>|<img src=x/);
});
