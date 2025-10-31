import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useAuth } from "../../context/AuthContext";

const mapContainerStyle = { 
  width: "100%", 
  height: "300px",
  borderRadius: "15px",
  border: "2px solid #e5e7eb"
};

export default function HomePage() {
  const { user, isAuthenticated, logout } = useAuth(); 
  
  const [position, setPosition] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setPosition({ lat: 13.0827, lng: 80.2707 }),
        { enableHighAccuracy: true }
      );
    } else {
      setPosition({ lat: 13.0827, lng: 80.2707 });
    }

    // Scroll effect for navbar
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const features = [
    {
      icon: "🚗",
      title: "Quick Booking",
      description: "Book a ride in just a few taps"
    },
    {
      icon: "💰",
      title: "Best Prices",
      description: "Competitive fares with no surge pricing"
    },
    {
      icon: "🛡️",
      title: "Safe Rides",
      description: "Verified drivers and real-time tracking"
    },
    {
      icon: "⭐",
      title: "5-Star Service",
      description: "Rated excellent by thousands of users"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Enhanced Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' 
          : 'bg-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">🚗</span>
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                RideMart
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-8 items-center">
              <Link 
                to="/profile" 
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 flex items-center gap-2 group"
              >
                <span className="group-hover:scale-110 transition-transform">👤</span>
                Profile
              </Link>
              <Link 
                to="/help" 
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 flex items-center gap-2 group"
              >
                <span className="group-hover:scale-110 transition-transform">❓</span>
                Help & Support
              </Link>

              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    👋 Hello, {user?.name || user?.email?.split('@')[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold py-2 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                  >
                    <span>🚪</span>
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  <span>🔐</span>
                  Login / Signup
                </Link>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-gray-700 focus:outline-none text-2xl bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {menuOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed top-20 left-4 right-4 z-40 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl py-6 px-6 flex flex-col gap-4 border border-gray-200 md:hidden">
          <Link 
            to="/profile" 
            onClick={() => setMenuOpen(false)} 
            className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 flex items-center gap-3 py-3 px-4 hover:bg-indigo-50 rounded-xl"
          >
            <span className="text-lg">👤</span>
            Profile
          </Link>
          <Link 
            to="/help" 
            onClick={() => setMenuOpen(false)} 
            className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 flex items-center gap-3 py-3 px-4 hover:bg-indigo-50 rounded-xl"
          >
            <span className="text-lg">❓</span>
            Help & Support
          </Link>

          {isAuthenticated ? (
            <div className="border-t pt-4 mt-2">
              <div className="text-sm text-gray-600 mb-3 px-4">
                Signed in as <span className="font-semibold">{user?.email}</span>
              </div>
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>🚪</span>
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 text-center"
            >
              <span>🔐</span>
              Login / Signup
            </Link>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Ride Smarter,
            </span>
            <br />
            <span className="text-gray-800">Travel Better</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Experience the future of ride-sharing with instant bookings, 
            competitive pricing, and premium service at your fingertips.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mb-12">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">10K+</div>
              <div className="text-sm text-gray-500">Happy Riders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">4.9★</div>
              <div className="text-sm text-gray-500">Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">24/7</div>
              <div className="text-sm text-gray-500">Support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">50+</div>
              <div className="text-sm text-gray-500">Cities</div>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
            <h2 className="text-center text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8">
              Ready to Ride? 🚀
            </h2>

            {/* Map Section */}
            <div className="mb-8">
              {googleMapsApiKey && position ? (
                <LoadScript googleMapsApiKey={googleMapsApiKey}>
                  <GoogleMap 
                    mapContainerStyle={mapContainerStyle} 
                    center={position} 
                    zoom={14}
                    options={{
                      styles: [
                        {
                          featureType: "poi",
                          elementType: "labels",
                          stylers: [{ visibility: "on" }]
                        }
                      ],
                      disableDefaultUI: false,
                      zoomControl: true,
                      streetViewControl: true,
                      mapTypeControl: false
                    }}
                  >
                    <Marker 
                      position={position} 
                      icon={{
                        url: "data:image/svg+xml;base64," + btoa(`
                          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="16" cy="16" r="14" fill="#4F46E5" stroke="white" stroke-width="3"/>
                            <circle cx="16" cy="16" r="6" fill="white"/>
                          </svg>
                        `)
                      }}
                    />
                  </GoogleMap>
                </LoadScript>
              ) : (
                <div className="text-center text-gray-500 p-8 bg-gray-100 rounded-xl">
                  <div className="text-4xl mb-2">🗺️</div>
                  <p>Loading your location...</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <Link
                to="/book-ride"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 text-lg group"
              >
                <span className="group-hover:scale-110 transition-transform">🚘</span>
                Book a Ride Now
              </Link>
              <Link
                to="/track"
                className="bg-white text-gray-800 border-2 border-indigo-200 font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 text-lg group hover:border-indigo-300"
              >
                <span className="group-hover:scale-110 transition-transform">📍</span>
                Track Your Ride
              </Link>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="text-center p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-100 group"
                >
                  <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-200">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-indigo-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-indigo-600 font-bold">🚗</span>
              </div>
              <div className="text-2xl font-bold text-white">RideMart</div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md mx-auto">
              Revolutionizing urban mobility with safe, affordable, and reliable ride-sharing services.
            </p>
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} RideMart Technologies | Making every journey memorable 🌟
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}