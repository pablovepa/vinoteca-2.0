import { useState, useEffect } from 'react';
import ListaVinos from './components/ListaVinos';
import FormularioVino from './components/FormularioVino';
import FormularioUser from './components/FormularioUser';
import TarjetaUser from './components/TarjetaUser';
import Login from './components/Login';
import CajaVentas from './components/CajaVentas';
import HistorialVentas from './components/HistorialVentas';

function App() {
  const [vista, setVista] = useState('vinos'); // 'vinos', 'usuarios', 'ventas'
  const [subVistaVinos, setSubVistaVinos] = useState('menu'); // 'menu', 'ingreso', 'modificar', 'eliminar', 'stock'
  const [subVistaVentas, setSubVistaVentas] = useState('menu'); // 'menu', 'nueva', 'historial'

  const [vinos, setVinos] = useState([]);
  const [vinoEditando, setVinoEditando] = useState(null);
  const [user, setUser] = useState([]);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  // 2. SEGUNDO: El useEffect (Siempre debe ejecutarse)
  useEffect(() => {
    // Intentar recuperar la sesión del localStorage
    const guardado = localStorage.getItem('userVinoteca');
    if (guardado) {
      setUsuarioLogueado(JSON.parse(guardado));
    }

    // Solo cargar datos si hay alguien logueado
    if (usuarioLogueado || guardado) {
      obtenerVinos();
      obtenerUsuarios();
    }
  }, []);
  const obtenerVinos = async () => {
    try {
      const token = usuarioLogueado?.token || JSON.parse(localStorage.getItem('userVinoteca'))?.token;
      const res = await fetch('http://localhost:5000/api/vinos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setVinos(Array.isArray(data) ? data : []);
      } else if (res.status === 401) {
        manejarLogout(); // Token vencido o inválido
      } else {
        setVinos([]);
      }
    } catch (err) {
      console.error(err);
      setVinos([]);
    }
  };

  const obtenerUsuarios = async () => {
    try {
      const token = usuarioLogueado?.token || JSON.parse(localStorage.getItem('userVinoteca'))?.token;
      const res = await fetch('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(Array.isArray(data) ? data : []);
      } else if (res.status === 401) {
        manejarLogout(); // Token vencido o inválido (aunque App.jsx ya filtraría por rol)
      } else {
        setUser([]);
      }
    } catch (err) {
      console.error(err);
      setUser([]);
    }
  };

  const eliminarUsuario = async (id) => {
    if (window.confirm('¿Seguro que quieres eliminar este usuario?')) {
      try {
        const token = usuarioLogueado?.token || JSON.parse(localStorage.getItem('userVinoteca'))?.token;
        const res = await fetch(`http://localhost:5000/api/users/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setUser(user.filter(u => u._id !== id));
        }
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      }
    }
  };

  const manejarLogout = () => {
    localStorage.removeItem('userVinoteca');
    setUsuarioLogueado(null);
  };
  const manejarEliminacionLocal = (id) => {
    // Usamos la versión de función de setState para asegurarnos 
    // de tener el estado más reciente (prevVinos)
    setVinos(prevVinos => prevVinos.filter(v => v._id !== id));
  };


  if (!usuarioLogueado) {
    return <Login onLoginSuccess={setUsuarioLogueado} />;
  }

  return (
    <div className="app-contenedor">
      <header className="app-header">
        <h1>🍇 Vinoteca "La Cepa"</h1>
        <nav className="app-nav">
          <button
            onClick={() => { setVista('vinos'); setSubVistaVinos('menu'); }}
            className={vista === 'vinos' ? 'app-btn-activo' : 'app-btn-nav'}
          >
            Gestión de Vinos
          </button>
          <button
            onClick={() => { setVista('ventas'); setSubVistaVentas('menu'); }}
            className={vista === 'ventas' ? 'app-btn-activo' : 'app-btn-nav'}
          >
            Gestión de Ventas
          </button>
          {usuarioLogueado?.isAdmin && (
            <button
              onClick={() => setVista('usuarios')}
              className={vista === 'usuarios' ? 'app-btn-activo' : 'app-btn-nav'}
            >
              Gestión de Usuarios
            </button>
          )}
          <button
            onClick={manejarLogout}
            className="app-btn-logout"
          >
            Cerrar Sesión
          </button>
        </nav>
      </header>

      <main className="app-contenido">
        {/* RENDERIZADO CONDICIONAL: Solo muestra lo que elegiste */}
        {vista === 'vinos' || !usuarioLogueado?.isAdmin ? (
          <section>
            {subVistaVinos === 'menu' && (
              <div className="app-dashboard-container">
                <h2 className="app-menu-title">Menú de Vinos</h2>
                <div className="app-card-grid">
                  <div className="app-action-card" onClick={() => setSubVistaVinos('ingreso')}>
                    <h2>🍷 Ingreso de Vinos</h2>

                  </div>
                  <div className="app-action-card" onClick={() => setSubVistaVinos('modificar')}>
                    <h2>✏️ Modificación de Vinos</h2>

                  </div>
                  <div className="app-action-card" onClick={() => setSubVistaVinos('eliminar')}>
                    <h2>🗑️ Eliminación de Vinos</h2>

                  </div>
                  <div className="app-action-card" onClick={() => setSubVistaVinos('stock')}>
                    <h2>📦 Ver Stock</h2>

                  </div>
                </div>
              </div>
            )}

            {subVistaVinos !== 'menu' && (
              <div className="app-volver-container">
                <button
                  onClick={() => { setSubVistaVinos('menu'); setVinoEditando(null); }}
                  className="app-btn-nav"
                >
                  ⬅️ Volver al menú
                </button>
              </div>
            )}

            {subVistaVinos === 'ingreso' && (
              <FormularioVino
                onActualizar={obtenerVinos}
                vinoEditando={null}
                setVinoEditando={() => { }}
              />
            )}

            {subVistaVinos === 'modificar' && (
              <>
                {vinoEditando && (
                  <FormularioVino
                    onActualizar={obtenerVinos}
                    vinoEditando={vinoEditando}
                    setVinoEditando={setVinoEditando}
                  />
                )}
                <ListaVinos
                  vinos={vinos}
                  onActualizar={obtenerVinos}
                  onEditar={setVinoEditando}
                  modo="modificar" // Añadimos propiedad modo
                />
              </>
            )}

            {subVistaVinos === 'eliminar' && (
              <ListaVinos
                vinos={vinos}
                onActualizar={obtenerVinos}
                onEditar={() => { }}
                modo="eliminar" // Añadimos propiedad modo
              />
            )}

            {subVistaVinos === 'stock' && (
              <ListaVinos
                vinos={vinos}
                onActualizar={obtenerVinos}
                onEditar={() => { }}
                modo="stock" // Añadimos propiedad modo
              />
            )}
          </section>
        ) : vista === 'ventas' ? (
          <section>
            {subVistaVentas === 'menu' && (
              <div className="app-dashboard-container">
                <h2 className="app-menu-title">Menú de Ventas</h2>
                <div className="app-card-grid-ventas">
                  <div className="app-action-card" onClick={() => setSubVistaVentas('nueva')}>
                    <h3>🛒 Nueva Venta (Caja)</h3>
                    <p>Registrar una venta y cobrar.</p>
                  </div>
                  <div className="app-action-card" onClick={() => setSubVistaVentas('historial')}>
                    <h3>📋 Historial de Ventas</h3>
                    <p>Ver todas las ventas pasadas.</p>
                  </div>
                </div>
              </div>
            )}

            {subVistaVentas !== 'menu' && (
              <div className="app-volver-container">
                <button
                  onClick={() => setSubVistaVentas('menu')}
                  className="app-btn-nav"
                >
                  ⬅️ Volver al menú
                </button>
              </div>
            )}

            {subVistaVentas === 'nueva' && (
              <CajaVentas
                vinos={vinos}
                onVentaRealizada={obtenerVinos} // Refresca stock tras la venta
              />
            )}

            {subVistaVentas === 'historial' && (
              <HistorialVentas />
            )}
          </section>
        ) : (
          <section>
            <FormularioUser
              onUsuarioCreado={obtenerUsuarios}
              usuarioEditando={usuarioEditando}
              setUsuarioEditando={setUsuarioEditando}
            />
            <div className="app-usuarios-container">
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

      <footer className="app-footer">
        <p>Desarrollado por <strong>Vity</strong> &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;