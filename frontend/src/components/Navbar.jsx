// src/components/Navbar.jsx
import React, { useEffect, useState } from 'react';

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);

  // Lắng nghe thay đổi của giỏ hàng để cập nhật số lượng badge trên Navbar
  useEffect(() => {
    const updateCount = () => {
      const savedCart = localStorage.getItem('shophub_cart');
      if (savedCart) {
        const cart = JSON.parse(savedCart);
        const total = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
        setCartCount(total);
      } else {
        setCartCount(0);
      }
    };

    updateCount();
    // Tạo sự kiện lắng nghe để cập nhật liên tục
    window.addEventListener('storage', updateCount);
    const interval = setInterval(updateCount, 1000); // Check nhanh mỗi giây

    return () => {
      window.removeEventListener('storage', updateCount);
      clearInterval(interval);
    };
  }, []);

  return (
    <nav style={{
      backgroundColor: '#1e293b',
      color: '#fff',
      padding: '15px 20px',
      display: 'flex',
      justifyContent: 'between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 900,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* LOGO CHUẨN ĐẸP */}
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b', cursor: 'pointer' }}>
          📱 ShopHub <span style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 'normal' }}>Premium</span>
        </div>

        {/* MENU ĐIỀU HƯỚNG */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', fontSize: '14px' }}>
          <span style={{ cursor: 'pointer', fontWeight: '500', color: '#f59e0b' }}>Trang Chủ</span>
          <span style={{ cursor: 'pointer', fontWeight: '500', color: '#94a3b8' }}>Sản Phẩm</span>
          <span style={{ cursor: 'pointer', fontWeight: '500', color: '#94a3b8' }}>Tin Tức</span>
          <span style={{ cursor: 'pointer', fontWeight: '500', color: '#94a3b8' }}>Liên Hệ</span>
          
          {/* ICON GIỎ HÀNG NHỎ TRÊN THANH NAVBAR */}
          <div style={{ position: 'relative', cursor: 'pointer', marginLeft: '10px' }}>
            <span style={{ fontSize: '20px' }}>🛒</span>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-10px',
                backgroundColor: '#ef4444',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 'bold',
                borderRadius: '50%',
                padding: '2px 6px',
                textAlign: 'center'
              }}>
                {cartCount}
              </span>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;