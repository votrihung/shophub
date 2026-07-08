// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Banner from './components/Banner';
import ProductList from './components/ProductList'; // Hiển thị sản phẩm + giỏ hàng API thật
import ProductDetailPage from './pages/ProductDetailPage';
import Footer from './components/Footer'; // Component Footer xịn của bác

// 1. Trang chủ (HomePage)
const HomePage = () => {
  return (
    <>
      <Banner subtitle="Welcome to our store" buttonText="Shop Now" />
      <section style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', minHeight: '40vh' }}>
        <h2>Welcome to ShopHub</h2>
        <p>Use the navigation bar to browse products, manage your cart, and log in.</p>
      </section>
    </>
  );
};

// 2. Trang giới thiệu (AboutPage)
const AboutPage = () => (
  <section style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', minHeight: '60vh' }}>
    <h2>About Us</h2>
    <p>This is a simple About page implemented for Session 5 Lab.</p>
  </section>
);

// 3. Trang giỏ hàng (CartPage)
const CartPage = () => (
  <section style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', minHeight: '60vh' }}>
    <h2>Shopping Cart</h2>
    <p>Cart functionality will be implemented in a later session.</p>
  </section>
);

// 4. Trang đăng nhập (LoginPage)
const LoginPage = () => (
  <section style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', minHeight: '60vh' }}>
    <h2>Login</h2>
    <p>Authentication will be implemented in the Auth sessions.</p>
  </section>
);

const App = () => {
  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 🌟 Đặt Header cố định ở trên đầu mọi trang */}
      <Header title="ShopHub" />
      
      {/* 🌟 Khu vực nội dung thay đổi theo đường dẫn URL */}
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          <Route path="/products" element={<ProductList />} />
          
          <Route path="/products/:id" element={<ProductDetailPage />} />
          
          <Route path="/about" element={<AboutPage />} />
          
          <Route path="/cart" element={<CartPage />} />
          
          <Route path="/login" element={<LoginPage />} />
          
          {/* Trang 404 */}
          <Route
            path="*"
            style={{ minHeight: '60vh' }}
            element={
              <section style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
                <h2>Page not found</h2>
                <p>The page you are looking for does not exist.</p>
              </section>
            }
          />
        </Routes>
      </div>

      {/* 🌟 Đưa Footer ra ngoài cùng: Luôn nằm ở dưới đáy mọi trang web, không lo bị lặp code! */}
      <Footer />
    </div>
  );
};

export default App;