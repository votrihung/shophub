import axios from 'axios';
import { handleApiError } from './errorHandler';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://shophub-production-c481.up.railway.app',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    handleApiError(error);
    return Promise.reject(error);
  }
);

export default axiosClient;