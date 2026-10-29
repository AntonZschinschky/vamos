// Service Worker: Cache-first für alles (offline-fähig). Bei JEDER Änderung CACHE hochzählen!
const CACHE = 'vamos-v2';

// Kern-Dateien (tools/validate.mjs prüft, dass die Liste vollständig ist). Kartenbilder schickt die App
// nach dem Start per Nachricht (siehe js/app.js), alles andere wird beim ersten Abruf gespeichert.
const CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/app.css',
  './js/app.js',
  './js/cards.js',
  './js/content.js',
  './js/ctx.js',
  './js/dom.js',
  './js/exercises.js',
  './js/exgen.js',
  './js/news.js',
  './js/scene.js',
  './js/session.js',
  './js/sound.js',
  './js/speech.js',
  './js/srs.js',
  './js/store.js',
  './js/util.js',
  './js/views/cardview.js',
  './js/views/collection.js',
  './js/views/home.js',
  './js/views/onboarding.js',
  './js/views/phrases.js',
  './js/views/player.js',
  './js/views/route.js',
  './js/views/settings.js',
  './data/cards.js',
  './data/index.js',
  './data/news.js',
  './data/units/u1.js',
  './data/units/u2.js',
  './data/units/u3.js',
  './data/units/u4.js',
  './data/units/u5.js',
  './data/units/u6.js',
  './data/units/u7.js',
  './data/units/u8.js',
  './fonts/cormorant-garamond-latin-500-italic.woff2',
  './fonts/cormorant-garamond-latin-500-normal.woff2',
  './fonts/cormorant-garamond-latin-600-normal.woff2',
  './fonts/cormorant-garamond-latin-700-normal.woff2',
  './fonts/eb-garamond-latin-400-italic.woff2',
  './fonts/eb-garamond-latin-400-normal.woff2',
  './fonts/eb-garamond-latin-600-normal.woff2',
  './img/icon.svg',
  './img/icon-180.png',
  './img/icon-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('vamos-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('message', (e) => {
  const d = e.data || {};
  if (d.type === 'precache' && Array.isArray(d.urls)) {
    e.waitUntil(caches.open(CACHE).then((c) =>
      Promise.all(d.urls.map((u) => c.match(u).then((hit) => hit || c.add(u).catch(() => null))))));
  }
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(caches.match('./index.html').then((hit) => hit || fetch(req)));
    return;
  }
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req).then((res) => {
      if (res && res.ok && res.type === 'basic') {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
      }
      return res;
    })),
  );
});
