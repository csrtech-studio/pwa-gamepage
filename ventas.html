// Get the cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Display cart items
function displayCart() {
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = '';

    cart.forEach((game, index) => {
        const gameElement = document.createElement('div');
        gameElement.classList.add('game-item');
        gameElement.innerHTML = `
            <img src="${game.image}" alt="${game.name}" class="game-image">
            <p class="game-title">${game.name} - $${game.price}</p>
            <button onclick="removeFromCart(${index})">Remove</button>
        `;
        cartList.appendChild(gameElement);
    });

    updateTotal();
}

// Remove a product from the cart
function removeFromCart(index) {
    cart.splice(index, 1);
    displayCart();
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

// Update the total price in the cart
function updateTotal() {
    const total = cart.reduce((sum, game) => sum + game.price, 0);
    const totalElement = document.getElementById('total');
    totalElement.textContent = total.toFixed(2);
}

// Verify the payment form
function verifyPayment(event) {
    event.preventDefault();

    const cardName = document.getElementById('card-name').value.trim();
    const cardNumber = document.getElementById('card-number').value.trim();
    const expiryDate = document.getElementById('expiry-date').value.trim();
    const cvv = document.getElementById('cvv').value.trim();

    // Check if all fields are filled
    if (!cardName || !cardNumber || !expiryDate || !cvv) {
        alert('Please complete all fields.');
        return;
    }

    // If verification passes, show success message
    alert('Thank you for your purchase!');
    cart = [];
    localStorage.removeItem('cart');
    displayCart();
    window.location.href = 'index.html'; // Redirect to the home page after purchase
}

// Update the cart counter in the navbar
function updateCartUI() {
    const cartCountElement = document.querySelector('.cart-count');
    cartCountElement.textContent = cart.length;
}

// Initialize the page
window.addEventListener('load', () => {
    displayCart();
    updateCartUI();

    // Assign the verifyPayment function to the form
    const paymentForm = document.getElementById('payment-form');
    paymentForm.addEventListener('submit', verifyPayment);
});
