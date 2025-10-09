import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [driver, setDriver] = useState(JSON.parse(localStorage.getItem("driver")) || null);
  const [token, setToken] = useState(localStorage.getItem("driverToken") || null);

  const login = (driverData, token) => {
    setDriver(driverData);
    setToken(token);
    localStorage.setItem("driver", JSON.stringify(driverData));
    localStorage.setItem("driverToken", token);
  };

  const logout = () => {
    setDriver(null);
    setToken(null);
    localStorage.removeItem("driver");
    localStorage.removeItem("driverToken");
  };

  return (
    <AuthContext.Provider value={{ driver, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
