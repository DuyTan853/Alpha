 import React from "react";
 function NotFound404() {
   return (
     <div className="text-center py-5">
       <h1 className="display-1">404</h1>
       <h2 className="fw-bold">Không tìm thấy trang</h2>
       <p className="text-muted">Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
       <a href="/" className="btn btn-primary mt-3">Quay về trang chủ</a>
     </div>
   );
 }
 export default NotFound404;