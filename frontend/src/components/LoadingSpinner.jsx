// src/components/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col justify-center items-center my-10 gap-3">
      {/* Vòng tròn xoay dùng Tailwind Animation */}
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-500"></div>
      <p className="text-gray-600 font-medium text-sm">Đang tải dữ liệu từ máy chủ...</p>
    </div>
  );
};

export default LoadingSpinner;