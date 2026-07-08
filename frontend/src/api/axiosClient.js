// src/api/axiosClient.js
import axios from 'axios';
import { handleApiError } from './errorHandler';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5173',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

axiosClient.interceptors.response.use(
  (response) => {
    // Trả về trực tiếp response.data nếu thành công
    return response.data;
  },
  (error) => {
    // Nếu lỗi, xử lý qua errorHandler rồi quăng lỗi ra ngoài
    handleApiError(error);
    return Promise.reject(error);
  }
);

export default axiosClient;