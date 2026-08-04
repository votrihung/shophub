import axios from 'axios';

const API_URL = 'http://localhost:8000/orders';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return {
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

export const checkout = async (orderData) => {
  const config = getHeaders();
  const response = await axios.post(`${API_URL}/checkout`, orderData, config);
  return response.data;
};

export const getOrderHistory = async () => {
  const config = getHeaders();
  const response = await axios.get(`${API_URL}/history`, config);
  return response.data;
};

export const getAllOrders = async () => {
  const config = getHeaders();
  const response = await axios.get(API_URL, config);
  return response.data;
};

export const updateOrderStatus = async (orderId, payload) => {
  const config = getHeaders();
  const response = await axios.patch(`${API_URL}/${orderId}`, payload, config);
  return response.data;
};

export const ordersApi = {
  getAll: getAllOrders,
  updateStatus: updateOrderStatus,
  checkout,
  getOrderHistory,
};

export default ordersApi;