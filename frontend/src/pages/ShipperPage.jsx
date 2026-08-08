import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://shophub-production-c481.up.railway.app';

const ShipperPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchShipperOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('shophub_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Lấy danh sách tất cả đơn hàng cho Shipper
      const res = await axios.get(`${API_BASE_URL}/orders/admin/all`, { headers });

      const data = Array.isArray(res.data) ? res.data : (res.data.orders || res.data.data || []);
      setOrders(data);
    } catch (err) {
      console.error("Lỗi tải danh sách đơn hàng Shipper:", err);
      if (err.response?.status === 403) {
        alert("🔒 Lỗi 403 (Forbidden): Tài khoản của bạn không có quyền Shipper hoặc Admin.");
      } else {
        alert("❌ Lỗi tải đơn hàng: " + (err.response?.data?.detail || err.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipperOrders();
  }, []);

  const handleUpdateStatus = async (order, newStatus) => {
    const orderId = order.id || order.order_id;
    if (!window.confirm(`Xác nhận chuyển trạng thái đơn hàng #${orderId} sang "${getStatusLabel(newStatus)}"?`)) {
      return;
    }

    setUpdatingId(orderId);
    try {
      const token = localStorage.getItem('shophub_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // ✅ ĐÃ SỬA: Gọi đúng endpoint `/shipper-status` và chỉ truyền `{ status }` đúng chuẩn Pydantic Schema ShipperStatusUpdate
      const response = await axios.put(
        `${API_BASE_URL}/orders/${orderId}/shipper-status`,
        { status: newStatus },
        { headers }
      );

      const updatedOrder = response.data?.order;
      const updatedStatus = updatedOrder?.status || newStatus;

      setOrders(prev => prev.map(o => (o.id === orderId || o.order_id === orderId) ? { ...o, status: updatedStatus } : o));
      alert("✅ Cập nhật trạng thái giao hàng thành công!");
    } catch (err) {
      console.error("Lỗi cập nhật đơn hàng:", err.response || err);
      
      const backendMessage = err.response?.data?.detail || err.response?.data?.message;
      if (backendMessage) {
        alert(`❌ Backend báo lỗi: ${typeof backendMessage === 'object' ? JSON.stringify(backendMessage) : backendMessage}`);
      } else {
        alert("❌ Không thể cập nhật trạng thái đơn hàng. Vui lòng kiểm tra lại quyền hạn hoặc kết nối!");
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toUpperCase()) {
      case 'PLACED':
      case 'PENDING':
        return 'Chờ xử lý / Đã đặt';
      case 'PROCESSING':
        return 'Đã duyệt / Chuẩn bị hàng';
      case 'SHIPPING':
      case 'DELIVERING':
        return 'Đang giao hàng';
      case 'COMPLETED':
      case 'DELIVERED':
        return 'Giao thành công';
      case 'CANCELED':
      case 'CANCELLED':
        return 'Đã hủy';
      case 'FAILED':
        return 'Giao thất bại';
      default:
        return status || 'Không xác định';
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status?.toUpperCase()) {
      case 'PLACED':
      case 'PENDING':
        return { backgroundColor: '#fef3c7', color: '#92400e' };
      case 'PROCESSING':
      case 'SHIPPING':
      case 'DELIVERING':
        return { backgroundColor: '#e0f2fe', color: '#0369a1' };
      case 'COMPLETED':
      case 'DELIVERED':
        return { backgroundColor: '#dcfce7', color: '#166534' };
      case 'CANCELED':
      case 'CANCELLED':
      case 'FAILED':
        return { backgroundColor: '#fee2e2', color: '#991b1b' };
      default:
        return { backgroundColor: '#f1f5f9', color: '#475569' };
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filterStatus === 'ALL') return true;
    const st = order.status?.toUpperCase();
    if (filterStatus === 'PENDING') return st === 'PLACED' || st === 'PENDING' || st === 'PROCESSING';
    if (filterStatus === 'SHIPPING') return st === 'SHIPPING' || st === 'DELIVERING';
    if (filterStatus === 'DELIVERED') return st === 'COMPLETED' || st === 'DELIVERED';
    if (filterStatus === 'FAILED') return st === 'CANCELED' || st === 'CANCELLED' || st === 'FAILED';
    return true;
  });

  const counts = {
    ALL: orders.length,
    PENDING: orders.filter(o => ['PLACED', 'PENDING', 'PROCESSING'].includes(o.status?.toUpperCase())).length,
    SHIPPING: orders.filter(o => ['SHIPPING', 'DELIVERING'].includes(o.status?.toUpperCase())).length,
    DELIVERED: orders.filter(o => ['COMPLETED', 'DELIVERED'].includes(o.status?.toUpperCase())).length,
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 16px', fontFamily: 'system-ui, sans-serif', color: '#0f172a' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0 }}>🛵 Cổng Vận Chuyển Shipper</h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>Quản lý và cập nhật trạng thái giao hàng</p>
        </div>
        <button 
          onClick={fetchShipperOrders}
          style={{ padding: '8px 16px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
        >
          🔄 Tải lại
        </button>
      </div>

      {/* THỐNG KÊ NHANH */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Tổng đơn</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>{counts.ALL}</div>
        </div>
        <div style={{ backgroundColor: '#fefce8', padding: '12px', borderRadius: '10px', border: '1px solid #fef08a', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#854d0e' }}>Chờ nhận</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#a16207' }}>{counts.PENDING}</div>
        </div>
        <div style={{ backgroundColor: '#eff6ff', padding: '12px', borderRadius: '10px', border: '1px solid #bfdbfe', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#1e40af' }}>Đang giao</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#2563eb' }}>{counts.SHIPPING}</div>
        </div>
        <div style={{ backgroundColor: '#f0fdf4', padding: '12px', borderRadius: '10px', border: '1px solid #bbf7d0', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#166534' }}>Đã giao</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#16a34a' }}>{counts.DELIVERED}</div>
        </div>
      </div>

      {/* THANH LỌC TAB */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '16px' }}>
        {[
          { key: 'ALL', label: 'Tất cả' },
          { key: 'PENDING', label: 'Chờ lấy' },
          { key: 'SHIPPING', label: 'Đang giao' },
          { key: 'DELIVERED', label: 'Hoàn thành' },
          { key: 'FAILED', label: 'Thất bại/Hủy' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: filterStatus === tab.key ? '#2563eb' : '#f1f5f9',
              color: filterStatus === tab.key ? '#fff' : '#475569',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* DANH SÁCH ĐƠN HÀNG */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>⌛ Đang tải danh sách đơn hàng...</div>
      ) : filteredOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#64748b' }}>
          📭 Không có đơn hàng nào trong danh mục này.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredOrders.map(order => {
            const id = order.id || order.order_id;
            const customerName = order.customer_name || order.full_name || order.recipient_name || 'Khách hàng';
            const phone = order.phone || order.phone_number || 'N/A';
            const address = order.shipping_address || order.address || 'Chưa cung cấp địa chỉ';
            const total = Number(order.total_amount || order.totalPrice || order.total_price || 0);
            const isCOD = (order.payment_method || '').toUpperCase() === 'COD';
            const isUpdating = updatingId === id;
            const statusUpper = order.status?.toUpperCase();

            return (
              <div 
                key={id} 
                style={{ 
                  backgroundColor: '#fff', 
                  borderRadius: '12px', 
                  border: '1px solid #e2e8f0', 
                  padding: '16px', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)' 
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontWeight: '800', fontSize: '15px' }}>Đơn hàng #{id}</span>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '12px', 
                    fontSize: '12px', 
                    fontWeight: '700',
                    ...getStatusBadgeStyle(order.status)
                  }}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', fontSize: '13.5px', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>👤 <strong>{customerName}</strong></span>
                    {phone !== 'N/A' && (
                      <a 
                        href={`tel:${phone}`} 
                        style={{ padding: '4px 10px', backgroundColor: '#22c55e', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '12px' }}
                      >
                        📞 Gọi điện
                      </a>
                    )}
                  </div>
                  <div>📱 SĐT: <strong>{phone}</strong></div>
                  <div>📍 Địa chỉ: <strong>{address}</strong></div>
                  {order.note && <div style={{ color: '#d97706', fontStyle: 'italic' }}>📝 Ghi chú: {order.note}</div>}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderTop: '1px dashed #e2e8f0', paddingTop: '10px' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Hình thức: </span>
                    <strong style={{ fontSize: '13px' }}>{order.payment_method || 'COD'}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      {isCOD ? '💵 Cần thu (COD): ' : '✅ Tiền hàng: '}
                    </span>
                    <strong style={{ fontSize: '16px', color: isCOD ? '#ef4444' : '#16a34a' }}>
                      {total.toLocaleString('vi-VN')}đ
                    </strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {/* NÚT TẠO ĐƠN SANG SHIPPING */}
                  {['PLACED', 'PENDING', 'PROCESSING'].includes(statusUpper) && (
                    <button
                      disabled={isUpdating}
                      onClick={() => handleUpdateStatus(order, 'SHIPPING')}
                      style={{ flex: 1, padding: '10px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: isUpdating ? 'not-allowed' : 'pointer' }}
                    >
                      {isUpdating ? '⏳ Đang xử lý...' : '🚀 Nhận đơn & Bắt đầu giao'}
                    </button>
                  )}

                  {/* NÚT CHUYỂN TRẠNG THÁI DELIVERED/FAILED */}
                  {['SHIPPING', 'DELIVERING'].includes(statusUpper) && (
                    <>
                      <button
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus(order, 'DELIVERED')}
                        style={{ flex: 2, padding: '10px', backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: isUpdating ? 'not-allowed' : 'pointer' }}
                      >
                        {isUpdating ? '⏳ Đang xử lý...' : '✅ Giao thành công (DELIVERED)'}
                      </button>
                      <button
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus(order, 'FAILED')}
                        style={{ flex: 1, padding: '10px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: isUpdating ? 'not-allowed' : 'pointer' }}
                      >
                        ❌ Giao thất bại
                      </button>
                    </>
                  )}

                  {/* ĐƠN HÀNG ĐÃ KẾT THÚC */}
                  {['COMPLETED', 'DELIVERED', 'CANCELED', 'CANCELLED', 'FAILED'].includes(statusUpper) && (
                    <div style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic', width: '100%', textAlign: 'right' }}>
                      Đơn hàng đã hoàn tất
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShipperPage;