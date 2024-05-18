document.addEventListener("DOMContentLoaded", function() {
    // Obtener el elemento del carrito
    const carritoElement = document.getElementById('carrito');

    // Obtener los parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const producto = urlParams.get('producto');
    const action = urlParams.get('action');

    if (producto && action) {
        if (action === 'agregar') {
            agregarAlCarrito(producto); // Llama a la función para agregar al carrito
        } else if (action === 'comprar') {
            // Redirige al proceso de pago
            window.location.href = 'pago.html?producto=' + producto;
        }
    }

    // Función para agregar producto al carrito
    function agregarAlCarrito(productoId) {
        // Simulación de datos del producto (imagen, nombre, precio)
        const producto = {
            id: productoId,
            imagen: 'images/videojuego' + productoId + '.jpg',
            nombre: 'Nombre del producto',
            precio: 1000 // Precio del producto
        };

        // Crear elemento de producto en el carrito
        const productoElement = document.createElement('div');
        productoElement.classList.add('producto-item');
        productoElement.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen">
            <div class="producto-info">
                <h3 class="producto-nombre">${producto.nombre}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <input type="number" min="1" value="1" class="producto-cantidad">
                <button class="eliminar-button">Eliminar</button>
            </div>
        `;

        // Agregar evento al botón "Eliminar"
        const eliminarButton = productoElement.querySelector('.eliminar-button');
        eliminarButton.addEventListener('click', function() {
            productoElement.remove(); // Eliminar el producto del carrito al hacer clic en "Eliminar"
        });

        // Agregar el producto al carrito
        carritoElement.appendChild(productoElement);
    }
});
