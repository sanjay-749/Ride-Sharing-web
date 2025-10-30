import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import DashboardHome from "../components/DashboardHome";

const AdminDashboardPage = () => (
  <div className="flex">
    <Sidebar />
    <div className="flex-1 min-h-screen bg-gray-100">
      <Header title="Dashboard" />
      <DashboardHome />
    </div>
  </div>
);

export default AdminDashboardPage;
