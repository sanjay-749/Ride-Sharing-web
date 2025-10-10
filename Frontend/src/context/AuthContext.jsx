// src/context/AuthContext.jsx
import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [driver, setDriver] = useState(JSON.parse(localStorage.getItem("driver")) || null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const login = (driverData, jwt) => {
    setDriver(driverData);
    setToken(jwt);
    localStorage.setItem("driver", JSON.stringify(driverData));
    localStorage.setItem("token", jwt);
  };

  const logout = () => {
    setDriver(null);
    setToken(null);
    localStorage.removeItem("driver");
    localStorage.removeItem("token");
  };

  const refreshProfile = async () => {
    // call backend to refresh driver profile if needed
  };

  return (
    <AuthContext.Provider value={{ driver, token, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
