
export type { };
declare const self: ServiceWorkerGlobalScope;

/**
 * The cache name should change every time you want to "cache bust"
 * i.e. if you want to change these files
 * in a real-world app this would be handled by your build system
 * e.g. Vite or Next.js would hash the files so the name is unique based on content
 * (style-XYZ123.css etc)
 */
const cacheName = "dameo-cache-v1";
const urlsToCache = [
  "/DameoJS/",
  "/DameoJS/cycle-button.svg",
  "/DameoJS/dropdown-button.svg",
  "/DameoJS/undo-button.svg",
  "/DameoJS/icon-32.png",
  "/DameoJS/pwa.json",
  "/DameoJS/icon-144.png",
  "/DameoJS/index.html",
  "/DameoJS/index.css",
  "/DameoJS/serviceWorker.js",
  "/DameoJS/index.js"
];

/**
 * Listen for the install event, which fires when the service worker is installing.
 * We use event.waitUntil() to ensure the install doesn't finished until our promise resolves
 * so we don't do anything else until the initial caching is done.
 */
self.addEventListener("install", (event) => {
  console.log("Installing");
  self.skipWaiting();
  event.waitUntil(cacheAssets());
});

async function cacheAssets() {
  const cache = await self.caches.open(cacheName);
  return cache.addAll(urlsToCache);
}

/**
 * Listen for the activate event, which is fired after installation
 * Activate is when the service worker actually takes over from the previous
 * version, which is a good time to clean up old caches.
 * Again we use waitUntil() to ensure we don't move on until the old caches are deleted.
 */
self.addEventListener("activate", (event) => {
  console.log("Activating");

  event.waitUntil(deleteOldCaches());
});

async function deleteOldCaches() {
  // Get the keys of all the old caches
  const keys = await caches.keys();

  const deletePromises = keys
    .filter(key => key !== cacheName)
    .map(key => self.caches.delete(key));

  return Promise.all(deletePromises);
}

/**
 * Listen for browser fetch events.
 * These fire any time the browser tries to load anything.
 * This isn't just fetch() calls; clicking a <a href> triggers it too.
 */
self.addEventListener("fetch", (event) => {
  console.log("Fetching");

  event.respondWith(getResponse(event.request));
});

/**
 * We follow the "stale-while-revalidate" pattern:
 * respond with the cached response immediately (if we have one)
 * even though this might be "stale" (not the most recent version).
 * In the background fetch the latest version and put that into cache
 * on next request the user will get the latest version
 */
async function getResponse(request: Request) {
  const cache = await self.caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  // Important: we do not await here, since that would defeat the point of using the cache
  const pendingResponse = fetch(request).then(response => {
    cache.put(request, response.clone());
    return response;
  });

  return cachedResponse || pendingResponse;
}