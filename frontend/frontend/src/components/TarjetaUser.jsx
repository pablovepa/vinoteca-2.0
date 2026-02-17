const TarjetaUser = ({ usuario, onEliminar, onEditar }) => {
    return (
        <div style={styles.card}>
            <div style={styles.info}>
                {/* Mostramos el nombre (username) y el email */}
                <strong style={styles.nombre}>{usuario.username}</strong>
                <span style={styles.email}>{usuario.email}</span>
            </div>

            <div style={styles.acciones}>
                {/* BOTÓN EDITAR (El que te falta) */}
                <button
                    onClick={() => onEditar(usuario)}
                    style={styles.btnEditar}
                >
                    ✏️ Editar
                </button>

                {/* BOTÓN ELIMINAR */}
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