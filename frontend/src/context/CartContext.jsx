import { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext(null);

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (user && user.id) {
      const savedCart = localStorage.getItem(`shophub_cart_user_${user.id}`);
      setItems(savedCart ? JSON.parse(savedCart) : []);
    } else {
      setItems([]);
    }
  }, [user]);

  const addToCart = (product, quantity = 1) => {
    if (!user) {
      alert("Bạn phải đăng nhập hệ thống thì mới thêm sản phẩm vào giỏ được !");
      return;
    }

    setItems((prevItems) => {
      const exist = prevItems.find((item) => item.id === product.id);
      let updatedCart;
      
      if (exist) {
        updatedCart = prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        updatedCart = [
          ...prevItems, 
          { 
            id: product.id, 
            name: product.name, 
            price: product.price, 
            imageUrl: product.imageUrl, 
            quantity 
          }
        ];
      }

      localStorage.setItem(`shophub_cart_user_${user.id}`, JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const removeFromCart = (productId) => {
    if (!user) return;

    setItems((prevItems) => {
      const updatedCart = prevItems.filter((item) => item.id !== productId);
      localStorage.setItem(`shophub_cart_user_${user.id}`, JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (!user) return;

    setItems((prevItems) => {
      if (newQuantity <= 0) {
        const updatedCart = prevItems.filter((item) => item.id !== productId);
        localStorage.setItem(`shophub_cart_user_${user.id}`, JSON.stringify(updatedCart));
        return updatedCart;
      }

      const updatedCart = prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      localStorage.setItem(`shophub_cart_user_${user.id}`, JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const clearCart = () => {
    setItems([]);
    if (user && user.id) {
      localStorage.removeItem(`shophub_cart_user_${user.id}`);
    }
  };

  const cartSummary = useMemo(() => {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    return { totalQuantity, totalPrice };
  }, [items]);

  return (
    <CartContext.Provider value={{ 
      items, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      ...cartSummary 
    }}>
      {children}
    </CartContext.Provider>
  );
};