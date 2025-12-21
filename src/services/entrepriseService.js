import api from './api';

const entrepriseService = {
    getAll: async () => {
        const response = await api.get('/Entreprise');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/Entreprise/${id}`);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/Entreprise/${id}`, data);
        return response.data;
    },

    getData: async () => {
        const response = await api.get('/Entreprise');
        // Return the first one or null
        return (response.data && response.data.length > 0) ? response.data[0] : null;
    }
};

export default entrepriseService;
