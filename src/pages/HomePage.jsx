import { useState, useEffect } from 'react';
import axios from 'axios';
import { Carousel, Layout, Typography, Spin, Button } from 'antd';
import VideoPlayer from '../components/VideoPlayer';
import { Link } from 'react-router-dom';

const { Content, Footer } = Layout;
const { Title } = Typography;

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';

function HomePage() {
  const [carImages, setCarImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch car images from the API
  useEffect(() => {
    const fetchCarImages = async () => {
      try {
        const response = await axios.get(`${API_URL}/cars/images`); // Ensure this endpoint returns all car images
        const images = response.data.flatMap(car => car.images); // Flatten to get all images from the cars
        setCarImages(images);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching car images:', error);
        setLoading(false);
      }
    };

    fetchCarImages();
  }, []);

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5', display: 'flex', flexDirection: 'column' }}>
      <Content style={{ padding: '20px 50px', textAlign: 'center', flex: 1 }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '20px', color: '#002766', paddingTop: '30px' }}>
          Welcome to MotorHub
        </Title>
        <VideoPlayer />
        <Title level={3} style={{ color: '#002766', marginTop: '30px', marginBottom: '20px' }}>
          Explore Our Car Collection
        </Title>
        {loading ? (
          <Spin size="large" />
        ) : (
          <>
            <Carousel autoplay dotPosition="bottom" style={{ maxWidth: '1200px', margin: '20px auto', borderRadius: '10px', overflow: 'hidden' }}>
              {carImages.length > 0 ? (
                carImages.map((image, index) => (
                  <div
                    key={index}
                    style={{
                      height: '500px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      overflow: 'hidden',
                      borderRadius: '10px',
                    }}
                  >
                    <img
                      src={image}
                      alt={`Car Image ${index + 1}`}
                      style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }}
                    />
                  </div>
                ))
              ) : (
                <div style={{ height: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }}>
                  <Typography.Text>No Images Available</Typography.Text>
                </div>
              )}
            </Carousel>
            <Link to="/cars">
              <Button type="primary" size="large" style={{ marginTop: '20px' }}>
                View All Cars
              </Button>
            </Link>
          </>
        )}
      </Content>
      <Footer style={{ textAlign: 'center', backgroundColor: '#002766', color: '#fff' }}>
        ©2024 MotorHub
      </Footer>
    </Layout>
  );
}

export default HomePage;
