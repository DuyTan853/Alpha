import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 flex-wrap">
        <button
          className="flex items-center gap-2 px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100 transition"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={16} />
          <span className="text-sm">Quay lại</span>
        </button>

        <div className="flex gap-4 text-gray-500 text-xl">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:text-blue-600"
          >
            <i className="bi bi-facebook" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-pink-500"
          >
            <i className="bi bi-instagram" />
          </a>
          <a
            href="https://messenger.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Messenger"
            className="hover:text-blue-500"
          >
            <i className="bi bi-messenger" />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-gray-800"
          >
            <i className="bi bi-github" />
          </a>
          <a
            href="mailto:contact@yourwebsite.com"
            aria-label="Email"
            className="hover:text-green-600"
          >
            <i className="bi bi-envelope-check" />
          </a>
        </div>
      </div>

      {/* Giới thiệu */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-2xl font-bold mb-2">
          🤖 Giới thiệu về Gnar AI ChatBot
        </h2>
        <p className="text-gray-600">
          Gnar AI là trợ lý ảo thông minh được xây dựng dựa trên công nghệ AI
          tiên tiến, giúp bạn trò chuyện, học tập, lập trình và sáng tạo hiệu
          quả hơn.
        </p>
      </div>

      {/* Thẻ giới thiệu */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm h-full">
          <h3 className="font-semibold mb-2">⚡ Tương tác mượt mà</h3>
          <p className="text-gray-600 text-sm">
            Gnar AI mang đến trải nghiệm hội thoại tự nhiên, trả lời nhanh chóng
            và chính xác các câu hỏi của bạn.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm h-full">
          <h3 className="font-semibold mb-2">💡 Hỗ trợ học tập & lập trình</h3>
          <p className="text-gray-600 text-sm">
            Gnar AI có thể giúp bạn giải bài tập, viết code, tìm lỗi, tóm tắt
            nội dung và nhiều hơn thế nữa.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm h-full">
          <h3 className="font-semibold mb-2">🔒 Bảo mật & riêng tư</h3>
          <p className="text-gray-600 text-sm">
            Dữ liệu trò chuyện được lưu cục bộ, không chia sẻ ra bên ngoài nhằm
            đảm bảo quyền riêng tư của bạn.
          </p>
        </div>
      </div>

      {/* Công nghệ nền tảng */}
      <div className="mt-16 text-center">
        <h5 className="text-lg font-bold mb-2">🚀 Công nghệ nền tảng</h5>
        <p className="text-sm">
          Gnar AI sử dụng <strong>FastAPI</strong> cho backend,{" "}
          <strong>React</strong> cho frontend và{" "}
          <strong>Ollama + Phi-3:mini</strong> làm mô hình AI xử lý ngôn ngữ.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          © {new Date().getFullYear()} Gnar AI ChatBot - Phiên bản thử nghiệm
          dành cho mục đích học tập và nghiên cứu.
        </p>
      </div>
    </div>
  );
}

export default About;
