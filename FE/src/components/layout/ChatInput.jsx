import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

function ChatInput({ onSendMessage, isLoading, messagesCount }) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (trimmed && !isLoading) {
      onSendMessage(trimmed);
      setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div
      className={`px-4 py-3 bg-white shadow-sm border-t ${
        messagesCount === 0 ? "rounded shadow-lg backdrop-blur-md" : ""
      } sticky bottom-0`}
    >
      <form onSubmit={handleSubmit}>
        <div className="relative">
          {/* Textarea nhập tin nhắn */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập tin nhắn...(Enter gửi / Shift+Enter xuống dòng)"
            disabled={isLoading}
            className="w-full pr-14 rounded-3xl resize-none text-sm min-h-[44px] max-h-[200px] overflow-y-auto bg-gray-100 border-0 focus:ring-0 focus:outline-none p-3"
          />

          {/* Nút gửi */}
          <button
            type="submit"
            aria-label="Gửi"
            disabled={isLoading || !message.trim()}
            className={`absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200
              ${
                isLoading || !message.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-br from-blue-600 to-purple-700 hover:opacity-90"
              } text-white`}
          >
            {isLoading ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      </form>

      <div className="text-center mt-2">
        <small className="text-gray-500">
          Alpha AI có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng.
        </small>
      </div>
    </div>
  );
}

export default ChatInput;
