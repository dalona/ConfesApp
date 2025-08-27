import apiClient from '../../../services/apiClient';

export const confessionsService = {
  // Get user's confessions
  getMyConfessions: async () => {
    const response = await apiClient.get('/confessions');
    return response.data;
  },

  // Create new confession
  createConfession: async (confessionData) => {
    const response = await apiClient.post('/confessions', confessionData);
    return response.data;
  },

  // Cancel confession
  cancelConfession: async (id) => {
    const response = await apiClient.patch(`/confessions/${id}/cancel`);
    return response.data;
  },

  // Complete confession (priest only)
  completeConfession: async (id) => {
    const response = await apiClient.patch(`/confessions/${id}/complete`);
    return response.data;
  },

  // Get confession slots (legacy system)
  getConfessionSlots: async () => {
    const response = await apiClient.get('/confession-slots');
    return response.data;
  },
};