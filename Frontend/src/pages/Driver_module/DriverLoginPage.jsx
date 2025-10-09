import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { driverLogin } from "../../services/driverService";
import { useNavigate } from "react-router-dom";
const DriverLoginPage = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await driverLogin({ email, password });
      login(res.driver, res.token);
      navigate("/driver/dashboard");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Driver Login</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default DriverLoginPage;
