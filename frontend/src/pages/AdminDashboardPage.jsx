import React, { useEffect, useState } from 'react';
import { adminStatsApi } from '../api/adminStatsApi';

const AdminDashboardPage = () => {
  const [overview, setOverview] = useState(null);
  const [monthlyData, setMonthlyData] = useState({ months: [], revenues: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [overviewRes, monthlyRes] = await Promise.all([
          adminStatsApi.getOverview(),
          adminStatsApi.getMonthlyRevenue()
        ]);
        setOverview(overviewRes);
        setMonthlyData(monthlyRes);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu Admin Dashboard:", err);
        setError("Không thể tải dữ liệu thống kê. Vui lòng kiểm tra quyền Admin hoặc server.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h2>🔄 Đang tải dữ liệu Thống kê...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', color: '#ef4444', fontFamily: 'sans-serif' }}>
        <h2>❌ Lỗi: {error}</h2>
      </div>
    );
  }

  const maxRevenue = Math.max(...(monthlyData.revenues.length ? monthlyData.revenues : [1]));

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 16px', fontFamily: 'system-ui, sans-serif', color: '#1e293b' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>📊 Admin Dashboard</h1>
      <p style={{ color: '#64748b', marginBottom: '32px' }}>Tổng quan chỉ số kinh doanh & doanh thu theo thời gian thực</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        
        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Tổng Sản Phẩm</span>
            <span style={{ fontSize: '24px' }}>📦</span>
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '12px 0 0 0', color: '#0f172a' }}>
            {overview?.total_products?.toLocaleString('vi-VN') || 0}
          </h2>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Tổng Đơn Hàng</span>
            <span style={{ fontSize: '24px' }}>🛒</span>
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '12px 0 0 0', color: '#3b82f6' }}>
            {overview?.total_orders?.toLocaleString('vi-VN') || 0}
          </h2>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Tổng Doanh Thu (PAID)</span>
            <span style={{ fontSize: '24px' }}>💰</span>
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '12px 0 0 0', color: '#22c55e' }}>
            {overview?.total_revenue ? `${overview.total_revenue.toLocaleString('vi-VN')} đ` : '0 đ'}
          </h2>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Khách Hàng</span>
            <span style={{ fontSize: '24px' }}>👥</span>
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '12px 0 0 0', color: '#a855f7' }}>
            {overview?.total_users?.toLocaleString('vi-VN') || 0}
          </h2>
        </div>

      </div>

      <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px' }}>📈 Biểu Đồ Doanh Thu Theo Tháng</h3>

        {monthlyData.months.length === 0 ? (
          <p style={{ fontStyle: 'italic', color: '#94a3b8', textAlign: 'center', padding: '40px 0' }}>Chưa có dữ liệu doanh thu đơn hàng đã thanh toán.</p>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', height: '220px', padding: '20px 10px', borderBottom: '2px solid #e2e8f0' }}>
              {monthlyData.months.map((m, idx) => {
                const rev = monthlyData.revenues[idx] || 0;
                const heightPercent = Math.max((rev / maxRevenue) * 100, 5); // Tối thiểu 5% độ cao để vẫn nhìn thấy mốc

                return (
                  <div key={m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#16a34a', marginBottom: '6px' }}>
                      {rev > 0 ? `${rev.toLocaleString('vi-VN')}đ` : '0'}
                    </span>
                    <div 
                      style={{ 
                        width: '100%', 
                        maxWidth: '48px', 
                        height: `${heightPercent}%`, 
                        backgroundColor: '#3b82f6', 
                        borderRadius: '6px 6px 0 0',
                        transition: 'height 0.3s ease'
                      }} 
                    />
                    <span style={{ fontSize: '12px', color: '#64748b', marginTop: '8px', fontWeight: '500' }}>{m}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;