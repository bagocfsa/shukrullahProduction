import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  try {
    const storedAdmin = localStorage.getItem("adminSession");
    if (storedAdmin) {
      const session = JSON.parse(storedAdmin);

      // Check if session is still valid (24 hours)
      const sessionTime = new Date(session.timestamp);
      const now = new Date();
      const hoursDiff = (now - sessionTime) / (1000 * 60 * 60);

      if (hoursDiff < 24 && session.isAuthenticated) {
        return children; // ✅ Authorized
      } else {
        localStorage.removeItem("adminSession"); // Remove expired session
      }
    }
  } catch {
    localStorage.removeItem("adminSession"); // Remove corrupted session
  }
  return <Navigate to="/admin/login" />; // ✅ Redirect unauthorized users
};

export default ProtectedRoute;
