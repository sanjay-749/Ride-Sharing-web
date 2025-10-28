import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("user");
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: "🚗",
      title: "Quick Booking",
      description: "Book a ride in just a few taps"
    },
    {
      icon: "💰",
      title: "Best Prices",
      description: "Competitive fares with no surge pricing"
    },
    {
      icon: "🛡️",
      title: "Safe Rides",
      description: "Verified drivers and real-time tracking"
    },
    {
      icon: "⭐",
      title: "5-Star Service",
      description: "Rated excellent by thousands of users"
    }
  ];

  const driverBenefits = [
    {
      icon: "💵",
      title: "Earn More",
      description: "Higher earnings with flexible schedules"
    },
    {
      icon: "🕒",
      title: "Flexible Hours",
      description: "Work whenever you want, full or part time"
    },
    {
      icon: "👥",
      title: "Meet People",
      description: "Connect with passengers across the city"
    },
    {
      icon: "🚙",
      title: "Vehicle Support",
      description: "Get help with vehicle maintenance and financing"
    }
  ];

  const handleUserLogin = () => {
    navigate("/login", { state: { role: "user" } });
  };

  const handleDriverLogin = () => {
    navigate("/login", { state: { role: "driver" } });
  };

  const stats = [
    { number: "50K+", label: "Happy Riders" },
    { number: "10K+", label: "Verified Drivers" },
    { number: "100+", label: "Cities" },
    { number: "4.9★", label: "Rating" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Enhanced Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' 
          : 'bg-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">🚗</span>
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                RideMart
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-8 items-center">
              <Link 
                to="/login" 
                className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200 flex items-center gap-2 group"
              >
                <span className="group-hover:scale-110 transition-transform">🔐</span>
                Login
              </Link>
              <Link 
                to="/signup" 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-2 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <span>✨</span>
                Sign Up
              </Link>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Link
                to="/login"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 text-sm"
              >
                <span>🔐</span>
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className={`text-5xl sm:text-6xl font-extrabold mb-6 transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Ride Smarter,
            </span>
            <br />
            <span className="text-gray-800">Drive Better</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Join India's fastest growing ride-sharing platform. Whether you need a ride or want to earn by driving, 
            RideMart connects you with the best opportunities in your city.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white/50 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <div className="text-2xl font-bold text-indigo-600">{stat.number}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Module Selection */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
            {/* Tab Selection */}
            <div className="max-w-md mx-auto mb-8">
              <div className="bg-gray-100 rounded-2xl p-2 inline-flex">
                <button
                  onClick={() => setActiveTab("user")}
                  className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                    activeTab === "user"
                      ? "bg-white text-gray-900 shadow-lg transform scale-105"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`}
                >
                  👤 I Need a Ride
                </button>
                <button
                  onClick={() => setActiveTab("driver")}
                  className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                    activeTab === "driver"
                      ? "bg-white text-gray-900 shadow-lg transform scale-105"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`}
                >
                  🚗 I Want to Drive
                </button>
              </div>
            </div>

            {/* Dynamic Content */}
            {activeTab === "user" ? (
              <div className={`transition-all duration-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                <h2 className="text-center text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
                  Get Where You Need to Go 🚀
                </h2>
                <p className="text-gray-600 text-center mb-8 text-lg max-w-2xl mx-auto">
                  Book rides instantly, track your driver in real-time, and enjoy safe, comfortable journeys at affordable prices.
                </p>
                
                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {features.map((feature, index) => (
                    <div 
                      key={index}
                      className="text-center p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-100 group"
                    >
                      <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-200">
                        {feature.icon}
                      </div>
                      <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleUserLogin}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 text-lg group"
                  >
                    <span className="group-hover:scale-110 transition-transform">🚘</span>
                    Book a Ride Now
                  </button>
                  <Link
                    to="/signup"
                    className="bg-white text-gray-800 border-2 border-indigo-200 font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 text-lg group hover:border-indigo-300"
                  >
                    <span className="group-hover:scale-110 transition-transform">✨</span>
                    Create User Account
                  </Link>
                </div>
              </div>
            ) : (
              <div className={`transition-all duration-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                <h2 className="text-center text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-6">
                  Start Earning Today 🚗
                </h2>
                <p className="text-gray-600 text-center mb-8 text-lg max-w-2xl mx-auto">
                  Join thousands of drivers who are earning great money with flexible schedules and full control over their time.
                </p>
                
                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {driverBenefits.map((benefit, index) => (
                    <div 
                      key={index}
                      className="text-center p-6 bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-100 group"
                    >
                      <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-200">
                        {benefit.icon}
                      </div>
                      <h3 className="font-bold text-gray-800 mb-2">{benefit.title}</h3>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleDriverLogin}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 text-lg group"
                  >
                    <span className="group-hover:scale-110 transition-transform">🚗</span>
                    Start Driving
                  </button>
                  <Link
                    to="/driver-signup"
                    className="bg-white text-gray-800 border-2 border-orange-200 font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 text-lg group hover:border-orange-300"
                  >
                    <span className="group-hover:scale-110 transition-transform">📝</span>
                    Apply as Driver
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-indigo-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-indigo-600 font-bold">🚗</span>
              </div>
              <div className="text-2xl font-bold text-white">RideMart</div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md mx-auto">
              Revolutionizing urban mobility with safe, affordable, and reliable ride-sharing services.
            </p>
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} RideMart Technologies | Making every journey memorable 🌟
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}