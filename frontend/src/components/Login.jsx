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
        <div style={styles.container}>
            <form onSubmit={manejarLogin} style={styles.form}>
                <h2>🍷 Vinoteca Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Entrar</button>
            </form>
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#800020' },
    form: { padding: '20px', borderRadius: '8px', backgroundColor: '#080304ff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' },
    input: { padding: '10px', border: '1px solid #0f0e0eff', borderRadius: '4px', color: '#333', backgroundColor: '#fff' },
    button: { padding: '10px', backgroundColor: '#140a0dff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default Login;