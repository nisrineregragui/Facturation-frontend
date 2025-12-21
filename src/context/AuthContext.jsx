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

    // Auto Logout Logic
    useEffect(() => {
        let timeout;

        const resetTimer = () => {
            if (timeout) clearTimeout(timeout);
            if (user) {
                // 1 Hour = 3600000 ms
                timeout = setTimeout(() => {
                    console.log("Auto-logout due to inactivity");
                    logout();
                }, 3600000);
            }
        };

        const events = ['mousemove', 'keydown', 'click', 'scroll'];

        if (user) {
            resetTimer(); // Start timer on login/mount
            events.forEach(event => window.addEventListener(event, resetTimer));
        }

        return () => {
            if (timeout) clearTimeout(timeout);
            events.forEach(event => window.removeEventListener(event, resetTimer));
        };
    }, [user]); // Re-run when user Logs in/out

    const login = async (nomUtilisateur, motDePasse) => {
        try {
            const data = await authService.login({ nomUtilisateur, motDePasse });
            // Expecting { token, user }
            if (data.token && data.user) {
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('user', JSON.stringify(data.user));
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
