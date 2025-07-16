import { Container, Button } from 'react-bootstrap';
import { Bot, Trash2, Sparkles } from 'lucide-react';

function ChatHeader({ messagesCount, onClearChat, isLoading }) {
  return (
    <div 
      className="shadow-sm"
      style={{
        background: 'linear-gradient(135deg, #007bff, #6f42c1)',
        color: 'white',
      }}
    >
      <Container className="d-flex flex-wrap justify-content-between align-items-center py-3 gap-2">

        {/* Logo & tên bot */}
        <div className="d-flex align-items-center flex-grow-1">
          <div
            className="bg-white bg-opacity-25 rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
            style={{ width: '42px', height: '42px' }}
          >
            <Bot size={22} />
          </div>
          <div>
            <h5 className="mb-0 fw-bold">Gnar AI ChatBot</h5>
            <small className="d-flex align-items-center opacity-75">
              <Sparkles size={14} className="me-1" />
              Powered by Ollama
            </small>
          </div>
        </div>

        {/* Các nút chức năng */}
        <div className="d-flex align-items-center flex-wrap gap-2">
          <Button
            variant="outline-light"
            size="sm"
            href="/about"
            className="rounded-pill px-3 py-2 border-2"
            style={{ border: '2px solid rgba(255,255,255,0.3)' }}
          >
            Giới thiệu
          </Button>

          <Button
            variant="outline-light"
            size="sm"
            href="/login"
            className="rounded-pill px-3 py-2 border-2"
            style={{ border: '2px solid rgba(255,255,255,0.3)' }}
          >
            Đăng nhập
          </Button>

          <Button
            variant="outline-light"
            size="sm"
            href="/register"
            className="rounded-pill px-3 py-2 border-2"
            style={{ border: '2px solid rgba(255,255,255,0.3)' }}
          >
            Đăng ký
          </Button>

          {messagesCount > 0 && (
            <Button
              variant="outline-light"
              size="sm"
              onClick={onClearChat}
              disabled={isLoading}
              className="d-flex align-items-center rounded-pill px-3 py-2 border-2"
              style={{ border: '2px solid rgba(255,255,255,0.3)' }}
            >
              <Trash2 size={16} className="me-2" />
              Xoá Chat
            </Button>
          )}
        </div>
      </Container>
    </div>
  );
}

export default ChatHeader;
