// src/services/driverService.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/driver";

export const loginDriver = async (credentials) => {
  const res = await axios.post(`${API_URL}/login`, credentials);
  return res.data;
};

export const getDriverProfile = async () => {
  const res = await axios.get(`${API_URL}/profile`);
  return res.data;
};

export const updateDriverProfile = async (profile) => {
  const res = await axios.put(`${API_URL}/profile`, profile);
  return res.data;
};

export const getRideOffers = async () => {
  const res = await axios.get(`${API_URL}/rides/offers`);
  return res.data;
};

export const acceptRide = async (rideId) => {
  const res = await axios.post(`${API_URL}/rides/${rideId}/accept`);
  return res.data;
};

export const updateRideStatus = async (rideId, status) => {
  const res = await axios.put(`${API_URL}/rides/${rideId}/status`, { status });
  return res.data;
};
// src/services/driverService.js
export const getEarnings = async () => {
  const res = await axios.get(`${API_URL}/earnings`);
  return res.data;
};