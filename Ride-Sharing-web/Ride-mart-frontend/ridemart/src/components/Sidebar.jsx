import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const linkStyle = ({ isActive }) => ({
    display: 'block',
    padding: '10px 15px',
    margin: '5px 0',
    color: isActive ? '#fff' : '#333',
    background: isActive ? '#007bff' : 'transparent',
    textDecoration: 'none',
    borderRadius: '5px'
  });

  return (
    <div style={{ width: '200px', background: '#f0f0f0', height: '100vh', padding: '20px' }}>
      <h2>RideMart Admin</h2>
      <NavLink to="/dashboard" style={linkStyle}>Dashboard</NavLink>
      <NavLink to="/users" style={linkStyle}>Manage Users</NavLink>
      <NavLink to="/drivers" style={linkStyle}>Manage Drivers</NavLink>
      <NavLink to="/rides" style={linkStyle}>Manage Rides</NavLink>
      <NavLink to="/reports" style={linkStyle}>Reports</NavLink>
    </div>
  );
}
