// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// 🌟 BỔ SUNG: Import 2 bộ quản lý Context để kích hoạt tính năng Session 9
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* 🌟 Bọc AuthProvider ngoài cùng để xử lý trạng thái Đăng nhập/Đăng xuất */}
      <AuthProvider>
        {/* 🌟 Bọc CartProvider bên trong để tự động đồng bộ Giỏ hàng theo Session của User */}
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);