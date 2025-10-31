import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DriverLayout from "../../component/driver/DriverLayout";
import { CheckCircle, Clock, Car, MapPin, Star } from "lucide-react";
import { RideContext } from "../../context/RideContext";

export default function RideInProgressPage() {
  const navigate = useNavigate();
  const { currentRide, updateRideStatus, setCurrentRide } = useContext(RideContext);
  
  // ✅ Always start with completed status when coming from acceptance
  const [rideStatus, setRideStatus] = useState("completed");
  const [progress, setProgress] = useState(100); // ✅ Start with 100% progress

  // Redirect if no current ride
  useEffect(() => {
    if (!currentRide) navigate("/driver/ride-offer");
  }, [currentRide, navigate]);

  // Update ride status in backend if needed
  useEffect(() => {
    if (!currentRide) return;

    // Ensure the ride is marked as completed in backend
    if (rideStatus === "completed") {
      updateRideStatus(currentRide.id, "Completed")
        .then((updatedRide) => setCurrentRide(updatedRide))
        .catch((err) => console.error("❌ Failed to update ride status:", err));
    }
  }, [rideStatus, currentRide]);

  if (!currentRide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">No ride data found</h1>
          <button 
            onClick={() => navigate("/driver/ride-offer")}
            className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg"
          >
            Back to Ride Offers
          </button>
        </div>
      </div>
    );
  }

  return (
    <DriverLayout>
      <div className="bg-gray-100 min-h-screen flex flex-col">
        {/* Header */}
        <div className="bg-green-500 text-white p-4 shadow-md">
          <h1 className="text-2xl font-bold text-center">🎉 Ride Completed</h1>
        </div>

        <div className="flex-1 p-4">
          {/* Success Celebration */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-4 text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="text-green-500" size={48} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Ride Completed Successfully!</h2>
            <p className="text-gray-600">You have successfully completed the ride.</p>
          </motion.div>

          {/* Route Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Route Summary</h3>
            <div className="flex flex-col items-center space-y-4">
              {/* Pickup Point */}
              <div className="flex items-center w-full">
                <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full">
                  <MapPin className="text-white" size={16} />
                </div>
                <div className="ml-4 flex-1">
                  <p className="font-semibold text-gray-800">Pickup</p>
                  <p className="text-sm text-gray-600 truncate">{currentRide.origin}</p>
                </div>
              </div>

              {/* Completed Line */}
              <div className="flex justify-center w-full">
                <div className="relative w-1 h-24 bg-green-500 rounded">
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2">
                    <Car className="text-white" size={20} />
                  </div>
                </div>
              </div>

              {/* Destination Point */}
              <div className="flex items-center w-full">
                <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full">
                  <MapPin className="text-white" size={16} />
                </div>
                <div className="ml-4 flex-1">
                  <p className="font-semibold text-gray-800">Destination</p>
                  <p className="text-sm text-gray-600 truncate">{currentRide.destination}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ride Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-4"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Ride Information</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-gray-500 text-sm">Distance</p>
                <p className="font-semibold text-gray-800">7.2 km</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-gray-500 text-sm">Fare Earned</p>
                <p className="font-semibold text-green-600">₹{currentRide.fare}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 col-span-2">
                <p className="text-gray-500 text-sm">Status</p>
                <p className="font-semibold text-green-600 flex items-center justify-center gap-2">
                  <CheckCircle size={16} />
                  Completed Successfully
                </p>
              </div>
            </div>
          </motion.div>

          {/* Earnings Celebration */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 mb-4 text-white text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Star className="text-yellow-300" size={24} />
              <h3 className="text-xl font-bold">Congratulations!</h3>
              <Star className="text-yellow-300" size={24} />
            </div>
            <p className="text-lg mb-2">You earned</p>
            <p className="text-3xl font-bold">₹{currentRide.fare}</p>
            <p className="text-green-100 text-sm mt-2">This amount has been added to your earnings</p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="p-4 bg-white shadow-2xl rounded-t-2xl border-t">
          <div className="text-center">
            <div className="text-green-600 font-semibold text-lg mb-4 flex items-center justify-center gap-2">
              <CheckCircle size={24} />
              Ready for your next ride!
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/driver/ride-offer")}
                className="flex-1 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition font-semibold text-lg"
              >
                🚗 Find New Rides
              </button>
              <button
                onClick={() => navigate("/driver/dashboard")}
                className="flex-1 py-4 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition font-semibold text-lg"
              >
                📊 Go to Dashboard
              </button>
            </div>
            <button
              onClick={() => navigate("/driver/earnings")}
              className="w-full mt-3 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition font-semibold"
            >
              💰 View Earnings
            </button>
          </div>
        </div>
      </div>
    </DriverLayout>
  );
}