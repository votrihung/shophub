import React from 'react';
import Header from './components/Header';
import Banner from './components/Banner';
import ProductList from './components/ProductList'; // Thêm dòng này để import danh sách sản phẩm
import Footer from './components/Footer';

function App() {
  return (
    <div style={{ margin: 0, padding: 0, boxSizing: 'border-box' }}>
      {/* 1. Hiện thanh Header lên trên cùng */}
      <Header />
      
      {/* 2. Hiện thanh Banner quảng cáo ở giữa */}
      <Banner />
      
      {/* 3. Gọi danh sách 10 sản phẩm vừa cấu trúc lại bằng Card hiện ra ở đây */}
      <ProductList />
      
      {/* 4. Hiện thanh Footer dưới đáy trang web */}
      <Footer />
    </div>
  );
}

export default App;