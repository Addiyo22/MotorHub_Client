import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReviewForm from '../components/ReviewForm';
import Reviews from '../components/Reviews';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005'; 

function CarPage() {
  const { carId } = useParams();
  const [car, setCar] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await axios.get(`${API_URL}/cars/${carId}`)
        console.log('Car data:', response.data);
        setCar(response.data.car);
      } catch (error) {
        console.error('Error fetching cars:', error);
        setErrorMessage('Failed to load cars. Please try again later.');
      }
    };

    fetchCar();
  }, [carId]);

  if (errorMessage) {
    return <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>;
  }
  

  if (!car) {
    return <p>Loading car details...</p>;
  }
  console.log("here",car.make)

  return (
    <div>
      <h3>Make: {car.make}</h3>
      <p>Model: {car.model.join(', ')}</p>
      <p>Year: {car.year}</p>
      <p>Engine: {car.engine.join(', ')}</p>
      <p>Engine Horsepower: {car.engineHorsepower.join(', ')} HP</p>
      <p>Transmission: {car.transmission.join(', ')}</p>
      <p>Interior Colors: {car.interiorColor.join(', ')}</p>
      <p>Exterior Colors: {car.exteriorColor.join(', ')}</p>
      <p>Price: ${car.price}</p>
      <p>Features: {Array.isArray(car.features) ? car.features.join(', ') : 'No features available'}</p>
        {/* <ReviewForm /> */}
        <Reviews />
    </div>
  );
}

export default CarPage;