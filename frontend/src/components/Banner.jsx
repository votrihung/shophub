import { Link } from 'react-router-dom';

const Banner = ({ subtitle, buttonText }) => {
  return (
    <div style={{ backgroundColor: '#f5f5f5', padding: '48px 24px', textAlign: 'center', borderBottom: '1px solid #eee' }}>
      <p style={{ fontSize: '1.2rem', color: '#666' }}>{subtitle}</p>
      <Link to="/products" style={{ display: 'inline-block', marginTop: '12px', padding: '10px 20px', backgroundColor: '#1976d2', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
        {buttonText}
      </Link>
    </div>
  );
};

export default Banner;