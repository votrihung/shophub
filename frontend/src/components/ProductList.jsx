import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Gọi API bốc dữ liệu trực tiếp từ Backend FastAPI
    axios.get('http://localhost:8000/products')
      .then((response) => {
        // Vì API trả về Object { total, page, size, products } nên ta lấy đúng mảng response.data.products
        const productData = response.data.products || [];
        
        setProducts(productData);
        setQuantities(
          productData.reduce((acc, product) => {
            acc[product.id] = 0;
            return acc;
          }, {})
        );
        setLoading(false); // Tắt màn hình loading
      })
      .catch((err) => {
        console.error("Lỗi kết nối API:", err);
        setError("Không thể kết nối đến máy chủ Backend (FastAPI). Bác nhớ bật server uvicorn chưa?");
        setLoading(false);
      });
  }, []);

  const handleIncrease = (id) => {
    setQuantities(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleDecrease = (id) => {
    setQuantities(prev => ({ ...prev, [id]: (prev[id] || 0) > 0 ? prev[id] - 1 : 0 }));
  };

  const totalItems = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  const totalPrice = products.reduce((sum, product) => {
    return sum + (product.price * (quantities[product.id] || 0));
  }, 0);

  const formatVND = (price) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  // MÀN HÌNH CHỜ LOADING XỊN MỊN
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '80vh', 
        fontSize: '24px', 
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'bold',
        color: '#3498db'
      }}>
        ⏳ Đang kết nối server và tải danh sách sản phẩm ShopHub...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 50px', color: '#e74c3c', fontSize: '20px', fontFamily: 'Arial, sans-serif' }}>
        ❌ Lỗi: {error}
      </div>
    );
  }

  return (
    <div style={{ padding: '30px 40px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>Danh Sách Sản Phẩm Hệ Thống (Dữ Liệu Thật)</h2>
      
      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        
        {/* BÊN TRÁI: Danh sách sản phẩm bốc từ Backend */}
        <div style={{
          flex: 3,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '20px'
        }}>
          {products.length === 0 ? (
            <p style={{ color: '#7f8c8d' }}>Chưa có sản phẩm nào trong hệ thống. Bác ra Swagger thêm thử nhé!</p>
          ) : (
            products.map(product => (
              <ProductCard 
                key={product.id}
                product={product}
                quantity={quantities[product.id] || 0}
                onIncrease={() => handleIncrease(product.id)}
                onDecrease={() => handleDecrease(product.id)}
              />
            ))
          )}
        </div>

        {/* BÊN PHẢI: Tóm tắt đơn hàng */}
        <div style={{
          flex: 1,
          border: '1px solid #3498db',
          borderRadius: '8px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          position: 'sticky',
          top: '20px'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#2980b9', borderBottom: '2px solid #3498db', paddingBottom: '10px' }}>
            🛒 Tóm tắt đơn hàng
          </h3>

          {totalItems === 0 ? (
            <p style={{ color: '#7f8c8d', fontSize: '14px' }}>Giỏ hàng đang trống.</p>
          ) : (
            <div style={{ marginBottom: '15px', maxHeight: '200px', overflowY: 'auto' }}>
              {products.filter(p => quantities[p.id] > 0).map(product => (
                <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' }}>
                  <span style={{ flex: 1, marginRight: '5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {product.name}
                  </span>
                  <span style={{ fontWeight: 'bold' }}>x{quantities[product.id]}</span>
                </div>
              ))}
            </div>
          )}

          <hr style={{ border: '0', borderTop: '1px solid #e0e0e0', margin: '15px 0' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Tổng sản phẩm:</span>
            <span style={{ fontWeight: 'bold' }}>{totalItems}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', marginBottom: '20px' }}>
            <span>Tổng thanh toán:</span>
            <span style={{ fontWeight: 'bold', color: '#e74c3c' }}>{formatVND(totalPrice)}</span>
          </div>
          <button style={{
            width: '100%',
            backgroundColor: '#2ecc71',
            color: '#ffffff',
            border: 'none',
            padding: '12px',
            fontSize: '16px',
            fontWeight: 'bold',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
            Tiến Hành Thanh Toán
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductList;