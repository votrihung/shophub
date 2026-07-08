// src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // 🌟 Import thêm dòng này để chuyển trang mượt mà

const ProductCard = ({ product, quantity, onUpdateCart }) => {
  return (
    <div style={{
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '15px',
      backgroundColor: '#fff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'between',
      alignItems: 'center',
      textAlign: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
      height: '100%',
      boxSizing: 'border-box'
    }}>
      
      {/* 🌟 1. BỌC LINK CHO KHUNG CHỨA ẢNH */}
      <Link to={`/products/${product.id}`} style={{ display: 'block', width: '100%', cursor: 'pointer' }}>
        <div style={{
          width: '100%',
          height: '140px', 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '10px',
          overflow: 'hidden',
          backgroundColor: '#f8fafc',
          borderRadius: '8px'
        }}>
          <img 
            src={product.imageUrl || product.image || 'https://via.placeholder.com/150'} 
            alt={product.name} 
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain'
            }}
          />
        </div>
      </Link>

      {/* THÔNG TIN CHI TIẾT */}
      <div style={{ flexGrow: 1, marginBottom: '10px', width: '100%' }}>
        
        {/* 🌟 2. BỌC LINK CHO TÊN SẢN PHẨM */}
        <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{ 
            fontSize: '15px', 
            fontWeight: 'bold', 
            color: '#1e293b', 
            margin: '0 0 4px 0',
            cursor: 'pointer'
          }}>
            {product.name}
          </h3>
        </Link>

        <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 8px 0' }}>
          {product.description || 'Hàng chính hãng VN/A'}
        </p>
        <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#ef4444', margin: '0' }}>
          {product.price?.toLocaleString('vi-VN')}đ
        </p>
      </div>

      {/* BỘ NÚT TĂNG GIẢM SỐ LƯỢNG - GIỮ NGUYÊN BẢN GỐC CỦA BÁC */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto' }}>
        <button 
          onClick={() => onUpdateCart(product.id, -1)}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            border: '1px solid #cbd5e1',
            backgroundColor: '#fff',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          -
        </button>
        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#334155', minWidth: '15px' }}>{quantity}</span>
        <button 
          onClick={() => onUpdateCart(product.id, 1)}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            border: '1px solid #cbd5e1',
            backgroundColor: '#fff',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ProductCard;