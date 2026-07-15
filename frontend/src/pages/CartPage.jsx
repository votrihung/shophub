import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 
import axios from 'axios'; 

const CartPage = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, totalQuantity, totalPrice, clearCart } = useCart();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    note: ''
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address) {
      alert('Vui lòng điền đầy đủ các thông tin có dấu (*)!');
      return;
    }

    setLoading(true);

    const orderItems = items.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
      name: item.name,                 
      price: Number(item.price)         
    }));

    try {
      const token = localStorage.getItem('shophub_token') || '';

     
      const response = await axios.post('http://localhost:8000/orders/checkout', {
        items: orderItems
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (response.status === 200 || response.status === 201) {
        alert(`🎉 Đặt hàng thành công!\nXin cảm ơn bác ${shippingInfo.fullName}.\nĐơn hàng đã được lưu trữ trên hệ thống PostgreSQL thành công mỹ mãn!`);
        clearCart(); 
        navigate('/products'); 
      } else {
        alert('❌ Đặt hàng không thành công. Vui lòng kiểm tra lại!');
      }
    } catch (err) {
      console.error("Lỗi đặt hàng:", err);
      let errorMsg = err.message;
      if (err.response?.data?.detail) {
        errorMsg = typeof err.response.data.detail === 'object' 
          ? JSON.stringify(err.response.data.detail, null, 2) 
          : err.response.data.detail;
      }
      alert(`❌ Có lỗi xảy ra khi gửi đơn hàng: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 16px', fontFamily: 'system-ui, sans-serif', color: '#1e293b', minHeight: '60vh' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '32px' }}>🛒 Giỏ Hàng Của Bạn</h2>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '50px' }}>🛍️</span>
          <p style={{ color: '#64748b', margin: '16px 0 24px 0', fontStyle: 'italic' }}>Giỏ hàng hiện tại đang trống rỗng .</p>
          <button onClick={() => navigate('/products')} style={{ padding: '12px 24px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
            Quay lại trang sản phẩm mua sắm
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: '1.5', minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: '16px', backgroundColor: '#fff', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', alignItems: 'center' }}>
                <img src={item.imageUrl || item.image_url || 'https://via.placeholder.com/80'} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'contain', backgroundColor: '#f8fafc', borderRadius: '8px' }} />
                <div style={{ flex: '1' }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: '700' }}>{item.name}</h4>
                  <p style={{ margin: 0, color: '#ef4444', fontWeight: 'bold', fontSize: '14px' }}>{Number(item.price).toLocaleString('vi-VN')}đ</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #cbd5e1', borderRadius: '20px', padding: '4px 12px', backgroundColor: '#f8fafc' }}>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 'bold', width: '16px' }}>-</button>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 'bold', width: '16px' }}>+</button>
                </div>
                <button onClick={() => removeFromCart(item.id)} style={{ border: 'none', backgroundColor: 'transparent', color: '#94a3b8', cursor: 'pointer', fontSize: '18px', padding: '0 8px' }}>🗑️</button>
              </div>
            ))}
          </div>

          <div style={{ flex: '1', minWidth: '300px', backgroundColor: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '700', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>📋 Thông tin nhận hàng</h3>
            <form onSubmit={handleSubmitOrder} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Họ và tên người nhận *</label>
                <input type="text" name="fullName" required value={shippingInfo.fullName} onChange={handleInputChange} placeholder="Ví dụ: Nguyễn Văn A..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13.5px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Số điện thoại liên hệ *</label>
                <input type="tel" name="phone" required value={shippingInfo.phone} onChange={handleInputChange} placeholder="Nhập số điện thoại..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13.5px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Địa chỉ giao hàng *</label>
                <input type="text" name="address" required value={shippingInfo.address} onChange={handleInputChange} placeholder="Số nhà, tên đường, quận..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13.5px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Ghi chú đơn hàng</label>
                <textarea name="note" rows="2" value={shippingInfo.note} onChange={handleInputChange} placeholder="Ghi chú thêm nếu có..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13.5px', resize: 'none', boxSizing: 'border-box' }}></textarea>
              </div>

              <div style={{ borderTop: '1px dashed #e2e8f0', marginTop: '10px', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                  <span>Số lượng:</span>
                  <span style={{ fontWeight: 'bold' }}>{totalQuantity} sản phẩm</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', marginBottom: '20px' }}>
                  <span>Tổng tiền:</span>
                  <span style={{ fontWeight: 'bold', color: '#ef4444', fontSize: '18px' }}>{totalPrice.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: loading ? '#94a3b8' : '#22c55e', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Đang xử lý đặt hàng...' : 'Xác Nhận Đặt Hàng Ngay'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;