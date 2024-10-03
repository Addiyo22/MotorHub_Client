import { useState, useEffect } from 'react';
import axios from 'axios';
import { Carousel, Layout, Typography, Spin, Button, Alert, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';  // Your existing video player component
import '../styles/HomePageStyle.css'

const { Content, Footer } = Layout;
const { Title } = Typography;

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';

function HomePage() {
  const [carImages, setCarImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch car images from the API
  useEffect(() => {
    const fetchCarImages = async () => {
      try {
        const response = await axios.get(`${API_URL}/cars/images`);
        const images = response.data.flatMap(car => car.images);
        setCarImages(images);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching car images:', error);
        setError('Failed to load car images. Please try again later.');
        setLoading(false);
      }
    };

    fetchCarImages();
  }, []);

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5', display: 'flex', flexDirection: 'column' }}>
      <Content style={{ padding: '20px 10px', textAlign: 'center', flex: 1 }}>
        <Title level={2} className="home-title">
          Welcome to MotorHub
        </Title>

        {/* Custom Video Player */}
        <div className="video-container">
          <VideoPlayer />
        </div>

        {/* Section to display YouTube videos */}
        <Title level={3} className="explore-title">
          Check Some of "Our" Cool Car Reviews
        </Title>
        <Row gutter={[16, 16]} justify="center" style={{backgroundColor: 'black', padding: '20px 0'}}>
          <Col xs={24} md={12}>
            <div className="youtube-video">
              <iframe
                width="80%"
                height="315"
                src="https://www.youtube.com/embed/yiQ-af3qdZ4"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="youtube-video">
              <iframe
                width="80%"
                height="315"
                src="https://www.youtube.com/embed/_wxaYP0Nx4k"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="youtube-video">
              <iframe
                width="80%"
                height="315"
                src="https://www.youtube.com/embed/DpjxOSNTMzg"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="youtube-video">
              <iframe
                width="80%"
                height="315"
                src="https://www.youtube.com/embed/Jypwbla8HJI"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </Col>
        </Row>

        <Title level={3} className="explore-title">
          Explore Our Car Collection
        </Title>
        {loading ? (
          <Spin size="large" />
        ) : error ? (
          <Alert message={error} type="error" showIcon />
        ) : (
          <>
            <Carousel autoplay dotPosition="bottom" className="carousel-container">
              {carImages.length > 0 ? (
                carImages.map((image, index) => (
                  <div
                    key={index}
                    className="carousel-item"
                  >
                    <img
                      src={image}
                      alt={`Car Image ${index + 1}`}
                      className="carousel-image"
                    />
                  </div>
                ))
              ) : (
                <div className="carousel-placeholder">
                  <Typography.Text>No Images Available</Typography.Text>
                </div>
              )}
            </Carousel>

            {/* Links to Inventory and Compare Car Pages */}
            <div style={{ marginTop: '20px' }}>
              <Link to="/inventory">
                <Button type="primary" size="large" style={{ marginRight: '10px' }}>
                  Go to Inventory
                </Button>
              </Link>
              <Link to="/compare">
                <Button type="default" size="large">
                  Compare Cars
                </Button>
              </Link>
            </div>
          </>
        )}
      </Content>

      <Footer className="footer">
        ©2024 MotorHub
      </Footer>
    </Layout>
  );
}

export default HomePage;
