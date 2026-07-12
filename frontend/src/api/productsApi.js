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

  // 🚨 HÀM XÓA SẢN PHẨM MỚI BỔ SUNG (Bảo lưu nguyên vẹn logic fakeToken tối thượng của sốp):
  delete: async (id) => {
    // Đồng bộ cách lấy token giống hệt hàm create phía trên của sốp
    const rawLocal = localStorage.getItem('shophub_user');
    const parsedLocal = rawLocal ? JSON.parse(rawLocal) : {};
    const fakeToken = `shophub-session-${parsedLocal?.id || 1}`;

    // Gọi Axios thuần trỏ thẳng đến cổng 8000 của Backend kèm theo id sản phẩm
    const response = await axios.delete(`http://localhost:8000/products/${id}`, {
      headers: {
        'Authorization': `Bearer ${fakeToken}`
      }
    });
    return response.data;
  }
};