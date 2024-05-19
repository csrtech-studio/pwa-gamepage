const CACHE_NAME = 'tienda-de-videojuegos-v3'; // Cambiado a v3
const urlsToCache = [
    '/pwa-gamepage.github.io/',
    '/pwa-gamepage.github.io/index.html',
    '/pwa-gamepage.github.io/compras.html',
    '/pwa-gamepage.github.io/nosotros.html',
    '/pwa-gamepage.github.io/pago.html',
    '/pwa-gamepage.github.io/ventas.html',
    '/pwa-gamepage.github.io/offline.html',
    '/pwa-gamepage.github.io/css/style.css',
    '/pwa-gamepage.github.io/images/logo.png',
    '/pwa-gamepage.github.io/images/cart-count.png',
    '/pwa-gamepage.github.io/images/icons/image.jpg',
    '/pwa-gamepage.github.io/js/app.js',
    '/pwa-gamepage.github.io/js/notificationsHandler.js',
    '/pwa-gamepage.github.io/js/videojuegos.js'
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

function showNewGameNotification() {
    const title = '¡Nuevo juego añadido!';
    const options = {
        body: '¡Echa un vistazo a nuestra última adición en la sección de ventas!',
        icon: '/pwa-gamepage.github.io/images/icons/icon-192x192.png',
        badge: '/pwa-gamepage.github.io/images/icons/icon-192x192.png'
    };
    showNotification(title, options);
}

function showNotification(title, options) {
    if (Notification.permission === 'granted') {
        self.registration.showNotification(title, options);
    }
}
