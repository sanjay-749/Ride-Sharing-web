import React from "react";
import { Navigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext.jsx";

const ProtectedRoute = ({ children }) => {
  const { admin } = useAdmin();

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;