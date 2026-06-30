import React from 'react';
import Header from './components/Header';
import Banner from './components/Banner';
import ProductList from './components/ProductList'; // 1. Thêm dòng này để import danh sách sản phẩm
import Footer from './components/Footer';

function App() {
  return (
    <div>
      <Header />
      <Banner />
      
      {/* 2. Gọi component hiển thị sản phẩm ở giữa Banner và Footer */}
      <ProductList /> 
      
      <Footer />
    </div>
  );
}

export default App;
