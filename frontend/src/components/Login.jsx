import React, { useState } from 'react';

const Login = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false); // Chuyển đổi giữa Đăng nhập và Đăng ký
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Xác định cổng API cần gọi dựa trên trạng thái form
    const endpoint = isRegister ? '/auth/register' : '/auth/login';
    
    try {
      // ÉP CHẠY SỐ ĐỊA CHỈ: Gọi đích danh 127.0.0.1 để bỏ qua lỗi phân giải IPv6 của Vite
      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Có lỗi xảy ra, vui lòng thử lại!');
      }

      if (isRegister) {
        setMessage('Đăng ký tài khoản thành công! Hãy chuyển sang Đăng nhập.');
        setIsRegister(false); // Đăng ký xong tự chuyển sang form đăng nhập luôn
      } else {
        setMessage('Đăng nhập thành công!');
        if (onLoginSuccess) onLoginSuccess(data.user); // Trả thông tin user về App chính
      }
      
      // Xóa trống ô nhập liệu sau khi thành công
      setUsername('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'Arial' }}>
      <h2>{isRegister ? 'Đăng Ký Tài Khoản' : 'Đăng Nhập Hệ Thống'}</h2>
      
      {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Tài khoản:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Mật khẩu:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {isRegister ? 'Đăng Ký ngay' : 'Đăng Nhập'}
        </button>
      </form>

      <p style={{ marginTop: '15px', textAlign: 'center', fontSize: '14px' }}>
        {isRegister ? 'Đã có tài khoản? ' : 'Chưa có tài khoản? '}
        <span 
          onClick={() => { setIsRegister(!isRegister); setMessage(''); setError(''); }} 
          style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {isRegister ? 'Đăng nhập tại đây' : 'Đăng ký ngay'}
        </span>
      </p>
    </div>
  );
};

export default Login;