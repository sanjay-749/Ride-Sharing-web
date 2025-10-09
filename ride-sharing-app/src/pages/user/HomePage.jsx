import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "300px",
};

export default function HomePage() {
  const [position, setPosition] = useState(null); // live user location
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.error("Error getting location:", err);
          // fallback location if user denies permission
          setPosition({ lat: 13.0827, lng: 80.2707 }); // Chennai
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.error("Geolocation not supported");
      setPosition({ lat: 13.0827, lng: 80.2707 }); // Chennai fallback
    }
  }, []);

  return (
    <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 min-h-screen flex flex-col items-center justify-center text-white">
      {/* Header Section */}
      <header className="w-full text-center py-8">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2">
          🚗 Welcome to <span className="text-yellow-300">RideMart</span>
        </h1>
        <p className="text-lg opacity-90">
          Your one-stop solution for safe and affordable rides.
        </p>
      </header>

      {/* Main Card Section */}
      <div className="bg-white text-gray-800 rounded-2xl shadow-2xl p-8 w-11/12 md:w-2/3 lg:w-1/2 mb-10">
        <h2 className="text-2xl font-bold text-center mb-4 text-indigo-600">
          Book. Ride. Enjoy.
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Plan your journey, choose your driver, and track your ride in real time.
        </p>

        {/* Google Map Section */}
        <div className="rounded-lg overflow-hidden mb-6">
          {googleMapsApiKey && position ? (
            <LoadScript googleMapsApiKey={googleMapsApiKey}>
              <GoogleMap mapContainerStyle={mapContainerStyle} center={position} zoom={14}>
                <Marker position={position} />
              </GoogleMap>
            </LoadScript>
          ) : (
            <div className="text-center p-4 text-red-500 font-semibold">
              ⚠️ Loading map or API key not found.
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link
            to="/book-ride"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
          >
            🚘 Book a Ride
          </Link>
          <Link
            to="/track"
            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
          >
            📍 Track Ride
          </Link>
          <Link
            to="/login"
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
          >
            🔐 Login / Signup
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm text-white opacity-80 py-4">
        © {new Date().getFullYear()} RideMart | Making every ride safer 🚦
      </footer>
    </div>
  );
}
