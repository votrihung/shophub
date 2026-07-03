import { NavLink } from 'react-router-dom';

const Header = ({ title }) => {
  const navItems = [
    { label: 'Home', to: '/' },
    { label: 'Products', to: '/products' },
    { label: 'About', to: '/about' }, // Thêm trang About theo yêu cầu bài Lab
    { label: 'Cart', to: '/cart' },
    { label: 'Login', to: '/login' },
  ];

  const linkStyle = ({ isActive }) => ({
    marginRight: '12px',
    textDecoration: 'none',
    color: isActive ? '#1976d2' : '#555',
    fontWeight: isActive ? 'bold' : 'normal',
  });

  return (
    <header style={{ padding: '16px 24px', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <h1 style={{ margin: 0 }}>{title}</h1>
      <nav>
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} style={linkStyle}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
};

export default Header;