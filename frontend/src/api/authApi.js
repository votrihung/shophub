// src/api/authApi.js
import axios from 'axios';

export const authApi = {
  register: async (payload) => {
    const response = await axios.post('https://shophub-production-c481.up.railway.app/auth/register', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  login: async (payload) => {
    const response = await axios.post('https://shophub-production-c481.up.railway.app/auth/login', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },
};