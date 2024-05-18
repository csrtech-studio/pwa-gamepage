const CACHE_NAME = 'tienda-de-videojuegos-v3'; // Cambiado a v3
const urlsToCache = [
    '/',
    '/index.html',
    '/compras.html',
    '/nosotros.html',
    '/pago.html',
    '/ventas.html',
    '/offline.html',
    '/css/style.css',
    '/images/logo.png',
    '/images/cart-count.png',
    '/images/icons/image.jpg',
    '/js/app.js',
    '/notificaciones.js',
    '/videojuegos.js'
    // Agrega más archivos CSS, imágenes y scripts según sea necesario
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache abierto');
                return cache.addAll(urlsToCache);
            })
            .catch(err => console.error('Fallo al abrir el cache: ', err))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Cache antiguo eliminado:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    if (event.request.url.includes('/ventas.html')) {
        event.respondWith(
            fetch(event.request).then(response => {
                if (response.ok) {
                    showNewGameNotification();
                }
                return response;
            }).catch(() => {
                return caches.match(event.request);
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    if (response) {
                        return response;
                    }
                    return fetch(event.request).then(
                        function(response) {
                            if (!response || response.status !== 200 || response.type !== 'basic') {
                                return caches.match('/offline.html');
                            }
                            var responseToCache = response.clone();
                            caches.open(CACHE_NAME)
                                .then(function(cache) {
                                    cache.put(event.request, responseToCache);
                                });
                            return response;
                        }
                    ).catch(() => {
                        return caches.match('/offline.html');
                    });
                })
        );
    }
});

function showNewGameNotification() {
    const title = '¡Nuevo juego añadido!';
    const options = {
        body: '¡Echa un vistazo a nuestra última adición en la sección de ventas!',
        icon: '/images/icons/icon-192x192.png',
        badge: '/images/icons/icon-192x192.png'
    };
    showNotification(title, options);
}