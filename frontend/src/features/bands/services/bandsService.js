import apiClient from '../../../services/apiClient';

export const bandsService = {
  // Get priest's bands
  getMyBands: async (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await apiClient.get(`/confession-bands/my-bands?${params}`);
    return response.data;
  },

  // Create new band
  createBand: async (bandData) => {
    const response = await apiClient.post('/confession-bands', bandData);
    return response.data;
  },

  // Update band
  updateBand: async (id, bandData) => {
    const response = await apiClient.put(`/confession-bands/my-bands/${id}`, bandData);
    return response.data;
  },

  // Delete band
  deleteBand: async (id) => {
    const response = await apiClient.delete(`/confession-bands/my-bands/${id}`);
    return response.data;
  },

  // Change band status
  changeBandStatus: async (id, status) => {
    const response = await apiClient.patch(`/confession-bands/my-bands/${id}/status`, { status });
    return response.data;
  },

  // Get available bands (for faithful)
  getAvailableBands: async (startDate, endDate, parishId) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (parishId) params.append('parishId', parishId);
    
    const response = await apiClient.get(`/confession-bands/available?${params}`);
    return response.data;
  },

  // Book band (for faithful)
  bookBand: async (bookingData) => {
    const response = await apiClient.post('/confession-bands/book', bookingData);
    return response.data;
  },

  // Get faithful bookings
  getMyBookings: async () => {
    const response = await apiClient.get('/confession-bands/my-bookings');
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (confessionId) => {
    const response = await apiClient.patch(`/confession-bands/bookings/${confessionId}/cancel`);
    return response.data;
  },
};