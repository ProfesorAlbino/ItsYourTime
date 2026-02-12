import api from "../js/AxiosConfig";

// cantidad de formularios de un usuario
export const getNumForms = async (request) => {
  try {
    const response = await api.get("/form/GetTotalForms?idUser="+request.idUsuario);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al obtener formularios");
  }
};

//Top de formularios
export const getTopForms = async (request) => {
  try {
    const response = await api.get("/form/GetTopForms?num="+request.numForms+"&idUsuario="+request.idUsuario);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al obtener formularios");
  }
};

//Obtener todos los formularios
export const getAllFormsByUser = async (request) => {
  try {
    console.log(request);
    const response = await api.get("/form/GetFormByUser?idUser="+request);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al obtener formularios");
  }
};