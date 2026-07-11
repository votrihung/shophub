// src/components/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, quantity, onUpdateCart }) => {
  // Trạng thái hover cho toàn bộ Card và nút bấm để điều khiển hiệu ứng mượt mà
  const [isHovered, setIsHovered] = useState(false);
  const [activeBtn, setActiveBtn] = useState(null); // 'minus' hoặc 'plus'

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setActiveBtn(null);
      }}
      style={{
        border: isHovered ? '1px solid #93c5fd' : '1px solid #e2e8f0',
        borderRadius: '16px', // Bo góc mềm mại hơn chuẩn UI hiện đại
        padding: '16px',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        textAlign: 'center',
        height: '100%',
        boxSizing: 'border-box',
        // EFFECT 1: Rà chuột vào card sẽ nổi lên 3D và đổ bóng lan rộng cực mượt
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? '0 12px 24px -4px rgba(147, 197, 253, 0.15), 0 4px 12px -2px rgba(0, 0, 0, 0.04)' 
          : '0 2px 4px rgba(0,0,0,0.01)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      
      {/* 🌟 1. BỌC LINK CHO KHUNG CHỨA ẢNH */}
      <Link to={`/products/${product.id}`} style={{ display: 'block', width: '100%', cursor: 'pointer', textDecoration: 'none' }}>
        <div style={{
          width: '100%',
          height: '150px', 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '14px',
          overflow: 'hidden',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          transition: 'background-color 0.3s'
        }}>
          <img 
            src={product.imageUrl || product.image || 'https://via.placeholder.com/150'} 
            alt={product.name} 
            style={{
              maxWidth: '85%',
              maxHeight: '85%',
              objectFit: 'contain',
              // EFFECT 2: Ảnh tự động zoom nhẹ phóng to 5% cực xịn khi hover vào card
              transform: isHovered ? 'scale(1.06)' : 'scale(1)',
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        </div>
      </Link>

      {/* THÔNG TIN CHI TIẾT */}
      <div style={{ flexGrow: 1, marginBottom: '14px', width: '100%' }}>
        
        {/* 🌟 2. BỌC LINK CHO TÊN SẢN PHẨM */}
        <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{ 
            fontSize: '15.5px', 
            fontWeight: '700', 
            color: isHovered ? '#2563eb' : '#1e293b', // Đổi chữ sang xanh dương khi hover
            margin: '0 0 6px 0',
            cursor: 'pointer',
            lineHeight: '1.4',
            transition: 'color 0.2s'
          }}>
            {product.name}
          </h3>
        </Link>

        <p style={{ 
          fontSize: '12.5px', 
          color: '#64748b', 
          margin: '0 0 10px 0',
          display: '-webkit-box',
          WebkitLineClamp: '2',
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          height: '36px' // Giữ layout các card đều tăm tắp
        }}>
          {product.description || 'Hàng chính hãng VN/A'}
        </p>
        
        <p style={{ fontSize: '17px', fontWeight: '800', color: '#ef4444', margin: '0', trackingTight: '-0.5px' }}>
          {product.price?.toLocaleString('vi-VN')}đ
        </p>
      </div>

      {/* BỘ NÚT TĂNG GIẢM SỐ LƯỢNG - THÊM HIỆU ỨNG LÚN NÚT VÀ ĐỔI MÀU NỀN */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: 'auto' }}>
        <button 
          onClick={() => onUpdateCart(product.id, -1)}
          onMouseDown={() => setActiveBtn('minus')}
          onMouseUp={() => setActiveBtn(null)}
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            border: '1px solid #cbd5e1',
            backgroundColor: activeBtn === 'minus' ? '#f1f5f9' : '#fff',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            color: '#475569',
            // EFFECT 3: Bấm nút trừ co lại nhẹ tạo phản hồi cơ học
            transform: activeBtn === 'minus' ? 'scale(0.9)' : 'scale(1)',
            boxShadow: activeBtn === 'minus' ? 'none' : '0 2px 4px rgba(0,0,0,0.02)',
            transition: 'all 0.15s ease',
            outline: 'none'
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.backgroundColor = '#f8fafc'; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.backgroundColor = '#fff'; }}
        >
          -
        </button>

        <span style={{ 
          fontSize: '15px', 
          fontWeight: '800', 
          color: quantity > 0 ? '#2563eb' : '#475569', // Nhảy màu xanh nổi bật khi số lượng > 0
          minWidth: '20px',
          transition: 'color 0.2s'
        }}>
          {quantity}
        </span>

        <button 
          onClick={() => onUpdateCart(product.id, 1)}
          onMouseDown={() => setActiveBtn('plus')}
          onMouseUp={() => setActiveBtn(null)}
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            border: '1px solid #cbd5e1',
            backgroundColor: activeBtn === 'plus' ? '#f1f5f9' : '#fff',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            color: '#475569',
            // EFFECT 4: Bấm nút cộng co lại nhẹ tạo phản hồi cơ học
            transform: activeBtn === 'plus' ? 'scale(0.9)' : 'scale(1)',
            boxShadow: activeBtn === 'plus' ? 'none' : '0 2px 4px rgba(0,0,0,0.02)',
            transition: 'all 0.15s ease',
            outline: 'none'
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.backgroundColor = '#f8fafc'; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.backgroundColor = '#fff'; }}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ProductCard;