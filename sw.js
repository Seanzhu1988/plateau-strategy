/* The walking guide's service worker — deliberately timid.
 *
 * It exists for exactly two reasons: installing the guide to a home screen
 * requires one, and a walker in an airport basement deserves the SHELL of the
 * app to open even when the connection has gone — the page, the geometry, the
 * styles. It caches the short list below and touches NOTHING else: every API
 * call, every other page, every POST passes straight through to the network,
 * because a cache that quietly serves stale data to the rest of this site is
 * a bug factory nobody asked for.
 *
 * Network-first even for the shell: a deploy must win over a cache the moment
 * the connection is back. The cache is the fallback, never the preference.
 */
var CACHE = "psx-walk-v1";
var SHELL = [
  "/walk", "/footprint", "/footprints-demo",
  "/walk-guide.js", "/psx-net.js",
  "/paper.css", "/modern.css",
  "/plateau-logo.svg", "/plateau-logo.png",
  "/manifest.webmanifest"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(SHELL); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; })
                             .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  if (SHELL.indexOf(url.pathname) === -1) return;   // everything else: untouched
  e.respondWith(
    fetch(e.request).then(function (r) {
      var copy = r.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      return r;
    }).catch(function () { return caches.match(e.request); })
  );
});
