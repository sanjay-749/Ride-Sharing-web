import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut, Settings, Edit2, User, Mail, Phone, MapPin, Calendar } from "lucide-react";

export default function UserProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError("");
      
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch profile data");
      }

      setProfileData(result);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile data");
      // Create mock data for demo
      setProfileData({
        id: user?.sub || "USER001",
        name: user?.sub || "User",
        email: user?.email || "user@example.com",
        phone: "+91 9876543210",
        address: "Chennai, Tamil Nadu",
        joinDate: "2024-01-15",
        totalRides: 12,
        memberSince: "3 months"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleEditProfile = () => {
    // Navigate to edit profile page or show edit modal
    alert("Edit profile feature coming soon!");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-white to-indigo-100">
        <p className="text-gray-600 text-lg animate-pulse">No user data found. Redirecting...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-200 text-center">
          <div className="flex justify-center items-center space-x-3">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-200">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-indigo-600">My Profile</h1>
            <p className="text-gray-600 mt-2">Manage your account information</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition duration-300"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-yellow-700 text-sm">{error}</p>
            <p className="text-yellow-600 text-xs mt-1">Showing demo data</p>
          </div>
        )}

        {/* Avatar + Basic Info */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
              {profileData?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <span className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-3xl font-semibold text-gray-800">{profileData?.name}</h2>
            <p className="text-gray-600 text-lg">{profileData?.email}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>Joined {profileData?.joinDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <User size={16} />
                <span>{profileData?.totalRides || 0} rides</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white/80 p-6 rounded-2xl shadow-md border border-gray-100 space-y-4 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <User size={20} />
            Personal Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50 transition duration-200">
              <div className="flex items-center gap-3">
                <User size={18} className="text-gray-500" />
                <span className="text-gray-700 font-medium">Full Name</span>
              </div>
              <span className="text-gray-600">{profileData?.name}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50 transition duration-200">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-gray-500" />
                <span className="text-gray-700 font-medium">Email</span>
              </div>
              <span className="text-gray-600">{profileData?.email}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50 transition duration-200">
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-gray-500" />
                <span className="text-gray-700 font-medium">Phone</span>
              </div>
              <span className="text-gray-600">{profileData?.phone || "Not provided"}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50 transition duration-200">
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-gray-500" />
                <span className="text-gray-700 font-medium">Location</span>
              </div>
              <span className="text-gray-600">{profileData?.address || "Not provided"}</span>
            </div>
          </div>
        </div>

        {/* Ride Statistics */}
        <div className="bg-white/80 p-6 rounded-2xl shadow-md border border-gray-100 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Ride Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">{profileData?.totalRides || 0}</div>
              <div className="text-sm text-gray-600">Total Rides</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">{profileData?.completedRides || profileData?.totalRides || 0}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600">{profileData?.cancelledRides || 0}</div>
              <div className="text-sm text-gray-600">Cancelled</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <div className="text-2xl font-bold text-orange-600">{profileData?.memberSince || "3m"}</div>
              <div className="text-sm text-gray-600">Member Since</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={handleEditProfile}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition duration-300 shadow-md"
          >
            <Edit2 size={18} /> Edit Profile
          </button>
          <button 
            onClick={() => navigate("/history")}
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition duration-300 shadow-md"
          >
            <User size={18} /> View Ride History
          </button>
          <button className="flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 transition duration-300 shadow-md">
            <Settings size={18} /> Settings
          </button>
        </div>

        {/* Last Updated */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Profile last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}