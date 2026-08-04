import { useEffect, useState } from 'react';
import { productsApi } from '../api/productsApi';
import ProductList from '../components/ProductList';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
      let data;
      if (searchTerm.trim() !== '') {
        data = await productsApi.searchProduct(searchTerm);
      } else {
        // Tăng size=50 để kéo hết đồ mới lên xem dễ dàng
        data = await productsApi.getAll(1, 50); 
      }
      
      if (data && data.products && Array.isArray(data.products)) {
        setProducts(data.products);
      } else if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      setError(err.message || 'Không thể kết nối đến dữ liệu sản phẩm.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [searchTerm]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} onRetry={loadProducts} />;

  return (
    <div className="container mx-auto p-6">
      {/* Đã truyền trực tiếp state products thu được từ API xuống cho ProductList */}
      <ProductList products={products} />
    </div>
  );
};

export default ProductPage;