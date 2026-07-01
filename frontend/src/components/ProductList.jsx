import React, { useState } from 'react';
import productsData from '../data/products.json';
import ProductCard from './ProductCard';

const ProductList = () => {
  // FIX: Khởi tạo số lượng ban đầu của tất cả sản phẩm bằng 0 thay vì 1
  const [quantities, setQuantities] = useState(
    productsData.reduce((acc, product) => {
      acc[product.id] = 0;
      return acc;
    }, {})
  );

  // Tăng số lượng
  const handleIncrease = (id) => {
    setQuantities(prev => ({
      ...prev,
      [id]: prev[id] + 1
    }));
  };

  // FIX: Cho phép giảm số lượng về tối thiểu là 0 (không bị chặn ở số 1 nữa)
  const handleDecrease = (id) => {
    setQuantities(prev => ({
      ...prev,
      [id]: prev[id] > 0 ? prev[id] - 1 : 0
    }));
  };

  // Tính tổng số lượng hàng trong giỏ
  const totalItems = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);

  // Tính tổng số tiền phải trả
  const totalPrice = productsData.reduce((sum, product) => {
    return sum + (product.price * quantities[product.id]);
  }, 0);

  return (
    <div style={{ padding: '30px 40px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>Our Products</h2>
      
      {/* Layout chia 2 bên */}
      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        
        {/* BÊN TRÁI: Danh sách 9 sản phẩm */}
        <div style={{
          flex: 3,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '20px'
        }}>
          {productsData.map(product => (
            <ProductCard 
              key={product.id}
              product={product}
              quantity={quantities[product.id]}
              onIncrease={() => handleIncrease(product.id)}
              onDecrease={() => handleDecrease(product.id)}
            />
          ))}
        </div>

        {/* BÊN PHẢI: Bảng tính tiền tổng hóa đơn */}
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
            🛒 Order Summary
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Total Items:</span>
            <span style={{ fontWeight: 'bold' }}>{totalItems}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', marginBottom: '20px' }}>
            <span>Total Price:</span>
            <span style={{ fontWeight: 'bold', color: '#e74c3c' }}>${totalPrice}</span>
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
            Proceed to Checkout
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductList;