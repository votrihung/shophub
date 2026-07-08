// src/components/ProductList.jsx
import { useEffect, useState } from 'react';
import { productsApi } from '../api/productsApi';
import ProductCard from './ProductCard'; 
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';

const ProductList = () => {
  const [products, setProducts] = useState([]);      
  const [allProducts, setAllProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // 💾 1. TÍNH NĂNG: Khởi tạo giỏ hàng ban đầu từ LocalStorage (nếu có)
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('shophub_cart');
    return savedCart ? JSON.parse(savedCart) : {};
  });

  // 🛍️ TÍNH NĂNG: Quản lý trạng thái đóng/mở Modal thông báo thanh toán
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 💾 2. TÍNH NĂNG: Tự động lưu giỏ hàng vào LocalStorage mỗi khi có thay đổi
  useEffect(() => {
    localStorage.setItem('shophub_cart', JSON.stringify(cart));
  }, [cart]);

  // Tải danh sách sản phẩm từ API (Đã sửa lỗi cú pháp & tích hợp bộ lọc vạn năng)
  const loadInitialProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await productsApi.getAll();
      let cleanData = [];

      // Bộ lọc vạn năng bóc tách dữ liệu từ Axios và FastAPI
      if (data) {
        if (Array.isArray(data)) {
          cleanData = data;
        } else if (data.products && Array.isArray(data.products)) {
          cleanData = data.products;
        } else if (data.data && Array.isArray(data.data)) {
          cleanData = data.data;
        } else if (data.data && data.data.products && Array.isArray(data.data.products)) {
          cleanData = data.data.products;
        }
      }

      setProducts(cleanData);
      setAllProducts(cleanData); 
    } catch (err) {
      console.error("Lỗi tải sản phẩm:", err);
      setError('Không thể kết nối đến dữ liệu sản phẩm từ hệ thống.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialProducts();
  }, []);

  // Bộ lọc tìm kiếm thông minh an toàn
  useEffect(() => {
    const triggerSearch = async () => {
      // Bảo đảm an toàn khi allProducts chưa load xong hoặc không phải mảng
      const currentAllProducts = Array.isArray(allProducts) ? allProducts : [];

      if (searchTerm.trim() === '') {
        setProducts(currentAllProducts);
        setError('');
        return;
      }

      try {
        const data = await productsApi.searchProduct(searchTerm);
        if (Array.isArray(data)) { setProducts(data); return; }
        if (data && data.products && Array.isArray(data.products)) { setProducts(data.products); return; }
        if (data && data.data && Array.isArray(data.data)) { setProducts(data.data); return; }
        throw new Error("API Search format invalid");
      } catch (err) {
        // Fallback filter tay nếu API search lỗi
        const filtered = currentAllProducts.filter(p => 
          p && p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setProducts(filtered);
        setError(''); 
      }
    };

    triggerSearch();
  }, [searchTerm, allProducts]);

  // Tăng / giảm số lượng trong giỏ hàng
  const handleUpdateCart = (productId, amount) => {
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

  // 💳 3. TÍNH NĂNG: Xử lý khi bấm nút "Tiến Hành Thanh Toán"
  const handleCheckout = () => {
    setIsModalOpen(true); // Mở popup chúc mừng
  };

  // 💳 TÍNH NĂNG: Xác nhận hoàn tất đơn hàng, xóa sạch giỏ hàng
  const handleConfirmOrder = () => {
    setCart({}); // Reset giỏ hàng về trống
    localStorage.removeItem('shophub_cart'); // Xóa giỏ hàng trong bộ nhớ máy
    setIsModalOpen(false); // Đóng popup
  };

  // Đảm bảo các biến dùng loop luôn là mảng để không lỗi crash giao diện
  const safeProductsArray = Array.isArray(products) ? products : [];
  const safeAllProductsArray = Array.isArray(allProducts) ? allProducts : [];

  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  
  const totalPrice = safeAllProductsArray.reduce((sum, p) => { 
    if (!p || !p.id) return sum;
    const qty = cart[p.id] || 0; 
    const itemPrice = Number(p.price) || 0;
    return sum + (itemPrice * qty); 
  }, 0);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} onRetry={loadInitialProducts} />;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui, sans-serif', boxSizing: 'border-box' }}>
      
      {/* Ô TÌM KIẾM */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
        <span style={{ fontWeight: 'bold', color: '#475569', fontSize: '14px' }}>Tìm kiếm:</span>
        <input 
          type="text" 
          placeholder="Nhập tên điện thoại cần tìm..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '6px 12px',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            width: '280px',
            fontSize: '14px',
            outline: 'none'
          }}
        />
      </div>

      <h2 style={{ textAlign: 'center', fontSize: '22px', fontWeight: 'bold', color: '#1e293b', marginBottom: '30px' }}>
        Danh Sách Sản Phẩm Hệ Thống (Dữ Liệu Thật)
      </h2>

      {/* CHIA LAYOUT GIỮ NGUYÊN BẢN 3 CỘT ĐÃ FIX */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', width: '100%' }}>
        
        {/* BÊN TRÁI: GRID 3 SẢN PHẨM HÀNG NGANG */}
        <div style={{ flex: '3' }}>
          {safeProductsArray.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
              {safeProductsArray.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  quantity={cart[product.id] || 0}
                  onUpdateCart={handleUpdateCart}
                />
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#94a3b8', fontStyle: 'italic', padding: '40px' }}>
              Không tìm thấy sản phẩm nào trùng khớp với từ khóa.
            </p>
          )}
        </div>

        {/* BÊN PHẢI: KHỐI GIỎ HÀNG */}
        <div style={{ flex: '1', minWidth: '280px', position: 'sticky', top: '20px' }}>
          <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px', backgroundColor: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 12px 0', textAlign: 'center' }}>
              🛒 Tóm tắt đơn hàng
            </h3>
            <hr style={{ border: '0', borderTop: '1px solid #f1f5f9', marginBottom: '12px' }} />
            
            {totalItems === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic', textAlign: 'center', padding: '10px 0' }}>
                Giỏ hàng đang trống.
              </p>
            ) : (
              <div style={{ marginBottom: '12px', maxHeight: '125px', overflowY: 'auto' }}>
                {safeAllProductsArray.map(p => {
                  if (!p || !p.id) return null;
                  const qty = cart[p.id] || 0;
                  if (qty === 0) return null;
                  return (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#475569', marginBottom: '8px' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>{p.name}</span>
                      <span style={{ fontWeight: 'bold', color: '#1e293b' }}>x{qty}</span>
                    </div>
                  );
                })}
              </div>
            )}
            
            <hr style={{ border: '0', borderTop: '1px solid #f1f5f9', margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#475569', marginBottom: '8px' }}>
              <span>Tổng sản phẩm:</span>
              <span style={{ fontWeight: 'bold', color: '#1e293b' }}>{totalItems}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#475569', marginBottom: '20px' }}>
              <span>Tổng thanh toán:</span>
              <span style={{ fontWeight: 'bold', color: '#ef4444', fontSize: '16px' }}>{totalPrice.toLocaleString('vi-VN')}đ</span>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={totalItems === 0}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                fontWeight: 'bold',
                color: '#fff',
                border: 'none',
                backgroundColor: totalItems === 0 ? '#cbd5e1' : '#22c55e',
                cursor: totalItems === 0 ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              Tiến Hành Thanh Toán
            </button>
          </div>
        </div>

      </div>

      {/* 🎭 POPUP POPUP MODAL THANH TOÁN THÀNH CÔNG NÂNG CAO */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#fff', padding: '30px', borderRadius: '12px', width: '400px',
            textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <span style={{ fontSize: '50px' }}>🎉</span>
            <h3 style={{ margin: '10px 0', color: '#1e293b', fontSize: '20px', fontWeight: 'bold' }}>Đặt Hàng Thành Công!</h3>
            <p style={{ color: '#475569', fontSize: '14px', marginBottom: '20px' }}>
              Hệ thống ShopHub đã ghi nhận đơn hàng trị giá <strong style={{ color: '#ef4444' }}>{totalPrice.toLocaleString('vi-VN')}đ</strong> của bác.
            </p>
            <button 
              onClick={handleConfirmOrder}
              style={{
                backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '10px 20px',
                borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', width: '100%'
              }}
            >
              Xác Nhận & Đóng
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductList;