import React from 'react';

// Sử dụng Props (product) truyền từ component cha xuống
const ProductCard = ({ product }) => {
  return (
    <div style={{
      border: '1px solid #ddd',
      padding: '15px',
      borderRadius: '8px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      width: '220px',
      textAlign: 'center'
    }}>
      <img 
        src={product.imageUrl} 
        alt={product.name} 
        style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} 
      />
      <h3 style={{ fontSize: '16px', margin: '10px 0' }}>{product.name}</h3>
      <p style={{ color: '#ff5722', fontWeight: 'bold', fontSize: '18px', margin: '5px 0' }}>
        ${product.price}
      </p>
      <p style={{ fontSize: '12px', color: '#666', height: '40px', overflow: 'hidden' }}>
        {product.description}
      </p>
    </div>
  );
};

export default ProductCard;