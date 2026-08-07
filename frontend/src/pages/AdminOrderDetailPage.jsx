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
  const [adminNote, setAdminNote] = useState('');
  const [updatingItemId, setUpdatingItemId] = useState(null); 

  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });

  const fetchOrderDetail = async () => {
    try {
      const token = localStorage.getItem('shophub_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get(`https://shophub-production-c481.up.railway.app/orders/${id}`, { headers });
      
      const data = response.data;
      console.log("Order Data Backend Return:", data);
      setOrder(data);
      setSelectedStatus(data.status || 'PLACED');
      setAdminNote(data.admin_note || data.adminNote || '');

      let name = data.customer_name || data.recipient_name || data.receiver_name || data.full_name || data.name || data.user?.full_name || data.user?.name || data.user?.username || data.user?.email || '';
      let phone = data.phone || data.phone_number || data.recipient_phone || data.receiver_phone || data.user?.phone || data.user?.phone_number || '';
      let address = data.shipping_address || data.address || data.full_address || data.delivery_address || data.user_address || data.user?.address || '';

      const userId = data.user_id || data.userId || data.user?.id;

      if ((!name || !phone || !address) && userId) {
        try {
          const userRes = await axios.get(`https://shophub-production-c481.up.railway.app/users/${userId}`, { headers });
          const u = userRes.data;
          name = name || u.full_name || u.name || u.username || u.email || '';
          phone = phone || u.phone || u.phone_number || '';
          address = address || u.address || u.shipping_address || '';
        } catch (uErr) {
          try {
            const adminUserRes = await axios.get(`https://shophub-production-c481.up.railway.app/admin/users/${userId}`, { headers });
            const u = adminUserRes.data;
            name = name || u.full_name || u.name || u.username || u.email || '';
            phone = phone || u.phone || u.phone_number || '';
            address = address || u.address || u.shipping_address || '';
          } catch (adminUErr) {
            console.error(adminUErr);
          }
        }
      }

      setCustomerInfo({ name, phone, address });

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Không thể tải thông tin chi tiết đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const handleSaveCustomerInfo = async () => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('shophub_token');
      const response = await axios.patch(
        `https://shophub-production-c481.up.railway.app/orders/${id}/info`,
        {
          customer_name: customerInfo.name,
          phone: customerInfo.phone,
          shipping_address: customerInfo.address
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      const updatedOrder = response.data;
      setOrder(updatedOrder);
      
      setCustomerInfo({
        name: updatedOrder.customer_name || customerInfo.name,
        phone: updatedOrder.phone || customerInfo.phone,
        address: updatedOrder.shipping_address || customerInfo.address
      });

      setIsEditingCustomer(false);
      alert("Cập nhật thông tin giao hàng thành công!");
    } catch (err) {
      try {
        const token = localStorage.getItem('shophub_token');
        const fallbackRes = await axios.put(
          `https://shophub-production-c481.up.railway.app/orders/${id}/status`,
          {
            status: selectedStatus,
            admin_note: adminNote,
            customer_name: customerInfo.name,
            phone: customerInfo.phone,
            shipping_address: customerInfo.address
          },
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );

        setOrder(fallbackRes.data);
        setIsEditingCustomer(false);
        alert("Cập nhật thông tin giao hàng thành công!");
      } catch (fallbackErr) {
        console.error(fallbackErr);
        alert(fallbackErr.response?.data?.detail || err.response?.data?.detail || "Không thể cập nhật thông tin khách hàng.");
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateStatus = async () => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('shophub_token');
      const payload = { 
        status: selectedStatus, 
        admin_note: adminNote,
        customer_name: customerInfo.name,
        phone: customerInfo.phone,
        shipping_address: customerInfo.address
      };

      const response = await axios.put(
        `https://shophub-production-c481.up.railway.app/orders/${id}/status`, 
        payload,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      
      setOrder(response.data);
      setIsEditingCustomer(false);
      alert("Cập nhật trạng thái và thông tin đơn hàng thành công!");
    } catch (err) {
      console.error(err);
      try {
        const token = localStorage.getItem('shophub_token');
        const patchRes = await axios.patch(
          `https://shophub-production-c481.up.railway.app/orders/${id}`,
          { 
            status: selectedStatus, 
            admin_note: adminNote,
            customer_name: customerInfo.name,
            phone: customerInfo.phone,
            shipping_address: customerInfo.address
          },
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        setOrder(patchRes.data);
        setIsEditingCustomer(false);
        alert("Cập nhật thành công!");
      } catch (patchErr) {
        console.error(patchErr);
        alert(patchErr.response?.data?.detail || err.response?.data?.detail || "Lỗi khi cập nhật đơn hàng.");
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateQuantity = async (itemId, currentQty, amount) => {
    const newQty = currentQty + amount;
    if (newQty <= 0) return; 
    
    setUpdatingItemId(itemId);
    try {
      const token = localStorage.getItem('shophub_token');
      const response = await axios.patch(
        `https://shophub-production-c481.up.railway.app/orders/${id}/items/quantity`,
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

  const isOrderClosed = order ? ["COMPLETED", "CANCELED", "CANCELLED"].includes(order.status) : false;

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', fontFamily: 'system-ui, sans-serif' }}>
        <p style={{ fontSize: '16px', color: '#64748b' }}>⏳ Đang tải chi tiết đơn hàng #{id}...</p>
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
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px', fontFamily: 'system-ui, sans-serif', color: '#1e293b' }}>
      <button onClick={() => navigate('/admin/orders')} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: 'none', background: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: '600', marginBottom: '20px', fontSize: '15px' }}>
        ⬅️ Quay lại danh sách đơn hàng
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 6px 0', color: '#0f172a' }}>
            🛠️ Xử Lý Đơn Hàng #{order.id}
          </h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
            Ngày đặt: {order.created_at ? new Date(order.created_at).toLocaleString('vi-VN') : '---'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#fff', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
            <option value="PLACED">PLACED (Chờ xác nhận)</option>
            <option value="PROCESSING">PROCESSING (Đang xử lý)</option>
            <option value="COMPLETED">COMPLETED (Hoàn thành)</option>
            <option value="CANCELED">CANCELED (Đã hủy)</option>
          </select>
          <button onClick={handleUpdateStatus} disabled={updating} style={{ padding: '8px 16px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: updating ? 'not-allowed' : 'pointer', fontSize: '14px', opacity: updating ? 0.7 : 1 }}>
            {updating ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>👤 Thông tin giao hàng</h3>
          <button 
            onClick={() => setIsEditingCustomer(!isEditingCustomer)} 
            style={{ border: 'none', background: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
          >
            {isEditingCustomer ? '✖ Hủy sửa' : '✏️ Chỉnh sửa thông tin'}
          </button>
        </div>

        {isEditingCustomer ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Tên khách hàng:</label>
                <input type="text" value={customerInfo.name} onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Số điện thoại:</label>
                <input type="text" value={customerInfo.phone} onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Địa chỉ giao hàng:</label>
                <input type="text" value={customerInfo.address} onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <button 
                onClick={handleSaveCustomerInfo} 
                disabled={updating}
                style={{ padding: '8px 16px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: updating ? 'not-allowed' : 'pointer', fontSize: '14px', opacity: updating ? 0.7 : 1 }}
              >
                {updating ? 'Đang lưu...' : '💾 Lưu thông tin khách'}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <span style={{ color: '#64748b', fontSize: '13px' }}>Khách hàng:</span>
              <p style={{ margin: '4px 0 0 0', fontWeight: '700', color: '#0f172a', fontSize: '15px' }}>
                {customerInfo.name || order.user?.email || (order.user_id ? `User #${order.user_id}` : 'Khách lẻ')}
              </p>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '13px' }}>Số điện thoại:</span>
              <p style={{ margin: '4px 0 0 0', fontWeight: '700', color: '#0f172a', fontSize: '15px' }}>
                {customerInfo.phone || 'Chưa cập nhật'}
              </p>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '13px' }}>Địa chỉ giao hàng:</span>
              <p style={{ margin: '4px 0 0 0', fontWeight: '600', color: '#0f172a', fontSize: '15px' }}>
                {customerInfo.address || 'Chưa cập nhật'}
              </p>
            </div>
          </div>
        )}
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: '28px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', padding: '24px' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '700', color: '#0f172a', borderBottom: '1px solid #f1f5f9', pb: '12px' }}>
          Danh sách sản phẩm ({order.items?.length || 0})
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {order.items?.map((item, idx) => {
            const price = Number(item.product_price || item.price || 0);
            const lineTotal = item.line_total ? Number(item.line_total) : price * item.quantity;
            const imgUrl = item.image_url || item.image || item.product_image || 'https://via.placeholder.com/80';

            return (
              <div 
                key={item.id || idx} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  gap: '20px', 
                  padding: '16px', 
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0', 
                  borderRadius: '12px' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                  <img 
                    src={imgUrl} 
                    alt={item.product_name || item.name} 
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#fff' }} 
                  />
                  <div>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
                      {item.product_name || item.name}
                    </h4>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
                      Đơn giá: <strong style={{ color: '#334155' }}>{price.toLocaleString('vi-VN')}đ</strong>
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#fff', padding: '4px 8px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                      disabled={isOrderClosed || updatingItemId === item.id || item.quantity <= 1}
                      style={{ 
                        width: '32px', 
                        height: '32px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        border: '1px solid #e2e8f0', 
                        backgroundColor: '#f1f5f9', 
                        borderRadius: '6px', 
                        cursor: (isOrderClosed || item.quantity <= 1) ? 'not-allowed' : 'pointer', 
                        fontWeight: 'bold',
                        fontSize: '16px',
                        opacity: (isOrderClosed || item.quantity <= 1) ? 0.5 : 1
                      }}
                    >
                      -
                    </button>
                    <span style={{ minWidth: '28px', textAlign: 'center', fontWeight: '700', color: '#0f172a', fontSize: '15px' }}>
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                      disabled={isOrderClosed || updatingItemId === item.id}
                      style={{ 
                        width: '32px', 
                        height: '32px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        border: '1px solid #e2e8f0', 
                        backgroundColor: '#f1f5f9', 
                        borderRadius: '6px', 
                        cursor: isOrderClosed ? 'not-allowed' : 'pointer', 
                        fontWeight: 'bold',
                        fontSize: '16px',
                        opacity: isOrderClosed ? 0.5 : 1
                      }}
                    >
                      +
                    </button>
                  </div>

                  <div style={{ minWidth: '120px', textAlign: 'right', fontWeight: '800', fontSize: '17px', color: '#0f172a' }}>
                    {lineTotal.toLocaleString('vi-VN')}đ
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '2px dashed #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ color: '#64748b', fontSize: '15px', marginRight: '12px' }}>Tổng thanh toán:</span>
            <span style={{ fontSize: '24px', fontWeight: '800', color: '#ef4444' }}>
              {Number(order.total_amount || order.totalPrice || 0).toLocaleString('vi-VN')}đ
            </span>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <label style={{ display: 'block', fontWeight: '700', fontSize: '15px', marginBottom: '10px', color: '#0f172a' }}>
          📝 Ghi chú Admin / Lý do xử lý đơn hàng:
        </label>
        <textarea
          rows="3"
          placeholder="Nhập ghi chú cho đơn hàng này..."
          value={adminNote}
          onChange={(e) => setAdminNote(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
        />
        <div style={{ marginTop: '16px', textAlign: 'right' }}>
          <button 
            onClick={handleUpdateStatus} 
            disabled={updating}
            style={{ padding: '10px 24px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '14px', cursor: updating ? 'not-allowed' : 'pointer' }}
          >
            {updating ? 'Đang lưu...' : 'Lưu Thông Tin & Trạng Thái'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailPage;