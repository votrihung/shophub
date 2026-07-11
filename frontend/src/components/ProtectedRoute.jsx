// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Khớp hoàn toàn với hook bên Context!

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Khi đang kiểm tra trạng thái token, hiển thị màn hình chờ thay vì để trắng trang
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontSize: '16px', fontWeight: 'bold', color: '#64748b', backgroundColor: '#f8fafc' }}>
        🔄 Đang xác thực quyền truy cập ShopHub...
      </div>
    );
  }

  // Nếu chưa đăng nhập, đá văng về trang Login ngay
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Hợp lệ thì cho qua cửa
  return children;
};

export default ProtectedRoute;