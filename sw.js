/* Cloud Cross Terminal service worker
   - app shell is cached so the terminal opens instantly and offline
   - Alpaca market-data requests are NEVER touched (always live network)
   - bump VERSION on each release so installed copies update */
const VERSION = 'cct-v3';
const SHELL = [
  './', './index.html', './manifest.webmanifest', './lightweight-charts.js',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png', './icons/favicon-32.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if(req.method !== 'GET' || url.origin !== self.location.origin) return;   /* Alpaca + everything cross-origin: straight to network */

  if(req.mode === 'navigate'){                                            /* page: network first so updates land, cache fallback offline */
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone(); caches.open(VERSION).then(c => c.put('./index.html', copy)); return res;
      }).catch(() => caches.match('./index.html'))
    );
    return;
  }
  e.respondWith(                                                           /* static assets: cache first, refresh in background */
    caches.match(req).then(hit => {
      const net = fetch(req).then(res => {
        if(res && res.ok){ const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
