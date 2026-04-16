import api from "./api";

export const usuarioService = {
  me: async () => {
    try {
      const response = await api.get(`/usuario/me`);
      if (!response.data.success) throw new Error(response.data.message);
      if (!response.data.data || response.data.data.length == 0) {
        throw new Error("Nenhum usuario encontrado");
      }
      return response.data.data;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },
  register: async (dados) => {
    try {
      const response = await api.post(`/usuario/registrar`, dados);
      if (!response.data.success) throw new Error(response.data.message);
      return response.data.data;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },
};
