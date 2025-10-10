import React, { useEffect, useState, useContext } from "react";
import { getDriverProfile, updateDriverProfile } from "../../services/driverService";
import { AuthContext } from "../../context/AuthContext";
import { motion } from "framer-motion";

export default function DriverProfilePage() {
  const { driver, refreshProfile } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", vehicle: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDriverProfile();
        setForm({ name: data.name || "", email: data.email || "", vehicle: data.vehicle || "" });
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateDriverProfile(form);
      await refreshProfile();
      alert("Saved");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 flex items-center justify-center">
      <motion.form initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} onSubmit={onSubmit} className="w-full max-w-md bg-[#F3F4F6] p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-[#1E3A8A] mb-4">Profile</h2>
        <input name="name" value={form.name} onChange={onChange} className="w-full p-3 mb-3 rounded border" placeholder="Full name" />
        <input name="email" value={form.email} onChange={onChange} className="w-full p-3 mb-3 rounded border" placeholder="Email" />
        <input name="vehicle" value={form.vehicle} onChange={onChange} className="w-full p-3 mb-3 rounded border" placeholder="Vehicle info" />
        <button type="submit" className="w-full py-3 bg-[#1E3A8A] text-white rounded-md">{loading ? "Saving..." : "Save changes"}</button>
      </motion.form>
    </div>
  );
}
