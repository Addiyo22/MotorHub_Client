// UserDashboard.jsx
import { useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import { Link } from 'react-router-dom';
import { Layout, Button, Typography, Row, Col, Card } from 'antd';
import { PlusCircleOutlined, CarOutlined, ShoppingCartOutlined, UserOutlined, AppstoreAddOutlined } from '@ant-design/icons'; // Importing Ant Design icons
import '../styles/DashboardStyles.css'; // Import the CSS file for additional styling

const { Content } = Layout;
const { Title } = Typography;

function UserDashboard() {
  const { user, isLoggedIn } = useContext(AuthContext);
  const checkAdmin = user?.isAdmin;
  const userId = user?._id;

  const dashboardItems = [
    {
      link: "/admin/new-car",
      icon: <PlusCircleOutlined />,
      text: "Create Car",
      adminOnly: true,
    },
    {
      link: "/user/configurations",
      icon: <AppstoreAddOutlined />,
      text: "My Configurations",
    },
    {
      link: `/user/${userId}/orders`,
      icon: <ShoppingCartOutlined />,
      text: "My Orders",
    },
    {
      link: "/cars",
      icon: <CarOutlined />,
      text: checkAdmin ? "View Cars" : "Configure Car",
    },
    {
      link: "/admin/orders",
      icon: <ShoppingCartOutlined />,
      text: "View Orders",
      adminOnly: true,
    },
    {
      link: "/admin/signup",
      icon: <UserOutlined />,
      text: "Create New Admin",
      adminOnly: true,
    },
    {
      link: "/inventory",
      icon: <CarOutlined />,
      text: "View Inventory",
    },
    {
      link: "/admin/users",
      icon: <UserOutlined />,
      text: "View Users",
      adminOnly: true,
    },
  ];

  return (
    <Layout className="dashboard-layout">
      <Content className="dashboard-content">
        {isLoggedIn && (
          <>
            <Title level={2} className="dashboard-title">
              Welcome to {checkAdmin ? "the Admin Dashboard" : "Your Dashboard"}, {user?.name}!
            </Title>
            <Row gutter={[16, 16]} justify="center">
              {dashboardItems
                .filter((item) => !item.adminOnly || checkAdmin) // Show admin-only items only for admins
                .map((item, index) => (
                  <Col key={index} xs={24} sm={12} md={8} lg={6}>
                    <Card
                      hoverable
                      className="dashboard-card"
                      cover={
                        <img
                          alt={item.text}
                          src={`https://via.placeholder.com/150`} // Placeholder image; replace with actual images if available
                          style={{ borderRadius: '8px' }}
                        />
                      }
                    >
                      <Link to={item.link} className="dashboard-link">
                        <Button
                          type="primary"
                          icon={item.icon}
                          block
                          className="dashboard-button"
                          size="large"
                        >
                          {item.text}
                        </Button>
                      </Link>
                    </Card>
                  </Col>
                ))}
            </Row>
          </>
        )}
      </Content>
    </Layout>
  );
}

export default UserDashboard;
