import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { loginDriver } from "../../services/driverService";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function DriverLoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await loginDriver({ email, password });
      if (data?.token) {
        localStorage.setItem("driverToken", data.token);
        localStorage.setItem("driver", JSON.stringify(data.driver));
      }
      // also call AuthContext.login wrapper to set state
      await login(email, password); // this will call loginDriver again inside context, but keeps compatibility if you prefer context wrapper
      navigate("/driver/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-md bg-white p-8 rounded-2xl shadow border border-gray-200">
        <h1 className="text-3xl font-bold text-[#1E3A8A] text-center mb-4">Driver Login</h1>

        {error && <div className="text-red-600 text-center mb-4">{error}</div>}

        <form onSubmit={onSubmit} className="space-y-4">
          <input className="w-full p-3 border rounded-md focus:ring-2 focus:ring-[#1E3A8A] outline-none" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          <input className="w-full p-3 border rounded-md focus:ring-2 focus:ring-[#1E3A8A] outline-none" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          <button type="submit" className="w-full py-3 bg-[#1E3A8A] text-white rounded-md font-semibold hover:bg-[#0F4C81] transition">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
