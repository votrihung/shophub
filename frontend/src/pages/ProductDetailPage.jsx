// src/pages/ProductDetailPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsApi } from '../api/productsApi';

const ProductDetailPage = () => {
  const { id } = useParams(); // Lấy ID sản phẩm từ thanh địa chỉ URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');

      try {
        const p = await productsApi.getById(id);
        // Map dữ liệu chuẩn từ API trả về giống như yêu cầu đề bài
        const mapped = {
          id: p.id,
          name: p.name,
          price: p.price,
          category: p.category || 'Điện thoại',
          description: p.description || 'Hàng chính hãng VN/A nguyên seal.',
          imageUrl: p.imageUrl || p.image || 'https://via.placeholder.com/280',
        };
        setProduct(mapped);
      } catch (err) {
        setError('Could not load product details from API.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <p style={{ padding: '24px', textAlign: 'center', fontFamily: 'sans-serif' }}>Loading product details...</p>;
  }

  if (error) {
    return <p style={{ padding: '24px', color: 'red', textAlign: 'center', fontFamily: 'sans-serif' }}>{error}</p>;
  }

  if (!product) {
    return <p style={{ padding: '24px', textAlign: 'center', fontFamily: 'sans-serif' }}>Product not found.</p>;
  }

  return (
    <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Nút quay lại danh sách */}
      <Link to="/products" style={{ 
        display: 'inline-block', 
        marginBottom: '24px', 
        color: '#3b82f6', 
        textDecoration: 'none',
        fontWeight: '500'
      }}>
        ← Back to Products
      </Link>

      {/* Chi tiết sản phẩm */}
      <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', backgroundColor: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        
        {/* Khung ảnh lớn */}
        <div style={{ width: '320px', height: '320px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: '8px', padding: '10px' }}>
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Khối thông tin chữ bên phải */}
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 8px 0' }}>{product.name}</h2>
          <p style={{ color: '#64748b', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 16px 0' }}>
            Danh mục: {product.category}
          </p>
          <p style={{ fontSize: '26px', fontWeight: 'bold', color: '#ef4444', margin: '0 0 20px 0' }}>
            {product.price?.toLocaleString('vi-VN')}đ
          </p>
          
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#334155' }}>Mô tả sản phẩm:</h4>
            <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '15px', margin: '0' }}>{product.description}</p>
          </div>

          <button
            onClick={() => {
              // Bác có thể tích hợp hàm cập nhật giỏ hàng trực tiếp vào đây nếu muốn phát triển thêm
              alert('Sản phẩm đã được thêm vào giỏ hàng!');
            }}
            style={{
              marginTop: '25px',
              padding: '12px 24px',
              backgroundColor: '#1976d2',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '15px'
            }}
          >
            Add to Cart
          </button>
        </div>

      </div>
    </section>
  );
};

export default ProductDetailPage;