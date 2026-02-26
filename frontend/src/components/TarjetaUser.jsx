const TarjetaUser = ({ usuario, onEliminar, onEditar }) => {
    return (
        <div style={styles.card}>
            <div style={styles.info}>
                {/* Envolvemos cada dato en un div para forzar el salto de línea */}
                <div style={styles.dato}>
                    <strong>Usuario:</strong> {usuario.username}
                </div>
                <div style={styles.dato}>
                    <strong>Email:</strong> {usuario.email}
                </div>
                <div style={styles.dato}>
                    <strong>Rol:</strong> {usuario.isAdmin ? "Administrador" : "Empleado"}
                </div>
            </div>

            <div style={styles.acciones}>
                <button
                    onClick={() => onEditar(usuario)}
                    style={styles.btnEditar}
                >
                    ✏️ Editar
                </button>

                <button
                    onClick={() => onEliminar(usuario._id)}
                    style={styles.btnEliminar}
                >
                    🗑️ Eliminar
                </button>
            </div>
        </div>
    );
};

const styles = {
    card: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '15px',
        backgroundColor: '#0a0909ff',
        borderBottom: '1px solid #ddd',
        alignItems: 'center'
    },
    acciones: {
        display: 'flex',
        gap: '10px'
    },
    btnEditar: {
        backgroundColor: '#f39c12',
        color: 'white',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    btnEliminar: {
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '4px',
        cursor: 'pointer'
    }
};
export default TarjetaUser;