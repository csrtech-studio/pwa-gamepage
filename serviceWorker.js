const VERSION = "v01";
const CACHE_NAME = `video-game-store-${VERSION}`;
const appshell = [
    '/pwa-gamepage/',
    '/pwa-gamepage/index.html',
    '/pwa-gamepage/compras.html',
    '/pwa-gamepage/nosotros.html',
    '/pwa-gamepage/pago.html',
    '/pwa-gamepage/ventas.html',
    '/pwa-gamepage/offline.html',
    '/pwa-gamepage/css/style.css',
    '/pwa-gamepage/images/logo.png',
    '/pwa-gamepage/images/cart-count.png',
    '/pwa-gamepage/images/icons/image.jpg',
    '/pwa-gamepage/images/icons/favicon.ico',
    '/pwa-gamepage/js/app.js',
    '/pwa-gamepage/js/notificationsHandler.js',
    '/pwa-gamepage/js/videojuegos.js',
    '/pwa-gamepage/js/pago.js',
    '/pwa-gamepage/js/register-sw.js',
    '/pwa-gamepage/js/requestNotificationPermission.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache opened');
                return cache.addAll(appshell);
            })
            .catch(err => console.error('Failed to open cache: ', err))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Old cache deleted:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
