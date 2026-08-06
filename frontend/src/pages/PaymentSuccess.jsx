import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '65vh',
      padding: '24px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '40px 32px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
        textAlign: 'center',
        maxWidth: '460px',
        width: '100%',
        border: '1px solid #f1f5f9'
      }}>
        {/* Icon Tích xanh thành công */}
        <div style={{
          width: '72px',
          height: '72px',
          backgroundColor: '#dcfce7',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto'
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        <h1 style={{
          fontSize: '26px',
          fontWeight: '700',
          color: '#0f172a',
          marginBottom: '8px'
        }}>
          Thanh Toán Thành Công!
        </h1>

        <p style={{
          color: '#64748b',
          fontSize: '15px',
          lineHeight: '1.6',
          marginBottom: '32px'
        }}>
          Cảm ơn bạn đã mua sắm tại <strong>ShopHub</strong>. Đơn hàng của bạn đã được tiếp nhận và xử lý thành công.
        </p>

        {/* Nút điều hướng */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => navigate('/products')}
            style={{
              width: '100%',
              padding: '12px 20px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            🛍️ Tiếp tục mua sắm
          </button>

          <button
            onClick={() => navigate('/orders/history')}
            style={{
              width: '100%',
              padding: '12px 20px',
              backgroundColor: '#f8fafc',
              color: '#334155',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            📋 Xem lịch sử đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;