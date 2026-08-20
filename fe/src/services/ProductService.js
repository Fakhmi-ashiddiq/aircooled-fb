import apiClient from './apiClient';

export default {
    getAll: async () => {
        const res = await apiClient.get('/products');
        return res.data;
    },
    getById: async (id) => {
        const res = await apiClient.get('/products/' + id);
        return res.data;
    },
    create: async (data) => {
        const res = await apiClient.post('/products', data);
        return res.data;
    },
    createWithFiles: async (formData) => {
        const res = await apiClient.post('/products', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
    },
    update: async (id, data) => {
        const res = await apiClient.put('/products/' + id, data);
        return res.data;
    },
    updateWithFiles: async (id, formData) => {
        const res = await apiClient.post('/products/' + id + '?_method=PUT', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
    },
    delete: async (id) => {
        const res = await apiClient.delete('/products/' + id);
        return res.data;
    }
};
