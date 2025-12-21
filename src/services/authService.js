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
        return JSON.parse(sessionStorage.getItem('user'));
    },

    getToken: () => {
        return sessionStorage.getItem('token');
    },

    logout: () => {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
    }
};

export default authService;
