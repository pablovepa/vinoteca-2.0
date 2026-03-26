import TarjetaVino from './TarjetaVino';

const ListaVinos = ({ vinos, onActualizar, onEditar, modo }) => {
    return (
        <div className="lv-container">
            <h2 className="lv-title">Inventario ({vinos.length})</h2>
            {vinos.length > 0 ? (
                <table className="lv-table">
                    <thead>
                        <tr>
                            <th className="lv-th">Nombre</th>
                            <th className="lv-th">Bodega</th>
                            <th className="lv-th">Precio</th>
                            {modo !== 'stock' && <th className="lv-th">Acciones</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {vinos.map(vino => (
                            <TarjetaVino
                                key={vino._id}
                                vino={vino}
                                onEliminar={onActualizar}
                                onEditar={onEditar}
                                modo={modo}
                            />
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="lv-empty">No hay vinos para mostrar.</p>
            )}
        </div>
    );
};

export default ListaVinos;