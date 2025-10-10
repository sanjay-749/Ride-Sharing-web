import React, { useEffect, useState } from "react";
import { getEarnings } from "../../services/driverService";
import { motion } from "framer-motion";

export default function EarningsHistoryPage() {
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getEarnings();
        setEarnings(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-white p-6">
      <h2 className="text-2xl font-bold text-[#1E3A8A] mb-4">Earnings history</h2>

      {loading ? <div className="p-6 bg-[#F3F4F6] rounded">Loading…</div> : (
        <div className="grid gap-4">
          {earnings.length === 0 && <div className="p-6 bg-[#F3F4F6] rounded">No earnings yet</div>}
          {earnings.map((e) => (
            <motion.div key={e.id} whileHover={{ scale: 1.02 }} className="bg-white p-4 rounded-xl shadow border border-gray-100 flex justify-between">
              <div>
                <div className="font-semibold text-[#111827]">{e.rideLabel || `Ride #${e.id}`}</div>
                <div className="text-sm text-gray-500">{new Date(e.date).toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-[#0F4C81] font-semibold">₹{e.amount}</div>
                <div className="text-sm text-gray-500">{e.status}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
