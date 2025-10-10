import React, { createContext, useState } from "react";

export const RideContext = createContext();

export const RideProvider = ({ children }) => {
  const [rideOffers, setRideOffers] = useState([]);      // list of offers
  const [currentRide, setCurrentRide] = useState(null);  // accepted ride

  return (
    <RideContext.Provider value={{ rideOffers, setRideOffers, currentRide, setCurrentRide }}>
      {children}
    </RideContext.Provider>
  );
};
