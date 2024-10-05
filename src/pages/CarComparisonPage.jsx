import { useState, useEffect } from 'react';
import { Select, Card, Row, Col, Table, Typography, Button } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/CarComparisonStyle.css';

const { Option } = Select;
const { Title } = Typography;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';

function CarComparisonPage() {
  const [cars, setCars] = useState([]);
  const [selectedCar1, setSelectedCar1] = useState(null);
  const [selectedCar2, setSelectedCar2] = useState(null);
  const [car1Details, setCar1Details] = useState(null);
  const [car2Details, setCar2Details] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(`${API_URL}/cars`);
        setCars(response.data);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };

    fetchCars();
  }, []);

  const fetchCarDetails = async (carId, setCarDetails) => {
    try {
      const response = await axios.get(`${API_URL}/cars/${carId}`);
      setCarDetails(response.data);
    } catch (error) {
      console.error('Error fetching car details:', error);
    }
  };

  const handleCar1Change = (carId) => {
    setSelectedCar1(carId);
    fetchCarDetails(carId, setCar1Details);
  };

  const handleCar2Change = (carId) => {
    setSelectedCar2(carId);
    fetchCarDetails(carId, setCar2Details);
  };

  const handleConfigureCar = (carId) => {
    navigate(`/cars/${carId}/configure`);
  };

  const comparisonData = [
    {
      key: 'Make',
      car1: car1Details?.car.make || 'N/A',
      car2: car2Details?.car.make || 'N/A',
    },
    {
      key: 'Model',
      car1: car1Details?.car.model || 'N/A',
      car2: car2Details?.car.model || 'N/A',
    },
    {
      key: 'Year',
      car1: car1Details?.car.year || 'N/A',
      car2: car2Details?.car.year || 'N/A',
    },
    {
      key: 'Engine',
      car1: car1Details?.car.engine || 'N/A',
      car2: car2Details?.car.engine || 'N/A',
    },
    {
      key: 'Horsepower',
      car1: `${car1Details?.car.engineHorsepower} HP` || 'N/A',
      car2: `${car2Details?.car.engineHorsepower} HP` || 'N/A',
    },
    {
      key: 'Transmission',
      car1: car1Details?.car.transmission || 'N/A',
      car2: car2Details?.car.transmission || 'N/A',
    },
    {
      key: 'Price',
      car1: car1Details?.car.price ? `€${car1Details.car.price}` : 'N/A',
      car2: car2Details?.car.price ? `€${car2Details.car.price}` : 'N/A',
    },
    {
      key: 'Configure',
      car1: (
        <Button type="primary" onClick={() => handleConfigureCar(selectedCar1)}>
          Configure Car 1
        </Button>
      ),
      car2: (
        <Button type="primary" onClick={() => handleConfigureCar(selectedCar2)}>
          Configure Car 2
        </Button>
      ),
    },
  ];

  const columns = [
    {
      title: 'Car 1',
      dataIndex: 'car1',
      key: 'car1',
      align: 'center',
    },
    {
      title: 'Car 2',
      dataIndex: 'car2',
      key: 'car2',
      align: 'center',
    },
  ];

  return (
    <div className="comparison-container" style={{ width: '95vw' }}>
      <Title level={2} className="comparison-title">Compare Cars</Title>

      <Row gutter={32} className="car-selectors">
        <Col span={12}>
          <Card className="car-card">
            <Select
              placeholder="Select Car 1"
              style={{ width: '100%' }}
              onChange={handleCar1Change}
              value={selectedCar1}
              size="large"
            >
              {cars.map((car) => (
                <Option key={car._id} value={car._id}>
                  {car.make} {car.model}
                </Option>
              ))}
            </Select>
          </Card>
        </Col>
        <Col span={12}>
          <Card className="car-card">
            <Select
              placeholder="Select Car 2"
              style={{ width: '100%' }}
              onChange={handleCar2Change}
              value={selectedCar2}
              size="large"
            >
              {cars.map((car) => (
                <Option key={car._id} value={car._id}>
                  {car.make} {car.model}
                </Option>
              ))}
            </Select>
          </Card>
        </Col>
      </Row>

      {car1Details && car2Details && (
        <Table
          className="comparison-table"
          dataSource={comparisonData}
          columns={columns}
          pagination={false}
          bordered
        />
      )}

      {!car1Details && !car2Details && (
        <Card className="empty-card">
          <p className="empty-text">Select two cars to compare</p>
        </Card>
      )}
    </div>
  );
}

export default CarComparisonPage;
