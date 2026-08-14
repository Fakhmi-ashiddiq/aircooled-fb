import apiClient from './apiClient';

export default {
    getAll: async () => {
        const res = await apiClient.get('/roles');
        return res.data;
    },
    getById: async (id) => {
        const res = await apiClient.get(/roles/ + id);
        return res.data;
    },
    create: async (data) => {
        const res = await apiClient.post('/roles', data);
        return res.data;
    },
    update: async (id, data) => {
        const res = await apiClient.put(/roles/ + id, data);
        return res.data;
    },
    delete: async (id) => {
        const res = await apiClient.delete(/roles/ + id);
        return res.data;
    }
};
