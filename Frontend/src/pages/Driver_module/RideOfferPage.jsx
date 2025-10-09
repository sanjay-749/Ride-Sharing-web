import React, { useContext } from "react";
import { RideContext } from "../../context/RideContext";
import { useNavigate } from "react-router-dom";

const RideOfferPage = () => {
  const { rideRequests, setCurrentRide } = useContext(RideContext);
  const navigate = useNavigate();

  if (rideRequests.length === 0) return <p className="p-6 text-secondary">No ride offers available.</p>;

  const ride = rideRequests[0];

  const acceptRide = () => {
    setCurrentRide(ride);
    navigate("/driver/ride-in-progress");
  };

  const declineRide = () => {
    // Remove ride from list (simulate decline)
    rideRequests.shift();
    setCurrentRide(null);
    navigate("/driver/dashboard");
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center">
      <div className="card w-full max-w-lg">
        <h2 className="text-2xl font-bold text-primary mb-4">New Ride Request</h2>
        <p className="text-lg text-primary font-semibold mb-2">Pickup: {ride.pickup}</p>
        <p className="text-lg text-primary font-semibold mb-2">Drop: {ride.drop}</p>
        <p className="text-secondary mb-4">Fare: ₹{ride.fare}</p>
        <div className="flex gap-4">
          <button className="btn-primary w-1/2" onClick={acceptRide}>Accept</button>
          <button className="btn-secondary w-1/2" onClick={declineRide}>Decline</button>
        </div>
      </div>
    </div>
  );
};

export default RideOfferPage;
