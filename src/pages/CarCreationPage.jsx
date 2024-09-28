// CarCreationPage.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';

function CarCreationPage() {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    trim: '',
    engine: '',
    engineHorsepower: '',
    transmission: '',
    interiorColorName: '',
    interiorColorHex: '',
    exteriorColorName: '',
    exteriorColorHex: '',
    features: '',
    price: '',
    quantity: '',
    location: '',
    available: true,
  });

  const [image, setImage] = useState(null); // State for handling image file
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

  // Handle image file input change
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    const token = localStorage.getItem('authToken');

    // Prepare the data to match the backend requirements
    const carDetails = {
      ...formData,
      model: formData.model.split(',').map((m) => m.trim()),
      trim: formData.trim.split(',').map((t) => t.trim()),
      engine: formData.engine.split(',').map((e) => e.trim()),
      transmission: formData.transmission.split(',').map((t) => t.trim()),
      engineHorsepower: formData.engineHorsepower.split(',').map((hp) => parseFloat(hp)),
      interiorColor: [{ name: formData.interiorColorName, hex: formData.interiorColorHex }],
      exteriorColor: [{ name: formData.exteriorColorName, hex: formData.exteriorColorHex }],
      features: formData.features.split(',').map((f) => f.trim()),
    };

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('carDetails', JSON.stringify(carDetails));
    if (image) formDataToSubmit.append('image', image); // Append image file if selected

    try {
      const response = await axios.post(`${API_URL}/admin/newCar`, formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Car created:', response.data);
      navigate('/cars');
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

        <label>Model (comma-separated):</label>
        <input type="text" name="model" value={formData.model} onChange={handleInputChange} required />

        <label>Year:</label>
        <input type="number" name="year" value={formData.year} onChange={handleInputChange} required />

        <label>Trim (comma-separated):</label>
        <input type="text" name="trim" value={formData.trim} onChange={handleInputChange} />

        <label>Engine (comma-separated):</label>
        <input type="text" name="engine" value={formData.engine} onChange={handleInputChange} />

        <label>Engine Horsepower (comma-separated):</label>
        <input type="text" name="engineHorsepower" value={formData.engineHorsepower} onChange={handleInputChange} />

        <label>Transmission (comma-separated):</label>
        <input type="text" name="transmission" value={formData.transmission} onChange={handleInputChange} />

        <label>Interior Color Name:</label>
        <input type="text" name="interiorColorName" value={formData.interiorColorName} onChange={handleInputChange} />

        <label>Interior Color Hex:</label>
        <input type="text" name="interiorColorHex" value={formData.interiorColorHex} onChange={handleInputChange} />

        <label>Exterior Color Name:</label>
        <input type="text" name="exteriorColorName" value={formData.exteriorColorName} onChange={handleInputChange} />

        <label>Exterior Color Hex:</label>
        <input type="text" name="exteriorColorHex" value={formData.exteriorColorHex} onChange={handleInputChange} />

        <label>Features (comma-separated):</label>
        <textarea
          name="features"
          value={formData.features}
          onChange={handleInputChange}
          placeholder="Enter features separated by commas"
        />

        <label>Price:</label>
        <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />

        <label>Available:</label>
        <input type="checkbox" name="available" checked={formData.available} onChange={handleInputChange} />

        <label>Quantity:</label>
        <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} required />

        <label>Location:</label>
        <input type="text" name="location" value={formData.location} onChange={handleInputChange} />

        <label>Car Image:</label>
        <input type="file" onChange={handleImageChange} />

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Car'}
        </button>
      </form>

      {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

export default CarCreationPage;
