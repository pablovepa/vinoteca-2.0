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

        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
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
        <form onSubmit={handleSubmit} style={styles.form}>
            <h3 style={{ color: '#2c3e50' }}>
                {usuarioEditando ? '✏️ Editar Usuario' : '👤 Nuevo Usuario'}
            </h3>

            <input
                style={styles.input}
                type="text"
                placeholder="Nombre completo"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                required
            />
            <input
                style={styles.input}
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
            />

            {/* Ocultamos contraseña si estamos editando (por seguridad inicial) */}
            {!usuarioEditando && (
                <input
                    style={styles.input}
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
            )}

            <select style={styles.input} value={rol} onChange={e => setRol(e.target.value)}>
                <option value="empleado">Empleado</option>
                <option value="admin">Administrador</option>
            </select>

            <button type="submit" style={styles.btnSave}>
                {usuarioEditando ? 'Guardar Cambios' : 'Crear Usuario'}
            </button>

            {usuarioEditando && (
                <button
                    type="button"
                    onClick={() => setUsuarioEditando(null)}
                    style={styles.btnCancel}
                >
                    Cancelar Edición
                </button>
            )}
        </form>
    );
};

const styles = {
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '20px',
        backgroundColor: '#e9ecef',
        borderRadius: '8px',
        marginBottom: '20px'
    },
    input: {
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        backgroundColor: '#ffffff',
        color: '#1a1a1a',
        fontSize: '16px',
        fontWeight: '500',
        width: '100%',
        boxSizing: 'border-box'
    },
    btnSave: {
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '10px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    btnCancel: {
        backgroundColor: '#95a5a6',
        color: 'white',
        padding: '10px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '5px'
    }
};

export default FormularioUser;