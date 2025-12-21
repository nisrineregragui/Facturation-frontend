import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Zap, AlertCircle } from 'lucide-react';
import './Login.css'; // Premium Import

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError('Identifiants incorrects. Veuillez réessayer.');
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-logo">
                    <Zap size={32} fill="white" />
                </div>
                <h2 className="login-title">Bienvenue</h2>
                <p className="login-subtitle">Connectez-vous à votre espace Electro</p>

                {error && (
                    <div className="error-message">
                        <AlertCircle size={18} style={{ marginRight: '8px' }} /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Nom d'utilisateur</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="login-input"
                            placeholder="Entrez votre nom"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="login-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Connexion en cours...' : 'Se Connecter'}
                    </button>
                </form>

                
            </div>
        </div>
    );
};

export default Login;
