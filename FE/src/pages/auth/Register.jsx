import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Github, Chrome } from "lucide-react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Mật khẩu không khớp!");
      return;
    }
    setIsLoading(true);
    setError("");
    setTimeout(() => {
      console.log("Đăng ký:", email, password);
      navigate("/login");
    }, 1000);
  };

  const handleOAuthLogin = (provider) => {
    alert(`Đang chuyển hướng đến đăng ký với ${provider}...`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-xl bg-white shadow-md rounded-2xl p-6">
        {/* Nút quay về */}
        <div className="mb-5">
          <button
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={16} />
            <span>Trang chủ</span>
          </button>
        </div>

        {/* Tiêu đề */}
        <h3 className="text-xl font-bold text-blue-600 text-center mb-1">
          Tạo tài khoản
        </h3>
        <p className="text-sm text-gray-500 text-center mb-6">
          Đăng ký để bắt đầu sử dụng Alpha AI
        </p>

        {/* Form đăng ký */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Họ và tên:</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập họ và tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Số điện thoại:
            </label>
            <input
              type="tel"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập số điện thoại"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Địa chỉ:</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập địa chỉ"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email:</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mật khẩu:</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Nhập lại mật khẩu:
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập lại mật khẩu"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          {/* OAuth divider */}
          <div className="relative text-center text-gray-400 text-sm my-4">
            <span className="relative z-10 bg-white px-2">hoặc</span>
            <div className="absolute top-1/2 left-0 right-0 border-t border-gray-300 -z-0"></div>
          </div>

          {/* OAuth buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleOAuthLogin("Google")}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition"
            >
              <Chrome size={18} />
              Đăng ký với Google
            </button>

            <button
              type="button"
              onClick={() => handleOAuthLogin("GitHub")}
              className="w-full flex items-center justify-center gap-2 bg-black text-white py-2 rounded-md hover:bg-gray-900 transition"
            >
              <Github size={18} />
              Đăng ký với GitHub
            </button>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-full mt-2 hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-white border-solid"></span>
                Đang đăng ký...
              </div>
            ) : (
              "Đăng ký"
            )}
          </button>

          {/* Error message */}
          {error && (
            <div className="text-red-500 text-sm text-center mt-2">{error}</div>
          )}
        </form>

        {/* Link to login */}
        <div className="text-center mt-6 text-sm text-gray-500">
          Đã có tài khoản?{" "}
          <a
            href="/login"
            className="text-blue-500 font-semibold hover:underline"
          >
            Đăng nhập
          </a>
        </div>
      </div>
    </div>
  );
}
