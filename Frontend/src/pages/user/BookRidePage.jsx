import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BookRidePage() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [fare, setFare] = useState(null);
  const [vehicle, setVehicle] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // Handle search button click
  const handleSearch = (e) => {
    e.preventDefault();
    if (pickup && destination) {
      setFare(Math.floor(Math.random() * 100) + 50); // Random fare
      setStep(2); // Move to vehicle selection
    } else {
      alert("Please enter both pickup and destination.");
    }
  };

  // Handle booking confirmation
  const handleConfirmBooking = () => {
    if (vehicle) {
      alert("✅ Ride booked successfully!");
      navigate("/track"); // Navigate to tracking page
    } else {
      alert("Please select a vehicle type");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center py-10 px-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
          🚖 Book a Ride
        </h1>

        {/* Step 1: Pickup & Destination */}
        {step === 1 && (
          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter pickup location"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            />

            <input
              type="text"
              placeholder="Enter destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            />

            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold py-3 rounded-xl shadow-md hover:opacity-95"
            >
              View Fare & Vehicle Options
            </button>
          </form>
        )}

        {/* Step 2: Fare & Vehicle Selection */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <p className="text-lg text-gray-700 text-center">
              Estimated Fare:{" "}
              <span className="text-indigo-600 font-semibold">₹{fare}</span>
            </p>

            <select
              className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
            >
              <option value="">Select Vehicle Type</option>
              <option value="Mini">🚗 Mini</option>
              <option value="Sedan">🚘 Sedan</option>
              <option value="SUV">🚙 SUV</option>
            </select>

            <button
              onClick={handleConfirmBooking}
              className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold py-3 rounded-xl shadow-md hover:opacity-95"
            >
              Confirm Booking
            </button>

            <button
              onClick={() => setStep(1)}
              className="mt-2 text-indigo-600 font-semibold underline"
            >
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
