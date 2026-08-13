// Arreglo de objetos que actúa como base de datos inicial de productos
let catalogoProductos = [
    {
        id: 1,
        nombre: "The Witcher 3: Wild Hunt",
        plataforma: "PC / Consolas",
        genero: "RPG de Acción",
        clasificacion: "M (Mature)",
        desarrollador: "CD Projekt Red",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_rVkbRVsY94-CN64Xm8tS7Z3343s_QhN0GyLipxJVkKSJJJdC7zo8-xZ4wrXjsfHSC2QD0P8vlDTeixMaFLd08zrTjtHfTdrsfY51WXgyBQ&s=10",
        precio: 120000
    },
    {
        id: 2,
        nombre: "Elden Ring",
        plataforma: "PC / PS5 / Xbox",
        genero: "Souls-like / RPG",
        clasificacion: "M (Mature)",
        desarrollador: "FromSoftware",
        imagen: "https://i.blogs.es/c0b150/1024_2000/450_1000.jpeg",
        precio: 210000
    },
    {
        id: 3,
        nombre: "Minecraft",
        plataforma: "Multiplataforma",
        genero: "Sandbox / Aventura",
        clasificacion: "E (Everyone)",
        desarrollador: "Mojang Studios",
        imagen: "https://www.minecraft.net/content/dam/minecraftnet/games/minecraft/key-art/Homepage_Discover-our-games_MC-Vanilla-KeyArt_864x864.jpg",
        precio: 95000
    },
    {
        id: 4,
        nombre: "God of War",
        plataforma: "PC / PS4 / PS5",
        genero: "Aventura",
        clasificacion: "+17",
        desarrollador: "Santa Monica Studio",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZHYb4FVd29uNx8wl1oZ6MNyZF0Qfq9EwvIxrWp1RrOA&s=10",
        precio: 95000
    }
];

// Arreglo dinámico que almacenará los objetos seleccionados por el usuario
let carritoCompras = [];

// Selección y captura de nodos del DOM mediante selectores CSS
const gridProductos = document.querySelector('#grid-productos');
const listaCarritoDOM = document.querySelector('#lista-carrito');
const contadorCarrito = document.querySelector('#contador-carrito');
const carritoVacioTexto = document.querySelector('#carrito-vacio-texto');
const btnVaciarCarrito = document.querySelector('#boton-vaciar-carrito');

// Selección de los elementos del formulario para la lectura de datos
const formularioArticulo = document.querySelector('#form-juego');
const campoNombre = document.querySelector('#titulo');
const campoPlataforma = document.querySelector('#plataforma');
const campoGenero = document.querySelector('#genero');
const campoClasificacion = document.querySelector('#clasificacion');
const campoDesarrollador = document.querySelector('#desarrollador');
const campoImagen = document.querySelector('#imagen');
const campoPrecio = document.querySelector('#precio');

/**
 * Función encargada de renderizar la lista de productos en el Grid HTML.
 * Recorre el arreglo `catalogoProductos` y genera dinámicamente el HTML de las tarjetas.
 */
const renderizarCatalogo = () => {
    if (!gridProductos) return;
    gridProductos.innerHTML = ''; // Limpia el contenedor antes de renderizar nuevamente

    catalogoProductos.forEach((producto) => {
        const card = document.createElement('article');
        card.classList.add('card-producto');

        // Plantilla literal que define la estructura visual e inserta los atributos del producto
        card.innerHTML = `
            <div>
                <img src="${producto.imagen || 'https://via.placeholder.com/300x180?text=Sin+Imagen'}" class="card-imagen" alt="${producto.nombre}" onerror="this.src='https://via.placeholder.com/300x180?text=Sin+Imagen'">
                <h3 class="card-titulo">${producto.nombre}</h3>
                <div class="card-detalles">
                    <p><span>Plataforma:</span> ${producto.plataforma}</p>
                    <p><span>Género:</span> ${producto.genero}</p>
                    <p><span>Clasificación:</span> ${producto.clasificacion}</p>
                    <p><span>Desarrollador:</span> ${producto.desarrollador}</p>
                </div>
            </div>
            <div>
                <div class="card-precio">$${producto.precio.toLocaleString()}</div>
                <button class="btn-agregar-carrito" data-id="${producto.id}">Agregar al carrito</button>
            </div>
        `;

        gridProductos.appendChild(card);
    });

    // Reasigna los eventos a los botones recién generados dinámicamente
    asignarEventosAgregar();
};

