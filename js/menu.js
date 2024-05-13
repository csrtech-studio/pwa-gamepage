const navbar = document.getElementById('navbar');

document.addEventListener('mousemove', (event) => {
    // Si el cursor se mueve hacia arriba (hacia la barra de navegación)
    if (event.clientY < 40) {
        navbar.classList.remove('hidden');
    } else {
        navbar.classList.add('hidden');
    }
});
