import React from 'react';

const Banner = () => {
  return (
    <div style={{
      backgroundColor: '#34495e', // Màu nền xanh xám hiện đại giống mẫu của thầy
      color: '#ffffff',
      padding: '50px 40px',
      textAlign: 'left', // Căn lề trái cho giống các trang thương mại điện tử
      fontFamily: 'Arial, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ maxWidth: '600px' }}>
        <h1 style={{ fontSize: '36px', margin: '0 0 10px 0', fontWeight: 'bold' }}>
          Welcome to ShopHub!
        </h1>
        <p style={{ fontSize: '16px', margin: '0 0 20px 0', color: '#bdc3c7' }}>
          Discover the best products at the unbeatable prices. Shop the latest trends now!
        </p>
        <button style={{
          backgroundColor: '#3498db',
          color: '#ffffff',
          border: 'none',
          padding: '10px 25px',
          fontSize: '16px',
          fontWeight: 'bold',
          borderRadius: '5px',
          cursor: 'pointer',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }}>
          Shop Now →
        </button>
      </div>
    </div>
  );
};

export default Banner;