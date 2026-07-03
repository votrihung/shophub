import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Banner from './components/Banner';
import ProductPage from './pages/ProductPage';
import ProductDetailPage from './pages/ProductDetailPage';
import Footer from './components/Footer';

// 1. Trang chủ (HomePage)
const HomePage = () => {
  const studentName = 'Tri Hung';
  return (
    <>
      <Banner subtitle="Welcome to our store" buttonText="Shop Now" />
      <section style={{ padding: '24px' }}>
        <h2>Welcome to ShopHub</h2>
        <p>Use the navigation bar to browse products, manage your cart, and log in.</p>
      </section>
      <Footer studentName={studentName} courseName="Full-Stack Web Development" />
    </>
  );
};

// 2. Trang giới thiệu (AboutPage)
const AboutPage = () => (
  <section style={{ padding: '24px' }}>
    <h2>About Us</h2>
    <p>This is a simple About page implemented for Session 5 Lab.</p>
  </section>
);

// 3. Trang giỏ hàng (CartPage)
const CartPage = () => (
  <section style={{ padding: '24px' }}>
    <h2>Shopping Cart</h2>
    <p>Cart functionality will be implemented in a later session.</p>
  </section>
);

// 4. Trang đăng nhập (LoginPage)
const LoginPage = () => (
  <section style={{ padding: '24px' }}>
    <h2>Login</h2>
    <p>Authentication will be implemented in the Auth sessions.</p>
  </section>
);

const App = () => {
  const studentName = 'Tri Hung';

  return (
    <>
      {/* Đặt Header ở đây để nó nằm gọn trong BrowserRouter quản lý */}
      <Header title="ShopHub" />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/products"
          element={
            <>
              <ProductPage />
              <Footer studentName={studentName} courseName="Full-Stack Web Development" />
            </>
          }
        />
        <Route
          path="/products/:id"
          element={
            <>
              <ProductDetailPage />
              <Footer studentName={studentName} courseName="Full-Stack Web Development" />
            </>
          }
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Trang 404 */}
        <Route
          path="*"
          element={
            <section style={{ padding: '24px' }}>
              <h2>Page not found</h2>
              <p>The page you are looking for does not exist.</p>
            </section>
          }
        />
      </Routes>
    </>
  );
};

export default App;