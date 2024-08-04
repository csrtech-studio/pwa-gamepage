// Obtener el carrito desde el localStorage
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Mostrar los elementos del carrito
function mostrarCarrito() {
    const carritoLista = document.getElementById('carrito-lista');
    carritoLista.innerHTML = '';

    carrito.forEach((juego, index) => {
        const juegoElement = document.createElement('div');
        juegoElement.classList.add('juego-item');
        juegoElement.innerHTML = `
            <p>${juego.nombre} - $${juego.precio}</p>
            <button onclick="eliminarDelCarrito(${index})">Eliminar</button>
        `;
        carritoLista.appendChild(juegoElement);
    });

    actualizarTotal();
}

// Eliminar un producto del carrito
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    mostrarCarrito();
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarritoUI();
}

// Actualizar el total del carrito
function actualizarTotal() {
    const total = carrito.reduce((sum, juego) => sum + juego.precio, 0);
    const totalElement = document.getElementById('total');
    totalElement.textContent = total.toFixed(2);
}

// Verificar el formulario de pago
function verificarPago(event) {
    event.preventDefault();

    const cardName = document.getElementById('card-name').value.trim();
    const cardNumber = document.getElementById('card-number').value.trim();
    const expiryDate = document.getElementById('expiry-date').value.trim();
    const cvv = document.getElementById('cvv').value.trim();

    // Verificar que todos los campos estén llenos
    if (!cardName || !cardNumber || !expiryDate || !cvv) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    // Si pasa la verificación, mostrar mensaje de éxito
    alert('¡Gracias por tu compra!');
    carrito = [];
    localStorage.removeItem('carrito');
    mostrarCarrito();
    window.location.href = 'index.html'; // Redirigir a la página de inicio después de la compra
}

// Actualizar el contador del carrito en el navbar
function actualizarCarritoUI() {
    const cartCountElement = document.querySelector('.cart-count');
    cartCountElement.textContent = carrito.length;
}

window.addEventListener('load', () => {
    mostrarCarrito();
    actualizarCarritoUI();

    // Asignar la función verificarPago al formulario
    const paymentForm = document.getElementById('payment-form');
    paymentForm.addEventListener('submit', verificarPago);
});
