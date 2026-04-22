import api from "./api";

export const estoqueService = {
  getAll: async () => {
    try {
      const response = await api.get("/estoque");
      if (!response.data.success) throw new Error(response.data.message);
      return response.data.data || [];
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  create: async (dados) => {
    try {
      const response = await api.post(`/estoque`, dados);
      if (!response.data.success) throw new Error(response.data.message);
      return response.data.data;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  movimentation: async (id, quantidade) => {
    try {
      const response = await api.patch(`/estoque/${id}/movimentacao`, { id, quantidade });
      if (!response.data.success) throw new Error(response.data.message);
      return response.data.data;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  alert: async () => {
    try {
      const response = await api.get(`/estoque/alerta`);
      if (!response.data.success) throw new Error(response.data.message);
      return response.data.data || [];
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },
};
