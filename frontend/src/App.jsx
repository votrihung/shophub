// src/App.jsx
import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom'; 
import Header from './components/Header';
import Banner from './components/Banner';
import ProductList from './components/ProductList'; 
import ProductDetailPage from './pages/ProductDetailPage';
import Footer from './components/Footer'; 
import { productsApi } from './api/productsApi'; 
import axios from 'axios'; 

// IMPORT TRANG HOME ĐÃ CẬP NHẬT HIỆU ỨNG LUNG LINH
import Home from './pages/Home'; 

// IMPORT CHUẨN SESSION 9
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// 2. Trang giới thiệu (AboutPage) - GIỮ NGUYÊN 100% CỦA SỐP
const AboutPage = () => (
  <section style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', minHeight: '60vh' }}>
    <h2>About Us</h2>
    <p>This is a simple About page implemented for Session 5 Lab.</p>
  </section>
);

// 3. Trang giỏ hàng (CartPage) - GIỮ NGUYÊN 100% CỦA SỐP
const CartPage = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('shophub_cart');
    return savedCart ? JSON.parse(savedCart) : {};
  });

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    note: ''
  });

  useEffect(() => {
    localStorage.setItem('shophub_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsApi.getAll();
        if (Array.isArray(data)) setAllProducts(data);
        else if (data?.products) setAllProducts(data.products);
        else if (data?.data) setAllProducts(data.data.products || data.data);
      } catch (err) {
        console.error("Không lấy được danh sách sản phẩm đối chiếu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const updateQuantity = (productId, amount) => {
    setCart(prev => {
      const currentQty = prev[productId] || 0;
      const newQty = currentQty + amount;
      if (newQty <= 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: newQty };
    });
  };

  const removeProduct = (productId) => {
    setCart(prev => {
      const { [productId]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address) {
      alert('Sốp ơi, vui lòng điền đầy đủ các thông tin có dấu (*) nha!');
      return;
    }

    alert(`🎉 Đặt hàng thành công!\nXin cảm ơn bác ${shippingInfo.fullName}.\nĐơn hàng sẽ được gửi tới địa chỉ: ${shippingInfo.address}`);
    setCart({});
    localStorage.removeItem('shophub_cart');
    navigate('/products');
  };

  const cartItems = allProducts.filter(p => cart[p.id] > 0);
  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const totalPrice = cartItems.reduce((sum, p) => sum + (Number(p.price) * cart[p.id]), 0);

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>Đang tải thông tin giỏ hàng...</div>;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 16px', fontFamily: 'system-ui, sans-serif', color: '#1e293b', minHeight: '60vh' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '32px' }}>🛒 Giỏ Hàng Của Bạn</h2>

      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '50px' }}>🛍️</span>
          <p style={{ color: '#64748b', margin: '16px 0 24px 0', fontStyle: 'italic' }}>Giỏ hàng hiện tại đang trống rỗng sốp ơi.</p>
          <button onClick={() => navigate('/products')} style={{ padding: '12px 24px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
            Quay lại trang sản phẩm mua sắm
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: '1.5', minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cartItems.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: '16px', backgroundColor: '#fff', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', alignItems: 'center' }}>
                <img src={item.image_url || 'https://via.placeholder.com/80'} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'contain', backgroundColor: '#f8fafc', borderRadius: '8px' }} />
                <div style={{ flex: '1' }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: '700' }}>{item.name}</h4>
                  <p style={{ margin: 0, color: '#ef4444', fontWeight: 'bold', fontSize: '14px' }}>{Number(item.price).toLocaleString('vi-VN')}đ</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #cbd5e1', borderRadius: '20px', padding: '4px 12px', backgroundColor: '#f8fafc' }}>
                  <button onClick={() => updateQuantity(item.id, -1)} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 'bold', width: '16px' }}>-</button>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{cart[item.id]}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 'bold', width: '16px' }}>+</button>
                </div>
                <button onClick={() => removeProduct(item.id)} style={{ border: 'none', backgroundColor: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: '18px', padding: '0 8px' }}>🗑️</button>
              </div>
            ))}
          </div>

          <div style={{ flex: '1', minWidth: '300px', backgroundColor: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '700', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>📋 Thông tin nhận hàng</h3>
            <form onSubmit={handleSubmitOrder} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Họ và tên người nhận *</label>
                <input type="text" name="fullName" required value={shippingInfo.fullName} onChange={handleInputChange} placeholder="Ví dụ: Nguyễn Văn A..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13.5px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Số điện thoại liên hệ *</label>
                <input type="tel" name="phone" required value={shippingInfo.phone} onChange={handleInputChange} placeholder="Nhập số điện thoại..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13.5px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Địa chỉ giao hàng *</label>
                <input type="text" name="address" required value={shippingInfo.address} onChange={handleInputChange} placeholder="Số nhà, tên đường, quận..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13.5px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Ghi chú đơn hàng</label>
                <textarea name="note" rows="2" value={shippingInfo.note} onChange={handleInputChange} placeholder="Ghi chú thêm nếu có..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13.5px', resize: 'none', boxSizing: 'border-box' }}></textarea>
              </div>

              <div style={{ borderTop: '1px dashed #e2e8f0', marginTop: '10px', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                  <span>Số lượng:</span>
                  <span style={{ fontWeight: 'bold' }}>{totalItems} sản phẩm</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', marginBottom: '20px' }}>
                  <span>Tổng tiền:</span>
                  <span style={{ fontWeight: 'bold', color: '#ef4444', fontSize: '18px' }}>{totalPrice.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>
                Xác Nhận Đặt Hàng Ngay
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// 4. Component chính App - ĐÃ ĐỔI SANG DÙNG COMPONENT HOME TỪ FILE RIÊNG LUNG LINH
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

        if (!isAuthPage && sentToken && error.response && (error.response.status === 401 || error.response.status === 404)) {
          alert("🚨 Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại sốp ơi!");
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
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header title="ShopHub" />
        
        <div style={{ flex: 1 }}>
          <Routes>
            {/* 🎯 ĐÃ ĐỔI ELEMENT QUA <Home /> TỪ FILE PAGES/HOME XỊN SÒ */}
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
            
            <Route path="/about" element={<AboutPage />} />
            
            <Route 
              path="/cart" 
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              } 
            />
            
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
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
    </AuthProvider>
  );
};

export default App;