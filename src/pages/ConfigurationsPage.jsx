import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Table, Button, Typography, Alert, Spin, Card } from 'antd';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
const { Title, Text } = Typography;

function ConfigurationsPage() {
  const [configurations, setConfigurations] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConfigurations = async () => {
      setLoading(true); // Set loading to true while fetching data
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
      } finally {
        setLoading(false); // Set loading to false after fetching data
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

  const columns = [
    {
      title: 'Car',
      dataIndex: 'car',
      key: 'car',
      render: (text, configuration) => (
        <Card
          hoverable
          cover={
            <img
              alt={configuration.car.make}
              src={configuration.car.images?.[0] || 'https://via.placeholder.com/150'}
              style={{ height: '150px', objectFit: 'cover' }}
            />
          }
        >
          <h3>{configuration.car.make} {configuration.car.model} {configuration.car.trim}</h3>
        </Card>
      ),
    },
    {
      title: 'Details',
      key: 'details',
      render: (text, configuration) => (
        <>
          <p>Engine: {configuration.engine} - {configuration.car.engineHorsepower} HP</p>
          <p>Transmission: {configuration.transmission}</p>
          <p>Exterior Color: {configuration.exteriorColor}</p>
          <p>Interior Color: {configuration.interiorColor}</p>
          <p>Features: {configuration.features.join(', ')}</p>
        </>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <Text strong>€{price}</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, configuration) => (
        <>
          <Button
            type="primary"
            onClick={() => handleMakeOrder(configuration._id, configuration.price)}
            style={{ marginBottom: '10px' }}
          >
            Order Now
          </Button>
          <br />
          <Button
            danger
            onClick={() => handleDeleteConfiguration(configuration._id)}
          >
            Delete Configuration
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="ConfigurationsPage" style={{ padding: '20px', backgroundColor: 'white', width: '100vw', minHeight: '100vh' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '20px', color: '#002766', paddingTop: '25px' }}>
        Your Configurations
      </Title>
      {errorMessage && <Alert message={errorMessage} type="error" showIcon style={{ marginBottom: '20px' }} />}
      {successMessage && <Alert message={successMessage} type="success" showIcon style={{ marginBottom: '20px' }} />}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <Spin size="large" />
        </div>
      ) : configurations.length > 0 ? (
        <Table
          dataSource={configurations}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      ) : (
        <Title level={3} style={{ textAlign: 'center', marginTop: '20px', color: '#002766' }}>
          No configurations available
        </Title>
      )}
    </div>
  );
}

export default ConfigurationsPage;
