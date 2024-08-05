// Get the cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to update the cart counter in the navbar
function updateCartUI() {
    const cartCountElement = document.querySelector('.cart-count');
    cartCountElement.textContent = cart.length;
}

// Function to add to the cart
function addToCart(name, price, image) {
    cart.push({ name, price, image });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

// Function to go to the cart
function goToCart() {
    if (cart.length === 0) {
        alert('You have not added any products to the cart yet.');
    } else {
        window.location.href = 'pago.html'; // Change 'pago.html' to the checkout page
    }
}

// Function to buy now
function buyNow(name, price, image) {
    cart.push({ name, price, image });
    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.href = 'pago.html'; // Change 'pago.html' to the checkout page
}

// Initialize the cart counter when the page loads
window.addEventListener('load', () => {
    updateCartUI();
});
