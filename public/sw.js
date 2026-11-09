// Offline support: keeps the map working on a phone when signal drops inside the Gardens.
// Same-origin files are network-first (so a new deploy shows up straight away), with the cache as a fallback.
// Bump VERSION when you change the list of core files.
const VERSION = "gbtb-v2";
const CORE = ["/", "/css/styles.css", "/js/config.js", "/js/app.js", "/js/qrcode.js", "/assets/favicon.svg", "/manifest.webmanifest"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

function networkFirst(req, cacheKey) {
  return fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(cacheKey || req, copy)); }
    return res;
  }).catch(() => caches.match(cacheKey || req).then(hit => hit || caches.match("/")));
}

function cacheFirst(req) {
  return caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res.ok || res.type === "opaque") { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
    return res;
  }));
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (url.origin === self.location.origin) {
    if (url.pathname === "/health" || url.pathname === "/sw.js") return;
    // Every page address (/, /kiosk, /p/...) is the same single-page app.
    if (req.mode === "navigate") return e.respondWith(networkFirst(req, "/"));
    return e.respondWith(networkFirst(req));
  }
  // Google Fonts never change at a given URL, so cache them for good.
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") e.respondWith(cacheFirst(req));
});
