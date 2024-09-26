import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/auth.context';

const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:5005'; 

function Reviews() {
  const { carId } = useParams(); 
  const [reviews, setReviews] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { user, isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${API_URL}/cars/${carId}/reviews`);
        setReviews(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setErrorMessage('Failed to load reviews. Please try again later.');
        setIsLoading(false);
      }
    };

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

  if (isLoading) return <p>Loading reviews...</p>;
  if (errorMessage) return <p style={{ color: 'red' }}>{errorMessage}</p>;

  return (
    <div className="CarReviews">
      <h2>Customer Reviews</h2>
      {reviews.length > 0 ? (
        <ul>
          {reviews.map((review) => (
            <li key={review._id} style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '10px' }}>
              <h4>
                {review.user?.username || 'Anonymous'} - Rating: {review.rating}/5
              </h4>
              <p>{review.comment || 'No comment provided.'}</p>
              <p style={{ fontSize: '0.85em', color: '#555' }}>
                Reviewed on {new Date(review.date).toLocaleDateString()}
              </p>
               {/* Show delete button only if the user is the author or an admin */}
               {isLoggedIn && (review.user._id === user?._id || user?.isAdmin) && (
                <button onClick={() => handleDeleteReview(review._id)} style={{ color: 'red' }}>
                  Delete Review
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews available for this car.</p>
      )}
    </div>
  );
}

export default Reviews;
