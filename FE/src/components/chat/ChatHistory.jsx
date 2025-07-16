import React from 'react';
import { Form, Button, ListGroup, Badge, Dropdown } from 'react-bootstrap';
import { MessageCircle, Trash2, Edit3, Calendar, MoreVertical } from 'lucide-react';

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
  const filteredChats = chatHistory.filter(chat =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('vi-VN');

  return (
    <div
      style={{
        borderRight: '1px solid #ddd',
        background: '#f8f9fa',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh', // full chiều cao
      }}
    >
      {/* Header: ô tìm kiếm và nút mới */}
      <div className="p-3 border-bottom" style={{ backgroundColor: '#dee2e6' }}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="mb-0">📚 Lịch sử chat</h6>
          <Button size="sm" onClick={handleNewChat}>
            <MessageCircle size={16} className="me-1" /> Mới
          </Button>
        </div>
        <Form.Control
          type="text"
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Danh sách chat */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <ListGroup variant="flush">
          {filteredChats.map((chat) => (
            <ListGroup.Item
              key={chat.id}
              onClick={() => handleSelectChat(chat)}
              className={`border-0 ${currentChatId === chat.id ? 'bg-primary bg-opacity-10' : ''
                }`}
              style={{ cursor: 'pointer' }}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1 me-2">
                  {editingChatId === chat.id ? (
                    <div className="d-flex gap-2">
                      <Form.Control
                        size="sm"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEditTitle();
                          if (e.key === 'Escape') {
                            setEditTitle('');
                            editingChatId(null);
                          }
                        }}
                        autoFocus
                      />
                      <Button variant="success" size="sm" onClick={saveEditTitle}>
                        Lưu
                      </Button>
                    </div>
                  ) : (
                    <h6 className="mb-1 text-truncate">{chat.title}</h6>
                  )}
                  <div className="d-flex text-muted small align-items-center gap-2">
                    <Calendar size={12} />
                    <span>{formatDate(chat.updatedAt)}</span>
                    <Badge bg="secondary" className="ms-auto">
                      {chat.messageCount}
                    </Badge>
                  </div>
                </div>
                <Dropdown align="end">
                  <Dropdown.Toggle variant="link" size="sm" className="p-1">
                    <MoreVertical size={14} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleEditTitle(chat.id)}>
                      <Edit3 size={14} className="me-2" /> Đổi tên
                    </Dropdown.Item>
                    <Dropdown.Item
                      className="text-danger"
                      onClick={() => {
                        setChatToDelete(chat.id);
                        setShowDeleteModal(true);
                      }}
                    >
                      <Trash2 size={14} className="me-2" /> Xoá
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>

        {chatHistory.length === 0 && (
          <div className="text-center text-muted p-3">Chưa có lịch sử chat nào</div>
        )}
      </div>

      {/* Footer */}
      <footer
        className="text-center text-muted small p-3"
        style={{ backgroundColor: '#dee2e6' }}
      >
        <p className="mb-0">
          Powered by{' '}
          <a href="https://ollama.com" target="_blank" rel="noopener noreferrer">
            Ollama
          </a>
        </p>
        <p className="mb-0">© {new Date().getFullYear()} Gnar AI ChatBot</p>
      </footer>
    </div>

  );
}

export default ChatHistory;
