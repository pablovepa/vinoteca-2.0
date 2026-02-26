import express from 'express';
import { registrarUsuario, getUsuarios, deleteUsuario, updateUsuario, authUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/registro', registrarUsuario);
router.get('/', getUsuarios);
router.delete('/:id', deleteUsuario);
router.put('/:id', updateUsuario);
router.post('/login', authUser);

export default router;