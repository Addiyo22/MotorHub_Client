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
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'fixed', // Fixes the navbar at the top
          top: 0,
          width: '100%',
          zIndex: 1000, // Ensures the navbar is always on top of other content
        }}
      >
        <Link to="/">
          <Button type="text" icon={<HomeOutlined />} style={{ color: '#fff' }}>Home</Button>
        </Link>
        <Menu
          theme="dark"
          mode="horizontal"
          style={{ flex: 1, justifyContent: 'flex-end', borderBottom: 'none' }}
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