/**
 * Recorre los botones "Agregar al carrito" generados y asigna sus manejadores de eventos.
 */
const asignarEventosAgregar = () => {
    const botonesAgregar = document.querySelectorAll('.btn-agregar-carrito');

    botonesAgregar.forEach((boton) => {
        boton.addEventListener('click', (e) => {
            // Captura el ID desde el atributo custom 'data-id'
            const idProducto = Number(e.target.dataset.id);
            agregarAlCarrito(idProducto);
        });
    });
};

/**
 * Gestiona la adición de productos al carrito respetando cantidades duplicadas.
 * @param {number} idProducto ID del juego a agregar
 */
const agregarAlCarrito = (idProducto) => {
    const productoEncontrado = catalogoProductos.find((prod) => prod.id === idProducto);
    if (!productoEncontrado) return;

    // Verifica si el producto ya existe dentro del carrito
    const elementoExistente = carritoCompras.find((item) => item.id === idProducto);

    if (elementoExistente) {
        elementoExistente.cantidad += 1; // Incrementa unidades si ya existe
    } else {
        // Usa el operador spread para duplicar el objeto e inicializar la propiedad cantidad
        carritoCompras.push({
            ...productoEncontrado,
            cantidad: 1
        });
    }

    actualizarCarritoDOM();
};

/**
 * Sincroniza el estado del arreglo `carritoCompras` con el menú desplegable del HTML.
 */
const actualizarCarritoDOM = () => {
    if (!listaCarritoDOM || !contadorCarrito) return;
    listaCarritoDOM.innerHTML = ''; // Limpia las filas actuales de la tabla

    // Control visual cuando el carrito se encuentra vacío
    if (carritoCompras.length === 0) {
        if (carritoVacioTexto) carritoVacioTexto.style.display = 'block';
        contadorCarrito.textContent = '0';
        return;
    }

    if (carritoVacioTexto) carritoVacioTexto.style.display = 'none';
    let totalItems = 0;

    // Generación dinámica de cada fila `<tr>` en la tabla del carrito
    carritoCompras.forEach((item) => {
        totalItems += item.cantidad;

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td><img src="${item.imagen || 'https://via.placeholder.com/40'}" class="img-miniatura-carrito" alt="${item.nombre}" onerror="this.src='https://via.placeholder.com/40'"></td>
            <td>${item.nombre}</td>
            <td>$${item.precio.toLocaleString()}</td>
            <td>${item.cantidad}</td>
        `;
        listaCarritoDOM.appendChild(fila);
    });

    // Actualización del indicador numérico en el ícono del header
    contadorCarrito.textContent = totalItems.toString();
};

/**
 * Vacía por completo el carrito y refresca el DOM
 */
const vaciarCarrito = () => {
    carritoCompras = [];
    actualizarCarritoDOM();
};

/**
 * Lee los valores del formulario, crea un nuevo producto y actualiza la interfaz.
 * @param {Event} e Evento de envío del formulario (submit)
 */
const procesarFormulario = (e) => {
    e.preventDefault(); // Evita el recargado por defecto de la página

    // Construcción del nuevo objeto de juego con los 7 atributos
    const nuevoJuego = {
        id: Date.now(), // Genera un ID único basado en la marca de tiempo actual
        nombre: campoNombre.value.trim(),
        plataforma: campoPlataforma.value.trim(),
        genero: campoGenero.value.trim(),
        clasificacion: campoClasificacion.value.trim(),
        desarrollador: campoDesarrollador.value.trim(),
        imagen: campoImagen.value.trim() || 'https://via.placeholder.com/300x180?text=Juego',
        precio: Number(campoPrecio.value)
    };

    catalogoProductos.push(nuevoJuego); // Se añade al arreglo principal
    renderizarCatalogo(); // Vuelve a pintar el catálogo para incluir el nuevo registro
    if (formularioArticulo) formularioArticulo.reset(); // Limpia los campos del formulario
};

// Asignación de Listeners para eventos del usuario
if (formularioArticulo) {
    formularioArticulo.addEventListener('submit', procesarFormulario);
}

if (btnVaciarCarrito) {
    btnVaciarCarrito.addEventListener('click', vaciarCarrito);
}

// Inicialización del script una vez que la estructura HTML ha sido completamente cargada
document.addEventListener('DOMContentLoaded', () => {
    renderizarCatalogo();
    actualizarCarritoDOM();
});