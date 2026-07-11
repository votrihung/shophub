// src/api/authApi.js
import axios from 'axios';

export const authApi = {
  // 🌟 Đấm thẳng link tuyệt đối cổng 8000 của Python vào đây luôn sốp ơi!
  register: async (payload) => {
    const response = await axios.post('http://localhost:8000/auth/register', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  login: async (payload) => {
    const response = await axios.post('http://localhost:8000/auth/login', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },
};