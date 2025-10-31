import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function RideHistoryPage() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [debugInfo, setDebugInfo] = useState("");
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserRides();
    } else {
      setLoading(false);
      setError("Please login to view your ride history");
    }
  }, [isAuthenticated, user]);

  const fetchUserRides = async () => {
    try {
      setLoading(true);
      setError("");
      setDebugInfo("Starting to fetch ride history...");
      
      // Get token from localStorage
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      setDebugInfo("Token found, making API request...");

      // Try both proxy and direct connection
      let response;
      let usedProxy = true;
      
      try {
        // Option 1: Try with proxy
        setDebugInfo("Trying proxy: /api/rides/user/history");
        response = await fetch("/api/rides/user/history", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
      } catch (proxyError) {
        // Option 2: If proxy fails, try direct
        setDebugInfo("Proxy failed, trying direct: http://localhost:8080/api/rides/user/history");
        usedProxy = false;
        response = await fetch("http://localhost:8080/api/rides/user/history", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
      }

      setDebugInfo(`Response status: ${response.status}, Used proxy: ${usedProxy}`);

      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expired. Please login again.");
          return;
        }
        const errorText = await response.text();
        throw new Error(`Failed to fetch rides: ${response.status} - ${errorText}`);
      }

      const userRides = await response.json();
      setRides(userRides);
      setDebugInfo(`✅ Successfully loaded ${userRides.length} rides`);
    } catch (err) {
      console.error("Error fetching ride history:", err);
      setError("Failed to load ride history. Please try again.");
      setDebugInfo(`❌ Error: ${err.message}`);
      
      // Fallback to localStorage if backend fails
      const localRides = JSON.parse(localStorage.getItem('userRides') || '[]');
      const userLocalRides = localRides.filter(ride => ride.userEmail === user?.email);
      if (userLocalRides.length > 0) {
        setRides(userLocalRides);
        setError("");
        setDebugInfo("Using local storage fallback data");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      case 'in_progress': return 'In Progress';
      default: return status || 'Unknown';
    }
  };

  const handleGoToHomepage = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center py-10 px-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-3xl text-center">
          <div className="flex justify-center items-center space-x-3">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading your ride history...</p>
          </div>
          {debugInfo && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">{debugInfo}</p>
            </div>
          )}
          <button
            onClick={handleGoToHomepage}
            className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2 mx-auto"
          >
            <span>🏠</span>
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center py-10 px-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-3xl text-center">
          <div className="text-red-500 text-lg mb-4">⚠️ {error}</div>
          {debugInfo && (
            <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-700">{debugInfo}</p>
            </div>
          )}
          <div className="flex gap-4 justify-center">
            <button
              onClick={fetchUserRides}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              Try Again
            </button>
            <button
              onClick={handleGoToHomepage}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
            >
              <span>🏠</span>
              Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center py-10 px-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Required</h2>
          <p className="text-gray-600 mb-6">Please login to view your ride history</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              Go to Login
            </button>
            <button
              onClick={handleGoToHomepage}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
            >
              <span>🏠</span>
              Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center py-10 px-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-600">📜 Your Ride History</h1>
          <div className="flex gap-3">
            <button
              onClick={fetchUserRides}
              className="bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-200 flex items-center space-x-2"
            >
              <span>🔄</span>
              <span>Refresh</span>
            </button>
            <button
              onClick={handleGoToHomepage}
              className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
            >
              <span>🏠</span>
              <span>Home</span>
            </button>
          </div>
        </div>

        {/* Debug Info */}
        {debugInfo && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-700">{debugInfo}</p>
          </div>
        )}

        {rides.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Rides Yet</h3>
            <p className="text-gray-500 mb-6">You haven't taken any rides yet. Book your first ride!</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/book-ride')}
                className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:opacity-95"
              >
                Book Your First Ride
              </button>
              <button
                onClick={handleGoToHomepage}
                className="bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:bg-gray-700 flex items-center gap-2"
              >
                <span>🏠</span>
                Go to Homepage
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {rides.map((ride) => (
              <div
                key={ride.id}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-white"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  {/* Ride Details */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ride.status)}`}>
                        {getStatusText(ride.status)}
                      </span>
                      <span className="text-gray-500 text-sm">{formatDate(ride.createdAt)}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">From</p>
                        <p className="font-semibold text-gray-800">{ride.pickup?.split(',')[0] || 'Unknown'}</p>
                        <p className="text-xs text-gray-400 truncate">{ride.pickup}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 mb-1">To</p>
                        <p className="font-semibold text-gray-800">{ride.destination?.split(',')[0] || 'Unknown'}</p>
                        <p className="text-xs text-gray-400 truncate">{ride.destination}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-3">
                      <div>
                        <p className="text-sm text-gray-500">Vehicle</p>
                        <p className="font-medium text-gray-700">{ride.vehicle || 'Not specified'}</p>
                      </div>
                      {ride.driverName && (
                        <div>
                          <p className="text-sm text-gray-500">Driver</p>
                          <p className="font-medium text-gray-700">{ride.driverName}</p>
                        </div>
                      )}
                      {ride.paymentMethod && (
                        <div>
                          <p className="text-sm text-gray-500">Payment</p>
                          <p className="font-medium text-gray-700">{ride.paymentMethod} ({ride.paymentStatus || 'pending'})</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Fare */}
                  <div className="mt-4 md:mt-0 md:text-right">
                    <p className="text-2xl font-bold text-indigo-600 mb-2">₹{ride.fare || '0'}</p>
                    {ride.distance && (
                      <p className="text-sm text-gray-500">Distance: {ride.distance} km</p>
                    )}
                    {ride.duration && (
                      <p className="text-sm text-gray-500">Duration: {ride.duration} min</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* User Info */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing ride history for <span className="font-semibold">{user?.email}</span>
          </p>
          <button
            onClick={handleGoToHomepage}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 text-sm"
          >
            <span>🏠</span>
            Back to Homepage
          </button>
        </div>
      </div>
    </div>
  );
}