import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ChatHeader from "../../components/layout/ChatHeader";
import ChatMessages from "../../components/chat/ChatMessages";
import ChatInput from "../../components/layout/ChatInput";
import ErrorAlert from "../../components/ErrorAlert";
import ChatHistory from "../../components/chat/ChatHistory";

export default function ChatBot() {
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState([]);
  const [editTitle, setEditTitle] = useState("");
  const [editingChatId, setEditingChatId] = useState(null);
  const [chatToDelete, setChatToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("chatHistory");
    if (saved) {
      const parsed = JSON.parse(saved);
      setChatHistory(parsed);
      setCurrentChatId(parsed[0]?.id || null);
      setMessages(parsed[0]?.messages || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: `Chat ${chatHistory.length + 1}`,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: 0,
    };
    setChatHistory([newChat, ...chatHistory]);
    setCurrentChatId(newChat.id);
    setMessages([]);
  };

  const handleSelectChat = (chat) => {
    setCurrentChatId(chat.id);
    setMessages(chat.messages);
    setShowSidebar(false);
  };

  const updateHistory = (updatedMessages) => {
    const newHistory = chatHistory.map((chat) =>
      chat.id === currentChatId
        ? {
            ...chat,
            messages: updatedMessages,
            messageCount: updatedMessages.length,
            updatedAt: new Date().toISOString(),
          }
        : chat
    );
    setChatHistory(newHistory);
  };

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const userMsg = { role: "user", content: messageText };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    updateHistory(newMessages);
    setError("");
    setIsLoading(true);

    try {
      const conversationHistory = newMessages
        .filter((msg) => msg.role !== "bot")
        .map((msg) => ({
          role: msg.role === "bot" ? "assistant" : msg.role,
          content: msg.content,
        }));

      const response = await fetch(
        "http://localhost:8000/chat/stream?stream=true",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: messageText,
            messages: conversationHistory,
            model: "mistral:7b-instruct",
          }),
        }
      );

      if (!response.ok || !response.body) {
        const errorText = await response.text();
        throw new Error(`Lỗi phản hồi: ${response.status} - ${errorText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let botMsg = { role: "bot", content: "" };
      const updatedMessages = [...newMessages, botMsg];
      setMessages(updatedMessages);

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            if (data.message?.content) {
              botMsg.content += data.message.content;
              const updated = [...newMessages, { ...botMsg }];
              setMessages(updated);
            }
          } catch (e) {
            console.error("Parse error:", e);
          }
        }
      }

      updateHistory([...newMessages, botMsg]);
    } catch (err) {
      console.error("Stream error:", err);
      setError("Đã xảy ra lỗi khi kết nối với AI. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTitle = (chatId) => {
    const chat = chatHistory.find((c) => c.id === chatId);
    if (chat) {
      setEditingChatId(chatId);
      setEditTitle(chat.title);
    }
  };

  const saveEditTitle = () => {
    const updated = chatHistory.map((chat) =>
      chat.id === editingChatId ? { ...chat, title: editTitle.trim() } : chat
    );
    setChatHistory(updated);
    setEditingChatId(null);
    setEditTitle("");
  };

  const handleDeleteChat = () => {
    const updated = chatHistory.filter((chat) => chat.id !== chatToDelete);
    setChatHistory(updated);
    setShowDeleteModal(false);
    setChatToDelete(null);
    if (chatToDelete === currentChatId) {
      setCurrentChatId(updated[0]?.id || null);
      setMessages(updated[0]?.messages || []);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <ChatHistory
        chatHistory={chatHistory}
        currentChatId={currentChatId}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleNewChat={handleNewChat}
        handleSelectChat={handleSelectChat}
        editingChatId={editingChatId}
        editTitle={editTitle}
        setEditTitle={setEditTitle}
        handleEditTitle={handleEditTitle}
        saveEditTitle={saveEditTitle}
        setChatToDelete={setChatToDelete}
        setShowDeleteModal={setShowDeleteModal}
      />

      {/* Chat Area */}
      <main className="flex flex-col flex-1 h-full relative">
        {/* Mobile top bar */}
        <div className="md:hidden  p-3 bg-white flex justify-between items-center">
          <button
            className="text-sm font-medium text-blue-600"
            onClick={() => setShowSidebar(true)}
          >
            📚 Lịch sử chat
          </button>
          <div className="flex space-x-3 text-gray-500 text-lg">
            <a
              href="https://facebook.com/nguyen.nam.394402"
              target="_blank"
              rel="noreferrer"
            >
              <i className="bi bi-facebook" />
            </a>
            <a
              href="https://instagram.com/nam.hocfrontend"
              target="_blank"
              rel="noreferrer"
            >
              <i className="bi bi-instagram" />
            </a>
            <a
              href="https://github.com/Na-tech74"
              target="_blank"
              rel="noreferrer"
            >
              <i className="bi bi-github" />
            </a>
            <a href="mailto:your@email.com">
              <i className="bi bi-envelope-check" />
            </a>
          </div>
        </div>

        <div className="sticky top-0 z-10 bg-white ">
          <ChatHeader
            messagesCount={messages.length}
            onClearChat={() => setMessages([])}
            isLoading={isLoading}
          />
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 bg-neutral-700">
          <div className="max-w-4xl mx-auto">
            <ChatMessages
              messages={messages}
              isLoading={isLoading}
              onQuickMessage={handleSendMessage}
            />
            <div ref={bottomRef} />
          </div>
        </div>

        {error && <ErrorAlert error={error} onDismiss={() => setError("")} />}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="sticky bottom-0 z-10 bg-neutral-700 px-4 py-3"
        >
          <div className="max-w-4xl mx-auto">
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              messagesCount={messages.length}
            />
          </div>
        </motion.div>
      </main>

      {/* Mobile Sidebar */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex md:hidden">
          <div className="w-[80%] bg-white h-full p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Lịch sử trò chuyện</h2>
              <button
                className="text-red-500 font-bold"
                onClick={() => setShowSidebar(false)}
              >
                Đóng
              </button>
            </div>
            <ChatHistory
              chatHistory={chatHistory}
              currentChatId={currentChatId}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleNewChat={handleNewChat}
              handleSelectChat={handleSelectChat}
              editingChatId={editingChatId}
              editTitle={editTitle}
              setEditTitle={setEditTitle}
              handleEditTitle={handleEditTitle}
              saveEditTitle={saveEditTitle}
              setChatToDelete={setChatToDelete}
              setShowDeleteModal={setShowDeleteModal}
            />
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4">Xác nhận xoá</h2>
            <p className="mb-6">
              Bạn có chắc chắn muốn xoá cuộc trò chuyện này?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded border"
              >
                Huỷ
              </button>
              <button
                onClick={handleDeleteChat}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Xoá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
