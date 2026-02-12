import api from './api';

const HoursService = {
    getHours: async (params) => {
        // params: { isAprobada, usuarioId, fechaDesde, fechaHasta }
        const response = await api.get('/Horas', { params });
        return response.data;
    },

    getHour: async (id) => {
        const response = await api.get(`/Horas/${id}`);
        return response.data;
    },

    submitHours: async (data) => {
        // Ensure data is properly formatted for the backend
        // Backend expects: HorasExtra (decimal), FechaIngreso (DateOnly), Comentarios (string?)
        const formattedData = {
            horasExtra: data.horasExtra,
            fechaIngreso: data.fechaIngreso, // Should be "YYYY-MM-DD" format
            comentarios: data.comentarios || null // null instead of undefined for nullable string
        };
        
        console.log('Sending to API:', formattedData);
        const response = await api.post('/Horas', formattedData);
        return response.data;
    },

    updateHours: async (id, data) => {
        const response = await api.put(`/Horas/${id}`, data);
        return response.data;
    },

    deleteHours: async (id) => {
        const response = await api.delete(`/Horas/${id}`);
        return response.data;
    },

    // Approve/Reject Hours (Admin Only)
    approveHours: async (id, data) => {
        // data: { aprobar: true/false, comentario: string }
        const response = await api.post(`/Horas/${id}/aprobar`, data);
        return response.data;
    },

    // Get Available Hours Summary (User Only)
    getAvailableHours: async () => {
        const response = await api.get('/Horas/disponibles');
        return response.data;
    },

    // Get Hours by Branch (Admin Only)
    getHoursByBranch: async (params) => {
        // params: { sucursalId, isAprobada, fechaDesde, fechaHasta }
        const response = await api.get('/Horas/por-sucursal', { params });
        return response.data;
    },

    // Get Hours by Date Range
    getHoursByDateRange: async (params) => {
        // params: { fechaDesde, fechaHasta }
        const response = await api.get('/Horas/por-fecha', { params });
        return response.data;
    },

    // Approval History endpoints
    getApprovals: async (params) => {
        // params: { horasId }
        const response = await api.get('/HorasAprobaciones', { params });
        return response.data;
    },

    getApproval: async (id) => {
        const response = await api.get(`/HorasAprobaciones/${id}`);
        return response.data;
    },

    manageApproval: async (data, idHint = null) => {
        // API doc says POST /api/HorasAprobaciones for create
        // PUT /api/HorasAprobaciones/{id} for update
        if (idHint) {
            return await api.put(`/HorasAprobaciones/${idHint}`, data);
        }
        return await api.post('/HorasAprobaciones', data);
    }
};

export default HoursService;
