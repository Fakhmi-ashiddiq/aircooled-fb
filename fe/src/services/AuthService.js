import apiClient from './apiClient';

const AuthService = {
    async register(data) {
        const response = await apiClient.post('/register', data);
        if (response.data.access_token) {
            localStorage.setItem('auth_token', response.data.access_token);
        }
        return response.data;
    },

    async login(email, password) {
        const response = await apiClient.post('/login', { email, password });
        if (response.data.access_token) {
            localStorage.setItem('auth_token', response.data.access_token);
        }
        return response.data;
    },

    async logout() {
        try {
            await apiClient.post('/logout');
        } catch (error) {
            console.error('Logout failed on server', error);
        } finally {
            localStorage.removeItem('auth_token');
        }
    },

    async me() {
        const token = localStorage.getItem('auth_token');
        if (!token) return null;
        
        try {
            const response = await apiClient.get('/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            localStorage.removeItem('auth_token');
            return null;
        }
    }
};

export default AuthService;
