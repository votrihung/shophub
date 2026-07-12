// src/pages/ProductPage.jsx
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
  const [cart, setCart] = useState({}); 

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
      let data;
      if (searchTerm.trim() !== '') {
        data = await productsApi.searchProduct(searchTerm);
      } else {
        data = await productsApi.getAll();
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

  const handleUpdateCart = (productId, amount) => {
    setCart(prev => {
      const currentQty = prev[productId] || 0;
      const newQty = currentQty + amount;
      if (newQty <= 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: newQty };
    });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} onRetry={loadProducts} />;

  return (
    <div className="container mx-auto p-6">
      {/* Kế thừa gọi thẳng Component hiển thị tích hợp nút Admin bên trong */}
      <ProductList />
    </div>
  );
};

export default ProductPage;