import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005'; 

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const {userId} = useParams()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const response = await axios.get(`${API_URL}/user/${userId}/orders`, {
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
  }, [userId]);


  return (
    <div className="OrdersPage">
    <h1>Your Orders</h1>
    {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}
    {orders.length > 0 ? (
      <ul>
        {orders.map((order) => {
          const car = order.configuration?.car; // Use optional chaining to safely access car

          // Return the list item for each order
          return (
            <li key={order._id}>
              <h3>
                {car ? `${car.make} ${car.model} ${car.trim}` : 'Car details unavailable'}
              </h3>
              <p>Engine: {order.configuration?.engine || 'Unknown'}</p>
              <p>Transmission: {order.configuration?.transmission || 'Unknown'}</p>
              <p>Exterior Color: {order.configuration?.exteriorColor || 'Unknown'}</p>
              <p>Interior Color: {order.configuration?.interiorColor || 'Unknown'}</p>
              <p>
                Features:{' '}
                {Array.isArray(order.configuration?.features)
                  ? order.configuration.features.join(', ')
                  : 'No features available'}
              </p>
              <p>Total Price: €{order.totalPrice || 'Unknown'}</p>
              <p>Status: {order.status || 'Unknown'}</p>
            </li>
          );
        })}
      </ul>
    ) : (
      <h3>No Orders yet!</h3>
    )}
  </div>
  );
}

export default OrdersPage;