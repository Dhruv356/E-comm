import React, { useState } from "react";
import axios from "axios";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordMatch(false);
    } else {
      try {
        // Send user data to the backend
        const response = await axios.post("http://localhost:5000/api/signup", {
          fullName,
          email,
          password,
        });

        // Show success message
        setMessage(response.data.message);
      } catch (error) {
        // Show error message
        setMessage(error.response ? error.response.data.message : "Error signing up");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-form">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="input"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {!passwordMatch && (
              <span className="error-message">Passwords do not match</span>
            )}
          </div>
          <button type="submit" className="login-btn">
            Sign Up
          </button>
        </form>
        {message && <p>{message}</p>}
        <div className="signup-link">
          <p>
            Already have an account?{" "}
            <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
