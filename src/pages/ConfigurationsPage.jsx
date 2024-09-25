import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5005'; 

function ConfigurationsPage() {
  const [configurations, setConfigurations] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate()

  useEffect(() => {
    const fetchConfigurations = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const response = await axios.get(`${API_URL}/user/configurations`,{
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        });
        const availableConfigurations = response.data.filter(
            (config) => !config.isOrdered
          );
        setConfigurations(availableConfigurations);
      } catch (error) {
        console.error('Error fetching cars:', error);
        setErrorMessage('Failed to load cars. Please try again later.');
      }
    };

    fetchConfigurations();
  }, []);

  const handleMakeOrder = async (configurationId, totalPrice) => {
    try {
      const authToken = localStorage.getItem('authToken');
      await axios.post(
        `${API_URL}/user/${configurationId}/order`,
        {
          totalPrice: totalPrice,
          configurationId 
        },
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

      setSuccessMessage('Order deleted successfully!');
      setConfigurations((prevConfigurations) =>
        prevConfigurations.filter((config) => config._id !== configurationId)
      );
    } catch (error) {
        console.error('Error deleting order:', error);
        setErrorMessage('Failed to delete the order. Please try again.');
    }
  }

  return (
    <div className="CarListPage">
      <h1>Your Configurations</h1>
      {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}
      {configurations.length > 0 ? (
    <ul>
      {configurations.map((configuration) => (
        <li key={configuration._id}>
          <h3>
            {configuration.car.make} {configuration.car.model} ({configuration.car.year})
          </h3>
          <p>
            Engine: {configuration.engine} - {configuration.car.engineHorsepower} HP
          </p>
          <p>Transmission: {configuration.transmission}</p>
          <p>Exterior Color: {configuration.exteriorColor}</p>
          <p>Interior Color: {configuration.interiorColor}</p>
          <p>Features: {configuration.features.join(', ')}</p>
          <p>Price: €{configuration.price}</p>
          <button onClick={() => handleMakeOrder(configuration._id, configuration.price)}>
            Order Now
          </button>
          <button onClick={() => handleDeleteConfiguration(configuration._id)}>
            Delete Configuration
          </button>
        </li>
      ))}
    </ul>
  ) : (
    <h3>No configurations available</h3>
  )}
    </div>
  );
}

export default ConfigurationsPage;