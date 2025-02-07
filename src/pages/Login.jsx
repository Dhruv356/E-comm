import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import "../index.css"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Create the navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/login", { email, password });
      localStorage.setItem("authToken", response.data.token); // Save the JWT token
      alert("Login successful!");
      navigate("/"); // Redirect to home page after successful login (change the path as needed)
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-form">
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
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
