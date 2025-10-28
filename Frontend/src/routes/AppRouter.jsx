import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/user/HomePage";
import LoginPage from "../pages/user/LoginPage";
import SignupPage from "../pages/user/SignupPage";
import TrackRidePage from "../pages/user/TrackRidePage";
import BookRidePage from "../pages/user/BookRidePage";
import RideHistoryPage from "../pages/user/RideHistoryPage";
import PostRidePage from "../pages/user/PostRidePage";
import UserProfilePage from "../pages/user/UserProfilepage";
import HelpSupportPage from "../pages/user/HelpSupportPage";
import NotFoundPage from "../pages/common/NotFoundPage";
import PaymentPage from "../pages/user/PaymentPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/book-ride" element={<BookRidePage />} />
        <Route path="/track" element={<TrackRidePage />} />
        <Route path="/post-ride" element={<PostRidePage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/history" element={<RideHistoryPage />} />
        <Route path="/help" element={<HelpSupportPage />} />
        <Route path="/profile" element={<UserProfilePage />} /> {/* Now public */}

        {/* --- Not Found Route --- */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
