import "./App.css";
import SignupPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import UserDashboard from "./pages/UserDashboard";
import CarCreationPage from "./pages/CarCreationPage";
import HomePage from "./components/HomePage";
import IsAnon from "./components/IsAnon";
import IsPrivate from "./components/IsPrivate";
import { Routes, Route } from "react-router-dom";
import CarListPage from "./pages/CarListPage";
import CarPage from "./pages/CarPage";
import CarConfigurationPage from "./pages/CarConfigurationPage";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>      
        <Route path="/cars/:carId/configure" element={<CarConfigurationPage />} />
        <Route path="/cars/:carId" element={<CarPage />} />
        <Route path="/admin/new-car" element={<CarCreationPage />} />
        <Route path="/cars" element={ <CarListPage />} />
        <Route path="/" element={ <HomePage />} />
        <Route path="/signup" element={ <SignupPage /> } />
        <Route path="/login" element={ <LoginPage /> } />
        <Route path="/dashboard" element={ <IsPrivate> <UserDashboard /> </IsPrivate> } />
      </Routes>
    </div>
  );
}
export default App;

