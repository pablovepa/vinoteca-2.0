import { useState, useEffect } from 'react';

const CajaVentas = ({ vinos, onVentaRealizada }) => {
    const [carrito, setCarrito] = useState([]);
    const [vinoSeleccionado, setVinoSeleccionado] = useState('');
    const [cantidad, setCantidad] = useState(1);

    const agregarAlCarrito = () => {
        if (!vinoSeleccionado) return;
        const vino = vinos.find(v => v._id === vinoSeleccionado);
        if (!vino) return;

        if (cantidad <= 0) {
            alert('La cantidad debe ser mayor a 0');
            return;
        }

        if (vino.stock < cantidad) {
            alert(`No hay suficiente stock. Disponible: ${vino.stock}`);
            return;
        }

        // Verificar si ya está en el carrito para sumar la cantidad
        const existe = carrito.find(item => item.vino === vino._id);
        if (existe) {
            if (existe.cantidad + Number(cantidad) > vino.stock) {
                alert(`No puedes agregar más. El stock máximo es ${vino.stock}`);
                return;
            }
            setCarrito(carrito.map(item =>
                item.vino === vino._id
                    ? { ...item, cantidad: item.cantidad + Number(cantidad) }
                    : item
            ));
        } else {
            setCarrito([...carrito, {
                vino: vino._id,
                nombre: vino.nombre,
                precioUnitario: vino.precio,
                cantidad: Number(cantidad)
            }]);
        }
        
        // Reset inputs
        setVinoSeleccionado('');
        setCantidad(1);
    };

    const eliminarDelCarrito = (idVino) => {
        setCarrito(carrito.filter(item => item.vino !== idVino));
    };

    const calcularTotal = () => {
        return carrito.reduce((total, item) => total + (item.precioUnitario * item.cantidad), 0);
    };

    const confirmarVenta = async () => {
        if (carrito.length === 0) return;

        const token = JSON.parse(localStorage.getItem('userVinoteca'))?.token;

        const total = calcularTotal();
        const bodyVenta = {
            items: carrito,
            total
        };

        try {
            const res = await fetch('http://localhost:5000/api/ventas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(bodyVenta)
            });

            if (res.ok) {
                alert('✅ Venta registrada con éxito');
                setCarrito([]);
                onVentaRealizada(); // Refrescar los vinos (para actualizar stock en UI)
            } else {
                const errorData = await res.json();
                alert(`❌ Error: ${errorData.mensaje}`);
            }
        } catch (error) {
            console.error('Error al confirmar venta:', error);
            alert('Error de conexión con el servidor');
        }
    };

    // Filtrar vinos que tengan stock > 0 para el select
    const vinosDisponibles = vinos.filter(v => v.stock > 0);

    return (
        <div className="cv-container">
            <h2 className="cv-title">🛒 Nueva Venta</h2>
            
            <div className="cv-form-group">
                <select
                    className="cv-input"
                    value={vinoSeleccionado}
                    onChange={(e) => setVinoSeleccionado(e.target.value)}
                >
                    <option value="">-- Seleccionar Vino --</option>
                    {vinosDisponibles.map(v => (
                        <option key={v._id} value={v._id}>
                            {v.nombre} - ${v.precio} (Stock: {v.stock})
                        </option>
                    ))}
                </select>
                <input
                    className="cv-input-small"
                    type="number"
                    min="1"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                />
                <button onClick={agregarAlCarrito} className="cv-btn-add">
                    Agregar
                </button>
            </div>

            <div className="cv-carrito-container">
                <h3 className="cv-subtitle">Cesta actual:</h3>
                {carrito.length === 0 ? (
                    <p className="cv-empty">El carrito está vacío.</p>
                ) : (
                    <table className="cv-table">
                        <thead>
                            <tr>
                                <th className="cv-th">Vino</th>
                                <th className="cv-th">Cant.</th>
                                <th className="cv-th">Precio Unit.</th>
                                <th className="cv-th">Subtotal</th>
                                <th className="cv-th">X</th>
                            </tr>
                        </thead>
                        <tbody>
                            {carrito.map(item => (
                                <tr key={item.vino} className="cv-tr">
                                    <td className="cv-td">{item.nombre}</td>
                                    <td className="cv-td">{item.cantidad}</td>
                                    <td className="cv-td">${item.precioUnitario}</td>
                                    <td className="cv-td">${item.precioUnitario * item.cantidad}</td>
                                    <td className="cv-td">
                                        <button onClick={() => eliminarDelCarrito(item.vino)} className="cv-btn-delete">
                                            Quitar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {carrito.length > 0 && (
                    <div className="cv-total-section">
                        <h2 className="cv-total-text">Total: ${calcularTotal()}</h2>
                        <button onClick={confirmarVenta} className="cv-btn-confirm">
                            Confirmar Cobro
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CajaVentas;
