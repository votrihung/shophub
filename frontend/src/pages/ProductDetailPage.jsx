import { useParams, Link } from 'react-router-dom';

const ProductDetailPage = () => {
  const { id } = useParams(); // Đọc id từ URL

  // Tạm thời làm fake check ID để thỏa mãn yêu cầu show "Product not found" của Lab
  // Nếu ID truyền vào lớn hơn 100 thì coi như không tìm thấy sản phẩm
  if (Number(id) > 100) {
    return (
      <div style={{ padding: '24px' }}>
        <Link to="/products">← Back to Products</Link>
        <h2 style={{ color: 'red', marginTop: '16px' }}>Product not found</h2>
      </div>
    );
  }

  return (
    <section style={{ padding: '24px' }}>
      <Link to="/products">← Back to Products</Link>
      <div style={{ marginTop: '16px' }}>
        <h2>Product Details (ID: {id})</h2>
        <p>Product detail functionality will load data from API in the next steps.</p>
        <button style={{ padding: '8px 16px', backgroundColor: '#1976d2', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Add to Cart
        </button>
      </div>
    </section>
  );
};

export default ProductDetailPage;