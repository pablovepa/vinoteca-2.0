const TarjetaUser = ({ usuario, onEliminar, onEditar }) => {
    return (
        <div className="tu-card">
            <div className="tu-info">
                {/* Envolvemos cada dato en un div para forzar el salto de línea */}
                <div className="tu-dato">
                    <strong>Usuario:</strong> {usuario.username}
                </div>
                <div className="tu-dato">
                    <strong>Email:</strong> {usuario.email}
                </div>
                <div className="tu-dato">
                    <strong>Rol:</strong> {usuario.isAdmin ? "Administrador" : "Empleado"}
                </div>
            </div>

            <div className="tu-acciones">
                <button
                    onClick={() => onEditar(usuario)}
                    className="tu-btn-editar"
                >
                    ✏️ Editar
                </button>

                <button
                    onClick={() => onEliminar(usuario._id)}
                    className="tu-btn-eliminar"
                >
                    🗑️ Eliminar
                </button>
            </div>
        </div>
    );
};

export default TarjetaUser;