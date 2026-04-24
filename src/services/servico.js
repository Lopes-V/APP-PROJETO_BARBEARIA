import api from "./api";

export const servicoService = {
  getAll: async () => {
    try {
      const response = await api.get(`/servicos`);
      if (!response.data.success) throw new Error(response.data.message);
      return response.data.data || [];
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/servicos/${id}`);
      if (!response.data.success) throw new Error(response.data.message);
      if (!response.data.data) {
        throw new Error("Nenhum serviço encontrado");
      }
      return response.data.data;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  create: async (dados) => {
    try {
      const response = await api.post(`/servicos`, dados);
      if (!response.data.success) throw new Error(response.data.message);
      return response.data.data;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  update: async (id, dados) => {
    try {
      const response = await api.put(`/servicos/${id}`, dados);
      if (!response.data.success) throw new Error(response.data.message);
      return response.data.data;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/servicos/${id}`);
      if (!response.data.success) throw new Error(response.data.message);
      return true;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },
};
