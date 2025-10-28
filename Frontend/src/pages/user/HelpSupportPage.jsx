import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function HelpSupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Pre-fill user data if authenticated
  React.useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || user.email?.split('@')[0] || "",
        email: user.email || ""
      }));
    }
  }, [isAuthenticated, user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setMessage("❌ Please fill in all fields");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/help-support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Failed to submit support ticket");
      }

      const result = await response.json();
      
      setMessage("✅ Support ticket submitted successfully! We'll get back to you soon.");
      setFormData({
        name: user?.name || user?.email?.split('@')[0] || "",
        email: user?.email || "",
        subject: "",
        message: ""
      });
    } catch (err) {
      console.error("Error submitting support ticket:", err);
      setMessage("❌ Failed to submit support ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const faqItems = [
    {
      question: "How do I book a ride?",
      answer: "Go to the Book Ride page, enter your pickup and destination locations, select your vehicle type, and confirm your booking."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept Credit/Debit cards, UPI, Net Banking, and Cash payments."
    },
    {
      question: "Can I cancel my ride after booking?",
      answer: "Yes, you can cancel your ride from the Track Ride page before the driver arrives. Cancellation fees may apply."
    },
    {
      question: "How is the fare calculated?",
      answer: "Fare is calculated based on distance, time, and vehicle type. You'll see the estimated fare before confirming your ride."
    },
    {
      question: "What if I left something in the vehicle?",
      answer: "Contact support immediately with your ride details and we'll help you connect with the driver."
    }
  ];

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-600 mb-4">🛟 Help & Support</h1>
          <p className="text-gray-600 text-lg">We're here to help you with any issues or questions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Support</h2>
            
            {message && (
              <div className={`p-4 rounded-xl mb-6 ${
                message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Brief description of your issue"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Please describe your issue in detail..."
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  "Submit Ticket"
                )}
              </button>
            </form>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {faqItems.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-800 mb-2">Q: {faq.question}</h3>
                  <p className="text-gray-600 text-sm">A: {faq.answer}</p>
                </div>
              ))}
            </div>

            {/* Emergency Contact */}
            <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-xl">
              <h3 className="font-bold text-red-700 mb-2">🚨 Emergency Contact</h3>
              <p className="text-red-600 text-sm">
                For urgent safety issues, call our 24/7 support line: 
                <strong> +91-9876543210</strong>
              </p>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 space-y-3">
              <button
                onClick={() => navigate("/book-ride")}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-300"
              >
                🚗 Book a Ride Now
              </button>
              <button
                onClick={() => navigate("/history")}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                📜 View Ride History
              </button>
            </div>
          </div>
        </div>

        {/* Support Info */}
        <div className="mt-8 bg-indigo-50 rounded-2xl p-6 text-center">
          <h3 className="text-lg font-semibold text-indigo-700 mb-2">📞 Need Immediate Help?</h3>
          <p className="text-indigo-600">
            Our support team typically responds within 2-4 hours. 
            <br />
            You can also email us at: <strong>support@ridemart.com</strong>
          </p>
        </div>
      </div>
    </div>
  );
}