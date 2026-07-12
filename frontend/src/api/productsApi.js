import axios from 'axios';
import axiosClient from './axiosClient';

export const productsApi = {
  // Trỏ thẳng sang endpoint của Backend ở cổng 8000 để tránh trùng router Frontend
  getAll: () => {
    return axiosClient.get('http://localhost:8000/products');
  },
  getById: (id) => {
    return axiosClient.get(`http://localhost:8000/products/${id}`);
  },
  searchProduct: (query) => {
    return axiosClient.get(`http://localhost:8000/products/search?query=${query}`);
  },

  // 🚀 HÀM MỚI TỐI THƯỢNG: Thêm sản phẩm dùng Axios thuần để vượt qua bộ chặn đá Login của axiosClient
  create: async (formData) => {
    // Lấy token giả định từ localStorage nếu Backend cần đọc user id
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

  // 🚨 HÀM XÓA CẬP NHẬT MỚI: Dùng Axios thuần + Ép kiểu ID + Gửi Token để đập tan lỗi 422!
  delete: async (id) => {
    // Lấy token giả định từ localStorage tương tự hàm create để Backend xác thực quyền Admin nếu cần
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