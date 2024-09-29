import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Upload, Typography, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
const { Title } = Typography;

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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = ({ file }) => {
    setImage(file); // Set the selected image file in state
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('authToken');

    // Prepare the data
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
    if (image) formDataToSubmit.append('image', image);

    try {
      await axios.post(`${API_URL}/admin/newCar`, formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      message.success('Car created successfully!');
      navigate('/cars');
    } catch (error) {
      message.error('Failed to create car. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '50px', backgroundColor: 'white', width: '100vw'}}>
      <Title level={2} style={{textAlign: 'center'}}>Create a New Car</Title>
      <Form layout="vertical" onFinish={handleSubmit} style={{width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <Form.Item label="Make" style={{ width: '30rem' }} required>
          <Input name="make" value={formData.make} onChange={handleInputChange} />
        </Form.Item>

        <Form.Item label="Model (comma-separated)" style={{ width: '30rem' }} required>
          <Input name="model" value={formData.model} onChange={handleInputChange} />
        </Form.Item>

        <Form.Item label="Year" style={{ width: '30rem' }} required>
          <Input type="number" name="year" value={formData.year} onChange={handleInputChange} />
        </Form.Item>

        <Form.Item label="Trim (comma-separated)" style={{ width: '30rem' }}>
          <Input name="trim" value={formData.trim} onChange={handleInputChange} />
        </Form.Item>

        <Form.Item label="Engine (comma-separated)" style={{ width: '30rem' }}>
          <Input name="engine" value={formData.engine} onChange={handleInputChange} />
        </Form.Item>

        <Form.Item label="Engine Horsepower (comma-separated)" style={{ width: '30rem' }}>
          <Input name="engineHorsepower" value={formData.engineHorsepower} onChange={handleInputChange} />
        </Form.Item>

        <Form.Item label="Transmission (comma-separated)" style={{ width: '30rem' }}>
          <Input name="transmission" value={formData.transmission} onChange={handleInputChange} />
        </Form.Item>

        <Form.Item label="Interior Color Name" style={{ width: '30rem' }}>
          <Input name="interiorColorName" value={formData.interiorColorName} onChange={handleInputChange} />
        </Form.Item>

        <Form.Item label="Interior Color Hex" style={{ width: '30rem' }}>
          <Input name="interiorColorHex" value={formData.interiorColorHex} onChange={handleInputChange} />
        </Form.Item>

        <Form.Item label="Exterior Color Name" style={{ width: '30rem' }}>
          <Input name="exteriorColorName" value={formData.exteriorColorName} onChange={handleInputChange} />
        </Form.Item>

        <Form.Item label="Exterior Color Hex" style={{ width: '30rem' }}>
          <Input name="exteriorColorHex" value={formData.exteriorColorHex} onChange={handleInputChange} />
        </Form.Item>

        <Form.Item label="Features (comma-separated)" style={{ width: '30rem' }}>
          <Input.TextArea
            name="features"
            value={formData.features}
            onChange={handleInputChange}
            placeholder="Enter features separated by commas"
          />
        </Form.Item>

        <Form.Item label="Price" required style={{ width: '30rem' }}>
          <Input type="number" name="price" value={formData.price} onChange={handleInputChange} />
        </Form.Item>

        <Form.Item label="Available" valuePropName="checked" style={{ width: '30rem' }}>
          <Checkbox name="available" checked={formData.available} onChange={handleInputChange}>
            Available
          </Checkbox>
        </Form.Item>

        <Form.Item label="Quantity" required style={{ width: '30rem' }}>
          <Input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} />
        </Form.Item>

        <Form.Item label="Location" style={{ width: '30rem' }}>
          <Input name="location" value={formData.location} onChange={handleInputChange} />
        </Form.Item>

        <Form.Item label="Car Image">
          <Upload
            listType="picture"
            beforeUpload={() => false}
            onChange={handleImageChange}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Upload Car Image</Button>
          </Upload>
        </Form.Item>

        <Button type="primary" style={{ width: '10rem' }} htmlType="submit" loading={isLoading} block>
          {isLoading ? 'Creating...' : 'Create Car'}
        </Button>
      </Form>
    </div>
  );
}

export default CarCreationPage;
