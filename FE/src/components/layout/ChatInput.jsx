import React, { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff } from "lucide-react";

function ChatInput({ onSendMessage, isLoading, messagesCount }) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
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

  const handleVoiceRecord = async () => {
    if (isRecording) return;

    try {
      setIsRecording(true);
      const res = await fetch("http://localhost:8000/voice/record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ duration: 5, language: "vi-VN" }),
      });
      const data = await res.json();

      if (data.success && data.text) {
        onSendMessage(data.text); // Gửi như tin nhắn thường
      } else {
        alert("Không nhận diện được giọng nói.");
      }
    } catch (err) {
      console.error("Lỗi ghi âm:", err);
      alert("Lỗi khi ghi âm hoặc kết nối server.");
    } finally {
      setIsRecording(false);
    }
  };

  return (
    <div
      className={`px-4 py-3 bg-white shadow-sm border-t ${
        messagesCount === 0 ? "rounded shadow-lg backdrop-blur-md" : ""
      } sticky bottom-0`}
    >
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-end gap-2">
          {/* Nút ghi âm */}
          <button
            type="button"
            onClick={handleVoiceRecord}
            disabled={isLoading || isRecording}
            title="Ghi âm giọng nói"
            className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all ${
              isRecording
                ? "bg-red-500 text-white animate-pulse"
                : "bg-white text-gray-600 hover:bg-gray-200"
            }`}
          >
            {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

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
