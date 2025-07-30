import { Bot, Trash2, Sparkles } from "lucide-react";

function ChatHeader({ messagesCount, onClearChat, isLoading }) {
  
  return (
    <div className=" text-white bg-neutral-700">
      <div className="flex ml-4 justify-end items-center gap-3 px-6 py-4">
        {/* Các nút chức năng */}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/about"
            className="text-white text-sm px-4 py-2 rounded-full hover:bg-neutral-500 hover:bg-opacity-10 transition"
          >
            Giới thiệu
          </a>

          <a
            href="/login"
            className="text-white text-sm px-4 py-2 rounded-full hover:bg-neutral-500 hover:bg-opacity-10 transition"
          >
            Đăng nhập
          </a>

          <a
            href="/register"
            className="text-white text-sm px-4 py-2 rounded-fullborder-opacity-30 hover:bg-neutral-500 hover:bg-opacity-10 transition"
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
