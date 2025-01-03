import { firebaseConfig } from './firebaseConfig.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getDatabase, ref, onValue, push, get } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-storage.js";

let userLocation = null;

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);
const salesRef = ref(db, 'sales_installations');

// Inicializar fecha en el formulario
document.addEventListener("DOMContentLoaded", function () {
    console.log("Formulario cargado");
    const dateInput = document.getElementById("date");
    const today = new Date();
    const currentDate = today.toLocaleDateString('en-CA');

    if (dateInput) {
        const today = new Date().toISOString().split("T")[0];
        dateInput.value = today;
    }
    const searchDateInput = document.getElementById("searchDate");
    if (searchDateInput) {
        searchDateInput.value = currentDate; // Filtro por fecha actual
    }

    // Aplicar filtro automáticamente al cargar la página
    filterSales();
 
});

document.getElementById("imageCount").addEventListener("input", function () {
    const imageCount = parseInt(this.value) || 0;
    const imagesContainer = document.getElementById("imagesContainer");

    // Limpiar contenedor de imágenes
    imagesContainer.innerHTML = "";

    // Generar campos de imagen dinámicamente
    for (let i = 1; i <= imageCount; i++) {
        const imageWrapper = document.createElement("div");
        imageWrapper.classList.add("image-wrapper");

        const labelArea = document.createElement("label");
        labelArea.setAttribute("for", `imageArea${i}`);
        labelArea.textContent = `Área de la imagen ${i}:`;

        const inputArea = document.createElement("input");
        inputArea.type = "text";
        inputArea.id = `imageArea${i}`;
        inputArea.name = `imageArea${i}`;
        inputArea.placeholder = `Área de la imagen ${i}`;
        inputArea.required = true;

        const labelWater = document.createElement("label");
        labelWater.setAttribute("for", `waterInput${i}`);
        labelWater.textContent = `Toma de agua ${i}:`;

        const inputWater = document.createElement("input");
        inputWater.type = "text";
        inputWater.id = `waterInput${i}`;
        inputWater.name = `waterInput${i}`;
        inputWater.placeholder = `Toma de agua ${i}`;
        inputWater.required = true;

        const labelDrain = document.createElement("label");
        labelDrain.setAttribute("for", `drainInput${i}`);
        labelDrain.textContent = `Toma de desagüe ${i}:`;

        const inputDrain = document.createElement("input");
        inputDrain.type = "text";
        inputDrain.id = `drainInput${i}`;
        inputDrain.name = `drainInput${i}`;
        inputDrain.placeholder = `Toma de desagüe ${i}`;
        inputDrain.required = true;

        const labelImage = document.createElement("label");
        labelImage.setAttribute("for", `imageFile${i}`);
        labelImage.textContent = `Imagen del área ${i}:`;

        const inputImage = document.createElement("input");
        inputImage.type = "file";
        inputImage.accept = "image/*";
        inputImage.id = `imageFile${i}`;
        inputImage.name = `imageFile${i}`;
        inputImage.required = true;

        const miniaturasContainer = document.createElement("div");
        miniaturasContainer.id = `miniaturasContainer${i}`;
        miniaturasContainer.classList.add("miniaturas-container");

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", () => {
            imageWrapper.remove(); // Eliminar campo dinámico
        });

        imageWrapper.appendChild(labelArea);
        imageWrapper.appendChild(inputArea);
        imageWrapper.appendChild(labelWater);
        imageWrapper.appendChild(inputWater);
        imageWrapper.appendChild(labelDrain);
        imageWrapper.appendChild(inputDrain);
        imageWrapper.appendChild(labelImage);
        imageWrapper.appendChild(inputImage);
        imageWrapper.appendChild(miniaturasContainer);
        imageWrapper.appendChild(deleteBtn);

        imagesContainer.appendChild(imageWrapper);
    }
});

