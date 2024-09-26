import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/auth.context';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005'; 

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const { user, isLoggedIn } = useContext(AuthContext);
  const isAdmin = user?.isAdmin; 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${API_URL}/admin/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setErrorMessage('Failed to load users. Please try again later.');
      }
    };

    if (isAdmin) {
      fetchUsers();
    } else {
      setErrorMessage('Access denied. Admins only.');
    }
  }, [isAdmin]);

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${API_URL}/admin/users/${userId}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      alert('User deleted successfully.');
    } catch (error) {
      console.error('Error deleting user:', error);
      setErrorMessage('Failed to delete the user. Please try again.');
    }
  };

  if (!isLoggedIn || !isAdmin) {
    return <p>Access denied. Admins only.</p>;
  }

  return (
    <div className="AdminUserManagement">
      <h1>User Management</h1>
      {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <h3>{user.username} ({user.email})</h3>
            <p>Name: {user.name}</p>
            <p>Role: {user.isAdmin ? 'Admin' : 'User'}</p>
            <button onClick={() => handleDeleteUser(user._id)} style={{ color: 'red' }}>
              Delete User
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserManagement;
