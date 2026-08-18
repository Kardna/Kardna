/* global __uv$config, UVServiceWorker, $scramjetLoadWorker */
importScripts("/uv/uv.bundle.js");
importScripts("/uv/uv.config.js");
importScripts("/scram/scramjet.all.js");
importScripts(__uv$config.sw || "/uv/uv.sw.js");

const ultraviolet = new UVServiceWorker();
const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();
const scramjetReady = scramjet.loadConfig();

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (event) => {
  event.respondWith((async () => {
    const requestUrl = event.request.url;

    if (requestUrl.startsWith(self.location.origin + __uv$config.prefix)) {
      return ultraviolet.fetch(event);
    }

    if (scramjet.route(event)) {
      await scramjetReady;
      return scramjet.fetch(event);
    }

    return fetch(event.request);
  })());
});
