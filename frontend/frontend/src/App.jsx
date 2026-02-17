import { useState, useEffect } from 'react';
import ListaVinos from './components/ListaVinos';
import FormularioVino from './components/FormularioVino';
import FormularioUser from './components/FormularioUser';
import TarjetaUser from './components/TarjetaUser';

function App() {
  const [vista, setVista] = useState('vinos');

  const [vinos, setVinos] = useState([]);
  const [vinoEditando, setVinoEditando] = useState(null);
  const [user, setUser] = useState([]);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const obtenerVinos = async () => {
    const res = await fetch('http://localhost:5000/api/vinos');
    const data = await res.json();
    setVinos(data);
  };
  const obtenerUsuarios = async () => {
    const res = await fetch('http://localhost:5000/api/users');
    const data = await res.json();
    setUser(data);
  };

  const eliminarUsuario = async (id) => {
    if (window.confirm('¿Seguro que quieres eliminar este usuario?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setUser(user.filter(u => u._id !== id));
        }
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      }
    }
  };
  const manejarEliminacionLocal = (id) => {
    // Filtramos el array de vinos eliminando el que coincide con el ID
    // Esto es INSTANTÁNEO en la pantalla
    setVinos(vinos.filter(v => v._id !== id));
  };
  useEffect(() => {
    obtenerVinos();
    obtenerUsuarios();
  }, []);

  return (
    <div style={styles.contenedorPadre}>
      <header style={styles.header}>
        <h1>🍇 Vinoteca "La Cepa"</h1>
        <nav style={styles.nav}>
          <button
            onClick={() => setVista('vinos')}
            style={vista === 'vinos' ? styles.btnActivo : styles.btnNav}
          >
            Gestión de Vinos
          </button>
          <button
            onClick={() => setVista('usuarios')}
            style={vista === 'usuarios' ? styles.btnActivo : styles.btnNav}
          >
            Gestión de Usuarios
          </button>
        </nav>
      </header>

      <main style={styles.contenido}>
        {/* RENDERIZADO CONDICIONAL: Solo muestra lo que elegiste */}
        {vista === 'vinos' ? (
          <section>
            <FormularioVino
              onActualizar={obtenerVinos}
              vinoEditando={vinoEditando}
              setVinoEditando={setVinoEditando}
            />
            <ListaVinos
              vinos={vinos}
              onActualizar={obtenerVinos}
              onEditar={setVinoEditando}
            />
          </section>
        ) : (
          <section>
            <FormularioUser
              onUsuarioCreado={obtenerUsuarios}
              usuarioEditando={usuarioEditando}
              setUsuarioEditando={setUsuarioEditando}
            />
            <div style={{ marginTop: '20px' }}>
              <h3>Lista de Usuarios Registrados</h3>
              {user.map(u => (
                <TarjetaUser
                  key={u._id}
                  usuario={u}
                  onEliminar={eliminarUsuario}
                  onEditar={setUsuarioEditando}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

const styles = {
  contenedorPadre: { maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial, sans-serif' },
  header: { textAlign: 'center', padding: '20px', backgroundColor: '#722f37', color: 'white' },
  nav: { display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '15px' },
  contenido: { padding: '20px' },
  btnNav: { padding: '10px 20px', cursor: 'pointer', backgroundColor: '#9e424b', color: 'white', border: 'none', borderRadius: '4px' },
  btnActivo: { padding: '10px 20px', cursor: 'pointer', backgroundColor: 'white', color: '#722f37', border: 'none', borderRadius: '4px', fontWeight: 'bold' }
};

export default App;