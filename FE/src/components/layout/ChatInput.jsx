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
      className={`px-4 py-3 bg-neutral-800 shadow-sm border rounded-2xl

 ${
   messagesCount === 0 ? "rounded shadow-lg backdrop-blur-md" : ""
 } sticky bottom-0`}
    >
      <form onSubmit={handleSubmit}>
        <div className="flex items-end gap-2">
          {/* Textarea nhập tin nhắn */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập tin nhắn...(Enter gửi / Shift+Enter xuống dòng)"
            disabled={isLoading}
            className="w-full rounded-3xl resize-none text-lg min-h-[44px] max-h-[200px] text-gray-50 overflow-y-auto bg-neutral-800 border-0 focus:ring-0 focus:outline-none p-3"
          />

          {/* Nút chồng: Gửi và Ghi âm */}
          <div className="relative w-10 h-10">
            {/* Nút gửi */}
            <button
              type="submit"
              aria-label="Gửi"
              disabled={isLoading || !message.trim()}
              className={`absolute inset-0 flex items-center justify-center rounded-full transition-all duration-200
            ${
              isLoading || !message.trim()
                ? "hidden"
                : "bg-gradient-to-br bg-neutral-300 text-gray-600 hover:opacity-90 border transition-all"
            }`}
            >
              {isLoading ? (
                <div className="animate-spin h-4 w-4 border-2 bg-neutral-300 border-t-transparent rounded-full" />
              ) : (
                <Send size={18} />
              )}
            </button>

            {/* Nút ghi âm */}
            <button
              type="button"
              onClick={handleVoiceRecord}
              disabled={isLoading || isRecording || message.trim()}
              title="Ghi âm giọng nói"
              className={`absolute inset-0 flex items-center justify-center rounded-full border transition-all
            ${
              message.trim()
                ? "hidden"
                : isRecording
                ? "bg-red-500 text-white animate-pulse"
                : "bg-neutral-300 text-gray-600 hover:bg-gray-200"
            }`}
            >
              {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          </div>
        </div>
      </form>

      <div className="text-center mt-2">
        <small className="text-gray-500">
          Team Alpha thực hiện và phát triển
        </small>
      </div>
    </div>
  );
}

export default ChatInput;
