// Giao diện trang Giỏ hàng & Thanh toán độc lập
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsApi } from '../api/productsApi';

const Cart = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 💾 Đồng bộ giỏ hàng từ LocalStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('shophub_cart');
    return savedCart ? JSON.parse(savedCart) : {};
  });

  // State lưu trữ thông tin nhập Form của khách hàng
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    note: ''
  });

  useEffect(() => {
    localStorage.setItem('shophub_cart', JSON.stringify(cart));
  }, [cart]);

  // Lấy data sản phẩm gốc từ backend về để đối chiếu thông tin (Tên, Giá, Hình ảnh)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsApi.getAll();
        if (Array.isArray(data)) setAllProducts(data);
        else if (data?.products) setAllProducts(data.products);
        else if (data?.data) setAllProducts(data.data.products || data.data);
      } catch (err) {
        console.error("Không lấy được danh sách sản phẩm đối chiếu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Thay đổi số lượng sản phẩm (+1 hoặc -1)
  const updateQuantity = (productId, amount) => {
    setCart(prev => {
      const currentQty = prev[productId] || 0;
      const newQty = currentQty + amount;
      if (newQty <= 0) {
        const { [productId]: _, ...rest } = prev; // Tự động xóa khỏi giỏ nếu số lượng về 0
        return rest;
      }
      return { ...prev, [productId]: newQty };
    });
  };

  // Nút xóa nhanh sản phẩm ra khỏi giỏ hàng
  const removeProduct = (productId) => {
    setCart(prev => {
      const { [productId]: _, ...rest } = prev;
      return rest;
    });
  };

  // Cập nhật giá trị khi người dùng gõ vào các ô Input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  // Xử lý nút bấm Đặt hàng cuối cùng
  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address) {
      alert('vui lòng điền đầy đủ các thông tin có dấu (*) nha!');
      return;
    }

    // Thông báo đặt hàng thành công (Mốt mình kết nối xuống DB PostgreSQL sau)
    alert(`🎉 Đặt hàng thành công!\nXin cảm ơn bác ${shippingInfo.fullName}.\nĐơn hàng sẽ được gửi tới địa chỉ: ${shippingInfo.address}`);
    
    // Reset sạch giỏ hàng sau khi mua thành công
    setCart({});
    localStorage.removeItem('shophub_cart');
    navigate('/products'); // Đá người dùng về trang sản phẩm
  };

  // Lọc ra các sản phẩm thực sự đang có trong giỏ hàng để hiển thị
  const cartItems = allProducts.filter(p => cart[p.id] > 0);
  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const totalPrice = cartItems.reduce((sum, p) => sum + (Number(p.price) * cart[p.id]), 0);

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>Đang tải thông tin giỏ hàng...</div>;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 16px', fontFamily: 'system-ui, sans-serif', color: '#1e293b' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '32px', textAlign: 'left' }}>🛒 Giỏ Hàng Của Bạn</h2>

      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '50px' }}>🛍️</span>
          <p style={{ color: '#64748b', margin: '16px 0 24px 0', fontStyle: 'italic' }}>Giỏ hàng hiện tại đang trống rỗng.</p>
          <button onClick={() => navigate('/products')} style={{ padding: '12px 24px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
            Quay lại trang sản phẩm mua sắm
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          
          {/* CỘT TRÁI: DANH SÁCH CHI TIẾT SẢN PHẨM TRONG GIỎ */}
          <div style={{ flex: '1.5', minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cartItems.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: '16px', backgroundColor: '#fff', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
                {/* Ảnh mô tả sản phẩm */}
                <img 
                  src={item.image_url || 'https://via.placeholder.com/80'} 
                  alt={item.name} 
                  style={{ width: '80px', height: '80px', objectFit: 'contain', backgroundColor: '#f8fafc', borderRadius: '8px' }} 
                />
                
                {/* Tên & Giá tiền */}
                <div style={{ flex: '1' }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: '700', color: '#1e293b' }}>{item.name}</h4>
                  <p style={{ margin: 0, color: '#ef4444', fontWeight: 'bold', fontSize: '14px' }}>{Number(item.price).toLocaleString('vi-VN')}đ</p>
                </div>

                {/* Tăng giảm số lượng tại chỗ */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #cbd5e1', borderRadius: '20px', padding: '4px 12px', backgroundColor: '#f8fafc' }}>
                  <button onClick={() => updateQuantity(item.id, -1)} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 'bold', width: '16px', color: '#64748b' }}>-</button>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{cart[item.id]}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 'bold', width: '16px', color: '#64748b' }}>+</button>
                </div>

                {/* Nút thùng rác xóa hẳn sản phẩm */}
                <button onClick={() => removeProduct(item.id)} style={{ border: 'none', backgroundColor: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: '18px', padding: '0 8px', transition: 'color 0.2s' }} onMouseOver={(e)=>e.target.style.color='#ef4444'} onMouseOut={(e)=>e.target.style.color='#94a3b8'} title="Xóa sản phẩm khỏi giỏ">
                  🗑️
                </button>
              </div>
            ))}
          </div>

          {/* CỘT PHẢI: FORM ĐIỀN ĐỊA CHỈ NHẬN HÀNG */}
          <div style={{ flex: '1', minWidth: '300px', backgroundColor: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '700', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', color: '#0f172a' }}>📋 Thông tin nhận hàng</h3>
            
            <form onSubmit={handleSubmitOrder} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Họ và tên người nhận *</label>
                <input type="text" name="fullName" required value={shippingInfo.fullName} onChange={handleInputChange} placeholder="Ví dụ: Nguyễn Văn A..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Số điện thoại liên hệ *</label>
                <input type="tel" name="phone" required value={shippingInfo.phone} onChange={handleInputChange} placeholder="Nhập số điện thoại nhận hàng..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Địa chỉ giao hàng *</label>
                <input type="text" name="address" required value={shippingInfo.address} onChange={handleInputChange} placeholder="Số nhà, tên đường, phường, quận..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13.5px', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Ghi chú đơn hàng (nếu có)</label>
                <textarea name="note" rows="2" value={shippingInfo.note} onChange={handleInputChange} placeholder="Giao giờ hành chính, gọi trước khi giao..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13.5px', outline: 'none', resize: 'none', boxSizing: 'border-box' }}></textarea>
              </div>

              <div style={{ borderTop: '1px dashed #e2e8f0', marginTop: '10px', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px', color: '#475569' }}>
                  <span>Số lượng mặt hàng:</span>
                  <span style={{ fontWeight: 'bold', color: '#1e293b' }}>{totalItems} sản phẩm</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', marginBottom: '20px', color: '#475569' }}>
                  <span>Tổng tiền toán:</span>
                  <span style={{ fontWeight: 'bold', color: '#ef4444', fontSize: '18px' }}>{totalPrice.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', transition: 'background-color 0.2s' }}>
                Xác Nhận Đặt Hàng Ngay
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;