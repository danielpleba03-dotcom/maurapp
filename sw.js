const cacheName = 'maurapp-static-v4';
const assets = ['./','./style.css','./app.js','./recipes.js','./lunch-catalog.js','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event => event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(assets))));
self.addEventListener('activate',event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('maurapp-static-') && key !== cacheName).map(key => caches.delete(key))))));
self.addEventListener('fetch',event => {
  const request = event.request;
  if(request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(fetch(request).catch(async () => (await caches.match(request)) || (request.mode === 'navigate' ? await caches.match('./') : Response.error())));
});
