import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/auth.context";
import { Layout, Menu, Button, Drawer } from 'antd';
import { HomeOutlined, UserOutlined, LoginOutlined, LogoutOutlined, UserAddOutlined, MenuOutlined } from '@ant-design/icons';
import '../styles/NavbarStyle.css';
const { Header } = Layout;

function Navbar() {
  const { isLoggedIn, logOutUser } = useContext(AuthContext);
  const [drawerVisible, setDrawerVisible] = useState(false); 

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const hideDrawer = () => {
    setDrawerVisible(false);
  };

  return (
    <Layout>
      <Header className="navbar-header">
        <div className="navbar-left">
          <Link to="/">
            <Button type="text" icon={<HomeOutlined />} style={{ color: '#fff' }}>Home</Button>
          </Link>
        </div>

        <div className="navbar-center">
          <Link to="/">
            <img src="/images/motorhub_logo.png" alt="Logo" className="navbar-logo" />
          </Link>
        </div>

        <div className="navbar-right">
          <Menu
            theme="dark"
            mode="horizontal"
            style={{ justifyContent: 'flex-end', borderBottom: 'none' }}
            className="navbar-menu"
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
        </div>

        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={showDrawer}
          className="navbar-hamburger"
        />

        <Drawer
          title="Menu"
          placement="right"
          onClose={hideDrawer}
          visible={drawerVisible}
        >
          <Menu mode="vertical" theme="dark" onClick={hideDrawer}>
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
        </Drawer>
      </Header>
    </Layout>
  );
}

export default Navbar;
