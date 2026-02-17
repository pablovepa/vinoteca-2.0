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

    try {
      const res = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
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
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3 style={{ color: '#333' }}>{vinoEditando ? 'Editar Vino' : 'Nueva Carga'}</h3>
      <input style={styles.input} type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
      <input style={styles.input} type="text" placeholder="Bodega" value={bodega} onChange={e => setBodega(e.target.value)} required />
      <input style={styles.input} type="number" placeholder="Precio" value={precio} onChange={e => setPrecio(e.target.value)} required />

      <div style={{ display: 'flex', gap: '10px' }}>
        <button type="submit" style={vinoEditando ? styles.btnUpdate : styles.btnSave}>
          {vinoEditando ? 'Actualizar' : 'Guardar'}
        </button>
        {vinoEditando && (
          <button type="button" onClick={() => setVinoEditando(null)} style={styles.btnCancel}>Cancelar</button>
        )}
      </div>
    </form>
  );
};

const styles = {
  form: { display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px', backgroundColor: '#f4f4f4', borderRadius: '8px' },
  input: { padding: '10px', borderRadius: '4px', border: '1px solid #ccc', color: '#333' },
  btnSave: { backgroundColor: '#722f37', color: 'white', padding: '10px', border: 'none', cursor: 'pointer' },
  btnUpdate: { backgroundColor: '#28a745', color: 'white', padding: '10px', border: 'none', cursor: 'pointer' },
  btnCancel: { backgroundColor: '#666', color: 'white', padding: '10px', border: 'none', cursor: 'pointer' }
};

export default FormularioVino;