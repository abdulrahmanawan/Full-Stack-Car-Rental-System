import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Cars from "./pages/Cars";
import AdminLayout from "./layouts/AdminLayout";
import DriverLayout from "./layouts/DriverLayout";
import Customers from "./pages/Customers";
import Bookings from "./pages/Bookings";
import Drivers from "./pages/Drivers";
import Payments from "./pages/Payments";
import Settings from "./pages/Settings";
import DriverDashboard from "./pages/DriverDashboard";
import DriverInvite from "./pages/DriverInvite";


const AdminProtected = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/login" replace />;
};


const DriverProtected = ({ children }) => {
  const token = localStorage.getItem("driverToken");
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      
      <Route path="/dashboard" element={<AdminProtected><AdminLayout><Dashboard /></AdminLayout></AdminProtected>} />
      <Route path="/cars" element={<AdminProtected><AdminLayout><Cars /></AdminLayout></AdminProtected>} />
      <Route path="/customers" element={<AdminProtected><AdminLayout><Customers /></AdminLayout></AdminProtected>} />
      <Route path="/bookings" element={<AdminProtected><AdminLayout><Bookings /></AdminLayout></AdminProtected>} />
      <Route path="/drivers" element={<AdminProtected><AdminLayout><Drivers /></AdminLayout></AdminProtected>} />
      <Route path="/payments" element={<AdminProtected><AdminLayout><Payments /></AdminLayout></AdminProtected>} />
      
      
      <Route path="/settings" element={<AdminProtected><AdminLayout><Settings /></AdminLayout></AdminProtected>} />


      <Route path="/driver/dashboard" element={<DriverProtected><DriverLayout><DriverDashboard /></DriverLayout></DriverProtected>} />
      <Route path="/driver/invite" element={<DriverInvite />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
