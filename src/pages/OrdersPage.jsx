// OrdersPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, Row, Col, Typography, Alert, Button } from 'antd';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
const { Title, Text } = Typography;

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const { userId } = useParams();
  const { Meta } = Card;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const response = await axios.get(`${API_URL}/user/${userId}/orders`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setOrders(response.data);
      } catch (error) {
        setErrorMessage('Failed to load orders. Please try again later.');
      }
    };

    fetchOrders();
  }, [userId]);

  return (
    <div className="OrdersPage" style={{ padding: '20px', backgroundColor: 'white', height: '100vh', width: '100vw' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '20px', color: '#002766', paddingTop: '25px' }}>
        Your Orders
      </Title>
      {errorMessage && <Alert message={errorMessage} type="error" showIcon style={{ marginBottom: '20px' }} />}
      {orders.length > 0 ? (
        <Row gutter={[16, 16]} justify="center">
          {orders.map((order) => {
            const car = order.configuration?.car;

            return (
              <Col xs={24} sm={12} md={8} lg={6} key={order._id}>
                <Card
                  hoverable
                  style={{ borderRadius: '8px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}
                  cover={
                    car?.images?.length > 0 ? (
                      <img
                        src={car.images[0]}
                        alt={`${car.make} ${car.model}`}
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
                >
                  <Meta
                    title={`${car ? `${car.make} ${car.model} ${car.trim || ''}` : 'Car details unavailable'}`}
                    description={
                      <>
                        <Text>Engine: {order.configuration?.engine || 'Unknown'}</Text>
                        <br />
                        <Text>Transmission: {order.configuration?.transmission || 'Unknown'}</Text>
                        <br />
                        <Text>Exterior Color: {order.configuration?.exteriorColor || 'Unknown'}</Text>
                        <br />
                        <Text>Interior Color: {order.configuration?.interiorColor || 'Unknown'}</Text>
                        <br />
                        <Text>
                          Features:{' '}
                          {Array.isArray(order.configuration?.features)
                            ? order.configuration.features.join(', ')
                            : 'No features available'}
                        </Text>
                        <br />
                        <Text strong>Total Price: €{order.totalPrice || 'Unknown'}</Text>
                        <br />
                        <Text>Status: {order.status || 'Unknown'}</Text>
                      </>
                    }
                  />
                </Card>
              </Col>
            );
          })}
        </Row>
      ) : (
        <Title level={3} style={{ textAlign: 'center', marginTop: '20px', color: '#002766' }}>
          No Orders yet!
        </Title>
      )}
    </div>
  );
}

export default OrdersPage;
