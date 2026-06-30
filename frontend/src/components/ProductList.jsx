import React from 'react';
import products from '../data/products.json';
import ProductCard from './ProductCard'; // Import component con vừa tạo

const ProductList = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f9f9f9' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Danh Sách Sản Phẩm</h2>
      
      {/* Container chứa các card sản phẩm xếp ngang nhau */}
      <div style={{
        display: 'flex',
        gap: '20px',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: '20px'
      }}>
        {products.map((product) => (
          // Gọi component con và truyền dữ liệu qua prop có tên là "product"
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;