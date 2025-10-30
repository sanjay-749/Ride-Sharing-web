import React from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  Clock,
  User 
} from "lucide-react";

const Sidebar = () => (
  <aside className="w-64 bg-white border-r h-screen p-5">
    <h2 className="text-2xl font-bold mb-8 text-blue-600">Admin Panel</h2>
    <nav className="space-y-2">
      <NavLink 
        to="/dashboard" 
        className={({ isActive }) => 
          `flex items-center gap-3 p-3 rounded-lg transition-colors ${
            isActive 
              ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" 
              : "text-gray-600 hover:bg-gray-50"
          }`
        }
      >
        <LayoutDashboard size={20} />
        <span>Dashboard</span>
      </NavLink>
      
      <NavLink 
        to="/users" 
        className={({ isActive }) => 
          `flex items-center gap-3 p-3 rounded-lg transition-colors ${
            isActive 
              ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" 
              : "text-gray-600 hover:bg-gray-50"
          }`
        }
      >
        <Users size={20} />
        <span>Users</span>
      </NavLink>
      
      <NavLink 
        to="/drivers" 
        className={({ isActive }) => 
          `flex items-center gap-3 p-3 rounded-lg transition-colors ${
            isActive 
              ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" 
              : "text-gray-600 hover:bg-gray-50"
          }`
        }
      >
        <Car size={20} />
        <span>Drivers</span>
      </NavLink>
      
      <NavLink 
        to="/pending-drivers" 
        className={({ isActive }) => 
          `flex items-center gap-3 p-3 rounded-lg transition-colors ${
            isActive 
              ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" 
              : "text-gray-600 hover:bg-gray-50"
          }`
        }
      >
        <Clock size={20} />
        <span>Pending Drivers</span>
      </NavLink>

      <NavLink 
        to="/profile" 
        className={({ isActive }) => 
          `flex items-center gap-3 p-3 rounded-lg transition-colors ${
            isActive 
              ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" 
              : "text-gray-600 hover:bg-gray-50"
          }`
        }
      >
        <User size={20} />
        <span>Profile</span>
      </NavLink>
    </nav>
  </aside>
);

export default Sidebar;