import React from "react";

export default function HelpSupportPage() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center py-10 px-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">Help & Support</h1>
        <p className="text-gray-600 mb-4">
          We’re here to help you with any issue related to your rides, payments, or app usage.
        </p>

        <h2 className="text-xl font-semibold mb-2 text-indigo-500">Frequently Asked Questions</h2>
        <ul className="list-disc list-inside text-gray-700 mb-6">
          <li>How do I book a ride?</li>
          <li>How can I contact my driver?</li>
          <li>What should I do if I left an item in the cab?</li>
          <li>How do I cancel my booking?</li>
        </ul>

        <h2 className="text-xl font-semibold mb-2 text-indigo-500">Contact Support</h2>
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your Name"
            className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <textarea
            placeholder="Describe your issue..."
            rows={4}
            className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold py-3 rounded-xl shadow-md hover:opacity-95"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
