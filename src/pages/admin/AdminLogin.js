import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import "./AdminLogin.css";

function AdminLogin() {
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    try {
      const storedAdmin = localStorage.getItem("adminSession");
      if (storedAdmin) {
        const session = JSON.parse(storedAdmin);
        // Check if session is still valid (24 hours)
        const sessionTime = new Date(session.timestamp);
        const now = new Date();
        const hoursDiff = (now - sessionTime) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          navigate("/admin/dashboard");
        } else {
          localStorage.removeItem("adminSession");
        }
      }
    } catch {
      localStorage.removeItem("adminSession");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Load admin settings from data.json
      const response = await fetch('/data.json');
      const data = await response.json();
      const correctAccessCode = data.adminSettings?.accessCode || "ADMIN2024";

      // Simulate loading time for better UX
      setTimeout(() => {
        if (accessCode === correctAccessCode) {
          // Create admin session
          const adminSession = {
            isAuthenticated: true,
            timestamp: new Date().toISOString(),
            role: "admin"
          };
          
          localStorage.setItem("adminSession", JSON.stringify(adminSession));
          navigate("/admin/dashboard");
        } else {
          setError("Invalid access code. Please try again.");
        }
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error loading admin settings:', error);
      setError("System error. Please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-icon">
            <FaLock />
          </div>
          <h2>Admin Access</h2>
          <p>Enter your access code to continue</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="input-group">
            <div className="input-icon">
              <FaUser />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Access Code"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              required
              disabled={isLoading}
              className="admin-input"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          
          <button 
            type="submit" 
            className={`admin-login-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Verifying...
              </>
            ) : (
              'Access Admin Panel'
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          <p>
            <a href="/" className="back-to-site">← Back to Website</a>
          </p>
          <div className="security-note">
            <small>🔒 Secure admin access protected by access code</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
