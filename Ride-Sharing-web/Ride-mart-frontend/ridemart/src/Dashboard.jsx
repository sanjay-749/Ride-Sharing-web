// src/pages/Dashboard.jsx
import React from 'react';
import StatsCard from '../components/StatsCard';

const stats = [
  { title: 'Total Users', value: 120 },
  { title: 'Total Drivers', value: 45 },
  { title: 'Total Rides', value: 350 },
];

export default function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {stats.map((stat, index) => (
          <StatsCard key={index} title={stat.title} value={stat.value} />
        ))}
      </div>
    </div>
  );
  

}
