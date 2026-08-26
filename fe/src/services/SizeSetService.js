import apiClient from './apiClient';

export default {
    getAll: async () => {
        const res = await apiClient.get('/size-sets');
        return res.data;
    },
    getById: async (id) => {
        const res = await apiClient.get(/size-sets/ + id);
        return res.data;
    },
    create: async (data) => {
        const res = await apiClient.post('/size-sets', data);
        return res.data;
    },
    update: async (id, data) => {
        if (data instanceof FormData) {
            const res = await apiClient.post('/size-sets/' + id + '?_method=PUT', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return res.data;
        }
        const res = await apiClient.put('/size-sets/' + id, data);
        return res.data;
    },
    delete: async (id) => {
        const res = await apiClient.delete(/size-sets/ + id);
        return res.data;
    }
};
