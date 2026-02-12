import api from './api';

const BranchService = {
    getBranches: async () => {
        const response = await api.get('/Sucursals');
        return response.data;
    },

    createBranch: async (data) => {
        const response = await api.post('/Sucursals', data);
        return response.data;
    },

    updateBranch: async (id, data) => {
        const response = await api.put(`/Sucursals/${id}`, data);
        return response.data;
    },

    deleteBranch: async (id) => {
        const response = await api.delete(`/Sucursals/${id}`);
        return response.data;
    },
};

export default BranchService;
