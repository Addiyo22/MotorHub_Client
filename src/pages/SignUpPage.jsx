// SignupPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Input, Button, Typography, Alert, Space } from "antd";
import '../styles/SignUpPageStyle.css'; // Import the CSS file

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";
const { Title } = Typography;

function SignupPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  const navigate = useNavigate();

  const handleUsername = (e) => setUsername(e.target.value)
  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleName = (e) => setName(e.target.value);

  const handleSignupSubmit = async (values) => {
    // Correctly destructure the values from the form submission
    const { email, username, password, name } = values;
  
    // Construct the requestBody using the destructured values
    const requestBody = { email, username, password, name };
  
    try {
      // Send the request to the backend with the correctly constructed requestBody
      await axios.post(`${API_URL}/auth/signup`, requestBody);
      navigate("/login"); // Redirect to login page on successful signup
    } catch (error) {
      // Handle any errors that occur during signup
      const errorDescription = error.response?.data?.message || "Signup failed. Please try again.";
      setErrorMessage(errorDescription);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form-wrapper">
        <Title level={2} className="signup-title">Sign Up</Title>
        <Form
          name="signup"
          onFinish={handleSignupSubmit}
          layout="vertical"
          autoComplete="off"
          className="signup-form"
        >
          <Form.Item
            label="Email"
            name="email"
            

            rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
          >
            <Input placeholder="Enter your email" onChange={handleEmail}/>
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input placeholder="Enter your username" onChange={handleUsername}/>
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Enter your password" onChange={handlePassword}/>
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input placeholder="Enter your name" onChange={handleName} />
          </Form.Item>

          {errorMessage && <Alert message={errorMessage} type="error" showIcon style={{ marginBottom: '20px' }} />}

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </Space>
      </div>
    </div>
  );
}

export default SignupPage;


