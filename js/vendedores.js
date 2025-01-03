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


// Función para capturar imagen usando la cámara
function captureImage(containerId) {
    const miniaturasContainer = document.getElementById(containerId);
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            const video = document.createElement("video");
            video.srcObject = stream;
            video.play();

            const canvas = document.createElement("canvas");
            const captureBtn = document.createElement("button");
            captureBtn.textContent = "Capturar";
            captureBtn.classList.add("capture-btn");

            captureBtn.addEventListener("click", () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext("2d").drawImage(video, 0, 0);
                const imageUrl = canvas.toDataURL("image/png");

                const img = document.createElement("img");
                img.src = imageUrl;
                miniaturasContainer.appendChild(img);

                // Agregar botón de eliminar a cada imagen
                const deleteImgBtn = document.createElement("button");
                deleteImgBtn.textContent = "X";
                deleteImgBtn.classList.add("delete-miniatura-btn");
                deleteImgBtn.addEventListener("click", () => {
                    img.remove(); // Eliminar imagen individual
                    deleteImgBtn.remove(); // Eliminar botón también
                });
                img.parentNode.appendChild(deleteImgBtn);

                stream.getTracks().forEach(track => track.stop());
                video.remove();
                captureBtn.remove();
                canvas.remove();
            });

            video.addEventListener("play", () => {
                miniaturasContainer.appendChild(video);
                miniaturasContainer.appendChild(captureBtn);
            });
        })
        .catch((err) => {
            console.error("Error al acceder a la cámara:", err);
        });
}


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

/////////////////////////Botond e Guardar/////////////////////////////
document.getElementById("submitBtn").addEventListener("click", async (event) => {
    event.preventDefault();

    const submitButton = document.getElementById("submitBtn");
    submitButton.disabled = true;

    try {
        const dateInput = document.getElementById("date");
        const sellerInput = document.getElementById("seller");
        const companyInput = document.getElementById("company");
        const tdsInput = document.getElementById("tds");
        const contactInput = document.getElementById("contact");
        const phoneInput = document.getElementById("cellphone");

        const date = dateInput?.value || null;
        const seller = sellerInput?.value || null;
        const company = companyInput?.value || null;
        const tdsValue = tdsInput?.value || null;
        const contact = contactInput?.value || null;
        const phone = phoneInput?.value || null;

        if (!date || !seller || !company || !tdsValue || !contact || !phone) {
            alert("Por favor, completa todos los campos obligatorios.");
            submitButton.disabled = false;
            return;
        }

        if (!userLocation) {
            alert("Por favor, guarda la ubicación antes de enviar el formulario.");
            submitButton.disabled = false;
            return;
        }

        const imageCount = parseInt(document.getElementById("imageCount").value) || 0;
        const imagesObject = {};

        document.getElementById("progressContainer").style.display = "block";

        for (let i = 1; i <= imageCount; i++) {
            const imageInput = document.getElementById(`image${i}`);

            if (imageInput && imageInput.files && imageInput.files[0]) {
                const imageFile = imageInput.files[0];
                const imagePath = `sales_installations/image_${i}_${Date.now()}.png`;
                const imageRef = storageRef(storage, imagePath);

                await new Promise((resolve, reject) => {
                    const uploadTask = uploadBytesResumable(imageRef, imageFile);

                    uploadTask.on(
                        "state_changed",
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log(`Progreso de subida para image${i}: ${Math.round(progress)}%`);
                        },
                        (error) => reject(error),
                        async () => {
                            const downloadURL = await getDownloadURL(imageRef);
                            imagesObject[`image${i}`] = { imageUrl: downloadURL };
                            resolve();
                        }
                    );
                });
            }
        }

        document.getElementById("progressContainer").style.display = "none";

        const newEntry = {
            date,
            seller,
            company,
            tds: tdsValue,
            contact,
            phone,
            images: imagesObject,
            location: userLocation,
        };

        await push(ref(db, "sales_installations"), newEntry);

        alert("Registro guardado exitosamente.");
        clearForm();
    } catch (error) {
        console.error("Error al guardar el registro:", error);
        alert("Ocurrió un error al guardar el registro.");
    } finally {
        submitButton.disabled = false;
    }

    loadSalesData();
});






///////Contenedor de imagenes dinamicas////
document.getElementById("imageCount").addEventListener("input", function () {
    const imageCount = parseInt(this.value) || 0;
    const imagesContainer = document.getElementById("imagesContainer");

    // Limpiar contenedor de imágenes
    imagesContainer.innerHTML = "";

    // Generar campos de imagen dinámicamente
    for (let i = 1; i <= imageCount; i++) {
        const fields = [
            { label: "Toma de agua", id: `waterImage${i}`, placeholder: `Toma de agua ${i}` },
            { label: "Toma de desagüe", id: `drainImage${i}`, placeholder: `Toma de desagüe ${i}` },
            { label: "Área", id: `areaImage${i}`, placeholder: `Área ${i}` },
            { label: "Adicional", id: `extraImage${i}`, placeholder: `Información adicional ${i}` },
        ];

        fields.forEach(({ label, id, placeholder }) => {
            const wrapper = document.createElement("div");
            wrapper.classList.add("image-field");

            const fieldLabel = document.createElement("label");
            fieldLabel.setAttribute("for", id);
            fieldLabel.textContent = `${label} ${i}:`;

            const textInput = document.createElement("input");
            textInput.type = "text";
            textInput.id = id;
            textInput.name = id;
            textInput.placeholder = placeholder;
            textInput.required = true;

            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "image/*";
            fileInput.id = id;
            fileInput.name = id;
            fileInput.dataset.files = JSON.stringify([]); // Inicializar un arreglo vacío para almacenar archivos

            fileInput.addEventListener("change", () => {
                const files = Array.from(fileInput.files);
                fileInput.dataset.files = JSON.stringify(files); // Guardar los archivos como string en atributo de datos
            });

            wrapper.appendChild(fieldLabel);
            wrapper.appendChild(textInput);
            wrapper.appendChild(fileInput);

            imagesContainer.appendChild(wrapper);
        });
    }
});


