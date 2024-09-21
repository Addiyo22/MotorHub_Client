import { useContext } from 'react';
import { AuthContext } from '../context/auth.context'; 
import { Link } from 'react-router-dom';

function UserDashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1>Welcome to Your Dashboard, {user?.name}!</h1>
      <Link to="/admin/new-car"> <button>create car</button> </Link> 
    </div>
  );
}

export default UserDashboard;