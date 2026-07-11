// src/context/CartContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

// Custom hook useCart để các component gọi cho tiện và đồng bộ
export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  // Lấy thông tin user từ AuthContext để phân chia giỏ hàng theo Session của từng người
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);

  // 🌟 ĐỒNG BỘ SESSION: Mỗi khi user đăng nhập hoặc đổi tài khoản, nạp lại đúng giỏ hàng của user đó
  useEffect(() => {
    if (user && user.id) {
      const savedCart = localStorage.getItem(`shophub_cart_user_${user.id}`);
      setCartItems(savedCart ? JSON.parse(savedCart) : []);
    } else {
      // Nếu không có user (chưa đăng nhập hoặc đã đăng xuất), đưa giỏ hàng về trống
      setCartItems([]);
    }
  }, [user]);

  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = (product, quantity = 1) => {
    if (!user) {
      alert("⚠️ Sốp phải đăng nhập hệ thống thì mới thêm sản phẩm vào giỏ được nha!");
      return;
    }

    setCartItems((prevItems) => {
      const exist = prevItems.find((item) => item.id === product.id);
      let updatedCart;
      
      if (exist) {
        // Nếu sản phẩm đã có trong giỏ, tăng số lượng lên
        updatedCart = prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        // Nếu là sản phẩm mới, thêm vào mảng giỏ hàng
        updatedCart = [...prevItems, { ...product, quantity }];
      }

      // Lưu trữ giỏ hàng riêng biệt theo ID của User vào LocalStorage
      localStorage.setItem(`shophub_cart_user_${user.id}`, JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // Hàm xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (productId) => {
    if (!user) return;

    setCartItems((prevItems) => {
      const updatedCart = prevItems.filter((item) => item.id !== productId);
      localStorage.setItem(`shophub_cart_user_${user.id}`, JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // Hàm tăng/giảm số lượng trực tiếp trong giỏ hàng (cho các nút + -)
  const updateQuantity = (productId, newQuantity) => {
    if (!user || newQuantity < 1) return;

    setCartItems((prevItems) => {
      const updatedCart = prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      localStorage.setItem(`shophub_cart_user_${user.id}`, JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // Tính tổng số lượng item để hiển thị lên Badge giỏ hàng trên Header
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Tính tổng số tiền của cả giỏ hàng
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};