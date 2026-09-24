const CACHE = "monolog-v1";
const FILES = [
  "/static/index.html",
  "/static/monolog.js",
  "/static/manifest.json",
  "/static/icon-192.png",
  "/static/icon-512.png",
];

// Установка: кешируем все файлы
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(FILES))
      .then(() => self.skipWaiting())
  );
});

// Активация: чистим старые кеши
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: отдаём из кеша, если есть
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => r || fetch(e.request))
  );
});