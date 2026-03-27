import { useState, useEffect } from 'react';
import ListaVinos from '../components/ListaVinos';
import FormularioVino from '../components/FormularioVino';
import FormularioUser from '../components/FormularioUser';
import TarjetaUser from '../components/TarjetaUser';
import CajaVentas from '../components/CajaVentas';
import HistorialVentas from '../components/HistorialVentas';
import { useAuth } from '../auth/AuthProvider';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [vista, setVista] = useState('vinos');
  const [subVistaVinos, setSubVistaVinos] = useState('menu');
  const [subVistaVentas, setSubVistaVentas] = useState('menu');

  const [vinos, setVinos] = useState([]);
  const [vinoEditando, setVinoEditando] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  useEffect(() => {
    if (user) {
      obtenerVinos();
      obtenerUsuarios();
    }
  }, [user]);

  const obtenerVinos = async () => {
    try {
      const token = user?.token || JSON.parse(localStorage.getItem('userVinoteca'))?.token;
      const res = await fetch('http://localhost:5000/api/vinos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setVinos(Array.isArray(data) ? data : []);
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
      const token = user?.token || JSON.parse(localStorage.getItem('userVinoteca'))?.token;
      const res = await fetch('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsuarios(Array.isArray(data) ? data : []);
      } else {
        setUsuarios([]);
      }
    } catch (err) {
      console.error(err);
      setUsuarios([]);
    }
  };

  const eliminarUsuario = async (id) => {
    if (window.confirm('¿Seguro que quieres eliminar este usuario?')) {
      try {
        const token = user?.token || JSON.parse(localStorage.getItem('userVinoteca'))?.token;
        const res = await fetch(`http://localhost:5000/api/users/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setUsuarios(usuarios.filter(u => u._id !== id));
        }
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      }
    }
  };

  const manejarLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app-contenedor">
      <header className="app-header">
        <h1>🍷 Panel de Administración</h1>
        <nav className="app-nav">
          <button
            onClick={() => navigate('/')}
            className="app-btn-nav"
            style={{ backgroundColor: '#2c3e50' }}
          >
            🛒 Ir a la Tienda
          </button>
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
          <button
            onClick={() => setVista('usuarios')}
            className={vista === 'usuarios' ? 'app-btn-activo' : 'app-btn-nav'}
          >
            Gestión de Usuarios
          </button>
          <button
            onClick={manejarLogout}
            className="app-btn-logout"
          >
            Cerrar Sesión
          </button>
        </nav>
      </header>

      <main className="app-contenido">
        {vista === 'vinos' ? (
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
                  modo="modificar"
                />
              </>
            )}

            {subVistaVinos === 'eliminar' && (
              <ListaVinos
                vinos={vinos}
                onActualizar={obtenerVinos}
                onEditar={() => { }}
                modo="eliminar"
              />
            )}

            {subVistaVinos === 'stock' && (
              <ListaVinos
                vinos={vinos}
                onActualizar={obtenerVinos}
                onEditar={() => { }}
                modo="stock"
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
                onVentaRealizada={obtenerVinos}
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
              {usuarios.map(u => (
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
