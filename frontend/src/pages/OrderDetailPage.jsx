import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ALLOWED_STATUSES = ['PLACED', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELED'];

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  // Kiểm tra xem User hiện tại có phải là Admin hay không
  const isAdmin = user?.role === 'ADMIN';

  const fetchOrderDetail = async () => {
    try {
      const token = localStorage.getItem('shophub_token');
      const response = await axios.get(`http://localhost:8000/orders/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setOrder(response.data);
    } catch (err) {
      console.error("Lỗi lấy chi tiết đơn hàng:", err);
      setError(err.response?.data?.detail || "Không thể tải chi tiết đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  // ADMIN: Thay đổi trạng thái đơn hàng
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setUpdating(true);
    try {
      const token = localStorage.getItem('shophub_token');
      const response = await axios.patch(
        `http://localhost:8000/orders/${id}/status`,
        { status: newStatus },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setOrder(response.data);
      alert("🎉 Cập nhật trạng thái đơn hàng thành công!");
    } catch (err) {
      alert(err.response?.data?.detail || "Lỗi khi cập nhật trạng thái.");
    } finally {
      setUpdating(false);
    }
  };

  // ADMIN: Thay đổi số lượng item trực tiếp trong đơn hàng
  const handleAdminUpdateQuantity = async (itemId, currentQty, increment) => {
    const newQty = currentQty + increment;
    if (newQty <= 0) {
      alert("Số lượng phải lớn hơn 0! Nếu muốn xóa món này, hãy hủy đơn hoặc cập nhật sau.");
      return;
    }
    
    setUpdating(true);
    try {
      const token = localStorage.getItem('shophub_token');
      const response = await axios.patch(
        `http://localhost:8000/orders/${id}/items/quantity`,
        { item_id: itemId, quantity: newQty },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setOrder(response.data);
    } catch (err) {
      alert(err.response?.data?.detail || "Lỗi khi cập nhật số lượng dòng hàng.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', fontFamily: 'system-ui, sans-serif' }}>
        <p style={{ fontSize: '16px', color: '#64748b' }}>⏳ Đang tải chi tiết đơn hàng...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 16px', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '16px', borderRadius: '8px' }}>
          ❌ {error || "Không tìm thấy đơn hàng."}
        </div>
        <button onClick={() => navigate(isAdmin ? '/admin/orders' : '/orders/history')} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Quay lại danh sách đơn hàng
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 16px', fontFamily: 'system-ui, sans-serif', color: '#1e293b' }}>
      
      <div style={{ marginBottom: '20px' }}>
        <Link 
          to={isAdmin ? "/admin/orders" : "/orders/history"} 
          style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          ← Quay lại danh sách đơn hàng
        </Link>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', position: 'relative' }}>
        {updating && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '16px', zIndex: 10 }}>
            <span style={{ fontWeight: 'bold', color: '#3b82f6' }}>🔄 Đang xử lý tính toán...</span>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0 }}>Đơn Hàng #{order.id}</h2>
            <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0 0' }}>
              Đặt ngày: {new Date(order.created_at).toLocaleString('vi-VN')}
            </p>
          </div>

          <div>
            <span style={{ marginRight: '8px', fontSize: '14px', fontWeight: 'bold', color: '#64748b' }}>Trạng thái:</span>
            {isAdmin ? (
              <select 
                value={order.status} 
                onChange={handleStatusChange}
                style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 'bold', backgroundColor: '#f8fafc', cursor: 'pointer' }}
              >
                {ALLOWED_STATUSES.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            ) : (
              <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', backgroundColor: '#dbeafe', color: '#1e40af' }}>
                {order.status}
              </span>
            )}
          </div>
        </div>

        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>Danh sách sản phẩm</h3>
        <div style={{ border: '1px solid #f1f5f9', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Sản phẩm</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Đơn giá</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Số lượng</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px', fontWeight: '500' }}>{item.product_name}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>{Number(item.product_price).toLocaleString('vi-VN')}đ</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {isAdmin && order.status !== 'COMPLETED' && order.status !== 'CANCELED' ? (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <button 
                          onClick={() => handleAdminUpdateQuantity(item.id, item.quantity, -1)}
                          style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
                        >
                          -
                        </button>
                        <span style={{ fontWeight: 'bold', minWidth: '20px' }}>{item.quantity}</span>
                        <button 
                          onClick={() => handleAdminUpdateQuantity(item.id, item.quantity, 1)}
                          style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontWeight: 'bold' }}>{item.quantity}</span>
                    )}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>
                    {Number(item.line_total).toLocaleString('vi-VN')}đ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '14px', color: '#64748b', marginRight: '8px' }}>Tổng thanh toán:</span>
            <span style={{ fontSize: '20px', fontWeight: '800', color: '#ef4444' }}>
              {Number(order.total_amount).toLocaleString('vi-VN')}đ
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetailPage;