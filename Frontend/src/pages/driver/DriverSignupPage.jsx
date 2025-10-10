// src/pages/driver/DriverSignupPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function DriverSignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // For demo, navigate to dashboard after signup
    navigate("/driver/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-cyan-400 to-blue-600 px-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full sm:w-96 p-8 bg-white rounded-3xl shadow-2xl border-t-4 border-cyan-700"
      >
        <div className="text-center mb-6">
          <span className="text-5xl animate-bounce">🛵</span>
          <h2 className="text-3xl font-bold text-cyan-700 mt-4">Sign Up</h2>
          <p className="text-gray-500 mt-1">Join as a driver and start earning!</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.input
            whileFocus={{ scale: 1.02, borderColor: "#06B6D4", boxShadow: "0 0 12px rgba(6,182,212,0.5)" }}
            type="text"
            placeholder="Full Name"
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none transition duration-300"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <motion.input
            whileFocus={{ scale: 1.02, borderColor: "#06B6D4", boxShadow: "0 0 12px rgba(6,182,212,0.5)" }}
            type="email"
            placeholder="Email"
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none transition duration-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <motion.input
            whileFocus={{ scale: 1.02, borderColor: "#06B6D4", boxShadow: "0 0 12px rgba(6,182,212,0.5)" }}
            type="password"
            placeholder="Password"
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none transition duration-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-cyan-700 text-white font-semibold py-3 px-5 rounded-xl hover:bg-cyan-800 transition duration-300"
          >
            Sign Up 🚀
          </motion.button>
        </form>
        <div className="text-center mt-6 text-gray-500">
          <p>
            Already have an account?{" "}
            <span className="text-cyan-700 cursor-pointer hover:underline" onClick={() => navigate("/driver/login")}>
              Login
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
