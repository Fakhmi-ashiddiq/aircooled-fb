import apiClient from './apiClient';

export default {
    getAll: async (search) => {
        const params = search ? { search } : {};
        const res = await apiClient.get('/shipping/search-destination', { params });
        return res.data.results || [];
    }
};
