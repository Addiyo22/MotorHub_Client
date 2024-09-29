import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Select, Checkbox, Button, Typography, Alert, Row, Col, Divider } from 'antd';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
const { Title } = Typography;
const { Option } = Select;

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
  const [featurePrices, setFeaturePrices] = useState({});
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
            "Autopilot": 3000,
            "Harman Kardon Sound System": 2000,
            "M Adaptive Suspension": 1500,
            "Carbon Fiber Roof": 5000,
            "Heated Steering Wheel": 300,
            "Apple CarPlay": 500,
            "Wireless Charging": 200,
            "360-Degree Camera": 500,
            "Ventilated Seats": 1000,
            "Heads-Up Display": 700,
            "Adaptive Air Suspension": 2000,
            "Wireless Phone Charging": 300,
            "Burmester Sound System": 2000,
            "Virtual Cockpit": 500,
            "Bang & Olufsen Sound System": 1500,
            "Matrix LED Headlights": 600,
            "Quattro All-Wheel Drive": 4000,
            "Lane Assist": 300,
            "Sport Suspension": 400,
            "Active Aerodynamics": 1000,
            "Rear-Wheel Steering": 1500,
            "Magnetorheological Suspension": 4000,
          };

          setFeaturePrices(prices);

          setFormData({
            engine: carData.engine?.[0] || '',
            transmission: carData.transmission?.[0] || '',
            exteriorColor: carData.exteriorColor?.[0].name || '',
            interiorColor: carData.interiorColor?.[0].name || '',
            features: [],
            price: carData.price || 0,
          });

          setCar(carData);
        } else {
          setErrorMessage('Car data not found.');
        }
      } catch (error) {
        setErrorMessage('Failed to load car details. Please try again later.');
      }
    };

    fetchCar();
  }, [carId]);

  const handleFeatureChange = (feature, checked) => {
    let updatedFeatures = [...formData.features];

    if (checked) {
      updatedFeatures.push(feature);
    } else {
      updatedFeatures = updatedFeatures.filter((item) => item !== feature);
    }

    const additionalCost = updatedFeatures.reduce((acc, feature) => {
      return acc + (featurePrices[feature] || 0);
    }, 0);

    setFormData({
      ...formData,
      features: updatedFeatures,
      price: car.price + additionalCost,
    });
  };

  const handleSubmit = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const authToken = localStorage.getItem('authToken');
      await axios.post(
        `${API_URL}/cars/${carId}/configure`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setSuccessMessage('Car configured successfully and saved to your profile!');
      navigate('/dashboard');
    } catch (error) {
      setErrorMessage('Failed to configure the car. Please try again.');
    }
  };

  if (!car) {
    return <p>Loading car details...</p>;
  }

  return (
    <div style={{ padding: '50px', backgroundColor: 'white', width: '100vw'}}>
      <Row justify="center">
        <Col xs={24} sm={18} lg={12}>
          <Title level={2} style={{textAlign: 'center'}}>Configure your {car.make} {car.model}</Title>

          {errorMessage && (
            <Alert message={errorMessage} type="error" showIcon style={{ marginBottom: '20px' }} />
          )}
          {successMessage && (
            <Alert message={successMessage} type="success" showIcon style={{ marginBottom: '20px' }} />
          )}

          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item label="Engine">
              <Select value={formData.engine} onChange={(value) => setFormData({ ...formData, engine: value })}>
                {car.engine.map((option, index) => (
                  <Option key={index} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Transmission">
              <Select
                value={formData.transmission}
                onChange={(value) => setFormData({ ...formData, transmission: value })}
              >
                {car.transmission.map((option, index) => (
                  <Option key={index} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Exterior Color">
              <Select
                value={formData.exteriorColor}
                onChange={(value) => setFormData({ ...formData, exteriorColor: value })}
              >
                {car.exteriorColor.map((color, index) => (
                  <Option key={index} value={color.name}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          backgroundColor: color.hex,
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          marginRight: '8px',
                        }}
                      ></span>
                      {color.name}
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Interior Color">
              <Select
                value={formData.interiorColor}
                onChange={(value) => setFormData({ ...formData, interiorColor: value })}
              >
                {car.interiorColor.map((color, index) => (
                  <Option key={index} value={color.name}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          backgroundColor: color.hex,
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          marginRight: '8px',
                        }}
                      ></span>
                      {color.name}
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Divider />

            <Form.Item label="Features">
              <Row gutter={[8, 8]}>
                {car.features.map((feature) => (
                  <Col span={12} key={feature}>
                    <Checkbox
                      checked={formData.features.includes(feature)}
                      onChange={(e) => handleFeatureChange(feature, e.target.checked)}
                    >
                      {feature} (+€{featurePrices[feature] || 0})
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Form.Item>

            <Form.Item label={`Total Price: €${formData.price.toFixed(2)}`} />

            <Button type="primary" htmlType="submit" block>
              Save Configuration
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default CarConfigurationPage;




/* const prices = {
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
            "Autopilot": 3000,
            "Harman Kardon Sound System": 2000,
            "M Adaptive Suspension": 1500,
            "Carbon Fiber Roof": 5000,
            "Heated Steering Wheel": 300,
            "Apple CarPlay": 500,
            "Wireless Charging": 200,
            "360-Degree Camera": 500,
            "Ventilated Seats": 1000,
            "Heads-Up Display": 700,
            "Adaptive Air Suspension": 2000,
            "Wireless Phone Charging": 300,
            "Burmester Sound System": 2000,
            "Virtual Cockpit": 500,
            "Bang & Olufsen Sound System": 1500,
            "Matrix LED Headlights": 600,
            "Quattro All-Wheel Drive": 4000,
            "Lane Assist": 300,
            "Sport Suspension": 400,
            "Active Aerodynamics": 1000,
            "Rear-Wheel Steering": 1500,
            "Magnetorheological Suspension": 4000,
          }; */
