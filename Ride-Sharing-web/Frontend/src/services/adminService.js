import axios from 'axios';
const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const adminLogin = (credentials) =>
  axios.post(`${API}/admin/login`, credentials);

export const getAllUsers = (token) =>
  axios.get(`${API}/admin/users`, { headers: { Authorization: `Bearer ${token}` }});
