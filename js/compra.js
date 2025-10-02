let productoSeleccionado = null;

function cargarProductos() {
    const selectProducto = document.getElementById('producto');
    const urlParams = new URLSearchParams(window.location.search);
    const idPreseleccionado = urlParams.get('id');

    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = `${product.name} - $${product.price}`;
        selectProducto.appendChild(option);
    });

    if (idPreseleccionado) {
        selectProducto.value = idPreseleccionado;
        cargarTallas();
        calcularResumen();
    }
}

function cargarTallas() {
    const selectProducto = document.getElementById('producto');
    const selectTalla = document.getElementById('talla');
    const productoId = parseInt(selectProducto.value);

    selectTalla.innerHTML = '<option value="">Selecciona una talla</option>';

    if (productoId) {
        productoSeleccionado = products.find(p => p.id === productoId);

        if (productoSeleccionado) {
            productoSeleccionado.tallas.forEach(talla => {
                const option = document.createElement('option');
                option.value = talla;
                option.textContent = talla;
                selectTalla.appendChild(option);
            });
        }
    }

    calcularResumen();
}

function calcularResumen() {
    const selectProducto = document.getElementById('producto');
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
    const resumenDiv = document.getElementById('resumenPedido');

    if (!selectProducto.value) {
        resumenDiv.innerHTML = '<p class="text-muted">Selecciona un producto para ver el resumen</p>';
        return;
    }

    const productoId = parseInt(selectProducto.value);
    const producto = products.find(p => p.id === productoId);

    if (!producto) {
        resumenDiv.innerHTML = '<p class="text-muted">Producto no encontrado</p>';
        return;
    }

    const subtotal = producto.price * cantidad;
    const envio = subtotal >= 100 ? 0 : 10;
    const total = subtotal + envio;

    resumenDiv.innerHTML = `
        <div class="mb-3">
            <img src="${producto.img}" class="img-fluid rounded mb-3" alt="${producto.name}">
            <h6 class="fw-bold">${producto.name}</h6>
            <p class="text-muted mb-0">Precio unitario: $${producto.price}</p>
        </div>
        <hr>
        <div class="d-flex justify-content-between mb-2">
            <span>Subtotal (${cantidad} unidad${cantidad > 1 ? 'es' : ''}):</span>
            <span class="fw-bold">$${subtotal}</span>
        </div>
        <div class="d-flex justify-content-between mb-2">
            <span>Envío:</span>
            <span class="fw-bold ${envio === 0 ? 'text-success' : ''}">
                ${envio === 0 ? 'GRATIS' : '$' + envio}
            </span>
        </div>
        ${envio > 0 ? '<p class="text-muted small">Envío gratis en compras mayores a $100</p>' : ''}
        <hr>
        <div class="d-flex justify-content-between">
            <span class="fw-bold">Total:</span>
            <span class="fw-bold fs-4 text-custom">$${total}</span>
        </div>
    `;
}

function confirmarPedido() {
    const form = document.getElementById('formCompra');

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const direccion = document.getElementById('direccion').value;
    const productoId = parseInt(document.getElementById('producto').value);
    const talla = document.getElementById('talla').value;
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const metodoPago = document.querySelector('input[name="metodoPago"]:checked').value;

    if (!productoId || !talla) {
        alert('Por favor completa todos los campos del pedido');
        return;
    }

    const producto = products.find(p => p.id === productoId);
    const subtotal = producto.price * cantidad;
    const envio = subtotal >= 100 ? 0 : 10;
    const total = subtotal + envio;

    const pedido = {
        cliente: nombre,
        email: email,
        direccion: direccion,
        producto: producto.name,
        talla: talla,
        cantidad: cantidad,
        metodoPago: metodoPago,
        total: total,
        fecha: new Date().toLocaleDateString('es-ES')
    };

    let pedidos = JSON.parse(localStorage.getItem('pedidosRopa')) || [];
    pedidos.push(pedido);
    localStorage.setItem('pedidosRopa', JSON.stringify(pedidos));

    alert('¡Pedido confirmado con éxito!');
    window.location.href = 'pedidos.html';
}

document.getElementById('producto').addEventListener('change', cargarTallas);
document.getElementById('cantidad').addEventListener('input', calcularResumen);

cargarProductos();