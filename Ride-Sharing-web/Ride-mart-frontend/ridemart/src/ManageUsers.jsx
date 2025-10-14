
// src/pages/ManageUsers.jsx
import React from 'react';

const users = [
  { id: 1, name: 'Ashok', email: 'ashok@example.com' },
  { id: 2, name: 'Priya', email: 'priya@example.com' },
  { id: 3, name: 'Ravi', email: 'ravi@example.com' },
];

export default function ManageUsers() {
  return (
    <div>
      <h2>Manage Users</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} style={{ borderBottom: '1px solid #ccc' }}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
