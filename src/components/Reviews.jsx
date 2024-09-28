import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/auth.context';
import ReviewForm from './ReviewForm';
import { Card, Button, Typography, Spin, Alert, List, Rate } from 'antd';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
const { Title, Text } = Typography;

function Reviews() {
  const { carId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { user, isLoggedIn } = useContext(AuthContext);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/cars/${carId}/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setErrorMessage('Failed to load reviews. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [carId]);

  const handleDeleteReview = async (reviewId) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${API_URL}/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the deleted review from the state
      setReviews((prevReviews) => prevReviews.filter((review) => review._id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
      setErrorMessage('Failed to delete review. Please try again.');
    }
  };

  if (isLoading) return <Spin size="large" style={{ display: 'block', margin: '20px auto' }} />;
  if (errorMessage) return <Alert message={errorMessage} type="error" showIcon style={{ marginBottom: '20px' }} />;

  return (
    <div className="CarReviews" style={{ padding: '20px' }}>
      <ReviewForm carId={carId} refreshReviews={fetchReviews} />
      <Title level={2} style={{ marginBottom: '20px' }}>Customer Reviews</Title>
      {reviews.length > 0 ? (
        <List
          itemLayout="vertical"
          dataSource={reviews}
          renderItem={(review) => (
            <Card
              key={review._id}
              style={{ marginBottom: '20px' }}
              actions={
                isLoggedIn && (review.user._id === user?._id || user?.isAdmin)
                  ? [
                      <Button
                        type="link"
                        onClick={() => handleDeleteReview(review._id)}
                        danger
                        style={{ paddingLeft: 0 }}
                      >
                        Delete Review
                      </Button>,
                    ]
                  : []
              }
            >
              <Card.Meta
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong>{review.user?.username || 'Anonymous'}</Text>
                    <Rate disabled defaultValue={review.rating} />
                  </div>
                }
                description={
                  <>
                    <p>{review.comment || 'No comment provided.'}</p>
                    <Text type="secondary" style={{ fontSize: '0.85em' }}>
                      Reviewed on {new Date(review.date).toLocaleDateString()}
                    </Text>
                  </>
                }
              />
            </Card>
          )}
        />
      ) : (
        <Alert message="No reviews available for this car." type="info" showIcon />
      )}
    </div>
  );
}

export default Reviews;
