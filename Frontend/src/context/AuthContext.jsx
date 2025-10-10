import React, { createContext, useState, useEffect } from "react";
import { loginDriver, getDriverProfile } from "../services/driverService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [driver, setDriver] = useState(
    JSON.parse(localStorage.getItem("driver")) || null
  );
  const [token, setToken] = useState(localStorage.getItem("driverToken") || null);

  // login wrapper
  const login = async (email, password) => {
    const data = await loginDriver({ email, password });
    if (data?.token) {
      localStorage.setItem("driverToken", data.token);
      localStorage.setItem("driver", JSON.stringify(data.driver));
      setToken(data.token);
      setDriver(data.driver);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem("driverToken");
    localStorage.removeItem("driver");
    setToken(null);
    setDriver(null);
  };

  const refreshProfile = async () => {
    try {
      const profile = await getDriverProfile();
      localStorage.setItem("driver", JSON.stringify(profile));
      setDriver(profile);
      return profile;
    } catch (err) {
      console.error("refreshProfile", err);
      return null;
    }
  };

  useEffect(() => {
    if (token && !driver) {
      // try refresh once
      refreshProfile();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ driver, token, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
