import { useState, useEffect } from 'react';

const FormularioVino = ({ onActualizar, vinoEditando, setVinoEditando }) => {
  const [nombre, setNombre] = useState('');
  const [bodega, setBodega] = useState('');
  const [precio, setPrecio] = useState('');

  // Detecta si hay un vino para editar y llena los campos
  useEffect(() => {
    if (vinoEditando) {
      setNombre(vinoEditando.nombre);
      setBodega(vinoEditando.bodega);
      setPrecio(vinoEditando.precio);
    } else {
      setNombre(''); setBodega(''); setPrecio('');
    }
  }, [vinoEditando]);

    const handleSubmit = async (e) => {
    e.preventDefault();
    const datos = { nombre, bodega, precio: Number(precio) };

    const url = vinoEditando
      ? `http://localhost:5000/api/vinos/${vinoEditando._id}`
      : 'http://localhost:5000/api/vinos';

    const metodo = vinoEditando ? 'PUT' : 'POST';
    const token = JSON.parse(localStorage.getItem('userVinoteca'))?.token;

    try {
      const res = await fetch(url, {
        method: metodo,
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(datos)
      });

      if (res.ok) {
        onActualizar(); // Refresca la lista en App.jsx
        setVinoEditando(null); // Limpia el modo edición
        alert(vinoEditando ? "✅ Actualizado" : "🍷 Guardado");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="fv-form">
      <h3 className="fv-title">{vinoEditando ? 'Editar Vino' : 'Nueva Carga'}</h3>
      <input className="fv-input" type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
      <input className="fv-input" type="text" placeholder="Bodega" value={bodega} onChange={e => setBodega(e.target.value)} required />
      <input className="fv-input" type="number" placeholder="Precio" value={precio} onChange={e => setPrecio(e.target.value)} required />

      <div className="fv-actions">
        <button type="submit" className={vinoEditando ? 'fv-btn-update' : 'fv-btn-save'}>
          {vinoEditando ? 'Actualizar' : 'Guardar'}
        </button>
        {vinoEditando && (
          <button type="button" onClick={() => setVinoEditando(null)} className="fv-btn-cancel">Cancelar</button>
        )}
      </div>
    </form>
  );
};

export default FormularioVino;