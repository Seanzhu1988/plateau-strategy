/* Behavior regressions for the actual browser controller, with a minimal DOM.
 * Run: node --test test_gallery_ui.cjs. Visual and real-media QA is separate. */
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, 'gallery-ui.js'), 'utf8');

class Element {
  constructor() { this.listeners = {}; this.dataset = {}; this.value = ''; this.textContent = ''; this.innerHTML = ''; this.hidden = false; this.checked = false; this.disabled = false; this.classList = {toggle() {}, add() {}}; }
  addEventListener(name, handler) { (this.listeners[name] ||= []).push(handler); }
  dispatch(name, additions = {}) { for (const handler of this.listeners[name] || []) handler.call(this, {target: this, preventDefault() {}, ...additions}); }
  querySelectorAll() { return []; }
  setAttribute(name, value) { this[name] = value; }
  removeAttribute(name) { delete this[name]; }
  focus() {}
}

function setup(url = '/universal-gallery') {
  const elements = new Map();
  function el(id) { if (!elements.has(id)) elements.set(id, new Element()); return elements.get(id); }
  const doc = new Element();
  doc.getElementById = el;
  doc.querySelectorAll = () => [];
  doc.documentElement = {lang: 'en'};
  doc.body = {dataset: {galleryPage: 'search'}};
  doc.readyState = 'complete';
  const requests = [], timers = new Map();
  let timerId = 0, selectedLang = 'en';
  const browserWindow = new Element();
  browserWindow.psxLang = () => selectedLang;
  class MockFormData { constructor() { this.fields = {}; } append(key, value) { this.fields[key] = value; } }
  const ctx = {
    document: doc, window: browserWindow, location: new URL(url, 'http://example.test'),
    URL, URLSearchParams, AbortController, FormData: MockFormData, Set, console,
    setTimeout(callback) { const id = ++timerId; timers.set(id, callback); return id; },
    clearTimeout(id) { timers.delete(id); },
    fetch(requestURL, options = {}) { return new Promise((resolve, reject) => { requests.push({url: requestURL, options, resolve, reject}); }); }
  };
  ctx.history = {replaceState(_a, _b, next) { ctx.location = new URL(next, ctx.location.origin); }};
  vm.runInNewContext(source, ctx, {filename: 'gallery-ui.js'});
  function type(value) { el('ugFind').value = value; el('ugFind').dispatch('input'); }
  function runTimers() { const pending = Array.from(timers.values()); timers.clear(); pending.forEach(callback => callback()); }
  async function respond(index, body) { requests[index].resolve({ok: true, status: 200, json: async () => body}); await tick(); }
  function changeLanguage(value) { selectedLang = value; doc.documentElement.lang = value; doc.dispatch('psx:lang', {detail: value}); }
  return {el, ctx, requests, type, runTimers, respond, changeLanguage};
}
function tick() { return new Promise(resolve => setImmediate(resolve)); }

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

test('an explicit text search exits photo suggestion mode', () => {
  const page = setup('/universal-gallery?q=vessel&origin=photo&discover=0');
  page.type('49.30'); page.runTimers();
  assert.equal(page.requests.length, 2);
  assert.doesNotMatch(page.requests[1].url, /discover=0/);
  assert.equal(page.ctx.location.searchParams.has('origin'), false);
});

test('photo consent toggling cannot submit a second paid call while one is pending', async () => {
  const page = setup();
  const image = new Blob(['image bytes'], {type: 'image/jpeg'});
  page.el('ugUpload').files = [image]; page.el('ugUpload').dispatch('change');
  assert.equal(page.el('ugIdentify').disabled, true);
  page.el('ugPhotoConsent').checked = true; page.el('ugPhotoConsent').dispatch('change');
  assert.equal(page.el('ugIdentify').disabled, false);
  page.el('ugPhotoForm').dispatch('submit');
  assert.equal(page.requests.length, 1);
  assert.equal(page.requests[0].options.body.fields.consent, 'anthropic-photo-search-v1');
  page.el('ugPhotoConsent').checked = false; page.el('ugPhotoConsent').dispatch('change');
  page.el('ugPhotoConsent').checked = true; page.el('ugPhotoConsent').dispatch('change');
  assert.equal(page.el('ugIdentify').disabled, true);
  page.el('ugPhotoForm').dispatch('submit');
  assert.equal(page.requests.length, 1);
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
