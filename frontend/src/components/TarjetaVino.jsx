const TarjetaVino = ({ vino, onEliminar, onEditar, modo }) => {

    const eliminarVino = async (id) => {
        if (!window.confirm(`¿Seguro que quieres eliminar ${vino.nombre}?`)) return;

        // 1. PRIMERO: Actualizamos la interfaz (UI) para que el usuario vea el cambio ya
        onEliminar(id);

        try {
            // 2. SEGUNDO: Enviamos la orden al servidor en segundo plano
            const token = JSON.parse(localStorage.getItem('userVinoteca'))?.token;
            const res = await fetch(`http://localhost:5000/api/vinos/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
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
        <tr className="tv-tr">
            <td className="tv-td"><strong>{vino.nombre}</strong></td>
            <td className="tv-td">{vino.bodega}</td>
            <td className="tv-td">${vino.precio}</td>
            {modo !== 'stock' && (
                <td className="tv-td">
                    {modo === 'modificar' && (
                        <button onClick={() => onEditar(vino)} className="tv-btn-edit">
                            Editar
                        </button>
                    )}
                    {modo === 'eliminar' && (
                        <button onClick={() => eliminarVino(vino._id)} className="tv-btn-delete">
                            Borrar
                        </button>
                    )}
                </td>
            )}
        </tr>
    );
};

export default TarjetaVino;