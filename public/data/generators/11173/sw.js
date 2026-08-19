const contentToCache = [
        "./",
        "manifest.json",
        "index.html",
        "main.js",
        "favicon.png",
        "preview.jpg",
        "icon.png",
];

self.addEventListener("install", (e) => {
        e.waitUntil(
                (async () => {
                        const cache = await caches.open("agglo1");
                        await cache.addAll(contentToCache);
                })()
        );
});

self.addEventListener("fetch", (e) => {
        e.respondWith(
                (async () => {
                        const r = await caches.match(e.request);
                        //console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
                        if (r) {
                                return r;
                        }
                        const response = await fetch(e.request);
                        const cache = await caches.open(cacheName);
                        //console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
                        cache.put(e.request, response.clone());
                        return response;
                })()
        );
});
