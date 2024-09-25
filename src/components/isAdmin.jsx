// src/components/IsPrivate.jsx

import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { Navigate } from "react-router-dom";

function IsAdmin( { children } ) {
  
  const { isLoggedIn, isLoading, isAdmin } = useContext(AuthContext);
 
  if (isLoading) return <p>Loading ...</p>;

  if (!isLoggedIn || !isAdmin) {

    return <Navigate to="/login" />;
  } else {
    return children;
  }
}

export default IsAdmin;