// Botón para obtener ubicación
document.addEventListener("DOMContentLoaded", function () {
    const salesForm = document.getElementById("salesForm");
    const submitBtn = document.getElementById("submitBtn");
    const locationButton = document.getElementById("locationButton");

    if (salesForm && submitBtn && locationButton) {
        // Asegúrate de que el botón de ubicación se inserte antes del botón de envío
        salesForm.insertBefore(locationButton, submitBtn);

        // Establecer el evento del botón "Guardar Ubicación"
        locationButton.addEventListener("click", () => {
            if (!navigator.geolocation) {
                alert("Tu navegador no soporta la geolocalización.");
                return;
            }

            locationButton.disabled = true;
            locationButton.textContent = "Obteniendo ubicación...";

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Guardar la ubicación
                    userLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };

                    // Mostrar la ubicación guardada
                    alert(`Ubicación guardada: (${userLocation.latitude}, ${userLocation.longitude})`);

                    // Actualizar el texto del botón
                    locationButton.textContent = "Ubicación Guardada";
                },
                (error) => {
                    // Manejar el error de geolocalización
                    let errorMessage = "Error al obtener ubicación.";
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = "El permiso de geolocalización fue denegado.";
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = "La ubicación no está disponible.";
                            break;
                        case error.TIMEOUT:
                            errorMessage = "El tiempo para obtener la ubicación ha expirado.";
                            break;
                        default:
                            errorMessage = "Ocurrió un error desconocido.";
                    }

                    // Mostrar el mensaje de error
                    alert(errorMessage);

                    // Habilitar nuevamente el botón y restaurar su texto
                    locationButton.disabled = false;
                    locationButton.textContent = "Guardar Ubicación";
                }
            );
        });

        // Manejo del botón de enviar
        submitBtn.addEventListener("click", async () => {
            if (!userLocation) {
                alert("Por favor, guarda la ubicación antes de enviar el formulario.");
                return;
            }

            // El resto del código para enviar el formulario sigue aquí...
        });

    } else {
        console.error("No se encontraron los elementos salesForm, submitBtn o locationButton.");
    }

    loadSalesData();  // Cargar los datos después de que el DOM esté listo
});

// Boton para Guardar el Formulario
document.getElementById("submitBtn").addEventListener("click", async (event) => {
    event.preventDefault(); // Previene que el formulario se recargue

    const submitButton = document.getElementById("submitBtn");
    submitButton.disabled = true;

    try {
        // Obtener datos del formulario
        const dateInput = document.getElementById("date");
        const sellerInput = document.getElementById("seller");
        const companyInput = document.getElementById("company");
        const tdsInput = document.getElementById("tds");
        const contactInput = document.getElementById("contact");
        const phoneInput = document.getElementById("cellphone");
        const imageCountInput = document.getElementById("imageCount");

        const date = dateInput ? dateInput.value : null;
        const seller = sellerInput ? sellerInput.value : null;
        const company = companyInput ? companyInput.value : null;
        const tdsValue = tdsInput ? tdsInput.value : null;
        const contact = contactInput ? contactInput.value : null;
        const phone = phoneInput ? phoneInput.value : null;
        let imageCount = imageCountInput ? parseInt(imageCountInput.value) || 0 : 0;

        if (!date || !seller || !company || !tdsValue || !contact || !phone || imageCount <= 0) {
            let missingFields = [];

            if (!date) missingFields.push("Fecha");
            if (!seller) missingFields.push("Vendedor");
            if (!company) missingFields.push("Compañía");
            if (!tdsValue) missingFields.push("TDS");
            if (!contact) missingFields.push("Contacto");
            if (!phone) missingFields.push("Teléfono");
            if (imageCount <= 0) missingFields.push("Cantidad de imágenes");

            alert("Por favor, completa los siguientes campos: " + missingFields.join(", "));
            submitButton.disabled = false;
            return;
        }

        if (imageCount < 1 || imageCount > 50) {
            alert("La cantidad de imágenes debe estar entre 1 y 50.");
            submitButton.disabled = false;
            return;
        }

        if (!userLocation) {
            alert("Por favor, guarda la ubicación antes de enviar el formulario.");
            submitButton.disabled = false;
            return;
        }

        const imageUploads = [];
        const imageData = [];

        document.getElementById("progressContainer").style.display = "block";

        for (let i = 1; i <= imageCount; i++) {
            const areaInput = document.getElementById(`imageArea${i}`);
            const imageInput = document.getElementById(`imageFile${i}`);
            const waterInput = document.getElementById(`waterInput${i}`); // Campo para toma de agua
            const drainInput = document.getElementById(`drainInput${i}`); // Campo para desagüe
            const miniaturasContainer = document.getElementById(`miniaturasContainer${i}`);
        
            let area = areaInput?.value.trim();
            let water = waterInput?.value.trim(); // Valor para toma de agua
            let drain = drainInput?.value.trim(); // Valor para desagüe
        
            if (!area) {
                alert(`El área para las imágenes ${i} no está especificada. Por favor, ingresa un valor.`);
                submitButton.disabled = false;
                return;
            }
        
            if (!water) {
                alert(`La toma de agua para el área ${i} no está especificada. Por favor, ingresa un valor.`);
                submitButton.disabled = false;
                return;
            }
        
            if (!drain) {
                alert(`El desagüe para el área ${i} no está especificado. Por favor, ingresa un valor.`);
                submitButton.disabled = false;
                return;
            }
        
            if (imageInput?.files.length === 0) {
                alert(`Por favor selecciona una imagen para el área ${i}.`);
                submitButton.disabled = false;
                return;
            }
        
            const imageFile = imageInput.files[0];
        
            const imageStorageRef = storageRef(storage, `images/${imageFile.name}`);
            const uploadTask = uploadBytesResumable(imageStorageRef, imageFile);
        
            uploadTask.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                document.getElementById(`progress${i}`).textContent = `Progreso: ${Math.round(progress)}%`;
            });
        
            uploadTask.then(async () => {
                const downloadURL = await getDownloadURL(imageStorageRef);
                imageData.push({
                    area: area,
                    water: water,
                    drain: drain,
                    url: downloadURL,
                });
        
                if (imageData.length === imageCount) {
                    await saveSalesData(date, seller, company, tdsValue, contact, phone, imageData, userLocation);
                    alert("Datos guardados exitosamente.");
                    submitButton.disabled = false;
                }
            }).catch((error) => {
                console.error("Error al subir la imagen:", error);
                alert("Hubo un error al subir la imagen. Inténtalo de nuevo.");
                submitButton.disabled = false;
            });
        } 
        } catch (error) {
            console.error("Error en la función submitBtn:", error);
            alert("Ocurrió un error inesperado. Por favor, intenta nuevamente más tarde.");
            submitButton.disabled = false;
        }
        });
        
