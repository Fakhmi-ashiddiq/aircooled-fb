import apiClient from './apiClient';

export default {
    getAll: async () => {
        const res = await apiClient.get('/product-parents');
        return res.data;
    },
    getById: async (id) => {
        const res = await apiClient.get('/product-parents/' + id);
        return res.data;
    },
    create: async (data) => {
        const res = await apiClient.post('/product-parents', data);
        return res.data;
    },
    update: async (id, data) => {
        const res = await apiClient.put('/product-parents/' + id, data);
        return res.data;
    },
    delete: async (id) => {
        const res = await apiClient.delete('/product-parents/' + id);
        return res.data;
    }
};
