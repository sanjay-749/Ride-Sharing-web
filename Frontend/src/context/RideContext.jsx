// src/context/RideContext.jsx
import { createContext, useState } from "react";

export const RideContext = createContext();

export const RideProvider = ({ children }) => {
  const [rideOffers, setRideOffers] = useState([]);
  const [currentRide, setCurrentRide] = useState(null);

  return (
    <RideContext.Provider value={{ rideOffers, setRideOffers, currentRide, setCurrentRide }}>
      {children}
    </RideContext.Provider>
  );
};
