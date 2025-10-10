// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // Tailwind styles
import { AuthProvider } from "./context/AuthContext";
import { RideProvider } from "./context/RideContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RideProvider>
        <App />
      </RideProvider>
    </AuthProvider>
  </React.StrictMode>
);
