import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getDashboardData, getRideRequests } from "../../services/driverService";
import { RideContext } from "../../context/RideContext";
import { useNavigate } from "react-router-dom";

const DriverDashboard = () => {
  const { driver, token } = useContext(AuthContext);
  const { rideRequests, addRideRequest } = useContext(RideContext);
  const [dashboardData, setDashboardData] = useState({});
  const [online, setOnline] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardData(token);
        setDashboardData(data);
        const rides = await getRideRequests(token);
        rides.forEach(ride => addRideRequest(ride));
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [token]);

  const toggleOnline = () => setOnline(!online);

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Welcome, {driver?.name}</h1>
        <button
          onClick={toggleOnline}
          className={`btn-primary ${online ? "bg-success hover:bg-green-700" : "bg-danger hover:bg-red-700"}`}
        >
          {online ? "Online" : "Offline"}
        </button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card dashboard-card">
          <h2 className="text-lg font-semibold text-primary mb-2">Total Rides</h2>
          <p className="text-2xl font-bold">{dashboardData.totalRides || 0}</p>
        </div>
        <div className="card dashboard-card">
          <h2 className="text-lg font-semibold text-primary mb-2">Earnings</h2>
          <p className="text-2xl font-bold">₹{dashboardData.totalEarnings || 0}</p>
        </div>
        <div className="card dashboard-card">
          <h2 className="text-lg font-semibold text-primary mb-2">Pending Requests</h2>
          <p className="text-2xl font-bold">{rideRequests.length}</p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-primary mb-4">Incoming Ride Requests</h2>
        {rideRequests.length === 0 && <p className="text-secondary">No new ride requests</p>}
        <div className="space-y-4">
          {rideRequests.map((ride) => (
            <div key={ride.id} className="card flex justify-between items-center">
              <div>
                <p className="font-semibold text-primary">{ride.pickup} → {ride.drop}</p>
                <p className="text-secondary">Fare: ₹{ride.fare}</p>
              </div>
              <button
                onClick={() => navigate("/driver/ride-offer")}
                className="btn-primary"
              >
                View
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DriverDashboard;
