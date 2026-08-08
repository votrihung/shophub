import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

// Danh sách trạng thái chuẩn dành cho Admin chuyển đổi
const ALLOWED_STATUSES = ['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELED'];

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  const isAdmin = user?.role === 'ADMIN';

  const fetchOrderDetail = async () => {
    try {
      const token = localStorage.getItem('shophub_token');
      const response = await axios.get(`https://shophub-production-c481.up.railway.app/orders/${id}`, {
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

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setUpdating(true);
    try {
      const token = localStorage.getItem('shophub_token');
      const response = await axios.put(
        `https://shophub-production-c481.up.railway.app/orders/${id}/status`,
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

  const handleUserCancelOrder = async () => {
    const confirmCancel = window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?");
    if (!confirmCancel) return;

    setUpdating(true);
    try {
      const token = localStorage.getItem('shophub_token');
      const response = await axios.post(
        `https://shophub-production-c481.up.railway.app/orders/${id}/cancel`,
        {},
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setOrder(response.data);
      alert("🎉 Đã hủy đơn hàng thành công!");
    } catch (err) {
      alert(err.response?.data?.detail || "Lỗi khi hủy đơn hàng.");
    } finally {
      setUpdating(false);
    }
  };

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
        `https://shophub-production-c481.up.railway.app/orders/${id}/items/quantity`,
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

  // Chuẩn hóa logic hiển thị Badge trạng thái (có dùng .trim() loại bỏ khoảng trắng ẩn)
  const getStatusBadgeData = (status) => {
    const baseStyle = {
      padding: '6px 14px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: 'bold',
      display: 'inline-block'
    };
    
    const st = status ? String(status).trim().toUpperCase() : '';

    switch (st) {
      case 'PLACED':
      case 'PENDING':
        return { style: { ...baseStyle, backgroundColor: '#dbeafe', color: '#1e40af' }, text: 'Chờ xác nhận' };
      case 'PROCESSING':
        return { style: { ...baseStyle, backgroundColor: '#fef3c7', color: '#92400e' }, text: 'Đang xử lý' };
      case 'SHIPPED':
      case 'SHIPPING':
      case 'DELIVERING':
        return { style: { ...baseStyle, backgroundColor: '#f3e8ff', color: '#6b21a8' }, text: 'Đang giao hàng' };
      case 'DELIVERED':
      case 'COMPLETED':
      case 'ĐÃ GIAO THÀNH CÔNG':
      case 'HOÀN THÀNH':
        return { style: { ...baseStyle, backgroundColor: '#dcfce7', color: '#166534' }, text: 'Hoàn thành' };
      case 'CANCELED':
      case 'CANCELLED':
        return { style: { ...baseStyle, backgroundColor: '#fee2e2', color: '#991b1b' }, text: 'Đã hủy' };
      default:
        return { style: { ...baseStyle, backgroundColor: '#f1f5f9', color: '#475569' }, text: status };
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

  const badge = getStatusBadgeData(order.status);
  const totalAmount = order.total_amount ?? order.total_price ?? 0;
  const stUpper = order.status ? String(order.status).trim().toUpperCase() : '';
  const isCompleted = ['DELIVERED', 'COMPLETED', 'HOÀN THÀNH', 'ĐÃ GIAO THÀNH CÔNG'].includes(stUpper);
  const isPlaced = stUpper === 'PLACED' || stUpper === 'PENDING';

  return (
    <div style={{ maxWidth: '850px', margin: '40px auto', padding: '0 16px', fontFamily: 'system-ui, sans-serif', color: '#1e293b' }}>
      
      <div style={{ marginBottom: '20px' }}>
        <Link 
          to={isAdmin ? "/admin/orders" : "/orders/history"} 
          style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          ← Quay lại danh sách đơn hàng
        </Link>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
        {updating && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '16px', zIndex: 10 }}>
            <span style={{ fontWeight: 'bold', color: '#3b82f6' }}>🔄 Đang xử lý tính toán...</span>
          </div>
        )}

        {/* Header đơn hàng */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', padding: '24px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0 }}>Đơn Hàng #{order.id}</h2>
            <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0 0' }}>
              Đặt ngày: {new Date(order.created_at).toLocaleString('vi-VN')}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#64748b' }}>Trạng thái:</span>
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
              <span style={badge.style}>
                {badge.text}
              </span>
            )}

            {!isAdmin && isPlaced && (
              <button
                onClick={handleUserCancelOrder}
                style={{
                  padding: '6px 14px',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Hủy đơn
              </button>
            )}
          </div>
        </div>

        {/* Thông tin giao hàng & Vận chuyển */}
        <div style={{ padding: '16px 24px', backgroundColor: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px', color: '#334155' }}>📍 Thông tin giao hàng</h3>
          <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>
            {order.customer_name && <div><strong>Người nhận:</strong> {order.customer_name} {order.phone && `(${order.phone})`}</div>}
            {order.shipping_address && <div><strong>Địa chỉ:</strong> {order.shipping_address}</div>}
            <div><strong>Đơn vị vận chuyển:</strong> 🚚 {order.shipping_method || 'Đội xe ShopHub'}</div>
            {order.tracking_code && (
              <div>
                <strong>Mã vận đơn:</strong>{' '}
                <a 
                  href={`https://ghn.vn/blogs/trang-thai-don-hang?order_code=${order.tracking_code}`}
                  target="_blank" 
                  rel="noreferrer"
                  style={{ color: '#2563eb', fontWeight: 'bold', textDecoration: 'underline' }}
                >
                  #{order.tracking_code} (Tra cứu GHN)
                </a>
              </div>
            )}
            {order.note && <div><strong>Ghi chú:</strong> {order.note}</div>}
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>📦 Danh sách sản phẩm</h3>
          <div style={{ border: '1px solid #f1f5f9', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Sản phẩm</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Đơn giá</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Số lượng</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => {
                  const imgUrl = item.image_url || item.image || item.product_image || 'https://via.placeholder.com/50?text=No+Image';
                  const price = item.product_price ?? item.price ?? item.unit_price ?? 0;
                  const lineTotal = item.line_total ?? (price * item.quantity);
                  const name = item.product_name || item.name || 'Sản phẩm';
                  const productId = item.product_id || item.product?.id;

                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img 
                            src={imgUrl} 
                            alt={name} 
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }} 
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/50?text=No+Image'; }}
                          />
                          <div>
                            <div style={{ fontWeight: '600', color: '#0f172a' }}>{name}</div>
                            {/* Nút Đánh Giá nếu đơn hàng đã Hoàn Thành */}
                            {!isAdmin && isCompleted && productId && (
                              <button
                                onClick={() => navigate(`/products/${productId}`)}
                                style={{
                                  marginTop: '4px',
                                  backgroundColor: '#f59e0b',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '2px 8px',
                                  fontSize: '11px',
                                  fontWeight: 'bold',
                                  cursor: 'pointer'
                                }}
                              >
                                ⭐ Đánh giá sản phẩm
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', color: '#475569' }}>
                        {Number(price).toLocaleString('vi-VN')}đ
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        {isAdmin && !['COMPLETED', 'DELIVERED', 'CANCELED', 'CANCELLED', 'HOÀN THÀNH'].includes(stUpper) ? (
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
                          <span style={{ fontWeight: 'bold' }}>x{item.quantity}</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 'bold', color: '#0f172a' }}>
                        {Number(lineTotal).toLocaleString('vi-VN')}đ
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '2px dashed #f1f5f9', paddingTop: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '14px', color: '#64748b', marginRight: '8px' }}>Tổng thanh toán:</span>
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#ef4444' }}>
                {Number(totalAmount).toLocaleString('vi-VN')}đ
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetailPage;