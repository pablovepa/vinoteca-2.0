import TarjetaVino from './TarjetaVino';

const ListaVinos = ({ vinos, onActualizar, onEditar }) => {
    return (
        <div style={{ marginTop: '20px' }}>
            <h2>Inventario ({vinos.length})</h2>
            {vinos.map(vino => (
                <TarjetaVino
                    key={vino._id}
                    vino={vino}
                    onEliminar={onActualizar}
                    onEditar={onEditar}
                />
            ))}
        </div>
    );
};

export default ListaVinos;