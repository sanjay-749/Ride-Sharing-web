import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function TrackRidePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { ride } = location.state || {};

  const [status, setStatus] = useState("Driver on the way 🚕");
  const [eta, setEta] = useState(5);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  // If no ride data, redirect back
  useEffect(() => {
    if (!ride) {
      navigate("/book");
    }
  }, [ride, navigate]);

  // Simulate ride progress and auto-navigate to payment
  useEffect(() => {
    if (!ride || !ride.id) return;

    const rideSimulation = () => {
      const statuses = [
        "Driver on the way 🚕",
        "Driver arrived at pickup 🎯",
        "Ride in progress 🚗",
        "Approaching destination 🗺️",
        "Ride ended ✅"
      ];

      let currentStatus = 0;
      
      const interval = setInterval(() => {
        if (currentStatus < statuses.length - 1) {
          currentStatus++;
          setStatus(statuses[currentStatus]);
          setEta(Math.max(1, 5 - currentStatus)); // Decrease ETA
          setProgress(((currentStatus + 1) / statuses.length) * 100);
        } else {
          clearInterval(interval);
          // Navigate to payment after 2 seconds when ride ends
          setTimeout(() => {
            navigate("/payment", { state: { ride } });
          }, 2000);
        }
      }, 3000); // Change status every 3 seconds

      return () => clearInterval(interval);
    };

    rideSimulation();
  }, [ride, navigate]);

  if (!ride) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">No ride data found</h1>
          <button 
            onClick={() => navigate("/book")}
            className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg"
          >
            Book a Ride
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center py-8 px-4">
      <h1 className="text-3xl font-bold text-indigo-600 mb-6">🚘 Track Your Ride</h1>

      <div className="bg-white rounded-3xl shadow-lg p-6 w-full max-w-2xl">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Ride Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-green-500 h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="h-64 w-full rounded-xl bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center mb-6 border-2 border-dashed border-gray-300">
          <div className="text-center text-gray-600">
            <div className="text-4xl mb-2">🚗</div>
            <p className="text-lg font-semibold">Live Ride Simulation</p>
            <p className="text-sm mt-2">Driver is moving towards destination</p>
          </div>
        </div>

        {/* Ride Status */}
        <div className="text-center mb-6 p-4 bg-indigo-50 rounded-xl">
          <p className="text-xl font-semibold text-indigo-700">{status}</p>
          <p className="text-gray-600 mt-2">ETA: {eta} min{eta !== 1 ? 's' : ''}</p>
        </div>

        {/* Ride Details */}
        <div className="bg-gray-50 p-4 rounded-xl shadow-inner mb-6">
          <h2 className="text-lg font-bold text-gray-700 mb-3">Ride Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500">Vehicle</p>
              <p className="font-medium text-gray-800">{ride.vehicle}</p>
            </div>
            <div>
              <p className="text-gray-500">Fare</p>
              <p className="font-medium text-indigo-600">₹{ride.fare}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-500">Pickup</p>
              <p className="font-medium text-gray-800">{ride.pickup?.split(",")[0]}</p>
              <p className="text-xs text-gray-400">{ride.pickup}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-500">Destination</p>
              <p className="font-medium text-gray-800">{ride.destination?.split(",")[0]}</p>
              <p className="text-xs text-gray-400">{ride.destination}</p>
            </div>
          </div>
        </div>

        {/* Demo Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <div className="flex items-start">
            <span className="text-yellow-500 text-lg mr-2">💡</span>
            <div>
              <p className="text-yellow-800 font-medium">Demo Mode Active</p>
              <p className="text-yellow-700 text-sm">Ride simulation in progress. You'll be redirected to payment automatically.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => navigate("/payment", { state: { ride } })}
            className="bg-green-500 text-white px-6 py-3 rounded-lg shadow hover:bg-green-600 font-semibold flex items-center gap-2"
          >
            <span>💳</span>
            Go to Payment Now
          </button>
          <button 
            onClick={() => navigate("/history")}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg shadow hover:bg-gray-600 font-semibold flex items-center gap-2"
          >
            <span>📜</span>
            View History
          </button>
        </div>
      </div>
    </div>
  );
}