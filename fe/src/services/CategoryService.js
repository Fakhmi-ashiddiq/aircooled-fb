import apiClient from './apiClient';

export default {
    getAll: async () => {
        const res = await apiClient.get('/categories');
        return res.data;
    },
    getById: async (id) => {
        const res = await apiClient.get(/categories/ + id);
        return res.data;
    },
    create: async (data) => {
        const res = await apiClient.post('/categories', data);
        return res.data;
    },
    update: async (id, data) => {
        const res = await apiClient.put(/categories/ + id, data);
        return res.data;
    },
    delete: async (id) => {
        const res = await apiClient.delete(/categories/ + id);
        return res.data;
    }
};
