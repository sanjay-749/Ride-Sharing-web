import React from "react";
import { motion } from "framer-motion";
import { FaTachometerAlt, FaCarSide, FaHistory, FaUser } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", path: "/driver/dashboard", icon: <FaTachometerAlt /> },
  { name: "Ride Offers", path: "/driver/ride-offer", icon: <FaCarSide /> },
  { name: "Earnings", path: "/driver/earnings", icon: <FaHistory /> },
  { name: "Profile", path: "/driver/profile", icon: <FaUser /> },
];

export default function DriverSidebar({ isOpen }) {
  return (
    <motion.div
      animate={{ width: isOpen ? 250 : 70 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="bg-white shadow-lg h-full fixed top-0 left-0 z-40 flex flex-col overflow-hidden"
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 p-4 ${!isOpen && "justify-center"}`}>
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
          R
        </div>
        {isOpen && <span className="text-xl font-bold text-gray-800 tracking-wide">RideMart</span>}
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-2 mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-blue-100 hover:text-blue-700 transition duration-200 ${
                isActive ? "bg-blue-100 text-blue-700 shadow-md" : ""
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {isOpen && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>
    </motion.div>
  );
}
