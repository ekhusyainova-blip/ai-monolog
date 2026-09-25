const CACHE = "monolog-v3";
const FILES = [
  "/",
  "/static/index.html",
  "/static/monolog.js",
  "/static/selfheal.js",
  "/static/speak.js",
  "/static/dev.js",
  "/static/manifest.json",
  "/static/icon-192.png",
  "/static/icon-512.png",
];

// установка — кэшируем всё что есть
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => {
      // по одному — чтобы один недоступный файл не ломал всё
      return Promise.all(
        FILES.map(f => cache.add(f).catch(() => null))
      );
    }).then(() => self.skipWaiting())
  );
});

// активация — чистим старые кэши
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// fetch — отдаём из кэша, иначе пробуем сеть, иначе fallback
self.addEventListener("fetch", (e) => {
  // только GET
  if (e.request.method !== "GET") return;

  // api/config — всегда сеть сначала
  if (e.request.url.includes("/api/")) {
    e.respondWith(
      fetch(e.request).catch(() => new Response("{}", {
        headers: { "Content-Type": "application/json" }
      }))
    );
    return;
  }

  // всё остальное — кэш сначала
  e.respondWith(
    caches.match(e.request).then((r) => {
      if (r) return r;
      return fetch(e.request).then((res) => {
        // кэшируем на лету
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => {
        // офлайн fallback — index.html
        return caches.match("/static/index.html");
      });
    })
  );
});