// src/api/authApi.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://shophub-production-c481.up.railway.app', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authApi = {
  register: async (payload) => {
    const response = await API.post('/auth/register', payload);
    return response.data;
  },
  login: async (payload) => {
    const response = await API.post('/auth/login', payload);
    return response.data;
  },
};