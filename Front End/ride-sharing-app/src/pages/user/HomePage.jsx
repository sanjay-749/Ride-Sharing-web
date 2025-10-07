import React from "react";

export default function HomePage() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Home Page</h1>
        <p className="text-red-500 text-lg mb-2">
          Welcome to the Ride Sharing App!
        </p>
        <p className="text-gray-700">
          Book rides, track drivers, and pay seamlessly with our platform.
        </p>
      </div>
    </div>
  );
}
