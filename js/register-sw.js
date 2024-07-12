
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/pwa-gamepage/serviceWorker.js')
        .then(reg => console.log('Service Worker registrado', reg))
        .catch(err => console.log('Service Worker no registrado', err));
    });
}
