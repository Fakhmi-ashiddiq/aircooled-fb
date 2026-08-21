import apiClient from './apiClient';

export default {
    getAll: async (search) => {
        const params = search ? { search } : {};
        const res = await apiClient.get('/cities', { params });
        return res.data;
    }
};
