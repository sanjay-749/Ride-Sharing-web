import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import ManageUsers from '../pages/ManageUsers';
import ManageDrivers from '../pages/ManageDrivers';
import ManageRides from '../pages/ManageRides';
import Reports from '../pages/Reports';
import Login from '../pages/Login';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function AppRouter() {
  const isLoggedIn = true; // replace with real auth logic

  return (
    <Router>
      {isLoggedIn ? (
        <div className="app-container" style={{ display: 'flex' }}>
          <Sidebar />
          <div style={{ flex: 1, padding: '20px' }}>
            <Header />
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<ManageUsers />} />
              <Route path="/drivers" element={<ManageDrivers />} />
              <Route path="/rides" element={<ManageRides />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}
