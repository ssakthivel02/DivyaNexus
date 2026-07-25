/* DivyaNexus offline shell: cache safe public assets; never cache account or API data. */
const CACHE = "divyanexus-stage-b-v2";
const SHELL_URL = new URL("./", self.registration.scope).toString();
const MANIFEST_URL = new URL("./manifest.webmanifest", self.registration.scope).toString();
const APP_SHELL = [SHELL_URL, MANIFEST_URL];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const requestUrl = new URL(request.url);
  const sameOrigin = requestUrl.origin === self.location.origin;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok && sameOrigin) {
            caches.open(CACHE).then((cache) => cache.put(SHELL_URL, response.clone()));
          }
          return response;
        })
        .catch(() => caches.match(SHELL_URL)),
    );
    return;
  }

  const cacheableDestination = ["image", "style", "script", "font"].includes(request.destination);
  if (sameOrigin && cacheableDestination) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              caches.open(CACHE).then((cache) => cache.put(request, response.clone()));
            }
            return response;
          }),
      ),
    );
  }
});
