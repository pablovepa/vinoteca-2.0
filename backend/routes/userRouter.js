import express from 'express';
import { registrarUsuario, getUsuarios, deleteUsuario, updateUsuario } from '../controllers/userController.js';

const router = express.Router();

router.post('/registro', registrarUsuario);
router.get('/', getUsuarios);
router.delete('/:id', deleteUsuario);
router.put('/:id', updateUsuario);

export default router;