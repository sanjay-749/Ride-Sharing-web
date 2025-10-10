import React, { useContext, useState, useEffect } from "react";
import { RideContext } from "../../context/RideContext";
import { updateRideStatus } from "../../services/driverService";
import { useNavigate } from "react-router-dom";
import DriverMap from "./DriverMap";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaFlagCheckered, FaClock, FaMoneyBillWave } from "react-icons/fa";
import DriverLayout from "../../component/driver/DriverLayout";

export default function RideInProgressPage() {
  const { currentRide, setCurrentRide } = useContext(RideContext);
  const navigate = useNavigate();
  const [status, setStatus] = useState(currentRide?.status || "Arriving");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentRide) navigate("/driver/dashboard");
  }, [currentRide]);

  if (!currentRide) return null;

  const handleNext = async () => {
    setLoading(true);
    try {
      let next;
      if (status === "Arriving") next = "Started";
      else if (status === "Started") next = "Completed";
      else return;

      await updateRideStatus(currentRide.id, next);
      setStatus(next);

      if (next === "Completed") {
        setCurrentRide(null);
        navigate("/driver/earnings");
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-6 border-t-4 border-[#1D4ED8]"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1D4ED8] mb-2">
              Ride In Progress
            </h2>
            <p className="text-gray-500 flex items-center gap-3">
              Status:{" "}
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className={`font-semibold px-3 py-1 rounded-full text-white ${
                  status === "Completed"
                    ? "bg-green-500"
                    : status === "Started"
                    ? "bg-blue-600"
                    : "bg-yellow-500"
                }`}
              >
                {status}
              </motion.span>
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4">
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-xl shadow">
              <FaClock className="text-blue-600" />
              <p className="text-blue-800 font-semibold">{currentRide.estimatedTime} min</p>
            </div>
            <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-xl shadow">
              <FaMoneyBillWave className="text-green-600" />
              <p className="text-green-800 font-semibold">${currentRide.fare}</p>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="rounded-2xl overflow-hidden shadow-lg mb-6">
          <DriverMap
            driverLocation={currentRide.pickupLocation}
            pickupLatLng={currentRide.pickupLocation}
            dropLatLng={currentRide.dropLocation}
          />
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-5 bg-blue-50 rounded-2xl shadow flex items-center gap-4 transition"
          >
            <FaMapMarkerAlt className="text-blue-600 text-2xl" />
            <div>
              <p className="text-gray-500 text-sm">Pickup Location</p>
              <p className="text-blue-900 font-semibold text-lg">{currentRide.pickup}</p>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-5 bg-green-50 rounded-2xl shadow flex items-center gap-4 transition"
          >
            <FaFlagCheckered className="text-green-600 text-2xl" />
            <div>
              <p className="text-gray-500 text-sm">Drop Location</p>
              <p className="text-green-900 font-semibold text-lg">{currentRide.drop}</p>
            </div>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            disabled={loading}
            className={`flex-1 py-4 rounded-2xl font-semibold shadow-lg text-white text-lg transition ${
              status === "Arriving" || status === "Started"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {status === "Arriving"
              ? "Start Trip"
              : status === "Started"
              ? "Complete Trip"
              : "Done"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setCurrentRide(null);
              navigate("/driver/dashboard");
            }}
            className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-2xl font-semibold shadow-lg hover:bg-gray-200 transition text-lg"
          >
            Cancel Ride
          </motion.button>
        </div>
      </motion.div>
    </DriverLayout>
  );
}
