// src/components/ProductList.jsx
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsApi } from '../api/productsApi';
import ProductCard from './ProductCard'; 
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';

const ProductList = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    { id: 'All', name: ' Tất Cả Sản Phẩm' },
    { id: 'Phone', name: ' Điện Thoại (iPhone)' },
    { id: 'Laptop', name: ' Máy Tính (MacBook)' },
    { id: 'Tablet', name: ' Máy Tính Bảng (iPad)' },
    { id: 'Accessory', name: ' Phụ Kiện' }
  ];
  
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('shophub_cart');
    return savedCart ? JSON.parse(savedCart) : {};
  });

  useEffect(() => {
    localStorage.setItem('shophub_cart', JSON.stringify(cart));
  }, [cart]);

  const loadInitialProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await productsApi.getAll();
      let cleanData = [];

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

  const filteredProducts = useMemo(() => {
    const currentAllProducts = Array.isArray(allProducts) ? allProducts : [];
    
    return currentAllProducts.filter(product => {
      if (!product) return false;
      
      const matchesSearch = product.name 
        ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) 
        : true;
        
      const matchesCategory = selectedCategory === 'All' 
        ? true 
        : (product.category === selectedCategory);
        
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, allProducts, selectedCategory]);

  // 🌟 LOGIC CẬP NHẬT: Thêm phát Custom Event để Navbar bắt sóng tức thì
  const handleUpdateCart = (productId, amount) => {
    setCart(prev => {
      const currentQty = prev[productId] || 0;
      const newQty = currentQty + amount;
      
      let nextCart;
      if (newQty <= 0) {
        const { [productId]: _, ...rest } = prev;
        nextCart = rest;
      } else {
        nextCart = { ...prev, [productId]: newQty };
      }

      // Phát tín hiệu ngay lập tức cho Navbar chuyển động lắc lư
      setTimeout(() => {
        window.dispatchEvent(new Event('cart_updated'));
      }, 0);

      return nextCart;
    });
  };

  const handleCheckout = () => {
    navigate('/cart'); 
  };

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
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '32px 16px', fontFamily: 'system-ui, sans-serif', boxSizing: 'border-box', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* 🔍 EFFECT: Ô tìm kiếm bo viền chuyển động mượt mà */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '440px', display: 'flex', alignItems: 'center' }}>
          <span style={{ position: 'absolute', left: '16px', color: '#94a3b8', fontSize: '16px' }}>🔍</span>
          <input 
            type="text" 
            placeholder="Nhập tên điện thoại, laptop cần tìm..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px 14px 44px',
              border: '1px solid #cbd5e1',
              borderRadius: '14px',
              fontSize: '14.5px',
              outline: 'none',
              backgroundColor: '#fff',
              boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.03)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1), 0 4px 12px rgba(0, 0, 0, 0.05)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#cbd5e1';
              e.target.style.boxShadow = '0 4px 12px -2px rgba(0, 0, 0, 0.03)';
            }}
          />
        </div>
      </div>

      <h2 style={{ textAlign: 'center', fontSize: '26px', fontWeight: '800', color: '#0f172a', marginBottom: '40px', letterSpacing: '-0.5px' }}>
        Danh Sách Sản Phẩm Hệ Thống (Dữ Liệu Thật)
      </h2>

      {/* 🔀 LAYOUT HAI CỘT CHÍNH CÂN ĐỐI */}
      <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start' }}>
        
        {/* ================= CỘT TRÁI: SIDEBAR & TÓM TẮT GIỎ HÀNG (STICKY SMOOTH) ================= */}
        <div style={{ 
          flex: '1', 
          minWidth: '290px', 
          maxWidth: '310px',
          display: 'flex', 
          flexDirection: 'column', 
          gap: '24px',
          position: 'sticky',
          top: '24px'
        }}>
          {/* BOX 1: BỘ LỌC DANH MỤC */}
          <div style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: '20px', 
            padding: '24px', 
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px -2px rgba(0,0,0,0.02)'
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Bộ Lọc Danh Mục
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      textAlign: 'left',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: isSelected ? '700' : '500',
                      backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                      color: isSelected ? '#1d4ed8' : '#475569',
                      cursor: 'pointer',
                      transform: isSelected ? 'translateX(4px)' : 'none',
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    onMouseOver={(e) => { 
                      if(!isSelected) {
                        e.target.style.backgroundColor = '#f1f5f9';
                        e.target.style.transform = 'translateX(4px)';
                        e.target.style.color = '#0f172a';
                      }
                    }}
                    onMouseOut={(e) => { 
                      if(!isSelected) {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.transform = 'none';
                        e.target.style.color = '#475569';
                      }
                    }}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* BOX 2: TÓM TẮT ĐƠN HÀNG */}
          <div style={{ 
            border: '1px solid #e2e8f0', 
            borderRadius: '20px', 
            padding: '24px', 
            backgroundColor: '#fff', 
            boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.02)' 
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>
              🛒 Tóm tắt đơn hàng
            </h3>
            
            {totalItems === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '13.5px', fontStyle: 'italic', textAlign: 'center', padding: '16px 0', margin: 0 }}>
                Giỏ hàng đang trống.
              </p>
            ) : (
              <div style={{ marginBottom: '14px', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
                {safeAllProductsArray.map(p => {
                  if (!p || !p.id) return null;
                  const qty = cart[p.id] || 0;
                  if (qty === 0) return null;
                  return (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13.5px', color: '#334155', marginBottom: '10px', padding: '8px 10px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px', fontWeight: '500' }}>{p.name}</span>
                      <span style={{ fontWeight: '800', color: '#2563eb', backgroundColor: '#dbeafe', padding: '2px 8px', borderRadius: '6px', fontSize: '12px' }}>x{qty}</span>
                    </div>
                  );
                })}
              </div>
            )}
            
            <div style={{ borderTop: '1px dashed #e2e8f0', margin: '14px 0', paddingTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', color: '#64748b', marginBottom: '10px' }}>
                <span>Tổng sản phẩm:</span>
                <span style={{ fontWeight: '700', color: '#0f172a', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '20px', fontSize: '13px' }}>{totalItems}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13.5px', color: '#64748b', marginBottom: '20px' }}>
                <span>Tổng thanh toán:</span>
                <span style={{ fontWeight: '800', color: '#ef4444', fontSize: '18px', trackingTight: '-0.5px' }}>{totalPrice.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            {/* EFFECT ACTIVE: Bấm vào lún nhẹ nút xuống cực êm */}
            <button 
              onClick={handleCheckout}
              disabled={totalItems === 0}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                fontWeight: '700',
                border: 'none',
                backgroundColor: totalItems === 0 ? '#e2e8f0' : '#22c55e',
                color: totalItems === 0 ? '#94a3b8' : '#fff',
                cursor: totalItems === 0 ? 'not-allowed' : 'pointer',
                fontSize: '14.5px',
                boxShadow: totalItems === 0 ? 'none' : '0 4px 14px rgba(34, 197, 94, 0.2)',
                transition: 'all 0.2s ease'
              }}
              onMouseDown={(e) => { if(totalItems > 0) e.currentTarget.style.transform = 'scale(0.97)' }}
              onMouseUp={(e) => { if(totalItems > 0) e.currentTarget.style.transform = 'scale(1)' }}
              onMouseOver={(e) => { if(totalItems > 0) e.currentTarget.style.backgroundColor = '#16a34a' }}
              onMouseOut={(e) => { if(totalItems > 0) e.currentTarget.style.backgroundColor = '#22c55e' }}
            >
              Tiến Hành Thanh Toán
            </button>
          </div>
        </div>

        {/* ================= CỘT PHẢI: LƯỚI SẢN PHẨM ================= */}
        <div style={{ flex: '3' }}>
          {filteredProducts.length > 0 ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
              gap: '24px' 
            }}>
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  quantity={cart[product.id] || 0}
                  onUpdateCart={handleUpdateCart}
                />
              ))}
            </div>
          ) : (
            <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '60px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <p style={{ color: '#94a3b8', fontStyle: 'italic', margin: 0, fontSize: '14.5px' }}>
                Không tìm thấy sản phẩm nào trùng khớp với danh mục hoặc từ khóa này.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default ProductList;