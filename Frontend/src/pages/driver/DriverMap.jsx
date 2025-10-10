// src/pages/driver_module/DriverMap.jsx
import React, { useEffect, useRef } from "react";

export default function DriverMap({ driverLocation = { lat: 12.9716, lng: 77.5946 } }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const directionsRenderer = useRef(null);

  useEffect(() => {
    const initMap = async () => {
      const { Map } = await window.google.maps.importLibrary("maps");
      const { DirectionsService, DirectionsRenderer } = await window.google.maps.importLibrary("routes");

      const map = new Map(mapRef.current, {
        center: driverLocation,
        zoom: 14,
        disableDefaultUI: true,
        styles: [
          {
            featureType: "all",
            elementType: "geometry",
            stylers: [{ color: "#e8f0ff" }],
          },
          {
            featureType: "water",
            elementType: "geometry.fill",
            stylers: [{ color: "#b3d1ff" }],
          },
          {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#6ba4ff" }],
          },
        ],
      });

      const marker = new window.google.maps.Marker({
        position: driverLocation,
        map,
        icon: {
          url: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
          scaledSize: new window.google.maps.Size(40, 40),
        },
      });
      markerRef.current = marker;

      directionsRenderer.current = new DirectionsRenderer({
        map,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "#0044cc",
          strokeWeight: 5,
        },
      });

      // Optional — show sample route
      const service = new DirectionsService();
      service.route(
        {
          origin: driverLocation,
          destination: { lat: 12.9352, lng: 77.6245 }, // sample route
          travelMode: "DRIVING",
        },
        (result, status) => {
          if (status === "OK") directionsRenderer.current.setDirections(result);
        }
      );

      // Animate marker movement (demo)
      animateMarker(marker, map);
    };

    if (window.google && window.google.maps) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=geometry,places`;
      script.async = true;
      script.onload = initMap;
      document.body.appendChild(script);
    }
  }, [driverLocation]);

  const animateMarker = (marker, map) => {
    let deltaLat = 0.0003;
    let deltaLng = 0.0002;
    let direction = 1;

    setInterval(() => {
      const pos = marker.getPosition();
      const newPos = {
        lat: pos.lat() + deltaLat * direction,
        lng: pos.lng() + deltaLng * direction,
      };
      marker.setPosition(newPos);
      map.panTo(newPos);
      if (Math.random() > 0.95) direction *= -1; // reverse direction occasionally
    }, 2000);
  };

  return (
    <div className="w-full h-[85vh] rounded-2xl shadow-xl border border-blue-100 overflow-hidden mt-4">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
