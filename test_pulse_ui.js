/* Isolated behavior checks for the shipped Pulse page. No browser, network or data writes. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, 'pulse.html'), 'utf8');
const source = html.match(/<script>([\s\S]*?)<\/script>/)[1];

class Element {
  constructor() { this.listeners = {}; this.dataset = {}; this.attributes = {}; this.hidden = false; this.disabled = false; this.open = false; this.value = ''; this.innerHTML = ''; this.textContent = ''; this.classes = new Set(); this.classList = {toggle: (name, yes) => yes ? this.classes.add(name) : this.classes.delete(name)}; }
  addEventListener(name, callback) { (this.listeners[name] ||= []).push(callback); }
  dispatch(name, extra = {}) { for (const callback of this.listeners[name] || []) callback.call(this, {target: this, preventDefault() {}, ...extra}); }
  setAttribute(name, value) { this.attributes[name] = value; }
  getAttribute(name) { return this.attributes[name]; }
  getBoundingClientRect() { return {left: 22, width: 346}; }
}
const flush = () => new Promise(resolve => setImmediate(resolve));
function fixture() {
  return {ok: true, online: 3, updated_at: new Date().toISOString(), traffic_available: true,
    period: {days: 7, label: 'Last 7 days', previous_start: '2026-08-29', previous_end: '2026-09-04'},
    selected: {visitors: 21, pageviews: 40, bookings: 2, tour_inquiries: 1, agent_signups: 0, driver_signups: 1},
    previous: {visitors: 14, pageviews: 20}, coverage: {previous_complete: true},
    daily: [{date: '2026-09-10', pageviews: 12, visitors: 5}, {date: '2026-09-11', pageviews: 28, visitors: 16}],
    d7: {visits: 21}, d30: {visits: 42}, channels: [{name: 'google', n: 14}], pages: [{name: '/a-very-long-path-without-any-spaces', n: 9}],
    languages: [{name: 'en', n: 12}], devices: [{name: 'mobile', n: 9}],
    worklist: {ok: true, total: 2, done: 0, have: 1},
    gallery: {available: true, artifacts: 20, written_artifacts: 10, stories: 13, english_stories: 10,
      writing: {backlog: 10, pending: 8, retry: 2, processing: 0}, research: {pending: 3},
      generation: {configured: true, attempted: 20, remaining: 980}, scout: {enabled: true, available: true, status: 'complete', queued_today: 4, daily_cap: 4}, worker: {status: 'retry'}}};
}
function setup() {
  const elements = new Map(), requests = [], timers = new Map(); let timerId = 0;
  const el = id => { if (!elements.has(id)) elements.set(id, new Element()); return elements.get(id); };
  for (const match of html.matchAll(/<[^>]+\bid="([^"]+)"[^>]*>/g)) el(match[1]).hidden = /\bhidden\b/.test(match[0]);
  const periods = [1, 7, 30].map(days => { const e = new Element(); e.dataset.days = String(days); return e; });
  const nav = ['spark', 'rspark'].flatMap(chart => [-1, 1].map(step => { const e = new Element(); e.dataset = {chart, step: String(step)}; return e; }));
  const document = new Element(); document.hidden = false; document.getElementById = el;
  document.querySelectorAll = selector => selector === '[data-days]' ? periods : selector === '[data-chart]' ? nav : nav.filter(e => selector === '[data-chart="' + e.dataset.chart + '"]');
  const window = new Element(), navigator = {onLine: true};
  const context = {document, window, navigator, console, AbortController,
    setTimeout(callback, delay) { const id = ++timerId; timers.set(id, {callback, delay}); return id; },
    clearTimeout(id) { timers.delete(id); }, setInterval() {},
    fetch(url, options) { return new Promise((resolve, reject) => { requests.push({url, options, resolve, reject}); }); }};
  vm.createContext(context); vm.runInContext(source, context);
  async function respond(index, data, status = 200) { requests[index].resolve({ok: status < 400, status, json: async () => data}); await flush(); }
  return {el, document, window, navigator, periods, nav, context, requests, timers, respond};
}

test('signed-in load shows period data but does not eagerly request the job list', async () => {
  const page = setup(); assert.equal(page.requests[0].url, '/api/pulse?days=7');
  await page.respond(0, fixture());
  assert.equal(page.el('app').hidden, false);
  assert.equal(page.el('tvis').textContent, '21');
  assert.match(page.el('visitorChange').textContent, /50%/);
  assert.equal(page.requests.filter(r => r.url === '/api/worklist').length, 0);
  page.el('wlcard').open = true; page.el('wlcard').dispatch('toggle');
  assert.equal(page.requests.filter(r => r.url === '/api/worklist').length, 1);
  page.el('wlcard').dispatch('toggle');
  assert.equal(page.requests.filter(r => r.url === '/api/worklist').length, 1);
});

test('period changes remain single flight and ignore the previous period response', async () => {
  const page = setup(); page.periods[2].dispatch('click');
  assert.equal(page.requests.length, 1);
  assert.equal(page.requests[0].options.signal.aborted, true);
  await page.respond(0, fixture());
  assert.equal(page.requests[1].url, '/api/pulse?days=30');
  assert.equal(page.el('app').hidden, true);
  const data = fixture(); data.period.days = 30; data.period.label = 'Last 30 days'; data.selected.visitors = 42;
  await page.respond(1, data); assert.equal(page.el('tvis').textContent, '42');
  assert.equal(page.el('periodLabel').textContent, 'Last 30 days');
});

test('401 shows the owner login without revealing data or polling', async () => {
  const page = setup(); await page.respond(0, {ok: false}, 401);
  assert.equal(page.el('login').hidden, false); assert.equal(page.el('app').hidden, true);
  assert.equal([...page.timers.values()].filter(t => t.delay === 45000).length, 0);
  assert.equal(page.requests.length, 1);
});

test('offline and stale data never retains an online-now claim', async () => {
  const page = setup(); await page.respond(0, fixture());
  page.navigator.onLine = false; page.window.dispatch('offline');
  assert.match(page.el('connection').textContent, /Offline.*last received/);
  assert.match(page.el('online').textContent, /at last update/);
  page.navigator.onLine = true; page.context.lastData.updated_at = new Date(Date.now() - 120000).toISOString();
  page.context.freshness(); assert.match(page.el('connection').textContent, /Update delayed/);
});

test('visibility pauses requests and the request deadline aborts a hung refresh', async () => {
  const page = setup(); const deadline = [...page.timers.values()].find(t => t.delay === 12000);
  deadline.callback(); assert.equal(page.requests[0].options.signal.aborted, true);
  page.document.hidden = true; page.document.dispatch('visibilitychange');
  await page.respond(0, fixture());
  assert.equal([...page.timers.values()].filter(t => t.delay === 45000).length, 0);
  const before = page.requests.length; page.context.load(false); assert.equal(page.requests.length, before);
});

test('missing counts stay unavailable and incomplete history has no growth claim', async () => {
  const page = setup(), data = fixture(); data.gallery = {available: false}; data.coverage.previous_complete = false;
  data.selected.visitors = null; data.selected.pageviews = null; data.traffic_available = false;
  await page.respond(0, data);
  assert.equal(page.el('gArtifacts').textContent, 'Unavailable');
  assert.equal(page.el('tvis').textContent, 'Unavailable');
  assert.equal(page.el('trafficChart').hidden, true);
  assert.match(page.el('visitorChange').textContent, /incomplete/);
  assert.match(page.el('languages').innerHTML, /Traffic records are unavailable/);
  assert.match(page.el('pages').innerHTML, /Traffic records are unavailable/);
});

test('stale persisted running and unavailable story index do not imply live success', async () => {
  const page = setup(), data = fixture();
  data.gallery.scout.status = 'running'; data.gallery.scout.last_started = (Date.now() - 86400000) / 1000;
  data.searches = {ok: true, total: 5, distinct: 2, unanswered: 0, canonical_available: false, unwritten: []};
  await page.respond(0, data);
  assert.match(page.el('galleryStatus').innerHTML, /completion has not been confirmed/);
  assert.doesNotMatch(page.el('galleryStatus').innerHTML, /now/);
  assert.match(page.el('srchunw').innerHTML, /Story status is unavailable/);
  assert.doesNotMatch(page.el('srchunw').innerHTML, /No unwritten/);
});

test('configured credentials do not claim credit or operational writing', async () => {
  const page = setup(); await page.respond(0, fixture());
  assert.match(page.el('galleryStatus').innerHTML, /AI key configured/);
  assert.match(page.el('galleryStatus').innerHTML, /does not confirm available credit/);
  assert.match(page.el('galleryStatus').innerHTML, /2 stories are waiting to retry/);
  assert.doesNotMatch(page.el('galleryStatus').innerHTML, /healthy|operational|ready/i);
});

test('chart supports exact values by touch and keyboard', async () => {
  const page = setup(); await page.respond(0, fixture());
  assert.match(page.el('chartValue').textContent, /28 page views, 16 visitors/);
  page.el('spark').dispatch('click', {clientX: 23});
  assert.match(page.el('chartValue').textContent, /12 page views, 5 visitors/);
  page.el('spark').dispatch('keydown', {key: 'ArrowRight'});
  assert.match(page.el('chartValue').textContent, /28 page views/);
});

test('changing chart periods preserves the selected date or defaults to the latest day', async () => {
  const page = setup(); await page.respond(0, fixture());
  page.periods[2].dispatch('click');
  const data = fixture(); data.period = {days: 30, label: 'Last 30 days'};
  data.daily = Array.from({length: 30}, (_, index) => ({date: new Date(Date.UTC(2026, 7, 13 + index)).toISOString().slice(0, 10), pageviews: index + 1}));
  await page.respond(page.requests.findIndex(r => r.url === '/api/pulse?days=30'), data);
  assert.equal(page.context.charts.spark.index, 29);
  assert.match(page.el('chartValue').textContent, /Sep 11: 30 page views/);
  page.context.chartSelect('spark', 28);
  page.context.chartPaint('spark', fixture().daily, 'views');
  assert.equal(page.context.charts.spark.index, 0);
  assert.match(page.el('chartValue').textContent, /Sep 10/);
  page.context.chartPaint('spark', [{date: '2026-09-12', pageviews: 5}, {date: '2026-09-13', pageviews: 8}], 'views');
  assert.equal(page.context.charts.spark.index, 1);
  assert.match(page.el('chartValue').textContent, /Sep 13/);
});

test('visitor labels stay concise and one story has singular retry wording', async () => {
  const page = setup(), data = fixture(); data.gallery.writing.retry = 1;
  await page.respond(0, data);
  assert.equal(page.el('visitorLabel').textContent, 'Daily visitors');
  assert.equal(page.el('visitorNote').textContent, 'Daily totals are added together. Repeat visitors count on each day.');
  assert.match(page.el('galleryStatus').innerHTML, /1 story is waiting to retry/);
});

test('worklist failures restore the check and summaries', async () => {
  const page = setup(); await page.respond(0, fixture());
  page.el('wlcard').open = true; page.el('wlcard').dispatch('toggle');
  const index = page.requests.findIndex(r => r.url === '/api/worklist');
  await page.respond(index, {ok: true, have: 1, regions: [{region: 'New York', total: 1, done: 0, towns: [{town: 'New York', places: [{qid: 'Q1', name: 'Museum', done: false}]}]}]});
  const button = new Element(); button.setAttribute('data-q', 'Q1');
  page.el('wlregions').dispatch('click', {target: {closest: selector => selector === '[data-q]' ? button : null}});
  assert.match(page.el('wlsum').textContent, /1 ticked/);
  const tick = page.requests.findIndex(r => r.url === '/api/worklist/tick');
  await page.respond(tick, {ok: false}, 500);
  assert.match(page.el('wlsum').textContent, /0 ticked/);
  assert.match(page.el('wlnote').textContent, /check mark has been restored/);
});

test('private source data is not rendered and long text uses wrapping rules', async () => {
  const page = setup(), data = fixture(); data.gallery.research.clues = 'PRIVATE_CLUE'; data.gallery.scout.last_error = 'SECRET_KEY';
  data.pages = [{name: '<script>alert(1)</script>', n: 1}]; await page.respond(0, data);
  assert.doesNotMatch(page.el('galleryDetails').innerHTML, /PRIVATE_CLUE|SECRET_KEY/);
  assert.match(page.el('pages').innerHTML, /&lt;script&gt;/);
  assert.match(html, /overflow-wrap:anywhere/);
  assert.match(html, /min-height:44px/);
  assert.doesNotMatch(html, /[\u2013\u2014]/);
  assert.doesNotMatch(html, /fonts\.googleapis|fonts\.gstatic/);
});
