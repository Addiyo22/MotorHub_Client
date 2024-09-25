import { useContext } from 'react';
import { AuthContext } from '../context/auth.context'; 
import { Link } from 'react-router-dom';

function UserDashboard() {
  const { user, isLoggedIn } = useContext(AuthContext);
  const checkAdmin = user?.isAdmin; 
  const userId = user?._id;

  return (
    <div>
      {isLoggedIn && checkAdmin &&(
        <>       
          <h1>Welcome to the Admin Dashboard, {user?.name}!</h1>
          <Link to="/admin/new-car"> <button>create car</button> </Link> 
          <Link to={"/user/configurations"}><button>My Configurations</button></Link>
          <Link to={`/user/${userId}/orders`}><button>My Orders</button></Link>
          <Link to="/cars"> <button>View Cars</button> </Link> 
          <Link to="/admin/orders"> <button>View Orders</button> </Link>
          <Link to="/admin/signup"> <button>Create new Admin</button> </Link>
          <Link to="/inventory"> <button>View Inventory</button> </Link>
          <Link to="/admin/users"> <button>View Users</button> </Link>
        </>
      )}

      {isLoggedIn && !checkAdmin &&(
        <>
          <h1>Welcome to Your Dashboard, {user?.name}!</h1>
          <Link to={"/user/configurations"}><button>My Configurations</button></Link>
          <Link to={`/user/${userId}/orders`}><button>My Orders</button></Link>
          <Link to="/cars"> <button>Configure Car</button> </Link>
          <Link to="/inventory"> <button>View Inventory</button> </Link>
        </>
      )}
    </div>
  );
}

export default UserDashboard;