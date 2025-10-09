import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DriverLoginPage from "../pages/driver/DriverLoginPage";
import DriverDashboard from "../pages/driver/DriverDashboard";
import RideOfferPage from "../pages/driver/RideOfferPage";
import RideInProgressPage from "../pages/driver/RideInProgressPage";
import EarningsHistoryPage from "../pages/driver/EarningsHistoryPage";
import DriverProfilePage from "../pages/driver/DriverProfilePage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/driver/login" element={<DriverLoginPage />} />
        <Route path="/driver/dashboard" element={<DriverDashboard />} />
        <Route path="/driver/ride-offer" element={<RideOfferPage />} />
        <Route path="/driver/ride-in-progress" element={<RideInProgressPage />} />
        <Route path="/driver/earnings" element={<EarningsHistoryPage />} />
        <Route path="/driver/profile" element={<DriverProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}
