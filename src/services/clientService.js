import api from './api';

const getAll = async (params) => {
    // params: { search, ville, typeClient }
    const response = await api.get('/Client', { params });
    return response.data;
};

const getById = async (id) => {
    const response = await api.get(`/Client/${id}`);
    return response.data;
};

const create = async (data) => {
    const response = await api.post('/Client', data);
    return response.data;
};

const update = async (id, data) => {
    const response = await api.put(`/Client/${id}`, data);
    return response.data;
};

const remove = async (id) => {
    const response = await api.delete(`/Client/${id}`);
    return response.data;
};

const removeBulk = async (ids) => {
    // Execute multiple deletes in parallel since backend doesn't support bulk delete
    const promises = ids.map(id => api.delete(`/Client/${id}`));
    await Promise.all(promises);
};

const clientService = {
    getAll,
    getById,
    create,
    update,
    remove,
    removeBulk
};

export default clientService;
