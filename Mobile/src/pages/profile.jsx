import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Profile.css";
import { FaHome, FaUser, FaCalendarAlt, FaUsers } from "react-icons/fa";

const Profile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("employee"));
    if (stored) {
      setFormData((prev) => ({
        ...prev,
        firstName: stored.firstName || "",
        lastName: stored.lastName || "",
        email: stored.email || "",
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert("Profile updated (not connected to backend)");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("employee");
    navigate("/");
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>
          Canova<span className="crm-highlight">CRM</span>
        </h2>
        <h3>Profile</h3>
      </div>

      <form className="profile-form" onSubmit={handleSave}>
        <label>First name</label>
        <input
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First name"
        />

        <label>Last name</label>
        <input
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last name"
        />

        <label>Email</label>
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          type="email"
        />

      

        <button type="submit" className="save-btn">Save</button>
        <button type="button" className="logout-btn" onClick={handleLogout}>Logout</button>
      </form>

      <div className="navbar">
        <NavLink to="/home" icon={<FaHome />} label="Home" active={currentPath === "/home"} />
        <NavLink to="/mobleads" icon={<FaUsers />} label="Leads" active={currentPath === "/mobleads"} />
        <NavLink to="/schedule" icon={<FaCalendarAlt />} label="Schedule" active={currentPath === "/schedule"} />
        <NavLink to="/profile" icon={<FaUser />} label="Profile" active={currentPath === "/profile"} />
      </div>
    </div>
  );
};

const NavLink = ({ to, icon, label, active }) => (
  <div className={`nav-item ${active ? "active" : ""}`} onClick={() => window.location.href = to}>
    {icon}
    <span>{label}</span>
  </div>
);

export default Profile;
