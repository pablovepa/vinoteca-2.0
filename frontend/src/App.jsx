import { Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import Shop from './pages/Shop';
import VinoDetails from './pages/VinoDetails';
import MisCompras from './pages/MisCompras';
import Carrito from './pages/Carrito';
import AdminPanel from './pages/AdminPanel';
import Login from './components/Login';
import { useAuth } from './auth/AuthProvider';
import { useCart } from './context/CartContext';

function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  
  const cartItemsCount = cart.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <nav style={{ padding: '15px', backgroundColor: '#722f37', display: 'flex', gap: '15px', alignItems: 'center' }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>🍷 Vinoteca</Link>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '15px', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>🍷 Catálogo</Link>
        <Link to="/carrito" style={{ color: 'white', textDecoration: 'none' }}>
          🛒 Carrito {cartItemsCount > 0 && <span style={{ backgroundColor: '#f39c12', padding: '2px 6px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold' }}>{cartItemsCount}</span>}
        </Link>
        {user ? (
          <>
            <Link to="/mis-compras" style={{ color: 'white', textDecoration: 'none' }}>Mis Compras</Link>
            {user.isAdmin && <Link to="/admin" style={{ color: '#f39c12', fontWeight: 'bold', textDecoration: 'none' }}>Panel Admin</Link>}
            <button onClick={() => { logout(); navigate('/'); }} style={{ color: 'white', background: 'transparent', border: 'none', cursor: 'pointer' }}>Cerrar Sesión</button>
          </>
        ) : (
          <Link to="/login" style={{ color: 'white' }}>Ingresar</Link>
        )}
      </div>
    </nav>
  );
}

function App() {
  const { user } = useAuth();

  return (
    <>
      <Routes>
        <Route path="/admin/*" element={user?.isAdmin ? <AdminPanel /> : <Navigate to="/" />} />
        
        <Route path="*" element={
          <div style={{ minHeight: '100vh', backgroundColor: '#111' }}>
            <Navbar />
            <Routes>
              <Route path="/" element={<Shop />} />
              <Route path="/login" element={<div style={{ paddingTop: '50px' }}><Login onLoginSuccess={() => window.location.href = '/'} /></div>} />
              <Route path="/vinos/:id" element={<VinoDetails />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/mis-compras" element={user ? <MisCompras /> : <Navigate to="/login" />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        } />
      </Routes>
    </>
  );
}

export default App;