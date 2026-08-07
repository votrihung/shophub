import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function OrderPaymentPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState('vnpay');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Sửa key token cho khớp với App.jsx
      const token = localStorage.getItem('shophub_token'); 
      const headers = { Authorization: `Bearer ${token}` };

      let response;
      if (provider === 'vnpay') {
        response = await axios.post(
          'https://shophub-production-c481.up.railway.app/payments/vnpay/create-url',
          { order_id: parseInt(orderId) },
          { headers }
        );
        window.location.href = response.data.url; 

      } else if (provider === 'stripe') {
        response = await axios.post(
          'https://shophub-production-c481.up.railway.app/payments/stripe/create-session',
          { order_id: parseInt(orderId) },
          { headers }
        );
        window.location.href = response.data.url; 

      } else if (provider === 'paypal') {
        response = await axios.post(
          'https://shophub-production-c481.up.railway.app/payments/paypal/create-order',
          { order_id: parseInt(orderId) },
          { headers }
        );
        window.location.href = response.data.approve_url; 
      }
    } catch (error) {
      alert(error.response?.data?.detail || 'Có lỗi xảy ra khi tạo thanh toán!');
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '24px', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Thanh Toán Đơn Hàng #{orderId}</h2>
      <p style={{ color: '#64748b', marginBottom: '20px' }}>Vui lòng chọn phương thức thanh toán:</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '10px', border: '1px solid #f1f5f9', borderRadius: '8px' }}>
          <input
            type="radio"
            name="payment"
            value="vnpay"
            checked={provider === 'vnpay'}
            onChange={(e) => setProvider(e.target.value)}
          />
          <b>VNPay Sandbox</b> (Thẻ ATM/QR)
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '10px', border: '1px solid #f1f5f9', borderRadius: '8px' }}>
          <input
            type="radio"
            name="payment"
            value="stripe"
            checked={provider === 'stripe'}
            onChange={(e) => setProvider(e.target.value)}
          />
          <b>Stripe</b> (Thẻ Quốc tế Visa/Mastercard)
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '10px', border: '1px solid #f1f5f9', borderRadius: '8px' }}>
          <input
            type="radio"
            name="payment"
            value="paypal"
            checked={provider === 'paypal'}
            onChange={(e) => setProvider(e.target.value)}
          />
          <b>PayPal Sandbox</b>
        </label>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '15px'
        }}
      >
        {loading ? 'Đang chuyển hướng...' : 'Thanh Toán Ngay'}
      </button>
    </div>
  );
}