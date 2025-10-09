import axios from "axios";

const API_URL = "http://localhost:8080/api/driver";

export const driverLogin = async (credentials) => {
  const res = await axios.post(`${API_URL}/login`, credentials);
  return res.data;
};

export const getDashboardData = async (token) => {
  const res = await axios.get(`${API_URL}/dashboard`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getRideRequests = async (token) => {
  const res = await axios.get(`${API_URL}/ride-requests`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateRideStatus = async (rideId, status, token) => {
  const res = await axios.put(`${API_URL}/ride/${rideId}/status`, { status }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getEarningsHistory = async (token) => {
  const res = await axios.get(`${API_URL}/earnings`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateDriverProfile = async (data, token) => {
  const res = await axios.put(`${API_URL}/profile`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
