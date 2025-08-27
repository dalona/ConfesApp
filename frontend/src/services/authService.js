import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const API = `${API_BASE_URL}/api`;

export const authService = {
  login: async (email, password) => {
    const response = await axios.post(`${API}/auth/login`, {
      email,
      password,
    });
    return response.data;
  },

  register: async (userData) => {
    const response = await axios.post(`${API}/auth/register`, userData);
    return response.data;
  },

  registerPriest: async (priestData) => {
    const response = await axios.post(`${API}/auth/register-priest`, priestData);
    return response.data;
  },

  registerFromInvite: async (token, userData) => {
    const response = await axios.post(`${API}/auth/register-from-invite/${token}`, userData);
    return response.data;
  },

  validateInvite: async (token) => {
    const response = await axios.get(`${API}/invites/validate/${token}`);
    return response.data;
  },
};