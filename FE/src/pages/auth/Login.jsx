import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import '../../assets/css/auth.css'; // Import custom CSS for styling


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (email === 'admin@example.com' && password === 'password') {
                alert('Đăng nhập thành công!');
                navigate('/');
            } else {
                setError('Email hoặc mật khẩu không đúng.');
            }
        } catch (err) {
            setError('Có lỗi xảy ra, vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center p-3">
            <Card className="shadow p-4 border-0 rounded-4" style={{ width: '100%', maxWidth: '420px' }}>
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
                <div className="text-center mb-4">
                    <h3 className="fw-bold text-primary">Đăng nhập</h3>
                    <p className="text-muted">Chào mừng bạn trở lại 👋</p>
                </div>

                {/* Thông báo lỗi */}
                {error && <Alert variant="danger">{error}</Alert>}

                {/* Form đăng nhập */}
                <Form onSubmit={handleLogin}>
                    <Form.Group controlId="email" className="mb-3">
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

                    <Form.Group controlId="password" className="mb-3">
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
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Ghi nhớ đăng nhập"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <Link to="#" className="small text-decoration-none">
                            Quên mật khẩu?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className=" submit-log  w-100 rounded-pill p-2"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" />
                                Đang đăng nhập...
                            </>
                        ) : (
                            'Đăng nhập'
                        )}
                    </button>
                </Form>

                <div className="oauth-divider">
                    <hr />
                    <span>hoặc đăng nhập bằng</span>
                    <hr />
                </div>

                <div className="oauth-buttons">
                    <Button variant="outline-dark" className="w-100 rounded-pill">
                        <i className="bi bi-google"></i> Google
                    </Button>
                    <Button variant="outline-dark" className="w-100 rounded-pill">
                        <i className="bi bi-github"></i> GitHub
                    </Button>
                </div>
                {/* Đăng ký */}
                <div className="text-center mt-4">
                    <span className="text-muted small">
                        Chưa có tài khoản?{' '}
                        <Link to="/register" className="fw-semibold text-decoration-none">
                            Đăng ký ngay
                        </Link>
                    </span>
                </div>

                {/* Demo account */}
                <div className="text-center mt-3">
                    <small className="text-muted">Demo: admin@example.com / password</small>
                </div>
            </Card>
        </Container>
    );
}
