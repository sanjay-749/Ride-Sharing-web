import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet icon path issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom car marker icon
const carIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/743/743988.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

export default function TrackRidePage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Driver on the way 🚕");
  const [driverPosition, setDriverPosition] = useState([13.0827, 80.2707]); // Chennai
  const [eta, setEta] = useState(5);

  // Ride progress simulation
  useEffect(() => {
    const rideFlow = [
      { text: "Driver on the way 🚕", delay: 4000 },
      { text: "Ride in progress 🚗💨", delay: 4000 },
      { text: "Ride ended ✅", delay: 4000 },
    ];

    let index = 0;
    const interval = setInterval(() => {
      index++;
      if (index < rideFlow.length) {
        setStatus(rideFlow[index].text);
      } else {
        clearInterval(interval);
        setTimeout(() => navigate("/payment"), 2000);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [navigate]);

  // Simulate driver moving on map when ride starts
  useEffect(() => {
    let moveInterval;
    if (status === "Ride in progress 🚗💨") {
      moveInterval = setInterval(() => {
        setDriverPosition((prev) => [prev[0] + 0.0005, prev[1] + 0.0005]);
      }, 2000);
    }
    return () => clearInterval(moveInterval);
  }, [status]);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center py-8 px-4">
      <h1 className="text-3xl font-bold text-indigo-600 mb-6">🚘 Track Your Ride</h1>

      <div className="bg-white rounded-3xl shadow-lg p-6 w-full max-w-2xl">
        {/* Map */}
        <div className="h-64 w-full rounded-xl overflow-hidden">
          <MapContainer center={driverPosition} zoom={13} className="h-full w-full">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={driverPosition} icon={carIcon}>
              <Popup>Driver is here 🚗</Popup>
            </Marker>
          </MapContainer>
        </div>

        {/* Ride Status */}
        <div className="mt-6 text-center">
          <p className="text-xl font-semibold text-gray-700">{status}</p>
          <p className="text-gray-500 mt-2">ETA: {eta} mins</p>
        </div>

        {/* Ride Details */}
        <div className="bg-gray-50 p-4 rounded-xl shadow-inner mt-6">
          <h2 className="text-lg font-bold text-gray-700 mb-2">Ride Details</h2>
          <p>
            Driver: <span className="font-semibold">Rajesh Kumar</span>
          </p>
          <p>
            Vehicle: <span className="font-semibold">TN 22 AB 4321</span>
          </p>
          <p>
            Type: <span className="font-semibold">Sedan</span>
          </p>
          <p>
            Fare: <span className="font-semibold">₹210</span>
          </p>
          <p>
            Pickup: <span className="font-semibold">T Nagar, Chennai</span>
          </p>
          <p>
            Destination: <span className="font-semibold">Guindy, Chennai</span>
          </p>
        </div>

        {/* Progress Timeline */}
        <div className="flex justify-around mt-8 w-full">
          {["Driver on the way 🚕", "Ride in progress 🚗💨", "Ride ended ✅"].map(
            (step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    status.includes(step.split(" ")[0])
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-300"
                  }`}
                >
                  {index + 1}
                </div>
                <p className="text-xs mt-2 text-gray-700 text-center w-20">
                  {step.split(" ")[0]}
                </p>
              </div>
            )
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button className="bg-red-500 text-white px-6 py-2 rounded-lg shadow hover:bg-red-600">
            Cancel Ride
          </button>
          <button className="bg-indigo-500 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-600">
            Contact Driver
          </button>
        </div>
      </div>
    </div>
  );
}
