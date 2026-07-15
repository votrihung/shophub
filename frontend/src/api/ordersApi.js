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
  // Truyền trực tiếp orderData (đã gồm total_amount và items) sang Backend
  const response = await axios.post(`${API_URL}/checkout`, orderData, config);
  return response.data;
};

export const getOrderHistory = async () => {
  const config = getHeaders();
  const response = await axios.get(`${API_URL}/history`, config);
  return response.data;
};