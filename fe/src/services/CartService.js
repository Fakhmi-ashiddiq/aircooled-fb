import apiClient from './apiClient';

export default {
    getAll: async () => {
        const res = await apiClient.get('/cart');
        return res.data;
    },
    add: async (data) => {
        const res = await apiClient.post('/cart', data);
        return res.data;
    },
    update: async (id, qty) => {
        const res = await apiClient.put('/cart/' + id, { qty });
        return res.data;
    },
    remove: async (id) => {
        const res = await apiClient.delete('/cart/' + id);
        return res.data;
    },
    clear: async () => {
        const res = await apiClient.delete('/cart');
        return res.data;
    }
};
