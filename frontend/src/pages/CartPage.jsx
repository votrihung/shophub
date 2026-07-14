import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    totalQuantity, 
    totalPrice, 
    clearCart 
  } = useCart();

  const [hoveredBtn, setHoveredBtn] = useState(null);

  if (items.length === 0) {
    return (
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif', textAlign: 'center' }}>
        <div style={{ padding: '60px 20px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🛒</span>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 8px 0' }}>Giỏ hàng trống</h2>
          <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '15px' }}>Chưa có sản phẩm nào trong giỏ hàng của sốp cả.</p>
          <Link 
            to="/products" 
            style={{ 
              display: 'inline-block', 
              padding: '12px 24px', 
              backgroundColor: '#2563eb', 
              color: '#fff', 
              textDecoration: 'none', 
              borderRadius: '8px', 
              fontWeight: '600',
              boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
              transition: 'all 0.2s ease'
            }}
          >
            Mua Sắm Ngay
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>Giỏ Hàng Của Bạn</h2>
      <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '24px' }}>
        Tổng số lượng: <strong style={{ color: '#1e293b' }}>{totalQuantity}</strong> sản phẩm | Tổng tiền: <strong style={{ color: '#ef4444' }}>{totalPrice?.toLocaleString('vi-VN')}đ</strong>
      </p>

      <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '16px 24px', color: '#475569', fontWeight: '600', fontSize: '14px' }}>Sản phẩm</th>
              <th style={{ padding: '16px 24px', color: '#475569', fontWeight: '600', fontSize: '14px', textAlign: 'center' }}>Đơn giá</th>
              <th style={{ padding: '16px 24px', color: '#475569', fontWeight: '600', fontSize: '14px', textAlign: 'center' }}>Số lượng</th>
              <th style={{ padding: '16px 24px', color: '#475569', fontWeight: '600', fontSize: '14px', textAlign: 'center' }}>Thành tiền</th>
              <th style={{ padding: '16px 24px', color: '#475569', fontWeight: '600', fontSize: '14px', textAlign: 'center' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img
                      src={item.imageUrl || 'https://via.placeholder.com/60'}
                      alt={item.name}
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'contain',
                        borderRadius: '8px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #f1f5f9',
                        padding: '4px'
                      }}
                    />
                    <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '15px' }}>{item.name}</span>
                  </div>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'center', color: '#475569', fontWeight: '500' }}>
                  {item.price?.toLocaleString('vi-VN')}đ
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid #cbd5e1', borderRadius: '20px', padding: '4px 8px' }}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    >
                      -
                    </button>
                    <span style={{ fontWeight: '700', color: '#1e293b', minWidth: '20px', textAlign: 'center', fontSize: '14px' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'center', color: '#ef4444', fontWeight: '700' }}>
                  {(item.price * item.quantity)?.toLocaleString('vi-VN')}đ
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    onMouseEnter={() => setHoveredBtn(`remove-${item.id}`)}
                    onMouseLeave={() => setHoveredBtn(null)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: hoveredBtn === `remove-${item.id}` ? '#fee2e2' : '#fef2f2',
                      color: '#ef4444',
                      border: '1px solid #fee2e2',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={clearCart}
          onMouseEnter={() => setHoveredBtn('clear')}
          onMouseLeave={() => setHoveredBtn(null)}
          style={{
            padding: '10px 20px',
            backgroundColor: hoveredBtn === 'clear' ? '#e2e8f0' : '#f1f5f9',
            color: '#475569',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Xóa Sạch Giỏ Hàng
        </button>
        
        <button
          onClick={() => alert('Chức năng thanh toán đang được phát triển!')}
          onMouseEnter={() => setHoveredBtn('checkout')}
          onMouseLeave={() => setHoveredBtn(null)}
          style={{
            padding: '10px 24px',
            backgroundColor: hoveredBtn === 'checkout' ? '#059669' : '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)',
            transition: 'all 0.2s ease'
          }}
        >
          Thanh Toán (Mock)
        </button>
      </div>
    </section>
  );
};

export default CartPage;