import React, { createContext, useState } from "react";

export const RideContext = createContext();

export const RideProvider = ({ children }) => {
  const [rideRequests, setRideRequests] = useState([]);
  const [currentRide, setCurrentRide] = useState(null);

  const addRideRequest = (ride) => setRideRequests(prev => [...prev, ride]);
  const removeRideRequest = (id) => setRideRequests(prev => prev.filter(r => r.id !== id));

  return (
    <RideContext.Provider value={{
      rideRequests,
      addRideRequest,
      removeRideRequest,
      currentRide,
      setCurrentRide
    }}>
      {children}
    </RideContext.Provider>
  );
};
