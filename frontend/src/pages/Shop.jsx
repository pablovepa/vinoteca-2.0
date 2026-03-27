import React, { useEffect, useState } from 'react'
import api from '../api'
import VinoCard from '../components/VinoCard'


export default function Shop() {
const [vinos, setVinos] = useState([])
const [loading, setLoading] = useState(true)


useEffect(() => { (async () => { try { const res = await api.get('/vinos'); setVinos(res.data); } catch (err) { console.error(err) } finally { setLoading(false) } })() }, [])


return (
<div className="p-6">
  <h1 className="text-3xl mb-6 text-white text-center">Catálogo de Vinos</h1>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {loading ? <div className="text-white">Cargando...</div> : vinos.map(v => <VinoCard key={v._id} vino={v} />)}
  </div>
</div>
)
}