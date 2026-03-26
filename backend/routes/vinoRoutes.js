import express from 'express';
import { getVinos, createVino, deleteVino, updateVino } from '../controllers/vinoController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Obtener vinos
router.get('/', protect, getVinos);

// Crear vino (solo admin o empleado autenticado)
router.post('/', protect, createVino);

// Editar vino (solo admin o empleado autenticado)
router.put('/:id', protect, updateVino);

// Eliminar vino (solo admin o empleado autenticado)
router.delete('/:id', protect, deleteVino);

export default router;
