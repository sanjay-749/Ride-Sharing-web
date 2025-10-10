import React, { useContext } from "react";
import { RideContext } from "../../context/RideContext";
import { acceptRide } from "../../services/driverService";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function RideOfferPage() {
  const { currentRide, setCurrentRide } = useContext(RideContext);
  const navigate = useNavigate();

  if (!currentRide) return <div className="min-h-screen flex items-center justify-center">No ride selected.</div>;

  const onAccept = async () => {
    try {
      await acceptRide(currentRide.id);
      // update context and navigate to in-progress page
      navigate("/driver/in-progress");
    } catch (err) {
      console.error(err);
      alert("Failed to accept ride");
    }
  };

  const onDecline = () => {
    setCurrentRide(null);
    navigate("/driver/dashboard");
  };

  return (
    <div className="min-h-screen p-6 bg-white flex items-center justify-center">
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-lg bg-[#F3F4F6] p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-[#1E3A8A] mb-3">Ride Request</h2>
        <p className="font-semibold text-[#111827]">Pickup: {currentRide.pickup}</p>
        <p className="text-gray-600">Drop: {currentRide.drop}</p>
        <p className="text-[#0F4C81] font-semibold mt-2">Fare: ₹{currentRide.fare}</p>
        <div className="mt-6 flex gap-3">
          <button onClick={onAccept} className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">Accept</button>
          <button onClick={onDecline} className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition">Decline</button>
        </div>
      </motion.div>
    </div>
  );
}
