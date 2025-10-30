import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { User, Mail, Shield, Save, Edit } from "lucide-react";
import { useAdmin } from "../context/AdminContext";

const AdminProfilePage = () => {
  const { admin } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: admin?.username || "admin",
    email: "admin@ridemart.com",
    role: admin?.role || "ADMIN",
    permissions: admin?.permissions || "ALL"
  });

  const handleSave = () => {
    // In a real app, you would make an API call here
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Admin Profile" />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="violet-card p-8 text-center mb-6">
              <div className="w-24 h-24 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={48} className="text-violet-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{profile.username}</h1>
              <p className="text-gray-600 mb-4">{profile.email}</p>
              <div className="flex justify-center gap-2">
                <span className="bg-violet-100 text-violet-800 px-3 py-1 rounded-full text-sm font-medium">
                  {profile.role}
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {profile.permissions}
                </span>
              </div>
            </div>

            {/* Profile Form */}
            <div className="violet-card p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="violet-btn-outline flex items-center gap-2"
                >
                  {isEditing ? <Save size={18} /> : <Edit size={18} />}
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User size={16} className="inline mr-2" />
                    Username
                  </label>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) => setProfile({...profile, username: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail size={16} className="inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Shield size={16} className="inline mr-2" />
                    Role
                  </label>
                  <input
                    type="text"
                    value={profile.role}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permissions
                  </label>
                  <input
                    type="text"
                    value={profile.permissions}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSave}
                    className="violet-btn flex items-center gap-2"
                  >
                    <Save size={18} />
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Security Section */}
            <div className="violet-card p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Security</h2>
              <div className="space-y-4">
                <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-violet-50 transition-colors">
                  <div className="font-medium text-gray-800">Change Password</div>
                  <div className="text-sm text-gray-600">Update your password regularly</div>
                </button>
                <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-violet-50 transition-colors">
                  <div className="font-medium text-gray-800">Two-Factor Authentication</div>
                  <div className="text-sm text-gray-600">Add an extra layer of security</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;