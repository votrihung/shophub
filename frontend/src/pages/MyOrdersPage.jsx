import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('shophub_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Gọi trực tiếp endpoint /orders/history đã có sẵn trong orders.py
        const response = await axios.get('https://shophub-production-c481.up.railway.app/orders/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data || []);
      } catch (err) {
        console.error("Lỗi tải lịch sử đơn hàng:", err);
        setError("Không thể tải danh sách đơn hàng. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const getStatusBadge = (status) => {
    const statusMap = {
      PLACED: { text: 'Đã đặt hàng', bg: '#dbeafe', color: '#1e40af' },
      PROCESSING: { text: 'Đang xử lý', bg: '#fef3c7', color: '#92400e' },
      COMPLETED: { text: 'Hoàn thành', bg: '#dcfce7', color: '#166534' },
      CANCELED: { text: 'Đã hủy', bg: '#fee2e2', color: '#991b1b' }
    };
    const config = statusMap[status] || { text: status, bg: '#f1f5f9', color: '#475569' };
    return (
      <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', backgroundColor: config.bg, color: config.color }}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>⏳ Đang tải lịch sử đơn hàng...</div>;
  }

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto', padding: '40px 16px', fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px', color: '#1e293b' }}>
        📦 Lịch Sử Đơn Hàng Của Bạn
      </h2>

      {error && <div style={{ color: '#ef4444', marginBottom: '16px', fontWeight: 'bold' }}>{error}</div>}

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '48px' }}>🛍️</span>
          <p style={{ color: '#64748b', margin: '16px 0 20px 0' }}>Bạn chưa có đơn hàng nào trên hệ thống.</p>
          <button onClick={() => navigate('/products')} style={{ padding: '12px 24px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
            Khám phá sản phẩm ngay
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map(order => (
            <div key={order.id} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              
              {/* Thông tin chung của đơn hàng */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontWeight: '800', fontSize: '16px', color: '#0f172a' }}>Đơn hàng #{order.id}</span>
                  <span style={{ fontSize: '13px', color: '#64748b', marginLeft: '12px' }}>
                    {order.created_at ? new Date(order.created_at).toLocaleString('vi-VN') : '---'}
                  </span>
                </div>
                {getStatusBadge(order.status)}
              </div>

              {/* Thông tin giao hàng */}
              <div style={{ fontSize: '13.5px', color: '#334155', backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', lineHeight: '1.6' }}>
                <p style={{ margin: 0 }}><strong>Người nhận:</strong> {order.customer_name || 'Khách lẻ'} ({order.phone || '---'})</p>
                <p style={{ margin: 0 }}><strong>Địa chỉ giao:</strong> {order.shipping_address || 'Chưa cung cấp'}</p>
              </div>

              {/* Danh sách sản phẩm trong đơn */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                {order.items && order.items.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', borderBottom: '1px dashed #f1f5f9', paddingBottom: '10px' }}>
                    <img 
                      src={item.image_url || 'https://via.placeholder.com/60'} 
                      alt={item.product_name} 
                      style={{ width: '60px', height: '60px', objectFit: 'contain', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }} 
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{item.product_name}</h4>
                      <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                        {item.quantity} x <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{Number(item.product_price).toLocaleString('vi-VN')}đ</span>
                      </p>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>
                      {Number(item.line_total).toLocaleString('vi-VN')}đ
                    </div>
                  </div>
                ))}
              </div>

              {/* Tổng thanh toán */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>Tổng giá trị đơn hàng:</span>
                <span style={{ fontSize: '20px', fontWeight: '800', color: '#ef4444' }}>
                  {Number(order.total_amount).toLocaleString('vi-VN')}đ
                </span>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;