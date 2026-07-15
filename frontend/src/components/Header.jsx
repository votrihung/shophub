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

  // Nhận diện vai trò Admin từ AuthContext
  const isAdmin = user?.role === 'ADMIN';

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
          font-size: 13px;
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
        
        <Link to="/" style={{ fontSize: '26px', fontWeight: '850', color: '#0f172a', textDecoration: 'none', letterSpacing: '-0.5px' }}>
          {title}
        </Link>

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
          
          {/* Lịch sử đơn hàng dành cho mọi người dùng đã đăng nhập */}
          {user && (
            <Link to="/orders/history" className={`nav-link ${isActive('/orders/history') ? 'nav-active' : ''}`}>
              Lịch Sử 
            </Link>
          )}

          {/* Nút Quản Lý Đơn Hàng chỉ hiển thị cho tài khoản ADMIN */}
          {user && isAdmin && (
            <Link to="/admin/orders" className={`nav-link ${isActive('/admin/orders') ? 'nav-active' : ''}`}>
              Quản lý Đơn ⚙️
            </Link>
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