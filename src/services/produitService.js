import api from './api';

const getAll = async () => {
    const response = await api.get('/ProduitService');
    return response.data;
};

const getById = async (id) => {
    const response = await api.get(`/ProduitService/${id}`);
    return response.data;
};

const create = async (data) => {
    const response = await api.post('/ProduitService', data);
    return response.data;
};

const update = async (id, data) => {
    const response = await api.put(`/ProduitService/${id}`, data);
    return response.data;
};

const remove = async (id) => {
    const response = await api.delete(`/ProduitService/${id}`);
    return response.data;
};

const produitService = {
    getAll,
    getById,
    create,
    update,
    remove
};

export default produitService;
