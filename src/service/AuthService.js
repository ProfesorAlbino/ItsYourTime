import api from './api';

const AuthService = {
    login: async (cedula, password) => {
        const response = await api.post('/auth/login', { cedula, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    register: async (userData) => {
        // Note: Registration endpoint in API documentation is /Usuarios for public registration
        // But usually auth related. Checking doc: POST /api/Usuarios (Public)
        const response = await api.post('/Usuarios', userData);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user'); // If we store user info
    },

    getCurrentUser: () => {
        // Decode token or get from localStorage if stored separately
        // For now, let's assume we might decode it or just check presence
        return localStorage.getItem('token');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};

export default AuthService;
