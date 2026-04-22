import api from "./api";

export const agendamentoService = {
  getAll: async () => {
    try {
      const response = await api.get(`/agendamentos`);
      if (!response.data.success) throw new Error(response.data.message);
      if (!response.data.data || response.data.data.length === 0) {
        throw new Error("Nenhum agendamento existente");
      }
      return response.data.data;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },
  getByBarbeiroId: async (id) => {
    try {
      const response = await api.get(`/agendamentos/barbeiro/${id}`);
      if (!response.data.success) throw new Error(response.data.message);
      return response.data.data;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },
  create: async (dados) => {
    try {
      const response = await api.post(`/agendamentos`, dados);
      if (!response.data.success) throw new Error(response.data.message);
      return response.data.data;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },
  switchStatus: async (id, dados) => {
    try {
      const response = await api.patch(`/agendamentos/${id}/status`, dados);
      if (!response.data.success) throw new Error(response.data.message);
      return response.data.data;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/agendamentos/${id}`);
      if (!response.data.success) throw new Error(response.data.message);
      return true;
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  },
};
