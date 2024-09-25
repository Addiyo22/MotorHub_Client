import "./App.css";
import SignupPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import UserDashboard from "./pages/UserDashboard";
import CarCreationPage from "./pages/CarCreationPage";
import HomePage from "./pages/HomePage";
import IsAdmin from "./components/isAdmin";
import IsAnon from "./components/IsAnon";
import IsPrivate from "./components/IsPrivate";
import { Routes, Route } from "react-router-dom";
import CarListPage from "./pages/CarListPage";
import CarPage from "./pages/CarPage";
import CarConfigurationPage from "./pages/CarConfigurationPage";
import ConfigurationsPage from "./pages/ConfigurationsPage";
import OrdersPage from "./pages/OrdersPage";
import InventoryPage from "./pages/InventoryPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminSignUp from "./pages/AdminSignUp";
import CarEditingPage from "./pages/CarCreationPage";
import UserManagement from "./pages/UsersManagementPage";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/admin/users" element={ <IsAdmin> <UserManagement /> </IsAdmin> } />
        <Route path="/admin/editCar/:carId" element={ <IsAdmin> <CarEditingPage /> </IsAdmin> } />
        <Route path="/admin/signup" element={ <IsAdmin> <AdminSignUp /> </IsAdmin> } />
        <Route path="/admin/orders" element={ <IsAdmin> <AdminOrdersPage /> </IsAdmin> } />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/user/:userId/orders" element={<IsPrivate><OrdersPage /></IsPrivate>} />
        <Route path="/user/configurations" element={<IsPrivate><ConfigurationsPage /></IsPrivate>} />
        <Route path="/cars/:carId/configure" element={<IsPrivate><CarConfigurationPage /></IsPrivate>} />
        <Route path="/cars/:carId" element={<CarPage />} />
        <Route path="/admin/new-car" element={<IsAdmin><CarCreationPage /></IsAdmin>} />
        <Route path="/cars" element={ <CarListPage />} />
        <Route path="/" element={ <HomePage />} />
        <Route path="/signup" element={<IsAnon> <SignupPage /> </IsAnon>} />
        <Route path="/login" element={<IsAnon> <LoginPage /></IsAnon> } />
        <Route path="/dashboard" element={ <IsPrivate> <UserDashboard /> </IsPrivate> } />
      </Routes>
    </div>
  );
}
export default App;

