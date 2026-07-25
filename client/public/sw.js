/* DivyaNexus offline shell: cache safe public shell assets; never cache private account or API data. */
const CACHE = "divyanexus-stage-b-v1";
const SHELL_URL = new URL("./", self.registration.scope).toString();
const MANIFEST_URL = new URL("./manifest.webmanifest", self.registration.scope).toString();
const APP_SHELL = [SHELL_URL, MANIFEST_URL];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then((response) => {
      const clone = response.clone();
      caches.open(CACHE).then((cache) => cache.put(SHELL_URL, clone));
      return response;
    }).catch(() => caches.match(SHELL_URL)));
    return;
  }
  if (request.url.includes("/manus-storage/") || request.destination === "image" || request.destination === "style" || request.destination === "script") {
    event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      if (response.ok && new URL(request.url).origin === self.location.origin) caches.open(CACHE).then((cache) => cache.put(request, response.clone()));
      return response;
    })));
  }
});
