import React from "react";
import {
  MessageCircle,
  Trash2,
  Edit3,
  Calendar,
  MoreVertical,
} from "lucide-react";

function ChatHistory({
  chatHistory,
  currentChatId,
  searchTerm,
  setSearchTerm,
  handleNewChat,
  handleSelectChat,
  editingChatId,
  editTitle,
  setEditTitle,
  handleEditTitle,
  saveEditTitle,
  setChatToDelete,
  setShowDeleteModal,
}) {
  const filteredChats = chatHistory.filter((chat) =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("vi-VN");

  return (
    <div className="flex flex-col h-screen border-r bg-gray-100">
      {/* Header */}
      <div className="p-3 border-b bg-gray-300">
        <div className="flex justify-between items-center mb-2">
          <h6 className="m-0 font-semibold">📚 Lịch sử chat</h6>
          <button
            onClick={handleNewChat}
            className="flex items-center px-2 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            <MessageCircle size={16} className="mr-1" /> Mới
          </button>
        </div>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 text-sm border rounded"
        />
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => handleSelectChat(chat)}
            className={`px-4 py-3 border-b cursor-pointer ${
              currentChatId === chat.id ? "bg-blue-100" : "hover:bg-gray-200"
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-grow mr-2">
                {editingChatId === chat.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEditTitle();
                        if (e.key === "Escape") {
                          setEditTitle("");
                          editingChatId(null);
                        }
                      }}
                      autoFocus
                      className="w-full px-2 py-1 text-sm border rounded"
                    />
                    <button
                      onClick={saveEditTitle}
                      className="px-2 py-1 text-xs text-white bg-green-600 rounded hover:bg-green-700"
                    >
                      Lưu
                    </button>
                  </div>
                ) : (
                  <h6 className="mb-1 text-sm font-medium truncate">
                    {chat.title}
                  </h6>
                )}
                <div className="flex items-center text-xs text-gray-500 gap-2">
                  <Calendar size={12} />
                  <span>{formatDate(chat.updatedAt)}</span>
                  <span className="ml-auto inline-block px-2 py-0.5 text-xs bg-gray-500 text-white rounded">
                    {chat.messageCount}
                  </span>
                </div>
              </div>

              {/* Dropdown menu */}
              <div className="relative group">
                <button className="p-1">
                  <MoreVertical size={16} />
                </button>
                <div className="absolute right-0 z-10 hidden group-hover:block bg-white border shadow rounded w-32">
                  <button
                    onClick={() => handleEditTitle(chat.id)}
                    className="w-full flex items-center px-3 py-2 text-sm hover:bg-gray-100"
                  >
                    <Edit3 size={14} className="mr-2" /> Đổi tên
                  </button>
                  <button
                    onClick={() => {
                      setChatToDelete(chat.id);
                      setShowDeleteModal(true);
                    }}
                    className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-100"
                  >
                    <Trash2 size={14} className="mr-2" /> Xoá
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {chatHistory.length === 0 && (
          <div className="text-center text-gray-500 p-3">
            Chưa có lịch sử chat nào
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-600 text-xs p-3 bg-gray-300">
        <p className="mb-0">
          Powered by{" "}
          <a
            href="https://ollama.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-600"
          >
            Ollama
          </a>
        </p>
        <p className="mb-0">© {new Date().getFullYear()} Gnar AI ChatBot</p>
      </footer>
    </div>
  );
}

export default ChatHistory;
