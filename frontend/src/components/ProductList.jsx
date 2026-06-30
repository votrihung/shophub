import React from 'react';
import products from '../data/products.json';

const ProductList = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Danh Sách Sản Phẩm</h2>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '20px' }}>
        {products.map((product) => (
          <div key={product.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
            <img src={product.imageUrl} alt={product.name} />
            <h3>{product.name}</h3>
            <p style={{ color: '#ff5722', fontWeight: 'bold' }}>${product.price}</p>
            <p>{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;