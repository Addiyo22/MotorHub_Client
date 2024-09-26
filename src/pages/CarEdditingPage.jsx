import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:5005'; // Replace with your backend API URL

function CarEditingPage() {
    const { carId } = useParams();
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

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${API_URL}/cars/${carId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Set formData with the fetched car details
        setFormData({
          make: response.data.make || '',
          model: response.data.model || '',
          year: response.data.year || '',
          trim: response.data.trim || '',
          engine: response.data.engine || '',
          engineHorsepower: response.data.engineHorsepower || '',
          transmission: response.data.transmission || '',
          interiorColor: response.data.interiorColor || '',
          exteriorColor: response.data.exteriorColor || '',
          features: response.data.features.join(', ') || '',
          price: response.data.price || '',
          quantity: response.data.quantity || '',
          location: response.data.location || '',
          available: response.data.available || true,
        });
      } catch (error) {
        console.error('Error fetching car details:', error);
        setErrorMessage('Failed to load car details. Please try again later.');
      }
    };

    fetchCarDetails();
}, [carId]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    const token = localStorage.getItem('authToken')

    try {
        const response = await axios.put(
          `${API_URL}/admin/cars/${carId}`,
          { carDetails: formData },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        console.log('Car created:', response.data);
        navigate(`/cars/${carId}`); 
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
    <div>
      <h1>Edit Car Details</h1>
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
          {isLoading ? 'Updating...' : 'Update Car'}
        </button>
      </form>

      {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

export default CarEditingPage;