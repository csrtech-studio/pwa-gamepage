document.addEventListener('DOMContentLoaded', () => {
    const ventasLink = document.getElementById('ventas-link');

    ventasLink.addEventListener('click', (event) => {
        // Previene la navegación inmediata
        event.preventDefault();
        
        // Muestra la notificación
        showNewGameNotification();

        // Navega a ventas.html después de un pequeño retraso
        setTimeout(() => {
            window.location.href = 'ventas.html';
        }, 1000); // Ajusta el tiempo según sea necesario
    });
});

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
