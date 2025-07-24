import React from "react";

function ErrorAlert({ error, onDismiss }) {
  if (!error) return null;

  return (
    <div className="w-full px-4 pb-3">
      <div className="relative bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-sm mb-0">
        {/* Nút đóng */}
        <button
          onClick={onDismiss}
          className="absolute top-1 right-2 text-red-700 hover:text-red-900"
          aria-label="Close"
        >
          ×
        </button>

        {/* Tiêu đề */}
        <div className="font-semibold mb-1">Lỗi!</div>

        {/* Nội dung lỗi */}
        <div className="text-sm">{error}</div>
      </div>
    </div>
  );
}

export default ErrorAlert;
