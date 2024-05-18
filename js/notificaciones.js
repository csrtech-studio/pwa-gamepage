function showNotification(title, options) {
    if (Notification.permission === 'granted') {
        navigator.serviceWorker.getRegistration().then(registration => {
            if (registration) {
                registration.showNotification(title, options);
            } else {
                console.log('No Service Worker registration found.');
            }
        });
    } else {
        console.log('Notification permission not granted.');
    }
}

function showNewGameNotification() {
    const title = '¡Nuevo juego añadido!';
    const options = {
        body: '¡Echa un vistazo a nuestra última adición en la sección de ventas!',
        icon: '/images/icons/icon-192x192.png',
        badge: '/images/icons/icon-192x192.png'
    };
    showNotification(title, options);
}
