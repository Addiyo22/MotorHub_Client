import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';

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
    interiorColor: { name: '', hex: '' }, // Updated to be an object
    exteriorColor: { name: '', hex: '' }, // Updated to be an object
    features: '',
    price: '',
    quantity: '',
    location: '',
    available: true,
  });

  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const { data: { car } } = await axios.get(`${API_URL}/cars/${carId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Set formData with the fetched car details, handling colors properly
        setFormData({
          make: car.make || '',
          model: car.model.join(', ') || '',
          year: car.year || '',
          trim: car.trim.join(', ') || '',
          engine: car.engine.join(', ') || '',
          engineHorsepower: car.engineHorsepower.join(', ') || '',
          transmission: car.transmission.join(', ') || '',
          interiorColor: car.interiorColor[0] || { name: '', hex: '' }, // Handles the first color object or default
          exteriorColor: car.exteriorColor[0] || { name: '', hex: '' }, // Handles the first color object or default
          features: car.features ? car.features.join(', ') : '',
          price: car.price || '',
          quantity: car.quantity || '',
          location: car.location || '',
          available: car.available || true,
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

    // Handle color inputs separately if needed
    if (name.includes('Color')) {
      const colorType = name.startsWith('interior') ? 'interiorColor' : 'exteriorColor';
      const colorKey = name.endsWith('Name') ? 'name' : 'hex';

      setFormData((prevFormData) => ({
        ...prevFormData,
        [colorType]: {
          ...prevFormData[colorType],
          [colorKey]: value,
        },
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
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
      features: formData.features.split(',').map((f) => f.trim()),
      interiorColor: [{ name: formData.interiorColor.name, hex: formData.interiorColor.hex }],
      exteriorColor: [{ name: formData.exteriorColor.name, hex: formData.exteriorColor.hex }],
    };

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('carDetails', JSON.stringify(carDetails));
    if (image) formDataToSubmit.append('image', image);

    try {
      const response = await axios.put(
        `${API_URL}/admin/cars/${carId}/edit`,
        formDataToSubmit,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Car updated:', response.data);
      navigate(`/cars/${carId}`);
    } catch (error) {
      console.error('Error updating car:', error);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Failed to update car. Please try again.');
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

        <label>Interior Color Name:</label>
        <input type="text" name="interiorColorName" value={formData.interiorColor.name} onChange={handleInputChange} />

        <label>Interior Color Hex:</label>
        <input type="text" name="interiorColorHex" value={formData.interiorColor.hex} onChange={handleInputChange} />

        <label>Exterior Color Name:</label>
        <input type="text" name="exteriorColorName" value={formData.exteriorColor.name} onChange={handleInputChange} />

        <label>Exterior Color Hex:</label>
        <input type="text" name="exteriorColorHex" value={formData.exteriorColor.hex} onChange={handleInputChange} />

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

        <label>Car Image:</label>
        <input type="file" onChange={handleImageChange} />

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Car'}
        </button>
      </form>

      {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

export default CarEditingPage;
