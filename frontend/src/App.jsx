import AdminOrderDetailPage from './pages/AdminOrderDetailPage';
import OrderDetailPage from './pages/OrderDetailPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'; 
import Header from './components/Header';
import Banner from './components/Banner';
import ProductList from './components/ProductList'; 
import ProductDetailPage from './pages/ProductDetailPage';
import Footer from './components/Footer'; 
import About from './pages/About'; 
import Home from './pages/Home'; 
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; 
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './routes/AdminRoute'; 
import axios from 'axios'; 

import CartPage from './pages/CartPage';
import AdminAddProductPage from './pages/AdminAddProductPage';

const App = () => {
  useEffect(() => {
    const reqInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('shophub_token');
        if (token && token !== 'undefined') {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const resInterceptor = axios.interceptors.response.use(
      (response) => response, 
      (error) => {
        const isAuthPage = window.location.pathname.includes('/login') || window.location.pathname.includes('/register');
        const sentToken = error.config?.headers?.Authorization;
        const isAdminRoute = window.location.pathname.includes('/admin');

        if (!isAuthPage && !isAdminRoute && sentToken && error.response && (error.response.status === 401 || error.response.status === 404)) {
          alert("Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại!");
          localStorage.removeItem('shophub_token'); 
          localStorage.removeItem('shophub_cart');  
          window.location.href = '/login';          
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(reqInterceptor);
      axios.interceptors.response.eject(resInterceptor);
    };
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Header title="ShopHub" />
          
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              
              <Route 
                path="/products" 
                element={
                  <ProtectedRoute>
                    <ProductList />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/products/:id" 
                element={
                  <ProtectedRoute>
                    <ProductDetailPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="/about" element={<About />} />
              <Route path="/gioi-thieu" element={<About />} />
              
              <Route 
                path="/cart" 
                element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/orders/history" 
                element={
                  <ProtectedRoute>
                    <OrderHistoryPage />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/orders/:id" 
                element={
                  <ProtectedRoute>
                    <OrderDetailPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              <Route element={<AdminRoute />}>
                <Route path="/admin/products/new" element={<AdminAddProductPage />} />
                <Route path="/admin/orders" element={<AdminOrdersPage />} />
                <Route path="/admin/orders/:id" element={<AdminOrderDetailPage />} />
              </Route>
              
              <Route
                path="*"
                element={
                  <section style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', minHeight: '60vh' }}>
                    <h2>Page not found</h2>
                    <p>The page you are looking for does not exist.</p>
                  </section>
                }
              />
            </Routes>
          </div>

          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;