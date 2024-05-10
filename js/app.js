// Obtenemos la referencia al botón de compra
const comprarButton = document.getElementById('comprarButton');

// Agregamos un event listener para escuchar el click en el botón de compra
comprarButton.addEventListener('click', () => {
    // Lógica para procesar la compra
    confirmarCompra();
});

// Función para confirmar la compra
function confirmarCompra() {
    // Aquí podrías agregar lógica para procesar el pago, actualizar el carrito, etc.
    alert('¡Gracias por tu compra! El perfume ha sido agregado a tu carrito.');
}

// Ejemplo de cómo podrías manejar el carrito de compras utilizando localStorage
const carrito = [];

// Función para agregar un perfume al carrito
function agregarAlCarrito(perfume) {
    carrito.push(perfume);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();
}

// Función para actualizar la visualización del carrito en la interfaz
function actualizarCarrito() {
    const carritoElement = document.getElementById('carrito');
    carritoElement.textContent = `Tienes ${carrito.length} perfumes en tu carrito`;
}

// Llamamos a la función actualizarCarrito al cargar la página para mostrar el estado actual del carrito
actualizarCarrito();
