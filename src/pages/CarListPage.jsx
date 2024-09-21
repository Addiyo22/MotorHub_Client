import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5005'; 

function CarListPage() {
  const [cars, setCars] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(`${API_URL}/cars`);
        setCars(response.data);
      } catch (error) {
        console.error('Error fetching cars:', error);
        setErrorMessage('Failed to load cars. Please try again later.');
      }
    };

    fetchCars();
  }, []);

  return (
    <div className="CarListPage">
      <h1>Available Cars</h1>
      {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}
      <ul>
          {cars.map((car) => (
            <li key={car._id}>
            <Link to={`/cars/${car._id}`}>
              <h3>{car.make} {car.model} ({car.year})</h3>
              <p>Engine: {car.engine} - {car.engineHorsepower} HP</p>
              <p>Price: ${car.price}</p>
              <p>Features: {car.features.join(', ')}</p>
            </Link>
            <Link to={`/cars/${car._id}/configure`}>Configure</Link>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default CarListPage;