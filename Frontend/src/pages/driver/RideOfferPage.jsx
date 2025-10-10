// src/pages/driver/RideOfferPage.jsx
import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DriverLayout from "../../component/driver/DriverLayout";
import { RideContext } from "../../context/RideContext";

export default function RideOfferPage() {
  const navigate = useNavigate();
  const { setCurrentRide } = useContext(RideContext);

  const [rides, setRides] = useState([
    { id: 1, pickup: "MG Road", drop: "Brigade Road", fare: 250, estimatedTime: 15, status: "Arriving" },
    { id: 2, pickup: "Koramangala", drop: "HSR Layout", fare: 320, estimatedTime: 20, status: "Arriving" },
  ]);

  const handleAccept = (ride) => {
    setCurrentRide(ride); // Save ride in context
    // Animate card removal
    setRides((prev) => prev.filter((r) => r.id !== ride.id));
    setTimeout(() => navigate("/driver/ride-in-progress"), 300); // Wait for animation
  };

  const handleDecline = (rideId) => {
    setRides(rides.filter((r) => r.id !== rideId));
  };

  return (
    <DriverLayout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Ride Offers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {rides.map((ride) => (
            <motion.div
              key={ride.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.03 }}
              className="p-6 bg-white rounded-2xl shadow-lg flex flex-col gap-3 border-l-4 border-blue-600"
            >
              <h2 className="text-xl font-semibold text-gray-800">Pickup: {ride.pickup}</h2>
              <p className="text-gray-600">Drop: {ride.drop}</p>
              <p className="text-gray-600 font-medium">Fare: ₹{ride.fare}</p>
              <p className="text-gray-500 text-sm">Estimated Time: {ride.estimatedTime} min</p>

              <div className="mt-4 flex gap-3">
                <motion.button
                  onClick={() => handleAccept(ride)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold"
                >
                  Accept
                </motion.button>
                <motion.button
                  onClick={() => handleDecline(ride.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-3 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400 transition font-semibold"
                >
                  Decline
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </DriverLayout>
  );
}
