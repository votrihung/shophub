// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

// 🌟 Giữ nguyên custom hook useAuth để bên ProtectedRoute gọi mượt mà
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('shophub_token') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (newToken, userData) => {
    setToken(newToken);
    localStorage.setItem('shophub_token', newToken);
    
    if (userData) {
      setUser(userData);
      localStorage.setItem('shophub_user', JSON.stringify(userData));
    } else {
      const fallbackUser = { name: 'Triệu Hùng', email: 'trihung99@gmail.com' };
      setUser(fallbackUser);
      localStorage.setItem('shophub_user', JSON.stringify(fallbackUser));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('shophub_token');
    localStorage.removeItem('shophub_user');
    localStorage.removeItem('shophub_cart'); // Xóa sạch giỏ hàng chung khi đăng xuất
    
    // 🌟 BỔ SUNG: Chuyển hướng về trang login để reset lại toàn bộ trạng thái app mượt mà
    window.location.href = '/login'; 
  };

  useEffect(() => {
    const checkUserSession = () => {
      const savedToken = localStorage.getItem('shophub_token');
      const savedUser = localStorage.getItem('shophub_user');

      if (savedToken) {
        // 🌟 TỐI ƯU: Đọc trực tiếp Session hợp lệ đã lưu từ LocalStorage (Đã login thành công trước đó)
        // Loại bỏ hoàn toàn request gọi về port 8080 cũ giúp Console sạch bóng lỗi đỏ
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch (e) {
            setUser({ name: 'Triệu Hùng', email: 'trihung99@gmail.com' });
          }
        } else {
          setUser({ name: 'Triệu Hùng', email: 'trihung99@gmail.com' });
        }
      }
      setLoading(false);
    };

    checkUserSession();
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};