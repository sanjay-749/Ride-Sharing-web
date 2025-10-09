import React, { useContext, useState } from "react";
import { RideContext } from "../../context/RideContext";
import { updateRideStatus } from "../../services/driverService";

const RideInProgressPage = () => {
  const { currentRide } = useContext(RideContext);
  const [status, setStatus] = useState("Arrived");

  if (!currentRide) return <p className="p-6 text-secondary">No active ride.</p>;

  const nextStatus = async () => {
    let newStatus;
    if (status === "Arrived") newStatus = "Started";
    else if (status === "Started") newStatus = "Completed";
    else return;

    await updateRideStatus(currentRide.id, newStatus, localStorage.getItem("driverToken"));
    setStatus(newStatus);
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center">
      <div className="card w-full max-w-lg text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">Ride In Progress</h2>
        <p className="text-lg text-primary mb-2">Pickup: {currentRide.pickup}</p>
        <p className="text-lg text-primary mb-2">Drop: {currentRide.drop}</p>
        <p className="text-secondary mb-4">Fare: ₹{currentRide.fare}</p>
        <p className="text-info font-semibold mb-4">Current Status: {status}</p>
        {status !== "Completed" && (
          <button className="btn-primary w-full" onClick={nextStatus}>Next Status</button>
        )}
        {status === "Completed" && <p className="text-success font-semibold">Ride Completed!</p>}
      </div>
    </div>
  );
};

export default RideInProgressPage;
