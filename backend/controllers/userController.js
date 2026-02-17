import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Registrar Usuario
export const registrarUsuario = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;

        const existe = await User.findOne({ email });
        if (existe) return res.status(400).json({ mensaje: "El email ya existe" });

        // IMPORTANTE: Pasamos el 'password' tal cual, 
        // el modelo se encarga de encriptarlo.
        // Y mapeamos 'nombre' a 'username' que es lo que pide tu esquema.
        const nuevoUsuario = new User({
            username: nombre,
            email,
            password,
            isAdmin: rol === 'admin'
        });

        await nuevoUsuario.save();
        res.status(201).json({ mensaje: "Usuario creado con éxito" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Error al registrar", error: error.message });
    }
};

// Obtener Usuarios (para tu lista de gestión)
export const getUsuarios = async (req, res) => {
    try {
        const usuarios = await User.find().select('-password'); // No enviamos la clave al frontend
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener usuarios" });
    }
};

// Eliminar Usuario
export const deleteUsuario = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ mensaje: "Usuario eliminado" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar" });
    }
};
// Actualizar Usuario
export const updateUsuario = async (req, res) => {
    try {
        const { nombre, email, rol, password } = req.body;
        const updateData = {
            username: nombre,
            email,
            isAdmin: rol === 'admin'
        };

        // Si el usuario envió una nueva contraseña, la encriptación 
        // se disparará automáticamente por el pre('save') del modelo
        // Pero para eso necesitamos usar .save() o manejarlo aquí.
        // Por ahora, actualicemos los datos básicos:
        const usuarioActualizado = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.json({ mensaje: "Usuario actualizado con éxito", usuarioActualizado });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar", error: error.message });
    }
};