// src/api/authApi.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000', 
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