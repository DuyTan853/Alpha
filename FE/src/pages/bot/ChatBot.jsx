import React, { useState, useEffect, useRef } from 'react';
import { Container, Modal, Button, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';

import ChatHeader from '../../components/layout/ChatHeader';
import ChatMessages from '../../components/chat/ChatMessages';
import ChatInput from '../../components/layout/ChatInput';
import ErrorAlert from '../../components/ErrorAlert';
import ChatHistory from '../../components/chat/ChatHistory';

import '../../assets/css/chatbot.css'

function ChatBot() {
  
  // Lưu  lịch sử  chát
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState([]);
  const [editTitle, setEditTitle] = useState('');
  const [editingChatId, setEditingChatId] = useState(null);
  const [chatToDelete, setChatToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);
  const [showSidebar, setShowSidebar] = useState(false); // Thêm điều khiển sidebar

  useEffect(() => {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
      const parsed = JSON.parse(saved);
      setChatHistory(parsed);
      setCurrentChatId(parsed[0]?.id || null);
      setMessages(parsed[0]?.messages || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    setShowSidebar(false); // Đóng sidebar khi chọn (mobile)
  };

  const updateHistory = (updatedMessages) => {
    const newHistory = chatHistory.map(chat =>
      chat.id === currentChatId
        ? { ...chat, messages: updatedMessages, messageCount: updatedMessages.length, updatedAt: new Date().toISOString() }
        : chat
    );
    setChatHistory(newHistory);
  };
  // Hàm gửi tin nhắn
  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const userMsg = { role: 'user', content: messageText };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    updateHistory(newMessages);
    setError('');
    setIsLoading(true);

    try {
      const conversationHistory = newMessages
        .filter((msg) => msg.role !== 'bot')
        .map((msg) => ({
          role: msg.role === 'bot' ? 'assistant' : msg.role,
          content: msg.content,
        }));

      const response = await fetch('http://localhost:8000/chat/stream?stream=true', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          messages: conversationHistory,
          model: 'mistral:7b-instruct',
        }),
      });

      if (!response.ok || !response.body) {
        const errorText = await response.text();
        console.error('Phản hồi lỗi từ server:', errorText);
        throw new Error(`Lỗi phản hồi: ${response.status} - ${errorText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      let botMsg = { role: 'bot', content: '' };
      const updatedMessages = [...newMessages, botMsg];
      setMessages(updatedMessages);

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // giữ dòng cuối chưa hoàn chỉnh

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
            console.error('Lỗi parse JSON:', e, '→ dòng:', line);
          }
        }
      }
      updateHistory([...newMessages, botMsg]);
    } catch (err) {
      console.error('Lỗi stream:', err);
      setError('Đã xảy ra lỗi khi kết nối với AI. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };
  // Hàm để chỉnh sửa tiêu đề chat
  const handleEditTitle = (chatId) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      setEditingChatId(chatId);
      setEditTitle(chat.title);
    }
  };

  const saveEditTitle = () => {
    const updated = chatHistory.map(chat =>
      chat.id === editingChatId
        ? { ...chat, title: editTitle.trim() }
        : chat
    );
    setChatHistory(updated);
    setEditingChatId(null);
    setEditTitle('');
  };

  const handleDeleteChat = () => {
    const updated = chatHistory.filter(chat => chat.id !== chatToDelete);
    setChatHistory(updated);
    setShowDeleteModal(false);
    setChatToDelete(null);
    if (chatToDelete === currentChatId) {
      setCurrentChatId(updated[0]?.id || null);
      setMessages(updated[0]?.messages || []);
    }
  };

  return (
    <Container fluid className="p-0 m-0 vh-100">
      <div className="d-flex h-100 fixed-top">
        {/* Sidebar - Hiển thị khi màn hình rộng */}
        <div className="d-none d-md-block" style={{ width: '300px', borderRight: '1px solid #ddd', background: '#f8f9fa' }}>
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

        {/* Chat content */}
        <div className="flex-grow-1 d-flex flex-column">
          {/* Nút mở Sidebar (mobile) */}
          <div className="d-md-none border-bottom bg-light">
            <Row>
              <Col xs="6">
                <Button variant="light" onClick={() => setShowSidebar(true)}>
                  📚 Lịch sử chat
                </Button>
              </Col>
              <Col xs={6}>
                <div className="d-flex gap-3 p-2 justify-content-end  ">
                  <a
                    href="https://www.facebook.com/nguyen.nam.394402"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary fs-7 icon-hover"
                    aria-label="Visit our Facebook page"
                  >
                    <i className="bi bi-facebook"></i>
                  </a>

                  <a
                    href="https://www.instagram.com/nam.hocfrontend/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary fs-7 icon-hover"
                    aria-label="Visit our Instagram profile"
                  >
                    <i className="bi bi-instagram"></i>
                  </a>

                  <a
                    href="https://www.facebook.com/messages/e2ee/t/8183705491745437"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary fs-7 icon-hover"
                    aria-label="Chat with us on Messenger"
                  >
                    <i className="bi bi-messenger"></i>
                  </a>

                  <a
                    href="https://github.com/Na-tech74"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary fs-7 icon-hover"
                    aria-label="View our GitHub repository"
                  >
                    <i className="bi bi-github"></i>
                  </a>

                  <a
                    href="https://mail.google.com/mail/u/0/#inbox"
                    className="text-secondary fs-7 icon-hover"
                    aria-label="Send us an email"
                  >
                    <i className="bi bi-envelope-check"></i>
                  </a>
                </div>
              </Col>
            </Row>
          </div>

          <div className="position-sticky top-0 z-3">
            <ChatHeader
              messagesCount={messages.length}
              onClearChat={() => setMessages([])}
              isLoading={isLoading}
            />
          </div>

          <div className="flex-grow-1 overflow-auto px-3 py-2 mt-5 ">
            <Container style={{ maxWidth: '850px' }}>
              <ChatMessages
                messages={messages}
                isLoading={isLoading}
                onQuickMessage={(text) => handleSendMessage(text)}
              />
              <div ref={bottomRef} />
            </Container>
          </div>

          <ErrorAlert error={error} onDismiss={() => setError('')} />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="position-sticky bottom-0"
            style={{ zIndex: 1000 }}
          >
            <div className="d-flex justify-content-center px-2 py-3">
              <div style={{ width: '100%', maxWidth: '850px' }}>
                <ChatInput
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  messagesCount={messages.length}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal Sidebar (Offcanvas) cho mobile */}
      <Modal show={showSidebar} onHide={() => setShowSidebar(false)} className="d-md-none">
        <Modal.Header closeButton>
          <Modal.Title>Lịch sử trò chuyện</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0 w-100" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
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
        </Modal.Body>
      </Modal>

      {/* Modal xác nhận xoá */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xoá</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn xoá cuộc trò chuyện này?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Huỷ
          </Button>
          <Button variant="danger" onClick={handleDeleteChat}>
            Xoá
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ChatBot;
