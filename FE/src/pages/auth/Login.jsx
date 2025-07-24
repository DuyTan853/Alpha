import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ErrorAlert from "../../components/ErrorAlert";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (email === "admin@example.com" && password === "password") {
        alert("Đăng nhập thành công!");
        navigate("/");
      } else {
        setError("Email hoặc mật khẩu không đúng.");
      }
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-6">
        {/* Nút quay về */}
        <div className="mb-5">
          <button
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={16} />
            <span>Quay lại</span>
          </button>
        </div>

        {/* Tiêu đề */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-blue-600">Đăng nhập</h3>
          <p className="text-sm text-gray-500">Chào mừng bạn trở lại 👋</p>
        </div>

        {/* Thông báo lỗi */}
        <ErrorAlert error={error} onDismiss={() => setError("")} />

        {/* Form đăng nhập */}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email:
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập email"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Mật khẩu:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2"
              />
              Ghi nhớ đăng nhập
            </label>
            <Link to="#" className="text-sm text-blue-500 hover:underline">
              Quên mật khẩu?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-full hover:bg-blue-700 transition disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-white border-solid"></span>
                Đang đăng nhập...
              </div>
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>

        {/* OAuth divider */}
        <div className="flex items-center gap-2 my-6">
          <hr className="flex-1 border-gray-300" />
          <span className="text-sm text-gray-400">hoặc đăng nhập bằng</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* OAuth buttons */}
        <div className="space-y-3">
          <button className="w-full border border-gray-300 rounded-full py-2 flex justify-center items-center gap-2 hover:bg-gray-50">
            <i className="bi bi-google"></i> Google
          </button>
          <button className="w-full border border-gray-300 rounded-full py-2 flex justify-center items-center gap-2 hover:bg-gray-50">
            <i className="bi bi-github"></i> GitHub
          </button>
        </div>

        {/* Đăng ký */}
        <div className="text-center mt-6">
          <span className="text-sm text-gray-500">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="text-blue-500 font-semibold hover:underline"
            >
              Đăng ký ngay
            </Link>
          </span>
        </div>

        {/* Demo */}
        <div className="text-center mt-3">
          <small className="text-gray-400">
            Demo: admin@example.com / password
          </small>
        </div>
      </div>
    </div>
  );
}
