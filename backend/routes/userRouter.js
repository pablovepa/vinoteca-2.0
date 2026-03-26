import express from 'express';
import { registrarUsuario, getUsuarios, deleteUsuario, updateUsuario, authUser } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/registro', protect, admin, registrarUsuario);
router.get('/', protect, admin, getUsuarios);
router.delete('/:id', protect, admin, deleteUsuario);
router.put('/:id', protect, admin, updateUsuario);
router.post('/login', authUser); // Login no necesita middleware porque es para generar el token

export default router;