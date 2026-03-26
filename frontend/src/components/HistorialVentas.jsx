import { useState, useEffect } from 'react';

const HistorialVentas = () => {
    const [ventas, setVentas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        obtenerHistorial();
    }, []);

    const obtenerHistorial = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('userVinoteca'))?.token;
            const res = await fetch('http://localhost:5000/api/ventas', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setVentas(data);
            } else {
                setError('Error al obtener el historial de ventas.');
            }
        } catch (err) {
            setError('Error de conexión.');
        } finally {
            setCargando(false);
        }
    };

    if (cargando) return <p>Cargando historial...</p>;
    if (error) return <p className="error-msg">{error}</p>;

    return (
        <div className="hv-container">
            <h2 className="hv-title">📋 Historial de Ventas</h2>
            {ventas.length === 0 ? (
                <p>No hay ventas registradas.</p>
            ) : (
                <div className="hv-list">
                    {ventas.map((venta) => (
                        <div key={venta._id} className="hv-card">
                            <div className="hv-header-row">
                                <strong>Vendedor:</strong> {venta.user?.username || 'Desconocido'}
                                <span className="hv-date">
                                    {new Date(venta.createdAt).toLocaleString()}
                                </span>
                            </div>
                            <table className="hv-table">
                                <thead>
                                    <tr>
                                        <th className="hv-th">Vino</th>
                                        <th className="hv-th">Cant.</th>
                                        <th className="hv-th">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {venta.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="hv-td">{item.nombre}</td>
                                            <td className="hv-td">{item.cantidad}</td>
                                            <td className="hv-td">${item.precioUnitario * item.cantidad}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="hv-total-row">
                                <strong>Total Venta: ${venta.total}</strong>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistorialVentas;
