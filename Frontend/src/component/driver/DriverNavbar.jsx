import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function DriverNavbar({ onSidebarToggle }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [driver, setDriver] = useState({ name: "", email: "" });
  const navigate = useNavigate();

  // Fetch driver info from localStorage
  useEffect(() => {
    try {
      const storedDriver = localStorage.getItem("driverInfo");
      if (storedDriver && storedDriver !== "undefined") {
        setDriver(JSON.parse(storedDriver));
      }
    } catch (error) {
      console.error("Failed to parse driver info:", error);
      localStorage.removeItem("driverInfo");
    }
  }, []);

  const driverName = driver?.name || "Driver";
  const driverEmail = driver?.email || "driver@example.com";
  const initials = driverName
    ? driverName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "D";

  const handleLogout = () => {
    // Clear all driver-related localStorage
    localStorage.removeItem("driverToken");
    localStorage.removeItem("driverInfo");
    localStorage.removeItem("currentRide");

    // Redirect to driver login page
    navigate("/driver/login", { replace: true });
  };

  return (
    <nav className="w-full bg-white shadow-md px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      {/* Left: Sidebar toggle + Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={onSidebarToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <FaBars className="text-gray-700 text-xl" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
            {initials}
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-gray-800 font-semibold text-sm">{driverName}</span>
            <span className="text-gray-500 text-xs">{driverEmail}</span>
          </div>
        </div>
      </div>

      {/* Right: Profile Dropdown */}
      <div className="relative">
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-xl hover:bg-gray-200 transition"
        >
          <FaUserCircle className="text-2xl text-gray-700" />
          <div className="hidden md:flex flex-col text-left">
            <span className="text-sm font-semibold text-gray-800">{driverName}</span>
            <span className="text-xs text-gray-500">{driverEmail}</span>
          </div>
        </button>

        <AnimatePresence>
          {profileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-xl p-3 flex flex-col gap-2 z-50"
            >
              <div className="flex flex-col border-b pb-2 mb-2">
                <span className="text-gray-800 font-semibold">{driverName}</span>
                <span className="text-gray-500 text-sm">{driverEmail}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:bg-red-50 px-2 py-1 rounded transition font-medium text-center"
              >
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
