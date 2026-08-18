importScripts('/scram/scramjet.all.js');

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

function isStaticInternalAsset(request) {
  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return false;

  return (
    url.pathname === '/sw.js' ||
    url.pathname === '/scram.html' ||
    url.pathname === '/scram-launcher.js' ||
    url.pathname === '/scram/scramjet.all.js' ||
    url.pathname === '/scram/scramjet.bundle.js' ||
    url.pathname === '/scram/scramjet.sync.js' ||
    url.pathname === '/scram/scramjet.wasm.wasm' ||
    url.pathname.startsWith('/baremux/') ||
    url.pathname.startsWith('/libcurl/')
  );
}

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
  event.respondWith((async () => {
    if (isStaticInternalAsset(event.request)) {
      return fetch(event.request);
    }

    await scramjet.loadConfig();

    if (scramjet.route(event)) {
      return scramjet.fetch(event);
    }

    return fetch(event.request);
  })());
});