import api from './api';

const getAll = async () => {
    const response = await api.get('/Intervention');
    return response.data;
};

const getById = async (id) => {
    const response = await api.get(`/Intervention/${id}`);
    return response.data;
};

const create = async (data) => {
    const response = await api.post('/Intervention', data);
    return response.data;
};

const update = async (id, data) => {
    const response = await api.put(`/Intervention/${id}`, data);
    return response.data;
};

const remove = async (id) => {
    const response = await api.delete(`/Intervention/${id}`);
    return response.data;
};

const removeBulk = async (ids) => {
    const promises = ids.map(id => api.delete(`/Intervention/${id}`));
    await Promise.all(promises);
};

const interventionService = {
    getAll,
    getById,
    create,
    update,
    remove,
    removeBulk
};

export default interventionService;
