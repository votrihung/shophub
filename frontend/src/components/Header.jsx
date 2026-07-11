// src/components/Header.jsx
import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Giữ nguyên Context của sốp

const Header = ({ title = "ShopHub" }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Lấy vị trí trang hiện tại để làm hiệu ứng active
  const { user, logout } = useContext(AuthContext); // Lấy user thật từ Context ra

  const handleLogoutClick = () => {
    logout();
    alert('👋 Đã đăng xuất tài khoản thành công!');
    navigate('/login');
  };

  // Hàm kiểm tra xem menu có đang được chọn hay không để đổi màu active
  const isActive = (path) => location.pathname === path;

  return (
    <header style={{ 
      backgroundColor: '#ffffff', 
      borderBottom: '1px solid #f1f5f9', 
      padding: '16px 24px', 
      position: 'sticky', 
      top: 0, 
      zIndex: 1000,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Nhúng CSS hiệu ứng Hover & Active cực mượt */}
      <style>{`
        .nav-link {
          position: relative;
          color: #475569;
          font-weight: 600;
          text-decoration: none;
          padding: 6px 2px;
          font-size: 15px;
          transition: color 0.3s ease;
        }
        .nav-link:hover {
          color: #2563eb !important;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -4px;
          left: 0;
          background-color: #2563eb;
          transition: width 0.3s ease;
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .nav-active {
          color: #2563eb !important;
        }
        .nav-active::after {
          width: 100% !important;
        }
        .logout-btn {
          padding: 8px 16px;
          background-color: #fee2e2;
          color: #ef4444;
          border: none;
          border-radius: 8px;
          fontSize: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .logout-btn:hover {
          background-color: #ef4444;
          color: #ffffff;
          transform: translateY(-1px);
        }
        .login-btn {
          padding: 8px 20px;
          background-color: #2563eb;
          color: #fff;
          border-radius: 8px;
          font-weight: bold;
          text-decoration: none;
          font-size: 14px;
          transition: all 0.2s ease;
          display: inline-block;
        }
        .login-btn:hover {
          background-color: #1d4ed8;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Logo */}
        <Link to="/" style={{ fontSize: '26px', fontWeight: '850', color: '#0f172a', textDecoration: 'none', letterSpacing: '-0.5px' }}>
          {title}
        </Link>

        {/* Menu Điều Hướng Đã Việt Hóa + Hiệu Ứng */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'nav-active' : ''}`}>
            Trang Chủ
          </Link>
          <Link to="/products" className={`nav-link ${isActive('/products') ? 'nav-active' : ''}`}>
            Sản Phẩm
          </Link>
          <Link to="/about" className={`nav-link ${isActive('/about') ? 'nav-active' : ''}`}>
            Giới Thiệu
          </Link>
          <Link to="/cart" className={`nav-link ${isActive('/cart') ? 'nav-active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Giỏ Hàng 🛒
          </Link>

          {/* Xử lý hiển thị động Tên User từ Context của sốp */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '2px solid #e2e8f0', paddingLeft: '20px' }}>
              <span style={{ fontSize: '14.5px', fontWeight: '650', color: '#334155' }}>
                👋 Chào bạn, <span style={{ color: '#2563eb', fontWeight: '700' }}>{user.name || user.email || 'Thành Viên'}</span>
              </span>
              <button onClick={handleLogoutClick} className="logout-btn">
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-btn">
              Đăng Nhập
            </Link>
          )}
        </nav>

      </div>
    </header>
  );
};

export default Header;