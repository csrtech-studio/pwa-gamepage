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
                inputImage.accept = "image/*;capture=camera"; // 'capture=camera' habilita acceso a la cámara
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
        
        
        

        await Promise.all(imageUploads);
        document.getElementById("progressContainer").style.display = "none";

        // Generar UID único
        const uid = '_' + Math.random().toString(36).substr(2, 9);

        // Crear el objeto con los datos a guardar
        const newEntry = {
            uid, // Incluir el UID único
            date,
            seller,
            company,
            tds: tdsValue,
            contact,
            phone,
            images: imageData,
            location: userLocation,
        };

        // Guardar los datos en Firebase
        await push(ref(db, "sales_installations"), newEntry);

        alert("Registro guardado exitosamente.");
        clearForm();
    } catch (error) {
        console.error("Error al guardar el registro:", error);
        alert("Ocurrió un error al guardar el registro. Verifica la consola para más detalles.");
    } finally {
        submitButton.disabled = false;
    }

    loadSalesData();
});


function showUploadProgress(videoIndex, percentage, totalVideos) {
    const uploadContainer = document.getElementById('uploadContainer');
    uploadContainer.style.display = 'block'; // Mostrar el contenedor

    // Verifica si ya existe un elemento de progreso para este video
    let videoProgress = document.getElementById(`videoProgress${videoIndex}`);
    if (!videoProgress) {
        videoProgress = document.createElement('div');
        videoProgress.id = `videoProgress${videoIndex}`;
        videoProgress.style.marginBottom = '10px'; // Espaciado entre progresos
        videoProgress.style.textAlign = 'center'; // Centrar texto
        uploadContainer.appendChild(videoProgress);
    }

    // Actualizar el progreso del video actual
    videoProgress.innerHTML = `
        <strong>Video ${videoIndex}:</strong> ${percentage}%
        ${percentage >= 100 ? '<span style="color: green;">(Completado)</span>' : ''}
    `;

    // Si todos los videos están cargados, mostrar un mensaje final
    const completedVideos = document.querySelectorAll('#uploadContainer div span[style="color: green;"]').length;
    if (completedVideos === totalVideos) {
        setTimeout(() => {
            uploadContainer.innerHTML = `
                <p style="color: green; font-weight: bold; text-align: center;">
                    ¡Todos los videos se han cargado exitosamente!
                </p>
            `;
            setTimeout(() => {
                uploadContainer.style.display = 'none'; // Ocultar después de unos segundos
                alert("Registro guardado exitosamente.");
            }, 1000);
        }, 1000);
    }   
}






// Limpiar formulario
function clearForm() {
    const form = document.querySelector("form");
    if (form) form.reset();

    const videosContainer = document.getElementById("videosContainer");
    if (videosContainer) videosContainer.innerHTML = "";

    userLocation = null;
    locationButton.disabled = false;
    locationButton.textContent = "Guardar Ubicación";
}

function loadSalesData() {
    const salesTableBody = document.querySelector('#salesTable tbody');
    if (!salesTableBody) {
        console.error('No se encontró el contenedor de la tabla.');
        return; // Detener la ejecución si no se encuentra el contenedor
    }

    const salesRef = ref(db, 'sales_installations');
    get(salesRef).then((snapshot) => {
        if (snapshot.exists()) {
            const salesData = snapshot.val();

            // Limpiar la tabla antes de agregar los nuevos registros
            salesTableBody.innerHTML = '';

            // Iterar sobre los datos y agregar filas a la tabla
            Object.entries(salesData).forEach(([id, sale]) => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${sale.date}</td>
                    <td>${sale.seller}</td>
                    <td>${sale.company}</td>
                    <td>${sale.branch}</td>
                    <td><button data-uid="${id}">Ver</button></td>
                `;

                salesTableBody.appendChild(row);
            });
        } else {
            console.log("No hay datos disponibles.");
        }
    }).catch((error) => {
        console.error("Error al cargar los datos:", error);
    });
}

document.querySelector("#salesTable tbody").addEventListener("click", function (e) {
    const row = e.target.closest('tr');

    // Si hacemos clic en el botón "Ver"
    if (e.target && e.target.tagName === 'BUTTON' && e.target.textContent === 'Ver') {
        const uid = e.target.dataset.uid; // Obtener el UID del dataset
        if (uid) {
            // Redirigir a la página de detalles con el UID en la URL
            window.location.href = `detalles.html?uid=${encodeURIComponent(uid)}`;
        }
    }
});


// Función para normalizar cadenas (eliminar acentos y convertir a minúsculas)
function normalizeString(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Filtro de búsqueda
document.getElementById("searchBtn")?.addEventListener("click", filterSales);

// Función para aplicar los filtros cuando se haga clic en "Buscar"
function filterSales() {
    const dateFilter = document.getElementById("searchDate")?.value || "";
    const sellerFilter = normalizeString(document.getElementById("searchseller")?.value || "");
    const companyFilter = normalizeString(document.getElementById("searchCompany")?.value || "");
    const branchFilter = normalizeString(document.getElementById("searchBranch")?.value || "");

    const queryRef = ref(db, "sales_installations"); // Cambia "sales" por el nodo de tu base de datos
    onValue(queryRef, (snapshot) => {
        const tableBody = document.querySelector("#salesTable tbody"); // Asegúrate de que exista esta tabla en tu HTML
        tableBody.innerHTML = ""; // Limpiar tabla

        if (snapshot.exists()) {
            let rows = "";
            snapshot.forEach((child) => {
                const sale = child.val();

                // Aplicar filtros
                const matchesDate = dateFilter ? data.date === dateFilter : true;
                const matchesSeller = sellerFilter ? normalizeString(sale.seller || "").includes(sellerFilter) : true;
                const matchesCompany = companyFilter ? normalizeString(sale.company || "").includes(companyFilter) : true;
                const matchesBranch = branchFilter ? normalizeString(sale.branch || "").includes(branchFilter) : true;

                if (matchesDate && matchesSeller && matchesCompany && matchesBranch) {
                    rows += `
                        <tr>
                            <td>${sale.date || "N/A"}</td>
                            <td>${sale.seller || "N/A"}</td>
                            <td>${sale.company || "N/A"}</td>
                            <td>${sale.branch || "N/A"}</td>
                        </tr>
                    `;
                }
            });

            tableBody.innerHTML = rows || "<tr><td colspan='4'>No se encontraron registros con los filtros aplicados.</td></tr>";
        } else {
            tableBody.innerHTML = "<tr><td colspan='4'>No hay registros disponibles.</td></tr>";
        }
    });
}

// Limpiar filtros
document.getElementById("clearFilter")?.addEventListener("click", () => {
    document.getElementById("searchDate").value = "";
    document.getElementById("searchseller").value = "";
    document.getElementById("searchCompany").value = "";
    document.getElementById("searchBranch").value = "";

    loadSalesData(); // Recargar todos los registros
});


