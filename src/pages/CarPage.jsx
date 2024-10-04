import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Typography, Row, Col, Spin, Alert, Tag, Button } from 'antd';
import Reviews from '../components/Reviews';
import { AuthContext } from '../context/auth.context';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
const { Title, Text } = Typography;

function CarPage() {
  const { carId } = useParams();
  const [car, setCar] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const { user, isLoggedIn } = useContext(AuthContext);
  const checkAdmin = user?.isAdmin;

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await axios.get(`${API_URL}/cars/${carId}`);
        setCar(response.data.car);
      } catch (error) {
        console.error('Error fetching cars:', error);
        setErrorMessage('Failed to load car details. Please try again later.');
      }
    };

    fetchCar();
  }, [carId]);

  if (errorMessage) {
    return <Alert message={errorMessage} type="error" showIcon style={{ marginBottom: '20px' }} />;
  }

  if (!car) {
    return <Spin size="large" style={{ display: 'block', margin: '20px auto' }} />;
  }

  const renderColorTags = (colors) =>
    colors.map((color) => (
      <Tag
        key={color.name}
        color={color.hex}
        style={{
          color: '#fff',
          borderColor: color.hex,
          marginBottom: '8px',
        }}
      >
        {color.name}
      </Tag>
    ));

  return (
    <div
      style={{
        minHeight: '100vh', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center', 
        flexDirection: 'column',
        padding: '20px',
        width: '100vw',
        paddingTop: '100px'
      }}
    >
      <Row gutter={[16, 16]} style={{ maxWidth: '1200px', width: '100vw', paddingLeft: '200px' }}>
        <Col xs={24} md={18}>
          <Card
            cover={
              car.images && car.images.length > 0 ? (
                <img
                  src={car.images[0]}
                  alt={`${car.make} ${car.model}`}
                  style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '10px' }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '400px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '10px',
                  }}
                >
                  <Text>No Image Available</Text>
                </div>
              )
            }
            style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
          >
            <Title level={3}>{`${car.make} ${Array.isArray(car.model) ? car.model.join(', ') : car.model}`}</Title>
            <Text strong>Year:</Text> {car.year || 'N/A'}
            <br />
            <Text strong>Engine:</Text> {Array.isArray(car.engine) ? car.engine.join(', ') : car.engine || 'N/A'}
            <br />
            <Text strong>Engine Horsepower:</Text>{' '}
            {Array.isArray(car.engineHorsepower) ? car.engineHorsepower.join(', ') : car.engineHorsepower || 'N/A'} HP
            <br />
            <Text strong>Transmission:</Text>{' '}
            {Array.isArray(car.transmission) ? car.transmission.join(', ') : car.transmission || 'N/A'}
            <br />
            <Text strong>Interior Colors:</Text>{' '}
            {car.interiorColor && car.interiorColor.length > 0 ? renderColorTags(car.interiorColor) : 'N/A'}
            <br />
            <Text strong>Exterior Colors:</Text>{' '}
            {car.exteriorColor && car.exteriorColor.length > 0 ? renderColorTags(car.exteriorColor) : 'N/A'}
            <br />
            <Text strong>Price:</Text> {car.price ? `€${car.price}` : 'N/A'}
            <br />
            <Text strong>Features:</Text>{' '}
            {Array.isArray(car.features) && car.features.length > 0 ? car.features.join(', ') : 'No features available'}
            {isLoggedIn &&(
              <div style={{display: 'flex', justifyContent: 'center'}}>
            <Link to={`/cars/${car._id}/configure`} key="configure" >
                <Button block style={{width: '20rem'}}>Configure</Button>
            </Link>
            </div>
            )}
          </Card>
        </Col>
      </Row>
      {isLoggedIn && (
        <Reviews carId={carId} />
      )}
    </div>
  );
}

export default CarPage;
