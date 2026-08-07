import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = ({ title = "ShopHub" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const { totalQuantity } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);

  const isAdmin = user && (
    user.role?.toUpperCase() === 'ADMIN' || 
    user.username?.toLowerCase().includes('admin')
  );

  useEffect(() => {
    if (totalQuantity > 0) {
      setIsAnimating(true);
    }
  }, [totalQuantity]);

  useEffect(() => {
    if (!isAnimating) return;
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [isAnimating]);

  const handleLogoutClick = () => {
    logout();
    alert('👋 Đã đăng xuất tài khoản thành công!');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;
  const isAdminActive = isActive('/admin/dashboard') || isActive('/admin/orders');

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
      <style>{`
        @keyframes bouncePop {
          0% { transform: scale(1); }
          50% { transform: scale(1.3) rotate(-10deg); }
          80% { transform: scale(0.9) rotate(5deg); }
          100% { transform: scale(1) rotate(0); }
        }
        .cart-bounce-effect {
          animation: bouncePop 0.3s ease-in-out !important;
        }
        .nav-link {
          position: relative;
          color: #475569;
          font-weight: 600;
          text-decoration: none;
          padding: 6px 2px;
          font-size: 15px;
          white-space: nowrap;
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

        /* Dropdown Menu Admin Style */
        .admin-dropdown {
          position: relative;
          display: inline-block;
        }
        .admin-dropdown-menu {
          display: none;
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          background-color: #ffffff;
          min-width: 180px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          padding: 8px;
          margin-top: 8px;
          border: 1px solid #f1f5f9;
          z-index: 1010;
        }
        .admin-dropdown:hover .admin-dropdown-menu {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .dropdown-item {
          color: #475569;
          padding: 10px 14px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          border-radius: 8px;
          white-space: nowrap;
          transition: all 0.2s ease;
        }
        .dropdown-item:hover {
          background-color: #eff6ff;
          color: #2563eb;
        }

        .logout-btn {
          padding: 8px 16px;
          background-color: #fee2e2;
          color: #ef4444;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
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
          white-space: nowrap;
        }
        .login-btn:hover {
          background-color: #1d4ed8;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        <Link to="/" style={{ fontSize: '26px', fontWeight: '850', color: '#0f172a', textDecoration: 'none', letterSpacing: '-0.5px' }}>
          {title}
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'nav-active' : ''}`}>
            Trang Chủ
          </Link>
          <Link to="/products" className={`nav-link ${isActive('/products') ? 'nav-active' : ''}`}>
            Sản Phẩm
          </Link>
          <Link to="/about" className={`nav-link ${isActive('/about') ? 'nav-active' : ''}`}>
            Giới Thiệu
          </Link>
          
          {/* Bổ sung nút Tài Khoản & Lịch Sử khi đã đăng nhập */}
          {user && (
            <>
              <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'nav-active' : ''}`}>
                Tài Khoản
              </Link>
              <Link to="/orders/history" className={`nav-link ${isActive('/orders/history') ? 'nav-active' : ''}`}>
                Lịch Sử 
              </Link>
            </>
          )}

          {isAdmin && (
            <div className="admin-dropdown">
              <span className={`nav-link ${isAdminActive ? 'nav-active' : ''}`} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                Quản Trị  ▾
              </span>
              <div className="admin-dropdown-menu">
                <Link to="/admin/dashboard" className={`dropdown-item ${isActive('/admin/dashboard') ? 'nav-active' : ''}`}>
                   Thống kê Dashboard
                </Link>
                <Link to="/admin/orders" className={`dropdown-item ${isActive('/admin/orders') ? 'nav-active' : ''}`}>
                  Quản lý Đơn hàng
                </Link>
              </div>
            </div>
          )}

          <Link 
            to="/cart" 
            className={`nav-link ${isActive('/cart') ? 'nav-active' : ''}`} 
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <div 
              className={isAnimating ? 'cart-bounce-effect' : ''} 
              style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', transition: 'transform 0.2s' }}
            >
              <span>Giỏ Hàng </span>
              {totalQuantity > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-14px',
                  backgroundColor: '#ef4444',
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: '800',
                  borderRadius: '50%',
                  padding: '2px 6px',
                  textAlign: 'center',
                  boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)',
                  lineHeight: '1'
                }}>
                  {totalQuantity}
                </span>
              )}
            </div>
          </Link>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '2px solid #e2e8f0', paddingLeft: '20px' }}>
              {/* Bấm thẳng vào tên chào mừng cũng sẽ chuyển tới /profile */}
              <Link to="/profile" style={{ textDecoration: 'none', fontSize: '14.5px', fontWeight: '650', color: '#334155', whiteSpace: 'nowrap' }}>
                👋 Chào bạn, <span style={{ color: '#2563eb', fontWeight: '700' }}>{user.name || user.email || 'Thành Viên'}</span>
              </Link>
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