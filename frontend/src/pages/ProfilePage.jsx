import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'security' | 'orders' | 'settings'

  // State thông tin cá nhân
  const [profile, setProfile] = useState({
    email: user?.email || '',
    full_name: user?.name || user?.full_name || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  // State đổi mật khẩu
  const [passwords, setPasswords] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });

  // State cài đặt thông báo
  const [settings, setSettings] = useState({
    emailNotify: true,
    promoNotify: false,
    orderNotify: true
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://shophub-production-c481.up.railway.app/auth/me')
      .then(res => {
        setProfile({
          email: res.data.email || '',
          full_name: res.data.full_name || res.data.name || '',
          phone: res.data.phone || '',
          address: res.data.address || ''
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi lấy thông tin:", err);
        setLoading(false);
      });
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('https://shophub-production-c481.up.railway.app/auth/profile', {
        full_name: profile.full_name,
        phone: profile.phone,
        address: profile.address
      });
      alert(res.data.message || " Cập nhật thông tin thành công!");
    } catch (err) {
      alert(" Lỗi: " + (err.response?.data?.detail || "Không thể cập nhật"));
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.new_password !== passwords.confirm_password) {
      alert(" Mật khẩu xác nhận không khớp!");
      return;
    }
    try {
      const res = await axios.put('https://shophub-production-c481.up.railway.app/auth/change-password', {
        old_password: passwords.old_password,
        new_password: passwords.new_password
      });
      alert(res.data.message || " Đổi mật khẩu thành công!");
      setPasswords({ old_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      alert(" Lỗi: " + (err.response?.data?.detail || "Mật khẩu cũ không đúng"));
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
        Đang tải thông tin tài khoản...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 20px', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* HEADER TỔNG QUAN USER */}
      <div style={{ 
        backgroundColor: '#ffffff', 
        borderRadius: '12px', 
        padding: '24px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '20px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        marginBottom: '24px',
        border: '1px solid #f1f5f9'
      }}>
        <div style={{ 
          width: '64px', 
          height: '64px', 
          borderRadius: '50%', 
          backgroundColor: '#eff6ff', 
          color: '#2563eb', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '24px',
          fontWeight: 'bold',
          border: '2px solid #bfdbfe'
        }}>
          {(profile.full_name || profile.email || 'U').charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 4px 0', color: '#0f172a' }}>
            {profile.full_name || 'Thành viên ShopHub'}
          </h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>{profile.email}</p>
        </div>
      </div>

      {/* CẤU TRÚC 2 CỘT: SIDEBAR DẠNG TAB + CONTENT */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* SIDEBAR DÂN HƯỚNG */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
          <button 
            onClick={() => setActiveTab('profile')}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '12px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'profile' ? '#eff6ff' : 'transparent',
              color: activeTab === 'profile' ? '#2563eb' : '#475569',
              fontWeight: activeTab === 'profile' ? '700' : '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '14px',
              marginBottom: '4px'
            }}
          >
            👤 Thông tin cá nhân
          </button>

          <button 
            onClick={() => setActiveTab('security')}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '12px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'security' ? '#eff6ff' : 'transparent',
              color: activeTab === 'security' ? '#2563eb' : '#475569',
              fontWeight: activeTab === 'security' ? '700' : '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '14px',
              marginBottom: '4px'
            }}
          >
            🔒 Bảo mật & Đổi mật khẩu
          </button>

          <button 
            onClick={() => setActiveTab('orders')}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '12px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'orders' ? '#eff6ff' : 'transparent',
              color: activeTab === 'orders' ? '#2563eb' : '#475569',
              fontWeight: activeTab === 'orders' ? '700' : '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '14px',
              marginBottom: '4px'
            }}
          >
            📦 Đơn hàng của tôi
          </button>

          <button 
            onClick={() => setActiveTab('settings')}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '12px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'settings' ? '#eff6ff' : 'transparent',
              color: activeTab === 'settings' ? '#2563eb' : '#475569',
              fontWeight: activeTab === 'settings' ? '700' : '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '14px'
            }}
          >
            ⚙️ Cài đặt & Thông báo
          </button>
        </div>

        {/* BẢNG NỘI DUNG HIỂN THỊ THEO TAB */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
          
          {/* TAB 1: THÔNG TIN CÁ NHÂN */}
          {activeTab === 'profile' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                Hồ Sơ Cá Nhân
              </h3>
              <form onSubmit={handleUpdateProfile}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Email (không thể thay đổi):</label>
                  <input type="text" value={profile.email} disabled style={{ width: '100%', padding: '10px 14px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#64748b', boxSizing: 'border-box' }} />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Họ và tên:</label>
                  <input 
                    type="text" 
                    value={profile.full_name} 
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} 
                    placeholder="Nhập họ tên của bạn..."
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }} 
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Số điện thoại:</label>
                  <input 
                    type="text" 
                    value={profile.phone} 
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })} 
                    placeholder="Nhập số điện thoại..."
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }} 
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Địa chỉ nhận hàng mặc định:</label>
                  <textarea 
                    rows="3"
                    value={profile.address} 
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })} 
                    placeholder="Nhập số nhà, tên đường, phường/xã, quận/huyện..."
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', fontFamily: 'inherit' }} 
                  />
                </div>

                <button type="submit" style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '10px 24px', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                  Lưu Thay Đổi
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: BẢO MẬT & ĐỔI MẬT KHẨU */}
          {activeTab === 'security' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                Đổi Mật Khẩu
              </h3>
              <form onSubmit={handleChangePassword} style={{ maxWidth: '480px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Mật khẩu hiện tại:</label>
                  <input 
                    type="password" 
                    required 
                    value={passwords.old_password} 
                    onChange={(e) => setPasswords({ ...passwords, old_password: e.target.value })}
                    placeholder="••••••••"
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }} 
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Mật khẩu mới:</label>
                  <input 
                    type="password" 
                    required 
                    value={passwords.new_password} 
                    onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                    placeholder="Tối thiểu 6 ký tự"
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }} 
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Xác nhận mật khẩu mới:</label>
                  <input 
                    type="password" 
                    required 
                    value={passwords.confirm_password} 
                    onChange={(e) => setPasswords({ ...passwords, confirm_password: e.target.value })}
                    placeholder="Nhập lại mật khẩu mới"
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }} 
                  />
                </div>

                <button type="submit" style={{ backgroundColor: '#059669', color: '#ffffff', padding: '10px 24px', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                  Cập Nhật Mật Khẩu
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: ĐƠN HÀNG CỦA TÔI */}
          {activeTab === 'orders' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                Đơn Hàng Của Tôi
              </h3>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
                Quản lý và theo dõi tiến độ các đơn hàng bạn đã mua tại ShopHub.
              </p>
              <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
                <p style={{ margin: '0 0 16px 0', color: '#475569', fontWeight: '500' }}>Xem danh sách đầy đủ các đơn hàng đã đặt</p>
                <Link to="/orders/history" style={{ display: 'inline-block', backgroundColor: '#2563eb', color: '#fff', textDecoration: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', fontSize: '14px' }}>
                  Xem Lịch Sử Đơn Hàng →
                </Link>
              </div>
            </div>
          )}

          {/* TAB 4: CÀI ĐẶT & THÔNG BÁO */}
          {activeTab === 'settings' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                Cài Đặt & Tùy Chọn
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', cursor: 'pointer' }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>Cập nhật trạng thái đơn hàng</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Gửi email khi đơn hàng chuyển sang trạng thái mới</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={settings.orderNotify} 
                    onChange={(e) => setSettings({ ...settings, orderNotify: e.target.checked })} 
                    style={{ width: '18px', height: '18px', accentColor: '#2563eb' }}
                  />
                </label>

                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', cursor: 'pointer' }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>Thông báo khuyến mãi & mã giảm giá</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Nhận các ưu đãi đặc biệt dành riêng cho thành viên</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={settings.promoNotify} 
                    onChange={(e) => setSettings({ ...settings, promoNotify: e.target.checked })} 
                    style={{ width: '18px', height: '18px', accentColor: '#2563eb' }}
                  />
                </label>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;