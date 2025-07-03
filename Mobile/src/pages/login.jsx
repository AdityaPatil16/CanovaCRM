import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // This is lastName
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Authenticate using email + lastName as password
      const res = await axios.post("http://localhost:5000/api/employees/login", {
        email,
        password, // 👈 lastName
      });

      const employee = res.data.employee;
      const employeeId = employee.id || employee._id;

      const currentDate = new Date().toISOString().split("T")[0];
      const currentTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      // 🔐 Store token & employee in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("employee", JSON.stringify(employee));

      // 🔍 Create a unique tab key to track session
      const tabKey = `tab-${Date.now()}`;
      localStorage.setItem("tabKey", tabKey);
      localStorage.setItem(tabKey, "open");

      // ✅ Mark Check-in
      await axios.post("http://localhost:5000/api/attendance/checkin", {
        employeeId,
        date: currentDate,
        time: currentTime,
      });

      // ✅ Set employee status to Active
      await axios.post("http://localhost:5000/api/employees/status", {
        employeeId,
        status: "Active",
      });

      // Navigate to home
      navigate("/home");
    } catch (err) {
      console.error("❌ Login Error:", err);
      if (err.response?.status === 401) {
        setError("Invalid email or last name");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>
            Canova<span className="highlight">CRM</span>
          </h1>
          <p>Welcome Back!</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          {error && <p className="error">{error}</p>}

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
              placeholder="Enter your last name"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
