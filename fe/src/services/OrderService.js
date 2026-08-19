import apiClient from './apiClient';

export default {
    getAll: async () => {
        const res = await apiClient.get('/orders');
        return res.data;
    },
    getById: async (id) => {
        const res = await apiClient.get(/orders/ + id);
        return res.data;
    },
    create: async (data) => {
        const res = await apiClient.post('/orders', data);
        return res.data;
    },
    update: async (id, data) => {
        const res = await apiClient.put(/orders/ + id, data);
        return res.data;
    },
    delete: async (id) => {
        const res = await apiClient.delete(/orders/ + id);
        return res.data;
    }
};
