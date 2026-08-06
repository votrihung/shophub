import React from 'react';
import { Link } from 'react-router-dom';

export default function OrderSuccess() {
  return (
    <div style={{
      minHeight: '65vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center'
    }}>
      <div style={{
        backgroundColor: '#e6f4ea',
        borderRadius: '50%',
        width: '90px',
        height: '90px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px',
        fontSize: '48px',
        color: '#137333'
      }}>
        ✓
      </div>

      <h1 style={{ color: '#137333', fontSize: '2.2rem', marginBottom: '12px', fontWeight: '700' }}>
        Thanh toán thành công!
      </h1>

      <p style={{ color: '#5f6368', fontSize: '1.1rem', marginBottom: '32px', maxWidth: '500px', lineHeight: '1.6' }}>
        Cảm ơn bạn đã mua sắm tại <strong>ShopHub</strong>. Đơn hàng của bạn đã được xác nhận và hệ thống đang chuẩn bị hàng.
      </p>

      <div style={{ display: 'flex', gap: '16px' }}>
        <Link
          to="/"
          style={{
            padding: '12px 28px',
            backgroundColor: '#1a73e8',
            color: '#ffffff',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600',
            boxShadow: '0 2px 6px rgba(26,115,232,0.3)'
          }}
        >
          Trang chủ
        </Link>
        <Link
          to="/history"
          style={{
            padding: '12px 28px',
            backgroundColor: '#f1f3f4',
            color: '#3c4043',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600',
            border: '1px solid #dadce0'
          }}
        >
          Lịch sử đơn hàng
        </Link>
      </div>
    </div>
  );
}