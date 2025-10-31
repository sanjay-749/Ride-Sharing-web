import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ==== USER PAGES ====
import LandingPage from "../pages/common/LandingPage";
import HomePage from "../pages/user/HomePage";
import LoginPage from "../pages/user/LoginPage";
import SignupPage from "../pages/user/SignupPage";
import TrackRidePage from "../pages/user/TrackRidePage";
import BookRidePage from "../pages/user/BookRidePage";
import RideHistoryPage from "../pages/user/RideHistoryPage";
import PostRidePage from "../pages/user/PostRidePage";
import UserProfilePage from "../pages/user/UserProfilepage";
import HelpSupportPage from "../pages/user/HelpSupportPage";
import PaymentPage from "../pages/user/PaymentPage";

// ==== DRIVER PAGES ====
import DriverLoginPage from "../pages/driver/DriverLoginPage";
import DriverSignupPage from "../pages/driver/DriverSignupPage";
import DriverDashboard from "../pages/driver/DriverDashboard";
import RideOfferPage from "../pages/driver/RideOfferPage";
import RideInProgressPage from "../pages/driver/RideInProgressPage";
import EarningsHistoryPage from "../pages/driver/EarningsHistoryPage";
import DriverProfilePage from "../pages/driver/DriverProfilePage";

// ==== COMMON ====
import NotFoundPage from "../pages/common/NotFoundPage";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* ===== USER ROUTES ===== */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/uhome" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/book-ride" element={<BookRidePage />} />
        <Route path="/track" element={<TrackRidePage />} />
        <Route path="/post-ride" element={<PostRidePage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/history" element={<RideHistoryPage />} />
        <Route path="/help" element={<HelpSupportPage />} />
        <Route path="/profile" element={<UserProfilePage />} />

        {/* ===== DRIVER ROUTES ===== */}
        <Route path="/driver/login" element={<DriverLoginPage />} />
        <Route path="/driver/signup" element={<DriverSignupPage />} />
        <Route path="/driver/dashboard" element={<DriverDashboard />} />
        <Route path="/driver/ride-offer" element={<RideOfferPage />} />
        <Route path="/driver/in-progress" element={<RideInProgressPage />} />
        <Route path="/driver/earnings" element={<EarningsHistoryPage />} />
        <Route path="/driver/profile" element={<DriverProfilePage />} />

        {/* ===== NOT FOUND ===== */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
