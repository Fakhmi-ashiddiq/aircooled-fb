import apiClient from './apiClient';

export default {
    getAll: async () => {
        const res = await apiClient.get('/owners');
        return res.data;
    },
    getById: async (id) => {
        const res = await apiClient.get(/owners/ + id);
        return res.data;
    },
    create: async (data) => {
        const res = await apiClient.post('/owners', data);
        return res.data;
    },
    update: async (id, data) => {
        const res = await apiClient.put(/owners/ + id, data);
        return res.data;
    },
    delete: async (id) => {
        const res = await apiClient.delete(/owners/ + id);
        return res.data;
    }
};

