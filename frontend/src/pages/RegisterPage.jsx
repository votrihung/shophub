// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    fullName: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      // 🌟 ĐÃ SỬA: Map đúng chuẩn cấu hình FastAPI mong đợi
      const payload = {
        username: form.email,     // Backend nhận key 'username' với giá trị là email từ form
        full_name: form.fullName, // Giữ nguyên
        password: form.password,  // Giữ nguyên
      };
      
      // Gọi API đến Endpoint /auth/register
      await authApi.register(payload);
      
      setSuccessMessage('🎉 Đăng ký tài khoản thành công! Sốp đang chuyển hướng sang trang Đăng nhập...');
      setForm({ email: '', fullName: '', password: '' });
      
      // Đợi 2 giây cho khách đọc thông báo rồi tự động đá sang trang Login luôn cho mượt
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data) {
        console.error("📋 Lỗi chi tiết từ Server FastAPI:", err.response.data);
      } else {
        console.error("📋 Lỗi kết nối hệ thống mạng:", err.message);
      }
      
      setError('❌ Đăng ký thất bại. Email có thể đã tồn tại hoặc dữ liệu chưa đúng form!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '75vh', backgroundColor: '#f8fafc', padding: '16px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '420px', backgroundColor: '#ffffff', borderRadius: '16px', padding: '32px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}>
        
        <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>Tạo Tài Khoản Mới</h2>
        <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748b', marginBottom: '28px' }}>Gia nhập ShopHub để nhận nhiều ưu đãi công nghệ</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Địa chỉ Email *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="name@example.com"
              required
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Họ và Tên *</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Nhập đầy đủ họ tên..."
              required
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Mật khẩu bảo mật *</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Tối thiểu 6 ký tự..."
              required
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '12px', backgroundColor: loading ? '#94a3b8' : '#2563eb', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s', marginTop: '8px' }}
          >
            {loading ? 'Đang tạo tài khoản...' : 'Đăng Ký Ngay 🚀'}
          </button>
        </form>

        {error && <p style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', marginTop: '16px', textAlign: 'center', border: '1px solid #fee2e2' }}>{error}</p>}
        {successMessage && <p style={{ color: '#16a34a', backgroundColor: '#f0fdf4', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', marginTop: '16px', textAlign: 'center', border: '1px solid #dcfce7' }}>{successMessage}</p>}

        <p style={{ textAlign: 'center', fontSize: '13.5px', color: '#64748b', marginTop: '24px', marginBottom: 0 }}>
          Đã có tài khoản rồi?{' '}
          <span onClick={() => navigate('/login')} style={{ color: '#2563eb', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}>
            Đăng nhập tại đây
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;