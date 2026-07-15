import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsApi } from '../api/productsApi'; 

const AdminAddProductPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Phone',
    stock: '10'
  });
  const [imageFile, setImageFile] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('stock', formData.stock);
      
      const calculatedCostPrice = Math.round(Number(formData.price) * 0.8).toString();
      data.append('costPrice', calculatedCostPrice);

      if (imageFile) {
        data.append('image', imageFile);
      }

      await productsApi.create(data);
      alert('Thành công: Đã thêm mới sản phẩm vào hệ thống.');
      navigate('/products');
    } catch (err) {
      console.error(err);
      
      let errorMsg = err.message;
      if (err.response?.data?.detail) {
        if (typeof err.response.data.detail === 'object') {
          errorMsg = JSON.stringify(err.response.data.detail, null, 2);
        } else {
          errorMsg = err.response.data.detail;
        }
      }
      
      alert('❌ Lỗi lưu sản phẩm từ Server Backend:\n' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '32px', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '24px', fontWeight: '800', color: '#0f172a' }}>➕ THÊM SẢN PHẨM MỚI (ADMIN)</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Tên sản phẩm *</label>
          <input type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="Ví dụ: iPhone 16 Pro Max..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }} />
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Giá bán (VNĐ) *</label>
            <input type="number" name="price" required value={formData.price} onChange={handleInputChange} placeholder="Ví dụ: 34990000" style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Số lượng kho *</label>
            <input type="number" name="stock" required value={formData.stock} onChange={handleInputChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Danh mục sản phẩm</label>
          <select name="category" value={formData.category} onChange={handleInputChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', backgroundColor: '#fff' }}>
            <option value="Phone">Điện Thoại (iPhone)</option>
            <option value="Laptop">Máy Tính (MacBook)</option>
            <option value="Tablet">Máy Tính Bảng (iPad)</option>
            <option value="Accessory">Phụ Kiện</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Hình ảnh sản phẩm *</label>
          <input type="file" accept="image/*" required onChange={handleFileChange} style={{ width: '100%', padding: '8px', border: '1px dashed #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Mô tả chi tiết sản phẩm</label>
          <textarea name="description" rows="3" value={formData.description} onChange={handleInputChange} placeholder="Nhập thông số cấu hình, quà tặng kèm nếu có..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', resize: 'none' }}></textarea>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
          <button type="button" onClick={() => navigate('/products')} style={{ flex: 1, padding: '12px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Hủy Bỏ</button>
          <button type="submit" disabled={loading} style={{ flex: 2, padding: '12px', backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            {loading ? 'Đang gửi dữ liệu lên DB...' : 'Lưu Sản Phẩm Xuống DB 🚀'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddProductPage;