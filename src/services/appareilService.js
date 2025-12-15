import api from './api';

const getAll = async () => {
    const response = await api.get('/Appareil');
    return response.data;
};

const getById = async (id) => {
    const response = await api.get(`/Appareil/${id}`);
    return response.data;
};

const create = async (data) => {
    const response = await api.post('/Appareil', data);
    return response.data;
};

const update = async (id, data) => {
    const response = await api.put(`/Appareil/${id}`, data);
    return response.data;
};

const remove = async (id) => {
    const response = await api.delete(`/Appareil/${id}`);
    return response.data;
};

const removeBulk = async (ids) => {
    const promises = ids.map(id => api.delete(`/Appareil/${id}`));
    await Promise.all(promises);
};

const appareilService = {
    getAll,
    getById,
    create,
    update,
    remove,
    removeBulk
};

export default appareilService;
