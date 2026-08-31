import apiClient from './apiClient';

export default {
    getAll: async () => {
        const res = await apiClient.get('/preorder-sessions');
        return res.data;
    },
    getById: async (id) => {
        const res = await apiClient.get('/preorder-sessions/' + id);
        return res.data;
    },
    create: async (data) => {
        const res = await apiClient.post('/preorder-sessions', data);
        return res.data;
    },
    update: async (id, data) => {
        const res = await apiClient.put('/preorder-sessions/' + id, data);
        return res.data;
    },
    delete: async (id) => {
        const res = await apiClient.delete('/preorder-sessions/' + id);
        return res.data;
    }
};
