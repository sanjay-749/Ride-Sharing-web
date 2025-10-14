import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function PaymentPage() {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const navigate = useNavigate();

  const handlePayment = async () => {
    if (!method) {
      alert("Please select a payment method");
      return;
    }

    if (!amount || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      // Create order on backend
      const { data } = await axios.post("http://localhost:8080/create-order", {
        amount: amount,
      });

      const options = {
        key: "YOUR_RAZORPAY_KEY_ID", // from Razorpay Dashboard
        amount: amount * 100,
        currency: "INR",
        name: "RideMart Payments",
        description: "Ride Fare Payment",
        order_id: data.id,
        handler: function (response) {
          alert("✅ Payment Successful!");
          navigate("/history");
        },
        prefill: {
          name: "Sanjay Raj",
          email: "sanjay@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#4F46E5",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("Payment failed to start");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center py-10 px-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
          💳 Payment Gateway
        </h1>

        <input
          type="number"
          placeholder="Enter Amount (₹)"
          className="border rounded-lg p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select
          className="border rounded-lg p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <option value="">Select Payment Method</option>
          <option value="UPI">UPI</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Debit Card">Debit Card</option>
          <option value="Net Banking">Net Banking</option>
        </select>

        <button
          onClick={handlePayment}
          className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold py-3 rounded-xl shadow-md hover:opacity-95 w-full"
        >
          Pay ₹{amount || "0"}
        </button>
      </div>
    </div>
  );
}
