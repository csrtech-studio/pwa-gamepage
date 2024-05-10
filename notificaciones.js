
// Función para solicitar permiso y mostrar notificaciones
function mostrarNotificacionManual(titulo, contenido) {
    const options = {
        body: contenido,
        icon: 'ruta_a_la_icono.png'
    };

    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(titulo, options);
    } else if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification(titulo, options);
            }
        });
    }
}

// Solicitar permiso para mostrar notificaciones al cargar la página
if ('Notification' in window) {
    Notification.requestPermission();
}
