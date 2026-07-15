import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminOrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  
  // State khóa các nút cộng/trừ của item đang xử lý API
  const [updatingItemId, setUpdatingItemId] = useState(null); 

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const token = localStorage.getItem('shophub_token');
        const response = await axios.get(`http://localhost:8000/orders/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setOrder(response.data);
        setSelectedStatus(response.data.status);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.detail || "Không thể tải thông tin chi tiết đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  // Cập nhật trạng thái đơn hàng
  const handleUpdateStatus = async () => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('shophub_token');
      const response = await axios.put(`http://localhost:8000/orders/${id}/status`, 
        { status: selectedStatus },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      
      setOrder(response.data);
      alert("Cập nhật trạng thái đơn hàng thành công!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Lỗi khi cập nhật trạng thái đơn hàng.");
    } finally {
      setUpdating(false);
    }
  };

  // Cập nhật số lượng sản phẩm trong đơn hàng
  const handleUpdateQuantity = async (itemId, currentQty, amount) => {
    const newQty = currentQty + amount;
    if (newQty <= 0) return; 
    
    setUpdatingItemId(itemId);
    try {
      const token = localStorage.getItem('shophub_token');
      const response = await axios.patch(
        `http://localhost:8000/orders/${id}/items/quantity`,
        { item_id: itemId, quantity: newQty },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      setOrder(response.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Không thể cập nhật số lượng sản phẩm.");
    } finally {
      setUpdatingItemId(null);
    }
  };

  // Kiểm tra trạng thái đơn hàng đã kết thúc chưa (COMPLETED / CANCELED)
  const isOrderClosed = order ? ["COMPLETED", "CANCELED"].includes(order.status) : false;

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', fontFamily: 'system-ui, sans-serif' }}>
        <p style={{ fontSize: '16px', color: '#64748b' }}>⏳ Đang tải chi tiết đơn hàng...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
          ❌ {error || "Đơn hàng không tồn tại."}
        </div>
        <button onClick={() => navigate('/admin/orders')} style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 16px', fontFamily: 'system-ui, sans-serif', color: '#1e293b' }}>
      <button onClick={() => navigate('/admin/orders')} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: 'none', background: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: '600', marginBottom: '20px', fontSize: '14px' }}>
        ⬅️ Quay lại danh sách đơn hàng
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '30px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 8px 0', color: '#0f172a' }}>Chi Tiết Đơn Hàng #{order.id}</h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Ngày đặt: {new Date(order.created_at).toLocaleString('vi-VN')}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
            <option value="PLACED">PLACED</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELED">CANCELED</option>
          </select>
          <button onClick={handleUpdateStatus} disabled={updating} style={{ padding: '8px 16px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '14px', opacity: updating ? 0.7 : 1 }}>
            {updating ? 'Đang cập nhật...' : 'Cập nhật'}
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: '30px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>Sản phẩm đã đặt</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ padding: '16px', fontWeight: '600' }}>Sản phẩm</th>
                <th style={{ padding: '16px', fontWeight: '600', textAlign: 'right' }}>Đơn giá</th>
                <th style={{ padding: '16px', fontWeight: '600', textAlign: 'center' }}>Số lượng</th>
                <th style={{ padding: '16px', fontWeight: '600', textAlign: 'right' }}>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px', fontWeight: '600', color: '#0f172a' }}>{item.product_name}</td>
                  <td style={{ padding: '16px', textAlign: 'right', color: '#64748b' }}>{Number(item.product_price).toLocaleString('vi-VN')}đ</td>
                  
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                      <button 
                        onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                        disabled={isOrderClosed || updatingItemId === item.id || item.quantity <= 1}
                        style={{ 
                          width: '28px', 
                          height: '28px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          border: '1px solid #cbd5e1', 
                          backgroundColor: '#fff', 
                          borderRadius: '4px', 
                          cursor: (isOrderClosed || item.quantity <= 1) ? 'not-allowed' : 'pointer', 
                          fontWeight: 'bold',
                          opacity: (isOrderClosed || item.quantity <= 1) ? 0.5 : 1
                        }}
                      >
                        -
                      </button>
                      <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: '600', color: '#0f172a' }}>
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                        disabled={isOrderClosed || updatingItemId === item.id}
                        style={{ 
                          width: '28px', 
                          height: '28px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          border: '1px solid #cbd5e1', 
                          backgroundColor: '#fff', 
                          borderRadius: '4px', 
                          cursor: isOrderClosed ? 'not-allowed' : 'pointer', 
                          fontWeight: 'bold',
                          opacity: isOrderClosed ? 0.5 : 1
                        }}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  
                  <td style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold', color: '#0f172a' }}>{Number(item.line_total).toLocaleString('vi-VN')}đ</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ color: '#64748b', fontSize: '14px', marginRight: '10px' }}>Tổng thanh toán:</span>
            <span style={{ fontSize: '20px', fontWeight: '800', color: '#ef4444' }}>{Number(order.total_amount).toLocaleString('vi-VN')}đ</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailPage;