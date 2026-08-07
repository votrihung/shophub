import axios from 'axios';
import axiosClient from './axiosClient';

export const productsApi = {
  getAll: (page = 1, size = 6) => {
    return axiosClient.get(`https://shophub-production-c481.up.railway.app/products?page=${page}&size=${size}`);
  },

  getById: (id) => {
    return axiosClient.get(`https://shophub-production-c481.up.railway.app/products/${id}`);
  },

  searchProduct: (query) => {
    return axiosClient.get(`https://shophub-production-c481.up.railway.app/products/search?query=${encodeURIComponent(query)}`);
  },

  create: async (formData) => {
    const rawLocal = localStorage.getItem('shophub_user');
    const parsedLocal = rawLocal ? JSON.parse(rawLocal) : {};
    const fakeToken = `shophub-session-${parsedLocal?.id || 1}`;

    const response = await axios.post('https://shophub-production-c481.up.railway.app/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${fakeToken}`
      }
    });
    return response.data;
  },

  delete: async (id) => {
    const rawLocal = localStorage.getItem('shophub_user');
    const parsedLocal = rawLocal ? JSON.parse(rawLocal) : {};
    const fakeToken = `shophub-session-${parsedLocal?.id || 1}`;

    const response = await axios.delete(`https://shophub-production-c481.up.railway.app/products/${String(id)}`, {
      headers: {
        'Authorization': `Bearer ${fakeToken}`
      }
    });
    return response.data;
  }
};