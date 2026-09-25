const CACHE = "monolog-v4";
const FILES = [
  "/",
  "/static/index.html",
  "/static/monolog.js",
  "/static/selfheal.js",
  "/static/speak.js",
  "/static/dev.js",
  "/static/manifest.json",
];

// install — кэшируем что можем, не падаем если чего-то нет
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.all(FILES.map(f => cache.add(f).catch(() => null)))
    ).then(() => self.skipWaiting())
  );
});

// activate — чистим старые кэши
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// fetch — кэш сначала, сеть потом, fallback в конце
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;

  // /api/ — всегда сеть, при офлайне отдаём пустое
  if (e.request.url.includes("/api/")) {
    e.respondWith(
      fetch(e.request).catch(() => new Response("{}", {
        headers: { "Content-Type": "application/json" }
      }))
    );
    return;
  }

  // остальное — кэш → сеть → fallback
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match("/static/index.html"));
    })
  );
});