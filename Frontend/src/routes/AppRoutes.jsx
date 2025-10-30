import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext.jsx";
import AdminLoginPage from "../pages/AdminLoginPage.jsx";
import DashboardHome from "../components/DashboardHome.jsx";
import UsersPage from "../pages/UsersPage.jsx";
import DriversPage from "../pages/DriversPage.jsx";
import PendingDriversPage from "../pages/PendingDriversPage.jsx";
import AdminProfilePage from "../pages/AdminProfilePage.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

const AppRoutes = () => {
  const { admin, loading } = useAdmin();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={<Navigate to={admin ? "/dashboard" : "/login"} replace />} 
      />
      <Route 
        path="/login" 
        element={admin ? <Navigate to="/dashboard" replace /> : <AdminLoginPage />} 
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <UsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/drivers"
        element={
          <ProtectedRoute>
            <DriversPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pending-drivers"
        element={
          <ProtectedRoute>
            <PendingDriversPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AdminProfilePage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;