
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/pwa-gamepage/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registered successfully: ', registration);
            })
            .catch(error => {
                console.error('Error registering ServiceWorker: ', error);
            });
    });
}
