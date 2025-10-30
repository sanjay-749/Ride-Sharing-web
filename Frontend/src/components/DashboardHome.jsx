import React, { useEffect, useState } from "react";
import axios from "axios";
import StatsCard from "./StatsCard";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Users, Car, Clock, TrendingUp, AlertCircle } from "lucide-react";
import { useAdmin } from "../context/AdminContext.jsx";

const DashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentDrivers, setRecentDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { logout } = useAdmin();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const [statsResponse, usersResponse, driversResponse] = await Promise.all([
          axios.get("http://localhost:8080/api/admin/dashboard/stats", {
            headers: { 
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
          }),
          axios.get("http://localhost:8080/api/admin/users", {
            headers: { 
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
          }),
          axios.get("http://localhost:8080/api/admin/drivers", {
            headers: { 
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
          })
        ]);

        setStats(statsResponse.data);
        setRecentUsers(usersResponse.data.slice(0, 5)); // Last 5 users
        setRecentDrivers(driversResponse.data.slice(0, 5)); // Last 5 drivers
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        if (err.response?.status === 401) {
          setError("Session expired. Please login again.");
          logout();
        } else {
          setError("Failed to load dashboard data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [logout]);

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "violet",
      description: "Registered users"
    },
    {
      title: "Approved Drivers",
      value: stats?.totalDrivers || 0,
      icon: Car,
      color: "violet",
      description: "Active drivers"
    },
    {
      title: "Pending Drivers",
      value: stats?.pendingDrivers || 0,
      icon: Clock,
      color: "orange",
      description: "Awaiting approval"
    },
    {
      title: "Total Rides",
      value: stats?.totalRides || 0,
      icon: TrendingUp,
      color: "violet",
      description: "Completed rides"
    }
  ];

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Dashboard" />
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-violet-600 border-solid"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Dashboard Overview" />
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <AlertCircle size={20} />
              {error}
            </div>
          )}
          
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((card, index) => (
              <StatsCard
                key={index}
                title={card.title}
                value={card.value}
                icon={card.icon}
                color={card.color}
                description={card.description}
              />
            ))}
          </div>

          {/* Recent Activity and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <div className="violet-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => window.location.href = "/users"}
                  className="w-full text-left p-4 hover:bg-violet-50 rounded-lg border border-gray-200 transition-all duration-200 hover:border-violet-300 flex items-center gap-3"
                >
                  <Users size={20} className="text-violet-600" />
                  <span className="text-gray-700">Manage Users</span>
                </button>
                <button 
                  onClick={() => window.location.href = "/drivers"}
                  className="w-full text-left p-4 hover:bg-violet-50 rounded-lg border border-gray-200 transition-all duration-200 hover:border-violet-300 flex items-center gap-3"
                >
                  <Car size={20} className="text-violet-600" />
                  <span className="text-gray-700">Manage Drivers</span>
                </button>
                <button 
                  onClick={() => window.location.href = "/pending-drivers"}
                  className="w-full text-left p-4 hover:bg-violet-50 rounded-lg border border-gray-200 transition-all duration-200 hover:border-violet-300 flex items-center gap-3"
                >
                  <Clock size={20} className="text-orange-500" />
                  <span className="text-gray-700">Pending Driver Approvals</span>
                </button>
              </div>
            </div>

            {/* Recent Users */}
            <div className="violet-card p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Users</h3>
              <div className="space-y-3">
                {recentUsers.length > 0 ? recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                        <Users size={16} className="text-violet-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                )) : (
                  <p className="text-gray-500 text-center py-4">No users found</p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Drivers */}
          <div className="violet-card p-6 mt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Drivers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentDrivers.length > 0 ? recentDrivers.map((driver) => (
                <div key={driver.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
                      <Car size={18} className="text-violet-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {driver.firstName} {driver.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{driver.email}</p>
                      <p className="text-xs text-gray-500">{driver.vehicleType} • {driver.vehicleNumber}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    driver.approved 
                      ? driver.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {driver.approved ? (driver.active ? 'Active' : 'Inactive') : 'Pending'}
                  </span>
                </div>
              )) : (
                <p className="text-gray-500 text-center py-4 col-span-2">No drivers found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;