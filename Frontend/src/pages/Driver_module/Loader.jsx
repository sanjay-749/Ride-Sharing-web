// src/pages/driver_module/Loader.jsx
import React from "react";

export default function Loader() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-white to-blue-50">
      <div className="relative w-20 h-20">
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-blue-700 border-t-transparent animate-spin"></div>
        <div className="absolute top-2 left-2 w-16 h-16 rounded-full border-4 border-blue-400 border-b-transparent animate-pulse"></div>
      </div>
      <h2 className="text-blue-800 font-semibold mt-6 text-xl animate-pulse">
        Loading your dashboard...
      </h2>
    </div>
  );
}
