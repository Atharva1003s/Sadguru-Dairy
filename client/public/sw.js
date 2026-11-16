// Service worker for Sadguru Dairy PWA
const CACHE_NAME = 'sadguru-dairy-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Let browser handle requests normally with network-first fallback
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
