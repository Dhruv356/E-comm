import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../index.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error before new request

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
        role,
      });

      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("userRole", role);
      

      alert("Login successful!");
      navigate("/");
      window.location.reload(); // Refresh the page
    } catch (err) {
      if (!err.response) {
        setError("Server is unreachable. Please check backend connection.");
      } else {
        setError(err.response.data.message || "Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-form">
        <h2>Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="dropdown">
            <label>Select Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
        <div className="signup-link">
          <p>
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
