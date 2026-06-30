import React from 'react';

const Header = () => {
  return (
    <header style={{
      backgroundColor: '#1a252f',
      color: '#ffffff',
      padding: '15px 30px',
      display: 'flex',
      justifyContent: 'between',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* 1. Bên trái: Logo ShopHub */}
      <div style={{ fontSize: '24px', fontWeight: 'bold', flex: 1 }}>
        🛍️ ShopHub
      </div>

      {/* 2. Ở giữa: Thanh tìm kiếm (Search Bar) */}
      <div style={{ flex: 2, textAlign: 'center' }}>
        <input 
          type="text" 
          placeholder="Search product..." 
          style={{
            width: '60%',
            padding: '8px 15px',
            borderRadius: '20px',
            border: 'none',
            outline: 'none',
            fontSize: '14px'
          }} 
        />
      </div>

      {/* 3. Bên phải: Nút Giỏ hàng và Avatar */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px' }}>
        <button style={{
          background: 'none',
          border: 'none',
          color: '#fff',
          fontSize: '18px',
          cursor: 'pointer'
        }}>
          🛒 Cart
        </button>
        <div style={{
          width: '35px',
          height: '35px',
          borderRadius: '50%',
          backgroundColor: '#3498db',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          U
        </div>
      </div>
    </header>
  );
};

export default Header;