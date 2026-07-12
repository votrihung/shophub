import { getUserInfo } from './userInfo';

export function useAuth() {
  // Lấy token (tui giả định hàm lấy token cũ của sốp ở máy hoặc lấy trực tiếp từ localStorage)
  const token = localStorage.getItem('shophub_token');
  const user = getUserInfo();

  return {
    isAuthenticated: Boolean(token) && token !== 'undefined',
    role: user?.role || 'CUSTOMER', // Nếu không tìm thấy quyền, mặc định là CUSTOMER
    user,
  };
}