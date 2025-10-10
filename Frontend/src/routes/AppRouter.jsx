// src/routes/AppRouter.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Driver Pages
import DriverLoginPage from "../pages/Driver/DriverLoginPage";
import DriverDashboard from "../pages/Driver/DriverDashboard";
import RideOfferPage from "../pages/Driver/RideOfferPage";
import RideInProgressPage from "../pages/Driver/RideInProgressPage";
import EarningsHistoryPage from "../pages/Driver/EarningsHistoryPage";
import DriverProfilePage from "../pages/Driver/DriverProfilePage";
import DriverSignupPage from "../pages/driver/DriverSignupPage";
export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Driver Routes */}
        <Route path="/driver/login" element={<DriverLoginPage />} />
        <Route path="/driver/signup" element={<DriverSignupPage />} />
        <Route path="/driver/dashboard" element={<DriverDashboard />} />
        <Route path="/driver/ride-offer" element={<RideOfferPage />} />
        <Route path="/driver/in-progress" element={<RideInProgressPage />} />
        <Route path="/driver/earnings" element={<EarningsHistoryPage />} />
        <Route path="/driver/profile" element={<DriverProfilePage />} />

        {/* Default route */}
        <Route path="*" element={<DriverLoginPage />} />
      </Routes>
    </Router>
  );
}
