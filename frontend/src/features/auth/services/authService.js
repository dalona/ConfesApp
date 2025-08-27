import apiClient from '../../../services/apiClient';

export const authService = {
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  registerPriest: async (priestData) => {
    const response = await apiClient.post('/auth/register-priest', priestData);
    return response.data;
  },

  registerFromInvite: async (token, userData) => {
    const response = await apiClient.post(`/auth/register-from-invite/${token}`, userData);
    return response.data;
  },

  validateInvite: async (token) => {
    const response = await apiClient.get(`/invites/validate/${token}`);
    return response.data;
  },
};