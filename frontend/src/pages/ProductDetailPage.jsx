import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { productsApi } from '../api/productsApi';
import { getProductReviews, createProductReview } from '../api/ordersApi';
import { useCart } from '../context/CartContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  // State kiểm tra quyền mua hàng & lượt đánh giá
  const [hasPurchased, setHasPurchased] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [checkingPermission, setCheckingPermission] = useState(true);

  // State cho Form đánh giá
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const fetchReviews = async () => {
    try {
      const revs = await getProductReviews(id);
      setReviews(revs || []);
      return revs || [];
    } catch (err) {
      console.error('Lỗi khi lấy danh sách đánh giá:', err);
      return [];
    } finally {
      setLoadingReviews(false);
    }
  };

  const checkUserPermissions = async (currentReviews) => {
    const token = localStorage.getItem('shophub_token');
    const currentUser = JSON.parse(localStorage.getItem('shophub_user') || '{}');

    if (!token) {
      setHasPurchased(false);
      setHasReviewed(false);
      setCheckingPermission(false);
      return;
    }

    try {
      // 1. Lấy lịch sử đơn hàng
      const res = await axios.get('http://localhost:8000/orders/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const orders = res.data || [];

      // 2. Đếm tổng số đơn hàng đã thành công có chứa sản phẩm này
      let purchaseCount = 0;
      orders.forEach(order => {
        if (order.status === 'COMPLETED' || order.status === 'PAID') {
          order.items?.forEach(item => {
            if (Number(item.product_id) === Number(id)) {
              purchaseCount += 1;
            }
          });
        }
      });

      // 3. Đếm số lần user này đã đánh giá sản phẩm này
      const userReviewCount = currentReviews.filter(
        r => r.user_id === currentUser.id || r.user_name === currentUser.full_name || r.user_name === currentUser.username
      ).length;

      setHasPurchased(purchaseCount > 0);
      
      // Chỉ khóa khi Số lần đã đánh giá >= Số lần mua hàng
      setHasReviewed(userReviewCount >= purchaseCount);

    } catch (err) {
      console.error("Lỗi kiểm tra quyền đánh giá:", err);
    } finally {
      setCheckingPermission(false);
    }
  };

  useEffect(() => {
    const fetchDataAndCheckPermissions = async () => {
      setLoading(true);
      setError('');

      // Tải thông tin sản phẩm
      try {
        const p = await productsApi.getById(id);
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

      // Tải đánh giá & kiểm tra phân quyền
      const currentReviews = await fetchReviews();
      await checkUserPermissions(currentReviews);
    };

    fetchDataAndCheckPermissions();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setReviewError('');
    setReviewSuccess('');

    try {
      await createProductReview({
        product_id: Number(id),
        rating: Number(rating),
        comment: comment,
      });
      setReviewSuccess('Đã gửi đánh giá thành công!');
      setComment('');
      setRating(5);

      // Cập nhật lại danh sách bình luận & kiểm tra lại lượt đánh giá còn lại
      const updatedReviews = await fetchReviews();
      await checkUserPermissions(updatedReviews);
    } catch (err) {
      setReviewError(
        err.response?.data?.detail || 'Lỗi khi gửi đánh giá. Vui lòng thử lại sau.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  if (loading) return <p style={{ padding: '24px', textAlign: 'center', fontFamily: 'sans-serif' }}>Loading product details...</p>;
  if (error) return <p style={{ padding: '24px', color: 'red', textAlign: 'center', fontFamily: 'sans-serif' }}>{error}</p>;
  if (!product) return <p style={{ padding: '24px', textAlign: 'center', fontFamily: 'sans-serif' }}>Product not found.</p>;

  return (
    <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      
      <Link to="/products" style={{ display: 'inline-block', marginBottom: '24px', color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>
        ← Back to Products
      </Link>

      {/* THÔNG TIN SẢN PHẨM */}
      <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', backgroundColor: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <div style={{ width: '320px', height: '320px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: '8px', padding: '10px' }}>
          <img src={product.imageUrl} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
        </div>

        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 8px 0' }}>{product.name}</h2>
          <p style={{ color: '#64748b', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 12px 0' }}>
            Danh mục: {product.category}
          </p>

          {avgRating && (
            <div style={{ marginBottom: '16px', fontSize: '15px', color: '#f59e0b', fontWeight: 'bold' }}>
              ⭐ {avgRating} / 5.0 <span style={{ color: '#64748b', fontWeight: 'normal' }}>({reviews.length} đánh giá)</span>
            </div>
          )}

          <p style={{ fontSize: '26px', fontWeight: 'bold', color: '#ef4444', margin: '0 0 20px 0' }}>
            {product.price?.toLocaleString('vi-VN')}đ
          </p>
          
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#334155' }}>Mô tả sản phẩm:</h4>
            <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '15px', margin: '0' }}>{product.description}</p>
          </div>

          <button
            onClick={handleAddToCart}
            style={{
              marginTop: '25px', padding: '12px 24px', backgroundColor: '#1976d2', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px'
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* KHU VỰC ĐÁNH GIÁ */}
      <div style={{ marginTop: '30px', backgroundColor: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>
          💬 Đánh Giá Sản Phẩm
        </h3>

        {/* ĐIỀU KIỆN HIỂN THỊ FORM ĐÁNH GIÁ */}
        {checkingPermission ? (
          <p style={{ color: '#64748b', fontSize: '14px' }}>⏳ Đang kiểm tra quyền đánh giá...</p>
        ) : hasReviewed ? (
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '14px 18px', borderRadius: '8px', marginBottom: '24px', color: '#166534', fontSize: '14px', fontWeight: '500' }}>
            ✅ Bạn đã hoàn thành đánh giá cho toàn bộ các lượt mua sản phẩm này. Mua thêm lượt mới để tiếp tục gửi đánh giá nhé!
          </div>
        ) : hasPurchased ? (
          <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#334155' }}>Viết đánh giá của bạn (Đã mua hàng)</h4>

            {reviewSuccess && <p style={{ color: 'green', backgroundColor: '#dcfce7', padding: '8px 12px', borderRadius: '6px', fontSize: '14px' }}>✅ {reviewSuccess}</p>}
            {reviewError && <p style={{ color: '#991b1b', backgroundColor: '#fee2e2', padding: '8px 12px', borderRadius: '6px', fontSize: '14px' }}>⚠️ {reviewError}</p>}

            <form onSubmit={handleReviewSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontWeight: 'bold', fontSize: '14px', marginRight: '10px' }}>Chọn số sao:</label>
                <select value={rating} onChange={(e) => setRating(e.target.value)} style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ccc' }}>
                  <option value="5">⭐⭐⭐⭐⭐ (5/5 - Rất tốt)</option>
                  <option value="4">⭐⭐⭐⭐ (4/5 - Tốt)</option>
                  <option value="3">⭐⭐⭐ (3/5 - Bình thường)</option>
                  <option value="2">⭐⭐ (2/5 - Tệ)</option>
                  <option value="1">⭐ (1/5 - Rất tệ)</option>
                </select>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <textarea
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Nhập cảm nhận của bạn về sản phẩm tại đây..."
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{ padding: '8px 20px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
              </button>
            </form>
          </div>
        ) : (
          <div style={{ backgroundColor: '#f1f5f9', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', color: '#475569', fontSize: '14px' }}>
            ℹ️ Chỉ những khách hàng đã mua sản phẩm này mới có thể viết đánh giá.
          </div>
        )}

        {/* DANH SÁCH BÌNH LUẬN */}
        {loadingReviews ? (
          <p style={{ color: '#64748b' }}>⏳ Đang tải đánh giá...</p>
        ) : reviews.length === 0 ? (
          <p style={{ color: '#64748b', fontStyle: 'italic', margin: '20px 0' }}>Chưa có đánh giá nào cho sản phẩm này.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {reviews.map((rev) => (
              <div key={rev.id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 'bold', color: '#334155', fontSize: '15px' }}>👤 {rev.user_name}</span>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {rev.created_at ? new Date(rev.created_at).toLocaleDateString('vi-VN') : ''}
                  </span>
                </div>
                
                <div style={{ color: '#f59e0b', marginBottom: '8px', fontSize: '14px' }}>
                  {'⭐'.repeat(rev.rating)} <span style={{ color: '#64748b', fontSize: '13px' }}>({rev.rating}/5)</span>
                </div>

                {rev.comment && (
                  <p style={{ margin: 0, color: '#475569', fontSize: '14px', lineHeight: '1.5', backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '8px' }}>
                    {rev.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </section>
  );
};

export default ProductDetailPage;