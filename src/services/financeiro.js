import api from "./api";

export const financeiroService = {
  getAll: async () => {
    try {
      const response = await api.get(`/financeiro`);
      if (!response.data.success) throw new Error(response.data.message);
      if (!response.data.data || response.data.data.length === 0) {
        throw new Error("Nenhum financeiro encontrado");
      }
      return response.data.data;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  getByMesAndAno: async (dados) => {
    try {
      const response = await api.post(`/financeiro/balanco`, dados);
      if (!response.data.success) throw new Error(response.data.message);
      if (!response.data.data) {
        throw new Error("Nenhum financeiro encontrado");
      }
      return response.data.data;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },

  create: async (dados) => {
    try {
      const response = await api.post(`/financeiro/lancamento`, dados);
      if (!response.data.success) throw new Error(response.data.message);
      return response.data.data;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },
  markWithPayment: async (id) => {
    try {
      const response = await api.patch(`/financeiro/${id}/pagar`);
      if (!response.data.success) throw new Error(response.data.message);
      return response.data.data;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },
};
