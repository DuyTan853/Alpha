import { motion } from 'framer-motion';
import { Card, Row, Col, Image } from 'react-bootstrap';
import { User } from 'lucide-react';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import ReactMarkdown from 'react-markdown';
import 'highlight.js/styles/github.css';
import gnarAvarta from '../../assets/images/gnarAvarta.png';

function ChatMessages({ messages,onQuickMessage }) {
  const WelcomeMessage = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center py-5"
    >
      <div className="mb-4 text-center">
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle shadow"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            width: '60px',
            height: '60px',
            padding: '5px',
          }}
        >
          <Image
            src={gnarAvarta}
            roundedCircle
            alt="Gnar Avatar"
            style={{
              width: '50px',
              height: '50px',
              objectFit: 'cover',
              transition: 'transform 0.3s ease',
            }}
          />
        </div>
      </div>

      <h2 className="h3 fw-bold text-dark mb-3">Chào mừng đến với Gnar AI!</h2>
      <p className="text-muted mb-4 px-3">
        Tôi là trợ lý AI thông minh, sẵn sàng giúp bạn giải đáp mọi thắc mắc.
      </p>

      <Row className="g-3 justify-content-center">
        {[
          { icon: '💡', text: 'Giải thích về trí tuệ nhân tạo' },
          { icon: '👨‍💻', text: 'Giúp tôi học lập trình' },
          { icon: '🎨', text: 'Tạo ý tưởng sáng tạo' },
          { icon: '🔍', text: 'Tìm hiểu về công nghệ' },
        ].map((item, i) => (
          <Col key={i} xs={12} md={6} lg={3}>
            <Card
              className="h-100 border-0 shadow-sm hover-card"
              style={{
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onClick={() => onQuickMessage?.(item.text)}
            >
              <Card.Body className="text-center p-3">
                <div className="fs-4 mb-2">{item.icon}</div>
                <small className="text-muted">{item.text}</small>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </motion.div>
  );

  if (messages.length === 0) return <WelcomeMessage />;

  return (
    <div className="chat-messages">
      {messages.map((message, index) => {
        const isUser = message.role === 'user';

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`d-flex mb-4 ${isUser ? 'justify-content-end' : 'justify-content-start'}`}
          >
            <div
              className={`d-flex align-items-start ${isUser ? 'flex-row-reverse' : ''}`}
              style={{ maxWidth: '75%' }}
            >
              {/* Avatar */}
              <div
                className={`rounded-circle d-flex align-items-center justify-content-center ${isUser ? 'ms-3' : 'me-3'}`}
                style={{ width: '44px', height: '44px', padding: '4px' }}
              >
                {isUser ? (
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle shadow"
                    style={{
                      background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <User size={20} color="white" />
                  </div>
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle shadow"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <Image
                      src={gnarAvarta}
                      roundedCircle
                      alt="Gnar"
                      style={{ width: '35px', height: '35px', objectFit: 'cover' }}
                    />
                  </div>
                )}
              </div>

              {/* Message content */}
              <div
                className={`rounded-3 px-3 py-2 shadow-sm ${isUser ? 'bg-primary text-white' : 'bg-light border'}`}
                style={{
                  borderRadius: isUser ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                }}
              >
                <ReactMarkdown
                  children={
                    message.role === "bot" && message.content === ""
                      ? "Đang suy nghĩ ..."
                      : message.content
                  }
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    pre: ({ node, ...props }) => (
                      <pre
                        className="text-dark"
                        style={{
                          background: '#f8f9fa',
                          borderRadius: '0.375rem',
                          padding: '0.5rem',
                          overflowX: 'auto',
                        }}
                        {...props}
                      />
                    ),
                    code: ({ inline, className, children, ...props }) => (
                      <code
                        className={`${inline ? '' : 'd-block'} ${className || ''}`}
                        style={{ backgroundColor: inline ? '#e9ecef' : 'transparent' }}
                        {...props}
                      >
                        {children}
                      </code>
                    ),
                  }}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default ChatMessages;
