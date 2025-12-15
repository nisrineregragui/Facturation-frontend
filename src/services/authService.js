import api from './api';

const authService = {
    login: async (credentials) => {
        // credentials: { nomUtilisateur, motDePasse }
        const response = await api.post('/Utilisateur/login', credentials);
        return response.data;
    },

    register: async (userData) => {
        const response = await api.post('/Utilisateur/register', userData);
        return response.data;
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    },

    getToken: () => {
        return localStorage.getItem('token');
    },

    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }
};

export default authService;
