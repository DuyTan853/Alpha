import { Spinner } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
// Importing the Gnar avatar image
import gnarAvatar from '../../assets/images/gnarAvatar.png'; // Adjust the path as necessary
function LoadingMessage() {
  return (
    <div className="d-flex justify-content-start mb-3">
      <div className="bg-white border p-3 rounded-lg shadow-sm" style={{ borderRadius: '20px 20px 20px 5px' }}>
        <div className="small opacity-75 mb-1">
          <Image
            src={gnarAvatar}
            roundedCircle
            width={24}
            height={24}
            className="me-2"
          />
          Gnar AI
        </div>
        <Spinner animation="border" size="sm" className="me-2" />
        <span className="text-muted">Thinking...</span>
      </div>
    </div>
  );
}

export default LoadingMessage;