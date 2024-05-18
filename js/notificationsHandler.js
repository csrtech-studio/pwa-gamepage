// notificationsHandler.js

function showNewGameNotification() {
    const title = '¡Nuevo juego añadido!';
    const options = {
        body: '¡Echa un vistazo a nuestra última adición en la sección de ventas!',
        icon: '/images/icons/icon-192x192.png',
        badge: '/images/icons/icon-192x192.png'
    };
    showNotification(title, options);
}
