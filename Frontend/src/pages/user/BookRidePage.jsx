import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const mapContainerStyle = {
  width: "100%",
  height: "200px",
  borderRadius: "15px",
  border: "1px solid #ccc"
};

export default function BookRidePage() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [fare, setFare] = useState(null);
  const [vehicle, setVehicle] = useState("");
  const [step, setStep] = useState(1);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mapImage, setMapImage] = useState("");
  const [debugInfo, setDebugInfo] = useState("");

  const navigate = useNavigate();
  const pickupRef = useRef(null);
  const destinationRef = useRef(null);

  // Fetch suggestions from OpenStreetMap Nominatim API
  const fetchSuggestions = async (query, setSuggestions) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=in`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error(err);
      setSuggestions([]);
    }
  };

  // Generate static map image when coordinates change
  useEffect(() => {
    if (pickupCoords && destinationCoords) {
      const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=400x200&markers=color:blue%7Clabel:P%7C${pickupCoords.lat},${pickupCoords.lng}&markers=color:red%7Clabel:D%7C${destinationCoords.lat},${destinationCoords.lng}&path=color:0x0000ff80|weight:5|${pickupCoords.lat},${pickupCoords.lng}|${destinationCoords.lat},${destinationCoords.lng}&key=YOUR_GOOGLE_MAPS_KEY`;
      setMapImage(mapUrl);
    } else if (pickupCoords || destinationCoords) {
      const coords = pickupCoords || destinationCoords;
      const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=400x200&markers=color:green%7C${coords.lat},${coords.lng}&zoom=13&key=YOUR_GOOGLE_MAPS_KEY`;
      setMapImage(mapUrl);
    } else {
      setMapImage("");
    }
  }, [pickupCoords, destinationCoords]);

  // Debounced pickup suggestions
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (pickup) fetchSuggestions(pickup, setPickupSuggestions);
      else setPickupSuggestions([]);
    }, 300);
    return () => clearTimeout(timeout);
  }, [pickup]);

  // Debounced destination suggestions
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (destination) fetchSuggestions(destination, setDestinationSuggestions);
      else setDestinationSuggestions([]);
    }, 300);
    return () => clearTimeout(timeout);
  }, [destination]);

  const handlePlaceSelect = (place, type) => {
    const coords = { lat: parseFloat(place.lat), lng: parseFloat(place.lon) };
    if (type === "pickup") {
      setPickup(place.display_name);
      setPickupCoords(coords);
      setShowPickupSuggestions(false);
    } else {
      setDestination(place.display_name);
      setDestinationCoords(coords);
      setShowDestinationSuggestions(false);
    }
  };

  // Simple Haversine distance calculation
  const calculateDistance = (c1, c2) => {
    if (!c1 || !c2) return 5; // default 5km
    const R = 6371;
    const dLat = (c2.lat - c1.lat) * Math.PI / 180;
    const dLon = (c2.lng - c1.lng) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(c1.lat * Math.PI / 180) *
      Math.cos(c2.lat * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!pickup || !destination) {
      alert("Please enter both pickup and destination locations");
      return;
    }
    if (!pickupCoords || !destinationCoords) {
      alert("Please select valid locations from the suggestions");
      return;
    }
    
    const distance = calculateDistance(pickupCoords, destinationCoords);
    const calculatedFare = Math.max(50, Math.floor(distance * 15));
    setFare(calculatedFare);
    setStep(2);
  };

  const handleConfirmBooking = async () => {
    if (!vehicle) {
      alert("Please select a vehicle type");
      return;
    }

    setLoading(true);
    setDebugInfo("Starting booking process...");

    const rideData = {
      pickup,
      destination,
      pickupLat: pickupCoords.lat,
      pickupLng: pickupCoords.lng,
      destinationLat: destinationCoords.lat,
      destinationLng: destinationCoords.lng,
      vehicle,
      fare,
      userId: 1
    };

    console.log("Sending ride data:", rideData);
    setDebugInfo("Sending request to /api/rides...");

    try {
      // TEST BOTH OPTIONS - Try proxy first, then direct
      let res;
      let usedProxy = true;
      
      try {
        // Option 1: Try with proxy (remove localhost:8080)
        setDebugInfo("Trying proxy: /api/rides");
        res = await fetch("/api/rides", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
          },
          body: JSON.stringify(rideData)
        });
      } catch (proxyError) {
        // Option 2: If proxy fails, try direct
        setDebugInfo("Proxy failed, trying direct: http://localhost:8080/api/rides");
        usedProxy = false;
        res = await fetch("http://localhost:8080/api/rides", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
          },
          body: JSON.stringify(rideData)
        });
      }

      console.log("Response status:", res.status);
      console.log("Response headers:", res.headers);
      setDebugInfo(`Response status: ${res.status}, Used proxy: ${usedProxy}`);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server error details:", errorText);
        setDebugInfo(`Error ${res.status}: ${errorText}`);
        
        if (res.status === 403) {
          throw new Error("Access forbidden. Check CORS configuration on server.");
        } else if (res.status === 404) {
          throw new Error("Endpoint not found. Check if backend is running.");
        } else if (res.status === 500) {
          throw new Error("Server error. Check backend logs.");
        } else {
          throw new Error(`Server returned: ${res.status} - ${errorText}`);
        }
      }

      const ride = await res.json();
      console.log("Ride created successfully:", ride);
      setDebugInfo("✅ Ride booked successfully!");
      
      alert("✅ Ride booked successfully!");
      navigate("/track", { state: { ride } });
    } catch (err) {
      console.error("Booking error:", err);
      setDebugInfo(`❌ Error: ${err.message}`);
      alert("Error booking ride: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Temporary mock function for testing
  const handleMockBooking = () => {
    setLoading(true);
    setDebugInfo("Using mock booking...");
    
    // Create mock ride data
    const mockRide = {
      id: Math.floor(Math.random() * 1000),
      pickup,
      destination,
      pickupLat: pickupCoords.lat,
      pickupLng: pickupCoords.lng,
      destinationLat: destinationCoords.lat,
      destinationLng: destinationCoords.lng,
      vehicle,
      fare,
      userId: 1,
      status: "Driver on the way 🚕"
    };

    console.log("Mock ride data:", mockRide);
    
    // Simulate API call delay
    setTimeout(() => {
      alert("✅ Ride booked successfully! (Mock)");
      setDebugInfo("✅ Mock booking successful!");
      navigate("/track", { state: { ride: mockRide } });
      setLoading(false);
    }, 1500);
  };

  const renderMapPreview = () => {
    if (mapImage) {
      return (
        <div style={mapContainerStyle} className="overflow-hidden">
          <img 
            src={mapImage} 
            alt="Route Map" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      );
    }

    return (
      <div style={mapContainerStyle} className="bg-gray-100 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">🗺️</div>
          <p className="text-sm">Map will appear here</p>
          <p className="text-xs mt-1">Select pickup and destination</p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex justify-center items-center py-8 px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-600 mb-2">🚖 Book a Ride</h1>
          <p className="text-gray-600">Quick, safe, and reliable rides</p>
        </div>

        {/* Debug Info */}
        {debugInfo && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">{debugInfo}</p>
          </div>
        )}

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
              1
            </div>
            <div className={`w-16 h-1 ${step === 1 ? 'bg-gray-300' : 'bg-indigo-600'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
              2
            </div>
          </div>
        </div>

        {/* Step 1: Pickup & Destination */}
        {step === 1 && (
          <form onSubmit={handleSearch} className="flex flex-col gap-6">
            <div className="space-y-4">
              {/* Pickup Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📍 Pickup Location
                </label>
                <input
                  ref={pickupRef}
                  type="text"
                  placeholder="Where are you now?"
                  value={pickup}
                  onChange={e => setPickup(e.target.value)}
                  onFocus={() => setShowPickupSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowPickupSuggestions(false), 200)}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 outline-none"
                  required
                />
                {showPickupSuggestions && pickupSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-300 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                    {pickupSuggestions.map(place => (
                      <div
                        key={place.place_id}
                        className="p-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                        onMouseDown={() => handlePlaceSelect(place, "pickup")}
                      >
                        <div className="font-medium text-gray-800 flex items-start">
                          <span className="text-indigo-500 mr-2">📍</span>
                          {place.display_name.split(',')[0]}
                        </div>
                        <div className="text-sm text-gray-500 ml-4 mt-1">
                          {place.display_name.split(',').slice(1, 3).join(',')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Destination Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🎯 Destination
                </label>
                <input
                  ref={destinationRef}
                  type="text"
                  placeholder="Where do you want to go?"
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  onFocus={() => setShowDestinationSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowDestinationSuggestions(false), 200)}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 outline-none"
                  required
                />
                {showDestinationSuggestions && destinationSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-300 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                    {destinationSuggestions.map(place => (
                      <div
                        key={place.place_id}
                        className="p-3 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                        onMouseDown={() => handlePlaceSelect(place, "destination")}
                      >
                        <div className="font-medium text-gray-800 flex items-start">
                          <span className="text-green-500 mr-2">🎯</span>
                          {place.display_name.split(',')[0]}
                        </div>
                        <div className="text-sm text-gray-500 ml-4 mt-1">
                          {place.display_name.split(',').slice(1, 3).join(',')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Map Preview */}
            <div className="mt-2">
              {renderMapPreview()}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg"
              disabled={!pickup || !destination || !pickupCoords || !destinationCoords}
            >
              🚗 View Fare & Vehicle Options
            </button>
          </form>
        )}

        {/* Step 2: Fare & Vehicle Selection */}
        {step === 2 && (
          <div className="flex flex-col gap-6">
            {/* Fare Display */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl border border-green-200 text-center">
              <p className="text-lg text-gray-700 mb-2">Estimated Fare</p>
              <p className="text-4xl font-bold text-green-600">₹{fare}</p>
              <div className="text-sm text-gray-500 mt-3 space-y-1">
                <p>📍 <span className="font-medium">From:</span> {pickup.split(',')[0]}</p>
                <p>🎯 <span className="font-medium">To:</span> {destination.split(',')[0]}</p>
              </div>
            </div>

            {/* Vehicle Selection */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-gray-700 text-center">
                🚗 Select Your Ride
              </label>
              
              <div className="grid gap-3">
                <button
                  type="button"
                  onClick={() => setVehicle("Mini")}
                  className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                    vehicle === "Mini" 
                    ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                    : 'border-gray-300 hover:border-indigo-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-gray-800">🚗 Mini</div>
                      <div className="text-sm text-gray-600">Affordable, compact ride</div>
                    </div>
                    <div className="font-bold text-lg text-indigo-600">₹{fare}</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setVehicle("Sedan")}
                  className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                    vehicle === "Sedan" 
                    ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                    : 'border-gray-300 hover:border-indigo-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-gray-800">🚘 Sedan</div>
                      <div className="text-sm text-gray-600">Comfortable, spacious</div>
                    </div>
                    <div className="font-bold text-lg text-indigo-600">₹{fare + 20}</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setVehicle("SUV")}
                  className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                    vehicle === "SUV" 
                    ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                    : 'border-gray-300 hover:border-indigo-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-gray-800">🚙 SUV</div>
                      <div className="text-sm text-gray-600">Luxury, extra space</div>
                    </div>
                    <div className="font-bold text-lg text-indigo-600">₹{fare + 40}</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleConfirmBooking}
                disabled={loading || !vehicle}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing Booking...
                  </>
                ) : (
                  <>
                    <span>✅</span>
                    Confirm & Book Ride
                  </>
                )}
              </button>

              {/* Mock booking button for testing */}
              <button
                onClick={handleMockBooking}
                disabled={loading || !vehicle}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-3 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
              >
                🧪 Test Mock Booking
              </button>

              <button
                onClick={() => setStep(1)}
                className="w-full text-indigo-600 p-3 rounded-xl font-semibold border-2 border-indigo-200 hover:bg-indigo-50 transition-all duration-200"
              >
                ← Back to Locations
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}