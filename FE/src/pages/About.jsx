import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
function About() {
  const navigate = useNavigate();
  return (
    <Container className="py-5">
      <Row>
        <Col>
          <div className="mb-5">
            <button
              size="sm"
              className="custom-hover-btn rounded-pill gap-2 px-3"
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={16} />
            </button>
          </div>
        </Col>
        <Col>
          <div className="d-flex gap-3 p-2 justify-content-end  ">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary fs-7 icon-hover"
              aria-label="Visit our Facebook page"
            >
              <i className="bi bi-facebook"></i>
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary fs-7 icon-hover"
              aria-label="Visit our Instagram profile"
            >
              <i className="bi bi-instagram"></i>
            </a>

            <a
              href="https://messenger.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary fs-7 icon-hover"
              aria-label="Chat with us on Messenger"
            >
              <i className="bi bi-messenger"></i>
            </a>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary fs-7 icon-hover"
              aria-label="View our GitHub repository"
            >
              <i className="bi bi-github"></i>
            </a>

            <a
              href="mailto:contact@yourwebsite.com"
              className="text-secondary fs-7 icon-hover"
              aria-label="Send us an email"
            >
              <i className="bi bi-envelope-check"></i>
            </a>
          </div>
        </Col>
      </Row>
      <Row className="justify-content-center mb-4">
        <Col md={8} className="text-center">
          <h2 className="fw-bold">🤖 Giới thiệu về Gnar AI ChatBot</h2>
          <p className="text-muted">
            Gnar AI là trợ lý ảo thông minh được xây dựng dựa trên công nghệ AI tiên tiến, giúp bạn trò chuyện, học tập, lập trình và sáng tạo hiệu quả hơn.
          </p>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>⚡ Tương tác mượt mà</Card.Title>
              <Card.Text>
                Gnar AI mang đến trải nghiệm hội thoại tự nhiên, trả lời nhanh chóng và chính xác các câu hỏi của bạn.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>💡 Hỗ trợ học tập & lập trình</Card.Title>
              <Card.Text>
                Gnar AI có thể giúp bạn giải bài tập, viết code, tìm lỗi, tóm tắt nội dung và nhiều hơn thế nữa.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>🔒 Bảo mật & riêng tư</Card.Title>
              <Card.Text>
                Dữ liệu trò chuyện được lưu cục bộ, không chia sẻ ra bên ngoài nhằm đảm bảo quyền riêng tư của bạn.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={12} className="text-center">
          <h5 className="fw-bold">🚀 Công nghệ nền tảng</h5>
          <p>
            Gnar AI sử dụng <strong>FastAPI</strong> cho backend, <strong>React</strong> cho frontend và <strong>Ollama + Phi-3:mini</strong> làm mô hình AI xử lý ngôn ngữ.
          </p>
          <p className="text-muted small">© {new Date().getFullYear()} Gnar AI ChatBot - Phiên bản thử nghiệm dành cho mục đích học tập và nghiên cứu.</p>
        </Col>
      </Row>
    </Container>
  );
}

export default About;
