import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = authService.getCurrentUser();
        const storedToken = authService.getToken();

        if (storedUser && storedToken) {
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    const login = async (nomUtilisateur, motDePasse) => {
        try {
            const data = await authService.login({ nomUtilisateur, motDePasse });
            // Expecting { token, user }
            if (data.token && data.user) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);
                return true;
            }
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
        return false;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
