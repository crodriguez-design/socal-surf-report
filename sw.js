/* Offline helper (service worker) for SoCal Surf Check.
   - The app's own files (page, icons, manifest) are NETWORK-FIRST: with signal you
     always get the newest version; with no signal the last saved copy opens.
   - "no-cache" makes every request check with GitHub for a newer copy instead of
     reusing the browser's 10-minute copy (GitHub Pages sends max-age=600), so
     updates show up on the next open.
   - Forecast data is saved by the page itself (localStorage), not here.
   When you change this file, bump VERSION so phones drop the old copy. */
const VERSION = "surf-v4";
const SHELL = ["./", "./index.html", "./manifest.webmanifest",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png", "./icons/favicon-32.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION)
    .then(c => c.addAll(SHELL.map(u => new Request(u, { cache: "no-cache" }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;   // APIs go straight to the network
  // Fetch by URL (a page-navigation request can't be re-used with new options).
  const fresh = fetch(url.href, { cache: "no-cache", credentials: "same-origin" });
  e.respondWith(
    fresh
      .then(res => { if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); } return res; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match("./index.html")))
  );
});
