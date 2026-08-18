self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('returns').then(function(cache) {
      return cache.addAll([
	       './',
	       'index.html',
	       'style.css',
	       'main.js',
	       'favicon.svg',
	       'preview.png',
	       'icon.png'
	     ]);
    })
  );
});
 
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
