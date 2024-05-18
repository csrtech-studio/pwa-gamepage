if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
        .then(reg => console.log('Service Worker registrado'))
        .catch(err => console.log('Service Worker no registrado', err));
    });
}
