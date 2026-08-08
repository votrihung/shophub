import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProductReviews } from '../api/ordersApi';

const BACKEND_URL = 'https://shophub-production-c481.up.railway.app';

const getImageUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/150';
  if (url.includes('localhost:5000')) {
    return url.replace('http://localhost:5000', BACKEND_URL);
  }
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `${BACKEND_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  }
  return url;
};

const ProductCard = ({ product, quantity, onDelete }) => {
  const { addToCart, updateQuantity, removeFromCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [activeBtn, setActiveBtn] = useState(null);
  const [isDeleteHovered, setIsDeleteHovered] = useState(false);

  const [realRating, setRealRating] = useState({ rating: 0, count: 0 });

  const rawUser = localStorage.getItem('shophub_user');
  const userObj = rawUser ? JSON.parse(rawUser) : null;
  const isAdmin = userObj?.role === 'ADMIN';

  useEffect(() => {
    let isMounted = true;

    if (product?.id) {
      getProductReviews(product.id)
        .then((revs) => {
          if (!isMounted) return;
          const reviewList = revs || [];
          if (reviewList.length > 0) {
            const total = reviewList.reduce((sum, r) => sum + Number(r.rating || 0), 0);
            setRealRating({
              rating: total / reviewList.length,
              count: reviewList.length,
            });
          } else {
            setRealRating({ rating: 0, count: 0 });
          }
        })
        .catch(() => {
          if (isMounted) setRealRating({ rating: 0, count: 0 });
        });
    }

    return () => {
      isMounted = false;
    };
  }, [product?.id]);

  const handleDecrease = () => {
    if (quantity <= 1) {
      removeFromCart(product.id);
    } else {
      updateQuantity(product.id, quantity - 1);
    }
  };

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
        border: isHovered ? '1px solid #3b82f6' : '1px solid #e2e8f0',
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
          ? '0 12px 24px -4px rgba(59, 130, 246, 0.15), 0 4px 12px -2px rgba(0, 0, 0, 0.04)' 
          : '0 2px 4px rgba(0,0,0,0.02)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative'
      }}
    >
      <span style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        backgroundColor: '#ef4444',
        color: '#fff',
        fontSize: '11px',
        fontWeight: 'bold',
        padding: '3px 8px',
        borderRadius: '6px',
        zIndex: 1
      }}>
        🔥 Nổi bật
      </span>

      <Link to={`/products/${product.id}`} style={{ display: 'block', width: '100%', cursor: 'pointer', textDecoration: 'none' }}>
        <div style={{
          width: '100%',
          height: '160px', 
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
            src={getImageUrl(product.imageUrl || product.image || product.image_url)} 
            alt={product.name} 
            style={{
              maxWidth: '85%',
              maxHeight: '85%',
              width: 'auto',
              height: 'auto',
              margin: '0 auto',
              display: 'block',
              objectFit: 'contain',
              transform: isHovered ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        </div>
      </Link>

      <div style={{ flexGrow: 1, marginBottom: '14px', width: '100%' }}>
        <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{ 
            fontSize: '16px', 
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
          margin: '0 0 8px 0',
          display: '-webkit-box',
          WebkitLineClamp: '2',
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          height: '36px'
        }}>
          {product.description || 'Hàng chính hãng VN/A'}
        </p>

        {/* Khối Đánh Giá Thật */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '4px', 
          margin: '4px 0 8px 0',
          fontSize: '13px',
          minHeight: '20px'
        }}>
          {realRating.rating > 0 ? (
            <>
              <span style={{ color: '#f59e0b' }}>⭐</span>
              <span style={{ fontWeight: '700', color: '#1e293b' }}>
                {realRating.rating.toFixed(1)}
              </span>
              <span style={{ color: '#64748b' }}>/5.0</span>
              {realRating.count > 0 && (
                <span style={{ color: '#94a3b8', fontSize: '12px', marginLeft: '2px' }}>
                  ({realRating.count})
                </span>
              )}
            </>
          ) : (
            <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '12px' }}>
              Chưa có đánh giá
            </span>
          )}
        </div>

        <p style={{ fontSize: '18px', fontWeight: '800', color: '#ef4444', margin: '0' }}>
          {product.price?.toLocaleString('vi-VN')}đ
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginTop: 'auto', width: '100%' }}>
        
        {quantity === 0 ? (
          <button
            onClick={handleIncrease}
            style={{
              width: '100%',
              padding: '10px 16px',
              backgroundColor: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 10px rgba(37, 99, 235, 0.2)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          >
            🛒 Thêm vào giỏ
          </button>
        ) : (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            width: '100%',
            backgroundColor: '#f1f5f9',
            borderRadius: '10px',
            padding: '4px 8px'
          }}>
            <button 
              onClick={handleDecrease}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#fff',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px',
                color: '#475569',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              -
            </button>

            <span style={{ fontSize: '15px', fontWeight: '800', color: '#2563eb' }}>
              {quantity} trong giỏ
            </span>

            <button 
              onClick={handleIncrease}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#2563eb',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              +
            </button>
          </div>
        )}

        {isAdmin && (
          <button
            onClick={() => onDelete && onDelete(product.id)}
            onMouseEnter={() => setIsDeleteHovered(true)}
            onMouseLeave={() => setIsDeleteHovered(false)}
            style={{
              width: '100%',
              padding: '6px 12px',
              marginTop: '4px',
              backgroundColor: isDeleteHovered ? '#dc2626' : '#fee2e2',
              color: isDeleteHovered ? '#fff' : '#ef4444',
              border: 'none',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
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