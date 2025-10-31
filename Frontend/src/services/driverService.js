// src/services/driverService.js
import axios from "axios";

// -------------------- BASE URLs -------------------- //
const DRIVER_API = "http://localhost:8080/api/drivers";
const RIDE_API = "http://localhost:8080/api/rides";

// -------------------- AUTH HELPERS -------------------- //
const getToken = () => localStorage.getItem("driverToken");

const axiosAuth = axios.create();
axiosAuth.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers['Content-Type'] = 'application/json';
  return config;
});

const getDriverInfo = () => {
  const driverInfo = JSON.parse(localStorage.getItem("driverInfo"));
  if (!driverInfo) throw new Error("Driver not logged in");
  return driverInfo;
};

// -------------------- DRIVER API -------------------- //
export const signupDriver = async (driverData) => {
  const res = await axios.post(`${DRIVER_API}/signup`, driverData, {
    headers: { 'Content-Type': 'application/json' }
  });
  return res.data;
};

export const loginDriver = async (credentials) => {
  const res = await axios.post(`${DRIVER_API}/login`, credentials, {
    headers: { 'Content-Type': 'application/json' }
  });
  return res.data;
};

export const getDriverProfile = async () => {
  const driverId = getDriverInfo().id;
  const res = await axiosAuth.get(`${DRIVER_API}/${driverId}`);
  return res.data;
};

export const updateDriverProfile = async (profile) => {
  const driverId = getDriverInfo().id;
  const res = await axiosAuth.put(`${DRIVER_API}/${driverId}`, profile);
  localStorage.setItem("driverInfo", JSON.stringify(res.data));
  return res.data;
};

export const getDriverSummary = async () => {
  const driverId = getDriverInfo().id;
  const res = await axiosAuth.get(`${DRIVER_API}/${driverId}/summary`);
  return res.data;
};

export const getEarnings = async () => {
  const driverId = getDriverInfo().id;
  const res = await axiosAuth.get(`${DRIVER_API}/${driverId}/earnings`);
  return res.data;
};

// -------------------- RIDE API -------------------- //
export const getRideOffers = async () => {
  const res = await axiosAuth.get(`${RIDE_API}/offers`);
  const rides = res.data.rides || [];

  return rides.map((ride) => ({
    id: ride.id,
    origin: ride.origin || "Unknown",
    destination: ride.destination || "Unknown",
    fare: ride.fare || 0,
    rideTime: ride.rideTime || ride.ride_time || null,
    status: ride.status,
    driverId: ride.driver ? ride.driver.id : null,
    rider: ride.rider
      ? { name: ride.rider.name || "Unknown", contact: ride.rider.contact || "Unknown" }
      : { name: "Unknown", contact: "Unknown" },
  }));
};

export const acceptRide = async (rideId) => {
  const driverId = getDriverInfo().id;
  const res = await axiosAuth.post(`${RIDE_API}/${rideId}/accept/${driverId}`);
  const ride = res.data.ride;

  return {
    id: ride.id,
    origin: ride.origin,
    destination: ride.destination,
    fare: ride.fare || 0,
    rideTime: ride.rideTime || ride.ride_time || null,
    status: ride.status,
    driverId: ride.driver ? ride.driver.id : null,
    rider: ride.rider
      ? { name: ride.rider.name || "Unknown", contact: ride.rider.contact || "Unknown" }
      : { name: "Unknown", contact: "Unknown" },
  };
};

export const updateRideStatus = async (rideId, status) => {
  const res = await axiosAuth.put(`${RIDE_API}/${rideId}/status`, { status });
  const ride = res.data.ride;

  return {
    id: ride.id,
    origin: ride.origin,
    destination: ride.destination,
    fare: ride.fare || 0,
    rideTime: ride.rideTime || ride.ride_time || null,
    status: ride.status,
    driverId: ride.driver ? ride.driver.id : null,
    rider: ride.rider
      ? { name: ride.rider.name || "Unknown", contact: ride.rider.contact || "Unknown" }
      : { name: "Unknown", contact: "Unknown" },
  };
};

// -------------------- Get current active ride for driver -------------------- //
export const getCurrentRide = async () => {
  const driverId = getDriverInfo().id;
  const res = await axiosAuth.get(`${RIDE_API}/driver/${driverId}/current`);

  if (res.data.ride) return res.data.ride;
  return null;
};
