/* DivyaNexus offline shell: cache safe public assets; never cache account or API data. */
const CACHE = "divyanexus-stage-b-wave7-v1";
const SHELL_URL = new URL("./", self.registration.scope).toString();
const MANIFEST_URL = new URL("./manifest.webmanifest", self.registration.scope).toString();
const OFFLINE_URL = new URL("./offline.html", self.registration.scope).toString();
const ICON_192_URL = new URL("./assets/divyanexus/app-icon-192.png", self.registration.scope).toString();
const ICON_512_URL = new URL("./assets/divyanexus/app-icon-512.png", self.registration.scope).toString();
const OWNER_ARTWORK_URL = new URL("./assets/divyanexus/owner-selected-vision.webp", self.registration.scope).toString();
const APP_SHELL = [SHELL_URL, MANIFEST_URL, OFFLINE_URL, ICON_192_URL, ICON_512_URL, OWNER_ARTWORK_URL];

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

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const requestUrl = new URL(request.url);
  const sameOrigin = requestUrl.origin === self.location.origin;
  if (!sameOrigin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            event.waitUntil(caches.open(CACHE).then((cache) => cache.put(request, copy)));
          }
          return response;
        })
        .catch(async () => {
          const direct = await caches.match(request);
          if (direct) return direct;
          const shell = await caches.match(SHELL_URL);
          if (shell) return shell;
          return caches.match(OFFLINE_URL);
        }),
    );
    return;
  }

  const cacheableDestination = ["image", "style", "script", "font"].includes(request.destination);
  const cacheablePublicFile = ["manifest.webmanifest", "offline.html"].some((name) => requestUrl.pathname.endsWith(name));
  if (cacheableDestination || cacheablePublicFile) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const network = fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            event.waitUntil(caches.open(CACHE).then((cache) => cache.put(request, copy)));
          }
          return response;
        });
        return cached || network;
      }),
    );
  }
});
