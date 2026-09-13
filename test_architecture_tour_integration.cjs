// Isolated parent-page integration tests. No browser, server, paid API or real data writes.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const read = name => fs.readFileSync(path.join(__dirname, name), 'utf8');
const trail = read('freedom-trail.html'), book = read('destination-book.html'), landmarks = read('landmarks.html');
const between = (html, start, end) => html.slice(html.indexOf(start) + start.length, html.indexOf(end));
const trailKeys = vm.runInNewContext('(' + trail.match(/window\.FT_MODEL_BY_STOP\s*=\s*({[\s\S]*?});/)[1] + ')');

function environment() {
  const roots = [], documentEvents = {}, windowEvents = {};
  class Element {
    constructor(tag) {
      this.tagName = tag.toUpperCase(); this.children = []; this.parentNode = null;
      this.attributes = {}; this.style = {}; this.textContent = ''; this._classes = new Set();
      this.classList = { add: (...xs) => xs.forEach(x => this._classes.add(x)),
        remove: x => this._classes.delete(x), contains: x => this._classes.has(x) };
      if (tag === 'iframe') this.contentWindow = {};
    }
    get className() { return [...this._classes].join(' '); }
    set className(value) { this._classes = new Set(value.split(/\s+/).filter(Boolean)); }
    get isConnected() { return roots.includes(this) || !!(this.parentNode && this.parentNode.isConnected); }
    set innerHTML(value) { this.children.forEach(c => { c.parentNode = null; }); this.children = []; this._html = value; }
    get innerHTML() { return this._html || ''; }
    appendChild(child) { if (child.parentNode) child.remove(); this.children.push(child); child.parentNode = this; return child; }
    remove() { if (this.parentNode) this.parentNode.children = this.parentNode.children.filter(c => c !== this); this.parentNode = null; }
    setAttribute(key, value) { this.attributes[key] = String(value); }
    getAttribute(key) { return this.attributes[key] ?? null; }
    matches(selector) {
      if (selector.startsWith('.')) return this.classList.contains(selector.slice(1));
      if (selector.startsWith('[')) return [...selector.matchAll(/\[([^=\]]+)(?:="([^"]*)")?\]/g)]
        .every(m => m[2] === undefined ? Object.hasOwn(this.attributes, m[1]) : this.attributes[m[1]] === m[2]);
      return this.tagName === selector.toUpperCase();
    }
    querySelectorAll(selector) { return this.children.flatMap(c => [c, ...c.descendants()]).filter(c => c.matches(selector)); }
    descendants() { return this.children.flatMap(c => [c, ...c.descendants()]); }
    closest(selector) { return this.matches(selector) ? this : this.parentNode && this.parentNode.closest(selector); }
  }
  const all = () => roots.flatMap(r => [r, ...r.descendants()]);
  const document = {
    documentElement: { lang: 'en' },
    createElement: tag => new Element(tag),
    getElementById: id => all().find(el => el.id === id) || null,
    querySelectorAll: selector => all().filter(el => el.matches(selector)),
    querySelector: selector => all().find(el => el.matches(selector)) || null,
    addEventListener: (name, fn) => (documentEvents[name] ||= []).push(fn)
  };
  const window = { FT_MODEL_BY_STOP: trailKeys,
    addEventListener: (name, fn) => (windowEvents[name] ||= []).push(fn) };
  const ctx = vm.createContext({ document, window, location: { origin: 'https://example.test' }, URL, console });
  const root = (tag, id, className) => { const el = new Element(tag); el.id = id; el.className = className || ''; roots.push(el); return el; };
  return { ctx, document, window, root, setLanguage: value => { document.documentElement.lang = value === 'zh' ? 'zh-CN' : value; },
    fireDocument: (name, detail) => (documentEvents[name] || []).forEach(fn => fn({ type: name, detail })),
    message: value => (windowEvents.message || []).forEach(fn => fn(value)) };
}
function trailHarness() {
  const h = environment();
  for (const id of ['wrap', 'stage', 'pick', 'sub', 'note']) h.ctx[id] = h.root('div', id);
  for (const [n, key] of Object.entries(trailKeys)) {
    h.root('div', 'ftStopModel_' + n, 'ft-stop-model-host');
    const b = h.root('button', 'stop_' + n); b.setAttribute('data-ft-model', key); b.setAttribute('data-ft-stop', n);
    const p = h.document.createElement('button'); p.setAttribute('data-model', key); h.ctx.pick.appendChild(p);
  }
  vm.runInContext(between(trail, '// BEGIN FT_ARCHITECTURE_BRIDGE', '// END FT_ARCHITECTURE_BRIDGE'), h.ctx);
  return h;
}
function bookHarness() {
  const h = environment();
  vm.runInContext(between(book, '    const MODELS = ', '    /* The picture is a raster').replace(/^/, 'const MODELS = '), h.ctx);
  h.ctx.DATA = { entries: [{ name: 'Old State House', city: 'boston', page_slug: 'old-state-house' },
    { name: 'Massachusetts State House', city: 'boston' },
    { name: '9/11 Memorial and Museum', city: 'new-york', page_slug: '9-11-memorial-and-museum' }] };
  for (let i = 0; i < h.ctx.DATA.entries.length; i++) {
    h.root('div', 'm3d_' + i, 'm3d'); const b = h.root('button', 'button_' + i);
    b.setAttribute('data-architecture-entry', i);
  }
  vm.runInContext(between(book, '// BEGIN DB_ARCHITECTURE_BRIDGE', '// END DB_ARCHITECTURE_BRIDGE'), h.ctx);
  return h;
}

test('all edited classic inline scripts parse without running the app', () => {
  for (const [name, html] of [['trail', trail], ['book', book], ['landmarks', landmarks]]) {
    for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
      if (/src=|application\/ld\+json|type="module"/.test(m[1])) continue;
      assert.doesNotThrow(() => new vm.Script(m[2], { filename: name }));
    }
  }
});
test('Boston stop IDs preserve walking order and distinguish the two State Houses', () => {
  assert.deepEqual(Object.keys(trailKeys).map(Number), [2, 3, 8, 9, 11, 12, 13, 15, 16]);
  assert.equal(trailKeys[2], 'state-house'); assert.equal(trailKeys[9], 'old-state-house');
  assert.equal(trailKeys[3], 'park-street'); assert.equal(trailKeys[15], 'constitution');
});
test('actual stop rows expose the new model, leaving the original photo carousel intact', () => {
  assert.match(trail, /class="ft-model-open i18n-skip" data-ft-model=/);
  assert.match(trail, /class="ft-stop-model-host" id="ftStopModel_/);
  assert.match(trail, /pic\(s\.photos\[0\], 560\)/);
  assert.match(trail, /wireMiniShows\(\)/);
  assert.match(trail, /selected\(\)\.forEach\(function \(s\) \{ var seg = recording\(s\.n\)/);
  assert.match(trail, /audioLang === 'zh' \? '查看立体建筑与故事'/);
  assert.match(trail, /CustomEvent\('ft:stops-rendered', \{ detail: \{ language: audioLang \} \}\)/);
});
test('trail starts no iframe until a model is selected by its controller', () => {
  const h = trailHarness(); assert.equal(h.document.querySelectorAll('iframe').length, 0);
  vm.runInContext("openArchitecture('state-house', '2', 'ftStopModel_2')", h.ctx);
  const frame = h.document.querySelector('iframe'), url = new URL(frame.src, 'https://example.test');
  assert.equal(frame.loading, 'lazy'); assert.equal(url.pathname, '/architecture');
  assert.equal(url.searchParams.get('model'), 'state-house'); assert.equal(url.searchParams.get('stop'), '2');
  assert.equal(url.searchParams.get('source'), 'freedom-trail'); assert.equal(url.searchParams.get('embed'), '1');
  assert.equal(h.document.getElementById('stop_2').getAttribute('aria-expanded'), 'true');
});
test('trail switching between selected stop and model strip destroys the old iframe', () => {
  const h = trailHarness(); vm.runInContext("openArchitecture('state-house', '2', 'ftStopModel_2')", h.ctx);
  const first = h.document.querySelector('iframe');
  vm.runInContext("openArchitecture('old-state-house', '9', 'ftStopModel_9')", h.ctx);
  assert.equal(first.isConnected, false); assert.equal(h.document.querySelectorAll('iframe').length, 1);
  assert.equal(h.document.getElementById('stop_2').getAttribute('aria-expanded'), 'false');
  vm.runInContext("openArchitecture('constitution', null, 'ftArchitectureStage')", h.ctx);
  assert.equal(h.document.querySelectorAll('iframe').length, 1);
  assert.equal(h.document.getElementById('ftStopModel_9').children.length, 0);
});
test('trail language and stop-list rerenders preserve the chosen building', () => {
  const h = trailHarness(); vm.runInContext("openArchitecture('old-south', '8', 'ftStopModel_8')", h.ctx);
  const first = h.document.querySelector('iframe'); h.fireDocument('ft:stops-rendered');
  assert.equal(h.document.querySelector('iframe'), first, 'unchanged state does not churn WebGL');
  h.setLanguage('zh'); h.fireDocument('psx:lang', 'zh');
  assert.match(h.document.querySelector('iframe').src, /model=old-south&lang=zh/);
  h.document.getElementById('ftStopModel_8').innerHTML = ''; h.fireDocument('ft:stops-rendered');
  assert.equal(h.document.querySelectorAll('iframe').length, 1);
  assert.match(h.document.querySelector('iframe').src, /model=old-south&lang=zh/);
});
test('tour-only Chinese switch outranks unchanged page language and the not-yet-synced FT_GUIDE', () => {
  const h = trailHarness(); h.window.psxLang = () => 'en'; h.window.FT_GUIDE = { lang: 'en' };
  vm.runInContext("openArchitecture('old-south', '8', 'ftStopModel_8')", h.ctx);
  const first = h.document.querySelector('iframe');
  h.document.getElementById('ftStopModel_8').innerHTML = '';
  h.fireDocument('ft:stops-rendered', { language: 'zh' });
  const chinese = h.document.querySelector('iframe');
  assert.equal(h.document.documentElement.lang, 'en');
  assert.equal(h.window.psxLang(), 'en');
  assert.equal(h.window.FT_GUIDE.lang, 'en', 'syncTourAudio has not run yet');
  assert.equal(first.isConnected, false);
  assert.match(chinese.src, /model=old-south&lang=zh/);
  assert.equal(chinese.title, '立体建筑与目的地故事');
  assert.equal(h.document.getElementById('ftStopModel_8').children[1].textContent, '打开完整建筑页面');
  h.window.FT_GUIDE.lang = 'zh';
  h.fireDocument('ft:stops-rendered', { language: 'zh' });
  assert.equal(h.document.querySelector('iframe'), chinese, 'no duplicate rebuild after audio sync');
  h.fireDocument('ft:stops-rendered', { language: 'en' });
  assert.match(h.document.querySelector('iframe').src, /model=old-south&lang=en/);
  assert.equal(h.document.querySelectorAll('iframe').length, 1);
});
test('global document-language event resets the selected tour language without an invented accessor', () => {
  const h = trailHarness(); assert.equal(h.window.psxLang, undefined);
  h.fireDocument('ft:stops-rendered', { language: 'zh' });
  vm.runInContext("openArchitecture('state-house', '2', 'ftStopModel_2')", h.ctx);
  assert.match(h.document.querySelector('iframe').src, /lang=zh/);
  h.setLanguage('en'); h.fireDocument('psx:lang', 'en');
  assert.match(h.document.querySelector('iframe').src, /lang=en/);
  h.setLanguage('zh'); h.fireDocument('psx:lang', 'zh');
  assert.match(h.document.querySelector('iframe').src, /lang=zh/);
});
test('trail rejects unknown keys and closes the current model explicitly', () => {
  const h = trailHarness(); vm.runInContext("openArchitecture('missing', '2', 'ftStopModel_2')", h.ctx);
  assert.equal(h.document.querySelectorAll('iframe').length, 0);
  vm.runInContext("openArchitecture('state-house', '2', 'ftStopModel_2'); clearArchitecture()", h.ctx);
  assert.equal(h.document.querySelectorAll('iframe').length, 0);
});
for (const [label, harness, open] of [
  ['trail', trailHarness, "openArchitecture('state-house', '2', 'ftStopModel_2')"],
  ['book', bookHarness, "openArchitecture(0, 'old-state-house', document.getElementById('button_0'))"]
]) {
  test(label + ' accepts bounded resize messages only from its same-origin active iframe', () => {
    const h = harness(); vm.runInContext(open, h.ctx); const frame = h.document.querySelector('iframe');
    const send = (origin, source, height) => h.message({ origin, source, data: { type: 'architecture:height', height } });
    send('https://attacker.test', frame.contentWindow, 1700); assert.equal(frame.style.height, undefined);
    send('https://example.test', {}, 1700); assert.equal(frame.style.height, undefined);
    send('https://example.test', frame.contentWindow, 'bad'); assert.equal(frame.style.height, undefined);
    send('https://example.test', frame.contentWindow, 765.2); assert.equal(frame.style.height, '766px');
    send('https://example.test', frame.contentWindow, 2580); assert.equal(frame.style.height, '2580px');
    send('https://example.test', frame.contentWindow, 99999); assert.equal(frame.style.height, '4000px');
    send('https://example.test', frame.contentWindow, -100); assert.equal(frame.style.height, '400px');
  });
}
test('book routes Boston models and exact 9/11 slug to production architecture without lookalike matches', () => {
  const h = bookHarness(), get = entry => { h.ctx.entry = entry; return vm.runInContext('modelOf(entry)', h.ctx); };
  for (const name of ['USS Constitution', 'Faneuil Hall', 'Old North Church', 'Old South Meeting House',
    'Massachusetts State House', 'Old State House', 'Bunker Hill Monument', 'Paul Revere House', 'Park Street Church']) {
    assert.equal(get({ name })[1], 'architecture');
  }
  assert.equal(get({ page_slug: '9-11-memorial-and-museum', name: '九一一纪念园' })[2], 'world-trade-center');
  assert.equal(get({ name: 'One World Trade Center' })[2], 'world-trade-center');
  assert.equal(get({ name: 'Another 9/11 Memorial', page_slug: 'another-9-11-memorial' }), null);
  assert.equal(get({ name: 'Brooklyn Bridge' })[1], 'nyc');
  assert.equal(get({ name: 'Boston Common' }), null);
});
test('book maintains one selected iframe, validates its key, and preserves destination context', () => {
  const h = bookHarness(); vm.runInContext("openArchitecture(0, 'state-house', null)", h.ctx);
  assert.equal(h.document.querySelectorAll('iframe').length, 0, 'wrong-building key rejected');
  vm.runInContext("openArchitecture(0, 'old-state-house', document.getElementById('button_0'))", h.ctx);
  const first = h.document.querySelector('iframe');
  vm.runInContext("openArchitecture(2, 'world-trade-center', document.getElementById('button_2'))", h.ctx);
  assert.equal(first.isConnected, false); assert.equal(h.document.querySelectorAll('iframe').length, 1);
  const url = new URL(h.document.querySelector('iframe').src, 'https://example.test');
  assert.equal(url.searchParams.get('destination'), '9-11-memorial-and-museum');
  assert.equal(url.searchParams.get('source'), 'destination-book');
  vm.runInContext("openArchitecture(2, 'world-trade-center', document.getElementById('button_2'))", h.ctx);
  assert.equal(h.document.querySelectorAll('iframe').length, 0, 'second tap closes model');
});
test('book reopens current model after parent rerender, including language switches', () => {
  assert.match(book, /psx:lang[\s\S]{0,90}render\(\)/);
  assert.match(book, /const architectureToRestore = _activeArchitecture/);
  assert.match(book, /if \(button\) openArchitecture\(architectureToRestore\.i, architectureToRestore\.key, button\)/);
  const h = bookHarness(); h.setLanguage('zh');
  vm.runInContext("openArchitecture(0, 'old-state-house', null)", h.ctx);
  assert.match(h.document.querySelector('iframe').src, /lang=zh/);
});
test('new book actions do not display the retired model thumbnails', () => {
  const thumb = between(book, '    function modelThumb(e, i) {', '    /* ---------- the live model');
  assert.ok(thumb.indexOf("m[1] === 'architecture'") < thumb.indexOf('src="/thumbs/'));
  assert.match(thumb, /db-architecture-btn/);
  assert.doesNotMatch(book, /each one openable as a turnable 3D model/);
});
test('Peace Fountain offers bilingual sourced visitor information and remains a photograph', () => {
  assert.doesNotMatch(landmarks, /clears the private realism review|instead of invented geometry/);
  assert.match(landmarks, /peace-fountain-jay-dobkin\.jpg/);
  assert.match(landmarks, /gregwyattsculpture\.com\/bronze\/peace-fountain/);
  assert.match(landmarks, /stjohndivine\.org\/about\/blog\/1\/posts\/25/);
  const h = environment();
  for (const id of ['peaceFountainPhotoBadge', 'peaceFountainPhotoTitle', 'peaceFountainOrigin',
    'peaceFountainLook', 'worldTradeCenterLinkTitle', 'worldTradeCenterLinkCopy', 'worldTradeCenterExplore']) h.root('div', id);
  vm.runInContext(between(landmarks, '// BEGIN LANDMARK_VISITOR_COPY', '// END LANDMARK_VISITOR_COPY'), h.ctx);
  assert.match(h.document.getElementById('peaceFountainOrigin').textContent, /Greg Wyatt.*bronze.*1985/);
  assert.equal(h.document.getElementById('peaceFountainPhotoBadge').textContent, 'Photograph of the monument');
  h.setLanguage('zh'); h.fireDocument('psx:lang');
  assert.match(h.document.getElementById('peaceFountainOrigin').textContent, /1985年.*青铜/);
  assert.match(h.document.getElementById('worldTradeCenterExplore').href, /model=world-trade-center&lang=zh/);
});
