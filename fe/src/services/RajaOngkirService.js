import apiClient from './apiClient';

export default {
    getProvinces: async () => {
        const res = await apiClient.get('/rajaongkir/provinces');
        return res.data;
    },
    getCities: async (provinceId) => {
        const res = await apiClient.get(`/rajaongkir/cities/${provinceId}`);
        return res.data;
    },
    checkCost: async (destination, weight, courier) => {
        const res = await apiClient.post('/rajaongkir/cost', {
            destination,
            weight,
            courier
        });
        return res.data;
    }
};
