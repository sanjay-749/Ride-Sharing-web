import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function PaymentPage() {
  const [method, setMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Get ride data from navigation state
  const ride = location.state?.ride || {};
  const amount = ride.fare || 0;

  useEffect(() => {
    // If no amount/ride data, redirect back
    if (!amount || !ride.id) {
      alert("No ride data found. Redirecting to home.");
      navigate("/");
    }
  }, [amount, ride.id, navigate]);

  const handlePayment = async () => {
    if (!method) {
      alert("Please select a payment method");
      return;
    }

    setLoading(true);

    try {
      // Get token from localStorage
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        alert("Authentication required");
        setLoading(false);
        return;
      }

      // Update ride status to "completed" and add payment info
      const updateData = {
        status: "completed",
        paymentMethod: method,
        paymentStatus: "completed"
      };

      let response;
      
      try {
        // Option 1: Try with proxy
        response = await fetch(`/api/rides/${ride.id}/complete`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(updateData)
        });
      } catch (proxyError) {
        // Option 2: If proxy fails, try direct
        response = await fetch(`http://localhost:8080/api/rides/${ride.id}/complete`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(updateData)
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        
        if (response.status === 401) {
          throw new Error("Authentication failed. Please login again.");
        } else if (response.status === 404) {
          throw new Error("Ride not found. Please try booking again.");
        } else {
          throw new Error(`Payment failed: ${response.status}`);
        }
      }

      const result = await response.json();
      console.log("✅ Ride completed successfully:", result);
      
      alert("✅ Payment successful! Ride completed.");
      
      // Navigate to homepage after successful payment
      navigate("/", { 
        state: { 
          paymentSuccess: true,
          rideDetails: ride
        } 
      });
      
    } catch (err) {
      console.error("Payment error:", err);
      alert("Error processing payment: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSkipPayment = () => {
    if (window.confirm("Skip payment and mark ride as completed?")) {
      completeRideWithoutPayment();
    }
  };

  const completeRideWithoutPayment = async () => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem("authToken");
      
      const updateData = {
        status: "completed",
        paymentMethod: "Cash",
        paymentStatus: "pending"
      };

      let response;
      
      try {
        response = await fetch(`/api/rides/${ride.id}/complete`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(updateData)
        });
      } catch (error) {
        response = await fetch(`http://localhost:8080/api/rides/${ride.id}/complete`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(updateData)
        });
      }

      if (!response.ok) {
        throw new Error("Failed to complete ride");
      }

      const result = await response.json();
      
      alert("✅ Ride marked as completed with cash payment!");
      
      // Navigate to homepage after skipping payment
      navigate("/", { 
        state: { 
          cashPayment: true,
          rideDetails: ride
        } 
      });
    } catch (err) {
      console.error("Error:", err);
      alert("Error completing ride: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-100 min-h-screen flex flex-col items-center py-10 px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-200">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-indigo-600 mb-2">
            💳 Payment
          </h1>
          <p className="text-gray-600">Complete your ride payment</p>
          {user && (
            <p className="text-sm text-green-600 mt-2">
              Logged in as: {user.email}
            </p>
          )}
        </div>

        {/* Ride Summary */}
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Ride Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">From:</span>
              <span className="font-medium">{ride.pickup?.split(',')[0] || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">To:</span>
              <span className="font-medium">{ride.destination?.split(',')[0] || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Vehicle:</span>
              <span className="font-medium">{ride.vehicle || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ride ID:</span>
              <span className="font-medium">#{ride.id || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-green-600 border-t pt-2 mt-2">
              <span>Total Amount:</span>
              <span>₹{amount}</span>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Payment Method
          </label>
          <div className="grid gap-3">
            {[
              { name: 'Credit Card', icon: '💳' },
              { name: 'Debit Card', icon: '💳' },
              { name: 'UPI', icon: '📱' },
              { name: 'Net Banking', icon: '🏦' },
              { name: 'Cash', icon: '💰' }
            ].map((paymentMethod) => (
              <button
                key={paymentMethod.name}
                onClick={() => setMethod(paymentMethod.name)}
                className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                  method === paymentMethod.name 
                  ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                  : 'border-gray-300 hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{paymentMethod.icon}</span>
                    <span className="font-medium text-gray-800">{paymentMethod.name}</span>
                  </div>
                  {method === paymentMethod.name && (
                    <span className="text-green-500 text-lg">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handlePayment}
            disabled={loading || !method}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing Payment...
              </>
            ) : (
              <>
                <span>💳</span>
                Pay ₹{amount}
              </>
            )}
          </button>

          <button
            onClick={handleSkipPayment}
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                <span>💰</span>
                Pay Cash Later
              </>
            )}
          </button>

          <button
            onClick={handleBackToHome}
            disabled={loading}
            className="w-full text-gray-600 p-3 rounded-xl font-semibold border-2 border-gray-300 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>🏠</span>
            Back to Homepage
          </button>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start space-x-3">
            <span className="text-blue-500 text-lg">🔒</span>
            <div>
              <p className="text-sm font-medium text-blue-800">Secure Payment</p>
              <p className="text-xs text-blue-600 mt-1">
                Your payment information is encrypted and secure. We do not store your card details.
              </p>
            </div>
          </div>
        </div>

        {/* Success Message Preview */}
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 text-center">
            ✅ After payment, you'll be redirected to the homepage where you can view your ride history.
          </p>
        </div>
      </div>
    </div>
  );
}