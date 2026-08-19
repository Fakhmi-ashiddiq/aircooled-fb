import apiClient from './apiClient';

export default {
    getAll: async () => {
        const res = await apiClient.get('/color-options');
        return res.data;
    },
    getById: async (id) => {
        const res = await apiClient.get(/color-options/ + id);
        return res.data;
    },
    create: async (data) => {
        const res = await apiClient.post('/color-options', data);
        return res.data;
    },
    update: async (id, data) => {
        const res = await apiClient.put(/color-options/ + id, data);
        return res.data;
    },
    delete: async (id) => {
        const res = await apiClient.delete(/color-options/ + id);
        return res.data;
    }
};
