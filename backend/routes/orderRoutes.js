import express from 'express';
import { crearVenta, obtenerVentas } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Todas las rutas de ventas requieren autenticación
router.post('/', protect, crearVenta);
router.get('/', protect, obtenerVentas);

export default router;
