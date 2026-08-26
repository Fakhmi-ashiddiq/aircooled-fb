import apiClient from './apiClient';

export default {
    getCost: async (destination, weight = 1000) => {
        const res = await apiClient.post('/shipping/cost', { destination, weight });
        return res.data;
    }
};
