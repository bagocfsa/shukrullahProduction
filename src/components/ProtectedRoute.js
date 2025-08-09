// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  try {
    const storedAttendant = localStorage.getItem("attendant");
    if (storedAttendant) {
      JSON.parse(storedAttendant); // Validate JSON
      return children; // ✅ Authorized
    }
  } catch {
    localStorage.removeItem("attendant"); // Remove corrupted session
  }
  return <Navigate to="/login" />; // ✅ Redirect unauthorized users
};

export default ProtectedRoute;
