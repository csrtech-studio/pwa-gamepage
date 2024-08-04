document.addEventListener('DOMContentLoaded', () => {
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                const opts ={
                    body : "Agregamos un Juego cada semana",
                    icon :"images/icons/favicon.ico"
                }
                const titleNotification ="Csr Tech Studio"
                new Notification (titleNotification,opts)
            } else {
                console.log('Notification permission denied.');
            }
        });
    }
});

