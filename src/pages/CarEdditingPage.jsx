import { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Checkbox, Button, Upload, message, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/CarEdittingPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
const { Title } = Typography;

function CarEditingPage() {
  const { carId } = useParams();
  const [form] = Form.useForm(); 
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
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

        form.setFieldsValue({
          make: car.make || '',
          model: car.model ? car.model.join(', ') : '',
          year: car.year || '',
          trim: car.trim ? car.trim.join(', ') : '',
          engine: car.engine ? car.engine.join(', ') : '',
          engineHorsepower: car.engineHorsepower ? car.engineHorsepower.join(', ') : '',
          transmission: car.transmission ? car.transmission.join(', ') : '',
          interiorColors: car.interiorColor.map((color) => `${color.name}:${color.hex}`).join(', '), // Comma-separated format
          exteriorColors: car.exteriorColor.map((color) => `${color.name}:${color.hex}`).join(', '), // Comma-separated format
          features: car.features ? car.features.join(', ') : '',
          price: car.price || '',
          quantity: car.quantity || null,
          location: car.location || null,
          available: car.available || true,
        });
      } catch (error) {
        console.error('Error fetching car details:', error);
        setErrorMessage('Failed to load car details. Please try again later.');
      }
    };

    fetchCarDetails();
  }, [carId, form]);


  const handleImageChange = ({ file }) => {
    setImage(file); 
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    setIsLoading(true);
    setErrorMessage('');

    const token = localStorage.getItem('authToken');

    // Prepare the data to match the backend requirements
    const carDetails = {
      ...values,
      model: values.model.split(',').map((m) => m.trim()),
      trim: values.trim.split(',').map((t) => t.trim()),
      engine: values.engine.split(',').map((e) => e.trim()),
      transmission: values.transmission.split(',').map((t) => t.trim()),
      engineHorsepower: values.engineHorsepower.split(',').map((hp) => parseFloat(hp)),
      features: values.features.split(',').map((f) => f.trim()),
      
      // Split comma-separated colors in "name:hex" format
      interiorColor: values.interiorColors.split(',').map((color) => {
        const [name, hex] = color.trim().split(':');
        return { name: name.trim(), hex: hex.trim() };
      }),
      
      exteriorColor: values.exteriorColors.split(',').map((color) => {
        const [name, hex] = color.trim().split(':');
        return { name: name.trim(), hex: hex.trim() };
      }),
    };

    if (!values.quantity) {
      delete carDetails.quantity;
    }
    if (!values.location) {
      delete carDetails.location;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('carDetails', JSON.stringify(carDetails));
    if (image) formDataToSubmit.append('image', image);

    try {
      await axios.put(`${API_URL}/admin/cars/${carId}/edit`, formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      message.success('Car updated successfully!');
      navigate(`/cars/${carId}`);
    } catch (error) {
      console.error('Error updating car:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to update car. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '50px', backgroundColor: 'white', width: '100vw'}}>
      <Title level={2} style={{textAlign: 'center'}}>Edit Car</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}
      >
        <Form.Item label="Make" name="make" style={{ width: '30rem' }} rules={[{ required: true, message: 'Please input the make!' }]}>
          <Input placeholder="Enter car make" />
        </Form.Item>

        <Form.Item label="Model" name="model" style={{ width: '30rem' }} rules={[{ required: true, message: 'Please input the model!' }]}>
          <Input placeholder="Enter car model" />
        </Form.Item>

        <Form.Item label="Year" name="year" style={{ width: '30rem' }} rules={[{ required: true, message: 'Please input the year!' }]}>
          <InputNumber min={1900} max={2024} placeholder="Enter year" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Trim" name="trim" style={{ width: '30rem' }}>
          <Input placeholder="Enter car trim" />
        </Form.Item>

        <Form.Item label="Engine" name="engine" style={{ width: '30rem' }}>
          <Input placeholder="Enter engine type" />
        </Form.Item>

        <Form.Item label="Engine Horsepower" name="engineHorsepower" style={{ width: '30rem' }}>
          <Input placeholder="Enter horsepower" />
        </Form.Item>

        <Form.Item label="Transmission" name="transmission" style={{ width: '30rem' }}>
          <Input placeholder="Enter transmission type" />
        </Form.Item>

        <Form.Item label="Interior Colors (comma-separated with name:hex format)" name="interiorColors" style={{ width: '30rem' }} rules={[{ required: true }]}>
          <Input placeholder="e.g. Black:#000000, Red:#FF0000" />
        </Form.Item>

        <Form.Item label="Exterior Colors (comma-separated with name:hex format)" name="exteriorColors" style={{ width: '30rem' }} rules={[{ required: true }]}>
          <Input placeholder="e.g. White:#FFFFFF, Blue:#0000FF" />
        </Form.Item>

        <Form.Item label="Features" name="features" style={{ width: '30rem' }}>
          <Input.TextArea placeholder="Enter features separated by commas" />
        </Form.Item>

        <Form.Item label="Price" name="price" style={{ width: '30rem' }} rules={[{ required: true }]}>
          <InputNumber min={0} prefix="€" style={{ width: '100%' }} />
        </Form.Item>

        {form.getFieldValue('quantity') !== null && (
          <Form.Item label="Quantity" name="quantity" style={{ width: '30rem' }}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        )}

        {form.getFieldValue('location') !== null && (
          <Form.Item label="Location" name="location" style={{ width: '30rem' }}>
            <Input placeholder="Enter car location" />
          </Form.Item>
        )}

        <Form.Item name="available" valuePropName="checked">
          <Checkbox>Available</Checkbox>
        </Form.Item>

        <Form.Item label="Upload Car Image">
          <Upload beforeUpload={() => false} onChange={handleImageChange} listType="picture">
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} block>
            {isLoading ? 'Updating...' : 'Update Car'}
          </Button>
        </Form.Item>
      </Form>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

export default CarEditingPage;
