import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../components/Layout/Layout.css'; // Basic styles

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError('Nom d\'utilisateur ou mot de passe incorrect.');
        }
    };

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
        }}>
            <div style={{
                background: 'white', padding: '2.5rem', borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)', width: '100%', maxWidth: '400px'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#1e293b' }}>Connexion Electro</h2>
                {error && <div style={{ background: '#fee2e2', color: '#ef4444', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#64748b' }}>Nom d'utilisateur</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-input"
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#64748b' }}>Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            width: '100%', padding: '0.75rem', background: '#2563eb', color: 'white',
                            border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer',
                            transition: 'background 0.2s'
                        }}
                    >
                        Se Connecter
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
