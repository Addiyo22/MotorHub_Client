import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { Layout, Menu, Button } from 'antd';
import { HomeOutlined, UserOutlined, LoginOutlined, LogoutOutlined, UserAddOutlined } from '@ant-design/icons';

const { Header } = Layout;

function Navbar() {
  const { isLoggedIn, logOutUser } = useContext(AuthContext);

  return (
    <Layout>
      <Header
        style={{
          backgroundColor: '#001529',
          display: 'flex',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 1000, 
          padding: '0 20px'
        }}
      >
        {/* Home Button */}
        <Link to="/">
          <Button type="text" icon={<HomeOutlined />} style={{ color: '#fff' }}>Home</Button>
        </Link>

        {/* Centered Logo */}
        <div style={{ textAlign: 'center', flex: 1 }}>
          <Link to="/">
            <img src="/images/motorhub_logo.png" alt="Logo" style={{ width: '100px', marginLeft: '35rem', marginTop: '30px' }} />
          </Link>
        </div>

        {/* Menu */}
        <Menu
          theme="dark"
          mode="horizontal"
          style={{ justifyContent: 'flex-end', borderBottom: 'none', flex: 1 }}
        >
          {isLoggedIn ? (
            <>
              <Menu.Item key="profile">
                <Link to="/dashboard">
                  <Button type="text" icon={<UserOutlined />} style={{ color: '#fff' }}>Profile</Button>
                </Link>
              </Menu.Item>
              <Menu.Item key="logout">
                <Button
                  type="text"
                  onClick={logOutUser}
                  icon={<LogoutOutlined />}
                  style={{ color: '#fff' }}
                >
                  Logout
                </Button>
              </Menu.Item>
            </>
          ) : (
            <>
              <Menu.Item key="signup">
                <Link to="/signup">
                  <Button type="text" icon={<UserAddOutlined />} style={{ color: '#fff' }}>Sign Up</Button>
                </Link>
              </Menu.Item>
              <Menu.Item key="login">
                <Link to="/login">
                  <Button type="text" icon={<LoginOutlined />} style={{ color: '#fff' }}>Login</Button>
                </Link>
              </Menu.Item>
            </>
          )}
        </Menu>
      </Header>
    </Layout>
  );
}

export default Navbar;
