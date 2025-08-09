import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // ✅ Import dedicated CSS

function Login() {
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const users = [
    { username: "Manager", password: "2341" },
    { username: "Ndaji Senior", password: "123456" },
    { username: "Ndagi Junior", password: "567890" },
  ];

  // ✅ Auto-redirect if already logged in
  useEffect(() => {
    try {
      const storedAttendant = localStorage.getItem("attendant");
      if (storedAttendant) {
        JSON.parse(storedAttendant); // Validate JSON
        navigate("/dashboard");
      }
    } catch {
      localStorage.removeItem("attendant"); // Clear invalid session
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find((u) => u.password === userId);

    if (user) {
      localStorage.setItem("attendant", JSON.stringify({ username: user.username }));
      navigate("/dashboard");
    } else {
      setError("Invalid User ID! Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>🛒 POS Attendant Login</h2>
        <p className="login-subtitle">Enter your User ID to continue</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
