// src/pages/driver/DriverDashboard.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DriverLayout from "../../component/driver/DriverLayout";
import { FaStar, FaCarSide, FaWallet, FaClock, FaMapMarkerAlt, FaFlagCheckered } from "react-icons/fa";
import { RideContext } from "../../context/RideContext";
import { updateRideStatus, getDriverProfile, getEarnings } from "../../services/driverService";

export default function DriverDashboard() {
  const navigate = useNavigate();
  const { currentRide, setCurrentRide } = useContext(RideContext);

  const [driver, setDriver] = useState({
    name: "",
    rating: 0,
    totalRides: 0,
    todayEarnings: 0,
    weeklyEarnings: 0,
  });
  const [rideStatus, setRideStatus] = useState(currentRide?.status || "Arriving");
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Fetch driver profile & earnings
  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        const driverInfo = JSON.parse(localStorage.getItem("driverInfo"));
        if (!driverInfo) return;

        const profile = await getDriverProfile(driverInfo.id);
        const earnings = await getEarnings();

        setDriver({
          name: profile.name,
          rating: profile.rating || 4.5,
          totalRides: profile.totalRides || 0,
          todayEarnings: earnings.today || 0,
          weeklyEarnings: earnings.weekly || 0,
        });
      } catch (err) {
        console.error("Failed to fetch driver data:", err);
        alert("Error fetching driver data");
      }
    };

    fetchDriverData();
  }, []);

  // Update ride status
  const handleRideNext = async () => {
    if (!currentRide) return;
    setLoading(true);

    try {
      let nextStatus;
      if (rideStatus === "Arriving") nextStatus = "Started";
      else if (rideStatus === "Started") nextStatus = "Completed";
      else return;

      const updatedRide = await updateRideStatus(currentRide.id, nextStatus);
      setRideStatus(nextStatus);
      setCurrentRide(updatedRide);

      if (nextStatus === "Completed") {
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
      {/* Driver Overview */}
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

      {/* Stats */}
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
          <h2 className="text-2xl font-bold text-gray-800">{currentRide ? currentRide.origin : "No active ride"}</h2>
        </motion.div>
      </div>

      {/* Current Ride */}
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
                <p className="text-gray-800 font-semibold">{currentRide.origin}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <FaFlagCheckered className="text-green-600 text-2xl" />
              <div>
                <p className="text-gray-500 text-sm">Drop</p>
                <p className="text-gray-800 font-semibold">{currentRide.destination}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-xl">
              <FaClock className="text-yellow-500 text-xl" />
              <p className="text-gray-800 font-semibold">{currentRide.rideTime || 0} min</p>
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
              {rideStatus === "Arriving" ? "Start Trip" : rideStatus === "Started" ? "Complete Trip" : "Done"}
            </motion.button>
          </div>
        </motion.div>
      )}
    </DriverLayout>
  );
}
