let catalogoProductos = [
    {
        id: 1,
        nombre: "The Witcher 3: Wild Hunt",
        plataforma: "PC / Consolas",
        genero: "RPG de Acción",
        clasificacion: "M (Mature)",
        desarrollador: "CD Projekt Red",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhvGfmExGw2kdfShQal3IKdmZ-gae53iCXoIZgm7FOTwCbNcO5tuQv-07w_75aO3qvPoCq-x61RR1VpVpJ0z-sdI5OsQmXoBWNmB6pmlqi3A&s=10",
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
    }
];

let carritoCompras = [];

// Elementos del DOM
const gridProductos = document.querySelector('#grid-productos');
const listaCarritoDOM = document.querySelector('#lista-carrito');
const contadorCarrito = document.querySelector('#contador-carrito');
const carritoVacioTexto = document.querySelector('#carrito-vacio-texto');
const btnVaciarCarrito = document.querySelector('#boton-vaciar-carrito');

const formularioArticulo = document.querySelector('#formulario-articulo');
const campoNombre = document.querySelector('#nombre-articulo');
const campoPlataforma = document.querySelector('#plataforma-articulo');
const campoGenero = document.querySelector('#genero-articulo');
const campoClasificacion = document.querySelector('#clasificacion-articulo');
const campoDesarrollador = document.querySelector('#desarrollador-articulo');
const campoImagen = document.querySelector('#imagen-articulo');
const campoPrecio = document.querySelector('#precio-articulo');

// Funciones de Renderizado
const renderizarCatalogo = () => {
    gridProductos.innerHTML = '';

    catalogoProductos.forEach((producto) => {
        const card = document.createElement('article');
        card.classList.add('card-producto');

        card.innerHTML = `
            <div>
                <img src="${producto.imagen}" class="card-imagen" alt="${producto.nombre}" onerror="this.src='https://via.placeholder.com/300x180?text=Sin+Imagen'">
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

    asignarEventosAgregar();
};

const asignarEventosAgregar = () => {
    const botonesAgregar = document.querySelectorAll('.btn-agregar-carrito');

    botonesAgregar.forEach((boton) => {
        boton.addEventListener('click', (e) => {
            const idProducto = Number(e.target.dataset.id);
            agregarAlCarrito(idProducto);
        });
    });
};

// Lógica del Carrito
const agregarAlCarrito = (idProducto) => {
    const productoEncontrado = catalogoProductos.find((prod) => prod.id === idProducto);
    if (!productoEncontrado) return;

    const elementoExistente = carritoCompras.find((item) => item.id === idProducto);

    if (elementoExistente) {
        elementoExistente.cantidad += 1;
    } else {
        carritoCompras.push({
            ...productoEncontrado,
            cantidad: 1
        });
    }

    actualizarCarritoDOM();
};

const actualizarCarritoDOM = () => {
    listaCarritoDOM.innerHTML = '';

    if (carritoCompras.length === 0) {
        carritoVacioTexto.style.display = 'block';
        contadorCarrito.textContent = '0';
        return;
    }

    carritoVacioTexto.style.display = 'none';
    let totalItems = 0;

    carritoCompras.forEach((item) => {
        totalItems += item.cantidad;

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td><img src="${item.imagen}" class="img-miniatura-carrito" alt="${item.nombre}" onerror="this.src='https://via.placeholder.com/40'"></td>
            <td>${item.nombre}</td>
            <td>$${item.precio.toLocaleString()}</td>
            <td>${item.cantidad}</td>
        `;
        listaCarritoDOM.appendChild(fila);
    });

    contadorCarrito.textContent = totalItems.toString();
};

const vaciarCarrito = () => {
    carritoCompras = [];
    actualizarCarritoDOM();
};

// Manejo del Formulario
const procesarFormulario = (e) => {
    e.preventDefault();

    const precio = Number(campoPrecio.value);

    if (precio < 1000) {
        alert('El precio del artículo debe ser igual o mayor a $1,000.');
        return;
    }

    const nuevoJuego = {
        id: Date.now(),
        nombre: campoNombre.value.trim(),
        plataforma: campoPlataforma.value.trim(),
        genero: campoGenero.value.trim(),
        clasificacion: campoClasificacion.value.trim(),
        desarrollador: campoDesarrollador.value.trim(),
        imagen: campoImagen.value.trim() || 'https://via.placeholder.com/300x180?text=Juego',
        precio: precio
    };

    catalogoProductos.push(nuevoJuego);
    renderizarCatalogo();
    formularioArticulo.reset();
};

// Event Listeners
formularioArticulo.addEventListener('submit', procesarFormulario);
btnVaciarCarrito.addEventListener('click', vaciarCarrito);

document.addEventListener('DOMContentLoaded', () => {
    renderizarCatalogo();
    actualizarCarritoDOM();
});