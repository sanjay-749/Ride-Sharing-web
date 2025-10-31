import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PostRidePage() {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please give a rating before submitting!");
      return;
    }
    alert("🎉 Thanks for your feedback!");
    navigate("/ride-history");
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center py-10 px-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
          ⭐ Rate Your Ride
        </h1>

        <div className="text-center mb-6">
          <p className="text-gray-700 mb-2">How was your ride experience?</p>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-3xl ${
                  star <= rating ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            placeholder="Share your feedback (optional)"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="4"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold py-3 rounded-xl shadow-md hover:opacity-95"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
}
