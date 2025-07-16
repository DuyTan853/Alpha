import React from 'react';
import { Container, Alert } from 'react-bootstrap';
// Improved ErrorAlert Component
function ErrorAlert({ error, onDismiss }) {
  if (!error) return null;

  return (
    <Container fluid className="px-4 pb-3">
      <Alert variant="danger" dismissible onClose={onDismiss} className="mb-0 shadow-sm">
        <Alert.Heading className="h6 mb-1">
          <strong>Lỗi!</strong>
        </Alert.Heading>
        {error}
      </Alert>
    </Container>
  );
}
export default ErrorAlert;