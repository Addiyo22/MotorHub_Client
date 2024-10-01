import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, Typography, message } from 'antd';
import { AuthContext } from '../context/auth.context';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
const { Title } = Typography;

function EditProfilePage() {
  const { userId } = useParams(); 
  const [form] = Form.useForm();
  const { user, setUser } = useContext(AuthContext); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${API_URL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { email, firstname, lastname } = response.data;
        console.log(response.data)
        form.setFieldsValue({ email, firstname, lastname });
      } catch (error) {
        message.error('Failed to load profile information');
      }
    };

    fetchUserProfile();
  }, [userId, form]);

  const handleSubmit = async (values) => {
    const { email, firstname, lastname, password } = values;

    if (!email || !firstname || !lastname) {
      message.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(`${API_URL}/auth/profile/${userId}/edit`,
        { email, firstname, lastname, password }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { user } = response.data;
      setUser(user); 
      message.success('Profile updated successfully!');
      navigate(`/dashboard`); 
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-edit-page" style={{ padding: '20px', backgroundColor: 'white', minHeight: '100vh', width: '100vw', paddingTop: '60px' }}>
      <Title level={2} style={{ textAlign: 'center' }}>Edit Profile</Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ maxWidth: '500px', margin: '0 auto' }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="First Name"
          name="firstname"
          rules={[{ required: true, message: 'Please input your first name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lastname"
          rules={[{ required: true, message: 'Please input your last name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              pattern: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/,
              message: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.',
            },
          ]}
        >
          <Input.Password placeholder="Leave blank to keep current password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default EditProfilePage;
