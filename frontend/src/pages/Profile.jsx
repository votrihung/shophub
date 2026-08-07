import { useState, useEffect } from 'react';

export default function Profile() {
  const [user, setUser] = useState({ full_name: '', phone: '', address: '' });
  const token = localStorage.getItem('token');

  // Lấy dữ liệu cũ hiển thị lên form
  useEffect(() => {
    fetch('http://127.0.0.1:8000/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUser({ full_name: data.full_name || '', phone: data.phone || '', address: data.address || '' }));
  }, []);

  // Xử lý khi bấm NÚT CẬP NHẬT
  const handleUpdate = async () => {
    const res = await fetch('http://127.0.0.1:8000/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(user)
    });
    const data = await res.json();
    alert(data.message || 'Cập nhật thành công!');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h2>Thông Tin Cá Nhân</h2>
      <input 
        type="text" 
        value={user.full_name} 
        onChange={e => setUser({...user, full_name: e.target.value})} 
        placeholder="Họ tên" 
      />
      <input 
        type="text" 
        value={user.phone} 
        onChange={e => setUser({...user, phone: e.target.value})} 
        placeholder="Số điện thoại" 
      />
      <input 
        type="text" 
        value={user.address} 
        onChange={e => setUser({...user, address: e.target.value})} 
        placeholder="Địa chỉ" 
      />

      {/* ĐÂY CHÍNH LÀ NÚT BẤM CẬP NHẬT */}
      <button onClick={handleUpdate} style={{ marginTop: '10px', padding: '10px' }}>
        CẬP NHẬT THÔNG TIN
      </button>
    </div>
  );
}