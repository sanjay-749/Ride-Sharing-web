import React, { useState } from "react";
import DriverNavbar from "./DriverNavbar";
import DriverSidebar from "./DriverSidebar";

export default function DriverLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true); // sidebar expanded by default

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <DriverSidebar isOpen={sidebarOpen} />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300`}
        style={{ marginLeft: sidebarOpen ? 250 : 70 }} // dynamically push content
      >
        <DriverNavbar
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          onLogout={() => console.log("Logout")}
        />
        <main className="p-6 bg-gray-50 flex-1">{children}</main>
      </div>
    </div>
  );
}
