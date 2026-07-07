import React from 'react';

const ProductCard = ({ product, quantity, onIncrease, onDecrease }) => {
  // Hàm định dạng tiền Việt Nam chuẩn mẫu: 24.990.000đ
  const formatVND = (price) => {
    return price ? price.toLocaleString('vi-VN') + 'đ' : '0đ';
  };

  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '15px',
      textAlign: 'center',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '380px' // Tăng nhẹ chiều cao để chứa phần mô tả
    }}>
      <div>
        {/* Hình ảnh sản phẩm - ĐÃ ĐỔI TỪ product.image SANG product.imageUrl */}
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px' }} 
        />
        
        {/* Tên sản phẩm tiếng Việt */}
        <h4 style={{ margin: '5px 0', fontSize: '15px', color: '#2c3e50', height: '38px', overflow: 'hidden' }}>
          {product.name}
        </h4>

        {/* Phần mô tả ngắn mới thêm theo yêu cầu */}
        <p style={{ margin: '5px 0 10px 0', fontSize: '12px', color: '#7f8c8d', height: '32px', overflow: 'hidden', lineHeight: '1.3' }}>
          {product.description}
        </p>
        
        {/* Giá tiền dạng chữ đ */}
        <p style={{ margin: '0 0 15px 0', fontWeight: 'bold', color: '#e74c3c', fontSize: '15px' }}>
          {formatVND(product.price)}
        </p>
      </div>
      
      {/* Giữ nguyên bộ nút bấm tăng giảm số lượng trực tiếp tại sản phẩm */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: 'auto' }}>
        <button 
          onClick={onDecrease}
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            border: '1px solid #bdc3c7',
            backgroundColor: '#ffffff',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          -
        </button>
        
        <span style={{ fontSize: '16px', fontWeight: 'bold', minWidth: '20px' }}>{quantity}</span>
        
        <button 
          onClick={onIncrease}
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            border: '1px solid #bdc3c7',
            backgroundColor: '#ffffff',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ProductCard;