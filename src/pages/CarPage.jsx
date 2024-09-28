import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, Typography, Row, Col, Spin, Alert, Tag } from 'antd';
import Reviews from '../components/Reviews';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
const { Title, Text } = Typography;

function CarPage() {
  const { carId } = useParams();
  const [car, setCar] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await axios.get(`${API_URL}/cars/${carId}`);
        console.log('Car data:', response.data);
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

  // Map color data to visually appealing tags
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
    <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <Row gutter={[16, 16]} style={{ maxWidth: '1200px', width: '100%' }}>
        <Col xs={24} md={18}>
          <Card
            cover={
              car.images && car.images.length > 0 && (
                <img
                  src={car.images[0]}
                  alt={`${car.make} ${car.model}`}
                  style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '10px' }}
                />
              )
            }
            style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
          >
            <Title level={3}>{`${car.make} ${Array.isArray(car.model) ? car.model.join(', ') : car.model}`}</Title>
            <Text strong>Year:</Text> {car.year}
            <br />
            <Text strong>Engine:</Text> {Array.isArray(car.engine) ? car.engine.join(', ') : car.engine}
            <br />
            <Text strong>Engine Horsepower:</Text>{' '}
            {Array.isArray(car.engineHorsepower) ? car.engineHorsepower.join(', ') : car.engineHorsepower} HP
            <br />
            <Text strong>Transmission:</Text>{' '}
            {Array.isArray(car.transmission) ? car.transmission.join(', ') : car.transmission}
            <br />
            <Text strong>Interior Colors:</Text> {renderColorTags(car.interiorColor)}
            <br />
            <Text strong>Exterior Colors:</Text> {renderColorTags(car.exteriorColor)}
            <br />
            <Text strong>Price:</Text> ${car.price}
            <br />
            <Text strong>Features:</Text>{' '}
            {Array.isArray(car.features) ? car.features.join(', ') : 'No features available'}
          </Card>
        </Col>
      </Row>
      <Reviews carId={carId} />
    </div>
  );
}

export default CarPage;
