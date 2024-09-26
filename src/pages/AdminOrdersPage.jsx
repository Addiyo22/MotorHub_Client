import { useState, useEffect } from 'react';
import { Link, } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:5005'; 

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const response = await axios.get(`${API_URL}/admin/orders`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        console.log('Fetched orders:', response.data); 
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setErrorMessage('Failed to load orders. Please try again later.');
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
    } catch (error) {
      console.error('Error accepting order:', error);
      setErrorMessage('Failed to accept the order.');
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
    } catch (error) {
      console.error('Error rejecting order:', error);
      setErrorMessage('Failed to reject the order.');
    }
  };


  return (
    <div className="OrdersPage">
      <h1>All Orders</h1>
      {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}
      {orders.length > 0 ? (
      <ul>
        {orders.map((order) => {
          const car = order.configuration.car;

          return (
            <li key={order._id}>
              <h3>
              {car.make} {car.model} {car.trim}
              </h3>
              <p>Engine: {order.configuration.engine}</p>
              <p>Transmission: {order.configuration.transmission}</p>
              <p>Exterior Color: {order.configuration.exteriorColor }</p>
              <p>Interior Color: {order.configuration.interiorColor}</p>
              <p>Features: {Array.isArray(order.configuration.features)? order.configuration.features.join(', ') : 'No features available'}</p>
              <p>Total Price: {order.totalPrice}</p>
              <p>Status: {order.status}</p>
              <button onClick={() => handleAcceptOrder(order._id)}>Accept</button>
              <button onClick={() => handleRejectOrder(order._id)}>Reject</button>
            </li>
          );
        })}
      </ul>
      ):(<h3>No Orders yet!</h3>)}
    </div>
  );
}

export default AdminOrdersPage;