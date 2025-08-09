// src/components/Header.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Header.css";

function Header({ attendantName }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ Close menu on window resize (if desktop)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("attendant");
      navigate("/login"); // ✅ Redirect to login
    }
  };

  const navigateTo = (path) => {
    if (location.pathname !== path) navigate(path);
    setMenuOpen(false); // Close mobile menu on navigation
  };

  return (
    <header className="pos-header">
      {/* Left Side (Brand & Attendant) */}
      <div className="header-left">
        <h2 className="brand-name" onClick={() => navigateTo("/dashboard")}>
          Shukurullah Nig. Ltd
        </h2>
        <span className="attendant-name">
          👤 {attendantName || "Guest"}
        </span>
      </div>

      {/* Navigation Links */}
      <nav className={`header-nav ${menuOpen ? "open" : ""}`}>
        <button
          className={location.pathname === "/dashboard" ? "active" : ""}
          onClick={() => navigateTo("/dashboard")}
        >
          Dashboard
        </button>
        <button
          className={location.pathname === "/manage-sales" ? "active" : ""}
          onClick={() => navigateTo("/manage-sales")}
        >
          Sales
        </button>
        {/* <button
          className={location.pathname === "/pos" ? "active" : ""}
          onClick={() => navigateTo("/pos")}
        >
          POS
        </button> */}
        <button
          className={location.pathname === "/manage-products" ? "active" : ""}
          onClick={() => navigateTo("/manage-products")}
        >
          Products
        </button>
        <button
          className={location.pathname === "/kulikuli-production" ? "active" : ""}
          onClick={() => navigateTo("/kulikuli-production")}
        >
          Manage Production
        </button>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      {/* Mobile Menu Icon */}
      <div
        className={`menu-toggle ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>
    </header>
  );
}

export default Header;
