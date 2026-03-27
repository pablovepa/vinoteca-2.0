import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../auth/AuthProvider';
import api from '../api';

const API_URL = "http://localhost:5000";

export default function Carrito() {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) {
      alert("Por favor, inicia sesión para realizar la compra.");
      navigate('/login');
      return;
    }

    if (cart.length === 0) return;

    try {
      const payload = {
        items: cart.map(item => ({
          vino: item.vino._id,
          nombre: item.vino.nombre,
          cantidad: item.cantidad,
          precioUnitario: item.vino.precio
        })),
        total: getCartTotal()
      };

      await api.post('/ventas', payload);
      alert('¡Compra realizada con éxito! 🍷');
      clearCart();
      navigate('/mis-compras');

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error al procesar la compra.');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-white text-center mt-10">
        <h1 className="text-3xl mb-4">🛒 Mi Carrito</h1>
        <p className="text-gray-400 mb-6">Tu carrito de compras está vacío.</p>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
        >
          Ir a ver Vinos
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto text-white">
      <h1 className="text-3xl mb-6">🛒 Mi Carrito</h1>
      
      <div className="bg-gray-800 rounded-lg p-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2">Vino</th>
              <th className="py-2">Precio</th>
              <th className="py-2 text-center">Cantidad</th>
              <th className="py-2">Subtotal</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {cart.map(item => (
              <tr key={item.vino._id} className="border-b border-gray-700">
                <td className="py-4 flex items-center gap-3">
                  <img 
                    src={item.vino.image ? `${API_URL}${item.vino.image}` : '/placeholder.png'} 
                    alt={item.vino.nombre} 
                    className="w-12 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold">{item.vino.nombre}</p>
                    <p className="text-xs text-gray-400">{item.vino.bodega}</p>
                  </div>
                </td>
                <td className="py-4 font-bold text-gray-300">${item.vino.precio}</td>
                <td className="py-4 text-center">
                  <button 
                    onClick={() => updateQuantity(item.vino._id, Math.max(1, item.cantidad - 1))}
                    className="px-2 bg-gray-600 rounded"
                  >-</button>
                  <span className="mx-3">{item.cantidad}</span>
                  <button 
                    onClick={() => updateQuantity(item.vino._id, item.cantidad + 1)}
                    className="px-2 bg-gray-600 rounded"
                  >+</button>
                </td>
                <td className="py-4 font-bold text-green-400">
                  ${item.vino.precio * item.cantidad}
                </td>
                <td className="py-4 text-right">
                  <button 
                    onClick={() => removeFromCart(item.vino._id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm text-white"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 flex justify-between items-center bg-gray-900 p-4 rounded">
          <span className="text-xl">Total a Pagar:</span>
          <span className="text-3xl font-bold text-yellow-500">${getCartTotal()}</span>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button 
            onClick={clearCart}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
          >
            Vaciar Carrito
          </button>
          <button 
            onClick={handleCheckout}
            className="px-8 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-bold text-lg"
          >
            Confirmar Compra
          </button>
        </div>
      </div>
    </div>
  );
}
