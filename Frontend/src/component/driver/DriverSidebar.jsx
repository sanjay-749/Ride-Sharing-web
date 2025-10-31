import React, { useContext, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FaTachometerAlt,
  FaCarSide,
  FaHistory,
  FaUser,
  FaRoute,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { RideContext } from "../../context/RideContext";

export default function DriverSidebar({ isOpen }) {
  const { currentRide } = useContext(RideContext);

  // ✅ Build menu items dynamically
  const menuItems = useMemo(() => {
    const baseItems = [
      { name: "Dashboard", path: "/driver/dashboard", icon: <FaTachometerAlt /> },
      { name: "Ride Offers", path: "/driver/ride-offer", icon: <FaCarSide /> },
      { name: "Earnings", path: "/driver/earnings", icon: <FaHistory /> },
      { name: "Profile", path: "/driver/profile", icon: <FaUser /> },
    ];

    // ✅ Insert "Ride In Progress" only if currentRide exists
    if (currentRide) {
      baseItems.splice(1, 0, {
        name: "Ride In Progress",
        path: "/driver/RideInProgressPage", // match your route exactly
        icon: <FaRoute />,
        isLive: true,
      });
    }

    return baseItems;
  }, [currentRide]);

  return (
    <motion.div
      animate={{ width: isOpen ? 250 : 70 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="bg-white shadow-lg h-full fixed top-0 left-0 z-40 flex flex-col overflow-hidden border-r border-gray-100"
    >
      {/* Logo Section */}
      <div className={`flex items-center gap-3 p-4 ${!isOpen && "justify-center"}`}>
        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
          R
        </div>
        {isOpen && (
          <span className="text-xl font-bold text-gray-800 tracking-wide">
            RideMart
          </span>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-col gap-2 mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition duration-200 ${
                isActive
                  ? "bg-blue-100 text-blue-700 shadow-md"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {isOpen && (
              <span className="flex items-center gap-2">
                {item.name}
                {item.isLive && (
                  <motion.span
                    className="w-2 h-2 bg-green-500 rounded-full"
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto mb-6 flex justify-center text-gray-400 text-sm">
        {isOpen && <span>© 2025 RideMart</span>}
      </div>
    </motion.div>
  );
}
