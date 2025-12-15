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

const appareilService = {
    getAll,
    getById,
    create
};

export default appareilService;
