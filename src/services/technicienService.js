import api from './api';

const getAll = async () => {
    const response = await api.get('/Technicien');
    return response.data;
};

const getById = async (id) => {
    const response = await api.get(`/Technicien/${id}`);
    return response.data;
};

const create = async (data) => {
    const response = await api.post('/Technicien', data);
    return response.data;
};

const update = async (id, data) => {
    const response = await api.put(`/Technicien/${id}`, data);
    return response.data;
};

const remove = async (id) => {
    const response = await api.delete(`/Technicien/${id}`);
    return response.data;
};

const removeBulk = async (ids) => {
    const promises = ids.map(id => api.delete(`/Technicien/${id}`));
    await Promise.all(promises);
};

const technicienService = {
    getAll,
    getById,
    create,
    update,
    remove,
    removeBulk
};

export default technicienService;
