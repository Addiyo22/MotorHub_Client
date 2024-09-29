import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Input, Button, Typography, message } from "antd";
import '../styles/AdminSignupStyle.css'

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";
const { Title } = Typography;

function AdminSignUp() {
  const [form] = Form.useForm(); // Ant Design form instance
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle form submission
  const handleSignupSubmit = (values) => {
    setIsLoading(true);

    const { email, username, password, name } = values;
    const requestBody = { email, password, username, name, isAdmin: true };

    axios
      .post(`${API_URL}/auth/admin/signup`, requestBody)
      .then(() => {
        message.success("Account created successfully! Redirecting to login...");
        navigate("/login");
      })
      .catch((error) => {
        const errorDescription = error.response?.data?.message || "Something went wrong. Please try again.";
        message.error(errorDescription);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="admin-signup-container">
    <div className="admin-signup-page">
      <Title level={2} style={{ textAlign: 'center' }}>Admin Sign Up</Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSignupSubmit}
        style={{ marginTop: '20px' }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!", type: "email" }]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input placeholder="Enter your username" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={isLoading}>
            Sign Up
          </Button>
        </Form.Item>
      </Form>

      <Typography.Paragraph style={{ textAlign: 'center' }}>
        Already have an account? <Link to="/login">Login here</Link>
      </Typography.Paragraph>
    </div>
    </div>
  );
}

export default AdminSignUp;
