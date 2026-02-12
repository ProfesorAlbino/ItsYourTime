import api from './api';

const UserService = {
    getAllUsers: async () => {
        const response = await api.get('/Usuarios');
        return response.data;
    },

    getUsersBySucursal: async (sucursalId) => {
        const response = await api.get(`/Usuarios/BySucursal/${sucursalId}`);
        return response.data;
    },

    getUser: async (id) => {
        const response = await api.get(`/Usuarios/${id}`);
        return response.data;
    },

    updateUser: async (id, data) => {
        const response = await api.put(`/Usuarios/${id}`, data);
        return response.data;
    },

    deleteUser: async (id) => {
        const response = await api.delete(`/Usuarios/${id}`);
        return response.data;
    },
};

export default UserService;
