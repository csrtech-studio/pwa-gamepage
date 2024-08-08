// Get the cart from localStorage
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Display cart items
function mostrarCarrito() {
    const carritoLista = document.getElementById('carrito-lista');
    carritoLista.innerHTML = '';

    carrito.forEach((juego, index) => {
        const juegoElement = document.createElement('div');
        juegoElement.classList.add('juego-item');
        juegoElement.innerHTML = `
            <img src="${juego.imagen}" alt="${juego.nombre}" class="videojuego-image">
            <p class="videojuego-title">${juego.nombre} - $${juego.precio}</p>
            <button onclick="eliminarDelCarrito(${index})">Eliminar</button>
        `;
        carritoLista.appendChild(juegoElement);
    });

    actualizarTotal();
}

// Remove a product from the cart
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    mostrarCarrito();
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarritoUI();
}

// Update the total price in the cart
function actualizarTotal() {
    const total = carrito.reduce((sum, juego) => sum + juego.precio, 0);
    const totalElement = document.getElementById('total');
    totalElement.textContent = total.toFixed(2);
}

// Verify the payment form
function verificarPago(event) {
    event.preventDefault();

    const cardName = document.getElementById('card-name').value.trim();
    const cardNumber = document.getElementById('card-number').value.trim();
    const expiryDate = document.getElementById('expiry-date').value.trim();
    const cvv = document.getElementById('cvv').value.trim();
    const email = document.getElementById('email').value.trim();

    // Check if all fields are filled
    if (!cardName || !cardNumber || !expiryDate || !cvv ||!email) {
        alert('Please complete all fields.');
        return;
    }

    // If verification passes, show success message
    alert('Thank you for your purchase!  Your product will arrive at the email you registered!');
    carrito = [];
    localStorage.removeItem('carrito');
    mostrarCarrito();
    window.location.href = 'ventas.html'; // Redirect to the home page after purchase
}

// Update the cart counter in the navbar
function actualizarCarritoUI() {
    const cartCountElement = document.querySelector('.cart-count');
    cartCountElement.textContent = carrito.length;
}

// Initialize the page
window.addEventListener('load', () => {
    mostrarCarrito();
    actualizarCarritoUI();

    // Assign the verificarPago function to the form
    const paymentForm = document.getElementById('payment-form');
    paymentForm.addEventListener('submit', verificarPago);
});
