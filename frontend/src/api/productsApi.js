import axios from 'axios';
import axiosClient from './axiosClient';

export const productsApi = {
  getAll: (page = 1, size = 6) => {
    return axiosClient.get(`http://localhost:8000/products?page=${page}&size=${size}`);
  },

  getById: (id) => {
    return axiosClient.get(`http://localhost:8000/products/${id}`);
  },

  searchProduct: (query) => {
    return axiosClient.get(`http://localhost:8000/products/search?query=${encodeURIComponent(query)}`);
  },

  create: async (formData) => {
    const rawLocal = localStorage.getItem('shophub_user');
    const parsedLocal = rawLocal ? JSON.parse(rawLocal) : {};
    const fakeToken = `shophub-session-${parsedLocal?.id || 1}`;

    const response = await axios.post('http://localhost:8000/products', formData, {
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

    const response = await axios.delete(`http://localhost:8000/products/${String(id)}`, {
      headers: {
        'Authorization': `Bearer ${fakeToken}`
      }
    });
    return response.data;
  }
};