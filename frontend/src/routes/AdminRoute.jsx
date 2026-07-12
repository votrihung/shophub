// src/routes/AdminRoute.jsx
import { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const location = useLocation();

  // 🚀 BẢO HIỂM TỐI THƯỢNG: Đọc dự phòng từ localStorage nếu Context đang re-load dữ liệu khi gõ URL trực tiếp
  const rawLocal = localStorage.getItem('shophub_user');
  const localUser = rawLocal ? JSON.parse(rawLocal) : null;
  const token = localStorage.getItem('token') || localStorage.getItem('shophub_token');

  // Xác định chính xác role (ưu tiên Context, nếu trống thì lấy từ localStorage làm dự phòng)
  const currentRole = user?.role || localUser?.role;
  const isLogged = isAuthenticated || Boolean(token);

  if (!isLogged) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 2. Chuyển role về chữ IN HOA và xóa khoảng trắng để check chuẩn 100%
  const cleanedRole = currentRole ? String(currentRole).trim().toUpperCase() : '';

  if (cleanedRole !== 'ADMIN') {
    return (
      <section style={{ padding: '60px 24px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center', minHeight: '60vh' }}>
        <span style={{ fontSize: '60px' }}>🚫</span>
        <h2 style={{ color: '#ef4444', marginTop: '16px', fontWeight: '800' }}>Access Denied</h2>
        <p style={{ color: '#64748b', fontSize: '15px' }}>Tài khoản của bạn không có quyền Admin để vào khu vực này!</p>
      </section>
    );
  }

  return <Outlet />;
};

export default AdminRoute;