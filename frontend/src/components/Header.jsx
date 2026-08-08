import { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = ({ title = "ShopHub" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const { totalQuantity } = useCart();
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);

  const adminDropdownRef = useRef(null);
  const orderDropdownRef = useRef(null);

  const isAdmin = user && (
    user.role?.toUpperCase() === 'ADMIN' || 
    user.username?.toLowerCase().includes('admin')
  );

  useEffect(() => {
    if (totalQuantity > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalQuantity]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target)) {
        setIsAdminOpen(false);
      }
      if (orderDropdownRef.current && !orderDropdownRef.current.contains(event.target)) {
        setIsOrderOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    logout();
    alert(' Đã đăng xuất tài khoản thành công!');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;
  
  const isAdminActive = isActive('/admin/dashboard') || isActive('/admin/orders') || isActive('/admin/chat');
  const isOrderActive = isActive('/cart') || isActive('/orders/history');

  return (
    <header className="header-container">
      <style>{`
        .header-container {
          background-color: #ffffff;
          border-bottom: 1px solid #f1f5f9;
          padding: 16px 24px;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          font-family: system-ui, -apple-system, sans-serif;
        }
        .header-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .brand-logo {
          font-size: 26px;
          font-weight: 850;
          color: #0f172a;
          text-decoration: none;
          letter-spacing: -0.5px;
        }
        .nav-list {
          display: flex;
          align-items: center;
          gap: 24px;
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
          background: none;
          border: none;
          cursor: pointer;
        }
        .nav-link:hover, .nav-active {
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
        .nav-link:hover::after, .nav-active::after {
          width: 100% !important;
        }
        .admin-dropdown {
          position: relative;
          display: inline-block;
        }
        .admin-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          background-color: #ffffff;
          min-width: 200px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          padding: 8px;
          margin-top: 8px;
          border: 1px solid #f1f5f9;
          z-index: 1010;
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
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .dropdown-item:hover {
          background-color: #eff6ff;
          color: #2563eb;
        }
        .cart-badge {
          background-color: #ef4444;
          color: #fff;
          font-size: 10px;
          font-weight: 800;
          border-radius: 50%;
          padding: 2px 6px;
          box-shadow: 0 2px 6px rgba(239, 68, 68, 0.4);
          line-height: 1;
        }
        .user-section {
          display: flex;
          align-items: center;
          gap: 16px;
          border-left: 2px solid #e2e8f0;
          padding-left: 20px;
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
        }
        .logout-btn:hover {
          background-color: #ef4444;
          color: #ffffff;
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
        }
        .login-btn:hover {
          background-color: #1d4ed8;
        }
        @keyframes bouncePop {
          0% { transform: scale(1); }
          50% { transform: scale(1.3) rotate(-10deg); }
          80% { transform: scale(0.9) rotate(5deg); }
          100% { transform: scale(1) rotate(0); }
        }
        .cart-bounce {
          animation: bouncePop 0.3s ease-in-out !important;
        }
      `}</style>

      <div className="header-inner">
        <Link to="/" className="brand-logo">{title}</Link>

        <nav className="nav-list">
          <Link to="/" className={`nav-link ${isActive('/') ? 'nav-active' : ''}`}>
            Trang Chủ
          </Link>
          
          <Link to="/products" className={`nav-link ${isActive('/products') ? 'nav-active' : ''}`}>
            Sản Phẩm
          </Link>
          
          <Link to="/about" className={`nav-link ${isActive('/about') ? 'nav-active' : ''}`}>
            Giới Thiệu
          </Link>

          {user && (
            <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'nav-active' : ''}`}>
              Tài Khoản
            </Link>
          )}

          <div className="admin-dropdown" ref={orderDropdownRef}>
            <button 
              type="button"
              onClick={() => setIsOrderOpen(!isOrderOpen)}
              className={`nav-link ${isOrderActive ? 'nav-active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span>Đơn Hàng</span>
              {totalQuantity > 0 && (
                <span className={`cart-badge ${isAnimating ? 'cart-bounce' : ''}`} style={{ position: 'relative', top: '0', right: '0' }}>
                  {totalQuantity}
                </span>
              )}
              <span>{isOrderOpen ? '▴' : '▾'}</span>
            </button>
            
            {isOrderOpen && (
              <div className="admin-dropdown-menu">
                <Link 
                  to="/cart" 
                  onClick={() => setIsOrderOpen(false)}
                  className={`dropdown-item ${isActive('/cart') ? 'nav-active' : ''}`}
                >
                  <span>Giỏ Hàng</span>
                  {totalQuantity > 0 && (
                    <span className="cart-badge">{totalQuantity}</span>
                  )}
                </Link>

                {user && (
                  <Link 
                    to="/orders/history" 
                    onClick={() => setIsOrderOpen(false)}
                    className={`dropdown-item ${isActive('/orders/history') ? 'nav-active' : ''}`}
                  >
                    <span>Lịch Sử Mua Hàng</span>
                  </Link>
                )}
              </div>
            )}
          </div>

          {isAdmin && (
            <div className="admin-dropdown" ref={adminDropdownRef}>
              <button 
                type="button"
                onClick={() => setIsAdminOpen(!isAdminOpen)}
                className={`nav-link ${isAdminActive ? 'nav-active' : ''}`}
              >
                Quản Trị {isAdminOpen ? '▴' : '▾'}
              </button>
              
              {isAdminOpen && (
                <div className="admin-dropdown-menu">
                  <Link 
                    to="/admin/dashboard" 
                    onClick={() => setIsAdminOpen(false)}
                    className={`dropdown-item ${isActive('/admin/dashboard') ? 'nav-active' : ''}`}
                  >
                    Thống kê Dashboard
                  </Link>
                  <Link 
                    to="/admin/orders" 
                    onClick={() => setIsAdminOpen(false)}
                    className={`dropdown-item ${isActive('/admin/orders') ? 'nav-active' : ''}`}
                  >
                    Quản lý Đơn hàng
                  </Link>
                  <Link 
                    to="/admin/chat" 
                    onClick={() => setIsAdminOpen(false)}
                    className={`dropdown-item ${isActive('/admin/chat') ? 'nav-active' : ''}`}
                  >
                    Quản lý Tin Nhắn
                  </Link>
                </div>
              )}
            </div>
          )}

          {user ? (
            <div className="user-section">
              <Link to="/profile" style={{ textDecoration: 'none', fontSize: '14.5px', fontWeight: '650', color: '#334155' }}>
                Chào bạn, <span style={{ color: '#2563eb' }}>{user.name || user.email || 'Thành Viên'}</span>
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