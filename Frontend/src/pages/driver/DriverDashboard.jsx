// src/pages/driver/DriverDashboard.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DriverLayout from "../../component/driver/DriverLayout";
import { FaStar, FaCarSide, FaWallet, FaClock, FaMapMarkerAlt, FaFlagCheckered } from "react-icons/fa";
import { RideContext } from "../../context/RideContext";
import { updateRideStatus } from "../../services/driverService";

export default function DriverDashboard() {
  const navigate = useNavigate();
  const { currentRide, setCurrentRide } = useContext(RideContext);

  const [isOnline, setIsOnline] = useState(true);
  const [rideStatus, setRideStatus] = useState(currentRide?.status || "Arriving");
  const [loading, setLoading] = useState(false);

  const driver = {
    name: "John Doe",
    rating: 4.8,
    totalRides: 120,
    todayEarnings: 1500,
    weeklyEarnings: 8500,
  };

  const handleRideNext = async () => {
    if (!currentRide) return;
    setLoading(true);
    try {
      let next;
      if (rideStatus === "Arriving") next = "Started";
      else if (rideStatus === "Started") next = "Completed";
      else return;

      await updateRideStatus(currentRide.id, next);
      setRideStatus(next);

      if (next === "Completed") {
        setCurrentRide(null);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update ride status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DriverLayout>
      {/* Driver Profile Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white rounded-3xl shadow-2xl p-10 flex flex-col md:flex-row items-center justify-between mb-10 border-l-4 border-blue-600"
      >
        <div>
          <h2 className="text-3xl font-bold text-gray-800">{driver.name}</h2>
          <p className="flex items-center gap-2 text-yellow-500 font-semibold mt-2">
            <FaStar /> {driver.rating} / 5
          </p>
        </div>

        {/* Online/Offline Toggle */}
        <div className="mt-6 md:mt-0 flex items-center gap-6">
          <span className="text-lg font-semibold text-gray-700">{isOnline ? "Online" : "Offline"}</span>
          <div
            onClick={() => setIsOnline(!isOnline)}
            className={`w-20 h-10 flex items-center rounded-full p-1 cursor-pointer transition-all ${
              isOnline ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <motion.div
              layout
              className="bg-white w-8 h-8 rounded-full shadow-md"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div whileHover={{ scale: 1.05 }} className="p-6 bg-white rounded-2xl shadow-md flex flex-col items-center justify-center border-l-4 border-blue-600">
          <FaCarSide className="text-4xl text-blue-600 mb-2" />
          <p className="text-gray-500">Total Rides</p>
          <h2 className="text-2xl font-bold text-gray-800">{driver.totalRides}</h2>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="p-6 bg-white rounded-2xl shadow-md flex flex-col items-center justify-center border-l-4 border-green-600">
          <FaWallet className="text-4xl text-green-600 mb-2" />
          <p className="text-gray-500">Today's Earnings</p>
          <h2 className="text-2xl font-bold text-gray-800">₹{driver.todayEarnings}</h2>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="p-6 bg-white rounded-2xl shadow-md flex flex-col items-center justify-center border-l-4 border-yellow-500">
          <FaClock className="text-4xl text-yellow-500 mb-2" />
          <p className="text-gray-500">Weekly Earnings</p>
          <h2 className="text-2xl font-bold text-gray-800">₹{driver.weeklyEarnings}</h2>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="p-6 bg-white rounded-2xl shadow-md flex flex-col items-center justify-center border-l-4 border-purple-600">
          <FaWallet className="text-4xl text-purple-600 mb-2" />
          <p className="text-gray-500">Ongoing Ride</p>
          <h2 className="text-2xl font-bold text-gray-800">{currentRide ? currentRide.pickup : "No active ride"}</h2>
        </motion.div>
      </div>

      {/* Current Ride Progress */}
      {currentRide && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 bg-white rounded-3xl shadow-2xl mb-8 border-l-4 border-blue-600"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Current Ride</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <FaMapMarkerAlt className="text-blue-600 text-2xl" />
              <div>
                <p className="text-gray-500 text-sm">Pickup</p>
                <p className="text-gray-800 font-semibold">{currentRide.pickup}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <FaFlagCheckered className="text-green-600 text-2xl" />
              <div>
                <p className="text-gray-500 text-sm">Drop</p>
                <p className="text-gray-800 font-semibold">{currentRide.drop}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-xl">
              <FaClock className="text-yellow-500 text-xl" />
              <p className="text-gray-800 font-semibold">{currentRide.estimatedTime} min</p>
            </div>
            <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-xl">
              <FaWallet className="text-green-600 text-xl" />
              <p className="text-gray-800 font-semibold">₹{currentRide.fare}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRideNext}
              disabled={loading}
              className={`px-6 py-3 rounded-xl font-semibold text-white ${
                rideStatus === "Arriving" || rideStatus === "Started"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {rideStatus === "Arriving"
                ? "Start Trip"
                : rideStatus === "Started"
                ? "Complete Trip"
                : "Done"}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div whileHover={{ scale: 1.05 }} className="p-6 bg-blue-600 text-white rounded-2xl shadow-md cursor-pointer" onClick={() => navigate("/driver/ride-offer")}>
          <h2 className="text-2xl font-semibold mb-2">New Ride Offer</h2>
          <p className="opacity-90">Check incoming ride requests</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="p-6 bg-green-600 text-white rounded-2xl shadow-md cursor-pointer" onClick={() => navigate("/driver/earnings")}>
          <h2 className="text-2xl font-semibold mb-2">Earnings</h2>
          <p className="opacity-90">View earnings & history</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="p-6 bg-gray-700 text-white rounded-2xl shadow-md cursor-pointer" onClick={() => navigate("/driver/profile")}>
          <h2 className="text-2xl font-semibold mb-2">Profile</h2>
          <p className="opacity-90">Manage account & settings</p>
        </motion.div>
      </div>
    </DriverLayout>
  );
}
