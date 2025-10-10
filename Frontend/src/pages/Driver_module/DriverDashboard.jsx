import React, { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { RideContext } from "../../context/RideContext";
import { getRideOffers } from "../../services/driverService";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaHistory, FaUser, FaCar } from "react-icons/fa";
import DriverMap from "../Driver_module/DriverMap";
import Loader from "../Driver_module/Loader";

export default function DriverDashboard() {
  const { driver, logout } = useContext(AuthContext);
  const { rideOffers, setRideOffers, setCurrentRide } = useContext(RideContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getRideOffers();
        setRideOffers(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const previewOffer = (offer) => {
    setCurrentRide(offer);
    navigate("/driver/offer");
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white p-6">
      {/* ===== HEADER ===== */}
      <header className="flex flex-wrap items-center justify-between mb-8 bg-white p-5 rounded-2xl shadow-md">
        <div>
          <h2 className="text-3xl font-extrabold text-[#0F4C81]">
            Welcome, {driver?.name || "Driver"}
          </h2>
          <p className="text-gray-600">Let’s make today productive 🚗</p>
        </div>

        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/driver/profile")}
            className="flex items-center gap-2 bg-blue-50 text-[#0F4C81] px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-blue-100"
          >
            <FaUser /> Profile
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              logout();
              navigate("/driver/login");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:bg-red-600"
          >
            Logout
          </motion.button>
        </div>
      </header>

      {/* ===== DRIVER SUMMARY ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
        >
          <h3 className="text-sm font-semibold text-gray-500">Total Offers</h3>
          <p className="text-3xl font-bold text-[#0F4C81] mt-2">
            {rideOffers.length}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          onClick={() => navigate("/driver/earnings")}
          className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition cursor-pointer"
        >
          <h3 className="text-sm font-semibold text-gray-500">Earnings</h3>
          <p className="text-3xl font-bold text-[#0F4C81] mt-2">₹ 0.00</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          onClick={() => navigate("/driver/in-progress")}
          className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition cursor-pointer"
        >
          <h3 className="text-sm font-semibold text-gray-500">In Progress</h3>
          <p className="text-3xl font-bold text-[#0F4C81] mt-2">—</p>
        </motion.div>
      </div>

      {/* ===== DRIVER MAP ===== */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-[#0F4C81] mb-4 flex items-center gap-2">
          <FaMapMarkerAlt className="text-[#1E3A8A]" />
          Your Current Location
        </h3>
        <DriverMap />
      </section>

      {/* ===== RIDE OFFERS ===== */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-[#0F4C81] flex items-center gap-2">
            <FaCar className="text-[#1E3A8A]" />
            Ride Offers
          </h3>
          <div className="text-sm text-gray-500">
            {loading ? "Loading..." : `${rideOffers.length} offers available`}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rideOffers.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-6 rounded-2xl shadow text-gray-600 text-center"
            >
              No offers available right now 🚘
            </motion.div>
          )}

          {rideOffers.map((o) => (
            <motion.div
              key={o.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-5 rounded-2xl shadow-md border border-blue-50 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-[#0F4C81] flex items-center gap-2">
                    <FaMapMarkerAlt /> {o.pickup}
                  </p>
                  <p className="text-gray-600">→ {o.drop}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#1E3A8A] font-bold">₹{o.fare}</p>
                  <p className="text-sm text-gray-500">
                    {o.eta ? `${o.eta} mins` : "—"}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => previewOffer(o)}
                  className="flex-1 bg-[#0F4C81] text-white py-2 rounded-lg hover:bg-[#1E3A8A] transition"
                >
                  View & Accept
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition"
                >
                  Skip
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== HISTORY BUTTON ===== */}
      <div className="text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/driver/history")}
          className="flex items-center justify-center mx-auto gap-2 text-[#0F4C81] font-semibold hover:text-[#1E3A8A] transition"
        >
          <FaHistory />
          View Ride History
        </motion.button>
      </div>
    </div>
  );
}
