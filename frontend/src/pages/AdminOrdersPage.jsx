import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DEFAULT_PLACEHOLDER = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="%2394a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';

const ITEMS_PER_PAGE = 8;

const AdminOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ACTIVE');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchAllOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('shophub_token');
      const response = await axios.get('http://localhost:8000/orders/admin/all', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      console.log("🔥 DỮ LIỆU ĐƠN HÀNG TỪ BACKEND:", response.data);
      setOrders(response.data || []);
    } catch (err) {
      console.error("Lỗi lấy toàn bộ đơn hàng (Admin):", err);
      setError(err.response?.data?.detail || err.response?.data?.message || "Bạn không có quyền truy cập trang này.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'COMPLETED':
        return { bg: '#dcfce7', color: '#166534', text: 'Hoàn thành' };
      case 'CANCELED':
      case 'CANCELLED':
        return { bg: '#fee2e2', color: '#991b1b', text: 'Đã hủy' };
      case 'PROCESSING':
      case 'SHIPPING':
        return { bg: '#e0f2fe', color: '#0369a1', text: 'Đang xử lý' };
      case 'PLACED':
      default:
        return { bg: '#fef3c7', color: '#92400e', text: 'Chờ xác nhận' };
    }
  };

  const processImageUrl = (item) => {
    let rawImg = 
      item?.image_url || 
      item?.image || 
      item?.product_image || 
      item?.thumbnail || 
      item?.product?.image_url || 
      item?.product?.image || 
      item?.product?.thumbnail ||
      item?.product?.image_path ||
      item?.image_path;

    if (!rawImg || typeof rawImg !== 'string') {
      return DEFAULT_PLACEHOLDER;
    }

    if (rawImg.startsWith('http://') || rawImg.startsWith('https://') || rawImg.startsWith('data:')) {
      return rawImg;
    }

    const cleanPath = rawImg.startsWith('/') ? rawImg : `/${rawImg}`;
    return `http://localhost:8000${cleanPath}`;
  };

  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch = 
      String(order.id).includes(term) ||
      (order.customer_name && order.customer_name.toLowerCase().includes(term)) ||
      (order.phone && order.phone.includes(term)) ||
      (order.shipping_address && order.shipping_address.toLowerCase().includes(term));

    let matchesStatus = true;
    if (statusFilter === 'ACTIVE') {
      matchesStatus = order.status === 'PLACED' || order.status === 'PROCESSING' || order.status === 'SHIPPING';
    } else if (statusFilter !== 'ALL') {
      matchesStatus = order.status === statusFilter;
    }

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', fontFamily: 'system-ui, sans-serif' }}>
        <p style={{ fontSize: '16px', color: '#64748b' }}>⏳ Đang tải danh sách đơn hàng hệ thống...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 16px', fontFamily: 'system-ui, sans-serif', color: '#1e293b', minHeight: '60vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
          ⚙️ Admin – Quản Lý Đơn Hàng
        </h2>
        <button
          onClick={fetchAllOrders}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f1f5f9',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            color: '#475569'
          }}
        >
          🔄 Tải lại dữ liệu
        </button>
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="🔍 Tìm theo Mã đơn, Khách hàng, SĐT, Địa chỉ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: '1',
            minWidth: '280px',
            padding: '10px 16px',
            borderRadius: '10px',
            border: '1px solid #cbd5e1',
            fontSize: '14px',
            outline: 'none',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}
        />

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {[
            { id: 'ACTIVE', label: '⚡ Cần xử lý' },
            { id: 'PLACED', label: 'Chờ xác nhận' },
            { id: 'PROCESSING', label: 'Đang xử lý' },
            { id: 'COMPLETED', label: 'Hoàn thành' },
            { id: 'CANCELED', label: '🗑️ Mục đơn hủy' },
            { id: 'ALL', label: 'Tất cả đơn' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: statusFilter === tab.id ? '#3b82f6' : '#e2e8f0',
                backgroundColor: statusFilter === tab.id ? '#3b82f6' : '#fff',
                color: statusFilter === tab.id ? '#fff' : '#475569',
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
      </div>

      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px' }}>
          ❌ {error}
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#64748b', fontStyle: 'italic' }}>Không tìm thấy đơn hàng nào phù hợp.</p>
        </div>
      ) : (
        <>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', textTransform: 'uppercase', fontSize: '12px' }}>
                  <th style={{ padding: '16px', fontWeight: '700' }}>Mã Đơn</th>
                  <th style={{ padding: '16px', fontWeight: '700' }}>Ngày Đặt</th>
                  <th style={{ padding: '16px', fontWeight: '700' }}>Sản Phẩm Đã Mua</th>
                  <th style={{ padding: '16px', fontWeight: '700' }}>Tổng Tiền</th>
                  <th style={{ padding: '16px', fontWeight: '700' }}>Trạng Thái</th>
                  <th style={{ padding: '16px', fontWeight: '700', textAlign: 'center' }}>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => {
                  const statusStyle = getStatusStyle(order.status);
                  return (
                    <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td style={{ padding: '16px', fontWeight: 'bold', color: '#3b82f6' }}>#{order.id}</td>
                      <td style={{ padding: '16px', color: '#64748b', fontSize: '13px' }}>
                        {order.created_at ? new Date(order.created_at).toLocaleString('vi-VN') : '---'}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {order.items && order.items.length > 0 ? (
                            order.items.map((item, idx) => (
                              <div key={item.id || idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <img 
                                  src={processImageUrl(item)} 
                                  alt={item.product_name || item.name || item.product?.name || 'Sản phẩm'} 
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = DEFAULT_PLACEHOLDER;
                                  }}
                                  style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }} 
                                />
                                <span style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                                  {item.product_name || item.name || item.product?.name} <span style={{ color: '#64748b', fontWeight: '400' }}>(x{item.quantity})</span>
                                </span>
                              </div>
                            ))
                          ) : (
                            <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Không có thông tin</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '16px', fontWeight: 'bold', color: '#ef4444' }}>
                        {Number(order.total_amount || order.totalPrice || 0).toLocaleString('vi-VN')}đ
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
                          style={{ padding: '8px 14px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px', boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)' }}
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

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '20px' }}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: currentPage === 1 ? '#f1f5f9' : '#fff',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                ◀ Trước
              </button>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>
                Trang {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: currentPage === totalPages ? '#f1f5f9' : '#fff',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                Sau ▶
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminOrdersPage;