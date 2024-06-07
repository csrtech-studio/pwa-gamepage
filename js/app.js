
const comprarButton = document.getElementById('comprarButton');

comprarButton.addEventListener('click', () => {
    // Lógica para procesar la compra
    confirmarCompra();
});


function confirmarCompra() {
   
    alert('¡Gracias por tu compra! El Videojuego ha sido agregado a tu carrito.');
}

const carrito = [];


function agregarAlCarrito(videojuegos) {
    carrito.push(videojuegos);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();
}


function actualizarCarrito() {
    const carritoElement = document.getElementById('carrito');
    carritoElement.textContent = `Tienes ${carrito.length} videojuegos en tu carrito`;
}
actualizarCarrito();
