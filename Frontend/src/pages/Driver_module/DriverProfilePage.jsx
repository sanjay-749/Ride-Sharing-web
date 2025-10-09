import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { updateDriverProfile } from "../../services/driverService";

const DriverProfilePage = () => {
  const { driver, token, login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: driver?.name || "",
    email: driver?.email || "",
    phone: driver?.phone || "",
  });

  const [success, setSuccess] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedDriver = await updateDriverProfile(formData, token);
    login(updatedDriver, token);
    setSuccess("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-background p-6 flex justify-center">
      <div className="card w-full max-w-md">
        <h2 className="text-2xl font-bold text-primary mb-4">Driver Profile</h2>
        {success && <p className="text-success mb-2">{success}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            className="input"
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            className="input"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            className="input"
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn-primary w-full">Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default DriverProfilePage;
