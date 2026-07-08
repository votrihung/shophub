// src/pages/ProductPage.jsx
import { useEffect, useState } from 'react';
import { productsApi } from '../api/productsApi';
import ProductList from '../components/ProductList';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';

const ProductPage = () => {
  // --- STATE CỦA SESSION 7 (API & SEARCH) ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // --- STATE CỦA SESSION 6 (GIỎ HÀNG) ---
  // Giữ nguyên logic tính tiền và giỏ hàng cũ của bác
  const [cart, setCart] = useState({}); 

  // Hàm gọi API lấy danh sách hoặc tìm kiếm sản phẩm từ Backend
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

  // Tự động gọi lại khi gõ tìm kiếm
  useEffect(() => {
    loadProducts();
  }, [searchTerm]);

  // --- LOGIC GIỎ HÀNG CỦA SESSION 6 ---
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

  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const totalPrice = products.reduce((sum, p) => {
    const qty = cart[p.id] || 0;
    return sum + (p.price * qty);
  }, 0);

  // Hiển thị trạng thái Loading và Error độc lập để không phá vỡ layout chính
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} onRetry={loadProducts} />;

  return (
    <div className="container mx-auto p-6">
      
      {/* 🔍 BỔ SUNG MỚI SESSION 7: Thanh Tìm kiếm nhanh đặt ngay trên đầu */}
      <div className="mb-8 max-w-md mx-auto md:mx-0">
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          Tìm kiếm sản phẩm nhanh:
        </label>
        <input 
          type="text" 
          placeholder="Nhập tên sản phẩm cần tìm..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
        />
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center md:text-left">
        Danh Sách Sản Phẩm Hệ Thống (Dữ Liệu Thật)
      </h2>

      {/* Bố cục 2 cột chia giữa Danh sách sản phẩm và Giỏ hàng của Session 6 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Cột danh sách sản phẩm (Chiếm 3 cột) */}
        <div className="lg:col-span-3">
          {products.length > 0 ? (
            <ProductList products={products} cart={cart} onUpdateCart={handleUpdateCart} />
          ) : (
            <p className="text-gray-500 italic text-center py-10 bg-gray-50 rounded-xl border border-dashed">
              Không tìm thấy sản phẩm nào trùng khớp.
            </p>
          )}
        </div>

        {/* Cột Tóm tắt đơn hàng (Chiếm 1 cột) */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm sticky top-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              🛒 Tóm tắt đơn hàng
            </h3>
            <hr className="mb-4" />
            
            {totalItems === 0 ? (
              <p className="text-gray-400 text-sm italic text-center py-4">Giỏ hàng đang trống.</p>
            ) : (
              <div className="space-y-2 mb-4 max-h-40 overflow-y-auto pr-1">
                {products.map(p => {
                  const qty = cart[p.id] || 0;
                  if (qty === 0) return null;
                  return (
                    <div key={p.id} className="flex justify-between text-sm text-gray-600">
                      <span className="truncate max-w-[150px]">{p.name}</span>
                      <span className="font-medium">x{qty}</span>
                    </div>
                  );
                })}
              </div>
            )}
            
            <hr className="my-4" />
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 text-sm">Tổng sản phẩm:</span>
              <span className="font-bold text-gray-800">{totalItems}</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600 text-sm">Tổng thanh toán:</span>
              <span className="font-bold text-red-500 text-lg">{totalPrice.toLocaleString('vi-VN')}đ</span>
            </div>

            <button 
              disabled={totalItems === 0}
              className={`w-full py-3 rounded-lg font-bold text-white transition active:scale-95 ${
                totalItems === 0 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-green-500 hover:bg-green-600 shadow-md shadow-green-100'
              }`}
            >
              Tiến Hành Thanh Toán
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductPage;