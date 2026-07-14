import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, quantity, onDelete }) => {
  const { addToCart, updateQuantity, removeFromCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [activeBtn, setActiveBtn] = useState(null);
  const [isDeleteHovered, setIsDeleteHovered] = useState(false);

  const rawUser = localStorage.getItem('shophub_user');
  const userObj = rawUser ? JSON.parse(rawUser) : null;
  const isAdmin = userObj?.role === 'ADMIN';

  // Nhấn nút Trừ (-)
  const handleDecrease = () => {
    if (quantity <= 1) {
      removeFromCart(product.id);
    } else {
      updateQuantity(product.id, quantity - 1);
    }
  };

  // Nhấn nút Cộng (+)
  const handleIncrease = () => {
    addToCart(product, 1);
  };

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setActiveBtn(null);
      }}
      style={{
        border: isHovered ? '1px solid #93c5fd' : '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '16px',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        textAlign: 'center',
        height: '100%',
        boxSizing: 'border-box',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? '0 12px 24px -4px rgba(147, 197, 253, 0.15), 0 4px 12px -2px rgba(0, 0, 0, 0.04)' 
          : '0 2px 4px rgba(0,0,0,0.01)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      
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
              transform: isHovered ? 'scale(1.06)' : 'scale(1)',
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        </div>
      </Link>

      <div style={{ flexGrow: 1, marginBottom: '14px', width: '100%' }}>
        <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{ 
            fontSize: '15.5px', 
            fontWeight: '700', 
            color: isHovered ? '#2563eb' : '#1e293b',
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
          height: '36px'
        }}>
          {product.description || 'Hàng chính hãng VN/A'}
        </p>
        
        <p style={{ fontSize: '17px', fontWeight: '800', color: '#ef4444', margin: '0' }}>
          {product.price?.toLocaleString('vi-VN')}đ
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: 'auto', width: '100%' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button 
            onClick={handleDecrease}
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
            color: quantity > 0 ? '#2563eb' : '#475569',
            minWidth: '20px',
            transition: 'color 0.2s'
          }}>
            {quantity}
          </span>

          <button 
            onClick={handleIncrease}
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

        {isAdmin && (
          <button
            onClick={() => onDelete && onDelete(product.id)}
            onMouseEnter={() => setIsDeleteHovered(true)}
            onMouseLeave={() => setIsDeleteHovered(false)}
            style={{
              width: '100%',
              padding: '8px 12px',
              marginTop: '4px',
              backgroundColor: isDeleteHovered ? '#dc2626' : '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '12.5px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: isDeleteHovered ? '0 4px 6px -1px rgba(239, 68, 68, 0.2)' : 'none',
              transform: isDeleteHovered ? 'scale(1.02)' : 'scale(1)',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
          >
            🗑️ Xóa Sản Phẩm
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;