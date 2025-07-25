import { Bot, Trash2, Sparkles } from "lucide-react";

function ChatHeader({ messagesCount, onClearChat, isLoading }) {
  return (
    <div
      className="shadow-sm text-white"
      style={{
        background: "linear-gradient(135deg, #007bff, #6f42c1)",
      }}
    >
      <div className="flex ml-4 flex-wrap justify-between items-center gap-3 px-6 py-4">
        {/* Logo & tên bot */}
        <div className="flex items-center flex-grow">
          <div className="bg-white bg-opacity-25 rounded-full p-2 mr-3 flex items-center justify-center w-[42px] h-[42px]">
            <Bot size={22} />
          </div>
          <div>
            <h5 className="font-bold text-base m-0">Alpha AI ChatBot</h5>
            <div className="flex items-center text-white text-sm opacity-75">
              <Sparkles size={14} className="mr-1" />
              Team Alpha
            </div>
          </div>
        </div>

        {/* Các nút chức năng */}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/about"
            className="text-white text-sm px-4 py-2 rounded-full border border-white border-opacity-30 hover:bg-white hover:bg-opacity-10 transition"
          >
            Giới thiệu
          </a>

          <a
            href="/login"
            className="text-white text-sm px-4 py-2 rounded-full border border-white border-opacity-30 hover:bg-white hover:bg-opacity-10 transition"
          >
            Đăng nhập
          </a>

          <a
            href="/register"
            className="text-white text-sm px-4 py-2 rounded-full border border-white border-opacity-30 hover:bg-white hover:bg-opacity-10 transition"
          >
            Đăng ký
          </a>

          {messagesCount > 0 && (
            <button
              onClick={onClearChat}
              disabled={isLoading}
              className={`flex items-center text-white text-sm px-4 py-2 rounded-full border border-white border-opacity-30 transition ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-white hover:bg-opacity-10"
              }`}
            >
              <Trash2 size={16} className="mr-2" />
              Xoá Chat
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
