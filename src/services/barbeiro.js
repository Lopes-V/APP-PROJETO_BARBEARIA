import api from "./api";

export const barbeiroService = {
  getAll: async () => {
    try {
      const response = await api.get(`/barbeiro`);
      if (!response.data.success) throw new Error(response.data.message);
      return response.data.data || [];
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/barbeiro/${id}`);
      if (!response.data.success) throw new Error(response.data.message);
      if (!response.data.data) {
        throw new Error("Nenhum barbeiro encontrado");
      }
      return response.data.data;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  create: async (dados) => {
    try {
      const response = await api.post(`/barbeiro`, dados);
      if (!response.data.success) throw new Error(response.data.message);
      return response.data.data;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  update: async (id, dados) => {
    try {
      const response = await api.put(`/barbeiro/${id}`, dados);
      if (!response.data.success) throw new Error(response.data.message);
      return response.data.data;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  delete: async (id_barbeiro) => {
    try {
      const response = await api.delete(`/barbeiro/${id_barbeiro}`);
      if (!response.data.success) throw new Error(response.data.message);
      return true;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },
};
