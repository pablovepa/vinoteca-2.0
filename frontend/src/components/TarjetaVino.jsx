const TarjetaVino = ({ vino, onEliminar, onEditar }) => {

    const eliminarVino = async (id) => {
        if (!window.confirm(`¿Seguro que quieres eliminar ${vino.nombre}?`)) return;

        // 1. PRIMERO: Actualizamos la interfaz (UI) para que el usuario vea el cambio ya
        onEliminar(id);

        try {
            // 2. SEGUNDO: Enviamos la orden al servidor en segundo plano
            const res = await fetch(`http://localhost:5000/api/vinos/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) {
                // Si el servidor falla, podrías avisar al usuario
                alert("Hubo un error en el servidor, refresca la página.");
            }
        } catch (error) {
            console.error("Error al borrar:", error);
        }
    };

    return (
        <div style={styles.tarjeta}>
            <div>
                <strong>{vino.nombre}</strong> - {vino.bodega}
                <span style={styles.precio}> (${vino.precio})</span>
            </div>
            <div>
                <button onClick={() => onEditar(vino)} style={styles.btnEdit}>
                    Editar
                </button>
                <button onClick={() => eliminarVino(vino._id)} style={styles.btnDelete}>
                    Borrar
                </button>
            </div>
        </div>
    );
};

const styles = {
    tarjeta: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '15px',
        borderBottom: '1px solid #1a1717ff',
        alignItems: 'center',
        backgroundColor: '#050404ff',
        marginBottom: '5px',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    },
    precio: { color: '#722f37', fontWeight: 'bold' },
    btnEdit: { backgroundColor: '#ffc107', border: 'none', marginRight: '8px', cursor: 'pointer', padding: '5px 12px', borderRadius: '4px' },
    btnDelete: { backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer', padding: '5px 12px', borderRadius: '4px' }
};

export default TarjetaVino;