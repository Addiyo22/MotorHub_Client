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
  const [firstname, setFirstname] = useState("");
  const [password, setPassword] = useState("");
  const [lastname, setLastName] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  const navigate = useNavigate();

  const handleFirstname = (e) => setFirstname(e.target.value)
  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleLastName = (e) => setLastName(e.target.value);

  const handleSignupSubmit = async (values) => {
    const { email, firstname, password, lastname } = values;
  
    const requestBody = { email, firstname, password, lastname };
  
    try {
      await axios.post(`${API_URL}/auth/signup`, requestBody);
      navigate("/login");
    } catch (error) {
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
            label="First Name"
            name="firstname"
            rules={[{ required: true, message: 'Please input your firstname!' }]}
          >
            <Input placeholder="Enter your Firstname" onChange={handleFirstname}/>
          </Form.Item>
          
          <Form.Item
            label="Last Name"
            name="lastname"
            rules={[{ required: true, message: 'Please input your lastname!' }]}
          >
            <Input placeholder="Enter your lastname" onChange={handleFirstname} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Enter your password" onChange={handlePassword}/>
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


