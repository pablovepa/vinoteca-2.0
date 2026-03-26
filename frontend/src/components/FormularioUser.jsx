import { useState, useEffect } from 'react';

const FormularioUser = ({ onUsuarioCreado, usuarioEditando, setUsuarioEditando }) => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState('empleado');

    useEffect(() => {
        if (usuarioEditando) {
            setNombre(usuarioEditando.username || ''); // Usamos username del modelo
            setEmail(usuarioEditando.email || '');
            setRol(usuarioEditando.isAdmin ? 'admin' : 'empleado');
        } else {
            // Limpiar campos si no hay edición
            setNombre('');
            setEmail('');
            setPassword('');
            setRol('empleado');
        }
    }, [usuarioEditando]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = usuarioEditando
            ? `http://localhost:5000/api/users/${usuarioEditando._id}`
            : 'http://localhost:5000/api/users/registro';

        const method = usuarioEditando ? 'PUT' : 'POST';
        const token = JSON.parse(localStorage.getItem('userVinoteca'))?.token;

        const res = await fetch(url, {
            method: method,
            headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ nombre, email, password, rol })
        });

        if (res.ok) {
            alert(usuarioEditando ? "✅ Usuario actualizado" : "👤 Usuario creado");
            setUsuarioEditando(null);
            setNombre(''); setEmail(''); setPassword('');
            onUsuarioCreado();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="fu-form">
            <h3 className="fu-title">
                {usuarioEditando ? '✏️ Editar Usuario' : '👤 Nuevo Usuario'}
            </h3>

            <input
                className="fu-input"
                type="text"
                placeholder="Nombre completo"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                required
            />
            <input
                className="fu-input"
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
            />

            {/* Ocultamos contraseña si estamos editando (por seguridad inicial) */}
            {!usuarioEditando && (
                <input
                    className="fu-input"
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
            )}

            <select className="fu-input" value={rol} onChange={e => setRol(e.target.value)}>
                <option value="empleado">Empleado</option>
                <option value="admin">Administrador</option>
            </select>

            <button type="submit" className="fu-btn-save">
                {usuarioEditando ? 'Guardar Cambios' : 'Crear Usuario'}
            </button>

            {usuarioEditando && (
                <button
                    type="button"
                    onClick={() => setUsuarioEditando(null)}
                    className="fu-btn-cancel"
                >
                    Cancelar Edición
                </button>
            )}
        </form>
    );
};

export default FormularioUser;