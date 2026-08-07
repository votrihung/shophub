import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('shophub_token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const adminStatsApi = {
  getOverview: async () => {
    const response = await axios.get(`${API_BASE_URL}/admin/stats/overview`, getAuthHeaders());
    return response.data;
  },

  getMonthlyRevenue: async () => {
    const response = await axios.get(`${API_BASE_URL}/admin/stats/monthly-revenue`, getAuthHeaders());
    return response.data;
  }
};