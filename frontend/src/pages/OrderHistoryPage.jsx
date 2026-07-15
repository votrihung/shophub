import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const token = localStorage.getItem('shophub_token');
        const response = await axios.get('http://localhost:8000/orders/history', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setOrders(response.data);
      } catch (err) {
        console.error("Lỗi lấy lịch sử đơn hàng:", err);
        setError(err.response?.data?.detail || "Không thể tải lịch sử đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  const getStatusBadgeData = (status) => {
    const baseStyle = {
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold',
      display: 'inline-block'
    };
    
    switch (status) {
      case 'PLACED':
        return { style: { ...baseStyle, backgroundColor: '#dbeafe', color: '#1e40af' }, text: 'Chờ xác nhận' };
      case 'PROCESSING':
        return { style: { ...baseStyle, backgroundColor: '#fef3c7', color: '#92400e' }, text: 'Đang xử lý' };
      case 'SHIPPED':
        return { style: { ...baseStyle, backgroundColor: '#f3e8ff', color: '#6b21a8' }, text: 'Đang giao hàng' };
      case 'COMPLETED':
        return { style: { ...baseStyle, backgroundColor: '#dcfce7', color: '#166534' }, text: 'Hoàn thành' };
      case 'CANCELED':
        return { style: { ...baseStyle, backgroundColor: '#fee2e2', color: '#991b1b' }, text: 'Đã hủy' };
      default:
        return { style: { ...baseStyle, backgroundColor: '#f1f5f9', color: '#475569' }, text: status };
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', fontFamily: 'system-ui, sans-serif' }}>
        <p style={{ fontSize: '16px', color: '#64748b' }}>⏳ Đang tải lịch sử đơn hàng của bạn...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 16px', fontFamily: 'system-ui, sans-serif', color: '#1e293b', minHeight: '60vh' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px' }}>📋 Lịch Sử Đơn Hàng</h2>

      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px' }}>
          ❌ {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '50px' }}>📦</span>
          <p style={{ color: '#64748b', margin: '16px 0 24px 0', fontStyle: 'italic' }}>Bạn chưa đặt bất kỳ đơn hàng nào.</p>
          <button onClick={() => navigate('/products')} style={{ padding: '12px 24px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
            Mua sắm ngay 🛒
          </button>
        </div>
      ) : (
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '16px', fontWeight: '700' }}>Mã Đơn Hàng</th>
                <th style={{ padding: '16px', fontWeight: '700' }}>Ngày Đặt</th>
                <th style={{ padding: '16px', fontWeight: '700' }}>Sản Phẩm</th>
                <th style={{ padding: '16px', fontWeight: '700', textAlign: 'right' }}>Tổng Thanh Toán</th>
                <th style={{ padding: '16px', fontWeight: '700', textAlign: 'center' }}>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const badge = getStatusBadgeData(order.status);
                return (
                  <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <td style={{ padding: '16px', fontWeight: 'bold', color: '#3b82f6' }}>#{order.id}</td>
                    <td style={{ padding: '16px', color: '#64748b' }}>
                      {new Date(order.created_at).toLocaleString('vi-VN')}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item) => (
                            <div key={item.id} style={{ fontSize: '13px', color: '#1e293b' }}>
                              • <span style={{ fontWeight: '600' }}>{item.product_name}</span> 
                              <span style={{ color: '#64748b', marginLeft: '6px' }}>(x{item.quantity})</span>
                            </div>
                          ))
                        ) : (
                          <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '12px' }}>Không có thông tin</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 'bold', color: '#ef4444', textAlign: 'right' }}>
                      {Number(order.total_amount).toLocaleString('vi-VN')}đ
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <span style={badge.style}>
                        {badge.text}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;