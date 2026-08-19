import apiClient from './apiClient';

export default {
    getAll: async () => {
        const res = await apiClient.get('/products');
        return res.data;
    },
    getById: async (id) => {
        const res = await apiClient.get(/products/ + id);
        return res.data;
    },
    create: async (data) => {
        const res = await apiClient.post('/products', data);
        return res.data;
    },
    update: async (id, data) => {
        const res = await apiClient.put(/products/ + id, data);
        return res.data;
    },
    delete: async (id) => {
        const res = await apiClient.delete(/products/ + id);
        return res.data;
    }
};
