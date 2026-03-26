import React, { useState } from 'react';

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const manejarLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (res.ok) {
                onLoginSuccess(data); // Guardamos el objeto usuario (con isAdmin)
                localStorage.setItem('userVinoteca', JSON.stringify(data)); // Para no perder la sesión al recargar
            } else {
                alert(data.message || 'Error al iniciar sesión');
            }
        } catch (error) {
            alert('No se pudo conectar con el servidor');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={manejarLogin} className="login-form">
                <h2>🍷 Vinoteca Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="login-input"
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                />
                <button type="submit" className="login-button">Entrar</button>
            </form>
        </div>
    );
};

export default Login;