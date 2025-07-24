import React from "react";

function NotFound404() {
  return (
    <div className="text-center py-20 px-4">
      <h1 className="text-7xl font-extrabold text-blue-600">404</h1>
      <h2 className="text-2xl font-bold mt-2">Không tìm thấy trang</h2>
      <p className="text-gray-500 mt-2">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
      </p>
      <a
        href="/"
        className="inline-block mt-6 px-5 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-full font-medium transition"
      >
        Quay về trang chủ
      </a>
    </div>
  );
}

export default NotFound404;
