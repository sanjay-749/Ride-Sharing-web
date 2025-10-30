import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ✅ Folder name is 'driver' (lowercase), file names start with capital 'D'
import DriverLoginPage from "../pages/driver/DriverLoginPage";
import DriverDashboard from "../pages/driver/DriverDashboard";
import RideOfferPage from "../pages/driver/RideOfferPage";
import RideInProgressPage from "../pages/driver/RideInProgressPage";
import EarningsHistoryPage from "../pages/driver/EarningsHistoryPage";
import DriverProfilePage from "../pages/driver/DriverProfilePage";
import DriverSignupPage from "../pages/driver/DriverSignupPage";

// Common
import NotFoundPage from "../pages/common/NotFoundPage";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Driver Routes */}
        <Route path="/" element={<DriverLoginPage />} />
        <Route path="/driver/login" element={<DriverLoginPage />} />
        <Route path="/driver/signup" element={<DriverSignupPage />} />
        <Route path="/driver/dashboard" element={<DriverDashboard />} />
        <Route path="/driver/ride-offer" element={<RideOfferPage />} />
        <Route path="/driver/RideInProgressPage" element={<RideInProgressPage />} />
        <Route path="/driver/earnings" element={<EarningsHistoryPage />} />
        <Route path="/driver/profile" element={<DriverProfilePage />} />

        {/* Default route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}