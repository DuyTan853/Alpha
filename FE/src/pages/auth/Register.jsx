import React, { useState } from 'react';
import { Form, Button, Container, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Github, Chrome } from 'lucide-react';
import '../../assets/css/auth.css'; // Import custom CSS for styling
import { number } from 'framer-motion'; 

export default function Register() {

  // State variables for form inputs and loading/error states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [address, setAddress] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError(' Mật khẩu không khớp!');
      return;
    }
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      console.log('Đăng ký:', email, password);
      navigate('/login');
    }, 1000);
  };

  const handleOAuthLogin = (provider) => {
    alert(`Đang chuyển hướng đến đăng ký với ${provider}...`);
  };

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center p-3">
      <Card className="shadow p-4 rounded-4 w-100" style={{ maxWidth: '460px' }}>
        {/* Nút quay về */}
        <div className="mb-5">
          <button
            size="sm"
            className="custom-hover-btn rounded-pill d-inline-flex align-items-center gap-2 px-3"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={16} />
          </button>
        </div>

        {/* Tiêu đề */}
        <h3 className="mb-2 text-center fw-bold text-primary">Tạo tài khoản</h3>
        <p className="text-muted text-center mb-4">Đăng ký để bắt đầu sử dụng Gnar AI</p>


        {/* Form đăng ký */}
        <Form onSubmit={handleRegister}>

        <Form.Group className="mb-3">
            <Form.Label>Họ và tên:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập họ và tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="py-2 px-3 rounded-3"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Số điện thoại:</Form.Label>
            <Form.Control
              type="number"
              placeholder="Nhập số điện thoại"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="py-2 px-3 rounded-3"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Địa chỉ:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập địa chỉ"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="py-2 px-3 rounded-3"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="py-2 px-3 rounded-3"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu:</Form.Label>
            <Form.Control
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="py-2 px-3 rounded-3"
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Nhập lại mật khẩu:</Form.Label>
            <Form.Control
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="py-2 px-3 rounded-3"
              required
            />
          </Form.Group>
           <div className="text-center text-muted mb-3 position-relative">
          <span className="bg-white px-2 position-relative z-1">hoặc</span>
          <div className="position-absolute top-50 start-0 end-0 border-top" style={{ zIndex: 0 }} />
        </div>
          {/* OAuth buttons */}
          <div className="d-grid gap-2 mb-3">
            <Button
              variant="light"
              className="border d-flex align-items-center justify-content-center gap-2 py-2"
              onClick={() => handleOAuthLogin('Google')}
            >
              <Chrome size={18} />
              Đăng ký với Google
            </Button>
            <Button
              variant="dark"
              className="d-flex align-items-center justify-content-center gap-2 py-2"
              onClick={() => handleOAuthLogin('GitHub')}
            >
              <Github size={18} />
              Đăng ký với GitHub
            </Button>
          </div>

          <button
            type="submit"
            className="submit-log w-100 rounded-pill p-2"
            variant="primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Đang đăng ký...
              </>
            ) : (
              'Đăng ký'
            )}
          </button>

          {error && <div className="text-danger mt-3 text-center">{error}</div>}
        </Form>

        <div className="text-center mt-4">
          <span className="text-muted small">
            Đã có tài khoản?{' '}
            <a href="/login" className="text-primary fw-semibold text-decoration-none">
              Đăng nhập
            </a>
          </span>
        </div>
      </Card>
    </Container>
  );
}
