import React, { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DriverLayout from "../../component/driver/DriverLayout";
import { RideContext } from "../../context/RideContext";
import { getRideOffers, acceptRide } from "../../services/driverService";

export default function RideOfferPage() {
  const navigate = useNavigate();
  const { setCurrentRide } = useContext(RideContext);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      setLoading(true);
      try {
        const data = await getRideOffers();
        const mappedRides = data.map((ride) => ({
          id: ride.id,
          origin: ride.origin || "Unknown",
          destination: ride.destination || "Unknown",
          fare: ride.fare || 0,
          rideTime: ride.rideTime || ride.ride_time || null,
          isOffer: ride.isOffer ?? true,
          rider: ride.rider
            ? { name: ride.rider.name || "Unknown", contact: ride.rider.contact || "Unknown" }
            : { name: "Unknown", contact: "Unknown" },
        }));
        setRides(mappedRides);
      } catch (err) {
        console.error("❌ Failed to load rides:", err);
        alert("Failed to load ride offers");
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  const handleAccept = async (ride) => {
    try {
      const response = await acceptRide(ride.id);
      const acceptedRide = {
        id: response.id || ride.id,
        origin: response.origin || ride.origin,
        destination: response.destination || ride.destination,
        fare: response.fare || ride.fare || 0,
        rideTime: response.rideTime || ride.rideTime || null,
        rider: response.rider
          ? { name: response.rider.name || "Unknown", contact: response.rider.contact || "Unknown" }
          : ride.rider,
        status: "completed", // ✅ Set status to completed immediately
      };

      setCurrentRide(acceptedRide);
      setRides((prev) => prev.filter((r) => r.id !== ride.id));

      alert(`✅ Ride accepted and completed successfully!\nPickup: ${acceptedRide.origin}\nDrop: ${acceptedRide.destination}`);
      navigate("/driver/RideInProgressPage"); // Navigate to completed ride page
    } catch (err) {
      console.error("❌ Error accepting ride:", err);
      alert(err.response?.data?.error || err.message || "Failed to accept ride");
    }
  };

  const handleDecline = (rideId) => {
    setRides((prev) => prev.filter((r) => r.id !== rideId));
  };

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading ride offers...</p>;
  if (!rides.length) return <p className="text-center mt-10 text-gray-600">No ride offers available</p>;

  return (
    <DriverLayout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">🚗 Ride Offers</h1>
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
              className={`p-6 bg-white rounded-2xl shadow-lg flex flex-col gap-3 border-l-4 ${
                ride.isOffer ? "border-green-600" : "border-blue-600"
              }`}
            >
              <h2 className="text-xl font-semibold text-gray-800">Pickup: {ride.origin}</h2>
              <p className="text-gray-600">Drop: {ride.destination}</p>
              <p className="text-gray-600 font-medium">Fare: ₹{ride.fare}</p>

              <div className="mt-4 flex gap-3">
                <motion.button
                  onClick={() => handleAccept(ride)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold"
                >
                  Accept & Complete
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