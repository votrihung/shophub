export const setToken = (token) => {
  localStorage.setItem('shophub_token', token);
};

export const getToken = () => {
  return localStorage.getItem('shophub_token');
};

export const removeToken = () => {
  localStorage.removeItem('shophub_token');
};