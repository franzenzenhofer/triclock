/* eslint-disable */
// TRICLOCK Service Worker — Network-first, offline shell only
// Version updated by build script
const CACHE = 'triclock-v1.0.103';
const SHELL = ['/'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }));
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (e) {
  e.respondWith(
    fetch(e.request).catch(function () {
      if (e.request.mode === 'navigate') {
        return caches.match('/');
      }
      return caches.match(e.request);
    })
  );
});
