// src/api/authApi.js
import axios from 'axios';

// 🌟 ÉP BUỘC truyền url tuyệt đối của Backend vào đây
const API = axios.create({
  baseURL: 'http://localhost:8000', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authApi = {
  register: async (payload) => {
    // Gọi chuẩn đến http://localhost:8000/auth/register
    const response = await API.post('/auth/register', payload);
    return response.data;
  },
  login: async (payload) => {
    const response = await API.post('/auth/login', payload);
    return response.data;
  },
};