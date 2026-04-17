import api from "./api";

export const loginService = {
  logar: async (dados) => {
    try {
      const response = await api.post(`/auth/login`, dados);
      if (!response.data.success) throw new Error(response.data.message);
      localStorage.setItem("token", response.data.token);
      return response.data
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  },
};
