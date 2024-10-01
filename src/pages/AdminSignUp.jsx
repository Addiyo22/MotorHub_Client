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

    const { email, firstname, password, lastname } = values;
    const requestBody = { email, password, firstname, lastname, isAdmin: true };

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
          label="Firstname"
          name="firstname"
          rules={[{ required: true, message: "Please input your firstname!" }]}
        >
          <Input placeholder="Enter your firstname" />
        </Form.Item>

        <Form.Item
          label="Lastname"
          name="lastname"
          rules={[{ required: true, message: "Please input your lastname!" }]}
        >
          <Input placeholder="Enter your lastname" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={isLoading}>
            Sign Up
          </Button>
        </Form.Item>
      </Form>

      <Typography.Paragraph style={{ textAlign: 'center' }}>
      </Typography.Paragraph>
    </div>
    </div>
  );
}

export default AdminSignUp;
