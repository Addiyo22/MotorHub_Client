import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../styles/ErrorPageStyles.css'; // Custom CSS for additional styling

const { Title, Paragraph } = Typography;

function Error404() {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="error-container" style={{width: '100vw'}}>
      <div className="error-content">
        <Title level={1} className="error-title">404</Title>
        <Paragraph className="error-text">
          Oops! The page you're looking for doesn't exist.
        </Paragraph>
        <Button type="primary" size="large" className="error-button" onClick={handleBackToHome}>
          Back to Home
        </Button>
      </div>
    </div>
  );
}

export default Error404;
