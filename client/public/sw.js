// DSAvation Service Worker
const CACHE_NAME = 'dsavation-pwa-v3';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/manifest.webmanifest',
  '/technovation-logo.png',
  '/technovation-logo-transparent.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch(() => {});
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
          return null;
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Let all API calls bypass the service worker cache
  if (event.request.url.includes('/api/')) return;
  // Navigation requests: network first with cache fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html'))
    );
    return;
  }
  // Static assets: cache first, fall back to network
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
