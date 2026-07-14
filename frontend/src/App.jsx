import About from './pages/About'; 
import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom'; 
import Header from './components/Header';
import Banner from './components/Banner';
import ProductList from './components/ProductList'; 
import ProductDetailPage from './pages/ProductDetailPage';
import Footer from './components/Footer'; 
import { productsApi } from './api/productsApi'; 
import axios from 'axios'; 

import Home from './pages/Home'; 

import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext'; 
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './routes/AdminRoute'; 

const AdminAddProductPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Phone',
    stock: '10'
  });
  const [imageFile, setImageFile] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('stock', formData.stock);
      
      const calculatedCostPrice = Math.round(Number(formData.price) * 0.8).toString();
      data.append('costPrice', calculatedCostPrice);

      if (imageFile) {
        data.append('image', imageFile);
      }

      await productsApi.create(data);
      alert('Thành công: Đã thêm mới sản phẩm vào hệ thống.');
      navigate('/products');
    } catch (err) {
      console.error(err);
      
      let errorMsg = err.message;
      if (err.response?.data?.detail) {
        if (typeof err.response.data.detail === 'object') {
          errorMsg = JSON.stringify(err.response.data.detail, null, 2);
        } else {
          errorMsg = err.response.data.detail;
        }
      }
      
      alert('❌ Lỗi lưu sản phẩm từ Server Backend:\n' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '32px', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '24px', fontWeight: '800', color: '#0f172a' }}>➕ THÊM SẢN PHẨM MỚI (ADMIN)</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Tên sản phẩm *</label>
          <input type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="Ví dụ: iPhone 16 Pro Max..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }} />
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Giá bán (VNĐ) *</label>
            <input type="number" name="price" required value={formData.price} onChange={handleInputChange} placeholder="Ví dụ: 34990000" style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Số lượng kho *</label>
            <input type="number" name="stock" required value={formData.stock} onChange={handleInputChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Danh mục sản phẩm</label>
          <select name="category" value={formData.category} onChange={handleInputChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', backgroundColor: '#fff' }}>
            <option value="Phone">Điện Thoại (iPhone)</option>
            <option value="Laptop">Máy Tính (MacBook)</option>
            <option value="Tablet">Máy Tính Bảng (iPad)</option>
            <option value="Accessory">Phụ Kiện</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Hình ảnh sản phẩm *</label>
          <input type="file" accept="image/*" required onChange={handleFileChange} style={{ width: '100%', padding: '8px', border: '1px dashed #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Mô tả chi tiết sản phẩm</label>
          <textarea name="description" rows="3" value={formData.description} onChange={handleInputChange} placeholder="Nhập thông số cấu hình, quà tặng kèm nếu có..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', resize: 'none' }}></textarea>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
          <button type="button" onClick={() => navigate('/products')} style={{ flex: 1, padding: '12px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Hủy Bỏ</button>
          <button type="submit" disabled={loading} style={{ flex: 2, padding: '12px', backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            {loading ? 'Đang gửi dữ liệu lên DB...' : 'Lưu Sản Phẩm Xuống DB 🚀'}
          </button>
        </div>
      </form>
    </div>
  );
};

const AboutPage = () => (
  <section style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', minHeight: '60vh' }}>
    <h2>About Us</h2>
    <p>This is a simple About page implemented for Session 5 Lab.</p>
  </section>
);

const CartPage = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, totalQuantity, totalPrice, clearCart } = useCart();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    note: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address) {
      alert('vui lòng điền đầy đủ các thông tin có dấu (*)!');
      return;
    }

    alert(`🎉 Đặt hàng thành công!\nXin cảm ơn quý khách ${shippingInfo.fullName}.\nĐơn hàng sẽ được gửi tới địa chỉ: ${shippingInfo.address}`);
    clearCart(); // Dọn dẹp giỏ hàng mượt mà từ Context
    navigate('/products');
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 16px', fontFamily: 'system-ui, sans-serif', color: '#1e293b', minHeight: '60vh' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '32px' }}>🛒 Giỏ Hàng Của Bạn</h2>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '50px' }}>🛍️</span>
          <p style={{ color: '#64748b', margin: '16px 0 24px 0', fontStyle: 'italic' }}>Giỏ hàng hiện tại đang trống rỗng .</p>
          <button onClick={() => navigate('/products')} style={{ padding: '12px 24px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
            Quay lại trang sản phẩm mua sắm
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: '1.5', minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: '16px', backgroundColor: '#fff', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', alignItems: 'center' }}>
                <img src={item.imageUrl || item.image_url || 'https://via.placeholder.com/80'} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'contain', backgroundColor: '#f8fafc', borderRadius: '8px' }} />
                <div style={{ flex: '1' }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: '700' }}>{item.name}</h4>
                  <p style={{ margin: 0, color: '#ef4444', fontWeight: 'bold', fontSize: '14px' }}>{Number(item.price).toLocaleString('vi-VN')}đ</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #cbd5e1', borderRadius: '20px', padding: '4px 12px', backgroundColor: '#f8fafc' }}>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 'bold', width: '16px' }}>-</button>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 'bold', width: '16px' }}>+</button>
                </div>
                <button onClick={() => removeFromCart(item.id)} style={{ border: 'none', backgroundColor: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: '18px', padding: '0 8px' }}>🗑️</button>
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
                  <span style={{ fontWeight: 'bold' }}>{totalQuantity} sản phẩm</span>
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
              
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              <Route element={<AdminRoute />}>
                <Route path="/admin/products/new" element={<AdminAddProductPage />} />
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