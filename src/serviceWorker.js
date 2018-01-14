const CACHE_NAME = 'service-worker-example-cache';
const urlsToCache = ['/', '/bundle.js'];

self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        }),
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            // Cache hit - return response
            if (response) {
                return response;
            }
            return fetch(event.request);
        }),
    );
});

self.addEventListener('push', function(event) {
    console.log('Received a push message', event);

    var title = 'Yay a message.';
    var body = 'We have received a push message.';
    var tag = 'simple-push-demo-notification-tag';

    event.waitUntil(
        self.registration.showNotification(title, {
            body: body,
            tag: tag,
        }),
    );
});
