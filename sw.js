const cacheName = 'maurapp-static-v7';
const assets = ['./','./style.css?v=7','./app.js?v=7','./recipes.js?v=7','./lunch-catalog.js?v=7','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png'];

self.addEventListener('install',event => {
  event.waitUntil(caches.open(cacheName)
    .then(cache => cache.addAll(assets.map(url => new Request(url,{cache:'reload'}))))
    .then(() => self.skipWaiting()));
});
self.addEventListener('activate',event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(key => key.startsWith('maurapp-static-') && key !== cacheName).map(key => caches.delete(key))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch',event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(fetch(request).catch(async () => {
    const cache = await caches.open(cacheName);
    return (await cache.match(request)) || (request.mode === 'navigate' ? await cache.match('./') : Response.error());
  }));
});
