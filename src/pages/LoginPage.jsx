// LoginPage.jsx
import { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { Form, Input, Button, Typography, Alert, Space } from "antd";
import '../styles/LoginPageStyle.css'; // Import the CSS file

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";
const { Title } = Typography;

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  const navigate = useNavigate();
  const { storeToken, authenticateUser } = useContext(AuthContext);

  const handleLoginSubmit = async (values) => {
    const { email, password } = values;
    const requestBody = { email, password };

    try {
      const response = await axios.post(`${API_URL}/auth/login`, requestBody);
      storeToken(response.data.authToken);
      authenticateUser();
      navigate("/dashboard");
    } catch (error) {
      const errorDescription = error.response?.data?.message || "Login failed. Please try again.";
      console.log('error message', errorDescription)
      setErrorMessage(errorDescription);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <Title level={2} className="login-title">Login</Title>
        <Form
          name="login"
          onFinish={handleLoginSubmit}
          layout="vertical"
          autoComplete="off"
          className="login-form"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          {errorMessage && <Alert message={errorMessage} type="error" showIcon style={{ marginBottom: '20px' }} />}

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </Form>

        <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
          <p>Don't have an account yet? <Link to="/signup">Sign Up</Link></p>
        </Space>
      </div>
    </div>
  );
}

export default LoginPage;
