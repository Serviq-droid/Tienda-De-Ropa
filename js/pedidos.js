let todosPedidos = [];
let pedidosFiltrados = [];

function cargarPedidos() {
    todosPedidos = JSON.parse(localStorage.getItem('pedidosRopa')) || [];
    pedidosFiltrados = [...todosPedidos];
    mostrarPedidos(pedidosFiltrados);
    calcularTotalVentas(pedidosFiltrados);
}

function mostrarPedidos(pedidos) {
    const tbody = document.getElementById('tablaPedidos');

    if (pedidos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-5">No hay pedidos registrados</td></tr>';
        return;
    }

    tbody.innerHTML = '';
    pedidos.forEach(pedido => {
        tbody.innerHTML += `
            <tr>
                <td>${pedido.cliente}</td>
                <td>${pedido.producto}</td>
                <td>${pedido.talla}</td>
                <td>${pedido.cantidad}</td>
                <td><span class="badge bg-custom">${pedido.metodoPago}</span></td>
                <td class="fw-bold">$${pedido.total}</td>
                <td>${pedido.fecha}</td>
            </tr>
        `;
    });
}

function calcularTotalVentas(pedidos) {
    const total = pedidos.reduce((sum, pedido) => sum + pedido.total, 0);
    document.getElementById('totalVentas').textContent = `$${total.toFixed(2)}`;
}

function aplicarFiltros() {
    const filtroMetodo = document.getElementById('filtroMetodo').value;
    const filtroFecha = document.getElementById('filtroFecha').value;

    pedidosFiltrados = todosPedidos.filter(pedido => {
        const cumpleMetodo = !filtroMetodo || pedido.metodoPago === filtroMetodo;
        const cumpleFecha = !filtroFecha || pedido.fecha === new Date(filtroFecha).toLocaleDateString('es-ES');
        return cumpleMetodo && cumpleFecha;
    });

    mostrarPedidos(pedidosFiltrados);
    calcularTotalVentas(pedidosFiltrados);
}

function limpiarPedidos() {
    if (confirm('¿Estás seguro de que deseas eliminar todos los pedidos? Esta acción no se puede deshacer.')) {
        localStorage.removeItem('pedidosRopa');
        todosPedidos = [];
        pedidosFiltrados = [];
        mostrarPedidos([]);
        calcularTotalVentas([]);
        document.getElementById('filtroMetodo').value = '';
        document.getElementById('filtroFecha').value = '';
    }
}

document.getElementById('filtroMetodo').addEventListener('change', aplicarFiltros);
document.getElementById('filtroFecha').addEventListener('change', aplicarFiltros);

cargarPedidos();