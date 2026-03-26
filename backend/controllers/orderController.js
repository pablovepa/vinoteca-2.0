import Order from '../models/Order.js';
import Vino from '../models/Vino.js';

// Registrar Venta
export const crearVenta = async (req, res) => {
    try {
        const { items, total } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ mensaje: "No hay artículos en la venta" });
        }

        // 1. Verificar stock y prepararse para descontarlo
        for (const item of items) {
            const vino = await Vino.findById(item.vino);
            if (!vino) {
                return res.status(404).json({ mensaje: `Vino no encontrado: ${item.nombre}` });
            }
            if (vino.stock < item.cantidad) {
                return res.status(400).json({ mensaje: `Stock insuficiente para ${item.nombre}. Disponible: ${vino.stock}` });
            }
        }

        // 2. Crear la orden
        const nuevaVenta = new Order({
            user: req.user._id, // Viene del middleware de autenticación
            items,
            total
        });
        const ventaGuardada = await nuevaVenta.save();

        // 3. Descontar el stock
        for (const item of items) {
            await Vino.findByIdAndUpdate(item.vino, {
                $inc: { stock: -item.cantidad }
            });
        }

        res.status(201).json(ventaGuardada);
    } catch (error) {
        console.error("Error al crear la venta:", error);
        res.status(500).json({ mensaje: "Error del servidor al registrar la venta" });
    }
};

// Obtener todas las ventas (Historial)
export const obtenerVentas = async (req, res) => {
    try {
        // Obtenemos las ventas ordenadas por las más recientes primero
        // y traemos (populate) el nombre del usuario que hizo la venta
        const ventas = await Order.find()
            .populate('user', 'username email')
            .sort({ createdAt: -1 });
            
        res.json(ventas);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener el historial de ventas" });
    }
};
