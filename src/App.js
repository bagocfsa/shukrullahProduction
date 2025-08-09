import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./Dashboard.js";
import ManageSales from "./pages/ManageSales.js";
import ManageProducts from "./pages/ManageProducts";
// import POS from "./pages/POS";
import KulikuliProduction from "./pages/KulikuliProduction";
import ManageReceiptPage from "./pages/ManageReceiptPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  useEffect(() => {
    // Automatic dark mode detection
    const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-sales"
        element={
          <ProtectedRoute>
            <ManageSales />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-products"
        element={
          <ProtectedRoute>
            <ManageProducts />
          </ProtectedRoute>
        }
      />
      {/* <Route
        path="/pos"
        element={
          <ProtectedRoute>
            <POS />
          </ProtectedRoute>
        }
      /> */}
      <Route
        path="/kulikuli-production"
        element={
          <ProtectedRoute>
            <KulikuliProduction />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-receipt"
        element={
          <ProtectedRoute>
            <ManageReceiptPage />
          </ProtectedRoute>
        }
      />
      {/* Catch-all */}
    </Routes>
  );
}

export default App;
// Cleaned up duplicate and malformed code below
