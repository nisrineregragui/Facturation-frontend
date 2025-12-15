import api from './api';

const getAll = async () => {
    const response = await api.get('/MagasinPartenaire');
    return response.data;
};

const getById = async (id) => {
    const response = await api.get(`/MagasinPartenaire/${id}`);
    return response.data;
};

const create = async (data) => {
    const response = await api.post('/MagasinPartenaire', data);
    return response.data;
};

const update = async (id, data) => {
    const response = await api.put(`/MagasinPartenaire/${id}`, data);
    return response.data;
};

const remove = async (id) => {
    const response = await api.delete(`/MagasinPartenaire/${id}`);
    return response.data;
};

const removeBulk = async (ids) => {
    const promises = ids.map(id => api.delete(`/MagasinPartenaire/${id}`));
    await Promise.all(promises);
};

const magasinService = {
    getAll,
    getById,
    create,
    update,
    remove,
    removeBulk
};

export default magasinService;
