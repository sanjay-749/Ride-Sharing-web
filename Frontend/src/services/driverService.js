// single service file with axios configured inline
import axios from "axios";

const BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080/api/driver";

const api = axios.create({
  baseURL: BASE,
  timeout: 20000,
});

// attach token dynamically before requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("driverToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const loginDriver = async (credentials) => {
  // POST /login -> { token, driver }
  const res = await api.post("/login", credentials);
  return res.data;
};

// Ride offers
export const getRideOffers = async () => {
  const res = await api.get("/ride-offers"); // GET /ride-offers
  return res.data;
};

export const acceptRide = async (rideId) => {
  const res = await api.post(`/ride/${rideId}/accept`); // POST /ride/:id/accept
  return res.data;
};

export const updateRideStatus = async (rideId, status) => {
  const res = await api.put(`/ride/${rideId}/status`, { status }); // PUT /ride/:id/status
  return res.data;
};

// Earnings
export const getEarnings = async () => {
  const res = await api.get("/earnings"); // GET /earnings
  return res.data;
};

// Profile
export const getDriverProfile = async () => {
  const res = await api.get("/profile"); // GET /profile
  return res.data;
};
export const updateDriverProfile = async (payload) => {
  const res = await api.put("/profile", payload); // PUT /profile
  return res.data;
};

// Live location send
export const sendDriverLocation = async (lat, lng) => {
  // POST /location { lat, lng }
  const res = await api.post("/location", { lat, lng });
  return res.data;
};
