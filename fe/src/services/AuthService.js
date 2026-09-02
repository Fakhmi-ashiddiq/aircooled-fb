import apiClient from './apiClient';

export default {
    register: async (data) => {
        const res = await apiClient.post('/register', data);
        return res.data;
    },
    login: async (data) => {
        const res = await apiClient.post('/login', data);
        return res.data;
    },
    logout: async () => {
        const res = await apiClient.post('/logout');
        return res.data;
    },
    me: async () => {
        const res = await apiClient.get('/me');
        return res.data;
    },
    updateProfile: async (data) => {
        const res = await apiClient.post('/profile', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    },
};
