import { useState, useEffect } from 'react';
import { Button, Table, message, Card, Typography } from 'antd';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
const { Title } = Typography;

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const authToken = localStorage.getItem('authToken');
        const response = await axios.get(`${API_URL}/admin/orders`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        message.error('Failed to load orders. Please try again later.');
      }
    };

    fetchOrders();
  }, []);

  const handleAcceptOrder = async (orderId) => {
    try {
      const authToken = localStorage.getItem('authToken');
      await axios.patch(`${API_URL}/admin/orders/${orderId}/accept`, {}, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: 'accepted' } : order
        )
      );
      message.success('Order accepted successfully!');
    } catch (error) {
      message.error('Failed to accept the order.');
    }
  };

  const handleRejectOrder = async (orderId) => {
    try {
      const authToken = localStorage.getItem('authToken');
      await axios.patch(`${API_URL}/admin/orders/${orderId}/reject`, {}, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: 'rejected' } : order
        )
      );
      message.success('Order rejected successfully!');
    } catch (error) {
      message.error('Failed to reject the order.');
    }
  };

  const columns = [
    {
      title: 'Car',
      dataIndex: 'car',
      key: 'car',
      render: (car, order) => {
        const carMake = order.configuration.make || 'Unknown Make';
        const carModel = Array.isArray(order.configuration.model)
          ? order.configuration.model.join(', ')
          : order.configuration.model || 'Unknown Model';
        const carTrim = order.configuration.trim || '';

        return (
          <Card hoverable cover={<img alt={carMake} src={order.car.images?.[0]} style={{ height: '150px', objectFit: 'cover' }} />}>
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
          <p>Engine: {configuration.engine || 'N/A'}</p>
          <p>Transmission: {configuration.transmission || 'N/A'}</p>
          <p>Exterior Color: {configuration.exteriorColor || 'N/A'}</p>
          <p>Interior Color: {configuration.interiorColor || 'N/A'}</p>
          <p>Features: {Array.isArray(configuration.features) ? configuration.features.join(', ') : 'No features available'}</p>
        </>
      ),
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => `€${price.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <p>{status}</p>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, order) => (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <Button
            type="primary"
            onClick={() => handleAcceptOrder(order._id)}
            disabled={order.status === 'accepted' || order.status === 'rejected'}
          >
            Accept
          </Button>
          <Button
            type="danger"
            onClick={() => handleRejectOrder(order._id)}
            disabled={order.status === 'rejected' || order.status === 'accepted'}
          >
            Reject
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="OrdersPage" style={{ padding: '20px' }}>
      <Title level={2}>All Orders</Title>
      {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}

      <Table
        dataSource={orders}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}

export default AdminOrdersPage;
