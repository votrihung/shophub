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
};