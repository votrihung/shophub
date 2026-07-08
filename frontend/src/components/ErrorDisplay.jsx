// src/components/ErrorDisplay.jsx
import React from 'react';

const ErrorDisplay = ({ message, onRetry }) => {
  return (
    <div className="max-w-md mx-auto text-center my-10 p-6 border border-red-200 bg-red-50 rounded-xl shadow-sm">
      <div className="text-red-500 font-bold text-lg mb-2">Úi, đã có lỗi xảy ra!</div>
      <p className="text-red-600 text-sm mb-4 bg-white p-2 rounded border border-red-100">
        {message}
      </p>
      
      {/* Nếu có truyền hàm thử lại (onRetry) thì mới hiện nút */}
      {onRetry && (
        <button 
          onClick={onRetry} 
          className="px-5 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 active:scale-95 transition"
        >
          Thử lại ngay
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;