// src/pages/About.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  // Danh sách các dòng sản phẩm cốt lõi
  const coreProducts = [
    {
      icon: "📱",
      title: "iPhone Premium",
      desc: "Hệ thống máy mới, máy lướt nguyên bản 100%. Cam kết chất lượng đầu vào khắt khe, đầy đủ VAT và bảo hành quốc tế.",
      color: "#3b82f6"
    },
    {
      icon: "💻",
      title: "MacBook Siêu Cấu Hình",
      desc: "Cung cấp các dòng chip M-Series hiệu năng tối thượng đáp ứng trọn vẹn từ thiết kế đồ họa đến lập trình chuyên sâu.",
      color: "#10b981"
    },
    {
      icon: "🎧",
      title: "Hệ Sinh Thái Apple",
      desc: "Đầy đủ các dòng iPad, Apple Watch và phụ kiện chính hãng mang lại trải nghiệm đồng bộ đỉnh cao cho người dùng.",
      color: "#8b5cf6"
    }
  ];

  // Các con số thống kê ấn tượng
  const stats = [
    { value: "99%", label: "Khách Hàng Hài Lòng" },
    { value: "50K+", label: "Thiết Bị Đã Bán" },
    { value: "24/7", label: "Hỗ Trợ Kỹ Thuật" },
    { value: "45 Ngày", label: "1 Đổi 1 Miễn Phí" }
  ];

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '48px 16px', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* KHU VỰC ĐỊNH NGHĨA CSS EFFECT BẰNG TAG STYLE */}
      <style>{`
        @keyframes floatEffect {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes glowPulse {
          0% { box-shadow: 0 0 5px rgba(37, 99, 235, 0.2); }
          50% { box-shadow: 0 0 20px rgba(37, 99, 235, 0.6); }
          100% { box-shadow: 0 0 5px rgba(37, 99, 235, 0.2); }
        }
        @keyframes shine {
          100% { left: 125%; }
        }
        .hero-banner {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          position: relative;
          overflow: hidden;
        }
        .hero-banner::before {
          content: '';
          position: absolute;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
          border-radius: 50%;
          top: -150px;
          right: -150px;
        }
        .hover-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        .hover-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: -75%;
          width: 50%;
          height: 100%;
          background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3), transparent);
          transform: skewX(-25deg);
        }
        .hover-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1) !important;
          border-color: currentColor !important;
        }
        .hover-card:hover::after {
          animation: shine 0.85s ease;
        }
        .gradient-text {
          background: linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% auto;
        }
        .btn-premium {
          transition: all 0.3s ease;
        }
        .btn-premium:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 20px rgba(37, 99, 235, 0.4);
        }
      `}</style>

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* ================= SECTION 1: HERO BANNER (GIỚI THIỆU WEB) ================= */}
        <div className="hero-banner" style={{ borderRadius: '32px', padding: '64px 32px', color: '#ffffff', textAlign: 'center', marginBottom: '56px', boxShadow: '0 20px 40px -15px rgba(15,23,42,0.3)' }}>
          <span style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', fontSize: '13px', fontWeight: '800', padding: '6px 18px', borderRadius: '9999px', border: '1px solid rgba(59, 130, 246, 0.3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Welcome to ShopHub 🚀
          </span>
          <h1 style={{ fontSize: '42px', fontWeight: '850', marginTop: '20px', marginBottom: '16px', letterSpacing: '-0.02em', lineHeight: '1.25' }}>
            Nền Tảng Mua Sắm Công Nghệ Thế Hệ Mới
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '16.5px', maxWidth: '750px', margin: '0 auto 32px auto', lineHeight: '1.75' }}>
            Được phát triển bền vững đến năm 2026, <strong style={{ color: '#fff' }}>ShopHub</strong> tự hào là hệ thống thương mại điện tử chuyên biệt cung cấp các dòng sản phẩm công nghệ cao cấp. Chúng tôi tối ưu hóa trải nghiệm mua sắm bằng giao diện hiện đại, quy trình thanh toán bảo mật tuyệt đối và hệ thống vận chuyển thần tốc.
          </p>
          <button 
            onClick={() => navigate('/products')}
            className="btn-premium"
            style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '16px 40px', borderRadius: '16px', fontSize: '15px', fontWeight: '800', cursor: 'pointer', animation: 'glowPulse 2s infinite' }}
          >
            Ghé Thăm Cửa Hàng Ngay 🛍️
          </button>
        </div>

        {/* ================= SECTION 2: HỆ THỐNG SẢN PHẨM CỐT LÕI ================= */}
        <div style={{ marginBottom: '56px' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '850', color: '#0f172a', margin: 0 }}>
              Hệ Sinh Thái <span className="gradient-text">Sản Phẩm Độc Quyền</span>
            </h2>
            <p style={{ color: '#64748b', fontSize: '15px', marginTop: '8px' }}>ShopHub cam kết mang đến tay người tiêu dùng những thiết bị đẳng cấp cùng chế độ hậu mãi tối thượng</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
            {coreProducts.map((item, idx) => (
              <div 
                key={idx} 
                className="hover-card" 
                style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '36px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.01)', color: item.color }}
              >
                {/* Thanh màu đầu Card */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '5px', backgroundColor: item.color }} />
                
                <div style={{ width: '60px', height: '60px', borderRadius: '18px', backgroundColor: `${item.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', marginBottom: '24px' }}>
                  {item.icon}
                </div>
                
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b', margin: '0 0 12px 0' }}>{item.title}</h3>
                <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.65', margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ================= SECTION 3: CÁC CON SỐ ẤN TƯỢNG (HIỆU ỨNG THỐNG KÊ) ================= */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '28px', padding: '48px 24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)', marginBottom: '56px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', textAlign: 'center' }}>
            {stats.map((stat, idx) => (
              <div key={idx} style={{ animation: 'floatEffect 4s ease-in-out infinite', animationDelay: `${idx * 0.4}s` }}>
                <div style={{ fontSize: '40px', fontWeight: '900', color: '#2563eb', marginBottom: '8px', letterSpacing: '-0.03em' }}>
                  {stat.value}
                </div>
                <div style={{ color: '#475569', fontSize: '14px', fontWeight: '700', uppercase: 'true' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= SECTION 4: CAM KẾT VÀ TẦM NHÌN ================= */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', alignItems: 'center', background: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)', padding: '44px', borderRadius: '28px', border: '1px solid #dbeafe' }}>
          <div style={{ flex: '1', minWidth: '280px' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '850', color: '#1e3a8a', margin: '0 0 14px 0' }}>Tầm Nhìn Công Nghệ Đến 2026</h3>
            <p style={{ color: '#1e40af', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>
              Không chỉ dừng lại ở một cửa hàng bán lẻ trực tuyến, ShopHub định hướng trở thành một hệ sinh thái kết nối đam mê số. Nơi mọi quý khách hàng đều nhận được giá trị thực chất, chế độ hậu mãi tận tâm trọn đời sản phẩm và sự an tâm tuyệt đối trên từng giao dịch trực tuyến.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button 
              onClick={() => navigate('/')}
              className="btn-premium"
              style={{ backgroundColor: '#ffffff', color: '#2563eb', border: '1px solid #2563eb', padding: '14px 28px', borderRadius: '12px', fontWeight: '750', cursor: 'pointer', fontSize: '14.5px' }}
            >
              Quay Về Trang Chủ 🏠
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;