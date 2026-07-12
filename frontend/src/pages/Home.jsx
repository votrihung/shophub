import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsApi } from '../api/productsApi'; 

const Home = () => {
  const navigate = useNavigate();
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPopup, setShowPopup] = useState(true);

  const [realProducts, setRealProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const slides = [
    {
      badge: "🔥 Khuyến mãi đón tuần mới!",
      title: "Thế Giới Công Nghệ\nTrong Tầm Tay",
      desc: "Trải nghiệm các dòng sản phẩm Apple chính hãng với mức giá ưu đãi tốt nhất hệ thống và chính sách bảo hành vượt trội.",
      img: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=500&q=80",
      bg: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)"
    },
    {
      badge: "🚀 Siêu Phẩm Cực Hot 2026",
      title: "Nâng Tầm Đẳng Cấp\nCùng iPhone Mới",
      desc: "Sở hữu ngay hệ thống camera đỉnh cao và hiệu năng AI bứt phá. Trả góp 0% nhận máy liền tay.",
      img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80",
      bg: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
    },
    {
      badge: "💻 Làm Việc Đỉnh Cao",
      title: "MacBook Pro M-Series\nSức Mạnh Vô Song",
      desc: "Thời lượng pin cân cả ngày dài cùng màn hình Liquid Retina XDR siêu mượt. Giảm thẳng 3 triệu cho học sinh - sinh viên.",
      img: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=500&q=80",
      bg: "linear-gradient(135deg, #b45309 0%, #d97706 100%)"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        const data = await productsApi.getAll();
        let list = [];
        if (Array.isArray(data)) list = data;
        else if (data?.products) list = data.products;
        else if (data?.data) list = data.data.products || data.data;

        setRealProducts(list.slice(0, 4));
      } catch (err) {
        console.error("Lỗi đồng bộ sản phẩm tại trang Home:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeProducts();
  }, []);

  const checkAuthAndNavigate = (targetPath) => {
    const user = localStorage.getItem('user') || localStorage.getItem('shophub_user') || localStorage.getItem('token') || localStorage.getItem('shophub_token');
    if (user) {
      navigate(targetPath);
    } else {
      alert("Bạn cần đăng nhập hệ thống để xem chi tiết sản phẩm và danh mục!");
      navigate('/login');
    }
  };

  const tags = ["Hot", "Bán Chạy", "Premium", "New"];

  return (
    <div style={{ backgroundColor: '#f8fafc', paddingBottom: '64px', position: 'relative', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      
      <style>{`
        .category-card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; }
        .category-card:hover { transform: translateY(-8px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1) !important; border-color: #3b82f6 !important; }
        .category-card:hover img { transform: scale(1.1); }
        .category-card img { transition: transform 0.4s ease; }
        .product-preview-card { transition: all 0.3s ease; }
        .product-preview-card:hover { transform: scale(1.03); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05) !important; }
        @keyframes fadeInScale { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .popup-animate { animation: fadeInScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
        
        {/* ================= 1. BANNER SLIDER ================= */}
        <div style={{
          background: slides[currentSlide].bg,
          borderRadius: '28px',
          padding: '48px',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '32px',
          boxShadow: '0 20px 40px -15px rgba(37, 99, 235, 0.25)',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '280px'
        }}>
          <button 
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold', zIndex: 10 }}
          >&#10094;</button>
          <button 
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold', zIndex: 10 }}
          >&#10095;</button>

          <div style={{ flex: '1.2', minWidth: '300px' }}>
            <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '13px', fontWeight: '700', padding: '6px 16px', borderRadius: '9999px', backdropFilter: 'blur(4px)' }}>
              {slides[currentSlide].badge}
            </span>
            <h1 style={{ fontSize: '42px', fontWeight: '850', marginTop: '20px', marginBottom: '16px', lineHeight: '1.25', whiteSpace: 'pre-line' }}>
              {slides[currentSlide].title}
            </h1>
            <p style={{ color: '#e0e7ff', fontSize: '15.5px', marginBottom: '28px', lineHeight: '1.6' }}>
              {slides[currentSlide].desc}
            </p>
            
            {/* KHU VỰC CÁC NÚT BẤM ĐIỀU HƯỚNG */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => checkAuthAndNavigate('/products')}
                style={{ backgroundColor: '#ffffff', color: '#1e40af', fontWeight: '800', padding: '14px 32px', borderRadius: '14px', border: 'none', cursor: 'pointer', fontSize: '15px', boxShadow: '0 10px 20px rgba(0,0,0,0.15)' }}
              >
                Khám Phá Cửa Hàng 
              </button>
              
              {/* ĐÃ CẬP NHẬT: CLICK VÀO ĐÂY LÀ CHUYỂN TRANG SANG /gioi-thieu LUÔN */}
              <button 
                onClick={() => checkAuthAndNavigate('/gioi-thieu')}
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', fontWeight: '700', padding: '14px 32px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.4)', cursor: 'pointer', fontSize: '15px', backdropFilter: 'blur(4px)', transition: 'background 0.3s' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.25)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'}
              >
                Giới Thiệu Hệ Thống 
              </button>
            </div>
          </div>
          
          <div style={{ flex: '0.8', minWidth: '280px', display: 'flex', justifyContent: 'center' }}>
            <img key={currentSlide} src={slides[currentSlide].img} alt="Banner" style={{ width: '100%', maxWidth: '380px', height: '250px', objectFit: 'cover', borderRadius: '20px', boxShadow: '0 25px 30px -10px rgba(0, 0, 0, 0.4)', animation: 'fadeInScale 0.6s ease' }} />
          </div>
        </div>

        {/* ================= GIỮ NGUYÊN KHỐI GIỚI THIỆU GIAO DIỆN Ở TRANG CHỦ THEO Ý SỐP ================= */}
        <div id="shophub-about-section" style={{ marginTop: '56px', backgroundColor: '#ffffff', borderRadius: '24px', padding: '36px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ color: '#2563eb', fontSize: '13px', fontWeight: '800', letterSpacing: '0.05em', textTransform: 'uppercase', backgroundColor: '#eff6ff', padding: '6px 16px', borderRadius: '9999px' }}>
              Chúng tôi là ShopHub
            </span>
            <h2 style={{ fontSize: '26px', fontWeight: '850', color: '#0f172a', marginTop: '12px', marginBottom: '8px' }}>Hệ Thống Bán Lẻ Công Nghệ Cao Cấp</h2>
            <p style={{ color: '#64748b', fontSize: '15px', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
              Được thành lập với sứ mệnh mang lại trải nghiệm số đỉnh cao, ShopHub chuyên cung cấp các giải pháp thiết bị di động, máy tính và đồ chơi công nghệ hệ sinh thái thông minh dẫn đầu thị trường 2026.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>✨</div>
              <h4 style={{ fontSize: '16.5px', fontWeight: '800', color: '#1e293b', margin: '0 0 8px 0' }}>Sản Phẩm Tối Thượng</h4>
              <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>Cam kết 100% chính hãng. Mọi thiết bị đều trải qua quy trình kiểm thử chất lượng đầu vào nghiêm ngặt.</p>
            </div>

            <div style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🚚</div>
              <h4 style={{ fontSize: '16.5px', fontWeight: '800', color: '#1e293b', margin: '0 0 8px 0' }}>Vận Chuyển Siêu Tốc</h4>
              <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>Giao hàng hỏa tốc nội thành Ho Chi Minh City trong 2 giờ. Bảo hiểm hàng hóa toàn diện suốt hành trình.</p>
            </div>

            <div style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🛡️</div>
              <h4 style={{ fontSize: '16.5px', fontWeight: '800', color: '#1e293b', margin: '0 0 8px 0' }}>Bảo Hành Vượt Trội</h4>
              <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>Chính sách 1 đổi 1 lên tới 45 ngày đầu. Đội ngũ chuyên viên xử lý kỹ thuật túc trực hỗ trợ 24/7.</p>
            </div>
          </div>
        </div>

        {/* ================= 2. DANH MỤC NỔI BẬT ================= */}
        <div style={{ marginTop: '56px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Danh Mục Sản Phẩm</h2>
              <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0 0' }}>Bấm chọn để vào khu vực mua sắm VIP của ShopHub</p>
            </div>
            <button onClick={() => checkAuthAndNavigate('/products')} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '700', cursor: 'pointer' }}>
              Xem tất cả cửa hàng &rarr;
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div className="category-card" onClick={() => checkAuthAndNavigate('/products')} style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '28px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=200&q=80" alt="iPhone" style={{ width: '100px', height: '100px', objectFit: 'contain', marginBottom: '20px' }} />
              <h3 style={{ fontSize: '19px', fontWeight: '800', color: '#1e293b', margin: '0 0 6px 0' }}>iPhone Series</h3>
              <p style={{ color: '#64748b', fontSize: '13.5px', margin: 0 }}>Đỉnh cao cấu hình, mượt mà tinh tế bậc nhất</p>
            </div>

            <div className="category-card" onClick={() => checkAuthAndNavigate('/products')} style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '28px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <img src="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=200&q=80" alt="Macbook" style={{ width: '100px', height: '100px', objectFit: 'contain', marginBottom: '20px' }} />
              <h3 style={{ fontSize: '19px', fontWeight: '800', color: '#1e293b', margin: '0 0 6px 0' }}>MacBook Pro & Air</h3>
              <p style={{ color: '#64748b', fontSize: '13.5px', margin: 0 }}>Hiệu năng tối thượng cân trọn mọi tác vụ nặng</p>
            </div>

            <div className="category-card" onClick={() => checkAuthAndNavigate('/products')} style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '28px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <img src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=200&q=80" alt="iPad" style={{ width: '100px', height: '100px', objectFit: 'contain', marginBottom: '20px' }} />
              <h3 style={{ fontSize: '19px', fontWeight: '800', color: '#1e293b', margin: '0 0 6px 0' }}>iPad Đa Năng</h3>
              <p style={{ color: '#64748b', fontSize: '13.5px', margin: 0 }}>Sáng tạo không giới hạn, vẽ vời xem phim đỉnh cao</p>
            </div>
          </div>
        </div>

        {/* ================= 3. KHU VỰC SẢN PHẨM DỮ LIỆU THẬT DÀNH CHO KHÁCH KHAM KHẢO ================= */}
        <div style={{ marginTop: '60px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Sản Phẩm Đang Hot</h2>
            <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0 0' }}>Dữ liệu thời gian thực cập nhật từ hệ thống chính hãng ShopHub</p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontWeight: '600' }}>Đang đồng bộ kho sản phẩm thật...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {realProducts.map((p, index) => (
                <div 
                  key={p.id}
                  className="product-preview-card"
                  style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', position: 'relative' }}
                >
                  {/* Tag ngẫu nhiên lấy theo chỉ mục mảng */}
                  <span style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: '#ef4444', color: '#fff', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '6px' }}>
                    {tags[index % tags.length]}
                  </span>
                  <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                    <img src={p.imageUrl || p.image || 'https://via.placeholder.com/150'} alt={p.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                  </div>
                  <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0', minHeight: '44px', lineHeight: '1.4' }}>{p.name}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <span style={{ color: '#ef4444', fontWeight: '800', fontSize: '16px' }}>{Number(p.price).toLocaleString('vi-VN')}đ</span>
                    <button 
                      onClick={() => checkAuthAndNavigate(`/products/${p.id}`)}
                      style={{ backgroundColor: '#eff6ff', color: '#2563eb', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '750', cursor: 'pointer' }}
                    >
                      Xem Chi Tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ================= 4. POPUP QUẢNG CÁO ================= */}
      {showPopup && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="popup-animate" style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '32px', maxWidth: '420px', width: '90%', textAlign: 'center', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <button onClick={() => setShowPopup(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: '#f1f5f9', border: 'none', fontSize: '18px', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', color: '#64748b' }}>&times;</button>
            <span style={{ fontSize: '48px' }}>🎉</span>
            <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', marginTop: '16px', marginBottom: '8px' }}>Ưu Đãi Độc Quyền ShopHub!</h3>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.5', marginBottom: '24px' }}>Chào mừng sốp đã ghé thăm Premium Store. Nhập ngay mã <strong style={{ color: '#2563eb' }}>HUB2026</strong> giảm ngay 10% cho đơn hàng công nghệ đầu tiên!</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={() => { setShowPopup(false); checkAuthAndNavigate('/products'); }} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>Nhận Ưu Đãi Mua Sắm Ngay</button>
              <button onClick={() => setShowPopup(false)} style={{ backgroundColor: 'transparent', color: '#64748b', border: 'none', padding: '10px', fontSize: '13px', cursor: 'pointer' }}>Để sau, tui muốn xem tiếp</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;