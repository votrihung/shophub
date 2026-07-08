// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#2c3e50', // Màu tối đồng bộ với Header
      color: '#ffffff',
      padding: '30px 40px 15px 40px',
      fontFamily: 'Arial, sans-serif',
      marginTop: '40px'
    }}>
      {/* Giữ chữ nằm gọn trong khung 1200px dóng thẳng hàng với body */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Chia các cột thông tin */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <h3 style={{ fontSize: '18px', margin: '0 0 10px 0', color: '#3498db' }}>🛍️ ShopHub</h3>
            <p style={{ color: '#bdc3c7', lineHeight: '1.5' }}>Your one-stop destination for all your shopping needs. Quality guaranteed.</p>
          </div>
          
          <div style={{ flex: '1', minWidth: '200px' }}>
            <h3 style={{ fontSize: '16px', margin: '0 0 10px 0' }}>About Us</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#bdc3c7', lineHeight: '1.8' }}>
              <li>Careers</li>
              <li>Our Stores</li>
              <li>Terms & Conditions</li>
            </ul>
          </div>

          <div style={{ flex: '1', minWidth: '200px' }}>
            <h3 style={{ fontSize: '16px', margin: '0 0 10px 0' }}>Contact</h3>
            <p style={{ color: '#bdc3c7', margin: '5px 0' }}>📍 123 Street, Ho Chi Minh City</p>
            <p style={{ color: '#bdc3c7', margin: '5px 0' }}>✉️ support@shophub.com</p>
          </div>
        </div>

        {/* Đường gạch ngang phân cách và dòng Copyright */}
        <div style={{
          borderTop: '1px solid #4f5d73',
          paddingTop: '15px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#95a5a6'
        }}>
          &copy; {new Date().getFullYear()} ShopHub Project. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;