// src/api/usersApi.js
import axiosClient from './axiosClient';
import { handleApiError } from './errorHandler';

export const usersApi = {
  // Lấy toàn bộ danh sách users
  async getAll() {
    try {
      const response = await axiosClient.get('/users');
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch users');
      throw error;
    }
  },

  // Lấy chi tiết 1 user theo ID
  async getById(id) {
    try {
      const response = await axiosClient.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch user details');
      throw error;
    }
  },
};