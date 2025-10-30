import React from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext.jsx";
import LoginForm from "../components/LoginForm.jsx";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAdmin();

  const handleLogin = async (credentials) => {
    const result = await login(credentials.email, credentials.password);
    if (result.success) {
      navigate("/dashboard");
    } else {
      alert(result.message || "Login failed. Try: admin / admin123");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <LoginForm onLogin={handleLogin} />
    </div>
  );
};

export default AdminLoginPage;