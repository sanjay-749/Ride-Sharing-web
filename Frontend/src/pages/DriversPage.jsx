import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Car, Search, Filter, CheckCircle, XCircle, MoreVertical } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

const DriversPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { logout } = useAdmin();

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get("http://localhost:8080/api/admin/drivers/approved", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      setDrivers(response.data);
    } catch (err) {
      console.error("Error fetching drivers:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        logout();
      } else {
        setError("Failed to load drivers");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateDriver = async (driverId) => {
    if (!window.confirm("Are you sure you want to deactivate this driver?")) return;
    
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(`http://localhost:8080/api/admin/drivers/${driverId}/deactivate`, {}, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      fetchDrivers();
    } catch (err) {
      console.error("Error deactivating driver:", err);
      alert("Failed to deactivate driver");
    }
  };

  const handleActivateDriver = async (driverId) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(`http://localhost:8080/api/admin/drivers/${driverId}/activate`, {}, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      fetchDrivers();
    } catch (err) {
      console.error("Error activating driver:", err);
      alert("Failed to activate driver");
    }
  };

  const filteredDrivers = drivers.filter(driver =>
    driver.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Manage Drivers" />
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
        <Header title="Manage Drivers" />
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Drivers Management</h1>
              <p className="text-gray-600">Manage approved drivers and their status</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search drivers..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="violet-btn-outline flex items-center gap-2">
                <Filter size={18} />
                Filter
              </button>
            </div>
          </div>

          {/* Drivers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrivers.map((driver) => (
              <div key={driver.id} className="violet-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                      <Car size={24} className="text-violet-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {driver.firstName} {driver.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">{driver.email}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    driver.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {driver.active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between">
                    <span>Phone:</span>
                    <span className="font-medium">{driver.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>License:</span>
                    <span className="font-medium">{driver.licenseNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vehicle:</span>
                    <span className="font-medium">{driver.vehicleType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Plate No:</span>
                    <span className="font-medium">{driver.vehicleNumber}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {driver.active ? (
                    <button
                      onClick={() => handleDeactivateDriver(driver.id)}
                      className="flex-1 bg-red-100 text-red-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors flex items-center justify-center gap-1"
                    >
                      <XCircle size={16} />
                      Deactivate
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActivateDriver(driver.id)}
                      className="flex-1 bg-green-100 text-green-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle size={16} />
                      Activate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredDrivers.length === 0 && (
            <div className="text-center py-12">
              <Car size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No drivers found</p>
              <p className="text-gray-400">No approved drivers match your search criteria</p>
            </div>
          )}

          {/* Summary Cards */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="violet-card p-4 text-center">
              <div className="text-2xl font-bold text-violet-600">{drivers.length}</div>
              <div className="text-gray-600">Total Drivers</div>
            </div>
            <div className="violet-card p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {drivers.filter(d => d.active).length}
              </div>
              <div className="text-gray-600">Active Drivers</div>
            </div>
            <div className="violet-card p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {drivers.filter(d => !d.active).length}
              </div>
              <div className="text-gray-600">Inactive Drivers</div>
            </div>
            <div className="violet-card p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {drivers.filter(d => d.approved && !d.active).length}
              </div>
              <div className="text-gray-600">Suspended</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriversPage;