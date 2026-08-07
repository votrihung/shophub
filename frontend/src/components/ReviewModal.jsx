import React, { useState } from 'react';
import { createProductReview } from '../api/ordersApi';

const ReviewModal = ({ productId, productName, onClose, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createProductReview({
        product_id: productId,
        rating: Number(rating),
        comment: comment,
      });
      alert('Đánh giá sản phẩm thành công!');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Lỗi khi gửi đánh giá.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', width: '400px' }}>
        <h3>Đánh giá: {productName}</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label>Chọn số sao: </label>
            <select value={rating} onChange={(e) => setRating(e.target.value)} style={{ padding: '5px', marginLeft: '10px' }}>
              <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
              <option value="4">⭐⭐⭐⭐ (4/5)</option>
              <option value="3">⭐⭐⭐ (3/5)</option>
              <option value="2">⭐⭐ (2/5)</option>
              <option value="1">⭐ (1/5)</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Bình luận:</label>
            <textarea
              rows="4"
              style={{ width: '100%', marginTop: '5px', padding: '8px' }}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose} style={{ padding: '8px 16px' }}>Hủy</button>
            <button type="submit" disabled={loading} style={{ padding: '8px 16px', background: '#0d6efd', color: '#fff', border: 'none', borderRadius: '4px' }}>
              {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;