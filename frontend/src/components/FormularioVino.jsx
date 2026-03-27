import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000';

const FormularioVino = ({ onActualizar, vinoEditando, setVinoEditando }) => {
  const [nombre, setNombre] = useState('');
  const [bodega, setBodega] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (vinoEditando) {
      setNombre(vinoEditando.nombre);
      setBodega(vinoEditando.bodega);
      setPrecio(vinoEditando.precio);
      setStock(vinoEditando.stock ?? '');
      setPreview(vinoEditando.image ? `${API_URL}${vinoEditando.image}` : null);
    } else {
      setNombre(''); setBodega(''); setPrecio(''); setStock('');
      setImageFile(null); setPreview(null);
    }
  }, [vinoEditando]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('bodega', bodega);
    formData.append('precio', Number(precio));
    formData.append('stock', Number(stock));
    if (imageFile) formData.append('image', imageFile);

    const url = vinoEditando
      ? `${API_URL}/api/vinos/${vinoEditando._id}`
      : `${API_URL}/api/vinos`;

    const metodo = vinoEditando ? 'PUT' : 'POST';
    const token = JSON.parse(localStorage.getItem('userVinoteca'))?.token;

    try {
      const res = await fetch(url, {
        method: metodo,
        headers: { Authorization: `Bearer ${token}` },
        body: formData   // No poner Content-Type, el browser lo pone automáticamente con boundary
      });

      if (res.ok) {
        onActualizar();
        setVinoEditando(null);
        setImageFile(null);
        setPreview(null);
        alert(vinoEditando ? "✅ Actualizado" : "🍷 Guardado");
      } else {
        const err = await res.json();
        alert(`Error: ${err.mensaje || 'No se pudo guardar'}`);
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
      <input className="fv-input" type="number" placeholder="Stock" value={stock} onChange={e => setStock(e.target.value)} required min="0" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ color: '#555', fontWeight: 'bold', fontSize: '14px' }}>
          Imagen del Vino (opcional)
        </label>
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange}
          style={{ padding: '4px', border: '1px solid #ccc', borderRadius: '4px', color: '#333' }} />
        {preview && (
          <img src={preview} alt="Preview" style={{ maxHeight: '150px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #ddd' }} />
        )}
      </div>

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