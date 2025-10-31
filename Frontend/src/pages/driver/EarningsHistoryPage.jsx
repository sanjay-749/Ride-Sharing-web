// src/pages/driver/EarningsHistoryPage.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DriverLayout from "../../component/driver/DriverLayout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getEarnings } from "../../services/driverService";

export default function EarningsHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [earningsData, setEarningsData] = useState([]);
  const [summary, setSummary] = useState({
    totalEarnings: 0,
    completedRides: 0,
    averagePerRide: 0,
  });

  useEffect(() => {
    async function fetchEarnings() {
      try {
        const data = await getEarnings(); // fetch from backend

        // Process completed rides for chart & table
        const rides = data.completedRides || [];
        const chartData = rides.map((ride) => ({
          date: new Date(ride.rideTime).toLocaleDateString("en-US", { day: "2-digit", month: "short" }),
          earnings: 100, // Fixed earnings per ride in your backend
          rideId: ride.id,
          status: ride.status,
        }));

        const totalEarnings = chartData.reduce((sum, r) => sum + r.earnings, 0);
        const completedRidesCount = chartData.length;
        const averagePerRide = completedRidesCount ? totalEarnings / completedRidesCount : 0;

        setEarningsData(chartData);
        setSummary({ totalEarnings, completedRides: completedRidesCount, averagePerRide });
      } catch (err) {
        console.error("Failed to load earnings data:", err);
        alert("Failed to load earnings data");
      } finally {
        setLoading(false);
      }
    }

    fetchEarnings();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading earnings data...</p>;

  return (
    <DriverLayout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Earnings & History</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div whileHover={{ scale: 1.05 }} className="p-6 bg-white rounded-xl shadow-md flex flex-col items-center justify-center">
          <p className="text-gray-500">Total Earnings</p>
          <h2 className="text-2xl font-bold">₹{summary.totalEarnings}</h2>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="p-6 bg-white rounded-xl shadow-md flex flex-col items-center justify-center">
          <p className="text-gray-500">Rides Completed</p>
          <h2 className="text-2xl font-bold">{summary.completedRides}</h2>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="p-6 bg-white rounded-xl shadow-md flex flex-col items-center justify-center">
          <p className="text-gray-500">Average per Ride</p>
          <h2 className="text-2xl font-bold">₹{Math.round(summary.averagePerRide)}</h2>
        </motion.div>
      </div>

      {/* Earnings Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Earnings in Last 7 Days</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={earningsData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="earnings" stroke="#1D4ED8" strokeWidth={3} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Rides Table */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Rides</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Ride ID</th>
                <th className="py-2 px-4">Earnings</th>
                <th className="py-2 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {earningsData.map((ride, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-4">{ride.date}</td>
                  <td className="py-2 px-4">#{ride.rideId}</td>
                  <td className="py-2 px-4">₹{ride.earnings}</td>
                  <td className="py-2 px-4 text-green-600 font-semibold">{ride.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DriverLayout>
  );
}
