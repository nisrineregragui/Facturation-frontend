import api from './api';

const getAll = async () => {
    const response = await api.get('/ModeleCatalogue');
    return response.data;
};

const getById = async (id) => {
    const response = await api.get(`/ModeleCatalogue/${id}`);
    return response.data;
};

const create = async (data) => {
    const response = await api.post('/ModeleCatalogue', data);
    return response.data;
};

const update = async (id, data) => {
    const response = await api.put(`/ModeleCatalogue/${id}`, data);
    return response.data;
};

const remove = async (id) => {
    const response = await api.delete(`/ModeleCatalogue/${id}`);
    return response.data;
};

const removeBulk = async (ids) => {
    const promises = ids.map(id => api.delete(`/ModeleCatalogue/${id}`));
    await Promise.all(promises);
};

const modeleService = {
    getAll,
    getById,
    create,
    update,
    remove,
    removeBulk
};

export default modeleService;
