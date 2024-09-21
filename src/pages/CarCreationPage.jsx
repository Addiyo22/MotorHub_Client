import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5005'; // Replace with your backend API URL

function CarCreationPage() {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    trim: '',
    engine: '',
    engineHorsepower: '',
    transmission: '',
    interiorColor: '',
    exteriorColor: '',
    features: '',
    price: '',
    quantity: '',
    location: '',
    available: true,
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    const token = localStorage.getItem('authToken')

    try {
        const response = await axios.post(
          `${API_URL}/admin/newCar`,
          { carDetails: formData },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        console.log('Car created:', response.data);
        navigate('/admin/cars'); 
      } catch (error) {
        console.error('Error creating car:', error);
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage('Failed to create car. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <div className="CarCreationPage">
      <h1>Create a New Car</h1>
      <form onSubmit={handleSubmit}>
        <label>Make:</label>
        <input type="text" name="make" value={formData.make} onChange={handleInputChange} required />

        <label>Model:</label>
        <input type="text" name="model" value={formData.model} onChange={handleInputChange} required />

        <label>Year:</label>
        <input type="number" name="year" value={formData.year} onChange={handleInputChange} required />

        <label>Trim:</label>
        <input type="text" name="trim" value={formData.trim} onChange={handleInputChange} />

        <label>Engine:</label>
        <input type="text" name="engine" value={formData.engine} onChange={handleInputChange} />

        <label>Engine Horsepower:</label>
        <input
          type="number"
          name="engineHorsepower"
          value={formData.engineHorsepower}
          onChange={handleInputChange}
        />

        <label>Transmission:</label>
        <input type="text" name="transmission" value={formData.transmission} onChange={handleInputChange} />

        <label>Interior Color:</label>
        <input type="text" name="interiorColor" value={formData.interiorColor} onChange={handleInputChange} />

        <label>Exterior Color:</label>
        <input type="text" name="exteriorColor" value={formData.exteriorColor} onChange={handleInputChange} />

        <label>Features:</label>
        <textarea
          name="features"
          value={formData.features}
          onChange={handleInputChange}
          placeholder="Enter features separated by commas"
        />

        <label>Price:</label>
        <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />

        <label>
          Available:
          <input type="checkbox" name="available" checked={formData.available} onChange={handleInputChange} />
        </label>

        <label>Quantity:</label>
        <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} required />

        <label>Location:</label>
        <input type="text" name="location" value={formData.location} onChange={handleInputChange} />

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Car'}
        </button>
      </form>

      {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

export default CarCreationPage;