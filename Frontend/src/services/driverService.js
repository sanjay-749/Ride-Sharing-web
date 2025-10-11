// src/services/driverService.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/drivers"; // make sure it matches your backend

// Driver Signup
export const addDriver = async (driverData) => {
  const res = await axios.post(`${API_URL}`, driverData);
  return res.data;
};

// Driver Login
export const loginDriver = async (credentials) => {
  const res = await axios.post(`${API_URL}/login`, credentials);
  return res.data;
};

// Get Driver Profile
export const getDriverProfile = async () => {
  const res = await axios.get(`${API_URL}/profile`);
  return res.data;
};

// Update Driver Profile
export const updateDriverProfile = async (profile) => {
  const res = await axios.put(`${API_URL}/profile`, profile);
  return res.data;
};

// Get Ride Offers
export const getRideOffers = async () => {
  const res = await axios.get(`${API_URL}/rides/offers`);
  return res.data;
};

// Accept Ride
export const acceptRide = async (rideId) => {
  const res = await axios.post(`${API_URL}/rides/${rideId}/accept`);
  return res.data;
};

// Update Ride Status
export const updateRideStatus = async (rideId, status) => {
  const res = await axios.put(`${API_URL}/rides/${rideId}/status`, { status });
  return res.data;
};

// Get Earnings
export const getEarnings = async () => {
  const res = await axios.get(`${API_URL}/earnings`);
  return res.data;
};
