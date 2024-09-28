import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Button, Row, Col, Typography, Alert } from 'antd';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
const { Title, Text } = Typography;

function ConfigurationsPage() {
  const [configurations, setConfigurations] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConfigurations = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const response = await axios.get(`${API_URL}/user/configurations`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const availableConfigurations = response.data.filter(
          (config) => !config.isOrdered
        );
        setConfigurations(availableConfigurations);
      } catch (error) {
        console.error('Error fetching configurations:', error);
        setErrorMessage('Failed to load configurations. Please try again later.');
      }
    };

    fetchConfigurations();
  }, []);

  const handleMakeOrder = async (configurationId, totalPrice) => {
    try {
      const authToken = localStorage.getItem('authToken');
      await axios.post(
        `${API_URL}/user/${configurationId}/order`,
        { totalPrice, configurationId },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setSuccessMessage('Order created successfully!');
      setConfigurations((prevConfigurations) =>
        prevConfigurations.filter((config) => config._id !== configurationId)
      );
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      console.error('Error creating order:', error);
      setErrorMessage('Failed to create the order. Please try again.');
    }
  };

  const handleDeleteConfiguration = async (configurationId) => {
    try {
      const authToken = localStorage.getItem('authToken');
      const confirmDelete = window.confirm('Are you sure you want to delete this configuration?');
      if (!confirmDelete) return;
      await axios.delete(`${API_URL}/user/configurations/${configurationId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setSuccessMessage('Configuration deleted successfully!');
      setConfigurations((prevConfigurations) =>
        prevConfigurations.filter((config) => config._id !== configurationId)
      );
    } catch (error) {
      console.error('Error deleting configuration:', error);
      setErrorMessage('Failed to delete the configuration. Please try again.');
    }
  };

  return (
    <div className="ConfigurationsPage" style={{ padding: '20px', backgroundColor: 'white', width: '100vw', height: '100vh' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '20px', color: '#002766', paddingTop: '25px' }}>
        Your Configurations
      </Title>
      {errorMessage && <Alert message={errorMessage} type="error" showIcon style={{ marginBottom: '20px' }} />}
      {successMessage && <Alert message={successMessage} type="success" showIcon style={{ marginBottom: '20px' }} />}
      {configurations.length > 0 ? (
        <Row gutter={[16, 16]} justify="center">
          {configurations.map((configuration) => (
            <Col xs={24} sm={12} md={8} lg={6} key={configuration._id}>
              <Card
                hoverable
                cover={
                  configuration.car.images && configuration.car.images.length > 0 ? (
                    <img
                      src={configuration.car.images[0]}
                      alt={`${configuration.car.make} ${configuration.car.model}`}
                      style={{ height: '200px', objectFit: 'cover', borderRadius: '8px 8px 0 0' }}
                    />
                  ) : (
                    <div
                      style={{
                        height: '200px',
                        backgroundColor: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '8px 8px 0 0',
                      }}
                    >
                      No Image Available
                    </div>
                  )
                }
                actions={[
                  <Button
                    type="primary"
                    block
                    onClick={() => handleMakeOrder(configuration._id, configuration.price)}
                    key="order"
                  >
                    Order Now
                  </Button>,
                  <Button
                    danger
                    block
                    onClick={() => handleDeleteConfiguration(configuration._id)}
                    key="delete"
                  >
                    Delete Configuration
                  </Button>,
                ]}
              >
                <Card.Meta
                  title={`${configuration.car.make} ${configuration.car.model} (${configuration.car.year})`}
                  description={
                    <>
                      <Text>Engine: {configuration.engine} - {configuration.car.engineHorsepower} HP</Text>
                      <br />
                      <Text>Transmission: {configuration.transmission}</Text>
                      <br />
                      <Text>Exterior Color: {configuration.exteriorColor}</Text>
                      <br />
                      <Text>Interior Color: {configuration.interiorColor}</Text>
                      <br />
                      <Text>Features: {configuration.features.join(', ')}</Text>
                      <br />
                      <Text strong>Price: €{configuration.price}</Text>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Title level={3} style={{ textAlign: 'center', marginTop: '20px', color: '#002766' }}>
          No configurations available
        </Title>
      )}
    </div>
  );
}

export default ConfigurationsPage;
