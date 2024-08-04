// Obtener el carrito desde el localStorage
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para actualizar el contador del carrito en el navbar
function actualizarCarritoUI() {
    const cartCountElement = document.querySelector('.cart-count');
    cartCountElement.textContent = carrito.length;
}

// Función para agregar al carrito
function agregarAlCarrito(nombre, precio) {
    carrito.push({ nombre, precio });
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarritoUI();
}

// Función para ir al carrito
function irACarrito() {
    if (carrito.length === 0) {
        alert('No has agregado aún productos al carrito.');
    } else {
        window.location.href = 'pago.html'; // Cambia 'pago.html' por la página de pago
    }
}

// Función para comprar ahora
function comprarAhora(nombre, precio) {
    carrito.push({ nombre, precio });
    localStorage.setItem('carrito', JSON.stringify(carrito));
    window.location.href = 'pago.html'; // Cambia 'pago.html' por la página de pago
}

// Inicializar el contador del carrito al cargar la página
window.addEventListener('load', () => {
    actualizarCarritoUI();
});
