import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/auth.context';
import { Form, Input, Rate, Button, Alert } from 'antd';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';

function ReviewForm({ carId, refreshReviews }) {
  const { isLoggedIn } = useContext(AuthContext);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');


    if (!rating || rating < 1 || rating > 5) {
      setErrorMessage('Rating must be between 1 and 5.');
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        `${API_URL}/cars/${carId}/reviews`,
        { rating, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage('Review submitted successfully!');
      setRating(0);
      setComment('');

      refreshReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Failed to submit review. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return <Alert message="Please log in to leave a review." type="warning" showIcon />;
  }

  return (
    <div
      className="ReviewForm"
      style={{
        background: '#fff',
        padding: '20px',
        border: '1px solid #f0f0f0',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', 
        width: '80vw'
      }}
    >
      <h2>Leave a Review</h2>
      {errorMessage && <Alert message={errorMessage} type="error" showIcon style={{ marginBottom: '10px' }} />}
      {successMessage && <Alert message={successMessage} type="success" showIcon style={{ marginBottom: '10px' }} />}
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Rating:" required>
          <Rate value={rating} onChange={setRating} />
        </Form.Item>

        <Form.Item label="Comment:">
          <Input.TextArea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            maxLength={500}
            rows={4}
          />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </Form>
    </div>
  );
}

export default ReviewForm;
