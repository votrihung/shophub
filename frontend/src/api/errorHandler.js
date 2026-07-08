export const handleApiError = (error) => {
  let message = 'Đã có lỗi xảy ra, vui lòng thử lại sau!';

  if (error.response) {
    message = error.response.data?.detail || `Lỗi hệ thống (${error.response.status})`;
  } else if (error.request) {
    message = 'Không thể kết nối đến máy chủ Backend. Vui lòng kiểm tra lại server!';
  } else {
    message = error.message;
  }

  console.error('[API Error Log]:', error);
  throw new Error(message);
};