// src/context/RideContext.jsx
import { createContext, useState, useEffect } from "react";
import {
  getRideOffers as getRideOffersService,
  acceptRide as acceptRideService,
  updateRideStatus as updateRideStatusService,
} from "../services/driverService";

export const RideContext = createContext();

export const RideProvider = ({ children }) => {
  const [rideOffers, setRideOffers] = useState([]);
  const [currentRide, setCurrentRide] = useState(null);

  // -------------------- Load current ride from localStorage -------------------- //
  useEffect(() => {
    const savedRide = localStorage.getItem("currentRide");
    if (savedRide) setCurrentRide(JSON.parse(savedRide));
  }, []);

  // -------------------- Persist current ride to localStorage -------------------- //
  useEffect(() => {
    if (currentRide) {
      localStorage.setItem("currentRide", JSON.stringify(currentRide));
    } else {
      localStorage.removeItem("currentRide");
    }
  }, [currentRide]);

  // -------------------- Fetch ride offers -------------------- //
  const fetchRideOffers = async () => {
    try {
      const rides = await getRideOffersService();
      // Only keep rides where status = "pending" and driver_id = null
      const pendingRides = rides.filter(
        (ride) => ride.status === "pending" && !ride.driverId
      );
      setRideOffers(pendingRides);
    } catch (err) {
      console.error("❌ Error fetching ride offers:", err.response?.data || err.message);
      setRideOffers([]);
    }
  };

  // -------------------- Accept ride -------------------- //
  const acceptRide = async (rideId) => {
    try {
      const ride = await acceptRideService(rideId); // service handles driverId internally
      setCurrentRide(ride);

      // Remove accepted ride from offer list
      setRideOffers((prev) => prev.filter((r) => r.id !== rideId));

      return ride;
    } catch (err) {
      console.error("❌ Error accepting ride:", err.response?.data || err.message);
      throw err;
    }
  };

  // -------------------- Update ride status -------------------- //
  const updateRideStatus = async (rideId, status) => {
    try {
      const ride = await updateRideStatusService(rideId, status);
      // Update current ride if it's the same ride
      if (currentRide?.id === rideId) {
        setCurrentRide(ride);
      }
      return ride;
    } catch (err) {
      console.error("❌ Error updating ride status:", err.response?.data || err.message);
      throw err;
    }
  };

  return (
    <RideContext.Provider
      value={{
        rideOffers,
        setRideOffers,
        currentRide,
        setCurrentRide,
        fetchRideOffers,
        acceptRide,
        updateRideStatus,
      }}
    >
      {children}
    </RideContext.Provider>
  );
};
