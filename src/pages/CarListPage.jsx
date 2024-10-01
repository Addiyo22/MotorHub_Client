import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/auth.context';
import { Layout, Card, Row, Col, Button, Typography } from 'antd';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
const { Header, Content, Footer } = Layout;
const { Meta } = Card;
const { Text } = Typography;

function CarListPage() {
  const [cars, setCars] = useState([]);
  const { user, isLoggedIn } = useContext(AuthContext);
  const checkAdmin = user?.isAdmin;

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(`${API_URL}/cars`);
        setCars(response.data);
      } catch (error) {
        console.error('Error fetching cars:', error);
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
    } catch (error) {
      console.error('Error deleting car:', error);
      /* setErrorMessage('Failed to delete the car. Please try again.'); */
    }
  };

  return (
    <Layout>
      <Header
        style={{
          backgroundColor: '#002766',
          color: '#fff',
          textAlign: 'center',
          fontSize: '24px',
          padding: '50px 0',
          margin: '30px 0'
        }}
      >
        Available Cars
      </Header>
      <Content style={{ padding: '20px' }}>
        <Row gutter={[16, 16]}>
          {cars.map((car) => (
            <Col
              xs={24}
              sm={12}
              md={8}
              lg={6}
              key={car._id}
            >
              <Card
                hoverable
                cover={
                  car.images && car.images.length > 0 ? (
                    <img
                      alt={`${car.make} ${car.model}`}
                      src={car.images[0]}
                      style={{ height: '200px', objectFit: 'cover', borderRadius: '5px' }}
                    />
                  ) : (
                    <div
                      style={{
                        height: '200px',
                        backgroundColor: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      No Image Available
                    </div>
                  )
                }
                actions={[
                  ...(isLoggedIn && !checkAdmin
                    ? [
                        <Link to={`/cars/${car._id}`} key="view">
                          <Button type="primary" block>
                            View Details
                          </Button>
                        </Link>,
                        <Link to={`/cars/${car._id}/configure`} key="configure">
                          <Button block>Configure</Button>
                        </Link>,
                      ]
                    : []),
                  ...(isLoggedIn && checkAdmin
                    ? [
                        <Link to={`/admin/cars/${car._id}/edit`} key="edit">
                          <Button block>Edit Car</Button>
                        </Link>,
                        <Button danger block onClick={() => handleDelete(car._id)} key="delete">
                          Delete Car
                        </Button>,
                        <Link to={`/cars/${car._id}`} key="view">
                          <Button type="primary" block>
                            View Details
                          </Button>
                        </Link>,
                        <Link to={`/cars/${car._id}/configure`} key="configure">
                          <Button block>Configure</Button>
                        </Link>,
                      ]
                    : []),
                ]}
              >
                <Meta title={`${car.make} ${car.model}`} description={`€${car.price}`} />
              </Card>
            </Col>
          ))}
        </Row>
        {!isLoggedIn && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Text type="secondary" style={{ fontSize: '16px' }}>
              Login for more options
            </Text>
          </div>
        )}
      </Content>
      <Footer style={{ textAlign: 'center' }}>©2024 MotorHub</Footer>
    </Layout>
  );
}

export default CarListPage;
