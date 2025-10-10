import React, { useContext, useState, useEffect } from "react";
import { RideContext } from "../../context/RideContext";
import { updateRideStatus } from "../../services/driverService";
import { useNavigate } from "react-router-dom";
import DriverMap from "../Driver_module/DriverMap";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaFlagCheckered } from "react-icons/fa";

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
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        {/* ===== HEADER ===== */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0F4C81] mb-2">
              Ride In Progress
            </h2>
            <p className="text-gray-600 flex items-center gap-2">
              Status:{" "}
              <span
                className={`font-semibold px-2 py-1 rounded ${
                  status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : status === "Started"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {status}
              </span>
            </p>
          </div>
        </div>

        {/* ===== MAP ===== */}
        <div className="rounded-xl overflow-hidden shadow mb-6">
          <DriverMap
            pickupLatLng={currentRide.pickupLocation}
            dropLatLng={currentRide.dropLocation}
            enableLive={true}
          />
        </div>

        {/* ===== DETAILS ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-xl shadow flex items-center gap-3">
            <FaMapMarkerAlt className="text-[#1E3A8A] text-xl" />
            <div>
              <p className="text-gray-600 text-sm">Pickup</p>
              <p className="text-[#0F4C81] font-semibold">{currentRide.pickup}</p>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-xl shadow flex items-center gap-3">
            <FaFlagCheckered className="text-[#1E3A8A] text-xl" />
            <div>
              <p className="text-gray-600 text-sm">Drop</p>
              <p className="text-[#0F4C81] font-semibold">{currentRide.drop}</p>
            </div>
          </div>
        </div>

        {/* ===== ACTION BUTTONS ===== */}
        <div className="flex flex-col md:flex-row gap-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleNext}
            disabled={loading}
            className={`flex-1 bg-[#0F4C81] text-white py-3 rounded-xl font-semibold shadow-md hover:bg-[#1E3A8A] transition ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {status === "Arriving"
              ? "Start Trip"
              : status === "Started"
              ? "Complete Trip"
              : "Done"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setCurrentRide(null);
              navigate("/driver/dashboard");
            }}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold shadow-md hover:bg-gray-200 transition"
          >
            Cancel
          </motion.button>
        </div>
      </div>
    </div>
  );
}
