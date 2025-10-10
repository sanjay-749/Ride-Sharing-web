// src/pages/driver/DriverProfilePage.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Phone, Mail, Car, X } from "lucide-react";
import DriverLayout from "../../component/driver/DriverLayout";

export default function DriverProfilePage() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "driver@example.com",
    phone: "+91 9876543210",
    vehicle: "Toyota Prius - KA 01 AB 1234",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  const handleEdit = () => {
    setFormData(profile);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile(formData);
    setIsEditing(false);
  };

  return (
    <DriverLayout>
      {/* Page Header */}
      <div className="text-center mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400"
        >
          Driver Profile
        </motion.h1>
        <p className="text-gray-500 mt-2">
          Manage your personal and vehicle information
        </p>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-gray-100"
      >
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {profile.name[0]}
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={handleEdit}
              className="absolute bottom-2 right-2 bg-white shadow-md p-2 rounded-full hover:bg-gray-100"
            >
              <Edit2 className="w-5 h-5 text-gray-600" />
            </motion.button>
          </div>
          <div className="sm:ml-8 text-center sm:text-left mt-4 sm:mt-0">
            <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
            <p className="text-gray-500">{profile.email}</p>
            <div className="mt-3 inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
              Verified Driver
            </div>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ProfileInfo label="Email" value={profile.email} icon={<Mail />} />
          <ProfileInfo label="Phone" value={profile.phone} icon={<Phone />} />
          <ProfileInfo label="Vehicle" value={profile.vehicle} icon={<Car />} />
        </div>

        {/* Edit Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleEdit}
          className="mt-10 w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition duration-300"
        >
          Edit Profile
        </motion.button>
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl p-8 w-96 relative"
            >
              <button
                onClick={() => setIsEditing(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <X size={22} />
              </button>
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                Edit Profile
              </h2>

              {Object.keys(formData).map((key) => (
                <div key={key} className="mb-4">
                  <label className="text-sm font-semibold text-gray-600 capitalize">
                    {key}
                  </label>
                  <input
                    type="text"
                    value={formData[key]}
                    onChange={(e) =>
                      setFormData({ ...formData, [key]: e.target.value })
                    }
                    className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                </div>
              ))}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="mt-4 w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-2 rounded-lg font-semibold shadow hover:shadow-lg"
              >
                Save Changes
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DriverLayout>
  );
}

function ProfileInfo({ label, value, icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="flex items-center gap-4 bg-gray-50 hover:bg-gray-100 p-5 rounded-2xl shadow-sm transition-all duration-200"
    >
      <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl shadow-md">
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-gray-800 font-medium">{value}</p>
      </div>
    </motion.div>
  );
}
