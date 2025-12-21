import api from './api';

const getAll = async () => {
    const response = await api.get('/Facture');
    return response.data;
};

const getById = async (id) => {
    const response = await api.get(`/Facture/${id}`);
    return response.data;
};

const create = async (data) => {
    const response = await api.post('/Facture', data);
    return response.data;
};

const generateFromIntervention = async (interventionId) => {
    const response = await api.post(`/Facture/generate/${interventionId}`);
    return response.data;
};

const generateMagasin = async (payload) => {
    // payload: { magasinID, interventionIDs, dateEcheance }
    const response = await api.post('/Facture/generate/magasin', payload);
    return response.data;
};

const update = async (id, data) => {
    const response = await api.put(`/Facture/${id}`, data);
    return response.data;
};

const remove = async (id) => {
    const response = await api.delete(`/Facture/${id}`);
    return response.data;
};

const factureService = {
    getAll,
    getById,
    create,
    generateFromIntervention,
    generateMagasin,
    update,
    remove
};

export default factureService;
