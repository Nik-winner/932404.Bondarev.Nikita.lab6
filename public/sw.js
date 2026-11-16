const CACHE_NAME = 'timer-app-cache-v1';
const urlsToCache = [
    '/',
    '/about',
    '/css/style.css',
    '/js/main.js',
    '/manifest.json',
    '/icons/deadline.png'
];

self.addEventListener('install', event => {
    console.log('[SW] Установка...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Кеширование ресурсов...');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('[SW] Кеширование завершено');
            })
    );
});

self.addEventListener('activate', event => {
    console.log('[SW] Активация...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Удаление старого кеша:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    console.log('[SW] Загружено из кеша:', event.request.url);
                    return response;
                }
                
                console.log('[SW] Загружено из сети:', event.request.url);
                return fetch(event.request)
                    .then(response => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        const responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    });
            })
            .catch(error => {
                console.error('[SW] Ошибка при обработке запроса:', error);
            })
    );
});