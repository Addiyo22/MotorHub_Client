import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/auth.context';
import { useContext } from 'react';

const API_URL = 'http://localhost:5005'; 

function InventoryPage() {
  const [cars, setCars] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const { user, isLoggedIn } = useContext(AuthContext);
  const checkAdmin = user?.isAdmin; 

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(`${API_URL}/inventory`);
        console.log(response.data)
        setCars(response.data);
      } catch (error) {
        console.error('Error fetching cars:', error);
        setErrorMessage('Failed to load cars. Please try again later.');
      }
    };

    fetchCars();
  }, []);

  const handleDelete = async (carId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this car?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${API_URL}/admin/cars/${carId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCars((prevCars) => prevCars.filter((car) => car._id !== carId));
    } catch (error) {
      console.error('Error deleting car:', error);
      setErrorMessage('Failed to delete the car. Please try again.');
    }
  };

  return (
    <div className="CarListPage">
      <h1>Available Cars</h1>
      {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}
      <ul>
          {cars.map((car) => (
            <li key={car._id}>
              <h3>{car.make} {car.model} ({car.year})</h3>
              <p>Engine: {car.engine} - {car.engineHorsepower} HP</p>
              <p>Price: ${car.price}</p>
              <p>Features: {car.features.join(', ')}</p>
              {isLoggedIn && checkAdmin &&(
                <>
                <Link to={`/admin/editCar/${car._id}`}>Edit Car</Link>
                <button onClick={() => handleDelete(car._id)} style={{ color: 'red' }}>
                  Delete Car
                </button>
                </>
                )}
            {isLoggedIn && !checkAdmin &&(
                <Link to={`/cars/${car._id}/configure`}>Add to configurations</Link>
                )}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default InventoryPage;