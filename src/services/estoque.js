import api from "./api";

export const getEstoque = {
  getAll: async () => {
    try {
      const response = await api.get("/estoque");
      if (!response.data.success) throw new Error(response.data.message);
      if (!response.data.data || response.data.data.length == 0) {
        throw new Error("Nenhum estoque existente");
      }
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  update: async (dados) => {
    try {
      const response = await api.post(`/estoque`, dados);
      if (!response.data.success) throw new Error(response.data.message);
      return response.data.data;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },
  movimentation: async (id, dados) => {
    try {
      const response = await api.patch(`/estoque/${id}/movimentacao`, dados);
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
      if (!response.data.data || response.data.data.length == 0) {
        throw new Error("Nenhum alerta encontrado");
      }
      return response.data.data;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },
};
