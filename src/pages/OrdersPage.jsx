import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Table, Typography, Alert, Spin, Card } from 'antd';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
const { Title } = Typography;

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { userId } = useParams();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const columns = [
    {
      title: 'Car',
      dataIndex: 'car',
      key: 'car',
      render: (_, order) => {
        const car = order.configuration?.car;
        const carMake = car?.make || 'Unknown Make';
        const carModel = car?.model || 'Unknown Model';
        const carTrim = car?.trim || '';
        return (
          <Card hoverable cover={<img alt={carMake} src={car.images?.[0]} style={{ height: '150px', objectFit: 'cover' }} />}>
            <h3>{carMake} {carModel} {carTrim}</h3>
          </Card>
        );
      },
    },
    {
      title: 'Details',
      dataIndex: 'configuration',
      key: 'details',
      render: (configuration) => (
        <>
          <p>Engine: {configuration?.engine || 'Unknown'}</p>
          <p>Transmission: {configuration?.transmission || 'Unknown'}</p>
          <p>Exterior Color: {configuration?.exteriorColor || 'Unknown'}</p>
          <p>Interior Color: {configuration?.interiorColor || 'Unknown'}</p>
          <p>Features: {Array.isArray(configuration?.features) ? configuration.features.join(', ') : 'No features available'}</p>
        </>
      ),
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => `€${price?.toFixed(2) || 'Unknown'}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <p>{status || 'Unknown'}</p>,
    },
  ];

  return (
    <div className="OrdersPage" style={{ padding: '20px', backgroundColor: 'white', minHeight: '100vh' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '20px', color: '#002766', paddingTop: '25px' }}>
        Your Orders
      </Title>

      {errorMessage && <Alert message={errorMessage} type="error" showIcon style={{ marginBottom: '20px' }} />}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <Spin size="large" />
        </div>
      ) : orders.length > 0 ? (
        <Table
          dataSource={orders}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      ) : (
        <Title level={3} style={{ textAlign: 'center', marginTop: '20px', color: '#002766' }}>
          No Orders yet!
        </Title>
      )}
    </div>
  );
}

export default OrdersPage;