////Boton Guardar////

document.getElementById("submitBtn").addEventListener("click", async (event) => {
    event.preventDefault();

    const submitButton = document.getElementById("submitBtn");
    submitButton.disabled = true;

    try {
        const dateInput = document.getElementById("date");
        const sellerInput = document.getElementById("seller");
        const companyInput = document.getElementById("company");
        const tdsInput = document.getElementById("tds");
        const contactInput = document.getElementById("contact");
        const phoneInput = document.getElementById("cellphone");
        const imageCountInput = document.getElementById("imageCount");

        const date = dateInput?.value.trim();
        const seller = sellerInput?.value.trim();
        const company = companyInput?.value.trim();
        const tdsValue = tdsInput?.value.trim();
        const contact = contactInput?.value.trim();
        const phone = phoneInput?.value.trim();
        const imageCount = imageCountInput?.value.trim() || 0;

        let missingFields = [];

        if (!date) missingFields.push("Fecha");
        if (!seller) missingFields.push("Vendedor");
        if (!company) missingFields.push("Compañía");
        if (!tdsValue) missingFields.push("TDS");
        if (!contact) missingFields.push("Contacto");
        if (!phone) missingFields.push("Teléfono");
        if (!imageCount || imageCount <= 0) missingFields.push("Cantidad de Equipos a Instalar");

        for (let i = 1; i <= imageCount; i++) {
            const textInput = document.getElementById(`areaImage${i}`) || document.getElementById(`waterImage${i}`) || document.getElementById(`drainImage${i}`) || document.getElementById(`extraImage${i}`);
            const imageInput = document.getElementById(`areaImage${i}`) || document.getElementById(`waterImage${i}`) || document.getElementById(`drainImage${i}`) || document.getElementById(`extraImage${i}`);

            if (textInput && textInput.value.trim() === "") {
                missingFields.push(`Nombre de Image ${i}`);
            }

            if (imageInput && (!imageInput.files || !imageInput.files[0])) {
                missingFields.push(`Imagen de Image ${i}`);
            }
        }

        if (missingFields.length > 0) {
            alert(`Por favor, completa los siguientes campos obligatorios: ${missingFields.join(', ')}`);
            submitButton.disabled = false;
            return;
        }

        if (!userLocation) {
            alert("Por favor, guarda la ubicación antes de enviar el formulario.");
            submitButton.disabled = false;
            return;
        }

        const imagesObject = {};

        document.getElementById("progressContainer").style.display = "block";

        for (let i = 1; i <= imageCount; i++) {
            const imageInput = document.getElementById(`areaImage${i}`) || document.getElementById(`waterImage${i}`) || document.getElementById(`drainImage${i}`) || document.getElementById(`extraImage${i}`);

            if (imageInput && imageInput.files && imageInput.files[0]) {
                const imageFile = imageInput.files[0];
                const imagePath = `sales_installations/image_${i}_${Date.now()}.png`;
                const imageRef = storageRef(storage, imagePath);

                await new Promise((resolve, reject) => {
                    const uploadTask = uploadBytesResumable(imageRef, imageFile);

                    uploadTask.on(
                        "state_changed",
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log(`Progreso de subida para image${i}: ${Math.round(progress)}%`);
                        },
                        (error) => reject(error),
                        async () => {
                            const downloadURL = await getDownloadURL(imageRef);
                            imagesObject[`image${i}`] = { imageUrl: downloadURL };
                            resolve();
                        }
                    );
                });
            } else {
                missingFields.push(`Imagen de Image ${i}`);
            }
        }

        if (missingFields.length > 0) {
            alert(`Por favor, completa los siguientes campos obligatorios: ${missingFields.join(', ')}`);
            submitButton.disabled = false;
            return;
        }

        document.getElementById("progressContainer").style.display = "none";

        const newEntry = {
            date,
            seller,
            company,
            tds: tdsValue,
            contact,
            phone,
            images: imagesObject,
            location: userLocation,
        };

        await push(ref(db, "sales_installations"), newEntry);

        alert("Registro guardado exitosamente.");
        clearForm();
    } catch (error) {
        console.error("Error al guardar el registro:", error);
        alert("Ocurrió un error al guardar el registro.");
    } finally {
        submitButton.disabled = false;
    }

    loadSalesData();
});


// Limpiar formulario
function clearForm() {
    const form = document.querySelector("form");
    if (form) form.reset();

    const imagesContainer = document.getElementById("imagesContainer");
    if (imagesContainer) imagesContainer.innerHTML = "";

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


                if (matchesDate && matchesSeller && matchesCompany) {
                    rows += `
                        <tr>
                            <td>${sale.date || "N/A"}</td>
                            <td>${sale.seller || "N/A"}</td>
                            <td>${sale.company || "N/A"}</td>
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

    loadSalesData(); // Recargar todos los registros
});


