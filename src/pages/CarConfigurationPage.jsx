import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:5005'; 

function CarConfigurationPage() {
  const { carId } = useParams();
  const [car, setCar] = useState(null);
  const [formData, setFormData] = useState({
    engine: '',
    transmission: '',
    exteriorColor: '',
    interiorColor: '',
    features: [],
    price: 0,
  });
  const [featurePrices, setFeaturePrices] = useState({}); // This holds prices for each feature
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await axios.get(`${API_URL}/cars/${carId}`);
        
        if (response.data && response.data.car) {
          const carData = response.data.car;

          const prices = {
            "Navigation": 1000,
            "Bluetooth": 500,
            "Heated Seats": 800,
            "Sunroof": 1500,
            "Leather Seats": 2000,
            "Backup Camera": 600,
            "Sport Chrono Package": 2500,
            "All-Wheel Drive": 3000,
            "Panoramic Roof": 1200,
            "Adaptive Cruise Control": 1800,
            "Hybrid System": 2200,
            "Bose Sound System": 1000,
            "Electric Powertrain": 5000,
            "Autonomous Driving": 3000,
            "Fast Charging": 800,
          };

          setFeaturePrices(prices);

          setFormData({  //adds data to the form
            engine: carData.engine?.[0] || '', // This checks if some value exists if not then it keeps empty
            transmission: carData.transmission?.[0] || '',
            exteriorColor: carData.exteriorColor?.[0] || '',
            interiorColor: carData.interiorColor?.[0] || '',
            features: [],
            price: carData.price || 0,
          });

          setCar(carData); 
        } else {
          setErrorMessage('Car data not found.');
        }
      } catch (error) {
        console.error('Error fetching car:', error);
        setErrorMessage('Failed to load car details. Please try again later.');
      }
    };

    fetchCar();
  }, [carId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle feature selection changes
  const handleFeatureChange = (e) => {
    const { value, checked } = e.target;
    let updatedFeatures = [...formData.features];

    if (checked) {
      updatedFeatures.push(value); // Add feature if checked
    } else {
      updatedFeatures = updatedFeatures.filter((feature) => feature !== value); // Remove feature if unchecked
    }

    // Calculate the new total price based on selected features
    const additionalCost = updatedFeatures.reduce((acc, feature) => {
      return acc + (featurePrices[feature] || 0);
    }, 0);

    setFormData({
      ...formData,
      features: updatedFeatures,
      price: (car?.price || 0) + additionalCost, // Update the total price
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const authToken = localStorage.getItem('authToken'); // Assuming the token is stored in local storage after login
      const response = await axios.post(
        `${API_URL}/cars/${carId}/configure`,
        {
          engine: formData.engine,
          transmission: formData.transmission,
          exteriorColor: formData.exteriorColor,
          interiorColor: formData.interiorColor,
          features: formData.features,
          price: parseFloat(formData.price),
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Include the JWT token for authentication
          },
        }
      );

      setSuccessMessage('Car configured successfully and saved to your profile!');
      console.log('Configuration Response:', response.data);
      navigate('/dashboard'); 
    } catch (error) {
      console.error('Error configuring car:', error);
      setErrorMessage('Failed to configure the car. Please try again.');
    }
  };

  if (!car) {
    return <p>Loading car details...</p>;
  }

  return (
    <div className="CarConfigurationPage">
      <h1>Configure {car.make} {Array.isArray(car.model) ? car.model.join(', ') : car.model}</h1>
      {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p className="success-message" style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label>Engine:</label>
        <select name="engine" value={formData.engine} onChange={handleInputChange} required>
          {(car.engine || []).map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>

        <label>Transmission:</label>
        <select name="transmission" value={formData.transmission} onChange={handleInputChange} required>
          {(car.transmission || []).map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>

        <label>Exterior Color:</label>
        <select name="exteriorColor" value={formData.exteriorColor} onChange={handleInputChange} required>
          {(car.exteriorColor || []).map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>

        <label>Interior Color:</label>
        <select name="interiorColor" value={formData.interiorColor} onChange={handleInputChange} required>
          {(car.interiorColor || []).map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>

        <label>Features:</label>
        <div>
          {(car.features || []).map((feature, index) => (
            <div key={index}>
              <input
                type="checkbox"
                value={feature}
                onChange={handleFeatureChange}
                checked={formData.features.includes(feature)}
              />
              <label>
                {feature} (+€{featurePrices[feature] || 0})
              </label>
            </div>
          ))}
        </div>

        <label>Total Price: €{formData.price.toFixed(2)}</label>

        <button type="submit">Save Configuration</button>
      </form>
    </div>
  );
}

export default CarConfigurationPage;