// Función para mostrar imágenes en una galería
function mostrarMiniatura(imageURL, containerID) {
    const container = document.getElementById(containerID);

    if (!container) {
        console.error(`Contenedor con ID ${containerID} no encontrado.`);
        return;
    }

    const img = document.createElement("img");
    img.src = imageURL;
    img.alt = "Imagen Miniatura";
    img.style.maxWidth = "100px";
    img.style.maxHeight = "100px";
    img.style.margin = "5px";

    container.appendChild(img);
}

// Función para guardar los datos en Firebase
async function saveSalesData(date, seller, company, tds, contact, phone, images, location) {
    try {
        const salesData = {
            date,
            seller,
            company,
            tds,
            contact,
            phone,
            images,
            location,
        };

        const newSalesRef = push(salesRef);
        await set(newSalesRef, salesData);

    } catch (error) {
        console.error("Error al guardar datos en Firebase:", error);
        throw error;
    }
}

// Cargar datos de ventas desde Firebase
function loadSalesData() {
    onValue(salesRef, (snapshot) => {
        const data = snapshot.val();
        const salesContainer = document.getElementById("salesContainer");

        salesContainer.innerHTML = "";

        if (data) {
            Object.keys(data).forEach((id) => {
                const sale = data[id];
                const saleElement = document.createElement("div");
                saleElement.className = "sale";
                saleElement.innerHTML = `
                    <p>${sale.date}</p>
                    <p>${sale.seller}</p>
                    <p>${sale.company}</p>
                    <p>${sale.tds}</p>
                    <p>${sale.contact}</p>
                    <p>${sale.phone}</p>
                    <div class="images-container"></div> <!-- Espacio para imágenes -->
                `;

                sale.images.forEach((image) => {
                    mostrarMiniatura(image.url, saleElement.querySelector(".images-container").id);
                });

                salesContainer.appendChild(saleElement);
            });
        } else {
            salesContainer.innerHTML = "<p>No hay datos disponibles.</p>";
        }
    });
}

// Filtro por fecha
function filterSales() {
    const searchDateInput = document.getElementById("searchDate");
    const searchDate = searchDateInput ? searchDateInput.value : null;

    if (salesRef && searchDate) {
        onValue(salesRef, (snapshot) => {
            const data = snapshot.val();
            const filteredContainer = document.getElementById("filteredSalesContainer");

            filteredContainer.innerHTML = "";

            if (data) {
                Object.keys(data).forEach((id) => {
                    const sale = data[id];

                    if (sale.date === searchDate) {
                        const saleElement = document.createElement("div");
                        saleElement.className = "sale";
                        saleElement.innerHTML = `
                            <p>${sale.date}</p>
                            <p>${sale.seller}</p>
                            <p>${sale.company}</p>
                            <p>${sale.tds}</p>
                            <p>${sale.contact}</p>
                            <p>${sale.phone}</p>
                            <div class="images-container" id="miniaturasContainer${id}"></div> <!-- Espacio para imágenes -->
                        `;

                        sale.images.forEach((image) => {
                            mostrarMiniatura(image.url, `miniaturasContainer${id}`);
                        });

                        filteredContainer.appendChild(saleElement);
                    }
                });
            } else {
                filteredContainer.innerHTML = "<p>No hay datos disponibles para esta fecha.</p>";
            }
        });
    }
}
