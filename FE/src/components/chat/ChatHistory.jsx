import {
  MessageCircle,
  Trash2,
  Edit3,
  Calendar,
  MoreVertical,
} from "lucide-react";
import { useState } from "react";

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

  // toggle side bar
  const [hidden, setHidden] = useState(false);
  const toggleSidebar = () => setHidden((prev) => !prev);

  // toggle search
  const [hiddenSearch, showSearch] = useState(false);
  const toggleSearch = () => showSearch((prev) => !prev);

  return (
    <div className="block relative">
      <div
        className={`${
          hidden ? "w-0" : "w-[300px]"
        } flex flex-col h-screen  bg-neutral-800  transition-all duration-300 ease-in-out overflow-hidden`}
      >
        {/* Header */}
        <div className="p-3 bg-neutral-800">
          {/* Hàng đầu: Chats và nút menu */}
          <div className="flex justify-between items-center mb-2">
            <h6 className="m-0 font-semibold text-2xl text-gray-100">
              Chats history
            </h6>
            <button
              onClick={toggleSidebar}
              className="flex items-center hover:bg-neutral-500 transition-all duration-200 rounded-sm"
            >
              <img className="w-8 h-8" src="/public/menu-bar.png" alt="..." />
            </button>
          </div>
          {/* Nút "Mới" */}
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-100 bg-neutral-800 rounded hover:bg-neutral-500 transition-all duration-200"
          >
            <img
              src="/public/new-tab.png"
              alt="new-chat"
              className="w-5 h-5 object-contain filter invert brightness-200"
            />
            <span className="leading-none">New chat</span>
          </button>
          {/* Ô tìm kiếm */}
          <button
            onClick={toggleSearch}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-100 bg-neutral-800 rounded hover:bg-neutral-500 transition-all duration-200"
          >
            <img
              src="/public/search.png"
              alt="new-chat"
              className="w-5 h-5 object-contain filter invert brightness-200"
            />
            <span className="leading-none">Tìm kiếm</span>
          </button>
          {hiddenSearch == true && (
            <input
              type="text"
              placeholder="vui lòng nhập để tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 text-neutral-50 border-gray-1 text-base rounded mb-2 outline-none focus:outline-none"
            />
          )}
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleSelectChat(chat)}
              className={`px-4 py-3 border-b cursor-pointer ${
                currentChatId === chat.id
                  ? "bg-neutral-500"
                  : "hover:bg-neutral-400 transition-all duration-200"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-grow mr-2 text-gray-200">
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
                        className="px-2 py-1 text-xs text-gray-200 bg-green-600 rounded hover:bg-green-700"
                      >
                        Lưu
                      </button>
                    </div>
                  ) : (
                    <h6 className="mb-1 text-sm font-medium truncate">
                      {chat.title}
                    </h6>
                  )}
                  <div className="flex items-center text-xs text-gray-200 gap-2">
                    <Calendar size={12} />
                    <span>{formatDate(chat.updatedAt)}</span>
                    <span className="ml-auto inline-block px-2 py-0.5 text-xs bg-gray-500 text-gray-100 rounded">
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
            <div className="text-center text-gray-100 p-3">
              Chưa có lịch sử chat nào
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-100 text-xs p-3  bg-neutral-800 ">
          <p className="mb-0">© {new Date().getFullYear()} Alpha AI ChatBot</p>
        </footer>
      </div>
      {hidden == true && (
        <div className="absolute top-4 left-0 flex w-10 h-10 z-50 bg-zinc-700/60 rounded-r-lg">
          <button
            onClick={toggleSidebar}
            className=" hover:bg-neutral-500 transition-all duration-200 rounded-sm"
          >
            <img className="w-10 h-10" src="/public/menu-bar.png" alt="..." />
          </button>
        </div>
      )}
    </div>
  );
}

export default ChatHistory;
