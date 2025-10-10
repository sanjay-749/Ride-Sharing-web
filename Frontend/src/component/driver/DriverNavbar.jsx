import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaBars, FaUserCircle } from "react-icons/fa";

export default function DriverNavbar({ driverName = "John Doe", driverEmail = "driver@example.com", onLogout, onSidebarToggle }) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-md px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      
      {/* Left: Toggle + Logo + Name */}
      <div className="flex items-center gap-3">
        {/* Sidebar Toggle */}
        <button
          onClick={onSidebarToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition mr-2"
        >
          <FaBars className="text-gray-700 text-xl" />
        </button>

        {/* Logo */}
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
          R
        </div>
        <span className="text-xl font-bold text-gray-800 tracking-wide">RideMart</span>
      </div>

      {/* Right: Profile Info */}
      <div className="flex items-center gap-4 relative">
        {/* Profile dropdown */}
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

          {/* Dropdown menu */}
          {profileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-36 bg-white shadow-lg rounded-xl p-2 flex flex-col gap-2 z-50"
            >
              <button
                onClick={onLogout}
                className="text-red-600 hover:bg-red-50 px-2 py-1 rounded transition font-medium"
              >
                Logout
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </nav>
  );
}
