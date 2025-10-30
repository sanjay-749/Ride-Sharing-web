import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check existing login on mount
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const adminData = localStorage.getItem("adminData");
    
    if (token && adminData) {
      setAdmin(JSON.parse(adminData));
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  // Login Function
  const login = async (username, password) => {
    try {
      const response = await axios.post("http://localhost:8080/api/auth/admin/login", {
        username,
        password,
      });
      
      if (response.data.token) {
        const adminData = {
          id: response.data.user?.id,
          username: response.data.user?.username,
          role: response.data.user?.role
        };
        
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("adminData", JSON.stringify(adminData));
        
        // Set default authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        setAdmin(adminData);
        return { success: true, data: response.data };
      }
      throw new Error("Invalid response from server");
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.error || error.message || "Login failed";
      return { success: false, message: errorMessage };
    }
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    delete axios.defaults.headers.common['Authorization'];
    setAdmin(null);
  };

  return (
    <AdminContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};