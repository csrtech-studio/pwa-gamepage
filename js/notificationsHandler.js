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

