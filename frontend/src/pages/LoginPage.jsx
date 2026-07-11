// src/pages/LoginPage.jsx
import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/auth/login', {
        username: formData.email,
        password: formData.password
      });
      
      // 🌟 KHẮC PHỤC: Backend chỉ trả về user chứ không có token.
      // Ta lấy thông tin user ra, đổi key 'username' thành 'name' để Header hiển thị đẹp đẽ!
      if (response.data?.user) {
        const rawUser = response.data.user;
        const mappedUser = {
          id: rawUser.id,
          name: rawUser.username ? rawUser.username.split('@')[0] : 'Thành Viên', // Lấy phần trước chữ @ làm tên hiển thị
          email: rawUser.username
        };

        // Tạo một token giả định vì backend không dùng JWT token bảo mật phức tạp
        const fakeToken = `shophub-session-${rawUser.id}`;

        // Kích hoạt trạng thái đăng nhập hệ thống
        login(fakeToken, mappedUser);
        alert('🎉 Đăng nhập thành công sốp ơi!');
        navigate('/products');
      } else {
        setError('Đăng nhập thất bại hoặc cấu trúc phản hồi không hợp lệ.');
      }
    } catch (err) {
      console.error(err);
      const detailError = err.response?.data?.detail;
      if (Array.isArray(detailError)) {
        setError(`Lỗi dữ liệu: Trường ${detailError[0]?.loc?.[1]} bị ${detailError[0]?.msg}`);
      } else {
        setError(typeof detailError === 'string' ? detailError : 'Tài khoản hoặc mật khẩu không chính xác!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '60px auto', padding: '32px', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '8px', fontWeight: '800' }}>Chào Mừng Trở Lại</h2>
      <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Đăng nhập tài khoản để quản lý đơn hàng của bạn</p>
      
      {error && <div style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13.5px', fontWeight: '600' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Địa chỉ Email *</label>
          <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="test123@gmail.com" style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Mật khẩu *</label>
          <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }} />
        </div>

        <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}>
          {loading ? 'Đang xác thực thông tin...' : 'Đăng Nhập Hệ Thống 🔑'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13.5px', color: '#64748b' }}>
        Chưa có tài khoản thành viên? <Link to="/register" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>Đăng ký tài khoản mới</Link>
      </p>
    </div>
  );
};

export default LoginPage;