let productosFiltrados = [...products];

function mostrarProductos(productosAMostrar) {
    const container = document.getElementById('catalogoProductos');
    container.innerHTML = '';

    if (productosAMostrar.length === 0) {
        container.innerHTML = '<div class="col-12 text-center py-5"><p class="text-muted">No se encontraron productos con los filtros seleccionados</p></div>';
        return;
    }

    productosAMostrar.forEach(product => {
        const tallasHTML = product.tallas.map(t => `<span class="badge bg-secondary me-1">${t}</span>`).join('');

        container.innerHTML += `
            <div class="col-md-6 col-lg-4">
                <div class="card product-card h-100">
                    <img src="${product.img}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        ${product.nuevo ? '<span class="badge bg-custom mb-2">Nuevo</span>' : ''}
                        <h5 class="card-title">${product.name}</h5>
                        <p class="text-muted text-capitalize mb-2">${product.categoria}</p>
                        <div class="mb-3">${tallasHTML}</div>
                        <p class="card-text fw-bold fs-5 text-custom">$${product.price}</p>
                        <a href="compra.html?id=${product.id}" class="btn btn-custom w-100">Comprar</a>
                    </div>
                </div>
            </div>
        `;
    });
}

function aplicarFiltros() {
    const categoriasSeleccionadas = [];
    const tallasSeleccionadas = [];

    document.querySelectorAll('.form-check-input[type="checkbox"]').forEach(checkbox => {
        if (checkbox.checked) {
            if (checkbox.value === 'hombre' || checkbox.value === 'mujer' ||
                checkbox.value === 'unisex' || checkbox.value === 'accesorios') {
                categoriasSeleccionadas.push(checkbox.value);
            } else {
                tallasSeleccionadas.push(checkbox.value);
            }
        }
    });

    productosFiltrados = products.filter(product => {
        const cumpleCategoria = categoriasSeleccionadas.length === 0 ||
                                categoriasSeleccionadas.includes(product.categoria);

        const cumpleTalla = tallasSeleccionadas.length === 0 ||
                           tallasSeleccionadas.some(talla => product.tallas.includes(talla));

        return cumpleCategoria && cumpleTalla;
    });

    mostrarProductos(productosFiltrados);

    const offcanvasElement = document.getElementById('filtrosOffcanvas');
    const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
    if (offcanvas) {
        offcanvas.hide();
    }
}

function limpiarFiltros() {
    document.querySelectorAll('.form-check-input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    productosFiltrados = [...products];
    mostrarProductos(productosFiltrados);
}

mostrarProductos(products);