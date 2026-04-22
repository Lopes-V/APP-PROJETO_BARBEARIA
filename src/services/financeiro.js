import api from "./api";

export const financeiroService = {
  /** Lista os lançamentos de um mês/ano específico */
  getByMes: async (ano, mes) => {
    try {
      const response = await api.get(`/financeiro`, { params: { ano, mes } });
      if (!response.data.success) throw new Error(response.data.message);
      return response.data.data ?? [];
    } catch (error) {
      console.error("financeiroService.getByMes:", error.message);
      throw error;
    }
  },

  /** Retorna o balanço (totalReceitas, totalDespesas, saldo) de um mês/ano */
  getBalanco: async (ano, mes) => {
    try {
      const response = await api.get(`/financeiro/balanco`, { params: { ano, mes } });
      if (!response.data.success) throw new Error(response.data.message);
      return response.data.data;
    } catch (error) {
      console.error("financeiroService.getBalanco:", error.message);
      throw error;
    }
  },

  /** Cria um novo lançamento financeiro */
  create: async (dados) => {
    try {
      const response = await api.post(`/financeiro/lancamento`, dados);
      if (!response.data.success) throw new Error(response.data.message);
      return response.data.data;
    } catch (error) {
      console.error("financeiroService.create:", error.message);
      throw error;
    }
  },

  /** Marca um lançamento como pago */
  markWithPayment: async (id) => {
    try {
      const response = await api.patch(`/financeiro/${id}/pagar`);
      if (!response.data.success) throw new Error(response.data.message);
      return response.data.data;
    } catch (error) {
      console.error("financeiroService.markWithPayment:", error.message);
      throw error;
    }
  },
};
