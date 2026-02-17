import express from 'express';
import { getVinos, createVino, deleteVino, updateVino } from '../controllers/vinoController.js';


const router = express.Router();

// Obtener vinos
router.get('/', getVinos);

// Crear vino (solo admin)
router.post('/', createVino);

// Editar vino (solo admin)
router.put('/:id', updateVino);

// Eliminar vino (solo admin)
router.delete('/:id', deleteVino);

export default router;
