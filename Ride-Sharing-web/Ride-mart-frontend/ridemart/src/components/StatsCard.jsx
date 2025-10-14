// src/components/StatsCard.jsx
import React from 'react';

export default function StatsCard({ title, value }) {
  return (
    <div style={{
      background: '#fff',
      padding: '15px',
      margin: '10px 0',
      borderRadius: '8px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      minWidth: '150px',
      textAlign: 'center'
    }}>
      <h3>{title}</h3>
      <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{value}</p>
    </div>
  );
}
