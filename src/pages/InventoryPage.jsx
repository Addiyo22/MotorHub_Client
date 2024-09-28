import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/auth.context';
import { Layout, Card, Row, Col, Button, Typography, Space, message } from 'antd';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
const { Header, Content, Footer } = Layout;
const { Meta } = Card;
const { Title } = Typography;

function InventoryPage() {
  const [cars, setCars] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const { user, isLoggedIn } = useContext(AuthContext);
  const checkAdmin = user?.isAdmin;

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(`${API_URL}/inventory`);
        setCars(response.data);
      } catch (error) {
        console.error('Error fetching cars:', error);
        setErrorMessage('Failed to load cars. Please try again later.');
      }
    };

    fetchCars();
  }, []);

  const handleDelete = async (carId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this car?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${API_URL}/admin/cars/${carId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCars((prevCars) => prevCars.filter((car) => car._id !== carId));
      message.success('Car deleted successfully.');
    } catch (error) {
      console.error('Error deleting car:', error);
      message.error('Failed to delete the car. Please try again.');
    }
  };

  return (
    <Layout style={{ fontSize: '18px', lineHeight: '1.6', backgroundColor: '#f9f9f9', width: '100vw' }}>
      <Header style={{ backgroundColor: '#002766', color: '#fff', textAlign: 'center', padding: '20px 0' }}>
        <Title level={2} style={{ color: '#fff', margin: 0, fontSize: '28px' }}>Available Cars</Title>
      </Header>
      <Content style={{ padding: '40px 50px' }}>
        {errorMessage && <div style={{ marginBottom: '20px', color: 'red', textAlign: 'center' }}>{errorMessage}</div>}
        <Row gutter={[24, 24]} justify="center">
          {cars.map((car) => (
            <Col 
              xs={24} 
              sm={24} 
              md={12} 
              lg={10} 
              key={car._id}
            >
              <Card
                hoverable
                style={{ width: '100%', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}
                cover={
                  car.images && car.images.length > 0 ? (
                    <img
                      alt={`${car.make} ${car.model}`}
                      src={car.images[0]}
                      style={{ height: '250px', objectFit: 'cover', borderRadius: '10px' }}
                    />
                  ) : (
                    <div
                      style={{
                        height: '250px',
                        backgroundColor: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '10px',
                      }}
                    >
                      No Image Available
                    </div>
                  )
                }
                actions={[
                  <Space direction="horizontal" size="middle" key="actions" style={{ display: 'flex', justifyContent: 'center' }}>
                    {isLoggedIn && !checkAdmin && (
                      <>
                        <Link to={`/cars/${car._id}`} key="view">
                          <Button type="primary" size="large">View Details</Button>
                        </Link>
                        <Link to={`/cars/${car._id}/configure`} key="configure">
                          <Button size="large">Configure</Button>
                        </Link>
                      </>
                    )}
                    {isLoggedIn && checkAdmin && (
                      <>
                        <Link to={`/admin/cars/${car._id}/edit`} key="edit">
                          <Button>Edit Car</Button>
                        </Link>
                        <Button
                          danger
                          onClick={() => handleDelete(car._id)}
                        >
                          Delete Car
                        </Button>
                      </>
                    )}
                  </Space>,
                ]}
              >
                <Meta 
                  title={`${car.make} ${car.model} (${car.year})`}
                  description={`Engine: ${car.engine.join(', ')} - ${car.engineHorsepower.join(', ')} HP | Price: €${car.price}`}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Content>
      <Footer style={{ textAlign: 'center', fontSize: '16px' }}>©2024 MotorHub</Footer>
    </Layout>
  );
}

export default InventoryPage;
