import { Link } from "react-router-dom";
import { useContext } from "react";                     
import { AuthContext } from "../context/auth.context"; 
import { Breadcrumb, Layout, Menu, theme } from 'antd';
const { Header, Content, Footer, Sider } = Layout; 

function Navbar() {

  const { isLoggedIn, logOutUser } = useContext(AuthContext);   

  return (
    <Layout>
    <Header>
    <nav>
      <Link to="/">
        <button>Home</button>
      </Link>

      {isLoggedIn && (
        <>       
            <Link to="/dashboard"> <button>Profile</button> </Link>  
            <button onClick={logOutUser}>Logout</button>
        </>
      )}

      {!isLoggedIn && (
        <>
          <Link to="/signup"> <button>Sign Up</button> </Link>
          <Link to="/login"> <button>Login</button> </Link>
          
        </>
      )}
    </nav>
    </Header>
    </Layout>
  );
}

export default Navbar;
