// src/auth/token.js

// Hàm lưu token vào localStorage
export const setToken = (token) => {
  localStorage.setItem('shophub_token', token);
};

// Hàm lấy token từ localStorage
export const getToken = () => {
  return localStorage.getItem('shophub_token');
};

// Hàm xoá token khi Đăng xuất / Token hết hạn (Hàm này đang bị thiếu khiến app crash)
export const removeToken = () => {
  localStorage.removeItem('shophub_token');
};