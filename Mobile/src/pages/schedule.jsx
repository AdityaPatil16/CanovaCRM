import React, { useEffect, useState } from "react";
import {
  FaHome,
  FaUser,
  FaCalendarAlt,
  FaUsers,
  FaSearch,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import "./schedule.css";
import filterIcon from "../assets/filter.png"; // ✅ adjust path if needed

const Schedule = () => {
  const [leads, setLeads] = useState([]);
  const [filterOption, setFilterOption] = useState("All");
  const [showOptions, setShowOptions] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchScheduledLeads = async () => {
      const employee = JSON.parse(localStorage.getItem("employee"));
      if (!employee) return;

      try {
        const res = await fetch(
          `http://localhost:5000/api/leads/scheduled?employeeId=${employee._id}`
        );
        const data = await res.json();

        // ✅ Fix: safely compare assignedTo._id or string
        const filtered = data.filter(
          (lead) =>
            (typeof lead.assignedTo === "string" &&
              lead.assignedTo === employee._id) ||
            (typeof lead.assignedTo === "object" &&
              lead.assignedTo._id === employee._id)
        );

        const today = new Date().toISOString().split("T")[0];
        const finalLeads =
          filterOption === "Today"
            ? filtered.filter(
                (lead) => lead.date && lead.date.startsWith(today)
              )
            : filtered;

        setLeads(finalLeads);
      } catch (err) {
        console.error("❌ Error fetching scheduled leads:", err);
      }
    };

    fetchScheduledLeads();
  }, [filterOption]);

  return (
    <div className="schedule-container">
      <div className="schedule-header">
        <h2>
          Canova<span className="crm-highlight">CRM</span>
        </h2>
        <h3>Schedule</h3>
      </div>

      <div className="search-filter-row">
        <div className="search-box">
          <FaSearch />
          <input type="text" placeholder="Search" />
        </div>
        <div className="filter-container">
          <button
            className="filter-btn"
            onClick={() => setShowOptions(!showOptions)}
          >
            <img src={filterIcon} alt="Filter" className="filter-icon" />
          </button>
          {showOptions && (
            <div className="filter-dropdown">
              <div
                onClick={() => {
                  setFilterOption("All");
                  setShowOptions(false);
                }}
              >
                All
              </div>
              <div
                onClick={() => {
                  setFilterOption("Today");
                  setShowOptions(false);
                }}
              >
                Today
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="schedule-list">
        {leads.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            No scheduled leads found.
          </p>
        ) : (
          leads.map((lead, idx) => (
            <div
              key={idx}
              className={`schedule-card ${idx === 0 ? "highlight" : ""}`}
            >
              <div className="schedule-top">
                <span className="call-type">
                  {lead.type
                    ? lead.type.charAt(0).toUpperCase() + lead.type.slice(1)
                    : "Referral"}
                </span>
                <span className="date">{lead.date || "--/--/----"}</span>
              </div>
              <div className="mobile">{lead.phone || "--"}</div>
              <div className="call-info">
                <FaMapMarkerAlt />
                <span>Call</span>
              </div>
              <div className="user-info">
                <img
                  src={lead.avatar || "/default-avatar.png"}
                  alt="avatar"
                  className="avatar"
                />
                <span>{lead.name}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="navbar">
        <Link
          to="/home"
          className={`nav-item ${location.pathname === "/home" ? "active" : ""}`}
        >
          <FaHome />
          <span>Home</span>
        </Link>
        <Link
          to="/mobleads"
          className={`nav-item ${
            location.pathname === "/mobleads" ? "active" : ""
          }`}
        >
          <FaUsers />
          <span>Leads</span>
        </Link>
        <Link
          to="/schedule"
          className={`nav-item ${
            location.pathname === "/schedule" ? "active" : ""
          }`}
        >
          <FaCalendarAlt />
          <span>Schedule</span>
        </Link>
        <Link
          to="/profile"
          className={`nav-item ${
            location.pathname === "/profile" ? "active" : ""
          }`}
        >
          <FaUser />
          <span>Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default Schedule;
