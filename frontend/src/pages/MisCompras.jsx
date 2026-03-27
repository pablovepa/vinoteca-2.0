import { useEffect, useState } from 'react'
import api from '../api'

const API_URL = "http://localhost:5000"

export default function MisCompras() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    api.get('/ventas')
      .then(res => setOrders(res.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto text-white">
      <h1 className="text-3xl mb-6">Mis Compras</h1>

      {orders.length === 0 && (
        <p className="text-gray-400">Aún no compraste ningún vino.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {orders.map(order =>
          order.items.map(item => (
            <div key={`${order._id}-${item.vino}`} className="bg-gray-800 p-4 rounded">
              <h2 className="mt-3 font-semibold text-xl text-red-500">
                {item.nombre}
              </h2>
              <p className="mt-2 text-gray-300">Cantidad: {item.cantidad}</p>
              <strong className="block mt-2 text-green-400">Pagado: ${item.precioUnitario * item.cantidad}</strong>

            </div>
          )))}
      </div>
    </div>
  )
}
