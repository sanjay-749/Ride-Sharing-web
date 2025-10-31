// src/pages/driver/Loader.jsx
import React from "react";
import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-white to-blue-50 px-4">
      <motion.div 
        className="relative w-24 h-24"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      >
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-[#1D4ED8] border-t-transparent"></div>
        <div className="absolute top-2 left-2 w-20 h-20 rounded-full border-4 border-[#3B82F6] border-b-transparent"></div>
      </motion.div>

      <motion.h2 
        className="text-[#1E3A8A] font-semibold mt-6 text-xl"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
      >
        Loading your dashboard... 🚀
      </motion.h2>

      <motion.p
        className="text-[#F59E0B] mt-2 text-sm text-center"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        Please wait a moment
      </motion.p>
    </div>
  );
}
