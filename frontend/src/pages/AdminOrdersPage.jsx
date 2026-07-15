import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const token = localStorage.getItem('shophub_token');
        const response = await axios.get('http://localhost:8000/orders/admin/all', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setOrders(response.data);
      } catch (err) {
        console.error("Lỗi lấy toàn bộ đơn hàng (Admin):", err);
        setError(err.response?.data?.detail || err.response?.data?.message || "Bạn không có quyền truy cập trang này.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'COMPLETED':
        return { bg: '#dcfce7', color: '#166534', text: 'Hoàn thành' };
      case 'CANCELED':
        return { bg: '#fee2e2', color: '#991b1b', text: 'Đã hủy' };
      case 'PROCESSING':
        return { bg: '#e0f2fe', color: '#0369a1', text: 'Đang xử lý' };
      case 'PLACED':
      default:
        return { bg: '#fef3c7', color: '#92400e', text: 'Chờ xác nhận' };
    }
  };

  const filteredOrders = orders.filter((order) => {
    const orderIdStr = String(order.id);
    return orderIdStr.includes(searchTerm.trim());
  });

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', fontFamily: 'system-ui, sans-serif' }}>
        <p style={{ fontSize: '16px', color: '#64748b' }}>⏳ Đang tải danh sách đơn hàng hệ thống...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 16px', fontFamily: 'system-ui, sans-serif', color: '#1e293b', minHeight: '60vh' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px', color: '#0f172a' }}>⚙️ Admin – Quản Lý Đơn Hàng</h2>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="🔍 Nhập mã đơn hàng để tìm kiếm (ví dụ: 9, 8...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            fontSize: '14px',
            outline: 'none',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}
        />
      </div>

      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px' }}>
          ❌ {error}
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#64748b', fontStyle: 'italic' }}>Không tìm thấy đơn hàng nào phù hợp với mã tìm kiếm.</p>
        </div>
      ) : (
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '16px', fontWeight: '700' }}>Mã Đơn</th>
                <th style={{ padding: '16px', fontWeight: '700' }}>Ngày Đặt</th>
                <th style={{ padding: '16px', fontWeight: '700' }}>Sản Phẩm Đã Mua</th>
                <th style={{ padding: '16px', fontWeight: '700' }}>Tổng Tiền</th>
                <th style={{ padding: '16px', fontWeight: '700' }}>Trạng Thái</th>
                <th style={{ padding: '16px', fontWeight: '700', textAlign: 'center' }}>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const statusStyle = getStatusStyle(order.status);
                return (
                  <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <td style={{ padding: '16px', fontWeight: 'bold', color: '#3b82f6' }}>#{order.id}</td>
                    <td style={{ padding: '16px', color: '#64748b' }}>
                      {new Date(order.created_at).toLocaleString('vi-VN')}
                    </td>
                    <td style={{ padding: '16px', maxWidth: '300px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item) => (
                            <div key={item.id} style={{ fontSize: '13px', color: '#334155' }}>
                              • <strong>{item.product_name}</strong> <span style={{ color: '#64748b' }}>(x{item.quantity})</span>
                            </div>
                          ))
                        ) : (
                          <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Không có thông tin</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 'bold', color: '#ef4444' }}>
                      {Number(order.total_amount).toLocaleString('vi-VN')}đ
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.color
                      }}>
                        {statusStyle.text}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <button 
                        onClick={() => navigate(`/admin/orders/${order.id}`)} 
                        style={{ padding: '6px 14px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
                      >
                        Xử lý đơn 🛠️
                      </button>
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

export default AdminOrdersPage;