import React from "react";
import { useAdmin } from "../context/AdminContext.jsx";

const Header = ({ title }) => {
  const { admin, logout } = useAdmin();

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">{title}</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          Welcome, {admin?.username || "Admin"}
        </span>
        <button 
          onClick={logout}
          className="text-sm text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;