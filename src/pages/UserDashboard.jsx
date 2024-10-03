import { useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import { Link } from 'react-router-dom';
import { Layout, Button, Typography, Row, Col, Card } from 'antd';
import { PlusCircleOutlined, CarOutlined, ShoppingCartOutlined, UserOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import '../styles/DashboardStyles.css'; 

const { Content, Footer } = Layout;
const { Title } = Typography;

const images = {
  createCar: '/images/createcar.webp', 
  configurations: '/images/vecteezy_gear-mechanism-and-settings-vector-icon_5693230.jpg',
  compareCars: '/images/3_(11).jpg',
  myOrders: '/images/vecteezy_shopping-cart-icon-vector-illustration_.jpg',
  viewCars: '/images/vecteezy_binoculars-icon-template-black-color-editable_6692502.jpg',
  viewOrders: '/images/vecteezy_shopping-cart-set-of-shopping-cart-icon-on-white_9157885.jpg',
  createAdmin: '/images/vecteezy_job-application-vector-icon-design_15981725.jpg',
  viewInventory: '/images/vecteezy_delivery-vector-icon-design_16595976.jpg',
  viewUsers: '/images/vecteezy_view-icon-in-trendy-outline-style-isolated-on-white_31692893.jpg',
  editProfile: '/images/editProfile.avif',
};

function UserDashboard() {
  const { user, isLoggedIn } = useContext(AuthContext);
  const checkAdmin = user?.isAdmin;
  const userId = user?._id;

  // Updated dashboard items with image paths
  const dashboardItems = [
    {
      link: `/profile/${userId}/edit`,
      icon: <AppstoreAddOutlined style={{ fontSize: '24px' }} />,
      text: "Edit Profile",
      image: images.editProfile,
    },
    {
      link: "/admin/new-car",
      icon: <PlusCircleOutlined style={{ fontSize: '24px' }} />,
      text: "Create Car",
      adminOnly: true,
      image: images.createCar,
    },
    {
      link: "/user/configurations",
      icon: <AppstoreAddOutlined style={{ fontSize: '24px' }} />,
      text: "My Configurations",
      adminOnly: false,
      image: images.configurations,
    },
    {
      link: "/compare",
      icon: <AppstoreAddOutlined style={{ fontSize: '24px' }} />,
      text: "Compare Cars",
      image: images.compareCars,
    },
    {
      link: `/user/${userId}/orders`,
      icon: <ShoppingCartOutlined style={{ fontSize: '24px' }} />,
      text: "My Orders",
      adminOnly: false,
      image: images.myOrders,
    },
    {
      link: "/cars",
      icon: <CarOutlined style={{ fontSize: '24px' }} />,
      text: checkAdmin ? "View Cars" : "Configure Car",
      image: images.viewCars,
    },
    {
      link: "/admin/orders",
      icon: <ShoppingCartOutlined style={{ fontSize: '24px' }} />,
      text: "View Orders",
      adminOnly: true,
      image: images.viewOrders,
    },
    {
      link: "/admin/signup",
      icon: <UserOutlined style={{ fontSize: '24px' }} />,
      text: "Create New Admin",
      adminOnly: true,
      image: images.createAdmin,
    },
    {
      link: "/inventory",
      icon: <CarOutlined style={{ fontSize: '24px' }} />,
      text: "View Inventory",
      image: images.viewInventory,
    },
    {
      link: "/admin/users",
      icon: <UserOutlined style={{ fontSize: '24px' }} />,
      text: "View Users",
      adminOnly: true,
      image: images.viewUsers,
    },
  ];

  return (
    <Layout className="dashboard-layout" style={{ padding: '40px', backgroundColor: '#f0f2f5' }}>
      <Content className="dashboard-content">
        {isLoggedIn && (
          <>
            <Title level={2} style={{ textAlign: 'center', marginBottom: '40px', color: '#002766' }}>
              Welcome {checkAdmin ? "Admin" : "User"}, {`${user?.firstname} ${user?.lastname}`}!
            </Title>

            <Row gutter={[24, 24]} justify="center">
              {dashboardItems
                .filter((item) => !item.adminOnly || checkAdmin)
                .map((item, index) => (
                  <Col key={index} xs={24} sm={12} md={8} lg={6}>
                    <Card
                      hoverable
                      className="dashboard-card"
                      style={{
                        borderRadius: '12px',
                        textAlign: 'center',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#fff',
                        transition: 'all 0.3s ease',
                      }}
                      cover={
                        <img
                          alt={item.text}
                          src={item.image}
                          style={{ height: '200px', objectFit: 'cover', borderRadius: '12px 12px 0 0' }}
                        />
                      }
                    >
                      <Link to={item.link} className="dashboard-link">
                        <Button
                          type="primary"
                          icon={item.icon}
                          block
                          size="large"
                          style={{ borderRadius: '8px', fontSize: '16px', fontWeight: 'bold' }}
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
      <Footer className="footer">
        ©2024 MotorHub
      </Footer>
    </Layout>
    
  );
}

export default UserDashboard;
