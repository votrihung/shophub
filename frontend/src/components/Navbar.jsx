// src/components/Navbar.jsx
import React, { useEffect, useState } from 'react';

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Hàm quét và cập nhật số lượng
  const updateCount = () => {
    const savedCart = localStorage.getItem('shophub_cart');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      const total = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
      
      setCartCount(prev => {
        // Nếu số lượng tăng lên, kích hoạt animation ngay
        if (total > prev) {
          setIsAnimating(true);
        }
        return total;
      });
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCount();
    
    // Lắng nghe sự kiện custom siêu nhạy từ nút bấm truyền lên
    window.addEventListener('cart_updated', updateCount);
    window.addEventListener('storage', updateCount);

    return () => {
      window.removeEventListener('cart_updated', updateCount);
      window.removeEventListener('storage', updateCount);
    };
  }, []);

  // Tắt hiệu ứng animation sau khi chạy xong 300ms
  useEffect(() => {
    if (!isAnimating) return;
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [isAnimating]);

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
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      <style>{`
        @keyframes bouncePop {
          0% { transform: scale(1); }
          50% { transform: scale(1.3) rotate(-10deg); }
          80% { transform: scale(0.9) rotate(5deg); }
          100% { transform: scale(1) rotate(0); }
        }
        .cart-bounce-effect {
          animation: bouncePop 0.3s ease-in-out !important;
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b', cursor: 'pointer' }}>
          📱 ShopHub <span style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 'normal' }}>Premium</span>
        </div>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', fontSize: '14px' }}>
          <span style={{ cursor: 'pointer', fontWeight: '600', color: '#f59e0b' }}>Trang Chủ</span>
          {['Sản Phẩm', 'Tin Tức', 'Liên Hệ'].map((item, index) => (
            <span key={index} style={{ cursor: 'pointer', fontWeight: '500', color: '#cbd5e1' }}>{item}</span>
          ))}
          
          {/* ICON GIỎ HÀNG */}
          <div 
            className={isAnimating ? 'cart-bounce-effect' : ''}
            style={{ 
              position: 'relative', 
              cursor: 'pointer', 
              marginLeft: '10px',
              display: 'inline-block',
              transition: 'transform 0.2s'
            }}
          >
            <span style={{ fontSize: '22px' }}>🛒</span>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-8px',
                backgroundColor: '#ef4444',
                color: '#fff',
                fontSize: '10px',
                fontWeight: '800',
                borderRadius: '50%',
                padding: '2px 6px',
                textAlign: 'center',
                boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)'
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