import React, { useState } from "react";

export default function RideHistoryPage() {
  const [rides] = useState([
    {
      id: 1,
      pickup: "Anna Nagar",
      destination: "Central Station",
      fare: 180,
      date: "2025-10-12",
      rating: 5,
    },
    {
      id: 2,
      pickup: "Velachery",
      destination: "Airport",
      fare: 320,
      date: "2025-10-10",
      rating: 4,
    },
  ]);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center py-10 px-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">📜 Ride History</h1>

        <div className="space-y-4">
          {rides.map((ride) => (
            <div
              key={ride.id}
              className="border rounded-xl p-4 flex flex-col md:flex-row justify-between items-center shadow-sm"
            >
              <div>
                <p className="font-semibold text-gray-800">
                  {ride.pickup} → {ride.destination}
                </p>
                <p className="text-gray-500 text-sm">{ride.date}</p>
              </div>
              <div className="text-center mt-2 md:mt-0">
                <p className="text-indigo-600 font-bold">₹{ride.fare}</p>
                <p className="text-yellow-500">⭐ {ride.rating}/5</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
