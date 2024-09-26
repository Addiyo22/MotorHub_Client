import { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/auth.context';

const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:5005'; 

function ReviewForm() {
  const { carId } = useParams(); // Get the car ID from the route parameters
  const { user, isLoggedIn } = useContext(AuthContext); // Use the Auth context to check if the user is logged in
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      setErrorMessage('Rating must be between 1 and 5.');
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        `${API_URL}/cars/${carId}/reviews`,
        { rating, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage('Review submitted successfully!');
      setRating('');
      setComment('');
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
    return <p>Please log in to leave a review.</p>;
  }

  return (
    <div className="ReviewForm">
      <h2>Leave a Review</h2>
      <form onSubmit={handleSubmit}>
        <label>Rating:</label>
        <select value={rating} onChange={(e) => setRating(e.target.value)} required>
          <option value="">Select Rating</option>
          <option value="1">1 - Poor</option>
          <option value="2">2 - Fair</option>
          <option value="3">3 - Good</option>
          <option value="4">4 - Very Good</option>
          <option value="5">5 - Excellent</option>
        </select>

        <label>Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
          maxLength="500"
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>

      {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p className="success-message" style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
}

export default ReviewForm;
