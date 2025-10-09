import React, { useEffect, useState } from "react";
import { getEarningsHistory } from "../../services/driverService";

const EarningsHistoryPage = () => {
  const [earnings, setEarnings] = useState([]);

  useEffect(() => {
    const fetchEarnings = async () => {
      const data = await getEarningsHistory(localStorage.getItem("driverToken"));
      setEarnings(data);
    };
    fetchEarnings();
  }, []);

  return (
    <div className="min-h-screen bg-background p-6">
      <h2 className="text-3xl font-bold text-primary mb-6">Earnings History</h2>
      <div className="grid gap-4">
        {earnings.length === 0 && <p className="text-secondary">No rides completed yet.</p>}
        {earnings.map((ride) => (
          <div key={ride.id} className="card flex justify-between items-center">
            <div>
              <p className="font-semibold text-primary">{ride.pickup} → {ride.drop}</p>
              <p className="text-secondary">{ride.date}</p>
            </div>
            <p className="font-bold text-primary">₹{ride.fare}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EarningsHistoryPage;
